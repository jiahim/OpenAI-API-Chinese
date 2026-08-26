# 会议纪要

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来访问。

在本教程中，我们将利用 OpenAI 的 Whisper 和 GPT 模型开发一个自动会议纪要生成器。该应用会转录会议音频，提供讨论摘要，提取关键点和行动项，并进行情感分析。

## 开始使用

本教程假定你对 Python 有基本了解，并且已经拥有 [OpenAI API 密钥](https://platform.openai.com/settings/organization/api-keys)。你可以使用本教程提供的音频文件，也可以使用自己的。

此外，你还需要安装 [python-docx](https://python-docx.readthedocs.io/en/latest/) 和 [OpenAI](https://developers.openai.com/api/docs/libraries) 库。你可以使用以下命令创建新的 Python 环境并安装所需的包：

```bash
python -m venv env

source env/bin/activate

pip install openai
pip install python-docx
```

## 使用 Whisper 转录音频



  

    The first step in transcribing the audio from a meeting is to pass the
      audio file of the meeting into our 
      [/v1/audio API](https://developers.openai.com/api/reference/resources/audio). Whisper, the
      model that powers the audio API, is capable of converting spoken language
      into written text. To start, we will avoid passing a 
      [prompt](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-prompt) 
      or 
      [temperature](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-temperature-4) 
      (optional parameters to control the model's output) and stick with the
      default values.
    

    

      

下载示例音频


    

  







接下来，我们导入所需的包并定义一个函数，该函数使用 Whisper 模型接收音频文件并
进行转录：

```python
from docx import Document
from openai import OpenAI

client = OpenAI()


def transcribe_audio(audio_file_path):
    with open(audio_file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1",
        )
    return transcription.text
```


在这个函数中， `audio_file_path` 是你要转录的音频文件的路径。该函数打开此文件并将其传递给 Whisper ASR 模型（`whisper-1`）进行转录。结果以原始文本形式返回。需要注意的是， `openai.Audio.transcribe` 该函数要求传入实际的音频文件，而不仅仅是本地或远程服务器上的文件路径。这意味着，如果你在服务器上运行此代码，而音频文件可能不存储在该服务器上，你需要有一个预处理步骤，首先将音频文件下载到该设备上。

## 使用 GPT 模型总结和分析转录文本

获得转录文本后，我们现在通过 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。将其传递给 GPT 模型。下面的代码片段使用一个经过测试的模型来生成摘要、提取关键点、行动项并进行情感分析。对于新项目，从 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol).

本教程为希望模型执行的每项任务使用不同的函数。这不是完成此任务的最有效方式——你可以将这些指令放入一个函数中，然而，将它们拆分可以带来更高质量的摘要。

为了拆分任务，我们定义了 `meeting_minutes` 函数，该函数将作为此应用程序的主函数：

```python
def meeting_minutes(transcription):
    abstract_summary = abstract_summary_extraction(transcription)
    key_points = key_points_extraction(transcription)
    action_items = action_item_extraction(transcription)
    sentiment = sentiment_analysis(transcription)
    return {
        "abstract_summary": abstract_summary,
        "key_points": key_points,
        "action_items": action_items,
        "sentiment": sentiment,
    }
```


在此函数中， `transcription` 是我们从 Whisper 获得的文本。转录文本可以传递给另外四个函数，每个函数旨在执行特定任务： `abstract_summary_extraction` 生成会议摘要， `key_points_extraction` 提取关键点， `action_item_extraction` 识别行动项，以及 `sentiment_analysis performs` 进行情感分析。如果你有其他想要的功能，也可以使用上面所示的相同框架添加。

以下是这些函数各自的工作方式：

### 摘要提取

该 `abstract_summary_extraction` 函数获取转录内容并将其总结为一段简洁的摘要，旨在保留最重要的要点，同时避免不必要的细节或无关的话题。实现此过程的主要机制是系统消息，如下所示。通过通常称为提示工程的流程，有许多不同的方法可以达到类似的结果。你可以阅读我们的 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering) ，其中提供了关于如何最有效地进行此操作的深入建议。

```python
def abstract_summary_extraction(transcription):
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {
                "role": "system",
                "content": "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points.",
            },
            {"role": "user", "content": transcription},
        ],
    )
    return response.choices[0].message.content or ""
```


### 要点提取

该 `key_points_extraction` 函数识别并列出会议中讨论的主要观点。这些观点应代表对讨论本质至关重要的最重要想法、发现或主题。同样，控制这些观点识别方式的主要机制是系统消息。你可能需要在此处添加一些关于你的项目或公司运作方式的额外背景，例如“我们是一家向消费者销售赛车的公司。我们以 XYZ 为目标开展 XYZ 业务”。这些额外背景可以显著提高模型提取相关信息的能力。

```python
def key_points_extraction(transcription):
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {
                "role": "system",
                "content": "You are a proficient AI with a specialty in distilling information into key points. Based on the following text, identify and list the main points that were discussed or brought up. These should be the most important ideas, findings, or topics that are crucial to the essence of the discussion. Your goal is to provide a list that someone could read to quickly understand what was talked about.",
            },
            {"role": "user", "content": transcription},
        ],
    )
    return response.choices[0].message.content or ""
```


### 操作项提取

该 `action_item_extraction` 函数识别会议期间商定或提及的任务、分配事项或行动。这些可以是分配给特定个人的任务，也可以是团队决定采取的总体行动。虽然本教程不涉及，但Chat Completions API提供了 [函数调用能力](https://developers.openai.com/api/docs/guides/function-calling) ，使您能够构建功能，自动在任务管理软件中创建任务并分配给相关人员。

```python
def action_item_extraction(transcription):
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {
                "role": "system",
                "content": "You are an AI expert in analyzing conversations and extracting action items. Please review the text and identify any tasks, assignments, or actions that were agreed upon or mentioned as needing to be done. These could be tasks assigned to specific individuals, or general actions that the group has decided to take. Please list these action items clearly and concisely.",
            },
            {"role": "user", "content": transcription},
        ],
    )
    return response.choices[0].message.content or ""
```


### 情感分析

该 `sentiment_analysis` 函数分析整个讨论的总体情感。它会考虑语气、所用语言传达的情绪以及词语和短语使用的语境。对于较简单的任务，也值得尝试 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra) ，看看是否能以更低的成本和延迟获得相似的性能水平。尝试将 `sentiment_analysis` 函数的结果传递给其他函数，以观察对话情感如何影响其他属性，这可能会很有用。

```python
def sentiment_analysis(transcription):
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[
            {
                "role": "system",
                "content": "As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following text. Please consider the overall tone of the discussion, the emotion conveyed by the language used, and the context in which words and phrases are used. Indicate whether the sentiment is generally positive, negative, or neutral, and provide brief explanations for your analysis where possible.",
            },
            {"role": "user", "content": transcription},
        ],
    )
    return response.choices[0].message.content or ""
```


## 导出会议纪要



  

    Once we've generated the meeting minutes, it's beneficial to save them
      into a readable format that can be easily distributed. One common format
      for such reports is Microsoft Word. The Python docx library is a popular
      open source library for creating Word documents. If you wanted to build an
      end-to-end meeting minute application, you might consider removing this
      export step in favor of sending the summary inline as an email followup.
    

  





</br>

为了处理导出过程，定义一个函数 `save_as_docx` ，将原始文本转换为 Word 文档：

```python
def save_as_docx(minutes, filename):
    doc = Document()
    for key, value in minutes.items():
        # Replace underscores with spaces and capitalize each word for the heading
        heading = " ".join(word.capitalize() for word in key.split("_"))
        doc.add_heading(heading, level=1)
        doc.add_paragraph(value)
        # Add a line break between sections
        doc.add_paragraph()
    doc.save(filename)
```


在这个函数中，minutes 是一个包含会议摘要、关键点、行动项和情感分析的字典。Filename 是要创建的 Word 文档文件的名称。该函数创建一个新的 Word 文档，为会议记录的每个部分添加标题和内容，然后将文档保存到当前工作目录。

最后，你可以将所有内容组合起来，从音频文件生成会议记录：

```python
audio_file_path = "Earningscall.wav"
transcription = transcribe_audio(audio_file_path)
minutes = meeting_minutes(transcription)
print(minutes)

save_as_docx(minutes, "meeting_minutes.docx")
```


这段代码将转录音频文件 `Earningscall.wav`，生成会议记录，打印它们，然后将其保存到名为 `meeting_minutes.docx`.

现在你已经有了基本的会议记录处理设置，可以考虑尝试通过 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) 来优化性能，或使用原生 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).