# 护栏与人工审核

> 完整的文档索引请参见 [llms.txt](/llms.txt)。你可以在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

使用护栏进行自动检查，并使用人工审核进行审批决策。两者共同决定运行应继续、暂停还是停止。

- **护栏** 自动校验输入、输出或工具行为。
- **人工审核** 暂停运行，以便由人或策略审批或拒绝敏感操作。

## 选择合适的控件

| 用例                                                                                      | 起点                  |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| 在主模型运行之前阻止不允许的用户请求                                     | 输入护栏            |
| 在最终输出离开系统之前对其进行校验或脱敏                               | 输出护栏           |
| 在函数工具调用前后检查参数或结果                                        | 工具护栏             |
| 在取消、编辑、shell 命令或敏感的 MCP 操作等副作用之前暂停 | 人在回路审批 |

## 添加阻塞式护栏

当希望在工作流中昂贵或会产生副作用的部分启动之前运行一个快速的验证步骤时，请使用输入护栏。

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


当启动主智能体的代价或风险过高时，使用阻塞执行。当更低的延迟比避免推测性工作更重要时，使用并行护栏。

## Pause for human review

审批是工具调用的人工介入路径。模型仍然可以判断某个操作是必要的，但运行会暂停，直到你批准或拒绝它。

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


即使审批工具位于更深的 工作流 中，例如在某次 交接 之后或嵌套在某个 `agent.asTool()` 的 TypeScript 或 `agent.as_tool()` 的 Python 调用中，同样适用这一中断模式。

## 审批生命周期

当工具调用需要审核时，SDK 每次都遵循相同的模式：

1. 运行会记录一次审批中断，而不是执行该工具。
2. 结果会返回 `interruptions` 以及一个可恢复的 `state`.
3. 你的应用审批或拒绝待处理项。
4. 从 `state` 恢复同一运行，而不是开启新的用户轮次。

如果审查可能耗时，请将其序列化 `state`、存储，并在之后恢复。这仍然属于同一轮运行。

## 工作流边界很重要

智能体 级别的护栏并非在所有地方都会运行：

- 输入护栏仅对链中的第一个智能体运行。
- 输出护栏仅对生成最终输出的智能体运行。
- 工具护栏在它们所附加到的函数工具上运行。

如果需要在管理者风格的工作流中对每次自定义工具调用进行检查，不要仅依赖智能体级别的输入或输出护栏。请将校验逻辑放在创建副作用的工具旁边。

## 在执行前审查网络安全操作

在已获授权的网络安全工作流中，需在每次敏感工具调用执行前对其进行评估。
使用工具护栏和审批中断机制，在产生副作用的边界处强制执行
书面约定的评估范围：

1. 核对提议的目标、操作、工具参数、调用身份以及
   参与窗口与已批准范围是否一致。
2. 将完全相同的提议操作和
   仅供评估所需的上下文交给独立的策略组件或审核者。
3. 拒绝超出范围的主机、凭据窃取、持久化、数据外泄、
   破坏性变更、生产访问以及试图绕过策略的行为。
4. 在工具运行前，将模糊或高风险操作暂停，以等待明确的人工审批
   后再继续。
5. 强制实施独立的文件系统、网络、身份和项目边界，
   记录决策和执行结果，并在审核超时
   或不可用时采用失败关闭策略。

Responses API 和 Agents SDK 应用不会自动继承
[Codex Auto-review](https://developers.openai.com/codex/sandboxing/auto-review)。请将审核和强制执行机制添加到你自己的框架中。
下面的
[开源 Codex reviewer 策略](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy.md)
展示了一种实现思路。访问 [Models and Trusted Access](https://developers.openai.com/codex/cyber-safety)
以了解经审核的模型访问方式，并参考 [Recommended configuration](https://developers.openai.com/codex/cyber-safety/recommended-configuration)
完成安全的接入配置。

## 流式输出和延迟审阅使用相同的状态模型

流式传输不会创建单独的审批系统。如果某个流式运行的暂停，请等待其稳定后，检查 `interruptions`，解决审批问题，并从同一个 `state`。处恢复。如果审批稍后才发生，请存储序列化后的状态，并在决策到达时继续同一个运行。

## Next steps

一旦控制边界清晰，就可以继续阅读涵盖其运行时或工具表面的指南。



  [运行 智能体



        了解中断和恢复如何融入运行时循环。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [结果与状态



        了解暂停的运行会向你的应用返回哪些结果。](https://developers.openai.com/api/docs/guides/agents/results)
  [使用工具



        Decide which tool surfaces need validation or approval before side effects
      happen.](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)