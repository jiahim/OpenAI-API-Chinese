# 内容审核

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

使用 OpenAI 审核模型来检测文本和图像中的有害内容。你可以使用 [moderation 端点](https://developers.openai.com/api/reference/resources/moderations) 对独立输入进行分类，或在生成响应的同时请求审核评分。利用这些结果执行你的应用程序策略，例如过滤内容、将请求路由以供审核，或对提交被标记内容的账户进行干预。

该 `omni-moderation-latest` 模型接受文本和图像输入，不对音频进行分类。moderation 端点可免费使用，图像文件最大可达 20 MB。

## 选择审核工作流

| 工作流                                                        | 适用场景                                                                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [审核生成的内容](#moderate-generated-content)       | 你的应用使用Responses API 或 Chat Completions API 生成文本，并需要审核信号。 |
| [对独立输入进行分类](#classify-standalone-inputs)       | 你的应用需要在不生成模型响应的情况下对文本或图像进行分类。                       |
| [理解审核结果](#understand-moderation-results) | 你的应用需要解读标记、类别、分数或已应用的输入类型。                       |
| [查看支持的类别](#review-supported-categories)     | 你的应用需要了解哪些危害类别适用于文本、图像或两者。                         |

## 审核生成的内容

当你的应用需要同时获取生成文本和审核分数时，请在生成请求中传入顶层 `moderation` 对象。API 会针对模型输入和生成输出返回审核分数，无需发起单独的审核请求。

模型仍会正常生成。在将输出展示给用户或执行下游操作前，请先查看审核结果。



在创建响应时设置 `moderation.model` ：

生成带有审核分数的响应

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


Responses API 会返回一个输入 `moderation_result` 对象，位于 `response.moderation.input` ，以及一个输出 `moderation_result` 对象，位于 `response.moderation.output`.





内联审核结果使用的类别字段与独立审核结果一致。首先使用 `flagged` 进行首轮判定，然后查看 `categories` 和 `category_scores` ，用于日志记录、路由、审计轨迹或人工审核队列。即使是拒绝回答或其他具有安全意识的响应，只要涉及有害内容，仍可能触发标记。请将审核分数视为应用策略的参考信号，而非自动阻止决策的依据。

如果你的应用需要处理审核失败的情况，请在读取分数之前先检查审核结果的类型。如果某个审核步骤无法完成，对应的输入或输出审核字段可能返回错误，而不是审核分数。

对于工具调用请求，当工具调用参数和工具输出出现在对话内容中时，审核会覆盖它们。审核不覆盖工具名称、工具描述、工具 schema 或响应格式 schema。

如果你以流式方式获取生成的响应，审核分数会在完整生成输出可用后才到达，而不会随部分输出的增量一起返回。

## 对独立输入进行分类

使用 [moderation 端点](https://developers.openai.com/api/reference/resources/moderations) 对文本或图像输入进行分类，而无需生成模型响应。下方标签页展示了如何配合 [OpenAI libraries](https://developers.openai.com/api/docs/libraries) 以及 [`omni-moderation-latest` model](https://developers.openai.com/api/docs/models#moderation):



审核文本输入

    

获取文本输入的分类信息

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

```csharp
using OpenAI.Moderations;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "omni-moderation-latest";
ModerationClient client = new(model, key);

ModerationResult result = await client.ClassifyTextAsync(
    "Text to classify goes here."
);

Console.WriteLine($"Flagged: {result.Flagged}");
Console.WriteLine(
    $"Violence: {result.Violence.Flagged}; score: {result.Violence.Score:F3}"
);
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


  

  

    
审核图像和文本

    

获取图像和文本输入的分类信息

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

```csharp
using OpenAI.Moderations;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "omni-moderation-latest";
ModerationClient client = new(model, key);

ModerationResult result = await client.ClassifyInputsAsync(
    [
        ModerationInputPart.CreateTextPart("Text to classify goes here."),
        ModerationInputPart.CreateImagePart(
            new Uri(
                "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
            )
        ),
    ]
);

Console.WriteLine($"Flagged: {result.Flagged}");
Console.WriteLine(
    $"Violence: {result.Violence.Flagged}; score: {result.Violence.Score:F3}; inputs: {result.Violence.ApplicableInputKinds}"
);
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



## 理解审核结果

以下是来自一部战争电影单帧图像的完整示例输出。模型会识别图像中的暴力迹象，并给出 `violence` 大于 0.8 的类别分数。

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

JSON 响应包含描述输入中存在哪些类别以及模型对每个类别的置信度的字段。

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

我们计划持续升级审核端点所依赖的底层模型。
  因此，依赖于 `category_scores` 的策略可能需要
  随时间重新校准。

## 查看支持的类别

下表说明了审核接口能够检测的内容类别，以及每个类别支持的输入类型。

标记为“仅文本”的类别不支持图像输入。如果你只向
  模型发送图像（不含伴随文本），它会针对这些不支持的类别返 `omni-moderation-latest` 回 0 分。图像文件大小有
  限，不得超过 20 MB。
  （无对应正文）

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