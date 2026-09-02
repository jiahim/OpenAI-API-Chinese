# 为 AWS 配置工作负载身份联合

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在以下任意场景中，将 AWS 用作工作负载身份提供方：

- **AWS 出站身份联合：** 将 AWS STS 颁发的 OIDC JWT 兑换为 `GetWebIdentityToken` 短期有效的 OpenAI 访问令牌。
- **Amazon EKS：** 将投影的 Amazon EKS 服务账户令牌兑换为短期有效的 OpenAI 访问令牌。

对于 Codex，使用本页获取并检查 AWS 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向 Codex。本页中的服务账号映射和 SDK 示例适用于 OpenAI API。

OpenAI 支持来自出站身份联合的、由 AWS 颁发的 OIDC JWT，以及
  由 Amazon EKS 颁发的 Kubernetes 投射服务账号令牌。OpenAI 不
  支持 SigV4 签名的请求或 AWS STS 临时访问密钥凭据
  用作工作负载身份联合的主体令牌。



## AWS 出站身份联合

AWS 出站身份联合允许 AWS 主体从 AWS STS 请求已签名的 OIDC JWT，并将该令牌出示给外部服务。在 OpenAI 工作负载身份联合中，AWS 颁发的 JWT 是 OpenAI 在签发 OpenAI 访问令牌之前进行验证的主体令牌。

### 设置 AWS 出站身份联合

为将颁发令牌的 AWS 账户启用出站身份联合。设置详情请参阅 AWS 指南， [出站身份联合入门](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_outbound_getting_started.html).

```bash
aws iam enable-outbound-web-identity-federation
```

记录由 AWS 返回的账户特定颁发者 URL。你需要将该值配置为 OpenAI 工作负载身份提供程序的颁发者，并且它必须与 `iss` AWS 颁发的令牌中的声明匹配。

AWS STS `GetWebIdentityToken` API 在 STS 全局
  终端节点上不可用。请将 AWS CLI 或 SDK 配置为使用区域性的 STS 终端节点。

授予该工作负载调用 `sts:GetWebIdentityToken`。的权限。在 IAM 中限制受众和最长令牌生命周期，以便 AWS 主体只能为 OpenAI 颁发令牌。以下示例允许针对受众 `https://api.openai.com/v1` 颁发最长生命周期为 300 秒的令牌：

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

使用你将在 OpenAI 工作负载身份提供程序上配置的相同受众，向 AWS 申请一个 OIDC 令牌。请使用 `ES384` ，除非你的环境需要 `RS256` 兼容性。

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

在配置工作负载身份联合之前，将 AWS 颁发的令牌导出为 `TOKEN`，然后在本地运行此脚本以检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令在验证令牌签名之前解码 JWT 载荷。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 AWS 颁发的 OIDC 令牌将类似于：

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

并非每个 AWS 颁发的令牌都包含所有 AWS 特有的声明。以下项下的声明 `https://sts.amazonaws.com/` 取决于调用主体、会话上下文和请求标签。

验证你计划在 OpenAI 中配置的声明：

- `iss`:必须与 OpenAI Workload Identity Provider 中配置的 AWS 账户特定的 issuer URL 相匹配。
- `aud`:必须与 `GetWebIdentityToken` audience 以及 OpenAI Workload Identity Provider 的 audience 相匹配。
- `sub`:标识请求该令牌的 IAM principal ARN。优先匹配完全匹配的角色 ARN。
- AWS 特有的 claims：在匹配账户、组织、principal tag 或 request tag 的值之前，请使用解码后的令牌作为事实来源。

使用解码后的负载，将你收到的令牌与 OpenAI 中配置的 issuer、audience 和 mapping 值进行比较。大多数配置问题都可以在 `iss`, `aud`，以及 `sub` 声明中看到，请在交换令牌前进行检查。

### 设置工作负载身份联合

在 OpenAI 中为 AWS 账户签发方创建一个 Workload Identity Provider，然后添加一个匹配 AWS 颁发令牌中稳定声明（stable claims）的服务账号映射。

请先配置 Workload Identity Provider，然后再创建服务账号映射。

#### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `aws-outbound-prod`。使用 **Description**（例如 `Production AWS outbound identity federation workloads`）帮助管理员识别该 provider。

2. **设置 issuer 和 audience。** 将 **将 OIDC Issuer URL** 设置为启用出站身份联合时返回的 AWS 账户特定 issuer URL。该值必须与令牌中的 `iss` 声明匹配。将 **Audience** 设置为传递给 `GetWebIdentityToken`。的同一个 audience。在本例中，该值为 `https://api.openai.com/v1`.

3. **使用 AWS OIDC 发现。** 将 **Use uploaded JWKS for token verification** 保持禁用。OpenAI 使用 AWS issuer 的 OIDC 发现元数据和 JWKS 来验证 AWS 颁发的令牌。

4. **仅在需要派生映射属性时才添加属性转换。** 原始令牌匹配支持顶级标量声明，例如 `sub`, `aud`，以及 `iss`。AWS 特定的命名空间声明嵌套在 `https://sts.amazonaws.com/`，之下，因此请使用 CEL 方括号表示法创建派生属性后再在映射中引用。例如，输入 `aws_environment` ，表达式为 `assertion["https://sts.amazonaws.com/"]["principal_tags"]["environment"]` ，即可创建 `openai.aws_environment` ，源自上述解码后的令牌示例。请在样本令牌中验证嵌套声明路径后再使用；如果某个变换无法求值，映射解析将失败。已以 `openai.` 开头的原始令牌声明在 `openai.` 映射键中将被忽略，除非配置了匹配的变换。

#### 设置服务账号映射

1. **创建一个服务账号映射。** 将 **Name** 为一个在 Workload Identity Provider 内唯一的值，例如 `aws-role-openai-wif`。使用 **Description**（例如 `Production AWS role for OpenAI API workload`，以说明哪些工作负载可以使用该映射。

2. **匹配 AWS 主体。** 将 **Key** 为 `sub` ， **Value** 为解码后令牌中的 IAM 主体 ARN，例如 `arn:aws:iam::123456789012:role/OpenAIWifRole`。对精确的 `sub` 声明进行匹配可以为 AWS 出站身份联合提供最强的隔离。

3. **根据需要添加额外的声明匹配。** 你可以匹配任何可用的标量声明或转换后的属性。例如，如果需要额外的信任边界，可以使用从 AWS 账户、组织、主体标签或请求标签声明派生的转换后属性。

4. **选择 OpenAI 目标。** 将 **Project** 为拥有目标服务账号的 OpenAI 项目。将 **Service account** 设置为 AWS 工作负载可以使用的 OpenAI 服务账号，例如 `aws-outbound-prod-openai-wif`.

5. **根据需要收窄 API 权限。** 选择合适的 **Permissions** such as `api.model.request` ， `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

### 在代码中使用 token

配置你的 OpenAI SDK 客户端，向 AWS STS 请求 AWS 颁发的 OIDC 令牌，并将其兑换为 OpenAI 颁发的访问令牌。

将 `OPENAI_WIF_AUDIENCE` 设置为在 OpenAI Workload Identity Provider 上配置的相同受众。subject token provider 使用该受众调用 AWS STS， `GetWebIdentityToken` 返回 AWS 颁发的 JWT 作为 subject token，并由 OpenAI SDK 将其兑换为 OpenAI 颁发的访问令牌。

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


  


  


## Amazon EKS projected service account tokens

使用 Amazon EKS 作为工作负载身份提供者，通过将 EKS 颁发的投影服务账户令牌交换为短期 OpenAI 访问令牌。

### 设置 EKS

使用 Kubernetes `ServiceAccount` 为需要调用 OpenAI API 的 EKS 工作负载创建（如果你还没有）：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

EKS 投影的服务账户令牌使用 `sub` 声明，格式为 `system:serviceaccount:<namespace>:<service-account-name>`。对于上述服务账户， `sub` 声明为 `system:serviceaccount:default:openai-wif`.

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

你在 OpenAI Workload Identity Provider 中配置的颁发者必须与此颁发者 URL 以及 `iss` EKS 投影的服务账户令牌中的声明匹配。

使用 OpenAI 期望的受众（audience）以及适合你工作负载的过期时间来配置投影的服务账户令牌。OpenAI 会校验令牌的颁发者、签名、受众和过期时间。在本例中，令牌文件挂载到 `/var/run/secrets/tokens/token`，使用的受众为 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投影令牌的受众与 OpenAI Workload Identity Provider 的受众一致，你也可以使用其他受众：

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

### 验证 EKS token

在配置工作负载身份联合之前，请在本地解码一个示例的投影服务账户令牌并检查其声明。在已挂载投影令牌的运行中 Pod 中，获取该令牌并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行以下脚本：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令在验证令牌签名之前解码 JWT 载荷。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 EKS 投影服务账户令牌类似如下：

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

使用解码后的负载，将你收到的令牌与 OpenAI 中配置的 issuer、audience 和 mapping 值进行比较。大多数配置问题都可以在 `iss`, `aud`，以及 `sub` 声明中看到，请在交换令牌前进行检查。

### 设置工作负载身份联合

在 OpenAI 中为 EKS 签发方创建一个 Workload Identity Provider，然后添加一个与投影令牌中属性相匹配的服务账户映射。

请先配置 Workload Identity Provider，然后再创建服务账号映射。

#### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `aws-eks-prod`。使用 **Description**（例如 `Production EKS cluster`，以帮助管理员识别该集群。

2. **设置 issuer 和 audience。** 将 **将 OIDC Issuer URL** 设置为由以下内容返回的签发者 `aws eks describe-cluster --query "cluster.identity.oidc.issuer"`。此值必须与 `iss` 投影的 EKS 服务账户令牌中的声明匹配。设置 **Audience** 为投影的服务账户令牌卷上配置的相同受众。在本例中，该值为 `https://api.openai.com/v1`.

3. **使用 EKS OIDC 发现。** 将 **Use uploaded JWKS for token verification** 已禁用。OpenAI 使用 EKS 签发者的 OIDC 发现元数据和 JWKS 来验证投影的服务账户令牌。

4. **仅在需要派生映射属性时才添加属性转换。** 原始令牌声明，例如 `sub`, `aud`，以及 `iss` 可直接用于映射断言。例如，创建名为 `subject` ，表达式为 `assertion.sub`。的转换属性。在控制台中，输入 `subject` 作为属性名；OpenAI 将其存储为 `openai.subject`，你可以在映射中引用该值。

   > **注意：** 已以以下内容开头的原始令牌声明 `openai.` 开头的原始令牌声明在 `openai.` 映射键中将被忽略，除非配置了匹配的变换。

#### 设置服务账号映射

1. **创建一个服务账号映射。** 将 **Name** 设置为 Workload Identity Provider 内的唯一值，例如 `openai-mapping-eks`。使用 **Description**（例如 `Workload Identity Provider Mapping for EKS Workloads`，以说明哪些工作负载可以使用该映射。

2. **匹配 EKS 服务账户主体。** 将 **Key** 为 `sub` ， **Value** 为 `system:serviceaccount:default:openai-wif`。你可以匹配任意可用的声明或转换属性。匹配 `sub` 是限制最严格的选项，因为它能唯一标识一个 Kubernetes 服务账户。

3. **选择 OpenAI 目标。** 将 **Project** 为拥有目标服务账号的 OpenAI 项目。将 **Service account** 设置为 EKS 工作负载可使用的 OpenAI 服务账户，例如 `aws-eks-prod-openai-wif`。检查 `Create a new service account in this project` 如果你希望为此映射新建一个服务账号而不是复用现有的服务账号。

4. **根据需要收窄 API 权限。** 选择合适的 **Permissions** such as `api.model.request` ， `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

### 在代码中使用 token

配置你的 OpenAI SDK 客户端，以读取已投射的 EKS 服务账户令牌，并将其交换为 OpenAI 颁发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供方的主题令牌来源。SDK 将该 EKS 令牌交换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义主题令牌提供方初始化 OpenAI 客户端。该提供方从挂载的文件路径读取已投射的 EKS 服务账户令牌，并将其用作工作负载身份联合的主题令牌。

使用 EKS 投射的服务账户令牌进行身份验证

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



## AWS best practices

- 为每个工作负载使用专用的 AWS 身份。为 AWS 出站身份联合使用独立的 IAM 角色，并为 EKS 工作负载使用独立的 Kubernetes 服务账户。
- 为 OpenAI 访问配置专用的 audience。在 AWS 签发或 EKS 投影的令牌以及 OpenAI Workload Identity Provider 配置中使用相同的 audience 值。
- 将令牌生命周期保持得合理较短。对于 AWS 出站身份联合，使用 IAM 条件，例如 `sts:DurationSeconds`；对于 EKS，设置合适的投影令牌过期时间。
- 优先使用精确的主体匹配。对 AWS 出站令牌匹配完整的 IAM 主体 ARN，或对 EKS 令牌匹配完整的 Kubernetes 服务账户主体。
- 将映射范围限定在稳定的边界。使用账户、组织、命名空间或转换后的属性，前提是它们能在不创建广泛信任规则的前提下缩小访问范围。
- 在交换令牌时重新加载令牌。按需请求 AWS 出站令牌，并从挂载的文件路径读取 EKS 投影令牌，以便自动获取轮换后的令牌。
- 仅授予工作负载所需的权限。使用映射级别的权限进一步收窄目标 OpenAI 服务账户所授予的访问权限。