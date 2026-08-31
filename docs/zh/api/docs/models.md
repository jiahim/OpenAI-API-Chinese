# 模型

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取 Markdown 版本的文档页面。

> 探索 OpenAI API 上可用的模型。

如果你不确定从何入手，可以使用 [GPT-5.6 Sol](/api/docs/models/gpt-5.6-sol)，这是我们在复杂推理和编码方面的旗舰模型。选择 [GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra) 可以在智能与成本之间取得平衡，或者选择 [GPT-5.6 Luna](/api/docs/models/gpt-5.6-luna) 用于成本敏感的高吞吐量工作负载。

所有最新的 OpenAI 模型都支持文本和图像输入、文本输出、多语言能力和视觉理解。可通过 [Responses API](/api/reference/resources/responses/methods/create) 以及我们的 [客户端 SDK](/api/docs/libraries).

## Recommended models

- [GPT-5.6 Sol](/api/docs/models/gpt-5.6-sol.md)：从这里开始，处理复杂的推理和编码任务。
- [GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra.md)：在智能与成本之间取得平衡。
- [GPT-5.6 Luna](/api/docs/models/gpt-5.6-luna.md)：针对高吞吐量、对成本敏感的工作负载进行优化。

## 浏览我们的完整模型目录

面向各类任务的多样化模型

查看 [OpenAI 如何使用你的数据](/api/docs/guides/your-data.md) 并查看 [已弃用的模型](/api/docs/deprecations.md).

- [babbage-002](/api/docs/models/babbage-002.md): 用于替代 GPT-3 ada 和 babbage 基础模型
- [Chat Latest](/api/docs/models/chat-latest.md): ChatGPT 中使用的最新 Instant 模型
- [ChatGPT-4o](/api/docs/models/chatgpt-4o-latest.md): ChatGPT 中使用的 GPT-4o 模型
- [chatgpt-image-latest](/api/docs/models/chatgpt-image-latest.md): ChatGPT 中使用的上一代图像模型。
- [codex-mini-latest](/api/docs/models/codex-mini-latest.md): 为 Codex CLI 优化的快速推理模型
- [computer-use-preview](/api/docs/models/computer-use-preview.md): 专为计算机使用工具设计的模型
- [davinci-002](/api/docs/models/davinci-002.md): 用于替代 GPT-3 curie 和 davinci 基础模型
- [Daybreak Blue](/api/docs/models/gpt-daybreak-blue-latest.md): 旗舰通用模型的别名，并附带针对防御性网络安全工作的安全防护。
- [Daybreak Red](/api/docs/models/gpt-daybreak-red-latest.md): 用于已获授权的漏洞研究与安全测试的高级网络安全模型别名。
- [GPT-3.5 Turbo](/api/docs/models/gpt-3.5-turbo.md): 用于低成本聊天与非聊天任务的旧版 GPT 模型
- [GPT-4](/api/docs/models/gpt-4.md)：较旧的高智能 GPT 模型
- [GPT-4 Turbo](/api/docs/models/gpt-4-turbo.md)：较旧的高智能 GPT 模型
- [GPT-4 Turbo Preview](/api/docs/models/gpt-4-turbo-preview.md)：较旧的快速 GPT 模型
- [GPT-4.1](/api/docs/models/gpt-4.1.md)：最智能的非推理模型
- [GPT-4.1 Mini](/api/docs/models/gpt-4.1-mini.md)：体积更小、速度更快的 GPT-4.1 版本
- [GPT-4.1 nano](/api/docs/models/gpt-4.1-nano.md)：速度最快、成本效益最高的 GPT-4.1 版本
- [GPT-4.5 Preview](/api/docs/models/gpt-4.5-preview.md)：已弃用的大模型。
- [GPT-4o](/api/docs/models/gpt-4o.md)：快速、智能、灵活的 GPT 模型
- [GPT-4o Audio](/api/docs/models/gpt-4o-audio-preview.md)：支持音频输入和输出的 GPT-4o 模型
- [GPT-4o Mini](/api/docs/models/gpt-4o-mini.md)：面向专注任务的快速、经济型小模型
- [GPT-4o Mini Audio](/api/docs/models/gpt-4o-mini-audio-preview.md): 支持音频输入和输出的较小模型
- [GPT-4o Mini Realtime](/api/docs/models/gpt-4o-mini-realtime-preview.md): 面向文本和音频输入与输出的较小实时模型
- [GPT-4o Mini Search Preview](/api/docs/models/gpt-4o-mini-search-preview.md): 快速、经济的小型模型，用于网页搜索
- [GPT-4o Mini Transcribe](/api/docs/models/gpt-4o-mini-transcribe.md): 由 GPT-4o Mini 提供支持的语音转文本模型
- [GPT-4o Mini TTS](/api/docs/models/gpt-4o-mini-tts.md): 由 GPT-4o Mini 提供支持的文本转语音模型
- [GPT-4o Realtime](/api/docs/models/gpt-4o-realtime-preview.md): 支持实时文本和音频输入与输出的模型
- [GPT-4o Search Preview](/api/docs/models/gpt-4o-search-preview.md): 在 Chat Completions 中用于网页搜索的 GPT 模型
- [GPT-4o Transcribe](/api/docs/models/gpt-4o-transcribe.md): 由 GPT-4o 提供支持的语音转文本模型
- [GPT-4o Transcribe Diarize](/api/docs/models/gpt-4o-transcribe-diarize.md): 能够识别说话者身份的转录模型
- [GPT-5](/api/docs/models/gpt-5.md): 此前用于编码与智能体任务的推理模型，支持可配置的推理力度
- [GPT-5 Chat](/api/docs/models/gpt-5-chat-latest.md): ChatGPT 中使用的 GPT-5 模型
- [GPT-5 Mini](/api/docs/models/gpt-5-mini.md): 面向成本敏感、低延迟、高吞吐量工作负载的强大智能
- [GPT-5 nano](/api/docs/models/gpt-5-nano.md): 速度最快、成本效益最高的 GPT-5 版本
- [GPT-5 Pro](/api/docs/models/gpt-5-pro.md): 生成更智能、更精确响应的 GPT-5 版本
- [GPT-5-Codex](/api/docs/models/gpt-5-codex.md): 面向 Codex 智能体编码优化的 GPT-5 版本
- [GPT-5.1](/api/docs/models/gpt-5.1.md): 面向编码和智能体任务的最强模型，支持可配置的推理力度
- [GPT-5.1 Chat](/api/docs/models/gpt-5.1-chat-latest.md): ChatGPT 中使用的 GPT-5.1 模型
- [GPT-5.1-Codex](/api/docs/models/gpt-5.1-codex.md): 面向 Codex 智能体编码优化的 GPT-5.1 版本。
- [GPT-5.1-Codex Mini](/api/docs/models/gpt-5.1-codex-mini.md): 更小、成本更低、能力较弱的 GPT-5.1-Codex 版本
- [GPT-5.1-Codex-Max](/api/docs/models/gpt-5.1-codex-max.md): 针对长时间运行任务优化的 GPT-5.1-codex 版本。
- [GPT-5.2](/api/docs/models/gpt-5.2.md): 面向专业工作的前代旗舰模型，支持可配置的推理力度
- [GPT-5.2 Chat](/api/docs/models/gpt-5.2-chat-latest.md): ChatGPT 中使用的 GPT-5.2 模型
- [GPT-5.2 Pro](/api/docs/models/gpt-5.2-pro.md): 面向专业工作的前代 Pro 模型，能够产出更智能、更精确的回复。
- [GPT-5.2-Codex](/api/docs/models/gpt-5.2-codex.md): 我们最智能的编程模型，专为长时程、智能体化编码任务进行了优化。
- [GPT-5.3 Chat](/api/docs/models/gpt-5.3-chat-latest.md): ChatGPT 中使用的 GPT-5.3 Instant 模型
- [GPT-5.3-Codex](/api/docs/models/gpt-5.3-codex.md): 迄今为止能力最强的智能体化编程模型。
- [GPT-5.4](/api/docs/models/gpt-5.4.md): 一款更具性价比的模型，适用于编程和专业工作。
- [GPT-5.4 Mini](/api/docs/models/gpt-5.4-mini.md): 我们迄今最强的 mini 模型，适用于编程、计算机使用和子智能体
- [GPT-5.4 nano](/api/docs/models/gpt-5.4-nano.md): 我们最便宜的 GPT-5.4 系列模型，适用于简单的高吞吐量任务
- [GPT-5.4 Pro](/api/docs/models/gpt-5.4-pro.md): GPT-5.4 的版本，能够产出更智能、更精确的回复。
- [GPT-5.5](/api/docs/models/gpt-5.5.md): 面向编码与专业工作的全新智能类别。
- [GPT-5.5 Pro](/api/docs/models/gpt-5.5-pro.md): GPT-5.5 的版本，可生成更智能、更精准的响应。
- [GPT-5.6 Cyber](/api/docs/models/gpt-5.6-cyber.md): 面向经授权的漏洞研究与安全测试的最先进的网络安全模型。
- [GPT-5.6 Luna](/api/docs/models/gpt-5.6-luna.md): 针对成本敏感型工作负载优化的 GPT-5.6 模型
- [GPT-5.6 Sol](/api/docs/models/gpt-5.6-sol.md): 面向复杂专业工作的旗舰模型
- [GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra.md): 在智能与成本之间取得平衡的 GPT-5.6 模型
- [GPT-Audio](/api/docs/models/gpt-audio.md): 适用于通过 Chat Completions API 进行音频输入与输出
- [GPT-Audio Mini](/api/docs/models/gpt-audio-mini.md): GPT Audio 的高性价比版本
- [GPT-Audio-1.5](/api/docs/models/gpt-audio-1.5.md): 通过 Chat Completions 提供音频输入与音频输出的最佳语音模型。
- [GPT-Image-1](/api/docs/models/gpt-image-1.md): 我们此前的图像生成模型
- [GPT-Image-1 Mini](/api/docs/models/gpt-image-1-mini.md): GPT Image 1 的高性价比版本
- [GPT-Image-1.5](/api/docs/models/gpt-image-1.5.md): 我们此前的图像生成模型
- [GPT-Image-2](/api/docs/models/gpt-image-2.md): 最先进的图像生成模型
- [GPT-Live-Transcribe](/api/docs/models/gpt-live-transcribe.md): 用于实时转录的低延迟语音转文本模型
- [gpt-oss-120b](/api/docs/models/gpt-oss-120b.md): 最强大的开放权重模型，可容纳于单个 H100 GPU
- [gpt-oss-20b](/api/docs/models/gpt-oss-20b.md): 用于低延迟场景的中等规模开放权重模型
- [GPT-Realtime](/api/docs/models/gpt-realtime.md): 支持实时文本和音频输入与输出的模型
- [GPT-Realtime Mini](/api/docs/models/gpt-realtime-mini.md): GPT-Realtime 的高性价比版本
- [GPT-Realtime-1.5](/api/docs/models/gpt-realtime-1.5.md): 最适合音频输入与音频输出的语音模型
- [GPT-Realtime-2](/api/docs/models/gpt-realtime-2.md): 支持工具调用的推理模型
- [GPT-Realtime-2.1](/api/docs/models/gpt-realtime-2.1.md): 支持工具调用的推理模型
- [GPT-Realtime-2.1 Mini](/api/docs/models/gpt-realtime-2.1-mini.md): 支持工具调用的推理模型
- [GPT-Realtime-Translate](/api/docs/models/gpt-realtime-translate.md): 流式语音转语音翻译模型
- [GPT-Realtime-Whisper](/api/docs/models/gpt-realtime-whisper.md): 用于实时转录的流式语音转文本模型
- [GPT-Transcribe](/api/docs/models/gpt-transcribe.md)：用于文件和 Realtime 输入转写的高精度语音转文本模型
- [o1](/api/docs/models/o1.md)：上一代完整 o 系列推理模型
- [o1 Preview](/api/docs/models/o1-preview.md)：我们第一款 o 系列推理模型的预览版
- [o1-mini](/api/docs/models/o1-mini.md)：o1 的小型替代模型
- [o1-pro](/api/docs/models/o1-pro.md)：使用更多算力以提供更优回复的 o1 版本
- [o3](/api/docs/models/o3.md)：用于复杂任务的推理模型，已由 GPT-5 接替
- [o3-deep-research](/api/docs/models/o3-deep-research.md)：我们最强大的深度研究模型
- [o3-mini](/api/docs/models/o3-mini.md)：o3 的小型替代模型
- [o3-pro](/api/docs/models/o3-pro.md)：使用更多算力以提供更优回复的 o3 版本
- [o4-mini](/api/docs/models/o4-mini.md)：快速且经济高效的推理模型，已由 GPT-5 Mini 接替
- [o4-mini-deep-research](/api/docs/models/o4-mini-deep-research.md)：更快、更经济的深度研究模型
- [omni-moderation](/api/docs/models/omni-moderation-latest.md)：识别文本和图像中潜在有害的内容
- [Sora 2](/api/docs/models/sora-2.md)：支持同步音频的旗舰视频生成
- [Sora 2 Pro](/api/docs/models/sora-2-pro.md)：最先进的同步音频视频生成
- [text-embedding-3-large](/api/docs/models/text-embedding-3-large.md)：能力最强的嵌入模型
- [text-embedding-3-small](/api/docs/models/text-embedding-3-small.md)：小型嵌入模型
- [text-embedding-ada-002](/api/docs/models/text-embedding-ada-002.md)：较旧的嵌入模型
- [text-moderation](/api/docs/models/text-moderation-latest.md)：上一代仅支持文本的审核模型
- [text-moderation-stable](/api/docs/models/text-moderation-stable.md)：上一代仅支持文本的审核模型
- [TTS-1](/api/docs/models/tts-1.md)：针对速度优化的文本转语音模型
- [TTS-1 HD](/api/docs/models/tts-1-hd.md)：专为高质量而优化的文本转语音模型
- [Whisper](/api/docs/models/whisper-1.md)：通用语音识别模型
