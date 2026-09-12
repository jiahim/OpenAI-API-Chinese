# 架构

> 完整的文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI 运行 智能体 运行时。你的应用向其发送任务并接收结果。当 智能体 需要算力或文件时，添加环境。

## 组成部分

- **Harness:** The OpenAI-hosted Codex 实例，用于运行模型与工具循环，并维护该智能体的会话。
- **Environment:** 智能体运行命令、执行代码以及处理文件的场所。环境可以是远程沙盒、你的笔记本电脑、Docker 容器或 AWS Lambda 函数。
- **Application server:** 你用于将智能体接入产品的代码。它负责提交任务、接收事件并处理函数工具。当你提供环境时，你的代码也会管理其生命周期。

从你的任务所需的部分入手。harness 可以在没有 environment 的情况下工作，你的应用可以通过 streaming 或 webhooks 接收进度。

## 无需环境即可开始

一个智能体如果只是回答问题或使用工具访问外部服务，可能不需要自己的计算资源或文件。请将 `environment.type` 设置为 `none`。此片段展示了环境设置。会话创建还需要一个智能体和初始输入：

```json
{
  "environment": {
    "type": "none"
  }
}
```

你的应用向会话发送输入，harness 调用模型，使用已配置的工具，并返回结果。OpenAI 负责维护该会话，以便后续使用。

harness 可以直接调用远程 MCP 工具。对于 [函数工具](https://developers.openai.com/api/docs/guides/agents-api/tools/functions)，你的代码会接收每一次调用，运行相应函数，并返回其结果。

如果没有环境，内置的 Bash 和 apply-patch 工具、工作区文件以及 executor MCP 都将不可用。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/architectures-4-mobile.webp"
    width="680"
    height="1260"
  />
  <img src="https://developers.openai.com/images/api/agents-api/architectures-4.webp"
    width="1400"
    height="844"
    alt="With no sandbox, the application supplies function tools or a virtual shell, and the Agents API can call remote MCP servers. There is no executor or built-in shell."
    loading="lazy"
  />
</picture>

此处展示的可选虚拟运行时通过你应用中的函数工具提供文件和 shell 命令。

## 添加一个由 OpenAI 托管的环境

当智能体需要运行脚本、编辑文件或创建产物时，设置 `environment.type` 设置为 `openai_hosted`。OpenAI 为该会话创建并管理一个沙箱。

你配置 智能体 所需的软件包、文件和网络访问。运行框架直接在沙箱中执行命令。你的应用继续发送任务、接收事件并处理任何函数工具。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/architectures-1-mobile.webp"
    width="680"
    height="1348"
  />
  <img src="https://developers.openai.com/images/api/agents-api/architectures-1.webp"
    width="1400"
    height="700"
    alt="An application starts sessions and receives events from the Agents API, which runs the managed Codex harness and exchanges tool calls and results with a sandbox. The application controls compute only for self-hosted sandboxes."
    loading="lazy"
  />
</picture>

虚线箭头仅在你自行管理环境时适用，如下文所述。

参见 [OpenAI 托管环境](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted) 中的配置选项。

## 连接你自己的环境

使用 `environment.type: "self_hosted"` 当智能体需要你的基础设施、私有网络或自定义软件时。

你的代码启动环境并将执行器连接到会话。执行器运行 harness 请求的命令和工具。你的应用管理连接和生命周期，而无需转发每个命令。

你负责资源调配、重连、关闭以及你需要保留的任何文件。你的应用服务器或 webhook 处理程序可以管理这些工作。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/architectures-2-mobile.webp"
    width="680"
    height="1560"
  />
  <img src="https://developers.openai.com/images/api/agents-api/architectures-2.webp"
    width="1400"
    height="1320"
    alt="The application creates a self-hosted session, starts compute, and connects an executor. It receives events and checks the turn outcome before stopping compute."
    loading="lazy"
  />
</picture>

在停止计算之前，协调传入的工作并确认没有待执行的请求。

参见 [连接沙盒](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 和 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以了解设置和关闭要求。

## 接收进度和结果

无论选择哪种环境，你都可以使用以下其中一种或两种：

- **流式传输：** 在 智能体 运行时接收详细事件，例如可在你的产品中显示的输出。
- **Webhooks：** 无需保持长连接即可接收会话状态变更。你的处理器可以检索结果、运行函数工具，或管理自托管环境。

函数工具需要一个处理程序来接收调用并返回结果。如果该处理程序不可用，智能体 可能会一直等待结果。事件或生命周期处理程序中的失败也可能中断进度更新或环境管理。

参见 [会话事件](https://developers.openai.com/api/docs/guides/agents-api/sessions) 和 [Webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) 了解集成详情。