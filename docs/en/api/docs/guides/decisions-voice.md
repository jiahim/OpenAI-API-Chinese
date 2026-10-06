# Connect voice to Decisions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use the [Live API](https://developers.openai.com/api/docs/guides/live) for voice conversations and the [Decisions API](https://developers.openai.com/api/docs/guides/decisions) to select actions from spoken requests. With [client delegation](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation), GPT-Live continues speaking and listening while your app calls Decisions, runs the selected action, and returns the result.

## Control a browser by voice

This example shows how to add voice controls to a browser.

When a user says “Reload this page,” send the conversation and current browser state to Decisions with three choices: `back`, `reload`, and `noop`. Decisions selects `reload`. Your app reloads the page, updates its state, and tells GPT-Live what happened.



> Illustration: GPT-Live handles the voice conversation while the app sends transcripts and browser state to Decisions. Decisions selects reload. The app reloads the page, updates its state, and returns the result to GPT-Live.



### Connect a voice session

Create a [Live session](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live#connect-a-browser-to-gpt-live) with `delegation: { type: "client" }` and tell GPT-Live which actions your app supports. When you receive [`session.delegation.created`](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#receive-a-client-delegation), save `event.delegation.id` and start the Decisions request. Use this ID to return the result to GPT-Live.

### Build the Decisions prompt

Track the current app state and collect user and assistant transcripts from [`session.input_transcript.delta` and `session.output_transcript.delta`](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#keep-the-conversation-context-in-your-application).

Combine those transcripts with the user's latest request and current app state:

```text
User conversation:
user: Which page is open?
assistant: The documentation page.

Last user request:
Reload this page.

Current state:
Active tab: Documentation. Page loaded.
Available actions: back, reload, noop.
```

### Select and run an action

Send the prompt and available choices to the Decisions API from your server. Keep `OPENAI_API_KEY` on the server:

```bash
curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-luna",
    "input": "User conversation:\nuser: Which page is open?\nassistant: The documentation page.\n\nLast user request:\nReload this page.\n\nCurrent state:\nActive tab: Documentation. Page loaded.\nAvailable actions: back, reload, noop.",
    "questions": [{
      "type": "choice",
      "name": "browser_action",
      "instructions": "Choose the requested, currently available action. Choose noop if no action fits.",
      "choices": [
        {"value": "back", "description": "Go back one page."},
        {"value": "reload", "description": "Reload the current page."},
        {"value": "noop", "description": "Take no action."}
      ]
    }]
  }'
```

Find the answer named `browser_action` in the response’s `answers` array and read its `choice`. Run the matching action: `reload` reloads the current page, `back` goes back one page, and `noop` does nothing. Skip the action if the request was canceled or it no longer fits the current app state.

### Return the result to GPT-Live

Update your app state with the current page, load status, and whether the action succeeded. Use this state in the next Decisions prompt.

Send the result to GPT-Live with [`session.commentary.append`](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update) and the saved delegation ID. This prompts GPT-Live to tell the user what happened. For a successful reload, send:

```json
{
  "type": "session.commentary.append",
  "delegation_id": "<event.delegation.id>",
  "content": "The documentation page reloaded successfully and is ready."
}
```

Use `session.thinking.append` to update GPT-Live’s context without prompting it to speak. Keep each append within 500 tokens.

## Route complex requests to a reasoning model

Use Decisions to select a supported action or route a more complex request to a reasoning model. In a slide presenter, “Go to the next slide” maps to `next_slide`, while “Compare these two plans and recommend one” maps to `reason`.

Include the conversation and current state in `input`, then send the request to `POST /v1/decisions`:

```json
{
  "model": "gpt-6-luna",
  "input": "User: Compare these two plans and recommend one. Current state: slide 3 of 10 is open and both plans are available.",
  "questions": [
    {
      "type": "choice",
      "name": "route",
      "instructions": "Choose a matching slide action that is available in the current state. Otherwise, choose reason.",
      "choices": [
        {
          "value": "next_slide",
          "description": "Go to the next slide."
        },
        {
          "value": "previous_slide",
          "description": "Go to the previous slide."
        },
        {
          "value": "first_slide",
          "description": "Go to the first slide."
        },
        {
          "value": "reason",
          "description": "Use a reasoning model for analysis, planning, or other requests."
        }
      ]
    }
  ]
}
```

Read the `route` answer's `choice`. For a slide action, validate it against the current state and run the matching handler. For `reason`, call the [Responses API with a reasoning model](https://developers.openai.com/api/docs/guides/reasoning#get-started-with-reasoning), passing the original request and relevant context, such as the plans' contents.

Keep the session in client-delegation mode for both routes. Your app manages continuation and cancellation and returns the result with the same delegation ID.

## Other uses

Use the same workflow with choices and state from your application:

- **Slide navigation:** Offer `next`, `previous`, `start`, and `end` based on the current slide.
- **UI actions:** Map choices such as `click_search` to element IDs from the current UI state. Check that the element is still available before acting.
- **Voice-guided games:** Use the spoken goal and current game state to choose an available button. Repeat until the app confirms success or the user cancels, and send progress updates to GPT-Live.
- **Robot gestures:** Map requests such as “Wave hello” to `nod`, `shake_head`, or `wave`, then send the selected gesture to the robot controller.
- **Media controls:** Offer `play`, `pause`, and `next_track` based on the player’s current state.