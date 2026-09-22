# Cybersecurity checks

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

GPT-5.3-Codex 及更新的模型（包括 GPT-5.4 和 GPT-5.5）根据我们的 [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf)。被归类为具有高网络安全能力。因此，当这些模型通过 API 使用时，会应用额外的自动化护栏。请注意，API 中应用的护栏与 Codex 中使用的不同。你可以详细了解 Codex 护栏 [此处](https://developers.openai.com/codex/cyber-safety/).

这些护栏会监控潜在可疑网络安全活动的信号。如果达到某些阈值，模型的访问可能会在活动审查期间被临时限制。由于这些系统仍在校准，合法的安全研究或防御性工作偶尔可能会被标记。我们预计只有少量流量会受到影响，并将持续改进整体的 API 体验。

## 授权访问与智能体工作流

[可信访问（针对网络领域）](https://developers.openai.com/codex/cyber-safety#trusted-access-for-cyber) 是一个
已审核的访问项目，而不是某个模型的名称。Daybreak Blue 的
批准仅适用于被授权的人员或服务、工作区或 API 组织
以及项目、模型和产品界面。Daybreak Red 需要另行
审批和配置；申请、核验身份或获得
Daybreak Blue 访问权限并不会授予专家模型的访问权限。

对于已批准的 API 项目，请使用 Daybreak 别名或兼容的底层
模型 ID。别名解析可能会变化，取决于你的已批准访问权限。
参见 [在 Responses API 中使用 Daybreak](https://developers.openai.com/api/docs/guides/daybreak) 来选择
模型并 `access_programs.cyber` 值，了解默认值，并处理错误。
访问权限和模型行为取决于已批准的组织与项目；
仅有模型 ID 并不授予访问权限。

Trusted Access 不会自动授予 Zero Data Retention。请确认该API
组织和
适用端点的任何单独批准的留存控制。

Trusted Access 用于管理已批准的模型访问；它不会配置你的工具、
environment, or engagement scope.

If a Responses API or Agents SDK 工作流 can take sensitive cybersecurity
actions, review each proposed tool call against the approved scope before
execution. Deny unauthorized actions, pause ambiguous or high-risk changes for
human approval, enforce independent filesystem and network boundaries, keep
audit logs, and fail closed when review is unavailable. See
[护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals#review-cybersecurity-actions-before-execution).

Application-level tool review and Codex product-side sandboxing are separate
from the API cybersecurity safeguards described on this page.

## 非 ZDR 组织的保护操作

如果我们的系统在流量中检测到可能涉及可疑网络安全的行为，且超过预设阈值，使用这些模型的权限可能会被临时撤销。此时，API 请求将返回带有错误代码的错误。 `cyber_policy`.

如果你的组织尚未为每位用户实施 [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，则访问权限可能会被临时撤销，撤销范围涉及 **整个组织**。如果你的组织为每个用户提供唯一的 [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) （每个终端用户），则访问权限可能会被临时撤销，撤销范围仅涉及 **该特定受影响用户** ，而非整个组织（在人工审核和警告之后）。提供安全标识符有助于最大限度地减少对你平台上其他用户的干扰。

## ZDR 组织的安全保障操作

该流程对于 [非零数据保留 (ZDR)](https://developers.openai.com/api/docs/guides/your-data/#data-retention-controls-for-abuse-monitoring) 组织而言与上文基本一致；不过，对于使用 ZDR 的组织，还会额外应用请求级别的缓解措施。

如果请求被归类为可能存在可疑行为，你可能会收到一个 API 错误，错误代码为 `cyber_policy`。对于流式请求，这些错误可能会在其他流式事件过程中返回。

与非 ZDR 组织一样，如果达到某些可疑网络活动阈值，针对特定 safety_identifier 或整个组织的访问可能会受到限制。

## 申诉

如果你认为你的访问权限被错误地限制了，并且需要在 7 天期限结束前恢复访问，请 [联系客服](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).