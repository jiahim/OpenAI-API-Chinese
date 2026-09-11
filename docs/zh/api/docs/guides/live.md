# GPT-Live 入门

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在 URL 末尾追加以下内容获取文档页面的 Markdown 版本： `.md` ，即可访问对应页面的 Markdown 版本。

GPT-Live 处理语音对话，同时后端智能体负责查询信息、使用工具并完成任务。它可以在说话的同时进行监听，这一能力被称为 **全双工**。将任务发送到后端称为 **委托**：在该任务运行期间，对话可以继续进行。

例如，用户可以询问订单状态，在后端检查订单的同时补充细节，并在结果就绪时听到答复。你可以独立于语音模型选择后端模型或智能体；Realtime 使用同一个模型来处理语音、推理和工具选择。

## 了解这两个部分

- **GPT-Live 处理对话。** 它负责倾听、表达，并在需要时决定是否请求后端协助。为它提供一段简短的提示，用于设定对话风格以及何时进行委派。
- **后端负责处理被委派的任务。** 使用 Responses 委派时，请选择支持的 Responses 模型。使用客户端委派时，可以接入任何模型、智能体 框架，或你的应用所运行的任何服务。后端会进行推理、调用工具，并把结果返回给 GPT-Live 进行输出。详细的指令、业务规则和工具工作流应放在此处。

你的应用负责权限、确认、私有函数执行以及持久化任务状态。中断语音不会自动取消后端工作。参见 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 以比较 GPT-Live 与 Realtime 以及链式语音应用。





## 选择运行后端的方式

从 **[Responses 委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)** 当托管后端适用时：GPT-Live 调用你配置的 Responses 模型，提供对话上下文，并返回结果。选择 **[客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)** 当你的应用需要控制后端执行、上下文或哪些结果传递给 GPT-Live 时。

参见 [选择委托模式](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) 以获取对比和配置详情。请在创建会话时选择模式；若要更改模式，请开启新会话。

## 连接你的第一个会话

从 [GPT-Live WebRTC 快速入门](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)。开始。其浏览器和服务器示例连接麦克风输入和扬声器输出，后端使用可以执行网页搜索的 响应接口。

你需要一个麦克风、一个通过 HTTPS 或 localhost 提供服务的浏览器页面，以及一台持有 OpenAI 项目 API 密钥的可信服务器。请将密钥保存在服务器上。

1. 编写一个简短的 [对话提示词](https://developers.openai.com/api/docs/guides/live-prompting) ，告诉 GPT-Live 何时向服务端请求帮助。
2. 按照快速入门指南连接浏览器的麦克风、音频播放和事件通道。你的服务端创建会话，并使用浏览器的连接提议换取应答。
3. 等待 `session.started`，然后说话并听取回复。提出一个需要最新信息的问题，以试用 网页搜索 服务端。
4. 结束对话并 [关闭会话](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 以收集最终的用量信息并释放连接。

同时检查语音会话和后端结果。会话开始事件可确认启动；监听回复并检查搜索结果可验证应用的不同部分。

GPT-Live 语音会话按时长计费，以秒为单位。详见 [模型定价](https://developers.openai.com/api/docs/models/gpt-live-1) 了解当前费率。后端模型和工具的使用单独计费。详见 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) 了解用量核算和降低成本的方法。

## 选择连接

- **[WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)** 用于浏览器语音应用。媒体轨道传输音频；数据通道传输 JSON 事件。
- **[WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)** 用于服务端音频集成。主套接字承载音频和控制事件。
- **[服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live)** 用于后端访问现有会话。边带连接承载事件，音频仍保留在主连接上。
- **[电话与 SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live)** 用于电话集成路径和提供商指南。

## 合作伙伴集成

对于使用 **LiveKit**, **Twilio**, **Telnyx**，或 **Daily/Pipecat**，构建的应用，请从 [partner integration overview](https://developers.openai.com/api/docs/guides/live-partner-integrations) 开始，为你现有的媒体路径选择一种连接方式。

## 继续构建

- 在以下指南中塑造对话风格和交接行为 [提示 GPT-Live](https://developers.openai.com/api/docs/guides/live-prompting).
- 在以下指南中连接工具并降低后端延迟 [交接与工具](https://developers.openai.com/api/docs/guides/live-delegation).
- 在以下指南中管理上下文、对话记录和会话生命周期 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations).
- 在以下指南中为你的 Realtime 或基于文本的智能体选择迁移路径 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).
- 在以下指南中测试对话和任务结果 [评估语音智能体](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).