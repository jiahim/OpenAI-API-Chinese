# Sandbox security

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Agent-generated code can access the files, credentials, and network available to its environment.




## Isolate workloads

Run workloads in isolated compute, such as virtual machines. Use separate environments for users or workloads that must not share data. Create a dedicated OpenAI project for your application or workload.




## Restrict network access

Allow outbound traffic only to approved endpoints, including the executor's [required hosts](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access).

Configure network access based on where each tool connection runs:

- **Executor MCPs** connect from your environment. Allow access to the servers they need.
- **Remote MCPs** connect from OpenAI's service. Their endpoints must be reachable from that service.

See [MCP tools](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) for connection options.




## Separate credentials

Grant your application key `api.agents.read` and `api.agents.write` for sessions, plus `api.responses.write` for inference. Add `api.vaults.read` and `api.vaults.write` to manage vaults.

Give the executor an [environment key](https://platform.openai.com/agents?tab=environments&environment_view=keys) as `CODEX_API_KEY`. This key only permits connecting environments. It cannot authorize any other API action. See [Executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) for setup.

Agent-generated code can read the environment key. Keep your application API key outside the environment. Do not embed keys in images, source code, or logs. Rotate or revoke keys when needed.




## Broker third-party access

Keep third-party credentials outside the environment. Where possible, route requests through a credential broker. The broker injects secrets into approved outbound requests without placing them in the agent's environment.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/sandbox-security-1-mobile.webp"
    width="680"
    height="1252"
  />
  <img src="https://developers.openai.com/images/api/agents-api/sandbox-security-1.webp"
    width="1400"
    height="848"
    alt="In an example you configure, sandbox tools send requests to an external proxy that adds scoped credentials for approved destinations. The restricted executor key remains readable inside the sandbox."
    loading="lazy"
  />
</picture>

Store long-lived credentials in a secrets manager. Injecting a stored secret into the environment still exposes it to agent-generated code. Rotate credentials regularly and revoke them immediately if you suspect exposure.