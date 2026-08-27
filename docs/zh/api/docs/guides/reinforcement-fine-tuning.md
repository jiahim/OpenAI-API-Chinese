# 强化微调

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过追加 `.md` 到页面 URL 获得。

强化微调（RFT）通过你定义的反馈信号来调整OpenAI推理模型。与 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)，类似，它使模型适应你的任务。区别在于，它不是基于固定的“正确”答案进行训练，而是依赖一个可编程的评分器来为每个候选响应打分。随后，训练算法会调整模型权重，使高分输出更可能出现，低分输出逐渐消失。

OpenAI正在逐步关闭微调平台。该平台不再
  对新用户开放，但现有微调平台用户仍
  可在未来几个月内创建训练任务。
  

  所有微调模型将继续可用于推理，直到其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。完整时间线见
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

这种优化使你能够将模型与风格、安全性或领域准确性等细致目标对齐——许多 [实际使用案例](https://developers.openai.com/api/docs/guides/rft-use-cases) 不断涌现。按五个步骤运行RFT：

1. 实现一个 [评分器](https://developers.openai.com/api/docs/guides/graders) ，为每个模型响应分配数值奖励。
1. 上传你的提示数据集并指定验证划分。
1. 启动微调任务。
1. 监控并 [评估](https://developers.openai.com/api/docs/guides/evals) 检查点；如有需要，修改数据或评分器。
1. 通过标准 API 部署生成的模型。

在训练过程中，平台会遍历数据集，为每个提示采样多个响应，使用评分器对其进行评分，并根据这些奖励应用策略梯度更新。循环持续进行，直到你训练数据的末尾或你在所选检查点停止作业为止，从而生成一个针对你所关心的指标进行优化的模型。

我什么时候应该使用强化微调？

了解强化微调的优势和劣势有助于你识别机会，避免浪费精力。

- **RFT 最适合任务明确、无歧义的情况**。请检查合格的人类专家是否对答案达成一致。如果认真负责的专家独立工作（仅能访问与模型相同的说明和信息）无法得出相同答案，则任务可能过于模糊，可能需要修订或重新设计。
- **你的任务必须与评分选项兼容**。请先查看 [API 中的评分选项](https://developers.openai.com/api/reference/resources/graders) ，并确认可以使用这些选项对你的任务进行评分。
- **你的评估结果必须具有足够的可变性，才能用于改进**。在使用 RFT 之前，请先运行 [评估](https://developers.openai.com/api/docs/guides/evals) 。如果你的评估分数介于最低和最高可能分数之间，你将有足够的数据来强化正确答案。如果你要微调的模型得分处于绝对最低或绝对最高分，RFT 对你不会有帮助。
- **你的模型必须在目标任务上取得一定成功**。强化微调会进行渐进式调整，采样大量答案并选择最佳答案。如果模型在给定任务上的成功率为 0%，你无法通过 RFT 引导提升到更高的性能水平。
- **你的任务应该难以猜测**。如果模型可以通过幸运猜测获得更高的奖励，训练信号就会过于嘈杂，因为模型可能通过错误的推理过程得到正确答案。请重新设计你的任务，使猜测更加困难——例如，将类别细分为子类，或将多选题改为开放式回答。

在 [强化微调用例指南](https://developers.openai.com/api/docs/guides/rft-use-cases).

什么是强化学习？

强化学习是机器学习的一个分支，其中模型通过行动、接收反馈以及自我调整来最大化未来的反馈。与记忆每个示例的一个“正确”答案不同，模型探索多种可能的答案，观察每个答案的数值奖励，并逐渐调整其行为，使得高奖励答案更可能出现，低奖励答案消失。经过多轮迭代，模型收敛到一个策略——即选择输出的规则——该策略最能满足你定义的奖励信号。

在强化微调（RFT）中，该奖励信号来自你为任务定义的自定义评分器。对于数据集中的每个提示，平台会采样多个候选答案，运行你的评分器对它们进行评分，并应用策略梯度更新，推动模型向得分更高的答案靠近。这一循环——采样、评分、更新——在数据集（以及后续的轮次）中持续进行，直到模型可靠地优化以符合你评分器对质量的理解。评分器编码了你关心的任何方面——准确性、风格、安全性或任何指标——因此最终的微调模型反映了这些优先事项，并且你无需管理强化学习基础设施。

强化微调仅支持 o 系列推理模型，且
  目前仅支持 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini).

## 示例：由 LLM 提供支持的安全审查

为演示下面的强化微调，我们将微调一个 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini) 模型，使其根据内部公司政策文档，就一家虚构公司的安全态势提供专家级回答。我们希望模型返回一个符合特定架构的 JSON 对象，该架构支持 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs).

示例输入问题：

```
Do you have a dedicated security team?
```

利用内部政策文档，我们希望模型返回包含两个键的 JSON：

- `compliant`：一个字符串 `yes`, `no`，或 `needs review`，指示公司的政策是否涵盖该问题。
- `explanation`：一个文本字符串，简要解释基于政策文件该问题为何被政策涵盖或未涵盖。

模型期望输出的示例：

```json
{
  "compliant": "yes",
  "explanation": "A dedicated security team follows strict protocols for handling incidents."
}
```

让我们使用 RFT 对模型进行微调，以在此任务上表现良好。

## 定义评分器

要执行 RFT，需定义一个 [评分器](https://developers.openai.com/api/docs/guides/graders) ，在训练期间对模型的输出进行评分，以指示其响应质量。RFT 使用与 [评估](https://developers.openai.com/api/docs/guides/evals)，相同的一组评分器，你可能对此已经很熟悉。

在此示例中，我们定义 [多个评分器](https://developers.openai.com/api/reference/resources/graders) 来检查我们微调模型返回的 JSON 的属性：

- 该 [`string_check`](https://developers.openai.com/api/reference/resources/graders) 评估者以确保相应的 `compliant` 属性已设置
- 该 [`score_model`](https://developers.openai.com/api/reference/resources/graders) 评估者对解释文本给出介于零和一之间的分数，使用另一个评估模型

我们在计算中平等地对待每个属性的输出权重， `calculate_output` 表达式。

以下是我们将在 API 请求中用于此评分器的 JSON 载荷数据。在两个评分器中，我们使用 `{{ }}` 模板语法来引用两者相关的属性： `item` （用于评估的测试数据行）和 `sample` （训练期间生成的模型输出）。



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

要创建 RFT 微调，你需要同时具备训练数据集和测试数据集。训练数据集和测试数据集将共享相同的 [JSONL 格式](https://jsonlines.org/)。JSONL 数据文件中的每一行将包含一个 `messages` 数组，以及根据模型输出进行评分所需的任何附加字段。RFT 数据集的完整规范 [可在此处找到](https://developers.openai.com/api/reference/resources/fine_tuning).

在我们的案例中，除了 `messages` 数组之外，我们 JSONL 文件中的每一行还需要 `compliant` 和 `explanation` 属性，我们可以将这些属性用作参考值来测试微调模型的结构化输出。

我们的训练数据集和测试数据集中的单行数据如下所示（以缩进的 JSON 形式）：

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

下面提供了一些 JSONL 数据，你可以在创建微调作业时将其用于训练和测试。请注意，这些数据集仅用于说明目的——在你的实际测试数据中，应力求为你的应用程序提供多样且具有代表性的输入。

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

需要多少训练数据？

从小处着手——几十到几百个示例——在投入大型数据集之前先确定 RFT 的效用。出于产品安全原因，训练集必须首先通过自动筛选过程。大型数据集需要更长的处理时间。此筛选过程在你使用文件启动微调作业时开始，而不是在首次上传文件时开始。一旦文件成功完成筛选，你就可以无延迟地重复使用它。

只要质量高，几十个示例就能说明问题。筛选之后，只要保持高质量，数据越多越好。对于较大的数据集，你可以使用更大的批量大小，这往往有助于提高训练稳定性。

你的训练文件最多可以包含 50,000 个示例。测试数据集最多可以包含 1,000 个示例。测试数据集也会经过自动筛选。

### 上传你的文件

上传 RFT 训练和测试数据文件的过程与 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)。相同。你可以通过 [API](https://developers.openai.com/api/reference/resources/files/methods/create) 或 [使用我们的界面](https://platform.openai.com/storage)。将训练数据上传到 OpenAI。文件必须以 `fine-tune` 为目的上传，才能用于微调。

**你需要测试和训练数据文件的文件 ID，** 才能创建微调作业。

## 创建微调作业

使用 [API](https://developers.openai.com/api/reference/resources/fine_tuning) 或 [微调仪表盘](https://platform.openai.com/finetune)。创建微调作业。为此，你需要：

- 用于训练数据集和测试数据集的 File ID
- 我们之前创建的评估器（grader）配置
- 你希望用作微调基础模型的模型 ID（我们将使用 `o4-mini-2025-04-16`)
- 如果你微调的模型将返回 JSON 数据作为结构化输出，你还需要返回对象的 JSON schema（见下文）
- （可选）你希望为微调配置的任何超参数
- 要获得 [数据共享推理定价](https://developers.openai.com/api/docs/pricing#fine-tuning)，你需要先 [共享评估和微调数据](https://help.openai.com/en/articles/10306912-sharing-feedback-evaluation-and-fine-tuning-data-and-api-inputs-and-outputs-with-openai#h_c93188c569) 与 OpenAI 共享，然后才能创建任务

### 结构化输出的 JSON 模式

如果你正在微调模型以返回 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)，请提供用于格式化输出的 JSON schema。请参阅我们安全面试用例的有效 JSON schema：

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

根据 Pydantic 模型生成 JSON schema

为简化 JSON schema 的生成，从 [Pydantic BaseModel](https://docs.pydantic.dev/latest/api/base_model/) 类开始：

1. 定义你的类
1. 使用 `to_strict_json_schema` 来自 OpenAI 库来生成有效的结构
1. 将结构包裹在字典中，并使用 `type` 和 `name` 键，并设置 `strict` 为 true
1. 将生成的对象作为 `response_format` 在你的 RFT 作业中提供

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

使用 API 配置作业涉及许多可变部分，因此许多用户更倾向于在 [微调仪表盘 UI](https://platform.openai.com/finetune)。中进行配置。然而，以下是一个完整的 API 请求，用于启动一个微调作业，包含本指南目前设置的所有配置：

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


此请求返回一个 [微调作业对象](https://developers.openai.com/api/reference/resources/fine_tuning)，其中包含一个作业 `id`。使用此 ID 来监控作业进度，并在作业完成时检索微调后的模型。

要符合 [数据共享推理定价](https://developers.openai.com/api/docs/pricing#fine-tuning)，的资格，请确保在创建作业之前 [共享评估和微调数据](https://help.openai.com/en/articles/10306912-sharing-feedback-evaluation-and-fine-tuning-data-and-api-inputs-and-outputs-with-openai#h_c93188c569) 给 OpenAI。你可以通过确认 `shared_with_openai` 设置为 `true`.

### 监控你的微调作业

微调任务需要一些时间才能完成，而 RFT 任务通常比 SFT 或 DPO 任务耗时更长。要监控微调任务的进度，请使用 [微调仪表盘](https://platform.openai.com/finetune) 或 [API](https://developers.openai.com/api/reference/resources/fine_tuning).

#### 奖励指标

对于强化微调任务，主要指标是每步的 **奖励** 指标。这些指标表明你的模型在训练数据上的表现如何。它们由你在任务配置中定义的评分器计算得出。这是两个独立的顶层奖励指标：

- `train_reward_mean`：当前步骤中从所有数据点采样的平均奖励。由于批次中的具体数据点会随每个步骤变化， `train_reward_mean` 不同步骤之间的值不能直接比较，且具体数值可能在不同步骤之间剧烈波动。
- `valid_reward_mean`：验证集中所有数据点采样的平均奖励，这是一个更稳定的指标。

![奖励指标图](https://cdn.openai.com/API/images/guides/RFT_Reward_Chart.png)

在 [训练指标](#training-metrics) 部分中查找所有训练指标的完整描述。

#### 暂停和恢复作业

当你的任务仅部分完成时，如需评估模型的当前状态， **暂停** 任务以停止训练过程并在当前步骤生成检查点。你可以使用该检查点在保留的测试集上评估模型。如果结果看起来不错， **恢复** 任务以从该检查点继续训练。更多信息请参阅 [暂停和恢复任务](#pausing-and-resuming-jobs).

#### Evals 集成

强化微调任务已与我们的 [评估产品](https://developers.openai.com/api/docs/guides/evals)。集成。当你创建强化微调任务时，会自动创建一个新的评估并与该任务关联。在执行验证步骤时，我们会将输入提示、模型样本和评分器输出合并，以生成一个新的 [评估运行](https://developers.openai.com/api/docs/guides/evals#creating-an-eval-run) 用于该步骤。

有关评估集成的更多信息，请参阅 [附录](#evals-integration-details) 部分。

## 评估结果

当你的微调任务完成时，你应该已经可以根据验证集上的平均奖励值对模型的表现有一个大致的了解。然而，模型可能出现了 _过拟合_ 训练数据的情况，或者学会了 [奖励黑客](https://en.wikipedia.org/wiki/Reward_hacking) 你的评分器，这使其能够在未真正正确的情况下获得高分。在部署模型之前，在一组具有代表性的提示上检查其行为，以确保其表现符合你的预期。

通过检查与微调任务关联的评估，可以快速了解模型的行为。具体来说，请密切关注为最终训练步骤运行的评估，以了解最终模型的行为。你还可以使用评估产品将最终运行与早期运行进行比较，并观察模型行为在训练过程中的变化。

### 尝试使用你的微调模型

通过使用它来评估你新优化的模型！当微调模型完成训练后，在 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API中使用其 ID，就像使用 OpenAI 基础模型一样。



在 Playground 中使用你的模型

    

1. 导航到你的微调作业，位于 [仪表盘](https://platform.openai.com/finetune).
1. 在右侧面板中，导航到 **输出模型** 并复制模型 ID。它应以 `ft:…`
1. 打开 [Playground](https://platform.openai.com/playground).
1. 在 **模型** 下拉菜单中，粘贴模型 ID。在这里，你还应看到已创建的其他微调模型。
1. 运行一些提示，看看你的微调模型表现如何！


  

  

    
通过API调用使用你的模型

    

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
    "input": "What is 4+4?"
  }'
```



### 如需检查点，请使用

检查点是在训练过程最终步骤之前创建的、可供你使用的模型。对于 RFT，OpenAI 会在每个验证步骤创建完整的模型检查点，并保留得分最高的三个 `valid_reward_mean` 。检查点有助于在训练过程中的不同节点评估模型，并比较不同步骤的性能。



在仪表盘中查找检查点

    

1. 导航到 [微调仪表板](https://platform.openai.com/finetune).
1. 在左侧面板中，选择你想要调查的任务，等待其成功完成。
1. 在右侧面板中，滚动到检查点列表。
1. 悬停在任何检查点上，以查看启动 Playground 的链接。
1. 通过在 Playground 中提示检查点模型来测试其行为。


  

  

    
查询 API 以获取检查点

    

1. 等待作业成功，你可以通过 [查询作业状态](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [查询检查点端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 使用你的微调作业 ID 来访问该微调作业的模型检查点列表。
1. 找到 `fine_tuned_model_checkpoint` 字段以获取模型检查点的名称。
1. 像使用最终微调模型一样使用此模型。

检查点对象包含 `metrics` 用于帮助你判断此模型有用性的数据。例如，响应如下所示：

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

- `step_number`：创建检查点时的步骤（每个 epoch 的步数等于训练集中的样本数除以批量大小）
- `metrics`：一个对象，包含在创建检查点时你的微调作业的指标



## 安全检查

在生产环境启动之前，请审阅并遵循以下安全信息。

我们如何进行安全评估

微调作业完成后，我们会评估所得模型在13个不同安全类别中的行为。每个类别代表一个关键领域，若未妥善控制，AI输出在这些领域中可能造成伤害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含对任何目标施加暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（如棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓，对目标群体施以暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的敏感度极高的数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施非法行为建议或指导的内容。诸如“如何入店行窃”之类的表述即属此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态表示赞扬或提供协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自残行为（如自杀、割伤和饮食失调），或提供如何实施此类行为指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示正在实施或意图实施自残行为（如自杀、割伤和饮食失调）的内容。                                                                                           |
| 敏感              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 性/未成年人          | 包含未满18岁个人的性内容。                                                                                                                                                                          |
| 性                 | 旨在引起性兴奋的内容，例如性活动描述，或宣传性服务的内容（不包括性教育和健康内容）。                                                                                |
| 暴力               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有预定义的通过阈值；如果给定类别中过多评估示例未通过，OpenAI将阻止微调模型部署。如果微调模型未通过安全检查，OpenAI会在微调作业中发送消息，说明哪些类别未达到所需阈值。你可以在微调作业的审核检查部分查看结果。

如何通过安全检查

除了查看微调作业对象中的任何失败安全检查外，你还可以通过查询 [微调 API 事件端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list)。查找类型为 `moderation_checks` 的事件，获取有关类别结果和强制执行情况的详细信息。这些信息可以帮助你缩小范围，确定哪些类别需要重新训练和改进。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 包含规则和示例，可以帮助识别需要额外训练数据的领域。

虽然这些评估覆盖了广泛的安全类别，但请自行对微调模型进行评估，以确保其适合你的使用场景。

## 后续步骤

现在你已经了解了强化微调的基础知识，可以探索其他微调方法。

[监督微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

## 附录

### 训练指标

强化微调任务将逐步训练指标发布为 [微调事件](https://developers.openai.com/api/reference/resources/fine_tuning)。通过 [API](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list) 拉取这些指标，或在 [微调仪表盘](https://platform.openai.com/finetune).

中以图形和图表的形式查看。以下是关于训练指标的更多信息。

完整示例训练指标

以下是一个真实强化微调作业的示例指标事件。此负载中的各个字段将在后续章节中讨论。

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

评分指标

要关注的最顶层指标是 `train_reward_mean` 和 `valid_reward_mean`，它们分别表示你的评分者在训练和验证数据集中所有样本上分配的平均奖励。

此外，如果你使用 [多评分者](https://developers.openai.com/api/reference/resources/graders) 配置，每个评分者的训练和验证奖励指标也会发布。这些指标包含在微调事件对象的 `event.data.scores` 中，每个评分者对应一个条目。逐评分者指标有助于理解模型在每个单独评分者上的表现，并能帮助你识别模型是否对某个评分者过拟合。

在微调仪表盘中，各个评分者的指标将显示在总体 `train_reward_mean` 和 `valid_reward_mean` 指标下方的各自图表中。

![逐评分器奖励指标图](https://cdn.openai.com/API/images/guides/RFT_MultiReward_Chart.png)

使用量指标

推理模型的一个重要特征是它在响应提示前使用的推理令牌数量。通常，在训练过程中，模型会大幅改变其对提示做出响应时使用的平均推理令牌数。这表明模型正在根据奖励信号改变其行为。模型可能学会使用更少的推理令牌来获得相同的奖励，或者可能学会使用更多的推理令牌来获得更高的奖励。

你可以监控 `train_reasoning_tokens_mean` 和 `valid_reasoning_tokens_mean` 指标，以了解模型随时间推移的行为变化。这些指标分别是训练数据集和验证数据集中模型对提示做出响应所使用的平均推理令牌数。你还可以在微调仪表盘的“推理令牌”图表中查看平均推理令牌数。

![推理令牌指标图](https://cdn.openai.com/API/images/guides/RFT_ReasoningTokens_Chart.png)

如果你使用 [模型评分器](https://developers.openai.com/api/docs/guides/graders#model-graders)，则可能需要监控这些评分器的令牌使用情况。每个评分器的令牌使用统计信息可在 `event.data.usage.graders` 对象下获取，并细分为：

- `train_prompt_tokens_mean`
- `train_prompt_tokens_count`
- `train_completion_tokens_mean`
- `train_completion_tokens_count`.

该 `_mean` 指标表示评分器处理当前步骤中所有提示所用的平均令牌数，而 `_count` 指标表示评分器在当前步骤中处理所有样本所使用的令牌总数。每步的令牌使用情况也会显示在微调仪表盘的“评分令牌使用”图表中。

![模型评分器令牌使用](https://cdn.openai.com/API/images/guides/RFT_ModelGraderTokenUsage.png)

时间指标

我们提供了各种指标，帮助你了解训练过程中每一步所花费的时间，以及训练过程的不同部分如何影响每一步的时间。

这些指标可在 `event.data.timing` 对象下获取，并细分为 `step` 和 `graders` 字段。

该 `step` 字段包含以下指标：

- `sampling`：采样当前步骤模型输出（rollouts）所花费的时间。
- `training`：训练当前步骤模型（反向传播）所花费的时间。
- `eval`：在完整验证集上评估模型所花费的时间。
- `full_iteration`：当前步骤总耗时，包括上述 3 项指标以及任何额外开销。

步骤计时指标也会显示在微调仪表盘的“每次步骤持续时间”图表下。

![每次步骤持续时间图](https://cdn.openai.com/API/images/guides/RFT_PerStepDuration2.png)

该 `graders` 字段包含计时信息，详细说明了当前步骤执行每个评分器所花费的时间。每个评分器将在 `train_execution_latency_mean` 和 `valid_execution_latency_mean` 指标下有自己的计时，这些指标分别表示在训练和验证数据集上执行评分器的平均时间。

评分器以并发限制并行执行，因此并不总是清楚各个评分器的延迟如何累加到评分的总时间。然而，通常来说，单独执行时间较长的评分器会导致作业执行更慢。这意味着较慢的模型评分器会导致作业完成时间更长，更昂贵的 Python 代码也会如此。最快的评分器通常是 `string_check` 和 `text_similarity` 因为它们在训练循环本地执行。

### Evals 集成详情

强化微调作业直接集成到我们的 [评估产品](https://developers.openai.com/api/docs/guides/evals)。中。当你创建一个强化微调作业时，会自动创建一个新的评估并与之关联。

随着验证步骤的执行，输入提示、模型样本、评分器输出以及更多元数据将组合成一个新的 [评估运行](https://developers.openai.com/api/docs/guides/evals#creating-an-eval-run) 用于该步骤。作业结束时，每个验证步骤你都会有一个运行。这使你可以比较模型在不同步骤的性能，并观察模型在训练过程中的行为变化。

你可以通过在微调仪表板上查看作业来找到与你微调作业关联的评估，或者通过查找 `eval_id` 字段在 [微调作业对象](https://developers.openai.com/api/reference/resources/fine_tuning).

评估产品有助于检查模型在特定数据点上的输出，以了解模型在不同场景中的行为。它可以帮助你找出模型在数据集中表现不佳的切片，从而帮助你确定训练数据中需要改进的领域。

评估产品还可以通过找出评分器对模型输出过于宽松或过于严苛的领域，帮助你找到评分器的改进方向。

### 暂停和恢复作业

你可以在任何时候暂停微调作业，方法是使用 [微调作业 API](https://developers.openai.com/api/reference/resources/fine_tuning)。调用暂停 API 会指示训练过程创建新的模型快照、停止训练并将作业置于“已暂停”状态。该模型快照将经过正常的安全审查流程，之后你即可在整个 OpenAI 平台上将其作为普通微调模型使用。

如果你希望继续暂停作业的训练过程，可以使用 [微调作业 API](https://developers.openai.com/api/reference/resources/fine_tuning)。这将从作业暂停时创建的最后一个检查点恢复训练过程，并继续训练，直到作业完成或再次暂停。

### 使用工具进行评分

如果你正在训练模型以 [执行工具调用](https://developers.openai.com/api/docs/guides/function-calling)，你将需要：

1. 提供一组工具，供你的模型在 RFT 训练数据集的每个数据点上调用。更多信息请参见 [数据集 API 参考](https://developers.openai.com/api/reference/resources/fine_tuning).
2. 配置你的评分器，根据模型所进行的工具调用的内容来分配奖励。有关对工具调用进行评分的详细信息，请参见 [评分文档中的相关内容](https://developers.openai.com/api/docs/guides/graders/#sample-namespace)

### 账单详情

强化微调作业按训练所花费的时间以及模型在训练期间使用的令牌数量计费。我们仅对核心训练循环中花费的时间计费，不对准备训练数据、验证数据集、排队等待、运行安全评估或其他开销所花费的时间计费。

关于我们如何对强化微调作业计费的详细信息，请参见此 [帮助中心文章](https://help.openai.com/en/articles/11323177-billing-guide-for-the-reinforcement-fine-tuning-api).

### 训练错误

强化微调是一个涉及众多变动部分的复杂过程，有许多环节可能出现问题。我们发布各种错误指标，帮助你了解作业中出了什么问题，以及如何修复。总的来说，除非发生非常严重的错误，否则我们会尽量避免整个作业失败。当错误确实发生时，它们通常发生在评分步骤。评分阶段的错误往往是由于模型输出了评分器不知道如何处理样本，评分器因某种系统错误而无法正常执行，或者评分逻辑本身存在缺陷。

错误指标可在 `event.data.errors` 对象下获取，并按评分器汇总为计数和比率。我们还在微调仪表板上显示错误的比率和计数。

评分器错误

#### 通用评分错误

评分器错误按以下类别进行细分，这些错误存在于 `train_` （用于训练数据）和 `valid_` （用于验证数据）版本中：

- `sample_parse_error_mean`：解析失败的平均样本数量。这通常发生在模型未能输出有效 JSON 或未能正确遵循提供的响应格式时。这些错误中有一小部分（尤其是在训练过程早期）是正常的。如果你发现此类错误数量较多，很可能是模型的响应格式配置不正确，或你的评分器配置有误，正在查找错误的字段。
- `invalid_variable_error_mean`：这些错误发生在你尝试通过模板引用变量时，而该变量在当前数据点或当前模型样本中均找不到。这可能是因为模型未能以正确的响应格式提供输出，或你的评分器配置有误。
- `other_error_mean`：这是对评分期间发生的所有其他错误的统称。这些错误通常由评分逻辑本身的缺陷或评分期间发生的系统错误导致。

#### Python 评分错误

- `python_grader_server_error_mean`：当我们在远程沙箱中运行 Python 评分器的系统出现系统错误时，会发生这些错误。这通常是由于你无法控制的原因造成的，例如网络故障或系统中断。如果你看到大量此类错误，很可能是存在导致错误的系统问题。你可以查看 [OpenAI 状态页面](https://status.openai.com/) 以了解任何正在进行的相关问题的更多信息。
- `python_grader_runtime_error_mean`：当 Python 评分器本身未能正确执行时，会出现这些错误。这可能是由多种原因造成的，包括评分逻辑中的缺陷，或评分器尝试访问当前上下文中不存在的变量。如果你看到大量此类错误，很可能是你的评分逻辑中存在需要修复的缺陷。如果此类错误发生得足够多，任务将失败，我们会向你展示失败评分器中的部分回溯示例。

#### 模型评分错误

- `model_grader_server_error_mean`: 这些错误发生在我们无法从模型评分器中采样时。这可能是由多种原因造成的，但通常意味着模型评分器配置有误、你尝试使用的模型对你的组织不可用，或者 OpenAI 方面存在系统问题。