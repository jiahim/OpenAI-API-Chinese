# Assistants File Search

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).

## Overview

File Search augments the Assistant with knowledge from outside its model, such as proprietary product information or documents provided by your users. OpenAI automatically parses and chunks your documents, creates and stores the embeddings, and use both vector and keyword search to retrieve relevant content to answer user queries.

## Quickstart

In this example, we’ll create an assistant that can help answer questions about companies’ financial statements.

### Step 1: Create a new Assistant with File Search Enabled

Create a new assistant with `file_search` enabled in the `tools` parameter of the Assistant.

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


Once the `file_search` tool is enabled, the model decides when to retrieve content based on user messages.

### Step 2: Upload files and add them to a Vector Store

To access your files, the `file_search` tool uses the Vector Store object.
Upload your files and create a Vector Store to contain them.
Once the Vector Store is created, you should poll its status until all files are out of the `in_progress` state to
ensure that all content has finished processing. The SDK provides helpers to uploading and polling in one shot.

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


### Step 3: Update the assistant to use the new Vector Store

To make the files accessible to your assistant, update the assistant’s `tool_resources` with the new `vector_store` id.

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


### Step 4: Create a thread

You can also attach files as Message attachments on your thread. Doing so will create another `vector_store` associated with the thread, or, if there is already a vector store attached to this thread, attach the new files to the existing thread vector store. When you create a Run on this thread, the file search tool will query both the `vector_store` from your assistant and the `vector_store` on the thread.

In this example, the user attached a copy of Apple’s latest 10-K filing.

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


Vector stores created using message attachments have a default expiration policy of 7 days after they were last active (defined as the last time the vector store was part of a run). This default exists to help you manage your vector storage costs. You can override these expiration policies at any time. Learn more [here](#managing-costs-with-expiration-policies).

### Step 5: Create a run and check the output

Now, create a Run and observe that the model uses the File Search tool to provide a response to the user’s question.



With streaming

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

  

  

    
Without streaming

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



Your new assistant will query both attached vector stores (one containing `goog-10k.pdf` and `brka-10k.txt`, and the other containing `aapl-10k.pdf`) and return this result from `aapl-10k.pdf`.

To retrieve the contents of the file search results that were used by the model, use the `include` query parameter and provide a value of `step_details.tool_calls[*].file_search.results[*].content` in the format `?include[]=step_details.tool_calls[*].file_search.results[*].content`.

---

## How it works

The `file_search` tool implements several retrieval best practices out of the box to help you extract the right data from your files and augment the model’s responses. The `file_search` tool:

- Rewrites user queries to optimize them for search.
- Breaks down complex user queries into multiple searches it can run in parallel.
- Runs both keyword and semantic searches across both assistant and thread vector stores.
- Reranks search results to pick the most relevant ones before generating the final response.

By default, the `file_search` tool uses the following settings but these can be [configured](#customizing-file-search-settings) to suit your needs:

- Chunk size: 800 tokens
- Chunk overlap: 400 tokens
- Embedding model: `text-embedding-3-large` at 256 dimensions
- Maximum number of chunks added to context: 20 (could be fewer)
- Ranker: `auto` (OpenAI will choose which ranker to use)
- Score threshold: 0 minimum ranking score

**Known Limitations**

We have a few known limitations we're working on adding support for in the coming months:

1. Support for deterministic pre-search filtering using custom metadata.
2. Support for parsing images within documents (including images of charts, graphs, tables etc.)
3. Support for retrievals over structured file formats (like `csv` or `jsonl`).
4. Better support for summarization — the tool today is optimized for search queries.

## Vector stores

Vector Store objects give the File Search tool the ability to search your files. Adding a file to a `vector_store` automatically parses, chunks, embeds and stores the file in a vector database that's capable of both keyword and semantic search. Each `vector_store` can hold up to 10,000 files. For vector stores created starting in November 2025, this limit is 100,000,000 files. Vector stores can be attached to both Assistants and Threads. Today, you can attach at most one vector store to an assistant and at most one vector store to a thread.

#### Creating vector stores and adding files

You can create a vector store and add files to it in a single API call:

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


Adding files to vector stores is an async operation. To ensure the operation is complete, we recommend that you use the 'create and poll' helpers in our official SDKs. If you're not using the SDKs, you can retrieve the `vector_store` object and monitor its [`file_counts`](https://developers.openai.com/api/reference/resources/vector_stores#vector-stores/object-file_counts) property to see the result of the file ingestion operation.

Files can also be added to a vector store after it's created by [creating vector store files](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create).

Adding files is rate limited per vector store ID. Requests to `/vector_stores/{vector_store_id}/files` and `/vector_stores/{vector_store_id}/file_batches` share a per-vector-store limit of 300 requests per minute.

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


Alternatively, you can add several files to a vector store by [creating batches](https://developers.openai.com/api/reference/resources/vector_stores/subresources/file_batches/methods/create) of up to 500 files.

Batch creation accepts either a simple list of `file_ids` or a `files` array made up of objects with a `file_id` plus optional `attributes` and `chunking_strategy`. Use `files` when you need per-file metadata or chunking settings, and note that `file_ids` and `files` are mutually exclusive in a single request.

For high-throughput ingestion into one vector store, prefer file batches whenever possible to reduce request volume and improve latency.

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


Similarly, these files can be removed from a vector store by either:

- Deleting the [vector store file object](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/delete) or,
- By deleting the underlying [file object](https://developers.openai.com/api/reference/resources/files/methods/delete) (which removes the file it from all `vector_store` and `code_interpreter` configurations across all assistants and threads in your organization)

The maximum file size is 512 MB. Each file should contain no more than 5,000,000 tokens per file (computed automatically when you attach a file).

File Search supports a variety of file formats including `.pdf`, `.md`, and `.docx`. More details on the file extensions (and their corresponding MIME-types) supported can be found in the [Supported files](#supported-files) section below.

#### Attaching vector stores

You can attach vector stores to your Assistant or Thread using the `tool_resources` parameter.

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


You can also attach a vector store to Threads or Assistants after they're created by updating them with the right `tool_resources`.

#### Ensuring vector store readiness before creating runs

We highly recommend that you ensure all files in a `vector_store` are fully processed before you create a run. This will ensure that all the data in your `vector_store` is searchable. You can check for `vector_store` readiness by using the polling helpers in our SDKs, or by manually polling the `vector_store` object to ensure the [`status`](https://developers.openai.com/api/reference/resources/vector_stores#vector-stores/object-status) is `completed`.

As a fallback, we've built a **60 second maximum wait** in the Run object when the **thread’s** vector store contains files that are still being processed. This is to ensure that any files your users upload in a thread a fully searchable before the run proceeds. This fallback wait _does not_ apply to the assistant's vector store.

#### Customizing File Search settings

You can customize how the `file_search` tool chunks your data and how many chunks it returns to the model context.

**Chunking configuration**

By default, `max_chunk_size_tokens` is set to `800` and `chunk_overlap_tokens` is set to `400`, meaning every file is indexed by being split up into 800-token chunks, with 400-token overlap between consecutive chunks.

You can adjust this by setting [`chunking_strategy`](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create#vector-stores-files-createfile-chunking_strategy) when adding files to the vector store. There are certain limitations to `chunking_strategy`:

- `max_chunk_size_tokens` must be between 100 and 4096 inclusive.
- `chunk_overlap_tokens` must be non-negative and should not exceed `max_chunk_size_tokens / 2`.

**Number of chunks**

By default, the `file_search` tool outputs up to 20 chunks for `gpt-4*` and o-series models and up to 5 chunks for `gpt-3.5-turbo`. You can adjust this by setting [`file_search.max_num_results`](https://developers.openai.com/api/reference/resources/beta/subresources/assistants/methods/create#assistants-createassistant-tools) in the tool when creating the assistant or the run.

Note that the `file_search` tool may output fewer than this number for a myriad of reasons:

- The total number of chunks is fewer than `max_num_results`.
- The total token size of all the retrieved chunks exceeds the token "budget" assigned to the `file_search` tool. The `file_search` tool currently has a token budget of:
  - 4,000 tokens for `gpt-3.5-turbo`
  - 16,000 tokens for `gpt-4*` models
  - 16,000 tokens for o-series models

#### Improve file search result relevance with chunk ranking

By default, the file search tool will return all search results to the model that it thinks have any level of relevance when generating a response. However, if responses are generated using content that has low relevance, it can lead to lower quality responses. You can adjust this behavior by both inspecting the file search results that are returned when generating responses, and then tuning the behavior of the file search tool's ranker to change how relevant results must be before they are used to generate a response.

**Inspecting file search chunks**

The first step in improving the quality of your file search results is inspecting the current behavior of your assistant. Most often, this will involve investigating responses from your assistant that are not not performing well. You can get [granular information about a past run step](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/subresources/steps/methods/retrieve) using the REST API, specifically using the `include` query parameter to get the file chunks that are being used to generate results.

Include file search results in response when creating a run

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


You can then log and inspect the search results used during the run step, and determine whether or not they are consistently relevant to the responses your assistant should generate.

**Configure ranking options**

If you have determined that your file search results are not sufficiently relevant to generate high quality responses, you can adjust the settings of the result ranker used to choose which search results should be used to generate responses. You can adjust this setting [`file_search.ranking_options`](https://developers.openai.com/api/reference/resources/beta/subresources/assistants/methods/create#assistants-createassistant-tools) in the tool when **creating the assistant** or **creating the run**.

The settings you can configure are:

- `ranker` - Which ranker to use in determining which chunks to use. The available values are `auto`, which uses the latest available ranker, and `default_2024_08_21`.
- `score_threshold` - a ranking between 0.0 and 1.0, with 1.0 being the highest ranking. A higher number will constrain the file chunks used to generate a result to only chunks with a higher possible relevance, at the cost of potentially leaving out relevant chunks.
- `hybrid_search.embedding_weight` (also referred to as `rrf_embedding_weight`) - determines how much weight to give to semantic similarity when combining dense (embedding) and sparse (text) rankings with [reciprocal rank fusion](https://en.wikipedia.org/wiki/Reciprocal_rank_fusion). Increase this weight to favor chunks that are close in embedding space.
- `hybrid_search.text_weight` (also referred to as `rrf_text_weight`) - determines how much weight to give to keyword/text matching when hybrid search is enabled. Increase this weight to favor chunks that share exact terms with the query.

At least one of `hybrid_search.embedding_weight` or `hybrid_search.text_weight` must be greater than zero when hybrid search is configured.

#### Managing costs with expiration policies

The `file_search` tool uses the `vector_stores` object as its resource and you will be billed based on the [size](https://developers.openai.com/api/reference/resources/vector_stores#vector-stores/object-bytes) of the `vector_store` objects created. The size of the vector store object is the sum of all the parsed chunks from your files and their corresponding embeddings.

You first GB is free and beyond that, usage is billed at $0.10/GB/day of vector storage. There are no other costs associated with vector store operations.

In order to help you manage the costs associated with these `vector_store` objects, we have added support for expiration policies in the `vector_store` object. You can set these policies when creating or updating the `vector_store` object.

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


**Thread vector stores have default expiration policies**

Vector stores created using thread helpers (like [`tool_resources.file_search.vector_stores`](https://developers.openai.com/api/reference/resources/beta/subresources/threads/methods/create#threads-createthread-tool_resources) in Threads or [message.attachments](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-attachments) in Messages) have a default expiration policy of 7 days after they were last active (defined as the last time the vector store was part of a run).

When a vector store expires, runs on that thread will fail. To fix this, you can simply recreate a new `vector_store` with the same files and reattach it to the thread.

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


## Supported files

_For `text/` MIME types, the encoding must be one of `utf-8`, `utf-16`, or `ascii`._

{/* Keep this table in sync with RETRIEVAL_SUPPORTED_EXTENSIONS in the agentapi service */}

| File format | MIME type                                                                   |
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