# ChatGPT Developer mode

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

[<span
      aria-hidden="true"
      class="h-4 w-4 shrink-0 bg-current"
      style="-webkit-mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain; mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain;"
    >

    Elevated risk](https://help.openai.com/en/articles/20001062)



## 什么是 ChatGPT 开发者模式

ChatGPT 开发者模式为所有工具提供完整的模型上下文协议（MCP）客户端支持，包括读写操作。它功能强大但存在风险，面向了解如何安全配置和测试应用的开发者。使用开发者模式时，请留意 [提示注入及其他风险](https://developers.openai.com/api/docs/mcp)、可能导致数据被破坏的写入操作模型错误，以及企图窃取信息的恶意 MCP。

## 使用方法

- **资格：** 适用于网页端的 Pro、Plus、Business、Enterprise 和 Education 账户。
- **启用开发者模式：** 在 [ChatGPT](https://chatgpt.com)，中打开 **Settings → Security and login（设置 → 安全与登录）** 并开启 **Developer mode（开发者模式）**.
- **从 MCP 服务器创建应用：**
  - 前往 [ChatGPT Plugins](https://chatgpt.com/plugins).
  - 点击加号按钮，为你的远程 MCP 服务器创建一个开发者模式应用。它将在对话中稍后出现在撰写器的 **Developer mode（开发者模式）** 工具列表中。仅当你开启 Developer mode 后，加号按钮才会创建开发者模式应用。
    - 支持的 MCP 协议：SSE 和 streaming HTTP。
    - 支持的身份验证方式：OAuth、No Authentication 和 Mixed Authentication（混合身份验证）。
      - 对于 OAuth，如果提供了静态凭证，则会使用这些凭证。否则，当授权服务器声明支持 CIMD 且应用创建者选择 CIMD 时，ChatGPT 可以使用 Client ID Metadata Documents（客户端 ID 元数据文档）。CIMD 支持公共客户端令牌交换（`none`）和签名客户端断言令牌交换（`private_key_jwt`）。ChatGPT 在配置后也可以使用 DCR。
      - Mixed authentication 支持 OAuth 和 No Authentication。这意味着 initialize 和 list tools API 使用 no auth，而 tools 则根据其工具元数据中设置的安全方案使用 OAuth 或 no auth。
  - 已创建的应用会显示在应用设置中的 “Drafts”（草稿）下。
- **管理工具：** 在应用设置中，每个应用都有一个详情页。你可以使用该页面启用或关闭工具，并刷新应用以从 MCP 服务器拉取新的工具、描述和服务器说明。
- **在对话中使用应用：** 选择 **Developer mode（开发者模式）** 从 Plus 菜单中选择要为对话使用的应用。你可能需要尝试不同的提示技巧来调用正确的工具。例如：
  - 明确指定：“使用 \"Acme CRM\" 应用的 \"update_record\" 工具来……”。必要时，请注明服务器标签和工具名称。
  - 禁止使用其他替代方案以避免歧义：“不要使用内置浏览或其他工具，只能使用 Acme CRM 应用。”
  - 区分相似的工具：“优先使用 `Calendar.create_event` 用于会议，不要使用 `Reminders.create_task` 用于日程安排。”
  - 指定输入形式和调用顺序：“首先调用 `Repo.read_file` 并传入 `{ path: "…" }`。然后使用修改后的内容调用 `Repo.write_file` 。不要调用其他工具。”
  - 如果多个应用存在重叠，请提前说明偏好（例如：“使用 `CompanyDB` 以获取权威数据；仅在其他来源 `CompanyDB` 无结果时使用）。
  - 开发者模式不需要 `search`/`fetch` 工具。你应用暴露的任何工具（包括写入操作）都可用，但受确认设置约束。
  - 更多指南请参阅 [使用工具](https://developers.openai.com/api/docs/guides/tools) 和 [提示工程](https://developers.openai.com/api/docs/guides/prompting).
  - 通过改进工具描述来提升工具选择：在你的 MCP 服务器中，编写面向动作的工具名称与描述，加入“Use this when…”式的指引，注明不允许的情况与边界情形，并补充参数描述（含枚举值），以帮助模型在相似工具中做出正确选择，并在不必要时避免使用内置工具。
  - 为跨工具指引添加服务器说明：使用 MCP 的 [`instructions` 字段](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle#initialization) 提供服务器范围的指引，例如必需的工具调用顺序、共享的速率限制或工具之间的关系。请保持前 512 个字符内容自洽完整。

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

- **审阅并确认工具调用：**
  - 检查 JSON 工具负载以验证正确性并排查问题。对于每个工具调用，你可以使用展开箭头收起或展开工具调用详情，工具输入与输出的完整 JSON 内容均可查看。
  - 默认情况下，写入操作需要确认。请仔细审阅将发送给写入操作的工具输入，确保行为符合预期。错误的写入操作可能会意外破坏、修改或泄露数据！
  - 只读检测：我们遵循 `readOnlyHint` 工具注解（参见 [MCP 工具注解](https://modelcontextprotocol.io/legacy/concepts/tools#available-tool-annotations)）。未标注该提示的工具将被视为写入操作。
  - 你可以选择让对话中的某个工具记住“批准”或“拒绝”的选择，这意味着该选择会在该对话的剩余部分继续生效。因此，只有当你了解并信任底层应用可以在未经你批准的情况下执行进一步的写入操作时，才应允许该工具记住“批准”选择。新的对话会再次提示进行确认。刷新同一对话后，后续回合也会再次提示进行确认。