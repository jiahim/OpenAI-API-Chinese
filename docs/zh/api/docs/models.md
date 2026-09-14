# 模型

> 完整的文档索引请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

> 浏览 OpenAI API 上可用的模型。

如果不知道从何入手，可以使用 [GPT-6 Astra](/api/docs/models/gpt-6-astra)，这是我们用于复杂推理与编码的旗舰模型。选择 [GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra) 可以在智能与成本之间取得平衡，或者选择 [GPT-5.6 Luna](/api/docs/models/gpt-5.6-luna) 来应对对成本敏感的高吞吐量工作负载。

所有最新的 OpenAI 模型都支持文本与图像输入、文本输出、多语言能力和视觉理解。可通过 [Responses API](/api/reference/resources/responses/methods/create) 以及我们的 [客户端 SDK](/api/docs/libraries).

## Featured models

- [GPT-6 Astra](/api/docs/models/gpt-6-astra.md): 我们能力最强的模型，专为最困难的端到端任务打造
- [GPT-5.6 Sol](/api/docs/models/gpt-5.6-sol.md): 面向复杂专业工作的旗舰模型
- [GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra.md): 在智能与成本之间取得平衡的 GPT-5.6 模型
- [GPT-5.6 Luna](/api/docs/models/gpt-5.6-luna.md): 针对成本敏感型工作负载优化的 GPT-5.6 模型

## 浏览我们的完整模型目录

面向各类任务的多样化模型

查看 [OpenAI 如何使用你的数据](/api/docs/guides/your-data.md) 并查看 [已弃用模型](/api/docs/deprecations.md).

- [babbage-002](/api/docs/models/babbage-002.md)：用于替代 GPT-3 ada 和 babbage 基础模型
- [Chat Latest](/api/docs/models/chat-latest.md)：ChatGPT 中使用的最新 Instant 模型
- [ChatGPT-4o](/api/docs/models/chatgpt-4o-latest.md)：ChatGPT 中使用的 GPT-4o 模型
- [chatgpt-image-latest](/api/docs/models/chatgpt-image-latest.md)：ChatGPT 中使用的上一代图像模型。
- [codex-mini-latest](/api/docs/models/codex-mini-latest.md)：针对 Codex CLI 优化的快速推理模型
- [computer-use-preview](/api/docs/models/computer-use-preview.md)：专用于计算机使用工具的模型
- [davinci-002](/api/docs/models/davinci-002.md)：用于替代 GPT-3 curie 和 davinci 基础模型
- [Daybreak Blue](/api/docs/models/gpt-daybreak-blue-latest.md)：一个用于防御性网络安全任务的旗舰通用模型别名，包含相关安全防护。
- [Daybreak Red](/api/docs/models/gpt-daybreak-red-latest.md)：用于授权漏洞研究和安全测试的高级网络安全模型别名。
- [GPT-3.5 Turbo](/api/docs/models/gpt-3.5-turbo.md)：用于更经济的聊天和非聊天任务的旧版 GPT 模型
- [GPT-4](/api/docs/models/gpt-4.md): 较旧的高智能 GPT 模型
- [GPT-4 Turbo](/api/docs/models/gpt-4-turbo.md): 较旧的高智能 GPT 模型
- [GPT-4 Turbo Preview](/api/docs/models/gpt-4-turbo-preview.md): 较旧的高速 GPT 模型
- [GPT-4.1](/api/docs/models/gpt-4.1.md): 最智能的非推理模型
- [GPT-4.1 Mini](/api/docs/models/gpt-4.1-mini.md): GPT-4.1 的更小、更快版本
- [GPT-4.1 nano](/api/docs/models/gpt-4.1-nano.md): GPT-4.1 中速度最快、成本最低的版本
- [GPT-4.5 Preview](/api/docs/models/gpt-4.5-preview.md): 已弃用的大型模型。
- [GPT-4o](/api/docs/models/gpt-4o.md): 快速、智能且灵活的 GPT 模型
- [GPT-4o Audio](/api/docs/models/gpt-4o-audio-preview.md): 支持音频输入和输出的 GPT-4o 模型
- [GPT-4o Mini](/api/docs/models/gpt-4o-mini.md): 快速、经济的小型模型，适用于专注型任务
- [GPT-4o Mini Audio](/api/docs/models/gpt-4o-mini-audio-preview.md): 支持音频输入和输出的较小模型
- [GPT-4o Mini Realtime](/api/docs/models/gpt-4o-mini-realtime-preview.md): 面向文本和音频输入输出的较小实时模型
- [GPT-4o Mini Search Preview](/api/docs/models/gpt-4o-mini-search-preview.md): 快速且经济实惠的小型模型，适用于网页搜索
- [GPT-4o Mini Transcribe](/api/docs/models/gpt-4o-mini-transcribe.md): 由 GPT-4o Mini 提供支持的语音转文本模型
- [GPT-4o Mini TTS](/api/docs/models/gpt-4o-mini-tts.md): 由 GPT-4o Mini 提供支持的文本转语音模型
- [GPT-4o Realtime](/api/docs/models/gpt-4o-realtime-preview.md): 支持实时文本和音频输入输出的模型
- [GPT-4o Search Preview](/api/docs/models/gpt-4o-search-preview.md): 用于 Chat Completions 中网页搜索的 GPT 模型
- [GPT-4o Transcribe](/api/docs/models/gpt-4o-transcribe.md): 由 GPT-4o 提供支持的语音转文本模型
- [GPT-4o Transcribe Diarize](/api/docs/models/gpt-4o-transcribe-diarize.md): 能够识别说话人的转录模型
- [GPT-5](/api/docs/models/gpt-5.md): 上一代智能推理模型，用于编码和智能体任务，支持可配置的推理力度
- [GPT-5 Chat](/api/docs/models/gpt-5-chat-latest.md): ChatGPT 中使用的 GPT-5 模型
- [GPT-5 Mini](/api/docs/models/gpt-5-mini.md): 为成本敏感、低延迟、高吞吐量工作负载提供强大的智能
- [GPT-5 nano](/api/docs/models/gpt-5-nano.md): 最快、成本效益最高的 GPT-5 版本
- [GPT-5 Pro](/api/docs/models/gpt-5-pro.md): 能产出更智能、更精确回答的 GPT-5 版本
- [GPT-5-Codex](/api/docs/models/gpt-5-codex.md): 为 Codex 中的智能体编程优化的 GPT-5 版本
- [GPT-5.1](/api/docs/models/gpt-5.1.md): 适用于编码和智能体任务的最佳模型，可配置推理力度
- [GPT-5.1 Chat](/api/docs/models/gpt-5.1-chat-latest.md): ChatGPT 中使用的 GPT-5.1 模型
- [GPT-5.1-Codex](/api/docs/models/gpt-5.1-codex.md): 为 Codex 中的智能体编程优化的 GPT-5.1 版本。
- [GPT-5.1-Codex Mini](/api/docs/models/gpt-5.1-codex-mini.md): 更小、更具成本效益、能力略低的 GPT-5.1-Codex 版本
- [GPT-5.1-Codex-Max](/api/docs/models/gpt-5.1-codex-max.md): 为长时间运行任务优化的 GPT-5.1-codex 版本。
- [GPT-5.2](/api/docs/models/gpt-5.2.md): 此前用于专业工作的旗舰模型，支持可配置的推理力度
- [GPT-5.2 Chat](/api/docs/models/gpt-5.2-chat-latest.md): 在 ChatGPT 中使用的 GPT-5.2 模型
- [GPT-5.2 Pro](/api/docs/models/gpt-5.2-pro.md): 此前用于专业工作的 Pro 模型，能够产生更智能、更精确的回复。
- [GPT-5.2-Codex](/api/docs/models/gpt-5.2-codex.md): 我们最智能的编码模型，针对长周期、智能体编码任务进行了优化。
- [GPT-5.3 Chat](/api/docs/models/gpt-5.3-chat-latest.md): 在 ChatGPT 中使用的 GPT-5.3 Instant 模型
- [GPT-5.3-Codex](/api/docs/models/gpt-5.3-codex.md): 迄今为止最强大的智能体编码模型。
- [GPT-5.4](/api/docs/models/gpt-5.4.md): 一款更具性价比的模型，适用于编码和专业工作。
- [GPT-5.4 Mini](/api/docs/models/gpt-5.4-mini.md): 迄今为止我们最强大的 mini 模型，适用于编码、计算机使用和子智能体
- [GPT-5.4 nano](/api/docs/models/gpt-5.4-nano.md): 我们最便宜的 GPT-5.4 系列模型，适用于简单的高吞吐量任务
- [GPT-5.4 Pro](/api/docs/models/gpt-5.4-pro.md): GPT-5.4 的版本，能够产生更智能、更精确的回复。
- [GPT-5.5](/api/docs/models/gpt-5.5.md)：面向编码与专业工作的全新智能水平。
- [GPT-5.5 Pro](/api/docs/models/gpt-5.5-pro.md)：GPT-5.5 的版本，能够生成更智能、更精确的回复。
- [GPT-5.6 Cyber](/api/docs/models/gpt-5.6-cyber.md)：我们最先进的网络安全模型，用于经过授权的漏洞研究与安全测试。
- [GPT-5.6 Luna](/api/docs/models/gpt-5.6-luna.md): 针对成本敏感型工作负载优化的 GPT-5.6 模型
- [GPT-5.6 Sol](/api/docs/models/gpt-5.6-sol.md): 面向复杂专业工作的旗舰模型
- [GPT-5.6 Terra](/api/docs/models/gpt-5.6-terra.md): 在智能与成本之间取得平衡的 GPT-5.6 模型
- [GPT-6 Astra](/api/docs/models/gpt-6-astra.md): 我们能力最强的模型，专为最困难的端到端任务打造
- [GPT-Audio](/api/docs/models/gpt-audio.md)：用于通过 Chat Completions API 进行音频输入与输出
- [GPT-Audio Mini](/api/docs/models/gpt-audio-mini.md)：GPT Audio 的高性价比版本
- [GPT-Audio-1.5](/api/docs/models/gpt-audio-1.5.md)：通过 Chat Completions 实现音频输入与音频输出的最佳语音模型。
- [GPT-Image-1](/api/docs/models/gpt-image-1.md)：我们上一代的图像生成模型
- [GPT-Image-1 Mini](/api/docs/models/gpt-image-1-mini.md)：GPT Image 1 的高性价比版本
- [GPT-Image-1.5](/api/docs/models/gpt-image-1.5.md)：我们上一代的图像生成模型
- [GPT-Image-2](/api/docs/models/gpt-image-2.md)：最先进的图像生成模型
- [GPT-Image-2.5 Flare](/api/docs/models/gpt-image-2.5-flare.md)：快速、高质量的日常图像生成
- [GPT-Image-2.5 Sunburst](/api/docs/models/gpt-image-2.5-sunburst.md): 我们最强大的图像生成与编辑模型
- [GPT-Live 1](/api/docs/models/gpt-live-1.md): 我们顶级的语音对话模型，可提供自然且富有表现力的对话体验，并具备流畅的打断处理能力。
- [GPT-Live-Transcribe](/api/docs/models/gpt-live-transcribe.md): 用于实时转录的低延迟语音转文本模型
- [gpt-oss-120b](/api/docs/models/gpt-oss-120b.md): 最强大的开放权重模型，可装入单个 H100 GPU
- [gpt-oss-20b](/api/docs/models/gpt-oss-20b.md): 中等规模的开放权重模型，延迟更低
- [GPT-Realtime](/api/docs/models/gpt-realtime.md): 支持实时文本和音频输入输出的模型
- [GPT-Realtime Mini](/api/docs/models/gpt-realtime-mini.md): GPT-Realtime 的高性价比版本
- [GPT-Realtime-1.5](/api/docs/models/gpt-realtime-1.5.md): 用于音频输入与音频输出的最佳语音模型
- [GPT-Realtime-2](/api/docs/models/gpt-realtime-2.md): 带工具调用的推理模型
- [GPT-Realtime-2.1](/api/docs/models/gpt-realtime-2.1.md): 带工具调用的推理模型
- [GPT-Realtime-2.1 Mini](/api/docs/models/gpt-realtime-2.1-mini.md): 带工具调用的推理模型
- [GPT-Realtime-Translate](/api/docs/models/gpt-realtime-translate.md): 流式语音到语音翻译模型
- [GPT-Realtime-Whisper](/api/docs/models/gpt-realtime-whisper.md): 用于实时转写的流式语音转文本模型
- [GPT-Transcribe](/api/docs/models/gpt-transcribe.md): 用于文件和 Realtime 输入转写的高精度语音转文本模型
- [o1](/api/docs/models/o1.md): 上一代完整 o 系列推理模型
- [o1 Preview](/api/docs/models/o1-preview.md): 我们的首个 o 系列推理模型预览版
- [o1-mini](/api/docs/models/o1-mini.md): o1 的小型替代模型
- [o1-pro](/api/docs/models/o1-pro.md): 使用更多算力的 o1 版本，可提供更优质的回复
- [o3](/api/docs/models/o3.md): 面向复杂任务的推理模型，已由 GPT-5 取代
- [o3-deep-research](/api/docs/models/o3-deep-research.md): 我们最强大的深度研究模型
- [o3-mini](/api/docs/models/o3-mini.md): o3 的小型替代模型
- [o3-pro](/api/docs/models/o3-pro.md): o3 的版本，提供更多算力以获得更优的响应
- [o4-mini](/api/docs/models/o4-mini.md): 快速且经济高效的推理模型，已由 GPT-5 Mini 接替
- [o4-mini-deep-research](/api/docs/models/o4-mini-deep-research.md): 更快、更经济实惠的深度研究模型
- [omni-moderation](/api/docs/models/omni-moderation-latest.md): 识别文本和图像中潜在的有害内容
- [Sora 2](/api/docs/models/sora-2.md): 旗舰级视频生成，支持同步音频
- [Sora 2 Pro](/api/docs/models/sora-2-pro.md): 最先进的同步音频视频生成
- [text-embedding-3-large](/api/docs/models/text-embedding-3-large.md): 能力最强的嵌入模型
- [text-embedding-3-small](/api/docs/models/text-embedding-3-small.md): 小型嵌入模型
- [text-embedding-ada-002](/api/docs/models/text-embedding-ada-002.md): 较旧的嵌入模型
- [text-moderation](/api/docs/models/text-moderation-latest.md): 上一代纯文本审核模型
- [text-moderation-stable](/api/docs/models/text-moderation-stable.md): 上一代纯文本审核模型
- [TTS-1](/api/docs/models/tts-1.md): 面向速度优化的文本转语音模型
- [TTS-1 HD](/api/docs/models/tts-1-hd.md): 面向质量优化的文本转语音模型
- [Whisper](/api/docs/models/whisper-1.md): 通用语音识别模型
- [GPT-Rosalind](/api/docs/pricing#specialized-models): 面向已批准机构的生命科学推理。模型 ID： `gpt-rosalind-research`.
