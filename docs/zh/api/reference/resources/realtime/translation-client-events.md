# Realtime 翻译客户端事件

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

这些是 OpenAI Realtime Translation WebSocket 服务器将从客户端接受的事件。

## session.update

发送此事件以更新翻译会话配置。Translation
会话支持对 `audio.output.language`, `audio.input.transcription`,
和 `audio.input.noise_reduction`.

### Schema

Schema 名称： `RealtimeTranslationClientEventSessionUpdate`

```json
{
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate",
    "docstring": "Send this event to update the translation session configuration. Translation\nsessions support updates to `audio.output.language`, `audio.input.transcription`,\nand `audio.input.noise_reduction`.\n",
    "ident": "RealtimeTranslationSessionUpdateEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "session"
        },
        {
          "ident": "type"
        },
        {
          "ident": "event_id"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) session",
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) event_id"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) session": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/session",
    "deprecated": false,
    "key": "session",
    "docstring": "Translation session fields to update. The session `type` and `model` are set\nat creation and cannot be changed with `session.update`.\n",
    "title": "Realtime translation session update",
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeTranslationSessionUpdateRequest",
      "$ref": "(resource) realtime > (model) realtime_translation_session_update_request > (schema)"
    },
    "optional": false,
    "nullable": false,
    "modelImplicit": false,
    "schemaType": "object",
    "modelPath": "(resource) realtime > (model) realtime_translation_session_update_request",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.update`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.update"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "Optional client-generated ID used to identify this event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 512
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio",
    "deprecated": false,
    "key": "audio",
    "docstring": "Configuration for translation input and output audio.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "input"
        },
        {
          "ident": "output"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input",
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest",
    "docstring": "Realtime translation session fields that can be updated with `session.update`.\n",
    "ident": "RealtimeTranslationSessionUpdateRequest",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.update"
    }
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input",
    "deprecated": false,
    "key": "input",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "noise_reduction"
        },
        {
          "ident": "transcription"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction",
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/output",
    "deprecated": false,
    "key": "output",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "language"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output > (property) language"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/noise_reduction",
    "deprecated": false,
    "key": "noise_reduction",
    "docstring": "Optional input noise reduction. Set to `null` to disable it.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "type"
        }
      ]
    },
    "optional": true,
    "nullable": true,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/transcription",
    "deprecated": false,
    "key": "transcription",
    "docstring": "Optional source-language transcription. When configured, the server emits\n`session.input_transcript.delta` events. Translation itself still runs from\nthe input audio stream.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        }
      ]
    },
    "optional": true,
    "nullable": true,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription > (property) model"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output > (property) language": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/output/properties/language",
    "deprecated": false,
    "key": "language",
    "docstring": "Target language for translated output audio and transcript deltas.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/noise_reduction/anyOf/0/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.\n",
    "type": {
      "kind": "HttpTypeReference",
      "ident": "NoiseReductionType",
      "$ref": "(resource) realtime > (model) noise_reduction_type > (schema)"
    },
    "optional": false,
    "nullable": false,
    "modelImplicit": false,
    "schemaType": "enum",
    "modelPath": "(resource) realtime > (model) noise_reduction_type",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0",
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/transcription/anyOf/0/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The transcription model to use for source transcript deltas.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "near_field"
    }
  },
  "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "far_field"
    }
  },
  "(resource) realtime > (model) noise_reduction_type > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/NoiseReductionType",
    "docstring": "Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.\n",
    "ident": "NoiseReductionType",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/NoiseReductionType",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "near_field"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "far_field"
        }
      ]
    },
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0",
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1"
    ]
  }
}
```

### 示例

```json
{
  "type": "session.update",
  "session": {
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper"
        },
        "noise_reduction": null
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

## session.input_audio_buffer.append

发送此事件以将音频字节追加到翻译会话的输入音频缓冲区。

WebSocket 翻译会话接受 base64 编码的 24 kHz PCM16 单声道
小端原始音频字节。不支持的 WebSocket 音频格式会返回
验证错误，因为较低质量的音频会显著降低翻译
质量。

翻译消耗 200 ms 引擎帧。为了获得最佳的实时行为，请以
200 ms 的块追加音频。如果块较短，服务器会将其缓冲，直到
有足够的音频组成一帧。如果块较长，服务器会将其拆分为
200 ms 的帧并连续排队。

在会话活动期间持续追加静音。如果客户端停止发送
音频后恢复发送，模型时间会将恢复的音频视为与
先前音频连续，而不是真实的暂停。

### Schema

Schema 名称： `RealtimeTranslationClientEventInputAudioBufferAppend`

```json
{
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend",
    "docstring": "Send this event to append audio bytes to the translation session input audio buffer.\n\nWebSocket translation sessions accept base64-encoded 24 kHz PCM16 mono\nlittle-endian raw audio bytes. Unsupported websocket audio formats return a\nvalidation error because lower-quality audio materially degrades translation\nquality.\n\nTranslation consumes 200 ms engine frames. For best realtime behavior, append\naudio in 200 ms chunks. If a chunk is shorter, the server buffers it until it\nhas enough audio for one frame. If a chunk is longer, the server splits it into\n200 ms frames and enqueues them back-to-back.\n\nKeep appending silence while the session is active. If a client stops sending\naudio and later resumes, model time treats the resumed audio as contiguous with\nthe previous audio rather than as a real-world pause.\n",
    "ident": "RealtimeTranslationInputAudioBufferAppendEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio"
        },
        {
          "ident": "type"
        },
        {
          "ident": "event_id"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) event_id"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/audio",
    "deprecated": false,
    "key": "audio",
    "docstring": "Base64-encoded 24 kHz PCM16 mono audio bytes.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.input_audio_buffer.append`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.input_audio_buffer.append"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "Optional client-generated ID used to identify this event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 512
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.input_audio_buffer.append"
    }
  }
}
```

### 示例

```json
{
  "event_id": "event_456",
  "type": "session.input_audio_buffer.append",
  "audio": "Base64EncodedAudioData"
}
```

## session.close

优雅关闭实时翻译会话。服务端会在关闭前刷新待处理的
输入音频并发出所有剩余的翻译输出，然后关闭
会话。

### Schema

Schema 名称： `RealtimeTranslationClientEventSessionClose`

```json
{
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose",
    "docstring": "Gracefully close the realtime translation session. The server flushes pending\ninput audio and emits any remaining translated output before closing the\nsession.\n",
    "ident": "RealtimeTranslationSessionCloseEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "type"
        },
        {
          "ident": "event_id"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) event_id"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.close`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.close"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "Optional client-generated ID used to identify this event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 512
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.close"
    }
  }
}
```

### 示例

```json
{
  "event_id": "event_789",
  "type": "session.close"
}
```
