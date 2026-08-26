# ChatKit

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在 `.md` 添加到页面 URL 末尾来获取。

ChatKit 是构建智能体聊天体验的最佳方式。无论你是在构建内部知识库助手、HR 入职帮助工具、研究伴侣、购物或日程安排助手、故障排除机器人、财务规划顾问，还是支持智能体，ChatKit 都提供可定制的聊天嵌入组件，处理所有用户体验细节。

使用 ChatKit 的可嵌入 UI 组件、可定制提示、工具调用支持、文件附件和思维链可视化，无需重新设计聊天界面即可构建智能体。

## 概述

在两个 ChatKit 路径之间选择：

- **自定义服务器集成**。在你自己的基础设施上运行 ChatKit。使用 ChatKit Python SDK 并连接到任何智能体服务，包括使用 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)。构建的服务。使用小部件构建前端。
- **现有的 智能体 Builder 托管的集成**。如果你已经将 ChatKit 与 智能体 Builder 工作流 一起使用，你可以在 工作流 Builder 过渡期内继续使用该托管的 智能体。

OpenAI 正在弃用 智能体 Builder。现有用户可以继续使用
  在过渡期内使用，该产品计划于
  2026年11月30日关闭。ChatKit 仍然可用。对于新的工作或迁移
  规划，请使用 [高级 ChatKit 集成](https://developers.openai.com/api/docs/guides/custom-chatkit)
  配合你自己的 服务端 智能体 实现，并参阅 [从 智能体 迁移
  Builder](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) 以获取 智能体
  Builder 迁移指南。

## 开始使用 ChatKit

- **[自定义服务器集成](https://developers.openai.com/api/docs/guides/custom-chatkit)**：使用任何服务器和 ChatKit SDK 构建你自己的自定义 ChatKit 用户体验
- **[现有托管工作流](#embed-chatkit-in-your-frontend)**：在过渡期内将 ChatKit 连接到现有的 智能体构建器工作流

## 在你的前端中嵌入 ChatKit

仅当你已有支持 ChatKit 实现的 智能体 Builder 工作流 时，才使用此路径。对于新的 ChatKit 应用，或在 智能体 Builder 关闭之前迁移，请使用 [高级集成](https://developers.openai.com/api/docs/guides/custom-chatkit) 将 ChatKit 连接到你的 服务端 智能体 实现。

在高层级别，使用现有托管 工作流 设置 ChatKit 是一个三步过程。在 智能体 Builder 仍然可用时打开现有的 工作流。然后设置 ChatKit 并添加功能来构建你的聊天体验。



![OpenAI-托管的 ChatKit](https://cdn.openai.com/API/docs/images/openai-hosted.png)

### 1. 使用现有的托管工作流

在 工作流 中打开你现有的 工作流 [智能体 构建器](https://developers.openai.com/api/docs/guides/agent-builder)。你将获得一个 工作流 ID。有关过渡规划，请参阅 [从 智能体 构建器迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder).

前端中嵌入的聊天将指向你选择的 工作流。

### 2. 在你的产品中设置 ChatKit

要设置 ChatKit，你需要创建 ChatKit 会话和服务端端点，传入你的工作流 ID，交换客户端密钥，并添加一个脚本以在你的网站上嵌入 ChatKit。

**重要安全说明：** 创建 ChatKit 会话时，你必须传入一个 `user` 参数，该参数应针对每个最终用户唯一。你的服务器必须
对应用程序的用户进行身份验证，并在该参数中传递他们的唯一标识符。

1. 在你的服务器上生成一个客户端令牌。

   此代码片段启动一个 FastAPI 服务，其唯一任务是仅通过 OpenAI API 创建一个新的 ChatKit 会话，并返回该会话的客户端密钥：

   server.py

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


   在启动服务之前，设置 `OPENAI_API_KEY`, `OPENAI_CHATKIT_WORKFLOW_ID`，以及 `CHATKIT_AUTHENTICATED_USERS`。最后一个值是一个 JSON 映射，将你的应用的 bearer 令牌映射到稳定的用户 ID。在生产环境中，用你的应用的认证或会话查找替代这个基于环境变量的映射。

2. 在你的服务端代码中，将你的工作流 ID 和密钥传递给会话端点。

   客户端密钥是你的 ChatKit 前端用于打开或刷新聊天会话的凭据。你不应存储它，而应立即将其交接给 ChatKit 客户端库。

   请参阅 [chatkit-js 仓库](https://github.com/openai/chatkit-js) 在 GitHub 上。

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

4. 将 ChatKit JS 脚本添加到你的页面。将以下代码片段放入你页面的 `<head>` 或你加载脚本的任何地方，浏览器将自动获取并运行 ChatKit。

   index.html

```html
<script
src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
async
></script>
```


5. 在你的 UI 中渲染 ChatKit。向 React 传递 `MyChat` 组件一个 `getAppAuthToken` 返回当前用户 bearer 令牌的函数。如果你使用 JavaScript 标签，请确保在代码片段的作用域内提供相同的函数。此代码将凭据发送到你的服务器，获取客户端密钥，并挂载一个连接到你工作流的实时聊天组件。

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


### 3. 构建并迭代

请参阅 [自定义主题](https://developers.openai.com/api/docs/guides/chatkit-themes), [小部件](https://developers.openai.com/api/docs/guides/chatkit-widgets)，以及 [操作](https://developers.openai.com/api/docs/guides/chatkit-actions) 文档详细了解 ChatKit 的工作原理。或者探索以下资源来测试你的聊天、迭代提示，并添加小部件和工具。

#### 构建你的实现

[ChatKit 文档（GitHub）



      Learn to handle authentication, add theming and customization, and more.](https://openai.github.io/chatkit-python)
[ChatKit Python SDK



      Add server-side storage, access control, tools, and other backend
    functionality.](https://github.com/openai/chatkit-python)

[ChatKit JS SDK



      Check out the ChatKit JS repo.](https://github.com/openai/chatkit-js)

#### 探索 ChatKit UI

[chatkit.world



      Play with an interactive demo of ChatKit.](https://chatkit.world)

[组件构建器



      Browse available widgets.](https://widgets.chatkit.studio)

[ChatKit 游乐场



      Play with an interactive demo to learn by doing.](https://chatkit.studio/playground)

#### 查看工作示例

[GitHub 上的示例



      See working examples of ChatKit and get inspired.](https://github.com/openai/openai-chatkit-advanced-samples)

[入门应用仓库



      Clone a repo to start with a fully working template.](https://github.com/openai/openai-chatkit-starter-app)

## 后续步骤

当你的 ChatKit 实现达到满意程度后，了解如何通过以下内容优化它： [评测](https://developers.openai.com/api/docs/guides/agent-evals)。对于新的 ChatKit 应用，或将现有 ChatKit 应用从 智能体 Builder 托管的 工作流迁移，请参阅 [高级集成文档](https://developers.openai.com/api/docs/guides/custom-chatkit).