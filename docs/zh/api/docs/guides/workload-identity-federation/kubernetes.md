# 为 Kubernetes 配置工作负载身份联合

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

使用 Kubernetes 作为工作负载身份提供者，通过将投射的 Kubernetes 服务账号令牌交换为短时 OpenAI 访问令牌。

## 设置 Kubernetes

本指南假定已启用 Kubernetes 服务账户令牌投射，该功能在现代 Kubernetes 版本中默认可用。OpenAI 工作负载身份联合需要兼容 OIDC 的投射式服务账户令牌。不支持存储在 Secrets 中的旧版 Kubernetes 服务账户令牌。

为需要调用 OpenAI API 的工作负载使用 Kubernetes `ServiceAccount` 。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

获取你的 Kubernetes 集群的 OIDC 颁发者：

```bash
kubectl get --raw /.well-known/openid-configuration | jq -r .issuer
```

即使你上传了 JWKS 且 OpenAI 不针对该 OIDC 颁发者执行 JWKS 发现，该颁发者也必须与 Workload Identity Provider 中配置的颁发者匹配。

获取集群的 JWKS 并保存返回的密钥集。在配置 Workload Identity Provider 时你将需要它：

```bash
kubectl get --raw /openid/v1/jwks
```

使用 OpenAI 期望的受众（audience）以及适合你工作负载的过期时间来配置投射式服务账户令牌。OpenAI 会校验令牌的颁发者、签名、受众和过期时间。在本示例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用受众 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投射令牌的受众与 OpenAI Workload Identity Provider 的受众匹配，你也可以使用不同的受众：

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
        - name: ksa-token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: ksa-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: "https://api.openai.com/v1"
              expirationSeconds: 3600
```

## 验证令牌

在配置工作负载身份联合之前，先在本地解码一个示例的投射服务账户令牌并检查其声明。从一个已挂载投射令牌的运行中 Pod 中获取该令牌，并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行此脚本：

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


此命令可在不验证令牌签名的情况下解码 JWT 负载。对于生产环境的令牌，请使用本地解码器，并避免将生产环境的令牌粘贴到第三方工具中。

一个已解码的 Kubernetes 投射服务账户令牌大致如下所示：

```json
{
  "iss": "https://kubernetes.example.com",
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

使用解码后的负载，将你收到的令牌的发行者、受众和映射值与 OpenAI 中配置的相应值进行比较。大多数配置问题都可在交换令牌之前的 `iss`, `aud`、和 `sub` 声明中看到。

## 设置工作负载身份联合

在 OpenAI 中为 Kubernetes 颁发者创建工作负载身份提供程序，然后添加一个服务账号映射，使其匹配来自投影令牌中的属性。

先配置工作负载身份提供程序，再创建服务账号映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为唯一值,例如 `kubernetes-prod`.使用 **Description**,例如 `Production Kubernetes cluster`,以帮助管理员识别该集群。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 为上一步返回的 issuer `kubectl get --raw /.well-known/openid-configuration | jq -r .issuer`。该值必须与投射令牌中的 `iss` 声明相匹配。设置 **Audience** 为投射的服务账号令牌卷所配置的相同不透明 audience 字符串。在本示例中,该值为 `https://api.openai.com/v1`.

3. **上传 Kubernetes JWKS。** 启用 **Use uploaded JWKS for token verification**,然后设置 **JWKS JSON** 输出中的 `kubectl get --raw /openid/v1/jwks`。OpenAI 使用此公钥集合来验证投射的 Kubernetes 服务账户令牌。上传包含周围的 `keys`.

   > **注意：** 对于自托管的 Kubernetes 集群，OpenAI 仅支持本地 JWKS 模式。上传你的集群返回的 JWKS；OpenAI 不会针对所配置的颁发者执行 OIDC 发现。OpenAI 仍会将所配置的颁发者与 `iss` 令牌中的字段进行比较。

   如果你的集群轮换服务账户签名密钥，请在 Workload Identity Provider 配置中更新上传的 JWKS。由未包含在所配置 JWKS 中的密钥签名的令牌将被拒绝。如果 JWKS 包含多个活跃的公钥，请提供完整的 `keys` 数组。

4. **仅当你需要派生映射属性时才添加属性转换。** 原始令牌声明（如 `sub`, `aud`，和 `iss` ）可在映射断言中直接使用。如果你计划基于转换后的属性（而非原始令牌声明）进行匹配，控制面板会自动应用 `openai.` 前缀；例如，输入 `workload_subject` 并使用表达式 `assertion.sub` 来创建 `openai.workload_subject`。已以 `openai.` 开头的原始令牌声明将被忽略用于 `openai.` 映射键，除非配置了匹配的转换。

### 设置服务账号映射

1. **创建服务账号映射。** 设置 **Name** 为 Workload Identity Provider 中的唯一值，例如 `openai-mapping-kubernetes`.使用 **Description**,例如 `Workload Identity Provider Mapping for Kubernetes Workloads`，以说明哪些工作负载可以使用该映射。

2. **匹配 Kubernetes 服务账号主体。** 设置 **Key** 为 `sub` 且 **Value** 为 `system:serviceaccount:default:openai-wif`。对于 Kubernetes 服务账号，主体格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

3. **选择 OpenAI 目标。** 设置 **Project** 为拥有目标服务账号的 OpenAI 项目。将 **Service account** 设置为 Kubernetes 工作负载可以使用的 OpenAI 服务账号，例如 `kubernetes-prod-openai-wif`。勾选 `Create a new service account in this project` 以创建新的服务账号用于此映射（而不是复用现有服务账号）。

4. **根据需要缩小 API 权限范围。** 选择合适的 **Permissions** ，例如 `api.model.request` 且 `api.vector_store.read` 以进一步收窄从此映射中签发的访问令牌。保持权限为空可避免添加 WIF 专属的作用域限制；该令牌仍以所映射的服务账号身份授权。

## 在代码中使用 token

配置你的 OpenAI SDK 客户端以读取投影的 Kubernetes token，并将其交换为由 OpenAI 颁发的访问令牌。

使用挂载的 token 路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供者所用的 subject token 来源。SDK 会将该 Kubernetes token 交换为由 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义 subject token 提供者初始化 OpenAI 客户端。该提供者从挂载的文件路径读取投影的 Kubernetes 服务账户 token，并将其用作工作负载身份联合的 subject token。

使用 Kubernetes 投影的服务账户 token 进行身份验证

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

function mountedServiceAccountTokenProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The mounted service account token file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: mountedServiceAccountTokenProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Kubernetes workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/secrets/tokens/token"


def mounted_service_account_token_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The mounted service account token file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": mounted_service_account_token_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Kubernetes workload identity federation.",
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

type mountedServiceAccountTokenProvider struct {
	path string
}

func (p mountedServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p mountedServiceAccountTokenProvider) GetToken(ctx context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "kubernetes",
			Message:  "failed to read mounted service account token",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "kubernetes",
			Message:  "mounted service account token is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: mountedServiceAccountTokenProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Kubernetes workload identity federation."),
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

public final class KubernetesWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/secrets/tokens/token";

  private KubernetesWorkloadIdentityExample() {}

  static final class MountedServiceAccountTokenProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    MountedServiceAccountTokenProvider(String tokenPath) {
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
            "kubernetes", "failed to read mounted service account token", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException(
            "kubernetes", "mounted service account token is empty", null);
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
            .provider(new MountedServiceAccountTokenProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Kubernetes workload identity federation.")
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

class MountedServiceAccountTokenProvider
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
        message: "Mounted service account token is empty",
        provider: "kubernetes"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read mounted service account token: #{e.message}",
      provider: "kubernetes",
      cause: e
    )
  end
end

provider = MountedServiceAccountTokenProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Kubernetes workload identity federation."
)

puts(response.output_text)
```


## Kubernetes 最佳实践

- 使用稳定的 OIDC 颁发者。颁发者 URL 必须与投影的服务账户令牌 `iss` 声明匹配，并且在集群升级和维护操作期间应保持稳定。
- 谨慎保护签名密钥。任何能够访问集群服务账户签名密钥的人都可能生成可被 OpenAI 接受的令牌。
- 为 OpenAI 集成使用专用服务账户。避免复用在无关基础设施或应用程序访问中使用的服务账户。
- 保持上传的 JWKS 为最新。OpenAI 使用配置的 JWKS 在本地 JWKS 模式下验证工作负载身份令牌，因此在轮换到新的签名密钥之前，请更新 Workload Identity Provider。
- 尽量降低自定义声明的复杂度。优先匹配标准声明，例如 `sub` 且 `aud`，或直接由这些声明派生的转换后的属性。
- 将命名空间所有权视为安全模型的一部分。如果命名空间管理员能够创建服务账户，请确保映射的作用范围合适，以防止意外的权限提升。
- 监控颁发者和签名密钥的更改。在不更新 Workload Identity Provider JWKS 的情况下轮换签名密钥可能导致令牌交换失败。