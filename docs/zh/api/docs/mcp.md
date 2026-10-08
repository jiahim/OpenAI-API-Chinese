# 为插件和 API 集成构建 MCP 服务器

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

[Model Context Protocol](https://modelcontextprotocol.io/introduction) （MCP）是一个开放协议，正在成为通过额外工具和知识扩展 AI 模型的事实行业标准。远程 MCP 服务器可用于通过互联网将模型连接到新的数据源和功能。

在本指南中，我们将介绍如何构建一个远程 MCP 服务器，从私有数据源（一个 [向量存储](https://developers.openai.com/api/docs/guides/retrieval)）读取数据，并通过 ChatGPT 和 Codex 中的插件、ChatGPT 深度研究与公司知识，以及通过 API 提供这些数据。 [通过 接口](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

**注意**：要使用 MCP 服务器构建插件，请从插件文档开始： [快速入门](https://developers.openai.com/plugins/quickstart), [构建你的 MCP 服务器](https://developers.openai.com/plugins/build/mcp-server), [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt)，以及 [身份验证](https://developers.openai.com/plugins/build/auth)。如果你的 MCP 服务器不需要 UI，你可以公开工具而无需 UI 资源。

## 配置数据源

你可以使用任何来源的数据来为远程 MCP 服务器提供支持，但为了简单起见，我们将使用 [向量存储](https://developers.openai.com/api/docs/guides/retrieval) 在 OpenAI API 中。首先将一个 PDF 文档上传到一个新的向量存储 - [你可以使用这本关于猫的 19 世纪公共领域图书作为示例](https://cdn.openai.com/API/docs/cats.pdf) 作为示例。

你可以上传文件并在此处的控制台中创建向量存储 [在控制台中创建](https://platform.openai.com/storage/vector_stores)，或者你也可以通过 API 创建向量存储并上传文件。 [参考向量存储指南](https://developers.openai.com/api/docs/guides/retrieval) 来设置一个向量存储并向其上传文件。

记下向量存储的唯一 ID，以便在后续示例中使用。

![向量存储配置](https://cdn.openai.com/API/docs/images/vector_store.png)

## 创建一个 MCP 服务器

接下来，我们创建一个远程 MCP 服务器，用于对我们的向量存储执行搜索查询，并能够根据给定 ID 返回文件内容。

在本示例中，我们将使用 Python 和 [FastMCP](https://github.com/jlowin/fastmcp)。来构建 MCP 服务器。本节末尾给出了服务器的完整实现，并附有在 [基于浏览器的开发环境](https://replit.com/).

中运行它的说明。请注意，还有许多其他 MCP 服务器框架可供使用，支持多种编程语言。不过无论使用哪个框架，你服务器中的工具定义都必须符合此处描述的形状。

要使用 ChatGPT 深度研究和公司知识，你的 MCP 服务器
应实现两个只读工具： `search` 和 `fetch`，使用
中的兼容模式， [公司知识兼容](https://developers.openai.com/plugins/build/mcp-server#company-knowledge-compatibility).
同样的接口对于通过 API 的研究工作流也很有用。

为每个工具声明输出模式，以便客户端验证结果形状。
在 FastMCP 中，类型化的返回模型可以自动生成此模式；
下面的示例从同一模型显式 `output_schema` 传递该模式。

### `search` tool

该 `search` 工具负责根据用户的查询，从你的 MCP 服务器的数据源返回相关搜索结果列表。

_参数：_

单个查询字符串。

_返回：_

一个包含单个键的对象， `results`，其值为结果对象数组。每个结果对象应包含：

- `id` - 文档或搜索结果条目的唯一标识符
- `title` - 人类可读的标题。
- `url` - 用于引用的规范 URL。

在 MCP 中，将此对象返回为 `structuredContent` ，并在
JSON 编码字符串形式包含在 [content 数组](https://modelcontextprotocol.io/docs/learn/architecture#understanding-the-tool-execution-response)
中以保持兼容性。

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

- `id` - 文档或搜索结果条目的唯一标识符
- `title` - 搜索结果项的字符串标题
- `text` - 文档或条目的完整文本
- `url` - 文档或搜索结果项的 URL。可用于在研究中引用
  特定资源。
- `metadata` - 关于结果的可选键/值配对数据

在 MCP 中，将此对象返回为 `structuredContent` ，并在
一个 JSON 编码的字符串，放在 content 数组中以保证兼容性。

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

对于两者 `search` 结果和 `fetch` 响应，ChatGPT 仅在
时创建引用元数据 `url` 是非空字符串时才会创建引用元数据。带有 `title` 但没有
可用的 `url` 的结果仍属于普通工具输出，不会成为空的
引用。要让结果可被引用，请返回其规范的 `url`.

例如，ChatGPT 可能会使用以下参数调用 `search` ：

```json
{ "query": "What is the quarterly plan?" }
```

MCP 服务器可以使用 URL 支持的结果进行响应：

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

在此响应中， `url` 字段有值，这使得该结果符合引用元数据的条件
。查询本身不会触发引用处理。如果
结果省略了 `url`，或提供了空值或非字符串值，ChatGPT
会将该结果保留为普通工具输出。

### 服务端示例

你可以在下面的 [基于浏览器的开发环境](https://replit.com/)。中试用此示例 MCP 服务器。使用你自己的 API 凭据和 vector store 信息配置该示例。

[Replit 上的示例 MCP 服务器



      Remix the server example on Replit to test live.](https://replit.com/@kwhinnery-oai/DeepResearchServer?v=1#README.md)

下面也提供了使用 FastMCP 实现这两个工具的完整实现以方便参考。 `search` 和 `fetch` tools in FastMCP is below also for convenience.



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



在 Replit 上，配置 `OPENAI_API_KEY` 为你提供的 OpenAI API 密钥填写到 "Secrets" 界面中。在示例代码中，将 `vs_123` 替换为你之前为搜索创建的向量存储的 ID。

在免费的 Replit 账号上，只要编辑器处于活动状态，服务端 URL 就会一直有效，因此在测试期间你需要保持浏览器标签页处于打开状态。点击链接图标可获取你的 MCP 服务器的 URL：

![replit 配置](https://cdn.openai.com/API/docs/images/replit.png)

在较长的开发 URL 中，确保它以 `/sse/`，结尾，这是 MCP 服务器的服务器发送事件（流式）接口。你将在 ChatGPT 中使用这个 URL 来连接你的应用，并通过 API 调用它。一个 Replit URL 的示例为：

```
https://777xxx.janeway.replit.dev/sse/
```





## 测试并连接你的 MCP 服务器

你可以使用以下方式测试你的 MCP 服务器 `gpt-6.1-sol` [在提示词面板中](https://platform.openai.com/chat)。创建一个新提示词，或编辑现有提示词，然后在提示词配置中添加一个新的 MCP 工具。这个兼容性示例仅暴露只读 `search` 和 `fetch` 工具，因此其 API 请求会跳过对这些工具的审批。对于可能修改数据或产生其他重要影响的工具，请保持启用审批。

如果你将本服务器作为插件的一部分进行测试，请遵循 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

![prompts configuration](https://cdn.openai.com/API/docs/images/prompts_mcp.png)

配置好 MCP 服务器后，你可以通过 Prompts UI 使用它与模型对话。

![prompts chat](https://cdn.openai.com/API/docs/images/chat_prompts_mcp.png)

你可以使用 Responses API 直接测试该 MCP 服务器，发送如下请求：

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

作为构建自定义远程 MCP 服务器的人员，授权与身份验证可帮助你保护数据。当你的授权服务器支持 CIMD 且插件创建者选择它时，我们建议使用 [客户端 ID 元数据文档](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents) 进行客户端注册。ChatGPT 通过公共客户端令牌交换（`none`）或签名客户端断言令牌交换（`private_key_jwt`）支持 CIMD。在配置后仍支持动态客户端注册。有关插件身份验证要求，请参阅 [身份验证](https://developers.openai.com/plugins/build/auth)。有关协议详情，请阅读 [MCP 用户指南](https://modelcontextprotocol.io/docs/concepts/transports#authentication-and-authorization) 或 [授权规范](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).

如果你通过插件连接自定义远程 MCP 服务器，你工作区中的用户将获得前往你服务的 OAuth 流程。

### Connect in ChatGPT

1. 前往 [ChatGPT Plugins](https://chatgpt.com/plugins),点击加号按钮,然后 **Add custom MCP server**.
1. 输入你的服务器 URL 和身份验证详情。查看风险警告后点击 **I understand and want to continue**,然后 **Create as a plugin**.
1. 安装你的插件并在聊天和深度研究中运行提示进行测试。

有关详细的设置步骤，请参阅 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

## 风险与安全

自定义 MCP 服务器使你能够将你的 ChatGPT 工作区连接到外部应用，从而让 ChatGPT 可以在这些应用中访问、发送和接收数据。请注意，自定义 MCP 服务器并非由 OpenAI 开发或验证，它们属于第三方服务，并受其自身条款和条件的约束。

如果你遇到恶意的 MCP 服务器，请向以下邮箱举报 security@openai.com.

### 提示注入相关风险

提示注入是一种攻击形式，攻击者将恶意指令嵌入到我们的某个模型可能会遇到的内容中（例如网页），意图让这些指令覆盖 ChatGPT 的预期行为。如果模型遵从了被注入的指令，就可能执行用户和开发者从未预期的操作——包括将私人数据发送到外部目的地。

例如，你可能要求 ChatGPT 通过查看你的日历和近期邮件来为一次聚餐寻找餐厅。在研究过程中，它可能会遇到一条恶意评论——本质上是一段旨在诱骗智能体执行非预期操作的有害内容——引导它从 Gmail 中检索密码重置代码并发送到某个恶意网站。

下表列出了需要考虑的具体场景。我们建议仔细审阅此表，以便帮助你决定是否使用自定义 MCP。

| 场景 / 风险                                                                                                                                                                                                                                                                                                                                                                                                                       | 如果我信任 MCP 的开发者，这样做安全吗？                                                                                                                                                                                                                                                       | 我可以采取哪些措施来降低风险？                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 攻击者可能通过某种方式在 MCP 可访问的数据中插入提示词注入攻击。 <br /><br />_示例：_<br />• 对于客服 MCP，攻击者可能向你发送一条包含提示词注入攻击的客服请求。                                                                                                                                                                                           | 信任 MCP 的开发者并不能保证其安全性。<br /><br />要保证安全，你需要信任 _MCP 中可访问的全部内容_.                                                                                                                                          | • 即使你信任 MCP 的开发者，也不要使用可能包含恶意或不可信用户输入的 MCP。<br />• 配置访问权限，尽量减少可访问 MCP 的人员数量。                                                                                                                              |
| 恶意 MCP 可能在读或写操作中请求过多的参数。 <br /><br />_示例：_<br />• 一个员工机票预订 MCP 可能会提供一个用于获取航班时刻表的读操作，但请求的参数包括 `summaryOfConversation`, `userAnnualIncome`, `userHomeAddress`.                                                                                                                                        | 信任 MCP 的开发者并不一定能保证其安全性。<br /><br />MCP 的开发者可能认为请求某些数据是合理的，而你认为这些数据不适合共享。                                                                                              | • 在手动安装 MCP 服务器时，请仔细检查每个操作所请求的参数，确保不存在超出合理范围的隐私访问。                                                                                                                                                                                              |
| 攻击者可能使用提示词注入攻击，诱使 ChatGPT 从自定义 MCP 中获取敏感数据，再发送给攻击者。 <br /><br />_示例：_<br />• 攻击者可能通过另一个 MCP（例如电子邮件）向企业用户之一发起提示词注入攻击，试图诱使 ChatGPT 从内部工具读取敏感数据并发送给攻击者。 | 信任 MCP 的开发者并不能保证其安全性。<br /><br />新 MCP 中的所有内容都可能安全可信，因为风险在于这些数据会被来自其他恶意来源的攻击窃取。                                                                             | • _ChatGPT 旨在保护用户_，但攻击者可能会试图窃取你的数据，因此请注意此风险，并考虑采取相关操作是否合理。<br />• 配置访问权限，尽量减少能访问包含特别敏感数据的 MCP 的人数。                                                          |
| 攻击者可能使用提示注入攻击，通过对自定义 MCP 的写入操作泄露敏感信息。 <br /><br />_示例：_<br />• 攻击者通过一个不同的 MCP 使用提示注入攻击，诱使 ChatGPT 获取敏感数据，然后利用一个用于客户支持系统的 MCP 将其发送给攻击者。                                                                                       | 信任 MCP 的开发者并不能保证其安全性。<br /><br />即使你完全信任该 MCP，如果写入操作会产生任何可被攻击者观察到的后果，他们也可能试图加以利用。                                                                          | • 用户应在写入操作发生时仔细审阅（以确认这些操作是预期的，并且不包含任何不应分享的数据）。                                                                                                                                                                            |
| 攻击者可能使用提示注入攻击，通过对恶意自定义 MCP 的读取操作泄露敏感信息，因为该 MCP 可以记录这些操作。                                                                                                                                                                                                                                                                    | 此攻击仅在 MCP 是恶意的情况下，或 MCP 错误地将写入操作标记为读取操作时才有效。<br /><br />如果你信任某个 MCP 的开发者能正确地仅将读取操作标记为 _读取_，并且相信该开发者不会试图窃取数据，那么此风险可能很小。 | • 仅使用你信任的开发者提供的 MCP（但请注意，这并不足以保证安全）。                                                                                                                                                                                                                            |
| 攻击者可能使用提示注入攻击，诱使 ChatGPT 通过自定义 MCP 执行用户并未预期的有害或破坏性写入操作。                                                                                                                                                                                                                                                                          | 信任 MCP 的开发者并不能保证其安全性。<br /><br />新 MCP 中的所有内容都可能安全且可信，但此风险仍然存在，因为攻击来自另一个恶意来源。                                                                                     | • 用户应仔细审阅写入操作，以确保它们符合预期且正确无误。<br />• ChatGPT 旨在保护用户，但攻击者可能会试图诱使 ChatGPT 执行未经预期的写入操作。<br />• 配置访问权限，尽量减少能访问包含特别敏感数据的 MCP 的人数。 |

### 与非提示注入相关的风险

自定义 MCP 会引入与提示注入攻击无关的其他风险：

- **写入操作可能同时增加 MCP 服务器的有用性和风险**，因为它们使服务器能够执行潜在破坏性操作，而不仅仅是向 ChatGPT 返回信息。ChatGPT 当前要求在任何对话中执行写入操作之前进行手动确认。该确认会标记潜在敏感数据，但你应仅在已仔细考虑并接受 ChatGPT 可能因此类操作而犯错的情况下使用写入操作。即使 MCP 服务器将该操作标记为只读，写入操作仍有可能发生，这使得在部署到 ChatGPT 之前信任自定义 MCP 服务器变得更加重要。
- **任何 MCP 服务器都可能作为查询的一部分收到敏感数据**。即使服务器并非恶意，它也会访问 ChatGPT 在交互过程中提供的任何数据，可能包括用户此前已提供给 ChatGPT 的敏感数据。例如，在使用深度研究或聊天应用工具时，ChatGPT 发送给 MCP 服务器的查询中可能包含此类数据。

### 连接到受信任的服务器

除非你了解并信任底层应用，否则我们建议不要连接到自定义 MCP 服务器。

例如，选择由服务提供商自行托管的官方服务器。连接到由 Stripe 托管的 Stripe 服务器， `mcp.stripe.com` 而不是由第三方托管的非官方 Stripe MCP 服务器。由于目前可用的官方 MCP 服务器较少，你可以考虑连接由某个组织托管的服务器，该服务器通过 API 将请求代理到另一项服务。请在审查该组织如何使用你的数据并确认你信任该服务器后再进行连接。在构建并连接你自己的 MCP 服务器时，请仔细确认它就是正确的服务器。当 OpenAI 调用你的 MCP 服务器时，请谨慎处理你在请求响应中提供的数据，以及发送给你的数据。

你的远程 MCP 服务器允许他人将 OpenAI 连接到你的服务，并允许 OpenAI 在这些服务中访问、发送和接收数据，以及执行操作。请避免在工具的 JSON 中放置任何敏感信息，也避免存储来自访问你远程 MCP 服务器的 ChatGPT 用户的任何敏感信息。

作为构建 MCP 服务器的人，请不要在工具定义中放入任何恶意内容。