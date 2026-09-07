# 模型与提供商

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取文档页面的 Markdown 版本。

每次 SDK 运行最终都会解析出一个模型和一种传输方式。大多数应用应保持这种配置简洁明了：显式选择模型，默认使用标准的 OpenAI 路径，仅在 工作流 真正需要时才使用 provider 或 transport 的覆盖配置。

## 从明确的模型选择开始

在生产环境中，应明确选择模型，而不是依赖 SDK 发布版本所附带的运行时默认模型。

- 设置 `model` 在某个智能体上，当该专家角色持续需要不同的质量、延迟或成本配置时使用。
- 当某个工作流需要一次性覆盖多个智能体时，设置运行级默认值。
- 设置 `OPENAI_DEFAULT_MODEL` 当你希望为省略了该设置的智能体提供进程级回退时使用 `model`.

按 智能体 以及按运行分别设置模型

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
  model: "gpt-6-astra",
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
        run_config=RunConfig(model="gpt-6-astra"),
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


对于大多数新的 SDK 工作流，从 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 开始，仅当延迟或成本足够重要到值得切换时，再迁移到更小的变体。可参考平台范围内的 [模型选型指南](https://developers.openai.com/api/docs/guides/latest-model) 页面获取最新的模型选择建议。

## 选择最简单的默认策略

| 如果你需要                                    | 从……开始                | 原因                                                                                  |
| ---------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| 每个专家一个明确的模型              | 在每个 `model` 智能体上设置 | 工作流在代码和追踪中保持可读                                       |
| 整个流程中的一个回退            | `OPENAI_DEFAULT_MODEL`    | 省略的智能体 `model` 仍然可以按预期解析                                   |
| 一个工作流级别的覆盖                    | 运行级别的默认值       | 你可以在不修改每个智能体的情况下为脚本、worker 或环境更换模型 |
| 同一工作流中不同的模型规格 | 混合使用按智能体设置的模型      | 一个快速分诊智能体和一个较慢的深度专家可以干净地共存                 |

如果你的团队在意确切的默认值,请不要依赖 SDK 的回退默认值。请自行设置。

## 提供方与传输

| 需求                                                    | 从……开始                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| 标准 SDK 在 OpenAI 上运行                             | 默认 OpenAI 提供方路径                                  |
| 通过套接字进行多次重复的 Responses 模型往返调用 | SDK 中的 Responses WebSocket 传输                          |
| 非 OpenAI 模型或混合提供方堆栈             | 语言特定的 SDK 文档中的提供方或适配器接口 |

有两个区别需要注意：

- Responses WebSocket 传输仍然使用常规的文本与工具 智能体 循环。它与语音会话路径是分开的。
- 通过 WebRTC 或 WebSocket 的实时音频会话用于低延迟的语音或图像交互。请使用 [语音 智能体](https://developers.openai.com/api/docs/guides/voice-agents) 以及 [实时音频 API 指南](https://developers.openai.com/api/docs/guides/realtime) 了解该路径。

精确的提供商配置、提供商生命周期管理以及传输层辅助 API 仍然是与具体语言相关的内容。请将这些细节保留在 SDK 文档中，不要在此处重复。

## 模型设置、提示词与功能支持

模型选择只是运行时契约的一部分。

- 使用 `modelSettings` TypeScript 或 `model_settings` Python 进行推理投入、详细程度和工具行为等调优。
- 使用 `prompt` 当你希望使用已存储的提示词配置来控制运行，而不是在代码中嵌入完整的系统提示词时使用。
- 某些 SDK 功能依赖于 OpenAI 的 Responses 路径，而不是旧版兼容性接口，因此当你需要高级的工具加载或传输功能时，请查阅 SDK 文档。

当模型契约对该智能体的定义至关重要时，让它贴近该智能体的定义。只有当一组智能体应当共享相同的运行时选择时，才将其上移为工作流级别的默认值。

## Next steps

一旦运行时契约明确，就继续阅读与其余工作流设计相匹配的指南。



  [智能体定义



        保持模型选择与每个专家的职责一致。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [运行智能体



        了解传输方式和模型选择如何影响运行时循环。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [外部模型



        在混合模型栈很重要时，比较更广泛的提供商选项。](https://developers.openai.com/api/docs/guides/external-models)