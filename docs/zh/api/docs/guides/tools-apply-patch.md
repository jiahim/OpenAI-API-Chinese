# Apply Patch

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 获取。

该 `apply_patch` tool 让 GPT-5.1 能够使用结构化差异在你的代码库中创建、更新和删除文件。模型不只是建议编辑，而是发出补丁操作，由你的应用执行后再回报结果，从而实现迭代式的多步代码编辑工作流。

## 何时使用

一些常见的使用 apply_patch 的场景：

- **多文件重构** – 一次性跨多个文件重命名符号、提取辅助函数或重新组织模块。
- **Bug 修复** – 让模型既诊断问题又生成精确的补丁。
- **测试与文档生成** – 在代码改动的同时新建测试文件、测试数据和文档。
- **迁移与机械性修改** – 应用重复且结构化的更新（API 迁移、类型注解、格式修正等）。

如果你能用自己的语言描述代码仓库和所需的更改，apply_patch 通常就能生成相应的 diff。

## 使用 apply patch 工具与 Responses API

从较高的层面来看，使用 `apply_patch` 与 Responses API 配合时，整体流程如下：

1. **调用 Responses API 并传入 `apply_patch` tool**
   - 为模型提供有关可用文件（或摘要）的上下文，放在你的 `input`，中，或为模型提供用于浏览文件系统的工具。
   - 使用以下方式启用该工具 `tools=[{"type": "apply_patch"}]`.
2. **让模型返回一个或多个 patch 操作**
   - Response 输出包含一个或多个 `apply_patch_call` 对象。
   - 每次调用描述一次文件操作：创建、更新或删除。
3. **在你的环境中应用 patch**
   - 运行一个 patch 执行框架或脚本，用于：
     - 解析每个 `operation` 对应的 diff `apply_patch_call`.
     - 将 patch 应用到你的工作目录或代码仓库。
     - 记录每次 patch 是否成功以及任何日志或错误信息。
4. **将 patch 结果回传给模型**
   - 再次调用 Responses API，可以传入 `previous_response_id` ，或将你的对话项传回给 `input`.
   - 为每个 `apply_patch_call_output` 事件 `call_id`，并附带一个 `status` 以及可选的 `output` 字符串。
   - 保留 `tools=[{"type": "apply_patch"}]` ，以便模型在需要时可以继续编辑。
5. **让模型继续或解释所做的更改**
   - 模型可能会发出更多 `apply_patch_call` 操作，或者
   - 提供面向用户的解释，说明它修改了什么以及为什么修改。

## 示例：使用 Apply Patch Tool 重命名函数

**步骤 1：让模型规划并输出补丁**

让模型规划并输出补丁

```javascript
const response = await client.responses.create({
  model: "gpt-5.6",
  input: fileContext,
  tools: [{ type: "apply_patch" }],
});

const patchCalls = response.output.filter(
  (item) => item.type === "apply_patch_call"
);
```

```python
from openai import OpenAI

client = OpenAI()

# For brevity, we are including file context in the example input.
# Most agentic use cases should instead equip the model with tools
# for exploring file system state.
RESPONSE_INPUT = """
The user has the following files:
<BEGIN_FILES>
===== lib/fib.py
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

===== run.py
from lib.fib import fib

def main():
  print(fib(42))
<END_FILES>

You are a helpful coding assistant that should assist the user with whatever they
ask.

User query:
Help me rename the fib() function to fibonacci()
"""

response = client.responses.create(
    model="gpt-5.6",
    input=RESPONSE_INPUT,
    tools=[{"type": "apply_patch"}],
)

# response.output may contain multiple apply_patch_call entries, e.g.:
# - update lib/fib.py
# - update run.py
patch_calls = [
    item.model_dump() for item in response.output if item.type == "apply_patch_call"
]
```

```go
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model: "gpt-5.6",
	Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(responseInput)},
	Tools: []responses.ToolUnionParam{{OfApplyPatch: &responses.ApplyPatchToolParam{}}},
})
if err != nil {
	panic(err)
}
patchCalls := make([]responses.ResponseOutputItemUnion, 0)
for _, item := range response.Output {
	if item.Type == "apply_patch_call" {
		patchCalls = append(patchCalls, item)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ApplyPatchTool;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Rename fib() to fibonacci() in lib/fib.py and update run.py to use the new name.")
        .addTool(ApplyPatchTool.builder().build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.applyPatchCall().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Rename fib() to fibonacci() in lib/fib.py and update run.py to use the new name.",
  tools: [{type: :apply_patch}]
)

patch_calls = response.output.select { |item| item.type == :apply_patch_call }
puts(patch_calls)
```


**示例 `apply_patch_call` object**

apply_patch_call object 示例

```json
{
    "id": "apc_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe",
    "type": "apply_patch_call",
    "status": "completed",
    "call_id": "call_Rjsqzz96C5xzPb0jUWJFRTNW",
    "operation": {
        "type": "update_file",
        "diff": "
@@
-def fib(n):
+def fibonacci(n):
    if n <= 1:
        return n
-    return fib(n-1) + fib(n-2)                                                  +    return fibonacci(n-1) + fibonacci(n-2),
",
        "path": "lib/fib.py"
    }
}
```


**步骤 2：应用补丁并将结果发回**

应用补丁并返回结果

```javascript
/** @type {import("openai/resources/responses/responses").ResponseInput} */
const results = patchCalls.map((call) => {
  const { success, output } = applyOperation(call.operation);

  return {
    type: "apply_patch_call_output",
    call_id: call.call_id,
    status: success ? "completed" : "failed",
    output,
  };
});

const followup = await client.responses.create({
  model: "gpt-5.6",
  previous_response_id: response.id,
  input: results,
  tools: [{ type: "apply_patch" }],
});

console.log(followup.output_text);
```

```python
from apply_patch_harness import apply_operation  # your implementation

results = []
for call in patch_calls:
    op = call["operation"]
    success, maybe_log_output = apply_operation(op)

    results.append(
        {
            "type": "apply_patch_call_output",
            "call_id": call["call_id"],
            "status": "completed" if success else "failed",
            "output": maybe_log_output,
        }
    )

followup = client.responses.create(
    model="gpt-5.6",
    previous_response_id=response.id,
    input=results,
    tools=[{"type": "apply_patch"}],
)
```

```go
results := make(responses.ResponseInputParam, 0, len(patchCalls))
for _, call := range patchCalls {
	success, logOutput := applyOperation(call.Operation)
	status := "completed"
	if !success {
		status = "failed"
	}
	result := responses.ResponseInputItemParamOfApplyPatchCallOutput(call.CallID, status)
	result.OfApplyPatchCallOutput.Output = openai.String(logOutput)
	results = append(results, result)
}
_, err = client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model:              "gpt-5.6",
	PreviousResponseID: openai.String(response.ID),
	Input:              responses.ResponseNewParamsInputUnion{OfInputItemList: results},
	Tools:              []responses.ToolUnionParam{{OfApplyPatch: &responses.ApplyPatchToolParam{}}},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ApplyPatchTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofApplyPatchCallOutput(
                    ResponseInputItem.ApplyPatchCallOutput.builder()
                        .callId(System.getenv("OPENAI_EXAMPLE_APPLY_PATCH_CALL_ID"))
                        .status(ResponseInputItem.ApplyPatchCallOutput.Status.COMPLETED)
                        .output("Patch applied successfully.")
                        .build())))
        .previousResponseId(System.getenv("OPENAI_EXAMPLE_PREVIOUS_RESPONSE_ID"))
        .addTool(ApplyPatchTool.builder().build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response_id = ENV.fetch("OPENAI_RESPONSE_ID")
patch_call_id = ENV.fetch("OPENAI_APPLY_PATCH_CALL_ID")
response = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: response_id,
  input: [{
    type: :apply_patch_call_output,
    call_id: patch_call_id,
    status: :completed,
    output: "Patch applied successfully."
  }],
  tools: [{type: :apply_patch}]
)

puts(response.output_text)
```


如果补丁应用失败（例如，找不到文件），设置 `status: "failed"` 并附上一条有帮助的 `output` 字符串，以便模型能够恢复：

报告失败的 apply_patch 调用

```json
{
  "type": "apply_patch_call_output",
  "call_id": "call_cNWm41dB3RyQcLNOVTIPBWZU",
  "status": "failed",
  "output": "Could not apply patch to lib/foo.py — file not found on disk"
}
```


## 应用补丁操作

| 操作类型 | 用途                            | 载荷                                                          |
| -------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `create_file`  | 在以下路径创建新文件 `path`.       | `diff` 是一个 V4A diff，表示文件的完整内容。        |
| `update_file`  | 修改现有文件，路径 `path`. | `diff` 是一个 V4A diff，包含新增、删除或替换操作。 |
| `delete_file`  | 删除文件，路径 `path`.           | 无 `diff`；完全删除该文件。                             |

你的补丁工具负责解析 V4A diff 格式并应用更改。参考实现可参见 [Python Agents SDK](https://github.com/openai/openai-agents-python/blob/main/src/agents/apply_diff.py) 或 [TypeScript Agents SDK](https://github.com/openai/openai-agents-js/blob/main/packages/agents-core/src/utils/applyDiff.ts) 代码。

## 实现补丁测试框架

当使用 `apply_patch` 工具时，你不需要提供输入架构；模型知道如何构造 `operation` 对象。你的工作是：

1. **从 Response 中解析操作**
   - 扫描 Response 中具有以下特征的条目 `type: "apply_patch_call"`.
   - 对于每个调用，检查 `operation.type`, `operation.path`，以及任何潜在的 `diff`.
2. **应用文件操作**
   - 对于 `create_file` 和 `update_file`，将 V4A 差异应用到文件系统或内存工作区。
   - 对于 `delete_file`，删除位于以下位置的文件 `path`.
   - 记录每个操作是否成功，以及任何日志或错误消息。
3. **返回 `apply_patch_call_output` 事件**
   - 对于每个 `call_id`，发出恰好一个 `apply_patch_call_output` 事件，其中包含：
     - `status: "completed"` 如果操作已成功应用。
     - `status: "failed"` 如果你遇到错误（包含一个简短的人类可读的 `output` 字符串）。

### 安全性与稳健性

- **Path validation**: 防止目录遍历，并将编辑限制在允许的目录内。
- **Backups**: 在应用补丁前，考虑备份文件（或在临时副本中操作）。
- **Error handling**: 始终返回一个 `failed` 状态，并附带信息性的 `output` 字符串，说明补丁无法应用的原因。
- **Atomicity**: 决定你是需要“全有或全无”的语义（任何补丁失败即回滚），还是按文件判断成功或失败。

## 使用 apply patch 工具配合 Agents SDK

或者，你也可以使用 [Agents SDK](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 来使用 apply patch 工具。你仍然需要实现处理实际文件操作的脚手架，但你可以使用 `applyDiff` 函数来处理 diff 处理。

通过 Agents SDK 使用 apply patch 工具

```javascript
import { applyDiff, Agent, run, applyPatchTool } from "@openai/agents";

class WorkspaceEditor {
  /** @returns {Promise<import("@openai/agents").ApplyPatchResult>} */
  async createFile(operation) {
    // convert the diff to the file content
    const content = applyDiff("", operation.diff, "create");
    // write the file content to the file system
    return { status: "completed", output: `Created ${operation.path}` };
  }

  /** @returns {Promise<import("@openai/agents").ApplyPatchResult>} */
  async updateFile(operation) {
    // read the file content from the file system
    const current = "";
    // convert the diff to the new file content
    const newContent = applyDiff(current, operation.diff);
    // write the updated file content to the file system
    return { status: "completed", output: `Updated ${operation.path}` };
  }

  /** @returns {Promise<import("@openai/agents").ApplyPatchResult>} */
  async deleteFile(operation) {
    // delete the file from the file system
    return { status: "completed", output: `Deleted ${operation.path}` };
  }
}

const editor = new WorkspaceEditor();

const agent = new Agent({
  name: "Patch Assistant",
  model: "gpt-5.6",
  instructions:
    "You can edit files inside the /tmp directory using the apply_patch tool.",
  tools: [
    applyPatchTool({
      editor,
      // could also be a function for you to determine if approval is needed
      needsApproval: true,
      onApproval: async (_ctx, _approvalItem) => {
        // create your own approval logic
        return { approve: true };
      },
    }),
  ],
});

const result = await run(
  agent,
  "Create tasks.md with a shopping checklist of 5 entries."
);

console.log(`\nFinal response:\n${result.finalOutput}`);
```

```python
from agents import Agent, ApplyPatchTool, Runner, apply_diff


class WorkspaceEditor:
    async def create_file(self, operation):
        # convert the diff to the file content
        content = apply_diff("", operation.diff, mode="create")
        # write the file content to the file system
        return {"status": "completed", "output": f"Created {operation.path}"}

    async def update_file(self, operation):
        # read the file content from the file system
        current = ""
        # convert the diff to the new file content
        new_content = apply_diff(current, operation.diff)
        # write the updated file content to the file system
        return {"status": "completed", "output": f"Updated {operation.path}"}

    async def delete_file(self, operation):
        # delete the file from the file system
        return {"status": "completed", "output": f"Deleted {operation.path}"}


editor = WorkspaceEditor()

agent = Agent(
    name="Patch Assistant",
    model="gpt-5.6",
    instructions="You can edit files inside the /tmp directory using the apply_patch tool.",
    tools=[
        ApplyPatchTool(
            editor=editor,
            # could also be a function for you to determine if approval is needed
            needs_approval=True,
            # Implement your own approval logic
            on_approval=lambda _ctx, _approval_item: {"approve": True},
        ),
    ],
)


async def main():
    result = await Runner.run(
        agent,
        input="Create tasks.md with a shopping checklist of 5 entries.",
    )

    print(f"\nFinal response:\n{result.final_output}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
```


你可以在 GitHub 上找到完整的可运行示例。

[Apply patch 工具示例 - TypeScript



      Example of how to use the apply patch tool with the Agents SDK in TypeScript](https://github.com/openai/openai-agents-js/blob/main/examples/tools/applyPatch.ts)

[Apply patch 工具示例 - Python



      Example of how to use the apply patch tool with the Agents SDK in Python](https://github.com/openai/openai-agents-python/blob/main/examples/tools/apply_patch.py)

## 处理常见错误

使用 `status: "failed"` 加一条清晰的 `output` 消息以帮助模型恢复。



文件未找到

    File not found error

```json
{
  "type": "apply_patch_call_output",
  "call_id": "call_abc",
  "status": "failed",
  "output": "Error: File not found at path 'lib/baz.py'"
}
```

  

  

    
补丁冲突

    Patch conflict error

```json
{
  "type": "apply_patch_call_output",
  "call_id": "call_abc",
  "status": "failed",
  "output": "Error: Invalid Context:\n@@ def fib(n):"
}
```



然后，模型可以根据这些错误消息调整未来的差异（例如，通过在你的提示中重新读取文件或简化更改）。

## 最佳实践

- **提供清晰的文件上下文**
  - 当你调用 Responses API 时，可以包含文件的内联快照（如示例中所示），也可以为模型提供用于浏览文件系统的工具（例如 `shell` 工具）。
- **考虑将其与 `shell` tool**
  - 结合使用时， `shell` 工具，模型可以浏览文件系统目录、读取文件并对关键词进行 grep，从而实现智能体的文件发现与编辑。
- **鼓励小而聚焦的差异**
  - 在系统指令中，引导模型进行最小化、有针对性的编辑，而不是大规模重写。
- **确保变更能够干净地应用**
  - 在一系列补丁之后，运行你的测试或 linter，并将失败结果反馈到下一次 `input` 中，以便模型修复它们。

## 使用说明

<table>
<tbody>

<tr>
  <th>API Availability</th>
  <th>Supported models</th>
</tr>

<tr>
  <td>
    

      [Responses](https://developers.openai.com/api/reference/resources/responses)
    

    

      [Chat Completions](https://developers.openai.com/api/reference/resources/chat)
    

    

      [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants)
    

  </td>
  <td style={{ maxWidth: "150px" }}>
    [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)
    

    [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)
    

    [GPT-5.2](https://developers.openai.com/api/docs/models/gpt-5.2)
    

    [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)
  </td>
</tr>

</tbody>
</table>