# Add custom MCP server

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

[<span
      aria-hidden="true"
      class="h-4 w-4 shrink-0 bg-current"
      style="-webkit-mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain; mask: url('/images/codex/exclamation-shield.svg') no-repeat center / contain;"
    >

    Elevated risk](https://help.openai.com/en/articles/20001062)



<a id="what-is-chatgpt-developer-mode"></a>

## Connect a custom MCP server

Connect your Model Context Protocol (MCP) server to ChatGPT as a plugin. ChatGPT supports both read and write tools from your server.

Only connect to MCP servers you trust. An untrusted server may access or steal information shared through app use, or trick ChatGPT into using tools in unintended ways, including changing or deleting data. Review [prompt injections and other risks](https://developers.openai.com/api/docs/mcp) before connecting a server.

## How to use

- **Access:** Use ChatGPT on the web. Workspace permissions and security restrictions, including Lockdown, apply to adding and using custom MCP servers.
- **Add an MCP server as a plugin:**
  1. Go to [ChatGPT Plugins](https://chatgpt.com/plugins).
  2. Select the plus button, then **Add custom MCP server**.
  3. Enter a name and, optionally, a description. Under **Connection**, enter your **Server URL**, or select **Tunnel** for a [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels).
  4. Configure authentication for your server.
  5. Review the risk warning and select **I understand and want to continue**.
  6. Select **Create as a plugin**.
  - Supported MCP protocols: SSE and streaming HTTP.
  - Authentication options include **OAuth**, **No authentication**, and **OAuth or no authentication**.
    - For OAuth, if static credentials are provided, then they will be used. Otherwise, ChatGPT can use Client ID Metadata Documents when the authorization server advertises support and the app creator chooses CIMD. CIMD supports public-client token exchange (`none`) and signed client assertion token exchange (`private_key_jwt`). ChatGPT can also use DCR when configured.
    - Mixed authentication supports OAuth and no authentication. This means the initialize and list tools APIs use no auth, and tools use OAuth or no auth based on the security schemes set on their tool metadata.
  - Find the resulting plugin in your personal plugins or the workspace where you created it. Install it before using it in a conversation.

- **Manage tools:** In app settings there is a details page per app. Use that to toggle tools on or off and refresh apps to pull new tools, descriptions, and server instructions from the MCP server.
- **Use apps in conversations:** In the prompt box, type `@` and select your installed plugin. Custom MCP plugins can be used alongside other apps, subject to workspace permissions and security restrictions. You may need to explore different prompting techniques to call the correct tools. For example:
  - Be explicit: `Use the "Acme CRM" app's "update_record" tool to …`. When needed, include the server label and tool name.
  - Disallow alternatives to avoid ambiguity: "Do not use built-in browsing or other tools; only use the Acme CRM app."
  - Disambiguate similar tools: "Prefer `Calendar.create_event` for meetings; do not use `Reminders.create_task` for scheduling."
  - Specify input shape and sequencing: "First call `Repo.read_file` with `{ path: "…" }`. Then call `Repo.write_file` with the modified content. Do not call other tools."
  - If multiple apps overlap, state preferences up front (for example, "Use `CompanyDB` for authoritative data; use other sources only if `CompanyDB` returns no results").
  - Custom MCP servers do not require `search`/`fetch` tools. Any tools your app exposes (including write actions) are available, subject to confirmation settings.
  - See more guidance in [Using tools](https://developers.openai.com/api/docs/guides/tools) and [Prompting](https://developers.openai.com/api/docs/guides/prompting).
  - Improve tool selection with better tool descriptions: In your MCP server, write action-oriented tool names and descriptions that include "Use this when…" guidance, note disallowed/edge cases, and add parameter descriptions (and enums) to help the model choose the right tool among similar ones and avoid built-in tools when inappropriate.
  - Add server instructions for cross-tool guidance: Use the MCP [`instructions` field](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle#initialization) for server-wide guidance such as required tool sequences, shared rate limits, or relationships between tools. Keep the first 512 characters self-contained.

  Examples:

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

- **Reviewing and confirming tool calls:**
  - Inspect JSON tool payloads to verify correctness and debug problems. For each tool call, expand the tool call details. Full JSON contents of the tool input and output are available.
  - Write actions by default require confirmation. Carefully review the tool input which will be sent to a write action to ensure the behavior is as desired. Incorrect write actions can inadvertently destroy, alter, or share data!
  - Read-only detection: We respect the `readOnlyHint` tool annotation (see [MCP tool annotations](https://modelcontextprotocol.io/legacy/concepts/tools#available-tool-annotations)). Tools without this hint are treated as write actions.
  - You can choose to remember the approve or deny choice for a given tool for a conversation, which means it will apply that choice for the rest of that conversation. Because of this, you should only allow a tool to remember the approve choice if you know and trust the underlying application to make further write actions without your approval. New conversations will prompt for confirmation again. Refreshing the same conversation will also prompt for confirmation again on subsequent turns.