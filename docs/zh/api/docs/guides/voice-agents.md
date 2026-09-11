# Voice 智能体

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

Voice 智能体让用户能够通过与应用对话来提问并完成任务。其中的核心设计选择在于语音如何与推理和工具相连：与独立后端进行的持续对话、单一的语音模型，或是你可以逐阶段自行控制的流水线。

## 选择合适的架构

| 架构           | 最适用于                                          | 选择它的原因                                                                                           |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| GPT-Live               | 使用独立后端的全双工会话 | 保留现有文本工作流，并在会话持续进行时独立选择其后端。 |
| Realtime API           | 在一次会话中同时进行语音、推理和工具调用    | 使用单个模型来解读音频、决定如何处理并以语音回复。                             |
| 链式语音流水线 | 对每个语音和文本阶段进行控制           | 检查或转换中间文本，并可独立替换每个组件。                        |





## 构建全双工语音 智能体

GPT-Live 能够同时听和说，这种能力被称为 **全双工**。实时模型负责处理口语交互，并将推理与工具调用委托给独立的后端。当后端任务运行时，用户可以继续说话。

你可以保留现有的文本工作流，包括其业务逻辑和工具，并将 GPT-Live 添加为语音接口。你的 **委托模式** 决定了由谁来执行后端任务并提供其对话上下文：

- **客户端委托：** 连接你自己的智能体或工作流，使用你选择的后端模型和提供方。你的应用执行任务并将结果返回给 GPT-Live。
- **Responses 委托：** 选择一个由 OpenAI 托管的 Responses 模型用于后端推理和工具调用。GPT-Live 提供会话上下文并管理对该模型的调用；你的应用仍然运行自定义函数。

在两种模式下，你的应用负责控制权限和业务记录。请将实时模型的说话行为相关的提示保留在前端提示中，将业务规则保留在后端提示中。

从 [GPT-Live 入门](https://developers.openai.com/api/docs/guides/live)。开始。参见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解后端设置，参见 [语音模型提示](https://developers.openai.com/api/docs/guides/live-prompting) 了解说话行为。





## 构建一个语音到语音的智能体

对于 Realtime API，一个 `RealtimeAgent` 并 `RealtimeSession` 提供了一个以浏览器为先的起点。会话处理音频轮次、工具、打断和交接。完整的入门模板现在位于 [Realtime API 入门](https://developers.openai.com/api/docs/guides/realtime#build-a-speech-to-speech-voice-agent).

## 构建链式语音工作流

当你需要在语音识别、你的智能体以及语音生成之间检查或转换文本时，请使用链式路径。应用需要管理三个阶段：

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


当每个阶段都需要可见或可替换时，使用此路径。例如，你可能需要存储转录文本，在文本智能体响应前运行策略检查，调用内部系统，然后仅在工作流达成获批答案后再生成语音。

## 评估你的语音智能体

分别测试对话质量和任务结果。听起来自然的回答并不能证明工具已运行，也不能证明应用状态已发生变化。

1. 选择具有预期结果、工具调用和权限的代表性场景。
2. 保存验证每个结果所需的音频、事件、工具结果和应用程序状态。将评估运行失败与智能体未能完成任务的有效运行区分开来。
3. 重复场景并比较任务完成度、可听响应延迟、中断情况以及不必要的静默。在比较变更时，保持调用方、模型配置、工具和传输方式的一致性。

对于 GPT-Live，分别衡量以下维度：

- **任务与工具结果：** 检查意图是否被保留、委派的工作、工具参数、权限以及最终的应用程序状态。验证口头确认与已完成的动作一致。
- **对话节奏：** 衡量 [语音响应节奏](#measure-latency)、不必要的静默、抢话以及对中断的让步，包括在后端任务运行期间的纠正。
- **语音与语言：** 在不同口音、背景噪音、语言切换、人名和数字下测试输入识别。单独评估输出的可懂度和语言选择，而与识别分开。
- **会话可靠性：** 单独追踪连接失败、音频中断、超时和未完成的会话，与任务得分分开统计。

使用 **“爬-走-跑”（Crawl, Walk, Run）** 分阶段增加复杂度：

1. **Crawl:** 使用合成语音进行受控的单轮请求。固定生成的音频、应用上下文和预期结果，以便进行可重复的比较。
2. **Walk:** 回放具有代表性的单轮请求人声录音，以测试声音、麦克风、停顿和声学条件如何影响行为。
3. **Run:** 使用独立的模拟呼叫方进行连续的、多轮对话测试。在对话和后端工作并行进行时，测试澄清需求、需求变更、中断和恢复。

将自动化评分与人工听音相结合，以评估发音、自然度以及对话节奏是否合适。

有关 GPT-Live 评估测试套件，请参阅 [语音智能体评估 Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).

有关 Realtime 评估测试套件和实践示例，请使用 [OpenAI Cookbook 中的 Realtime 评估指南](https://developers.openai.com/cookbook/examples/realtime_eval_guide)。Cookbook 提供可运行的评估示例；本页提供共享的测试清单。

### 测量延迟

为每个延迟指标定义可观测的起始事件和结束事件。首次可听到响应时间、交接时间、中断让出率、
后端完成时间，以及已验证的任务完成时间衡量不同的边界。使用单一单调时间线，并报告合格样本量、中位数和长尾延迟。不要，
后端完成时间，以及已验证的任务完成时间衡量不同的边界。使用单一单调时间线，并报告合格样本量、中位数和长尾延迟。不要
合格样本、中位数和长尾延迟。不要用仅后端计时器替代端到端响应时间。
用仅后端的计时器替代端到端的响应时间。

在比较前端模型时，保持调用方、录音、后端模型、提示词、传输方式、音频节奏和评判器固定不变。
录音、后端模型、提示词、传输方式、音频节奏和评判器固定不变。

对于 GPT-Live，记录你的应用可以观测到的各个阶段：交接回执、
后端请求开始、首个可用结果、工具开始与结束、结果提交、
音频到达以及客户端播放。客户端交接让应用可以直接看到自己的后端请求；Responses 交接则暴露嵌套
后端请求；Responses 交接则暴露嵌套的响应事件以及你的应用所运行的自定义工具。
响应事件以及你的应用所运行的自定义工具。

使用这些区间来定位连接建立、模型处理、工具调用、
应用缓冲和播放中的延迟。将首个有用的语音答复单独测量，
与应用缓冲和播放中的延迟。将首个有用的语音答复与应用缓冲和播放中的延迟分别测量，不要将其与“我来查一下”之类的确认语混在一起。更早的
确认并不意味着所请求的结果更快到达。

每次只改动一个因素，并重复相同的场景。将有用语音答复的中位数和长尾时间与任务成功率、工具正确率
以及中断情况一并对比。另请参阅，
以及中断情况一并对比。另请参阅 [降低后端延迟](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency)
以获取实现指南。

## 语音智能体仍然使用相同的核心智能体构建模块

语音界面改变了传输方式和音频循环，但核心工作流决策保持不变：

- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 当语音智能体需要外部能力时。
- 使用 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents) 当口语化工作流需要流式响应、延续或持久化状态时。
- 使用 [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration) 当口语化工作流需要在多个专家之间分支时。
- 使用 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 当口语化工作流需要安全检查或审批时。
- 使用 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当你需要 MCP 支持的能力，或希望检查语音工作流的运行情况时。

实用的规则是：先选择音频架构，然后像设计文本工作流一样设计智能体的其余部分。

## 下一步

[音频与语音概述



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/audio)

[管理对话



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC 连接



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/voice-webrtc)

[实时提示指南



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/voice-prompting)