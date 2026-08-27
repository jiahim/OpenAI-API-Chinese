# 向量嵌入

> 如需查看完整文档索引，请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 什么是嵌入？

OpenAI 的文本嵌入用于衡量文本字符串之间的相关性。嵌入通常用于：

- **搜索** （其中结果按与查询字符串的相关性进行排名）
- **聚类** （其中文本字符串按相似度分组）
- **推荐** （其中推荐具有相关文本字符串的项目）
- **异常检测** （其中识别相关性较低的外围点）
- **多样性测量** （其中分析相似度分布）
- **分类** （其中文本字符串按其最相似的标签进行分类）

嵌入是一个浮点数向量（列表）。 [距离](#which-distance-function-should-i-use) 衡量两个向量之间的相关性。小距离表示高相关性，大距离表示低相关性。

访问我们的 [定价页面](https://openai.com/api/pricing/) 了解嵌入定价。请求根据 [令牌](https://platform.openai.com/tokenizer) 在 [输入](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings/create-input).

## 如何获取嵌入

要获取嵌入，请将你的文本字符串发送到 [embeddings API 端点](https://developers.openai.com/api/reference/resources/embeddings) ，同时附带嵌入模型名称（例如。， `text-embedding-3-small`):

示例：获取嵌入

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


响应包含嵌入向量（浮点数列表）以及一些附加元数据。你可以提取嵌入向量，将其保存在向量数据库中，并用于许多不同的用例。

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

默认情况下，嵌入向量的长度为 `1536` 对于 `text-embedding-3-small` 或 `3072` 对于 `text-embedding-3-large`。要在不损失其概念表示属性的情况下减小嵌入的维度，请传入 [dimensions 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions)。更多关于嵌入维度的详细信息，请参阅 [嵌入用例部分](#use-cases).

## 嵌入模型

OpenAI 提供两个强大的第三代嵌入模型（以模型 ID 中的 `-3` 表示）。请阅读嵌入 v3 [公告博客文章](https://openai.com/blog/new-embedding-models-and-api-updates) 以了解更多详情。

使用按输入 token 计费。以下是每 1 美元可处理的文本页数示例（假设每页约 800 个 token）：

| 模型                  | ~每美元页数 | 性能评价 [MTEB](https://github.com/embeddings-benchmark/mteb) 评估 | 最大输入 |
| ---------------------- | ------------------ | ------------------------------------------------------------------------ | --------- |
| text-embedding-3-small | 62,500             | 62.3%                                                                    | 8192      |
| text-embedding-3-large | 9,615              | 64.6%                                                                    | 8192      |
| text-embedding-ada-002 | 12,500             | 61.0%                                                                    | 8192      |

## 使用场景

下面我们展示一些有代表性的用例，使用 [Amazon 美食评论数据集](https://www.kaggle.com/snap/amazon-fine-food-reviews).

### 获取嵌入

该数据集包含截至 2012 年 10 月 Amazon 用户留下的 568,454 条食品评论。我们使用其中最新的 1,000 条评论子集作为示例。这些评论为英文，倾向于正面或负面。每条评论都有一个 `ProductId`, `UserId`, `Score`、评论标题（`Summary`）和评论正文（`Text`）。例如：




| Product Id | User Id        | Score | Summary               | Text                                              |
| ---------- | -------------- | ----- | --------------------- | ------------------------------------------------- |
| B001E4KFG0 | A3SGXH7AUHU8GW | 5     | Good Quality Dog Food | I have bought several of the Vitality canned...   |
| B00813GRG4 | A1D87F6ZCVE5NK | 1     | Not as Advertised     | Product arrived labeled as Jumbo Salted Peanut... |




下面，我们将点评摘要和点评文本合并为单一的合并文本。模型对这一合并文本进行编码，并输出一个单一的向量嵌入。



Get_embeddings_from_dataset.ipynb
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


要从已保存的文件加载数据，可以运行以下命令：

```python
import pandas as pd

df = pd.read_csv("output/embedded_1k_reviews.csv")
df["ada_embedding"] = df.ada_embedding.apply(eval).apply(np.array)
```


降低嵌入维度

使用更大的嵌入（例如，将其存储在向量存储中以供检索）通常比使用较小的嵌入成本更高，并且消耗更多的计算资源、内存和存储空间。

我们的两个新嵌入模型都经过训练，采用了 [一种技术](https://arxiv.org/abs/2205.13147) ，该技术允许开发者在嵌入的使用性能与成本之间进行权衡。具体来说，开发者可以通过传入 [`dimensions` API 参数来缩短嵌入（即从序列末尾删除一些数字），而不会使嵌入失去其表示概念的特性。](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions)。例如，在 MTEB 基准测试上，一个 `text-embedding-3-large` 嵌入可以缩短到 256 的大小，同时仍优于未缩短的 `text-embedding-ada-002` 大小为 1536 的嵌入。你可以通过我们的 [embeddings v3 发布博客文章](https://openai.com/blog/new-embedding-models-and-api-updates#:~:text=Native%20support%20for%20shortening%20embeddings).

一般来说，使用 `dimensions` 参数创建嵌入是推荐的方法。在某些情况下，你可能需要在生成嵌入后更改其维度。当你手动更改维度时，需要确保按照下面所示对嵌入的维度进行归一化。

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


动态更改维度可实现非常灵活的用途。例如，当使用仅支持最大 1024 维嵌入的向量数据存储时，开发者现在仍可以使用我们最好的嵌入模型 `text-embedding-3-large` ，并为 `dimensions` API 参数指定一个 1024 的值，这将把嵌入从 3072 维缩短，以牺牲一定精度为代价换取更小的向量大小。

使用基于嵌入的搜索进行问答



  

Question_answering_using_embeddings.ipynb
 在许多常见场景中，模型并未在包含关键事实和信息的训练数据上进行训练，而你可能希望在生成用户查询响应时让这些信息可访问。如下所示，解决这一问题的一种方法是将额外信息放入模型的上下文窗口中。这在许多用例中有效，但会导致更高的令牌成本。在本笔记本中，我们探讨了这种方法与基于嵌入的搜索之间的权衡。

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


使用嵌入进行文本搜索



  

Semantic_text_search_using_embeddings.ipynb
 为了检索最相关的文档，我们使用查询嵌入向量与每个文档之间的余弦相似度，并返回得分最高的文档。

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


使用嵌入进行代码搜索



  

Code_search.ipynb
 代码搜索的工作原理与基于嵌入的文本搜索类似。我们提供了一种方法，从给定仓库中的所有 Python 文件中提取 Python 函数。然后每个函数由 `text-embedding-3-small` 模型。

进行索引。为了执行代码搜索，我们使用同一模型以自然语言嵌入查询。然后我们计算生成的查询嵌入与每个函数嵌入之间的余弦相似度。余弦相似度最高的结果最为相关。

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


使用嵌入进行推荐



  

Recommendation_using_embeddings.ipynb
 由于嵌入向量之间距离越短表示相似度越高，嵌入可用于推荐。

下面，我们展示一个基本的推荐器。它接收一个字符串列表和一个“源”字符串，计算它们的嵌入，然后返回这些字符串的排序，从最相似到最不相似排列。作为一个具体示例，下方链接的笔记本将此函数的一个版本应用于 [AG news dataset](http://groups.di.unipi.it/~gulli/AG_corpus_of_news_articles.html) （抽样到 2,000 篇新闻文章描述），以返回与任何给定源文章最相似的 5 篇文章。

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


二维数据可视化



  

Visualizing_embeddings_in_2D.ipynb
 嵌入的大小随底层模型的复杂性而变化。为了可视化这些高维数据，我们使用 t-SNE 算法将数据转换为二维。

我们根据评论者给出的星级评分对各个评论进行着色：

- 1 星：红色
- 2 星：深橙色
- 3 星：金色
- 4 星：绿松石色
- 5 星：深绿色

可视化似乎产生了大约 3 个聚类，其中一个聚类主要是负面评论。

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


将嵌入作为机器学习算法的文本特征编码器



  

Regression_using_embeddings.ipynb
 嵌入可用作机器学习模型中通用的自由文本特征编码器。如果相关输入中有部分自由文本，融入嵌入将提升任何机器学习模型的性能。嵌入也可用作 ML 模型中的类别特征编码器。当类别变量的名称有实际意义且数量众多时（如职位名称），这一用途的价值最大。对于此类任务，相似性嵌入通常比搜索嵌入表现更佳。

我们观察到，嵌入表示通常信息非常丰富且密集。例如，即使使用 SVD 或 PCA 将输入维度降低 10%，通常也会导致特定任务的下游性能变差。

此代码将数据划分为训练集和测试集，供以下两个用例使用，即回归和分类。

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    list(df.ada_embedding.values), df.Score, test_size=0.2, random_state=42
)
```


#### 使用嵌入特征的回归

嵌入提供了一种优雅的方式来预测数值。在这个例子中，我们根据评论者的评论文本来预测其星级评分。由于嵌入中包含的语义信息丰富，即使评论数量很少，预测效果也相当不错。

我们假设评分是1到5之间的连续变量，并允许算法预测任意浮点值。机器学习算法最小化预测值与真实评分之间的距离，平均绝对误差为0.39，这意味着平均预测偏离不到半颗星。

```python
from sklearn.ensemble import RandomForestRegressor

rfr = RandomForestRegressor(n_estimators=100)
rfr.fit(X_train, y_train)
preds = rfr.predict(X_test)
```


使用嵌入特征进行分类



  

Classification_using_embeddings.ipynb
 这次，我们不是让算法预测1到5之间的任意值，而是尝试将评论的精确星级分类到5个桶中，范围从1星到5星。

训练后，模型对1星和5星评论的预测效果远好于更细致的评论（2-4星），这很可能是由于更极端的情感表达。

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)
```


零样本分类



  

Zero-shot_classification_with_embeddings.ipynb
 我们可以使用嵌入进行零样本分类，无需任何带标签的训练数据。对于每个类别，我们嵌入类别名称或类别的简短描述。为了以零样本方式对新文本进行分类，我们将其嵌入与所有类别嵌入进行比较，并预测相似度最高的类别。

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


获取用户和产品嵌入以进行冷启动推荐



  

User_and_product_embeddings.ipynb
 我们可以通过对用户的所有评论取平均来获得用户嵌入。类似地，我们可以通过对该产品的所有评论取平均来获得产品嵌入。为了展示这种方法的实用性，我们使用了5万条评论的子集，以覆盖每个用户和每个产品的更多评论。

我们在一个单独的测试集上评估这些嵌入的有效性，绘制用户和产品嵌入的相似度与评分的关系。有趣的是，基于这种方法，即使在用户收到产品之前，我们也能比随机更好地预测他们是否会喜欢该产品。

```python
user_embeddings = df.groupby("UserId").ada_embedding.apply(np.mean)
prod_embeddings = df.groupby("ProductId").ada_embedding.apply(np.mean)
```


聚类



  

Clustering.ipynb
 聚类是理解大量文本数据的一种方式。嵌入对此任务很有用，因为它们提供了每个文本的语义上有意义的向量表示。因此，以无监督的方式，聚类将揭示数据集中隐藏的分组。

在这个例子中，我们发现了四个不同的簇：一个关注狗粮，一个关注负面评论，还有两个关注正面评论。

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

### 在嵌入字符串之前，我如何判断它包含多少个令牌？

在 Python 中，你可以使用 OpenAI 的分词器将字符串拆分为令牌 [`tiktoken`](https://github.com/openai/tiktoken).

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


对于第三代嵌入模型，如 `text-embedding-3-small`，请使用 `cl100k_base` 编码。

更多详细信息和示例代码请参阅 OpenAI Cookbook 指南 [如何使用 tiktoken 计数令牌](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

### 如何快速检索 K 个最近的嵌入向量？

为了快速搜索大量向量，我们建议使用向量数据库。你可以在我们的 Cookbook 中找到使用向量数据库和 OpenAI API 的示例 [中](https://developers.openai.com/cookbook/examples/vector_databases/readme) 在 GitHub 上。

### 我应该使用哪种距离函数？

我们推荐 [余弦相似度](https://en.wikipedia.org/wiki/Cosine_similarity)。距离函数的选择通常影响不大。

OpenAI 嵌入已归一化至长度为 1，这意味着：

- 余弦相似度可以仅通过点积计算，速度稍快一些
- 余弦相似度和欧氏距离将产生相同的排名结果

### 我可以在线分享我的嵌入吗？

是的，客户拥有其输入和输出自我们模型的数据，包括嵌入的情况。你负责确保你输入到我们 API 的内容不违反任何适用法律或我们的 [使用条款](https://openai.com/policies/terms-of-use).

### V3 嵌入模型是否了解近期事件？

不， `text-embedding-3-large` 和 `text-embedding-3-small` 模型缺少对 2021 年 9 月之后发生事件的了解。对于文本生成模型来说，这通常不会造成多大的限制，但在某些边缘情况下，它可能会降低性能。