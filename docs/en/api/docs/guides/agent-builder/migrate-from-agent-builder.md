# Migrate from Agent Builder

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use this guide to export an existing Agent Builder workflow as Agents SDK code.
You can use the export to recreate the workflow as a ChatGPT Workspace Agent or
continue with the Agents SDK in your application.

This process does not convert your workflow graph or guarantee that every
behavior transfers unchanged.

## Choose a migration path

- **Agents SDK**: Best for building agents through code.
- **ChatGPT Workspace Agents**: Best for building agents through natural
  language and sharing them with teams.

## Before you migrate

You need access to the workflow in
[Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder).

## Export your workflow

1. Open your workflow in Agent Builder.
1. Select **Code** in the top navigation.
1. Select **Agents SDK** in the code dialog.
1. Select **TypeScript** or **Python**, then copy the complete export.

![Agent Builder Code dialog with Agents SDK selected](https://developers.openai.com/images/platform/guides/agent-builder/agents-sdk-export.png)

## Option 1: Continue with the Agents SDK

Use this option when you want to run the exported workflow in an application
you build and deploy.

Copy the TypeScript or Python export into your application, install and
configure the matching Agents SDK, and test the workflow in your runtime. For
guidance on configuring and running the export, see the
[Agents SDK overview](https://developers.openai.com/api/docs/guides/agents) and
[quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart).
Validate your application's configuration and behavior before deploying it.

## Option 2: Create a workspace agent from the export

To use this option, you need a ChatGPT Business, Enterprise, or Edu workspace
with access to [workspace agents](https://chatgpt.com/agents) and permission to
create agents.

In ChatGPT, [create a workspace agent](https://chatgpt.com/agents/studio/new).
Paste your exported code into the chat with this prompt:

```text
Please help me convert this workflow into an agent:

<paste your exported code here>
```

Review any behavior that the builder identifies as requiring changes before you
continue.

## Review and test the agent

Some workflow behavior may need manual recreation. Review control flow,
triggers, tools, and permissions as you test the migrated agent.

Before creating the agent:

1. Review the generated instructions and configured capabilities.
1. Configure any required apps, tools, skills, authentication, and connection
   permissions.
1. Select **Preview** and test representative inputs from the original
   workflow.
1. Compare the previewed behavior with the original workflow's expected
   behavior.
1. Select **Create** only after you have validated the migrated agent.

Follow the same safety practices you used for your workflow, especially when
the agent can access private data or take actions through connected tools.

## Limitations

- Workflows with strong determinism at their core may not migrate faithfully to
  a workspace agent.
- Connected apps, authentication, publishing, and permission configuration
  require separate review in ChatGPT.
- An Agents SDK implementation requires you to validate your application's
  runtime configuration, tools, authentication, permissions, and deployment.

## Related resources

- [Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder)
- [Safety in building agents](https://developers.openai.com/api/docs/guides/agent-builder-safety)
- [Agents SDK overview](https://developers.openai.com/api/docs/guides/agents)
- [Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [Build workspace agents in ChatGPT for repeatable work](https://developers.openai.com/cookbook/articles/chatgpt-agents-sales-meeting-prep)