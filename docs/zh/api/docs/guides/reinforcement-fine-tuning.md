# Reinforcement fine-tuning

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

强化微调（RFT）使用你自定义的反馈信号来适配 OpenAI 推理模型。与 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)，一样，它会针对你的任务定制模型。区别在于，它不依赖于固定的“正确答案”进行训练，而是依赖一个可编程的评分器，对每个候选响应打分。随后，训练算法调整模型的权重，使高分输出更可能出现，低分输出逐渐消失。

OpenAI 正在逐步关停微调平台。该平台已不再
  对新用户开放，但现有用户在未来数月内仍
  可创建训练任务。
  

  所有微调模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将保持可推理。完整时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).




<table>
<tbody>
<tr>
<th>How it works</th>
<th>Best for</th>
<th>Use with</th>
</tr>

<tr>
<td>
Generate a response for a prompt, provide an expert grade for the result, and reinforce the model's chain-of-thought for higher-scored responses.

Requires expert graders to agree on the ideal output from the model.

</td>
<td>
- Complex domain-specific tasks that require advanced reasoning
- Medical diagnoses based on history and diagnostic guidelines
- Determining relevant passages from legal case law
</td>
<td>
`o4-mini-2025-04-16`

**Reasoning models only**.

</td>
</tr>
</tbody>
</table>

这种优化使你能够将模型与风格、安全性或领域准确性等细致的目标对齐，并已催生众多 [实际应用场景](https://developers.openai.com/api/docs/guides/rft-use-cases) 。通过五个步骤运行 RFT：

1. 实现一个 [grader](https://developers.openai.com/api/docs/guides/graders) ，为每个模型响应分配一个数值奖励。
1. 上传你的提示数据集并指定一个验证划分。
1. 启动微调任务。
1. 监控并 [评估](https://developers.openai.com/api/docs/guides/evals) 检查点；根据需要修改数据或 grader。
1. 通过标准的 API 部署所得到的模型。

在训练过程中，平台会循环遍历数据集，对每个提示采样若干响应，使用评分器打分，并根据这些奖励应用策略梯度更新。该循环会一直持续，直到你的训练数据结束或你在选定的检查点停止任务，从而生成针对你关心的指标进行优化的模型。



## 应该在什么时候使用强化微调？



了解强化微调的优势与劣势，有助于你发现合适的机会，避免徒劳的投入。

- **RFT 在任务明确时效果最佳**。检查合格的领域专家是否对答案达成一致。如果独立工作的、严谨的专家（只能访问与模型相同的指令和信息）无法收敛到相同答案，那么该任务可能过于模糊，需要修改或重新构建。
- **你的任务必须与评分选项兼容**。请先查看 [API 中的评分选项](https://developers.openai.com/api/reference/resources/graders) ，并确认可以使用这些选项为你的任务评分。
- **你的评估结果必须有足够的变化空间以便提升**。在使用 RFT 之前，请运行 [评估](https://developers.openai.com/api/docs/guides/evals) 。如果你的评估得分介于最低和最高可能得分之间，你将有足够的数据来强化正确答案。如果你要微调的模型得分要么是绝对最低、要么是绝对最高，那么 RFT 对你来说没有用处。
- **你的模型在目标任务上必须已经取得一定成功**。强化微调会进行渐进式的改动，采样大量答案并挑选最佳答案。如果一个模型在某项任务上的成功率为 0%，就无法通过 RFT 引导到更高的性能水平。
- **你的任务应当难以靠猜测完成**。如果模型可以通过侥幸猜测获得更高奖励，那么训练信号就过于嘈杂，因为模型可能在推理过程不正确的情况下给出正确答案。请重新构建你的任务以增加猜测难度——例如，将类别扩展为子类，或将选择题修改为开放性问题。

在以下文档中查看常见用例、具体实现和评分器示例： [强化微调用例指南](https://developers.openai.com/api/docs/guides/rft-use-cases).







## 什么是强化学习？



强化学习是机器学习的一个分支，模型通过采取行动、接收反馈并自我调整以最大化未来反馈来进行学习。它不是对每个示例记忆一个“正确”答案，而是探索多种可能的答案，观察每个答案对应的数值奖励，并逐步调整自身行为，使高奖励的答案更可能出现，低奖励的答案逐渐消失。经过多轮迭代后，模型会收敛到一个策略——即用于选择输出的规则——从而最好地满足你所定义的奖励信号。

在强化微调（RFT）中，该奖励信号来自你为任务自定义定义的评分器。对于数据集中的每个提示，平台会采样多个候选答案，运行你的评分器对其进行打分，并执行一次策略梯度更新，使模型倾向于得分更高的答案。这一“采样—评分—更新”的循环会在整个数据集（以及多轮 epoch）上持续进行，直到模型能够稳定地针对你的评分器所定义的质量标准进行优化。评分器会编码你所关注的任何指标——准确性、风格、安全性或任何其他度量——因此最终得到的微调模型会反映这些优先级，而你无需管理强化学习相关的基础设施。





强化微调仅在 o 系列推理模型上受支持，并且
  目前仅支持 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini).

## 示例：基于 LLM 的安全审查

为演示下面的强化微调，我们将对一个 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini) 模型进行微调，使其能够根据一份内部公司策略文档，针对一家虚构公司的安全态势给出专业回答。我们希望模型返回一个符合特定架构的 JSON 对象，并使用 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs).

示例输入问题：

```
Do you have a dedicated security team?
```

我们希望模型使用内部策略文档，返回一个包含两个键的 JSON：

- `compliant`: 字符串 `yes`, `no`，或 `needs review`，用于指示公司政策是否涵盖该问题。
- `explanation`: 一段文本，根据政策文件简要说明该问题为何被政策涵盖或未被涵盖。

模型期望输出示例：

```json
{
  "compliant": "yes",
  "explanation": "A dedicated security team follows strict protocols for handling incidents."
}
```

让我们使用 RFT 对模型进行微调，以便在该任务上表现良好。

## Define a grader

要执行 RFT，需定义一个 [grader](https://developers.openai.com/api/docs/guides/graders) 来在训练过程中对模型的输出进行打分，以表明其响应的质量。RFT 使用的评分器集合与 [evals](https://developers.openai.com/api/docs/guides/evals)，相同，你可能已经对此有所了解。

在此示例中，我们定义 [多个评分器](https://developers.openai.com/api/reference/resources/graders) 来检查我们微调模型所返回 JSON 的各项属性：

- 该 [`string_check`](https://developers.openai.com/api/reference/resources/graders) 评分器，以确保已正确设置该 `compliant` 属性
- 该 [`score_model`](https://developers.openai.com/api/reference/resources/graders) 评分器，使用另一个评估模型为说明文本提供 0 到 1 之间的分数

我们对表达式中每个属性的输出赋予同等权重，在 `calculate_output` 表达式中。

下面是我们将在 API 请求中用于此评分器的 JSON 负载数据。在两个评分器中，我们使用 `{{ }}` 模板语法来引用以下两者的相关属性： `item` （用于评估的测试数据行）以及 `sample` （训练运行期间生成的模型输出）。



评分器配置

    Multi-grader configuration object

```json
{
  "type": "multi",
  "graders": {
    "explanation": {
      "name": "Explanation text grader",
      "type": "score_model",
      "input": [
        {
          "role": "user",
          "type": "message",
          "content": "...see other tab for the full prompt..."
        }
      ],
      "model": "gpt-4o-2024-08-06"
    },
    "compliant": {
      "name": "compliant",
      "type": "string_check",
      "reference": "{{item.compliant}}",
      "operation": "eq",
      "input": "{{sample.output_json.compliant}}"
    }
  },
  "calculate_output": "0.5 * compliant + 0.5 * explanation"
}
```

  

  

    
评分提示

    Grading prompt in the grader config

```markdown
# Overview

Evaluate the accuracy of the model-generated answer based on the 
Copernicus Product Security Policy and an example answer. The response 
should align with the policy, cover key details, and avoid speculative 
or fabricated claims.

Always respond with a single floating point number 0 through 1,
using the grading criteria below.

## Grading Criteria:
- **1.0**: The model answer is fully aligned with the policy and factually correct.
- **0.75**: The model answer is mostly correct but has minor omissions or slight rewording that does not change meaning.
- **0.5**: The model answer is partially correct but lacks key details or contains speculative statements.
- **0.25**: The model answer is significantly inaccurate or missing important information.
- **0.0**: The model answer is completely incorrect, hallucinates policy details, or is irrelevant.

## Copernicus Product Security Policy

### Introduction
Protecting customer data is a top priority for Copernicus. Our platform is designed with industry-standard security and compliance measures to ensure data integrity, privacy, and reliability.

### Data Classification
Copernicus safeguards customer data, which includes prompts, responses, file uploads, user preferences, and authentication configurations. Metadata, such as user IDs, organization IDs, IP addresses, and device details, is collected for security purposes and stored securely for monitoring and analytics.

### Data Management
Copernicus utilizes cloud-based storage with strong encryption (AES-256) and strict access controls. Data is logically segregated to ensure confidentiality and access is restricted to authorized personnel only. Conversations and other customer data are never used for model training.

### Data Retention
Customer data is retained only for providing core functionalities like conversation history and team collaboration. Customers can configure data retention periods, and deleted content is removed from our system within 30 days.

### User Authentication & Access Control
Users authenticate via Single Sign-On (SSO) using an Identity Provider (IdP). Roles include Account Owner, Admin, and Standard Member, each with defined permissions. User provisioning can be automated through SCIM integration.

### Compliance & Security Monitoring
- **Compliance API**: Logs interactions, enabling data export and deletion.
- **Audit Logging**: Ensures transparency for security audits.
- **HIPAA Support**: Business Associate Agreements (BAAs) available for customers needing healthcare compliance.
- **Security Monitoring**: 24/7 monitoring for threats and suspicious activity.
- **Incident Response**: A dedicated security team follows strict protocols for handling incidents.

### Infrastructure Security
- **Access Controls**: Role-based authentication with multi-factor security.
- **Source Code Security**: Controlled code access with mandatory reviews before deployment.
- **Network Security**: Web application firewalls and strict ingress/egress controls to prevent unauthorized access.
- **Physical Security**: Data centers have controlled access, surveillance, and environmental risk management.

### Bug Bounty Program
Security researchers are encouraged to report vulnerabilities through our Bug Bounty Program for responsible disclosure and rewards.

### Compliance & Certifications
Copernicus maintains compliance with industry standards, including SOC 2 and GDPR. Customers can access security reports and documentation via our Security Portal.

### Conclusion
Copernicus prioritizes security, privacy, and compliance. For inquiries, contact your account representative or visit our Security Portal.

## Examples

### Example 1: GDPR Compliance
**Reference Answer**: 'Copernicus maintains compliance with industry standards, including SOC 2 and GDPR. Customers can access security reports and documentation via our Security Portal.'

**Model Answer 1**: 'Yes, Copernicus is GDPR compliant and provides compliance documentation via the Security Portal.' 
**Score: 1.0** (fully correct)

**Model Answer 2**: 'Yes, Copernicus follows GDPR standards.'
**Score: 0.75** (mostly correct but lacks detail about compliance reports)

**Model Answer 3**: 'Copernicus may comply with GDPR but does not provide documentation.'
**Score: 0.5** (partially correct, speculative about compliance reports)

**Model Answer 4**: 'Copernicus does not follow GDPR standards.'
**Score: 0.0** (factually incorrect)

### Example 2: Encryption in Transit
**Reference Answer**: 'The Copernicus Product Security Policy states that data is stored with strong encryption (AES-256) and that network security measures include web application firewalls and strict ingress/egress controls. However, the policy does not explicitly mention encryption of data in transit (e.g., TLS encryption). A review is needed to confirm whether data transmission is encrypted.'

**Model Answer 1**: 'Data is encrypted at rest using AES-256, but a review is needed to confirm encryption in transit.'
**Score: 1.0** (fully correct)

**Model Answer 2**: 'Yes, Copernicus encrypts data in transit and at rest.'
**Score: 0.5** (partially correct, assumes transit encryption without confirmation)

**Model Answer 3**: 'All data is protected with encryption.'
**Score: 0.25** (vague and lacks clarity on encryption specifics)

**Model Answer 4**: 'Data is not encrypted in transit.'
**Score: 0.0** (factually incorrect)

Reference Answer: {{item.explanation}}
Model Answer: {{sample.output_json.explanation}}
```



## 准备你的数据集

要创建 RFT 微调，你同时需要一份训练数据集和一份测试数据集。训练数据集和测试数据集将共享相同的 [JSONL 格式](https://jsonlines.org/)。JSONL 数据文件中的每一行将包含一个 `messages` 数组，以及用于对模型输出进行评分的任何其他必需字段。有关 RFT 数据集的完整规范 [可在此处查阅](https://developers.openai.com/api/reference/resources/fine_tuning).

在我们的示例中，除了 `messages` 数组之外，我们 JSONL 文件中的每一行还需要 `compliant` 和 `explanation` 属性，我们可以将它们用作参考值来测试微调模型的结构化输出。

我们训练数据集和测试数据集中的一行以缩进 JSON 的形式如下所示：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Do you have a dedicated security team?"
    }
  ],
  "compliant": "yes",
  "explanation": "A dedicated security team follows strict protocols for handling incidents."
}
```

下面提供一些可用于训练和测试的 JSONL 数据，供你在创建微调任务时使用。请注意，这些数据集仅用于演示——在你的真实测试数据中，应力求为应用提供多样且具有代表性的输入。

**训练集**

```
{"messages":[{"role":"user","content":"Do you have a dedicated security team?"}],"compliant":"yes","explanation":"A dedicated security team follows strict protocols for handling incidents."}
{"messages":[{"role":"user","content":"Have you undergone third-party security audits or penetration testing in the last 12 months?"}],"compliant":"needs review","explanation":"The policy does not explicitly mention undergoing third-party security audits or penetration testing. It only mentions SOC 2 and GDPR compliance."}
{"messages":[{"role":"user","content":"Is your software SOC 2, ISO 27001, or similarly certified?"}],"compliant":"yes","explanation":"The policy explicitly mentions SOC 2 compliance."}
```

**测试集**

```
{"messages":[{"role":"user","content":"Will our data be encrypted at rest?"}],"compliant":"yes","explanation":"Copernicus utilizes cloud-based storage with strong encryption (AES-256) and strict access controls."}
{"messages":[{"role":"user","content":"Will data transmitted to/from your services be encrypted in transit?"}],"compliant":"needs review","explanation":"The policy does not explicitly mention encryption of data in transit. It focuses on encryption in cloud storage."}
{"messages":[{"role":"user","content":"Do you enforce multi-factor authentication (MFA) internally?"}],"compliant":"yes","explanation":"The policy explicitly mentions role-based authentication with multi-factor security."}
```



### 需要多少训练数据？



先小规模起步——从几十个到几百个示例——以判断 RFT 的有效性，再投入大规模数据集。出于产品安全考虑，训练集必须先通过自动筛查流程。大型数据集处理时间更长。该筛查流程在你使用某个文件启动微调任务时开始，而不是在首次上传文件时开始。文件成功通过筛查后，你可以重复使用它而无需再次等待。

只要示例质量高，几十个示例也可以具有意义。筛查之后，数据越多越好，前提是质量保持较高。数据集更大时，你可以使用更大的批量大小，这通常会提升训练稳定性。

你的训练文件最多可包含 50,000 个示例。测试数据集最多可包含 1,000 个示例。测试数据集同样会经过自动筛查。





### 上传你的文件

上传 RFT 训练和测试数据文件的流程与 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)。将你的训练数据上传到 OpenAI，可以通过 [API](https://developers.openai.com/api/reference/resources/files/methods/create) 或 [使用我们的 UI](https://platform.openai.com/storage)。文件必须以 `fine-tune` 的用途上传，才能用于微调。

**你需要测试数据和训练数据文件的文件 ID** 才能创建微调任务。

## 创建微调任务

Create a fine-tune job using either the [API](https://developers.openai.com/api/reference/resources/fine_tuning) 或 [fine-tuning dashboard](https://platform.openai.com/finetune). 为此，你需要：

- 训练数据集和测试数据集的文件 ID
- 我们之前创建的评分器配置
- 你希望用作微调基础的模型 ID（我们将使用 `o4-mini-2025-04-16`)
- 如果你要微调的模型会以结构化输出形式返回 JSON 数据，你还需要提供所返回对象的 JSON schema（见下文）
- （可选）你希望为该微调配置的任何超参数
- 要符合 [数据共享推理定价](https://developers.openai.com/api/docs/pricing#fine-tuning)，你需要先 [与 OpenAI 共享评估和微调数据](https://help.openai.com/en/articles/10306912-sharing-feedback-evaluation-and-fine-tuning-data-and-api-inputs-and-outputs-with-openai#h_c93188c569) ，然后再创建任务

### Structured Outputs JSON schema

如果你正在微调一个模型以返回 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)，请提供用于格式化输出的 JSON schema。请参阅我们安全面试用例的有效 JSON schema：

```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "security_assistant",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "compliant": { "type": "string" },
        "explanation": { "type": "string" }
      },
      "required": ["compliant", "explanation"],
      "additionalProperties": false
    }
  }
}
```



#### 从 Pydantic 模型生成 JSON schema



为简化 JSON schema 生成，可从一个 [Pydantic BaseModel](https://docs.pydantic.dev/latest/api/base_model/) 类入手：

1. 定义你的类
1. 使用 `to_strict_json_schema` 来自 OpenAI 库以生成有效的 schema
1. 将该 schema 用一个包含 `type` 和 `name` 键的字典包裹，并将 `strict` 设置为 true
1. 将得到的对象作为 `response_format` 提供给你的 RFT 任务

```python
from openai.lib._pydantic import to_strict_json_schema
from pydantic import BaseModel


class MyCustomClass(BaseModel):
    name: str
    age: int


# Note: Do not use MyCustomClass.model_json_schema() in place of
# to_strict_json_schema as it is not equivalent
schema = to_strict_json_schema(MyCustomClass)

response_format = dict(
    type="json_schema",
    json_schema=dict(name=MyCustomClass.__name__, strict=True, schema=schema),
)
```






### 使用 API 创建作业

通过 API 配置任务涉及很多环节，因此许多用户更倾向于在 [微调仪表板界面](https://platform.openai.com/finetune)。中完成配置。不过，这里给出一个完整的 API 请求示例，用于启动一个包含本指南中到目前为止所设置的全部配置的微调任务：

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "training_file": "file-2STiufDaGXWCnT6XUBUEHW",
  "validation_file": "file-4TcgH85ej7dFCjZ1kThCYb",
  "model": "o4-mini-2025-04-16",
  "method": {
    "type": "reinforcement",
    "reinforcement": {
      "grader": {
        "type": "multi",
        "graders": {
          "explanation": {
            "name": "Explanation text grader",
            "type": "score_model",
            "input": [
              {
                "role": "user",
                "type": "message",
                "content": "# Overview\n\nEvaluate the accuracy of the model-generated answer based on the \nCopernicus Product Security Policy and an example answer. The response \nshould align with the policy, cover key details, and avoid speculative \nor fabricated claims.\n\nAlways respond with a single floating point number 0 through 1,\nusing the grading criteria below.\n\n## Grading Criteria:\n- **1.0**: The model answer is fully aligned with the policy and factually correct.\n- **0.75**: The model answer is mostly correct but has minor omissions or slight rewording that does not change meaning.\n- **0.5**: The model answer is partially correct but lacks key details or contains speculative statements.\n- **0.25**: The model answer is significantly inaccurate or missing important information.\n- **0.0**: The model answer is completely incorrect, hallucinates policy details, or is irrelevant.\n\n## Copernicus Product Security Policy\n\n### Introduction\nProtecting customer data is a top priority for Copernicus. Our platform is designed with industry-standard security and compliance measures to ensure data integrity, privacy, and reliability.\n\n### Data Classification\nCopernicus safeguards customer data, which includes prompts, responses, file uploads, user preferences, and authentication configurations. Metadata, such as user IDs, organization IDs, IP addresses, and device details, is collected for security purposes and stored securely for monitoring and analytics.\n\n### Data Management\nCopernicus utilizes cloud-based storage with strong encryption (AES-256) and strict access controls. Data is logically segregated to ensure confidentiality and access is restricted to authorized personnel only. Conversations and other customer data are never used for model training.\n\n### Data Retention\nCustomer data is retained only for providing core functionalities like conversation history and team collaboration. Customers can configure data retention periods, and deleted content is removed from our system within 30 days.\n\n### User Authentication & Access Control\nUsers authenticate via Single Sign-On (SSO) using an Identity Provider (IdP). Roles include Account Owner, Admin, and Standard Member, each with defined permissions. User provisioning can be automated through SCIM integration.\n\n### Compliance & Security Monitoring\n- **Compliance API**: Logs interactions, enabling data export and deletion.\n- **Audit Logging**: Ensures transparency for security audits.\n- **HIPAA Support**: Business Associate Agreements (BAAs) available for customers needing healthcare compliance.\n- **Security Monitoring**: 24/7 monitoring for threats and suspicious activity.\n- **Incident Response**: A dedicated security team follows strict protocols for handling incidents.\n\n### Infrastructure Security\n- **Access Controls**: Role-based authentication with multi-factor security.\n- **Source Code Security**: Controlled code access with mandatory reviews before deployment.\n- **Network Security**: Web application firewalls and strict ingress/egress controls to prevent unauthorized access.\n- **Physical Security**: Data centers have controlled access, surveillance, and environmental risk management.\n\n### Bug Bounty Program\nSecurity researchers are encouraged to report vulnerabilities through our Bug Bounty Program for responsible disclosure and rewards.\n\n### Compliance & Certifications\nCopernicus maintains compliance with industry standards, including SOC 2 and GDPR. Customers can access security reports and documentation via our Security Portal.\n\n### Conclusion\nCopernicus prioritizes security, privacy, and compliance. For inquiries, contact your account representative or visit our Security Portal.\n\n## Examples\n\n### Example 1: GDPR Compliance\n**Reference Answer**: Copernicus maintains compliance with industry standards, including SOC 2 and GDPR. Customers can access security reports and documentation via our Security Portal.\n\n**Model Answer 1**: Yes, Copernicus is GDPR compliant and provides compliance documentation via the Security Portal. \n**Score: 1.0** (fully correct)\n\n**Model Answer 2**: Yes, Copernicus follows GDPR standards.\n**Score: 0.75** (mostly correct but lacks detail about compliance reports)\n\n**Model Answer 3**: Copernicus may comply with GDPR but does not provide documentation.\n**Score: 0.5** (partially correct, speculative about compliance reports)\n\n**Model Answer 4**: Copernicus does not follow GDPR standards.\n**Score: 0.0** (factually incorrect)\n\n### Example 2: Encryption in Transit\n**Reference Answer**: The Copernicus Product Security Policy states that data is stored with strong encryption (AES-256) and that network security measures include web application firewalls and strict ingress/egress controls. However, the policy does not explicitly mention encryption of data in transit (e.g., TLS encryption). A review is needed to confirm whether data transmission is encrypted.\n\n**Model Answer 1**: Data is encrypted at rest using AES-256, but a review is needed to confirm encryption in transit.\n**Score: 1.0** (fully correct)\n\n**Model Answer 2**: Yes, Copernicus encrypts data in transit and at rest.\n**Score: 0.5** (partially correct, assumes transit encryption without confirmation)\n\n**Model Answer 3**: All data is protected with encryption.\n**Score: 0.25** (vague and lacks clarity on encryption specifics)\n\n**Model Answer 4**: Data is not encrypted in transit.\n**Score: 0.0** (factually incorrect)\n\nReference Answer: {{item.explanation}}\nModel Answer: {{sample.output_json.explanation}}\n"
              }
            ],
            "model": "gpt-4o-2024-08-06"
          },
          "compliant": {
            "name": "compliant",
            "type": "string_check",
            "reference": "{{item.compliant}}",
            "operation": "eq",
            "input": "{{sample.output_json.compliant}}"
          }
        },
        "calculate_output": "0.5 * compliant + 0.5 * explanation"
      },
      "response_format": {
        "type": "json_schema",
        "json_schema": {
          "name": "security_assistant",
          "strict": true,
          "schema": {
            "type": "object",
            "properties": {
              "compliant": {
                "type": "string"
              },
              "explanation": {
                "type": "string"
              }
            },
            "required": [
              "compliant",
              "explanation"
            ],
            "additionalProperties": false
          }
        }
      },
      "hyperparameters": {
        "reasoning_effort": "medium"
      }
    }
  }
}'
```


该请求会返回一个 [微调任务对象](https://developers.openai.com/api/reference/resources/fine_tuning)，其中包含任务 `id`。你可以使用该 ID 监控任务进度，并在任务完成后取回微调后的模型。

要符合 [数据共享推理定价](https://developers.openai.com/api/docs/pricing#fine-tuning)，的资格，请在创建任务之前 [与 OpenAI 共享评估和微调数据](https://help.openai.com/en/articles/10306912-sharing-feedback-evaluation-and-fine-tuning-data-and-api-inputs-and-outputs-with-openai#h_c93188c569) 。你可以通过确认以下字段已设置为 `shared_with_openai` 来验证该任务是否已被标记为已共享 `true`.

### 监控你的微调任务

微调任务需要一些时间才能完成，而 RFT 任务通常比 SFT 或 DPO 任务耗时更长。要监控你的微调任务的进度，请使用 [fine-tuning dashboard](https://platform.openai.com/finetune) 或 [API](https://developers.openai.com/api/reference/resources/fine_tuning).

#### 奖励指标

对于强化微调作业，主要的指标是每一步的 **reward** 指标。这些指标反映了你的模型在训练数据上的表现，由你在作业配置中定义的评分器计算得出。这两个是独立的顶层 reward 指标：

- `train_reward_mean`: 当前步骤中从所有数据点采集的样本的平均奖励。由于批次中的具体数据点会随每个步骤变化， `train_reward_mean` 不同步骤之间的数值无法直接比较，且具体数值可能会在步骤之间剧烈波动。
- `valid_reward_mean`: 验证集中从所有数据点采集的样本的平均奖励，这是一个更稳定的指标。

![奖励指标图](https://cdn.openai.com/API/images/guides/RFT_Reward_Chart.png)

在 [训练指标](#training-metrics) 部分中查看所有训练指标的完整说明。

#### 暂停和恢复任务

若要在你的任务仅完成一部分时评估模型的当前状态， **暂停** 该任务以停止训练过程，并在当前步骤生成一个检查点。你可以使用此检查点在一个留出测试集上评估模型。如果结果令人满意， **resume** 作业以从该检查点继续训练。更多信息请参阅 [暂停和恢复作业](#pausing-and-resuming-jobs).

#### Evals 集成

强化微调作业与我们的 [evals 产品](https://developers.openai.com/api/docs/guides/evals)。集成。当你创建一个强化微调作业时,会自动生成一个新的 eval 并与该作业关联。随着验证步骤的进行,我们将输入提示、模型输出样本和评分器输出组合在一起,生成新的 [eval 运行](https://developers.openai.com/api/docs/guides/evals#creating-an-eval-run) 用于该步骤。

在 [附录](#evals-integration-details) 部分了解更多关于 evals 集成的信息。

## 评估结果

当你的微调任务完成时，你应该已经能根据验证集上的平均奖励值大致了解模型的表现。不过，模型也有可能 _对训练数据过拟合_ ，或者学会了 [奖励破解](https://en.wikipedia.org/wiki/Reward_hacking) 你的评分器，从而在实际上并不正确的情况下获得高分。在部署模型之前，请在一个具有代表性的提示集合上检查它的行为，确保它按你的预期运行。

可以通过检查与微调任务关联的评估来快速了解模型的行为。具体来说，重点查看在最后一个训练步骤上运行的评估，以观察最终模型的行为。你也可以使用评估产品将最后一次运行与之前的运行进行比较，观察模型在整个训练过程中的行为变化。

### 尝试使用你微调的模型

使用你新优化的模型来评估它！当微调模型完成训练后，在以下任一接口中使用其 ID： [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API，就像使用 OpenAI 基础模型一样。



在 Playground 中使用你的模型

    

1. 在控制面板中导航到你的微调任务 [控制面板](https://platform.openai.com/finetune).
1. 在右侧面板中，导航到 **输出模型** 并复制模型 ID。它应该以 `ft:…`
1. 打开 [Playground](https://platform.openai.com/playground).
1. 在 **模型** 下拉菜单中，粘贴模型 ID。在这里，你还可以看到你创建的其他微调模型。
1. 运行一些提示，看看你的微调模型表现如何！


  

  

    
通过 API 调用使用你的模型

    

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
    "input": "What is 4+4?"
  }'
```



### 如需使用，请使用检查点

检查点是你可以在训练过程最终步骤之前使用、由模型创建的产物。对于 RFT，OpenAI 会在每个验证步骤创建一个完整的模型检查点，并保留得分最高的三个 `valid_reward_mean` 检查点可用于在训练过程的不同阶段评估模型，并比较不同步骤之间的性能。



在仪表板中查找检查点

    

1. 前往 [微调仪表板](https://platform.openai.com/finetune).
1. 在左侧面板中，选择你要调查的任务。等待其运行成功。
1. 在右侧面板中，向下滚动到检查点列表。
1. 将鼠标悬停在任意检查点上，可看到在 Playground 中启动的链接。
1. 在 Playground 中通过提示词测试该检查点模型的行为。


  

  

    
查询 API 中的检查点

    

1. 等待任务成功，你可以通过 [查询任务状态来确认](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [查询检查点接口](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 时传入你的微调任务 ID，以获取该微调任务的模型检查点列表。
1. 找到 `fine_tuned_model_checkpoint` 字段，该字段为模型检查点的名称。
1. 像使用最终的微调模型一样使用这个模型。

检查点对象包含 `metrics` 可帮助你判断该模型实用性的数据。例如，响应如下所示：

```json
{
  "object": "fine_tuning.job.checkpoint",
  "id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
  "created_at": 1519129973,
  "fine_tuned_model_checkpoint": "ft:gpt-3.5-turbo-0125:my-org:custom-suffix:96olL566:ckpt-step-2000",
  "metrics": {
    "full_valid_loss": 0.134,
    "full_valid_mean_token_accuracy": 0.874
  },
  "fine_tuning_job_id": "ftjob-abc123",
  "step_number": 2000
}
```

每个检查点指定：

- `step_number`: 创建检查点的步骤（其中每个 epoch 是训练集中的步数除以批量大小）
- `metrics`: 包含创建检查点时微调任务指标的对象



## 安全检查

在投入生产之前，请查看并遵循以下安全信息。



### 我们如何评估安全性



微调任务完成后，我们会在 13 个不同的安全类别中评估所生成模型的行为。每个类别都代表一个关键领域，若不加以适当控制，AI 输出有可能在这些领域造成危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 针对任何目标的包含暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。指向非受保护群体（例如国际象棋选手）的仇恨内容属于骚扰。 |
| hate/threatening       | 针对基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的目标群体，同时包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指导的内容。例如“如何入店行窃”这样的短语就属于此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞扬或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自残行为（例如自杀、自残和进食障碍），或提供如何实施此类行为的指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示正在或意图实施自残行为（例如自杀、自残和进食障碍）的内容。                                                                                           |
| sensitive              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| sexual/minors          | 包含未满 18 岁未成年人的性内容。                                                                                                                                                                          |
| sexual                 | 旨在引发性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和性健康）。                                                                                |
| violence               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果某个类别中评估为失败的样例过多，OpenAI 会阻止该微调模型部署。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的审核检查部分查看结果。







### 如何通过安全检查



除了查看微调任务对象中任何失败的安全检查外，你还可以通过查询 [微调 API 事件端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list)。来获取有关哪些类别失败的详细信息。查找类型为 `moderation_checks` 的事件，以了解类别结果与执行情况的相关信息。这些信息可以帮助你缩小需要针对再训练和改进的类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 中包含的规则和示例可以帮助识别需要补充训练数据的领域。

虽然这些评估涵盖了广泛的安全类别，但你仍需对微调后的模型自行进行评估，以确保其适用于你的用例。





## 后续步骤

既然你已经掌握了强化微调的基础知识，不妨探索其他微调方法。

[监督微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

## 附录

### 训练指标

强化微调作业会以 [微调事件](https://developers.openai.com/api/reference/resources/fine_tuning)。的形式发布每步训练指标。通过 [API](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list) 拉取这些指标，或在 [fine-tuning dashboard](https://platform.openai.com/finetune).

了解有关训练指标的更多信息，请参阅下文。



#### 完整示例训练指标



下面是一个来自真实强化微调任务的指标事件示例。该负载中的各个字段将在后续章节中讨论。

```json
{
      "object": "fine_tuning.job.event",
      "id": "ftevent-Iq5LuNLDsac1C3vzshRBuBIy",
      "created_at": 1746679539,
      "level": "info",
      "message": "Step 10/20 , train mean reward=0.42, full validation mean reward=0.68, full validation mean parse error=0.00",
      "data": {
        "step": 10,
        "usage": {
          "graders": [
            {
              "name": "basic_model_grader",
              "type": "score_model",
              "model": "gpt-4o-2024-08-06",
              "train_prompt_tokens_mean": 241.0,
              "valid_prompt_tokens_mean": 241.0,
              "train_prompt_tokens_count": 120741.0,
              "valid_prompt_tokens_count": 4820.0,
              "train_completion_tokens_mean": 138.52694610778443,
              "valid_completion_tokens_mean": 140.5,
              "train_completion_tokens_count": 69402.0,
              "valid_completion_tokens_count": 2810.0
            }
          ],
          "samples": {
            "train_reasoning_tokens_mean": 3330.017964071856,
            "valid_reasoning_tokens_mean": 1948.9,
            "train_reasoning_tokens_count": 1668339.0,
            "valid_reasoning_tokens_count": 38978.0
          }
        },
        "errors": {
          "graders": [
            {
              "name": "basic_model_grader",
              "type": "score_model",
              "train_other_error_mean": 0.0,
              "valid_other_error_mean": 0.0,
              "train_other_error_count": 0.0,
              "valid_other_error_count": 0.0,
              "train_sample_parse_error_mean": 0.0,
              "valid_sample_parse_error_mean": 0.0,
              "train_sample_parse_error_count": 0.0,
              "valid_sample_parse_error_count": 0.0,
              "train_invalid_variable_error_mean": 0.0,
              "valid_invalid_variable_error_mean": 0.0,
              "train_invalid_variable_error_count": 0.0,
              "valid_invalid_variable_error_count": 0.0
            }
          ]
        },
        "scores": {
          "graders": [
            {
              "name": "basic_model_grader",
              "type": "score_model",
              "train_reward_mean": 0.4471057884231537,
              "valid_reward_mean": 0.675
            }
          ],
          "train_reward_mean": 0.4215686274509804,
          "valid_reward_mean": 0.675
        },
        "timing": {
          "step": {
            "eval": 101.69386267662048,
            "sampling": 226.82190561294556,
            "training": 402.43121099472046,
            "full_iteration": 731.5038568973541
          },
          "graders": [
            {
              "name": "basic_model_grader",
              "type": "score_model",
              "train_execution_latency_mean": 2.6894934929297594,
              "valid_execution_latency_mean": 4.141402995586395
            }
          ]
        },
        "total_steps": 20,
        "train_mean_reward": 0.4215686274509804,
        "reasoning_tokens_mean": 3330.017964071856,
        "completion_tokens_mean": 3376.0019607843137,
        "full_valid_mean_reward": 0.675,
        "mean_unresponsive_rewards": 0.0,
        "model_graders_token_usage": {
          "gpt-4o-2024-08-06": {
            "eval_cached_tokens": 0,
            "eval_prompt_tokens": 4820,
            "train_cached_tokens": 0,
            "train_prompt_tokens": 120741,
            "eval_completion_tokens": 2810,
            "train_completion_tokens": 69402
          }
        },
        "full_valid_mean_parse_error": 0.0,
        "valid_reasoning_tokens_mean": 1948.9
      },
      "type": "metrics"
    },
```







#### 评分指标



需要关注的核心指标是 `train_reward_mean` 和 `valid_reward_mean`，它们分别表示在训练和验证数据集中，你的评分器对所有样本给出的平均 reward。

此外，如果你使用了 [多评分器](https://developers.openai.com/api/reference/resources/graders) 配置，还会发布每个评分器的训练和验证 reward 指标。这些指标包含在微调事件对象中的 `event.data.scores` 对象下，每个评分器对应一条记录。每个评分器的指标有助于你了解模型在各个评分器上的表现，并帮助你识别模型是否对某个评分器存在过拟合。

在微调仪表板中，每个评分器的指标会以独立图表的形式显示在整体 `train_reward_mean` 和 `valid_reward_mean` 指标下方。

![Per-Grader Reward Metric Graph](https://cdn.openai.com/API/images/guides/RFT_MultiReward_Chart.png)







#### 用量指标



推理模型的一个重要特征是它在响应提示之前所使用的推理 token 数量。在训练过程中，模型经常会大幅改变它响应提示时所使用的平均推理 token 数量。这是模型正在根据奖励信号改变其行为的一个迹象。模型可能会学会使用更少的推理 token 来获得相同的奖励，也可能会学会使用更多的推理 token 来获得更高的奖励。

你可以监控这些 `train_reasoning_tokens_mean` 和 `valid_reasoning_tokens_mean` 指标，以观察模型的行为随时间的变化。这些指标分别是模型在训练集和验证集中响应提示所使用的平均推理 token 数。你还可以在微调仪表板的“Reasoning Tokens”图表中查看平均推理 token 数。

![推理 token 指标图表](https://cdn.openai.com/API/images/guides/RFT_ReasoningTokens_Chart.png)

如果你正在使用 [模型评分器](https://developers.openai.com/api/docs/guides/graders#model-graders)，你可能需要监控这些评分器的 token 使用情况。每个评分器的 token 使用统计信息可在 `event.data.usage.graders` 对象中查看，并细分为：

- `train_prompt_tokens_mean`
- `train_prompt_tokens_count`
- `train_completion_tokens_mean`
- `train_completion_tokens_count`.

该 `_mean` 指标表示评分器在当前步骤中处理所有提示所使用的平均 token 数，而 `_count` 指标表示评分器在当前步骤中跨所有样本所使用的 token 总数。每一步的 token 使用情况也会在微调仪表板的 "Grading Token Usage" 图表中显示。

![模型评分器 Token 使用情况](https://cdn.openai.com/API/images/guides/RFT_ModelGraderTokenUsage.png)







#### 时序指标



我们提供了多项指标，帮助你了解训练过程中每一步耗时以及训练过程不同部分对每步耗时的影响。

这些指标可在 `event.data.timing` 对象下查看，并细分为 `step` 和 `graders` 字段。

该 `step` 字段包含以下指标：

- `sampling`: 对当前步骤采样模型输出（rollouts）所花费的时间。
- `training`: 对当前步骤训练模型（反向传播）所花费的时间。
- `eval`: 在完整验证集上评估模型所花费的时间。
- `full_iteration`: 当前步骤的总耗时，包含上述 3 个指标以及所有其他开销。

逐步时延指标也会显示在微调仪表盘的 "Per Step Duration"（每步耗时）图表中。

![Per Step Duration Graph](https://cdn.openai.com/API/images/guides/RFT_PerStepDuration2.png)

该 `graders` 字段包含计时信息，详细说明为当前步骤执行每个评分器所花费的时间。每个评分器将在 `train_execution_latency_mean` 和 `valid_execution_latency_mean` 指标下拥有各自的计时，这些指标分别表示在训练集和验证集上执行评分器所需的平均时间。

评分器是并行执行的，并且存在并发限制，因此单个评分器的延迟如何累加得到评分的总耗时并不总是清晰的。然而，通常情况下，单个执行时间更长的评分器会导致任务整体执行更慢。也就是说，较慢的模型评分器会使任务完成时间变长，更昂贵的 Python 代码也会产生同样的效果。最快的评分器通常是 `string_check` 和 `text_similarity` ，因为它们是在训练循环本地执行的。





### Evals 集成详情

强化微调作业与我们的 [evals 产品](https://developers.openai.com/api/docs/guides/evals)。直接集成。创建强化微调作业时，会自动创建一个新的 eval 并与之关联。

在执行验证步骤时，输入提示、模型采样、评分器输出以及更多元数据将被组合成一个新的 [eval 运行](https://developers.openai.com/api/docs/guides/evals#creating-an-eval-run) 用于该步骤。作业结束时，每个验证步骤将对应一个运行记录。这使你能够比较模型在不同步骤下的表现，并查看模型行为在整个训练过程中的变化。

你可以通过在微调仪表板上查看作业，或通过查找 `eval_id` 字段来找到与你的微调作业相关联的 eval。请参阅 [微调任务对象](https://developers.openai.com/api/reference/resources/fine_tuning).

evals 产品可用于检查模型在特定数据点上的输出，从而了解模型在不同场景下的行为。它可以帮助你找出模型表现较差的数据切片，从而识别训练数据中可改进的地方。

evals 产品还可以帮助你发现评分器有待改进的地方，例如找出评分器对模型输出过于宽松或过于严格的区域。

### 暂停和恢复任务

你可以随时使用 [微调作业 API](https://developers.openai.com/api/reference/resources/fine_tuning)。来暂停微调作业。调用 pause API 会指示训练流程创建一个新的模型快照，停止训练，并将作业置于“已暂停”状态。该模型快照将经过常规安全审核流程，之后你便可以在整个 OpenAI 平台中像普通微调模型一样使用它。

如果你希望恢复对已暂停作业的训练过程，可以通过使用 [微调作业 API](https://developers.openai.com/api/reference/resources/fine_tuning)。来实现。这将从作业暂停时创建的最后一个检查点恢复训练过程，并继续训练，直至作业完成或再次被暂停。

### 使用工具进行评分

如果你正在训练你的模型来 [执行工具调用](https://developers.openai.com/api/docs/guides/function-calling),你需要:

1. 提供一组工具，供你的模型在 RFT 训练数据集中的每个数据点上调用。更多信息请参见 [数据集 API 参考文档](https://developers.openai.com/api/reference/resources/fine_tuning).
2. 将评分器配置为根据模型生成的工具调用内容来分配奖励。关于工具调用评分的信息请参见 [评分文档](https://developers.openai.com/api/docs/guides/graders/#sample-namespace)

### 计费详情

强化微调作业根据训练所花费的时间以及模型在训练过程中使用的词元数量计费。我们仅对核心训练循环所花费的时间计费，不对准备训练数据、验证数据集、排队等待、运行安全评估或其他开销所花费的时间计费。

有关我们如何对强化微调作业进行计费的详细信息，请参阅本文 [帮助中心文章](https://help.openai.com/en/articles/11323177-billing-guide-for-the-reinforcement-fine-tuning-api).

### 训练错误

强化微调是一个涉及许多变量的复杂过程，很多环节都可能出错。我们发布了多种错误指标，帮助你了解任务中哪里出了问题以及如何修复。总体上，除非出现特别严重的错误，我们尽量避免让任务整体失败。当错误确实发生时，它们通常出现在评分步骤中。评分阶段的错误通常源于以下几种情况：模型输出的样本评分器无法处理、评分器因系统错误而未能正确执行，或是评分逻辑本身存在缺陷。

错误指标可在以下对象的 `event.data.errors` 对象下查看，并按评分器汇总为计数和比率。我们还会在微调仪表板上展示错误的比率和计数。



#### 评分器错误



#### 通用评分错误

评分器错误分为以下类别，两种版本中都存在 `train_` （训练数据）和 `valid_` （验证数据）版本：

- `sample_parse_error_mean`: 未成功解析的样本平均数量。这通常发生在模型未能输出有效的 JSON 或未能正确遵循所提供的响应格式时。训练初期出现少量此类错误是正常的。如果出现大量此类错误，很可能是模型的响应格式配置不正确，或是评分器配置错误、查找了不存在的字段。
- `invalid_variable_error_mean`: 当你尝试通过模板引用一个在当前数据点或当前模型样本中无法找到的变量时，就会发生这些错误。这可能是由于模型未能以正确的响应格式提供输出，或是评分器配置错误。
- `other_error_mean`: 这是评分过程中发生的其他所有错误的兜底分类。这些错误通常由评分逻辑本身的缺陷，或评分过程中发生的系统错误导致。

#### Python 评分错误

- `python_grader_server_error_mean`：当我们在远程沙箱中执行 python 评分器的系统出现错误时，就会发生这些错误。这通常是由于你无法控制的原因造成的，例如网络故障或系统中断。如果你看到大量此类错误，很可能存在导致这些错误的系统问题。你可以查看 [OpenAI 状态页面](https://status.openai.com/) 以获取有关任何正在进行的问题的更多信息。
- `python_grader_runtime_error_mean`：当 python 评分器本身无法正常执行时，就会发生这些错误。造成这种情况的原因有很多，包括评分逻辑中存在错误，或者评分器试图访问当前上下文中不存在的变量。如果你看到大量此类错误，很可能是你的评分逻辑中存在需要修复的错误。如果此类错误数量足够多，任务将会失败，并且我们会向你展示来自失败评分器的部分 traceback 样本。

#### 模型评分错误

- `model_grader_server_error_mean`：这些错误发生于我们无法从模型评分器采样时。出现原因多种多样，但通常意味着模型评分器配置错误、你所使用的模型在你的组织中不可用，或 OpenAI 端出现了系统问题。