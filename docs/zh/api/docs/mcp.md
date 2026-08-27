# 为插件和 API 集成构建 MCP 服务器

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

[Model Context Protocol](https://modelcontextprotocol.io/introduction) （MCP）是一种开放协议，正成为通过附加工具和知识扩展 AI 模型的行业标准。远程 MCP 服务器可用于通过互联网将模型连接到新的数据源和功能。

在本指南中，我们将介绍如何构建一个从私有数据源（ [向量存储](https://developers.openai.com/api/docs/guides/retrieval)）读取数据，并通过 ChatGPT 和 Codex 中的插件、ChatGPT 深度研究和公司知识提供这些数据，以及 [通过 API](https://developers.openai.com/api/docs/guides/deep-research).

**注意**：要使用 MCP 服务器构建插件，请从插件文档开始： [快速入门](https://developers.openai.com/plugins/quickstart), [构建你的 MCP 服务器](https://developers.openai.com/plugins/build/mcp-server), [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt)，以及 [身份验证](https://developers.openai.com/plugins/build/auth)。如果你的 MCP 服务器不需要 UI，你可以在没有 UI 资源的情况下暴露工具。

## 配置数据源

你可以使用任何来源的数据来驱动远程 MCP 服务器，但为简单起见，我们将使用 [向量存储](https://developers.openai.com/api/docs/guides/retrieval) 中的 OpenAI API。首先将 PDF 文档上传到新的向量存储—— [你可以使用这本 19 世纪的公有领域猫咪书籍](https://cdn.openai.com/API/docs/cats.pdf) 作为示例。

你可以在 [此处的仪表板中](https://platform.openai.com/storage/vector_stores)，上传文件并创建向量存储，或者你也可以通过 API 创建向量存储并上传文件。 [按照向量存储指南](https://developers.openai.com/api/docs/guides/retrieval) 设置向量存储并向其中上传文件。

记下向量存储的唯一 ID，以便在接下来的示例中使用。

![向量存储配置](https://cdn.openai.com/API/docs/images/vector_store.png)

## 创建 MCP 服务器

接下来，让我们创建一个远程 MCP 服务器，它将针对我们的向量存储执行搜索查询，并能够返回具有给定 ID 的文件文档内容。

在本示例中，我们将使用 Python 和 [FastMCP](https://github.com/jlowin/fastmcp)。构建我们的 MCP 服务器。本节末尾提供了服务器的完整实现，以及在其中运行的说明 [基于浏览器的开发环境](https://replit.com/).

请注意，你可以使用多种编程语言中的许多其他 MCP 服务器框架。无论你使用哪种框架，服务器中的工具定义都需要符合此处描述的形状。

要与 ChatGPT 深度研究和公司知识配合使用，你的 MCP 服务器
应实现两个只读工具： `search` 和 `fetch`，使用
中的兼容模式 [公司知识兼容性](https://developers.openai.com/plugins/build/mcp-server#company-knowledge-compatibility).
相同的接口对于通过 API 的研究工作流也很有用。

为每个工具声明一个输出模式，以便客户端可以验证结果形状。
在 FastMCP 中，类型化返回模型可以自动生成此模式；
下面的示例显式传递 `output_schema` 来自相同模型的模式。

### `search` 工具

该 `search` 工具负责根据用户的查询，从你的 MCP 服务器的数据源中返回一组相关搜索结果。

_参数：_

单个查询字符串。

_返回值：_

一个包含单个键的对象， `results`，其值为结果对象的数组。每个结果对象应包含：

- `id` - 文档或搜索结果项的唯一 ID
- `title` - 人类可读的标题。
- `url` - 用于引用的规范 URL。

在 MCP 中，返回此对象为 `structuredContent` 并将相同的值包含在
的 JSON 编码字符串中，位于 [content 数组](https://modelcontextprotocol.io/docs/learn/architecture#understanding-the-tool-execution-response)
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

### `fetch` 工具

fetch 工具用于检索搜索结果文档或项目的完整内容。

_参数：_

一个字符串，是搜索文档的唯一标识符。

_返回：_

具有以下属性的单个对象：

- `id` - 文档或搜索结果项的唯一 ID
- `title` - 搜索结果项的字符串标题
- `text` - 文档或项的完整文本
- `url` - 指向文档或搜索结果项的 URL。可用于引用
  研究中的特定资源。
- `metadata` - 关于结果的可选键/值数据对

在 MCP 中，将此对象作为 `structuredContent` 返回，并在 content 数组中包含与
相同的值，以 JSON 编码字符串形式提供兼容性。

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

对于 `search` 结果和 `fetch` 响应，ChatGPT 仅在
为非空字符串时创建引用 `url` 元数据。一个具有 `title` 但没有
可用 `url` 的结果仍然是普通工具输出，而不会成为空的
引用。要使结果可被引用，请返回其规范 `url`.

例如，ChatGPT 可能调用 `search` ：

```json
{ "query": "What is the quarterly plan?" }
```

MCP 服务器可以返回带有 URL 的结果：

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

在此响应中， `url` 字段有一个值，这使得该结果有资格获得
引用元数据。查询本身不会触发引用处理。如果
结果省略了 `url`，或提供了空值或非字符串值，ChatGPT
会将结果保留为普通工具输出。

### 服务端示例

你可以在 [基于浏览器的开发环境](https://replit.com/)。中尝试这个示例 MCP 服务器。使用你自己的 API 凭据和向量存储信息配置该示例。

[Replit 上的示例 MCP 服务器



      Remix the server example on Replit to test live.](https://replit.com/@kwhinnery-oai/DeepResearchServer?v=1#README.md)

以下同时提供了 `search` 和 `fetch` 工具在 FastMCP 中的完整实现，方便你参考。

完整实现 - FastMCP 服务器

```python
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
VECTOR_STORE_ID = os.environ["VECTOR_STORE_ID"]

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


Replit 设置

在 Replit 上，你需要在“Secrets”界面中配置两个环境变量：

- `OPENAI_API_KEY` - 你的标准 OpenAI API 密钥
- `VECTOR_STORE_ID` - 一个可用于搜索的向量存储的唯一标识符——即你之前创建的那个。

在免费的 Replit 账户上，只要编辑器处于活动状态，服务器 URL 就会保持有效，因此测试期间你需要保持浏览器标签页打开。你可以通过点击链环图标获取 MCP 服务器的 URL：

![replit 配置](https://cdn.openai.com/API/docs/images/replit.png)

在长开发 URL 中，确保其以 `/sse/`，结尾，这是 MCP 服务器的服务器发送事件（流式）接口。这是你将在 ChatGPT 中用于连接应用并通过 API 调用它的 URL。一个 Replit URL 示例看起来像：

```
https://777xxx.janeway.replit.dev/sse/
```

## 测试并连接你的 MCP 服务器

你可以使用深度研究模型测试你的 MCP 服务器 [在提示词仪表板中](https://platform.openai.com/chat)。创建一个新的提示词，或编辑现有的提示词，并向提示词配置中添加一个新的 MCP 工具。此兼容性示例仅暴露只读 `search` 和 `fetch` 工具，因此其 API 请求会跳过这些工具的审批。对于可能修改数据或采取其他重要操作的工具，请保持审批启用。

如果你作为插件的一部分测试此服务器，请遵循 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

![提示词配置](https://cdn.openai.com/API/docs/images/prompts_mcp.png)

配置好 MCP 服务器后，你可以通过提示词 UI 使用它来与模型聊天。

![提示词聊天](https://cdn.openai.com/API/docs/images/chat_prompts_mcp.png)

你可以使用类似这样的请求直接通过 Responses API 测试 MCP 服务器：

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

作为构建自定义远程 MCP 服务器的开发者，授权和身份验证可帮助你保护数据。我们建议使用 OAuth 配合 [Client ID Metadata Documents](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents) 进行客户端注册，当你的授权服务器支持 CIMD 且插件创建者选择该方式时。ChatGPT 支持 CIMD 的公共客户端令牌交换（`none`）或签名客户端断言令牌交换（`private_key_jwt`）。配置后仍支持动态客户端注册。有关插件身份验证要求，请参阅 [身份验证](https://developers.openai.com/plugins/build/auth)。有关协议细节，请阅读 [MCP 用户指南](https://modelcontextprotocol.io/docs/concepts/transports#authentication-and-authorization) 或 [授权规范](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).

如果你通过插件连接自定义远程 MCP 服务器，你工作区中的用户将获得一个指向你服务的 OAuth 流程。

### 在 ChatGPT 中连接

1. 在 [ChatGPT](https://chatgpt.com)，中，打开 **设置 → 安全与登录** 并开启 **开发者模式**.
1. 转到 [ChatGPT 插件](https://chatgpt.com/plugins)，选择加号按钮，并在开发者模式下连接你的服务器 URL。
1. 通过在聊天和深度研究中运行提示来测试你的插件。

有关详细设置步骤，请参阅 [连接并测试你的插件](https://developers.openai.com/plugins/deploy/connect-chatgpt).

## 风险与安全

自定义 MCP 服务器使你能够将 ChatGPT 工作区连接到外部应用程序，从而让 ChatGPT 能够访问、发送和接收这些应用程序中的数据。请注意，自定义 MCP 服务器并非由 OpenAI 开发或验证，它们是第三方服务，受其自身条款和条件的约束。

如果你遇到恶意 MCP 服务器，请报告至 security@openai.com.

### 提示注入相关风险

提示注入是一种攻击形式，攻击者将恶意指令嵌入到我们的模型可能遇到的内容中（例如网页），意图让这些指令覆盖 ChatGPT 的预期行为。如果模型遵循了注入的指令，它可能会执行用户和开发者从未意图的动作——包括将私人数据发送到外部目的地。

例如，你可能让 ChatGPT 通过检查你的日历和最近的电子邮件来寻找适合团体聚餐的餐厅。在研究过程中，它可能会遇到一条恶意评论——本质上是一种设计用来诱骗智能体执行非预期动作的有害内容——指示它从 Gmail 检索密码重置代码并将其发送到恶意网站。

以下是需要考虑的具体场景表格。我们建议你仔细查看此表格，以便决定是否使用自定义 MCP。

| 场景 / 风险                                                                                                                                                                                                                                                                                                                                                                                                                       | 如果我信任 MCP 的开发者，是否安全？                                                                                                                                                                                                                                                       | 我可以采取什么措施来降低风险？                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 攻击者可能以某种方式将提示注入攻击插入到可通过 MCP 访问的数据中。 <br /><br />_示例：_<br />• 对于客户支持 MCP，攻击者可能会向你发送带有提示注入攻击的客户支持请求。                                                                                                                                                                                           | 信任 MCP 的开发者并不能使其安全。<br /><br />要做到安全，你需要信任 _所有可通过 MCP 访问的内容_.                                                                                                                                          | • 即使你信任 MCP 的开发者，如果它可能包含恶意或不可信的用户输入，也不要使用该 MCP。<br />• 配置访问权限，以尽量减少有权访问 MCP 的人数。                                                                                                                              |
| 恶意 MCP 可能会向读取或写入操作请求过多的参数。 <br /><br />_示例：_<br />• 员工航班预订 MCP 可能会暴露一个获取航班时刻表的读取操作，但请求的参数包括 `summaryOfConversation`, `userAnnualIncome`, `userHomeAddress`.                                                                                                                                        | 信任 MCP 的开发者并不一定使其安全。<br /><br />MCP 的开发者可能认为请求某些数据是合理的，而你认为共享这些数据不可接受。                                                                                              | • 手动安装 MCP 服务器时，请审查每个操作请求的参数，确保没有隐私越界。                                                                                                                                                                                              |
| 攻击者可能会利用提示注入攻击欺骗 ChatGPT 从自定义 MCP 获取敏感数据，然后将其发送给攻击者。 <br /><br />_示例：_<br />• 攻击者可能通过另一个 MCP（例如电子邮件）向企业用户之一发起提示注入攻击，该攻击试图欺骗 ChatGPT 读取内部工具中的敏感数据并将其发送给攻击者。 | 信任某个MCP的开发人员并不能保证这是安全的。<br /><br />新 MCP 内的所有内容都可能是安全和可信的，因为风险在于这些数据可能被来自不同恶意来源的攻击窃取。                                                                             | • _ChatGPT 旨在保护用户_，但攻击者可能会尝试窃取你的数据，因此请注意风险并考虑是否值得冒险。<br />• 配置访问权限，以尽量减少能够访问包含特别敏感数据的 MCP 的人数。                                                          |
| 攻击者可能会利用提示注入攻击，通过向自定义 MCP 写入操作来泄露敏感信息。 <br /><br />_示例：_<br />• 攻击者通过另一个 MCP 使用提示注入攻击，诱使 ChatGPT 获取敏感数据，然后利用客户支持系统的 MCP 将这些数据发送给攻击者。                                                                                       | 信任某个MCP的开发人员并不能保证这是安全的。<br /><br />即使你完全信任该 MCP，如果写入操作产生的任何后果可以被攻击者观察到，他们可能会试图利用这一点。                                                                          | • 用户应在写入操作发生时仔细审查（以确保操作是预期的，并且不包含任何不应共享的数据）。                                                                                                                                                                            |
| 攻击者可能会利用提示注入攻击，通过读取恶意自定义 MCP 的操作来泄露敏感信息，因为该 MCP 可以记录这些操作。                                                                                                                                                                                                                                                                    | 此攻击仅在 MCP 是恶意的，或 MCP 错误地将写入操作标记为读取操作时才有效。<br /><br />如果你信任某个 MCP 的开发人员能正确地将操作仅标记为 _读取_，并信任该开发人员不会尝试窃取数据，那么此风险可能极小。 | • 仅使用你信任的开发人员提供的 MCP（但请注意，这不足以确保安全）。                                                                                                                                                                                                                            |
| 攻击者可能会利用提示注入攻击，诱使 ChatGPT 通过自定义 MCP 执行用户未预期的有害或破坏性写入操作。                                                                                                                                                                                                                                                                          | 信任某个MCP的开发人员并不能保证这是安全的。<br /><br />新 MCP 内的所有内容都可能是安全和可信的，但此风险仍然存在，因为攻击来自不同的恶意来源。                                                                                     | • 用户应仔细审查写入操作，确保其符合预期且正确。<br />• ChatGPT 旨在保护用户，但攻击者可能试图诱使 ChatGPT 执行非预期的写入操作。<br />• 配置访问权限，以尽量减少可访问包含特别敏感数据的 MCP 的人数。 |

### 非提示注入相关风险

自定义 MCP 还会引入与提示注入攻击无关的其他风险：

- **写入操作可以提高 MCP 服务器的实用性和风险**，因为它们使服务器能够采取可能具有破坏性的操作，而不仅仅是向 ChatGPT 返回信息。ChatGPT 目前要求在任何会话中手动确认后才能进行写入操作。确认将标记可能敏感的数据，但你只应在仔细考虑并接受 ChatGPT 可能在此类操作中出错的情况下使用写入操作。即使 MCP 服务器已将操作标记为只读，写入操作也有可能发生，因此在部署到 ChatGPT 之前，你必须信任自定义 MCP 服务器，这一点更加重要。
- **任何 MCP 服务器在查询时都可能接收到敏感数据**. 即使服务器不是恶意的，它也能访问 ChatGPT 在交互过程中提供的任何数据，可能包括用户之前提供给 ChatGPT 的敏感数据。例如，此类数据可能包含在 ChatGPT 在使用深度研究或聊天应用工具时发送给 MCP 服务器的查询中。

### 连接到受信任的服务器

除非你了解并信任底层应用，否则我们建议你不要连接到自定义 MCP 服务器。

例如，选择服务提供商自己托管的官方服务器。连接到 Stripe 托管的 Stripe 服务器 `mcp.stripe.com` 而不是第三方托管非官方的 Stripe MCP 服务器。由于目前官方 MCP 服务器很少，你可以考虑使用组织通过 API 代理请求到另一服务的服务器。只有在审查了该组织如何使用你的数据，并确认你可以信任该服务器后方可连接。当构建并连接到你自己的 MCP 服务器时，请仔细检查它是否正确。注意你在响应请求时提供的数据，以及当 OpenAI 调用你的 MCP 服务器时，你如何处理发送给你的数据。

你的远程 MCP 服务器允许其他人将 OpenAI 连接到你的服务，并允许 OpenAI 访问、发送和接收数据，并对这些服务采取措施。避免在工具的 JSON 中放置敏感信息，避免存储来自访问你的远程 MCP 服务器的 ChatGPT 用户的任何敏感信息。

作为 MCP 服务器的构建者，不要在工具定义中放入任何恶意内容。