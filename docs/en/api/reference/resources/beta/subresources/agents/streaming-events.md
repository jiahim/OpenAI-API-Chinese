# Agents streaming events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

<a id="agent.session.environment.ready"></a>

## agent.session.environment.ready

Emitted when a hosted session environment is ready to connect.

### Schema

Schema name: `SessionEventAgentSessionEnvironmentReady`

- `environment: AgentSessionEnvironmentState`

  The current environment state.

  - `id: string`

    The public ID of the environment.

  - `error: object { code, message, type }  or null`

    An error reported while preparing a session environment.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `type: string`

      The error type.

  - `status: "pending" or "ready" or "connected" or 2 more`

    The environment's connection status.

    - `"pending"`

      The environment is being prepared.

    - `"ready"`

      The environment is ready to connect.

    - `"connected"`

      The environment is connected.

    - `"disconnected"`

      The environment is disconnected.

    - `"failed"`

      The environment failed to connect.

  - `type: string`

    The environment type.

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.environment.ready"`

  The type of the object. Always `agent.session.environment.ready`.

  - `"agent.session.environment.ready"`

### Example

```json
{
  "type": "agent.session.environment.ready",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "environment": {
    "id": "id",
    "type": "type",
    "status": "pending",
    "error": {
      "type": "type",
      "code": "code",
      "message": "message"
    }
  }
}
```

<a id="agent.output.command_execution_output.delta"></a>

## agent.output.command_execution_output.delta

Emitted when command execution produces an output delta.

### Schema

Schema name: `SessionEventAgentOutputCommandExecutionOutputDelta`

- `delta: string`

  The output text that was appended.

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the command execution item.

- `output_index: number`

  The index of the item in the turn output.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.output.command_execution_output.delta"`

  The type of the object. Always `agent.output.command_execution_output.delta`.

  - `"agent.output.command_execution_output.delta"`

### Example

```json
{
  "type": "agent.output.command_execution_output.delta",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "delta": "delta"
}
```

<a id="agent.session.created"></a>

## agent.session.created

Emitted when a session is created.

### Schema

Schema name: `SessionEventAgentSessionCreated`

- `event_id: string`

  The unique ID of the event.

- `session: AgentSession`

  The session that was created.

  - `id: string`

    The ID of the session.

  - `agent: object { id, instructions, model, 6 more }`

    The agent running in the session.

    - `id: string`

      The ID of the agent.

    - `instructions: string or null`

      Custom instructions appended to the agent's default base instructions.

    - `model: string`

      The model used by the agent.

    - `multi_agent: MultiAgentConfig`

      Configuration for creating and coordinating subagents.

      - `enabled: boolean`

        Whether subagent tools are enabled. Defaults to false.

      - `max_concurrent_subagents: number or null`

        Maximum number of subagents that may run concurrently, or null when disabled. Defaults to 6 when enabled.

    - `name: string or null`

      The reusable agent's name when the session was created, or null if no name was saved. Later changes to the agent's name do not affect this value.

    - `reasoning: AgentReasoning`

      The agent's reasoning configuration.

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        The amount of reasoning effort used by an agent.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        The reasoning summary format requested from an agent.

        - `"concise"`

          Returns a concise reasoning summary when supported.

        - `"detailed"`

          Returns a detailed reasoning summary when supported.

        - `"auto"`

          Automatically selects the most detailed summary supported by the model.

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      The effective service-tier policy for model requests. Defaults to `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      Configuration for text generated by the agent.

      - `format: TextFormat`

        The effective output format. Defaults to ordinary text.

        - `Text object { type }`

          Generates ordinary text without a structured-output constraint.

          - `type: "text"`

            The type of the object. Always `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          Constrains generated text to a JSON Schema.

          - `schema: map[unknown]`

            The JSON Schema that generated text must match.

          - `type: "json_schema"`

            The type of the object. Always `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        The amount of text produced by the agent. Defaults to `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      Tools available to the agent.

      - `Function object { defer_loading, description, name, 2 more }`

        A function defined by the application.

        - `defer_loading: boolean`

          Whether the function is deferred and discovered through tool search.

        - `description: string`

          A description of what the function does.

        - `name: string`

          The name of the function.

        - `parameters: map[unknown]`

          A JSON Schema object describing the function's arguments.

        - `type: "function"`

          The type of the object. Always `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        Enables calling tools from model-generated code.

        - `enabled: boolean`

          Whether tools can be called from model-generated code.

        - `type: "programmatic_tool_calling"`

          The type of the object. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        Tools provided by a remote MCP server.

        - `allowed_tools: array of string or null`

          The MCP tools the agent may call.

        - `connection_origin: "service" or "environment"`

          Where outbound MCP HTTP connections originate.

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          The attached vault credential selected for this MCP server, if any. Optional when exactly one attached credential matches the server URL.

        - `request_metadata: map[unknown]`

          Metadata included with requests to this MCP server.

        - `required: boolean`

          Whether this MCP server must initialize before the first turn.

        - `server_label: string`

          A label used to identify the MCP server in tool calls.

        - `transport: McpTransport`

          The transport used to connect to the MCP server.

          - `HTTP object { server_url, type }`

            Connects to an MCP server over HTTP.

            - `server_url: string`

              The URL of the MCP server.

            - `type: "http"`

              The type of the object. Always `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            Starts an MCP server as a local process.

            - `args: array of string`

              Arguments passed to the MCP server command.

            - `command: string`

              The command used to start the MCP server.

            - `cwd: string`

              The working directory used to start the MCP server.

            - `env_vars: array of string`

              Environment variable names inherited from the execution environment.

            - `type: "stdio"`

              The type of the object. Always `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          The type of the object. Always `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        Web search.

        - `allowed_domains: array of string or null`

          Allowed search domains, or `null` when the search is unrestricted.

        - `context_size: "low" or "medium" or "high"`

          The amount of search context made available to the model. Defaults to `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          Approximate user location used to localize web search results.

          - `city: string or null`

            The city name.

          - `country: string or null`

            The two-letter ISO country code, such as `US`.

          - `region: string or null`

            The region or state name.

          - `timezone: string or null`

            The IANA timezone, such as `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          The source used for web search results.

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          The type of the object. Always `web_search`.

          - `"web_search"`

  - `created_at: number`

    The Unix timestamp, in seconds, when the session was created.

  - `environment: Environment`

    The execution environment for the session.

    - `None object { type }`

      The session talks to CCA without selecting or provisioning an execution environment.

      - `type: "none"`

        The type of the object. Always `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      An environment hosted by OpenAI.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `files: array of HostedEnvironmentFile`

        Files available in the environment, excluding their contents.

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          A file copied from the OpenAI Files API.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `file_id: string`

            The ID of the uploaded file.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "file_id"`

            The type of the object. Always `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          A file supplied inline when the session was created.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        The effective network access policy for the environment.

        - `access: "enabled" or "disabled" or "restricted"`

          The environment's network access mode.

          - `"enabled"`

            Allows unrestricted network access.

          - `"disabled"`

            Disables network access.

          - `"restricted"`

            Allows access only to configured domains.

        - `allowed_domains: array of string`

          Domains the environment may access when network access is restricted.

      - `packages: object { npm, python, system }`

        Packages installed in the environment.

        - `npm: array of string`

          npm packages installed globally in the environment.

        - `python: array of string`

          Python packages installed in the environment.

        - `system: array of string`

          System packages installed in the environment.

      - `plugins: array of HostedPlugin`

        Plugins installed in the environment, excluding their archive contents.

        - `description: string`

          The installed plugin description.

        - `name: string`

          The installed plugin name.

        - `type: "inline"`

          The type of the object. Always `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        Skills installed in the environment, excluding their archive contents.

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          A skill installed from the Skills API.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `skill_id: string`

            The referenced skill ID.

          - `type: "skill_reference"`

            The type of the object. Always `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            The concrete skill version installed for this session.

        - `Inline object { description, name, type }`

          A skill installed from an inline ZIP archive.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        The type of the object. Always `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      An environment hosted by the application.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `remote_url: string`

        Pass this URL unchanged to `codex exec-server --remote` when connecting this environment.

      - `type: "self_hosted"`

        The type of the object. Always `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        The absolute project directory inside the environment. Defaults to `/workspace`.

  - `error: string or null`

    The error that caused the session to fail, if any.

  - `last_active_at: number`

    The Unix timestamp, in seconds, when the session was last active.

  - `metadata: map[string]`

    Custom string key-value pairs attached to the session.

  - `object: "agent.session"`

    The object type. Always `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    Actions that must be completed before the session can continue.

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      Run a function tool and submit its result.

      - `arguments: unknown`

        The arguments supplied by the model.

      - `call_id: string`

        The ID to include when submitting the function result.

      - `name: string`

        The function name.

      - `turn_id: string`

        The ID of the turn that requested the function call.

      - `type: "function_call"`

        The type of the object. Always `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      Reconnect a session environment.

      - `environment_id: string`

        The ID of the environment to reconnect.

      - `type: "environment_connection"`

        The type of the object. Always `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    The current status of the session.

    - `"idle"`

      The session has no turn in progress and is ready for input. A hosted environment may still be provisioning.

    - `"in_progress"`

      The session is processing a turn.

    - `"requires_action"`

      The session is waiting for one or more required actions.

    - `"failed"`

      The session failed.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

  - `vault_ids: array of string`

    The IDs of vaults made available to the session.

- `type: "agent.session.created"`

  The type of the object. Always `agent.session.created`.

  - `"agent.session.created"`

### Example

```json
{
  "type": "agent.session.created",
  "event_id": "event_id",
  "session": {
    "metadata": {
      "foo": "string"
    },
    "id": "id",
    "object": "agent.session",
    "created_at": 0,
    "last_active_at": 0,
    "status": "idle",
    "required_actions": [
      {
        "type": "function_call",
        "turn_id": "turn_id",
        "call_id": "call_id",
        "name": "name",
        "arguments": {}
      }
    ],
    "error": "error",
    "agent": {
      "id": "id",
      "name": "name",
      "model": "model",
      "reasoning": {
        "effort": "none",
        "summary": "concise"
      },
      "text": {
        "format": {
          "type": "text"
        },
        "verbosity": "low"
      },
      "service_tier": "auto",
      "instructions": "instructions",
      "tools": [
        {
          "type": "function",
          "name": "name",
          "description": "description",
          "parameters": {
            "foo": "bar"
          },
          "defer_loading": true
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 1
      }
    },
    "environment": {
      "type": "none"
    },
    "vault_ids": [
      "string"
    ],
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.turn.created"></a>

## agent.session.turn.created

Emitted when a turn is created.

### Schema

Schema name: `SessionEventAgentSessionTurnCreated`

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn: Turn`

  The turn at the time it was created.

  - `id: string`

    The ID of the turn.

  - `agent_id: string`

    The ID of the agent that ran the turn.

  - `completed_at: number or null`

    The Unix timestamp, in seconds, when the turn reached a terminal state.

  - `created_at: number`

    The Unix timestamp, in seconds, used to order the turn by creation time. Subagent turns use their start time, falling back to completion time or the subagent opening time when the preceding timestamps are unavailable.

  - `error: SessionTurnError or null`

    A customer-safe error describing why a session request failed.

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      A stable, machine-readable failure category.

      - `"context_length_exceeded"`

        The request exceeds the model's context window.

      - `"session_budget_exceeded"`

        The session has reached its usage budget.

      - `"usage_limit_exceeded"`

        The organization has reached a usage, plan, or billing limit.

      - `"credit_balance_exhausted"`

        The organization has no API credits remaining.

      - `"rate_limit_exceeded"`

        The request exceeds the available rate limit.

      - `"server_overloaded"`

        The model service is temporarily overloaded.

      - `"cyber_policy"`

        The request was rejected by a safety policy.

      - `"connection_failed"`

        The request could not connect to the model service.

      - `"server_error"`

        The model service encountered an unexpected error.

      - `"authentication_error"`

        The API credentials are invalid or lack the required access.

      - `"invalid_request"`

        The request contains invalid input or configuration.

      - `"resource_not_found"`

        The requested model or resource is unavailable.

      - `"sandbox_error"`

        The request could not complete in its execution environment.

      - `"executor_version_incompatible"`

        The executor must be upgraded before it can run this turn.

      - `"active_turn_not_steerable"`

        The session cannot accept additional input while a request is running.

      - `"request_timeout"`

        The request timed out before the model service responded.

      - `"internal_error"`

        An unexpected internal error prevented the session request from completing.

    - `message: string`

      A customer-safe explanation of the failure.

  - `object: "agent.session.turn"`

    The object type. Always `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    The ID of the session that owns the turn.

  - `started_at: number or null`

    The Unix timestamp, in seconds, when the turn started.

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    The current status of the turn.

    - `"queued"`

      The turn is waiting to start.

    - `"in_progress"`

      The turn is in progress.

    - `"waiting"`

      The turn is waiting for external input.

    - `"completed"`

      The turn completed successfully.

    - `"failed"`

      The turn failed.

    - `"cancelled"`

      The turn was cancelled.

  - `subagent_id: string or null`

    The ID of the subagent that ran the turn, if applicable.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

- `turn_id: string`

  The ID of the turn associated with the event.

- `type: "agent.session.turn.created"`

  The type of the object. Always `agent.session.turn.created`.

  - `"agent.session.turn.created"`

### Example

```json
{
  "type": "agent.session.turn.created",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "turn": {
    "id": "id",
    "object": "agent.session.turn",
    "session_id": "session_id",
    "agent_id": "agent_id",
    "subagent_id": "subagent_id",
    "status": "queued",
    "created_at": 0,
    "started_at": 0,
    "completed_at": 0,
    "error": {
      "code": "context_length_exceeded",
      "message": "message"
    },
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.turn.in_progress"></a>

## agent.session.turn.in_progress

Emitted when a turn starts running.

### Schema

Schema name: `SessionEventAgentSessionTurnInProgress`

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn: Turn`

  The turn at the time it started running.

  - `id: string`

    The ID of the turn.

  - `agent_id: string`

    The ID of the agent that ran the turn.

  - `completed_at: number or null`

    The Unix timestamp, in seconds, when the turn reached a terminal state.

  - `created_at: number`

    The Unix timestamp, in seconds, used to order the turn by creation time. Subagent turns use their start time, falling back to completion time or the subagent opening time when the preceding timestamps are unavailable.

  - `error: SessionTurnError or null`

    A customer-safe error describing why a session request failed.

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      A stable, machine-readable failure category.

      - `"context_length_exceeded"`

        The request exceeds the model's context window.

      - `"session_budget_exceeded"`

        The session has reached its usage budget.

      - `"usage_limit_exceeded"`

        The organization has reached a usage, plan, or billing limit.

      - `"credit_balance_exhausted"`

        The organization has no API credits remaining.

      - `"rate_limit_exceeded"`

        The request exceeds the available rate limit.

      - `"server_overloaded"`

        The model service is temporarily overloaded.

      - `"cyber_policy"`

        The request was rejected by a safety policy.

      - `"connection_failed"`

        The request could not connect to the model service.

      - `"server_error"`

        The model service encountered an unexpected error.

      - `"authentication_error"`

        The API credentials are invalid or lack the required access.

      - `"invalid_request"`

        The request contains invalid input or configuration.

      - `"resource_not_found"`

        The requested model or resource is unavailable.

      - `"sandbox_error"`

        The request could not complete in its execution environment.

      - `"executor_version_incompatible"`

        The executor must be upgraded before it can run this turn.

      - `"active_turn_not_steerable"`

        The session cannot accept additional input while a request is running.

      - `"request_timeout"`

        The request timed out before the model service responded.

      - `"internal_error"`

        An unexpected internal error prevented the session request from completing.

    - `message: string`

      A customer-safe explanation of the failure.

  - `object: "agent.session.turn"`

    The object type. Always `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    The ID of the session that owns the turn.

  - `started_at: number or null`

    The Unix timestamp, in seconds, when the turn started.

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    The current status of the turn.

    - `"queued"`

      The turn is waiting to start.

    - `"in_progress"`

      The turn is in progress.

    - `"waiting"`

      The turn is waiting for external input.

    - `"completed"`

      The turn completed successfully.

    - `"failed"`

      The turn failed.

    - `"cancelled"`

      The turn was cancelled.

  - `subagent_id: string or null`

    The ID of the subagent that ran the turn, if applicable.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

- `turn_id: string`

  The ID of the turn associated with the event.

- `type: "agent.session.turn.in_progress"`

  The type of the object. Always `agent.session.turn.in_progress`.

  - `"agent.session.turn.in_progress"`

### Example

```json
{
  "type": "agent.session.turn.in_progress",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "turn": {
    "id": "id",
    "object": "agent.session.turn",
    "session_id": "session_id",
    "agent_id": "agent_id",
    "subagent_id": "subagent_id",
    "status": "queued",
    "created_at": 0,
    "started_at": 0,
    "completed_at": 0,
    "error": {
      "code": "context_length_exceeded",
      "message": "message"
    },
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.turn.completed"></a>

## agent.session.turn.completed

Emitted when a turn completes.

### Schema

Schema name: `SessionEventAgentSessionTurnCompleted`

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn: Turn`

  The completed turn.

  - `id: string`

    The ID of the turn.

  - `agent_id: string`

    The ID of the agent that ran the turn.

  - `completed_at: number or null`

    The Unix timestamp, in seconds, when the turn reached a terminal state.

  - `created_at: number`

    The Unix timestamp, in seconds, used to order the turn by creation time. Subagent turns use their start time, falling back to completion time or the subagent opening time when the preceding timestamps are unavailable.

  - `error: SessionTurnError or null`

    A customer-safe error describing why a session request failed.

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      A stable, machine-readable failure category.

      - `"context_length_exceeded"`

        The request exceeds the model's context window.

      - `"session_budget_exceeded"`

        The session has reached its usage budget.

      - `"usage_limit_exceeded"`

        The organization has reached a usage, plan, or billing limit.

      - `"credit_balance_exhausted"`

        The organization has no API credits remaining.

      - `"rate_limit_exceeded"`

        The request exceeds the available rate limit.

      - `"server_overloaded"`

        The model service is temporarily overloaded.

      - `"cyber_policy"`

        The request was rejected by a safety policy.

      - `"connection_failed"`

        The request could not connect to the model service.

      - `"server_error"`

        The model service encountered an unexpected error.

      - `"authentication_error"`

        The API credentials are invalid or lack the required access.

      - `"invalid_request"`

        The request contains invalid input or configuration.

      - `"resource_not_found"`

        The requested model or resource is unavailable.

      - `"sandbox_error"`

        The request could not complete in its execution environment.

      - `"executor_version_incompatible"`

        The executor must be upgraded before it can run this turn.

      - `"active_turn_not_steerable"`

        The session cannot accept additional input while a request is running.

      - `"request_timeout"`

        The request timed out before the model service responded.

      - `"internal_error"`

        An unexpected internal error prevented the session request from completing.

    - `message: string`

      A customer-safe explanation of the failure.

  - `object: "agent.session.turn"`

    The object type. Always `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    The ID of the session that owns the turn.

  - `started_at: number or null`

    The Unix timestamp, in seconds, when the turn started.

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    The current status of the turn.

    - `"queued"`

      The turn is waiting to start.

    - `"in_progress"`

      The turn is in progress.

    - `"waiting"`

      The turn is waiting for external input.

    - `"completed"`

      The turn completed successfully.

    - `"failed"`

      The turn failed.

    - `"cancelled"`

      The turn was cancelled.

  - `subagent_id: string or null`

    The ID of the subagent that ran the turn, if applicable.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

- `turn_id: string`

  The ID of the turn associated with the event.

- `type: "agent.session.turn.completed"`

  The type of the object. Always `agent.session.turn.completed`.

  - `"agent.session.turn.completed"`

- `usage: TokenUsage or null`

  Recorded token usage for a session or turn. Usage is best effort and may change.

### Example

```json
{
  "type": "agent.session.turn.completed",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "turn": {
    "id": "id",
    "object": "agent.session.turn",
    "session_id": "session_id",
    "agent_id": "agent_id",
    "subagent_id": "subagent_id",
    "status": "queued",
    "created_at": 0,
    "started_at": 0,
    "completed_at": 0,
    "error": {
      "code": "context_length_exceeded",
      "message": "message"
    },
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  },
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 0,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 0
  }
}
```

<a id="agent.session.turn.failed"></a>

## agent.session.turn.failed

Emitted when a turn fails.

### Schema

Schema name: `SessionEventAgentSessionTurnFailed`

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn: Turn`

  The failed turn.

  - `id: string`

    The ID of the turn.

  - `agent_id: string`

    The ID of the agent that ran the turn.

  - `completed_at: number or null`

    The Unix timestamp, in seconds, when the turn reached a terminal state.

  - `created_at: number`

    The Unix timestamp, in seconds, used to order the turn by creation time. Subagent turns use their start time, falling back to completion time or the subagent opening time when the preceding timestamps are unavailable.

  - `error: SessionTurnError or null`

    A customer-safe error describing why a session request failed.

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      A stable, machine-readable failure category.

      - `"context_length_exceeded"`

        The request exceeds the model's context window.

      - `"session_budget_exceeded"`

        The session has reached its usage budget.

      - `"usage_limit_exceeded"`

        The organization has reached a usage, plan, or billing limit.

      - `"credit_balance_exhausted"`

        The organization has no API credits remaining.

      - `"rate_limit_exceeded"`

        The request exceeds the available rate limit.

      - `"server_overloaded"`

        The model service is temporarily overloaded.

      - `"cyber_policy"`

        The request was rejected by a safety policy.

      - `"connection_failed"`

        The request could not connect to the model service.

      - `"server_error"`

        The model service encountered an unexpected error.

      - `"authentication_error"`

        The API credentials are invalid or lack the required access.

      - `"invalid_request"`

        The request contains invalid input or configuration.

      - `"resource_not_found"`

        The requested model or resource is unavailable.

      - `"sandbox_error"`

        The request could not complete in its execution environment.

      - `"executor_version_incompatible"`

        The executor must be upgraded before it can run this turn.

      - `"active_turn_not_steerable"`

        The session cannot accept additional input while a request is running.

      - `"request_timeout"`

        The request timed out before the model service responded.

      - `"internal_error"`

        An unexpected internal error prevented the session request from completing.

    - `message: string`

      A customer-safe explanation of the failure.

  - `object: "agent.session.turn"`

    The object type. Always `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    The ID of the session that owns the turn.

  - `started_at: number or null`

    The Unix timestamp, in seconds, when the turn started.

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    The current status of the turn.

    - `"queued"`

      The turn is waiting to start.

    - `"in_progress"`

      The turn is in progress.

    - `"waiting"`

      The turn is waiting for external input.

    - `"completed"`

      The turn completed successfully.

    - `"failed"`

      The turn failed.

    - `"cancelled"`

      The turn was cancelled.

  - `subagent_id: string or null`

    The ID of the subagent that ran the turn, if applicable.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

- `turn_id: string`

  The ID of the turn associated with the event.

- `type: "agent.session.turn.failed"`

  The type of the object. Always `agent.session.turn.failed`.

  - `"agent.session.turn.failed"`

- `usage: TokenUsage or null`

  Recorded token usage for a session or turn. Usage is best effort and may change.

### Example

```json
{
  "type": "agent.session.turn.failed",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "turn": {
    "id": "id",
    "object": "agent.session.turn",
    "session_id": "session_id",
    "agent_id": "agent_id",
    "subagent_id": "subagent_id",
    "status": "queued",
    "created_at": 0,
    "started_at": 0,
    "completed_at": 0,
    "error": {
      "code": "context_length_exceeded",
      "message": "message"
    },
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  },
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 0,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 0
  }
}
```

<a id="agent.session.turn.cancelled"></a>

## agent.session.turn.cancelled

Emitted when a turn is cancelled.

### Schema

Schema name: `SessionEventAgentSessionTurnCancelled`

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn: Turn`

  The cancelled turn.

  - `id: string`

    The ID of the turn.

  - `agent_id: string`

    The ID of the agent that ran the turn.

  - `completed_at: number or null`

    The Unix timestamp, in seconds, when the turn reached a terminal state.

  - `created_at: number`

    The Unix timestamp, in seconds, used to order the turn by creation time. Subagent turns use their start time, falling back to completion time or the subagent opening time when the preceding timestamps are unavailable.

  - `error: SessionTurnError or null`

    A customer-safe error describing why a session request failed.

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      A stable, machine-readable failure category.

      - `"context_length_exceeded"`

        The request exceeds the model's context window.

      - `"session_budget_exceeded"`

        The session has reached its usage budget.

      - `"usage_limit_exceeded"`

        The organization has reached a usage, plan, or billing limit.

      - `"credit_balance_exhausted"`

        The organization has no API credits remaining.

      - `"rate_limit_exceeded"`

        The request exceeds the available rate limit.

      - `"server_overloaded"`

        The model service is temporarily overloaded.

      - `"cyber_policy"`

        The request was rejected by a safety policy.

      - `"connection_failed"`

        The request could not connect to the model service.

      - `"server_error"`

        The model service encountered an unexpected error.

      - `"authentication_error"`

        The API credentials are invalid or lack the required access.

      - `"invalid_request"`

        The request contains invalid input or configuration.

      - `"resource_not_found"`

        The requested model or resource is unavailable.

      - `"sandbox_error"`

        The request could not complete in its execution environment.

      - `"executor_version_incompatible"`

        The executor must be upgraded before it can run this turn.

      - `"active_turn_not_steerable"`

        The session cannot accept additional input while a request is running.

      - `"request_timeout"`

        The request timed out before the model service responded.

      - `"internal_error"`

        An unexpected internal error prevented the session request from completing.

    - `message: string`

      A customer-safe explanation of the failure.

  - `object: "agent.session.turn"`

    The object type. Always `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    The ID of the session that owns the turn.

  - `started_at: number or null`

    The Unix timestamp, in seconds, when the turn started.

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    The current status of the turn.

    - `"queued"`

      The turn is waiting to start.

    - `"in_progress"`

      The turn is in progress.

    - `"waiting"`

      The turn is waiting for external input.

    - `"completed"`

      The turn completed successfully.

    - `"failed"`

      The turn failed.

    - `"cancelled"`

      The turn was cancelled.

  - `subagent_id: string or null`

    The ID of the subagent that ran the turn, if applicable.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

- `turn_id: string`

  The ID of the turn associated with the event.

- `type: "agent.session.turn.cancelled"`

  The type of the object. Always `agent.session.turn.cancelled`.

  - `"agent.session.turn.cancelled"`

- `usage: TokenUsage or null`

  Recorded token usage for a session or turn. Usage is best effort and may change.

### Example

```json
{
  "type": "agent.session.turn.cancelled",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "turn": {
    "id": "id",
    "object": "agent.session.turn",
    "session_id": "session_id",
    "agent_id": "agent_id",
    "subagent_id": "subagent_id",
    "status": "queued",
    "created_at": 0,
    "started_at": 0,
    "completed_at": 0,
    "error": {
      "code": "context_length_exceeded",
      "message": "message"
    },
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  },
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 0,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 0
  }
}
```

<a id="agent.session.turn.item.added"></a>

## agent.session.turn.item.added

Emitted when an item is added to a turn.

### Schema

Schema name: `SessionEventAgentSessionTurnItemAdded`

- `event_id: string`

  The unique ID of the event.

- `item: AgentSessionItem`

  The item that was added.

  - `AgentSessionMessage object { id, content, phase, 4 more }`

    A user or assistant message recorded in a session.

    - `id: string or null`

      The ID of this item, or null for legacy user messages whose ID was not recorded.

    - `content: array of AgentSessionMessageContent`

      The content of the message. User messages contain input text or images; assistant messages contain output text.

      - `InputText object { text, type }`

        Text supplied by the user.

        - `text: string`

          The text supplied by the user.

        - `type: "input_text"`

          The type of the object. Always `input_text`.

          - `"input_text"`

      - `InputImage object { image_url, type }`

        An image supplied by the user.

        - `image_url: string`

          The URL of the image supplied by the user, which may be a base64-encoded data URL.

        - `type: "input_image"`

          The type of the object. Always `input_image`.

          - `"input_image"`

      - `OutputText object { text, type }`

        Text produced by the assistant.

        - `text: string`

          The text produced by the assistant.

        - `type: "output_text"`

          The type of the object. Always `output_text`.

          - `"output_text"`

    - `phase: "commentary" or "final_answer" or null`

      The phase of an assistant message.

      - `"commentary"`

        Commentary produced while the agent works.

      - `"final_answer"`

        The agent's final answer.

    - `role: "user" or "assistant"`

      The role of the message author.

      - `"user"`

      - `"assistant"`

    - `status: AgentOutputItemStatus`

      The status of the message. User messages are always `completed`.

      - `"in_progress"`

        The item is in progress.

      - `"completed"`

        The item is complete.

      - `"incomplete"`

        The item stopped before completing.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "message"`

      The item type. Always `message`.

      - `"message"`

  - `AgentReasoningItem object { id, status, summary, 2 more }`

    A reasoning item produced by the agent.

    - `id: string`

      The ID of the reasoning item.

    - `status: AgentOutputItemStatus or null`

      The status of an agent output item.

    - `summary: array of SummaryText`

      The reasoning summaries produced by the agent.

      - `text: string`

        The reasoning summary text.

      - `type: "summary_text"`

        The content type. Always `summary_text`.

        - `"summary_text"`

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "reasoning"`

      The item type. Always `reasoning`.

      - `"reasoning"`

  - `AgentFunctionCallItem object { id, arguments, call_id, 4 more }`

    A function call produced by the agent.

    - `id: string`

      The ID of the function call item.

    - `arguments: unknown`

      The arguments to pass to the function.

    - `call_id: string`

      The ID used to submit the function result.

    - `name: string`

      The name of the function to call.

    - `status: AgentFunctionCallStatus`

      The status of the function call.

      - `"in_progress"`

        The call is in progress.

      - `"completed"`

        The call completed successfully.

      - `"failed"`

        The call failed.

      - `"incomplete"`

        The call stopped before completing.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "function_call"`

      The item type. Always `function_call`.

      - `"function_call"`

  - `FunctionCallOutput object { id, call_id, error, 4 more }`

    The result supplied for a function call.

    - `id: string`

      The ID of the function call output item.

    - `call_id: string`

      The ID of the function call that produced this output.

    - `error: string or null`

      The error message, if the call failed.

    - `output: AgentFunctionCallOutput or null`

      The text or model-input content supplied as a function result.

      - `string`

      - `array of InputContent`

        - `InputText object { text, type }`

          Text input recorded in a session item.

          - `text: string`

            The text supplied to the agent.

          - `type: "input_text"`

            The type of the object. Always `input_text`.

            - `"input_text"`

        - `InputImage object { image_url, type }`

          Image input recorded in a session item.

          - `image_url: string`

            The URL of the image supplied to the agent, which may be a base64-encoded data URL.

          - `type: "input_image"`

            The type of the object. Always `input_image`.

            - `"input_image"`

    - `status: AgentFunctionCallStatus`

      The status of the function call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "function_call_output"`

      The item type. Always `function_call_output`.

      - `"function_call_output"`

  - `AgentMessage object { id, content, recipient_agent_id, 3 more }`

    A message exchanged between agent threads.

    - `id: string`

      The ID of the message.

    - `content: array of AgentContent`

      The content exchanged between the agents.

      - `OutputText object { text, type }`

        A text content part produced by the agent.

        - `text: string`

          The text produced by the agent.

        - `type: "output_text"`

          The content type. Always `output_text`.

          - `"output_text"`

      - `EncryptedContent object { encrypted_content, type }`

        Encrypted content exchanged between agents.

        - `encrypted_content: string`

          The encrypted content payload.

        - `type: "encrypted_content"`

          The content type. Always `encrypted_content`.

          - `"encrypted_content"`

    - `recipient_agent_id: string`

      The ID or name of the receiving agent.

    - `sender_agent_id: string`

      The ID or name of the sending agent.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "agent_message"`

      The item type. Always `agent_message`.

      - `"agent_message"`

  - `AgentMcpCallItem object { id, arguments, error, 6 more }`

    A call to a tool on an MCP server.

    - `id: string`

      The ID of the MCP call item.

    - `arguments: unknown`

      The arguments passed to the MCP tool.

    - `error: unknown`

      The error returned by the MCP tool, if any.

    - `name: string`

      The name of the MCP tool.

    - `output: unknown`

      The output returned by the MCP tool, if any.

    - `server_label: string`

      The label of the MCP server.

    - `status: AgentFunctionCallStatus`

      The status of the MCP tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "mcp_call"`

      The item type. Always `mcp_call`.

      - `"mcp_call"`

  - `AgentWebSearchCallItem object { id, action, status, 2 more }`

    A web search call produced by the agent.

    - `id: string`

      The ID of the web search call.

    - `action: WebSearchAction or null`

      An action performed by the web search tool.

      - `Search object { queries, query, type }`

        A search query or group of search queries.

        - `queries: array of string or null`

          The search queries, when multiple queries were used.

        - `query: string or null`

          The search query, when a single query was used.

        - `type: "search"`

          The type of the object. Always `search`.

          - `"search"`

      - `OpenPage object { type, url }`

        Opens a web page.

        - `type: "open_page"`

          The type of the object. Always `open_page`.

          - `"open_page"`

        - `url: string or null`

          The URL of the page that was opened.

      - `FindInPage object { pattern, type, url }`

        Finds text within a web page.

        - `pattern: string or null`

          The text pattern that was searched for.

        - `type: "find_in_page"`

          The type of the object. Always `find_in_page`.

          - `"find_in_page"`

        - `url: string or null`

          The URL of the page that was searched.

      - `Other object { type }`

        Another web search action.

        - `type: "other"`

          The type of the object. Always `other`.

          - `"other"`

    - `status: AgentOutputItemStatus`

      The status of the web search call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "web_search_call"`

      The item type. Always `web_search_call`.

      - `"web_search_call"`

  - `AgentCommandExecutionItem object { id, command, cwd, 6 more }`

    A command execution produced by the agent.

    - `id: string`

      The ID of the command execution item.

    - `command: string`

      The command that was executed.

    - `cwd: string or null`

      The working directory used to execute the command.

    - `duration_ms: number or null`

      The command duration in milliseconds.

    - `exit_code: number or null`

      The process exit code, if the command completed.

    - `output: string or null`

      The command output, if available.

    - `status: AgentFunctionCallStatus`

      The status of the command execution.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "command_execution"`

      The item type. Always `command_execution`.

      - `"command_execution"`

  - `AgentCreateSubagentCallItem object { id, agent_id, content, 5 more }`

    A request to spawn a subagent.

    - `id: string`

      The ID of the tool call item.

    - `agent_id: string`

      The ID of the agent that requested the subagent.

    - `content: array of AgentContent`

      The task given to the spawned agent.

      - `OutputText object { text, type }`

        A text content part produced by the agent.

      - `EncryptedContent object { encrypted_content, type }`

        Encrypted content exchanged between agents.

    - `model: string or null`

      The model requested for the spawned agent.

    - `reasoning_effort: string or null`

      The reasoning effort requested for the spawned agent.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "create_subagent_call"`

      The item type. Always `create_subagent_call`.

      - `"create_subagent_call"`

        The current public item type.

  - `AgentSendSubagentInputCallItem object { id, content, recipient_agent_id, 4 more }`

    A request to send input to another agent.

    - `id: string`

      The ID of the tool call item.

    - `content: array of AgentContent`

      The input sent to the receiving agent.

      - `OutputText object { text, type }`

        A text content part produced by the agent.

      - `EncryptedContent object { encrypted_content, type }`

        Encrypted content exchanged between agents.

    - `recipient_agent_id: string`

      The ID of the agent receiving the input.

    - `sender_agent_id: string`

      The ID of the agent sending the input.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "send_subagent_input_call"`

      The item type. Always `send_subagent_input_call`.

      - `"send_subagent_input_call"`

        The current public item type.

  - `AgentResumeSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    A request to resume a subagent.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_id: string`

      The ID of the agent to resume.

    - `sender_agent_id: string`

      The ID of the agent requesting the resume.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "resume_subagent_call"`

      The item type. Always `resume_subagent_call`.

      - `"resume_subagent_call"`

        The current public item type.

  - `AgentWaitForSubagentsCallItem object { id, recipient_agent_ids, sender_agent_id, 3 more }`

    A request to wait for one or more subagents.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_ids: array of string`

      The IDs of the agents to wait for.

    - `sender_agent_id: string`

      The ID of the agent waiting for results.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "wait_for_subagents_call"`

      The item type. Always `wait_for_subagents_call`.

      - `"wait_for_subagents_call"`

        The current public item type.

  - `AgentInterruptSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    A request to interrupt a subagent's current turn. The subagent remains available.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_id: string`

      The ID of the agent to interrupt.

    - `sender_agent_id: string`

      The ID of the agent requesting the interrupt.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "interrupt_subagent_call"`

      The item type. Always `interrupt_subagent_call`.

      - `"interrupt_subagent_call"`

        The current public item type.

  - `AgentCloseSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    A request to close a subagent.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_id: string`

      The ID of the agent to close.

    - `sender_agent_id: string`

      The ID of the agent requesting the close.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "close_subagent_call"`

      The item type. Always `close_subagent_call`.

      - `"close_subagent_call"`

        The current public item type.

- `output_index: number or null`

  The index of the item in the turn output, when the item is agent output.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.item.added"`

  The type of the object. Always `agent.session.turn.item.added`.

  - `"agent.session.turn.item.added"`

### Example

```json
{
  "type": "agent.session.turn.item.added",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "output_index": 0,
  "item": {
    "type": "message",
    "id": "id",
    "turn_id": "turn_id",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "text"
      }
    ],
    "status": "in_progress",
    "phase": "commentary"
  }
}
```

<a id="agent.session.idle"></a>

## agent.session.idle

Emitted when a session becomes idle.

### Schema

Schema name: `SessionEventAgentSessionIdle`

- `event_id: string`

  The unique ID of the event.

- `session: AgentSession`

  The session that became idle.

  - `id: string`

    The ID of the session.

  - `agent: object { id, instructions, model, 6 more }`

    The agent running in the session.

    - `id: string`

      The ID of the agent.

    - `instructions: string or null`

      Custom instructions appended to the agent's default base instructions.

    - `model: string`

      The model used by the agent.

    - `multi_agent: MultiAgentConfig`

      Configuration for creating and coordinating subagents.

      - `enabled: boolean`

        Whether subagent tools are enabled. Defaults to false.

      - `max_concurrent_subagents: number or null`

        Maximum number of subagents that may run concurrently, or null when disabled. Defaults to 6 when enabled.

    - `name: string or null`

      The reusable agent's name when the session was created, or null if no name was saved. Later changes to the agent's name do not affect this value.

    - `reasoning: AgentReasoning`

      The agent's reasoning configuration.

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        The amount of reasoning effort used by an agent.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        The reasoning summary format requested from an agent.

        - `"concise"`

          Returns a concise reasoning summary when supported.

        - `"detailed"`

          Returns a detailed reasoning summary when supported.

        - `"auto"`

          Automatically selects the most detailed summary supported by the model.

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      The effective service-tier policy for model requests. Defaults to `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      Configuration for text generated by the agent.

      - `format: TextFormat`

        The effective output format. Defaults to ordinary text.

        - `Text object { type }`

          Generates ordinary text without a structured-output constraint.

          - `type: "text"`

            The type of the object. Always `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          Constrains generated text to a JSON Schema.

          - `schema: map[unknown]`

            The JSON Schema that generated text must match.

          - `type: "json_schema"`

            The type of the object. Always `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        The amount of text produced by the agent. Defaults to `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      Tools available to the agent.

      - `Function object { defer_loading, description, name, 2 more }`

        A function defined by the application.

        - `defer_loading: boolean`

          Whether the function is deferred and discovered through tool search.

        - `description: string`

          A description of what the function does.

        - `name: string`

          The name of the function.

        - `parameters: map[unknown]`

          A JSON Schema object describing the function's arguments.

        - `type: "function"`

          The type of the object. Always `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        Enables calling tools from model-generated code.

        - `enabled: boolean`

          Whether tools can be called from model-generated code.

        - `type: "programmatic_tool_calling"`

          The type of the object. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        Tools provided by a remote MCP server.

        - `allowed_tools: array of string or null`

          The MCP tools the agent may call.

        - `connection_origin: "service" or "environment"`

          Where outbound MCP HTTP connections originate.

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          The attached vault credential selected for this MCP server, if any. Optional when exactly one attached credential matches the server URL.

        - `request_metadata: map[unknown]`

          Metadata included with requests to this MCP server.

        - `required: boolean`

          Whether this MCP server must initialize before the first turn.

        - `server_label: string`

          A label used to identify the MCP server in tool calls.

        - `transport: McpTransport`

          The transport used to connect to the MCP server.

          - `HTTP object { server_url, type }`

            Connects to an MCP server over HTTP.

            - `server_url: string`

              The URL of the MCP server.

            - `type: "http"`

              The type of the object. Always `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            Starts an MCP server as a local process.

            - `args: array of string`

              Arguments passed to the MCP server command.

            - `command: string`

              The command used to start the MCP server.

            - `cwd: string`

              The working directory used to start the MCP server.

            - `env_vars: array of string`

              Environment variable names inherited from the execution environment.

            - `type: "stdio"`

              The type of the object. Always `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          The type of the object. Always `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        Web search.

        - `allowed_domains: array of string or null`

          Allowed search domains, or `null` when the search is unrestricted.

        - `context_size: "low" or "medium" or "high"`

          The amount of search context made available to the model. Defaults to `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          Approximate user location used to localize web search results.

          - `city: string or null`

            The city name.

          - `country: string or null`

            The two-letter ISO country code, such as `US`.

          - `region: string or null`

            The region or state name.

          - `timezone: string or null`

            The IANA timezone, such as `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          The source used for web search results.

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          The type of the object. Always `web_search`.

          - `"web_search"`

  - `created_at: number`

    The Unix timestamp, in seconds, when the session was created.

  - `environment: Environment`

    The execution environment for the session.

    - `None object { type }`

      The session talks to CCA without selecting or provisioning an execution environment.

      - `type: "none"`

        The type of the object. Always `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      An environment hosted by OpenAI.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `files: array of HostedEnvironmentFile`

        Files available in the environment, excluding their contents.

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          A file copied from the OpenAI Files API.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `file_id: string`

            The ID of the uploaded file.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "file_id"`

            The type of the object. Always `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          A file supplied inline when the session was created.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        The effective network access policy for the environment.

        - `access: "enabled" or "disabled" or "restricted"`

          The environment's network access mode.

          - `"enabled"`

            Allows unrestricted network access.

          - `"disabled"`

            Disables network access.

          - `"restricted"`

            Allows access only to configured domains.

        - `allowed_domains: array of string`

          Domains the environment may access when network access is restricted.

      - `packages: object { npm, python, system }`

        Packages installed in the environment.

        - `npm: array of string`

          npm packages installed globally in the environment.

        - `python: array of string`

          Python packages installed in the environment.

        - `system: array of string`

          System packages installed in the environment.

      - `plugins: array of HostedPlugin`

        Plugins installed in the environment, excluding their archive contents.

        - `description: string`

          The installed plugin description.

        - `name: string`

          The installed plugin name.

        - `type: "inline"`

          The type of the object. Always `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        Skills installed in the environment, excluding their archive contents.

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          A skill installed from the Skills API.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `skill_id: string`

            The referenced skill ID.

          - `type: "skill_reference"`

            The type of the object. Always `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            The concrete skill version installed for this session.

        - `Inline object { description, name, type }`

          A skill installed from an inline ZIP archive.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        The type of the object. Always `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      An environment hosted by the application.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `remote_url: string`

        Pass this URL unchanged to `codex exec-server --remote` when connecting this environment.

      - `type: "self_hosted"`

        The type of the object. Always `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        The absolute project directory inside the environment. Defaults to `/workspace`.

  - `error: string or null`

    The error that caused the session to fail, if any.

  - `last_active_at: number`

    The Unix timestamp, in seconds, when the session was last active.

  - `metadata: map[string]`

    Custom string key-value pairs attached to the session.

  - `object: "agent.session"`

    The object type. Always `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    Actions that must be completed before the session can continue.

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      Run a function tool and submit its result.

      - `arguments: unknown`

        The arguments supplied by the model.

      - `call_id: string`

        The ID to include when submitting the function result.

      - `name: string`

        The function name.

      - `turn_id: string`

        The ID of the turn that requested the function call.

      - `type: "function_call"`

        The type of the object. Always `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      Reconnect a session environment.

      - `environment_id: string`

        The ID of the environment to reconnect.

      - `type: "environment_connection"`

        The type of the object. Always `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    The current status of the session.

    - `"idle"`

      The session has no turn in progress and is ready for input. A hosted environment may still be provisioning.

    - `"in_progress"`

      The session is processing a turn.

    - `"requires_action"`

      The session is waiting for one or more required actions.

    - `"failed"`

      The session failed.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

  - `vault_ids: array of string`

    The IDs of vaults made available to the session.

- `type: "agent.session.idle"`

  The type of the object. Always `agent.session.idle`.

  - `"agent.session.idle"`

### Example

```json
{
  "type": "agent.session.idle",
  "event_id": "event_id",
  "session": {
    "metadata": {
      "foo": "string"
    },
    "id": "id",
    "object": "agent.session",
    "created_at": 0,
    "last_active_at": 0,
    "status": "idle",
    "required_actions": [
      {
        "type": "function_call",
        "turn_id": "turn_id",
        "call_id": "call_id",
        "name": "name",
        "arguments": {}
      }
    ],
    "error": "error",
    "agent": {
      "id": "id",
      "name": "name",
      "model": "model",
      "reasoning": {
        "effort": "none",
        "summary": "concise"
      },
      "text": {
        "format": {
          "type": "text"
        },
        "verbosity": "low"
      },
      "service_tier": "auto",
      "instructions": "instructions",
      "tools": [
        {
          "type": "function",
          "name": "name",
          "description": "description",
          "parameters": {
            "foo": "bar"
          },
          "defer_loading": true
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 1
      }
    },
    "environment": {
      "type": "none"
    },
    "vault_ids": [
      "string"
    ],
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.in_progress"></a>

## agent.session.in_progress

Emitted when a session starts processing a turn.

### Schema

Schema name: `SessionEventAgentSessionInProgress`

- `event_id: string`

  The unique ID of the event.

- `session: AgentSession`

  The session that started processing.

  - `id: string`

    The ID of the session.

  - `agent: object { id, instructions, model, 6 more }`

    The agent running in the session.

    - `id: string`

      The ID of the agent.

    - `instructions: string or null`

      Custom instructions appended to the agent's default base instructions.

    - `model: string`

      The model used by the agent.

    - `multi_agent: MultiAgentConfig`

      Configuration for creating and coordinating subagents.

      - `enabled: boolean`

        Whether subagent tools are enabled. Defaults to false.

      - `max_concurrent_subagents: number or null`

        Maximum number of subagents that may run concurrently, or null when disabled. Defaults to 6 when enabled.

    - `name: string or null`

      The reusable agent's name when the session was created, or null if no name was saved. Later changes to the agent's name do not affect this value.

    - `reasoning: AgentReasoning`

      The agent's reasoning configuration.

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        The amount of reasoning effort used by an agent.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        The reasoning summary format requested from an agent.

        - `"concise"`

          Returns a concise reasoning summary when supported.

        - `"detailed"`

          Returns a detailed reasoning summary when supported.

        - `"auto"`

          Automatically selects the most detailed summary supported by the model.

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      The effective service-tier policy for model requests. Defaults to `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      Configuration for text generated by the agent.

      - `format: TextFormat`

        The effective output format. Defaults to ordinary text.

        - `Text object { type }`

          Generates ordinary text without a structured-output constraint.

          - `type: "text"`

            The type of the object. Always `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          Constrains generated text to a JSON Schema.

          - `schema: map[unknown]`

            The JSON Schema that generated text must match.

          - `type: "json_schema"`

            The type of the object. Always `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        The amount of text produced by the agent. Defaults to `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      Tools available to the agent.

      - `Function object { defer_loading, description, name, 2 more }`

        A function defined by the application.

        - `defer_loading: boolean`

          Whether the function is deferred and discovered through tool search.

        - `description: string`

          A description of what the function does.

        - `name: string`

          The name of the function.

        - `parameters: map[unknown]`

          A JSON Schema object describing the function's arguments.

        - `type: "function"`

          The type of the object. Always `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        Enables calling tools from model-generated code.

        - `enabled: boolean`

          Whether tools can be called from model-generated code.

        - `type: "programmatic_tool_calling"`

          The type of the object. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        Tools provided by a remote MCP server.

        - `allowed_tools: array of string or null`

          The MCP tools the agent may call.

        - `connection_origin: "service" or "environment"`

          Where outbound MCP HTTP connections originate.

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          The attached vault credential selected for this MCP server, if any. Optional when exactly one attached credential matches the server URL.

        - `request_metadata: map[unknown]`

          Metadata included with requests to this MCP server.

        - `required: boolean`

          Whether this MCP server must initialize before the first turn.

        - `server_label: string`

          A label used to identify the MCP server in tool calls.

        - `transport: McpTransport`

          The transport used to connect to the MCP server.

          - `HTTP object { server_url, type }`

            Connects to an MCP server over HTTP.

            - `server_url: string`

              The URL of the MCP server.

            - `type: "http"`

              The type of the object. Always `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            Starts an MCP server as a local process.

            - `args: array of string`

              Arguments passed to the MCP server command.

            - `command: string`

              The command used to start the MCP server.

            - `cwd: string`

              The working directory used to start the MCP server.

            - `env_vars: array of string`

              Environment variable names inherited from the execution environment.

            - `type: "stdio"`

              The type of the object. Always `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          The type of the object. Always `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        Web search.

        - `allowed_domains: array of string or null`

          Allowed search domains, or `null` when the search is unrestricted.

        - `context_size: "low" or "medium" or "high"`

          The amount of search context made available to the model. Defaults to `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          Approximate user location used to localize web search results.

          - `city: string or null`

            The city name.

          - `country: string or null`

            The two-letter ISO country code, such as `US`.

          - `region: string or null`

            The region or state name.

          - `timezone: string or null`

            The IANA timezone, such as `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          The source used for web search results.

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          The type of the object. Always `web_search`.

          - `"web_search"`

  - `created_at: number`

    The Unix timestamp, in seconds, when the session was created.

  - `environment: Environment`

    The execution environment for the session.

    - `None object { type }`

      The session talks to CCA without selecting or provisioning an execution environment.

      - `type: "none"`

        The type of the object. Always `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      An environment hosted by OpenAI.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `files: array of HostedEnvironmentFile`

        Files available in the environment, excluding their contents.

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          A file copied from the OpenAI Files API.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `file_id: string`

            The ID of the uploaded file.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "file_id"`

            The type of the object. Always `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          A file supplied inline when the session was created.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        The effective network access policy for the environment.

        - `access: "enabled" or "disabled" or "restricted"`

          The environment's network access mode.

          - `"enabled"`

            Allows unrestricted network access.

          - `"disabled"`

            Disables network access.

          - `"restricted"`

            Allows access only to configured domains.

        - `allowed_domains: array of string`

          Domains the environment may access when network access is restricted.

      - `packages: object { npm, python, system }`

        Packages installed in the environment.

        - `npm: array of string`

          npm packages installed globally in the environment.

        - `python: array of string`

          Python packages installed in the environment.

        - `system: array of string`

          System packages installed in the environment.

      - `plugins: array of HostedPlugin`

        Plugins installed in the environment, excluding their archive contents.

        - `description: string`

          The installed plugin description.

        - `name: string`

          The installed plugin name.

        - `type: "inline"`

          The type of the object. Always `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        Skills installed in the environment, excluding their archive contents.

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          A skill installed from the Skills API.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `skill_id: string`

            The referenced skill ID.

          - `type: "skill_reference"`

            The type of the object. Always `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            The concrete skill version installed for this session.

        - `Inline object { description, name, type }`

          A skill installed from an inline ZIP archive.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        The type of the object. Always `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      An environment hosted by the application.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `remote_url: string`

        Pass this URL unchanged to `codex exec-server --remote` when connecting this environment.

      - `type: "self_hosted"`

        The type of the object. Always `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        The absolute project directory inside the environment. Defaults to `/workspace`.

  - `error: string or null`

    The error that caused the session to fail, if any.

  - `last_active_at: number`

    The Unix timestamp, in seconds, when the session was last active.

  - `metadata: map[string]`

    Custom string key-value pairs attached to the session.

  - `object: "agent.session"`

    The object type. Always `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    Actions that must be completed before the session can continue.

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      Run a function tool and submit its result.

      - `arguments: unknown`

        The arguments supplied by the model.

      - `call_id: string`

        The ID to include when submitting the function result.

      - `name: string`

        The function name.

      - `turn_id: string`

        The ID of the turn that requested the function call.

      - `type: "function_call"`

        The type of the object. Always `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      Reconnect a session environment.

      - `environment_id: string`

        The ID of the environment to reconnect.

      - `type: "environment_connection"`

        The type of the object. Always `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    The current status of the session.

    - `"idle"`

      The session has no turn in progress and is ready for input. A hosted environment may still be provisioning.

    - `"in_progress"`

      The session is processing a turn.

    - `"requires_action"`

      The session is waiting for one or more required actions.

    - `"failed"`

      The session failed.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

  - `vault_ids: array of string`

    The IDs of vaults made available to the session.

- `type: "agent.session.in_progress"`

  The type of the object. Always `agent.session.in_progress`.

  - `"agent.session.in_progress"`

### Example

```json
{
  "type": "agent.session.in_progress",
  "event_id": "event_id",
  "session": {
    "metadata": {
      "foo": "string"
    },
    "id": "id",
    "object": "agent.session",
    "created_at": 0,
    "last_active_at": 0,
    "status": "idle",
    "required_actions": [
      {
        "type": "function_call",
        "turn_id": "turn_id",
        "call_id": "call_id",
        "name": "name",
        "arguments": {}
      }
    ],
    "error": "error",
    "agent": {
      "id": "id",
      "name": "name",
      "model": "model",
      "reasoning": {
        "effort": "none",
        "summary": "concise"
      },
      "text": {
        "format": {
          "type": "text"
        },
        "verbosity": "low"
      },
      "service_tier": "auto",
      "instructions": "instructions",
      "tools": [
        {
          "type": "function",
          "name": "name",
          "description": "description",
          "parameters": {
            "foo": "bar"
          },
          "defer_loading": true
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 1
      }
    },
    "environment": {
      "type": "none"
    },
    "vault_ids": [
      "string"
    ],
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.requires_action"></a>

## agent.session.requires_action

Emitted when a session is waiting for one or more required actions.

### Schema

Schema name: `SessionEventAgentSessionRequiresAction`

- `event_id: string`

  The unique ID of the event.

- `session: AgentSession`

  The session and its current required actions.

  - `id: string`

    The ID of the session.

  - `agent: object { id, instructions, model, 6 more }`

    The agent running in the session.

    - `id: string`

      The ID of the agent.

    - `instructions: string or null`

      Custom instructions appended to the agent's default base instructions.

    - `model: string`

      The model used by the agent.

    - `multi_agent: MultiAgentConfig`

      Configuration for creating and coordinating subagents.

      - `enabled: boolean`

        Whether subagent tools are enabled. Defaults to false.

      - `max_concurrent_subagents: number or null`

        Maximum number of subagents that may run concurrently, or null when disabled. Defaults to 6 when enabled.

    - `name: string or null`

      The reusable agent's name when the session was created, or null if no name was saved. Later changes to the agent's name do not affect this value.

    - `reasoning: AgentReasoning`

      The agent's reasoning configuration.

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        The amount of reasoning effort used by an agent.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        The reasoning summary format requested from an agent.

        - `"concise"`

          Returns a concise reasoning summary when supported.

        - `"detailed"`

          Returns a detailed reasoning summary when supported.

        - `"auto"`

          Automatically selects the most detailed summary supported by the model.

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      The effective service-tier policy for model requests. Defaults to `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      Configuration for text generated by the agent.

      - `format: TextFormat`

        The effective output format. Defaults to ordinary text.

        - `Text object { type }`

          Generates ordinary text without a structured-output constraint.

          - `type: "text"`

            The type of the object. Always `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          Constrains generated text to a JSON Schema.

          - `schema: map[unknown]`

            The JSON Schema that generated text must match.

          - `type: "json_schema"`

            The type of the object. Always `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        The amount of text produced by the agent. Defaults to `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      Tools available to the agent.

      - `Function object { defer_loading, description, name, 2 more }`

        A function defined by the application.

        - `defer_loading: boolean`

          Whether the function is deferred and discovered through tool search.

        - `description: string`

          A description of what the function does.

        - `name: string`

          The name of the function.

        - `parameters: map[unknown]`

          A JSON Schema object describing the function's arguments.

        - `type: "function"`

          The type of the object. Always `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        Enables calling tools from model-generated code.

        - `enabled: boolean`

          Whether tools can be called from model-generated code.

        - `type: "programmatic_tool_calling"`

          The type of the object. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        Tools provided by a remote MCP server.

        - `allowed_tools: array of string or null`

          The MCP tools the agent may call.

        - `connection_origin: "service" or "environment"`

          Where outbound MCP HTTP connections originate.

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          The attached vault credential selected for this MCP server, if any. Optional when exactly one attached credential matches the server URL.

        - `request_metadata: map[unknown]`

          Metadata included with requests to this MCP server.

        - `required: boolean`

          Whether this MCP server must initialize before the first turn.

        - `server_label: string`

          A label used to identify the MCP server in tool calls.

        - `transport: McpTransport`

          The transport used to connect to the MCP server.

          - `HTTP object { server_url, type }`

            Connects to an MCP server over HTTP.

            - `server_url: string`

              The URL of the MCP server.

            - `type: "http"`

              The type of the object. Always `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            Starts an MCP server as a local process.

            - `args: array of string`

              Arguments passed to the MCP server command.

            - `command: string`

              The command used to start the MCP server.

            - `cwd: string`

              The working directory used to start the MCP server.

            - `env_vars: array of string`

              Environment variable names inherited from the execution environment.

            - `type: "stdio"`

              The type of the object. Always `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          The type of the object. Always `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        Web search.

        - `allowed_domains: array of string or null`

          Allowed search domains, or `null` when the search is unrestricted.

        - `context_size: "low" or "medium" or "high"`

          The amount of search context made available to the model. Defaults to `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          Approximate user location used to localize web search results.

          - `city: string or null`

            The city name.

          - `country: string or null`

            The two-letter ISO country code, such as `US`.

          - `region: string or null`

            The region or state name.

          - `timezone: string or null`

            The IANA timezone, such as `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          The source used for web search results.

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          The type of the object. Always `web_search`.

          - `"web_search"`

  - `created_at: number`

    The Unix timestamp, in seconds, when the session was created.

  - `environment: Environment`

    The execution environment for the session.

    - `None object { type }`

      The session talks to CCA without selecting or provisioning an execution environment.

      - `type: "none"`

        The type of the object. Always `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      An environment hosted by OpenAI.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `files: array of HostedEnvironmentFile`

        Files available in the environment, excluding their contents.

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          A file copied from the OpenAI Files API.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `file_id: string`

            The ID of the uploaded file.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "file_id"`

            The type of the object. Always `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          A file supplied inline when the session was created.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        The effective network access policy for the environment.

        - `access: "enabled" or "disabled" or "restricted"`

          The environment's network access mode.

          - `"enabled"`

            Allows unrestricted network access.

          - `"disabled"`

            Disables network access.

          - `"restricted"`

            Allows access only to configured domains.

        - `allowed_domains: array of string`

          Domains the environment may access when network access is restricted.

      - `packages: object { npm, python, system }`

        Packages installed in the environment.

        - `npm: array of string`

          npm packages installed globally in the environment.

        - `python: array of string`

          Python packages installed in the environment.

        - `system: array of string`

          System packages installed in the environment.

      - `plugins: array of HostedPlugin`

        Plugins installed in the environment, excluding their archive contents.

        - `description: string`

          The installed plugin description.

        - `name: string`

          The installed plugin name.

        - `type: "inline"`

          The type of the object. Always `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        Skills installed in the environment, excluding their archive contents.

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          A skill installed from the Skills API.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `skill_id: string`

            The referenced skill ID.

          - `type: "skill_reference"`

            The type of the object. Always `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            The concrete skill version installed for this session.

        - `Inline object { description, name, type }`

          A skill installed from an inline ZIP archive.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        The type of the object. Always `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      An environment hosted by the application.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `remote_url: string`

        Pass this URL unchanged to `codex exec-server --remote` when connecting this environment.

      - `type: "self_hosted"`

        The type of the object. Always `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        The absolute project directory inside the environment. Defaults to `/workspace`.

  - `error: string or null`

    The error that caused the session to fail, if any.

  - `last_active_at: number`

    The Unix timestamp, in seconds, when the session was last active.

  - `metadata: map[string]`

    Custom string key-value pairs attached to the session.

  - `object: "agent.session"`

    The object type. Always `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    Actions that must be completed before the session can continue.

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      Run a function tool and submit its result.

      - `arguments: unknown`

        The arguments supplied by the model.

      - `call_id: string`

        The ID to include when submitting the function result.

      - `name: string`

        The function name.

      - `turn_id: string`

        The ID of the turn that requested the function call.

      - `type: "function_call"`

        The type of the object. Always `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      Reconnect a session environment.

      - `environment_id: string`

        The ID of the environment to reconnect.

      - `type: "environment_connection"`

        The type of the object. Always `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    The current status of the session.

    - `"idle"`

      The session has no turn in progress and is ready for input. A hosted environment may still be provisioning.

    - `"in_progress"`

      The session is processing a turn.

    - `"requires_action"`

      The session is waiting for one or more required actions.

    - `"failed"`

      The session failed.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

  - `vault_ids: array of string`

    The IDs of vaults made available to the session.

- `type: "agent.session.requires_action"`

  The type of the object. Always `agent.session.requires_action`.

  - `"agent.session.requires_action"`

### Example

```json
{
  "type": "agent.session.requires_action",
  "event_id": "event_id",
  "session": {
    "metadata": {
      "foo": "string"
    },
    "id": "id",
    "object": "agent.session",
    "created_at": 0,
    "last_active_at": 0,
    "status": "idle",
    "required_actions": [
      {
        "type": "function_call",
        "turn_id": "turn_id",
        "call_id": "call_id",
        "name": "name",
        "arguments": {}
      }
    ],
    "error": "error",
    "agent": {
      "id": "id",
      "name": "name",
      "model": "model",
      "reasoning": {
        "effort": "none",
        "summary": "concise"
      },
      "text": {
        "format": {
          "type": "text"
        },
        "verbosity": "low"
      },
      "service_tier": "auto",
      "instructions": "instructions",
      "tools": [
        {
          "type": "function",
          "name": "name",
          "description": "description",
          "parameters": {
            "foo": "bar"
          },
          "defer_loading": true
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 1
      }
    },
    "environment": {
      "type": "none"
    },
    "vault_ids": [
      "string"
    ],
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.failed"></a>

## agent.session.failed

Emitted when a session fails.

### Schema

Schema name: `SessionEventAgentSessionFailed`

- `event_id: string`

  The unique ID of the event.

- `session: AgentSession`

  The failed session.

  - `id: string`

    The ID of the session.

  - `agent: object { id, instructions, model, 6 more }`

    The agent running in the session.

    - `id: string`

      The ID of the agent.

    - `instructions: string or null`

      Custom instructions appended to the agent's default base instructions.

    - `model: string`

      The model used by the agent.

    - `multi_agent: MultiAgentConfig`

      Configuration for creating and coordinating subagents.

      - `enabled: boolean`

        Whether subagent tools are enabled. Defaults to false.

      - `max_concurrent_subagents: number or null`

        Maximum number of subagents that may run concurrently, or null when disabled. Defaults to 6 when enabled.

    - `name: string or null`

      The reusable agent's name when the session was created, or null if no name was saved. Later changes to the agent's name do not affect this value.

    - `reasoning: AgentReasoning`

      The agent's reasoning configuration.

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        The amount of reasoning effort used by an agent.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        The reasoning summary format requested from an agent.

        - `"concise"`

          Returns a concise reasoning summary when supported.

        - `"detailed"`

          Returns a detailed reasoning summary when supported.

        - `"auto"`

          Automatically selects the most detailed summary supported by the model.

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      The effective service-tier policy for model requests. Defaults to `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      Configuration for text generated by the agent.

      - `format: TextFormat`

        The effective output format. Defaults to ordinary text.

        - `Text object { type }`

          Generates ordinary text without a structured-output constraint.

          - `type: "text"`

            The type of the object. Always `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          Constrains generated text to a JSON Schema.

          - `schema: map[unknown]`

            The JSON Schema that generated text must match.

          - `type: "json_schema"`

            The type of the object. Always `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        The amount of text produced by the agent. Defaults to `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      Tools available to the agent.

      - `Function object { defer_loading, description, name, 2 more }`

        A function defined by the application.

        - `defer_loading: boolean`

          Whether the function is deferred and discovered through tool search.

        - `description: string`

          A description of what the function does.

        - `name: string`

          The name of the function.

        - `parameters: map[unknown]`

          A JSON Schema object describing the function's arguments.

        - `type: "function"`

          The type of the object. Always `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        Enables calling tools from model-generated code.

        - `enabled: boolean`

          Whether tools can be called from model-generated code.

        - `type: "programmatic_tool_calling"`

          The type of the object. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        Tools provided by a remote MCP server.

        - `allowed_tools: array of string or null`

          The MCP tools the agent may call.

        - `connection_origin: "service" or "environment"`

          Where outbound MCP HTTP connections originate.

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          The attached vault credential selected for this MCP server, if any. Optional when exactly one attached credential matches the server URL.

        - `request_metadata: map[unknown]`

          Metadata included with requests to this MCP server.

        - `required: boolean`

          Whether this MCP server must initialize before the first turn.

        - `server_label: string`

          A label used to identify the MCP server in tool calls.

        - `transport: McpTransport`

          The transport used to connect to the MCP server.

          - `HTTP object { server_url, type }`

            Connects to an MCP server over HTTP.

            - `server_url: string`

              The URL of the MCP server.

            - `type: "http"`

              The type of the object. Always `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            Starts an MCP server as a local process.

            - `args: array of string`

              Arguments passed to the MCP server command.

            - `command: string`

              The command used to start the MCP server.

            - `cwd: string`

              The working directory used to start the MCP server.

            - `env_vars: array of string`

              Environment variable names inherited from the execution environment.

            - `type: "stdio"`

              The type of the object. Always `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          The type of the object. Always `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        Web search.

        - `allowed_domains: array of string or null`

          Allowed search domains, or `null` when the search is unrestricted.

        - `context_size: "low" or "medium" or "high"`

          The amount of search context made available to the model. Defaults to `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          Approximate user location used to localize web search results.

          - `city: string or null`

            The city name.

          - `country: string or null`

            The two-letter ISO country code, such as `US`.

          - `region: string or null`

            The region or state name.

          - `timezone: string or null`

            The IANA timezone, such as `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          The source used for web search results.

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          The type of the object. Always `web_search`.

          - `"web_search"`

  - `created_at: number`

    The Unix timestamp, in seconds, when the session was created.

  - `environment: Environment`

    The execution environment for the session.

    - `None object { type }`

      The session talks to CCA without selecting or provisioning an execution environment.

      - `type: "none"`

        The type of the object. Always `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      An environment hosted by OpenAI.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `files: array of HostedEnvironmentFile`

        Files available in the environment, excluding their contents.

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          A file copied from the OpenAI Files API.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `file_id: string`

            The ID of the uploaded file.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "file_id"`

            The type of the object. Always `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          A file supplied inline when the session was created.

          - `id: string`

            The session-scoped ID of the file in the execution environment.

          - `path: string`

            The file's absolute path inside the environment.

          - `size_bytes: number`

            The decoded file size in bytes.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        The effective network access policy for the environment.

        - `access: "enabled" or "disabled" or "restricted"`

          The environment's network access mode.

          - `"enabled"`

            Allows unrestricted network access.

          - `"disabled"`

            Disables network access.

          - `"restricted"`

            Allows access only to configured domains.

        - `allowed_domains: array of string`

          Domains the environment may access when network access is restricted.

      - `packages: object { npm, python, system }`

        Packages installed in the environment.

        - `npm: array of string`

          npm packages installed globally in the environment.

        - `python: array of string`

          Python packages installed in the environment.

        - `system: array of string`

          System packages installed in the environment.

      - `plugins: array of HostedPlugin`

        Plugins installed in the environment, excluding their archive contents.

        - `description: string`

          The installed plugin description.

        - `name: string`

          The installed plugin name.

        - `type: "inline"`

          The type of the object. Always `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        Skills installed in the environment, excluding their archive contents.

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          A skill installed from the Skills API.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `skill_id: string`

            The referenced skill ID.

          - `type: "skill_reference"`

            The type of the object. Always `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            The concrete skill version installed for this session.

        - `Inline object { description, name, type }`

          A skill installed from an inline ZIP archive.

          - `description: string`

            The installed skill description.

          - `name: string`

            The installed skill name.

          - `type: "inline"`

            The type of the object. Always `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        The type of the object. Always `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      An environment hosted by the application.

      - `id: string`

        The public ID of the environment.

      - `capability_directories: array of string`

        Directories that contain capabilities exposed to the agent.

      - `remote_url: string`

        Pass this URL unchanged to `codex exec-server --remote` when connecting this environment.

      - `type: "self_hosted"`

        The type of the object. Always `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        The absolute project directory inside the environment. Defaults to `/workspace`.

  - `error: string or null`

    The error that caused the session to fail, if any.

  - `last_active_at: number`

    The Unix timestamp, in seconds, when the session was last active.

  - `metadata: map[string]`

    Custom string key-value pairs attached to the session.

  - `object: "agent.session"`

    The object type. Always `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    Actions that must be completed before the session can continue.

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      Run a function tool and submit its result.

      - `arguments: unknown`

        The arguments supplied by the model.

      - `call_id: string`

        The ID to include when submitting the function result.

      - `name: string`

        The function name.

      - `turn_id: string`

        The ID of the turn that requested the function call.

      - `type: "function_call"`

        The type of the object. Always `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      Reconnect a session environment.

      - `environment_id: string`

        The ID of the environment to reconnect.

      - `type: "environment_connection"`

        The type of the object. Always `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    The current status of the session.

    - `"idle"`

      The session has no turn in progress and is ready for input. A hosted environment may still be provisioning.

    - `"in_progress"`

      The session is processing a turn.

    - `"requires_action"`

      The session is waiting for one or more required actions.

    - `"failed"`

      The session failed.

  - `usage: TokenUsage or null`

    Recorded token usage for a session or turn. Usage is best effort and may change.

    - `input_tokens: number`

      The number of input tokens used by the agent.

    - `input_tokens_details: object { cached_tokens }`

      A breakdown of the agent's input token usage.

      - `cached_tokens: number`

        The number of input tokens retrieved from the prompt cache.

    - `output_tokens: number`

      The number of output tokens generated by the agent.

    - `output_tokens_details: object { reasoning_tokens }`

      A breakdown of the agent's output token usage.

      - `reasoning_tokens: number`

        The number of output tokens used for reasoning.

    - `total_tokens: number`

      The total number of input and output tokens used by the agent.

  - `vault_ids: array of string`

    The IDs of vaults made available to the session.

- `type: "agent.session.failed"`

  The type of the object. Always `agent.session.failed`.

  - `"agent.session.failed"`

### Example

```json
{
  "type": "agent.session.failed",
  "event_id": "event_id",
  "session": {
    "metadata": {
      "foo": "string"
    },
    "id": "id",
    "object": "agent.session",
    "created_at": 0,
    "last_active_at": 0,
    "status": "idle",
    "required_actions": [
      {
        "type": "function_call",
        "turn_id": "turn_id",
        "call_id": "call_id",
        "name": "name",
        "arguments": {}
      }
    ],
    "error": "error",
    "agent": {
      "id": "id",
      "name": "name",
      "model": "model",
      "reasoning": {
        "effort": "none",
        "summary": "concise"
      },
      "text": {
        "format": {
          "type": "text"
        },
        "verbosity": "low"
      },
      "service_tier": "auto",
      "instructions": "instructions",
      "tools": [
        {
          "type": "function",
          "name": "name",
          "description": "description",
          "parameters": {
            "foo": "bar"
          },
          "defer_loading": true
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 1
      }
    },
    "environment": {
      "type": "none"
    },
    "vault_ids": [
      "string"
    ],
    "usage": {
      "input_tokens": 0,
      "input_tokens_details": {
        "cached_tokens": 0
      },
      "output_tokens": 0,
      "output_tokens_details": {
        "reasoning_tokens": 0
      },
      "total_tokens": 0
    }
  }
}
```

<a id="agent.session.environment.pending"></a>

## agent.session.environment.pending

Emitted while a session environment is being prepared.

### Schema

Schema name: `SessionEventAgentSessionEnvironmentPending`

- `environment: AgentSessionEnvironmentState`

  The current environment state.

  - `id: string`

    The public ID of the environment.

  - `error: object { code, message, type }  or null`

    An error reported while preparing a session environment.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `type: string`

      The error type.

  - `status: "pending" or "ready" or "connected" or 2 more`

    The environment's connection status.

    - `"pending"`

      The environment is being prepared.

    - `"ready"`

      The environment is ready to connect.

    - `"connected"`

      The environment is connected.

    - `"disconnected"`

      The environment is disconnected.

    - `"failed"`

      The environment failed to connect.

  - `type: string`

    The environment type.

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.environment.pending"`

  The type of the object. Always `agent.session.environment.pending`.

  - `"agent.session.environment.pending"`

### Example

```json
{
  "type": "agent.session.environment.pending",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "environment": {
    "id": "id",
    "type": "type",
    "status": "pending",
    "error": {
      "type": "type",
      "code": "code",
      "message": "message"
    }
  }
}
```

<a id="agent.session.environment.connected"></a>

## agent.session.environment.connected

Emitted when a session environment connects.

### Schema

Schema name: `SessionEventAgentSessionEnvironmentConnected`

- `environment: AgentSessionEnvironmentState`

  The current environment state.

  - `id: string`

    The public ID of the environment.

  - `error: object { code, message, type }  or null`

    An error reported while preparing a session environment.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `type: string`

      The error type.

  - `status: "pending" or "ready" or "connected" or 2 more`

    The environment's connection status.

    - `"pending"`

      The environment is being prepared.

    - `"ready"`

      The environment is ready to connect.

    - `"connected"`

      The environment is connected.

    - `"disconnected"`

      The environment is disconnected.

    - `"failed"`

      The environment failed to connect.

  - `type: string`

    The environment type.

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.environment.connected"`

  The type of the object. Always `agent.session.environment.connected`.

  - `"agent.session.environment.connected"`

### Example

```json
{
  "type": "agent.session.environment.connected",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "environment": {
    "id": "id",
    "type": "type",
    "status": "pending",
    "error": {
      "type": "type",
      "code": "code",
      "message": "message"
    }
  }
}
```

<a id="agent.session.environment.disconnected"></a>

## agent.session.environment.disconnected

Emitted when a session environment disconnects.

### Schema

Schema name: `SessionEventAgentSessionEnvironmentDisconnected`

- `environment: AgentSessionEnvironmentState`

  The current environment state.

  - `id: string`

    The public ID of the environment.

  - `error: object { code, message, type }  or null`

    An error reported while preparing a session environment.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `type: string`

      The error type.

  - `status: "pending" or "ready" or "connected" or 2 more`

    The environment's connection status.

    - `"pending"`

      The environment is being prepared.

    - `"ready"`

      The environment is ready to connect.

    - `"connected"`

      The environment is connected.

    - `"disconnected"`

      The environment is disconnected.

    - `"failed"`

      The environment failed to connect.

  - `type: string`

    The environment type.

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.environment.disconnected"`

  The type of the object. Always `agent.session.environment.disconnected`.

  - `"agent.session.environment.disconnected"`

### Example

```json
{
  "type": "agent.session.environment.disconnected",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "environment": {
    "id": "id",
    "type": "type",
    "status": "pending",
    "error": {
      "type": "type",
      "code": "code",
      "message": "message"
    }
  }
}
```

<a id="agent.session.environment.failed"></a>

## agent.session.environment.failed

Emitted when a session environment fails.

### Schema

Schema name: `SessionEventAgentSessionEnvironmentFailed`

- `environment: AgentSessionEnvironmentState`

  The current environment state.

  - `id: string`

    The public ID of the environment.

  - `error: object { code, message, type }  or null`

    An error reported while preparing a session environment.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `type: string`

      The error type.

  - `status: "pending" or "ready" or "connected" or 2 more`

    The environment's connection status.

    - `"pending"`

      The environment is being prepared.

    - `"ready"`

      The environment is ready to connect.

    - `"connected"`

      The environment is connected.

    - `"disconnected"`

      The environment is disconnected.

    - `"failed"`

      The environment failed to connect.

  - `type: string`

    The environment type.

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.environment.failed"`

  The type of the object. Always `agent.session.environment.failed`.

  - `"agent.session.environment.failed"`

### Example

```json
{
  "type": "agent.session.environment.failed",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "environment": {
    "id": "id",
    "type": "type",
    "status": "pending",
    "error": {
      "type": "type",
      "code": "code",
      "message": "message"
    }
  }
}
```

<a id="agent.session.subagent.created"></a>

## agent.session.subagent.created

Emitted when a subagent is created.

### Schema

Schema name: `SessionEventAgentSessionSubagentCreated`

- `event_id: string`

  The unique ID of the event.

- `subagent: Subagent`

  The subagent that was created.

  - `id: string`

    The ID of the subagent.

  - `closed_at: number or null`

    The Unix timestamp, in seconds, when the subagent was closed. Null while active, including after resume.

  - `instructions: array of AgentContent or null`

    Initial task content, or null when unavailable. Text may contain placeholders for images or audio when only a preview is available.

    - `OutputText object { text, type }`

      A text content part produced by the agent.

      - `text: string`

        The text produced by the agent.

      - `type: "output_text"`

        The content type. Always `output_text`.

        - `"output_text"`

    - `EncryptedContent object { encrypted_content, type }`

      Encrypted content exchanged between agents.

      - `encrypted_content: string`

        The encrypted content payload.

      - `type: "encrypted_content"`

        The content type. Always `encrypted_content`.

        - `"encrypted_content"`

  - `name: string or null`

    The runner-assigned nickname, or null when unavailable.

  - `object: "agent.session.subagent"`

    The object type. Always `agent.session.subagent`.

    - `"agent.session.subagent"`

  - `opened_at: number`

    The Unix timestamp, in seconds, when the subagent was first opened. Resuming does not change it.

  - `parent_agent_id: string`

    The ID of the agent that created this subagent.

  - `session_id: string`

    The ID of the session that owns the subagent.

  - `status: "active" or "closed"`

    The current status of the subagent.

    - `"active"`

      The subagent remains available, including while idle between turns.

    - `"closed"`

      The subagent is closed.

- `type: "agent.session.subagent.created"`

  The type of the object. Always `agent.session.subagent.created`.

  - `"agent.session.subagent.created"`

### Example

```json
{
  "type": "agent.session.subagent.created",
  "event_id": "event_id",
  "subagent": {
    "id": "id",
    "object": "agent.session.subagent",
    "session_id": "session_id",
    "name": "name",
    "instructions": [
      {
        "type": "output_text",
        "text": "text"
      }
    ],
    "parent_agent_id": "parent_agent_id",
    "status": "active",
    "opened_at": 0,
    "closed_at": 0
  }
}
```

<a id="agent.session.subagent.active"></a>

## agent.session.subagent.active

Emitted when a closed subagent successfully resumes.

### Schema

Schema name: `SessionEventAgentSessionSubagentActive`

- `event_id: string`

  The unique ID of the event.

- `subagent: Subagent`

  The subagent that resumed.

  - `id: string`

    The ID of the subagent.

  - `closed_at: number or null`

    The Unix timestamp, in seconds, when the subagent was closed. Null while active, including after resume.

  - `instructions: array of AgentContent or null`

    Initial task content, or null when unavailable. Text may contain placeholders for images or audio when only a preview is available.

    - `OutputText object { text, type }`

      A text content part produced by the agent.

      - `text: string`

        The text produced by the agent.

      - `type: "output_text"`

        The content type. Always `output_text`.

        - `"output_text"`

    - `EncryptedContent object { encrypted_content, type }`

      Encrypted content exchanged between agents.

      - `encrypted_content: string`

        The encrypted content payload.

      - `type: "encrypted_content"`

        The content type. Always `encrypted_content`.

        - `"encrypted_content"`

  - `name: string or null`

    The runner-assigned nickname, or null when unavailable.

  - `object: "agent.session.subagent"`

    The object type. Always `agent.session.subagent`.

    - `"agent.session.subagent"`

  - `opened_at: number`

    The Unix timestamp, in seconds, when the subagent was first opened. Resuming does not change it.

  - `parent_agent_id: string`

    The ID of the agent that created this subagent.

  - `session_id: string`

    The ID of the session that owns the subagent.

  - `status: "active" or "closed"`

    The current status of the subagent.

    - `"active"`

      The subagent remains available, including while idle between turns.

    - `"closed"`

      The subagent is closed.

- `type: "agent.session.subagent.active"`

  The type of the object. Always `agent.session.subagent.active`.

  - `"agent.session.subagent.active"`

### Example

```json
{
  "type": "agent.session.subagent.active",
  "event_id": "event_id",
  "subagent": {
    "id": "id",
    "object": "agent.session.subagent",
    "session_id": "session_id",
    "name": "name",
    "instructions": [
      {
        "type": "output_text",
        "text": "text"
      }
    ],
    "parent_agent_id": "parent_agent_id",
    "status": "active",
    "opened_at": 0,
    "closed_at": 0
  }
}
```

<a id="agent.session.subagent.closed"></a>

## agent.session.subagent.closed

Emitted when a subagent is closed.

### Schema

Schema name: `SessionEventAgentSessionSubagentClosed`

- `event_id: string`

  The unique ID of the event.

- `subagent: Subagent`

  The subagent that was closed.

  - `id: string`

    The ID of the subagent.

  - `closed_at: number or null`

    The Unix timestamp, in seconds, when the subagent was closed. Null while active, including after resume.

  - `instructions: array of AgentContent or null`

    Initial task content, or null when unavailable. Text may contain placeholders for images or audio when only a preview is available.

    - `OutputText object { text, type }`

      A text content part produced by the agent.

      - `text: string`

        The text produced by the agent.

      - `type: "output_text"`

        The content type. Always `output_text`.

        - `"output_text"`

    - `EncryptedContent object { encrypted_content, type }`

      Encrypted content exchanged between agents.

      - `encrypted_content: string`

        The encrypted content payload.

      - `type: "encrypted_content"`

        The content type. Always `encrypted_content`.

        - `"encrypted_content"`

  - `name: string or null`

    The runner-assigned nickname, or null when unavailable.

  - `object: "agent.session.subagent"`

    The object type. Always `agent.session.subagent`.

    - `"agent.session.subagent"`

  - `opened_at: number`

    The Unix timestamp, in seconds, when the subagent was first opened. Resuming does not change it.

  - `parent_agent_id: string`

    The ID of the agent that created this subagent.

  - `session_id: string`

    The ID of the session that owns the subagent.

  - `status: "active" or "closed"`

    The current status of the subagent.

    - `"active"`

      The subagent remains available, including while idle between turns.

    - `"closed"`

      The subagent is closed.

- `type: "agent.session.subagent.closed"`

  The type of the object. Always `agent.session.subagent.closed`.

  - `"agent.session.subagent.closed"`

### Example

```json
{
  "type": "agent.session.subagent.closed",
  "event_id": "event_id",
  "subagent": {
    "id": "id",
    "object": "agent.session.subagent",
    "session_id": "session_id",
    "name": "name",
    "instructions": [
      {
        "type": "output_text",
        "text": "text"
      }
    ],
    "parent_agent_id": "parent_agent_id",
    "status": "active",
    "opened_at": 0,
    "closed_at": 0
  }
}
```

<a id="agent.session.turn.item.done"></a>

## agent.session.turn.item.done

Emitted when an output item is complete.

### Schema

Schema name: `SessionEventAgentSessionTurnItemDone`

- `event_id: string`

  The unique ID of the event.

- `item: AgentOutputItem`

  The completed output item.

  - `AgentSessionAssistantMessage object { id, content, phase, 4 more }`

    An assistant message produced by the agent.

    - `id: string`

      The ID of the message.

    - `content: array of OutputText`

      The content of the message.

      - `text: string`

        The text produced by the agent.

      - `type: "output_text"`

        The content type. Always `output_text`.

        - `"output_text"`

    - `phase: "commentary" or "final_answer" or null`

      The phase of an assistant message.

      - `"commentary"`

        Commentary produced while the agent works.

      - `"final_answer"`

        The agent's final answer.

    - `role: "assistant"`

      The role of the message author. Always `assistant`.

      - `"assistant"`

    - `status: AgentOutputItemStatus`

      The status of the message.

      - `"in_progress"`

        The item is in progress.

      - `"completed"`

        The item is complete.

      - `"incomplete"`

        The item stopped before completing.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "message"`

      The item type. Always `message`.

      - `"message"`

  - `AgentReasoningItem object { id, status, summary, 2 more }`

    A reasoning item produced by the agent.

    - `id: string`

      The ID of the reasoning item.

    - `status: AgentOutputItemStatus or null`

      The status of an agent output item.

    - `summary: array of SummaryText`

      The reasoning summaries produced by the agent.

      - `text: string`

        The reasoning summary text.

      - `type: "summary_text"`

        The content type. Always `summary_text`.

        - `"summary_text"`

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "reasoning"`

      The item type. Always `reasoning`.

      - `"reasoning"`

  - `AgentFunctionCallItem object { id, arguments, call_id, 4 more }`

    A function call produced by the agent.

    - `id: string`

      The ID of the function call item.

    - `arguments: unknown`

      The arguments to pass to the function.

    - `call_id: string`

      The ID used to submit the function result.

    - `name: string`

      The name of the function to call.

    - `status: AgentFunctionCallStatus`

      The status of the function call.

      - `"in_progress"`

        The call is in progress.

      - `"completed"`

        The call completed successfully.

      - `"failed"`

        The call failed.

      - `"incomplete"`

        The call stopped before completing.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "function_call"`

      The item type. Always `function_call`.

      - `"function_call"`

  - `AgentMcpCallItem object { id, arguments, error, 6 more }`

    A call to a tool on an MCP server.

    - `id: string`

      The ID of the MCP call item.

    - `arguments: unknown`

      The arguments passed to the MCP tool.

    - `error: unknown`

      The error returned by the MCP tool, if any.

    - `name: string`

      The name of the MCP tool.

    - `output: unknown`

      The output returned by the MCP tool, if any.

    - `server_label: string`

      The label of the MCP server.

    - `status: AgentFunctionCallStatus`

      The status of the MCP tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "mcp_call"`

      The item type. Always `mcp_call`.

      - `"mcp_call"`

  - `AgentWebSearchCallItem object { id, action, status, 2 more }`

    A web search call produced by the agent.

    - `id: string`

      The ID of the web search call.

    - `action: WebSearchAction or null`

      An action performed by the web search tool.

      - `Search object { queries, query, type }`

        A search query or group of search queries.

        - `queries: array of string or null`

          The search queries, when multiple queries were used.

        - `query: string or null`

          The search query, when a single query was used.

        - `type: "search"`

          The type of the object. Always `search`.

          - `"search"`

      - `OpenPage object { type, url }`

        Opens a web page.

        - `type: "open_page"`

          The type of the object. Always `open_page`.

          - `"open_page"`

        - `url: string or null`

          The URL of the page that was opened.

      - `FindInPage object { pattern, type, url }`

        Finds text within a web page.

        - `pattern: string or null`

          The text pattern that was searched for.

        - `type: "find_in_page"`

          The type of the object. Always `find_in_page`.

          - `"find_in_page"`

        - `url: string or null`

          The URL of the page that was searched.

      - `Other object { type }`

        Another web search action.

        - `type: "other"`

          The type of the object. Always `other`.

          - `"other"`

    - `status: AgentOutputItemStatus`

      The status of the web search call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "web_search_call"`

      The item type. Always `web_search_call`.

      - `"web_search_call"`

  - `AgentCommandExecutionItem object { id, command, cwd, 6 more }`

    A command execution produced by the agent.

    - `id: string`

      The ID of the command execution item.

    - `command: string`

      The command that was executed.

    - `cwd: string or null`

      The working directory used to execute the command.

    - `duration_ms: number or null`

      The command duration in milliseconds.

    - `exit_code: number or null`

      The process exit code, if the command completed.

    - `output: string or null`

      The command output, if available.

    - `status: AgentFunctionCallStatus`

      The status of the command execution.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "command_execution"`

      The item type. Always `command_execution`.

      - `"command_execution"`

  - `AgentCreateSubagentCallItem object { id, agent_id, content, 5 more }`

    A request to spawn a subagent.

    - `id: string`

      The ID of the tool call item.

    - `agent_id: string`

      The ID of the agent that requested the subagent.

    - `content: array of AgentContent`

      The task given to the spawned agent.

      - `OutputText object { text, type }`

        A text content part produced by the agent.

        - `text: string`

          The text produced by the agent.

        - `type: "output_text"`

          The content type. Always `output_text`.

      - `EncryptedContent object { encrypted_content, type }`

        Encrypted content exchanged between agents.

        - `encrypted_content: string`

          The encrypted content payload.

        - `type: "encrypted_content"`

          The content type. Always `encrypted_content`.

          - `"encrypted_content"`

    - `model: string or null`

      The model requested for the spawned agent.

    - `reasoning_effort: string or null`

      The reasoning effort requested for the spawned agent.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "create_subagent_call"`

      The item type. Always `create_subagent_call`.

      - `"create_subagent_call"`

        The current public item type.

  - `AgentSendSubagentInputCallItem object { id, content, recipient_agent_id, 4 more }`

    A request to send input to another agent.

    - `id: string`

      The ID of the tool call item.

    - `content: array of AgentContent`

      The input sent to the receiving agent.

      - `OutputText object { text, type }`

        A text content part produced by the agent.

      - `EncryptedContent object { encrypted_content, type }`

        Encrypted content exchanged between agents.

    - `recipient_agent_id: string`

      The ID of the agent receiving the input.

    - `sender_agent_id: string`

      The ID of the agent sending the input.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "send_subagent_input_call"`

      The item type. Always `send_subagent_input_call`.

      - `"send_subagent_input_call"`

        The current public item type.

  - `AgentResumeSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    A request to resume a subagent.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_id: string`

      The ID of the agent to resume.

    - `sender_agent_id: string`

      The ID of the agent requesting the resume.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "resume_subagent_call"`

      The item type. Always `resume_subagent_call`.

      - `"resume_subagent_call"`

        The current public item type.

  - `AgentWaitForSubagentsCallItem object { id, recipient_agent_ids, sender_agent_id, 3 more }`

    A request to wait for one or more subagents.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_ids: array of string`

      The IDs of the agents to wait for.

    - `sender_agent_id: string`

      The ID of the agent waiting for results.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "wait_for_subagents_call"`

      The item type. Always `wait_for_subagents_call`.

      - `"wait_for_subagents_call"`

        The current public item type.

  - `AgentInterruptSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    A request to interrupt a subagent's current turn. The subagent remains available.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_id: string`

      The ID of the agent to interrupt.

    - `sender_agent_id: string`

      The ID of the agent requesting the interrupt.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "interrupt_subagent_call"`

      The item type. Always `interrupt_subagent_call`.

      - `"interrupt_subagent_call"`

        The current public item type.

  - `AgentCloseSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    A request to close a subagent.

    - `id: string`

      The ID of the tool call item.

    - `recipient_agent_id: string`

      The ID of the agent to close.

    - `sender_agent_id: string`

      The ID of the agent requesting the close.

    - `status: AgentFunctionCallStatus`

      The status of the tool call.

    - `turn_id: string`

      The ID of the turn that contains this item.

    - `type: "close_subagent_call"`

      The item type. Always `close_subagent_call`.

      - `"close_subagent_call"`

        The current public item type.

- `output_index: number`

  The index of the output item in the turn output.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.item.done"`

  The type of the object. Always `agent.session.turn.item.done`.

  - `"agent.session.turn.item.done"`

### Example

```json
{
  "type": "agent.session.turn.item.done",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "output_index": 0,
  "item": {
    "type": "message",
    "id": "id",
    "turn_id": "turn_id",
    "role": "assistant",
    "status": "in_progress",
    "content": [
      {
        "type": "output_text",
        "text": "text"
      }
    ],
    "phase": "commentary"
  }
}
```

<a id="agent.session.turn.content_part.added"></a>

## agent.session.turn.content_part.added

Emitted when an output text content part is added.

### Schema

Schema name: `SessionEventAgentSessionTurnContentPartAdded`

- `content_index: number`

  The index of the content part in the message.

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the message item.

- `output_index: number`

  The index of the item in the turn output.

- `part: OutputText`

  The initial content part.

  - `text: string`

    The text produced by the agent.

  - `type: "output_text"`

    The content type. Always `output_text`.

    - `"output_text"`

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.content_part.added"`

  The type of the object. Always `agent.session.turn.content_part.added`.

  - `"agent.session.turn.content_part.added"`

### Example

```json
{
  "type": "agent.session.turn.content_part.added",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "output_text",
    "text": "text"
  }
}
```

<a id="agent.session.turn.content_part.done"></a>

## agent.session.turn.content_part.done

Emitted when an output content part is complete.

### Schema

Schema name: `SessionEventAgentSessionTurnContentPartDone`

- `content_index: number`

  The index of the content part in the message.

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the message item.

- `output_index: number`

  The index of the item in the turn output.

- `part: OutputText`

  The completed content part.

  - `text: string`

    The text produced by the agent.

  - `type: "output_text"`

    The content type. Always `output_text`.

    - `"output_text"`

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.content_part.done"`

  The type of the object. Always `agent.session.turn.content_part.done`.

  - `"agent.session.turn.content_part.done"`

### Example

```json
{
  "type": "agent.session.turn.content_part.done",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "output_text",
    "text": "text"
  }
}
```

<a id="agent.session.turn.output_text.delta"></a>

## agent.session.turn.output_text.delta

Emitted when text is appended to an output text content part.

### Schema

Schema name: `SessionEventAgentSessionTurnOutputTextDelta`

- `content_index: number`

  The index of the content part in the message.

- `delta: string`

  The text that was appended.

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the message item.

- `output_index: number`

  The index of the item in the turn output.

- `session_id: string`

  The ID of the session associated with the event.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.output_text.delta"`

  The type of the object. Always `agent.session.turn.output_text.delta`.

  - `"agent.session.turn.output_text.delta"`

### Example

```json
{
  "type": "agent.session.turn.output_text.delta",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "content_index": 0,
  "delta": "delta"
}
```

<a id="agent.session.turn.output_text.done"></a>

## agent.session.turn.output_text.done

Emitted when an output text content part is complete.

### Schema

Schema name: `SessionEventAgentSessionTurnOutputTextDone`

- `content_index: number`

  The index of the content part in the message.

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the message item.

- `output_index: number`

  The index of the item in the turn output.

- `session_id: string`

  The ID of the session associated with the event.

- `text: string`

  The complete output text.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.output_text.done"`

  The type of the object. Always `agent.session.turn.output_text.done`.

  - `"agent.session.turn.output_text.done"`

### Example

```json
{
  "type": "agent.session.turn.output_text.done",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "content_index": 0,
  "text": "text"
}
```

<a id="agent.session.turn.reasoning_summary_part.added"></a>

## agent.session.turn.reasoning_summary_part.added

Emitted when a reasoning summary content part is added.

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryPartAdded`

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the reasoning item.

- `output_index: number`

  The index of the item in the turn output.

- `part: SummaryText`

  The initial summary part.

  - `text: string`

    The reasoning summary text.

  - `type: "summary_text"`

    The content type. Always `summary_text`.

    - `"summary_text"`

- `session_id: string`

  The ID of the session associated with the event.

- `summary_index: number`

  The index of the summary content part.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.reasoning_summary_part.added"`

  The type of the object. Always `agent.session.turn.reasoning_summary_part.added`.

  - `"agent.session.turn.reasoning_summary_part.added"`

### Example

```json
{
  "type": "agent.session.turn.reasoning_summary_part.added",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "summary_index": 0,
  "part": {
    "type": "summary_text",
    "text": "text"
  }
}
```

<a id="agent.session.turn.reasoning_summary_part.done"></a>

## agent.session.turn.reasoning_summary_part.done

Emitted when a reasoning summary part is complete.

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryPartDone`

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the reasoning item.

- `output_index: number`

  The index of the item in the turn output.

- `part: SummaryText`

  The completed summary part.

  - `text: string`

    The reasoning summary text.

  - `type: "summary_text"`

    The content type. Always `summary_text`.

    - `"summary_text"`

- `session_id: string`

  The ID of the session associated with the event.

- `status: "incomplete" or null`

  Present as `incomplete` when summary generation was interrupted.

  - `"incomplete"`

- `summary_index: number`

  The index of the summary part.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.reasoning_summary_part.done"`

  The type of the object. Always `agent.session.turn.reasoning_summary_part.done`.

  - `"agent.session.turn.reasoning_summary_part.done"`

### Example

```json
{
  "type": "agent.session.turn.reasoning_summary_part.done",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "summary_index": 0,
  "part": {
    "type": "summary_text",
    "text": "text"
  },
  "status": "incomplete"
}
```

<a id="agent.session.turn.reasoning_summary_text.delta"></a>

## agent.session.turn.reasoning_summary_text.delta

Emitted when text is appended to a reasoning summary.

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryTextDelta`

- `delta: string`

  The summary text that was appended.

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the reasoning item.

- `output_index: number`

  The index of the item in the turn output.

- `session_id: string`

  The ID of the session associated with the event.

- `summary_index: number`

  The index of the summary content part.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.reasoning_summary_text.delta"`

  The type of the object. Always `agent.session.turn.reasoning_summary_text.delta`.

  - `"agent.session.turn.reasoning_summary_text.delta"`

### Example

```json
{
  "type": "agent.session.turn.reasoning_summary_text.delta",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "summary_index": 0,
  "delta": "delta"
}
```

<a id="agent.session.turn.reasoning_summary_text.done"></a>

## agent.session.turn.reasoning_summary_text.done

Emitted when a reasoning summary content part is complete.

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryTextDone`

- `event_id: string`

  The unique ID of the event.

- `item_id: string`

  The ID of the reasoning item.

- `output_index: number`

  The index of the item in the turn output.

- `session_id: string`

  The ID of the session associated with the event.

- `summary_index: number`

  The index of the summary content part.

- `text: string`

  The complete reasoning summary text.

- `turn_id: string or null`

  The ID of the turn associated with the event, when applicable.

- `type: "agent.session.turn.reasoning_summary_text.done"`

  The type of the object. Always `agent.session.turn.reasoning_summary_text.done`.

  - `"agent.session.turn.reasoning_summary_text.done"`

### Example

```json
{
  "type": "agent.session.turn.reasoning_summary_text.done",
  "event_id": "event_id",
  "session_id": "session_id",
  "turn_id": "turn_id",
  "item_id": "item_id",
  "output_index": 0,
  "summary_index": 0,
  "text": "text"
}
```

<a id="error"></a>

## error

Emitted when a turn or session fails.

### Schema

Schema name: `SessionEventError`

- `error: SessionError`

  The error that occurred.

  - `code: string or null`

    The machine-readable error code, if any.

  - `message: string`

    A customer-safe explanation of the error.

  - `param: string or null`

    The request parameter associated with the error, if any.

  - `type: string`

    The error type.

- `event_id: string`

  The unique ID of the event.

- `session_id: string`

  The ID of the session associated with the event.

- `type: "error"`

  The type of the object. Always `error`.

  - `"error"`

### Example

```json
{
  "type": "error",
  "event_id": "event_123",
  "session_id": "sess_123",
  "error": {
    "type": "server_error",
    "code": null,
    "message": "The session failed due to an internal server error.",
    "param": null
  }
}
```
