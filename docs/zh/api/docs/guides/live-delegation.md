# GPT-Live 中的交接与工具

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加以下后缀即可获取 Markdown 版本的文档页： `.md` 。

GPT-Live 将推理和工具使用委托给后端，同时它负责管理口语对话。后端工作可以由已配置的 Responses 模型运行，也可以在客户端委托模式下由你的应用操作的任意模型、智能体或服务运行。无论哪种模式，权限、确认、业务记录和任务状态都由你的应用拥有。

详细了解如何 [在提示指南中引导实时模型进行委托和工具使用](https://developers.openai.com/api/docs/guides/live-prompting#delegation) 。

本页的事件示例使用了 `connection`，它是来自 [连接指南](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。中已连接的主 Live WebSocket 或边带连接。在主连接上，需先等待 `session.started` 再调用事件辅助方法。已附加的边带连接已属于一个正在运行的会话。





## 选择委托模式

使用 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)**,GPT-Live 会调用你选择的 Responses 模型,提供会话上下文,并将后端结果返回到实时会话。使用 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)**,你的应用程序负责准备上下文、运行 智能体 或 工作流,然后将结果发送回 GPT-Live。

如果你希望 GPT-Live 管理请求,请从 Responses 委托开始;需要运行自己的 工作流 或在结果发送给 GPT-Live 之前进行审阅时,请选择客户端委托。




| 考量                 | 在以下情况下，倾向使用 Responses 委托…                                                                           | 在以下情况下，倾向使用客户端委托…                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **实施工作量**     | 你希望由 GPT-Live 准备后端请求、管理连接，并将结果返回给对话。 | 你希望自行构建并运维这些部分。                                                      |
| **审阅后端结果** | 后端输出可直接返回给 GPT-Live。                                                            | 应用必须在结果到达 GPT-Live 之前，对其进行校验、脱敏、合并或丢弃。           |
| **后端能力**      | 你的 工作流 符合 GPT-Live 支持的 Responses 设置和工具。                                 | 你需要使用托管配置之外的其他后端、多个模型，或超出 API 能力的特性。          |
| **上下文归属**         | 由 GPT-Live 提供的对话上下文符合你的应用需求。                                       | 你需要精确选择每次后端请求所接收的历史记录、记忆和应用状态。    |
| **执行策略**          | 已配置的模型与工具循环足以满足任务需求。                                                            | 你需要在后端各步骤之间进行自定义的代码与模型路由、回退、检查点或预算控制。 |




例如，一个旅行助手可以将航班状态问题发送给航空公司服务，并将行程变更发送给另一个智能体。由你的应用决定调用哪个后端，以及将哪个经过验证的结果返回给 GPT-Live。

在两种模式下，你的应用都会跟踪任务进度，并在运行自定义工具前检查权限和必需的用户确认。GPT-Live 可以在你的应用审查后端结果的同时继续说话。如果你的应用必须控制用户听到音频的时机，请添加 [播放控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).

客户端委托还需要你的应用 [维护对话上下文](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application)。委托事件包含的是元数据，而不是任务文本；请使用转录事件和应用状态来准备后端请求。

在针对你自己的工作负载评估语音智能体时，比较延迟、任务成功率和成本 [评估你的语音 智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)。有关针对你现有架构的具体指南，请参阅 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration#choose-your-delegation-mode).

在创建会话时选择模式；要更改模式，请启动一个新会话。

## 配置 Responses 委托

在创建 Live 会话时添加此委托配置 [创建你的 Live 会话](https://developers.openai.com/api/docs/guides/live). 独立于语音模型选择 Responses 模型：

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {
    "model": "gpt-live-1",
    "delegation": {
        "type": "responses",
        "responses": {
            "model": "gpt-6-luna",
            "instructions": "[Your backend prompt]",
        },
    },
}
```


从 [`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna)，开始,或尝试使用 [`gpt-6-sol`](https://developers.openai.com/api/docs/models/gpt-6-sol) 来处理更复杂的后端任务。在你的任务上比较答案质量和延迟,再选择后端模型。

在 `delegation.responses.tools`。中注册支持的工具。设置 `delegation.responses.tool_choice` 为 `"auto"` 以允许后端选择工具, `"required"` 以要求进行工具调用,或 `"none"` 以禁用工具调用。你也可以选择一个具名函数。

设置 `delegation.responses.parallel_tool_calls` 为 `true` 以允许在一次响应中进行多次工具调用,或 `false` 以进行顺序调用。你的应用会执行自定义函数并检查它们的依赖关系与所需审批。这些设置在 GPT-Live 委托之后生效;使用 [live prompt](https://developers.openai.com/api/docs/guides/live-prompting#delegation) 来指导何时应进行委托。

Responses 配置需要在创建时指定一个后端 `model` 。它支持 `function` definitions 和 `web_search` entries in `tools`. It also exposes `max_output_tokens` (at least 16 when set), `service_tier`, and the `reasoning` and `text` settings supported by the selected backend model. See [Reduce backend latency](#reduce-backend-latency) for settings you can tune.

If [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) is available for your model and project, consider it for latency-sensitive calls. For GPT-Live, select it with `delegation.responses.service_tier: "priority"`.

Send `session.update` with changes in `session.delegation.responses` to update the backend model, instructions, tools, `tool_choice`, or other supported settings during the conversation. Omitted settings keep their current values.

To switch between Responses and client delegation, create a new Live session. Updating `delegation` 为 `null` selects client mode, so sending it to a running Responses session fails with `immutable_field_update`.

These settings use familiar Responses concepts, but Live supports a subset of the standalone Responses API. Live supplies conversation context and initiates delegated work. Configure the backend through the session; the Live `response.create` command uses that configuration and does not accept a standalone Responses request body.

## 在你的应用中引导实时对话

Responses 委托负责管理后端 工作流，但你的应用仍可以直接向 GPT-Live 模型发送上下文。如果你通过旁路 WebSocket 或主事件连接监听该调用，可以使用 `session.instructions.append`, `session.thinking.append`，或者 `session.commentary.append` 配合 `delegation_id: null`。例如，基于转录的 护栏 可以追加一条指令来引导对话方向。它用于引导实时模型，但不会修改 Responses 后端提示，也不会取消已经进行中的任务。

## 处理 Responses 委托

对于基于 Responses 的工作， `session.delegation.created` 具有 `target: "responses"` 以及一个 `response_id`。后续的 Responses 事件会出现在一个 `response.event` 封装内：

```json
{
  "type": "response.event",
  "event_id": "event_response_1",
  "delegation_id": "item_9tA2cB6n2V8c4X1z7Q5r9",
  "event": {
    "type": "response.output_text.delta",
    "sequence_number": 4,
    "item_id": "msg_123",
    "output_index": 0,
    "content_index": 0,
    "delta": "The forecast is",
    "logprobs": []
  }
}
```

当顶层事件类型为 `response.event`，时，按 `envelope.event.type`。进行分发。保存外层 `delegation_id` 以将后端事件与其委托关联起来。你的处理器还可能收到此处未展示的嵌套 Responses 生命周期事件。

实时语音和委托工作会独立进行。后端响应的完成本身并不代表用户已听到答案。请使用 Live 输出的转录文本和音频来表示交互中的语音部分。





### 运行自定义函数并返回其结果

从嵌套的 `response.output_item.done` 事件中读取已完成的函数调用。已完成的函数项包含 `call_id`, `name`，而 `arguments`；仅靠 arguments-done 事件不足以识别此次调用。

追踪来自嵌套的 `response.created` 的响应 ID，与外部的 `delegation_id`。一起保存。从 `response.output_item.done`，中收集该响应的函数调用，并据此判断在继续之前需要提交哪些工具结果。

被转发的生命周期事件，包括 `response.completed`，包含 `response.output: []` 即使在需要函数调用结果时也是如此。这些事件也具有空 `tools` 数组， `instructions: null`，且没有 `input` 字段。请阅读各个输出项事件以获取函数调用信息。

执行授权操作后，将结果作为 Responses 项目追加：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.item.create",
    event_id: "tool_result_1",
    item: {
      type: "function_call_output",
      call_id: "call_123",
      output: '{"status":"confirmed","order_id":"order_123"}',
    },
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.responses.response_input_item_param import ResponseInputItemParam


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    item: ResponseInputItemParam = {
        "type": "function_call_output",
        "call_id": "call_123",
        "output": '{"status":"confirmed","order_id":"order_123"}',
    }
    await connection.response.item.create(
        event_id="tool_result_1",
        item=item,
    )
```


然后显式延续响应：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.create",
    event_id: "continue_1",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.response.create(
        event_id="continue_1",
    )
```


发送一个 `response.item.create` 结果用于每个待处理的函数调用，然后发送 `response.create` 以延续后端响应。 `response.item.create` 没有单独的成功确认；继续处理错误以及嵌套的 Responses 生命周期事件。

两条命令都需要 Responses 委托。实时 `response.create` 命令使用会话中存储的后端配置。使用上方所示的事件负载，并通过会话配置后端模型和其他设置。

  

  


## 配置客户端委派

设置 `delegation` 当 [创建你的 Live 会话](https://developers.openai.com/api/docs/guides/live):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {"model": "gpt-live-1", "delegation": {"type": "client"}}
```


你的应用负责配置和运行后端：选择其模型或服务、指令、工具以及路由。如果后端使用的是 Responses API，则需要在你的应用 Responses 请求中设置其模型和工具。

当 GPT-Live 请求协助时，根据你保存的对话历史和当前任务状态构建后端请求。检查权限和所需的确认，执行工作，并选择要返回的结果。

## 在应用中保留对话上下文

对于客户端委托， **由你自己收集转录文本并维护当前任务状态**.

监听 `session.input_transcript.delta` and `session.output_transcript.delta`。事件。这些事件在 `delta`，中包含转录文本，以及 `start_ms` and `end_ms` 时间戳。请保留足够的历史记录，以便理解简短的回复（例如“好”）、更正（例如“星期四，不是星期五”）以及之前提供的细节。转录片段并非完整的用户轮次，且转录可能存在错误。

独立的 `session.delegation.created` 事件包含一个 `offset_ms` 时间戳和委托元数据，包括 `delegation.id` and `delegation.target`。它不 **包含** 用户的发言或任务文本。请结合转录事件和应用状态来推断用户的意图。请保存 `delegation.id` ，以便将更新与该请求进行匹配。

在后端保留较长的记录和完整的工具输出。如果创建了新的会话，请从你的应用中恢复相关上下文，并在重复任何操作前检查哪些动作已经执行过。

### 接收客户端委托

`session.delegation.created` 用于标识一次委托：

```json
{
  "type": "session.delegation.created",
  "event_id": "event_delegation",
  "offset_ms": 1000,
  "delegation": {
    "id": "item_9tA2bF3h7K9m2P5q8R1s4",
    "type": "delegation",
    "target": "client"
  }
}
```

保存 `event.delegation.id` 并在关于此任务的更新中原样包含它。

使用该 ID 返回结果：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.commentary.append",
    event_id: "result_123",
    delegation_id: "item_9tA2bF3h7K9m2P5q8R1s4",
    content: "The order shipped today and should arrive tomorrow.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.commentary.append(
        event_id="result_123",
        delegation_id="item_9tA2bF3h7K9m2P5q8R1s4",
        content="The order shipped today and should arrive tomorrow.",
    )
```


使用 `session.commentary.append` 来发送 GPT-Live 应朗读播报的结果，它经过训练会对文本进行意译。使用 `session.thinking.append` 来发送可在后续回复中复用的事实或进度信息，这些信息在到达时不会被直接读出。你可以使用同一个客户端委托 ID 发送多条更新。

参见 [发送正确类型的更新](#send-the-right-kind-of-update) 了解内容上限、必填字段和确认时序。

  




## 从你现有的后端提示开始

将你已有的文本智能体提示作为起点。保留其任务指令和业务规则在后端，并调整那些假定为文本聊天或直接控制语音的指令。说明如何处理语音转录并返回有用的结果。在你的应用中强制执行权限和必需的确认。

```text
## Voice conversation context
You are helping an assistant in a live voice conversation. Transcripts
can contain mistakes, unfinished phrases, and later corrections. Use
the latest context and verified records. If a needed detail is still
unclear, ask for that detail instead of guessing.

## Task instructions
[Your task instructions, business rules, available tools,
and confirmation requirements.]

## Return the result
Return the relevant facts, the task's current status, and the next step.
Report an action as complete after the tool or service confirms success.
If the outcome is unclear, state that and explain what needs to be checked.
```

将大型结构化负载、冗长的工具输出以及用于展示的 Markdown 保存在后端。把相关事实交给 GPT-Live，让它自行选择如何表达。简洁的工具结果无需再调用一次模型来改写为语音版本。

采用客户端委托时， [直接把结果返回给 GPT-Live](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation)。采用 Responses 委托时，遵循 [function-result 流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call) 以继续后端工作。

## 发送恰当类型的更新

根据 GPT-Live 应如何使用内容来选择事件：

| 你想要发送的内容                                                                                       | 事件                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 面向实时模型的系统级指令，例如问候、披露或停止说话的方向 | `session.instructions.append` |
| 用于内部推理的信息，不会在 append 时说出，但可用于回答相关的用户问题             | `session.thinking.append`     |
| 模型应大声说出的信息，对附加的文本进行改述                                    | `session.commentary.append`   |

三者都使用纯字符串 `content`，每次追加最多 500 个 token。包含 `delegation_id`：使用原始的客户端委托 ID 来更新该任务，或 `null` 用于一般的会话上下文。非空 ID 必须指向已知的客户端委托。指令仍然作用于当前会话；ID 不会将它们变成独立的后端提示。

追加的指令可以打断模型当前正在生成的语音或行为。当应用需要重新引导对话时使用它；并在应用状态中强制执行任何相关的工具或动作拦截。

对于客户端管理任务期间静默推进的场景：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.thinking.append",
    event_id: "availability_progress",
    delegation_id: "item_123",
    content: "Checking Thursday availability. No appointment has been booked.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.thinking.append(
        event_id="availability_progress",
        delegation_id="item_123",
        content="Checking Thursday availability. No appointment has been booked.",
    )
```


对于已确认的预订，发送用户应听到的结果：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.commentary.append",
    event_id: "appointment_result",
    delegation_id: "item_123",
    content: "Your appointment is confirmed for Thursday at 2:00 PM",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.commentary.append(
        event_id="appointment_result",
        delegation_id="item_123",
        content="Your appointment is confirmed for Thursday at 2:00 PM",
    )
```


仅在该预订实际成功后发送该结果。对于会话级别的指令，请使用 `session.instructions.append` 配合 `delegation_id: null`.

例如，当你的应用根据其护栏阻止了一个请求后，可以这样重新引导对话：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.instructions.append",
    event_id: "guardrail_block_17",
    delegation_id: null,
    content:
      "Stop speaking about that request. Briefly explain that you cannot help with it, then wait for the user.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.instructions.append(
        event_id="guardrail_block_17",
        delegation_id=None,
        content=(
            "Stop speaking about that request. Briefly explain that you cannot help "
            "with it, then wait for the user."
        ),
    )
```


该指令不会取消后端工作。 [在应用中阻止受影响的动作并处理任何已在运行的工作](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 。

对应的确认消息是 `session.thinking.appended`, `session.commentary.appended`，而 `session.instructions.appended`。将其 `client_event_id` 与你的发送 `event_id`。进行匹配。确认消息会等待估算的上下文注入时机，而不是等到语音或播放结束。参见 [当上下文到达模型时](https://developers.openai.com/api/docs/guides/live-conversations#understand-when-context-reaches-the-model) 了解时序和错误处理。

发送 GPT-Live 可在对话中使用的事实和简短的进度摘要。通过 `session.thinking.append` 发送的内容可能会影响后续的口头回复；请将机密信息和私密的后端推理保留在你的应用中。

## 保持更新准确且实用

在较长的任务中，当有有用的变化时发送更新：某个步骤完成、出现了重要的延迟，或用户需要回答某个问题。

使用 `session.thinking.append` 用于在客户端模式下汇报后台进度。使用 `session.commentary.append` 当更新适合大声说出来时。

对于语音更新，发送 `session.commentary.append` 其内容应与任务已验证的状态一致：

| 状态                  | 示例内容                            |
| ---------------------- | ------------------------------------------ |
| 仍在处理中          | “我正在查看可用的预约时段。” |
| 已完成              | “已为你预订周四下午 2:00。”   |
| 失败                 | “该时段已不可用。”        |
| 取消已确认 | “你的预约已取消。”      |

当用户更改请求时，更新你应用中的当前任务。例如，如果他们把周五改成周四，就在后续工作中使用周四，并忽略来自已过时的周五请求的结果。在后端处理任何取消操作，并在告诉用户工作已取消之前确认取消成功。中断口语对话会让后端工作继续运行。

在重试失败的工具调用之前，检查原始操作是否已经发生。例如，丢失的响应不应导致重复预订。如果结果不确定，请说明并提供下一步有用的操作。

## 共享 UI 上下文

向 GPT-Live 提供当前页面或任务的简明摘要、相关选区以及有助于解读诸如“此选项”等引用的信息。摘要直接从应用状态构建，无需额外的模型调用即可格式化。

在会话开始时以及相关状态发生变化时发送 UI 上下文。跳过未发生变化的更新，并将快速变化合并为最新状态的简短摘要。明确标注对先前选区的更改：

- **初始上下文：** “用户正在查看一次餐厅预订：8 月 6 日晚上 7 点，两位客人。尚未进行任何预订。”
- **更正：** “所选时间现在为晚上 8 点；之前的选择是晚上 7 点。”

在任意一种委托模式下，使用 `session.thinking.append` 配合 `delegation_id: null` 用于 [后台上下文更新](https://developers.openai.com/api/docs/guides/live-conversations#add-context-during-the-conversation)。将完整的 HTML、DOM 树、较大的 JSON 负载和交互日志保留在你的应用或后端中。将页面内容视为参考数据，而非指令。

### 接受类型化输入

将类型化值（例如订单号）作为用户提供的数据发送到后端，以便后端可以使用准确的文本。



  


使用 Responses 委托时，将用户消息排队发送到后端：

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.item.create",
    event_id: "typed_order_number",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: "My order number is A0042.",
        },
      ],
    },
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.responses.response_input_item_param import ResponseInputItemParam


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    item: ResponseInputItemParam = {
        "type": "message",
        "role": "user",
        "content": [{"type": "input_text", "text": "My order number is A0042."}],
    }
    await connection.response.item.create(
        event_id="typed_order_number",
        item=item,
    )
```


Send `response.create` 待后端准备好运行或继续时执行。如果它正在等待函数结果，请先返回所有必需的结果。仅排队发送文本本身并不会取消已经在运行的工作。

  

  


使用客户端委托时，将类型化值直接发送到处理该对话的后端。如果该值用于更正正在运行的任务，请更新该任务，而不是再次启动相同的工作。你可以通过以下方式将简短的事实性摘要镜像到实时会话中 `session.thinking.append`，或者使用 `session.commentary.append` 来处理用户应该听到的结果。

  




## 添加图片与可视化上下文

若要让调用方讨论照片或屏幕，请将图像以及应用中的相关上下文发送到支持视觉的后端。后端会解读图像，并返回供 GPT-Live 在对话中使用的相关文本。Live 音频前端不直接接受图像。



  


使用 Responses 委托时，请配置一个支持视觉的后端模型。将一个受支持的 Responses 图像输入项加入队列，并 `response.item.create`，然后发送 `response.create` 以运行或恢复后端工作。在继续之前，返回所有必需的待处理函数结果。请参阅 [处理 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#handle-responses-delegation).

  

  


使用客户端委托时，请将视觉输入与相关对话及应用状态一起发送到处理委托请求的后端，并使用 [客户端结果流](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation).

  




将后端图像输入与 `session.input`，区分开，后者用于在启动时为 Live 前端填充文本历史。请参阅 [图像与视觉](https://developers.openai.com/api/docs/guides/images-vision) 以了解支持的图像格式和模型限制。

## 降低后端延迟

缩短从请求后端工作到对话获得有用结果之间的时间。在每个阶段衡量 [延迟以定位卡点](https://developers.openai.com/api/docs/guides/voice-agents#measure-latency) ，对比相同场景下实际语音响应时间和任务成功率，并参阅 [voice 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 获取评估指南。



  


### Responses 委托

Live 管理与 Responses 的持久化 WebSocket 连接，并预先准备已知的请求配置。当活动连接和状态支持时，它还可以复用先前的响应状态。你可以在自己的工作负载上测量响应时间和报告的缓存使用情况，以观察实际效果。

通过以下方式调优后端 `delegation.responses`:

- `model`：选择独立于语音模型处理推理和工具选择的模型。
- `reasoning.effort`：使用该模型支持的值，在推理时间和任务质量之间取得平衡。
- `service_tier`：使用 `auto`, `default`, `flex`，或 `priority`，前提是模型支持并具备项目访问权限。 `auto` 遵循项目的配置。请评估所选层级的性能和成本。

在会话期间使用以下方式更新支持的设置 `session.update`。你的自定义工具仍然在你的应用中运行，因此即使 Live 管理着 Responses 连接，慢速服务调用、队列和工具结果缓冲仍可能延迟答案。请及时返回每个必需的工具结果，并 [继续后端响应](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call).

  

  


### 客户端委托

你的应用负责从接收委托到返回结果的整条路径。请在语音会话进行期间就准备好这条路径：

- **复用后端连接。** 在多次委托之间保持 API 客户端及其连接池处于活动状态。对于重复的 Responses 调用，考虑使用持久化的 [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode).
- **预先准备已知配置。** 在首次请求需要之前，预先初始化指令、工具和连接。Responses WebSocket 模式还支持在生成之前预热已知的请求状态；请参阅其 [设置指南](https://developers.openai.com/api/docs/guides/websocket-mode#connect-and-create-responses).
- **流式返回有用的结果。** 返回经过验证的连贯分块，配合 `session.commentary.append`。使用。 `session.thinking.append` 以静默方式报告进度。保留客户端委托 ID 以及每次追加 500 个 token 的限制。将私有推理保留在后端，并在宣布成功之前确认操作。
- **保持可复用的输入稳定。** 保留指令、工具定义及其顺序，以及未变更的历史前缀。当你的后端支持缓存和 延续 时，在可复用内容之后追加新信息。
- **转发完整且有用的更新。** 一旦你拥有足够可独立理解的文本，就立即发送每个结果。让你的后端将更新标记为进度或结果，以便你的应用可以选择合适的追加事件。如果它使用文本前缀来标记这些类别，请在转发更新之前等待完整的前缀出现。

在将此路径与 Responses 委托进行比较时，测量第一个有用的口头回答。

  




### 对转录片段作出回应

在你的应用中处理转录片段是可选的，并且适用于任意一种委托模式。用户和助手 [转录片段](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 会通过 WebSocket 或 WebRTC 数据通道到达。你可以在委托事件到达之前，使用应用逻辑或轻量级模型处理它们以提前开始工作，或者直接使用转录内容来触发由应用自身负责的工作。

可使用此模式用于：

- **减少等待时间。** 在已有足够信息时启动一次推测性查找，例如在用户继续描述偏好的同时检查可用性。
- **运行护栏。** 检查不断增长的对话记录，识别需要介入的请求或响应。参见 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails).
- **调整对话。** 留意暗示困惑或不满的措辞，然后调整体验或发送一条聚焦的指令。
- **更新界面。** 突出相关控件，填充建议字段，或在结果可用时即时展示。

对于浏览器应用，使用 WebRTC data channel 接收字幕和本地 UI 更新。当转写文本处理在你的服务端运行时——例如护栏、轻量模型检查或推测性工具调用——请使用 [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 来接收事件，并直接引导同一个 GPT-Live 会话。

在出现有意义的新信息时处理累积的文本。片段可能不完整，用户的后续语音可能改变请求。请丢弃过时的结果，与后续委派的工作进行协调以避免重复操作，并在执行具有后果的操作之前应用你通常的权限与确认检查。

使用 [append event that matches the update](#send-the-right-kind-of-update)。将发现或指令发送回 GPT-Live。对于在客户端委派之外启动的工作，请使用 `delegation_id: null`。由你的应用负责应用 UI 变更并管理工具执行和取消。

### 共享优化

两种委托模式都能受益于相同的后端改进：

- **为该任务选择模型和推理力度。** 比较能够满足你准确性要求的配置。当较低推理力度能够可靠地完成任务时，使用较低推理力度。
- **保持回答简洁。** 返回 GPT-Live 继续对话所需的事实和状态。避免冗长的解释，也不要仅仅为了改写结果以用于语音而额外地调用模型。
- **减少工具的延迟和不必要的调用。** 在授权工作的输入就绪时即开始执行；在结果仍然有效时复用结果，避免重复已完成的查询。
- **并发运行独立的工作。** 独立的查询调用可以一起执行。同时注意操作的依赖关系和所需的确认。 `parallel_tool_calls` 允许模型请求多个调用；你的应用仍然负责调度和执行其自定义函数。

参见 [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization) 获取通用 Responses 指南， [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 以了解如何复用稳定的输入。

## 验证完整的交互

验证后端是否完成了预期动作，以及客户端是否播放了预期的语音结果。例如，在一次成功的预约后，同时检查预约记录和播放的音频。后端可能已经完成，但语音回答被打断，因此需要分别测试这些结果。

为每个应用动作使用独立的操作 ID，并为每个变更后的请求使用任务版本号，与 GPT-Live 委托 ID 一起记录。使用这些记录来识别在重连或重试后已完成的工作，并丢弃过期请求的结果。

使用 [评估语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 以便进行可重复的测试。对于现有的 Realtime 工具循环或链式后端，请参考 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).