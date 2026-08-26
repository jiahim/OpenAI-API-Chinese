# Mutual TLS

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Mutual TLS (mTLS) adds TLS client certificate verification to OpenAI API
requests. After you activate a trusted certificate for an organization or
project, requests in that scope must present an accepted client certificate in
addition to their normal bearer credential.

Use mTLS when a workload can securely hold a client private key and you want
OpenAI to verify its certificate identity before authorizing an API request.
mTLS does not replace API keys, service-account credentials, or workload
identity access tokens.

X.509 workload identity federation uses the same active mTLS trust anchors.
  The certificate exchange returns a short-lived bearer token, and later API
  calls still send that bearer token plus an accepted API mTLS certificate. See
  [Configure workload identity federation with X.509
  certificates](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509).

## Before you configure mTLS

Any API organization can manage mTLS through normal role-based access control
(RBAC):

- `api.mtls.read` lets a principal list, view, and test certificate settings.
- `api.mtls.write` lets a principal upload, update, activate, deactivate, and
  delete certificates.

The organization owner role includes these permissions, but you can grant them
through a custom role. For more information, see [Manage permissions in the
OpenAI platform](https://developers.openai.com/api/docs/guides/rbac).

Prepare:

- A client certificate and its private key for each workload.
- Any intermediate certificates needed to build a path from the client
  certificate to your trust anchor.
- A stable PEM-encoded trust anchor that you can activate at the organization
  or project level.
- A non-critical project and a tested recovery path before you enable mTLS for
  production traffic.

Keep private keys outside source control. Do not log private keys, certificate
contents, or bearer credentials.

## Upload and activate trust

Upload stores a certificate but does not enforce mTLS. Activation is the step
that changes request behavior.

1. Open [Organization settings > Security > Mutual
   TLS](https://platform.openai.com/settings/organization/security/mtls).
2. Upload one PEM-encoded trust anchor for each certificate object. Give it a
   name that identifies the authority and rotation generation.
3. Optionally, add a [CEL filter](#filter-client-certificates-with-cel) that
   constrains which verified client certificates that anchor can accept.
4. Activate the certificate for a non-critical project first. Send
   representative requests through an [mTLS API host](#use-an-mtls-host) from
   every expected workload.
5. Activate the certificate for other projects or for the organization
   after validation succeeds.

You can also manage certificates through the API:

| Task                                        | Endpoint                                                                                                                                                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upload a certificate                        | `POST /v1/organization/certificates`                                                                                                                                                                     |
| List organization certificates              | `GET /v1/organization/certificates`                                                                                                                                                                      |
| Retrieve, update, or delete a certificate   | `GET`, `POST`, or `DELETE /v1/organization/certificates/{certificate_id}`                                                                                                                                |
| Activate or deactivate for an organization  | `POST /v1/organization/certificates/activate` or `POST /v1/organization/certificates/deactivate`                                                                                                         |
| List, activate, or deactivate for a project | `GET /v1/organization/projects/{project_id}/certificates`, `POST /v1/organization/projects/{project_id}/certificates/activate`, or `POST /v1/organization/projects/{project_id}/certificates/deactivate` |

Use a credential with the required `api.mtls.read` or `api.mtls.write`
permission. For request and response schemas, see the [organization
certificates API reference](https://developers.openai.com/api/reference/resources/admin/subresources/organization).

## Certificate requirements

Use one PEM-encoded trust anchor per certificate object. The upload must
contain a valid certificate that expires more than one day after upload. The
client certificate must include an Authority Key Identifier (AKI) for request
verification.

For a request to pass mTLS:

- The client certificate must be valid at request time and suitable for TLS
  client authentication.
- The client certificate must build a valid path to an active organization- or
  project-level trust anchor.
- If the path includes intermediate certificates, the client must present them
  during the TLS handshake.
- The configured trust anchor and the client chain must pass standard X.509
  client-certificate path validation.

If an upload contains more than one PEM-encoded certificate, request-chain
verification uses only the first configured certificate as the anchor; do not
rely on PEM-bundle semantics.

OpenAI does not fetch missing intermediates from Authority Information Access
(AIA) URLs and does not perform certificate revocation list (CRL) or Online
Certificate Status Protocol (OCSP) checks. Present the complete required chain
and manage incident response through certificate rotation, deactivation, and
your own certificate lifecycle controls.

## Understand verification order

OpenAI checks active project-level certificates before active
organization-level certificates. If neither scope has an active certificate,
mTLS does not add a certificate check to the request.

When an active certificate exists, OpenAI verifies client identity in this
order:

1. OpenAI first attempts the existing direct path, which verifies the client
   certificate directly against an active anchor without request
   intermediates.
2. After an ordinary direct-path no-match, OpenAI tries request-chain
   verification with the client certificate and the intermediate certificates
   presented by the TLS connection.
3. If a path verifies, OpenAI evaluates the active certificate's CEL filter, if
   present, against the verified client certificate.

Request-chain verification is available by default.

The request-chain path is a fallback after an ordinary no-match, not a recovery
path for every direct-path error. Missing or malformed certificate material, a
missing AKI, or a deterministic error after the direct path selects an
anchor can fail the request without trying the presented chain.

## Filter client certificates with CEL

Attach an optional Common Expression Language (CEL) filter to an uploaded
certificate to constrain the verified client certificates that anchor accepts.
The expression must evaluate to a boolean and runs against the verified client
certificate on both the direct and request-chain paths.

CEL exposes these fields:

- `subject.common_name`, `subject.country_code`, `subject.organization`,
  `subject.organizational_unit`, `subject.locality`, `subject.province`,
  `subject.street_address`, and `subject.postal_code`.
- `subject_alt_names`, a list whose entries expose `type`, `value`, and `oid`.
  Supported SAN type identifiers are `DNS`, `EMAIL`, `IP_ADDRESS`, `URI`, and
  `CUSTOM`.

For example, require a production organizational unit and a DNS SAN in a
specific namespace:

```text
subject.organizational_unit == "Production" &&
subject_alt_names.exists(san, san.type == DNS && san.value.endsWith(".example.com"))
```

A certificate that verifies but does not match the filter fails with
`certificate_attribute_verification_failed`. OpenAI rejects a policy that does not pass validation when you save it.

## Use an mTLS host

Send API traffic to an mTLS host instead of `api.openai.com`:

| Host                     | Use                                   |
| ------------------------ | ------------------------------------- |
| `mtls.api.openai.com`    | Default API mTLS host.                |
| `mtls-us.api.openai.com` | United States regional API mTLS host. |
| `mtls-eu.api.openai.com` | EU regional API mTLS host.            |

mTLS is host-based. Use the same `/v1` route you would call on the
corresponding API surface, and test each API and model that your workload
uses. Route and model availability can differ across regional hosts.

For example, send a normal bearer credential and a client certificate to the
default mTLS host:

```bash
export OPENAI_MTLS_CERT_CHAIN="/path/to/client-chain.pem"
export OPENAI_MTLS_KEY="/path/to/client-key.pem"

curl https://mtls.api.openai.com/v1/models \
  --cert "$OPENAI_MTLS_CERT_CHAIN" \
  --key "$OPENAI_MTLS_KEY" \
  --header "Authorization: Bearer $OPENAI_API_KEY"
```

The certificate-chain file should contain the client certificate first,
followed by any required intermediates. Do not send certificate material in
HTTP headers or request bodies.

X.509 workload identity federation uses a separate exact exchange endpoint:
`POST https://mtls.auth.openai.com/oauth/token`. That exchange produces a
short-lived bearer token; it does not provide certificate-only API authentication. For
the complete request shape, see the [workload identity token exchange
reference](https://developers.openai.com/api/reference/workload-identity-federation#exchange-an-x509-certificate).

## Rotate certificates

Rotate trust anchors with overlap so existing workloads keep working:

1. Upload the new trust anchor without deactivating the old one.
2. Activate the new anchor in each intended project or at the organization
   level.
3. Update workloads to present client certificates that chain to the new
   anchor, then test each mTLS host and API surface they use.
4. Deactivate the old anchor after all workloads have moved.
5. Delete the old certificate only after you deactivate it for the organization
   and every project.

You can rotate intermediates without changing the configured trust anchor.
Present the new complete chain on later requests.

## Troubleshoot requests

Use stable error codes to distinguish configuration errors from temporary
service errors:

| Error code                                  | What to check                                                                                                                           |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `certificate_required`                      | An active certificate applies, but the request did not present required client certificate material.                                    |
| `invalid_certificate`                       | OpenAI cannot decode or parse the client certificate, or the certificate lacks the AKI required for verification.                       |
| `certificate_verification_failed`           | The client certificate or presented chain does not reach an active trust anchor.                                                        |
| `certificate_attribute_verification_failed` | The certificate path verified, but the CEL filter rejected the verified client certificate.                                             |
| `authentication_temporarily_unavailable`    | A verifier timeout, internal dependency error, or CEL evaluator error caused HTTP `503`. Retry with your normal transient-error policy. |

For management requests, `mtls_certificate_invalid` means the uploaded PEM
did not pass validation, `expired_certificate` means it expires too soon or has
expired, `mtls_cel_policy_invalid` means the filter does not pass validation, and
`certificate_in_use` means you must deactivate the certificate before deleting
it.

## Current limitations

- An organization can upload up to 50 certificate objects.
- mTLS adds certificate verification to normal API authentication; it does not provide
  certificate-only API authorization.
- OpenAI does not fetch AIA intermediates and does not perform CRL or OCSP
  checks.
- Private Link is not compatible with mTLS. See [Private
  Link](https://developers.openai.com/api/docs/guides/private-link) when you need a private Azure network
  path instead.
- The supported API mTLS hosts are `mtls.api.openai.com`,
  `mtls-us.api.openai.com`, and `mtls-eu.api.openai.com`. Do not assume every
  other regional API host has an mTLS counterpart.
- X.509 workload identity federation does not return a refresh token and does
  not use DPoP, a `cnf` claim, or a certificate-bound bearer token. See
  [Configure workload identity federation with X.509
  certificates](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509).