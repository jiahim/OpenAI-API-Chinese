# File search

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

File search is a tool available in the [Responses API](https://developers.openai.com/api/reference/resources/responses).
It enables models to retrieve information in a knowledge base of previously uploaded files through semantic and keyword search.
By creating vector stores and uploading files to them, you can augment the models' inherent knowledge by giving them access to these knowledge bases or `vector_stores`.

To learn more about how vector stores and semantic search work, refer to our
  [retrieval guide](https://developers.openai.com/api/docs/guides/retrieval).

This is a hosted tool managed by OpenAI, meaning you don't have to implement code on your end to handle its execution.
When the model decides to use it, it will automatically call the tool, retrieve information from your files, and return an output.

## How to use

Prior to using file search with the Responses API, you need to have set up a knowledge base in a vector store and uploaded files to it.



### Create a vector store and upload a file


Follow these steps to create a vector store and upload a file to it. You can use [this example file](https://cdn.openai.com/API/docs/deep_research_blog.pdf) or upload your own.

#### Upload the file to the File API

Upload a file

```javascript
import fs from "fs";
import OpenAI from "openai";
const openai = new OpenAI();

async function createFile(filePath) {
  let result;
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    // Download the file content from the URL
    const res = await fetch(filePath);
    const buffer = await res.arrayBuffer();
    const urlParts = filePath.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const file = new File([buffer], fileName);
    result = await openai.files.create({
      file: file,
      purpose: "assistants",
    });
  } else {
    // Handle local file path
    const fileContent = fs.createReadStream(filePath);
    result = await openai.files.create({
      file: fileContent,
      purpose: "assistants",
    });
  }
  return result.id;
}

// Replace with your own file path or URL
const fileId = await createFile(
  "https://cdn.openai.com/API/docs/deep_research_blog.pdf"
);

console.log(fileId);
```

```python
from io import BytesIO

import requests
from openai import OpenAI

client = OpenAI()


def create_file(client, file_path):
    if file_path.startswith(("http://", "https://")):
        response = requests.get(file_path, timeout=30)
        response.raise_for_status()
        file_content = BytesIO(response.content)
        file_name = file_path.rsplit("/", 1)[-1]
        result = client.files.create(
            file=(file_name, file_content),
            purpose="assistants",
        )
    else:
        with open(file_path, "rb") as file_content:
            result = client.files.create(
                file=file_content,
                purpose="assistants",
            )
    return result.id


file_id = create_file(
    client,
    "https://cdn.openai.com/API/docs/deep_research_blog.pdf",
)
print(file_id)
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
	file, err := os.Open("customer_policies.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	result, err := client.Files.New(context.Background(), openai.FileNewParams{
		File:    openai.File(file, "customer_policies.txt", "text/plain"),
		Purpose: openai.FilePurposeAssistants,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(result.ID)
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
                .purpose(FilePurpose.USER_DATA)
                .build());

System.out.println(file.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = Pathname("customer_policies.txt")
uploaded = client.files.create(file: file, purpose: :user_data)
puts(uploaded.id)
```


#### Create a vector store

Create a vector store

```javascript
const vectorStore = await openai.vectorStores.create({
  name: "knowledge_base",
});
console.log(vectorStore.id);
```

```python
vector_store = client.vector_stores.create(name="knowledge_base")
print(vector_store.id)
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
	vectorStore, err := client.VectorStores.New(context.Background(), openai.VectorStoreNewParams{
		Name: openai.String("knowledge_base"),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(vectorStore.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.VectorStoreCreateParams;

var store =
    client
        .vectorStores()
        .create(VectorStoreCreateParams.builder().name("Product docs").build());

System.out.println(store.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.create(name: "Product docs")
puts(store.id)
```


#### Add the file to the vector store

Add a file to a vector store

```javascript
await openai.vectorStores.files.create(vectorStore.id, {
  file_id: fileId,
});
```

```python
result = client.vector_stores.files.create(
    vector_store_id=vector_store.id,
    file_id=file_id,
)
print(result)
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
	file, err := client.VectorStores.Files.New(context.Background(), "<vector_store_id>", openai.VectorStoreFileNewParams{
		FileID: "file_abc123",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(file.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.files.FileCreateParams;

String vectorStoreId = "<vector_store_id>";

String fileId = "file_abc123";

var file =
    client
        .vectorStores()
        .files()
        .create(vectorStoreId, FileCreateParams.builder().fileId(fileId).build());

System.out.println(file.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
file = client.vector_stores.files.create("<vector_store_id>", file_id: "file_abc123")
puts(file.id)
```


#### Check status

Run this code until the file is ready to be used (i.e., when the status is `completed`).

Check status

```javascript
const result = await openai.vectorStores.files.list(vectorStore.id);
console.log(result);
```

```python
result = client.vector_stores.files.list(vector_store_id=vector_store.id)
print(result)
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
	files, err := client.VectorStores.Files.List(context.Background(), "<vector_store_id>", openai.VectorStoreFileListParams{})
	if err != nil {
		panic(err)
	}
	fmt.Println(files.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String vectorStoreId = "<vector_store_id>";

System.out.println(client.vectorStores().files().list(vectorStoreId).data());
```

```ruby
require "openai"

client = OpenAI::Client.new
files = client.vector_stores.files.list("<vector_store_id>")
puts(files.data&.map(&:status))
```






Once your knowledge base is set up, you can include the `file_search` tool in the list of tools available to the model, along with the list of vector stores in which to search.

File search tool

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"],
    },
  ],
});
console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="What is deep research by OpenAI?",
    tools=[{"type": "file_search", "vector_store_ids": ["<vector_store_id>"]}],
)
print(response)
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
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is deep research by OpenAI?")},
		Tools: []responses.ToolUnionParam{responses.ToolParamOfFileSearch([]string{"<vector_store_id>"})},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;

String vectorStoreId = "<vector_store_id>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is deep research by OpenAI?")
        .addFileSearchTool(List.of(vectorStoreId))
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
string vectorStoreId = "<vector_store_id>";
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(
    ResponseTool.CreateFileSearchTool([vectorStoreId])
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What is deep research by OpenAI?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"]
    }
  ]
)

puts(response)
```


When this tool is called by the model, you will receive a response with multiple outputs:

1. A `file_search_call` output item, which contains the id of the file search call.
2. A `message` output item, which contains the response from the model, along with the file citations.

File search response

```json
{
  "output": [
    {
      "type": "file_search_call",
      "id": "fs_67c09ccea8c48191ade9367e3ba71515",
      "status": "completed",
      "queries": ["What is deep research?"],
      "search_results": null
    },
    {
      "id": "msg_67c09cd3091c819185af2be5d13d87de",
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Deep research is a sophisticated capability that allows for extensive inquiry and synthesis of information across various domains. It is designed to conduct multi-step research tasks, gather data from multiple online sources, and provide comprehensive reports similar to what a research analyst would produce. This functionality is particularly useful in fields requiring detailed and accurate information...",
          "annotations": [
            {
              "type": "file_citation",
              "index": 992,
              "file_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
              "filename": "deep_research_blog.pdf"
            },
            {
              "type": "file_citation",
              "index": 992,
              "file_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
              "filename": "deep_research_blog.pdf"
            },
            {
              "type": "file_citation",
              "index": 1176,
              "file_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
              "filename": "deep_research_blog.pdf"
            },
            {
              "type": "file_citation",
              "index": 1176,
              "file_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
              "filename": "deep_research_blog.pdf"
            }
          ]
        }
      ]
    }
  ]
}
```


## Retrieval customization

### Limiting the number of results

Using the file search tool with the Responses API, you can customize the number of results you want to retrieve from the vector stores. This can help reduce both token usage and latency, but may come at the cost of reduced answer quality.

Limit the number of results

```javascript
const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"],
      // highlight-start
      max_num_results: 2,
      // highlight-end
    },
  ],
});
console.log(response);
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    input="What is deep research by OpenAI?",
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": ["<vector_store_id>"],
            # highlight-start
            "max_num_results": 2,
            # highlight-end
        }
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
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolParamOfFileSearch([]string{"<vector_store_id>"})
	tool.OfFileSearch.MaxNumResults = openai.Int(2)
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is deep research by OpenAI?")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.FileSearchTool;
import com.openai.models.responses.ResponseCreateParams;

String vectorStoreId = "<vector_store_id>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is deep research by OpenAI?")
        .addTool(
            FileSearchTool.builder().addVectorStoreId(vectorStoreId).maxNumResults(2).build())
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
string vectorStoreId = "<vector_store_id>";
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(
    ResponseTool.CreateFileSearchTool([vectorStoreId], maxResultCount: 2)
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What is deep research by OpenAI?")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: :file_search,
      vector_store_ids: ["<vector_store_id>"],
      max_num_results: 2
    }
  ]
)

puts(response)
```


### Include search results in the response

While you can see annotations (references to files) in the output text, the file search call will not return search results by default.

To include search results in the response, you can use the `include` parameter when creating the response.

Include search results

```javascript
const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"],
    },
  ],
  // highlight-start
  include: ["file_search_call.results"],
  // highlight-end
});
console.log(response);
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    input="What is deep research by OpenAI?",
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": ["<vector_store_id>"],
        }
    ],
    # highlight-start
    include=["file_search_call.results"],
    # highlight-end
)
print(response)
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
		Model:   "gpt-6-astra",
		Input:   responses.ResponseNewParamsInputUnion{OfString: openai.String("What is deep research by OpenAI?")},
		Tools:   []responses.ToolUnionParam{responses.ToolParamOfFileSearch([]string{"<vector_store_id>"})},
		Include: []responses.ResponseIncludable{responses.ResponseIncludableFileSearchCallResults},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseIncludable;
import java.util.List;

String vectorStoreId = "<vector_store_id>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is deep research by OpenAI?")
        .addInclude(ResponseIncludable.of("file_search_call.results"))
        .addFileSearchTool(List.of(vectorStoreId))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.fileSearchCall().stream())
    .flatMap(call -> call.results().stream())
    .flatMap(List::stream)
    .forEach(System.out::println);
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string vectorStoreId = "<vector_store_id>";
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(ResponseTool.CreateFileSearchTool([vectorStoreId]));
options.IncludedProperties.Add(IncludedResponseProperty.FileSearchCallResults);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What is deep research by OpenAI?")
);

ResponseResult response = await client.CreateResponseAsync(options);
foreach (FileSearchCallResponseItem search in response.OutputItems.OfType<FileSearchCallResponseItem>())
{
    foreach (FileSearchCallResult result in search.Results)
    {
        Console.WriteLine($"{result.Filename}: {result.Text}");
    }
}
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  include: ["file_search_call.results"],
  tools: [
    {type: :file_search, vector_store_ids: ["<vector_store_id>"]}
  ]
)

puts(response)
```


### Metadata filtering

You can filter the search results based on the metadata of the files. For more details, refer to our [retrieval guide](https://developers.openai.com/api/docs/guides/retrieval), which covers:

- How to [set attributes on vector store files](https://developers.openai.com/api/docs/guides/retrieval#attributes)
- How to [define filters](https://developers.openai.com/api/docs/guides/retrieval#attribute-filtering)

Metadata filtering

```javascript
const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"],
      // highlight-start
      filters: {
        type: "in",
        key: "category",
        value: ["blog", "announcement"],
      },
      // highlight-end
    },
  ],
});
console.log(response);
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    input="What is deep research by OpenAI?",
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": ["<vector_store_id>"],
            # highlight-start
            "filters": {
                "type": "in",
                "key": "category",
                "value": ["blog", "announcement"],
            },
            # highlight-end
        }
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
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolParamOfFileSearch([]string{"<vector_store_id>"})
	tool.OfFileSearch.Filters = responses.FileSearchToolFiltersUnionParam{
		OfComparisonFilter: &shared.ComparisonFilterParam{
			Type: shared.ComparisonFilterTypeIn,
			Key:  "category",
			Value: shared.ComparisonFilterValueUnionParam{OfComparisonFilterValueArray: []shared.ComparisonFilterValueArrayItemUnionParam{
				{OfString: openai.String("blog")},
				{OfString: openai.String("announcement")},
			}},
		},
	}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is deep research by OpenAI?")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ComparisonFilter;
import com.openai.models.responses.FileSearchTool;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;

String vectorStoreId = "<vector_store_id>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is deep research by OpenAI?")
        .addTool(
            FileSearchTool.builder()
                .addVectorStoreId(vectorStoreId)
                .filters(
                    ComparisonFilter.builder()
                        .type(ComparisonFilter.Type.IN)
                        .key("category")
                        .valueOfComparisonFilterValueItems(
                            List.of(
                                ComparisonFilter.Value.ComparisonFilterValueItem.ofString(
                                    "blog"),
                                ComparisonFilter.Value.ComparisonFilterValueItem.ofString(
                                    "announcement")))
                        .build())
                .build())
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
string vectorStoreId = "<vector_store_id>";
ResponsesClient client = new(key);

BinaryData filters = BinaryData.FromString(
    """
    { "type": "in", "key": "category", "value": ["blog", "announcement"] }
    """
);
CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(
    ResponseTool.CreateFileSearchTool([vectorStoreId], filters: filters)
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What is deep research by OpenAI?")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: :file_search,
      vector_store_ids: ["<vector_store_id>"],
      filters: {
        type: :in,
        key: "category",
        value: ["blog", "announcement"]
      }
    }
  ]
)

puts(response)
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

## Usage notes

<table>
<tbody>

<tr>
  <th>API Availability</th>
  <th>Rate limits</th>
  <th>Notes</th>
</tr>

<tr>
<td>


    [Responses](https://developers.openai.com/api/reference/resources/responses)




    [Chat Completions](https://developers.openai.com/api/reference/resources/chat)




    [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants)


</td>
<td style={{"maxWidth": "150px"}}>
**Tier 1**

100 RPM

**Tier 2 and 3**

500 RPM

**Tier 4 and 5**

1000 RPM

</td>
<td style={{"maxWidth": "150px"}}>
[Pricing](https://developers.openai.com/api/docs/pricing#built-in-tools) 

[ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data)
</td>
</tr>

</tbody>
</table>