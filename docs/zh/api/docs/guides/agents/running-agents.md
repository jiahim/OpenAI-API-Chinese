# 运行智能体

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

定义智能体只是设置步骤。运行时的问题在于单次运行执行什么、下一轮如何延续，以及工作流在因审批或工具工作而暂停时如何表现。

## 智能体循环

一次 SDK 运行是一个应用级别的回合。运行器会持续循环，直到达到真正的停止点：

1. 使用准备好的输入调用当前智能体的模型。
2. 检查模型的输出。
3. 如果模型产生了工具调用，执行这些调用并继续。
4. 如果模型交接给了另一位专家，则切换智能体并继续。
5. 如果模型产生了最终答案且无需更多工具操作，则返回结果。

这个循环是SDK背后的核心概念。工具、交接、审批和流式传输都构建在其之上，而非替代它。

## 选择一种对话策略

有四种常见方式可以将状态带入下一轮：

| 策略                                                                                                           | 状态存储位置         | 最适合                                                               | 下一轮你传入的内容                 |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `result.history` 使用 TypeScript 或 `result.to_input_list()` 使用 Python   | 你的应用          | 小型聊天循环和最大控制力                                   | 可重放的完整历史                       |
| `session`                                                                                                          | 你的存储加上 SDK | 持久化聊天状态、可恢复运行以及由你控制的存储         | 同一个会话                               |
| `conversationId`                                                                                                   | OpenAI Conversations API  | 跨工作进程或服务共享的服务端托管状态                 | 同一个对话 ID，且只传新的那一轮 |
| `previousResponseId` 使用 TypeScript 或 `previous_response_id` 使用 Python | OpenAI Responses API      | 从一个响应到下一个响应最轻量的服务端延续 | 最后一个响应 ID，且只传新的那一轮     |

在大多数应用中，每个对话选择一种策略。将本地回放与服务端管理状态混合使用可能会重复上下文，除非你有意协调这两层。

使用会话持久化多轮状态

```javascript
import { Agent, MemorySession, run } from "@openai/agents";

const agent = new Agent({
  name: "Tour guide",
  instructions: "Answer with compact travel facts.",
});

const session = new MemorySession();

const firstTurn = await run(agent, "What city is the Golden Gate Bridge in?", {
  session,
});
console.log(firstTurn.finalOutput);

const secondTurn = await run(agent, "What state is it in?", { session });
console.log(secondTurn.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner, SQLiteSession

agent = Agent(
    name="Tour guide",
    instructions="Answer with compact travel facts.",
)

session = SQLiteSession("conversation_123")


async def main() -> None:
    first_turn = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
        session=session,
    )
    print(first_turn.final_output)

    second_turn = await Runner.run(
        agent,
        "What state is it in?",
        session=session,
    )
    print(second_turn.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


当你需要持久记忆、可恢复的审批流程或由你的应用控制的存储时，会话是最佳默认选择。

续用服务端管理状态

```javascript
import { Agent, run } from "@openai/agents";
import OpenAI from "openai";

const agent = new Agent({
  name: "Assistant",
  instructions: "Reply very concisely.",
});

const client = new OpenAI();
const { id: conversationId } = await client.conversations.create({});

const first = await run(agent, "What city is the Golden Gate Bridge in?", {
  conversationId,
});
console.log(first.finalOutput);

const second = await run(agent, "What state is it in?", {
  conversationId,
});
console.log(second.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner

agent = Agent(
    name="Assistant",
    instructions="Reply very concisely.",
)


async def main() -> None:
    first = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
    )
    print(first.final_output)

    second = await Runner.run(
        agent,
        "What state is it in?",
        previous_response_id=first.last_response_id,
    )
    print(second.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


当多个系统应共享一个命名对话时，使用 `conversationId` 。使用 `previousResponseId` （在 TypeScript 中）或 `previous_response_id` （在 Python 中）以获得最经济的响应间延续选项。

## 流式运行增量输出

流式传输使用相同的智能体循环和相同的状态策略。唯一区别是你在运行仍在进行时消耗事件。

按文本到达流式传输运行

```javascript
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "Planet guide",
  instructions: "Answer with short facts.",
});

const stream = await run(agent, "Give me three short facts about Saturn.", {
  stream: true,
});

for await (const event of stream) {
  if (
    event.type === "raw_model_stream_event" &&
    event.data.type === "output_text_delta"
  ) {
    process.stdout.write(event.data.delta);
  }
}

await stream.completed;
console.log("\nFinal:", stream.finalOutput);
```

```python
import asyncio

from openai.types.responses import ResponseTextDeltaEvent

from agents import Agent, Runner

agent = Agent(
    name="Planet guide",
    instructions="Answer with short facts.",
)


async def main() -> None:
    stream = Runner.run_streamed(
        agent,
        "Give me three short facts about Saturn.",
    )

    async for event in stream.stream_events():
        if event.type == "raw_response_event" and isinstance(
            event.data, ResponseTextDeltaEvent
        ):
            print(event.data.delta, end="", flush=True)

    print(f"\nFinal: {stream.final_output}")


if __name__ == "__main__":
    asyncio.run(main())
```


三个实用规则很重要：

- 等待流结束，再将该运行视为已落定。
- 如果运行因等待审批而暂停，请先解决 `interruptions` 再从 `state` 恢复，而不是开启新一轮用户对话。
- 如果你在运行中途取消了一个流，请从 `state` 恢复未完成的对话，以便稍后继续同一轮次。

## 有意识地处理暂停和失败

两大类非正常路径结果需要关注：

- **运行时或验证失败** 如最大轮次限制、护栏异常或工具错误。
- **预期暂停** 如人工审批请求，此时运行被有意中断，并应稍后从相同状态恢复。

将审批视为暂停的运行，而不是新的回合。这一区别使回合数、历史记录以及服务端管理的延续 ID 保持一致。

## 后续步骤

一旦运行时循环清晰，接下来就进入与你需要设计的下一个工作流边界相匹配的指南。



  [结果与状态



        Learn which result surfaces your application should carry into the next
      turn.](https://developers.openai.com/api/docs/guides/agents/results)
  [编排与交接



        决定多个专家如何在同一个运行时循环内协作。](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [护栏与人工审核



        在不打断回合连续性的情况下添加验证和批准暂停。](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)