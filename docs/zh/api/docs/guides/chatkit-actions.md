# ChatKit 中的操作

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

Actions 是一种让 ChatKit SDK 前端在用户不提交消息的情况下触发流式响应的方式。它们也可以用来在 ChatKit SDK 之外触发副作用。

## 触发操作

### 响应用户与小组件的交互

你可以通过将一个 `ActionConfig` 附加到任何支持该功能的 widget 节点上来触发动作。例如，你可以响应对按钮（Button）的点击事件。当用户点击该按钮时，动作会被发送到你的服务器，你可以在服务器上更新 widget、运行推理、流式传输新的 thread 项等。

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(
        type="example",
        payload={"id": 123},
    ),
)
```


动作也可以由你的前端以命令式方式通过 `sendAction()`。发送。这在你需要让 ChatKit 响应 ChatKit 外部发生的交互时可能最为有用，但它也可以用于在需要同时在客户端和服务器端进行响应时串联多个动作（详见下文）。

```javascript
await chatKit.sendAction({
  type: "example",
  payload: { id: 123 },
});
```


## 处理动作

### 在服务端

默认情况下，actions 会发送到你的服务器。你可以在服务器上通过实现 `action` 方法来处理 actions。 `ChatKitServer`.

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


将 actions 及其 payload 视为不可信的数据，因为它们是由客户端发送到你的服务器的。

### Client

有时你需要在客户端集成中处理操作。为此，你需要通过添加以下内容来指定将该操作发送到你的客户端操作处理器 `handler="client"` 到 `ActionConfig`.

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(type="example", payload={"id": 123}, handler="client"),
)
```


然后，当操作被触发时，它会被传递到你在实例化 ChatKit 时提供的回调函数。

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


## 强类型 actions

默认情况下 `Action` 并且 `ActionConfig` 不是强类型的。不过，我们确实在 `create` 上提供了一个 `Action` 辅助函数，用于生成 `ActionConfig`，它从一组强类型动作生成。

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


## 使用 widgets 和 actions 创建自定义表单

当接收用户输入的 widget 节点挂载在 `Form`，中时，这些字段的值将被包含在 `payload` 所有源自该 `Form`.

表单值通过其 `payload` 进行键控 `name` 例如。

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


### Validation

`Form` 使用基本的原生表单验证；在配置了验证规则的字段上强制执行，并在表单存在任何无效字段时阻止提交。 `required` 并且 `pattern` 在已配置字段上执行验证，并在表单存在任何无效字段时阻止提交。

未来我们可能会添加具有更佳用户体验、更具表现力的验证以及自定义错误展示等能力的新验证模式。在此之前，小组件并不是承载带有复杂验证逻辑的复杂表单的理想载体。如果你有此需求，更合适的做法是使用客户端操作处理来触发一个模态框，在其中展示自定义表单，然后将结果传递回 ChatKit `sendAction`.

### 将 `Card` 视为 `Form`

你可以将 `asForm=True` 传递给 `Card` ，它将表现为 `Form`，运行校验并将收集到的字段传递给该 Card 的 `confirm` action。

### 负载键冲突

如果与 payload 上已有的其他预定义键存在命名冲突，表单值将被忽略。这很可能是一个 bug，因此当我们发现这种情况时会发出一个 `error` 事件。

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


| 值       | 行为                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `auto`      | 该动作会自适应其使用方式。（_default_)                                                                       |
| `self`      | 该动作会在所绑定的小部件节点上触发加载状态。                                              |
| `container` | 该动作会在整个小部件容器上触发加载状态。这会使小部件略微淡出并变为不可交互。 |
| `none`      | 无加载状态                                                                                                                |

### 使用 `auto` 行为

通常，我们建议使用 `auto`，它是默认选项。 `auto` 会根据 action 的绑定位置触发加载状态，例如：

- `Button.onClickAction` → `self`
- `Select.onChangeAction` → `none`
- `Card.confirm.action` → `container`