# Webhooks events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Webhooks are HTTP requests sent by OpenAI to a URL you specify when certain
events happen during the course of API usage.

[Learn more about webhooks](https://developers.openai.com/docs/guides/webhooks).

## response.completed

Sent when a background response has been completed.

### Schema

Schema name: `WebhookResponseCompleted`

```json
{
  "(resource) webhooks > (model) response_completed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_completed/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a background response has been completed.\n",
    "ident": "ResponseCompletedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the model response was completed.\n",
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
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `response.completed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.completed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the model response.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.completed"
    }
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.completed",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## response.cancelled

Sent when a background response has been cancelled.

### Schema

Schema name: `WebhookResponseCancelled`

```json
{
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_cancelled/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a background response has been cancelled.\n",
    "ident": "ResponseCancelledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the model response was cancelled.\n",
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
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `response.cancelled`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.cancelled"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the model response.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.cancelled"
    }
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## response.failed

Sent when a background response has failed.

### Schema

Schema name: `WebhookResponseFailed`

```json
{
  "(resource) webhooks > (model) response_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_failed/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a background response has failed.\n",
    "ident": "ResponseFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the model response failed.\n",
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
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `response.failed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseFailed/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.failed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseFailed/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the model response.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.failed"
    }
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.failed",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## response.incomplete

Sent when a background response has been interrupted.

### Schema

Schema name: `WebhookResponseIncomplete`

```json
{
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_incomplete/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a background response has been interrupted.\n",
    "ident": "ResponseIncompleteWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the model response was interrupted.\n",
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
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `response.incomplete`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.incomplete"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the model response.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.incomplete"
    }
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.incomplete",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## batch.completed

Sent when a batch API request has been completed.

### Schema

Schema name: `WebhookBatchCompleted`

```json
{
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_completed/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a batch API request has been completed.\n",
    "ident": "BatchCompletedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request was completed.\n",
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
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `batch.completed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.completed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the batch API request.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.completed"
    }
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.completed",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## batch.cancelled

Sent when a batch API request has been cancelled.

### Schema

Schema name: `WebhookBatchCancelled`

```json
{
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_cancelled/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a batch API request has been cancelled.\n",
    "ident": "BatchCancelledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request was cancelled.\n",
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
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `batch.cancelled`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.cancelled"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the batch API request.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.cancelled"
    }
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## batch.expired

Sent when a batch API request has expired.

### Schema

Schema name: `WebhookBatchExpired`

```json
{
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_expired/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a batch API request has expired.\n",
    "ident": "BatchExpiredWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request expired.\n",
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
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `batch.expired`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchExpired/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.expired"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchExpired/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the batch API request.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.expired"
    }
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.expired",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## batch.failed

Sent when a batch API request has failed.

### Schema

Schema name: `WebhookBatchFailed`

```json
{
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_failed/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a batch API request has failed.\n",
    "ident": "BatchFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request failed.\n",
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
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `batch.failed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchFailed/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.failed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookBatchFailed/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the batch API request.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.failed"
    }
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.failed",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## fine_tuning.job.succeeded

Sent when a fine-tuning job has succeeded.

### Schema

Schema name: `WebhookFineTuningJobSucceeded`

```json
{
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/fine_tuning_job_succeeded/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a fine-tuning job has succeeded.\n",
    "ident": "FineTuningJobSucceededWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the fine-tuning job succeeded.\n",
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
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `fine_tuning.job.succeeded`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "fine_tuning.job.succeeded"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the fine-tuning job.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fine_tuning.job.succeeded"
    }
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.succeeded",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

## fine_tuning.job.failed

Sent when a fine-tuning job has failed.

### Schema

Schema name: `WebhookFineTuningJobFailed`

```json
{
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/fine_tuning_job_failed/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a fine-tuning job has failed.\n",
    "ident": "FineTuningJobFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the fine-tuning job failed.\n",
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
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `fine_tuning.job.failed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "fine_tuning.job.failed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the fine-tuning job.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fine_tuning.job.failed"
    }
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.failed",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

## fine_tuning.job.cancelled

Sent when a fine-tuning job has been cancelled.

### Schema

Schema name: `WebhookFineTuningJobCancelled`

```json
{
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/fine_tuning_job_cancelled/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when a fine-tuning job has been cancelled.\n",
    "ident": "FineTuningJobCancelledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the fine-tuning job was cancelled.\n",
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
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `fine_tuning.job.cancelled`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "fine_tuning.job.cancelled"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the fine-tuning job.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fine_tuning.job.cancelled"
    }
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

## eval.run.succeeded

Sent when an eval run has succeeded.

### Schema

Schema name: `WebhookEvalRunSucceeded`

```json
{
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/eval_run_succeeded/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an eval run has succeeded.\n",
    "ident": "EvalRunSucceededWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the eval run succeeded.\n",
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
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `eval.run.succeeded`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "eval.run.succeeded"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the eval run.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "eval.run.succeeded"
    }
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.succeeded",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

## eval.run.failed

Sent when an eval run has failed.

### Schema

Schema name: `WebhookEvalRunFailed`

```json
{
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/eval_run_failed/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an eval run has failed.\n",
    "ident": "EvalRunFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the eval run failed.\n",
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
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `eval.run.failed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "eval.run.failed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the eval run.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "eval.run.failed"
    }
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.failed",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

## eval.run.canceled

Sent when an eval run has been canceled.

### Schema

Schema name: `WebhookEvalRunCanceled`

```json
{
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/eval_run_canceled/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an eval run has been canceled.\n",
    "ident": "EvalRunCanceledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the eval run was canceled.\n",
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
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `eval.run.canceled`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "eval.run.canceled"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the eval run.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "eval.run.canceled"
    }
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.canceled",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

## realtime.call.incoming

Sent when an incoming API SIP session is available for Realtime acceptance.
The same pending session can also emit `live.call.incoming`; the first
successful Realtime or Live accept endpoint selects the runtime surface.

### Schema

Schema name: `WebhookRealtimeCallIncoming`

```json
{
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/realtime_call_incoming/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an incoming API SIP session is available for Realtime acceptance.\nThe same pending session can also emit `live.call.incoming`; the first\nsuccessful Realtime or Live accept endpoint selects the runtime surface.\n",
    "ident": "RealtimeCallIncomingWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the model response was completed.\n",
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
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "call_id"
        },
        {
          "ident": "sip_headers"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) call_id",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `realtime.call.incoming`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "realtime.call.incoming"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) call_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/call_id",
    "deprecated": false,
    "key": "call_id",
    "docstring": "The Transceiver `rtc_...` ID of the pending SIP session. The paired\n`live.call.incoming` event derives its `session_id` by replacing the\n`rtc_` prefix with `live_`. Use the ID returned by the event with the\ncorresponding Realtime or Live API.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers",
    "deprecated": false,
    "key": "sip_headers",
    "docstring": "Headers from the SIP Invite.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "name"
          },
          {
            "ident": "value"
          }
        ]
      }
    },
    "optional": false,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) name",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) value"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "realtime.call.incoming"
    }
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) name": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers/items/properties/name",
    "deprecated": false,
    "key": "name",
    "docstring": "Name of the SIP Header.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) value": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers/items/properties/value",
    "deprecated": false,
    "key": "value",
    "docstring": "Value of the SIP Header.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "realtime.call.incoming",
  "created_at": 1719168000,
  "data": {
    "call_id": "rtc_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_headers": [
      {"name": "Max-Forwards", "value": "63"},
      {"name": "CSeq", "value": "851287 INVITE"},
      {"name": "Content-Type", "value": "application/sdp"},
    ]
  }
}
```

## live.call.incoming

Sent when an incoming API SIP session is available for Live acceptance. The
same pending session can also emit `realtime.call.incoming`; the first
successful Realtime or Live accept endpoint selects the runtime surface.

### Schema

Schema name: `WebhookLiveCallIncoming`

```json
{
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/live_call_incoming/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an incoming API SIP session is available for Live acceptance. The\nsame pending session can also emit `realtime.call.incoming`; the first\nsuccessful Realtime or Live accept endpoint selects the runtime surface.\n",
    "ident": "LiveCallIncomingWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the event.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp (in seconds) of when the event was created.\n",
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
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/data",
    "deprecated": false,
    "key": "data",
    "docstring": "Event data payload.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "session_id"
        },
        {
          "ident": "sip_headers"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) session_id",
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers"
    ]
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `live.call.incoming`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "live.call.incoming"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "The object of the event. Always `event`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": true,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) session_id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/data/properties/session_id",
    "deprecated": false,
    "key": "session_id",
    "docstring": "The `live_...` ID of the pending SIP session. Forward this value\nunchanged when accepting or rejecting the call through the Live API.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/data/properties/sip_headers",
    "deprecated": false,
    "key": "sip_headers",
    "docstring": "Headers from the SIP Invite.\n",
    "type": {
      "kind": "HttpTypeArray",
      "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/data/properties/sip_headers",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "name"
          },
          {
            "ident": "value"
          }
        ]
      }
    },
    "optional": false,
    "nullable": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) name",
      "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) value"
    ]
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "live.call.incoming"
    }
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) name": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/data/properties/sip_headers/items/properties/name",
    "deprecated": false,
    "key": "name",
    "docstring": "Name of the SIP Header.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) live_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) value": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookLiveCallIncoming/properties/data/properties/sip_headers/items/properties/value",
    "deprecated": false,
    "key": "value",
    "docstring": "Value of the SIP Header.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "live.call.incoming",
  "created_at": 1719168000,
  "data": {
    "session_id": "live_u0_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_headers": [
      {"name": "Max-Forwards", "value": "63"},
      {"name": "CSeq", "value": "851287 INVITE"},
      {"name": "Content-Type", "value": "application/sdp"},
    ]
  }
}
```

## safety.alert.created

Sent when an approved safety alert is available for an API project.

### Schema

Schema name: `WebhookSafetyAlertCreated`

```json
{
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/safety_alert_created/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an approved safety alert is available for an API project.",
    "ident": "SafetyAlertCreatedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "object"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) object",
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) type"
    ]
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the webhook event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp in seconds when the event was created.",
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
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/data",
    "deprecated": false,
    "key": "data",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "Always `event`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "Always `safety.alert.created`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "safety.alert.created"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyAlertCreated/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The safety alert ID to pass to `GET /v1/safety/alerts/{id}`.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  },
  "(resource) webhooks > (model) safety_alert_created_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "safety.alert.created"
    }
  }
}
```

### Example

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.alert.created",
  "data": {"id": "alert_0123456789abcdef0123456789abcdef"}
}
```

## safety.org_alert.created

Sent when an approved safety alert is available for an enterprise workspace.

### Schema

Schema name: `WebhookSafetyOrgAlertCreated`

```json
{
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/safety_org_alert_created/post/requestBody/content/application%2Fjson/schema",
    "docstring": "Sent when an approved safety alert is available for an enterprise workspace.",
    "ident": "SafetyOrgAlertCreatedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "object"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) object",
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) type"
    ]
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The unique ID of the webhook event.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp in seconds when the event was created.",
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
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/data",
    "deprecated": false,
    "key": "data",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/object",
    "deprecated": false,
    "key": "object",
    "docstring": "Always `event`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/object",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "Always `safety.org_alert.created`.",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "safety.org_alert.created"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/WebhookSafetyOrgAlertCreated/properties/data/properties/id",
    "deprecated": false,
    "key": "id",
    "docstring": "The safety alert ID to pass to `GET /v1/safety/alerts/{id}`.",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  },
  "(resource) webhooks > (model) safety_org_alert_created_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "safety.org_alert.created"
    }
  }
}
```

### Example

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.org_alert.created",
  "data": {"id": "alert_0123456789abcdef0123456789abcdef"}
}
```
