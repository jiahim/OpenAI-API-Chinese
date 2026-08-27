# ChatKit 组件

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。若要获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 。

小部件是 ChatKit 附带的容器和组件。你可以使用预构建的小部件、修改模板或自行设计，以在您的产品中全面定制 ChatKit。

![小部件](https://cdn.openai.com/API/images/widget-graphic.png)

## 快速设计组件

使用 [组件构建器](https://widgets.chatkit.studio) 在 ChatKit Studio 中试验卡片布局、列表行和预览组件。当你有了满意的设计后，将生成的 JSON 复制到你的集成中，并从你的后端提供服务。

## 上传资源

上传资源以自定义 ChatKit 部件，使其与你的产品匹配。ChatKit 期望上传的文件和图片在消息中引用之前由你的后端托管。请遵循 [Python SDK 中的上传指南](https://openai.github.io/chatkit-python/server) 以获取参考实现。

ChatKit 部件可以直接在对话中展示上下文、快捷方式和交互式卡片。当用户点击部件按钮时，你的应用程序会收到一个自定义操作载荷，以便你能够从后端进行响应。

## 在你的服务器上处理操作

小组件操作允许用户从界面触发逻辑。操作可以绑定到各种小组件节点上的不同事件（例如，按钮点击），然后由你的服务端或客户端集成处理。

使用 `onAction` 回调 `WidgetsOption` 或等效的 React 钩子捕获小组件事件。将操作负载转发到你的后端以处理操作。

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


正在寻找完整的服务端示例？请参阅 [ChatKit Python SDK
  文档](https://openai.github.io/chatkit-python-sdk/guides/widget-actions) 以了解
  端到端的演练。

了解更多，请参阅 [操作文档](https://developers.openai.com/api/docs/guides/chatkit-actions).

## 参考

我们建议从上面的可视化构建器和工具开始。使用本文档其余部分了解小组件的工作原理并查看所有选项。

小组件由单个容器（`WidgetRoot`）构成，其中包含许多组件（`WidgetNode`).

### 容器（`WidgetRoot`)

容器具有特定的特征，如显示状态指示器文本和主要操作。

- **卡片** - 用于容纳小部件的有限容器。支持 `status`, `confirm` 和 `cancel` 字段，用于在小部件下方显示状态指示器和操作按钮。
  - `children`: list[WidgetNode]
  - `size`: "sm" | "md" | "lg" | "full"（默认："md"）
  - `padding`: float | str | dict[str, float | str] | None
    （键： `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `background`: str | `{ dark: str, light: str }` | None
  - `status`: `{ text: str, favicon?: str }` | `{ text: str, icon?: str }` | None
  - `collapsed`: bool | None
  - `asForm`: bool | None
  - `confirm`: `{ label: str, action: ActionConfig }` | None
  - `cancel`: `{ label: str, action: ActionConfig }` | None
  - `theme`: "light" | "dark" | None
  - `key`: str | None

- **ListView** – 显示垂直项目列表，每项作为一个 `ListViewItem`.
  - `children`: list[ListViewItem]
  - `limit`: int | "auto" | None
  - `status`: `{ text: str, favicon?: str }` | `{ text: str, icon?: str }` | None
  - `theme`: "light" | "dark" | None
  - `key`: str | None

### 组件（`WidgetNode`)

支持以下小组件类型。你还可以在 Widget Builder 的 [组件](https://widgets.chatkit.studio/components) 部分浏览组件并使用交互式编辑器。

- **徽章** – 用于表示状态或元数据的小标签。
  - `label`: str
  - `color`: "secondary" | "success" | "danger" | "warning" | "info" | "discovery" | None
  - `variant`: "solid" | "soft" | "outline" | None
  - `pill`: bool | None
  - `size`: "sm" | "md" | "lg" | None
  - `key`: str | None

- **Box** – 灵活的布局容器，支持方向、间距和样式。
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
    （单边框： `{ size: int, color?: str | { dark: str, light: str }, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
    每边： `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str }` | None
  - `aspectRatio`: float | str | None
  - `key`: str | None

- **Col** – 垂直排列子元素。
  - `children`: list[WidgetNode] | None
  - `gap`: int | str | None
  - `padding`: float | str | dict[str, float | str] | None
    （键： `top`, `right`, `bottom`, `left`, `x`, `y`)
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
    (键： `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `border`: int | dict[str, Any] | None
    (单边框： `{ size: int, color?: str | { dark: str, light: str }, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
    每侧： `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str } `| None
  - `aspectRatio`: float | str | None
  - `key`: str | None

- **按钮** – 一个灵活的操作按钮。
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

- **Caption** – 较小的辅助文本。
  - `value`: str
  - `size`: "sm" | "md" | "lg" | None
  - `weight`: "normal" | "medium" | "semibold" | "bold" | None
  - `textAlign`: "start" | "center" | "end" | None
  - `color`: str | `{ dark: str, light: str }` | None
  - `truncate`: bool | None
  - `maxLines`: int | None
  - `key`: str | None

- **日期选择器** – 带有下拉日历的日期输入。
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

- **分隔线** – 水平或垂直分隔符。
  - `spacing`: int | str | None
  - `color`: str | `{ dark: str, light: str }` | None
  - `size`: int | str | None
  - `flush`: bool | None
  - `key`: str | None

- **图标** – 按名称显示图标。
  - `name`: str
  - `color`: str | `{ dark: str, light: str }` | None
  - `size`: "xs" | "sm" | "md" | "lg" | "xl" | None
  - `key`: str | None

- **图像** – 显示具有可选样式、适应和位置的图像。
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

- **ListView** – 显示一个垂直的项目列表。
  - `children`: list[ListViewItem] | None
  - `limit`: int | "auto" | None
  - `status`: dict[str, Any] | None
    （形状： `{ text: str, favicon?: str }`)
  - `theme`: "light" | "dark" | None
  - `key`: str | None

- **ListViewItem** – 中的一个项目 `ListView` ，带有可选操作。
  - `children`: list[WidgetNode] | None
  - `onClickAction`: ActionConfig | None
  - `gap`: int | str | None
  - `align`: "start" | "center" | "end" | "baseline" | "stretch" | None
  - `key`: str | None

- **Markdown** – 渲染 markdown 格式的文本，支持流式更新。
  - `value`: str
  - `streaming`: bool | None
  - `key`: str | None

- **选择** – 下拉单选输入。
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

- **间隔** – 布局中使用的弹性空白空间。
  - `minSize`: int | str | None
  - `key`: str | None

- **文本** – 显示纯文本（使用 `Markdown` 进行 Markdown 渲染）。支持流式更新。
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

- **标题** – 突出的标题文本。
  - `value`: str
  - `size`: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | None
  - `weight`: "normal" | "medium" | "semibold" | "bold" | None
  - `textAlign`: "start" | "center" | "end" | None
  - `color`: str | `{ dark: str, light: str }` | None
  - `truncate`: bool | None
  - `maxLines`: int | None
  - `key`: str | None

- **Form** – 一个可提交操作的布局容器。
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
    （键： `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `margin`: float | str | dict[str, float | str] | None
    （键： `top`, `right`, `bottom`, `left`, `x`, `y`)
  - `border`: int | dict[str, Any] | None
    （单边框： `{ size: int, color?: str | { dark: str, light: str }, style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" }`
    每侧： `{ top?: int|dict, right?: int|dict, bottom?: int|dict, left?: int|dict, x?: int|dict, y?: int|dict }`)
  - `radius`: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "100%" | "none" | None
  - `background`: str | `{ dark: str, light: str }` | None
  - `key`: str | None

- **过渡** – 包装可能进行动画的内容。
  - `children`: WidgetNode | None
  - `key`: str | None