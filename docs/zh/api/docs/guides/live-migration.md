# 迁移到 GPT-Live

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 后访问。

GPT-Live 处理语音对话，而后端负责任务推理和工具调用。保留你的应用逻辑、工具实现、权限和持久化状态。迁移将这些职责接入新的语音界面。

本指南以预约助手为例：检查可用时间段，请用户确认时段，然后完成预约。从 [入门指南](https://developers.openai.com/api/docs/guides/live)，开始，并保留现有应用中有代表性的对话以便对比。

## 迁移前须知

记录你的已迁移应用必须保留的需求：

- **工具与业务规则：** 列出你现有的提示、工具和工作流，以及每个操作的条件。
- **输入类型：** 确定音频、键入文本和图像从何处进入你的应用，以及哪个后端需要它们。参见 [添加图像和视觉上下文](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).
- **依赖音频的决策：** 确定除了转录文本之外还需要原始声音的决策。参见 [保留依赖音频的决策](https://developers.openai.com/api/docs/guides/live-migration?migration-path=realtime#preserve-decisions-that-depend-on-audio).
- **语音与播放：** 明确语音何时可以开始、何时必须停止，以及音频播放前必须完成哪些检查。
- **权限与护栏：** 列出授权、确认和输入/输出检查，以及你的应用在何处强制执行它们。参见 [调整你的护栏](#adapt-your-guardrails).
- **持久化状态：** 确定你的应用在断开连接和新会话中必须保留的记录、任务进度和待处理操作。
- **基线对话：** 从你当前的应用中保存有代表性的对话及其起始状态、预期的工具操作、最终的应用状态和语音回复。

使用 [入门指南](https://developers.openai.com/api/docs/guides/live) 进行会话设置，并参考 [语音 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 来规划你的对比方案。

## 选择你的委托模式

你现有的架构是一个有用的起点：

- **Responses 委托** 适合 Realtime 应用，模型负责选择函数，应用负责执行函数。托管的 Responses 模型接管任务推理和工具选择。
- **客户端委托** 适合现有的文本智能体或编排器。你的应用提供上下文，调用该后端，然后将结果返回给 GPT-Live。

任一迁移路径都可以使用任一模式。例如，已经拥有独立后端智能体的 Realtime 应用可以继续配合客户端委托使用。还可以考虑在结果到达 GPT-Live 之前，你需要多少对后端上下文、执行和结果审阅的控制权。详见 [选择委托模式](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) 获取完整对比。

## 选择你的迁移路径

选择与你当前应用匹配的路径。



## 从 Realtime API

从 [GPT-Live 提示词指南](https://developers.openai.com/api/docs/guides/live-prompting)。开始。在语音模型与后端之间拆分你现有的提示词，而不是将其原封不动地复制到 `session.instructions`。中。在语音提示词中保留对话风格与任务委托指导；将详细的工作流与工具使用说明迁移到后端。

**之前：** Realtime 模型负责语音处理，并选择诸如 `check_availability` 和 `book_appointment`。等函数。你的应用负责执行这些函数并返回其结果。

**之后：** GPT-Live 负责语音处理并委托任务工作。后端选择相同的函数；你的应用仍然负责校验和执行这些函数。这里的步骤使用 Responses 委托。如果你保留了外部智能体，请改用 [客户端适配器](https://developers.openai.com/api/docs/guides/live-migration?migration-path=text-agent#connect-your-existing-agent) 。

### Responses 委托的工作原理

在 `delegation.responses`。中配置后端模型、指令和工具。当 GPT-Live 判断某个请求需要后端处理时，Live 服务会调用该 Responses 模型，并提供相关的对话上下文。后端会推理任务并选择工具。你的应用仍然负责运行自定义函数、强制执行权限，并返回这些函数的结果。

以预约助手为例：

1. 用户询问周五有哪些可预约时段，GPT-Live 委托处理该请求。
2. Responses 后端发起请求 `check_availability`.
3. 你的应用运行该函数，返回其结果，并继续生成后端响应。
4. GPT-Live 使用来自后端的回答，与用户讨论可用的时段。

GPT-Live 可以在后端任务运行期间保持对话继续进行。后端任务完成并不代表助手已经说完了话。参见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 了解配置方式和完整的事件流程。

### 保留依赖音频的决策

检查现有工具决策是否依赖声学证据，例如语音邮件提示音或录音问候语的节奏。GPT-Live 会听到传入音频，但其语音前端会委托工作，而不是发出普通的结构化函数调用。在客户端模式下， `session.delegation.created` 会携带元数据和时序，但不会携带原始音频、任务文本或已解析的工具参数。被委托的后端不会自动接收波形。

对于应答机检测，请将传入音频显式路由到支持音频的检测器。一种由应用管理的架构会在通话的某段时间内运行一个与 GPT-Live 并行的独立 Realtime 会话以进行评估：

1. 将传入通话音频的副本同时发送到两个会话。
2. 让检测器通过结构化函数调用报告其分类结果。根据你的 schema 检查每个结果，拒绝过时的结果，并在证据不足时保持未知状态。允许后续证据修正该决定。
3. 向 GPT-Live 发送相关的可信上下文,并对传出的音频回放应用你应用的策略。

将人工或机器分类与录制就绪状态分开处理。识别到语音信箱并不代表问候语和提示音已经结束，也不代表可以开始录制。分类器的结果或上下文确认也不代表获得播放音频的许可。使用 [调整你的护栏](#adapt-your-guardrails) 和 [播放控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed) 在应用控制的音频路径中强制执行该决策。

测试一段简短的“你好”，看其如何发展为语音信箱问候语、呼叫筛选提示，以及在语音信箱过程中有人接听的情况。如果你在通话结束前停止检测器，需要测试停止后是否会出现人工接听。根据这些测试以及它带来的额外成本来决定何时停止检测器。仅凭首次人工分类结果并不能说明后续检测已无必要。

### 适配连接与音频生命周期

使用 [GPT-Live 连接流程](https://developers.openai.com/api/docs/guides/live)。请重新检查你的传输层启动方式与音频格式。WebRTC 通过媒体轨道传输音频，并通过数据通道传输 JSON 事件；主 WebSocket 则在 JSON 事件中传输音频。

如果你的 Realtime 应用使用服务端连接来监控通话或实施护栏，请将其适配到 [GPT-Live 旁路连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#attach-to-the-existing-session)，并参考 [调整你的护栏](#adapt-your-guardrails) 中关于会话检查与音频播放变更的内容。

| 现有 Realtime 行为                                                                            | GPT-Live 适配                                                                                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 通过发送 WebSocket 音频 `input_audio_buffer.append`.                                                | 发送 `session.input_audio.append`；其 `audio` 字段包含 base64 原始音频。                                 |
| 播放 `response.output_audio.delta` 其 `delta` 字段中的内容。                                            | 播放 `session.output_audio.delta` 其 `delta` 字段中的音频。                                             |
| 使用手动轮次控制时，提交音频或创建响应以开启一轮对话。                     | 持续流式传输音频。由 GPT-Live 决定何时发言；移除手动音频提交和语音轮次触发。 |
| 通过以下方式跟踪音频生成和响应完成： `response.output_audio.done` 和 `response.done`. | GPT-Live 没有对应的事件来标记每个口播响应结束。请在你的客户端中跟踪播放进度。     |
| 通过输入转录事件显示用户字幕。                                                | 将 `session.input_transcript.delta` 文本追加到用户字幕中。                                            |
| 从以下来源显示助手字幕： `response.output_audio_transcript.delta`.                             | 将 `session.output_transcript.delta` 文本追加到助手字幕中。                                      |

**生成与回放：** 在 Realtime 中， `response.output_audio.done` 表示音频生成结束，而 `response.done` 表示响应流的结束。这些事件在响应被中断或未成功时也可能发生；请检查 `response.status` 中的 `response.done`。两者都不能确认已缓冲的音频已播放完毕。例如，服务端可能已经完成生成，而客户端还有一秒钟的音频要播放。“正在说话”指示应由回放状态驱动。

**字幕：** 输入转写表示用户的语音；输出转写表示助手生成的语音。启用输入转写后，Realtime 会通过 `conversation.item.input_audio_transcription.delta` 发送更新，并通过 `conversation.item.input_audio_transcription.completed`。发送最终转写文本。一个 `delta` 是一个新的文本片段。在 GPT-Live 中，由于听与说可能会重叠，应将每个片段独立追加到对应说话方的字幕中。片段不是完整的轮次，也不表示回放已完成。详见 [显示字幕](https://developers.openai.com/api/docs/guides/live-conversations#display-captions) 中的展示方法。

在 GPT-Live 中， `response.create` 用于启动或继续委托给 Responses 的工作。它并不授予语音模型说话权限。对于启动、问候、打断和结束会话等场景，请遵循 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).

### 拆分对话与后端指令

将对话风格和委托指导移入 `session.instructions`。将业务规则和工具使用说明移入 `delegation.responses.instructions`。对于你自己运行的后端，请将这些规则保留在其现有提示中。

**之前：一个 Realtime 提示**

```text
Help callers book appointments. Speak briefly. Check availability with the tool,
ask the caller to confirm a slot, then book it. Never claim an unverified booking.
```

**之后：GPT-Live 对话指令**

```text
Help callers book appointments. Keep spoken replies brief. Delegate availability
checks and booking requests. Ask the caller to confirm the proposed slot.
Only announce a booking when the backend reports that it succeeded.
```

**之后：后端指令**

```text
Use the appointment tools to check current availability. Before booking, verify
that the caller confirmed the exact slot and still has permission to book it.
Apply the latest correction. Return verified availability, booking, or failure
status with the date, time, and time zone.
```

在执行工具之前，在你的应用程序中强制执行确认和权限检查。提示指令用于引导模型；它们不会强制执行这些检查。参见 [为语音模型设计提示](https://developers.openai.com/api/docs/guides/live-prompting) 了解提示设计。

### 适配你的函数处理器

保留 `check_availability` 和 `book_appointment`。的实现。将其定义从 Realtime 的 `session.tools` 或 `response.tools` 移至 `delegation.responses.tools`，使用 Responses 函数架构。将工具选择设置移至 `delegation.responses.tool_choice` 和 `delegation.responses.parallel_tool_calls`。请参阅 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation).

该函数仍然会为其原始 `call_id`。返回一个结果。变化的是处理函数接收调用和发送结果的位置：

| Step                                 | Realtime API                                                                     | GPT-Live with Responses delegation                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 接收已完成的函数调用。 | 读取 `response.output_item.done`.                                                | 解包 `response.event`，然后读取其内部 `response.output_item.done`.                                         |
| 识别并执行该操作。  | 读取该项的 `name`, `arguments`，并 `call_id`；运行你已授权的处理器。 | 保留该处理器及其检查。在你的应用中保留外部 `delegation_id` 与后端响应 ID。 |
| 返回每个函数结果。         | 发送 `conversation.item.create`.                                                 | 发送 `response.item.create`.                                                                                      |
| 在所有必需的结果之后继续。 | 发送 `response.create`.                                                          | 发送 `response.create` 以继续后端工作。                                                                  |

例如，在 `check_availability` 返回一个已核验的槽位后，你的结果变化如下。这些是已连接会话上的消息； `call_availability` 代表你收到的实际调用 ID。

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


在提交完每个必需的函数结果后，继续后端：

```javascript
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


对于初始迁移，设置 `parallel_tool_calls` 移至 `false` 可简化结果处理。即使某个终止生命周期快照已 `output: []`，也要从已完成的输出项事件中收集调用。仅凭 arguments-done 事件无法提供函数名和 `call_id`。请遵循完整的 [函数结果流程](https://developers.openai.com/api/docs/guides/live-delegation#complete-a-client-actionable-function-call) 以完成收集、结果提交与错误处理。

### 保留上下文并应用修正

Responses 委托会将相关的语音对话上下文提供给后端。请在你的应用中保留权威的预约状态：已选时段、已确认时段、权限、当前操作以及结果。实时对话历史可以被压缩；它不是你的预约记录。

如果用户在说“改成周五”的同时有一个周四的查询挂起，请更新该任务的修订版本并使先前的时段确认失效。在执行预约前，请检查其参数是否仍与当前任务和确认匹配。对于你的应用拒绝的任何挂起函数调用，请返回准确的已被取代或已取消的结果，然后完成所需的输出批次再继续。如果预约已经成功，请在采取进一步操作之前协调该结果与所请求的更改。

转写片段可能会延迟到达或与助手语音重叠。请将每个片段 `delta` 按原样追加，并使用 `start_ms` 和 `end_ms` 来对显示进行分组。这些时间戳并非确定的轮次边界或词级播放时间戳。当意图不确定时，请澄清重要的日期、姓名和数字。详见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解转写和上下文处理。

**图像和屏幕上下文：** 如果你的 Realtime 应用接受图像，请将它们路由到具备视觉能力的后端，并将相关文本返回给 GPT-Live。客户端和 Responses 委托都支持此模式。详见 [添加图像和视觉上下文](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).

  


  


## 从文本智能体或链式管道

**之前：** 一个文本智能体接收书面请求，并使用其工具和已保存的状态。在链式（或级联）语音流水线中，会在该智能体之前加入语音转文本，并在其后加入文本转语音。

**之后：** GPT-Live 提供语音接口，并将任务委派给你现有的智能体。对于链式流水线，它取代了独立的语音转文本和文本转语音阶段。请将模型、指令、工具、工作流以及持久化状态保留在你的后端，只要它们仍然适用于该任务。

### 连接你现有的智能体

配置 `delegation` 为 `{"type":"client"}` 在 [session setup](https://developers.openai.com/api/docs/guides/live)。你的应用会收到类似如下的通知：

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

通知仅包含元数据，不包含请求文本、工具参数或完整对话记录。请保持实际 `delegation.id` 不变。从最近带有角色标签的对话片段以及经过核实的应用状态（包括当前任务和最新更正）中组装智能体的输入。委托可能在完整句子出现在对话记录之前到达。如果可用上下文不足以明确请求，请先收集更多上下文或在采取行动前请求澄清。

在文本应用中，你可能直接将用户的最新消息传递给智能体。使用 GPT-Live 时，添加一个适配器来提供该上下文，并返回简洁且经过核实的结果：

将客户端委托连接到你的智能体

```javascript
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


该适配器使用应用回调来读取上下文、运行你的智能体，并检查当前任务修订版本；这些并不是SDK方法。上下文回调返回一个就绪快照，其中包含最近的对话和当前任务；如果请求仍不明确则不返回快照。智能体回调会调用你现有的智能体，并返回最多 500 个 token 的经过核实的摘要。在 JavaScript 中，由应用提供的 `send` 回调会通过你的 Live 连接发送 JSON 事件。在 Python 中，适配器通过SDK `connection` 直接发送更新。

如果上下文未就绪，请保留通知并在解析请求后再次调用适配器。在调用该适配器之前，在你的应用中领取该委托，以避免重复送达导致同一操作被执行两次。授权、确认、操作 ID 和重试决策均由你的后端负责。修订版本检查可防止该适配器宣告过时的结果；在执行预订等副作用之前，后端还必须再次检查当前修订版本。

对于预约助手，上下文应明确所请求的日期和时区、之前提供的可选时段、任何已确认的时段以及最新的更正。可用性结果应说明某个时段可用且尚未进行任何预订。仅在预订成功后才返回预订确认。参见 [Client delegation](https://developers.openai.com/api/docs/guides/live-delegation#receive-a-client-delegation) 了解完整的设置和结果流程。

### 路由更新与更正

在后端保留结构化工具输出和工作流详细信息。向 GPT-Live 返回简短的事实性更新：

- 使用 `session.thinking.append` 用于后台进度，例如仍在运行的查找操作。
- 使用 `session.commentary.append` 用于用户应听到的已验证结果。
- 使用 `session.instructions.append` 用于应用编写的行为指导。

三者都接受纯字符串 `content` ，长度上限为 500 个 token，并且需要 `delegation_id`。相关工作使用原始的客户端委托 ID，或 `null` 用于通用会话上下文。通过 `client_event_id`。匹配 append 确认消息。接受并不等同于建立语音或播放。请参阅 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update).

当用户说“其实改成周五”时，更新当前任务及其修订版本，使任何针对周四的确认失效，并将现有智能体指向修正后的请求。决定是取消、修改，还是让挂起的查找完成。在将过期结果返回给 GPT-Live 之前将其丢弃。语音中断不会取消后端操作，取消请求也不能证明某个动作已被取消。

后端工作的持续时间可能超过语音会话。请将任务状态持久化到你的应用中。在之后的语音交互中，使用已保存的相关上下文启动新会话；请参阅 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).

### 适配文本与语音防护措施

文本智能体可以在显示回复之前完成并校验回复。链式流水线可能会在将完整回复发送至文本转语音之前对其进行校验。GPT-Live 可以在后端工作仍在运行时进行语音播报，因此扣留工具结果或后端延续不会暂停所有语音。

按照 [调整你的护栏](#adapt-your-guardrails) 操作，以保留你的校验并兼顾连续语音。

保持键入输入与现有后端相连。将键入的更正视为对同一任务的更新，并将已校验的相关上下文发送到语音会话。请参阅 [接受键入输入](https://developers.openai.com/api/docs/guides/live-delegation#accept-typed-input) 和 [保持更新准确且有用](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful).



## 适配你的护栏

在从任一架构迁移时，保留现有应用中的输入和输出安全防护。GPT-Live 可以在后端任务和策略检查运行期间继续说话，因此请对对话以及后端执行的操作都应用检查。

当你的服务器需要独立访问由浏览器持有的会话时，请使用 [边带 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 。你的服务器可以接收转录文本并在音频仍通过 WebRTC 传输的同时发送纠正指令。如果它已经拥有主 WebSocket，请使用该事件流；Responses 委托不需要额外的边带。

1. 监控用户和助手的事件记录，并在对话的同时运行你的检查。
2. 在应用代码中阻止受影响的工具和外部操作。在支持的情况下取消相关的应用自有工作，并防止迟到的结果继续被阻止的请求。
3. Send `session.instructions.append` 以重定向助手，并在你的应用中记录该决策。

例如，如果来电者让预约助手在未经授权的情况下修改他人的预约，就在预约操作执行前阻止该操作，然后指示助手解释自己无法做出该修改。需要同时核对未变的预约记录和口播回复；仅靠拒绝并不足以强制鉴权。

纠正指令无法撤回已被听到的音频。如果检查必须在播放前完成，请在由你的应用控制的音频路径中加入缓冲与审批，并考虑由此增加的延迟。遵循 [应用对话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 以了解完整流程、纠正指令示例以及播放控制。如需必备的开场措辞，请参阅 [提供披露](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure).

## 验证迁移

将迁移后的智能体与当前应用中的代表性对话进行比较。保持场景、后台工具和成功标准一致，重复每个场景，并记录有意的行为变更与回归问题：

- **动作与口头确认：** 检查可用性、请求确认，并仅在已确认的时段进行预约。分别核对后端结果、口头应答和客户端回放。
- **更正与重复预约防护：** 在待处理请求期间将星期四改为星期五。丢弃过期结果，并确保重试不会创建重复预约。
- **权限：** 尝试未经授权的动作以及未经确认的预约。检查应用程序策略是否阻止了执行。
- **护栏干预：** 在语音阶段和工具执行阶段各触发一次检查。核对纠正性语音、被阻止的动作、迟到结果的处理，以及回放恢复。需覆盖慢速检查和误报情况。
- **打断：** 在助手说话或正在处理任务时插话。分别核对对话、音频回放和后端任务状态。
- **故障与重连：** 演练工具错误、结果丢失和断连。在重试前协调不确定的结果，并在新会话中恢复相关已保存的上下文。

使用 [降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency) 以调优迁移后的后端。比较可用的口语响应时间和任务成功情况与 [语音 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)，并使用 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost) 以比较使用量和成本。