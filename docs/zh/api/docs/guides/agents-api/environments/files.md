# 文件与制品

> 如需完整的文档索引,请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得文档页面的 Markdown 版本。

## 文件和已发布的制品

文件存放在智能体的环境中。制品是该环境中某个文件从 OpenAI 托管环境发布的副本。你可以在环境过期后下载该副本。

| 环境     | 如何检索文件                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `self_hosted`   | 使用你所在提供方的文件 API 或挂载的文件系统。                                                                       |
| `openai_hosted` | 使用会话 Artifacts API 处理以下路径下的文件： `/workspace/outputs`.                                                       |
| `none`          | 无可用的环境文件系统。从以下位置读取输出： [会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items). |

## 上传文件

对于 OpenAI 托管的环境，在 `environment.files` 创建会话时提供输入文件，在 `/workspace`.

中 `type: "file_id"` 为每个文件选择目标位置，可使用 `file_id` 来自 [Files API](https://developers.openai.com/api/reference/resources/files/methods/create)，或 `type: "inline"` 采用 base64 编码的 `data`。两种形式都需要一个 `path`.

若要在环境连接后添加文件，请使用 [environment Files API](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/environments/subresources/files/methods/create).

### 解决上传错误

对于 HTTP 400，请使用 `error.param` 和 `error.message` 来标识需要修正的输入。
例如，超出 `/workspace` 的目标会返回：

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

该参数遵循请求结构。这里， `i` 是文件的索引，
从 `0` 开始，表示第一个文件：

| Request                                    | 示例 `error.param`        |
| ------------------------------------------ | ---------------------------- |
| 添加一个环境文件                   | `path`, `data`，或 `file_id` |
| 创建会话或预热环境 | `environment.files[i].data`  |
| 创建或更新环境模板   | `files[i].data`              |

使用有效的 base64 数据和文件 ID，并选择以下位置下的绝对路径 `/workspace`.
请查看 [文件限制](#file-limits)。遍历符号链接、
已存在或路径组件过长的目标将返回 HTTP 400。

安装文件时出现的意外错误将返回 HTTP 500。
在重试之前，请检查目标是否已创建，然后参阅
[重试指南](https://developers.openai.com/api/docs/guides/agents-api/errors#retry-transient-failures).

## 检索你的文件




### 从你自己的环境中

让智能体将其输出写入已知路径。回合完成后，通过你的提供商或基础设施检索文件。在环境过期或你将其删除之前，将其保存在应用程序的存储中。

来自自托管环境的文件不会通过 Artifacts API 发布，包括位于 `/workspace/outputs`。下的文件。详见 [沙盒提供商](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers) ，了解提供商特定的文件访问方式。








### 从 OpenAI 托管的环境

让智能体将文件保存到 `/workspace/outputs`，例如 `/workspace/outputs/report.pdf`。OpenAI 在轮次完成时将输出作为不可变制品发布。

将你的 API 客户端、会话 ID、已完成的轮次 ID、制品路径和本地目标路径传递给该函数。它会列出制品并下载与该轮次和路径匹配的文件：

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





请参阅 [列出制品](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/list), [检索元数据](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/retrieve)，和 [下载内容](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/content) 参考以了解请求和响应字段。

### 下载多个文件

API 每次请求只下载一个制品；它不提供批量下载
接口。要下载多个文件，请列出这些制品并分别请求每个文件的
`content`. 对于单次下载，请让智能体将结果打包为 ZIP
归档到 `/workspace/outputs`，然后将该压缩包作为一个构件下载。

## 文件生命周期

已发布的产物会在环境过期后保留。请在删除会话前下载你需要保留的内容。

无法通过此 API 上传或编辑产物。要发布新版本，请让 智能体 更新文件并完成一轮对话。使用轮次 ID 和路径来区分版本。




[删除产物](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/delete) 当你不再需要已发布的副本时。删除后，环境中的文件保持不变。

## 文件限制

| 文件操作                         | 限制                                            |
| -------------------------------------- | ------------------------------------------------ |
| 创建会话时包含的文件 | 每个请求 50 个文件。                            |
| 内联上传                          | 每个文件 5 MiB，按 base64 编码前的大小计算。 |
| 单个创建请求中的内联上传 | 总计 10 MiB，按 base64 编码前的大小计算。   |
| 从 Files API 复制的文件         | 每个文件 50 MiB。                                 |
| 已发布的产物                     | 每个文件 200 MiB。                                |
| 一同发布的输出             | 总计 500 MiB。                                   |