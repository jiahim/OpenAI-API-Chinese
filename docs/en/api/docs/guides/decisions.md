# Decisions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The Decisions API evaluates text, images, or both and returns typed answers about 10x faster than the Responses API. Get the probability that a condition is true, a choice from a fixed set, or a score against a rubric. Use those answers to classify content, route requests, and prioritize work in your application.

Try the Decisions API in the [Playground](https://platform.openai.com/decisions) to experiment with questions and inputs before writing code.

The Decisions API is in public beta, and we expect to GA in the coming weeks.
  `gpt-6-luna` is the only model currently available. Use the dedicated `POST
  /v1/decisions` endpoint.

To run the SDK examples below, use these OpenAI SDK versions or later: Python 3.26.0, JavaScript 7.30.0, Go 3.73.0, Ruby 0.101.0, and Java 4.78.0. See [OpenAI SDK](https://developers.openai.com/api/docs/libraries) for installation instructions.

## How decisions work

A request has three parts:

| Field       | Purpose                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `model`     | The model that evaluates the request. Currently, only `gpt-6-luna` is supported.                         |
| `input`     | Shared evidence for the questions: a text string or user messages containing text and images.            |
| `questions` | What to evaluate, including each question's type, instructions, and any allowed choices or score levels. |

The response contains an `answers` array. Give each question a unique `name` to identify its answer; the API echoes that name in the response.

### Choose a question type

| Type        | Use it to                                                       | Main result                                                        |
| ----------- | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `predicate` | Check a condition, such as visible damage or passage relevance. | `probability`: an estimate from 0 to 1 that the condition is true. |
| `choice`    | Select one option, such as a department or content category.    | `choice`: one of your supplied values.                             |
| `score`     | Rate an input against ordered levels, such as issue severity.   | `score`: the probability-weighted average of the level indices.    |

Both `choice` and `score` return probabilities over discrete options. Use `choice` for categories without an order, such as departments. Use `score` for ordered levels, such as severity; it takes the probability-weighted average of their numeric indices to produce a score that can fall between levels.

Use Decisions when your application needs one of these answer types. Use [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) with the Responses API when you need to generate an object that follows your own JSON schema, such as extracted fields or a written explanation, or [function calling](https://developers.openai.com/api/docs/guides/function-calling) when you need a model to request a tool call with arguments.

## Check an image for visible damage

Use a `predicate` question to check a product photo for visible damage. This request combines the image with instructions to look for a crack, tear, or dent.



Check an image for visible damage

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


An illustrative response excerpt:

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

The `probability` is the model's estimate that the condition is true. Use it to flag photos for review based on a threshold you choose.

Images must be inline base64 data URLs. Hosted HTTP or HTTPS image URLs and `file_id` inputs aren't supported by this endpoint. Combine `input_text` and `input_image` parts in a user message to evaluate images together with instructions or other context.

## Select from fixed options

A `choice` question selects one value from the options you provide. Use distinct values and descriptions that explain when each option applies.



This request routes a customer complaint:

Route a customer complaint

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


An illustrative response excerpt:

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

The answer's `choice` field contains a supplied value, here `"billing"`. It also includes a `probabilities` array for the options and a `confidence` field. See [Interpret the answers](#interpret-the-answers) for guidance on setting thresholds.

Include a fallback option such as `"other"` when your categories don't cover every possible input. Your application can send that result to a general review queue.

## Score against a rubric

A `score` question evaluates an input against ordered `levels`. Define the criteria for each level and arrange them from lowest to highest.



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


An illustrative response excerpt:

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

The answer also includes `confidence` and the per-level `probabilities`. The score summarizes the distribution across levels. Use `choice` to select a single category.

## Ask multiple questions

Put independent questions in the same `questions` array to evaluate shared input. For a product photo, you could check for damage and classify the product category in one request. Each question can use a different type.

For decisions that depend on an earlier answer, send separate requests. For example, check for damage first, then use the result to decide whether to request a repair category.

Write questions around observable criteria. Separate different concerns into different questions, give choices distinct meanings, and define score levels so that adjacent levels have distinct criteria.

## Interpret the answers

Predicates return the estimated probability that a condition is true. Choice and score answers return a probability distribution and a separate `confidence` field.

Use labeled examples from your application to set thresholds for routing, filtering, or review. Choose thresholds based on the cost of false positives and false negatives.

## Pricing and availability

With `gpt-6-luna`, input costs **$0.10 per 1M tokens**. You pay only for input tokens: there are no cache-read, cache-write, or output-token charges.

Regional processing premiums and long-context input pricing multipliers apply. These rates apply to `/v1/decisions`; other requests using `gpt-6-luna` follow the applicable [model and processing-tier pricing](https://developers.openai.com/api/docs/pricing).

The Decisions API supports Zero Data Retention (ZDR) and HIPAA use for eligible customers. Data residency and regional processing are supported in the United States and Europe (EEA + Switzerland). See [data controls](https://developers.openai.com/api/docs/guides/your-data) for eligibility requirements, required agreements, and limitations.

## Add voice control

Use [client delegation with the Live API](https://developers.openai.com/api/docs/guides/decisions-voice) to choose actions from voice requests and report their results to the user.