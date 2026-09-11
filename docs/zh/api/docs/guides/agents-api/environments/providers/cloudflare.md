# Cloudflare

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

在 Cloudflare 中运行沙箱工具，由 OpenAI 运行智能体并维护会话状态。本指南使用 **webhook 托管的预配** 配合 Cloudflare 的参考 Worker。

## 工作原理

1. 你的应用程序创建一个智能体 API 会话并发送输入。
2. OpenAI 将会话 webhook 发送到你的 Cloudflare 账户中的 Worker。
3. 该 Worker 启动或重连特定于会话的容器，运行 `codex exec-server`。执行器会主动出站连接到 OpenAI，以便智能体可以运行命令并处理文件。

你的应用使用 智能体 API；参考 Worker 负责沙箱的配置。参见 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 了解连接与恢复行为。

## 准备工作

你需要一个具有 Containers 访问权限的 Cloudflare 账号、一个 OpenAI 应用 API 密钥，以及一个单独的受限执行器密钥。请按照 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 配置密钥。将应用密钥保存在 Container 外部。

[创建一个智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并将其 ID 保存为 `OPENAI_AGENT_ID`。在你的应用和参考 Worker 中使用同一个智能体 ID。

## 部署参考 Worker

Cloudflare 的 [参考 Worker](https://github.com/cloudflare/sandbox-sdk/tree/main/openai/agents-api) 包含 webhook 处理程序、容器镜像、部署配置和清理端点。

为清理端点生成一个密钥并将其保存为 `EXECUTOR_CLIENT_SECRET`:

```bash
openssl rand -hex 32
```

在你的 Cloudflare 账户中部署 Worker：



部署到 Cloudflare



按提示输入以下值：

| 变量                  | 值                                                   |
| ------------------------- | ------------------------------------------------------- |
| `OPENAI_API_KEY`          | Worker 用于检索会话状态的键        |
| `OPENAI_EXECUTOR_API_KEY` | 传递给以下内容的受限密钥： `codex exec-server`            |
| `OPENAI_AGENT_ID`         | 此 Worker 服务的智能体 ID                          |
| `OPENAI_WEBHOOK_SECRET`   | `pending-webhook-registration` 用于首次部署 |
| `EXECUTOR_CLIENT_SECRET`  | 为清理而生成的密钥                            |

将部署后的 Worker URL 保存为 `WORKER_URL`.

### 注册 webhook

请按照 [webhook 设置](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) 在您的 `$WORKER_URL/webhook` 中注册 webhook。在您的 OpenAI 项目中注册。启用 Cloudflare 参考集成所列出的事件：

- `agent.session.created`
- `agent.session.action_required`
- `agent.session.in_progress`
- `agent.session.idle`
- `agent.session.failed`

请将 `OPENAI_WEBHOOK_SECRET` 替换为 OpenAI 返回的签名密钥，然后部署新版本的 Worker。请检查其配置。以下示例使用标准的 HTTP 客户端来调用该 Worker：

检查 Worker 健康状态

```javascript
const response = await fetch(
  process.env.WORKER_URL.replace(/\/+$/, "") + "/health",
  { method: "GET" }
);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.text());
```

```python
import os
import urllib.request

url = os.environ["WORKER_URL"].rstrip("/") + "/health"
request = urllib.request.Request(url, method="GET")
with urllib.request.urlopen(request) as response:
    print(response.read().decode())
```

```go
import (
	"io"
	"net/http"
	"os"
	"strings"
)

endpoint := strings.TrimRight(os.Getenv("WORKER_URL"), "/") + "/health"
request, err := http.NewRequest("GET", endpoint, nil)
if err != nil {
	panic(err)
}
response, err := http.DefaultClient.Do(request)
if err != nil {
	panic(err)
}
defer response.Body.Close()
if response.StatusCode/100 != 2 {
	panic(response.Status)
}
if _, err := io.Copy(os.Stdout, response.Body); err != nil {
	panic(err)
}
```

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String endpoint = System.getenv("WORKER_URL").replaceAll("/+$", "") + "/health";
var request =
    HttpRequest.newBuilder(URI.create(endpoint))
        .method("GET", HttpRequest.BodyPublishers.noBody())
        .build();
var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() / 100 != 2)
  throw new IllegalStateException("Request failed: " + response.statusCode());
System.out.println(response.body());
```

```ruby
require "uri"
require "net/http"

uri = URI(ENV.fetch("WORKER_URL").sub(%r{/+\z}, "") + "/health")
request = Net::HTTP::Get.new(uri)
response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

puts response.body
```

```bash
curl --fail-with-body "$WORKER_URL/health"
```


响应应同时包含 `"configured": true` 和 `"webhook_configured": true`.

一个 `environment_connection` required action 是重新连接离线执行器的信号。仅空闲事件本身并非安全的关闭信号；请参阅 [生命周期行为](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## 运行会话

按照 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 在你的应用的 `OPENAI_API_KEY` 和 Worker 中配置的相同 `OPENAI_AGENT_ID` 中执行。创建一个自托管会话，并让该智能体写入和读取 `/workspace/hello.txt`.

Worker 接收会话 webhook 并连接沙箱执行器。你的应用通过 API 流式传输 智能体 的输出，通过 智能体 开发工具包 实现。

将会话 ID 另存为 `SESSION_ID`。要继续对话，请在发送后续输入前打开会话事件流。如果执行器处于离线状态，新输入将请求环境连接，并等待 Worker 重新连接。重新连接本身不会恢复之前 Container 中的文件。

### 在 Worker 中运行你的应用

Cloudflare 的 [基础 Worker 应用](https://github.com/cloudflare/sandbox-sdk/tree/main/openai/agents-api/basic) 使用 `@openai/agents-api` TypeScript SDK 来创建会话、发送初始和后续输入，以及清理资源。其 `POST /demo` 端点运行 工作流。

此应用也使用了 Webhook 管理的预配。在 Worker 中运行你的应用并不意味着它必须直接预配沙箱。

## 清理

当应用程序不再需要沙箱时，调用引用 Worker 的已认证清理端点：

清理 Worker 沙箱

```javascript
const response = await fetch(
  process.env.WORKER_URL.replace(/\/+$/, "") +
    "/executors/" +
    encodeURIComponent(process.env.SESSION_ID),
  {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.EXECUTOR_CLIENT_SECRET}` },
  }
);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.text());
```

```python
import os
from urllib.parse import quote
import urllib.request

url = (
    os.environ["WORKER_URL"].rstrip("/")
    + "/executors/"
    + quote(os.environ["SESSION_ID"], safe="")
)
request = urllib.request.Request(
    url,
    method="DELETE",
    headers={"Authorization": "Bearer " + os.environ["EXECUTOR_CLIENT_SECRET"]},
)
with urllib.request.urlopen(request) as response:
    print(response.read().decode())
```

```go
import (
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

endpoint := strings.TrimRight(os.Getenv("WORKER_URL"), "/") + "/executors/" + url.PathEscape(os.Getenv("SESSION_ID"))
request, err := http.NewRequest("DELETE", endpoint, nil)
if err != nil {
	panic(err)
}
request.Header.Set("Authorization", "Bearer "+os.Getenv("EXECUTOR_CLIENT_SECRET"))
response, err := http.DefaultClient.Do(request)
if err != nil {
	panic(err)
}
defer response.Body.Close()
if response.StatusCode/100 != 2 {
	panic(response.Status)
}
if _, err := io.Copy(os.Stdout, response.Body); err != nil {
	panic(err)
}
```

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

String endpoint =
    System.getenv("WORKER_URL").replaceAll("/+$", "")
        + "/executors/"
        + URLEncoder.encode(System.getenv("SESSION_ID"), StandardCharsets.UTF_8)
            .replace("+", "%20");
var request =
    HttpRequest.newBuilder(URI.create(endpoint))
        .header("Authorization", "Bearer " + System.getenv("EXECUTOR_CLIENT_SECRET"))
        .method("DELETE", HttpRequest.BodyPublishers.noBody())
        .build();
var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() / 100 != 2)
  throw new IllegalStateException("Request failed: " + response.statusCode());
System.out.println(response.body());
```

```ruby
require "uri"
require "net/http"

uri = URI(ENV.fetch("WORKER_URL").sub(%r{/+\z}, "") + "/executors/" + URI.encode_www_form_component(ENV.fetch("SESSION_ID")).gsub("+", "%20"))
request = Net::HTTP::Delete.new(uri)
request["Authorization"] = "Bearer #{ENV.fetch("EXECUTOR_CLIENT_SECRET")}"
response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

puts response.body
```

```bash
curl --fail-with-body \
  --request DELETE \
  --header "Authorization: Bearer $EXECUTOR_CLIENT_SECRET" \
  "$WORKER_URL/executors/$SESSION_ID"
```


[删除 智能体 API 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 是单独进行的。会话删除不会发出 webhook，因此需要同时执行这两项操作以立即完成清理。在释放 Container 之前检索你需要保留的文件。

## 进阶：应用管理的预配

若需直接控制沙箱的预配，请使用 Cloudflare Sandbox SDK 通过 [应用托管生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#manage-sandboxes-from-your-application) 和 [执行器连接说明](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)。每个会话使用一个预配控制器。

## 参考

- 阅读 [将 Cloudflare Containers 与 OpenAI 智能体 API 配合使用](https://developers.cloudflare.com/sandbox/guides/openai-agents-api/) 以进行配置、生命周期管理、快照和镜像定制。
- 阅读 [Cloudflare Sandbox 文档](https://developers.cloudflare.com/sandbox/).
- 阅读 [Cloudflare Sandbox TypeScript SDK 参考](https://developers.cloudflare.com/sandbox/api/).