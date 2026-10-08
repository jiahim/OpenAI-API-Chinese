# 将语音连接到决策

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

使用 [实时 API](https://developers.openai.com/api/docs/guides/live) 进行语音对话，并使用 [Decisions API](https://developers.openai.com/api/docs/guides/decisions) 从口头请求中选择动作。通过 [客户端委托](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)，GPT-Live 在你的应用调用 Decisions、执行所选动作并返回结果期间持续进行语音交流。

## 通过语音控制浏览器

本示例展示如何在浏览器中添加语音控制。

当用户说“重新加载此页面”时，将对话和当前浏览器状态发送到 Decisions，并提供三个选项： `back`, `reload`，和 `noop`。Decisions 选择 `reload`。你的应用重新加载页面，更新其状态，并告知 GPT-Live 所发生的情况。



> 图示：GPT-Live 处理语音对话，同时应用将转录文本和浏览器状态发送给 Decisions。Decisions 选择 reload。应用重新加载页面，更新其状态，并将结果返回给 GPT-Live。



### 连接语音会话

创建一个 [实时会话](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live#connect-a-browser-to-gpt-live) 使用 `delegation: { type: "client" }` 并告诉 GPT-Live 你的应用支持哪些操作。当收到 [`session.delegation.created`](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation)，时，保存 `event.delegation.id` 并启动 Decisions 请求。使用此 ID 将结果返回给 GPT-Live。

### 构建 Decisions 提示词

追踪当前应用状态，并从中收集用户和助手的消息记录 [`session.input_transcript.delta` 并 `session.output_transcript.delta`](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application).

将这些消息记录与用户的最新请求及当前应用状态组合在一起：

```text
User conversation:
user: Which page is open?
assistant: The documentation page.

Last user request:
Reload this page.

Current state:
Active tab: Documentation. Page loaded.
Available actions: back, reload, noop.
```

### 选择并运行操作

从你的服务器向 Decisions API 发送提示和可用选项。保持 `OPENAI_API_KEY` 在服务器端：

```bash
curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-luna",
    "input": "User conversation:\nuser: Which page is open?\nassistant: The documentation page.\n\nLast user request:\nReload this page.\n\nCurrent state:\nActive tab: Documentation. Page loaded.\nAvailable actions: back, reload, noop.",
    "questions": [{
      "type": "choice",
      "name": "browser_action",
      "instructions": "Choose the requested, currently available action. Choose noop if no action fits.",
      "choices": [
        {"value": "back", "description": "Go back one page."},
        {"value": "reload", "description": "Reload the current page."},
        {"value": "noop", "description": "Take no action."}
      ]
    }]
  }'
```

找到名为 `browser_action` 的答案，该答案位于响应的 `answers` 数组中，并读取其 `choice`。运行匹配的操作： `reload` 重新加载当前页面， `back` 返回上一页，以及 `noop` 不执行任何操作。如果请求已被取消或不再适应当前应用状态，则跳过该操作。

### 将结果返回给 GPT-Live

使用当前页面、加载状态以及操作是否成功来更新你的应用状态。在下一个 Decisions 提示中使用此状态。

使用以下方式将结果发送给 GPT-Live [`session.commentary.append`](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update) 以及已保存的委托 ID。这会提示 GPT-Live 告知用户发生了什么。对于成功重新加载的情况，发送：

```json
{
  "type": "session.commentary.append",
  "delegation_id": "<event.delegation.id>",
  "content": "The documentation page reloaded successfully and is ready."
}
```

使用 `session.thinking.append` 可在不提示其发言的情况下更新 GPT-Live 的上下文。每次追加控制在 500 个 token 以内。

## 将复杂请求路由到推理模型

使用 Decisions 选择一个受支持的操作，或将更复杂的请求路由到推理模型。在幻灯片演示场景中，“Go to the next slide”映射到 `next_slide`，而“Compare these two plans and recommend one”映射到 `reason`.

将对话和当前状态包含到 `input`，然后将请求发送到 `POST /v1/decisions`:

```json
{
  "model": "gpt-6-luna",
  "input": "User: Compare these two plans and recommend one. Current state: slide 3 of 10 is open and both plans are available.",
  "questions": [
    {
      "type": "choice",
      "name": "route",
      "instructions": "Choose a matching slide action that is available in the current state. Otherwise, choose reason.",
      "choices": [
        {
          "value": "next_slide",
          "description": "Go to the next slide."
        },
        {
          "value": "previous_slide",
          "description": "Go to the previous slide."
        },
        {
          "value": "first_slide",
          "description": "Go to the first slide."
        },
        {
          "value": "reason",
          "description": "Use a reasoning model for analysis, planning, or other requests."
        }
      ]
    }
  ]
}
```

读取 `route` answer 的 `choice`。对于幻灯片操作，请根据当前状态进行校验，并运行匹配的处理函数。对于 `reason`，请调用 [Responses API 时使用推理模型](https://developers.openai.com/api/docs/guides/reasoning#get-started-with-reasoning)，传入原始请求和相关上下文，例如两个方案的内容。

两种路由都让会话保持客户端委托模式。你的应用负责 延续 与取消，并使用同一个委托 ID 返回结果。

## 其他用途

在你的应用中使用相同的工作流及其选项和状态：

- **幻灯片导航：** 提供 `next`, `previous`, `start`，以及 `end` ，根据当前幻灯片。
- **界面操作：** 将诸如 `click_search` 映射到当前界面状态中的元素 ID。操作前检查该元素是否仍然可用。
- **语音引导游戏：** 根据语音目标和当前游戏状态选择可用按钮。重复执行，直到应用确认成功或用户取消，并将进度更新发送给 GPT-Live。
- **机器人手势：** 将诸如“挥手打招呼”之类的请求映射到 `nod`, `shake_head`，或 `wave`，然后将所选手势发送给机器人控制器。
- **媒体控制：** 提供 `play`, `pause`，以及 `next_track` ，根据播放器的当前状态。