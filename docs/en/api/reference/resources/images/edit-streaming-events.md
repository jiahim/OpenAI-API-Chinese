# Image edit streaming events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Stream image generation and editing in real time with server-sent events.
[Learn more about image streaming](https://developers.openai.com/docs/guides/image-generation).

## image_edit.partial_image

Emitted when a partial image is available during image editing streaming.

### Schema

Schema name: `ImageEditPartialImageEvent`

```json
{
  "(resource) images > (model) image_edit_partial_image_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent",
    "docstring": "Emitted when a partial image is available during image editing streaming.\n",
    "ident": "ImageEditPartialImageEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "b64_json"
        },
        {
          "ident": "background"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "output_format"
        },
        {
          "ident": "partial_image_index"
        },
        {
          "ident": "quality"
        },
        {
          "ident": "size"
        },
        {
          "ident": "type"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) b64_json",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) created_at",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) partial_image_index",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) type"
    ]
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) b64_json": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/b64_json",
    "deprecated": false,
    "key": "b64_json",
    "docstring": "Base64-encoded partial image data, suitable for rendering as an image.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/background",
    "deprecated": false,
    "key": "background",
    "docstring": "The background setting for the requested edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/background",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transparent"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "opaque"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background > (member) 0",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background > (member) 1",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background > (member) 2"
    ]
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp when the event was created.\n",
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
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/output_format",
    "deprecated": false,
    "key": "output_format",
    "docstring": "The output format for the requested edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/output_format",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "png"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "webp"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "jpeg"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format > (member) 0",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format > (member) 1",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format > (member) 2"
    ]
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) partial_image_index": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/partial_image_index",
    "deprecated": false,
    "key": "partial_image_index",
    "docstring": "0-based index for the partial image (streaming).\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/quality",
    "deprecated": false,
    "key": "quality",
    "docstring": "The quality setting for the requested edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/quality",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "low"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "medium"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "high"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 0",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 1",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 2",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 3"
    ]
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/size",
    "deprecated": false,
    "key": "size",
    "docstring": "The size of the requested edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/size",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1536"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1536x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 0",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 1",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 2",
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 3"
    ]
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `image_edit.partial_image`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditPartialImageEvent/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "image_edit.partial_image"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transparent"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "opaque"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) background > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "png"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "webp"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) output_format > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "jpeg"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "low"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "medium"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "high"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) quality > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1024"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1536"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1536x1024"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) size > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_edit_partial_image_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image_edit.partial_image"
    }
  }
}
```

### Example

```json
{
  "type": "image_edit.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
```

## image_edit.completed

Emitted when image editing has completed and the final image is available.

### Schema

Schema name: `ImageEditCompletedEvent`

```json
{
  "(resource) images > (model) image_edit_completed_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent",
    "docstring": "Emitted when image editing has completed and the final image is available.\n",
    "ident": "ImageEditCompletedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "b64_json"
        },
        {
          "ident": "background"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "output_format"
        },
        {
          "ident": "quality"
        },
        {
          "ident": "size"
        },
        {
          "ident": "type"
        },
        {
          "ident": "usage"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) b64_json",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) background",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) created_at",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) size",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) type",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) b64_json": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/b64_json",
    "deprecated": false,
    "key": "b64_json",
    "docstring": "Base64-encoded final edited image data, suitable for rendering as an image.\n",
    "type": {
      "kind": "HttpTypeString"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) background": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/background",
    "deprecated": false,
    "key": "background",
    "docstring": "The background setting for the edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/background",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transparent"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "opaque"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) background > (member) 0",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) background > (member) 1",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) background > (member) 2"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/created_at",
    "deprecated": false,
    "key": "created_at",
    "docstring": "The Unix timestamp when the event was created.\n",
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
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/output_format",
    "deprecated": false,
    "key": "output_format",
    "docstring": "The output format for the edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/output_format",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "png"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "webp"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "jpeg"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format > (member) 0",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format > (member) 1",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format > (member) 2"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/quality",
    "deprecated": false,
    "key": "quality",
    "docstring": "The quality setting for the edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/quality",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "low"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "medium"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "high"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 0",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 1",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 2",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 3"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) size": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/size",
    "deprecated": false,
    "key": "size",
    "docstring": "The size of the edited image.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/size",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1536"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1536x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 0",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 1",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 2",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 3"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/type",
    "deprecated": false,
    "key": "type",
    "docstring": "The type of the event. Always `image_edit.completed`.\n",
    "type": {
      "kind": "HttpTypeUnion",
      "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/type",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "image_edit.completed"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImageEditCompletedEvent/properties/usage",
    "deprecated": false,
    "key": "usage",
    "docstring": "For the GPT image models only, the token usage information for the image generation.\n",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "input_tokens"
        },
        {
          "ident": "input_tokens_details"
        },
        {
          "ident": "output_tokens"
        },
        {
          "ident": "total_tokens"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens_details",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) output_tokens",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) total_tokens"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) background > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transparent"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) background > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "opaque"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) background > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "png"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "webp"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) output_format > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "jpeg"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "low"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "medium"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "high"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) quality > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1024"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1536"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1536x1024"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) size > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image_edit.completed"
    }
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens",
    "deprecated": false,
    "key": "input_tokens",
    "docstring": "The number of tokens (images and text) in the input prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens_details": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens_details",
    "deprecated": false,
    "key": "input_tokens_details",
    "docstring": "The input tokens detailed information for the image generation.",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "image_tokens"
        },
        {
          "ident": "text_tokens"
        }
      ]
    },
    "optional": false,
    "nullable": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) image_tokens",
      "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) text_tokens"
    ]
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) output_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImagesUsage/properties/output_tokens",
    "deprecated": false,
    "key": "output_tokens",
    "docstring": "The number of image tokens in the output image.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) total_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImagesUsage/properties/total_tokens",
    "deprecated": false,
    "key": "total_tokens",
    "docstring": "The total number of tokens (images and text) used for the image generation.\n",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) image_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens_details/properties/image_tokens",
    "deprecated": false,
    "key": "image_tokens",
    "docstring": "The number of image tokens in the input prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_edit_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) text_tokens": {
    "kind": "HttpDeclProperty",
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens_details/properties/text_tokens",
    "deprecated": false,
    "key": "text_tokens",
    "docstring": "The number of text tokens in the input prompt.",
    "type": {
      "kind": "HttpTypeNumber"
    },
    "optional": false,
    "nullable": false,
    "schemaType": "integer",
    "children": []
  }
}
```

### Example

```json
{
  "type": "image_edit.completed",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
```
