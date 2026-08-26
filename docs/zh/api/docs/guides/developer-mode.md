# ChatGPT 开发者模式

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

[<span
      aria-hidden="true"
      class="h-4 w-4 shrink-0 bg-current"
      style="-webkit-mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain; mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain;"
    >

    Elevated risk](https://help.openai.com/en/articles/20001062)



## 什么是 ChatGPT 开发者模式

ChatGPT 开发者模式为所有工具提供完整的模型上下文协议（MCP）客户端支持，既支持读取也支持写入。它功能强大但危险，适用于理解如何安全配置和测试应用的开发者。使用开发者模式时，请注意 [提示注入和其他风险](https://developers.openai.com/api/docs/mcp)、模型在可能破坏数据的写入操作上的错误，以及试图窃取信息的恶意 MCP。

## 如何使用

- **资格要求：** 适用于网页上的 Pro、Plus、Business、Enterprise 和 Education 账户。
- **启用开发者模式：** 在 [ChatGPT](https://chatgpt.com)，中，打开 **设置 → 安全与登录** 并开启 **开发者模式**.
- **从 MCP 服务器创建应用：**
  - 前往 [ChatGPT 插件](https://chatgpt.com/plugins).
  - 选择加号按钮，为你的远程 MCP 服务器创建开发者模式应用。它将在对话期间出现在编辑器（composer）的 **开发者模式** 工具中。只有在你开启开发者模式后，加号按钮才会创建开发者模式应用。
    - 支持的 MCP 协议：SSE 和流式 HTTP。
    - 支持的身份验证：OAuth、无身份验证和混合身份验证
      - 对于 OAuth，若提供了静态凭据，则将使用静态凭据。否则，当授权服务器声明支持且应用创建者选择 CIMD 时，ChatGPT 可以使用客户端 ID 元数据文档（Client ID Metadata Documents）。CIMD 支持公共客户端令牌交换（`none`）和带签名客户端断言令牌交换（`private_key_jwt`）。配置后，ChatGPT 也可以使用 DCR。
      - 混合认证支持 OAuth 和无认证。这意味着 initialize 和 list 工具 API 不使用认证，而工具根据其工具元数据中设置的安全方案使用 OAuth 或无认证。
  - 创建的应用将显示在应用设置中的“草稿”下。
- **管理工具：** 在应用设置中，每个应用都有一个详情页面。使用该页面可以打开或关闭工具，并刷新应用以从 MCP 服务器拉取新工具、描述和服务器指令。
- **在对话中使用应用：** 从 Plus 菜单中选择 **开发者模式** ，然后选择对话的应用。你可能需要尝试不同的提示技巧来调用正确的工具。例如：
  - 明确指定：“使用 \"Acme CRM\" 应用的 \"update_record\" 工具来……”。需要时，包括服务器标签和工具名称。
  - 禁止替代方案以避免歧义：“不要使用内置浏览器或其他工具；只使用 Acme CRM 应用。”
  - 消除相似工具的歧义：“优先使用 `Calendar.create_event` 用于会议；不要使用 `Reminders.create_task` 用于日程安排。”
  - 指定输入形状和顺序：“首先调用 `Repo.read_file` ，使用 `{ path: "…" }`。然后调用 `Repo.write_file` 使用修改后的内容。不要调用其他工具。
  - 如果多个应用存在重叠，请提前说明偏好（例如，"使用 `CompanyDB` 获取权威数据；仅在其他来源 `CompanyDB` 无结果时使用其他来源"）。
  - 开发者模式不要求 `search`/`fetch` 工具。你的应用公开的任何工具（包括写入操作）均可用，具体取决于确认设置。
  - 更多指导，请参阅 [使用工具](https://developers.openai.com/api/docs/guides/tools) 和 [提示指南](https://developers.openai.com/api/docs/guides/prompting).
  - 通过更好的工具描述改进工具选择：在你的 MCP 服务器中，编写面向操作的工具名称和描述，包含"何时使用此工具……"的指引，注明不允许/边界情况，并添加参数描述（和枚举），以帮助模型在相似工具中选择正确的工具，并在不适用时避免使用内置工具。
  - 为跨工具指导添加服务器指令：使用 MCP [`instructions` 字段](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle#initialization) 提供服务器级指导，如必需工具顺序、共享速率限制或工具间关系。保持前 512 个字符自包含。

  示例：

```
  Schedule a 30‑minute meeting tomorrow at 3pm PT with
  alice@example.com and bob@example.com using "Calendar.create_event".
  Do not use any other scheduling tools.
```

```
  Create a pull request using "GitHub.open_pull_request" from branch
  "feat-retry" into "main" with title "Add retry logic" and body "…".
  Do not push directly to main.
```

- **查看和确认工具调用：**
  - 检查 JSON 工具负载以验证正确性并调试问题。对于每次工具调用，你可以使用插入符展开和折叠工具调用详情。工具输入和输出的完整 JSON 内容均可用。
  - 写入操作默认需要确认。仔细审查将发送到写入操作的工具输入，确保行为符合预期。错误的写入操作可能无意中破坏、修改或共享数据！
  - 只读检测：我们尊重 `readOnlyHint` 工具注解（参见 [MCP 工具注解](https://modelcontextprotocol.io/legacy/concepts/tools#available-tool-annotations)）。没有此提示的工具将被视为写入操作。
  - 你可以选择在对话中记住对某个工具的批准或拒绝选择，这意味着该选择将在该对话的剩余部分中生效。因此，仅当你了解并信任底层应用在未经你批准的情况下执行进一步的写入操作时，才应允许工具记住批准选择。新对话将再次提示确认。刷新同一对话后，后续轮次也会再次提示确认。