# ChatKit

> 完整的文档索引请参阅 [llms.txt](/llms.txt). 你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

ChatKit 是构建智能体聊天体验的最佳方式。无论你是在构建内部知识库助手、HR 入职助手、研究伙伴、购物或日程安排助手、故障排查机器人、财务规划顾问，还是支持智能体，ChatKit 都能提供可定制的聊天嵌入组件来处理所有用户体验细节。

使用 ChatKit 的可嵌入 UI 组件、可自定义的提示、工具调用支持、文件附件和思维链可视化来构建智能体，而无需重新发明聊天界面。

## 概述

在两条 ChatKit 路径之间选择：

- **Custom server integration**. 在你自己的基础设施上运行 ChatKit。使用 ChatKit Python SDK，并连接到任何智能体服务，包括使用 [Agents SDK](https://developers.openai.com/api/docs/guides/agents). 使用 widgets 构建前端。
- **现有的 智能体 Builder 托管集成**. 如果你已经将 ChatKit 与 智能体 Builder 的 工作流 配合使用，可以在 智能体 Builder 过渡期内继续使用该托管 工作流。

OpenAI 正在弃用 智能体 Builder。现有用户可在过渡期内继续使用
  该产品，并计划于
  2026 年 11 月 30 日停止服务。ChatKit 仍可使用。如需开展新工作或迁移
  规划，请使用 [高级 ChatKit 集成](https://developers.openai.com/api/docs/guides/custom-chatkit)
  使用你自己的服务端 智能体 实现，并查看 [从智能体
  Builder](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) 了解智能体
  Builder 过渡指南。

## ChatKit 入门

- **[自定义服务器集成](https://developers.openai.com/api/docs/guides/custom-chatkit)**: 使用任意服务器以及 ChatKit SDK，构建你自己的 ChatKit 自定义用户体验
- **[现有托管工作流](#embed-chatkit-in-your-frontend)**: 在过渡期内，将 ChatKit 接入到现有的智能体构建器工作流

## 在你的前端中嵌入 ChatKit

仅当你已有支持 ChatKit 实现的 智能体 Builder 工作流 时，才使用此路径。对于新的 ChatKit 应用，或在 智能体 Builder 关闭之前进行迁移时，请使用 [高级集成](https://developers.openai.com/api/docs/guides/custom-chatkit) 将 ChatKit 连接到你自己的服务端智能体实现。

从高层次看，使用现有托管工作流设置 ChatKit 分为三个步骤。在 智能体 Builder 仍然可用时打开你现有的工作流。然后设置 ChatKit 并添加功能以构建你的聊天体验。



![OpenAI-hosted ChatKit](https://cdn.openai.com/API/docs/images/openai-hosted.png)

### 1. 使用现有的托管工作流

在 工作流 中打开你现有的 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder)。你将获得一个 工作流 ID。有关过渡规划，请参阅 [从 智能体 Builder 迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder).

前端中嵌入的聊天将指向你选择的 工作流。

### 2. 在你的产品中集成 ChatKit

要设置 ChatKit，你需要创建一个 ChatKit 会话和一个服务端端点，传入你的 工作流 ID，交换客户端密钥，并在你的网站上添加一个用于嵌入 ChatKit 的脚本。

**重要安全提示：** 创建 ChatKit 会话时，你必须传入一个 `user` 参数，该参数应对每个最终用户唯一。你的服务器必须
对你的应用用户进行身份验证，并在该参数中为每个用户传入唯一标识符。

1. 在你的服务器上，生成一个客户端令牌。

   以下示例启动一个服务，通过 OpenAI API 创建 ChatKit 会话，并返回该会话的客户端密钥：

```python
import hmac
import json
import os
from typing import Annotated

import requests
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel


api_key = os.environ["OPENAI_API_KEY"]
workflow_id = os.environ["OPENAI_CHATKIT_WORKFLOW_ID"]
authenticated_users: dict[str, str] = json.loads(
    os.environ["CHATKIT_AUTHENTICATED_USERS"]
)
bearer_auth = HTTPBearer(auto_error=False)


def get_authenticated_user_id(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_auth),
    ],
) -> str:
    if credentials is not None:
        for token, user_id in authenticated_users.items():
            if hmac.compare_digest(credentials.credentials, token):
                return user_id
    raise HTTPException(status_code=401, detail="Invalid authentication token")


class ChatKitSession(BaseModel):
    client_secret: str


app = FastAPI()


@app.post("/api/chatkit/session")
def create_chatkit_session(
    user_id: Annotated[str, Depends(get_authenticated_user_id)],
):
    response = requests.post(
        "https://api.openai.com/v1/chatkit/sessions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "OpenAI-Beta": "chatkit_beta=v1",
        },
        json={
            "workflow": {"id": workflow_id},
            "user": user_id,
        },
        timeout=30,
    )
    response.raise_for_status()
    session = ChatKitSession.model_validate(response.json())
    return {"client_secret": session.client_secret}
```

```ruby
require "json"
require "net/http"
require "openssl"
require "webrick"

api_key = ENV.fetch("OPENAI_API_KEY")
workflow_id = ENV.fetch("OPENAI_CHATKIT_WORKFLOW_ID")
# Demo authentication mapping. Replace this with your application's session authentication.
authenticated_users = JSON.parse(ENV.fetch("CHATKIT_AUTHENTICATED_USERS"))
server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1", Port: Integer(ENV.fetch("PORT", "8000")),
  AccessLog: [], Logger: WEBrick::Log.new($stderr, WEBrick::BasicLog::WARN)
)
server.mount_proc("/api/chatkit/session") do |request, response|
  response["Content-Type"] = "application/json"
  response["Cache-Control"] = "no-store"
  unless request.path == "/api/chatkit/session" && request.request_method == "POST"
    response.status = 405
    response.body = JSON.generate(error: "Use POST /api/chatkit/session")
    next
  end
  token = request["Authorization"].to_s.delete_prefix("Bearer ")
  user = authenticated_users.find do |credential, _id|
    request["Authorization"].to_s.start_with?("Bearer ") &&
      OpenSSL.secure_compare(credential, token)
  end
  unless user
    response.status = 401
    response.body = JSON.generate(error: "Invalid authentication token")
    next
  end
  uri = URI("https://api.openai.com/v1/chatkit/sessions")
  upstream = Net::HTTP::Post.new(uri)
  upstream["Authorization"] = "Bearer #{api_key}"
  upstream["Content-Type"] = "application/json"
  upstream["OpenAI-Beta"] = "chatkit_beta=v1"
  upstream.body = JSON.generate(workflow: {id: workflow_id}, user: user.fetch(1))
  begin
    result = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 30) do |http|
      http.request(upstream)
    end
    result.value
    secret = JSON.parse(result.body).fetch("client_secret")
    raise "Missing session secret" unless secret.is_a?(String) && !secret.empty?
    response.body = JSON.generate(client_secret: secret)
  rescue
    response.status = 502
    response.body = JSON.generate(error: "Unable to create a ChatKit session")
  end
end
trap("INT") { server.shutdown }
trap("TERM") { server.shutdown }
puts("http://127.0.0.1:#{server.config[:Port]}/api/chatkit/session")
$stdout.flush
server.start
```


   对于 Ruby，使用以下命令安装 WEBrick `gem install webrick`.

   在启动服务之前，设置 `OPENAI_API_KEY`, `OPENAI_CHATKIT_WORKFLOW_ID`，以及 `CHATKIT_AUTHENTICATED_USERS`。最后一个值是一个 JSON 映射，将你应用的 bearer token 映射到稳定的用户 ID。在生产环境中，将这个基于环境变量的映射替换为你应用的身份验证或会话查询逻辑。

2. 在你的服务端代码中，将你的工作流 ID 和密钥传递给会话接口。

   客户端密钥是你的 ChatKit 前端用于打开或刷新聊天会话的凭证。你不需要存储它；只需立即将其交接给 ChatKit 客户端库。

   请参阅 [chatkit-js 仓库](https://github.com/openai/chatkit-js) GitHub 上的。

   chatkit.js

```javascript
export default async function getChatKitSessionToken(deviceId) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }

  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      workflow: { id: "wf_68df4b13b3588190a09d19288d4610ec0df388c3983f58d1" },
      user: deviceId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create a ChatKit session: ${response.status} ${await response.text()}`
    );
  }

  const { client_secret } = await response.json();

  if (!client_secret) {
    throw new Error("ChatKit session response did not include client_secret");
  }

  return client_secret;
}
```


3. 在你的项目目录中，安装 ChatKit React 绑定：

```bash
   npm install @openai/chatkit-react
```

4. 将 ChatKit JS 脚本添加到你的页面。把这段代码片段放入你页面的 `<head>` ，或任何你加载脚本的位置，浏览器就会为你获取并运行 ChatKit。

   index.html

```html
<script
src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
async
></script>
```


5. 在你的界面中渲染 ChatKit。将以下内容传递给 React 的 `MyChat` 组件：一个 `getAppAuthToken` 函数，用于返回当前用户的 bearer token。如果你使用 JavaScript 选项卡，请在代码片段的作用域中提供相同的函数。这段代码会将该凭证发送到你的服务器，获取客户端密钥，并挂载一个连接到你的工作流的实时聊天组件。

   你的前端代码

```javascript
const chatkit = document.getElementById("my-chat");
if (
  !chatkit ||
  !("setOptions" in chatkit) ||
  typeof chatkit.setOptions !== "function"
) {
  throw new Error("ChatKit element not found.");
}

chatkit.setOptions({
  api: {
    async getClientSecret() {
      const appAuthToken = await getAppAuthToken();
      const res = await fetch("/api/chatkit/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${appAuthToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`ChatKit session request failed: ${res.status}`);
      }
      const { client_secret } = await res.json();
      return client_secret;
    },
  },
});
```

```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

   export function MyChat({ getAppAuthToken }) {
     const { control } = useChatKit({
       api: {
         async getClientSecret(existing) {
           if (existing) {
             // implement session refresh
            }

           const appAuthToken = await getAppAuthToken();
           const res = await fetch('/api/chatkit/session', {
             method: 'POST',
             headers: {
               'Authorization': 'Bearer ' + appAuthToken,
               'Content-Type': 'application/json',
             },
           });
           const { client_secret } = await res.json();
           return client_secret;
         },
       },
     });

     return ;
   }
```


### 3. 构建与迭代

请参阅 [自定义主题](https://developers.openai.com/api/docs/guides/chatkit-themes), [widgets](https://developers.openai.com/api/docs/guides/chatkit-widgets)，以及 [actions](https://developers.openai.com/api/docs/guides/chatkit-actions) 文档，了解 ChatKit 的工作原理。也可以浏览下列资源，测试你的聊天功能、迭代提示，并添加 widgets 和工具。

#### 构建你的实现

[ChatKit docs on GitHub



      Learn to handle authentication, add theming and customization, and more.](https://openai.github.io/chatkit-python)
[ChatKit Python SDK



      Add server-side storage, access control, tools, and other backend
    functionality.](https://github.com/openai/chatkit-python)

[ChatKit JS SDK



      Check out the ChatKit JS repo.](https://github.com/openai/chatkit-js)

#### 探索 ChatKit UI

[chatkit.world



      Play with an interactive demo of ChatKit.](https://chatkit.world)

[Widget builder



      Browse available widgets.](https://widgets.chatkit.studio)

[ChatKit playground



      Play with an interactive demo to learn by doing.](https://chatkit.studio/playground)

#### 查看运行示例

[GitHub 上的示例



      See working examples of ChatKit and get inspired.](https://github.com/openai/openai-chatkit-advanced-samples)

[入门应用代码仓库



      Clone a repo to start with a fully working template.](https://github.com/openai/openai-chatkit-starter-app)

## Next steps

当你对 ChatKit 实现满意后，了解如何通过以下方式对其进行优化 [评估](https://developers.openai.com/api/docs/guides/agent-evals)。对于新的 ChatKit 应用，或要将现有的 ChatKit 应用从 智能体 Builder 托管的 工作流 上迁移，请参阅 [进阶集成文档](https://developers.openai.com/api/docs/guides/custom-chatkit).