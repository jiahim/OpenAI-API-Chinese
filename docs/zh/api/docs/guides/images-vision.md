# 图像与视觉

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 概述



  - **[创建图像](https://developers.openai.com/api/docs/guides/image-generation)**：使用 GPT Image 模型生成或编辑图像。
- **[处理图像输入](#analyze-images)**：利用我们模型的视觉能力来分析图像。



<a id="a-tour-of-image-related-use-cases"></a>

近期的语言模型可以处理并分析图像输入——这一能力被称为 **视觉**。GPT 图像模型可以使用文本和图像输入来生成新图像或编辑现有图像。

根据你想要分析图像还是生成图像，选择相应的端点：

| API                                                  | 支持的使用场景                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------- |
| [Responses API](https://developers.openai.com/api/reference/resources/responses)   | 使用图像生成工具分析图像，或生成和编辑图像 |
| [Images API](https://developers.openai.com/api/reference/resources/images)         | 生成图像作为输出，可选择使用图像作为输入                |
| [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) | 分析图像并生成文本响应                                 |

若要详细了解我们的模型所支持的输入和输出模态，请参阅我们的 [模型页面](https://developers.openai.com/api/docs/models).

## 生成或编辑图像

使用 Images API,可以选择 `gpt-image-2` 来从文本生成图片或编辑已有图片。使用 Responses API 时,需要选择一个支持图片生成工具的 mainline 模型;该工具会处理 GPT Image 模型的选择。



使用 Responses 生成图片

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

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-5.6",
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "Generate an image of a gray tabby cat hugging an otter with an orange scarf."
    )
);
options.Tools.Add(
    ResponseTool.CreateImageGenerationTool(model: "gpt-image-2")
);

ResponseResult response = await client.CreateResponseAsync(options);
ImageGenerationCallResponseItem image = response
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .FirstOrDefault()
    ?? throw new InvalidOperationException("No generated image was returned.");
await File.WriteAllBytesAsync(
    "cat_and_otter.png",
    image.ImageResultBytes.ToArray()
);
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



你可以在我们的图片 [生成
  指南](https://developers.openai.com/api/docs/guides/image-generation) 中了解更多关于图片生成的内容。

### 使用世界知识进行图像生成

GPT Image 模型可以在没有参考图像的情况下运用世界知识进行绘制。例如，提示要一个陈列半宝石的柜子，可以生成包含可识别宝石（如紫水晶、芙蓉石和翡翠）的场景。

## 分析图像

使用具备视觉能力的模型来描述图像、读取可见文本，并回答有关物体、形状、颜色或纹理的问题。请考虑模型的 [局限性](#limitations) ，再使用其回答。

### 将图像作为输入提供给模型





通过以下任一方式提供待分析的图片：

- 通过提供图片文件的完整 URL
- 通过以 Base64 编码的数据 URL 形式提供图片
- 通过提供文件 ID（使用 [Files API](https://developers.openai.com/api/reference/resources/files))

你可以在一次请求中通过在 `content` 数组中包含多张图片来提供多张图片作为输入，但请注意， [图片会计入 token](#calculating-costs) 并相应计费。



传入 URL

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

  

  

    
传入 Base64 编码的图片

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

  

  

    
传入文件 ID

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

使用模型能够识别清楚的受支持图片文件。

| 要求  | 支持的输入                                                                      |
| ------------ | ------------------------------------------------------------------------------------- |
| 文件类型   | PNG（`.png`）、JPEG（`.jpeg` ）或 `.jpg`）、WEBP（`.webp`）以及非动画 GIF（`.gif`) |
| 请求大小 | 每个请求的负载总计最多 512 MB                                                |
| 图片数量  | 每个请求最多 1,500 张图片                                                        |

对于 [基于 patch 的图像输入](#patch-based-image-tokenization)，API 在应用所选模型的缩放规则后，每个图像最多支持 30,000 个 patch，并且 `detail` 级别。此限制适用于所有受支持的 detail 级别，并对每张图像单独计算，而不是针对整个请求的 patch 总数。

更低的、按模型和 detail 设定的缩放预算仍然适用。处理后超过 30,000 个 patch 上限的图像将被拒绝，而不会自动缩放以满足该限制。请缩小图像尺寸后重试。

图像 token 以及你提示词中的其余部分也必须符合模型的输入和上下文限制。token 预估并不能保证请求满足所有输入限制。图像使用必须遵守我们的 [使用政策](https://openai.com/policies/usage-policies/).

### 选择图像详细程度

该 `detail` 参数控制图像预处理。支持的取值取决于模型： `low`, `high`, `original`，或 `auto`。如果你省略该参数，则默认为 `auto` ，在 Responses API 和 Chat Completions API 中都是如此。该 [模型尺寸表](#model-sizing-behavior) 展示了对应的行为。




```plain
{
    "type": "input_image",
    "image_url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
    "detail": "original"
}
```



使用以下指引来选择细节等级：

| 详细程度 | 适用场景                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `low`        | 粗粒度图像理解。缩放和 token 使用量因模型而异； `low` 并不总是比以下情况使用更少的 token `high`. |
| `high`       | 在不需要精确原图坐标时的标准高保真图像理解。                        |
| `original`   | 在模型支持时，用于大型、密集、空间敏感或计算机使用的图像。                                     |
| `auto`       | 使用模型的默认缩放行为，详见模型缩放表。                                                   |

对于需要精细视觉细节或精确坐标的任务，例如光学字符识别 (OCR)、小目标检测或计算机操控，请在支持时使用 `"detail": "original"` 。原始细节仍可对图像进行缩放以满足模型的像素维度限制或缩放补丁预算，但不能用于满足单独的 30,000 补丁拒绝限制。对于坐标敏感型任务，请在发送前将图像缩放至符合这些限制，并将返回的坐标映射回原始图像。详见 [计算机操控指南](https://developers.openai.com/api/docs/guides/tools-computer-use) 中关于坐标处理的内容。

### 模型规模行为

下表涵盖了中可用的通用视觉模型 [图像输入成本计算器](https://developers.openai.com/api/docs/guides/image-cost-calculator)。其他模型和专用变体可能使用不同的限制。所有调整大小都会保持纵横比，且不会放大较小的图像。

<table>
  <tr>
    <th>Model family</th>
    <th>Supported detail levels</th>
    <th>Patch and resizing behavior</th>
  </tr>
  <tr>
    <td>
      `gpt-5.6-sol`, `gpt-5.6-terra`, 
      `gpt-5.6-luna`
    </td>
    <td>
      `low`, `high`, `original`,
      `auto`
    </td>
    <td>
      `low` fits within 512 × 512 pixels. `high` fits
      within 2048 × 2048 pixels and 2,500 patches. `original` 
      preserves the image's dimensions, except that images larger than 65,535
      pixels on either side are scaled down to fit that limit. If the resulting
      image requires more than 
      [30,000 patches](#image-input-requirements), the API rejects
      the request; the image is not resized to fit the patch limit. 
      `auto` uses the same sizing behavior as `original`.
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
      `low` fits within 512 × 512 pixels. `high` allows up
      to 2,500 patches and a 2048-pixel maximum dimension. `original` 
      allows up to 10,000 patches and a 6000-pixel maximum dimension. Both
      limits apply. `auto` uses the same sizing behavior as 
      `original`.
    </td>
  </tr>
  <tr>
    <td>
      `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`
    </td>
    <td>
      `low`, `high`, `original`,
      `auto`
    </td>
    <td>
      `low` uses a 2048-pixel maximum dimension and a 6,144-patch
      budget, so it can use more tokens than `high`. 
      `high` allows up to 2,500 patches and a 2048-pixel maximum
      dimension. `original` allows up to 10,000 patches and a
      6000-pixel maximum dimension. Both limits apply. `auto` uses
      the same sizing behavior as `high`.
    </td>
  </tr>
  <tr>
    <td>
      `gpt-5.2`, `gpt-4.1-mini`
    </td>
    <td>
      `low`, `high`, `auto`
    </td>
    <td>
      These detail levels use the same sizing limits: a 2048-pixel maximum
      dimension and a 6,144-patch budget. `original` is not
      supported.
    </td>
  </tr>
  <tr>
    <td>
      `gpt-5.1`, `gpt-4.1`, `gpt-4o`,
      `gpt-4o-mini`
    </td>
    <td>
      `low`, `high`, `auto`
    </td>
    <td>
      `low` uses a fixed token count. `high` and 
      `auto` use the 
      [tile-based sizing rules](#tile-based-image-tokenization).
    </td>
  </tr>
</table>

## 计算成本

视觉模型将图像输入转换为可计费的输入 token。本节 [图像输入成本计算器](https://developers.openai.com/api/docs/guides/image-cost-calculator) 和 patch/tile 规则仅适用于视觉模型输入，不适用于 GPT Image 生成或编辑。有关 [GPT Image 模型输入](#gpt-image-model-inputs) 的单独计费方式，请参阅。

图像 token 同样计入你的 [每分钟 token 数 (TPM) 限制](https://developers.openai.com/api/docs/guides/rate-limits)。该计算器仅按标准输入费率估算单张图像的费用，不包含你提示词中的其他内容或模型输出。

### 图像输入成本计算器

使用 [图像输入成本计算器](https://developers.openai.com/api/docs/guides/image-cost-calculator) 按模型、图像尺寸和细节级别估算单张图片的输入 token 数和成本。

### 基于分块的图像分词

一些模型通过 32px x 32px 的图像块来对图像进行分词。许多模型和细节级别的组合定义了调整大小的图像块预算。首先，API 会将图像适配所选细节级别的像素尺寸限制之内，保持原始长宽比，并将尺寸取整为整数像素，且不会放大较小的图像。随后按如下方式确定 token 消耗量：

A. 计算在应用像素尺寸限制后覆盖图像所需的 32px x 32px 图像块数量。一个图像块可以延伸到图像边界之外。

```
patch_count = ceil(width/32)×ceil(height/32)
```

B. 当所选模型和细节级别指定了调整大小的图像块预算时，如果图像超出该预算，则按比例缩小图像。否则，跳过此步骤。在转换为整数像素尺寸并计算图像块覆盖范围后，再调整缩放比例以保持在预算范围内。在计算最终尺寸之前保留完整的精度。

```
shrink_factor = sqrt((32^2 * patch_budget) / (width * height))
adjusted_shrink_factor = shrink_factor * min(
  floor(width * shrink_factor / 32) / (width * shrink_factor / 32),
  floor(height * shrink_factor / 32) / (height * shrink_factor / 32)
)
```

C. 如果步骤 B 对图像进行了缩放，则将最终缩放后的宽度和高度向下取整为整数像素。然后计算覆盖所得图像所需的图像块数量。这是应用模型乘数之前的图像 token 计数。当存在图像块预算时，该数量应保持在预算范围内。

```
resized_patch_count = ceil(resized_width/32)×ceil(resized_height/32)
```

如果该数量超过 30,000 个图像块，API 将拒绝该请求。请在应用 token 乘数之前检查此限制。

D. 将图像块数量乘以模型的乘数并向上取整，以得到计费的图像输入 token 数。对这些 token 仅应用一次模型的输入价格；该乘数不适用于其他 prompt token，也不会再次计入价格。

| 模型                                  | 倍率 |
| -------------------------------------- | ---------- |
| `gpt-5.6-sol`                          | 1.2        |
| `gpt-5.6-terra`                        | 1.2        |
| `gpt-5.6-luna`                         | 1.2        |
| `gpt-5.5`                              | 1.2        |
| `gpt-5.4`                              | 1.2        |
| `gpt-5.4-mini`                         | 1.2        |
| `gpt-5.4-nano`                         | 1.2        |
| `gpt-5.2`                              | 1.2        |
| `gpt-5-mini`\*                         | 1.2        |
| `gpt-5-nano`\*                         | 1.5        |
| `gpt-4.1-mini`                         | 1.62       |
| `gpt-4.1-nano`\* （2025-04-14 快照） | 2.46       |
| `o4-mini`\*                            | 1.72       |

_对于 `gpt-4.1-mini`，这适用于 2025-04-14 快照。_

\* 已弃用并计划下线。请参阅 [弃用时间表](https://developers.openai.com/api/docs/deprecations) 以了解日期和替代方案。这些模型未包含在上述计算器或模型规模表中。

**成本计算示例 `gpt-5.4` 使用 `detail: high`**

此组合使用 2048 像素的最大尺寸、2,500 个图像块的预算以及 1.2× 倍率。

- 一张 1024 × 1024 的图像需要 `32 × 32 = 1024` 个 patch。无需调整大小。可计费的图像输入为 `ceil(1024 × 1.2) = 1229` 个 token。
- 一张 2048 × 2048 的图像最初需要 `64 × 64 = 4096` 个 patch。patch 预算将其缩小到 1600 × 1600 像素，即 `50 × 50 = 2500` 个 patch。估算值为 `ceil(2500 × 1.2) = 3000` 个 token。

计费中的浮点取整可能导致最终计数与预估相差一个 token。

### 基于块的图像分词

<a id="gpt-4o-gpt-41-gpt-4o-mini-cua-and-o-series-except-o4-mini"></a>

此表中的模型使用基础 token 计数加上图像分块的 token：

| 模型                      | Base tokens | Tile tokens |
| -------------------------- | ----------- | ----------- |
| `gpt-5.1`                  | 70          | 140         |
| `gpt-5`\*                  | 70          | 140         |
| `gpt-4o`, `gpt-4.1`        | 85          | 170         |
| `gpt-4o-mini`              | 2833        | 5667        |
| `o1`\*, `o1-pro`\*, `o3`\* | 75          | 150         |

\* 已弃用并计划下线。请参阅 [弃用时间表](https://developers.openai.com/api/docs/deprecations) 以了解日期和替代方案。这些模型未包含在上述计算器或模型规模表中。

使用 `"detail": "low"`，图像仅按模型的基础 token 计费，与尺寸无关。使用 `"detail": "high"` 或 `"detail": "auto"`:

- 按比例缩放至适配 2048px x 2048px 的方形画布；较小的图像不会被放大。
- 如果最短边超过 768px，则将其缩放至 768px，另一边向下取整。
- 统计覆盖整张图像所需的 512px 方块数量。每个方块都会使用模型的 tile token。
- 将模型的 base token 与 tile token 相加。

### GPT Image 模型输入

GPT Image 模型对生成和编辑使用单独的图像 token 定价。视觉计算器不会估算其输入或输出成本。当前费率请参阅 [image generation pricing](https://developers.openai.com/api/docs/pricing#image-generation)；有关生成和编辑工作流，请参阅 [Image generation guide](https://developers.openai.com/api/docs/guides/image-generation).

#### GPT Image 1

以下输入 token 规则适用于 `gpt-image-1`。使用基于分块的图像尺寸策略，但将最短边缩放到 512px 而不是 768px。Token 用量取决于图像尺寸以及 `input_fidelity` 参数（在 [Images API](https://developers.openai.com/api/reference/resources/images/methods/edit).

当输入保真度设置为 low 时，基础费用为 65 个图像 token，每个分块花费 129 个图像 token。
当使用高输入保真度时，除了上文描述的图像 token 之外，我们还会根据图像的宽高比添加一定数量的 token。

- 如果你的图片是正方形，我们会额外添加 4160 个输入图片 tokens。
- 如果更接近竖屏或横屏，我们会额外添加 6240 个 tokens。

若需查看图像输入 token 的定价，请参阅 [图像定价部分](https://developers.openai.com/api/docs/pricing#multimodal-image-pricing).

## 限制

视觉模型可能会出错。在设计应用时，请考虑这些限制：

- **医学图像**：该模型不适合解读 CT 扫描等专科医学图像，不应用于医疗建议。
- **非英语**：在处理包含日语、韩语等非拉丁字母文字的图像时，模型的表现可能不佳。
- **小号文字**：放大图像中的文字以提升可读性。在条件允许时，使用 `"detail": "original"` 也有助于提升效果。
- **旋转**：模型可能误读旋转或上下颠倒的文字与图像。
- **视觉元素**：在图形或文本中，若颜色或样式（如实线、虚线、点线）有所变化，模型可能难以理解。
- **空间推理**：模型在需要精确空间定位的任务（例如识别国际象棋棋局）上表现欠佳。
- **准确性**：模型在某些场景下可能生成错误的描述或标题。
- **图像形状**：模型在处理全景图像和鱼眼图像时表现欠佳。
- **元数据与缩放**：模型不会处理原始文件名或元数据。图像在分析前可能会被缩放，包括通过 `original` 方式处理。详见 [模型规模行为](#model-sizing-behavior) 以了解适用于每个模型的限制。
- **计数**：模型可能给出图像中对象的近似计数。
- **验证码**：出于安全考虑，我们的系统会阻止提交验证码。