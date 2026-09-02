# 为插件和 API 集成构建 MCP 服务器

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 。

[Model Context Protocol](https://modelcontextprotocol.io/introduction) （MCP）是一个开放协议，正在成为用额外工具和知识扩展 AI 模型的事实行业标准。远程 MCP 服务器可用于通过互联网将模型连接到新的数据源和能力。

在本指南中，我们将介绍如何构建一个远程 MCP 服务器，它从私有数据源（一个 [vector store](https://developers.openai.com/api/docs/guides/retrieval)）读取数据，并通过 ChatGPT 和 Codex 中的插件、通过 ChatGPT 深度研究和公司知识，以及通过 API 提供这些数据。 [through the 接口](https://developers.openai.com/api/docs/guides/deep-research).

**注**：要使用 MCP 服务器构建插件，请从插件文档开始： [Quickstart](https://developers.openai.com/plugins/quickstart), [Build your MCP server](https://developers.openai.com/plugins/build/mcp-server), [Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt)，以及 [Authentication](https://developers.openai.com/plugins/build/auth)。如果你的 MCP 服务器不需要 UI，可以在不提供 UI 资源的情况下暴露工具。

## 配置数据源

你可以使用任何来源的数据来驱动远程 MCP 服务器,但为简单起见,我们将使用 [向量存储](https://developers.openai.com/api/docs/guides/retrieval) 中的 OpenAI API。首先将一份 PDF 文档上传到新的向量存储 - [你可以使用这本关于猫的 19 世纪公版书](https://cdn.openai.com/API/docs/cats.pdf) 作为示例。

你可以在此处控制台中上传文件并创建向量存储 [在控制台中完成](https://platform.openai.com/storage/vector_stores),也可以通过 API 创建向量存储并上传文件。 [按照向量存储指南](https://developers.openai.com/api/docs/guides/retrieval) 来设置向量存储并向其中上传文件。

记下该向量存储的唯一 ID,以便在接下来的示例中使用。

![向量存储配置](https://cdn.openai.com/API/docs/images/vector_store.png)

## 创建 MCP 服务器

接下来，我们来创建一个远程 MCP 服务器，它可以对我们的向量存储执行搜索查询，并能够根据给定的 ID 返回文件内容。

在本示例中，我们将使用 Python 和 [FastMCP](https://github.com/jlowin/fastmcp)。来构建我们的 MCP 服务器。服务器的完整实现将出现在本节末尾，并附带在 [基于浏览器的开发环境](https://replit.com/).

请注意，还有许多其他 MCP 服务器框架可用于各种编程语言。不过无论使用哪种框架，服务器中的工具定义都需要符合此处描述的形态。

若要与 ChatGPT 深度研究和企业知识配合使用，你的 MCP 服务器
应当实现两个只读工具： `search` 和 `fetch`，并使用
中的兼容性 schema， [企业知识兼容性](https://developers.openai.com/plugins/build/mcp-server#company-knowledge-compatibility).
相同的接口也可用于通过 API 进行的研究工作流。

为每个工具声明一个输出 schema，以便客户端能够验证结果的结构。
在 FastMCP 中，带类型的返回模型可以自动生成该 schema；下面的
示例通过相同的模型显式传入 `output_schema` 该 schema。

### `search` 工具

该 `search` 工具负责根据用户的查询，从你的 MCP 服务器的数据源返回相关搜索结果的列表。

_参数：_

单个查询字符串。

_返回：_

一个具有单个键的对象， `results`，其值是一个结果对象数组。每个结果对象应包含：

- `id` - 文档或搜索结果项的唯一 ID。
- `title` - 人类可读的标题。
- `url` - 用于引用的规范 URL。

在 MCP 中，将此对象作为 `structuredContent` 返回，并在
content 数组中以 JSON 编码字符串的形式包含相同的值 [content 数组](https://modelcontextprotocol.io/docs/learn/architecture#understanding-the-tool-execution-response)
以保证兼容性。

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

fetch 工具用于检索搜索结果文档或条目的完整内容。

_参数：_

一个字符串，是搜索文档的唯一标识符。

_返回：_

具有以下属性的单个对象：

- `id` - 文档或搜索结果项的唯一 ID。
- `title` - 搜索结果项的字符串标题
- `text` - 文档或条目的完整文本
- `url` - 文档或搜索结果项的 URL。便于在研究中
  引用具体资源。
- `metadata` - 与该结果相关的可选键值对数据

在 MCP 中，将此对象作为 `structuredContent` 返回，并在
内容数组中以字符串形式经过 JSON 编码的内容，用于兼容性。

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
为非空字符串时才会创建引用 `url` 元数据。如果某个 result 包含 `title` 但没有
可用的 `url` ，则它仍然只是普通的工具输出，而不会成为一条空的
引用。若要使某个 result 可被引用，请返回其规范的 `url`.

例如，ChatGPT 可能会这样调用 `search` :

```json
{ "query": "What is the quarterly plan?" }
```

MCP 服务器可以使用一个带 URL 的 result 进行响应：

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

在该响应中， `url` 字段存在值，这使得该 result 有资格
生成引用元数据。query 本身不会触发引用处理。如果
result 省略了 `url`，或者提供了空值或非字符串值，ChatGPT
会将该 result 保留为普通的工具输出。

### 服务端示例

你可以在以下地址试用此 MCP 服务器示例 [基于浏览器的开发环境](https://replit.com/). 使用你自己的 API 凭证和向量存储信息配置该示例。

[Replit 上的 MCP 服务器示例



      Remix the server example on Replit to test live.](https://replit.com/@kwhinnery-oai/DeepResearchServer?v=1#README.md)

下面是 FastMCP 中两个 `search` 和 `fetch` 工具的完整实现，供你参考。



#### 完整实现 - FastMCP server



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








#### Replit setup



在 Replit 上，你需要在 "Secrets" UI 中配置两个环境变量：

- `OPENAI_API_KEY` - 你的标准 OpenAI API 密钥
- `VECTOR_STORE_ID` - 可用于搜索的向量存储的唯一标识符，即你之前创建的那个。

在免费版 Replit 账号上，服务端 URL 仅在编辑器处于活跃状态时有效，因此在测试期间，你需要保持浏览器标签页处于打开状态。可以通过点击链条图标来获取 MCP server 的 URL：

![replit 配置](https://cdn.openai.com/API/docs/images/replit.png)

在长开发版 URL 中，确保其以 `/sse/`，结尾，这是 MCP server 的 server-sent events（流式）接口。这个 URL 将用于在 ChatGPT 中连接你的应用并通过 API 调用它。一个 Replit URL 的示例如下：

```
https://777xxx.janeway.replit.dev/sse/
```





## 测试并连接你的 MCP 服务器

你可以在 prompts dashboard 中使用深度研究模型测试你的 MCP 服务器 [提示词面板](https://platform.openai.com/chat)。新建一个提示词，或编辑现有提示词，并向该提示词配置中添加一个新的 MCP 工具。这个兼容性示例仅暴露只读工具，因此其 API 请求会跳过对这些工具的审批。请为可能修改数据或执行其他重大操作的工具保留审批启用。 `search` 和 `fetch` 如果你正在作为插件的一部分测试该服务器，请按照。

测试说明操作 [Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt).

![提示词配置](https://cdn.openai.com/API/docs/images/prompts_mcp.png)

配置好 MCP 服务器后，你可以通过提示词 UI 使用它与模型进行对话。

![提示词对话](https://cdn.openai.com/API/docs/images/chat_prompts_mcp.png)

你可以直接使用 Responses API 通过如下请求测试该 MCP 服务器：

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

作为自定义远程 MCP 服务器的构建者，授权与身份验证可帮助你保护数据。当你的授权服务器支持 CIMD 且插件创建者选择它时，我们建议使用 OAuth 进行 [Client ID Metadata Documents](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents) 以进行客户端注册。ChatGPT 通过公共客户端令牌交换（`none`）或签名客户端断言令牌交换（`private_key_jwt`）支持 CIMD。在已配置时仍支持动态客户端注册。有关插件身份验证要求，请参阅 [Authentication](https://developers.openai.com/plugins/build/auth)。有关协议详情，请参阅 [MCP user guide](https://modelcontextprotocol.io/docs/concepts/transports#authentication-and-authorization) 或 [authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).

如果你通过插件连接自定义远程 MCP 服务器，你工作区中的用户将获得一个指向你服务的 OAuth 流程。

### 在 ChatGPT 中连接

1. 在 [ChatGPT](https://chatgpt.com)，中，打开 **Settings → Security and login** 并开启 **Developer mode**.
1. 前往 [ChatGPT Plugins](https://chatgpt.com/plugins)，点击加号按钮，并在开发者模式下连接你的服务器 URL。
1. 在聊天和深度研究中运行提示词来测试你的插件。

有关详细设置步骤，请参阅 [Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt).

## 风险与安全

自定义 MCP 服务器可让你将 ChatGPT 工作区连接到外部应用，使 ChatGPT 能够在这些应用中访问、发送和接收数据。请注意，自定义 MCP 服务器并非由 OpenAI 开发或验证，属于第三方服务，需遵循其自身的条款与条件。

如果你发现恶意 MCP 服务器，请向 security@openai.com.

### 提示词注入相关风险

提示注入是一种攻击形式：攻击者将恶意指令嵌入到我们的模型可能遇到的内容中（例如网页），意图让这些指令覆盖 ChatGPT 既定的行为。如果模型遵从了被注入的指令，可能会执行用户和开发者从未预期的操作——包括将私密数据发送到外部目标。

例如，你可能让 ChatGPT 通过查看你的日历和最近邮件来为一次聚餐找餐厅。在研究过程中，它可能会遇到一条恶意评论——本质上就是一段旨在诱骗智能体执行非预期操作的有害内容——指示它从 Gmail 检索密码重置码并将其发送到一个恶意网站。

下表列出了需要考虑的具体场景。建议你仔细查看该表，以便决定是否使用自定义 MCP。

| 场景 / 风险                                                                                                                                                                                                                                                                                                                                                                                                                       | 如果我信任 MCP 的开发者，这样是否安全？                                                                                                                                                                                                                                                       | 我可以通过哪些方式降低风险？                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 攻击者可能通过某种方式在 MCP 可访问的数据中植入提示词注入攻击。 <br /><br />_示例：_<br />• 对于一个客服 MCP，攻击者可能会向你发送一条带有提示词注入攻击的客服请求。                                                                                                                                                                                           | 信任 MCP 的开发者并不能保证安全。<br /><br />要保证安全，你需要信任 _MCP 中可访问的所有内容_.                                                                                                                                          | • 即使你信任 MCP 的开发者，也不要在 MCP 可能包含恶意或不可信的用户输入时使用它。<br />• 配置访问权限，尽量减少能够访问该 MCP 的人员数量。                                                                                                                              |
| 一个恶意的 MCP 可能会在读或写操作中请求过多的参数。 <br /><br />_示例：_<br />• 一个员工机票预订 MCP 可能会暴露一个用于获取航班时刻表的读操作，但请求的参数包括 `summaryOfConversation`, `userAnnualIncome`, `userHomeAddress`.                                                                                                                                        | 信任 MCP 的开发者不一定能保证安全。<br /><br />MCP 的开发者可能认为请求某些数据是合理的，而你认为这些数据不适合共享。                                                                                              | • 在手动安装 MCP 服务器时，请检查每个操作所请求的参数，确保不存在超出合理范围的隐私获取。                                                                                                                                                                                              |
| 攻击者可能使用提示词注入攻击诱骗 ChatGPT 从自定义 MCP 中获取敏感数据，再发送给攻击者。 <br /><br />_示例：_<br />• 攻击者可能通过另一个 MCP（例如电子邮件）向某个企业用户实施提示词注入攻击，企图诱骗 ChatGPT 从内部工具读取敏感数据并发送给攻击者。 | 信任 MCP 的开发者并不能保证安全。<br /><br />由于风险在于这些数据可能被来自其他恶意来源的攻击窃取，因此新 MCP 中的所有内容本身可以是安全且可信的。                                                                             | • _ChatGPT 旨在保护用户_，但攻击者可能会尝试窃取你的数据，因此请注意相关风险，并权衡这样做是否合理。<br />• 配置访问权限，尽可能减少能够访问包含特别敏感数据的 MCP 的人数。                                                          |
| 攻击者可能通过针对自定义 MCP 的写入操作发起提示注入攻击，从而泄露敏感信息。 <br /><br />_示例：_<br />• 攻击者通过另一个 MCP 发起提示注入攻击，诱使 ChatGPT 获取敏感数据，然后利用客服系统的 MCP 将其发送给攻击者。                                                                                       | 信任 MCP 的开发者并不能保证安全。<br /><br />即使你完全信任该 MCP，只要写入操作产生的任何后果可能被攻击者观察到，他们就有可能试图加以利用。                                                                          | • 用户应在写入操作发生时仔细审查（以确认这些操作是预期的，并且不包含不应被共享的任何数据）。                                                                                                                                                                            |
| 由于 MCP 可以记录读取操作，攻击者可能通过针对恶意自定义 MCP 的读取操作发起提示注入攻击来泄露敏感信息。                                                                                                                                                                                                                                                                    | 此类攻击只有在 MCP 是恶意的，或者 MCP 错误地将写入操作标记为读取操作时才会成功。<br /><br />如果你信任某个 MCP 的开发者能够正确地仅将读取操作标记为 _读取_，并相信该开发者不会试图窃取数据，那么这种风险可能很小。 | • 仅使用你信任的开发者提供的 MCP（但请注意，这本身并不足以保证安全）。                                                                                                                                                                                                                            |
| 攻击者可能发起提示注入攻击，诱使 ChatGPT 通过自定义 MCP 执行用户并未预期的有害或破坏性写入操作。                                                                                                                                                                                                                                                                          | 信任 MCP 的开发者并不能保证安全。<br /><br />新 MCP 中的所有内容都可能是安全可信的，但由于攻击来自另一个恶意来源，这种风险仍然存在。                                                                                     | • 用户应仔细审查写入操作，以确保这些操作是预期的且正确的。<br />• ChatGPT 旨在保护用户，但攻击者可能会试图诱使 ChatGPT 执行非预期的写入操作。<br />• 配置访问权限，尽可能减少能够访问包含特别敏感数据的 MCP 的人数。 |

### 非提示词注入相关风险

自定义 MCP 会引入与提示注入攻击无关的其他风险：

- **写入操作既会提升 MCP 服务器的有用性，也会增加其风险**，因为它们使服务器能够执行可能具有破坏性的操作，而不仅仅是向 ChatGPT 返回信息。ChatGPT 当前在任何对话中都要求在执行写入操作之前进行手动确认。确认流程会标记潜在的敏感数据，但你应仅在已仔细考虑并接受 ChatGPT 可能在涉及此类操作时犯错的可能性之后，才使用写入操作。即使 MCP 服务器将操作标记为只读，写入操作仍可能发生，这使得在部署到 ChatGPT 之前信任自定义 MCP 服务器变得更加重要。
- **任何 MCP 服务器都可能作为查询的一部分接收敏感数据**。即使服务器并非恶意，它也能够访问 ChatGPT 在交互过程中提供的任何数据，其中可能包括用户此前已提供给 ChatGPT 的敏感数据。例如，当使用深度研究或聊天应用工具时，ChatGPT 向 MCP 服务器发送的查询中可能包含此类数据。

### 连接到受信任的服务器

我们建议你不要连接自定义 MCP 服务器，除非你了解并信任底层应用程序。

例如，请选择由服务提供商自行托管的官方服务器。可连接由 Stripe 托管的 Stripe 服务器，地址为 `mcp.stripe.com` ，而非由第三方托管的非官方 Stripe MCP 服务器。由于目前官方 MCP 服务器较少，你可以考虑使用由某个组织托管、用于通过 API 将请求代理到另一项服务的服务器。仅当你已经审查过该组织如何使用你的数据并确认可以信任该服务器后，再进行连接。在构建并连接你自己的 MCP 服务器时，请仔细确认它就是正确的服务器。注意响应请求时所提供的数据，以及当 OpenAI 调用你的 MCP 服务器时如何处理发送给你的数据。

你的远程 MCP 服务器允许其他人将 OpenAI 连接到你的服务，并允许 OpenAI 在这些服务中访问、收发数据以及执行操作。避免在工具的 JSON 中放入任何敏感信息，也避免存储来自访问你远程 MCP 服务器的 ChatGPT 用户的任何敏感信息。

作为 MCP 服务器的构建者，请勿在工具定义中放入任何恶意内容。