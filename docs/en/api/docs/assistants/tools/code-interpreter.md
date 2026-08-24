# Assistants Code Interpreter

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).

## Overview

Code Interpreter allows Assistants to write and run Python code in a sandboxed execution environment. This tool can process files with diverse data and formatting, and generate files with data and images of graphs. Code Interpreter allows your Assistant to run code iteratively to solve challenging code and math problems. When your Assistant writes code that fails to run, it can iterate on this code by attempting to run different code until the code execution succeeds.

See a quickstart of how to get started with Code Interpreter [here](https://developers.openai.com/api/docs/assistants/migration#step-1-create-an-assistant?context=with-streaming).

## How it works

Code Interpreter is charged at $0.03 per session. If your Assistant calls Code Interpreter simultaneously in two different threads (e.g., one thread per end-user), two Code Interpreter sessions are created. Each session is active by default for one hour, which means that you only pay for one session per if users interact with Code Interpreter in the same thread for up to one hour.

### Enabling Code Interpreter

Pass `code_interpreter` in the `tools` parameter of the Assistant object to enable Code Interpreter:

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


The model then decides when to invoke Code Interpreter in a Run based on the nature of the user request. This behavior can be promoted by prompting in the Assistant's `instructions` (e.g., “write code to solve this problem”).

### Passing files to Code Interpreter

Files that are passed at the Assistant level are accessible by all Runs with this Assistant:

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


Files can also be passed at the Thread level. These files are only accessible in the specific Thread. Upload the File using the [File upload](https://developers.openai.com/api/reference/resources/files/methods/create) endpoint and then pass the File ID as part of the Message creation request:

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


Files have a maximum size of 512 MB. Code Interpreter supports a variety of file formats including `.csv`, `.pdf`, `.json` and many more. More details on the file extensions (and their corresponding MIME-types) supported can be found in the [Supported files](#supported-files) section below.

### Reading images and files generated by Code Interpreter

Code Interpreter in the API also outputs files, such as generating image diagrams, CSVs, and PDFs. There are two types of files that are generated:

1. Images
2. Data files (e.g. a `csv` file with data generated by the Assistant)

When Code Interpreter generates an image, you can look up and download this file in the `file_id` field of the Assistant Message response:

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

The file content can then be downloaded by passing the file ID to the Files API:

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


When Code Interpreter references a file path (e.g., ”Download this csv file”), file paths are listed as annotations. You can convert these annotations into links to download the file:

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

### Input and output logs of Code Interpreter

By listing the steps of a Run that called Code Interpreter, you can inspect the code `input` and `outputs` logs of Code Interpreter:

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

## Supported files

| File format | MIME type                                                                   |
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