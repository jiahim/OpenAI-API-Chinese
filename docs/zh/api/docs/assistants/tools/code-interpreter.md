# Assistants Code Interpreter

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在 Responses API 实现功能对齐后，我们已弃用 Assistants API。它将于 2026 年 8 月 26 日关闭。请遵循 [迁移指南](https://developers.openai.com/platform/assistants/migration) 以更新你的集成。 [了解更多](https://platform.openai.com/docs/guides/migrate-to-responses).

## 概述

代码解释器允许助手在沙盒执行环境中编写和运行 Python 代码。该工具可以处理具有不同数据和格式的文件，并生成包含数据和图形图像的文件。代码解释器允许你的助手迭代运行代码，以解决具有挑战性的代码和数学问题。当你的助手编写的代码无法运行时，它可以尝试运行不同的代码来迭代此代码，直到代码执行成功。

查看如何开始使用代码解释器的快速入门 [此处](https://developers.openai.com/api/docs/assistants/migration#step-1-create-an-assistant?context=with-streaming).

## 工作原理

代码解释器按每次会话 $0.03 收费。如果你的助手在两个不同的线程中同时调用代码解释器（例如，每个终端用户一个线程），则会创建两个代码解释器会话。每个会话默认活跃一小时，这意味着如果用户在同一个线程中与代码解释器交互长达一小时，你只需为一个会话付费。

### 启用代码解释器

传递 `code_interpreter` 在 `tools` 参数中启用代码解释器：

```javascript
const assistant = await openai.beta.assistants.create({
  instructions:
    "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
  model: "gpt-4o",
  tools: [{ type: "code_interpreter" }],
});
```

```python
assistant = client.beta.assistants.create(
    instructions="You are a personal math tutor. When asked a math question, write and run code to answer the question.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
)
```

```go
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Instructions: openai.String("You are a personal math tutor. When asked a math question, write and run code to answer the question."),
	Model:        shared.ChatModelGPT4o,
	Tools:        []openai.AssistantToolUnionParam{{OfCodeInterpreter: &openai.CodeInterpreterToolParam{}}},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.AssistantCreateParams;
import com.openai.models.beta.assistants.CodeInterpreterTool;

var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .model("gpt-4o")
                .instructions(
                    "You are a personal math tutor. When asked a math question, write and run"
                        + " code to answer the question.")
                .addTool(CodeInterpreterTool.builder().build())
                .build());

System.out.println(assistant.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.create(
  model: "gpt-4o",
  tools: [{type: :code_interpreter}]
)
puts(assistant.id)
```

```bash
curl https://api.openai.com/v1/assistants \
  -u :$OPENAI_API_KEY \
  -H 'Content-Type: application/json' \
  -H 'OpenAI-Beta: assistants=v2' \
  -d '{
    "instructions": "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
    "tools": [
      { "type": "code_interpreter" }
    ],
    "model": "gpt-4o"
  }'
```


然后，模型会根据用户请求的性质，决定在运行中何时调用代码解释器。可以通过在助手的 `instructions` （例如，“编写代码来解决这个问题”）来促进这种行为。

### 将文件传递给代码解释器

在 Assistant 级别传递的文件可被该 Assistant 的所有 Run 访问：

```javascript
// Upload a file with an "assistants" purpose
const file = await openai.files.create({
  file: fs.createReadStream("mydata.csv"),
  purpose: "assistants",
});

// Create an assistant using the file ID
const assistant = await openai.beta.assistants.create({
  instructions:
    "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
  model: "gpt-4o",
  tools: [{ type: "code_interpreter" }],
  tool_resources: {
    code_interpreter: {
      file_ids: [file.id],
    },
  },
});
```

```python
# Upload a file with an "assistants" purpose
file = client.files.create(file=open("mydata.csv", "rb"), purpose="assistants")

# Create an assistant using the file ID
assistant = client.beta.assistants.create(
    instructions="You are a personal math tutor. When asked a math question, write and run code to answer the question.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
    tool_resources={"code_interpreter": {"file_ids": [file.id]}},
)
```

```go
input, err := os.Open("mydata.csv")
if err != nil {
	panic(err)
}
defer input.Close()
file, err := client.Files.New(context.Background(), openai.FileNewParams{
	File:    input,
	Purpose: openai.FilePurposeAssistants,
})
if err != nil {
	panic(err)
}
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Instructions: openai.String("You are a personal math tutor. When asked a math question, write and run code to answer the question."),
	Model:        shared.ChatModelGPT4o,
	Tools:        []openai.AssistantToolUnionParam{{OfCodeInterpreter: &openai.CodeInterpreterToolParam{}}},
	ToolResources: openai.BetaAssistantNewParamsToolResources{
		CodeInterpreter: openai.BetaAssistantNewParamsToolResourcesCodeInterpreter{FileIDs: []string{file.ID}},
	},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.AssistantCreateParams;
import com.openai.models.beta.assistants.CodeInterpreterTool;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import java.nio.file.Path;

var file =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.ASSISTANTS)
                .build());
var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .model("gpt-4o")
                .instructions("When asked a math question, write and run code to answer it.")
                .addTool(CodeInterpreterTool.builder().build())
                .toolResources(
                    AssistantCreateParams.ToolResources.builder()
                        .codeInterpreter(
                            AssistantCreateParams.ToolResources.CodeInterpreter.builder()
                                .addFileId(file.id())
                                .build())
                        .build())
                .build());
System.out.println(assistant.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = client.files.create(
  file: Pathname("revenue-forecast.csv"),
  purpose: :assistants
)
assistant = client.beta.assistants.create(
  model: "gpt-4o",
  instructions: "When asked a math question, write and run code to answer it.",
  tools: [{type: :code_interpreter}],
  tool_resources: {
    code_interpreter: {file_ids: [file.id]}
  }
)
puts(assistant.id)
```

```bash
# Upload a file with an "assistants" purpose
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="assistants" \
  -F file="@/path/to/mydata.csv"

# Create an assistant using the file ID
curl https://api.openai.com/v1/assistants \
  -u :$OPENAI_API_KEY \
  -H 'Content-Type: application/json' \
  -H 'OpenAI-Beta: assistants=v2' \
  -d '{
    "instructions": "You are a personal math tutor. When asked a math question, write and run code to answer the question.",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o",
    "tool_resources": {
      "code_interpreter": {
        "file_ids": ["file-BK7bzQj3FfZFXr7DbL6xJwfo"]
      }
    }
  }'
```


文件也可以在 Thread 级别传递。这些文件仅在特定 Thread 中可访问。使用 [文件上传](https://developers.openai.com/api/reference/resources/files/methods/create) 端点上传文件，然后在创建消息的请求中传递文件 ID：

```javascript
const thread = await openai.beta.threads.create({
  messages: [
    {
      role: "user",
      content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
      attachments: [
        {
          file_id: file.id,
          tools: [{ type: "code_interpreter" }],
        },
      ],
    },
  ],
});
```

```python
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
            "attachments": [
                {"file_id": file.id, "tools": [{"type": "code_interpreter"}]}
            ],
        }
    ]
)
```

```go
thread, err := client.Beta.Threads.New(context.Background(), openai.BetaThreadNewParams{
	Messages: []openai.BetaThreadNewParamsMessage{{
		Role:    "user",
		Content: openai.BetaThreadNewParamsMessageContentUnion{OfString: openai.String("I need to solve the equation `3x + 11 = 14`. Can you help me?")},
		Attachments: []openai.BetaThreadNewParamsMessageAttachment{{
			FileID: openai.String("file-ACq8OjcLQm2eIG0BvRM4z5qX"),
			Tools:  []openai.BetaThreadNewParamsMessageAttachmentToolUnion{{OfCodeInterpreter: &openai.CodeInterpreterToolParam{}}},
		}},
	}},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.CodeInterpreterTool;
import com.openai.models.beta.threads.ThreadCreateParams;

String fileId = "file-ACq8OjcLQm2eIG0BvRM4z5qX";

var thread =
    client
        .beta()
        .threads()
        .create(
            ThreadCreateParams.builder()
                .addMessage(
                    ThreadCreateParams.Message.builder()
                        .role(ThreadCreateParams.Message.Role.USER)
                        .content(
                            "I need to solve the equation `3x + 11 = 14`. Can you help me?")
                        .addAttachment(
                            ThreadCreateParams.Message.Attachment.builder()
                                .fileId(fileId)
                                .addTool(CodeInterpreterTool.builder().build())
                                .build())
                        .build())
                .build());

System.out.println(thread.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
thread = client.beta.threads.create(
  messages: [{
    role: :user,
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
    attachments: [{
      file_id: "file-ACq8OjcLQm2eIG0BvRM4z5qX",
      tools: [{type: :code_interpreter}]
    }]
  }]
)
puts(thread.id)
```

```bash
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -u :$OPENAI_API_KEY \
  -H 'Content-Type: application/json' \
  -H 'OpenAI-Beta: assistants=v2' \
  -d '{
    "role": "user",
    "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
    "attachments": [
      {
        "file_id": "file-ACq8OjcLQm2eIG0BvRM4z5qX",
        "tools": [{"type": "code_interpreter"}]
      }
    ]
  }'
```


文件的最大大小为 512 MB。代码解释器支持多种文件格式，包括 `.csv`, `.pdf`, `.json` 以及更多。有关支持的文件扩展名（及其对应的 MIME 类型）的更多详细信息，请参阅 [支持的文件](#supported-files) 部分如下。

### 读取 Code Interpreter 生成的图像和文件

API中的代码解释器还会输出文件，例如生成图像图表、CSV 和 PDF。生成的文件有两种类型：

1. 图片
2. 数据文件（例如由 `csv` Assistant 生成数据的文件）

当代码解释器生成图片时，你可以在 `file_id` 字段中查找并下载此文件，该字段位于助手消息响应中：

```json
{
	"id": "msg_abc123",
	"object": "thread.message",
	"created_at": 1698964262,
	"thread_id": "thread_abc123",
	"role": "assistant",
	"content": [
    {
      "type": "image_file",
      "image_file": {
        "file_id": "file-abc123"
      }
    }
  ]
  # ...
}
```

然后，可以通过将文件 ID 传递给文件 API 来下载文件内容：

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const response = await openai.files.content("file-abc123");

  // Extract the binary data from the Response object
  const image_data = await response.arrayBuffer();

  // Convert the binary data to a Buffer
  const image_data_buffer = Buffer.from(image_data);

  // Save the image to a specific location
  fs.writeFileSync("./my-image.png", image_data_buffer);
}

main();
```

```python
import os

from openai import OpenAI

file_id = os.environ["OPENAI_FILE_ID"]
client = OpenAI()

image_data = client.files.content(file_id)
image_data_bytes = image_data.read()

with open("./my-image.png", "wb") as file:
    file.write(image_data_bytes)
```

```go
response, err := client.Files.Content(context.Background(), "file-abc123")
if err != nil {
	panic(err)
}
defer response.Body.Close()
output, err := os.Create("./my-image.png")
if err != nil {
	panic(err)
}
if _, err := io.Copy(output, response.Body); err != nil {
	output.Close()
	panic(err)
}
if err := output.Close(); err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

String fileId = "file-abc123";

try (HttpResponse content = client.files().content(fileId)) {
  Files.copy(content.body(), Path.of("my-image.png"), StandardCopyOption.REPLACE_EXISTING);
}
```

```ruby
require "openai"

client = OpenAI::Client.new
image = client.files.content("file-abc123")
File.binwrite("my-image.png", image.read)
```

```bash
curl https://api.openai.com/v1/files/file-abc123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output image.png
```


当代码解释器引用文件路径（例如，“下载此 csv 文件”）时，文件路径会列为注释。你可以将这些注释转换为下载文件的链接：

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699073585,
  "thread_id": "thread_abc123",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "The rows of the CSV file have been shuffled and saved to a new CSV file. You can download the shuffled CSV file from the following link:\\n\\n[Download Shuffled CSV File](sandbox:/mnt/data/shuffled_file.csv)",
        "annotations": [
          {
            "type": "file_path",
            "text": "sandbox:/mnt/data/shuffled_file.csv",
            "start_index": 167,
            "end_index": 202,
            "file_path": {
              "file_id": "file-abc123"
            }
          }
          ...
```

### 代码解释器的输入和输出日志

通过列出调用 Code Interpreter 的 Run 步骤，你可以检查代码 `input` 以及 `outputs` Code Interpreter 的日志：

```javascript
const runSteps = await openai.beta.threads.runs.steps.list(run.id, {
  thread_id: thread.id,
});
```

```python
import os

thread_id = os.environ["OPENAI_THREAD_ID"]
run_id = os.environ["OPENAI_RUN_ID"]

run_steps = client.beta.threads.runs.steps.list(
    thread_id=thread_id,
    run_id=run_id,
)
```

```go
runSteps, err := client.Beta.Threads.Runs.Steps.List(context.Background(), "thread_abc123", "run_abc123", openai.BetaThreadRunStepListParams{})
if err != nil {
	panic(err)
}
fmt.Println(runSteps.Data)
```

```ruby
require "openai"

client = OpenAI::Client.new
steps = client.beta.threads.runs.steps.list(
  "run_abc123",
  thread_id: "thread_abc123"
)
puts(steps.data)
```

```bash
curl https://api.openai.com/v1/threads/thread_abc123/runs/RUN_ID/steps \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
```


```bash
{
  "object": "list",
  "data": [
    {
      "id": "step_abc123",
      "object": "thread.run.step",
      "type": "tool_calls",
      "run_id": "run_abc123",
      "thread_id": "thread_abc123",
      "status": "completed",
      "step_details": {
        "type": "tool_calls",
        "tool_calls": [
          {
            "type": "code",
            "code": {
              "input": "# Calculating 2 + 2\\nresult = 2 + 2\\nresult",
              "outputs": [
                {
                  "type": "logs",
                  "logs": "4"
                }
						...
 }
```

## 支持的文件

| 文件格式 | MIME 类型                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| `.c`        | `text/x-c`                                                                  |
| `.cs`       | `text/x-csharp`                                                             |
| `.cpp`      | `text/x-c++`                                                                |
| `.csv`      | `text/csv`                                                                  |
| `.doc`      | `application/msword`                                                        |
| `.docx`     | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`   |
| `.html`     | `text/html`                                                                 |
| `.java`     | `text/x-java`                                                               |
| `.json`     | `application/json`                                                          |
| `.md`       | `text/markdown`                                                             |
| `.pdf`      | `application/pdf`                                                           |
| `.php`      | `text/x-php`                                                                |
| `.pptx`     | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.py`       | `text/x-python`                                                             |
| `.py`       | `text/x-script.python`                                                      |
| `.rb`       | `text/x-ruby`                                                               |
| `.tex`      | `text/x-tex`                                                                |
| `.txt`      | `text/plain`                                                                |
| `.css`      | `text/css`                                                                  |
| `.js`       | `text/javascript`                                                           |
| `.sh`       | `application/x-sh`                                                          |
| `.ts`       | `application/typescript`                                                    |
| `.csv`      | `application/csv`                                                           |
| `.jpeg`     | `image/jpeg`                                                                |
| `.jpg`      | `image/jpeg`                                                                |
| `.gif`      | `image/gif`                                                                 |
| `.pkl`      | `application/octet-stream`                                                  |
| `.png`      | `image/png`                                                                 |
| `.tar`      | `application/x-tar`                                                         |
| `.xlsx`     | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`         |
| `.xml`      | `application/xml or "text/xml"`                                             |
| `.zip`      | `application/zip`                                                           |