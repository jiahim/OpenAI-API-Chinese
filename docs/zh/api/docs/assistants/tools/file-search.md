# Assistants 文件搜索

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在 Responses API 实现功能对等后，我们已弃用 Assistants API。它将于 2026 年 8 月 26 日关闭。请参考 [迁移指南](https://developers.openai.com/platform/assistants/migration) 以更新你的集成。 [了解更多](https://platform.openai.com/docs/guides/migrate-to-responses).

## 概述

文件搜索通过模型之外的知识增强智能体，例如专有产品信息或用户提供的文档。OpenAI 自动解析并分块你的文档，创建并存储嵌入，并使用向量和关键词搜索来检索相关内容以回答用户查询。

## 快速入门

在此示例中，我们将创建一个能够帮助回答公司财务报表相关问题的智能体。

### 步骤 1：创建启用了文件搜索的新 Assistant

创建一个新助手，并在 `file_search` 中启用 `tools` 参数。

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Financial Analyst Assistant",
    instructions:
      "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
    model: "gpt-4o",
    tools: [{ type: "file_search" }],
  });
}

main();
```

```python
from openai import OpenAI

client = OpenAI()

assistant = client.beta.assistants.create(
    name="Financial Analyst Assistant",
    instructions="You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
    model="gpt-4o",
    tools=[{"type": "file_search"}],
)
```

```go
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Name:         openai.String("Financial Analyst Assistant"),
	Instructions: openai.String("You are an expert financial analyst. Use your knowledge base to answer questions about audited financial statements."),
	Model:        shared.ChatModelGPT4o,
	Tools:        []openai.AssistantToolUnionParam{{OfFileSearch: &openai.FileSearchToolParam{}}},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.AssistantCreateParams;
import com.openai.models.beta.assistants.FileSearchTool;

var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .model("gpt-4o")
                .name("Financial Analyst Assistant")
                .instructions(
                    "You are an expert financial analyst. Use you knowledge base to answer"
                        + " questions about audited financial statements.")
                .addTool(FileSearchTool.builder().build())
                .build());

System.out.println(assistant.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.create(
  model: "gpt-4o",
  name: "Financial Analyst Assistant",
  instructions: "Use the knowledge base to answer questions about audited financial statements.",
  tools: [{type: :file_search}]
)
puts(assistant.id)
```

```bash
curl https://api.openai.com/v1/assistants \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "OpenAI-Beta: assistants=v2" \
-d '{
"name": "Financial Analyst Assistant",
"instructions": "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
"tools": [{"type": "file_search"}],
"model": "gpt-4o"
}'
```


一旦 `file_search` 工具启用后，模型将根据用户消息决定何时检索内容。

### 步骤 2：上传文件并将其添加到向量存储

要访问你的文件， `file_search` 工具使用 Vector Store 对象。
上传你的文件并创建一个 Vector Store 来容纳它们。
创建 Vector Store 后，你应轮询其状态，直到所有文件都脱离 `in_progress` 状态，
以确保所有内容均已完成处理。SDK 提供了一次性上传和轮询的辅助函数。

```javascript
const fileStreams = [
  fs.createReadStream("edgar/goog-10k.pdf"),
  fs.createReadStream("edgar/brka-10k.txt"),
];

// Create a vector store including our two files.
let vectorStore = await openai.vectorStores.create({
  name: "Financial Statement",
});

await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
  files: fileStreams,
});
```

```python
# Create a vector store called "Financial Statements"
vector_store = client.vector_stores.create(name="Financial Statements")

# Ready the files for upload to OpenAI

file_paths = ["edgar/goog-10k.pdf", "edgar/brka-10k.txt"]
file_streams = [open(path, "rb") for path in file_paths]

# Use the upload and poll SDK helper to upload the files, add them to the vector store,

# and poll the status of the file batch for completion.

file_batch = client.vector_stores.file_batches.upload_and_poll(
    vector_store_id=vector_store.id, files=file_streams
)

# You can print the status and the file counts of the batch to see the result of this operation.

print(file_batch.status)
print(file_batch.file_counts)
```


### 步骤 3：更新助手以使用新的向量存储

为了让你的助手能够访问这些文件，请更新助手的 `tool_resources` 并配上新的 `vector_store` id。

```javascript
await openai.beta.assistants.update(assistant.id, {
  tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
});
```

```python
assistant = client.beta.assistants.update(
    assistant_id=assistant.id,
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)
```

```go
_, err := client.Beta.Assistants.Update(context.Background(), "asst_abc123", openai.BetaAssistantUpdateParams{
	ToolResources: openai.BetaAssistantUpdateParamsToolResources{
		FileSearch: openai.BetaAssistantUpdateParamsToolResourcesFileSearch{
			VectorStoreIDs: []string{"vs_abc123"},
		},
	},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.assistants.AssistantUpdateParams;
import com.openai.models.beta.assistants.FileSearchTool;

String assistantId = "asst_abc123";

String vectorStoreId = "vs_abc123";

var assistant =
    client
        .beta()
        .assistants()
        .update(
            assistantId,
            AssistantUpdateParams.builder()
                .addTool(FileSearchTool.builder().build())
                .toolResources(
                    AssistantUpdateParams.ToolResources.builder()
                        .fileSearch(
                            AssistantUpdateParams.ToolResources.FileSearch.builder()
                                .addVectorStoreId(vectorStoreId)
                                .build())
                        .build())
                .build());

System.out.println(assistant.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.update(
  "asst_abc123",
  tool_resources: {
    file_search: {vector_store_ids: ["vs_abc123"]}
  }
)
puts(assistant.id)
```


### 步骤 4：创建线程

你还可以将文件作为消息附件附加到线程上。这样做会创建另一个 `vector_store` 与线程关联，或者，如果该线程已附加了向量存储，则将新文件附加到现有的线程向量存储。当你在该线程上创建运行（Run）时，文件搜索工具将同时查询 `vector_store` 来自你助手的 `vector_store` 和线程中的。

在此示例中，用户附上了苹果公司最新的 10-K 文件副本。

```javascript
// A user wants to attach a file to a specific message, let's upload it.
const aapl10k = await openai.files.create({
  file: fs.createReadStream("edgar/aapl-10k.pdf"),
  purpose: "assistants",
});

const thread = await openai.beta.threads.create({
  messages: [
    {
      role: "user",
      content:
        "How many shares of AAPL were outstanding at the end of October 2023?",
      // Attach the new file to the message.
      attachments: [{ file_id: aapl10k.id, tools: [{ type: "file_search" }] }],
    },
  ],
});

// The thread now has a vector store in its tool resources.
console.log(thread.tool_resources?.file_search);
```

```python
# Upload the user provided file to OpenAI
message_file = client.files.create(
    file=open("edgar/aapl-10k.pdf", "rb"), purpose="assistants"
)

# Create a thread and attach the file to the message

thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": "How many shares of AAPL were outstanding at the end of of October 2023?",  # Attach the new file to the message.
            "attachments": [
                {"file_id": message_file.id, "tools": [{"type": "file_search"}]}
            ],
        }
    ]
)

# The thread now has a vector store with that file in its tool resources.

print(thread.tool_resources.file_search)
```


使用消息附件创建的向量存储默认过期策略为最后一次活跃后 7 天（定义为向量存储最后一次参与运行的 time）。此默认设置旨在帮助你管理向量存储成本。你可以随时覆盖这些过期策略。了解更多 [此处](#managing-costs-with-expiration-policies).

### 步骤5：创建运行并检查输出

现在，创建一个 Run，并观察模型如何使用文件搜索工具来响应用户的问题。



使用流式传输

```javascript
const stream = openai.beta.threads.runs
  .stream(thread.id, {
    assistant_id: assistant.id,
  })
  .on("textCreated", () => console.log("assistant >"))
  .on("toolCallCreated", (event) => console.log("assistant " + event.type))
  .on("messageDone", async (event) => {
    if (event.content[0].type === "text") {
      const { text } = event.content[0];
      const { annotations } = text;
      const citations = [];

      let index = 0;
      for (const annotation of annotations) {
        text.value = text.value.replace(annotation.text, `[${index}]`);
        if (annotation.type === "file_citation") {
          const citedFile = await openai.files.retrieve(
            annotation.file_citation.file_id
          );
          citations.push(`[${index}]${citedFile.filename}`);
        }
        index++;
      }

      console.log(text.value);
      console.log(citations.join("\n"));
    }
  });
```

```python
from typing_extensions import override
from openai import AssistantEventHandler, OpenAI

client = OpenAI()

class EventHandler(AssistantEventHandler):
    @override
    def on_text_created(self, text) -> None:
        print("\nassistant > ", end="", flush=True)

    @override
    def on_tool_call_created(self, tool_call):
        print(f"\nassistant > {tool_call.type}\n", flush=True)

    @override
    def on_message_done(self, message) -> None:
        # print a citation to the file searched
        message_content = message.content[0].text
        annotations = message_content.annotations
        citations = []
        for index, annotation in enumerate(annotations):
            message_content.value = message_content.value.replace(
                annotation.text, f"[{index}]"
            )
            if file_citation := getattr(annotation, "file_citation", None):
                cited_file = client.files.retrieve(file_citation.file_id)
                citations.append(f"[{index}] {cited_file.filename}")

        print(message_content.value)
        print("\n".join(citations))

# Then, we use the stream SDK helper

# with the EventHandler class to create the Run

# and stream the response.

with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant.id,
    instructions="Please address the user as Jane Doe. The user has a premium account.",
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

  

  

    
不使用流式传输

```javascript
const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
  assistant_id: assistant.id,
});

const messages = await openai.beta.threads.messages.list(thread.id, {
  run_id: run.id,
});

const message = messages.data.pop();
if (message.content[0].type === "text") {
  const { text } = message.content[0];
  const { annotations } = text;
  const citations = [];

  let index = 0;
  for (const annotation of annotations) {
    text.value = text.value.replace(annotation.text, `[${index}]`);
    if (annotation.type === "file_citation") {
      const citedFile = await openai.files.retrieve(
        annotation.file_citation.file_id
      );
      citations.push(`[${index}]${citedFile.filename}`);
    }
    index++;
  }

  console.log(text.value);
  console.log(citations.join("\n"));
}
```

```python
# Use the create and poll SDK helper to create a run and poll the status of
# the run until it's in a terminal state.

run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,
)

messages = list(
    client.beta.threads.messages.list(thread_id=thread.id, run_id=run.id)
)

message_content = messages[0].content[0].text
annotations = message_content.annotations
citations = []
for index, annotation in enumerate(annotations):
    message_content.value = message_content.value.replace(
        annotation.text, f"[{index}]"
    )
    if file_citation := getattr(annotation, "file_citation", None):
        cited_file = client.files.retrieve(file_citation.file_id)
        citations.append(f"[{index}] {cited_file.filename}")

print(message_content.value)
print("\n".join(citations))
```



你的新智能体将查询两个已附加的向量存储（一个包含 `goog-10k.pdf` 和 `brka-10k.txt`，另一个包含 `aapl-10k.pdf`）并返回此结果，来自 `aapl-10k.pdf`.

要检索模型使用的 文件搜索 结果的内容，请使用 `include` 查询参数并提供值 `step_details.tool_calls[*].file_search.results[*].content` 以以下格式 `?include[]=step_details.tool_calls[*].file_search.results[*].content`.

---

## 工作原理

该 `file_search` 工具实现了多项检索最佳实践，开箱即用地帮助您从文件中提取正确的数据，并增强模型的响应。该 `file_search` 工具：

- 重写用户查询以优化搜索。
- 将复杂的用户查询拆分为多个可并行运行的搜索。
- 在助手和线程向量存储中同时执行关键词搜索和语义搜索。
- 在生成最终响应之前，对搜索结果进行重排序，以挑选最相关的结果。

默认情况下， `file_search` 工具使用以下设置，但这些设置可以 [配置](#customizing-file-search-settings) 以满足你的需求：

- 块大小：800 个令牌
- 块重叠：400 个令牌
- 嵌入模型： `text-embedding-3-large` 维度为 256
- 添加到上下文的最大块数：20（可能更少）
- 排序器： `auto` （OpenAI 将选择使用哪个排序器）
- 分数阈值：最低排名分数为 0

**已知限制**

我们有一些已知的限制，并将在接下来的几个月中努力增加对这些限制的支持：

1. 支持使用自定义元数据进行确定性的搜索前过滤。
2. 支持解析文档中的图像（包括图表、图形、表格等图像）。
3. 支持对结构化文件格式（如 `csv` 或 `jsonl`).
4. 更好地支持摘要生成——目前该工具针对搜索查询进行了优化。

## 向量存储

Vector Store 对象让文件搜索工具能够搜索你的文件。将文件添加到 `vector_store` 时，会自动解析、分块、嵌入并将文件存储在支持关键词和语义搜索的向量数据库中。每个 `vector_store` 最多可容纳 10,000 个文件。对于 2025 年 11 月起创建的向量存储，此上限为 100,000,000 个文件。向量存储可同时附加到助手和线程。目前，每个助手最多可附加一个向量存储，每个线程最多可附加一个向量存储。

#### 创建向量存储并添加文件

你可以通过一次 API 调用创建向量存储并向其中添加文件：

```javascript
const vectorStore = await openai.vectorStores.create({
  name: "Product Documentation",
  file_ids: [
    "file_1",
    "file_2",
    "file_3",
    "file_4",
    "file_5",
  ],
});
```

```python
vector_store = client.vector_stores.create(
    name="Product Documentation",
    file_ids=[
        "file_1",
        "file_2",
        "file_3",
        "file_4",
        "file_5",
    ],
)
```

```go
vectorStore, err := client.VectorStores.New(context.Background(), openai.VectorStoreNewParams{
	Name:    openai.String("Product Documentation"),
	FileIDs: []string{"file_1", "file_2", "file_3", "file_4", "file_5"},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.VectorStoreCreateParams;

String fileId1 = "file_1";

String fileId2 = "file_2";

String fileId3 = "file_3";

String fileId4 = "file_4";

String fileId5 = "file_5";

var store =
    client
        .vectorStores()
        .create(
            VectorStoreCreateParams.builder()
                .name("Product Documentation")
                .addFileId(fileId1)
                .addFileId(fileId2)
                .addFileId(fileId3)
                .addFileId(fileId4)
                .addFileId(fileId5)
                .build());

System.out.println(store.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.create(
  name: "Product Documentation",
  file_ids: [
    "file_1",
    "file_2",
    "file_3",
    "file_4",
    "file_5"
  ]
)
puts(store.id)
```


向向量存储添加文件是异步操作。为确保操作完成，我们建议你使用官方 SDK 中的“创建并轮询”辅助方法。如果你未使用 SDK，你可以检索 `vector_store` 对象并监控其 [`file_counts`](https://developers.openai.com/api/reference/resources/vector_stores#vector-stores/object-file_counts) 属性以查看文件摄取操作的结果。

文件也可以在向量存储创建后通过 [创建向量存储文件](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create).

添加。添加文件按每个向量存储 ID 进行速率限制。对 `/vector_stores/{vector_store_id}/files` 和 `/vector_stores/{vector_store_id}/file_batches` 的请求共享每个向量存储每分钟 300 次的限制。

```javascript
const file = await openai.vectorStores.files.createAndPoll(
  "vs_abc123",
  {
    file_id: "file-abc123",
  }
);
```

```python
file = client.vector_stores.files.create_and_poll(
    vector_store_id="vs_abc123", file_id="file-abc123"
)
```

```go
_, err := client.VectorStores.Files.NewAndPoll(context.Background(), "vs_abc123", openai.VectorStoreFileNewParams{
	FileID: "file-abc123",
}, 1000)
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.files.FileCreateParams;
import com.openai.models.vectorstores.files.FileRetrieveParams;
import com.openai.models.vectorstores.files.VectorStoreFile;

String vectorStoreId = "vs_abc123";
String fileId = "file-abc123";
var file =
    client
        .vectorStores()
        .files()
        .create(vectorStoreId, FileCreateParams.builder().fileId(fileId).build());
while (file.status().equals(VectorStoreFile.Status.IN_PROGRESS)) {
  Thread.sleep(1000);
  file =
      client
          .vectorStores()
          .files()
          .retrieve(
              file.id(), FileRetrieveParams.builder().vectorStoreId(vectorStoreId).build());
}
System.out.println(file.status());
```

```ruby
require "openai"

client = OpenAI::Client.new
file = client.vector_stores.files.create(
  "vs_abc123",
  file_id: "file-abc123"
)
until [:completed, :failed, :cancelled].include?(file.status)
  sleep(1)
  file = client.vector_stores.files.retrieve(
    file.id,
    vector_store_id: "vs_abc123"
  )
end
puts(file.status)
```


或者，你可以通过 [创建批次](https://developers.openai.com/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 向向量存储添加最多 500 个文件。

批次创建接受简单的 `file_ids` 列表或 `files` 由包含 `file_id` 及可选 `attributes` 和 `chunking_strategy`。的对象组成的数组。当你需要每文件元数据或分块设置时，请使用 `files` ，并注意 `file_ids` 和 `files` 在单个请求中互斥。

对于向单个向量存储进行高吞吐量摄取，尽可能使用文件批次以减少请求量并改善延迟。

```javascript
const batch = await openai.vectorStores.fileBatches.createAndPoll(
  "vs_abc123",
  {
    files: [
      {
        file_id: "file_1",
        attributes: { category: "finance" },
      },
      {
        file_id: "file_2",
        chunking_strategy: {
          type: "static",
          static: {
            max_chunk_size_tokens: 1000,
            chunk_overlap_tokens: 200,
          },
        },
      },
    ],
  }
);
```

```python
batch = client.vector_stores.file_batches.create_and_poll(
    vector_store_id="vs_abc123",
    files=[
        {"file_id": "file_1", "attributes": {"category": "finance"}},
        {
            "file_id": "file_2",
            "chunking_strategy": {
                "type": "static",
                "max_chunk_size_tokens": 1000,
                "chunk_overlap_tokens": 200,
            },
        },
    ],
)
```

```go
_, err := client.VectorStores.FileBatches.NewAndPoll(context.Background(), "vs_abc123", openai.VectorStoreFileBatchNewParams{
	Files: []openai.VectorStoreFileBatchNewParamsFile{
		{
			FileID: "file_1",
			Attributes: map[string]openai.VectorStoreFileBatchNewParamsFileAttributeUnion{
				"category": {OfString: openai.String("finance")},
			},
		},
		{
			FileID: "file_2",
			ChunkingStrategy: openai.FileChunkingStrategyParamUnion{OfStatic: &openai.StaticFileChunkingStrategyObjectParam{
				Static: openai.StaticFileChunkingStrategyParam{MaxChunkSizeTokens: 1000, ChunkOverlapTokens: 200},
			}},
		},
	},
}, 1000)
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.vectorstores.StaticFileChunkingStrategy;
import com.openai.models.vectorstores.filebatches.FileBatchCreateParams;
import com.openai.models.vectorstores.filebatches.FileBatchRetrieveParams;
import com.openai.models.vectorstores.filebatches.VectorStoreFileBatch;

String vectorStoreId = "vs_abc123";
String fileId = "file_1";
String fileId2 = "file_2";
var first =
    FileBatchCreateParams.File.builder()
        .fileId(fileId)
        .attributes(
            FileBatchCreateParams.File.Attributes.builder()
                .putAdditionalProperty("category", JsonValue.from("finance"))
                .build())
        .build();
var second =
    FileBatchCreateParams.File.builder()
        .fileId(fileId2)
        .staticChunkingStrategy(
            StaticFileChunkingStrategy.builder()
                .maxChunkSizeTokens(1000)
                .chunkOverlapTokens(200)
                .build())
        .build();

var batch =
    client
        .vectorStores()
        .fileBatches()
        .create(
            vectorStoreId,
            FileBatchCreateParams.builder().addFile(first).addFile(second).build());
while (batch.status().equals(VectorStoreFileBatch.Status.IN_PROGRESS)) {
  Thread.sleep(1000);
  batch =
      client
          .vectorStores()
          .fileBatches()
          .retrieve(
              batch.id(),
              FileBatchRetrieveParams.builder().vectorStoreId(vectorStoreId).build());
}
System.out.println(batch.status());
```

```ruby
require "openai"

client = OpenAI::Client.new
batch = client.vector_stores.file_batches.create(
  "vs_abc123",
  files: [
    {file_id: "file_1", attributes: {category: "finance"}},
    {
      file_id: "file_2",
      chunking_strategy: {
        type: :static,
        max_chunk_size_tokens: 1_000,
        chunk_overlap_tokens: 200
      }
    }
  ]
)
until [:completed, :failed, :cancelled].include?(batch.status)
  sleep(1)
  batch = client.vector_stores.file_batches.retrieve(
    batch.id,
    vector_store_id: "vs_abc123"
  )
end
puts(batch.status)
```


同样，这些文件可以通过以下任一方式从向量存储中移除：

- 删除 [向量存储文件对象](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/delete) 或，
- 通过删除底层的 [文件对象](https://developers.openai.com/api/reference/resources/files/methods/delete) （这会从所有 `vector_store` 和 `code_interpreter` 你组织中的所有助手和线程中移除该文件的配置）

最大文件大小为 512 MB。每个文件包含的令牌数不得超过 5,000,000（在您附加文件时自动计算）。

文件搜索支持多种文件格式，包括 `.pdf`, `.md`，以及 `.docx`。有关支持的文件扩展名（及其对应的 MIME 类型）的更多详细信息，请参阅 [支持的文件](#supported-files) 部分。

#### 附加向量存储

你可以使用以下方式将向量存储附加到你的Assistant或Thread `tool_resources` 参数。

```javascript
const assistant = await openai.beta.assistants.create({
  instructions:
    "You are a helpful product support assistant and you answer questions based on the files provided to you.",
  model: "gpt-4o",
  tools: [{ type: "file_search" }],
  tool_resources: {
    file_search: {
      vector_store_ids: ["vs_1"],
    },
  },
});

const thread = await openai.beta.threads.create({
  messages: [{ role: "user", content: "How do I cancel my subscription?" }],
  tool_resources: {
    file_search: {
      vector_store_ids: ["vs_2"],
    },
  },
});
```

```python
assistant = client.beta.assistants.create(
    instructions="You are a helpful product support assistant and you answer questions based on the files provided to you.",
    model="gpt-4o",
    tools=[{"type": "file_search"}],
    tool_resources={"file_search": {"vector_store_ids": ["vs_1"]}},
)

thread = client.beta.threads.create(
    messages=[{"role": "user", "content": "How do I cancel my subscription?"}],
    tool_resources={"file_search": {"vector_store_ids": ["vs_2"]}},
)
```

```go
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Instructions: openai.String("You are a helpful product support assistant and you answer questions based on the files provided to you."),
	Model:        shared.ChatModelGPT4o,
	Tools:        []openai.AssistantToolUnionParam{{OfFileSearch: &openai.FileSearchToolParam{}}},
	ToolResources: openai.BetaAssistantNewParamsToolResources{
		FileSearch: openai.BetaAssistantNewParamsToolResourcesFileSearch{VectorStoreIDs: []string{"vs_1"}},
	},
})
if err != nil {
	panic(err)
}
thread, err := client.Beta.Threads.New(context.Background(), openai.BetaThreadNewParams{
	Messages: []openai.BetaThreadNewParamsMessage{{
		Role:    "user",
		Content: openai.BetaThreadNewParamsMessageContentUnion{OfString: openai.String("How do I cancel my subscription?")},
	}},
	ToolResources: openai.BetaThreadNewParamsToolResources{
		FileSearch: openai.BetaThreadNewParamsToolResourcesFileSearch{VectorStoreIDs: []string{"vs_2"}},
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
import com.openai.models.beta.assistants.FileSearchTool;
import com.openai.models.beta.threads.ThreadCreateParams;

String vectorStoreId = "vs_1";

String vectorStoreId2 = "vs_2";

var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .model("gpt-4o")
                .instructions(
                    "You are a helpful product support assistant and you answer questions based"
                        + " on the files provided to you.")
                .addTool(FileSearchTool.builder().build())
                .toolResources(
                    AssistantCreateParams.ToolResources.builder()
                        .fileSearch(
                            AssistantCreateParams.ToolResources.FileSearch.builder()
                                .addVectorStoreId(vectorStoreId)
                                .build())
                        .build())
                .build());

var thread =
    client
        .beta()
        .threads()
        .create(
            ThreadCreateParams.builder()
                .addMessage(
                    ThreadCreateParams.Message.builder()
                        .role(ThreadCreateParams.Message.Role.USER)
                        .content("How do I cancel my subscription?")
                        .build())
                .toolResources(
                    ThreadCreateParams.ToolResources.builder()
                        .fileSearch(
                            ThreadCreateParams.ToolResources.FileSearch.builder()
                                .addVectorStoreId(vectorStoreId2)
                                .build())
                        .build())
                .build());

System.out.println(assistant.id() + " " + thread.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.create(
  instructions: "Answer product support questions using the provided files.",
  model: "gpt-4o",
  tools: [{type: :file_search}],
  tool_resources: {
    file_search: {vector_store_ids: ["vs_1"]}
  }
)
thread = client.beta.threads.create(
  messages: [{role: :user, content: "How do I cancel my subscription?"}],
  tool_resources: {
    file_search: {vector_store_ids: ["vs_2"]}
  }
)
puts([assistant.id, thread.id])
```


你还可以在创建Threads或Assistants之后，通过使用正确的参数更新它们来附加向量存储 `tool_resources`.

#### 确保在创建运行之前向量存储已就绪

我们强烈建议你确保 `vector_store` 中的所有文件在创建运行之前已完全处理完毕。这将确保你的 `vector_store` 中的所有数据可被搜索。你可以通过 `vector_store` 我们 SDK 中的轮询辅助工具，或手动轮询 `vector_store` 对象来检查 [`status`](https://developers.openai.com/api/reference/resources/vector_stores#vector-stores/object-status) 是否 `completed`.

就绪。作为后备方案，我们在 **60 秒最大等待时间** 内置在 Run 对象中，当 **线程的** 向量存储包含仍在处理的文件时生效。这是为了确保用户在线程中上传的任何文件在运行继续之前完全可搜索。此后备等待 _不_ 适用于助手的向量存储。

#### 自定义文件搜索设置

你可以自定义 `file_search` 工具如何对数据进行分块，以及它向模型上下文返回多少个块。

**分块配置**

默认情况下， `max_chunk_size_tokens` 设置为 `800` 且 `chunk_overlap_tokens` 设置为 `400`，这意味着每个文件通过拆分为 800-token 的块进行索引，连续块之间有 400-token 的重叠。

你可以通过设置 [`chunking_strategy`](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create#vector-stores-files-createfile-chunking_strategy) 在向向量存储添加文件时进行调整。对于 `chunking_strategy`:

- `max_chunk_size_tokens` 必须介于 100 和 4096（含）之间。
- `chunk_overlap_tokens` 必须是非负数，且不应超过 `max_chunk_size_tokens / 2`.

**分块数量**

默认情况下， `file_search` 工具为 `gpt-4*` 和 o 系列模型最多输出 20 个分块，为 `gpt-3.5-turbo`。最多输出 5 个分块。你可以通过在创建助手或运行（run）时设置 [`file_search.max_num_results`](https://developers.openai.com/api/reference/resources/beta/subresources/assistants/methods/create#assistants-createassistant-tools) 工具中的参数来调整此数量。

请注意， `file_search` 工具由于多种原因可能输出的分块数量少于该数值：

- 数据块总数少于 `max_num_results`.
- 所有检索到的数据块的 token 总大小超出了分配给 `file_search` 工具的 token "预算"。该 `file_search` 工具当前的 token 预算为：
  - 4,000 tokens 针对 `gpt-3.5-turbo`
  - 16,000 tokens 针对 `gpt-4*` 模型
  - 16,000 tokens 针对 o 系列模型

#### 通过分块排名提升 文件搜索 结果相关性

默认情况下，文件搜索工具会将所有它认为在生成响应时具有任何相关性的搜索结果返回给模型。然而，如果使用相关性较低的搜索内容生成响应，可能会导致响应质量较低。你可以通过检查生成响应时返回的文件搜索结果，然后调整文件搜索工具的排序器行为，来改变结果必须达到的相关性阈值，以此调节此行为。

**检查文件搜索分块**

改善文件搜索结果质量的第一步是检查助手的当前行为。通常，这涉及到调查你的助手表现不佳的响应。你可以通过使用 REST API获取 [关于过去运行步骤的详细信息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/subresources/steps/methods/retrieve) ，具体使用 `include` 查询参数来获取用于生成结果的文件分块。

创建运行时在响应中包含文件搜索结果

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const runStep = await openai.beta.threads.runs.steps.retrieve("step_abc123", {
  thread_id: "thread_abc123",
  run_id: "run_abc123",
  include: ["step_details.tool_calls[*].file_search.results[*].content"],
});

console.log(runStep);
```

```python
from openai import OpenAI

client = OpenAI()

run_step = client.beta.threads.runs.steps.retrieve(
    thread_id="thread_abc123",
    run_id="run_abc123",
    step_id="step_abc123",
    include=["step_details.tool_calls[*].file_search.results[*].content"],
)

print(run_step)
```

```go
runStep, err := client.Beta.Threads.Runs.Steps.Get(
	context.Background(),
	"thread_abc123",
	"run_abc123",
	"step_abc123",
	openai.BetaThreadRunStepGetParams{Include: []openai.RunStepInclude{
		openai.RunStepIncludeStepDetailsToolCallsFileSearchResultsContent,
	}},
)
if err != nil {
	panic(err)
}
fmt.Println(runStep)
```

```ruby
require "openai"

client = OpenAI::Client.new
step = client.beta.threads.runs.steps.retrieve(
  "step_abc123",
  thread_id: "thread_abc123",
  run_id: "run_abc123",
  include: ["step_details.tool_calls[*].file_search.results[*].content"]
)
puts(step)
```

```bash
curl -g https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps/step_abc123?include[]=step_details.tool_calls[*].file_search.results[*].content \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-H "OpenAI-Beta: assistants=v2"
```


然后，你可以记录并检查运行步骤期间使用的搜索结果，并确定它们是否始终与你的助手应生成的响应相关。

**配置排序选项**

如果你确定你的文件搜索结果不足以生成高质量的响应，你可以调整用于选择哪些搜索结果来生成响应的结果排序器设置。你可以调整此设置 [`file_search.ranking_options`](https://developers.openai.com/api/reference/resources/beta/subresources/assistants/methods/create#assistants-createassistant-tools) 在工具中，当 **创建助手时** 或 **创建运行时**.

你可以配置的设置如下：

- `ranker` - 使用哪个排序器来确定要使用哪些文本块。可用的值是 `auto`，它使用最新的可用排序器，以及 `default_2024_08_21`.
- `score_threshold` - 一个介于 0.0 和 1.0 之间的排名，其中 1.0 是最高的排名。较高的数值会将用于生成结果的文本块限制为仅包含可能相关性更高的块，但代价是可能遗漏相关块。
- `hybrid_search.embedding_weight` （也称为 `rrf_embedding_weight`）- 当结合密集（嵌入）和稀疏（文本）排名与 [倒数排名融合](https://en.wikipedia.org/wiki/Reciprocal_rank_fusion)。时，确定给予语义相似度多少权重。增加此权重以偏向于嵌入空间中接近的块。
- `hybrid_search.text_weight` （也称为 `rrf_text_weight`）- 当混合搜索启用时，确定给予关键词/文本匹配多少权重。增加此权重以偏向于与查询共享确切术语的块。

至少一个 `hybrid_search.embedding_weight` 或 `hybrid_search.text_weight` 在配置混合搜索时必须大于零。

#### 使用过期策略管理成本

该 `file_search` 工具使用 `vector_stores` 对象作为其资源，你将根据 [大小](https://developers.openai.com/api/reference/resources/vector_stores#vector-stores/object-bytes) 的 `vector_store` 已创建对象进行计费。向量存储对象的大小是来自你的文件的所有解析块及其对应嵌入的总和。

你的首个 1GB 免费，超出部分按 $0.10/GB/天的向量存储用量计费。向量存储操作没有其他相关成本。

为了帮助你管理这些 `vector_store` 对象相关的成本，我们在 `vector_store` 对象中添加了对过期策略的支持。你可以在创建或更新 `vector_store` 对象时设置这些策略。

```javascript
let vectorStore = await openai.vectorStores.create({
  name: "rag-store",
  file_ids: [
    "file_1",
    "file_2",
    "file_3",
    "file_4",
    "file_5",
  ],
  expires_after: {
    anchor: "last_active_at",
    days: 7,
  },
});
```

```python
vector_store = client.vector_stores.create(
    name="Product Documentation",
    file_ids=[
        "file_1",
        "file_2",
        "file_3",
        "file_4",
        "file_5",
    ],
    expires_after={"anchor": "last_active_at", "days": 7},
)
```

```go
vectorStore, err := client.VectorStores.New(context.Background(), openai.VectorStoreNewParams{
	Name:         openai.String("Product Documentation"),
	FileIDs:      []string{"file_1", "file_2", "file_3", "file_4", "file_5"},
	ExpiresAfter: openai.VectorStoreNewParamsExpiresAfter{Days: 7},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.vectorstores.VectorStoreCreateParams;

String fileId1 = "file_1";

String fileId2 = "file_2";

String fileId3 = "file_3";

String fileId4 = "file_4";

String fileId5 = "file_5";

var store =
    client
        .vectorStores()
        .create(
            VectorStoreCreateParams.builder()
                .name("Product Documentation")
                .addFileId(fileId1)
                .addFileId(fileId2)
                .addFileId(fileId3)
                .addFileId(fileId4)
                .addFileId(fileId5)
                .expiresAfter(
                    VectorStoreCreateParams.ExpiresAfter.builder()
                        .anchor(JsonValue.from("last_active_at"))
                        .days(7)
                        .build())
                .build());

System.out.println(store.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.create(
  name: "Product Documentation",
  file_ids: [
    "file_1",
    "file_2",
    "file_3",
    "file_4",
    "file_5"
  ],
  expires_after: {anchor: :last_active_at, days: 7}
)
puts(store.id)
```


**线程向量存储具有默认过期策略**

使用线程辅助函数创建的向量存储（如 [`tool_resources.file_search.vector_stores`](https://developers.openai.com/api/reference/resources/beta/subresources/threads/methods/create#threads-createthread-tool_resources) 在线程中或 [message.attachments](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-attachments) 在消息中）具有默认过期策略：它们上次活动（定义为向量存储上次作为运行的一部分）后 7 天过期。

当向量存储过期时，该线程上的运行将失败。要解决此问题，你可以简单地重新创建一个新的 `vector_store` 并使用相同的文件重新附加到线程。

```javascript
const fileIds = [];
for await (const file of openai.vectorStores.files.list(
  "vs_expired"
)) {
  fileIds.push(file.id);
}

const vectorStore = await openai.vectorStores.create({
  name: "rag-store",
});
await openai.beta.threads.update("thread_abc123", {
  tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
});

for (const fileBatch of _.chunk(fileIds, 100)) {
  await openai.vectorStores.fileBatches.create(vectorStore.id, {
    file_ids: fileBatch,
  });
}
```

```python
all_files = list(client.vector_stores.files.list("vs_expired"))

vector_store = client.vector_stores.create(name="rag-store")
client.beta.threads.update(
    "thread_abc123",
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)

for file_batch in chunked(all_files, 100):
    client.vector_stores.file_batches.create_and_poll(
        vector_store_id=vector_store.id,
        file_ids=[file.id for file in file_batch],
    )
```

```go
pager := client.VectorStores.Files.ListAutoPaging(context.Background(), "vs_expired", openai.VectorStoreFileListParams{})
fileIDs := make([]string, 0)
for pager.Next() {
	fileIDs = append(fileIDs, pager.Current().ID)
}
if err := pager.Err(); err != nil {
	panic(err)
}
vectorStore, err := client.VectorStores.New(context.Background(), openai.VectorStoreNewParams{
	Name: openai.String("rag-store"),
})
if err != nil {
	panic(err)
}
_, err = client.Beta.Threads.Update(context.Background(), "thread_abc123", openai.BetaThreadUpdateParams{
	ToolResources: openai.BetaThreadUpdateParamsToolResources{
		FileSearch: openai.BetaThreadUpdateParamsToolResourcesFileSearch{VectorStoreIDs: []string{vectorStore.ID}},
	},
})
if err != nil {
	panic(err)
}
for start := 0; start < len(fileIDs); start += 100 {
	end := min(start+100, len(fileIDs))
	if _, err := client.VectorStores.FileBatches.NewAndPoll(context.Background(), vectorStore.ID, openai.VectorStoreFileBatchNewParams{
		FileIDs: fileIDs[start:end],
	}, 1000); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.ThreadUpdateParams;
import com.openai.models.vectorstores.VectorStoreCreateParams;
import com.openai.models.vectorstores.filebatches.FileBatchCreateParams;
import com.openai.models.vectorstores.filebatches.FileBatchRetrieveParams;
import com.openai.models.vectorstores.filebatches.VectorStoreFileBatch;
import java.util.ArrayList;

String vectorStoreId = "vs_expired";
String threadId = "thread_abc123";
var files = client.vectorStores().files().list(vectorStoreId).autoPager();
var replacement =
    client.vectorStores().create(VectorStoreCreateParams.builder().name("rag-store").build());
client
    .beta()
    .threads()
    .update(
        threadId,
        ThreadUpdateParams.builder()
            .toolResources(
                ThreadUpdateParams.ToolResources.builder()
                    .fileSearch(
                        ThreadUpdateParams.ToolResources.FileSearch.builder()
                            .addVectorStoreId(replacement.id())
                            .build())
                    .build())
            .build());

var fileIds = new ArrayList<String>();
for (var file : files) fileIds.add(file.id());
for (int offset = 0; offset < fileIds.size(); offset += 100) {
  var ids = fileIds.subList(offset, Math.min(offset + 100, fileIds.size()));
  var batch =
      client
          .vectorStores()
          .fileBatches()
          .create(replacement.id(), FileBatchCreateParams.builder().fileIds(ids).build());
  while (batch.status().equals(VectorStoreFileBatch.Status.IN_PROGRESS)) {
    Thread.sleep(1000);
    batch =
        client
            .vectorStores()
            .fileBatches()
            .retrieve(
                batch.id(),
                FileBatchRetrieveParams.builder().vectorStoreId(replacement.id()).build());
  }
  if (!batch.status().equals(VectorStoreFileBatch.Status.COMPLETED)) {
    throw new IllegalStateException("File batch ended with status: " + batch.status());
  }
}
System.out.println(replacement.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
files = client.vector_stores.files.list("vs_expired")
store = client.vector_stores.create(name: "rag-store")
client.beta.threads.update(
  "thread_abc123",
  tool_resources: {file_search: {vector_store_ids: [store.id]}}
)
file_ids = []
files.auto_paging_each { |file| file_ids << file.id }
file_ids.each_slice(100) do |batch_ids|
  batch = client.vector_stores.file_batches.create(store.id, file_ids: batch_ids)
  while batch.status == OpenAI::VectorStores::VectorStoreFileBatch::Status::IN_PROGRESS
    sleep(2)
    batch = client.vector_stores.file_batches.retrieve(
      batch.id,
      vector_store_id: store.id
    )
  end
  unless batch.status == OpenAI::VectorStores::VectorStoreFileBatch::Status::COMPLETED
    raise "File batch ended with status: #{batch.status}"
  end
end
puts(store.id)
```


## 支持的文件

_对于 `text/` MIME 类型，编码必须是以下之一 `utf-8`, `utf-16`，或 `ascii`._

{/* Keep this table in sync with RETRIEVAL_SUPPORTED_EXTENSIONS in the agentapi service */}

| 文件格式 | MIME 类型                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| `.c`        | `text/x-c`                                                                  |
| `.cpp`      | `text/x-c++`                                                                |
| `.cs`       | `text/x-csharp`                                                             |
| `.css`      | `text/css`                                                                  |
| `.doc`      | `application/msword`                                                        |
| `.docx`     | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`   |
| `.go`       | `text/x-golang`                                                             |
| `.html`     | `text/html`                                                                 |
| `.java`     | `text/x-java`                                                               |
| `.js`       | `text/javascript`                                                           |
| `.json`     | `application/json`                                                          |
| `.md`       | `text/markdown`                                                             |
| `.pdf`      | `application/pdf`                                                           |
| `.php`      | `text/x-php`                                                                |
| `.pptx`     | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.py`       | `text/x-python`                                                             |
| `.py`       | `text/x-script.python`                                                      |
| `.rb`       | `text/x-ruby`                                                               |
| `.sh`       | `application/x-sh`                                                          |
| `.tex`      | `text/x-tex`                                                                |
| `.ts`       | `application/typescript`                                                    |
| `.txt`      | `text/plain`                                                                |