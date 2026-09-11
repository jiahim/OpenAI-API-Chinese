# 检索

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

该 **检索 API** 允许你执行 [**语义搜索**](#semantic-search) 来检索你的数据，这是一种即使在关键词匹配很少或没有匹配的情况下，也能返回语义相似结果的技术。检索本身已经很有用，但与我们的模型结合以综合生成回答时尤其强大。

![检索示意图](https://cdn.openai.com/API/docs/images/retrieval-depiction.png)

检索 API 由 [**向量存储**](#vector-stores)，驱动，它充当你数据的索引。本指南将介绍如何执行语义搜索，并详细说明向量存储的相关细节。

## 快速入门

<li className={s.StandaloneLi} data-number={1}>
  **Create vector store** and upload files.
</li>

使用文件创建向量存储

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const vector_store = await client.vectorStores.create({
  // Create vector store
  name: "Support FAQ",
});

await client.vectorStores.files.uploadAndPoll(
  vector_store.id,
  // Upload file
  fs.createReadStream("customer_policies.txt")
);
```

```python
from openai import OpenAI

client = OpenAI()

vector_store = client.vector_stores.create(        # Create vector store
    name="Support FAQ",
)

client.vector_stores.files.upload_and_poll(        # Upload file
    vector_store_id=vector_store.id,
    file=open("customer_policies.txt", "rb")
)
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
	client := openai.NewClient()
	vectorStore, err := client.VectorStores.New(context.Background(), openai.VectorStoreNewParams{Name: openai.String("Support FAQ")})
	if err != nil {
		panic(err)
	}
	file, err := os.Open("customer_policies.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	_, err = client.VectorStores.Files.UploadAndPoll(context.Background(), vectorStore.ID, openai.FileNewParams{
		File:    openai.File(file, "customer_policies.txt", "text/plain"),
		Purpose: openai.FilePurposeAssistants,
	}, 1000)
	if err != nil {
		panic(err)
	}
	fmt.Println(vectorStore.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import com.openai.models.vectorstores.VectorStoreCreateParams;
import com.openai.models.vectorstores.files.FileRetrieveParams;
import com.openai.models.vectorstores.files.VectorStoreFile;
import java.nio.file.Path;

var store =
    client.vectorStores().create(VectorStoreCreateParams.builder().name("Support FAQ").build());
var uploaded =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.ASSISTANTS)
                .build());
var file =
    client
        .vectorStores()
        .files()
        .create(
            store.id(),
            com.openai.models.vectorstores.files.FileCreateParams.builder()
                .fileId(uploaded.id())
                .build());
while (file.status().equals(VectorStoreFile.Status.IN_PROGRESS)) {
  Thread.sleep(1000);
  file =
      client
          .vectorStores()
          .files()
          .retrieve(file.id(), FileRetrieveParams.builder().vectorStoreId(store.id()).build());
}
System.out.println(store.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
store = client.vector_stores.create(name: "Support FAQ")
source = Pathname("customer_policies.txt")
uploaded = client.files.create(file: source, purpose: :assistants)
file = client.vector_stores.files.create(store.id, file_id: uploaded.id)
until [:completed, :failed, :cancelled].include?(file.status)
  sleep(1)
  file = client.vector_stores.files.retrieve(file.id, vector_store_id: store.id)
end

puts(store.id)
```


<li className={s.StandaloneLi} data-number={2}>
  **Send search query** to get relevant results.
</li>

搜索查询

```javascript
const userQuery = "What is the return policy?";

const results = await client.vectorStores.search(vector_store.id, {
  query: userQuery,
});
```

```python
user_query = "What is the return policy?"

results = client.vector_stores.search(
    vector_store_id=vector_store.id,
    query=user_query,
)
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
	results, err := client.VectorStores.Search(context.Background(), "vs_123", openai.VectorStoreSearchParams{
		Query: openai.VectorStoreSearchParamsQueryUnion{OfString: openai.String("What is the return policy?")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(results.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.VectorStoreSearchParams;

String vectorStoreId = "vs_123";

var results =
    client
        .vectorStores()
        .search(
            vectorStoreId,
            VectorStoreSearchParams.builder().query("What is the return policy?").build());

System.out.println(results.data());
```

```ruby
require "openai"

client = OpenAI::Client.new
results = client.vector_stores.search("vs_123", query: "What is the return policy?")
puts(results.data&.first&.content)
```


要了解如何将结果与我们的模型一起使用，请查看 [合成响应
  响应](#synthesizing-responses) 部分。

## 语义搜索

**语义搜索** 是一种利用 [向量嵌入](https://developers.openai.com/api/docs/guides/embeddings) 来呈现语义相关结果的技术。重要的是，它能包含那些几乎没有或完全没有共享关键词的结果，而经典搜索技术可能会遗漏这些结果。

例如，我们来看一下 `"When did we go to the moon?"`:

| Text                                              | Keyword Similarity | Semantic Similarity |
| ------------------------------------------------- | ------------------ | ------------------- |
| The first lunar landing occurred in July of 1969. | 0%                 | 65%                 |
| The first man on the moon was Neil Armstrong.     | 27%                | 43%                 |
| When I ate the moon cake, it was delicious.       | 40%                | 28%                 |

_（关键词相似度使用 [交并比](https://en.wikipedia.org/wiki/Jaccard_index)；语义相似度使用 [余弦相似度](https://en.wikipedia.org/wiki/Cosine_similarity) ，搭配 `text-embedding-3-small`.)_

请注意，最相关的结果中并不包含搜索查询里的任何词。这种灵活性使得语义搜索成为查询任意规模知识库的强大技术。

语义搜索由 [向量存储](#vector-stores)，提供支持，我们将在本指南后面详细介绍。本节将聚焦于语义搜索的机制。

### 执行语义搜索

你可以使用 `search` 函数并以 `query` 的形式用自然语言查询向量存储。结果将返回一个列表，其中包含相关文本片段、相似度分数以及来源文件。

搜索查询

```javascript
const results = await client.vectorStores.search(vector_store.id, {
  query: "How many woodchucks are allowed per passenger?",
});
```

```python
results = client.vector_stores.search(
    vector_store_id=vector_store.id,
    query="How many woodchucks are allowed per passenger?",
)
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
	results, err := client.VectorStores.Search(context.Background(), "vs_123", openai.VectorStoreSearchParams{
		Query: openai.VectorStoreSearchParamsQueryUnion{OfString: openai.String("How many woodchucks are allowed per passenger?")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(results.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.VectorStoreSearchParams;

String vectorStoreId = "vs_123";

var results =
    client
        .vectorStores()
        .search(
            vectorStoreId,
            VectorStoreSearchParams.builder()
                .query("How many woodchucks are allowed per passenger?")
                .build());

System.out.println(results.data());
```

```ruby
require "openai"

client = OpenAI::Client.new
results = client.vector_stores.search(
  "vs_123",
  query: "How many woodchucks are allowed per passenger?"
)
puts(results.data&.first&.content)
```


结果

```json
{
  "object": "vector_store.search_results.page",
  "search_query": "How many woodchucks are allowed per passenger?",
  "data": [
    {
      "file_id": "file-12345",
      "filename": "woodchuck_policy.txt",
      "score": 0.85,
      "attributes": {
        "region": "North America",
        "author": "Wildlife Department"
      },
      "content": [
        {
          "type": "text",
          "text": "According to the latest regulations, each passenger is allowed to carry up to two woodchucks."
        },
        {
          "type": "text",
          "text": "Ensure that the woodchucks are properly contained during transport."
        }
      ]
    },
    {
      "file_id": "file-67890",
      "filename": "transport_guidelines.txt",
      "score": 0.75,
      "attributes": {
        "region": "North America",
        "author": "Transport Authority"
      },
      "content": [
        {
          "type": "text",
          "text": "Passengers must adhere to the guidelines set forth by the Transport Authority regarding the transport of woodchucks."
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```


默认情况下，一个响应最多包含 10 条结果，但你可以通过 `max_num_results` 参数将其设置为最多 50 条。

### Query rewriting

某些查询风格能够带来更好的效果，因此我们提供了一个设置，可自动改写你的查询以获得最佳性能。启用此功能的方法是将 `rewrite_query=true` 在执行 `search`.

改写后的查询将可在结果的 `search_query` 字段中查看。

| **Original**                                                          | **Rewritten**                              |
| --------------------------------------------------------------------- | ------------------------------------------ |
| 我想知道主办公楼的高度。              | primary office building height             |
| 运输危险品的安全法规有哪些？ | safety regulations for hazardous materials |
| 我该如何就服务问题提交投诉？                      | service complaint filing process           |

### 属性过滤

属性筛选通过应用条件（例如将搜索限制在特定日期范围内）来缩小结果范围。你可以在 `attribute_filter` 中根据文件属性定位目标文件，然后再执行语义搜索。

使用 **比较筛选器** 将文件中特定的 `key` 与给定的 `attributes` 进行比较，以及使用 `value`，并使用 **复合筛选器** 使用以下逻辑运算符组合多个筛选器 `and` 与 `or`.

比较筛选器

```json
{
  "type": "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "nin",  // comparison operators
  "key": "attributes_key",                           // attributes key
  "value": "target_value"                             // value to compare against
}
```


复合筛选器

```json
{
  "type": "and" | "or",                                // logical operators
  "filters": [...]
}
```


下面是一些筛选器示例。



区域

    Filter for a region

```json
{
  "type": "eq",
  "key": "region",
  "value": "us"
}
```

  

  

    
日期范围

    Filter for a date range

```json
{
  "type": "and",
  "filters": [
    {
      "type": "gte",
      "key": "date",
      "value": 1704067200  // unix timestamp for 2024-01-01
    },
    {
      "type": "lte",
      "key": "date",
      "value": 1710892800  // unix timestamp for 2024-03-20
    }
  ]
}
```

  

  

    
文件名

    Filter to match any of a set of filenames

```json
{
  "type": "in",
  "property": "filename",
  "value": ["example.txt", "example2.txt"]
}
```

  

  

    
排除文件名

    Filter to exclude drafts by filename

```json
{
  "type": "nin",
  "property": "filename",
  "value": ["draft.txt", "internal_notes.md"]
}
```

  

  

    
复杂

    Filter for top secret projects with certain names in english

```json
{
  "type": "or",
  "filters": [
    {
      "type": "and",
      "filters": [
        {
          "type": "or",
          "filters": [
            {
              "type": "eq",
              "key": "project_code",
              "value": "X123"
            },
            {
              "type": "eq",
              "key": "project_code",
              "value": "X999"
            }
          ]
        },
        {
          "type": "eq",
          "key": "confidentiality",
          "value": "top_secret"
        }
      ]
    },
    {
      "type": "eq",
      "key": "language",
      "value": "en"
    }
  ]
}
```



### Ranking

如果你发现自己的文件搜索结果不够相关，可以调整 `ranking_options` 以提升响应质量。这包括指定一个 `ranker`，例如 `auto` 或 `default-2024-08-21`，并设置一个介于 0.0 到 1.0 之间的 `score_threshold` 。较高的 `score_threshold` 会将结果限制在更相关的片段，尽管这可能会排除一些潜在有用的片段。当提供 `ranking_options.hybrid_search` 时，你还可以调节 `hybrid_search.embedding_weight` (`rrf_embedding_weight`）和 `hybrid_search.text_weight` (`rrf_text_weight`），以控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间的平衡。增大前者可强调语义相似度，增大后者可强调文本重叠度，并确保至少有一个权重大于零。

## 向量存储

向量存储是为检索 API 提供语义搜索能力的容器，以及 [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search) 工具。当你向向量存储添加文件时，它会被自动切分、嵌入并建立索引。

向量存储包含 `vector_store_file` 对象，这些对象由 `file` 对象提供支持。

| 对象类型 | 说明                                                                                                                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file`                                                                     | 表示通过 [Files API](https://developers.openai.com/api/reference/resources/files)。上传的内容。常与向量存储一起使用，也可用于微调及其他用例。                      |
| `vector_store`                                                             | 可搜索文件的容器。                                                                                                                                                       |
| `vector_store.file`                                                        | 用于专门表示已分块并嵌入的 `file` 的包装类型，并已关联某个 `vector_store`. <br />包含 `attributes` 映射以用于过滤。 |

### 定价

将根据你在所有向量存储中使用的总存储量计费，具体取决于已解析分块及其对应嵌入的大小。

| 存储                        | 费用         |
| ------------------------------ | ------------ |
| 最高 1 GB（跨所有存储库） | 免费         |
| 超过 1 GB                    | $0.10/GB/天 |

请参阅 [过期策略](#expiration-policies) 了解降低成本的相关选项。

### 向量存储操作



创建

    Create vector store

```javascript
await client.vectorStores.create({
  name: "Support FAQ",
  file_ids: ["file_123"],
});
```

```python
client.vector_stores.create(
    name="Support FAQ",
    file_ids=["file_123"]
)
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
		Name:    openai.String("Support FAQ"),
		FileIDs: []string{"file_123"},
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

String fileId = "file_123";

var store =
    client
        .vectorStores()
        .create(
            VectorStoreCreateParams.builder().name("Support FAQ").addFileId(fileId).build());

System.out.println(store.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.create(
  name: "Support FAQ",
  file_ids: ["file_123"]
)
puts(store.id)
```

  

  

    
检索

    Retrieve vector store

```javascript
await client.vectorStores.retrieve("vs_123");
```

```python
client.vector_stores.retrieve(
    vector_store_id="vs_123"
)
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
	vectorStore, err := client.VectorStores.Get(context.Background(), "vs_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(vectorStore.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String vectorStoreId = "vs_123";

System.out.println(client.vectorStores().retrieve(vectorStoreId).id());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.retrieve("vs_123")
puts(store.id)
```

  

  

    
更新

    Update vector store

```javascript
await client.vectorStores.update("vs_123", {
  name: "Support FAQ Updated",
});
```

```python
client.vector_stores.update(
    vector_store_id="vs_123",
    name="Support FAQ Updated"
)
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
	vectorStore, err := client.VectorStores.Update(context.Background(), "vs_123", openai.VectorStoreUpdateParams{
		Name: openai.String("Support FAQ Updated"),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(vectorStore.Name)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.VectorStoreUpdateParams;

String vectorStoreId = "vs_123";

var store =
    client
        .vectorStores()
        .update(
            vectorStoreId,
            VectorStoreUpdateParams.builder().name("Updated knowledge base").build());

System.out.println(store.name());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.update("vs_123", name: "Updated knowledge base")
puts(store.name)
```

  

  

    
删除

    Delete vector store

```javascript
await client.vectorStores.delete("vs_123");
```

```python
client.vector_stores.delete(
    vector_store_id="vs_123"
)
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
	deleted, err := client.VectorStores.Delete(context.Background(), "vs_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(deleted.Deleted)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String vectorStoreId = "vs_123";

System.out.println(client.vectorStores().delete(vectorStoreId).deleted());
```

```ruby
require "openai"

client = OpenAI::Client.new
deleted = client.vector_stores.delete("vs_123")
puts(deleted.deleted)
```

  

  

    
列出

    List vector stores

```javascript
await client.vectorStores.list();
```

```python
client.vector_stores.list()
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
	vectorStores, err := client.VectorStores.List(context.Background(), openai.VectorStoreListParams{})
	if err != nil {
		panic(err)
	}
	fmt.Println(vectorStores.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

System.out.println(client.vectorStores().list().data());
```

```ruby
require "openai"

client = OpenAI::Client.new
stores = client.vector_stores.list(limit: 10)
puts((stores.data || []).length)
```



### 向量存储文件操作

某些操作，例如 `create` 用于 `vector_store.file`，是异步的，可能需要一些时间才能完成——可以使用我们的辅助函数，例如 `create_and_poll` 来阻塞等待其完成。否则，你可以检查状态。从向量存储中删除文件最终是一致的，搜索结果在短时间内仍可能包含来自已删除文件的内容。

添加文件按每个向量存储 ID 进行速率限制。针对 [`/vector_stores/{vector_store_id}/files`](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create) 与 [`/vector_stores/{vector_store_id}/file_batches`](https://developers.openai.com/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 共享每个向量存储每分钟 300 次请求的限制。



创建

    Create vector store file

```javascript
await client.vectorStores.files.createAndPoll("vs_123", {
  file_id: "file_123",
});
```

```python
client.vector_stores.files.create_and_poll(
    vector_store_id="vs_123",
    file_id="file_123"
)
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
	file, err := client.VectorStores.Files.NewAndPoll(context.Background(), "vs_123", openai.VectorStoreFileNewParams{
		FileID: "file_123",
	}, 1000)
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

String vectorStoreId = "vs_123";

String fileId = "file_123";

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
file = client.vector_stores.files.create("vs_123", file_id: "file_123")
puts(file.id)
```

  

  

    
Upload

    Upload vector store file

```javascript
await client.vectorStores.files.uploadAndPoll(
  "vs_123",
  fs.createReadStream("customer_policies.txt")
);
```

```python
client.vector_stores.files.upload_and_poll(
    vector_store_id="vs_123",
    file=open("customer_policies.txt", "rb")
)
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
	client := openai.NewClient()
	file, err := os.Open("customer_policies.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	result, err := client.VectorStores.Files.UploadAndPoll(context.Background(), "vs_123", openai.FileNewParams{
		File:    openai.File(file, "customer_policies.txt", "text/plain"),
		Purpose: openai.FilePurposeAssistants,
	}, 1000)
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
import com.openai.models.vectorstores.files.FileRetrieveParams;
import com.openai.models.vectorstores.files.VectorStoreFile;
import java.nio.file.Path;

String vectorStoreId = "vs_123";
var uploaded =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.ASSISTANTS)
                .build());
var file =
    client
        .vectorStores()
        .files()
        .create(
            vectorStoreId,
            com.openai.models.vectorstores.files.FileCreateParams.builder()
                .fileId(uploaded.id())
                .build());
while (file.status().equals(VectorStoreFile.Status.IN_PROGRESS)) {
  Thread.sleep(1000);
  file =
      client
          .vectorStores()
          .files()
          .retrieve(
              file.id(), FileRetrieveParams.builder().vectorStoreId(vectorStoreId).build());
}
System.out.println(file.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = Pathname("customer_policies.txt")
uploaded = client.files.create(file: file, purpose: :assistants)
vector_store_file = client.vector_stores.files.create(
  "vs_123",
  file_id: uploaded.id
)
until [:completed, :failed, :cancelled].include?(vector_store_file.status)
  sleep(1)
  vector_store_file = client.vector_stores.files.retrieve(
    vector_store_file.id,
    vector_store_id: "vs_123"
  )
end
puts(vector_store_file.id)
```

  

  

    
检索

    Retrieve vector store file

```javascript
await client.vectorStores.files.retrieve("file_123", {
  vector_store_id: "vs_123",
});
```

```python
client.vector_stores.files.retrieve(
    vector_store_id="vs_123",
    file_id="file_123"
)
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
	file, err := client.VectorStores.Files.Get(context.Background(), "vs_123", "file_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(file.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String fileId = "file_123";

String vectorStoreId = "vs_123";

System.out.println(
    client
        .vectorStores()
        .files()
        .retrieve(
            fileId,
            com.openai.models.vectorstores.files.FileRetrieveParams.builder()
                .vectorStoreId(vectorStoreId)
                .build())
        .id());
```

```ruby
require "openai"

client = OpenAI::Client.new
file = client.vector_stores.files.retrieve("file_123", vector_store_id: "vs_123")
puts(file.id)
```

  

  

    
更新

    Update vector store file

```javascript
await client.vectorStores.files.update("file_123", {
  vector_store_id: "vs_123",
  attributes: { key: "value" },
});
```

```python
client.vector_stores.files.update(
    vector_store_id="vs_123",
    file_id="file_123",
    attributes={"key": "value"}
)
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
	file, err := client.VectorStores.Files.Update(context.Background(), "vs_123", "file_123", openai.VectorStoreFileUpdateParams{
		Attributes: map[string]openai.VectorStoreFileUpdateParamsAttributeUnion{
			"key": {OfString: openai.String("value")},
		},
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
import com.openai.core.JsonValue;
import com.openai.models.vectorstores.files.FileUpdateParams;

String fileId = "file_123";

String vectorStoreId = "vs_123";

var file =
    client
        .vectorStores()
        .files()
        .update(
            fileId,
            FileUpdateParams.builder()
                .vectorStoreId(vectorStoreId)
                .attributes(
                    FileUpdateParams.Attributes.builder()
                        .putAdditionalProperty("category", JsonValue.from("policy"))
                        .build())
                .build());

System.out.println(file.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
file = client.vector_stores.files.update("file_123", vector_store_id: "vs_123", attributes: { category: "policy" })
puts(file.id)
```

  

  

    
删除

    Delete vector store file

```javascript
await client.vectorStores.files.delete("file_123", {
  vector_store_id: "vs_123",
});
```

```python
client.vector_stores.files.delete(
    vector_store_id="vs_123",
    file_id="file_123"
)
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
	deleted, err := client.VectorStores.Files.Delete(context.Background(), "vs_123", "file_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(deleted.Deleted)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String fileId = "file_123";

String vectorStoreId = "vs_123";

System.out.println(
    client
        .vectorStores()
        .files()
        .delete(
            fileId,
            com.openai.models.vectorstores.files.FileDeleteParams.builder()
                .vectorStoreId(vectorStoreId)
                .build())
        .deleted());
```

```ruby
require "openai"

client = OpenAI::Client.new
deleted = client.vector_stores.files.delete("file_123", vector_store_id: "vs_123")
puts(deleted.deleted)
```

  

  

    
列出

    List vector store files

```javascript
await client.vectorStores.files.list("vs_123");
```

```python
client.vector_stores.files.list(
    vector_store_id="vs_123"
)
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
	files, err := client.VectorStores.Files.List(context.Background(), "vs_123", openai.VectorStoreFileListParams{})
	if err != nil {
		panic(err)
	}
	fmt.Println(files.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String vectorStoreId = "vs_123";

System.out.println(client.vectorStores().files().list(vectorStoreId).data());
```

```ruby
require "openai"

client = OpenAI::Client.new
files = client.vector_stores.files.list("vs_123")
puts((files.data || []).length)
```



### 批量操作



创建

    Batch create operation

```javascript
await client.vectorStores.fileBatches.createAndPoll("vs_123", {
  files: [
    {
      file_id: "file_123",
      attributes: { department: "finance" },
    },
    {
      file_id: "file_456",
      chunking_strategy: {
        type: "static",
        static: {
          max_chunk_size_tokens: 1200,
          chunk_overlap_tokens: 200,
        },
      },
    },
  ],
});
```

```python
client.vector_stores.file_batches.create_and_poll(
    vector_store_id="vs_123",
    files=[
        {
            "file_id": "file_123",
            "attributes": {"department": "finance"}
        },
        {
            "file_id": "file_456",
            "chunking_strategy": {
                "type": "static",
                "max_chunk_size_tokens": 1200,
                "chunk_overlap_tokens": 200
            }
        }
    ]
)
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
	batch, err := client.VectorStores.FileBatches.NewAndPoll(context.Background(), "vs_123", openai.VectorStoreFileBatchNewParams{
		Files: []openai.VectorStoreFileBatchNewParamsFile{
			{
				FileID: "file_123",
				Attributes: map[string]openai.VectorStoreFileBatchNewParamsFileAttributeUnion{
					"department": {OfString: openai.String("finance")},
				},
			},
			{
				FileID: "file_456",
				ChunkingStrategy: openai.FileChunkingStrategyParamUnion{OfStatic: &openai.StaticFileChunkingStrategyObjectParam{
					Static: openai.StaticFileChunkingStrategyParam{MaxChunkSizeTokens: 1200, ChunkOverlapTokens: 200},
				}},
			},
		},
	}, 1000)
	if err != nil {
		panic(err)
	}
	fmt.Println(batch.ID)
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

String vectorStoreId = "vs_123";
String fileId = "file_123";
String fileId2 = "file_456";
var first =
    FileBatchCreateParams.File.builder()
        .fileId(fileId)
        .attributes(
            FileBatchCreateParams.File.Attributes.builder()
                .putAdditionalProperty("department", JsonValue.from("finance"))
                .build())
        .build();
var second =
    FileBatchCreateParams.File.builder()
        .fileId(fileId2)
        .staticChunkingStrategy(
            StaticFileChunkingStrategy.builder()
                .maxChunkSizeTokens(1200)
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
  "vs_123",
  files: [
    {
      file_id: "file_123",
      attributes: { department: "finance" }
    },
    {
      file_id: "file_456",
      chunking_strategy: {
        type: :static,
        max_chunk_size_tokens: 1_200,
        chunk_overlap_tokens: 200
      }
    }
  ]
)
until [:completed, :failed, :cancelled].include?(batch.status)
  sleep(1)
  batch = client.vector_stores.file_batches.retrieve(
    batch.id,
    vector_store_id: "vs_123"
  )
end
puts(batch.status)
```

  

  

    
检索

    Batch retrieve operation

```javascript
await client.vectorStores.fileBatches.retrieve("vsfb_123", {
  vector_store_id: "vs_123",
});
```

```python
client.vector_stores.file_batches.retrieve(
    vector_store_id="vs_123",
    batch_id="vsfb_123"
)
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
	batch, err := client.VectorStores.FileBatches.Get(context.Background(), "vs_123", "vsfb_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(batch.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String fileBatchId = "vsfb_123";

String vectorStoreId = "vs_123";

System.out.println(
    client
        .vectorStores()
        .fileBatches()
        .retrieve(
            fileBatchId,
            com.openai.models.vectorstores.filebatches.FileBatchRetrieveParams.builder()
                .vectorStoreId(vectorStoreId)
                .build())
        .status());
```

```ruby
require "openai"

client = OpenAI::Client.new
batch = client.vector_stores.file_batches.retrieve(
  "vsfb_123",
  vector_store_id: "vs_123"
)
puts(batch.status)
```

  

  

    
取消

    Batch cancel operation

```javascript
await client.vectorStores.fileBatches.cancel("vsfb_123", {
  vector_store_id: "vs_123",
});
```

```python
client.vector_stores.file_batches.cancel(
    vector_store_id="vs_123",
    batch_id="vsfb_123"
)
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
	batch, err := client.VectorStores.FileBatches.Cancel(context.Background(), "vs_123", "vsfb_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(batch.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String fileBatchId = "vsfb_123";

String vectorStoreId = "vs_123";

System.out.println(
    client
        .vectorStores()
        .fileBatches()
        .cancel(
            fileBatchId,
            com.openai.models.vectorstores.filebatches.FileBatchCancelParams.builder()
                .vectorStoreId(vectorStoreId)
                .build())
        .status());
```

```ruby
require "openai"

client = OpenAI::Client.new
batch = client.vector_stores.file_batches.cancel(
  "vsfb_123",
  vector_store_id: "vs_123"
)
puts(batch.status)
```

  

  

    
列出

    List files in a batch

```javascript
await client.vectorStores.fileBatches.listFiles("vsfb_123", {
  vector_store_id: "vs_123",
});
```

```python
client.vector_stores.file_batches.list_files(
    "vsfb_123",
    vector_store_id="vs_123"
)
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
	files, err := client.VectorStores.FileBatches.ListFiles(context.Background(), "vs_123", "vsfb_123", openai.VectorStoreFileBatchListFilesParams{})
	if err != nil {
		panic(err)
	}
	fmt.Println(files.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String fileBatchId = "vsfb_123";

String vectorStoreId = "vs_123";

System.out.println(
    client
        .vectorStores()
        .fileBatches()
        .listFiles(
            fileBatchId,
            com.openai.models.vectorstores.filebatches.FileBatchListFilesParams.builder()
                .vectorStoreId(vectorStoreId)
                .build())
        .data());
```

```ruby
require "openai"

client = OpenAI::Client.new
files = client.vector_stores.file_batches.list_files(
  "vsfb_123",
  vector_store_id: "vs_123"
)
puts((files.data || []).length)
```



在创建批量任务时，你可以提供 `file_ids` ，可选地 `attributes` 和/或 `chunking_strategy`，或使用 `files` 数组传入包含 `file_id` 的对象，以及可选的 `attributes` 与 `chunking_strategy` 针对每个文件。这两种方式互斥，以便你可以清晰地控制是让所有文件共享相同设置，还是需要按文件覆盖设置。

对于向单个向量存储的高吞吐量导入，建议尽可能采用批量创建。批量在单次请求中最多可包含 500 个文件，相比发送多个单文件创建请求，通常能减少争用并改善端到端延迟。

### Attributes

每个 `vector_store.file` 可以关联 `attributes`，这是在执行 [语义搜索](#semantic-search) ，搭配 [属性过滤](#attribute-filtering)。时可引用的字典。该字典最多包含 16 个键，每个键的长度上限为 256 个字符。

使用属性创建向量存储文件

```javascript
await client.vectorStores.files.create("<vector_store_id>", {
  file_id: "file_123",
  attributes: {
    region: "US",
    category: "Marketing",
    date: 1672531200, // Jan 1, 2023
  },
});
```

```python
client.vector_stores.files.create(
    vector_store_id="<vector_store_id>",
    file_id="file_123",
    attributes={
        "region": "US",
        "category": "Marketing",
        "date": 1672531200      # Jan 1, 2023
    }
)
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
		FileID: "file_123",
		Attributes: map[string]openai.VectorStoreFileNewParamsAttributeUnion{
			"region":   {OfString: openai.String("US")},
			"category": {OfString: openai.String("Marketing")},
			"date":     {OfFloat: openai.Float(1672531200)},
		},
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
import com.openai.core.JsonValue;
import com.openai.models.vectorstores.files.FileCreateParams;

String vectorStoreId = "<vector_store_id>";

String fileId = "file_123";

var file =
    client
        .vectorStores()
        .files()
        .create(
            vectorStoreId,
            FileCreateParams.builder()
                .fileId(fileId)
                .attributes(
                    FileCreateParams.Attributes.builder()
                        .putAdditionalProperty("category", JsonValue.from("policy"))
                        .build())
                .build());

System.out.println(file.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
file = client.vector_stores.files.create("<vector_store_id>", file_id: "file_123", attributes: { category: "policy" })
puts(file.id)
```


### 过期策略

你可以对 `vector_store` 对象设置过期策略 `expires_after`。一旦 vector store 过期，所有关联的 `vector_store.file` 对象都将被删除，并且你将不再为它们付费。

为 vector store 设置过期策略

```javascript
await client.vectorStores.update("vs_123", {
  expires_after: {
    anchor: "last_active_at",
    days: 7,
  },
});
```

```python
client.vector_stores.update(
    vector_store_id="vs_123",
    expires_after={
        "anchor": "last_active_at",
        "days": 7
    }
)
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
	vectorStore, err := client.VectorStores.Update(context.Background(), "vs_123", openai.VectorStoreUpdateParams{
		ExpiresAfter: openai.VectorStoreUpdateParamsExpiresAfter{Days: 7},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(vectorStore.ExpiresAfter)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.vectorstores.VectorStoreUpdateParams;

String vectorStoreId = "vs_123";

var store =
    client
        .vectorStores()
        .update(
            vectorStoreId,
            VectorStoreUpdateParams.builder()
                .expiresAfter(
                    VectorStoreUpdateParams.ExpiresAfter.builder()
                        .anchor(JsonValue.from("last_active_at"))
                        .days(7)
                        .build())
                .build());

System.out.println(store.expiresAfter().orElseThrow());
```

```ruby
require "openai"

client = OpenAI::Client.new
store = client.vector_stores.update(
  "vs_123",
  expires_after: {
    anchor: :last_active_at,
    days: 7
  }
)
puts(store.expires_after)
```


### 限制

最大文件大小为 512 MB。每个文件包含的令牌数不应超过 5,000,000（在你附加文件时自动计算）。

### 分块

默认情况下， `max_chunk_size_tokens` 被设置为 `800` 与 `chunk_overlap_tokens` 被设置为 `400`，这意味着每个文件都会被切分为 800 个 token 的块，并且相邻块之间有 400 个 token 的重叠。

你可以在向向量存储添加文件时通过设置 [`chunking_strategy`](https://developers.openai.com/api/reference/resources/vector_stores/subresources/files/methods/create#vector-stores-files-createfile-chunking_strategy) 来调整这一点。该策略存在一些限制：

- `max_chunk_size_tokens` 必须介于 100 到 4096 之间（含两端值）。
- `chunk_overlap_tokens` 必须为非负值，且不应超过 `max_chunk_size_tokens / 2`.



#### 支持的文件类型



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





## 合成响应

执行查询后，你可能希望基于结果合成一个响应。你可以将结果和原始查询一起提供给我们的模型，从而获得一个有依据的响应。

执行搜索查询以获取结果

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const userQuery = "What is the return policy?";

const results = await client.vectorStores.search(vector_store.id, {
  query: userQuery,
});
```

```python
from openai import OpenAI

client = OpenAI()

user_query = "What is the return policy?"

results = client.vector_stores.search(
    vector_store_id=vector_store.id,
    query=user_query,
)
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
	results, err := client.VectorStores.Search(context.Background(), "vs_123", openai.VectorStoreSearchParams{
		Query: openai.VectorStoreSearchParamsQueryUnion{OfString: openai.String("What is the return policy?")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(results.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.vectorstores.VectorStoreSearchParams;

String vectorStoreId = "vs_123";

var results =
    client
        .vectorStores()
        .search(
            vectorStoreId,
            VectorStoreSearchParams.builder().query("What is the return policy?").build());

System.out.println(results.data());
```

```ruby
require "openai"

client = OpenAI::Client.new
results = client.vector_stores.search(
  "vs_123",
  query: "What is the return policy?"
)
puts(results.data)
```


根据结果合成一个响应

```javascript
const formattedResults = formatResults(results.data);
// Join the text content of all results
const textSources = results.data
  .map((result) => result.content.map((c) => c.text).join("\n"))
  .join("\n");

const completion = await client.chat.completions.create({
  model: "gpt-6-astra",
  messages: [
    {
      role: "developer",
      content:
        "Produce a concise answer to the query based on the provided sources.",
    },
    {
      role: "user",
      content: `Sources: ${formattedResults}\n\nQuery: '${userQuery}'`,
    },
  ],
});

console.log(completion.choices[0].message.content);
```

```python
# Use results and user_query from the preceding search step.
formatted_results = format_results(results.data)

"\n".join("\n".join(c.text for c in result.content) for result in results.data)

completion = client.chat.completions.create(
    model="gpt-6-astra",
    messages=[
        {
            "role": "developer",
            "content": "Produce a concise answer to the query based on the provided sources.",
        },
        {
            "role": "user",
            "content": f"Sources: {formatted_results}\n\nQuery: '{user_query}'",
        },
    ],
)

print(completion.choices[0].message.content)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	userQuery := "What is the return policy?"
	results, err := client.VectorStores.Search(context.Background(), "vs_123", openai.VectorStoreSearchParams{
		Query: openai.VectorStoreSearchParamsQueryUnion{OfString: openai.String(userQuery)},
	})
	if err != nil {
		panic(err)
	}

	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.DeveloperMessage("Produce a concise answer to the query based on the provided sources."),
			openai.UserMessage(fmt.Sprintf("Sources: %s\n\nQuery: %q", formatResults(results.Data), userQuery)),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message.Content)
}

func formatResults(results []openai.VectorStoreSearchResponse) string {
	var sources strings.Builder
	sources.WriteString("<sources>")
	for _, result := range results {
		fmt.Fprintf(&sources, "<result file_id=%q file_name=%q>", result.FileID, result.Filename)
		for _, content := range result.Content {
			fmt.Fprintf(&sources, "<content>%s</content>", content.Text)
		}
		sources.WriteString("</result>")
	}
	sources.WriteString("</sources>")
	return sources.String()
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.vectorstores.VectorStoreSearchParams;
import java.util.stream.Collectors;

String vectorStoreId = "vs_123";

String query = "What is the return policy?";
var results =
    client
        .vectorStores()
        .search(vectorStoreId, VectorStoreSearchParams.builder().query(query).build());
String sources =
    results.data().stream()
        .map(
            result ->
                "<result file_id='"
                    + result.fileId()
                    + "' file_name='"
                    + result.filename()
                    + "'>"
                    + result.content().stream()
                        .map(content -> "<content>" + content.text() + "</content>")
                        .collect(Collectors.joining())
                    + "</result>")
        .collect(Collectors.joining());

var completion =
    client
        .chat()
        .completions()
        .create(
            ChatCompletionCreateParams.builder()
                .model("gpt-6-astra")
                .addDeveloperMessage(
                    "Answer the query concisely using only the provided sources.")
                .addUserMessage(
                    "Sources: <sources>" + sources + "</sources>\n\nQuery: " + query)
                .build());

completion.choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
query = "What is the return policy?"
results = client.vector_stores.search("vs_123", query: query)
sources = (results.data || []).map do |result|
  content = result.content.map { |part| "<content>#{part.text}</content>" }.join
  "<result file_id='#{result.file_id}' file_name='#{result.filename}'>#{content}</result>"
end.join

completion = client.chat.completions.create(
  model: "gpt-6-astra",
  messages: [
    {
      role: :developer,
      content: "Answer the query concisely using only the provided sources."
    },
    {
      role: :user,
      content: "Sources: <sources>#{sources}</sources>\n\nQuery: #{query}"
    }
  ]
)
puts(completion.choices.fetch(0).message.content)
```


```json
"Our return policy allows returns within 30 days of purchase."
```

这里使用的是一个示例 `format_results` 函数，例如可以这样实现
如下所示：

示例结果格式化函数

```javascript
function formatResults(results) {
  let formattedResults = "";
  for (const result of results.data) {
    let formattedResult = `<result file_id='${result.file_id}' file_name='${result.filename}'>`;
    for (const part of result.content) {
      formattedResult += `<content>${part.text}</content>`;
    }
    formattedResults += formattedResult + "</result>";
  }
  return `<sources>${formattedResults}</sources>`;
}
```

```python
def format_results(results):
    formatted_results = ""
    for result in results.data:
        formatted_result = (
            f"<result file_id='{result.file_id}' file_name='{result.file_name}'>"
        )
        for part in result.content:
            formatted_result += f"<content>{part.text}</content>"
        formatted_results += formatted_result + "</result>"
    return f"<sources>{formatted_results}</sources>"
```

```go
package main

import (
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
)

func main() {
	results := []openai.VectorStoreSearchResponse{{
		FileID:   "file-12345",
		Filename: "woodchuck_policy.txt",
		Content:  []openai.VectorStoreSearchResponseContent{{Text: "Each passenger may carry up to two woodchucks."}},
	}}
	fmt.Println(formatResults(results))
}

func formatResults(results []openai.VectorStoreSearchResponse) string {
	var sources strings.Builder
	sources.WriteString("<sources>")
	for _, result := range results {
		fmt.Fprintf(&sources, "<result file_id=%q file_name=%q>", result.FileID, result.Filename)
		for _, content := range result.Content {
			fmt.Fprintf(&sources, "<content>%s</content>", content.Text)
		}
		sources.WriteString("</result>")
	}
	sources.WriteString("</sources>")
	return sources.String()
}
```

```ruby
results = [
  {
    file_id: "file-12345",
    filename: "woodchuck_policy.txt",
    content: [{ text: "Each passenger may carry up to two woodchucks." }]
  }
]

sources = results.map do |result|
  content = result.fetch(:content).map { |part| "<content>#{part.fetch(:text)}</content>" }.join
  "<result file_id=\"#{result.fetch(:file_id)}\" file_name=\"#{result.fetch(:filename)}\">#{content}</result>"
end

puts("<sources>#{sources.join}</sources>")
```