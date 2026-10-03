# 数据集入门

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

评估（通常称为 **evals**）会测试模型输出，以确保它们符合你指定的样式和内容标准。编写 evals 是构建可靠应用的重要环节。 [数据集](https://platform.openai.com/evaluation/datasets)，作为 OpenAI 平台的一项功能，提供了一种快速上手 evals 和测试提示词的方式。

OpenAI 正在弃用 Evals 平台。现有 evals 内容在过渡期内保持
  可用。在此期间，现有用户的 Evals 将变为只读，并于
  2026 年 10 月 31 日生效，该平台计划于
  2026 年 11 月 30 日关闭。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 有关当前
  时间线。

如果你需要诸如针对外部模型的评估等高级功能，希望
  若希望通过 API 与你的评估运行交互，或希望在更大规模上运行评估，可改用
  评估 [Evals](https://developers.openai.com/api/docs/guides/evals) 。

## 创建数据集

首先，在仪表板中创建一个数据集。

1. 在 [评估页面](https://platform.openai.com/evaluation)，导航至 **Datasets** 标签页。
1. 点击 **Create** 按钮（位于右上角）即可开始。
1. 在输入框中为你的数据集命名。在本指南中，我们将数据集命名为“Investment memo generation”。
1. 添加数据。若要从零开始构建数据集，请点击 **Create** 并通过我们的可视化界面开始添加数据。如果你已有保存好的提示词或包含数据的 CSV 文件，请直接上传。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/dataset-creation.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

我们建议将你的数据集视为一个动态空间，随着时间推移不断扩展评估数据范围。当你识别出需要监控的边界情况或盲区时，可以通过仪表盘界面将其添加进来。

### 上传 CSV

我们有一个 CSV 文件，其中包含公司名称以及它们过去几个季度的实际营收数据。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/csv-upload.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

你的 CSV 中的列对提示词和评分器都可用。例如，我们的 CSV 包含输入列（`company`）和真实标签列（`correct_revenue`, `correct_income`），供评分器作为参考使用。

### 使用可视化数据界面

打开数据集后，你可以在 **数据** 选项卡中处理数据。点击单元格可以编辑其内容。添加一行以新增数据。你也可以在每行右侧的溢出菜单中删除或复制行。

若要保存更改，请点击 **保存** 按钮，位于右上角。

## 构建提示词

数据集中的选项卡允许多个提示与同一数据进行交互。

1. 要添加新的提示，请点击 **添加提示**.

   数据集设计为与你的 OpenAI [提示](https://developers.openai.com/api/docs/guides/prompt-engineering#version-prompts-in-code)。配合使用。如果你已在 OpenAI 平台上保存了提示，你可以在下拉菜单中选择它并在此界面中进行修改。要保存提示修改，请点击 **保存**.

   我们的提示采用版本控制系统，方便你安全地进行更新。
     点击 **保存** 会创建提示的新版本，你可以在 OpenAI 平台中引用或使用该版本。
     to or use anywhere in the 该公司 platform.

1. 在提示面板中，使用提供的字段和设置来控制推理调用：

- 点击右上角的滑块图标以控制模型 [`temperature`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-temperature) 以及 [`top_p`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-top_p).
- 添加工具，使你的推理调用能够访问网页、使用 MCP 或完成其他工具调用操作。
- 添加变量。提示与你的 [评分器](#add-graders) 都可以引用这些变量。
- 直接输入你的系统消息，或点击铅笔图标让模型根据你提供的基本指令为你生成一个提示。

在我们的示例中，我们将添加 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search) 工具，以便我们的模型调用能够从互联网拉取财务数据。在我们的变量列表中，我们将添加 `company` ，这样我们的提示词就可以引用数据集中的公司列。至于提示词，我们会让模型“生成一份财务报告”来生成一个。

## 生成并标注输出

数据和提示设置完成后，你就可以开始生成输出。模型的输出能让你了解它在给定提示和工具的情况下执行任务的表现。接下来，你需要对输出进行标注，以便模型随着时间的推移不断提升性能。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/generate-outputs-and-annotate.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. 在右上角，点击 **生成输出**.

   你会看到一个新的特殊 **output** 列开始填充结果。该列包含对数据集中每一行运行你的提示所得到的结果。

1. 生成输出准备就绪后，对其进行标注。通过点击 **output**, **评分**，列，或 **`output_feedback`** 列，打开标注视图。

   你可以根据需要标注任意数量的内容。数据集旨在支持任意程度和类型的标注，但你提供的信息质量越高，结果就会越好。

### 有什么注释

标注是评估和改进模型输出的关键部分。一个好的标注应当做到以下几点：

- 作为期望模型行为的真实依据，即使是非常具体的场景——包括风格和语气等主观要素
- 提供信息密度较高的上下文，以便（通过我们的提示优化器）自动改进提示
- 有助于诊断提示的不足之处，特别是在细微或偶发的场景中
- 有助于确保评分标准与你的意图保持一致

你可以选择只做少量或大量标注。数据集的设计可以兼容任意程度和任意类型的标注，但你提供的信息质量越高，最终效果就越好。此外，如果你并非数据集内容的专家，我们建议由该领域的专家来完成标注——这是将其专业知识融入你的优化过程中最有价值的方式。查看 [我们的 cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) ，了解更多我们发现的在使用评估提升提示词鲁棒性方面最有效的方法。

### Annotation starting points

以下是一些可帮助你入门的标注类型：

- 一个“好/差”评分，表明你对输出的判断
- 文本批评，位于 **`output_feedback`** 区域
- 你在 **“列”** 下拉菜单中（位于右上角）添加的自定义标注类别

### 融入专家标注

如果你不是数据集内容的专家，请让领域专家来进行标注。这是将专业知识融入优化过程的最佳方式。了解详情请参阅 Explore [我们的 cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) 。

## 添加评分器

虽然标注是将人工反馈融入评估流程的最有效方式，但评分器可帮助你大规模运行评估。评分器是自动评估，可根据其类型生成多种输入。

| **类型**                  | **详情**                                                                       | **用例**                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **字符串检查**          | 使用精确字符串匹配将模型输出与参考答案进行比较                | 检查你的响应是否与标准答案列完全匹配                                  |
| **文本相似度**       | 使用嵌入计算模型输出与参考答案之间的语义相似度 | 当不需要精确匹配时，检查你的响应与标准答案的接近程度 |
| **评分模型评分器**    | 使用 LLM 分配一个数值分数                                             | 以数值量表衡量友好度等主观属性                              |
| **标签模型评分器**    | 使用 LLM 选择一个分类标签                                         | 根据固定标签（如“简洁”或“冗长”）对你的响应进行分类                       |
| **Python 代码执行** | 运行自定义 Python 代码以编程方式计算结果                      | 检查输出是否包含少于 50 个词                                              |

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/graders.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. 在右上角，依次选择 Grade > **New grader**.
1. 从下拉菜单中选择你的评分器类型，并填写表单以编写你的评分器。
1. 引用你数据集中的列来对照真实值进行校验。
1. 创建评分器。
1. 添加至少一个评分器后，使用 **Grade** 下拉菜单可在你的数据集上运行指定的评分器或所有评分器。运行完成后，你将在数据集中看到每个评分器对应的专属列中显示通过/未通过的评分。

保存数据集后,当你对数据集和提示进行更改时,评分器会自动保留,这使它们成为快速评估提示或模型参数更改是否带来改进、或添加边缘用例是否暴露出提示缺陷的好方法。数据集仪表板支持多个标签页,可同时跟踪提示的多个变体上自动评分器的结果。

详细了解我们的 [评分器](https://developers.openai.com/api/docs/guides/graders).

## Next steps

数据集非常适合快速迭代。当你准备好跟踪随时间变化的性能或进行大规模运行时，可以将数据集导出到 [Eval](https://developers.openai.com/api/docs/guides/evals)。Eval 异步运行，支持更大的数据量，并允许你跨版本监控性能。

如需获取更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook/topic/evals)，其中包含示例代码和第三方资源链接，或者详细了解我们的评估工具：

[Cookbook：使用评估构建弹性提示



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[提示优化器



      Use your dataset to automatically improve your prompts.](https://developers.openai.com/api/docs/guides/prompt-optimizer)

[评分器



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)