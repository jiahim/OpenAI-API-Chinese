# Safety enforcement notifications

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use safety webhooks and the Safety Case Read API to connect OpenAI enforcement notices to your team's workflows. For example, when a warning arrives, your application can retrieve its case details, identify the affected user, and create an internal review ticket.

## When to use this

Use this integration to:

- Route warning and deactivation notices to your trust and safety, security, or support team.
- Add case details to an investigation or support ticket.
- Associate a notice with a user through your application's safety-identifier mapping.

The steps in this guide use a warning to illustrate the workflow. You can use the same integration for deactivation notices.

## How it works

Safety webhooks notify your application that a notice was issued. The Safety Case Read API provides the details for that notice.

| Event                        | Notice                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| `safety.warning_issued`      | A warning for a safety identifier in your organization.      |
| `safety.deactivation_issued` | A deactivation for a safety identifier in your organization. |

Each event contains a case ID. Use it with `GET /v1/safety/cases/{id}` to retrieve the safety identifier, notice type, case creation timestamp, and available policy reason.

These organization-level notifications are separate from project-level [misalignment alerts](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts). Retrieving a case does not change or reverse the enforcement. The API returns case metadata, not the underlying conversation or a full investigation report.

## Integrate with your application

Start by configuring an organization-level webhook and a key for case lookups. Then connect the notifications to your review workflow.

### 1. Configure your webhook and API key

Use a stable [safety identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) for each user, and keep your application's mapping from that identifier to the user. Avoid including personal information in the identifier.

Open your [organization webhook settings](https://platform.openai.com/settings/organization/webhooks) and select **Create**. Enter your receiver's HTTPS URL and subscribe to `safety.warning_issued` and `safety.deactivation_issued`. Save the signing secret securely so your receiver can verify incoming events. These events use an organization endpoint, not a project endpoint.

Your account needs `api.webhooks.read` and `organization.read` to view organization webhooks, plus `api.webhooks.write` and `organization.write` to create them. See [Permissions](https://developers.openai.com/api/docs/guides/rbac) for role configuration.

For case lookups, configure an API key for the same organization with **Restricted** permissions and set **Safety** to **Read** (`api.safety.read`). The API key authenticates case lookups; it is separate from the webhook signing secret.

### 2. Receive and verify the event

A warning notification has this structure. The IDs are illustrative:

```json
{
  "id": "evt_example",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.warning_issued",
  "data": {
    "id": "C-example"
  }
}
```

Verify the signature before processing the event. Save the verified event for processing, return a successful `2xx` response promptly, and retrieve the case in a background worker. See the Webhooks guide for [signature verification](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures) and [acknowledgments, retries, and duplicate deliveries](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server).

The event's `id` identifies the webhook event. Its `data.id` identifies the safety case to retrieve.

### 3. Retrieve the case

Set `OPENAI_API_KEY` to your API key. Replace `C-example` with `data.id` from the verified event:

```bash
curl "https://api.openai.com/v1/safety/cases/C-example" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

A successful lookup returns HTTP `200` and a case object. For example:

```json
{
  "id": "C-example",
  "object": "safety.case",
  "created_at": 1787659100,
  "entity_identifier": "safety-id-example",
  "reason": "cyber_abuse",
  "notice": {
    "type": "warning"
  }
}
```

Use `entity_identifier` to find the affected user in your application. The `reason` can be `null`; continue processing the notice when no reason is available.

The case creation timestamp is not necessarily the event timestamp or the time of an individual request. See the [Safety Case API reference](https://developers.openai.com/api/reference/resources/safety/subresources/cases/methods/retrieve) for field definitions.

### 4. Create a review ticket

Add the case ID, notice type, safety identifier, case creation timestamp, and available policy reason to your internal ticket. Link the matching user record so your team can investigate using its own application records. If you cannot find a matching user, preserve the case details and flag the missing mapping for review.

Make ticket creation safe to retry. Follow the [webhook deduplication guidance](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server) so repeated deliveries do not create duplicate tickets. Retries of your own background processing should also reuse the existing ticket.

If an agent helps with triage, limit its access to the records it needs and keep customer-facing actions subject to your existing approval controls.

## Confirm it's working

For a real event and an accessible case in your organization, check that:

1. Your receiver verifies the signature and returns a successful acknowledgment.
2. The lookup returns HTTP `200`, with a case `id` matching the event's `data.id`.
3. Your application identifies the expected user or flags a missing mapping.
4. One review ticket contains the available case details. Reprocessing the event does not create another ticket.

Before receiving a real notice, test your processing logic with local example events and mocked case responses. Include both notice types, a `null` reason, a missing user mapping, and duplicate deliveries. Test signature verification separately, including rejection of invalid signatures; keep it enabled on your production receiver.

The example IDs on this page are not retrievable cases. Mocked tests validate your processing logic, not live delivery or API permissions. Do not trigger an actual enforcement to test your integration. An absence of enforcement notifications alone does not indicate a broken integration.

## Troubleshoot

| Symptom                                   | What to check                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Signature verification fails              | Check the signing secret and preserve the raw request body as described in the Webhooks guide.           |
| Lookup returns `401`                      | Check that the API key is present and valid.                                                             |
| Lookup returns `403`                      | Check that the key has the `api.safety.read` permission.                                                 |
| Lookup returns `404`                      | Use `data.id`, not the event ID. Check that the case belongs to the key's organization.                  |
| Lookup returns `429` or a transient `5xx` | Retry with backoff and a bounded retry policy. Preserve the event for later processing or investigation. |
| A ticket is created more than once        | Check that ticket creation remains safe across repeated deliveries and worker retries.                   |

Do not silently discard a verified notification when its case lookup fails. Keep it available for retry or investigation.