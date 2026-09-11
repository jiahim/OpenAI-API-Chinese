# 文件与制品

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## 文件和已发布的制品

文件保存在智能体的环境中。制品是从由 OpenAI 托管的环境中发布的文件副本。你可以在环境过期后下载该副本。

| 环境     | 如何检索文件                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `self_hosted`   | 使用你的提供商的 API 或挂载的文件系统。                                                                       |
| `openai_hosted` | 使用会话 Artifacts API 处理以下路径下的文件： `/workspace/outputs`.                                                       |
| `none`          | 无环境文件系统。请从 [会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items). |

## 上传文件

对于 OpenAI 托管的环境，请在创建会话时提供输入文件。在 `environment.files` 下选择每个文件的目标位置。 `/workspace`.

使用 `type: "file_id"` 配合一个 `file_id` 从 [Files API](https://developers.openai.com/api/reference/resources/files/methods/create)，或者 `type: "inline"` 配合 base64 编码的 `data`。两种形式都需要一个 `path`.

若要在环境连接后添加文件，请使用 [环境 Files API](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/environments/subresources/files/methods/create).

## 检索你的文件




### 从你自己的环境中

让智能体把输出写入一个已知路径。该轮次结束后，通过你的服务商或基础设施取出文件，并在环境过期或被删除之前保存到你的应用存储中。

来自自托管环境的文件不会通过 Artifacts API 发布，包括位于以下路径下的文件： `/workspace/outputs`。请参阅 [Sandbox providers](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers) 以了解各服务商的文件访问方式。








### 从 OpenAI 托管的环境中

让 智能体 将文件保存到 `/workspace/outputs`，例如 `/workspace/outputs/report.pdf`。OpenAI 会在回合完成时将输出发布为不可变制品。

向此函数传入你的 API 客户端、会话 ID、已完成的回合 ID、制品路径以及本地目标路径。它会列出制品，并下载同时匹配该回合和路径的文件：

查找并下载制品

```python
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





请参阅 [列出制品](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/list), [检索元数据](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/retrieve)，以及 [下载内容](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/content) 参考以了解请求和响应字段。

### 下载多个文件

该 API 每次请求下载一个制品；它不提供批量下载
接口。若要下载多个文件，请列出这些制品并逐一请求每个文件的
`content`。对于单次下载，可以让 智能体 将结果打包成一个 ZIP
文件并保存到 `/workspace/outputs`，然后将该压缩包作为一个制品下载。

## 文件生命周期

已发布的制品会在环境到期后仍然保留。请在删除会话前下载所有需要保留的内容。

通过此 API 无法上传或编辑制品。如需发布新版本，请让 智能体 更新该文件并完成新的一轮对话。可使用轮次 ID 和路径来区分不同版本。




[删除制品](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/delete) 当你不再需要已发布的副本时，可以执行该操作。删除制品不会影响环境中已有的文件。

## 文件限制

| 文件操作                         | 限制                                            |
| -------------------------------------- | ------------------------------------------------ |
| 创建会话时包含的文件 | 每个请求 50 个文件。                            |
| 内联上传                          | 每个文件 5 MiB,在 base64 编码前测量。 |
| 单个创建请求中的内联上传 | 总计 10 MiB,在 base64 编码前测量。   |
| 从 Files API 复制的文件         | 每个文件 50 MiB。                                 |
| 已发布的制品                     | 每个文件 200 MiB。                                |
| 同时发布的输出             | 总计 500 MiB。                                   |