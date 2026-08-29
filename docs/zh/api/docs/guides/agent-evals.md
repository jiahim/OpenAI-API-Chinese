# 评估智能体工作流

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可在页面 URL 后追加 `.md` 以获取文档页面的 Markdown 版本。

OpenAI 平台提供了一套评估工具，帮助你确保 智能体 的表现稳定且准确。

对于 智能体 工作流，请以此页面作为选择最关键评估界面的决策依据。

## 在仍处于行为调试阶段时，从追踪入手

追踪评分是识别 工作流 级问题的最快方式。一次 追踪 会捕获单次运行中模型调用、工具调用、护栏和交接的端到端记录。评分器允许你使用结构化标准对这些追踪进行打分，以便规模化地发现回归和失败模式。

当你想要回答以下问题时，可以使用 追踪 评分：

- 智能体是否选择了合适的工具？
- 是否在应该交接时发生了交接？
- 工作流是否违反了指令或安全策略？
- 提示或路由的更改是否改善了端到端行为？

### 追踪评估 工作流

1. 打开 **日志** > **追踪** 查看仪表板。
2. 从基于 SDK 的应用，或在过渡期内的现有 智能体 Builder 工作流 中，检查一个具有代表性的 工作流 追踪。
3. 创建一个评分器，并将其运行在所选追踪上。
4. 根据结果优化提示词、工具界面、路由逻辑或护栏。

对于代码优先的 SDK 工作流，请从 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability#tracing) 入手，以便在正式定义评分器之前获得高信号的追踪。

## 在需要可复现性时切换到数据集和评估运行

当你明确了“好”的标准之后，就可以从单次的追踪转向可复用的数据集和评测运行。当你想对改动进行基准测试、比较不同的 prompt，或者随着时间推移开展更大规模的评测时，这是正确的一步。

如果你需要更高级的功能，例如对外部模型进行评测、评测 API，或开展更大规模的批量评测，请使用 [Evals](https://developers.openai.com/api/docs/guides/evals) 配合数据集一起使用。

## 相关评估界面

[开始使用评估：数据集



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[使用评估进行开发



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[提示优化器



      Use your dataset to automatically improve your prompts.](https://developers.openai.com/api/docs/guides/prompt-optimizer)

[Cookbook：使用评估构建弹性提示



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)