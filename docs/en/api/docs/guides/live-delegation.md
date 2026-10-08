# Delegation and tools in GPT-Live

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

GPT-Live delegates reasoning and tool use to a backend while it manages the spoken conversation. Backend work can run through the configured Responses model or, with client delegation, any model, agent, or service your application operates. In either mode, your application owns permissions, confirmations, business records, and task state.

Read more about [steering the live model for delegation and tools](https://developers.openai.com/api/docs/guides/live-prompting#delegation) in the prompting guide.

The event examples on this page use `connection`, a connected primary Live WebSocket or sideband from the [connection guides](https://developers.openai.com/api/docs/guides/voice-websockets?api=live). On a primary connection, wait for `session.started` before calling an event helper. An attached sideband already belongs to a running session.





## Choose a delegation mode

With **[Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)**, GPT-Live calls the Responses model you choose, supplies conversation context, and returns backend results to the live conversation. With **[client delegation](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)**, your application prepares the context, runs an agent or workflow, and sends results back to GPT-Live.

Start with Responses delegation if you want GPT-Live to manage requests. Choose client delegation when you need to run your own workflow or review results before sending them to GPT-Live.




| Consideration                 | Favor Responses delegation when…                                                                           | Favor client delegation when…                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Implementation effort**     | You want GPT-Live to prepare backend requests, manage connections, and return results to the conversation. | You want to build and operate those pieces yourself.                                                      |
| **Reviewing backend results** | Backend output can return directly to GPT-Live.                                                            | Your application must validate, redact, combine, or discard results before they reach GPT-Live.           |
| **Backend capabilities**      | Your workflow fits the Responses settings and tools supported by GPT-Live.                                 | You need another backend, multiple models, or API capabilities beyond the managed configuration.          |
| **Context ownership**         | The conversation context supplied by GPT-Live fits your application.                                       | You need to choose exactly which history, memory, and application state each backend request receives.    |
| **Execution policy**          | A configured model and tool loop fits the task.                                                            | You need custom routing between code and models, fallbacks, checkpoints, or budgets across backend steps. |




For example, a travel assistant can send flight-status questions to an airline service and itinerary changes to a separate planning agent. The application chooses which backend to call and what verified result to return to GPT-Live.

In both modes, your application tracks task progress and checks permissions and required user confirmations before running custom tools. GPT-Live can continue speaking while your application reviews a backend result. If your application must control when the user hears audio, add [playback controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).

Client delegation also requires your application to [maintain conversation context](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application). The delegation event contains metadata, not task text; use transcript events and application state to prepare the backend request.

Compare latency, task success, and cost on your own workload when [evaluating your voice agent](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation). For guidance specific to your existing architecture, see [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration#choose-your-delegation-mode).

Choose the mode when you create the session; to change modes, start a new session.

## Configure Responses delegation

Add this delegation configuration when [creating your Live session](https://developers.openai.com/api/docs/guides/live). Choose the Responses model independently of the voice model:

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {
    "model": "gpt-live-1",
    "delegation": {
        "type": "responses",
        "responses": {
            "model": "gpt-6-luna",
            "instructions": "[Your backend prompt]",
        },
    },
}
```


Start with [`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna), or try [`gpt-6-sol`](https://developers.openai.com/api/docs/models/gpt-6-sol) for more complex backend tasks. Compare answer quality and latency on your tasks before choosing a backend model.

Register supported tools in `delegation.responses.tools`. Set `delegation.responses.tool_choice` to `"auto"` to let the backend choose a tool, `"required"` to require a tool call, or `"none"` to disable tool calls. You can also select a named function.

Set `delegation.responses.parallel_tool_calls` to `true` to allow multiple tool calls in a response, or `false` for sequential calls. Your application executes custom functions and checks their dependencies and required approvals. These settings apply after GPT-Live delegates; use the [live prompt](https://developers.openai.com/api/docs/guides/live-prompting#delegation) to guide when it should delegate.

The Responses configuration requires a backend `model` at creation. It supports `function` definitions and `web_search` entries in `tools`. It also exposes `max_output_tokens` (at least 16 when set), `service_tier`, and the `reasoning` and `text` settings supported by the selected backend model. See [Reduce backend latency](#reduce-backend-latency) for settings you can tune.

If [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) is available for your model and project, consider it for latency-sensitive calls. For GPT-Live, select it with `delegation.responses.service_tier: "priority"`.

Send `session.update` with changes in `session.delegation.responses` to update the backend model, instructions, tools, `tool_choice`, or other supported settings during the conversation. Omitted settings keep their current values.

To switch between Responses and client delegation, create a new Live session. Updating `delegation` to `null` selects client mode, so sending it to a running Responses session fails with `immutable_field_update`.

These settings use familiar Responses concepts, but Live supports a subset of the standalone Responses API. Live supplies conversation context and initiates delegated work. Configure the backend through the session; the Live `response.create` command uses that configuration and does not accept a standalone Responses request body.

## Steer the live conversation from your application

Responses delegation manages the backend workflow, but your application can still send context directly to the GPT-Live model. If you monitor the call through a sideband WebSocket or the main event connection, you can use `session.instructions.append`, `session.thinking.append`, or `session.commentary.append` with `delegation_id: null`. For example, a transcript-based guardrail can append an instruction to redirect the conversation. This steers the live model; it does not change the Responses backend prompt or cancel work already in progress.

## Handle Responses delegation

For Responses-backed work, `session.delegation.created` has `target: "responses"` and a `response_id`. Subsequent Responses events arrive inside a `response.event` envelope:

```json
{
  "type": "response.event",
  "event_id": "event_response_1",
  "delegation_id": "item_9tA2cB6n2V8c4X1z7Q5r9",
  "event": {
    "type": "response.output_text.delta",
    "sequence_number": 4,
    "item_id": "msg_123",
    "output_index": 0,
    "content_index": 0,
    "delta": "The forecast is",
    "logprobs": []
  }
}
```

When the top-level event type is `response.event`, dispatch on `envelope.event.type`. Save the outer `delegation_id` to associate the backend event with its delegation. Your handler may also receive nested Responses lifecycle events beyond those shown here.

Live speech and delegated work continue independently. A completed backend response does not itself mean the user heard the answer. Use the Live output transcript and audio for the spoken part of the interaction.





### Run a custom function and return its result

Read completed function calls from nested `response.output_item.done` events. The finished function item contains `call_id`, `name`, and `arguments`; an arguments-done event alone is not sufficient to identify the call.

Track the response ID from nested `response.created` alongside the outer `delegation_id`. Collect the response's function calls from `response.output_item.done`, and use that collection to determine which tool results to submit before continuing.

The forwarded lifecycle events, including `response.completed`, contain `response.output: []` even when function calls need results. These events also have an empty `tools` array, `instructions: null`, and no `input` field. Read the individual output-item events for the function calls.

After executing the authorized operation, append the result as a Responses item:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.item.create",
    event_id: "tool_result_1",
    item: {
      type: "function_call_output",
      call_id: "call_123",
      output: '{"status":"confirmed","order_id":"order_123"}',
    },
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.responses.response_input_item_param import ResponseInputItemParam


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    item: ResponseInputItemParam = {
        "type": "function_call_output",
        "call_id": "call_123",
        "output": '{"status":"confirmed","order_id":"order_123"}',
    }
    await connection.response.item.create(
        event_id="tool_result_1",
        item=item,
    )
```


Then explicitly continue the response:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.create",
    event_id: "continue_1",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.response.create(
        event_id="continue_1",
    )
```


Send a `response.item.create` result for every pending function call, then send `response.create` to continue the backend response. `response.item.create` has no separate success acknowledgment; keep processing errors and nested Responses lifecycle events.

Both commands require Responses delegation. The Live `response.create` command uses the backend configuration stored in the session. Use the event payload shown above, and configure the backend model and other settings through the session.

  

  


## Configure client delegation

Set `delegation` when [creating your Live session](https://developers.openai.com/api/docs/guides/live):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {"model": "gpt-live-1", "delegation": {"type": "client"}}
```


Your application configures and runs the backend: choose its model or service, instructions, tools, and routing. If the backend uses the Responses API, set its model and tools in your application's Responses requests.

When GPT-Live requests help, build the backend request from your saved conversation history and current task state. Check permissions and required confirmations, run the work, and choose which results to return.

## Keep the conversation context in your application

For client delegation, **collect transcripts and keep the current task state yourself**.

Listen for `session.input_transcript.delta` and `session.output_transcript.delta`. These events contain transcript text in `delta`, along with `start_ms` and `end_ms` timestamps. Keep enough history to understand short replies such as “yes,” corrections such as “Thursday, not Friday,” and details supplied earlier. A transcript fragment is not a complete user turn, and transcripts may contain mistakes.

The separate `session.delegation.created` event contains an `offset_ms` timestamp and delegation metadata, including `delegation.id` and `delegation.target`. It does **not** contain the user's utterance or task text. Use the transcript events and application state to work out what the user wants. Save `delegation.id` so you can match updates to that request.

Keep long records and full tool output in the backend. If you create a replacement session, restore the relevant context from your application and check which actions already ran before repeating any work.

### Receive a client delegation

`session.delegation.created` identifies a delegation:

```json
{
  "type": "session.delegation.created",
  "event_id": "event_delegation",
  "offset_ms": 1000,
  "delegation": {
    "id": "item_9tA2bF3h7K9m2P5q8R1s4",
    "type": "delegation",
    "target": "client"
  }
}
```

Save `event.delegation.id` and include it unchanged in updates about this task.

Return a result using that ID:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.commentary.append",
    event_id: "result_123",
    delegation_id: "item_9tA2bF3h7K9m2P5q8R1s4",
    content: "The order shipped today and should arrive tomorrow.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.commentary.append(
        event_id="result_123",
        delegation_id="item_9tA2bF3h7K9m2P5q8R1s4",
        content="The order shipped today and should arrive tomorrow.",
    )
```


Use `session.commentary.append` for results GPT-Live should say aloud; it is trained to paraphrase the text. Use `session.thinking.append` for facts or progress that it can use in later replies without saying them when they arrive. You can send multiple updates with the same client delegation ID.

See [Send the right kind of update](#send-the-right-kind-of-update) for content limits, required fields, and acknowledgment timing.

  




## Start with your existing backend prompt

Use your existing text-agent prompt as a starting point. Keep its task instructions and business rules with the backend, and adapt instructions that assume a text chat or direct control of speech. Explain how to handle voice transcripts and return useful results. Enforce permissions and required confirmations in your application.

```text
## Voice conversation context
You are helping an assistant in a live voice conversation. Transcripts
can contain mistakes, unfinished phrases, and later corrections. Use
the latest context and verified records. If a needed detail is still
unclear, ask for that detail instead of guessing.

## Task instructions
[Your task instructions, business rules, available tools,
and confirmation requirements.]

## Return the result
Return the relevant facts, the task's current status, and the next step.
Report an action as complete after the tool or service confirms success.
If the outcome is unclear, state that and explain what needs to be checked.
```

Keep large structured payloads, lengthy tool output, and Markdown intended for display in the backend. Give GPT-Live the relevant facts and let it choose how to say them. A concise tool result doesn't need an additional model call to rewrite it for speech.

With client delegation, [return the result directly to GPT-Live](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation). With Responses delegation, follow the [function-result flow](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call) to continue backend work.

## Send the right kind of update

Choose an event based on how GPT-Live should use the content:

| What you want to send                                                                                       | Event                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| System-level instructions for the live model, such as a greeting, disclosure, or direction to stop speaking | `session.instructions.append` |
| Information for internal reasoning, not spoken on append but usable for relevant user questions             | `session.thinking.append`     |
| Information the model should speak aloud, paraphrasing the appended text                                    | `session.commentary.append`   |

All three use a plain-string `content`, limited to 500 tokens per append. Include `delegation_id`: use the original client delegation ID for an update about that task, or `null` for general session context. A non-null ID must identify a known client delegation. Instructions still apply to the live session; an ID does not turn them into a separate backend prompt.

An appended instruction can interrupt the model's current speech or behavior. Use it when the application needs to redirect the conversation; enforce any related tool or action block in application state.

For quiet progress during a client-managed task:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.thinking.append",
    event_id: "availability_progress",
    delegation_id: "item_123",
    content: "Checking Thursday availability. No appointment has been booked.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.thinking.append(
        event_id="availability_progress",
        delegation_id="item_123",
        content="Checking Thursday availability. No appointment has been booked.",
    )
```


For a confirmed booking, send the result the user should hear:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.commentary.append",
    event_id: "appointment_result",
    delegation_id: "item_123",
    content: "Your appointment is confirmed for Thursday at 2:00 PM",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.commentary.append(
        event_id="appointment_result",
        delegation_id="item_123",
        content="Your appointment is confirmed for Thursday at 2:00 PM",
    )
```


Only send that result after the booking has actually succeeded. For a session-wide instruction, use `session.instructions.append` with `delegation_id: null`.

For example, after your application blocks a request under its guardrails, you can redirect the conversation:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.instructions.append",
    event_id: "guardrail_block_17",
    delegation_id: null,
    content:
      "Stop speaking about that request. Briefly explain that you cannot help with it, then wait for the user.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.instructions.append(
        event_id="guardrail_block_17",
        delegation_id=None,
        content=(
            "Stop speaking about that request. Briefly explain that you cannot help "
            "with it, then wait for the user."
        ),
    )
```


The instruction does not cancel backend work. [Block the affected action and handle any work already running](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) in your application.

The corresponding acknowledgements are `session.thinking.appended`, `session.commentary.appended`, and `session.instructions.appended`. Match their `client_event_id` to your outgoing `event_id`. The acknowledgment waits for estimated context injection, not for speech or playback to finish. See [when context reaches the model](https://developers.openai.com/api/docs/guides/live-conversations#understand-when-context-reaches-the-model) for timing and error handling.

Send facts and brief progress summaries that GPT-Live can use in the conversation. Content sent with `session.thinking.append` can influence later spoken replies; keep secrets and private backend reasoning in your application.

## Keep updates accurate and useful

During longer tasks, send an update when something useful changes: a step finishes, a delay matters, or the user needs to answer a question.

Use `session.thinking.append` for background progress in client mode. Use `session.commentary.append` when the update is useful to say aloud.

For spoken updates, send `session.commentary.append` with content that matches the task's verified state:

| State                  | Example content                            |
| ---------------------- | ------------------------------------------ |
| Still working          | “I'm checking the available appointments.” |
| Completed              | “You're booked for Thursday at 2:00 PM.”   |
| Failed                 | “That time is no longer available.”        |
| Cancellation confirmed | “Your appointment has been canceled.”      |

When the user changes a request, update the active task in your application. For example, if they change Friday to Thursday, use Thursday for subsequent work and ignore results from the outdated Friday request. Manage any cancellation in the backend, and confirm it succeeded before telling the user that the work was canceled. Interrupting the spoken conversation leaves backend work running.

Before retrying a failed tool call, check whether the original action already happened. For example, a lost response should not cause a second booking. If the outcome is unclear, say so and offer the next useful step.

## Share UI context

Give GPT-Live a concise summary of the current page or task, relevant selections, and facts that help interpret references such as “this option.” Build the summary directly from application state; no extra model call is needed to format it.

Send UI context at session start and when relevant state changes. Skip unchanged updates and combine rapid changes into a short summary of the latest state. Make changes to previous selections explicit:

- **Initial context:** “The user is reviewing a restaurant reservation: August 6 at 7 PM, two guests. No reservation has been made.”
- **Correction:** “The selected time is now 8 PM; the previous selection was 7 PM.”

In either delegation mode, use `session.thinking.append` with `delegation_id: null` for [background context updates](https://developers.openai.com/api/docs/guides/live-conversations#add-context-during-the-conversation). Keep full HTML, DOM trees, large JSON payloads, and interaction logs in your application or backend. Treat page content as reference data, not instructions.

### Accept typed input

Send typed values, such as order numbers, to the backend as user-provided data so it can use the exact text.



  


With Responses delegation, queue a user message for the backend:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.item.create",
    event_id: "typed_order_number",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: "My order number is A0042.",
        },
      ],
    },
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.responses.response_input_item_param import ResponseInputItemParam


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    item: ResponseInputItemParam = {
        "type": "message",
        "role": "user",
        "content": [{"type": "input_text", "text": "My order number is A0042."}],
    }
    await connection.response.item.create(
        event_id="typed_order_number",
        item=item,
    )
```


Send `response.create` when ready to run or continue the backend. If it is waiting for function results, return all required results first. Queuing text does not itself cancel work already running.

  

  


With client delegation, send the typed value directly to the backend that handles the conversation. If it corrects a running task, update that task instead of starting the same work again. You can mirror a short factual summary into the live session with `session.thinking.append`, or use `session.commentary.append` for a result the user should hear.

  




## Add images and visual context

To help a caller discuss a photo or screen, send the image and relevant context from your application to a vision-capable backend. The backend interprets the image and returns relevant text for GPT-Live to use in conversation. The Live audio frontend does not accept images directly.



  


With Responses delegation, configure a vision-capable backend model. Queue a supported Responses image input item with `response.item.create`, then send `response.create` to run or resume backend work. Return all required pending function results before continuing. See [Handle Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#handle-responses-delegation).

  

  


With client delegation, send visual input to the backend that handles delegated requests, alongside the relevant conversation and application state. Return concise findings using the [client result flow](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation).

  




Keep backend image input separate from `session.input`, which seeds the Live frontend with text history at startup. See [Images and vision](https://developers.openai.com/api/docs/guides/images-vision) for supported image formats and model limitations.

## Reduce backend latency

Reduce the time between a request for backend work and a useful result for the conversation. Measure [latency at each stage](https://developers.openai.com/api/docs/guides/voice-agents#measure-latency) to locate delays. Compare useful spoken response time and task success on the same scenarios, and see the [voice agent evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) for evaluation guidance.



  


### Responses delegation

Live manages persistent WebSocket connections to Responses and prepares known request configuration in advance. It can also reuse prior response state when the active connection and state support it. Measure response time and reported cache usage on your workload to see the effect.

Tune the backend through `delegation.responses`:

- `model`: choose the model that handles reasoning and tool selection independently of the voice model.
- `reasoning.effort`: balance reasoning time and task quality using values supported by that model.
- `service_tier`: use `auto`, `default`, `flex`, or `priority`, subject to model support and project access. `auto` follows the project's configuration. Evaluate the performance and cost of the tier you choose.

Update supported settings during the session with `session.update`. Your custom tools still run in your application, so slow service calls, queues, and tool-result buffering can delay the answer even when Live manages the Responses connection. Return each required tool result promptly and [continue the backend response](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#complete-a-client-actionable-function-call).

  

  


### Client delegation

Your application owns the path from delegation receipt to returning a result. Prepare that path while the voice session runs:

- **Reuse backend connections.** Keep the API client and its connection pool alive across delegations. For repeated Responses calls, consider a persistent [Responses WebSocket](https://developers.openai.com/api/docs/guides/websocket-mode).
- **Prepare known configuration.** Initialize instructions, tools, and connections before the first request needs them. Responses WebSocket mode also supports warming up known request state before generation; follow its [setup guidance](https://developers.openai.com/api/docs/guides/websocket-mode#connect-and-create-responses).
- **Stream useful results.** Return coherent, verified chunks with `session.commentary.append`. Use `session.thinking.append` for quiet progress. Preserve the client delegation ID and the 500-token limit per append. Keep private reasoning in the backend and confirm actions before announcing success.
- **Keep reusable input stable.** Preserve instructions, tool definitions and ordering, and unchanged history prefixes. Append new information after reusable content when your backend supports caching and continuation.
- **Forward complete, useful updates.** Send each result as soon as you have enough text to understand it on its own. Have your backend label updates as progress or results so your application can choose the appropriate append event. If it marks these categories with a text prefix, wait for the full prefix before forwarding the update.

Measure the first useful spoken answer when comparing this path with Responses delegation.

  




### React to transcript fragments

Processing transcript fragments in your application is optional and works with either delegation mode. User and assistant [transcript fragments](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) arrive over WebSocket or the WebRTC data channel. You can process them with application logic or a lightweight model to start work before a delegation event arrives, or use the transcript itself to trigger application-owned work.

Use this pattern to:

- **Reduce waiting.** Start a speculative lookup when enough information is available—for example, checking availability while the user continues describing their preferences.
- **Run guardrails.** Check the growing transcript for requests or responses that need intervention. See [Apply conversation guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails).
- **Adapt the conversation.** Look for wording that suggests confusion or frustration, then adjust the experience or send a focused instruction.
- **Update the interface.** Highlight relevant controls, populate suggested fields, or show results as they become available.

For browser applications, use the WebRTC data channel for captions and local UI updates. When transcript processing runs on your server—for guardrails, lightweight model checks, or speculative tool calls—use a [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) to receive events and steer the same GPT-Live session directly.

Process accumulated text when meaningful new information arrives. A fragment may be incomplete, and later speech can change the request. Discard outdated results, coordinate with subsequent delegated work to avoid duplicate actions, and apply your usual permission and confirmation checks before consequential actions.

Send findings or instructions back to GPT-Live using the [append event that matches the update](#send-the-right-kind-of-update). For work started outside a client delegation, use `delegation_id: null`. Your application applies UI changes and manages tool execution and cancellation.

### Shared optimizations

Both delegation modes benefit from the same backend improvements:

- **Choose the model and reasoning effort for the task.** Compare configurations that meet your accuracy requirements. Use lower reasoning effort when it completes the task reliably.
- **Keep answers concise.** Return the facts and status GPT-Live needs to continue the conversation. Avoid long explanations and extra model calls just to rewrite results for speech.
- **Reduce tool delays and unnecessary calls.** Start authorized work when its inputs are ready, reuse results while they remain valid, and avoid repeating a completed lookup.
- **Run independent work concurrently.** Independent lookup calls can run together. Respect dependencies and required confirmations for actions. `parallel_tool_calls` lets a model request multiple calls; your application still schedules and executes its custom functions.

See [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization) for general Responses guidance and [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) for reusing stable input.

## Verify the complete interaction

Verify that the backend completed the intended action and that the client played the expected spoken result. For example, check both the booking record and the audio played after a successful reservation. The backend can finish while the spoken answer is interrupted, so test these outcomes separately.

Track each application action with its own operation ID and each changed request with a task revision, alongside the GPT-Live delegation ID. Use those records to recognize completed work after reconnects or retries and to discard results for outdated requests.

Use [Evaluating voice agents](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) for repeatable tests. For an existing Realtime tool loop or chained backend, follow [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).