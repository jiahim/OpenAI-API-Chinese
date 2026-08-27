# Workload identity token exchange

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use this reference to exchange an externally issued identity token for a short-lived OpenAI access token after you configure a trusted provider and service account mapping. It also describes the X.509 certificate exchange. For concepts, dashboard configuration, and setup guides, see the [workload identity federation guide](https://developers.openai.com/api/docs/guides/workload-identity-federation).

## Exchange a JWT subject token

Exchange the external subject token at the OpenAI token endpoint:

```bash
curl https://auth.openai.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
    "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
    "subject_token": "'"$EXTERNAL_OIDC_JWT"'",
    "identity_provider_id": "'"$IDENTITY_PROVIDER_ID"'",
    "service_account_id": "'"$SERVICE_ACCOUNT_ID"'"
  }'
```

### Request parameters

| Parameter              | Required | Description                                                                                      |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `grant_type`           | Yes      | Must be `urn:ietf:params:oauth:grant-type:token-exchange`.                                       |
| `subject_token_type`   | Yes      | Supports `urn:ietf:params:oauth:token-type:jwt` and `urn:ietf:params:oauth:token-type:id_token`. |
| `subject_token`        | Yes      | The externally issued OIDC JWT or SPIFFE JWT-SVID from your Workload Identity Provider.          |
| `identity_provider_id` | Yes      | The OpenAI Workload Identity Provider ID configured for the external issuer.                     |
| `service_account_id`   | Yes      | The OpenAI service account ID to resolve against the matching service account mapping.           |

The token exchange uses the permissions configured on the matching service account mapping. A `scope` value in the request body doesn't grant access.

## Exchange an X.509 certificate

Present the client certificate during TLS negotiation with the dedicated X.509 token endpoint. Don't include a `subject_token` in the request body.

For provider and service account mapping configuration, follow the [X.509 certificate setup guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509). For certificate requirements, activation, mTLS hosts, CEL filters, and rotation, see the [Mutual TLS guide](https://developers.openai.com/api/docs/guides/mutual-tls).

```bash
curl --cert "$OPENAI_MTLS_CERT_CHAIN" \
  --key "$OPENAI_MTLS_KEY" \
  --request POST "https://mtls.auth.openai.com/oauth/token" \
  --header "Content-Type: application/json" \
  --data @- <<JSON
{
  "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
  "subject_token_type": "urn:openai:params:oauth:token-type:x509",
  "identity_provider_id": "${OPENAI_IDENTITY_PROVIDER_ID}",
  "service_account_id": "${OPENAI_SERVICE_ACCOUNT_ID}"
}
JSON
```

### X.509 request parameters

| Parameter              | Required | Description                                                                                          |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `grant_type`           | Yes      | Must be `urn:ietf:params:oauth:grant-type:token-exchange`.                                           |
| `subject_token_type`   | Yes      | Must be `urn:openai:params:oauth:token-type:x509`.                                                   |
| `identity_provider_id` | Yes      | The OpenAI X.509 Workload Identity Provider ID.                                                      |
| `service_account_id`   | Yes      | The OpenAI service account ID to resolve against the provider's service account mappings.            |
| `subject_token`        | No       | Omit this parameter. OpenAI obtains certificate identity only from the authenticated TLS connection. |

The X.509 endpoint accepts only exact `POST /oauth/token` requests on `mtls.auth.openai.com`. Other methods and paths return HTTP `403`.

## Identity validation

### JWT subject token validation

OpenAI verifies the external subject token before resolving a mapping. The token must:

- Be a JWT with a `kid` and supported `alg` in the header.
- Include `iss`, `aud`, `sub`, `exp`, and `iat` claims.
- Match the configured Workload Identity Provider issuer and audience.
- Be signed by a key from the configured JWKS source.

If verification fails, the token exchange returns an authentication error and doesn't mint an OpenAI access token.

After subject token validation succeeds, OpenAI resolves the requested service account mapping against the token's raw claims and derived attributes. Mapping mismatches fail the token exchange during mapping resolution.

### X.509 certificate validation

OpenAI verifies the client certificate against active Mutual TLS roots in the resolved organization and project context. The client must present any intermediate certificates required to build the path. OpenAI doesn't fetch missing intermediates from certificate URLs.

During certificate validation, OpenAI applies the certificate-admission rules configured with the active Mutual TLS root. After validation succeeds, OpenAI evaluates the provider's **Attribute conditions**, derives its `openai.*` attributes, and resolves exactly one enabled mapping for the requested service account. X.509 providers must derive one non-empty `openai.subject` value.

Malformed or missing certificate material, an invalid chain, a root mismatch, a certificate outside its validity period, or rejection by a Mutual TLS certificate-admission rule returns `invalid_subject_token`. Rejection by the provider's **Attribute conditions** expression returns `invalid_grant`. Other provider, mapping, or active-root configuration failures also return `invalid_grant`. X.509 requests never fall back to OIDC or another OAuth flow.

## Response

Successful responses include a short-lived bearer token:

```json
{
  "access_token": "eyJ...",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api.model.read api.model.request"
}
```

The `scope` property is returned only when the resolved mapping has permissions. Access tokens expire after at most one hour. A JWT exchange token never outlives its external subject token, and an X.509 exchange token never outlives the verified client certificate. Token exchange doesn't return a refresh token.

The `expires_in` value of `3600` in the example is illustrative. The returned lifetime can be shorter when the verified client certificate expires sooner.

## Token exchange errors

If token exchange fails, OpenAI doesn't mint an access token. Common causes include:

| Error category                 | Typical causes                                                                                                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing JWT request parameter  | `subject_token`, `subject_token_type`, `identity_provider_id`, or `service_account_id` is missing from a JWT exchange.                                                                                                                               |
| Unsupported token request      | `subject_token_type` isn't a supported JWT type or the X.509 token type, or the request uses fields that aren't accepted for that mode.                                                                                                              |
| Provider resolution error      | The Workload Identity Provider ID is malformed, unknown, disabled, or incompatible with the requested exchange mode.                                                                                                                                 |
| JWT subject token verification | The JWT is malformed, the header is missing `kid` or `alg`, the algorithm is unsupported, the signature is invalid, the issuer or audience doesn't match, a required claim is missing, the token is expired, or no JWKS key matches the token `kid`. |
| X.509 certificate verification | The client certificate is missing or malformed, the presented path doesn't reach an active root, the certificate is outside its validity period, or it doesn't satisfy configured certificate rules.                                                 |
| Mapping resolution             | No mapping exists for the requested service account, the matching mapping is disabled, the identity attributes don't match the mapping, or an attribute transformation fails.                                                                        |

Most subject-token problems are visible by decoding the JWT payload locally and comparing its `iss`, `aud`, `sub`, `exp`, `iat`, and provider-specific claims with your Workload Identity Provider and service account mapping configuration.

If token exchange succeeds but a later OpenAI API request fails, debug the minted access token as an authorization issue. The token still has the project, service account, endpoint authorization, IP allowlist, and other policy checks that apply to normal OpenAI API requests. An X.509 workload must also send an accepted client certificate to `mtls.api.openai.com` on the API request.

## Authorization behavior

Workload identity access tokens are backed by an OpenAI service account and project. On OpenAI API surfaces, they authorize like service-account API credentials rather than user OAuth tokens.

If a mapping defines permissions, those permissions further narrow the effective API access for tokens minted from that mapping. If a mapping doesn't define permissions, OpenAI doesn't add a workload identity federation-specific scope restriction, and authorization is derived from the mapped service account's project and organization roles.

Workload identity tokens don't bypass normal endpoint authorization. The target endpoint must still allow the effective permissions and project access carried by the token.

For X.509 exchanges, the bearer token replaces the API key, not the client certificate. The bearer and API mTLS certificate are verified independently. The bearer isn't certificate-bound and doesn't use DPoP or a `cnf` claim.

## Limitations

Workload identity federation currently has the following limitations:

- Workload identity access tokens can't be used to call Admin API endpoints. For Admin APIs, use an admin API key.
- Each organization can create at most 50 Workload Identity Providers. Each Workload Identity Provider can have at most 50 service account mappings.
- Workload identity access tokens aren't accepted by these endpoints: `DELETE /v1/models/{id}` and `POST /v1/images/request_audit`.
- Arbitrary OIDC issuer endpoints other than the providers documented in the [setup guides](https://developers.openai.com/api/docs/guides/workload-identity-federation) aren't supported yet.
- X.509 Workload Identity Providers reuse active Mutual TLS roots and don't have a separate certificate trust store.
- X.509 certificate exchange doesn't perform certificate revocation list (CRL) or OCSP checks.
- SPIFFE support is limited to JWT-SVID subject tokens. X.509-SVIDs aren't supported by this token exchange endpoint.