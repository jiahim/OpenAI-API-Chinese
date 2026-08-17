# Cybersecurity checks

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

GPT-5.3-Codex and newer models, including GPT-5.4 and GPT-5.5, are classified as having High Cybersecurity Capability under our [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf). As a result, additional automated safeguards apply when these models are used via the API. Please note that the safeguards applied in the API differ from those used in Codex. You can learn more about the Codex safeguards [here](https://developers.openai.com/codex/cyber-safety/).

These safeguards monitor for signals of potentially suspicious cybersecurity activity. If certain thresholds are met, access to the model may be temporarily limited while activity is reviewed. Because these systems are still being calibrated, legitimate security research or defensive work may occasionally be flagged. We expect only a small portion of traffic to be impacted, and we’re continuing to refine the overall API experience.

## Authorized access and agentic workflows

[Trusted Access for Cyber](https://developers.openai.com/codex/cyber-safety#trusted-access-for-cyber) is a
reviewed access program, not the name of a model. Approval for Daybreak Blue
applies only to the authorized person or service, workspace or API organization
and project, model, and product surface. Daybreak Red requires separate
approval and provisioning; applying, verifying an identity, or receiving
Daybreak Blue access doesn't grant specialist-model access.

For approved API projects, `gpt-daybreak-blue-latest` resolves to `gpt-5.6-sol`,
and `gpt-daybreak-red-latest` resolves to `gpt-5.6-cyber`. Use the Daybreak
alias or, if your project has the required approval, the corresponding
underlying model ID. Access and model behavior depend on the approved
organization and project; the model ID alone doesn't grant access.

Trusted Access doesn't automatically grant Zero Data Retention. Confirm any
separately approved retention controls for the exact API organization and
applicable endpoint.

Trusted Access governs approved model access; it doesn't configure your tools,
environment, or engagement scope.

If a Responses API or Agents SDK workflow can take sensitive cybersecurity
actions, review each proposed tool call against the approved scope before
execution. Deny unauthorized actions, pause ambiguous or high-risk changes for
human approval, enforce independent filesystem and network boundaries, keep
audit logs, and fail closed when review is unavailable. See
[Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals#review-cybersecurity-actions-before-execution).

Application-level tool review and Codex product-side sandboxing are separate
from the API cybersecurity safeguards described on this page.

## Safeguard actions for non-ZDR Organizations

If our systems detect potentially suspicious cybersecurity activity within your traffic that exceeds defined thresholds, access to these models may be temporarily revoked. In this case, API requests will return an error with the error code `cyber_policy`.

If your organization has not implemented a per-user [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers), access may be temporarily revoked for the **entire organization**. If your organization provides a unique [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) per end user, access may be temporarily revoked for the **specific affected user** rather than the entire organization (after human review and warnings). Providing safety identifiers helps minimize disruption to other users on your platform.

## Safeguard actions for ZDR Organizations

The process is largely similar for [non-Zero Data Retention (ZDR)](https://developers.openai.com/api/docs/guides/your-data/#data-retention-controls-for-abuse-monitoring) organizations as described above; however, for organizations using ZDR, request-level mitigations are additionally applied.

If a request is classified as potentially suspicious you may receive an API error with the error code `cyber_policy`. For streaming requests, these errors may be returned in the midst of other streaming events.

As with non-ZDR organizations, if certain thresholds of suspicious cyber activity are met, access may be limited for the specific safety_identifier or for the whole organization.

## Appeals

If you believe your access has been incorrectly limited and need it restored before the 7-day period ends, please [contact support](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).