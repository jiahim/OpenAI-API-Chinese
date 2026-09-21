# GPT-Live partner integrations

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 后访问。

## 选择集成方式

使用你所使用的语音框架或电话服务提供方的指南。各合作伙伴会维护各自的设置说明和受支持的包版本；OpenAI 指南涵盖共享的 GPT-Live 会话和交接行为。

| 合作伙伴                                                                                       | 集成                                                                      |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [LiveKit](https://docs.livekit.io/agents/models/realtime/plugins/gpt-live)                    | 通过 LiveKit 的 OpenAI 插件构建 GPT-Live 语音智能体。                        |
| [Twilio](https://www.twilio.com/en-us/blog/developers/twilio-openai-gpt-live-1-api-resources) | 使用 Twilio 智能体 Connect 将呼入和呼出电话连接到 GPT-Live。 |
| [Telnyx](https://developers.telnyx.com/docs/voice/sip-trunking/gpt-live-configuration-guide)  | 使用 GPT-Live 和 Telnyx Voice API 构建外呼体验。       |
| [Daily/Pipecat](https://docs.pipecat.ai/api-reference/server/services/s2s/openai-live)        | 通过 Pipecat 的 OpenAI Live 服务将 GPT-Live 集成到你的应用中。             |

## 集成清单

按照合作伙伴指南进行安装、配置凭证，并选择兼容的包版本 `gpt-live-1`。请检查它对音频格式、中断、会话事件、后端委派以及通话终止的处理方式。Realtime 集成并不会自动兼容 GPT-Live。

如需直接从浏览器连接，请参阅 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)。如需服务端音频，请参阅 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。如需电话呼叫，请阅读 [Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live).