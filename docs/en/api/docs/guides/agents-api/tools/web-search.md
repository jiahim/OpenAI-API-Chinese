# Web search

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use web search when your agent needs to look up information to answer a question or complete a task.

## Example: Explain why Mars looks red

Send this JSON body to `POST /v1/agents/sessions` to create a session and stream the answer. It enables web search in `live` mode:

```json
{
  "agent": {
    "model": "gpt-6-astra",
    "reasoning": { "effort": "low" },
    "tools": [{ "type": "web_search", "mode": "live" }]
  },
  "environment": { "type": "none" },
  "input": "Search NASA's website for why Mars looks red. Explain it in two sentences and include a source link.",
  "stream": true
}
```

### Result

In a test run on September 10, 2026, the agent searched NASA's website and streamed this answer:

> Mars looks red because iron minerals in its soil oxidize, or rust, giving the surface a reddish color. This rusty appearance is why it’s called the “Red Planet,” according to [NASA’s Mars Facts](https://science.nasa.gov/mars/facts/).

This is a recorded example. Your answer may vary.

If you leave `web_search` out of `agent.tools`, built-in web search is off. Asking for a search in the prompt does not turn it on.

## Search mode

- **`live` (default)**: Allow search to access the live internet. Used when you include `web_search` but leave out `mode`.
- **`cached`**: Search saved web content without accessing the live internet.
- **`disabled`**: Turn off built-in web search, just like leaving the tool out.

## Optional settings

Add these fields to the same `web_search` entry:

| Setting           | What it does                                                                                                        | If omitted                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `context_size`    | How much information from search the model receives: `low`, `medium`, or `high`.                                    | Uses `medium`.                                                                                                                         |
| `allowed_domains` | Which websites search may include. Provide up to **100 domain names**, such as `["python.org", "docs.python.org"]`. | No domain filter is applied.                                                                                                           |
| `location`        | Helps tailor results to a place. Accepts `country`, `region`, `city`, and `timezone`.                               | No location is supplied to search. Missing location details may lead to less relevant results or no useful matches for local searches. |