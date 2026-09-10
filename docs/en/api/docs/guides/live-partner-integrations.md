# GPT-Live partner integrations

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Choose an integration

Use the guide for your existing voice framework or telephony provider. Each partner maintains its setup instructions and supported package versions; the OpenAI guides cover the shared GPT-Live session and delegation behavior.

| Partner                                                                                       | Integration                                                                      |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [LiveKit](https://docs.livekit.io/agents/models/realtime/plugins/gpt-live)                    | Build GPT-Live voice agents with LiveKit’s OpenAI plugin.                        |
| [Twilio](https://www.twilio.com/en-us/blog/developers/twilio-openai-gpt-live-1-api-resources) | Connect incoming and outgoing phone calls to GPT-Live with Twilio Agent Connect. |
| [Telnyx](https://telnyx.com/resources/outbound-ai-calls-python-openai-live)                   | Build outbound calling experiences with GPT-Live and the Telnyx Voice API.       |
| [Daily/Pipecat](https://docs.pipecat.ai/api-reference/server/services/s2s/openai-live)        | Add GPT-Live to your application with Pipecat’s OpenAI Live service.             |

## Integration checklist

Follow the partner guide for installation, credentials, and a package version that supports `gpt-live-1`. Check how it handles audio formats, interruptions, session events, backend delegation, and call termination. A Realtime integration is not automatically compatible with GPT-Live.

For direct browser connections, follow [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live). For server audio, follow [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live). For phone calls, read [Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live).