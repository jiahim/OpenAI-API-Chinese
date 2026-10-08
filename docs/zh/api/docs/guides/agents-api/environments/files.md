# Files and artifacts

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

## 文件和已发布的制品

文件存放在 智能体 的环境中。制品是来自 OpenAI 托管环境的文件已发布副本。环境过期后，你可以下载该副本。

| 环境     | 如何检索文件                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `self_hosted`   | 使用你提供商的 API 或挂载的文件系统。                                                                       |
| `openai_hosted` | 对位于以下路径的文件使用 session Artifacts API `/workspace/outputs`.                                                       |
| `none`          | 没有环境文件系统。从 [session items](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items). |

## 上传文件

对于 OpenAI 托管环境，请在创建会话时提供输入文件。 `environment.files` 在每个文件的目标位置下选择 `/workspace`.

使用 `type: "file_id"` 配合一个 `file_id` 来自 [Files API](https://developers.openai.com/api/reference/resources/files/methods/create)，或者 `type: "inline"` 配合 base64 编码的 `data`。两种形式都需要一个 `path`.

如需在环境连接后添加文件，请使用 [environment Files API](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/environments/subresources/files/methods/create).

### 解决上传错误

在创建会话或附加文件期间进行文件检查时，可能返回 HTTP 429 错误以及
`files_api_rate_limit_exceeded`。请参阅 [Files API 速率限制](https://developers.openai.com/api/docs/guides/agents-api/errors#files-api-rate-limits)
了解响应和恢复步骤。

对于 HTTP 400，使用 `error.param` 以及 `error.message` 来标识需要修正的输入。
例如，目标位于 `/workspace` 返回结果：

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "invalid_request_error",
    "message": "path must be an absolute POSIX path inside /workspace",
    "param": "path"
  }
}
```

参数遵循请求结构。这里， `i` 是文件的索引，
从 `0` 开始计为第一个文件：

| Request                                    | Example `error.param`        |
| ------------------------------------------ | ---------------------------- |
| 添加一个环境文件                   | `path`, `data`，或 `file_id` |
| 创建会话或预热环境 | `environment.files[i].data`  |
| 创建或更新环境模板   | `files[i].data`              |

使用有效的 base64 数据和文件 ID，并选择以下绝对路径 `/workspace`.
查看 [文件限制](#file-limits)。跨越符号链接、
已存在或路径组件过长的目标会返回 HTTP 400。

安装文件时出现意外错误会返回 HTTP 500。
在重试之前，请检查目标是否已创建，然后遵循
[重试指南](https://developers.openai.com/api/docs/guides/agents-api/errors#retry-transient-failures).

## 检索你的文件




### 来自你自己的环境

让 智能体 将其输出写入已知路径。在回合完成后，通过你的提供商或基础设施检索该文件。在环境过期或你将其删除之前，将其保存到你的应用存储中。

来自自托管环境的文件不会通过 Artifacts API 发布，包括位于 `/workspace/outputs`。请参阅 [Sandbox providers](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers) 中的文件，以获取特定于提供商的文件访问方式。








### 在 OpenAI 托管的环境中

让 智能体 将文件保存到 `/workspace/outputs`，例如 `/workspace/outputs/report.pdf`。当回合完成时，OpenAI 会将输出作为不可变制品发布。

将你的 API 客户端、会话 ID、已完成的回合 ID、制品路径和本地目标路径传递给此函数。它会列出制品并下载同时匹配该回合和路径的文件：

查找并下载制品

```python
# Pass the saved session ID, completed turn ID, artifact path, and local destination.
def download_artifact(client, session_id, turn_id, path, destination):
    for artifact in client.beta.agents.sessions.artifacts.list(session_id):
        if artifact.turn_id != turn_id or artifact.path != path:
            continue
        with client.beta.agents.sessions.artifacts.with_streaming_response.content(
            artifact.id, session_id=session_id
        ) as response:
            response.stream_to_file(destination)
        return
    raise FileNotFoundError(f"No artifact for {path!r} in turn {turn_id}")
```





请参阅 [列出制品](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/list), [检索元数据](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/retrieve)，以及 [下载内容](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/content) 参考中关于请求和响应字段的说明。

### 下载多个文件

API 每次请求只下载一个制品，不提供批量下载
接口。若要下载多个文件，请列出制品并分别请求每个文件的
`content`。如果只需下载单个文件，可以让 智能体 将结果打包成 ZIP
文件，保存到 `/workspace/outputs`，然后将该归档作为一个制品下载。

## 文件生命周期

已发布的制品会在环境到期后仍然存在。请在删除会话前下载需要保留的内容。

无法通过该 API 上传或编辑制品。若要发布新版本，请让 智能体 更新文件并完成一轮新的对话。可使用轮次 ID 和路径来区分不同版本。




[删除制品](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/delete) 当你不再需要已发布的副本时可执行该操作。删除操作不会影响环境中保留的文件。

## 文件限制

| 文件操作                         | 限制                                            |
| -------------------------------------- | ------------------------------------------------ |
| 创建会话时包含的文件 | 每个请求 50 个文件。                            |
| 内联上传                          | 每个文件 5 MiB，在 base64 编码前测量。 |
| 单个创建请求中的内联上传 | 总计 10 MiB，在 base64 编码前测量。   |
| 从 Files API 复制的文件         | 每个文件 50 MiB。                                 |
| 已发布的制品                     | 每个文件 200 MiB。                                |
| 同时发布的输出             | 总计 500 MiB。                                   |