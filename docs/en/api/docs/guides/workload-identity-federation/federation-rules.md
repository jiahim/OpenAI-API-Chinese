# Codex federation rule reference

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

A federation rule decides which verified workload identities may act as one
ChatGPT user or service account. OpenAI evaluates only the rule named by the
Codex process. It does not search every rule for a match.

Each rule has one target principal and can accept one or many upstream
identities. To accept a set of subjects in one rule, use a trailing-prefix
subject or a CEL condition. You can also create more than one rule for the same
principal.

For the setup procedure, see [Use workload identity with
Codex](https://developers.openai.com/codex/enterprise/workload-identity). To manage rules with code, see the
[workload identity Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api).

## Rule model

| Part                  | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| Provider              | Defines the issuer and signing keys OpenAI trusts.              |
| Workspace             | Limits the resulting access to one managed ChatGPT workspace.   |
| Principal             | Selects one existing user or service account in that workspace. |
| Identity checks       | Restrict which verified identity tokens may use the rule.       |
| Scopes                | Optionally narrow the existing Codex OAuth scopes.              |
| Access token lifetime | Limits the OpenAI access token to 60 through 3,600 seconds.     |

The principal and its workspace membership must exist before exchange. A rule
does not create a user, service account, or membership when a workload connects.

## How identity checks combine

A rule can use these checks:

| Check              | Behavior                                                              | Use it for                                               |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------------------- |
| Subject            | Exact `sub` value or one trailing `*` prefix.                         | One workload identity or a controlled subject namespace. |
| Accepted audiences | One through 32 audience strings. The token must contain at least one. | Tokens minted specifically for OpenAI.                   |
| Exact claims       | Up to 32 exact top-level scalar claim values.                         | Stable strings, numbers, true/false values, or null.     |
| CEL condition      | A boolean expression over the verified claim map named `assertion`.   | Lists, nested claims, or a set of allowed values.        |

Set at least one subject, exact-claim, or CEL check. An accepted
audience alone does not identify a workload. If you configure more than one
check type, each one must pass.

Provider verification happens first. A rule cannot override the provider's
issuer, signature, expiry, assertion-lifetime, replay, or provider-level CEL
checks.

## Subject matching

Use an exact subject whenever one stable `sub` identifies the workload:

```text
repo:example-company/payments:environment:production
```

One trailing `*` performs a prefix match:

```text
system:serviceaccount:production:codex-*
```

The wildcard must be the last character and must follow a non-empty prefix.
OpenAI does not accept `*`, `repo:*:production`, or `repo/*/main`.

Do not use a broad prefix when a more stable claim can separate privileged
workloads. For example, a GitHub rule should match a repository,
workflow file, ref, or protected environment rather than every repository
owned by one organization.

## Exact claims

Exact claims compare top-level JWT claims without converting their types. A
string matches only the same string, a boolean matches only the same boolean,
and a number matches the same numeric value. Lists and objects are not supported
as exact values.

For example:

```json
{
  "repository": "example-company/payments",
  "ref": "refs/heads/main",
  "environment": "production"
}
```

Do not include `sub` in the exact-claims map. Use the subject field or CEL.
Use CEL for nested provider claims and list membership.

## CEL conditions

CEL conditions receive the complete verified JWT claim map as `assertion` and
must return `true` or `false`. OpenAI supports a bounded CEL subset so rule
evaluation stays predictable.

To allow a set of exact subjects in one rule:

```text
assertion.sub in [
  "repo:example-company/payments:environment:production",
  "repo:example-company/billing:environment:production"
]
```

To require a repository and one of two refs:

```text
assertion.repository == "example-company/payments" &&
assertion.ref in ["refs/heads/main", "refs/heads/release"]
```

To read a nested or optional claim:

```text
has(assertion.environment) &&
assertion.environment == "production"
```

Supported helpers include `has`, `size`, `contains`, `startsWith`, and
`endsWith`. Regular-expression matching, collection iteration macros such as
`all` or `exists`, arbitrary functions, and identifiers other than `assertion`
are not supported. Keep expressions short and prefer exact checks when they
can express the same policy.

An absent claim, unsupported operation, non-boolean result, or evaluation error
rejects the exchange.

## Audience matching

The provider can set one expected audience. A rule can instead set one or more
accepted audiences. When a rule has an audience list, at least one value in the
token's `aud` claim must appear in that list.

Use a dedicated audience for OpenAI when your provider supports one. SPIFFE
JWT-SVID rules must set an accepted audience. An OIDC rule must also set one if
the provider does not define a provider-level audience.

Audience matching and identity checks are cumulative. A matching audience does
not compensate for a subject, exact-claim, or CEL check that does not pass.

## Principal cardinality

One rule maps to exactly one principal:

```text
many accepted external identities -> one federation rule -> one OpenAI principal
```

This supports workload replicas, jobs, or approved subjects acting as the same
user or service account. It does not let one rule choose a different
principal based on claims. Create separate rules when workloads need different
principals, workspaces, scopes, or token lifetimes.

More than one rule may target the same principal. Use separate rules when you need
independent lifecycle controls or clearer audit attribution for each workload.

## Scopes and authorization

The rule can narrow the OAuth scopes in the issued access token. It cannot grant
permissions the target principal or workspace does not already have.

When you omit scopes, OpenAI uses the standard Codex scopes: `openid`,
`profile`, `email`, and Codex local access. If you set scopes through the Admin
API, include `chatgpt.workspace.feature.allow-codex-local-access.access` and use
only those four supported values.

Choose the least-privilege principal and workspace permissions first. Treat
rule scopes as a second restriction, not the main authorization boundary.

## Token lifetime

Set the OpenAI access token lifetime from 60 through 3,600 seconds. OpenAI uses
the shorter of:

- The remaining lifetime of the upstream identity token.
- The rule's configured access-token lifetime.

Shorter lifetimes reduce how long an issued token can outlive a policy edit,
but increase exchange frequency. A 10-minute lifetime is a practical starting
point unless your workload needs a different balance.

## Replay protection

Provider-level replay protection uses the JWT `jti` claim. When an administrator
turns on **Prevent assertion replay** and the token has a non-empty `jti`, OpenAI
accepts that `jti` only once for that provider until the assertion expires.

The workload must get a new assertion with a new `jti` before every exchange,
including retries after an exchange whose outcome is unknown. Assertions without
`jti` remain usable but do not receive replay protection. Empty, null, or
non-string `jti` values do not pass validation.

## Changes, disablement, and archival

Ordinary edits to identity checks, scopes, or token lifetime apply to new exchanges.
Access tokens issued before the edit can remain valid until their existing TTL
ends.

Disabling a rule or provider blocks new exchanges and revokes OpenAI access
tokens issued through it. Archiving does the same and cannot be undone.
Changing provider trust, such as issuer or JWKS settings, revokes issued tokens
before the new trust configuration becomes active.

Use disablement for an emergency stop or a temporary pause. Archive a resource
only when you no longer need it.

## Limits

| Resource                                | Limit               |
| --------------------------------------- | ------------------- |
| Non-archived providers per organization | 50                  |
| Non-archived rules per provider         | 50                  |
| Exact claims per rule                   | 32                  |
| Accepted audiences per rule             | 32 unique values    |
| Subject length                          | 4,096 bytes         |
| Exact-claim map or CEL condition        | 16 KiB              |
| Access token lifetime                   | 60 to 3,600 seconds |

Create separate providers for trust boundaries that need independent issuer,
key, replay, or lifecycle controls. Create separate rules under one provider
for workloads that share trust but need different principals or access policy.