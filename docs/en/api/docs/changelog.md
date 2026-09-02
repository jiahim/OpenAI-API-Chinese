# Changelog

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

> The latest features and updates to the OpenAI API.

Upcoming deprecations are listed on the [deprecations page](/api/docs/deprecations).

## September, 2026

### Sep 2

Update

Updated API errors so applications can distinguish traffic that increases too quickly from temporary model overload.

Traffic that increases too quickly can return a `429` error with the `slow_down` code. Temporary model overload returns a `503` error with the `server_is_overloaded` code. Both responses may include `Retry-After`. When the header is present, wait at least as long as it specifies before retrying. If it's missing, use exponential backoff. See the [error codes guide](https://developers.openai.com/api/docs/guides/error-codes) and [rate limits guide](https://developers.openai.com/api/docs/guides/rate-limits).

## August, 2026

### Aug 29

Feature

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) and [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) are now generally available for the OpenAI API. Configure certificates and X.509 identity providers directly in the [Platform console](https://platform.openai.com/settings/organization/security), with access controlled by your organization's roles and permissions.

### Aug 26

Update · Model: whisper-1 · Model: gpt-4o-transcribe · Model: gpt-4o-mini-transcribe · Model: gpt-4o-transcribe-diarize · API: v1/audio/transcriptions · API: v1/realtime

Announced the deprecation of `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, and `gpt-4o-transcribe-diarize`. These models will shut down on February 26, 2027. Migrate to [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) or [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe). See the [transcription guide](https://developers.openai.com/api/docs/guides/transcription) and [deprecations page](https://developers.openai.com/api/docs/deprecations).

The Assistants API shut down on August 26, 2026. Migrate to the Responses API and Conversations API using the [migration guide](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

Feature

API customers can now select regional processing for an individual request by using a prefixed domain with an API key from a project having Global geography. Existing eligibility, data retention control, endpoint, and model support requirements continue to apply. Learn more in the [data controls guide](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

Update · Model: gpt-5.6-sol

GPT-5.6 Sol now costs $4 per million input tokens and $20 per million output tokens, representing 20% lower input pricing and 33% lower output pricing. GPT-5.6 Sol’s promotional pricing is available at least through November 21, 2026. See [pricing details](https://developers.openai.com/api/docs/pricing).

### Aug 20

Feature

Released the [Prompt Caching dashboard](https://platform.openai.com/usage?usage_section=prompt-caching) on the OpenAI API platform. Track your cache hit rate over time, cache reads per write, and the breakdown of cache-read, cache-write, and uncached tokens to understand your caching efficiency and identify opportunities to improve. Filter metrics by model and service tier.

### Aug 20

Update · Model: gpt-image-2 · Model: gpt-image-2-2026-04-21 · API: v1/images/generations · API: v1/images/edits · API: v1/responses

Transparent backgrounds are now available in preview for `gpt-image-2` and `gpt-image-2-2026-04-21` in the Images API and the Responses API image generation tool. Set `background` to `transparent` and use `png` or `webp` output; `jpeg` does not support transparent backgrounds. Learn more in the [image generation guide](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

Announcement

Announced Ultrafast mode, a new API service tier for GPT-5.6 Sol that runs up to 14x faster than Standard processing. Available in limited preview to select customers. Sign up to receive updates on Ultrafast mode [here](https://openai.com/form/ultrafast/).

### Aug 7

Feature · Model: gpt-5.6-cyber · Model: gpt-daybreak-red-latest · Model: gpt-daybreak-blue-latest · API: v1/responses

Daybreak now offers two access tiers for approved defenders: Daybreak Blue and Daybreak Red. Use them to move from security findings to validated fixes in explicitly authorized engagements.

Start with Daybreak Blue for most defensive security work. It provides access to general-purpose models such as GPT-5.6 Sol for vulnerability discovery, secure code review, detection engineering, incident response, malware analysis, and patch validation. Read more [here](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red provides separately approved access to purpose-trained models such as [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) for authorized vulnerability reproduction, exploit validation, penetration testing, red teaming, and complex system analysis.

These models require separate approval and provisioning. You can apply to join the Daybreak program [here](https://openai.com/daybreak/). More details on pricing [here](https://developers.openai.com/api/docs/pricing).

### Aug 6

Update · Model: chat-latest

Updated the **chat-latest** snapshot, which points to the latest model available in ChatGPT for Plus and Pro users. We recommend leveraging [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) for production API usage, but feel free to use this model to test the latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

Update · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

Fast mode now supports long-context requests for GPT-5.6 Sol, GPT-5.6 Terra, and GPT-5.6 Luna. As of today, long-context prompts exceeding 272K tokens can run in [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode), delivering speeds up to 2.5× faster than the Standard tier. See [pricing details](https://developers.openai.com/api/docs/pricing).

### Aug 4

Feature

Customers can now filter and group data by API key in the [Usage and Costs dashboards](https://platform.openai.com/settings/organization/usage). The [Usage API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) and [Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) also support the API key dimension for programmatic reporting and analysis.

## July, 2026

### Jul 30

Update · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions

Starting July 30, GPT-5.6 Luna costs 80% less, while GPT-5.6 Terra costs 20% less. See [pricing details](https://developers.openai.com/api/docs/pricing).

We're also introducing [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) in the API, which replaces our Priority Processing offering. For GPT-5.6 Sol, Fast mode now delivers up to 2.5× faster speeds than standard processing at twice the price. This change is backward compatible: requests tagged priority will automatically use Fast mode.

### Jul 29

Feature

Released the official [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) for managing OpenAI API Platform resources as infrastructure as code.

Provision and manage projects, users, groups, roles, access assignments, service accounts, certificates, invitations, and project-level rate limits. Use standard Terraform workflows to review and apply changes, import existing resources, and detect and reconcile configuration drift. Install the provider from the [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

Feature · Model: gpt-transcribe · Model: gpt-live-transcribe · API: v1/audio/transcriptions · API: v1/realtime

Released [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) for accurate file transcription and final transcripts of committed Realtime turns, along with [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) for low-latency streaming transcription.

Both models support free-form transcription context, keyword hints, and multiple expected input languages. Compare supported outputs and workflows in the [transcription guide](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

Feature

Added hard spend limits for organizations and projects on the OpenAI API platform. Set a monthly cap that causes affected API requests to return a `429` error when tracked spend reaches the limit. Use spend alerts for notification before traffic is interrupted. Read more in the [spend limits guide](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

Released the [GPT-5.6 model family](https://developers.openai.com/api/docs/guides/latest-model), including GPT-5.6 Sol for frontier capability, GPT-5.6 Terra for a balance of intelligence and cost, and GPT-5.6 Luna for efficient, high-volume workloads. The `gpt-5.6` alias routes requests to `gpt-5.6-sol`.

GPT-5.6 adds [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [explicit prompt caching controls](https://developers.openai.com/api/docs/guides/prompt-caching), [persisted reasoning, `max` reasoning effort, and Pro mode](https://developers.openai.com/api/docs/guides/reasoning), and [Multi-agent orchestration in beta for the Responses API](https://developers.openai.com/api/docs/guides/responses-multi-agent). GPT-5.6 also accepts images at their original dimensions with `original` or `auto` image detail.

### Jul 6

Feature · Model: gpt-realtime-2.1 · Model: gpt-realtime-2.1-mini · API: v1/realtime

Released [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1), an updated realtime reasoning model with improved alphanumeric recognition, silence and noise handling, and interruption behavior. Also released [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini), a faster, lower-cost distilled reasoning model for realtime voice applications.

## June, 2026

### Jun 24

Update · Model: chat-latest

Updated the `chat-latest` snapshot, which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) for production API usage, but feel free to use this model to test the latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

Feature

Released the Safety Usage Dashboard on the OpenAI API platform. The Safety dashboard shows blocked Responses requests based on `safety_identifier` values sent on requests to identify end users. Visit the [Safety dashboard](https://platform.openai.com/usage/safety).

### Jun 9

Feature · API: v1/responses

Web search can now return image results alongside regular text results. Use image search when your application needs current or web-grounded visuals, such as product photos, landmarks, places, events, or visual references. Read more in the [web search guide](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

Update

Released a redesigned navigation for the OpenAI API platform, visit [here](https://platform.openai.com/login).

### Jun 4

Feature · Model: omni-moderation-latest · API: v1/responses · API: v1/chat/completions

Added moderation scores to the Responses API and Chat Completions API. Pass a `moderation` object in a generation request to receive moderation results for both the model input and generated output in the same response.

Learn more in the [Moderation guide](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

Update

Announced the deprecation of reusable prompt objects, the Evals platform, and Agent Builder. See the [deprecations page](https://developers.openai.com/api/docs/deprecations) for shutdown timelines and migration guidance.

### Jun 2

Update

Starting June 2, 2026, eligible container sessions will be billed per minute with a 5-minute minimum, instead of being billed at the full 20-minute session rate. The underlying per-minute rate will remain the same.

This update is intended to make billing more granular for shorter sessions and will lower effective cost for customers.

You can find current built-in tool pricing in our [API pricing docs](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI models are now available in Amazon Bedrock through an OpenAI-compatible Responses API endpoint. Supported models and features vary by AWS Region. [Learn more](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## May, 2026

### May 29

Update · API: v1/responses · API: v1/chat/completions · API: v1/batch

For organizations without ZDR enabled, `prompt_cache_retention` now defaults to `24h` instead of `in_memory`, enabling extended prompt caching by default. [Learn more](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

Update · Model: chat-latest

Released `chat-latest` snapshot which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) for production API usage, but feel free to use this model to test the latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

Feature

Released [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation). Trusted workloads can exchange externally issued identity tokens for short-lived OpenAI access tokens without storing long-lived API keys.

### May 26

Update

Added new [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) capabilities for managing spend alerts, model allowlists, data retention settings, and hosted tool permissions, plus querying granular billing line items.

### May 19

Feature

Released [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) for enterprise customers. Secure MCP Tunnel lets supported OpenAI products including ChatGPT web, Codex, Responses API, and AgentKit connect to private or on-prem MCP servers through a customer-hosted `tunnel-client` without exposing those servers to the public internet.

### May 19

Update

You can now manage multiple IP allowlists and apply each one at the project level or across the whole organization. To configure them, go to [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

Update · Model: dall-e-2 · Model: dall-e-3 · API: v1/realtime

Deprecated DALL·E model snapshots and the Realtime API Beta.

DALL·E model snapshots `dall-e-2` and `dall-e-3` were deprecated and removed from the API on May 12, 2026. We recommend using `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` instead.

The Realtime API Beta was deprecated and removed from the API on May 12, 2026. If you are still using the beta interface, migrate to the released Realtime API. See [the migration guide](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) and the full [deprecations page](https://developers.openai.com/api/docs/deprecations).

### May 11

Feature · API: v1/responses

Added `return_token_budget` for the Responses API [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research). Use it to opt in to longer GPT-5+ reasoning web search runs for high-effort research and evaluation workloads.

### May 7

Feature · Model: gpt-realtime-2 · Model: gpt-realtime-translate · Model: gpt-realtime-whisper · API: v1/realtime · API: v1/realtime/translations · API: v1/realtime/transcription_sessions

Released [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2), a new realtime voice model with configurable reasoning for speech-to-speech agents, along with [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) for streaming speech translation and [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) for streaming speech-to-text.

Updated the [Realtime and audio guide](https://developers.openai.com/api/docs/guides/realtime), added a dedicated [Realtime translation guide](https://developers.openai.com/api/docs/guides/realtime-translation), refreshed [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription) for streaming transcripts, and moved realtime prompting guidance into [Using realtime models](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

### May 7

Feature

Released the [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin). This helps you build AI applications and agents in Codex with OpenAI Platform access and OpenAI API setup guidance.

### May 6

Update

The updated Agents SDK is now available in TypeScript, with support for sandbox agents and an open-source harness built in. Learn more [here](https://developers.openai.com/api/docs/guides/agents).

### May 5

Update · Model: chat-latest

Released `chat-latest` snapshot which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) for production API usage, but feel free to use this model to test our latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [here](https://developers.openai.com/api/docs/models/chat-latest).

### May 4

Update

Admin APIs are now supported in the OpenAI SDKs for Node, Python, Go, Ruby, and Java. See the [Admin APIs guide](https://developers.openai.com/api/docs/guides/admin-apis) for setup instructions and examples.

## April, 2026

### Apr 24

Feature · Model: gpt-5.5 · Model: gpt-5.5-pro · API: v1/responses · API: v1/chat/completions · API: v1/batch

Released [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5), a new frontier model for complex professional work, to the Chat Completions and Responses API, and released [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) for Responses API requests for tougher problems that benefit from more compute.

GPT-5.5 supports a 1M token context window, image input, structured outputs, function calling, prompt caching, Batch, tool search, built-in computer use, hosted shell, apply patch, Skills, MCP, and web search. Key updates include:
- Reasoning effort now defaults to `medium`.
- When `image_detail` is unset or set to `auto`, the model now uses [original behavior](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- Caching for GPT-5.5 only works with extended prompt caching. In-memory prompt caching is not supported.
Learn more [here](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

Feature · Model: gpt-image-2 · API: v1/images/generations · API: v1/images/edits · API: v1/batch

Released [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2), a state-of-the-art image generation model for image generation and editing. GPT Image 2 supports flexible image sizes, high-fidelity image inputs, token-based image pricing, and Batch API support with a 50% discount.

### Apr 15

Update

Updated the [Agents SDK](https://developers.openai.com/api/docs/guides/agents) with new capabilities, including:
- running agents in controlled sandboxes;
- inspecting and customizing the open-source harness; and
- controlling when memories are created and where they're stored.

## March, 2026

### Mar 17

Feature · Model: gpt-5.4-mini · Model: gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

Released [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) and [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) to the Chat Completions and Responses API. GPT-5.4 mini brings GPT-5.4-class capabilities to a faster, more efficient model for high-volume workloads, while GPT-5.4 nano is optimized for simple high-volume tasks where speed and cost matter most.

GPT-5.4 mini supports [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search), built-in [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), and [compaction](https://developers.openai.com/api/docs/guides/compaction). GPT-5.4 nano supports compaction, but does not support tool search or computer use.

### Mar 16

Update · Model: gpt-5.3-chat-latest

Updated the [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug to point to the latest model currently used in ChatGPT.

### Mar 13

Fix · Model: gpt-5.4 · API: v1/responses · API: v1/chat/completions

Updated our image encoder to fix a small bug with `input_image` inputs in GPT-5.4. Some image understanding use cases may now see improved quality. No action is required.

### Mar 12

Feature · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

Expanded the Sora API with reusable character references, longer generations up to `20` seconds, `1080p` output for `sora-2-pro`, video extensions, and Batch API support for `POST /v1/videos`. `1080p` generations on `sora-2-pro` are billed at `$0.70` per second. Learn more [here](https://developers.openai.com/api/docs/guides/video-generation).

### Mar 12

Update · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

Added `POST /v1/videos/edits` for editing existing videos. This will replace `POST /v1/videos/{video_id}/remix`, which will be deprecated in `6` months. Learn more [here](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

Feature · Model: gpt-5.4 · Model: gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

Released [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4), our newest frontier model for professional work, to the Chat Completions and Responses API, and released [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) to the Responses API for tougher problems that benefit from more compute.

Also released:
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) in the Responses API, which lets models defer large tool surfaces until runtime to reduce token usage, preserve cache performance, and improve latency.
- Built-in [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) support in GPT-5.4 through the Responses API `computer` tool for screenshot-based UI interaction.
- A 1M token context window and native [Compaction](https://developers.openai.com/api/docs/guides/compaction) support for longer-running agent workflows.

### Mar 3

Feature · Model: gpt-5.3-chat-latest · API: v1/chat/completions · API: v1/responses

Released `gpt-5.3-chat-latest` to the Chat Completions and Responses API. This model points to the GPT-5.3 Instant snapshot currently used in ChatGPT. Read more [here](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## February, 2026

### Feb 24

Feature · API: v1/responses · API: v1/chat/completions

Expanded `input_file` support to accept more document, presentation, spreadsheet, code, and text file types. Learn more [here](https://developers.openai.com/api/docs/guides/file-inputs).

### Feb 24

Feature · API: v1/responses

Released `phase` to the Responses API. It labels an assistant message as intermediate commentary (`commentary`) or the final answer (`final_answer`). Read more [here](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### Feb 24

Feature · Model: gpt-5.3-codex · API: v1/responses

Released `gpt-5.3-codex` to the Responses API. Read more [here](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

Feature · API: v1/responses

Launched WebSocket mode for the Responses API. Learn more [here](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

Feature · Model: gpt-realtime-1.5 · Model: gpt-audio-1.5 · API: v1/realtime · API: v1/chat/completions

Released [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) to the Realtime API.

Released `gpt-audio-1.5` to the Chat Completions API. Read more [here](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### Feb 10

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) is now supported for GPT Image models: `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`, and `gpt-image-1-mini`.

### Feb 10

Update · Model: gpt-5.2-chat-latest

Updated the [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug to point to the latest model currently used in ChatGPT.

### Feb 10

Feature · API: v1/responses

Launched [server-side compaction](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) in the Responses API.

### Feb 10

Feature · API: v1/responses

Launched support for [Skills](https://developers.openai.com/api/docs/guides/tools-skills) in the Responses API. We support Skills across both local execution and hosted container-based execution.

### Feb 10

Feature · API: v1/responses

Launched a new [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) tool, as well as support for networking in containers.

### Feb 9

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

Added support for `application/json` requests on `/v1/images/edits` for GPT image models. JSON requests use `images` (and optional `mask`) with `image_url` or `file_id` references instead of multipart uploads.

### Feb 3

Update · Model: gpt-5.2 · Model: gpt-5.2-codex

We have optimized our inference stack for API customers and [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) and [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) now run ~40% faster. Model and model weights are unchanged.

## January, 2026

### Jan 15

Announcement

Announced [Open Responses](https://www.openresponses.org/): an open-source spec for building multi-provider, interoperable LLM interfaces built on top of the original OpenAI Responses API.

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

Released `gpt-5.2-codex` to the Responses API. GPT-5.2-Codex is a version of GPT-5.2 optimized for agentic coding tasks in Codex or similar environments. Read more [here](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

Feature · API: v1/realtime

Added dedicated SIP IP ranges for Realtime API. `sip.api.openai.com` does GeoIP routing, and will direct SIP traffic to the closest region. [Learn more](https://developers.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

### Jan 13

Update · Model: gpt-realtime-mini · Model: gpt-audio-mini

Updated the [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) and [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slugs to point to the 2025-12-15 snapshots. If you need the previous model snapshots, use `gpt-realtime-mini-2025-10-06` and `gpt-audio-mini-2025-10-06`.

### Jan 13

Update · Model: sora-2

Updated the [sora-2](https://platform.openai.com/docs/models/sora-2) slug to point to `sora-2-2025-12-08`. If you need the previous model snapshot, use `sora-2-2025-10-06`.

### Jan 13

Update · Model: gpt-4o-mini-tts · Model: gpt-4o-mini-transcribe

Updated the `gpt-4o-mini-tts` and `gpt-4o-mini-transcribe` slugs to point to the `2025-12-15` snapshots. If you need the previous model snapshots, use `gpt-4o-mini-tts-2025-03-20` and `gpt-4o-mini-transcribe-2025-03-20`. We currently recomend using `gpt-4o-mini-transcribe` over `gpt-4o-transcribe` for the best results.

### Jan 9

Fix · Model: gpt-image-1.5 · Model: chatgpt-image-latest

Fixed an issue where `gpt-image-1.5` and `chatgpt-image-latest` were incorrectly using high fidelity for image edits through `/v1/images/edits`, even when `fidelity` was explicitly set to `low` (the default).

## December, 2025

### Dec 19

Update · Model: gpt-image-1.5 · Model: chatgpt-image-latest

Added `gpt-image-1.5` and `chatgpt-image-latest` to the Responses API image generation tool.

### Dec 16

Feature · Model: gpt-image-1.5 · Model: chatgpt-image-latest

Released [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) and [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest), our latest and most advanced models for image generation. Read more [here](https://platform.openai.com/docs/guides/image-generation).

### Dec 15

Feature · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-4o-mini-transcribe · Model: gpt-4o-mini-tts

Released four new dated audio snapshots. These updates deliver reliability, quality, and voice fidelity improvements for real-time, voice-driven applications. Read more [here](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

This launch also includes support for [Custom voices](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) for eligible customers.

### Dec 11

Feature · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

Released [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), the newest flagship model in the GPT-5 model family. GPT-5.2 shows improvements over the previous GPT-5.1 in:
- General intelligence
- Instruction following
- Accuracy and token efficiency
- Multimodality—especially vision
- Code generation—especially front-end UI creation
- Tool calling and context management in the API
- Spreadsheet understanding and creation.

What's new in 5.2 is a new xhigh reasoning effort level, concise reasoning summaries, and new context management using compaction.

### Dec 11

Feature · API: v1/responses/compact

Released [client-side compaction](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced). For long-running conversations with the Responses API, you can use the `/responses/compact` endpoint to shrink the context you send with each turn.

### Dec 4

Feature · Model: gpt-5.1-codex-max · API: v1/responses

Released `gpt-5.1-codex-max` to the Responses API. GPT-5.1-Codex is our most intelligent coding model optimized for long-horizon, agentic coding tasks. Read more [here](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## November, 2025

### Nov 20

Feature · API: v1/realtime

Added support for DTMF key presses in the Realtime API. You can now receive DTMF events while using a Realtime sideband connection. See [docs here](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) for more information.

### Nov 13

Feature · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

Released [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1), the newest flagship model in the GPT-5 model family. GPT-5.1 is trained to be especially proficient in:

- Steerability and faster responses when less thinking's required
- Code generation and coding use cases
- Agentic workflows

Note that GPT-5.1 defaults to a new `none` reasoning setting for faster responses when less thinking's required—different from the previous `medium` default setting in GPT-5.

### Nov 13

Feature

Released [enhanced role-based access controls (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top). Role-based access control (RBAC) lets you decide who can do what across your organization and projects—both through the API and in the Dashboard.

### Nov 13

Feature · Model: gpt-5.1-codex · Model: gpt-5.1-codex-mini · API: v1/responses

Released `gpt-5.1-codex` and `gpt-5.1-codex-mini` to the Responses API. GPT-5.1-Codex is a version of GPT-5.1 optimized for agentic coding tasks in Codex or similar environments. Read more [here](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

Feature

Released [extended prompt cache retention](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention). Extended prompt cache retention keeps cached prefixes active for longer, up to a maximum of 24 hours. Extended Prompt Caching works by offloading the key/value tensors to GPU-local storage when memory is full, significantly increasing the storage capacity available for caching.

## October, 2025

### Oct 29

Feature · Model: gpt-oss-safeguard-120b · Model: gpt-oss-safeguard-20b

gpt-oss-safeguard-120b and gpt-oss-safeguard-20b are safety reasoning models built-upon gpt-oss. Read more [here](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

Feature

Released [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) allows you to encrypt your customer content at OpenAI using keys managed by your own external Key Management System (KMS).

### Oct 24

Feature

Released [UK data residency](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

Feature · Model: gpt-5-pro · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-image-1-mini · Model: sora-2 · Model: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

Released several new features at [OpenAI DevDay](https://openai.com/devday/):

Released [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro), a version of [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) that uses more compute to think harder and provide consistently better answers.

Released [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) and [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) for more cost-efficient speech to speech performance.

Released [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) for more cost-efficient image generation and editing.

Launched [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) for rich, detailed, and dynamic video generation and remixing with our latest [Sora 2](https://developers.openai.com/api/docs/models/sora-2) and [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) models.

Launched [Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder) for visually creating custom multi-agent workflows.

Launched [ChatKit](https://developers.openai.com/api/docs/guides/chatkit), an embeddable chat interface for deploying agents.

Released [Trace Evals, Datasets, and Prompt Optimization tools](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals): Released Third-Party Model Support.

Launched [Service health dashboard](https://platform.openai.com/settings/organization/service-health).

### Oct 1

Feature

Released [IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist). IP allowlisting restricts API access to only the IP addresses or ranges you specify.

## September, 2025

### Sep 26

Feature · API: v1/responses

Added support for image and file as a [tool call output](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) in Responses API.

### Sep 23

Feature · Model: gpt-5-codex · API: v1/responses

Launched special-purpose model [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex), built and optimized for use with the [Codex CLI](https://github.com/openai/codex).

## August, 2025

### Aug 28

Feature · API: v1/realtime

The OpenAI Realtime API is now generally available. Learn more [in our Realtime API guide](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

Feature · API: v1/responses

Added support for [connectors](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) to the Responses API. Connectors are OpenAI-maintained MCP wrappers for popular services like Google apps, Dropbox, and more that can be used to give model read access to data stored in those services.

### Aug 20

Feature · API: v1/conversations · API: v1/responses · API: v1/assistants

Released the Conversations API, which allows you to create and manage long-running conversations with the Responses API. See the [migration guide](https://developers.openai.com/api/docs/assistants/migration) to see a side-by-side comparison and learn how to migrate from an Assistants API integration to Responses and Conversations.

### Aug 7

Feature · API: v1/chat/completions · API: v1/responses

Released GPT-5 family of models in the API, including [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini), and [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

Introduced the `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) value to optimize for fast responses in GPT-5 models (which support reasoning).

Introduced `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) type, which allows for freeform inputs to and outputs from the model when tool calling.

## June, 2025

### Jun 27

Feature

Launched support for [Priority processing](https://platform.openai.com/docs/guides/priority-processing). Priority processing delivers significantly lower and more consistent latency compared to Standard processing while keeping pay-as-you-go flexibility.

### Jun 24

Feature · Model: o3-deep-research · Model: o3-deep-research-2025-06-26 · Model: o4-mini-deep-research · Model: o4-mini-deep-research-2025-06-26 · API: v1/responses

Released [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) and [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research), deep research variants of our o-series reasoning models optimized for deep analysis and research tasks. Learn more in the [deep research guide](https://developers.openai.com/api/docs/guides/deep-research).

Added support for async event handling with [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [Reduced and simplified pricing](https://developers.openai.com/api/docs/pricing) for the web search tool. Added support for the [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

Feature · API: v1/responses

[New reusable prompts](https://developers.openai.com/chat/edit) are now available in the dashboard and [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create). Via API, you can now reference templates created in the dashboard via the `prompt` parameter (with a prompt `id`, optional `version`) and supply dynamic `variables` that can include strings, images, or file inputs. Reusable prompts are not available in Chat Completions. [Learn more](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

Feature · Model: o3-pro · API: v1/responses · API: v1/batch

Released [o3-pro](https://developers.openai.com/api/docs/models/o3-pro), a version of the [o3](https://developers.openai.com/api/docs/models/o3) reasoning model that uses more compute to answer hard problems with better reasoning and consistency. [Prices for the o3 model have also been reduced](https://developers.openai.com/api/docs/pricing) for all API requests, including batch and flex processing.

### Jun 4

Feature · API: v1/fine_tuning

Added fine-tuning support with [direct preference optimization](https://developers.openai.com/api/docs/guides/direct-preference-optimization) for the models `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, and `gpt-4.1-nano-2025-04-14`.

### Jun 3

Feature · API: v1/chat/completions · API: v1/realtime

New model snapshots available for [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) and [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview). Released [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## May, 2025

### May 20

Feature · API: v1/responses

Added support for new built-in tools in the Responses API, including [remote MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) and [code interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [Learn more about tools](https://developers.openai.com/api/docs/guides/tools).

### May 20

Feature · API: v1/responses · API: v1/chat/completions

Added support for using `strict` mode for tool schemas when using parallel tool calling with non-fine-tuned models.
Added new [schema features](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas), including string validation for `email` and other patterns and specifying ranges for numbers and arrays.

### May 15

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

Launched [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) in the API, optimized for use with the [Codex CLI](https://github.com/openai/codex).

### May 7

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

Launched support for [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning). Learn about available [fine-tuning methods](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) is now available for fine-tuning.

## April, 2025

### Apr 30

Feature

Launched support for [Enhanced API Budget Alerts & Auto-recharge Limits](https://platform.openai.com/settings/organization/limits).

### Apr 23

Feature · API: v1/images/generations · API: v1/images/edits

Added a new image generation model, `gpt-image-1`. This model sets a new standard for image generation, with improved quality and instruction following.

Updated the Image Generation and Edit endpoints to support new parameters specific to the `gpt-image-1` model.

### Apr 16

Feature · API: v1/chat/completions · API: v1/responses

Added two new o-series reasoning models, `o3` and `o4-mini`. They set a new standard for math, science, and coding, visual reasoning tasks, and technical writing.

Launched Codex, our code generation CLI tool.

### Apr 14

Feature · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

Added [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini), and [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) models to the API. These new models feature improved instruction following, coding, and a larger context window (up to 1M tokens). `gpt-4.1` and `gpt-4.1-mini` are available for supervised fine-tuning. Announced deprecation of [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## March, 2025

### Mar 20

Update · API: v1/audio

Added `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, and `whisper-1` models to the Audio API.

### Mar 19

Feature · Model: o1-pro · API: v1/responses · API: v1/batch

Released [o1-pro](https://developers.openai.com/api/docs/models/o1-pro), a version of the [o1](https://developers.openai.com/api/docs/models/o1) reasoning model that uses more compute to answer hard problems with better reasoning and consistency.

### Mar 11

Feature · Model: gpt-4o-search-preview · Model: gpt-4o-mini-search-preview · Model: computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

Released several new models and tools and a new API for agentic workflows:
  - Released the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses), a new API for creating and using agents and tools.
  - Released a set of built-in tools for the Responses API: [web search](https://developers.openai.com/api/docs/guides/tools-web-search), [file search](https://developers.openai.com/api/docs/guides/tools-file-search), and [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - Released the [Agents SDK](https://developers.openai.com/api/docs/guides/agents), an orchestration framework for designing, building, and deploying agents.
  - Announced new models: `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - Announced plans to bring all [Assistants API](https://developers.openai.com/api/docs/assistants/migration) features to the easier to use [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses), with an anticipated sunset date for Assistants in 2026 (after achieving full feature parity).

### Mar 3

Feature · API: v1/fine_tuning/jobs

Added `metadata` field support to fine-tuning jobs.

## February, 2025

### Feb 27

Feature · Model: GPT-4.5 · API: v1/chat/completions · API: v1/assistants · API: v1/batch

Released a research preview of [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—our largest and most capable chat model yet. GPT-4.5's high "EQ" and understanding of user intent make it better at creative tasks and agentic planning.

### Feb 25

Feature

Launched the [API Usage Dashboard Update](https://help.openai.com/en/articles/10478918-api-usage-dashboard). This update addresses requests for additional data filters, such as project selection, date picker, and fine-grained intervals. There’s also better support for viewing usage across different products and service tiers.

### Feb 5

Feature

Introducing data residency in Europe. Read more [here](https://platform.openai.com/docs/guides/your-data).

## January, 2025

### Jan 31

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

Launched [o3-mini](https://developers.openai.com/api/docs/models/o3-mini), a new small reasoning model that is optimized for science, math, and coding tasks.

### Jan 21

Feature · Model: o1

Expanded access to [o1 model](https://platform.openai.com/docs/models/o1). The o1 series of models are trained with reinforcement learning to perform complex reasoning.

## December, 2024

### Dec 18

Feature

Launched [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys), enabling customers to programmatically rotate their admin api keys.

Updated [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites), enabling customers to programmatically invite users to projects at the same time they are invited to organizations.

### Dec 17

Feature · Model: o1 · Model: gpt-4o · Model: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

Added new models for [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) and [more](https://developers.openai.com/api/docs/models).

Added WebRTC connection method for the [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

Added [`reasoning_effort` parameter](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) for o1 models.

Added [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) for o1 model. Note that o1-preview and o1-mini do not support system or developer messages.

Launched Preference Fine-tuning using [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

Launched beta SDKs for Go and Java. [Learn more](https://developers.openai.com/api/docs/libraries).

Added [Realtime API](https://developers.openai.com/api/docs/guides/realtime) support in the [Python SDK](https://github.com/openai/openai-python).

### Dec 4

Feature

Launched [Usage API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage), enabling customers to programmatically query activities and spending across OpenAI APIs.

## November, 2024

### Nov 20

Update · API: v1/chat/completions

Released [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o), our newest model in the gpt-4o series.

### Nov 4

Feature · API: v1/chat/completions

Released [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs), which greatly reduces latency for model responses where much of the response is known ahead of time. This is most common when regenerating the content of documents and code files with only minor changes.

## October, 2024

### Oct 30

Feature · Model: gpt-4o-realtime-preview · Model: gpt-4o-audio-preview · API: v1/chat/completions

Added five new voice types in the [Realtime API](https://developers.openai.com/api/docs/guides/realtime) and [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

Feature · Model: gpt-4o-audio-preview · API: v1/chat/completions

Released [new `gpt-4o-audio-preview` model](https://developers.openai.com/api/docs/guides/audio) for chat completions, which supports both audio inputs and outputs. Uses the same underlying model as the [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

Feature · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

Released several new features at [OpenAI DevDay in San Francisco](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime): Build fast speech-to-speech experiences into your applications using a WebSockets interface.

[Model distillation](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model): Platform for fine-tuning cost-efficient models with your outputs from a large frontier model.

[Image fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization#vision): Fine-tune GPT-4o with images and text to improve vision capabilities.

[Evals](https://developers.openai.com/api/docs/guides/evals): Create and run custom evaluations to measure model performance on specific tasks.

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching): Discounts and faster processing times on recently seen input tokens.

[Generate in playground](https://developers.openai.com/chat/edit): Easily generate prompts, function definitions, and structured output schemas in the playground using the Generate button.

## September, 2024

### Sep 26

Feature · Model: omni-moderation-latest · API: v1/moderations

Released [new `omni-moderation-latest` moderation model](https://developers.openai.com/api/docs/guides/moderation), which supports both images and text (for some categories), supports two new text-only harm categories, and has more accurate scores.

### Sep 12

Feature · Model: o1-preview · Model: o1-mini · API: v1/chat/completions

Released [o1-preview and o1-mini](https://developers.openai.com/api/docs/guides/reasoning), new large language models trained with reinforcement learning to perform complex reasoning tasks.

## August, 2024

### Aug 29

Feature · API: v1/assistants

Assistants API now supports [including file search results used by the file search tool, and customizing ranking behavior](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

Feature · Model: gpt-4o · API: v1/fine_tuning

GA release for [`gpt-4o-2024-08-06` fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization)—all API users can now fine-tune the latest GPT-4o model.

### Aug 15

Update · Model: gpt-4o · API: v1/chat/completions

Released [dynamic model for `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—this model will point to the latest GPT-4o model used by ChatGPT.

### Aug 6

Update

Launched [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)—model outputs now reliably adhere to developer supplied JSON Schemas.

Released [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o), our newest model in the gpt-4o series.

### Aug 1

Update

Launched [Admin and Audit Log APIs](https://developers.openai.com/api/reference/overview), allowing customers to programmatically administer their organization and monitor changes using the audit logs. Audit logging must be enabled within [settings](https://platform.openai.com/settings/organization/general).

## July, 2024

### Jul 24

Update

Launched [self-serve SSO configuration](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers), allowing Enterprise customers on custom and unlimited billing to set up authentication against their desired IDP.

### Jul 23

Update

Launched [fine-tuning for GPT-4o mini](https://developers.openai.com/api/docs/guides/model-optimization), enabling even higher performance for specific use cases.

### Jul 18

Update

Released [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), our affordable an intelligent small model for fast, lightweight tasks.

### Jul 17

Update

Released [Uploads](https://developers.openai.com/api/reference/resources/uploads) to upload large files in multiple parts.

## June, 2024

### Jun 6

Update

[Parallel function calling](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) can be disabled in Chat Completions and the Assistants API by passing `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) launched in Beta.

### Jun 3

Update

Added support for [file search customizations](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## May, 2024

### May 15

Update

Added support for [archiving projects](https://developers.openai.com/projects) . Only organization owners can access this functionality.

Added support for [setting cost limits](https://platform.openai.com/settings/organization/general) on a per-project basis for pay as you go customers.

### May 13

Update

Released [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) in the API. GPT-4o is our fastest and most affordable flagship model.

### May 9

Update

Added support for [image inputs to the Assistants API.](https://developers.openai.com/api/docs/assistants/migration)

### May 7

Update

Added support for [fine-tuned models to the Batch API](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

Update

Added [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) parameter to the Chat Completions and Completions APIs. Setting this gives developers access to usage stats when using streaming.

### May 2

Update

Added [a new endpoint](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) to delete a message from a thread in the Assistants API.

## April, 2024

### Apr 29

Update

Added a new [function calling option `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) to the Chat Completions and Assistants APIs.

Added a [guide for the Batch API](https://developers.openai.com/api/docs/guides/batch) and Batch API support for [embeddings models](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

Update

Introduced a [series of updates to the Assistants API](https://developers.openai.com/api/docs/assistants/migration) , including a new file search tool allowing up to 10,000 files per assistant, new token controls, and support for tool choice.

### Apr 16

Update

Introduced [project based hierarchy](https://platform.openai.com/settings/organization/general) for organizing work by projects, including the ability to create [API keys](https://developers.openai.com/api/reference/overview) and manage rate and cost limits on a per-project basis (cost limits available only for Enterprise customers).

### Apr 15

Update

Released [Batch API](https://developers.openai.com/api/docs/guides/batch)

### Apr 9

Update

Released [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) in general availability in the API

### Apr 4

Update

Added support for [seed](https://developers.openai.com/api/reference/resources/fine_tuning) in the fine-tuning API

Added support for [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) in the fine-tuning API

Added support for [adding Messages when creating a Run](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) in the Assistants API

### Apr 1

Update

Added support for [filtering Messages by run_id](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) in the Assistants API

## March, 2024

### Mar 29

Update

Added support for [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) and [assistant message creation](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) in the Assistants API

### Mar 14

Update

Added support for [streaming](https://developers.openai.com/api/docs/assistants/migration) in the Assistants API

## February, 2024

### Feb 9

Update

Added [`timestamp_granularities` parameter](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) to the Audio API

### Feb 1

Update

Released [gpt-3.5-turbo-0125, an updated GPT-3.5 Turbo model](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## January, 2024

### Jan 25

Update

Released embedding V3 models and an updated GPT-4 Turbo preview

Added [`dimensions` parameter](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) to the Embeddings API

## December, 2023

### Dec 20

Update

Added [`additional_instructions` parameter](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) to run creation in the Assistants API

### Dec 15

Update

Added [`logprobs` and `top_logprobs` parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) to the Chat Completions API

### Dec 14

Update

Changed [function parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) argument on a tool call to be optional

## November, 2023

### Nov 30

Update

Released [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

Update

Released [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [updated GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [DALL·E 3 in the API](https://developers.openai.com/api/docs/models/dall-e-3), and [text-to-speech API](https://developers.openai.com/api/docs/guides/text-to-speech)

Deprecated the Chat Completions `functions` parameter [in favor of `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

Released [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## October, 2023

### Oct 16

Update

Added [`encoding_format` parameter](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) to the Embeddings API

Added `max_tokens` to the [Moderation models](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

Update

Added [function calling support](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) to the Fine-tuning API
