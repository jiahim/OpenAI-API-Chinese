# 为 AWS 配置工作负载身份联合

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在以下任一场景中，将 AWS 用作工作负载身份提供方：

- **AWS 出站身份联合：** 将由 AWS STS 颁发的 OIDC JWT 从 `GetWebIdentityToken` 换取一个短时效的 OpenAI 访问令牌。
- **Amazon EKS：** 将投射的 Amazon EKS 服务账号令牌换取为短时效的 OpenAI 访问令牌。

对于 Codex，使用本页获取并检查 AWS token。然后 [配置 Codex workload identity](https://developers.openai.com/codex/enterprise/workload-identity) 将该 token 写入文件并指向 Codex。本页中的服务账号映射和 SDK 示例适用于 OpenAI API。

OpenAI 支持来自出站身份联合的 AWS 颁发的 OIDC JWT，以及
  Amazon EKS 颁发的 Kubernetes projected service account token。OpenAI 不
  支持 SigV4 签名请求或 AWS STS 临时访问密钥凭证
  作为 workload identity federation 的 subject token。



## AWS 出站身份联合

AWS 出站身份联合让 AWS 主体可向 AWS STS 请求已签名的 OIDC JWT，并将该令牌出示给外部服务。在 OpenAI 工作负载身份联合中，AWS 颁发的 JWT 是 OpenAI 在签发 OpenAI 访问令牌之前进行验证的 subject token。

### 配置 AWS 出站身份联合

为将颁发令牌的那个 AWS 账户启用出站身份联合。设置细节请参阅 AWS 指南中的 [出站身份联合入门](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_outbound_getting_started.html).

```bash
aws iam enable-outbound-web-identity-federation
```

记录由 AWS 返回的该账户专属的签发者 URL。你将把该值配置为 OpenAI 工作负载身份提供商的签发者，并且它必须与 `iss` AWS 所颁发令牌中的声明一致。

AWS STS `GetWebIdentityToken` API 在 STS 全局
  端点上不可用。请配置 AWS CLI 或 SDK 使用区域 STS 端点。

授予工作负载调用 `sts:GetWebIdentityToken`。的权限。在 IAM 中限制受众和最长令牌有效期，以便该 AWS 主体只能为 OpenAI 签发令牌。此示例允许为受众 `https://api.openai.com/v1` 签发最长有效期为 300 秒的令牌：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:GetWebIdentityToken",
      "Resource": "*",
      "Condition": {
        "ForAllValues:StringEquals": {
          "sts:IdentityTokenAudience": "https://api.openai.com/v1"
        },
        "NumericLessThanEquals": {
          "sts:DurationSeconds": 300
        }
      }
    }
  ]
}
```

使用将在 OpenAI 工作负载身份提供商上配置的相同受众,请求 AWS 颁发的 OIDC 令牌。使用 `ES384` ,除非你的环境要求 `RS256` 兼容性。

```bash
TOKEN=$(aws sts get-web-identity-token \
  --audience "https://api.openai.com/v1" \
  --signing-algorithm ES384 \
  --duration-seconds 300 \
  --tags Key=environment,Value=production \
         Key=workload,Value=batch-ingest \
  --query "WebIdentityToken" \
  --output text)
export TOKEN
```

### 验证 AWS 颁发的令牌

在配置工作负载身份联合之前，将 AWS 颁发的令牌导出为 `TOKEN`，然后在本地运行以下脚本以检查其声明：

```javascript
const parts = process.env.TOKEN?.split(".") ?? [];
if (parts.length !== 3) {
  throw new Error("Expected a compact JWT with three segments");
}
if (!/^[A-Za-z0-9_-]+$/.test(parts[1]) || parts[1].length % 4 === 1) {
  throw new Error("JWT payload is not valid Base64URL");
}

const bytes = Buffer.from(parts[1], "base64url");
if (bytes.toString("base64url") !== parts[1]) {
  throw new Error("JWT payload is not valid Base64URL");
}
const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
const claims = JSON.parse(decoded);
if (claims === null || Array.isArray(claims) || typeof claims !== "object") {
  throw new Error("JWT payload is not a JSON object");
}
console.log(decoded);
```

```python
import base64
import json
import os
import re


def reject_non_json_constant(value):
    raise ValueError(f"JWT payload contains non-JSON constant: {value}")


parts = os.environ.get("TOKEN", "").split(".")
if len(parts) != 3:
    raise ValueError("Expected a compact JWT with three segments")

payload = parts[1]
if re.fullmatch(r"[A-Za-z0-9_-]+", payload) is None or len(payload) % 4 == 1:
    raise ValueError("JWT payload is not valid Base64URL")
padded_payload = payload + "=" * (-len(payload) % 4)
decoded = base64.b64decode(padded_payload, altchars=b"-_", validate=True)
if base64.urlsafe_b64encode(decoded).rstrip(b"=").decode("ascii") != payload:
    raise ValueError("JWT payload is not valid Base64URL")
decoded_text = decoded.decode("utf-8")
claims = json.loads(decoded_text, parse_constant=reject_non_json_constant)
if not isinstance(claims, dict):
    raise ValueError("JWT payload is not a JSON object")
print(decoded_text)
```

```go
package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"unicode/utf8"
)

func decodeSegment(segment string) (json.RawMessage, error) {
	if !isBase64URLSegment(segment) {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	decoded, err := base64.RawURLEncoding.DecodeString(segment)
	if err != nil {
		return nil, err
	}
	if base64.RawURLEncoding.EncodeToString(decoded) != segment {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	if !utf8.Valid(decoded) {
		return nil, fmt.Errorf("JWT segment is not valid UTF-8")
	}

	var value json.RawMessage
	if err := json.Unmarshal(decoded, &value); err != nil {
		return nil, err
	}
	if trimmed := bytes.TrimSpace(value); len(trimmed) == 0 || trimmed[0] != '{' {
		return nil, fmt.Errorf("JWT segment is not a JSON object")
	}
	return value, nil
}

func isBase64URLSegment(segment string) bool {
	if segment == "" || len(segment)%4 == 1 {
		return false
	}
	for _, character := range segment {
		if !('A' <= character && character <= 'Z') &&
			!('a' <= character && character <= 'z') &&
			!('0' <= character && character <= '9') &&
			character != '-' &&
			character != '_' {
			return false
		}
	}
	return true
}

func main() {
	parts := strings.Split(os.Getenv("TOKEN"), ".")
	if len(parts) != 3 {
		panic("Expected a compact JWT with three segments")
	}

	payload, err := decodeSegment(parts[1])
	if err != nil {
		panic(err)
	}
	formatted, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(formatted))
}
```

```java
// Add Jackson (com.fasterxml.jackson.core:jackson-databind) to your project.
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public final class DecodeJwtPayloadExample {
  private static final ObjectMapper JSON =
      new ObjectMapper().enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

  private DecodeJwtPayloadExample() {}

  static String decodeUtf8(byte[] bytes) throws IOException {
    try {
      return StandardCharsets.UTF_8
          .newDecoder()
          .onMalformedInput(CodingErrorAction.REPORT)
          .onUnmappableCharacter(CodingErrorAction.REPORT)
          .decode(ByteBuffer.wrap(bytes))
          .toString();
    } catch (CharacterCodingException exception) {
      throw new IOException("JWT segment is not valid UTF-8", exception);
    }
  }

  static String decodeSegment(String segment) throws IOException {
    if (!isBase64UrlSegment(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    byte[] bytes = Base64.getUrlDecoder().decode(segment);
    if (!Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).equals(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    String decoded = decodeUtf8(bytes);
    JsonNode value = JSON.readTree(decoded);
    if (value == null || value.isMissingNode() || !value.isObject()) {
      throw new IOException("JWT segment is not a JSON object");
    }
    return decoded;
  }

  static boolean isBase64UrlSegment(String segment) {
    if (segment.isEmpty() || segment.length() % 4 == 1) {
      return false;
    }
    return segment
        .chars()
        .allMatch(
            character ->
                character >= 'A' && character <= 'Z'
                    || character >= 'a' && character <= 'z'
                    || character >= '0' && character <= '9'
                    || character == '-'
                    || character == '_');
  }

  static String[] requireCompactJwt(String token) {
    if (token == null) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    String[] parts = token.split("\\.", -1);
    if (parts.length != 3) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    return parts;
  }

  public static void main(String[] args) throws IOException {
    String[] parts = requireCompactJwt(System.getenv("TOKEN"));
    System.out.println(decodeSegment(parts[1]));
  }
}
```

```csharp
using System.Text;
using System.Text.Json;

static string DecodeSegment(string segment)
{
    if (
        segment.Length % 4 == 1 ||
        segment.Any(
            character =>
                !(
                    character is >= 'A' and <= 'Z' ||
                    character is >= 'a' and <= 'z' ||
                    character is >= '0' and <= '9' ||
                    character is '-' or '_'
                )
        )
    )
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }

    byte[] decoded = Convert.FromBase64String(
        segment.Replace('-', '+').Replace('_', '/') +
        new string('=', (4 - segment.Length % 4) % 4)
    );
    string canonicalSegment = Convert
        .ToBase64String(decoded)
        .TrimEnd('=')
        .Replace('+', '-')
        .Replace('/', '_');
    if (canonicalSegment != segment)
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }
    string decodedJson = new UTF8Encoding(false, true).GetString(decoded);
    using JsonDocument document = JsonDocument.Parse(decodedJson);
    if (document.RootElement.ValueKind is not JsonValueKind.Object)
    {
        throw new FormatException("JWT segment is not a JSON object");
    }
    return decodedJson;
}

string? token = Environment.GetEnvironmentVariable("TOKEN");
if (token is null)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}
string[] parts = token.Split('.');
if (parts.Length != 3)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}

Console.WriteLine(DecodeSegment(parts[1]));
```

```ruby
require "base64"
require "json"

parts = ENV.fetch("TOKEN", "").split(".", -1)
raise "Expected a compact JWT with three segments" unless parts.length == 3

unless parts[1].match?(/\A[A-Za-z0-9_-]+\z/) && parts[1].length % 4 != 1
  raise "JWT payload is not valid Base64URL"
end

begin
  payload = Base64.urlsafe_decode64(parts[1].ljust((parts[1].length + 3) & ~3, "="))
rescue ArgumentError
  raise "JWT payload is not valid Base64URL"
end
unless Base64.urlsafe_encode64(payload, padding: false) == parts[1]
  raise "JWT payload is not valid Base64URL"
end
payload.force_encoding(Encoding::UTF_8)
raise "JWT payload is not valid UTF-8" unless payload.valid_encoding?

claims = JSON.parse(payload)
raise "JWT payload is not a JSON object" unless claims.is_a?(Hash)

puts(payload)
```


此命令在验证令牌签名的情况下解码 JWT 负载。对生产令牌使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 AWS 颁发 OIDC 令牌类似于：

```json
{
  "iss": "https://abc123-def456-ghi789-jkl012.tokens.sts.global.api.aws",
  "aud": "https://api.openai.com/v1",
  "sub": "arn:aws:iam::123456789012:role/OpenAIWifRole",
  "iat": 1716235422,
  "exp": 1716235722,
  "jti": "jwt-id-example",
  "https://sts.amazonaws.com/": {
    "aws_account": "123456789012",
    "source_region": "us-west-2",
    "org_id": "o-exampleorgid",
    "principal_tags": {
      "environment": "production"
    },
    "request_tags": {
      "environment": "production",
      "workload": "batch-ingest"
    }
  }
}
```

并非每个 AWS 颁发的令牌都包含每个 AWS 特定的声明。以下中的声明 `https://sts.amazonaws.com/` 取决于调用主体、会话上下文和请求标签。

验证你计划在 OpenAI 中配置的声明：

- `iss`: 必须与OpenAI Workload Identity Provider 中配置的 AWS 账户特定 issuer URL 相匹配。
- `aud`: 必须匹配 `GetWebIdentityToken` 受众以及OpenAI Workload Identity Provider 受众。
- `sub`: 标识请求该令牌时使用的 IAM 主体 ARN。建议匹配完全一致的角色 ARN。
- AWS 相关声明：在匹配账户、组织、principal tag 或 request tag 值之前，请以解码后的令牌作为唯一可信来源。

使用解码后的负载，将你收到的令牌与在 OpenAI 中配置的 issuer、audience 和 mapping 值进行比较。大多数配置问题都可以在 `iss`, `aud`、和 `sub` 声明中看到，然后你再去交换令牌。

### 设置工作负载身份联合

在 OpenAI 中为 AWS 账户签发方创建一个 Workload Identity Provider，然后添加一个与 AWS 签发的令牌中稳定声明相匹配的服务账户映射。

先配置 Workload Identity Provider，然后创建服务账户映射。

#### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为一个唯一值,例如 `aws-outbound-prod`. 使用 **Description**,例如 `Production AWS outbound identity federation workloads`，以帮助管理员识别该 provider。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 到启用出站身份联合时返回的 AWS 账户特定 issuer URL。此值必须与令牌的 `iss` claim 匹配。将 **Audience** 设置为传递给 `GetWebIdentityToken`。的相同 audience。在本例中，该值为 `https://api.openai.com/v1`.

3. **使用 AWS OIDC 发现。** 将 **Use uploaded JWKS for token verification** 禁用。OpenAI 使用 AWS issuer 的 OIDC 发现元数据和 JWKS 来验证 AWS 颁发的令牌。

4. **仅在需要派生映射属性时才添加属性转换。** 原始令牌匹配支持顶级标量声明，例如 `sub`, `aud`，以及 `iss`。AWS 特定的命名空间声明嵌套在 `https://sts.amazonaws.com/`，下，因此在映射中使用派生属性之前需要使用 CEL 方括号表示法创建它们。例如，输入 `aws_environment` ，表达式为 `assertion["https://sts.amazonaws.com/"]["principal_tags"]["environment"]` 以创建 `openai.aws_environment` ，该属性来自上面解码的令牌示例。在使用嵌套声明路径之前，请先在示例令牌中验证它；如果某个转换无法求值，映射解析将失败。已经以 `openai.` 开头的原始令牌声明将作为 `openai.` 映射键被忽略，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建一个服务账号映射。** 设置 **Name** 设置为 Workload Identity Provider 内唯一的值，例如 `aws-role-openai-wif`. 使用 **Description**,例如 `Production AWS role for OpenAI API workload`，用于说明哪些工作负载可以使用该映射。

2. **匹配 AWS 主体。** 设置 **Key** 为 `sub` ，并将 **Value** 设置为解码令牌中的 IAM 主体 ARN，例如 `arn:aws:iam::123456789012:role/OpenAIWifRole`。精确匹配 `sub` 声明可为 AWS 出站身份联合提供最强的隔离。

3. **根据需要添加额外的声明匹配。** 你可以匹配任意可用的标量声明或转换后的属性。例如，如果需要额外的信任边界，可以使用源自 AWS 账户、组织、主体标签或请求标签声明的转换后属性。

4. **选择 OpenAI 目标。** 设置 **Project** 设置为拥有目标服务账号的 OpenAI 项目。将 **Service account** 设置为 AWS 工作负载可以使用的 OpenAI 服务账号，例如 `aws-outbound-prod-openai-wif`.

5. **根据需要收窄 API 权限。** 选择合适的 **权限** 例如 `api.model.request` ，并将 `api.vector_store.read` 以进一步收窄从此映射中生成的访问令牌。保持权限为空可避免添加 WIF 专属的作用域限制；该令牌仍会以映射后的服务帐号身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以向 AWS STS 请求 AWS 颁发的 OIDC 令牌，并将其兑换为 OpenAI 颁发的访问令牌。

设置 `OPENAI_WIF_AUDIENCE` 为在 OpenAI Workload Identity Provider 上配置的相同受众。subject token provider 会以该受众调用 AWS STS `GetWebIdentityToken` ，将 AWS 颁发的 JWT 作为 subject token 返回，然后 OpenAI SDK 将其兑换为 OpenAI 颁发的访问令牌。

使用 AWS 颁发的 OIDC 令牌进行身份验证

```javascript
import { GetWebIdentityTokenCommand, STSClient } from "@aws-sdk/client-sts";
import OpenAI from "openai";

const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;
const audience = process.env.OPENAI_WIF_AUDIENCE;
const awsRegion = process.env.AWS_REGION;

if (!identityProviderId || !serviceAccountId || !audience || !awsRegion) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID, OPENAI_SERVICE_ACCOUNT_ID, OPENAI_WIF_AUDIENCE, and AWS_REGION"
  );
}
const wifAudience = audience;

const sts = new STSClient({ region: awsRegion });

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function awsOutboundWebIdentityTokenProvider() {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const response = await sts.send(
        new GetWebIdentityTokenCommand({
          Audience: [wifAudience],
          SigningAlgorithm: "ES384",
          DurationSeconds: 300,
        })
      );

      if (!response.WebIdentityToken) {
        throw new Error("AWS STS did not return a web identity token.");
      }

      return response.WebIdentityToken;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: awsOutboundWebIdentityTokenProvider(),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from AWS outbound workload identity federation.",
});

console.log(response.output_text);
```

```python
import os

import boto3
from openai import OpenAI
from openai.auth import SubjectTokenProvider


def aws_outbound_web_identity_token_provider(audience: str) -> SubjectTokenProvider:
    sts = boto3.client("sts", region_name=os.environ["AWS_REGION"])

    def get_token() -> str:
        response = sts.get_web_identity_token(
            Audience=[audience],
            SigningAlgorithm="ES384",
            DurationSeconds=300,
        )
        token = response.get("WebIdentityToken", "")
        if not token:
            raise RuntimeError("AWS STS did not return a web identity token.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": aws_outbound_web_identity_token_provider(
            os.environ["OPENAI_WIF_AUDIENCE"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from AWS outbound workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	awssdk "github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sts"
	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

type awsOutboundWebIdentityTokenProvider struct {
	client   *sts.Client
	audience string
}

func (p awsOutboundWebIdentityTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p awsOutboundWebIdentityTokenProvider) GetToken(ctx context.Context, _ auth.HTTPDoer) (string, error) {
	output, err := p.client.GetWebIdentityToken(ctx, &sts.GetWebIdentityTokenInput{
		Audience:         []string{p.audience},
		DurationSeconds:  awssdk.Int32(300),
		SigningAlgorithm: awssdk.String("ES384"),
	})
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "aws-outbound",
			Message:  "failed to request AWS web identity token",
			Cause:    err,
		}
	}

	token := awssdk.ToString(output.WebIdentityToken)
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "aws-outbound",
			Message:  "AWS STS did not return a web identity token",
		}
	}

	return token, nil
}

func main() {
	ctx := context.Background()
	audience := os.Getenv("OPENAI_WIF_AUDIENCE")
	if audience == "" {
		log.Fatal("Set OPENAI_WIF_AUDIENCE")
	}

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatal(err)
	}

	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: awsOutboundWebIdentityTokenProvider{
				client:   sts.NewFromConfig(cfg),
				audience: audience,
			},
		}),
	)

	response, err := client.Responses.New(ctx, responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from AWS outbound workload identity federation."),
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.util.concurrent.CompletableFuture;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.GetWebIdentityTokenRequest;

public final class AwsOutboundWorkloadIdentityExample {
  private AwsOutboundWorkloadIdentityExample() {}

  static final class AwsOutboundWebIdentityTokenProvider implements SubjectTokenProvider {
    private final StsClient stsClient;
    private final String audience;

    AwsOutboundWebIdentityTokenProvider(StsClient stsClient, String audience) {
      this.stsClient = stsClient;
      this.audience = audience;
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
      try {
        String token =
            stsClient
                .getWebIdentityToken(
                    GetWebIdentityTokenRequest.builder()
                        .audience(audience)
                        .durationSeconds(300)
                        .signingAlgorithm("ES384")
                        .build())
                .webIdentityToken();

        if (token == null || token.isEmpty()) {
          throw new SubjectTokenProviderException(
              "aws-outbound", "AWS STS did not return a web identity token", null);
        }

        return token;
      } catch (SubjectTokenProviderException e) {
        throw e;
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "aws-outbound", "failed to request AWS web identity token", e);
      }
    }

    @Override
    public CompletableFuture<String> getTokenAsync(HttpClient httpClient, JsonMapper jsonMapper) {
      return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
    }
  }

  public static void main(String[] args) {
    String audience = System.getenv("OPENAI_WIF_AUDIENCE");
    StsClient stsClient =
        StsClient.builder().region(Region.of(System.getenv("AWS_REGION"))).build();

    WorkloadIdentity workloadIdentity =
        WorkloadIdentity.builder()
            .identityProviderId(System.getenv("OPENAI_IDENTITY_PROVIDER_ID"))
            .serviceAccountId(System.getenv("OPENAI_SERVICE_ACCOUNT_ID"))
            .provider(new AwsOutboundWebIdentityTokenProvider(stsClient, audience))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from AWS outbound workload identity federation.")
            .build();

    client.responses().create(params).output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```

```ruby
require "aws-sdk-sts"
require "openai"

class AwsOutboundWebIdentityTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  def initialize(audience:, sts_client:)
    @audience = audience
    @sts_client = sts_client
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    response = @sts_client.get_web_identity_token(
      audience: [@audience],
      signing_algorithm: "ES384",
      duration_seconds: 300
    )
    token = response.web_identity_token.to_s
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "AWS STS did not return a web identity token",
        provider: "aws-outbound"
      )
    end
    token
  rescue Aws::STS::Errors::ServiceError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request AWS web identity token: #{e.message}",
      provider: "aws-outbound",
      cause: e
    )
  end
end

provider = AwsOutboundWebIdentityTokenProvider.new(
  audience: ENV.fetch("OPENAI_WIF_AUDIENCE"),
  sts_client: Aws::STS::Client.new(region: ENV.fetch("AWS_REGION"))
)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from AWS outbound workload identity federation."
)

puts(response.output_text)
```


  


  


## Amazon EKS 投影的服务账户令牌

通过将 EKS 颁发的投影服务账户令牌交换为短期 OpenAI 访问令牌，将 Amazon EKS 用作 Workload Identity Provider。

### 设置 EKS

使用 Kubernetes `ServiceAccount` 为需要调用 OpenAI API 的 EKS 工作负载。如果还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

EKS 投影的服务账户令牌使用 `sub` 格式的 claim `system:serviceaccount:<namespace>:<service-account-name>`。对于上面的服务账户， `sub` claim 为 `system:serviceaccount:default:openai-wif`.

检索与 EKS 集群关联的 OIDC 颁发者 URL：

```bash
aws eks describe-cluster \
  --name <cluster-name> \
  --region <region> \
  --query "cluster.identity.oidc.issuer" \
  --output text
```

示例输出：

```text
https://oidc.eks.us-west-2.amazonaws.com/id/EXAMPLED539D4633E53DE1B716D3
```

在 OpenAI Workload Identity Provider 中配置的颁发者必须与此颁发者 URL 以及 `iss` 投影的 EKS 服务账户令牌中的 claim 相匹配。

使用 OpenAI 期望的受众和适合你工作负载的过期时间来配置投影的服务账户令牌。OpenAI 会验证令牌的颁发者、签名、受众和过期时间。在本例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用的受众为 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投影令牌的受众与 OpenAI Workload Identity Provider 的受众一致，你也可以使用其他受众：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: openai-wif-app
  namespace: default
spec:
  serviceAccountName: openai-wif
  containers:
    - name: app
      image: my-image
      volumeMounts:
        - name: eks-sa-token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: eks-sa-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: "https://api.openai.com/v1"
              expirationSeconds: 3600
```

### 验证 EKS 令牌

在配置工作负载身份联合之前，请在本地解码一段示例的投射服务账号令牌并检查其声明。从一个已挂载投射令牌的运行中 Pod 中，检索该令牌并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行以下脚本：

```javascript
const parts = process.env.TOKEN?.split(".") ?? [];
if (parts.length !== 3) {
  throw new Error("Expected a compact JWT with three segments");
}
if (!/^[A-Za-z0-9_-]+$/.test(parts[1]) || parts[1].length % 4 === 1) {
  throw new Error("JWT payload is not valid Base64URL");
}

const bytes = Buffer.from(parts[1], "base64url");
if (bytes.toString("base64url") !== parts[1]) {
  throw new Error("JWT payload is not valid Base64URL");
}
const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
const claims = JSON.parse(decoded);
if (claims === null || Array.isArray(claims) || typeof claims !== "object") {
  throw new Error("JWT payload is not a JSON object");
}
console.log(decoded);
```

```python
import base64
import json
import os
import re


def reject_non_json_constant(value):
    raise ValueError(f"JWT payload contains non-JSON constant: {value}")


parts = os.environ.get("TOKEN", "").split(".")
if len(parts) != 3:
    raise ValueError("Expected a compact JWT with three segments")

payload = parts[1]
if re.fullmatch(r"[A-Za-z0-9_-]+", payload) is None or len(payload) % 4 == 1:
    raise ValueError("JWT payload is not valid Base64URL")
padded_payload = payload + "=" * (-len(payload) % 4)
decoded = base64.b64decode(padded_payload, altchars=b"-_", validate=True)
if base64.urlsafe_b64encode(decoded).rstrip(b"=").decode("ascii") != payload:
    raise ValueError("JWT payload is not valid Base64URL")
decoded_text = decoded.decode("utf-8")
claims = json.loads(decoded_text, parse_constant=reject_non_json_constant)
if not isinstance(claims, dict):
    raise ValueError("JWT payload is not a JSON object")
print(decoded_text)
```

```go
package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"unicode/utf8"
)

func decodeSegment(segment string) (json.RawMessage, error) {
	if !isBase64URLSegment(segment) {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	decoded, err := base64.RawURLEncoding.DecodeString(segment)
	if err != nil {
		return nil, err
	}
	if base64.RawURLEncoding.EncodeToString(decoded) != segment {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	if !utf8.Valid(decoded) {
		return nil, fmt.Errorf("JWT segment is not valid UTF-8")
	}

	var value json.RawMessage
	if err := json.Unmarshal(decoded, &value); err != nil {
		return nil, err
	}
	if trimmed := bytes.TrimSpace(value); len(trimmed) == 0 || trimmed[0] != '{' {
		return nil, fmt.Errorf("JWT segment is not a JSON object")
	}
	return value, nil
}

func isBase64URLSegment(segment string) bool {
	if segment == "" || len(segment)%4 == 1 {
		return false
	}
	for _, character := range segment {
		if !('A' <= character && character <= 'Z') &&
			!('a' <= character && character <= 'z') &&
			!('0' <= character && character <= '9') &&
			character != '-' &&
			character != '_' {
			return false
		}
	}
	return true
}

func main() {
	parts := strings.Split(os.Getenv("TOKEN"), ".")
	if len(parts) != 3 {
		panic("Expected a compact JWT with three segments")
	}

	payload, err := decodeSegment(parts[1])
	if err != nil {
		panic(err)
	}
	formatted, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(formatted))
}
```

```java
// Add Jackson (com.fasterxml.jackson.core:jackson-databind) to your project.
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public final class DecodeJwtPayloadExample {
  private static final ObjectMapper JSON =
      new ObjectMapper().enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

  private DecodeJwtPayloadExample() {}

  static String decodeUtf8(byte[] bytes) throws IOException {
    try {
      return StandardCharsets.UTF_8
          .newDecoder()
          .onMalformedInput(CodingErrorAction.REPORT)
          .onUnmappableCharacter(CodingErrorAction.REPORT)
          .decode(ByteBuffer.wrap(bytes))
          .toString();
    } catch (CharacterCodingException exception) {
      throw new IOException("JWT segment is not valid UTF-8", exception);
    }
  }

  static String decodeSegment(String segment) throws IOException {
    if (!isBase64UrlSegment(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    byte[] bytes = Base64.getUrlDecoder().decode(segment);
    if (!Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).equals(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    String decoded = decodeUtf8(bytes);
    JsonNode value = JSON.readTree(decoded);
    if (value == null || value.isMissingNode() || !value.isObject()) {
      throw new IOException("JWT segment is not a JSON object");
    }
    return decoded;
  }

  static boolean isBase64UrlSegment(String segment) {
    if (segment.isEmpty() || segment.length() % 4 == 1) {
      return false;
    }
    return segment
        .chars()
        .allMatch(
            character ->
                character >= 'A' && character <= 'Z'
                    || character >= 'a' && character <= 'z'
                    || character >= '0' && character <= '9'
                    || character == '-'
                    || character == '_');
  }

  static String[] requireCompactJwt(String token) {
    if (token == null) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    String[] parts = token.split("\\.", -1);
    if (parts.length != 3) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    return parts;
  }

  public static void main(String[] args) throws IOException {
    String[] parts = requireCompactJwt(System.getenv("TOKEN"));
    System.out.println(decodeSegment(parts[1]));
  }
}
```

```csharp
using System.Text;
using System.Text.Json;

static string DecodeSegment(string segment)
{
    if (
        segment.Length % 4 == 1 ||
        segment.Any(
            character =>
                !(
                    character is >= 'A' and <= 'Z' ||
                    character is >= 'a' and <= 'z' ||
                    character is >= '0' and <= '9' ||
                    character is '-' or '_'
                )
        )
    )
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }

    byte[] decoded = Convert.FromBase64String(
        segment.Replace('-', '+').Replace('_', '/') +
        new string('=', (4 - segment.Length % 4) % 4)
    );
    string canonicalSegment = Convert
        .ToBase64String(decoded)
        .TrimEnd('=')
        .Replace('+', '-')
        .Replace('/', '_');
    if (canonicalSegment != segment)
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }
    string decodedJson = new UTF8Encoding(false, true).GetString(decoded);
    using JsonDocument document = JsonDocument.Parse(decodedJson);
    if (document.RootElement.ValueKind is not JsonValueKind.Object)
    {
        throw new FormatException("JWT segment is not a JSON object");
    }
    return decodedJson;
}

string? token = Environment.GetEnvironmentVariable("TOKEN");
if (token is null)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}
string[] parts = token.Split('.');
if (parts.Length != 3)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}

Console.WriteLine(DecodeSegment(parts[1]));
```

```ruby
require "base64"
require "json"

parts = ENV.fetch("TOKEN", "").split(".", -1)
raise "Expected a compact JWT with three segments" unless parts.length == 3

unless parts[1].match?(/\A[A-Za-z0-9_-]+\z/) && parts[1].length % 4 != 1
  raise "JWT payload is not valid Base64URL"
end

begin
  payload = Base64.urlsafe_decode64(parts[1].ljust((parts[1].length + 3) & ~3, "="))
rescue ArgumentError
  raise "JWT payload is not valid Base64URL"
end
unless Base64.urlsafe_encode64(payload, padding: false) == parts[1]
  raise "JWT payload is not valid Base64URL"
end
payload.force_encoding(Encoding::UTF_8)
raise "JWT payload is not valid UTF-8" unless payload.valid_encoding?

claims = JSON.parse(payload)
raise "JWT payload is not a JSON object" unless claims.is_a?(Hash)

puts(payload)
```


此命令在验证令牌签名的情况下解码 JWT 负载。对生产令牌使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 EKS 投射服务账号令牌将类似于：

```json
{
  "iss": "https://oidc.eks.us-west-2.amazonaws.com/id/EXAMPLED539D4633E53DE1B716D3",
  "aud": ["https://api.openai.com/v1"],
  "sub": "system:serviceaccount:default:openai-wif",
  "iat": 1716235422,
  "exp": 1716239022,
  "kubernetes.io": {
    "namespace": "default",
    "serviceaccount": {
      "name": "openai-wif",
      "uid": "11111111-2222-3333-4444-555555555555"
    }
  }
}
```

使用解码后的负载，将你收到的令牌与在 OpenAI 中配置的 issuer、audience 和 mapping 值进行比较。大多数配置问题都可以在 `iss`, `aud`、和 `sub` 声明中看到，然后你再去交换令牌。

### 设置工作负载身份联合

为 EKS 签发方在 OpenAI 中创建一个工作负载身份提供方，然后添加一个与投射令牌属性匹配的服务账号映射。

先配置 Workload Identity Provider，然后创建服务账户映射。

#### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为一个唯一值,例如 `aws-eks-prod`. 使用 **Description**,例如 `Production EKS cluster`,以帮助管理员识别集群。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 为 `aws eks describe-cluster --query "cluster.identity.oidc.issuer"`。该值必须与 `iss` 中声明的 projected EKS 服务账户令牌中的声明相匹配。将 **Audience** 设置为投射的服务账户令牌卷上配置的相同 audience。在本示例中,该值为 `https://api.openai.com/v1`.

3. **使用 EKS OIDC 发现。** 将 **Use uploaded JWKS for token verification** 处于禁用状态。OpenAI 使用 EKS 颁发者的 OIDC 发现元数据和 JWKS 来验证投射的服务账户令牌。

4. **仅在需要派生映射属性时才添加属性转换。** 原始令牌声明(如 `sub`, `aud`，以及 `iss` )可直接用于映射断言。例如,创建一个名为 `subject` ，表达式为 `assertion.sub`。的转换属性。在仪表板中,输入 `subject` 作为属性名称;OpenAI 将其存储为 `openai.subject`,你可以在映射中引用它。

   > **注意:** 已以 `openai.` 开头的原始令牌声明将作为 `openai.` 映射键被忽略，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建一个服务账号映射。** 设置 **Name** 为 Workload Identity Provider 内的唯一值,例如 `openai-mapping-eks`. 使用 **Description**,例如 `Workload Identity Provider Mapping for EKS Workloads`，用于说明哪些工作负载可以使用该映射。

2. **匹配 EKS 服务账户主体。** 设置 **Key** 为 `sub` ，并将 **Value** 为 `system:serviceaccount:default:openai-wif`。你可以匹配任何可用的声明或转换属性。匹配 `sub` 是限制性最强的选项,因为它能唯一标识一个 Kubernetes 服务账户。

3. **选择 OpenAI 目标。** 设置 **Project** 设置为拥有目标服务账号的 OpenAI 项目。将 **Service account** 为 EKS 工作负载可使用的 OpenAI 服务账户,例如 `aws-eks-prod-openai-wif`。检查 `Create a new service account in this project` 如果你希望为此映射创建一个新的服务账号，而不是复用现有账号。

4. **根据需要收窄 API 权限。** 选择合适的 **权限** 例如 `api.model.request` ，并将 `api.vector_store.read` 以进一步收窄从此映射中生成的访问令牌。保持权限为空可避免添加 WIF 专属的作用域限制；该令牌仍会以映射后的服务帐号身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以读取投影的 EKS 服务账户令牌，并将其交换为 OpenAI 颁发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供方的主体令牌源。SDK 将该 EKS 令牌交换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义主体令牌提供方初始化 OpenAI 客户端。该提供方从挂载的文件路径读取投影的 EKS 服务账户令牌，并将其用作工作负载身份联合的主体令牌。

通过 EKS 投影的服务账户令牌进行身份验证

```javascript
import { readFile } from "node:fs/promises";
import OpenAI from "openai";

const tokenPath = "/var/run/secrets/tokens/token";
const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;

if (!identityProviderId || !serviceAccountId) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID and OPENAI_SERVICE_ACCOUNT_ID"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function mountedEksServiceAccountTokenProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The mounted EKS service account token file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: mountedEksServiceAccountTokenProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from AWS workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/secrets/tokens/token"


def mounted_eks_service_account_token_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The mounted EKS service account token file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": mounted_eks_service_account_token_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from AWS workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

const tokenPath = "/var/run/secrets/tokens/token"

type mountedEksServiceAccountTokenProvider struct {
	path string
}

func (p mountedEksServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p mountedEksServiceAccountTokenProvider) GetToken(_ context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "aws-eks",
			Message:  "failed to read mounted EKS service account token",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "aws-eks",
			Message:  "mounted EKS service account token is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: mountedEksServiceAccountTokenProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from AWS workload identity federation."),
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.CompletableFuture;

public final class AwsEksWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/secrets/tokens/token";

  private AwsEksWorkloadIdentityExample() {}

  static final class MountedEksServiceAccountTokenProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    MountedEksServiceAccountTokenProvider(String tokenPath) {
      this.tokenPath = Path.of(tokenPath);
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
      String token;
      try {
        token = Files.readString(tokenPath).trim();
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "aws-eks", "failed to read mounted EKS service account token", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException(
            "aws-eks", "mounted EKS service account token is empty", null);
      }

      return token;
    }

    @Override
    public CompletableFuture<String> getTokenAsync(HttpClient httpClient, JsonMapper jsonMapper) {
      return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
    }
  }

  public static void main(String[] args) {
    WorkloadIdentity workloadIdentity =
        WorkloadIdentity.builder()
            .identityProviderId(System.getenv("OPENAI_IDENTITY_PROVIDER_ID"))
            .serviceAccountId(System.getenv("OPENAI_SERVICE_ACCOUNT_ID"))
            .provider(new MountedEksServiceAccountTokenProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from AWS workload identity federation.")
            .build();

    client.responses().create(params).output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```

```ruby
require "openai"

TOKEN_PATH = "/var/run/secrets/tokens/token"

class MountedEksServiceAccountTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  def initialize(token_path:)
    @token_path = token_path
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    token = File.read(@token_path).strip
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Mounted EKS service account token is empty",
        provider: "aws-eks"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read mounted EKS service account token: #{e.message}",
      provider: "aws-eks",
      cause: e
    )
  end
end

provider = MountedEksServiceAccountTokenProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from AWS workload identity federation."
)

puts(response.output_text)
```



## AWS 最佳实践

- 为每个工作负载使用专用的 AWS 身份。为 AWS 出站身份联合使用单独的 IAM 角色，并为 EKS 工作负载使用单独的 Kubernetes 服务账户。
- 为 OpenAI 访问配置专用受众。在 AWS 签发或 EKS 投射的令牌以及 OpenAI Workload Identity Provider 配置中使用相同的受众值。
- 保持令牌生命周期合理较短。对于 AWS 出站身份联合，使用 IAM 条件，例如 `sts:DurationSeconds`；对于 EKS，设置适当的投射令牌过期时间。
- 优先进行精确的主体匹配。对 AWS 出站令牌匹配完整的 IAM 主体 ARN，或对 EKS 令牌匹配完整的 Kubernetes 服务账户主体。
- 将映射范围限定在稳定边界内。当账户、组织、命名空间或转换后的属性能够在不创建广泛信任规则的前提下缩减访问范围时，使用它们。
- 在交换令牌时重新加载令牌。根据需要请求 AWS 出站令牌，并从挂载的文件路径读取 EKS 投射令牌，以便自动获取轮换后的令牌。
- 仅授予工作负载所需的权限。使用映射级权限进一步收窄目标 OpenAI 服务账户所授予的访问权限。