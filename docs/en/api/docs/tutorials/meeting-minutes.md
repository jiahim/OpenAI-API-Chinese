# Meeting minutes

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

In this tutorial, you'll build an automated meeting minutes generator. The application transcribes a meeting recording, summarizes the discussion, extracts key points and action items, analyzes sentiment, and saves the result as a Word document.

## Getting started

This tutorial assumes familiarity with one of the supported languages and an [OpenAI API key](https://platform.openai.com/settings/organization/api-keys). You can use the short smoke-test audio file or your own recording of up to 25 MB.

Install the [OpenAI SDK](https://developers.openai.com/api/docs/libraries) and a DOCX library for your language:

- JavaScript: [`docx`](https://docx.js.org/)
- Python: [`python-docx`](https://python-docx.readthedocs.io/en/latest/)
- Go: [`godocx`](https://github.com/gomutex/godocx)
- Java: [Apache POI XWPF](https://poi.apache.org/components/document/quick-guide-xwpf.html)
- Ruby: [`caracal`](https://github.com/urvin-compliance/caracal)

## Transcribing audio



  

    The first step is to pass the meeting recording to the 
      [/v1/audio API](https://developers.openai.com/api/reference/resources/audio). The current
      file transcription model converts spoken language into written text. To
      start, omit the optional 
      [prompt](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-prompt) 
      and 
      [temperature](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-temperature-4) 
      parameters and use their default values.
    

    

      

Download sample audio


    

  







Save the downloaded file as `meeting.wav` in the directory from which you run the example, or replace `meeting.wav` with the path to your recording. The short downloadable clip verifies the workflow; use an actual meeting recording of up to 25 MB to generate useful summaries and action items.

Define a helper that opens the recording and sends the file contents to [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe):

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


The helper accepts a local audio path, opens the file with the language's standard file API, and passes the file contents to the transcription model. The transcription endpoint needs the audio bytes, not a local path or remote URL. If your server stores recordings elsewhere, download or stream the recording into the request before creating the transcription.

## Summarizing and analyzing the transcript with a GPT model

Pass the transcript to a GPT model through the [Chat Completions API](https://developers.openai.com/api/reference/resources/chat). This tutorial demonstrates the still-supported Chat Completions path for existing integrations. For new projects, use the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) and start with [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra). The snippets below use a tested model to generate a summary, extract key points and action items, and analyze sentiment.

This tutorial uses a separate model call for each task. You can combine the instructions into one request to reduce calls, but separate prompts make each result easier to tune.

Define the shared helper that sends the transcript and task-specific instructions to the model:

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


Define an orchestration helper that returns the four sections of the meeting minutes:

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


The helper passes the transcript to four focused helpers: one each for the summary, key points, action items, and sentiment. Add another helper and output section if your application needs more analysis.

Here is how each of these functions works:

### Summary extraction

The summary helper asks the model for one concise paragraph that preserves important decisions and context while omitting tangents. The system message controls this behavior. For more ways to shape the result, see the [prompt engineering guide](https://developers.openai.com/api/docs/guides/prompt-engineering).

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


### Key points extraction

The key-points helper lists the important ideas, findings, and topics discussed in the meeting. Add relevant project or company context to the system message when it helps the model identify what matters to your audience.

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


### Action item extraction

The action-items helper identifies tasks and follow-ups, including owners and deadlines when the transcript provides them. To create and assign tasks in another system, connect this step to [function calling](https://developers.openai.com/api/docs/guides/function-calling).

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


### Sentiment analysis

The sentiment helper classifies the discussion as positive, negative, or neutral and explains the assessment. For simpler tasks, try [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra) to see whether it meets your quality target with lower cost and latency.

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


## Exporting meeting minutes



  

    Save the meeting minutes in a readable format that you can distribute.
      Microsoft Word is a common choice for this kind of report. The examples
      use a DOCX library suited to each language. In an end-to-end application,
      you could send the result in an email or write it to another system
      instead.
    

  





</br>

Define a helper that writes each result section to a Word document:

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


The helper receives the generated sections and an output filename, adds a heading and paragraph for each section, and saves the document to the current working directory.

Finally, combine the steps to generate meeting minutes from an audio file:

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


This code resolves `meeting.wav` from the process working directory, generates and prints the meeting minutes, and saves them as `meeting_minutes.docx`.

Now that you have a basic meeting minutes workflow, tune the prompts with [prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) or build an end-to-end system with [function calling](https://developers.openai.com/api/docs/guides/function-calling).