# Theming and customization in ChatKit

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After following the [ChatKit quickstart](https://developers.openai.com/api/docs/guides/chatkit), learn how to change themes and add customization to your chat embed. Match your app’s aesthetic with light and dark themes, setting an accent color, controlling the density, and rounded corners.

## Overview

At a high level, customize the theme by passing in an options object. If you followed the [ChatKit quickstart](https://developers.openai.com/api/docs/guides/chatkit) to embed ChatKit in your frontend, use the React syntax below.

- **React**: Pass options to `useChatKit({...})`
- **Advanced integrations**: Set options with `chatkit.setOptions({...})`

In both integration types, the shape of the options object is the same.

## Explore customization options

Visit [ChatKit Studio](https://chatkit.studio) to see working implementations of ChatKit and interactive builders. If you like building by trying things rather than reading, these resources are a good starting point.

#### Explore ChatKit UI

[chatkit.world



      Play with an interactive demo of ChatKit.](https://chatkit.world)

[Widget builder



      Browse available widgets.](https://widgets.chatkit.studio)

[ChatKit playground



      Play with an interactive demo to learn by doing.](https://chatkit.studio/playground)

#### See working examples

[Samples on GitHub



      See working examples of ChatKit and get inspired.](https://github.com/openai/openai-chatkit-advanced-samples)

[Starter app repo



      Clone a repo to start with a fully working template.](https://github.com/openai/openai-chatkit-starter-app)

## Change the theme

Match the look and feel of your product by specifying colors, typography, and more. Below, we set to dark mode, change colors, round the corners, adjust the information density, and set the font.

For all theming options, see the [API reference](https://openai.github.io/chatkit-js/api/openai/chatkit/type-aliases/themeoption/).

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


## Customize the start screen text

Let users know what to ask or guide their first input by changing the composer’s placeholder text.

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


## Show starter prompts for new threads

Guide users on what to ask or do by suggesting prompt ideas when starting a conversation.

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


## Add custom buttons to the header

Custom header buttons help you add navigation, context, or actions relevant to your integration.

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


## Enable file attachments

Attachments are disabled by default. To enable them, add attachments configuration.
Unless you are doing a custom backend, you must use the `hosted` upload strategy.
See the Python SDK docs for more information on other upload strategies work with a custom backend.

You can also control the number, size, and types of files that users can attach to messages.

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


## Enable @mentions in the composer with entity tags

Let users tag custom “entities” with @-mentions. This enables richer conversation context and interactivity.

- Use `onTagSearch` to return a list of entities based on the input query.
- Use `onClick` to handle the click event of an entity.

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


## Customize how entity tags appear

You can customize the appearance of entity tags on mouseover using widgets. Show rich previews such as a business card, document summary, or image when the user hovers over an entity tag.

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


## Add custom tools to the composer

Enhance productivity by letting users trigger app-specific actions from the composer bar. The selected tool
will be sent to the model as a tool preference.

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


## Toggle UI regions and features

Disable major UI regions and features if you need more customization over the options available in the header and want to implement your own instead. Disabling history can be useful when the concept of threads and history doesn't make sense for your use case—e.g., in a support chatbot.

```javascript
const options = {
  history: { enabled: false },
  header: { enabled: false },
};
```


## Override the locale

Override the default locale if you have an app-wide language setting. By default, the locale is set to the browser's locale.

```javascript
const options = {
  locale: "de-DE",
};
```