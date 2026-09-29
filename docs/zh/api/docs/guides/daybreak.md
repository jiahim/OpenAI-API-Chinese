# 在 Responses API 中使用 Daybreak

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

使用 `access_programs.cyber` 为 Responses API 请求选择网络安全访问计划。 [Daybreak Blue 和 Daybreak Red 计划](https://help.openai.com/en/articles/20001258-trusted-access-for-cyber) 提供已批准的网络安全工作访问权限。其他 [API 网络安全护栏](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity) 继续适用。

在使用 Daybreak 之前，请完成 [组织批准和项目设置](https://help.openai.com/en/articles/20001261-enterprise-daybreak-onboarding)。你的项目需要同时获得该计划和模型的访问权限。使用该项目下的 API 密钥。该请求参数仅在你已批准的访问范围内选择行为；它不会授予访问权限。

## 选择模型和访问计划

该 `model` 字段用于选择模型。 `access_programs.cyber` 字段用于为该请求选择一个受支持的访问计划： `standard`, `daybreak_blue`，或 `daybreak_red`.

| 模型                                    | 设置 `model` 为                 | 设置 `access_programs.cyber` 为 | 使用场景                                                                                                                   |
| ---------------------------------------- | ------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 配备标准防护的主流模型  | `gpt-6-sol`                    | `standard`                     | 通用任务或安全任务，使用标准防护，即使你拥有 Daybreak 访问权限也是如此。                                 |
| 搭载 Daybreak Blue 的主流模型        | `gpt-6-sol`                    | `daybreak_blue`                | 针对特定主流模型、经批准开展的防御性安全工作。                                                              |
| 搭载 Daybreak 的 GPT-6.1 Sol 或 GPT-6 Astra | `gpt-6.1-sol` 或 `gpt-6-astra` | `daybreak_blue`                | 使用任一模型降低拒答率。需要你的组织获得 Daybreak Red 批准，并为你的项目启用相应访问权限。 |
| 搭载 Daybreak Red 的网络空间安全模型            | `gpt-5.6-cyber`                | `daybreak_red`                 | 针对特定网络空间安全模型开展的高级、授权安全工作。需要获得 Daybreak Red 批准。                               |
| Daybreak Blue 别名                      | `gpt-daybreak-blue-latest`     | `daybreak_blue`                | 随着 Blue 别名底层模型的更新而进行的、经批准开展的防御性安全工作。                                   |
| Daybreak Red 别名                       | `gpt-daybreak-red-latest`      | `daybreak_red`                 | 随着 Red 别名底层模型的更新而开展的高级、授权安全工作。需要获得 Daybreak Red 批准。  |

将请求值与模型匹配，而不是与你所在组织的审批级别匹配。例如，在使用 `gpt-6-sol` 与 Daybreak 一起时，发送 `daybreak_blue` 即使你的组织拥有 Daybreak Red 审批。发送 `daybreak_red` 与该模型一起使用会返回 `invalid_access_program`.

Daybreak 别名仅接受其匹配的项目。例如，请求 `gpt-daybreak-blue-latest` 与 `daybreak_red` 会返回错误。

对 `gpt-6-astra` 和 `gpt-6.1-sol` 降低拒绝率需要 Daybreak Red
  访问权限，但请求值为 `daybreak_blue`。两个模型都会拒绝
  `daybreak_red`。仅有 Daybreak Blue 审批并不授权对任一模型降低
  拒绝率。你的项目还必须启用所需的访问
  权限。

## 发送请求

若要开始使用 Daybreak Blue 审批，需显式选择 `daybreak_blue` 配合 `gpt-daybreak-blue-latest` 别名：

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


如果你的组织已获得 Daybreak Red 审批并且你的项目已启用相应访问权限，你也可以使用 `gpt-6.1-sol`。请求仍然会选择 `daybreak_blue`:

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


两者 `access_programs` 和 `cyber` 都是可选的，但都不接受 `null` 出现在请求中。为空的 `access_programs` 对象则表示未指定选择。

## 了解省略时的默认值

如果省略 `access_programs.cyber`, API 会根据模型以及你的组织和项目访问权限选择兼容的程序：

- **主流模型，例如 `gpt-6-sol`:** Daybreak Blue 处理方式，前提是你的组织和项目拥有所需的访问权限；否则使用标准防护措施。
- **Daybreak 别名和 Red 模型：** 对应的 Daybreak 程序。例如， `gpt-daybreak-blue-latest` 选择 `daybreak_blue`。如果缺少所需的访问权限，请求将失败。
- **`gpt-6-astra` 和 `gpt-6.1-sol`:** 为已为其项目启用 Daybreak Red 访问权限的合格调用者减少拒绝；否则使用标准防护措施。

模型权限仍然适用。若要在兼容的模型上显式请求标准安全措施，请发送 `standard`。如果显式的 Daybreak 选择与模型不兼容，或你没有所需的访问权限，则会失败。

## 检查响应

When available, `access_programs.cyber` records the selected program. This partial response shows Daybreak Blue for the `gpt-6.1-sol` request:

```json
{
  "model": "gpt-6.1-sol",
  "access_programs": {
    "cyber": "daybreak_blue"
  }
}
```


When no program is specified and the request uses standard safeguards, `access_programs` 是 `null`。若要查看哪个模型 `-latest` 处理了请求,请检查别名 `model` 。别名解析可能会发生变化,并且取决于你所获得的访问权限。

## 处理错误

| HTTP 状态码和错误码             | 处理方式                                                                                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 invalid_access_program`     | 所选模型需要不同的 program 值。请更改 `access_programs.cyber` 为错误信息中指定的值，然后重试。                                                                                                                            |
| `400 unsupported_access_program` | 切换到支持 Daybreak 的模型，或设置 `access_programs.cyber` 为 `standard` 以继续在标准安全策略下使用此模型。                                                                                                                     |
| `403 access_program_not_enabled` | 检查你的 API 密钥是否属于已启用所需 program 的项目。如果缺少组织审批，请申请错误信息中指定的 Daybreak 级别。如果缺少项目访问权限，请联系组织管理员启用该 program。 |

未知字段、无效值以及请求端的值无法通过校验。模型权限会单独检查。所选的 Daybreak 程序并不能保证每个安全检查或提示都会成功。如需更多帮助，请参阅 `null` 值无法通过校验。模型权限会单独检查。所选的 Daybreak 程序并不能保证每个安全检查或提示都会成功。如需更多帮助，请参阅 [Daybreak 故障排除](https://help.openai.com/en/articles/20001259).