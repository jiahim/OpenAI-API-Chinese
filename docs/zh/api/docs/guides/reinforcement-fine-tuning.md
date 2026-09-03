# Reinforcement fine-tuning

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。如需 Markdown 版本的文档页面，可在页面 URL 末尾追加 `.md` 来获取。

强化微调（RFT）会用你定义的反馈信号来适配 OpenAI 推理模型。与 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)，类似，它会让模型针对你的任务进行定制。区别在于，它不是基于固定的“正确答案”进行训练，而是依赖一个可编程的评分器对每个候选回答打分。随后，训练算法会调整模型权重，使高分输出更可能出现，低分输出逐渐消失。

OpenAI 正在逐步关停该微调平台。该平台已不再
  对新用户开放，但现有微调平台用户在
  未来数月内仍可创建训练任务。
  

  所有微调模型在其基础
  模型 [被弃用](https://developers.openai.com/api/docs/deprecations)。之前，都将保持可用于推理。完整时间表请参见
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

这种优化让你可以将模型与诸如风格、安全性或领域准确性等细致目标对齐——同时涌现出许多 [实际用例](https://developers.openai.com/api/docs/guides/rft-use-cases) 。按以下五个步骤运行 RFT：

1. 实现一个 [评分器](https://developers.openai.com/api/docs/guides/graders) 为每个模型响应分配数值奖励。
1. 上传你的提示词数据集，并指定一个验证集划分。
1. 启动微调任务。
1. 监控并 [评估](https://developers.openai.com/api/docs/guides/evals) 各个检查点；如需要，修改数据或评分器。
1. 通过标准的 API 部署得到的模型。

在训练过程中，平台会循环遍历数据集，对每个提示采样多个响应，使用评分器对它们打分，并基于这些奖励应用策略梯度更新。该循环会一直持续，直到到达训练数据末尾或你在选定的 checkpoint 停止任务，最终产出针对你所关注指标进行了优化的模型。



## 应该在什么时候使用强化微调？



了解强化微调的优势与局限有助于识别合适的使用场景并避免徒劳的投入。

- **RFT 最适合用于无歧义的任务**。检查合格的领域专家是否对答案看法一致。如果独立工作的、严谨的专家（只能访问与模型相同的指令和信息）在答案上无法收敛，那么任务可能过于模糊，建议修改或重新构思。
- **你的任务必须与可用的评分选项兼容**。请查看 [API 中的评分选项](https://developers.openai.com/api/reference/resources/graders) ，先确认能够用它们为你的任务评分。
- **你的评估结果必须有足够的差异度以便改进**。请在 [评估](https://developers.openai.com/api/docs/guides/evals) 之后再使用 RFT。如果你的评估得分介于最低分与最高分之间，你就会拥有足够的数据来强化正确答案。如果你想微调的模型得分恰好等于绝对最低分或绝对最高分，那么 RFT 对你来说没有用处。
- **你的模型必须在目标任务上有一定的成功率**。强化微调会进行渐进式调整，对大量答案进行采样并挑选最佳答案。如果模型在某项任务上的成功率为 0%，就无法通过 RFT 自举到更高的性能水平。
- **你的任务应当无法靠猜测蒙对**。如果模型仅凭幸运猜测就能获得更高奖励，那么训练信号就过于嘈杂，因为模型可能在推理过程不正确的情况下猜中正确答案。请重新设计任务，让猜测变得更加困难——例如，将类别扩展为子类，或者把选择题改为开放式问答题。

在以下位置查看常见用例、特定实现和评分示例 [强化微调用例指南](https://developers.openai.com/api/docs/guides/rft-use-cases).







## 什么是强化学习？



强化学习是机器学习的一个分支，模型通过采取行动、接收反馈并重新调整自身以最大化未来反馈来进行学习。模型不是为每个示例记住一个“正确”答案，而是探索多种可能的答案，观察每个答案对应的数值奖励，并逐渐调整其行为，使高奖励的答案更可能出现、低奖励的答案消失。经过多轮反复，模型会收敛到一个策略——即用于选择输出的规则——以最佳地满足你所定义的奖励信号。

在强化微调（RFT）中，该奖励信号来源于你为任务自定义的评分器。对于数据集中的每个提示，平台会采样多个候选答案，运行你的评分器为它们打分，并执行策略梯度更新，使模型倾向于给出更高分数的答案。这一“采样—评分—更新”的循环会在整个数据集（以及后续的多个 epoch）上持续进行，直到模型能够稳定地针对你评分器对质量的定义进行优化。评分器会编码你所关注的任何维度——准确性、风格、安全性或任意指标——因此最终得到的微调模型会反映这些优先级，并且你无需自行管理强化学习基础设施。





强化微调仅在 o 系列推理模型上受支持，并且
  目前仅针对 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini).

## 示例：基于 LLM 的安全审查

为了在下面演示强化微调，我们将对一个模型进行微调 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini) 模型进行微调，使其能够根据一份内部公司策略文档，针对一家虚构公司的安全态势提供专家级回答。我们希望模型返回一个符合特定 schema 的 JSON 对象，且使用 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs).

示例输入问题：

```
Do you have a dedicated security team?
```

使用内部策略文档，我们希望模型返回的 JSON 包含两个键：

- `compliant`: 一个字符串 `yes`, `no`，或者 `needs review`，指示公司政策是否涵盖该问题。
- `explanation`: 一段文本，基于政策文件简要说明该问题为何被政策涵盖或未被涵盖。

模型期望输出示例：

```json
{
  "compliant": "yes",
  "explanation": "A dedicated security team follows strict protocols for handling incidents."
}
```

让我们使用 RFT 微调一个模型，使其在此任务上表现出色。

## 定义评分器

要执行 RFT，需要定义一个 [评分器](https://developers.openai.com/api/docs/guides/graders) ，用于在训练期间对模型输出进行评分，衡量其响应的质量。RFT 使用的评分器集合与 [评估](https://developers.openai.com/api/docs/guides/evals)，相同，你可能已经熟悉它了。

在本示例中，我们定义 [多个评分器](https://developers.openai.com/api/reference/resources/graders) ，用于检查我们微调模型返回的 JSON 的各项属性：

- 该 [`string_check`](https://developers.openai.com/api/reference/resources/graders) 评分器以确保已正确设置 `compliant` 相应属性
- 该 [`score_model`](https://developers.openai.com/api/reference/resources/graders) 评分器以使用另一个评估模型为解释文本提供介于 0 到 1 之间的分数

我们在中 `calculate_output` 中对每个属性的输出赋予相同权重。

下面是我们将在 API 请求中用于此评分器的 JSON 负载数据。在两个评分器中，我们都使用 `{{ }}` 模板语法来引用以下两者的相关属性： `item` （用于评估的测试数据行）以及 `sample` （训练运行期间产生的模型输出）。



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

要创建 RFT 微调，你同时需要训练数据集和测试数据集。训练和测试数据集将共享相同的 [JSONL 格式](https://jsonlines.org/)。JSONL 数据文件中的每一行将包含一个 `messages` 数组，以及对模型输出进行评分所需的任何其他字段。RFT 数据集的 [完整规范可在此处查阅](https://developers.openai.com/api/reference/resources/fine_tuning).

在我们的案例中，除了 `messages` 数组外，我们的 JSONL 文件每行还需要 `compliant` 和 `explanation` 属性，我们可以将它们用作参考值来测试微调模型的结构化输出。

我们训练和测试数据集中的一行以缩进 JSON 形式如下所示：

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

下面提供一些可用于在创建微调作业时同时进行训练和测试的 JSONL 数据。请注意，这些数据集仅用于说明目的——在你的真实测试数据中，请力求为你的应用提供多样化且具有代表性的输入。

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



由小规模开始——从几十到几百个示例——以判断 RFT 的价值，再投入构建大规模数据集。出于产品安全考虑，训练集必须先通过自动筛查流程。数据集越大，处理时间越长。该筛查流程在你使用某个文件启动微调任务时开始，而不是在文件初次上传时开始。文件成功通过筛查后，便可在后续重复使用而无需再次等待。

只要示例质量足够高，几十个示例也能具有意义。筛查通过后，在保持高质量的前提下，数据越多越好。数据集更大时，你可以使用更大的批量大小，这通常有助于提升训练稳定性。

你的训练文件最多可包含 50,000 个示例。测试集最多可包含 1,000 个示例。测试集同样需要经过自动筛查。





### 上传你的文件

上传 RFT 训练和测试数据文件的流程与以下操作相同： [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)。你可以通过 OpenAI 的 [API](https://developers.openai.com/api/reference/resources/files/methods/create) 或 [使用我们的 UI](https://platform.openai.com/storage)。上传你的训练数据。文件必须以 `fine-tune` 为用途上传，才能用于微调。

**你需要测试数据文件和训练数据文件的文件 ID，** 才能创建微调作业。

## 创建微调任务

使用以下任一方式创建一个微调任务 [API](https://developers.openai.com/api/reference/resources/fine_tuning) 或 [微调仪表板](https://platform.openai.com/finetune)。为此，你需要：

- 你的训练数据集和测试数据集的文件 ID
- 我们之前创建的评分器配置
- 你希望用作微调基础的模型 ID（我们将使用 `o4-mini-2025-04-16`)
- 如果你正在微调的模型将以 JSON 数据作为结构化输出返回，那么你还需要所返回对象的 JSON schema（见下文）
- 可选地，任何你想要为微调配置的超参数
- 要获得 [数据共享推理定价](https://developers.openai.com/api/docs/pricing#fine-tuning)，你需要先 [共享评估和微调数据](https://help.openai.com/en/articles/10306912-sharing-feedback-evaluation-and-fine-tuning-data-and-api-inputs-and-outputs-with-openai#h_c93188c569) 给 OpenAI 后再创建任务

### Structured Outputs JSON schema

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



#### 从 Pydantic 模型生成 JSON schema



为了简化 JSON schema 的生成，可以从一个 [Pydantic BaseModel](https://docs.pydantic.dev/latest/api/base_model/) 类入手：

1. 定义你的类
1. 使用 `to_strict_json_schema` OpenAI 库生成有效的架构
1. 将该架构包装在一个包含 `type` 和 `name` 键的字典中，并将 `strict` 设置为 true
1. 将得到的对象作为 `response_format` 提供给 RFT 任务

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






### 使用 API 创建任务

使用 API 配置一个任务涉及许多环节，因此许多用户更倾向于在 [微调仪表盘界面](https://platform.openai.com/finetune)。中进行配置。不过，这里给出一个完整的 API 请求，用于使用本指南中目前已设置的全部配置来启动一个微调任务:

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


此请求将返回一个 [微调任务对象](https://developers.openai.com/api/reference/resources/fine_tuning)，其中包含任务 `id`。你可以使用此 ID 监控任务进度，并在任务完成后取回微调后的模型。

要满足 [数据共享推理定价](https://developers.openai.com/api/docs/pricing#fine-tuning)，的条件，请确保在创建任务之前 [共享评估和微调数据](https://help.openai.com/en/articles/10306912-sharing-feedback-evaluation-and-fine-tuning-data-and-api-inputs-and-outputs-with-openai#h_c93188c569) 给 OpenAI。你可以通过确认 `shared_with_openai` 已设置为 `true`.

### 监控你的微调作业

微调作业需要一些时间才能完成，RFT 作业通常比 SFT 或 DPO 作业耗时更长。要监控微调作业的进度，请使用 [微调仪表板](https://platform.openai.com/finetune) 或 [API](https://developers.openai.com/api/reference/resources/fine_tuning).

#### 奖励指标

对于强化微调任务，主要的指标是每一步的 **reward** 指标。这些指标反映了你的模型在训练数据上的表现。它们由你在任务配置中定义的评分器计算得出。这两个相互独立的顶层 reward 指标分别是：

- `train_reward_mean`: 当前步骤中从所有数据点采样的平均奖励。由于每个批次中的具体数据点会随步骤变化, `train_reward_mean` 不同步骤之间的数值无法直接比较，具体数值也会在各个步骤之间剧烈波动。
- `valid_reward_mean`: 在验证集所有数据点上采样的平均奖励，这是一个更稳定的指标。

![奖励指标图](https://cdn.openai.com/API/images/guides/RFT_Reward_Chart.png)

在 [训练指标](#training-metrics) 章节中查看所有训练指标的完整说明。

#### 暂停和恢复任务

若要在你的任务仅部分完成时评估模型的当前状态， **暂停** 该任务以停止训练过程并在当前步生成检查点。你可以使用此检查点在留出的测试集上评估模型。如果结果良好， **恢复** 该任务以从该检查点继续训练。更多信息请参阅 [暂停和恢复任务](#pausing-and-resuming-jobs).

#### Evals 集成

强化微调作业已与我们集成的 [evals 产品](https://developers.openai.com/api/docs/guides/evals)。当你创建一个强化微调作业时，会自动创建一个新的 eval 并与该作业关联。在执行验证步骤时，我们会将输入提示、模型输出和评分器输出合并，生成针对该步骤的 [eval 运行](https://developers.openai.com/api/docs/guides/evals#creating-an-eval-run) 。

如需了解更多关于 evals 集成的信息，请参阅下方 [附录](#evals-integration-details) 部分。

## 评估结果

在你的微调任务完成时，你应当已经能根据验证集上的平均奖励值，对模型表现有一个不错的判断。不过，模型有可能 _过拟合_ 训练数据，也可能学会了 [奖励作弊](https://en.wikipedia.org/wiki/Reward_hacking) ——也就是让你的评分器给出高分，但实际上并未真正答对。在部署模型之前，请在具有代表性的提示集合上检查其行为，以确保它符合你的预期。

要快速了解模型的行为，可以查看与微调任务相关的评估结果。具体而言，请重点关注针对最终训练步骤所运行的评估，以查看模型在训练结束时的行为。你也可以使用评估产品，将最终运行的评估与早期运行的评估进行比较，观察模型在整个训练过程中的行为变化。

### 试用你的微调模型

通过使用新优化的模型来评估它！当微调模型完成训练后，将其 ID 用于任一 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API，就像使用 OpenAI 基础模型一样。



在 Playground 中使用你的模型

    

1. 在控制台中前往你的微调任务 [仪表板](https://platform.openai.com/finetune).
1. 在右侧面板中，前往 **输出模型** 并复制模型 ID。它应以 `ft:…`
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



### 如需可使用检查点

Checkpoints 是在训练流程最终步骤之前创建的、你可以使用的模型。对于 RFT，OpenAI 会在每个验证步骤创建一个完整的模型 checkpoint，并保留分数最高的三个。 `valid_reward_mean` Checkpoints 可用于在训练流程中的不同节点评估模型，并比较不同步骤之间的表现。



在仪表板中查找 checkpoints

    

1. 前往 [微调仪表板](https://platform.openai.com/finetune).
1. 在左侧面板中，选择你要调查的作业。等待它成功完成。
1. 在右侧面板中，向下滚动到检查点列表。
1. 将鼠标悬停在任意检查点上，可看到在 Playground 中启动的链接。
1. 通过在 Playground 中对其进行提示来测试该检查点模型的行为。


  

  

    
查询 API 的检查点

    

1. 等待任务成功，你可以通过 [查询任务状态](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [查询检查点端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 并提供你的微调任务 ID，以访问该微调任务的模型检查点列表。
1. 找到 `fine_tuned_model_checkpoint` 字段，即可看到模型检查点的名称。
1. 使用该模型的方式与使用最终的微调模型完全相同。

checkpoint 对象包含 `metrics` 一些数据，可用于判断该模型的实用性。例如，响应如下所示：

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

每个 checkpoint 指定以下内容：

- `step_number`: 创建检查点时所处步数（其中每个 epoch 等于训练集样本数除以批量大小）
- `metrics`: 包含在创建该检查点对应步数时微调任务各指标的对象



## 安全检查

在投入生产环境之前，请查看并遵循以下安全信息。



### 我们如何评估安全性



一旦微调任务完成，我们会评估所得模型在 13 个不同安全类别下的行为。每个类别都代表了一个关键领域，如果控制不当，AI 输出可能会在这些领域造成潜在危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 骚扰内容，且包含针对任何目标的暴力或严重伤害。                                                                                                                                                             |
| hate                   | 基于种族、性别、族裔、宗教、国籍、性取向、残障状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、族裔、宗教、国籍、性取向、残障状况或种姓，针对目标群体的包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高敏感度数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指引的内容。诸如“如何入店行窃”的表述即属于此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞美或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自杀、割伤、饮食失调等自残行为，或提供实施此类行为的指导或建议的内容。                                                                         |
| self-harm/intent       | 表达正在进行或意图实施自杀、割伤、饮食失调等自残行为的内容。                                                                                           |
| 敏感内容              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 性/未成年人          | 涉及 18 岁以下未成年人的性内容。                                                                                                                                                                          |
| 性                 | 旨在引发性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。                                                                                |
| 暴力               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果在某个类别中有过多评估示例未通过，OpenAI 将阻止该微调模型部署。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的审核检查部分查看结果。







### 如何通过安全检查



除了查看微调任务对象中任何失败的安全检查之外，你还可以通过查询 [微调 API 事件端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list)。来获取哪些类别失败的详细信息。查找类型为 `moderation_checks` 的事件，以了解类别结果和强制执行的详情。这些信息可以帮助你缩小需要针对再训练和改进的类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 中包含了有助于识别需要补充训练数据的领域的规则和示例。

虽然这些评估涵盖了广泛的安全类别，但请对你的微调模型进行自己的评估，以确保它适用于你的用例。





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

强化微调作业会将每步训练指标发布为 [微调事件](https://developers.openai.com/api/reference/resources/fine_tuning)。通过 [API](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list) 提取这些指标，或在 [微调仪表板](https://platform.openai.com/finetune).

详细了解训练指标。



#### 完整训练指标示例



下面是一个来自真实强化微调任务的示例指标事件。该负载中的各个字段将在后续小节中介绍。

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



需要关注的关键指标是 `train_reward_mean` 和 `valid_reward_mean`，它们分别表示在训练数据集和验证数据集上由所有评分器评出的平均奖励。

此外，如果你使用了 [多评分器](https://developers.openai.com/api/reference/resources/graders) 配置，每个评分器的训练和验证奖励指标也会一并发布。这些指标包含在微调事件对象的 `event.data.scores` 对象中，每个评分器对应一个条目。每个评分器的指标有助于你了解模型在各个评分器上的表现，可以帮助你判断模型是否对某个评分器存在过拟合。

在微调仪表板中，各个评分器的指标会以独立图表的形式显示在整体 `train_reward_mean` 和 `valid_reward_mean` 指标图表下方。

![每个评分器的奖励指标图表](https://cdn.openai.com/API/images/guides/RFT_MultiReward_Chart.png)







#### 用量指标



推理模型的一个重要特征是它在响应提示之前所使用的推理 token 数量。通常，在训练过程中，模型会显著改变其响应提示所使用的平均推理 token 数量。这是模型正在根据奖励信号改变其行为的一个标志。模型可能学会使用更少的推理 token 来获得同样的奖励，也可能学会使用更多的推理 token 来获得更高的奖励。

你可以监控 `train_reasoning_tokens_mean` 和 `valid_reasoning_tokens_mean` 指标来观察模型随时间变化的行为。这些指标分别是模型在训练集和验证集中响应提示所使用的平均推理 token 数。你还可以在微调仪表板的“Reasoning Tokens”图表下查看平均推理 token 数。

![推理 Token 指标图表](https://cdn.openai.com/API/images/guides/RFT_ReasoningTokens_Chart.png)

如果你正在使用 [模型评分器](https://developers.openai.com/api/docs/guides/graders#model-graders)，你可能需要监控这些评分器的 token 使用量。每个评分器的 token 使用统计信息可在 `event.data.usage.graders` 对象下查看，具体细分为：

- `train_prompt_tokens_mean`
- `train_prompt_tokens_count`
- `train_completion_tokens_mean`
- `train_completion_tokens_count`.

该 `_mean` 指标表示评分器在当前步骤中处理所有提示所使用的平均 token 数，而 `_count` 指标表示评分器在当前步骤中跨所有样本所使用的 token 总数。每步 token 使用量也会在微调仪表板的“Grading Token Usage”图表下显示。

![模型评分器 Token 使用量](https://cdn.openai.com/API/images/guides/RFT_ModelGraderTokenUsage.png)







#### Timing 指标



我们提供了多项指标，帮助你了解训练过程中每一步所花费的时间，以及训练过程中不同部分对每步时间的贡献。

这些指标可在 `event.data.timing` 对象下获取，并细分为 `step` 和 `graders` 字段。

该 `step` 字段包含以下指标：

- `sampling`: 当前步骤中对模型输出（rollouts）进行采样所花费的时间。
- `training`: 当前步骤中训练模型（反向传播）所花费的时间。
- `eval`: 在完整验证集上评估模型所花费的时间。
- `full_iteration`: 当前步骤花费的总时间，包括上述 3 项指标以及任何额外的开销。

步时指标也会显示在微调仪表板的 "Per Step Duration" 图表中。

![Per Step Duration Graph](https://cdn.openai.com/API/images/guides/RFT_PerStepDuration2.png)

该 `graders` 字段包含计时信息，详细说明了执行当前步骤中每个评分器所花费的时间。每个评分器在 `train_execution_latency_mean` 和 `valid_execution_latency_mean` 指标下都有其各自的计时，分别表示在训练集和验证集上执行该评分器所需的平均时间。

评分器是并行执行的，并发数量有限，因此单个评分器的延迟如何叠加为评分过程的总耗时并不总是清晰可辨。但一般来说，单个评分器执行时间越长，任务执行就越慢。这意味着较慢的模型评分器会导致任务完成时间变长，更复杂的 Python 代码也会产生同样的效果。执行最快的评分器通常是 `string_check` 和 `text_similarity` 因为它们是在训练循环本地执行的。





### Evals 集成详情

强化微调任务与我们提供的 [evals 产品](https://developers.openai.com/api/docs/guides/evals)。直接集成。当你创建一个强化微调任务时，会自动创建一个新的评估，并与该任务关联。

在执行验证步骤时，输入提示、模型采样结果、评分器输出以及其他元数据将被组合起来，为该步骤生成一个新的 [eval 运行](https://developers.openai.com/api/docs/guides/evals#creating-an-eval-run) 。在任务结束时，每个验证步骤都将对应一次运行。这使你能够比较模型在不同步骤下的表现，并查看模型行为在整个训练过程中的变化情况。

你可以通过在微调仪表板上查看任务，或通过查找 `eval_id` 字段（在 [微调任务对象](https://developers.openai.com/api/reference/resources/fine_tuning).

评估产品可用于检查模型在特定数据点上的输出，从而了解模型在不同场景下的行为。它可以帮助你找出模型表现较差的数据切片，进而帮助你识别训练数据中可以改进的地方。

评估产品还可以通过找出评分器对模型输出过于宽松或过于严苛的地方，帮助你发现评分器的可改进之处。

### 暂停和恢复任务

你可以随时通过使用 [微调任务 API](https://developers.openai.com/api/reference/resources/fine_tuning)。来暂停微调任务。调用暂停 API 将指示训练过程创建一个新的模型快照，停止训练，并将任务置于“已暂停”状态。该模型快照将经过常规安全审查，之后即可在 OpenAI 平台上作为普通的微调模型供你使用。

如果你希望继续已暂停任务的训练过程，可以通过使用 [微调任务 API](https://developers.openai.com/api/reference/resources/fine_tuning)。来实现。这将从任务暂停时创建的最后一个检查点恢复训练过程，并继续训练直到任务完成或再次被暂停。

### 使用工具进行评分

如果你正在训练你的模型以 [执行工具调用](https://developers.openai.com/api/docs/guides/function-calling)，你需要：

1. 为你的模型提供一组可供其调用的工具，以便在 RFT 训练数据集中的每个数据点上使用。更多信息请参阅 [数据集 API 参考](https://developers.openai.com/api/reference/resources/fine_tuning).
2. 配置你的评分器，根据模型所进行的工具调用的内容来分配奖励。关于工具调用评分的信息，请参阅 [评分文档](https://developers.openai.com/api/docs/guides/graders/#sample-namespace)

### 账单详情

强化微调任务根据训练所花费的时间以及模型在训练过程中使用的 token 数量计费。我们仅对核心训练循环所花费的时间计费，不包括准备训练数据、验证数据集、排队等待、运行安全评估或其他开销所花费的时间。

有关我们如何对强化微调任务进行具体计费的详细信息，请参阅这篇 [帮助中心文章](https://help.openai.com/en/articles/11323177-billing-guide-for-the-reinforcement-fine-tuning-api).

### 训练错误

强化微调是一个复杂的过程，涉及众多环节，其中许多地方都可能出现错误。我们发布了多种错误指标，帮助你了解任务中出现了什么问题以及如何修复。一般来说，除非发生非常严重的错误，我们尽量避免让任务完全失败。当错误确实发生时，通常出现在评分阶段。评分阶段的错误通常由以下原因导致：模型输出的样本评分器无法处理、评分器因某种系统错误而无法正确执行，或评分逻辑本身存在 bug。

错误指标可在 `event.data.errors` 对象中查看，并按评分器汇总为计数和比率。我们还会在微调仪表板上显示错误的比率和计数。



#### 评分器错误



#### 通用评分错误

评分器错误按以下类别分类，两种版本中都存在 `train_` （用于训练数据）和 `valid_` （用于验证数据）版本：

- `sample_parse_error_mean`: 无法正确解析的样本的平均数量。这通常发生在模型未能输出有效的 JSON 或未正确遵循所提供的响应格式时。在训练过程早期出现少量此类错误是正常的。如果出现大量此类错误，很可能是模型的响应格式配置不正确，或你的评分器配置错误并查找了错误的字段。
- `invalid_variable_error_mean`: 当你尝试通过模板引用一个在当前数据点或当前模型样本中都找不到的变量时，就会发生这些错误。这可能是因为模型未能以正确的响应格式提供输出，或者你的 grader 配置错误。
- `other_error_mean`: 这是评分过程中发生的任何其他错误的兜底分类。这些错误通常是由评分逻辑本身的 bug，或评分过程中发生的系统错误引起的。

#### Python 评分错误

- `python_grader_server_error_mean`: 这些错误发生在我们在远程沙箱中执行 python 评分器的系统出现系统错误时。通常是由于你无法控制的原因造成的，例如网络故障或系统中断。如果你看到大量此类错误，很可能是某个系统问题导致了这些错误。你可以查看 [OpenAI 状态页面](https://status.openai.com/) 以获取有关任何正在进行的持续问题的更多信息。
- `python_grader_runtime_error_mean`: 这些错误发生在 python 评分器本身无法正常执行时。可能由多种原因造成，包括评分逻辑中的错误，或评分器尝试访问当前上下文中不存在的变量。如果你看到大量此类错误，很可能是你的评分逻辑中存在需要修复的错误。如果此类错误达到足够多的数量，任务将会失败，并且我们会向你展示失败评分器的部分追踪回溯样本。

#### 模型评分错误

- `model_grader_server_error_mean`: 这些错误发生在我们无法从模型评分器采样时。可能由多种原因引起，但通常意味着模型评分器配置错误、你正在尝试使用组织不可用的模型，或者 OpenAI 端发生了系统问题。