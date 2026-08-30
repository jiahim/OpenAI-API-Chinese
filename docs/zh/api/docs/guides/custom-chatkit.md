# ChatKit 高级集成

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

当你需要完全控制——自定义身份验证、数据驻留、本地部署，或定制化的 智能体 编排——你可以在自己的基础设施上运行 ChatKit。使用 OpenAI 的高级自托管选项来使用你自己的服务器和定制化的 ChatKit。

智能体 Builder 托管的 ChatKit 工作流正处于过渡期。对于新的
  ChatKit 应用，请基于你自己的 服务端 智能体 实现进行构建，使用
  ChatKit SDK 和 Agents SDK。请参阅 [ChatKit 过渡指南
  →](https://developers.openai.com/api/docs/guides/chatkit)

## 在自有基础设施上运行 ChatKit

从整体来看，高级 ChatKit 集成是构建你自己的 ChatKit 服务器并添加 widgets 以构建聊天界面的过程。你将使用 OpenAI API 和你的 ChatKit 服务器，基于 OpenAI 模型构建自定义聊天功能。

![OpenAI 托管的 ChatKit](https://cdn.openai.com/API/docs/images/self-hosted.png)

## 设置你的 ChatKit 服务器

请参阅 [GitHub 上的服务端指南](https://github.com/openai/chatkit-python/blob/main/docs/server.md) 了解如何处理传入请求、运行工具,并
将结果流式返回给客户端。下面的代码片段展示了主要组件。

### 1. 安装服务端包

```bash
pip install openai-chatkit
```

### 2. 实现服务端类

`ChatKitServer` 驱动对话流程。可通过以下参数进行覆盖 `respond` ，在每当有
用户消息或客户端工具输出到达时，流转事件。类似 `stream_agent_response` connect
的方法可将服务端连接到Agents SDK。

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


### 3. 公开该端点

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

实现 `chatkit.store.Store` 以使用你
首选的数据库来持久化线程、消息和文件。对于本地开发，你可以使用内存 `Store`
实现。生产环境下，请使用持久化存储，并考虑将模型存储为
JSON blob，以便库升级时可以在不进行迁移的情况下演进 schema。

### 5. 提供文件存储合约

提供一个 `FileStore` 实现，前提是你支持上传。ChatKit 可与直接
上传（客户端将文件 POST 到你的端点）或两阶段上传（客户端
请求一个签名 URL，然后上传到云存储）配合使用。暴露预览以支持内联
缩略图，并在会话被删除时处理删除操作。

### 6. 从服务端触发客户端工具

客户端工具必须同时在客户端选项和你的智能体上注册。使用
`ctx.context.client_tool_call` 从 Agents SDK 工具中排队调用。

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

使用 `thread.metadata` 来存储服务端状态，例如上一次的Responses API 运行
ID 或自定义标签。元数据不会暴露给客户端，但可在每次
`respond` 调用中使用。

### 8. 获取工具状态更新

长时间运行的工具可以通过 `ProgressUpdateEvent`. ChatKit
将进度事件替换为下一条助手消息或 widget 输出。

### 9. 使用服务端上下文

传入自定义上下文对象以 `server.process(body, context)` 强制执行权限，或
通过你的存储与文件存储实现传递用户身份。

## 添加内联交互式小组件

Widgets 让 智能体 能够在聊天界面中呈现丰富的 UI。可用于卡片、表单、
文本块、列表以及其他布局。 `stream_widget` 辅助函数
可以立即渲染一个 widget，也可以随着数据到达进行流式更新。

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


ChatKit 自带丰富的 widget 节点（卡片、列表、表单、文本、按钮等），详情
请参阅 [GitHub 上的 widgets 指南](https://github.com/openai/chatkit-python/blob/main/docs/widgets.md) 以了解所有组件、props 以及
流式传输指南。

请参阅 [Widget Builder](https://widgets.chatkit.studio/) 在交互式 UI 中浏览并创建 widget。

## 使用操作

Actions 让 ChatKit UI 能在不发送用户消息的情况下触发工作。将一个
`ActionConfig` 附加到任何支持它的 widget 节点上——比如按钮、下拉选择以及其他控件
都可以流式推送新的线程条目，或就地更新 widget。当一个 widget 位于一个
`Form`，中时，ChatKit 会将收集到的表单值包含在 action 负载中。

在服务端，实现 `action` 方法，作用于 `ChatKitServer` 以处理该负载
，并可选择性地流式推送额外的事件。你也可以在客户端通过
设置 `handler="client"` 来在 JavaScript 中响应，然后将后续的
工作转发到服务端。

请参阅 [GitHub 上的 actions 指南](https://github.com/openai/chatkit-python/blob/main/docs/actions.md) ，了解诸如链式调用 action、创建
强类型负载以及协调客户端/服务端处理器的模式。

## Resources

使用以下资源和参考来完成你的集成。

### 设计资源

- 下载 [OpenAI Sans Variable](https://drive.google.com/file/d/10-dMu1Oknxg3cNPHZOda9a1nEkSwSXE1/view?usp=sharing).
- 复制该文件并为你的产品自定义组件。

### Events 参考

ChatKit 从 Web Component 发出 `CustomEvent` 实例。监听生命周期事件,并从以下位置读取载荷数据 `event.detail`:

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

| 选项          | 类型                       | 说明                                                | 默认值        |
| --------------- | -------------------------- | ---------------------------------------------------------- | -------------- |
| `apiURL`        | `string`                   | 实现 ChatKit 服务端协议的端点。      | _必填_     |
| `fetch`         | `typeof fetch`             | 覆盖 fetch 调用（用于自定义请求头或身份验证）。         | `window.fetch` |
| `theme`         | `"light" \| "dark"`        | 界面主题。                                                  | `"light"`      |
| `initialThread` | `string \| null`           | 挂载时打开的会话； `null` 显示新建会话视图。 | `null`         |
| `clientTools`   | `Record<string, Function>` | 暴露给模型的客户端侧执行工具。                |                |
| `header`        | `object \| boolean`        | 头部配置或 `false` 用于隐藏头部。        | `true`         |
| `newThreadView` | `object`                   | 自定义问候语和初始提示。               |                |
| `messages`      | `object`                   | 配置消息功能（反馈、批注等）。  |                |
| `composer`      | `object`                   | 控制附件、实体标签和占位文本。    |                |
| `entities`      | `object`                   | 用于实体查找、点击处理和预览的回调。 |                |

### 纯文本别名

- "light" | "dark"
- string | null
- object | boolean