# 在 Responses API 中使用 Daybreak

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

使用 `access_programs.cyber` 来为 Responses API 请求选择网络安全访问计划。 [Daybreak Blue 和 Daybreak Red 计划](https://help.openai.com/en/articles/20001258-trusted-access-for-cyber) 为网络安全工作提供已批准的访问。其他 [API 网络安全保护措施](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity) 继续适用。

在使用 Daybreak 之前，请完成 [组织批准和项目设置](https://help.openai.com/en/articles/20001261-enterprise-daybreak-onboarding)。你的项目需要同时获得该计划和模型的访问权限。请使用该项目下的 API 密钥发起请求。请求参数仅在你已批准的访问范围内选择行为，并不会授予额外的访问权限。

## 选择模型和访问计划

该 `model` 字段用于选择模型。该 `access_programs.cyber` 字段用于为该请求选择支持的使用项目： `standard`, `daybreak_blue`，或 `daybreak_red`.




| 模型选项                             | 模型 ID                       | 访问计划  | 使用场景                                                                                                                   |
| ---------------------------------------- | ------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 具有标准护栏的主流模型  | `gpt-6-sol`                    | `standard`      | 具有标准护栏的通用或安全任务，即使你拥有 Daybreak 访问权限也可使用。                                 |
| 带有 Daybreak Blue 的主流模型        | `gpt-6-sol`                    | `daybreak_blue` | 使用特定主流模型的已批准防御性安全工作。                                                              |
| GPT-6.1 Sol 或 GPT-6 Astra 搭配 Daybreak | `gpt-6.1-sol` 或 `gpt-6-astra` | `daybreak_blue` | 使用任一模型均可降低拒答率。需要你的组织获得 Daybreak Red 批准，并在你的项目中启用相应访问权限。 |
| 搭配 Daybreak Red 的网络空间模型            | `gpt-5.6-cyber`                | `daybreak_red`  | 使用特定网络空间模型进行的高级、已获授权的安全工作。需要获得 Daybreak Red 批准。                               |




将请求值与模型匹配，而不是与组织的审批级别匹配。例如，在使用 `gpt-6-sol` 搭配 Daybreak 时，请发送 `daybreak_blue` ，即使你的组织已获得 Daybreak Red 审批。使用此模型发送 `daybreak_red` 会返回 `invalid_access_program`.

减少对 `gpt-6-astra` 和 `gpt-6.1-sol` 需要 Daybreak Red
  访问权限，但请求值为 `daybreak_blue`。两个模型都会拒绝
  `daybreak_red`。仅凭 Daybreak Blue 审批无法授权对任一模型的减少
  拒绝。你的项目还必须启用所需的访问权限。
  已启用。

## 发送请求

要开始使用 Daybreak Blue 审批，请显式选择 `daybreak_blue` 与一个具备 Daybreak 资格的模型，例如 `gpt-6-sol`:

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


如果你的组织已获得 Daybreak Red 审批并且你的项目已启用相应权限，你也可以使用 `gpt-6.1-sol`。请求仍然会选择 `daybreak_blue`:

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6.1-sol",
    "input": "Explain how to validate a security patch in a test environment.",
    "access_programs": {
      "cyber": "daybreak_blue"
    }
  }'
```


两者 `access_programs` 和 `cyber` 都是可选的，但两者都不接受 `null` 在请求中。一个空的 `access_programs` 对象将保留未指定的选择。

## 了解省略时的默认值

如果省略 `access_programs.cyber`,API 会根据模型以及你的组织和项目访问权限选择一个兼容的程序：

- **主线模型，例如 `gpt-6-sol`:** 当你的组织和项目拥有所需访问权限时启用 Daybreak Blue 防护；否则使用标准防护措施。
- **Red 模型，例如 `gpt-5.6-cyber`:** 该 API 会选择 `daybreak_red`。如果缺少所需访问权限，请求将失败。
- **`gpt-6-astra` ，以及 `gpt-6.1-sol`:** 为已为其项目启用 Daybreak Red 访问权限的合格调用方提供更宽松的拒绝策略；否则使用标准防护措施。

模型权限仍然适用。若要在兼容模型上显式请求标准安全措施，请发送 `standard`。如果显式选择的 Daybreak 与模型不兼容，或你没有所需的访问权限，则该选择会失败。

## 检查响应

在可用时， `access_programs.cyber` 记录所选程序。以下部分响应显示了针对该请求的 Daybreak Blue `gpt-6.1-sol` 结果：

```json
{
  "model": "gpt-6.1-sol",
  "access_programs": {
    "cyber": "daybreak_blue"
  }
}
```


当未指定程序且请求使用标准安全防护时， `access_programs` 为 `null`。对于别名，请检查 `-latest` 以查看哪个模型处理了该请求。别名解析可能会发生变化，并取决于你已获批的访问权限。 `model` 以查看哪个模型处理了该请求。别名解析可能会发生变化，并取决于你已获批的访问权限。

## 处理错误

| HTTP 状态码和错误码             | 处理方式                                                                                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 invalid_access_program`     | 所选模型需要不同的 program 值。请将 `access_programs.cyber` 改为错误中指明的值后重试。                                                                                                                            |
| `400 unsupported_access_program` | 切换到支持 Daybreak 的模型，或将 `access_programs.cyber` 设为 `standard` 以继续使用此模型并采用标准安全防护。                                                                                                                     |
| `403 access_program_not_enabled` | 检查你的 API 密钥所属的项目是否启用了所需的 program。如果缺少组织审批，请申请错误中指明的 Daybreak 级别。如果缺少项目访问权限，请联系组织管理员启用该 program。 |

未知字段、无效值以及请求端的 `null` 值会校验失败。模型权限会单独检查。所选的 Daybreak 程序并不保证所有安全检查或提示都能成功。如需更多帮助，请参阅 [Daybreak troubleshooting](https://help.openai.com/en/articles/20001259).