# Vector embeddings

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 什么是嵌入？

OpenAI 的文本嵌入用于衡量文本字符串之间的相关性。嵌入通常用于：

- **搜索** （结果按与查询字符串的相关性排序）
- **聚类** （根据相似度对文本字符串进行分组）
- **推荐** （推荐具有相关文本字符串的条目）
- **异常检测** （识别相关性较低的离群项）
- **多样性度量** （分析相似度分布）
- **分类** （根据最相似的标签对文本字符串进行分类）

嵌入（embedding）是由浮点数组成的向量（即一组数值列表）。两个 [distance](#which-distance-function-should-i-use) 之间的距离用于衡量它们的相似程度：距离越小表示相似度越高，距离越大表示相似度越低。

请访问我们的 [pricing page](https://openai.com/api/pricing/) 了解嵌入的定价。请求将按输入中的 [tokens](https://platform.openai.com/tokenizer) 数量计费。 [input](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings/create-input).

## 如何获取嵌入

若要获取嵌入向量，请将你的文本字符串发送到 [embeddings API 端点](https://developers.openai.com/api/reference/resources/embeddings) ，并附带嵌入模型名称（例如。， `text-embedding-3-small`):

示例：获取嵌入向量

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "Your text string goes here",
  encoding_format: "float",
});

console.log(embedding);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    input="Your text string goes here", model="text-embedding-3-small"
)

print(response.data[0].embedding)
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

	embedding, err := client.Embeddings.New(context.Background(), openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{
			OfString: openai.String("Your text string goes here."),
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(len(embedding.Data[0].Embedding))
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;

var embedding =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .input("The food was delicious and the waiter...")
                .build());

System.out.println(embedding.data().get(0).embedding());
```

```csharp
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

OpenAIEmbedding embedding = await client.GenerateEmbeddingAsync(
    "The food was delicious and the waiter was friendly."
);

Console.WriteLine($"Dimensions: {embedding.ToFloats().Length}");
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: "The food was delicious and the waiter..."
)

puts(response.data.fetch(0).embedding)
```

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-3-small"
  }'
```


响应中包含嵌入向量（浮点数列表）以及一些额外的元数据。你可以提取嵌入向量，将其存入向量数据库，并用于许多不同的用例。

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [
        -0.006929283495992422, -0.005336422007530928, -4.547132266452536e-5,
        -0.024047505110502243
      ]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```

默认情况下，嵌入向量的长度为 `1536` （ `text-embedding-3-small` 或 `3072` （ `text-embedding-3-large`）。若要在不损失其概念表示特性的前提下降低嵌入向量的维度，请传入 [dimensions 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions)。更多关于嵌入维度的详情，请参阅 [嵌入用例章节](#use-cases).

## Embedding models

OpenAI 提供两款强大的第三代嵌入模型（在模型 ID 中 `-3` 表示）。请阅读嵌入 v3 [公告博客文章](https://openai.com/blog/new-embedding-models-and-api-updates) 了解更多信息。

按输入 token 计费。以下是每美元可处理的文本页数示例（假设每页约 800 个 token）：

| 模型                  | ~ 每美元页数 | 在以下基准上的性能 [MTEB](https://github.com/embeddings-benchmark/mteb) 评测 | 最大输入 |
| ---------------------- | ------------------ | ------------------------------------------------------------------------ | --------- |
| text-embedding-3-small | 62,500             | 62.3%                                                                    | 8192      |
| text-embedding-3-large | 9,615              | 64.6%                                                                    | 8192      |
| text-embedding-ada-002 | 12,500             | 61.0%                                                                    | 8192      |

## 用例

下面展示一些有代表性的用例，使用的是 [Amazon 食品评论数据集](https://www.kaggle.com/snap/amazon-fine-food-reviews).

### 获取嵌入向量

该数据集包含截至 2012 年 10 月 Amazon 用户留下的共 568,454 条食品评论。我们使用其中最近的 1000 条评论的子集进行示例说明。这些评论为英文，倾向于正面或负面。每条评论都有一个 `ProductId`, `UserId`, `Score`、评论标题（`Summary`）和评论正文（`Text`）。例如：




| 产品 ID | 用户 ID        | 评分 | 摘要               | 文本                                              |
| ---------- | -------------- | ----- | --------------------- | ------------------------------------------------- |
| B001E4KFG0 | A3SGXH7AUHU8GW | 5     | Good Quality Dog Food | I have bought several of the Vitality canned...   |
| B00813GRG4 | A1D87F6ZCVE5NK | 1     | Not as Advertised     | Product arrived labeled as Jumbo Salted Peanut... |




下面，我们将评论摘要和评论文本合并为一个组合文本。模型对该组合文本进行编码，并输出一个向量嵌入。



Get_embeddings_from_dataset.ipynb
```javascript
import { mkdir, writeFile } from "node:fs/promises";
import OpenAI from "openai";

const client = new OpenAI();
const reviews = ["A rich cup of coffee.", "A bright herbal tea."];

const response = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: reviews.map((review) => review.replaceAll("\n", " ")),
});

const csvField = (value) => `"${value.replaceAll('"', '""')}"`;
const rows = response.data.map(({ embedding }, index) =>
  [csvField(reviews[index]), csvField(JSON.stringify(embedding))].join(",")
);

await mkdir("output", { recursive: true });
await writeFile(
  "output/embedded_1k_reviews.csv",
  ["combined,ada_embedding", ...rows].join("\n") + "\n"
);
```

```python
from openai import OpenAI

client = OpenAI()


def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding


df["ada_embedding"] = df.combined.apply(
    lambda x: get_embedding(x, model="text-embedding-3-small")
)
df.to_csv("output/embedded_1k_reviews.csv", index=False)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

static String csvField(String value) {
  return "\"" + value.replace("\"", "\"\"") + "\"";
}

List<String> reviews = List.of("A rich cup of coffee.", "A bright herbal tea.");
Path output = Path.of("output", "embedded_1k_reviews.csv");
Files.createDirectories(output.getParent());
try (var writer = Files.newBufferedWriter(output)) {
  writer.write("combined,ada_embedding\n");
  for (String review : reviews) {
    var embedding =
        client
            .embeddings()
            .create(
                EmbeddingCreateParams.builder()
                    .model("text-embedding-3-small")
                    .inputOfArrayOfStrings(List.of(review.replace("\n", " ")))
                    .build())
            .data()
            .get(0)
            .embedding();
    writer.write(csvField(review) + "," + csvField(embedding.toString()) + "\n");
  }
}
System.out.println(output);
```

```ruby
require "fileutils"
require "json"
require "openai"

client = OpenAI::Client.new
reviews = ["A rich cup of coffee.", "A bright herbal tea."]

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: reviews.map { |review| review.tr("\n", " ") }
)

csv_field = ->(value) { %("#{value.gsub('"', '""')}") }
rows = response.data.map.with_index do |embedding, index|
  [csv_field.call(reviews.fetch(index)), csv_field.call(JSON.generate(embedding.embedding))].join(",")
end

FileUtils.mkdir_p("output")
File.write("output/embedded_1k_reviews.csv", (["combined,ada_embedding"] + rows).join("\n") + "\n")
```


若要从已保存的文件加载数据，可以运行以下代码：

```python
import pandas as pd

df = pd.read_csv("output/embedded_1k_reviews.csv")
df["ada_embedding"] = df.ada_embedding.apply(eval).apply(np.array)
```




#### Reducing embedding dimensions



使用更大的嵌入（例如将其存储在向量库中以便检索）通常会比使用更小的嵌入消耗更多的算力、内存和存储空间，成本也更高。

我们两款新的嵌入模型均采用了 [一种技术](https://arxiv.org/abs/2205.13147) 进行训练，该技术允许开发者在使用嵌入时权衡性能和成本。具体来说，开发者可以通过传入 [`dimensions` dimensions API 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions)。来缩短嵌入（即从序列末尾移除部分数字），而不会让嵌入丧失其表征概念的能力。例如，在 MTEB 基准测试中， `text-embedding-3-large` 的嵌入可以被截断到 256 大小，同时表现仍然优于未经截断的 size 为 1536 的 `text-embedding-ada-002` 嵌入。了解更多关于改变维度如何影响性能的信息，请参阅我们的 [embeddings v3 发布博客文章](https://openai.com/blog/new-embedding-models-and-api-updates#:~:text=Native%20support%20for%20shortening%20embeddings).

通常，在创建嵌入时使用 `dimensions` dimensions 参数是推荐的做法。在某些情况下，你可能需要在生成嵌入之后更改其维度。手动更改维度时，需要确保按照下方所示对嵌入的维度进行归一化。

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: "Testing 123",
  encoding_format: "float",
});

const shortened = response.data[0].embedding.slice(0, 256);
const magnitude = Math.hypot(...shortened);
const normalized = shortened.map((value) =>
  magnitude === 0 ? 0 : value / magnitude
);

console.log(normalized);
```

```python
from openai import OpenAI
import numpy as np

client = OpenAI()


def normalize_l2(x):
    x = np.array(x)
    if x.ndim == 1:
        norm = np.linalg.norm(x)
        if norm == 0:
            return x
        return x / norm
    else:
        norm = np.linalg.norm(x, 2, axis=1, keepdims=True)
        return np.where(norm == 0, x, x / norm)


response = client.embeddings.create(
    model="text-embedding-3-small", input="Testing 123", encoding_format="float"
)

cut_dim = response.data[0].embedding[:256]
norm_dim = normalize_l2(cut_dim)

print(norm_dim)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;
import java.util.List;

private static List<Double> normalizeL2(List<Float> embedding) {
  double norm = Math.sqrt(embedding.stream().mapToDouble(value -> value * value).sum());
  return embedding.stream().map(value -> norm == 0 ? 0.0 : value / norm).toList();
}

var embedding =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .input("Testing 123")
                .encodingFormat(EmbeddingCreateParams.EncodingFormat.FLOAT)
                .build());

List<Float> shortened = embedding.data().get(0).embedding().subList(0, 256);
System.out.println(normalizeL2(shortened));
```

```csharp
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

OpenAIEmbedding embedding = await client.GenerateEmbeddingAsync("Testing 123");

float[] shortened = embedding.ToFloats().Span[..256].ToArray();
double magnitude = Math.Sqrt(shortened.Sum(value => value * value));
float[] normalized =
    magnitude == 0
        ? shortened
        : shortened.Select(value => (float)(value / magnitude)).ToArray();

Console.WriteLine($"Dimensions: {normalized.Length}");
Console.WriteLine($"First value: {normalized[0]:F6}");
Console.WriteLine(
    $"L2 norm: {Math.Sqrt(normalized.Sum(value => value * value)):F3}"
);
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: "Testing 123",
  encoding_format: :float
)

shortened = response.data.fetch(0).embedding.first(256)
magnitude = Math.sqrt(shortened.sum { |value| value**2 })
normalized = shortened.map { |value| magnitude.zero? ? 0 : value / magnitude }

puts(normalized)
```


动态更改维度可实现非常灵活的使用方式。例如，当使用一个仅支持最长 1024 维度嵌入的向量数据库时，开发者现在仍然可以使用我们最好的嵌入模型 `text-embedding-3-large` ，并为 `dimensions` API 参数指定值为 1024，这样会把嵌入从 3072 维缩短下来，以一定的精度损失换取更小的向量体积。







#### 使用基于嵌入的搜索进行问答





  

Question_answering_using_embeddings.ipynb
 在许多常见场景中，模型并未在包含你希望对用户查询开放的关键事实和信息的语料上进行过训练。如下所示，一种解决方式是将额外信息放入模型的上下文窗口中。这种方法在许多用例中都很有效，不过会带来更高的 token 成本。在本 notebook 中，我们将探讨这种方式与基于 embeddings 的检索之间的权衡取舍。

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const article =
  "At the 2022 Winter Olympics, Great Britain won women's curling and Sweden won men's curling.";
const question = `Use the article below to answer the question. If the answer cannot be found, say "I don't know."

Article:
${article}

Question: Which athletes won the gold medal in curling at the 2022 Winter Olympics?`;

const response = await client.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "system",
      content: "You answer questions about the 2022 Winter Olympics.",
    },
    { role: "user", content: question },
  ],
  temperature: 0,
});

console.log(response.choices[0].message.content);
```

```python
query = f"""Use the below article on the 2022 Winter Olympics to answer the subsequent question. If the answer cannot be found, write "I don't know."

Article:
\"\"\"
{wikipedia_article_on_curling}
\"\"\"

Question: Which athletes won the gold medal in curling at the 2022 Winter Olympics?"""

response = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "You answer questions about the 2022 Winter Olympics.",
        },
        {"role": "user", "content": query},
    ],
    model=GPT_MODEL,
    temperature=0,
)

print(response.choices[0].message.content)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

String article =
    "At the 2022 Winter Olympics, Great Britain won women's curling and Sweden won men's curling.";
String question =
    "Use the below article on the 2022 Winter Olympics to answer the subsequent question. "
        + "If the answer cannot be found, write \"I don't know.\"\n\n"
        + "Article:\n"
        + article
        + "\n\nQuestion: Which athletes won the gold medal in curling at the 2022 Winter Olympics?";

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-4.1-mini")
        .addSystemMessage("You answer questions about the 2022 Winter Olympics.")
        .addUserMessage(question)
        .temperature(0)
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
article = "At the 2022 Winter Olympics, Great Britain won women's curling and Sweden won men's curling."
question = <<~QUESTION
  Use the article below to answer the question. If the answer cannot be found, say "I don't know."

  Article:
  #{article}

  Question: Which athletes won the gold medal in curling at the 2022 Winter Olympics?
QUESTION

response = client.chat.completions.create(
  model: "gpt-4.1-mini",
  messages: [
    {
      role: :system,
      content: "You answer questions about the 2022 Winter Olympics."
    },
    {
      role: :user,
      content: question
    }
  ],
  temperature: 0
)

puts(response.choices.fetch(0).message.content)
```








#### 基于嵌入的文本搜索





  

Semantic_text_search_using_embeddings.ipynb
 为了检索最相关的文档，我们计算查询与各文档的嵌入向量之间的余弦相似度，并返回得分最高的文档。

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const reviews = [
  "A rich cup of coffee.",
  "Smooth beans in tomato sauce.",
  "Dark chocolate with orange.",
];

const { data } = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: [...reviews, "delicious beans"],
});

const query = data.at(-1).embedding;
const similarity = (embedding) => {
  const dotProduct = embedding.reduce(
    (total, value, index) => total + value * query[index],
    0
  );
  return dotProduct / (Math.hypot(...embedding) * Math.hypot(...query));
};

const results = reviews
  .map((review, index) => ({
    review,
    score: similarity(data[index].embedding),
  }))
  .sort((left, right) => right.score - left.score)
  .slice(0, 3);

console.log(results);
```

```python
def search_reviews(df, product_description, n=3, pprint=True):
    embedding = get_embedding(product_description, model="text-embedding-3-small")
    df["similarities"] = df.ada_embedding.apply(
        lambda x: cosine_similarity(x, embedding)
    )
    res = df.sort_values("similarities", ascending=False).head(n)
    return res


res = search_reviews(df, "delicious beans", n=3)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

List<String> reviews =
    List.of(
        "A rich cup of coffee.",
        "Smooth beans in tomato sauce.",
        "Dark chocolate with orange.");
var reviewEmbeddings =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .inputOfArrayOfStrings(reviews)
                .build())
        .data();
List<Float> query =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .inputOfArrayOfStrings(List.of("delicious beans"))
                .build())
        .data()
        .get(0)
        .embedding();

IntStream.range(0, reviews.size())
    .boxed()
    .sorted(
        Comparator.comparingDouble(
                (Integer index) ->
                    cosineSimilarity(query, reviewEmbeddings.get(index).embedding()))
            .reversed())
    .limit(3)
    .map(reviews::get)
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
reviews = [
  "A rich cup of coffee.",
  "Smooth beans in tomato sauce.",
  "Dark chocolate with orange."
]

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: reviews + ["delicious beans"]
)

query = response.data.fetch(-1).embedding
similarity = lambda do |embedding|
  dot_product = embedding.zip(query).sum { |value, query_value| value * query_value }
  magnitude = Math.sqrt(embedding.sum { |value| value**2 })
  query_magnitude = Math.sqrt(query.sum { |value| value**2 })
  dot_product / (magnitude * query_magnitude)
end

results = reviews.map.with_index do |review, index|
  {
    review: review,
    score: similarity.call(response.data.fetch(index).embedding)
  }
end.sort_by { |result| -result.fetch(:score) }.first(3)

puts(results)
```








#### 使用嵌入进行代码搜索





  

Code_search.ipynb
 代码搜索的工作原理与基于嵌入的文本搜索类似。我们提供一种方法，可从指定仓库的所有 Python 文件中提取 Python 函数，然后使用 `text-embedding-3-small` 模型对这些函数建立索引。

要执行代码搜索，我们使用同一模型将自然语言形式的查询进行嵌入，然后计算查询嵌入与各个函数嵌入之间的余弦相似度。余弦相似度最高的结果即为最相关的结果。

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const functions = [
  "function add(a, b) { return a + b; }",
  "function complete(prompt) { return prompt; }",
];

const { data } = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: [...functions, "Completions API tests"],
});

const query = data.at(-1).embedding;
const similarity = (embedding) => {
  const dotProduct = embedding.reduce(
    (total, value, index) => total + value * query[index],
    0
  );
  return dotProduct / (Math.hypot(...embedding) * Math.hypot(...query));
};

const results = functions
  .map((source, index) => ({
    source,
    score: similarity(data[index].embedding),
  }))
  .sort((left, right) => right.score - left.score);

console.log(results);
```

```python
df["code_embedding"] = df["code"].apply(
    lambda x: get_embedding(x, model="text-embedding-3-small")
)


def search_functions(df, code_query, n=3, pprint=True, n_lines=7):
    embedding = get_embedding(code_query, model="text-embedding-3-small")
    df["similarities"] = df.code_embedding.apply(
        lambda x: cosine_similarity(x, embedding)
    )

    res = df.sort_values("similarities", ascending=False).head(n)
    return res


res = search_functions(df, "Completions API tests", n=3)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

List<String> functions =
    List.of("def add(a, b): return a + b", "def complete(prompt): return prompt");
var functionEmbeddings =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .inputOfArrayOfStrings(functions)
                .build())
        .data();
List<Float> query =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .input("Completions API tests")
                .build())
        .data()
        .get(0)
        .embedding();
IntStream.range(0, functions.size())
    .boxed()
    .sorted(
        Comparator.comparingDouble(
                (Integer index) ->
                    cosineSimilarity(query, functionEmbeddings.get(index).embedding()))
            .reversed())
    .map(functions::get)
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
functions = [
  "function add(a, b) { return a + b; }",
  "function complete(prompt) { return prompt; }"
]

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: functions + ["Completions API tests"]
)

query = response.data.fetch(-1).embedding
similarity = lambda do |embedding|
  dot_product = embedding.zip(query).sum { |value, query_value| value * query_value }
  magnitude = Math.sqrt(embedding.sum { |value| value**2 })
  query_magnitude = Math.sqrt(query.sum { |value| value**2 })
  dot_product / (magnitude * query_magnitude)
end

results = functions.map.with_index do |source, index|
  {
    source: source,
    score: similarity.call(response.data.fetch(index).embedding)
  }
end.sort_by { |result| -result.fetch(:score) }

puts(results)
```








#### 基于 embeddings 的推荐





  

Recommendation_using_embeddings.ipynb
 由于嵌入向量之间距离越短表示相似度越高，嵌入可有效用于推荐。

下面我们演示一个基础的推荐器。它接收一组字符串和一个“源”字符串，计算它们的嵌入，然后返回一个按相似度从高到低排序的字符串列表。作为具体示例，下方链接的 notebook 将该函数的一个版本应用于 [AG news 数据集](http://groups.di.unipi.it/~gulli/AG_corpus_of_news_articles.html) （抽样至 2,000 条新闻文章描述），以返回与任意给定源文章最相似的前 5 篇文章。

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const strings = [
  "A cheetah is a fast land animal.",
  "A peregrine falcon is a fast bird.",
  "A tortoise moves slowly.",
];

const { data } = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: strings,
});

const query = data[0].embedding;
const recommendations = data
  .map(({ embedding }, index) => {
    const dotProduct = embedding.reduce(
      (total, value, dimension) => total + value * query[dimension],
      0
    );
    const similarity =
      dotProduct / (Math.hypot(...embedding) * Math.hypot(...query));
    return { index, text: strings[index], similarity };
  })
  .sort((left, right) => right.similarity - left.similarity);

console.log(recommendations);
```

```python
def recommendations_from_strings(
    strings: List[str],
    index_of_source_string: int,
    model="text-embedding-3-small",
) -> List[int]:
    """Return nearest neighbors of a given string."""

    # get embeddings for all strings
    embeddings = [embedding_from_string(string, model=model) for string in strings]

    # get the embedding of the source string
    query_embedding = embeddings[index_of_source_string]

    # get distances between the source embedding and other embeddings (function from embeddings_utils.py)
    distances = distances_from_embeddings(
        query_embedding, embeddings, distance_metric="cosine"
    )

    # get indices of nearest neighbors (function from embeddings_utils.py)
    indices_of_nearest_neighbors = indices_of_nearest_neighbors_from_distances(
        distances
    )
    return indices_of_nearest_neighbors
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

List<String> strings =
    List.of(
        "A cheetah is a fast land animal.",
        "A peregrine falcon is a fast bird.",
        "A tortoise moves slowly.");

var embeddings =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .inputOfArrayOfStrings(strings)
                .build())
        .data();

List<Float> query = embeddings.get(0).embedding();
var nearestNeighbors =
    IntStream.range(0, embeddings.size())
        .boxed()
        .sorted(
            Comparator.comparingDouble(
                (Integer index) -> {
                  List<Float> candidate = embeddings.get(index).embedding();
                  double dotProduct = 0;
                  double queryMagnitude = 0;
                  double candidateMagnitude = 0;
                  for (int dimension = 0; dimension < query.size(); dimension++) {
                    dotProduct += query.get(dimension) * candidate.get(dimension);
                    queryMagnitude += query.get(dimension) * query.get(dimension);
                    candidateMagnitude += candidate.get(dimension) * candidate.get(dimension);
                  }
                  return 1 - dotProduct / Math.sqrt(queryMagnitude * candidateMagnitude);
                }))
        .toList();

System.out.println(nearestNeighbors);
```

```ruby
require "openai"

client = OpenAI::Client.new
strings = [
  "A cheetah is a fast land animal.",
  "A peregrine falcon is a fast bird.",
  "A tortoise moves slowly."
]

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: strings
)

query = response.data.fetch(0).embedding
similarity = lambda do |embedding|
  dot_product = embedding.zip(query).sum { |value, query_value| value * query_value }
  magnitude = Math.sqrt(embedding.sum { |value| value**2 })
  query_magnitude = Math.sqrt(query.sum { |value| value**2 })
  dot_product / (magnitude * query_magnitude)
end

recommendations = response.data.map.with_index do |embedding, index|
  {
    index: index,
    text: strings.fetch(index),
    similarity: similarity.call(embedding.embedding)
  }
end.sort_by { |recommendation| -recommendation.fetch(:similarity) }

puts(recommendations)
```








#### 二维数据可视化





  

Visualizing_embeddings_in_2D.ipynb
 嵌入的维度大小会随底层模型的复杂度而变化。为了可视化这些高维数据，我们使用 t-SNE 算法将其转换为二维。

我们根据评论者给出的星级评分为各条评论着色：

- 1 星：红色
- 2 星：深橙色
- 3 星：金色
- 4 星：青绿色
- 5 星：深绿色

该可视化似乎生成了大约 3 个簇，其中一个簇的评论大多为负面。

```python
import numpy as np
import pandas as pd
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import matplotlib

df = pd.read_csv("output/embedded_1k_reviews.csv")
matrix = np.array(df.ada_embedding.apply(eval).to_list())

# Create a t-SNE model and transform the data
tsne = TSNE(
    n_components=2, perplexity=15, random_state=42, init="random", learning_rate=200
)
vis_dims = tsne.fit_transform(matrix)

colors = ["red", "darkorange", "gold", "turquoise", "darkgreen"]
x = [x for x, y in vis_dims]
y = [y for x, y in vis_dims]
color_indices = df.Score.values - 1

colormap = matplotlib.colors.ListedColormap(colors)
plt.scatter(x, y, c=color_indices, cmap=colormap, alpha=0.3)
plt.title("Amazon ratings visualized in language using t-SNE")
```








#### Embedding 作为机器学习算法的文本特征编码器





  

Regression_using_embeddings.ipynb
 嵌入可作为机器学习模型中通用的自由文本特征编码器。如果部分相关输入是自由文本，加入嵌入会提升任何机器学习模型的性能。嵌入也可作为机器学习模型中的类别特征编码器。当类别变量的名称有意义且数量较多（例如职位名称）时，这种做法价值最大。对于此任务，相似性嵌入通常优于搜索嵌入。

我们观察到，嵌入表示通常非常丰富且信息密度高。例如，即使使用 SVD 或 PCA 将输入维度降低 10%，通常也会导致特定任务的下游性能变差。

此代码将数据拆分为训练集和测试集，供以下两个用例（即回归和分类）使用。

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    list(df.ada_embedding.values), df.Score, test_size=0.2, random_state=42
)
```


#### 使用嵌入特征进行回归

嵌入提供了一种预测数值的优雅方法。在本例中，我们根据评论文本预测评论者的星级评分。由于嵌入中包含的语义信息十分丰富，即便只有很少的评论，预测效果也相当不错。

我们假设评分是一个介于 1 到 5 之间的连续变量，并允许算法预测任意浮点值。该机器学习算法会最小化预测值与真实评分之间的距离，最终达到 0.39 的平均绝对误差，这意味着平均而言预测偏差不到半颗星。

```python
from sklearn.ensemble import RandomForestRegressor

rfr = RandomForestRegressor(n_estimators=100)
rfr.fit(X_train, y_train)
preds = rfr.predict(X_test)
```








#### 使用 embedding 特征进行分类





  

Classification_using_embeddings.ipynb
 这一次，我们不再让算法预测 1 到 5 之间的任意值，而是尝试将评论的精确星级数分类到 5 个桶中，范围从 1 星到 5 星。

训练完成后，模型在预测 1 星和 5 星评论方面的表现远优于预测更细致的评论（2-4 星），这可能是由于极端情感的表达更为明显。

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)
```








#### 零样本分类





  

Zero-shot_classification_with_embeddings.ipynb
 我们可以使用 embeddings 进行零样本分类，而无需任何已标注的训练数据。对于每个类别，我们嵌入其类别名称或对该类别的简短描述。为了以零样本方式对一些新文本进行分类，我们将其 embedding 与所有类别的 embedding 进行比较，并预测相似度最高的类别。

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const labels = ["negative", "positive"];

const { data } = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: [...labels, "The coffee arrived quickly and tastes great."],
});

const review = data.at(-1).embedding;
const similarity = (embedding) => {
  const dotProduct = embedding.reduce(
    (total, value, index) => total + value * review[index],
    0
  );
  return dotProduct / (Math.hypot(...embedding) * Math.hypot(...review));
};

const [negative, positive] = data.map(({ embedding }) => similarity(embedding));
console.log(positive > negative ? "positive" : "negative");
```

```python
df = df[df.Score != 3]
df["sentiment"] = df.Score.replace(
    {1: "negative", 2: "negative", 4: "positive", 5: "positive"}
)

labels = ["negative", "positive"]
label_embeddings = [get_embedding(label, model=model) for label in labels]


def label_score(review_embedding, label_embeddings):
    return cosine_similarity(review_embedding, label_embeddings[1]) - cosine_similarity(
        review_embedding, label_embeddings[0]
    )


prediction = (
    "positive" if label_score(get_embedding("Sample Review", model=model), label_embeddings) > 0 else "negative"
)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.embeddings.EmbeddingCreateParams;
import java.util.List;

var embeddings =
    client
        .embeddings()
        .create(
            EmbeddingCreateParams.builder()
                .model("text-embedding-3-small")
                .inputOfArrayOfStrings(List.of("negative", "positive", "Sample Review"))
                .build())
        .data();

List<Float> review = embeddings.get(2).embedding();
double negative = cosineSimilarity(review, embeddings.get(0).embedding());
double positive = cosineSimilarity(review, embeddings.get(1).embedding());
System.out.println(positive > negative ? "positive" : "negative");
```

```ruby
require "openai"

client = OpenAI::Client.new
labels = ["negative", "positive"]

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: labels + ["The coffee arrived quickly and tastes great."]
)

review = response.data.fetch(-1).embedding
similarity = lambda do |embedding|
  dot_product = embedding.zip(review).sum { |value, review_value| value * review_value }
  magnitude = Math.sqrt(embedding.sum { |value| value**2 })
  review_magnitude = Math.sqrt(review.sum { |value| value**2 })
  dot_product / (magnitude * review_magnitude)
end

negative, positive = response.data.first(2).map do |embedding|
  similarity.call(embedding.embedding)
end
puts((positive > negative) ? "positive" : "negative")
```








#### 获取用于冷启动推荐的用户和商品 embedding





  

User_and_product_embeddings.ipynb
 我们可以通过对用户的所有评论取平均来获得用户嵌入。类似地，我们可以通过对某商品的所有评论取平均来获得商品嵌入。为了展示这种方法的有效性，我们使用 5 万条评论的子集，以便为每个用户和每个商品覆盖更多评论。

我们在单独的测试集上评估这些嵌入的有效性，其中我们绘制了用户嵌入与商品嵌入的相似度随评分的变化曲线。有趣的是，基于这种方法，甚至在用户收到商品之前，我们就能比随机猜测更好地预测他们是否会喜欢该商品。

```python
user_embeddings = df.groupby("UserId").ada_embedding.apply(np.mean)
prod_embeddings = df.groupby("ProductId").ada_embedding.apply(np.mean)
```








#### 聚类





  

Clustering.ipynb
 聚类是处理海量文本数据的一种方式。嵌入（embedding）非常适合此任务，因为它们能为每段文本提供具有语义意义的向量表示。因此，我们可以通过无监督的方式，利用聚类发现数据集中隐藏的分组。

在本例中，我们识别出四个不同的聚类：一个聚焦于狗粮，一个聚焦于差评，另外两个聚焦于好评。

```python
import numpy as np
from sklearn.cluster import KMeans

matrix = np.vstack(df.ada_embedding.values)
n_clusters = 4

kmeans = KMeans(n_clusters=n_clusters, init="k-means++", random_state=42)
kmeans.fit(matrix)
df["Cluster"] = kmeans.labels_
```






## 常见问题

### 如何在嵌入字符串之前判断该字符串包含多少 token？

在 Python 中，你可以使用 OpenAI 的分词器将字符串拆分为 token [`tiktoken`](https://github.com/openai/tiktoken).

示例代码：

```python
import tiktoken


def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


num_tokens_from_string("tiktoken is great!", "cl100k_base")
```


对于第三代 embedding 模型，例如 `text-embedding-3-small`，请使用 `cl100k_base` 编码。

更多详情和示例代码请参阅 OpenAI Cookbook 指南 [如何使用 tiktoken 统计 token 数量](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

### 如何快速检索 K 个最近嵌入向量？

为了在大量向量中快速搜索，我们建议使用向量数据库。你可以在我们的 Cookbook 中找到使用向量数据库和 OpenAI API 的示例 [在 Cookbook 中](https://developers.openai.com/cookbook/examples/vector_databases/readme) 位于 GitHub 上。

### 我应该使用哪种距离函数？

我们建议 [余弦相似度](https://en.wikipedia.org/wiki/Cosine_similarity)。距离函数的选择通常影响不大。

OpenAI embeddings 会被归一化到长度为 1，这意味着：

- 余弦相似度可以仅通过点积略快地计算
- 余弦相似度和欧氏距离将产生相同的排序结果

### 我可以在网上分享我的 embeddings 吗？

是的，客户拥有我们模型输入和输出的所有权，包括嵌入（embeddings）的情况。你有责任确保你输入到我们 API 的内容不违反任何适用法律或我们的 [使用条款](https://openai.com/policies/terms-of-use).

### V3 嵌入模型是否了解近期的事件？

不， `text-embedding-3-large` 和 `text-embedding-3-small` 模型缺乏对 2021 年 9 月之后发生的事件的了解。这通常不像对文本生成模型那样构成很大的限制，但在某些边缘情况下可能会降低性能。