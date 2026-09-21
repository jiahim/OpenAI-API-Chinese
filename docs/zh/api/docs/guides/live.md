# GPT-Live 入门

> 完整的文档索引请参见 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

GPT-Live 处理语音对话的同时，后端智能体可以查询信息、调用工具并完成任务。它可以在说话的同时进行监听（**全双工**）。将任务发送到后端的过程称为 **委派**.

例如，用户可以在后端查询订单状态的同时补充问题细节。GPT-Live 可以继续与用户交谈，并在结果返回后进行说明。你可以独立于语音模型来选择后端模型或智能体。

## 了解这两个部分

- **GPT-Live 处理对话。** 它会倾听、说话,并决定何时向后端请求协助。提供一个简短的提示,用于设定对话风格以及何时进行委派。
- **后端处理被委派的任务。** 使用 Responses 委派时,请选用支持的 Responses 模型。使用客户端委派时,可连接你的应用所运行的任何模型、智能体 框架或服务。后端负责推理、调用工具,并将结果返回给 GPT-Live 进行交互。详细的指令、业务规则和工具工作流请在此配置。

你的应用负责检查权限、获取所需的确认、运行访问你系统的函数,并保存任务进度。当调用方中断助理时,后端工作可以继续;你的应用决定是完成还是取消该任务。详见 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 以比较 GPT-Live 与 Realtime 以及链式语音应用。





## 选择运行后端的方式

从 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)** 开始，让 OpenAI 运行后端模型，并在它与 GPT-Live 之间传递对话上下文和结果。你的应用仍运行你自己的函数工具。选择 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)** 来连接现有的 智能体，或自行控制后端的上下文、执行和返回结果。

请参阅 [选择委托模式](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) 了解比较和配置详情。在创建会话时选择模式；要更改模式，请启动新会话。

## 连接你的第一个会话

从 [GPT-Live WebRTC 快速入门](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)。开始。它的浏览器和服务器示例连接了麦克风输入和扬声器输出，并使用支持网页搜索的 Responses 后端。

你需要一台麦克风、一个通过 HTTPS 或 localhost 提供的浏览器页面，以及一台持有 OpenAI 项目 API 密钥的可信服务器。请将密钥保存在服务器上。

1. 编写一个简短的 [会话提示词](https://developers.openai.com/api/docs/guides/live-prompting) ，告诉 GPT-Live 何时向 backend 寻求帮助。
2. 按照快速入门连接浏览器的麦克风、音频播放和事件通道。你的服务器创建会话，并将浏览器的连接请求交换为应答。
3. 等待 `session.started`，然后发言并收听回复。提出一个需要最新信息的问题，以试用 网页搜索 后端。
4. 结束对话并 [关闭会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) ，以收集最终的用量信息并释放连接。

在第一次测试中，听取智能体的回复并确认其答案反映了后端的搜索结果。

GPT-Live 语音会话按持续时长计费，以秒为单位。请参阅 [模型定价](https://developers.openai.com/api/docs/models/gpt-live-1) 了解当前费率。后端模型和工具的使用单独计费。请参阅 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) 了解用量核算和降低成本的方法。

## 选择连接

- **[WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)** 用于浏览器语音应用。它通过媒体轨道传输麦克风和扬声器音频，并通过数据通道传输 JSON 事件。
- **[WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)** 用于服务端音频集成。单个连接即可同时传输音频和控制事件。
- **[Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live)** 用于接入电话通话。

如需在后台监控或控制现有会话，请添加一个 [服务端 连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live). 该额外的 WebSocket 称为 **sideband**,音频仍通过该会话的主连接传输。

## 合作伙伴集成

如果你的应用已经在使用 **LiveKit**, **Twilio**, **Telnyx**，或 **Daily/Pipecat**，请参考 [合作伙伴集成概述](https://developers.openai.com/api/docs/guides/live-partner-integrations) ，将其现有的通话或音频流连接到 GPT-Live。

## Continue building

- 在以下位置塑造对话风格与交接行为 [Prompting GPT-Live](https://developers.openai.com/api/docs/guides/live-prompting).
- 在以下位置连接工具并降低后端延迟 [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).
- 在以下位置管理上下文、转写文本与会话生命周期 [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations).
- 在以下位置为你的 Realtime 或基于文本的智能体选择迁移路径 [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).
- 在以下位置测试对话与任务结果 [Evaluating voice 智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).