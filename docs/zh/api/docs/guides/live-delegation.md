# GPT-Live 中的委托与工具

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

GPT-Live 将推理与工具调用委托给后端，由它来管理口语对话。后端工作可以走已配置的 Responses 模型，也可以在客户端委托模式下使用你的应用所运行的任何模型、智能体 或服务。无论哪种模式，权限、确认流程、业务记录以及任务状态都由你的应用掌控。

阅读更多 [如何在委托与工具场景中引导实时模型](https://developers.openai.com/api/docs/guides/live-prompting#delegation) 的内容，请参见提示指南。





## 选择委托模式

使用 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)**,GPT-Live 会调用你选择的 Responses 模型,提供对话上下文,并将后端结果返回到实时对话中。使用 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)**,由你的应用准备上下文,运行 智能体 或 工作流,并将结果返回给 GPT-Live。

当其托管的 工作流 适用时,可以从 Responses 委托开始。当需要对后端上下文、执行过程或返回给 GPT-Live 的结果进行更多控制时,选择客户端委托。




| 考量因素                 | 在以下情况下优先选择 Responses 委托……                                                                           | 在以下情况下优先选择客户端委托……                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **实施工作量**     | 你希望 GPT-Live 负责准备后端请求、管理连接，并将结果返回到对话中。 | 你希望自行构建并运维这些部分。                                                      |
| **复核后端结果** | 后端输出可直接返回给 GPT-Live。                                                            | 你必须在结果到达 GPT-Live 之前对其进行校验、脱敏、合并或丢弃。           |
| **后端能力**      | 你的工作流与 GPT-Live 支持的 Responses 设置和工具相匹配。                                 | 你需要使用托管配置之外的其他后端、多个模型，或超出托管配置的API能力。          |
| **上下文归属**         | GPT-Live 提供的对话上下文符合你的应用需求。                                       | 你需要精确选择每次后端请求所接收的历史、记忆和应用状态。    |
| **执行策略**          | 已配置的模型和工具循环能够满足该任务。                                                            | 你需要在后端各步骤之间进行自定义路由、设置回退、检查点或预算。 |




例如，一个旅行助手可以将航班状态问题发送给航空公司服务，并将行程变更交给一个单独的规划智能体。应用负责选择调用哪个后端，以及向 GPT-Live 返回哪些已校验的结果。

在两种模式下，你的应用负责管理任务状态，并在运行自定义工具前强制执行权限和必需的确认。审核后端结果是一个独立的决策：它既不会批准 GPT-Live 所说的每一个字，也不会在校验运行期间保证静默。请参阅 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).

客户端委托还要求你的应用 [维护对话上下文](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application)。委托事件仅包含元数据，不包含任务文本；请使用 transcript 事件和应用状态来准备后端请求。

在你的实际工作负载上比较延迟、任务成功率和成本， [评估你的语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)。时。关于你现有架构的迁移指导，请参阅 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration#choose-your-delegation-mode).

在创建会话时选择模式；要更改模式，请开启一个新会话。

{/* prettier-ignore */}


## 配置 Responses 委托

在创建 Live 会话时添加此委托配置 [创建你的 Live 会话](https://developers.openai.com/api/docs/guides/live)。独立于语音模型选择 Responses 模型：

```javascript
/** @type {import("openai/resources/live/live").SessionConfig} */
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


从 [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，开始，或尝试 [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 用于对成本敏感的工作负载。在你的任务上比较答案质量和延迟后再选择后端模型。

在 `delegation.responses.tools`。中注册受支持的工具。使用 `delegation.responses.tool_choice` 控制后端可以使用的工具： `"auto"` 允许它自主选择， `"required"` 要求进行一次工具调用，而 `"none"` 则禁止调用。你也可以选择一个具名函数。将 `delegation.responses.parallel_tool_calls` 设置为 `true` 以允许同时独立查找，或设置为 `false` 以在调用必须按顺序执行时使用。你的应用仍然执行其自定义函数并强制依赖关系和审批。这些设置不会强制实时模型进行委托。

Responses 配置在创建时需要一个后端 `model` 。它支持 `function` 定义和 `web_search` 中的条目 `tools`。它还公开了 `max_output_tokens` （设置时至少为 16）， `service_tier`，以及所选后端模型支持的 `reasoning` 和 `text` 设置。请参阅 [降低后端延迟](#reduce-backend-latency) ，了解你可以调整的设置。

如果你的模型和项目支持 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) ，在对延迟敏感的调用中可以考虑使用它。对于 GPT-Live，可通过以下方式启用： `delegation.responses.service_tier: "priority"`.

随着对话变化，发送 `session.update` 以及 `session.delegation.responses` 的变更，以更新后端模型、指令、可用工具， `tool_choice`，或其他受支持的设置，而无需开启新的 Live 会话。省略的设置保留其原值。设置 `delegation` 设置为 `null` 会选中客户端模式，且无法重置正在运行的 Responses 会话；切换模式时会因 `immutable_field_update`.

这些设置使用了熟悉的 Responses 概念，但 Live 仅支持 Responses API 的一个子集。Live 提供对话上下文并发起委托工作。请通过会话配置后端；Live `response.create` 命令将使用该配置，且不接受独立的 Responses 请求体。

## 在你的应用中引导实时对话

Responses 委托机制负责管理后端工作流，但你的应用仍然可以直接向 GPT-Live 模型发送上下文。如果通过旁路 WebSocket 或主事件连接监听该调用，你可以使用 `session.instructions.append`, `session.thinking.append`，或 `session.commentary.append` 配合 `delegation_id: null`。例如，基于转录的护栏可以追加一条指令来引导对话转向。该指令用于引导实时模型的行为，但不会更改 Responses 后端提示，也不会取消已进行中的工作。

## 处理 Responses 委托

对于基于 Responses 的工作， `session.delegation.created` 具有 `target: "responses"` 和一个 `response_id`。后续的 Responses 事件将在一个 `response.event` 信封内到达：

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

根据 `envelope.event.type` 进行分发，并保留外层 `delegation_id`。不要将每个顶层 `response.*` 值都当作未包装的 Responses 事件处理。要容忍额外的嵌套 Responses 生命周期事件。

实时语音和委托的工作会独立继续。后端响应完成本身并不意味着用户已听到答案。请使用 Live 输出转录和音频来处理交互中的语音部分。

### Complete a client-actionable function call

从嵌套的 `response.output_item.done` 事件中读取已完成的函数调用。已结束的函数项包含 `call_id`, `name`，以及 `arguments`；单独的 arguments-done 事件不足以识别该调用。

跟踪嵌套 `response.created` 的 response ID，同时记录外层的 `delegation_id`，并从 `response.output_item.done`。中收集该 response 的函数调用。转发的生命周期快照刻意省略 `response.output: []`，包括在 `response.completed`；处；它们的 `tools` 数组为空， `instructions` 是 `null`，以及 `input` 被省略。空的终止输出列表并 **不** 意味着没有待处理的函数调用。请使用已收集的调用来判断在继续之前必须提交哪些结果。

执行完授权操作后，将结果作为 Responses 项追加：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


然后显式继续该 response：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


在继续之前提交每个待处理工具调用的所有必需结果。追加函数结果不会自动继续该 response。 `response.item.create` 没有独立的成功确认；请继续处理错误以及随后嵌套的 response 生命周期。

`response.create` 是一个用于创建或继续已委派 Responses 工作的 Live 命令，使用会话配置的后端。请勿附加 Responses API 的创建请求体、后端模型覆盖，或 `delegation_id` 到该事件。两个命令都需要 Responses 委托。

  

  


## 配置客户端委托

Set `delegation` 时 [创建你的 Live 会话](https://developers.openai.com/api/docs/guides/live):

```javascript
/** @type {import("openai/resources/live/live").SessionConfig} */
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {"model": "gpt-live-1", "delegation": {"type": "client"}}
```


This selects client delegation for the session. Configure the backend separately: your application chooses its model or service, instructions, tools, and how to route work. If you use the Responses API for that backend, set its model and tools in your own Responses requests. The Live session does not configure or run those backend tools.

When GPT-Live requests help, your application builds the backend request from conversation and application context, runs the work, and decides which results to send back. Enforce permissions and required confirmations before executing your tools. Retain the full conversation history in your application so you can provide the relevant context for each backend request.

## 在你的应用中保持对话上下文

对于客户端委派， **请自行收集转录内容并维护当前任务状态**.

监听 `session.input_transcript.delta` 和 `session.output_transcript.delta`。这些事件包含以下内容的转录文本 `delta`，以及 `start_ms` 和 `end_ms` 时间戳。请保留足够的历史记录，以理解诸如“好的”之类的简短回复、诸如“星期四，不是星期五”之类的更正，以及之前提供的细节。转录片段并非完整的用户轮次，且转录可能存在错误。

单独的 `session.delegation.created` 事件包含一个 `offset_ms` 时间戳和委派元数据，包括 `delegation.id` 和 `delegation.target`。它不 **不** 包含用户的发言或任务文本。请使用转录事件和应用程序状态来判断用户的需求。请保存 `delegation.id` 以便你能够将后续更新与该请求进行匹配。

请在后端保留长期记录和完整的工具输出。如果你创建了一个新的会话来替换，请从你的应用程序恢复相关上下文，并在重复执行任何操作之前检查已经运行过的动作。

### 接收客户端委派

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

阅读 `event.delegation.id`。交接对象包含元数据，而非任务文本。请维护你自己的交接工作处理器所需的转录内容和应用上下文。当前的 ID 具有 `item_` 前缀，如下所示；请将完整 ID 视为不透明内容并原样返回，而不是构造或解析它。

使用该 ID 返回结果：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


使用 `session.thinking.append` 在不朗读的情况下向模型的内部推理追加信息。使用 `session.commentary.append` 传入模型应朗读的结果；模型经过训练会对追加的文本进行改述。所有追加都包含一个纯字符串，并且需要 `delegation_id`，包括其值为 `null`。的情况。非空 ID 必须指向一个已知的客户端交接。

重复的结果追加可以延续同一个客户端交接。追加的确认会在预估的上下文注入之后到达；它并不能证明模型已经消费或朗读了该结果，也不能证明外部动作已成功执行。



## 从你现有的后端提示开始

以现有的文本智能体提示词作为起点。保留其在后端的任务指令和业务规则，并改写那些假设为文本聊天或直接控制语音的指令。说明如何处理语音转写文本并返回有用的结果。在你的应用中强制执行权限和必需的确认。

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

将大型结构化载荷、冗长的工具输出以及用于展示的 Markdown 保存在后端。向 GPT-Live 提供相关事实，让它自行决定如何表达。一个简洁的工具结果无需再额外调用模型来改写为语音输出。

采用客户端委托时， [直接将结果返回给 GPT-Live](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation)；采用 Responses 委托时，遵循 [函数结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call) 以继续后端工作。

下方SDK事件示例使用 `connection`，它基于来自 [连接指南](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。中已连接的主 Live WebSocket 或旁路通道。 `session.started` 在主连接上调用该辅助函数；已附加的旁路通道已属于正在运行的会话。

## 发送合适类型的更新

根据 GPT-Live 应如何使用该内容来选择事件：

| 你想要发送的内容                                                                                       | 事件                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 面向实时模型的系统级指令，例如问候、披露或停止说话的指示 | `session.instructions.append` |
| 用于内部推理的信息，不会在追加时朗读，但可用于回答相关的用户问题             | `session.thinking.append`     |
| 模型应朗读的信息，以转述追加的文本                                    | `session.commentary.append`   |

三者都使用纯字符串 `content`，每次追加最多 500 个 token。包含 `delegation_id`：使用原始的客户端委托 ID 来更新该任务，或 `null` 用于通用会话上下文。非空 ID 必须对应一个已知的客户端委托。指令仍然作用于实时会话；ID 并不会把指令变成独立的后端提示词。

追加的指令可以打断模型当前的语音或行为。当应用需要重定向对话时使用它；在应用状态中强制执行任何相关的工具或动作阻止。

对于客户端管理任务中的静默进度更新：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


对于已确认的预订，发送用户应当听到的结果：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


仅在实际预订成功之后再发送该结果。对于会话级指令，使用 `session.instructions.append` 配合 `delegation_id: null`.

例如，在你的应用根据其护栏阻止了一个请求后，你可以重定向对话：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


该指令不会取消后端工作。 [阻止受影响的动作并处理已运行的任何工作](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) ，在你的应用中完成。

对应的确认信息位于 `session.thinking.appended`, `session.commentary.appended`，以及 `session.instructions.appended`。将它们的 `client_event_id` 与你发出的 `event_id`。进行匹配。确认信息等待的是预估的上下文注入完成，而不是语音或播放结束。参见 [上下文到达模型时](https://developers.openai.com/api/docs/guides/live-conversations#understand-when-context-reaches-the-model) 了解时序与错误处理。

静默上下文仍会影响模型之后所说的内容。它并非存放秘密或隐藏推理的私密场所。应当发送有用的事实与简短的进度摘要。

## 保持更新内容准确且实用

在较长的任务中，当有用的事情发生变化时发送更新：一个步骤完成、出现重要延迟或需要用户回答问题时。

使用 `session.thinking.append` 用于在客户端模式下报告后台进度。使用 `session.commentary.append` 当更新适合大声说出来时使用。

对于口头更新，发送 `session.commentary.append` 并附带与任务已验证状态相符的内容：

| State                  | Example content                            |
| ---------------------- | ------------------------------------------ |
| Still working          | “I'm checking the available appointments.” |
| Completed              | “You're booked for Thursday at 2:00 PM.”   |
| Failed                 | “That time is no longer available.”        |
| Cancellation confirmed | “Your appointment has been canceled.”      |

语音中断不会自动取消后端任务。如果用户把周五改成周四，应更新当前任务并忽略迟到的周五结果。你的应用必须自行决定是取消、改动还是让任务继续运行。在确认已取消之前，请先核实取消是否真的成功。

在重试失败的工具调用之前，应先检查原始操作是否已经发生。例如，丢失的响应不应导致重复预订。如果结果不明确，应如实告知并提供下一步有用的操作。

## 共享 UI 上下文

向 GPT-Live 提供当前页面或任务的简洁摘要、相关选择项，以及有助于解读诸如“此选项”等引用的关键事实。摘要应直接从应用状态构建，无需额外调用模型来格式化。

在会话开始时以及相关状态发生变化时发送 UI 上下文。跳过未发生变化的更新，并将快速的变化合并为对最新状态的简短摘要。对先前选择项的修改需明确标出：

- **初始上下文：** “用户正在查看一项餐厅预订：8 月 6 日晚上 7 点，两位客人。尚未进行任何预订。”
- **更正：** “现在选定的时间为晚上 8 点；之前的选择是晚上 7 点。”

在任一委托模式下，均可使用 `session.thinking.append` 配合 `delegation_id: null` 发送 [后台上下文更新](https://developers.openai.com/api/docs/guides/live-conversations#add-context-during-the-conversation)。请将完整的 HTML、DOM 树、大型 JSON 负载和交互日志保留在你的应用或后端中，并将页面内容视为参考数据而非指令。

### 接受类型化输入

如果调用者输入的是一个精确值（例如订单号），请将其传递给处理该任务的后端。纯语音应用不需要走这条路径。将输入的值作为用户数据保留，而非实时模型的指令。

{/* prettier-ignore */}


使用 Responses 委托时，为后端排队一条用户消息：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


发送 `response.create` 即可开始运行或继续后端。如果后端正在等待函数结果，请先返回所有必需的结果。仅排队文本并不会取消已经在运行的任务。

  

  


使用客户端委托时，将输入的值直接发送给处理该对话的后端。如果它是对运行中任务的更正，请更新该任务而不是再次启动相同的工作。你可以使用 `session.thinking.append`，将一个简短的事实性摘要镜像到实时会话中，或者使用 `session.commentary.append` 发送一个用户应该听到的结果。



## 添加图片和视觉上下文

为了帮助通话方讨论照片或屏幕，你可以将图像和来自你应用的相关上下文发送到一个具备视觉能力的后端。后端会解析图像，并将相关文本返回给 GPT-Live 以便在对话中使用。Live 音频前端不接受直接的图像输入。

{/* prettier-ignore */}


使用 Responses 委托时，配置一个具备视觉能力的后端模型。将一个支持的 Responses 图像输入项加入队列，并附带 `response.item.create`，然后发送 `response.create` 以运行或恢复后端工作。在继续之前返回所有必需的待处理函数结果。参见 [处理 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#handle-responses-delegation).

  

  


使用客户端委托时，将视觉输入与相关对话及应用状态一起发送到处理委托请求的后端。使用 [客户端结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation).



将后端图像输入与 `session.input`，保持分开，后者会在启动时用文本历史为 Live 前端提供种子内容。参见 [图像与视觉](https://developers.openai.com/api/docs/guides/images-vision) 了解支持的图像格式和模型限制。

## 降低后端延迟

缩短后端工作请求与对话中可用结果之间的时间。衡量每个阶段 [的延迟以定位瓶颈](https://developers.openai.com/api/docs/guides/voice-agents#measure-latency) 位置。对相同场景下有用的语音响应时间和任务成功率进行比较，并查看 [语音 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 以获取评估指南。

{/* prettier-ignore */}


### Responses 委托

Live 管理与 Responses 之间持久的 WebSocket 连接，预先准备连接和已知的请求配置，并在可用时复用先前的响应状态。你无需为托管后端实现这些步骤。复用取决于当前活动连接和兼容的状态；它不保证一定能命中缓存或获得特定的延迟。

通过以下方式调优后端 `delegation.responses`:

- `model`: 选择独立于语音模型处理推理和工具选择的模型。
- `reasoning.effort`: 使用该模型支持的值，在推理时间和任务质量之间取得平衡。
- `service_tier`: 使用 `auto`, `default`, `flex`，或 `priority`，前提是模型支持并具备项目访问权限。 `auto` 遵循项目配置。评估你所选层级的性能和成本。

在会话期间更新支持的设置，使用 `session.update`。你的自定义工具仍会在你的应用中运行，因此即使 Live 管理着 Responses 连接，缓慢的服务调用、队列以及工具结果缓冲仍可能延迟响应。请及时返回每个必需的工具结果，并 [继续后端响应](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call).

  

  


### 客户端委派

从收到委派到返回结果之间的整个调用链由你的应用负责。请在语音会话运行期间提前准备好这条调用链：

- **复用后端连接。** 在多次委托之间保持 API 客户端及其连接池存活。对于重复的 Responses 调用，可考虑使用持久的 [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode).
- **准备好已知配置。** 在首次请求需要之前初始化指令、工具和连接。Responses WebSocket 模式也支持在生成前预热已知的请求状态；请遵循其 [设置指南](https://developers.openai.com/api/docs/guides/websocket-mode#connect-and-create-responses).
- **流式返回有用的结果。** 使用以下方式返回连贯、经过验证的片段： `session.commentary.append`。使用 `session.thinking.append` 表示静默进度。保留客户端委托 ID 以及每次 append 500 个 token 的上限。将私有推理保留在后端，并在宣布成功之前确认操作。
- **保持可复用输入的稳定。** 保留指令、工具定义及顺序，以及未更改的历史前缀。当后端支持缓存和 延续 时，将新信息追加到可复用内容之后。
- **避免不必要的缓冲。** 一旦有用结果就绪就立即转发。仅缓冲到足以对输出进行分类并形成连贯片段的程度。优先使用结构化的阶段元数据；如果使用文本前缀来区分进度和结果，请在转发文本之前等待完整的前缀出现。

在将此路径与 Responses 委托进行比较时，测量第一个有用的口播回答。



### 对转写片段作出反应

在你的应用中处理转录片段是可选的，适用于任一委托模式。用户和助手 [转录片段](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 通过 WebSocket 或 WebRTC 数据通道到达。你可以在委托事件到达之前，使用应用逻辑或轻量模型对其进行处理以提前开始工作，或者直接使用转录本身来触发应用自身的工作。

你可以使用此模式来：

- **减少等待时间。** 在掌握足够信息时启动推测式查询，例如在用户继续描述其偏好时检查可用性。
- **运行护栏。** 检查不断增长的对话记录，找出需要介入的请求或响应。参见 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails).
- **调整对话。** 留意可能暗示困惑或不满的措辞，然后调整体验或发送一条针对性指令。
- **更新界面。** 高亮相关控件，填充建议字段，或在结果可用时立即展示它们。

对于浏览器应用，使用 WebRTC 数据通道来传输字幕和本地 UI 更新。当转写文本处理在你的服务端运行时——例如用于护栏、轻量级模型检查或推测性的工具调用——请使用 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 来接收事件并直接引导同一个 GPT-Live 会话。

在出现有意义的新信息时处理累积的文本。片段可能不完整,后续语音也可能改变请求。丢弃过时的结果,并与后续委派任务协调以避免重复操作,同时在执行有后果的操作前应用你通常的权限与确认检查。

要将信息反馈回对话中:

| 意图                                                        | 事件                         |
| ------------------------------------------------------------- | ----------------------------- |
| 改变实时模型的行为或重定向对话 | `session.instructions.append` |
| 为后续响应提供静默上下文                | `session.thinking.append`     |
| 提供模型应当朗读出来的信息                | `session.commentary.append`   |

对于客户端委派之外的更新，请使用 `delegation_id: null`。这些追加内容用于引导实时模型；你的应用负责控制 UI 变更、工具执行和取消。请参阅 [发送正确类型的更新](#send-the-right-kind-of-update) 以查看 append 示例。

### 共享优化

两种委托模式都能受益于相同的后端改进：

- **为任务选择模型和推理强度。** 对比满足你准确性要求的配置。当较低推理强度即可稳定完成任务时，优先使用较低推理强度。
- **保持回答简洁。** 返回 GPT-Live 继续对话所需的事实和状态。避免冗长的解释，也不要为了把结果改写成语音而额外调用模型。
- **减少工具延迟和多余的调用。** 在输入就绪时立即开始已授权的工作，在结果仍然有效时复用它们，并避免重复已完成的一次性查询。
- **并发运行独立的工作。** 相互独立的查询调用可以一起执行。但要注意动作所依赖的前置条件和所需的确认。 `parallel_tool_calls` 允许模型一次性请求多个调用；而你应用仍然负责调度和执行自定义函数。

请参阅 [延迟优化](https://developers.openai.com/api/docs/guides/latency-optimization) 了解通用的 Responses 指南，以及 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 以复用稳定的输入。

## 验证完整的交互

同时测试权威应用状态和客户端播放的音频。后端响应可能在语音结果被打断时就已经完成，上下文确认（context acknowledgment）只表示已接受而非已播放。将操作 ID 和任务修订与委托 ID 分开，以确保重连、重试和延迟到达的结果不会重复或反转操作。

使用 [评估语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 以进行可重复的测试。对于现有的 Realtime 工具循环或链式后端，请遵循 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).