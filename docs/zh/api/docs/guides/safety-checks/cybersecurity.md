# 网络安全检查

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。通过附加 `.md` 到页面 URL，可获取文档页面的 Markdown 版本。

根据我们的 [预备框架](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf)，GPT-5.3-Codex 及更新模型（包括 GPT-5.4 和 GPT-5.5）被归类为具有高网络安全能力。因此，当这些模型通过 API 使用时，将适用额外的自动化防护措施。请注意，API 中应用的防护措施与 Codex 中使用的有所不同。你可以了解更多关于 Codex 防护措施的信息， [此处](https://developers.openai.com/codex/cyber-safety/).

这些防护措施会监控潜在可疑网络安全活动的信号。如果达到特定阈值，在审查活动期间，对模型的访问可能会被暂时限制。由于这些系统仍在校准中，合法的安全研究或防御性工作有时可能会被误标记。我们预计只有一小部分流量会受到影响，并且我们正在继续优化整体的 API 体验。

## 授权访问与智能体工作流

[Trusted Access for Cyber](https://developers.openai.com/codex/cyber-safety#trusted-access-for-cyber) 是一个
审查后的访问计划，而非模型名称。对 Daybreak Blue
的审批仅适用于授权个人或服务、工作区或 API 组织
和项目、模型及产品表面。Daybreak Red 需要另行
审批和配置；提交申请、验证身份或获得
Daybreak Blue 访问权限并不授予专家模型访问权限。

对于经批准的 API 项目， `gpt-daybreak-blue-latest` 解析为 `gpt-5.6-sol`,
和 `gpt-daybreak-red-latest` 解析为 `gpt-5.6-cyber`。使用 Daybreak
别名，或者如果你的项目获得必要审批，也可使用对应的
底层模型 ID。访问权限和模型行为取决于经批准的
组织和项目；仅凭模型 ID 本身并不授予访问权限。

Trusted Access 不会自动授予零数据保留。请确认任何
经单独审批的保留控制，对应确切的 API 组织和
适用的端点。

Trusted Access 管理经批准的模型访问权限；它不会配置你的工具、
环境或参与范围。

如果 Responses API 或 Agents SDK 工作流 可能执行敏感的网络安全
操作，在批准范围内审查每个提议的工具调用，然后再
执行。拒绝未经授权的操作，暂停不明确或高风险变更以待
人工批准，强制独立的文件系统和网络边界，保留
审计日志，并在审查不可用时默认拒绝。参见
[护栏与人工审查](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals#review-cybersecurity-actions-before-execution).

应用程序级别的工具审查和 Codex 产品端沙箱隔离是独立的
于本页描述的 API 网络安全保障措施。

## 面向非 ZDR 组织的安全保护操作

如果我们的系统检测到你的流量中存在超过设定阈值的可疑网络安全活动，对这些模型的访问权限可能会被临时撤销。在这种情况下，API 请求将返回一个包含错误代码的错误。 `cyber_policy`.

如果你的组织尚未为每个用户实施 [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)，访问权限可能会被临时撤销，影响范围 **是整个组织**。如果你的组织为每位最终用户提供了唯一的 [safety_identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，访问权限可能会被临时撤销，影响范围仅为 **受影响的特定用户** ，而非整个组织（经人工审查和警告后）。提供安全标识符有助于最大程度地减少对你平台上其他用户的干扰。

## ZDR 组织的安全保障操作

此过程与 [非零数据保留（ZDR）](https://developers.openai.com/api/docs/guides/your-data/#data-retention-controls-for-abuse-monitoring) 组织大体相似，如上所述；然而，对于使用 ZDR 的组织，还会额外应用请求级缓解措施。

如果请求被分类为可能可疑，你可能会收到带有错误代码的 API 错误 `cyber_policy`。对于流式请求，这些错误可能会在其他流式事件中返回。

与非 ZDR 组织一样，如果达到可疑网络活动的某些阈值，访问可能会受到限制，针对特定的 safety_identifier 或整个组织。

## 申诉

如果你认为你的访问被错误限制，并且需要在7天期限结束前恢复访问，请 [联系支持](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).