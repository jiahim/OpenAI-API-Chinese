# OpenAI CLI

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Interact with the OpenAI API directly from your terminal with the `openai` command-line tool.

## Installation

Install the CLI with Homebrew:

```bash
brew install openai/tools/openai
```

Or install it with Go 1.25 or later:

```bash
go install 'github.com/openai/openai-cli/cmd/openai@latest'
```

Older versions of the Python SDK also installed a legacy `openai` command. If you already had that package installed and the command you see does not match this guide, your shell may still be resolving the older binary. Fresh CLI installs are not affected.

## Authentication

The CLI reads your API key from `OPENAI_API_KEY`:

Command:

```bash
export OPENAI_API_KEY="sk-..."
```

If you don't have an API key yet, [create one in the dashboard](https://platform.openai.com/api-keys).

For Admin API endpoints, set `OPENAI_ADMIN_KEY` instead. The SDK layer selects the admin key or default API key based on the endpoint being called.

To point at a different API host, set `OPENAI_BASE_URL`.

## Use cases

Use the CLI when the work belongs naturally in the terminal:

- Generate local artifacts such as images or speech.
- Extract structured data into JSONL for later shell steps.
- Use Responses with files, computer use, and current web context in the cloud.
- Create projects and API keys with Admin APIs.

Use it directly for one-off terminal requests, or from scripts when agents need repeatable batch work over files and generated artifacts.

## CLI vs subagents for Codex

Use the CLI for repeatable API work you want to inspect and rerun, such as batch extraction, file transforms, artifact generation, or deliberate model selection. Use subagents when the work still needs judgment, such as exploring code, comparing hypotheses, debugging, or reviewing changes.

## Global flags

These options work across commands:

| Flag          | Use                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `--format`    | Print responses as `auto`, `json`, `jsonl`, `pretty`, `raw`, `yaml`, or `explore`.                           |
| `--transform` | Extract or reshape response data with a GJSON path before printing.                                          |
| `--debug`     | Print request and response details to stderr. Authorization is redacted; review headers before sharing logs. |

This guide focuses on CLI patterns. For the latest arguments and response shapes for any API family, use the live [API reference](https://developers.openai.com/api/reference/overview).

You can also change the base URL when you need to point the CLI at another compatible endpoint, such as a deployment that supports a different model set or only a subset of the API surface.

## Responses

Use Responses for text generation, structured extraction, web search, file understanding, and repeatable Codex-authored batch scripts.

### Send your first request

Command:

```bash
openai responses create \
  --model gpt-6-astra \
  --input "Say hello in one sentence."
```


Output:

```json
{
  "id": "resp_...",
  "object": "response",
  "status": "completed",
  "model": "gpt-5.5-...",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Hello!"
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 12,
    "output_tokens": 6,
    "total_tokens": 18
  },
  "...": "additional response fields omitted"
}
```

The CLI prints the full API response object by default. Examples on this page keep representative fields such as `id`, `status`, `model`, `output`, and `usage`, and omit the rest.

Responses output can include non-message items, such as reasoning items, before the assistant message. When you need assistant text, select the message item by type instead of assuming it is always `output[0]`:

```bash
--transform 'output.#(type=="message").content.0.text'
```

### Add a local file to the prompt

For a simple local file, build the prompt inline with command substitution:

```bash
openai responses create \
  --model gpt-6-astra \
  --input "Summarize this note in one sentence.

<note>
$(cat ./note.md)
</note>" \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text'
```


Output:

```text
The note says the launch checklist is ready except for final support ownership.
```

### Passing request bodies

Use flags for short scalar inputs. Use a YAML heredoc for multiline prompts, tools, files, or nested request bodies. The heredoc can contain the same request fields you would otherwise pass as flags.

Be careful with string values that look like YAML, especially prompts that contain `:` or `{}`. On flags, the generated parser may interpret those values as structured YAML instead of plain text. If a prompt starts looking like configuration, put it under `input: |` in a YAML body instead:

Command:

```bash
openai responses create \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text' <<'YAML'
model: gpt-5.5
instructions: Return exactly one sentence.
max_output_tokens: 120
input: |
  Summarize this release note in one sentence.

  <release_note>
  Fixed the image generation example and added CLI installation guidance.
  </release_note>
YAML
```


Output:

```text
The release note updates the CLI docs with corrected image generation and installation guidance.
```

When the prompt itself needs shell assembly, build a YAML body and pipe it into the command:

```bash
{
  printf 'input: |\n'
  printf '  Summarize this note in one sentence.\n\n'
  printf '  <note>\n'
  sed 's/^/  /' ./note.md
  printf '  </note>\n'
} | openai responses create \
  --model gpt-6-astra \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text'
```


### Write structured data to JSON

Use structured outputs when downstream scripts need stable JSON. Save reusable schemas to disk:

Save as `schema.json`:

```json
{
  "type": "json_schema",
  "name": "fact",
  "strict": true,
  "schema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "person": { "type": "string" },
      "topic": { "type": "string" }
    },
    "required": ["person", "topic"]
  }
}
```

Command:

```bash
openai responses create \
  --model gpt-6-astra \
  --instructions "Extract the person and topic from the input." \
  --input "Ada Lovelace wrote notes about the Analytical Engine." \
  --text.format "$(cat ./schema.json)" \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text'
```


Output:

```json
{ "person": "Ada Lovelace", "topic": "notes about the Analytical Engine" }
```

### Write structured records to JSONL

When one input may produce many records, ask the model for an array and flatten it into JSONL so later shell steps can process one record per line:

Save as `records-schema.json`:

```json
{
  "type": "json_schema",
  "name": "items",
  "strict": true,
  "schema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "title": { "type": "string" },
            "summary": { "type": "string" },
            "evidence": { "type": "string" }
          },
          "required": ["title", "summary", "evidence"]
        }
      }
    },
    "required": ["items"]
  }
}
```

Command:

```bash
: > records.jsonl

for file in notes/*.md; do
  extracted="$(
    openai responses create \
      --model gpt-5.5 \
      --text.format "$(cat ./records-schema.json)" \
      --raw-output \
      --transform 'output.#(type=="message").content.0.text' <<YAML
input: |
  <note path="$file">
$(sed 's/^/  /' "$file")
  </note>
YAML
  )"

  jq -r --arg source "$file" \
    '.items[]? + {source: $source} | @json' \
    <<<"$extracted" >> records.jsonl
done
```


This keeps the model response structured while producing one JSON object per line for later shell steps.

### Web search

Responses can call hosted tools from the same YAML request body:

Command:

```bash
openai responses create \
  --model gpt-6-astra \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text' <<'YAML'
tools:
  - type: web_search
input: |
  Research the latest material news for AAPL.
  Return three concise bullets and cite sources in the text.
YAML
```


Output:

```text
- Apple announced ...
- Analysts highlighted ...
- The company said ...
```

### File inputs

For uploaded files such as PDFs, create the file first, capture its ID, and pass it as `input_file.file_id`:

Command:

```bash
FILE_ID=$(
  openai files create \
    --file ./brief.pdf \
    --purpose user_data \
    --format yaml \
    --transform id
)

openai responses create \
  --model gpt-5.5 \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text' <<YAML
input:
  - role: user
    content:
      - type: input_text
        text: Summarize this brief and list three risks.
      - type: input_file
        file_id: ${FILE_ID}
YAML
```


Output:

```text
- The brief proposes ...
- Risks: migration timing, unclear rollback criteria, and unresolved support ownership.
```

Recent generated builds send local file flags as multipart file parts with filename and content type metadata. If a local upload command fails with an `UploadFile` type error, update the CLI and retry.

## Images

### Generate an image

Generate an image, extract the base64 payload, and decode it into a normal asset file:

Command:

```bash
openai images generate \
  --model gpt-image-2 \
  --prompt "A simple product-style render of a translucent green cube on a neutral background." \
  --format yaml \
  --transform 'data.0.b64_json' | base64 --decode > hero.png
printf 'wrote hero.png\n'
```


Output:

```text
wrote hero.png
```

Current limitation: image commands do not yet have native `--output` support, so image generation still requires extracting `b64_json` and decoding it yourself.

For `gpt-image-2`, omit `--input-fidelity`; image inputs are always processed at high fidelity. Transparent backgrounds are available in preview; use `--background transparent` with `png` (the default) or `webp`. `jpeg` isn't supported with transparent backgrounds. The model also supports broader `--size` values than earlier GPT Image models, as long as the requested resolution satisfies the Image API size constraints.

### Edit an image

Image editing uses the same base64 extraction pattern after the edit request succeeds:

Command:

```bash
openai images edit \
  --model gpt-image-2 \
  --image ./hero.png \
  --prompt "Turn the cube bright green." \
  --format yaml \
  --transform 'data.0.b64_json' | base64 --decode > hero-edited.png
printf 'wrote hero-edited.png\n'
```


Output:

```text
wrote hero-edited.png
```

If a local image edit upload fails with an `UploadFile` type error, update the CLI and retry.

## Speech

Create an MP3 locally with the speech API:

Command:

```bash
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice marin \
  --input "The OpenAI CLI can call the API from ordinary shell scripts." \
  --output speech.mp3
```


Output:

```text
Wrote output to: speech.mp3
```

Play it with whatever local audio tool is available on your machine. On macOS:

```bash
afplay speech.mp3
```

Use `--instructions` to shape delivery and `--input` for the words that should be spoken. Instructions work well for cues such as pace, energy, warmth, formality, emphasis, or audience:

```bash
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice marin \
  --instructions "Whisper very quickly, like a hurried stage cue, while staying clear and intelligible." \
  --input "The launch checklist is ready. Please send final feedback by Friday at noon." \
  --output reminder.mp3
```


## Transcription

Print plain transcript text for shell pipelines:

Command:

```bash
openai audio:transcriptions create \
  --model gpt-4o-transcribe \
  --file ./speech.mp3 \
  --transform text \
  --raw-output
```


Output:

```text
The OpenAI CLI can call the API from ordinary shell scripts.
```

Use the response format that matches the artifact you need:

| Need                        | Command shape                                                        |
| --------------------------- | -------------------------------------------------------------------- |
| Plain transcript text       | `--model gpt-4o-transcribe --transform text --raw-output`            |
| Subtitle files              | `--model whisper-1 --response-format srt` or `--response-format vtt` |
| Segment or word timestamps  | `--model whisper-1 --response-format verbose_json`                   |
| Speaker-labeled diarization | `--model gpt-4o-transcribe-diarize --response-format diarized_json`  |

For word-level timing, request the verbose transcription shape:

Command:

```bash
openai audio:transcriptions create \
  --model whisper-1 \
  --file ./speech.mp3 \
  --response-format verbose_json \
  --timestamp-granularity word \
  --format json
```


Output:

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 6,
  "text": "The OpenAI CLI can call the API from ordinary shell scripts.",
  "words": [
    { "word": "The", "start": 0, "end": 0.42 },
    { "word": "OpenAI", "start": 0.42, "end": 1.22 }
  ],
  "...": "additional response fields omitted"
}
```

For speaker-labeled output, use the diarization model and request `diarized_json`:

Command:

```bash
openai audio:transcriptions create \
  --model gpt-4o-transcribe-diarize \
  --file ./speech.mp3 \
  --response-format diarized_json \
  --format json
```


Output:

```json
{
  "text": "The OpenAI CLI can call the API from ordinary shell scripts.",
  "segments": [
    {
      "type": "transcript.text.segment",
      "id": "seg_0",
      "start": 0.05,
      "end": 5.25,
      "text": " The OpenAI CLI can call the API from ordinary shell scripts.",
      "speaker": "A"
    }
  ],
  "...": "additional response fields omitted"
}
```

`whisper-1` supports `json`, `text`, `srt`, `verbose_json`, and `vtt`. `diarized_json` is the format that carries `segments[].speaker`; with the same diarization model and plain `json`, the response contains transcript text but not speaker labels.

## Admin APIs

Use Admin APIs for organization management, credential provisioning, compliance, and usage-monitoring workflows. Set `OPENAI_ADMIN_KEY`, then call the generated `admin:organization:*` commands.

To provision a new machine credential, [create a project](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/methods/create), [create a service account](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/methods/create) inside that project, and use the returned API key.

### Create a project, service account, and API key

Creating a service account in that project returns an unredacted API key for the service account.

Command:

```bash
# Create the project that will own this app or agent and save the response.
openai admin:organization:projects create \
  --name "automation project" \
  --format json > project.json
PROJECT_ID="$(jq -r '.id' project.json)"

# Create a service account inside the project and save the full response.
openai admin:organization:projects:service-accounts create \
  --project-id "$PROJECT_ID" \
  --name "automation bot" \
  --format json > service-account.json

# Extract the returned API key into an env file for the workload to use.
jq -r '.api_key.value | "OPENAI_API_KEY=\(.)"' \
  service-account.json > .env
```


Output:

```json
{
  "object": "organization.project.service_account",
  "id": "svc_acct_...",
  "name": "automation bot",
  "role": "member",
  "api_key": {
    "id": "key_...",
    "value": "sk-..."
  }
}
```

This writes the project response to `project.json`, parses its ID into the next command, writes the service-account response to `service-account.json`, and writes the returned credential to `.env` as `OPENAI_API_KEY=...`. Treat both JSON files as secrets, and add `project.json`, `service-account.json`, and `.env` to `.gitignore` before using this pattern in a repository.

For the rest of the surface, see the [Admin APIs guide](https://developers.openai.com/api/docs/guides/admin-apis) and the current [Administration API reference](https://developers.openai.com/api/reference/administration/overview). Be careful about giving unvetted actors access to admin keys.