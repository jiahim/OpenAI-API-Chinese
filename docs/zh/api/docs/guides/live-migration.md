# 迁移到 GPT-Live

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

GPT-Live 处理听与说。后端决定如何完成任务以及调用哪些工具。保留你现有的工具实现、权限检查以及已保存的任务记录。在迁移期间，将该后端连接到 GPT-Live，并决定哪些指令属于哪个模型。

本指南使用一个预约助手：检查可用时段，请用户确认时段，然后进行预约。从 [入门指南](https://developers.openai.com/api/docs/guides/live)，开始，并保留你现有应用中的代表性对话以便对比。

## 在迁移之前

记录你迁移后的应用程序必须保留的需求：

- **工具和业务规则：** 列出你现有的提示、工具和工作流，以及每个动作对应的条件。
- **输入类型：** 确定音频、键入文本和图像从哪里进入你的应用，以及哪个后端需要它们。参见 [添加图像和视觉上下文](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).
- **依赖音频的决策：** 找出需要原始声音（而非仅凭转录文本）才能做出的决策。参见 [保留依赖音频的决策](https://developers.openai.com/api/docs/guides/live-migration?migration-path=realtime#preserve-decisions-that-depend-on-audio).
- **语音与播放：** 明确语音何时可以开始、何时必须停止，以及在音频播放之前必须完成哪些检查。
- **权限和护栏：** 列出授权、确认以及输入/输出检查，以及你的应用在何处强制执行它们。参见 [调整你的护栏](#adapt-your-guardrails).
- **持久化状态：** 确定你的应用在断连和新会话之间必须保留的记录、任务进度和待处理动作。
- **基线对话：** 从你当前的应用中保存有代表性的对话及其起始状态、预期工具动作、最终应用状态和语音回复。

使用 [入门指南](https://developers.openai.com/api/docs/guides/live) 进行会话设置，并参考 [语音智能体评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) 来规划你的比较。

## 选择你的委托模式

选择谁来运行后端：

- **Responses 委托：** 配置一个托管的 Responses 模型来推理任务并选择工具。由你的应用执行自定义函数并返回其结果。当你的 Realtime 模型当前正在选择这些函数时，这是一个有用的起点。
- **客户端委托：** 保留你现有的 智能体或编排器。由你的应用提供其对话上下文，启动其工作，并决定将哪些结果发送给 GPT-Live。

任一模式都支持任一种迁移路径。例如，带有独立后端 智能体 的 Realtime 应用，可通过客户端委托的方式保留该 智能体。请参阅 [选择委托模式](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) 以获取完整对比。

## 选择你的迁移路径

从…开始 [来自 Realtime API](https://developers.openai.com/api/docs/guides/live-migration?migration-path=realtime#from-realtime-api) 当你的当前语音模型选择工具时。从…开始 [来自文本智能体或链式流水线](https://developers.openai.com/api/docs/guides/live-migration?migration-path=text-agent#from-a-text-agent-or-chained-pipeline) 当你保留现有智能体并添加 GPT-Live 作为其语音接口时。



## Realtime API

从 [GPT-Live 提示指南](https://developers.openai.com/api/docs/guides/live-prompting)。入手。将你现有的提示在语音模型与后端之间拆分，而不是原封不动地复制到 `session.instructions`。中。在语音提示中保留对话风格和任务委派指引；将详细的工作流和工具使用说明迁移到后端。

**改动前：** Realtime 模型负责处理语音并选择函数，例如 `check_availability` 和 `book_appointment`。你的应用执行这些函数并返回其结果。

**改动后：** GPT-Live 负责处理语音并委派任务工作。后端负责选择同样的函数；你的应用仍然负责校验并执行它们。此处的步骤使用 Responses 委派。如果你保留外部的智能体，请使用 [客户端适配器](https://developers.openai.com/api/docs/guides/live-migration?migration-path=text-agent#connect-your-existing-agent) 替代。

### Responses 委托的工作原理

在以下位置配置后端模型、指令和工具： `delegation.responses`。当 GPT-Live 判断某个请求需要后端处理时，Live 服务会调用该 Responses 模型，并提供相关的对话上下文。后端会对任务进行推理并选择工具。你的应用仍然负责运行自定义函数、执行权限控制并返回其结果。

对于预约助手：

1. 用户询问周五有哪些可用的预约，GPT-Live 将该请求进行委托。
2. Responses 后端发起请求 `check_availability`.
3. 你的应用运行该函数，返回其结果，并继续后端响应。
4. GPT-Live 利用后端返回的答案与用户讨论可用的时间段。

GPT-Live 可以在后端处理期间继续说话。请分别追踪后端任务和音频播放：使用工具结果更新任务状态，使用播放器的状态更新说话指示器。详见 [交接与工具](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) 以了解配置方式和完整的事件流程。

### 适配连接与音频生命周期

使用 [GPT-Live 连接流程](https://developers.openai.com/api/docs/guides/live)。替换 Realtime 会话设置。重新检查你的传输层启动方式和音频格式。WebRTC 通过媒体轨道传输音频，通过数据通道传输 JSON 事件。主 WebSocket 在 JSON 事件中传输音频。

如果你的 Realtime 应用使用服务端连接来监控通话或实施护栏，请将其适配到 [GPT-Live 边带连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#attach-to-the-existing-session)。请按照 [适配你的护栏](#adapt-your-guardrails) 中的说明，了解对话检查和播放相关的变更。

| 现有 Realtime 行为                                                                            | GPT-Live 适配                                                                                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 通过以下方式发送 WebSocket 音频 `input_audio_buffer.append`.                                                | 发送 `session.input_audio.append`; 其 `audio` 字段包含 base64 原始音频。                                 |
| 从其 `response.output_audio.delta` 字段 `delta` 播放。                                            | 从其 `session.output_audio.delta` 字段 `delta` 字段，依次发送。                                             |
| 在使用手动轮次控制时，提交音频或创建响应以开启一个轮次。                     | 持续流式传输音频。GPT-Live 自行决定何时说话；移除手动音频提交和语音轮次触发。 |
| 通过以下方式追踪音频生成和响应完成 `response.output_audio.done` 和 `response.done`. | GPT-Live 没有对应的事件来标记每个口语响应的结束。请在客户端中追踪播放状态。     |
| 根据输入转录事件显示用户字幕。                                                | 将 `session.input_transcript.delta` 文本追加到用户字幕。                                            |
| 从以下来源显示助手字幕 `response.output_audio_transcript.delta`.                             | 将 `session.output_transcript.delta` 文本追加到助手字幕。                                      |

**生成与播放：** 由你的音频播放器驱动说话指示器。服务端可能已经完成生成，而播放器仍有一秒左右的音频排队待播。在 Realtime 中， `response.output_audio.done` 表示生成结束， `response.done` 结束响应流；请检查 `response.status` 以确认是否被中断或失败。GPT-Live 没有等效的事件来表示每段语音响应的结束。

**字幕：** 当启用输入转写时，Realtime 通过 `conversation.item.input_audio_transcription.delta` 发送文本片段，并通过 `conversation.item.input_audio_transcription.completed`。发送最终转写文本。在 GPT-Live 中，将每个片段追加到主叫方或助手的字幕中；两者可能同时变化。你的应用决定如何对文本进行分组，并通过音频播放器跟踪播放进度。详见 [显示字幕](https://developers.openai.com/api/docs/guides/live-conversations#display-captions).

使用 `response.create` 以启动或继续委托的 Responses 工作。GPT-Live 在倾听对话的过程中自行决定何时说话。对于启动问候、打断与会话结束，请遵循 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).

### 分离对话与后端指令

将会话风格和交接指引迁移到 `session.instructions`。将业务规则和工具使用说明迁移到 `delegation.responses.instructions`。对于你自建的后端，请将这些规则保留在其现有提示中。

**Before：单个 Realtime 提示**

```text
Help callers book appointments. Speak briefly. Check availability with the tool,
ask the caller to confirm a slot, then book it. Never claim an unverified booking.
```

**After：GPT-Live 会话说明**

```text
Help callers book appointments. Keep spoken replies brief. Delegate availability
checks and booking requests. Ask the caller to confirm the proposed slot.
Only announce a booking when the backend reports that it succeeded.
```

**After：后端说明**

```text
Use the appointment tools to check current availability. Before booking, verify
that the caller confirmed the exact slot and still has permission to book it.
Apply the latest correction. Return verified availability, booking, or failure
status with the date, time, and time zone.
```

在执行工具之前，请在你的应用中强制执行确认和权限检查。提示说明用于引导模型，它们不会强制执行这些检查。参阅 [为语音模型设计提示](https://developers.openai.com/api/docs/guides/live-prompting) 以了解提示设计。

### 适配你的函数处理器

保持对 `check_availability` 和 `book_appointment`。的实现。将它们的定义从 Realtime 的 `session.tools` 或 `response.tools` 移至 `delegation.responses.tools`，使用 Responses 函数架构。将工具选择设置移至 `delegation.responses.tool_choice` 和 `delegation.responses.parallel_tool_calls`。参见 [配置 Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation).

该函数仍会为其原始 `call_id`。返回结果。发生变化的是你的处理器接收调用和发送结果的位置：

| 步骤                                 | Realtime API                                                                     | 通过 Responses 委托的 GPT-Live                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 接收已完成的函数调用。 | 读取 `response.output_item.done`.                                                | 展开 `response.event`，然后读取其内部 `response.output_item.done`.                                         |
| 识别并执行操作。  | 读取该项的 `name`, `arguments`，并 `call_id`；运行你已授权的处理函数。 | 保留该处理函数及其校验。在你的应用中保留外层 `delegation_id` 以及后端响应 ID。 |
| 返回每个函数结果。         | 发送 `conversation.item.create`.                                                 | 发送 `response.item.create`.                                                                                      |
| 在所有必需结果返回后继续。 | 发送 `response.create`.                                                          | 发送 `response.create` 以继续后端工作。                                                                  |

例如，在 `check_availability` 返回一个已校验的槽位后，在已连接的会话上发送以下内容。请将 `call_availability` 替换为你收到的调用 ID。

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


提交完所有必需的函数结果后，继续后端调用：

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


在初始迁移时，设置 `parallel_tool_calls` 移至 `false` 以一次处理一个工具调用。从内部的 `response.output_item.done` 事件中收集每个函数调用，并保留其名称、参数以及 `call_id`。即使后续的完成事件中包含 `output: []`，也请保留该记录。在运行处理器之前等待已完成的项；仅 arguments-done 事件缺少函数名称和 `call_id`。请遵循完整的 [函数结果流程](https://developers.openai.com/api/docs/guides/live-delegation#complete-a-client-actionable-function-call) 以进行收集、输出提交和错误处理。

### 保留上下文并应用修正

Responses 委托会向服务端提供相关的语音对话上下文。在你的应用中保留权威的预约状态：已选时段、已确认时段、权限、当前操作以及结果。实时对话历史可能会被压缩，它并不是你的预约记录。

当用户说“其实改成周五”时，将周五记录为当前请求，并清除对周四的任何确认。为该任务赋予新的版本号（例如 revision 2），以便你的应用能够识别先前请求的结果。

在执行预约之前，检查日期、时段和确认信息是否仍然与当前请求一致。如果你因用户更改了请求而拒绝某个待处理的函数调用，请返回一个说明该调用已被跳过或取消的结果，以与实际发生的情况一致。在继续服务端流程之前，为每个必需调用提交一个结果。

如果周四的预约已经成功，请先检查其当前状态，并在尝试进行下一次预约之前处理好用户请求的更改。

按收到的原样保留每个转写片段及其说话人， `start_ms`，以及 `end_ms`。使用该信息来更新相应的来电者或助手字幕或聊天气泡，包括片段晚到或双方同时说话的情况。在你的应用中自行选择消息边界，并在播放器中跟踪音频播放进度；转写时间戳并不对应到逐词的播放时间。在意图不确定时，澄清重要的日期、姓名和数字。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解转写与上下文处理方式。

**图像与屏幕上下文：** 如果你的 Realtime 应用接受图像，请将它们路由到具备视觉能力的服务端，并将相关文本返回给 GPT-Live。客户端和 Responses 委托都支持该模式。参见 [添加图像与视觉上下文](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).

### 保留依赖音频的决策

某些决策需要声音本身，例如检测语音信箱的提示音，或根据时机识别录制的问候语。GPT-Live 会听到通话内容，但委托并不会自动将音频发送到你的后端。在客户端模式下， `session.delegation.created` 包含一个 ID 和时机信息；你的应用程序提供请求上下文以及后端所需的任何音频。

要实现应答机检测，需明确将传入的音频路由到支持音频的检测器。一种由应用管理的评估架构是：在通话的一部分时间内，将一个独立的 Realtime 会话与 GPT-Live 并行运行：

1. 将传入通话音频的副本发送到两个会话。
2. 让检测器通过结构化函数调用报告其分类结果。根据你的模式检查每个结果，拒绝过期的结果，并在证据不足时保持未知状态。允许后续证据修正该决策。
3. 将相关可信上下文发送给 GPT-Live，并将你应用的策略应用于外发音频播放。

追踪两个决策：你是在与人还是与机器通话，以及接收方是否已准备好录制你的留言。检测器可能在问候语仍在播放时就识别出语音信箱。在允许输出音频之前，等待你的应用所需的证据。上下文确认用于记录对本次更新的接受；是否实际播放仍由你的应用决定。使用 [适配你的护栏](#adapt-your-guardrails) 和 [播放控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed) 来在你的应用所控制的音频路径中强制实施该决策。

测试一段简短的“你好”，使其发展为语音信箱问候语、呼叫筛选提示，以及在语音信箱过程中有人接听。如果你计划在通话结束前停止检测器，请测试之后有人接听时会发生什么。结合这些结果与检测器增加的运行成本，决定其应运行多长时间。还要涵盖初始被归类为“人”的情况随着更多音频到来而发生变化的用例。

  


  


## 从文本 智能体 或链式管道

**改动前：** 一个文本智能体接收书面请求，并使用其工具和已保存的状态。链式（或级联）语音流水线在该智能体之前加入语音转文字步骤，在其后加入文字转语音步骤。

**改动后：** GPT-Live 提供语音接口，并将任务委派给你现有的智能体。对于链式流水线，它取代了单独的语音转文字和文字转语音阶段。将模型、指令、工具、工作流和持久化状态保留在后端，因为它们仍然适合完成相应任务。

### 连接你现有的智能体

Configure `delegation` as `{"type":"client"}` during [session setup](https://developers.openai.com/api/docs/guides/live)。你的应用会收到如下通知：

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

使用此通知来启动应用的委托处理器。请保留 `delegation.id` ，以便将结果附加到同一请求。你的处理器会根据调用者和助手的消息记录以及你的应用所持有的任务记录来准备智能体的输入；该通知本身不包含请求文本或工具参数。

例如，预约智能体可能会收到：

> 来电者：“其实改成周五。”
>
> 当前请求：在来电者所在时区查找周五的预约时段。
>
> 先前结果：曾提供周四下午 2 点。
>
> 确认：尚未确认任何周五时段。
>
> 任务修订：2。

通知可能在完整句子转写完成之前到达。请保留通知直到获得足够上下文，或者在采取行动之前请来电者澄清。

在文本应用中，你可以将用户的最新消息直接传递给 智能体。使用 GPT-Live 时，添加一个适配器来提供该上下文并返回简洁且经过验证的结果。

在调用适配器之前，记录委托 ID，以便只有一个处理器为其启动工作。如果请求不明确，请在上下文就绪后再次调用适配器。

你的后端仍然负责授权、确认、操作 ID 和重试。在修改预约之前，请检查任务的当前修订版本。适配器后续的修订版本检查仅防止过时结果被播报；它无法撤销已经完成的预约。

将客户端委托连接到你的 智能体

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


在应用中实现 context 和 智能体 回调。context 回调返回最近的对话和当前任务，或在请求仍不明确时返回空值。智能体 回调运行你现有的后端，并返回不超过 500 个 token 的经过验证的摘要。在 JavaScript 中，由应用提供的 `send` 回调通过你的 Live 连接发送 JSON 事件。在 Python 中，适配器通过 SDK `connection` 直接发送更新。

对于预约助手，context 应确定所请求的日期和时区、之前提供的可选时段、任何已确认的时段以及最新的更正。可用性结果应说明某个时段可用且尚未进行预约。仅在预约成功后才返回预约确认。详见 [客户端委托](https://developers.openai.com/api/docs/guides/live-delegation#receive-a-client-delegation) 以了解完整的设置和结果流程。

### 路由更新与更正

将结构化工具输出和工作流详情保留在你的后端。向 GPT-Live 返回简短的事实性更新：

- 用于 `session.thinking.append` 后台进度，例如仍在运行的查找操作。
- 用于 `session.commentary.append` 用户应当听到的已验证结果。
- 用于 `session.instructions.append` 由应用撰写的行为指导。

三者均接受纯字符串 `content` 最多 500 个 token，并要求 `delegation_id`。请对相关工作使用原始的客户端委托 ID，或 `null` 用于一般的会话上下文。请使用 `client_event_id`。将每条确认与所发送的命令进行匹配。这可以确认更新已被接受。使用助手转录事件来观察生成的语音，并使用播放器的状态来跟踪播放进度。请参阅 [发送正确类型的更新](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update).

当用户说“改成周五”时，将周五保存为当前请求，推进其版本号，并清除对周四的任何确认。将该更正发送到你现有的智能体。决定是请求取消周四的查找、对其进行修改，还是让其完成并丢弃其结果。

在将查找报告为已取消之前，请跟踪其状态。即使用户的中断已导致助手停止语音，也要处理该后端决定。

后端工作可能比语音会话持续更久。请在应用中持久化其状态。在之后的语音交互中，使用相关已保存的上下文启动新会话；请参阅 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).

### 让键入输入与你的智能体保持连接

保持键入输入与你现有后端的连接。将键入更正视为对同一任务的更新，并将相关已验证上下文发送给语音会话。参见 [接受键入输入](https://developers.openai.com/api/docs/guides/live-delegation#accept-typed-input) 和 [保持更新准确且有用](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful).

### 适配文本与语音安全防护措施

一个文本智能体或链式管道可以在显示或播放完整回复之前对其进行校验。借助 GPT-Live，对话和后端工作可同时进行。如果每个口语回复在被用户听到之前都必须通过校验，请将该校验放在你的应用所控制的音频播放路径中。仅持有后端结果无法暂停所有语音播放。

接下来 [适配你的护栏](#adapt-your-guardrails) 以保留你的校验并兼顾持续语音。



## 调整你的护栏

从任一架构迁移时，保留现有应用中的输入和输出安全防护。GPT-Live 可以在后端工作和策略检查运行期间继续说话，因此请对会话以及后端执行的操作都应用这些检查。

如果你的服务器需要监控或控制浏览器的 WebRTC 会话，请附加一个 [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) 以接收转录内容并发送修正指令。音频通过 WebRTC 继续传输。如果你的服务器已经通过主 WebSocket 串流音频，请使用该连接的事件流进行这些检查。仅选择 Responses 委托本身并不需要 sideband。

1. 监听用户和助手的消息事件，并在会话过程中并行运行你的检查。
2. 在应用代码中阻止受影响的工具和外部操作。在支持的情况下取消应用自身持有的相关工作，并防止延迟到达的结果继续处理被阻止的请求。
3. 发送 `session.instructions.append` 以重定向助手，并将该决策记录在你的应用中。

例如，如果来电者要求预约助手在未经授权的情况下修改他人的预约，请在预约操作执行前阻止该操作。然后指示助手说明无法进行修改。同时核对未变更的预约记录和口头回复；仅凭拒绝并不足以强制执行授权。

纠正性指令无法撤回已经播放的音频。如果你的应用需要在播放前检查助手语音，请参阅 [在播放前检查语音](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#check-speech-before-playback) 了解缓冲、审批、中断和恢复处理方式。请参阅 [应用会话护栏](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) 了解操作控制和纠正性指令示例。有关必需的开场措辞，请参阅 [提供披露说明](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure).

## 验证迁移

将迁移后的智能体与你当前应用中的代表性对话进行比较。保持场景、后台工具和成功标准一致，重复每个场景，并记录有意的行为变更以及回归问题：

- **操作和语音确认：** 检查可用性、请求确认，并且仅在已确认的时间段上进行预订。分别验证后端结果、语音回答和客户端播放情况。
- **更正与重复防止：** 在待处理请求进行期间，将 Thursday 改为 Friday。丢弃过时结果，并确保重试不会创建第二笔预订。
- **权限：** 尝试未授权操作和未经确认的预订。检查应用策略是否阻止执行。
- **护栏干预：** 在语音和工具执行期间触发检查。验证助手收到更正、即使工具结果延迟到达受影响操作仍然被阻止，并且按预期恢复播放。检查正在运行的操作是否真正停止。包含慢速检查和误报情况。
- **打断：** 在助手正在讲话或工作时说话。分别验证对话、音频播放和后端任务状态。
- **故障与重连：** 测试工具错误、结果丢失和断开连接。如果预订请求丢失响应，重试前先检查预订是否已成功。使用已保存的任务上下文开始下一轮语音会话，并验证它从已确定的结果继续进行。

使用 [降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency) 以调优迁移后的后端。比较有用的口语响应时间和任务成功率与 [语音智能体评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation)，并使用 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost) 来比较使用情况和成本。