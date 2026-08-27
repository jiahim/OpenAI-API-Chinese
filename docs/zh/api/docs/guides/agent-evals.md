# 评估 智能体 工作流

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

OpenAI 平台提供一套评估工具，帮助你确保 智能体 的表现一致且准确。

请将此页作为对于 智能体 工作流最重要的评估方式的决策点。

## 仍在调试行为时，先从追踪开始

追踪评分是识别工作流级别问题的最快方式。追踪捕获单次运行的模型调用、工具调用、护栏和交接的端到端记录。评分器让你能够使用结构化标准对这些追踪进行评分，从而在大规模范围内发现回归和故障模式。

当你想回答以下问题时，使用追踪评分：

- 智能体是否选择了正确的工具？
- 交接是否在应该发生时发生了？
- 工作流是否违反了指令或安全策略？
- 提示或路由更改是否改善了端到端行为？

### 追踪评估工作流

1. 打开 **日志** > **追踪** 在仪表板中。
2. 检查来自基于 SDK 应用的代表性 工作流 追踪，或在过渡窗口期间检查现有 智能体 Builder 工作流。
3. 创建一个评分器，并针对所选追踪运行它。
4. 使用结果来优化提示、工具表面、路由逻辑或护栏。

对于以代码为先的 SDK 工作流，请从 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability#tracing) 开始，以在正式制定评分器之前获得高信噪比的追踪。

## 当你需要可重复性时，转向数据集和评估运行

一旦你明确了“好”的标准，就从单个追踪转向可重复的数据集和评估运行。当你想对变更进行基准测试、比较提示词或随时间进行更大规模的评估时，这一步是正确的选择。

如果你需要高级功能，例如针对外部模型进行评估、评估 API，或更大规模的批量评估，请使用 [Evals](https://developers.openai.com/api/docs/guides/evals) 以及数据集。

## 相关评估界面

[在评估中入门：数据集



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[提示优化器



      Use your dataset to automatically improve your prompts.](https://developers.openai.com/api/docs/guides/prompt-optimizer)

[食谱：使用评估构建稳健提示



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)