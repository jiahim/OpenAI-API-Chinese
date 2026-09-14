# 图像生成

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 概述

API 可让你根据文本提示生成和编辑图像，使用 `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`。在对编辑精度要求最高的工作流中选择 Sunburst，在追求快速、高质量的日常图像生成时选择 Flare。你可以通过两个 API 访问图像生成能力：

### 图像 API

该 [图像 API](https://developers.openai.com/api/reference/resources/images) 提供了两个端点，每个端点都具有不同的功能：

- **生成**: [生成图像](#generate-images) 根据文本提示从零开始生成
- **编辑**: [修改已有图像](#edit-images) 使用新的提示进行局部或整体修改

### Responses API

该 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-tools) 允许你在对话或多步骤流程中生成图像。它支持将图像生成作为 [内置工具](https://developers.openai.com/api/docs/guides/tools?api-mode=responses),并在上下文中接受图像输入和输出。

与图像 API 相比,它新增了:

- **多轮编辑**：通过提示迭代地对图像进行高保真编辑
- **灵活的输入**：接受图像 [File](https://developers.openai.com/api/reference/resources/files) ID 作为输入图像，而不仅仅是字节

有关可调用图像生成工具的主流模型，请参阅 [支持的模型](#supported-models).

### 选择合适的 API

- 如果只需要通过单个提示生成或编辑一张图片，Image API 是最佳选择。
- 如果想要使用 GPT Image 构建可对话、可编辑的图片体验，请选择 Responses API。

通过 Image API，可将 `model` 设置为 `gpt-image-2.5-sunburst` 或 `gpt-image-2.5-flare` 。使用 Responses API 时，请在顶层选择支持的 mainstream 模型，并在 `gpt-image-2.5-sunburst` 或 `gpt-image-2.5-flare` 中的图像生成工具的 `model` 字段中指定。

两个 API 都允许你 [自定义输出](#customize-image-output) ，方式包括调整质量、尺寸、格式和压缩。

为确保负责任地使用这些模型，你可能需要完成 [API
  组织
  验证](https://help.openai.com/en/articles/10910291-api-organization-verification)
  ，从你的 [开发者
  控制台](https://platform.openai.com/settings/organization/general) 完成
  后再使用 GPT Image 模型。

<div
  className="not-prose"
  style={{ float: "right", margin: "10px 0 10px 10px" }}
>
  <img src="https://developers.openai.com/images/image-25-article/mug.png"
    alt="A beige coffee mug on a wooden table"
    style={{ height: "180px", width: "auto", borderRadius: "8px" }}
  />



## 生成图像

你可以使用 [图像生成端点](https://developers.openai.com/api/reference/resources/images) 根据文本提示创建图像，或使用 [图像生成工具](https://developers.openai.com/api/docs/guides/tools?api-mode=responses) 在 Responses API 中作为对话的一部分生成图像。

要了解如何自定义输出（尺寸、质量、格式、压缩），请参阅 [自定义图像输出](#customize-image-output) 章节。

你可以设置 `n` 参数，在单次请求中一次生成多张图像（默认情况下，API 返回单张图像）。



图像 API

    Generate an image

```javascript
import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

const prompt = `
A children's book drawing of a veterinarian using a stethoscope to
listen to the heartbeat of a baby otter.
`;

const result = await openai.images.generate({
  model: "gpt-image-2.5-sunburst",
  prompt,
});

// Save the image to a file
const image_base64 = result.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("otter.png", image_bytes);
```

```python
from openai import OpenAI
import base64

client = OpenAI()

prompt = """
A children's book drawing of a veterinarian using a stethoscope to
listen to the heartbeat of a baby otter.
"""

result = client.images.generate(model="gpt-image-2.5-sunburst", prompt=prompt)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("otter.png", "wb") as f:
    f.write(image_bytes)
```

```go
package main

import (
	"context"
	"encoding/base64"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	result, err := client.Images.Generate(context.Background(), openai.ImageGenerateParams{
		Model: openai.ImageModel("gpt-image-2.5-sunburst"),
		Prompt: "A children's book drawing of a veterinarian using a stethoscope to " +
			"listen to the heartbeat of a baby otter.",
	})
	if err != nil {
		panic(err)
	}
	image, err := base64.StdEncoding.DecodeString(result.Data[0].B64JSON)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("otter.png", image, 0o600); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.images.ImageGenerateParams;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

var images =
    client
        .images()
        .generate(
            ImageGenerateParams.builder()
                .model("gpt-image-2.5-sunburst")
                .prompt("A watercolor robot reading in a library")
                .build());

Files.write(
    Path.of("generated-image.png"),
    Base64.getDecoder().decode(images.data().orElseThrow().get(0).b64Json().orElseThrow()));
```

```csharp
using OpenAI.Images;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-image-2.5-sunburst";
ImageClient client = new(model, key);

GeneratedImage image = await client.GenerateImageAsync(
    "A children's book drawing of a veterinarian using a stethoscope to "
        + "listen to the heartbeat of a baby otter."
);

await File.WriteAllBytesAsync("otter.png", image.ImageBytes.ToArray());
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
result = client.images.generate(
  model: "gpt-image-2.5-sunburst",
  prompt: "A watercolor robot reading in a library"
)
generated_image = result.data&.first or raise "No image returned"
File.binwrite(
  "generated-image.png",
  Base64.strict_decode64(generated_image.b64_json)
)
```

```bash
curl -X POST "https://api.openai.com/v1/images/generations" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-type: application/json" \
    -d '{
        "model": "gpt-image-2.5-sunburst",
        "prompt": "A children'\''s book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter."
    }' | jq -r '.data[0].b64_json' | base64 --decode > otter.png
```

```bash
openai images generate \
  --model gpt-image-2.5-sunburst \
  --prompt "A children's book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter." \
  --raw-output \
  --transform 'data.0.b64_json' | base64 --decode > otter.png
```

  

  

    
Responses API

    Generate an image

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation", model: "gpt-image-2.5-sunburst" }],
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
    model="gpt-6-astra",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation", "model": "gpt-image-2.5-sunburst"}],
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst"}}},
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.Tool;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Generate an image of a gray tabby cat hugging an otter with an orange scarf.")
        .addTool(Tool.ImageGeneration.builder().build())
        .build();

var image =
    client.responses().create(params).output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No image generation call returned"));
String encoded =
    image.result().orElseThrow(() -> new IllegalStateException("No image returned"));
Files.write(Path.of("otter.png"), Base64.getDecoder().decode(encoded));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "Generate an image of a gray tabby cat hugging an otter with an orange scarf."
    )
);
options.Tools.Add(ResponseTool.CreateImageGenerationTool(model: "gpt-image-2.5-sunburst"));

ResponseResult response = await client.CreateResponseAsync(options);
ImageGenerationCallResponseItem image = response
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .FirstOrDefault()
    ?? throw new InvalidOperationException("No generated image was returned.");
await File.WriteAllBytesAsync("otter.png", image.ImageResultBytes.ToArray());
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst"
    }
  ]
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



### 多轮图像生成

使用 Responses API，你可以在上下文中提供图像生成调用的输出（也可以直接使用图像 ID），或使用 [`previous_response_id` 参数](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses#openai-apis-for-conversation-state).
从而在多轮对话中迭代图像——随着对话推进，不断打磨提示词、应用新指令并演进视觉输出。

借助 Responses API 的图像生成工具，支持的模型可以选择是生成新图像，还是编辑对话中已有的图像。可选的 `action` 参数控制此行为：设为 `action: "auto"` 让模型自行决定，设为 `action: "generate"` 始终创建新图像，设为 `action: "edit"` 在上下文中存在图像时强制进行编辑。

通过 action 强制创建图像

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [
    { type: "image_generation", model: "gpt-image-2.5-sunburst", action: "generate" },
  ],
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
    model="gpt-6-astra",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[
        {"type": "image_generation", "model": "gpt-image-2.5-sunburst", "action": "generate"}
    ],
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst", Action: "generate"}}},
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
		if err := os.WriteFile("otter.png", image, 0o600); err != nil {
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
        .model("gpt-6-astra")
        .input("Generate an image of a gray tabby cat hugging an otter with an orange scarf.")
        .addTool(
            Tool.ImageGeneration.builder().action(Tool.ImageGeneration.Action.GENERATE).build())
        .build();

String imageResult =
    client.responses().create(params).output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .flatMap(call -> call.result().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No generated image returned"));
Path output = Path.of(System.getenv().getOrDefault("OPENAI_EXAMPLE_OUTPUT_PATH", "otter.png"));
Files.write(output, Base64.getDecoder().decode(imageResult));
System.out.println(output);
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "Generate an image of a gray tabby cat hugging an otter with an orange scarf."
    )
);
options.Tools.Add(
    ResponseTool.CreateImageGenerationTool(
        model: "gpt-image-2.5-sunburst",
        action: ImageGenerationToolAction.Generate
    )
);

ResponseResult response = await client.CreateResponseAsync(options);
ImageGenerationCallResponseItem image = response
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .FirstOrDefault()
    ?? throw new InvalidOperationException("No generated image was returned.");
await File.WriteAllBytesAsync("otter.png", image.ImageResultBytes.ToArray());
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst",
      action: :generate
    }
  ]
)

image_call = response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless image_call.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No image generation call returned"
end

encoded_image = image_call.result or raise "No image returned"
output_path = ENV.fetch("OPENAI_EXAMPLE_OUTPUT_PATH", "otter.png")
File.binwrite(output_path, Base64.decode64(encoded_image))
puts(output_path)
```


如果你强制 `edit` 时未在上下文中提供图像，该调用将返回错误。将 `action` 保留为 `auto` ，由模型决定何时生成或编辑。



使用上一个响应 ID

    Multi-turn image generation

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation", model: "gpt-image-2.5-sunburst" }],
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
  model: "gpt-6-astra",
  previous_response_id: response.id,
  input: "Now make it look realistic",
  tools: [{ type: "image_generation", model: "gpt-image-2.5-sunburst" }],
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
    model="gpt-6-astra",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation", "model": "gpt-image-2.5-sunburst"}],
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
    model="gpt-6-astra",
    previous_response_id=response.id,
    input="Now make it look realistic",
    tools=[{"type": "image_generation", "model": "gpt-image-2.5-sunburst"}],
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst"}}},
	})
	if err != nil {
		panic(err)
	}
	saveFirstGeneratedImage(first, "cat_and_otter.png")

	followUp, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String(first.ID),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Now make it look realistic"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst"}}},
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.Tool;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input(
                    "Generate an image of a gray tabby cat hugging an otter with an orange scarf.")
                .addTool(Tool.ImageGeneration.builder().build())
                .build());
var firstImage =
    first.output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No image generation call returned"));
Files.write(
    Path.of("cat_and_otter.png"),
    Base64.getDecoder()
        .decode(
            firstImage
                .result()
                .orElseThrow(() -> new IllegalStateException("No image returned"))));

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input("Now make it look realistic.")
                .previousResponseId(first.id())
                .addTool(Tool.ImageGeneration.builder().build())
                .build());
var secondImage =
    second.output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .findFirst()
        .orElseThrow(
            () -> new IllegalStateException("No follow-up image generation call returned"));
Files.write(
    Path.of("cat_and_otter_realistic.png"),
    Base64.getDecoder()
        .decode(
            secondImage
                .result()
                .orElseThrow(() -> new IllegalStateException("No follow-up image returned"))));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(ResponseTool.CreateImageGenerationTool(model: "gpt-image-2.5-sunburst"));
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "Generate an image of a gray tabby cat hugging an otter with an orange scarf."
    )
);

ResponseResult first = await client.CreateResponseAsync(options);
ImageGenerationCallResponseItem initialImage = first
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .First();
await File.WriteAllBytesAsync("cat_and_otter.png", initialImage.ImageResultBytes.ToArray());

CreateResponseOptions followUp = new()
{
    Model = "gpt-6-astra",
    PreviousResponseId = first.Id,
};
followUp.Tools.Add(ResponseTool.CreateImageGenerationTool(model: "gpt-image-2.5-sunburst"));
followUp.InputItems.Add(ResponseItem.CreateUserMessageItem("Now make it look realistic."));

ResponseResult second = await client.CreateResponseAsync(followUp);
ImageGenerationCallResponseItem updatedImage = second
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .First();
await File.WriteAllBytesAsync(
    "cat_and_otter_realistic.png",
    updatedImage.ImageResultBytes.ToArray()
);
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
first = client.responses.create(
  model: "gpt-6-astra",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst"
    }
  ]
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
  model: "gpt-6-astra",
  input: "Now make it look realistic.",
  previous_response_id: first.id,
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst"
    }
  ]
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

  

  

    
使用图像 ID

    Multi-turn image generation

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input:
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",
  tools: [{ type: "image_generation", model: "gpt-image-2.5-sunburst" }],
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
  model: "gpt-6-astra",
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
  tools: [{ type: "image_generation", model: "gpt-image-2.5-sunburst" }],
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
    model="gpt-6-astra",
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",
    tools=[{"type": "image_generation", "model": "gpt-image-2.5-sunburst"}],
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
    model="gpt-6-astra",
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
    tools=[{"type": "image_generation", "model": "gpt-image-2.5-sunburst"}],
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Generate an image of gray tabby cat hugging an otter with an orange scarf"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst"}}},
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: input},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst"}}},
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.Tool;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Map;

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input(
                    "Generate an image of a gray tabby cat hugging an otter with an orange scarf.")
                .addTool(Tool.ImageGeneration.builder().build())
                .build());
var firstImage =
    first.output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No image generation call returned"));
Files.write(
    Path.of("cat_and_otter.png"),
    Base64.getDecoder()
        .decode(
            firstImage
                .result()
                .orElseThrow(() -> new IllegalStateException("No image returned"))));

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .inputOfResponse(
                    List.of(
                        ResponseInputItem.ofMessage(
                            ResponseInputItem.Message.builder()
                                .role(ResponseInputItem.Message.Role.USER)
                                .addInputTextContent("Now make it look realistic.")
                                .build()),
                        JsonValue.from(
                                Map.of("type", "image_generation_call", "id", firstImage.id()))
                            .convert(ResponseInputItem.class)))
                .addTool(Tool.ImageGeneration.builder().build())
                .build());
var secondImage =
    second.output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .findFirst()
        .orElseThrow(
            () -> new IllegalStateException("No follow-up image generation call returned"));
Files.write(
    Path.of("cat_and_otter_realistic.png"),
    Base64.getDecoder()
        .decode(
            secondImage
                .result()
                .orElseThrow(() -> new IllegalStateException("No follow-up image returned"))));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(ResponseTool.CreateImageGenerationTool(model: "gpt-image-2.5-sunburst"));
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "Generate an image of a gray tabby cat hugging an otter with an orange scarf."
    )
);

ResponseResult first = await client.CreateResponseAsync(options);
ImageGenerationCallResponseItem initialImage = first
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .First();
await File.WriteAllBytesAsync("cat_and_otter.png", initialImage.ImageResultBytes.ToArray());

CreateResponseOptions followUp = new() { Model = "gpt-6-astra" };
followUp.Tools.Add(ResponseTool.CreateImageGenerationTool(model: "gpt-image-2.5-sunburst"));
followUp.InputItems.Add(ResponseItem.CreateUserMessageItem("Now make it look realistic."));
followUp.InputItems.Add(ResponseItem.CreateReferenceItem(initialImage.Id));

ResponseResult second = await client.CreateResponseAsync(followUp);
ImageGenerationCallResponseItem updatedImage = second
    .OutputItems.OfType<ImageGenerationCallResponseItem>()
    .First();
await File.WriteAllBytesAsync(
    "cat_and_otter_realistic.png",
    updatedImage.ImageResultBytes.ToArray()
);
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
first = client.responses.create(
  model: "gpt-6-astra",
  input: "Generate an image of a gray tabby cat hugging an otter with an orange scarf.",
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst"
    }
  ]
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
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_text,
          text: "Now make it look realistic."
        }
      ]
    },
    {
      type: :image_generation_call,
      id: first_image.id
    }
  ],
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst"
    }
  ]
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



#### Result



  <table style={{ width: "100%" }}>
    <tbody>
      <tr>
        <td style={{ verticalAlign: "top", padding: "0 16px 16px 0" }}>
          "Generate an image of gray tabby cat hugging an otter with an orange
          scarf"
        </td>
        <td
          style={{
            textAlign: "right",
            verticalAlign: "top",
            paddingBottom: "16px",
          }}
        >
          <img src="https://developers.openai.com/images/image-25-article/cat_and_otter.png"
            alt="A cat and an otter"
            style={{ width: "200px", borderRadius: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <td style={{ verticalAlign: "top", padding: "0 16px 0 0" }}>
          "Now make it look realistic"
        </td>
        <td style={{ textAlign: "right", verticalAlign: "top" }}>
          <img src="https://developers.openai.com/images/image-25-article/cat_and_otter_realistic.png"
            alt="A cat and an otter"
            style={{ width: "200px", borderRadius: "8px" }}
          />
        </td>
      </tr>
    </tbody>
  </table>



### Streaming

Responses API 和 Image API 支持流式图像生成。你可以流式接收 API 生成的局部图像，从而获得更具交互性的体验。

你可以调整 `partial_images` 参数以接收 0-3 张局部图像。

- 如果将 `partial_images` 设置为 0，你将只收到最终图像。
- 对于大于零的值，如果完整图像生成得更快，你可能无法收到所请求的全部部分图像。



Responses API

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
  model: "gpt-6-astra",
  input:
    "Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",
  stream: true,
  tools: [
    { type: "image_generation", model: "gpt-image-2.5-sunburst", partial_images: 2 },
  ],
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
    model="gpt-6-astra",
    input="Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",
    stream=True,
    tools=[
        {"type": "image_generation", "model": "gpt-image-2.5-sunburst", "partial_images": 2}
    ],
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape"),
		},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst", PartialImages: openai.Int(2)}}},
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStreamEvent;
import com.openai.models.responses.Tool;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Generate an image of a river made of white owl feathers.")
        .addTool(Tool.ImageGeneration.builder().partialImages(2).build())
        .build();

try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  var events = stream.stream().iterator();
  while (events.hasNext()) {
    ResponseStreamEvent event = events.next();
    if (event.imageGenerationCallPartialImage().isPresent()) {
      var partial = event.imageGenerationCallPartialImage().orElseThrow();
      Files.write(
          Path.of("river-partial-" + partial.partialImageIndex() + ".png"),
          Base64.getDecoder().decode(partial.partialImageB64()));
    }
    if (event.completed().isPresent()) {
      var image =
          event.completed().orElseThrow().response().output().stream()
              .flatMap(item -> item.imageGenerationCall().stream())
              .findFirst()
              .orElseThrow(() -> new IllegalStateException("No generated image returned"));
      Files.write(
          Path.of("river-final.png"),
          Base64.getDecoder()
              .decode(
                  image
                      .result()
                      .orElseThrow(
                          () -> new IllegalStateException("No final image returned"))));
    }
  }
}
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
stream = client.responses.stream(
  model: "gpt-6-astra",
  input: "Generate an image of a river made of white owl feathers.",
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst",
      partial_images: 2
    }
  ]
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

  

  

    
图像 API

    Stream an image

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const prompt =
  "Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape";
const stream = await openai.images.generate({
  prompt: prompt,
  model: "gpt-image-2.5-sunburst",
  stream: true,
  partial_images: 2,
});

for await (const event of stream) {
  if (event.type === "image_generation.partial_image") {
    const idx = event.partial_image_index;
    const imageBase64 = event.b64_json;
    const imageBuffer = Buffer.from(imageBase64, "base64");
    fs.writeFileSync(`river${idx}.png`, imageBuffer);
  }
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()

stream = client.images.generate(
    prompt="Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",
    model="gpt-image-2.5-sunburst",
    stream=True,
    partial_images=2,
)

for event in stream:
    if event.type == "image_generation.partial_image":
        idx = event.partial_image_index
        image_base64 = event.b64_json
        image_bytes = base64.b64decode(image_base64)
        with open(f"river{idx}.png", "wb") as f:
            f.write(image_bytes)
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
	client := openai.NewClient()
	stream := client.Images.GenerateStreaming(context.Background(), openai.ImageGenerateParams{
		Model:         openai.ImageModel("gpt-image-2.5-sunburst"),
		Prompt:        "Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",
		PartialImages: openai.Int(2),
	})
	for stream.Next() {
		event := stream.Current()
		if event.Type != "image_generation.partial_image" {
			continue
		}
		partial := event.AsImageGenerationPartialImage()
		saveImage(fmt.Sprintf("river%d.png", partial.PartialImageIndex), partial.B64JSON)
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
stream = client.images.generate_stream_raw(
  model: "gpt-image-2.5-sunburst",
  prompt: "A river made of white owl feathers in a winter landscape",
  partial_images: 2
)

stream.each do |event|
  next unless event.is_a?(OpenAI::Models::ImageGenPartialImageEvent)

  image = Base64.strict_decode64(event.b64_json)
  File.binwrite("river#{event.partial_image_index}.png", image)
end
```



#### Result




| 部分 1                                                                                                     | 部分 2                                                                                                     | 最终图像                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| <img className="images-example-image" src="https://developers.openai.com/images/image-25-article/river-partial-0.png" alt="1st partial" /> | <img className="images-example-image" src="https://developers.openai.com/images/image-25-article/river-partial-1.png" alt="2nd partial" /> | <img className="images-example-image" src="https://developers.openai.com/images/image-25-article/river-final.png" alt="Final image" /> |






  提示词：绘制一幅壮丽的画面，一条由白色猫头鹰羽毛汇成的河流蜿蜒而过
  穿行于宁静的冬日风景之中



### 修订后的提示词

在 Responses API 中使用图像生成工具时，主线模型（例如， `gpt-5.5`）会自动修改你的提示词以提升效果。

你可以在 `revised_prompt` 字段中查看修改后的提示词，调用图像生成时返回：

修改后的提示词响应

```json
{
  "id": "ig_123",
  "type": "image_generation_call",
  "status": "completed",
  "revised_prompt": "A gray tabby cat hugging an otter. The otter is wearing an orange scarf. Both animals are cute and friendly, depicted in a warm, heartwarming style.",
  "result": "..."
}
```


## 编辑图像

该 [image edits](https://developers.openai.com/api/reference/resources/images) 端点可用于：

- 编辑现有图像
- 使用其他图像作为参考生成新图像
- 通过上传图像和标识待替换区域的蒙版来编辑图像的某些部分

### 使用图像引用创建新图像

你可以使用一张或多张图片作为参考来生成新图片。

在本示例中，我们将使用 4 张输入图片来生成一张新的图片，内容是一个包含参考图片中所有物品的礼篮。

Responses API

    

使用 Responses API，你可以通过 3 种不同的方式提供输入图片：

- 通过提供完整的 URL
- 通过提供 Base64 编码的 data URL 形式的图片
- 通过提供文件 ID（使用 [Files API](https://developers.openai.com/api/reference/resources/files))

#### 创建文件

创建文件

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function createFile(filePath) {
  const fileContent = fs.createReadStream(filePath);
  const result = await openai.files.create({
    file: fileContent,
    purpose: "vision",
  });
  return result.id;
}
```

```python
from openai import OpenAI

client = OpenAI()


def create_file(file_path):
    with open(file_path, "rb") as file_content:
        result = client.files.create(
            file=file_content,
            purpose="vision",
        )
        return result.id
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
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
	fmt.Println(uploaded.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import java.nio.file.Path;

var file =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.VISION)
                .build());

System.out.println(file.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = client.files.create(
  file: Pathname("image.png"),
  purpose: OpenAI::Models::FilePurpose::VISION
)
puts(file.id)
```


#### 创建一张 base64 编码的图像

创建 Base64 编码的图像

```javascript
import fs from "fs";

function encodeImage(filePath) {
  const base64Image = fs.readFileSync(filePath, "base64");
  return base64Image;
}
```

```python
import base64


def encode_image(file_path):
    with open(file_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")
    return base64_image
```

```go
package main

import (
	"encoding/base64"
	"fmt"
	"os"
)

func main() {
	image, err := os.ReadFile("image.png")
	if err != nil {
		panic(err)
	}
	fmt.Println(base64.StdEncoding.EncodeToString(image))
}
```

```ruby
require "base64"

image = File.binread("image.png")
puts(Base64.strict_encode64(image))
```


编辑图像

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

function encodeImage(filePath) {
  return fs.readFileSync(filePath, "base64");
}

async function createFile(filePath) {
  const result = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "vision",
  });
  return result.id;
}

const prompt = `Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures.`;

const base64Image1 = encodeImage("fixtures/body-lotion.png");
const base64Image2 = encodeImage("fixtures/soap.png");
const fileId1 = await createFile("fixtures/bath-bomb.png");
const fileId2 = await createFile("fixtures/incense-kit.png");

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: prompt },
        {
          type: "input_image",
          image_url: `data:image/png;base64,${base64Image1}`,
          detail: "auto",
        },
        {
          type: "input_image",
          image_url: `data:image/png;base64,${base64Image2}`,
          detail: "auto",
        },
        {
          type: "input_image",
          file_id: fileId1,
          detail: "auto",
        },
        {
          type: "input_image",
          file_id: fileId2,
          detail: "auto",
        },
      ],
    },
  ],
  tools: [{ type: "image_generation", model: "gpt-image-2.5-sunburst" }],
});

const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  fs.writeFileSync("gift-basket.png", Buffer.from(imageBase64, "base64"));
} else {
  console.log(response.output_text);
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()


def encode_image(file_path):
    with open(file_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def create_file(file_path):
    with open(file_path, "rb") as file_content:
        result = client.files.create(file=file_content, purpose="vision")
    return result.id


prompt = """Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures."""

base64_image1 = encode_image("body-lotion.png")
base64_image2 = encode_image("soap.png")
file_id1 = create_file("bath-bomb.png")
file_id2 = create_file("incense-kit.png")

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {
                    "type": "input_image",
                    "image_url": f"data:image/png;base64,{base64_image1}",
                },
                {
                    "type": "input_image",
                    "image_url": f"data:image/png;base64,{base64_image2}",
                },
                {
                    "type": "input_image",
                    "file_id": file_id1,
                },
                {
                    "type": "input_image",
                    "file_id": file_id2,
                },
            ],
        }
    ],
    tools=[{"type": "image_generation", "model": "gpt-image-2.5-sunburst"}],
)

image_generation_calls = [
    output for output in response.output if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
    image_base64 = image_data[0]
    with open("gift-basket.png", "wb") as f:
        f.write(base64.b64decode(image_base64))
else:
    print(response.output_text)
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
	bathBombID := uploadImage(client, "bath-bomb.png")
	incenseKitID := uploadImage(client, "incense-kit.png")

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{
					responses.ResponseInputContentParamOfInputText("Generate a photorealistic image of a gift basket on a white background labeled 'Relax & Unwind' with a ribbon and handwriting-like font, containing all the items in the reference pictures."),
					{OfInputImage: &responses.ResponseInputImageParam{ImageURL: openai.String(dataURL("body-lotion.png")), Detail: responses.ResponseInputImageDetailAuto}},
					{OfInputImage: &responses.ResponseInputImageParam{ImageURL: openai.String(dataURL("soap.png")), Detail: responses.ResponseInputImageDetailAuto}},
					{OfInputImage: &responses.ResponseInputImageParam{FileID: openai.String(bathBombID), Detail: responses.ResponseInputImageDetailAuto}},
					{OfInputImage: &responses.ResponseInputImageParam{FileID: openai.String(incenseKitID), Detail: responses.ResponseInputImageDetailAuto}},
				},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{Model: "gpt-image-2.5-sunburst"}}},
	})
	if err != nil {
		panic(err)
	}
	saveFirstGeneratedImage(response, "gift-basket.png")
}

func uploadImage(client openai.Client, filename string) string {
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	uploaded, err := client.Files.New(context.Background(), openai.FileNewParams{File: file, Purpose: openai.FilePurposeVision})
	if err != nil {
		panic(err)
	}
	return uploaded.ID
}

func dataURL(filename string) string {
	image, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(image)
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputImage;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.Tool;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

Path lotionImage = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH"));
Path soapImage = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH_2"));
Path bathBombImage = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH_3"));
Path incenseImage = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH_4"));
String lotionBase64 = Base64.getEncoder().encodeToString(Files.readAllBytes(lotionImage));
String soapBase64 = Base64.getEncoder().encodeToString(Files.readAllBytes(soapImage));
var firstFile =
    client
        .files()
        .create(
            FileCreateParams.builder().file(bathBombImage).purpose(FilePurpose.VISION).build());
var secondFile =
    client
        .files()
        .create(
            FileCreateParams.builder().file(incenseImage).purpose(FilePurpose.VISION).build());
String prompt =
    """
    Generate a photorealistic image of a gift basket on a white background
    labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
    containing all the items in the reference pictures.
    """;
var input =
    ResponseInputItem.ofMessage(
        ResponseInputItem.Message.builder()
            .role(ResponseInputItem.Message.Role.USER)
            .addInputTextContent(prompt)
            .addContent(
                ResponseInputImage.builder()
                    .detail(ResponseInputImage.Detail.AUTO)
                    .imageUrl("data:image/png;base64," + lotionBase64)
                    .build())
            .addContent(
                ResponseInputImage.builder()
                    .detail(ResponseInputImage.Detail.AUTO)
                    .imageUrl("data:image/png;base64," + soapBase64)
                    .build())
            .addContent(
                ResponseInputImage.builder()
                    .detail(ResponseInputImage.Detail.AUTO)
                    .fileId(firstFile.id())
                    .build())
            .addContent(
                ResponseInputImage.builder()
                    .detail(ResponseInputImage.Detail.AUTO)
                    .fileId(secondFile.id())
                    .build())
            .build());
var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .inputOfResponse(List.of(input))
                .addTool(Tool.ImageGeneration.builder().build())
                .build());
var image =
    response.output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No image generation call returned"));
Files.write(
    Path.of("gift-basket.png"),
    Base64.getDecoder()
        .decode(
            image.result().orElseThrow(() -> new IllegalStateException("No image returned"))));
```

```ruby
require "base64"
require "openai"
require "pathname"

client = OpenAI::Client.new
base64_images = ["body-lotion.png", "soap.png"].map do |path|
  Base64.strict_encode64(File.binread(path))
end
file_ids = [
  client.files.create(file: Pathname("bath-bomb.png"), purpose: :vision).id,
  client.files.create(file: Pathname("incense-kit.png"), purpose: :vision).id
]
prompt = <<~PROMPT
  Generate a photorealistic image of a gift basket on a white background
  labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
  containing all the items in the reference pictures.
PROMPT
response = client.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_text,
          text: prompt
        },
        *base64_images.map do |image|
          {
            type: :input_image,
            image_url: "data:image/png;base64,#{image}"
          }
        end,
        *file_ids.map do |file_id|
          {
            type: :input_image,
            file_id: file_id
          }
        end
      ]
    }
  ],
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst"
    }
  ]
)

image_call = response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless image_call.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No image generation call returned"
end

File.binwrite("gift-basket.png", Base64.strict_decode64(image_call.result))
```


  

  

    
图像 API

    Edit an image

```javascript
import fs from "fs";
import OpenAI, { toFile } from "openai";

const client = new OpenAI();

const prompt = `
Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures.
`;

const imageFiles = [
  "fixtures/bath-bomb.png",
  "fixtures/body-lotion.png",
  "fixtures/incense-kit.png",
  "fixtures/soap.png",
];

const images = await Promise.all(
  imageFiles.map(
    async (file) =>
      await toFile(fs.createReadStream(file), null, {
        type: "image/png",
      })
  )
);

const response = await client.images.edit({
  model: "gpt-image-2.5-sunburst",
  image: images,
  prompt,
});

// Save the image to a file
const image_base64 = response.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("basket.png", image_bytes);
```

```python
import base64
from openai import OpenAI

client = OpenAI()

prompt = """
Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures.
"""

result = client.images.edit(
    model="gpt-image-2.5-sunburst",
    image=[
        open("body-lotion.png", "rb"),
        open("bath-bomb.png", "rb"),
        open("incense-kit.png", "rb"),
        open("soap.png", "rb"),
    ],
    prompt=prompt,
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("gift-basket.png", "wb") as f:
    f.write(image_bytes)
```

```go
package main

import (
	"context"
	"encoding/base64"
	"io"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	files, closeFiles := openImages(
		"bath-bomb.png",
		"body-lotion.png",
		"incense-kit.png",
		"soap.png",
	)
	defer closeFiles()

	response, err := client.Images.Edit(context.Background(), openai.ImageEditParams{
		Model: openai.ImageModel("gpt-image-2.5-sunburst"),
		Image: openai.ImageEditParamsImageUnion{OfFileArray: files},
		Prompt: "Generate a photorealistic image of a gift basket on a white background " +
			"labeled 'Relax & Unwind' with a ribbon and handwriting-like font, containing all the items in the reference pictures.",
	})
	if err != nil {
		panic(err)
	}
	saveImage("basket.png", response.Data[0].B64JSON)
}

func openImages(names ...string) ([]io.Reader, func()) {
	images := make([]io.Reader, 0, len(names))
	files := make([]*os.File, 0, len(names))
	for _, name := range names {
		file, err := os.Open(name)
		if err != nil {
			closeFiles(files)
			panic(err)
		}
		images = append(images, openai.File(file, name, "image/png"))
		files = append(files, file)
	}
	return images, func() { closeFiles(files) }
}

func closeFiles(files []*os.File) {
	for _, file := range files {
		if err := file.Close(); err != nil {
			panic(err)
		}
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.MultipartField;
import com.openai.models.images.ImageEditParams;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

Path lotion = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH"));
Path soap = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH_2"));
Path bathBomb = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH_3"));
Path incense = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_PATH_4"));
try (InputStream lotionImage = Files.newInputStream(lotion);
    InputStream bathBombImage = Files.newInputStream(bathBomb);
    InputStream incenseImage = Files.newInputStream(incense);
    InputStream soapImage = Files.newInputStream(soap)) {
  var images =
      client
          .images()
          .edit(
              ImageEditParams.builder()
                  .model("gpt-image-2.5-sunburst")
                  .image(
                      MultipartField.<ImageEditParams.Image>builder()
                          .value(
                              ImageEditParams.Image.ofInputStreams(
                                  List.of(lotionImage, bathBombImage, incenseImage, soapImage)))
                          .contentType("image/png")
                          .filename("gift-basket-reference.png")
                          .build())
                  .prompt(
                      """
                      Generate a photorealistic image of a gift basket on a white background
                      labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
                      containing all the items in the reference pictures.
                      """)
                  .build());

  Files.write(
      Path.of("gift-basket.png"),
      Base64.getDecoder().decode(images.data().orElseThrow().get(0).b64Json().orElseThrow()));
}
```

```ruby
require "base64"
require "openai"
require "pathname"

client = OpenAI::Client.new
images = %w[body-lotion.png bath-bomb.png incense-kit.png soap.png].map do |path|
  Pathname(path)
end
result = client.images.edit(
  image: images,
  model: "gpt-image-2.5-sunburst",
  prompt: <<~PROMPT
    Generate a photorealistic image of a gift basket on a white background
    labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
    containing all the items in the reference pictures.
  PROMPT
)
generated_image = result.data&.first or raise "No image returned"
File.binwrite("gift-basket.png", Base64.strict_decode64(generated_image.b64_json))
```

```bash
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > gift-basket.png) \
  -X POST "https://api.openai.com/v1/images/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-2.5-sunburst" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Generate a photorealistic image of a gift basket on a white background labeled "Relax & Unwind" with a ribbon and handwriting-like font, containing all the items in the reference pictures'
```

```bash
openai images edit \
  --model gpt-image-2.5-sunburst \
  --image body-lotion.png \
  --image bath-bomb.png \
  --image incense-kit.png \
  --image soap.png \
  --prompt 'Generate a photorealistic image of a gift basket on a white background labeled "Relax & Unwind" with a ribbon and handwriting-like font, containing all the items in the reference pictures' \
  --raw-output \
  --transform 'data.0.b64_json' | base64 --decode > gift-basket.png
```



### 使用蒙版编辑图像

你可以提供一个蒙版，用于指定图片中应当被编辑的区域。

在使用 GPT Image 配合蒙版时，额外的提示会被发送给模型，以相应地引导编辑过程。

在 GPT Image 中使用蒙版完全基于提示。模型会将蒙版作为
  参考，但不一定能以完全的精确度遵循其具体形状。

如果你提供多张输入图像，蒙版将应用于第一张图像。



Responses API

    Edit an image with a mask

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function createFile(filePath) {
  const result = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "vision",
  });
  return result.id;
}

const fileId = await createFile("fixtures/sunlit_lounge.png");
const maskId = await createFile("fixtures/mask.png");

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "generate an image of the same sunlit indoor lounge area with a pool but the pool should contain a flamingo",
        },
        {
          type: "input_image",
          file_id: fileId,
          detail: "auto",
        },
      ],
    },
  ],
  tools: [
    {
      type: "image_generation",
      model: "gpt-image-2.5-sunburst",
      quality: "high",
      input_image_mask: {
        file_id: maskId,
      },
    },
  ],
});

const imageData = response.output
  .filter((output) => output.type === "image_generation_call")
  .map((output) => output.result);

if (imageData.length > 0) {
  const imageBase64 = imageData[0];
  fs.writeFileSync("lounge.png", Buffer.from(imageBase64, "base64"));
}
```

```python
from openai import OpenAI
import base64

client = OpenAI()


def create_file(file_path):
    with open(file_path, "rb") as file_content:
        result = client.files.create(file=file_content, purpose="vision")
    return result.id


fileId = create_file("sunlit_lounge.png")
maskId = create_file("mask.png")

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "generate an image of the same sunlit indoor lounge area with a pool but the pool should contain a flamingo",
                },
                {
                    "type": "input_image",
                    "file_id": fileId,
                },
            ],
        },
    ],
    tools=[
        {
            "type": "image_generation",
            "model": "gpt-image-2.5-sunburst",
            "quality": "high",
            "input_image_mask": {
                "file_id": maskId,
            },
        },
    ],
)

image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]

if image_data:
    image_base64 = image_data[0]
    with open("lounge.png", "wb") as f:
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
	imageID := uploadImage(client, "sunlit_lounge.png")
	maskID := uploadImage(client, "mask.png")
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(
				responses.ResponseInputMessageContentListParam{
					responses.ResponseInputContentParamOfInputText("Generate an image of the same sunlit indoor lounge area with a pool, but the pool should contain a flamingo."),
					{OfInputImage: &responses.ResponseInputImageParam{FileID: openai.String(imageID), Detail: responses.ResponseInputImageDetailAuto}},
				},
				responses.EasyInputMessageRoleUser,
			),
		}},
		Tools: []responses.ToolUnionParam{{OfImageGeneration: &responses.ToolImageGenerationParam{
			Model:          "gpt-image-2.5-sunburst",
			Quality:        "high",
			InputImageMask: responses.ToolImageGenerationInputImageMaskParam{FileID: openai.String(maskID)},
		}}},
	})
	if err != nil {
		panic(err)
	}
	saveFirstGeneratedImage(response, "lounge.png")
}

func uploadImage(client openai.Client, filename string) string {
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	uploaded, err := client.Files.New(context.Background(), openai.FileNewParams{File: file, Purpose: openai.FilePurposeVision})
	if err != nil {
		panic(err)
	}
	return uploaded.ID
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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputImage;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.Tool;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

var image =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.VISION)
                .build());

var mask =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_MASK_PATH")))
                .purpose(FilePurpose.VISION)
                .build());

var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .inputOfResponse(
                    List.of(
                        ResponseInputItem.ofMessage(
                            ResponseInputItem.Message.builder()
                                .role(ResponseInputItem.Message.Role.USER)
                                .addInputTextContent("Add a flamingo to the pool.")
                                .addContent(
                                    ResponseInputImage.builder()
                                        .detail(ResponseInputImage.Detail.AUTO)
                                        .fileId(image.id())
                                        .build())
                                .build())))
                .addTool(
                    Tool.ImageGeneration.builder()
                        .inputImageMask(
                            Tool.ImageGeneration.InputImageMask.builder()
                                .fileId(mask.id())
                                .build())
                        .build())
                .build());

String imageResult =
    response.output().stream()
        .flatMap(item -> item.imageGenerationCall().stream())
        .flatMap(call -> call.result().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No generated image returned"));
Files.write(Path.of("lounge.png"), Base64.getDecoder().decode(imageResult));
```

```ruby
require "base64"
require "openai"
require "pathname"

client = OpenAI::Client.new
image = client.files.create(file: Pathname("sunlit_lounge.png"), purpose: :vision)
mask = client.files.create(file: Pathname("mask.png"), purpose: :vision)
response = client.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_text,
          text: "Add a flamingo to the pool."
        },
        {
          type: :input_image,
          file_id: image.id
        }
      ]
    }
  ],
  tools: [
    {
      type: :image_generation,
      model: "gpt-image-2.5-sunburst",
      input_image_mask: { file_id: mask.id }
    }
  ]
)

image_call = response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
end
unless image_call.is_a?(OpenAI::Models::Responses::ResponseOutputItem::ImageGenerationCall)
  raise "No image generation call returned"
end

File.binwrite("lounge.png", Base64.strict_decode64(image_call.result))
```

  

  

    
图像 API

    Edit an image with a mask

```javascript
import fs from "fs";
import OpenAI, { toFile } from "openai";

const client = new OpenAI();

const rsp = await client.images.edit({
  model: "gpt-image-2.5-sunburst",
  image: await toFile(fs.createReadStream("fixtures/sunlit_lounge.png"), null, {
    type: "image/png",
  }),
  mask: await toFile(fs.createReadStream("fixtures/mask.png"), null, {
    type: "image/png",
  }),
  prompt: "A sunlit indoor lounge area with a pool containing a flamingo",
});

// Save the image to a file
const image_base64 = rsp.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("lounge.png", image_bytes);
```

```python
from openai import OpenAI
import base64

client = OpenAI()

result = client.images.edit(
    model="gpt-image-2.5-sunburst",
    image=open("sunlit_lounge.png", "rb"),
    mask=open("mask.png", "rb"),
    prompt="A sunlit indoor lounge area with a pool containing a flamingo",
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("composition.png", "wb") as f:
    f.write(image_bytes)
```

```go
package main

import (
	"context"
	"encoding/base64"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	image, err := os.Open("sunlit_lounge.png")
	if err != nil {
		panic(err)
	}
	defer image.Close()
	mask, err := os.Open("mask.png")
	if err != nil {
		panic(err)
	}
	defer mask.Close()

	response, err := client.Images.Edit(context.Background(), openai.ImageEditParams{
		Model:  openai.ImageModel("gpt-image-2.5-sunburst"),
		Image:  openai.ImageEditParamsImageUnion{OfFile: openai.File(image, "sunlit_lounge.png", "image/png")},
		Mask:   openai.File(mask, "mask.png", "image/png"),
		Prompt: "A sunlit indoor lounge area with a pool containing a flamingo",
	})
	if err != nil {
		panic(err)
	}
	result, err := base64.StdEncoding.DecodeString(response.Data[0].B64JSON)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("lounge.png", result, 0o600); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.MultipartField;
import com.openai.models.images.ImageEditParams;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

Path imagePath = Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH"));
Path maskPath = Path.of(System.getenv("OPENAI_EXAMPLE_IMAGE_MASK_PATH"));
try (InputStream image = Files.newInputStream(imagePath);
    InputStream mask = Files.newInputStream(maskPath)) {
  var images =
      client
          .images()
          .edit(
              ImageEditParams.builder()
                  .model("gpt-image-2.5-sunburst")
                  .image(
                      MultipartField.<ImageEditParams.Image>builder()
                          .value(ImageEditParams.Image.ofInputStream(image))
                          .contentType("image/png")
                          .filename(imagePath.getFileName().toString())
                          .build())
                  .prompt("A sunlit indoor lounge area with a pool containing a flamingo")
                  .mask(
                      MultipartField.<InputStream>builder()
                          .value(mask)
                          .contentType("image/png")
                          .filename(maskPath.getFileName().toString())
                          .build())
                  .build());

  Files.write(
      Path.of("lounge.png"),
      Base64.getDecoder().decode(images.data().orElseThrow().get(0).b64Json().orElseThrow()));
}
```

```ruby
require "openai"
require "pathname"
require "base64"

client = OpenAI::Client.new
image = Pathname("sunlit_lounge.png")
mask = Pathname("mask.png")
result = client.images.edit(
  image: image,
  mask: mask,
  model: "gpt-image-2.5-sunburst",
  prompt: "A sunlit indoor lounge area with a pool containing a flamingo"
)
generated_image = result.data&.first or raise "No image returned"
File.binwrite("lounge.png", Base64.strict_decode64(generated_image.b64_json))
```

```bash
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > lounge.png) \
  -X POST "https://api.openai.com/v1/images/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-2.5-sunburst" \
  -F "mask=@mask.png" \
  -F "image[]=@sunlit_lounge.png" \
  -F 'prompt=A sunlit indoor lounge area with a pool containing a flamingo'
```

```bash
openai images edit \
  --model gpt-image-2.5-sunburst \
  --image sunlit_lounge.png \
  --mask mask.png \
  --prompt "A sunlit indoor lounge area with a pool containing a flamingo" \
  --raw-output \
  --transform 'data.0.b64_json' | base64 --decode > out.png
```






| Image                                                                                                                                 | Mask                                                                                                                            | Output                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img className="images-example-image" src="https://cdn.openai.com/API/docs/images/sunlit_lounge.png" alt="A pink room with a pool" /> | <img className="images-example-image" src="https://cdn.openai.com/API/docs/images/mask.png" alt="A mask in part of the pool" /> | <img className="images-example-image" src="https://developers.openai.com/images/image-25-article/sunlit_lounge_result.png" alt="The original pool with an inflatable flamingo replacing the mask" /> |






  Prompt: a sunlit indoor lounge area with a pool containing a flamingo



#### 掩码要求

要编辑的图片和遮罩必须具有相同的格式和尺寸（大小小于 50MB）。

遮罩图片也必须包含 alpha 通道。如果你使用图像编辑工具创建遮罩，请务必在保存遮罩时保留 alpha 通道。

你可以通过编程方式修改黑白图片，为其添加 alpha 通道。

为黑白遮罩添加 alpha 通道

```python
from PIL import Image
from io import BytesIO

# 1. Load your black & white mask as a grayscale image
mask = Image.open("mask.png").convert("L")

# 2. Convert it to RGBA so it has space for an alpha channel
mask_rgba = mask.convert("RGBA")

# 3. Then use the mask itself to fill that alpha channel
mask_rgba.putalpha(mask)

# 4. Convert the mask into bytes
buf = BytesIO()
mask_rgba.save(buf, format="PNG")
mask_bytes = buf.getvalue()

# 5. Save the resulting file
img_path_mask_alpha = "mask_alpha.png"
with open(img_path_mask_alpha, "wb") as f:
    f.write(mask_bytes)
```

```go
package main

import (
	"image"
	"image/color"
	"image/png"
	"os"
)

func main() {
	file, err := os.Open("mask.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	mask, _, err := image.Decode(file)
	if err != nil {
		panic(err)
	}
	bounds := mask.Bounds()
	withAlpha := image.NewNRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			gray := color.GrayModel.Convert(mask.At(x, y)).(color.Gray)
			withAlpha.SetNRGBA(x, y, color.NRGBA{R: gray.Y, G: gray.Y, B: gray.Y, A: gray.Y})
		}
	}

	output, err := os.Create("mask_alpha.png")
	if err != nil {
		panic(err)
	}
	if err := png.Encode(output, withAlpha); err != nil {
		panic(err)
	}
	if err := output.Close(); err != nil {
		panic(err)
	}
}
```


## 自定义图像输出

你可以配置以下输出选项：

- **尺寸**：图像尺寸（例如， `1024x1024`, `1024x1536`)
- **质量**：渲染质量（例如， `low`, `medium`, `high`)
- **格式**：文件输出格式
- **压缩**：JPEG 和 WebP 格式的压缩级别（0-100%）
- **背景**：透明、不透明或自动

`size`, `quality`，并且 `background` 支持 `auto` 选项，模型会根据提示自动选择最佳选项。

### 尺寸与质量选项

`gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare` 添加 `xhigh` 和 `max` 质量设置。两者默认均为 `auto`。更早的 GPT Image 模型支持的质量设置最高为 `high`.

| 设置           | 选项                                                               |
| ----------------- | --------------------------------------------------------------------- |
| 推荐尺寸 | `1024x1024` (方形), `1536x1024` (横屏), `1024x1536` (竖屏) |
| 质量           | `low`, `medium`, `high`, `xhigh`, `max`, `auto`                       |

两个模型也都支持自定义尺寸，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度必须是 16 的倍数，宽高比必须在 1:3 到 3:1 之间，且任一边长不得超过 3840 像素。总像素数必须在 655,360 到 8,294,400（4K）之间。高于 `2560x1440` 的分辨率为实验性功能。

如需对任一模型使用透明背景，请设置 `background: "transparent"` 并使用 `output_format: "png"` 或 `"webp"`.

使用 `quality: "low"` 来快速生成草稿。对于最终成品，请比较不同的高质量设置，以找到在细节、延迟和成本之间的合适平衡。

### 输出格式

图像 API 返回 base64 编码的图像数据。
默认格式为 `png`，但你也可以请求 `jpeg` 或 `webp`.

如果使用 `jpeg` 或 `webp`，你还可以指定 `output_compression` 参数来控制压缩级别（0-100%）。例如， `output_compression=50` 会将图像压缩 50%。

使用 `jpeg` 比 `png`，更快，因此如果关注延迟，应优先选择此格式。
  延迟是关注点，

## 限制

GPT Image 模型功能强大且用途广泛，但仍有一些需要注意的局限性：

- **延迟：** 复杂的提示词处理时间最长可能需要 2 分钟。
- **文本渲染：** 虽然已有显著改进，但模型在精确文本排版和清晰度方面仍然可能存在不足。
- **一致性：** 虽然该模型能够生成风格一致的图像，但在多次生成过程中，偶尔仍难以保持反复出现的角色或品牌元素的视觉一致性。
- **构图控制：** 尽管指令遵循能力有所提升，但在结构化或对布局敏感的构图中，模型仍可能难以精确放置元素。

### Content Moderation

所有提示词和生成的图像都会按照我们的 [内容政策](https://openai.com/policies/usage-policies/).

对于使用 GPT Image 模型进行图像生成，你可以通过以下 `moderation` 参数控制审核严格程度。该参数支持两个值：

- `auto` (默认)：标准过滤，旨在限制生成某些类别的潜在不适合特定年龄段的内容。
- `low`：限制较少的过滤。

### 处理被阻止的请求及其他错误

处理图像生成失败的方式与处理其他 API 错误相同：检查 HTTP 状态码或 SDK 异常类型，记录请求 ID，并参考 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes) 了解身份验证、配额、速率限制和服务端故障。针对瞬时的速率限制和服务端故障进行指数退避重试。不要自动重试配额错误或需要修改请求的图像生成用户错误。

部分图像生成失败可由用户自行修正，并可能返回 `error.type = "image_generation_user_error"`。除非修改提示词或输入图像，否则请勿自动重试这些错误。如需以编程方式处理，请使用 `error.code` 作为稳定的区分字段。

当 `error.code = "moderation_blocked"`，错误还可能包含一个可选的 `error.moderation_details` 对象：

```json
{
  "error": {
    "type": "image_generation_user_error",
    "code": "moderation_blocked",
    "moderation_details": {
      "moderation_stage": "input",
      "categories": ["harassment"]
    }
  }
}
```

该 `moderation_details` 对象提供粗粒度的调试上下文，且不会暴露内部分类器的标签或分数。

`moderation_stage` 可以是：

- `input`: 该数据块来自 prompt 或请求输入。
- `output`: 该数据块来自生成的图像或下游输出审核阶段。
- `unknown`: 在难以判定来源时使用的罕见回退值。

`categories` 包含粗粒度的公开标签。例如，你可能会看到类似 `harassment`, `self-harm`, `sexual`，的值，或者 `violence`.

对于大多数应用，保持面向终端用户的主消息通用。使用 `moderation_details` 用于开发者日志、支持工作流、分析以及轻量化的修正提示。

处理被审核拦截的图像生成错误

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

try {
  // The same error handling pattern applies to image generation requests,
  // image edits, and Responses API tool calls that generate images.
  await openai.images.generate({
    model: "gpt-image-2.5-sunburst",
    prompt: "Create a poster humiliating my coworker with insulting captions",
  });
} catch (error) {
  if (error?.code !== "moderation_blocked") {
    throw error;
  }

  const moderationDetails = error.error?.moderation_details;
  const categories = moderationDetails?.categories ?? [];
  const stage = moderationDetails?.moderation_stage;

  let hint =
    "This request could not be completed because it did not meet safety requirements.";

  if (categories.includes("harassment")) {
    hint =
      "Try removing abusive or targeting language and focus on neutral visual details instead.";
  } else if (stage === "input") {
    hint =
      "Try revising the prompt or input images and submit the request again.";
  } else if (stage === "output") {
    hint =
      "The generated result was blocked by a safety check. Try changing the prompt and generating again.";
  }

  console.error("Image generation blocked", {
    request_id: error?.requestID,
    code: error?.code,
    moderation_details: moderationDetails,
  });

  console.log(hint);
}
```

```python
import openai
from openai import OpenAI

client = OpenAI()

try:
    # The same error handling pattern applies to image generation requests,
    # image edits, and Responses API tool calls that generate images.
    client.images.generate(
        model="gpt-image-2.5-sunburst",
        prompt="Create a poster humiliating my coworker with insulting captions",
    )
except openai.BadRequestError as error:
    if error.code != "moderation_blocked":
        raise

    error_body = error.body if isinstance(error.body, dict) else {}
    moderation_details = error_body.get("moderation_details") or {}
    categories = moderation_details.get("categories") or []
    stage = moderation_details.get("moderation_stage")

    hint = "This request could not be completed because it did not meet safety requirements."

    if "harassment" in categories:
        hint = "Try removing abusive or targeting language and focus on neutral visual details instead."
    elif stage == "input":
        hint = "Try revising the prompt or input images and submit the request again."
    elif stage == "output":
        hint = "The generated result was blocked by a safety check. Try changing the prompt and generating again."

    print(
        "Image generation blocked",
        {
            "request_id": error.request_id,
            "code": error.code,
            "moderation_details": moderation_details,
        },
    )

    print(hint)
```

```go
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	_, err := client.Images.Generate(context.Background(), openai.ImageGenerateParams{
		Model:  openai.ImageModel("gpt-image-2.5-sunburst"),
		Prompt: "Create a poster humiliating my coworker with insulting captions",
	})
	if err == nil {
		return
	}

	var apiError *openai.Error
	if !errors.As(err, &apiError) || apiError.Code != "moderation_blocked" {
		panic(err)
	}

	var body struct {
		ModerationDetails struct {
			Categories      []string `json:"categories"`
			ModerationStage string   `json:"moderation_stage"`
		} `json:"moderation_details"`
	}
	if err := json.Unmarshal([]byte(apiError.RawJSON()), &body); err != nil {
		panic(err)
	}

	hint := "This request could not be completed because it did not meet safety requirements."
	if slices.Contains(body.ModerationDetails.Categories, "harassment") {
		hint = "Try removing abusive or targeting language and focus on neutral visual details instead."
	} else if body.ModerationDetails.ModerationStage == "input" {
		hint = "Try revising the prompt or input images and submit the request again."
	} else if body.ModerationDetails.ModerationStage == "output" {
		hint = "The generated result was blocked by a safety check. Try changing the prompt and generating again."
	}

	fmt.Printf("Image generation blocked (%s): %s\n", apiError.Code, hint)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.errors.BadRequestException;
import com.openai.models.images.ImageGenerateParams;
import java.util.List;
import java.util.Map;

try {
  var images =
      client
          .images()
          .generate(
              ImageGenerateParams.builder()
                  .model("gpt-image-2.5-sunburst")
                  .prompt("Create a poster humiliating my coworker with insulting captions")
                  .build());

  System.out.println(images.data().orElseThrow().get(0).b64Json().orElseThrow());
} catch (BadRequestException error) {
  if (!error.code().orElse("").equals("moderation_blocked")) {
    throw error;
  }
  Map<?, ?> body = error.body().convert(Map.class);
  Object detailsValue = body.get("moderation_details");
  Map<?, ?> details = detailsValue instanceof Map<?, ?> values ? values : Map.of();
  Object categories = details.get("categories");
  Object stage = details.get("moderation_stage");

  String hint = "This request did not meet safety requirements.";
  if (categories instanceof List<?> values && values.contains("harassment")) {
    hint = "Remove abusive or targeting language and focus on neutral visual details.";
  } else if ("input".equals(stage)) {
    hint = "Revise the prompt or input images, then submit the request again.";
  } else if ("output".equals(stage)) {
    hint = "Change the prompt and generate again; the generated result was blocked.";
  }
  System.err.println("Image generation blocked (" + error.code().orElseThrow() + "): " + hint);
}
```

```ruby
require "openai"

client = OpenAI::Client.new
begin
  client.images.generate(
    model: "gpt-image-2.5-sunburst",
    prompt: "Create a poster humiliating my coworker with insulting captions"
  )
rescue OpenAI::Errors::BadRequestError => error
  raise unless error.code == "moderation_blocked"

  body = Hash.try_convert(error.body) || {}
  moderation_details = body[:moderation_details] || body["moderation_details"] || {}
  categories = moderation_details[:categories] || moderation_details["categories"] || []
  stage = moderation_details[:moderation_stage] || moderation_details["moderation_stage"]

  hint = "This request did not meet safety requirements."
  if categories.include?("harassment")
    hint = "Remove abusive or targeting language and focus on neutral visual details."
  elsif stage == "input"
    hint = "Revise the prompt or input images, then submit the request again."
  elsif stage == "output"
    hint = "Change the prompt and generate again; the generated result was blocked."
  end

  warn("Image generation blocked (#{error.code}): #{hint}")
end
```


### Supported models

在 Responses API 中使用图像生成时， `gpt-5` 较新的模型应支持图像生成工具。 [请查看对应模型的详情页](https://developers.openai.com/api/docs/models) 以确认你所使用的模型是否可以使用图像生成工具。

## 成本与延迟

### GPT Image 2.5 成本

Responses API 请求除了包含图像生成费用外，还包含主模型的 token 使用量。

两个 GPT Image 2.5 模型使用相同的 token 费率：图像输入 token 8 美元/百万，缓存的图像输入 token 2 美元/百万，图像输出 token 30 美元/百万，文本输入 token 5 美元/百万，缓存的文本输入 token 1.25 美元/百万。详见 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

使用响应的 `usage` 来衡量你的提示、尺寸和质量设置的 token 消耗。相同的 token 费率并不意味着每张图像的成本相同：不同模型和质量设置的 token 消耗可能不同。有关旧模型的定价示例，请参阅 [更早的 GPT Image 模型](#earlier-gpt-image-models).




### GPT Image 2.5 和 GPT Image 2 输出 token

选择模型、质量和尺寸以估算输出 token 和图像输出费用。
对于 `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,质量选项包括 `low`, `medium`, `high`, `xhigh`，并且 `max`.
对于 `gpt-image-2`,选项包括 `low`, `medium`，并且 `high`.
不同模型在同一质量设置下可能使用不同的 token 数,且每张图像输出 token 的价格相同。
在此估算中使用明确的质量和尺寸值; `auto` 取决于生成的图像。

<GptImageTokenCalculator
  client:load
  outputPricePerMillion={Number(
    pricing.latest.subsections
      .find((section) => section.price_type === "Image tokens")
      ?.items.find((item) => item.name === "gpt-image-2")?.values.main.output
  )}
/>

### Partial images cost

如果你希望 [流式生成图像](#streaming) 使用 `partial_images` 参数，每个部分图像将额外产生 100 个图像输出 token。

## 更早的 GPT Image 模型

以下详细信息适用于更早的模型，不适用于 Sunburst 或 Flare。对于新的集成，请使用上文介绍的某个 GPT Image 2.5 模型。

<details>
<summary>GPT Image 2 settings and input fidelity</summary>

`gpt-image-2` 参数接受任何满足以下约束的分辨率。 `size` 方形图像通常是生成速度最快的。

<table>
  <tbody>
    <tr>
      <td>Popular sizes</td>
      <td>
        <ul>
          <li>
            `1024x1024` (square)
          </li>
          <li>
            `1536x1024` (landscape)
          </li>
          <li>
            `1024x1536` (portrait)
          </li>
          <li>
            `2048x2048` (2K square)
          </li>
          <li>
            `2048x1152` (2K landscape)
          </li>
          <li>
            `3840x2160` (4K landscape)
          </li>
          <li>
            `2160x3840` (4K portrait)
          </li>
          <li>
            `auto` (default)
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Size constraints</td>
      <td>
        <ul>
          <li>
            Maximum edge length must be less than or equal to 
            `3840px`
          </li>
          <li>
            Both edges must be multiples of `16px`
          </li>
          <li>
            Long edge to short edge ratio must not exceed `3:1`
          </li>
          <li>
            Total pixels must be at least `655,360` and no more than 
            `8,294,400`
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Quality options</td>
      <td>
        <ul>
          <li>
            `low`
          </li>
          <li>
            `medium`
          </li>
          <li>
            `high`
          </li>
          <li>
            `auto` (default)
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### 图像输入保真度

该 `input_fidelity` 参数控制模型在编辑和参考图像工作流中保留输入图像细节的程度。对于 `gpt-image-2`，请省略此参数；API 不允许更改它，因为模型会自动以高保真度处理每个图像输入。

由于 `gpt-image-2` 始终以高保真度处理图像输入，包含参考图像的编辑请求的图像
  输入 token 可能会更高。要了解
  成本影响，请参阅 [视觉
  费用](https://developers.openai.com/api/docs/guides/images-vision?api-mode=responses#calculating-costs)
  部分。

</details>

<details>
<summary>Older-model pricing examples</summary>

### 更早的模型 `gpt-image-2`

GPT Image models prior to `gpt-image-2` 通过首先生成专用的图像 token 来生成图像。延迟和最终成本都与渲染图像所需的 token 数量成正比——更大的图像尺寸和更高的质量设置会导致更多 token。

生成的 token 数量取决于图像尺寸和质量：

| 质量 | 方形 (1024×1024) | 纵向 (1024×1536) | 横向 (1536×1024) |
| ------- | ------------------ | -------------------- | --------------------- |
| 低     | 272 tokens         | 408 tokens           | 400 tokens            |
| 中  | 1056 tokens        | 1584 tokens          | 1568 tokens           |
| 高    | 4160 tokens        | 6240 tokens          | 6208 tokens           |

请注意，你还需要将 [输入 token](https://developers.openai.com/api/docs/guides/images-vision?api-mode=responses#calculating-costs)：提示词的文本 token，以及在编辑图像时输入图像的图像 token。
由于 `gpt-image-2` 始终以高保真度处理图像输入，包含参考图像的编辑请求可能会使用更多的输入 token。

请参阅 [定价页面](https://developers.openai.com/api/docs/pricing#image-generation) 查看当前的
文本和图像 token 价格，并使用 [费用计算](#calculating-costs)
部分估算请求费用。

最终费用是以下各项的总和：

- 输入文本 token
- 如果使用编辑端点，则为输入图像 token
- 图像输出 token

### Calculating costs

使用下面的定价计算器来估算 GPT Image 模型的请求成本。
`gpt-image-2` 支持数千种有效分辨率；下表列出了为便于比较而沿用的
此前 GPT Image 模型所使用的相同尺寸。针对 GPT Image 1.5、
GPT Image 1 和 GPT Image 1 Mini，旧的按图像输出定价表也
在下方列出。在估算请求总成本时，你仍然需要将文本和图像输入
词元计入在内。

在相同的质量设置下，较大的非方形分辨率有时会比较小或
  方形分辨率生成更少的输出词元。

<table
  style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%" }}
>
  <thead>
    <tr>
      <th style={{ textAlign: "left", padding: "8px", width: "28%" }}>Model</th>
      <th style={{ textAlign: "left", padding: "8px", width: "14%" }}>
        Quality
      </th>
      <th style={{ padding: "8px", width: "19.33%" }}>1024 x 1024</th>
      <th style={{ padding: "8px", width: "19.33%" }}>1024 x 1536</th>
      <th style={{ padding: "8px", width: "19.34%" }}>1536 x 1024</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowSpan="3" style={{ padding: "8px", width: "28%" }}>
        GPT Image 2
        

        
其他可用尺寸

      </td>
      <td style={{ padding: "8px" }}>Low</td>
      <td style={{ padding: "8px" }}>$0.006</td>
      <td style={{ padding: "8px" }}>$0.005</td>
      <td style={{ padding: "8px" }}>$0.005</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>Medium</td>
      <td style={{ padding: "8px" }}>$0.053</td>
      <td style={{ padding: "8px" }}>$0.041</td>
      <td style={{ padding: "8px" }}>$0.041</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>High</td>
      <td style={{ padding: "8px" }}>$0.211</td>
      <td style={{ padding: "8px" }}>$0.165</td>
      <td style={{ padding: "8px" }}>$0.165</td>
    </tr>

    <tr>
      <td rowSpan="3" style={{ padding: "8px", width: "28%" }}>
        GPT Image 1.5
      </td>
      <td style={{ padding: "8px" }}>Low</td>
      <td style={{ padding: "8px" }}>$0.009</td>
      <td style={{ padding: "8px" }}>$0.013</td>
      <td style={{ padding: "8px" }}>$0.013</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>Medium</td>
      <td style={{ padding: "8px" }}>$0.034</td>
      <td style={{ padding: "8px" }}>$0.05</td>
      <td style={{ padding: "8px" }}>$0.05</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>High</td>
      <td style={{ padding: "8px" }}>$0.133</td>
      <td style={{ padding: "8px" }}>$0.2</td>
      <td style={{ padding: "8px" }}>$0.2</td>
    </tr>

    <tr>
      <td rowSpan="3" style={{ padding: "8px", width: "28%" }}>
        GPT Image 1
      </td>
      <td style={{ padding: "8px" }}>Low</td>
      <td style={{ padding: "8px" }}>$0.011</td>
      <td style={{ padding: "8px" }}>$0.016</td>
      <td style={{ padding: "8px" }}>$0.016</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>Medium</td>
      <td style={{ padding: "8px" }}>$0.042</td>
      <td style={{ padding: "8px" }}>$0.063</td>
      <td style={{ padding: "8px" }}>$0.063</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>High</td>
      <td style={{ padding: "8px" }}>$0.167</td>
      <td style={{ padding: "8px" }}>$0.25</td>
      <td style={{ padding: "8px" }}>$0.25</td>
    </tr>

    <tr>
      <td rowSpan="3" style={{ padding: "8px", width: "28%" }}>
        GPT Image 1 Mini
      </td>
      <td style={{ padding: "8px" }}>Low</td>
      <td style={{ padding: "8px" }}>$0.005</td>
      <td style={{ padding: "8px" }}>$0.006</td>
      <td style={{ padding: "8px" }}>$0.006</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>Medium</td>
      <td style={{ padding: "8px" }}>$0.011</td>
      <td style={{ padding: "8px" }}>$0.015</td>
      <td style={{ padding: "8px" }}>$0.015</td>
    </tr>
    <tr>
      <td style={{ padding: "8px" }}>High</td>
      <td style={{ padding: "8px" }}>$0.036</td>
      <td style={{ padding: "8px" }}>$0.052</td>
      <td style={{ padding: "8px" }}>$0.052</td>
    </tr>

  </tbody>
</table>

</details>