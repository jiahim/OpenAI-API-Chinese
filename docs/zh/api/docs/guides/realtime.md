# Realtime API 入门

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。各文档页面提供 Markdown 版本，可在页面 URL 末尾追加 `.md` 获取。

使用 Realtime API 构建一个语音转语音的 智能体。该模型可直接处理音频，维护会话状态，并能调用工具。本指南从面向浏览器应用的 Agents SDK 入手；在需要直接控制时，可参考更低层的连接指南。

若要使用单独的后台委托服务进行全双工会话，请参阅 [GPT-Live](https://developers.openai.com/api/docs/guides/live)；若需对比语音架构与链式流水线，请参阅 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents).

## 构建一个语音到语音的语音智能体

当交互需要具备对话感和即时性时，请使用 Realtime API。对于需要支持插话、较低的首音频延迟、自然的轮次切换以及实时工具调用的语音智能体，这是最佳起点。

常见的浏览器流程是：

1. 你的应用服务器为该 Realtime 会话创建一个临时客户端密钥。
2. 你的前端创建一个 `RealtimeSession`.
3. 该会话在浏览器中通过 WebRTC、在服务端通过 WebSocket 进行连接。
4. 智能体 智能体在该会话内处理音频轮次、工具、中断和交接。

启动实时语音会话

```javascript
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

const agent = new RealtimeAgent({
  name: "Assistant",
  instructions: "You are a helpful voice assistant.",
});

const session = new RealtimeSession(agent, {
  model: "gpt-realtime-2.1",
});

await session.connect({
  apiKey: "ek_...(ephemeral key from your server)",
});
```


然后，像为文本会话附加工具一样，附加工具、交接和护栏到 `RealtimeAgent` 智能体 的方式附加它们。将音频传输相关的内容放在会话层，将业务逻辑放在 智能体 定义中。

当你需要更底层的控制时，从传输相关文档开始：

- [音频与语音概览](https://developers.openai.com/api/docs/guides/audio)
- [基于 WebRTC 的 Realtime API](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)
- [基于 WebSocket 的 Realtime API](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)

## 安全标识符

如果你的应用识别各个最终用户，请在 Realtime 接口 请求中随附一个 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 。API 请求中。OpenAI 建议使用安全标识符，但并不强制要求。它们可帮助 OpenAI 检测有害行为，并将强制措施定向到具体用户，而不是你的整个组织。请使用稳定的、注重隐私的值，例如哈希处理过的内部用户 ID。

对于 Realtime API 请求，请通过 `OpenAI-Safety-Identifier` 请求头发送该标识符。使用临时令牌时，请在创建客户端密钥的 服务端 请求上设置该请求头，以将标识符与会话关联。从受信任的服务器通过 WebSocket 或统一 WebRTC 接口连接时，请在连接请求上设置该请求头。

安全标识符不会从 Responses API 请求或其他会话中沿用。如果你在应用的其他地方使用 Responses API `safety_identifier` 参数，请在创建或连接每个 Realtime 会话时传入相同的稳定值。

## Beta 到 GA 迁移

如果你仍在使用 Realtime 的 beta 版本，请先迁移到 GA 接口，再继续开展新的工作。最重要的变化包括：

- 移除 `OpenAI-Beta: realtime=v1` 头信息后再调用 GA 接口。
- 使用 [`POST /v1/realtime/client_secrets`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create) 为浏览器或移动客户端创建临时凭证。
- 使用 `/v1/realtime/calls` 来建立 WebRTC 会话。
- 更新会话和事件结构以适配 GA 接口。特别是，设置 `session.type`，并将输出音频配置移至 `session.audio.output`，下，并使用新的响应事件名称，如 `response.output_text.delta`, `response.output_audio.delta`，和 `response.output_audio_transcript.delta`.
- 如果你要将语音到语音应用迁移到 GA 版本，可以从 [浏览器示例](#build-a-speech-to-speech-voice-agent)。开始。如果你要将转录工作流迁移到 GA 版本，请使用 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription).

请参阅 [Realtime 客户端事件参考](https://developers.openai.com/api/reference/resources/realtime/client-events), [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)，以及 [浏览器示例](#build-a-speech-to-speech-voice-agent) 了解当前的 GA 流程。





## 后续步骤

- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)：配置会话并处理音频、文本和事件。
- [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad)：配置自动轮次检测。
- [工具与 MCP](https://developers.openai.com/api/docs/guides/realtime-mcp)：添加函数、MCP 服务器和连接器。
- [语音模型提示](https://developers.openai.com/api/docs/guides/voice-prompting)：使用适用于你的 Realtime 模型的指南。
- [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime)：了解 Realtime 计费与缓存。
- [服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)：在你的服务端上保留工具执行与会话控制。























## 其他音频工作流

工作流 选择器和共享音频词汇表现在位于 [音频与语音](https://developers.openai.com/api/docs/guides/audio)。如需连续翻译，请使用 [实时翻译](https://developers.openai.com/api/docs/guides/realtime-translation)。如需实时字幕，请使用 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription)；如需录制音频，请使用 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text).