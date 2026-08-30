# 会议纪要

> 完整文档索引请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在本教程中，我们将利用 OpenAI 的 Whisper 和 GPT 模型开发一个自动化的会议纪要生成器。该应用会转写会议音频，提供讨论摘要，提取关键要点和行动项，并进行情感分析。

## 入门指南

本教程假定你具备 Python 的基础知识，并且拥有 [OpenAI API 密钥](https://platform.openai.com/settings/organization/api-keys)。你可以使用本教程提供的音频文件，也可以使用自己的音频文件。

此外，你还需要安装 [python-docx](https://python-docx.readthedocs.io/en/latest/) 和 [OpenAI](https://developers.openai.com/api/docs/libraries) 库。你可以使用以下命令创建一个新的 Python 环境并安装所需的包：

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


    

  







接下来，我们导入所需的包，并定义一个使用 Whisper 模型接收音频文件并
对其进行转录的函数：

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


在这个函数中， `audio_file_path` 是你要转录的音频文件的路径。该函数会打开此文件并将其传递给 Whisper ASR 模型（`whisper-1`）进行转录。结果以原始文本形式返回。需要注意的是， `openai.Audio.transcribe` 函数需要传入实际的音频文件，而不仅仅是本地或远程服务器上的文件路径。这意味着，如果你在某个服务器上运行此代码，而该服务器上并未存储音频文件，则需要一个预处理步骤，先将音频文件下载到该设备上。

## 使用 GPT 模型对转录文本进行摘要和分析

获得转录文本后，我们现在通过以下方式将其传递给 GPT 模型： [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。下面的代码片段使用一个经过测试的模型来生成摘要、提取要点、行动项，并执行情感分析。对于新项目，请从 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol).

本教程为每个希望模型执行的任务使用了不同的函数。这并不是执行此任务最高效的方式——你可以将这些指令放在一个函数中，不过，将它们拆分开通常能获得更高质量的摘要。

为了拆分这些任务，我们定义 `meeting_minutes` 函数，它将作为本应用的主函数：

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


在这个函数中， `transcription` 是从 Whisper 获得的文本。该转录内容可以传递给其他四个函数，每个函数都被设计用于执行特定任务： `abstract_summary_extraction` 生成会议摘要， `key_points_extraction` 提取主要要点， `action_item_extraction` 识别行动项，以及 `sentiment_analysis performs` 进行情感分析。如果还需要其他能力，你也可以使用上面展示的同一框架将它们添加进来。

下面是这些函数各自的工作方式：

### 摘要提取

该 `abstract_summary_extraction` 函数接收转录内容并将其总结为一段简洁的摘要，目标是保留最重要的要点，同时避免不必要的细节或离题内容。启用此过程的主要机制是如下所示的系统消息。通过通常称为提示工程的过程，可以有许多不同的方式来实现类似的结果。你可以阅读我们的 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering) ，其中就如何最有效地进行此操作提供了深入的指导建议。

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

该 `key_points_extraction` 函数用于识别并列出会议中讨论的要点。这些要点应代表讨论中最核心的重要观点、发现或话题。同样，控制这些要点识别方式的主要机制是系统消息。你可能希望在此处补充一些关于你的项目或公司运作方式的额外上下文，例如“我们是一家向消费者销售赛车的公司。我们做 XYZ，目标是 XYZ”。这些额外的上下文可以显著提升模型提取相关信息的能力。

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


### 行动项提取

该 `action_item_extraction` function 用于识别会议中达成一致或被提及的任务、待办事项或行动。这些任务可以是指派给特定人员的，也可以是小组决定采取的通用行动。虽然本教程不涉及这部分内容，但 Chat Completions API 提供了一个 [函数调用功能](https://developers.openai.com/api/docs/guides/function-calling) ，借助它你可以自动在你的任务管理软件中创建任务并分派给相关人员。

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

该 `sentiment_analysis` 函数分析讨论的整体情感。它会考虑语气、语言所传达的情绪，以及词语和短语使用的上下文。对于不太复杂的任务，还可以尝试 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra) 看看能否在更低的成本和延迟下获得相近的性能。同样值得尝试的是，将 `sentiment_analysis` 函数的结果传递给其他函数，看看对话的情感如何影响其他属性。

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


在这个函数中，minutes 是一个字典，包含会议的摘要总结、关键要点、行动项和情感分析。Filename 是要创建的 Word 文档文件名。该函数会创建一个新的 Word 文档，为 minutes 的每个部分添加标题和内容，然后将文档保存到当前工作目录。

最后，你可以将所有内容整合起来，从一个音频文件生成会议纪要：

```python
audio_file_path = "Earningscall.wav"
transcription = transcribe_audio(audio_file_path)
minutes = meeting_minutes(transcription)
print(minutes)

save_as_docx(minutes, "meeting_minutes.docx")
```


这段代码会转录音频文件 `Earningscall.wav`，生成会议纪要，将其打印出来，然后保存到一个名为 `meeting_minutes.docx`.

现在你已经有了基本的会议纪要处理流程，可以尝试通过 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) 来优化性能，或者使用原生 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).