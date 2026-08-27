# 音频与语音

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` ，可以获取文档页面的 Markdown 版本。

音频模型可以理解语音输入、生成语音输出，或在同一交互中同时实现两者。本指南解释了 OpenAI 音频文档中使用的词汇。当你准备好选择实现路径时，请从 [Realtime 与音频概览](https://developers.openai.com/api/docs/guides/realtime).

## 音频模态

音频应用结合以下一种或多种模态：

| 模态        | 含义                                      | 常见用例                                  |
| --------------- | -------------------------------------------- | ------------------------------------------------- |
| 音频输入     | 模型接收来自用户或应用的声音。 | 语音智能体、转录、翻译。         |
| 音频输出    | 模型或API返回口语化音频。       | 语音智能体、文本转语音、口语化响应。   |
| 文本转录 | 语音变为文本。                         | 字幕、通话分析、搜索、记录。         |
| 文本提示     | 文本控制模型的输出或行为。   | 语音生成、脚本化语音流程、提示。 |

## 常见语音任务

**语音转文本** 将语音转换为文本。可用于字幕、笔记、转录、分析、搜索和无障碍功能。转录可以是基于请求的文件处理，或用于实时音频的流式处理。首先查看 [转录概览](https://developers.openai.com/api/docs/guides/transcription) 以选择 工作流 和模型。

**文本转语音** 将文本转换为口语音频。可用于旁白、助手、无障碍功能和生成的语音回复。语音生成可以在模型生成音频的同时流式返回音频。

**语音转语音** 让模型在一个低延迟会话中完成收听、推理和说话。当助手需要回复、调用工具或维护会话状态时，可用于对话式语音 智能体。

**语音翻译** 听取一种语言的语音，并返回另一种语言的翻译语音或转录输出。当翻译应在音频到达时持续开始时，应使用专门的实时翻译会话。

## 流式传输与延迟

流式传输意味着客户端和服务在交互仍处于活动状态时交换部分输入或输出。当用户期望即时反馈时，流式传输非常有用，例如实时字幕、通话、语音智能体和翻译。

更低的延迟需要实时连接、更细致的音频处理，以及能够发出部分事件的会话模型。基于请求的API对于文件上传和非交互式工作更为简单，但它们不支持相同的实时交互模式。

## 基于请求的API与实时会话

OpenAI 支持两种广泛的音频架构：

| 架构                | 使用场景                                             | 示例                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基于请求的 API    | 你有一个文件、文本输入或有界的请求。 | [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text), [文本转语音](https://developers.openai.com/api/docs/guides/text-to-speech).                                                      |
| 实时会话           | 音频是实时的，应用需要低延迟事件。  | [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents), [翻译](https://developers.openai.com/api/docs/guides/realtime-translation), [转录](https://developers.openai.com/api/docs/guides/realtime-transcription). |
| 多模态 Chat Completions | 你正在使用音频扩展现有的聊天流程。  | [音频输入或输出](#add-audio-to-your-existing-application).                                                                                              |

有关构建路径的指导，请参阅 [Realtime 与音频概览](https://developers.openai.com/api/docs/guides/realtime).

## 向现有应用程序添加音频

诸如此类的模型 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) 和 [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5) 原生支持多模态，意味着它们能够理解并生成音频和文本作为输入和输出。

对于实时浏览器语音到语音交互，可以从 JavaScript 的 Agents SDK 中的实时会话开始：

启动实时语音会话

```javascript
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

const agent = new RealtimeAgent({
  name: "Assistant",
  instructions: "You are a helpful voice assistant.",
});

const session = new RealtimeSession(agent, {
  model: "gpt-realtime-2.1",
});

await session.connect({
  apiKey: "ek_...(ephemeral key from your server)",
});
```


此 JavaScript 示例使用 Agents SDK 从客户端通过 WebRTC 连接浏览器语音 智能体。对于 Python 语音工作流，请使用 [语音 智能体 指南](https://developers.openai.com/api/docs/guides/voice-agents)，该指南涵盖了链式语音流水线。

如果你已有基于文本的 LLM 应用，使用 [Chat Completions 端点](https://developers.openai.com/api/reference/resources/chat)，你可能想要添加音频功能。例如，如果你的聊天应用支持文本输入，你可以添加音频输入和输出：在 `audio` 数组中包含 `modalities` ，并使用音频模型，如 [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

该 [Responses API](https://developers.openai.com/api/reference/resources/responses) 文档当前描述
  文本和图像输入与文本输出。对于这种音频聊天模式，请使用 Chat
  Completions 配合支持音频的模型。



模型的音频输出

    Create a human-like audio response to a prompt

```javascript
import { writeFileSync } from "node:fs";
import OpenAI from "openai";

const openai = new OpenAI();

// Generate an audio response to the given prompt
const response = await openai.chat.completions.create({
  model: "gpt-audio-1.5",
  modalities: ["text", "audio"],
  audio: { voice: "alloy", format: "wav" },
  messages: [
    {
      role: "user",
      content: "Is a golden retriever a good family dog?",
    },
  ],
  store: true,
});

// Inspect returned data
console.log(response.choices[0]);

// Write audio data to a file
writeFileSync(
  "dog.wav",
  Buffer.from(response.choices[0].message.audio.data, "base64"),
  { encoding: "utf-8" }
);
```

```python
import base64
from openai import OpenAI

client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-audio-1.5",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[{"role": "user", "content": "Is a golden retriever a good family dog?"}],
)

print(completion.choices[0])

wav_bytes = base64.b64decode(completion.choices[0].message.audio.data)
with open("dog.wav", "wb") as f:
    f.write(wav_bytes)
```

```go
package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	response, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:      "gpt-audio-1.5",
		Modalities: []string{"text", "audio"},
		Audio: openai.ChatCompletionAudioParam{
			Voice:  openai.ChatCompletionAudioParamVoiceUnion{OfString: openai.String("alloy")},
			Format: openai.ChatCompletionAudioParamFormatWAV,
		},
		Messages: []openai.ChatCompletionMessageParamUnion{openai.UserMessage("Is a golden retriever a good family dog?")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Choices[0])
	audio, err := base64.StdEncoding.DecodeString(response.Choices[0].Message.Audio.Data)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("dog.wav", audio, 0o600); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionAudioParam;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-audio-1.5")
        .addUserMessage("Is a golden retriever a good family dog?")
        .addModality(ChatCompletionCreateParams.Modality.TEXT)
        .addModality(ChatCompletionCreateParams.Modality.AUDIO)
        .audio(
            ChatCompletionAudioParam.builder()
                .voice("alloy")
                .format(ChatCompletionAudioParam.Format.WAV)
                .build())
        .store(true)
        .build();

var message = client.chat().completions().create(params).choices().get(0).message();
var audio =
    message.audio().orElseThrow(() -> new IllegalStateException("No audio output returned"));
Files.write(Path.of("dog.wav"), Base64.getDecoder().decode(audio.data()));
message.content().ifPresent(System.out::println);
```

```csharp
using OpenAI.Chat;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ChatClient client = new("gpt-audio-1.5", key);

ChatCompletionOptions options = new()
{
    ResponseModalities = ChatResponseModalities.Text | ChatResponseModalities.Audio,
    AudioOptions = new(ChatOutputAudioVoice.Alloy, ChatOutputAudioFormat.Wav),
    StoredOutputEnabled = true,
};

ChatCompletion completion = await client.CompleteChatAsync(
    [new UserChatMessage("Is a golden retriever a good family dog?")],
    options
);

if (completion.OutputAudio is not ChatOutputAudio audio)
{
    throw new InvalidOperationException("No audio output was returned.");
}

Console.WriteLine(audio.Transcript);
await File.WriteAllBytesAsync("dog.wav", audio.AudioBytes.ToArray());
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
completion = client.chat.completions.create(
  model: "gpt-audio-1.5",
  messages: [{role: :user, content: "Is a golden retriever a good family dog?"}],
  modalities: [:text, :audio],
  audio: {voice: :alloy, format: :wav},
  store: true
)

audio = completion.choices.fetch(0).message.audio or raise "No audio returned"
File.binwrite("dog.wav", Base64.strict_decode64(audio.data))
```

```bash
curl "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "model": "gpt-audio-1.5",
      "modalities": ["text", "audio"],
      "audio": { "voice": "alloy", "format": "wav" },
      "messages": [
        {
          "role": "user",
          "content": "Is a golden retriever a good family dog?"
        }
      ]
    }'
```

  

  

    
模型的音频输入

    Use audio inputs for prompting a model

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

// Fetch an audio file and convert it to a base64 string
const url = "https://cdn.openai.com/API/docs/audio/alloy.wav";
const audioResponse = await fetch(url);
const buffer = await audioResponse.arrayBuffer();
const base64str = Buffer.from(buffer).toString("base64");

const response = await openai.chat.completions.create({
  model: "gpt-audio-1.5",
  modalities: ["text", "audio"],
  audio: { voice: "alloy", format: "wav" },
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this recording?" },
        {
          type: "input_audio",
          input_audio: { data: base64str, format: "wav" },
        },
      ],
    },
  ],
  store: true,
});

console.log(response.choices[0]);
```

```python
import base64
import requests
from openai import OpenAI

client = OpenAI()

# Fetch the audio file and convert it to a base64 encoded string
url = "https://cdn.openai.com/API/docs/audio/alloy.wav"
response = requests.get(url)
response.raise_for_status()
wav_data = response.content
encoded_string = base64.b64encode(wav_data).decode("utf-8")

completion = client.chat.completions.create(
    model="gpt-audio-1.5",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this recording?"},
                {
                    "type": "input_audio",
                    "input_audio": {"data": encoded_string, "format": "wav"},
                },
            ],
        },
    ],
)

print(completion.choices[0].message)
```

```go
package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	audio, err := os.ReadFile("fixtures/audio.wav")
	if err != nil {
		panic(err)
	}
	client := openai.NewClient()
	response, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:      "gpt-audio-1.5",
		Modalities: []string{"text", "audio"},
		Audio: openai.ChatCompletionAudioParam{
			Voice:  openai.ChatCompletionAudioParamVoiceUnion{OfString: openai.String("alloy")},
			Format: openai.ChatCompletionAudioParamFormatWAV,
		},
		Messages: []openai.ChatCompletionMessageParamUnion{openai.UserMessage([]openai.ChatCompletionContentPartUnionParam{
			openai.TextContentPart("What is in this recording?"),
			openai.InputAudioContentPart(openai.ChatCompletionContentPartInputAudioInputAudioParam{
				Data:   base64.StdEncoding.EncodeToString(audio),
				Format: "wav",
			}),
		})},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Choices[0])
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionAudioParam;
import com.openai.models.chat.completions.ChatCompletionContentPart;
import com.openai.models.chat.completions.ChatCompletionContentPartInputAudio;
import com.openai.models.chat.completions.ChatCompletionContentPartText;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.ChatCompletionUserMessageParam;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;

String encodedAudio =
    Base64.getEncoder()
        .encodeToString(
            Files.readAllBytes(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH"))));

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-audio-1.5")
        .addMessage(
            ChatCompletionUserMessageParam.builder()
                .contentOfArrayOfContentParts(
                    List.of(
                        ChatCompletionContentPart.ofText(
                            ChatCompletionContentPartText.builder()
                                .text("What is in this recording?")
                                .build()),
                        ChatCompletionContentPart.ofInputAudio(
                            ChatCompletionContentPartInputAudio.builder()
                                .inputAudio(
                                    ChatCompletionContentPartInputAudio.InputAudio.builder()
                                        .data(encodedAudio)
                                        .format(
                                            ChatCompletionContentPartInputAudio.InputAudio
                                                .Format.WAV)
                                        .build())
                                .build())))
                .build())
        .addModality(ChatCompletionCreateParams.Modality.TEXT)
        .addModality(ChatCompletionCreateParams.Modality.AUDIO)
        .audio(
            ChatCompletionAudioParam.builder()
                .voice("alloy")
                .format(ChatCompletionAudioParam.Format.WAV)
                .build())
        .store(true)
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ChatClient client = new("gpt-audio-1.5", key);

BinaryData audio = BinaryData.FromBytes(
    await File.ReadAllBytesAsync("audio.wav")
);
UserChatMessage message = new(
    [
        ChatMessageContentPart.CreateTextPart("What is in this recording?"),
        ChatMessageContentPart.CreateInputAudioPart(
            audio,
            ChatInputAudioFormat.Wav
        ),
    ]
);
ChatCompletionOptions options = new()
{
    ResponseModalities = ChatResponseModalities.Text | ChatResponseModalities.Audio,
    AudioOptions = new(ChatOutputAudioVoice.Alloy, ChatOutputAudioFormat.Wav),
    StoredOutputEnabled = true,
};

ChatCompletion completion = await client.CompleteChatAsync([message], options);

if (completion.OutputAudio is not ChatOutputAudio audioOutput)
{
    throw new InvalidOperationException("No audio output was returned.");
}

Console.WriteLine(audioOutput.Transcript);
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
audio = Base64.strict_encode64(File.binread("audio.wav"))
completion = client.chat.completions.create(
  model: "gpt-audio-1.5",
  messages: [{
    role: :user,
    content: [
      {type: :text, text: "What is in this recording?"},
      {type: :input_audio, input_audio: {data: audio, format: :wav}}
    ]
  }],
  modalities: [:text, :audio],
  audio: {voice: :alloy, format: :wav},
  store: true
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "model": "gpt-audio-1.5",
      "modalities": ["text", "audio"],
      "audio": { "voice": "alloy", "format": "wav" },
      "messages": [
        {
          "role": "user",
          "content": [
            { "type": "text", "text": "What is in this recording?" },
            { 
              "type": "input_audio", 
              "input_audio": { 
                "data": "<base64 bytes here>", 
                "format": "wav" 
              }
            }
          ]
        }
      ]
    }'
```