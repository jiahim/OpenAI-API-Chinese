# 模型优化

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

LLM 输出是非确定性的，模型行为会随模型快照和系列的变化而变化。开发者必须持续衡量和调优 LLM 应用的性能，以确保获得最佳结果。在本指南中，我们探讨了可用于确保模型输出高质量的技术和 OpenAI 平台工具。

本指南涵盖正在移入
  旧版文档的评估和微调工作流。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解
  受影响平台界面的当前时间线。



  - **[Evals](https://developers.openai.com/api/docs/guides/evals)**：系统地衡量性能。
- **[提示工程](https://developers.openai.com/api/docs/guides/text?api-mode=responses#prompt-engineering)**：提供上下文、指令和目标。
- **[微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)**：训练模型以出色完成任务。



## 模型优化工作流

优化模型输出需要结合 **评估**, **提示工程**，以及 **微调**，形成一个反馈飞轮，从而产生更好的提示和更好的微调训练数据。优化过程通常如下进行。

1. 编写 [评估](https://developers.openai.com/api/docs/guides/evals) 来衡量模型输出，为性能和准确性建立基线。
1. [提示模型](https://developers.openai.com/api/docs/guides/text) 以获取输出，提供相关的上下文数据和指令。
1. 在某些用例中，可能需要对 [微调](#fine-tune-a-model) 模型以完成特定任务。
1. 使用代表真实世界输入的测试数据运行评估。衡量你的提示和微调模型的性能。
1. 根据评估反馈调整你的提示或微调数据集。
1. 持续重复循环以改进你的模型结果。

以下是主要步骤的概览，以及如何使用 OpenAI 平台来执行这些步骤。

## 构建评估

在 OpenAI 平台中，你可以 [构建和运行评估](https://developers.openai.com/api/docs/guides/evals) 既可通过 API，也可在 [仪表盘](https://platform.openai.com/evaluations)。中进行。你甚至可以考虑在 _开始编写提示词之前_ 就编写评估，采用类似于行为驱动开发（BDD）的方法。

使用你预期在生产环境中看到的测试输入运行评估。利用多种可用的 [评分器](https://developers.openai.com/api/docs/guides/graders)，之一，衡量提示词在你的测试数据集上的结果。

[了解评估



      Run tests on your model outputs to ensure you're getting the right results.](https://developers.openai.com/api/docs/guides/evals)

## 编写有效的提示词

有了评估机制，你可以有效地迭代 [提示词](https://developers.openai.com/api/docs/guides/text)。提示词工程过程可能就是你为用例获得出色结果所需的全部。不同的模型可能需要不同的提示技巧，但你可以应用一些通用的最佳实践来获得更好的结果。

- **包含相关上下文** - 在你的指令中，包含模型需要在其训练数据之外生成回复所需的文本或图像内容。这可能包括来自私有数据库的数据或当前的最新信息。
- **提供清晰指令** - 你的提示应包含关于你期望输出类型的明确目标。从 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 开始新任务，并使用 [推理模型指南](https://developers.openai.com/api/docs/guides/reasoning) 来调整结果级指令、推理努力和详细程度。
- **提供示例输出** - 为给定提示提供几个正确输出的示例给模型（这个过程称为少样本学习）。模型可以从这些示例中推断出它应该如何响应其他提示。

[了解提示词工程



      Learn the basics of writing good prompts for the model.](https://developers.openai.com/api/docs/guides/text)

## 微调模型

OpenAI 正在逐步关闭微调平台。该平台不再
  对新用户开放，但微调平台的现有用户仍将
  能够在未来几个月内创建训练作业。
  

  所有微调模型将继续可用于推理，直到其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。完整时间线见
  [此处](https://developers.openai.com/api/docs/deprecations).

OpenAI 模型已经过预训练，能够在广泛的主题和任务上表现出色。微调让你可以选用一个 OpenAI 基础模型，提供你在应用中期望的输入和输出类型，从而获得一个在你将使用的任务上表现出色的模型。

微调可能是一个耗时的过程，但它也可以让模型以特定方式一致地格式化响应或处理新颖的输入。你可以将微调与 [提示工程](https://developers.openai.com/api/docs/guides/text) 结合使用，以实现比单独提示更多的收益：

- 你可以提供超出单个请求上下文窗口容纳量的更多示例输入和输出，使模型能够处理更多样化的提示。
- 你可以使用更短的提示词，包含更少的示例和上下文数据，这在大规模使用时可以节省 token 成本，并且可能具有更低的延迟。
- 你可以在专有或敏感数据上进行训练，而无需在每次请求中通过示例包含这些数据。
- 你可以训练一个更小、更便宜、更快的模型，使其在特定任务上表现出色，而使用更大的模型则成本效益不高。

访问我们的 [定价页面](https://openai.com/api/pricing) 了解微调模型训练和使用的计费方式。

### 微调方法

这些是OpenAI平台当前支持的微调方法。



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



### 微调如何工作

在 OpenAI 平台中，你可以通过 [仪表盘](https://platform.openai.com/finetune) 或 [使用 API](https://developers.openai.com/api/reference/resources/fine_tuning)。创建微调模型。这是微调过程的大致流程：

1. 收集一组示例作为训练数据
1. 以 JSONL 格式将该数据集上传到 OpenAI
1. 根据你的目标，使用上述方法之一创建微调任务——这将启动微调训练过程
1. 对于 RFT 的情况，你还需要定义一个评分器来评估模型的行为
1. 评估结果

开始使用 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning), [视觉微调](https://developers.openai.com/api/docs/guides/vision-fine-tuning), [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization)，或 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning).

## 向专家学习

模型优化是一个复杂的主题，有时更像艺术而非科学。请观看下方来自 OpenAI 团队成员关于模型优化技术的视频。



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