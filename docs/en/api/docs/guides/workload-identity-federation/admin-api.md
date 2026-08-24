# Manage Codex workload identity with the Admin API

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use the organization Admin API to manage Codex workload identity providers and
federation rules from infrastructure tooling or CI. The API exposes the same
provider and rule model as the OpenAI Admin Portal.

The API calls federation rules `mappings` in paths and response objects. This
page uses **federation rule** for the product concept and `mapping` only when it
refers to an API field or path.

These endpoints manage the Codex workload identity federation beta for managed
  ChatGPT workspaces. To request access, contact your OpenAI representative or
  [OpenAI
  Support](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).
  These endpoints do not replace the existing OpenAI API workload identity
  provider and service account mapping APIs.

## Prerequisites

You need:

- Workload identity federation enabled for your organization and managed
  ChatGPT workspace.
- An [Admin API key](https://platform.openai.com/settings/organization/admin-keys)
  whose owner is an active administrator allowed to manage workload identity.
- The ID of the managed ChatGPT workspace.
- The OpenAI user ID of an existing active human or service account in that
  workspace.
- The issuer, audience, and claims for the workload's OIDC token or SPIFFE
  JWT-SVID.

The WIF endpoints use resource IDs instead of names. They do not list or create
ChatGPT workspaces or principals. Supply those IDs from your provisioning system.
If you do not manage those resources programmatically, use the OpenAI Admin
Portal to create or select the principal and connect that workload.

Set the Admin API key in your environment:

```bash
export OPENAI_ADMIN_KEY="<admin-api-key>"
```

Admin API keys are long-lived credentials. Store the key in a secrets manager,
do not commit it, and do not use it for Codex runtime authentication.

## Endpoints

All requests use `https://api.openai.com` and an Admin API key in the bearer
authorization header.

| Operation                    | Method and path                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| List providers               | `GET /v1/organization/workload_identity/providers`                                        |
| Create a provider            | `POST /v1/organization/workload_identity/providers`                                       |
| Get a provider               | `GET /v1/organization/workload_identity/providers/{provider_id}`                          |
| Update or disable a provider | `POST /v1/organization/workload_identity/providers/{provider_id}`                         |
| Archive a provider           | `DELETE /v1/organization/workload_identity/providers/{provider_id}`                       |
| List rules                   | `GET /v1/organization/workload_identity/providers/{provider_id}/mappings`                 |
| Create a rule                | `POST /v1/organization/workload_identity/providers/{provider_id}/mappings`                |
| Get a rule                   | `GET /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}`    |
| Update or disable a rule     | `POST /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}`   |
| Archive a rule               | `DELETE /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}` |

List responses use `{ "object": "list", "data": [...] }`. The endpoints do
not use pagination.

## Create an OIDC provider

Create one provider for each issuer and trust boundary that you want to manage
independently. Replace the example issuer and audience with exact values from a
sample token. Inspect the token's `iat` and `exp` claims locally, then choose an
accepted assertion lifetime that covers the issuer's expected `exp - iat`
range. OpenAI checks that full duration, not the token's remaining validity.

For Microsoft Entra, do not assume a one-hour assertion. [Access-token lifetimes
vary](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime),
and Microsoft does not support [configuring managed-identity token
lifetimes](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
Replace `MAX_ASSERTION_LIFETIME_SECONDS` with an approved integer from 1 through
176,400. This provider limit is separate from the lifetime of the OpenAI access
token that a federation rule issues.

```bash
MAX_ASSERTION_LIFETIME_SECONDS="<accepted-issuer-lifetime-seconds>"

jq -n \
  --argjson max_assertion_lifetime_seconds "$MAX_ASSERTION_LIFETIME_SECONDS" \
  '{
    name: "entra-production",
    type: "oidc",
    issuer: "https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000/v2.0",
    audience: "api://openai-codex-production",
    description: "Production Codex workloads in Microsoft Azure",
    max_assertion_lifetime_seconds: $max_assertion_lifetime_seconds,
    check_jti: true
  }' > provider.json

curl --fail-with-body --silent --show-error \
  https://api.openai.com/v1/organization/workload_identity/providers \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  --data @provider.json \
  --output provider-response.json

PROVIDER_ID="$(jq -r .id provider-response.json)"
printf 'Created provider %s\n' "$PROVIDER_ID"
```

Expected output begins with an identity-provider ID:

```text
Created provider idp_...
```

By default, an OIDC provider uses discovery at its issuer URL. Use `custom_url`
when the public discovery document lives elsewhere, `jwks_uri` for an
explicit public JWKS URL, or `jwks_local: true` with `jwks` to upload public
keys. Do not include private key material.

## Create a SPIFFE JWT-SVID provider

Set `type` to `spiffe_jwt`, set `issuer` to the canonical trust domain, and
provide either a public bundle URL or an uploaded SPIFFE bundle. A SPIFFE rule
must also set `audiences`.

```json
{
  "name": "spiffe-production",
  "type": "spiffe_jwt",
  "issuer": "spiffe://example.com",
  "jwks_uri": "https://spiffe.example.com/bundle.json",
  "max_assertion_lifetime_seconds": 3600,
  "check_jti": true
}
```

For an uploaded bundle, set `jwks_local` to `true`, replace `jwks_uri` with the
`jwks` object, and include at least one public key whose `use` is `jwt-svid`.

## Create a federation rule

A rule targets one existing principal and can match one or many external
workload identities. This example accepts one Azure managed identity subject:

```bash
export WORKSPACE_ID="<managed-chatgpt-workspace-id>"
export PRINCIPAL_ID="<existing-openai-user-id>"

jq -n \
  --arg workspace_id "$WORKSPACE_ID" \
  --arg principal_id "$PRINCIPAL_ID" \
  '{
    name: "entra-payments-production",
    description: "Production payments workload",
    workspace_id: $workspace_id,
    principal_id: $principal_id,
    external_subject: "11111111-2222-3333-4444-555555555555",
    audiences: ["api://openai-codex-production"],
    access_token_lifetime_seconds: 600,
    enabled: true
  }' > rule.json

curl --fail-with-body --silent --show-error \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  --data @rule.json \
  --output rule-response.json

FEDERATION_RULE_ID="$(jq -r .id rule-response.json)"
printf 'Created federation rule %s\n' "$FEDERATION_RULE_ID"
```

Expected output begins with a mapping ID. This is the value Codex uses as
`OPENAI_FEDERATION_RULE_ID`:

```text
Created federation rule idpm_...
```

For a set of allowed subjects in one rule, omit `external_subject` and use a CEL
condition:

```json
{
  "condition": "assertion.sub in [\"workload-a\", \"workload-b\"]"
}
```

Set at least one of `external_subject`, `claims`, or `condition`. All configured
identity checks must pass. See the [federation rule
reference](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) for
cardinality, CEL, audience, scope, and lifetime behavior.

## List and reconcile resources

List providers before creating one so your automation can compare the intended
configuration with the current state:

```bash
curl --fail-with-body --silent --show-error \
  https://api.openai.com/v1/organization/workload_identity/providers \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" | jq .
```

Then list rules under a provider:

```bash
curl --fail-with-body --silent --show-error \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" | jq .
```

The API does not define an idempotency-key contract. Store returned IDs in your
approved configuration state, read the current resource before changing it,
and update by ID. Do not create a replacement on every run.

## Update or disable a resource

Updates use `POST` with only the fields you want to change. This example changes
the rule lifetime:

```bash
curl --fail-with-body --silent --show-error \
  -X POST \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"access_token_lifetime_seconds": 300}' | jq .
```

Disable a rule for an immediate stop:

```bash
curl --fail-with-body --silent --show-error \
  -X POST \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}' | jq .
```

Set `enabled` to `false` on the provider path to stop every rule under that
provider. Disablement blocks new exchanges and revokes access tokens issued
through the resource. You can turn it back on after its principal, workspace,
binding, and provider are active.

Ordinary rule edits affect only new exchanges. Tokens issued before the edit can
remain valid until their TTL ends. Provider trust edits revoke issued tokens
before the new trust takes effect.

## Archive a resource

`DELETE` archives a provider or rule instead of erasing it. Archival blocks new
exchanges, revokes issued tokens, hides the resource from normal list results,
and cannot be undone.

Archive a rule:

```bash
curl --fail-with-body --silent --show-error \
  -X DELETE \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

Archive a provider:

```bash
curl --fail-with-body --silent --show-error \
  -X DELETE \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

Archiving a provider revokes access for its Codex rules. You must remove any
non-Codex product mapping before you can archive that provider. This protects
existing OpenAI API workload identity configuration.

## Provider fields

Create requires `name` and `issuer`. Update accepts the mutable fields except
`type`.

| Field                            | Type and behavior                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`                           | Non-empty display name.                                                                                          |
| `type`                           | `oidc` by default, or `spiffe_jwt`. You cannot change it after creation.                                         |
| `issuer`                         | Exact OIDC `iss` URL or canonical SPIFFE trust domain.                                                           |
| `audience`                       | Optional provider-level audience. Set a rule audience when this is absent.                                       |
| `description`                    | Optional administrator description.                                                                              |
| `custom_url`                     | Optional public HTTPS OIDC discovery URL. OIDC only.                                                             |
| `jwks_uri`                       | Optional public HTTPS JWKS or SPIFFE bundle URL.                                                                 |
| `jwks_local`                     | Set to `true` when supplying `jwks`.                                                                             |
| `jwks`                           | Uploaded public JWKS object, up to 100 keys and 1 MiB.                                                           |
| `custom_ca_certificate`          | Optional PEM CA bundle for JWKS HTTPS, up to 256 KiB.                                                            |
| `attribute_conditions`           | Optional bounded CEL condition applied before rule matching. Use `assertion` for the verified claims.            |
| `max_assertion_lifetime_seconds` | Accepted upstream assertion lifetime, 1 through 176,400 seconds. OIDC uses the full `exp - iat`. Default: 3,600. |
| `check_jti`                      | When `true`, reject a repeated non-empty JWT `jti`. Default: `false`.                                            |
| `enabled`                        | Update-only switch that accepts or blocks exchanges.                                                             |

Discovery and explicit or uploaded keys are alternative verification modes.
Issuer, discovery, and JWKS URLs have validation requirements described in the
[workload identity overview](https://developers.openai.com/api/docs/guides/workload-identity-federation#manage-jwks-and-key-rotation).

## Federation rule fields

Create requires `workspace_id` and `principal_id`, plus at least one identity
check. You cannot change the workspace or principal after creation.

| Field                           | Type and behavior                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `workspace_id`                  | Existing managed ChatGPT workspace ID. Create-only.                                                  |
| `principal_id`                  | Existing active OpenAI user or service-account ID in the workspace. Create-only.                     |
| `external_subject`              | Exact `sub` or one trailing-`*` prefix, up to 4,096 bytes.                                           |
| `claims`                        | Up to 32 exact top-level scalar claims. Do not include `sub`.                                        |
| `audiences`                     | One through 32 unique accepted audiences. Required for SPIFFE and when the provider has no audience. |
| `condition`                     | Bounded CEL boolean condition over `assertion`, up to 16 KiB.                                        |
| `scopes`                        | Optional subset of the four supported Codex scopes. Omit to use the default set.                     |
| `access_token_lifetime_seconds` | 60 through 3,600 seconds. Default: 3,600.                                                            |
| `name`                          | Optional display name.                                                                               |
| `description`                   | Optional administrator description.                                                                  |
| `enabled`                       | Whether the rule accepts exchanges. Default: `true`.                                                 |

Provider responses use `workload_identity_provider`; rule responses use
`workload_identity_mapping`. Both include `id`, `enabled`, `created_at`, and
`updated_at`. Timestamps are Unix seconds.

## Limits and errors

An organization can have up to 50 non-archived providers. A provider can have up
to 50 non-archived rules. The API returns:

- `400` for request field errors, provider trust settings, rule conditions, scopes, or
  inactive principal membership.
- `403` when the Admin API key owner cannot manage workload identity.
- `404` when the organization has no tenant association or the requested
  resource is outside the organization and tenant boundary.
- `409` for provider or rule limits, subject conflicts, inactive bindings, or
  lifecycle conflicts.

Treat `404` as non-disclosing: the service does not reveal a provider or rule
owned by another organization or tenant. Retry transient `429` and `5xx`
responses with bounded delays that increase after each attempt. Do not retry a
validation or permission error without changing the request or administrator
state.