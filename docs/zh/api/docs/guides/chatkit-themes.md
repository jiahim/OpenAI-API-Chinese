# ChatKit 中的主题定制与个性化

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过附加 `.md` 到页面 URL 可获取文档页面的 Markdown 版本。

在完成 [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit)，之后，了解如何更改主题并为你的聊天嵌入添加自定义设置。通过浅色和深色主题、设置强调色、控制密度和圆角，匹配你的应用美学。

## 概述

在较高层面上，通过传入一个选项对象来自定义主题。如果你遵循了 [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit) 在前端中嵌入 ChatKit，请使用下面的 React 语法。

- **React**：传递选项给 `useChatKit({...})`
- **高级集成**：使用以下方式设置选项 `chatkit.setOptions({...})`

在两种集成类型中，选项对象的结构相同。

## 探索定制选项

访问 [ChatKit Studio](https://chatkit.studio) 查看 ChatKit 的可运行实现和交互式构建器。如果你更喜欢动手尝试而非阅读文档，这些资源是不错的起点。

#### 探索 ChatKit UI

[chatkit.world



      Play with an interactive demo of ChatKit.](https://chatkit.world)

[组件构建器



      Browse available widgets.](https://widgets.chatkit.studio)

[ChatKit 试用环境



      Play with an interactive demo to learn by doing.](https://chatkit.studio/playground)

#### 查看工作示例

[GitHub 上的示例



      See working examples of ChatKit and get inspired.](https://github.com/openai/openai-chatkit-advanced-samples)

[入门应用仓库



      Clone a repo to start with a fully working template.](https://github.com/openai/openai-chatkit-starter-app)

## 更改主题

通过指定颜色、字体等，让产品的外观和感觉与你的产品相匹配。下面，我们切换到深色模式，更改颜色，使边角变圆，调整信息密度，并设置字体。

有关所有主题选项，请参阅 [API 参考](https://openai.github.io/chatkit-js/api/openai/chatkit/type-aliases/themeoption/).

```javascript
const options = {
  theme: {
    colorScheme: "dark",
    color: {
      accent: {
        primary: "#2D8CFF",
        level: 2,
      },
    },
    radius: "round",
    density: "compact",
    typography: { fontFamily: "'Inter', sans-serif" },
  },
};
```


## 自定义开始屏幕文本

通过更改输入框的占位符文本，让用户知道该问什么或引导他们的首次输入。

```javascript
const options = {
  composer: {
    placeholder: "Ask anything about your data…",
  },
  startScreen: {
    greeting: "Welcome to FeedbackBot!",
  },
};
```


## 为新线程显示起始提示词

在开始对话时，通过建议提示词想法来引导用户该询问或做什么。

```javascript
const options = {
  startScreen: {
    greeting: "What can I help you build today?",
    prompts: [
      {
        name: "Check on the status of a ticket",
        prompt: "Can you help me check on the status of a ticket?",
        icon: "search",
      },
      {
        name: "Create Ticket",
        prompt: "Can you help me create a new support ticket?",
        icon: "write",
      },
    ],
  },
};
```


## 向标题添加自定义按钮

自定义头部按钮可帮助你添加与集成相关的导航、上下文或操作。

```javascript
const options = {
  header: {
    customButtonLeft: {
      icon: "settings-cog",
      onClick: () => openProfileSettings(),
    },
    customButtonRight: {
      icon: "home",
      onClick: () => openHomePage(),
    },
  },
};
```


## 启用文件附件

默认情况下，附件是禁用的。要启用它们，请添加附件配置。
除非你在做自定义后端，否则必须使用 `hosted` 上传策略。
有关其他上传策略如何与自定义后端配合使用的更多信息，请参阅 Python SDK 文档。

你还可以控制用户可以附加到消息的文件数量、大小和类型。

```javascript
const options = {
  composer: {
    attachments: {
      uploadStrategy: { type: "hosted" },
      maxSize: 20 * 1024 * 1024, // 20 MB per file
      maxCount: 3,
      accept: { "application/pdf": [".pdf"], "image/*": [".png", ".jpg"] },
    },
  },
};
```


## 在编辑器中启用带有实体标签的 @提及

允许用户使用 @-提及 标记自定义“实体”。这有助于实现更丰富的对话上下文和交互性。

- 使用 `onTagSearch` 根据输入查询返回实体列表。
- 使用 `onClick` 处理实体的点击事件。

```javascript
const options = {
  entities: {
    async onTagSearch(query) {
      void query;
      return [
        {
          id: "user_123",
          title: "Jane Doe",
          group: "People",
          interactive: true,
        },
        {
          id: "document_123",
          title: "Quarterly Plan",
          group: "Documents",
          interactive: true,
        },
      ];
    },
    onClick: (entity) => {
      navigateToEntity(entity.id);
    },
  },
};
```


## 自定义实体标签的显示方式

你可以使用 widget 自定义鼠标悬停在实体标签上的外观。当用户悬停在实体标签上时，展示丰富的预览内容，例如名片、文档摘要或图片。

[Widget 构建器



      Browse available widgets.](https://widgets.chatkit.studio)

```javascript
const options = {
  entities: {
    async onTagSearch() {
      return [];
    },
    onRequestPreview: async (entity) => ({
      preview: {
        type: "Card",
        children: [
          { type: "Text", value: `Profile: ${entity.title}` },
          { type: "Text", value: "Role: Developer" },
        ],
      },
    }),
  },
};
```


## 向 composer 添加自定义工具

通过让用户在撰写栏中触发应用特定操作来提升生产力。所选工具
将作为工具偏好发送给模型。

```javascript
const options = {
  composer: {
    tools: [
      {
        id: "add-note",
        label: "Add Note",
        icon: "write",
        pinned: true,
      },
    ],
  },
};
```


## 切换界面区域和功能

如果你需要对页眉中可用选项进行更多自定义，并希望自行实现，可以禁用主要的 UI 区域和功能。当线程和历史记录的概念不适用于你的用例时（例如在支持聊天机器人中），禁用历史记录会很有用。

```javascript
const options = {
  history: { enabled: false },
  header: { enabled: false },
};
```


## 覆盖区域设置

如果你有应用级语言设置，请覆盖默认区域设置。默认情况下，区域设置将设置为浏览器的区域设置。

```javascript
const options = {
  locale: "de-DE",
};
```