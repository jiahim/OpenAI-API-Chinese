# Audio and voice

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

For a new conversational voice application, start with **[GPT-Live](https://developers.openai.com/api/docs/guides/live)**. It can listen while speaking and keep the conversation moving while a backend agent reasons, uses tools, or completes a task.

Connect your first conversation with the [WebRTC quickstart](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live), then write a short [Live prompt](https://developers.openai.com/api/docs/guides/live-prompting). If you already have a Realtime application or text agent, follow [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).

## Choose another audio workflow

















Use the Realtime API when you need its session and tool model. For transcription, translation, or speech generation without a conversational agent, choose the dedicated API below.





| Build                                                              | Start here                                                                   | What you control                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| A speech-to-speech agent using the Realtime session and tool model | [Realtime API](https://developers.openai.com/api/docs/guides/realtime)                                    | Audio turns, session state, tools, and interruptions.             |
| A voice interface for an existing text agent                       | [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents#build-a-chained-voice-workflow) | Speech-to-text, the text-agent workflow, then text-to-speech.     |
| A transcript of an audio file                                      | [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text)                        | File uploads, bounded requests, and supported transcript formats. |
| Live captions without assistant speech                             | [Live transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)                | Streaming audio and incremental transcript events.                |
| Continuous speech translation                                      | [Live translation](https://developers.openai.com/api/docs/guides/realtime-translation)                    | A dedicated translation session, not a voice-agent turn loop.     |
| Narration or generated speech                                      | [Text to speech](https://developers.openai.com/api/docs/guides/text-to-speech)                            | Text, voice, and output format.                                   |
| Audio input or output in an existing chat app                      | [Audio in Chat Completions](https://developers.openai.com/api/docs/guides/audio-chat-completions)         | Bounded multimodal chat requests.                                 |

## Build with voice

Use [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents) to compare architectures. Start with the prompting guide for [GPT-Live](https://developers.openai.com/api/docs/guides/live-prompting) or [Realtime](https://developers.openai.com/api/docs/guides/voice-prompting). Then use the shared guides for [custom voices](https://developers.openai.com/api/docs/guides/custom-voices), [evaluation](https://developers.openai.com/api/docs/guides/voice-agents#evaluate-your-voice-agent), and [cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost). Each guide distinguishes model- or API-specific behavior.

## Choose a connection

For browser audio, start with [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc). For server audio pipelines, use [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets). For phone calls, see [Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip). A [server-side control connection](https://developers.openai.com/api/docs/guides/voice-server-controls) lets a trusted backend observe and control a media session.

Select your API on each connection page. Sharing a transport does not make GPT-Live and Realtime handshakes, credentials, or event formats interchangeable. Check the connection guide for prerequisites and setup instructions.

## Add audio to your existing application

The Chat Completions examples now live in [Audio in Chat Completions](https://developers.openai.com/api/docs/guides/audio-chat-completions). For a browser voice-agent starter, use the [GPT-Live WebRTC quickstart](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live).