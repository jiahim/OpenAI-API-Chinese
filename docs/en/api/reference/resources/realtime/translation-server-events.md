# Realtime translation server events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

These are events emitted from the OpenAI Realtime Translation WebSocket server to the client.

## error

Returned when an error occurs, which could be a client problem or a server
problem. Most errors are recoverable and the session will stay open, we
recommend to implementors to monitor and log error messages by default.

### Schema

Schema name: `RealtimeServerEventError`

```json
{
  "(resource) realtime > (model) realtime_error_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeServerEventError",
    "docstring": "Returned when an error occurs, which could be a client problem or a server\nproblem. Most errors are recoverable and the session will stay open, we\nrecommend to implementors to monitor and log error messages by default.\n",
    "ident": "RealtimeErrorEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "error"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) error",
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) error": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error",
    "deprecated": false,
    "key": "error",
    "docstring": "Details of the error.",
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeError",
      "$ref": "(resource) realtime > (model) realtime_error > (schema)"
    },
    "optional": false,
    "nullable": false,
    "modelImplicit": false,
    "schemaType": "object",
    "modelPath": "(resource) realtime > (model) realtime_error",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_error > (schema) > (property) message",
      "(resource) realtime > (model) realtime_error > (schema) > (property) type",
      "(resource) realtime > (model) realtime_error > (schema) > (property) code",
      "(resource) realtime > (model) realtime_error > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_error > (schema) > (property) param"
    ]
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `error`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeServerEventError/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "error"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) message": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/message",
    "deprecated": false,
    "key": "message",
    "docstring": "A human-readable error message.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of error (e.g., \"invalid_request_error\", \"server_error\").\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) code": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/code",
    "deprecated": false,
    "key": "code",
    "docstring": "Error code, if any.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The event_id of the client event that caused the error, if applicable.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) param": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/param",
    "deprecated": false,
    "key": "param",
    "docstring": "Parameter related to the error, if any.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error",
    "docstring": "Details of the error.",
    "ident": "RealtimeError",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "message"
        },
        {
          "ident": "type"
        },
        {
          "ident": "code"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "param"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_error > (schema) > (property) message",
      "(resource) realtime > (model) realtime_error > (schema) > (property) type",
      "(resource) realtime > (model) realtime_error > (schema) > (property) code",
      "(resource) realtime > (model) realtime_error > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_error > (schema) > (property) param"
    ]
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "error"
    }
  }
}
```

### Example

```json
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

## session.created

Returned when a translation session is created. Emitted automatically when a
new connection is established as the first server event. This event contains
the default translation session configuration.

### Schema

Schema name: `RealtimeTranslationServerEventSessionCreated`

```json
{
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated",
    "docstring": "Returned when a translation session is created. Emitted automatically when a\nnew connection is established as the first server event. This event contains\nthe default translation session configuration.\n",
    "ident": "RealtimeTranslationSessionCreatedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "event_id"
        },
        {
          "ident": "session"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) session",
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) session": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/session",
    "deprecated": false,
    "key": "session",
    "docstring": "The translation session configuration.",
    "title": "Realtime translation session",
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeTranslationSession",
      "$ref": "(resource) realtime > (model) realtime_translation_session > (schema)"
    },
    "optional": false,
    "nullable": false,
    "modelImplicit": false,
    "schemaType": "object",
    "modelPath": "(resource) realtime > (model) realtime_translation_session",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.created`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.created"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "Unique identifier for the session that looks like `sess_1234567890abcdef`.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio",
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
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/expires_at",
    "deprecated": false,
    "key": "expires_at",
    "docstring": "Expiration timestamp for the session, in seconds since epoch.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The Realtime translation model used for this session. This field is set at\nsession creation and cannot be changed with `session.update`.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The session type. Always `translation` for Realtime translation sessions.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "translation"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationSession",
    "docstring": "A Realtime translation session. Translation sessions continuously translate input\naudio into the configured output language.\n",
    "ident": "RealtimeTranslationSession",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "audio"
        },
        {
          "ident": "expires_at"
        },
        {
          "ident": "model"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.created"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "translation"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction",
    "deprecated": false,
    "key": "noise_reduction",
    "docstring": "Optional input noise reduction.\n",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output/properties/language",
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
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction/anyOf/0/properties/type",
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
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription/anyOf/0/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The transcription model used for source transcript deltas.",
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

### Example

```json
{
  "type": "session.created",
  "event_id": "event_123",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "fr"
      }
    }
  }
}
```

## session.updated

Returned when a translation session is updated with a `session.update` event,
unless there is an error.

### Schema

Schema name: `RealtimeTranslationServerEventSessionUpdated`

```json
{
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated",
    "docstring": "Returned when a translation session is updated with a `session.update` event,\nunless there is an error.\n",
    "ident": "RealtimeTranslationSessionUpdatedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "event_id"
        },
        {
          "ident": "session"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) session",
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) session": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/session",
    "deprecated": false,
    "key": "session",
    "docstring": "The translation session configuration.",
    "title": "Realtime translation session",
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeTranslationSession",
      "$ref": "(resource) realtime > (model) realtime_translation_session > (schema)"
    },
    "optional": false,
    "nullable": false,
    "modelImplicit": false,
    "schemaType": "object",
    "modelPath": "(resource) realtime > (model) realtime_translation_session",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.updated`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.updated"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "Unique identifier for the session that looks like `sess_1234567890abcdef`.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio",
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
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/expires_at",
    "deprecated": false,
    "key": "expires_at",
    "docstring": "Expiration timestamp for the session, in seconds since epoch.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The Realtime translation model used for this session. This field is set at\nsession creation and cannot be changed with `session.update`.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The session type. Always `translation` for Realtime translation sessions.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "translation"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationSession",
    "docstring": "A Realtime translation session. Translation sessions continuously translate input\naudio into the configured output language.\n",
    "ident": "RealtimeTranslationSession",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "audio"
        },
        {
          "ident": "expires_at"
        },
        {
          "ident": "model"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.updated"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "translation"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction",
    "deprecated": false,
    "key": "noise_reduction",
    "docstring": "Optional input noise reduction.\n",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription",
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
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output/properties/language",
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
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction/anyOf/0/properties/type",
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
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription/anyOf/0/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The transcription model used for source transcript deltas.",
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

### Example

```json
{
  "type": "session.updated",
  "event_id": "event_124",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

## session.closed

Returned when a realtime translation session is closed.

### Schema

Schema name: `RealtimeTranslationServerEventSessionClosed`

```json
{
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed",
    "docstring": "Returned when a realtime translation session is closed.\n",
    "ident": "RealtimeTranslationSessionClosedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.closed`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.closed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.closed"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_987",
  "type": "session.closed"
}
```

## session.input_transcript.delta

Returned when optional source-language transcript text is available. This event
is emitted only when `audio.input.transcription` is configured.

Transcript deltas are append-only text fragments. Clients should not insert
unconditional spaces between deltas.

### Schema

Schema name: `RealtimeTranslationServerEventSessionInputTranscriptDelta`

```json
{
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta",
    "docstring": "Returned when optional source-language transcript text is available. This event\nis emitted only when `audio.input.transcription` is configured.\n\nTranscript deltas are append-only text fragments. Clients should not insert\nunconditional spaces between deltas.\n",
    "ident": "RealtimeTranslationInputTranscriptDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        },
        {
          "ident": "elapsed_ms"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) delta",
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) elapsed_ms"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/delta",
    "deprecated": false,
    "key": "delta",
    "docstring": "Append-only source-language transcript text.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.input_transcript.delta`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.input_transcript.delta"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) elapsed_ms": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/elapsed_ms",
    "deprecated": false,
    "key": "elapsed_ms",
    "docstring": "Timing metadata for stream alignment, derived from the translation frame\nwhen available. It advances in 200 ms increments, but multiple transcript\ndeltas may share the same `elapsed_ms`. Treat it as alignment metadata,\nnot a unique transcript-delta identifier.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.input_transcript.delta"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_125",
  "type": "session.input_transcript.delta",
  "delta": " hear",
  "elapsed_ms": 1200
}
```

## session.output_transcript.delta

Returned when translated transcript text is available.

Transcript deltas are append-only text fragments. Clients should not insert
unconditional spaces between deltas.

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputTranscriptDelta`

```json
{
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta",
    "docstring": "Returned when translated transcript text is available.\n\nTranscript deltas are append-only text fragments. Clients should not insert\nunconditional spaces between deltas.\n",
    "ident": "RealtimeTranslationOutputTranscriptDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        },
        {
          "ident": "elapsed_ms"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) delta",
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) elapsed_ms"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/delta",
    "deprecated": false,
    "key": "delta",
    "docstring": "Append-only transcript text for the translated output audio.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.output_transcript.delta`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.output_transcript.delta"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) elapsed_ms": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/elapsed_ms",
    "deprecated": false,
    "key": "elapsed_ms",
    "docstring": "Timing metadata for stream alignment, derived from the translation frame\nwhen available. It advances in 200 ms increments, but multiple transcript\ndeltas may share the same `elapsed_ms`. Treat it as alignment metadata,\nnot a unique transcript-delta identifier.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.output_transcript.delta"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_124",
  "type": "session.output_transcript.delta",
  "delta": " escuch",
  "elapsed_ms": 1200
}
```

## session.output_audio.delta

Returned when translated output audio is available. The `delta` contains a
PCM16 audio chunk whose length can vary. Clients should decode and queue the
complete delta instead of assuming a fixed byte or sample count.

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputAudioDelta`

```json
{
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta",
    "docstring": "Returned when translated output audio is available. The `delta` contains a\nPCM16 audio chunk whose length can vary. Clients should decode and queue the\ncomplete delta instead of assuming a fixed byte or sample count.\n",
    "ident": "RealtimeTranslationOutputAudioDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        },
        {
          "ident": "channels"
        },
        {
          "ident": "elapsed_ms"
        },
        {
          "ident": "format"
        },
        {
          "ident": "sample_rate"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) delta",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) channels",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) elapsed_ms",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) sample_rate"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/delta",
    "deprecated": false,
    "key": "delta",
    "docstring": "Base64-encoded translated audio data.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/event_id",
    "deprecated": false,
    "key": "event_id",
    "docstring": "The unique ID of the server event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The event type, must be `session.output_audio.delta`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.output_audio.delta"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) channels": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/channels",
    "deprecated": false,
    "key": "channels",
    "docstring": "Number of audio channels.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 1,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) elapsed_ms": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/elapsed_ms",
    "deprecated": false,
    "key": "elapsed_ms",
    "docstring": "Timing metadata for stream alignment, derived from the translation frame\nwhen available. Treat `elapsed_ms` as alignment metadata, not a unique\nevent identifier.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/format",
    "deprecated": false,
    "key": "format",
    "docstring": "Audio encoding for `delta`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/format",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "pcm16"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) sample_rate": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/sample_rate",
    "deprecated": false,
    "key": "sample_rate",
    "docstring": "Sample rate of the audio delta.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 24000,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.output_audio.delta"
    }
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "pcm16"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_123",
  "type": "session.output_audio.delta",
  "delta": "Base64EncodedAudioDelta",
  "sample_rate": 24000,
  "channels": 1,
  "format": "pcm16",
  "elapsed_ms": 1200
}
```
