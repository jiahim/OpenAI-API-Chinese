# 沙盒 智能体

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

沙盒为智能体提供一个隔离的、类 Unix 的执行环境，其中包含
文件系统、shell、已安装的软件包、挂载的数据、暴露的端口、快照，
以及对外部系统的受控访问。

当模型需要这样的工作空间，但智能体工作流只能获得提示上下文时，它会变得脆弱。
大型文档集、生成的产物、
命令、预览以及可恢复的工作，都需要一个智能体能够查看和修改的环境。
并进行更改。

沙盒智能体在 TypeScript 和 Python Agents SDK 中可用。它们
  目前处于测试阶段，因此 API 细节、默认值和支持的能力可能会发生变化。

当智能体需要操作文件、运行命令、挂载一个
数据室、生成产物、暴露服务或稍后继续有状态工作时，
请使用沙盒。

关键的分界在于控制平面与计算之间的边界。控制平面
围绕在模型周围：它负责智能体循环、模型调用、工具
路由、交接、审批、追踪、恢复和运行状态。计算则是
沙盒执行平面，模型驱动的工作在其中读写文件、运行
命令、安装依赖、使用挂载的存储、暴露端口，以及
快照状态。

将这些边界分开，可以让你的应用在受信的基础设施中保留敏感的控制平面
工作，同时让沙盒专注于
provider-specific execution. 沙箱可以使用受限的凭证和挂载来针对文件运行代码
（凭证和挂载）；运行框架可以将身份验证、计费、审计日志、人工
审批和恢复状态保留在任何单个容器之外。



  <figure>
    <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
      Running the harness inside the sandbox can be convenient for prototypes,
      but it puts orchestration and model-directed execution in the same compute
      boundary.
    </figcaption>
  </figure>

  <figure>
    <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
      The harness can run in your infrastructure while the sandbox handles
      provider-specific, stateful execution.
    </figcaption>
  </figure>



## 何时使用沙箱

当智能体的答案依赖于在沙盒中完成的工作，而不仅仅是基于提示上下文进行推理时，请使用沙盒。
工作区，而不仅仅是基于提示上下文进行推理。

常见痛点包括：

- 该任务需要一个文档目录，而不是单个提示。
- 智能体应写入你的应用稍后可检查的文件。
- 智能体需要命令、包或脚本来完成工作。
- 工作流会产生 Markdown、CSV、JSONL、截图或生成的网站等产物。
- 服务、笔记本或报告预览需要在暴露的端口上运行。
- 工作暂停等待人工审核，然后在同一工作区中继续。

如果你的工作流只需要简短的模型响应，并且不需要持久化工作区，
请直接调用 [Responses API](https://developers.openai.com/api/reference/responses/overview) ，或者使用不带沙箱的
基础 Agents SDK 运行时。

如果 shell 访问只是偶尔使用的工具，请先使用
[使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)。中的托管 shell 工具。当工作区隔离、沙箱提供方选择或可恢复的
智能体
文件系统状态属于产品设计的一部分时，请使用沙箱智能体。

## 沙箱的作用

`SandboxAgent` 仍然是一个 `Agent`。它保留了通常的 智能体 接口，包括
`instructions`, `prompt`, `tools`, `handoffs`, MCP 服务器、模型设置、
结构化输出、护栏和钩子。发生变化的是执行边界：
运行器在拥有文件、命令、端口和提供商特定隔离的活动沙盒会话中准备 智能体，
命令、端口和提供商特定的隔离。

| 组成部分              | 它拥有的内容                                                     | 设计问题                                                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SandboxAgent`     | 智能体定义以及沙箱默认值                       | 这个智能体应该做什么，以及哪些沙箱默认值随它一起传递？                             |
| `Manifest`         | 全新会话的工作区约定                             | 工作区最初应包含哪些文件、目录、代码仓库、挂载、环境、用户或组？ |
| 能力       | 附加到智能体的沙箱原生行为                    | 这个智能体需要哪些沙箱工具、指令或运行时行为？                      |
| 沙箱客户端     | 提供商集成                                         | 实时工作区应在哪里运行：本地 Unix、Docker 还是托管提供商？                    |
| 沙箱会话    | 实时执行环境                                   | 命令在哪里运行、文件在哪里更改、端口在哪里打开，以及提供商状态存放在哪里？                         |
| 沙箱运行配置 | 每次运行的沙箱会话来源、客户端选项以及全新输入 | 此次运行应当注入、恢复还是创建沙箱会话？                                    |
| 已保存状态        | `RunState`、序列化的会话状态以及快照              | 后续运行应如何重新连接以恢复工作或为新工作区植入初始数据？                                  |

沙箱专属默认值应设置在 `SandboxAgent`。每次运行的沙箱会话
选择应放在该运行的沙箱配置中。

沙箱 智能体 也不会改变“轮次”的含义。轮次仍然是一次模型
步骤，而不是单条 shell 命令或沙箱操作。部分工作可能会留在
沙箱执行层内部。只有在沙箱工作完成后 智能体 运行时需要再获取一次模型响应时，
它才会再消耗一个轮次。

## 创建工作区

`Manifest` 描述全新沙箱工作区所需初始内容和布局。
用于配置 智能体 应看到的文件、仓库、输入制品、辅助文件、
挂载点、输出目录和环境设置。

将清单视为新会话的契约，而非每个在线沙箱的完整事实来源。
实际运行所用的工作区可以来自复用的在线沙箱会话、序列化
的沙箱会话状态或快照
在运行时选择。

清单条目路径是相对于工作区的。它们不能是绝对路径，也不能
通过以下方式逃离工作区 `..`，这保持了工作区契约的可移植性
，适用于本地、Docker 和托管客户端。

| 清单输入                                                                 | 用于                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `File`, `Dir`                                                                  | 小型合成输入、辅助文件或输出目录。                          |
| 本地文件或目录                                                        | 托管需要在沙箱中实例化的文件或目录。                            |
| Git 仓库                                                                       | 要拉取到工作区的仓库。                                             |
| `S3Mount`, `GCSMount`, `R2Mount`, `AzureBlobMount`, `BoxMount`, `S3FilesMount` | 需要在沙箱内部署的外部存储。                                |
| `environment`                                                                  | 沙箱启动时所需的环境变量。                               |
| `users` 和 `groups`                                                           | 支持账户置备的提供商所使用的沙箱本地 OS 账户和组。 |

良好的清单设计意味着：

- 将仓库、输入制品和输出目录放在清单中。
- 将较长的任务规范和仓库本地说明放在工作区文件中，例如 `repo/task.md` 或 `AGENTS.md`.
- 在说明中使用相对工作区路径，例如 `repo/task.md` 或 `output/report.md`.
- 将挂载存储的范围限定为 智能体 应读取或写入的输入。
- 将挂载项视为临时的工作区条目：快照与持久化流程会跳过挂载的远程存储，而不是将其复制到已保存的工作区内容中。

### 挂载文件和存储

有用的数据通常已经存在于其他地方。与其将大型
文档粘贴到上下文中，不如将它们挂载到沙盒中，让智能体直接处理
文件。

示例：

- 挂载一个尽职调查数据库，并要求 智能体 生成一份带引用的摘要。
- 挂载一份客服导出数据，并要求 智能体 将问题聚类成报告。
- 挂载生成的产物，以便另一个系统能够对其进行审查。

提供商集成会暴露各自的挂载辅助方法、凭证处理方式和持久化行为。请保持应用契约不变：只挂载本服务需要的
组件，并保留与 响应接口 兼容的输入输出形状。
输入智能体应使用的智能体，告诉智能体从哪里读取和写入，并检查
生成的内容后再使用它们。

### 处理密钥和凭据

将沙盒凭证视为运行时配置，而非提示内容。
智能体 可能需要访问包管理器、存储挂载或
服务商的 API 凭证，但这些凭证不应出现在用户提示中，
智能体 指令、任务文件、已提交的清单或生成的产物中。

遵循以下规则：

- 对于托管沙箱提供商，优先使用提供商原生的密钥管理系统。
- 将云存储凭据的作用范围限制在需要它们的挂载或提供商选项内。
- 使用 `Manifest.environment` 为沙箱进程在启动时所需的值，并在希望重新生成而非持久化敏感或生成的条目时，将其标记为临时（ephemeral）。
- 避免保存机密、生成的挂载配置、本地令牌或不应在运行后保留的文件。
- 在将产物移出沙箱之前先进行审查，尤其是在 智能体 能够读取私有文档或已挂载存储的情况下。

SDK 支持清单环境值和特定于提供商的挂载
凭据。通用的密钥存储集成因提供商而异，因此请保持本页
聚焦于契约：你的运行时或沙箱提供商应注入
凭据，而不是将其作为指令教给模型。

## 赋予智能体能力

Capabilities 为一个 `SandboxAgent`。附加沙箱原生行为。它们可以塑造
运行开始前的工作区，追加沙箱特有的指令，暴露
绑定到实时沙箱会话的工具，并调整该 智能体 的模型行为或输入
处理方式。

| 能力                              | 添加时机                                                  | 说明                                                                                |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Shell`                                 | 智能体需要 shell 访问权限。                                | 添加命令执行功能，并在沙箱客户端支持时支持交互式输入。 |
| `Filesystem`                            | 智能体需要编辑文件或查看本地图片。       | 添加 `apply_patch` 和 `view_image`；补丁路径相对于工作区根目录。        |
| `Skills`                                | 你希望在沙箱中进行技能发现与实例化。 | 优先使用它，而不是手动挂载 `.agents` 或 `.agents/skills`.                    |
| [`Memory`](#persist-memory-across-runs) | 后续运行需要读取或生成记忆制品。     | 需要 `Shell`；实时记忆更新还需要 `Filesystem`.                     |
| `Compaction`                            | 长时间运行的工作流需要进行上下文裁剪。                    | 在压缩条目后调整模型行为和输入处理。                    |

默认情况下， `SandboxAgent` 包含文件系统、shell 和压缩
能力。如果你传入一个 `capabilities` 列表，它会替换默认列表，
因此请包含 智能体 仍然需要的任何默认能力。

在合适时优先使用内置能力。仅当
你需要内置能力未覆盖的、特定于沙箱的工具或指令界面时，才编写自定义能力。
。

### 加载技能

某些任务需要在
智能体启动之前提供可重复使用的指令、脚本、参考或资源。使用该 `Skills` 能力，使智能体能够在运行期间发现这些
工作上下文。

加载技能

```javascript
import {
  Capabilities,
  SandboxAgent,
  gitRepo,
  skills,
} from "@openai/agents/sandbox";

const agent = new SandboxAgent({
  name: "Tax prep assistant",
  instructions: "Use the mounted skill before preparing the return.",
  capabilities: [
    ...Capabilities.default(),
    skills({
      from: gitRepo({
        repo: "owner/tax-prep-skills",
        ref: "main",
      }),
    }),
  ],
});
```

```python
from agents.sandbox import SandboxAgent
from agents.sandbox.capabilities import Capabilities, Skills
from agents.sandbox.entries import GitRepo

agent = SandboxAgent(
    name="Tax prep assistant",
    instructions="Use the mounted skill before preparing the return.",
    capabilities=Capabilities.default()
    + [
        Skills(from_=GitRepo(repo="owner/tax-prep-skills", ref="main")),
    ],
)
```


根据你希望技能如何具象化来选择技能来源：

- 对于较大的本地技能目录，当你希望模型先发现索引并且仅加载所需内容时，请使用惰性的本地目录源。
- 对于小型本地捆绑包，请使用本地目录源预先暂存。
- 当技能捆绑包有自己的发布节奏或被许多沙箱使用时，请使用 Git 仓库源。

### Expose previews and ports

有时，产物不是文件，而是正在运行的进程。当
智能体在本地创建应用、Notebook、报表服务器、浏览器
预览或你需要在沙箱外检查的其他服务时，请使用公开的端口。

端口设置因提供商而异，但产品契约相同：
智能体在沙箱内启动服务，沙箱客户端公开该端口，
你的应用共享或检查生成的预览 URL。

## 运行沙盒 智能体

最短的可用沙盒循环是：

1. 构建一个 `Manifest` 用于描述工作区。
2. 创建一个 `SandboxAgent` 为模型提供所需的能力。
3. 为工作应运行的环境选择一个沙箱客户端。
4. 使用每次运行的沙箱配置运行智能体。
5. 检查、复制、恢复或快照化对你的应用重要的工件。

在 macOS 或 Linux 上进行本地开发时，从 Unix 本地开始。它能提供最小的本地循环，因为运行器可以从智能体的默认清单创建临时工作区，并在运行后清理。
最小的本地循环，因为运行器可以从智能体的默认清单创建临时工作区，并在运行后清理。
智能体的默认清单创建临时工作区，并在运行后清理。

运行 Unix 本地沙箱智能体

```javascript
import { run } from "@openai/agents";
import { Manifest, SandboxAgent, file, shell } from "@openai/agents/sandbox";
import { UnixLocalSandboxClient } from "@openai/agents/sandbox/local";

const manifest = new Manifest({
  entries: {
    "account_brief.md": file({
      content:
        "# Northwind Health\n\n" +
        "- Segment: Mid-market healthcare analytics provider.\n" +
        "- Renewal date: 2026-04-15.\n",
    }),
    "implementation_risks.md": file({
      content:
        "# Delivery risks\n\n" +
        "- Security questionnaire is not complete.\n" +
        "- Procurement requires final legal language by April 1.\n",
    }),
  },
});

const agent = new SandboxAgent({
  name: "Renewal Packet Analyst",
  model: "gpt-6-astra",
  instructions:
    "Review the workspace before answering. Keep the response concise, " +
    "business-focused, and cite the file names that support each conclusion.",
  defaultManifest: manifest,
  capabilities: [shell()],
});

const result = await run(
  agent,
  "Summarize the renewal blockers and recommend the next two actions.",
  {
    sandbox: {
      client: new UnixLocalSandboxClient(),
    },
  }
);

console.log(result.finalOutput);
```

```python
import asyncio

from agents import Runner
from agents.run import RunConfig
from agents.sandbox import Manifest, SandboxAgent, SandboxRunConfig
from agents.sandbox.capabilities import Shell
from agents.sandbox.entries import File
from agents.sandbox.sandboxes.unix_local import UnixLocalSandboxClient

manifest = Manifest(
    entries={
        "account_brief.md": File(
            content=(
                b"# Northwind Health\n\n"
                b"- Segment: Mid-market healthcare analytics provider.\n"
                b"- Renewal date: 2026-04-15.\n"
            )
        ),
        "implementation_risks.md": File(
            content=(
                b"# Delivery risks\n\n"
                b"- Security questionnaire is not complete.\n"
                b"- Procurement requires final legal language by April 1.\n"
            )
        ),
    }
)

agent = SandboxAgent(
    name="Renewal Packet Analyst",
    model="gpt-6-astra",
    instructions=(
        "Review the workspace before answering. Keep the response concise, "
        "business-focused, and cite the file names that support each conclusion."
    ),
    default_manifest=manifest,
    capabilities=[Shell()],
)


async def main():
    result = await Runner.run(
        agent,
        "Summarize the renewal blockers and recommend the next two actions.",
        run_config=RunConfig(
            sandbox=SandboxRunConfig(client=UnixLocalSandboxClient()),
            workflow_name="Unix-local sandbox review",
        ),
    )
    print(result.final_output)


asyncio.run(main())
```


有关完整的本地示例，请参阅 TypeScript [sandbox 智能体 快速入门][sdk-js-example-basic] 和 Python [`unix_local_runner.py`][sdk-example-unix-local-runner].

### 切换提供商

该提供者属于运行配置的一部分，而非智能体定义。请保持
该 `SandboxAgent`，清单与能力的稳定，然后根据目标环境替换 sandbox
客户端和提供者选项。

本示例使用 Docker 进行本地容器隔离。托管提供者遵循
相同的模式，使用各自的客户端类和选项。

切换到 Docker

```javascript
import { run } from "@openai/agents";
import { SandboxAgent } from "@openai/agents/sandbox";
import { DockerSandboxClient } from "@openai/agents/sandbox/local";

const agent = new SandboxAgent({
  name: "Workspace reviewer",
  model: "gpt-6-astra",
  instructions: "Inspect the sandbox workspace before answering.",
});

const result = await run(agent, "Inspect the workspace.", {
  sandbox: {
    client: new DockerSandboxClient({
      image: "node:22-bookworm-slim",
    }),
  },
});

console.log(result.finalOutput);
```

```python
from docker import from_env as docker_from_env

from agents import Runner
from agents.run import RunConfig
from agents.sandbox import SandboxRunConfig
from agents.sandbox.config import DEFAULT_PYTHON_SANDBOX_IMAGE
from agents.sandbox.sandboxes.docker import (
    DockerSandboxClient,
    DockerSandboxClientOptions,
)

docker_run_config = RunConfig(
    sandbox=SandboxRunConfig(
        client=DockerSandboxClient(docker_from_env()),
        options=DockerSandboxClientOptions(image=DEFAULT_PYTHON_SANDBOX_IMAGE),
    ),
    workflow_name="Docker sandbox review",
)

result = await Runner.run(
    agent,
    "Summarize the renewal blockers and recommend the next two actions.",
    run_config=docker_run_config,
)
```


有关可运行的示例，请参阅 TypeScript [sandbox 客户端指南][sdk-js-sandbox-clients] 以及 [基础示例][sdk-js-example-basic]，另请参阅 Python [`basic.py`][sdk-example-basic] 中的提供者选择， [`docker_runner.py`][sdk-example-docker-runner] 了解 Docker 相关内容，以及 [`main.py`][sdk-example-dataroom-qa] 查看 SDK 仓库中的数据室流程。

### 高级模式

一旦基础循环可以工作，沙箱就会在以下场景中变得有用：当
智能体 需要沙箱工作区而不是更多提示上下文时。这些
示例属于 工作流 模式，而不是单独的 API：同一个运行框架可以负责路由、暂停、
resume，以及在每个沙箱将执行保持在所需的追踪的工作流附近的同时
文件、工具和端口附近。

| 示例                                                | 描述                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [Data room 问答][sdk-example-dataroom-qa]               | 基于已挂载的数据室回答问题。                    |
| [Data room 表格提取][sdk-example-dataroom]     | 从已挂载的数据室中提取表格。                     |
| [代码仓库代码评审][sdk-example-repo-code-review] | 克隆代码仓库、检查并产出代码评审产物。  |
| [视觉网站克隆][sdk-example-vision-clone]       | 使用视觉 API 克隆网站并结合截图反馈。 |
| [沙箱恢复][sdk-example-sandbox-resume]           | 在已有的沙箱中恢复工作。                        |

## 恢复或为后续工作提供起点

有用的智能体工作常常会跨越单个请求的边界。用户审阅产物时、某
个步骤需要审批时，或者下一步取决于后续事件时，都会如此。

区分清楚以下三种状态概念：

| State surface | Restores                                                                                  | Use when                                                                       |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `RunState`    | Harness-side state such as model items, tool state, approvals, and active 智能体 position. | The runner should carry the 工作流 forward across pauses.                    |
| Session state | A serialized sandbox session that a client can reconnect to.                              | Your app or job system stores provider session state directly.                 |
| `snapshot`    | Saved workspace contents used to seed a fresh sandbox session.                            | A new run should start from saved files and artifacts, not an empty workspace. |

实际运行时，执行器按以下顺序解析沙盒会话：

1. 如果传入的是实时沙盒会话，运行器会直接复用该会话。
2. 否则，如果运行从 `RunState`，恢复，运行器会从已存储的沙盒会话状态继续。
3. 否则，如果你传入显式的序列化沙盒状态，运行器会从该状态恢复。
4. 否则，运行器会创建一个全新的沙盒会话。对于该全新会话，如果提供了每次运行的清单，则使用该清单；否则使用智能体的默认清单。

沙箱恢复示例会序列化已停止的会话状态，然后通过同一个客户端恢复它
，并把恢复后的会话重新传入下一次
运行：

序列化并恢复沙箱状态

```javascript
import { run } from "@openai/agents";
import { Manifest, SandboxAgent } from "@openai/agents/sandbox";
import { UnixLocalSandboxClient } from "@openai/agents/sandbox/local";

const manifest = new Manifest();
const client = new UnixLocalSandboxClient({
  snapshot: { type: "local", baseDir: "/tmp/my-sandbox-snapshots" },
});
const agent = new SandboxAgent({
  name: "Workspace builder",
  model: "gpt-6-astra",
  instructions: "Inspect the sandbox workspace before answering.",
});

const session = await client.create({ manifest });
let conversation = [];
let frozenSessionState;

try {
  const firstResult = await run(agent, "Build the first version of the app.", {
    maxTurns: 20,
    sandbox: { session },
  });

  conversation = firstResult.history;
  frozenSessionState = await client.serializeSessionState?.(session.state);
} finally {
  await session.close?.();
}

if (!frozenSessionState || !client.deserializeSessionState || !client.resume) {
  throw new Error("Sandbox client does not support session resume.");
}

const resumedSession = await client.resume(
  await client.deserializeSessionState(frozenSessionState)
);

try {
  conversation.push({
    role: "user",
    content: "Continue from the existing workspace and add tests.",
  });

  await run(agent, conversation, {
    maxTurns: 20,
    sandbox: { session: resumedSession },
  });
} finally {
  await resumedSession.close?.();
}
```

```python
async with session:
    first_result = await Runner.run(
        agent,
        "Build the first version of the app.",
        max_turns=20,
        run_config=RunConfig(
            sandbox=SandboxRunConfig(session=session),
            workflow_name="Sandbox resume example",
        ),
    )

conversation = first_result.to_input_list()
frozen_session_state = client.deserialize_session_state(
    client.serialize_session_state(session.state)
)

conversation.append(
    {
        "role": "user",
        "content": "Continue from the existing workspace and add tests.",
    }
)

resumed_session = await client.resume(frozen_session_state)
try:
    async with resumed_session:
        second_result = await Runner.run(
            agent,
            conversation,
            max_turns=20,
            run_config=RunConfig(
                sandbox=SandboxRunConfig(session=resumed_session),
                workflow_name="Sandbox resume example",
            ),
        )
finally:
    await client.delete(resumed_session)
```


新增会话输入（如 `manifest` 以及 `snapshot` ）仅在
运行器创建新的沙箱会话时生效。如果你注入的是已 `session`，能力
处理可以添加兼容的非挂载条目，但不能更改根、
环境、用户或用户组；不能移除已有条目；不能替换条目类型；也不能
在已运行的沙箱上添加或更改挂载条目。

这种拆分让框架能够在沙箱提供程序
恢复或重建工作区的同时，恢复智能体循环。这些路径的当前示例代码位于
TypeScript 的 [恢复会话状态示例][sdk-js-example-resume] 以及
Python [`main.py`][sdk-example-sandbox-resume] 以及
[`sandbox_agent_with_remote_snapshot.py`][sdk-example-remote-snapshot].

## 在多次运行间持久化记忆

沙箱记忆让未来的沙箱智能体运行可以从先前的运行中学习。它
独立于SDK管理的会话 `Session` 记忆：会话保留
消息历史，而沙箱记忆则从先前的
工作区运行中提炼出有用的经验，存入智能体稍后可以读取的文件。

当智能体需要跨轮次保留用户偏好、修正、
项目特定的经验或任务摘要，而无需重放之前每个
回合时，可使用记忆。恢复和快照保留工作区状态；记忆则保留关于
在工作区中已完成工作的可复用指导。

启用沙箱记忆

```javascript
import {
  Manifest,
  SandboxAgent,
  filesystem,
  memory,
  shell,
} from "@openai/agents/sandbox";

const manifest = new Manifest();

const agent = new SandboxAgent({
  name: "Memory-enabled reviewer",
  instructions:
    "Inspect the workspace and retain useful lessons for follow-up runs.",
  defaultManifest: manifest,
  capabilities: [memory(), filesystem(), shell()],
});
```

```python
from agents.sandbox.capabilities import Filesystem, Memory, Shell

agent = SandboxAgent(
    name="Memory-enabled reviewer",
    instructions="Inspect the workspace and retain useful lessons for follow-up runs.",
    default_manifest=manifest,
    capabilities=[Memory(), Filesystem(), Shell()],
)
```


默认情况下，记忆同时启用读取和生成。记忆读取需要 shell
访问权限，以便智能体能够搜索和打开记忆文件。默认情况下，实时记忆
更新也需要文件系统访问，以便智能体能够修复过期的记忆或
在用户提出要求时更新记忆。

记忆读取采用渐进式披露。SDK会在 `memory_summary.md` 运行
开始时注入，智能体在检测到先前工作 `MEMORY.md` 可能相关时进行搜索
，并且仅在需要更多细节时才打开汇总记录。

| Memory mode          | 适用场景                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| 默认读写   | 智能体应读取已有记忆并生成新记忆。          |
| 只读记忆     | 智能体应读取记忆，但在运行结束后不生成新记忆。 |
| 仅生成记忆 | 运行应生成记忆，但不使用已有记忆。           |
| 读取配置          | 你需要禁用实时更新。                                       |
| 生成配置      | 你需要调优生成行为，例如额外的提示词。                  |
| 布局配置        | 智能体在同一沙箱工作区中需要相互隔离的记忆布局。      |

默认情况下，memory 工件存放在沙盒工作区中：

```text
workspace/
  sessions/
    <rollout-id>.jsonl
  memories/
    memory_summary.md
    MEMORY.md
    raw_memories.md
    phase_two_selection.json
    raw_memories/
      <rollout-id>.md
    rollout_summaries/
      <rollout-id>_<slug>.md
    skills/
```

运行时会沙盒会话期间追加运行片段。当会话
关闭时，memory 生成过程首先提取对话摘要和原始
memory，然后将这些原始 memory 整合到 `MEMORY.md` 以及
`memory_summary.md`。中。若要在后续运行中复用 memory，请通过保持同一个在线沙盒会话、从
会话状态恢复、从快照启动，或挂载持久化存储（如
会话状态恢复、从快照启动，或挂载持久化存储（如
S3）来保留配置的 memory 目录。

对于多轮沙盒聊天，请使用稳定的 SDK 会话以及同一个
在线沙盒会话。Memory 会按以下顺序对运行进行分组：显式的会话 ID，然后是
SDK 会话 ID，然后是运行组 ID，最后是自动生成的每个运行 ID。
沙盒会话 ID 用于标识在线工作区，它本身并不是 memory
的会话 ID。

有关可运行的示例，请参阅 TypeScript [memory 指南][sdk-js-sandbox-memory],
以及 Python [`memory.py`][sdk-example-memory] 了解本地快照流程，
[`memory_s3.py`][sdk-example-memory-s3] 了解基于 S3 的 memory 存储，以及
[`memory_multi_agent_multiturn.py`][sdk-example-memory-multi-agent] 了解不同的
memory 布局应用于不同的 智能体。

## 编写沙箱智能体

沙箱 智能体 与 SDK 的其余部分组合使用。

当非沙箱入口 智能体 只应将工作区相关的部分
工作流 委托给沙箱 智能体 时，使用 交接。顶层运行
会继续，但沙箱 智能体 会在下一轮成为当前 智能体。

当外层编排器应将一个或多个沙箱 智能体 作为工具调用时，使用
智能体 作为嵌套工具。每个沙箱工具 智能体 可以拥有自己的沙箱运行
配置、沙箱客户端、清单和 provider 选项。

相关示例，请参阅 [`handoffs.py`][sdk-example-handoffs] 以及
[`sandbox_agents_as_tools.py`][sdk-example-agents-as-tools].

## 沙盒提供商

从 Unix 本地方式开始以进行快速的本地迭代，或者当你需要本地容器隔离时使用 Docker
容器隔离。当任务需要托管执行、提供商特定的隔离、扩缩容、预览版、存储挂载、
快照，或应保存在应用服务器外部的凭据时，迁移到托管提供商。
快照，或应保存在应用服务器外部的凭据时，迁移到托管提供商。

参考提供商文档了解提供商特定的设置、凭据、隔离、存储、
预览版和持久化行为。

| Provider   | SDK 客户端                | 文档与示例                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blaxel     | `BlaxelSandboxClient`     | [Sandbox 概述](https://docs.blaxel.ai/Sandboxes/Overview)                                                                                                                                                                                                                                                                                                                                                   |
| Cloudflare | `CloudflareSandboxClient` | [Sandbox 文档](https://developers.cloudflare.com/sandbox/)<br />[OpenAI 智能体 教程](https://docs.cloudflare.com/sandbox/tutorials/openai-agents/)<br />[Sandbox Bridge 示例](https://github.com/cloudflare/sandbox-sdk/tree/main/bridge/examples)                                                                                                                       |
| Daytona    | `DaytonaSandboxClient`    | [Sandbox 文档](https://www.daytona.io/docs/en/sandboxes/)<br />[OpenAI Agents SDK 指南](https://www.daytona.io/docs/en/guides/openai-agents/openai-agents-sdk-with-sandboxes)                                                                                                                                                                                                              |
| Docker     | `DockerSandboxClient`     | [Docker 文档](https://docs.docker.com/)<br />[TypeScript Docker SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/docker-client.ts)<br />[Python Docker SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/docker/docker_runner.py)                                                             |
| E2B        | `E2BSandboxClient`        | [Sandbox 文档](https://e2b.dev/docs)<br />[OpenAI Agents SDK 指南](https://e2b.dev/docs/agents/openai-agents-sdk)<br />[发布博客](https://e2b.dev/blog/e2b-is-now-in-agents-sdk)                                                                                                                                                                                             |
| Modal      | `ModalSandboxClient`      | [Sandbox 指南](https://modal.com/docs/guide/sandboxes)<br />[集成博客](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)<br />[示例仓库](https://github.com/modal-labs/openai-agents-python-example)<br />[Modal 扩展参考](https://github.com/modal-labs/openai-agents-python-example?tab=readme-ov-file#modal-extension-reference) |
| Runloop    | `RunloopSandboxClient`    | [Devbox 概述](https://docs.runloop.ai/docs/devboxes/overview)<br />[Tunnels](https://docs.runloop.ai/docs/devboxes/tunnels)                                                                                                                                                                                                                                                                      |
| Unix-local | `UnixLocalSandboxClient`  | [TypeScript 本地 SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/basic.ts)<br />[Python 本地 SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/unix_local_runner.py)                                                                                                                                           |
| Vercel     | `VercelSandboxClient`     | [Sandbox 文档](https://vercel.com/docs/vercel-sandbox)<br />[OpenAI Agents SDK 指南](https://vercel.com/kb/guide/building-an-agent-with-openai-agents-sdk-and-vercel-sandbox)<br />[FastAPI 模板](https://vercel.com/templates/template/openai-agents-sdk-with-fastapi)<br />[示例应用](https://github.com/vercel-labs/openai-agents-fastapi-starter)          |

[sdk-example-agents-as-tools]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/sandbox_agents_as_tools.py
[sdk-example-basic]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/basic.py
[sdk-example-dataroom]: https://github.com/openai/openai-agents-python/tree/main/examples/sandbox/tutorials/dataroom_metric_extract
[sdk-example-dataroom-qa]: https://github.com/openai/openai-agents-python/tree/main/examples/sandbox/tutorials/dataroom_qa
[sdk-example-docker-runner]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/docker/docker_runner.py
[sdk-example-handoffs]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/handoffs.py
[sdk-example-memory]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/memory.py
[sdk-example-memory-multi-agent]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/memory_multi_agent_multiturn.py
[sdk-example-memory-s3]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/memory_s3.py
[sdk-example-remote-snapshot]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/sandbox_agent_with_remote_snapshot.py
[sdk-example-repo-code-review]: https://github.com/openai/openai-agents-python/tree/main/examples/sandbox/tutorials/repo_code_review
[sdk-example-sandbox-resume]: https://github.com/openai/openai-agents-python/tree/main/examples/sandbox/tutorials/sandbox_resume
[sdk-example-unix-local-runner]: https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/unix_local_runner.py
[sdk-example-vision-clone]: https://github.com/openai/openai-agents-python/tree/main/examples/sandbox/tutorials/vision_website_clone
[sdk-js-example-basic]: https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/basic.ts
[sdk-js-example-resume]: https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/resume-session-state.ts
[sdk-js-sandbox-clients]: https://openai.github.io/openai-agents-js/guides/sandbox-agents/clients
[sdk-js-sandbox-memory]: https://openai.github.io/openai-agents-js/guides/sandbox-agents/memory