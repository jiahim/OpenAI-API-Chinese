# GPT-Live 中的委托与工具

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

GPT-Live 将推理和工具调用委托给后端，由其管理口语对话。后端工作可以通过配置的 Responses 模型运行，也可以在客户端委托的情况下，通过你的应用所运行的任何模型、智能体 或服务运行。在任一模式下，你的应用都负责权限、确认、业务记录和任务状态。

详细了解 [如何引导实时模型进行委托和工具调用](https://developers.openai.com/api/docs/guides/live-prompting#delegation) ，请参阅提示指南。

本页中的事件示例使用 `connection`，即来自 [连接指南](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。的已连接的主 Live WebSocket 或边带通道。在主连接上， `session.started` 之后再调用事件辅助方法。已挂载的边带通道已属于一个正在运行的会话。





## 选择委托模式

使用 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)**，GPT-Live 会调用你选择的 Responses 模型，提供对话上下文，并将后端结果返回到实时对话中。使用 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)**，由你的应用准备上下文，运行智能体或工作流，并将结果发送回 GPT-Live。

如果你希望 GPT-Live 管理请求，可以从 Responses 委托开始。当你需要运行自己的工作流或在结果发送给 GPT-Live 之前进行审阅时，请选择客户端委托。




| 考量                 | 在以下情况下优先使用 Responses 委托……                                                                           | 在以下情况下优先使用客户端委托……                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **实施工作量**     | 你希望 GPT-Live 负责准备后端请求、管理连接并将结果返回到对话中。 | 你希望自行构建并运维这些部分。                                                      |
| **审查后端结果** | 后端输出可以直接返回给 GPT-Live。                                                            | 你的应用必须在结果到达 GPT-Live 之前进行校验、脱敏、合并或丢弃。           |
| **后端能力**      | 你的工作流符合 GPT-Live 所支持的 Responses 设置和工具。                                 | 你需要使用托管配置之外的其他后端、多个模型或API能力。          |
| **上下文归属**         | GPT-Live 提供的对话上下文符合你的应用需求。                                       | 你需要精确控制每次后端请求所接收的历史记录、记忆和应用状态。    |
| **执行策略**          | 已配置的模型与工具循环能够胜任该任务。                                                            | 你需要在后端各步骤之间进行自定义路由，并配置回退、检查点或预算。 |




例如，一个旅行助手可以将航班状态问题发送给航空公司服务，并将行程变更发送给一个独立的规划智能体。应用负责选择调用哪个后端，以及将哪个经过验证的结果返回给 GPT-Live。

在这两种模式下，你的应用都会跟踪任务进度，并在运行自定义工具之前检查权限和所需的用户确认。当你的应用审查后端结果时，GPT-Live 可以继续说话。如果你的应用必须控制用户何时听到音频，请添加 [播放控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).

客户端委托还要求你的应用 [维护对话上下文](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application)。委托事件包含的是元数据，而不是任务文本；请使用 transcript 事件和应用状态来准备后端请求。

在你的实际工作负载上比较延迟、任务成功率和成本， [评估你的语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)。有关针对你现有架构的指导，请参阅 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration#choose-your-delegation-mode).

在创建会话时选择模式；若要更改模式，请启动一个新会话。

## 配置 Responses 委托

在创建 Live 会话时添加此委托配置 [创建你的 Live 会话](https://developers.openai.com/api/docs/guides/live)。独立于语音模型选择 Responses 模型：

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {
    "model": "gpt-live-1",
    "delegation": {
        "type": "responses",
        "responses": {
            "model": "gpt-5.6-terra",
            "instructions": "[Your backend prompt]",
        },
    },
}
```


从 [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，开始，或尝试 [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以用于对成本敏感的工作负载。在选择后端模型之前，先在你的任务上比较答案质量和延迟。

在 `delegation.responses.tools`。中注册受支持的工具。设置 `delegation.responses.tool_choice` 为 `"auto"` 以允许后端选择工具， `"required"` 以要求进行工具调用，或 `"none"` 以禁用工具调用。你也可以选择一个具名函数。

设置 `delegation.responses.parallel_tool_calls` 为 `true` 以允许在一次响应中进行多次工具调用，或 `false` 以进行顺序调用。你的应用会执行自定义函数并检查其依赖关系与所需的审批。这些设置在 GPT-Live 委托之后生效；可使用 [live prompt](https://developers.openai.com/api/docs/guides/live-prompting#delegation) 来引导何时应进行委托。

Responses 配置需要一个后端 `model` at creation. It supports `function` definitions and `web_search` entries in `tools`. It also exposes `max_output_tokens` (at least 16 when set), `service_tier`, and the `reasoning` and `text` settings supported by the selected backend model. See [Reduce backend latency](#reduce-backend-latency) for settings you can tune.

If [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) is available for your model and project, consider it for latency-sensitive calls. For GPT-Live, select it with `delegation.responses.service_tier: "priority"`.

Send `session.update` with changes in `session.delegation.responses` to update the backend model, instructions, tools, `tool_choice`, or other supported settings during the conversation. Omitted settings keep their current values.

To switch between Responses and client delegation, create a new Live session. Updating `delegation` 为 `null` selects client mode, so sending it to a running Responses session fails with `immutable_field_update`.

These settings use familiar Responses concepts, but Live supports a subset of the standalone Responses API. Live supplies conversation context and initiates delegated work. Configure the backend through the session; the Live `response.create` command 使用该配置，且不接受独立的 Responses 请求体。

## 从你的应用引导实时对话

Responses 委派机制负责管理后端的 工作流，但你的应用仍然可以直接向 GPT-Live 模型发送上下文。如果你通过旁路 WebSocket 或主事件连接监听该调用，可以使用 `session.instructions.append`, `session.thinking.append`，或者 `session.commentary.append` 配合 `delegation_id: null`。例如，基于转写内容的 护栏 可以追加一条指令来重定向对话。这样做会引导实时模型，但不会修改 Responses 后端的提示，也不会取消已在执行的任务。

## 处理 Responses 委托

对于基于 Responses 的工作， `session.delegation.created` 包含 `target: "responses"` 和一个 `response_id`。后续的 Responses 事件会包裹在一个 `response.event` 信封中：

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

当顶层事件类型为 `response.event`，时，根据 `envelope.event.type`。进行分发。保存外层的 `delegation_id` ，以便将后端事件与其委派关联起来。你的处理器也可能收到此处未展示的嵌套 Responses 生命周期事件。

实时语音和委派工作相互独立地继续进行。后端响应的完成本身并不意味着用户已听到回复。请使用 Live 输出的转录文本和音频来表示交互中的语音部分。





### 运行自定义函数并返回其结果

从嵌套的 response.completed 事件中读取已完成的函数调用。已完成的函数项包含 call_id `response.output_item.done` 和 arguments，单一的 arguments-done `call_id`, `name`，事件不足以标识该调用。 `arguments`；事件不足以标识该调用。

从嵌套的 response.created `response.created` 事件中跟踪响应 ID，与外部的 response.created `delegation_id`。一起。从 response.output_item.done 事件中收集该响应的函数调用 `response.output_item.done`，并使用该集合确定在继续之前需要提交哪些工具结果。

转发的生命周期事件，包括 response.completed `response.completed`，包含 output `response.output: []` ，即使函数调用需要结果时也是如此。这些事件也具有空的 response `tools` 数组，并且没有， `instructions: null`，字段。请读取各个 output-item `input` 事件以获取函数调用。

执行授权操作后，将结果作为 Responses item 追加：

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


然后显式继续该响应：

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


为每个待处理的函数调用发送一个 function_call_output `response.item.create` 结果，然后发送 response.create 以继续后端响应。 `response.create` 以继续后端响应。 `response.item.create` 没有单独的成功确认；请继续处理错误和嵌套的 Responses 生命周期事件。

这两个命令都需要 Responses 委托。Live `response.create` 命令使用存储在会话中的后端配置。使用上面显示的事件负载，并通过会话配置后端模型和其他设置。

  

  


## 配置客户端委托

设置 `delegation` 当 [创建你的 Live 会话](https://developers.openai.com/api/docs/guides/live):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {"model": "gpt-live-1", "delegation": {"type": "client"}}
```


你的应用配置并运行后端：选择其模型或服务、指令、工具和路由。如果后端使用 Responses API，则在你应用的 Responses 请求中设置其模型和工具。

当 GPT-Live 请求协助时，根据你保存的对话历史和当前任务状态构建后端请求。检查权限和所需的确认，执行任务，并选择要返回的结果。

## 在你的应用中保留对话上下文

对于客户端委托， **收集转写文本并自行维护当前任务状态**.

监听 `session.input_transcript.delta` and `session.output_transcript.delta`。事件。这些事件在 `delta`，中包含转写文本，以及 `start_ms` and `end_ms` 时间戳。保留足够的历史记录，以理解简短的回复（例如“是的”）、更正（例如“星期四，不是星期五”）以及之前提供的细节。转写片段并不是完整的用户轮次，转写中也可能包含错误。

独立的 `session.delegation.created` 事件包含一个 `offset_ms` 时间戳和委托元数据，包括 `delegation.id` and `delegation.target`。它并不 **包含** 用户的发言或任务文本。使用转写事件和应用程序状态来确定用户的需求。保存 `delegation.id` 以便你能够将更新与该请求匹配。

在后端保留较长的记录和完整的工具输出。如果你创建了替换会话，请从你的应用程序恢复相关上下文，并在重复任何工作之前检查已经执行过的操作。

### 接收客户端委托

`session.delegation.created` 用于标识一次委派：

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

Save `event.delegation.id` 并在关于此任务的更新中原样包含它。

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


Use `session.commentary.append` 用于 GPT-Live 应该朗读出来的结果；该字段已训练为对文本进行转述。Use `session.thinking.append` 用于它可以在后续回复中使用、但收到时无需朗读的事实或进度。你可以使用同一个客户端委派 ID 发送多条更新。

See [发送正确类型的更新](#send-the-right-kind-of-update) 了解内容限制、必填字段以及确认时序。

  




## 从你现有的后端提示词开始

将你现有的文本智能体提示作为起点。保留其任务指令和业务规则在服务端，并调整那些假设为文本聊天或直接控制语音的指令。说明如何处理语音转写并返回有用的结果。在你的应用中强制执行权限和必需的确认。

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

将大型结构化负载、冗长的工具输出以及用于展示的 Markdown 保留在服务端。把相关的事实交给 GPT-Live，让它自己选择如何表达。简洁的工具结果无需再额外调用模型来改写成语音。

在客户端委托下， [直接将结果返回给 GPT-Live](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation)。在 Responses 委托下，按照 [函数结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call) 继续后端工作。

## 发送合适的更新

根据 GPT-Live 应如何使用该内容来选择事件：

| 你想发送的内容                                                                                       | Event                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 面向实时模型的系统级指令，例如问候、披露或停止说话的指示 | `session.instructions.append` |
| 供内部推理使用的信息，不会朗读出来，但可用于回答相关的用户问题             | `session.thinking.append`     |
| 模型应大声朗读的信息，需对附加文本进行转述                                    | `session.commentary.append`   |

三者都使用普通字符串 `content`，每次追加限制为 500 个 token。包含 `delegation_id`：使用原始客户端委托 ID 来更新相关任务，或 `null` 用于一般会话上下文。非空 ID 必须指向一个已知的客户端委托。指令仍作用于当前会话；ID 不会把它们变成独立的后端提示。

追加的指令可能会打断模型当前的发言或行为。当应用需要重新引导对话时使用它；任何相关的工具或动作拦截应在应用层状态中强制执行。

在客户端托管任务期间实现静默进度更新时：

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


对于已确认的预约，发送用户应听到的结果：

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


仅在实际预约成功后再发送该结果。若要做会话级别的指令，请使用 `session.instructions.append` 配合 `delegation_id: null`.

例如，在你的应用根据其护栏阻止某个请求之后，你可以这样重新引导对话：

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


该指令不会取消后端任务。 [在应用中拦截受影响的动作并处理任何已在运行的任务](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 。

对应的确认消息为 `session.thinking.appended`, `session.commentary.appended`，事件不足以标识该调用。 `session.instructions.appended`。将其 `client_event_id` 与你的传出 `event_id`。进行匹配。该确认消息等待的是预估的上下文注入，而不是语音或播放完成。详见 [上下文到达模型时](https://developers.openai.com/api/docs/guides/live-conversations#understand-when-context-reaches-the-model) 中的时序与错误处理。

发送 GPT-Live 可在对话中使用的事实和简短的进度摘要。通过 `session.thinking.append` 发送的内容可能影响后续语音回复；密钥和私密的后端推理请保留在你的应用中。

## 保持更新的准确性和实用性

在较长的任务中，当有有用信息变化时发送更新：某个步骤完成、出现了需要关注的延迟，或用户需要回答问题。

Use `session.thinking.append` 用于在客户端模式下汇报后台进度。使用 `session.commentary.append` 当更新值得大声说出来时使用。

对于语音更新，发送 `session.commentary.append` 其内容应与任务的已验证状态一致：

| State                  | 示例内容                            |
| ---------------------- | ------------------------------------------ |
| 仍在进行          | “我正在查看可预约的时间。” |
| 已完成              | “已为你预约周四下午 2:00。”   |
| 失败                 | “该时段已不可预约。”        |
| 取消已确认 | “你的预约已取消。”      |

当用户更改请求时，请更新应用中的当前任务。例如，如果他们把星期五改成星期四，请将后续工作使用星期四，并忽略已过时的星期五请求所产生的结果。在后端处理任何取消操作，并在告知用户工作已取消之前确认取消成功。中断语音对话会让后端任务继续运行。

在重试失败的工具调用之前，先检查原始操作是否已经发生。例如，丢失的响应不应导致重复预订。如果结果不确定，请如实说明并提供下一步有用的操作。

## 分享 UI 上下文

为 GPT-Live 提供当前页面或任务的简明摘要、相关选区以及有助于解读“此选项”等引用的事实。直接从应用状态构建摘要；无需额外的模型调用来格式化它。

在会话开始时以及相关状态发生变化时发送 UI 上下文。跳过未发生变化的更新，并将快速变化合并为最新状态的简短摘要。明确说明对先前选区的更改：

- **初始上下文：** “用户正在查看一项餐厅预订：8 月 6 日晚上 7 点，两位客人。尚未进行预订。”
- **更正：** “所选时间现在为晚上 8 点；之前的选择为晚上 7 点。”

在任一委托模式下，使用 `session.thinking.append` 配合 `delegation_id: null` 用于 [后台上下文更新](https://developers.openai.com/api/docs/guides/live-conversations#add-context-during-the-conversation)。将完整的 HTML、DOM 树、大型 JSON 负载以及交互日志保留在你的应用或后端中。将页面内容视为参考数据，而非指令。

### 接受类型化输入

将诸如订单号之类的类型化值作为用户提供的数据发送到后端，以便后端可以使用准确的文本。



  


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


Send `response.create` 当准备好运行或延续后端时。如果它正在等待函数结果，请先返回所有必需的结果。仅排队文本并不会取消已经在运行的工作。

  

  


使用客户端委托时，将类型化值直接发送到处理会话的后端。如果它更正了正在运行的任务，请更新该任务，而不是再次启动相同的工作。你可以使用 `session.thinking.append`，将一个简短的事实性摘要镜像到实时会话中，或者使用 `session.commentary.append` 来呈现用户应当听到的结果。

  




## 添加图片和视觉上下文

若希望通话方讨论一张照片或屏幕，请将图像以及你应用中的相关上下文发送给支持视觉的后端。后端会解析图像，并返回供 GPT-Live 在对话中使用的相关文本。Live 音频前端不直接接受图像。



  


使用 Responses 委托时，需配置一个支持视觉的后端模型。使用受支持的 Responses 图像输入项进行排队，并 `response.item.create`，然后发送 `response.create` 以运行或恢复后端工作。继续之前，请返回所有必需的待处理函数结果。参见 [处理 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#handle-responses-delegation).

  

  


使用客户端委托时，请将视觉输入与相关对话及应用状态一起发送给处理委托请求的后端。使用 [客户端结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation).

  




请将后端图像输入与 `session.input`，分开，后者会在启动时为 Live 前端填充文本历史记录。参见 [图像与视觉](https://developers.openai.com/api/docs/guides/images-vision) 了解支持的图像格式和模型限制。

## 降低后端延迟

缩短从请求后端工作到返回对话有用结果之间的时间。在每个阶段测量 [延迟以定位瓶颈](https://developers.openai.com/api/docs/guides/voice-agents#measure-latency) 。在相同场景下对比有用的语音响应时间和任务成功率，并参阅 [voice 智能体 evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 获取评估指导。



  


### Responses 委托

Live 管理到 Responses 的持久化 WebSocket 连接，并提前准备好已知的请求配置。当活动连接和状态支持时，它还可以复用先前的响应状态。请在你的工作负载上测量响应时间和报告的缓存使用情况，以观察其效果。

通过以下方式调优后端 `delegation.responses`:

- `model`: 选择独立于语音模型来处理推理和工具选择的模型。
- `reasoning.effort`: 使用该模型所支持的值，在推理时间和任务质量之间取得平衡。
- `service_tier`: 使用 `auto`, `default`, `flex`，或 `priority`，受模型支持和项目访问权限的限制。 `auto` 遵循项目的配置。评估所选层级的性能和成本。

在会话期间更新支持的设置，使用 `session.update`。你的自定义工具仍然在你的应用中运行，因此即使 Live 管理着 Responses 连接，缓慢的服务调用、队列和工具结果缓冲仍可能延迟响应。请及时返回每个必需的工具结果，并 [继续后端响应](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call).

  

  


### 客户端委托

你的应用负责从接收委托到返回结果的完整路径。在语音会话运行期间准备好该路径：

- **复用后端连接。** 在委托之间保持 API 客户端及其连接池存活。对于重复的 Responses 调用，考虑使用持久化的 [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode).
- **准备已知配置。** 在首次请求需要之前初始化指令、工具和连接。Responses WebSocket 模式还支持在生成前预热已知的请求状态；请遵循其 [设置指南](https://developers.openai.com/api/docs/guides/websocket-mode#connect-and-create-responses).
- **流式输出有用的结果。** 返回连贯且经过校验的分块，配合 `session.commentary.append`。使用 `session.thinking.append` 进行静默进度更新。保留客户端委托 ID 以及每次 append 的 500 token 限制。将私有推理保留在后端，并在宣告成功前确认操作。
- **保持可复用输入稳定。** 保留指令、工具定义及顺序，以及未变更的历史前缀。当你的后端支持缓存和 延续 时，将新信息追加到可复用内容之后。
- **转发完整且有用的更新。** 一旦拥有足够独立可理解的文本，就立即发送每个结果。让后端将更新标记为进度或结果，以便你的应用可以选择合适的 append 事件。如果使用文本前缀来标记这些类别，请等待完整前缀出现后再转发更新。

在将此路径与 Responses 委托进行比较时，衡量第一个有用的口语回答。

  




### 对转写片段做出反应

在应用中处理转录片段是可选的，且两种委托模式均适用。用户和助手 [转录片段](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 会通过 WebSocket 或 WebRTC 数据通道到达。你可以在委托事件到达之前，使用应用逻辑或轻量模型对其进行处理以提前开始工作，也可以直接使用转录本身来触发由应用拥有的工作。

可使用此模式来：

- **减少等待。** 在获得足够信息时启动推测性查找——例如，在用户继续描述其偏好的同时检查可用性。
- **运行护栏。** 检查不断增长的对话记录，查找需要干预的请求或响应。参见 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails).
- **调整对话。** 留意可能表示困惑或不满的措辞，然后调整体验或发送有针对性的指令。
- **更新界面。** 高亮相关控件、填充建议字段，或在结果可用时立即展示。

对于浏览器应用，请使用 WebRTC 数据通道来接收字幕和本地 UI 更新。当转写文本处理运行在你的服务器上时——例如用于护栏、轻量级模型检查或推测性工具调用——请使用 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 来接收事件并直接引导同一个 GPT-Live 会话。

在有意义的新信息出现时处理累积的文本。片段可能不完整，并且后续语音可能会改变请求。丢弃过时的结果，与后续委派的工作进行协调以避免重复操作，并在执行重要操作前应用你通常的权限与确认检查。

使用 [append 事件来匹配更新（update）](#send-the-right-kind-of-update)。对于在客户端委派之外启动的工作，请使用 `delegation_id: null`。你的应用负责应用 UI 变更并管理工具执行与取消。

### 共享的优化

两种委托模式都受益于以下相同的后端改进：

- **为任务选择模型和推理力度。** 比较满足你准确性要求的配置。当较低推理力度能够可靠完成任务时，优先使用它。
- **保持回答简洁。** 返回 GPT-Live 继续对话所需的事实和状态。避免冗长的解释，也不要仅仅为了把结果改写成语音而额外调用模型。
- **减少工具延迟和不必要的调用。** 在其输入就绪后立即启动已授权的工作，在结果仍然有效时复用它们，并避免重复已完成查询。
- **并行运行独立的工作。** 独立的查询调用可以并发执行。同时尊重操作之间的依赖关系和所需的确认步骤。 `parallel_tool_calls` 允许模型请求多个调用；你的应用仍然负责调度和执行自定义函数。

See [延迟优化](https://developers.openai.com/api/docs/guides/latency-optimization) 有关通用 Responses 指南和 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 以复用稳定的输入。

## 验证完整的交互

验证后端是否完成了预期的操作，以及客户端是否播放了预期的语音结果。例如，同时检查成功预约后的预约记录和播放的音频。后端可能已完成但语音回答被打断，因此需要分别测试这些结果。

为每个应用操作使用独立的操作 ID 进行跟踪，并为每个变更请求使用任务版本号，配合 GPT-Live 委托 ID 一起使用。利用这些记录在重连或重试后识别已完成的工作，并丢弃过期请求的结果。

Use [评估语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 进行可重复的测试。对于现有的 Realtime 工具循环或链式后端，请参考 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).