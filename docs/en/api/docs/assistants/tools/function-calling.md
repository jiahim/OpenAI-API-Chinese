# Assistants Function Calling

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).

## Overview

Similar to the Chat Completions API, the Assistants API supports function calling. Function calling allows you to describe functions to the Assistants API and have it intelligently return the functions that need to be called along with their arguments.

## Quickstart

In this example, we'll create a weather assistant and define two functions,
`get_current_temperature` and `get_rain_probability`, as tools that the Assistant can call.
Depending on the user query, the model will invoke parallel function calling if using our
latest models released on or after Nov 6, 2023.
In our example that uses parallel function calling, we will ask the Assistant what the weather in
San Francisco is like today and the chances of rain. We also show how to output the Assistant's response with streaming.

With the launch of Structured Outputs, you can now use the parameter `strict:
  true` when using function calling with the Assistants API. For more
  information, refer to the [Function calling
  guide](https://developers.openai.com/api/docs/guides/function-calling#strict-mode). Please note that
  Structured Outputs are not supported in the Assistants API when using vision.

### Step 1: Define functions

When creating your assistant, you will first define the functions under the `tools` param of the assistant.

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


### Step 2: Create a Thread and add Messages

Create a Thread when a user starts a conversation and add Messages to the Thread as the user asks questions.

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


### Step 3: Initiate a Run

When you initiate a Run on a Thread containing a user Message that triggers one or more functions,
the Run will enter a `pending` status. After it processes, the run will enter a `requires_action` state which you can
verify by checking the Run’s `status`. This indicates that you need to run tools and submit their outputs to the
Assistant to continue Run execution. In our case, we will see two `tool_calls`, which indicates that the
user query resulted in parallel function calling.

Note that a runs expire ten minutes after creation. Be sure to submit your
  tool outputs before the 10 min mark.

You will see two `tool_calls` within `required_action`, which indicates the user query triggered parallel function calling.

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



How you initiate a Run and submit `tool_calls` will differ depending on whether you are using streaming or not,
although in both cases all `tool_calls` need to be submitted at the same time.
You can then complete the Run by submitting the tool outputs from the functions you called.
Pass each `tool_call_id` referenced in the `required_action` object to match outputs to each function call.



With streaming

    

For the streaming case, we create an EventHandler class to handle events in the response stream and submit all tool outputs at once with the “submit tool outputs stream” helper in the Python and Node SDKs.

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


  

  

    
Without streaming

    

Runs are asynchronous, which means you'll want to monitor their `status` by polling the Run object until a
[terminal status](https://developers.openai.com/api/docs/assistants/deep-dive#runs-and-run-steps) is reached. For convenience, where available, the 'create and poll' SDK helpers assist both in
creating the run and then polling for its completion. The Go tab shows the equivalent workflow with manual polling. Once the Run completes, you can list the
Messages added to the Thread by the Assistant. Finally, you would retrieve all the `tool_outputs` from
`required_action` and submit them at the same time to the 'submit tool outputs and poll' helper.

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



### Using Structured Outputs

When you enable [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) by supplying `strict: true`, the OpenAI API will pre-process your supplied schema on your first request, and then use this artifact to constrain the model to your schema.

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