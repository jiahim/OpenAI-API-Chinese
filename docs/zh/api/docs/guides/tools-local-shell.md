# Local shell

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

本地 shell 工具已过时。对于新的使用场景，请改用
  [`shell`](https://developers.openai.com/api/docs/guides/tools-shell) 工具配合 GPT-5.1 使用。 [了解
  更多](https://developers.openai.com/api/docs/guides/tools-shell).

本地 shell 是一项允许 智能体 在你或用户提供的一台机器上本地运行 shell 命令的工具。它设计为与 [Codex CLI](https://github.com/openai/codex) 和 [`codex-mini-latest`](https://developers.openai.com/api/docs/models/codex-mini-latest)。配合使用。命令会在你自己的运行时中执行， **你可以完全控制实际运行的命令** ——API 仅返回指令，但不会在 OpenAI 基础设施上执行它们。

本地 shell 可通过 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 用于 [`codex-mini-latest`](https://developers.openai.com/api/docs/models/codex-mini-latest)。它在其他模型上不可用，也无法通过 Chat Completions API 使用。

运行任意 shell 命令可能存在危险。在将命令转发到系统
shell 之前，务必进行沙箱化执行或添加严格的允许/拒绝列表。
shell。



请参阅 [Codex CLI](https://github.com/openai/codex) 以获取参考实现。

## 工作原理

本地 shell 工具使 智能体 能够在持续循环中运行，并可访问终端。

它会发送 shell 命令，由你的代码在本地机器上执行，然后将输出返回给模型。这个循环使模型能够在无需用户额外介入的情况下完成构建-测试-运行循环。

作为你代码的一部分，你需要实现一个循环来监听 `local_shell_call` 输出项并执行它们所包含的命令。我们强烈建议对这些命令的执行进行沙箱化处理，以防止任何意外命令被执行。



集成本地 shell 工具



以下是在你的应用中集成 computer use 工具所需遵循的高级步骤：

1. **向模型发送请求**:
   将 `local_shell` 工具作为可用工具的一部分提供。

2. **接收模型返回的响应**:
   检查响应中是否包含 `local_shell_call` 项。
   该工具调用包含一项动作，例如 `exec` ，并带有要执行的命令。

3. **执行所请求的动作**:
   通过代码在计算机或容器环境中执行相应的动作。

4. **返回动作的输出**:
   执行完动作后，将命令输出以及诸如状态码等元数据一并返回给模型。

5. **重复**:
   以 `local_shell_call_output`，的形式发送一个新请求，并不断重复该循环，直到模型不再请求新的动作，或你决定停止为止。

## 工作流 示例

下面是一个最小化的（Python）示例，展示请求/响应循环。为了
简洁起见，省略了错误处理和安全检查——**不要在生产中执行
未采取额外防护措施的不可信命令**.

```python
import os
import shlex
import subprocess
from openai import OpenAI

client = OpenAI()

# 1) Create the initial response request with the tool enabled
response = client.responses.create(
    model="codex-mini-latest",
    tools=[{"type": "local_shell"}],
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "List files in the current directory"},
            ],
        }
    ],
)

while True:
    # 2) Look for a local_shell_call in the model's output items
    shell_calls = []
    for item in response.output:
        item_type = getattr(item, "type", None)
        if item_type == "local_shell_call":
            shell_calls.append(item)
        elif (
            item_type == "tool_call"
            and getattr(item, "tool_name", None) == "local_shell"
        ):
            shell_calls.append(item)
    if not shell_calls:
        # No more commands — the assistant is done.
        break

    call = shell_calls[0]
    args = getattr(call, "action", None) or getattr(call, "arguments", None)

    # 3) Execute the command locally (here we just trust the command!)
    #    The command is already split into argv tokens.
    def _get(obj, key, default=None):
        if isinstance(obj, dict):
            return obj.get(key, default)
        return getattr(obj, key, default)

    timeout_ms = _get(args, "timeout_ms")
    command = _get(args, "command")
    if not command:
        break
    if isinstance(command, str):
        command = shlex.split(command)
    completed = subprocess.run(
        command,
        cwd=_get(args, "working_directory") or os.getcwd(),
        env={**os.environ, **(_get(args, "env") or {})},
        capture_output=True,
        text=True,
        timeout=(timeout_ms / 1000) if timeout_ms else None,
    )

    output_item = {
        "type": "local_shell_call_output",
        "call_id": getattr(call, "call_id", None),
        "output": completed.stdout + completed.stderr,
    }

    # 4) Send the output back to the model to continue the conversation
    response = client.responses.create(
        model="codex-mini-latest",
        tools=[{"type": "local_shell"}],
        previous_response_id=response.id,
        input=[output_item],
    )

# Print the assistant's final answer
print(response.output_text)
```


## 最佳实践

- **使用沙箱或容器化** 执行。可考虑使用 Docker、firejail 或
  受限的用户账户。
- **施加资源限制** （时间、内存、网络）。模型 `timeout_ms`
  提供的内容仅供参考——你应自行强制实施限制。
- **过滤或审查** 高风险命令（例如。 `rm`, `curl`、网络工具）。
  工具）。
- **记录每条命令及其输出** 以便审计和调试。

### 错误处理

如果该命令在你这边执行失败（非零退出码、超时等），你仍然可以发送一条 `local_shell_call_output`；请将错误信息包含在 `output` 字段中。

模型可以选择恢复或尝试执行其他命令。如果你发送了格式错误的数据（例如缺少 `call_id`），API 会返回标准的 `400` 校验错误。