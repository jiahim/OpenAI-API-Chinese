# 为插件和 API 集成构建 MCP 服务器

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

[Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) 是一个开放协议，正逐渐成为通过额外工具和知识扩展 AI 模型的事实行业标准。远程 MCP 服务器可用于通过互联网将模型连接到新的数据源和能力。

在本指南中，我们将介绍如何构建一个远程 MCP 服务器，该服务器从私有数据源（一个 [vector store](https://developers.openai.com/api/docs/guides/retrieval)）读取数据，并通过 ChatGPT 和 Codex 中的插件、通过 ChatGPT 深度研究与公司知识，以及通过 [API](https://developers.openai.com/api/docs/guides/deep-research).

**注意**：要使用 MCP 服务器构建插件，请从插件文档开始： [快速入门](https://developers.openai.com/plugins/quickstart), [构建你的 MCP 服务器](https://developers.openai.com/plugins/build/mcp-server), [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt)，以及 [身份验证](https://developers.openai.com/plugins/build/auth)。如果你的 MCP 服务器不需要 UI，可以在不提供 UI 资源的情况下暴露工具。

## 配置数据源

你可以使用来自任何来源的数据来驱动远程 MCP 服务器，但为简便起见，我们将使用 [向量存储](https://developers.openai.com/api/docs/guides/retrieval) 中的OpenAI API。首先将一个 PDF 文档上传到新的向量存储—— [你可以使用这本关于猫的 19 世纪公有领域图书作为示例](https://cdn.openai.com/API/docs/cats.pdf) 作为示例。

你可以上传文件并创建一个向量存储 [在此处的控制台中](https://platform.openai.com/storage/vector_stores)，或者你也可以通过API创建向量存储并上传文件。 [参考向量存储指南](https://developers.openai.com/api/docs/guides/retrieval) 以设置向量存储并向其中上传文件。

记下该向量存储的唯一 ID，以在接下来的示例中使用。

![向量存储配置](https://cdn.openai.com/API/docs/images/vector_store.png)

## 创建一个 MCP 服务器

接下来，我们来创建一个远程 MCP 服务器，它将对我们的向量存储执行搜索查询，并能够根据给定的 ID 返回文件的内容。

在本示例中，我们将使用 Python 和 [FastMCP](https://github.com/jlowin/fastmcp)。服务器的完整实现出现在本节末尾，并附有在 [基于浏览器的开发环境](https://replit.com/).

请注意，还有许多其他 MCP 服务器框架可用于各种编程语言。不过无论使用哪种框架，你的服务器中的工具定义都必须符合此处描述的形态。

若要与 ChatGPT 深度研究及公司知识协同工作，你的 MCP 服务器
应当实现两个只读工具： `search` 和 `fetch`，使用
中的兼容性架构 [公司知识兼容性](https://developers.openai.com/plugins/build/mcp-server#company-knowledge-compatibility).
通过 API，同一接口对研究工作流也很有用。

为每个工具声明输出架构，以便客户端能够校验结果的形态。
在 FastMCP 中，类型化的返回模型可以自动生成该架构；
下面的示例显式传递了 `output_schema` 与这些模型相同的类型。

### `search` tool

该 `search` 该工具负责根据用户的查询，从你的 MCP 服务器的数据源返回一份相关搜索结果列表。

_参数：_

单个查询字符串。

_返回：_

一个具有单个键的对象， `results`，其值是一个结果对象数组。每个结果对象应包含：

- `id` - 文档或搜索结果项的唯一标识
- `title` - 人类可读的标题。
- `url` - 用于引用的规范 URL。

在 MCP 中，将此对象作为 `structuredContent` 返回，并在
数组中以 JSON 编码字符串形式包含相同的值， [content](https://modelcontextprotocol.io/docs/learn/architecture#understanding-the-tool-execution-response)
以保持兼容性。

最终的工具响应应如下所示：

```json
{
  "structuredContent": {
    "results": [{ "id": "doc-1", "title": "...", "url": "..." }]
  },
  "content": [
    {
      "type": "text",
      "text": "{\"results\":[{\"id\":\"doc-1\",\"title\":\"...\",\"url\":\"...\"}]}"
    }
  ]
}
```

### `fetch` tool

fetch 工具用于检索搜索结果文档或条目的完整内容。

_参数：_

作为搜索文档唯一标识符的字符串。

_返回：_

具有以下属性的单个对象：

- `id` - 文档或搜索结果项的唯一标识
- `title` - 搜索结果项的字符串标题
- `text` - 文档或项的完整文本
- `url` - 文档或搜索结果项的 URL。可用于在研究
  中引用特定资源。
- `metadata` - 关于结果的可选键/值数据对

在 MCP 中，将此对象作为 `structuredContent` 返回，并在
为兼容性，在 content 数组中使用 JSON 编码的字符串。

最终的工具响应应如下所示：

```json
{
  "structuredContent": {
    "id": "doc-1",
    "title": "...",
    "text": "full text...",
    "url": "https://example.com/doc",
    "metadata": { "source": "vector_store" }
  },
  "content": [
    {
      "type": "text",
      "text": "{\"id\":\"doc-1\",\"title\":\"...\",\"text\":\"full text...\",\"url\":\"https://example.com/doc\",\"metadata\":{\"source\":\"vector_store\"}}"
    }
  ]
}
```

### 引用行为

对于 `search` results 和 `fetch` responses，ChatGPT 仅在以下情况下创建引用
元数据： `url` 是非空字符串时。如果某个结果有 `title` 但没有
可用的 `url` ，则它仍只是普通的工具输出，而不会成为空的
引用。若要使结果可被引用，请返回其规范的 `url`.

。例如，ChatGPT 可能会使用以下方式调用 `search` ：

```json
{ "query": "What is the quarterly plan?" }
```

MCP 服务器可以使用由 URL 支持的结果进行响应：

```json
{
  "structuredContent": {
    "results": [
      {
        "id": "quarterly-plan",
        "title": "Quarterly plan",
        "url": "https://example.com/quarterly-plan"
      }
    ]
  },
  "content": [
    {
      "type": "text",
      "text": "{\"results\":[{\"id\":\"quarterly-plan\",\"title\":\"Quarterly plan\",\"url\":\"https://example.com/quarterly-plan\"}]}"
    }
  ]
}
```

在此响应中， `url` 字段有值，这使得该结果有资格获得
引用元数据。查询本身不会触发引用处理。如果
结果省略了 `url`，或提供了空值或非字符串值，ChatGPT
会将该结果保留为普通的工具输出。

### 服务端示例

你可以在 [基于浏览器的开发环境](https://replit.com/)。中试用这个示例 MCP 服务器。配置示例时填入你自己的 API 凭据和 vector store 信息。

[Replit 上的示例 MCP 服务器



      Remix the server example on Replit to test live.](https://replit.com/@kwhinnery-oai/DeepResearchServer?v=1#README.md)

下面还提供了使用 FastMCP 实现这两种 `search` 和 `fetch` 工具的完整实现，方便参考。



#### 完整实现 - FastMCP 服务



```python
# Replace the illustrative IDs and URLs below with your own resource values.
"""
Sample MCP Server for ChatGPT Integration

This server implements the Model Context Protocol (MCP) with search and fetch
capabilities designed to work with ChatGPT's chat and deep research features.
"""

import logging
import os
from typing import Any

from fastmcp import FastMCP
from openai import OpenAI
from pydantic import BaseModel


class SearchResult(BaseModel):
    id: str
    title: str
    url: str


class SearchOutput(BaseModel):
    results: list[SearchResult]


class FetchOutput(BaseModel):
    id: str
    title: str
    text: str
    url: str
    metadata: dict[str, Any] | None = None


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenAI configuration
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
VECTOR_STORE_ID = "vs_123"

# Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY)

server_instructions = """
This MCP server provides search and document retrieval capabilities
for ChatGPT Apps and deep research. Use the search tool to find relevant documents
based on keywords, then use the fetch tool to retrieve complete
document content with citations.
"""


def create_server():
    """Create and configure the MCP server with search and fetch tools."""

    # Initialize the FastMCP server
    mcp = FastMCP(name="Sample MCP Server", instructions=server_instructions)

    @mcp.tool(output_schema=SearchOutput.model_json_schema())
    async def search(query: str) -> SearchOutput:
        """
        Search for documents using OpenAI Vector Store search.

        This tool searches through the vector store to find semantically relevant matches.
        Returns a list of search results with basic information. Use the fetch tool to get
        complete document content.

        Args:
            query: Search query string. Natural language queries work best for semantic search.

        Returns:
            Dictionary with 'results' key containing list of matching documents.
            Each result includes id, title, and URL.
        """
        if not query or not query.strip():
            return SearchOutput(results=[])

        if not openai_client:
            logger.error("OpenAI client not initialized - API key missing")
            raise ValueError("OpenAI API key is required for vector store search")

        # Search the vector store using OpenAI API
        logger.info(f"Searching {VECTOR_STORE_ID} for query: '{query}'")

        response = openai_client.vector_stores.search(
            vector_store_id=VECTOR_STORE_ID, query=query
        )

        results = []

        # Process the vector store search results
        if hasattr(response, "data") and response.data:
            for i, item in enumerate(response.data):
                # Extract file_id, filename, and content
                item_id = getattr(item, "file_id", f"vs_{i}")
                item_filename = getattr(item, "filename", f"Document {i + 1}")

                result = SearchResult(
                    id=item_id,
                    title=item_filename,
                    url=f"https://platform.openai.com/storage/files/{item_id}",
                )

                results.append(result)

        logger.info(f"Vector store search returned {len(results)} results")
        return SearchOutput(results=results)

    @mcp.tool(output_schema=FetchOutput.model_json_schema())
    async def fetch(id: str) -> FetchOutput:
        """
        Retrieve complete document content by ID for detailed
        analysis and citation. This tool fetches the full document
        content from OpenAI Vector Store. Use this after finding
        relevant documents with the search tool to get complete
        information for analysis and proper citation.

        Args:
            id: File ID from vector store (file-xxx) or local document ID

        Returns:
            Complete document with id, title, full text content,
            optional URL, and metadata

        Raises:
            ValueError: If the specified ID is not found
        """
        if not id:
            raise ValueError("Document ID is required")

        if not openai_client:
            logger.error("OpenAI client not initialized - API key missing")
            raise ValueError(
                "OpenAI API key is required for vector store file retrieval"
            )

        logger.info(f"Fetching content from vector store for file ID: {id}")

        # Fetch file content from vector store
        content_response = openai_client.vector_stores.files.content(
            vector_store_id=VECTOR_STORE_ID, file_id=id
        )

        # Get file metadata
        file_info = openai_client.vector_stores.files.retrieve(
            vector_store_id=VECTOR_STORE_ID, file_id=id
        )

        # Extract content from paginated response
        file_content = ""
        if hasattr(content_response, "data") and content_response.data:
            # Combine all content chunks from FileContentResponse objects
            content_parts = []
            for content_item in content_response.data:
                if hasattr(content_item, "text"):
                    content_parts.append(content_item.text)
            file_content = "\n".join(content_parts)
        else:
            file_content = "No content available"

        # Use filename as title and create proper URL for citations
        filename = getattr(file_info, "filename", f"Document {id}")

        result = FetchOutput(
            id=id,
            title=filename,
            text=file_content,
            url=f"https://platform.openai.com/storage/files/{id}",
        )

        # Add metadata if available from file info
        if hasattr(file_info, "attributes") and file_info.attributes:
            result.metadata = dict(file_info.attributes)

        logger.info(f"Fetched vector store file: {id}")
        return result

    return mcp


def main():
    """Main function to start the MCP server."""
    logger.info(f"Using vector store: {VECTOR_STORE_ID}")

    # Create the MCP server
    server = create_server()

    # Configure and start the server
    logger.info("Starting MCP server on 0.0.0.0:8000")
    logger.info("Server will be accessible via SSE transport")

    try:
        # Use FastMCP's built-in run method with SSE transport
        port = int(os.environ.get("OPENAI_EXAMPLE_PORT", "8000"))
        server.run(
            transport="sse",
            host="0.0.0.0",
            port=port,
            uvicorn_config={"loop": "asyncio"},
        )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        raise


if __name__ == "__main__":
    main()
```








#### Replit 设置



在 Replit 上配置 `OPENAI_API_KEY` ，在 “Secrets” 界面中填入你的 OpenAI API key。在示例中，将 `vs_123` 替换为你之前为搜索创建的向量存储的 ID。

在免费版 Replit 账户上，只要编辑器处于活动状态，服务端 URL 就一直有效，因此在测试时你需要保持浏览器标签页处于打开状态。点击链条图标即可获取 MCP server 的 URL：

![replit configuration](https://cdn.openai.com/API/docs/images/replit.png)

在长版开发 URL 中，确保其结尾为 `/sse/`，这是 MCP server 的 server-sent events（流式）接口。你将使用此 URL 在 ChatGPT 中连接你的应用，并通过 API 进行调用。一个 Replit URL 的示例如下：

```
https://777xxx.janeway.replit.dev/sse/
```





## 测试并连接你的 MCP 服务器

你可以使用深度研究模型在提示词面板中测试你的 MCP 服务器 [提示词面板](https://platform.openai.com/chat)。新建一个提示词，或编辑现有提示词，并向提示词配置中添加一个新的 MCP 工具。这个兼容示例仅暴露只读 `search` 和 `fetch` 工具，因此其 API 请求会跳过对这些工具的审批。请为可能修改数据或执行其他重要操作的工具保留审批。

如果你正在作为插件的一部分测试此服务器，请参阅 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

![提示词配置](https://cdn.openai.com/API/docs/images/prompts_mcp.png)

配置好 MCP 服务器后，你可以通过提示词界面使用模型进行对话。

![提示词对话](https://cdn.openai.com/API/docs/images/chat_prompts_mcp.png)

你可以直接使用 Responses API 通过类似下面的请求来测试 MCP 服务器：

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-5.6-sol",
  "input": [
    {
      "role": "developer",
      "content": [
        {
          "type": "input_text",
          "text": "You are a research assistant that searches MCP servers to find answers to your questions."
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Are cats attached to their homes? Give a succinct one page overview."
        }
      ]
    }
  ],
  "reasoning": {
    "summary": "auto"
  },
  "tools": [
    {
      "type": "mcp",
      "server_label": "cats",
      "server_url": "https://777ff573-9947-4b9c-8982-658fa40c7d09-00-3le96u7wsymx.janeway.replit.dev/sse/",
      "allowed_tools": [
        "search",
        "fetch"
      ],
      "require_approval": "never"
    }
  ]
}'
```


### 处理身份验证

作为自定义远程 MCP 服务器的构建者，授权与身份验证可帮助你保护数据。当你的授权服务器支持 CIMD 且插件创建者选择它时，我们建议使用 OAuth 进行 [客户端 ID 元数据文档](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents) 来完成客户端注册。ChatGPT 支持通过公共客户端令牌交换（`none`）或已签名客户端断言令牌交换（`private_key_jwt`）使用 CIMD。动态客户端注册在配置后仍受支持。有关插件身份验证要求，请参阅 [身份验证](https://developers.openai.com/plugins/build/auth)。有关协议详情，请阅读 [MCP 用户指南](https://modelcontextprotocol.io/docs/concepts/transports#authentication-and-authorization) 或 [授权规范](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).

如果你通过插件连接自定义远程 MCP 服务器，工作区中的用户将看到通往你服务的 OAuth 流程。

### 在 ChatGPT 中连接

1. 在 [ChatGPT](https://chatgpt.com)，中，打开 **Settings → Security and login** 并启用 **Developer mode**.
1. 前往 [ChatGPT Plugins](https://chatgpt.com/plugins)，点击加号按钮，并在开发者模式下连接你的服务器 URL。
1. 通过在聊天和深度研究中运行提示来测试你的插件。

有关详细的设置步骤，请参阅 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

## 风险与安全

自定义 MCP 服务器可让你将 ChatGPT 工作区连接到外部应用程序，从而允许 ChatGPT 在这些应用程序中访问、发送和接收数据。请注意，自定义 MCP 服务器并非由 OpenAI 开发或验证，它们属于第三方服务，需遵守各自的条款和条件。

如果你发现恶意的 MCP 服务器，请向 security@openai.com.

### 提示注入相关风险

提示注入是一种攻击形式，攻击者将恶意指令嵌入到我们的模型可能遇到的内容中——例如网页——意图让这些指令覆盖 ChatGPT 的预期行为。如果模型遵从了被注入的指令，就可能执行用户和开发者从未预期的操作——包括将私有数据发送到外部目的地。

例如，你可能让 ChatGPT 通过查看你的日历和最近的邮件来为一次团体晚餐找一家餐厅。在调研过程中，它可能会遇到一条恶意评论——本质上是一段有害内容，旨在诱使智能体执行非预期操作——指示它从 Gmail 中获取密码重置码并发送到恶意网站。

下表列出了需要考虑的具体场景。我们建议仔细审阅此表，以帮助你决定是否使用自定义 MCP。

| 场景 / 风险                                                                                                                                                                                                                                                                                                                                                                                                                       | 如果我信任 MCP 的开发者，这样安全吗？                                                                                                                                                                                                                                                       | 我可以做些什么来降低风险？                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 攻击者可能通过某种方式将提示注入攻击插入到可通过 MCP 访问的数据中。 <br /><br />_示例：_<br />• 对于客户支持 MCP，攻击者可能会向你发送一个包含提示注入攻击的客户支持请求。                                                                                                                                                                                           | 信任 MCP 的开发者并不能保证其安全。<br /><br />要使其安全，你需要信任 _MCP 中可访问的所有内容_.                                                                                                                                          | • 即便你信任 MCP 的开发者，也不要使用可能包含恶意或不可信用户输入的 MCP。<br />• 配置访问权限，最大限度减少可访问 MCP 的人数。                                                                                                                              |
| 恶意 MCP 可能会在读或写操作中请求过多参数。 <br /><br />_示例：_<br />• 一个员工机票预订 MCP 可能会开放一个读取操作来获取航班时刻表，但请求的参数包括 `summaryOfConversation`, `userAnnualIncome`, `userHomeAddress`.                                                                                                                                        | 信任 MCP 的开发者不一定能保证其安全。<br /><br />MCP 的开发者可能认为请求某些数据是合理的，而你认为这些数据不适合共享。                                                                                              | • 手动安装 MCP 服务器时，请检查每个操作请求的参数，确保不存在超出合理范围的隐私访问。                                                                                                                                                                                              |
| 攻击者可能利用提示注入攻击欺骗 ChatGPT 从自定义 MCP 中获取敏感数据，然后将其发送给攻击者。 <br /><br />_示例：_<br />• 攻击者可能通过另一个 MCP（例如电子邮件）向企业用户之一发起提示注入攻击，试图欺骗 ChatGPT 从内部工具中读取敏感数据并将其发送给攻击者。 | 信任 MCP 的开发者并不能保证其安全。<br /><br />新 MCP 中的所有内容可能都是安全且受信任的，因为风险在于这些数据可能被来自不同恶意来源的攻击窃取。                                                                             | • _ChatGPT 旨在保护用户_，但攻击者可能会尝试窃取你的数据，因此请注意该风险，并考虑是否值得使用。<br />• 配置访问权限，尽量减少能够访问包含特别敏感数据的 MCP 的人数。                                                          |
| 攻击者可能利用提示注入攻击，通过对某个自定义 MCP 的写入操作泄露敏感信息。 <br /><br />_示例：_<br />• 攻击者通过另一个 MCP 发起提示注入攻击，诱使 ChatGPT 获取敏感数据，然后利用用于客服系统的 MCP 将其发送给攻击者。                                                                                       | 信任 MCP 的开发者并不能保证其安全。<br /><br />即使你完全信任该 MCP，如果写入操作存在任何可被攻击者观察到的后果，攻击者就可能试图利用这一点。                                                                          | • 用户应在写入操作发生时仔细审查（以确保这些操作是预期的，并且不包含任何不应分享的数据）。                                                                                                                                                                            |
| 攻击者可能利用提示注入攻击，通过对某个恶意自定义 MCP 的读取操作泄露敏感信息，因为该 MCP 可以记录这些操作。                                                                                                                                                                                                                                                                    | 只有在该 MCP 是恶意的情况下，或者该 MCP 错误地将写入操作标记为读取操作时，这种攻击才会奏效。<br /><br />如果你信任某个 MCP 的开发者能够正确地仅将读取操作标记为 _读取_，并且相信该开发者不会试图窃取数据，那么这种风险可能很小。 | • 仅使用你信任的开发者提供的 MCP（但请注意，这本身并不足以确保安全）。                                                                                                                                                                                                                            |
| 攻击者可能利用提示注入攻击，诱使 ChatGPT 通过某个自定义 MCP 执行用户并未预期的有害或破坏性写入操作。                                                                                                                                                                                                                                                                          | 信任 MCP 的开发者并不能保证其安全。<br /><br />新 MCP 中的所有内容都可能是安全且可信的，但由于攻击来自另一个恶意来源，该风险仍然存在。                                                                                     | • 用户应仔细审查写入操作，以确保它们是预期的且正确的。<br />• ChatGPT 旨在保护用户，但攻击者可能会试图诱使 ChatGPT 执行非预期的写入操作。<br />• 配置访问权限，尽量减少能够访问包含特别敏感数据的 MCP 的人数。 |

### 与非提示注入相关的风险

自定义 MCP 引入了与提示注入攻击无关的其他风险：

- **写入操作既可能提升 MCP 服务器的实用性，也可能带来更大的风险**，因为它们使服务器能够执行潜在的破坏性操作，而不仅仅是向 ChatGPT 返回信息。在任何对话中，ChatGPT 目前都要求在执行写入操作之前进行手动确认。确认流程会标记潜在的敏感数据，但你只应在已仔细考虑并接受 ChatGPT 在执行此类操作时可能出错的前提下使用写入操作。即使 MCP 服务器已将操作标记为只读，写入操作仍有可能发生，这进一步凸显了在将自定义 MCP 服务器部署到 ChatGPT 之前对其进行充分信任的重要性。
- **任何 MCP 服务器都可能在查询过程中接收到敏感数据**。即使服务器本身并非恶意，它也会访问 ChatGPT 在交互过程中提供的所有数据，其中可能包括用户此前向 ChatGPT 提供过的敏感数据。例如，在使用深度研究或聊天应用工具时，ChatGPT 向 MCP 服务器发送的查询中可能就包含这些数据。

### 连接到受信任的服务器

建议你在了解并信任底层应用之前，不要连接到自定义 MCP 服务器。

例如，可以选择由服务提供商官方托管的服务器，例如连接到 Stripe 官方托管的 Stripe 服务器，地址为 `mcp.stripe.com` 而不是由第三方托管的非官方 Stripe MCP 服务器。由于目前官方 MCP 服务器数量有限，你也可以考虑由某个组织托管、通过 API 将请求代理到另一项服务的服务器。但请务必先了解该组织如何使用你的数据，并确认可以信任该服务器后再进行连接。在构建并连接你自己的 MCP 服务器时，请仔细确认它是正确的服务器。对于请求中响应的数据以及 OpenAI 调用你的 MCP 服务器时发送给你的数据，请务必谨慎处理。

你的远程 MCP 服务器允许他人将 OpenAI 连接到你的服务，并允许 OpenAI 在这些服务中访问、收发数据以及执行操作。请避免在工具的 JSON 中放置任何敏感信息，也避免存储访问你远程 MCP 服务器的 ChatGPT 用户的任何敏感信息。

作为 MCP 服务器的构建者，请不要在工具定义中放置任何恶意内容。