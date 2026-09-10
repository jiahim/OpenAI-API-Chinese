# Chat Completions 中的音频

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页的 Markdown 版本。

如果你已经拥有一个基于文本的 LLM 应用，使用 [Chat Completions 端点](https://developers.openai.com/api/reference/resources/chat)，可以为其添加音频功能。例如，如果你的聊天应用支持文本输入，你可以增加音频输入和输出：在 `audio` 数组中加入 `modalities` 字段并使用支持音频的模型，例如 [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

该 [Responses API](https://developers.openai.com/api/reference/resources/responses) 文档目前描述的是
  文本和图像输入与文本输出。对于这种音频聊天模式，请使用 Chat
  Completions 并选择支持音频的模型。



模型输出的音频

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