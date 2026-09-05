# Computer use

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Computer use lets a model operate browser and desktop interfaces. Use it to fill out forms, test user flows, or complete tasks in applications through their UI.

You provide the environment and execute the model's requests. The model uses screenshots and other tool results to decide what to do next. Choose how to connect it to your application:

<a id="choose-an-integration-path"></a>

- **Code execution:** The model writes code that uses a library such as PyAutoGUI or Playwright to operate the interface. One call can combine actions, loops, or conditional logic.
- **The computer tool:** The model returns structured mouse and keyboard actions that your application translates into browser or desktop input.

For [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), we recommend code execution. The `computer` tool remains supported as an alternative.

<a id="option-2-use-a-custom-tool-or-harness"></a>
<a id="use-your-own-ui-tools"></a>
<a id="use-an-existing-tool-interface"></a>

If you already expose UI operations through [function calling](https://developers.openai.com/api/docs/guides/function-calling) or [remote MCP tools](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), you can keep that interface. See [Use your own UI tools](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#use-your-own-ui-tools) for the differences in how those integrations execute tools and return results.

<a id="expose-a-code-execution-tool"></a>
<a id="option-3-use-a-code-execution-harness"></a>
<a id="use-a-code-execution-harness"></a>

## Use code execution

A code-execution integration gives the model a function tool that accepts a script. Your application runs the script in an isolated browser or desktop environment and returns its output, including screenshots. Keep the environment available between calls so the model can build on earlier work.

<a id="before-running-the-examples"></a>

### Run the sample app

The [CUA sample app](https://github.com/openai/openai-cua-sample-app#first-run) includes the environment, tool handlers, local tasks, and outcome checks:

1. Follow the sample app's setup instructions in an isolated environment.
2. Select **Code** mode and set the model to `gpt-6-astra`.
3. Choose a built-in scenario and start a run. Inspect the actions and screenshots, then check the scenario's verification result.

Use the app's README for installation, desktop permissions, and supported environments. Review [Run safely](#run-safely) before adapting it to real sites or accounts.

<a id="code-execution-harness-examples"></a>

### Connect your own runtime

The following example shows the API loop for a runtime you provide. Python uses PyAutoGUI to operate a desktop; JavaScript uses Playwright to operate a browser. Both expose an ordinary function tool and return text or images with the original `call_id`.

The `execute_in_sandbox` or `executeInSandbox` helper sends code to your execution environment and returns its observations. It must preserve the browser or desktop session, enforce execution limits, and apply your permission rules. These are integration examples, separate from running the sample app.



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



<a id="connect-to-your-execution-service"></a>

For a complete client adapter and the expected text and image output shape, see [Connect to your execution service](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#connect-to-your-execution-service). The service interface in those examples belongs to your application; it is not an OpenAI-hosted endpoint.

### Preserve state and return observations

Keep the browser or desktop session alive between calls. A persistent Python or JavaScript namespace can also preserve variables. Describe the available objects and helpers in the tool definition so the model knows what it can use.

Give the model a current screenshot when the UI state is unknown. After a short group of actions, return another screenshot so it can check the result. Keep images in memory and use `detail: "original"` to preserve resolution. If you downscale a screenshot, map the model's coordinates back to the environment's coordinate space before executing actions. See [Screenshot capture and resolution](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#capture-screenshots).

The API conversation and the execution environment have separate state. Preserve tool calls and their outputs in the conversation, and keep the corresponding environment available in your application. Continuing a response does not restore a browser session, login state, or runtime variables.

<a id="provide-the-environment-and-control-the-loop"></a>
<a id="option-1-run-the-built-in-computer-use-loop"></a>

## Use the computer tool

Use this alternative when your integration expects structured actions instead of generated code. For the recommended approach, start with [code execution](#use-code-execution).

To try this path, follow the [same sample-app setup](https://github.com/openai/openai-cua-sample-app#first-run), select **Native** mode, and run a built-in scenario. Use a model that supports the [computer tool](https://developers.openai.com/api/docs/models).

The API exchange has three steps: send a task, execute the returned actions, and return a screenshot. The snippets here use a page with a **Show filters** control and a search field. Adapt that task to your own interface when integrating the tool.

<a id="prepare-a-safe-environment"></a>
<a id="1-prepare-your-browser-or-desktop"></a>
<a id="create-a-docker-image"></a>

For environment setup and action handlers, use the [integration recipes](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#prepare-an-environment).

<a id="1-send-the-first-request"></a>
<a id="2-send-the-task"></a>
<a id="1-send-the-task"></a>

### Send the task

Enable `computer` in the `tools` array and describe the result you want:

Send a computer request

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
  tools: [{type: :computer}]
)

puts(response.output)
```


<a id="2-handle-screenshot-first-turns"></a>
<a id="3-inspect-the-requested-actions"></a>
<a id="3-run-every-returned-action"></a>
<a id="2-execute-the-requested-actions"></a>

### Execute the requested actions

A `computer_call` contains an ordered `actions` array. For example, this call selects the search field and types `penguin`:

Batched actions in one turn

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


Your action handler translates these requests into browser or operating system input. Execute permitted actions in order, then capture the updated screen. The model can request `click`, `double_click`, `drag`, `move`, `scroll`, `keypress`, `type`, `wait`, or `screenshot`.

The first call may contain only a `screenshot` action. In that case, capture the current screen and return it without changing the UI. A call's `status: "completed"` means the model has finished generating that call; your application still needs to execute it.

<a id="possible-computer-use-actions"></a>
<a id="supported-actions"></a>
<a id="implement-action-handlers"></a>

Use the [action-handler examples](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#implement-action-handlers) for key mappings, drag paths, and modifier keys.

<a id="4-capture-and-return-the-updated-screenshot"></a>
<a id="4-return-the-updated-screen"></a>
<a id="3-return-the-screenshot"></a>

### Return the screenshot

Return a `computer_call_output` whose `call_id` matches the call you handled. Use `previous_response_id` to continue the model conversation:

Send the updated screenshot

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
  input: [{
    type: :computer_call_output,
    call_id: "call_abc123",
    output: {
      type: :computer_screenshot,
      image_url: "data:image/png;base64,<base64 bytes here>",
      detail: :original
    }
  }],
  tools: [{type: :computer}]
)

puts(response.output)
```


The same [screenshot and state guidance](#preserve-state-and-return-observations) applies to this loop. Keep the environment available while `previous_response_id` continues the model conversation.

<a id="5-repeat-until-the-tool-stops-calling"></a>
<a id="5-continue-and-verify-the-result"></a>

Continue until the model stops returning `computer_call` items. Inspect the remaining output for an answer, a request for help, or another tool call, and verify the result in the application. For this example, the Filters panel should be open and the search field should contain `penguin`.

See [Repeat the computer-use loop](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#repeat-the-computer-use-loop) for the loop skeleton, including its required action and screenshot helpers.

<a id="handle-user-confirmation-and-consent"></a>
<a id="keep-a-human-in-the-loop"></a>
<a id="restrict-the-environment"></a>

## Run safely

Computer use can affect real accounts and data. Apply these controls in your application and execution environment as well as in the model's instructions:

- **Restrict the environment.** Use an isolated browser or VM and an allow list of sites and actions. Keep access limited to what the task needs.
- **Treat screen content as untrusted.** Text in a page, document, or tool result cannot grant permission or override the user's instructions.
- **Confirm consequential actions.** Keep users in control of purchases, data transmission, destructive changes, and other actions that are hard to reverse. Typing sensitive information into a form counts as transmission.
- **Bound and verify the run.** Set step, time, or cost limits, support cancellation, and check the actual outcome instead of relying only on the model's final answer.

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

See the [confirmation and consent guidance](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#handle-user-confirmation-and-consent) for specific approval requirements, human handoff, and prompt examples.

<a id="migration-from-computer-use-preview"></a>
<a id="explore-more-examples"></a>

## Next steps

- Use the [integration recipes](https://developers.openai.com/api/docs/guides/tools-computer-use-integration) for environment setup, action handlers, screenshot capture, and execution-service adapters.
- Follow [Migration from computer-use-preview](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#migration-from-computer-use-preview) when updating an older integration.
- Explore the [CUA sample app](https://github.com/openai/openai-cua-sample-app) for complete browser and desktop workflows.