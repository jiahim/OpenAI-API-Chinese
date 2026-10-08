# Bedrock Managed Agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

For Responses and other OpenAI platform APIs, see [OpenAI on Amazon
  Bedrock](https://developers.openai.com/api/docs/guides/amazon-bedrock).

Amazon Bedrock Managed Agents, powered by OpenAI, adapts the
[Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) for AWS. It runs the OpenAI
agent harness and model inference in Amazon Bedrock. The harness coordinates the
agent's work; Amazon Bedrock AgentCore Runtime or self-hosted compute runs its
commands and tools.

## Compare with the Agents API

Both services use agent and session concepts. Execution environments,
authentication, and supporting services differ:

| Area                  | OpenAI Agents API                                         | Bedrock Managed Agents                   |
| --------------------- | --------------------------------------------------------- | ---------------------------------------- |
| Agent loop            | Managed by OpenAI                                         | Hosted in Amazon Bedrock                 |
| Model inference       | OpenAI API                                                | Amazon Bedrock                           |
| API endpoint          | OpenAI API                                                | Amazon Bedrock service endpoint          |
| Execution environment | OpenAI-hosted sandbox, self-hosted sandbox, or no sandbox | AgentCore Runtime or self-hosted compute |
| API authentication    | OpenAI project API key                                    | AWS IAM credentials with SigV4 signing   |

Choosing a self-hosted sandbox for the OpenAI Agents API changes where commands
and tools run. Its managed harness and model inference still use the OpenAI
service.

Shared concepts don't imply identical API contracts or feature availability.
  Before adapting OpenAI Agents API examples, check AWS guidance for the current
  Bedrock Managed Agents endpoint, supported models, tools, and environment
  configuration.

## Next steps

See the [Bedrock Managed Agents overview](https://aws.amazon.com/bedrock/managed-agents-openai/) and check AWS documentation for access requirements,
supported Regions, permissions, service limits, and pricing. Check its
data-handling guidance for session state, execution files, logs, and model inference.

For applications using the OpenAI service, follow the
[Agents API quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart).