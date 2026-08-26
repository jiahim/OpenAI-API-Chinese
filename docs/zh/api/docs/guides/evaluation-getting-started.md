# 数据集入门

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

评估（通常称为 **evals**）用于测试模型输出，以确保其符合你指定的风格和内容标准。编写 eval 是构建可靠应用的重要组成部分。 [数据集](https://platform.openai.com/evaluation/datasets)，是 OpenAI 平台的一项功能，提供了一种快速开始使用 eval 和测试提示词的方法。

OpenAI 正在弃用 Evals 平台。现有 eval 内容在
  过渡期内仍然可用。2026 年 10 月 31 日起，Evals 将对
  现有用户变为只读，平台计划于 2026 年 11 月 30 日
  关闭。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解当前
  时间线。

如果你需要高级功能，例如针对外部模型进行评估，希望
  通过 API 与 eval 运行交互，或希望更大规模地运行评估，
  请考虑使用 [Evals](https://developers.openai.com/api/docs/guides/evals) 作为替代方案。

## 创建数据集

首先，在仪表盘中创建一个数据集。

1. 在 [评估页面](https://platform.openai.com/evaluation)，上，导航到 **数据集** 标签页。
1. 点击右上角的 **创建** 按钮即可开始。
1. 在输入字段中为你的数据集添加名称。在本指南中，我们将数据集命名为“投资备忘录生成”。
1. 添加数据。要从零开始构建数据集，请点击 **创建** 并通过我们的可视化界面开始添加数据。如果你已有保存的提示词或包含数据的 CSV 文件，请上传它。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/dataset-creation.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

我们建议将你的数据集作为动态空间使用，随着时间推移扩展你的评估数据集合。当你识别出需要监控的边界情况或盲点时，使用仪表板界面将其添加进来。

### 上传 CSV

我们有一个简单的 CSV 文件，包含公司名称以及它们过去几个季度的实际营收值。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/csv-upload.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

CSV 中的列既可供你的提示词使用，也可供评分器使用。例如，我们的 CSV 包含输入列（`company`) 和真实值列（`correct_revenue`, `correct_income`)，供评分器参考使用。

### 使用视觉数据接口

打开数据集后，你可以在 **数据** 选项卡中操作数据。点击单元格可编辑其内容。添加行可增加更多数据。你还可以在每行右侧边缘的溢出菜单中删除或复制行。

要保存更改，请点击右上角的 **保存** 按钮。

## 构建提示词

数据集仪表板中的选项卡允许多个提示与同一数据进行交互。

1. 要添加新提示词，请点击 **添加提示词**.

   数据集设计为与您的 OpenAI [提示词](https://developers.openai.com/api/docs/guides/prompt-engineering#version-prompts-in-code)。一起使用。如果您已在 OpenAI 平台上保存了提示词，您将能够从下拉菜单中选择它，并在此界面中进行修改。要保存提示词更改，请点击 **保存**.

   我们的提示词使用版本控制系统，以便您可以安全地进行更新。
     点击 **保存** 会创建提示词的新版本，您可以在 OpenAI
     平台中的任何位置引用或使用它。

1. 在提示词面板中，使用提供的字段和设置来控制推理调用：

- 点击右上角的滑块图标以控制模型 [`temperature`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-temperature) 和 [`top_p`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-top_p).
- 添加工具，使您的推理调用能够访问网络、使用 MCP 或完成其他工具调用操作。
- 添加变量。提示词和您的 [评分器](#add-graders) 都可以引用这些变量。
- 直接输入您的系统消息，或点击铅笔图标，让模型根据您提供的基本指令帮助生成提示词。

在我们的示例中，我们将添加 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search) 工具，以便我们的模型调用可以从互联网获取财务数据。在我们的变量列表中，我们将添加 `company` 以便我们的提示词可以引用数据集中的公司列。至于提示词，我们将通过告诉模型“生成一份财务报告”来生成一个。

## 生成并标注输出

设置好数据和提示词后，就可以生成输出。模型的输出让你了解模型使用你提供的提示词和工具执行任务的表现。随后，你需要对输出进行标注，以便模型随时间改进其性能。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/generate-outputs-and-annotate.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. 在右上角，点击 **生成输出**.

   你将看到一个新的特殊 **输出** 列开始在数据集中填充结果。此列包含在数据集中每一行上运行提示词得到的结果。

1. 生成输出准备好后，对其进行标注。通过点击 **输出**, **评分**，或 **输出反馈** 列打开标注视图。

   根据需要标注尽可能少或尽可能多的内容。数据集设计为支持任意程度和类型的标注，但你提供的信息质量越高，结果就越好。

### 何为注释

标注是评估和改进模型输出的关键部分。一个好的标注：

- 作为期望模型行为的基准事实，即使对于高度特定的情况也是如此——包括主观元素，如风格和语气
- 提供信息密集的上下文，支持自动提示改进（通过我们的提示优化器）
- 帮助诊断提示的不足，尤其是在微妙或罕见的情况下
- 帮助确保评分者与你的意图保持一致

你可以选择标注尽可能少或尽可能多的内容。数据集旨在支持任何程度和类型的标注，但你提供的信息质量越高，效果就会越好。此外，如果你不是数据集内容方面的专家，我们建议由主题专家来执行标注——这是将他们的专业知识融入优化过程最有价值的方式。探索 [我们的 cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) ，了解更多我们在使用评估提升提示词韧性方面发现的最有效方法。

### 注解起点

以下是一些你可以用来入门的注释类型：

- 好评/差评，表示你对输出的评价
- 在 **output_feedback** 部分
- 你在 **Columns** 右上角下拉菜单中添加的自定义标注类别

### 整合专家注释

如果你不是数据集内容的专家，请让领域专家执行标注。这是将专业知识融入优化过程的最佳方式。探索 [我们的食谱](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) 以了解更多。

## 添加评分器

虽然标注是将人类反馈纳入评估流程的最有效方式，但评分器让你能够大规模运行评估。评分器是自动化评估，可根据其类型产生多种输入。

| **类型**                  | **详情**                                                                       | **用例**                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **字符串检查**          | 使用精确字符串匹配将模型输出与参考进行比较                | 检查你的回答是否与真实答案列完全匹配                                  |
| **文本相似度**       | 使用嵌入计算模型输出与参考之间的语义相似度 | 当不需要精确匹配时，检查你的回答与真实答案的接近程度 |
| **评分模型评估器**    | 使用 LLM 分配数值分数                                             | 在数值尺度上衡量友好性等主观属性                              |
| **标签模型评估器**    | 使用 LLM 选择分类标签                                         | 根据固定标签（如“简洁”或“冗长”）对你的回答进行分类                       |
| **Python 代码执行** | 运行自定义 Python 代码以编程方式计算结果                      | 检查输出是否少于 50 个单词                                              |

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/graders.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. 在右上角，导航到 Grade > **New grader**.
1. 从下拉菜单中选择你的评分器类型，并填写表单以构建评分器。
1. 引用数据集中的列，以与真实值进行核对。
1. 创建评分器。
1. 一旦你至少添加了一个评分器，使用 **Grade** 下拉菜单在数据集上运行特定评分器或所有评分器。运行完成后，你将在数据集中看到每个评分器专用列中的通过/失败评级。

保存数据集后，当你对数据集和提示词进行修改时，评分器会持续存在，这使其成为快速评估提示词或模型参数变更是否带来改进，或添加边界情况是否揭示提示词缺点的绝佳方式。数据集仪表板支持多个选项卡，可同时跟踪多个提示词变体的自动化评分器结果。

了解更多关于我们的 [评分器](https://developers.openai.com/api/docs/guides/graders).

## 后续步骤

数据集非常适合快速迭代。当你准备随时间跟踪性能或以规模运行时，请将数据集导出为 [Eval](https://developers.openai.com/api/docs/guides/evals)。Eval 异步运行，支持更大的数据量，并允许你跨版本监控性能。

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook/topic/evals)，其中包含示例代码和第三方资源链接，或了解更多关于我们的评估工具：

[Cookbook：使用 evals 构建稳健的提示词



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[使用 evals



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[提示词优化器



      Use your dataset to automatically improve your prompts.](https://developers.openai.com/api/docs/guides/prompt-optimizer)

[评分器



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)