# 模型与提供商

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可以通过在页面 URL 后追加 `.md` 来获取。

每次 SDK 运行最终都会解析出一个模型和一个传输层。大多数应用应保持这一设置简单直接：明确选择模型，默认使用标准的 OpenAI 路径，仅在 工作流 确实需要时才使用提供商或传输层覆盖。

## 从显式模型选择开始

在生产环境中，应优先选择明确的模型，而非你的 SDK 版本随附的运行时默认模型。

- 设置 `model` 在某个智能体上设置，当该专业智能体始终需要不同的质量、延迟或成本配置时。
- 设置运行级默认值，用以让一个工作流同时覆盖多个智能体设置。
- 设置 `OPENAI_DEFAULT_MODEL` 当你希望为未指定设置的智能体提供一个进程级默认值时。 `model`.

智能体和每次运行的模型设置

```javascript
import { Agent, Runner } from "@openai/agents";

const fastAgent = new Agent({
  name: "Fast support agent",
  instructions: "Handle routine support questions.",
  model: "gpt-5.6-terra",
});

const generalAgent = new Agent({
  name: "General support agent",
  instructions: "Handle support questions carefully.",
});

const runner = new Runner({
  model: "gpt-5.6",
});

await runner.run(fastAgent, "Summarize ticket 123.");
const result = await runner.run(
  generalAgent,
  "Investigate the billing issue on account 456."
);

console.log(result.finalOutput);
```

```python
import asyncio

from agents import Agent, RunConfig, Runner

fast_agent = Agent(
    name="Fast support agent",
    instructions="Handle routine support questions.",
    model="gpt-5.6-terra",
)

general_agent = Agent(
    name="General support agent",
    instructions="Handle support questions carefully.",
)


async def main() -> None:
    await Runner.run(fast_agent, "Summarize ticket 123.")

    result = await Runner.run(
        general_agent,
        "Investigate the billing issue on account 456.",
        run_config=RunConfig(model="gpt-5.6"),
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


对于大多数新的 SDK 工作流，从 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 开始，仅当延迟或成本足够重要时才迁移到较小的变体。使用平台范围的 [模型指导](https://developers.openai.com/api/docs/guides/latest-model) 页面获取当前的模型选择建议。

## 选择最简单的默认策略

| 如果你需要                                    | 从以下开始                | 为什么                                                                                  |
| ---------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| 每个专家各用一个显式模型              | 设置 `model` 在每个 智能体 上 | 工作流 在代码和追踪中保持可读性                                       |
| 整个流程中使用一个回退模型            | `OPENAI_DEFAULT_MODEL`    | 省略该设置的 智能体 `model` 仍可预测地解析                                   |
| 单个 工作流-级别的覆盖                    | 运行级别的默认值       | 你可以在不编辑每个 智能体 的情况下，为脚本、工作者或环境切换模型 |
| 同一 工作流 中使用不同规模的模型 | 混合每个 智能体 的模型      | 快速分诊 智能体 与较慢的深度专家可以清晰共存                 |

如果你的团队在意确切默认值，不要依赖 SDK 的回退。请自行设置。

## 提供方与传输

| 需要                                                    | 从以下开始                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| 标准 SDK 在 OpenAI 上运行                             | 默认的 OpenAI 提供商路径                                  |
| 通过套接字进行许多重复的 Responses 模型往返 | SDK 中的 Responses WebSocket 传输                          |
| 非 OpenAI 模型或混合提供商栈             | 特定语言 SDK 文档中的提供商或适配器界面 |

有两个区别值得注意：

- Responses WebSocket 传输仍然使用常规的文本与工具 智能体 循环。它与语音会话路径是分开的。
- 通过 WebRTC 或 WebSocket 的实时音频会话用于低延迟的语音或图像交互。请参考 [Voice 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 和 [live audio API guide](https://developers.openai.com/api/docs/guides/realtime) 了解该路径的更多信息。

具体的提供方配置、提供方生命周期管理以及传输辅助 API 仍是各语言特有的内容。请将这些细节保留在 SDK 文档中，而不是在此重复。

## 模型设置、提示词与功能支持

模型选择只是运行时契约的一部分。

- 使用 `modelSettings` （TypeScript）或 `model_settings` （Python）进行微调，例如推理努力、详细程度和工具行为。
- 使用 `prompt` 当你希望用存储的提示配置来控制运行，而不是在代码中嵌入完整系统提示时。
- 某些 SDK 功能依赖 OpenAI Responses 路径而非较旧的兼容接口，因此当需要高级工具加载或传输功能时，请查阅 SDK 文档。

当模型契约对该专家而言是其固有属性时，应使其与智能体定义保持一致。仅当一组智能体需要共享相同的运行时选择时，才将其移至工作流级别的默认设置。

## 后续步骤

运行时契约明确后，继续阅读与 工作流设计其余部分匹配的指南。



  [智能体定义



        保持模型选择与每个专家的职责对齐。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [运行 智能体



        了解传输和模型选择如何影响运行时循环。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [外部模型



        当混合模型栈很重要时，比较更广泛的提供商选项。](https://developers.openai.com/api/docs/guides/external-models)