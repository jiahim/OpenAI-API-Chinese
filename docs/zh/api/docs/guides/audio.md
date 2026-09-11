# 音频和语音

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt). 可在页面 URL 末尾添加 `.md` 以获取文档页面的 Markdown 版本。

对于新的对话式语音应用，请从 **[GPT-Live](https://developers.openai.com/api/docs/guides/live)**。开始。它可以在说话的同时进行倾听，并在后端智能体进行推理、使用工具或完成任务时保持对话流畅进行。

通过以下方式建立你的首次对话 [WebRTC 快速入门](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)，然后编写一个简短的 [Live 提示](https://developers.openai.com/api/docs/guides/live-prompting)。如果你已经拥有 Realtime 应用或文本智能体，请参阅 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).

## 选择其他音频工作流

















当你需要其会话和工具模型时，使用 Realtime API。如需转录、翻译或语音生成，且无需对话式智能体，请选择下方专用的API。





| Build                                                              | 从这里开始                                                                   | 你能控制什么                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 使用 Realtime 会话和工具模型的语音到语音智能体 | [Realtime API](https://developers.openai.com/api/docs/guides/realtime)                                    | 音频轮次、会话状态、工具和打断。             |
| 为现有文本智能体提供的语音界面                       | [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents#build-a-chained-voice-workflow) | 语音转文本、文本智能体工作流，然后再文本转语音。     |
| 音频文件的转写文本                                      | [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text)                        | 文件上传、有界请求以及支持的转写文本格式。 |
| 无助手语音的实时字幕                             | [实时转写](https://developers.openai.com/api/docs/guides/realtime-transcription)                | 流式音频和增量转写文本事件。                |
| 持续语音翻译                                      | [实时翻译](https://developers.openai.com/api/docs/guides/realtime-translation)                    | 一个专用的翻译会话，而不是语音智能体的轮次循环。     |
| 旁白或生成的语音                                      | [文本转语音](https://developers.openai.com/api/docs/guides/text-to-speech)                            | 文本、语音和输出格式。                                   |
| 在现有聊天应用中进行音频输入或输出                      | [Chat Completions 中的音频](https://developers.openai.com/api/docs/guides/audio-chat-completions)         | 有界的多模态聊天请求。                                 |

## 用语音构建

使用 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 来比较架构差异。可先参考以下指南了解 [GPT-Live](https://developers.openai.com/api/docs/guides/live-prompting) 或 [Realtime](https://developers.openai.com/api/docs/guides/voice-prompting)。的提示词编写方式。再查阅通用的 [自定义语音](https://developers.openai.com/api/docs/guides/custom-voices), [评估](https://developers.openai.com/api/docs/guides/voice-agents#evaluate-your-voice-agent)，与 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost)。指南。每份指南都会区分特定模型或 API 的行为差异。

## 选择连接

对于浏览器音频，请从 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc)。开始。对于服务端音频管线，请使用 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets)。对于电话通话，请参阅 [Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip)。一个 [服务端 控制连接](https://developers.openai.com/api/docs/guides/voice-server-controls) 允许受信任的后端观察和控制媒体会话。

在每个连接页面上选择你的 API。共享传输不会使 GPT-Live 和 Realtime 的握手、凭据或事件格式变得可互换。请查看连接指南中的先决条件和设置说明。

## 为你的现有应用添加音频

Chat Completions 的相关示例现在位于 [Chat Completions 中的音频](https://developers.openai.com/api/docs/guides/audio-chat-completions)。如需浏览器端的语音智能体入门项目，请使用 [GPT-Live WebRTC 快速入门](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live).