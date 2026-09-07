# 为 Oracle 云基础设施配置工作负载身份联合

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后添加 `.md` 获取文档页面的 Markdown 版本。

使用 Oracle Cloud Infrastructure (OCI) 作为工作负载身份提供方，通过将 Oracle Identity Cloud Service (IDCS) 访问令牌交换为短期 OpenAI 访问令牌。OCI 实例主体对同一租户中身份域的令牌交换请求进行签名。OpenAI 验证生成的令牌，并授权该 OCI 工作负载作为已映射的 OpenAI 服务账号进行操作。

对于 Codex，使用此页面获取并检查 Oracle 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向它。本页面中的服务账号映射和 SDK 示例适用于 OpenAI API。

此设置不需要 OpenAI API 密钥、自定义 Oracle OAuth 资源应用程序，或对自定义应用程序的动态组授权。

## 设置 OCI 工作负载

使用实例主体在 OCI Compute 实例上运行你的工作负载。对于 Oracle Kubernetes Engine (OKE)，请确认是哪个身份签署请求：标准的实例主体签署者通常标识的是工作节点，而不是单个 Kubernetes Pod。

签署者从 [OCI 实例元数据服务](https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/gettingmetadata.htm)。获取凭证。请验证工作负载能否访问 link-local 元数据端点：

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

该 `urn:opc:idm:__myscopes__` scope 使用实例主体已有的授权。将返回的 IDCS 访问令牌作为 OpenAI 工作负载身份联合的 subject token 使用。不要将 Oracle 令牌的受众替换为 `https://api.openai.com/v1`；请将 OpenAI 提供方配置为使用一个在实际 Oracle 令牌中出现的受众。

### 验证令牌

设置 `TOKEN` 为由实际 OCI 工作负载生成的访问令牌，然后使用现有的本地 JWT 解码器来检查其声明：

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


该解码器在不验证令牌签名的情况下检查令牌。请将原始令牌视为敏感信息，不要记录它们，也不要将生产令牌粘贴到第三方 JWT 解码器中。

已解码的 Oracle 访问令牌可以包含以下声明：

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

使用由你自己的身份域颁发的令牌作为权威来源。配置确切的 `iss` 值和令牌中某个 `aud` 值。优先使用不可变的 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 声明来授权工作负载。

## 设置工作负载身份联合

为你的 Oracle 身份域创建工作负载身份提供方，然后为可使用目标 OpenAI 服务账号的 OCI 实例或 compartment 添加映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `oracle-cloud-prod`。使用 **Description**，例如 `Production OCI instance principal`，以标识可信工作负载。

2. **设置 issuer 和 audience。** 将 **OIDC Issuer URL** 为令牌中的 `iss` 声明，例如 `https://identity.oraclecloud.com/`。将 **Audience** 设置为同一令牌中 `aud` 值之一。

3. **在可用时配置租户专属的 OIDC 发现。** 如果 **Use custom URL for OIDC discovery** 出现在 **Advanced**，启用它。将 **Custom OIDC discovery URL** 设置为你的租户专属身份域，例如 `https://idcs-example.identity.oraclecloud.com`。OpenAI 会检索 `https://idcs-example.identity.oraclecloud.com/.well-known/openid-configuration`，然后使用发现文档中的 `jwks_uri` 来检索该租户的公钥签名密钥。如果未显示自定义发现选项，请启用 **Use uploaded JWKS for token verification** 并上传来自 `https://<identity-domain>/admin/v1/SigningCert/jwk` 的公钥 JWKS 来代替。

4. **仅在需要派生属性时才添加属性转换。** 你可以在服务账户映射断言中直接使用原始 Oracle 声明，例如 `ipst_instance`, `ipst_compartment`, `domain_id`，以及 `ca_ocid` 。对于显式派生的实例属性，请输入 `instance` 并附带表达式 `assertion.ipst_instance` 来创建 `openai.instance`.

Oracle 的 [OpenID Connect 发现参考](https://docs.oracle.com/en/cloud/paas/identity-cloud/idcsa/op-well-known-openid-configuration-get.html) 说明了为什么自定义发现很重要：发现文档可以声明全局 issuer `https://identity.oraclecloud.com/` 同时发布令牌端点以及 `jwks_uri` 使用租户专属身份域。将全局 issuer 保留在 **OIDC Issuer URL** 并对租户域使用 **Custom OIDC discovery URL**.

如果你的身份域在令牌 issuer 处发布发现元数据，
  请禁用自定义发现并使用标准 OIDC 发现。如果 OpenAI
  无法访问租户发现文档或签名密钥端点，请禁用
  自定义发现，并启用 **Use uploaded JWKS for token verification**，以及
  从以下位置上传租户的公钥 JWKS：
  `https://<identity-domain>/admin/v1/SigningCert/jwk`。自定义发现与
  上传的 JWKS 不能同时启用。当
  Oracle 轮换其签名证书时，请更新已上传的密钥。

### 设置服务账号映射

1. **创建一个服务账户映射。** 将 **Name** 设置为唯一值，例如 `oracle-instance-prod`，并添加用于标识受信 OCI 工作负载的描述。

2. **匹配最窄且稳定的 OCI 身份。** 若要向单个实例授予访问权限，请将 **Key** 设置为 `ipst_instance` 并将 **Value** 设置为已验证令牌中的精确实例 OCID。若要向同一可用区内的实例授予访问权限，请将 **Key** 设置为 `ipst_compartment` 并将 **Value** 设置为精确的可用区 OCID。

3. **根据需要添加域和租户边界。** 添加更多映射行以匹配 `domain_id` 或 `ca_ocid` ，从而将工作负载限制到特定的 Oracle 身份域或租户。当令牌包含该声明且你希望要求使用实例主体时，请添加 `sub_type` 并设置值为 `instance` 。所有映射行都必须匹配。

4. **选择 OpenAI 目标。** 将 **Project** 设置为拥有该服务账户的项目，然后选择 **Service account** 受信任的 OCI 工作负载可以使用。

5. **如需 API 权限，请缩小其范围。** 仅选择 **工作负载所需的** 权限。映射权限可以限制所选服务账户，但不能授予该服务账户原本没有的权限。

使用标准实例主体签名者的 OKE 工作负载会继承
  工作节点的标识。实例级别的映射会授权该节点，而
  不仅仅是单个 Pod。当你在同一工作节点上需要 Pod 之间的隔离时，请使用更具体、
  受支持的 OCI 工作负载标识。

## 在代码中使用该 token

安装 OpenAI、OCI 和 Requests Python 包：

```bash
pip install openai oci requests
```

对于 Ruby，安装 OpenAI 和 OCI gem：

```bash
gem install openai oci
```

设置 `OCI_IDENTITY_DOMAIN_URL` 设置为与工作负载同一租户中身份域的基础 URL。设置 `OPENAI_IDENTITY_PROVIDER_ID` 和 `OPENAI_SERVICE_ACCOUNT_ID` 为你的 OpenAI 提供方和服务账号映射中的 ID。

下面的示例使用 OCI 实例主体对 Oracle 令牌交换请求进行签名，将 IDCS 访问令牌返回给 OpenAI SDK，并在需要时由 SDK 将其交换为短时效的 OpenAI 访问令牌：

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


当 OpenAI SDK 需要续期工作负载身份凭据时，主体令牌提供方会请求一个新的 Oracle 令牌。切勿打印或持久化 Oracle 主体令牌以及生成的 OpenAI 访问令牌。

## OCI 安全建议

- 使用 `ipst_instance` 映射单个实例，当只有一项工作负载应拥有访问权限时使用。
- 使用 `ipst_compartment` 仅在该隔离舱中每个符合资格的实例都应共享该映射时使用。
- 添加 `domain_id` 或 `ca_ocid` 以强制身份域和租户边界。
- 为每个应用程序和环境使用一个单独的 OpenAI 服务账号。
- 在依赖 Pod 级隔离之前，先验证 OKE 令牌是否代表工作节点。
- 使用所颁发 Oracle 令牌中存在的受众，而不是假设使用 OpenAI 专属的受众。
- 如果你的身份域无法使用 OIDC 发现，请在 Oracle 轮换其签名密钥时轮换已上传的公钥。