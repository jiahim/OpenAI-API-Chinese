# 支出限额

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用支出警报来跟踪每月的API成本。若要在跟踪支出达到设定金额后停止流量，请为你的组织或单个项目强制实施硬性支出限制。

硬性支出限制可能会中断生产流量。当跟踪支出达到
  适用的硬性限制时，受影响的API请求将返回 `429` 错误，并带有
  `organization_spend_limit_exceeded` 或 `project_spend_limit_exceeded` 代码。
  限制执行并非即时生效，因此记录的支出可能会略超
  设定金额。

## 选择支出控制

支出提醒和硬性支出上限具有不同的效果：

| 控制          | 达到配置金额时会发生什么       | 在你想要以下情况时使用                       |
| ---------------- | ------------------------------------------- | --------------------------------------------- |
| 消费提醒      | 发送通知；API 流量继续 | 在不中断流量的情况下跟踪消费      |
| 硬性消费上限 | 受影响的 API 请求返回 `429` 错误  | 强制执行每月组织或项目上限 |

支出提醒并不强制执行上限。当你添加硬性支出限制时，提醒仍然有效，因此你可以在硬性限制中断流量之前使用提醒进行通知。

OpenAI 还会根据你的使用层级，为你的组织分配一个经批准的月度 [使用限制](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers)。这一OpenAI批准的使用限制与你配置的支出限制是分开的。

## 配置支出限额

你需要权限来管理适用的组织或项目设置。详情请参阅 [API 平台权限](https://developers.openai.com/api/docs/guides/rbac).



组织


1. 前往 [组织限制](https://platform.openai.com/settings/organization/limits).
2. 在 **支出**，中，选择 **编辑支出限制**.
3. 输入 **每月支出限制**.
4. 要使组织达到限制后 API 响应失败，开启 **强制实施硬限制**.
5. 选择 **保存**.

  

  

    
项目


1. 前往 [项目设置](https://platform.openai.com/settings/).
2. 选择 **限制**.
3. 在 **支出**，中，选择 **编辑支出限制**.
4. 输入 **每月支出限制**.
5. 要使项目达到限制后API响应失败，请开启 **强制硬限制**.
6. 选择 **保存**.



## 了解硬限制行为

组织和项目的硬性限制都可能适用于某个请求：

- 组织级硬性限制适用于该组织内所有项目的 API 流量。
- 项目级硬性限制仅适用于计入该项目的 API 流量。
- 达到组织级硬性限制会返回 `429` 错误，并带有 `organization_spend_limit_exceeded` 代码。
- 达到项目级硬性限制会返回 `429` 错误，并带有 `project_spend_limit_exceeded` 代码。
- 提高或移除已达的限制可在更新传播后允许流量恢复。否则，该限制将在下个月度周期重置。

执行并非即时生效。API 平台在限额状态传播期间可能处理少量额外用量，因此记录的支出可能略微超出配置的金额。

## 支出提醒

使用支出提醒，在支出达到硬性限额之前获取通知。在允许有时间调整用量、提高限额或调查异常流量的阈值处添加提醒。

## 恢复 API 流量

如果请求因计费相关限制或信用余额而失败：

1. 检查 `error.code` 以识别请求是否达到了组织支出限制、项目支出限制或OpenAI分配的使用限制，或组织是否用尽了预付额度。
2. 对于 `organization_spend_limit_exceeded` 或 `project_spend_limit_exceeded`，请比较 [当前使用量](https://platform.openai.com/settings/organization/usage) 与你的支出限制。如果流量应在每月重置前恢复，请提高或移除已达到的限制。
3. 对于 `organization_usage_limit_exceeded`，请申请更高的 [已批准的使用限制](https://platform.openai.com/settings/organization/limits).
4. 对于 `credit_balance_exhausted`, [添加额度](https://platform.openai.com/settings/organization/billing).
5. 如果错误报告请求或令牌速率限制，请遵循 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).