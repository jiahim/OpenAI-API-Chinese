# 护栏与人工审核

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的Markdown版本可通过在页面URL后追加 `.md` 来获取。

使用护栏进行自动检查，并通过人工审查来做出批准决定。两者共同定义运行何时应继续、暂停或停止。

- **护栏** 自动验证输入、输出或工具行为。
- **人工审核** 暂停运行，以便人员或策略批准或拒绝敏感操作。

## 选择合适的控件

| 使用场景                                                                                      | 首先使用                  |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| 在主模型运行前阻止不允许的用户请求                                     | 输入护栏            |
| 在最终输出离开系统之前验证或编辑                               | 输出护栏           |
| 检查函数工具调用的参数或结果                                        | 工具护栏             |
| 在取消、编辑、shell 命令或敏感 MCP 操作等副作用前暂停 | 人工审批 |

## 添加阻塞式护栏

当你希望在代价高昂或产生副作用的工作流部分开始之前运行快速验证步骤时，请使用输入护栏。

使用输入护栏阻止请求

```javascript
import { Agent, InputGuardrailTripwireTriggered, run } from "@openai/agents";
import { z } from "zod";

const guardrailAgent = new Agent({
  name: "Homework check",
  instructions: "Detect whether the user is asking for math homework help.",
  outputType: z.object({
    isMathHomework: z.boolean(),
    reasoning: z.string(),
  }),
});

const agent = new Agent({
  name: "Customer support",
  instructions: "Help customers with support questions.",
  inputGuardrails: [
    {
      name: "Math homework guardrail",
      runInParallel: false,
      async execute({ input, context }) {
        const result = await run(guardrailAgent, input, { context });
        return {
          outputInfo: result.finalOutput,
          tripwireTriggered: result.finalOutput?.isMathHomework === true,
        };
      },
    },
  ],
});

try {
  await run(agent, "Can you solve 2x + 3 = 11 for me?");
} catch (error) {
  if (error instanceof InputGuardrailTripwireTriggered) {
    console.log("Guardrail blocked the request.");
  }
}
```

```python
import asyncio

from pydantic import BaseModel

from agents import (
    Agent,
    GuardrailFunctionOutput,
    InputGuardrailTripwireTriggered,
    RunContextWrapper,
    Runner,
    TResponseInputItem,
    input_guardrail,
)


class MathHomeworkOutput(BaseModel):
    is_math_homework: bool
    reasoning: str


guardrail_agent = Agent(
    name="Homework check",
    instructions="Detect whether the user is asking for math homework help.",
    output_type=MathHomeworkOutput,
)


@input_guardrail
async def math_guardrail(
    ctx: RunContextWrapper[None],
    agent: Agent,
    input: str | list[TResponseInputItem],
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input, context=ctx.context)
    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_math_homework,
    )


agent = Agent(
    name="Customer support",
    instructions="Help customers with support questions.",
    input_guardrails=[math_guardrail],
)


async def main() -> None:
    try:
        await Runner.run(agent, "Can you solve 2x + 3 = 11 for me?")
    except InputGuardrailTripwireTriggered:
        print("Guardrail blocked the request.")


if __name__ == "__main__":
    asyncio.run(main())
```


当启动主智能体的成本或风险过高时，请使用阻塞式执行。当低延迟比避免投机性工作更重要时，请使用并行护栏。

## 暂停以进行人工审查

审批是工具调用的人工介入路径。模型仍可决定需要执行某个操作，但运行会暂停，直到你批准或拒绝。

在敏感操作前暂停以等待审批

```javascript
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const cancelOrder = tool({
  name: "cancel_order",
  description: "Cancel a customer order.",
  parameters: z.object({ orderId: z.number() }),
  needsApproval: true,
  async execute({ orderId }) {
    return `Cancelled order ${orderId}`;
  },
});

const agent = new Agent({
  name: "Support agent",
  instructions: "Handle support requests and ask for approval when needed.",
  tools: [cancelOrder],
});

let result = await run(agent, "Cancel order 123.");

if (result.interruptions?.length) {
  const state = result.state;
  for (const interruption of result.interruptions) {
    state.approve(interruption);
  }
  result = await run(agent, state);
}

console.log(result.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner, function_tool


@function_tool(needs_approval=True)
async def cancel_order(order_id: int) -> str:
    return f"Cancelled order {order_id}"


agent = Agent(
    name="Support agent",
    instructions="Handle support requests and ask for approval when needed.",
    tools=[cancel_order],
)


async def main() -> None:
    result = await Runner.run(agent, "Cancel order 123.")

    if result.interruptions:
        state = result.to_state()
        for interruption in result.interruptions:
            state.approve(interruption)
        result = await Runner.run(agent, state)

    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


即使审批工具位于工作流的更深处，例如在交接之后或在嵌套的 `agent.asTool()` TypeScript 中的 `agent.as_tool()` Python 调用中，这种相同的中断模式也同样适用。

## 审批生命周期

当工具调用需要审核时，SDK每次都会遵循相同的模式：

1. 运行记录一个审批中断，而不是执行该工具。
2. 结果返回 `interruptions` 以及一个可恢复的 `state`.
3. 你的应用程序批准或拒绝待处理项目。
4. 你从 `state` 继续同一运行，而不是开启新的用户轮次。

如果审查可能需要花费时间，可将其序列化 `state`，并存储，之后再恢复。这仍然是同一运行。

## 工作流边界很重要

智能体级护栏并非在所有地方都运行：

- 输入护栏仅对链中的第一个智能体运行。
- 输出护栏仅对生成最终输出的智能体运行。
- 工具护栏在其附加的函数工具上运行。

如果你需要在管理器式工作流中对每次自定义工具调用进行检查，不要只依赖智能体级别的输入或输出护栏。在产生副作用的工具旁边放置验证。

## 执行前审查网络安全操作

对于经授权的网络安全工作流，请评估每个敏感的工具调用
在其执行之前。使用工具护栏和批准中断来强制执行
在发生副作用边界处书面的参与范围：

1. 对照批准的范围内检查提议的目标、操作、工具参数、调用身份以及
   参与窗口。
2. 向独立的政策组件或审查者提供确切提议的操作以及
   仅评估所需的上下文。
3. 拒绝范围外的主机、凭证盗窃、持久化、数据外泄、
   破坏性修改、生产访问以及尝试绕过政策的行为。
4. 在工具运行前，暂停模糊或高风险操作以获取明确的人工批准。
   工具运行。
5. 强制独立的文件系统、网络、身份和项目边界，
   记录决策和执行结果，如果审查超时
   或不可用，则失败关闭。

Responses API 和 Agents SDK 应用不会自动继承
[Codex 自动审查](https://developers.openai.com/codex/sandboxing/auto-review)。请在你的自有工具框架中添加审查与执行
。开源
[Codex 审查者策略](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy.md)
演示了一种方法。请参阅 [模型与可信访问](https://developers.openai.com/codex/cyber-safety)
以获取经批准的模型访问，以及 [推荐配置](https://developers.openai.com/codex/cyber-safety/recommended-configuration)
以进行安全的交互设置。

## 流式传输和延迟审查使用相同的状态模型

流式传输不会创建单独的审批系统。如果流式运行暂停，请等待其稳定，检查 `interruptions`，解决审批事项，并从相同的 `state`。处继续。如果审查稍后进行，请存储序列化状态，并在决策到达时继续同一运行。

## 后续步骤

一旦控制边界明确，请继续阅读涵盖其运行时或工具界面的指南。



  [运行智能体



        了解中断和恢复如何融入运行时循环。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [结果与状态



        了解暂停的运行会将哪些结果返回给你的应用程序。](https://developers.openai.com/api/docs/guides/agents/results)
  [使用工具



        Decide which tool surfaces need validation or approval before side effects
      happen.](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)