# 文件与制品

> 完整文档索引请参阅 [llms.txt](/llms.txt).如需获取文档页面的 Markdown 版本，请在页面 URL 后追加 `.md` .即可访问。

## 文件和已发布的制品

文件存储在智能体的环境中。artifact 是来自 OpenAI 托管环境的已发布文件副本。你可以在环境过期后下载该副本。

| 环境     | 如何检索文件                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `self_hosted`   | 使用提供商的 API 或挂载的文件系统。                                                                       |
| `openai_hosted` | 使用会话 Artifacts API 来处理以下文件： `/workspace/outputs`.                                                       |
| `none`          | 无环境文件系统。请从以下位置读取输出： [会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items). |

## 上传文件

对于 OpenAI 托管的环境，请在 `environment.files` 创建会话时提供输入文件，并在 `/workspace`.

中选择每个文件的目标位置。使用 `type: "file_id"` 时传入一个 `file_id` ，该文件来自 [Files API](https://developers.openai.com/api/reference/resources/files/methods/create)，或者 `type: "inline"` 时附带 base64 编码的 `data`。两种形式都需要一个 `path`.

若要在环境连接后添加文件，请使用 [environment Files API](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/environments/subresources/files/methods/create).

## 检索你的文件




### 从你自己的环境中

要求智能体将其输出写入到已知路径。轮次结束后，通过你的提供商或基础设施检索该文件。在环境过期或你将其删除之前，将其保存在应用的存储中。

来自自托管环境的文件不会通过 Artifacts API 发布，包括位于以下路径下的文件： `/workspace/outputs`。请参阅 [沙盒提供商](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers) 了解提供商特有的文件访问方式。








### 从 OpenAI 托管的环境中

让 智能体 将文件保存到 `/workspace/outputs`，例如 `/workspace/outputs/report.pdf`。OpenAI 会在轮次结束时将输出发布为不可变的制品。

将你的 API 客户端、会话 ID、已完成的轮次 ID、制品路径和本地目标路径传递给此函数。它会列出制品并下载与轮次和路径同时匹配的文件：

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





请参阅 [列出制品](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/list), [检索元数据](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/retrieve)，以及 [下载内容](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/content) 参考文档以了解请求和响应字段。

### Download multiple files

API 每次请求下载一个制品，不提供批量下载
端点。要下载多个文件，请列出制品并逐个请求每个文件的
`content`。对于单次下载，可让 智能体 将结果打包为 ZIP
file under `/workspace/outputs`, then download that archive as one artifact.

## 文件生命周期

已发布的工件会在环境到期后保留。在删除会话前，下载你需要保留的所有内容。

无法通过该 API 上传或编辑工件。若要发布新版本，请让智能体更新文件并完成新一轮交互。使用 turn ID 和路径来区分版本。




[删除工件](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/delete) 当你不再需要已发布的副本时删除。删除操作不会影响环境中的文件。

## 文件限制

| 文件操作                         | 限制                                            |
| -------------------------------------- | ------------------------------------------------ |
| 创建会话时包含的文件 | 每个请求 50 个文件。                            |
| 内联上传                          | 每个文件 5 MiB，按 base64 编码前的大小计算。 |
| 单次创建请求中的内联上传 | 总计 10 MiB，按 base64 编码前的大小计算。   |
| 从 Files API 复制的文件         | 每个文件 50 MiB。                                 |
| 已发布的制品                     | 每个文件 200 MiB。                                |
| 一并发布的输出             | 总计 500 MiB。                                   |