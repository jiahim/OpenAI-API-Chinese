# 与 ChatKit 的高级集成

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

当你需要完全控制——自定义身份验证、数据驻留、本地部署或定制的智能体编排——你可以在自己的基础设施上运行 ChatKit。使用OpenAI的高级自托管选项来使用你自己的服务器和定制的 ChatKit。

智能体 Builder 托管的 ChatKit 工作流正处于过渡期。对于新的
  ChatKit 应用，请使用服务端智能体实现构建于你自己的，配合
  ChatKit SDK和Agents SDK。参见 [ChatKit 过渡指南
  →](https://developers.openai.com/api/docs/guides/chatkit)

## 在你自己的基础设施上运行 ChatKit

从宏观层面来看，高级 ChatKit 集成是构建你自己的 ChatKit 服务器并添加小部件来构建聊天界面的过程。你将使用OpenAI API和你的 ChatKit 服务器来构建由OpenAI模型驱动的自定义聊天。

![OpenAI托管的 ChatKit](https://cdn.openai.com/API/docs/images/self-hosted.png)

## 设置你的 ChatKit 服务器

请参阅 [GitHub 上的服务端指南](https://github.com/openai/chatkit-python/blob/main/docs/server.md) 了解如何处理传入请求、运行工具，以及
如何将结果流式返回给客户端。以下片段突出了主要组件。

### 1. 安装服务端包

```bash
pip install openai-chatkit
```

### 2. 实现服务端类

`ChatKitServer` 驱动对话。覆盖 `respond` 以在每当
用户消息或客户端工具输出到达时流式传输事件。诸如 `stream_agent_response` 连接
服务器与 Agents SDK 的助手。

```python
class MyChatKitServer(ChatKitServer[RequestContext]):
    async def respond(
        self,
        thread: ThreadMetadata,
        input: UserMessageItem | ClientToolCallOutputItem | None,
        context: RequestContext,
    ) -> AsyncIterator[Event]:
        items_page = await self.store.load_thread_items(
            thread.id,
            after=None,
            limit=20,
            order="desc",
            context=context,
        )
        input_items = await simple_to_agent_input(list(reversed(items_page.data)))
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )
        result = Runner.run_streamed(
            assistant_agent,
            input_items,
            context=agent_context,
        )
        async for event in stream_agent_response(agent_context, result):
            yield event
```


### 3. 暴露端点

使用你选择的框架将 HTTP 请求转发到服务器实例。例如，使用 Fast
API：

```python
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse

app = FastAPI()
data_store = MemoryStore()
server = MyChatKitServer(data_store)


@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    result = await server.process(await request.body(), {})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")
```


### 4. 建立数据存储契约

实现 `chatkit.store.Store` 以使用你偏好的数据库持久化线程、消息和文件。
对于本地开发，你可以使用内存 `Store`
实现。对于生产环境，请使用持久化存储，并考虑将模型存储为
JSON 块，以便库更新无需迁移即可演进模式。

### 5. 提供文件存储合约

提供 `FileStore` 实现（如果你支持上传）。ChatKit 支持直接
上传（客户端将文件 POST 到你的端点）或两阶段上传（客户端
请求签名 URL，然后上传到云存储）。暴露预览以支持内联
缩略图，并在线程被删除时处理删除操作。

### 6. 从服务器端触发客户端工具

客户端工具必须同时注册到客户端选项中以及你的智能体上。使用
`ctx.context.client_tool_call` 从一个Agents SDK工具中排队调用。

```python
@function_tool(description_override="Add an item to the user's todo list.")
async def add_to_todo_list(ctx: RunContextWrapper[AgentContext], item: str) -> None:
    ctx.context.client_tool_call = ClientToolCall(
        name="add_to_todo_list",
        arguments={"item": item},
    )


assistant_agent = Agent[AgentContext](
    model="gpt-5.6",
    name="Assistant",
    instructions="You are a helpful assistant",
    tools=[add_to_todo_list],
    tool_use_behavior=StopAtTools(stop_at_tool_names=[add_to_todo_list.name]),
)
```


### 7. 使用线程元数据和状态

使用 `thread.metadata` 存储服务端状态，例如之前的Responses API运行
ID 或自定义标签。元数据不会暴露给客户端，但会在每次
`respond` 调用中可用。

### 8. 获取工具状态更新

长时间运行的工具可以通过 `ProgressUpdateEvent`。向界面流式传输进度。ChatKit
会用下一条助手消息或小部件输出来替换进度事件。

### 9. 使用服务端上下文

将自定义上下文对象传递给 `server.process(body, context)` 以强制执行权限或
通过你的存储和文件存储实现传播用户身份。

## 添加内联交互式小组件

小组件让智能体能够在聊天界面中呈现丰富的 UI。可用于卡片、表单、
文本块、列表及其他布局。辅助工具 `stream_widget` 可以立即渲染小组件
或实时流式更新。

```python
async def respond(
    self,
    thread: ThreadMetadata,
    input: UserMessageItem | ClientToolCallOutputItem | None,
    context: RequestContext,
) -> AsyncIterator[Event]:
    widget = Card(
        children=[
            Text(
                id="description",
                value="Generated summary",
            )
        ]
    )
    async for event in stream_widget(
        thread,
        widget,
        generate_id=lambda item_type: self.store.generate_item_id(
            item_type, thread, context
        ),
    ):
        yield event
```


ChatKit 附带多种小组件节点（卡片、列表、表单、文本、按钮等），
详见 [GitHub 上的小组件指南](https://github.com/openai/chatkit-python/blob/main/docs/widgets.md) 了解所有组件、属性及
流式处理指引。

参见 [Widget Builder](https://widgets.chatkit.studio/) 以在交互式 UI 中探索和创建小组件。

## 使用操作

操作（Actions）让 ChatKit 界面无需发送用户消息即可触发工作。将
`ActionConfig` 附加到任何支持它的部件节点——按钮、选择框和其他控件
可以流式传输新的线程项或就地更新部件。当部件位于
`Form`，内部时，ChatKit 会在操作负载中包含收集的表单值。

在服务器端，实现 `action` 方法于 `ChatKitServer` 以处理负载
并可选地流式传输额外事件。你也可以在客户端处理操作，通过
设置 `handler="client"` 并在转发后续
工作到服务器之前用 JavaScript 响应。

参见 [GitHub 上的操作指南](https://github.com/openai/chatkit-python/blob/main/docs/actions.md) 了解链式操作、创建
强类型负载以及协调客户端/服务器处理程序等模式。

## 资源

使用以下资源和参考来完成你的集成。

### 设计资源

- 下载 [OpenAI Sans Variable](https://drive.google.com/file/d/10-dMu1Oknxg3cNPHZOda9a1nEkSwSXE1/view?usp=sharing).
- 复制该文件并根据你的产品定制组件。

### 事件参考

ChatKit 会发出 `CustomEvent` 来自 Web Component 的实例。监听生命周期事件，并从 `event.detail`:

```javascript
chatkit.addEventListener("chatkit.error", (event) => {
  console.error(event.detail.error);
});

chatkit.addEventListener("chatkit.response.start", () => {
  console.log("Response started");
});

chatkit.addEventListener("chatkit.response.end", () => {
  console.log("Response ended");
});

chatkit.addEventListener("chatkit.thread.change", (event) => {
  console.log("Active thread:", event.detail.threadId);
});

chatkit.addEventListener("chatkit.log", (event) => {
  console.log(event.detail.name, event.detail.data);
});
```


### 选项参考

| 选项          | 类型                       | 描述                                                | 默认值        |
| --------------- | -------------------------- | ---------------------------------------------------------- | -------------- |
| `apiURL`        | `string`                   | 实现 ChatKit 服务器协议的端点。      | _必填_     |
| `fetch`         | `typeof fetch`             | 覆盖 fetch 调用（用于自定义标头或认证）。         | `window.fetch` |
| `theme`         | `"light" \| "dark"`        | UI 主题。                                                  | `"light"`      |
| `initialThread` | `string \| null`           | 挂载时打开的线程； `null` 显示新线程视图。 | `null`         |
| `clientTools`   | `Record<string, Function>` | 暴露给模型的客户端执行工具。                |                |
| `header`        | `object \| boolean`        | 标头配置或 `false` 隐藏标头。        | `true`         |
| `newThreadView` | `object`                   | 自定义问候文本和起始提示。               |                |
| `messages`      | `object`                   | 配置消息功能（反馈、注释等）。  |                |
| `composer`      | `object`                   | 控制附件、实体标签和占位符文本。    |                |
| `entities`      | `object`                   | 用于实体查找、点击处理和预览的回调。 |                |

### 纯文本别名

- "light" | "dark"
- string | null
- object | boolean