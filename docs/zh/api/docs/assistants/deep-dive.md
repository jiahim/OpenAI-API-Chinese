# Assistants API 深度解析

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可在页面 URL 后附加 `.md` 获得。

在Responses API实现功能对等后，我们已弃用 Assistants API。它将于 2026 年 8 月 26 日关闭。请遵循 [迁移指南](https://developers.openai.com/platform/assistants/migration) 更新你的集成。 [了解更多](https://platform.openai.com/docs/guides/migrate-to-responses).

## 概述

不要在 Assistants API 上开始新的集成。我们已宣布即将弃用它，因为 Responses API 现在提供了相同的功能和更优雅的集成。

使用 Assistants API 构建应用涉及几个概念，下面进行了介绍，以防对你的 [迁移到 Responses](https://developers.openai.com/api/docs/assistants/migration).

## 创建智能体

我们建议使用 OpenAI 的 [最新模型](https://developers.openai.com/api/docs/models) 配合
  Assistants API 以获得最佳结果和与工具的最大兼容性。

要开始使用，创建 Assistant 只需指定 `model` 即可。但你还可以进一步自定义 Assistant 的行为：

1. 使用 `instructions` 参数来指导智能体的个性并定义其目标。指令类似于Chat Completions API中的系统消息。
2. 使用 `tools` 参数为智能体提供最多128个工具的访问权限。你可以让其访问OpenAI内置工具，例如 `code_interpreter` 和 `file_search`，或通过 `function` 调用第三方工具。
3. 使用 `tool_resources` 参数为工具提供 `code_interpreter` 和 `file_search` 的文件访问权限。文件通过 `File` [上传端点](https://developers.openai.com/api/reference/resources/files/methods/create) 上传，且必须将 `purpose` 设置为 `assistants` 才能与此API一起使用。

例如，要创建一个能够基于 `.csv` 文件创建数据可视化的智能体，首先上传一个文件。

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
                .purpose(FilePurpose.ASSISTANTS)
                .build());

System.out.println(file.id());
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


然后，使用 `code_interpreter` 工具创建智能体，并将该文件作为工具的资源提供。

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.AssistantCreateParams;
import com.openai.models.beta.assistants.CodeInterpreterTool;

String fileId = "file-BK7bzQj3FfZFXr7DbL6xJwfo";

var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .name("Data visualizer")
                .model("gpt-4o")
                .description(
                    "You are great at creating beautiful data visualizations. You analyze data"
                        + " present in .csv files, understand trends, and come up with data"
                        + " visualizations relevant to those trends. You also share a brief text"
                        + " summary of the trends observed.")
                .addTool(CodeInterpreterTool.builder().build())
                .toolResources(
                    AssistantCreateParams.ToolResources.builder()
                        .codeInterpreter(
                            AssistantCreateParams.ToolResources.CodeInterpreter.builder()
                                .addFileId(fileId)
                                .build())
                        .build())
                .build());

System.out.println(assistant.id());
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


你最多可以附加 20 个文件到 `code_interpreter` 和 10,000 个文件到 `file_search` （使用 `vector_store` [对象](https://developers.openai.com/api/reference/resources/vector_stores)）。对于 2025 年 11 月起创建的向量存储， `file_search` 限制为 100,000,000 个文件。

每个文件大小最多为 512 MB，且最多包含 5,000,000 个令牌。默认情况下，每个项目总共最多可存储 2.5 TB 的文件。没有组织范围的存储限制。你可以联系我们的支持团队来提高此限制。

## 管理线程和消息

线程和消息代表智能体与用户之间的对话会话。每个线程的消息数量上限为 100,000 条。一旦消息大小超过模型的上下文窗口，线程将尝试智能地截断消息，然后完全丢弃其认为最不重要的消息。

你可以通过初始消息列表创建线程，如下所示：

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
                            "Create 3 data visualizations based on the trends in this file.")
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


消息可以包含文本、图像或文件附件。消息 `attachments` 是帮助将文件添加到线程的辅助方法 `tool_resources`。你也可以选择将文件添加到 `thread.tool_resources` 中。

### 创建图像输入内容

消息内容可以包含外部图片 URL 或通过 [File API](https://developers.openai.com/api/reference/resources/files/methods/create)。上传的文件 ID。只有 [模型](https://developers.openai.com/api/docs/models) 支持视觉功能才能接受图片输入。支持的图片内容类型包括 png、jpg、gif 和 webp。创建图片文件时，传递 `purpose="vision"` 以便你之后可以下载和显示输入内容。项目总文件存储限制为 2.5 TB，没有组织级别的存储限制。请联系我们申请提高限额。

工具无法访问图片内容，除非特别指定。要将图片文件传递给 Code Interpreter，请在消息中添加文件 ID `attachments` 列表，以便工具读取和分析输入。目前 Code Interpreter 无法下载图片 URL。

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.ThreadCreateParams;
import com.openai.models.beta.threads.messages.ImageFile;
import com.openai.models.beta.threads.messages.ImageFileContentBlock;
import com.openai.models.beta.threads.messages.ImageUrl;
import com.openai.models.beta.threads.messages.ImageUrlContentBlock;
import com.openai.models.beta.threads.messages.MessageContentPartParam;
import com.openai.models.beta.threads.messages.TextContentBlockParam;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
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

var imageUrl =
    ImageUrl.builder()
        .url("https://openai-documentation.vercel.app/images/cat_and_otter.png")
        .build();
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
                            ThreadCreateParams.Message.Content.ofArrayOfContentParts(
                                List.of(
                                    MessageContentPartParam.ofText(
                                        TextContentBlockParam.builder()
                                            .text(
                                                "What is the difference between these images?")
                                            .build()),
                                    MessageContentPartParam.ofImageUrl(
                                        ImageUrlContentBlock.builder()
                                            .imageUrl(imageUrl)
                                            .build()),
                                    MessageContentPartParam.ofImageFile(
                                        ImageFileContentBlock.builder()
                                            .imageFile(
                                                ImageFile.builder().fileId(file.id()).build())
                                            .build()))))
                        .build())
                .build());

System.out.println(thread.id());
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


#### 低或高保真图片理解

通过控制 `detail` 参数，该参数有三个选项， `low`, `high`，或 `auto`，你可以控制模型如何处理图像并生成其文本理解。

- `low` 将启用“低分辨率”模式。模型将接收图像的 512px x 512px 低分辨率版本，并以 85 个 token 的预算来表示该图像。这使 API 能够在不需要高细节的场景中返回更快的响应并消耗更少的输入 token。
- `high` 将启用“高分辨率”模式，该模式首先允许模型查看低分辨率图像，然后根据输入图像尺寸创建详细的裁剪。使用 [定价计算器](https://openai.com/api/pricing/) 查看各种图像尺寸的 token 数量。

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.ThreadCreateParams;
import com.openai.models.beta.threads.messages.ImageUrl;
import com.openai.models.beta.threads.messages.ImageUrlContentBlock;
import com.openai.models.beta.threads.messages.MessageContentPartParam;
import com.openai.models.beta.threads.messages.TextContentBlockParam;
import java.util.List;

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
                            ThreadCreateParams.Message.Content.ofArrayOfContentParts(
                                List.of(
                                    MessageContentPartParam.ofText(
                                        TextContentBlockParam.builder()
                                            .text("What is this an image of?")
                                            .build()),
                                    MessageContentPartParam.ofImageUrl(
                                        ImageUrlContentBlock.builder()
                                            .imageUrl(
                                                ImageUrl.builder()
                                                    .url(
                                                        "https://openai-documentation.vercel.app/images/cat_and_otter.png")
                                                    .detail(ImageUrl.Detail.HIGH)
                                                    .build())
                                            .build()))))
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


### 上下文窗口管理

Assistants API 会自动管理截断，以确保其不超过模型的最大上下文长度。你可以通过指定一次运行想要使用的最大令牌数和/或希望在一次运行中包含的最大近期消息数来自定义此行为。

#### 最大补全数和最大提示词元数

要控制单次 Run 中的 token 用量，请在创建 Run 时设置 `max_prompt_tokens` 和 `max_completion_tokens` 。这些限制适用于 Run 生命周期内所有补全中使用的 token 总数。

例如，使用 `max_prompt_tokens` 设置为 500 和 `max_completion_tokens` 设置为 1000 发起 Run，意味着第一次补全会将线程截断至 500 个 token，并将输出上限设为 1000 个 token。如果第一次补全仅使用了 200 个提示 token 和 300 个补全 token，则第二次补全将具有 300 个提示 token 和 700 个补全 token 的可用限制。

如果补全达到 `max_completion_tokens` 限制，Run 将以状态 `incomplete`，终止，具体详情将在 Run 对象的 `incomplete_details` 字段中提供。

使用文件搜索工具时，建议将 max_prompt_tokens 设置为
  不少于 20,000。对于较长的对话或与
  文件搜索的多次交互，请考虑将此限制提高到 50,000，或理想情况下完全移除
  max_prompt_tokens 限制以获得最高质量的结果。

#### 截断策略

你还可以指定截断策略，以控制线程如何渲染到模型的上下文窗口中。
使用类型为 `auto` 的截断策略将使用 OpenAI 的默认截断策略。使用类型为 `last_messages` 的截断策略将允许你指定要包含在上下文窗口中的最近消息数量。

### 消息注解

由智能体创建的消息可能包含 [`annotations`](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages#messages/object-content) 位于 `content` 对象的数组中。注释提供关于你应该如何在消息中标注文本的信息。

注释有两种类型：

1. `file_citation`：文件引用由 [`file_search`](https://developers.openai.com/api/docs/assistants/tools/file-search) 工具创建，定义了对 Assistant 上传并用于生成响应时的特定文件的引用。
2. `file_path`：文件路径注释由 [`code_interpreter`](https://developers.openai.com/api/docs/assistants/tools/code-interpreter) 工具创建，包含对工具所生成文件的引用。

当 Message 对象中存在注解时，你会在文本中看到难以辨认的模型生成的子字符串，你应当用注解替换这些字符串。这些字符串可能看起来像 `【13†source】` 或 `sandbox:/mnt/data/file.csv`。以下是一个用注解替换这些字符串的 Python 代码示例。

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.messages.MessageRetrieveParams;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

String messageId = "msg_abc123";

String threadId = "thread_abc123";

var message =
    client
        .beta()
        .threads()
        .messages()
        .retrieve(messageId, MessageRetrieveParams.builder().threadId(threadId).build());

var text =
    message.content().stream()
        .flatMap(content -> content.text().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No text content returned"))
        .text();
String rendered = text.value();
var references = new ArrayList<String>();
for (int index = 0; index < text.annotations().size(); index++) {
  var annotation = text.annotations().get(index);
  if (annotation.isFileCitation()) {
    var citation = annotation.asFileCitation();
    rendered =
        rendered.replaceFirst(
            Pattern.quote(citation.text()), Matcher.quoteReplacement(" [" + index + "]"));
    var file = client.files().retrieve(citation.fileCitation().fileId());
    references.add("[" + index + "] " + file.filename());
  } else if (annotation.isFilePath()) {
    var filePath = annotation.asFilePath();
    rendered =
        rendered.replaceFirst(
            Pattern.quote(filePath.text()), Matcher.quoteReplacement(" [" + index + "]"));
    String fileId = filePath.filePath().fileId();
    var file = client.files().retrieve(fileId);
    Path downloads = Path.of("downloads");
    Files.createDirectories(downloads);
    Path target = downloads.resolve(Path.of(file.filename()).getFileName()).normalize();
    if (!target.startsWith(downloads)) throw new IllegalArgumentException("Unsafe filename");
    try (var content = client.files().content(fileId)) {
      Files.copy(content.body(), target, StandardCopyOption.REPLACE_EXISTING);
    }
    references.add("[" + index + "] Downloaded " + target);
  }
}
System.out.println(rendered);
references.forEach(System.out::println);
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


## 运行与运行步骤

当你在线程中从用户那里获取到所需的所有上下文后，就可以使用你选择的智能体运行该线程。

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.runs.RunCreateParams;

String threadId = "thread_abc123";

String assistantId = "asst_ToSF7Gb04YMj8AMMm50ZLLtY";

var run =
    client
        .beta()
        .threads()
        .runs()
        .create(threadId, RunCreateParams.builder().assistantId(assistantId).build());

System.out.println(run.status());
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


默认情况下，运行将使用 `model` 和 `tools` 智能体对象中指定的配置，但在创建运行时，你可以覆盖其中大部分配置以增加灵活性：

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

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.CodeInterpreterTool;
import com.openai.models.beta.assistants.FileSearchTool;
import com.openai.models.beta.threads.runs.RunCreateParams;

String threadId = "thread_abc123";

String assistantId = "asst_ToSF7Gb04YMj8AMMm50ZLLtY";

var run =
    client
        .beta()
        .threads()
        .runs()
        .create(
            threadId,
            RunCreateParams.builder()
                .assistantId(assistantId)
                .model("gpt-4o")
                .instructions("New instructions that override the Assistant instructions")
                .addTool(CodeInterpreterTool.builder().build())
                .addTool(FileSearchTool.builder().build())
                .build());

System.out.println(run.status());
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


注意： `tool_resources` 与智能体关联的配置无法在运行创建期间覆盖。你必须使用 [修改智能体](https://developers.openai.com/api/reference/resources/beta/subresources/assistants/methods/update) 端点来完成此操作。

#### 运行生命周期

运行对象可以有多种状态。

![运行生命周期——图表展示可能的状态转换](https://cdn.openai.com/API/docs/images/diagram-run-statuses-v2.png)

| 状态            | 定义                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queued`          | 当助手的 Run 首次创建或你完成 `required_action`，时，它们会被移至排队状态。它们应几乎立即移至 `in_progress`.                                                                                                                                                                                                                                                                                                                                           |
| `in_progress`     | 在 `in_progress`，期间，助手使用模型和工具执�行步骤。你可以通过检查 [Run 步骤](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/subresources/steps).                                                                                                                                                                                                                                                           |
| `completed`       | 该 Run 已成功完成！你现在可以查看助手添加到线程中的所有消息，以及该 Run 执行的所有步骤。你也可以通过在线程中添加更多用户消息并创建另一个 Run 来继续对话。                                                                                                                                                                                                                                                               |
| `requires_action` | 当使用 [函数调用](https://developers.openai.com/api/docs/assistants/tools/function-calling) 工具时，一旦模型确定了要调用的函数名称和参数，该 Run 将移至 `required_action` 状态。然后，你必须运行这些函数并 [提交输出](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/submit_tool_outputs) ，Run 才能继续。如果未在 `expires_at` 时间戳过去之前（大约创建后 10 分钟）提供输出，该 Run 将移至过期状态。 |
| `expired`         | 当函数调用的输出未在 `expires_at` 之前提交且 Run 过期时，会发生这种情况。此外，如果 Run 执行时间过长，超过 `expires_at`，中规定的时间，我们的系统将使 Run 过期。                                                                                                                                                                                                                                                              |
| `cancelling`      | 你可以尝试取消 `in_progress` 使用 [取消运行](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/cancel) 端点。一旦取消尝试成功，运行状态将转变为 `cancelled`。取消操作会被尝试执行，但不保证成功。                                                                                                                                                                                                                                                         |
| `cancelled`       | 运行已成功取消。                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `failed`          | 你可以通过查看运行中的 `last_error` 对象来了解失败原因。失败的时间戳将记录在 `failed_at`.                                                                                                                                                                                                                                                                                                                                                |
| `incomplete`      | 运行因 `max_prompt_tokens` 或 `max_completion_tokens` 达到而结束。你可以通过查看运行中的 `incomplete_details` 对象来了解具体原因。                                                                                                                                                                                                                                                                                                                                        |

#### 轮询更新

如果你未使用 [流式传输](https://developers.openai.com/api/docs/assistants/migration#step-4-create-a-run?context=with-streaming)，为了保持运行状态的最新，你将需要定期 [检索运行](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/retrieve) 对象。每次检索该对象时，你可以检查运行状态，以确定你的应用程序接下来应采取什么操作。

你可以选择使用我们中的轮询助手 [Node](https://github.com/openai/openai-node?tab=readme-ov-file#polling-helpers) 和 [Python](https://github.com/openai/openai-python?tab=readme-ov-file#polling-helpers) SDK来帮助你完成此操作。这些助手将自动为你轮询运行对象，并在其达到终态时返回运行对象。

#### 线程锁

当运行处于 `in_progress` 且不处于终止状态时，线程被锁定。这意味着：

- 无法向线程添加新消息。
- 无法在线程上创建新的运行。

#### 运行步骤

![运行步骤生命周期——展示可能的状态转换的示意图](https://cdn.openai.com/API/docs/images/diagram-2.png)

运行步骤状态与运行状态含义相同。

运行步骤对象中大部分有趣的细节都位于 `step_details` 字段中。步骤详情有两种类型：

1. `message_creation`：此运行步骤在助手在会话线程中创建消息时生成。
2. `tool_calls`：此运行步骤在助手调用工具时生成。相关细节请参阅 [工具](https://developers.openai.com/api/docs/assistants/tools) 指南。

## 数据访问指南

目前，通过 API 创建的 Assistants、Threads、Messages 和 Vector Stores 都限定在其所属的 Project 内。因此，任何拥有该 Project API 密钥访问权限的人员，都可以读取或写入该 Project 中的 Assistants、Threads、Messages 和 Runs。

我们强烈建议采用以下数据访问控制措施：

- _实现授权。_ 在对 Assistants、Threads、Messages 和 Vector Stores 执行读取或写入之前，请确保终端用户已被授权执行这些操作。例如，在你的数据库中存储终端用户有权访问的对象 ID，并在使用 API 获取对象 ID 之前进行检查。
- _限制 API 密钥访问。_ 仔细考虑你组织中的哪些人员应拥有 API 密钥并成为 Project 的成员。定期审查此列表。API 密钥支持广泛的操作，包括读取和修改敏感信息（如 Messages 和 Files）。
- _创建单独的账户。_ 考虑为不同的应用程序创建单独的 Projects，以便在多个应用程序之间隔离数据。