# Workload identity federation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Workload identity federation lets trusted workloads exchange an externally issued identity token for a short-lived OpenAI access token. X.509 workload identity federation is also available in beta, allowing workloads to exchange a verified certificate identity. Use these guides to configure your external identity provider, create OpenAI service account mappings, and authenticate workloads without storing long-lived API keys.

For token exchange request and response details, authorization behavior, and current limitations, see the [workload identity token exchange reference](https://developers.openai.com/api/reference/workload-identity-federation).

## How it works

Workload identity federation has four parts:

1. A **workload identity provider** describes the external identity. An OIDC provider stores the issuer, audience, and key source used to verify external subject tokens. An X.509 provider derives identity attributes from a client certificate verified against existing Mutual TLS roots.
2. A **service account mapping** authorizes specific external identity attributes to mint tokens for a particular OpenAI service account within a project.
3. A **token exchange** request sends an external subject token or presents a client certificate to OpenAI and returns a short-lived OpenAI access token.
4. The workload uses the OpenAI-issued access token as a bearer credential to authenticate requests to the OpenAI API. For X.509 federation, the API request also presents an accepted client certificate.

You must be an organization owner to configure this feature. Go to [Organization Settings > Security > Workload Identity Provider](https://platform.openai.com/settings/organization/security/workload-identity-provider), then configure service account mappings from the workload identity provider details page. The X.509 provider option is available in beta. If it doesn't appear, contact your system administrator; your administrator can work with OpenAI to enable the beta for your organization.

## Choose a setup guide

Start with the guide that matches your workload environment or identity source:



  - **[X.509 certificates (beta)](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)**: Configure certificate-backed exchange with the X.509 beta.
- **[Kubernetes](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes)**: Use projected service account tokens in self-managed clusters.
- **[AWS](https://developers.openai.com/api/docs/guides/workload-identity-federation/aws)**: Use outbound identity federation or Amazon EKS projected tokens.
- **[Microsoft Azure](https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure)**: Use managed identity tokens or AKS projected service account tokens.
- **[Google Cloud](https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud)**: Use metadata server identity tokens or GKE projected service account tokens.
- **[Oracle Cloud Infrastructure](https://developers.openai.com/api/docs/guides/workload-identity-federation/oracle-cloud)**: Use instance principal tokens from an Oracle identity domain.
- **[GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions)**: Use OIDC tokens in continuous integration workflows.
- **[SPIFFE](https://developers.openai.com/api/docs/guides/workload-identity-federation/spiffe)**: Use SPIFFE JWT-SVIDs issued by SPIRE or a compatible provider.



OpenAI supports OIDC-compatible JWT subject tokens in the documented configurations, including SPIFFE JWT-SVIDs. If you need an OIDC provider that isn't listed, contact us.

Each OIDC provider guide shows how to issue and inspect a subject token on that platform, and how to configure the OpenAI SDK to exchange it for a short-lived OpenAI access token.

## X.509 providers (beta)

X.509 workload identity federation is available in beta. If X.509 doesn't
  appear as a provider type, contact your system administrator. Your
  administrator can work with OpenAI to enable the beta for your organization.

An X.509 provider derives workload identity attributes from a client certificate that OpenAI verifies against your organization's existing Mutual TLS configuration. It doesn't store certificates or maintain a separate trust store.

Before creating the provider, configure and activate the trusted CA certificate that anchors your client certificate in [Organization Settings > Security > Mutual TLS](https://platform.openai.com/settings/organization/security/mtls). The [OpenAI Mutual TLS Beta Program](https://help.openai.com/en/articles/10876024-openai-mutual-tls-beta-program) explains certificate requirements, activation scope, supported API endpoints, certificate-chain behavior, and client configuration restrictions.

Next, create the X.509 provider, derive one non-empty `openai.subject` value, and map that identity to a project service account with only the permissions the workload needs. The workload presents its certificate to the X.509 token endpoint to obtain a short-lived bearer token, then sends the bearer token and an accepted client certificate to the API mTLS endpoint.

Follow the [X.509 certificate setup guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) for the complete dashboard and request flow.

## Configure an OIDC Workload Identity Provider

Create a Workload Identity Provider for each external issuer you trust. Workload identity federation supports OIDC JWT subject tokens.

For certificate-backed workloads, follow the [X.509 certificate guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509). X.509 providers reuse active Mutual TLS roots and don't use OIDC issuer, audience, discovery, or JWKS settings.

Workload Identity Provider configuration includes these dashboard options:

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

Custom OIDC discovery and uploaded JWKS are mutually exclusive. Enabling custom discovery hides the uploaded JWKS option. The custom discovery URL must use public HTTPS and cannot contain credentials, a custom port, a query, or a fragment.

If **Use custom URL for OIDC discovery** does not appear in your dashboard, use standard OIDC discovery or enable **Use uploaded JWKS for token verification** instead. Use the public JWKS published by your identity provider and update it when the provider rotates its signing keys.

When the token issuer and discovery host differ, set **OIDC Issuer URL** to the token's `iss` claim and **Custom OIDC discovery URL** to the host that publishes the provider's discovery document. OpenAI still checks the token against the configured issuer; the custom URL only determines where it retrieves discovery metadata and public signing keys.

### Transform token claims with CEL

Attribute transformations use Common Expression Language (CEL). OpenAI supports the standard CEL operators specified in [langdef.md](https://github.com/google/cel-spec/blob/master/doc/langdef.md) and doesn't add custom workload identity federation-specific functions. Each expression receives one root object:

- `assertion`: The verified JWT claim set.

In the dashboard, the `openai.` prefix is applied automatically. Enter the suffix, such as `subject`, and an expression, such as `assertion.sub`. The API stores the derived attribute as `openai.subject`.

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

Use CEL syntax defined by the CEL language specification. For example, you can read claim values with expressions such as `assertion.sub` or `assertion.repository`. Unsupported syntax or functions fail mapping resolution.

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

Transformation results must be scalar values: strings, boolean values, integers, or finite numbers. Arrays, objects, null values, and evaluation errors fail mapping resolution. OpenAI converts scalar transformation results to strings before comparing them to mapping values. For example, `true` becomes `"true"` and `7` becomes `"7"`.

Mapping keys that start with `openai.` resolve only from attribute transformations. Raw subject token claims that already use an `openai.` prefix don't affect mapping decisions unless you configure a matching transformation.

### Manage JWKS and key rotation

OpenAI verifies OIDC subject tokens with the key source configured on the Workload Identity Provider.

- **OIDC discovery:** OpenAI fetches the issuer's `/.well-known/openid-configuration`, then fetches the discovered `jwks_uri`. Discovery documents and remote JWKS payloads are cached for 600 seconds.
- **Custom OIDC discovery:** OpenAI fetches `/.well-known/openid-configuration` from the configured custom discovery base URL, then fetches the discovered `jwks_uri`. The token's `iss` claim must still match **OIDC Issuer URL**. Use this option when the issuer and discovery document use different hosts.
- **Key refresh on miss:** If a token `kid` isn't found in the cached JWKS, OpenAI refreshes the JWKS and tries the lookup again before rejecting the token.
- **Uploaded JWKS:** When **Use uploaded JWKS for token verification** is enabled, OpenAI uses the uploaded JWKS stored on the Workload Identity Provider and doesn't perform OIDC discovery or remote JWKS fetching. After a provider update is saved and available to token exchange, new exchanges use the saved JWKS.
- **Multiple keys:** A JWKS can contain multiple public keys, and each key must have a unique non-empty `kid`.

During signing-key rotation, publish both old and new public keys in the issuer JWKS during the rotation window. This lets tokens signed by the old key continue working while OpenAI accepts tokens signed by the new key. For uploaded JWKS mode, update the Workload Identity Provider JWKS before issuing tokens with the new `kid`; OpenAI rejects tokens signed by a key absent from the configured JWKS.

## Configure service account mappings

A service account mapping defines which external identities can mint access tokens for an OpenAI service account.

For X.509 providers, mapping keys use derived `openai.*` attributes. Prefer an exact `openai.subject` mapping. Raw JWT claims such as `sub`, `aud`, and `iss` apply only to OIDC providers.

Mapping configuration includes these dashboard options:

| Option          | Description                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name            | A unique name for the mapping within the Workload Identity Provider.                                                                                         |
| Key             | The attribute key to match. Use a raw token claim, such as `sub`, `aud`, or `iss`, or a derived attribute like `openai.subject`.                             |
| Value           | The attribute value that must match before OpenAI issues a token.                                                                                            |
| Description     | Optional description for the mapping.                                                                                                                        |
| Project         | The project that owns the target service account.                                                                                                            |
| Service account | The service account the workload can use. You can create a new service account in the selected project or select an existing service account.                |
| Permissions     | Optional API permissions that further narrow access tokens minted from this mapping. These permissions can't grant access beyond the mapped service account. |

Attribute assertion values must be scalar JSON values. String values may use one trailing wildcard, such as `repo:example/*`. The wildcard must have a non-empty prefix; `*` by itself isn't supported.

Valid wildcard values:

- `repo:openai/*`
- `repository:my-org/*`

Invalid wildcard values:

- `*`
- `repo:*:prod`
- `repo/*/main`

The dashboard shows mapping-level restrictions as **Permissions**. Token exchange responses expose the same restrictions as OAuth scopes in the `scope` property. Admin API scopes can't be assigned to Workload Identity Provider mappings, and downstream API authorization still applies after OpenAI mints a token.

### Mapping resolution example

Mapping resolution starts after OpenAI verifies the external identity. OpenAI looks up mappings for the requested `identity_provider_id` and `service_account_id`, skips disabled mappings, evaluates only the attributes needed by each mapping, and issues a token only if exactly one enabled mapping matches all configured attributes.

For example, a GitHub Actions token might contain these claims:

```json
{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "https://api.openai.com/v1",
  "sub": "repo:my-org/my-repo:ref:refs/heads/main",
  "repository": "my-org/my-repo",
  "ref": "refs/heads/main"
}
```

The Workload Identity Provider can define a derived attribute:

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  }
]
```

Then a service account mapping can require both raw and derived attributes:

| Key                     | Value                                         |
| ----------------------- | --------------------------------------------- |
| `iss`                   | `https://token.actions.githubusercontent.com` |
| `sub`                   | `repo:my-org/my-repo:*`                       |
| `openai.repository_ref` | `my-org/my-repo@refs/heads/main`              |

This mapping matches only when all three attributes match. The `sub` value uses a trailing wildcard, so it matches any value with the prefix `repo:my-org/my-repo:`. The `openai.repository_ref` key resolves from the attribute transformation; OpenAI doesn't use a raw token claim named `openai.repository_ref`.

If multiple enabled mappings match the same token exchange, OpenAI rejects the exchange. OpenAI enforces a unique mapping for each `(provider, service account)` pair and doesn't combine permissions across multiple mappings.

## Security recommendations

- Use a dedicated OpenAI service account for each application or workload.
- Separate production and non-production environments.
- Prefer exact claim matching over broad attribute patterns.
- Grant only the minimum OpenAI permissions required.
- Review and remove unused mappings regularly.
- Monitor token exchange failures and unexpected access patterns.
- Avoid sharing identities across unrelated workloads.