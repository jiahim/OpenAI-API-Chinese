# 在 Responses API 中使用 Daybreak

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

使用 `access_programs.cyber` 为 Responses API 请求选择网络安全访问计划。 [Daybreak Blue 和 Daybreak Red 计划](https://help.openai.com/en/articles/20001258-trusted-access-for-cyber) 为网络安全工作提供已批准访问。其他 [API 网络安全防护](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity) 继续适用。

在使用 Daybreak 之前，请完成 [组织审批和项目设置](https://help.openai.com/en/articles/20001261-enterprise-daybreak-onboarding)。你的项目需要同时获得该计划和模型的访问权限。请使用来自该项目的 API 密钥。该请求参数用于在你已批准的访问范围内选择行为，并不会授予访问权限。

## 选择模型与访问计划

该 `model` 字段用于选择模型。 `access_programs.cyber` 字段用于为该请求选择受支持的访问计划： `standard`, `daybreak_blue`，或 `daybreak_red`.




| 模型选项                             | 模型 ID                       | 访问项目  | 适用场景                                                                                                                   |
| ---------------------------------------- | ------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 带标准防护的主流模型  | `gpt-6-sol`                    | `standard`      | 通用或安全任务，使用标准防护，即使你拥有 Daybreak 访问权限也适用。                                 |
| 带 Daybreak Blue 的主流模型        | `gpt-6-sol`                    | `daybreak_blue` | 使用特定主流模型的已批准防御性安全工作。                                                              |
| 带 Daybreak 的 GPT-6.1 Sol 或 GPT-6 Astra | `gpt-6.1-sol` 或 `gpt-6-astra` | `daybreak_blue` | 使用任一模型，降低拒答率。需要你的组织获得 Daybreak Red 批准，并为你的项目启用访问权限。 |
| 带 Daybreak Red 的网络安全模型            | `gpt-5.6-cyber`                | `daybreak_red`  | 使用特定网络安全模型的高级、已授权安全工作。需要 Daybreak Red 批准。                               |
| Daybreak Blue 别名                      | `gpt-daybreak-blue-latest`     | `daybreak_blue` | 已批准的防御性安全工作，跟随 Blue 别名底层模型的更新。                                   |
| Daybreak Red 别名                       | `gpt-daybreak-red-latest`      | `daybreak_red`  | 高级、已授权的安全工作，跟随 Red 别名底层模型的更新。需要 Daybreak Red 批准。  |




将请求值与模型匹配，而不是与你所在组织的审批级别匹配。例如，使用 `gpt-6-sol` 与 Daybreak 时，请发送 `daybreak_blue` ，即使你的组织已获得 Daybreak Red 审批。发送 `daybreak_red` 与此模型时返回 `invalid_access_program`.

Daybreak 别名只接受与其匹配的程序。例如，请求 `gpt-daybreak-blue-latest` 与 `daybreak_red` 时会返回错误。

降低 `gpt-6-astra` 和 `gpt-6.1-sol` 的拒绝率需要 Daybreak Red
  访问权限，但请求值为 `daybreak_blue`。两个模型都会拒绝
  `daybreak_red`。仅获得 Daybreak Blue 审批并不授权在任一模型上降低
  拒绝率。你的项目还必须启用所需的访问
  权限。

## 发送请求

要开始使用 Daybreak Blue 审批，请明确选择 `daybreak_blue` ，使用 `gpt-daybreak-blue-latest` 别名：

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-daybreak-blue-latest",
    "input": "Explain how to validate a security patch in a test environment.",
    "access_programs": {
      "cyber": "daybreak_blue"
    }
  }'
```


如果你的组织已获得 Daybreak Red 审批，并且你的项目已启用访问权限，你也可以使用 `gpt-6.1-sol`。请求仍然会选择 `daybreak_blue`:

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


两者 `access_programs` 和 `cyber` 都是可选的，但都不可接受 `null` 在请求中。一个空的 `access_programs` 对象表示未明确指定所选项。

## 了解省略时的默认值

如果省略 `access_programs.cyber`，API 会根据模型以及你的组织和项目访问权限选择兼容的程序：

- **主模型（如 `gpt-6-sol`:** 的 Daybreak Blue 处理（需当你的组织和项目具备所需访问权限时）；否则使用标准防护措施。
- **Daybreak 别名和 Red 模型：** 匹配的 Daybreak 程序。例如， `gpt-daybreak-blue-latest` 选择 `daybreak_blue`。如果缺少所需的访问权限，请求将失败。
- **`gpt-6-astra` 和 `gpt-6.1-sol`:** 为在其项目上启用了 Daybreak Red 访问权限的合格调用方降低拒绝率；否则使用标准防护措施。

模型权限仍然适用。若要在兼容模型上明确请求标准安全防护措施，请发送 `standard`。如果明确的 Daybreak 选择与模型不兼容，或者你没有所需的访问权限，则该选择会失败。

## 检查响应

在可用时， `access_programs.cyber` 会记录所选的程序。此部分响应显示了请求的 Daybreak Blue： `gpt-6.1-sol` request:

```json
{
  "model": "gpt-6.1-sol",
  "access_programs": {
    "cyber": "daybreak_blue"
  }
}
```


当未指定程序且请求使用标准护栏时， `access_programs` 为 `null`。对于 `-latest` 别名，请检查 `model` 以查看哪个模型处理了该请求。别名解析可能会发生变化，并且取决于你已获批的访问权限。

## 处理错误

| HTTP 状态码与错误码             | 处理方法                                                                                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 invalid_access_program`     | 所选模型需要不同的 program 值。请修改 `access_programs.cyber` 为错误中指定的值,然后重试。                                                                                                                            |
| `400 unsupported_access_program` | 切换到支持 Daybreak 的模型,或将 `access_programs.cyber` 设置为 `standard` 以继续在标准安全策略下使用此模型。                                                                                                                     |
| `403 access_program_not_enabled` | 检查你的 API key 是否属于已启用所需 program 的项目。如果缺少组织审批,请申请错误中指定的 Daybreak 级别。如果缺少项目访问权限,请联系你的组织管理员启用该 program。 |

未知字段、无效值以及请求端的值会校验失败。模型权限会单独检查。选定的 Daybreak 流程并不能保证每项安全检查或提示都会成功。如需更多帮助，请参阅 `null` 值会校验失败。模型权限会单独检查。选定的 Daybreak 流程并不能保证每项安全检查或提示都会成功。如需更多帮助，请参阅 [Daybreak troubleshooting](https://help.openai.com/en/articles/20001259).