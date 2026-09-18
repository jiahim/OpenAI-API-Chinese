# 为 GitHub Actions 配置工作负载身份联合

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

使用 GitHub Actions 作为 Workload Identity Provider，通过将 GitHub 颁发的 OIDC token 交换为短时 OpenAI access token。这样工作流可以在 GitHub secrets 中不存储长期 API key 的情况下，对 OpenAI API 进行身份验证。

GitHub 可以为具有相应 `id-token: write` 权限并请求 identity token 的 工作流 job 签发签名 OIDC JWT。OpenAI 会在签发 OpenAI access token 之前，校验 token 的 issuer、audience、signature 以及 mapping 属性。

## 设置 GitHub Actions

授予 工作流 或任务请求 GitHub OIDC 令牌的权限：

```yaml
permissions:
  id-token: write
  contents: read
```

该 `id-token: write` 权限允许任务请求 OIDC JWT。它不会授予对仓库内容的写访问权限。OpenAI `contents: read` 权限是必需的，用于 `actions/checkout`.

使用你在 该公司 工作负载身份提供方中配置的精确 audience 来请求令牌。自定义 JavaScript 操作可以调用 `core.getIDToken("your-wif-audience")`；shell 步骤可以直接调用 GitHub 的 OIDC 请求 URL。包含保留 URL 字符的 audience 值，例如 `https://api.openai.com/v1`，在追加到请求 URL 之前应进行 URL 编码：

```bash
AUDIENCE="https://api.openai.com/v1"
ENCODED_AUDIENCE=$(jq -rn --arg audience "$AUDIENCE" '$audience | @uri')

TOKEN=$(curl -sSf -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
  "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=${ENCODED_AUDIENCE}" | jq -r .value)
export TOKEN
```

重要的 GitHub OIDC 声明包括：

- `iss`: 令牌颁发者。对于 GitHub Actions，它是 `https://token.actions.githubusercontent.com`.
- `aud`: 工作流所请求的 audience 值。请将 OpenAI 配置为要求与你请求的完全一致的值，例如 `your-wif-audience` 或 `https://api.openai.com/v1`.
- `sub`: 主要主体字符串。GitHub 会根据 工作流 元数据（如仓库、分支、标签、拉取请求或环境）来构建它。
- `repository`: 运行 工作流 的仓库，例如 `my-org/my-repo`.
- `repository_owner`: 拥有该仓库的组织或用户，例如 `my-org`.
- `ref`: 触发 工作流 的 Git 引用，例如 `refs/heads/main` 或 `refs/tags/v1.0.0`.
- `workflow`: 工作流 声明。请使用 GitHub 实际发出的声明值，例如 `deploy` ，如果这就是你的任务中的 工作流 声明。
- `workflow_ref`: 工作流 文件路径和引用，例如 `my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main`.
- `environment`: GitHub 环境名称，例如 `production`，当任务使用某个环境时。
- `run_id`, `run_number`, `run_attempt`，以及 `job_workflow_ref`: 可用于审计或更高级信任规则的运行和任务标识符。

完整的声明列表和主题格式，请参阅 GitHub 的 [OpenID Connect 参考](https://docs.github.com/en/actions/reference/security/oidc).

## 验证令牌

在配置工作负载身份联合之前，将 GitHub OIDC 令牌导出为 `TOKEN`，然后在 工作流 运行器中运行此脚本以检查其声明：

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


此命令会解码 JWT 载荷，但不验证令牌签名。生产环境中的令牌请使用本地解码器，避免将生产令牌粘贴到第三方工具中。切勿记录原始的 GitHub OIDC 令牌或已交换的 OpenAI 访问令牌。

一个解码后的 GitHub Actions OIDC 令牌看起来类似如下：

```json
{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "https://api.openai.com/v1",
  "sub": "repo:my-org/my-repo:environment:production",
  "repository": "my-org/my-repo",
  "repository_owner": "my-org",
  "ref": "refs/heads/main",
  "workflow": "deploy",
  "workflow_ref": "my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main",
  "environment": "production",
  "run_id": "1234567890",
  "run_attempt": "1"
}
```

使用解码后的载荷，将你收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题都会在 `iss`, `aud`, `repository`, `ref`、 `workflow_ref` 声明中显现，请在该处核对，然后再交换令牌。

## 设置工作负载身份联合

在 OpenAI 中为 GitHub Actions 创建工作负载身份提供方（Workload Identity Provider），然后添加一个服务账号映射，匹配你信任的 GitHub 工作流 声明。

先配置工作负载身份提供方，再创建服务账号映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `github-actions-prod`。使用 **Description**，例如 `Production GitHub Actions workflows`，以帮助管理员识别该 provider。

2. **设置 issuer 和 audience。** 将 **将 OIDC Issuer URL** 设置为 `https://token.actions.githubusercontent.com`。将 **Audience** 设置为你的 工作流 请求所使用的精确 audience，例如 `your-wif-audience` 或 `https://api.openai.com/v1`.

3. **使用 GitHub OIDC 发现。** 将 **Use uploaded JWKS for token verification** 保持禁用。OpenAI 使用 GitHub 的 OIDC 发现元数据和 JWKS 来验证 GitHub 签名的 token。

4. **仅在需要派生映射属性时才添加属性转换。** 原始 GitHub 声明，例如 `repository`, `ref`，以及 `workflow` 可直接用于映射断言。如果创建派生属性，仪表板会自动应用 `openai.` 前缀；例如，输入 `github_repository` 并附带表达式 `assertion.repository` 即可创建 `openai.github_repository`。已经以 `openai.` 开头的原始 token 声明在 `openai.` 映射键时会被忽略，除非配置了匹配的转换。

### 设置服务账号映射

1. **创建服务账号映射。** 将 **Name** 在 Workload Identity Provider 中将其设置为唯一值，例如 `github-actions-main-deploy`。使用 **Description**，例如 `Production deploy workflow on main`，用于说明哪个工作流可以使用该映射。

2. **添加精确的声明断言。** 添加一行 **Key** 和 **Value** ，每个必须匹配的 GitHub 声明各占一行。OpenAI 要求所有已配置的条目都匹配后才会签发访问令牌。对于生产部署的工作流，请使用类似下面的断言：

```text
   iss == "https://token.actions.githubusercontent.com"
   aud == "https://api.openai.com/v1"
   repository == "my-org/my-repo"
   ref == "refs/heads/main"
   workflow_ref == "my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main"
```

   优先选择 `workflow_ref` 而非 `workflow` 用于特权映射，因为管理员通常希望信任特定的工作流文件路径和 ref。工作流名称可以被重命名，并且多个工作流文件可以共享相同的名称。

   在映射 UI 中，将这些输入为键/值行，例如 **Key** `repository` 对应 **Value** `my-org/my-repo`, **Key** `ref` 对应 **Value** `refs/heads/main`、 **Key** `workflow_ref` 对应 **Value** `my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main`。如果任务使用了 GitHub 环境，还需要添加 **Key** `environment` 对应 **Value** `production`.

   > **注意：** 避免过于宽泛的映射，例如仅信任 `repository_owner == "my-org"`，除非该所有者命名空间下的每个代码仓库都应该能够签发 OpenAI 访问令牌。

3. **选择 OpenAI 目标。** 将 **项目** 为拥有目标服务账号的 OpenAI 项目。设置 **服务账号** 为 GitHub 工作流 可使用的 OpenAI 服务账号，例如 `github-actions-prod-deploy`.

4. **根据需要缩小 API 权限。** 选择合适的 **权限** 例如 `api.model.request` 和 `api.vector_store.read` ，以进一步缩小从此映射生成的访问令牌的范围。将权限留空可避免添加 WIF 特定的 scope 限制；令牌仍会以映射的服务账号身份进行授权。

## 在工作流中使用该令牌

配置你的 OpenAI SDK 客户端以请求 GitHub OIDC 令牌，并将其交换为 OpenAI 颁发的访问令牌。

该 工作流 必须授予 `id-token: write` 权限，并将 workload identity federation 设置传递给 SDK 代码。SDK 从 GitHub 暴露给作业的 `ACTIONS_ID_TOKEN_REQUEST_URL` 和 `ACTIONS_ID_TOKEN_REQUEST_TOKEN` 环境变量中请求 GitHub OIDC 令牌，然后使用交换得到的 OpenAI 访问令牌对 API 请求进行身份验证。

例如，通过如下 工作流 运行你的应用程序代码：

```yaml
name: deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Run OpenAI SDK code
        env:
          OPENAI_WIF_AUDIENCE: ${{ vars.OPENAI_WIF_AUDIENCE }}
          OPENAI_IDENTITY_PROVIDER_ID: ${{ vars.OPENAI_IDENTITY_PROVIDER_ID }}
          OPENAI_SERVICE_ACCOUNT_ID: ${{ vars.OPENAI_SERVICE_ACCOUNT_ID }}
        run: node ./scripts/call-openai.js
```

将 `OPENAI_WIF_AUDIENCE`, `OPENAI_IDENTITY_PROVIDER_ID`、 `OPENAI_SERVICE_ACCOUNT_ID` 存储为 GitHub Actions 变量。它们用于标识提供方和服务账号，但不是持有者凭据。

以下示例使用自定义 subject token provider 初始化 OpenAI 客户端。该 provider 会为配置的 audience 请求 GitHub OIDC 令牌，并将其用作 workload identity federation 的 subject token。

通过 GitHub Actions OIDC 令牌进行身份验证

```javascript
import OpenAI from "openai";

const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;
const audience = process.env.OPENAI_WIF_AUDIENCE;
const requestURL = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;

if (
  !identityProviderId ||
  !serviceAccountId ||
  !audience ||
  !requestURL ||
  !requestToken
) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID, OPENAI_SERVICE_ACCOUNT_ID, OPENAI_WIF_AUDIENCE, and run inside GitHub Actions with id-token: write"
  );
}

function githubActionsOIDCTokenProvider(requestURL, requestToken, audience) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const url = new URL(requestURL);
      url.searchParams.set("audience", audience);

      const response = await fetch(url, {
        headers: { Authorization: `bearer ${requestToken}` },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to request GitHub OIDC token: ${response.status} ${response.statusText}`
        );
      }

      const body = await response.json();
      if (!body.value) {
        throw new Error("GitHub OIDC token response did not include a value.");
      }

      return body.value;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: githubActionsOIDCTokenProvider(
      requestURL,
      requestToken,
      audience
    ),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from GitHub Actions workload identity federation.",
});

console.log(response.output_text);
```

```python
import json
import os
import urllib.parse
import urllib.request

from openai import OpenAI
from openai.auth import SubjectTokenProvider


def github_actions_oidc_token_provider(audience: str) -> SubjectTokenProvider:
    request_url = os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"]
    request_token = os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]

    def get_token() -> str:
        parsed_url = urllib.parse.urlparse(request_url)
        query = dict(urllib.parse.parse_qsl(parsed_url.query, keep_blank_values=True))
        query["audience"] = audience
        url = urllib.parse.urlunparse(
            parsed_url._replace(query=urllib.parse.urlencode(query))
        )

        request = urllib.request.Request(
            url,
            headers={"Authorization": f"bearer {request_token}"},
        )
        with urllib.request.urlopen(request) as response:
            payload = json.loads(response.read().decode("utf-8"))

        token = payload.get("value")
        if not token:
            raise RuntimeError("GitHub OIDC token response did not include a value.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": github_actions_oidc_token_provider(
            os.environ["OPENAI_WIF_AUDIENCE"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from GitHub Actions workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

type githubActionsOIDCTokenProvider struct {
	requestURL   string
	requestToken string
	audience     string
}

func (p githubActionsOIDCTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p githubActionsOIDCTokenProvider) GetToken(ctx context.Context, httpClient auth.HTTPDoer) (string, error) {
	if httpClient == nil {
		httpClient = http.DefaultClient
	}

	oidcURL, err := url.Parse(p.requestURL)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to parse GitHub OIDC request URL",
			Cause:    err,
		}
	}
	query := oidcURL.Query()
	query.Set("audience", p.audience)
	oidcURL.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, oidcURL.String(), nil)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to create GitHub OIDC token request",
			Cause:    err,
		}
	}
	req.Header.Set("Authorization", "bearer "+p.requestToken)

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to request GitHub OIDC token",
			Cause:    err,
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  fmt.Sprintf("GitHub OIDC token request failed with status %s", resp.Status),
		}
	}

	var body struct {
		Value string `json:"value"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to decode GitHub OIDC token response",
			Cause:    err,
		}
	}
	if body.Value == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "GitHub OIDC token response did not include a value",
		}
	}

	return body.Value, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: githubActionsOIDCTokenProvider{
				requestURL:   os.Getenv("ACTIONS_ID_TOKEN_REQUEST_URL"),
				requestToken: os.Getenv("ACTIONS_ID_TOKEN_REQUEST_TOKEN"),
				audience:     os.Getenv("OPENAI_WIF_AUDIENCE"),
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from GitHub Actions workload identity federation."),
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

public final class GitHubActionsWorkloadIdentityExample {
  private GitHubActionsWorkloadIdentityExample() {}

  static final class GitHubActionsOidcTokenProvider implements SubjectTokenProvider {
    private final String requestUrl;
    private final String requestToken;
    private final String audience;

    GitHubActionsOidcTokenProvider(String requestUrl, String requestToken, String audience) {
      this.requestUrl = requestUrl;
      this.requestToken = requestToken;
      this.audience = audience;
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(com.openai.core.http.HttpClient httpClient, JsonMapper jsonMapper) {
      try {
        String separator = requestUrl.contains("?") ? "&" : "?";
        URI uri =
            URI.create(
                requestUrl
                    + separator
                    + "audience="
                    + URLEncoder.encode(audience, StandardCharsets.UTF_8));

        HttpRequest request =
            HttpRequest.newBuilder(uri)
                .header("Authorization", "bearer " + requestToken)
                .GET()
                .build();

        HttpResponse<String> response =
            java.net.http.HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
          throw new SubjectTokenProviderException(
              "github-actions",
              "GitHub OIDC token request failed with status " + response.statusCode(),
              null);
        }

        JsonNode payload = jsonMapper.readTree(response.body());
        String token = payload.path("value").asText("");
        if (token.isEmpty()) {
          throw new SubjectTokenProviderException(
              "github-actions", "GitHub OIDC token response did not include a value", null);
        }

        return token;
      } catch (SubjectTokenProviderException e) {
        throw e;
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "github-actions", "failed to request GitHub OIDC token", e);
      }
    }

    @Override
    public CompletableFuture<String> getTokenAsync(
        com.openai.core.http.HttpClient httpClient, JsonMapper jsonMapper) {
      return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
    }
  }

  public static void main(String[] args) {
    WorkloadIdentity workloadIdentity =
        WorkloadIdentity.builder()
            .identityProviderId(System.getenv("OPENAI_IDENTITY_PROVIDER_ID"))
            .serviceAccountId(System.getenv("OPENAI_SERVICE_ACCOUNT_ID"))
            .provider(
                new GitHubActionsOidcTokenProvider(
                    System.getenv("ACTIONS_ID_TOKEN_REQUEST_URL"),
                    System.getenv("ACTIONS_ID_TOKEN_REQUEST_TOKEN"),
                    System.getenv("OPENAI_WIF_AUDIENCE")))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from GitHub Actions workload identity federation.")
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
require "json"
require "net/http"
require "openai"
require "uri"

class GitHubActionsOIDCTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  def initialize(request_url:, request_token:, audience:)
    @request_url = request_url
    @request_token = request_token
    @audience = audience
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    uri = URI(@request_url)
    params = URI.decode_www_form(uri.query || "")
    params.reject! { |key, _| key == "audience" }
    params << ["audience", @audience]
    uri.query = URI.encode_www_form(params)

    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "bearer #{@request_token}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "GitHub OIDC token request failed with status #{response.code}",
        provider: "github-actions"
      )
    end

    token = JSON.parse(response.body).fetch("value", "").to_s
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "GitHub OIDC token response did not include a value",
        provider: "github-actions"
      )
    end

    token
  rescue JSON::ParserError, SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request GitHub OIDC token: #{e.message}",
      provider: "github-actions",
      cause: e
    )
  end
end

provider = GitHubActionsOIDCTokenProvider.new(
  request_url: ENV.fetch("ACTIONS_ID_TOKEN_REQUEST_URL"),
  request_token: ENV.fetch("ACTIONS_ID_TOKEN_REQUEST_TOKEN"),
  audience: ENV.fetch("OPENAI_WIF_AUDIENCE")
)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from GitHub Actions workload identity federation."
)

puts(response.output_text)
```


## GitHub Actions 最佳实践

- 为生产部署使用环境保护。要求在工作流访问生产 OpenAI 资源之前进行审批或分支限制。
- 按存储库限制映射。尽可能按存储库特定的声明进行匹配，而不是允许组织内所有存储库访问。
- 按分支或 工作流 限制映射。考虑匹配如下声明 `repository`, `ref`, `environment`，或 `workflow_ref` 以限制令牌签发。
- 为 CI/CD 和生产工作负载使用单独的 OpenAI 服务帐户。构建管道通常需要与已部署应用程序不同的权限。
- 避免授予来自不受信任 fork 的拉取请求访问权限。Fork 拉取请求可能执行攻击者控制的代码，不应获得生产凭据。
- 使用短期交换。GitHub OIDC 令牌用于临时身份验证，仅在需要时进行交换。
- 审计存储库所有权变更。存储库的转移、重命名和权限变更可能会影响现有映射背后的安全假设。
- 优先采用精确声明匹配。按如下声明进行匹配 `repository`, `ref`，以及 `environment` ，而不是依赖组织范围的信任关系。