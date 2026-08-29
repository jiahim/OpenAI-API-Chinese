# Realtime and audio

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

从你想构建的目标开始。Realtime 会话最适合需要低延迟的实时音频。基于请求的音频 API 最适合文件、有边界的请求或不需要实时会话的生成式语音。

## 常见用例



  - **[Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents)**：构建能够倾听、推理、说话并调用工具的语音转语音 智能体。
- **[实时翻译](https://developers.openai.com/api/docs/guides/realtime-translation)**：通过专用的实时翻译会话来翻译现场语音。
- **[转录](https://developers.openai.com/api/docs/guides/transcription)**：流式传输实时转录增量或将音频文件处理为文本。
- **[语音生成](https://developers.openai.com/api/docs/guides/text-to-speech)**：将文本转换为听起来自然的口语音频。



## 了解不同的架构

<table>
  <thead>
    <tr>
      <th>Goal</th>
      <th>Model or API</th>
      <th>Start here</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Build a low-latency voice agent</td>
      <td className="whitespace-nowrap">
        [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)
      </td>
      <td>
        [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents)
      </td>
    </tr>
    <tr>
      <td>Translate live speech into another language</td>
      <td className="whitespace-nowrap">
        [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate)
      </td>
      <td>
        [Realtime translation](https://developers.openai.com/api/docs/guides/realtime-translation)
      </td>
    </tr>
    <tr>
      <td>Transcribe live audio into streaming text</td>
      <td className="whitespace-nowrap">
        [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)
      </td>
      <td>
        [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
      </td>
    </tr>
    <tr>
      <td>Transcribe files or bounded audio requests</td>
      <td>Audio transcription models</td>
      <td>
        [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text)
      </td>
    </tr>
    <tr>
      <td>Generate speech from text</td>
      <td>Speech generation models</td>
      <td>
        [Text to speech](https://developers.openai.com/api/docs/guides/text-to-speech)
      </td>
    </tr>
    <tr>
      <td>Add audio to an existing Chat Completions app</td>
      <td>Audio-capable chat models</td>
      <td>
        [Audio and speech](https://developers.openai.com/api/docs/guides/audio#add-audio-to-your-existing-application)
      </td>
    </tr>
  </tbody>
</table>

## 选择实时会话

Realtime 会话会在你的应用发送音频、接收事件以及更新会话状态时保持连接处于打开状态。

<table>
  <thead>
    <tr>
      <th>Session type</th>
      <th>Use when</th>
      <th>Endpoint or pattern</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Voice-agent session</td>
      <td>
        The model should respond to the user, call tools, and manage
        conversation state.
      </td>
      <td>
        Conversation session on `/v1/realtime`
      </td>
    </tr>
    <tr>
      <td>Translation session</td>
      <td>The app should continuously translate speech as it arrives.</td>
      <td>
        Continuous translation session on `/v1/realtime/translations`
      </td>
    </tr>
    <tr>
      <td>Transcription session</td>
      <td>
        The app needs streaming transcript deltas without model-generated spoken
        responses.
      </td>
      <td>Transcription session that emits transcript deltas</td>
    </tr>
  </tbody>
</table>

当你的应用需要一个回应用户的助手时，请使用 voice-智能体 会话。当你的应用需要一个翻译说话人的口译员时，请使用翻译会话。当你的应用需要从音频中获取文字而不需要模型生成的回应时，请使用转录会话。

### 语音智能体会话

语音智能体会话使用标准的 Realtime API 对话生命周期。客户端连接到 `/v1/realtime`，发送音频或文本，并监听模型响应、工具调用和会话事件。

对于大多数浏览器语音智能体，请从 [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents) 指南开始。它使用 Agents SDK 与 WebRTC 来处理浏览器音频，并可连接到服务端工具。

Realtime 2 为语音到语音工作流增加了推理能力。请从
  `reasoning.effort` 设置为 `low` 开始，适用于大多数生产环境的语音智能体，然后根据
  调整，参考延迟容忍度和任务复杂度。参阅 [Realtime 提示
  指南](https://developers.openai.com/api/docs/guides/realtime-models-prompting) 以优化推理、
  开场白、工具使用、不清晰音频的处理以及精确的实体捕获。

### Translation sessions

实时翻译使用专用的翻译端点，而不是标准的语音智能体端点。翻译会话是连续的：客户端将会话中的音频以流式传入，服务端以流式返回翻译后的音频和转录增量。

翻译会话不使用常规的助手回合生命周期。请勿调用 `response.create`，也不要在翻译开始前等待客户端提交用户回合。对于浏览器媒体，请使用 WebRTC。对于电话通话或广播接入等服务端媒体管道，请使用 WebSockets。

请参阅 [实时翻译](https://developers.openai.com/api/docs/guides/realtime-translation) 了解专用端点、会话配置和架构模式。

### 转录会话

你可以通过多种方式转录音频。当你的应用需要从流式音频获取实时转录增量时，请使用实时转录会话。使用 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text) 指南了解文件上传、基于请求的转录、翻译或说话人标记工作流。

如需实时转录， [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 可让你控制延迟。较低的延迟设置会更快产出部分文本，而较高的延迟设置可以提升转录质量。在选择生产环境的默认值之前，请结合实际的音频条件、目标语言、口音和领域词汇进行测试。

请参阅 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 文档了解会话配置和事件处理。

## 选择连接方式

根据你的应用捕获和播放音频的位置选择传输方式：

[WebRTC



      Use for browser and mobile clients that capture or play audio directly.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[WebSocket



      Use when your server already receives raw audio from a media pipeline, call
    system, or worker.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[SIP



      Use for telephony voice agents. Confirm model support before using SIP for
    translation or transcription.](https://developers.openai.com/api/docs/guides/realtime-sip)

## 安全标识符

如果你的应用能识别独立终端用户，请在每次 Realtime [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 随 Realtime API 请求一起发送。OpenAI 推荐使用安全标识符，但不强制要求。它们有助于 OpenAI 检测有害行为，并将处置范围定位到具体用户而非你的整个组织。请使用稳定且保护隐私的值，例如经过哈希处理的内部用户 ID。

对于 Realtime API 请求，将该标识符放在 `OpenAI-Safety-Identifier` 请求头中。使用临时令牌时，请在创建客户端密钥的 服务端 请求上设置该请求头，以将该标识符与会话关联。当通过受信服务器使用 WebSocket 或统一 WebRTC 接口连接时，请在连接请求上设置该请求头。

安全标识符不会从 Responses API 请求或其他会话中沿用。如果你在应用的其他地方使用了 Responses API `safety_identifier` 参数，请在创建或连接每个 Realtime 会话时传入相同的稳定值。

## Beta 到 GA 迁移

如果你仍在使用 Realtime beta 集成，请在推进新工作之前迁移到 GA 接口。最重要的变化包括：

- 移除 `OpenAI-Beta: realtime=v1` 调用 GA 接口时的请求头。
- 使用 [`POST /v1/realtime/client_secrets`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create) 为浏览器或移动客户端创建临时凭证。
- 使用 `/v1/realtime/calls` 建立 WebRTC 会话时使用。
- 为 GA 接口更新会话和事件结构。尤其是需要设置 `session.type`，并将输出音频配置移动到 `session.audio.output`，下，以及使用更新的响应事件名称，例如 `response.output_text.delta`, `response.output_audio.delta`，以及 `response.output_audio_transcript.delta`.
- 如果你正在迁移一个语音到语音的应用，可以从 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 指南开始。如果你要迁移一个转录工作流，请使用 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription).

请参阅 [Realtime 客户端事件参考](https://developers.openai.com/api/reference/resources/realtime/client-events), [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)，以及 [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents) 指南，了解当前的 GA 流程。

## 相关指南

- [Realtime prompting guide](https://developers.openai.com/api/docs/guides/realtime-models-prompting)：对 Realtime 语音模型进行提示与调优。
- [Managing conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)：使用 Realtime 会话生命周期。
- [Realtime translation](https://developers.openai.com/api/docs/guides/realtime-translation)：通过专用翻译会话翻译实时语音。
- [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription)：从音频流式传输实时转录增量。
- [Realtime with tools](https://developers.openai.com/api/docs/guides/realtime-mcp)：将函数工具、MCP 服务器和连接器连接到 Realtime 会话。
- [Webhooks 和 服务端 controls](https://developers.openai.com/api/docs/guides/realtime-server-controls)：从你的服务器控制 Realtime 会话。
- [Managing costs](https://developers.openai.com/api/docs/guides/realtime-costs)：跟踪并优化 Realtime API 用量。

使用 [音频和语音](https://developers.openai.com/api/docs/guides/audio) 了解背后的核心概念
  音频输入、音频输出、流式传输、延迟、转录以及语音
  生成。当你准备选择实现路径时，请参考本概述
  。