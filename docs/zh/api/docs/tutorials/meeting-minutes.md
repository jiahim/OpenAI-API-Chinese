# 会议纪要

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

在本教程中，你将构建一个自动化的会议纪要生成器。该应用会转写会议录音、总结讨论内容、提取关键要点和行动项、分析情感，并将结果保存为 Word 文档。

## 入门

本教程假设你熟悉受支持的语言之一，并拥有 [OpenAI API 密钥](https://platform.openai.com/settings/organization/api-keys)。你可以使用简短的冒烟测试音频文件，或你自己的录音（最大 25 MB）。

安装 [OpenAI SDK](https://developers.openai.com/api/docs/libraries) 以及适用于你所用语言的 DOCX 库：

- JavaScript: [`docx`](https://docx.js.org/)
- Python: [`python-docx`](https://python-docx.readthedocs.io/en/latest/)
- Go: [`godocx`](https://github.com/gomutex/godocx)
- Java: [Apache POI XWPF](https://poi.apache.org/components/document/quick-guide-xwpf.html)
- Ruby: [`caracal`](https://github.com/urvin-compliance/caracal)

## 转录音频



  

    The first step is to pass the meeting recording to the 
      [/v1/audio API](https://developers.openai.com/api/reference/resources/audio). The current
      file transcription model converts spoken language into written text. To
      start, omit the optional 
      [prompt](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-prompt) 
      and 
      [temperature](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-temperature-4) 
      parameters and use their default values.
    

    

      

下载示例音频


    

  







将下载的文件另存为 `meeting.wav` ，保存到运行示例的目录中，或者将其替换 `meeting.wav` 为你的录音路径。短小的可下载片段用于验证工作流；若要生成有用的摘要和行动项，请使用不超过 25 MB 的真实会议录音。

定义一个用于打开录音并将文件内容发送到的辅助函数 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe):

```javascript
import fs from "node:fs";

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import OpenAI from "openai";

const openai = new OpenAI();

async function transcribeAudio(audioFilePath) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: "gpt-transcribe",
  });
  return transcription.text;
}
```

```python
from pathlib import Path

from docx import Document
from openai import OpenAI

client = OpenAI()


def transcribe_audio(audio_file_path: str | Path) -> str:
    with Path(audio_file_path).open("rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="gpt-transcribe",
        )
    return transcription.text
```

```go
package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/gomutex/godocx"
	"github.com/openai/openai-go/v3"
)

type meetingMinutes struct {
	AbstractSummary string
	KeyPoints       string
	ActionItems     string
	Sentiment       string
}

var client = openai.NewClient()

func transcribeAudio(ctx context.Context, audioFilePath string) (string, error) {
	audioFile, err := os.Open(audioFilePath)
	if err != nil {
		return "", err
	}
	defer audioFile.Close()

	transcription, err := client.Audio.Transcriptions.New(ctx, openai.AudioTranscriptionNewParams{
		File:  audioFile,
		Model: "gpt-transcribe",
	})
	if err != nil {
		return "", err
	}
	return transcription.Text, nil
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFStyle;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTStyle;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STStyleType;

public final class TutorialMeetingMinutesExample {
  private TutorialMeetingMinutesExample() {}

  record MeetingMinutes(
      String abstractSummary, String keyPoints, String actionItems, String sentiment) {}

  private static final class ClientHolder {
    private static final OpenAIClient INSTANCE = OpenAIOkHttpClient.fromEnv();
  }

  private static OpenAIClient client() {
    return ClientHolder.INSTANCE;
  }

  static String transcribeAudio(Path audioFilePath) {
    var transcription =
        client()
            .audio()
            .transcriptions()
            .create(
                TranscriptionCreateParams.builder()
                    .file(audioFilePath)
                    .model("gpt-transcribe")
                    .build());
    return transcription.asTranscription().text();
  }
```

```ruby
require "caracal"
require "openai"
require "pathname"

client = OpenAI::Client.new

def transcribe_audio(client, audio_file_path)
  transcription = client.audio.transcriptions.create(
    file: Pathname(audio_file_path),
    model: "gpt-transcribe"
  )
  transcription.text
end
```


该辅助函数接收本地音频路径，使用该语言的标准文件 API 打开文件，并将文件内容传递给转写模型。转写端点需要的是音频字节，而不是本地路径或远程 URL。如果你的服务器将录音存储在其他位置，请在创建转写请求之前先将录音下载或流式传输到请求中。

## 使用 GPT 模型对转录文本进行总结和分析

通过 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。将转录文本传递给 GPT 模型。本教程演示了仍受支持的 Chat Completions 路径，供现有集成使用。对于新项目，请使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) ，并从 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra)。开始。下面的代码片段使用一个经过测试的模型来生成摘要、提取关键点和行动项，并分析情感。

本教程针对每个任务使用单独的模型调用。你可以将指令合并到一次请求中以减少调用次数，但分开编写提示可以让每个结果更易于调优。

定义一个共享的辅助函数，用于将转录文本和任务相关的指令发送给模型：

```javascript
async function complete(transcription, instructions) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: transcription },
    ],
  });
  return response.choices[0].message.content ?? "";
}
```

```python
def complete(transcription: str, instructions: str) -> str:
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {"role": "system", "content": instructions},
            {"role": "user", "content": transcription},
        ],
    )
    return response.choices[0].message.content or ""
```

```go
func complete(ctx context.Context, transcription, instructions string) (string, error) {
	response, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model: "gpt-5.5",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(instructions),
			openai.UserMessage(transcription),
		},
	})
	if err != nil {
		return "", err
	}
	return response.Choices[0].Message.Content, nil
}
```

```java
private static String complete(String transcription, String instructions) {
  var response =
      client()
          .chat()
          .completions()
          .create(
              ChatCompletionCreateParams.builder()
                  .model("gpt-5.5")
                  .addSystemMessage(instructions)
                  .addUserMessage(transcription)
                  .build());
  return response.choices().get(0).message().content().orElse("");
}
```

```ruby
def complete(client, transcription, instructions)
  response = client.chat.completions.create(
    model: "gpt-5.5",
    messages: [
      {
        role: :system,
        content: instructions
      },
      {
        role: :user,
        content: transcription
      }
    ]
  )
  response.choices.first.message.content || ""
end
```


定义一个编排辅助函数，返回会议纪要的四个部分：

```javascript
async function buildMeetingMinutes(transcription) {
  return {
    "Abstract summary": await extractAbstractSummary(transcription),
    "Key points": await extractKeyPoints(transcription),
    "Action items": await extractActionItems(transcription),
    Sentiment: await analyzeSentiment(transcription),
  };
}
```

```python
def meeting_minutes(transcription: str) -> dict[str, str]:
    return {
        "Abstract summary": abstract_summary_extraction(transcription),
        "Key points": key_points_extraction(transcription),
        "Action items": action_item_extraction(transcription),
        "Sentiment": sentiment_analysis(transcription),
    }
```

```go
func buildMeetingMinutes(ctx context.Context, transcription string) (meetingMinutes, error) {
	summary, err := extractAbstractSummary(ctx, transcription)
	if err != nil {
		return meetingMinutes{}, err
	}
	keyPoints, err := extractKeyPoints(ctx, transcription)
	if err != nil {
		return meetingMinutes{}, err
	}
	actionItems, err := extractActionItems(ctx, transcription)
	if err != nil {
		return meetingMinutes{}, err
	}
	sentiment, err := analyzeSentiment(ctx, transcription)
	if err != nil {
		return meetingMinutes{}, err
	}
	return meetingMinutes{summary, keyPoints, actionItems, sentiment}, nil
}
```

```java
static MeetingMinutes buildMeetingMinutes(String transcription) {
  return new MeetingMinutes(
      extractAbstractSummary(transcription),
      extractKeyPoints(transcription),
      extractActionItems(transcription),
      analyzeSentiment(transcription));
}
```

```ruby
def build_meeting_minutes(client, transcription)
  {
    "Abstract summary" => extract_abstract_summary(client, transcription),
    "Key points" => extract_key_points(client, transcription),
    "Action items" => extract_action_items(client, transcription),
    "Sentiment" => analyze_sentiment(client, transcription)
  }
end
```


该辅助函数将转录文本传递给四个专注的辅助函数：分别用于摘要、关键点、行动项和情感。如果你的应用需要更多分析，可以添加另一个辅助函数和输出部分。

下面介绍这些函数各自的工作方式：

### Summary extraction

摘要助手会要求模型生成一段简明的文字，在保留重要决策和上下文的同时省略无关内容。这一行为由系统消息控制。若想了解更多塑造结果的方式，请参阅 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering).

```javascript
async function extractAbstractSummary(transcription) {
  return complete(
    transcription,
    "Summarize the meeting transcript in one concise paragraph. Keep the most important decisions and context, and omit tangents."
  );
}
```

```python
def abstract_summary_extraction(transcription: str) -> str:
    return complete(
        transcription,
        "Summarize the meeting transcript in one concise paragraph. "
        "Keep the most important decisions and context, and omit tangents.",
    )
```

```go
func extractAbstractSummary(ctx context.Context, transcription string) (string, error) {
	return complete(ctx, transcription, "Summarize the meeting transcript in one concise paragraph. Keep the most important decisions and context, and omit tangents.")
}
```

```java
static String extractAbstractSummary(String transcription) {
  return complete(
      transcription,
      "Summarize the meeting transcript in one concise paragraph. "
          + "Keep the most important decisions and context, and omit tangents.");
}
```

```ruby
def extract_abstract_summary(client, transcription)
  complete(
    client,
    transcription,
    "Summarize the meeting transcript in one concise paragraph. Keep the most important decisions and context, and omit tangents."
  )
end
```


### 要点提取

要点助手会列出会议中讨论的重要观点、发现和主题。当有助于模型识别对你的受众重要的内容时，向系统消息中添加相关的项目或公司上下文。

```javascript
async function extractKeyPoints(transcription) {
  return complete(
    transcription,
    "List the most important ideas, findings, and topics from the meeting. Use concise bullet points."
  );
}
```

```python
def key_points_extraction(transcription: str) -> str:
    return complete(
        transcription,
        "List the most important ideas, findings, and topics from the meeting. "
        "Use concise bullet points.",
    )
```

```go
func extractKeyPoints(ctx context.Context, transcription string) (string, error) {
	return complete(ctx, transcription, "List the most important ideas, findings, and topics from the meeting. Use concise bullet points.")
}
```

```java
static String extractKeyPoints(String transcription) {
  return complete(
      transcription,
      "List the most important ideas, findings, and topics from the meeting. "
          + "Use concise bullet points.");
}
```

```ruby
def extract_key_points(client, transcription)
  complete(
    client,
    transcription,
    "List the most important ideas, findings, and topics from the meeting. Use concise bullet points."
  )
end
```


### 行动项提取

action-items 助手会识别任务和后续跟进事项，当转录文本中包含负责人和截止时间时也会一并提取。如需在其他系统中创建并分配任务，可将此步骤连接到 [function calling](https://developers.openai.com/api/docs/guides/function-calling).

```javascript
async function extractActionItems(transcription) {
  return complete(
    transcription,
    "List every task or follow-up agreed to in the meeting. Include the owner and deadline when the transcript provides them."
  );
}
```

```python
def action_item_extraction(transcription: str) -> str:
    return complete(
        transcription,
        "List every task or follow-up agreed to in the meeting. "
        "Include the owner and deadline when the transcript provides them.",
    )
```

```go
func extractActionItems(ctx context.Context, transcription string) (string, error) {
	return complete(ctx, transcription, "List every task or follow-up agreed to in the meeting. Include the owner and deadline when the transcript provides them.")
}
```

```java
static String extractActionItems(String transcription) {
  return complete(
      transcription,
      "List every task or follow-up agreed to in the meeting. "
          + "Include the owner and deadline when the transcript provides them.");
}
```

```ruby
def extract_action_items(client, transcription)
  complete(
    client,
    transcription,
    "List every task or follow-up agreed to in the meeting. Include the owner and deadline when the transcript provides them."
  )
end
```


### 情感分析

情感助手会将讨论分类为正面、负面或中性，并说明评估依据。对于更简单的任务，可以尝试 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra) 看看它是否能以更低的成本和延迟达到你的质量目标。

```javascript
async function analyzeSentiment(transcription) {
  return complete(
    transcription,
    "Describe the meeting's overall sentiment as positive, negative, or neutral, and briefly explain the assessment."
  );
}
```

```python
def sentiment_analysis(transcription: str) -> str:
    return complete(
        transcription,
        "Describe the meeting's overall sentiment as positive, negative, or "
        "neutral, and briefly explain the assessment.",
    )
```

```go
func analyzeSentiment(ctx context.Context, transcription string) (string, error) {
	return complete(ctx, transcription, "Describe the meeting's overall sentiment as positive, negative, or neutral, and briefly explain the assessment.")
}
```

```java
static String analyzeSentiment(String transcription) {
  return complete(
      transcription,
      "Describe the meeting's overall sentiment as positive, negative, or neutral, "
          + "and briefly explain the assessment.");
}
```

```ruby
def analyze_sentiment(client, transcription)
  complete(
    client,
    transcription,
    "Describe the meeting's overall sentiment as positive, negative, or neutral, and briefly explain the assessment."
  )
end
```


## 导出会议纪要



  

    Save the meeting minutes in a readable format that you can distribute.
      Microsoft Word is a common choice for this kind of report. The examples
      use a DOCX library suited to each language. In an end-to-end application,
      you could send the result in an email or write it to another system
      instead.
    

  





</br>

定义一个用于将每个结果小节写入 Word 文档的辅助函数：

```javascript
async function saveAsDocx(minutes, filename) {
  const children = Object.entries(minutes).flatMap(([heading, content]) => [
    new Paragraph({ text: heading, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({
      children: content
        .split(/\r\n?|\n/)
        .flatMap((line, index) => [
          ...(index > 0 ? [new TextRun({ break: 1 })] : []),
          new TextRun(line),
        ]),
    }),
  ]);
  const document = new Document({ sections: [{ children }] });
  await fs.promises.writeFile(filename, await Packer.toBuffer(document));
}
```

```python
def save_as_docx(minutes: dict[str, str], filename: Path) -> None:
    document = Document()
    for heading, content in minutes.items():
        document.add_heading(heading, level=1)
        document.add_paragraph(content)
    document.save(filename)
```

```go
func saveAsDocx(minutes meetingMinutes, filename string) error {
	document, err := godocx.NewDocument()
	if err != nil {
		return err
	}
	for _, section := range []struct{ heading, content string }{
		{"Abstract summary", minutes.AbstractSummary},
		{"Key points", minutes.KeyPoints},
		{"Action items", minutes.ActionItems},
		{"Sentiment", minutes.Sentiment},
	} {
		document.AddHeading(section.heading, 1)
		for _, line := range strings.Split(strings.ReplaceAll(section.content, "\r\n", "\n"), "\n") {
			document.AddParagraph(line)
		}
	}
	return document.SaveTo(filename)
}
```

```java
static void saveAsDocx(MeetingMinutes minutes, Path filename) throws IOException {
  try (var document = new XWPFDocument();
      OutputStream output = Files.newOutputStream(filename)) {
    addHeadingStyle(document);
    addSection(document, "Abstract summary", minutes.abstractSummary());
    addSection(document, "Key points", minutes.keyPoints());
    addSection(document, "Action items", minutes.actionItems());
    addSection(document, "Sentiment", minutes.sentiment());
    document.write(output);
  }
}

private static void addHeadingStyle(XWPFDocument document) {
  var headingStyle = CTStyle.Factory.newInstance();
  headingStyle.setStyleId("Heading1");
  headingStyle.addNewName().setVal("Heading 1");
  headingStyle.setType(STStyleType.PARAGRAPH);
  headingStyle.addNewPPr().addNewOutlineLvl().setVal(BigInteger.ZERO);
  document.createStyles().addStyle(new XWPFStyle(headingStyle));
}

private static void addSection(XWPFDocument document, String heading, String content) {
  var headingParagraph = document.createParagraph();
  headingParagraph.setStyle("Heading1");
  var headingRun = headingParagraph.createRun();
  headingRun.setBold(true);
  headingRun.setFontSize(16);
  headingRun.setText(heading);
  var contentRun = document.createParagraph().createRun();
  String[] lines = content.split("\\R", -1);
  for (int index = 0; index < lines.length; index += 1) {
    if (index > 0) contentRun.addBreak();
    contentRun.setText(lines[index]);
  }
}
```

```ruby
def save_as_docx(minutes, filename)
  Caracal::Document.save(filename) do |document|
    minutes.each do |heading, content|
      document.h1(heading)
      content.split(/\r\n?|\n/, -1).each { |line| document.p(line) }
    end
  end
end
```


该辅助函数接收生成的小节和输出文件名，为每个小节添加标题和段落，然后将文档保存到当前工作目录。

最后，将这些步骤组合起来，从音频文件生成会议纪要：

```javascript
const transcription = await transcribeAudio("meeting.wav");
const minutes = await buildMeetingMinutes(transcription);
console.log(minutes);
await saveAsDocx(minutes, "meeting_minutes.docx");
```

```python
audio_file_path = Path("meeting.wav")
transcription = transcribe_audio(audio_file_path)
minutes = meeting_minutes(transcription)
print(minutes)
save_as_docx(minutes, Path("meeting_minutes.docx"))
```

```go
func main() {
	ctx := context.Background()
	transcription, err := transcribeAudio(ctx, "meeting.wav")
	if err != nil {
		panic(err)
	}
	minutes, err := buildMeetingMinutes(ctx, transcription)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%+v\n", minutes)
	if err := saveAsDocx(minutes, "meeting_minutes.docx"); err != nil {
		panic(err)
	}
}
```

```java
public static void main(String[] args) throws IOException {
    String transcription = transcribeAudio(Path.of("meeting.wav"));
    MeetingMinutes minutes = buildMeetingMinutes(transcription);
    System.out.println(minutes);
    saveAsDocx(minutes, Path.of("meeting_minutes.docx"));
  }
}
```

```ruby
transcription = transcribe_audio(client, "meeting.wav")
minutes = build_meeting_minutes(client, transcription)
puts minutes
save_as_docx(minutes, "meeting_minutes.docx")
```


这段代码解析 `meeting.wav` （从进程工作目录中获取），生成并打印会议纪要，并将其保存为 `meeting_minutes.docx`.

现在你已经有了一个基本的会议纪要工作流，可以使用 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) 对其进行调优，或使用 [function calling](https://developers.openai.com/api/docs/guides/function-calling).