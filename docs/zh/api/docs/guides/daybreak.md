# 在 Responses API 中使用 Daybreak

> 完整的文档索引请参见 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 可获取文档页面的 Markdown 版本。

使用 `access_programs.cyber` 为 Responses API 请求选择网络安全访问计划。 [Daybreak Blue 和 Daybreak Red 计划](https://help.openai.com/en/articles/20001258-trusted-access-for-cyber) 为网络安全工作提供已批准访问。其他 [API 网络安全防护措施](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity) 继续适用。

在使用 Daybreak 之前，请完成 [组织审批和项目设置](https://help.openai.com/en/articles/20001261-enterprise-daybreak-onboarding)。你的项目需要同时获得该计划和模型的访问权限，并使用该项目下的 API 密钥。请求参数用于在已批准的访问范围内选择行为，它本身并不授予访问权限。

## 选择模型和访问计划

该 `model` 字段用于选择模型。该 `access_programs.cyber` 字段用于为该请求选择受支持的访问方案： `standard`, `daybreak_blue`，或 `daybreak_red`.

| Model                                   | Set `model` to             | Set `access_programs.cyber` to | When to use                                                                                                                  |
| --------------------------------------- | -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Mainline model with standard safeguards | `gpt-6-sol`                | `standard`                     | General-purpose or security tasks with standard safeguards, even if you have Daybreak access.                                |
| Mainline model with Daybreak Blue       | `gpt-6-sol`                | `daybreak_blue`                | Approved defensive security work with a specific mainline model.                                                             |
| Cyber model with Daybreak Red           | `gpt-5.6-cyber`            | `daybreak_red`                 | Advanced, authorized security work with a specific cyber model. Requires Daybreak Red approval.                              |
| Daybreak Blue alias                     | `gpt-daybreak-blue-latest` | `daybreak_blue`                | Approved defensive security work that follows updates to the Blue alias's underlying model.                                  |
| Daybreak Red alias                      | `gpt-daybreak-red-latest`  | `daybreak_red`                 | Advanced, authorized security work that follows updates to the Red alias's underlying model. Requires Daybreak Red approval. |

将请求值与模型匹配，而不是与组织的审批级别匹配。例如，在使用 `gpt-6-sol` 与 Daybreak 时，请发送 `daybreak_blue` ，即使你的组织拥有 Daybreak Red 审批。发送 `daybreak_red` 与此模型时返回 `invalid_access_program`.

Daybreak 别名仅接受与其匹配的程序。例如，请求 `gpt-daybreak-blue-latest` 与 `daybreak_red` 时会返回错误。

对 `gpt-6-astra` 降低拒绝需要 Daybreak Red 访问权限，但请求
  值为 `daybreak_blue`。此模型拒绝 `daybreak_red`。仅凭 Daybreak Blue
  审批并不授权在此模型上降低拒绝率。你的项目
  还必须启用所需的访问权限。

## 发送请求

此示例显式选择 Daybreak Blue，使用 `gpt-6-sol`:

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-sol",
    "input": "Explain how to validate a security patch in a test environment.",
    "access_programs": {
      "cyber": "daybreak_blue"
    }
  }'
```


两者 `access_programs` 和 `cyber` 都是可选的，但都不接受 `null` 出现在请求中。空的 `access_programs` 对象则不指定具体选择。

## 了解省略时的默认值

如果省略 `access_programs.cyber`,API 会根据模型以及你的组织和项目访问权限选择兼容的程序：

- **主线模型，例如 `gpt-6-sol`:** Daybreak Blue 处理方式，前提是你的组织和项目拥有所需访问权限；否则使用标准防护措施。
- **Daybreak 别名与 Red 模型：** 匹配的 Daybreak 程序。例如， `gpt-daybreak-blue-latest` 选择 `daybreak_blue`。如果缺少所需访问权限，请求将失败。
- **`gpt-6-astra`:** 为在其项目中启用了 Daybreak Red 访问权限的合格调用方减少拒答；否则使用标准防护措施。

模型权限仍然适用。若要在兼容的模型上明确请求标准安全防护措施，请发送 `standard`。如果明确的 Daybreak 选择与模型不兼容，或你没有所需的访问权限，则会失败。

## 查看响应

在可用时， `access_programs.cyber` 会记录所选程序。此部分响应显示 Daybreak Blue：

```json
{
  "model": "gpt-6-sol",
  "access_programs": {
    "cyber": "daybreak_blue"
  }
}
```


当未指定程序且请求使用标准安全防护时， `access_programs` 为 `null`。对于 `-latest` 别名，请查看 `model` 以了解哪个模型处理了此次请求。别名解析可能会发生变化，并取决于你已获批的访问权限。

## 处理错误

| HTTP 状态码和代码             | 处理方式                                                                                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 invalid_access_program`     | 所选模型需要不同的 program 值。更改 `access_programs.cyber` 为错误中指定的值，然后重试。                                                                                                                            |
| `400 unsupported_access_program` | 切换到支持 Daybreak 的模型，或设置 `access_programs.cyber` to `standard` 以继续使用该模型并启用标准安全措施。                                                                                                                     |
| `403 access_program_not_enabled` | 检查你的 API 密钥是否属于已启用所需 program 的项目。如果缺少组织审批，请申请错误中指定的 Daybreak 级别。如果缺少项目访问权限，请联系你的组织管理员启用该 program。 |

未知字段、无效值和请求端的 `null` 值会无法通过验证。模型权限会单独进行检查。所选的 Daybreak 流程并不保证每个安全检查或提示都会成功。如需更多帮助，请参阅 [Daybreak 故障排除](https://help.openai.com/en/articles/20001259).