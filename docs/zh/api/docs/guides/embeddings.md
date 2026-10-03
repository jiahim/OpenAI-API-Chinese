# Vector embeddings

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 什么是嵌入？

OpenAI 的文本嵌入用于衡量文本字符串之间的相关性。嵌入通常用于：

- **搜索** （结果按与查询字符串的相关性排序）
- **聚类** （将文本字符串按相似度分组）
- **推荐** （推荐具有相关文本字符串的条目）
- **异常检测** （识别相关性较低的外离点）
- **多样性度量** （分析相似度分布）
- **分类** （根据最相似的标签对文本字符串进行分类）

嵌入是浮点数组成的向量（列表）。两个向量之间的 [距离](#which-distance-function-should-i-use) 用于衡量它们的关联程度：距离越小表示关联越紧密，距离越大表示关联越疏远。

请访问我们的 [定价页面](https://openai.com/api/pricing/) 以了解嵌入的定价。请求根据以下数量计费： [tokens](https://platform.openai.com/tokenizer) 输入 [input](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings/create-input).

## 如何获取嵌入

要获取 embedding，请将你的文本字符串发送到 [embeddings API 端点](https://developers.openai.com/api/reference/resources/embeddings) ，并同时传入 embedding 模型名称（例如， `text-embedding-3-small`):

示例：获取 embeddings

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


响应中包含 embedding 向量（浮点数列表）以及一些额外的元数据。你可以提取该 embedding 向量，将其存入向量数据库，并用于多种不同的使用场景。

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

默认情况下，embedding 向量的长度为 `1536` （ `text-embedding-3-small` 或 `3072` （ `text-embedding-3-large`）。如果希望在保留其概念表示能力的前提下降低 embedding 的维度，请传入 [dimensions 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions)。更多关于 embedding 维度的细节，请参阅 [embedding 使用场景章节](#use-cases).

## Embedding models

OpenAI 提供两个强大的第三代 embedding 模型（在模型 ID 中以 `-3` 标识）。阅读 embedding v3 [公告博客文章](https://openai.com/blog/new-embedding-models-and-api-updates) 了解更多详情。

费用按输入 token 计费。以下是每美元可处理的文本页数示例（假设每页约 800 个 token）：

| 模型                  | ~ 每美元可处理的页数 | 在以下基准上的性能 [MTEB](https://github.com/embeddings-benchmark/mteb) 评估 | 最大输入 |
| ---------------------- | ------------------ | ------------------------------------------------------------------------ | --------- |
| text-embedding-3-small | 62,500             | 62.3%                                                                    | 8192      |
| text-embedding-3-large | 9,615              | 64.6%                                                                    | 8192      |
| text-embedding-ada-002 | 12,500             | 61.0%                                                                    | 8192      |

## 用例

下面我们展示一些具有代表性的使用案例，使用的是 [Amazon fine-food reviews 数据集](https://www.kaggle.com/snap/amazon-fine-food-reviews).

### 获取嵌入

该数据集共包含截至 2012 年 10 月由 Amazon 用户留下的 568,454 条食品评论。我们使用其中 1000 条最新评论的子集进行示例说明。这些评论为英文，倾向为正面或负面。每条评论都包含一个 `ProductId`, `UserId`, `Score`、评论标题（`Summary`）以及评论正文（`Text`）。例如：




| Product Id | User Id        | 评分 | 摘要               | 文本                                              |
| ---------- | -------------- | ----- | --------------------- | ------------------------------------------------- |
| B001E4KFG0 | A3SGXH7AUHU8GW | 5     | Good Quality Dog Food | I have bought several of the Vitality canned...   |
| B00813GRG4 | A1D87F6ZCVE5NK | 1     | Not as Advertised     | Product arrived labeled as Jumbo Salted Peanut... |




下面，我们将评论摘要和评论文本合并成单个合并文本。模型会对该合并文本进行编码，并输出一个向量嵌入。



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

```go
import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	ctx := context.Background()
	reviews := []string{"A rich cup of coffee.", "A bright herbal tea."}
	if err := os.MkdirAll("output", 0755); err != nil {
		return err
	}
	file, err := os.Create("output/embedded_1k_reviews.csv")
	if err != nil {
		return err
	}
	defer file.Close()
	writer := csv.NewWriter(file)
	if err := writer.Write([]string{"combined", "ada_embedding"}); err != nil {
		return err
	}
	for _, review := range reviews {
		vector, err := embedding(ctx, &client, strings.ReplaceAll(review, "\n", " "))
		if err != nil {
			return err
		}
		encoded, err := json.Marshal(vector)
		if err != nil {
			return err
		}
		if err := writer.Write([]string{review, string(encoded)}); err != nil {
			return err
		}
	}
	writer.Flush()
	if err := writer.Error(); err != nil {
		return err
	}
	if err := file.Close(); err != nil {
		return err
	}
	fmt.Println("Saved output/embedded_1k_reviews.csv")
	return nil
}

func embedding(ctx context.Context, client *openai.Client, text string) ([]float64, error) {
	response, err := client.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{OfString: openai.String(text)},
	})
	if err != nil {
		return nil, err
	}
	return response.Data[0].Embedding, nil
}
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

```csharp
using System.Text.Json;
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

string[] reviews = ["A rich cup of coffee.", "A bright herbal tea."];
Directory.CreateDirectory("output");
using StreamWriter writer = new("output/embedded_1k_reviews.csv");
await writer.WriteLineAsync("combined,ada_embedding");
foreach (string review in reviews)
{
    float[] vector = await EmbedAsync(client, review.Replace("\n", " ", StringComparison.Ordinal));
    string encoded = JsonSerializer.Serialize(vector);
    await writer.WriteLineAsync($"{CsvField(review)},{CsvField(encoded)}");
}
Console.WriteLine("Saved output/embedded_1k_reviews.csv");

static async Task<float[]> EmbedAsync(EmbeddingClient client, string text)
{
    OpenAIEmbedding result = await client.GenerateEmbeddingAsync(text);
    return result.ToFloats().ToArray();
}

static string CsvField(string value) => "\"" + value.Replace("\"", "\"\"", StringComparison.Ordinal) + "\"";
```

```ruby
require "csv"
require "fileutils"
require "json"
require "openai"

client = OpenAI::Client.new
reviews = ["A rich cup of coffee.", "A bright herbal tea."]

response = client.embeddings.create(
  model: "text-embedding-3-small",
  input: reviews.map { |review| review.tr("\n", " ") }
)

FileUtils.mkdir_p("output")
CSV.open("output/embedded_1k_reviews.csv", "w") do |csv|
  csv << ["combined", "ada_embedding"]
  response.data.each do |embedding|
    csv << [reviews.fetch(embedding.index), JSON.generate(embedding.embedding)]
  end
end
```


要从已保存的文件中加载数据，你可以运行以下代码：

```python
import pandas as pd

df = pd.read_csv("output/embedded_1k_reviews.csv")
df["ada_embedding"] = df.ada_embedding.apply(eval).apply(np.array)
```




#### Reducing embedding dimensions



使用更大的 embedding（例如将其存储在向量库中用于检索）通常比使用更小的 embedding 成本更高，并且会消耗更多的算力、内存和存储。

我们的两个新 embedding 模型都采用了 [一种技术](https://arxiv.org/abs/2205.13147) ，允许开发者在使用 embedding 的性能和成本之间进行权衡。具体来说，开发者可以在不损失 embedding 表示概念能力的前提下缩短 embedding（即从序列末尾删除一些数字），方法是在创建 embedding 时传入 [`dimensions` dimensions API 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions)。例如，在 MTEB 基准测试中，一个 `text-embedding-3-large` embedding 可以被缩短到 256 大小，同时仍然优于未缩短的、大小为 1536 的 `text-embedding-ada-002` embedding。你可以在我们的 [embeddings v3 发布博客文章](https://openai.com/blog/new-embedding-models-and-api-updates#:~:text=Native%20support%20for%20shortening%20embeddings).

中详细了解更改维度对性能的影响。一般来说，在创建 embedding 时使用 `dimensions` dimensions 参数是推荐的做法。在某些情况下，你可能需要在生成 embedding 之后更改其维度。当手动更改维度时，你需要确保像下面所示的那样对 embedding 的维度进行归一化。

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


动态更改维度可以实现非常灵活的使用方式。例如，当使用一个仅支持最长 1024 维 embedding 的向量数据库时，开发者现在仍然可以使用我们最好的 embedding 模型 `text-embedding-3-large` ，并为 `dimensions` API 参数指定值 1024，这会将 embedding 从 3072 维缩短下来，以牺牲部分精度换取更小的向量大小。







#### 使用基于嵌入的搜索进行问答





  

Question_answering_using_embeddings.ipynb
 在许多常见场景下，模型并未在包含你想要在响应用户查询时访问的关键事实和信息的训练数据上进行训练。如下所示，一种解决方法是将这些额外信息放入模型的上下文窗口中。这种方法在许多用例中都很有效，但会导致更高的 token 费用。在本 notebook 中，我们将探讨这种方法与基于 embeddings 的搜索之间的权衡取舍。

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

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-4.1-mini", Temperature: openai.Float(0), Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage("You answer questions about the 2022 Winter Olympics."),
			openai.UserMessage("Use the article to answer the question. If the answer cannot be found, write \"I don't know.\"\n\nArticle: At the 2022 Winter Olympics, Great Britain won women's curling and Sweden won men's curling.\n\nQuestion: Which athletes won the gold medal in curling at the 2022 Winter Olympics?")},
	})
	if err != nil {
		return err
	}
	fmt.Println(completion.Choices[0].Message.Content)
	return nil
}
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

```csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-4.1-mini";
ChatClient client = new(model, key);

string article = "At the 2022 Winter Olympics, Great Britain won women's curling and Sweden won men's curling.";
string query = $"Use the article to answer the question. If the answer cannot be found, write I don't know.\nArticle: {article}\nQuestion: Which athletes won the gold medal in curling at the 2022 Winter Olympics?";
ChatCompletion result = await client.CompleteChatAsync(
    [new SystemChatMessage("You answer questions about the 2022 Winter Olympics."), new UserChatMessage(query)],
    new ChatCompletionOptions { Temperature = 0 });
Console.WriteLine(result.Content[0].Text);
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








#### 使用 embeddings 进行文本搜索





  

Semantic_text_search_using_embeddings.ipynb
 为了检索最相关的文档，我们计算查询与每个文档的嵌入向量之间的余弦相似度，并返回得分最高的文档。

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

```go
import (
	"context"
	"fmt"
	"log"
	"math"
	"sort"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	ctx := context.Background()
	texts := []string{"A rich cup of coffee.", "Crunchy crackers with sea salt.", "Dark chocolate with orange.", "A bright herbal tea.", "Smooth beans in tomato sauce.", "A mild cheese with herbs.", "Spicy roasted nuts.", "A crisp sparkling water."}
	vectors := make([][]float64, len(texts))
	for i, text := range texts {
		vector, err := embedding(ctx, &client, text)
		if err != nil {
			return err
		}
		vectors[i] = vector
	}
	query, err := embedding(ctx, &client, "delicious beans")
	if err != nil {
		return err
	}
	matches := nearest(query, vectors)
	for _, match := range matches[:min(3, len(matches))] {
		fmt.Printf("%0.3f: %s\n", match.Similarity, texts[match.Index])
	}
	return nil
}

func embedding(ctx context.Context, client *openai.Client, text string) ([]float64, error) {
	response, err := client.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{OfString: openai.String(text)},
	})
	if err != nil {
		return nil, err
	}
	return response.Data[0].Embedding, nil
}

func cosineSimilarity(a, b []float64) float64 {
	var dot, left, right float64
	for i := range a {
		dot += a[i] * b[i]
		left += a[i] * a[i]
		right += b[i] * b[i]
	}
	return dot / math.Sqrt(left*right)
}

type match struct {
	Index      int
	Similarity float64
}

func nearest(query []float64, vectors [][]float64) []match {
	matches := make([]match, len(vectors))
	for i, vector := range vectors {
		matches[i] = match{Index: i, Similarity: cosineSimilarity(query, vector)}
	}
	sort.SliceStable(matches, func(i, j int) bool { return matches[i].Similarity > matches[j].Similarity })
	return matches
}
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

```csharp
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

string[] texts = ["A rich cup of coffee.", "Crunchy crackers with sea salt.", "Dark chocolate with orange.", "A bright herbal tea.", "Smooth beans in tomato sauce.", "A mild cheese with herbs.", "Spicy roasted nuts.", "A crisp sparkling water."];
OpenAIEmbeddingCollection batch = await client.GenerateEmbeddingsAsync(texts);
float[][] vectors = batch.Select(item => item.ToFloats().ToArray()).ToArray();
float[] query = await EmbedAsync(client, "delicious beans");
var ranked = vectors.Select((vector, index) => new { Index = index, Similarity = CosineSimilarity(query, vector) }).OrderByDescending(match => match.Similarity);
foreach (var match in ranked.Take(3))
{
    Console.WriteLine($"{match.Similarity:F3}: {texts[match.Index]}");
}

static async Task<float[]> EmbedAsync(EmbeddingClient client, string text)
{
    OpenAIEmbedding result = await client.GenerateEmbeddingAsync(text);
    return result.ToFloats().ToArray();
}

static double CosineSimilarity(float[] left, float[] right)
{
    double dot = 0, leftNorm = 0, rightNorm = 0;
    for (int i = 0; i < left.Length; i++)
    {
        dot += left[i] * right[i];
        leftNorm += left[i] * left[i];
        rightNorm += right[i] * right[i];
    }
    return dot / Math.Sqrt(leftNorm * rightNorm);
}
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
 代码搜索的工作方式与基于嵌入的文本搜索类似。我们提供一种方法，可从指定代码仓库中的所有 Python 文件里提取函数，随后使用每个函数的 `text-embedding-3-small` model 对其建立索引。

为了执行代码搜索，我们使用同一个 model 将自然语言形式的查询转换为嵌入向量。然后计算该查询嵌入与各个函数嵌入之间的余弦相似度，余弦相似度最高的结果即为最相关的函数。

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

```go
import (
	"context"
	"fmt"
	"log"
	"math"
	"sort"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	ctx := context.Background()
	texts := []string{"def add(a, b): return a + b", "def complete(prompt): return prompt"}
	vectors := make([][]float64, len(texts))
	for i, text := range texts {
		vector, err := embedding(ctx, &client, text)
		if err != nil {
			return err
		}
		vectors[i] = vector
	}
	query, err := embedding(ctx, &client, "Completions API tests")
	if err != nil {
		return err
	}
	matches := nearest(query, vectors)
	for _, match := range matches[:min(3, len(matches))] {
		fmt.Printf("%0.3f: %s\n", match.Similarity, texts[match.Index])
	}
	return nil
}

func embedding(ctx context.Context, client *openai.Client, text string) ([]float64, error) {
	response, err := client.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{OfString: openai.String(text)},
	})
	if err != nil {
		return nil, err
	}
	return response.Data[0].Embedding, nil
}

func cosineSimilarity(a, b []float64) float64 {
	var dot, left, right float64
	for i := range a {
		dot += a[i] * b[i]
		left += a[i] * a[i]
		right += b[i] * b[i]
	}
	return dot / math.Sqrt(left*right)
}

type match struct {
	Index      int
	Similarity float64
}

func nearest(query []float64, vectors [][]float64) []match {
	matches := make([]match, len(vectors))
	for i, vector := range vectors {
		matches[i] = match{Index: i, Similarity: cosineSimilarity(query, vector)}
	}
	sort.SliceStable(matches, func(i, j int) bool { return matches[i].Similarity > matches[j].Similarity })
	return matches
}
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

```csharp
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

string[] texts = ["def add(a, b): return a + b", "def complete(prompt): return prompt"];
List<float[]> vectors = [];
foreach (string text in texts)
{
    vectors.Add(await EmbedAsync(client, text));
}
float[] query = await EmbedAsync(client, "Completions API tests");
var ranked = vectors.Select((vector, index) => new { Index = index, Similarity = CosineSimilarity(query, vector) }).OrderByDescending(match => match.Similarity);
foreach (var match in ranked.Take(3))
{
    Console.WriteLine($"{match.Similarity:F3}: {texts[match.Index]}");
}

static async Task<float[]> EmbedAsync(EmbeddingClient client, string text)
{
    OpenAIEmbedding result = await client.GenerateEmbeddingAsync(text);
    return result.ToFloats().ToArray();
}

static double CosineSimilarity(float[] left, float[] right)
{
    double dot = 0, leftNorm = 0, rightNorm = 0;
    for (int i = 0; i < left.Length; i++)
    {
        dot += left[i] * right[i];
        leftNorm += left[i] * left[i];
        rightNorm += right[i] * right[i];
    }
    return dot / Math.Sqrt(leftNorm * rightNorm);
}
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








#### 使用嵌入的推荐





  

Recommendation_using_embeddings.ipynb
 由于嵌入向量之间距离越短表示相似度越高，因此嵌入可用于推荐。

下面我们演示一个基础的推荐器。它接收一组字符串和一个“源”字符串，计算它们的嵌入，然后返回一个排序结果，按相似度从高到低对这些字符串进行排序。作为具体示例，下面的关联 notebook 将该函数的一个版本应用于 [AG 新闻数据集](http://groups.di.unipi.it/~gulli/AG_corpus_of_news_articles.html) （抽样缩减至 2,000 条新闻文章描述），以返回与任意给定源文章最相似的前 5 篇文章。

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
    strings: list[str],
    index_of_source_string: int,
    model="text-embedding-3-small",
) -> list[int]:
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

```go
import (
	"context"
	"fmt"
	"log"
	"math"
	"sort"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	ctx := context.Background()
	texts := []string{"A cheetah is a fast land animal.", "A peregrine falcon is a fast bird.", "A tortoise moves slowly."}
	vectors := make([][]float64, len(texts))
	for i, text := range texts {
		vector, err := embedding(ctx, &client, text)
		if err != nil {
			return err
		}
		vectors[i] = vector
	}
	query := vectors[0]
	matches := nearest(query, vectors)
	for _, match := range matches {
		fmt.Println(match.Index)
	}
	return nil
}

func embedding(ctx context.Context, client *openai.Client, text string) ([]float64, error) {
	response, err := client.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{OfString: openai.String(text)},
	})
	if err != nil {
		return nil, err
	}
	return response.Data[0].Embedding, nil
}

func cosineSimilarity(a, b []float64) float64 {
	var dot, left, right float64
	for i := range a {
		dot += a[i] * b[i]
		left += a[i] * a[i]
		right += b[i] * b[i]
	}
	return dot / math.Sqrt(left*right)
}

type match struct {
	Index      int
	Similarity float64
}

func nearest(query []float64, vectors [][]float64) []match {
	matches := make([]match, len(vectors))
	for i, vector := range vectors {
		matches[i] = match{Index: i, Similarity: cosineSimilarity(query, vector)}
	}
	sort.SliceStable(matches, func(i, j int) bool { return matches[i].Similarity > matches[j].Similarity })
	return matches
}
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

```csharp
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

string[] texts = ["A cheetah is a fast land animal.", "A peregrine falcon is a fast bird.", "A tortoise moves slowly."];
List<float[]> vectors = [];
foreach (string text in texts)
{
    vectors.Add(await EmbedAsync(client, text));
}
float[] query = vectors[0];
var ranked = vectors.Select((vector, index) => new { Index = index, Similarity = CosineSimilarity(query, vector) }).OrderByDescending(match => match.Similarity);
foreach (var match in ranked)
{
    Console.WriteLine(match.Index);
}

static async Task<float[]> EmbedAsync(EmbeddingClient client, string text)
{
    OpenAIEmbedding result = await client.GenerateEmbeddingAsync(text);
    return result.ToFloats().ToArray();
}

static double CosineSimilarity(float[] left, float[] right)
{
    double dot = 0, leftNorm = 0, rightNorm = 0;
    for (int i = 0; i < left.Length; i++)
    {
        dot += left[i] * right[i];
        leftNorm += left[i] * left[i];
        rightNorm += right[i] * right[i];
    }
    return dot / Math.Sqrt(leftNorm * rightNorm);
}
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
 嵌入向量的维度会随底层模型的复杂度而变化。为了可视化这些高维数据，我们使用 t-SNE 算法将其变换到二维空间。

我们根据评论者给出的星级对各条评论进行着色：

- 1 星：红色
- 2 星：深橙色
- 3 星：金色
- 4 星：青绿色
- 5 星：深绿色

可视化结果似乎大致生成了 3 个聚类，其中一个聚类的评论大多为负面评价。

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








#### 将 Embedding 用作机器学习算法的文本特征编码器





  

Regression_using_embeddings.ipynb
 嵌入可作为机器学习模型中通用的自由文本特征编码器。如果部分相关输入是自由文本，加入嵌入将提升任何机器学习模型的表现。嵌入也可以作为 ML 模型中的类别特征编码器。当类别变量的名称有意义且数量较多（如职位名称）时，这种做法尤为有价值。对于此任务，相似性嵌入通常比搜索嵌入表现更好。

我们观察到，嵌入表示通常非常丰富且信息密集。例如，使用 SVD 或 PCA 降低输入的维度，即使仅降低 10%，通常也会导致特定任务的下游表现变差。

此代码将数据划分为训练集和测试集，供后续两个用例（即回归和分类）使用。

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    list(df.ada_embedding.values), df.Score, test_size=0.2, random_state=42
)
```


#### 使用嵌入特征进行回归

嵌入提供了一种预测数值的好方法。在这个示例中，我们根据评论者的评论文本来预测其星级评分。由于嵌入中包含的语义信息十分丰富，即使评论数量很少，预测效果也相当不错。

我们假设评分是一个介于 1 到 5 之间的连续变量，并允许算法预测任意浮点值。该机器学习算法会最小化预测值与真实评分之间的距离，最终达到 0.39 的平均绝对误差，这意味着平均而言预测偏差小于半颗星。

```python
from sklearn.ensemble import RandomForestRegressor

rfr = RandomForestRegressor(n_estimators=100)
rfr.fit(X_train, y_train)
preds = rfr.predict(X_test)
```








#### 使用 embedding 特征进行分类





  

Classification_using_embeddings.ipynb
 这一次，我们不再让算法预测 1 到 5 之间的任意值，而是尝试将评论的精确星级数量归入 5 个分桶，范围从 1 星到 5 星。

训练后，模型对 1 星和 5 星评论的预测效果远好于更细微的评论（2-4 星），这可能是因为极端情感的表达到位。

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)
```








#### Zero-shot classification





  

Zero-shot_classification_with_embeddings.ipynb
 你可以使用嵌入进行零样本分类，无需任何已标注的训练数据。对于每个类别，嵌入该类别的名称或对该类别的简短描述。要以零样本方式对一些新文本进行分类时，将其嵌入与所有类别的嵌入进行比较，并预测相似度最高的类别。

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

```go
import (
	"context"
	"fmt"
	"log"
	"math"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	ctx := context.Background()
	negative, err := embedding(ctx, &client, "negative")
	if err != nil {
		return err
	}
	positive, err := embedding(ctx, &client, "positive")
	if err != nil {
		return err
	}
	review, err := embedding(ctx, &client, "Sample Review")
	if err != nil {
		return err
	}
	score := cosineSimilarity(review, positive) - cosineSimilarity(review, negative)
	prediction := "negative"
	if score > 0 {
		prediction = "positive"
	}
	fmt.Println(prediction)
	return nil
}

func embedding(ctx context.Context, client *openai.Client, text string) ([]float64, error) {
	response, err := client.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Model: openai.EmbeddingModelTextEmbedding3Small,
		Input: openai.EmbeddingNewParamsInputUnion{OfString: openai.String(text)},
	})
	if err != nil {
		return nil, err
	}
	return response.Data[0].Embedding, nil
}

func cosineSimilarity(a, b []float64) float64 {
	var dot, left, right float64
	for i := range a {
		dot += a[i] * b[i]
		left += a[i] * a[i]
		right += b[i] * b[i]
	}
	return dot / math.Sqrt(left*right)
}
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

```csharp
using OpenAI.Embeddings;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "text-embedding-3-small";
EmbeddingClient client = new(model, key);

float[] negative = await EmbedAsync(client, "negative");
float[] positive = await EmbedAsync(client, "positive");
float[] review = await EmbedAsync(client, "Sample Review");
double score = CosineSimilarity(review, positive) - CosineSimilarity(review, negative);
Console.WriteLine(score > 0 ? "positive" : "negative");

static async Task<float[]> EmbedAsync(EmbeddingClient client, string text)
{
    OpenAIEmbedding result = await client.GenerateEmbeddingAsync(text);
    return result.ToFloats().ToArray();
}

static double CosineSimilarity(float[] left, float[] right)
{
    double dot = 0, leftNorm = 0, rightNorm = 0;
    for (int i = 0; i < left.Length; i++)
    {
        dot += left[i] * right[i];
        leftNorm += left[i] * left[i];
        rightNorm += right[i] * right[i];
    }
    return dot / Math.Sqrt(leftNorm * rightNorm);
}
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








#### 获取用于冷启动推荐的用户和产品 embeddings





  

User_and_product_embeddings.ipynb
 我们可以通过对某个用户的所有评论取平均来得到该用户的嵌入。类似地，我们可以通过对某件产品的所有评论取平均来得到该产品的嵌入。为了展示这种方法的有效性，我们使用了一个包含 5 万条评论的子集，以便覆盖更多用户和产品的评论。

我们在单独的测试集上评估这些嵌入的有效性，其中我们将用户嵌入和产品嵌入的相似度绘制为评分的函数。有趣的是，基于这种方法，即使在用户收到产品之前，我们也能比随机猜测更准确地预测他们是否会喜欢该产品。

```python
user_embeddings = df.groupby("UserId").ada_embedding.apply(np.mean)
prod_embeddings = df.groupby("ProductId").ada_embedding.apply(np.mean)
```








#### 聚类





  

Clustering.ipynb
 聚类是理解海量文本数据的一种方式。嵌入（embedding）非常适合用于此任务，因为它们能为每段文本提供具有语义意义的向量表示。因此，集群可以在无监督的方式下发现我们数据集中隐藏的分组。

在本例中，我们发现了四个不同的聚类：一个聚焦于狗粮，一个聚焦于负面评价，还有两个聚焦于正面评价。

```python
import numpy as np
from sklearn.cluster import KMeans

matrix = np.vstack(df.ada_embedding.values)
n_clusters = 4

kmeans = KMeans(n_clusters=n_clusters, init="k-means++", random_state=42)
kmeans.fit(matrix)
df["Cluster"] = kmeans.labels_
```






## 常见问题解答

### 在嵌入字符串之前，如何判断它有多少个 token？

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


对于 `text-embedding-3-small`，等第三代嵌入模型，请使用 `cl100k_base` 编码。

更多详细信息和示例代码请参阅 OpenAI Cookbook 指南 [如何使用 tiktoken 计算 token 数](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

### 如何快速检索 K 个最近的嵌入向量？

如果需要快速检索大量向量，我们推荐使用向量数据库。你可以在我们的 Cookbook 中找到使用向量数据库和 OpenAI API 的示例 [中的示例](https://developers.openai.com/cookbook/examples/vector_databases/readme) on GitHub.

### 我应该使用哪种距离函数？

我们推荐 [余弦相似度](https://en.wikipedia.org/wiki/Cosine_similarity)。距离函数的选择通常影响不大。

OpenAI 嵌入已归一化为长度 1，这意味着：

- 余弦相似度可以通过仅使用点积来略微更快地计算
- 余弦相似度和欧几里得距离将产生相同的排名结果

### 我可以在网上分享我的嵌入吗？

是的，客户拥有我们模型输入和输出的所有权，包括在内嵌场景中也是如此。你需要确保你输入到我们API 的内容不违反任何适用法律或我们的 [使用条款](https://openai.com/policies/terms-of-use).

### V3 embedding 模型是否了解近期发生的事件？

不， `text-embedding-3-large` 和 `text-embedding-3-small` 模型缺乏对 2021 年 9 月之后发生的事件的了解。这通常不像对文本生成模型那样构成限制，但在某些边缘情况下可能会降低性能。