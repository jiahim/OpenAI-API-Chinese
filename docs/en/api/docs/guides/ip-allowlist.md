# IP allowlist

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

An IP allowlist lets you restrict OpenAI API requests to IP addresses or CIDR ranges that you trust. When you enable an allowlist, OpenAI rejects requests from other IP addresses even if they include a valid API key.

Use an IP allowlist as another layer of protection for production workloads with fixed or well-defined network egress. It applies only to API requests; it does not restrict access to [platform.openai.com](https://platform.openai.com) or user sign-in.

IP allowlisting controls requests that your applications send to OpenAI. If
  you need to allow requests that OpenAI products send to services you control,
  use the published [IP egress ranges](https://developers.openai.com/api/docs/guides/ip-addresses) instead.

## Before you enable an allowlist

Identify the public egress IP address or range for every workload that calls the API. Check the address after any network address translation (NAT), VPN, firewall, or proxy, because the API evaluates the source IP that reaches OpenAI.

An allowlist can contain up to 50 individual IP addresses or CIDR ranges. The organization owner role includes the `Read` and `Write` permissions needed to manage IP allowlist settings. For more information about permissions, see [Manage permissions in the OpenAI platform](https://developers.openai.com/api/docs/guides/rbac).

Start with one non-critical project before applying an allowlist to your entire organization. Keep a tested request path from an allowed IP available while you test the configuration.

Project-level allowlists take precedence over organization-level allowlists. The entries do not combine: a project with its own active allowlist uses that allowlist, while a project without one uses the organization-level allowlist.

## Configure an IP allowlist

1. Open [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).
2. Add the individual IP addresses or CIDR ranges that you want to allow. For example, use `203.0.113.10` for one address or `203.0.113.0/24` for a range.
3. Optionally, use the **Check** tool to confirm that the allowlist includes a specific IP address.
4. Enable the allowlist for a specific project or for your entire organization.
5. Wait up to 15 minutes for the change to take effect.
6. Send API requests from each expected environment to verify access.

Enabling an organization-level allowlist affects API requests for projects
  that do not have their own active allowlist. Confirm every production,
  staging, CI, and disaster-recovery egress path in each affected scope before
  you enable it.

## Verify enforcement

From an allowed network path, send a representative API request. For example:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

The request should complete according to the API key's normal authentication and authorization. From an IP address that is not included in the active allowlist, the request fails with HTTP `401` and the `ip_not_authorized` error code.

## Troubleshoot blocked requests

If an expected request fails with `ip_not_authorized`:

- Confirm the workload's public egress IP from the same network path that sends the API request. A local development machine can have a different public IP than a deployed service.
- Check whether a NAT gateway, VPN, firewall, proxy, or cloud provider changed the egress address.
- Use the **Check** tool in [IP allowlist settings](https://platform.openai.com/settings/organization/security/ip-allowlist) to check the address against the configured entries.
- Confirm that the active allowlist applies to the organization or project associated with the API key.
- Wait up to 15 minutes after a configuration change, then test again.

An IP allowlist does not replace secure API key storage, key rotation, or account security. If a request must originate from a private Azure network instead of a public IP, consider [Private Link](https://developers.openai.com/api/docs/guides/private-link); Private Link is not compatible with IP allowlist controls.