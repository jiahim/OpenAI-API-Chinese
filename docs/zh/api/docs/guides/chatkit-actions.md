# ChatKit 中的操作

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过附加 `.md` 到页面 URL，可获取文档页面的 Markdown 版本。

Actions 是让 ChatKit SDK 前端触发流式响应的一种方式，无需用户提交消息。它们也可用于在 ChatKit SDK 之外触发副作用。

## 触发操作

### 响应用户与小部件的交互

操作可以通过将 `ActionConfig` 附加到任何支持它的 widget 节点来触发。例如，你可以响应按钮上的点击事件。当用户点击此按钮时，操作将被发送到你的服务器，在那里你可以更新 widget、运行推理、流式传输新的线程项等。

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(
        type="example",
        payload={"id": 123},
    ),
)
```


操作也可以通过你的前端命令式地发送，使用 `sendAction()`。这在你需要 ChatKit 响应 ChatKit 之外发生的交互时可能最为有用，但当你需要在客户端和服务器上同时响应时，它也可以用于链式操作（更多内容见下文）。

```javascript
await chatKit.sendAction({
  type: "example",
  payload: { id: 123 },
});
```


## 处理动作

### 在服务端

默认情况下，操作会发送到你的服务器。你可以通过实现 `action` 方法来在服务器上处理操作 `ChatKitServer`.

```python
class MyChatKitServer(ChatKitServer[RequestContext]):
    async def action(
        self,
        thread: ThreadMetadata,
        action: Action[str, Any],
        sender: WidgetItem | None,
        context: RequestContext,
    ) -> AsyncIterator[Event]:
        if action.type == "example":
            await do_thing(action.payload["id"])

            # Often you'll want to add a HiddenContextItem so the model
            # can see that the user did something.
            await self.store.add_thread_item(
                thread.id,
                HiddenContextItem(
                    id="item_123",
                    created_at=datetime.now(),
                    content="<USER_ACTION>The user did a thing</USER_ACTION>",
                ),
                context,
            )

            # Then you might want to run inference to stream a response
            # back to the user.
            async for event in self.generate(context, thread):
                yield event
```


将操作及其负载视为不受信任的数据，因为客户端会将它们发送到你的服务器。

### 客户端

有时你需要在客户端集成中处理操作。为此，你需要通过添加 `handler="client"` 到 `ActionConfig`.

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(type="example", payload={"id": 123}, handler="client"),
)
```


来指定该操作应发送到你的客户端操作处理器。然后，当操作被触发时，它将被传递到你实例化 ChatKit 时提供的回调函数中。

```javascript
async function handleWidgetAction(action) {
  if (action.type === "example") {
    const res = await doSomething(action);

    // You can fire off actions to your server from here as well.
    // For example, stream new thread items or update a widget.
    await chatKit.sendAction({
      type: "example_complete",
      payload: res,
    });
  }
}

chatKit.setOptions({
  // Other options...
  widgets: { onAction: handleWidgetAction },
});
```


## 强类型操作

默认情况下 `Action` 和 `ActionConfig` 不是强类型的。然而，我们确实在 `create` 上提供了一个辅助方法 `Action` ，它可以从一组强类型的操作中生成 `ActionConfig`。

```python
class ExamplePayload(BaseModel):
    id: int


ExampleAction = Action[Literal["example"], ExamplePayload]
OtherAction = Action[Literal["other"], None]

AppAction = Annotated[
    ExampleAction | OtherAction,
    Field(discriminator="type"),
]

ActionAdapter: TypeAdapter[AppAction] = TypeAdapter(AppAction)


def parse_app_action(action: Action[str, Any]) -> AppAction:
    return ActionAdapter.validate_python(action)


# Usage in a widget
# Action provides a create helper which makes it easy to generate
# ActionConfigs from strongly typed actions.
button = Button(
    label="Example",
    onClickAction=ExampleAction.create(ExamplePayload(id=123)),
)


# usage in action handler
class MyChatKitServer(ChatKitServer[RequestContext]):
    async def action(
        self,
        thread: ThreadMetadata,
        action: Action[str, Any],
        sender: WidgetItem | None,
        context: RequestContext,
    ) -> AsyncIterator[Event]:
        # add custom error handling if needed
        app_action = parse_app_action(action)
        if app_action.type == "example":
            await do_thing(app_action.payload.id)
            yield ThreadItemDoneEvent(
                item=AssistantMessageItem(
                    id=self.store.generate_item_id("message", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(text="Action complete.")],
                )
            )
```


## 使用组件和操作创建自定义表单

当接收用户输入的小部件节点被挂载在 `Form`，内部时，这些字段的值将包含在 `payload` 中，该对象源自 `Form`.

表单值以 `payload` 为键存储， `name` 例如。

- `Select(name="title")` → `action.payload.title`
- `Select(name="todo.title")` → `action.payload.todo.title`

```python
form = Form(
    direction="col",
    validation="native",
    onSubmitAction=ActionConfig(
        type="update_todo",
        payload={"id": todo.id},
    ),
    children=[
        Title(value="Edit Todo"),
        Text(value="Title", color="secondary", size="sm"),
        Text(
            value=todo.title,
            editable=EditableProps(name="title", required=True),
        ),
        Text(value="Description", color="secondary", size="sm"),
        Text(
            value=todo.description,
            editable=EditableProps(name="description"),
        ),
        Button(label="Save", submit=True),
    ],
)


class MyChatKitServer(ChatKitServer[RequestContext]):
    async def action(
        self,
        thread: ThreadMetadata,
        action: Action[str, Any],
        sender: WidgetItem | None,
        context: RequestContext,
    ) -> AsyncIterator[Event]:
        if action.type == "update_todo":
            todo_id = action.payload["id"]
            # Any action that originates from within the Form will
            # include title and description.
            title = action.payload["title"]
            description = action.payload["description"]

            await update_todo(todo_id, title, description)
            yield ThreadItemDoneEvent(
                item=AssistantMessageItem(
                    id=self.store.generate_item_id("message", thread, context),
                    thread_id=thread.id,
                    created_at=datetime.now(),
                    content=[AssistantMessageContent(text="Todo updated.")],
                )
            )
```


### 验证

`Form` 使用基本的原生表单验证；强制执行 `required` 以及 `pattern` 当表单有任何无效字段时，在配置了这些验证的字段上阻止提交。

未来我们可能会添加具有更好用户体验、更具表现力的验证、自定义错误显示等的新验证模式。在那之前，小部件并不是处理具有复杂验证逻辑的表单的理想媒介。如果你有此需求，更好的模式是使用客户端操作处理来触发模态框，在其中显示自定义表单，然后将结果传回 ChatKit，使用 `sendAction`.

### 将 `Card` 视为 `Form`

你可以传入 `asForm=True` 到 `Card` ，它将作为 `Form`，运行，执行验证并将收集的字段传递给 Card 的 `confirm` 操作。

### 载荷键冲突

如果与你的载荷中某些其他已存在的预定义键发生命名冲突，表单值将被忽略。这很可能是一个 bug，因此我们将发出一个 `error` 事件，当我们检测到这种情况时。

## 控制小组件中的加载状态交互

使用 `ActionConfig.loadingBehavior` 来控制操作如何在小部件中触发不同的加载状态。

```python
button = Button(
    label="This may take a while...",
    onClickAction=ActionConfig(
        type="long_running_action_that_should_block_other_ui_interactions",
        loadingBehavior="container",
    ),
)
```


| 值       | 行为                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `auto`      | 该操作将根据其使用方式进行自适应。（_默认_)                                                                       |
| `self`      | 该操作会在其所绑定的小部件节点上触发加载状态。                                              |
| `container` | 该操作会在整个小部件容器上触发加载状态。这会导致小部件略微淡出并变为非交互状态。 |
| `none`      | 无加载状态                                                                                                                |

### 使用 `auto` 行为

一般来说，我们建议使用 `auto`，这是默认设置。 `auto` 根据操作绑定位置触发加载状态，例如：

- `Button.onClickAction` → `self`
- `Select.onChangeAction` → `none`
- `Card.confirm.action` → `container`