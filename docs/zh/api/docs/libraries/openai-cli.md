# OpenAI CLI

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

通过命令行工具直接从终端与 OpenAI API 交互 `openai` 命令行工具。

## 安装

使用 Homebrew 安装 CLI：

```bash
brew install openai/tools/openai
```

或者使用 Go 1.25 或更高版本安装：

```bash
go install 'github.com/openai/openai-cli/cmd/openai@latest'
```

旧版本的 Python SDK 也会安装一个旧版 `openai` 命令。如果你此前已安装该软件包，但所看到的命令与本指南不一致，说明你的 shell 仍在解析旧版本的二进制文件。新安装的 CLI 不受影响。

## 身份验证

CLI 从以下位置读取你的 API 密钥： `OPENAI_API_KEY`:

命令：

```bash
export OPENAI_API_KEY="sk-..."
```

如果你还没有 API 密钥， [在仪表板中创建一个](https://platform.openai.com/api-keys).

对于 Admin API 接口，请设置 `OPENAI_ADMIN_KEY` 。SDK 层会根据所调用的接口选择 admin 密钥或默认的 API 密钥。

若要指向其他 API 主机，请设置 `OPENAI_BASE_URL`.

## 用例

当工作自然属于终端环境时，请使用 CLI：

- 生成本地产物，例如图像或语音。
- 将结构化数据提取为 JSONL，供后续 shell 步骤使用。
- 在云端将 Responses 与文件、计算机使用以及当前网页上下文结合使用。
- 通过 Admin API 创建项目和 API 密钥。

可直接用于一次性终端请求，或在脚本中使用，以便智能体能够对文件和生成的产物进行可重复的批处理工作。

## Codex 中 CLI 与子智能体的对比

当需要可重复、可检查并可重新运行的API工作时（例如批量抽取、文件转换、产物生成或刻意的模型选择），请使用 CLI。当工作仍然需要判断（例如探索代码、比较假设、调试或审查变更）时，请使用子智能体。

## 全局标志

这些选项适用于所有命令：

| Flag          | 用途                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| `--format`    | 打印响应为 `auto`, `json`, `jsonl`, `pretty`, `raw`, `yaml`，或 `explore`.                           |
| `--transform` | 在打印之前使用 GJSON 路径提取或重塑响应数据。                                          |
| `--debug`     | 将请求和响应详细信息打印到 stderr。授权信息会被隐去；分享日志前请检查请求头。 |

本指南侧重于 CLI 模式。有关任何 API 系列的最新参数和响应结构，请参阅实时 [API 参考文档](https://developers.openai.com/api/reference/overview).

当你需要将 CLI 指向另一个兼容端点（例如支持不同模型集的部署，或仅暴露 API 部分接口的部署）时，也可以更改基础 URL。

## Responses

使用 Responses 进行文本生成、结构化提取、网页搜索、文件理解以及可重复运行的 Codex 编写的批处理脚本。

### 发送你的第一个请求

命令：

```bash
openai responses create \
  --model gpt-6-astra \
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

CLI 默认会打印完整的 API 响应对象。本页示例仅保留具有代表性的字段，例如 `id`, `status`, `model`, `output`，以及 `usage`，其余字段省略。

Responses 输出中可能包含非消息项（如推理项），它们会出现在助手消息之前。当你需要获取助手文本时，请按类型选择消息项，而不是假定它始终是 `output[0]`:

```bash
--transform 'output.#(type=="message").content.0.text'
```

### 向 prompt 添加本地文件

对于简单的本地文件，可以使用命令替换将 prompt 内联构建：

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


输出：

```text
The note says the launch checklist is ready except for final support ownership.
```

### 传递请求体

对短小的标量输入使用标志。对多行提示、工具、文件或嵌套的请求体使用 YAML heredoc。heredoc 中可以包含你通常以标志形式传入的相同请求字段。

对于看起来像 YAML 的字符串值要小心，尤其是包含 `:` 或 `{}`。的提示。在使用标志时，生成的解析器可能将这些值解释为结构化 YAML 而非纯文本。如果某个提示开始看起来像是配置，请把它放到 YAML 请求体中的 `input: |` 下：

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

当提示本身需要通过 shell 拼接时，构建一个 YAML 请求体并通过管道传入命令：

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


### 将结构化数据写入 JSON

当下游脚本需要稳定的 JSON 时，使用结构化输出。将可复用的 schema 保存到磁盘：

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
  --model gpt-6-astra \
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

当一个输入可能产生多条记录时，要求模型返回数组并将其扁平化为 JSONL，这样后续的 shell 步骤就能逐行处理每条记录：

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


这样既能保持模型响应的结构化，又能为后续的 shell 步骤生成每行一个 JSON 对象。

### 网页搜索

Responses 可以从同一个 YAML 请求体中调用托管工具：

命令：

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


输出：

```text
- Apple announced ...
- Analysts highlighted ...
- The company said ...
```

### 文件输入

对于已上传的文件（例如 PDF），请先创建文件，捕获其 ID，然后将其作为 `input_file.file_id`:

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

近期生成的构建会将本地文件标志作为 multipart 文件部分发送，并附带文件名和内容类型元数据。如果本地上传命令失败并出现 `UploadFile` 类型错误，请更新 CLI 后重试。

## 图像

### 生成图像

生成一张图片，提取 base64 负载，并将其解码为普通的资源文件：

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

当前的限制：图片相关指令尚不具备原生 `--output` 支持，因此图片生成仍然需要自行提取 `b64_json` 并解码。

对于 `gpt-image-2`，可省略 `--input-fidelity`；图片输入始终以高保真度处理。透明背景目前处于预览阶段，可使用 `--background transparent` 配合 `png` （默认值）或 `webp`. `jpeg` 不支持透明背景。该模型还支持比早期 GPT Image 模型更广泛的 `--size` 取值，只要请求的分辨率满足 Image API 的尺寸约束。

### 编辑图像

图像编辑在编辑请求成功后使用相同的 base64 提取模式：

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

如果本地图像编辑上传失败并出现 `UploadFile` 类型错误，请更新 CLI 后重试。

## 语音

使用 speech API 在本地创建 MP3：

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

用你机器上任何可用的本地音频工具播放它。在 macOS 上：

```bash
afplay speech.mp3
```

使用 `--instructions` 来调整表达方式，以及 `--input` 来指定应被朗读的文本。指令非常适合作为以下提示：语速、能量、亲和感、正式程度、强调或受众：

```bash
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice marin \
  --instructions "Whisper very quickly, like a hurried stage cue, while staying clear and intelligible." \
  --input "The launch checklist is ready. Please send final feedback by Friday at noon." \
  --output reminder.mp3
```


## 转录

输出纯文本转录文本，用于 shell 管道：

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

| 需求                        | 命令形态                                                        |
| --------------------------- | -------------------------------------------------------------------- |
| 纯文本转录文本       | `--model gpt-4o-transcribe --transform text --raw-output`            |
| 字幕文件              | `--model whisper-1 --response-format srt` 或 `--response-format vtt` |
| 片段或词级时间戳  | `--model whisper-1 --response-format verbose_json`                   |
| 带说话人标签的说话人分离 | `--model gpt-4o-transcribe-diarize --response-format diarized_json`  |

如需词级时间戳，请使用详细转录格式：

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

如需带说话人标签的输出，请使用说话人分离模型并请求 `diarized_json`:

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

`whisper-1` 支持 `json`, `text`, `srt`, `verbose_json`，以及 `vtt`. `diarized_json` 是承载以下内容的格式： `segments[].speaker`；使用相同的说话人分离模型并采用纯文本 `json`，响应中包含转录文本但不包含说话人标签。

## 管理 API

使用 Admin API 进行组织管理、凭据配置、合规和使用监控工作流。设置 `OPENAI_ADMIN_KEY`，然后调用生成的 `admin:organization:*` 命令。

若要配置新的机器凭据， [创建项目](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/methods/create), [创建服务账号](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/methods/create) 在该项目中，并使用返回的 API 密钥。

### 创建项目、服务账号和 API 密钥

在该项目中创建服务账号会返回该服务账号的未脱敏 API 密钥。

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

该命令将项目响应写入 `project.json`，解析其 ID 并传入下一条命令，将服务账号响应写入 `service-account.json`，并将返回的凭证写入 `.env` 为 `OPENAI_API_KEY=...`。请将这两个 JSON 文件都视为机密，并将 `project.json`, `service-account.json`，以及 `.env` 添加到 `.gitignore` 中，再在仓库中使用此模式。

有关其余接口，请参阅 [Admin APIs 指南](https://developers.openai.com/api/docs/guides/admin-apis) 以及当前的 [Administration API 参考](https://developers.openai.com/api/reference/administration/overview)。请谨慎向未经审核的角色授予管理员密钥的访问权限。