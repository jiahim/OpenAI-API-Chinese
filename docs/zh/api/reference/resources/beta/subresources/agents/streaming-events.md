# 智能体 流式事件

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

<a id="agent.session.environment.ready"></a>

## 智能体.session.environment.ready

当托管会话环境已准备好连接时发出。

### Schema

Schema name: `SessionEventAgentSessionEnvironmentReady`

- `environment: AgentSessionEnvironmentState`

  当前环境状态。

  - `id: string`

    环境的公共 ID。

  - `error: object { code, message, type }  or null`

    在准备会话环境时报告的错误。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误类型。

  - `status: "pending" or "ready" or "connected" or 2 more`

    环境的连接状态。

    - `"pending"`

      环境正在准备中。

    - `"ready"`

      环境已准备好连接。

    - `"connected"`

      环境已连接。

    - `"disconnected"`

      环境已断开连接。

    - `"failed"`

      环境连接失败。

  - `type: string`

    环境类型。

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.environment.ready"`

  对象的类型。始终为 `agent.session.environment.ready`.

  - `"agent.session.environment.ready"`

### 示例

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

## 智能体.output.command_execution_output.delta

当命令执行产生输出增量时触发。

### Schema

Schema name: `SessionEventAgentOutputCommandExecutionOutputDelta`

- `delta: string`

  被追加的输出文本。

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  命令执行项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.output.command_execution_output.delta"`

  对象的类型。始终为 `agent.output.command_execution_output.delta`.

  - `"agent.output.command_execution_output.delta"`

### 示例

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

## 智能体.session.created

在会话创建时触发。

### Schema

Schema name: `SessionEventAgentSessionCreated`

- `event_id: string`

  事件的唯一 ID。

- `session: AgentSession`

  已创建的会话。

  - `id: string`

    会话的 ID。

  - `agent: object { id, instructions, model, 6 more }`

    在该会话中运行的智能体。

    - `id: string`

      智能体的 ID。

    - `instructions: string or null`

      追加到智能体默认基础指令的自定义指令。

    - `model: string`

      智能体使用的模型。

    - `multi_agent: MultiAgentConfig`

      用于创建和协调子智能体的配置。

      - `enabled: boolean`

        是否启用子智能体工具。默认为 false。

      - `max_concurrent_subagents: number or null`

        可并发运行的子智能体最大数量，或在禁用时为 null。启用时默认为 6。

    - `name: string or null`

      会话创建时可复用智能体的名称，如果没有保存名称则为 null。之后对智能体名称的更改不会影响此值。

    - `reasoning: AgentReasoning`

      智能体的推理配置。

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        智能体所使用的推理工作量。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        从智能体请求的推理摘要格式。

        - `"concise"`

          在支持时返回简洁的推理摘要。

        - `"detailed"`

          在支持时返回详细的推理摘要。

        - `"auto"`

          自动选择模型所支持的最详细的摘要。

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      模型请求的有效服务层级策略。默认为 `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      用于配置智能体生成文本的配置。

      - `format: TextFormat`

        有效的输出格式。默认为普通文本。

        - `Text object { type }`

          在无结构化输出约束的情况下生成普通文本。

          - `type: "text"`

            对象的类型。始终为 `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          将生成的文本约束到 JSON Schema。

          - `schema: map[unknown]`

            生成的文本必须匹配的 JSON Schema。

          - `type: "json_schema"`

            对象的类型。始终为 `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        由智能体生成的文本量。默认为 `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      可供智能体使用的工具。

      - `Function object { defer_loading, description, name, 2 more }`

        由应用程序定义的函数。

        - `defer_loading: boolean`

          该函数是否延迟加载并通过工具搜索发现。

        - `description: string`

          对函数功能的描述。

        - `name: string`

          函数的名称。

        - `parameters: map[unknown]`

          描述该函数参数的 JSON Schema 对象。

        - `type: "function"`

          对象的类型。始终为 `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        允许从模型生成的代码中调用工具。

        - `enabled: boolean`

          是否可以从模型生成的代码中调用工具。

        - `type: "programmatic_tool_calling"`

          对象的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        由远程 MCP 服务器提供的工具。

        - `allowed_tools: array of string or null`

          智能体可以调用的 MCP 工具。

        - `connection_origin: "service" or "environment"`

          出站 MCP HTTP 连接的来源位置。

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          为此 MCP 服务器选择的已挂载保管库凭据（如果有）。当恰好有一个已挂载凭据与服务器 URL 匹配时为可选项。

        - `request_metadata: map[unknown]`

          随发往此 MCP 服务器的请求一起包含的元数据。

        - `required: boolean`

          此 MCP 服务器是否必须在第一轮之前完成初始化。

        - `server_label: string`

          用于在工具调用中标识 MCP 服务器的标签。

        - `transport: McpTransport`

          用于连接 MCP 服务器的传输方式。

          - `HTTP object { server_url, type }`

            通过 HTTP 连接到 MCP 服务器。

            - `server_url: string`

              MCP 服务器的 URL。

            - `type: "http"`

              对象的类型。始终为 `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            将 MCP 服务器作为本地进程启动。

            - `args: array of string`

              传递给 MCP 服务器命令的参数。

            - `command: string`

              用于启动 MCP 服务器的命令。

            - `cwd: string`

              用于启动 MCP 服务器的工作目录。

            - `env_vars: array of string`

              从执行环境继承的环境变量名称。

            - `type: "stdio"`

              对象的类型。始终为 `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          对象的类型。始终为 `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        网页搜索。

        - `allowed_domains: array of string or null`

          允许的搜索域，或 `null` 搜索不受限制时。

        - `context_size: "low" or "medium" or "high"`

          可供模型使用的搜索上下文量。默认为 `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          用于本地化网页搜索结果的近似用户位置。

          - `city: string or null`

            城市名称。

          - `country: string or null`

            两字母 ISO 国家代码，例如 `US`.

          - `region: string or null`

            地区或州名称。

          - `timezone: string or null`

            IANA 时区，例如 `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          用于网页搜索结果的来源。

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          对象的类型。始终为 `web_search`.

          - `"web_search"`

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `environment: Environment`

    会话的执行环境。

    - `None object { type }`

      会话在不选择或预置执行环境的情况下与 CCA 通信。

      - `type: "none"`

        对象的类型。始终为 `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      由OpenAI托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `files: array of HostedEnvironmentFile`

        环境中可用的文件，不包括其内容。

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          从 OpenAI Files API 复制的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `file_id: string`

            已上传文件的 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "file_id"`

            对象的类型。始终为 `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          创建会话时以内联方式提供的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        环境的有效网络访问策略。

        - `access: "enabled" or "disabled" or "restricted"`

          环境的网络访问模式。

          - `"enabled"`

            允许不受限制的网络访问。

          - `"disabled"`

            禁用网络访问。

          - `"restricted"`

            仅允许访问已配置的域名。

        - `allowed_domains: array of string`

          在网络访问受限的情况下，环境可以访问的域名。

      - `packages: object { npm, python, system }`

        环境中安装的软件包。

        - `npm: array of string`

          在环境中全局安装的 npm 软件包。

        - `python: array of string`

          环境中安装的 Python 软件包。

        - `system: array of string`

          环境中安装的系统软件包。

      - `plugins: array of HostedPlugin`

        环境中安装的插件，不包括其归档内容。

        - `description: string`

          已安装插件的描述。

        - `name: string`

          已安装插件的名称。

        - `type: "inline"`

          对象的类型。始终为 `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        环境中已安装的技能，不含其归档内容。

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          从 Skills API 安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `skill_id: string`

            所引用的技能 ID。

          - `type: "skill_reference"`

            对象的类型。始终为 `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            为此会话安装的具体技能版本。

        - `Inline object { description, name, type }`

          从内联 ZIP 归档安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        对象的类型。始终为 `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      由应用程序托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `remote_url: string`

        连接此环境时，将此 URL 原样传递给 `codex exec-server --remote` 。

      - `type: "self_hosted"`

        对象的类型。始终为 `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        环境内的绝对项目目录。默认为 `/workspace`.

  - `error: string or null`

    导致会话失败的错误（如果有）。

  - `last_active_at: number`

    会话最近活跃时的 Unix 时间戳（秒）。

  - `metadata: map[string]`

    附加到会话的自定义字符串键值对。

  - `object: "agent.session"`

    对象类型。始终为 `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    在会话能够继续之前必须完成的动作。

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      运行函数工具并提交其结果。

      - `arguments: unknown`

        模型提供的参数。

      - `call_id: string`

        提交函数结果时要包含的 ID。

      - `name: string`

        函数名称。

      - `turn_id: string`

        请求该函数调用的轮次 ID。

      - `type: "function_call"`

        对象的类型。始终为 `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      重新连接会话环境。

      - `environment_id: string`

        要重新连接的环境的 ID。

      - `type: "environment_connection"`

        对象的类型。始终为 `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    会话的当前状态。

    - `"idle"`

      会话当前没有进行中的轮次，已准备好接收输入。托管环境可能仍在置备中。

    - `"in_progress"`

      会话正在处理一个轮次。

    - `"requires_action"`

      会话正在等待一个或多个必需操作。

    - `"failed"`

      会话失败。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

  - `vault_ids: array of string`

    提供给会话的保管库的 ID。

- `type: "agent.session.created"`

  对象的类型。始终为 `agent.session.created`.

  - `"agent.session.created"`

### 示例

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

## 智能体.session.turn.created

在轮次创建时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnCreated`

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn: Turn`

  轮次创建时的时间。

  - `id: string`

    该轮次的 ID。

  - `agent_id: string`

    运行该轮次的智能体的 ID。

  - `completed_at: number or null`

    轮次达到终止状态时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    用于按创建时间对轮次进行排序的 Unix 时间戳（以秒为单位）。子智能体轮次使用其开始时间，若前面的时间戳不可用，则回退到完成时间或子智能体开启时间。

  - `error: SessionTurnError or null`

    描述会话请求失败原因的、对客户安全的错误信息。

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      稳定且机器可读的失败类别。

      - `"context_length_exceeded"`

        该请求超出模型的上下文窗口。

      - `"session_budget_exceeded"`

        该会话已耗尽其使用预算。

      - `"usage_limit_exceeded"`

        该组织已达到使用量、套餐或账单上限。

      - `"credit_balance_exhausted"`

        该组织已无剩余的 API 额度。

      - `"rate_limit_exceeded"`

        该请求超出可用的速率限制。

      - `"server_overloaded"`

        模型服务暂时过载。

      - `"cyber_policy"`

        该请求因安全策略被拒绝。

      - `"connection_failed"`

        该请求无法连接到模型服务。

      - `"server_error"`

        模型服务遇到意外错误。

      - `"authentication_error"`

        API 凭据无效或缺少所需的访问权限。

      - `"invalid_request"`

        该请求包含无效的输入或配置。

      - `"resource_not_found"`

        所请求的模型或资源不可用。

      - `"sandbox_error"`

        该请求无法在其执行环境中完成。

      - `"executor_version_incompatible"`

        执行器必须先升级才能运行此回合。

      - `"active_turn_not_steerable"`

        当请求正在运行时，会话无法接受其他输入。

      - `"request_timeout"`

        请求在模型服务响应之前已超时。

      - `"internal_error"`

        意外的内部错误导致会话请求无法完成。

    - `message: string`

      对客户友好的失败说明。

  - `object: "agent.session.turn"`

    对象类型。始终为 `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    拥有该回合的会话的 ID。

  - `started_at: number or null`

    回合开始时的 Unix 时间戳（以秒为单位）。

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    回合的当前状态。

    - `"queued"`

      回合正在等待开始。

    - `"in_progress"`

      回合正在进行中。

    - `"waiting"`

      回合正在等待外部输入。

    - `"completed"`

      回合已成功完成。

    - `"failed"`

      回合失败。

    - `"cancelled"`

      回合已取消。

  - `subagent_id: string or null`

    运行该回合的子智能体的 ID（如果适用）。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

- `turn_id: string`

  与该事件关联的回合的 ID。

- `type: "agent.session.turn.created"`

  对象的类型。始终为 `agent.session.turn.created`.

  - `"agent.session.turn.created"`

### 示例

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

## 智能体.session.turn.in_progress

在某一轮开始运行时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnInProgress`

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn: Turn`

  该轮次开始运行的时间。

  - `id: string`

    该轮次的 ID。

  - `agent_id: string`

    运行该轮次的智能体的 ID。

  - `completed_at: number or null`

    轮次达到终止状态时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    用于按创建时间对轮次进行排序的 Unix 时间戳（以秒为单位）。子智能体轮次使用其开始时间，若前面的时间戳不可用，则回退到完成时间或子智能体开启时间。

  - `error: SessionTurnError or null`

    描述会话请求失败原因的、对客户安全的错误信息。

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      稳定且机器可读的失败类别。

      - `"context_length_exceeded"`

        该请求超出模型的上下文窗口。

      - `"session_budget_exceeded"`

        该会话已耗尽其使用预算。

      - `"usage_limit_exceeded"`

        该组织已达到使用量、套餐或账单上限。

      - `"credit_balance_exhausted"`

        该组织已无剩余的 API 额度。

      - `"rate_limit_exceeded"`

        该请求超出可用的速率限制。

      - `"server_overloaded"`

        模型服务暂时过载。

      - `"cyber_policy"`

        该请求因安全策略被拒绝。

      - `"connection_failed"`

        该请求无法连接到模型服务。

      - `"server_error"`

        模型服务遇到意外错误。

      - `"authentication_error"`

        API 凭据无效或缺少所需的访问权限。

      - `"invalid_request"`

        该请求包含无效的输入或配置。

      - `"resource_not_found"`

        所请求的模型或资源不可用。

      - `"sandbox_error"`

        该请求无法在其执行环境中完成。

      - `"executor_version_incompatible"`

        执行器必须先升级才能运行此回合。

      - `"active_turn_not_steerable"`

        当请求正在运行时，会话无法接受其他输入。

      - `"request_timeout"`

        请求在模型服务响应之前已超时。

      - `"internal_error"`

        意外的内部错误导致会话请求无法完成。

    - `message: string`

      对客户友好的失败说明。

  - `object: "agent.session.turn"`

    对象类型。始终为 `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    拥有该回合的会话的 ID。

  - `started_at: number or null`

    回合开始时的 Unix 时间戳（以秒为单位）。

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    回合的当前状态。

    - `"queued"`

      回合正在等待开始。

    - `"in_progress"`

      回合正在进行中。

    - `"waiting"`

      回合正在等待外部输入。

    - `"completed"`

      回合已成功完成。

    - `"failed"`

      回合失败。

    - `"cancelled"`

      回合已取消。

  - `subagent_id: string or null`

    运行该回合的子智能体的 ID（如果适用）。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

- `turn_id: string`

  与该事件关联的回合的 ID。

- `type: "agent.session.turn.in_progress"`

  对象的类型。始终为 `agent.session.turn.in_progress`.

  - `"agent.session.turn.in_progress"`

### 示例

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

## 智能体.session.turn.completed

在某个轮次完成时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnCompleted`

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn: Turn`

  已完成的轮次。

  - `id: string`

    该轮次的 ID。

  - `agent_id: string`

    运行该轮次的智能体的 ID。

  - `completed_at: number or null`

    轮次达到终止状态时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    用于按创建时间对轮次进行排序的 Unix 时间戳（以秒为单位）。子智能体轮次使用其开始时间，若前面的时间戳不可用，则回退到完成时间或子智能体开启时间。

  - `error: SessionTurnError or null`

    描述会话请求失败原因的、对客户安全的错误信息。

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      稳定且机器可读的失败类别。

      - `"context_length_exceeded"`

        该请求超出模型的上下文窗口。

      - `"session_budget_exceeded"`

        该会话已耗尽其使用预算。

      - `"usage_limit_exceeded"`

        该组织已达到使用量、套餐或账单上限。

      - `"credit_balance_exhausted"`

        该组织已无剩余的 API 额度。

      - `"rate_limit_exceeded"`

        该请求超出可用的速率限制。

      - `"server_overloaded"`

        模型服务暂时过载。

      - `"cyber_policy"`

        该请求因安全策略被拒绝。

      - `"connection_failed"`

        该请求无法连接到模型服务。

      - `"server_error"`

        模型服务遇到意外错误。

      - `"authentication_error"`

        API 凭据无效或缺少所需的访问权限。

      - `"invalid_request"`

        该请求包含无效的输入或配置。

      - `"resource_not_found"`

        所请求的模型或资源不可用。

      - `"sandbox_error"`

        该请求无法在其执行环境中完成。

      - `"executor_version_incompatible"`

        执行器必须先升级才能运行此回合。

      - `"active_turn_not_steerable"`

        当请求正在运行时，会话无法接受其他输入。

      - `"request_timeout"`

        请求在模型服务响应之前已超时。

      - `"internal_error"`

        意外的内部错误导致会话请求无法完成。

    - `message: string`

      对客户友好的失败说明。

  - `object: "agent.session.turn"`

    对象类型。始终为 `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    拥有该回合的会话的 ID。

  - `started_at: number or null`

    回合开始时的 Unix 时间戳（以秒为单位）。

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    回合的当前状态。

    - `"queued"`

      回合正在等待开始。

    - `"in_progress"`

      回合正在进行中。

    - `"waiting"`

      回合正在等待外部输入。

    - `"completed"`

      回合已成功完成。

    - `"failed"`

      回合失败。

    - `"cancelled"`

      回合已取消。

  - `subagent_id: string or null`

    运行该回合的子智能体的 ID（如果适用）。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

- `turn_id: string`

  与该事件关联的回合的 ID。

- `type: "agent.session.turn.completed"`

  对象的类型。始终为 `agent.session.turn.completed`.

  - `"agent.session.turn.completed"`

- `usage: TokenUsage or null`

  记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

### 示例

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

## 智能体.session.turn.failed

当一轮对话失败时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnFailed`

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn: Turn`

  失败的轮次。

  - `id: string`

    该轮次的 ID。

  - `agent_id: string`

    运行该轮次的智能体的 ID。

  - `completed_at: number or null`

    轮次达到终止状态时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    用于按创建时间对轮次进行排序的 Unix 时间戳（以秒为单位）。子智能体轮次使用其开始时间，若前面的时间戳不可用，则回退到完成时间或子智能体开启时间。

  - `error: SessionTurnError or null`

    描述会话请求失败原因的、对客户安全的错误信息。

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      稳定且机器可读的失败类别。

      - `"context_length_exceeded"`

        该请求超出模型的上下文窗口。

      - `"session_budget_exceeded"`

        该会话已耗尽其使用预算。

      - `"usage_limit_exceeded"`

        该组织已达到使用量、套餐或账单上限。

      - `"credit_balance_exhausted"`

        该组织已无剩余的 API 额度。

      - `"rate_limit_exceeded"`

        该请求超出可用的速率限制。

      - `"server_overloaded"`

        模型服务暂时过载。

      - `"cyber_policy"`

        该请求因安全策略被拒绝。

      - `"connection_failed"`

        该请求无法连接到模型服务。

      - `"server_error"`

        模型服务遇到意外错误。

      - `"authentication_error"`

        API 凭据无效或缺少所需的访问权限。

      - `"invalid_request"`

        该请求包含无效的输入或配置。

      - `"resource_not_found"`

        所请求的模型或资源不可用。

      - `"sandbox_error"`

        该请求无法在其执行环境中完成。

      - `"executor_version_incompatible"`

        执行器必须先升级才能运行此回合。

      - `"active_turn_not_steerable"`

        当请求正在运行时，会话无法接受其他输入。

      - `"request_timeout"`

        请求在模型服务响应之前已超时。

      - `"internal_error"`

        意外的内部错误导致会话请求无法完成。

    - `message: string`

      对客户友好的失败说明。

  - `object: "agent.session.turn"`

    对象类型。始终为 `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    拥有该回合的会话的 ID。

  - `started_at: number or null`

    回合开始时的 Unix 时间戳（以秒为单位）。

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    回合的当前状态。

    - `"queued"`

      回合正在等待开始。

    - `"in_progress"`

      回合正在进行中。

    - `"waiting"`

      回合正在等待外部输入。

    - `"completed"`

      回合已成功完成。

    - `"failed"`

      回合失败。

    - `"cancelled"`

      回合已取消。

  - `subagent_id: string or null`

    运行该回合的子智能体的 ID（如果适用）。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

- `turn_id: string`

  与该事件关联的回合的 ID。

- `type: "agent.session.turn.failed"`

  对象的类型。始终为 `agent.session.turn.failed`.

  - `"agent.session.turn.failed"`

- `usage: TokenUsage or null`

  记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

### 示例

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

## 智能体.session.turn.cancelled

当某个回合被取消时触发。

### Schema

Schema name: `SessionEventAgentSessionTurnCancelled`

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn: Turn`

  已取消的轮次。

  - `id: string`

    该轮次的 ID。

  - `agent_id: string`

    运行该轮次的智能体的 ID。

  - `completed_at: number or null`

    轮次达到终止状态时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    用于按创建时间对轮次进行排序的 Unix 时间戳（以秒为单位）。子智能体轮次使用其开始时间，若前面的时间戳不可用，则回退到完成时间或子智能体开启时间。

  - `error: SessionTurnError or null`

    描述会话请求失败原因的、对客户安全的错误信息。

    - `code: "context_length_exceeded" or "session_budget_exceeded" or "usage_limit_exceeded" or 14 more`

      稳定且机器可读的失败类别。

      - `"context_length_exceeded"`

        该请求超出模型的上下文窗口。

      - `"session_budget_exceeded"`

        该会话已耗尽其使用预算。

      - `"usage_limit_exceeded"`

        该组织已达到使用量、套餐或账单上限。

      - `"credit_balance_exhausted"`

        该组织已无剩余的 API 额度。

      - `"rate_limit_exceeded"`

        该请求超出可用的速率限制。

      - `"server_overloaded"`

        模型服务暂时过载。

      - `"cyber_policy"`

        该请求因安全策略被拒绝。

      - `"connection_failed"`

        该请求无法连接到模型服务。

      - `"server_error"`

        模型服务遇到意外错误。

      - `"authentication_error"`

        API 凭据无效或缺少所需的访问权限。

      - `"invalid_request"`

        该请求包含无效的输入或配置。

      - `"resource_not_found"`

        所请求的模型或资源不可用。

      - `"sandbox_error"`

        该请求无法在其执行环境中完成。

      - `"executor_version_incompatible"`

        执行器必须先升级才能运行此回合。

      - `"active_turn_not_steerable"`

        当请求正在运行时，会话无法接受其他输入。

      - `"request_timeout"`

        请求在模型服务响应之前已超时。

      - `"internal_error"`

        意外的内部错误导致会话请求无法完成。

    - `message: string`

      对客户友好的失败说明。

  - `object: "agent.session.turn"`

    对象类型。始终为 `agent.session.turn`.

    - `"agent.session.turn"`

  - `session_id: string`

    拥有该回合的会话的 ID。

  - `started_at: number or null`

    回合开始时的 Unix 时间戳（以秒为单位）。

  - `status: "queued" or "in_progress" or "waiting" or 3 more`

    回合的当前状态。

    - `"queued"`

      回合正在等待开始。

    - `"in_progress"`

      回合正在进行中。

    - `"waiting"`

      回合正在等待外部输入。

    - `"completed"`

      回合已成功完成。

    - `"failed"`

      回合失败。

    - `"cancelled"`

      回合已取消。

  - `subagent_id: string or null`

    运行该回合的子智能体的 ID（如果适用）。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

- `turn_id: string`

  与该事件关联的回合的 ID。

- `type: "agent.session.turn.cancelled"`

  对象的类型。始终为 `agent.session.turn.cancelled`.

  - `"agent.session.turn.cancelled"`

- `usage: TokenUsage or null`

  记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

### 示例

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

## 智能体.session.turn.item.added

当某个条目被添加到轮次时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnItemAdded`

- `event_id: string`

  事件的唯一 ID。

- `item: AgentSessionItem`

  已添加的条目。

  - `AgentSessionMessage object { id, content, phase, 4 more }`

    会话中记录的用户或助手消息。

    - `id: string or null`

      此条目的 ID；对于未记录 ID 的旧版用户消息，返回 null。

    - `content: array of AgentSessionMessageContent`

      消息的内容。用户消息包含输入文本或图像；助手消息包含输出文本。

      - `InputText object { text, type }`

        用户提供的文本。

        - `text: string`

          用户提供的文本。

        - `type: "input_text"`

          对象的类型。始终为 `input_text`.

          - `"input_text"`

      - `InputImage object { image_url, type }`

        用户提供的图像。

        - `image_url: string`

          用户提供的图像的 URL，可以是 base64 编码的 data URL。

        - `type: "input_image"`

          对象的类型。始终为 `input_image`.

          - `"input_image"`

      - `OutputText object { text, type }`

        助手生成的文本。

        - `text: string`

          助手生成的文本。

        - `type: "output_text"`

          对象的类型。始终为 `output_text`.

          - `"output_text"`

    - `phase: "commentary" or "final_answer" or null`

      助手消息的阶段。

      - `"commentary"`

        智能体工作过程中产生的评论。

      - `"final_answer"`

        智能体的最终回答。

    - `role: "user" or "assistant"`

      消息作者的角色。

      - `"user"`

      - `"assistant"`

    - `status: AgentOutputItemStatus`

      消息的状态。用户消息始终为 `completed`.

      - `"in_progress"`

        该条目正在进行中。

      - `"completed"`

        该条目已完成。

      - `"incomplete"`

        该条目在完成前已停止。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "message"`

      条目类型。始终为 `message`.

      - `"message"`

  - `AgentReasoningItem object { id, status, summary, 2 more }`

    由智能体生成的推理项。

    - `id: string`

      推理项的 ID。

    - `status: AgentOutputItemStatus or null`

      智能体输出项的状态。

    - `summary: array of SummaryText`

      由智能体生成的推理摘要。

      - `text: string`

        推理摘要文本。

      - `type: "summary_text"`

        内容类型。始终为 `summary_text`.

        - `"summary_text"`

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "reasoning"`

      条目类型。始终为 `reasoning`.

      - `"reasoning"`

  - `AgentFunctionCallItem object { id, arguments, call_id, 4 more }`

    由智能体发起的函数调用。

    - `id: string`

      函数调用项的 ID。

    - `arguments: unknown`

      传递给函数的参数。

    - `call_id: string`

      用于提交函数结果的 ID。

    - `name: string`

      要调用的函数名称。

    - `status: AgentFunctionCallStatus`

      函数调用的状态。

      - `"in_progress"`

        调用正在进行中。

      - `"completed"`

        调用已成功完成。

      - `"failed"`

        调用失败。

      - `"incomplete"`

        调用在完成前已停止。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "function_call"`

      条目类型。始终为 `function_call`.

      - `"function_call"`

  - `FunctionCallOutput object { id, call_id, error, 4 more }`

    为函数调用提供的结果。

    - `id: string`

      函数调用输出项的 ID。

    - `call_id: string`

      生成此输出的函数调用的 ID。

    - `error: string or null`

      调用失败时的错误消息。

    - `output: AgentFunctionCallOutput or null`

      作为函数结果提供的文本或模型输入内容。

      - `string`

      - `array of InputContent`

        - `InputText object { text, type }`

          记录在会话项中的文本输入。

          - `text: string`

            提供给智能体的文本。

          - `type: "input_text"`

            对象的类型。始终为 `input_text`.

            - `"input_text"`

        - `InputImage object { image_url, type }`

          记录在会话项中的图像输入。

          - `image_url: string`

            提供给智能体的图像 URL，可以是 base64 编码的 data URL。

          - `type: "input_image"`

            对象的类型。始终为 `input_image`.

            - `"input_image"`

    - `status: AgentFunctionCallStatus`

      函数调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "function_call_output"`

      条目类型。始终为 `function_call_output`.

      - `"function_call_output"`

  - `AgentMessage object { id, content, recipient_agent_id, 3 more }`

    在智能体线程之间交换的消息。

    - `id: string`

      消息的 ID。

    - `content: array of AgentContent`

      在智能体之间交换的内容。

      - `OutputText object { text, type }`

        由智能体生成的文本内容片段。

        - `text: string`

          由智能体生成的文本。

        - `type: "output_text"`

          内容类型。始终为 `output_text`.

          - `"output_text"`

      - `EncryptedContent object { encrypted_content, type }`

        在智能体之间交换的加密内容。

        - `encrypted_content: string`

          加密内容载荷。

        - `type: "encrypted_content"`

          内容类型。始终为 `encrypted_content`.

          - `"encrypted_content"`

    - `recipient_agent_id: string`

      接收方智能体的 ID 或名称。

    - `sender_agent_id: string`

      发送方智能体的 ID 或名称。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "agent_message"`

      条目类型。始终为 `agent_message`.

      - `"agent_message"`

  - `AgentMcpCallItem object { id, arguments, error, 6 more }`

    对 MCP 服务器上某个工具的调用。

    - `id: string`

      MCP 调用项的 ID。

    - `arguments: unknown`

      传递给 MCP 工具的参数。

    - `error: unknown`

      MCP 工具返回的错误（如果有）。

    - `name: string`

      MCP 工具的名称。

    - `output: unknown`

      MCP 工具返回的输出（如果有）。

    - `server_label: string`

      MCP 服务器的标签。

    - `status: AgentFunctionCallStatus`

      MCP 工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "mcp_call"`

      条目类型。始终为 `mcp_call`.

      - `"mcp_call"`

  - `AgentWebSearchCallItem object { id, action, status, 2 more }`

    由智能体发起的网页搜索调用。

    - `id: string`

      网页搜索调用的 ID。

    - `action: WebSearchAction or null`

      由网页搜索工具执行的操作。

      - `Search object { queries, query, type }`

        搜索查询或一组搜索查询。

        - `queries: array of string or null`

          当使用了多个查询时的搜索查询列表。

        - `query: string or null`

          当使用单个查询时的搜索查询。

        - `type: "search"`

          对象的类型。始终为 `search`.

          - `"search"`

      - `OpenPage object { type, url }`

        打开网页。

        - `type: "open_page"`

          对象的类型。始终为 `open_page`.

          - `"open_page"`

        - `url: string or null`

          已打开页面的 URL。

      - `FindInPage object { pattern, type, url }`

        在网页中查找文本。

        - `pattern: string or null`

          搜索的文本模式。

        - `type: "find_in_page"`

          对象的类型。始终为 `find_in_page`.

          - `"find_in_page"`

        - `url: string or null`

          已搜索页面的 URL。

      - `Other object { type }`

        另一个网页搜索操作。

        - `type: "other"`

          对象的类型。始终为 `other`.

          - `"other"`

    - `status: AgentOutputItemStatus`

      网页搜索调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "web_search_call"`

      条目类型。始终为 `web_search_call`.

      - `"web_search_call"`

  - `AgentCommandExecutionItem object { id, command, cwd, 6 more }`

    由智能体产生的命令执行。

    - `id: string`

      命令执行项的 ID。

    - `command: string`

      已执行的命令。

    - `cwd: string or null`

      用于执行命令的工作目录。

    - `duration_ms: number or null`

      命令执行时长（毫秒）。

    - `exit_code: number or null`

      进程退出码（若命令已完成）。

    - `output: string or null`

      命令输出（如果有）。

    - `status: AgentFunctionCallStatus`

      命令执行的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "command_execution"`

      条目类型。始终为 `command_execution`.

      - `"command_execution"`

  - `AgentCreateSubagentCallItem object { id, agent_id, content, 5 more }`

    派生子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `agent_id: string`

      请求派生子智能体的智能体的 ID。

    - `content: array of AgentContent`

      分配给被派生智能体的任务。

      - `OutputText object { text, type }`

        由智能体生成的文本内容片段。

      - `EncryptedContent object { encrypted_content, type }`

        在智能体之间交换的加密内容。

    - `model: string or null`

      被派生智能体所使用的模型。

    - `reasoning_effort: string or null`

      被派生智能体所使用的推理力度。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "create_subagent_call"`

      条目类型。始终为 `create_subagent_call`.

      - `"create_subagent_call"`

        当前的公共项类型。

  - `AgentSendSubagentInputCallItem object { id, content, recipient_agent_id, 4 more }`

    向其他智能体发送输入的请求。

    - `id: string`

      工具调用项的 ID。

    - `content: array of AgentContent`

      发送给接收方智能体的输入。

      - `OutputText object { text, type }`

        由智能体生成的文本内容片段。

      - `EncryptedContent object { encrypted_content, type }`

        在智能体之间交换的加密内容。

    - `recipient_agent_id: string`

      接收输入的智能体的 ID。

    - `sender_agent_id: string`

      发送输入的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "send_subagent_input_call"`

      条目类型。始终为 `send_subagent_input_call`.

      - `"send_subagent_input_call"`

        当前的公共项类型。

  - `AgentResumeSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    恢复子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_id: string`

      要恢复的智能体的 ID。

    - `sender_agent_id: string`

      请求恢复的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "resume_subagent_call"`

      条目类型。始终为 `resume_subagent_call`.

      - `"resume_subagent_call"`

        当前的公共项类型。

  - `AgentWaitForSubagentsCallItem object { id, recipient_agent_ids, sender_agent_id, 3 more }`

    等待一个或多个子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_ids: array of string`

      要等待的智能体的 ID。

    - `sender_agent_id: string`

      正在等待结果的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "wait_for_subagents_call"`

      条目类型。始终为 `wait_for_subagents_call`.

      - `"wait_for_subagents_call"`

        当前的公共项类型。

  - `AgentInterruptSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    中断子智能体当前轮次的请求。子智能体仍处于可用状态。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_id: string`

      要中断的智能体的 ID。

    - `sender_agent_id: string`

      发起中断请求的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "interrupt_subagent_call"`

      条目类型。始终为 `interrupt_subagent_call`.

      - `"interrupt_subagent_call"`

        当前的公共项类型。

  - `AgentCloseSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    关闭子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_id: string`

      要关闭的智能体的 ID。

    - `sender_agent_id: string`

      发起关闭请求的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "close_subagent_call"`

      条目类型。始终为 `close_subagent_call`.

      - `"close_subagent_call"`

        当前的公共项类型。

- `output_index: number or null`

  当条目是智能体输出时，该条目在轮次输出中的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.item.added"`

  对象的类型。始终为 `agent.session.turn.item.added`.

  - `"agent.session.turn.item.added"`

### 示例

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

## 智能体.session.idle

当会话变为空闲状态时触发。

### Schema

Schema name: `SessionEventAgentSessionIdle`

- `event_id: string`

  事件的唯一 ID。

- `session: AgentSession`

  变为空闲状态的会话。

  - `id: string`

    会话的 ID。

  - `agent: object { id, instructions, model, 6 more }`

    在该会话中运行的智能体。

    - `id: string`

      智能体的 ID。

    - `instructions: string or null`

      追加到智能体默认基础指令的自定义指令。

    - `model: string`

      智能体使用的模型。

    - `multi_agent: MultiAgentConfig`

      用于创建和协调子智能体的配置。

      - `enabled: boolean`

        是否启用子智能体工具。默认为 false。

      - `max_concurrent_subagents: number or null`

        可并发运行的子智能体最大数量，或在禁用时为 null。启用时默认为 6。

    - `name: string or null`

      会话创建时可复用智能体的名称，如果没有保存名称则为 null。之后对智能体名称的更改不会影响此值。

    - `reasoning: AgentReasoning`

      智能体的推理配置。

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        智能体所使用的推理工作量。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        从智能体请求的推理摘要格式。

        - `"concise"`

          在支持时返回简洁的推理摘要。

        - `"detailed"`

          在支持时返回详细的推理摘要。

        - `"auto"`

          自动选择模型所支持的最详细的摘要。

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      模型请求的有效服务层级策略。默认为 `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      用于配置智能体生成文本的配置。

      - `format: TextFormat`

        有效的输出格式。默认为普通文本。

        - `Text object { type }`

          在无结构化输出约束的情况下生成普通文本。

          - `type: "text"`

            对象的类型。始终为 `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          将生成的文本约束到 JSON Schema。

          - `schema: map[unknown]`

            生成的文本必须匹配的 JSON Schema。

          - `type: "json_schema"`

            对象的类型。始终为 `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        由智能体生成的文本量。默认为 `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      可供智能体使用的工具。

      - `Function object { defer_loading, description, name, 2 more }`

        由应用程序定义的函数。

        - `defer_loading: boolean`

          该函数是否延迟加载并通过工具搜索发现。

        - `description: string`

          对函数功能的描述。

        - `name: string`

          函数的名称。

        - `parameters: map[unknown]`

          描述该函数参数的 JSON Schema 对象。

        - `type: "function"`

          对象的类型。始终为 `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        允许从模型生成的代码中调用工具。

        - `enabled: boolean`

          是否可以从模型生成的代码中调用工具。

        - `type: "programmatic_tool_calling"`

          对象的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        由远程 MCP 服务器提供的工具。

        - `allowed_tools: array of string or null`

          智能体可以调用的 MCP 工具。

        - `connection_origin: "service" or "environment"`

          出站 MCP HTTP 连接的来源位置。

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          为此 MCP 服务器选择的已挂载保管库凭据（如果有）。当恰好有一个已挂载凭据与服务器 URL 匹配时为可选项。

        - `request_metadata: map[unknown]`

          随发往此 MCP 服务器的请求一起包含的元数据。

        - `required: boolean`

          此 MCP 服务器是否必须在第一轮之前完成初始化。

        - `server_label: string`

          用于在工具调用中标识 MCP 服务器的标签。

        - `transport: McpTransport`

          用于连接 MCP 服务器的传输方式。

          - `HTTP object { server_url, type }`

            通过 HTTP 连接到 MCP 服务器。

            - `server_url: string`

              MCP 服务器的 URL。

            - `type: "http"`

              对象的类型。始终为 `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            将 MCP 服务器作为本地进程启动。

            - `args: array of string`

              传递给 MCP 服务器命令的参数。

            - `command: string`

              用于启动 MCP 服务器的命令。

            - `cwd: string`

              用于启动 MCP 服务器的工作目录。

            - `env_vars: array of string`

              从执行环境继承的环境变量名称。

            - `type: "stdio"`

              对象的类型。始终为 `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          对象的类型。始终为 `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        网页搜索。

        - `allowed_domains: array of string or null`

          允许的搜索域，或 `null` 搜索不受限制时。

        - `context_size: "low" or "medium" or "high"`

          可供模型使用的搜索上下文量。默认为 `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          用于本地化网页搜索结果的近似用户位置。

          - `city: string or null`

            城市名称。

          - `country: string or null`

            两字母 ISO 国家代码，例如 `US`.

          - `region: string or null`

            地区或州名称。

          - `timezone: string or null`

            IANA 时区，例如 `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          用于网页搜索结果的来源。

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          对象的类型。始终为 `web_search`.

          - `"web_search"`

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `environment: Environment`

    会话的执行环境。

    - `None object { type }`

      会话在不选择或预置执行环境的情况下与 CCA 通信。

      - `type: "none"`

        对象的类型。始终为 `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      由OpenAI托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `files: array of HostedEnvironmentFile`

        环境中可用的文件，不包括其内容。

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          从 OpenAI Files API 复制的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `file_id: string`

            已上传文件的 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "file_id"`

            对象的类型。始终为 `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          创建会话时以内联方式提供的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        环境的有效网络访问策略。

        - `access: "enabled" or "disabled" or "restricted"`

          环境的网络访问模式。

          - `"enabled"`

            允许不受限制的网络访问。

          - `"disabled"`

            禁用网络访问。

          - `"restricted"`

            仅允许访问已配置的域名。

        - `allowed_domains: array of string`

          在网络访问受限的情况下，环境可以访问的域名。

      - `packages: object { npm, python, system }`

        环境中安装的软件包。

        - `npm: array of string`

          在环境中全局安装的 npm 软件包。

        - `python: array of string`

          环境中安装的 Python 软件包。

        - `system: array of string`

          环境中安装的系统软件包。

      - `plugins: array of HostedPlugin`

        环境中安装的插件，不包括其归档内容。

        - `description: string`

          已安装插件的描述。

        - `name: string`

          已安装插件的名称。

        - `type: "inline"`

          对象的类型。始终为 `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        环境中已安装的技能，不含其归档内容。

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          从 Skills API 安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `skill_id: string`

            所引用的技能 ID。

          - `type: "skill_reference"`

            对象的类型。始终为 `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            为此会话安装的具体技能版本。

        - `Inline object { description, name, type }`

          从内联 ZIP 归档安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        对象的类型。始终为 `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      由应用程序托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `remote_url: string`

        连接此环境时，将此 URL 原样传递给 `codex exec-server --remote` 。

      - `type: "self_hosted"`

        对象的类型。始终为 `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        环境内的绝对项目目录。默认为 `/workspace`.

  - `error: string or null`

    导致会话失败的错误（如果有）。

  - `last_active_at: number`

    会话最近活跃时的 Unix 时间戳（秒）。

  - `metadata: map[string]`

    附加到会话的自定义字符串键值对。

  - `object: "agent.session"`

    对象类型。始终为 `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    在会话能够继续之前必须完成的动作。

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      运行函数工具并提交其结果。

      - `arguments: unknown`

        模型提供的参数。

      - `call_id: string`

        提交函数结果时要包含的 ID。

      - `name: string`

        函数名称。

      - `turn_id: string`

        请求该函数调用的轮次 ID。

      - `type: "function_call"`

        对象的类型。始终为 `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      重新连接会话环境。

      - `environment_id: string`

        要重新连接的环境的 ID。

      - `type: "environment_connection"`

        对象的类型。始终为 `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    会话的当前状态。

    - `"idle"`

      会话当前没有进行中的轮次，已准备好接收输入。托管环境可能仍在置备中。

    - `"in_progress"`

      会话正在处理一个轮次。

    - `"requires_action"`

      会话正在等待一个或多个必需操作。

    - `"failed"`

      会话失败。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

  - `vault_ids: array of string`

    提供给会话的保管库的 ID。

- `type: "agent.session.idle"`

  对象的类型。始终为 `agent.session.idle`.

  - `"agent.session.idle"`

### 示例

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

## 智能体.session.in_progress

当会话开始处理一个轮次时发出。

### Schema

Schema name: `SessionEventAgentSessionInProgress`

- `event_id: string`

  事件的唯一 ID。

- `session: AgentSession`

  开始处理的会话。

  - `id: string`

    会话的 ID。

  - `agent: object { id, instructions, model, 6 more }`

    在该会话中运行的智能体。

    - `id: string`

      智能体的 ID。

    - `instructions: string or null`

      追加到智能体默认基础指令的自定义指令。

    - `model: string`

      智能体使用的模型。

    - `multi_agent: MultiAgentConfig`

      用于创建和协调子智能体的配置。

      - `enabled: boolean`

        是否启用子智能体工具。默认为 false。

      - `max_concurrent_subagents: number or null`

        可并发运行的子智能体最大数量，或在禁用时为 null。启用时默认为 6。

    - `name: string or null`

      会话创建时可复用智能体的名称，如果没有保存名称则为 null。之后对智能体名称的更改不会影响此值。

    - `reasoning: AgentReasoning`

      智能体的推理配置。

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        智能体所使用的推理工作量。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        从智能体请求的推理摘要格式。

        - `"concise"`

          在支持时返回简洁的推理摘要。

        - `"detailed"`

          在支持时返回详细的推理摘要。

        - `"auto"`

          自动选择模型所支持的最详细的摘要。

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      模型请求的有效服务层级策略。默认为 `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      用于配置智能体生成文本的配置。

      - `format: TextFormat`

        有效的输出格式。默认为普通文本。

        - `Text object { type }`

          在无结构化输出约束的情况下生成普通文本。

          - `type: "text"`

            对象的类型。始终为 `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          将生成的文本约束到 JSON Schema。

          - `schema: map[unknown]`

            生成的文本必须匹配的 JSON Schema。

          - `type: "json_schema"`

            对象的类型。始终为 `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        由智能体生成的文本量。默认为 `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      可供智能体使用的工具。

      - `Function object { defer_loading, description, name, 2 more }`

        由应用程序定义的函数。

        - `defer_loading: boolean`

          该函数是否延迟加载并通过工具搜索发现。

        - `description: string`

          对函数功能的描述。

        - `name: string`

          函数的名称。

        - `parameters: map[unknown]`

          描述该函数参数的 JSON Schema 对象。

        - `type: "function"`

          对象的类型。始终为 `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        允许从模型生成的代码中调用工具。

        - `enabled: boolean`

          是否可以从模型生成的代码中调用工具。

        - `type: "programmatic_tool_calling"`

          对象的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        由远程 MCP 服务器提供的工具。

        - `allowed_tools: array of string or null`

          智能体可以调用的 MCP 工具。

        - `connection_origin: "service" or "environment"`

          出站 MCP HTTP 连接的来源位置。

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          为此 MCP 服务器选择的已挂载保管库凭据（如果有）。当恰好有一个已挂载凭据与服务器 URL 匹配时为可选项。

        - `request_metadata: map[unknown]`

          随发往此 MCP 服务器的请求一起包含的元数据。

        - `required: boolean`

          此 MCP 服务器是否必须在第一轮之前完成初始化。

        - `server_label: string`

          用于在工具调用中标识 MCP 服务器的标签。

        - `transport: McpTransport`

          用于连接 MCP 服务器的传输方式。

          - `HTTP object { server_url, type }`

            通过 HTTP 连接到 MCP 服务器。

            - `server_url: string`

              MCP 服务器的 URL。

            - `type: "http"`

              对象的类型。始终为 `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            将 MCP 服务器作为本地进程启动。

            - `args: array of string`

              传递给 MCP 服务器命令的参数。

            - `command: string`

              用于启动 MCP 服务器的命令。

            - `cwd: string`

              用于启动 MCP 服务器的工作目录。

            - `env_vars: array of string`

              从执行环境继承的环境变量名称。

            - `type: "stdio"`

              对象的类型。始终为 `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          对象的类型。始终为 `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        网页搜索。

        - `allowed_domains: array of string or null`

          允许的搜索域，或 `null` 搜索不受限制时。

        - `context_size: "low" or "medium" or "high"`

          可供模型使用的搜索上下文量。默认为 `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          用于本地化网页搜索结果的近似用户位置。

          - `city: string or null`

            城市名称。

          - `country: string or null`

            两字母 ISO 国家代码，例如 `US`.

          - `region: string or null`

            地区或州名称。

          - `timezone: string or null`

            IANA 时区，例如 `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          用于网页搜索结果的来源。

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          对象的类型。始终为 `web_search`.

          - `"web_search"`

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `environment: Environment`

    会话的执行环境。

    - `None object { type }`

      会话在不选择或预置执行环境的情况下与 CCA 通信。

      - `type: "none"`

        对象的类型。始终为 `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      由OpenAI托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `files: array of HostedEnvironmentFile`

        环境中可用的文件，不包括其内容。

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          从 OpenAI Files API 复制的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `file_id: string`

            已上传文件的 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "file_id"`

            对象的类型。始终为 `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          创建会话时以内联方式提供的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        环境的有效网络访问策略。

        - `access: "enabled" or "disabled" or "restricted"`

          环境的网络访问模式。

          - `"enabled"`

            允许不受限制的网络访问。

          - `"disabled"`

            禁用网络访问。

          - `"restricted"`

            仅允许访问已配置的域名。

        - `allowed_domains: array of string`

          在网络访问受限的情况下，环境可以访问的域名。

      - `packages: object { npm, python, system }`

        环境中安装的软件包。

        - `npm: array of string`

          在环境中全局安装的 npm 软件包。

        - `python: array of string`

          环境中安装的 Python 软件包。

        - `system: array of string`

          环境中安装的系统软件包。

      - `plugins: array of HostedPlugin`

        环境中安装的插件，不包括其归档内容。

        - `description: string`

          已安装插件的描述。

        - `name: string`

          已安装插件的名称。

        - `type: "inline"`

          对象的类型。始终为 `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        环境中已安装的技能，不含其归档内容。

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          从 Skills API 安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `skill_id: string`

            所引用的技能 ID。

          - `type: "skill_reference"`

            对象的类型。始终为 `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            为此会话安装的具体技能版本。

        - `Inline object { description, name, type }`

          从内联 ZIP 归档安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        对象的类型。始终为 `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      由应用程序托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `remote_url: string`

        连接此环境时，将此 URL 原样传递给 `codex exec-server --remote` 。

      - `type: "self_hosted"`

        对象的类型。始终为 `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        环境内的绝对项目目录。默认为 `/workspace`.

  - `error: string or null`

    导致会话失败的错误（如果有）。

  - `last_active_at: number`

    会话最近活跃时的 Unix 时间戳（秒）。

  - `metadata: map[string]`

    附加到会话的自定义字符串键值对。

  - `object: "agent.session"`

    对象类型。始终为 `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    在会话能够继续之前必须完成的动作。

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      运行函数工具并提交其结果。

      - `arguments: unknown`

        模型提供的参数。

      - `call_id: string`

        提交函数结果时要包含的 ID。

      - `name: string`

        函数名称。

      - `turn_id: string`

        请求该函数调用的轮次 ID。

      - `type: "function_call"`

        对象的类型。始终为 `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      重新连接会话环境。

      - `environment_id: string`

        要重新连接的环境的 ID。

      - `type: "environment_connection"`

        对象的类型。始终为 `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    会话的当前状态。

    - `"idle"`

      会话当前没有进行中的轮次，已准备好接收输入。托管环境可能仍在置备中。

    - `"in_progress"`

      会话正在处理一个轮次。

    - `"requires_action"`

      会话正在等待一个或多个必需操作。

    - `"failed"`

      会话失败。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

  - `vault_ids: array of string`

    提供给会话的保管库的 ID。

- `type: "agent.session.in_progress"`

  对象的类型。始终为 `agent.session.in_progress`.

  - `"agent.session.in_progress"`

### 示例

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

## 智能体.session.requires_action

当会话正在等待一个或多个必需操作时发出。

### Schema

Schema name: `SessionEventAgentSessionRequiresAction`

- `event_id: string`

  事件的唯一 ID。

- `session: AgentSession`

  会话及其当前必需的操作。

  - `id: string`

    会话的 ID。

  - `agent: object { id, instructions, model, 6 more }`

    在该会话中运行的智能体。

    - `id: string`

      智能体的 ID。

    - `instructions: string or null`

      追加到智能体默认基础指令的自定义指令。

    - `model: string`

      智能体使用的模型。

    - `multi_agent: MultiAgentConfig`

      用于创建和协调子智能体的配置。

      - `enabled: boolean`

        是否启用子智能体工具。默认为 false。

      - `max_concurrent_subagents: number or null`

        可并发运行的子智能体最大数量，或在禁用时为 null。启用时默认为 6。

    - `name: string or null`

      会话创建时可复用智能体的名称，如果没有保存名称则为 null。之后对智能体名称的更改不会影响此值。

    - `reasoning: AgentReasoning`

      智能体的推理配置。

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        智能体所使用的推理工作量。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        从智能体请求的推理摘要格式。

        - `"concise"`

          在支持时返回简洁的推理摘要。

        - `"detailed"`

          在支持时返回详细的推理摘要。

        - `"auto"`

          自动选择模型所支持的最详细的摘要。

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      模型请求的有效服务层级策略。默认为 `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      用于配置智能体生成文本的配置。

      - `format: TextFormat`

        有效的输出格式。默认为普通文本。

        - `Text object { type }`

          在无结构化输出约束的情况下生成普通文本。

          - `type: "text"`

            对象的类型。始终为 `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          将生成的文本约束到 JSON Schema。

          - `schema: map[unknown]`

            生成的文本必须匹配的 JSON Schema。

          - `type: "json_schema"`

            对象的类型。始终为 `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        由智能体生成的文本量。默认为 `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      可供智能体使用的工具。

      - `Function object { defer_loading, description, name, 2 more }`

        由应用程序定义的函数。

        - `defer_loading: boolean`

          该函数是否延迟加载并通过工具搜索发现。

        - `description: string`

          对函数功能的描述。

        - `name: string`

          函数的名称。

        - `parameters: map[unknown]`

          描述该函数参数的 JSON Schema 对象。

        - `type: "function"`

          对象的类型。始终为 `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        允许从模型生成的代码中调用工具。

        - `enabled: boolean`

          是否可以从模型生成的代码中调用工具。

        - `type: "programmatic_tool_calling"`

          对象的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        由远程 MCP 服务器提供的工具。

        - `allowed_tools: array of string or null`

          智能体可以调用的 MCP 工具。

        - `connection_origin: "service" or "environment"`

          出站 MCP HTTP 连接的来源位置。

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          为此 MCP 服务器选择的已挂载保管库凭据（如果有）。当恰好有一个已挂载凭据与服务器 URL 匹配时为可选项。

        - `request_metadata: map[unknown]`

          随发往此 MCP 服务器的请求一起包含的元数据。

        - `required: boolean`

          此 MCP 服务器是否必须在第一轮之前完成初始化。

        - `server_label: string`

          用于在工具调用中标识 MCP 服务器的标签。

        - `transport: McpTransport`

          用于连接 MCP 服务器的传输方式。

          - `HTTP object { server_url, type }`

            通过 HTTP 连接到 MCP 服务器。

            - `server_url: string`

              MCP 服务器的 URL。

            - `type: "http"`

              对象的类型。始终为 `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            将 MCP 服务器作为本地进程启动。

            - `args: array of string`

              传递给 MCP 服务器命令的参数。

            - `command: string`

              用于启动 MCP 服务器的命令。

            - `cwd: string`

              用于启动 MCP 服务器的工作目录。

            - `env_vars: array of string`

              从执行环境继承的环境变量名称。

            - `type: "stdio"`

              对象的类型。始终为 `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          对象的类型。始终为 `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        网页搜索。

        - `allowed_domains: array of string or null`

          允许的搜索域，或 `null` 搜索不受限制时。

        - `context_size: "low" or "medium" or "high"`

          可供模型使用的搜索上下文量。默认为 `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          用于本地化网页搜索结果的近似用户位置。

          - `city: string or null`

            城市名称。

          - `country: string or null`

            两字母 ISO 国家代码，例如 `US`.

          - `region: string or null`

            地区或州名称。

          - `timezone: string or null`

            IANA 时区，例如 `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          用于网页搜索结果的来源。

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          对象的类型。始终为 `web_search`.

          - `"web_search"`

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `environment: Environment`

    会话的执行环境。

    - `None object { type }`

      会话在不选择或预置执行环境的情况下与 CCA 通信。

      - `type: "none"`

        对象的类型。始终为 `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      由OpenAI托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `files: array of HostedEnvironmentFile`

        环境中可用的文件，不包括其内容。

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          从 OpenAI Files API 复制的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `file_id: string`

            已上传文件的 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "file_id"`

            对象的类型。始终为 `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          创建会话时以内联方式提供的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        环境的有效网络访问策略。

        - `access: "enabled" or "disabled" or "restricted"`

          环境的网络访问模式。

          - `"enabled"`

            允许不受限制的网络访问。

          - `"disabled"`

            禁用网络访问。

          - `"restricted"`

            仅允许访问已配置的域名。

        - `allowed_domains: array of string`

          在网络访问受限的情况下，环境可以访问的域名。

      - `packages: object { npm, python, system }`

        环境中安装的软件包。

        - `npm: array of string`

          在环境中全局安装的 npm 软件包。

        - `python: array of string`

          环境中安装的 Python 软件包。

        - `system: array of string`

          环境中安装的系统软件包。

      - `plugins: array of HostedPlugin`

        环境中安装的插件，不包括其归档内容。

        - `description: string`

          已安装插件的描述。

        - `name: string`

          已安装插件的名称。

        - `type: "inline"`

          对象的类型。始终为 `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        环境中已安装的技能，不含其归档内容。

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          从 Skills API 安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `skill_id: string`

            所引用的技能 ID。

          - `type: "skill_reference"`

            对象的类型。始终为 `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            为此会话安装的具体技能版本。

        - `Inline object { description, name, type }`

          从内联 ZIP 归档安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        对象的类型。始终为 `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      由应用程序托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `remote_url: string`

        连接此环境时，将此 URL 原样传递给 `codex exec-server --remote` 。

      - `type: "self_hosted"`

        对象的类型。始终为 `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        环境内的绝对项目目录。默认为 `/workspace`.

  - `error: string or null`

    导致会话失败的错误（如果有）。

  - `last_active_at: number`

    会话最近活跃时的 Unix 时间戳（秒）。

  - `metadata: map[string]`

    附加到会话的自定义字符串键值对。

  - `object: "agent.session"`

    对象类型。始终为 `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    在会话能够继续之前必须完成的动作。

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      运行函数工具并提交其结果。

      - `arguments: unknown`

        模型提供的参数。

      - `call_id: string`

        提交函数结果时要包含的 ID。

      - `name: string`

        函数名称。

      - `turn_id: string`

        请求该函数调用的轮次 ID。

      - `type: "function_call"`

        对象的类型。始终为 `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      重新连接会话环境。

      - `environment_id: string`

        要重新连接的环境的 ID。

      - `type: "environment_connection"`

        对象的类型。始终为 `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    会话的当前状态。

    - `"idle"`

      会话当前没有进行中的轮次，已准备好接收输入。托管环境可能仍在置备中。

    - `"in_progress"`

      会话正在处理一个轮次。

    - `"requires_action"`

      会话正在等待一个或多个必需操作。

    - `"failed"`

      会话失败。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

  - `vault_ids: array of string`

    提供给会话的保管库的 ID。

- `type: "agent.session.requires_action"`

  对象的类型。始终为 `agent.session.requires_action`.

  - `"agent.session.requires_action"`

### 示例

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

## 智能体.session.failed

当会话失败时触发。

### Schema

Schema name: `SessionEventAgentSessionFailed`

- `event_id: string`

  事件的唯一 ID。

- `session: AgentSession`

  失败的会话。

  - `id: string`

    会话的 ID。

  - `agent: object { id, instructions, model, 6 more }`

    在该会话中运行的智能体。

    - `id: string`

      智能体的 ID。

    - `instructions: string or null`

      追加到智能体默认基础指令的自定义指令。

    - `model: string`

      智能体使用的模型。

    - `multi_agent: MultiAgentConfig`

      用于创建和协调子智能体的配置。

      - `enabled: boolean`

        是否启用子智能体工具。默认为 false。

      - `max_concurrent_subagents: number or null`

        可并发运行的子智能体最大数量，或在禁用时为 null。启用时默认为 6。

    - `name: string or null`

      会话创建时可复用智能体的名称，如果没有保存名称则为 null。之后对智能体名称的更改不会影响此值。

    - `reasoning: AgentReasoning`

      智能体的推理配置。

      - `effort: "none" or "minimal" or "low" or 4 more or null`

        智能体所使用的推理工作量。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `summary: "concise" or "detailed" or "auto" or null`

        从智能体请求的推理摘要格式。

        - `"concise"`

          在支持时返回简洁的推理摘要。

        - `"detailed"`

          在支持时返回详细的推理摘要。

        - `"auto"`

          自动选择模型所支持的最详细的摘要。

    - `service_tier: "auto" or "default" or "flex" or 2 more`

      模型请求的有效服务层级策略。默认为 `auto`.

      - `"auto"`

      - `"default"`

      - `"flex"`

      - `"priority"`

      - `"fast"`

    - `text: AgentText`

      用于配置智能体生成文本的配置。

      - `format: TextFormat`

        有效的输出格式。默认为普通文本。

        - `Text object { type }`

          在无结构化输出约束的情况下生成普通文本。

          - `type: "text"`

            对象的类型。始终为 `text`.

            - `"text"`

        - `JSONSchema object { schema, type }`

          将生成的文本约束到 JSON Schema。

          - `schema: map[unknown]`

            生成的文本必须匹配的 JSON Schema。

          - `type: "json_schema"`

            对象的类型。始终为 `json_schema`.

            - `"json_schema"`

      - `verbosity: "low" or "medium" or "high"`

        由智能体生成的文本量。默认为 `medium`.

        - `"low"`

        - `"medium"`

        - `"high"`

    - `tools: array of AgentTool`

      可供智能体使用的工具。

      - `Function object { defer_loading, description, name, 2 more }`

        由应用程序定义的函数。

        - `defer_loading: boolean`

          该函数是否延迟加载并通过工具搜索发现。

        - `description: string`

          对函数功能的描述。

        - `name: string`

          函数的名称。

        - `parameters: map[unknown]`

          描述该函数参数的 JSON Schema 对象。

        - `type: "function"`

          对象的类型。始终为 `function`.

          - `"function"`

      - `ProgrammaticToolCalling object { enabled, type }`

        允许从模型生成的代码中调用工具。

        - `enabled: boolean`

          是否可以从模型生成的代码中调用工具。

        - `type: "programmatic_tool_calling"`

          对象的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `Mcp object { allowed_tools, connection_origin, credential_id, 5 more }`

        由远程 MCP 服务器提供的工具。

        - `allowed_tools: array of string or null`

          智能体可以调用的 MCP 工具。

        - `connection_origin: "service" or "environment"`

          出站 MCP HTTP 连接的来源位置。

          - `"service"`

          - `"environment"`

        - `credential_id: string or null`

          为此 MCP 服务器选择的已挂载保管库凭据（如果有）。当恰好有一个已挂载凭据与服务器 URL 匹配时为可选项。

        - `request_metadata: map[unknown]`

          随发往此 MCP 服务器的请求一起包含的元数据。

        - `required: boolean`

          此 MCP 服务器是否必须在第一轮之前完成初始化。

        - `server_label: string`

          用于在工具调用中标识 MCP 服务器的标签。

        - `transport: McpTransport`

          用于连接 MCP 服务器的传输方式。

          - `HTTP object { server_url, type }`

            通过 HTTP 连接到 MCP 服务器。

            - `server_url: string`

              MCP 服务器的 URL。

            - `type: "http"`

              对象的类型。始终为 `http`.

              - `"http"`

          - `Stdio object { args, command, cwd, 2 more }`

            将 MCP 服务器作为本地进程启动。

            - `args: array of string`

              传递给 MCP 服务器命令的参数。

            - `command: string`

              用于启动 MCP 服务器的命令。

            - `cwd: string`

              用于启动 MCP 服务器的工作目录。

            - `env_vars: array of string`

              从执行环境继承的环境变量名称。

            - `type: "stdio"`

              对象的类型。始终为 `stdio`.

              - `"stdio"`

        - `type: "mcp"`

          对象的类型。始终为 `mcp`.

          - `"mcp"`

      - `WebSearch object { allowed_domains, context_size, location, 2 more }`

        网页搜索。

        - `allowed_domains: array of string or null`

          允许的搜索域，或 `null` 搜索不受限制时。

        - `context_size: "low" or "medium" or "high"`

          可供模型使用的搜索上下文量。默认为 `medium`.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `location: object { city, country, region, timezone }  or null`

          用于本地化网页搜索结果的近似用户位置。

          - `city: string or null`

            城市名称。

          - `country: string or null`

            两字母 ISO 国家代码，例如 `US`.

          - `region: string or null`

            地区或州名称。

          - `timezone: string or null`

            IANA 时区，例如 `America/Los_Angeles`.

        - `mode: "disabled" or "cached" or "live"`

          用于网页搜索结果的来源。

          - `"disabled"`

          - `"cached"`

          - `"live"`

        - `type: "web_search"`

          对象的类型。始终为 `web_search`.

          - `"web_search"`

  - `created_at: number`

    会话创建时的 Unix 时间戳（以秒为单位）。

  - `environment: Environment`

    会话的执行环境。

    - `None object { type }`

      会话在不选择或预置执行环境的情况下与 CCA 通信。

      - `type: "none"`

        对象的类型。始终为 `none`.

        - `"none"`

    - `OpenAIHosted object { id, capability_directories, files, 5 more }`

      由OpenAI托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `files: array of HostedEnvironmentFile`

        环境中可用的文件，不包括其内容。

        - `HostedEnvironmentFileID object { id, file_id, path, 2 more }`

          从 OpenAI Files API 复制的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `file_id: string`

            已上传文件的 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "file_id"`

            对象的类型。始终为 `file_id`.

            - `"file_id"`

        - `Inline object { id, path, size_bytes, type }`

          创建会话时以内联方式提供的文件。

          - `id: string`

            文件在执行环境中的会话作用域 ID。

          - `path: string`

            文件在环境内的绝对路径。

          - `size_bytes: number`

            解码后的文件大小（以字节为单位）。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `network: object { access, allowed_domains }`

        环境的有效网络访问策略。

        - `access: "enabled" or "disabled" or "restricted"`

          环境的网络访问模式。

          - `"enabled"`

            允许不受限制的网络访问。

          - `"disabled"`

            禁用网络访问。

          - `"restricted"`

            仅允许访问已配置的域名。

        - `allowed_domains: array of string`

          在网络访问受限的情况下，环境可以访问的域名。

      - `packages: object { npm, python, system }`

        环境中安装的软件包。

        - `npm: array of string`

          在环境中全局安装的 npm 软件包。

        - `python: array of string`

          环境中安装的 Python 软件包。

        - `system: array of string`

          环境中安装的系统软件包。

      - `plugins: array of HostedPlugin`

        环境中安装的插件，不包括其归档内容。

        - `description: string`

          已安装插件的描述。

        - `name: string`

          已安装插件的名称。

        - `type: "inline"`

          对象的类型。始终为 `inline`.

          - `"inline"`

      - `skills: array of HostedSkill`

        环境中已安装的技能，不含其归档内容。

        - `HostedSkillReference object { description, name, skill_id, 2 more }`

          从 Skills API 安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `skill_id: string`

            所引用的技能 ID。

          - `type: "skill_reference"`

            对象的类型。始终为 `skill_reference`.

            - `"skill_reference"`

          - `version: string`

            为此会话安装的具体技能版本。

        - `Inline object { description, name, type }`

          从内联 ZIP 归档安装的技能。

          - `description: string`

            已安装技能的描述。

          - `name: string`

            已安装技能的名称。

          - `type: "inline"`

            对象的类型。始终为 `inline`.

            - `"inline"`

      - `type: "openai_hosted"`

        对象的类型。始终为 `openai_hosted`.

        - `"openai_hosted"`

    - `SelfHosted object { id, capability_directories, remote_url, 2 more }`

      由应用程序托管的环境。

      - `id: string`

        环境的公共 ID。

      - `capability_directories: array of string`

        包含向 智能体 暴露的能力的目录。

      - `remote_url: string`

        连接此环境时，将此 URL 原样传递给 `codex exec-server --remote` 。

      - `type: "self_hosted"`

        对象的类型。始终为 `self_hosted`.

        - `"self_hosted"`

      - `workspace_directory: string`

        环境内的绝对项目目录。默认为 `/workspace`.

  - `error: string or null`

    导致会话失败的错误（如果有）。

  - `last_active_at: number`

    会话最近活跃时的 Unix 时间戳（秒）。

  - `metadata: map[string]`

    附加到会话的自定义字符串键值对。

  - `object: "agent.session"`

    对象类型。始终为 `agent.session`.

    - `"agent.session"`

  - `required_actions: array of object { arguments, call_id, name, 2 more }  or object { environment_id, type }`

    在会话能够继续之前必须完成的动作。

    - `FunctionCall object { arguments, call_id, name, 2 more }`

      运行函数工具并提交其结果。

      - `arguments: unknown`

        模型提供的参数。

      - `call_id: string`

        提交函数结果时要包含的 ID。

      - `name: string`

        函数名称。

      - `turn_id: string`

        请求该函数调用的轮次 ID。

      - `type: "function_call"`

        对象的类型。始终为 `function_call`.

        - `"function_call"`

    - `EnvironmentConnection object { environment_id, type }`

      重新连接会话环境。

      - `environment_id: string`

        要重新连接的环境的 ID。

      - `type: "environment_connection"`

        对象的类型。始终为 `environment_connection`.

        - `"environment_connection"`

  - `status: "idle" or "in_progress" or "requires_action" or "failed"`

    会话的当前状态。

    - `"idle"`

      会话当前没有进行中的轮次，已准备好接收输入。托管环境可能仍在置备中。

    - `"in_progress"`

      会话正在处理一个轮次。

    - `"requires_action"`

      会话正在等待一个或多个必需操作。

    - `"failed"`

      会话失败。

  - `usage: TokenUsage or null`

    记录的会话或轮次的令牌用量。该用量为尽力而为的数据，可能会发生变化。

    - `input_tokens: number`

      智能体使用的输入令牌数量。

    - `input_tokens_details: object { cached_tokens }`

      智能体输入令牌用量的明细。

      - `cached_tokens: number`

        从提示缓存中检索到的输入令牌数量。

    - `output_tokens: number`

      智能体生成的输出令牌数量。

    - `output_tokens_details: object { reasoning_tokens }`

      智能体输出令牌用量的明细。

      - `reasoning_tokens: number`

        用于推理的输出令牌数量。

    - `total_tokens: number`

      智能体使用的输入和输出令牌总数。

  - `vault_ids: array of string`

    提供给会话的保管库的 ID。

- `type: "agent.session.failed"`

  对象的类型。始终为 `agent.session.failed`.

  - `"agent.session.failed"`

### 示例

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

## 智能体.session.environment.pending

在准备会话环境时发出。

### Schema

Schema name: `SessionEventAgentSessionEnvironmentPending`

- `environment: AgentSessionEnvironmentState`

  当前环境状态。

  - `id: string`

    环境的公共 ID。

  - `error: object { code, message, type }  or null`

    在准备会话环境时报告的错误。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误类型。

  - `status: "pending" or "ready" or "connected" or 2 more`

    环境的连接状态。

    - `"pending"`

      环境正在准备中。

    - `"ready"`

      环境已准备好连接。

    - `"connected"`

      环境已连接。

    - `"disconnected"`

      环境已断开连接。

    - `"failed"`

      环境连接失败。

  - `type: string`

    环境类型。

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.environment.pending"`

  对象的类型。始终为 `agent.session.environment.pending`.

  - `"agent.session.environment.pending"`

### 示例

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

## 智能体.session.environment.connected

在会话环境连接时发出。

### Schema

Schema name: `SessionEventAgentSessionEnvironmentConnected`

- `environment: AgentSessionEnvironmentState`

  当前环境状态。

  - `id: string`

    环境的公共 ID。

  - `error: object { code, message, type }  or null`

    在准备会话环境时报告的错误。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误类型。

  - `status: "pending" or "ready" or "connected" or 2 more`

    环境的连接状态。

    - `"pending"`

      环境正在准备中。

    - `"ready"`

      环境已准备好连接。

    - `"connected"`

      环境已连接。

    - `"disconnected"`

      环境已断开连接。

    - `"failed"`

      环境连接失败。

  - `type: string`

    环境类型。

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.environment.connected"`

  对象的类型。始终为 `agent.session.environment.connected`.

  - `"agent.session.environment.connected"`

### 示例

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

## 智能体.session.environment.disconnected

当会话环境断开连接时发出。

### Schema

Schema name: `SessionEventAgentSessionEnvironmentDisconnected`

- `environment: AgentSessionEnvironmentState`

  当前环境状态。

  - `id: string`

    环境的公共 ID。

  - `error: object { code, message, type }  or null`

    在准备会话环境时报告的错误。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误类型。

  - `status: "pending" or "ready" or "connected" or 2 more`

    环境的连接状态。

    - `"pending"`

      环境正在准备中。

    - `"ready"`

      环境已准备好连接。

    - `"connected"`

      环境已连接。

    - `"disconnected"`

      环境已断开连接。

    - `"failed"`

      环境连接失败。

  - `type: string`

    环境类型。

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.environment.disconnected"`

  对象的类型。始终为 `agent.session.environment.disconnected`.

  - `"agent.session.environment.disconnected"`

### 示例

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

## 智能体.session.environment.failed

当会话环境失败时触发。

### Schema

Schema name: `SessionEventAgentSessionEnvironmentFailed`

- `environment: AgentSessionEnvironmentState`

  当前环境状态。

  - `id: string`

    环境的公共 ID。

  - `error: object { code, message, type }  or null`

    在准备会话环境时报告的错误。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `type: string`

      错误类型。

  - `status: "pending" or "ready" or "connected" or 2 more`

    环境的连接状态。

    - `"pending"`

      环境正在准备中。

    - `"ready"`

      环境已准备好连接。

    - `"connected"`

      环境已连接。

    - `"disconnected"`

      环境已断开连接。

    - `"failed"`

      环境连接失败。

  - `type: string`

    环境类型。

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.environment.failed"`

  对象的类型。始终为 `agent.session.environment.failed`.

  - `"agent.session.environment.failed"`

### 示例

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

## 智能体.session.subagent.created

在创建子智能体时发出。

### Schema

Schema name: `SessionEventAgentSessionSubagentCreated`

- `event_id: string`

  事件的唯一 ID。

- `subagent: Subagent`

  已创建的子智能体。

  - `id: string`

    子智能体的 ID。

  - `closed_at: number or null`

    子智能体关闭时的 Unix 时间戳（以秒为单位）。在处于活动状态时（包括恢复之后）为 null。

  - `instructions: array of AgentContent or null`

    初始任务内容，若不可用则为 null。当仅提供预览时，文本中可能包含图像或音频的占位符。

    - `OutputText object { text, type }`

      由智能体生成的文本内容片段。

      - `text: string`

        由智能体生成的文本。

      - `type: "output_text"`

        内容类型。始终为 `output_text`.

        - `"output_text"`

    - `EncryptedContent object { encrypted_content, type }`

      在智能体之间交换的加密内容。

      - `encrypted_content: string`

        加密内容载荷。

      - `type: "encrypted_content"`

        内容类型。始终为 `encrypted_content`.

        - `"encrypted_content"`

  - `name: string or null`

    运行器分配的昵称，若不可用则为 null。

  - `object: "agent.session.subagent"`

    对象类型。始终为 `agent.session.subagent`.

    - `"agent.session.subagent"`

  - `opened_at: number`

    子智能体首次打开时的 Unix 时间戳（以秒为单位）。恢复操作不会更改该值。

  - `parent_agent_id: string`

    创建该子智能体的智能体的 ID。

  - `session_id: string`

    拥有该子智能体的会话的 ID。

  - `status: "active" or "closed"`

    子智能体当前的状态。

    - `"active"`

      子智能体仍然可用，包括在两轮之间的空闲期间。

    - `"closed"`

      子智能体已关闭。

- `type: "agent.session.subagent.created"`

  对象的类型。始终为 `agent.session.subagent.created`.

  - `"agent.session.subagent.created"`

### 示例

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

## 智能体.session.subagent.active

当已关闭的子智能体成功恢复时发出。

### Schema

Schema name: `SessionEventAgentSessionSubagentActive`

- `event_id: string`

  事件的唯一 ID。

- `subagent: Subagent`

  恢复执行的子智能体。

  - `id: string`

    子智能体的 ID。

  - `closed_at: number or null`

    子智能体关闭时的 Unix 时间戳（以秒为单位）。在处于活动状态时（包括恢复之后）为 null。

  - `instructions: array of AgentContent or null`

    初始任务内容，若不可用则为 null。当仅提供预览时，文本中可能包含图像或音频的占位符。

    - `OutputText object { text, type }`

      由智能体生成的文本内容片段。

      - `text: string`

        由智能体生成的文本。

      - `type: "output_text"`

        内容类型。始终为 `output_text`.

        - `"output_text"`

    - `EncryptedContent object { encrypted_content, type }`

      在智能体之间交换的加密内容。

      - `encrypted_content: string`

        加密内容载荷。

      - `type: "encrypted_content"`

        内容类型。始终为 `encrypted_content`.

        - `"encrypted_content"`

  - `name: string or null`

    运行器分配的昵称，若不可用则为 null。

  - `object: "agent.session.subagent"`

    对象类型。始终为 `agent.session.subagent`.

    - `"agent.session.subagent"`

  - `opened_at: number`

    子智能体首次打开时的 Unix 时间戳（以秒为单位）。恢复操作不会更改该值。

  - `parent_agent_id: string`

    创建该子智能体的智能体的 ID。

  - `session_id: string`

    拥有该子智能体的会话的 ID。

  - `status: "active" or "closed"`

    子智能体当前的状态。

    - `"active"`

      子智能体仍然可用，包括在两轮之间的空闲期间。

    - `"closed"`

      子智能体已关闭。

- `type: "agent.session.subagent.active"`

  对象的类型。始终为 `agent.session.subagent.active`.

  - `"agent.session.subagent.active"`

### 示例

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

## 智能体.session.subagent.closed

当子智能体被关闭时发出。

### Schema

Schema name: `SessionEventAgentSessionSubagentClosed`

- `event_id: string`

  事件的唯一 ID。

- `subagent: Subagent`

  已关闭的子智能体。

  - `id: string`

    子智能体的 ID。

  - `closed_at: number or null`

    子智能体关闭时的 Unix 时间戳（以秒为单位）。在处于活动状态时（包括恢复之后）为 null。

  - `instructions: array of AgentContent or null`

    初始任务内容，若不可用则为 null。当仅提供预览时，文本中可能包含图像或音频的占位符。

    - `OutputText object { text, type }`

      由智能体生成的文本内容片段。

      - `text: string`

        由智能体生成的文本。

      - `type: "output_text"`

        内容类型。始终为 `output_text`.

        - `"output_text"`

    - `EncryptedContent object { encrypted_content, type }`

      在智能体之间交换的加密内容。

      - `encrypted_content: string`

        加密内容载荷。

      - `type: "encrypted_content"`

        内容类型。始终为 `encrypted_content`.

        - `"encrypted_content"`

  - `name: string or null`

    运行器分配的昵称，若不可用则为 null。

  - `object: "agent.session.subagent"`

    对象类型。始终为 `agent.session.subagent`.

    - `"agent.session.subagent"`

  - `opened_at: number`

    子智能体首次打开时的 Unix 时间戳（以秒为单位）。恢复操作不会更改该值。

  - `parent_agent_id: string`

    创建该子智能体的智能体的 ID。

  - `session_id: string`

    拥有该子智能体的会话的 ID。

  - `status: "active" or "closed"`

    子智能体当前的状态。

    - `"active"`

      子智能体仍然可用，包括在两轮之间的空闲期间。

    - `"closed"`

      子智能体已关闭。

- `type: "agent.session.subagent.closed"`

  对象的类型。始终为 `agent.session.subagent.closed`.

  - `"agent.session.subagent.closed"`

### 示例

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

## 智能体.session.turn.item.done

当一个输出项完成时触发。

### Schema

Schema name: `SessionEventAgentSessionTurnItemDone`

- `event_id: string`

  事件的唯一 ID。

- `item: AgentOutputItem`

  已完成输出项。

  - `AgentSessionAssistantMessage object { id, content, phase, 4 more }`

    由智能体产生的助手消息。

    - `id: string`

      消息的 ID。

    - `content: array of OutputText`

      消息内容。

      - `text: string`

        由智能体生成的文本。

      - `type: "output_text"`

        内容类型。始终为 `output_text`.

        - `"output_text"`

    - `phase: "commentary" or "final_answer" or null`

      助手消息的阶段。

      - `"commentary"`

        智能体工作过程中产生的评论。

      - `"final_answer"`

        智能体的最终回答。

    - `role: "assistant"`

      消息作者的角色。始终为 `assistant`.

      - `"assistant"`

    - `status: AgentOutputItemStatus`

      消息的状态。

      - `"in_progress"`

        该条目正在进行中。

      - `"completed"`

        该条目已完成。

      - `"incomplete"`

        该条目在完成前已停止。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "message"`

      条目类型。始终为 `message`.

      - `"message"`

  - `AgentReasoningItem object { id, status, summary, 2 more }`

    由智能体生成的推理项。

    - `id: string`

      推理项的 ID。

    - `status: AgentOutputItemStatus or null`

      智能体输出项的状态。

    - `summary: array of SummaryText`

      由智能体生成的推理摘要。

      - `text: string`

        推理摘要文本。

      - `type: "summary_text"`

        内容类型。始终为 `summary_text`.

        - `"summary_text"`

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "reasoning"`

      条目类型。始终为 `reasoning`.

      - `"reasoning"`

  - `AgentFunctionCallItem object { id, arguments, call_id, 4 more }`

    由智能体发起的函数调用。

    - `id: string`

      函数调用项的 ID。

    - `arguments: unknown`

      传递给函数的参数。

    - `call_id: string`

      用于提交函数结果的 ID。

    - `name: string`

      要调用的函数名称。

    - `status: AgentFunctionCallStatus`

      函数调用的状态。

      - `"in_progress"`

        调用正在进行中。

      - `"completed"`

        调用已成功完成。

      - `"failed"`

        调用失败。

      - `"incomplete"`

        调用在完成前已停止。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "function_call"`

      条目类型。始终为 `function_call`.

      - `"function_call"`

  - `AgentMcpCallItem object { id, arguments, error, 6 more }`

    对 MCP 服务器上某个工具的调用。

    - `id: string`

      MCP 调用项的 ID。

    - `arguments: unknown`

      传递给 MCP 工具的参数。

    - `error: unknown`

      MCP 工具返回的错误（如果有）。

    - `name: string`

      MCP 工具的名称。

    - `output: unknown`

      MCP 工具返回的输出（如果有）。

    - `server_label: string`

      MCP 服务器的标签。

    - `status: AgentFunctionCallStatus`

      MCP 工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "mcp_call"`

      条目类型。始终为 `mcp_call`.

      - `"mcp_call"`

  - `AgentWebSearchCallItem object { id, action, status, 2 more }`

    由智能体发起的网页搜索调用。

    - `id: string`

      网页搜索调用的 ID。

    - `action: WebSearchAction or null`

      由网页搜索工具执行的操作。

      - `Search object { queries, query, type }`

        搜索查询或一组搜索查询。

        - `queries: array of string or null`

          当使用了多个查询时的搜索查询列表。

        - `query: string or null`

          当使用单个查询时的搜索查询。

        - `type: "search"`

          对象的类型。始终为 `search`.

          - `"search"`

      - `OpenPage object { type, url }`

        打开网页。

        - `type: "open_page"`

          对象的类型。始终为 `open_page`.

          - `"open_page"`

        - `url: string or null`

          已打开页面的 URL。

      - `FindInPage object { pattern, type, url }`

        在网页中查找文本。

        - `pattern: string or null`

          搜索的文本模式。

        - `type: "find_in_page"`

          对象的类型。始终为 `find_in_page`.

          - `"find_in_page"`

        - `url: string or null`

          已搜索页面的 URL。

      - `Other object { type }`

        另一个网页搜索操作。

        - `type: "other"`

          对象的类型。始终为 `other`.

          - `"other"`

    - `status: AgentOutputItemStatus`

      网页搜索调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "web_search_call"`

      条目类型。始终为 `web_search_call`.

      - `"web_search_call"`

  - `AgentCommandExecutionItem object { id, command, cwd, 6 more }`

    由智能体产生的命令执行。

    - `id: string`

      命令执行项的 ID。

    - `command: string`

      已执行的命令。

    - `cwd: string or null`

      用于执行命令的工作目录。

    - `duration_ms: number or null`

      命令执行时长（毫秒）。

    - `exit_code: number or null`

      进程退出码（若命令已完成）。

    - `output: string or null`

      命令输出（如果有）。

    - `status: AgentFunctionCallStatus`

      命令执行的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "command_execution"`

      条目类型。始终为 `command_execution`.

      - `"command_execution"`

  - `AgentCreateSubagentCallItem object { id, agent_id, content, 5 more }`

    派生子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `agent_id: string`

      请求派生子智能体的智能体的 ID。

    - `content: array of AgentContent`

      分配给被派生智能体的任务。

      - `OutputText object { text, type }`

        由智能体生成的文本内容片段。

        - `text: string`

          由智能体生成的文本。

        - `type: "output_text"`

          内容类型。始终为 `output_text`.

      - `EncryptedContent object { encrypted_content, type }`

        在智能体之间交换的加密内容。

        - `encrypted_content: string`

          加密内容载荷。

        - `type: "encrypted_content"`

          内容类型。始终为 `encrypted_content`.

          - `"encrypted_content"`

    - `model: string or null`

      被派生智能体所使用的模型。

    - `reasoning_effort: string or null`

      被派生智能体所使用的推理力度。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "create_subagent_call"`

      条目类型。始终为 `create_subagent_call`.

      - `"create_subagent_call"`

        当前的公共项类型。

  - `AgentSendSubagentInputCallItem object { id, content, recipient_agent_id, 4 more }`

    向其他智能体发送输入的请求。

    - `id: string`

      工具调用项的 ID。

    - `content: array of AgentContent`

      发送给接收方智能体的输入。

      - `OutputText object { text, type }`

        由智能体生成的文本内容片段。

      - `EncryptedContent object { encrypted_content, type }`

        在智能体之间交换的加密内容。

    - `recipient_agent_id: string`

      接收输入的智能体的 ID。

    - `sender_agent_id: string`

      发送输入的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "send_subagent_input_call"`

      条目类型。始终为 `send_subagent_input_call`.

      - `"send_subagent_input_call"`

        当前的公共项类型。

  - `AgentResumeSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    恢复子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_id: string`

      要恢复的智能体的 ID。

    - `sender_agent_id: string`

      请求恢复的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "resume_subagent_call"`

      条目类型。始终为 `resume_subagent_call`.

      - `"resume_subagent_call"`

        当前的公共项类型。

  - `AgentWaitForSubagentsCallItem object { id, recipient_agent_ids, sender_agent_id, 3 more }`

    等待一个或多个子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_ids: array of string`

      要等待的智能体的 ID。

    - `sender_agent_id: string`

      正在等待结果的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "wait_for_subagents_call"`

      条目类型。始终为 `wait_for_subagents_call`.

      - `"wait_for_subagents_call"`

        当前的公共项类型。

  - `AgentInterruptSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    中断子智能体当前轮次的请求。子智能体仍处于可用状态。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_id: string`

      要中断的智能体的 ID。

    - `sender_agent_id: string`

      发起中断请求的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "interrupt_subagent_call"`

      条目类型。始终为 `interrupt_subagent_call`.

      - `"interrupt_subagent_call"`

        当前的公共项类型。

  - `AgentCloseSubagentCallItem object { id, recipient_agent_id, sender_agent_id, 3 more }`

    关闭子智能体的请求。

    - `id: string`

      工具调用项的 ID。

    - `recipient_agent_id: string`

      要关闭的智能体的 ID。

    - `sender_agent_id: string`

      发起关闭请求的智能体的 ID。

    - `status: AgentFunctionCallStatus`

      工具调用的状态。

    - `turn_id: string`

      包含此条目的对话轮次的 ID。

    - `type: "close_subagent_call"`

      条目类型。始终为 `close_subagent_call`.

      - `"close_subagent_call"`

        当前的公共项类型。

- `output_index: number`

  输出项在回合输出中的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.item.done"`

  对象的类型。始终为 `agent.session.turn.item.done`.

  - `"agent.session.turn.item.done"`

### 示例

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

## 智能体.session.turn.content_part.added

当 output 文本内容片段被添加时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnContentPartAdded`

- `content_index: number`

  消息中内容部分的索引。

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  消息项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `part: OutputText`

  初始内容部分。

  - `text: string`

    由智能体生成的文本。

  - `type: "output_text"`

    内容类型。始终为 `output_text`.

    - `"output_text"`

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.content_part.added"`

  对象的类型。始终为 `agent.session.turn.content_part.added`.

  - `"agent.session.turn.content_part.added"`

### 示例

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

## 智能体.session.turn.content_part.done

在某个输出内容部分完成时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnContentPartDone`

- `content_index: number`

  消息中内容部分的索引。

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  消息项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `part: OutputText`

  已完成的内容部分。

  - `text: string`

    由智能体生成的文本。

  - `type: "output_text"`

    内容类型。始终为 `output_text`.

    - `"output_text"`

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.content_part.done"`

  对象的类型。始终为 `agent.session.turn.content_part.done`.

  - `"agent.session.turn.content_part.done"`

### 示例

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

## 智能体.session.turn.output_text.delta

在文本被追加到输出文本内容部分时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnOutputTextDelta`

- `content_index: number`

  消息中内容部分的索引。

- `delta: string`

  已追加的文本。

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  消息项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.output_text.delta"`

  对象的类型。始终为 `agent.session.turn.output_text.delta`.

  - `"agent.session.turn.output_text.delta"`

### 示例

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

## 智能体.session.turn.output_text.done

在某个输出文本内容部分完成时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnOutputTextDone`

- `content_index: number`

  消息中内容部分的索引。

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  消息项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `text: string`

  完整的输出文本。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.output_text.done"`

  对象的类型。始终为 `agent.session.turn.output_text.done`.

  - `"agent.session.turn.output_text.done"`

### 示例

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

## 智能体.session.turn.reasoning_summary_part.added

在添加推理摘要内容部分时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryPartAdded`

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  推理项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `part: SummaryText`

  初始摘要部分。

  - `text: string`

    推理摘要文本。

  - `type: "summary_text"`

    内容类型。始终为 `summary_text`.

    - `"summary_text"`

- `session_id: string`

  与此事件关联的会话 ID。

- `summary_index: number`

  摘要内容部分的索引。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.reasoning_summary_part.added"`

  对象的类型。始终为 `agent.session.turn.reasoning_summary_part.added`.

  - `"agent.session.turn.reasoning_summary_part.added"`

### 示例

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

## 智能体.session.turn.reasoning_summary_part.done

在推理摘要部分完成时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryPartDone`

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  推理项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `part: SummaryText`

  已完成的摘要部分。

  - `text: string`

    推理摘要文本。

  - `type: "summary_text"`

    内容类型。始终为 `summary_text`.

    - `"summary_text"`

- `session_id: string`

  与此事件关联的会话 ID。

- `status: "incomplete" or null`

  呈现方式 `incomplete` 当摘要生成被中断时。

  - `"incomplete"`

- `summary_index: number`

  摘要部分的索引。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.reasoning_summary_part.done"`

  对象的类型。始终为 `agent.session.turn.reasoning_summary_part.done`.

  - `"agent.session.turn.reasoning_summary_part.done"`

### 示例

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

## 智能体.session.turn.reasoning_summary_text.delta

当文本被追加到推理摘要时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryTextDelta`

- `delta: string`

  已附加的摘要文本。

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  推理项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `summary_index: number`

  摘要内容部分的索引。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.reasoning_summary_text.delta"`

  对象的类型。始终为 `agent.session.turn.reasoning_summary_text.delta`.

  - `"agent.session.turn.reasoning_summary_text.delta"`

### 示例

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

## 智能体.session.turn.reasoning_summary_text.done

当推理摘要内容部分完成时发出。

### Schema

Schema name: `SessionEventAgentSessionTurnReasoningSummaryTextDone`

- `event_id: string`

  事件的唯一 ID。

- `item_id: string`

  推理项的 ID。

- `output_index: number`

  该轮输出中项的索引。

- `session_id: string`

  与此事件关联的会话 ID。

- `summary_index: number`

  摘要内容部分的索引。

- `text: string`

  完整的推理摘要文本。

- `turn_id: string or null`

  在适用的情况下，与此事件关联的轮次 ID。

- `type: "agent.session.turn.reasoning_summary_text.done"`

  对象的类型。始终为 `agent.session.turn.reasoning_summary_text.done`.

  - `"agent.session.turn.reasoning_summary_text.done"`

### 示例

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

当某个轮次或会话失败时触发。

### Schema

Schema name: `SessionEventError`

- `error: SessionError`

  发生的错误。

  - `code: string or null`

    机器可读的错误代码（如果有）。

  - `message: string`

    面向用户的、可安全展示的错误说明。

  - `param: string or null`

    与错误关联的请求参数（如果有）。

  - `type: string`

    错误类型。

- `event_id: string`

  事件的唯一 ID。

- `session_id: string`

  与此事件关联的会话 ID。

- `type: "error"`

  对象的类型。始终为 `error`.

  - `"error"`

### 示例

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
