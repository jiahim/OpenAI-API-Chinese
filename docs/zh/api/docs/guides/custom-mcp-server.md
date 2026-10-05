# 添加自定义 MCP 服务器

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

[<span
      aria-hidden="true"
      class="h-4 w-4 shrink-0 bg-current"
      style="-webkit-mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain; mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain;"
    >

    Elevated risk](https://help.openai.com/en/articles/20001062)



<a id="what-is-chatgpt-developer-mode"></a>

## 连接自定义 MCP 服务器

将你的 Model Context Protocol (MCP) 服务器作为插件连接到 ChatGPT。ChatGPT 支持来自你服务器的读写工具。

仅连接你信任的 MCP 服务器。不可信的服务器可能会访问或窃取通过应用使用共享的信息，或诱使 ChatGPT 以非预期方式使用工具，包括更改或删除数据。请在连接服务器之前查看 [提示注入及其他风险](https://developers.openai.com/api/docs/mcp) 。

## 如何使用

- **访问：** 在网页版上使用 ChatGPT。Workspace 权限和安全限制（包括 Lockdown）同样适用于添加和使用自定义 MCP 服务器。
- **将 MCP 服务器添加为插件：**
  1. 前往 [ChatGPT 插件](https://chatgpt.com/plugins).
  2. 点击加号按钮，然后 **添加自定义 MCP 服务器**.
  3. 输入名称以及可选的描述。在 **连接**，中，输入你的 **服务器 URL**，或选择 **Tunnel** 以使用 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels).
  4. 为你的服务器配置身份验证。
  5. 查看风险提示并选择 **我了解并希望继续**.
  6. 选择 **创建为插件**.
  - 支持的 MCP 协议：SSE 和流式 HTTP。
  - 身份验证选项包括 **OAuth**, **无身份验证**，以及 **OAuth 或无身份验证**.
    - 对于 OAuth，如果提供了静态凭据，则会使用这些凭据。否则，当授权服务器声明支持且应用创建者选择 CIMD 时，ChatGPT 可以使用 Client ID Metadata Documents。CIMD 支持公共客户端令牌交换（`none`）和已签名的客户端断言令牌交换（`private_key_jwt`）。ChatGPT 在配置后也可以使用 DCR。
    - 混合身份验证支持 OAuth 和无身份验证。这意味着 initialize 和 list tools API 使用无身份验证，而工具根据其工具元数据中设置的安全方案使用 OAuth 或无身份验证。
  - 在你创建它的工作区或你的个人插件中找到生成的插件。在对话中使用之前先安装它。

- **管理工具：** 在应用设置中，每个应用都有一个详情页。使用该页面可以启用或关闭工具，并刷新应用以从 MCP 服务器拉取新的工具、描述和服务器指令。
- **在对话中使用应用：** 在提示框中，输入 `@` 然后选择你已安装的插件。自定义 MCP 插件可以与其他应用一起使用，但需遵守工作区权限和安全限制。你可能需要探索不同的提示技巧来调用正确的工具。例如：
  - 明确指定： `Use the "Acme CRM" app's "update_record" tool to …`。必要时，包含服务器标签和工具名称。
  - 禁止替代方案以避免歧义：“不要使用内置浏览或其他工具；只使用 Acme CRM 应用。”
  - 区分相似工具：“优先使用 `Calendar.create_event` 用于会议；不要使用 `Reminders.create_task` 用于日程安排。"
  - 指定输入形状和调用顺序："首先调用 `Repo.read_file` 使用 `{ path: "…" }`。然后调用 `Repo.write_file` 并传入修改后的内容。不要调用其他工具。"
  - 如果多个应用存在重叠，请提前说明偏好（例如，"使用 `CompanyDB` 获取权威数据；仅在 `CompanyDB` 无返回结果时使用其他来源"）。
  - 自定义 MCP 服务器不需要 `search`/`fetch` 工具。你的应用所暴露的任何工具（包括写入操作）都可用，但需遵守确认设置。
  - 更多指引请参阅 [使用工具](https://developers.openai.com/api/docs/guides/tools) 和 [提示](https://developers.openai.com/api/docs/guides/prompting).
  - 通过更好的工具描述改进工具选择：在你的 MCP 服务器中，编写面向操作的工具名称和描述，包含"在……时使用"类的指引，注明不允许或边界情况，并添加参数描述（以及枚举值），以帮助模型在相似工具中做出正确选择，并在不适当的情况下避免使用内置工具。
  - 为跨工具指引添加服务器说明：使用 MCP 的 [`instructions` 字段](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle#initialization) 提供服务器级别的指引，例如必需的工具调用顺序、共享速率限制或工具之间的关系。保持前 512 个字符语义自洽。

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
  - 检查 JSON 工具载荷以验证正确性并调试问题。对于每个工具调用，展开工具调用详情，可查看工具输入和输出的完整 JSON 内容。
  - 默认情况下，写入操作需要确认。请仔细审阅将发送给写入操作的工具输入，以确保行为符合预期。错误的写入操作可能会意外销毁、更改或共享数据！
  - 只读检测：我们遵循 `readOnlyHint` 工具注解（参见 [MCP 工具注解](https://modelcontextprotocol.io/legacy/concepts/tools#available-tool-annotations)）。缺少此提示的工具将被视为写入操作。
  - 你可以选择为对话中的某个工具记住批准或拒绝的选择，这意味着该选择将在该对话的其余部分一直生效。因此，只有当你了解并信任底层应用能够在没有你批准的情况下继续执行写入操作时，才应允许某个工具记住批准选择。新对话将再次提示进行确认。刷新同一对话也会在后续轮次中再次提示进行确认。