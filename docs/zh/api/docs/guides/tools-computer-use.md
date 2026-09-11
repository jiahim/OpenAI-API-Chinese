# Computer use

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

Computer use 让模型能够操作浏览器和桌面界面。你可以通过它在应用的界面上填写表单、测试用户流程或完成任务。

你提供运行环境并执行模型的请求。模型使用截图和工具结果来决定下一步操作。选择将它连接到你的应用的方式：

<a id="choose-an-integration-path"></a>

- **代码执行：** 模型编写代码，使用 PyAutoGUI 或 Playwright 等库来操作界面。单个调用可以组合动作、循环或条件逻辑。
- **计算机工具：** 模型返回结构化的鼠标和键盘动作，由你的应用将其转换为浏览器或桌面输入。

对于 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们推荐使用代码执行。该 `computer` 工具仍受支持，可作为替代方案。

<a id="option-2-use-a-custom-tool-or-harness"></a>
<a id="use-your-own-ui-tools"></a>
<a id="use-an-existing-tool-interface"></a>

如果你已经通过 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 或 [远程 MCP 工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，对外暴露 UI 操作，你可以沿用该接口。有关这些集成在工具执行和结果返回方式上的差异，请参阅 [使用你自己的 UI 工具](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#use-your-own-ui-tools) 。

<a id="expose-a-code-execution-tool"></a>
<a id="option-3-use-a-code-execution-harness"></a>
<a id="use-a-code-execution-harness"></a>

## 使用代码执行

代码执行集成会为模型提供一个接受脚本的函数工具。你的应用在隔离的浏览器或桌面环境中运行该脚本，并返回其输出（包括截图）。请在多次调用之间保持该环境可用，以便模型能够基于先前的工作继续推进。

<a id="before-running-the-examples"></a>

### 运行示例应用

该 [CUA 示例应用](https://github.com/openai/openai-cua-sample-app#first-run) 包含 JavaScript/Playwright 和 Python/PyAutoGUI 实现，附带本地任务和共享控制台：

1. 在隔离环境中按照所选实现的设置说明进行操作。
2. 选择一个内置场景并启动运行。 
3. 检查操作、截图和最终状态，以评估任务是否成功。

请参考该应用的 README 文件获取安装、桌面端权限及受支持环境的信息。审阅 [安全运行](#run-safely) 后再将其适配到实际站点或账号。

<a id="code-execution-harness-examples"></a>

### 接入你自己的运行时

以下示例展示了你提供 runtime 时 API 的循环。Python 和 Ruby 将 Python 代码发送到使用 PyAutoGUI 的桌面 runtime；JavaScript 使用 Playwright 来操作浏览器。每个客户端都会暴露一个普通的函数工具，并以原始的 `call_id`.

该 `execute_in_sandbox` 或 `executeInSandbox` 辅助函数将代码发送到你的执行环境并返回其观察结果。它必须保持浏览器或桌面会话、执行强制限制，并应用你的权限规则。这些是集成示例，与运行示例应用是分开的。



Python

    Run computer use with code execution

```python
import json
import uuid

from openai import OpenAI
from openai.types.responses import (
    FunctionToolParam,
    ResponseInputParam,
)

def run_computer_use(endpoint, prompt, model="gpt-6-astra"):
    client = OpenAI()
    session_id = str(uuid.uuid4())
    tools: list[FunctionToolParam] = [
        {
            "type": "function",
            "name": "exec_py",
            "description": (
                "Run Python in a persistent desktop. Variables persist across calls. "
                "PyAutoGUI operations are synchronous. Available: pyautogui, time, "
                "log(value), and display(PIL_image). Inspect the screen with "
                "display(pyautogui.screenshot()) before acting. Use screenshot "
                "coordinates and check the screen after a short group of actions. "
                "Keep screenshots in memory and PyAutoGUI's fail-safe enabled."
            ),
            "parameters": {
                "type": "object",
                "properties": {"code": {"type": "string"}},
                "required": ["code"],
                "additionalProperties": False,
            },
            "strict": True,
        }
    ]
    next_input: ResponseInputParam = [{"role": "user", "content": prompt}]
    previous_response_id = None

    for turn in range(20):
        response = client.responses.create(
            model=model,
            tools=tools,
            input=next_input,
            previous_response_id=previous_response_id,
        )
        if response.status != "completed":
            raise RuntimeError(f"Response stopped with status: {response.status}")

        calls = [item for item in response.output if item.type == "function_call"]
        if not calls and any(
            item.type == "message" and item.phase != "commentary"
            for item in response.output
        ):
            print(response.output_text)
            return
        if turn == 19:
            raise RuntimeError(
                "The task reached the 20-response limit. Inspect the last result."
            )

        next_input = []
        for call in calls:
            if call.name != "exec_py":
                raise ValueError(f"Unexpected tool: {call.name}")
            code = json.loads(call.arguments)["code"]
            output = execute_in_sandbox(code, session_id, endpoint)
            next_input.append(
                {
                    "type": "function_call_output",
                    "call_id": call.call_id,
                    "output": output,
                }
            )
        previous_response_id = response.id
```

  

  

    
JavaScript

    Run computer use with code execution

```javascript
import { randomUUID } from "node:crypto";
import OpenAI from "openai";

async function runComputerUse(endpoint, prompt, model = "gpt-6-astra") {
  const client = new OpenAI();
  const sessionId = randomUUID();
  /** @type {OpenAI.Responses.Tool[]} */
  const tools = [
    {
      type: "function",
      name: "exec_js",
      description: `Run JavaScript in a persistent browser. Available: Playwright's
browser, context, and page objects; console.log(value); and display(base64Image).
Save reusable variables on globalThis. Inspect a screenshot before acting and
check the screen after a short group of actions. Keep screenshots in memory.
Use top-level await for async operations. Return images with display() and concise
text with console.log(). The context viewport is 1440x900.`,
      parameters: {
        type: "object",
        properties: { code: { type: "string" } },
        required: ["code"],
        additionalProperties: false,
      },
      strict: true,
    },
  ];
  /** @type {OpenAI.Responses.ResponseInput} */
  let nextInput = [{ role: "user", content: prompt }];
  let previousResponseId;

  for (let turn = 0; turn < 20; turn++) {
    const response = await client.responses.create({
      model,
      tools,
      input: nextInput,
      previous_response_id: previousResponseId,
      reasoning: { effort: "low" },
    });
    if (response.status !== "completed") {
      throw new Error(`Response stopped with status: ${response.status}`);
    }
    const calls = response.output.filter(
      (item) => item.type === "function_call"
    );
    if (
      calls.length === 0 &&
      response.output.some(
        (item) => item.type === "message" && item.phase !== "commentary"
      )
    ) {
      console.log(response.output_text);
      return;
    }
    if (turn === 19) {
      throw new Error(
        "The task reached the 20-response limit. Inspect the last result."
      );
    }

    nextInput = [];
    for (const call of calls) {
      if (call.name !== "exec_js")
        throw new Error(`Unexpected tool: ${call.name}`);
      const { code } = JSON.parse(call.arguments);
      const output = await executeInSandbox(code, sessionId, endpoint);
      nextInput.push({
        type: "function_call_output",
        call_id: call.call_id,
        output,
      });
    }
    previousResponseId = response.id;
  }
}
```

  

  

    
Ruby

    Run computer use with code execution

```ruby
require "json"
require "openai"
require "securerandom"

def run_computer_use(endpoint, prompt)
  client = OpenAI::Client.new
  session_id = SecureRandom.uuid
  tools = [
    {
      type: :function,
      name: "exec_py",
      description: "Run Python in a persistent desktop. Variables persist across calls. PyAutoGUI operations are synchronous. Available: pyautogui, time, log(value), and display(PIL_image). Inspect the screen with display(pyautogui.screenshot()) before acting. Use screenshot coordinates and check the screen after a short group of actions. Keep screenshots in memory and PyAutoGUI's fail-safe enabled.",
      parameters: {
        type: :object,
        properties: { code: { type: :string } },
        required: ["code"],
        additionalProperties: false
      },
      strict: true
    }
  ]
  next_input = []
  next_input << {
    role: :user,
    content: prompt
  }
  history = {}
  20.times do |turn|
    response = client.responses.create(
      model: "gpt-6-astra", tools: tools, input: next_input, previous_response_id: history[:id]
    )
    raise "Response stopped with status: #{response.status}" unless response.status == OpenAI::Responses::ResponseStatus::COMPLETED

    calls = response.output.grep(OpenAI::Responses::ResponseFunctionToolCall)
    if calls.empty? && response.output.any? { |item| item.is_a?(OpenAI::Responses::ResponseOutputMessage) && item.phase != :commentary }
      puts(response.output_text)
      return response
    end
    raise "The task reached the 20-response limit" if turn == 19

    next_input.clear
    calls.each do |call|
      raise "Unexpected tool: #{call.name}" unless call.name == "exec_py"

      code = JSON.parse(call.arguments).fetch("code")
      raise "Expected Python source text" unless code.is_a?(String)

      output = execute_in_sandbox(code, session_id, endpoint)
      next_input << {
        type: :function_call_output,
        call_id: call.call_id,
        output: output
      }
    end
    history[:id] = response.id
  end
end
```



<a id="connect-to-your-execution-service"></a>

有关完整的客户端适配器以及预期的文本和图像输出格式，请参阅 [连接到你的执行服务](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#connect-to-your-execution-service)。这些示例中的服务接口属于你的应用程序，不是 OpenAI 托管的端点。

### 保留状态并返回观察结果

在调用之间保持浏览器或桌面会话处于活动状态。持久化的 Python 或 JavaScript 命名空间也可以保留变量。在工具定义中描述可用的对象和帮助函数，以便模型了解它可以使用哪些资源。

当 UI 状态未知时，向模型提供当前的截图。完成一组简短的操作后，再返回一张截图，以便模型可以检查结果。将图像保留在内存中并使用 `detail: "original"` 以保持分辨率。如果对截图进行降采样，请在执行操作之前将模型的坐标映射回环境的坐标空间。参见 [截图捕获与分辨率](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#capture-screenshots).

API 对话和执行环境拥有各自独立的状态。在对话中保留工具调用及其输出，并在你的应用程序中保持相应的环境可用。延续响应不会恢复浏览器会话、登录状态或运行时变量。

<a id="provide-the-environment-and-control-the-loop"></a>
<a id="option-1-run-the-built-in-computer-use-loop"></a>

## 使用 computer 工具

当你的集成期望接收结构化动作而非生成的代码时，可以使用这种替代方案。要采用推荐的方式，请从 [代码执行](#use-code-execution).

若要尝试该路径，请按照 [同一示例应用设置](https://github.com/openai/openai-cua-sample-app#first-run)，选择 **Native** 模式，并运行内置场景。请使用一个支持 [计算机工具](https://developers.openai.com/api/docs/models).

该 API 交互包含三个步骤：发送任务、执行返回的动作，然后回传截图。此处的代码片段使用的是一个包含 **Show filters** 控件和搜索字段的页面。在集成该工具时，请根据你自己的界面调整相应的任务。

<a id="prepare-a-safe-environment"></a>
<a id="1-prepare-your-browser-or-desktop"></a>
<a id="create-a-docker-image"></a>

关于环境设置和动作处理，请参阅 [集成示例](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#prepare-an-environment).

<a id="1-send-the-first-request"></a>
<a id="2-send-the-task"></a>
<a id="1-send-the-task"></a>

### Send the task

Enable `computer` 在 `tools` 数组中启用并说明你希望的结果：

发送计算机请求

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6-sol",
  tools: [{ type: "computer" }],
  input:
    "Check whether the Filters panel is open. If it is not open, click Show filters. Then type penguin in the search box. Use the computer tool for UI interaction.",
});

console.log(JSON.stringify(response.output, null, 2));
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6-sol",
    tools=[{"type": "computer"}],
    input="Check whether the Filters panel is open. If it is not open, click Show filters. Then type penguin in the search box. Use the computer tool for UI interaction.",
)

print(response.output)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6-sol",
		Tools: []responses.ToolUnionParam{{OfComputer: &responses.ComputerToolParam{}}},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Check whether the Filters panel is open. If it is not open, click Show filters. Then type penguin in the search box. Use the computer tool for UI interaction.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6-sol")
        .input(
            "Open the Filters panel if needed, then search for penguin. Use the computer tool for UI interaction.")
        .putAdditionalBodyProperty("tools", JsonValue.from(List.of(Map.of("type", "computer"))))
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6-sol",
  input: "Open the Filters panel if needed, then search for penguin. Use the computer tool for UI interaction.",
  tools: [{ type: :computer }]
)

puts(response.output)
```


<a id="2-handle-screenshot-first-turns"></a>
<a id="3-inspect-the-requested-actions"></a>
<a id="3-run-every-returned-action"></a>
<a id="2-execute-the-requested-actions"></a>

### 执行请求的操作

一个 `computer_call` 包含一个有序 `actions` 数组。例如，此调用会选择搜索字段并输入 `penguin`:

单轮中的批量操作

```json
{
  "output": [
    {
      "type": "computer_call",
      "call_id": "call_002",
      "actions": [
        { "type": "click", "button": "left", "x": 405, "y": 157 },
        { "type": "type", "text": "penguin" }
      ],
      "status": "completed"
    }
  ]
}
```


你的动作处理器将这些请求转换为浏览器或操作系统输入。按顺序执行被允许的动作，然后捕获更新后的屏幕。模型可以请求 `click`, `double_click`, `drag`, `move`, `scroll`, `keypress`, `type`, `wait`，或 `screenshot`.

首次调用可能仅包含一个 `screenshot` 动作。在这种情况下，捕获当前屏幕并在不更改 UI 的情况下将其返回。调用的 `status: "completed"` 表示模型已完成该调用的生成；你的应用程序仍需执行它。

<a id="possible-computer-use-actions"></a>
<a id="supported-actions"></a>
<a id="implement-action-handlers"></a>

使用 [动作处理示例](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#implement-action-handlers) 了解按键映射、拖动路径和修饰键。

<a id="4-capture-and-return-the-updated-screenshot"></a>
<a id="4-return-the-updated-screen"></a>
<a id="3-return-the-screenshot"></a>

### 返回截图

返回一个 `computer_call_output` 其 `call_id` 与你处理的调用匹配。使用 `previous_response_id` 以延续模型对话：

发送更新后的截图

```javascript
import OpenAI from "openai";

const client = new OpenAI();

async function sendComputerScreenshot(response, callId, screenshotBase64) {
  const output = /** @type {const} */ ({
    type: "computer_screenshot",
    image_url: `data:image/png;base64,${screenshotBase64}`,
    detail: "original",
  });

  return await client.responses.create({
    model: "gpt-5.6-sol",
    tools: [{ type: "computer" }],
    previous_response_id: response.id,
    input: [
      {
        type: "computer_call_output",
        call_id: callId,
        output,
      },
    ],
  });
}
```

```python
from openai import OpenAI

client = OpenAI()


def send_computer_screenshot(response, call_id, screenshot_base64):
    return client.responses.create(
        model="gpt-5.6-sol",
        tools=[{"type": "computer"}],
        previous_response_id=response.id,
        input=[
            {
                "type": "computer_call_output",
                "call_id": call_id,
                "output": {
                    "type": "computer_screenshot",
                    "image_url": f"data:image/png;base64,{screenshot_base64}",
                    "detail": "original",
                },
            }
        ],
    )
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := sendComputerScreenshot(client, "resp_abc123", "call_abc123", "<base64 bytes here>")
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}

func sendComputerScreenshot(client openai.Client, responseID string, callID string, screenshotBase64 string) (*responses.Response, error) {
	screenshot := responses.ResponseComputerToolCallOutputScreenshotParam{
		ImageURL: openai.String("data:image/png;base64," + screenshotBase64),
	}
	screenshot.SetExtraFields(map[string]any{"detail": "original"})
	return client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6-sol",
		Tools:              []responses.ToolUnionParam{{OfComputer: &responses.ComputerToolParam{}}},
		PreviousResponseID: openai.String(responseID),
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfComputerCallOutput(callID, screenshot),
		}},
	})
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseComputerToolCallOutputScreenshot;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;
import java.util.Map;

String responseId = "resp_abc123";

String computerCallId = "call_abc123";

String screenshotBase64 = "<base64 bytes here>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6-sol")
        .input(
            ResponseCreateParams.Input.ofResponse(
                List.of(
                    ResponseInputItem.ofComputerCallOutput(
                        ResponseInputItem.ComputerCallOutput.builder()
                            .callId(computerCallId)
                            .output(
                                ResponseComputerToolCallOutputScreenshot.builder()
                                    .imageUrl("data:image/png;base64," + screenshotBase64)
                                    .putAdditionalProperty("detail", JsonValue.from("original"))
                                    .build())
                            .build()))))
        .previousResponseId(responseId)
        .putAdditionalBodyProperty("tools", JsonValue.from(List.of(Map.of("type", "computer"))))
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6-sol",
  previous_response_id: "resp_abc123",
  input: [
    {
      type: :computer_call_output,
      call_id: "call_abc123",
      output: {
        type: :computer_screenshot,
        image_url: "data:image/png;base64,<base64 bytes here>",
        detail: :original
      }
    }
  ],
  tools: [{ type: :computer }]
)

puts(response.output)
```


同一份 [截图与状态指导](#preserve-state-and-return-observations) 同样适用于此循环。在 `previous_response_id` 延续模型对话期间保持环境可用。

<a id="5-repeat-until-the-tool-stops-calling"></a>
<a id="5-continue-and-verify-the-result"></a>

持续循环，直到模型不再返回 `computer_call` 项。检查剩余的输出，寻找答案、求助请求或其他工具调用，并在应用中验证结果。在本例中，Filters 面板应处于打开状态，且搜索字段应包含 `penguin`.

参见 [重复 computer-use 循环](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#repeat-the-computer-use-loop) 以获取循环框架，包括其必需的操作和截图辅助函数。

<a id="handle-user-confirmation-and-consent"></a>
<a id="keep-a-human-in-the-loop"></a>
<a id="restrict-the-environment"></a>

## 安全运行

计算机使用可能会影响真实账户和数据。请在你的应用程序、执行环境以及模型的指令中应用以下控制措施：

- **限制运行环境。** 使用隔离的浏览器或虚拟机，并维护一份允许访问的站点和操作列表。仅开放任务所需的访问权限。
- **将屏幕内容视为不可信。** 页面、文档或工具结果中的文本不能授予权限，也不能覆盖用户的指令。
- **确认高风险操作。** 让用户掌控购买、数据传输、破坏性更改以及其他难以撤销的操作。在表单中填写敏感信息属于数据传输。
- **限制并验证运行。** 设置步骤、时间或成本上限，支持取消操作，并检查实际结果，而非仅依赖模型的最终回答。

<a id="treat-only-direct-user-instructions-as-permission"></a>
<a id="confirm-at-the-point-of-risk"></a>
<a id="use-the-right-confirmation-level"></a>
<a id="hand-off-required"></a>
<a id="always-confirm-at-action-time"></a>
<a id="pre-approval-can-be-enough"></a>
<a id="protect-sensitive-data"></a>
<a id="prompt-patterns-you-can-add-to-your-agent-instructions"></a>
<a id="distinguish-direct-user-intent-from-untrusted-third-party-content"></a>
<a id="delay-confirmation-until-the-exact-risky-action"></a>
<a id="require-explicit-consent-before-transmitting-sensitive-data"></a>
<a id="stop-and-escalate-when-the-model-sees-prompt-injection-or-suspicious-instructions"></a>

请参阅 [确认与同意指引](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#handle-user-confirmation-and-consent) 了解具体的审批要求、人工交接以及提示示例。

<a id="migration-from-computer-use-preview"></a>
<a id="explore-more-examples"></a>

## 后续步骤

- 使用 [集成示例](https://developers.openai.com/api/docs/guides/tools-computer-use-integration) 完成环境配置、动作处理器、截图捕获和执行服务适配器。
- 请参阅 [从 computer-use-preview 迁移](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#migration-from-computer-use-preview) 以更新旧版集成。
- 浏览 [CUA 示例应用](https://github.com/openai/openai-cua-sample-app) 以获取完整的浏览器和桌面工作流。