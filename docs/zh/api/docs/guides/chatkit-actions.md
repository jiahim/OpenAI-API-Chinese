# ChatKit 中的操作

> 完整的文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取 Markdown 版本的文档页面。

Actions 是 ChatKit SDK 前端在用户不提交消息的情况下触发流式响应的一种方式。它们也可用于触发 ChatKit SDK 外部的副作用。

## 触发操作

### 响应用户与小组件的交互

可以通过将一个 action 附加到任何支持该功能的 widget 节点上来触发动作。 `ActionConfig` 例如，你可以响应按钮上的点击事件。当用户点击此按钮时，action 将被发送到你的服务器，你可以在那里更新 widget、运行推理、流式传输新的 thread item 等。

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(
        type="example",
        payload={"id": 123},
    ),
)
```


action 也可以由你的前端以命令式方式发送。 `sendAction()`。当你需要 ChatKit 响应发生在 ChatKit 外部的交互时，这可能会非常有用，但它也可以用于在需要同时在客户端和服务器端进行响应时串联 action（更多内容见下文）。

```javascript
await chatKit.sendAction({
  type: "example",
  payload: { id: 123 },
});
```


## 处理动作

### 在服务端

默认情况下，操作会发送到你的服务器。你可以通过实现 `action` 方法在服务器端处理操作 `ChatKitServer`.

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
                    thread_id=thread.id,
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


由于操作及其载荷是由客户端发送到你的服务器的，请将其视为不受信任的数据。

### Client

有时你需要在客户端集成中处理这些操作。为此，你需要指定将该操作发送到你的客户端操作处理器，具体做法是添加 `handler="client"` 到 `ActionConfig`.

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(type="example", payload={"id": 123}, handler="client"),
)
```


然后，当该操作被触发时，它会被传递到你在实例化 ChatKit 时提供的回调函数。

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

默认情况下 `Action` 并且 `ActionConfig` 不是强类型的。但是，我们确实提供了一个 `create` 辅助方法在 `Action` 用于生成 `ActionConfig`，从一组强类型动作生成。

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


## 使用小组件和操作创建自定义表单

当接收用户输入的微件节点挂载在 `Form`，中时，这些字段中的值将包含在 `payload` 中源自该 `Form`.

表单值通过 `payload` 按其 `name` 例如。

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

`Form` 使用基本的原生表单校验；在已配置字段上 `required` 并且 `pattern` 执行校验，并在表单存在任何无效字段时阻止提交。

未来我们可能会增加新的校验模式，以提供更好的用户体验、更具表达力的校验、自定义错误展示等。在那之前，小组件并不是承载具有复杂校验需求的复杂表单的理想载体。如果你有此类需求，更好的做法是使用客户端动作处理来触发一个模态框，在其中展示自定义表单，然后将结果传递回 ChatKit，并配合 `sendAction`.

### 将 `Card` 视为 `Form`

你可以传入 `asForm=True` 到 `Card` ，它将作为 `Form`，运行，运行校验并将收集到的字段传递给 Card 的 `confirm` 操作。

### Payload 键冲突

如果与你的载荷中其他已有的预定义键发生命名冲突，该表单值将被忽略。这很可能是一个 bug，所以当我们检测到这种情况时，会发出一个 `error` 事件。

## 控制小组件中的加载状态交互

使用 `ActionConfig.loadingBehavior` 来控制操作如何在小工具中触发不同的加载状态。

```python
button = Button(
    label="This may take a while...",
    onClickAction=ActionConfig(
        type="long_running_action_that_should_block_other_ui_interactions",
        loadingBehavior="container",
    ),
)
```


| 取值       | 行为                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `auto`      | 该操作将根据其使用方式进行适配。（_默认_)                                                                       |
| `self`      | 该操作会在其所绑定的小部件节点上触发加载状态。                                              |
| `container` | 该操作会在整个小部件容器上触发加载状态。这会导致小部件略微淡出并变为不可交互状态。 |
| `none`      | 无加载状态                                                                                                                |

### 使用 `auto` 行为

通常，我们建议使用 `auto`，这是默认值。 `auto` 会根据 action 绑定的位置触发加载状态，例如：

- `Button.onClickAction` → `self`
- `Select.onChangeAction` → `none`
- `Card.confirm.action` → `container`