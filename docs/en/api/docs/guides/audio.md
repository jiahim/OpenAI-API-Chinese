# Audio and speech

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Audio models can understand spoken input, generate spoken output, or do both in the same interaction. This guide explains the vocabulary used across OpenAI's audio docs. When you're ready to choose an implementation path, start with the [Realtime and audio overview](https://developers.openai.com/api/docs/guides/realtime).

## Audio modalities

An audio application combines one or more of these modalities:

| Modality        | Meaning                                      | Common use cases                                  |
| --------------- | -------------------------------------------- | ------------------------------------------------- |
| Audio input     | The model receives sound from a user or app. | Voice agents, transcription, translation.         |
| Audio output    | The model or API returns spoken audio.       | Voice agents, text to speech, spoken responses.   |
| Text transcript | Speech becomes text.                         | Captions, call analysis, search, records.         |
| Text prompt     | Text controls what the model says or does.   | Speech generation, scripted voice flows, prompts. |

## Common speech tasks

**Speech to text** converts speech into text. Use it for captions, notes, transcripts, analytics, search, and accessibility. Transcription can be request-based for files or streaming for live audio. Start with the [Transcription overview](https://developers.openai.com/api/docs/guides/transcription) to choose a workflow and model.

**Text to speech** converts text into spoken audio. Use it for narration, assistants, accessibility, and generated voice responses. Speech generation can stream audio back as the model produces it.

**Speech to speech** lets a model listen, reason, and speak in one low-latency session. Use it for conversational voice agents when the assistant needs to respond, call tools, or maintain session state.

**Speech translation** listens to speech in one language and returns translated speech or transcript output in another language. Use a dedicated realtime translation session when translation should begin continuously as audio arrives.

## Streaming and latency

Streaming means the client and service exchange partial input or output while the interaction is still active. Streaming is useful when users expect immediate feedback, such as live captions, calls, voice agents, and translation.

Lower latency requires a realtime connection, more careful audio handling, and a session model that can emit partial events. Request-based APIs are simpler for file uploads and non-interactive work, but they don't support the same live interaction patterns.

## Request-based APIs and realtime sessions

OpenAI supports two broad audio architectures:

| Architecture                | Use when                                             | Examples                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Request-based audio APIs    | You have a file, a text input, or a bounded request. | [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text), [text to speech](https://developers.openai.com/api/docs/guides/text-to-speech).                                                      |
| Realtime sessions           | Audio is live and the app needs low-latency events.  | [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents), [translation](https://developers.openai.com/api/docs/guides/realtime-translation), [transcription](https://developers.openai.com/api/docs/guides/realtime-transcription). |
| Multimodal Chat Completions | You are extending an existing chat flow with audio.  | [Audio input or output](#add-audio-to-your-existing-application).                                                                                              |

For build-path guidance, see the [Realtime and audio overview](https://developers.openai.com/api/docs/guides/realtime).

## Add audio to your existing application

Models such as [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) and [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5) are natively multimodal, meaning they can understand and generate audio and text as input and output.

For live browser speech-to-speech interactions, start with a realtime session in the Agents SDK for JavaScript:

Start a realtime voice session

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


This JavaScript example uses the Agents SDK to connect browser voice agents with WebRTC from the client. For Python voice workflows, use the [Voice agents guide](https://developers.openai.com/api/docs/guides/voice-agents), which covers chained voice pipelines.

If you already have a text-based LLM application with the [Chat Completions endpoint](https://developers.openai.com/api/reference/resources/chat), you may want to add audio capabilities. For example, if your chat application supports text input, you can add audio input and output: include `audio` in the `modalities` array and use an audio model, like [`gpt-audio-1.5`](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

The [Responses API](https://developers.openai.com/api/reference/resources/responses) docs currently describe
  text and image inputs with text outputs. For this audio-chat pattern, use Chat
  Completions with an audio-capable model.



Audio output from model

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

  

  

    
Audio input to model

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