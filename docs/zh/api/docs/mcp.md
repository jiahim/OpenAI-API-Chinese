# 为插件和 API 集成构建 MCP 服务器

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

[Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) 是一个开放协议，正在成为通过额外工具和知识扩展 AI 模型的事实行业标准。远程 MCP 服务器可用于通过互联网将模型连接到新的数据源和功能。

在本指南中，我们将介绍如何构建一个远程 MCP 服务器，从私有数据源（一个 [向量存储](https://developers.openai.com/api/docs/guides/retrieval)）读取数据，然后通过 ChatGPT 和 Codex 中的插件、通过 ChatGPT 深度研究与公司知识，以及通过 [API 提供该数据。](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

**注意**：要使用 MCP 服务器构建插件，请从插件文档开始： [快速入门](https://developers.openai.com/plugins/quickstart), [构建你的 MCP 服务器](https://developers.openai.com/plugins/build/mcp-server), [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt)，以及 [身份验证](https://developers.openai.com/plugins/build/auth)。如果你的 MCP 服务器不需要 UI，可以直接暴露工具而无需 UI 资源。

## 配置数据源

你可以使用来自任何来源的数据来为远程 MCP 服务提供支持，但为简单起见，我们将使用 [向量存储](https://developers.openai.com/api/docs/guides/retrieval) 中的 OpenAI API。首先将一个 PDF 文档上传到一个新的向量存储 —— [你可以使用这本关于猫的 19 世纪公版书作为示例](https://cdn.openai.com/API/docs/cats.pdf) 作为示例。

你可以在控制台中上传文件并创建向量存储 [在这里](https://platform.openai.com/storage/vector_stores)，或者你也可以通过 API 创建向量存储并上传文件。 [按照向量存储指南](https://developers.openai.com/api/docs/guides/retrieval) 来设置一个向量存储并向其中上传文件。

记下该向量存储的唯一 ID，以便在后续示例中使用。

![向量存储配置](https://cdn.openai.com/API/docs/images/vector_store.png)

## Create an MCP server

接下来，让我们创建一个远程 MCP 服务器，它将对我们的向量存储执行搜索查询，并能够针对给定 ID 的文件返回文档内容。

在本示例中，我们将使用 Python 和 [FastMCP](https://github.com/jlowin/fastmcp)。构建 MCP 服务器。服务器的完整实现出现在本节末尾，并附有在 [基于浏览器的开发环境](https://replit.com/).

中运行它的说明。请注意，还有许多其他可用于各种编程语言的 MCP 服务器框架。不过，无论你使用哪个框架，服务器中的工具定义都必须符合此处描述的格式。

要使用 ChatGPT 深度研究和公司知识，你的 MCP 服务器
应实现两个只读工具： `search` 和 `fetch`，使用
中的兼容性模式， [公司知识兼容性](https://developers.openai.com/plugins/build/mcp-server#company-knowledge-compatibility).
相同的接口对于通过 API 进行的研究工作流也很有用。

为每个工具声明一个输出模式，以便客户端可以验证结果格式。
在 FastMCP 中，类型化的返回模型可以自动生成此模式；
下面的示例 `output_schema` 显式地从相同的模型传递该模式。

### `search` tool

该 `search` 该工具负责根据用户的查询，从你的 MCP 服务器的数据源返回一份相关的搜索结果列表。

_参数：_

单个查询字符串。

_返回：_

一个只包含一个键的对象， `results`，其值是一个由结果对象组成的数组。每个结果对象应包含：

- `id` - 文档或搜索结果条目的唯一标识符
- `title` - 人类可读的标题。
- `url` - 用于引用的规范 URL。

在 MCP 中，将此对象作为返回 `structuredContent` ，并在其中包含相同的值作为
JSON 编码后的字符串，放入 [content 数组](https://modelcontextprotocol.io/docs/learn/architecture#understanding-the-tool-execution-response)
中以保证兼容性。

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

fetch 工具用于检索搜索结果文档或项目的完整内容。

_参数：_

一个字符串，表示该搜索文档的唯一标识符。

_返回：_

一个包含以下属性的对象：

- `id` - 文档或搜索结果条目的唯一标识符
- `title` - 搜索结果项的字符串标题
- `text` - 文档或条目的完整文本
- `url` - 文档或搜索结果项的 URL。可用于引用
  研究中的具体资源。
- `metadata` - 关于结果的可选键值对数据

在 MCP 中，将此对象作为返回 `structuredContent` ，并在其中包含相同的值作为
为兼容性而在 content 数组中使用 JSON 编码的字符串。

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

对于 `search` results 和 `fetch` responses，ChatGPT 仅在
时才会创建引用元数据，条件是该 `url` 是一个非空字符串。带有 `title` 但没有
usable `url` 的结果仍只是普通工具输出，不会成为空的
citation。若要让结果可被引用，请返回其规范的 `url`.

例如，ChatGPT 可能会使用以下参数调用 `search` ：

```json
{ "query": "What is the quarterly plan?" }
```

MCP 服务器可以返回一个由 URL 支持的结果：

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

在此响应中， `url` 字段具有值，这使得该结果有资格
获得引用元数据。查询本身不会触发引用处理。如果
结果省略了 `url`，或者提供了一个空值或非字符串值，ChatGPT
会将该结果保留为普通工具输出。

### 服务端示例

你可以在以下位置试用这个示例 MCP 服务器 [基于浏览器的开发环境](https://replit.com/)。请使用你自己的 API 凭据和向量存储信息配置该示例。

[Replit 上的示例 MCP 服务器



      Remix the server example on Replit to test live.](https://replit.com/@kwhinnery-oai/DeepResearchServer?v=1#README.md)

以下是使用 FastMCP 实现上述两个工具的完整实现，便于参考。 `search` 和 `fetch` （下方同样提供了 FastMCP 中两个工具的完整实现以方便使用。）



#### 完整实现 - FastMCP 服务器



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



在 Replit 上，配置 `OPENAI_API_KEY` 时，在「Secrets」界面中填入你的 OpenAI API 密钥。在示例中，将 `vs_123` 替换为你之前为搜索所创建的向量存储的 ID。

在免费的 Replit 账号下，只要编辑器处于活跃状态，服务端 URL 就会保持有效，因此测试时你需要保持浏览器标签页处于打开状态。点击链接图标即可获取你的 MCP 服务器的 URL：

![replit configuration](https://cdn.openai.com/API/docs/images/replit.png)

在较长的开发 URL 中，确保其以 `/sse/`，结尾，这是 MCP 服务器的服务器发送事件（流式）接口。你将使用此 URL 在 ChatGPT 中连接你的应用，并通过 API 调用它。一个 Replit URL 示例如下：

```
https://777xxx.janeway.replit.dev/sse/
```





## 测试并连接你的 MCP 服务器

你可以在 `gpt-6.1-sol` [提示词仪表板中测试你的 MCP 服务器](https://platform.openai.com/chat)。新建一个提示词，或者编辑现有提示词，然后在提示词配置中添加一个新的 MCP 工具。此兼容性示例仅暴露只读 `search` 和 `fetch` 工具，因此其 API 请求会跳过对这些工具的审批。请为可能修改数据或执行其他重大操作的工具保持启用审批。

如果你将此服务器作为插件的一部分进行测试，请按照 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

![提示词配置](https://cdn.openai.com/API/docs/images/prompts_mcp.png)

配置好 MCP 服务器后，你可以通过 Prompts UI 使用它与模型对话。

![提示词聊天](https://cdn.openai.com/API/docs/images/chat_prompts_mcp.png)

你可以使用 Responses API 直接通过类似如下的请求来测试 MCP 服务器：

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-6.1-sol",
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

作为构建自定义远程 MCP 服务器的人员，授权与身份验证可帮助你保护数据。当你的授权服务器支持 CIMD 且插件创建者选择使用它时，我们建议在客户端注册时使用 [Client ID Metadata Documents](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents) 。ChatGPT 通过公共客户端令牌交换（`none`）或签名客户端断言令牌交换（`private_key_jwt`）支持 CIMD。动态客户端注册在配置后仍受支持。有关插件身份验证要求，请参阅 [身份验证](https://developers.openai.com/plugins/build/auth)。有关协议详情，请阅读 [MCP user guide](https://modelcontextprotocol.io/docs/concepts/transports#authentication-and-authorization) 或 [authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).

如果你通过插件连接自定义远程 MCP 服务器，工作区中的用户将获得面向你服务的 OAuth 流程。

### 在 ChatGPT 中连接

1. 在 [ChatGPT](https://chatgpt.com)，中，打开 **Settings → Security and login** 并开启 **Developer mode**.
1. 前往 [ChatGPT Plugins](https://chatgpt.com/plugins)，点击加号按钮，并在开发者模式下连接你的服务器 URL。
1. 在聊天和深度研究中运行提示词以测试你的插件。

有关详细的设置步骤，请参阅 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

## 风险与安全

自定义 MCP 服务器使你能够将 ChatGPT 工作区连接到外部应用，从而让 ChatGPT 在这些应用中访问、发送和接收数据。请注意，自定义 MCP 服务器并非由 OpenAI 开发或验证，它们属于第三方服务，需遵循各自的服务条款。

如果你发现恶意 MCP 服务器，请向以下邮箱举报： security@openai.com.

### 提示注入相关风险

提示注入是一种攻击形式，攻击者将恶意指令嵌入到我们的模型可能遇到的内容中——例如网页——意图让这些指令覆盖 ChatGPT 的预期行为。如果模型遵从了注入的指令，它可能会执行用户和开发者从未预期的操作——包括将私密数据发送到外部目标。

例如，你可能让 ChatGPT 通过查看你的日历和最近的邮件来为一次聚餐找一个餐厅。在调研过程中，它可能会遇到一条恶意评论——本质上就是一段旨在诱骗智能体执行非预期操作的有害内容——这条评论指示它从 Gmail 检索密码重置码并发送给一个恶意网站。

下表列出了一些需要考虑的具体场景。我们建议你仔细审阅此表，以帮助你判断是否应使用自定义 MCP。

| 场景 / 风险                                                                                                                                                                                                                                                                                                                                                                                                                       | 如果我信任 MCP 的开发者，这样做安全吗？                                                                                                                                                                                                                                                       | 我可以采取哪些措施来降低风险？                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 攻击者可能通过某种方式在 MCP 可访问的数据中植入提示词注入攻击。 <br /><br />_示例：_<br />• 对于一个客户支持 MCP，攻击者可以向你发送一个带有提示词注入攻击的客户支持请求。                                                                                                                                                                                           | 信任 MCP 的开发者并不能保证安全。<br /><br />要保证安全，你需要信任 _MCP 内可访问的所有内容_.                                                                                                                                          | • 即使你信任 MCP 的开发者，也不要使用可能包含恶意或不可信用户输入的 MCP。<br />• 配置访问权限，尽量减少可访问该 MCP 的人数。                                                                                                                              |
| 恶意 MCP 可能在读取或写入操作中请求过多的参数。 <br /><br />_示例：_<br />• 一个员工机票预订 MCP 可能公开一个用于获取航班时刻表的读取操作，但请求的参数包括 `summaryOfConversation`, `userAnnualIncome`, `userHomeAddress`.                                                                                                                                        | 信任 MCP 的开发者并不一定能保证安全。<br /><br />MCP 的开发者可能认为请求某些数据是合理的，而你并不认为可以接受共享这些数据。                                                                                              | • 在手动安装 MCP 服务器时，请检查每个操作请求的参数，并确保不存在超出合理范围的隐私访问。                                                                                                                                                                                              |
| 攻击者可能使用提示词注入攻击，诱使 ChatGPT 从自定义 MCP 中获取敏感数据，然后发送给攻击者。 <br /><br />_示例：_<br />• 攻击者可能通过另一个 MCP（例如电子邮件）对企业用户之一发起提示词注入攻击，试图诱使 ChatGPT 从内部工具中读取敏感数据并发送给攻击者。 | 信任 MCP 的开发者并不能保证安全。<br /><br />新 MCP 中的所有内容都可能安全且可信，因为风险在于这些数据会被来自其他恶意来源的攻击窃取。                                                                             | • _ChatGPT 旨在保护用户_，但攻击者可能会尝试窃取你的数据，因此请注意相关风险，并考虑是否有必要这样做。<br />• 配置访问权限，最大限度地减少能够访问包含特别敏感数据的 MCP 的人数。                                                          |
| 攻击者可能利用提示词注入攻击，通过对自定义 MCP 的写操作泄露敏感信息。 <br /><br />_示例：_<br />• 攻击者通过一个 MCP 利用提示词注入攻击，诱使 ChatGPT 获取敏感数据，然后利用用于客服系统的 MCP 将其发送给攻击者。                                                                                       | 信任 MCP 的开发者并不能保证安全。<br /><br />即使你完全信任该 MCP，只要写操作存在任何可被攻击者观察到的后果，他们就可能试图加以利用。                                                                          | • 用户应在写操作发生时仔细审查（以确保它们符合预期，并且不包含任何不应共享的数据）。                                                                                                                                                                            |
| 攻击者可能利用提示词注入攻击，通过对恶意自定义 MCP 的读操作泄露敏感信息，因为该 MCP 可以记录这些操作。                                                                                                                                                                                                                                                                    | 只有当该 MCP 是恶意的，或者该 MCP 错误地将写操作标记为读操作时，此类攻击才会奏效。<br /><br />如果你信任 MCP 的开发者能够正确地仅将读操作标记为 _读_，操作，并且信任该开发者不会试图窃取数据，那么该风险可能很小。 | • 仅使用你信任的开发者提供的 MCP（但请注意，这并不足以保证安全）。                                                                                                                                                                                                                            |
| 攻击者可能利用提示词注入攻击，诱使 ChatGPT 通过用户并未预期的自定义 MCP 执行有害或破坏性的写操作。                                                                                                                                                                                                                                                                          | 信任 MCP 的开发者并不能保证安全。<br /><br />新的 MCP 中的所有内容都可能是安全且受信任的，但由于攻击来自不同的恶意来源，这一风险仍然存在。                                                                                     | • 用户应仔细审查写操作，以确保它们符合预期且正确无误。<br />• ChatGPT 旨在保护用户，但攻击者可能会试图诱使 ChatGPT 执行未经预期的写操作。<br />• 配置访问权限，最大限度地减少能够访问包含特别敏感数据的 MCP 的人数。 |

### 非提示词注入相关风险

自定义 MCP 会引入与提示注入攻击无关的其他风险：

- **写入操作既可能提升 MCP 服务器的实用性，也可能带来更大的风险**，因为它们使服务器能够执行潜在的破坏性操作，而不仅仅是向 ChatGPT 返回信息。ChatGPT 目前在任何对话中执行写入操作之前都需要手动确认。确认过程会标记可能敏感的数据，但你应当仅在已经仔细考虑并接受 ChatGPT 可能在该操作上犯错的情况下使用写入操作。即使 MCP 服务器将该操作标记为只读，写入操作仍有可能发生，因此更加重要的是，在部署到 ChatGPT 之前要信任该自定义 MCP 服务器。
- **任何 MCP 服务器都可能在查询过程中接收到敏感数据**. 即便服务器并非恶意，它也能够访问 ChatGPT 在交互过程中提供的任何数据，其中可能包括用户先前提供给 ChatGPT 的敏感数据。例如，在使用深度研究或聊天应用工具时，ChatGPT 向 MCP 服务器发送的查询中可能包含此类数据。

### 连接到受信任的服务器

我们建议你在了解并信任底层应用之前，不要连接自定义 MCP 服务器。

例如，选择由服务提供商自行托管的官方服务器。连接到由 Stripe 在以下地址托管的 Stripe 服务器 `mcp.stripe.com` ，而不是由第三方托管的非官方 Stripe MCP 服务器。由于目前可用的官方 MCP 服务器很少，你可以考虑使用通过 API 将请求代理到另一项服务的组织所托管的服务器。只有在审查了该组织如何使用你的数据并确认可以信任该服务器之后，才能进行连接。在构建并连接你自己的 MCP 服务器时，请仔细确认这是正确的服务器。注意你在响应请求时所提供的数据，以及在 OpenAI 调用你的 MCP 服务器时如何处理发送给的数据。

你的远程 MCP 服务器允许他人将 OpenAI 连接到你的服务，并允许 OpenAI 在这些服务中访问、发送和接收数据以及执行操作。避免在工具的 JSON 中放入任何敏感信息，并避免存储访问你的远程 MCP 服务器的 ChatGPT 用户的任何敏感信息。

作为 MCP 服务器的构建者，不要在工具定义中放入任何恶意内容。