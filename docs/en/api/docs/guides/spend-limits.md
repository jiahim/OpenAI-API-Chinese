# Spend limits

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use spend alerts to track monthly API costs. To stop traffic after tracked spend reaches a configured amount, enforce a hard spend limit for your organization or an individual project.

Hard spend limits can interrupt production traffic. When tracked spend reaches
  an applicable hard limit, affected API requests return a `429` error with the
  `organization_spend_limit_exceeded` or `project_spend_limit_exceeded` code.
  Enforcement is not instantaneous, so recorded spend can slightly exceed the
  configured amount.

## Choose a spend control

Spend alerts and hard spend limits have different effects:

| Control          | What happens at the configured amount       | Use it when you want to                       |
| ---------------- | ------------------------------------------- | --------------------------------------------- |
| Spend alert      | Sends a notification; API traffic continues | Track spend without interrupting traffic      |
| Hard spend limit | Affected API requests return a `429` error  | Enforce a monthly organization or project cap |

Spend alerts do not enforce a cap. They remain active when you add a hard spend limit, so you can use alerts for notification before a hard limit interrupts traffic.

OpenAI also assigns your organization an approved monthly [usage limit based on its usage tier](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers). This OpenAI-approved usage limit is separate from the spend limits you configure.

## Configure a spend limit

You need permission to manage the applicable organization or project settings. For details, see [API Platform permissions](https://developers.openai.com/api/docs/guides/rbac).



Organization


1. Go to [Organization limits](https://platform.openai.com/settings/organization/limits).
2. In **Spend**, select **Edit spend limit**.
3. Enter the **Monthly spend limit**.
4. To make API responses fail after the organization reaches the limit, turn on **Enforce a hard limit**.
5. Select **Save**.

  

  

    
Project


1. Go to [Project settings](https://platform.openai.com/settings/).
2. Select **Limits**.
3. In **Spend**, select **Edit spend limit**.
4. Enter the **Monthly spend limit**.
5. To make API responses fail after the project reaches the limit, turn on **Enforce a hard limit**.
6. Select **Save**.



## Understand hard-limit behavior

Organization and project hard limits can both apply to a request:

- An organization hard limit applies to API traffic across all projects in the organization.
- A project hard limit applies only to API traffic billed to that project.
- Reaching an organization hard limit returns a `429` error with the `organization_spend_limit_exceeded` code.
- Reaching a project hard limit returns a `429` error with the `project_spend_limit_exceeded` code.
- Raising or removing the reached limit allows traffic to resume after the update propagates. Otherwise, the limit resets with the next monthly cycle.

Enforcement is not instantaneous. The API Platform can process a small amount of extra usage while the limit state propagates, so recorded spend can slightly exceed the configured amount.

## Spend alerts

Use spend alerts to get notified before spend reaches a hard limit. Add alerts at thresholds that allow time to adjust usage, raise the limit, or investigate unexpected traffic.

## Restore API traffic

If requests fail because of a billing-related limit or credit balance:

1. Check `error.code` to identify whether the request reached an organization spend limit, project spend limit, or OpenAI-assigned usage limit, or whether the organization exhausted its prepaid credits.
2. For `organization_spend_limit_exceeded` or `project_spend_limit_exceeded`, compare [current usage](https://platform.openai.com/settings/organization/usage) with your spend limits. Raise or remove the reached limit if traffic should resume before the monthly reset.
3. For `organization_usage_limit_exceeded`, request a higher [approved usage limit](https://platform.openai.com/settings/organization/limits).
4. For `credit_balance_exhausted`, [add credits](https://platform.openai.com/settings/organization/billing).
5. If the error reports a request or token rate limit, follow the [rate limit guide](https://developers.openai.com/api/docs/guides/rate-limits).