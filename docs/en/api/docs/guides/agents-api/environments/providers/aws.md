# AWS Lambda MicroVMs

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use [AWS Lambda MicroVMs](https://docs.aws.amazon.com/lambda/latest/dg/microvms-getting-started.html) to run your agent's tools in your AWS account. OpenAI runs the agent harness; each MicroVM runs `codex exec-server` and holds the session's workspace files.

By default, the examples use one MicroVM for one turn. Prepare a reusable image, then launch it from your application or an OpenAI webhook. Both paths use the same image and credentials. Choose one provisioning owner per session.

Try the [AWS Cookbook examples](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/aws) for application-managed and webhook-managed sandboxes.

## How it works

In the webhook path, your application creates a self-hosted session and sends input. When the session needs an executor, OpenAI sends `agent.session.action_required` with an `environment_connection` action. [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) delivers the webhook to a launcher [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html), which verifies the signature, checks the current session, and launches or resumes a MicroVM.

The MicroVM's `/run` hook fetches an environment key from [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) and starts the executor. The executor connects outbound to OpenAI, and the waiting input proceeds. Your application follows the session stream, downloads output files, and terminates the MicroVM after the final turn.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/aws-microvm-sandboxes-mobile.webp"
    width="680"
    height="1420"
  />
  <img src="https://developers.openai.com/images/api/agents-api/aws-microvm-sandboxes.webp"
    width="1480"
    height="1212"
    loading="lazy"
    alt="The application sends input to Agents API. A connection-required webhook flows through API Gateway and a launcher Lambda to an AWS Lambda MicroVM. The launcher uses a reusable image; the VM reads its environment key from Secrets Manager and connects outbound to OpenAI. The application retrieves output files."
  />
</picture>

## Before you begin

Prepare these resources:

- **AWS access:** An account with Lambda MicroVMs access, an AWS CLI that includes `lambda-microvms`, and permissions to build images and run MicroVMs. Follow AWS's [getting started guide](https://docs.aws.amazon.com/lambda/latest/dg/microvms-getting-started.html) to create the [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) artifact bucket and [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) image build role.
- **Application key:** Use `OPENAI_API_KEY` to create sessions and submit input.
- **Environment key (`OPENAI_EXECUTOR_API_KEY`):** Create a separate [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) with matching organization, project, and user or service-account ownership. Store its value in Secrets Manager, for example in a secret named `codex/agents-api/executor`. The `/run` hook passes it to Codex as `CODEX_API_KEY`.
- **MicroVM execution role:** Allow this role to read only the environment-key secret. Add decryption permission if you use a customer-managed KMS key. See AWS [security and permissions](https://docs.aws.amazon.com/lambda/latest/dg/microvms-security.html) for role setup.

Keep the application key and webhook signing secret outside the MicroVM. A webhook launcher needs these credentials in its own Secrets Manager secret; the VM receives only the ARN of its environment-key secret.

## Prepare a reusable image

Build an image with the [Codex CLI](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#prepare-your-environment), tool dependencies, a working directory such as `/workspace`, and an HTTP server for the AWS lifecycle hooks.

The examples implement these hooks under `/aws/lambda-microvms/runtime/v1`:

| Hook         | Behavior                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `/ready`     | Return HTTP 200 when the server is ready for AWS to snapshot. Leave the executor disconnected.        |
| `/validate`  | Check that Codex runs and the workspace is writable.                                                  |
| `/run`       | Read the session connection values and secret ARN, fetch the environment key, and start the executor. |
| `/suspend`   | Stop the executor before AWS snapshots the VM.                                                        |
| `/resume`    | Reload the environment key and restart the executor using the saved connection values.                |
| `/terminate` | Stop the executor before the VM terminates.                                                           |

Package the `Dockerfile` and hook server in an S3 artifact, then build a versioned image such as `codex-executor`. Enable all six hooks in the image configuration and set the hook port to match your server. Keep session IDs, credentials, and live executor connections out of the image snapshot. See AWS [MicroVM images](https://docs.aws.amazon.com/lambda/latest/dg/microvms-images.html) for build and hook configuration.

At launch, your application or launcher serializes these values as JSON in `runHookPayload`:

| Value                            | Purpose                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `session.environment.id`         | Identifies the environment the executor connects to.               |
| `session.environment.remote_url` | Provides the executor's OpenAI connection URL.                     |
| Environment-key secret ARN       | Lets the hook retrieve the key using the MicroVM's execution role. |

The `/run` hook parses this string from AWS's request body, retrieves the key, sets `CODEX_API_KEY` in the child process environment, and [starts the executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor). Return from the hook once the process starts. Waiting for the agent's turn to finish can cause a hook timeout.

Allow the executor's required [outbound connections](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access) and access to Secrets Manager. Configure an AWS egress connector for private resources or network restrictions. For file downloads, add a route to your server and call it through the MicroVM's HTTP endpoint with an AWS authentication token scoped to the server's port.

## Launch the MicroVM

Choose either application-managed or webhook-managed provisioning. In both cases, keep the session event stream open through connection, input, and completion.

### Application-managed provisioning

1. [Create a self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) whose working directory matches the image, then [open its event stream](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#consume-a-stream).
2. Call AWS [RunMicrovm](https://docs.aws.amazon.com/lambda/latest/microvm-api/API_RunMicrovm.html) with the image ARN and version, execution role, network connectors, and `runHookPayload`. Save the returned `microvmId` alongside the session ID.
3. Wait for `agent.session.environment.connected`, then [send input](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) and follow the turn's result.
4. Retrieve output files and [stop the MicroVM](#stop-the-microvm).

### Webhook-managed provisioning

Use an API Gateway HTTP API and a launcher Lambda. Your application creates the session, opens its stream, and submits input; the webhook launches or resumes compute when the session needs a connection.

1. Deploy a `POST /webhook` route that invokes the launcher. Grant `lambda:RunMicrovm`, `lambda:GetMicrovm`, `lambda:ResumeMicrovm`, and `lambda:TerminateMicrovm` permissions for the selected image. The launcher also needs to read its credentials, pass the MicroVM execution role, and use the configured network connectors.
2. [Register the endpoint](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) for `agent.session.action_required` and `agent.session.failed`. Store the endpoint's signing secret with the launcher's application key.
3. Verify the webhook signature against the raw request body before accessing sessions or launching compute. Retrieve the current session and confirm the handler owns it, for example by matching a dedicated saved agent.
4. If `environment_connection` is still pending, check the recorded VM with `GetMicrovm`. Resume a `SUSPENDED` VM with `ResumeMicrovm`, or wait for a `PENDING` or `RUNNING` VM to connect. Call `RunMicrovm` only when no VM is recorded. Save its ID in session metadata; if saving fails, terminate the VM you just launched.
5. If the session is still `failed`, terminate its recorded MicroVM. Ignore deleted sessions, resolved actions, and events owned by another handler.

If the executor connects before the [connection timeout](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#environment-connection-events), the waiting input proceeds without resubmission.

A prototype can launch synchronously and store the MicroVM ID in session metadata. Before production use, add durable launch ownership and idempotency, and [queue provisioning work](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#handle-lifecycle-webhooks). Metadata alone doesn't prevent duplicate launches, and slow launches can exceed the webhook response deadline.

## Stop the MicroVM

On the session stream, wait for `agent.session.turn.completed`, `agent.session.turn.failed`, or `agent.session.turn.cancelled` for the main agent (`event.turn.subagent_id` is `null`). Subagents share the MicroVM; their terminal events must not trigger cleanup. After the final turn, retrieve needed files, call `TerminateMicrovm`, and verify the VM reaches `TERMINATED`. Run cleanup on application errors too.

Turn outcomes are stream events, not webhook subscriptions. The `agent.session.failed` webhook handles session failures, but doesn't cover every failed turn. Don't terminate on `agent.session.idle` alone: it can arrive before waiting input starts.

Configure these AWS limits as a fallback for missed cleanup:

| Setting                                          | Guidance                                                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `maximumDurationInSeconds`                       | Set a ceiling for the workload, such as `900` for a 15-minute test. It can interrupt active work.                       |
| `maxIdleDurationSeconds`                         | Cover the expected workload. AWS measures inbound traffic; the executor's outbound connection doesn't reset this timer. |
| `suspendedDurationSeconds` / `autoResumeEnabled` | The examples use `0` / `false` by default and `300` / `false` with `--suspend-resume`.                                  |

See AWS [Running and using MicroVMs](https://docs.aws.amazon.com/lambda/latest/dg/microvms-launching.html) for lifetime and idle controls.

[Delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) separately. Session deletion doesn't terminate AWS compute or emit a deletion webhook. Retain the image and environment-key secret for reuse. For follow-up turns, coordinate compute reuse or replacement and file persistence using [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle).

## Suspend and resume between turns

Use AWS [suspend and resume](https://docs.aws.amazon.com/lambda/latest/dg/microvms-launching.html#microvms-launching-suspend-resume) to preserve memory and disk between turns. Set a nonzero `suspendedDurationSeconds`; snapshot storage charges apply while suspended. `maximumDurationInSeconds` limits total running and suspended time to eight hours.

Run either example with `--suspend-resume` to write `/workspace/hello.txt`, suspend the VM, then read the file in a second turn. The application-managed example resumes directly; the webhook-managed example sends another input, which triggers the launcher to resume the recorded VM. Both verify the file contents and clean up after the final turn.

The `/suspend` hook stops the executor; `/resume` reloads its key and reconnects it. Suspend only after tools and subagents finish. AWS automatic resume requires inbound VM traffic; Agents API input alone doesn't wake it.

## Verify and monitor

Test with a prompt that creates a small file in `/workspace`. Confirm that the executor connects, the turn completes, the downloaded file contains the expected result, and the MicroVM reaches `TERMINATED` after cleanup. A successful launch alone doesn't verify the integration.

From the AWS example directory, use `jq` to read the image ARN and region from the saved build state. Adjust the path if you used a custom `--state`, and replace the log group if you renamed the launcher:

```bash
image_state=application_managed/.local/image.json
region=$(jq -r '.region' "$image_state")
image_arn=$(jq -r '.image_arn' "$image_state")

aws logs tail /aws/lambda/codex-agents-api-webhook --since 10m --region "$region"

aws lambda-microvms list-microvms \
  --image-identifier "$image_arn" --region "$region" \
  --query 'items[].{id:microvmId,state:state}' --output table
```

Log session and MicroVM IDs together to trace a run. Keep credentials and raw webhook bodies out of logs.

## Troubleshooting

| Symptom                       | What to check                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Webhook signature is rejected | Use the endpoint's signing secret and verify the unmodified request body.                                                          |
| No MicroVM launches           | Check the webhook subscription, session ownership filter, pending `environment_connection` action, and launcher's IAM permissions. |
| Image build fails             | Check the S3 artifact, image build role, and `/ready` hook response.                                                               |
| `/run` fails or times out     | Check secret access and executor startup. Return after starting the process, not after the turn.                                   |
| Executor can't connect        | Check the environment ID, remote URL, key ownership, and outbound network access.                                                  |
| VM stops during a turn        | Check maximum lifetime and idle policy; outbound executor traffic doesn't count as inbound activity.                               |

For connection failures, inspect `agent.session.environment.failed` and the executor logs. See [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) for the shared executor contract.

## References

- Lifecycle: [Running and using MicroVMs](https://docs.aws.amazon.com/lambda/latest/dg/microvms-launching.html) covers launch, suspend, resume, and termination.
- Security: [Security and permissions](https://docs.aws.amazon.com/lambda/latest/dg/microvms-security.html) covers IAM roles, authentication tokens, and access controls.