# GPT-Live 合作伙伴集成

> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

## 选择集成方式

请参考你所使用的语音框架或电话服务提供方的指南。每个合作伙伴都维护着自己的安装说明和支持的包版本；OpenAI 指南涵盖了共享的 GPT-Live 会话和委托行为。

| 合作伙伴                                                                                       | 集成                                                                      |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [LiveKit](https://docs.livekit.io/agents/models/realtime/plugins/gpt-live)                    | 使用 LiveKit 的 OpenAI 插件构建 GPT-Live 语音智能体。                        |
| [Twilio](https://www.twilio.com/en-us/blog/developers/twilio-openai-gpt-live-1-api-resources) | 通过 Twilio 智能体 Connect 将呼入和呼出电话接入 GPT-Live。 |
| [Telnyx](https://telnyx.com/resources/outbound-ai-calls-python-openai-live)                   | 使用 GPT-Live 和 Telnyx Voice API 构建外呼体验。       |
| [Daily/Pipecat](https://docs.pipecat.ai/api-reference/server/services/s2s/openai-live)        | 使用 Pipecat 的 OpenAI Live 服务将 GPT-Live 添加到你的应用。             |

## 集成清单

按照合作伙伴指南进行安装、配置凭证，并选择支持 `gpt-live-1`。的包版本。检查它如何处理音频格式、中断、会话事件、后端委托和通话终止。Realtime 集成并不自动兼容 GPT-Live。

如需直接通过浏览器连接，请参阅 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)。如需服务器端音频，请参阅 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。如需拨打电话，请阅读 [Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live).