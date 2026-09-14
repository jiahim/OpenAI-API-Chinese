# Graders

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

评分器是一种根据参考答案评估模型表现的方式。我们的 [评分器 API](https://developers.openai.com/api/reference/resources/graders) 是一种用于测试评分器、试验结果并改进微调或评估框架以获得你想要的结果的方式。

OpenAI 正在弃用作为评估与微调工作流一部分的评分器，
  它们所支持的功能。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解当前的
  过渡时间表。

## 概述

评分器允许你将参考答案与相应的模型生成答案进行比较，并返回 0 到 1 范围内的评分。有时给模型部分分数（而不是二元的 0 或 1）是很有帮助的。

评分器以 JSON 格式指定，有以下几种类型：

- [字符串检查](#string-check-graders)
- [文本相似度](#text-similarity-graders)
- [评分模型评估器](#score-model-graders)
- [Python 代码执行](#python-graders)

在强化微调中，你可以通过使用 [`multigrader` 对象](#combined-graders).

使用本指南了解每种评分器的类型，并查看入门示例。若要构建评分器并开始强化微调，请参阅 [RFT 指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。或者，若要开始使用 evals，请参阅 [Evals 指南](https://developers.openai.com/api/docs/guides/evals).

## 模板

某些评分器的输入使用模板语法，以便使用相同的配置对多个示例进行评分。任何包含 `{{ }}` 双花括号的字符串都将被替换为对应的变量值。

其中的每个输入都 `{{}}` 必须包含一个 _命名空间_ 和一个 _变量_ ，格式如下 `{{ namespace.variable }}`。支持的命名空间值仅包括 `item` 和 `sample`.

。所有嵌套变量都可以使用类似 JSON 路径的语法进行访问。

### 项目命名空间

item 命名空间会使用评估输入数据源中的变量进行填充，并使用每个数据集条目的变量进行微调。例如，如果某一行包含以下内容

```json
{
  "reference_answer": "..."
}
```

可以在评分器中使用如下方式引用 `{{ item.reference_answer }}`.

### Sample namespace

示例命名空间将在 evals 阶段或微调阶段从模型采样步骤中填充变量。包含以下变量

- `output_text`，模型输出内容为字符串。
- `output_json`，模型输出内容为 JSON 对象，前提是 `response_format` 已包含在该样本中。
- `output_tools`，模型输出 `tool_calls`，其结构与中的输出工具调用相同 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `choices`，输出选项，其结构与中的输出选项相同 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `output_audio`，模型音频输出对象，包含 Base64 编码的 `data` 以及一个 `transcript`.

例如，要以字符串形式访问模型输出内容， `{{ sample.output_text }}` 可在评分器中使用。



#### 工具调用评分详情



在训练模型以改进工具调用行为时，你需要编写评分器，使其作用于 `sample.output_tools` 变量。该变量的内容将与 `response.choices[0].message.tool_calls` ([参见函数调用文档](https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat)).

对工具调用进行评分的一种常见方式是使用两个评分器：一个检查所调用工具的名称，另一个检查被调用函数的参数。下面展示了一个完成此工作的评分器示例：

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

这是一个 `multi` 评分器，它组合了两个简单的 `string_check` 评分器，第一个通过 `sample.output_tools[0].function.name` 变量检查所调用工具的名称，第二个通过 `sample.output_tools[0].function.arguments` 变量。该 `calculate_output` 字段用于将两个分数合并为一个分数。

该 `arguments` 评分器在函数参数存在细微错误时容易对模型奖励不足，例如当提交的参数为 `1` 而不是浮点数 `1.0`，或者州名使用的是缩写而非完整拼写。为避免这种情况，你可以使用 `text_similarity` 评分器代替 `string_check` 评分器，或者使用 `score_model` 评分器，让大语言模型检查语义相似度。





## 字符串检查评分器

使用这些基本字符串操作来返回 0 或 1。字符串检查评分器非常适合用于对简单的通过或未通过答案进行评分——例如，城市的正确名称、是或否答案，或者包含或以正确信息开头的答案。

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

- `eq`: 如果输入与参考值匹配（区分大小写），则返回 1，否则返回 0
- `neq`: 如果输入与参考值不匹配（区分大小写），则返回 1，否则返回 0
- `like`: 如果输入包含参考值（区分大小写），则返回 1，否则返回 0
- `ilike`: 如果输入包含参考值（不区分大小写），则返回 1，否则返回 0

## 文本相似度评分器

使用文本相似度评分器来评估模型生成的输出与参考答案的接近程度,并使用各种评估框架进行打分。

这对于开放式文本响应非常有用。例如,如果你的数据集包含专家以段落形式给出的参考答案,那么以数值形式查看模型生成的答案与该内容的接近程度会很有帮助。

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

支持的操作 `string-similarity-grader` 有:

- `fuzzy_match`: 使用模糊字符串匹配在输入和参考答案之间进行比较 `rapidfuzz`
- `bleu`: 计算输入和参考答案之间的 BLEU 分数
- `gleu`: 计算输入和参考答案之间的 Google BLEU 分数
- `meteor`: 计算输入和参考答案之间的 METEOR 分数
- `cosine`: 使用余弦相似度计算嵌入后的输入和参考答案之间的相似度 `text-embedding-3-large`。仅在 evals 中可用。
- `rouge-*`: 计算输入和参考答案之间的 ROUGE 分数

## 模型评分器

一般来说，使用模型评分器意味着提示另一个模型来对你正在微调的模型的输出进行评分。你的两个模型协同工作以完成强化微调。The _grader model_ 会评估 _训练模型_.

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

其中每条消息采用以下格式：

```json
{
    "role": "system" | "developer" | "user" | "assistant",
    "content": str
}

```

要使用评分模型评分器，输入是一个聊天消息列表，其中每条消息包含一个 `role` 和 `content`。评分器的输出将被截断到给定的 `range`，并且对于所有非数值输出，默认值为 0。
在每条消息中，可以使用与其他常见评分器相同的模板语法来引用标准答案或模型输出。

以下是完整可运行的代码示例：

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
  "input" => [
    {
      "role" => "system",
      "content" => "You are an expert grader. If the reference and model answer are exact matches, output a score of 1. If they are somewhat similar in meaning, output a score in 0.5. Otherwise, give a score of 0."
    }, {
      "role" => "user",
      "content" => "Reference: {{ item.reference_answer }}. Model answer: {{ sample.output_text }}"
    }
  ],
  "pass_threshold" => 0.5,
  "model" => "o4-mini-2025-04-16",
  "range" => [0, 1],
  "sampling_params" => {
    "max_completions_tokens" => 32768,
    "top_p" => 1,
    "reasoning_effort" => "medium"
  }
}
item = { reference_answer: 1.0 }
model_sample = "0.9"

pp(client.fine_tuning.alpha.graders.validate(grader: grader))
pp(client.fine_tuning.alpha.graders.run(grader: grader, item: item, model_sample: model_sample))
```


#### 评分模型评分器输出

在底层， `score_model` 评分器会使用提供的提示和采样参数查询所请求的模型，并要求以特定的响应格式返回结果。所用响应格式如下所示

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

该格式不仅向模型查询数值 `result` （即该查询的奖励值），还为模型提供了一些空间来思考分数背后的推理过程。在编写评分器提示时，按名称显式引用这两个字段可能会很有用（例如，“在推理步骤的结论中包含关于分子中存在的化学键类型的推理”，或者“如果输入不满足条件 X，则在 `result` 字段中返回值 −1.0”）。

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

### 如何编写评分器提示词

编写评分器提示是一个迭代过程。对模型评分器提示进行迭代的最佳方式是创建一个模型评分器评测。为此，你需要：

1. **任务提示词**：为期望任务撰写极其详尽的提示词，包含分步指令以及大量具体的上下文示例。
1. **由模型或人类专家生成的答案**：提供大量高质量的答案示例，涵盖模型生成的和可信赖的人类专家生成的。
1. **这些答案对应的真实评分**：明确一个好的评分应当是什么样的。例如，你的人类专家评分应为 1。

然后你就可以自动评估模型评分器区分不同质量级别答案的效果。随着时间推移，当你发现边缘情况并通过修改 prompt 来修复时，把它们加入你的模型评分器评估中。

例如，假设你从人类专家那里知道哪些答案是最好的：

```
answer_1 > answer_2 > answer_3
```

验证模型评分器的答案是否与之相符：

```
model_grader(answer_1, reference_answer) > model_grader(answer_2, reference_answer) > model_grader(answer_3, reference_answer)
```

### 评分器欺骗

正在训练的模型有时会学会利用模型评分器中的弱点，也就是所谓的“评分器黑客”或“奖励黑客”。你可以通过检查模型在模型评分器评估和专家人工评估中的表现来检测这种情况。被黑客攻击的模型在模型评分器评估中得分很高，但在专家人工评估中得分很低。随着时间推移，我们打算改进 API 中的可观测性，以便在训练期间更容易检测到这种情况。

## Python 评分器

该评分器允许你执行任意 Python 代码来对模型输出进行评分。评分器要求存在一个 grade 函数，该函数接收两个参数并输出一个浮点值。任何其他结果（异常、无效的浮点值等）都将被标记为无效，并返回 0 分。

```json
{
  "type": "python",
  "source": "def grade(sample, item):\n    return 1.0",
  "image_tag": "2025-05-08"
}
```

Python 源代码必须包含一个 grade 函数，该函数恰好接收两个参数并返回一个浮点值作为评分。

```python
from typing import Any


def grade(sample: dict[str, Any], item: dict[str, Any]) -> float:
    # your logic here
    return 1.0
```


传递给评分函数的第一个参数是一个字典，其中包含训练期间模型输出供你评分的内容。 `output_json` 仅当输出使用了 `response_format`.

```json
{
    "choices": [...],
    "output_text": "...",
    "output_json": {},
    "output_tools": [...],
    "output_audio": {}
}
```

传递给评分函数的第二个参数是一个字典，其中包含输入的评分上下文。对于 evals，这会包含来自数据源的键。对于微调，这会包含来自每个训练数据行的键。

```json
{
    "reference_answer": "...",
    "my_key": {...}
}
```

下面是一个可用的示例。对于 Ruby，将上面展示的 `grade` 函数（包括其 import）保存为 `grader.py`。将 `grader.py` 放在你运行示例的目录中。所提供的函数返回 `1.0`；将其函数体替换为你自己的评分逻辑。

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
# Save your Python grading function as grader.py before running this example.
grading_function = File.read("grader.py")
grader = {
  type: :python,
  source: grading_function
}
item = { reference_answer: "fuzzy wuzzy had no hair" }
model_sample = "fuzzy wuzzy was a bear"

pp(client.fine_tuning.alpha.graders.validate(grader: grader))
pp(client.fine_tuning.alpha.graders.run(grader: grader, item: item, model_sample: model_sample))
```


**提示：**
如果你不想手动将评分函数放入字符串中，也可以使用 `importlib` 和 `inspect`。从 Python 文件中加载它。例如，如果你的评分函数位于一个名为 `grader.py`，的文件中，你可以这样：

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
- 运行时你将获得 2GB 内存和 1GB 磁盘空间的使用限制。
- CPU 核心数限制为 2 个——超出此用量的部分将导致限流。

以下第三方软件包在执行时可用于 image 标签 `2025-05-08`

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

此外,还提供以下 NLTK 语料库:

```
punkt
stopwords
wordnet
omw-1.4
names
```

## 组合评分器

> 目前，此评分器仅用于强化微调

一个 `multigrader` object 将多个评分器的输出组合为单一分数。组合评分器对其他评分器对象的字段进行打分，并将这些子分数转换为整体分数。这在正确答案依赖于多个条件同时成立时非常有用——例如，文本既要相似 _和_ 又要包含特定字符串。

举个例子，假设你希望模型输出包含以下两个字段的 JSON：

```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com"
}
```

你会希望你的评分器比较这两个字段，然后对它们取平均值。

你可以通过将多个评分器组合成一个 object 评分器，然后定义一个公式来根据每个字段计算输出分数：

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

在这个示例中，让模型准确输出 email 很重要（`string_check` 返回 0 或 1），但对 name 出现一些拼写错误是可以容忍的（`text_similarity` 返回范围为 0 到 1）。email 错误的样本得分在 0-0.5 之间，email 正确的样本得分在 0.5-1.0 之间。

你不能在另一个 `multigrader` 中嵌套一个。

calculate 输出字段将输入的键 `graders` 作为可用变量，并支持以下特性：

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

## 限制与技巧

设计和创建评分器是一个迭代的过程。先从小的实验开始，逐步调整以获得更好的结果。

### 设计技巧

为充分利用评分器的价值，请遵循以下设计原则：

- **输出平滑分数，而非简单的通过/未通过标记**。随着答案变好而逐步变化的分数有助于优化器判断哪些改动真正有效。
- **防范奖励作弊**。模型有时会找到捷径来获得高分，但并未真正掌握能力。应当让评分系统难以被钻空子。
- **避免数据倾斜**。如果数据集中某个标签频繁出现，模型就会倾向于猜测该标签。需要平衡数据集或对少数类加权，以促使模型真正思考。
- **在代码评判不够用时使用 LLM 评审**。对于内容丰富、开放式的回答，可以请另一个语言模型来打分。在构建 LLM 评审时，用你的 LLM 评审跑多份候选回答与标准答案，确保评分稳定且与偏好对齐，并在提示中提供优、中、差答案的少样本示例。