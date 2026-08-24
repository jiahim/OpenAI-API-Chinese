# Images and vision

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Overview



  - **[Create images](https://developers.openai.com/api/docs/guides/image-generation)**: Use GPT Image models to generate or edit images.
- **[Process image inputs](#analyze-images)**: Use our models' vision capabilities to analyze images.



In this guide, you will learn about building applications involving images with the OpenAI API.
If you know what you want to build, find your use case below to get started. If you're not sure where to start, continue reading to get an overview.

### A tour of image-related use cases

Recent language models can process image inputs and analyze them—a capability known as **vision**. GPT Image models can use text and image inputs to create new images or edit existing ones.

The OpenAI API offers several endpoints to process images as input or generate them as output, enabling you to build powerful multimodal applications.

| API                                                  | Supported use cases                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| [Responses API](https://developers.openai.com/api/reference/resources/responses)   | Analyze images and use them as input and/or generate images as output |
| [Images API](https://developers.openai.com/api/reference/resources/images)         | Generate images as output, optionally using images as input           |
| [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) | Analyze images and use them as input to generate text or audio        |

To learn more about the input and output modalities supported by our models, refer to our [models page](https://developers.openai.com/api/docs/models).

## Generate or edit images

You can generate or edit images using the Image API or the Responses API.

The state-of-the-art image generation model, `gpt-image-2`, can understand text and images and use broad world knowledge to generate images with strong instruction following and contextual awareness.



Generate images with Responses

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
  fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
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
    with open("cat_and_otter.png", "wb") as f:
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
			OfString: openai.String("Generate an image of a gray tabby cat hugging an otter with an orange scarf."),
		},
		Tools: []responses.ToolUnionParam{{
			OfImageGeneration: &responses.ToolImageGenerationParam{},
		}},
	})
	if err != nil {
		panic(err)
	}

	for _, output := range response.Output {
		if output.Type != "image_generation_call" {
			continue
		}
		image, err := base64.StdEncoding.DecodeString(output.AsImageGenerationCall().Result)
		if err != nil {
			panic(err)
		}
		if err := os.WriteFile("cat_and_otter.png", image, 0o600); err != nil {
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

File.binwrite(
  "cat_and_otter.png",
  Base64.strict_decode64(image_call.result)
)
```

```bash
openai responses create \
  --model gpt-5.6 \
  --raw-output \
  --transform 'output.#(type=="image_generation_call").result' <<'YAML' | base64 --decode > cat_and_otter.png
tools:
  - type: image_generation
input: Generate an image of a gray tabby cat hugging an otter with an orange scarf.
YAML
```



You can learn more about image generation in our [Image
  generation](https://developers.openai.com/api/docs/guides/image-generation) guide.

### Using world knowledge for image generation

GPT Image models can use visual understanding of the world to generate lifelike images including real-life details without a reference.

For example, if you prompt GPT Image to generate an image of a glass cabinet with the most popular semi-precious stones, the model knows enough to select gemstones like amethyst, rose quartz, jade, etc, and depict them in a realistic way.

## Analyze images

**Vision** is the ability for a model to "see" and understand images. If there is text in an image, the model can also understand the text.
It can understand most visual elements, including objects, shapes, colors, and textures, even if there are some [limitations](#limitations).

### Giving a model images as input





You can provide images as input to generation requests in multiple ways:

- By providing a fully qualified URL to an image file
- By providing an image as a Base64-encoded data URL
- By providing a file ID (created with the [Files API](https://developers.openai.com/api/reference/resources/files))

You can provide multiple images as input in a single request by including multiple images in the `content` array, but keep in mind that [images count as tokens](#calculating-costs) and will be billed accordingly.



Passing a URL

    Analyze the content of an image

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "what's in this image?" },
        {
          type: "input_image",
          image_url:
            "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
          detail: "auto",
        },
      ],
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "what's in this image?"},
                {
                    "type": "input_image",
                    "image_url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
                },
            ],
        }
    ],
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
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					responses.ResponseInputMessageContentListParam{
						responses.ResponseInputContentParamOfInputText("What's in this image?"),
						{OfInputImage: &responses.ResponseInputImageParam{
							Detail:   responses.ResponseInputImageDetailAuto,
							ImageURL: openai.String("https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"),
						}},
					},
					responses.EasyInputMessageRoleUser,
				),
			},
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

Uri imageUrl = new(
    "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-5.6",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputTextPart("What is in this image?"),
                ResponseContentPart.CreateInputImagePart(imageUrl),
            ]
        ),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :user,
      content: [
        {type: :input_text, text: "What's in this image?"},
        {
          type: :input_image,
          detail: :auto,
          image_url: "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
        }
      ]
    }
  ]
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "user",
        "content": [
          {"type": "input_text", "text": "what is in this image?"},
          {
            "type": "input_image",
            "image_url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
          }
        ]
      }
    ]
  }'
```

```bash
openai responses create \
  --model gpt-5.6 \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text' <<'YAML'
input:
  - role: user
    content:
      - type: input_text
        text: What is in this image?
      - type: input_image
        image_url: https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg
YAML
```

  

  

    
Passing a Base64 encoded image

    Analyze the content of an image

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const imagePath = "fixtures/example.jpg";
const base64Image = fs.readFileSync(imagePath, "base64");

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "what's in this image?" },
        {
          type: "input_image",
          image_url: `data:image/jpeg;base64,${base64Image}`,
          detail: "auto",
        },
      ],
    },
  ],
});

console.log(response.output_text);
```

```python
import base64
from openai import OpenAI

client = OpenAI()


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Path to your image
image_path = "path_to_your_image.jpg"

# Getting the Base64 string
base64_image = encode_image(image_path)


response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "what's in this image?"},
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}",
                },
            ],
        }
    ],
)

print(response.output_text)
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
	image, err := os.ReadFile("image.png")
	if err != nil {
		panic(err)
	}
	imageURL := "data:image/png;base64," + base64.StdEncoding.EncodeToString(image)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					responses.ResponseInputMessageContentListParam{
						responses.ResponseInputContentParamOfInputText("What's in this image?"),
						{OfInputImage: &responses.ResponseInputImageParam{
							Detail:   responses.ResponseInputImageDetailAuto,
							ImageURL: openai.String(imageURL),
						}},
					},
					responses.EasyInputMessageRoleUser,
				),
			},
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

Uri imageUrl = new(
    "https://openai-documentation.vercel.app/images/cat_and_otter.png"
);

using HttpClient http = new();

// Download an image as a stream.
using Stream stream = await http.GetStreamAsync(imageUrl);
BinaryData imageData = BinaryData.FromStream(stream, "image/png");

ResponseResult response1 = await client.CreateResponseAsync(
    "gpt-5.6",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputTextPart("What is in this image?"),
                ResponseContentPart.CreateInputImagePart(imageData),
            ]
        ),
    ]
);

Console.WriteLine($"From image stream: {response1.GetOutputText()}");

// Download an image as a byte array.
byte[] bytes = await http.GetByteArrayAsync(imageUrl);
imageData = BinaryData.FromBytes(bytes, "image/png");

ResponseResult response2 = await client.CreateResponseAsync(
    "gpt-5.6",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputTextPart("What is in this image?"),
                ResponseContentPart.CreateInputImagePart(imageData),
            ]
        ),
    ]
);

Console.WriteLine($"From byte array: {response2.GetOutputText()}");
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
image = Base64.strict_encode64(File.binread("image.png"))

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :user,
      content: [
        {type: :input_text, text: "What's in this image?"},
        {
          type: :input_image,
          detail: :auto,
          image_url: "data:image/png;base64,#{image}"
        }
      ]
    }
  ]
)

puts(response.output_text)
```

  

  

    
Passing a file ID

    Analyze the content of an image

```javascript
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

// Function to create a file with the Files API
async function createFile(filePath) {
  const fileContent = fs.createReadStream(filePath);
  const result = await openai.files.create({
    file: fileContent,
    purpose: "vision",
  });
  return result.id;
}

// Getting the file ID
const fileId = await createFile("fixtures/example.jpg");

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "what's in this image?" },
        {
          type: "input_image",
          file_id: fileId,
          detail: "auto",
        },
      ],
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()


# Function to create a file with the Files API
def create_file(file_path):
    with open(file_path, "rb") as file_content:
        result = client.files.create(
            file=file_content,
            purpose="vision",
        )
        return result.id


# Getting the file ID
file_id = create_file("path_to_your_image.jpg")

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "what's in this image?"},
                {
                    "type": "input_image",
                    "file_id": file_id,
                },
            ],
        }
    ],
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	file, err := os.Open("image.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	uploaded, err := client.Files.New(context.Background(), openai.FileNewParams{
		File:    file,
		Purpose: openai.FilePurposeVision,
	})
	if err != nil {
		panic(err)
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					responses.ResponseInputMessageContentListParam{
						responses.ResponseInputContentParamOfInputText("What's in this image?"),
						{OfInputImage: &responses.ResponseInputImageParam{
							Detail: responses.ResponseInputImageDetailAuto,
							FileID: openai.String(uploaded.ID),
						}},
					},
					responses.EasyInputMessageRoleUser,
				),
			},
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.OutputText())
}
```

```csharp
using OpenAI.Files;
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

string filename = "cat_and_otter.png";
Uri imageUrl = new(
    $"https://openai-documentation.vercel.app/images/{filename}"
);

using HttpClient http = new();

// Download an image as a stream.
using Stream stream = await http.GetStreamAsync(imageUrl);

OpenAIFileClient files = new(key);

OpenAIFile file = await files.UploadFileAsync(
    stream,
    filename,
    FileUploadPurpose.Vision
);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-5.6",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputTextPart("what's in this image?"),
                ResponseContentPart.CreateInputImagePart(file.Id),
            ]
        ),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
uploaded = client.files.create(
  file: Pathname("image.png"),
  purpose: :vision
)

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {
      role: :user,
      content: [
        {type: :input_text, text: "What's in this image?"},
        {type: :input_image, detail: :auto, file_id: uploaded.id}
      ]
    }
  ]
)

puts(response.output_text)
```




### Image input requirements

Input images must meet the following requirements to be used in the API.

<table>
  <tr>
    <td>Supported file types</td>
    <td>
      - PNG (`.png`) - JPEG (`.jpeg` and `.jpg`) - WEBP (`.webp`) - Non-animated
      GIF (`.gif`)
    </td>
  </tr>
  <tr>
    <td>Size limits</td>
    <td>
      - Up to 512 MB total payload size per request - Up to 1500 individual
      image inputs per request
    </td>
  </tr>
  <tr>
    <td>Other requirements</td>
    <td>
      - No watermarks or logos - No NSFW content - Clear enough for a human to
      understand
    </td>
  </tr>
</table>

### Choose an image detail level

The `detail` parameter tells the model what level of detail to use when processing and understanding the image (`low`, `high`, `original`, or `auto`). If you skip the parameter, the model will use `auto`. This behavior is the same in both the Responses API and the Chat Completions API. On `gpt-5.5` and GPT-5.6 models, `auto` and the default omitted behavior are equivalent to `original`.




```plain
{
    "type": "input_image",
    "image_url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
    "detail": "original"
}
```



Use the following guidance to choose a detail level:

| Detail level | Best for                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `low`        | Fast, low-cost understanding when fine visual detail is not important. The model receives a low-resolution 512px x 512px version of the image. |
| `high`       | Standard high-fidelity image understanding when precise original-image coordinates are not required.                                           |
| `original`   | Large, dense, spatially sensitive, or computer-use images. Available on `gpt-5.4` and future models.                                           |
| `auto`       | Automatic detail selection. On `gpt-5.5` and GPT-5.6 models, `auto` and the omitted/default behavior are equivalent to `original`.             |

For high-accuracy tasks that require fine visual detail or precise coordinates in the original image, such as optical character recognition (OCR), small-object detection, bounding boxes, localization, or computer use, set `"detail": "original"` when supported. The `low` and `high` detail levels may resize the image before analysis, which can obscure small details and cause model-generated coordinates to no longer match the original image. On `gpt-5.4` and `gpt-5.5`, `original` can also resize images that exceed the model's patch or dimension limits; for coordinate-sensitive tasks, resize those images before sending them and remap returned coordinates to the original image. Use `low` or `high` when lower cost or latency is more important than fine-detail recognition or spatial accuracy. See the [Computer use guide](https://developers.openai.com/api/docs/guides/tools-computer-use) for more detail.

Read more about how models resize images in the [Model sizing
  behavior](#model-sizing-behavior) section, and about token costs in the
  [Calculating costs](#calculating-costs) section below.

### Model sizing behavior

Different models use different resizing rules before image tokenization:

<table>
  <tr>
    <th>Model family</th>
    <th>Supported detail levels</th>
    <th>Patch and resizing behavior</th>
  </tr>
  <tr>
    <td>GPT-5.6 family</td>
    <td>
      `low`, `high`, `original`,
      `auto`
    </td>
    <td>
      `low` and `high` can resize images under their
      finite limits. `original` preserves the input dimensions and
      does not resize the image to a pixel-dimension or patch-budget limit.
      `auto` and omitted `detail` use the same sizing
      behavior as `original`. Request payload and other image-input
      limits still apply.
    </td>
  </tr>
  <tr>
    <td>
      `gpt-5.5`
    </td>
    <td>
      `low`, `high`, `original`,
      `auto`
    </td>
    <td>
      `high` allows up to 2,500 patches or a 2048-pixel maximum
      dimension. `original` allows up to 10,000 patches or a
      6000-pixel maximum dimension. If either limit is exceeded, we resize the
      image while preserving aspect ratio to fit within the lesser of those two
      constraints for the selected detail level. `auto` and omitted
      `detail` use the same sizing behavior as
      `original`. [Full resizing details
      below.](#patch-based-image-tokenization)
    </td>
  </tr>
  <tr>
    <td>
      `gpt-5.4`
    </td>
    <td>
      `low`, `high`, `original`,
      `auto`
    </td>
    <td>
      `high` allows up to 2,500 patches or a 2048-pixel maximum
      dimension. `original` allows up to 10,000 patches or a
      6000-pixel maximum dimension. If either limit is exceeded, we resize the
      image while preserving aspect ratio to fit within the lesser of those two
      constraints for the selected detail level. `auto` and omitted
      `detail` use the same sizing behavior as
      `high`. [Full resizing details
      below.](#patch-based-image-tokenization)
    </td>
  </tr>
  <tr>
    <td>
      `gpt-5.4-mini`, `gpt-5.4-nano`,
      `gpt-5-mini`, `gpt-5-nano`, `gpt-5.2`,
      `gpt-5.3-codex`, `gpt-5-codex-mini`,
      `gpt-5.1-codex-mini`, `gpt-5.2-codex`,
      `gpt-5.2-chat-latest`, `o4-mini`, and the 
      `gpt-4.1-mini` and `gpt-4.1-nano` 2025-04-14
      snapshot variants
    </td>
    <td>
      `low`, `high`, `auto`
    </td>
    <td>
      `high` allows up to 1,536 patches or a 2048-pixel maximum
      dimension. If either limit is exceeded, we resize the image while
      preserving aspect ratio to fit within the lesser of those two constraints.
      [Full resizing details below.](#patch-based-image-tokenization)
    </td>
  </tr>
  <tr>
    <td>
      `GPT-4o`, `GPT-4.1`, `GPT-4o-mini`,
      `computer-use-preview`, and o-series models except
      `o4-mini`
    </td>
    <td>
      `low`, `high`, `auto`
    </td>
    <td>
      Use tile-based resizing behavior. See 
      [the detailed behavior below](#gpt-4o-gpt-41-gpt-4o-mini-cua-and-o-series-except-o4-mini)
    </td>
  </tr>
</table>

## Calculating costs

Image inputs are metered and charged in token units similar to text inputs. How images are converted to text token inputs varies based on the model. You can find a vision pricing calculator in the FAQ section of the [pricing page](https://openai.com/api/pricing/).

### Patch-based image tokenization

Some models tokenize images by covering them with 32px x 32px patches. Many model and detail-level combinations define a maximum patch budget. The token cost of an image is determined as follows:

A. Compute how many 32px x 32px patches are needed to cover the original image. A patch may extend beyond the image boundary.

```
original_patch_count = ceil(width/32)×ceil(height/32)
```

For GPT-5.6 models with `detail` set to `original` or `auto`, the service uses the original patch count without resizing the image to a patch budget or pixel-dimension limit. This means large images can use more input tokens than they did with earlier models. To control token use and latency, resize the image before sending it or select `low` or `high` detail.

B. If the original image would exceed the model's patch budget, scale it down proportionally until it fits within that budget. Then adjust the scale so the final resized image stays within budget after converting to integer pixel dimensions and computing patch coverage.

```
shrink_factor = sqrt((32^2 * patch_budget) / (width * height))
adjusted_shrink_factor = shrink_factor * min(
  floor(width * shrink_factor / 32) / (width * shrink_factor / 32),
  floor(height * shrink_factor / 32) / (height * shrink_factor / 32)
)
```

C. Convert the adjusted scale into integer pixel dimensions, then compute the number of patches needed to cover the resized image. This resized patch count is the image-token count before applying the model multiplier, and it is capped by the model's patch budget.

```
resized_patch_count = ceil(resized_width/32)×ceil(resized_height/32)
```

D. Apply a multiplier based on the model to get the total tokens:

| Model           | Multiplier |
| --------------- | ---------- |
| `gpt-5.4-mini`  | 1.62       |
| `gpt-5.4-nano`  | 2.46       |
| `gpt-5-mini`    | 1.62       |
| `gpt-5-nano`    | 2.46       |
| `gpt-4.1-mini*` | 1.62       |
| `gpt-4.1-nano*` | 2.46       |
| `o4-mini`       | 1.72       |

_For `gpt-4.1-mini` and `gpt-4.1-nano`, this applies to the 2025-04-14 snapshot variants._

**Cost calculation examples for a model with a 1,536-patch budget**

- A 1024 × 1024 image has a post-resize patch count of **1024**
  - A. `original_patch_count = ceil(1024 / 32) * ceil(1024 / 32) = 32 * 32 = 1024`
  - B. `1024` is below the `1,536` patch budget, so no resize is needed.
  - C. `resized_patch_count = 1024`
  - Resized patch count before the model multiplier: `1024`
  - Multiply by the model's token multiplier to get the billed token units.
- A 1800 × 2400 image has a post-resize patch count of **1452**
  - A. `original_patch_count = ceil(1800 / 32) * ceil(2400 / 32) = 57 * 75 = 4275`
  - B. `4275` exceeds the `1,536` patch budget, so we first compute `shrink_factor = sqrt((32^2 * 1536) / (1800 * 2400)) = 0.603`.
  - We then adjust that scale so the final integer pixel dimensions stay within budget after patch counting: `adjusted_shrink_factor = 0.603 * min(floor(1800 * 0.603 / 32) / (1800 * 0.603 / 32), floor(2400 * 0.603 / 32) / (2400 * 0.603 / 32)) = 0.586`.
  - Resized image dimensions: `1056 × 1408`
  - C. `resized_patch_count = ceil(1056 / 32) * ceil(1408 / 32) = 33 * 44 = 1452`
  - Resized patch count before the model multiplier: `1452`
  - Multiply by the model's token multiplier to get the billed token units.

### Tile-based image tokenization

#### GPT-4o, GPT-4.1, GPT-4o-mini, CUA, and o-series (except o4-mini)

The token cost of an image is determined by two factors: size and detail.

Any image with `"detail": "low"` costs a set, base number of tokens. This amount varies by model. To calculate the cost of an image with `"detail": "high"`, we do the following:

- Scale to fit in a 2048px x 2048px square, maintaining original aspect ratio
- Scale so that the image's shortest side is 768px long
- Count the number of 512px squares in the image. Each square costs a set amount of tokens, shown below.
- Add the base tokens to the total

| Model                          | Base tokens | Tile tokens |
| ------------------------------ | ----------- | ----------- |
| `gpt-5`, `gpt-5-chat-latest`   | 70          | 140         |
| `gpt-4o`, `gpt-4.1`, `gpt-4.5` | 85          | 170         |
| `gpt-4o-mini`                  | 2833        | 5667        |
| `o1`, `o1-pro`, `o3`           | 75          | 150         |
| `computer-use-preview`         | 65          | 129         |

### GPT Image 1

For GPT Image 1, we calculate the cost of an image input the same way as described above, except that we scale down the image so that the shortest side is 512px instead of 768px.
The price depends on the dimensions of the image and the [input fidelity](https://developers.openai.com/api/docs/guides/image-generation?image-generation-model=gpt-image-1#image-input-fidelity).

When input fidelity is set to low, the base cost is 65 image tokens, and each tile costs 129 image tokens.
When using high input fidelity, we add a set number of tokens based on the image's aspect ratio in addition to the image tokens described above.

- If your image is square, we add 4160 extra input image tokens.
- If it is closer to portrait or landscape, we add 6240 extra tokens.

To see pricing for image input tokens, refer to the [image pricing section](https://developers.openai.com/api/docs/pricing#multimodal-image-pricing).

## Limitations

While models with vision capabilities are powerful and can be used in many situations, it's important to understand the limitations of these models. Here are some known limitations:

- **Medical images**: The model is not suitable for interpreting specialized medical images like CT scans and shouldn't be used for medical advice.
- **Non-English**: The model may not perform optimally when handling images with text of non-Latin alphabets, such as Japanese or Korean.
- **Small text**: Enlarge text within the image to improve readability. When available, using `"detail": "original"` can also help performance.
- **Rotation**: The model may misinterpret rotated or upside-down text and images.
- **Visual elements**: The model may struggle to understand graphs or text where colors or styles—like solid, dashed, or dotted lines—vary.
- **Spatial reasoning**: The model struggles with tasks requiring precise spatial localization, such as identifying chess positions.
- **Accuracy**: The model may generate incorrect descriptions or captions in certain scenarios.
- **Image shape**: The model struggles with panoramic and fisheye images.
- **Metadata and resizing**: The model doesn't process original file names or metadata. `low` and `high` detail, and models with finite image budgets, may resize images before analysis. GPT-5.6 models preserve the input dimensions with `original` and `auto` detail.
- **Counting**: The model may give approximate counts for objects in images.
- **CAPTCHAs**: For safety reasons, our system blocks the submission of CAPTCHAs.

---

We process images at the token level, so each image we process counts towards your tokens per minute (TPM) limit.

For the most precise and up-to-date estimates for image processing, please use our image pricing calculator available [here](https://openai.com/api/pricing/).