# Voice 智能体

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

语音智能体让用户能够通过与应用对话来提问和完成任务。关键的设计选择在于语音如何与推理和工具相连：与独立后端的连续对话、单一的语音模型，或者你可以逐阶段控制的流水线。

## 选择合适的架构

| 架构           | 最适合                                          | 选择它的原因                                                                                           |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| GPT-Live               | 使用独立后端进行全双工对话 | 保留你现有的文本工作流，在对话持续进行的同时独立选择其后端。 |
| Realtime API           | 在一次会话中同时进行语音、推理和工具调用    | 使用单一模型解读音频、决定下一步操作并以语音回复。                             |
| 链式语音流水线 | 对每个语音和文本阶段进行控制           | 检查或转换中间文本，并独立替换每个组件。                        |





## 构建全双工语音智能体

GPT-Live 可以同时听和说，这种能力被称为 **全双工**。实时模型负责语音交互，并将推理和工具调用委派给独立的后端。在后端任务运行期间，用户可以持续发言。

你可以保留现有的文本工作流，包括其业务逻辑和工具，并将 GPT-Live 作为语音接口接入。你的 **委派模式** 决定了谁负责运行后端任务，并提供其对话上下文：

- **客户端委托:** 连接你自己的 智能体 或 工作流,使用你选择的后端模型和提供商。你的应用运行工作并将结果返回给 GPT-Live。
- **Responses 委托:** 选择一个由 OpenAI 托管的 Responses 模型用于后端推理和工具调用。GPT-Live 提供对话上下文并管理对该模型的调用;你的应用仍然运行自定义函数。

在两种模式下，你的应用都需要控制权限和业务记录。实时模型的提示词中只保留说话行为相关的指令，业务规则则放在后端提示词中。

从 [GPT-Live 入门](https://developers.openai.com/api/docs/guides/live)。开始。参见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解后端设置，以及 [提示词编写（语音模型）](https://developers.openai.com/api/docs/guides/live-prompting) 了解说话行为的设置。





## 构建一个语音到语音的 智能体

对于 Realtime API，一个 `RealtimeAgent` 并 `RealtimeSession` 提供了一个以浏览器为优先的入门起点。会话处理音频轮次、工具、中断和交接。完整的入门示例现位于 [Realtime API 入门指南](https://developers.openai.com/api/docs/guides/realtime#build-a-speech-to-speech-voice-agent).

## 构建链式语音工作流

当你需要在语音识别、你的智能体和语音生成之间检查或转换文本时，请使用链式路径。你的应用需要管理三个阶段：

1. 语音转文字
2. 智能体 工作流本身
3. 文字转语音

运行链式语音流水线

```python
import asyncio
import numpy as np

from agents import Agent, function_tool
from agents.voice import AudioInput, SingleAgentVoiceWorkflow, VoicePipeline


@function_tool
def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is sunny."


agent = Agent(
    name="Assistant",
    instructions="You are a helpful voice assistant.",
    model="gpt-6-astra",
    tools=[get_weather],
)


async def main() -> None:
    pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
    audio_input = AudioInput(buffer=np.zeros(24000 * 3, dtype=np.int16))
    result = await pipeline.run(audio_input)
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            print("Received audio bytes", len(event.data))


if __name__ == "__main__":
    asyncio.run(main())
```


当每个阶段都需要可见或可替换时使用此路径。例如，你可能需要存储转录文本，在文本智能体响应之前运行策略检查，调用内部系统，然后仅在工作流得到批准的回答之后再生成语音。

## 评估你的语音智能体

同时测试对话过程和已完成的任务。例如，对于一个预约助手，聆听其确认信息并核对是否正确保存了相应的预约。

1. 选择具有预期结果、工具调用和权限的代表性场景。
2. 保存验证每个结果所需的音频、事件、工具结果和应用程序状态。区分失败的评估运行与智能体未能完成任务的正常运行。
3. 重复场景并比较任务完成情况、可听响应延迟、中断和不需要的沉默。在比较更改时，保持调用者、模型配置、工具和传输方式的一致性。

对于 GPT-Live，请独立衡量以下维度：

- **任务与工具结果：** 检查意图是否被保留、委派工作、工具参数、权限以及最终的应用状态。核实语音确认与已完成的动作一致。
- **对话时序：** 衡量 [可听响应的时序](#measure-latency)、不必要的沉默、抢话以及对中断的退让，包括在后端工作运行期间的纠错。
- **语音与语言：** 在口音、背景噪声、语言切换、姓名和数字场景下测试输入识别。单独评估输出的可懂度和语言选择，与识别表现分开衡量。
- **会话可靠性：** 将连接失败、音频中断、超时以及不完整的会话与任务得分分开跟踪。

使用 **"爬-走-跑"** 分阶段增加复杂度：

1. **Crawl:** 使用合成语音进行可控的单轮请求测试。保持生成的音频、应用上下文和预期结果固定，以便进行可重复的比较。
2. **Walk:** 回放具有代表性的单轮请求人声录音，以测试声音、麦克风、停顿和声学条件如何影响行为。
3. **Run:** 使用独立的模拟调用方进行连续的多轮对话测试。在对话和后端工作重叠期间，测试澄清需求、变更需求、中断和恢复。

将自动评分与人工听音相结合，以评估发音、自然度以及对话节奏是否合适。

如需 GPT-Live 评估测试套件，请参阅 [voice 智能体 评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).

如需 Realtime 评估测试套件及完整示例，请使用 [OpenAI Cookbook 中的 Realtime 评估指南](https://developers.openai.com/cookbook/examples/realtime_eval_guide).

### 测量延迟

衡量呼叫者等待一段有用语音回答的时间。单独追踪后端时间
以定位延迟，并在相似呼叫之间比较中位数和第 95 百分位
延迟。

在比较前端模型时，保持呼叫者、录音、后端模型、提示词、传输方式、音频节奏和
评分器固定不变。

对于 GPT-Live，记录你的应用可以观察到的各个阶段：委托接收、
后端请求开始、首个有用结果、工具的开始与结束、结果提交、
音频到达，以及客户端回放。客户端委托让你的应用
能够直接观察其后端请求；Responses 委托则会暴露嵌套的
响应事件以及你的应用所运行的自定义工具。

利用这些时序来定位连接建立、模型处理、工具调用、
缓冲或回放环节中的延迟。诸如“I'm checking”之类的确认响应应与
呼叫者真正需要的回答分开测量。

每次只改变一个因素，并重复相同的场景。检查更快的
响应是否同时影响任务成功率、工具正确性或打断情况。参见
[降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency).

## 语音 智能体 仍使用相同的核心 智能体 构建模块

语音界面改变了传输方式和音频循环，但核心的 工作流 决策保持不变：

- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 当语音 智能体 需要外部能力时。
- 使用 [运行 智能体](https://developers.openai.com/api/docs/guides/agents/running-agents) 当口语化工作流需要流式处理、延续 或持久化状态时。
- 使用 [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration) 当口语化工作流在多个专家之间分支时。
- 使用 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 当口语化工作流需要安全检查或审批时。
- 使用 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当你需要 MCP 支持的能力，或希望检查语音 工作流 的运行情况时。

实用的原则是：先选择音频架构，然后按照处理文本的方式来设计其余的智能体工作流。

## 后续步骤

[音频与语音概述



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/audio)

[管理对话



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC 连接



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/voice-webrtc)

[实时提示指南



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/voice-prompting)