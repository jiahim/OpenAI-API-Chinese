# 从智能体构建器迁移

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

使用本指南将现有 智能体 Builder 工作流 导出为 Agents SDK 代码。
你可以使用导出结果在 ChatGPT Workspace 中重新创建工作流为智能体，或
在你的应用程序中继续使用 Agents SDK。

此过程不会转换你的 工作流 图，也不能保证每项
行为都能原样保留。

## 选择迁移路径

- **Agents SDK**：最适合通过代码构建智能体。
- **ChatGPT Workspace 智能体**：最适合通过自然
  语言构建智能体并与团队分享。

## 迁移之前

你需要访问 工作流 中的
[智能体 构建器](https://developers.openai.com/api/docs/guides/agent-builder).

## 导出你的 工作流

1. 在 智能体 Builder 中打开你的 工作流。
1. 选择 **Code** 在顶部导航中。
1. 选择 **Agents SDK** 在代码对话框中。
1. 选择 **TypeScript** 或 **Python**，然后复制完整的导出内容。

![已选中 智能体 Builder 代码对话框，并选择了 Agents SDK](https://developers.openai.com/images/platform/guides/agent-builder/agents-sdk-export.png)

## 选项 1：继续使用 Agents SDK

当你希望在某个应用中运行导出的工作流时，可使用此选项
构建和部署。

将 TypeScript 或 Python 导出复制到你的应用中，安装并
配置匹配的Agents SDK，然后在你的运行时中测试该工作流。有关
配置和运行导出的指导，请参阅
[Agents SDK 概述](https://developers.openai.com/api/docs/guides/agents) 和
[快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart).
在部署前，请验证你的应用配置和行为。

## 选项 2：从导出文件创建智能体工作区

要使用此选项，你需要一个 ChatGPT Business、Enterprise 或 Edu 工作区
，并具有 [工作区智能体的访问权限](https://chatgpt.com/agents) 及创建智能体的权限。
及创建智能体的权限。

在 ChatGPT 中， [创建一个工作区智能体](https://chatgpt.com/agents/studio/new).
将导出的代码粘贴到聊天中，并附上此提示：

```text
Please help me convert this workflow into an agent:

<paste your exported code here>
```

在继续之前，请审查构建器识别为需要更改的任何行为。
在继续之前，请审查构建器识别为需要更改的任何行为。

## Review and test the 智能体

某些工作流行为可能需要手动重建。在测试迁移后的智能体时，请审查控制流、
触发器、工具和权限。

创建智能体之前：

1. Review the generated instructions and configured capabilities.
1. Configure any required apps, tools, skills, authentication, and connection
   permissions.
1. Select **Preview** and test representative inputs from the original
   工作流.
1. Compare the previewed behavior with the original 工作流's expected
   behavior.
1. Select **Create** only after you have validated the migrated 智能体.

遵循与你用于工作流相同的安全实践，尤其是在
智能体可以访问私有数据或通过连接的工具采取行动时。

## 限制

- 核心确定性很强的工作流可能无法忠实地迁移到
  一个工作区 智能体。
- 连接的应用程序、身份验证、发布和权限配置
  需要在 ChatGPT 中单独审查。
- Agents SDK 实现要求你验证应用程序的
  运行时配置、工具、身份验证、权限和部署。

## 相关资源

- [智能体 构建器](https://developers.openai.com/api/docs/guides/agent-builder)
- [构建 智能体 时的安全性](https://developers.openai.com/api/docs/guides/agent-builder-safety)
- [Agents SDK 概述](https://developers.openai.com/api/docs/guides/agents)
- [Agents SDK 快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [在 ChatGPT 中构建工作区 智能体 以完成可重复的工作](https://developers.openai.com/cookbook/articles/chatgpt-agents-sales-meeting-prep)