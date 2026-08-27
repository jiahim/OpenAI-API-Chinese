# 文件输入

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

OpenAI 模型可以接受文件作为 `input_file` 输入项。在 Responses API 中，你可以发送 Base64 编码的数据、Files API 返回的文件 ID（`/v1/files`），或外部 URL。

## 工作原理

`input_file` 处理方式取决于文件类型：

- **PDF 文件**：在具备视觉能力的模型上，例如 `gpt-4o` 及更高版本模型，API 会提取文本和页面图像，并将两者发送给模型。
- **非 PDF 文档和文本文件** （例如， `.docx`, `.pptx`, `.txt`，以及代码文件）：API 仅提取文本。
- **电子表格文件** （例如， `.xlsx`, `.csv`, `.tsv`）：API 会运行一个针对电子表格的增强流程（如下所述）。

当以下相关工具更符合你的任务时，请使用它们：

- 使用 [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search) 对大型文件进行检索，而不要直接将它们作为 `input_file`.
- 使用 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 处理需要详细分析的电子表格密集型任务，例如聚合、连接、图表制作或自定义计算。

## 非 PDF 图像和图表的限制

对于非 PDF 文件，API 不会将嵌入的图片或图表提取到
模型上下文中。

为了保持图表和图表保真度，请先将文件转换为 PDF，然后
将 PDF 作为 `input_file`.

## 电子表格增强的工作方式

对于类似电子表格的文件（例如 `.xlsx`, `.xls`, `.csv`, `.tsv`，以及
`.iif`), `input_file` 使用电子表格特定的增强流程。

API 不会将整个工作表传递给模型，而是解析每个工作表的前
1,000 行，并添加模型生成的摘要和表头元数据，这样
模型就可以从更小、更结构化的数据视图中进行工作。

## PDF 细节级别

对于 Responses API 中的 PDF 输入，设置可选 `detail` 字段在
`input_file` 项上 `auto`, `low`，或 `high` 来控制 API 如何处理
页面图像。如果省略， `detail` 默认为 `auto`。对于 GPT-5.6 及更晚版本
模型， `auto` 使用 `high`；对于更早的模型，它使用 `low`。使用 `low` 以减少
输入令牌，或 `high` 用于更多视觉细节，如密集图表、小字，
或图示。

该 `detail` 设置仅影响 PDF 页面图像处理。从
PDF 中提取的文本仍会包含在内。Chat Completions 文件输入不支持 `detail`.

一个显式高细节的最小 Responses API 请求体如下所示：

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

下表列出了 `input_file`。接受的常见文件类型。完整
的扩展名和 MIME 类型列表请参见本页稍后内容。

| 类别       | 常见扩展名                                   |
| -------------- | --------------------------------------------------- |
| PDF 文件      | `.pdf`                                              |
| 文本和代码  | `.txt`, `.md`, `.json`, `.html`, `.xml`、代码文件 |
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
    "gpt-5.6",
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
  model: "gpt-5.6",
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
        "model": "gpt-5.6",
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

以下示例通过 [Files API](https://developers.openai.com/api/reference/resources/files)，上传一个文件，然后其文件 ID 在向模型的请求中被引用。



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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
                .model("gpt-5.6")
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
    "gpt-5.6",
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
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: [
        {type: "input_file", file_id: file.id},
        {type: "input_text", text: "What is the first dragon in the book?"}
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
        "model": "gpt-5.6",
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






## Base64 编码的文件

你还可以将文件输入作为 Base64 编码的文件数据发送。



发送 Base64 编码的文件

```javascript
import fs from "fs";
import OpenAI from "openai";
const client = new OpenAI();

const data = fs.readFileSync("fixtures/draconomicon.pdf");
const base64String = data.toString("base64");

const response = await client.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
pdf_data = Base64.strict_encode64(File.binread("draconomicon.pdf"))
response = client.responses.create(
  model: "gpt-5.6",
  input: [{
    role: :user,
    content: [
      {
        type: :input_file,
        filename: "document.pdf",
        file_data: "data:application/pdf;base64,#{pdf_data}"
      },
      {type: :input_text, text: "Summarize this document."}
    ]
  }]
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
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

使用文件输入时，请记住以下约束条件：

- **Token 用量：** PDF 解析会将提取的文本和页面图像都包含在上下文中，这可能会增加 token 用量。在 Responses API 中，设置 `detail` 为 `auto` （默认值）， `low`，或 `high` 来控制 PDF 页面图像的视觉细节量。在大规模部署之前，请查看定价和 token 影响。 [更多定价信息](https://developers.openai.com/api/docs/pricing).
- **文件大小限制：** 单个请求可以包含多个文件，但每个文件必须小于 50 MB。请求中所有文件的合计限制为 50 MB。
- **支持的模型：** 包含文本和页面图像的 PDF 解析需要具备视觉能力的模型，例如 `gpt-4o` 及更高版本的模型。
- **文件上传目的：** 你可以使用任何受支持的 [目的](https://developers.openai.com/api/reference/resources/files/methods/create#files-create-purpose)，上传文件，但请使用 `user_data` 来上传你计划作为模型输入的文件。

## 支持的文件类型完整列表

| 类别       | 扩展名                                                                                                                                                                                                                                                                                                                                                 | MIME 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PDF 文件      | PDF 文件（`.pdf`)                                                                                                                                                                                                                                                                                                                                         | `application/pdf`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 电子表格   | Excel 工作表（`.xla`, `.xlb`, `.xlc`, `.xlm`, `.xls`, `.xlsx`, `.xlt`, `.xlw`)                                                                                                                                                                                                                                                                             | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 电子表格   | CSV / TSV / IIF（`.csv`, `.tsv`, `.iif`）、Google Sheets                                                                                                                                                                                                                                                                                                    | `text/csv`, `application/csv`, `text/tsv`, `text/x-iif`, `application/x-iif`, `application/vnd.google-apps.spreadsheet`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 富文档 | Word/ODT/RTF 文档（`.doc`, `.docx`, `.dot`, `.odt`, `.rtf`）、Pages、Google Docs                                                                                                                                                                                                                                                                            | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`, `application/rtf`, `text/rtf`, `application/vnd.oasis.opendocument.text`, `application/vnd.apple.pages`, `application/vnd.google-apps.document`, `application/vnd.apple.iwork`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 演示文稿  | PowerPoint 幻灯片（`.pot`, `.ppa`, `.pps`, `.ppt`, `.pptx`, `.pwz`, `.wiz`）、Keynote、Google Slides                                                                                                                                                                                                                                                        | `application/vnd.openxmlformats-officedocument.presentationml.presentation`, `application/vnd.ms-powerpoint`, `application/vnd.apple.keynote`, `application/vnd.google-apps.presentation`, `application/vnd.apple.iwork`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 文本和代码  | 文本/代码格式（`.asm`, `.bat`, `.c`, `.cc`, `.conf`, `.cpp`, `.css`, `.cxx`, `.def`, `.dic`, `.eml`, `.h`, `.hh`, `.htm`, `.html`, `.ics`, `.ifb`, `.in`, `.js`, `.json`, `.ksh`, `.list`, `.log`, `.markdown`, `.md`, `.mht`, `.mhtml`, `.mime`, `.mjs`, `.nws`, `.pl`, `.py`, `.rst`, `.s`, `.sql`, `.srt`, `.text`, `.txt`, `.vcf`, `.vtt`, `.xml`) | `application/javascript`, `application/typescript`, `text/xml`, `text/x-shellscript`, `text/x-rst`, `text/x-makefile`, `text/x-lisp`, `text/x-asm`, `text/vbscript`, `text/css`, `message/rfc822`, `application/x-sql`, `application/x-scala`, `application/x-rust`, `application/x-powershell`, `text/x-diff`, `text/x-patch`, `application/x-patch`, `text/plain`, `text/markdown`, `text/x-java`, `text/x-script.python`, `text/x-python`, `text/x-c`, `text/x-c++`, `text/x-golang`, `text/html`, `text/x-php`, `application/x-php`, `application/x-httpd-php`, `application/x-httpd-php-source`, `text/x-ruby`, `text/x-sh`, `text/x-bash`, `application/x-bash`, `text/x-zsh`, `text/x-tex`, `text/x-csharp`, `application/json`, `text/x-typescript`, `text/javascript`, `text/x-go`, `text/x-rust`, `text/x-scala`, `text/x-kotlin`, `text/x-swift`, `text/x-lua`, `text/x-r`, `text/x-R`, `text/x-julia`, `text/x-perl`, `text/x-objectivec`, `text/x-objectivec++`, `text/x-erlang`, `text/x-elixir`, `text/x-haskell`, `text/x-clojure`, `text/x-groovy`, `text/x-dart`, `text/x-awk`, `application/x-awk`, `text/jsx`, `text/tsx`, `text/x-handlebars`, `text/x-mustache`, `text/x-ejs`, `text/x-jinja2`, `text/x-liquid`, `text/x-erb`, `text/x-twig`, `text/x-pug`, `text/x-jade`, `text/x-tmpl`, `text/x-cmake`, `text/x-dockerfile`, `text/x-gradle`, `text/x-ini`, `text/x-properties`, `text/x-protobuf`, `application/x-protobuf`, `text/x-sql`, `text/x-sass`, `text/x-scss`, `text/x-less`, `text/x-hcl`, `text/x-terraform`, `application/x-terraform`, `text/x-toml`, `application/x-toml`, `application/graphql`, `application/x-graphql`, `text/x-graphql`, `application/x-ndjson`, `application/json5`, `application/x-json5`, `text/x-yaml`, `application/toml`, `application/x-yaml`, `application/yaml`, `text/x-astro`, `text/srt`, `application/x-subrip`, `text/x-subrip`, `text/vtt`, `text/x-vcard`, `text/calendar` |

## 后续步骤

接下来，你可能想探索以下资源：



  [在 Playground 中试验文件输入



        Use the Playground to develop and iterate on prompts with file inputs.](https://platform.openai.com/chat/edit)





  [完整的 API 参考



        查看 API 参考以获取更多选项。](https://developers.openai.com/api/reference/resources/responses)





  [使用文件搜索处理大型语料库



        Use retrieval over chunked files when you need scalable search instead of
      sending whole files in a single context window.](https://developers.openai.com/api/docs/guides/tools-file-search)





  [使用托管 Shell 进行深入电子表格分析



        Use Hosted Shell for advanced spreadsheet workflows such as joins,
      aggregations, and charting.](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart)