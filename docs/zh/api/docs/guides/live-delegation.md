# GPT-Live 中的交接与工具

> 完整文档索引请参见 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

GPT-Live 将推理和工具调用委托给后端处理，同时管理口语对话。后端工作可以通过配置的 Responses 模型运行，也可以在客户端委托模式下，由你的应用操作的任何模型、智能体或服务运行。无论采用哪种模式，应用都负责权限、确认、业务记录和任务状态。

详细了解 [如何引导实时模型进行委托和工具调用](https://developers.openai.com/api/docs/guides/live-prompting#delegation) ，请参阅提示指南。





## 选择委托模式

使用 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)**,GPT-Live 会调用你选择的 Responses 模型,提供对话上下文,并将后端结果返回到实时对话。使用 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)**,你的应用负责准备上下文,运行 智能体 或 工作流,并将结果回传给 GPT-Live。

如果 Responses 委托的托管 工作流 能够满足需求,可以从它开始。当你需要更精细地控制后端上下文、执行过程或返回给 GPT-Live 的结果时,选择客户端委托。




| 考量                 | 在以下情况下倾向于使用 Responses 委托…                                                                           | 在以下情况下倾向于使用客户端委托…                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **实现工作量**     | 你希望 GPT-Live 准备后端请求、管理连接，并将结果返回到对话中。 | 你希望自己构建并运维这些部分。                                                      |
| **后端结果审查** | 后端输出可直接返回给 GPT-Live。                                                            | 你的应用必须在结果到达 GPT-Live 之前对其进行校验、脱敏、合并或丢弃。           |
| **后端能力**      | 你的工作流契合 GPT-Live 支持的 Responses 设置和工具。                                 | 你需要另一个后端、多个模型，或超出托管配置范围的 API 能力。          |
| **上下文归属**         | GPT-Live 提供的对话上下文符合你的应用需求。                                       | 你需要精确选择每次后端请求所接收的历史记录、记忆和应用状态。    |
| **执行策略**          | 已配置的模型和工具循环契合任务需求。                                                            | 你需要在后端步骤之间进行自定义路由，并为代码和模型配置回退、检查点或预算。 |




例如，一个旅行助手可以将航班状态问题发送给航空公司服务，并将行程变更发送给单独的规划智能体。应用程序负责选择调用哪个后端，以及将哪些经过验证的结果返回给 GPT-Live。

在这两种模式下，你的应用程序负责管理任务状态，并在运行其自定义工具之前强制执行权限和必需的确认。审核后端结果是一个独立的决策：它不会批准 GPT-Live 所说的每一个字，也不会在验证运行期间保证静默。参见 [在需要时控制播放](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).

客户端委托还要求你的应用程序 [维护会话上下文](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application)。委托事件包含的是元数据，而非任务文本；请使用转录事件和应用程序状态来准备后端请求。

在你的实际工作负载上比较延迟、任务成功率和成本， [评估你的语音 智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)。时。有关针对你现有架构的指导，请参阅 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration#choose-your-delegation-mode).

在创建会话时选择模式；若要更改模式，请启动一个新会话。

{/* prettier-ignore */}


## 配置 Responses 委托

在以下位置添加此委托配置： [创建你的 Live 会话时](https://developers.openai.com/api/docs/guides/live)。Responses 模型与语音模型相互独立，可单独选择：

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


从 [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，开始，或尝试 [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以用于对成本敏感的工作负载。在你的任务上比较答案质量和延迟后再选择后端模型。

在以下位置注册受支持的工具： `delegation.responses.tools`。使用 `delegation.responses.tool_choice` 控制后端可使用的工具： `"auto"` 允许其自行选择， `"required"` 要求其必须调用工具，而 `"none"` 则禁止调用。你也可以选择某个具名函数。将 `delegation.responses.parallel_tool_calls` 设置为 `true` 以允许彼此独立的查找同时进行，或在调用必须按顺序执行时设置为 `false` 。你的应用仍然负责执行其自定义函数并强制依赖关系和审批流程。这些设置不会强制实时模型进行委托。

Responses 配置在创建时需要一个后端 `model` 。它支持 `function` 定义和 `web_search` 中的条目 `tools`。它还提供了 `max_output_tokens` （设置时至少为 16）， `service_tier`，以及所选后端模型支持的 `reasoning` 和 `text` 设置。详见 [降低后端延迟](#reduce-backend-latency) ，了解你可以调整的设置。

如果你的模型和项目可以使用 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) ，可考虑在对延迟敏感的调用中使用它。对于 GPT-Live，通过以下方式选择它： `delegation.responses.service_tier: "priority"`.

随着对话变化，发送 `session.update` 以及变化的内容 `session.delegation.responses` 以更新后端模型、指令、可用的工具、 `tool_choice`，或其他支持的设置，且不会启动新的 Live 会话。省略的设置会保留其值。设置 `delegation` 设置为 `null` 用于选择客户端模式，且无法重置正在运行的 Responses 会话；切换模式将失败并返回 `immutable_field_update`.

这些设置使用的是熟悉的 Responses 概念，但 Live 仅支持独立 Responses API 的一个子集。Live 提供会话上下文并启动委托任务。通过会话配置后端；Live `response.create` 命令使用该配置，且不接受独立的 Responses 请求体。

## 在你的应用中引导实时对话

Responses 交接管理着后端的工作流，但你的应用仍然可以直接向 GPT-Live 模型发送上下文。如果你通过旁路 WebSocket 或主事件连接监听该调用，可以使用 `session.instructions.append`, `session.thinking.append`，或 `session.commentary.append` 配合 `delegation_id: null`。例如，基于转录的护栏可以追加一条指令来重定向对话。这会引导实时模型，但不会更改 Responses 后端提示，也不会取消已经在进行的工作。

## 处理 Responses 委托

对于基于 Responses 的工作， `session.delegation.created` 具有 `target: "responses"` 以及一个 `response_id`。后续的 Responses 事件会在一个 `response.event` envelope 中到达:

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

依据 `envelope.event.type` 进行分发，并保留外层的 `delegation_id`。不要把每个顶层的 `response.*` 值都当作未包装的 Responses 事件处理。需要兼容 Responses 生命周期中出现的额外嵌套事件。

实时语音和已委托的工作会独立继续运行。后端响应完成本身并不意味着用户已经听到了答案。口语部分请使用 Live 的输出转录文本和音频。

### 完成一个客户端可操作的函数调用

从嵌套 `response.output_item.done` 事件中读取已完成的函数调用。已结束的函数项包含 `call_id`, `name`，和 `arguments`；仅凭一个 arguments-done 事件不足以识别该调用。

跟踪嵌套 `response.created` 中的响应 ID，同时跟踪外层的 `delegation_id`，并从该响应中收集其函数调用，位置在 `response.output_item.done`。被转发的生命周期快照刻意包含 `response.output: []`，包括在 `response.completed`；处；其 `tools` 数组为空， `instructions` 是 `null`，和 `input` 被省略。空的终止输出列表并 **不** 意味着没有待处理的函数调用。请使用已收集的调用来确定在继续之前必须提交哪些结果。

执行授权的操作后，将结果作为 Responses 项追加：

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


在继续之前为所有待处理的工具调用提交每个必需的结果。追加函数结果不会自动延续响应。 `response.item.create` 没有独立的成功确认；请继续处理错误以及后续的嵌套响应生命周期。

`response.create` 是一个用于创建或延续已委派 Responses 工作的 Live 命令，使用会话所配置的后端。请勿附加 Responses API 的创建请求体、后端模型覆盖或 `delegation_id` 添加到该事件。两个命令都需要 Responses 委托。

  

  


## 配置客户端委托

Set `delegation` when [创建你的 Live 会话时](https://developers.openai.com/api/docs/guides/live):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {"model": "gpt-live-1", "delegation": {"type": "client"}}
```


这会为该会话选择客户端委托模式。请单独配置后端：你的应用自行选择模型或服务、指令、工具以及任务路由方式。如果你使用 Responses API 作为后端，需要在你自己的 Responses 请求中设置其模型和工具。Live 会话不会配置或运行这些后端工具。

当 GPT-Live 请求协助时，你的应用会根据会话和应用上下文构建后端请求，运行相关任务，并决定将哪些结果返回给会话。在执行你的工具前，请强制进行权限校验和必要的确认。在你的应用中保留完整的会话历史，以便为每次后端请求提供相关上下文。

## 在你的应用中保留对话上下文

对于客户端委托， **自行收集转录文本并维护当前任务状态**.

监听 `session.input_transcript.delta` 和 `session.output_transcript.delta`。这些事件中包含的转录文本位于 `delta`，并附有 `start_ms` 和 `end_ms` 时间戳。保留足够的历史记录，以便理解诸如“是”这样的简短回复、“星期四，不是星期五”这样的更正，以及先前提供的细节。转录片段并不是完整的用户轮次，且转录中可能包含错误。

独立的 `session.delegation.created` 事件包含一个 `offset_ms` 时间戳和委托元数据，包括 `delegation.id` 和 `delegation.target`。它不 **不** 包含用户的发言或任务文本。利用转录事件和应用状态来判断用户的意图。保存 `delegation.id` ，以便将后续更新与该请求对应起来。

在后端保留长期记录和完整的工具输出。如果你创建了一个新的会话，请从你的应用中恢复相关上下文，并在重复执行任何操作之前检查已经运行过哪些动作。

### 接收客户端委派

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

读取 `event.delegation.id`。委托对象包含的是元数据，而非任务文本。请保留你自己的委托工作处理所需的转录内容和应用上下文。当前的 ID 带有 `item_` 前缀，如下所示；请将完整 ID 视为不透明字符串，原样返回，而不要自行构造或解析。

使用该 ID 返回一个结果：

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


使用 `session.thinking.append` 可在追加时向模型的内部推理补充信息，而不会将其说出。使用 `session.commentary.append` 可让模型将结果说出；模型经过训练会对追加的文本进行改写。所有追加内容均为纯字符串，且必须包含 `delegation_id`，即使其值为 `null`。时也是如此。非空的 ID 必须对应一个已知的客户端委托。

重复的结果追加可以延续同一个客户端委托。追加的确认会在预估的上下文注入之后到达；它并不能证明模型已经消费或说出了该结果，也不能证明外部操作已成功执行。



## 从你现有的后端提示开始

将你现有的文本智能体提示词作为起点。保留其任务指令和业务规则在后端，并调整那些假定为文本聊天或直接控制语音的指令。说明如何处理语音转写并返回有用的结果。在你的应用中强制执行权限和必需的确认。

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

在后端保留大型结构化载荷、冗长的工具输出以及用于显示的 Markdown。将相关事实交给 GPT-Live，让它自行决定如何表述。简洁的工具结果无需再调用额外的模型来改写为语音。

采用客户端委托时， [将结果直接返回给 GPT-Live](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation)。采用 Responses 委托时，遵循 [函数结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call) 以继续后端工作。

SDK 事件示例使用了 `connection`，即来自 [连接指南](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。的已连接主 Live WebSocket 或旁路通道 `session.started` 。在主连接上调用该辅助函数；已附加的旁路通道已属于正在运行的会话。

## 发送正确类型的更新

根据 GPT-Live 应如何使用该内容来选择事件：

| 你想要发送的内容                                                                                       | 事件                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 针对实时模型的系统级指令，例如问候语、披露信息或停止说话的指示 | `session.instructions.append` |
| 用于内部推理的信息，不会在追加时朗读出来，但可用于回答相关的用户问题             | `session.thinking.append`     |
| 模型应大声朗读的信息，对追加的文本进行转述                                    | `session.commentary.append`   |

三者都使用纯字符串 `content`，每次追加限制为 500 个 token。包括 `delegation_id`：针对该任务使用原始的客户端委托 ID 进行更新，或者 `null` 用于一般的会话上下文。非空 ID 必须标识一个已知的客户端委托。指令仍然适用于实时会话；ID 并不会将其转换为单独的后端提示。

追加的指令可以中断模型当前的语音或行为。当应用程序需要重定向对话时使用它；在应用状态中强制执行任何相关的工具或操作阻止。

对于客户端管理任务期间的静默进度：

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


仅在预订实际成功后才发送该结果。对于会话级指令，使用 `session.instructions.append` 配合 `delegation_id: null`.

例如，在应用程序根据其护栏阻止了某个请求之后，你可以重定向对话：

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


该指令不会取消后端工作。 [在应用状态中阻止受影响的操作并处理任何已经在运行的工作](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 。

对应的确认信息为 `session.thinking.appended`, `session.commentary.appended`，和 `session.instructions.appended`。将其匹配 `client_event_id` 到你的传出 `event_id`。确认等待的是估算的上下文注入，而不是语音或播放结束。参见 [当上下文到达模型时](https://developers.openai.com/api/docs/guides/live-conversations#understand-when-context-reaches-the-model) 了解时序和错误处理。

静默上下文仍可能影响模型后续的输出。它不是存放机密或隐藏推理的私密空间。发送有用的事实和简要的进度摘要。

## 保持更新准确且有用

在较长的任务中，当出现有用变化时发送更新：某个步骤完成、出现重要延迟，或用户需要回答问题。

使用 `session.thinking.append` 用于客户端模式下的后台进度更新。使用 `session.commentary.append` 当更新适合被大声说出来时使用。

对于语音更新，发送 `session.commentary.append` ，内容应与任务已核实的状态一致：

| State                  | Example content                            |
| ---------------------- | ------------------------------------------ |
| Still working          | “我正在查询可用的预约时段。” |
| Completed              | “你已经预约了周四下午 2:00。”   |
| Failed                 | “该时段已不可用。”        |
| Cancellation confirmed | “你的预约已取消。”      |

口头打断并不会自动取消后端任务。如果用户把 Friday 改为 Thursday，请更新当前任务并忽略迟到的 Friday 结果。你的应用必须自行决定是取消任务、修改任务，还是让它跑完。在告知用户“已取消”之前，请确认取消确实成功了。

在重试失败的工具调用之前，请检查原始操作是否已经发生。例如，响应丢失不应导致重复预订。如果结果不确定，请如实告知并提供下一步可行的操作。

## 共享 UI 上下文

为 GPT-Live 提供当前页面或任务的简明摘要、相关的选区内容，以及有助于解读诸如“此选项”之类引用的关键事实。直接从应用状态构建该摘要，无需额外的模型调用来进行格式化。

在会话开始时以及相关状态发生变化时发送 UI 上下文。跳过未发生变化的更新，并将快速连续的变化合并为一段简短的最新状态摘要。需明确指出相对于先前选区的变更：

- **初始上下文：** “用户正在查看一次餐厅预订：8 月 6 日晚上 7 点，两位客人。尚未进行预订。”
- **修正：** “所选时间现在为晚上 8 点；之前的选择为晚上 7 点。”

在任一种委托模式下，使用 `session.thinking.append` 配合 `delegation_id: null` 进行 [后台上下文更新](https://developers.openai.com/api/docs/guides/live-conversations#add-context-during-the-conversation)。将完整的 HTML、DOM 树、大型 JSON 负载以及交互日志保存在你的应用或后端中。将页面内容视为参考数据，而非指令。

### 接受类型化输入

如果调用者输入的是一个精确值（例如订单号），请将其传递给处理该任务的服务端。纯语音应用不需要此路径。请将输入的值作为用户数据传递，而不是作为实时模型的指令。

{/* prettier-ignore */}


使用 Responses 委托时，将用户消息排队到服务端：

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


发送 `response.create` 即可启动或继续运行服务端。如果服务端正在等待函数结果，请先返回所有必需的结果。仅排队文本本身并不会取消已经在运行的工作。

  

  


使用客户端委托时，请将输入的值直接发送给负责处理该对话的服务端。如果该值用于更正正在运行的任务，请更新该任务而不是重新启动相同的工作。你可以通过 `session.thinking.append`，将一条简短的客观摘要镜像到实时会话中，或者使用 `session.commentary.append` 来发送用户应当听到的结果。



## 添加图片和视觉上下文

若要帮助通话方讨论照片或屏幕，可将图像及来自应用的相应上下文发送至具备视觉能力的后端。后端会解读图像并返回相关文本，供 GPT-Live 在对话中使用。Live 音频前端不直接接受图像。

{/* prettier-ignore */}


使用 Responses 委托时，需配置一个具备视觉能力的后端模型。将受支持的 Responses 图像输入项排入队列，附带 `response.item.create`,然后发送 `response.create` 以运行或恢复后端工作。继续之前需返回所有必需的待处理函数结果。参见 [处理 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#handle-responses-delegation).

  

  


使用客户端委托时，将视觉输入连同相关对话及应用状态一并发送至负责处理委托请求的后端。通过 [客户端结果流程](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation).



请将后端图像输入与 `session.input`，区分开来,后者用于在启动时为 Live 前端填充文本历史记录。参见 [图像与视觉](https://developers.openai.com/api/docs/guides/images-vision) 以了解支持的图像格式及模型限制。

## 降低后端延迟

缩短从请求后端工作到获得对对话有用的结果之间的时间。在每个阶段测量 [延迟](https://developers.openai.com/api/docs/guides/voice-agents#measure-latency) 以定位延迟。在相同场景下比较有用的口语响应时间和任务成功率，并参阅 [语音智能体评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 获取评估指引。

{/* prettier-ignore */}


### Responses 委派

Live 管理与 Responses 的持久 WebSocket 连接，提前准备连接和已知的请求配置，并在可用时复用先前的响应状态。对于托管后端，你无需自行实现这些步骤。复用依赖于当前活动连接与兼容的状态；它并不保证一定会命中缓存或实现特定的延迟。

通过以下方式调整后端 `delegation.responses`:

- `model`: 选择独立于语音模型处理推理和工具选择的模型。
- `reasoning.effort`: 使用该模型所支持的值在推理时间和任务质量之间取得平衡。
- `service_tier`: 使用 `auto`, `default`, `flex`，或 `priority`，具体取决于模型支持和项目访问权限。 `auto` 遵循项目的配置。评估你所选层级的性能和成本。

在会话期间更新支持的设置，使用 `session.update`。你的自定义工具仍然在你的应用中运行，因此即使 Live 管理着 Responses 连接，慢速服务调用、队列以及工具结果缓冲仍可能延迟响应。请及时返回每个必需的工具结果，并 [继续后端响应](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call).

  

  


### 客户端委托

你的应用负责从收到委托到返回结果的整个流程。请在语音会话运行期间准备好该流程：

- **复用后端连接。** 在多次交接之间保持 API 客户端及其连接池处于活动状态。对于重复的 Responses 调用，可考虑使用持久的 [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode).
- **预先准备配置。** 在首次请求之前初始化指令、工具和连接。Responses WebSocket 模式还支持在生成前预热已知的请求状态；请遵循其 [配置指南](https://developers.openai.com/api/docs/guides/websocket-mode#connect-and-create-responses).
- **流式返回有用的结果。** 使用 `session.commentary.append`。返回连贯且经过校验的分块。使用 `session.thinking.append` 表示静默的进度。保留客户端委托 ID，并将每次 append 限制在 500 个 token 以内。将私有推理保留在后端，并在宣布成功之前确认操作。
- **保持可复用的输入稳定。** 保留指令、工具定义及其顺序，以及未变更的历史前缀。当你的后端支持缓存和延续时，将新增信息追加到可复用内容之后。
- **避免不必要的缓冲。** 一旦结果就绪就立即转发。只需缓冲足够的内容以对输出进行分类并组成连贯的分块。优先使用结构化的阶段元数据；若使用文本前缀来区分进度与结果，请在转发文本前等待完整的前缀出现。

在将此路径与 Responses 委托进行比较时，衡量第一个有用的语音回答。



### 对转录片段做出响应

在应用中处理转写片段是可选的，并且适用于任意委托模式。用户和助手 [转写片段](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) 会通过 WebSocket 或 WebRTC 数据通道到达。你可以在委托事件到达之前，用应用逻辑或轻量级模型处理它们以启动工作，也可以直接使用转写本身来触发应用自身的工作。

使用该模式可以：

- **减少等待。** 在掌握足够信息时启动推测式查找——例如，在用户继续描述其偏好的同时检查可用性。
- **运行护栏。** 检查不断增长的对话记录，找出需要干预的请求或响应。参见 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails).
- **调整对话。** 留意暗示困惑或不满的措辞，然后调整体验或发送针对性指令。
- **更新界面。** 突出相关控件、填充建议字段，或在结果可用时立即展示。

对于浏览器应用，使用 WebRTC 数据通道来获取字幕和本地 UI 更新。当转录处理运行在你的服务端时——例如护栏、轻量级模型检查或推测性工具调用——请使用 [旁路 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 接收事件并直接控制同一个 GPT-Live 会话。

当有意义的全新信息到达时，处理累积的文本。片段可能不完整，后续语音可能会改变请求。丢弃过时的结果，与后续委托工作协调以避免重复操作，并在执行具有后果的操作之前应用你通常的权限和确认检查。

若要将信息反馈回对话中：

| 意图                                                        | 事件                         |
| ------------------------------------------------------------- | ----------------------------- |
| 更改实时模型的行为或重定向对话 | `session.instructions.append` |
| 为后续响应提供静默上下文                | `session.thinking.append`     |
| 提供模型应朗读的信息                | `session.commentary.append`   |

对于客户端委托范围之外的更新，请使用 `delegation_id: null`。这些 append 会引导实时模型；UI 变更、工具执行和取消由你的应用控制。请参阅 [发送正确类型的更新](#send-the-right-kind-of-update) 中的 append 示例。

### Shared optimizations

两种委托模式都能受益于相同的后端改进：

- **为任务选择模型与推理投入度。** 对比满足你准确性要求的配置。当较低推理投入度即可稳定完成任务时，使用更低的投入度。
- **保持回答简洁。** 仅返回 GPT-Live 继续对话所需的事实与状态。避免冗长解释，也不要为改写结果以供语音输出而额外调用模型。
- **减少工具的延迟和不必要的调用。** 在输入就绪时启动已授权的工作；在结果仍然有效时复用结果；避免重复执行已完成的查询。
- **并发运行相互独立的工作。** 相互独立的查询调用可以同时执行。对于需要执行的操作，请遵守其依赖关系与必需的确认步骤。 `parallel_tool_calls` 使模型能够一次性请求多个调用；自定义函数的调度与执行仍由你的应用负责。

请参阅 [延迟优化](https://developers.openai.com/api/docs/guides/latency-optimization) 获取一般性的 Responses 指南，并参阅 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 以复用稳定的输入。

## 验证完整交互

同时测试权威应用状态和客户端播放的音频。后端响应可以在口语输出被中断时结束，上下文确认仅表示接受而非已播放。将操作 ID 和任务修订与委托 ID 分开，使重连、重试和延迟结果不会重复或反转某个操作。

使用 [评估语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 以进行可重复的测试。对于现有的 Realtime 工具循环或链式后端，请遵循 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).