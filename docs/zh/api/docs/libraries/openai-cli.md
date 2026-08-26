# OpenAI CLI

> 查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后附加 `.md` 即可获得文档页面的 Markdown 版本。

通过OpenAI API，直接从你的终端交互，使用 `openai` 命令行工具。

## 安装

使用 Homebrew 安装 CLI：

```bash
brew install openai/tools/openai
```

或使用 Go 1.25 或更高版本安装：

```bash
go install 'github.com/openai/openai-cli/cmd/openai@latest'
```

旧版本的 Python SDK 还安装了一个遗留 `openai` 命令。如果你之前已安装该软件包，且看到的命令与本指南不符，你的 shell 可能仍在解析旧版二进制文件。全新安装的 CLI 不受影响。

## 身份验证

CLI 从以下位置读取你的 API 密钥： `OPENAI_API_KEY`:

命令：

```bash
export OPENAI_API_KEY="sk-..."
```

如果你还没有 API 密钥， [请在仪表板中创建一个](https://platform.openai.com/api-keys).

对于管理 API 端点，请设置 `OPENAI_ADMIN_KEY` 。SDK 层会根据被调用的端点选择管理密钥或默认 API 密钥。

要指向不同的 API 主机，请设置 `OPENAI_BASE_URL`.

## 使用场景

当工作自然属于终端环境时，使用命令行界面：

- 生成本地产物，如图像或语音。
- 将结构化数据提取为 JSONL 格式，供后续 shell 步骤使用。
- 在云端使用带文件、计算机操作和当前网页上下文的 Responses。
- 使用 Admin API 创建项目并生成 API 密钥。

直接将其用于一次性终端请求，或在智能体需要对文件和生成的工件执行可重复的批量工作时从脚本中使用。

## 用于 Codex 的 CLI 与子智能体

对于你希望检查并重新运行的可重复 API 工作，例如批量提取、文件转换、工件生成或审慎的模型选择，请使用 CLI。当工作仍需要判断力时，例如探索代码、比较假设、调试或审查更改，请使用子智能体。

## 全局标志

这些选项适用于所有命令：

| 标记          | 使用                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `--format`    | 将响应打印为 `auto`, `json`, `jsonl`, `pretty`, `raw`, `yaml`，或 `explore`.                           |
| `--transform` | 打印前使用 GJSON 路径提取或重塑响应数据。                                          |
| `--debug`     | 将请求和响应详细信息打印到 stderr。授权信息会被隐去；分享日志前请检查标头。 |

本指南重点介绍 CLI 模式。要获取任何 API 系列的最新参数和响应格式，请使用实时 [API 参考](https://developers.openai.com/api/reference/overview).

当需要将 CLI 指向其他兼容端点时，你也可以更改基础 URL，例如支持不同模型集或仅支持 API 表面子集的部署。

## Responses

对于文本生成、结构化提取、网页搜索、文件理解以及可重复的 Codex 编写的批处理脚本，请使用 Responses。

### 发送你的第一个请求

命令：

```bash
openai responses create \
  --model gpt-5.6 \
  --input "Say hello in one sentence."
```


输出：

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

CLI 默认会打印完整的 API 响应对象。本页中的示例保留了具有代表性的字段，例如 `id`, `status`, `model`, `output`，以及 `usage`，并省略了其余部分。

响应输出可能包含非消息项，例如推理项，它们位于助手消息之前。当你需要助手文本时，请按类型选择消息项，而不是假设它始终是 `output[0]`:

```bash
--transform 'output.#(type=="message").content.0.text'
```

### 向提示中添加本地文件

对于简单的本地文件，使用命令替换内联构建提示词：

```bash
openai responses create \
  --model gpt-5.6 \
  --input "Summarize this note in one sentence.

<note>
$(cat ./note.md)
</note>" \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text'
```


输出：

```text
The note says the launch checklist is ready except for final support ownership.
```

### 传递请求体

对于简短标量输入，使用标志。对于多行提示、工具、文件或嵌套请求体，使用 YAML heredoc。该 heredoc 可以包含你本可以作为标志传递的相同请求字段。

注意那些外观类似 YAML 的字符串值，尤其是包含 `:` 或 `{}`。的提示。使用标志时，生成的解析器可能将这些值解释为结构化 YAML 而非纯文本。如果提示开始看起来像配置，将其放在 `input: |` 下的 YAML 请求体中：

命令：

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


输出：

```text
The release note updates the CLI docs with corrected image generation and installation guidance.
```

当提示本身需要 shell 组装时，构建一个 YAML 请求体并将其管道输入命令：

```bash
{
  printf 'input: |\n'
  printf '  Summarize this note in one sentence.\n\n'
  printf '  <note>\n'
  sed 's/^/  /' ./note.md
  printf '  </note>\n'
} | openai responses create \
  --model gpt-5.6 \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text'
```


### 将结构化数据写入 JSON

当下游脚本需要稳定的 JSON 时，使用结构化输出。将可复用的模式保存到磁盘：

保存为 `schema.json`:

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

命令：

```bash
openai responses create \
  --model gpt-5.6 \
  --instructions "Extract the person and topic from the input." \
  --input "Ada Lovelace wrote notes about the Analytical Engine." \
  --text.format "$(cat ./schema.json)" \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text'
```


输出：

```json
{ "person": "Ada Lovelace", "topic": "notes about the Analytical Engine" }
```

### 将结构化记录写入 JSONL

当一个输入可能生成多条记录时，让模型输出数组并将其扁平化为 JSONL，以便后续 shell 步骤可以逐行处理每条记录：

保存为 `records-schema.json`:

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

命令：

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


这保持了模型响应的结构化，同时每行生成一个 JSON 对象，方便后续 shell 步骤使用。

### 网页搜索

响应可以在同一个 YAML 请求体中调用托管工具：

命令：

```bash
openai responses create \
  --model gpt-5.6 \
  --format yaml \
  --transform 'output.#(type=="message").content.0.text' <<'YAML'
tools:
  - type: web_search
input: |
  Research the latest material news for AAPL.
  Return three concise bullets and cite sources in the text.
YAML
```


输出：

```text
- Apple announced ...
- Analysts highlighted ...
- The company said ...
```

### 文件输入

对于上传的文件（如 PDF），先创建文件，捕获其 ID，并将其作为 `input_file.file_id`:

命令：

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


输出：

```text
- The brief proposes ...
- Risks: migration timing, unclear rollback criteria, and unresolved support ownership.
```

最近生成的构建会将本地文件标志作为多部分文件部分发送，并带有文件名和内容类型元数据。如果本地上传命令因 `UploadFile` 类型错误失败，请更新 CLI 并重试。

## 图像

### 生成图像

生成图像，提取 base64 负载，并将其解码为普通资产文件：

命令：

```bash
openai images generate \
  --model gpt-image-2 \
  --prompt "A simple product-style render of a translucent green cube on a neutral background." \
  --format yaml \
  --transform 'data.0.b64_json' | base64 --decode > hero.png
printf 'wrote hero.png\n'
```


输出：

```text
wrote hero.png
```

当前限制：图像命令尚无原生 `--output` 支持，因此图像生成仍需自行提取 `b64_json` 并解码。

对于 `gpt-image-2`，省略 `--input-fidelity`；图像输入始终以高保真度处理。透明背景在预览中可用；使用 `--background transparent` 配合 `png` （默认）或 `webp`. `jpeg` 不支持透明背景。该模型还支持更广泛的 `--size` 值，相比早期 GPT Image 模型，只要请求的分辨率满足 Image API 尺寸约束。

### 编辑图像

图片编辑在编辑请求成功后采用相同的 base64 提取模式：

命令：

```bash
openai images edit \
  --model gpt-image-2 \
  --image ./hero.png \
  --prompt "Turn the cube bright green." \
  --format yaml \
  --transform 'data.0.b64_json' | base64 --decode > hero-edited.png
printf 'wrote hero-edited.png\n'
```


输出：

```text
wrote hero-edited.png
```

如果本地图片编辑上传失败并出现 `UploadFile` 类型错误，请更新 CLI 并重试。

## 语音

使用语音 API 在本地创建 MP3：

命令：

```bash
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice marin \
  --input "The OpenAI CLI can call the API from ordinary shell scripts." \
  --output speech.mp3
```


输出：

```text
Wrote output to: speech.mp3
```

使用你机器上可用的任何本地音频工具播放它。在 macOS 上：

```bash
afplay speech.mp3
```

使用 `--instructions` 来塑造交付方式，并 `--input` 用于应朗读的词语。指令对于诸如语速、精力、温暖、正式程度、强调或受众等提示效果良好：

```bash
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice marin \
  --instructions "Whisper very quickly, like a hurried stage cue, while staying clear and intelligible." \
  --input "The launch checklist is ready. Please send final feedback by Friday at noon." \
  --output reminder.mp3
```


## 转录

为 shell 管道输出纯文本转录：

命令：

```bash
openai audio:transcriptions create \
  --model gpt-4o-transcribe \
  --file ./speech.mp3 \
  --transform text \
  --raw-output
```


输出：

```text
The OpenAI CLI can call the API from ordinary shell scripts.
```

使用与你所需产物匹配的响应格式：

| 需要                        | 命令格式                                                        |
| --------------------------- | -------------------------------------------------------------------- |
| 纯文本转录       | `--model gpt-4o-transcribe --transform text --raw-output`            |
| 字幕文件              | `--model whisper-1 --response-format srt` 或 `--response-format vtt` |
| 段落或单词时间戳  | `--model whisper-1 --response-format verbose_json`                   |
| 带说话人标签的说话人分离 | `--model gpt-4o-transcribe-diarize --response-format diarized_json`  |

如需词级时间戳，请请求详细的转录格式：

命令：

```bash
openai audio:transcriptions create \
  --model whisper-1 \
  --file ./speech.mp3 \
  --response-format verbose_json \
  --timestamp-granularity word \
  --format json
```


输出：

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

如需带发言者标签的输出，请使用说话人分离模型，并请求 `diarized_json`:

命令：

```bash
openai audio:transcriptions create \
  --model gpt-4o-transcribe-diarize \
  --file ./speech.mp3 \
  --response-format diarized_json \
  --format json
```


输出：

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

`whisper-1` 支持 `json`, `text`, `srt`, `verbose_json`，而 `vtt`. `diarized_json` 是承载 `segments[].speaker`；的格式；在使用相同的说话人分离模型和纯文本 `json`，时，响应包含转录文本但不含发言者标签。

## 管理员 API

使用管理 API 进行组织管理、凭证配置、合规性和使用监控工作流。设置 `OPENAI_ADMIN_KEY`，然后调用生成的 `admin:organization:*` 命令。

要配置新的机器凭证， [创建项目](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/methods/create), [创建服务账号](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/methods/create) 在该项目内，并使用返回的 API 密钥。

### 创建项目、服务账号和 API 密钥

在该项目中创建服务账号会返回未脱敏的 API 密钥给该服务账号。

命令：

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


输出：

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

这会将项目响应写入 `project.json`，将其 ID 解析到下一个命令中，将服务账号响应写入 `service-account.json`，并将返回的凭据写入 `.env` 作为 `OPENAI_API_KEY=...`。将这两个 JSON 文件都视为机密，并将 `project.json`, `service-account.json`、 `.env` 添加至 `.gitignore` 在版本库中使用此模式之前。

关于其余部分，请参阅 [Admin APIs 指南](https://developers.openai.com/api/docs/guides/admin-apis) 以及当前的 [Administration API 参考](https://developers.openai.com/api/reference/administration/overview)。请小心不要将管理员密钥授予未经审查的参与者。