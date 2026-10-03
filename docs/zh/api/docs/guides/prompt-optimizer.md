# Prompt optimizer

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

该 [提示词优化器](https://platform.openai.com/chat/edit?optimize=true) 是控制面板中的一个聊天界面，你可以在其中输入提示词，我们会按照当前最佳实践对其进行优化后再返回给你。将提示词优化器与 [数据集](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 搭配使用是一种自动改进提示词的有效方式。

OpenAI 将作为 Evals 平台的一部分弃用基于数据集的提示词优化器。
  Evals 将于 2026-10-31 对现有用户变为只读，
  并计划于 2026-11-30 关闭平台。请参阅
  [弃用页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解
  当前时间表。

## 准备你的数据

1. 设置一个 [数据集](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 其中包含你想要优化的提示词以及一个评估数据集。
1. 在你的数据集中创建至少三行带有回答的数据。
1. 对每一行，至少创建一个评分器结果或人工标注。

提示优化器可以使用你数据集中的以下信息来优化你的提示：

- 标注（Good/Bad 以及你额外添加的自定义标注列）
- 以文字形式撰写的批评意见 **`output_feedback`**
- 评分器的结果

为获得有效结果，请添加包含“好/差”评级的标注 _以及_ 具体且详细的评析。创建 [评分器](https://developers.openai.com/api/docs/guides/evaluation-getting-started#add-graders) ，使其精准捕捉你期望提示词具备的各项特性。

## 优化你的提示词

准备好数据集后，创建一个优化任务。

1. 在提示词面板底部，点击 **Optimize**。这会为优化后的结果创建一个新标签页，并在后台启动优化流程。
1. 当优化后的提示词就绪后，查看并测试新的提示词。
1. 重复。单个优化运行可能就能达到你期望的效果，但也可以尝试对新提示词重复该优化过程——生成输出、标注输出、运行评分器，然后进行优化。

提示词优化的效果取决于你的
  评分器的质量。我们建议针对每个你看到提示词失败的期望输出属性，构建定义明确的评分器。
  在出现提示词失败的期望输出属性上，构建定义明确的评分器。

在生产环境中使用优化后的提示词之前，请始终进行评估和人工审核。虽然提示词优化器通常能严格提升提示词的效果，但仍存在优化后的提示词在特定输入上表现不如原始提示词的可能性。

## 后续步骤

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和第三方资源链接，或详细了解我们的 evals 工具：

[Cookbook：使用 evals 构建弹性提示



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[使用 evals



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[评分器



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)

[微调



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)