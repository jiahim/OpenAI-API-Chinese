# Spend limits

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

使用支出提醒来跟踪每月 API 成本。若要在已追踪支出达到配置金额后停止流量，请为你的组织或单个项目强制执行硬性支出上限。

硬性支出上限可能会中断生产流量。当已追踪支出达到
  相应的硬性上限时，受影响的 API 请求会返回 `429` 一个包含以下字段的
  `organization_spend_limit_exceeded` 或 `project_spend_limit_exceeded` 错误码的响应。
  强制执行并非瞬时完成，因此实际记录的支出可能会略高于
  配置金额。

## 选择支出控制项

支出提醒和硬性支出限额具有不同的作用：

| 控制          | 达到配置的额度时会发生什么       | 适用场景                       |
| ---------------- | ------------------------------------------- | --------------------------------------------- |
| 支出提醒      | 发送通知；API 流量继续运行 | 跟踪支出而不中断流量      |
| 硬性支出上限 | 受影响的 API 请求返回 `429` 错误  | 强制执行组织或项目的月度上限 |

支出提醒不会强制设定上限。即便你添加了硬性支出上限，它们依然保持激活状态，因此你可以借助提醒在硬性上限中断流量之前收到通知。

OpenAI 还会根据你的使用层级为你的组织分配一个已审批的月度 [用量上限](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers). 该 OpenAI 审批的用量上限与你配置的支出上限是相互独立的。

## 配置消费上限

你需要相应组织或项目的设置管理权限。详情请参阅 [API Platform permissions](https://developers.openai.com/api/docs/guides/rbac).



Organization


1. 前往 [Organization limits](https://platform.openai.com/settings/organization/limits).
2. 在 **Spend**，中，选择 **Edit spend limit**.
3. 输入 **Monthly spend limit**.
4. 若要在组织达到限额后使 API 响应失败，请开启 **Enforce a hard limit**.
5. 选择 **Save**.

  

  

    
Project


1. 前往 [Project settings](https://platform.openai.com/settings/).
2. 选择 **Limits**.
3. 在 **Spend**，中，选择 **Edit spend limit**.
4. 输入 **Monthly spend limit**.
5. 若要在项目达到限额后使 API 响应失败，请启用 **Enforce a hard limit**.
6. 选择 **Save**.



## 理解硬性上限行为

组织和项目硬上限都可能作用于同一请求：

- 组织硬性上限适用于该组织内所有项目的 API 流量。
- 项目硬性上限仅适用于由该项目计费的 API 流量。
- 达到组织硬性上限时会返回带有 `429` 错误代码的 `organization_spend_limit_exceeded` 响应。
- 达到项目硬性上限时会返回 `429` 错误代码的 `project_spend_limit_exceeded` 响应。
- 提高或解除已达到的限值后，流量会在更新生效后恢复。否则，该限值将在下一个月度周期重置。

强制执行并非瞬时生效。API 平台在限额状态传播期间可以处理少量额外的用量，因此记录的支出可能会略微超过配置的值。

## Spend alerts

使用消费告警，在消费接近硬上限前收到通知。在阈值处添加告警，以便留出时间调整用量、提高上限或排查异常流量。

## 恢复 API 流量

如果请求因与计费相关的限制或信用余额而失败：

1. 检查 `error.code` 以识别该请求是否达到了组织支出上限、项目支出上限或 OpenAI 分配的用量上限，以及组织是否已用尽其预付信用额度。
2. 对于 `organization_spend_limit_exceeded` 或 `project_spend_limit_exceeded`，请比较 [当前用量](https://platform.openai.com/settings/organization/usage) 与你的支出上限。如果希望在月度重置之前恢复流量，请调高或移除已达成的上限。
3. 对于 `organization_usage_limit_exceeded`，请申请更高的 [已批准用量上限](https://platform.openai.com/settings/organization/limits).
4. 对于 `credit_balance_exhausted`, [充值信用额度](https://platform.openai.com/settings/organization/billing).
5. 如果错误报告请求或令牌速率限制，请参阅 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).