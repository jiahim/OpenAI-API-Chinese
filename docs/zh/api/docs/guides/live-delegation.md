# GPT-Live 中的委托与工具

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

GPT-Live 将推理和工具调用委托给后端处理，同时管理口语对话。后端工作可以由配置的 Responses 模型执行，也可以在客户端委托模式下由你的应用所运行的任何模型、智能体或服务来执行。在任一模式下，权限、确认、业务记录和任务状态都由你的应用拥有。

详细了解如何 [在实时模型中引导委托与工具使用](https://developers.openai.com/api/docs/guides/live-prompting#delegation) ，请参阅提示指南。





## 选择委托模式

使用 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)**，GPT-Live 会调用你选择的 Responses 模型，提供对话上下文，并将后端结果返回到实时对话中。使用 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)**，由你的应用准备上下文，运行 智能体 或 工作流，并将结果发送回 GPT-Live。

如果其托管的 工作流 能够满足需求，可以从 Responses 委托开始。当你需要对后端上下文、执行过程或返回给 GPT-Live 的结果进行更多控制时，则选择客户端委托。




| 考量                 | 在以下情况下优先选择 Responses 委托……                                                                           | 在以下情况下优先选择客户端委托……                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **实施工作量**     | 你希望 GPT-Live 准备后端请求、管理连接，并将结果返回到对话中。 | 你希望自行构建和运维这些部分。                                                      |
| **审查后端结果** | 后端输出可以直接返回给 GPT-Live。                                                            | 你的应用必须在结果到达 GPT-Live 之前对其进行校验、编辑、合并或丢弃。           |
| **后端能力**      | 你的工作流符合 GPT-Live 支持的 Responses 设置和工具。                                 | 你需要另一个后端、多个模型，或超出托管配置的API能力。          |
| **上下文所有权**         | 由 GPT-Live 提供的对话上下文符合你的应用需求。                                       | 你需要精确选择每次后端请求所接收的历史、记忆和应用状态。    |
| **执行策略**          | 已配置的模型和工具循环适用于该任务。                                                            | 你需要在代码与模型之间进行自定义路由，或在后端步骤之间使用回退、检查点或预算控制。 |




例如，一个旅行助手可以将航班状态查询发送到一个航空服务，并将行程变更发送到一个单独的规划智能体。由应用决定调用哪个后端，以及将哪个已验证的结果返回给 GPT-Live。

在两种模式下，你的应用都要管理任务状态，并在运行自定义工具之前强制权限校验和必要的确认。审查后端结果是另一项独立决策：它不会批准 GPT-Live 所说的每一个字，也无法保证在校验运行期间保持静默。参见 [按需控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).

客户端委托还要求你的应用 [维护对话上下文](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application)。委托事件包含的是元数据，而非任务文本；请使用转录事件和应用状态来准备后端请求。

在你的实际工作负载上比较延迟、任务成功率和成本， [评估你的语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)。如需针对你现有架构的具体指导，请参阅 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration#choose-your-delegation-mode).

在创建会话时选择模式；若要更改模式，请启动新会话。

## 配置 Responses 委托

在创建 Live 会话时添加此委托配置 [creating your Live session](https://developers.openai.com/api/docs/guides/live)。独立于语音模型选择 Responses 模型：

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


从 [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，开始，或尝试 [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以用于对成本敏感的工作负载。在选择后端模型之前，请先在你的任务上比较答案质量和延迟。

在以下位置注册受支持的工具 `delegation.responses.tools`。使用 `delegation.responses.tool_choice` 来控制后端可以使用哪些工具： `"auto"` 允许其自行选择， `"required"` 要求必须进行工具调用，而 `"none"` 则禁止进行工具调用。你也可以选择一个具名函数。将 `delegation.responses.parallel_tool_calls` 设置为 `true` 以允许并发进行独立的查找，或设置为 `false` 以便必须按顺序执行调用。你的应用仍然执行其自定义函数并强制实施依赖关系和审批。这些设置不会强制实时模型进行委托。

Responses 配置需要在创建时指定一个后端 `model` 。它支持 `function` 定义和 `web_search` entries in `tools`。它还暴露 `max_output_tokens` （设置时至少为 16）, `service_tier`，以及所选后端模型支持的 `reasoning` 和 `text` 设置。参见 [降低后端延迟](#reduce-backend-latency) ，了解你可以调整的设置。

如果 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 对你的模型和项目可用，建议在对延迟敏感的调用中使用它。对于 GPT-Live，使用 `delegation.responses.service_tier: "priority"`.

随着对话变化，发送 `session.update` 并附上对 `session.delegation.responses` 的更改，以更新后端模型、指令、可用工具， `tool_choice`，或其他支持的设置，而无需开启新的 Live 会话。未提供的设置将保留其值。设置 `delegation` 设置为 `null` 会选择客户端模式，且无法重置正在运行的 Responses 会话；切换模式时会失败并返回 `immutable_field_update`.

这些设置使用了熟悉的 Responses 概念，但 Live 仅支持独立 Responses API 的一个子集。Live 提供对话上下文并启动委派工作。通过会话配置后端；Live `response.create` 命令使用该配置，且不接受独立的 Responses 请求体。

## 在你的应用中引导实时对话

Responses 委托管理后端 工作流，但你的应用仍然可以将上下文直接发送给 GPT-Live 模型。如果你通过旁路 WebSocket 或主事件连接监听该调用，可以使用 `session.instructions.append`, `session.thinking.append`，或 `session.commentary.append` 配合 `delegation_id: null`。例如，基于转录文本的 护栏 可以追加一条指令来引导对话方向。这会引导实时模型，但不会更改 Responses 后端提示，也不会取消已经在进行的工作。

## 处理 Responses 委派

对于基于 Responses 的工作， `session.delegation.created` 具有 `target: "responses"` ，以及一个 `response_id`。后续的 Responses 事件会到达一个 `response.event` 信封中：

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

根据 `envelope.event.type` 进行分发，并保留外层 `delegation_id`。不要将每个顶层 `response.*` 值当作未封装的 Responses 事件处理。要容忍 Responses 生命周期中额外嵌套的事件。

实时语音和委托的工作会独立继续。后端响应完成本身并不代表用户已经听到了答案。请使用 Live 的输出转录和音频来呈现交互中的语音部分。

### 完成客户端可操作的函数调用

从嵌套事件中读取已完成的函数调用 `response.output_item.done` 。已结束的函数项包含 `call_id`, `name`，并且 `arguments`；仅凭 arguments-done 事件不足以识别该调用。

从嵌套事件中跟踪响应 ID `response.created` 与外层事件一起 `delegation_id`，并从该响应中收集函数调用 `response.output_item.done`。转发生命周期快照刻意包含 `response.output: []`，包括在 `response.completed`；处；其 `tools` 数组为空， `instructions` 是 `null`，并且 `input` 被省略。空的终止输出数组并不 **意味着** 没有待处理的函数调用。请使用已收集的调用来判断在继续之前必须提交哪些结果。

在执行完授权操作后，将结果作为 Responses 条目追加：

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


在继续之前，为每个待处理的工具调用提交所有必需的结果。追加函数结果并不会自动继续该响应。 `response.item.create` 没有单独的成功确认；请持续处理错误以及随后的嵌套响应生命周期。

`response.create` 是用于创建或继续委托的 Responses 工作的 Live 命令，使用该会话配置的 backend。请勿附加 Responses API 创建请求体、backend 模型覆盖或 `delegation_id` 到此事件。两个命令都需要 Responses 委托。

  

  


## 配置客户端委托

设置 `delegation` 时 [creating your Live session](https://developers.openai.com/api/docs/guides/live):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {"model": "gpt-live-1", "delegation": {"type": "client"}}
```


这会为该会话选择客户端委派模式。请单独配置后端：你的应用自行选择模型或服务、指令、工具以及工作路由方式。如果你使用 Responses API 作为该后端，请在你自己的 Responses 请求中设置其模型和工具。Live 会话不会配置或运行这些后端工具。

当 GPT-Live 请求协助时，你的应用会根据对话和应用上下文构建后端请求，执行工作，并决定将哪些结果返回。在执行你的工具之前，请强制执行权限校验和必要的确认。请在你的应用中保留完整的对话历史，以便为每次后端请求提供相关的上下文。

## 在应用程序中保留对话上下文

对于客户端委托， **自行收集转录内容并保留当前任务状态**.

监听 `session.input_transcript.delta` 和 `session.output_transcript.delta`。这些事件包含转录文本，附带 `delta`，以及 `start_ms` 和 `end_ms` 时间戳。保留足够的历史记录，以便理解简短的回复（例如“好”）、更正（例如“星期四，不是星期五”）以及更早提供的细节。转录片段并非完整的用户回合，且转录内容可能存在错误。

单独的 `session.delegation.created` 事件包含一个 `offset_ms` 时间戳和委托元数据，包括 `delegation.id` 和 `delegation.target`。它不 **意味着** 包含用户的发言或任务文本。请使用转录事件和应用程序状态来推断用户的需求。保存 `delegation.id` 以便将后续更新与该请求进行匹配。

在后端保留长期记录和完整的工具输出。如果你创建了替换会话，请从你的应用程序中恢复相关上下文，并在重复任何操作前检查哪些动作已经执行过。

### 接收客户端委托

`session.delegation.created` 标识一次交接：

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

读取 `event.delegation.id`。交接对象包含元数据而非任务文本。请维护你自己的交接工作处理程序所需的转录和应用上下文。当前 ID 带有 `item_` 前缀，如此处所示；请将完整 ID 视为不透明值，原样返回，不要自行构造或解析。

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


使用 `session.thinking.append` 在追加时为模型的内部推理添加信息，但不朗读出来。使用 `session.commentary.append` 追加模型应当朗读出来的结果；模型经过训练会改写所追加的文本。所有追加都包含一个纯文本字符串，并且需要 `delegation_id`，即使其值为 `null`。也是如此。非 null 的 ID 必须指定一个已知的客户端交接。

重复的结果追加可以延续同一个客户端交接。追加确认会在预估的上下文注入之后到达；它并不证明模型已经消费或朗读了该结果，也不证明外部动作已成功执行。

  




## 从你现有的后端提示词开始

以你现有的文本智能体提示作为起点。将其任务说明和业务规则保留在服务端，并改写那些假设为文本聊天或直接控制语音的指令。说明如何处理语音转写并返回有用的结果。在你的应用中强制权限和必需的确认流程。

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
Return the relevant facts, whether the task is complete, and what comes next.
Use confirmed values. Do not invent a successful action.
```

将大型结构化负载、冗长的工具输出以及用于展示的 Markdown 保留在服务端。把相关的事实交给 GPT-Live，由它自行决定如何表达。简洁的工具结果无需再额外调用一次模型来改写为语音。

采用客户端委托时， [直接将结果返回给 GPT-Live](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation)。采用 Responses 委托时，按照 [function-result 流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call) 以继续后端工作。

SDK 事件示例使用 `connection`，一个已连接的主 Live WebSocket 或来自 [连接指南](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。的边带。请在 `session.started` 之后在主连接上调用该辅助函数；已附加的边带已属于正在运行的会话。

## 发送正确的更新类型

根据 GPT-Live 应如何使用该内容来选择事件类型：

| 你想要发送的内容                                                                                       | Event                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 面向实时模型的系统级指令，例如问候语、披露信息或停止说话的指示 | `session.instructions.append` |
| 用于内部推理的信息，不会在追加时朗读，但可用于回答相关的用户问题             | `session.thinking.append`     |
| 模型应大声朗读的信息，对追加的文本进行改述                                    | `session.commentary.append`   |

三者都使用纯字符串 `content`，每次追加最多 500 个 token。包括 `delegation_id`：使用原始的客户端委托 ID 来更新该任务，或使用 `null` 用于通用的会话上下文。非空 ID 必须对应一个已知的客户端委托。指令仍然作用于当前会话；ID 不会把它们变成单独的后端 prompt。

追加的指令可能会打断模型当前的发言或行为。当应用需要重定向对话时使用它；并在应用状态中强制执行任何相关的工具或动作拦截。

用于在客户端管理的任务中静默推进：

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


对于已确认的预订，发送用户应该听到的结果：

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


仅在该预订实际成功之后再发送该结果。对于作用于整个会话的指令，使用 `session.instructions.append` 配合 `delegation_id: null`.

例如，在你的应用根据其护栏拦截了一个请求之后，你可以重定向对话：

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


该指令不会取消后端工作。 [拦截受影响的动作并处理任何已在运行的工作](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 在你的应用中。

对应的确认消息是 `session.thinking.appended`, `session.commentary.appended`，并且 `session.instructions.appended`。将它们的 `client_event_id` 匹配到你发送的 `event_id`。该确认等待的是预估的上下文注入完成，而不是语音或播放结束。参见 [了解上下文何时到达模型](https://developers.openai.com/api/docs/guides/live-conversations#understand-when-context-reaches-the-model) 以获取时序与错误处理相关内容。

静默上下文仍然会影响模型之后的内容。它不是用于存放机密或隐藏推理的私密位置。请发送有用的事实和简短的进度摘要。

## 保持更新准确且有用

在较长的任务中，当有有用的情况发生变化时发送更新：某个步骤完成、出现需要关注的延迟，或者需要用户回答问题。

使用 `session.thinking.append` 用于客户端模式下的后台进度更新。使用 `session.commentary.append` 当更新适合被朗读出来时。

对于语音更新，发送 `session.commentary.append` 其内容应与任务的已验证状态一致：

| 状态                  | 示例内容                            |
| ---------------------- | ------------------------------------------ |
| 处理中          | “我正在查看可预约的时间。” |
| 已完成              | “已为你预约周四下午 2:00。”   |
| 失败                 | “该时间段已不可预约。”        |
| 已确认取消 | “你的预约已取消。”      |

语音打断并不会自动取消后端任务。如果用户把 Friday 改成 Thursday，请更新当前任务，并忽略稍后返回的 Friday 结果。你的应用必须自行决定是取消任务、修改任务，还是让它继续完成。在告知用户取消成功之前，请先确认取消确实已生效。

在重试一次失败的工具调用之前，请检查原始操作是否已经发生。例如，丢失的响应不应导致重复预订。如果结果不确定，请如实说明，并提供下一步有用的操作。

## Share UI context

向 GPT-Live 提供当前页面或任务的简洁摘要、相关的选择内容，以及有助于解读诸如“this option”等内容的事实。摘要直接基于应用状态生成，无需额外的模型调用来格式化。

在会话开始时以及相关状态发生变化时发送 UI 上下文。跳过未变更的更新，并将快速发生的多项变化合并为对最新状态的简短摘要。需要明确说明对先前选择所做的更改：

- **初始上下文：** “用户正在查看一次餐厅预订：8 月 6 日晚上 7 点，两位客人。尚未完成预订。”
- **更正：** “所选时间已变为晚上 8 点；之前的选择是晚上 7 点。”

在任意委托模式下，使用 `session.thinking.append` 配合 `delegation_id: null` 进行 [后台上下文更新](https://developers.openai.com/api/docs/guides/live-conversations#add-context-during-the-conversation)。请将完整的 HTML、DOM 树、大型 JSON 负载以及交互日志保存在你的应用或后端中。将页面内容视为参考数据，而非指令。

### 接受类型化输入

如果调用者输入了精确的值（例如订单号），请将其传递给处理该任务的后端。纯语音应用不需要这条路径。应当将输入的值视为用户数据，而不是传给模型的实时指令。



  


使用 Responses 委托时，为后端排队一条用户消息：

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


Send `response.create` ，准备运行或继续后端时调用。如果后端正在等待函数结果，请先返回所有必需的结果。排队文本本身并不会取消已经在运行的工作。

  

  


使用客户端委托时，将输入的值直接发送给处理该对话的后端。如果它是在修正一个正在运行的任务，请更新该任务，而不是再次启动相同的工作。你可以使用 `session.thinking.append`，将简短的事实摘要镜像到实时会话中，或者使用 `session.commentary.append` 来生成用户应该听到的结果。

  




## 添加图像和视觉上下文

若需帮助调用方讨论照片或屏幕内容，请将图像以及你应用中的相关上下文发送到具备视觉能力的后端。后端会解读图像，并返回供 GPT-Live 在对话中使用 的相关文本。Live 音频前端不直接接受图像。



  


使用 Responses 委托时，请配置一个具备视觉能力的后端模型。使用受支持的 Responses 图像输入项进行排队，传入 `response.item.create`，然后发送 `response.create` 以运行或恢复后端工作。继续之前，请返回所有必需的待处理函数结果。参见 [处理 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#handle-responses-delegation).

  

  


使用客户端委托时，请将视觉输入与相关对话及应用状态一起发送到处理委托请求的后端。使用 [客户端结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation).

  




将后端图像输入与 `session.input`，区分开，后者用于在启动时为 Live 前端填充文本历史。参见 [图像与视觉](https://developers.openai.com/api/docs/guides/images-vision) ，了解支持的图像格式和模型限制。

## 降低后端延迟

缩短从请求后端工作到为对话返回有用结果之间的时间。在每个阶段测量 [延迟](https://developers.openai.com/api/docs/guides/voice-agents#measure-latency) 以定位延迟所在。在相同场景下比较有用语音响应时间和任务成功情况，并参阅 [语音智能体评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 获取评估指导。



  


### Responses 委托

Live 管理到 Responses 的持久化 WebSocket 连接，提前准备连接和已知的请求配置，并在可用时复用先前的响应状态。对于托管后端，你无需实现这些步骤。复用取决于当前连接和兼容的状态，它并不能保证命中缓存或特定的延迟。

可通过以下方式调优后端 `delegation.responses`:

- `model`: 选择独立于语音模型处理推理和工具选择的模型。
- `reasoning.effort`: 使用该模型支持的值在推理时间和任务质量之间取得平衡。
- `service_tier`: 使用 `auto`, `default`, `flex`,或 `priority`,具体取决于模型支持和项目访问权限。 `auto` 遵循项目的配置。评估所选层级的性能和成本。

在会话期间通过以下方式更新支持的设置 `session.update`。你的自定义工具仍然在你的应用中运行，因此即使 Live 管理着 Responses 连接，较慢的服务调用、队列和工具结果缓冲仍可能延迟答案。请及时返回每个必需的工具结果，并 [继续后端响应](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call).

  

  


### 客户端委托

你的应用负责从接收委派到返回结果的完整流程。在语音会话运行期间准备好这条路径：

- **复用后端连接。** 在多次委托之间保持 API 客户端及其连接池处于活跃状态。对于重复的 Responses 调用，可以考虑使用持久的 [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode).
- **预先准备好已知配置。** 在首次请求需要之前初始化指令、工具和连接。Responses WebSocket 模式还支持在生成前预热已知的请求状态；请遵循其 [设置指南](https://developers.openai.com/api/docs/guides/websocket-mode#connect-and-create-responses).
- **流式输出有用结果。** 返回经过验证的连贯块，并使用 `session.commentary.append`。使用 `session.thinking.append` 表示静默进度。保留客户端委托 ID 以及每次追加 500 个 token 的上限。将私有推理保留在后端，并在宣布成功前确认操作。
- **保持可复用输入稳定。** 保留指令、工具定义及其顺序，以及未更改的历史前缀。当你的后端支持缓存和 延续 时，将新信息追加在可复用内容之后。
- **避免不必要的缓冲。** 在有用结果就绪后立即转发。只需缓冲足够的内容以对输出进行分类并形成连贯的块。优先使用结构化的阶段元数据；如果使用文本前缀来区分进度与结果，请等待完整前缀出现后再转发文本。

在将此路径与 Responses 委托进行比较时，测量第一个有用的口头回答。

  




### 对转录片段做出反应

在你的应用中处理转录片段是可选的，并且适用于任何委托模式。用户和助手 [转录片段](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 通过 WebSocket 或 WebRTC 数据通道到达。你可以使用应用逻辑或轻量级模型在委托事件到达前开始处理工作，或者直接使用转录本身来触发应用所拥有的工作。

使用此模式可以：

- **减少等待。** 在掌握足够信息时启动预测性查询——例如，在用户继续描述其偏好时同步检查可用性。
- **运行护栏。** 在不断增长的对话记录中检查需要干预的请求或响应。参阅 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails).
- **动态调整对话。** 留意表示困惑或不满的措辞，然后调整体验或发送针对性指令。
- **更新界面。** 高亮相关控件、填充建议字段，或在结果可用时即时展示。

对于浏览器应用，使用 WebRTC 数据通道传输字幕和本地 UI 更新。当转录处理在你的服务端运行时——用于护栏、轻量模型检查或推测性工具调用——使用 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 来接收事件并直接引导同一个 GPT-Live 会话。

在出现有意义的新信息时处理累积的文本。一个片段可能不完整，后续语音可能改变请求。丢弃过时的结果，与后续委托的工作协调以避免重复操作，并在执行具有后果的操作前应用你通常的权限和确认检查。

要将信息回传到对话中：

| 意图                                                        | Event                         |
| ------------------------------------------------------------- | ----------------------------- |
| 更改实时模型的行为或重定向对话 | `session.instructions.append` |
| 为后续响应提供静默上下文                | `session.thinking.append`     |
| 提供模型应大声朗读的信息                | `session.commentary.append`   |

如需在客户端委托之外进行更新，请使用 `delegation_id: null`。这些追加会引导实时模型；UI 变更、工具执行和取消由你的应用控制。请参阅 [发送正确类型的更新](#send-the-right-kind-of-update) 中的追加示例。

### Shared optimizations

两种委派模式都能受益于相同的后端改进：

- **为任务选择模型和推理力度。** 比较满足你准确性要求的配置。在能够可靠完成任务的前提下，使用更低的推理力度。
- **保持回答简洁。** 仅返回 GPT-Live 继续对话所需的事实和状态。避免冗长的解释，也不要为了把结果改写成语音而发起额外的模型调用。
- **减少工具延迟和不必要的调用。** 在授权任务的输入就绪时立即开始，在结果仍然有效时复用它们，并避免重复已完成查询。
- **并发运行独立任务。** 独立的查询调用可以并行执行。需要注意操作之间的依赖关系和所需的确认步骤。 `parallel_tool_calls` 允许模型请求多个调用；但自定义函数的调度和执行仍由你的应用负责。

参见 [延迟优化](https://developers.openai.com/api/docs/guides/latency-optimization) 了解通用的 Responses 指南，以及 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 以复用稳定的输入。

## 验证完整的交互

同时测试权威应用状态与客户端实际播放的音频。后端响应可能在口语结果被中断时已经完成，上下文确认仅表示已接受而非已播放。将操作 ID 与任务修订版本与委托 ID 区分开，使重连、重试与延迟到达的结果不会重复或逆转某个动作。

使用 [评估语音 智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 用于可重复测试。对于现有的 Realtime 工具循环或链式后端，请遵循 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).