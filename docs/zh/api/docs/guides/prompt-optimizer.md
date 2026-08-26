# 提示词优化器

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

提示词优化器（ [prompt optimizer](https://platform.openai.com/chat/edit?optimize=true) ）是仪表盘中的一个聊天界面，你可以在其中输入提示词，我们会根据当前最佳实践优化后再返回给你。将提示词优化器与 [数据集](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 结合使用是自动改进提示词的有力方法。

OpenAI 正在弃用基于数据集的提示词优化器，作为 Evals 平台的一部分。
  从 2026 年 10 月 31 日起，Evals 将对现有用户变为只读，
  该平台计划于 2026 年 11 月 30 日关闭。请参阅
  [弃用页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解
  当前时间表。

## 准备你的数据

1. 设置一个 [数据集](https://developers.openai.com/api/docs/guides/evaluation-getting-started) ，其中包含你想要优化的提示词和一个评估数据集。
1. 在你的数据集中至少创建三行包含响应的数据。
1. 对于每一行，至少创建一个评分结果或人工标注。

提示词优化器可以使用你数据集中的以下内容来改进提示词：

- 标注（好/坏及你添加的额外自定义标注列）
- 以 **output_feedback**
- 评分器结果

为获得有效结果，请添加包含“好/差”评级的注释 _以及_ 详细、具体的批评意见。创建 [评分器](https://developers.openai.com/api/docs/guides/evaluation-getting-started#add-graders) ，以精确捕捉你希望从提示中获得的属性。

## 优化你的提示词

准备好数据集后，即可创建优化。

1. 在提示词窗格底部，点击 **优化**。这将为优化结果创建一个新标签页，并在后台启动优化过程。
1. 当优化后的提示词准备好时，查看并测试新提示词。
1. 重复。虽然单次优化运行可能达到你期望的结果，但可以尝试对新提示词重复优化过程——生成输出、标注输出、运行评分器并优化。

提示优化的效果取决于你的
  评估器（grader）的质量。我们建议针对每个
  你观察到提示词失败的期望输出属性，构建窄范围定义的评估器。

在将优化后的提示词用于生产环境之前，务必进行评估并手动审查。尽管提示词优化器通常能显著提升提示词的有效性，但优化后的提示词在特定输入上的表现有可能不如原始提示词。

## 后续步骤

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和第三方资源链接，或进一步了解我们用于评估的工具：

[Cookbook：使用评估构建稳健的提示词



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[评分器



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)

[微调



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)