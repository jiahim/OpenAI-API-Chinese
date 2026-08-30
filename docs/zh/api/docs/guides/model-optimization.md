# 模型优化

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

LLM 的输出具有不确定性，并且模型行为会随模型快照和版本系列的不同而变化。开发者必须持续衡量并调优 LLM 应用的性能，以确保获得最佳结果。在本指南中，我们将探讨你可以使用的技术以及 OpenAI 平台工具，以确保模型输出高质量的结果。

本指南涵盖的评估与微调工作流已迁移至
  旧版文档中。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) ，了解
  受影响平台表面的当前时间表。



  - **[Evals](https://developers.openai.com/api/docs/guides/evals)**：系统性地衡量性能。
- **[Prompt engineering](https://developers.openai.com/api/docs/guides/text?api-mode=responses#prompt-engineering)**：提供上下文、指令和目标。
- **[Fine-tuning](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)**：训练模型以出色完成特定任务。



## 模型优化 工作流

优化模型输出需要结合 **evals**, **prompt engineering**，以及 **fine-tuning**，形成一个反馈飞轮，从而带来更好的提示和更好的微调训练数据。优化过程通常如下所示。

1. 编写 [evals](https://developers.openai.com/api/docs/guides/evals) 评估以衡量模型输出，建立性能和准确性的基线。
1. [向模型发出提示](https://developers.openai.com/api/docs/guides/text) 以获取输出，提供相关的上下文数据和指令。
1. 在某些用例中，可能希望对模型进行 [微调](#fine-tune-a-model) 以完成特定任务。
1. 使用能代表真实输入的测试数据运行评估。衡量你的提示和微调模型的性能。
1. 根据评估反馈调整你的提示或微调数据集。
1. 持续循环重复以改进模型结果。

以下是主要步骤概览，以及如何使用 OpenAI 平台完成这些步骤。

## 构建评测

在 OpenAI 平台上，你可以 [构建并运行评估](https://developers.openai.com/api/docs/guides/evals) 通过 API 或在 [仪表板](https://platform.openai.com/evaluations)。中进行。你甚至可以考虑在 _开始编写提示词_ 之前编写评估，采用一种类似于行为驱动开发（BDD）的方法。

针对你在生产环境中预期看到的测试输入运行评估。使用以下几种可用的 [评分器](https://developers.openai.com/api/docs/guides/graders)，之一，根据你的测试数据集衡量提示词的结果。

[了解评估



      Run tests on your model outputs to ensure you're getting the right results.](https://developers.openai.com/api/docs/guides/evals)

## 撰写有效的提示词

有了评估，你就可以有效地对 [提示词](https://developers.openai.com/api/docs/guides/text)。进行迭代。提示工程过程可能就是你在使用场景中获得出色结果所需的全部内容。不同的模型可能需要不同的提示技巧，但你可以应用若干通用最佳实践来获得更好的结果。

- **包含相关上下文** - 在你的指令中，加入模型在训练数据之外生成回答所需的文本或图像内容。这可以包括来自私有数据库的数据或当前的、最新信息。
- **提供清晰的指令** - 你的提示应包含明确的目标，说明你希望获得什么样的输出。从一开始 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 开始构建新工作，并参考 [推理模型指南](https://developers.openai.com/api/docs/guides/reasoning) 来调整结果级别的指令、推理强度和详细程度。
- **提供示例输出** - 给模型一些针对特定提示的正确输出示例（这一过程称为少样本学习）。模型可以从这些示例中推断出在面对其他提示时应该如何回答。

[了解提示工程



      Learn the basics of writing good prompts for the model.](https://developers.openai.com/api/docs/guides/text)

## 微调模型

OpenAI 正在逐步关停微调平台。该平台不再
  对新用户开放，但现有微调平台用户仍可
  在未来几个月内创建训练任务。
  

  所有微调模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将保持可用于推理。完整时间表请参阅
  [此处](https://developers.openai.com/api/docs/deprecations).

OpenAI 模型已预先训练，可应对广泛的主题和任务。微调让你可以基于一个 OpenAI 基础模型，提供你在应用中预期出现的输入和输出示例，从而获得一个在目标任务上表现更出色的模型。

微调可能是一个耗时的过程，但它可以让模型始终以特定方式格式化响应，或处理全新输入。你可以将微调与 [提示工程](https://developers.openai.com/api/docs/guides/text) 结合使用，从而获得比单独使用提示更多的优势：

- 你可以提供比单次请求上下文窗口所能容纳的更多的示例输入和输出，使模型能够处理更广泛的提示。
- 你可以使用更短的提示和更少的示例与上下文数据，从而在大规模场景下节省 token 成本，并降低延迟。
- 你可以在专有或敏感数据上进行训练，而无需在每次请求中通过示例来包含这些数据。
- 你可以训练一个更小、更便宜、更快的模型，使其在大型模型不具备成本效益的特定任务上表现出色。

请访问我们的 [定价页面](https://openai.com/api/pricing) 以了解有关微调模型训练和用量的计费方式。

### 微调方法

以下是 OpenAI 平台目前支持的所有微调方法。



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

在 OpenAI 平台上，你可以通过 [仪表板](https://platform.openai.com/finetune) 或 [使用 API 来创建微调模型](https://developers.openai.com/api/reference/resources/fine_tuning)。微调过程的一般流程如下：

1. 收集用作训练数据的示例数据集
1. 将数据集以 JSONL 格式上传到 OpenAI
1. 根据你的目标，使用上述方法之一创建微调任务——这将启动微调训练过程
1. 对于 RFT，你还需要定义一个评分器来对模型行为进行打分
1. 评估结果

开始使用 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning), [视觉微调](https://developers.openai.com/api/docs/guides/vision-fine-tuning), [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization)，或 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning).

## 向专家学习

模型优化是一个复杂的话题，有时更像是一门艺术而非科学。请观看以下来自 OpenAI 团队成员讲解模型优化技巧的视频。



成本/准确性/延迟

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