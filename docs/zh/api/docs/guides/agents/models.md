# 模型与提供商

> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

每次 SDK 运行最终都会解析出一个模型和一个传输方式。大多数应用应保持这种配置简洁直观：明确选择模型，默认使用标准的 OpenAI 路径，仅在 工作流 确实需要时才使用提供商或传输方式的覆盖配置。

## 从显式选择模型开始

在生产环境中，应优先明确选择模型，而不要依赖你的 SDK 发行版本自带的运行时默认模型。

- 设置 `model` 在某个智能体上设置，当该专家智能体持续需要不同的质量、延迟或成本配置时。
- 当某个工作流需要同时覆盖多个智能体时，设置运行级默认值。
- 设置 `OPENAI_DEFAULT_MODEL` 当你希望为省略了该设置的智能体提供进程级回退时， `model`.

为每个智能体和每次运行设置模型

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


对于大多数新的SDK工作流，请从 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 开始，只有在延迟或成本足够重要时再切换到更小的变体。请参考平台级的 [模型选型指南](https://developers.openai.com/api/docs/guides/latest-model) 页面，获取最新的模型选择建议。

## 选择最简单的默认策略

| 如果需要                                    | 从…开始                | 原因                                                                                  |
| ---------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| 每个专家智能体使用一个明确模型              | 在每个 `model` 智能体上设置 | 工作流在代码和追踪中保持可读                                       |
| 整个流程共用的一个回退            | `OPENAI_DEFAULT_MODEL`    | 省略了 的智能体 `model` 仍然可以稳定解析                                   |
| 工作流级别的一个覆盖                    | 运行级别的默认设置       | 你可以在不修改每个智能体的情况下，为脚本、worker 或环境切换模型 |
| 同一工作流中使用不同的模型规模 | 混合每个智能体的模型      | 一个快速的分类智能体和一个较慢的深度专家智能体可以干净地共存                 |

如果你的团队在意准确的默认值,不要依赖 SDK 回退。请自行设置。

## Providers and transport

| 需求                                                    | 从…开始                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| 标准 SDK 运行于 OpenAI                             | 默认的 OpenAI provider 路径                                  |
| 通过 socket 进行的大量重复 Responses 模型往返调用 | SDK 中的 Responses WebSocket 传输                          |
| 非 OpenAI 模型或混合 provider 栈             | 特定语言 SDK 文档中的 provider 或 adapter 接口 |

Two distinctions matter:

- Responses WebSocket 传输仍然使用常规的文本与工具 智能体 循环。它与语音会话路径是分开的。
- 通过 WebRTC 或 WebSocket 的实时音频会话用于低延迟语音或图像交互。使用 [语音 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 以及 [实时音频 API 指南](https://developers.openai.com/api/docs/guides/realtime) 了解该路径。

精确的 provider 配置、provider 生命周期管理以及传输层辅助 API 仍属于语言特定的资料。这些细节请保留在 SDK 文档中,而不是在此处重复。

## 模型设置、提示词与功能支持

模型选择只是运行时合约的一部分。

- 使用 `modelSettings` 在 TypeScript 中，或 `model_settings` 在 Python 中用于调优推理强度、冗长度和工具行为等设置。
- 使用 `prompt` 当你希望使用存储的提示词配置来控制运行，而不是将完整的系统提示嵌入代码中时。
- 某些 SDK 功能依赖 OpenAI Responses 路径而非旧版兼容接口，因此当你需要高级的工具加载或传输特性时，请查阅 SDK 文档。

将模型契约保持在 智能体 定义附近，前提是该契约是该智能体所固有的。只有当一组 智能体 应该共享相同的运行时选择时，才将其移至 工作流 级别的默认值。

## 后续步骤

一旦运行时契约清晰，就可以继续阅读与 工作流 其余设计匹配的指南。



  [智能体 定义



        让模型选择与每个专家的职责保持一致。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [运行 智能体



        了解传输方式和模型选择如何影响运行时循环。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [外部模型



        在混合模型栈至关重要时，对比更广泛的提供商选项。](https://developers.openai.com/api/docs/guides/external-models)