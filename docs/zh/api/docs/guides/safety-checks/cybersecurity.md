# 网络安全检查

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

GPT-5.3-Codex 及更新的模型（包括 GPT-5.4 和 GPT-5.5）依据我们的 [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf)。被归类为具有较高网络安全能力。因此，当这些模型通过 API 使用时，会启用额外的自动化防护措施。请注意，API 中启用的防护措施与 Codex 中的不同。你可以在此处进一步了解 Codex 的防护措施 [此处](https://developers.openai.com/codex/cyber-safety/).

这些防护措施会监测可能存在可疑网络安全活动的信号。如果达到特定阈值，模型访问权限可能会在活动复核期间被临时限制。由于这些系统仍在校准中，合法的安全研究或防御性工作偶尔可能被误判。我们预计仅会有少量流量受到影响，并将持续优化整体 API 使用体验。

## Authorized access and agentic workflows

[Trusted Access for Cyber](https://developers.openai.com/codex/cyber-safety#trusted-access-for-cyber) 是一项
经审核的访问计划，不是模型名称。Daybreak Blue
的批准仅适用于已授权的个人或服务、工作区或 API 组织
和项目、模型以及产品界面。Daybreak Red 需要单独的
审批和配置；申请、验证身份或获得
Daybreak Blue 访问权限并不授予专业模型访问权限。

对于已批准的 API 项目， `gpt-daybreak-blue-latest` 解析为 `gpt-5.6-sol`,
和 `gpt-daybreak-red-latest` 解析为 `gpt-5.6-cyber`。使用 Daybreak
别名，或者，如果你的项目已获得必要审批，则使用相应的
底层模型 ID。访问权限和模型行为取决于已审批的
组织和项目；仅有模型 ID 并不授予访问权限。

Trusted Access 不会自动授予 Zero Data Retention。请针对具体的 API 组织和
确认任何已单独审批的保留控制设置，针对相应的 接口 组织和
适用的端点。

Trusted Access 管理已审批的模型访问；它不会配置你的工具、
环境或交互范围。

如果 Responses API 或 Agents SDK 工作流 可能涉及敏感的网络安全
在执行前，逐一审查每个提议的工具调用是否在已批准的范围内，
拒绝未授权的操作，将模糊或高风险的更改暂停以等待人工批准，强制执行独立的文件系统和网络边界，
保留审计日志，并在无法审查时默认拒绝。参见
护栏与人工审查
[护栏与人工审查](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals#review-cybersecurity-actions-before-execution).

应用层工具审查与 Codex 产品端沙箱与本页所描述的
API 网络安全防护措施是相互独立的。

## 非 ZDR 组织的保障操作

如果我们的系统在流量中检测到超过定义阈值的可疑网络安全活动，可能会临时撤销对这些模型的访问权限。在这种情况下，API 请求将返回带有错误代码的报错 `cyber_policy`.

如果你的组织尚未实施针对每个用户的 [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，则可能会临时撤销对 **整个组织**。的访问权限。如果你的组织提供了唯一的 [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，针对每个最终用户，可能会临时撤销对 **特定受影响用户** 的访问权限，而不是整个组织（经过人工审核和警告后）。提供安全标识符有助于最大程度地减少对平台上其他用户的干扰。

## ZDR 组织的护栏操作

该过程与上述 [非零数据保留 (ZDR) 组织）](https://developers.openai.com/api/docs/guides/your-data/#data-retention-controls-for-abuse-monitoring) 的情况大体类似；不过，对于使用 ZDR 的组织，会额外地应用请求级别的缓解措施。

如果某个请求被归类为可能存在可疑行为，你可能会收到一个 API 错误，其错误代码为 `cyber_policy`。对于流式请求，这些错误可能会在其它流式事件之间返回。

与非 ZDR 组织一样，如果达到某些可疑网络活动阈值，该特定 safety_identifier 或整个组织的访问可能会受到限制。

## Appeals

如果你认为你的访问权限被错误地限制了，并需要在 7 天期限结束前恢复，请 [联系客服](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).