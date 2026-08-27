# 智能体构建器

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

**Agent Builder** 是一个用于构建多步骤智能体工作流的可视化画布。

你可以从模板开始，为工作流中的每一步拖放节点，提供类型化的输入和输出，并使用实时数据预览运行。当你准备好部署时，通过 ChatKit 将工作流嵌入到你的网站中，或下载 SDK 代码自行运行。

OpenAI 正在弃用 Agent Builder。现有用户可以继续使用它
  在过渡期内，该产品计划于
  2026年11月30日关闭。ChatKit 仍然可用。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-agent-builder) 了解当前
  时间线。

使用本指南了解构建智能体的过程和组成部分。

## 智能体与工作流

要构建有用的智能体，你需要为它们创建工作流。一个 **工作流** 是智能体、工具和控制流逻辑的组合。一个工作流封装了处理任务或驱动聊天所涉及的所有步骤和操作，并包含你准备就绪后即可部署的可运行代码。



打开智能体构建器







构建智能体来处理任务有三个主要步骤：

1. 在设计工作流时， [智能体构建器](https://platform.openai.com/agent-builder)。这定义了你的智能体及其工作方式。
1. 发布你的工作流。它是一个带有 ID 和版本控制的对象。
1. 部署你的工作流。将 ID 传入你的 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit) 集成中，或下载 Agents SDK 代码自行部署你的工作流。

## 使用节点组合

在 智能体 Builder 中，插入并连接节点以创建你的 工作流。节点之间的每个连接都成为一个类型化边。点击节点以配置其输入和输出，观察步骤之间的数据约定，并确保下游节点接收到它们期望的属性。

### 示例和模板

智能体构建器为常见的工作流模式提供模板。从模板开始以了解节点如何协同工作，或从零开始。

这是一个作业帮助工作流。它使用智能体来接收问题、重新表述以获得更好的答案、将问题路由到其他专门的智能体，并返回答案。

![提示词聊天](https://cdn.openai.com/API/docs/images/homework-helper2.png)

### 可用节点

节点是构建智能体的基础模块。要查看所有可用节点及其配置选项，请参阅 [节点参考文档](https://developers.openai.com/api/docs/guides/node-reference).

### 预览和调试

在构建过程中，你可以通过使用 **预览** 功能来测试你的工作流。在此，你可以交互式运行你的工作流、附加示例文件，并观察每个节点的执行情况。

### 安全与风险

构建智能体工作流存在风险，如提示注入和数据泄漏。参见 [构建智能体时的安全性](https://developers.openai.com/api/docs/guides/agent-builder-safety) 以了解并帮助缓解智能体工作流的风险。

### 评估你的工作流

运行 [追踪评分器](https://developers.openai.com/api/docs/guides/trace-grading) 在智能体构建器内部。在顶部导航中，点击 **评估**。在这里，你可以选择一个追踪（或一组追踪）并运行自定义评分器来评估整体工作流性能。

## 发布你的工作流

智能体 Builder 会在你工作时自动保存进度。当你对 工作流 满意后，即可发布它，以创建新的主版本作为快照。然后你可以在以下位置使用你的 工作流 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，中，这是一个用于嵌入聊天体验的 OpenAI 框架。

你可以创建新版本，或在 API 调用中指定较旧的版本。

## 在你的产品中部署

当你准备好实现所创建的智能体工作流时，请点击 **Code** 位于顶部导航中。在生产环境中实现你的工作流有两种选择：

**ChatKit**：按照 [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit) 操作，并传入你的工作流 ID，将此工作流嵌入到你的应用程序中。如果你不确定，我们推荐此选项。

**高级集成**：复制工作流代码并可在任何地方使用。你可以在自己的基础设施上运行 ChatKit，并使用Agents SDK来构建和定制智能体聊天体验。

## 后续步骤

现在你已经创建了智能体工作流，使用 ChatKit 将其带入你的产品中。

- [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit) →
- [高级集成](https://developers.openai.com/api/docs/guides/custom-chatkit) →