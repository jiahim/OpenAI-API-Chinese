# 智能体 Builder

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

**智能体构建器** 是一个用于构建多步骤智能体工作流的可视化画布。

你可以从模板开始，为工作流中的每个步骤拖放节点，提供带类型的输入和输出，并使用实时数据预览运行。准备好部署后，可以使用 ChatKit 将该工作流嵌入你的网站，或者下载SDK代码自行运行。

OpenAI正在弃用智能体构建器。现有用户可以在过渡期内继续使用
  ，该产品计划于
  2026 年 11 月 30 日停服。ChatKit 仍可使用。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-agent-builder) 以了解当前的
  时间表。

请参考本指南了解构建智能体的流程和组成部分。

## 智能体和工作流

要构建有用的智能体，你需要为它们创建工作流。A **工作流** 是智能体、工具和控制流逻辑的组合。一个工作流封装了处理你的任务或驱动你的聊天所涉及的所有步骤和操作，并附带你准备好后即可部署的可运行代码。



打开智能体构建器







构建用于处理任务的智能体主要分为三个步骤：

1. 使用以下工具设计一个 工作流 [智能体 Builder](https://platform.openai.com/agent-builder)。这里定义你的 智能体 及其协作方式。
1. 发布你的 工作流。它是一个带有 ID 和版本号的对象。
1. 部署你的 工作流。将该 ID 传入你的 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit) 集成，或下载 Agents SDK 代码自行部署你的 工作流。

## 通过节点进行编排

在智能体构建器中，插入并连接节点以创建你的工作流。节点之间的每个连接都会成为一条类型化边。点击节点可配置其输入与输出，查看步骤之间的数据契约，并确保下游节点能够接收到它们所期望的属性。

### 示例与模板

智能体 构建器为常见的 工作流 模式提供模板。可以从模板开始，查看节点如何协同工作，也可以从零开始。

下面是一个作业助手 工作流。它使用 智能体 来接收问题，重新组织它们以获得更好的答案，再路由到其他专用的 智能体，最后返回答案。

![prompts chat](https://cdn.openai.com/API/docs/images/homework-helper2.png)

### 可用节点

节点是构建智能体的基础单元。要查看所有可用的节点及其配置选项，请参阅 [节点参考文档](https://developers.openai.com/api/docs/guides/node-reference).

### 预览与调试

在构建过程中，你可以使用 **Preview** 功能来测试你的工作流。在此处，你可以交互式地运行你的工作流，附加示例文件，并观察每个节点的执行过程。

### 安全与风险

构建智能体工作流存在一些风险，例如提示注入和数据泄露。请参阅 [构建智能体时的安全注意事项](https://developers.openai.com/api/docs/guides/agent-builder-safety) 以了解并帮助降低智能体工作流的风险。

### 评估你的工作流

运行 [追踪 评分器](https://developers.openai.com/api/docs/guides/trace-grading) 在 智能体 Builder 内部。在顶部导航中，点击 **评估**。在这里，你可以选择一条 追踪（或一组 追踪）并运行自定义评分器来评估整体 工作流 性能。

## 发布你的工作流

智能体 构建器在编辑过程中会自动保存你的工作。当你对工作流满意后，将其发布以创建一个作为快照的新主版本。然后你可以在 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，中使用它，ChatKit 是一个用于嵌入聊天体验的 OpenAI 框架。

你可以在 API 调用中创建新版本或指定旧版本。

## 在你的产品中部署

当你准备实现所创建的智能体工作流时，请点击 **Code** 在顶部导航栏中。在生产环境中实现你的工作流有两种方式：

**ChatKit**：按照 [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit) 操作，并将你的工作流 ID 传入，以便将该工作流嵌入到你的应用中。如果你不确定，我们推荐使用此方式。

**高级集成**：复制该工作流代码并在任意位置使用。你可以在自己的基础设施上运行 ChatKit，并使用Agents SDK来构建和定制智能体聊天体验。

## 后续步骤

现在你已经创建了智能体工作流，可以通过 ChatKit 将其集成到你的产品中。

- [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit) →
- [高级集成](https://developers.openai.com/api/docs/guides/custom-chatkit) →