# Chat Completions streaming events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Stream Chat Completions in real time. Receive chunks of completions
returned from the model using server-sent events.
[Learn more](https://developers.openai.com/docs/guides/streaming-responses?api-mode=chat).

## chat.completion.chunk

Represents a streamed chunk of a chat completion response returned
by the model, based on the provided input.
[Learn more](https://developers.openai.com/docs/guides/streaming-responses).

### Schema

Schema name: `CreateChatCompletionStreamResponse`

```json
{
  "(resource) chat.completions > (model) chat_completion_chunk > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse",
    "docstring": "Represents a streamed chunk of a chat completion response returned\nby the model, based on the provided input. \n[Learn more](/docs/guides/streaming-responses).\n",
    "ident": "ChatCompletionChunk",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "choices"
        },
        {
          "ident": "created"
        },
        {
          "ident": "model"
        },
        {
          "ident": "object"
        },
        {
          "ident": "moderation"
        },
        {
          "ident": "obfuscation"
        },
        {
          "ident": "service_tier"
        },
        {
          "ident": "system_fingerprint"
        },
        {
          "ident": "usage"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) id",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) created",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) obfuscation",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) system_fingerprint",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) usage"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "A unique identifier for the chat completion. Each chunk has the same ID.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices",
    "deprecated": false,
    "key": "choices",
    "docstring": "A list of chat completion choices. Can contain more than one elements if `n` is greater than 1. Can also be empty for the\nlast chunk if you set `stream_options: {\"include_usage\": true}`.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "delta"
          },
          {
            "ident": "finish_reason"
          },
          {
            "ident": "index"
          },
          {
            "ident": "logprobs"
          }
        ]
      }
    },
    "optional": false,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) index",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) created": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/created",
    "deprecated": false,
    "key": "created",
    "docstring": "The Unix timestamp (in seconds) of when the chat completion was created. Each chunk has the same timestamp.",
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
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The model to generate the completion.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object type, which is always `chat.completion.chunk`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "chat.completion.chunk"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/moderation",
    "deprecated": false,
    "key": "moderation",
    "docstring": "Moderation results for the request input and generated output. Present\non the moderation chunk when moderated completions are requested.\n",
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
    "nullable": true,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) obfuscation": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/obfuscation",
    "deprecated": false,
    "key": "obfuscation",
    "docstring": "An obfuscation string added to normalize the size of streamed chunks as a\nmitigation to certain side-channel attacks. The field is included by\ndefault and omitted when `stream_options.include_obfuscation` is `false`.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/service_tier",
    "deprecated": false,
    "key": "service_tier",
    "docstring": "Specifies the processing type used for serving the request.\n  - If set to 'auto', then the request will be processed with the service tier configured in the Project settings. Unless otherwise configured, the Project will use 'default'.\n  - If set to 'default', then the request will be processed with the standard pricing and performance for the selected model.\n  - If set to '[flex](/docs/guides/flex-processing)', then the request will be processed with the Flex Processing service tier.\n  - To opt-in to [Fast mode](/api/docs/guides/fast-mode) at the request level, include the `service_tier=fast` or `service_tier=priority` parameter for Responses or Chat Completions. The response will show `service_tier=priority` regardless of if you specify `service_tier=fast` or `priority` in your request.\n  - When not set, the default behavior is 'auto'.\n\n  When the `service_tier` parameter is set, the response body will include the `service_tier` value based on the processing mode actually used to serve the request. This response value may be different from the value set in the parameter.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/service_tier",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "default"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "flex"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "scale"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "priority"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "fast"
        }
      ]
    },
    "default": "auto",
    "optional": true,
    "nullable": true,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 1",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 2",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 3",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 4",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 5"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) system_fingerprint": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/system_fingerprint",
    "deprecated": true,
    "key": "system_fingerprint",
    "docstring": "This fingerprint represents the backend configuration that the model runs with.\nCan be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) usage": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/usage",
    "deprecated": false,
    "key": "usage",
    "docstring": "An optional field that will only be present when you set\n`stream_options: {\"include_usage\": true}` in your request. When present, it\ncontains a null value **except for the last chunk** which contains the\ntoken usage statistics for the entire request.\n\n**NOTE:** If the stream is interrupted or cancelled, you may not\nreceive the final usage chunk which contains the total token usage for\nthe request.\n",
    "type": {
      "kind": "HttpTypeReference",
      "ident": "CompletionUsage",
      "$ref": "(resource) completions > (model) completion_usage > (schema)"
    },
    "optional": true,
    "nullable": true,
    "modelImplicit": false,
    "schemaType": "object",
    "modelPath": "(resource) completions > (model) completion_usage",
    "childrenParentSchema": "object",
    "children": [
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) total_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/delta",
    "deprecated": false,
    "key": "delta",
    "docstring": "A chat completion delta generated by streamed model responses.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "content"
        },
        {
          "ident": "function_call"
        },
        {
          "ident": "refusal"
        },
        {
          "ident": "role"
        },
        {
          "ident": "tool_calls"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) content",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) refusal",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/finish_reason",
    "deprecated": false,
    "key": "finish_reason",
    "docstring": "The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,\n`length` if the maximum number of tokens specified in the request was reached,\n`content_filter` if content was omitted due to a flag from our content filters,\n`tool_calls` if the model called a tool, or `function_call` (deprecated) if the model called a function.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/finish_reason",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "stop"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "length"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "tool_calls"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "content_filter"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "function_call"
        }
      ]
    },
    "optional": false,
    "nullable": true,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 1",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 2",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 3",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 4"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) index": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/index",
    "deprecated": false,
    "key": "index",
    "docstring": "The index of the choice in the list of choices.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs",
    "deprecated": false,
    "key": "logprobs",
    "docstring": "Log probability information for the choice.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "content"
        },
        {
          "ident": "refusal"
        }
      ]
    },
    "optional": true,
    "nullable": true,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) content",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) refusal"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "chat.completion.chunk"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input",
    "deprecated": false,
    "key": "input",
    "docstring": "Moderation for the request input.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input",
      "types": [
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "model"
            },
            {
              "ident": "results"
            },
            {
              "ident": "type"
            }
          ]
        },
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "code"
            },
            {
              "ident": "message"
            },
            {
              "ident": "type"
            }
          ]
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "union",
    "childrenParentSchema": "union",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output",
    "deprecated": false,
    "key": "output",
    "docstring": "Moderation for the generated output.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output",
      "types": [
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "model"
            },
            {
              "ident": "results"
            },
            {
              "ident": "type"
            }
          ]
        },
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "code"
            },
            {
              "ident": "message"
            },
            {
              "ident": "type"
            }
          ]
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "union",
    "childrenParentSchema": "union",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "default"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "flex"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "scale"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 4": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "priority"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 5": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fast"
    }
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens",
    "deprecated": false,
    "key": "completion_tokens",
    "docstring": "Number of tokens in the generated completion.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens",
    "deprecated": false,
    "key": "prompt_tokens",
    "docstring": "Number of tokens in the prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) total_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/total_tokens",
    "deprecated": false,
    "key": "total_tokens",
    "docstring": "Total number of tokens used in the request (prompt + completion).",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details",
    "deprecated": false,
    "key": "completion_tokens_details",
    "docstring": "Breakdown of tokens used in a completion.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "accepted_prediction_tokens"
        },
        {
          "ident": "audio_tokens"
        },
        {
          "ident": "reasoning_tokens"
        },
        {
          "ident": "rejected_prediction_tokens"
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
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) accepted_prediction_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) audio_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) reasoning_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) rejected_prediction_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) text_tokens"
    ]
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details",
    "deprecated": false,
    "key": "prompt_tokens_details",
    "docstring": "Breakdown of tokens used in the prompt.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio_tokens"
        },
        {
          "ident": "cache_write_tokens"
        },
        {
          "ident": "cached_tokens"
        },
        {
          "ident": "image_tokens"
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
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) audio_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cache_write_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cached_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) image_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) text_tokens"
    ]
  },
  "(resource) completions > (model) completion_usage > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/CompletionUsage",
    "docstring": "Usage statistics for the completion request.",
    "ident": "CompletionUsage",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "completion_tokens"
        },
        {
          "ident": "prompt_tokens"
        },
        {
          "ident": "total_tokens"
        },
        {
          "ident": "completion_tokens_details"
        },
        {
          "ident": "prompt_tokens_details"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) total_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) content": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/content",
    "deprecated": false,
    "key": "content",
    "docstring": "The contents of the chunk message.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/function_call",
    "deprecated": true,
    "key": "function_call",
    "docstring": "Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "arguments"
        },
        {
          "ident": "name"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) arguments",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) name"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) refusal": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/refusal",
    "deprecated": false,
    "key": "refusal",
    "docstring": "The refusal message generated by the model.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": true,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/role",
    "deprecated": false,
    "key": "role",
    "docstring": "The role of the author of this message.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/role",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "developer"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "system"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "user"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "assistant"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "tool"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 1",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 2",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 3",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 4"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/tool_calls",
    "deprecated": false,
    "key": "tool_calls",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/tool_calls",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "index"
          },
          {
            "ident": "id"
          },
          {
            "ident": "function"
          },
          {
            "ident": "type"
          }
        ]
      }
    },
    "optional": true,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) index",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) id",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "stop"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "length"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "tool_calls"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "content_filter"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 4": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "function_call"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) content": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/content",
    "deprecated": false,
    "key": "content",
    "docstring": "A list of message content tokens with log probability information.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/content",
      "elementType": {
        "kind": "HttpTypeReference",
        "ident": "ChatCompletionTokenLogprob",
        "$ref": "(resource) chat.completions > (model) chat_completion_token_logprob > (schema)"
      }
    },
    "optional": false,
    "nullable": true,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) refusal": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/refusal",
    "deprecated": false,
    "key": "refusal",
    "docstring": "A list of message refusal tokens with log probability information.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/refusal",
      "elementType": {
        "kind": "HttpTypeReference",
        "ident": "ChatCompletionTokenLogprob",
        "$ref": "(resource) chat.completions > (model) chat_completion_token_logprob > (schema)"
      }
    },
    "optional": false,
    "nullable": true,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input/oneOf/0",
    "docstring": "Successful moderation results for the request input or generated output.",
    "ident": "ModerationResults",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        },
        {
          "ident": "results"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input/oneOf/1",
    "docstring": "An error produced while attempting moderation.",
    "ident": "Error",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "code"
        },
        {
          "ident": "message"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) code",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) message",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output/oneOf/0",
    "docstring": "Successful moderation results for the request input or generated output.",
    "ident": "ModerationResults",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        },
        {
          "ident": "results"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output/oneOf/1",
    "docstring": "An error produced while attempting moderation.",
    "ident": "Error",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "code"
        },
        {
          "ident": "message"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) code",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) message",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type"
    ]
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) accepted_prediction_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/accepted_prediction_tokens",
    "deprecated": false,
    "key": "accepted_prediction_tokens",
    "docstring": "When using Predicted Outputs, the number of tokens in the\nprediction that appeared in the completion.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) audio_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/audio_tokens",
    "deprecated": false,
    "key": "audio_tokens",
    "docstring": "Audio input tokens generated by the model.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) reasoning_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/reasoning_tokens",
    "deprecated": false,
    "key": "reasoning_tokens",
    "docstring": "Tokens generated by the model for reasoning.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) rejected_prediction_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/rejected_prediction_tokens",
    "deprecated": false,
    "key": "rejected_prediction_tokens",
    "docstring": "When using Predicted Outputs, the number of tokens in the\nprediction that did not appear in the completion. However, like\nreasoning tokens, these tokens are still counted in the total\ncompletion tokens for purposes of billing, output, and context window\nlimits.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) text_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/text_tokens",
    "deprecated": false,
    "key": "text_tokens",
    "docstring": "Text output tokens generated by the model.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) audio_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/audio_tokens",
    "deprecated": false,
    "key": "audio_tokens",
    "docstring": "Audio input tokens present in the prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cache_write_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/cache_write_tokens",
    "deprecated": false,
    "key": "cache_write_tokens",
    "docstring": "The unadjusted number of prompt tokens written to cache.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cached_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/cached_tokens",
    "deprecated": false,
    "key": "cached_tokens",
    "docstring": "Cached tokens present in the prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "default": 0,
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) image_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/image_tokens",
    "deprecated": false,
    "key": "image_tokens",
    "docstring": "Image input tokens present in the prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) text_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/text_tokens",
    "deprecated": false,
    "key": "text_tokens",
    "docstring": "Text input tokens present in the prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) arguments": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/function_call/properties/arguments",
    "deprecated": false,
    "key": "arguments",
    "docstring": "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) name": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/function_call/properties/name",
    "deprecated": false,
    "key": "name",
    "docstring": "The name of the function to call.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "developer"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "system"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "user"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "assistant"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 4": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "tool"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) index": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/index",
    "deprecated": false,
    "key": "index",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The ID of the tool call.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/function",
    "deprecated": false,
    "key": "function",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "arguments"
        },
        {
          "ident": "name"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) arguments",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) name"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the tool. Currently, only `function` is supported.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "function"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/token",
    "deprecated": false,
    "key": "token",
    "docstring": "The token.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/bytes",
    "deprecated": false,
    "key": "bytes",
    "docstring": "A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/bytes",
      "elementType": {
        "kind": "HttpTypeNumber"
      }
    },
    "optional": false,
    "nullable": true,
    "schemaType": "array",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/logprob",
    "deprecated": false,
    "key": "logprob",
    "docstring": "The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs",
    "deprecated": false,
    "key": "top_logprobs",
    "docstring": "List of the most likely tokens and their log probability, at this token position. The number of entries may be fewer than the requested `top_logprobs`.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs",
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
    "optional": false,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) logprob"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob",
    "ident": "ChatCompletionTokenLogprob",
    "type": {
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
        },
        {
          "ident": "top_logprobs"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The moderation model used to generate the results.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results",
    "deprecated": false,
    "key": "results",
    "docstring": "A list of moderation results.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "categories"
          },
          {
            "ident": "category_applied_input_types"
          },
          {
            "ident": "category_scores"
          },
          {
            "ident": "flagged"
          },
          {
            "ident": "model"
          },
          {
            "ident": "type"
          }
        ]
      }
    },
    "optional": false,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) categories",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_scores",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) flagged",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The object type, which is always `moderation_results`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_results"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) code": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/code",
    "deprecated": false,
    "key": "code",
    "docstring": "The error code.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) message": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/message",
    "deprecated": false,
    "key": "message",
    "docstring": "The error message.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The object type, which is always `error`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type",
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
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The moderation model used to generate the results.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results",
    "deprecated": false,
    "key": "results",
    "docstring": "A list of moderation results.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "categories"
          },
          {
            "ident": "category_applied_input_types"
          },
          {
            "ident": "category_scores"
          },
          {
            "ident": "flagged"
          },
          {
            "ident": "model"
          },
          {
            "ident": "type"
          }
        ]
      }
    },
    "optional": false,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) categories",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_scores",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) flagged",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The object type, which is always `moderation_results`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_results"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) code": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/code",
    "deprecated": false,
    "key": "code",
    "docstring": "The error code.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) message": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/message",
    "deprecated": false,
    "key": "message",
    "docstring": "The error message.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The object type, which is always `error`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type",
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
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) arguments": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/function/properties/arguments",
    "deprecated": false,
    "key": "arguments",
    "docstring": "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) name": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/function/properties/name",
    "deprecated": false,
    "key": "name",
    "docstring": "The name of the function to call.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": true,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "function"
    }
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) token": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/token",
    "deprecated": false,
    "key": "token",
    "docstring": "The token.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) bytes": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/bytes",
    "deprecated": false,
    "key": "bytes",
    "docstring": "A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/bytes",
      "elementType": {
        "kind": "HttpTypeNumber"
      }
    },
    "optional": false,
    "nullable": true,
    "schemaType": "array",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) logprob": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/logprob",
    "deprecated": false,
    "key": "logprob",
    "docstring": "The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) categories": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/categories",
    "deprecated": false,
    "key": "categories",
    "docstring": "A dictionary of moderation categories to booleans, True if the input is flagged under this category.",
    "type": {
      "kind": "HttpTypeReference",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/categories",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeBoolean"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types",
    "deprecated": false,
    "key": "category_applied_input_types",
    "docstring": "Which modalities of input are reflected by the score for each category.",
    "type": {
      "kind": "HttpTypeReference",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeArray",
          "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties",
          "elementType": {
            "kind": "HttpTypeUnion",
            "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties/items",
            "types": [
              {
                "kind": "HttpTypeLiteral",
                "literal": "text"
              },
              {
                "kind": "HttpTypeLiteral",
                "literal": "image"
              }
            ]
          }
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "map",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_scores": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores",
    "deprecated": false,
    "key": "category_scores",
    "docstring": "A dictionary of moderation categories to scores.",
    "type": {
      "kind": "HttpTypeReference",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeNumber"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) flagged": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/flagged",
    "deprecated": false,
    "key": "flagged",
    "docstring": "A boolean indicating whether the content was flagged by any category.",
    "type": {
      "kind": "HttpTypeBoolean"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "boolean",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The moderation model that produced this result.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The object type, which was always `moderation_result` for successful moderation results.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_result"
        }
      ]
    },
    "default": "moderation_result",
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_results"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "error"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) categories": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/categories",
    "deprecated": false,
    "key": "categories",
    "docstring": "A dictionary of moderation categories to booleans, True if the input is flagged under this category.",
    "type": {
      "kind": "HttpTypeReference",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/categories",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeBoolean"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types",
    "deprecated": false,
    "key": "category_applied_input_types",
    "docstring": "Which modalities of input are reflected by the score for each category.",
    "type": {
      "kind": "HttpTypeReference",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeArray",
          "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties",
          "elementType": {
            "kind": "HttpTypeUnion",
            "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties/items",
            "types": [
              {
                "kind": "HttpTypeLiteral",
                "literal": "text"
              },
              {
                "kind": "HttpTypeLiteral",
                "literal": "image"
              }
            ]
          }
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "map",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_scores": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores",
    "deprecated": false,
    "key": "category_scores",
    "docstring": "A dictionary of moderation categories to scores.",
    "type": {
      "kind": "HttpTypeReference",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeNumber"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) flagged": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/flagged",
    "deprecated": false,
    "key": "flagged",
    "docstring": "A boolean indicating whether the content was flagged by any category.",
    "type": {
      "kind": "HttpTypeBoolean"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "boolean",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) model": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/model",
    "deprecated": false,
    "key": "model",
    "docstring": "The moderation model that produced this result.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ModerationResultBody/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The object type, which was always `moderation_result` for successful moderation results.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ModerationResultBody/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_result"
        }
      ]
    },
    "default": "moderation_result",
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_results"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "error"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "text"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_result"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "text"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_result"
    }
  }
}
```

### Example

```json
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}],"obfuscation":"r4N7vQ2m"}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}],"obfuscation":"p9K3xT6w"}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}],"obfuscation":""}
```
