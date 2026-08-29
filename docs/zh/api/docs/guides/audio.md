# 音频和语音

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

音频模型可以理解语音输入、生成语音输出，或在同一交互中同时实现两者。本指南介绍 OpenAI 音频文档中使用的术语。当你准备好选择实现方案时，可以从以下内容开始： [Realtime and audio overview](https://developers.openai.com/api/docs/guides/realtime).

## 音频模态

一个音频应用会组合使用以下一种或多种模态：

| 模态        | 含义                                      | 常见用例                                  |
| --------------- | -------------------------------------------- | ------------------------------------------------- |
| 音频输入     | 模型接收来自用户或应用的声音。 | 语音智能体、转录、翻译。         |
| 音频输出    | 模型或API 返回口语音频。       | 语音智能体、文本转语音、口语回复。   |
| 文本转录 | 语音转换为文本。                         | 字幕、通话分析、搜索、记录。         |
| 文本提示     | 文本控制模型要说或要做的事情。   | 语音生成、脚本化语音流程、提示。 |

## 常见语音任务

**Speech to text** 将语音转换为文字。可用于字幕、笔记、转写、分析、搜索和无障碍场景。转写可以基于请求处理文件，也可以通过流式处理实时音频。从 [转写概述](https://developers.openai.com/api/docs/guides/transcription) 入手，选择工作流和模型。

**Text to speech** 将文字转换为口语音频。可用于旁白、助手、无障碍场景以及生成的语音回复。语音生成可以在模型产生音频时将其以流式方式返回。

**Speech to speech** 让模型在同一个低延迟会话中完成倾听、推理和发声。当助手需要回复、调用工具或维护会话状态时，可用于构建对话式语音智能体。

**Speech translation** 收听一种语言的语音，并以另一种语言返回翻译后的语音或转写文本。当音频到达时需要持续开始翻译时，可使用专用的实时翻译会话。

## 流式传输与延迟

流式传输意味着客户端和服务在交互仍在进行时交换部分输入或输出。当用户期望即时反馈时，例如实时字幕、通话、语音智能体和翻译，流式传输非常有用。

较低的延迟需要实时连接、更细致的音频处理，以及能够发出部分事件的会话模型。基于请求的API对于文件上传和非交互式工作来说更简单，但它们不支持相同的实时交互模式。

## 基于请求的 API 与实时会话

OpenAI 支持两大类音频架构：

| 架构                | 使用场景                                             | 示例                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基于请求的音频 API    | 你拥有文件、文本输入或有界的请求。 | [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text), [文字转语音](https://developers.openai.com/api/docs/guides/text-to-speech).                                                      |
| 实时会话           | 音频是实时的，且应用需要低延迟事件。  | [语音 智能体](https://developers.openai.com/api/docs/guides/voice-agents), [翻译](https://developers.openai.com/api/docs/guides/realtime-translation), [转录](https://developers.openai.com/api/docs/guides/realtime-transcription). |
| 多模态 Chat Completions | 你正在使用音频扩展现有的聊天流程。  | [音频输入或输出](#add-audio-to-your-existing-application).                                                                                              |

有关构建路径指引，请参阅 [Realtime and audio overview](https://developers.openai.com/api/docs/guides/realtime).

## 为现有应用添加音频

诸如 [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) 和 [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5) 这类模型本身是多模态的，意味着它们能够理解并生成音频和文本形式的输入与输出。

对于浏览器中实时的语音对语音交互，请先在 JavaScript 中使用 Agents SDK 启动一个实时会话：

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


这个 JavaScript 示例使用 Agents SDK 将浏览器中的语音 智能体 通过 WebRTC 从客户端进行连接。如果是 Python 语音工作流，请使用 [Voice 智能体 指南](https://developers.openai.com/api/docs/guides/voice-agents)，其中涵盖了链式语音流水线。

如果你已经基于 [Chat Completions 端点](https://developers.openai.com/api/reference/resources/chat)，构建了一个基于文本的 LLM 应用，你可能希望为其增加音频能力。例如，如果你的聊天应用支持文本输入，你可以同时加入音频输入与输出：在 `audio` 数组中加入 `modalities` ，并使用一个支持音频的模型，例如 [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

该 [Responses API](https://developers.openai.com/api/reference/resources/responses) 文档目前介绍的是
  文本和图像输入配合文本输出。对于这种音频聊天模式，请使用支持音频的模型调用 Chat
  Completions。



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