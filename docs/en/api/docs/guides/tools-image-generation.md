# Image generation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The image generation tool allows you to generate images using a text prompt, and optionally image inputs. It uses GPT Image models, including `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`, and `gpt-image-1-mini`, and automatically optimizes text inputs for improved performance.

To learn more about image generation, refer to our dedicated [image generation
  guide](https://developers.openai.com/api/docs/guides/image-generation?api=responses).

## Usage

When you include the `image_generation` tool in your request, the model can decide when and how to generate images as part of the conversation, using your prompt and any provided image inputs.

The `image_generation_call` tool call result will include a base64-encoded image.

Generate an image

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

// Save the image to a file
const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("otter.png", Buffer.from(imageBase64, "base64"));
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

# Save the image to a file
image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]
    with open("otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

```go
package main

import (
	"context"
	"encoding/base64"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{}}},
	})
	if err != nil {
		panic(err)
	}
	saveFirstGeneratedImage(response, "otter.png")
}

func saveFirstGeneratedImage(response *responses.Response, filename string) {
	for _, output := range response.Output {
		if output.Type != "image_generation_call" {
			continue
		}
		image, err := base64.StdEncoding.DecodeString(output.AsImageGenerationCall().Result)
		if err != nil {
			panic(err)
		}
		if err := os.WriteFile(filename, image, 0o600); err != nil {
			panic(err)
		}
		return
	}
	panic("response did not include an image generation call")
}
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [{type: :image_generation}]
)

image_call = response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless image_call.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No image generation call returned"
end

encoded_image = image_call.result or raise "No image returned"
File.binwrite("otter.png", Base64.strict_decode64(encoded_image))
```


You can [provide input images](https://developers.openai.com/api/docs/guides/image-generation?image-generation-model=gpt-image#edit-images) using file IDs or base64 data.

To force the image generation tool call, you can set the parameter `tool_choice` to `{"type": "image_generation"}`.

### Tool options

You can configure the following output options as parameters for the [image generation tool](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-tools):

- Size: Image dimensions, for example, 1024 × 1024 or 1024 × 1536
- Quality: Rendering quality, for example, low, medium, or high
- Format: File output format
- Compression: Compression level (0-100%) for JPEG and WebP formats
- Background: Transparent or opaque
- Action: Whether the request should automatically choose, generate, or edit an image

`size`, `quality`, and `background` support the `auto` option, where the model will automatically select the best option based on the prompt.

`gpt-image-2` supports flexible `size` values that meet its [resolution constraints](https://developers.openai.com/api/docs/guides/image-generation#size-and-quality-options). It doesn't currently support transparent backgrounds, so requests with `background: "transparent"` fail.

For more details on available options, refer to the [image generation guide](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

When using the Responses API image generation tool, supported GPT Image models can choose whether to generate a new image or edit one already in the conversation. The optional `action` parameter controls this behavior: keep `action` set to `auto` so the model chooses whether to generate or edit, or set it to `generate` or `edit` to force that behavior. If not specified, the default is `auto`.

### Revised prompt

When using the image generation tool, the mainline model, for example, `gpt-5.5`, will automatically revise your prompt for improved performance.

You can access the revised prompt in the `revised_prompt` field of the image generation call:

```json
{
  "id": "ig_123",
  "type": "image_generation_call",
  "status": "completed",
  "revised_prompt": "A gray tabby cat hugging an otter. The otter is wearing an orange scarf. Both animals are cute and friendly, depicted in a warm, heartwarming style.",
  "result": "..."
}
```

### Prompting tips

Image generation works best when you use terms like `draw` or `edit` in your prompt.

For example, if you want to combine images, instead of saying `combine` or `merge`, you can say something like "edit the first image by adding this element from the second image."

## Multi-turn editing

You can iteratively edit images by referencing previous response or image IDs. This allows you to refine images across conversation turns.



Using previous response ID

    Multi-turn image generation

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}

// Follow up

const response_fwup = await openai.responses.create({
  model: "gpt-5.6",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{ type: "image_generation" }],
});

const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]

    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))


# Follow up

response_fwup = client.responses.create(
    model="gpt-5.6",
    previous_response_id=response.id,
    input="Now make it look realistic",
    tools=[{"type": "image_generation"}],
)

image_data_fwup = [
    output.result
    for output in response_fwup.output
    if output.type == "image_generation_call"
]

if image_data_fwup:
    image_base64 = image_data_fwup[0]
    with open("cat_and_otter_realistic.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

```go
package main

import (
	"context"
	"encoding/base64"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{}}},
	})
	if err != nil {
		panic(err)
	}
	saveFirstGeneratedImage(first, "cat_and_otter.png")

	followUp, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6",
		PreviousResponseID: openai.String(first.ID),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Now make it look realistic"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{}}},
	})
	if err != nil {
		panic(err)
	}
	saveFirstGeneratedImage(followUp, "cat_and_otter_realistic.png")
}

func saveFirstGeneratedImage(response *responses.Response, filename string) {
	for _, output := range response.Output {
		if output.Type != "image_generation_call" {
			continue
		}
		image, err := base64.StdEncoding.DecodeString(output.AsImageGenerationCall().Result)
		if err != nil {
			panic(err)
		}
		if err := os.WriteFile(filename, image, 0o600); err != nil {
			panic(err)
		}
		return
	}
	panic("response did not include an image generation call")
}
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
first = client.responses.create(
  model: "gpt-5.6",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [{type: :image_generation}]
)

first_image = first.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless first_image.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No image generation call returned"
end

encoded_image = first_image.result or raise "No image returned"
File.binwrite("cat_and_otter.png", Base64.strict_decode64(encoded_image))

follow_up = client.responses.create(
  model: "gpt-5.6",
  input: "Now make it look realistic.",
  previous_response_id: first.id,
  tools: [{type: :image_generation}]
)

follow_up_image = follow_up.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless follow_up_image.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No follow-up image generation call returned"
end

encoded_image = follow_up_image.result or raise "No follow-up image returned"
File.binwrite("cat_and_otter_realistic.png", Base64.strict_decode64(encoded_image))
```

  

  

    
Using image ID

    Multi-turn image generation

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation" }],
});

const imageGenerationCalls = response.output.filter(
  (output) => output.type === "image_generation_call"
);

const imageData = imageGenerationCalls.map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  const fs = await import("fs");
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
}

// Follow up

const response_fwup = await openai.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: [{ type: "input_text", text: "Now make it look realistic" }],
    },
    {
      type: "image_generation_call",
      id: imageGenerationCalls[0].id,
    },
  ],
  tools: [{ type: "image_generation" }],
});

const imageData_fwup = response_fwup.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData_fwup.length > 0) {
  const imageBase64 = imageData_fwup[0];
  const fs = await import("fs");
  fs.writeFileSync(
    "cat_and_otter_realistic.png",
    Buffer.from(imageBase64, "base64")
  );
}
```

```python
import openai
import base64

response = openai.responses.create(
    model="gpt-5.6",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation"}],
)

image_generation_calls = [
    output for output in response.output if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
    image_base64 = image_data[0]

    with open("cat_and_otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))


# Follow up

response_fwup = openai.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": [{"type": "input_text", "text": "Now make it look realistic"}],
        },
        {
            "type": "image_generation_call",
            "id": image_generation_calls[0].id,
        },
    ],
    tools=[{"type": "image_generation"}],
)

image_data_fwup = [
    output.result
    for output in response_fwup.output
    if output.type == "image_generation_call"
]

if image_data_fwup:
    image_base64 = image_data_fwup[0]
    with open("cat_and_otter_realistic.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
```

```go
package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{}}},
	})
	if err != nil {
		panic(err)
	}
	call := firstImageGenerationCall(first)
	saveImage("cat_and_otter.png", call.Result)
	input := outputAsInput(first.Output)
	input = append(input, responses.ResponseInputItemParamOfMessage(
		responses.ResponseInputMessageContentListParam{responses.ResponseInputContentParamOfInputText("Now make it look realistic")},
		responses.EasyInputMessageRoleUser,
	))

	followUp, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: input},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{}}},
	})
	if err != nil {
		panic(err)
	}
	saveImage("cat_and_otter_realistic.png", firstImageGenerationCall(followUp).Result)
}

func firstImageGenerationCall(response *responses.Response) responses.ResponseOutputItemImageGenerationCall {
	for _, output := range response.Output {
		if output.Type == "image_generation_call" {
			return output.AsImageGenerationCall()
		}
	}
	panic("response did not include an image generation call")
}

func outputAsInput(output []responses.ResponseOutputItemUnion) []responses.ResponseInputItemUnionParam {
	input := make([]responses.ResponseInputItemUnionParam, 0, len(output))
	for _, item := range output {
		var converted responses.ResponseInputItemUnion
		if err := json.Unmarshal([]byte(item.RawJSON()), &converted); err != nil {
			panic(err)
		}
		input = append(input, converted.ToParam())
	}
	return input
}

func saveImage(filename, encoded string) {
	image, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile(filename, image, 0o600); err != nil {
		panic(err)
	}
}
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
first = client.responses.create(
  model: "gpt-5.6",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [{type: :image_generation}]
)

first_image = first.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless first_image.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No image generation call returned"
end

encoded_image = first_image.result or raise "No image returned"
File.binwrite("cat_and_otter.png", Base64.strict_decode64(encoded_image))

follow_up = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :user,
      content: [{type: :input_text, text: "Now make it look realistic."}]
    },
    {type: :image_generation_call, id: first_image.id}
  ],
  tools: [{type: :image_generation}]
)

follow_up_image = follow_up.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless follow_up_image.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No follow-up image generation call returned"
end

encoded_image = follow_up_image.result or raise "No follow-up image returned"
File.binwrite("cat_and_otter_realistic.png", Base64.strict_decode64(encoded_image))
```



## Streaming

The image generation tool supports streaming partial images while it generates the final result. This provides faster visual feedback for users and improves perceived latency.

You can set the number of partial images (1-3) with the `partial_images` parameter.

Stream an image

```javascript
import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

function saveBase64Image(filename, imageBase64) {
  const imageBuffer = Buffer.from(imageBase64, "base64");
  fs.writeFileSync(filename, imageBuffer);
}

const stream = await openai.responses.create({
  model: "gpt-5.6",
  input:
    "Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",
  stream: true,
  tools: [{ type: "image_generation", partial_images: 2 }],
});

for await (const event of stream) {
  if (event.type === "response.image_generation_call.partial_image") {
    const idx = event.partial_image_index;
    saveBase64Image(`river-partial-${idx}.png`, event.partial_image_b64);
  } else if (event.type === "response.completed") {
    const imageData = event.response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    if (imageData.length > 0) {
      saveBase64Image("river-final.png", imageData[0]);
    }
  }
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()


def save_base64_image(filename, image_base64):
    image_bytes = base64.b64decode(image_base64)
    with open(filename, "wb") as f:
        f.write(image_bytes)


stream = client.responses.create(
    model="gpt-5.6",
    input="Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",
    stream=True,
    tools=[{"type": "image_generation", "partial_images": 2}],
)

for event in stream:
    if event.type == "response.image_generation_call.partial_image":
        idx = event.partial_image_index
        save_base64_image(f"river-partial-{idx}.png", event.partial_image_b64)
    elif event.type == "response.completed":
        image_data = [
            output.result
            for output in event.response.output
            if output.type == "image_generation_call"
        ]

        if image_data:
            save_base64_image("river-final.png", image_data[0])
```

```go
package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	stream := client.Responses.NewStreaming(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{PartialImages: openai.Int(2)}}},
	})
	for stream.Next() {
		event := stream.Current()
		if event.Type == "response.image_generation_call.partial_image" {
			partial := event.AsResponseImageGenerationCallPartialImage()
			saveImage(fmt.Sprintf("river-partial-%d.png", partial.PartialImageIndex), partial.PartialImageB64)
		}
		if event.Type == "response.completed" {
			for _, output := range event.AsResponseCompleted().Response.Output {
				if output.Type == "image_generation_call" {
					saveImage("river-final.png", output.AsImageGenerationCall().Result)
				}
			}
		}
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}

func saveImage(filename, encoded string) {
	image, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile(filename, image, 0o600); err != nil {
		panic(err)
	}
}
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
stream = client.responses.stream(
  model: "gpt-5.6",
  input: "Generate an image of a river made of white owl feathers.",
  tools: [{type: :image_generation, partial_images: 2}]
)

stream.each do |event|
  case event
  when OpenAI::Models::Responses::ResponseImageGenCallPartialImageEvent
    image = Base64.strict_decode64(event.partial_image_b64)
    File.binwrite("river-partial-#{event.partial_image_index}.png", image)
  when OpenAI::Models::Responses::ResponseCompletedEvent
    image_call = event.response.output.find do |item|
      item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
    end
    next unless image_call.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)

    File.binwrite(
      "river-final.png",
      Base64.strict_decode64(image_call.result)
    )
  end
end
```


## Supported models

The following models support the image generation tool:

- `gpt-5.5`
- `gpt-5.4-mini`
- `gpt-5.4-nano`
- `gpt-5.2`
- `gpt-5`
- `gpt-5-nano`
- `o3`
- `gpt-4.1`
- `gpt-4.1-mini`
- `gpt-4.1-nano`
- `gpt-4o`
- `gpt-4o-mini`

The model used for the image generation process is always a GPT Image model, including `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`, and `gpt-image-1-mini`, but these models aren't valid values for the `model` field in the Responses API. Use a text-capable mainline model (for example, `gpt-5.5` or `gpt-5`) with the hosted `image_generation` tool.