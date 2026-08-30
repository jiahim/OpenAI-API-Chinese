# 为 Oracle 云基础设施配置工作负载身份联合

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

使用 Oracle Cloud Infrastructure (OCI) 作为 Workload 身份提供方，将 Oracle Identity Cloud Service (IDCS) 访问令牌交换为短时效的 OpenAI 访问令牌。OCI 实例主体对同一租户内身份域的令牌交换请求进行签名。OpenAI 验证得到的令牌，并授权该 OCI 工作负载作为映射的 OpenAI 服务账号进行操作。

对于 Codex，使用本页面获取并检查 Oracle 令牌。然后 [配置 Codex workload identity](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并让 Codex 指向它。本页中的服务账号映射和 SDK 示例适用于 OpenAI API。

此设置不需要 OpenAI API 密钥、自定义 Oracle OAuth 资源应用，或授予自定义应用的动态组授权。

## 设置 OCI 工作负载

在 OCI Compute 实例上使用实例主体（instance principal）运行你的工作负载。对于 Oracle Kubernetes Engine (OKE)，请确认哪个身份为请求签名：标准的实例主体签名者通常标识的是工作节点，而不是单个 Kubernetes Pod。

签名者从 [OCI 实例元数据服务](https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/gettingmetadata.htm)。获取凭证。请验证工作负载能够访问 link-local 元数据端点：

```bash
curl --fail --silent \
  --header "Authorization: Bearer Oracle" \
  http://169.254.169.254/opc/v2/instance/id
```

工作负载还必须能够向其租户中的身份域发起出站 HTTPS 请求。元数据端点本身不需要 NAT 网关或互联网连接。

### Request an Oracle identity token

使用 `InstancePrincipalsSecurityTokenSigner` OCI Python SDK 向你的身份域发起 OAuth 令牌交换请求的签名:

```text
POST https://<identity-domain>/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded;charset=utf-8

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
scope=urn:opc:idm:__myscopes__
requested_token_type=urn:ietf:params:oauth:token-type:access_token
```

该 `urn:opc:idm:__myscopes__` scope 使用实例主体的现有授权。将返回的 IDCS 访问令牌作为 subject token 用于 OpenAI 工作负载身份联合。请勿将 Oracle 令牌 audience 替换为 `https://api.openai.com/v1`;请将 OpenAI 提供方配置为使用实际 Oracle 令牌中出现的 audience。

### 验证令牌

Set `TOKEN` 将其设置为由实际的 OCI 工作负载生成的访问令牌，然后使用现有的本地 JWT 解码器来检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


该解码器在检查令牌时不会验证其签名。请将原始令牌视为敏感信息，不要记录它们，也不要将生产环境中的令牌粘贴到第三方 JWT 解码器中。

一个解码后的 Oracle 访问令牌可以包含以下声明：

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

使用你自己的身份域所颁发的令牌作为可信来源。配置精确的 `iss` 值以及令牌中的一个 `aud` 值。优先使用不可变的 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 声明来对工作负载进行授权。

## 配置工作负载身份联合

为你的 Oracle 身份域创建一个工作负载身份提供者，然后为可使用目标 OpenAI 服务账户的 OCI 实例或 compartment 添加映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为唯一值，例如 `oracle-cloud-prod`。使用 **Description**，例如 `Production OCI instance principal`，以标识受信的工作负载。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 为令牌的 `iss` claim，例如 `https://identity.oraclecloud.com/`。将 **Audience** 设置为同一令牌中某个 `aud` 值。

3. **在可用时配置租户专用的 OIDC 发现。** 如果 **Use custom URL for OIDC discovery** 出现在 **Advanced**，启用它。将 **Custom OIDC discovery URL** 设置为你的租户特定身份域，例如 `https://idcs-example.identity.oraclecloud.com`。OpenAI 会获取 `https://idcs-example.identity.oraclecloud.com/.well-known/openid-configuration`，然后使用发现文档的 `jwks_uri` 来获取该租户的公钥签名密钥。如果没有显示自定义发现选项，请启用 **Use uploaded JWKS for token verification** 并从 `https://<identity-domain>/admin/v1/SigningCert/jwk` 上传公钥 JWKS。

4. **仅当需要派生属性时，才添加属性转换。** 你可以在服务账号映射断言中直接使用原始 Oracle 声明，例如 `ipst_instance`, `ipst_compartment`, `domain_id`，和 `ca_ocid` 。对于显式派生的实例属性，请输入 `instance` 并附带表达式 `assertion.ipst_instance` 以创建 `openai.instance`.

Oracle 的 [OpenID Connect 发现参考](https://docs.oracle.com/en/cloud/paas/identity-cloud/idcsa/op-well-known-openid-configuration-get.html) 说明了为何自定义发现很重要：发现文档可以声明全局颁发者 `https://identity.oraclecloud.com/` 同时发布令牌端点和 `jwks_uri` 在租户专属身份域上。在 **OIDC Issuer URL** 中保留全局颁发者，并使用租户域作为 **Custom OIDC discovery URL**.

如果你的身份域在令牌颁发者处发布发现元数据，
  请保持自定义发现禁用，并使用标准 OIDC 发现。如果 OpenAI
  无法访问租户发现文档或签名密钥端点，请禁用
  自定义发现，并启用 **Use uploaded JWKS for token verification**，以及
  从以下位置上传租户的公共 JWKS：
  `https://<identity-domain>/admin/v1/SigningCert/jwk`。自定义发现与
  上传的 JWKS 不能同时启用。当
  Oracle 轮换其签名证书时，请更新上传的密钥。

### 设置服务账号映射

1. **创建服务账户映射。** 设置 **Name** 为唯一值，例如 `oracle-instance-prod`，并添加用于标识可信 OCI 工作负载的描述。

2. **匹配最窄且稳定的 OCI 身份。** 若要授予对单个实例的访问权限，请将 **Key** 设置为 `ipst_instance` ，并将 **Value** 设置为已验证令牌中的确切实例 OCID。若要授予对同一 compartment 内多个实例的访问权限，请将 **Key** 设置为 `ipst_compartment` ，并将 **Value** 设置为确切的 compartment OCID。

3. **根据需要添加 domain 和 tenancy 边界。** 添加进一步的映射行，针对 `domain_id` 或 `ca_ocid` 以将工作负载限制为特定的 Oracle 身份 domain 或 tenancy。添加 `sub_type` ，其值为 `instance` ，当令牌包含该声明并且你希望要求使用实例主体时使用。所有映射行都必须匹配。

4. **选择 OpenAI 目标。** 设置 **Project** 为拥有该服务账户的项目，然后选择 **Service account** 以便受信任的 OCI 工作负载可以使用。

5. **根据需要收窄 API 权限。** 仅选择 **Permissions** 工作负载所需的权限。映射权限可以限制所选服务账号，但无法授予该服务账号原本没有的权限。

使用标准实例主体签名者的 OKE 工作负载会继承
  工作节点的身份。实例级映射授权的是该节点，而
  不是单个 Pod。当你在共享同一工作节点的 Pod 之间需要隔离时，
  请使用更具体的、受支持的 OCI 工作负载身份。

## 在代码中使用该 token

安装 OpenAI、OCI 和 Requests Python 包：

```bash
pip install openai oci requests
```

Set `OCI_IDENTITY_DOMAIN_URL` 设置为同一租户中工作负载所在身份域的基础 URL。 `OPENAI_IDENTITY_PROVIDER_ID` 将 `OPENAI_SERVICE_ACCOUNT_ID` 设置为 OpenAI 提供方和服务账户映射中的 ID。

以下示例使用 OCI 实例主体对 Oracle 令牌交换请求进行签名，将 IDCS 访问令牌返回给 OpenAI SDK，并允许该 SDK 在需要时将其交换为短期有效的 OpenAI 访问令牌：

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


当 OpenAI SDK 需要续期工作负载身份凭据时，主体令牌提供方会请求一个新的 Oracle 令牌。切勿打印或持久化 Oracle 主体令牌以及由此获得的 OpenAI 访问令牌。

## OCI 安全建议

- 映射一个实例，使用 `ipst_instance` 当只有一个工作负载应具有访问权限时。
- 使用 `ipst_compartment` 仅在该隔间中的每个符合条件的实例都应共享该映射时。
- 添加 `domain_id` 或 `ca_ocid` 以强制实施身份域和租户边界。
- 为每个应用程序和环境使用一个独立的 OpenAI 服务账户。
- 在依赖 Pod 级别隔离之前，请验证 OKE 令牌是否代表工作节点。
- 使用已签发的 Oracle 令牌中存在的受众，而不是假设一个 OpenAI 特定的受众。
- 如果你的身份域无法使用 OIDC 发现，请在 Oracle 轮换其签名密钥时轮换已上传的公钥。