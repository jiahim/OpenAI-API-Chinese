# Transcription streaming events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## transcript.text.segment

Emitted when a diarized transcription returns a completed segment with speaker information. Only emitted when you [create a transcription](https://developers.openai.com/docs/api-reference/audio/create-transcription) with `stream` set to `true` and `response_format` set to `diarized_json`.

### Schema

Schema name: `TranscriptTextSegmentEvent`

```json
{
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent",
    "docstring": "Emitted when a diarized transcription returns a completed segment with speaker information. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with `stream` set to `true` and `response_format` set to `diarized_json`.\n",
    "ident": "TranscriptionTextSegmentEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "end"
        },
        {
          "ident": "speaker"
        },
        {
          "ident": "start"
        },
        {
          "ident": "text"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) id",
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) end",
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) speaker",
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) start",
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) text",
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) type"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "Unique identifier for the segment.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) end": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/end",
    "deprecated": false,
    "key": "end",
    "docstring": "End timestamp of the segment in seconds.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "double"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) speaker": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/speaker",
    "deprecated": false,
    "key": "speaker",
    "docstring": "Speaker label for this segment.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) start": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/start",
    "deprecated": false,
    "key": "start",
    "docstring": "Start timestamp of the segment in seconds.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "double"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) text": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/text",
    "deprecated": false,
    "key": "text",
    "docstring": "Transcript text for this segment.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `transcript.text.segment`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/TranscriptTextSegmentEvent/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transcript.text.segment"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_segment_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transcript.text.segment"
    }
  }
}
```

### Example

```json
{
  "type": "transcript.text.segment",
  "id": "seg_002",
  "start": 5.2,
  "end": 12.8,
  "text": "Hi, I need help with diarization.",
  "speaker": "A"
}
```

## transcript.text.delta

Emitted when there is an additional text delta. This is also the first event emitted when the transcription starts. Only emitted when you [create a transcription](https://developers.openai.com/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.

### Schema

Schema name: `TranscriptTextDeltaEvent`

```json
{
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent",
    "docstring": "Emitted when there is an additional text delta. This is also the first event emitted when the transcription starts. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.",
    "ident": "TranscriptionTextDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "type"
        },
        {
          "ident": "logprobs"
        },
        {
          "ident": "segment_id"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) delta",
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) type",
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs",
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) segment_id"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/delta",
    "deprecated": false,
    "key": "delta",
    "docstring": "The text delta that was additionally transcribed.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `transcript.text.delta`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transcript.text.delta"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/logprobs",
    "deprecated": false,
    "key": "logprobs",
    "docstring": "The log probabilities of the delta. Only included if you [create a transcription](/docs/api-reference/audio/create-transcription) with the `include[]` parameter set to `logprobs`.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/logprobs",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "token"
          },
          {
            "ident": "bytes"
          },
          {
            "ident": "logprob"
          }
        ]
      }
    },
    "optional": true,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs > (items) > (property) token",
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs > (items) > (property) bytes",
      "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs > (items) > (property) logprob"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) segment_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/segment_id",
    "deprecated": false,
    "key": "segment_id",
    "docstring": "Identifier of the diarized segment that this delta belongs to. Only present when using `gpt-4o-transcribe-diarize`.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transcript.text.delta"
    }
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs > (items) > (property) token": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/logprobs/items/properties/token",
    "deprecated": false,
    "key": "token",
    "docstring": "The token that was used to generate the log probability.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs > (items) > (property) bytes": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/logprobs/items/properties/bytes",
    "deprecated": false,
    "key": "bytes",
    "docstring": "The bytes that were used to generate the log probability.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/logprobs/items/properties/bytes",
      "elementType": {
        "kind": "HttpTypeNumber"
      }
    },
    "optional": true,
    "nullable": false,
    "schemaType": "array",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_delta_event > (schema) > (property) logprobs > (items) > (property) logprob": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDeltaEvent/properties/logprobs/items/properties/logprob",
    "deprecated": false,
    "key": "logprob",
    "docstring": "The log probability of the token.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "number",
    "children": []
  }
}
```

### Example

```json
{
  "type": "transcript.text.delta",
  "delta": " wonderful"
}
```

## transcript.text.done

Emitted when the transcription is complete. Contains the complete transcription text. Only emitted when you [create a transcription](https://developers.openai.com/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.

### Schema

Schema name: `TranscriptTextDoneEvent`

```json
{
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent",
    "docstring": "Emitted when the transcription is complete. Contains the complete transcription text. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.",
    "ident": "TranscriptionTextDoneEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "text"
        },
        {
          "ident": "type"
        },
        {
          "ident": "languages"
        },
        {
          "ident": "logprobs"
        },
        {
          "ident": "usage"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) text",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) type",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) languages",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) text": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/text",
    "deprecated": false,
    "key": "text",
    "docstring": "The text that was transcribed.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `transcript.text.done`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transcript.text.done"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) languages": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/languages",
    "deprecated": false,
    "key": "languages",
    "docstring": "The languages detected in the audio. Returned by `gpt-transcribe`. An empty array indicates that no language could be reliably detected.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/languages",
      "elementType": {
        "kind": "HttpTypeReference",
        "ident": "TranscriptionLanguage",
        "$ref": "(resource) audio.transcriptions > (model) transcription_language > (schema)"
      }
    },
    "optional": true,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_language > (schema) > (property) code"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/logprobs",
    "deprecated": false,
    "key": "logprobs",
    "docstring": "The log probabilities of the individual tokens in the transcription. Only included if you [create a transcription](/docs/api-reference/audio/create-transcription) with the `include[]` parameter set to `logprobs`.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/logprobs",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "token"
          },
          {
            "ident": "bytes"
          },
          {
            "ident": "logprob"
          }
        ]
      }
    },
    "optional": true,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs > (items) > (property) token",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs > (items) > (property) bytes",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs > (items) > (property) logprob"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/usage",
    "deprecated": false,
    "key": "usage",
    "docstring": "Usage statistics for models billed by token usage.",
    "title": "Token Usage",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "input_tokens"
        },
        {
          "ident": "output_tokens"
        },
        {
          "ident": "total_tokens"
        },
        {
          "ident": "type"
        },
        {
          "ident": "input_token_details"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_tokens",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) output_tokens",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) total_tokens",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) type",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_token_details"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transcript.text.done"
    }
  },
  "(resource) audio.transcriptions > (model) transcription_language > (schema) > (property) code": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptionLanguage/properties/code",
    "deprecated": false,
    "key": "code",
    "docstring": "The code of a language detected in the audio.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_language > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/TranscriptionLanguage",
    "docstring": "A language detected in transcribed audio.",
    "ident": "TranscriptionLanguage",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "code"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_language > (schema) > (property) code"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs > (items) > (property) token": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/logprobs/items/properties/token",
    "deprecated": false,
    "key": "token",
    "docstring": "The token that was used to generate the log probability.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs > (items) > (property) bytes": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/logprobs/items/properties/bytes",
    "deprecated": false,
    "key": "bytes",
    "docstring": "The bytes that were used to generate the log probability.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/logprobs/items/properties/bytes",
      "elementType": {
        "kind": "HttpTypeNumber"
      }
    },
    "optional": true,
    "nullable": false,
    "schemaType": "array",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) logprobs > (items) > (property) logprob": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextDoneEvent/properties/logprobs/items/properties/logprob",
    "deprecated": false,
    "key": "logprob",
    "docstring": "The log probability of the token.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/input_tokens",
    "deprecated": false,
    "key": "input_tokens",
    "docstring": "Number of input tokens billed for this request.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) output_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/output_tokens",
    "deprecated": false,
    "key": "output_tokens",
    "docstring": "Number of output tokens generated.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) total_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/total_tokens",
    "deprecated": false,
    "key": "total_tokens",
    "docstring": "Total number of tokens used (input + output).",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the usage object. Always `tokens` for this variant.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "tokens"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) type > (member) 0"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_token_details": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/input_token_details",
    "deprecated": false,
    "key": "input_token_details",
    "docstring": "Details about the input tokens billed for this request.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio_tokens"
        },
        {
          "ident": "text_tokens"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_token_details > (property) audio_tokens",
      "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_token_details > (property) text_tokens"
    ]
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "tokens"
    }
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_token_details > (property) audio_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/input_token_details/properties/audio_tokens",
    "deprecated": false,
    "key": "audio_tokens",
    "docstring": "Number of audio tokens billed for this request.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) audio.transcriptions > (model) transcription_text_done_event > (schema) > (property) usage > (property) input_token_details > (property) text_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/TranscriptTextUsageTokens/properties/input_token_details/properties/text_tokens",
    "deprecated": false,
    "key": "text_tokens",
    "docstring": "Number of text tokens billed for this request.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  }
}
```

### Example

```json
{
  "type": "transcript.text.done",
  "text": "I see skies of blue and clouds of white, the bright blessed days, the dark sacred nights, and I think to myself, what a wonderful world.",
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 10,
      "audio_tokens": 4
    },
    "output_tokens": 31,
    "total_tokens": 45
  }
}
```
