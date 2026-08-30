# ChatKit widgets

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

Widgets 是 ChatKit 自带的容器和组件。你可以使用预构建的 Widget、对模板进行修改，或自行设计，以在你的产品中完全定制 ChatKit。

![widgets](https://cdn.openai.com/API/images/widget-graphic.png)

## 快速设计小组件

使用 [Widget Builder](https://widgets.chatkit.studio) 在 ChatKit Studio 中尝试卡片布局、列表行和预览组件。确定满意的设计后，将生成的 JSON 复制到你的集成中，并由你的后端提供服务。

## Upload assets

上传资源以自定义 ChatKit 小部件，使其与你产品风格保持一致。ChatKit 要求上传的文件和图片在消息中引用之前由你的后端托管。请参阅 [Python SDK 中的上传指南](https://openai.github.io/chatkit-python/server) 以获取参考实现。

ChatKit 小部件可以在对话中直接展示上下文、快捷方式和交互卡片。当用户点击小部件按钮时，你的应用会收到一个自定义动作负载（payload），从而由你的后端进行响应。

## 在服务端处理动作

小组件操作允许用户从 UI 触发逻辑。操作可以绑定到不同小组件节点上的各类事件（例如按钮点击），然后由你的服务端或客户端集成进行处理。

使用 `onAction` 回调 `WidgetsOption` 或等效的 React hook 来捕获小组件事件。将操作负载转发到你的后端以处理这些操作。

```javascript
chatkit.setOptions({
  widgets: {
    async onAction(action, item) {
      await fetch("/api/widget-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, itemId: item.id }),
      });
    },
  },
});
```


需要完整的服务端示例？请参阅 [ChatKit Python SDK
  文档](https://openai.github.io/chatkit-python-sdk/guides/widget-actions) 获取
  端到端操作指南。

更多信息请参阅 [操作文档](https://developers.openai.com/api/docs/guides/chatkit-actions).

## 参考

我们建议先使用上方的可视化构建器和工具入门。再借助本文档其余部分了解 widget 的工作机制以及查看所有可用选项。

Widget 由单个容器（`WidgetRoot`）构成，该容器包含许多组件（`WidgetNode`).

### 容器（`WidgetRoot`)

容器具有一些特定特征，例如显示状态指示器文本和主要操作。

- **Card** - 一个用于容纳 widget 的有界容器。支持 `status`, `confirm` 和 `cancel` 字段，用于在 widget 下方展示状态指示器和操作按钮。
  - `children`: list[WidgetNode]
  - `size`: "sm" | "md" | "lg" | "full"（默认值："md"）
  - `padding`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `background`: str | `{ dark: str, light: str }` | None
  - `status`: `{ text: str, favicon?: str }` | `{ text: str, icon?: str }` | None
  - `collapsed`: bool | None
  - `asForm`: bool | None
  - `confirm`: `{ label: str, action: ActionConfig }` | None
  - `cancel`: `{ label: str, action: ActionConfig }` | None
  - `theme`: "light" | "dark" | None
  - `key`: str | None

- **ListView** – 显示一个垂直的项目列表，每个项目为一个 `ListViewItem`.
  - `children`: list[ListViewItem]
  - `limit`: int | "auto" | None
  - `status`: `{ text: str, favicon?: str }` | `{ text: str, icon?: str }` | None
  - `theme`: "light" | "dark" | None
  - `key`: str | None

### 组件（`WidgetNode`)

支持以下小组件类型。你也可以浏览组件，并在 Widget Builder 的 [components](https://widgets.chatkit.studio/components) 部分使用交互式编辑器。

- **Badge** – 用于表示状态或元数据的小标签。
  - `label`: str
  - `color`: "secondary" | "success" | "danger" | "warning" | "info" | "discovery" | None
  - `variant`: "solid" | "soft" | "outline" | None
  - `pill`: bool | None
  - `size`: "sm" | "md" | "lg" | None
  - `key`: str | None

- **Box** – 用于布局的灵活容器，支持方向、间距和样式。
  - `children`: list[WidgetNode] | None
  - `direction`: "row" | "column" | None
  - `align`: "start" | "center" | "end" | "baseline" | "stretch" | None
  - `justify`: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly" | None
  - `wrap`: "nowrap" | "wrap" | "wrap-reverse" | None
  - `flex`: int | str | None
  - `height`: float | str | None
  - `width`: float | str | None
  - `minHeight`: int | str | None
  - `minWidth`: int | str | None
  - `maxHeight`: int | str | None
  - `maxWidth`: int | str | None
  - `size`: float | str | None
  - `minSize`: int | str | None
  - `maxSize`: int | str | None
  - `gap`: int | str | None
  - `padding`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `margin`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `border`: int | `dict[str, Any]` | None
    (single border: `{ size: int, color?: str` | `{ dark: str, light: str }`, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
per-side`: `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str }` | None
  - `aspectRatio`: float | str | None
  - `key`: str | None

- **Row** – 水平排列子元素。
  - `children`: list[WidgetNode] | None
  - `gap`: int | str | None
  - `padding`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `align`: "start" | "center" | "end" | "baseline" | "stretch" | None
  - `justify`: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly" | None
  - `flex`: int | str | None
  - `height`: float | str | None
  - `width`: float | str | None
  - `minHeight`: int | str | None
  - `minWidth`: int | str | None
  - `maxHeight`: int | str | None
  - `maxWidth`: int | str | None
  - `size`: float | str | None
  - `minSize`: int | str | None
  - `maxSize`: int | str | None
  - `margin`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `border`: int | dict[str, Any] | None
    (single border: `{ size: int, color?: str | { dark: str, light: str }, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
    per-side: `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str }` | None
  - `aspectRatio`: float | str | None
  - `key`: str | None

- **Col** – 垂直排列子元素。
  - `children`: list[WidgetNode] | None
  - `gap`: int | str | None
  - `padding`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `align`: "start" | "center" | "end" | "baseline" | "stretch" | None
  - `justify`: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly" | None
  - `wrap`: "nowrap" | "wrap" | "wrap-reverse" | None
  - `flex`: int | str | None
  - `height`: float | str | None
  - `width`: float | str | None
  - `minHeight`: int | str | None
  - `minWidth`: int | str | None
  - `maxHeight`: int | str | None
  - `maxWidth`: int | str | None
  - `size`: float | str | None
  - `minSize`: int | str | None
  - `maxSize`: int | str | None
  - `margin`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `border`: int | dict[str, Any] | None
    (single border: `{ size: int, color?: str | { dark: str, light: str }, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
    per-side: `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str } `| None
  - `aspectRatio`: float | str | None
  - `key`: str | None

- **Button** – 灵活的操作按钮。
  - `submit`: bool | None
  - `style`: "primary" | "secondary" | None
  - `label`: str
  - `onClickAction`: ActionConfig
  - `iconStart`: str | None
  - `iconEnd`: str | None
  - `color`: "primary" | "secondary" | "info" | "discovery" | "success" | "caution" | "warning" | "danger" | None
  - `variant`: "solid" | "soft" | "outline" | "ghost" | None
  - `size`: "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | None
  - `pill`: bool | None
  - `block`: bool | None
  - `uniform`: bool | None
  - `iconSize`: "sm" | "md" | "lg" | "xl" | "2xl" | None
  - `key`: str | None

- **Caption** – 更小的辅助文本。
  - `value`: str
  - `size`: "sm" | "md" | "lg" | None
  - `weight`: "normal" | "medium" | "semibold" | "bold" | None
  - `textAlign`: "start" | "center" | "end" | None
  - `color`: str | `{ dark: str, light: str }` | None
  - `truncate`: bool | None
  - `maxLines`: int | None
  - `key`: str | None

- **DatePicker** – 带下拉日历的日期输入框。
  - `onChangeAction`: ActionConfig | None
  - `name`: str
  - `min`: datetime | None
  - `max`: datetime | None
  - `side`: "top" | "bottom" | "left" | "right" | None
  - `align`: "start" | "center" | "end" | None
  - `placeholder`: str | None
  - `defaultValue`: datetime | None
  - `variant`: "solid" | "soft" | "outline" | "ghost" | None
  - `size`: "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | None
  - `pill`: bool | None
  - `block`: bool | None
  - `clearable`: bool | None
  - `disabled`: bool | None
  - `key`: str | None

- **Divider** – 水平或垂直分隔线。
  - `spacing`: int | str | None
  - `color`: str | `{ dark: str, light: str }` | None
  - `size`: int | str | None
  - `flush`: bool | None
  - `key`: str | None

- **Icon** – 按名称显示一个图标。
  - `name`: str
  - `color`: str | `{ dark: str, light: str }` | None
  - `size`: "xs" | "sm" | "md" | "lg" | "xl" | None
  - `key`: str | None

- **Image** – 显示一张图片，可设置样式、填充方式和位置。
  - `size`: int | str | None
  - `height`: int | str | None
  - `width`: int | str | None
  - `minHeight`: int | str | None
  - `minWidth`: int | str | None
  - `maxHeight`: int | str | None
  - `maxWidth`: int | str | None
  - `minSize`: int | str | None
  - `maxSize`: int | str | None
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str }` | None
  - `margin`: int | str | dict[str, int | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `aspectRatio`: float | str | None
  - `flex`: int | str | None
  - `src`: str
  - `alt`: str | None
  - `fit`: "none" | "cover" | "contain" | "fill" | "scale-down" | None
  - `position`: "center" | "top" | "bottom" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right" | None
  - `frame`: bool | None
  - `flush`: bool | None
  - `key`: str | None

- **ListView** – 显示一个纵向列表。
  - `children`: list[ListViewItem] | None
  - `limit`: int | "auto" | None
  - `status`: dict[str, Any] | None
    (shape: `{ text: str, favicon?: str }`)
  - `theme`: "light" | "dark" | None
  - `key`: str | None

- **ListViewItem** – 一个 `ListView` 中的项目，可包含动作。
  - `children`: list[WidgetNode] | None
  - `onClickAction`: ActionConfig | None
  - `gap`: int | str | None
  - `align`: "start" | "center" | "end" | "baseline" | "stretch" | None
  - `key`: str | None

- **Markdown** – 渲染 Markdown 格式文本，支持流式更新。
  - `value`: str
  - `streaming`: bool | None
  - `key`: str | None

- **Select** – 下拉式单选输入。
  - `options`: list[dict[str, str]]
    （每个选项： `{ label: str, value: str }`)
  - `onChangeAction`: ActionConfig | None
  - `name`: str
  - `placeholder`: str | None
  - `defaultValue`: str | None
  - `variant`: "solid" | "soft" | "outline" | "ghost" | None
  - `size`: "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | None
  - `pill`: bool | None
  - `block`: bool | None
  - `clearable`: bool | None
  - `disabled`: bool | None
  - `key`: str | None

- **Spacer** – 布局中使用的弹性空白区域。
  - `minSize`: int | str | None
  - `key`: str | None

- **Text** – 显示纯文本（使用 `Markdown` 渲染 Markdown）。支持流式更新。
  - `value`: str
  - `color`: str | `{ dark: str, light: str }` | None
  - `width`: float | str | None
  - `size`: "xs" | "sm" | "md" | "lg" | "xl" | None
  - `weight`: "normal" | "medium" | "semibold" | "bold" | None
  - `textAlign`: "start" | "center" | "end" | None
  - `italic`: bool | None
  - `lineThrough`: bool | None
  - `truncate`: bool | None
  - `minLines`: int | None
  - `maxLines`: int | None
  - `streaming`: bool | None
  - `editable`: bool | dict[str, Any] | None
    （当为 dict 时： `{ name: str, autoComplete?: str, autoFocus?: bool, autoSelect?: bool, allowAutofillExtensions?: bool, required?: bool, placeholder?: str, pattern?: str }`)
  - `key`: str | None

- **Title** – 醒目的标题文本。
  - `value`: str
  - `size`: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | None
  - `weight`: "normal" | "medium" | "semibold" | "bold" | None
  - `textAlign`: "start" | "center" | "end" | None
  - `color`: str | `{ dark: str, light: str }` | None
  - `truncate`: bool | None
  - `maxLines`: int | None
  - `key`: str | None

- **Form** – 可提交操作的布局容器。
  - `onSubmitAction`: ActionConfig
  - `children`: list[WidgetNode] | None
  - `align`: "start" | "center" | "end" | "baseline" | "stretch" | None
  - `justify`: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly" | None
  - `flex`: int | str | None
  - `gap`: int | str | None
  - `height`: float | str | None
  - `width`: float | str | None
  - `minHeight`: int | str | None
  - `minWidth`: int | str | None
  - `maxHeight`: int | str | None
  - `maxWidth`: int | str | None
  - `size`: float | str | None
  - `minSize`: int | str | None
  - `maxSize`: int | str | None
  - `padding`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `margin`: float | str | dict[str, float | str] | None
    (keys: `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `border`: int | dict[str, Any] | None
    (single border: `{ size: int, color?: str | { dark: str, light: str }, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
    per-side: `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str }` | None
  - `key`: str | None

- **Transition** – 包裹可能带动画的内容。
  - `children`: WidgetNode | None
  - `key`: str | None