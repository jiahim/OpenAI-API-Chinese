# Prompt optimizer

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

该 [prompt optimizer](https://platform.openai.com/chat/edit?optimize=true) 是仪表板中的一个聊天界面，你可以在其中输入提示词，我们会根据当前最佳实践对其进行优化后再返回给你。将提示词优化器与 [数据集](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 结合使用，是自动改进提示词的强大方式。

OpenAI 正在弃用 Evals 平台中由数据集支持的提示词优化器。
  Evals 将于 2026-10-31 对现有用户变为只读，
  该平台计划于 2026-11-30 关停。详见
  [弃用页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 以了解
  当前时间表。

## 准备数据

1. 设置一个 [dataset](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 其中包含你想要优化的提示词以及一个评估数据集。
1. 在你的数据集中创建至少三行带有回答的数据。
1. 对于每一行，创建至少一个评分器结果或人工标注。

提示优化器可以使用你数据集中的以下内容来改进你的提示：

- 标注（Good/Bad 以及你添加的其他自定义标注列）
- 以 **output_feedback**
- 评分器的结果

为了获得有效的结果，请添加包含“好/差”评级的标注 _以及_ 详细、具体的点评。创建 [评分器](https://developers.openai.com/api/docs/guides/evaluation-getting-started#add-graders) ，以便精确地捕捉你希望提示词具备的属性。

## 优化你的提示

准备好数据集后，创建一个优化。

1. 在提示词面板底部，点击 **Optimize**。系统会为优化结果打开一个新标签页，并启动一个在后台运行的优化过程。
1. 当优化后的提示词就绪后，查看并测试新的提示词。
1. 重复上述过程。虽然单次优化运行可能就能达到预期效果，但仍可在新提示词上重复优化过程——生成输出、标注输出、运行评分器并不断优化——以进行实验。

提示优化的有效性取决于你的
  评分器的质量。我们建议针对你观察到提示失败的每一个
  期望输出属性，构建定义明确的窄范围评分器。

在生产环境中使用优化后的提示之前，请始终进行评估并人工复核。虽然提示优化器通常能够严格提升提示的有效性，但在特定输入上，优化后的提示仍有可能比原始提示表现更差。

## 后续步骤

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码以及第三方资源链接，或者详细了解我们的评估工具：

[Cookbook：使用评估构建弹性提示



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[评分器



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)

[微调



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)