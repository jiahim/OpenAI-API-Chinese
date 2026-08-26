# 助手函数调用

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在 Responses API 实现功能对等后，我们已弃用 Assistants API。它将于 2026 年 8 月 26 日关闭。请遵循 [迁移指南](https://developers.openai.com/platform/assistants/migration) 来更新你的集成。 [了解更多](https://platform.openai.com/docs/guides/migrate-to-responses).

## 概述

与 Chat Completions API 类似，Assistants API 支持函数调用。函数调用允许你向 Assistants API 描述函数，并让它智能地返回需要调用的函数及其参数。

## 快速开始

在此示例中，我们将创建一个天气智能体并定义两个函数，
`get_current_temperature` 和 `get_rain_probability`，作为智能体可以调用的工具。
根据用户查询，如果使用我们的
2023年11月6日或之后发布的最新模型，模型将调用并行函数调用。
在使用并行函数调用的示例中，我们将询问智能体旧金山的天气
今天如何以及降雨几率。我们还展示了如何以流式方式输出智能体的响应。

随着结构化输出的推出，你现在可以在使用函数调用时使用参数 `strict:
  true` 与 Assistants API。更多
  信息，请参阅 [函数调用
  指南](https://developers.openai.com/api/docs/guides/function-calling#strict-mode)。请注意
  在使用视觉时，Assistants API 中不支持结构化输出。

### 步骤 1：定义函数

在创建助手时，你首先需要在 `tools` 参数中定义函数。

```javascript
const assistant = await client.beta.assistants.create({
  model: "gpt-4o",
  instructions:
    "You are a weather bot. Use the provided functions to answer questions.",
  tools: [
    {
      type: "function",
      function: {
        name: "getCurrentTemperature",
        description: "Get the current temperature for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["Celsius", "Fahrenheit"],
              description:
                "The temperature unit to use. Infer this from the user's location.",
            },
          },
          required: ["location", "unit"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getRainProbability",
        description: "Get the probability of rain for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
          },
          required: ["location"],
        },
      },
    },
  ],
});
```

```python
from openai import OpenAI

client = OpenAI()

assistant = client.beta.assistants.create(
    instructions="You are a weather bot. Use the provided functions to answer questions.",
    model="gpt-4o",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_current_temperature",
                "description": "Get the current temperature for a specific location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["Celsius", "Fahrenheit"],
                            "description": "The temperature unit to use. Infer this from the user's location.",
                        },
                    },
                    "required": ["location", "unit"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_rain_probability",
                "description": "Get the probability of rain for a specific location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        }
                    },
                    "required": ["location"],
                },
            },
        },
    ],
)
```

```go
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Model:        shared.ChatModelGPT4o,
	Instructions: openai.String("You are a weather bot. Use the provided functions to answer questions."),
	Tools:        weatherTools(false),
})
if err != nil {
	panic(err)
}

func weatherTools(strict bool) []openai.AssistantToolUnionParam {
	return []openai.AssistantToolUnionParam{
		openai.AssistantToolParamOfFunction(shared.FunctionDefinitionParam{
			Name:        "get_current_temperature",
			Description: openai.String("Get the current temperature for a specific location"),
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"location": map[string]any{"type": "string", "description": "The city and state, e.g., San Francisco, CA"},
					"unit":     map[string]any{"type": "string", "enum": []string{"Celsius", "Fahrenheit"}, "description": "The temperature unit to use. Infer this from the user's location."},
				},
				"required": []string{"location", "unit"},
			},
			Strict: openai.Bool(strict),
		}),
		openai.AssistantToolParamOfFunction(shared.FunctionDefinitionParam{
			Name:        "get_rain_probability",
			Description: openai.String("Get the probability of rain for a specific location"),
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"location": map[string]any{"type": "string", "description": "The city and state, e.g., San Francisco, CA"},
				},
				"required": []string{"location"},
			},
			Strict: openai.Bool(strict),
		}),
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.FunctionDefinition;
import com.openai.models.FunctionParameters;
import com.openai.models.beta.assistants.AssistantCreateParams;
import java.util.List;
import java.util.Map;

var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .model("gpt-4o")
                .instructions(
                    "You are a weather bot. Use the provided functions to answer questions.")
                .addFunctionTool(
                    FunctionDefinition.builder()
                        .name("get_current_temperature")
                        .description("Get the current temperature for a specific location")
                        .parameters(
                            FunctionParameters.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "location",
                                                Map.of(
                                                    "type", "string",
                                                    "description",
                                                        "The city and state, e.g., San Francisco, CA"),
                                            "unit",
                                                Map.of(
                                                    "type",
                                                    "string",
                                                    "enum",
                                                    List.of("Celsius", "Fahrenheit"),
                                                    "description",
                                                    "The temperature unit to use. Infer this from the user's location."))))
                                .putAdditionalProperty(
                                    "required", JsonValue.from(List.of("location", "unit")))
                                .build())
                        .build())
                .addFunctionTool(
                    FunctionDefinition.builder()
                        .name("get_rain_probability")
                        .description("Get the probability of rain for a specific location")
                        .parameters(
                            FunctionParameters.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "location",
                                            Map.of(
                                                "type", "string",
                                                "description",
                                                    "The city and state, e.g., San Francisco, CA"))))
                                .putAdditionalProperty(
                                    "required", JsonValue.from(List.of("location")))
                                .build())
                        .build())
                .build());

System.out.println(assistant.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.create(
  model: "gpt-4o",
  instructions: "Use the provided functions to answer weather questions.",
  tools: [
    {
      type: :function,
      function: {
        name: "get_current_temperature",
        description: "Get the current temperature for a location",
        parameters: {
          type: :object,
          properties: {
            location: {type: :string},
            unit: {type: :string, enum: ["Celsius", "Fahrenheit"]}
          },
          required: ["location", "unit"]
        }
      }
    },
    {
      type: :function,
      function: {
        name: "get_rain_probability",
        description: "Get the probability of rain for a location",
        parameters: {
          type: :object,
          properties: {location: {type: :string}},
          required: ["location"]
        }
      }
    }
  ]
)
puts(assistant.id)
```


### 第 2 步：创建线程并添加消息

当用户开始对话时创建一个线程（Thread），并在用户提问时向该线程添加消息（Messages）。

```javascript
const thread = await client.beta.threads.create();
const message = client.beta.threads.messages.create(thread.id, {
  role: "user",
  content:
    "What's the weather in San Francisco today and the likelihood it'll rain?",
});
```

```python
thread = client.beta.threads.create()
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="What's the weather in San Francisco today and the likelihood it'll rain?",
)
```

```go
thread, err := client.Beta.Threads.New(context.Background(), openai.BetaThreadNewParams{})
if err != nil {
	panic(err)
}
_, err = client.Beta.Threads.Messages.New(context.Background(), thread.ID, openai.BetaThreadMessageNewParams{
	Role: "user",
	Content: openai.BetaThreadMessageNewParamsContentUnion{
		OfString: openai.String("What's the weather in San Francisco today and the likelihood it'll rain?"),
	},
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.ThreadCreateParams;
import com.openai.models.beta.threads.messages.MessageCreateParams;

var thread = client.beta().threads().create(ThreadCreateParams.builder().build());
var message =
    client
        .beta()
        .threads()
        .messages()
        .create(
            thread.id(),
            MessageCreateParams.builder()
                .role(MessageCreateParams.Role.USER)
                .content("What's the weather in San Francisco today, and will it rain?")
                .build());

System.out.println(message.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
thread = client.beta.threads.create
message = client.beta.threads.messages.create(
  thread.id,
  role: :user,
  content: "What's the weather in San Francisco today, and will it rain?"
)
puts(message.id)
```


### 步骤 3：启动一次运行

当你在包含一条触发一个或多个函数的用户消息的线程上发起 Run 时，
该 Run 将进入 `pending` 状态。处理完成后，Run 将进入一个 `requires_action` 状态，你可以通过检查 Run 的
进行 `status`。验证。这表明你需要运行工具并将其输出提交给
以继续执行 Run。在我们的案例中，我们会看到两个 `tool_calls`，这表明
用户查询导致了并行函数调用。

请注意，Run 在创建后十分钟过期。请务必在
  10 分钟标记之前提交工具输出。

你会看到两个 `tool_calls` 在 `required_action`，中，这表明用户查询触发了并行函数调用。

```json
{
  "id": "run_qJL1kI9xxWlfE0z1yfL0fGg9",
  ...
  "status": "requires_action",
  "required_action": {
    "submit_tool_outputs": {
      "tool_calls": [
        {
          "id": "call_FthC9qRpsL5kBpwwyw6c7j4k",
          "function": {
            "arguments": "{"location": "San Francisco, CA"}",
            "name": "get_rain_probability"
          },
          "type": "function"
        },
        {
          "id": "call_RpEDoB8O0FTL9JoKTuCVFOyR",
          "function": {
            "arguments": "{"location": "San Francisco, CA", "unit": "Fahrenheit"}",
            "name": "get_current_temperature"
          },
          "type": "function"
        }
      ]
    },
    ...
    "type": "submit_tool_outputs"
  }
}
```

<figcaption>Run object truncated here for readability</figcaption>



你发起 Run 和提交 `tool_calls` 的方式将根据你是否使用流式传输而有所不同，
尽管在两种情况下所有 `tool_calls` 都需要同时提交。
然后，你可以通过提交所调用函数的工具输出来完成 Run。
传递每个 `tool_call_id` 在 `required_action` 对象中匹配每个函数调用的输出。



使用流式处理

    

对于流式处理的情况，我们创建一个 EventHandler 类来处理响应流中的事件，并使用 Python 和 Node SDK 中的“提交工具输出流”辅助函数一次性提交所有工具输出。

```javascript
class EventHandler extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
  }

  async onEvent(event) {
    try {
      console.log(event);
      // Retrieve events that are denoted with 'requires_action'
      // since these will have our tool_calls
      if (event.event === "thread.run.requires_action") {
        await this.handleRequiresAction(
          event.data,
          event.data.id,
          event.data.thread_id
        );
      }
    } catch (error) {
      console.error("Error handling event:", error);
    }
  }

  async handleRequiresAction(data, runId, threadId) {
    const toolOutputs = data.required_action.submit_tool_outputs.tool_calls.map(
      (toolCall) => {
        if (toolCall.function.name === "getCurrentTemperature") {
          return { tool_call_id: toolCall.id, output: "57" };
        } else if (toolCall.function.name === "getRainProbability") {
          return { tool_call_id: toolCall.id, output: "0.06" };
        }
        throw new Error(`Unknown tool: ${toolCall.function.name}`);
      }
    );
    // Submit all the tool outputs at the same time
    await this.submitToolOutputs(toolOutputs, runId, threadId);
  }

  async submitToolOutputs(toolOutputs, runId, threadId) {
    try {
      // Use the submitToolOutputsStream helper
      const stream = this.client.beta.threads.runs.submitToolOutputsStream(
        runId,
        { thread_id: threadId, tool_outputs: toolOutputs }
      );
      for await (const event of stream) {
        this.emit("event", event);
      }
    } catch (error) {
      console.error("Error submitting tool outputs:", error);
    }
  }
}

const eventHandler = new EventHandler(client);
eventHandler.on("event", eventHandler.onEvent.bind(eventHandler));

const stream = await client.beta.threads.runs.stream(threadId, {
  assistant_id: assistantId,
});

for await (const event of stream) {
  eventHandler.emit("event", event);
}
```

```python
from typing_extensions import override
from openai import AssistantEventHandler

class EventHandler(AssistantEventHandler):
    @override
    def on_event(self, event):
        # Retrieve events that are denoted with 'requires_action'
        # since these will have our tool_calls
        if event.event == "thread.run.requires_action":
            run_id = event.data.id  # Retrieve the run ID from the event data
            self.handle_requires_action(event.data, run_id)

    def handle_requires_action(self, data, run_id):
        tool_outputs = []

        for tool in data.required_action.submit_tool_outputs.tool_calls:
            if tool.function.name == "get_current_temperature":
                tool_outputs.append({"tool_call_id": tool.id, "output": "57"})
            elif tool.function.name == "get_rain_probability":
                tool_outputs.append({"tool_call_id": tool.id, "output": "0.06"})

        # Submit all tool_outputs at the same time
        self.submit_tool_outputs(tool_outputs, run_id)

    def submit_tool_outputs(self, tool_outputs, run_id):
        # Use the submit_tool_outputs_stream helper
        with client.beta.threads.runs.submit_tool_outputs_stream(
            thread_id=self.current_run.thread_id,
            run_id=self.current_run.id,
            tool_outputs=tool_outputs,
            event_handler=EventHandler(),
        ) as stream:
            for text in stream.text_deltas:
                print(text, end="", flush=True)
            print()

with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant.id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```


  

  

    
不使用流式处理

    

运行是异步的，这意味着你需要监控其 `status` 通过轮询 Run 对象直到达到
[终端状态](https://developers.openai.com/api/docs/assistants/deep-dive#runs-and-run-steps) 。为了方便起见，在可用的情况下，“创建并轮询”SDK 辅助函数有助于
创建运行并轮询其完成。Go 选项卡显示了使用手动轮询的等效工作流。运行完成后，你可以列出
由助手添加到线程的消息。最后，你需要检索所有 `tool_outputs` 从
`required_action` 并同时提交给“提交工具输出并轮询”辅助函数。

```javascript
async function handleRequiresAction(run) {
  // Check if there are tools that require outputs
  if (
    run.required_action &&
    run.required_action.submit_tool_outputs &&
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    // Loop through each tool in the required action section
    const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(
      (tool) => {
        if (tool.function.name === "getCurrentTemperature") {
          return { tool_call_id: tool.id, output: "57" };
        } else if (tool.function.name === "getRainProbability") {
          return { tool_call_id: tool.id, output: "0.06" };
        }
        throw new Error(`Unknown tool: ${tool.function.name}`);
      }
    );

    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      run = await client.beta.threads.runs.submitToolOutputsAndPoll(run.id, {
        thread_id: thread.id,
        tool_outputs: toolOutputs,
      });
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
    }

    // Check status after submitting tool outputs
    return handleRunStatus(run);
  }
}

async function handleRunStatus(run) {
  // Check if the run is completed
  if (run.status === "completed") {
    let messages = await client.beta.threads.messages.list(thread.id);
    console.log(messages.data);
    return messages.data;
  } else if (run.status === "requires_action") {
    console.log(run.status);
    return await handleRequiresAction(run);
  } else {
    console.error("Run did not complete:", run);
  }
}

// Create and poll run
let run = await client.beta.threads.runs.createAndPoll(thread.id, {
  assistant_id: assistant.id,
});

handleRunStatus(run);
```

```python
run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,
)

if run.status == "completed":
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    print(messages)

# Define the list to store tool outputs
tool_outputs = []

# Loop through each tool in the required action section
if run.required_action:
    for tool in run.required_action.submit_tool_outputs.tool_calls:
        if tool.function.name == "get_current_temperature":
            tool_outputs.append({"tool_call_id": tool.id, "output": "57"})
        elif tool.function.name == "get_rain_probability":
            tool_outputs.append({"tool_call_id": tool.id, "output": "0.06"})

# Submit all tool outputs at once after collecting them in a list
if tool_outputs:
    try:
        run = client.beta.threads.runs.submit_tool_outputs_and_poll(
            thread_id=thread.id,
            run_id=run.id,
            tool_outputs=tool_outputs,
        )
        print("Tool outputs submitted successfully.")
    except Exception as e:
        print("Failed to submit tool outputs:", e)
else:
    print("No tool outputs to submit.")

if run.status == "completed":
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    print(messages)
else:
    print(run.status)
```

```go
run, err := client.Beta.Threads.Runs.New(context.Background(), thread.ID, openai.BetaThreadRunNewParams{
	AssistantID: assistant.ID,
})
if err != nil {
	panic(err)
}
run = pollRun(client, thread.ID, run)
if run.Status == openai.RunStatusRequiresAction {
	outputs := make([]openai.BetaThreadRunSubmitToolOutputsParamsToolOutput, 0)
	for _, toolCall := range run.RequiredAction.SubmitToolOutputs.ToolCalls {
		switch toolCall.Function.Name {
		case "get_current_temperature":
			outputs = append(outputs, openai.BetaThreadRunSubmitToolOutputsParamsToolOutput{
				ToolCallID: openai.String(toolCall.ID), Output: openai.String("57"),
			})
		case "get_rain_probability":
			outputs = append(outputs, openai.BetaThreadRunSubmitToolOutputsParamsToolOutput{
				ToolCallID: openai.String(toolCall.ID), Output: openai.String("0.06"),
			})
		}
	}
	if len(outputs) > 0 {
		run, err = client.Beta.Threads.Runs.SubmitToolOutputs(
			context.Background(), thread.ID, run.ID,
			openai.BetaThreadRunSubmitToolOutputsParams{ToolOutputs: outputs},
		)
		if err != nil {
			panic(err)
		}
		run = pollRun(client, thread.ID, run)
	}
}
if run.Status == openai.RunStatusCompleted {
	messages, err := client.Beta.Threads.Messages.List(context.Background(), thread.ID, openai.BetaThreadMessageListParams{})
	if err != nil {
		panic(err)
	}
	fmt.Println(messages.Data)
} else {
	fmt.Println(run.Status)
}

func pollRun(client openai.Client, threadID string, run *openai.Run) *openai.Run {
	for run.Status == openai.RunStatusQueued || run.Status == openai.RunStatusInProgress {
		time.Sleep(time.Second)
		next, err := client.Beta.Threads.Runs.Get(context.Background(), threadID, run.ID)
		if err != nil {
			panic(err)
		}
		run = next
	}
	return run
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.threads.runs.Run;
import com.openai.models.beta.threads.runs.RunCreateParams;
import com.openai.models.beta.threads.runs.RunRetrieveParams;
import com.openai.models.beta.threads.runs.RunStatus;
import com.openai.models.beta.threads.runs.RunSubmitToolOutputsParams;
import java.util.ArrayList;

String threadId = System.getenv("OPENAI_EXAMPLE_THREAD_ID");
Run run =
    client
        .beta()
        .threads()
        .runs()
        .create(
            threadId,
            RunCreateParams.builder()
                .assistantId(System.getenv("OPENAI_EXAMPLE_ASSISTANT_ID"))
                .build());
run = poll(client, threadId, run);

if (run.status().equals(RunStatus.REQUIRES_ACTION)) {
  var action =
      run.requiredAction()
          .orElseThrow(() -> new IllegalStateException("Run has no required action"));
  var outputs = new ArrayList<RunSubmitToolOutputsParams.ToolOutput>();
  for (var call : action.submitToolOutputs().toolCalls()) {
    String output =
        switch (call.function().name()) {
          case "get_current_temperature" -> "57";
          case "get_rain_probability" -> "0.06";
          default -> null;
        };
    if (output != null) {
      outputs.add(
          RunSubmitToolOutputsParams.ToolOutput.builder()
              .toolCallId(call.id())
              .output(output)
              .build());
    }
  }
  if (outputs.isEmpty()) throw new IllegalStateException("No supported tool calls requested");
  run =
      client
          .beta()
          .threads()
          .runs()
          .submitToolOutputs(
              run.id(),
              RunSubmitToolOutputsParams.builder()
                  .threadId(threadId)
                  .toolOutputs(outputs)
                  .build());
  run = poll(client, threadId, run);
}

if (!run.status().equals(RunStatus.COMPLETED)) {
  throw new IllegalStateException("Run ended with status: " + run.status());
}
client.beta().threads().messages().list(threadId).items().stream()
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.text().stream())
    .forEach(content -> System.out.println(content.text().value()));
```

```ruby
require "openai"

client = OpenAI::Client.new
thread_id = ENV.fetch("OPENAI_THREAD_ID")
assistant_id = ENV.fetch("OPENAI_ASSISTANT_ID")

poll_run = lambda do |run|
  while [
    OpenAI::Beta::Threads::RunStatus::QUEUED,
    OpenAI::Beta::Threads::RunStatus::IN_PROGRESS
  ].include?(run.status)
    sleep(2)
    run = client.beta.threads.runs.retrieve(run.id, thread_id: thread_id)
  end
  run
end

run = client.beta.threads.runs.create(thread_id, assistant_id: assistant_id)
run = poll_run.call(run)

if run.status == OpenAI::Beta::Threads::RunStatus::REQUIRES_ACTION
  required_action = run.required_action or raise "Run has no required action"
  tool_outputs = required_action.submit_tool_outputs.tool_calls.filter_map do |tool_call|
    output = case tool_call.function.name
    when "get_current_temperature" then "57"
    when "get_rain_probability" then "0.06"
    end
    {tool_call_id: tool_call.id, output: output} if output
  end
  raise "No supported tool calls were requested" if tool_outputs.empty?

  run = client.beta.threads.runs.submit_tool_outputs(
    run.id,
    thread_id: thread_id,
    tool_outputs: tool_outputs
  )
  run = poll_run.call(run)
end

if run.status == OpenAI::Beta::Threads::RunStatus::COMPLETED
  messages = client.beta.threads.messages.list(thread_id)
  messages.auto_paging_each { |message| puts(message.content) }
else
  warn("Run ended with status: #{run.status}")
end
```



### 使用结构化输出

当你启用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 通过提供 `strict: true`，时，OpenAI API 会在你的首次请求时预处理你提供的模式，然后使用这一产物将模型约束到你的模式。

```javascript
const assistant = await client.beta.assistants.create({
  model: "gpt-4o-2024-08-06",
  instructions:
    "You are a weather bot. Use the provided functions to answer questions.",
  tools: [
    {
      type: "function",
      function: {
        name: "getCurrentTemperature",
        description: "Get the current temperature for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["Celsius", "Fahrenheit"],
              description:
                "The temperature unit to use. Infer this from the user's location.",
            },
          },
          required: ["location", "unit"],
          // highlight-start
          additionalProperties: false,
          // highlight-end
        },
        // highlight-start
        strict: true,
        // highlight-end
      },
    },
    {
      type: "function",
      function: {
        name: "getRainProbability",
        description: "Get the probability of rain for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
          },
          required: ["location"],
          // highlight-start
          additionalProperties: false,
          // highlight-end
        },
        // highlight-start
        strict: true,
        // highlight-end
      },
    },
  ],
});
```

```python
from openai import OpenAI

client = OpenAI()

assistant = client.beta.assistants.create(
    instructions="You are a weather bot. Use the provided functions to answer questions.",
    model="gpt-4o-2024-08-06",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_current_temperature",
                "description": "Get the current temperature for a specific location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["Celsius", "Fahrenheit"],
                            "description": "The temperature unit to use. Infer this from the user's location.",
                        },
                    },
                    "required": ["location", "unit"],
                    # highlight-start
                    "additionalProperties": False,
                    # highlight-end
                },
                # highlight-start
                "strict": True,
                # highlight-end
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_rain_probability",
                "description": "Get the probability of rain for a specific location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        }
                    },
                    "required": ["location"],
                    # highlight-start
                    "additionalProperties": False,
                    # highlight-end
                },
                # highlight-start
                "strict": True,
                # highlight-end
            },
        },
    ],
)
```

```go
assistant, err := client.Beta.Assistants.New(context.Background(), openai.BetaAssistantNewParams{
	Model:        shared.ChatModelGPT4o2024_08_06,
	Instructions: openai.String("You are a weather bot. Use the provided functions to answer questions."),
	Tools:        weatherTools(),
})
if err != nil {
	panic(err)
}

func weatherTools() []openai.AssistantToolUnionParam {
	return []openai.AssistantToolUnionParam{
		openai.AssistantToolParamOfFunction(shared.FunctionDefinitionParam{
			Name:        "get_current_temperature",
			Description: openai.String("Get the current temperature for a specific location"),
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"location": map[string]any{"type": "string", "description": "The city and state, e.g., San Francisco, CA"},
					"unit":     map[string]any{"type": "string", "enum": []string{"Celsius", "Fahrenheit"}, "description": "The temperature unit to use. Infer this from the user's location."},
				},
				"required":             []string{"location", "unit"},
				"additionalProperties": false,
			},
			Strict: openai.Bool(true),
		}),
		openai.AssistantToolParamOfFunction(shared.FunctionDefinitionParam{
			Name:        "get_rain_probability",
			Description: openai.String("Get the probability of rain for a specific location"),
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"location": map[string]any{"type": "string", "description": "The city and state, e.g., San Francisco, CA"},
				},
				"required":             []string{"location"},
				"additionalProperties": false,
			},
			Strict: openai.Bool(true),
		}),
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.FunctionDefinition;
import com.openai.models.FunctionParameters;
import com.openai.models.beta.assistants.AssistantCreateParams;
import java.util.List;
import java.util.Map;

var assistant =
    client
        .beta()
        .assistants()
        .create(
            AssistantCreateParams.builder()
                .model("gpt-4o-2024-08-06")
                .instructions(
                    "You are a weather bot. Use the provided functions to answer questions.")
                .addFunctionTool(
                    FunctionDefinition.builder()
                        .name("get_current_temperature")
                        .description("Get the current temperature for a specific location")
                        .strict(true)
                        .parameters(
                            FunctionParameters.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "location",
                                                Map.of(
                                                    "type", "string",
                                                    "description",
                                                        "The city and state, e.g., San Francisco, CA"),
                                            "unit",
                                                Map.of(
                                                    "type",
                                                    "string",
                                                    "enum",
                                                    List.of("Celsius", "Fahrenheit"),
                                                    "description",
                                                    "The temperature unit to use. Infer this from the user's location."))))
                                .putAdditionalProperty(
                                    "required", JsonValue.from(List.of("location", "unit")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .addFunctionTool(
                    FunctionDefinition.builder()
                        .name("get_rain_probability")
                        .description("Get the probability of rain for a specific location")
                        .strict(true)
                        .parameters(
                            FunctionParameters.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "location",
                                            Map.of(
                                                "type", "string",
                                                "description",
                                                    "The city and state, e.g., San Francisco, CA"))))
                                .putAdditionalProperty(
                                    "required", JsonValue.from(List.of("location")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .build());

System.out.println(assistant.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant = client.beta.assistants.create(
  model: "gpt-4o",
  name: "Weather assistant",
  tools: [{type: :function, function: {name: "get_weather", description: "Get weather", parameters: {type: :object, properties: {city: {type: :string}}, required: ["city"], additionalProperties: false}, strict: true}}]
)
puts(assistant.id)
```