# 数据集入门

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

评估（通常称为 **evals**) 用于测试模型的输出，以确保它们符合你指定的风格和内容要求。编写 evals 是构建可靠应用的重要组成部分。 [数据集](https://platform.openai.com/evaluation/datasets)，是 OpenAI 平台的一项功能，提供了一种快速开始 evals 和测试提示的方式。

OpenAI 正在弃用 Evals 平台。在过渡期内现有的 evals 内容仍然
  可用。Evals 将于 2026/10/31 对现有
  用户变为只读，并计划于 2026/11/30 关停该平台。请参阅
  弃用说明 [弃用说明
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解当前的
  时间表。

如果你需要高级功能，例如针对外部模型的评估、希望通过 API 与 eval 运行交互，或者希望以
  更大的规模运行评估，可以考虑使用
  更大的规模运行评估，可考虑使用 [Evals](https://developers.openai.com/api/docs/guides/evals) 。

## 创建数据集

首先，在控制台中创建一个数据集。

1. 在 [评估页面](https://platform.openai.com/evaluation)，上，导航到 **Datasets** 选项卡。
1. 点击 **Create** 按钮（位于右上角）即可开始。
1. 在输入框中为你的数据集命名。在本指南中，我们将其命名为“Investment memo generation”。
1. 添加数据。若要从零开始构建数据集，请点击 **Create** 并通过我们的可视化界面开始添加数据。如果你已有已保存的提示词或包含数据的 CSV，可以直接上传。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/dataset-creation.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

我们建议将数据集用作一个动态空间,随着时间推移不断扩充评估数据。当你发现需要监控的边缘情况或盲区时,通过仪表板界面将其添加进来。

### 上传 CSV

我们有一个简单的 CSV 文件，其中包含公司名称以及它们过去几个季度的实际营收值。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/csv-upload.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

你的 CSV 中的列对你的提示和评分器都是可访问的。例如，我们的 CSV 包含输入列（`company`）和作为参考答案的真实列（`correct_revenue`, `correct_income`），供我们的评分器使用。

### 使用可视化数据界面

打开数据集后，你可以在 **Data** 标签页中操作你的数据。点击单元格可以编辑其内容。添加一行以增加更多数据。你也可以在每行右侧的溢出菜单中删除或复制行。

若要保存更改，请点击 **Save** 按钮，该按钮位于右上角。

## 构建提示词

数据集中的选项卡可让你使用多个提示词与同一份数据进行交互。

1. 若要添加新的提示词，请点击 **添加提示词**.

   数据集被设计为可与你的 OpenAI [提示词](https://developers.openai.com/api/docs/guides/prompt-engineering#version-prompts-in-code)。配合使用。如果你已在 OpenAI 平台保存了提示词，可以从下拉菜单中选择它，并在此界面中进行修改。要保存你的提示词修改，请点击 **保存**.

   我们的提示词使用版本管理系统，因此你可以安全地进行更新。
     点击 **保存** 会创建你的提示词的新版本，你可以在 OpenAI 平台的任意位置引用或使用该版本
     。

1. 在提示词面板中，使用提供的字段和设置来控制推理调用：

- 点击右上角的滑块图标以控制模型 [`temperature`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-temperature) 和 [`top_p`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-top_p).
- 添加工具，让你的推理调用能够访问网页、使用 MCP 或完成其他工具调用操作。
- 添加变量。提示词和你的 [评分器](#add-graders) 都可以引用这些变量。
- 直接输入你的系统消息，或点击铅笔图标让模型根据你提供的基本说明为你生成提示词。

在我们的示例中，我们将添加 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search) 工具，以便我们的模型调用可以从互联网拉取财务数据。在我们的变量列表中，我们将添加 `company` 以便我们的提示可以引用数据集中的公司列。对于提示，我们将通过告诉模型“生成一份财务报告”来生成一个。

## 生成并标注输出

完成数据和提示词的配置后，你就可以开始生成输出。模型的输出能够帮助你了解它在使用你提供的提示词和工具执行任务时的表现。接下来，你将对这些输出进行标注，以便模型随着时间推移不断提升其表现。

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/generate-outputs-and-annotate.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. 在右上角，点击 **Generate output**.

   你会看到一个新的特殊 **output** 列开始填充结果。该列包含针对数据集中每一行运行你的提示所得到的结果。

1. 生成输出就绪后，对其进行标注。通过点击 **output**, **rating**，或 **output_feedback** 列打开标注视图。

   你可以按需进行少量或大量标注。数据集被设计为可适配任意程度和类型的标注，但你提供的信息质量越高，最终结果就越好。

### 什么是 annotation

标注是评估和改进模型输出的关键部分。一个好的标注应该具备以下几点：

- 作为期望模型行为的真实参考，即使在高度具体的场景中也同样适用——包括风格、语气等主观要素
- 提供信息密度较高的上下文，以便（通过我们的提示词优化器）自动改进提示词
- 有助于诊断提示词的不足，尤其适用于细微或罕见的场景
- 有助于确保评分器与你的意图保持一致

你可以选择进行少量或大量的标注。数据集被设计为可以与任意程度和类型的标注配合使用，但你能提供的信息质量越高，最终效果就越好。此外，如果你并非数据集内容的专家，我们建议由领域专家来完成标注——这是将其专业知识融入你的优化流程的最有价值的方式。查阅 [我们的 cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) ，了解更多我们在使用评估来提升 prompt 鲁棒性方面发现的最有效实践。

### 标注起点

以下是一些你可以用来入门的注释类型：

- 一个“好/差”评级，表示你对输出的判断
- 在 **output_feedback** 部分中的文本评价
- 你在 **列** 右上角的下拉菜单中添加的自定义标注类别

### Incorporate expert annotations

如果你并非数据集内容的专家，请由领域专家进行标注。这是将专业知识融入优化过程的最佳方式。Explore [我们的 cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) 以了解更多信息。

## 添加评分器

虽然标注是将人类反馈纳入评估流程的最有效方式，但评分器（grader）可让你大规模运行评估。评分器是自动化评估，可根据其类型产生多种输入。

| **类型**                  | **详细信息**                                                                       | **使用场景**                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **字符串校验**          | 使用精确字符串匹配来比较模型输出与参考答案                | 检查响应是否与标准答案字段完全匹配                                  |
| **文本相似度**       | 使用嵌入向量计算模型输出与参考答案之间的语义相似度 | 在不需要精确匹配时，检查响应与参考答案的接近程度 |
| **评分模型评分器**    | 使用 LLM 分配一个数值分数                                             | 以数值化尺度衡量诸如友好度之类的主观属性                              |
| **分类模型评分器**    | 使用 LLM 选择一个分类标签                                         | 根据固定标签对响应进行分类，例如“简洁”或“冗长”                       |
| **Python 代码执行** | 运行自定义 Python 代码以编程方式计算结果                      | 检查输出是否包含少于 50 个词                                              |

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/graders.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. 在右上角，依次选择 Grade > **New grader**.
1. 在下拉菜单中选择评分器类型，并填写表单以配置你的评分器。
1. 引用你数据集中的列，与真实值进行比对。
1. 创建评分器。
1. 至少添加一个评分器后，使用 **Grade** 下拉菜单在你的数据集上运行指定的评分器或全部评分器。运行完成后，你会在数据集中看到每个评分器对应专属列里的通过/未通过结果。

保存数据集后，当你修改数据集和提示词时，评分器会持续保留，这使得它成为快速评估提示词或模型参数更改是否带来改进、或者新增边界情况是否暴露提示词不足之处的绝佳方式。数据集仪表板支持多个标签页，可同时跨同一提示词的多个变体跟踪来自自动评分器的结果。

详细了解我们的 [评分器](https://developers.openai.com/api/docs/guides/graders).

## 后续步骤

数据集非常适合快速迭代。当你准备好跟踪一段时间内的表现或大规模运行时，可以将你的数据集导出到一个 [Eval](https://developers.openai.com/api/docs/guides/evals)。评估会异步运行，支持更大的数据量，并让你能够跨版本监控性能。

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook/topic/evals)，其中包含示例代码和第三方资源的链接，或进一步了解我们的评估工具：

[Cookbook：使用评估构建弹性提示



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[使用评估进行工作



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[提示优化器



      Use your dataset to automatically improve your prompts.](https://developers.openai.com/api/docs/guides/prompt-optimizer)

[评分器



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)