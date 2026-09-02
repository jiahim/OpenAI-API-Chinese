# Web QA with embeddings

> 完整文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

本教程通过一个简单的示例，演示如何爬取一个网站（本例中为 OpenAI 网站），并使用 [Embeddings API](https://developers.openai.com/api/docs/guides/embeddings)，将爬取的页面转换为 embeddings，然后创建一个基本的搜索功能，允许用户针对已嵌入的信息进行提问。本教程旨在作为更复杂的基于自定义知识库的应用程序的起点。

# 入门

具备一些 Python 和 GitHub 基础知识会帮助你更好地完成本教程。在开始之前，请务必 [设置好 OpenAI API 密钥](https://developers.openai.com/api/reference/overview) 并完成 [快速入门教程](https://developers.openai.com/api/docs/quickstart)。这将帮助你建立良好的直觉，充分发挥 API 的潜力。

本教程使用 Python 作为主要编程语言，并搭配 OpenAI、Pandas、transformers、NumPy 等常用库。如果你在学习本教程时遇到任何问题，请在 [OpenAI 社区论坛](https://community.openai.com).

要开始编写代码，请克隆 [GitHub 上本教程的完整代码](https://github.com/openai/web-crawl-q-and-a-example)。或者，你也可以跟随教程将每个部分逐步复制到 Jupyter notebook 中并运行代码，或者直接阅读。避免出现问题的一个好方法是新建一个虚拟环境，并通过运行以下命令来安装所需的包：

```bash
python -m venv env

source env/bin/activate

pip install -r requirements.txt
```

## 设置网页爬虫

本教程的核心重点是 OpenAI API，因此如果你愿意，可以跳过关于如何创建网络爬虫的背景说明，直接 [下载源代码](https://github.com/openai/web-crawl-q-and-a-example)。否则，请展开下方章节以完成抓取机制的实现。



### 了解如何构建一个网络爬虫





  

    Acquiring data in text form is the first step to use embeddings. This
      tutorial creates a new set of data by crawling the OpenAI website, a
      technique that you can also use for your own company or personal website.
    

    

      

查看源代码


    

  




虽然这个爬虫是从零编写的，但像 [Scrapy](https://github.com/scrapy/scrapy) 这样的开源包也可以帮助你完成这些操作。

该爬虫会从下方代码末尾传入的根 URL 出发，访问每个页面，查找其中的其他链接，并继续访问这些页面（只要它们属于同一个根域名）。首先，导入所需的包，设置基础 URL，并定义一个 HTMLParser 类。

```python
import requests
import re
import urllib.request
from bs4 import BeautifulSoup
from collections import deque
from html.parser import HTMLParser
from urllib.parse import urlparse
import os

# Regex pattern to match a URL
HTTP_URL_PATTERN = r"^http[s]*://.+"

domain = "openai.com"  # <- put your domain to be crawled
full_url = "https://openai.com/"  # <- put your domain to be crawled with https or http


# Create a class to parse the HTML and get the hyperlinks
class HyperlinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        # Create a list to store the hyperlinks
        self.hyperlinks = []

    # Override the HTMLParser's handle_starttag method to get the hyperlinks
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)

        # If the tag is an anchor tag and it has an href attribute, add the href attribute to the list of hyperlinks
        if tag == "a" and "href" in attrs:
            self.hyperlinks.append(attrs["href"])
```


下一个函数接受一个 URL 作为参数，打开该 URL 并读取 HTML 内容，然后返回在该页面上找到的所有超链接。

```python
# Function to get the hyperlinks from a URL
def get_hyperlinks(url):
    # Try to open the URL and read the HTML
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            # If the response is not HTML, return an empty list
            if not response.info().get("Content-Type", "").startswith("text/html"):
                return []

            # Decode the HTML
            html = response.read().decode("utf-8")
    except Exception as error:
        print(error)
        return []

    # Create the HTML Parser and then Parse the HTML to get hyperlinks
    parser = HyperlinkParser()
    parser.feed(html)

    return parser.hyperlinks
```


目标是仅抓取并索引 OpenAI 域名下的内容。为此，需要一个函数来调用 `get_hyperlinks` 函数，但过滤掉任何不属于指定域名的 URL。

```python
# Function to get the hyperlinks from a URL that are within the same domain
def get_domain_hyperlinks(local_domain, url):
    clean_links = []
    for link in set(get_hyperlinks(url)):
        clean_link = None

        # If the link is a URL, check if it is within the same domain
        if re.search(HTTP_URL_PATTERN, link):
            # Parse the URL and check if the domain is the same
            url_obj = urlparse(link)
            if url_obj.netloc == local_domain:
                clean_link = link

        # If the link is not a URL, check if it is a relative link
        else:
            if link.startswith("/"):
                link = link[1:]
            elif link.startswith("#") or link.startswith("mailto:"):
                continue
            clean_link = "https://" + local_domain + "/" + link

        if clean_link is not None:
            if clean_link.endswith("/"):
                clean_link = clean_link[:-1]
            clean_links.append(clean_link)

    # Return the list of hyperlinks that are within the same domain
    return list(set(clean_links))
```


该 `crawl` 函数是网页抓取任务设置中的最后一步。它会记录已访问的 URL，以避免重复访问同一页面（同一页面可能被站点上多个页面链接到）。它还会从页面中提取去除 HTML 标签后的纯文本，并将文本内容写入该页面专属的本地 .txt 文件中。

```python
def crawl(url):
    # Parse the URL and get the domain
    local_domain = urlparse(url).netloc

    # Create a queue to store the URLs to crawl
    queue = deque([url])

    # Create a set to store the URLs that have already been seen (no duplicates)
    seen = set([url])

    # Create a directory to store the text files
    if not os.path.exists("text/"):
        os.mkdir("text/")

    if not os.path.exists("text/" + local_domain + "/"):
        os.mkdir("text/" + local_domain + "/")

    # Create a directory to store the csv files
    if not os.path.exists("processed"):
        os.mkdir("processed")

    # While the queue is not empty, continue crawling
    while queue:
        # Get the next URL from the queue
        url = queue.pop()
        print(url)  # for debugging and to see the progress

        # Save text from the url to a <url>.txt file
        page_name = (local_domain + urlparse(url).path).replace("/", "_")
        with open(
            "text/" + local_domain + "/" + page_name + ".txt",
            "w",
            encoding="UTF-8",
        ) as f:
            # Get the text from the URL using BeautifulSoup
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")

            # Get the text but remove the tags
            text = soup.get_text()

            # If the crawler gets to a page that requires JavaScript, it will stop the crawl
            if "You need to enable JavaScript to run this app." in text:
                print(
                    "Unable to parse page " + url + " due to JavaScript being required"
                )

            # Otherwise, write the text to the file in the text directory
            f.write(text)

        # Get the hyperlinks from the URL and add them to the queue
        for link in get_domain_hyperlinks(local_domain, url):
            if link not in seen:
                queue.append(link)
                seen.add(link)


crawl(full_url)
```


上述示例的最后一行会运行爬虫，遍历所有可访问的链接，并将这些页面转换为文本文件。运行所需时间取决于你的站点规模和复杂度，可能需要几分钟。





## 构建嵌入索引



  

    CSV is a common format for storing embeddings. You can use this format
      with Python by converting the raw text files (which are in the text
      directory) into Pandas data frames. Pandas is a popular open source
      library that helps you work with tabular data (data stored in rows and
      columns).
    

    

      Blank empty lines can clutter the text files and make them harder to
      process. A simple function can remove those lines and tidy up the files.
    

  




```python
def remove_newlines(serie):
    serie = serie.str.replace("\n", " ")
    serie = serie.str.replace("\\n", " ")
    serie = serie.str.replace("  ", " ")
    serie = serie.str.replace("  ", " ")
    return serie
```


将文本转换为 CSV 需要遍历先前创建的文本目录中的文本文件。打开每个文件后，去除多余的空格，并将修改后的文本追加到列表中。然后，将去除换行符后的文本添加到空的 Pandas 数据框中，并将数据框写入 CSV 文件。

多余的空格和换行符会使文本变得杂乱，并使嵌入过程变得复杂
  过程。这里使用的代码有助于去除其中一部分字符，但你可能会发现第三方
  库或其他方法有助于去除更多不必要的
  字符。

```python
import pandas as pd

# Create a list to store the text files
texts = []

# Get all the text files in the text directory
for file in os.listdir("text/" + domain + "/"):
    # Open the file and read the text
    with open("text/" + domain + "/" + file, "r", encoding="UTF-8") as f:
        text = f.read()

        page_name = Path(file).stem
        domain_prefix = f"{domain}_"
        if page_name.startswith(domain_prefix):
            page_name = page_name[len(domain_prefix) :]
        elif page_name == domain:
            page_name = "index"

        # Replace -, _, and #update with spaces.
        texts.append(
            (
                page_name.replace("-", " ").replace("_", " ").replace("#update", ""),
                text,
            )
        )

# Create a dataframe from the list of texts
df = pd.DataFrame(texts, columns=["fname", "text"])

# Set the text column to be the raw text with the newlines removed
df["text"] = df.fname + ". " + remove_newlines(df.text)
df.to_csv("processed/scraped.csv")
df.head()
```


在将原始文本保存到 CSV 文件之后，下一步是分词。此过程通过拆分句子和单词将输入文本拆分为词元。可以通过以下方式直观地了解这一过程 [查看文档中的分词器](https://platform.openai.com/tokenizer) 文档。

> 一个实用的经验法则是，对于常见的英文文本，一个标记通常对应约 4 个字符。这大约相当于四分之三个单词（即 100 个标记 ~= 75 个单词）。

该 API 对嵌入的最大输入 token 数有限制。为了保持在该限制之内，CSV 文件中的文本需要拆分为多行。首先记录每行的现有长度，以识别哪些行需要拆分。

```python
import tiktoken

# Load the cl100k_base tokenizer which is designed to work with the ada-002 model
tokenizer = tiktoken.get_encoding("cl100k_base")

df = pd.read_csv("processed/scraped.csv", index_col=0)
df.columns = ["title", "text"]

# Tokenize the text and save the number of tokens to a new column
df["n_tokens"] = df.text.apply(lambda x: len(tokenizer.encode(x)))

# Visualize the distribution of the number of tokens per row using a histogram
df.n_tokens.hist()
```




  

    <img src="https://cdn.openai.com/API/docs/images/tutorials/web-qa/embeddings-initial-histrogram.png"
      alt="Embeddings histogram"
      width="553"
      height="413"
    />
  




最新的嵌入模型最多可以处理 8191 个输入 token，因此大多数行不需要进行分块，但并非每个抓取的子页面都是如此，因此下一段代码会将较长的行拆分为更小的块。

```python
max_tokens = 500


# Function to split the text into chunks of a maximum number of tokens
def split_into_many(text, max_tokens=max_tokens):

    # Split the text into sentences
    sentences = text.split(". ")

    # Get the number of tokens for each sentence
    n_tokens = [len(tokenizer.encode(" " + sentence)) for sentence in sentences]

    chunks = []
    tokens_so_far = 0
    chunk = []

    # Loop through the sentences and tokens joined together in a tuple
    for sentence, token in zip(sentences, n_tokens):
        # If the number of tokens so far plus the number of tokens in the current sentence is greater
        # than the max number of tokens, then add the chunk to the list of chunks and reset
        # the chunk and tokens so far
        if tokens_so_far + token > max_tokens:
            chunks.append(". ".join(chunk) + ".")
            chunk = []
            tokens_so_far = 0

        # If the number of tokens in the current sentence is greater than the max number of
        # tokens, go to the next sentence
        if token > max_tokens:
            continue

        # Otherwise, add the sentence to the chunk and add the number of tokens to the total
        chunk.append(sentence)
        tokens_so_far += token + 1

    return chunks


shortened = []

# Loop through the dataframe
for row in df.iterrows():
    # If the text is None, go to the next row
    if row[1]["text"] is None:
        continue

    # If the number of tokens is greater than the max number of tokens, split the text into chunks
    if row[1]["n_tokens"] > max_tokens:
        shortened += split_into_many(row[1]["text"])

    # Otherwise, add the text to the list of shortened texts
    else:
        shortened.append(row[1]["text"])
```


再次可视化更新后的直方图有助于确认行是否已成功拆分为更短的部分。

```python
df = pd.DataFrame(shortened, columns=["text"])
df["n_tokens"] = df.text.apply(lambda x: len(tokenizer.encode(x)))
df.n_tokens.hist()
```




  

    <img src="https://cdn.openai.com/API/docs/images/tutorials/web-qa/embeddings-tokenized-output.png"
      alt="Embeddings tokenized output"
      width="552"
      height="418"
    />
  




内容现在已被拆分为更小的块，可以向 OpenAI API 发送一个简单的请求，指定使用新的 text-embedding-ada-002 模型来创建嵌入：

```python
from openai import OpenAI

client = OpenAI()

df["embeddings"] = df.text.apply(
    lambda x: client.embeddings.create(
        input=x, model="text-embedding-3-small"
    ).data[0].embedding
)

df.to_csv("processed/embeddings.csv")
df.head()
```


这大约需要 3-5 分钟，但完成后你将拥有可立即使用的嵌入！

## 使用你的 embeddings 构建问答系统



  

    The embeddings are ready and the final step of this process is to create a
      simple question and answer system. This will take a user's question,
      create an embedding of it, and compare it with the existing embeddings to
      retrieve the most relevant text from the scraped website. The
      gpt-3.5-turbo-instruct model will then generate a natural sounding answer
      based on the retrieved text.
    

  




---

将嵌入向量转换为 NumPy 数组是第一步，这将为后续使用提供更多灵活性，因为有许多函数可对 NumPy 数组进行操作。它还会将维度展平为 1-D，而这是许多后续操作所要求的格式。

```python
import numpy as np

df = pd.read_csv("processed/embeddings.csv", index_col=0)
df["embeddings"] = df["embeddings"].apply(eval).apply(np.array)

df.head()
```


数据准备就绪后，只需通过一个简单的函数即可将问题转换为嵌入向量。这很重要，因为基于嵌入的搜索会使用余弦距离来比较这些数字向量（即原始文本转换后的结果）。如果向量在余弦距离上接近，它们很可能是相关的，并可能回答该问题。OpenAI Python 包内置了一个 `distances_from_embeddings` 函数，在这里非常实用。

```python
def create_context(question, df, max_len=1800, size="ada"):
    """
    Create a context for a question by finding the most similar context from the dataframe
    """

    # Get the embeddings for the question
    q_embeddings = (
        client.embeddings.create(input=question, model="text-embedding-3-small")
        .data[0]
        .embedding
    )

    # Get the distances from the embeddings
    df["distances"] = distances_from_embeddings(
        q_embeddings, df["embeddings"].values, distance_metric="cosine"
    )

    returns = []
    cur_len = 0

    # Sort by distance and add the text to the context until the context is too long
    for _, row in df.sort_values("distances", ascending=True).iterrows():
        # Add the length of the text to the current length
        cur_len += row["n_tokens"] + 4

        # If the context is too long, break
        if cur_len > max_len:
            break

        # Else add it to the text that is being returned
        returns.append(row["text"])

    # Return the context
    return "\n\n###\n\n".join(returns)
```


文本被拆分为较小的 token 集合，因此按升序循环并持续拼接文本是确保获得完整答案的关键步骤。如果返回的内容超过所需，也可以将 max_len 修改为更小的值。

上一步仅检索了与问题语义相关的文本片段，它们可能包含答案，但并不能保证一定包含。通过返回前 5 个最可能的结果，可以进一步提高找到答案的概率。

回答提示词随后会尝试从检索到的上下文中提取相关事实，以组织出连贯的答案。如果没有相关答案，提示词将返回“I don’t know”。

可以使用补全接口生成一个听起来真实可信的答案，使用 `gpt-3.5-turbo-instruct`.

```python
def answer_question(
    df,
    model="gpt-3.5-turbo-instruct",
    question="Am I allowed to publish model outputs to Twitter, without a human review?",
    max_len=1800,
    size="ada",
    debug=False,
    max_tokens=150,
    stop_sequence=None,
):
    """
    Answer a question based on the most similar context from the dataframe texts
    """
    context = create_context(
        question,
        df,
        max_len=max_len,
        size=size,
    )
    # If debug, print the raw model response
    if debug:
        print("Context:\n" + context)
        print("\n\n")

    try:
        # Create a completion using the question and context
        response = client.completions.create(
            model=model,
            prompt=(
                "Answer the question based on the context below, and if the "
                "question can't be answered based on the context, say "
                '"I don\'t know"'
                f"\n\nContext: {context}\n\n---\n\nQuestion: {question}\nAnswer:"
            ),
            temperature=0,
            max_tokens=max_tokens,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=stop_sequence,
        )
        return response.choices[0].text.strip()
    except Exception as error:
        print(error)
        return ""
```


完成了！一个嵌入了 OpenAI 网站知识的可用的问答系统现已就绪。可以进行一些快速测试以查看输出质量：

```python
answer_question(df, question="What day is it?", debug=False)

answer_question(df, question="What is our newest embeddings model?")

answer_question(df, question="What is ChatGPT?")
```


响应大致如下所示：

```response
"I don't know."

'The newest embeddings model is text-embedding-ada-002.'

'ChatGPT is a model trained to interact in a conversational way. It is able to answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests.'
```

如果系统无法回答一个预期中应该能回答的问题，建议在原始文本文件中搜索一下，看一下期望被了解的信息是否确实已被嵌入。最初执行的爬取过程设置为跳过原始域名之外的站点，因此如果存在子域名，它可能并不具备相关知识。

目前，每次回答问题时都会传入该 dataframe。对于更接近生产环境的 [向量数据库方案](https://developers.openai.com/api/docs/guides/embeddings#how-can-i-retrieve-k-nearest-embedding-vectors-quickly) 应该用于替代将嵌入向量存储在 CSV 文件中的方式，但当前方法非常适合用于原型开发。