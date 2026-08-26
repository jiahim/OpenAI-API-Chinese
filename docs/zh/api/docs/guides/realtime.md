# 实时与音频

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

从你想要构建的结果出发。实时会话最适合需要低延迟的实时音频。基于请求的 API 最适合文件、有界请求或不需要实时会话的生成语音。

## 常见用例



  - **[语音智能体](https://developers.openai.com/api/docs/guides/voice-agents)**：构建能够聆听、推理、说话并调用工具的语音到语音智能体。
- **[实时翻译](https://developers.openai.com/api/docs/guides/realtime-translation)**：使用专用的实时翻译会话翻译现场语音。
- **[转录](https://developers.openai.com/api/docs/guides/transcription)**：流式传输实时转录增量或将音频文件处理为文本。
- **[语音生成](https://developers.openai.com/api/docs/guides/text-to-speech)**：将文本转换为自然逼真的口语音频。



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

实时会话保持连接打开，同时你的应用发送音频、接收事件并更新会话状态。

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

当你的应用需要能够响应用户的助手时，使用语音智能体会话。当你的应用需要翻译说话者的口译员时，使用翻译会话。当你的应用需要从音频中获取文本而无需模型生成响应时，使用转录会话。

### 语音智能体会话

语音智能体会话使用标准 API 对话生命周期。客户端连接到 `/v1/realtime`，发送音频或文本，并监听模型响应、工具调用和会话事件。

对于大多数浏览器语音智能体，请从 [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents) 指南开始。它使用 Agents SDK 配合 WebRTC 实现浏览器音频，并可连接服务端工具。

Realtime 2 为语音到语音工作流增加了推理能力。从
  `reasoning.effort` 设为 `low` 开始，适用于大多数生产级语音智能体，然后根据
  调整延迟容忍度和任务复杂度。使用 [Realtime prompting
  指南](https://developers.openai.com/api/docs/guides/realtime-models-prompting) 来调优推理、
  前言、工具使用、不清晰的音频和精确实体捕获。

### 翻译会话

实时翻译使用专用的翻译端点，而非标准的语音智能体端点。翻译会话是连续的：客户端将音频流式传输到会话中，服务端将翻译后的音频和转录增量流式传输出来。

翻译会话不使用正常的助手回合生命周期。不要调用 `response.create`，也不要等待客户端提交用户回合后再开始翻译。对于浏览器媒体，请使用 WebRTC。对于服务端媒体管道（如电话呼叫或广播输入），请使用 WebSockets。

参见 [实时翻译](https://developers.openai.com/api/docs/guides/realtime-translation) 了解专用端点、会话配置和架构模式。

### 转录会话

你可以通过多种方式转录音频。当你的应用需要从流式音频中获取实时转录增量时，请使用实时转录会话。请参阅 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text) 指南，了解文件上传、基于请求的转录、翻译或说话人标记工作流。

对于实时转录， [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 让你可以控制延迟。较低的延迟设置会产生更早的部分文本，而较高的延迟设置可以提高转录质量。在选择生产默认值之前，请使用你的真实音频条件、目标语言、口音和领域词汇进行测试。

查看 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 了解会话配置和事件处理。

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

如果您的应用程序识别单个最终用户，请包含 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 用于实时 API 请求。OpenAI 推荐使用安全标识符，但不强制要求。它们有助于 OpenAI 检测有害行为，并将执法目标锁定在单个用户而非您的整个组织。请使用稳定的、注重隐私的值，例如内部用户 ID 的哈希值。

对于实时 API 请求，请在 `OpenAI-Safety-Identifier` 标头中发送标识符。使用临时令牌时，请在创建客户端密钥的服务器端请求中设置该标头，以将会话与标识符关联。从受信任的服务器通过 WebSocket 或统一的 WebRTC 接口连接时，请在连接请求中设置该标头。

安全标识符不会从 Responses API 请求或其他会话中继承。如果您在应用程序的其他地方使用 Responses API `safety_identifier` 参数，请在创建或连接每个实时会话时传递相同的稳定值。

## Beta 到 GA 迁移

如果你仍有 beta 版 Realtime 集成，请在继续新工作之前将其迁移到 GA 接口。最重要的变化是：

- 移除 `OpenAI-Beta: realtime=v1` 调用 GA 接口时的标头。
- 使用 [`POST /v1/realtime/client_secrets`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create) 为浏览器或移动客户端创建临时凭据。
- 使用 `/v1/realtime/calls` 建立 WebRTC 会话时。
- 更新 GA 接口的会话和事件结构。特别是，设置 `session.type`，将输出音频配置移至 `session.audio.output`，并使用较新的响应事件名称，如 `response.output_text.delta`, `response.output_audio.delta`，以及 `response.output_audio_transcript.delta`.
- 如果你正在推进语音到语音应用，请从 [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents) 指南开始。如果你正在推进转录工作流，请使用 [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription).

请参阅 [Realtime 客户端事件参考](https://developers.openai.com/api/reference/resources/realtime/client-events), [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)，以及 [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents) 指南以了解当前的正式发布流程。

## 相关指南

- [Realtime 提示指南](https://developers.openai.com/api/docs/guides/realtime-models-prompting)：提示并调优 Realtime 语音模型。
- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)：使用 Realtime 会话生命周期。
- [Realtime 翻译](https://developers.openai.com/api/docs/guides/realtime-translation)：使用专用翻译会话翻译实时语音。
- [Realtime 转录](https://developers.openai.com/api/docs/guides/realtime-transcription)：从音频流式传输实时转录增量。
- [带工具的 Realtime](https://developers.openai.com/api/docs/guides/realtime-mcp)：将函数工具、MCP 服务器和连接器连接到 Realtime 会话。
- [Webhooks 和服务端控制](https://developers.openai.com/api/docs/guides/realtime-server-controls)：从你的服务器控制 Realtime 会话。
- [管理成本](https://developers.openai.com/api/docs/guides/realtime-costs)：跟踪并优化 Realtime API 的使用情况。

使用 [音频与语音](https://developers.openai.com/api/docs/guides/audio) 了解核心概念，包括
  音频输入、音频输出、流式传输、延迟、转录文本和语音
  生成。当你准备好选择实现
  路径时，可参考此概述。