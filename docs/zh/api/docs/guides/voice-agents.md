# Voice 智能体

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

语音 智能体 将相同的 智能体 概念转化为低延迟的语音交互。关键的设计选择是决定让模型直接处理实时音频，还是让你的应用显式地串联语音转文本、文本推理和文本转语音。

## 选择合适的架构

| 架构                              | 最适合                                                  | 原因                                                                                   |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 基于实时音频会话的语音到语音 | 自然、低延迟的对话                        | 模型直接处理实时音频输入和输出                                |
| 链式语音流水线                    | 可预测的工作流或扩展现有文本智能体 | 你的应用对转录、文本推理和语音输出保持显式控制 |

语音工作流以 SDK 为首选界面。如果你要迁移相关的 智能体 Builder 项目，请参阅 [从 智能体 Builder 迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) 了解当前的迁移路径。

## 推荐入门指引

以下示例是有意采用不同架构的版本，并非语言标签一一对应。JavaScript 和 Python 库目前提供不同的语音辅助方法：

- 在 JavaScript 中，构建基于浏览器的语音助手的最快路径是 `RealtimeAgent` 和 `RealtimeSession`.
- 在 Python 中，将现有文本智能体扩展为语音功能的最简路径是链式 `VoicePipeline`.





## 构建一个语音到语音的语音智能体

当交互应当具有对话感和即时性时，请使用实时音频 API 路径。对于需要支持抢断、首次音频低延迟、自然轮次切换以及实时工具调用的语音智能体来说，这是最佳的起点。

常规浏览器流程为：

1. 你的应用服务器为实时音频会话创建一个临时客户端密钥。
2. 你的前端创建一个 `RealtimeSession`.
3. 会话在浏览器中通过 WebRTC 连接，或在服务器上通过 WebSocket 连接。
4. 智能体 在该会话内处理音频轮次、工具、中断和交接。

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


在此基础上，像为文本智能体挂载一样挂载工具、交接和护栏到 `RealtimeAgent` 的方式，将它们挂载到同一个会话中，就像为文本智能体挂载一样。将音频传输相关的关注点保留在会话层，将业务逻辑保留在智能体定义中。

当你需要更底层的控制时，从传输层文档开始：

- [实时与音频概述](https://developers.openai.com/api/docs/guides/realtime)
- [基于 WebRTC 的实时音频 API](https://developers.openai.com/api/docs/guides/realtime-webrtc)
- [基于 WebSocket 的实时音频 API](https://developers.openai.com/api/docs/guides/realtime-websocket)

## 构建链式语音工作流

当你希望对中间文本、既有的文本-智能体复用或从非语音工作流扩展获得更强的控制力时，可使用链式路径。在该设计中，由你的应用显式管理：

1. 语音转文本
2. the 智能体 工作流 itself
3. 文本转语音

在支持流程、重度依赖审批的流程，或需要在每个阶段之间保留持久化转写记录并执行确定性逻辑的场景中，这通常是更合适的选择。

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


当每个阶段都需要可见或可替换时，请使用此路径。例如，你可以存储转写记录，在 智能体 响应之前运行策略检查，调用内部系统，然后仅在 工作流 得出已批准的答案后再生成语音。

## Voice 智能体 仍然使用相同的核心 智能体 构建模块

语音界面改变了传输和音频循环方式，但核心的工作流决策保持不变：

- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 当语音智能体需要外部能力时。
- 使用 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents) 当口语化的工作流需要流式响应、延续或持久化状态时。
- 使用 [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration) 当口语化的工作流跨多个专精角色分支流转时。
- 使用 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 当口语化的工作流需要安全检查或审批时。
- 使用 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当你需要 MCP 支持的能力，或希望检视语音工作流的运行行为时。

实用的规则是：先选择音频架构，然后按照与文本相同的方式设计其余的智能体工作流。

## 后续步骤

[实时与音频概述



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/realtime)

[管理对话



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC 连接



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[实时提示指南



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/realtime-models-prompting)