# Graders

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

评分器是一种根据参考答案评估模型性能的方法。我们的 [评分器 API](https://developers.openai.com/api/reference/resources/graders) 是测试评分器、试验结果并改进微调或评估框架以获得所需结果的方法。

OpenAI 正在弃用作为评估和微调工作流一部分的评分器
  其所支持的。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解当前的
  过渡时间表。

## 概述

评分器可以让你将参考答案与模型生成的对应答案进行比较，并返回一个介于 0 到 1 之间的分数。有时给模型的回答一个部分得分比给出 0 或 1 的二元判断更有帮助。

评分器以 JSON 格式指定，有以下几种类型：

- [字符串检查](#string-check-graders)
- [文本相似度](#text-similarity-graders)
- [评分模型评分器](#score-model-graders)
- [Python 代码执行](#python-graders)

在强化微调中，你可以通过使用 [`multigrader` 对象](#combined-graders).

使用本指南了解每种评分器类型，并查看入门示例。要构建评分器并开始强化微调，请参阅 [RFT 指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。或者要开始使用 evals，请参阅 [Evals 指南](https://developers.openai.com/api/docs/guides/evals).

## 模板化

某些评分器的输入使用模板语法，以便使用相同配置对多个示例进行评分。任何包含 `{{ }}` 双花括号的字符串都将被替换为相应的变量值。

其中的每个输入都必须包含一个 `{{}}` 且必须包含 _命名空间_ 和一个 _变量_ 采用以下格式 `{{ namespace.variable }}`。唯一受支持的命名空间值为 `item` 和 `sample`.

所有嵌套变量都可以使用类似 JSON 路径的语法访问。

### Item namespace

对于 evals，项命名空间会填充来自输入数据源的变量；对于微调，则会填充来自每个数据集项的变量。例如，如果某一行包含以下内容

```json
{
  "reference_answer": "..."
}
```

可在评分器内使用如下方式引用 `{{ item.reference_answer }}`.

### Sample namespace

sample 命名空间将在 evals 期间或微调步骤中通过模型采样步骤填充变量。包含以下变量

- `output_text`，模型输出内容（字符串形式）。
- `output_json`，模型输出内容（JSON 对象形式），仅当 `response_format` 包含在样本中时。
- `output_tools`，模型输出 `tool_calls`，其结构与 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `choices`，其结构与 [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `output_audio`，包含 Base64 编码的模型音频输出对象以及 `data` 和一个 `transcript`.

例如，若要将模型输出内容作为字符串访问， `{{ sample.output_text }}` 可以在评分器中使用。



#### 工具调用评分详情



在训练模型以改进工具调用行为时，你需要编写评分器，对 `sample.output_tools` 变量进行评分。该变量的内容与 `response.choices[0].message.tool_calls` ([参见函数调用文档](https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat)).

对工具调用进行评分的常见方式是使用两个评分器，一个检查所调用工具的名称，另一个检查被调用函数的参数。下面展示了一个这样做的评分器示例：

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

这是一个 `multi` 评分器，它组合了两个简单的 `string_check` 评分器，第一个通过 `sample.output_tools[0].function.name` 变量检查所调用工具的名称，第二个通过 `sample.output_tools[0].function.arguments` variable. The `calculate_output` 字段用于将两个分数合并为一个分数。

该 `arguments` 评分器很容易在函数参数存在细微错误时低估模型，例如当 `1` 提交的是字符串而不是浮点数 `1.0`，或者州名使用的是缩写而不是完整拼写。为了避免这种情况，你可以使用 `text_similarity` 评分器而不是 `string_check` 评分器，或者使用 `score_model` 评分器，让 LLM 检查语义相似度。





## 字符串检查评分器

使用这些基本的字符串操作返回 0 或 1。字符串检查打分器适合对简单的通过/未通过答案进行评分，例如城市的正确名称、是或否答案，或包含/以正确信息开头的答案。

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

- `eq`: 如果输入与参考匹配（区分大小写），则返回 1，否则返回 0
- `neq`: 如果输入与参考不匹配（区分大小写），则返回 1，否则返回 0
- `like`: 如果输入包含参考（区分大小写），则返回 1，否则返回 0
- `ilike`: 如果输入包含参考（不区分大小写），则返回 1，否则返回 0

## 文本相似度评分器

当需要评估模型生成的输出与参考答案之间的接近程度时，使用文本相似度评分器，可结合多种评估框架进行打分。

这对于开放式文本响应非常有用。例如，如果你的数据集中包含专家以段落形式给出的参考答案，那么以数值形式查看模型生成的答案与该内容的接近程度会很有帮助。

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

支持的操作（ `string-similarity-grader` ）包括：

- `fuzzy_match`: 使用 `rapidfuzz`
- `bleu`: 计算输入与参考之间的 BLEU 分数
- `gleu`: 计算输入与参考之间的 Google BLEU 分数
- `meteor`: 计算输入与参考之间的 METEOR 分数
- `cosine`: 使用 `text-embedding-3-large`。仅在 evals 中可用。
- `rouge-*`: 计算输入与参考之间的 ROUGE 分数

## 模型评分器

一般来说，使用模型评分器意味着提示另一个模型来对你正在微调的模型的输出进行评分。你的两个模型协同工作以完成强化微调。 _评分模型_ 会对 _训练模型_.

### 评分模型评估器

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

要使用评分模型评分器，输入是一个聊天消息列表，每条消息包含一个 `role` 和 `content`。评分器的输出将被截断到给定的 `range`，所有非数值输出默认为 0。
在每条消息中，可以使用与其他常见评分器相同的模板语法来引用标准答案或模型输出。

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


#### 评分模型评分器的输出

在底层， `score_model` 评分器会使用提供的提示和采样参数查询所请求的模型，并以特定的响应格式请求响应。所用响应格式如下

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

该格式不仅要求模型提供数值 `result` （即查询的奖励值），还为模型提供了一些空间来思考分数背后的推理过程。在编写评分器提示时，按名称显式引用这两个字段可能会很有用（例如，“在推理步骤的结论中包含关于分子中所存在的化学键类型的推理”，或者“如果输入不满足条件 X，则在 `result` 字段中返回值 −1.0”）。

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
- `reasoning_effort` 非推理模型不支持该功能。

### 如何编写评分提示词

编写评分器提示是一个迭代过程。对模型评分器提示进行迭代的最佳方式是创建一个模型评分器评估。为此，你需要：

1. **任务提示**：为期望的任务编写极其详细的提示，包含逐步说明和大量结合上下文的具体示例。
1. **由模型或人类专家生成的答案**：提供大量高质量的答案示例，包括模型生成的和可信人类专家给出的。
1. **这些答案对应的真实评分**：明确好评分应是什么样。例如，人类专家给出的评分应为 1。

然后你就可以自动评估模型评分器区分不同质量等级答案的有效程度。随着时间的推移，在你发现并通过修改提示修复这些边缘情况时，将它们加入模型评分器评估中。

例如，假设你从人类专家那里知道哪些答案是最佳的：

```
answer_1 > answer_2 > answer_3
```

验证模型评分器的答案是否与之匹配：

```
model_grader(answer_1, reference_answer) > model_grader(answer_2, reference_answer) > model_grader(answer_3, reference_answer)
```

### 评分器欺骗（Grader hacking）

正在训练的模型有时会学会利用模型评分器中的弱点，也就是所谓的“评分器作弊”或“奖励作弊”。你可以通过检查模型在模型评分器评估和专业人工评估中的表现来检测这种情况。如果模型作弊了评分器，它会在模型评分器评估中得分很高，但在专业人工评估中得分很低。随着时间推移，我们计划改进 API 中的可观测性，以便在训练期间更容易检测到这种情况。

## Python 评分器

该评分器允许你执行任意 python 代码来对模型输出进行评分。评分器要求存在一个 grade 函数，该函数接受两个参数并输出一个 float 值。任何其他结果（异常、无效的 float 值等）都将被标记为无效，并返回 0 分。

```json
{
  "type": "python",
  "source": "def grade(sample, item):\n    return 1.0",
  "image_tag": "2025-05-08"
}
```

python 源代码必须包含一个 grade 函数，该函数接受恰好两个参数，并返回一个 float 值作为评分。

```python
from typing import Any


def grade(sample: dict[str, Any], item: dict[str, Any]) -> float:
    # your logic here
    return 1.0
```


传递给评分函数的第一个参数是一个字典，其中填充了训练期间模型的输出，供你进行评分。 `output_json` 仅当输出使用 `response_format`.

```json
{
    "choices": [...],
    "output_text": "...",
    "output_json": {},
    "output_tools": [...],
    "output_audio": {}
}
```

传递给评分函数的第二个参数是一个字典，其中填充了输入评分上下文。对于 evals，这将包含来自数据源的键。对于微调，这将包含来自每个训练数据行的键。

```json
{
    "reference_answer": "...",
    "my_key": {...}
}
```

下面是一个可运行的示例。对于 Ruby，将上面展示的 `grade` 函数（包括其 import）另存为 `grader.py`。在运行示例之前，请将 `OPENAI_GRADER_SOURCE_PATH` 设置为该文件的路径。所提供的函数返回 `1.0`；将其函数体替换为你自己的评分逻辑。

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
grader = {
  type: :python,
  source: File.read(ENV.fetch("OPENAI_GRADER_SOURCE_PATH"))
}
item = { reference_answer: "fuzzy wuzzy had no hair" }
model_sample = "fuzzy wuzzy was a bear"

pp(client.fine_tuning.alpha.graders.validate(grader: grader))
pp(client.fine_tuning.alpha.graders.run(grader: grader, item: item, model_sample: model_sample))
```


**提示：**
如果你不想手动将评分函数放入字符串中，也可以使用 `importlib` 和 `inspect`。从 Python 文件加载它。例如，如果你的评分器函数位于名为 `grader.py`，的文件中，可以这样做：

```python
import importlib
import inspect

grader_module = importlib.import_module("grader")
grader = {"type": "python", "source": inspect.getsource(grader_module)}
```


这将自动使用你的 `grader.py` 文件的全部源代码作为评分器，这对于较长的评分器很有帮助。

### 技术约束

- 你上传的代码必须小于 `256kB` ，并且无法访问网络。
- 评分执行本身限制为 2 分钟。
- 运行时你将获得 2Gb 内存和 1Gb 磁盘空间的使用上限。
- CPU 核心数限制为 2 核——超出此用量的部分将触发限流

以下第三方软件包在 image 标签的执行期间可用 `2025-05-08`

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

一个 `multigrader` 对象将多个评分器的输出合并为单个分数。组合评分器会基于其他评分器对象的字段计算评分，并将这些子评分转化为总体评分。这在正确答案依赖多个条件同时成立时非常有用——例如，文本既要相似， _和_ 答案又要包含某个特定字符串。

例如，假设你希望模型输出包含以下两个字段的 JSON：

```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com"
}
```

你会希望评分器对这两个字段进行比较，然后取它们的平均值。

你可以通过将多个评分器组合成一个对象评分器，然后定义一个公式来根据每个字段计算输出分数来实现这一点：

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

在这个示例中，模型必须准确输出电子邮件（`string_check` 返回值为 0 或 1），但对姓名拼写的容忍度稍高（`text_similarity` 返回值范围为 0 到 1）。电子邮件错误的样本得分在 0-0.5 之间，电子邮件正确的样本得分在 0.5-1.0 之间。

你不能将一个 `multigrader` 嵌套在另一个中。

calculate 输出字段将包含输入的键 `graders` 作为可用变量，并支持以下特性：

**运算符**

- `+` （加法）
- `-` （减法）
- `*` （乘法）
- `/` （除法）
- `^` （幂）

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

设计并创建评分器是一个迭代的过程。从小处着手，动手实验，并持续进行调整，以获得更好的结果。

### 设计建议

要从评分器中获得最大价值，请遵循以下设计原则：

- **产出平滑的分数，而非合格/不合格的标签**。随着答案质量的提升而逐渐变化的分数，有助于优化器判断哪些改动真正起作用。
- **防范奖励作弊**。这种情况发生在模型找到某种捷径来获得高分、却并未具备真实能力时。要让你的评分系统难以被钻空子。
- **避免数据偏斜**。如果数据集中某个标签出现得最多，模型就会倾向于猜测该标签。请平衡数据集或提高稀有样本的权重，迫使模型真正思考。
- **在代码评分不够用时，使用 LLM 作为裁判**。对于内容丰富、开放式的回答，可以让另一个语言模型来打分。在构建 LLM 评分器时，让多名候选回答与参考答案都通过你的 LLM 裁判运行，以确保评分稳定且与偏好一致，并在提示中提供优秀、公平、糟糕答案的少样本示例。