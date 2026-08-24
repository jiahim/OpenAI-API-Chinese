# Assistants API deep dive

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).

## Overview

Don't start a new integration on the Assistants API. We've announced plans to deprecate it soon, as the Responses API now provides the same features and a more elegant integration.

There are several concepts involved in building an app with the Assistants API, covered below in case it helps with your [migration to Responses](https://developers.openai.com/api/docs/assistants/migration).

## Creating assistants

We recommend using OpenAI's [latest models](https://developers.openai.com/api/docs/models) with
  the Assistants API for best results and maximum compatibility with tools.

To get started, creating an Assistant only requires specifying the `model` to use. But you can further customize the behavior of the Assistant:

1. Use the `instructions` parameter to guide the personality of the Assistant and define its goals. Instructions are similar to system messages in the Chat Completions API.
2. Use the `tools` parameter to give the Assistant access to up to 128 tools. You can give it access to OpenAI built-in tools like `code_interpreter` and `file_search`, or call a third-party tools via a `function` calling.
3. Use the `tool_resources` parameter to give the tools like `code_interpreter` and `file_search` access to files. Files are uploaded using the `File` [upload endpoint](https://developers.openai.com/api/reference/resources/files/methods/create) and must have the `purpose` set to `assistants` to be used with this API.

For example, to create an Assistant that can create data visualization based on a `.csv` file, first upload a file.

```javascript
const file = await openai.files.create({
  file: fs.createReadStream("revenue-forecast.csv"),
  purpose: "assistants",
});
```

```python
file = client.files.create(
    file=open("revenue-forecast.csv", "rb"), purpose="assistants"
)
```

```go
input, err := os.Open("revenue-forecast.csv")
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
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = Pathname("revenue-forecast.csv")
uploaded = client.files.create(file: file, purpose: :assistants)
puts(uploaded.id)
```

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="assistants" \
  -F file="@revenue-forecast.csv"
```


Then, create the Assistant with the `code_interpreter` tool enabled and provide the file as a resource to the tool.

```javascript
const assistant = await openai.beta.assistants.create({
  name: "Data visualizer",
  description:
    "You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
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
assistant = client.beta.assistants.create(
    name="Data visualizer",
    description="You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
    tool_resources={"code_interpreter": {"file_ids": [file.id]}},
)
```

```go
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Name:        openai.String("Data visualizer"),
	Description: openai.String("You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed."),
	Model:       shared.ChatModelGPT4o,
	Tools:       []openai.AssistantToolUnionParam{{OfCodeInterpreter: &openai.CodeInterpreterToolParam{}}},
	ToolResources: openai.BetaAssistantNewParamsToolResources{
		CodeInterpreter: openai.BetaAssistantNewParamsToolResourcesCodeInterpreter{FileIDs: []string{"file-BK7bzQj3FfZFXr7DbL6xJwfo"}},
	},
})
if err != nil {
	panic(err)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.create(
  name: "Data visualizer",
  model: "gpt-4o",
  instructions: "Analyze CSV data, create relevant visualizations, and summarize the trends.",
  tools: [{type: :code_interpreter}],
  tool_resources: {
    code_interpreter: {file_ids: ["file-BK7bzQj3FfZFXr7DbL6xJwfo"]}
  }
)
puts(assistant.id)
```

```bash
curl https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "name": "Data visualizer",
    "description": "You are great at creating beautiful data visualizations. You analyze data present in .csv files, understand trends, and come up with data visualizations relevant to those trends. You also share a brief text summary of the trends observed.",
    "model": "gpt-4o",
    "tools": [{"type": "code_interpreter"}],
    "tool_resources": {
      "code_interpreter": {
        "file_ids": ["file-BK7bzQj3FfZFXr7DbL6xJwfo"]
      }
    }
  }'
```


You can attach a maximum of 20 files to `code_interpreter` and 10,000 files to `file_search` (using `vector_store` [objects](https://developers.openai.com/api/reference/resources/vector_stores)). For vector stores created starting in November 2025, the `file_search` limit is 100,000,000 files.

Each file can be at most 512 MB in size and have a maximum of 5,000,000 tokens. By default, each project can store up to 2.5 TB of files total. There is no organization-wide storage limit. You can reach out to our support team to increase this limit.

## Managing Threads and Messages

Threads and Messages represent a conversation session between an Assistant and a user. There is a limit of 100,000 Messages per Thread. Once the size of the Messages exceeds the context window of the model, the Thread will attempt to smartly truncate messages, before fully dropping the ones it considers the least important.

You can create a Thread with an initial list of Messages like this:

```javascript
const thread = await openai.beta.threads.create({
  messages: [
    {
      role: "user",
      content: "Create 3 data visualizations based on the trends in this file.",
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
            "content": "Create 3 data visualizations based on the trends in this file.",
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
		Role: "user",
		Content: openai.BetaThreadNewParamsMessageContentUnion{
			OfString: openai.String("Create 3 data visualizations based on the trends in this file."),
		},
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

```ruby
require "openai"

client = OpenAI::Client.new
thread = client.beta.threads.create(
  messages: [{
    role: :user,
    content: "Create 3 data visualizations based on the trends in this file.",
    attachments: [{
      file_id: "file-ACq8OjcLQm2eIG0BvRM4z5qX",
      tools: [{type: :code_interpreter}]
    }]
  }]
)
puts(thread.id)
```

```bash
curl https://api.openai.com/v1/threads \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Create 3 data visualizations based on the trends in this file.",
        "attachments": [
          {
            "file_id": "file-ACq8OjcLQm2eIG0BvRM4z5qX",
            "tools": [{"type": "code_interpreter"}]
          }
        ]
      }
    ]
  }'
```


Messages can contain text, images, or file attachment. Message `attachments` are helper methods that add files to a thread's `tool_resources`. You can also choose to add files to the `thread.tool_resources` directly.

### Creating image input content

Message content can contain either external image URLs or File IDs uploaded via the [File API](https://developers.openai.com/api/reference/resources/files/methods/create). Only [models](https://developers.openai.com/api/docs/models) with Vision support can accept image input. Supported image content types include png, jpg, gif, and webp. When creating image files, pass `purpose="vision"` to allow you to later download and display the input content. Projects are limited to 2.5 TB total file storage, and there is no organization-wide storage limit. Please contact us to request a limit increase.

Tools cannot access image content unless specified. To pass image files to Code Interpreter, add the file ID in the message `attachments` list to allow the tool to read and analyze the input. Image URLs cannot be downloaded in Code Interpreter today.

```javascript
import fs from "fs";

const file = await openai.files.create({
  file: fs.createReadStream("myimage.png"),
  purpose: "vision",
});
const thread = await openai.beta.threads.create({
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "What is the difference between these images?",
        },
        {
          type: "image_url",
          image_url: {
            url: "https://openai-documentation.vercel.app/images/cat_and_otter.png",
          },
        },
        {
          type: "image_file",
          image_file: { file_id: file.id },
        },
      ],
    },
  ],
});
```

```python
file = client.files.create(file=open("myimage.png", "rb"), purpose="vision")
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What is the difference between these images?",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://openai-documentation.vercel.app/images/cat_and_otter.png"
                    },
                },
                {"type": "image_file", "image_file": {"file_id": file.id}},
            ],
        }
    ]
)
```

```go
image, err := os.Open("myimage.png")
if err != nil {
	panic(err)
}
defer image.Close()
file, err := client.Files.New(context.Background(), openai.FileNewParams{
	File:    image,
	Purpose: openai.FilePurposeVision,
})
if err != nil {
	panic(err)
}
thread, err := client.Beta.Threads.New(context.Background(), openai.BetaThreadNewParams{
	Messages: []openai.BetaThreadNewParamsMessage{{
		Role: "user",
		Content: openai.BetaThreadNewParamsMessageContentUnion{OfArrayOfContentParts: []openai.MessageContentPartParamUnion{
			openai.MessageContentPartParamOfText("What is the difference between these images?"),
			openai.MessageContentPartParamOfImageURL(openai.ImageURLParam{URL: "https://openai-documentation.vercel.app/images/cat_and_otter.png"}),
			openai.MessageContentPartParamOfImageFile(openai.ImageFileParam{FileID: file.ID}),
		}},
	}},
})
if err != nil {
	panic(err)
}
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = client.files.create(
  file: Pathname("myimage.png"),
  purpose: :vision
)
thread = client.beta.threads.create(
  messages: [{
    role: :user,
    content: [
      {type: :text, text: "What is the difference between these images?"},
      {
        type: :image_url,
        image_url: {url: "https://openai-documentation.vercel.app/images/cat_and_otter.png"}
      },
      {type: :image_file, image_file: {file_id: file.id}}
    ]
  }]
)
puts(thread.id)
```

```bash
# Upload a file with an "vision" purpose
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="vision" \
  -F file="@/path/to/myimage.png"

## Pass the file ID in the content

curl https://api.openai.com/v1/threads \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-H "OpenAI-Beta: assistants=v2" \
-d '{
"messages": [
{
"role": "user",
"content": [
{
"type": "text",
"text": "What is the difference between these images?"
},
{
"type": "image_url",
"image_url": {"url": "https://openai-documentation.vercel.app/images/cat_and_otter.png"}
},
{
"type": "image_file",
"image_file": {"file_id": file.id}
}
]
}
]
}'
```


#### Low or high fidelity image understanding

By controlling the `detail` parameter, which has three options, `low`, `high`, or `auto`, you have control over how the model processes the image and generates its textual understanding.

- `low` will enable the "low res" mode. The model will receive a low-res 512px x 512px version of the image, and represent the image with a budget of 85 tokens. This allows the API to return faster responses and consume fewer input tokens for use cases that do not require high detail.
- `high` will enable "high res" mode, which first allows the model to see the low res image and then creates detailed crops of input images based on the input image size. Use the [pricing calculator](https://openai.com/api/pricing/) to see token counts for various image sizes.

```javascript
const thread = await openai.beta.threads.create({
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "What is this an image of?",
        },
        {
          type: "image_url",
          image_url: {
            url: "https://openai-documentation.vercel.app/images/cat_and_otter.png",
            detail: "high",
          },
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
            "content": [
                {"type": "text", "text": "What is this an image of?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://openai-documentation.vercel.app/images/cat_and_otter.png",
                        "detail": "high",
                    },
                },
            ],
        }
    ]
)
```

```go
thread, err := client.Beta.Threads.New(context.Background(), openai.BetaThreadNewParams{
	Messages: []openai.BetaThreadNewParamsMessage{{
		Role: "user",
		Content: openai.BetaThreadNewParamsMessageContentUnion{OfArrayOfContentParts: []openai.MessageContentPartParamUnion{
			openai.MessageContentPartParamOfText("What is this an image of?"),
			openai.MessageContentPartParamOfImageURL(openai.ImageURLParam{
				URL:    "https://openai-documentation.vercel.app/images/cat_and_otter.png",
				Detail: openai.ImageURLDetailHigh,
			}),
		}},
	}},
})
if err != nil {
	panic(err)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
thread = client.beta.threads.create(
  messages: [{
    role: :user,
    content: [
      {type: :text, text: "What is this an image of?"},
      {
        type: :image_url,
        image_url: {
          url: "https://openai-documentation.vercel.app/images/cat_and_otter.png",
          detail: :high
        }
      }
    ]
  }]
)
puts(thread.id)
```

```bash
curl https://api.openai.com/v1/threads \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is this an image of?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://openai-documentation.vercel.app/images/cat_and_otter.png",
              "detail": "high"
            }
          },
        ]
      }
    ]
  }'
```


### Context window management

The Assistants API automatically manages the truncation to ensure it stays within the model's maximum context length. You can customize this behavior by specifying the maximum tokens you'd like a run to utilize and/or the maximum number of recent messages you'd like to include in a run.

#### Max Completion and Max Prompt Tokens

To control the token usage in a single Run, set `max_prompt_tokens` and `max_completion_tokens` when creating the Run. These limits apply to the total number of tokens used in all completions throughout the Run's lifecycle.

For example, initiating a Run with `max_prompt_tokens` set to 500 and `max_completion_tokens` set to 1000 means the first completion will truncate the thread to 500 tokens and cap the output at 1000 tokens. If only 200 prompt tokens and 300 completion tokens are used in the first completion, the second completion will have available limits of 300 prompt tokens and 700 completion tokens.

If a completion reaches the `max_completion_tokens` limit, the Run will terminate with a status of `incomplete`, and details will be provided in the `incomplete_details` field of the Run object.

When using the File Search tool, we recommend setting the max_prompt_tokens to
  no less than 20,000. For longer conversations or multiple interactions with
  File Search, consider increasing this limit to 50,000, or ideally, removing
  the max_prompt_tokens limits altogether to get the highest quality results.

#### Truncation Strategy

You may also specify a truncation strategy to control how your thread should be rendered into the model's context window.
Using a truncation strategy of type `auto` will use OpenAI's default truncation strategy. Using a truncation strategy of type `last_messages` will allow you to specify the number of the most recent messages to include in the context window.

### Message annotations

Messages created by Assistants may contain [`annotations`](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages#messages/object-content) within the `content` array of the object. Annotations provide information around how you should annotate the text in the Message.

There are two types of Annotations:

1. `file_citation`: File citations are created by the [`file_search`](https://developers.openai.com/api/docs/assistants/tools/file-search) tool and define references to a specific file that was uploaded and used by the Assistant to generate the response.
2. `file_path`: File path annotations are created by the [`code_interpreter`](https://developers.openai.com/api/docs/assistants/tools/code-interpreter) tool and contain references to the files generated by the tool.

When annotations are present in the Message object, you'll see illegible model-generated substrings in the text that you should replace with the annotations. These strings may look something like `【13†source】` or `sandbox:/mnt/data/file.csv`. Here’s an example python code snippet that replaces these strings with the annotations.

```python
import os
from pathlib import Path

thread_id = os.environ["OPENAI_THREAD_ID"]
message_id = os.environ["OPENAI_MESSAGE_ID"]
downloads = Path("downloads")
downloads.mkdir(exist_ok=True)

# Retrieve the message object
message = client.beta.threads.messages.retrieve(
    thread_id=thread_id,
    message_id=message_id,
)

# Extract the message content

message_content = message.content[0].text
annotations = message_content.annotations
citations = []

# Iterate over the annotations and add footnotes

for index, annotation in enumerate(annotations):
    # Replace the text with a footnote.
    message_content.value = message_content.value.replace(
        annotation.text, f" [{index}]"
    )

    # Gather citations based on annotation attributes
    if file_citation := getattr(annotation, "file_citation", None):
        cited_file = client.files.retrieve(file_citation.file_id)
        citations.append(f"[{index}] {file_citation.quote} from {cited_file.filename}")
    elif file_path := getattr(annotation, "file_path", None):
        cited_file = client.files.retrieve(file_path.file_id)
        file_content = client.files.content(file_path.file_id)
        output_path = downloads / Path(cited_file.filename).name
        output_path.write_bytes(file_content.read())
        citations.append(f"[{index}] Downloaded {output_path}")

# Add footnotes to the end of the message before displaying to user

message_content.value += "\n" + "\n".join(citations)
```

```go
message, err := client.Beta.Threads.Messages.Get(context.Background(), "thread_abc123", "msg_abc123")
if err != nil {
	panic(err)
}
if len(message.Content) == 0 || message.Content[0].Type != "text" {
	panic("message does not contain text")
}
messageContent := message.Content[0].AsText().Text
citations := make([]string, 0, len(messageContent.Annotations))
for index, annotation := range messageContent.Annotations {
	messageContent.Value = strings.ReplaceAll(messageContent.Value, annotation.Text, fmt.Sprintf(" [%d]", index))
	switch annotation.Type {
	case "file_citation":
		citation := annotation.AsFileCitation()
		file, err := client.Files.Get(context.Background(), citation.FileCitation.FileID)
		if err != nil {
			panic(err)
		}
		citations = append(citations, fmt.Sprintf("[%d] %s", index, file.Filename))
	case "file_path":
		filePath := annotation.AsFilePath()
		file, err := client.Files.Get(context.Background(), filePath.FilePath.FileID)
		if err != nil {
			panic(err)
		}
		response, err := client.Files.Content(context.Background(), filePath.FilePath.FileID)
		if err != nil {
			panic(err)
		}
		defer response.Body.Close()
		if err := os.MkdirAll("downloads", 0o755); err != nil {
			panic(err)
		}
		outputPath := filepath.Join("downloads", filepath.Base(file.Filename))
		output, err := os.Create(outputPath)
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
		citations = append(citations, fmt.Sprintf("[%d] Downloaded %s", index, outputPath))
	}
}
messageContent.Value += "\n" + strings.Join(citations, "\n")
fmt.Println(messageContent.Value)
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
message = client.beta.threads.messages.retrieve(
  "msg_abc123",
  thread_id: "thread_abc123"
)
text_block = message.content.find do |content|
  content.is_a?(OpenAI::Models::Beta::Threads::TextContentBlock)
end
unless text_block.is_a?(OpenAI::Models::Beta::Threads::TextContentBlock)
  raise "No text content returned"
end
text = text_block.text
downloads = Pathname("downloads")
references = text.annotations.each_with_index.filter_map do |annotation, index|
  text.value = text.value.sub(annotation.text, " [#{index}]")

  case annotation
  when OpenAI::Models::Beta::Threads::FileCitationAnnotation
    file = client.files.retrieve(annotation.file_citation.file_id)
    "[#{index}] #{file.filename}"
  when OpenAI::Models::Beta::Threads::FilePathAnnotation
    file_id = annotation.file_path.file_id
    file = client.files.retrieve(file_id)
    downloads.mkpath
    output_path = downloads.join(Pathname(file.filename).basename)
    output_path.binwrite(client.files.content(file_id).read)
    "[#{index}] Downloaded #{output_path}"
  end
end

puts(([text.value] + references).join("\n"))
```


## Runs and Run Steps

When you have all the context you need from your user in the Thread, you can run the Thread with an Assistant of your choice.

```javascript
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
});
```

```python
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
)
```

```go
_, err := client.Beta.Threads.Runs.New(context.Background(), "thread_abc123", openai.BetaThreadRunNewParams{
	AssistantID: "asst_ToSF7Gb04YMj8AMMm50ZLLtY",
})
if err != nil {
	panic(err)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
run = client.beta.threads.runs.create("thread_abc123", assistant_id: "asst_ToSF7Gb04YMj8AMMm50ZLLtY")
puts(run.id)
```

```bash
curl https://api.openai.com/v1/threads/THREAD_ID/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_ToSF7Gb04YMj8AMMm50ZLLtY"
  }'
```


By default, a Run will use the `model` and `tools` configuration specified in Assistant object, but you can override most of these when creating the Run for added flexibility:

```javascript
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
  model: "gpt-4o",
  instructions: "New instructions that override the Assistant instructions",
  tools: [{ type: "code_interpreter" }, { type: "file_search" }],
});
```

```python
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
    model="gpt-4o",
    instructions="New instructions that override the Assistant instructions",
    tools=[{"type": "code_interpreter"}, {"type": "file_search"}],
)
```

```go
_, err := client.Beta.Threads.Runs.New(context.Background(), "thread_abc123", openai.BetaThreadRunNewParams{
	AssistantID:  "asst_ToSF7Gb04YMj8AMMm50ZLLtY",
	Model:        shared.ChatModelGPT4o,
	Instructions: openai.String("New instructions that override the Assistant instructions"),
	Tools: []openai.AssistantToolUnionParam{
		{OfCodeInterpreter: &openai.CodeInterpreterToolParam{}},
		{OfFileSearch: &openai.FileSearchToolParam{}},
	},
})
if err != nil {
	panic(err)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
run = client.beta.threads.runs.create(
  "thread_abc123",
  assistant_id: "asst_ToSF7Gb04YMj8AMMm50ZLLtY",
  model: "gpt-4o",
  instructions: "New instructions that override the Assistant instructions",
  tools: [{type: :code_interpreter}, {type: :file_search}]
)
puts(run.id)
```

```bash
curl https://api.openai.com/v1/threads/THREAD_ID/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "ASSISTANT_ID",
    "model": "gpt-4o",
    "instructions": "New instructions that override the Assistant instructions",
    "tools": [{"type": "code_interpreter"}, {"type": "file_search"}]
  }'
```


Note: `tool_resources` associated with the Assistant cannot be overridden during Run creation. You must use the [modify Assistant](https://developers.openai.com/api/reference/resources/beta/subresources/assistants/methods/update) endpoint to do this.

#### Run lifecycle

Run objects can have multiple statuses.

![Run lifecycle - diagram showing possible status transitions](https://cdn.openai.com/API/docs/images/diagram-run-statuses-v2.png)

| Status            | Definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queued`          | When Runs are first created or when you complete the `required_action`, they are moved to a queued status. They should almost immediately move to `in_progress`.                                                                                                                                                                                                                                                                                                                                           |
| `in_progress`     | While `in_progress`, the Assistant uses the model and tools to perform steps. You can view progress being made by the Run by examining the [Run Steps](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/subresources/steps).                                                                                                                                                                                                                                                           |
| `completed`       | The Run successfully completed! You can now view all Messages the Assistant added to the Thread, and all the steps the Run took. You can also continue the conversation by adding more user Messages to the Thread and creating another Run.                                                                                                                                                                                                                                                               |
| `requires_action` | When using the [Function calling](https://developers.openai.com/api/docs/assistants/tools/function-calling) tool, the Run will move to a `required_action` state once the model determines the names and arguments of the functions to be called. You must then run those functions and [submit the outputs](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/submit_tool_outputs) before the run proceeds. If the outputs are not provided before the `expires_at` timestamp passes (roughly 10 mins past creation), the run will move to an expired status. |
| `expired`         | This happens when the function calling outputs were not submitted before `expires_at` and the run expires. Additionally, if the runs take too long to execute and go beyond the time stated in `expires_at`, our systems will expire the run.                                                                                                                                                                                                                                                              |
| `cancelling`      | You can attempt to cancel an `in_progress` run using the [Cancel Run](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/cancel) endpoint. Once the attempt to cancel succeeds, status of the Run moves to `cancelled`. Cancellation is attempted but not guaranteed.                                                                                                                                                                                                                                                         |
| `cancelled`       | Run was successfully cancelled.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `failed`          | You can view the reason for the failure by looking at the `last_error` object in the Run. The timestamp for the failure will be recorded under `failed_at`.                                                                                                                                                                                                                                                                                                                                                |
| `incomplete`      | Run ended due to `max_prompt_tokens` or `max_completion_tokens` reached. You can view the specific reason by looking at the `incomplete_details` object in the Run.                                                                                                                                                                                                                                                                                                                                        |

#### Polling for updates

If you are not using [streaming](https://developers.openai.com/api/docs/assistants/migration#step-4-create-a-run?context=with-streaming), in order to keep the status of your run up to date, you will have to periodically [retrieve the Run](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/retrieve) object. You can check the status of the run each time you retrieve the object to determine what your application should do next.

You can optionally use Polling Helpers in our [Node](https://github.com/openai/openai-node?tab=readme-ov-file#polling-helpers) and [Python](https://github.com/openai/openai-python?tab=readme-ov-file#polling-helpers) SDKs to help you with this. These helpers will automatically poll the Run object for you and return the Run object when it's in a terminal state.

#### Thread locks

When a Run is `in_progress` and not in a terminal state, the Thread is locked. This means that:

- New Messages cannot be added to the Thread.
- New Runs cannot be created on the Thread.

#### Run steps

![Run steps lifecycle - diagram showing possible status transitions](https://cdn.openai.com/API/docs/images/diagram-2.png)

Run step statuses have the same meaning as Run statuses.

Most of the interesting detail in the Run Step object lives in the `step_details` field. There can be two types of step details:

1. `message_creation`: This Run Step is created when the Assistant creates a Message on the Thread.
2. `tool_calls`: This Run Step is created when the Assistant calls a tool. Details around this are covered in the relevant sections of the [Tools](https://developers.openai.com/api/docs/assistants/tools) guide.

## Data Access Guidance

Currently, Assistants, Threads, Messages, and Vector Stores created via the API are scoped to the Project they're created in. As such, any person with API key access to that Project is able to read or write Assistants, Threads, Messages, and Runs in the Project.

We strongly recommend the following data access controls:

- _Implement authorization._ Before performing reads or writes on Assistants, Threads, Messages, and Vector Stores, ensure that the end-user is authorized to do so. For example, store in your database the object IDs that the end-user has access to, and check it before fetching the object ID with the API.
- _Restrict API key access._ Carefully consider who in your organization should have API keys and be part of a Project. Periodically audit this list. API keys enable a wide range of operations including reading and modifying sensitive information, such as Messages and Files.
- _Create separate accounts._ Consider creating separate Projects for different applications in order to isolate data across multiple applications.