# 运行智能体

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

定义一个智能体只是准备工作。运行时真正需要关心的问题是：单次运行会做什么、下一个轮次如何延续，以及当工作流因为审批或工具调用而暂停时的行为表现。

## 智能体循环

一次 SDK 运行就是一次应用层回合。运行器会持续循环，直到到达真正的停止点为止：

1. 使用准备好的输入调用当前智能体的模型。
2. 检查模型输出。
3. 如果模型产生了工具调用，则执行这些调用并继续。
4. 如果模型交接给了其他专家，则切换智能体并继续。
5. 如果模型在不再有工具工作时给出了最终答案，则返回结果。

这个循环就是 SDK 背后的核心概念。工具、交接、审批和流式传输都是在它的基础上构建的，而不是取代它。

## 选择一种对话策略

将状态延续到下一轮的方式通常有以下四种：

| 策略                                                                                                           | 状态所在位置         | 适用场景                                                               | 下一轮传入的内容                 |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `result.history` 在 TypeScript 或 `result.to_input_list()` 在 Python 中   | 你的应用          | 小型对话循环和最大程度的控制                                   | 可重放的就绪历史                       |
| `session`                                                                                                          | 你的存储加上 SDK | 持久的聊天状态、可恢复的运行，以及你可掌控的存储         | 同一个会话                               |
| `conversationId`                                                                                                   | OpenAI Conversations API  | 跨 worker 或服务共享的服务端托管状态                 | 同一个会话 ID，仅包含新一轮 |
| `previousResponseId` 在 TypeScript 或 `previous_response_id` 在 Python 中 | OpenAI Responses API      | 从一个响应到下一个响应最轻量的服务端托管延续 | 上一个响应 ID，仅包含新一轮     |

在大多数应用中，每次对话应选择一种策略。除非你刻意协调两层，否则混合本地回放和服务端托管状态可能会导致上下文重复。

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


当你需要持久化记忆、可恢复的审批流程，或由你的应用自行控制的存储时，会话是最佳默认选择。

继续了解服务端托管状态

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


使用 `conversationId` 可以在多个系统之间共享同一个命名对话。使用 `previousResponseId` （TypeScript）或 `previous_response_id` （Python）可在逐条响应之间获得成本最低的延续选项。

## 增量流式运行

流式传输使用相同的智能体循环和相同的状态策略。唯一的区别在于，你会在运行仍在进行的过程中消费事件。

在文本到达时流式传输运行

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


三个实用的规则值得关注：

- 在将本次运行视为已结束之前，请等待流处理完成。
- 如果运行因等待审批而暂停，请处理后从 `interruptions` 继续，而不是发起全新的用户轮次。 `state` ，而不是发起全新的用户轮次。
- 如果在轮次中途取消了流，请从 `state` 继续，以便稍后接着同一个轮次进行。

## 有意识地处理暂停和失败

两类重要的非正常路径结果：

- **运行时或校验失败** 例如最大轮次限制、护栏 异常或工具错误。
- **预期的暂停** 例如人工审批请求，在这种情况下运行会被有意中断，之后应从同一状态恢复。

将审批视为暂停的运行，而不是新的轮次。这一区分能使轮次计数、历史记录以及服务端管理的延续 ID 保持一致。

## 后续步骤

一旦运行时循环清晰，就可以继续阅读与你需要设计的下一个工作流边界相匹配的指南。



  [结果与状态



        Learn which result surfaces your application should carry into the next
      turn.](https://developers.openai.com/api/docs/guides/agents/results)
  [编排与交接



        决定多个智能体如何在同一个运行时循环内协同工作。](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [护栏与人工审核



        在不打断轮次连续性的前提下，添加校验和审批暂停。](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)