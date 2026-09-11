# 迁移到 GPT-Live

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

GPT-Live 处理语音对话，后端处理任务推理和工具。保留你的应用逻辑、工具实现、权限和持久化状态。本次迁移将这些职责与新的语音接口连接起来。

本指南使用一个预约助手：检查可用时段，请用户确认时段，然后进行预订。从 [入门](https://developers.openai.com/api/docs/guides/live)，开始，并保留来自你现有应用的代表性对话以便比较。

## 迁移前准备

记录你的迁移应用必须保留的需求：

- **工具与业务规则：** 列出你现有的提示词、工具和工作流，包括每个动作的条件。
- **输入类型：** 明确音频、键入文本和图像在哪里进入你的应用，以及哪个后端需要它们。参见 [添加图像和视觉上下文](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).
- **依赖音频的决策：** 识别出那些除了转写文本之外还需要原始声音的决策。参见 [保留依赖音频的决策](https://developers.openai.com/api/docs/guides/live-migration?migration-path=realtime#preserve-decisions-that-depend-on-audio).
- **语音与播放：** 指定语音何时可以开始、何时必须停止，以及在音频播放前必须完成哪些检查。
- **权限与护栏：** 列出授权、确认和输入/输出检查，以及你的应用在何处强制执行它们。参见 [调整你的护栏](#adapt-your-guardrails).
- **持久化状态：** 明确你的应用在断连和新会话之间必须保留的记录、任务进度和待处理动作。
- **基线对话：** 从你当前的应用中保存具有代表性的对话及其起始状态、预期工具动作、最终应用状态和口头回复。

使用 [入门](https://developers.openai.com/api/docs/guides/live) 进行会话设置，并参考 [语音智能体评估Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 来规划你的对比方案。

## 选择你的委托模式

你现有的架构是一个有用的起点：

- **Responses 委托** 适用于 Realtime 应用，其中模型选择函数，由你的应用执行这些函数。托管 Responses 模型接管任务推理和工具选择。
- **客户端委托** 适用于已有的文本智能体或编排器。你的应用提供上下文，调用该后端，并将结果返回给 GPT-Live。

两种迁移路径都可以使用任一模式。例如，已经有独立后端智能体的 Realtime 应用可以继续使用客户端委托模式。同时还要考虑在结果到达 GPT-Live 之前，你需要对后端上下文、执行和结果审查有多大程度的控制。参见 [选择委托模式](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) 以查看完整对比。

## 选择你的迁移路径

选择与你当前应用相匹配的路径。



## 来自 Realtime API

从 [GPT-Live 提示指南](https://developers.openai.com/api/docs/guides/live-prompting)。入手。在将现有提示整体复制到语音模型之前，应先在语音模型与后端之间拆分它，而不是 `session.instructions`。将对话风格和任务委托相关的引导保留在语音提示中；将详细的工作流和工具使用说明移到后端。

**之前：** Realtime 模型负责处理语音并选择函数，例如 `check_availability` 和 `book_appointment`。你的应用负责执行这些函数并返回其结果。

**之后：** GPT-Live 负责处理语音并委托任务工作。后端负责选择相同的函数；你的应用仍然负责校验和执行它们。这里的步骤使用 Responses 进行委托。如果你仍然保留外部 智能体，请使用 [client adapter](https://developers.openai.com/api/docs/guides/live-migration?migration-path=text-agent#connect-your-existing-agent) 。

### Responses 委托机制的工作原理

在后端配置模型、指令和工具，请参考 `delegation.responses`。当 GPT-Live 判断某次请求需要后端处理时，Live 服务会调用该 Responses 模型并提供相关的对话上下文。后端会对任务进行推理并选择工具。你的应用仍然负责运行自定义函数、执行权限控制，并返回这些函数的执行结果。

以预约助手为例：

1. 用户询问周五有哪些可预约时段，GPT-Live 会将请求进行委托。
2. Responses 后端发起请求 `check_availability`.
3. 你的应用运行该函数，返回结果，并继续完成后端响应。
4. GPT-Live 利用来自后端的回答，与用户讨论可用的时段。

GPT-Live 可以在后端工作运行时保持对话继续进行。该工作完成并不意味着助手已经结束发言。参见 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 了解配置方式和完整的事件流程。

### 保留依赖音频的决策

检查现有工具决策是否依赖声学证据，例如语音信箱提示音或录音问候语的节奏。GPT-Live 会听到传入的音频，但其语音前端会委派工作，而不是发出普通的结构化函数调用。在客户端模式下， `session.delegation.created` 只携带元数据和时序，不包含原始音频、任务文本或已解析的工具参数。被委派的后端不会自动收到波形数据。

对于应答机检测，需将传入音频显式路由到具备音频能力的检测器。一种由应用管理的架构会在通话的部分时间内运行一个与 GPT-Live 并行的独立 Realtime 会话以进行评估：

1. 将传入通话音频的一份副本发送到两个会话。
2. 让检测器通过结构化函数调用上报其分类结果。根据你的 schema 校验每条结果，拒绝过时结果，并在证据不足时保持未知状态。允许后续证据修正该判断。
3. 向 GPT-Live 发送相关可信上下文，并对输出音频播放应用你应用的策略。

将人工或机器分类与录音就绪状态分开。识别到语音邮件并不意味着问候语和提示音已经结束，也不意味着可以开始录音。分类器结果或上下文确认也不能作为播放音频的许可。请使用 [适配你的护栏](#adapt-your-guardrails) 和 [播放控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed) 在应用控制的音频通路中强制执行该决策。

测试一段简短的“hello”，看其如何发展为语音邮件问候语、呼叫筛选提示，以及在语音邮件过程中有人接听的情况。如果你在通话结束前停止检测器，请测试其停止后人工接听的情况。根据这些测试以及额外的成本，决定何时停止检测器。仅凭第一次人工分类并不能说明后续检测不再必要。

### 适配连接和音频生命周期

将 Realtime 会话设置替换为 [GPT-Live 连接流程](https://developers.openai.com/api/docs/guides/live)。重新检查你的传输层启动方式和音频格式。WebRTC 通过媒体轨道传输音频，通过数据通道传输 JSON 事件。主流的 WebSocket 则在 JSON 事件中传输音频。

如果你的 Realtime 应用使用服务端连接来监控通话或强制实施护栏，请将其调整为 [GPT-Live 边带连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#attach-to-the-existing-session)。遵循 [适配你的护栏](#adapt-your-guardrails) 以了解对话检查和播放的相关变更。

| 现有 Realtime 行为                                                                            | GPT-Live 适配                                                                                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 通过以下方式发送 WebSocket 音频 `input_audio_buffer.append`.                                                | 发送 `session.input_audio.append`；其 `audio` 字段包含 base64 原始音频。                                 |
| 播放 `response.output_audio.delta` 从其 `delta` 字段。                                            | 播放 `session.output_audio.delta` 从其 `delta` 字段（按顺序）。                                             |
| 在使用手动回合控制时，提交音频或创建响应以开启一个回合。                     | 持续流式传输音频。由 GPT-Live 决定何时发言；移除手动音频提交和语音回合触发。 |
| 通过以下事件追踪音频生成和响应完成情况 `response.output_audio.done` 和 `response.done`. | GPT-Live 没有对应的事件来标记每段发言响应的结束。请在客户端中追踪播放进度。     |
| 通过输入转录事件显示用户字幕。                                                | 将 `session.input_transcript.delta` 文本追加到用户字幕。                                            |
| 通过以下来源显示助手字幕 `response.output_audio_transcript.delta`.                             | 将 `session.output_transcript.delta` 文本追加到助手字幕。                                      |

**生成与播放：** 在 Realtime 中， `response.output_audio.done` 标记音频生成的结束，而 `response.done` 标记响应流的结束。这些事件在响应被中断或不成功时也可能发生；请检查 `response.status` 在 `response.done`。两者都不能确认已缓存的音频已播放完毕。例如，服务端可能已完成生成，而客户端仍有约一秒的音频需要播放。请根据播放状态驱动“正在说话”指示器。

**字幕：** 输入转录表示用户的语音；输出转录表示助手生成的语音。启用输入转录后，Realtime 会通过 `conversation.item.input_audio_transcription.delta` 发送更新，并通过 `conversation.item.input_audio_transcription.completed`。发送最终转录文本。一个 `delta` 是一段新的文本片段。在 GPT-Live 中，由于“听”和“说”可能重叠，请将每个片段独立追加到对应说话人的字幕中。片段并不代表完整的轮次，也不能作为播放完成的确认。详见 [显示字幕](https://developers.openai.com/api/docs/guides/live-conversations#display-captions) 中的显示方法说明。

在 GPT-Live 中， `response.create` 用于启动或继续委托给 Responses 的工作。它并不授予语音模型发言的权限。对于开场问候、打断和结束会话等场景，请遵循 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).

### 拆分对话与后端指令

将对话风格和交接指引移至 `session.instructions`。将业务规则和工具使用说明移至 `delegation.responses.instructions`。对于你自行运行的后端,请将这些规则保留在现有的 prompt 中。

**调整前:单个 Realtime prompt**

```text
Help callers book appointments. Speak briefly. Check availability with the tool,
ask the caller to confirm a slot, then book it. Never claim an unverified booking.
```

**调整后:GPT-Live 对话指令**

```text
Help callers book appointments. Keep spoken replies brief. Delegate availability
checks and booking requests. Ask the caller to confirm the proposed slot.
Only announce a booking when the backend reports that it succeeded.
```

**调整后:后端指令**

```text
Use the appointment tools to check current availability. Before booking, verify
that the caller confirmed the exact slot and still has permission to book it.
Apply the latest correction. Return verified availability, booking, or failure
status with the date, time, and time zone.
```

在执行工具之前,请在你的应用中强制执行确认和权限检查。prompt 指令用于引导模型,但并不会强制执行这些检查。详见 [面向语音模型的 prompt 设计](https://developers.openai.com/api/docs/guides/live-prompting) 了解 prompt 设计。

### 适配你的函数处理器

保持对以下内容的实现： `check_availability` 和 `book_appointment`。将它们的定义从 Realtime 的 `session.tools` 或 `response.tools` 迁移到 `delegation.responses.tools`，使用 Responses 函数架构。将工具选择设置迁移到 `delegation.responses.tool_choice` 和 `delegation.responses.parallel_tool_calls`。请参阅 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation).

该函数仍然会为它的原始 `call_id`。调用返回一个结果。变化的是你的处理程序接收调用和发送结果的位置：

| 步骤                                 | Realtime API                                                                     | 使用 Responses 委托的 GPT-Live                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 接收已完成的函数调用。 | 读取 `response.output_item.done`.                                                | 解包 `response.event`，然后读取其内部 `response.output_item.done`.                                         |
| 识别并执行该操作。  | 读取该项目的 `name`, `arguments`，并 `call_id`；运行你已授权的处理程序。 | 保留该处理程序及其检查。保留外层的 `delegation_id` 以及后端响应 ID 在你的应用中。 |
| 返回每个函数结果。         | 发送 `conversation.item.create`.                                                 | 发送 `response.item.create`.                                                                                      |
| 在所有必需结果之后继续。 | 发送 `response.create`.                                                          | 发送 `response.create` 以继续后端工作。                                                                  |

例如，在 `check_availability` 返回一个已核实的槽位后，你的结果变化如下。这些是已连接会话上的消息； `call_availability` 代表你收到的实际调用 ID。

**之前：Realtime 结果**

```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "function_call_output",
    "call_id": "call_availability",
    "output": "{\"available\":true,\"slot_id\":\"slot_friday_14\",\"booked\":false}"
  }
}
```

**之后：GPT-Live 结果**

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
export function sendUpdate(connection) {
  connection.send({
    type: "response.item.create",
    event_id: "availability_result_1",
    item: {
      type: "function_call_output",
      call_id: "call_availability",
      output: '{"available":true,"slot_id":"slot_friday_14","booked":false}',
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
        "call_id": "call_availability",
        "output": '{"available":true,"slot_id":"slot_friday_14","booked":false}',
    }
    await connection.response.item.create(
        event_id="availability_result_1",
        item=item,
    )
```


在提交每个必需的函数结果后，继续执行后端：

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
export function sendUpdate(connection) {
  connection.send({
    type: "response.create",
    event_id: "continue_availability_1",
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
        event_id="continue_availability_1",
    )
```


对于初次迁移，设置 `parallel_tool_calls` 迁移到 `false` 可以简化结果处理。即使某个终结生命周期快照已 `output: []`，也要从已完成的输出项事件中收集调用。仅凭一个 arguments-done 事件无法提供函数名和 `call_id`。请遵循完整的 [function-result 流程](https://developers.openai.com/api/docs/guides/live-delegation#complete-a-client-actionable-function-call) 进行收集、输出提交和错误处理。

### 保留上下文并应用更正

Responses 委托会将相关的语音对话上下文传递给后端。请在你的应用中保留权威的预约状态：已选时段、已确认时段、权限、当前操作以及结果。实时对话历史可以被压缩；它并不是你的预约记录。

如果在某个周四时段查询仍在进行时，用户说“改成周五”，请更新该任务的修订版本并使先前的时段确认失效。在执行预约之前，检查其参数是否仍然与当前任务和确认一致。对于你应用拒绝执行的任何待处理函数调用，请返回一个准确的“已取代”或“已取消”结果，然后完成所需的输出批次再继续。如果预约已经成功，请先协调该结果与所请求的更改，再采取其他操作。

转写片段可能到达较晚，或与助手语音存在重叠。请按原样追加每个片段 `delta` 完全按照收到的内容追加，并使用 `start_ms` 和 `end_ms` 对显示内容进行分组。这些时间戳并不是确定的轮次边界或词级播放时间戳。当意图不明确时，请对重要的日期、姓名和数字进行澄清。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解转写和上下文处理方式。

**图像与屏幕上下文：** 如果你的 Realtime 应用接受图像，请将其路由到支持视觉的后端，并将相关文本返回给 GPT-Live。客户端和 Responses 委托都支持此模式。参见 [添加图像和视觉上下文](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).

  


  


## 从文本智能体或链式管道

**之前：** 一个文本智能体接收书面请求，并使用其工具和已保存的状态。在链式（或级联）语音流水线中，会在该智能体之前加入语音转文字，之后加入文字转语音。

**之后：** GPT-Live 提供语音接口，并将任务工作委托给你现有的智能体。在链式流水线中，它取代了独立的语音转文字和文字转语音阶段。请将模型、指令、工具、工作流以及持久化状态保留在你的后端，因为它们仍然适用于该任务。

### 连接你现有的智能体

在 `delegation` 期间 `{"type":"client"}` 期间进行 [会话设置](https://developers.openai.com/api/docs/guides/live)。你的应用会收到类似这样的通知：

```json
{
  "type": "session.delegation.created",
  "offset_ms": 1000,
  "delegation": {
    "id": "item_appointment_1",
    "type": "delegation",
    "target": "client"
  }
}
```

该通知包含元数据，不包含请求文本、工具参数或完整的对话记录。请保持实际的 `delegation.id` 不变。由近期带有角色标签的对话片段和已核实的应用状态（包括当前任务和最新更正）组装 智能体 的输入。一次委派可能在对 transcripts 中出现完整句子之前到达。如果现有上下文无法确定该请求，请在采取行动前收集更多上下文或请求澄清。

在文本应用中，你可以将用户的最新消息直接传递给 智能体。使用 GPT-Live 时，添加一个适配器以提供该上下文并返回一个简洁、经过核实的结

将客户端委派连接到你的 智能体

```javascript
/**
 * @typedef {{revision: number, recentConversation: string, task: string}} Context
 * @typedef {import("openai/resources/live/live").ServerEvent} Notice
 * @typedef {import("openai/resources/live/live").CommentaryAppendEvent} Update
 * @param {Notice} event
 * @param {{readContext: () => Context | null, runAgent: (context: Context) => Promise<string>, currentRevision: () => number, send: (event: Update) => void}} app
 */
async function handleDelegation(event, app) {
  if (
    event.type !== "session.delegation.created" ||
    event.delegation?.target !== "client"
  )
    return;

  const context = app.readContext();
  if (!context) return; // Retain the notice; resolve the request before acting.

  const summary = await app.runAgent({
    revision: context.revision,
    recentConversation: context.recentConversation,
    task: context.task,
  });

  if (app.currentRevision() !== context.revision) return;

  app.send({
    type: "session.commentary.append",
    event_id: crypto.randomUUID(),
    delegation_id: event.delegation.id,
    content: summary,
  });
}
```

```python
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from uuid import uuid4

from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.live.server_event import ServerEvent


@dataclass(frozen=True)
class Context:
    revision: int
    recent_conversation: str
    task: str


async def handle_delegation(
    event: ServerEvent,
    connection: AsyncLiveConnection | AsyncSidebandConnection,
    *,
    read_context: Callable[[], Context | None],
    run_agent: Callable[[Context], Awaitable[str]],
    current_revision: Callable[[], int],
) -> None:
    if (
        event.type != "session.delegation.created"
        or event.delegation.target != "client"
    ):
        return
    context = read_context()
    if context is None:
        return  # Retain the notice; resolve the request before acting.
    summary = await run_agent(context)
    if current_revision() != context.revision:
        return
    await connection.session.commentary.append(
        event_id=str(uuid4()),
        delegation_id=event.delegation.id,
        content=summary,
    )
```


适配器使用应用回调读取上下文、运行你的 智能体，并检查当前任务版本；这些不是 SDK 方法。上下文回调返回一个就绪快照，其中包含最近的对话和当前任务，或者在请求仍不明确时不返回快照。智能体 回调会调用你现有的 智能体 并返回一个不超过 500 个 token 的已核实摘要。在 JavaScript 中，应用提供的 `send` 回调会在你的 Live 连接上发送 JSON 事件。在 Python 中，适配器通过 SDK `connection` 直接发送更新。

如果上下文尚未就绪，请保留该通知，并在解决请求后再次调用适配器。在调用此适配器之前，在你的应用中认领该次委派，以防重复传递导致同一操作被启动两次。授权、确认、操作 ID 和重试决策均由你的后端负责。版本检查可防止此适配器播报过时结果；在执行诸如预订等副作用之前，后端还必须检查当前版本。

对于预约助手，上下文应当确定请求的日期和时区、之前已提供的时段、任何已确认的时段以及最新的更正。可用性结果应说明某个时段可用，并且尚未进行预订。仅在预订成功后才返回预订确认。参见 [客户端委派](https://developers.openai.com/api/docs/guides/live-delegation#receive-a-client-delegation) 了解完整的设置和结果流程。

### 路由更新与修正

在后端保留结构化工具输出与工作流详情，向 GPT-Live 返回简短的事实性更新：

- 使用 `session.thinking.append` 用于后台进度，例如仍在运行的查找操作。
- 使用 `session.commentary.append` 用于用户应听到的已验证结果。
- 使用 `session.instructions.append` 用于应用层撰写的行为指引。

这三者均接受纯字符串 `content` 最多 500 个 token 的内容，并要求 `delegation_id`。请使用原始的客户端委派 ID 处理相关工作，或 `null` 用于通用会话上下文。通过 `client_event_id`。匹配追加确认。接受并不代表语音或回放的建立。参见 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update).

当用户说“实际上，改成周五”时，请更新当前任务及其修订，使任何针对周四的确认失效，并将现有 智能体 引向更正后的请求。决定是取消、修改，还是让挂起的查找完成。在将过期结果返回给 GPT-Live 之前将其丢弃。语音中的打断不会取消后端操作，取消请求也不能证明某个操作已被取消。

后端工作可能比语音会话持续更久。请将其状态保存在你的应用中。在之后的语音交互中，使用已保存的相关上下文开启一个新会话；参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).

### 调整文本与语音防护措施

文本 智能体 可以在显示回复之前完成并验证回复。链式管线可以在将完整回复发送到文本转语音之前对其进行验证。GPT-Live 可以在后端工作仍在运行时进行语音输出，因此暂缓工具结果或后端 延续 不会阻止所有语音输出。

关注 [适配你的护栏](#adapt-your-guardrails) 以保留检查并处理连续语音。

将键入输入连接到现有后端。将键入的更正视为对同一任务的更新，并将相关的已验证上下文发送到语音会话。请参阅 [接受键入输入](https://developers.openai.com/api/docs/guides/live-delegation#accept-typed-input) 和 [保持更新准确且有用](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful).



## 调整你的护栏

在从任一架构迁移时，保留你现有应用中的输入和输出防护措施。GPT-Live 可以在后端工作和策略检查运行期间继续说话，因此请同时对对话和你后端执行的操作应用检查。

使用 [边带 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 在你的服务器需要独立访问浏览器持有的会话时使用。你的服务器可以接收转录内容并发送纠正指令，同时音频保持在 WebRTC 上。如果它已经拥有主 WebSocket，则使用该事件流；Responses 委托不需要额外的边带。

1. 监听用户和助手的事件日志，并随着对话一起运行你的检查。
2. 在应用代码中阻止受影响的工具和外部动作。在支持的情况下取消应用自身拥有的相关工作，并防止延迟到达的结果继续一个已被阻止的请求。
3. Send `session.instructions.append` 以重定向助手，并将该决策记录在你的应用中。

例如,如果来电者要求预约助手在未经授权的情况下修改他人的预约记录,请在预约操作执行前将其拦截。然后指示助手说明它无法执行此修改。需要同时验证未变更的预约记录与语音回复;仅靠拒绝并不能强制执行授权。

纠错指令无法撤回已被听到的音频。如果检查必须在播放前完成,请在你应用控制的音频路径中加入缓冲与审批,并考虑由此增加的延迟。完整流程、纠错指令示例以及播放控制请参阅 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) ,其中包含完整的流程、纠错指令示例以及播放控制。必需的开场用语,请参阅 [提供披露](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure).

## 验证迁移

将迁移后的助手与当前应用中具有代表性的对话进行比较。保持场景、后端工具和成功标准的一致性，重复每个场景，并记录有意的行为变更以及回归问题：

- **操作与语音确认：** 检查可用性、请求确认，并仅在确认后的时段进行预订。分别验证后端结果、语音回复和客户端播放。
- **修正与重复预订防护：** 在请求处于待处理状态时，将星期四改为星期五。丢弃过时结果，并确保重试不会产生重复预订。
- **权限：** 尝试执行未授权操作以及未确认的预订。检查应用策略是否阻止了执行。
- **护栏干预：** 在语音交互期间以及工具执行期间触发检查。验证纠正性语音、被阻止的操作、迟到的结果处理，以及播放恢复。包含耗时较长的检查和误报情况。
- **打断：** 在助手正在说话或处理任务时进行插话。分别验证对话、音频播放以及后端任务状态。
- **故障与重连：** 演练工具错误、结果丢失以及连接中断。在重试前调和不确定的结果，并在新会话中恢复相关的已保存上下文。

使用 [降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency) 来调优迁移后的后端。比较有用的语音响应时间和任务成功情况与 [语音智能体评估Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)，并使用 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost) 来比较使用情况和成本。