# 评分器

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

Graders 是一种根据参考答案评估模型性能的方式。我们的 [graders API](https://developers.openai.com/api/reference/resources/graders) 提供了一种方式来测试你的 graders、试验结果，并改进微调或评估框架以获得你想要的结果。

OpenAI 正在弃用 graders，作为 evals 和微调工作流的一部分
  它们所支持的功能。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解
  当前的过渡时间表。

## 概述

评分器可让你将参考答案与模型生成的答案进行比较，并返回一个 0 到 1 范围内的评分。有时，与其给出非 0 即 1 的二元评分，给模型部分分数会更有帮助。

评分器以 JSON 格式指定，并且有多种类型：

- [字符串检查](#string-check-graders)
- [文本相似度](#text-similarity-graders)
- [评分模型评分器](#score-model-graders)
- [Python 代码执行](#python-graders)

在强化微调中，你可以通过使用 [`multigrader` 对象](#combined-graders).

使用本指南了解每种评分器的类型，并查看入门示例。若要构建评分器并开始强化微调，请参阅 [RFT 指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。或者，若要开始使用评估，请参阅 [Evals 指南](https://developers.openai.com/api/docs/guides/evals).

## 模板

某些评分器的输入使用模板语法，以便使用相同的配置对多个示例进行评分。任何包含 `{{ }}` 双花括号的字符串都将被替换为相应的变量值。

其中的每个输入都 `{{}}` 必须包含一个 _命名空间_ 和一个 _变量_ ，格式如下 `{{ namespace.variable }}`。唯一支持的命名空间值为 `item` 和 `sample`.

所有嵌套变量都可以使用类似 JSON 路径的语法访问。

### Item namespace

item 命名空间将填充来自评估输入数据源的变量，以及来自微调每个数据集条目的变量。例如，如果某一行包含以下内容

```json
{
  "reference_answer": "..."
}
```

这可以在评分器中用作 `{{ item.reference_answer }}`.

### Sample namespace

示例命名空间将在 evals 评估或微调步骤中由模型采样步骤填充相关变量。其中包含以下变量

- `output_text`，模型输出内容以字符串形式返回。
- `output_json`，模型输出内容以 JSON 对象形式返回，仅当 `response_format` 包含在样本中时使用。
- `output_tools`，模型输出 `tool_calls`，其结构与 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `choices`，输出选项，其结构与 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `output_audio`，模型音频输出对象，包含 Base64 编码的 `data` 以及一个 `transcript`.

例如，要将模型输出内容作为字符串访问， `{{ sample.output_text }}` 可以在评分器中使用。



#### 工具调用评分详情



在训练模型以改进工具调用行为时，你需要编写评分器，使其在 `sample.output_tools` 变量上运行。该变量的内容将与 `response.choices[0].message.tool_calls` ([参阅函数调用文档](https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat)).

对工具调用进行评分的常见方式是使用两个评分器，一个检查所调用工具的名称，另一个检查被调用函数的参数。执行此操作的评分器示例如下：

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

这是一个 `multi` 评分器，它组合了两个简单的 `string_check` 评分器，第一个通过 `sample.output_tools[0].function.name` 变量检查所调用工具的名称，第二个通过 `sample.output_tools[0].function.arguments` 变量检查被调用函数的参数。使用 `calculate_output` 字段将两个分数合并为单个分数。

该 `arguments` 如果函数参数存在细微错误， `1` 评分器容易对模型奖励不足，例如提交了 `1.0`，而非浮点数，或将州名以缩写形式给出而非完整拼写。为避免这种情况，你可以使用 `text_similarity` 评分器代替 `string_check` 评分器，或使用 `score_model` 评分器让 LLM 检查语义相似性。





## 字符串检查评分器

使用这些基本的字符串运算来返回 0 或 1。字符串检查评分器适合用于打分明确的通过或失败答案，例如城市名称是否正确、是或否答案，或者包含或以正确信息开头的答案。

```json
{
    "type": "string_check",
    "name": string,
    "operation": "eq" | "ne" | "like" | "ilike",
    "input": string,
    "reference": string,
}
```

string-check-grader 支持的运算包括：

- `eq`: 如果输入与参考匹配（区分大小写），则返回 1，否则返回 0
- `neq`: 如果输入与参考不匹配（区分大小写），则返回 1，否则返回 0
- `like`: 如果输入包含参考内容（区分大小写），则返回 1，否则返回 0
- `ilike`: 如果输入包含参考内容（不区分大小写），则返回 1，否则返回 0

## 文本相似度评分器

使用文本相似度评分器来评估模型生成输出与参考答案之间的接近程度，可使用各种评估框架进行打分。

这对于开放式文本响应非常有用。例如，如果你的数据集中包含专家以段落形式提供的参考答案，那么以数值形式查看模型生成的答案与该内容的接近程度会很有帮助。

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

支持的操作 `string-similarity-grader` 如下：

- `fuzzy_match`: 使用以下方法对输入与参考进行模糊字符串匹配 `rapidfuzz`
- `bleu`: 计算输入与参考之间的 BLEU 分数
- `gleu`: 计算输入与参考之间的 Google BLEU 分数
- `meteor`: 计算输入与参考之间的 METEOR 分数
- `cosine`: 使用以下方法计算嵌入后的输入与参考之间的余弦相似度 `text-embedding-3-large`。仅在 evals 中可用。
- `rouge-*`: 计算输入与参考之间的 ROUGE 分数

## 模型评分器

通常，使用模型评分器需要单独提示一个模型来对你正在微调的模型的输出进行评分。两个模型协同完成强化微调。 _评分模型_ 会对 _训练模型_.

### 评分模型评分器

评分模型评分器会接收输入，并根据提示在给定范围内返回一个数值分数。

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

其中每条消息的格式如下：

```json
{
    "role": "system" | "developer" | "user" | "assistant",
    "content": str
}

```

要使用评分模型评分器，输入是一个聊天消息列表，每条消息包含一个 `role` 和 `content`。评分器的输出将被截断为给定的 `range`，并且对于所有非数值输出，默认返回 0。
在每条消息中，可以使用与其他常见评分器相同的模板来引用真实答案或模型输出。

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

```ruby
require "openai"

client = OpenAI::Client.new
grader = {
  "type" => "score_model",
  "name" => "my_score_model",
  "input" => [{
    "role" => "system",
    "content" => "You are an expert grader. If the reference and model answer are exact matches, output a score of 1. If they are somewhat similar in meaning, output a score in 0.5. Otherwise, give a score of 0."
  }, {
    "role" => "user",
    "content" => "Reference: {{ item.reference_answer }}. Model answer: {{ sample.output_text }}"
  }],
  "pass_threshold" => 0.5,
  "model" => "o4-mini-2025-04-16",
  "range" => [0, 1],
  "sampling_params" => {
    "max_completions_tokens" => 32768,
    "top_p" => 1,
    "reasoning_effort" => "medium"
  }
}
item = {reference_answer: 1.0}
model_sample = "0.9"

pp(client.fine_tuning.alpha.graders.validate(grader: grader))
pp(client.fine_tuning.alpha.graders.run(grader: grader, item: item, model_sample: model_sample))
```


#### 评分模型评分器输出

在底层， `score_model` 评分器会使用提供的提示词和采样参数查询所请求的模型，并以特定响应格式请求响应。所用响应格式如下所示

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

此格式不仅向模型查询 `result` （查询的奖励值），还为模型提供了一些空间来思考评分背后的推理。在编写评分器提示词时，按名称显式引用这两个字段可能会很有用（例如，“在推理步骤的结论中包含关于分子中存在的化学键类型的推理”，或“如果输入不满足条件 X，则在 `result` 字段中返回值 −1.0”）。

### 模型评分器约束

- 只有以下模型支持 `model` 参数
  - `gpt-4o-2024-08-06`
  - `gpt-4o-mini-2024-07-18`
  - `gpt-4.1-2025-04-14`
  - `gpt-4.1-mini-2025-04-14`
  - `gpt-4.1-nano-2025-04-14`
  - `o1-2024-12-17`
  - `o3-mini-2025-01-31`
  - `o3-2025-04-16`
  - `o4-mini-2025-04-16`
- `temperature` 不支持针对推理模型的更改。
- `reasoning_effort` 不支持非推理模型。

### 如何编写评分器提示词

编写评分器提示是一个迭代过程。对模型评分器提示进行迭代的最佳方式是创建一个模型评分器评估。为此，你需要：

1. **任务提示词**: 为期望任务撰写非常详细的提示词，包含分步说明和大量特定场景示例。
1. **由模型或人类专家生成的答案**: 提供大量高质量的答案示例，包括模型生成的以及可信赖的人类专家给出的。
1. **对应答案的标准评分**: 明确何为良好评分。例如，你的人类专家评分应为 1。

然后你可以自动评估模型评分器区分不同质量等级答案的效果。随着时间推移，在你发现并通过修改提示修复边界情况时，将它们加入模型评分器评测中。

例如，假设你已经从人类专家那里得知哪些答案是最好的：

```
answer_1 > answer_2 > answer_3
```

验证模型评分器的答案是否与之相符：

```
model_grader(answer_1, reference_answer) > model_grader(answer_2, reference_answer) > model_grader(answer_3, reference_answer)
```

### 评分器破解

正在训练的模型有时会学会利用模型评分器中的弱点，这也被称为“评分器作弊”或“奖励作弊”。你可以通过检查模型在模型评分器评估与专家人工评估中的表现来检测这一点。成功作弊的模型在模型评分器评估中得分很高，但在专家人工评估中得分很低。随着时间的推移，我们打算改进API中的可观测性，以便在训练期间更轻松地检测此类情况。

## Python 评分器

此评分器允许你执行任意 Python 代码来对模型输出进行评分。评分器要求存在一个 grade 函数，该函数接收两个参数并输出一个 float 值。任何其他结果（异常、非法的 float 值等）都将被标记为无效，并返回 0 分。

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


传给评分函数的第一个参数将是一个字典，其中填充了训练期间模型的输出，供你进行评分。 `output_json` 仅当输出使用 `response_format`.

```json
{
    "choices": [...],
    "output_text": "...",
    "output_json": {},
    "output_tools": [...],
    "output_audio": {}
}
```

传给评分函数的第二个参数是一个字典，其中填充了评分所需的输入上下文。对于评估，其中将包含来自数据源的键。对于微调，其中将包含来自每个训练数据行的键。

```json
{
    "reference_answer": "...",
    "my_key": {...}
}
```

下面是一个可运行的示例。对于 Ruby，请将上述函数（包括其 import）保存为 `grade` 。在运行示例之前，将 `grader.py`。设置为该文件的路径。所提供的函数返回 `OPENAI_GRADER_SOURCE_PATH` 指向该文件的路径。该函数会返回 `1.0`；请将其函数体替换为你的评分逻辑。

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

```ruby
require "openai"

client = OpenAI::Client.new
# Set OPENAI_GRADER_SOURCE_PATH to the Python grader file to upload.
grader = {type: :python, source: File.read(ENV.fetch("OPENAI_GRADER_SOURCE_PATH"))}
item = {reference_answer: "fuzzy wuzzy had no hair"}
model_sample = "fuzzy wuzzy was a bear"

pp(client.fine_tuning.alpha.graders.validate(grader: grader))
pp(client.fine_tuning.alpha.graders.run(grader: grader, item: item, model_sample: model_sample))
```


**提示：**
如果你不想手动将评分函数放入字符串中，也可以使用 `importlib` 和 `inspect`。从 Python 文件加载它。例如，如果你的评分函数位于一个名为 `grader.py`，的文件中，你可以这样做：

```python
import importlib
import inspect

grader_module = importlib.import_module("grader")
grader = {"type": "python", "source": inspect.getsource(grader_module)}
```


这将自动使用你的 `grader.py` 文件的全部源代码作为评分器，这对于较长的评分器非常有用。

### 技术约束

- 你上传的代码必须小于 `256kB` 且无法访问网络。
- 评分执行本身限时 2 分钟。
- 运行时你将获得 2GB 内存和 1GB 磁盘空间的使用上限。
- CPU 核心数上限为 2 个——超出该使用量将导致限流

以下第三方包在 image 标签执行时可用 `2025-05-08`

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

举个例子，假设你希望模型输出包含以下两个字段的 JSON：

```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com"
}
```

你会希望评分器对这两个字段进行比较，然后对它们取平均值。

你可以通过将多个评分器组合为一个 object 评分器，然后定义一个公式，根据每个字段计算输出分数：

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

在这个示例中，模型必须准确输出邮箱（`string_check` 返回 0 或 1），而对姓名则容忍一定的拼写错误（`text_similarity` 返回值范围为 0 到 1）。邮箱错误的样本得分将在 0–0.5 之间，邮箱正确的样本得分将在 0.5–1.0 之间。

You cannot nest one `multigrader` inside another.

The calculate output field will have the keys of the input `graders` as possible variables and the following features are supported:

**Operators**

- `+` (加)
- `-` (减)
- `*` (乘)
- `/` (除)
- `^` (乘方)

**Functions**

- `min`
- `max`
- `abs`
- `floor`
- `ceil`
- `exp`
- `sqrt`
- `log`

## 限制与提示

设计和创建评分器是一个迭代过程。先从小的改动开始尝试，不断调整以获得更好的结果。

### 设计技巧

若要充分发挥评分器的价值，请遵循以下设计原则：

- **输出平滑分数，而非通过/不通过的标签**。当答案改进时分数随之平缓变化，有助于优化器辨别哪些改动真正起作用。
- **防范奖励作弊**。这种情况发生在模型找到一种捷径，无需真正能力就能拿到高分。要让你的评分系统难以被钻空子。
- **避免数据倾斜**。如果某个标签在数据集中出现的频率远高于其他，模型就会倾向于猜测该标签。要平衡数据集，或对稀有样本加权，让模型必须真正思考。
- **在代码评估力不从心时使用 LLM‑as‑a‑judge**。对于内容丰富、开放式的答案，可以让另一个语言模型来评分。在构建 LLM 评分器时，应让多个候选回答和标准答案一起通过你的 LLM 评分器，以确保评分稳定且与偏好一致。在 prompt 中提供优秀、公平和差劲答案的少样本示例。