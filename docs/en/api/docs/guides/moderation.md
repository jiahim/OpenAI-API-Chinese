# Moderation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use OpenAI moderation models to detect harmful content in text and images. You can classify standalone inputs with the [moderation endpoint](https://developers.openai.com/api/reference/resources/moderations) or request moderation scores alongside a generated response. Use the results to enforce your application's policy, such as filtering content, routing a request for review, or intervening with accounts that submit flagged content.

The `omni-moderation-latest` model accepts text and image inputs. It doesn't classify audio. The moderation endpoint is free to use, and image files can be up to 20 MB.

## Choose a moderation workflow

| Workflow                                                        | Use when                                                                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Moderate generated content](#moderate-generated-content)       | Your application generates text with the Responses API or Chat Completions API and needs moderation signals. |
| [Classify standalone inputs](#classify-standalone-inputs)       | Your application needs to classify text or images without generating a model response.                       |
| [Understand moderation results](#understand-moderation-results) | Your application needs to interpret flags, categories, scores, or applied input types.                       |
| [Review supported categories](#review-supported-categories)     | Your application needs to know which harm categories apply to text, images, or both.                         |

## Moderate generated content

When your application needs generated text and moderation scores together, pass a top-level `moderation` object in the generation request. The API returns moderation scores for the model input and generated output without a separate moderation request.

The model still generates normally. Review the moderation results before you show the output to a user or take downstream actions.



Set `moderation.model` when you create a response:

Generate a response with moderation scores

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content:
        "A user asks for instructions to make a harmful weapon. Draft a brief refusal and offer a safer alternative.",
    },
  ],
  moderation: { model: "omni-moderation-latest" },
});

const inputModeration = response.moderation.input;
const outputModeration = response.moderation.output;
if (inputModeration.type === "error") {
  throw new Error(inputModeration.message);
}
if (outputModeration.type === "error") {
  throw new Error(outputModeration.message);
}

console.log(inputModeration.flagged);
console.log(outputModeration.flagged);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": (
                "A user asks for instructions to make a harmful weapon. "
                "Draft a brief refusal and offer a safer alternative."
            ),
        }
    ],
    moderation={"model": "omni-moderation-latest"},
)

input_moderation = response.moderation.input
output_moderation = response.moderation.output
if input_moderation.type == "error":
    raise RuntimeError(input_moderation.message)
if output_moderation.type == "error":
    raise RuntimeError(output_moderation.message)

print(input_moderation.flagged)
print(output_moderation.flagged)
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
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("A user asks for instructions to make a harmful weapon. Draft a brief refusal and offer a safer alternative."),
		},
		Moderation: responses.ResponseNewParamsModeration{
			Model: "omni-moderation-latest",
		},
	})
	if err != nil {
		panic(err)
	}

	switch inputModeration := response.Moderation.Input.AsAny().(type) {
	case responses.ResponseModerationInputModerationResult:
		fmt.Println(inputModeration.Flagged)
	case responses.ResponseModerationInputError:
		panic(errors.New(inputModeration.Message))
	default:
		panic("unexpected input moderation result")
	}
	switch outputModeration := response.Moderation.Output.AsAny().(type) {
	case responses.ResponseModerationOutputModerationResult:
		fmt.Println(outputModeration.Flagged)
	case responses.ResponseModerationOutputError:
		panic(errors.New(outputModeration.Message))
	default:
		panic("unexpected output moderation result")
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "A user asks for instructions to make a harmful weapon. Draft a brief refusal and offer a safer alternative.")
        .putAdditionalBodyProperty(
            "moderation", JsonValue.from(Map.of("model", "omni-moderation-latest")))
        .build();

var response = client.responses().create(params);
JsonValue moderation = response._additionalProperties().get("moderation");
if (moderation == null) {
  throw new IllegalStateException("The response did not include moderation results");
}
Map<?, ?> results = moderation.convert(Map.class);
List<Boolean> flags = new ArrayList<>();
for (String side : List.of("input", "output")) {
  if (!(results.get(side) instanceof Map<?, ?> result)) {
    throw new IllegalStateException("Missing " + side + " moderation result");
  }
  if ("error".equals(result.get("type"))) {
    throw new IllegalStateException(String.valueOf(result.get("message")));
  }
  if (!"moderation_result".equals(result.get("type"))) {
    throw new IllegalStateException("Unexpected " + side + " moderation result type");
  }
  if (!(result.get("flagged") instanceof Boolean flagged)) {
    throw new IllegalStateException("Missing " + side + " moderation flag");
  }
  flags.add(flagged);
}
flags.forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: "A user asks for instructions to make a harmful weapon. Draft a brief refusal and offer a safer alternative.",
  moderation: {model: "omni-moderation-latest"}
)

puts(response.moderation)
```


The Responses API returns an input `moderation_result` object at `response.moderation.input` and an output `moderation_result` object at `response.moderation.output`.





Inline moderation results use the same category fields as a standalone moderation result. Start with `flagged` for a first-pass decision, then inspect `categories` and `category_scores` for logging, routing, audit trails, or human-review queues. A refusal or other safety-aware response can still trigger a flag if it discusses harmful content. Treat moderation scores as signals for your application's policy, not as an automatic blocking decision.

Check the moderation result type before you read scores if your application needs to handle moderation failures. If a moderation step can't complete, the corresponding input or output moderation field can contain an error instead of moderation scores.

For tool-calling requests, moderation covers tool-call arguments and tool outputs when they appear in conversation content. It doesn't cover tool names, tool descriptions, tool schemas, or response-format schemas.

If you stream a generated response, moderation scores arrive after the full generated output is available. They aren't included with partial output deltas.

## Classify standalone inputs

Use the [moderation endpoint](https://developers.openai.com/api/reference/resources/moderations) to classify text or image inputs without generating a model response. The tabs below show how to use the [OpenAI libraries](https://developers.openai.com/api/docs/libraries) and the [`omni-moderation-latest` model](https://developers.openai.com/api/docs/models#moderation):



Moderate text inputs

    

Get classification information for a text input

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const moderation = await openai.moderations.create({
  model: "omni-moderation-latest",
  input: "...text to classify goes here...",
});

console.log(moderation);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.moderations.create(
    model="omni-moderation-latest",
    input="...text to classify goes here...",
)

print(response)
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

	moderation, err := client.Moderations.New(context.Background(), openai.ModerationNewParams{
		Model: openai.ModerationModelOmniModerationLatest,
		Input: openai.ModerationNewParamsInputUnion{
			OfString: openai.String("Text to classify goes here."),
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(moderation.Results[0].Flagged)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.moderations.ModerationCreateParams;

var moderation =
    client
        .moderations()
        .create(
            ModerationCreateParams.builder()
                .model("omni-moderation-latest")
                .input("Text to classify goes here.")
                .build());

System.out.println(moderation.results().get(0).flagged());
```

```ruby
require "openai"

client = OpenAI::Client.new

moderation = client.moderations.create(
  model: OpenAI::Models::ModerationModel::OMNI_MODERATION_LATEST,
  input: "Text to classify goes here."
)

puts(moderation.results.fetch(0).flagged)
```

```bash
curl https://api.openai.com/v1/moderations \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "omni-moderation-latest",
    "input": "...text to classify goes here..."
  }'
```


  

  

    
Moderate images and text

    

Get classification information for image and text input

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const moderation = await openai.moderations.create({
  model: "omni-moderation-latest",
  input: [
    { type: "text", text: "...text to classify goes here..." },
    {
      type: "image_url",
      image_url: {
        url: "https://example.com/image.png",
        // You can also use a Base64 encoded image URL.
        // url: "data:image/jpeg;base64,abcdefg...",
      },
    },
  ],
});

console.log(moderation);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.moderations.create(
    model="omni-moderation-latest",
    input=[
        {"type": "text", "text": "...text to classify goes here..."},
        {
            "type": "image_url",
            "image_url": {
                "url": "https://example.com/image.png",
                # You can also use a Base64 encoded image URL.
                # "url": "data:image/jpeg;base64,abcdefg..."
            },
        },
    ],
)

print(response)
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

	moderation, err := client.Moderations.New(context.Background(), openai.ModerationNewParams{
		Model: openai.ModerationModelOmniModerationLatest,
		Input: openai.ModerationNewParamsInputUnion{
			OfModerationMultiModalArray: []openai.ModerationMultiModalInputUnionParam{
				openai.ModerationMultiModalInputParamOfText("Text to classify goes here."),
				openai.ModerationMultiModalInputParamOfImageURL(openai.ModerationImageURLInputImageURLParam{
					URL: "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
				}),
			},
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(moderation.Results[0].Flagged)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.moderations.ModerationCreateParams;
import com.openai.models.moderations.ModerationImageUrlInput;
import com.openai.models.moderations.ModerationMultiModalInput;
import com.openai.models.moderations.ModerationTextInput;
import java.util.List;

var moderation =
    client
        .moderations()
        .create(
            ModerationCreateParams.builder()
                .model("omni-moderation-latest")
                .inputOfModerationMultiModalArray(
                    List.of(
                        ModerationMultiModalInput.ofText(
                            ModerationTextInput.builder()
                                .text("Text to classify goes here.")
                                .build()),
                        ModerationMultiModalInput.ofImageUrl(
                            ModerationImageUrlInput.builder()
                                .imageUrl(
                                    ModerationImageUrlInput.ImageUrl.builder()
                                        .url(
                                            "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg")
                                        .build())
                                .build())))
                .build());

System.out.println(moderation.results().get(0).flagged());
```

```ruby
require "openai"

client = OpenAI::Client.new

moderation = client.moderations.create(
  model: OpenAI::Models::ModerationModel::OMNI_MODERATION_LATEST,
  input: [
    {type: :text, text: "Text to classify goes here."},
    {
      type: :image_url,
      image_url: {
        url: "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
      }
    }
  ]
)

puts(moderation.results.fetch(0).flagged)
```

```bash
curl https://api.openai.com/v1/moderations \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "omni-moderation-latest",
    "input": [
      { "type": "text", "text": "...text to classify goes here..." },
      {
        "type": "image_url",
        "image_url": {
          "url": "https://example.com/image.png"
        }
      }
    ]
  }'
```



## Understand moderation results

Here's a full example output for an image from a single frame of a war movie. The model identifies indicators of violence in the image, with a `violence` category score greater than 0.8.

```json
{
  "id": "modr-970d409ef3bef3b70c73d8232df86e7d",
  "model": "omni-moderation-latest",
  "results": [
    {
      "flagged": true,
      "categories": {
        "sexual": false,
        "sexual/minors": false,
        "harassment": false,
        "harassment/threatening": false,
        "hate": false,
        "hate/threatening": false,
        "illicit": false,
        "illicit/violent": false,
        "self-harm": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        "violence": true,
        "violence/graphic": false
      },
      "category_scores": {
        "sexual": 2.34135824776394e-7,
        "sexual/minors": 1.6346470245419304e-7,
        "harassment": 0.0011643905680426018,
        "harassment/threatening": 0.0022121340080906377,
        "hate": 3.1999824407395835e-7,
        "hate/threatening": 2.4923252458203563e-7,
        "illicit": 0.0005227032493135171,
        "illicit/violent": 3.682979260160596e-7,
        "self-harm": 0.0011175734280627694,
        "self-harm/intent": 0.0006264858507989037,
        "self-harm/instructions": 7.368592981140821e-8,
        "violence": 0.8599265510337075,
        "violence/graphic": 0.37701736389561064
      },
      "category_applied_input_types": {
        "sexual": ["image"],
        "sexual/minors": [],
        "harassment": [],
        "harassment/threatening": [],
        "hate": [],
        "hate/threatening": [],
        "illicit": [],
        "illicit/violent": [],
        "self-harm": ["image"],
        "self-harm/intent": ["image"],
        "self-harm/instructions": ["image"],
        "violence": ["image"],
        "violence/graphic": ["image"]
      }
    }
  ]
}
```

The JSON response includes fields that describe which categories are present in the input and the model's confidence in each category.

<table>
  <tr>
    <th>Output category</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>`flagged`</td>
    <td>
      Set to `true` if the model classifies the content as potentially harmful,
      `false` otherwise.
    </td>
  </tr>
  <tr>
    <td>`categories`</td>
    <td>
      Contains a dictionary of per-category violation flags. For each category,
      the value is `true` if the model flags the corresponding category as
      violated, `false` otherwise.
    </td>
  </tr>
  <tr>
    <td>`category_scores`</td>
    <td>
      Contains a dictionary of per-category scores. Each score represents the
      model's confidence that the input contains content in the category. The
      value is between 0 and 1, where higher values denote higher confidence.
    </td>
  </tr>
  <tr>
    <td>`category_applied_input_types`</td>
    <td>
      Contains the input types that the category score applies to. For example,
      if the `violence/graphic` category applies to both image and text inputs,
      the `violence/graphic` property is set to `["image", "text"]`.
    </td>
  </tr>
</table>

We plan to continuously upgrade the moderation endpoint's underlying model.
  Therefore, custom policies that rely on `category_scores` may need
  recalibration over time.

## Review supported categories

The table below describes the content categories that the moderation endpoint can detect and the input types that each category supports.

Categories marked as "Text only" do not support image inputs. If you send only
  images (without accompanying text) to the `omni-moderation-latest` model, it
  will return a score of 0 for these unsupported categories. Image files are
  limited to 20 MB.

<table>
  <tr>
    <th>
      **Category**
    </th>
    <th>
      **Description**
    </th>
    <th>
      **Inputs**
    </th>
  </tr>
  <tr>
    <td>`harassment`</td>
    <td>
      Content that expresses, incites, or promotes harassing language towards
      any target.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`harassment/threatening`</td>
    <td>
      Harassment content that also includes violence or serious harm towards any
      target.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`hate`</td>
    <td>
      Content that expresses, incites, or promotes hate based on race, gender,
      ethnicity, religion, nationality, sexual orientation, disability status,
      or caste. Hateful content aimed at non-protected groups (e.g., chess
      players) is harassment.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`hate/threatening`</td>
    <td>
      Hateful content that also includes violence or serious harm towards the
      targeted group based on race, gender, ethnicity, religion, nationality,
      sexual orientation, disability status, or caste.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`illicit`</td>
    <td>
      Content that gives advice or instruction on how to commit illicit acts. A
      phrase like "how to shoplift" would fit this category.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`illicit/violent`</td>
    <td>
      The same types of content flagged by the `illicit` category, but also
      includes references to violence or procuring a weapon.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`self-harm`</td>
    <td>
      Content that promotes, encourages, or depicts acts of self-harm, such as
      suicide, cutting, and eating disorders.
    </td>
    <td>Text and images</td>
  </tr>
  <tr>
    <td>`self-harm/intent`</td>
    <td>
      Content where the speaker expresses that they are engaging or intend to
      engage in acts of self-harm, such as suicide, cutting, and eating
      disorders.
    </td>
    <td>Text and images</td>
  </tr>
  <tr>
    <td>`self-harm/instructions`</td>
    <td>
      Content that encourages performing acts of self-harm, such as suicide,
      cutting, and eating disorders, or that gives instructions or advice on how
      to commit such acts.
    </td>
    <td>Text and images</td>
  </tr>
  <tr>
    <td>`sexual`</td>
    <td>
      Content meant to arouse sexual excitement, such as the description of
      sexual activity, or that promotes sexual services (excluding sex education
      and wellness).
    </td>
    <td>Text and images</td>
  </tr>
  <tr>
    <td>`sexual/minors`</td>
    <td>
      Sexual content that includes an individual who is under 18 years old.
    </td>
    <td>Text only</td>
  </tr>
  <tr>
    <td>`violence`</td>
    <td>Content that depicts death, violence, or physical injury.</td>
    <td>Text and images</td>
  </tr>
  <tr>
    <td>`violence/graphic`</td>
    <td>
      Content that depicts death, violence, or physical injury in graphic
      detail.
    </td>
    <td>Text and images</td>
  </tr>
</table>