# 图像与视觉

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 概述



  - **[创建图像](https://developers.openai.com/api/docs/guides/image-generation)**：使用 GPT Image 模型生成或编辑图像。
- **[处理图像输入](#analyze-images)**：使用我们模型的视觉功能来分析图像。



在本指南中，你将学习如何使用 OpenAI API 构建涉及图像的应用。
如果你知道自己想要构建什么，请从下方找到对应用例开始。如果不确定从哪里开始，请继续阅读以获取概述。

### 图像相关用例概览

近期语言模型可以处理图像输入并对其进行分析——这项能力被称为 **视觉**。GPT Image 模型可以利用文本和图像输入来创建新图像或编辑现有图像。

OpenAI API 提供了多个端点，用于将图像作为输入进行处理或将其作为输出生成，使你能够构建强大的多模态应用。

| API                                                  | 支持的用例                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| [Responses API](https://developers.openai.com/api/reference/resources/responses)   | 分析图像并将其作为输入，和/或生成图像作为输出 |
| [图像 API](https://developers.openai.com/api/reference/resources/images)         | 生成图像作为输出，可选地将图像作为输入           |
| [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) | 分析图像并将其作为输入以生成文本或音频        |

如需了解我们模型支持的输入和输出模态，请参阅 [模型页面](https://developers.openai.com/api/docs/models).

## 生成或编辑图像

你可以使用图像 API 或 Responses API 生成或编辑图像。

最先进的图像生成模型， `gpt-image-2`，能够理解文本和图像，并利用广泛的世界知识生成具有强大指令跟随和上下文感知能力的图像。



使用 Responses 生成图像

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.Tool;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Generate an image of a gray tabby cat hugging an otter with an orange scarf.")
        .addTool(Tool.ImageGeneration.builder().build())
        .build();

String imageResult =
    client.responses().create(params).output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .flatMap(call -> call.result().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No generated image returned"));
Files.write(Path.of("cat_and_otter.png"), Base64.getDecoder().decode(imageResult));
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



你可以在我们的 [图像
  生成](https://developers.openai.com/api/docs/guides/image-generation) 指南中了解更多关于图像生成的信息。

### 利用世界知识进行图像生成

GPT Image 模型可以运用对世界的视觉理解来生成栩栩如生的图像，包括无需参考即可呈现的真实细节。

例如，如果你提示 GPT Image 生成一张装有最受欢迎半宝石的玻璃柜图像，模型足以知道选择紫水晶、粉晶、玉石等宝石，并以逼真的方式描绘它们。

## 分析图像

**视觉** 是指模型“看到”并理解图像的能力。如果图像中有文字，模型也能理解这些文字。
它可以理解大多数视觉元素，包括物体、形状、颜色和纹理，即使存在一些 [限制](#limitations).

### 将图像作为输入提供给模型





你可以通过多种方式将图像作为生成请求的输入提供：

- 通过提供图片文件的完整限定 URL
- 通过提供图片作为 Base64 编码的数据 URL
- 通过提供文件 ID（使用 [文件 API](https://developers.openai.com/api/reference/resources/files))

你可以在一次请求中提供多张图片作为输入，方法是在 `content` 数组中包含多张图片，但请记住， [图片会计算为令牌](#calculating-costs) 并相应计费。



传递 URL

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputImage;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

ResponseInputItem imageInput =
    ResponseInputItem.ofMessage(
        ResponseInputItem.Message.builder()
            .role(ResponseInputItem.Message.Role.USER)
            .addInputTextContent("What's in this image?")
            .addContent(
                ResponseInputImage.builder()
                    .detail(ResponseInputImage.Detail.AUTO)
                    .imageUrl(
                        "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg")
                    .build())
            .build());

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(List.of(imageInput))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
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

  

  

    
传递 Base64 编码的图片

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputImage;
import com.openai.models.responses.ResponseInputItem;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

String imageBase64 =
    Base64.getEncoder()
        .encodeToString(
            Files.readAllBytes(Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH"))));

ResponseInputItem imageInput =
    ResponseInputItem.ofMessage(
        ResponseInputItem.Message.builder()
            .role(ResponseInputItem.Message.Role.USER)
            .addInputTextContent("What's in this image?")
            .addContent(
                ResponseInputImage.builder()
                    .detail(ResponseInputImage.Detail.AUTO)
                    .imageUrl("data:image/png;base64," + imageBase64)
                    .build())
            .build());

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(List.of(imageInput))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
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

  

  

    
传递文件 ID

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputImage;
import com.openai.models.responses.ResponseInputItem;
import java.nio.file.Path;
import java.util.List;

var file =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.VISION)
                .build());

var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-5.6")
                .inputOfResponse(
                    List.of(
                        ResponseInputItem.ofMessage(
                            ResponseInputItem.Message.builder()
                                .role(ResponseInputItem.Message.Role.USER)
                                .addInputTextContent("What's in this image?")
                                .addContent(
                                    ResponseInputImage.builder()
                                        .detail(ResponseInputImage.Detail.AUTO)
                                        .fileId(file.id())
                                        .build())
                                .build())))
                .build());
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
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




### 图像输入要求

输入图片必须满足以下要求才能在API中使用。

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

### 选择图片细节级别

该 `detail` 参数告知模型在处理和理解图像时应使用的细节级别（`low`, `high`, `original`，或 `auto`）。如果你省略该参数，模型将使用 `auto`。此行为在 Responses API 和 Chat Completions API 中均相同。 `gpt-5.5` 及 GPT-5.6 模型上， `auto` 与默认省略行为等效于 `original`.




```plain
{
    "type": "input_image",
    "image_url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
    "detail": "original"
}
```



使用以下指导来选择细节级别：

| 细节级别 | 最适合                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `low`        | 当精细视觉细节不重要时，快速、低成本的理解。模型接收图像的 512px x 512px 低分辨率版本。 |
| `high`       | 当不需要精确的原始图像坐标时，标准高保真图像理解。                                           |
| `original`   | 大型、密集、空间敏感或计算机使用的图像。适用于 `gpt-5.4` 及未来模型。                                           |
| `auto`       | 自动细节选择。在 `gpt-5.5` 和 GPT-5.6 模型上， `auto` 和省略/默认行为等同于 `original`.             |

对于需要精细视觉细节或原始图像中精确坐标的高精度任务，例如光学字符识别（OCR）、小物体检测、边界框、定位或计算机使用，请设置 `"detail": "original"` （如果支持）。 `low` 和 `high` 细节级别可能会在分析前调整图像大小，这可能会掩盖小细节，并导致模型生成的坐标不再与原始图像匹配。 `gpt-5.4` 和 `gpt-5.5`, `original` 也会调整超过模型补丁或尺寸限制的图像大小；对于坐标敏感的任务，请在发送前调整这些图像的大小，并将返回的坐标映射回原始图像。使用 `low` 或 `high` 当较低成本或延迟比精细细节识别或空间准确性更重要时。参见 [计算机使用指南](https://developers.openai.com/api/docs/guides/tools-computer-use) 了解更多详情。

在 [模型缩放
  行为](#model-sizing-behavior) 部分阅读有关模型如何调整图像大小的更多信息，并在
  [计算成本](#calculating-costs) 部分了解令牌成本。

### 模型大小调整行为

不同的模型在图像分词之前使用不同的调整大小规则：

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

## 计算费用

图像输入按 token 单位计量和计费，与文本输入类似。图像转换为文本 token 输入的方式因模型而异。你可以在 [定价页面](https://openai.com/api/pricing/).

### 基于补丁的图像令牌化

有些模型通过用 32px x 32px 的补丁覆盖图像来对图像进行分词。许多模型和细节级别的组合定义了最大补丁预算。图像的分词成本按以下方式确定：

A. 计算覆盖原始图像所需的 32px x 32px 补丁数量。补丁可以延伸到图像边界之外。

```
original_patch_count = ceil(width/32)×ceil(height/32)
```

对于 GPT-5.6 模型，当 `detail` 设置为 `original` 或 `auto`，时，服务使用原始补丁计数，而不会将图像调整为补丁预算或像素尺寸限制。这意味着大图像可能比早期模型消耗更多的输入令牌。为了控制令牌使用和延迟，在发送图像前调整其大小，或选择 `low` 或 `high` 细节。

B. 如果原始图像会超过模型的补丁预算，则按比例缩小图像，直到它适合该预算。然后调整缩放比例，使得最终调整大小后的图像在转换为整数像素尺寸并计算补丁覆盖率后仍保持在预算内。

```
shrink_factor = sqrt((32^2 * patch_budget) / (width * height))
adjusted_shrink_factor = shrink_factor * min(
  floor(width * shrink_factor / 32) / (width * shrink_factor / 32),
  floor(height * shrink_factor / 32) / (height * shrink_factor / 32)
)
```

C. 将调整后的缩放比例转换为整数像素尺寸，然后计算覆盖调整大小后图像所需的补丁数量。这个调整大小后的补丁计数是应用模型乘数之前的图像令牌数量，并受模型的补丁预算限制。

```
resized_patch_count = ceil(resized_width/32)×ceil(resized_height/32)
```

D. 根据模型应用乘数来获取总令牌数：

| 模型           | 倍率 |
| --------------- | ---------- |
| `gpt-5.4-mini`  | 1.62       |
| `gpt-5.4-nano`  | 2.46       |
| `gpt-5-mini`    | 1.62       |
| `gpt-5-nano`    | 2.46       |
| `gpt-4.1-mini*` | 1.62       |
| `gpt-4.1-nano*` | 2.46       |
| `o4-mini`       | 1.72       |

_对于 `gpt-4.1-mini` 和 `gpt-4.1-nano`，这适用于 2025-04-14 快照变体。_

**预算为 1,536 个补丁的模型的成本计算示例**

- 1024 × 1024 图像在调整大小后的补丁数量为 **1024**
  - A. `original_patch_count = ceil(1024 / 32) * ceil(1024 / 32) = 32 * 32 = 1024`
  - B. `1024` 低于 `1,536` 补丁预算，因此无需调整大小。
  - C. `resized_patch_count = 1024`
  - 模型乘数之前的调整后补丁数量： `1024`
  - 乘以模型的令牌乘数以获得计费令牌单位。
- 1800 × 2400 图像在调整大小后的补丁数量为 **1452**
  - A. `original_patch_count = ceil(1800 / 32) * ceil(2400 / 32) = 57 * 75 = 4275`
  - B. `4275` 超过 `1,536` 补丁预算，因此我们首先计算 `shrink_factor = sqrt((32^2 * 1536) / (1800 * 2400)) = 0.603`.
  - 然后我们调整该比例，使最终整数像素尺寸在计算补丁后保持在预算内： `adjusted_shrink_factor = 0.603 * min(floor(1800 * 0.603 / 32) / (1800 * 0.603 / 32), floor(2400 * 0.603 / 32) / (2400 * 0.603 / 32)) = 0.586`.
  - 调整大小后的图像尺寸： `1056 × 1408`
  - C. `resized_patch_count = ceil(1056 / 32) * ceil(1408 / 32) = 33 * 44 = 1452`
  - 模型乘数之前的调整后补丁数量： `1452`
  - 乘以模型的令牌乘数以获得计费令牌单位。

### 基于图块的图像分词

#### GPT-4o、GPT-4.1、GPT-4o-mini、CUA 和 o 系列（除 o4-mini 外）

图像的成本由两个因素决定：尺寸和详细程度。

任何尺寸为 `"detail": "low"` 的图像都会消耗固定的基础 token 数量。该数量因模型而异。要计算尺寸为 `"detail": "high"`，的图像的成本，我们执行以下操作：

- 缩放以适应 2048px x 2048px 的正方形，保持原始宽高比
- 缩放使图像的短边长度为 768px
- 计算图像中 512px 正方形的数量。每个正方形消耗固定数量的令牌，如下所示。
- 将基础令牌添加到总数中

| 模型                          | 基础令牌 | 平铺令牌 |
| ------------------------------ | ----------- | ----------- |
| `gpt-5`, `gpt-5-chat-latest`   | 70          | 140         |
| `gpt-4o`, `gpt-4.1`, `gpt-4.5` | 85          | 170         |
| `gpt-4o-mini`                  | 2833        | 5667        |
| `o1`, `o1-pro`, `o3`           | 75          | 150         |
| `computer-use-preview`         | 65          | 129         |

### GPT Image 1

对于 GPT Image 1，我们按照上述相同的方式计算图像输入的成本，不同之处在于我们将图像缩小，使最短边为 512px 而非 768px。
价格取决于图像的尺寸和 [输入保真度](https://developers.openai.com/api/docs/guides/image-generation?image-generation-model=gpt-image-1#image-input-fidelity).

当输入保真度设置为低时，基础成本为 65 个图像令牌，每个图块成本为 129 个图像令牌。
当使用高输入保真度时，除了上述图像令牌外，我们根据图像的宽高比添加固定数量的令牌。

- 如果你的图片是正方形，我们会额外添加 4160 个输入图片 token。
- 如果它更接近竖屏或横屏，我们会额外添加 6240 个 token。

如需查看图像输入令牌的定价，请参阅 [图像定价部分](https://developers.openai.com/api/docs/pricing#multimodal-image-pricing).

## 限制

虽然具有视觉能力的模型功能强大，可在许多场景中使用，但了解这些模型的局限性也很重要。以下是一些已知的局限性：

- **医学影像**：模型不适合解读CT扫描等专业医学影像，也不应用于提供医疗建议。
- **非英语文本**：在处理包含非拉丁字母（如日文或韩文）文本的图像时，模型可能表现不佳。
- **小字号文本**：放大图像中的文字以提高可读性。在可用时，使用 `"detail": "original"` 也有助于提升性能。
- **旋转**：模型可能误解旋转或倒置的文本和图像。
- **视觉元素**：模型可能难以理解颜色或样式（如实线、虚线或点线）变化的图形或文本。
- **空间推理**：模型难以处理需要精确定位空间的任务，例如识别棋局位置。
- **准确性**：在某些场景下，模型可能生成错误的描述或标题。
- **图像形状**：模型难以处理全景和鱼眼图像。
- **元数据和调整大小**：模型不会处理原始文件名或元数据。 `low` 及 `high` 细节，并且图像预算有限的模型可能会在分析前调整图像大小。GPT-5.6 模型保留输入尺寸， `original` 以及 `auto` 细节。
- **计数**：模型可能对图像中的物体数量给出近似值。
- **验证码**：出于安全原因，我们的系统会阻止提交验证码。

---

我们在 token 级别处理图像，因此我们处理的每张图像都会计入你的每分钟 token（TPM）限制。

有关图像处理的最精确和最新估算，请使用我们的图像定价计算器，可 [在此处](https://openai.com/api/pricing/).