# 为 GitHub Actions 配置工作负载身份联合

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

将 GitHub Actions 用作 Workload Identity Provider，通过交换 GitHub 签发的 OIDC 令牌来获取一个短期有效的 OpenAI 访问令牌。这使得工作流能够在 GitHub secrets 中不存储长期有效的 OpenAI 密钥的情况下，向 API API 进行身份验证。

对于 Codex，使用此页面获取并检查 GitHub 令牌，然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向 Codex。本页面中的服务账号映射与 SDK 示例同样适用于 OpenAI API。

GitHub 可以为一个已配置相应 `id-token: write` 权限并请求身份令牌的 工作流 任务签发一个已签名的 OIDC JWT。OpenAI 会在签发 OpenAI 访问令牌之前，校验令牌的颁发者、受众、签名以及映射属性。

## 设置 GitHub Actions

授予 工作流 或作业请求 GitHub OIDC 令牌的权限：

```yaml
permissions:
  id-token: write
  contents: read
```

该 `id-token: write` 权限允许该作业请求 OIDC JWT，但不会授予仓库内容的写权限。 `contents: read` 权限是 `actions/checkout`.

使用你在 OpenAI Workload Identity Provider 中配置的精确 audience 来请求令牌。自定义 JavaScript 操作可以调用 `core.getIDToken("your-wif-audience")`；shell 步骤可以直接调用 GitHub 的 OIDC 请求 URL。包含保留 URL 字符的 audience 值，例如 `https://api.openai.com/v1`，应在附加到请求 URL 之前进行 URL 编码：

```bash
AUDIENCE="https://api.openai.com/v1"
ENCODED_AUDIENCE=$(jq -rn --arg audience "$AUDIENCE" '$audience | @uri')

TOKEN=$(curl -sSf -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
  "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=${ENCODED_AUDIENCE}" | jq -r .value)
export TOKEN
```

重要的 GitHub OIDC 声明包括：

- `iss`：令牌颁发者。对于 GitHub Actions 来说，该值为 `https://token.actions.githubusercontent.com`.
- `aud`：工作流请求的 audience 值。请将 OpenAI 配置为要求完全匹配你所请求的值，例如 `your-wif-audience` 或 `https://api.openai.com/v1`.
- `sub`：主体 subject 字符串。GitHub 会根据工作流的元数据（例如仓库、分支、标签、拉取请求或环境）来构造它。
- `repository`：运行该工作流的仓库，例如 `my-org/my-repo`.
- `repository_owner`：拥有该仓库的组织或用户，例如 `my-org`.
- `ref`：触发该工作流的 Git 引用，例如 `refs/heads/main` 或 `refs/tags/v1.0.0`.
- `workflow`：工作流声明。请使用 GitHub 实际发出的声明值，例如 `deploy` ，如果这就是你作业中的工作流声明。
- `workflow_ref`：工作流文件路径及引用，例如 `my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main`.
- `environment`：GitHub 环境名称，例如 `production`，当作业使用了某个环境时。
- `run_id`, `run_number`, `run_attempt`，以及 `job_workflow_ref`：可用于审计或更高级信任规则的运行和作业标识符。

有关完整的声明列表和主题格式，请参阅 GitHub 的 [OpenID Connect 参考](https://docs.github.com/en/actions/reference/security/oidc).

## 验证令牌

在配置工作负载身份联合之前，请将 GitHub OIDC 令牌导出为 `TOKEN`，然后在该工作流 运行器中运行以下脚本来检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令会解码 JWT 负载，但不验证令牌签名。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。切勿记录原始的 GitHub OIDC 令牌或交换后得到的 OpenAI 访问令牌。

一个解码后的 GitHub Actions OIDC 令牌看起来类似于：

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

使用解码后的负载，比较你收到的令牌与在 OpenAI 中配置的 issuer、audience 和映射值。大多数配置问题都可在交换令牌之前的 `iss`, `aud`, `repository`, `ref`，和 `workflow_ref` 声明中看到。

## 设置工作负载身份联合

在 OpenAI 中为 GitHub Actions 创建工作负载身份提供方，然后添加与你要信任的 GitHub 工作流 声明相匹配的服务账号映射。

先配置工作负载身份提供方，再创建服务账号映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `github-actions-prod`。使用 **Description**，例如 `Production GitHub Actions workflows`，以帮助管理员识别该提供方。

2. **设置 issuer 和 audience。** 将 **OIDC Issuer URL** 设置为 `https://token.actions.githubusercontent.com`。将 **Audience** 设置为你的 工作流 请求所指定的具体 audience，例如 `your-wif-audience` 或 `https://api.openai.com/v1`.

3. **使用 GitHub OIDC 发现。** 保持 **Use uploaded JWKS for token verification** 为关闭状态。OpenAI 会使用 GitHub 的 OIDC 发现元数据和 JWKS 来验证 GitHub 签名的令牌。

4. **仅当你需要派生映射属性时，才添加属性转换。** 原始的 GitHub 声明，例如 `repository`, `ref`，以及 `workflow` 可在映射断言中直接使用。如果创建派生属性，仪表板会自动添加 `openai.` 前缀；例如，输入 `github_repository` 配合表达式 `assertion.repository` 可创建 `openai.github_repository`。已以 `openai.` 开头的原始 token 声明在 `openai.` 映射键时被忽略，除非配置了匹配转换。

### 设置服务账号映射

1. **创建一个服务账号映射。** 将 **Name** 为 Workload Identity Provider 中的唯一值，例如 `github-actions-main-deploy`。使用 **Description**，例如 `Production deploy workflow on main`，以说明哪个工作流可以使用该映射。

2. **添加精确的声明断言。** 添加一个 **键** 和 **值** 行，每个必须匹配的 GitHub 声明各占一行。OpenAI 要求所有已配置的行都匹配后才会签发访问令牌。对于生产部署的工作流，请使用如下断言：

```text
   iss == "https://token.actions.githubusercontent.com"
   aud == "https://api.openai.com/v1"
   repository == "my-org/my-repo"
   ref == "refs/heads/main"
   workflow_ref == "my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main"
```

   建议优先 `workflow_ref` 使用 `workflow` 进行特权映射，因为管理员通常希望信任特定的工作流文件路径和 ref。工作流名称可以被重命名，并且多个工作流文件可以共享相同的名称。

   在映射界面中，将这些作为键/值行输入，例如 **键** `repository` 与 **值** `my-org/my-repo`, **键** `ref` 与 **值** `refs/heads/main`，和 **键** `workflow_ref` 与 **值** `my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main`。如果任务使用了 GitHub 环境，还需要添加 **键** `environment` 与 **值** `production`.

   > **注意：** 避免过于宽泛的映射，例如仅信任 `repository_owner == "my-org"`，除非该所有者命名空间下的每个代码仓库都应该能够生成 OpenAI 访问令牌。

3. **选择 OpenAI 目标。** 将 **Project** 设置为拥有该目标服务账号的 OpenAI 项目。 **Service account** 设置为 GitHub 工作流 可以使用的 OpenAI 服务账号，例如 `github-actions-prod-deploy`.

4. **如需要，收窄 API 权限。** 选择合适的 **Permissions** 例如 `api.model.request` 和 `api.vector_store.read` 以进一步收窄从此映射生成的访问令牌的范围。将权限留空可避免添加 WIF 特定的 scope 限制；该令牌仍然以映射的服务账号身份授权。

## 在工作流中使用该令牌

配置你的OpenAI SDK 客户端以请求 GitHub OIDC 令牌，并将其兑换为 OpenAI 颁发的访问令牌。

工作流 必须授予 `id-token: write` 相应权限，并将工作负载身份联合配置传递给 SDK 代码。SDK 从 GitHub 向任务暴露的 `ACTIONS_ID_TOKEN_REQUEST_URL` 和 `ACTIONS_ID_TOKEN_REQUEST_TOKEN` 环境变量中请求 GitHub OIDC 令牌，然后使用兑换得到的 OpenAI 访问令牌对 API 请求进行身份验证。

例如，像这样从工作流运行你的应用代码：

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

将它们存储 `OPENAI_WIF_AUDIENCE`, `OPENAI_IDENTITY_PROVIDER_ID`，和 `OPENAI_SERVICE_ACCOUNT_ID` 为 GitHub Actions 变量。它们标识提供方和服务账户，但不是持有者凭据。

以下示例使用自定义 subject token provider 初始化一个 OpenAI 客户端。该 provider 会为配置的 audience 请求 GitHub OIDC token，并将其用作 workload identity federation 的 subject token。

使用 GitHub Actions OIDC token 进行身份验证

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

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
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

- 对生产部署使用环境保护。要求在工作流访问生产 OpenAI 资源前进行审批或施加分支限制。
- 按仓库限制映射。尽可能基于仓库特定的声明进行匹配，避免允许组织内所有仓库访问。
- 按分支或 工作流 限制映射。考虑匹配诸如 `repository`, `ref`, `environment`，或 `workflow_ref` 等声明，以限制令牌签发。
- 为 CI/CD 和生产工作负载使用单独的 OpenAI 服务账号。构建流水线通常需要与已部署应用不同的权限。
- 避免向来自不受信任 fork 的拉取请求授予访问权限。Fork 拉取请求可能执行攻击者控制的代码，不应获取生产凭据。
- 使用短期交换。GitHub OIDC 令牌用于临时身份验证，只在需要时进行交换。
- 审计仓库所有权变更。仓库转让、重命名和权限变更可能影响现有映射背后的安全假设。
- 优先进行精确声明匹配。基于诸如 `repository`, `ref`，以及 `environment` 等声明进行匹配，而不是依赖组织范围内的信任关系。