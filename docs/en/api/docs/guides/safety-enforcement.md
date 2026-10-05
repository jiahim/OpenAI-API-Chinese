# Safety enforcement notifications

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use safety webhooks and the Safety Case Read API to connect OpenAI enforcement notices to your team's workflows. For example, when a warning arrives, your application can retrieve its case details, identify the affected user, and create an internal review ticket.

## When to use this

Use this integration to:

- Route warning and deactivation notices to your trust and safety or support team.
- Add case info to an investigation or support ticket.
- Associate a notice with a user through your application's safety-identifier mapping.

The steps in this guide use a warning to illustrate the workflow. You can use the same integration for deactivation notices.

## How it works

[Safety webhooks](https://developers.openai.com/api/reference/resources/webhooks#safety.warning_issued) notify your application that a notice was issued.

| Event                        | Notice                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| `safety.warning_issued`      | A warning for a safety identifier in your organization.      |
| `safety.deactivation_issued` | A deactivation for a safety identifier in your organization. |

Each event contains a case ID. Use it with `GET /v1/safety/cases/{id}` to retrieve the safety identifier, notice type, case creation timestamp, and available policy reason.

These organization-level notifications are separate from project-level [misalignment alerts](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts). Retrieving a case does not change or reverse the enforcement.

## Integrate with your application

Start by configuring an organization-level webhook and a key for case lookups. Then connect the notifications to your review workflow.

### Configure your webhook and receive events

Use a stable [safety identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) for each user, and keep your application's mapping from that identifier to the user. Avoid including personal information in the identifier.

Create an organization-level webhook endpoint in your [organization webhook settings](https://platform.openai.com/settings/organization/webhooks) and subscribe to `safety.warning_issued` and `safety.deactivation_issued`.

A warning notification has the following structure:

```json
{
  "id": "evt_example",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.warning_issued",
  "data": {
    "id": "C-abc123"
  }
}
```

For general webhook best practices, see the [Webhooks guide](https://developers.openai.com/api/docs/guides/webhooks).

The event's `id` identifies the webhook event. Its `data.id` identifies the safety case to retrieve.

### Retrieve the case

For case lookups, configure an API key for the same organization with **Restricted** permissions and set **Safety** to **Read** (`api.safety.read`).

Look up case metadata through the Safety Case Read API:

```bash
curl "https://api.openai.com/v1/safety/cases/C-abc123" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

A successful lookup returns HTTP `200` and a case object. For example:

```json
{
  "id": "C-abc123",
  "object": "safety.case",
  "created_at": 1787659100,
  "entity_identifier": "entity_identifier",
  "reason": "cyber_abuse",
  "notice": {
    "type": "warning"
  }
}
```

The `entity_identifier` represents the affected safety identifier. The case creation timestamp can be used to help with investigation. See the [Safety Case API reference](https://developers.openai.com/api/reference/resources/safety/subresources/cases/methods/retrieve) for field definitions.

### Connect to your workflows

Use webhooks to receive notifications, then use case metadata to programmatically route those notices into your existing investigation or support systems.

## Troubleshoot

| Symptom                                   | What to check                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Signature verification fails              | Check the signing secret and preserve the raw request body as described in the Webhooks guide.           |
| Lookup returns `401`                      | Check that the API key is present and valid.                                                             |
| Lookup returns `403`                      | Check that the key has the `api.safety.read` permission.                                                 |
| Lookup returns `404`                      | Use `data.id`, not the event ID. Check that the case belongs to the key's organization.                  |
| Lookup returns `429` or a transient `5xx` | Retry with backoff and a bounded retry policy. Preserve the event for later processing or investigation. |