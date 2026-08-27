# 为 Oracle Cloud Infrastructure 配置工作负载身份联合

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用 Oracle Cloud Infrastructure (OCI) 作为工作负载身份提供者，通过将 Oracle Identity Cloud Service (IDCS) 访问令牌交换为短期有效的 OpenAI 访问令牌。OCI 实例主体向同一租户中的身份域签署令牌交换请求。OpenAI 验证生成的令牌，并授权 OCI 工作负载以映射的 OpenAI 服务账户身份运行。

对于 Codex，请使用此页面获取并检查 Oracle 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将令牌写入文件并将 Codex 指向该文件。此页面上的服务账户映射和 SDK 示例适用于 OpenAI API。

此设置不需要 OpenAI API 密钥、自定义 Oracle OAuth 资源应用或对自定义应用的动态组授权。

## 设置 OCI 工作负载

在带有实例主体的 OCI Compute 实例上运行你的工作负载。对于 Oracle Kubernetes Engine (OKE)，请确认是哪个身份对请求进行签名：标准实例主体签名者通常识别的是工作节点，而非单个 Kubernetes pod。

签名者从 [OCI 实例元数据服务](https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/gettingmetadata.htm)。获取凭据。验证工作负载是否能访问链路本地元数据端点：

```bash
curl --fail --silent \
  --header "Authorization: Bearer Oracle" \
  http://169.254.169.254/opc/v2/instance/id
```

工作负载还必须能够向其租户中的身份域发起出站 HTTPS 请求。元数据端点本身不需要 NAT 网关或互联网连接。

### 请求 Oracle 身份令牌

使用 `InstancePrincipalsSecurityTokenSigner` 来自 OCI Python SDK 对向你的身份域发起的 OAuth 令牌交换请求进行签名：

```text
POST https://<identity-domain>/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded;charset=utf-8

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
scope=urn:opc:idm:__myscopes__
requested_token_type=urn:ietf:params:oauth:token-type:access_token
```

该 `urn:opc:idm:__myscopes__` 范围利用实例主体的现有授权。将返回的 IDCS 访问令牌用作 OpenAI 工作负载身份联合的主体令牌。不要将 Oracle 令牌受众替换为 `https://api.openai.com/v1`；配置 OpenAI 提供程序时，应使用实际 Oracle 令牌中出现的受众。

### 验证令牌

set `TOKEN` 改为由实际 OCI 工作负载生成的访问令牌，然后使用现有的本地 JWT 解码器检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


解码器检查令牌但不验证其签名。将原始令牌视为敏感信息，不要记录它们，也不要将生产令牌粘贴到第三方 JWT 解码器中。

解码后的 Oracle 访问令牌可能包含以下声明：

```json
{
  "iss": "https://identity.oraclecloud.com/",
  "aud": [
    "https://idcs-example.us-phoenix-1.identity.oraclecloud.com",
    "https://idcs-example.identity.oraclecloud.com"
  ],
  "sub_type": "instance",
  "ipst_instance": "ocid1.instance.oc1.phx.<instance-id>",
  "ipst_compartment": "ocid1.compartment.oc1..<compartment-id>",
  "domain_id": "ocid1.domain.oc1..<domain-id>",
  "ca_ocid": "ocid1.tenancy.oc1..<tenancy-id>",
  "tenant": "idcs-example",
  "exp": 1782369434,
  "iat": 1782365834
}
```

使用你自己的身份域颁发的令牌作为权威来源。配置精确的 `iss` 值和令牌的 `aud` 值之一。授权工作负载时，优先使用不可变的 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 声明。

## 设置工作负载身份联合

为你的 Oracle 身份域创建一个工作负载身份提供程序，然后为可以使用目标 OpenAI 服务账户的 OCI 实例或隔离专区添加映射。

### 设置工作负载身份提供程序

1. **创建工作负载身份提供程序。** 将 **名称** 设置为唯一值，例如 `oracle-cloud-prod`。使用 **说明**，例如 `Production OCI instance principal`，以标识受信任的工作负载。

2. **设置颁发者和受众。** 将 **OIDC 颁发者 URL** 设置为令牌的 `iss` 声明，例如 `https://identity.oraclecloud.com/`。将 **受众** 设置为同一令牌中的 `aud` 值之一。

3. **在可用时配置特定于租户的 OIDC 发现。** 如果 **为 OIDC 发现使用自定义 URL** 出现在 **高级**，启用它。设置 **自定义 OIDC 发现 URL** 为你特定租户的身份域，例如 `https://idcs-example.identity.oraclecloud.com`。 OpenAI 检索 `https://idcs-example.identity.oraclecloud.com/.well-known/openid-configuration`，然后使用发现文档的 `jwks_uri` 来获取租户的公共签名密钥。如果自定义发现选项不出现，启用 **使用上传的 JWKS 进行令牌验证** 并从以下位置上传公共 JWKS `https://<identity-domain>/admin/v1/SigningCert/jwk` 代替。

4. **只有在需要派生属性时才添加属性转换。** 你可以使用原始 Oracle 声明，例如 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 直接在服务账户映射断言中使用。对于显式派生的实例属性，请输入 `instance` 使用表达式 `assertion.ipst_instance` 来创建 `openai.instance`.

Oracle 的 [OpenID Connect 发现参考](https://docs.oracle.com/en/cloud/paas/identity-cloud/idcsa/op-well-known-openid-configuration-get.html) 说明了为什么自定义发现很重要：发现文档可以声明全局签发者 `https://identity.oraclecloud.com/` 同时将令牌端点发布在 `jwks_uri` 租户特定的身份域上。请将全局签发者保留在 **OIDC 签发者 URL** 中，并使用租户域作为 **自定义 OIDC 发现 URL**.

如果你的身份域在令牌签发者处发布发现元数据，
  请保持自定义发现禁用并使用标准 OIDC 发现。如果 OpenAI
  无法访问租户发现文档或签名密钥端点，请禁用
  自定义发现，启用 **使用上传的 JWKS 进行令牌验证**，并
  从
  `https://<identity-domain>/admin/v1/SigningCert/jwk`。上传租户的公共 JWKS。自定义发现和
  上传的 JWKS 不能同时启用。当
  Oracle 轮换其签名证书时，请更新上传的密钥。

### 设置服务账户映射

1. **创建服务账户映射。** 将 **名称** 设置为唯一值，例如 `oracle-instance-prod`，并添加一条描述，用于标识受信任的 OCI 工作负载。

2. **匹配最窄的稳定 OCI 身份。** 要授予对单个实例的访问权限，请将 **键** 设置为 `ipst_instance` 并将 **值** 设置为经验证令牌中的确切实例 OCID。要授予对某个隔离专区中所有实例的访问权限，请将 **键** 设置为 `ipst_compartment` 并将 **值** 设置为确切的隔离专区 OCID。

3. **根据需要添加域和租户边界。** 为以下项添加更多映射行： `domain_id` 或 `ca_ocid` 将工作负载限制到特定的 Oracle 身份域或租户。添加 `sub_type` 值为 `instance` 当令牌包含该声明且你要求实例主体时。所有映射行必须匹配。

4. **选择 OpenAI 目标。** 设置 **Project** 为拥有服务账户的项目，然后选择 **Service account** 可信的 OCI 工作负载可以使用它。

5. **如有需要，缩小 API 权限范围。** 仅选择 **Permissions** 工作负载所需的。映射权限可以限制所选服务账户，但不能授予服务账户本身没有的权限。

使用标准实例主体签名器的 OKE 工作负载继承
  工作节点身份。实例级映射授权的是该节点，而
  不仅仅是某个 Pod。当你在共享同一工作节点的 Pod 之间需要隔离时，
  请使用更具体且受支持的 OCI 工作负载身份。

## 在代码中使用令牌

安装 OpenAI、OCI 和 Requests Python 包：

```bash
pip install openai oci requests
```

将 `OCI_IDENTITY_DOMAIN_URL` 设置为与工作负载同一租户中身份域的基 URL。将 `OPENAI_IDENTITY_PROVIDER_ID` 和 `OPENAI_SERVICE_ACCOUNT_ID` 设置为来自你的 OpenAI 提供商和服务账户映射的 ID。

以下示例使用 OCI 实例主体签署 Oracle 令牌交换请求，将 IDCS 访问令牌返回给 OpenAI SDK，并让 SDK 在需要时将其交换为短期 OpenAI 访问令牌：

使用 OCI 实例主体进行身份验证

```python
import os

import oci
import requests
from openai import OpenAI
from openai.auth import SubjectTokenProvider


def oracle_instance_principal_token_provider(
    identity_domain_url: str,
) -> SubjectTokenProvider:
    def get_token() -> str:
        signer = oci.auth.signers.InstancePrincipalsSecurityTokenSigner()
        response = requests.post(
            f"{identity_domain_url.rstrip('/')}/oauth2/v1/token",
            data={
                "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
                "scope": "urn:opc:idm:__myscopes__",
                "requested_token_type": "urn:ietf:params:oauth:token-type:access_token",
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            auth=signer,
            timeout=30,
        )
        response.raise_for_status()

        token = response.json().get("access_token")
        if not isinstance(token, str) or not token:
            raise RuntimeError("Oracle IDCS did not return an access token.")

        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": oracle_instance_principal_token_provider(
            os.environ["OCI_IDENTITY_DOMAIN_URL"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Oracle Cloud Infrastructure workload identity federation.",
)

print(response.output_text)
```


当 OpenAI SDK 需要续订工作负载身份凭据时，主体令牌提供程序会请求新的 Oracle 令牌。切勿打印或持久化 Oracle 主体令牌或生成的 OpenAI 访问令牌。

## OCI 安全建议

- 将单个实例映射到 `ipst_instance` 当只有一个工作负载应具有访问权限时。
- 使用 `ipst_compartment` 仅当该 compartment 中的所有合格实例都应共享该映射时。
- 添加 `domain_id` 或 `ca_ocid` 以强制执行身份域和租户边界。
- 为每个应用程序和环境使用单独的 OpenAI 服务帐户。
- 在依赖 pod 级隔离之前，验证 OKE token 是否代表工作节点。
- 使用 Oracle 签发的 token 中存在的 audience，而不是假设 OpenAI 特定的 audience。
- 如果你的身份域无法使用 OIDC 发现，请在 Oracle 轮换其签名密钥时轮换上传的公钥。