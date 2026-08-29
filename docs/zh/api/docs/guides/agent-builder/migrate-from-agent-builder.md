# 从 智能体 Builder 迁移

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

使用本指南将现有的 智能体 Builder 工作流 导出为 Agents SDK 代码。
你可以使用导出的代码将 工作流 重新创建为 ChatGPT Workspace 智能体，或者
在你的应用中使用 Agents SDK 继续开发。

此过程不会转换你的 工作流 图，也无法保证所有
行为都能原样迁移。

## 选择迁移路径

- **Agents SDK**：最适合通过代码构建智能体。
- **ChatGPT Workspace 智能体**：最适合通过自然语言构建智能体
  ，并与团队共享。

## 迁移前的准备工作

你需要访问 工作流 中的
[智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder).

## 导出你的工作流

1. 在 智能体构建器中打开你的 工作流。
1. 选择 **Code** 在顶部导航栏中。
1. 选择 **Agents SDK** 在代码对话框中。
1. 选择 **TypeScript** 或 **Python**，然后复制完整的导出内容。

![智能体 Builder Code 对话框，已选中 Agents SDK](https://developers.openai.com/images/platform/guides/agent-builder/agents-sdk-export.png)

## 选项 1：继续使用 Agents SDK

当你希望在你构建并部署的应用中运行导出的工作流时，请使用此选项
。

将 TypeScript 或 Python 导出代码复制到你的应用中，安装并
配置匹配的Agents SDK，然后在你的运行时中测试该工作流。有关
配置和运行导出的指导，请参阅
[Agents SDK 概述](https://developers.openai.com/api/docs/guides/agents) 和
[快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart).
在部署前验证你应用的配置和行为。

## 选项 2：从导出中创建工作区 智能体

要使用此选项，你需要一个 ChatGPT Business、Enterprise 或 Edu 工作区
具有对 [工作区 智能体 的访问权限](https://chatgpt.com/agents) 以及
创建 智能体 的权限。

在 ChatGPT 中， [创建工作区 智能体](https://chatgpt.com/agents/studio/new).
将你导出的代码粘贴到聊天中，并使用以下提示词：

```text
Please help me convert this workflow into an agent:

<paste your exported code here>
```

在继续之前，请审阅构建器识别出的所有需要更改的行为
继续。

## 审阅并测试该智能体

某些 工作流 行为可能需要手动重建。请在测试迁移后的，
智能体 时，审查其控制流、触发器、工具和权限。

在创建 智能体 之前：

1. 审阅生成的指令和已配置的能力。
1. 配置所需的任何应用、工具、技能、身份验证和连接
   权限。
1. 选择 **预览** 并测试来自原始
   工作流 的代表性输入。
1. 将预览行为与原始 工作流 的预期
   行为进行比较。
1. 选择 **仅** 在验证迁移后的 智能体 后再创建。

遵循你为 工作流 使用的相同安全实践，尤其是在
智能体 可以访问私有数据或通过连接的工具执行操作时。

## 限制

- 核心具有强确定性的工作流可能无法忠实地迁移到
  工作区 智能体。
- 连接的应用、身份验证、发布和权限配置
  需要在 ChatGPT 中单独审核。
- 基于 Agents SDK 的实现要求你验证应用的
  运行时配置、工具、身份验证、权限和部署。

## 相关资源

- [智能体 构建器](https://developers.openai.com/api/docs/guides/agent-builder)
- [构建 智能体 时的安全](https://developers.openai.com/api/docs/guides/agent-builder-safety)
- [Agents SDK 概述](https://developers.openai.com/api/docs/guides/agents)
- [Agents SDK 快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [在 ChatGPT 中构建工作区 智能体 以完成可重复的工作](https://developers.openai.com/cookbook/articles/chatgpt-agents-sales-meeting-prep)