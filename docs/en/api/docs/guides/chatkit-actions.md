# Actions in ChatKit

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Actions are a way for the ChatKit SDK frontend to trigger a streaming response without the user submitting a message. They can also be used to trigger side-effects outside ChatKit SDK.

## Triggering actions

### In response to user interaction with widgets

Actions can be triggered by attaching an `ActionConfig` to any widget node that supports it. For example, you can respond to click events on Buttons. When a user clicks on this button, the action will be sent to your server where you can update the widget, run inference, stream new thread items, etc.

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(
        type="example",
        payload={"id": 123},
    ),
)
```


Actions can also be sent imperatively by your frontend with `sendAction()`. This is probably most useful when you need ChatKit to respond to interaction happening outside ChatKit, but it can also be used to chain actions when you need to respond on both the client and the server (more on that below).

```javascript
await chatKit.sendAction({
  type: "example",
  payload: { id: 123 },
});
```


## Handling actions

### On the server

By default, actions are sent to your server. You can handle actions on your server by implementing the `action` method on `ChatKitServer`.

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


Treat actions and their payloads as untrusted data because the client sends them to your server.

### Client

Sometimes you’ll want to handle actions in your client integration. To do that you need to specify that the action should be sent to your client-side action handler by adding `handler="client"` to the `ActionConfig`.

```python
button = Button(
    label="Example",
    onClickAction=ActionConfig(type="example", payload={"id": 123}, handler="client"),
)
```


Then, when the action is triggered, it will then be passed to a callback that you provide when instantiating ChatKit.

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


## Strongly typed actions

By default `Action` and `ActionConfig` are not strongly typed. However, we do expose a `create` helper on `Action` that generates `ActionConfig`s from a set of strongly-typed actions.

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


## Use widgets and actions to create custom forms

When widget nodes that take user input are mounted inside a `Form`, the values from those fields will be included in the `payload` of all actions that originate from within the `Form`.

Form values are keyed in the `payload` by their `name` e.g.

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

`Form` uses basic native form validation; enforcing `required` and `pattern` on fields where they are configured and blocking submission when the form has any invalid field.

We may add new validation modes with better UX, more expressive validation, custom error display, etc in the future. Until then, widgets are not a great medium for complex forms with tricky validation. If you have this need, a better pattern would be to use client side action handling to trigger a modal, show a custom form there, then pass the result back into ChatKit with `sendAction`.

### Treating `Card` as a `Form`

You can pass `asForm=True` to `Card` and it will behave as a `Form`, running validation and passing collected fields to the Card’s `confirm` action.

### Payload key collisions

If there is a naming collision with some other existing pre-defined key on your payload, the form value will be ignored. This is probably a bug, so we’ll emit an `error` event when we see this.

## Control loading state interactions in widgets

Use `ActionConfig.loadingBehavior` to control how actions trigger different loading states in a widget.

```python
button = Button(
    label="This may take a while...",
    onClickAction=ActionConfig(
        type="long_running_action_that_should_block_other_ui_interactions",
        loadingBehavior="container",
    ),
)
```


| Value       | Behavior                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `auto`      | The action will adapt to how it’s being used. (_default_)                                                                       |
| `self`      | The action triggers loading state on the widget node that the action was bound to.                                              |
| `container` | The action triggers loading state on the entire widget container. This causes the widget to fade out slightly and become inert. |
| `none`      | No loading state                                                                                                                |

### Using `auto` behavior

Generally, we recommend using `auto`, which is the default. `auto` triggers loading states based on where the action is bound, for example:

- `Button.onClickAction` → `self`
- `Select.onChangeAction` → `none`
- `Card.confirm.action` → `container`