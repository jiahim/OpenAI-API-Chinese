# Voice 智能体

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

语音智能体将相同的智能体概念转化为口语化的低延迟交互。关键的设计选择是决定让模型直接处理实时音频，还是让你的应用显式地串联语音转文本、文本推理和文本转语音。

## 选择合适的架构

| 架构                              | 适用场景                                                  | 原因                                                                                   |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 使用实时音频会话进行语音对话 | 自然、低延迟的对话                        | 模型直接处理实时音频的输入和输出                                |
| 链式语音流水线                    | 可预测的工作流或扩展现有文本智能体 | 你的应用显式控制转录、文本推理和语音输出 |

语音工作流是一个 SDK 优先的界面。如果你正在迁移相关的 智能体 Builder 项目，请参阅 [从 智能体 Builder 迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) 了解当前的过渡路径。

## 推荐起点

下面的示例刻意采用不同架构，并不与语言选项卡一一对应。JavaScript 和 Python 库当前各自提供了不同的语音助手接口：

- 在 JavaScript 中，构建基于浏览器的语音助手的最快路径是一个 `RealtimeAgent` ， `RealtimeSession`.
- 在 Python 中，将现有的纯文本智能体扩展为语音的最简路径是一个链式调用 `VoicePipeline`.





## 构建一个语音到语音的智能体

在需要让交互感觉对话式且即时的情况下，使用实时音频 API 路径。对于需要支持插话、首段音频低延迟、自然的轮流发言以及实时工具调用的语音智能体，这是最佳起点。

常见的浏览器流程是：

1. 你的应用服务器为实时音频会话创建一个临时客户端密钥。
2. 你的前端创建一个 `RealtimeSession`.
3. 会话在浏览器中通过 WebRTC 连接，或在服务器上通过 WebSocket 连接。
4. 该 智能体 在该会话内处理音频轮次、工具、中断和交接。

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


然后，像为文本 `RealtimeAgent` 智能体附加工具、交接和护栏一样，将它们附加到文本智能体上。将音频传输相关的内容放在会话层，将业务逻辑放在智能体定义中。

当你需要更底层的控制时，请先从传输层文档入手：

- [实时与音频概述](https://developers.openai.com/api/docs/guides/realtime)
- [基于 WebRTC 的实时音频 API](https://developers.openai.com/api/docs/guides/realtime-webrtc)
- [基于 WebSocket 的实时音频 API](https://developers.openai.com/api/docs/guides/realtime-websocket)

## 构建链式语音工作流

当你希望对中间文本、现有文本-智能体复用，或从非语音 工作流 获得更简单的扩展路径时，可使用链式路径。在该设计中，由你的应用显式管理以下内容：

1. 语音转文本
2. 智能体 工作流本身
3. 文本转语音

这种方案通常更适合支持流程、审批密集型流程，或者你希望在每个阶段之间保留持久的对话记录并使用确定性逻辑的场景。

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
    model="gpt-5.6",
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


当每个阶段都需要可见或可替换时，可以使用此路径。例如，你可能需要存储对话记录，在文本智能体回复前运行策略检查、调用内部系统，然后仅在工作流得出已批准的答案后再生成语音。

## Voice 智能体 still use the same core 智能体 building blocks

语音表面会改变传输和音频循环，但核心的工作流决策是相同的：

- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 当语音智能体需要外部能力时。
- 使用 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents) 当口语化工作流需要流式输出、延续或持久化状态时。
- 使用 [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration) 当口语化工作流在多个专长之间分支时。
- 使用 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 当口语化工作流需要安全检查或审批时。
- 使用 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当你需要 MCP 支持的能力，或想查看语音工作流的运行情况时。

实用原则是：先选定音频架构，然后像为文本设计那样设计其余的智能体工作流。

## 后续步骤

[Realtime 与音频概述



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/realtime)

[管理对话



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC 连接



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[Realtime 提示指南



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/realtime-models-prompting)