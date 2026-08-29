# ChatKit 中的主题与自定义

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

按照 [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit)，操作后，学习如何更改主题并为你的聊天嵌入添加自定义设置。通过明暗主题、设置强调色、控制密度和圆角来匹配你应用的外观风格。

## 概述

在高层次上，你可以通过传入一个 options 对象来自定义主题。如果你按照 [ChatKit 快速入门](https://developers.openai.com/api/docs/guides/chatkit) 在你的前端中嵌入 ChatKit 的方式，请使用下面的 React 语法。

- **React**：向 `useChatKit({...})`
- **高级集成**：使用 `chatkit.setOptions({...})`

在两种集成方式中，options 对象的结构是相同的。

## 探索自定义选项

访问 [ChatKit Studio](https://chatkit.studio) 以查看 ChatKit 的可运行实现和交互式构建器。如果你更喜欢通过动手尝试而非阅读文档来构建，这些资源是一个很好的起点。

#### Explore ChatKit UI

[chatkit.world



      Play with an interactive demo of ChatKit.](https://chatkit.world)

[Widget builder



      Browse available widgets.](https://widgets.chatkit.studio)

[ChatKit playground



      Play with an interactive demo to learn by doing.](https://chatkit.studio/playground)

#### 查看完整示例

[GitHub 上的示例



      See working examples of ChatKit and get inspired.](https://github.com/openai/openai-chatkit-advanced-samples)

[入门应用代码仓库



      Clone a repo to start with a fully working template.](https://github.com/openai/openai-chatkit-starter-app)

## 更改主题

通过指定颜色、字体等，匹配你产品的外观与风格。下面我们将主题设置为深色模式，更改颜色，将边角设为圆角，调整信息密度，并设置字体。

如需查看所有主题设置选项，请参阅 [API 参考文档](https://openai.github.io/chatkit-js/api/openai/chatkit/type-aliases/themeoption/).

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


## 自定义启动屏幕文本

通过修改撰写器的占位符文本，提示用户可以询问什么或引导他们的首次输入。

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


## 显示新会话的起始提示

在开始对话时，通过建议提示创意来引导用户可以询问或执行的操作。

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


## 在页眉中添加自定义按钮

自定义顶部按钮可帮助你添加与集成相关的导航、上下文或操作。

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

附件默认是禁用的。若要启用它们，请添加附件配置。
除非你使用自定义后端，否则必须使用 `hosted` 上传策略。
有关其他上传策略如何与自定义后端配合使用的更多信息，请参阅 Python SDK 文档。

你还可以控制用户可以在消息中附加的文件数量、大小和类型。

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


## 在编辑器中通过实体标签启用 @提及

让用户可以使用 @ 提及来标记自定义“实体”。这有助于丰富对话上下文并提升交互性。

- 使用 `onTagSearch` 以根据输入查询返回实体列表。
- 使用 `onClick` 以处理实体的点击事件。

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

你可以使用 widget 自定义鼠标悬停时实体标签的外观。当用户悬停在实体标签上时，显示丰富的预览，例如名片、文档摘要或图片。

[Widget builder



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

通过允许用户从撰写栏触发应用专属的操作来提升生产力。所选工具
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

如果你需要对头部中的可用选项进行更多自定义并希望自行实现，可以禁用主要的 UI 区域和功能。当线程和历史记录的概念对你的用例没有意义时（例如在支持聊天机器人中），禁用历史记录可能会很有用。

```javascript
const options = {
  history: { enabled: false },
  header: { enabled: false },
};
```


## 覆盖区域设置

如果你有应用级的语言设置，可以覆盖默认语言环境。默认情况下，语言环境设置为浏览器的语言环境。

```javascript
const options = {
  locale: "de-DE",
};
```