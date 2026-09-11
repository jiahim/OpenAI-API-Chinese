# Oracle Cloud Infrastructure (OCI)

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Run an Agents API session in an OCI GenAI Sandbox. This guide follows Oracle's beta Python example and uses **application-managed provisioning**: your application creates and deletes both the Agents API session and the OCI sandbox.

See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) for the provisioning modes and connection behavior.

OCI GenAI Sandboxes are in beta. Contact your Oracle account manager to
  request access for your account.

## Before you begin

Create a sandbox-enabled Generative AI Project. Grant your OCI identity permission to manage projects and sandboxes in its compartment. Replace the placeholders in these IAM policies:

```text
allow group <group-name> to manage generative-ai-sandbox in compartment <compartment-name>
allow group <group-name> to manage generative-ai-project in compartment <compartment-name>
```

Use a sandbox runtime with Node.js and `npm`. Oracle's example requests `python-3.11` by default; choose a compatible custom runtime if it doesn't include `npm`.

If your project restricts outbound traffic, allow HTTPS to `registry.npmjs.org` to install Codex, HTTPS to `api.openai.com`, and secure WebSocket connections to `codex-cloud-environments.chatgpt.com`. See [executor network access](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access).

## 1. Install the OCI CLI and beta SDK

Create a virtual environment and install the OCI CLI:

```bash
uv venv --python 3.14
source .venv/bin/activate
uv pip install --upgrade oci-cli
```

Then install the beta Python SDK supplied by Oracle during onboarding:

```bash
uv pip install "/path/to/oci-<beta-version>-py3-none-any.whl"
```

Install the beta SDK **after** the CLI. Installing or upgrading `oci-cli` afterward can replace it with the `oci` package from PyPI; reinstall the beta wheel if that happens. The beta SDK must include `oci.generative_ai_sandbox`.

## 2. Configure the OCI environment

Authenticate a security-token profile in the region enabled for your account:

```bash
oci session authenticate --profile-name Sandbox --region us-chicago-1
```

Set the project OCID and OpenAI credentials without committing them:

```bash
export OCI_SANDBOX_PROJECT_ID="ocid1.generativeaiproject..."
export OPENAI_API_KEY="..."
export OPENAI_EXECUTOR_API_KEY="..."
```

Use the application key for Agents API requests. Pass only the separate restricted executor key into the sandbox as `CODEX_API_KEY`. Both keys must have the same owner, organization, and project. See [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

Oracle's example reads the `Sandbox` profile and uses `us-chicago-1`. To override its defaults:

```bash
export OCI_SANDBOX_PROFILE="my-profile"
export OCI_SANDBOX_REGION="us-chicago-1"
```

The example also accepts these optional settings:

| Setting                  | Default                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `OCI_SANDBOX_ENDPOINT`   | `https://inference.generativeai.<region>.oci.oraclecloud.com` |
| `OCI_SANDBOX_RUNTIME`    | `python-3.11`                                                 |
| `OCI_SANDBOX_SHAPE`      | `SMALL`                                                       |
| `OCI_SANDBOX_EXPIRATION` | `PT30M` (30 minutes)                                          |

When configuring your own application, use the profile's security token and private key with `oci.auth.signers.SecurityTokenSigner`. Create a sandbox client with `GenerativeAiSandboxClient` from `oci.generative_ai_sandbox`, using the selected region and endpoint.

## 3. Run an application-managed session

Use the [self-hosted connection guide](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) for the Agents API requests and executor startup command. Follow the same flow as Oracle's example:

1. Create a self-hosted Agents API session with `/workspace` as its working directory. Save the session ID and environment ID.
2. Create an OCI GenAI Sandbox and wait for it to reach `RUNNING`.
3. Install Codex and write `/workspace/brief.txt` into the sandbox.
4. Start `codex exec-server` using the session's environment ID and the restricted executor key.
5. Open the session event stream, then send input asking the agent to turn `brief.txt` into a migration plan. Wait for completion and read the generated `/workspace/plan.md`.
6. Stop and delete the OCI sandbox, then [delete the Agents API session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session). Attempt both cleanup operations even if one fails.

Keep both resources alive for follow-up turns and retrieve files before deleting the sandbox. Use the beta SDK version specified by Oracle; preview releases may rename sandbox APIs.

## References

- Read [OCI Generative AI documentation](https://docs.oracle.com/en-us/iaas/Content/generative-ai/)
- Read [OCI Python SDK documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/pythonsdk.htm)
- Read [OCI TypeScript SDK documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)
- Read [OCI CLI authentication](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/clitoken.htm)