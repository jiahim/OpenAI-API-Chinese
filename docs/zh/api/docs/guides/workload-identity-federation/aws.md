# 为 AWS 配置工作负载身份联合

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

在以下任一场景中，将 AWS 用作工作负载身份提供方：

- **AWS 出站身份联合：** 从 AWS STS 签发的 OIDC JWT 交换 `GetWebIdentityToken` 为短期 OpenAI 访问令牌。
- **Amazon EKS：** 将投影的 Amazon EKS 服务账户令牌交换为短期 OpenAI 访问令牌。

对于 Codex，请使用此页面获取并检查 AWS 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) ，将该令牌写入文件并让 Codex 指向该文件。本页中的服务账户映射和 SDK 示例适用于 OpenAI API。

OpenAI 支持来自出站身份联邦的 AWS 签发的 OIDC JWT，以及
  由 Amazon EKS 签发的 Kubernetes 投影服务账户令牌。OpenAI 不
  支持 SigV4 签名的请求或 AWS STS 临时访问密钥凭据
  作为工作负载身份联邦的主题令牌。



## AWS 出站身份联合

AWS 出站身份联合允许 AWS 主体从 AWS STS 请求签名的 OIDC JWT，并将该令牌提供给外部服务。在 OpenAI 工作负载身份联合中，AWS 签发的 JWT 是主题令牌，OpenAI 在签发 OpenAI 访问令牌之前会对其进行验证。

### 设置 AWS 出站身份联合

为将要签发令牌的 AWS 账户启用出站身份联合。有关设置详情，请参阅 AWS 指南： [出站身份联合入门](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_outbound_getting_started.html).

```bash
aws iam enable-outbound-web-identity-federation
```

记录 AWS 返回的账户专属签发方 URL。你将把此值配置为 OpenAI Workload Identity Provider 的签发方，并且它必须与 AWS 签发令牌中的 `iss` 声明匹配。

AWS STS `GetWebIdentityToken` API 在 STS 全局
  端点上不可用。请将 AWS CLI 或 SDK 配置为使用区域 STS 端点。

授予工作负载调用 `sts:GetWebIdentityToken`。的权限。在 IAM 中限制受众和最大令牌生存时间，以便 AWS 主体只能为 OpenAI 铸造令牌。此示例允许为受众 `https://api.openai.com/v1` 签发令牌，最大生存时间为 300 秒：

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

请求一个 AWS 签发的 OIDC 令牌，受众与你将在 OpenAI Workload Identity Provider 上配置的受众相同。使用 `ES384` 除非你的环境需要 `RS256` 兼容性。

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

在配置工作负载身份联合之前，请将 AWS 颁发的令牌导出为 `TOKEN`，然后在本地运行此脚本以检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令解码 JWT 负载，但不验证令牌签名。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 AWS 颁发的 OIDC 令牌将类似如下：

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

并非每个 AWS 颁发的令牌都包含每个 AWS 特定的声明。以下是 `https://sts.amazonaws.com/` 下的声明取决于调用主体、会话上下文和请求标签。

验证你计划在 OpenAI 中配置的声明：

- `iss`：必须与在 OpenAI Workload Identity Provider 中配置的 AWS 账户特定签发者 URL 匹配。
- `aud`：必须与 `GetWebIdentityToken` 受众以及 OpenAI Workload Identity Provider 受众匹配。
- `sub`：标识请求令牌的 IAM 主体 ARN。建议匹配精确的角色 ARN。
- AWS 特定声明：在匹配账户、组织、主体标签或请求标签值之前，将解码后的令牌作为事实来源。

使用解码后的载荷，将收到的令牌与 OpenAI 中配置的签发者、受众和映射值进行比较。大多数配置问题都可见于 `iss`, `aud`、以及 `sub` 在交换令牌之前的声明中。

### 设置工作负载身份联合

在 OpenAI 中为 AWS 账户颁发者创建工作负载身份提供者，然后添加服务账户映射，以匹配来自 AWS 颁发令牌的稳定声明。

首先配置工作负载身份提供者，然后创建服务账户映射。

#### 设置工作负载身份提供程序

1. **创建工作负载身份提供方（Workload Identity Provider）。** 将 **名称** 设置为唯一值，例如 `aws-outbound-prod`。使用 **描述**，例如 `Production AWS outbound identity federation workloads`，以帮助管理员识别该提供方。

2. **设置签发方（issuer）和受众（audience）。** 将 **OIDC 签发方 URL** 设置为启用出站身份联合时返回的 AWS 账户专用签发方 URL。该值必须与令牌的 `iss` 声明匹配。将 **受众** 设置为传递给 `GetWebIdentityToken`。的相同受众。在本示例中，该值为 `https://api.openai.com/v1`.

3. **使用 AWS OIDC 发现。** 保持 **使用上传的 JWKS 进行令牌验证** 为禁用状态。 OpenAI 使用 AWS 签发方的 OIDC 发现元数据和 JWKS 来验证 AWS 签发的令牌。

4. **仅当需要派生映射属性时，才添加属性转换。** 原始令牌匹配支持顶层标量声明，例如 `sub`, `aud`，以及 `iss`。AWS 特定的命名空间声明嵌套在 `https://sts.amazonaws.com/`，下，因此在使用它们进行映射之前，请使用 CEL 方括号表示法创建派生属性。例如，输入 `aws_environment` 并使用表达式 `assertion["https://sts.amazonaws.com/"]["principal_tags"]["environment"]` 来创建 `openai.aws_environment` ，基于上述解码令牌示例。使用前，请在示例令牌中验证嵌套声明路径；如果转换无法评估，映射解析将失败。已以 `openai.` 开头的原始令牌声明，除非配置了匹配的转换，否则将被忽略 `openai.` 用于映射键。

#### 设置服务账号映射

1. **创建服务账户映射。** 将 **Name** 设置为在 Workload Identity Provider 内唯一的值，例如 `aws-role-openai-wif`。使用 **Description**，例如 `Production AWS role for OpenAI API workload`，来解释哪些工作负载可以使用此映射。

2. **匹配 AWS 主体。** 将 **Key** 设置为 `sub` 和 **Value** 设置为解码令牌中的 IAM 主体 ARN，例如 `arn:aws:iam::123456789012:role/OpenAIWifRole`。匹配精确的 `sub` 声明可为 AWS 出站身份联合提供最强的隔离。

3. **如有需要，添加额外的声明匹配。** 你可以匹配任何可用的标量声明或转换后的属性。例如，如果你需要额外的信任边界，可以使用源自 AWS 账户、组织、主体标签或请求标签声明的转换属性。

4. **选择 OpenAI 目标。** 将 **Project** 设置为拥有目标服务账户的 OpenAI 项目。将 **Service account** 设置为 AWS 工作负载可使用的 OpenAI 服务账户，例如 `aws-outbound-prod-openai-wif`.

5. **如需要，缩小 API 权限范围。** 选择适当的 **Permissions** ，例如 `api.model.request` 和 `api.vector_store.read` ，以进一步限制从此映射铸造的访问令牌。将权限留空以避免添加 WIF 特定的范围限制；令牌仍可授权为映射的服务账户。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以从 AWS STS 请求 AWS 颁发的 OIDC 令牌，并将其交换为 OpenAI 颁发的访问令牌。

设置 `OPENAI_WIF_AUDIENCE` 为与在 OpenAI Workload Identity Provider 上配置的受众相同。主题令牌提供程序使用该受众调用 AWS STS `GetWebIdentityToken` ，返回 AWS 颁发的 JWT 作为主题令牌，并且 OpenAI SDK 将其交换为 OpenAI 颁发的访问令牌。

从 AWS 颁发的 OIDC 令牌进行身份验证

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


  


  


## Amazon EKS 投射服务账户令牌

通过将 EKS 签发的投影服务账户令牌交换为短期 OpenAI 访问令牌，将 Amazon EKS 用作工作负载身份提供者。

### 设置 EKS

使用一个 Kubernetes `ServiceAccount` 来处理需要调用 OpenAI API 的 EKS 工作负载。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

EKS 投射的服务账户令牌使用 `sub` 声明，其格式为 `system:serviceaccount:<namespace>:<service-account-name>`。对于上述服务账户， `sub` 声明为 `system:serviceaccount:default:openai-wif`.

检索与 EKS 集群关联的 OIDC 签发者 URL：

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

你在 OpenAI 工作负载身份提供程序中配置的签发者必须与此签发者 URL 匹配，并且 `iss` 声明必须与投射的 EKS 服务账户令牌中的声明匹配。

配置投射的服务账户令牌，使用 OpenAI 期望的受众，并设置适合你工作负载的过期时间。OpenAI 会验证令牌的签发者、签名、受众和过期时间。在此示例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用受众 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投射令牌受众与 OpenAI 工作负载身份提供程序的受众匹配，你也可以使用不同的受众：

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

在配置工作负载身份联合之前，先在本地解码一个示例投射服务账户令牌并检查其声明。从挂载有投射令牌的运行中的 Pod 中检索该令牌并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行此脚本：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令解码 JWT 负载而不验证令牌签名。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 EKS 投射服务账户令牌将类似于：

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

使用解码后的负载，将你收到的令牌与在 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题在 `iss`, `aud`，和 `sub` 声明中即可发现，无需先交换令牌。

### 设置工作负载身份联合

在 OpenAI 中为 EKS 签发者创建工作负载身份提供者，然后添加一个服务账户映射，以匹配来自投影令牌的属性。

先配置工作负载身份提供者，再创建服务账户映射。

#### 设置工作负载身份提供商

1. **创建工作负载身份提供者。** 将 **名称** 设置为唯一值，例如 `aws-eks-prod`。使用 **描述**，例如 `Production EKS cluster`，以帮助管理员识别集群。

2. **设置颁发者和受众。** 将 **OIDC 颁发者 URL** 设置为 `aws eks describe-cluster --query "cluster.identity.oidc.issuer"`。返回的颁发者。此值必须与投影的 EKS 服务账户令牌中的 `iss` 声明匹配。将 **受众** 设置为与投影的服务账户令牌卷上配置的受众相同。在此示例中，该值为 `https://api.openai.com/v1`.

3. **使用 EKS OIDC 发现。** 保持 **使用上传的 JWKS 进行令牌验证** 为禁用状态。OpenAI 使用 EKS 颁发者的 OIDC 发现元数据和 JWKS 来验证投影的服务账户令牌。

4. **仅在需要派生映射属性时才添加属性转换。** 诸如原始令牌声明 `sub`, `aud`，以及 `iss` 可直接用于映射断言。例如，创建名为 `subject` 的转换属性，其表达式为 `assertion.sub`。在仪表板中，输入 `subject` 作为属性名称；OpenAI将其存储为 `openai.subject`，可在映射中引用。

   > **注意：** 已以 `openai.` 开头的原始令牌声明在用于 `openai.` 映射键时会被忽略，除非配置了匹配的转换。

#### 设置服务账号映射

1. **创建服务账号映射。** 设置 **名称** 为工作负载身份提供者中的唯一值，例如 `openai-mapping-eks`。使用 **描述**，例如 `Workload Identity Provider Mapping for EKS Workloads`，以说明哪些工作负载可以使用该映射。

2. **匹配 EKS 服务账号主体。** 设置 **键** 为 `sub` 和 **值** 为 `system:serviceaccount:default:openai-wif`。你可以匹配任何可用的声明或转换后的属性。匹配 `sub` 是最严格的选项，因为它能唯一标识 Kubernetes 服务账号。

3. **选择 OpenAI 目标。** 设置 **项目** 到拥有目标服务账户的 OpenAI 项目。设置 **Service account** 为 EKS 工作负载可以使用的 OpenAI 服务账户，例如 `aws-eks-prod-openai-wif`。检查 `Create a new service account in this project` 如果你想为此映射创建一个新的服务账户，而不是复用现有账户。

4. **如有需要，缩小 API 权限。** 选择适当的 **Permissions** ，例如 `api.model.request` 和 `api.vector_store.read` 以进一步缩小从此映射铸造的访问令牌范围。将权限留空可避免添加特定于 WIF 的范围限制；令牌仍以映射的服务账户身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以读取投影的 EKS 服务账户令牌，并将其兑换为 OpenAI 颁发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供者的主题令牌来源。SDK 将该 EKS 令牌兑换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义主题令牌提供者初始化 OpenAI 客户端。该提供者从挂载的文件路径读取投影的 EKS 服务账户令牌，并将其用作工作负载身份联合的主题令牌。

使用 EKS 投影服务账户令牌进行身份验证

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

- 为每个工作负载使用专用的 AWS 身份。为 AWS 出站身份联合使用独立的 IAM 角色，为 EKS 工作负载使用独立的 Kubernetes 服务账户。
- 为 OpenAI 访问配置专用受众。在 AWS 签发或 EKS 投射的令牌中，以及在 OpenAI Workload Identity Provider 配置中，使用相同的受众值。
- 保持令牌生命周期在合理的较短期限。对于 AWS 出站身份联合，使用 IAM 条件，例如 `sts:DurationSeconds`；对于 EKS，设置适当的投射令牌过期时间。
- 优先使用精确主题匹配。对于 AWS 出站令牌，匹配完整的 IAM 主体 ARN；对于 EKS 令牌，匹配完整的 Kubernetes 服务账户主题。
- 将映射范围限定到稳定边界。当账户、组织、命名空间或转换属性能够减少访问范围且不创建宽泛信任规则时，使用它们。
- 在交换令牌时重新加载令牌。在需要时请求 AWS 出站令牌，并从挂载的文件路径读取 EKS 投射令牌，以便自动获取轮换后的令牌。
- 仅授予工作负载所需的权限。使用映射级权限进一步收窄目标 OpenAI 服务账户所授予的访问权限。