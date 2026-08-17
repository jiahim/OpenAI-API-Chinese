# Threads

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete ChatKit thread

**delete** `/chatkit/threads/{thread_id}`

Delete a ChatKit thread along with its items and stored attachments.

### Path Parameters

- `thread_id: string`

### Returns

- `id: string`

  Identifier of the deleted thread.

- `deleted: boolean`

  Indicates that the thread has been deleted.

- `object: "chatkit.thread.deleted"`

  Type discriminator that is always `chatkit.thread.deleted`.

  - `"chatkit.thread.deleted"`

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "chatkit.thread.deleted"
}
```

## List ChatKit threads

**get** `/chatkit/threads`

List ChatKit threads with optional pagination and user filters.

### Query Parameters

- `after: optional string`

  List items created after this thread item ID. Defaults to null for the first page.

- `before: optional string`

  List items created before this thread item ID. Defaults to null for the newest results.

- `limit: optional number`

  Maximum number of thread items to return. Defaults to 20.

- `order: optional "asc" or "desc"`

  Sort order for results by creation time. Defaults to `desc`.

  - `"asc"`

  - `"desc"`

- `user: optional string`

  Filter threads that belong to this user identifier. Defaults to null to return all users.

### Returns

- `data: array of ChatKitThread`

  A list of items

  - `id: string`

    Identifier of the thread.

  - `created_at: number`

    Unix timestamp (in seconds) for when the thread was created.

  - `object: "chatkit.thread"`

    Type discriminator that is always `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    Current status for the thread. Defaults to `active` for newly created threads.

    - `Active object { type }`

      Indicates that a thread is active.

      - `type: "active"`

        Status discriminator that is always `active`.

        - `"active"`

    - `Locked object { reason, type }`

      Indicates that a thread is locked and cannot accept new input.

      - `reason: string or null`

        Reason that the thread was locked. Defaults to null when no reason is recorded.

      - `type: "locked"`

        Status discriminator that is always `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      Indicates that a thread has been closed.

      - `reason: string or null`

        Reason that the thread was closed. Defaults to null when no reason is recorded.

      - `type: "closed"`

        Status discriminator that is always `closed`.

        - `"closed"`

  - `title: string or null`

    Optional human-readable title for the thread. Defaults to null when no title has been generated.

  - `user: string`

    Free-form string that identifies your end user who owns the thread.

- `first_id: string or null`

  The ID of the first item in the list.

- `has_more: boolean`

  Whether there are more items available.

- `last_id: string or null`

  The ID of the last item in the list.

- `object: "list"`

  The type of object returned, must be `list`.

  - `"list"`

### Example

```http
curl https://api.openai.com/v1/chatkit/threads \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "cthr_def456",
      "created_at": 1712345600,
      "object": "chatkit.thread",
      "status": {
        "type": "active"
      },
      "title": "Demo feedback",
      "user": "user_456"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### Example

```http
curl "https://api.openai.com/v1/chatkit/threads?limit=2&order=desc" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "cthr_abc123",
      "object": "chatkit.thread",
      "title": "Customer escalation"
    },
    {
      "id": "cthr_def456",
      "object": "chatkit.thread",
      "title": "Demo feedback"
    }
  ],
  "has_more": false,
  "object": "list"
}
```

## List ChatKit thread items

**get** `/chatkit/threads/{thread_id}/items`

List items that belong to a ChatKit thread.

### Path Parameters

- `thread_id: string`

### Query Parameters

- `after: optional string`

  List items created after this thread item ID. Defaults to null for the first page.

- `before: optional string`

  List items created before this thread item ID. Defaults to null for the newest results.

- `limit: optional number`

  Maximum number of thread items to return. Defaults to 20.

- `order: optional "asc" or "desc"`

  Sort order for results by creation time. Defaults to `desc`.

  - `"asc"`

  - `"desc"`

### Returns

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  A paginated list of thread items rendered for the ChatKit API.

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    A list of items

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      User-authored messages within a thread.

      - `id: string`

        Identifier of the thread item.

      - `attachments: array of ChatKitAttachment`

        Attachments associated with the user message. Defaults to an empty list.

        - `id: string`

          Identifier for the attachment.

        - `mime_type: string`

          MIME type of the attachment.

        - `name: string`

          Original display name for the attachment.

        - `preview_url: string or null`

          Preview URL for rendering the attachment inline.

        - `type: "image" or "file"`

          Attachment discriminator.

          - `"image"`

          - `"file"`

      - `content: array of object { text, type }  or object { text, type }`

        Ordered content elements supplied by the user.

        - `InputText object { text, type }`

          Text block that a user contributed to the thread.

          - `text: string`

            Plain-text content supplied by the user.

          - `type: "input_text"`

            Type discriminator that is always `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          Quoted snippet that the user referenced in their message.

          - `text: string`

            Quoted text content.

          - `type: "quoted_text"`

            Type discriminator that is always `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `inference_options: object { model, tool_choice }  or null`

        Inference overrides applied to the message. Defaults to null when unset.

        - `model: string or null`

          Model name that generated the response. Defaults to null when using the session default.

        - `tool_choice: object { id }  or null`

          Preferred tool to invoke. Defaults to null when ChatKit should auto-select.

          - `id: string`

            Identifier of the requested tool.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      Assistant-authored message within a thread.

      - `id: string`

        Identifier of the thread item.

      - `content: array of ChatKitResponseOutputText`

        Ordered assistant response segments.

        - `annotations: array of object { source, type }  or object { source, type }`

          Ordered list of annotations attached to the response text.

          - `File object { source, type }`

            Annotation that references an uploaded file.

            - `source: object { filename, type }`

              File attachment referenced by the annotation.

              - `filename: string`

                Filename referenced by the annotation.

              - `type: "file"`

                Type discriminator that is always `file`.

                - `"file"`

            - `type: "file"`

              Type discriminator that is always `file` for this annotation.

              - `"file"`

          - `URL object { source, type }`

            Annotation that references a URL.

            - `source: object { type, url }`

              URL referenced by the annotation.

              - `type: "url"`

                Type discriminator that is always `url`.

                - `"url"`

              - `url: string`

                URL referenced by the annotation.

            - `type: "url"`

              Type discriminator that is always `url` for this annotation.

              - `"url"`

        - `text: string`

          Assistant generated text.

        - `type: "output_text"`

          Type discriminator that is always `output_text`.

          - `"output_text"`

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.assistant_message"`

        Type discriminator that is always `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      Thread item that renders a widget payload.

      - `id: string`

        Identifier of the thread item.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.widget"`

        Type discriminator that is always `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        Serialized widget payload rendered in the UI.

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      Record of a client side tool invocation initiated by the assistant.

      - `id: string`

        Identifier of the thread item.

      - `arguments: string`

        JSON-encoded arguments that were sent to the tool.

      - `call_id: string`

        Identifier for the client tool call.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `name: string`

        Tool name that was invoked.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        JSON-encoded output captured from the tool. Defaults to null while execution is in progress.

      - `status: "in_progress" or "completed"`

        Execution status for the tool call.

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.client_tool_call"`

        Type discriminator that is always `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      Task emitted by the workflow to show progress and status updates.

      - `id: string`

        Identifier of the thread item.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `heading: string or null`

        Optional heading for the task. Defaults to null when not provided.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `summary: string or null`

        Optional summary that describes the task. Defaults to null when omitted.

      - `task_type: "custom" or "thought"`

        Subtype for the task.

        - `"custom"`

        - `"thought"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.task"`

        Type discriminator that is always `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      Collection of workflow tasks grouped together in the thread.

      - `id: string`

        Identifier of the thread item.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        Tasks included in the group.

        - `heading: string or null`

          Optional heading for the grouped task. Defaults to null when not provided.

        - `summary: string or null`

          Optional summary that describes the grouped task. Defaults to null when omitted.

        - `type: "custom" or "thought"`

          Subtype for the grouped task.

          - `"custom"`

          - `"thought"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.task_group"`

        Type discriminator that is always `chatkit.task_group`.

        - `"chatkit.task_group"`

  - `first_id: string or null`

    The ID of the first item in the list.

  - `has_more: boolean`

    Whether there are more items available.

  - `last_id: string or null`

    The ID of the last item in the list.

  - `object: "list"`

    The type of object returned, must be `list`.

    - `"list"`

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID/items \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "attachments": [
        {
          "id": "id",
          "mime_type": "mime_type",
          "name": "name",
          "preview_url": "https://example.com",
          "type": "image"
        }
      ],
      "content": [
        {
          "text": "text",
          "type": "input_text"
        }
      ],
      "created_at": 0,
      "inference_options": {
        "model": "model",
        "tool_choice": {
          "id": "id"
        }
      },
      "object": "chatkit.thread_item",
      "thread_id": "thread_id",
      "type": "chatkit.user_message"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### Example

```http
curl "https://api.openai.com/v1/chatkit/threads/cthr_abc123/items?limit=3" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "cthi_user_001",
      "object": "chatkit.thread_item",
      "type": "user_message",
      "content": [
        {
          "type": "input_text",
          "text": "I need help debugging an onboarding issue."
        }
      ],
      "attachments": []
    },
    {
      "id": "cthi_assistant_002",
      "object": "chatkit.thread_item",
      "type": "assistant_message",
      "content": [
        {
          "type": "output_text",
          "text": "Let's start by confirming the workflow version you deployed."
        }
      ]
    }
  ],
  "has_more": false,
  "object": "list"
}
```

## Retrieve ChatKit thread

**get** `/chatkit/threads/{thread_id}`

Retrieve a ChatKit thread by its identifier.

### Path Parameters

- `thread_id: string`

### Returns

- `ChatKitThread object { id, created_at, object, 3 more }`

  Represents a ChatKit thread and its current status.

  - `id: string`

    Identifier of the thread.

  - `created_at: number`

    Unix timestamp (in seconds) for when the thread was created.

  - `object: "chatkit.thread"`

    Type discriminator that is always `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    Current status for the thread. Defaults to `active` for newly created threads.

    - `Active object { type }`

      Indicates that a thread is active.

      - `type: "active"`

        Status discriminator that is always `active`.

        - `"active"`

    - `Locked object { reason, type }`

      Indicates that a thread is locked and cannot accept new input.

      - `reason: string or null`

        Reason that the thread was locked. Defaults to null when no reason is recorded.

      - `type: "locked"`

        Status discriminator that is always `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      Indicates that a thread has been closed.

      - `reason: string or null`

        Reason that the thread was closed. Defaults to null when no reason is recorded.

      - `type: "closed"`

        Status discriminator that is always `closed`.

        - `"closed"`

  - `title: string or null`

    Optional human-readable title for the thread. Defaults to null when no title has been generated.

  - `user: string`

    Free-form string that identifies your end user who owns the thread.

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cthr_def456",
  "created_at": 1712345600,
  "object": "chatkit.thread",
  "status": {
    "type": "active"
  },
  "title": "Demo feedback",
  "user": "user_456"
}
```

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/cthr_abc123 \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cthr_abc123",
  "object": "chatkit.thread",
  "title": "Customer escalation",
  "items": {
    "data": [
      {
        "id": "cthi_user_001",
        "object": "chatkit.thread_item",
        "type": "user_message",
        "content": [
          {
            "type": "input_text",
            "text": "I need help debugging an onboarding issue."
          }
        ],
        "attachments": []
      },
      {
        "id": "cthi_assistant_002",
        "object": "chatkit.thread_item",
        "type": "assistant_message",
        "content": [
          {
            "type": "output_text",
            "text": "Let's start by confirming the workflow version you deployed."
          }
        ]
      }
    ],
    "has_more": false
  }
}
```

## Domain Types

### Chat Session

- `ChatSession object { id, chatkit_configuration, client_secret, 7 more }`

  Represents a ChatKit session and its resolved configuration.

  - `id: string`

    Identifier for the ChatKit session.

  - `chatkit_configuration: ChatSessionChatKitConfiguration`

    Resolved ChatKit feature configuration for the session.

    - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

      Automatic thread titling preferences.

      - `enabled: boolean`

        Whether automatic thread titling is enabled.

    - `file_upload: ChatSessionFileUpload`

      Upload settings for the session.

      - `enabled: boolean`

        Indicates if uploads are enabled for the session.

      - `max_file_size: number or null`

        Maximum upload size in megabytes.

      - `max_files: number or null`

        Maximum number of uploads allowed during the session.

    - `history: ChatSessionHistory`

      History retention configuration.

      - `enabled: boolean`

        Indicates if chat history is persisted for the session.

      - `recent_threads: number or null`

        Number of prior threads surfaced in history views. Defaults to null when all history is retained.

  - `client_secret: string`

    Ephemeral client secret that authenticates session requests.

  - `expires_at: number`

    Unix timestamp (in seconds) for when the session expires.

  - `max_requests_per_1_minute: number`

    Convenience copy of the per-minute request limit.

  - `object: "chatkit.session"`

    Type discriminator that is always `chatkit.session`.

    - `"chatkit.session"`

  - `rate_limits: ChatSessionRateLimits`

    Resolved rate limit values.

    - `max_requests_per_1_minute: number`

      Maximum allowed requests per one-minute window.

  - `status: ChatSessionStatus`

    Current lifecycle state of the session.

    - `"active"`

    - `"expired"`

    - `"cancelled"`

  - `user: string`

    User identifier associated with the session.

  - `workflow: ChatKitWorkflow`

    Workflow metadata for the session.

    - `id: string`

      Identifier of the workflow backing the session.

    - `state_variables: map[string or boolean or number] or null`

      State variable key-value pairs applied when invoking the workflow. Defaults to null when no overrides were provided.

      - `string`

      - `boolean`

      - `number`

    - `tracing: object { enabled }`

      Tracing settings applied to the workflow.

      - `enabled: boolean`

        Indicates whether tracing is enabled.

    - `version: string or null`

      Specific workflow version used for the session. Defaults to null when using the latest deployment.

### Chat Session Automatic Thread Titling

- `ChatSessionAutomaticThreadTitling object { enabled }`

  Automatic thread title preferences for the session.

  - `enabled: boolean`

    Whether automatic thread titling is enabled.

### Chat Session ChatKit Configuration

- `ChatSessionChatKitConfiguration object { automatic_thread_titling, file_upload, history }`

  ChatKit configuration for the session.

  - `automatic_thread_titling: ChatSessionAutomaticThreadTitling`

    Automatic thread titling preferences.

    - `enabled: boolean`

      Whether automatic thread titling is enabled.

  - `file_upload: ChatSessionFileUpload`

    Upload settings for the session.

    - `enabled: boolean`

      Indicates if uploads are enabled for the session.

    - `max_file_size: number or null`

      Maximum upload size in megabytes.

    - `max_files: number or null`

      Maximum number of uploads allowed during the session.

  - `history: ChatSessionHistory`

    History retention configuration.

    - `enabled: boolean`

      Indicates if chat history is persisted for the session.

    - `recent_threads: number or null`

      Number of prior threads surfaced in history views. Defaults to null when all history is retained.

### Chat Session ChatKit Configuration Param

- `ChatSessionChatKitConfigurationParam object { automatic_thread_titling, file_upload, history }`

  Optional per-session configuration settings for ChatKit behavior.

  - `automatic_thread_titling: optional object { enabled }`

    Configuration for automatic thread titling. When omitted, automatic thread titling is enabled by default.

    - `enabled: optional boolean`

      Enable automatic thread title generation. Defaults to true.

  - `file_upload: optional object { enabled, max_file_size, max_files }`

    Configuration for upload enablement and limits. When omitted, uploads are disabled by default (max_files 10, max_file_size 512 MB).

    - `enabled: optional boolean`

      Enable uploads for this session. Defaults to false.

    - `max_file_size: optional number`

      Maximum size in megabytes for each uploaded file. Defaults to 512 MB, which is the maximum allowable size.

    - `max_files: optional number`

      Maximum number of files that can be uploaded to the session. Defaults to 10.

  - `history: optional object { enabled, recent_threads }`

    Configuration for chat history retention. When omitted, history is enabled by default with no limit on recent_threads (null).

    - `enabled: optional boolean`

      Enables chat users to access previous ChatKit threads. Defaults to true.

    - `recent_threads: optional number`

      Number of recent ChatKit threads users have access to. Defaults to unlimited when unset.

### Chat Session Expires After Param

- `ChatSessionExpiresAfterParam object { anchor, seconds }`

  Controls when the session expires relative to an anchor timestamp.

  - `anchor: "created_at"`

    Base timestamp used to calculate expiration. Currently fixed to `created_at`.

    - `"created_at"`

  - `seconds: number`

    Number of seconds after the anchor when the session expires.

### Chat Session File Upload

- `ChatSessionFileUpload object { enabled, max_file_size, max_files }`

  Upload permissions and limits applied to the session.

  - `enabled: boolean`

    Indicates if uploads are enabled for the session.

  - `max_file_size: number or null`

    Maximum upload size in megabytes.

  - `max_files: number or null`

    Maximum number of uploads allowed during the session.

### Chat Session History

- `ChatSessionHistory object { enabled, recent_threads }`

  History retention preferences returned for the session.

  - `enabled: boolean`

    Indicates if chat history is persisted for the session.

  - `recent_threads: number or null`

    Number of prior threads surfaced in history views. Defaults to null when all history is retained.

### Chat Session Rate Limits

- `ChatSessionRateLimits object { max_requests_per_1_minute }`

  Active per-minute request limit for the session.

  - `max_requests_per_1_minute: number`

    Maximum allowed requests per one-minute window.

### Chat Session Rate Limits Param

- `ChatSessionRateLimitsParam object { max_requests_per_1_minute }`

  Controls request rate limits for the session.

  - `max_requests_per_1_minute: optional number`

    Maximum number of requests allowed per minute for the session. Defaults to 10.

### Chat Session Status

- `ChatSessionStatus = "active" or "expired" or "cancelled"`

  - `"active"`

  - `"expired"`

  - `"cancelled"`

### Chat Session Workflow Param

- `ChatSessionWorkflowParam object { id, state_variables, tracing, version }`

  Workflow reference and overrides applied to the chat session.

  - `id: string`

    Identifier for the workflow invoked by the session.

  - `state_variables: optional map[string or boolean or number]`

    State variables forwarded to the workflow. Keys may be up to 64 characters, values must be primitive types, and the map defaults to an empty object.

    - `string`

    - `boolean`

    - `number`

  - `tracing: optional object { enabled }`

    Optional tracing overrides for the workflow invocation. When omitted, tracing is enabled by default.

    - `enabled: optional boolean`

      Whether tracing is enabled during the session. Defaults to true.

  - `version: optional string`

    Specific workflow version to run. Defaults to the latest deployed version.

### ChatKit Attachment

- `ChatKitAttachment object { id, mime_type, name, 2 more }`

  Attachment metadata included on thread items.

  - `id: string`

    Identifier for the attachment.

  - `mime_type: string`

    MIME type of the attachment.

  - `name: string`

    Original display name for the attachment.

  - `preview_url: string or null`

    Preview URL for rendering the attachment inline.

  - `type: "image" or "file"`

    Attachment discriminator.

    - `"image"`

    - `"file"`

### ChatKit Response Output Text

- `ChatKitResponseOutputText object { annotations, text, type }`

  Assistant response text accompanied by optional annotations.

  - `annotations: array of object { source, type }  or object { source, type }`

    Ordered list of annotations attached to the response text.

    - `File object { source, type }`

      Annotation that references an uploaded file.

      - `source: object { filename, type }`

        File attachment referenced by the annotation.

        - `filename: string`

          Filename referenced by the annotation.

        - `type: "file"`

          Type discriminator that is always `file`.

          - `"file"`

      - `type: "file"`

        Type discriminator that is always `file` for this annotation.

        - `"file"`

    - `URL object { source, type }`

      Annotation that references a URL.

      - `source: object { type, url }`

        URL referenced by the annotation.

        - `type: "url"`

          Type discriminator that is always `url`.

          - `"url"`

        - `url: string`

          URL referenced by the annotation.

      - `type: "url"`

        Type discriminator that is always `url` for this annotation.

        - `"url"`

  - `text: string`

    Assistant generated text.

  - `type: "output_text"`

    Type discriminator that is always `output_text`.

    - `"output_text"`

### ChatKit Thread

- `ChatKitThread object { id, created_at, object, 3 more }`

  Represents a ChatKit thread and its current status.

  - `id: string`

    Identifier of the thread.

  - `created_at: number`

    Unix timestamp (in seconds) for when the thread was created.

  - `object: "chatkit.thread"`

    Type discriminator that is always `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    Current status for the thread. Defaults to `active` for newly created threads.

    - `Active object { type }`

      Indicates that a thread is active.

      - `type: "active"`

        Status discriminator that is always `active`.

        - `"active"`

    - `Locked object { reason, type }`

      Indicates that a thread is locked and cannot accept new input.

      - `reason: string or null`

        Reason that the thread was locked. Defaults to null when no reason is recorded.

      - `type: "locked"`

        Status discriminator that is always `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      Indicates that a thread has been closed.

      - `reason: string or null`

        Reason that the thread was closed. Defaults to null when no reason is recorded.

      - `type: "closed"`

        Status discriminator that is always `closed`.

        - `"closed"`

  - `title: string or null`

    Optional human-readable title for the thread. Defaults to null when no title has been generated.

  - `user: string`

    Free-form string that identifies your end user who owns the thread.

### ChatKit Thread Assistant Message Item

- `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

  Assistant-authored message within a thread.

  - `id: string`

    Identifier of the thread item.

  - `content: array of ChatKitResponseOutputText`

    Ordered assistant response segments.

    - `annotations: array of object { source, type }  or object { source, type }`

      Ordered list of annotations attached to the response text.

      - `File object { source, type }`

        Annotation that references an uploaded file.

        - `source: object { filename, type }`

          File attachment referenced by the annotation.

          - `filename: string`

            Filename referenced by the annotation.

          - `type: "file"`

            Type discriminator that is always `file`.

            - `"file"`

        - `type: "file"`

          Type discriminator that is always `file` for this annotation.

          - `"file"`

      - `URL object { source, type }`

        Annotation that references a URL.

        - `source: object { type, url }`

          URL referenced by the annotation.

          - `type: "url"`

            Type discriminator that is always `url`.

            - `"url"`

          - `url: string`

            URL referenced by the annotation.

        - `type: "url"`

          Type discriminator that is always `url` for this annotation.

          - `"url"`

    - `text: string`

      Assistant generated text.

    - `type: "output_text"`

      Type discriminator that is always `output_text`.

      - `"output_text"`

  - `created_at: number`

    Unix timestamp (in seconds) for when the item was created.

  - `object: "chatkit.thread_item"`

    Type discriminator that is always `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    Identifier of the parent thread.

  - `type: "chatkit.assistant_message"`

    Type discriminator that is always `chatkit.assistant_message`.

    - `"chatkit.assistant_message"`

### ChatKit Thread Item List

- `ChatKitThreadItemList object { data, first_id, has_more, 2 more }`

  A paginated list of thread items rendered for the ChatKit API.

  - `data: array of ChatKitThreadUserMessageItem or ChatKitThreadAssistantMessageItem or ChatKitWidgetItem or 3 more`

    A list of items

    - `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

      User-authored messages within a thread.

      - `id: string`

        Identifier of the thread item.

      - `attachments: array of ChatKitAttachment`

        Attachments associated with the user message. Defaults to an empty list.

        - `id: string`

          Identifier for the attachment.

        - `mime_type: string`

          MIME type of the attachment.

        - `name: string`

          Original display name for the attachment.

        - `preview_url: string or null`

          Preview URL for rendering the attachment inline.

        - `type: "image" or "file"`

          Attachment discriminator.

          - `"image"`

          - `"file"`

      - `content: array of object { text, type }  or object { text, type }`

        Ordered content elements supplied by the user.

        - `InputText object { text, type }`

          Text block that a user contributed to the thread.

          - `text: string`

            Plain-text content supplied by the user.

          - `type: "input_text"`

            Type discriminator that is always `input_text`.

            - `"input_text"`

        - `QuotedText object { text, type }`

          Quoted snippet that the user referenced in their message.

          - `text: string`

            Quoted text content.

          - `type: "quoted_text"`

            Type discriminator that is always `quoted_text`.

            - `"quoted_text"`

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `inference_options: object { model, tool_choice }  or null`

        Inference overrides applied to the message. Defaults to null when unset.

        - `model: string or null`

          Model name that generated the response. Defaults to null when using the session default.

        - `tool_choice: object { id }  or null`

          Preferred tool to invoke. Defaults to null when ChatKit should auto-select.

          - `id: string`

            Identifier of the requested tool.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.user_message"`

        - `"chatkit.user_message"`

    - `ChatKitThreadAssistantMessageItem object { id, content, created_at, 3 more }`

      Assistant-authored message within a thread.

      - `id: string`

        Identifier of the thread item.

      - `content: array of ChatKitResponseOutputText`

        Ordered assistant response segments.

        - `annotations: array of object { source, type }  or object { source, type }`

          Ordered list of annotations attached to the response text.

          - `File object { source, type }`

            Annotation that references an uploaded file.

            - `source: object { filename, type }`

              File attachment referenced by the annotation.

              - `filename: string`

                Filename referenced by the annotation.

              - `type: "file"`

                Type discriminator that is always `file`.

                - `"file"`

            - `type: "file"`

              Type discriminator that is always `file` for this annotation.

              - `"file"`

          - `URL object { source, type }`

            Annotation that references a URL.

            - `source: object { type, url }`

              URL referenced by the annotation.

              - `type: "url"`

                Type discriminator that is always `url`.

                - `"url"`

              - `url: string`

                URL referenced by the annotation.

            - `type: "url"`

              Type discriminator that is always `url` for this annotation.

              - `"url"`

        - `text: string`

          Assistant generated text.

        - `type: "output_text"`

          Type discriminator that is always `output_text`.

          - `"output_text"`

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.assistant_message"`

        Type discriminator that is always `chatkit.assistant_message`.

        - `"chatkit.assistant_message"`

    - `ChatKitWidgetItem object { id, created_at, object, 3 more }`

      Thread item that renders a widget payload.

      - `id: string`

        Identifier of the thread item.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.widget"`

        Type discriminator that is always `chatkit.widget`.

        - `"chatkit.widget"`

      - `widget: string`

        Serialized widget payload rendered in the UI.

    - `ChatKitClientToolCall object { id, arguments, call_id, 7 more }`

      Record of a client side tool invocation initiated by the assistant.

      - `id: string`

        Identifier of the thread item.

      - `arguments: string`

        JSON-encoded arguments that were sent to the tool.

      - `call_id: string`

        Identifier for the client tool call.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `name: string`

        Tool name that was invoked.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `output: string or null`

        JSON-encoded output captured from the tool. Defaults to null while execution is in progress.

      - `status: "in_progress" or "completed"`

        Execution status for the tool call.

        - `"in_progress"`

        - `"completed"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.client_tool_call"`

        Type discriminator that is always `chatkit.client_tool_call`.

        - `"chatkit.client_tool_call"`

    - `ChatKitTask object { id, created_at, heading, 5 more }`

      Task emitted by the workflow to show progress and status updates.

      - `id: string`

        Identifier of the thread item.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `heading: string or null`

        Optional heading for the task. Defaults to null when not provided.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `summary: string or null`

        Optional summary that describes the task. Defaults to null when omitted.

      - `task_type: "custom" or "thought"`

        Subtype for the task.

        - `"custom"`

        - `"thought"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.task"`

        Type discriminator that is always `chatkit.task`.

        - `"chatkit.task"`

    - `ChatKitTaskGroup object { id, created_at, object, 3 more }`

      Collection of workflow tasks grouped together in the thread.

      - `id: string`

        Identifier of the thread item.

      - `created_at: number`

        Unix timestamp (in seconds) for when the item was created.

      - `object: "chatkit.thread_item"`

        Type discriminator that is always `chatkit.thread_item`.

        - `"chatkit.thread_item"`

      - `tasks: array of object { heading, summary, type }`

        Tasks included in the group.

        - `heading: string or null`

          Optional heading for the grouped task. Defaults to null when not provided.

        - `summary: string or null`

          Optional summary that describes the grouped task. Defaults to null when omitted.

        - `type: "custom" or "thought"`

          Subtype for the grouped task.

          - `"custom"`

          - `"thought"`

      - `thread_id: string`

        Identifier of the parent thread.

      - `type: "chatkit.task_group"`

        Type discriminator that is always `chatkit.task_group`.

        - `"chatkit.task_group"`

  - `first_id: string or null`

    The ID of the first item in the list.

  - `has_more: boolean`

    Whether there are more items available.

  - `last_id: string or null`

    The ID of the last item in the list.

  - `object: "list"`

    The type of object returned, must be `list`.

    - `"list"`

### ChatKit Thread User Message Item

- `ChatKitThreadUserMessageItem object { id, attachments, content, 5 more }`

  User-authored messages within a thread.

  - `id: string`

    Identifier of the thread item.

  - `attachments: array of ChatKitAttachment`

    Attachments associated with the user message. Defaults to an empty list.

    - `id: string`

      Identifier for the attachment.

    - `mime_type: string`

      MIME type of the attachment.

    - `name: string`

      Original display name for the attachment.

    - `preview_url: string or null`

      Preview URL for rendering the attachment inline.

    - `type: "image" or "file"`

      Attachment discriminator.

      - `"image"`

      - `"file"`

  - `content: array of object { text, type }  or object { text, type }`

    Ordered content elements supplied by the user.

    - `InputText object { text, type }`

      Text block that a user contributed to the thread.

      - `text: string`

        Plain-text content supplied by the user.

      - `type: "input_text"`

        Type discriminator that is always `input_text`.

        - `"input_text"`

    - `QuotedText object { text, type }`

      Quoted snippet that the user referenced in their message.

      - `text: string`

        Quoted text content.

      - `type: "quoted_text"`

        Type discriminator that is always `quoted_text`.

        - `"quoted_text"`

  - `created_at: number`

    Unix timestamp (in seconds) for when the item was created.

  - `inference_options: object { model, tool_choice }  or null`

    Inference overrides applied to the message. Defaults to null when unset.

    - `model: string or null`

      Model name that generated the response. Defaults to null when using the session default.

    - `tool_choice: object { id }  or null`

      Preferred tool to invoke. Defaults to null when ChatKit should auto-select.

      - `id: string`

        Identifier of the requested tool.

  - `object: "chatkit.thread_item"`

    Type discriminator that is always `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    Identifier of the parent thread.

  - `type: "chatkit.user_message"`

    - `"chatkit.user_message"`

### ChatKit Widget Item

- `ChatKitWidgetItem object { id, created_at, object, 3 more }`

  Thread item that renders a widget payload.

  - `id: string`

    Identifier of the thread item.

  - `created_at: number`

    Unix timestamp (in seconds) for when the item was created.

  - `object: "chatkit.thread_item"`

    Type discriminator that is always `chatkit.thread_item`.

    - `"chatkit.thread_item"`

  - `thread_id: string`

    Identifier of the parent thread.

  - `type: "chatkit.widget"`

    Type discriminator that is always `chatkit.widget`.

    - `"chatkit.widget"`

  - `widget: string`

    Serialized widget payload rendered in the UI.

### Thread Delete Response

- `ThreadDeleteResponse object { id, deleted, object }`

  Confirmation payload returned after deleting a thread.

  - `id: string`

    Identifier of the deleted thread.

  - `deleted: boolean`

    Indicates that the thread has been deleted.

  - `object: "chatkit.thread.deleted"`

    Type discriminator that is always `chatkit.thread.deleted`.

    - `"chatkit.thread.deleted"`
