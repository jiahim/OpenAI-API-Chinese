# 决策

> 如需查看完整的文档索引,请参阅 [llms.txt](/llms.txt). 你可以在页面 URL 末尾添加 `.md` 来获取相应文档页面的 Markdown 版本。

Decisions API 可以评估文本、图像或两者，并在速度上比 Responses API 快约 10 倍，返回类型化的答案。它能给出某个条件为真的概率、从固定选项中做出的选择，或针对评分标准的得分。你可以利用这些答案在应用中完成内容分类、请求路由和工作优先级排序。

在 Playground 中试用 Decisions API， [Playground](https://platform.openai.com/decisions) 在编写代码前先尝试不同的问题和输入。

Decisions API 目前处于公开测试阶段，预计将在未来几周内正式发布。
  `gpt-6-luna` 是当前唯一可用的模型。请使用专用的 `POST
  /v1/decisions` 接口。

若要运行下方的 SDK 示例，请使用以下 OpenAI SDK 版本或更高版本：Python 3.26.0、JavaScript 7.30.0、Go 3.73.0、Ruby 0.101.0 和 Java 4.78.0。请参阅 [OpenAI SDK](https://developers.openai.com/api/docs/libraries) 获取安装说明。

## 决策是如何运作的

一个请求包含三个部分：

| 字段       | 用途                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `model`     | 用于评估请求的模型。目前，仅支持 `gpt-6-luna` 受支持。                         |
| `input`     | 问题的共享证据：文本字符串或包含文本和图像的用户消息。            |
| `questions` | 评估内容，包括每个问题的类型、说明以及任何允许的选项或评分等级。 |

响应包含一个 `answers` 数组。为每个问题指定一个唯一的 `name` 用于标识其答案；API 会在响应中原样回传该名称。

### 选择问题类型

| 类型        | 用途                                                       | 主要结果                                                        |
| ----------- | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `predicate` | 检查某个条件，例如可见的损坏或段落的相关性。 | `probability`：一个介于 0 到 1 之间的估计值，表示该条件为真的可能性。 |
| `choice`    | 选择一个选项，例如部门或内容类别。    | `choice`：你提供的值之一。                             |
| `score`     | 将输入按有序等级进行评定，例如问题的严重程度。   | `score`：等级索引的概率加权平均值。    |

Both `choice` 和 `score` 返回离散选项的概率分布。对于没有顺序的类别（例如部门），使用 `choice` ；对于有顺序的等级（例如严重程度），使用 `score` ，它会按概率加权平均其数值索引，生成一个可以落在两个等级之间的分数。

当你的应用需要以下其中一种答案类型时，使用 Decisions：需要按照自定义 JSON schema 生成对象（例如提取字段或撰写说明）时，使用 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs) 搭配 Responses API；需要让模型请求一次带参数的函数调用时，使用 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 。

## 检查图像是否有可见损坏

使用一个 `predicate` 问题来检查产品照片是否有可见的损伤。该请求将图像与查找裂纹、撕裂或凹痕的指令结合在一起。



检查图像是否有可见的损伤

```bash
IMAGE_BASE64="$(base64 < product.png | tr -d '\r\n')"

curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<JSON
{
  "model": "gpt-6-luna",
  "input": [{
    "role": "user",
    "content": [
      {"type": "input_text", "text": "Inspect the product in this photo."},
      {"type": "input_image", "image_url": "data:image/png;base64,$IMAGE_BASE64"}
    ]
  }],
  "questions": [{
    "type": "predicate",
    "name": "visible_damage",
    "instructions": "Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging."
  }]
}
JSON
```

```javascript
import { readFile } from "node:fs/promises";
import OpenAI from "openai";

const client = new OpenAI();
const imageBase64 = (await readFile("product.png")).toString("base64");
const decision = await client.decisions.create({
  model: "gpt-6-luna",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "Inspect the product in this photo." },
        {
          type: "input_image",
          image_url: `data:image/png;base64,${imageBase64}`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "predicate",
      name: "visible_damage",
      instructions:
        "Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging.",
    },
  ],
});

const answer = decision.answers[0];
if (answer.type === "refusal") {
  console.log(`Refused: ${answer.name}`);
} else if (answer.type === "predicate") {
  console.log(`Visible damage probability: ${answer.probability}`);
}
```

```python
import base64
from pathlib import Path

from openai import OpenAI

client = OpenAI()
image_base64 = base64.b64encode(Path("product.png").read_bytes()).decode("ascii")

decision = client.decisions.create(
    model="gpt-6-luna",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Inspect the product in this photo."},
                {
                    "type": "input_image",
                    "image_url": f"data:image/png;base64,{image_base64}",
                },
            ],
        }
    ],
    questions=[
        {
            "type": "predicate",
            "name": "visible_damage",
            "instructions": (
                "Does the product have visible damage, such as a crack, tear, or dent? "
                "Ignore shadows and damage to the packaging."
            ),
        }
    ],
)

answer = decision.answers[0]
if answer.type == "refusal":
    print(f"Refused: {answer.name}")
elif answer.type == "predicate":
    print(f"Visible damage probability: {answer.probability}")
```

```go
package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	image, err := os.ReadFile("product.png")
	if err != nil {
		panic(err)
	}
	client := openai.NewClient()
	decision, err := client.Decisions.New(context.Background(), openai.DecisionNewParams{
		Model: "gpt-6-luna",
		Input: openai.DecisionNewParamsInputUnion{
			OfDecisionInputMessageArray: []openai.DecisionInputMessageParam{{
				Content: openai.DecisionInputMessageContentUnionParam{
					OfParts: []openai.DecisionInputPartUnionParam{
						{OfInputText: &openai.DecisionInputTextParam{Text: "Inspect the product in this photo."}},
						{OfInputImage: &openai.DecisionInputImageParam{
							ImageURL: "data:image/png;base64," + base64.StdEncoding.EncodeToString(image),
						}},
					},
				},
			}},
		},
		Questions: []openai.DecisionNewParamsQuestionUnion{{
			OfPredicate: &openai.DecisionNewParamsQuestionPredicate{
				Name:         openai.String("visible_damage"),
				Instructions: "Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging.",
			},
		}},
	})
	if err != nil {
		panic(err)
	}
	switch answer := decision.Answers[0].AsAny().(type) {
	case openai.DecisionAnswerPredicate:
		fmt.Println(answer.Probability)
	case openai.DecisionAnswerRefusal:
		fmt.Printf("Decision refused for %s\n", answer.Name)
	default:
		panic("unexpected answer type")
	}
}
```

```java
import com.openai.models.decisions.DecisionCreateParams;
import com.openai.models.decisions.DecisionInputImage;
import com.openai.models.decisions.DecisionInputMessage;
import com.openai.models.decisions.DecisionInputPart;
import com.openai.models.decisions.DecisionInputText;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

String imageBase64 =
    Base64.getEncoder().encodeToString(Files.readAllBytes(Path.of("product.png")));
var message =
    DecisionInputMessage.builder()
        .contentOfParts(
            List.of(
                DecisionInputPart.ofInputText(
                    DecisionInputText.builder()
                        .text("Inspect the product in this photo.")
                        .build()),
                DecisionInputPart.ofInputImage(
                    DecisionInputImage.builder()
                        .imageUrl("data:image/png;base64," + imageBase64)
                        .build())))
        .build();
var decision =
    client
        .decisions()
        .create(
            DecisionCreateParams.builder()
                .model("gpt-6-luna")
                .inputOfDecisionInputMessages(List.of(message))
                .addQuestion(
                    DecisionCreateParams.Question.Predicate.builder()
                        .name("visible_damage")
                        .instructions(
                            "Does the product have visible damage, such as a crack, tear, or"
                                + " dent? Ignore shadows and damage to the packaging.")
                        .build())
                .build());

var answer = decision.answers().get(0);
if (answer.isRefusal()) {
  System.out.println("Refused: " + answer.asRefusal().name().orElse("visible_damage"));
} else {
  System.out.println(answer.asPredicate().probability());
}
```

```ruby
require "base64"
require "openai"

image_base64 = Base64.strict_encode64(File.binread("product.png"))
client = OpenAI::Client.new

decision = client.decisions.create(
  model: "gpt-6-luna",
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_text,
          text: "Inspect the product in this photo."
        },
        {
          type: :input_image,
          image_url: "data:image/png;base64,#{image_base64}"
        }
      ]
    }
  ],
  questions: [
    {
      type: :predicate,
      name: "visible_damage",
      instructions: "Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging."
    }
  ]
)

answer = decision.answers.fetch(0)
case answer
when OpenAI::Models::Decision::Answer::Predicate
  puts(answer.probability)
when OpenAI::Models::Decision::Answer::Refusal
  warn("Decision refused for #{answer.name}")
else
  raise("Unexpected answer type: #{answer.type}")
end
```


一段示例性的响应摘录：

```json
{
  "answers": [
    {
      "type": "predicate",
      "name": "visible_damage",
      "probability": 0.92
    }
  ]
}
```

该 `probability` 是模型对该状况为真的估计值。使用它根据你选择的阈值来标记需要复核的照片。

图像必须是内联的 base64 数据 URL。托管的 HTTP 或 HTTPS 图像 URL 和 `file_id` 输入不被此端点支持。结合 `input_text` 和 `input_image` 部分在用户消息中，以将图像与指令或其他上下文一起评估。

## 从固定选项中选择

一个 `choice` question 从你提供的选项中选择一个值。请使用不同的值与描述，以说明每个选项的适用场景。



此请求会路由一条客户投诉：

路由一条客户投诉

```bash
curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-luna",
    "input": "I was charged twice for my order.",
    "questions": [{
      "type": "choice",
      "name": "department",
      "instructions": "Which department should handle this complaint?",
      "choices": [
        {"value": "billing", "description": "Payments, invoices, and refunds."},
        {"value": "technical", "description": "Problems using the product."},
        {"value": "shipping", "description": "Delivery and tracking."},
        {"value": "other", "description": "Requests outside these categories."}
      ]
    }]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const decision = await client.decisions.create({
  model: "gpt-6-luna",
  input: "I was charged twice for my order.",
  questions: [
    {
      type: "choice",
      name: "department",
      instructions: "Which department should handle this complaint?",
      choices: [
        { value: "billing", description: "Payments, invoices, and refunds." },
        { value: "technical", description: "Problems using the product." },
        { value: "shipping", description: "Delivery and tracking." },
        { value: "other", description: "Requests outside these categories." },
      ],
    },
  ],
});

const answer = decision.answers[0];
if (answer.type === "refusal") {
  console.log(`Refused: ${answer.name}`);
} else if (answer.type === "choice") {
  console.log(
    `Department: ${answer.choice} (confidence: ${answer.confidence})`
  );
}
```

```python
from openai import OpenAI

client = OpenAI()
decision = client.decisions.create(
    model="gpt-6-luna",
    input="I was charged twice for my order.",
    questions=[
        {
            "type": "choice",
            "name": "department",
            "instructions": "Which department should handle this complaint?",
            "choices": [
                {"value": "billing", "description": "Payments, invoices, and refunds."},
                {"value": "technical", "description": "Problems using the product."},
                {"value": "shipping", "description": "Delivery and tracking."},
                {"value": "other", "description": "Requests outside these categories."},
            ],
        }
    ],
)

answer = decision.answers[0]
if answer.type == "refusal":
    print(f"Refused: {answer.name}")
elif answer.type == "choice":
    print(f"Department: {answer.choice} (confidence: {answer.confidence})")
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	decision, err := client.Decisions.New(context.Background(), openai.DecisionNewParams{
		Model: "gpt-6-luna",
		Input: openai.DecisionNewParamsInputUnion{OfString: openai.String("I was charged twice for my order.")},
		Questions: []openai.DecisionNewParamsQuestionUnion{{
			OfChoice: &openai.DecisionNewParamsQuestionChoice{
				Name:         openai.String("department"),
				Instructions: "Which department should handle this complaint?",
				Choices: []openai.DecisionNewParamsQuestionChoiceChoice{
					{
						Value:       openai.DecisionNewParamsQuestionChoiceChoiceValueUnion{OfString: openai.String("billing")},
						Description: openai.String("Payments, invoices, and refunds."),
					},
					{
						Value:       openai.DecisionNewParamsQuestionChoiceChoiceValueUnion{OfString: openai.String("technical")},
						Description: openai.String("Problems using the product."),
					},
					{
						Value:       openai.DecisionNewParamsQuestionChoiceChoiceValueUnion{OfString: openai.String("shipping")},
						Description: openai.String("Delivery and tracking."),
					},
					{
						Value:       openai.DecisionNewParamsQuestionChoiceChoiceValueUnion{OfString: openai.String("other")},
						Description: openai.String("Requests outside these categories."),
					},
				},
			},
		}},
	})
	if err != nil {
		panic(err)
	}
	switch answer := decision.Answers[0].AsAny().(type) {
	case openai.DecisionAnswerChoice:
		fmt.Println(answer.Choice.AsString(), answer.Confidence, answer.Probabilities)
	case openai.DecisionAnswerRefusal:
		fmt.Printf("Decision refused for %s\n", answer.Name)
	default:
		panic("unexpected answer type")
	}
}
```

```java
import com.openai.models.decisions.DecisionChoiceOption;
import com.openai.models.decisions.DecisionCreateParams;
import com.openai.models.decisions.DecisionCreateParams.Question.Choice;

var decision =
    client
        .decisions()
        .create(
            DecisionCreateParams.builder()
                .model("gpt-6-luna")
                .input("I was charged twice for my order.")
                .addQuestion(
                    Choice.builder()
                        .name("department")
                        .instructions("Which department should handle this complaint?")
                        .addChoice(
                            DecisionChoiceOption.builder()
                                .value("billing")
                                .description("Payments, invoices, and refunds.")
                                .build())
                        .addChoice(
                            DecisionChoiceOption.builder()
                                .value("technical")
                                .description("Problems using the product.")
                                .build())
                        .addChoice(
                            DecisionChoiceOption.builder()
                                .value("shipping")
                                .description("Delivery and tracking.")
                                .build())
                        .addChoice(
                            DecisionChoiceOption.builder()
                                .value("other")
                                .description("Requests outside these categories.")
                                .build())
                        .build())
                .build());

var answer = decision.answers().get(0);
if (answer.isRefusal()) {
  System.out.println("Refused: " + answer.asRefusal().name().orElse("department"));
} else {
  var choice = answer.asChoice();
  System.out.println(choice.choice().asString());
  System.out.println(choice.probabilities());
  System.out.println(choice.confidence());
}
```

```ruby
require "openai"

client = OpenAI::Client.new
decision = client.decisions.create(
  model: "gpt-6-luna",
  input: "I was charged twice for my order.",
  questions: [
    {
      type: :choice,
      name: "department",
      instructions: "Which department should handle this complaint?",
      choices: [
        {
          value: "billing",
          description: "Payments, invoices, and refunds."
        },
        {
          value: "technical",
          description: "Problems using the product."
        },
        {
          value: "shipping",
          description: "Delivery and tracking."
        },
        {
          value: "other",
          description: "Requests outside these categories."
        }
      ]
    }
  ]
)

answer = decision.answers.fetch(0)
case answer
when OpenAI::Models::Decision::Answer::Choice
  puts(answer.choice, answer.confidence, answer.probabilities)
when OpenAI::Models::Decision::Answer::Refusal
  warn("Decision refused for #{answer.name}")
else
  raise("Unexpected answer type: #{answer.type}")
end
```


一段示例性的响应摘录：

```json
{
  "answers": [
    {
      "type": "choice",
      "name": "department",
      "choice": "billing",
      "probabilities": [
        { "value": "billing", "probability": 0.95 },
        { "value": "technical", "probability": 0.02 },
        { "value": "shipping", "probability": 0.01 },
        { "value": "other", "probability": 0.02 }
      ],
      "confidence": 0.93
    }
  ]
}
```

答案的 `choice` 字段包含一个提供的值，此处为 `"billing"`。它还包含一个 `probabilities` 数组，用于列出选项，以及一个 `confidence` 字段。请参阅 [解读答案](#interpret-the-answers) ，以获取设置阈值的指导。

包含一个兜底选项，例如 `"other"` ，以应对你的分类未覆盖所有可能输入的情况。你的应用可以将该结果发送到通用复核队列。

## 按评分标准进行评分

一个 `score` question evaluates an input against ordered `levels`. Define the criteria for each level and arrange them from lowest to highest.



Score an issue against severity levels

```bash
curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-luna",
    "input": "Export fails in Safari but works in Chrome.",
    "questions": [{
      "type": "score",
      "name": "severity",
      "instructions": "How severe is this issue?",
      "levels": [
        {"label": "Cosmetic", "description": "Appearance only; no lost functionality."},
        {"label": "Workaround available", "description": "A task fails, but another way works."},
        {"label": "Fully blocked", "description": "A task fails with no workaround."}
      ]
    }]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const decision = await client.decisions.create({
  model: "gpt-6-luna",
  input: "Export fails in Safari but works in Chrome.",
  questions: [
    {
      type: "score",
      name: "severity",
      instructions: "How severe is this issue?",
      levels: [
        {
          label: "Cosmetic",
          description: "Appearance only; no lost functionality.",
        },
        {
          label: "Workaround available",
          description: "A task fails, but another way works.",
        },
        {
          label: "Fully blocked",
          description: "A task fails with no workaround.",
        },
      ],
    },
  ],
});

const answer = decision.answers[0];
if (answer.type === "refusal") {
  console.log(`Refused: ${answer.name}`);
} else if (answer.type === "score") {
  console.log(`Severity: ${answer.score} (confidence: ${answer.confidence})`);
}
```

```python
from openai import OpenAI

client = OpenAI()
decision = client.decisions.create(
    model="gpt-6-luna",
    input="Export fails in Safari but works in Chrome.",
    questions=[
        {
            "type": "score",
            "name": "severity",
            "instructions": "How severe is this issue?",
            "levels": [
                {
                    "label": "Cosmetic",
                    "description": "Appearance only; no lost functionality.",
                },
                {
                    "label": "Workaround available",
                    "description": "A task fails, but another way works.",
                },
                {
                    "label": "Fully blocked",
                    "description": "A task fails with no workaround.",
                },
            ],
        }
    ],
)

answer = decision.answers[0]
if answer.type == "refusal":
    print(f"Refused: {answer.name}")
elif answer.type == "score":
    print(f"Severity: {answer.score} (confidence: {answer.confidence})")
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	decision, err := client.Decisions.New(context.Background(), openai.DecisionNewParams{
		Model: "gpt-6-luna",
		Input: openai.DecisionNewParamsInputUnion{OfString: openai.String("Export fails in Safari but works in Chrome.")},
		Questions: []openai.DecisionNewParamsQuestionUnion{{
			OfScore: &openai.DecisionNewParamsQuestionScore{
				Name:         openai.String("severity"),
				Instructions: "How severe is this issue?",
				Levels: []openai.DecisionNewParamsQuestionScoreLevel{
					{Label: "Cosmetic", Description: openai.String("Appearance only; no lost functionality.")},
					{Label: "Workaround available", Description: openai.String("A task fails, but another way works.")},
					{Label: "Fully blocked", Description: openai.String("A task fails with no workaround.")},
				},
			},
		}},
	})
	if err != nil {
		panic(err)
	}
	switch answer := decision.Answers[0].AsAny().(type) {
	case openai.DecisionAnswerScore:
		fmt.Println(answer.Score, answer.Confidence, answer.Probabilities)
	case openai.DecisionAnswerRefusal:
		fmt.Printf("Decision refused for %s\n", answer.Name)
	default:
		panic("unexpected answer type")
	}
}
```

```java
import com.openai.models.decisions.DecisionCreateParams;
import com.openai.models.decisions.DecisionCreateParams.Question.Score;

var decision =
    client
        .decisions()
        .create(
            DecisionCreateParams.builder()
                .model("gpt-6-luna")
                .input("Export fails in Safari but works in Chrome.")
                .addQuestion(
                    Score.builder()
                        .name("severity")
                        .instructions("How severe is this issue?")
                        .addLevel(
                            Score.Level.builder()
                                .label("Cosmetic")
                                .description("Appearance only; no lost functionality.")
                                .build())
                        .addLevel(
                            Score.Level.builder()
                                .label("Workaround available")
                                .description("A task fails, but another way works.")
                                .build())
                        .addLevel(
                            Score.Level.builder()
                                .label("Fully blocked")
                                .description("A task fails with no workaround.")
                                .build())
                        .build())
                .build());

var answer = decision.answers().get(0);
if (answer.isRefusal()) {
  System.out.println("Refused: " + answer.asRefusal().name().orElse("severity"));
} else {
  var score = answer.asScore();
  System.out.println(score.score());
  System.out.println(score.probabilities());
  System.out.println(score.confidence());
}
```

```ruby
require "openai"

client = OpenAI::Client.new
decision = client.decisions.create(
  model: "gpt-6-luna",
  input: "Export fails in Safari but works in Chrome.",
  questions: [
    {
      type: :score,
      name: "severity",
      instructions: "How severe is this issue?",
      levels: [
        {
          label: "Cosmetic",
          description: "Appearance only; no lost functionality."
        },
        {
          label: "Workaround available",
          description: "A task fails, but another way works."
        },
        {
          label: "Fully blocked",
          description: "A task fails with no workaround."
        }
      ]
    }
  ]
)

answer = decision.answers.fetch(0)
case answer
when OpenAI::Models::Decision::Answer::Score
  puts(answer.score, answer.confidence, answer.probabilities)
when OpenAI::Models::Decision::Answer::Refusal
  warn("Decision refused for #{answer.name}")
else
  raise("Unexpected answer type: #{answer.type}")
end
```


一段示例性的响应摘录：

```json
{
  "answers": [
    {
      "type": "score",
      "name": "severity",
      "score": 1.1,
      "probabilities": [
        { "value": 0, "label": "Cosmetic", "probability": 0.1 },
        { "value": 1, "label": "Workaround available", "probability": 0.7 },
        { "value": 2, "label": "Fully blocked", "probability": 0.2 }
      ],
      "confidence": 0.55
    }
  ]
}
```

Level indices start at 0. Here, 0 means cosmetic, 1 means a workaround is available, and 2 means fully blocked. The returned `score` is a probability-weighted average, so it can fall between levels. In this example, probabilities of 0.1, 0.7, and 0.2 produce a score of 1.1.

答案还包括 `confidence` 以及每个层级 `probabilities`。该评分汇总了各层级的分布情况。使用 `choice` 选择单个类别。

## 提出多个问题

将相互独立的问题放在同一个 `questions` 数组中，以评估共享输入。例如，对于一张商品照片，你可以在一次请求中同时检查损坏情况并对商品类别进行分类。每个问题可以使用不同的类型。

对于依赖前一个回答的决策，请分别发送请求。例如，先检查损坏情况，然后根据该结果决定是否请求维修类别。

围绕可观察的标准编写问题。将不同的关注点拆分为不同的问题；为选项赋予明确的含义；定义评分等级时，使相邻等级具有清晰的区分标准。

## 解读答案

谓词返回一个条件为真的估计概率。Choice 和 score 答案返回一个概率分布以及一个独立的 `confidence` 字段。

使用来自你应用的已标注样本来设置用于路由、过滤或审核的阈值。根据误报和漏报的代价来选择阈值。

## 定价与可用性

通过 `gpt-6-luna`，输入费用为 **每 1M token $0.10**。你只需为输入 token 付费：无缓存读取、缓存写入或输出 token 费用。

区域处理溢价和长上下文输入价格乘数适用。这些费率适用于 `/v1/decisions`；使用 `gpt-6-luna` 的其他请求遵循适用的 [模型与处理层级定价](https://developers.openai.com/api/docs/pricing).

Decisions API 为合格客户支持零数据保留（ZDR）和 HIPAA 使用场景。美国和欧洲（EEA + Switzerland）支持数据驻留与区域处理。详情请参见 [数据控制](https://developers.openai.com/api/docs/guides/your-data) 了解资格要求、所需协议和限制。

## 添加语音控制

使用 [客户端委托API的实时版本](https://developers.openai.com/api/docs/guides/decisions-voice) 从语音请求中选择操作并向用户报告结果。