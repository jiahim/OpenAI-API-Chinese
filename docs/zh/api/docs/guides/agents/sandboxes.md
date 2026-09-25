# Sandbox 智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

沙箱为智能体提供了一个隔离的、类 Unix 的执行环境,其中带有一个
文件系统、shell、已安装的包、已挂载的数据、已暴露的端口以及快照,
并可对外部系统进行受控访问。

当模型需要这类工作区,但智能体工作流
只接收到提示上下文时,就会变得脆弱。大型文档集、生成的工件、
命令、预览以及可恢复的工作,都需要一个智能体能够
检视和修改的环境。

沙箱智能体可在 TypeScript 和 Python 的 Agents SDK 中使用。

本指南介绍的是 Agents SDK 中的沙箱,此时由你的应用来运行编排器。若使用 OpenAI 托管的编排器,请使用 [智能体 API:连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

当智能体需要操作文件、运行命令、挂载一个
数据室、生成工件、暴露服务,或是在稍后继续有状态的工作时,
请使用沙箱。

关键的划分在于编排器与计算之间的边界。编排器是
模型周围的控制平面:它负责智能体循环、模型调用、工具
路由、交接、审批、追踪、恢复以及运行状态。计算则是
沙箱执行平面,模型所驱动的工作在其中读取和写入文件、运行
命令、安装依赖、使用挂载的存储、暴露端口,以及
对状态进行快照。

将这两层边界分开,可以让你的应用继续保留敏感的控制
基础设施中处理更广义的工作，而沙箱则专注于
特定于提供方的执行。沙箱可以使用受限的凭据和挂载点对文件运行
代码；harness 则可以将鉴权、计费、审计日志、人工
审核和恢复状态保留在任何单个容器之外。



  <figure>
    

![Diagram showing an agent harness running inside sandbox compute with filesystem access and gateway-mediated access to data, APIs, and the web.](<https://developers.openai.com/images/api/agents/harness_with_compute.png>)


    <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
      Running the harness inside the sandbox can be convenient for prototypes,
      but it puts orchestration and model-directed execution in the same compute
      boundary.
    </figcaption>
  </figure>

  <figure>
    

![Diagram showing an agent harness separate from sandbox compute, where the harness accesses trusted services and the sandbox executes commands against a filesystem.](<https://developers.openai.com/images/api/agents/harness_separate_from_compute.png>)


    <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
      The harness can run in your infrastructure while the sandbox handles
      provider-specific, stateful execution.
    </figcaption>
  </figure>



## 何时使用沙箱

当智能体的答案依赖于在沙箱中完成的工作（而不仅仅是对提示词上下文的推理）时，请使用沙箱
工作区，而不仅仅是对提示词上下文进行推理。

常见痛点包括：

- 任务需要的不是单个 prompt，而是一个文档目录。
- 智能体 应写出你的应用之后可以查看的文件。
- 智能体 需要命令、包或脚本来完成任务。
- 该工作流 会产出 Markdown、CSV、JSONL、截图或生成的网站等制品。
- 某个服务、Notebook 或报告预览需要在暴露的端口上运行。
- 工作暂停等待人工审核，然后在同一工作区中继续。

如果你的工作流只需要简短的模型响应，而不需要持久化工作区，
可以直接调用 [Responses API](https://developers.openai.com/api/reference/responses/overview) ，也可以使用
基础的 Agents SDK 运行时，且不使用沙箱。

如果 shell 访问只是偶尔使用的工具，可以从托管 shell 工具入手，详见
[使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)。如果工作区隔离、沙盒提供商选择或可恢复
智能体
文件系统状态属于产品设计的一部分，请使用沙盒。

## 沙箱的作用

`SandboxAgent` 仍然是一 `Agent`。它保留了常规的 智能体 接口，包括
`instructions`, `prompt`, `tools`, `handoffs`, MCP 服务器、模型设置、
结构化输出、护栏和钩子。发生改变的是执行边界：
运行器会针对拥有文件、
命令、端口和特定于提供商的隔离的活动沙箱会话来准备 智能体。

| 组件              | 职责范围                                                     | 设计问题                                                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SandboxAgent`     | 智能体 定义及沙箱默认值                       | 该 智能体 应承担哪些职责，并附带哪些沙箱默认值？                             |
| `Manifest`         | 新会话工作区契约                             | 工作区初始包含哪些文件、目录、代码仓库、挂载点、环境变量、用户或用户组？ |
| 能力       | 绑定到 智能体 的沙箱原生行为                    | 此 智能体 需要哪些沙箱工具、指令或运行时行为？                      |
| 沙箱客户端     | 提供者集成                                         | 实时工作区应在何处运行：Unix 本地、Docker 还是托管提供者？                    |
| 沙箱会话    | 实时执行环境                                   | 命令在哪里执行、文件在哪里变更、端口在哪里开放，以及提供者状态如何存放？                         |
| 沙箱运行配置 | 单次运行的沙箱会话来源、客户端选项及新输入 | 此次运行应注入、恢复还是新建沙箱会话？                                    |
| 已保存状态        | `RunState`序列化会话状态和快照              | 后续运行应如何重新连接以恢复工作或初始化新的工作区？                                  |

沙箱相关的默认值应放在 `SandboxAgent`。每次运行的沙箱会话
选项属于该运行的沙箱配置。

沙箱 智能体 也不会改变“turn”的含义。turn 仍然是由模型
步，而非单个 shell 命令或沙箱操作。有些工作可能停留在
沙箱执行层内部。只有当智能体运行时需要在沙箱工作完成后再获取一次模型响应时，才会消耗另一轮
交互。

## 创建工作区

`Manifest` 描述全新 sandbox 工作区所需的初始内容和布局。
用它来声明该智能体应当看到的文件、仓库、输入制品、辅助文件、
挂载点、输出目录以及环境配置。智能体 应据此进行准备。

把清单视为一次新会话的契约，而不是每个实时 sandbox 的完整事实来源。
实际生效的工作区内容也可能来自其他地方，例如
被复用的实时 sandbox 会话、序列化后的 sandbox 会话状态，或运行时
选择的快照。

清单中的条目路径都是相对于工作区的。它们不能是绝对路径，也不能通过
.. 跳出工作区， `..`，这样做可以让工作区契约在本地、Docker 以及托管客户端之间保持一致。
本文保留此结构，以便在本地、Docker 和托管客户端之间复用。

| 清单输入                                                                 | 用于                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `File`, `Dir`                                                                  | 小型合成输入、辅助文件或输出目录。                          |
| 本地文件或目录                                                        | 要具体化到沙盒中的宿主文件或目录。                            |
| Git 仓库                                                                       | 要拉取到工作区中的仓库。                                             |
| `S3Mount`, `GCSMount`, `R2Mount`, `AzureBlobMount`, `BoxMount`, `S3FilesMount` | 在沙盒内可用的外部存储。                                |
| `environment`                                                                  | 沙盒启动时需要的环境变量。                               |
| `users` 和 `groups`                                                           | 支持账户置备的提供商所使用的沙盒本地 OS 账户和组。 |

良好的清单设计意味着：

- 在清单中放置仓库、输入制品和输出目录。
- 将较长的任务规格和仓库本地说明放在工作区文件中，例如 `repo/task.md` 或 `AGENTS.md`.
- 在说明中使用相对工作区路径，例如 `repo/task.md` 或 `output/report.md`.
- 将挂载存储的范围限定为 智能体 应读取或写入的输入。
- 将挂载项视为临时的工作区条目：快照和持久化流程会跳过挂载的远程存储，而不是将其复制到已保存的工作区内容中。

### 挂载文件与存储

有用的数据通常已经存在于其他地方。与其将大段文档粘贴到上下文中，不如将它们挂载到沙盒中，让智能体直接处理
文件。
文件。

示例：

- 挂载一个尽职调查数据室，并要求智能体生成一份带有引用的摘要。
- 挂载一份支持工单导出，并要求智能体将问题聚类整理成报告。
- 挂载已生成的工件，以便另一个系统可以审查它们。

Provider 集成会暴露各自的挂载助手、凭证处理方式以及持久化行为。请保持应用契约不变：仅挂载
持久化相关的部分。
inputs the 智能体 should use, tell the 智能体 where to read and write, and check
generated artifacts before using them.

### 处理密钥和凭据

将沙盒凭据视为运行时配置，而非提示内容。
智能体 可能需要访问包管理器、存储挂载或提供方的凭据，
提供方的 API，但这些凭据不应出现在用户提示、
智能体 指令、任务文件、已提交的清单或生成的制品中。

请遵循以下规则：

- 对托管沙箱提供商，优先使用提供商原生的密钥系统。
- 将云存储凭证的作用范围限定在需要它们的挂载或提供商选项内。
- 使用 `Manifest.environment` 为沙箱进程在启动时需要的值，并将敏感或生成的条目标记为临时（ephemeral），以便在需要时重新生成而不是持久保存它们。
- 避免保存不应在本次运行中保留的密钥、生成的挂载配置、本地令牌或文件。
- 在将产物移出沙箱之前进行审查，尤其是在智能体可以读取私密文档或挂载存储的情况下。

SDK 支持清单环境值以及特定提供商的挂载
凭据。通用的密钥存储集成因提供商而异，因此本
页聚焦于契约本身：你的运行时或沙箱提供商应当注入
凭据，而不是把它们当作指令教给模型。

## 赋予智能体能力

能力（Capabilities）为某个 `SandboxAgent`。附加沙箱原生行为。它们可以在运行开始前塑造
工作区，追加沙箱相关的指令，暴露
绑定到实时沙箱会话的工具，并调整该智能体的模型行为或输入
处理逻辑。智能体。

| 能力                              | 适用场景                                                  | 说明                                                                                |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Shell`                                 | 智能体需要 shell 访问权限。                                | 添加命令执行能力，并在沙箱客户端支持时支持交互输入。 |
| `Filesystem`                            | 智能体需要编辑文件或查看本地图片。       | 添加 `apply_patch` 和 `view_image`；补丁路径相对于工作区根目录。        |
| `Skills`                                | 你希望在沙箱中进行技能发现和实例化。 | 优先选择此项，而不是手动挂载 `.agents` 或 `.agents/skills`.                    |
| [`Memory`](#persist-memory-across-runs) | 后续运行需要读取或生成记忆产物。     | 需要 `Shell`；实时记忆更新同样需要 `Filesystem`.                     |
| `Compaction`                            | 长时间运行的工作流需要进行上下文裁剪。                    | 在压缩项之后调整模型行为和输入处理。                    |

默认情况下，智能体 `SandboxAgent` 包含文件系统、shell 和压缩
能力。如果传入能力 `capabilities` 列表，则会替换默认列表，
因此请包含该智能体仍然需要的任何默认能力。

在合适时优先使用内置能力。只有当内置能力
无法满足你的需求，需要特定沙箱的工具或指令面时，才编写自定义
能力。

### Load skills

某些任务在开始前需要可重复使用的指令、脚本、引用或资源。
智能体 启动之前准备就绪。使用该 `Skills` 能力后，智能体 可以在运行中发
现运行期间的工作上下文。

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


根据你想要的实例化方式选择技能来源：

- 当希望模型先发现索引并按需加载时，对较大的本地技能目录使用惰性本地目录源。
- 对较小的本地捆绑包使用本地目录源以便提前预置。
- 当技能捆绑包有独立的发布节奏或被多个沙箱使用时，使用 Git 仓库源。

### 公开预览和端口

有时产物不是文件，而是一个正在运行的进程。当智能体在本地创建应用、笔记本、报告服务器、浏览器
预览或你需要在沙箱外查看的其他服务时，可以使用对外暴露的端口。
预览或其他你需要在沙箱外部查看的服务时，请使用对外暴露的端口。

端口配置因提供商而异，但产品契约是相同的：
智能体在沙箱内启动该服务，沙箱客户端暴露该端口，
随后你的应用即可共享或查看所得到的预览 URL。

## 运行沙箱 智能体

最短可用的沙箱循环是：

1. 构建一个 `Manifest` 来描述工作区。
2. 创建一个 `SandboxAgent` ，赋予模型所需的能力。
3. 为应当运行工作的环境选择一个沙箱客户端。
4. 使用每次运行的沙箱配置运行智能体。
5. 检查、复制、恢复或快照化对你的应用有意义的产物。

在 macOS 或 Linux 上进行本地开发时，从 Unix-local 开始。它为你提供
最短的本地循环，因为运行器可以从智能体的默认清单创建一个临时工作区，并在运行后清理它。
智能体's default manifest and clean it up after the run.

运行一个 Unix-local 沙箱 智能体

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


如需完整的本地示例，请参阅 TypeScript [沙箱 智能体 快速入门][sdk-js-example-basic] 和 Python [`unix_local_runner.py`][sdk-example-unix-local-runner].

### 切换提供商

该 provider 属于运行配置的一部分，而非 智能体 定义。请保持
该 `SandboxAgent`，清单与能力稳定，再根据目标环境切换 sandbox
的 client 与 provider 选项。

本示例使用 Docker 进行本地容器隔离。托管 provider 沿用
相同的模式，并使用它们自己的 client 类与选项。

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


有关可运行的示例，请参阅 TypeScript [sandbox 客户端指南][sdk-js-sandbox-clients] 以及 [基础示例][sdk-js-example-basic]，以及 Python 的 [`basic.py`][sdk-example-basic] 以了解 provider 选择， [`docker_runner.py`][sdk-example-docker-runner] 对应 Docker 示例，以及 [`main.py`][sdk-example-dataroom-qa] 对应 SDK 仓库中的 data-room 工作流。

### 进阶模式

一旦基础循环能够工作，沙箱就可以用于以下工作流：
智能体 需要一个沙箱工作区而不是更多的提示上下文。这些
示例是工作流模式，而不是单独的API：同一个脚手架可以路由、暂停、
resume，以及在每个沙箱将执行保持在所需的追踪工作流的同时
文件、工具和端口附近。

| 示例                                                | 说明                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [数据室问答][sdk-example-dataroom-qa]               | 基于已挂载的数据室回答问题。                    |
| [数据室表格提取][sdk-example-dataroom]     | 从已挂载的数据室中提取表格。                     |
| [代码仓库代码审查][sdk-example-repo-code-review] | 克隆代码仓库，对其进行检查，并生成代码审查产物。  |
| [视觉网站克隆][sdk-example-vision-clone]       | 使用 Vision API 并结合截图反馈来克隆网站。 |
| [沙箱恢复][sdk-example-sandbox-resume]           | 在已有的沙箱中恢复工作。                        |

## 恢复或为后续工作设定起点

有用的智能体工作常常会持续超过一次请求。例如，用户会审阅一份产出物，或者某一步需要批准，亦或下一步依赖于后续发生的事件。
步骤需要审批，或者下一步取决于后续事件。

将三个状态概念分开处理：

| 状态表现层 | 是否恢复                                                                                  | 使用场景                                                                       |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `RunState`    | 运行器侧的状态，例如模型条目、工具状态、审批以及当前 智能体 位置。 | 运行器应在暂停期间继续推进该 工作流。                    |
| 会话状态 | 客户端可重新连接的、已序列化的沙盒会话。                              | 你的应用或任务系统直接存储服务端的会话状态。                 |
| `snapshot`    | 用于为新的沙盒会话提供初始内容的已保存工作区内容。                            | 新运行应从已保存的文件和制品开始，而不是从空工作区开始。 |

实际上，运行器按以下顺序解析沙箱会话：

1. 如果传入一个在线沙盒会话，运行器会直接复用该会话。
2. 否则，如果运行从 `RunState`，处恢复，运行器会从已存储的沙盒会话状态恢复。
3. 否则，如果你传入显式的序列化沙盒状态，运行器会从该状态恢复。
4. 否则，运行器会创建一个全新的沙盒会话。对于该全新会话，如果提供了每次运行的清单则使用它，否则使用智能体的默认清单。

沙箱恢复示例会序列化已停止的会话状态，将其恢复
通过同一个客户端，然后将恢复后的会话传回下一次
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


仅新会话的输入（例如 `manifest` 以及 `snapshot` 仅在
运行器创建新的沙箱会话时生效。如果你注入一个正在运行的 `session`，能力
处理可以添加兼容的非挂载条目，但不能更改根、
环境、用户或用户组；也不能移除现有条目、更换条目类型；也
不能在已经运行的沙箱上添加或更改挂载条目。

这种拆分让框架能够在沙箱提供商恢复或重建工作区的同时，恢复智能体循环
。这些路径当前的示例代码位于
TypeScript 的 [resume session state 示例][sdk-js-example-resume] 以及
Python [`main.py`][sdk-example-sandbox-resume] 以及
[`sandbox_agent_with_remote_snapshot.py`][sdk-example-remote-snapshot].

## 在多次运行间持久化记忆

沙箱记忆让未来的沙箱智能体运行可以从先前的运行中学习。它
独立于 SDK 管理的对话 `Session` 记忆：会话保留
消息历史，而沙箱记忆则从先前的
工作区运行中提炼出有用的经验，写入智能体日后可读取的文件。

当智能体需要在不重放每一轮先前，
对话的前提下，跨运行保留用户偏好、修正、
项目特定经验或任务摘要时，使用记忆。Resume 和快照用于保留工作区状态；记忆则用于保留
关于工作区中已完成工作的可复用指导。

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


记忆默认同时启用读取与生成。读取记忆需要 shell
访问权限，以便智能体能够搜索并打开记忆文件。默认情况下，实时记忆
更新也需要文件系统访问权限，以便智能体能够修复过时的记忆或
在用户要求时更新记忆。

记忆读取采用渐进式披露。SDK 在 `memory_summary.md` 一次
运行开始时注入相关记忆，智能体会搜索 `MEMORY.md` 先前工作是否看起来
相关，仅在需要更多细节时才打开汇总记录。

| Memory mode          | 使用场景                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| Default read/write   | 智能体 应读取已有 memory 并生成新的 memory。          |
| Read-only memory     | 智能体 应读取 memory,但在运行结束后不生成新的 memory。 |
| Generate-only memory | 该运行应在不使用已有 memory 的情况下生成 memory。           |
| Read config          | 你需要禁用实时更新。                                       |
| Generate config      | 你需要调整生成配置,例如额外的提示词。                  |
| Layout config        | 智能体 需要在同一沙箱工作区中使用隔离的 memory 布局。      |

默认情况下，memory 制品存放在沙箱工作区中：

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

运行时会随着沙箱会话的进行追加运行片段。当会话
结束时，memory 生成过程首先提取对话摘要和原始记忆，
然后将这些原始记忆整合为 `MEMORY.md` 以及
`memory_summary.md`。若要在后续运行中复用 memory，请保留已配置的
memory 目录，具体做法是保持同一个实时沙箱会话、从
会话状态恢复、从快照启动，或者挂载持久化存储，例如
S3。

对于多轮沙箱聊天，请使用稳定的 SDK 会话并搭配同一个
实时沙箱会话。memory 会先按显式的对话 ID 对运行分组，然后
按 SDK 会话 ID，再按运行组 ID，最后按生成的每运行 ID 进行分组。
沙箱会话 ID 用于标识实时工作区，它并不是 memory
的对话 ID。

有关可运行的示例，请参阅 TypeScript [memory 指南][sdk-js-sandbox-memory],
以及 Python 的本地快照流程 [`memory.py`][sdk-example-memory] ，了解 S3 备份的 memory 存储方式，
[`memory_s3.py`][sdk-example-memory-s3] 了解 S3 支持的 memory 存储方式，以及
[`memory_multi_agent_multiturn.py`][sdk-example-memory-multi-agent] 了解如何在不同 智能体 之间
使用各自的 memory 布局。

## 组合沙盒智能体

沙箱 智能体 可与 SDK 的其余部分组合使用。

当非沙箱接入 智能体 只需将工作区繁重部分委托给沙箱 交接时，使用交接。
使用交接将 工作流 中工作区繁重部分委托给沙箱 智能体。顶层运行
继续，但沙箱 智能体 成为下一轮的活跃 智能体。

当外部编排器应调用一个或多个沙盒智能体作为工具时
将智能体用作嵌套工具。每个沙盒工具-智能体可以拥有自己的沙盒运行
配置、沙盒客户端、清单和提供方选项。

有关示例，请参阅 [`handoffs.py`][sdk-example-handoffs] 以及
[`sandbox_agents_as_tools.py`][sdk-example-agents-as-tools].

## Sandbox providers

从 Unix-local 开始以便快速本地迭代，或在你需要本地容器隔离时使用 Docker。当任务需要托管执行、供应商特定的隔离、扩容、preview、存储挂载、快照，或应存放在应用服务器之外的凭据时，迁移到托管供应商。
container isolation. Move to a hosted provider when the task needs managed
execution, provider-specific isolation, scaling, previews, storage mounts,
snapshots, or credentials that should live outside your application server.

供应商特定的设置、凭据、隔离、存储、preview 以及持久化行为请参阅供应商文档。
previews, and persistence behavior.

| 提供商   | SDK 客户端                | 文档和示例                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blaxel     | `BlaxelSandboxClient`     | [Sandbox 概述](https://docs.blaxel.ai/Sandboxes/Overview)                                                                                                                                                                                                                                                                                                                                                   |
| Cloudflare | `CloudflareSandboxClient` | [Sandbox 文档](https://developers.cloudflare.com/sandbox/)<br />[OpenAI 智能体 教程](https://docs.cloudflare.com/sandbox/tutorials/openai-agents/)<br />[Sandbox Bridge 示例](https://github.com/cloudflare/sandbox-sdk/tree/main/bridge/examples)                                                                                                                       |
| Daytona    | `DaytonaSandboxClient`    | [Sandbox 文档](https://www.daytona.io/docs/en/sandboxes/)<br />[OpenAI Agents SDK 指南](https://www.daytona.io/docs/en/guides/openai-agents/openai-agents-sdk-with-sandboxes)                                                                                                                                                                                                              |
| Docker     | `DockerSandboxClient`     | [Docker 文档](https://docs.docker.com/)<br />[TypeScript Docker SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/docker-client.ts)<br />[Python Docker SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/docker/docker_runner.py)                                                             |
| E2B        | `E2BSandboxClient`        | [Sandbox 文档](https://e2b.dev/docs)<br />[OpenAI Agents SDK 指南](https://e2b.dev/docs/agents/openai-agents-sdk)<br />[发布博客](https://e2b.dev/blog/e2b-is-now-in-agents-sdk)                                                                                                                                                                                             |
| Modal      | `ModalSandboxClient`      | [Sandbox 指南](https://modal.com/docs/guide/sandboxes)<br />[集成博客](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)<br />[示例仓库](https://github.com/modal-labs/openai-agents-python-example)<br />[Modal 扩展参考](https://github.com/modal-labs/openai-agents-python-example?tab=readme-ov-file#modal-extension-reference) |
| Runloop    | `RunloopSandboxClient`    | [Devbox 概览](https://docs.runloop.ai/docs/devboxes/overview)<br />[Tunnels](https://docs.runloop.ai/docs/devboxes/tunnels)                                                                                                                                                                                                                                                                      |
| Unix 本地 | `UnixLocalSandboxClient`  | [TypeScript 本地 SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/basic.ts)<br />[Python 本地 SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/unix_local_runner.py)                                                                                                                                           |
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