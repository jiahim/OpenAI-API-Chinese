# 编程工具调用

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

编程式工具调用（Programmatic Tool Calling）允许模型编写并运行 JavaScript，以协调 Responses API 请求中的工具。程序可以并行调用工具、使用循环和条件，并在托管运行时中保留中间结果。当任务需要一系列相关的工具调用，或在返回结果前需要处理大量工具输出时，这一功能非常有用。

你的应用程序决定编程式工具调用是否可用，以及模型可以调用哪些符合条件的工具——是直接调用、通过程序调用，还是两种方式均可。应用程序仍会运行任何客户端拥有的工具调用。

在启用编程式工具调用之前，请查看 [模型页面](https://developers.openai.com/api/docs/models) 。

## 了解运行时环境

OpenAI 会在全新且隔离的 V8 运行时中运行每个生成的程序。该运行时支持带有顶层 `await`，的 JavaScript，但不提供 Node.js、包安装、直接网络访问、通用文件系统、子进程执行、控制台，也不在程序执行间保留 JavaScript 状态。程序只能通过请求中启用的工具与外部系统交互，并可通过 `text(...)` 或 `image(...)`.

输出结果。编程工具调用支持零数据保留（ZDR）工作流，无需持久化的代码执行容器。必须为组织或项目启用 ZDR；设置 `store: false` 可启用无状态延续，但本身不会启用 ZDR。资格和保留取决于完整请求，包括其模型、工具和第三方服务；请参见 [数据控制](https://developers.openai.com/api/docs/guides/your-data).

## 选择何时使用编程式工具调用

当某个阶段具有可预测的控制流，且代码能返回较小的结构化结果时，使用编程式工具调用。当一次调用就足够、每个结果都需要模型重新判断，或工作需经审批或保留引用来源或原生产物时，使用直接工具调用。

| 任务形态                                                                                       | 推荐模式                                                                                                     |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 单个查找或操作                                                                        | 使用直接工具调用。                                                                                             |
| 多项结果，代码可进行筛选、连接、排序、去重、聚合或验证 | 当程序能返回更小的结构化结果时，使用程序化工具调用。                               |
| 数据流可预测的依赖调用                                                       | 当代码能推导后续参数且限制与失败行为明确时，使用程序化工具调用。 |
| 自适应搜索或语义评估                                                           | 当每个结果都应影响模型的下一步决策时，使用直接工具调用。                                 |
| 写入操作或需审批的操作                                                             | 默认使用直接工具调用，以保持明确的授权边界。                                       |
| 最终引用或原生产物验证                                                     | 除非程序保留原生输出并验证所有必需项，否则使用直接工具调用。            |

## 配置编程式工具调用

将 `programmatic_tool_calling` 托管工具添加到请求中。然后在 `allowed_callers` 上为程序可调用的每个符合条件的工具设置。

启用程序化工具调用

```json
[
  {
    "type": "function",
    "name": "get_inventory",
    "description": "Return an object with sku (string) and available_units (number).",
    "parameters": {
      "type": "object",
      "properties": {
        "sku": { "type": "string" }
      },
      "required": ["sku"],
      "additionalProperties": false
    },
    "output_schema": {
      "type": "object",
      "properties": {
        "sku": { "type": "string" },
        "available_units": { "type": "number" }
      },
      "required": ["sku", "available_units"],
      "additionalProperties": false
    },
    "allowed_callers": ["programmatic"]
  },
  {
    "type": "programmatic_tool_calling"
  }
]
```


`allowed_callers` 控制模型如何调用工具：

| 值                        | 行为                                                |
| ---------------------------- | ------------------------------------------------------- |
| 省略或 `["direct"]`      | 模型可以直接调用该工具。                   |
| `["programmatic"]`           | 只有代码中的 `program` 项才能调用该工具。        |
| `["direct", "programmatic"]` | 模型可以直接或通过程序调用该工具。 |

`parameters` 描述函数参数。当函数返回可预测的结构化数据时， `output_schema` 描述其 `function_call_output.output` 字符串中编码的 JSON 对象。同时定义二者，以便生成的 JavaScript 能可靠地使用返回的字段。

### 支持的平台

以下工具类型支持 `allowed_callers: ["programmatic"]`:

- `function` 以及 `custom`
- `mcp`
- `apply_patch`
- 本地和托管 `shell`
- `code_interpreter`

对于 MCP 工具，该工具的 `require_approval` 策略可以暂停程序，直到你批准该调用。

对于 OpenAI 托管的工具，在程序中启用前，请查阅工具的数据保留和安全指南。

### 与工具搜索结合

[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 作为顶层 Responses API 工具运行，而不是从生成的 JavaScript 内部运行。具有 `defer_loading: true` 的函数、自定义和 MCP 工具最初不适用于程序。模型加载匹配的工具后，后续程序可通过 `tools.*` 在其 `allowed_callers` 包含 `"programmatic"`。时调用它。已运行的程序无法调用工具搜索，因此模型必须在启动需要它们的程序之前加载延迟工具。

## 两种模式均可用时的指南路由

当你的应用程序允许模型直接或从程序调用某个函数时，请将每条路由分配给特定的工作流阶段。像“高效使用程序化工具调用”这样的通用指令并不能指明预期的边界。例如：

```text
<tool_orchestration>
Use Programmatic Tool Calling for [bounded stage] using only [eligible tools].
Run independent calls concurrently when safe. Use only documented tool input
and output fields.

Process and reduce the intermediate results, then emit exactly [program result shape],
including the evidence needed for the final answer.

Stop when [condition] is met. Retry transient failures at most [R] times.
Do not repeat completed calls or perform side-effecting actions. If a required
result is still missing, return a clear structured failure.

Use direct tool calls for [semantic judgment, approval, or final validation].
</tool_orchestration>
```

以下是使用此模板的示例：

```text
<tool_orchestration>
Use Programmatic Tool Calling to compare inventory with demand for sku_123
using only get_inventory and get_demand. Run both calls concurrently. Use
only documented tool input and output fields.

Process and reduce the intermediate results, then emit exactly one JSON object
with sku, available_units, requested_units, and shortage_units, where
shortage_units is max(requested_units - available_units, 0). Include
available_units and requested_units as evidence for the calculation.

Stop when both tool results contain the required fields. Retry transient
failures at most 1 time. Do not repeat completed calls or perform
side-effecting actions. If a required result is still missing, return a clear
structured failure.

Use direct tool calls only for approval before any inventory-changing action.
</tool_orchestration>
```

对于需要两种模式的工作流，请定义一个交接，并避免切换路由或重复工作。如果存在安全的回退方案，请定义一次并限制其重试次数。

## 了解程序响应条目

每次 API 调用仍返回标准的 [Responses API 对象](https://developers.openai.com/api/reference/resources/responses/methods/create)。程序化工具调用不会引入单独的响应封装。当模型使用程序化工具调用时，响应的 `output` 数组可以包含：

- 一个 `program` 包含所生成 JavaScript 的条目、一个 `call_id`，以及一个不透明的 `fingerprint` ，用于恢复或重放该程序。
- 一个 `function_call` 由程序创建的条目。它有自己的 `call_id`，你的应用程序用它来返回函数结果。它的 `caller.caller_id` 与程序的 `call_id`.
- 一个 `program_output` 包含程序最终结果和状态的条目。它的 `call_id` 与程序的 `call_id`，匹配，且其 `status` 为 `completed` 或 `incomplete`.

这些是独立的顶级项，位于 `response.output`； `caller` 字段记录它们的执行关系。

例如，程序可以在你的应用运行时暂停， `get_inventory` 以及 `get_demand`:

Program 和嵌套函数调用

```json
[
  {
    "type": "program",
    "id": "prog_123",
    "call_id": "call_prog_123",
    "code": "const [stock, demand] = await Promise.all([tools.get_inventory({ sku: 'sku_123' }), tools.get_demand({ sku: 'sku_123' })]); text(JSON.stringify({ sku: stock.sku, available_units: stock.available_units, requested_units: demand.requested_units, shortage_units: Math.max(demand.requested_units - stock.available_units, 0) }));",
    "fingerprint": "opaque_replay_state"
  },
  {
    "type": "function_call",
    "id": "fc_123",
    "call_id": "call_inventory_123",
    "name": "get_inventory",
    "arguments": "{\\"sku\\":\\"sku_123\\"}",
    "caller": {
      "type": "program",
      "caller_id": "call_prog_123"
    }
  },
  {
    "type": "function_call",
    "id": "fc_456",
    "call_id": "call_demand_123",
    "name": "get_demand",
    "arguments": "{\\"sku\\":\\"sku_123\\"}",
    "caller": {
      "type": "program",
      "caller_id": "call_prog_123"
    }
  }
]
```


这些示例仅展示了来自 `response.output`；的相关项；它们省略了周围的标准 Responses 对象。在你的应用返回嵌套函数结果后，后续响应可以包含完整的 `program_output` 项：

Program 输出

```json
{
  "type": "program_output",
  "id": "prog_out_123",
  "call_id": "call_prog_123",
  "result": "{\\"sku\\":\\"sku_123\\",\\"available_units\\":42,\\"requested_units\\":31,\\"shortage_units\\":0}",
  "status": "completed"
}
```


中的 JSON 字符串 `program_output.result` 遵循你指令中的程序结果形状。周围的 `program_output` 项遵循上述 API 契约。这些是独立的契约。最终的 `message` 可以随程序输出或稍后的响应到达，因此请持续处理，直到收到该消息。

OpenAI 在托管运行时中运行模型生成的 JavaScript。你的应用执行返回的客户端拥有的函数调用；它不执行生成的 JavaScript。

将函数结果作为 `function_call_output`。返回。复制 `caller` ，不要修改。服务使用该值来恢复正确的程序。

## 在客户端拥有的函数调用后继续

当程序到达客户端拥有的工具时，它可以暂停多次。持续直到响应包含最终助手消息：

1. 使用允许编程调用的 托管工具和函数发送请求。
1. 运行每个返回的客户端拥有的函数调用。
1. 将每个函数结果与原始 `call_id` 和 `caller`.
1. 在继续之前处理不完整的响应。
1. 如果响应中没有待处理的 `function_call` 项且没有最终的 `message` 项，则从该响应继续。使用 `store: false`，重放其输出项；对于存储的响应，使用 `previous_response_id`.
1. 当响应包含最终的 `message` 项时停止。读取 `response.output_text` 或消息的拒绝内容。

以下示例使用 `store: false`，保留每个响应条目，并将每个函数结果返回给程序：

运行程序化工具调用循环

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const implementations = {
  get_inventory: async ({ sku }) => ({ sku, available_units: 42 }),
  get_demand: async ({ sku }) => ({ sku, requested_units: 31 }),
};

/** @type {OpenAI.Responses.Tool[]} */
const tools = [
  {
    type: "function",
    name: "get_inventory",
    description:
      "Return an object with sku (string) and available_units (number).",
    parameters: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"],
      additionalProperties: false,
    },
    output_schema: {
      type: "object",
      properties: {
        sku: { type: "string" },
        available_units: { type: "number" },
      },
      required: ["sku", "available_units"],
      additionalProperties: false,
    },
    allowed_callers: ["programmatic"],
    strict: true,
  },
  {
    type: "function",
    name: "get_demand",
    description:
      "Return an object with sku (string) and requested_units (number).",
    parameters: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"],
      additionalProperties: false,
    },
    output_schema: {
      type: "object",
      properties: {
        sku: { type: "string" },
        requested_units: { type: "number" },
      },
      required: ["sku", "requested_units"],
      additionalProperties: false,
    },
    allowed_callers: ["programmatic"],
    strict: true,
  },
  { type: "programmatic_tool_calling" },
];

/** @type {OpenAI.Responses.ResponseInput} */
const input = [
  {
    role: "user",
    content: "Compare inventory with demand for sku_123.",
  },
];

while (true) {
  const response = await client.responses.create({
    model: "YOUR_MODEL_ID",
    store: false,
    input,
    tools,
  });

  if (response.status !== "completed") {
    throw new Error(`Response ended with status ${response.status}`);
  }

  // Preserve every output item, including program and reasoning items.
  input.push(...response.output);

  const calls = response.output.filter((item) => item.type === "function_call");

  if (calls.length === 0) {
    const message = response.output.find((item) => item.type === "message");
    if (message) {
      const refusal = message.content.find((part) => part.type === "refusal");
      console.log(response.output_text || refusal?.refusal || "");
      break;
    }
    continue;
  }

  const outputs = await Promise.all(
    calls.map(async (call) => {
      const run = implementations[call.name];
      if (!run) throw new Error(`Unknown tool: ${call.name}`);

      const result = await run(JSON.parse(call.arguments));
      return /** @type {const} */ ({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
        // Preserve caller so the runtime can resume the correct program.
        caller: call.caller,
      });
    })
  );

  input.push(...outputs);
}
```

```python
import json

from openai import OpenAI

client = OpenAI()
model = "gpt-5.6"


def get_inventory(sku):
    return {"sku": sku, "available_units": 42}


def get_demand(sku):
    return {"sku": sku, "requested_units": 31}


implementations = {
    "get_inventory": get_inventory,
    "get_demand": get_demand,
}

tools = [
    {
        "type": "function",
        "name": "get_inventory",
        "description": "Return an object with sku (string) and available_units (number).",
        "parameters": {
            "type": "object",
            "properties": {"sku": {"type": "string"}},
            "required": ["sku"],
            "additionalProperties": False,
        },
        "output_schema": {
            "type": "object",
            "properties": {
                "sku": {"type": "string"},
                "available_units": {"type": "number"},
            },
            "required": ["sku", "available_units"],
            "additionalProperties": False,
        },
        "allowed_callers": ["programmatic"],
    },
    {
        "type": "function",
        "name": "get_demand",
        "description": "Return an object with sku (string) and requested_units (number).",
        "parameters": {
            "type": "object",
            "properties": {"sku": {"type": "string"}},
            "required": ["sku"],
            "additionalProperties": False,
        },
        "output_schema": {
            "type": "object",
            "properties": {
                "sku": {"type": "string"},
                "requested_units": {"type": "number"},
            },
            "required": ["sku", "requested_units"],
            "additionalProperties": False,
        },
        "allowed_callers": ["programmatic"],
    },
    {"type": "programmatic_tool_calling"},
]

input_items = [
    {
        "role": "user",
        "content": "Compare inventory with demand for sku_123.",
    }
]

while True:
    response = client.responses.create(
        model=model,
        store=False,
        input=input_items,
        tools=tools,
    )

    if response.status != "completed":
        raise RuntimeError(f"Response ended with status {response.status}")

    # Preserve every output item, including program and reasoning items.
    input_items.extend(item.model_dump(exclude_none=True) for item in response.output)

    calls = [item for item in response.output if item.type == "function_call"]
    if not calls:
        message = next(
            (item for item in response.output if item.type == "message"), None
        )
        if message:
            refusal = next(
                (part.refusal for part in message.content if part.type == "refusal"),
                "",
            )
            print(response.output_text or refusal)
            break
        continue

    for call in calls:
        run = implementations.get(call.name)
        if run is None:
            raise ValueError(f"Unknown tool: {call.name}")

        result = run(**json.loads(call.arguments))
        input_items.append(
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result),
                # Preserve caller so the runtime can resume the correct program.
                "caller": call.caller.model_dump() if call.caller else None,
            }
        )
```


存储响应后，你可以从 `previous_response_id` 继续，而无需重新发送所有较早的响应条目。将新的 `function_call_output` 条目作为下一个输入。使用 `store: false`，时，按顺序重放完整序列，包括每个 `program`、推理、函数调用、函数调用输出，以及 `program_output` 条目。

对于无状态推理模型请求，重放每个返回的推理条目。每个条目默认包含 `encrypted_content` 。请参阅 [对话状态](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) 了解通用的无状态模式。

## 为程序设计工具

- 返回结构化、紧凑的数据，让 JavaScript 无需解析叙述文本即可检查。
- 使用 `output_schema` 来定义每个工具的预期返回字段和类型，并记录其错误行为。如果返回结构事先未知，请保持工具直接，以便模型可以检查结果。
- 定义确切的程序结果结构和所需证据。当程序无法生成有效结果时，返回清晰的结构化失败信息。
- 尽可能使函数调用幂等。重试或重放不应重复不安全的副作用。
- 即使调用来自托管程序，也要在你的应用程序中检查每次调用的参数和权限。
- 为工具提供具体的名称和描述，以便模型能够正确组合它们。
- 无论调用者是谁，在高影响操作前都要求应用程序级别的批准。

{/* vale Vale.Terms = NO */}

## 评估编程式工具调用

程序化工具调用可以减少添加到模型上下文中的中间工具输出量，但效果取决于任务和工具响应。以直接工具调用作为基线开始，然后在代表性任务上比较这两种方法。

在衡量效率之前，定义最终答案的质量标准和所需证据。评估令牌使用和工具调用，同时评估正确性、完整性和证据覆盖范围，并对任何接受的质量权衡进行明确说明。

{/* vale Vale.Terms = YES */}

衡量：

- 最终答案的正确性、完整性以及证据覆盖范围。
- 输入和总 token 数、端到端延迟以及成本。
- 模型回合、工具调用、重试以及恢复行为。
- 安全结果，尤其是副作用和审批要求方面的结果。
- 实际运行的路由是否与预期的 工作流 阶段相匹配。

## 相关指南

- 使用 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 来定义客户端拥有的函数。
- 使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 来延迟加载大型工具定义，直到模型需要它们。
- 使用 [对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 来延续存储的或无状态的 Responses API 请求。
- 在选择存储模式之前，请查看 [数据控制](https://developers.openai.com/api/docs/guides/your-data) 。