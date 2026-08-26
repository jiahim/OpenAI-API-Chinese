# 语音智能体

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

语音智能体将相同的智能体概念转化为口语化的低延迟交互。关键的设计选择在于决定模型是直接处理实时音频，还是由你的应用显式地串联语音转文本、文本推理和文本转语音。

## 选择合适的架构

| 架构                              | 最适合                                                  | 原因                                                                                   |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 通过实时音频会话实现语音到语音 | 自然、低延迟的对话                        | 模型直接处理实时音频输入和输出                                |
| 链式语音流水线                    | 可预测的工作流或扩展现有文本智能体 | 你的应用显式控制转录、文本推理和语音输出 |

语音工作流是 SDK 优先的接口。如果你正在迁移相关的 智能体 Builder 项目，请参阅 [从 智能体 Builder 迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) 了解当前的迁移路径。

## 推荐起点

以下示例故意采用不同的架构，并不匹配语言标签。JavaScript 和 Python 库目前提供了不同的语音辅助工具：

- 在 JavaScript 中，实现基于浏览器的语音助手的最快路径是 `RealtimeAgent` 和 `RealtimeSession`.
- 在 Python 中，将现有文本智能体扩展为语音的最简单路径是链式 `VoicePipeline`.





## 构建一个语音到语音的智能体

当交互应具有对话感和即时性时，请使用实时音频API路径。对于需要插话、低首音频延迟、自然轮流说话和实时工具使用的语音智能体，这是最佳起点。

通常的浏览器流程是：

1. 你的应用服务器为实时音频会话创建一个临时客户端密钥。
2. 你的前端创建一个 `RealtimeSession`.
3. 会话在浏览器中通过 WebRTC 或在服务器上通过 WebSocket 进行连接。
4. 智能体在该会话内处理音频轮次、工具、中断和交接。

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


然后，将工具、交接和护栏附加到 `RealtimeAgent` 与将工具、交接和护栏附加到文本智能体的方式相同。将音频传输问题保留在会话层，并将业务逻辑保留在智能体定义中。

当你需要更底层的控制时，请从传输文档开始：

- [实时与音频概述](https://developers.openai.com/api/docs/guides/realtime)
- [使用 WebRTC 的实时音频 API](https://developers.openai.com/api/docs/guides/realtime-webrtc)
- [使用 WebSocket 的实时音频 API](https://developers.openai.com/api/docs/guides/realtime-websocket)

## 构建链式语音工作流

当你需要对中间文本、现有文本-智能体复用或从非语音工作流进行更简单的扩展路径时，请使用链式路径。在这种设计中，你的应用程序显式管理：

1. 语音转文本
2. 智能体 工作流本身
3. 文本转语音

这通常是支持流程、审批密集型流程或希望在各阶段之间获得持久记录和确定性逻辑的情况下的更好选择。

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


当每个阶段需要可见或可替换时，请使用此路径。例如，你可能存储记录，在文本 智能体 响应之前运行策略检查，调用内部系统，然后仅在 工作流 达到批准答案后才生成语音。

## 语音智能体仍使用相同的核心智能体构建模块

语音界面改变了传输和音频循环，但核心的工作流决策是相同的：

- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 当语音智能体需要外部能力时。
- 使用 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents) 当口语工作流需要流式传输、延续或持久状态时。
- 使用 [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration) 当口语工作流在专家之间分支时。
- 使用 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 当口语工作流需要安全检查或审批时。
- 使用 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当你需要MCP支持的功能或想检查语音工作流的行为时。

实际的规则是：先选择音频架构，然后以与文本相同的方式设计智能体的其余工作流。

## 后续步骤

[实时与音频概览



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/realtime)

[管理对话



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC 连接



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[实时提示指南



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/realtime-models-prompting)