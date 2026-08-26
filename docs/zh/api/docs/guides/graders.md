# 评分器

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后附加 `.md` 来获取文档页面的 Markdown 版本。

Grader 是一种根据参考答案评估模型性能的方式。我们的 [graders API](https://developers.openai.com/api/reference/resources/graders) 是一种用来测试你的 grader、试验结果并改进你的微调或评估框架以获得所需结果的方式。

OpenAI 正在弃用 grader，作为其支持的 evals 和微调工作流的一部分
  。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解
  当前的过渡时间表。

## 概述

评分器可让你将参考答案与模型生成的对应答案进行比较，并返回0到1范围内的评分。有时，给模型的答案部分得分（而非非此即彼的0或1）会更有帮助。

评分器以JSON格式指定，有几种类型：

- [字符串检查](#string-check-graders)
- [文本相似度](#text-similarity-graders)
- [评分模型评判器](#score-model-graders)
- [Python 代码执行](#python-graders)

在强化微调中，你可以通过使用以下方式来嵌套和组合评分器 [`multigrader` 对象](#combined-graders).

使用本指南了解每种评分器类型并查看入门示例。要构建评分器并开始强化微调，请参阅 [RFT 指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。或者要开始评估，请参阅 [评估指南](https://developers.openai.com/api/docs/guides/evals).

## 模板化

某些评估器的输入使用模板语法，以便用相同配置评估多个示例。任何包含 `{{ }}` 双花括号的字符串都将被替换为变量值。

每个位于 `{{}}` 内的输入必须包含一个 _namespace_ 和一个 _variable_ ，格式如下 `{{ namespace.variable }}`。仅支持的 namespace 值为 `item` 和 `sample`.

所有嵌套变量都可以使用类似 JSON 路径的语法进行访问。

### 项命名空间

item 命名空间将使用来自输入数据源的变量填充，用于评估，以及来自每个数据集项用于微调。例如，如果某行包含以下内容

```json
{
  "reference_answer": "..."
}
```

这可以在评分器中使用，例如 `{{ item.reference_answer }}`.

### 示例命名空间

在评估或微调步骤期间，示例命名空间将填充来自模型采样步骤的变量。包含以下变量

- `output_text`，模型输出的内容为字符串。
- `output_json`，模型输出的内容为 JSON 对象，仅当 `response_format` 包含在样本中时。
- `output_tools`，模型输出 `tool_calls`，其结构与 [聊天补全 API](https://developers.openai.com/api/reference/resources/chat).
- `choices`，输出选项，其结构与 [聊天补全 API](https://developers.openai.com/api/reference/resources/chat).
- `output_audio`，模型音频输出对象，包含 Base64 编码的 `data` 以及一个 `transcript`.

例如，要以字符串形式访问模型输出内容， `{{ sample.output_text }}` 可以在评分器中使用。

关于工具调用评分的详情

在训练模型以改进工具调用行为时，你需要编写评分器来操作 `sample.output_tools` 变量。该变量的内容将与 `response.choices[0].message.tool_calls` ([参见函数调用文档](https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat)).

一种常见的工具调用评分方法是使用两个评分器，一个检查被调用工具的名称，另一个检查被调用函数的参数。下面显示了一个执行此操作的评分器示例：

```json
{
  "type": "multi",
  "graders": {
    "function_name": {
      "name": "function_name",
      "type": "string_check",
      "input": "get_acceptors",
      "reference": "{{sample.output_tools[0].function.name}}",
      "operation": "eq"
    },
    "arguments": {
      "name": "arguments",
      "type": "string_check",
      "input": "{\"smiles\": \"{{item.smiles}}\"}",
      "reference": "{{sample.output_tools[0].function.arguments}}",
      "operation": "eq"
    }
  },
  "calculate_output": "0.5 * function_name + 0.5 * arguments"
}
```

这是一个 `multi` 评分器，它结合了两个简单的 `string_check` 评分器，第一个通过 `sample.output_tools[0].function.name` 变量检查被调用工具的名称，第二个通过 `sample.output_tools[0].function.arguments` 变量检查被调用函数的参数。 `calculate_output` 字段用于将两个分数合并为一个分数。

该 `arguments` 如果函数参数略有不正确，比如提交了 `1` 而不是浮点数 `1.0`，或者州名以缩写而非全称给出，那么评分器容易对模型奖励不足。为了避免这种情况，你可以使用 `text_similarity` 评分器而不是 `string_check` 评分器，或使用 `score_model` 评分器让 LLM 检查语义相似性。

## 字符串检查评分器

使用这些基础字符串操作来返回 0 或 1。字符串检查评分器适用于评判简单的通过或失败答案——例如，城市的正确名称、是或否的回答，或包含或以正确信息开头的答案。

```json
{
    "type": "string_check",
    "name": string,
    "operation": "eq" | "ne" | "like" | "ilike",
    "input": string,
    "reference": string,
}
```

字符串检查评分器支持的操作有：

- `eq`：如果输入与参考匹配（区分大小写），则返回 1，否则返回 0
- `neq`：如果输入与参考不匹配（区分大小写），则返回 1，否则返回 0
- `like`：如果输入包含参考内容（区分大小写），则返回 1，否则返回 0
- `ilike`：如果输入包含参考内容（不区分大小写），则返回 1，否则返回 0

## 文本相似度评分器

使用文本相似度评估器来评估模型生成的输出与参考内容的接近程度，并使用各种评估框架进行评分。

这对于开放式文本响应非常有用。例如，如果你的数据集包含专家以段落形式提供的参考答案，那么以数值形式查看模型生成的答案与该内容的接近程度会很有帮助。

```json
{
    "type": "text_similarity",
    "name": string,
    "input": string,
    "reference": string,
    "pass_threshold": number,
    "evaluation_metric": "fuzzy_match" | "bleu" | "gleu" | "meteor" | "cosine" | "rouge_1" | "rouge_2" | "rouge_3" | "rouge_4" | "rouge_5" | "rouge_l"
}
```

支持的操作 `string-similarity-grader` 包括：

- `fuzzy_match`: 使用模糊字符串匹配计算输入与参考之间的匹配度 `rapidfuzz`
- `bleu`: 计算输入与参考之间的 BLEU 分数
- `gleu`: 计算输入与参考之间的 Google BLEU 分数
- `meteor`: 计算输入与参考之间的 METEOR 分数
- `cosine`: 使用嵌入后的输入与参考计算余弦相似度，使用 `text-embedding-3-large`。仅适用于评估。
- `rouge-*`: 计算输入与参考之间的 ROUGE 分数

## 模型评估器

一般来说，使用模型评分意味着提示一个独立的模型来为正在微调的模型的输出评分。你的两个模型协同工作以进行强化微调。 _评分模型_ 评估 _训练模型_.

### 评分模型评估器

评分模型评分器将获取输入，并根据提示在给定范围内返回一个数值分数。

```json
{
    "type": "score_model",
    "name": string,
    "input": Message[],
    "model": string,
    "pass_threshold": number,
    "range": number[],
    "sampling_params": {
        "seed": number,
        "top_p": number,
        "temperature": number,
        "max_completions_tokens": number,
        "reasoning_effort": "minimal" | "low" | "medium" | "high"
    }
}
```

其中每条消息的形式如下：

```json
{
    "role": "system" | "developer" | "user" | "assistant",
    "content": str
}

```

要使用评分模型评分器，输入是一个聊天消息列表，每条消息包含 `role` 和 `content`。评分器的输出将被截断到给定的 `range`，并且对于所有非数值输出，默认值为 0。
在每条消息中，可以使用与其他常见评分器相同的模板来引用真实标签或模型样本。

以下是一个完整的可运行代码示例：

```python
import os
import requests

# get the API key from environment
api_key = os.environ["OPENAI_API_KEY"]
headers = {"Authorization": f"Bearer {api_key}"}

# Define a score-model grader.
grader = {
    "type": "score_model",
    "name": "my_score_model",
    "input": [
        {
            "role": "system",
            "content": "You are an expert grader. If the reference and model answer are exact matches, output a score of 1. If they are somewhat similar in meaning, output a score in 0.5. Otherwise, give a score of 0.",
        },
        {
            "role": "user",
            "content": "Reference: {{ item.reference_answer }}. Model answer: {{ sample.output_text }}",
        },
    ],
    "pass_threshold": 0.5,
    "model": "o4-mini-2025-04-16",
    "range": [0, 1],
    "sampling_params": {
        "max_completions_tokens": 32768,
        "top_p": 1,
        "reasoning_effort": "medium",
    },
}

# validate the grader
payload = {"grader": grader}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/validate",
    json=payload,
    headers=headers,
)
print("validate response:", response.text)

# run the grader with a test reference and sample
payload = {"grader": grader, "item": {"reference_answer": 1.0}, "model_sample": "0.9"}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/run",
    json=payload,
    headers=headers,
)
print("run response:", response.text)
```


#### 评分模型评估器输出

在底层， `score_model` 评分器将使用提供的提示和采样参数查询所请求的模型，并请求以特定响应格式进行响应。所使用的响应格式如下所示

```json
{
  "result": float,
  "steps": ReasoningStep[],
}
```

其中每个推理步骤的形式为

```json
{
    description: string,
    conclusion: string
}
```

这种格式不仅要求模型返回查询的数值 `result` （即查询的奖励值），还为模型提供了一些空间来思考评分背后的推理。在编写评分器提示时，明确地引用这两个字段的名称可能会很有用（例如，“在推理步骤的结论中包含分子中存在的化学键类型的推理”，或“如果输入不满足条件X，则返回−1.0的 `result` 字段值”）。

### 模型评分器约束

- 仅以下模型支持 `model` 参数
  - `gpt-4o-2024-08-06`
  - `gpt-4o-mini-2024-07-18`
  - `gpt-4.1-2025-04-14`
  - `gpt-4.1-mini-2025-04-14`
  - `gpt-4.1-nano-2025-04-14`
  - `o1-2024-12-17`
  - `o3-mini-2025-01-31`
  - `o3-2025-04-16`
  - `o4-mini-2025-04-16`
- `temperature` 推理模型不支持更改。
- `reasoning_effort` 非推理模型不支持。

### 如何编写评分提示词

编写评分器提示词是一个迭代过程。在模型评分器提示词上进行迭代的最佳方式是创建模型评分器评估。为此，你需要：

1. **任务提示词**：为目标任务编写高度详细的提示词，包含逐步说明以及上下文中许多具体示例。
1. **由模型或人类专家生成的答案**：提供大量高质量的答案示例，既包括模型生成的，也包括可信人类专家提供的。
1. **这些答案对应的地面实况评分**：明确何为良好评分。例如，你的专家评分应为 1。

然后，你可以自动评估模型评分器区分不同质量水平答案的有效性。随着时间推移，在你发现边缘情况并通过修改提示词进行修补时，将它们添加到模型评分器的评估中。

例如，假设你从人类专家那里知道哪些答案是最好的：

```
answer_1 > answer_2 > answer_3
```

验证模型评分器的答案是否与此一致：

```
model_grader(answer_1, reference_answer) > model_grader(answer_2, reference_answer) > model_grader(answer_3, reference_answer)
```

### 评分器做手脚

正在训练的模型有时会学会利用模型评分器的弱点，这被称为“评分器攻击”或“奖励攻击”。你可以通过检查模型在模型评分器评估和专家人工评估中的表现来检测这一点。攻击了评分器的模型在模型评分器评估中得分很高，但在专家人工评估中得分很低。随着时间的推移，我们打算改进API中的可观测性，以便在训练过程中更容易检测到这种情况。

## Python 评分器

该评分器允许你执行任意 Python 代码来对模型输出进行评分。评分器要求存在一个评分函数，该函数接受两个参数并输出一个浮点值。任何其他结果（异常、无效的浮点值等）都将被标记为无效并返回 0 分。

```json
{
  "type": "python",
  "source": "def grade(sample, item):\n    return 1.0",
  "image_tag": "2025-05-08"
}
```

Python 源代码必须包含一个评分函数，该函数恰好接受两个参数并返回一个浮点值作为评分。

```python
from typing import Any


def grade(sample: dict[str, Any], item: dict[str, Any]) -> float:
    # your logic here
    return 1.0
```


提供给评分函数的第一个参数是一个字典，其中包含训练期间模型的输出，供你评分。 `output_json` 仅在输出使用 `response_format`.

```json
{
    "choices": [...],
    "output_text": "...",
    "output_json": {},
    "output_tools": [...],
    "output_audio": {}
}
```

提供的第二个参数是一个包含输入评分上下文的字典。对于评估（evals），这将包含来自数据源的键。对于微调，这将包含来自每个训练数据行的键。

```json
{
    "reference_answer": "...",
    "my_key": {...}
}
```

以下是一个可用的示例：

```python
import os
import requests

# get the API key from environment
api_key = os.environ["OPENAI_API_KEY"]
headers = {"Authorization": f"Bearer {api_key}"}

grading_function = """
from rapidfuzz import fuzz, utils

def grade(sample, item) -> float:
    output_text = sample["output_text"]
    reference_answer = item["reference_answer"]
    return fuzz.WRatio(output_text, reference_answer, processor=utils.default_process) / 100.0
"""

# Define a Python grader.
grader = {"type": "python", "source": grading_function}

# validate the grader
payload = {"grader": grader}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/validate",
    json=payload,
    headers=headers,
)
print("validate request_id:", response.headers["x-request-id"])
print("validate response:", response.text)

# run the grader with a test reference and sample
payload = {
    "grader": grader,
    "item": {"reference_answer": "fuzzy wuzzy had no hair"},
    "model_sample": "fuzzy wuzzy was a bear",
}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/run",
    json=payload,
    headers=headers,
)
print("run request_id:", response.headers["x-request-id"])
print("run response:", response.text)
```


**提示：**
如果你不想手动将评分函数放在字符串中，你也可以使用 `importlib` 和 `inspect`。从 Python 文件中加载它。例如，如果你的评分函数位于名为 `grader.py`，的文件中，你可以这样操作：

```python
import importlib
import inspect

grader_module = importlib.import_module("grader")
grader = {"type": "python", "source": inspect.getsource(grader_module)}
```


这将自动使用你的 `grader.py` 文件的整个源代码作为评分器，这对于较长的评分器可能会很有帮助。

### 技术约束

- 你上传的代码必须小于 `256kB` 且无法访问网络。
- 评分执行本身限制在 2 分钟内。
- 运行时你将获得 2Gb 内存和 1Gb 磁盘空间的使用限制。
- CPU 核心数限制为 2 核——超过此用量将导致限流

对于该镜像标签，以下第三方包在执行时可用： `2025-05-08`

```
numpy==2.2.4
scipy==1.15.2
sympy==1.13.3
pandas==2.2.3
rapidfuzz==3.10.1
scikit-learn==1.6.1
rouge-score==0.1.2
deepdiff==8.4.2
jsonschema==4.23.0
pydantic==2.10.6
pyyaml==6.0.2
nltk==3.9.1
sqlparse==0.5.3
rdkit==2024.9.6
scikit-bio==0.6.3
ast-grep-py==0.36.2
```

此外，以下 NLTK 语料库可用：

```
punkt
stopwords
wordnet
omw-1.4
names
```

## 组合评分器

> 目前，该评分器仅用于强化微调

一个 `multigrader` 对象将多个评分器的输出合并为单个分数。组合评分器会计算其他评分器对象各字段的评分，并将这些子评分转换为总体评分。当正确答案依赖于多个条件同时成立时，这非常有用——例如，文本相似 _且_ 答案包含特定字符串。

例如，假设你希望模型输出包含以下两个字段的 JSON：

```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com"
}
```

你希望评分器比较这两个字段，然后取它们之间的平均值。

你可以通过将多个评分器组合成对象评分器，然后定义公式根据每个字段计算输出分数来实现：

```json
{
  "type": "multi",
  "graders": {
    "name": {
      "name": "name_grader",
      "type": "text_similarity",
      "input": "{{sample.output_json.name}}",
      "reference": "{{item.name}}",
      "evaluation_metric": "fuzzy_match",
      "pass_threshold": 0.9
    },
    "email": {
      "name": "email_grader",
      "type": "string_check",
      "input": "{{sample.output_json.email}}",
      "reference": "{{item.email}}",
      "operation": "eq"
    }
  },
  "calculate_output": "(name + email) / 2"
}
```

在此示例中，模型准确获取电子邮件非常重要（`string_check` 返回 0 或 1），但我们可以容忍姓名上的一些拼写错误（`text_similarity` 返回 0 到 1 的范围）。电子邮件错误的样本得分将在 0-0.5 之间，电子邮件正确的样本得分将在 0.5-1.0 之间。

你不能将一个 `multigrader` 嵌套在另一个内部。

calculate 输出字段将包含输入 `graders` 的键作为可能的变量，并支持以下功能：

**运算符**

- `+` （加法）
- `-` （减法）
- `*` （乘法）
- `/` （除法）
- `^` （乘方）

**函数**

- `min`
- `max`
- `abs`
- `floor`
- `ceil`
- `exp`
- `sqrt`
- `log`

## 限制与提示

设计和创建评分器是一个迭代过程。从小处着手，进行实验，并持续做出更改以获得更好的结果。

### 设计提示

要从评分器中获取最大价值，请遵循以下设计原则：

- **生成平滑的评分，而不是简单的通过/失败标记**。评分应随答案改进而逐渐变化，这有助于优化器识别哪些更改重要。
- **防范奖励作弊（reward hacking）**。当模型找到无需真实技能即可获得高分的捷径时，就会发生这种情况。要增加你的评分系统的漏洞利用难度。
- **避免数据偏差**。在数据集中，如果某个标签频繁出现，模型就会倾向于猜测该标签。平衡数据集或提高罕见案例的权重，迫使模型进行思考。
- **当代码评分不适用时，使用 LLM 作为评判者**。对于内容丰富、开放式答案，请让另一个语言模型进行评分。构建 LLM 评判器时，请通过你的 LLM 评判器运行多个候选答案和标准答案，以确保评分稳定且符合偏好。在提示中提供优秀、一般和较差答案的少样本示例。