# Prompt caching

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Prompt caching fundamentals

Model prompts often contain repetitive content, like system prompts and common instructions. OpenAI routes API requests to servers that recently processed the same prompt, making it faster and less expensive to reuse an exact prompt prefix than to process it from scratch. Prompt Caching works automatically for eligible requests, with no code changes required. It is enabled for all recent [models](https://developers.openai.com/api/docs/models), `gpt-4o` and newer.

This guide describes how prompt caching works in detail, so that you can optimize your prompts for lower latency and cost.

### Caching best practices

Cache hits are only possible for exact prefix matches within a prompt. To realize caching benefits, place static content like instructions and examples at the beginning of your prompt, and put variable content, such as user-specific information, at the end. This also applies to images and tools, which must be identical between requests.

- Keep instructions, tools, schemas, and shared context stable. Place request-specific content after the reusable prefix.
- Set [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-prompt_cache_key) on requests that share long, common prompt prefixes. Reuse the same key for those requests to help improve cache hit rates.
- Monitor cache reads with `cached_tokens`. On GPT-5.6 and later, use `cache_write_tokens` to compare cache-write costs with later cache reads.

![Prompt comparison showing a cache hit when prefixes match and a cache miss when early content differs](https://openaidevs.retool.com/api/file/8593d9bb-4edb-4eb6-bed9-62bfb98db5ee)

### How prompt caching works

By default, caching is enabled automatically for prompts that are 1,024 tokens or longer. When you make an API request, the following steps occur:

1. **Cache routing**

   Requests are routed to a machine based on `prompt_cache_key`, with a hash of the initial prefix of the prompt as a secondary key.

2. **Cache lookup**

   The system checks whether the initial portion (prefix) of your prompt exists in the cache on the selected machine.

3. **Cache hit**

   If a matching prefix is found, the system uses the cached result. This decreases latency and bills those tokens at the cached-input rate.

4. **Cache miss**

   If no matching prefix is found, the system processes your full prompt. When automatic caching is enabled, it may write an eligible prefix to cache on that machine for future requests.

For GPT-5.6 and later, 1,024 tokens is a strict minimum. For earlier models,
  the minimum varies by model from 1,024 to 2,048 tokens, so prompts just above
  1,024 tokens may not cache consistently.

### How caching differs by model

| Behavior                   | GPT-5.6 and later                                       | Earlier models                                                      |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Cache matching             | Exact matching at eligible cache breakpoints            | Automatic best-effort reuse of matching prefixes                    |
| Explicit cache breakpoints | Supported. Implicit caching is also available.          | Not supported. Caching is automatic.                                |
| Minimum cacheable prefix   | 1,024 tokens                                            | 1,024 to 2,048 tokens, depending on the model                       |
| Cache write charges        | 1.25× the uncached input token rate                     | No additional cache-write fee                                       |
| Cache lifetime             | 30-minute exact TTL set with `prompt_cache_options.ttl` | Model-dependent maximum retention set with `prompt_cache_retention` |

For GPT-5.6 and later models, see [Prompt caching for GPT-5.6 and later models](#prompt-caching-for-gpt-56-and-later-models). For earlier models, see [Prompt caching for earlier models](#prompt-caching-for-earlier-models).

## Prompt caching for GPT-5.6 and later models

GPT-5.6 and later model families cache exact prompt prefixes at cache breakpoints. By default, the service places an implicit breakpoint at the latest user or tool message. Unlike earlier models, it does not automatically fall back to the longest matching unmarked prefix before that breakpoint.

To improve cache reuse, identify the prompt content that stays the same across requests. Then choose a breakpoint that ends after that content and use a consistent `prompt_cache_key`.

### How cache breakpoints work

A cache breakpoint marks the end of a reusable prompt prefix. The prefix includes the marked content block and all prompt content rendered before it. Content after the breakpoint can change without invalidating that prefix.

For a prefix to be eligible for caching, it must contain at least 1,024 tokens through the breakpoint. The minimum applies to the complete rendered prefix, not just the marked content block.

**Cache writes and cache reads**

A cache write creates an entry for an eligible prompt prefix. A cache read reuses an entry that an earlier request wrote.

1. The first request writes an eligible prefix at a cache breakpoint.
2. A later request can read that prefix when the content through an eligible breakpoint matches the earlier cache entry and the two requests share the same `prompt_cache_key`.
3. A change before the breakpoint changes the prefix and will prevent a cache hit.
4. A change after the breakpoint does not invalidate the earlier cached prefix.

Repeated prompt content alone does not guarantee a cache hit. If no matching entry was written at an eligible breakpoint, the system cannot read that prefix from the cache.

**When the default breakpoint works**

Implicit caching works well when a conversation grows by appending new messages and the earlier conversation history stays the same.

```text
Request 1: Instructions → User message 1 [implicit breakpoint]
Request 2: Instructions → User message 1 → Assistant message 1 → User message 2 [implicit breakpoint]
```

The first request can write the prefix through user message 1. On the next request, that earlier breakpoint can provide a cache read. The newly appended content can then be written at the latest implicit breakpoint.

**When changing content prevents reuse**

Some applications send separate requests that share the same instructions but have different timestamps and user messages. Unlike successive turns in a conversation, these requests do not share conversation history.

```text
Request 1: Stable instructions → Timestamp 1 → User message 1 [implicit breakpoint]
Request 2: Stable instructions → Timestamp 2 → User message 2 [implicit breakpoint]
```

The first request writes a prefix that includes timestamp 1 and user message 1. On the second request, timestamp 2 and user message 2 change the prefix at the breakpoint. If no earlier matching entry exists, `cached_tokens` can be `0` and the service can write the changing prefix again.

Add an explicit breakpoint at the end of the stable content to make that content reusable:

```text
Stable instructions [explicit breakpoint] → Timestamp → User message
```

The first request writes the stable prefix. Later requests with the same prefix and `prompt_cache_key` can read that entry, even when the timestamp and user message change.

### Choose a caching mode

Use `prompt_cache_options.mode` to set the request-wide caching policy.

**Implicit caching**

- `implicit` is the default. OpenAI places a cache breakpoint on the latest user or tool message and also uses any explicit breakpoints you provide.
- Use implicit caching when the prompt grows by appending reusable content. Earlier eligible breakpoints can provide cache reads, while the latest message creates a new checkpoint for future requests.

**Explicit breakpoints with implicit caching**

- You can add an explicit breakpoint without changing the default caching mode. This lets requests read a stable prefix while the implicit breakpoint continues to cache the latest eligible message.
- This approach is useful when both the shared prefix and the growing conversation history are likely to be reused. However, the latest implicit breakpoint can still write a changing suffix to the cache.

**Explicit-only caching**

- Set `prompt_cache_options.mode` to `explicit` to disable the implicit breakpoint. Only explicit breakpoints are used for cache reads and writes.
- Use explicit-only mode when the prompt has a stable prefix followed by request-specific content that is unlikely to be reused. This caches the reusable prefix without creating a new cache write for the changing suffix.
- Adding an explicit breakpoint does not automatically switch a request to explicit-only mode. If you set `mode` to `explicit` but provide no explicit breakpoints, the request does not use prompt caching or incur cache-write charges.

### Add explicit cache breakpoints

Add `prompt_cache_breakpoint: { "mode": "explicit" }` to the last supported content block in the reusable prefix. The breakpoint includes that block and all prompt content rendered before it.

The following examples are abbreviated to show the request shape. In a real request, the rendered prefix through the marked breakpoint must contain at least 1,024 tokens.



Responses API


    This request places an explicit breakpoint after stable developer instructions. Explicit-only mode prevents the changing user message from creating an additional implicit cache write.

```json
{
  "model": "gpt-5.6",
  "prompt_cache_key": "support:knowledge-base-v1",
  "prompt_cache_options": {
    "mode": "explicit"
  },
  "input": [
    {
      "type": "message",
      "role": "developer",
      "content": [
        {
          "type": "input_text",
          "text": "Follow the shared support policies and reference material...",
          "prompt_cache_breakpoint": {
            "mode": "explicit"
          }
        }
      ]
    },
    {
      "type": "message",
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Where is order 1234?"
        }
      ]
    }
  ]
}
```


    Top-level `instructions` cannot contain a `prompt_cache_breakpoint`. To mark reusable developer instructions, place them in an `input_text` block inside a developer message, as shown above.

  

  

    
Chat Completions API


    This request marks the system-message prefix. Explicit-only mode limits cache reads and writes to the marked stable content.

```json
{
  "model": "gpt-5.6",
  "prompt_cache_key": "support:knowledge-base-v1",
  "prompt_cache_options": {
    "mode": "explicit"
  },
  "messages": [
    {
      "role": "system",
      "content": [
        {
          "type": "text",
          "text": "You are a support assistant. Follow the shared policies...",
          "prompt_cache_breakpoint": {
            "mode": "explicit"
          }
        }
      ]
    },
    {
      "role": "user",
      "content": "What should I do next?"
    }
  ]
}
```



To combine an explicit breakpoint with the default implicit breakpoint, omit `prompt_cache_options.mode` or set it to `implicit`.

**Supported content blocks**

The Responses API supports breakpoints on `input_text`, `input_image`, and `input_file` blocks. The Chat Completions API supports them on `text`, `image_url`, `input_audio`, `file`, and `refusal` blocks.

Only `explicit` is valid for `prompt_cache_breakpoint.mode`. A marker on an unsupported or non-cacheable block returns a `400 invalid_request_error`.

Tool definitions, structured output schemas, messages, images, and files can contribute to the rendered prefix. Keep the content, order, and relevant settings identical across requests that should share a cache.

### Use multiple cache breakpoints

Use multiple explicit breakpoints when parts of a prompt change at different rates. For example, shared instructions can stay stable while reference material is updated more often. Separate breakpoints let requests reuse the longest eligible prefix that remains unchanged.

Each request can create up to four new cache writes. Breakpoints from earlier conversation turns are read-only: they can match the cache, but the request does not write them again. If more than four breakpoints are set, only the last four are written.

In `implicit` mode, the breakpoint on the latest message uses one write slot. Up to the latest three explicit breakpoints can use the remaining slots. In `explicit` mode, up to the latest four explicit breakpoints can create new cache writes.

For cache reads, OpenAI considers up to the latest 50 breakpoints in the conversation. When several breakpoints match cached content, the service reads from the longest matching prefix.

### Improve cache matching with a prompt cache key

Set `prompt_cache_key` on requests that share long, common prompt prefixes. Reuse the same key for those requests to help route them to the same cache and improve cache hit rates. Common values for `prompt_cache_key` include session IDs and user IDs.

For GPT-5.6, you must set `prompt_cache_key` to use the more reliable matching for both implicit and explicit caching. At each breakpoint, the service matches the key with the exact prompt prefix. Without a key, requests may still receive automatic cache hits, but they do not use the improved matching.

Keep the total traffic across all prefixes for each key to approximately 15 requests per minute. If a key receives a higher rate, some requests may miss the cache. For higher-volume workloads, partition traffic across more keys and use a stable mapping so requests with the same key continue to share prefixes.

### Measure cache reads and writes

Monitor `cached_tokens` and `cache_write_tokens` to understand whether your breakpoint placement produces cache reuse or repeated cache writes.

`cached_tokens` is the number of input tokens read from the cache. `cache_write_tokens` is the number of input tokens newly written to the cache.

For the Responses API, both fields appear in `usage.input_tokens_details`. For the Chat Completions API, they appear in `usage.prompt_tokens_details`.

```json
{
  "usage": {
    "input_tokens": 2600,
    "input_tokens_details": {
      "cached_tokens": 2000,
      "cache_write_tokens": 400
    }
  }
}
```

In this example, 2,000 tokens were read from the cache and 400 additional tokens were written. The remaining 200 input tokens were neither read nor written. A longer cache write does not bill the already cached 2,000 tokens again.

**Understand cache-write pricing**

Cache reads, cache writes, and ordinary input tokens are separate billing categories.

1. Cached input tokens are billed at 0.1× the uncached input token rate.
2. Tokens written to the cache are billed at 1.25× the uncached input token rate.
3. Tokens that are neither read nor written are billed at the uncached input token rate.

The 1.25× cache-write rate is the total rate for written tokens. It is not an additional charge on top of another full input-token charge. A breakpoint does not create a charge by itself. Charges apply to tokens that are actually written to the cache.

Repeated writes increase cost when the resulting cache entries are not reused. If `cache_write_tokens` stays high while `cached_tokens` remains low, check whether an implicit breakpoint includes content that changes between requests.

### Set cache lifetime

Use `prompt_cache_options.ttl` to set the lifetime of all breakpoints written by a request. The only supported value is `30m`, which is also the default.

The 30-minute lifetime begins when the prefix is written and refreshes whenever the prefix is reused. A cached prefix remains eligible for reuse for 30 minutes after its most recent write or reuse, though OpenAI may retain it longer.

Reusing a cached prefix refreshes its lifetime without creating another cache-write charge.

### Troubleshoot common caching issues

- **`cached_tokens` is zero:** Check that the rendered prefix through the breakpoint contains at least 1,024 tokens. Confirm that an earlier request wrote the same prefix and that related requests use the same `prompt_cache_key`.

- **Cache writes repeat on every request:** Check whether a timestamp, changing user input, tool-call history, or other request-specific content appears before the eligible breakpoint. Move the explicit breakpoint to the end of the stable prefix.

- **Cache reads and writes are both nonzero:** In implicit mode, a request can read an earlier cached prefix and write newly appended content at the latest breakpoint. Use explicit-only mode if that new content should not be cached.

- **Explicit mode produces no cache hits:** Confirm that at least one supported content block has `prompt_cache_breakpoint: { "mode": "explicit" }` and that the rendered prefix through the marker meets the 1,024-token minimum.

- **Cache hits decrease at higher request volumes:** Keep traffic for each `prompt_cache_key` to approximately 15 requests per minute. Use stable, deterministic keys to partition larger workloads.

- **A previously cached prompt no longer matches:** Check whether tool definitions, tool ordering, structured output schemas, images, prompt content, or request settings changed before the breakpoint.

- **A breakpoint is rejected:** Attach the marker to a supported content block and use `explicit` as its mode. Do not attach a breakpoint to top-level Responses API `instructions`.

## Prompt caching for earlier models

Earlier models use automatic prompt caching to reuse matching prompt prefixes. When an eligible request is routed to a machine that recently processed the same prefix, the service can reuse the cached result instead of processing that content again.

Prompt caching works automatically for supported models. A consistent `prompt_cache_key`, stable prompt structure, and an appropriate `prompt_cache_retention` setting can improve cache reuse.

### How automatic prompt caching works

Cache hits are only possible for exact prefix matches within a prompt. When a request arrives, the service checks whether an eligible initial portion of the prompt already exists in the cache on the selected machine.

If a matching prefix is available, the service can reuse an eligible matching prefix and report those tokens in `cached_tokens`. If no match is available, the service processes the full prompt and may cache eligible content for future requests.

Cache reuse is best-effort. A cache hit depends on the prompt prefix remaining identical, the cached content still being available, and the request reaching a machine that holds the matching entry.

For example, separate requests can reuse shared instructions and reference material while the user message changes:

```text
Request 1: Shared instructions → Shared reference material → User message 1
Request 2: Shared instructions → Shared reference material → User message 2
```

When the shared prefix is eligible and available, the second request can reuse that content without requiring additional request-specific cache configuration.

**Minimum cacheable prefix**

The minimum cacheable prefix length varies by model and can range from 1,024 to 2,048 tokens. Prompts just above 1,024 tokens may not be cached consistently.

Cache hits occur in increments of 128 tokens. The number of cached tokens can therefore be smaller than the full length of the shared prompt content.

Make sure the repeated portion of the prompt meets the minimum for the model. A request can exceed the minimum overall and still fail to produce a cache hit if its matching prefix is too short.

### Structure prompts for reuse

Cache hits are only possible for exact prefix matches within a prompt. To realize caching benefits, place static content like instructions and examples at the beginning of your prompt, and put variable content, such as user-specific information, at the end. This also applies to images and tools, which must be identical between requests.

Keep system or developer instructions, shared reference material, examples, tool definitions, and structured output schemas stable. Put user input, request identifiers, timestamps, and other changing content after the reusable prefix.

If a dynamic value is needed only for logging or debugging, consider placing it in request metadata instead of inserting it into the prompt.

**Keep tools and schemas identical**

Tool definitions, tool ordering, and structured output schemas contribute to the prompt prefix. Changes to tool descriptions, parameter schemas, schema keys, or ordering can reduce cache reuse.

When you need to restrict which tools are available on a particular request, keep the underlying `tools` array unchanged and use `allowed_tools` where supported.

**Preserve conversation history**

For multi-turn conversations, append new user and assistant messages instead of rewriting earlier messages. Changing, deleting, or reordering earlier content changes the prefix and can cause a cache miss.

Context truncation, summarization, and compaction can reduce prompt size, but they can also reset the reusable prefix. Balance the savings from shorter prompts against the loss of existing cache reuse.

### Improve cache hit rates with a prompt cache key

Set `prompt_cache_key` on requests that share long, common prompt prefixes. Reuse the same key for those requests to help route them to the same cache and improve cache hit rates.

Requests are routed based on the initial prompt prefix. When you provide `prompt_cache_key`, it is combined with the prefix hash, allowing you to influence routing. This is especially beneficial when many requests share long, common prefixes.

Keep the total traffic across all prefixes for each key to approximately 15 requests per minute. If a key receives a higher rate, some requests may miss the cache. For higher-volume workloads, partition traffic across more keys and use a stable mapping so requests with the same key continue to share prefixes.

A cache key improves routing but does not make different prompt prefixes match. Keep the prefix and the cache key consistent across requests that should share cached content.

<a id="prompt-cache-retention"></a>

### Configure prompt cache retention

Use `prompt_cache_retention` to select the retention policy for a supported Responses API or Chat Completions request. Available values depend on the model.

For models that support both in-memory and extended retention, prompt cache pricing is the same for both policies.

**In-memory prompt cache retention**

In-memory prompt cache retention is available for models that accept `prompt_cache_retention: "in_memory"`.

When using the in-memory policy, cached prefixes generally remain active for 5 to 10 minutes of inactivity, up to a maximum of one hour. In-memory cached prefixes are held only in volatile memory.

<a id="extended-prompt-cache-retention"></a>

**Extended prompt cache retention**

Extended prompt cache retention keeps cached prefixes active for longer, up to a maximum of 24 hours.

The 24-hour period is a maximum, not a guarantee that every request will receive a cache hit. Reuse still depends on an exact matching prefix, cache availability, and request routing.

**Models that support extended retention**

Extended prompt cache retention is available for the following models:

- `gpt-5.5`
- `gpt-5.5-pro`
- `gpt-5.4`
- `gpt-5.2`
- `gpt-5.1-codex-max`
- `gpt-5.1`
- `gpt-5.1-codex`
- `gpt-5.1-codex-mini`
- `gpt-5.1-chat-latest`
- `gpt-5`
- `gpt-5-codex`
- `gpt-4.1`

**Retention defaults and Zero Data Retention**

For `gpt-5.5` and `gpt-5.5-pro`, only `24h` is supported through `prompt_cache_retention`.

For models that support both `in_memory` and `24h`, the default depends on your organization's data retention policy:

- Organizations without Zero Data Retention enabled default to `24h`.
- Organizations with Zero Data Retention enabled default to `in_memory` when `prompt_cache_retention` is not specified.

Verify the available retention policies for your model and organization before selecting a value.

### Measure cache hits and costs

Use `cached_tokens` to see how many input tokens were read from the cache. The field is present even when no tokens were cached.

For the Responses API, the field appears in `usage.input_tokens_details.cached_tokens`. For the Chat Completions API, it appears in `usage.prompt_tokens_details.cached_tokens`.

The following Chat Completions usage example shows a request that reused 1,920 of its 2,006 prompt tokens:

```json
{
  "usage": {
    "prompt_tokens": 2006,
    "completion_tokens": 300,
    "total_tokens": 2306,
    "prompt_tokens_details": {
      "cached_tokens": 1920
    }
  }
}
```

In this example, the remaining 86 prompt tokens were not read from the cache. Monitor cached-token usage across requests to identify changes in prompt structure, traffic patterns, or cache availability.

**Pricing and rate limits**

Creating a cache entry has no additional fee. Cached input is billed at the cached-input rate when the model offers one. Rates and discounts vary by model.

Cached input tokens still count toward tokens-per-minute rate limits. Prompt caching does not change rate-limit calculations or guarantee identical model outputs.

### What can be cached

- **Messages:** System, developer, user, and assistant messages can contribute to a reusable prompt prefix.
- **Images:** Image inputs can be cached when the images, their order, and their detail settings remain the same.
- **Tools:** Tool definitions, descriptions, parameter schemas, and tool ordering can contribute to the prefix.
- **Structured outputs:** A structured output schema can be included in the reusable prompt prefix.
- **Audio:** Supported audio inputs can contribute to cacheable prompt content.

All reusable content must remain identical across requests. Changes earlier in the prompt can invalidate reuse for the content that follows.

## Frequently asked questions

1. **How is data privacy maintained for caches?**

   Prompt caches are not shared between organizations. Only members of the same organization can access caches of identical prompts. Cache data handling depends on the model and retention policy. See the [Your data](https://developers.openai.com/api/docs/guides/your-data) guide for the current application-state, Zero Data Retention, and data residency details.

2. **Does Prompt Caching affect output token generation or the final response of the API?**

   Prompt Caching does not change how the model generates output tokens. The model computes a new response from the cached prompt prefix, so otherwise identical nondeterministic requests are not guaranteed to return identical output.

3. **Is there a way to manually clear the cache?**

   Manual cache clearing is not currently available. For models before the GPT-5.6 family that use in-memory retention, typical cache evictions occur after 5-10 minutes of inactivity, though entries can remain for up to one hour during off-peak periods. For GPT-5.6 models and later model families, cached prefixes remain eligible for reuse for 30 minutes and may be retained longer.

4. **Will I be expected to pay extra for writing to Prompt Caching?**

   Cache writes have no additional fee on models before the GPT-5.6 family. On GPT-5.6 models and later model families, cache writes are billed at 1.25× the uncached input token rate and reported in `cache_write_tokens`. Cache reads continue to be reported in `cached_tokens`.

5. **Do cached prompts contribute to TPM rate limits?**

   Yes, as caching does not affect rate limits.