# 文件输入

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可以通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

文件输入支持取决于API端点。Responses API接受以下列出的文件类型作为 `input_file` 项目。Chat Completions 仅接受 PDF 文件作为 `file` 内容部分。

| Input method                           | Responses API                     | Chat Completions |
| -------------------------------------- | --------------------------------- | ---------------- |
| Base64-encoded file data (`file_data`) | Supported file types listed below | PDF only         |
| Uploaded file ID (`file_id`)           | Supported file types listed below | PDF only         |
| External file URL (`file_url`)         | Supported file types listed below | Not supported    |

使用 Responses API 处理非 PDF 文件输入。如果要在 Chat Completions 中使用文件中的文本，请在应用中读取该文件，并将其内容作为 `text` 内容部分发送。

## 工作原理

在 Responses API 中， `input_file` 处理方式取决于文件类型：

- **PDF 文件**：在具备视觉能力的模型（例如 `gpt-4o` 及更高版本的模型）上，API 会同时提取文本和页面图像，并将两者一并发送给模型。
- **非 PDF 文档和文本文件** （例如， `.docx`, `.pptx`, `.txt`，以及代码文件）：API 仅提取文本。
- **电子表格文件** （例如， `.xlsx`, `.csv`, `.tsv`）：API 会运行针对电子表格的专用增强流程（见下文描述）。

当这些相关工具更匹配你的任务时使用它们：

- 使用 [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search) 用于对大文件进行检索，而不是直接将它们作为 `input_file`.
- 使用 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 用于需要详细分析的电子表格密集型任务，例如聚合、连接、图表或自定义计算。

## 非 PDF 图像和图表的限制

对于非 PDF 文件，Responses API 不会提取其中嵌入的图片或图表
到模型上下文中。

若要保持图表和示意图的保真度，请先将文件转换为 PDF，然后
发送该 PDF 作为 `input_file`.

## 电子表格增强的工作原理

对于类电子表格的文件（例如 `.xlsx`, `.xls`, `.csv`, `.tsv`）和
`.iif`），Responses API 使用一种针对电子表格的增强处理流程。

它不会将整张工作表直接传给模型，而是由 API 对每张工作表解析最多前
1,000 行，并附加模型生成的摘要与表头元数据，以便
模型基于一个更小、结构化的数据视图进行工作。

## PDF 详细程度

对于 Responses API 中的 PDF 输入，设置可选的 `detail` 字段，位于
`input_file` 项上，用于 `auto`, `low`，或 `high` 以控制 API 如何处理
页面图像。如果省略， `detail` 默认为 `auto`。对于 GPT-5.6 及更高版本
的模型， `auto` 使用 `high`；对于更早的模型，它使用 `low`。使用 `low` 可以使用更少的
输入令牌，或者 `high` 可以获得更丰富的视觉细节，例如密集图表、小号字体，
或图表。

该 `detail` 设置仅影响 PDF 页面图像处理。从 PDF 中提取的
文本仍然会被包含。Chat Completions 文件输入不支持 `detail`.

显式指定高细节的最小 Responses API 请求体如下所示：

```json
{
  "model": "gpt-4.1",
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_file",
          "filename": "document.pdf",
          "file_data": "data:application/pdf;base64,...",
          "detail": "high"
        },
        {
          "type": "input_text",
          "text": "Summarize this document."
        }
      ]
    }
  ]
}
```

## 接受的文件类型

下表列出了 Responses API 接受作为
`input_file` 项目的常见文件类型。扩展名和 MIME 类型的完整列表稍后在本页
列出。Chat Completions 仅支持 `.pdf` (`application/pdf`) 用于两者
`file_data` 和 `file_id`.

| 类别       | 常见扩展名                                   |
| -------------- | --------------------------------------------------- |
| PDF 文件      | `.pdf`                                              |
| 文本与代码  | `.txt`, `.md`, `.json`, `.html`, `.xml`、代码文件 |
| 富文档 | `.doc`, `.docx`, `.rtf`, `.odt`                     |
| 演示文稿  | `.ppt`, `.pptx`                                     |
| 电子表格   | `.csv`, `.xls`, `.xlsx`                             |

## 文件 URL



你可以通过链接外部 URL 来提供文件输入。

使用外部文件 URL

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Analyze the letter and provide a summary of the key points.",
        },
        {
          type: "input_file",
          file_url: "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
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
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Analyze the letter and provide a summary of the key points.",
                },
                {
                    "type": "input_file",
                    "file_url": "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
                },
            ],
        },
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					responses.ResponseInputMessageContentListParam{
						responses.ResponseInputContentParamOfInputText(
							"Analyze the letter and provide a summary of the key points.",
						),
						{
							OfInputFile: &responses.ResponseInputFileParam{
								FileURL: openai.String(
									"https://www.berkshirehathaway.com/letters/2024ltr.pdf",
								),
							},
						},
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
import com.openai.models.responses.ResponseInputFile;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofMessage(
                    ResponseInputItem.Message.builder()
                        .role(ResponseInputItem.Message.Role.USER)
                        .addInputTextContent(
                            "Analyze the letter and provide a summary of the key points.")
                        .addContent(
                            ResponseInputFile.builder()
                                .fileUrl(
                                    "https://www.berkshirehathaway.com/letters/2024ltr.pdf")
                                .build())
                        .build())))
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

Uri fileUrl = new(
    "https://www.berkshirehathaway.com/letters/2024ltr.pdf"
);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputTextPart(
                    "Analyze the letter and provide a summary of the key points."
                ),
                ResponseContentPart.CreateInputFilePart(fileUrl),
            ]
        ),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Analyze the letter and provide a summary of the key points."
        },
        {
          type: "input_file",
          file_url: "https://www.berkshirehathaway.com/letters/2024ltr.pdf"
        }
      ]
    }
  ]
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-6-astra",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Analyze the letter and provide a summary of the key points."
                    },
                    {
                        "type": "input_file",
                        "file_url": "https://www.berkshirehathaway.com/letters/2024ltr.pdf"
                    }
                ]
            }
        ]
    }'
```






## 上传文件

以下示例使用 [Files API](https://developers.openai.com/api/reference/resources/files)，上传文件，然后在向模型发起的请求中引用其文件 ID。



上传文件

```javascript
import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const file = await client.files.create({
  file: fs.createReadStream("fixtures/draconomicon.pdf"),
  purpose: "user_data",
});

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          file_id: file.id,
        },
        {
          type: "input_text",
          text: "What is the first dragon in the book?",
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

file = client.files.create(file=open("draconomicon.pdf", "rb"), purpose="user_data")

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_id": file.id,
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?",
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

	file, err := os.Open("draconomicon.pdf")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	uploadedFile, err := client.Files.New(context.Background(), openai.FileNewParams{
		File:    file,
		Purpose: openai.FilePurposeUserData,
	})
	if err != nil {
		panic(err)
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					responses.ResponseInputMessageContentListParam{
						{
							OfInputFile: &responses.ResponseInputFileParam{
								FileID: openai.String(uploadedFile.ID),
							},
						},
						responses.ResponseInputContentParamOfInputText(
							"What is the first dragon in the book?",
						),
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
import com.openai.models.responses.ResponseInputFile;
import com.openai.models.responses.ResponseInputItem;
import java.nio.file.Path;
import java.util.List;

var file =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.USER_DATA)
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
                                .addContent(
                                    ResponseInputFile.builder().fileId(file.id()).build())
                                .addInputTextContent("What is the first dragon in the book?")
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

OpenAIFileClient files = new(key);

OpenAIFile file = await files.UploadFileAsync(
    "draconomicon.pdf",
    FileUploadPurpose.UserData
);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputFilePart(file.Id),
                ResponseContentPart.CreateInputTextPart(
                    "What is the first dragon in the book?"
                ),
            ]
        ),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"
require "pathname"

openai = OpenAI::Client.new

file = openai.files.create(
  file: Pathname("draconomicon.pdf"),
  purpose: "user_data"
)

response = openai.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          file_id: file.id
        },
        {
          type: "input_text",
          text: "What is the first dragon in the book?"
        }
      ]
    }
  ]
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F purpose="user_data" \
    -F file="@draconomicon.pdf"

curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-6-astra",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": "file-6F2ksmvXxt4VdoqmHRw6kL"
                    },
                    {
                        "type": "input_text",
                        "text": "What is the first dragon in the book?"
                    }
                ]
            }
        ]
    }'
```






## Base64 编码文件

你也可以将文件输入作为 Base64 编码的文件数据发送。



发送 Base64 编码的文件

```javascript
import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const data = fs.readFileSync("fixtures/draconomicon.pdf");
const base64String = data.toString("base64");

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          filename: "draconomicon.pdf",
          file_data: `data:application/pdf;base64,${base64String}`,
        },
        {
          type: "input_text",
          text: "What is the first dragon in the book?",
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

with open("draconomicon.pdf", "rb") as f:
    data = f.read()

base64_string = base64.b64encode(data).decode("utf-8")

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "filename": "draconomicon.pdf",
                    "file_data": f"data:application/pdf;base64,{base64_string}",
                },
                {
                    "type": "input_text",
                    "text": "What is the first dragon in the book?",
                },
            ],
        },
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

	data, err := os.ReadFile("draconomicon.pdf")
	if err != nil {
		panic(err)
	}
	fileData := "data:application/pdf;base64," + base64.StdEncoding.EncodeToString(data)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					responses.ResponseInputMessageContentListParam{
						{
							OfInputFile: &responses.ResponseInputFileParam{
								Filename: openai.String("draconomicon.pdf"),
								FileData: openai.String(fileData),
							},
						},
						responses.ResponseInputContentParamOfInputText(
							"What is the first dragon in the book?",
						),
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
import com.openai.models.responses.ResponseInputFile;
import com.openai.models.responses.ResponseInputItem;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

String pdfData =
    Base64.getEncoder()
        .encodeToString(Files.readAllBytes(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH"))));
ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofMessage(
                    ResponseInputItem.Message.builder()
                        .role(ResponseInputItem.Message.Role.USER)
                        .addContent(
                            ResponseInputFile.builder()
                                .filename("document.pdf")
                                .fileData("data:application/pdf;base64," + pdfData)
                                .build())
                        .addInputTextContent("Summarize this document.")
                        .build())))
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

BinaryData fileBytes = BinaryData.FromBytes(await File.ReadAllBytesAsync("draconomicon.pdf"));
ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [
        ResponseItem.CreateUserMessageItem(
            [
                ResponseContentPart.CreateInputFilePart(
                    fileBytes,
                    "application/pdf",
                    "draconomicon.pdf"
                ),
                ResponseContentPart.CreateInputTextPart(
                    "What is the first dragon in the book?"
                ),
            ]
        ),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
pdf_data = Base64.strict_encode64(File.binread("draconomicon.pdf"))
response = client.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_file,
          filename: "document.pdf",
          file_data: "data:application/pdf;base64,#{pdf_data}"
        },
        {
          type: :input_text,
          text: "Summarize this document."
        }
      ]
    }
  ]
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-6-astra",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "filename": "draconomicon.pdf",
                        "file_data": "...base64 encoded PDF bytes here..."
                    },
                    {
                        "type": "input_text",
                        "text": "What is the first dragon in the book?"
                    }
                ]
            }
        ]
    }'
```






## 使用注意事项

使用文件输入时请注意以下限制：

- **Token 用量：** PDF 解析会同时把提取的文本和页面图像放入上下文，这会增加 token 用量。在 Responses API 中，设置 `detail` 为 `auto` （默认值）， `low`，或 `high` 以控制 PDF 页面图像的视觉细节量。在大规模部署之前，请查看价格和 token 相关影响。 [价格详情](https://developers.openai.com/api/docs/pricing).
- **文件大小限制：** 单个请求可以包含多个文件，但每个文件必须小于 50 MB。请求中所有文件的总上限为 50 MB。
- **支持的模型：** 包含文本和页面图像的 PDF 解析需要具备视觉能力的模型，例如 `gpt-4o` 及更高版本模型。
- **文件上传用途：** 你可以使用任何受支持的 [purpose](https://developers.openai.com/api/reference/resources/files/methods/create#files-create-purpose)，上传文件，但请使用 `user_data` 来上传你计划作为模型输入的文件。

## 接受的文件类型完整列表

此列表适用于 Responses API。Chat Completions 仅支持 `.pdf`
(`application/pdf`) 用于两者 `file_data` 和 `file_id`.

| 类别       | 扩展名                                                                                                                                                                                                                                                                                                                                                 | MIME 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PDF 文件      | PDF 文件（`.pdf`)                                                                                                                                                                                                                                                                                                                                         | `application/pdf`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 电子表格   | Excel 表格（`.xla`, `.xlb`, `.xlc`, `.xlm`, `.xls`, `.xlsx`, `.xlt`, `.xlw`)                                                                                                                                                                                                                                                                             | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 电子表格   | CSV / TSV / IIF（`.csv`, `.tsv`, `.iif`）、Google Sheets                                                                                                                                                                                                                                                                                                    | `text/csv`, `application/csv`, `text/tsv`, `text/x-iif`, `application/x-iif`, `application/vnd.google-apps.spreadsheet`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 富文档 | Word/ODT/RTF 文档（`.doc`, `.docx`, `.dot`, `.odt`, `.rtf`）、Pages、Google Docs                                                                                                                                                                                                                                                                            | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`, `application/rtf`, `text/rtf`, `application/vnd.oasis.opendocument.text`, `application/vnd.apple.pages`, `application/vnd.google-apps.document`, `application/vnd.apple.iwork`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 演示文稿  | PowerPoint 幻灯片（`.pot`, `.ppa`, `.pps`, `.ppt`, `.pptx`, `.pwz`, `.wiz`）、Keynote、Google Slides                                                                                                                                                                                                                                                        | `application/vnd.openxmlformats-officedocument.presentationml.presentation`, `application/vnd.ms-powerpoint`, `application/vnd.apple.keynote`, `application/vnd.google-apps.presentation`, `application/vnd.apple.iwork`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 文本与代码  | 文本/代码格式（`.asm`, `.bat`, `.c`, `.cc`, `.conf`, `.cpp`, `.css`, `.cxx`, `.def`, `.dic`, `.eml`, `.h`, `.hh`, `.htm`, `.html`, `.ics`, `.ifb`, `.in`, `.js`, `.json`, `.ksh`, `.list`, `.log`, `.markdown`, `.md`, `.mht`, `.mhtml`, `.mime`, `.mjs`, `.nws`, `.pl`, `.py`, `.rst`, `.s`, `.sql`, `.srt`, `.text`, `.txt`, `.vcf`, `.vtt`, `.xml`) | `application/javascript`, `application/typescript`, `text/xml`, `text/x-shellscript`, `text/x-rst`, `text/x-makefile`, `text/x-lisp`, `text/x-asm`, `text/vbscript`, `text/css`, `message/rfc822`, `application/x-sql`, `application/x-scala`, `application/x-rust`, `application/x-powershell`, `text/x-diff`, `text/x-patch`, `application/x-patch`, `text/plain`, `text/markdown`, `text/x-java`, `text/x-script.python`, `text/x-python`, `text/x-c`, `text/x-c++`, `text/x-golang`, `text/html`, `text/x-php`, `application/x-php`, `application/x-httpd-php`, `application/x-httpd-php-source`, `text/x-ruby`, `text/x-sh`, `text/x-bash`, `application/x-bash`, `text/x-zsh`, `text/x-tex`, `text/x-csharp`, `application/json`, `text/x-typescript`, `text/javascript`, `text/x-go`, `text/x-rust`, `text/x-scala`, `text/x-kotlin`, `text/x-swift`, `text/x-lua`, `text/x-r`, `text/x-R`, `text/x-julia`, `text/x-perl`, `text/x-objectivec`, `text/x-objectivec++`, `text/x-erlang`, `text/x-elixir`, `text/x-haskell`, `text/x-clojure`, `text/x-groovy`, `text/x-dart`, `text/x-awk`, `application/x-awk`, `text/jsx`, `text/tsx`, `text/x-handlebars`, `text/x-mustache`, `text/x-ejs`, `text/x-jinja2`, `text/x-liquid`, `text/x-erb`, `text/x-twig`, `text/x-pug`, `text/x-jade`, `text/x-tmpl`, `text/x-cmake`, `text/x-dockerfile`, `text/x-gradle`, `text/x-ini`, `text/x-properties`, `text/x-protobuf`, `application/x-protobuf`, `text/x-sql`, `text/x-sass`, `text/x-scss`, `text/x-less`, `text/x-hcl`, `text/x-terraform`, `application/x-terraform`, `text/x-toml`, `application/x-toml`, `application/graphql`, `application/x-graphql`, `text/x-graphql`, `application/x-ndjson`, `application/json5`, `application/x-json5`, `text/x-yaml`, `application/toml`, `application/x-yaml`, `application/yaml`, `text/x-astro`, `text/srt`, `application/x-subrip`, `text/x-subrip`, `text/vtt`, `text/x-vcard`, `text/calendar` |

## 下一步

接下来，你可以探索以下资源：



  [在 Playground 中体验文件输入



        Use the Playground to develop and iterate on prompts with file inputs.](https://platform.openai.com/chat/edit)





  [完整的 API 参考



        查看 API 参考了解更多选项。](https://developers.openai.com/api/reference/resources/responses)





  [使用文件搜索处理大型语料



        Use retrieval over chunked files when you need scalable search instead of
      sending whole files in a single context window.](https://developers.openai.com/api/docs/guides/tools-file-search)





  [使用托管 Shell 进行深度电子表格分析



        Use Hosted Shell for advanced spreadsheet workflows such as joins,
      aggregations, and charting.](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart)