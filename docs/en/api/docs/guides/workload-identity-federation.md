# Workload identity federation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Workload identity federation lets a trusted workload use an identity it already
has instead of storing an OpenAI API key or ChatGPT credential. The workload
presents a short-lived token from your identity provider, and OpenAI exchanges
it for a short-lived OpenAI access token.

OpenAI API workloads can also exchange a verified certificate identity through
X.509 workload identity federation.

You can use workload identity federation with the OpenAI API or Codex:

|                                    | OpenAI API                                                       | Codex                                                        |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **OpenAI identity**                | A service account in an API Platform project                     | A user or service account in a managed ChatGPT workspace     |
| **Where administrators set it up** | OpenAI Platform                                                  | OpenAI Admin Portal                                          |
| **How the workload connects**      | An OpenAI SDK or the token exchange endpoint                     | Codex environment variables and an identity-token file       |
| **What the access token can use**  | The APIs and permissions available to the mapped service account | The Codex access available to the mapped workspace principal |

Both paths use the same trust model, but their administration and runtime
configuration differ. Start with the shared concepts and identity-provider
guidance below, then follow the section for the product your workload uses.

- **OpenAI API:** Continue to [Use workload identity with the OpenAI
  API](#use-workload-identity-with-the-openai-api).
- **Codex:** Follow [Use workload identity with
  Codex](https://developers.openai.com/codex/enterprise/workload-identity) for the complete Admin Portal and
  runtime setup.

Administrators can also [manage Codex providers and rules with the Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api). See the [Codex
federation rule
reference](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) for
rule and lifecycle behavior.

## How it works

An administrator configures three things before the workload connects:

1. An **identity provider** tells OpenAI which external issuer to trust and how
   to verify its signed tokens or certificate identities.
2. An **access rule** describes which token attributes OpenAI accepts and which
   OpenAI identity the workload may act as. OpenAI API configuration calls this
   a service account mapping. Codex configuration calls it a federation rule.
3. An **OpenAI principal** receives the resulting access. For the OpenAI API,
   the principal is a Platform service account. For Codex, the principal is a
   ChatGPT user or service account in a managed workspace.

At runtime:

1. The workload receives a short-lived OIDC JWT or SPIFFE JWT-SVID, or an OpenAI
   API workload presents an X.509 certificate.
2. The workload presents its external identity with the IDs required by its
   product.
3. OpenAI verifies the token or certificate, then evaluates the configured
   mapping or rule.
4. OpenAI returns a short-lived access token for the mapped principal.

Token exchange never creates a principal, project, or workspace membership.
Administrators create or select those resources during setup.

<a id="choose-a-setup-guide"></a>

## Get an identity token

Choose the guide for the environment where your workload runs:



  - **[X.509 certificates](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)**: Configure certificate-backed exchange for OpenAI API workloads.
- **[Kubernetes](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes)**: Use projected service account tokens in self-managed clusters.
- **[AWS](https://developers.openai.com/api/docs/guides/workload-identity-federation/aws)**: Use outbound identity federation or Amazon EKS projected tokens.
- **[Microsoft Azure](https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure)**: Use managed identity tokens or AKS projected service account tokens.
- **[Google Cloud](https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud)**: Use metadata server identity tokens or GKE projected service account tokens.
- **[Oracle Cloud Infrastructure](https://developers.openai.com/api/docs/guides/workload-identity-federation/oracle-cloud)**: Use instance principal tokens from an Oracle identity domain.
- **[GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions)**: Use OIDC tokens in continuous integration workflows.
- **[SPIFFE](https://developers.openai.com/api/docs/guides/workload-identity-federation/spiffe)**: Use SPIFFE JWT-SVIDs issued by SPIRE or a compatible provider.



OpenAI supports OIDC-compatible JWT subject tokens in the documented
configurations, including SPIFFE JWT-SVIDs. For the OpenAI API, contact OpenAI
support if your OIDC provider isn't listed. For Codex, choose **Custom OIDC** in
the OpenAI Admin Portal.

Each OIDC provider guide explains how to issue and inspect a token. For Codex,
follow only those token-issuance steps, then return to
[Use workload identity with Codex](#use-workload-identity-with-codex). The
guides' OpenAI setup and SDK examples apply to the OpenAI API path. X.509
federation supports the OpenAI API path only.

## Use workload identity with the OpenAI API

Use this path when your workload calls the OpenAI API directly. You need
permission to manage Workload Identity Providers and service account mappings
for the organization.

Go to [Organization Settings > Security > Workload Identity Provider](https://platform.openai.com/settings/organization/security/workload-identity-provider).
Create the provider first, then configure its service account mappings from the
provider details page.

### X.509 providers

An X.509 provider derives workload identity attributes from a client certificate that OpenAI verifies against your organization's existing Mutual TLS configuration. It doesn't store certificates or maintain a separate trust store.

Before creating the provider, configure and activate the trusted certificate
that anchors your client certificate in [Organization Settings > Security >
Mutual TLS](https://platform.openai.com/settings/organization/security/mtls).
The [Mutual TLS guide](https://developers.openai.com/api/docs/guides/mutual-tls) explains permissions,
certificate requirements, activation scope, mTLS hosts, certificate-chain
behavior, CEL filters, and rotation.

Next, create the X.509 provider, derive one non-empty `openai.subject` value, and map that identity to a project service account with only the permissions the workload needs. The workload presents its certificate to the X.509 token endpoint to obtain a short-lived bearer token, then sends the bearer token and an accepted client certificate to the API mTLS endpoint.

Follow the [X.509 certificate setup guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) for the complete dashboard and request flow.

### Configure an OIDC Workload Identity Provider

Create a Workload Identity Provider for each external issuer you trust. OpenAI
API workload identity supports OIDC JWT subject tokens. Its configuration
includes:

| Option                                   | Description                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name                                     | A unique name for the Workload Identity Provider in your organization.                                                                                       |
| OIDC Issuer URL                          | The expected OIDC issuer URL. Issuer comparisons ignore a trailing slash.                                                                                    |
| Audience                                 | The expected `aud` claim on the external subject token.                                                                                                      |
| Description                              | Optional description for the Workload Identity Provider.                                                                                                     |
| Use custom URL for OIDC discovery        | When enabled, OpenAI fetches OIDC discovery metadata from a public HTTPS URL that can differ from the token issuer.                                          |
| Custom OIDC discovery URL                | The discovery base URL or complete `/.well-known/openid-configuration` URL used when custom discovery is enabled.                                            |
| Use uploaded JWKS for token verification | When enabled, OpenAI verifies tokens against an uploaded JWKS instead of fetching keys from OIDC discovery.                                                  |
| JWKS JSON                                | The uploaded public JWKS object used when uploaded JWKS verification is enabled. The JWKS must contain a non-empty `keys` array and no private key material. |
| Attribute transformations                | Optional CEL expressions that derive custom `openai.*` attributes from token claims for mapping decisions.                                                   |

Custom OIDC discovery and uploaded JWKS are mutually exclusive. Enabling
custom discovery hides the uploaded JWKS option. The custom discovery URL must
use public HTTPS and cannot contain credentials, a custom port, a query, or a
fragment.

If **Use custom URL for OIDC discovery** does not appear in your dashboard, use
standard OIDC discovery or enable **Use uploaded JWKS for token verification**
instead. Use the public JWKS published by your identity provider and update it
when the provider rotates its signing keys.

When the token issuer and discovery host differ, set **OIDC Issuer URL** to the
token's `iss` claim and **Custom OIDC discovery URL** to the host that publishes
the provider's discovery document. OpenAI still checks the token against the
configured issuer; the custom URL only determines where it retrieves discovery
metadata and public signing keys.

#### Transform token claims with CEL

Attribute transformations use Common Expression Language (CEL). OpenAI
supports the standard CEL operators specified in
[langdef.md](https://github.com/google/cel-spec/blob/master/doc/langdef.md) and
doesn't add custom workload identity federation functions. Each expression
receives one root object:

- `assertion`: The verified JWT claim set.

The dashboard automatically applies the `openai.` prefix. Enter the
suffix, such as `subject`, and an expression, such as `assertion.sub`. The API
stores the derived attribute as `openai.subject`.

```json
[
  {
    "attribute": "openai.subject",
    "expression": "assertion.sub"
  },
  {
    "attribute": "openai.repository",
    "expression": "assertion.repository"
  }
]
```

Use CEL syntax defined by the CEL language specification. For example, you can
read claim values with expressions such as `assertion.sub` or
`assertion.repository`. Unsupported syntax or functions fail mapping
resolution.

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  },
  {
    "attribute": "openai.production",
    "expression": "assertion.ref == \"refs/heads/main\""
  }
]
```

Transformation results must be scalar values: strings, `true` or `false`
values, integers, or finite numbers. Arrays, objects, null values, and
evaluation errors fail mapping resolution. OpenAI converts scalar
transformation results to strings before comparing them to mapping values. For
example, `true` becomes `"true"` and `7` becomes `"7"`.

Mapping keys that start with `openai.` resolve only from attribute
transformations. Raw subject token claims that already use an `openai.` prefix
don't affect mapping decisions unless you configure a matching transformation.

#### Manage JWKS and key rotation

OpenAI verifies OIDC subject tokens with the key source configured on the
Workload Identity Provider:

- **OIDC discovery:** OpenAI fetches the issuer's
  `/.well-known/openid-configuration`, then fetches the discovered `jwks_uri`.
  OpenAI caches discovery documents and remote JWKS payloads for 600 seconds.
- **Custom OIDC discovery:** OpenAI fetches
  `/.well-known/openid-configuration` from the configured custom discovery base
  URL, then fetches the discovered `jwks_uri`. The token's `iss` claim must
  still match **OIDC Issuer URL**.
- **Key refresh on miss:** If a token `kid` isn't found in the cached JWKS,
  OpenAI refreshes the JWKS and tries the lookup again before rejecting the
  token.
- **Uploaded JWKS:** When **Use uploaded JWKS for token verification** is
  enabled, OpenAI uses the uploaded JWKS stored on the provider and doesn't
  perform OIDC discovery or remote JWKS fetching. After a provider update is
  available to token exchange, new exchanges use the saved JWKS.
- **Key sets:** A JWKS can contain more than one public key. Each key must have a
  unique, non-empty `kid`.

During signing-key rotation, publish both old and new public keys in the issuer
JWKS during the rotation window. This lets tokens signed by the old key keep
working while OpenAI accepts tokens signed by the new key. For uploaded JWKS,
update the provider before issuing tokens with the new `kid`; OpenAI rejects
tokens signed by a key absent from the configured JWKS.

<a id="configure-service-account-mappings"></a>

### Configure a service account mapping

A service account mapping defines which external identities can mint access
tokens for an OpenAI service account.

For X.509 providers, mapping keys use derived `openai.*` attributes. Prefer an
exact `openai.subject` mapping. Raw JWT claims such as `sub`, `aud`, and `iss`
apply only to OIDC providers.

Its configuration includes:

| Option          | Description                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name            | A unique name for the mapping within the Workload Identity Provider.                                                                                         |
| Key             | The attribute key to match. Use a raw token claim, such as `sub`, `aud`, or `iss`, or a derived attribute like `openai.subject`.                             |
| Value           | The attribute value that must match before OpenAI issues a token.                                                                                            |
| Description     | Optional description for the mapping.                                                                                                                        |
| Project         | The project that owns the target service account.                                                                                                            |
| Service account | The service account the workload can use. You can create a new service account in the selected project or select an existing service account.                |
| Permissions     | Optional API permissions that further narrow access tokens minted from this mapping. These permissions can't grant access beyond the mapped service account. |

Attribute values must be scalar JSON values. String values can use one trailing
wildcard with a non-empty prefix, such as `repo:example/*`. A wildcard by itself
or in the middle of a value isn't supported.

Valid wildcard values:

- `repo:openai/*`
- `repository:my-org/*`

Unsupported wildcard values:

- `*`
- `repo:*:prod`
- `repo/*/main`

The dashboard shows mapping restrictions as **Permissions**. Token exchange
responses expose the same restrictions as OAuth scopes in the `scope`
property. Mappings can't include Admin API scopes, and normal downstream API
authorization still applies.

#### Mapping resolution example

Mapping resolution starts after OpenAI verifies the external identity.
OpenAI looks up mappings for the requested `identity_provider_id` and
`service_account_id`, skips mappings that aren't enabled, evaluates only the
attributes needed by each mapping, and issues a token only if exactly one
enabled mapping matches every configured attribute.

Suppose a GitHub Actions token contains these claims:

```json
{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "https://api.openai.com/v1",
  "sub": "repo:my-org/my-repo:ref:refs/heads/main",
  "repository": "my-org/my-repo",
  "ref": "refs/heads/main"
}
```

The provider can derive an attribute:

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  }
]
```

The service account mapping can then require both raw and derived attributes:

| Key                     | Value                                         |
| ----------------------- | --------------------------------------------- |
| `iss`                   | `https://token.actions.githubusercontent.com` |
| `sub`                   | `repo:my-org/my-repo:*`                       |
| `openai.repository_ref` | `my-org/my-repo@refs/heads/main`              |

All three values must match. The `sub` value uses a trailing wildcard, so it
matches any value with the prefix `repo:my-org/my-repo:`. The
`openai.repository_ref` key resolves from the attribute transformation, not a
raw token claim with that name.

If more than one enabled mapping matches an exchange, OpenAI rejects it. OpenAI
enforces a unique mapping for each `(provider, service account)` pair and
doesn't combine permissions from different mappings.

### Connect the workload

Use the SDK example in your [identity-provider guide](#get-an-identity-token),
or call the token exchange endpoint directly. For request and response fields,
authorization behavior, and current limitations, see the
[workload identity token exchange reference](https://developers.openai.com/api/reference/workload-identity-federation).

## Use workload identity with Codex

Use this path for trusted Codex automation in a managed ChatGPT workspace.
Codex maps the workload to a ChatGPT user or service account instead of an API
Platform service account.

Codex workload identity federation is in beta and must be enabled for your
  workspace. To request access, contact your OpenAI representative or [OpenAI
  Support](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).

Follow [Use workload identity with
Codex](https://developers.openai.com/codex/enterprise/workload-identity) for the complete administrator and
runtime procedure. It covers provider-specific token sources, federation rules,
the required token-file configuration, credential precedence, supported Codex
surfaces, rotation, and verification. For optional audit attribution, Codex
accepts `OPENAI_WORKLOAD_IDENTITY_CONTEXT`; the Codex guide defines its schema,
privacy limits, and audit behavior.

Use the [Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api) to manage Codex
providers and rules programmatically. The [federation rule
reference](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
explains how one rule can accept more than one external subject while mapping to one
ChatGPT principal.

## Troubleshoot a connection

### OpenAI rejects the identity token

Decode the token locally and compare its `iss`, `aud`, `sub`, `exp`, `iat`, and
provider-specific claims with the configured provider. Don't paste production
tokens into third-party JWT tools.

For the OpenAI API, also compare the token attributes with the selected service
account mapping. For Codex, compare them with the selected federation rule.

### The OpenAI API mapping doesn't match

Confirm that the request uses the intended identity provider and service
account IDs, that the mapping is active, and that exactly one mapping matches.
See the [token exchange error reference](https://developers.openai.com/api/reference/workload-identity-federation#token-exchange-errors)
for detailed error categories.

### Codex reports incomplete configuration

Confirm that the Codex process has both required workload identity environment
variables and that `OPENAI_IDENTITY_TOKEN_FILE` contains an absolute path to a
current token. Check the file and parent-directory permissions.

### Codex uses another credential

Load both required workload identity variables into the Codex process. The
presence of either variable selects WIF ahead of API keys, access tokens, and
stored logins. Start a new process with the downloaded configuration loaded,
then run `codex login status` again.

## Security recommendations

- Use a dedicated principal for each application or workload.
- Separate production and non-production environments.
- Prefer exact claim matching over broad patterns.
- Grant only the access the workload needs.
- Use short access-token lifetimes.
- Review and remove unused providers, mappings, and rules.
- Review token exchange errors and unexpected access patterns.

## Related docs

- [Use workload identity with Codex](https://developers.openai.com/codex/enterprise/workload-identity)
- [Codex federation rule reference](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
- [Manage Codex workload identity with the Admin API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)
- [Workload identity token exchange reference](https://developers.openai.com/api/reference/workload-identity-federation)
- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex environment variables](https://developers.openai.com/codex/config-file/environment-variables)
- [Codex non-interactive mode](https://developers.openai.com/codex/non-interactive-mode)