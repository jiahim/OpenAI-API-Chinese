# 模型优化

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取文档页面的 Markdown 版本。

LLM 输出具有不确定性，模型行为会因模型快照和系列的不同而变化。开发者必须持续衡量和调优 LLM 应用的表现，以确保获得最佳结果。本指南将介绍相关技术以及 OpenAI 平台提供的工具，帮助你确保模型输出高质量结果。

本指南涵盖的评估与微调工作流正在迁移至
  旧版文档。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解
  相关平台功能当前的时间安排。



  - **[Evals](https://developers.openai.com/api/docs/guides/evals)**：系统地衡量性能。
- **[Prompt engineering](https://developers.openai.com/api/docs/guides/text?api-mode=responses#prompt-engineering)**：提供上下文、指令和目标。
- **[Fine-tuning](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)**：训练模型在某项任务上表现出色。



## 模型优化工作流

优化模型输出需要结合 **评估**, **提示工程**，以及 **微调**，形成一个反馈飞轮，从而带来更好的提示和更优质的微调训练数据。优化过程通常如下所示。

1. 编写 [evals](https://developers.openai.com/api/docs/guides/evals) 以衡量模型输出，建立性能和准确率的基线。
1. [提示模型](https://developers.openai.com/api/docs/guides/text) 输出，并提供相关的上下文数据和指令。
1. 对于某些用例，可能需要针对特定任务 [微调](#fine-tune-a-model) 模型。
1. 使用能够代表真实世界输入的测试数据运行 evals。衡量你的提示和微调模型的性能。
1. 根据 evals 反馈调整你的提示或微调数据集。
1. 持续重复该循环以改进你的模型结果。

以下是主要步骤概览，以及如何使用 OpenAI 平台完成这些步骤。

## 构建评估

在 OpenAI 平台上，你可以 [构建并运行评估](https://developers.openai.com/api/docs/guides/evals) 通过 API 或在 [仪表板](https://platform.openai.com/evaluations)。中进行。你甚至可以考虑在开始编写提示之前 _就_ 编写评估，采用一种类似于行为驱动开发（BDD）的方法。

针对你预期在生产环境中会遇到的测试输入运行你的评估。使用以下几种可用的 [评分器](https://developers.openai.com/api/docs/guides/graders)，之一，根据你的测试数据集衡量提示的结果。

[了解评估



      Run tests on your model outputs to ensure you're getting the right results.](https://developers.openai.com/api/docs/guides/evals)

## 编写有效的提示词

在评估就位后，你就可以有效地迭代 [提示](https://developers.openai.com/api/docs/guides/text)。针对你的使用场景，提示工程流程可能就是获得出色结果的全部所需。不同的模型可能需要不同的提示技巧，但你可以应用若干通用最佳实践以获得更好的效果。

- **包含相关上下文** - 在你的指令中，提供模型生成响应所需的训练数据之外的文本或图像内容。这可能包括来自私有数据库的数据或最新的实时信息。
- **提供清晰的指令** - 你的提示应包含明确的目标，说明你希望得到什么样的输出。从以下开始： [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 开始新工作时，使用 [推理模型指南](https://developers.openai.com/api/docs/guides/reasoning) 来调整结果级指令、推理力度和详细程度。
- **提供示例输出** - 给模型提供几个针对给定提示的正确输出示例（这一过程称为少样本学习）。模型可以基于这些示例推断出在其他提示下应如何响应。

[了解提示工程



      Learn the basics of writing good prompts for the model.](https://developers.openai.com/api/docs/guides/text)

## 微调模型

OpenAI 正在逐步关停微调平台。该平台已不再
  对新增用户开放，但现有微调平台用户在
  未来几个月内仍可创建训练任务。
  

  所有微调模型在对应的基座
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将保持可用。完整的时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).

OpenAI 模型已经过预训练，可在广泛的主题和任务上表现良好。微调让你可以基于一个 OpenAI 基座模型，提供你在应用中期望的输入和输出形式，从而得到一个在你要使用的任务上表现出色的模型。

微调可能是一个耗时的过程，但它也能让模型以特定方式稳定地格式化响应，或处理全新的输入。你可以将微调与 [提示工程](https://developers.openai.com/api/docs/guides/text) 结合使用，从而在单纯提示的基础上获得更多收益：

- 你可以提供超出单次请求上下文窗口所能容纳的更多示例输入和输出，使模型能够处理更广泛类型的提示。
- 你可以使用更短的提示，并减少示例和上下文数据，从而在大规模使用时节省 token 成本并降低延迟。
- 你可以使用专有或敏感数据进行训练，而无需在每次请求中都通过示例将其包含进来。
- 你可以训练一个更小、更便宜、更快的模型，使其在大型模型不具备成本效益的特定任务上表现出色。

访问我们的 [定价页面](https://openai.com/api/pricing) 详细了解微调模型的训练和使用计费方式。

### 微调方法

这些是 OpenAI 平台目前支持的全部微调方法。



<table>
<tbody>
<tr>
<th>Method</th>
<th>How it works</th>
<th>Best for</th>
<th>Use with</th>
</tr>

<tr>
<td>
[Supervised fine-tuning (SFT)](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)
</td>
<td>
Provide examples of correct responses to prompts to guide the model's behavior.

Often uses human-generated "ground truth" responses to show the model how it should respond.

</td>
<td>
- Classification
- Nuanced translation
- Generating content in a specific format
- Correcting instruction-following failures
</td>
<td>
`gpt-4.1-2025-04-14`
`gpt-4.1-mini-2025-04-14`
`gpt-4.1-nano-2025-04-14`
</td>
</tr>

<tr>
  <td>[Vision fine-tuning](https://developers.openai.com/api/docs/guides/vision-fine-tuning)</td>
  <td>
    Provide image inputs for supervised fine-tuning to improve the model's
    understanding of image inputs.
  </td>
  <td>
    - Image classification - Correcting failures in instruction following for
    complex prompts
  </td>
  <td>`gpt-4o-2024-08-06`</td>
</tr>

<tr>
  <td>
    [Direct preference optimization
    (DPO)](https://developers.openai.com/api/docs/guides/direct-preference-optimization)
  </td>
  <td>
    Provide both a correct and incorrect example response for a prompt. Indicate
    the correct response to help the model perform better.
  </td>
  <td>
    - Summarizing text, focusing on the right things - Generating chat messages
    with the right tone and style
  </td>
  <td>
    `gpt-4.1-2025-04-14` `gpt-4.1-mini-2025-04-14` `gpt-4.1-nano-2025-04-14`
  </td>
</tr>

<tr>
<td>
[Reinforcement fine-tuning (RFT)](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)
</td>
<td>
Generate a response for a prompt, provide an expert grade for the result, and reinforce the model's chain-of-thought for higher-scored responses.

Requires expert graders to agree on the ideal output from the model.

**Reasoning models only**.

</td>
<td>
- Complex domain-specific tasks that require advanced reasoning
- Medical diagnoses based on history and diagnostic guidelines
- Determining relevant passages from legal case law
</td>
<td>
`o4-mini-2025-04-16`
</td>
</tr>
</tbody>
</table>



### 微调的工作原理

在 OpenAI 平台上,你可以通过以下任一方式创建微调模型: [仪表板](https://platform.openai.com/finetune) 或 [使用 API](https://developers.openai.com/api/reference/resources/fine_tuning)。微调流程的整体形态如下:

1. 收集用作训练数据的示例数据集
1. 将该数据集以 JSONL 格式上传到OpenAI
1. 根据你的目标，使用上述方法之一创建微调任务——这将启动微调训练过程
1. 对于 RFT，你还需要定义一个评分器来对模型的行为进行打分
1. 评估结果

开始使用 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning), [视觉微调](https://developers.openai.com/api/docs/guides/vision-fine-tuning), [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization)，或 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning).

## 向专家学习

模型优化是一个复杂的主题，有时与其说是科学，不如说是艺术。请观看以下来自 OpenAI 团队成员关于模型优化技术的视频。



成本/准确度/延迟

    <iframe
      width="100%"
      height="400"
      src="https://www.youtube.com/embed/Bx6sUDRMx-8?si=i3Tl8qEjlCdOtyiU"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  

  

    
蒸馏

    <iframe
      width="100%"
      height="400"
      src="https://www.youtube.com/embed/CqWpJFK-hOo?si=7ztgDp1inte0vnw7"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  

  

    
优化 LLM 性能

    <iframe
      width="100%"
      height="400"
      src="https://www.youtube-nocookie.com/embed/ahnGLM-RC1Y?si=cPQngClssVG_R2_q"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>