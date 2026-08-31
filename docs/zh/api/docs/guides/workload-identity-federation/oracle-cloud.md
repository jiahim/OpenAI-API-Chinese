# 为 Oracle Cloud Infrastructure 配置工作负载身份联合

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取对应页面的 Markdown 版本文档。

使用 Oracle 云基础设施 (OCI) 作为工作负载身份提供方，通过将 Oracle Identity Cloud Service (IDCS) 访问令牌交换为短期的 OpenAI 访问令牌。OCI 实例主体对同一租户中身份域的令牌交换请求进行签名。OpenAI 验证得到的令牌，并授权该 OCI 工作负载作为映射的 OpenAI 服务账号进行操作。

对于 Codex，使用此页面获取并检查 Oracle 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向 Codex。本页面的服务账号映射和 SDK 示例适用于 OpenAI API。

此设置不需要 OpenAI API 密钥、自定义 Oracle OAuth 资源应用程序，或对自定义应用程序的动态组授权。

## 设置 OCI 工作负载

使用实例主体在 OCI Compute 实例上运行你的工作负载。对于 Oracle Kubernetes Engine (OKE)，请确认请求由哪个身份签名：标准的实例主体签名者通常标识的是工作节点，而不是单个 Kubernetes Pod。

签名者从 [OCI 实例元数据服务](https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/gettingmetadata.htm)。获取凭证。请验证工作负载能够访问 link-local 元数据端点：

```bash
curl --fail --silent \
  --header "Authorization: Bearer Oracle" \
  http://169.254.169.254/opc/v2/instance/id
```

工作负载还必须能够向其租户中的身份域发起出站 HTTPS 请求。元数据端点本身不需要 NAT 网关或互联网连接。

### 请求 Oracle 身份令牌

使用 `InstancePrincipalsSecurityTokenSigner` OCI Python SDK 对发往你身份域的 OAuth 令牌交换请求进行签名：

```text
POST https://<identity-domain>/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded;charset=utf-8

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
scope=urn:opc:idm:__myscopes__
requested_token_type=urn:ietf:params:oauth:token-type:access_token
```

该 `urn:opc:idm:__myscopes__` scope 使用实例主体已有的授权。将返回的 IDCS 访问令牌用作 OpenAI 工作负载身份联合的 subject token。不要将 Oracle 令牌受众替换为 `https://api.openai.com/v1`；请将 OpenAI provider 配置为使用实际 Oracle 令牌中出现的受众。

### 验证令牌

设置 `TOKEN` 为由实际 OCI 工作负载生成的访问令牌，然后使用现有的本地 JWT 解码器检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


解码器检查令牌时不会验证其签名。请将原始令牌视为敏感信息，不要记录它们，也不要将生产令牌粘贴到第三方 JWT 解码器中。

解码后的 Oracle 访问令牌可以包含以下声明：

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

使用你自己的身份域颁发的令牌作为可信来源。配置精确的 `iss` 值以及令牌中的某个 `aud` 值。优先使用不可变的 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 声明来对工作负载进行授权。

## 设置工作负载身份联合

为你的 Oracle 身份域创建一个工作负载身份提供商，然后为可使用目标 OpenAI 服务账户的 OCI 实例或 compartment 添加映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `oracle-cloud-prod`。使用 **Description**，例如 `Production OCI instance principal`，以标识受信工作负载。

2. **设置 issuer 和 audience。** 将 **OIDC Issuer URL** 为令牌中的 `iss` claim，例如 `https://identity.oraclecloud.com/`。将 **Audience** 设置为同一令牌中的某个 `aud` 值。

3. **在可用时配置租户专用的 OIDC 发现。** 如果 **Use custom URL for OIDC discovery** 出现在 **高级**，将其启用。将 **自定义 OIDC 发现 URL** 设置为你的租户专属身份域，例如 `https://idcs-example.identity.oraclecloud.com`。OpenAI 会获取 `https://idcs-example.identity.oraclecloud.com/.well-known/openid-configuration`，然后使用发现文档中的 `jwks_uri` 来检索该租户的公钥签名密钥。如果未显示自定义发现选项，请启用 **使用已上传的 JWKS 进行令牌验证** ，并上传来自 `https://<identity-domain>/admin/v1/SigningCert/jwk` 的公钥 JWKS。

4. **仅当需要派生属性时，才添加属性转换。** 你可以在服务账号映射断言中直接使用原始的 Oracle 声明，例如 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 。对于显式派生的实例属性，请输入 `instance` ，并使用表达式 `assertion.ipst_instance` 来创建 `openai.instance`.

Oracle 的 [OpenID Connect 发现参考](https://docs.oracle.com/en/cloud/paas/identity-cloud/idcsa/op-well-known-openid-configuration-get.html) 说明了为何自定义发现很重要：发现文档可以声明全局颁发者 `https://identity.oraclecloud.com/` 同时将 token 端点和 `jwks_uri` 发布在租户专属身份域上。请在 **OIDC Issuer URL** 中保留全局颁发者,并将租户域用于 **Custom OIDC discovery URL**.

如果你的身份域在 token 颁发者处发布发现元数据，
  则保持自定义发现处于关闭状态并使用标准 OIDC 发现。如果 OpenAI
  无法访问租户发现文档或签名密钥端点，请禁用
  自定义发现，启用 **Use uploaded JWKS for token verification**，以及
  并从
  `https://<identity-domain>/admin/v1/SigningCert/jwk`。上传该租户的公共 JWKS。自定义发现和
  上传的 JWKS 不能同时启用。当
  Oracle 轮换其签名证书时，请更新已上传的密钥。

### 配置服务账号映射

1. **创建一个服务账户映射。** 将 **Name** 设置为唯一值，例如 `oracle-instance-prod`，并添加可识别受信 OCI 工作负载的描述。

2. **匹配最窄范围的稳定 OCI 标识。** 若要向单个实例授予访问权限，请将 **Key** 设置为 `ipst_instance` ，将 **Value** 设置为已验证令牌中的精确实例 OCID。若要向同一 compartment 内的多个实例授予访问权限，请将 **Key** 设置为 `ipst_compartment` ，将 **Value** 设置为精确的 compartment OCID。

3. **根据需要添加域和租户边界。** 添加更多映射行以限定 `domain_id` 或 `ca_ocid` ，从而将工作负载限制为特定的 Oracle 身份域或租户。当令牌包含相应声明且你希望要求使用实例主体时，请添加 `sub_type` ，其值为 `instance` 。所有映射行都必须匹配。

4. **选择 OpenAI 目标。** 将 **Project** 为拥有该服务账户的项目，然后选择 **Service account** 以供受信任的 OCI 工作负载使用。

5. **如需要，可收窄 API 权限。** 仅选择 **Permissions** 工作负载所需的权限。映射权限可以限制所选的服务账号，但无法授予该服务账号原本不具备的权限。

一个使用标准实例主体签名者的 OKE 工作负载会继承
  工作节点的身份。实例级映射授权的是该节点，而
  不仅仅是单个 Pod。当你需要在共享工作节点的 Pod 之间进行隔离时，请
  使用更具体的、受支持的 OCI 工作负载身份。

## 在代码中使用该 token

安装 OpenAI、OCI 和 Requests 的 Python 包：

```bash
pip install openai oci requests
```

对于 Ruby，安装 OpenAI 和 OCI gem：

```bash
gem install openai oci
```

设置 `OCI_IDENTITY_DOMAIN_URL` 为同一租户中与工作负载相同的身份域的基础 URL。设置 `OPENAI_IDENTITY_PROVIDER_ID` 和 `OPENAI_SERVICE_ACCOUNT_ID` 为来自你的 OpenAI 提供方和服务账户映射的 ID。

以下示例使用 OCI 实例主体对 Oracle 令牌交换请求进行签名，将 IDCS 访问令牌返回给 OpenAI SDK，并让 SDK 在需要时将其交换为短期 OpenAI 访问令牌：

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

```ruby
require "json"
require "net/http"
require "oci"
require "openai"
require "uri"

class OracleInstancePrincipalTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  def initialize(identity_domain_url:)
    @identity_domain_url = identity_domain_url.sub(%r{/+\z}, "")
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    uri = URI("#{@identity_domain_url}/oauth2/v1/token")
    unless uri.is_a?(URI::HTTPS)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Oracle identity domain URL must use HTTPS",
        provider: "oracle-instance-principal"
      )
    end

    body = URI.encode_www_form(
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      scope: "urn:opc:idm:__myscopes__",
      requested_token_type: "urn:ietf:params:oauth:token-type:access_token"
    )
    headers = {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }

    signer = OCI::Auth::Signers::InstancePrincipalsSecurityTokenSigner.new
    signer.sign(:post, uri.to_s, headers, body)

    request = Net::HTTP::Post.new(uri)
    headers.each { |name, value| request[name.to_s] = value }
    request.body = body

    response = Net::HTTP.start(
      uri.hostname,
      uri.port,
      use_ssl: true,
      open_timeout: 10,
      read_timeout: 30
    ) do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Oracle identity token request failed with status #{response.code}",
        provider: "oracle-instance-principal"
      )
    end

    token = JSON.parse(response.body).fetch("access_token")
    unless token.is_a?(String) && !token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Oracle identity domain did not return an access token",
        provider: "oracle-instance-principal"
      )
    end

    token
  rescue JSON::ParserError
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Oracle identity token response was not valid JSON",
      provider: "oracle-instance-principal"
    ), cause: nil
  rescue KeyError
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Oracle identity domain did not return an access token",
      provider: "oracle-instance-principal"
    ), cause: nil
  rescue SystemCallError, Timeout::Error => error
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request Oracle identity token: #{error.message}",
      provider: "oracle-instance-principal",
      cause: error
    )
  end
end

provider = OracleInstancePrincipalTokenProvider.new(
  identity_domain_url: ENV.fetch("OCI_IDENTITY_DOMAIN_URL")
)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Oracle Cloud Infrastructure workload identity federation."
)

puts(response.output_text)
```


当 OpenAI SDK 需要续期工作负载身份凭证时，主体令牌提供方会请求一个新的 Oracle 令牌。切勿打印或持久化 Oracle 主体令牌以及最终的 OpenAI 访问令牌。

## OCI 安全建议

- 使用 `ipst_instance` 当只有一个工作负载应该拥有访问权限时。
- 使用 `ipst_compartment` 仅当该隔离舱中每个符合条件的实例都应共享该映射时。
- 添加 `domain_id` 或 `ca_ocid` 以强制执行身份域和租户边界。
- 为每个应用程序和环境使用一个独立的 OpenAI 服务账号。
- 在依赖 Pod 级隔离之前，请验证 OKE 令牌是否代表工作节点。
- 使用已颁发的 Oracle 令牌中存在的 audience，而不是假定为 OpenAI 特定的 audience。
- 如果你的身份域无法使用 OIDC 发现，请在 Oracle 轮换其签名密钥时轮换已上传的公钥。