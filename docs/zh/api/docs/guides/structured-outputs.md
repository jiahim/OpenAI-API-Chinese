# 结构化模型输出

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

JSON 是世界上应用程序交换数据最广泛使用的格式之一。

结构化输出是一项功能，可确保模型始终生成符合你提供的 [JSON Schema](https://json-schema.org/overview/what-is-jsonschema)，的响应，因此你不必担心模型遗漏必需键或虚构无效枚举值。

结构化输出的一些好处包括：

1. **可靠的类型安全：** 无需验证或重试格式不正确的响应
1. **明确的拒绝：** 基于安全性的模型拒绝现在可以以编程方式检测
1. **更简单的提示：** 无需使用措辞强硬的提示即可实现一致的格式

除了在 REST API 中支持 JSON Schema 之外，OpenAI SDKs 也支持 [Python](https://github.com/openai/openai-python/blob/main/helpers.md#structured-outputs-parsing-helpers) 和 [JavaScript](https://github.com/openai/openai-node/blob/master/helpers.md#structured-outputs-parsing-helpers) ，使得使用 [Pydantic](https://docs.pydantic.dev/latest/) 和 [Zod](https://zod.dev/) 轻松定义对象模式变得简单。下面，你可以看到如何从符合代码中定义模式的无结构文本中提取信息。



获取结构化响应

```javascript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const response = await openai.responses.parse({
  model: "gpt-5.6",
  input: [
    { role: "system", content: "Extract the event information." },
    {
      role: "user",
      content: "Alice and Bob are going to a science fair on Friday.",
    },
  ],
  text: {
    format: zodTextFormat(CalendarEvent, "event"),
  },
});

const event = response.output_parsed;
```

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()


class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]


response = client.responses.parse(
    model="gpt-5.6",
    input=[
        {"role": "system", "content": "Extract the event information."},
        {
            "role": "user",
            "content": "Alice and Bob are going to a science fair on Friday.",
        },
    ],
    text_format=CalendarEvent,
)

event = response.output_parsed
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"name":         map[string]any{"type": "string"},
			"date":         map[string]any{"type": "string"},
			"participants": map[string]any{"type": "array", "items": map[string]any{"type": "string"}},
		},
		"required":             []string{"name", "date", "participants"},
		"additionalProperties": false,
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("Extract the event information.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("Alice and Bob are going to a science fair on Friday.")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "event", Schema: schema, Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

Map<String, Object> schema =
    Map.of(
        "type",
        "object",
        "properties",
        Map.of(
            "name", Map.of("type", "string"),
            "date", Map.of("type", "string"),
            "participants", Map.of("type", "array", "items", Map.of("type", "string"))),
        "required",
        List.of("name", "date", "participants"),
        "additionalProperties",
        false);

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content("Extract the event information.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("Alice and Bob are going to a science fair on Friday.")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("event")
                        .strict(true)
                        .schema(
                            JsonValue.from(schema)
                                .convert(ResponseFormatTextJsonSchemaConfig.Schema.class))
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
event_schema = {
  type: :object,
  properties: {
    name: {type: :string},
    date: {type: :string},
    participants: {type: :array, items: {type: :string}}
  },
  required: %w[name date participants],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {role: :system, content: "Extract the event information."},
    {role: :user, content: "Alice and Bob are going to a science fair on Friday."}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "event",
      strict: true,
      schema: event_schema
    }
  }
)

puts(response.output_text)
```



### 支持的模型

结构化输出可在我们的 [最新大型语言模型](https://developers.openai.com/api/docs/models)，中使用，从 GPT-4o 开始。对于新项目，请从 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)。开始。较旧的模型如 `gpt-4-turbo` 及更早版本可能使用 [JSON 模式](#json-mode) 代替。




  

何时通过函数调用使用结构化输出与通过 
    
text.format




结构化输出在 OpenAI API 中有两种形式：

1. 当使用 [函数调用](https://developers.openai.com/api/docs/guides/function-calling)
2. 当使用 `json_schema` 响应格式

函数调用在你构建一个桥接模型与你应用程序功能的应用程序时非常有用。

例如，你可以为模型提供查询数据库的函数，以构建一个能够帮助用户处理订单的 AI 助手，或者提供与 UI 交互的函数。

相反，通过 `response_format` 更适合当你想指示一个结构化的模式，用于模型回应用户时，而不是当模型调用工具时。

例如，如果你正在构建一个数学辅导应用程序，你可能希望助手使用特定的 JSON Schema 回应用户，以便你能生成一个以不同方式显示模型输出不同部分的 UI。

简而言之：




  - 如果你要将模型连接到工具、函数、数据等，在你的
  系统中，那么你应该使用函数调用 - 如果你想结构化
  模型对用户的输出，那么你应该使用结构化
  `text.format`





  本指南的其余部分将重点介绍非函数调用场景，
    即Responses API。要了解如何将结构化输出用于
    函数调用，请参阅 
    [函数调用](https://developers.openai.com/api/docs/guides/function-calling#strict-mode) 
    指南。


### 结构化输出与 JSON 模式

结构化输出是 [JSON 模式](#json-mode)。的演进。虽然两者都能确保生成有效的 JSON，但只有结构化输出才能确保符合模式。结构化输出和 JSON 模式均在 Responses API、Chat Completions API、Assistants API、微调 API 和 Batch API 中得到支持。

我们建议尽可能始终使用结构化输出而非 JSON 模式。

然而，带有 `response_format: {type: "json_schema", ...}` 的结构化输出仅在 `gpt-4o-mini`, `gpt-4o-mini-2024-07-18`，和 `gpt-4o-2024-08-06` 模型快照及更高版本中受支持。




|                                            | 结构化输出                                                                                                             | JSON 模式                                  |
|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| **输出有效 JSON**                     | 是                                                                                                                            | 是                                        |
| **遵循模式**                      | 是（参见 [受支持的模式](#supported-schemas))                                               | 否                                         |
| **兼容模型**                      | `gpt-4o-mini`, `gpt-4o-2024-08-06`及后续版本                                                                                  | `gpt-3.5-turbo`, `gpt-4-*`, `gpt-4o-*`及兼容的 GPT-5 模型 |
| **启用**                               | `text: { format: { type: "json_schema", "strict": true, "schema": ... } }`                                       | `text: { format: { type: "json_object" } }` |


## 示例



思维链

    

### 思维链

你可以要求模型以结构化的、分步的方式输出答案，以引导用户完成解决方案。




  用于思维链数学辅导的结构化输出

```javascript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const response = await openai.responses.parse({
  model: "gpt-5.6",
  input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  text: {
    format: zodTextFormat(MathReasoning, "math_reasoning"),
  },
});

const math_reasoning = response.output_parsed;
```

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()


class Step(BaseModel):
    explanation: str
    output: str


class MathReasoning(BaseModel):
    steps: list[Step]
    final_answer: str


response = client.responses.parse(
    model="gpt-5.6",
    input=[
        {
            "role": "system",
            "content": "You are a helpful math tutor. Guide the user through the solution step by step.",
        },
        {"role": "user", "content": "how can I solve 8x + 7 = -23"},
    ],
    text_format=MathReasoning,
)

math_reasoning = response.output_parsed
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	step := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"explanation": map[string]any{"type": "string"},
			"output":      map[string]any{"type": "string"},
		},
		"required":             []string{"explanation", "output"},
		"additionalProperties": false,
	}
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"steps":        map[string]any{"type": "array", "items": step},
			"final_answer": map[string]any{"type": "string"},
		},
		"required":             []string{"steps", "final_answer"},
		"additionalProperties": false,
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are a helpful math tutor. Guide the user through the solution step by step.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("how can I solve 8x + 7 = -23")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "math_reasoning", Schema: schema, Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

Map<String, Object> schema =
    Map.of(
        "type",
        "object",
        "properties",
        Map.of(
            "steps",
                Map.of(
                    "type",
                    "array",
                    "items",
                    Map.of(
                        "type",
                        "object",
                        "properties",
                        Map.of(
                            "explanation", Map.of("type", "string"),
                            "output", Map.of("type", "string")),
                        "required",
                        List.of("explanation", "output"),
                        "additionalProperties",
                        false)),
            "final_answer", Map.of("type", "string")),
        "required",
        List.of("steps", "final_answer"),
        "additionalProperties",
        false);

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "You are a helpful math tutor. Guide the user through the solution step by step.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("How can I solve 8x + 7 = -23?")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("math_reasoning")
                        .strict(true)
                        .schema(
                            JsonValue.from(schema)
                                .convert(ResponseFormatTextJsonSchemaConfig.Schema.class))
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
step_schema = {
  type: :object,
  properties: {
    explanation: {type: :string},
    output: {type: :string}
  },
  required: %w[explanation output],
  additionalProperties: false
}
math_schema = {
  type: :object,
  properties: {
    steps: {type: :array, items: step_schema},
    final_answer: {type: :string}
  },
  required: %w[steps final_answer],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :system,
      content: "You are a helpful math tutor. Guide the user through the solution step by step."
    },
    {role: :user, content: "How can I solve 8x + 7 = -23?"}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "math_reasoning",
      strict: true,
      schema: math_schema
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "system",
        "content": "You are a helpful math tutor. Guide the user through the solution step by step."
      },
      {
        "role": "user",
        "content": "how can I solve 8x + 7 = -23"
      }
    ],
    "text": {
      "format": {
        "type": "json_schema",
        "name": "math_reasoning",
        "schema": {
          "type": "object",
          "properties": {
            "steps": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "explanation": { "type": "string" },
                  "output": { "type": "string" }
                },
                "required": ["explanation", "output"],
                "additionalProperties": false
              }
            },
            "final_answer": { "type": "string" }
          },
          "required": ["steps", "final_answer"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```



#### 示例响应

```json
{
  "steps": [
    {
      "explanation": "Start with the equation 8x + 7 = -23.",
      "output": "8x + 7 = -23"
    },
    {
      "explanation": "Subtract 7 from both sides to isolate the term with the variable.",
      "output": "8x = -23 - 7"
    },
    {
      "explanation": "Simplify the right side of the equation.",
      "output": "8x = -30"
    },
    {
      "explanation": "Divide both sides by 8 to solve for x.",
      "output": "x = -30 / 8"
    },
    {
      "explanation": "Simplify the fraction.",
      "output": "x = -15 / 4"
    }
  ],
  "final_answer": "x = -15 / 4"
}
```


  

  

    
结构化数据提取

    

### 结构化数据提取

你可以定义结构化字段，从非结构化输入数据（如研究论文）中提取信息。



  使用结构化输出从研究论文中提取数据

```javascript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});

const response = await openai.responses.parse({
  model: "gpt-5.6",
  input: [
    {
      role: "system",
      content:
        "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure.",
    },
    { role: "user", content: "..." },
  ],
  text: {
    format: zodTextFormat(ResearchPaperExtraction, "research_paper_extraction"),
  },
});

const research_paper = response.output_parsed;
```

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()


class ResearchPaperExtraction(BaseModel):
    title: str
    authors: list[str]
    abstract: str
    keywords: list[str]


response = client.responses.parse(
    model="gpt-5.6",
    input=[
        {
            "role": "system",
            "content": "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure.",
        },
        {
            "role": "user",
            "content": (
                "Attention Is All You Need by Ashish Vaswani, Noam Shazeer, "
                "Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, "
                "Łukasz Kaiser, and Illia Polosukhin. We propose the "
                "Transformer, a sequence transduction architecture based "
                "entirely on attention. Keywords: transformers, attention, "
                "sequence transduction."
            ),
        },
    ],
    text_format=ResearchPaperExtraction,
)

research_paper = response.output_parsed
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

const researchPaperText = "Attention Is All You Need by Ashish Vaswani, Noam Shazeer, " +
	"Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, " +
	"Łukasz Kaiser, and Illia Polosukhin. We propose the Transformer, " +
	"a sequence transduction architecture based entirely on attention. " +
	"Keywords: transformers, attention, sequence transduction."

func main() {
	client := openai.NewClient()
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"title":    map[string]any{"type": "string"},
			"authors":  map[string]any{"type": "array", "items": map[string]any{"type": "string"}},
			"abstract": map[string]any{"type": "string"},
			"keywords": map[string]any{"type": "array", "items": map[string]any{"type": "string"}},
		},
		"required":             []string{"title", "authors", "abstract", "keywords"},
		"additionalProperties": false,
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText(researchPaperText)},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "research_paper_extraction", Schema: schema, Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

Map<String, Object> schema =
    Map.of(
        "type",
        "object",
        "properties",
        Map.of(
            "title", Map.of("type", "string"),
            "authors", Map.of("type", "array", "items", Map.of("type", "string")),
            "abstract", Map.of("type", "string"),
            "keywords", Map.of("type", "array", "items", Map.of("type", "string"))),
        "required",
        List.of("title", "authors", "abstract", "keywords"),
        "additionalProperties",
        false);

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "You are an expert at structured data extraction. You will be given"
                                + " unstructured text from a research paper and should convert"
                                + " it into the given structure.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content(
                            "Attention Is All You Need by Ashish Vaswani, Noam Shazeer,"
                                + " Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez,"
                                + " Łukasz Kaiser, and Illia Polosukhin. We propose the"
                                + " Transformer, a"
                                + " sequence transduction architecture based entirely on"
                                + " attention. Keywords: transformers, attention, sequence"
                                + " transduction.")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("research_paper_extraction")
                        .strict(true)
                        .schema(
                            JsonValue.from(schema)
                                .convert(ResponseFormatTextJsonSchemaConfig.Schema.class))
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
research_paper = <<~TEXT
  Attention Is All You Need by Ashish Vaswani, Noam Shazeer, Niki Parmar,
  Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, and Illia
  Polosukhin. We propose the Transformer, a sequence transduction architecture
  based entirely on attention. Keywords: transformers, attention, sequence
  transduction.
TEXT
paper_schema = {
  type: :object,
  properties: {
    title: {type: :string},
    authors: {type: :array, items: {type: :string}},
    abstract: {type: :string},
    keywords: {type: :array, items: {type: :string}}
  },
  required: %w[title authors abstract keywords],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :system,
      content: "Extract structured data from the supplied research paper text."
    },
    {role: :user, content: research_paper}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "research_paper_extraction",
      strict: true,
      schema: paper_schema
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "system",
        "content": "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure."
      },
      {
        "role": "user",
        "content": "..."
      }
    ],
    "text": {
      "format": {
        "type": "json_schema",
        "name": "research_paper_extraction",
        "schema": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "authors": {
              "type": "array",
              "items": { "type": "string" }
            },
            "abstract": { "type": "string" },
            "keywords": {
              "type": "array",
              "items": { "type": "string" }
            }
          },
          "required": ["title", "authors", "abstract", "keywords"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```



#### 示例响应

```json
{
  "title": "Application of Quantum Algorithms in Interstellar Navigation: A New Frontier",
  "authors": ["Dr. Stella Voyager", "Dr. Nova Star", "Dr. Lyra Hunter"],
  "abstract": "This paper investigates the utilization of quantum algorithms to improve interstellar navigation systems. By leveraging quantum superposition and entanglement, our proposed navigation system can calculate optimal travel paths through space-time anomalies more efficiently than classical methods. Experimental simulations suggest a significant reduction in travel time and fuel consumption for interstellar missions.",
  "keywords": [
    "Quantum algorithms",
    "interstellar navigation",
    "space-time anomalies",
    "quantum superposition",
    "quantum entanglement",
    "space travel"
  ]
}
```


  

  

    
UI 生成

    

### 界面生成

你可以通过将 HTML 表示为带有约束（如枚举）的递归数据结构来生成有效的 HTML。




  使用结构化输出生成 HTML

```javascript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const UI = z.lazy(() =>
  z.object({
    type: z.enum(["div", "button", "header", "section", "field", "form"]),
    label: z.string(),
    children: z.array(UI),
    attributes: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    ),
  })
);

const response = await openai.responses.parse({
  model: "gpt-5.6",
  input: [
    {
      role: "system",
      content: "You are a UI generator AI. Convert the user input into a UI.",
    },
    {
      role: "user",
      content: "Make a User Profile Form",
    },
  ],
  text: {
    format: zodTextFormat(UI, "ui"),
  },
});

const ui = response.output_parsed;
```

```python
from enum import Enum
from typing import List

from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()


class UIType(str, Enum):
    div = "div"
    button = "button"
    header = "header"
    section = "section"
    field = "field"
    form = "form"


class Attribute(BaseModel):
    name: str
    value: str


class UI(BaseModel):
    type: UIType
    label: str
    children: List["UI"]
    attributes: List[Attribute]


UI.model_rebuild()  # This is required to enable recursive types


class Response(BaseModel):
    ui: UI


response = client.responses.parse(
    model="gpt-5.6",
    input=[
        {
            "role": "system",
            "content": "You are a UI generator AI. Convert the user input into a UI.",
        },
        {"role": "user", "content": "Make a User Profile Form"},
    ],
    text_format=Response,
)

ui = response.output_parsed
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"type":       map[string]any{"type": "string", "enum": []string{"div", "button", "header", "section", "field", "form"}},
			"label":      map[string]any{"type": "string"},
			"children":   map[string]any{"type": "array", "items": map[string]any{"$ref": "#"}},
			"attributes": map[string]any{"type": "array", "items": map[string]any{"type": "object", "properties": map[string]any{"name": map[string]any{"type": "string"}, "value": map[string]any{"type": "string"}}, "required": []string{"name", "value"}, "additionalProperties": false}},
		},
		"required":             []string{"type", "label", "children", "attributes"},
		"additionalProperties": false,
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are a UI generator AI. Convert the user input into a UI.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("Make a User Profile Form")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "ui", Description: openai.String("Dynamically generated UI"), Schema: schema, Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content("Convert the user request into a UI definition.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("Make a user profile form.")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("ui")
                        .description("A dynamically generated UI")
                        .strict(true)
                        .schema(
                            ResponseFormatTextJsonSchemaConfig.Schema.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "type",
                                                Map.of(
                                                    "type",
                                                    "string",
                                                    "enum",
                                                    List.of(
                                                        "div", "button", "header", "section",
                                                        "field", "form")),
                                            "label", Map.of("type", "string"),
                                            "children",
                                                Map.of(
                                                    "type",
                                                    "array",
                                                    "items",
                                                    Map.of("$ref", "#")),
                                            "attributes",
                                                Map.of(
                                                    "type",
                                                    "array",
                                                    "items",
                                                    Map.of(
                                                        "type",
                                                        "object",
                                                        "properties",
                                                        Map.of(
                                                            "name", Map.of("type", "string"),
                                                            "value", Map.of("type", "string")),
                                                        "required",
                                                        List.of("name", "value"),
                                                        "additionalProperties",
                                                        false)))))
                                .putAdditionalProperty(
                                    "required",
                                    JsonValue.from(
                                        List.of("type", "label", "children", "attributes")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
ui_schema = {
  type: :object,
  properties: {
    type: {
      type: :string,
      enum: %w[div button header section field form]
    },
    label: {type: :string},
    children: {type: :array, items: {"$ref" => "#"}},
    attributes: {
      type: :array,
      items: {
        type: :object,
        properties: {
          name: {type: :string},
          value: {type: :string}
        },
        required: %w[name value],
        additionalProperties: false
      }
    }
  },
  required: %w[type label children attributes],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {role: :system, content: "Convert the user request into a UI definition."},
    {role: :user, content: "Make a user profile form."}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "ui",
      description: "A dynamically generated UI",
      strict: true,
      schema: ui_schema
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "system",
        "content": "You are a UI generator AI. Convert the user input into a UI."
      },
      {
        "role": "user",
        "content": "Make a User Profile Form"
      }
    ],
    "text": {
      "format": {
        "type": "json_schema",
        "name": "ui",
        "description": "Dynamically generated UI",
        "schema": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "description": "The type of the UI component",
              "enum": ["div", "button", "header", "section", "field", "form"]
            },
            "label": {
              "type": "string",
              "description": "The label of the UI component, used for buttons or form fields"
            },
            "children": {
              "type": "array",
              "description": "Nested UI components",
              "items": {"$ref": "#"}
            },
            "attributes": {
              "type": "array",
              "description": "Arbitrary attributes for the UI component, suitable for any element",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "The name of the attribute, for example onClick or className"
                  },
                  "value": {
                    "type": "string",
                    "description": "The value of the attribute"
                  }
                },
                "required": ["name", "value"],
                "additionalProperties": false
              }
            }
          },
          "required": ["type", "label", "children", "attributes"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```



#### 示例响应

```json
{
  "type": "form",
  "label": "User Profile Form",
  "children": [
    {
      "type": "div",
      "label": "",
      "children": [
        {
          "type": "field",
          "label": "First Name",
          "children": [],
          "attributes": [
            {
              "name": "type",
              "value": "text"
            },
            {
              "name": "name",
              "value": "firstName"
            },
            {
              "name": "placeholder",
              "value": "Enter your first name"
            }
          ]
        },
        {
          "type": "field",
          "label": "Last Name",
          "children": [],
          "attributes": [
            {
              "name": "type",
              "value": "text"
            },
            {
              "name": "name",
              "value": "lastName"
            },
            {
              "name": "placeholder",
              "value": "Enter your last name"
            }
          ]
        }
      ],
      "attributes": []
    },
    {
      "type": "button",
      "label": "Submit",
      "children": [],
      "attributes": [
        {
          "name": "type",
          "value": "submit"
        }
      ]
    }
  ],
  "attributes": [
    {
      "name": "method",
      "value": "post"
    },
    {
      "name": "action",
      "value": "/submit-profile"
    }
  ]
}
```


  

  

    
审核

    

### 审核

你可以对输入进行多类别分类，这是执行审核的常见方式。




  使用结构化输出的审核

```javascript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const ContentCompliance = z.object({
  is_violating: z.boolean(),
  category: z.enum(["violence", "sexual", "self_harm"]).nullable(),
  explanation_if_violating: z.string().nullable(),
});

const response = await openai.responses.parse({
  model: "gpt-5.6",
  input: [
    {
      role: "system",
      content:
        "Determine if the user input violates specific guidelines and explain if they do.",
    },
    {
      role: "user",
      content: "How do I prepare for a job interview?",
    },
  ],
  text: {
    format: zodTextFormat(ContentCompliance, "content_compliance"),
  },
});

const compliance = response.output_parsed;
```

```python
from enum import Enum
from typing import Optional

from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()


class Category(str, Enum):
    violence = "violence"
    sexual = "sexual"
    self_harm = "self_harm"


class ContentCompliance(BaseModel):
    is_violating: bool
    category: Optional[Category]
    explanation_if_violating: Optional[str]


response = client.responses.parse(
    model="gpt-5.6",
    input=[
        {
            "role": "system",
            "content": "Determine if the user input violates specific guidelines and explain if they do.",
        },
        {"role": "user", "content": "How do I prepare for a job interview?"},
    ],
    text_format=ContentCompliance,
)

compliance = response.output_parsed
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	schema := contentComplianceSchema()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage("Determine if the user input violates specific guidelines and explain if they do.", responses.EasyInputMessageRoleSystem),
			responses.ResponseInputItemParamOfMessage("How do I prepare for a job interview?", responses.EasyInputMessageRoleUser),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{
				Name: "content_compliance", Description: openai.String("Determines if content is violating specific moderation rules"), Schema: schema, Strict: openai.Bool(true),
			},
		}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}

func contentComplianceSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"is_violating":             map[string]any{"type": "boolean", "description": "Indicates if the content is violating guidelines"},
			"category":                 map[string]any{"type": []string{"string", "null"}, "description": "Type of violation, if the content is violating guidelines. Null otherwise.", "enum": []any{"violence", "sexual", "self_harm", nil}},
			"explanation_if_violating": map[string]any{"type": []string{"string", "null"}, "description": "Explanation of why the content is violating"},
		},
		"required":             []string{"is_violating", "category", "explanation_if_violating"},
		"additionalProperties": false,
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

Map<String, Object> schema =
    Map.of(
        "type",
        "object",
        "properties",
        Map.of(
            "is_violating",
                Map.of(
                    "type", "boolean",
                    "description", "Whether the content violates the guidelines"),
            "category",
                Map.of(
                    "type", List.of("string", "null"),
                    "enum", Arrays.asList("violence", "sexual", "self_harm", null),
                    "description", "The violation category, or null when content is allowed"),
            "explanation_if_violating",
                Map.of(
                    "type",
                    List.of("string", "null"),
                    "description",
                    "Why the content violates the guidelines, or null")),
        "required",
        List.of("is_violating", "category", "explanation_if_violating"),
        "additionalProperties",
        false);

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "Determine whether the user input violates the guidelines and explain any violation.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("How do I prepare for a job interview?")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("content_compliance")
                        .description("Determines whether content violates moderation rules")
                        .strict(true)
                        .schema(
                            JsonValue.from(schema)
                                .convert(ResponseFormatTextJsonSchemaConfig.Schema.class))
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
compliance_schema = {
  type: :object,
  properties: {
    is_violating: {
      type: :boolean,
      description: "Whether the content violates the guidelines"
    },
    category: {
      type: %i[string null],
      enum: ["violence", "sexual", "self_harm", nil],
      description: "The violation category, or null when the content is allowed"
    },
    explanation_if_violating: {
      type: %i[string null],
      description: "Why the content violates the guidelines, or null"
    }
  },
  required: %w[is_violating category explanation_if_violating],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :system,
      content: "Determine whether the user input violates the guidelines and explain any violation."
    },
    {role: :user, content: "How do I prepare for a job interview?"}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "content_compliance",
      description: "Determines whether content violates moderation rules",
      strict: true,
      schema: compliance_schema
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "system",
        "content": "Determine if the user input violates specific guidelines and explain if they do."
      },
      {
        "role": "user",
        "content": "How do I prepare for a job interview?"
      }
    ],
    "text": {
      "format": {
        "type": "json_schema",
        "name": "content_compliance",
        "description": "Determines if content is violating specific moderation rules",
        "schema": {
          "type": "object",
          "properties": {
            "is_violating": {
              "type": "boolean",
              "description": "Indicates if the content is violating guidelines"
            },
            "category": {
              "type": ["string", "null"],
              "description": "Type of violation, if the content is violating guidelines. Null otherwise.",
              "enum": ["violence", "sexual", "self_harm"]
            },
            "explanation_if_violating": {
              "type": ["string", "null"],
              "description": "Explanation of why the content is violating"
            }
          },
          "required": ["is_violating", "category", "explanation_if_violating"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```



#### 示例响应

```json
{
  "is_violating": false,
  "category": null,
  "explanation_if_violating": null
}
```








如何将结构化输出与 
text.format




步骤 1：定义你的模式

首先，你必须设计模型应遵循的 JSON Schema。请参阅本指南顶部的 [示例](https://developers.openai.com/api/docs/guides/structured-outputs#examples) 以供参考。

虽然结构化输出支持 JSON Schema 的大部分功能，但某些功能由于性能或技术原因不可用。请参阅 [此处](https://developers.openai.com/api/docs/guides/structured-outputs#supported-schemas) 了解详情。

#### JSON Schema 使用技巧

为了最大化模型生成内容的质量，我们建议如下：

- 清晰直观地命名键
- 为结构中的重要键创建清晰的标题和描述
- 创建并使用评估来确定最适合你用例的结构

步骤 2：在 API 调用中提供你的 schema

要使用结构化输出，只需指定




```json
text: { format: { type: "json_schema", "strict": true, "schema": … } }
```


例如：




```javascript
const response = await openai.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  text: {
    format: {
      type: "json_schema",
      name: "math_response",
      schema: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                explanation: { type: "string" },
                output: { type: "string" },
              },
              required: ["explanation", "output"],
              additionalProperties: false,
            },
          },
          final_answer: { type: "string" },
        },
        required: ["steps", "final_answer"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
});

console.log(response.output_text);
```

```python
response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "system",
            "content": "You are a helpful math tutor. Guide the user through the solution step by step.",
        },
        {"role": "user", "content": "how can I solve 8x + 7 = -23"},
    ],
    text={
        "format": {
            "type": "json_schema",
            "name": "math_response",
            "schema": {
                "type": "object",
                "properties": {
                    "steps": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "explanation": {"type": "string"},
                                "output": {"type": "string"},
                            },
                            "required": ["explanation", "output"],
                            "additionalProperties": False,
                        },
                    },
                    "final_answer": {"type": "string"},
                },
                "required": ["steps", "final_answer"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    },
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are a helpful math tutor. Guide the user through the solution step by step.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("how can I solve 8x + 7 = -23")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "math_response", Schema: mathSchema(), Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}

func mathSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"steps":        map[string]any{"type": "array", "items": map[string]any{"type": "object", "properties": map[string]any{"explanation": map[string]any{"type": "string"}, "output": map[string]any{"type": "string"}}, "required": []string{"explanation", "output"}, "additionalProperties": false}},
			"final_answer": map[string]any{"type": "string"},
		},
		"required":             []string{"steps", "final_answer"},
		"additionalProperties": false,
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

Map<String, Object> schema =
    Map.of(
        "type",
        "object",
        "properties",
        Map.of(
            "steps",
                Map.of(
                    "type",
                    "array",
                    "items",
                    Map.of(
                        "type",
                        "object",
                        "properties",
                        Map.of(
                            "explanation", Map.of("type", "string"),
                            "output", Map.of("type", "string")),
                        "required",
                        List.of("explanation", "output"),
                        "additionalProperties",
                        false)),
            "final_answer", Map.of("type", "string")),
        "required",
        List.of("steps", "final_answer"),
        "additionalProperties",
        false);

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "You are a helpful math tutor. Guide the user through the solution step by step.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("How can I solve 8x + 7 = -23?")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("math_response")
                        .strict(true)
                        .schema(
                            JsonValue.from(schema)
                                .convert(ResponseFormatTextJsonSchemaConfig.Schema.class))
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
math_schema = {
  type: :object,
  properties: {
    steps: {
      type: :array,
      items: {
        type: :object,
        properties: {
          explanation: {type: :string},
          output: {type: :string}
        },
        required: %w[explanation output],
        additionalProperties: false
      }
    },
    final_answer: {type: :string}
  },
  required: %w[steps final_answer],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :system,
      content: "You are a helpful math tutor. Guide the user through the solution step by step."
    },
    {role: :user, content: "How can I solve 8x + 7 = -23?"}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "math_response",
      strict: true,
      schema: math_schema
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "system",
        "content": "You are a helpful math tutor. Guide the user through the solution step by step."
      },
      {
        "role": "user",
        "content": "how can I solve 8x + 7 = -23"
      }
    ],
    "text": {
      "format": {
        "type": "json_schema",
        "name": "math_response",
        "schema": {
          "type": "object",
          "properties": {
            "steps": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "explanation": { "type": "string" },
                  "output": { "type": "string" }
                },
                "required": ["explanation", "output"],
                "additionalProperties": false
              }
            },
            "final_answer": { "type": "string" }
          },
          "required": ["steps", "final_answer"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```



**注意：** 使用任何 schema 发出的第一个请求都会因我们的 API 处理该 schema 而增加额外延迟，但使用同一 schema 的后续请求不会再有额外延迟。

步骤 3：处理边界情况

在某些情况下，模型可能无法生成与提供的 JSON schema 匹配的有效响应。

这种情况可能发生在模型因安全原因拒绝回答时，或者例如达到最大 token 限制导致响应不完整时。




```javascript
try {
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: [
      {
        role: "system",
        content:
          "You are a helpful math tutor. Guide the user through the solution step by step.",
      },
      {
        role: "user",
        content: "how can I solve 8x + 7 = -23",
      },
    ],
    max_output_tokens: 50,
    text: {
      format: {
        type: "json_schema",
        name: "math_response",
        schema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  explanation: {
                    type: "string",
                  },
                  output: {
                    type: "string",
                  },
                },
                required: ["explanation", "output"],
                additionalProperties: false,
              },
            },
            final_answer: {
              type: "string",
            },
          },
          required: ["steps", "final_answer"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  if (
    response.status === "incomplete" &&
    response.incomplete_details.reason === "max_output_tokens"
  ) {
    // Handle the case where the model did not return a complete response
    throw new Error("Incomplete response");
  }

  const message = response.output.find((item) => item.type === "message");
  const math_response = message?.content[0];

  if (!math_response) {
    throw new Error("No response content");
  }

  if (math_response.type === "refusal") {
    // handle refusal
    console.log(math_response.refusal);
  } else if (math_response.type === "output_text") {
    console.log(math_response.text);
  } else {
    throw new Error("No response content");
  }
} catch (e) {
  // Handle edge cases
  console.error(e);
}
```

```python
try:
    response = client.responses.create(
        model="gpt-5.6",
        input=[
            {
                "role": "system",
                "content": "You are a helpful math tutor. Guide the user through the solution step by step.",
            },
            {"role": "user", "content": "how can I solve 8x + 7 = -23"},
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "math_response",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "steps": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "explanation": {"type": "string"},
                                    "output": {"type": "string"},
                                },
                                "required": ["explanation", "output"],
                                "additionalProperties": False,
                            },
                        },
                        "final_answer": {"type": "string"},
                    },
                    "required": ["steps", "final_answer"],
                    "additionalProperties": False,
                },
            },
        },
        max_output_tokens=50,
    )

    if (
        response.status == "incomplete"
        and response.incomplete_details.reason == "max_output_tokens"
    ):
        raise Exception("Incomplete response")

    message = next((item for item in response.output if item.type == "message"), None)
    math_response = message.content[0] if message and message.content else None

    if not math_response:
        raise Exception("No response content")

    if math_response.type == "refusal":
        print(math_response.refusal)
    elif math_response.type == "output_text":
        print(math_response.text)
    else:
        raise Exception("No response content")
except Exception as e:
    # handle errors like finish_reason, refusal, content_filter, etc.
    print(e)
```

```go
package main

import (
	"context"
	"errors"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are a helpful math tutor. Guide the user through the solution step by step.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("how can I solve 8x + 7 = -23")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		MaxOutputTokens: openai.Int(1024),
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "math_response", Schema: mathSchema(), Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}
	if response.Status == "incomplete" {
		panic(errors.New("incomplete response"))
	}

	for _, output := range response.Output {
		if output.Type != "message" {
			continue
		}
		for _, content := range output.AsMessage().Content {
			if content.Type == "refusal" {
				fmt.Println(content.AsRefusal().Refusal)
				return
			}
			if content.Type == "output_text" {
				fmt.Println(content.AsOutputText().Text)
				return
			}
		}
	}
	panic(errors.New("no response content"))
}

func mathSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"steps":        map[string]any{"type": "array", "items": map[string]any{"type": "object", "properties": map[string]any{"explanation": map[string]any{"type": "string"}, "output": map[string]any{"type": "string"}}, "required": []string{"explanation", "output"}, "additionalProperties": false}},
			"final_answer": map[string]any{"type": "string"},
		},
		"required":             []string{"steps", "final_answer"},
		"additionalProperties": false,
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseStatus;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "You are a helpful math tutor. Guide the user through the solution step by step.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("How can I solve 8x + 7 = -23?")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("math_response")
                        .strict(true)
                        .schema(
                            ResponseFormatTextJsonSchemaConfig.Schema.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "steps",
                                            Map.of(
                                                "type",
                                                "array",
                                                "items",
                                                Map.of(
                                                    "type",
                                                    "object",
                                                    "properties",
                                                    Map.of(
                                                        "explanation",
                                                        Map.of("type", "string"),
                                                        "output",
                                                        Map.of("type", "string")),
                                                    "required",
                                                    List.of("explanation", "output"),
                                                    "additionalProperties",
                                                    false)),
                                            "final_answer",
                                            Map.of("type", "string"))))
                                .putAdditionalProperty(
                                    "required",
                                    JsonValue.from(List.of("steps", "final_answer")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .build())
        .maxOutputTokens(1_024L)
        .build();

var response = client.responses().create(params);
if (response.status().filter(ResponseStatus.INCOMPLETE::equals).isPresent()) {
  throw new IllegalStateException("Incomplete response");
}

var content =
    response.output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No response content"));

if (content.refusal().isPresent()) {
  System.out.println(content.refusal().orElseThrow().refusal());
} else {
  System.out.println(
      content
          .outputText()
          .orElseThrow(() -> new IllegalStateException("No response content"))
          .text());
}
```

```ruby
require "openai"

client = OpenAI::Client.new
step_schema = {
  type: :object,
  properties: {
    explanation: {type: :string},
    output: {type: :string}
  },
  required: %w[explanation output],
  additionalProperties: false
}
math_schema = {
  type: :object,
  properties: {
    steps: {type: :array, items: step_schema},
    final_answer: {type: :string}
  },
  required: %w[steps final_answer],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :system,
      content: "You are a helpful math tutor. Guide the user through the solution step by step."
    },
    {role: :user, content: "How can I solve 8x + 7 = -23?"}
  ],
  max_output_tokens: 1_024,
  text: {
    format: {
      type: :json_schema,
      name: "math_response",
      strict: true,
      schema: math_schema
    }
  }
)

if response.status == OpenAI::Responses::ResponseStatus::INCOMPLETE
  raise "Incomplete response"
end

message = response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputMessage)
end
unless message.is_a?(OpenAI::Models::Responses::ResponseOutputMessage)
  raise "No response message"
end

content = message.content.fetch(0)
if content.is_a?(OpenAI::Models::Responses::ResponseOutputRefusal)
  puts(content.refusal)
else
  puts(content.text)
end
```







使用结构化输出时的拒绝



当使用结构化输出处理用户生成的输入时，OpenAI 模型偶尔会出于安全原因拒绝执行请求。由于拒绝不一定遵循你在 `response_format`，中提供的 schema，因此 API 响应将包含一个名为 `refusal` 的新字段，以指示模型拒绝了该请求。

当 `refusal` 属性出现在输出对象中时，你可以拒绝在 UI 中呈现，或在消费响应的代码中包含条件逻辑来处理拒绝请求的情况。




```javascript
const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const response = await openai.responses.parse({
  model: "gpt-5.6",
  input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  text: {
    format: zodTextFormat(MathReasoning, "math_response"),
  },
});

for (const output of response.output) {
  if (output.type !== "message") {
    continue;
  }

  for (const item of output.content) {
    if (item.type == "refusal") {
      // If the model refuses to respond, you will get a refusal message
      console.log(item.refusal);
      continue;
    }

    if (!item.parsed) {
      throw new Error("Could not parse response");
    }

    console.log(item.parsed);
  }
}
```

```python
class Step(BaseModel):
    explanation: str
    output: str


class MathReasoning(BaseModel):
    steps: list[Step]
    final_answer: str


response = client.responses.parse(
    model="gpt-5.6",
    input=[
        {
            "role": "system",
            "content": "You are a helpful math tutor. Guide the user through the solution step by step.",
        },
        {"role": "user", "content": "how can I solve 8x + 7 = -23"},
    ],
    text_format=MathReasoning,
)

for output in response.output:
    if output.type != "message":
        continue

    for item in output.content:
        if item.type == "refusal":
            # If the model refuses to respond, you will get a refusal message
            print(item.refusal)
            continue

        if not item.parsed:
            raise Exception("Could not parse response")

        print(item.parsed)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are a helpful math tutor. Guide the user through the solution step by step.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("how can I solve 8x + 7 = -23")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "math_response", Schema: mathSchema(), Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}

	for _, output := range response.Output {
		if output.Type != "message" {
			continue
		}
		for _, content := range output.AsMessage().Content {
			if content.Type == "refusal" {
				fmt.Println(content.AsRefusal().Refusal)
				continue
			}
			fmt.Println(content.AsOutputText().Text)
		}
	}
}

func mathSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"steps":        map[string]any{"type": "array", "items": map[string]any{"type": "object", "properties": map[string]any{"explanation": map[string]any{"type": "string"}, "output": map[string]any{"type": "string"}}, "required": []string{"explanation", "output"}, "additionalProperties": false}},
			"final_answer": map[string]any{"type": "string"},
		},
		"required":             []string{"steps", "final_answer"},
		"additionalProperties": false,
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

Map<String, Object> schema =
    Map.of(
        "type",
        "object",
        "properties",
        Map.of(
            "steps",
                Map.of(
                    "type",
                    "array",
                    "items",
                    Map.of(
                        "type",
                        "object",
                        "properties",
                        Map.of(
                            "explanation", Map.of("type", "string"),
                            "output", Map.of("type", "string")),
                        "required",
                        List.of("explanation", "output"),
                        "additionalProperties",
                        false)),
            "final_answer", Map.of("type", "string")),
        "required",
        List.of("steps", "final_answer"),
        "additionalProperties",
        false);

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "You are a helpful math tutor. Guide the user through the solution step by step.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("How can I solve 8x + 7 = -23?")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("math_reasoning")
                        .strict(true)
                        .schema(
                            JsonValue.from(schema)
                                .convert(ResponseFormatTextJsonSchemaConfig.Schema.class))
                        .build())
                .build())
        .build();

var response = client.responses().create(params);
for (var output : response.output()) {
  if (output.message().isEmpty()) continue;
  for (var content : output.message().orElseThrow().content()) {
    if (content.refusal().isPresent()) {
      System.out.println(content.refusal().orElseThrow().refusal());
    } else {
      content.outputText().ifPresent(text -> System.out.println(text.text()));
    }
  }
}
```

```ruby
require "openai"

client = OpenAI::Client.new
math_schema = {
  type: :object,
  properties: {
    steps: {
      type: :array,
      items: {
        type: :object,
        properties: {
          explanation: {type: :string},
          output: {type: :string}
        },
        required: %w[explanation output],
        additionalProperties: false
      }
    },
    final_answer: {type: :string}
  },
  required: %w[steps final_answer],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :system,
      content: "You are a helpful math tutor. Guide the user through the solution step by step."
    },
    {role: :user, content: "How can I solve 8x + 7 = -23?"}
  ],
  text: {
    format: {
      type: :json_schema,
      name: "math_response",
      strict: true,
      schema: math_schema
    }
  }
)

response.output.each do |item|
  next unless item.is_a?(OpenAI::Models::Responses::ResponseOutputMessage)

  item.content.each do |content|
    case content
    when OpenAI::Models::Responses::ResponseOutputRefusal
      puts(content.refusal)
    when OpenAI::Models::Responses::ResponseOutputText
      puts(content.text)
    end
  end
end
```



拒绝时的 API 响应如下所示：




```json
{
  "id": "resp_1234567890",
  "object": "response",
  "created_at": 1721596428,
  "status": "completed",
  "completed_at": 1721596429,
  "error": null,
  "incomplete_details": null,
  "input": [],
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-4o-2024-08-06",
  "output": [{
    "id": "msg_1234567890",
    "type": "message",
    "role": "assistant",
    "content": [
      // highlight-start
      {
        "type": "refusal",
        "refusal": "I'm sorry, I cannot assist with that request."
      }
      // highlight-end
    ]
  }],
  "usage": {
    "input_tokens": 81,
    "output_tokens": 11,
    "total_tokens": 92,
    "output_tokens_details": {
      "reasoning_tokens": 0,
    }
  },
}
```




提示和最佳实践



#### 处理用户生成的输入

如果你的应用使用用户生成输入，请确保你的提示中包含如何处理输入无法产生有效响应情况的说明。

模型总是会尝试遵循所提供的 schema，如果输入与 schema 完全不相关，这可能导致幻觉。

你可以在提示中加入语言，以指定当模型检测到输入与任务不兼容时，希望返回空参数或特定语句。

#### 处理错误

结构化输出仍可能包含错误。如果发现错误，可以尝试调整指令、在系统指令中提供示例，或将任务拆分为更简单的子任务。请参阅 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering) 以获取有关如何调整输入内容的更多指导。

#### 避免JSON模式分歧

为防止你的 JSON Schema 与编程语言中对应的类型发生偏差，我们强烈建议使用原生 Pydantic/zod 开发工具包 支持。

如果你更倾向于直接指定 JSON schema，可以添加 CI 规则，在 JSON schema 或底层数据对象被编辑时发出警告，或者添加一个 CI 步骤，从类型定义自动生成 JSON Schema（反之亦然）。

## 流式传输



你可以使用流式处理在模型响应或函数调用参数生成时进行处理，并将其解析为结构化数据。

这样，你无需等待整个响应完成即可进行处理。
如果你希望逐条显示 JSON 字段，或在函数调用参数可用时立即处理，这一点尤其有用。

我们建议依靠 SDK 来处理结构化输出的流式传输。




```javascript
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const EntitiesSchema = z.object({
  attributes: z.array(z.string()),
  colors: z.array(z.string()),
  animals: z.array(z.string()),
});

const openai = new OpenAI();
const stream = openai.responses
  .stream({
    model: "gpt-5.6",
    input: [
      { role: "user", content: "What's the weather like in Paris today?" },
    ],
    text: {
      format: zodTextFormat(EntitiesSchema, "entities"),
    },
  })
  .on("response.refusal.delta", (event) => {
    process.stdout.write(event.delta);
  })
  .on("response.output_text.delta", (event) => {
    process.stdout.write(event.delta);
  })
  .on("response.output_text.done", () => {
    process.stdout.write("\n");
  })
  .on("error", (error) => {
    console.error(error);
  });

const result = await stream.finalResponse();

console.log(result);
```

```python
from typing import List

from openai import OpenAI
from pydantic import BaseModel


class EntitiesModel(BaseModel):
    attributes: List[str]
    colors: List[str]
    animals: List[str]


client = OpenAI()

with client.responses.stream(
    model="gpt-5.6",
    input=[
        {"role": "system", "content": "Extract entities from the input text"},
        {
            "role": "user",
            "content": "The quick brown fox jumps over the lazy dog with piercing blue eyes",
        },
    ],
    text_format=EntitiesModel,
) as stream:
    for event in stream:
        if event.type == "response.refusal.delta":
            print(event.delta, end="")
        elif event.type == "response.output_text.delta":
            print(event.delta, end="")
        elif event.type == "response.error":
            print(event.error, end="")
        elif event.type == "response.completed":
            print("Completed")  # print(event.response.output)

    final_response = stream.get_final_response()
    print(final_response)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseStreamEvent;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content("Extract entities from the input text")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content(
                            "The quick brown fox jumps over the lazy dog with piercing blue eyes")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("entities")
                        .strict(true)
                        .schema(
                            ResponseFormatTextJsonSchemaConfig.Schema.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "attributes",
                                            Map.of(
                                                "type",
                                                "array",
                                                "items",
                                                Map.of("type", "string")),
                                            "colors",
                                            Map.of(
                                                "type",
                                                "array",
                                                "items",
                                                Map.of("type", "string")),
                                            "animals",
                                            Map.of(
                                                "type",
                                                "array",
                                                "items",
                                                Map.of("type", "string")))))
                                .putAdditionalProperty(
                                    "required",
                                    JsonValue.from(List.of("attributes", "colors", "animals")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .build())
        .build();

try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream()
      .forEach(
          event -> {
            event.outputTextDelta().ifPresent(delta -> System.out.print(delta.delta()));
            event.refusalDelta().ifPresent(refusal -> System.out.print(refusal.delta()));
            event.error().ifPresent(error -> System.out.println(error.message()));
            event
                .completed()
                .ifPresent(
                    completed -> {
                      System.out.println("Completed");
                      System.out.println(completed.response());
                    });
          });
}
```



## 支持的架构



结构化输出支持以下 [JSON Schema](https://json-schema.org/docs) 语言子集。

#### 支持的类型

结构化输出支持以下类型：

- 字符串
- 数字
- 布尔值
- 整数
- 对象
- 数组
- 枚举
- anyOf

#### 支持的属性

除指定属性类型外，你还可以指定可选的其他约束条件：

**支持的 `string` 属性：**

- `pattern` — 该字符串必须匹配的正则表达式。
- `format` — 字符串的预定义格式。目前支持：
  - `date-time`
  - `time`
  - `date`
  - `duration`
  - `email`
  - `hostname`
  - `ipv4`
  - `ipv6`
  - `uuid`

**支持的 `number` 属性：**

- `multipleOf` — 该数字必须是此值的倍数。
- `maximum` — 该数字必须小于或等于此值。
- `exclusiveMaximum` — 该数字必须小于此值。
- `minimum` — 该数字必须大于或等于此值。
- `exclusiveMinimum` — 该数字必须大于此值。

**支持的 `array` 属性：**

- `minItems` — 数组必须至少包含这么多项。
- `maxItems` — 数组必须最多包含这么多项。

以下是一些使用这些类型限制的示例：



字符串限制

```json
{
    "name": "user_data",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "The name of the user"
            },
            "username": {
                "type": "string",
                "description": "The username of the user. Must start with @",
                // highlight-start
                "pattern": "^@[a-zA-Z0-9_]+$"
                // highlight-end
            },
            "email": {
                "type": "string",
                "description": "The email of the user",
                // highlight-start
                "format": "email"
                // highlight-end
            }
        },
        "additionalProperties": false,
        "required": [
            "name", "username", "email"
        ]
    }
}
```

  

  

    
数字限制

```json
{
    "name": "weather_data",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The location to get the weather for"
            },
            "unit": {
                "type": ["string", "null"],
                "description": "The unit to return the temperature in",
                "enum": ["F", "C"]
            },
            "value": {
                "type": "number",
                "description": "The actual temperature value in the location",
                // highlight-start
                "minimum": -130,
                "maximum": 130
                // highlight-end
            }
        },
        "additionalProperties": false,
        "required": [
            "location", "unit", "value"
        ]
    }
}
```



请注意，这些限制 [尚不适用于经过微调的
  模型](#some-type-specific-keywords-are-not-yet-supported).

#### 根对象不得 `anyOf` 且必须为对象

请注意，schema 的根级对象必须是对象，而不能使用 `anyOf`。Zod（举一个例子）中出现的一种模式是使用可辨识联合，这会生成一个 `anyOf` 位于顶层。因此，如下代码将无法正常工作：

```javascript
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const BaseResponseSchema = z.object({
  /* ... */
});
const UnsuccessfulResponseSchema = z.object({
  /* ... */
});

const finalSchema = z.discriminatedUnion("status", [
  BaseResponseSchema,
  UnsuccessfulResponseSchema,
]);

// Invalid JSON Schema for Structured Outputs
const json = zodResponseFormat(finalSchema, "final_schema");
```


#### 所有字段必须 `required`

要使用结构化输出，所有字段或函数参数必须指定为 `required`.

```json
{
    "name": "get_weather",
    "description": "Fetches the weather in the given location",
    "strict": true,
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The location to get the weather for"
            },
            "unit": {
                "type": "string",
                "description": "The unit to return the temperature in",
                "enum": ["F", "C"]
            }
        },
        "additionalProperties": false,
        // highlight-start
        "required": ["location", "unit"]
        // highlight-end
    }
}
```


虽然所有字段都必须为必填（且模型会为每个参数返回一个值），但可以通过使用联合类型配合 `null`.

```json
{
    "name": "get_weather",
    "description": "Fetches the weather in the given location",
    "strict": true,
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The location to get the weather for"
            },
            "unit": {
                // highlight-start
                "type": ["string", "null"],
                // highlight-end
                "description": "The unit to return the temperature in",
                "enum": ["F", "C"]
            }
        },
        "additionalProperties": false,
        "required": [
            "location", "unit"
        ]
    }
}
```


#### 对象的嵌套深度和大小存在限制

一个模式总共最多可有 5000 个对象属性，嵌套层级最多可达 10 层。

#### 字符串总大小的限制

在模式中，所有属性名称、定义名称、枚举值和常量值的字符串总长度不能超过 120,000 个字符。

#### 枚举大小的限制

一个 schema 中所有 enum 属性合计最多可以有 1000 个 enum 值。

对于具有字符串值的单个 enum 属性，当 enum 值超过 250 个时，所有 enum 值的总字符串长度不能超过 15,000 个字符。

#### `additionalProperties: false` 必须在对象中始终设置

`additionalProperties` 控制对象是否可以包含 JSON Schema 中未定义的额外键/值。

结构化输出仅支持生成指定的键/值，因此我们要求开发者设置 `additionalProperties: false` 以选择使用结构化输出。

```json
{
    "name": "get_weather",
    "description": "Fetches the weather in the given location",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The location to get the weather for"
            },
            "unit": {
                "type": "string",
                "description": "The unit to return the temperature in",
                "enum": ["F", "C"]
            }
        },
        // highlight-start
        "additionalProperties": false,
        // highlight-end
        "required": [
            "location", "unit"
        ]
    }
}
```


#### 键顺序

使用结构化输出时，输出的生成顺序将与模式中键的排列顺序相同。

#### 部分类型特定的关键词尚不受支持

- **组合方式：** `allOf`, `not`, `dependentRequired`, `dependentSchemas`, `if`, `then`, `else`

对于微调模型，我们另外不支持以下内容：

- **对于字符串：** `minLength`, `maxLength`, `pattern`, `format`
- **对于数字：** `minimum`, `maximum`, `multipleOf`
- **对于对象：** `patternProperties`
- **对于数组：** `minItems`, `maxItems`

如果你通过提供 `strict: true` 并调用API时使用了不受支持的 JSON Schema，你将收到一个错误。

#### 对于 `anyOf`，嵌套的模式各自必须是符合此子集的有效 JSON Schema

以下是一个支持的 anyOf 模式示例：

```json
{
    "type": "object",
    "properties": {
        "item": {
            "anyOf": [
                {
                    "type": "object",
                    "description": "The user object to insert into the database",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the user"
                        },
                        "age": {
                            "type": "number",
                            "description": "The age of the user"
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "name",
                        "age"
                    ]
                },
                {
                    "type": "object",
                    "description": "The address object to insert into the database",
                    "properties": {
                        "number": {
                            "type": "string",
                            "description": "The number of the address. Eg. for 123 main st, this would be 123"
                        },
                        "street": {
                            "type": "string",
                            "description": "The street name. Eg. for 123 main st, this would be main st"
                        },
                        "city": {
                            "type": "string",
                            "description": "The city of the address"
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "number",
                        "street",
                        "city"
                    ]
                }
            ]
        }
    },
    "additionalProperties": false,
    "required": [
        "item"
    ]
}
```


#### 支持定义

你可以使用定义来定义在整个模式中引用的子模式。以下是一个简单的示例。

```json
{
    "type": "object",
    "properties": {
        "steps": {
            "type": "array",
            "items": {
                "$ref": "#/$defs/step"
            }
        },
        "final_answer": {
            "type": "string"
        }
    },
    "$defs": {
        "step": {
            "type": "object",
            "properties": {
                "explanation": {
                    "type": "string"
                },
                "output": {
                    "type": "string"
                }
            },
            "required": [
                "explanation",
                "output"
            ],
            "additionalProperties": false
        }
    },
    "required": [
        "steps",
        "final_answer"
    ],
    "additionalProperties": false
}
```


#### 支持递归模式

使用 `#` 表示根递归的示例递归模式。

```json
{
    "name": "ui",
    "description": "Dynamically generated UI",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "description": "The type of the UI component",
                "enum": ["div", "button", "header", "section", "field", "form"]
            },
            "label": {
                "type": "string",
                "description": "The label of the UI component, used for buttons or form fields"
            },
            "children": {
                "type": "array",
                "description": "Nested UI components",
                "items": {
                    "$ref": "#"
                }
            },
            "attributes": {
                "type": "array",
                "description": "Arbitrary attributes for the UI component, suitable for any element",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the attribute, for example onClick or className"
                        },
                        "value": {
                            "type": "string",
                            "description": "The value of the attribute"
                        }
                    },
                    "additionalProperties": false,
                    "required": ["name", "value"]
                }
            }
        },
        "required": ["type", "label", "children", "attributes"],
        "additionalProperties": false
    }
}
```


使用显式递归的示例递归模式：

```json
{
    "type": "object",
    "properties": {
        "linked_list": {
            "$ref": "#/$defs/linked_list_node"
        }
    },
    "$defs": {
        "linked_list_node": {
            "type": "object",
            "properties": {
                "value": {
                    "type": "number"
                },
                "next": {
                    "anyOf": [
                        {
                            "$ref": "#/$defs/linked_list_node"
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "additionalProperties": false,
            "required": [
                "next",
                "value"
            ]
        }
    },
    "additionalProperties": false,
    "required": [
        "linked_list"
    ]
}
```



## JSON 模式

JSON 模式是结构化输出功能的一个更基础版本。虽然
  JSON 模式确保模型输出是有效的 JSON，结构化输出则可靠地
  将模型的输出与你指定的模式匹配。我们建议你在
  用例支持的情况下使用结构化输出。

当 JSON 模式开启时，模型的输出被确保为有效的 JSON，除了一些你应该检测并适当处理的边缘情况。




要使用 Responses API 开启 JSON 模式，你可以设置 `text.format` 为 `{ "type": "json_object" }`。如果你使用函数调用，JSON 模式始终是开启的。


重要说明：

- 使用 JSON 模式时，你必须在对话中通过某种消息（例如系统消息）指示模型生成 JSON。如果你没有包含生成 JSON 的明确指令，模型可能会生成无休止的空白字符流，请求可能会持续运行直到达到令牌限制。为了确保你不会忘记，如果上下文中的某处没有出现字符串 "JSON"，API 将抛出错误。
- JSON 模式不保证输出符合任何特定模式，只保证输出有效且能无错误解析。你应该使用结构化输出以确保输出符合你的模式；如果不可能，则应使用验证库并可能重试，以确保输出符合你期望的模式。
- 你的应用程序必须检测并处理可能导致模型输出不是完整 JSON 对象的边缘情况（见下文）

处理边缘情况

```javascript
const we_did_not_specify_stop_tokens = true;

try {
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      {
        role: "user",
        content:
          "Who won the world series in 2020? Please respond in the format {winner: ...}",
      },
    ],
    text: { format: { type: "json_object" } },
  });

  const message = response.output.find((item) => item.type === "message");
  const messageContent = message?.content[0];

  // Check if the conversation was too long for the context window, resulting in incomplete JSON
  if (
    response.status === "incomplete" &&
    response.incomplete_details.reason === "max_output_tokens"
  ) {
    // your code should handle this error case
  }

  // Check if the OpenAI safety system refused the request and generated a refusal instead
  if (messageContent?.type === "refusal") {
    // your code should handle this error case
    // In this case, the .content field will contain the explanation (if any) that the model generated for why it is refusing
    console.log(messageContent.refusal);
  }

  // Check if the model's output included restricted content, so the generation of JSON was halted and may be partial
  if (
    response.status === "incomplete" &&
    response.incomplete_details.reason === "content_filter"
  ) {
    // your code should handle this error case
  }

  if (response.status === "completed") {
    // In this case the model has either successfully finished generating the JSON object according to your schema, or the model generated one of the tokens you provided as a "stop token"

    if (we_did_not_specify_stop_tokens) {
      // If you didn't specify any stop tokens, then the generation is complete and the content key will contain the serialized JSON object
      // This will parse successfully and should now contain  {"winner": "Los Angeles Dodgers"}
      console.log(JSON.parse(response.output_text));
    } else {
      // Check if the response.output_text ends with one of your stop tokens and handle appropriately
    }
  }
} catch (e) {
  // Your code should handle errors here, for example a network error calling the API
  console.error(e);
}
```

```python
we_did_not_specify_stop_tokens = True

try:
    response = client.responses.create(
        model="gpt-5.6",
        input=[
            {
                "role": "system",
                "content": "You are a helpful assistant designed to output JSON.",
            },
            {
                "role": "user",
                "content": 'Who won the World Series in 2020? Respond as {"winner": "team name"}.',
            },
        ],
        text={"format": {"type": "json_object"}},
    )

    message = next((item for item in response.output if item.type == "message"), None)
    message_content = message.content[0] if message and message.content else None

    # Check if the conversation was too long for the context window, resulting in incomplete JSON
    if (
        response.status == "incomplete"
        and response.incomplete_details.reason == "max_output_tokens"
    ):
        raise RuntimeError("The response was truncated before the JSON completed.")

    # Check if the OpenAI safety system refused the request and generated a refusal instead
    if message_content and message_content.type == "refusal":
        # your code should handle this error case
        # In this case, the .content field will contain the explanation (if any) that the model generated for why it is refusing
        print(message_content.refusal)

    # Check if the model's output included restricted content, so the generation of JSON was halted and may be partial
    if (
        response.status == "incomplete"
        and response.incomplete_details.reason == "content_filter"
    ):
        raise RuntimeError("The response was interrupted by the content filter.")

    if response.status == "completed":
        # In this case the model has either successfully finished generating the JSON object according to your schema, or the model generated one of the tokens you provided as a "stop token"

        if we_did_not_specify_stop_tokens:
            # If you didn't specify any stop tokens, then the generation is complete and the content key will contain the serialized JSON object
            # This will parse successfully and should now contain  "{"winner": "Los Angeles Dodgers"}"
            print(response.output_text)
except Exception as e:
    # Your code should handle errors here, for example a network error calling the API
    print(e)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("You are a helpful assistant designed to output JSON.")},
				responses.EasyInputMessageRoleSystem,
			),
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("Who won the world series in 2020? Please respond in the format {winner: ...}")},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONObject: &shared.ResponseFormatJSONObjectParam{},
		}},
	})
	if err != nil {
		panic(err)
	}

	if response.Status == "incomplete" {
		fmt.Println("The JSON response is incomplete.")
		return
	}
	for _, output := range response.Output {
		if output.Type != "message" {
			continue
		}
		for _, content := range output.AsMessage().Content {
			if content.Type == "refusal" {
				fmt.Println(content.AsRefusal().Refusal)
				return
			}
		}
	}
	if response.Status == "completed" {
		var value map[string]any
		if err := json.Unmarshal([]byte(response.OutputText()), &value); err != nil {
			panic(err)
		}
		fmt.Println(value)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.errors.OpenAIServiceException;
import com.openai.models.ResponseFormatJsonObject;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseStatus;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content("You are a helpful assistant designed to output JSON.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content(
                            "Who won the World Series in 2020? Respond in the format {winner: ...}.")
                        .build())))
        .text(
            ResponseTextConfig.builder()
                .format(ResponseFormatJsonObject.builder().build())
                .build())
        .build();

try {
  var response = client.responses().create(params);
  if (response.status().filter(ResponseStatus.INCOMPLETE::equals).isPresent()) {
    String reason =
        response
            .incompleteDetails()
            .flatMap(details -> details.reason())
            .map(Object::toString)
            .orElse("unknown");
    System.out.println("The JSON response is incomplete. Reason: " + reason);
    return;
  }

  for (var output : response.output()) {
    if (output.message().isEmpty()) continue;
    for (var content : output.message().orElseThrow().content()) {
      if (content.refusal().isPresent()) {
        System.out.println(content.refusal().orElseThrow().refusal());
        return;
      }
      if (response.status().filter(ResponseStatus.COMPLETED::equals).isPresent()) {
        content.outputText().ifPresent(text -> System.out.println(text.text()));
      }
    }
  }
} catch (OpenAIServiceException error) {
  System.out.println("Request failed: " + error.getMessage());
}
```

```ruby
require "json"
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {role: :system, content: "You are a helpful assistant designed to output JSON."},
    {
      role: :user,
      content: "Who won the World Series in 2020? Respond in the format {winner: ...}."
    }
  ],
  text: {format: {type: :json_object}}
)

if response.status == OpenAI::Responses::ResponseStatus::INCOMPLETE
  warn("The JSON response is incomplete.")
else
  refusal = response.output
    .grep(OpenAI::Models::Responses::ResponseOutputMessage)
    .flat_map(&:content)
    .find { |content| content.is_a?(OpenAI::Models::Responses::ResponseOutputRefusal) }

  if refusal.is_a?(OpenAI::Models::Responses::ResponseOutputRefusal)
    puts(refusal.refusal)
  elsif response.status == OpenAI::Responses::ResponseStatus::COMPLETED
    puts(JSON.pretty_generate(JSON.parse(response.output_text)))
  end
end
```

## 资源

要了解有关结构化输出的更多信息，我们建议浏览以下资源：

- 查看我们的 [入门食谱](https://developers.openai.com/cookbook/examples/structured_outputs_intro) 关于结构化输出
- 学习 [如何构建多智能体系统](https://developers.openai.com/cookbook/examples/structured_outputs_multi_agent) 使用结构化输出