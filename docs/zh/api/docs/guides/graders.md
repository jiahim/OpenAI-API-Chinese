# Graders

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

Graders 是一种根据参考答案评估模型表现的方式。我们的 [评分器 API](https://developers.openai.com/api/reference/resources/graders) 提供了一种测试评分器、试验结果并改进微调或评估框架以获得你想要的结果的方式。

OpenAI 正在弃用评分器，作为评估与微调工作流的一部分
  它们所支持的。具体参见 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解当前的
  过渡时间表。

## 概述

评分器允许你将参考答案与相应的模型生成答案进行比较，并返回一个介于 0 到 1 之间的评分。有时，与其给出二元的 0 或 1，给模型部分分数会更有用。

评分器以 JSON 格式指定，并且有多种类型：

- [字符串检查](#string-check-graders)
- [文本相似度](#text-similarity-graders)
- [评分模型评判器](#score-model-graders)
- [Python 代码执行](#python-graders)

在强化微调中，你可以通过使用 [`multigrader` 对象](#combined-graders).

使用本指南了解每种评分器类型并查看入门示例。要构建评分器并开始强化微调，请参阅 [RFT 指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。或者要开始使用评估，请参阅 [Evals 指南](https://developers.openai.com/api/docs/guides/evals).

## 模板

某些评分器的输入使用模板语法，以便使用相同配置对多个示例进行评分。任何包含 `{{ }}` 双花括号的字符串都会被替换为变量值。

内的每个输入必须包含一个 `{{}}` 必须包含一个 _namespace_ 和一个 _variable_ ，格式如下 `{{ namespace.variable }}`。唯一受支持的命名空间值为 `item` 和 `sample`.

所有嵌套变量都可以使用类似 JSON 路径的语法访问。

### 项目命名空间

项目命名空间将根据输入数据源（用于评估）或每个数据集项目（用于微调）填充变量。例如，如果某一行包含以下内容

```json
{
  "reference_answer": "..."
}
```

这可以在评分器中用作 `{{ item.reference_answer }}`.

### 示例命名空间

该示例命名空间将在 evals 或微调步骤中，由模型采样步骤填充变量。其中包含以下变量

- `output_text`，模型输出内容以字符串形式呈现。
- `output_json`，模型输出内容以 JSON 对象形式呈现，仅当 `response_format` 包含在样本中时。
- `output_tools`，模型输出 `tool_calls`，其结构与 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `choices`，中的输出工具调用相同，输出选项的结构与 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `output_audio`，中的输出选项相同，模型音频输出对象包含 Base64 编码的 `data` 以及一个 `transcript`.

例如，要以字符串形式访问模型输出内容， `{{ sample.output_text }}` 可在评分器内使用。



#### 工具调用评分详情



在训练模型以改进工具调用行为时，你需要编写评测器来对 `sample.output_tools` 变量进行操作。该变量的内容将与 `response.choices[0].message.tool_calls` ([参见函数调用文档](https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat)).

对工具调用进行评分的一种常见方式是使用两个评测器：一个检查所调用工具的名称，另一个检查被调用函数的参数。下面展示了一个执行此操作的评测器示例：

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

这是一个 `multi` 评测器，它组合了两个简单的 `string_check` 评测器，第一个通过 `sample.output_tools[0].function.name` 变量检查被调用工具的名称，第二个通过 `sample.output_tools[0].function.arguments` 变量检查被调用函数的参数。 `calculate_output` 字段用于将两个评分合并为单个评分。

该 `arguments` 评测器在函数参数存在细微错误时容易对模型奖励不足，例如当提交的 `1` 是字符串而不是浮点数 `1.0`，或者州名使用了缩写而非完整拼写。为避免这种情况，你可以使用 `text_similarity` 评测器代替 `string_check` 评测器，或者使用 `score_model` 评测器让 LLM 检查语义相似性。





## 字符串检查评分器

使用这些基本字符串操作来返回 0 或 1。字符串检查评分器非常适合对简单的对错类答案进行评分——例如，正确的城市名、是或否的答案，或包含或以正确信息开头的答案。

```json
{
    "type": "string_check",
    "name": string,
    "operation": "eq" | "ne" | "like" | "ilike",
    "input": string,
    "reference": string,
}
```

string-check-grader 支持的操作包括：

- `eq`: 如果输入与参考文本完全匹配（区分大小写），则返回 1，否则返回 0
- `neq`: 如果输入与参考文本不匹配（区分大小写），则返回 1，否则返回 0
- `like`: 如果输入包含参考文本（区分大小写），则返回 1，否则返回 0
- `ilike`: 如果输入包含参考文本（不区分大小写），则返回 1，否则返回 0

## 文本相似度评分器

使用文本相似度评分器来评估模型生成的输出与参考答案之间的接近程度，并通过各种评估框架进行打分。

这对于开放式文本回答非常有用。例如，如果你的数据集中包含专家以段落形式给出的参考答案，那么以数值形式查看模型生成的答案与该内容的接近程度会很有帮助。

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

- `fuzzy_match`: 使用模糊字符串匹配输入与参考 `rapidfuzz`
- `bleu`: 计算输入与参考之间的 BLEU 分数
- `gleu`: 计算输入与参考之间的 Google BLEU 分数
- `meteor`: 计算输入与参考之间的 METEOR 分数
- `cosine`: 使用嵌入后的输入与参考计算余弦相似度，使用 `text-embedding-3-large`。仅在 evals 中可用。
- `rouge-*`: 计算输入与参考之间的 ROUGE 分数

## 模型评分器

通常，使用模型评分器意味着提示一个单独的模型来对你正在微调的模型的输出进行评分。你的两个模型协同工作以完成强化微调。该 _评分器模型_ 对 _训练模型_.

### 评分模型评估器

评分模型评估器将接收输入，并根据提示返回给定范围内的数值分数。

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

其中每条消息均采用以下形式：

```json
{
    "role": "system" | "developer" | "user" | "assistant",
    "content": str
}

```

要使用评分模型评估器，输入应为聊天消息列表，每条消息包含一个 `role` 和 `content`。评估器的输出将截断为给定的 `range`，所有非数值输出均默认为 0。
在每条消息中，均可使用与其他通用评估器相同的模板来引用标准答案或模型样例。

下面是一个完整可运行的代码示例：

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


#### 评分模型评分器输出

在底层， `score_model` 评分器将使用提供的提示和采样参数查询所请求的模型，并以特定的响应格式请求响应。使用的响应格式如下

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

此格式不仅向模型查询 `result` （即查询的奖励值），还为模型提供一些空间来思考分数背后的推理过程。在编写评分器提示时，可能需要显式地按名称引用这两个字段（例如，“在推理步骤的结论中包含关于分子中存在的化学键类型的推理”，或者“如果输入不满足条件 X，则在 `result` 字段中返回值 −1.0”）。

### 模型评分器约束

- 以下模型支持 `model` 参数
  - `gpt-4o-2024-08-06`
  - `gpt-4o-mini-2024-07-18`
  - `gpt-4.1-2025-04-14`
  - `gpt-4.1-mini-2025-04-14`
  - `gpt-4.1-nano-2025-04-14`
  - `o1-2024-12-17`
  - `o3-mini-2025-01-31`
  - `o3-2025-04-16`
  - `o4-mini-2025-04-16`
- `temperature` 不支持推理模型的更改。
- `reasoning_effort` 不支持非推理模型。

### 如何编写评分提示词

编写评分提示是一个迭代过程。对模型评分提示进行迭代的最佳方式是创建一个模型评分评估。为此，你需要：

1. **任务提示**：为期望的任务编写极其详细的提示，包含分步说明以及大量具体的上下文示例。
1. **由模型或人类专家生成的答案**：提供大量高质量的答案示例，既包括模型生成的，也包括可信赖的人类专家提供的。
1. **这些答案对应的真实评分**：明确什么是良好的评分。例如，你的人类专家评分应当达到 1。

然后你可以自动评估模型评分器区分不同质量等级答案的有效性。随着你发现并通过修改 prompt 来修复边缘情况，可以将它们逐步加入模型评分器评估中。

例如，假设你从人类专家那里已知哪些答案是最好的：

```
answer_1 > answer_2 > answer_3
```

验证模型评分器的答案是否与之相符：

```
model_grader(answer_1, reference_answer) > model_grader(answer_2, reference_answer) > model_grader(answer_3, reference_answer)
```

### 评分器破解

正在训练的模型有时会学会利用模型评分器的弱点,这也被称为“评分器作弊”或“奖励作弊”。你可以通过检查模型在模型评分器评估和专家人工评估中的表现来检测这种情况。被评分器欺骗的模型在模型评分器评估中得分较高,但在专家人工评估中得分较低。随着时间的推移,我们打算改进 API 中的可观测性,以便在训练期间更容易检测到这种情况。

## Python 评分器

该评分器允许你执行任意 Python 代码来对模型输出进行评分。该评分器要求存在一个 grade 函数，该函数接收两个参数并输出一个 float 值。任何其他结果（异常、无效的 float 值等）都将被标记为无效，并返回 0 分。

```json
{
  "type": "python",
  "source": "def grade(sample, item):\n    return 1.0",
  "image_tag": "2025-05-08"
}
```

Python 源代码必须包含一个 grade 函数，该函数恰好接收两个参数，并返回一个 float 值作为评分。

```python
from typing import Any


def grade(sample: dict[str, Any], item: dict[str, Any]) -> float:
    # your logic here
    return 1.0
```


传递给评分函数的第一个参数将是一个字典，其中包含训练期间模型输出的内容，供你进行评分。 `output_json` 仅当输出使用了 `response_format`.

```json
{
    "choices": [...],
    "output_text": "...",
    "output_json": {},
    "output_tools": [...],
    "output_audio": {}
}
```

传递给评分函数的第二个参数是一个字典，其中包含评分输入上下文。对于 evals，这将包含来自数据源的键。对于微调，这将包含来自每个训练数据行的键。

```json
{
    "reference_answer": "...",
    "my_key": {...}
}
```

下面是一个可运行的示例：

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
如果你不想手动将评分函数放入字符串中，也可以使用 `importlib` 和 `inspect`。从 Python 文件加载。例如，如果你的评分函数位于一个名为 `grader.py`，的文件中，你可以这样做：

```python
import importlib
import inspect

grader_module = importlib.import_module("grader")
grader = {"type": "python", "source": inspect.getsource(grader_module)}
```


这将自动使用你的 `grader.py` 文件的全部源代码作为评分器，这对于较长的评分器非常有用。

### 技术约束

- 你上传的代码必须小于 `256kB` ，并且无法访问网络。
- 评分执行本身限制为 2 分钟。
- 运行时你将获得 2GB 内存和 1GB 磁盘空间的使用上限。
- CPU 核心数限制为 2 核——超出此使用量将导致限流

以下第三方包在执行时可用于图像标签 `2025-05-08`

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

> 目前，此评分器仅用于强化微调

一个 `multigrader` object combines the output of multiple graders to produce a single score. Combined graders compute grades over the fields of other grader objects and turn those sub-grades into an overall grade. This is useful when a correct answer depends on multiple things being true—for example, that the text is similar _和_ that the answer contains a specific string.

As an example, say you wanted the model to output JSON with the following two fields:

```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com"
}
```

You'd want your grader to compare the two fields and then take the average between them.

You can do this by combining multiple graders into an object grader, and then defining a formula to calculate the output score based on each field:

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

In this example, it’s important for the model to get the email exactly right (`string_check` returns either 0 or 1) but we tolerate some misspellings on the name (`text_similarity` returns range from 0 to 1). Samples that get the email wrong will score between 0-0.5, and samples that get the email right will score between 0.5-1.0.

You cannot nest one `multigrader` inside another.

The calculate output field will have the keys of the input `graders` as possible variables and the following features are supported:

**Operators**

- `+` （加法）
- `-` （减法）
- `*` （乘法）
- `/` （除法）
- `^` （乘方）

**Functions**

- `min`
- `max`
- `abs`
- `floor`
- `ceil`
- `exp`
- `sqrt`
- `log`

## 限制与建议

设计和创建评分器是一个迭代过程。可以先从一个小的版本开始，进行试验，并持续修改以获得更好的效果。

### 设计技巧

为了从评分器中获得最大价值，请遵循以下设计原则：

- **产出平滑的分数，而不是合格/不合格的标签**。随着答案改善而逐渐变化的分数有助于优化器看出哪些改动真正有效。
- **防范奖励作弊**。模型有时会找到捷径，在没有真正能力的情况下获得高分。要让评分系统难以被钻空子。
- **避免数据偏斜**。如果某个标签在数据集中出现的频率远高于其他标签，模型就会倾向于猜测该标签。需要平衡数据集，或对罕见样本加权，让模型必须动脑思考。
- **在代码评分不够用时使用 LLM 评分**。面对内容丰富、开放式的问题时，可以让另一个语言模型来评分。在构建 LLM 评分器时，将多个候选回答和参考答案交给你的 LLM 评分器运行一遍，以确保评分稳定且与人类偏好一致。在提示词中提供关于优秀、公平和较差回答的少样本示例。