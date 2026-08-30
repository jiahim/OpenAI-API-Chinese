# 追踪评分

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

追踪评分是指为智能体的追踪（即决策、工具调用和推理步骤的端到端日志）分配结构化分数或标签的过程，用于评估正确性、质量或对期望的遵循程度。这些标注有助于识别智能体表现良好的地方或犯错的地方，从而有针对性地改进编排或行为。

追踪评估使用这些已评分的追踪来系统地评估智能体在多个示例上的表现，从而帮助基准测试变更、识别回归或验证改进。与黑盒评估不同，追踪评估提供更多数据来更好地理解智能体成功或失败的原因。

结合使用这两个功能，可以追踪、分析和优化智能体组的性能。

## 开始使用追踪

1. 在仪表板中，导航至 Logs > [Traces](https://platform.openai.com/logs?api=traces).
1. 选择一个工作流。你将看到来自基于SDK的应用以及来自现有 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) 工作流在过渡窗口期间的追踪记录。
1. 选择一个追踪以检查你的工作流。
1. 创建一个评分器，并运行它以根据评分标准评估你的智能体的表现。

追踪评分是在规模化场景中识别错误的有力工具，对于构建具有韧性的 AI 应用至关重要。你可以在我们的 [cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel).

## 通过运行评估追踪

1. 选择 **全部评级**。这将带你进入评估仪表板。
1. 在评估仪表板中，添加并编辑测试标准。
1. 添加一次运行以评估输出。你可以配置运行选项，例如模型、日期范围和工具调用，以便让评估更具针对性。

详细了解如何使用 evals [此处](https://developers.openai.com/api/docs/guides/evals).