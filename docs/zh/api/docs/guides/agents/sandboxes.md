# Sandbox 智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

沙箱为智能体提供一个独立的类 Unix 执行环境，其中包含
文件系统、shell、已安装的软件包、挂载的数据、暴露的端口、快照，
以及对外部系统的受控访问。

当模型需要这类工作区但智能体工作流
只能获得提示词上下文时，它们会变得脆弱。海量文档集、生成的制品、
命令、预览以及可恢复的工作，都需要一个智能体能够
检查和修改的环境。

沙箱智能体在 TypeScript 和 Python Agents SDK 中可用。它
  们处于测试阶段，因此 API 细节、默认值和支持的能力可能会变化。

本指南介绍 Agents SDK 中的沙箱，其中由你的应用负责运行 harness。对于由 OpenAI 管理的 harness，请使用 [智能体 API：连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

在智能体需要操作文件、运行命令、挂载
数据集、生成制品、暴露服务或继续有状态工作时使用沙箱，
以便稍后继续。

关键的划分在于 harness 与 compute 之间的边界。Harness 是
模型周围的控制平面：它负责智能体循环、模型调用、工具
路由、交接、审批、追踪、恢复以及运行状态。Compute 是
沙箱执行平面，模型驱动的工作在其中读写文件、运行
命令、安装依赖、使用挂载的存储、暴露端口，并对
状态进行快照。

将这些边界分开，让你的应用把敏感控制平面工作保留在受信基础设施中，
而沙盒则专注于特定提供方的执行。沙盒可以使用受限凭据和挂载对文件运行代码；
而沙盒则专注于特定提供方的执行。沙盒可以使用受限凭据和挂载对文件运行代码；
编排框架则可以把鉴权、计费、审计日志、人工审核和恢复状态保留在任
编排框架则可以把鉴权、计费、审计日志、人工审核和恢复状态保留在任一容器之外。



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

当智能体的答案依赖于在沙盒中完成的工作时使用沙盒
工作区，而不仅仅是基于提示上下文进行推理。

常见的痛点包括：

- 任务需要一个文档目录，而不是单个提示。
- 该智能体应当写入你的应用稍后可以查看的文件。
- 该智能体需要命令、软件包或脚本来完成任务。
- 该工作流会生成诸如 Markdown、CSV、JSONL、截图或生成的网站之类的产物。
- 服务、Notebook 或报告预览需要运行在已暴露的端口上。
- 工作暂停以等待人工审核，然后在同一工作区中继续。

如果你的工作流只需要简短的模型响应，并且不需要持久化工作区，
请直接调用 [Responses API](https://developers.openai.com/api/reference/responses/overview) ，或者使用
不带沙箱的基础 Agents SDK 运行时。

如果 shell 访问只是一个偶尔使用的工具，可以先使用
[使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)。中提供的托管 shell 工具。当工作区隔离、沙箱提供方选择或可恢复的智能体
智能体
文件系统状态属于产品设计的一部分时，使用 sandbox 智能体。

## 沙箱带来的额外能力

`SandboxAgent` 仍然是一个 `Agent`。它保留了常见的 智能体 界面，包括
`instructions`, `prompt`, `tools`, `handoffs`、MCP 服务器、模型设置、
结构化输出、护栏和钩子。发生变化的是执行边界：
运行器针对拥有文件、
命令、端口以及特定于提供商的隔离的活动沙箱会话来准备 智能体。

| 组件              | 它所拥有的内容                                                     | 设计问题                                                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SandboxAgent`     | 智能体 定义以及沙箱默认值                       | 这个 智能体 应该做什么，以及哪些沙箱默认值会随之传递？                             |
| `Manifest`         | 全新会话的工作区契约                             | 工作区中最初包含哪些文件、目录、仓库、挂载、环境、用户或组？ |
| 能力       | 附加到 智能体 的沙箱原生行为                    | 这个 智能体 需要哪些沙箱工具、指令或运行时行为？                      |
| 沙箱客户端     | 提供商集成                                         | 实时工作区应在哪里运行：Unix 本地、Docker 还是托管提供商？                    |
| 沙箱会话    | 实时执行环境                                   | 命令在哪里运行、文件在哪里更改、端口在哪里开放，以及提供商状态存放在哪里？                         |
| 沙箱运行配置 | 每次运行的沙箱会话来源、客户端选项以及全新输入 | 此次运行应注入、恢复还是创建沙箱会话？                                    |
| 已保存状态        | `RunState`、序列化的会话状态以及快照              | 后续运行应如何重新连接以恢复工作或为新工作区播种？                                  |

沙箱专属默认值应当设置在 `SandboxAgent`。每次运行的沙箱会话
选项应放在该运行的沙箱配置中。

沙箱 智能体 也不会改变一轮的含义。一轮仍然是一次模型
步骤，而非单一的 shell 命令或沙箱操作。有些工作可能保留在
沙箱执行层内部。智能体 运行时仅在以下情况下才消耗另一轮：
在沙箱工作完成后，它需要再次获得模型响应。

## 创建工作区

`Manifest` 描述全新沙箱工作区所需的初始内容和布局。
用于指定智能体应当看到的文件、仓库、输入制品、辅助文件、
挂载点、输出目录以及环境设置。

请将清单视为一份新会话的契约，而非每个在线沙箱的完整事实来源。
运行时的有效工作区实际上可能来自
复用的在线沙箱会话、序列化的沙箱会话状态，或在运行时选择的快照。
快照。

清单中的条目路径相对于工作区。它们不能是绝对路径，也不能
通过以下方式跳出工作区： `..`，这样可以让工作区契约在本地、Docker 和托管客户端之间保持可移植性。
在本地、Docker 和托管客户端之间保持可移植性。

| 清单输入                                                                 | 用于                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `File`, `Dir`                                                                  | 小型合成输入、辅助文件或输出目录。                          |
| 本地文件或目录                                                        | 要具现化到沙箱中的宿主文件或目录。                            |
| Git 仓库                                                                       | 要获取到工作区中的仓库。                                             |
| `S3Mount`, `GCSMount`, `R2Mount`, `AzureBlobMount`, `BoxMount`, `S3FilesMount` | 在沙箱内可用的外部存储。                                |
| `environment`                                                                  | 沙箱启动时需要的环境变量。                               |
| `users` 和 `groups`                                                           | 为支持账户配置的提供商提供的沙箱本地 OS 账户和组。 |

良好的清单设计意味着：

- 将仓库、输入制品和输出目录放在清单中。
- 将较长的任务规格和仓库本地说明放在工作区文件中，例如 `repo/task.md` 或 `AGENTS.md`.
- 在说明中使用相对工作区路径，例如 `repo/task.md` 或 `output/report.md`.
- 将挂载存储的范围限定为 智能体 应读取或写入的输入。
- 将挂载条目视为临时的工作区条目：快照和持久化流程会跳过挂载的远程存储，而不是将其复制到已保存的工作区内容中。

### 挂载文件和存储

有用的数据通常已经存在于其他地方。与其将大型
文档粘贴到上下文中，不如将它们挂载到沙盒中，让 智能体 直接处理
文件。

示例：

- 挂载一个尽职调查资料室，并让智能体生成一份带引用的摘要。
- 挂载一份支持导出内容，并让智能体将问题聚类成报告。
- 挂载生成的工件，以便另一个系统能够审阅它们。

Provider 集成会暴露各自的挂载辅助方法、凭据处理方式和
持久化行为。请保持应用层契约不变：仅挂载该提供商
输入智能体应使用的智能体，告诉智能体在哪里读写，并检查
在生成的产物可供使用之前。

### 处理密钥与凭据

将沙箱凭据视为运行时配置，而不是提示内容。
智能体 可能需要访问包管理器、存储挂载或提供商的凭据，但这些凭据不应出现在用户提示中，
provider APIs, but those credentials shouldn't appear in user prompts,
智能体 指令、任务文件、已提交的清单或生成的制品。

使用以下规则：

- 对于托管沙箱提供商，优先使用提供商原生的密钥管理系统。
- 将云存储凭证的范围限定在需要它们的挂载或提供商选项内。
- 使用 `Manifest.environment` 为沙箱进程在启动时需要的值传递，并当你希望重新生成敏感或生成的条目、而非保留它们时，将其标记为临时项。
- 避免保存不应跨运行保留的密钥、生成的挂载配置、本地令牌或文件。
- 在将产物移出沙箱之前先进行审查，尤其是当智能体能够读取私有文档或已挂载存储时。

SDK 支持清单环境值以及特定提供商的挂载
凭证。通用的密钥存储集成因提供商而异，因此本页面
应聚焦于这一约定：由你的运行时或沙箱提供商注入
凭证，而不是把它们作为指令教给模型。

## 赋予智能体能力

Capabilities 附加 sandbox 原生行为到 `SandboxAgent`。它们可以塑造
运行开始前的工作区，附加 sandbox 特定的指令，暴露
绑定到实时 sandbox 会话的工具，并针对该智能体调整模型行为或输入
处理方式。

| 能力                              | 添加时机                                                  | 备注                                                                                |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Shell`                                 | 该智能体需要 shell 访问权限。                                | 添加命令执行，并在沙盒客户端支持时提供交互输入。 |
| `Filesystem`                            | 该智能体需要编辑文件或查看本地图片。       | 添加 `apply_patch` 和 `view_image`；补丁路径相对于工作区根目录。        |
| `Skills`                                | 你希望在沙盒中发现并物化技能。 | 相较于手动挂载，更推荐使用此方式 `.agents` 或 `.agents/skills`.                    |
| [`Memory`](#persist-memory-across-runs) | 后续运行需要读取或生成记忆制品。     | 需要 `Shell`；实时记忆更新还需要 `Filesystem`.                     |
| `Compaction`                            | 长时间运行的工作流需要进行上下文裁剪。                    | 在压缩项之后调整模型行为与输入处理。                    |

默认情况下， `SandboxAgent` 包含文件系统、shell 和压缩
能力。如果你传入一个 `capabilities` 列表，它将替换默认列表，
因此请包含 智能体 仍然需要的任何默认能力。

在合适时优先使用内置能力。仅当
你需要内置能力未覆盖的、特定于沙箱的工具或指令表面时，才编写自定义能力。
覆。

### Load skills

某些任务需要在
智能体启动之前准备好可重复使用的指令、脚本、引用或资源。使用该 `Skills` 能力，让智能体能够在运行过程中发现这些
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


根据你希望它以何种方式具体化来选择技能来源：

- 当你希望模型先发现索引并按需加载时，使用懒加载的本地目录源来支持较大的本地技能目录。
- 使用本地目录源来对较小的本地包进行预先预加载。
- 当技能包有自己的发布节奏或被许多沙箱使用时，使用 Git 仓库源。

### Expose previews and ports

有时产物不是文件，而是一个正在运行的进程。当智能体在本地创建应用、笔记本、报表服务器、浏览器
port when the 智能体 creates a local app, notebook, report server, browser
预览或其他你需要从沙箱外部检查的服务时，请使用已暴露的端口。

端口设置因提供方而异，但产品契约是相同的：由
智能体在沙箱内启动该服务，沙箱客户端对外暴露该端口，然后你的应用即可共享或查看最终得到的预览 URL。
port, and your application shares or inspects the resulting preview URL.

## 运行沙盒智能体

最短可用的沙盒循环是：

1. 构建一个 `Manifest` 用于描述工作区。
2. 创建一个 `SandboxAgent` ，并赋予模型所需的各项能力。
3. 为期望运行工作的环境选择一个沙盒客户端。
4. 使用每次运行的沙盒配置来运行智能体。
5. 检查、复制、恢复或快照化对你的应用至关重要的产物。

从 Unix-local 开始，用于在 macOS 或 Linux 上进行本地开发。它可以提供
最小的本地循环，因为运行器可以从
智能体 的默认清单创建一个临时工作区，并在运行后清理它。

运行 Unix-local 沙箱 智能体

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

提供方属于运行配置的一部分，而不是 智能体 定义的一部分。保持
该 `SandboxAgent`，清单和能力保持稳定，然后根据所需环境替换沙箱
客户端和提供方选项。

本示例使用 Docker 实现本地容器隔离。托管提供方遵循
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


有关可运行的示例，请参阅 TypeScript [沙箱客户端指南][sdk-js-sandbox-clients] 和 [基础示例][sdk-js-example-basic]，以及 Python [`basic.py`][sdk-example-basic] （用于提供方选择）， [`docker_runner.py`][sdk-example-docker-runner] （用于 Docker），以及 [`main.py`][sdk-example-dataroom-qa] （用于 SDK 仓库中的数据室流程）。

### 进阶模式

一旦基本循环跑通，沙箱就会在以下工作流中变得有用：当
智能体 需要一个沙箱工作区而非更多的提示上下文时。这些
示例是工作流 模式，而非独立的API：同一个运行框架可以路由、暂停、
恢复并追踪该工作流，同时每个沙箱把执行保持在其所需的
文件、工具和端口附近。

| 示例                                                | 描述                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [数据室问答][sdk-example-dataroom-qa]               | 对挂载的数据室进行问题解答。                    |
| [数据室表格抽取][sdk-example-dataroom]     | 从挂载的数据室中抽取表格。                     |
| [代码仓库审查][sdk-example-repo-code-review] | 克隆代码仓库、检查其内容并生成代码审查产物。  |
| [视觉网站克隆][sdk-example-vision-clone]       | 使用视觉 API 克隆网站并借助截图进行反馈。 |
| [沙箱恢复][sdk-example-sandbox-resume]           | 在已有沙箱中恢复工作。                        |

## Resume or seed future work

有用的智能体工作通常会跨越单个请求的生命周期。用户审阅产物时，
某个步骤需要审批时，或者后续步骤依赖于稍后发生的事件时，都属于这种情况。

请将以下三个状态概念分开处理：

| 状态面 | 恢复                                                                                  | 使用时机                                                                       |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `RunState`    | Harness 端状态，例如模型条目、工具状态、审批以及当前 智能体 位置。 | 运行器应在暂停之间持续推进 工作流。                    |
| 会话状态 | 客户端可重新连接的已序列化沙箱会话。                              | 你的应用或任务系统直接存储提供商会话状态。                 |
| `snapshot`    | 用于为新的沙箱会话提供初始内容的已保存工作区内容。                            | 新运行应从已保存的文件和产物开始，而非从空工作区开始。 |

在实际运行中，runner 按以下顺序解析沙盒会话：

1. 如果你传入一个活动的沙箱会话，runner 会直接复用该会话。
2. 否则，如果运行是从 `RunState`，恢复的，则 runner 会从已存储的沙箱会话状态恢复。
3. 否则，如果你传入显式的已序列化沙箱状态，runner 会从该状态恢复。
4. 否则，runner 会创建一个全新的沙箱会话。对于该全新会话，如果提供了每次运行的清单，则使用该清单；否则使用 智能体 的默认清单。

sandbox resume 示例会序列化已停止的会话状态，并恢复它
通过同一个客户端，然后将恢复后的会话传递回下一步
run:

序列化和恢复沙盒状态

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


Fresh-session inputs such as `manifest` 和 `snapshot` only apply when the
runner creates a new sandbox session. If you inject a live `session`, capability
processing can add compatible non-mount entries, but it can't change root,
environment, users, or groups; remove existing entries; replace entry types; or
add or change mount entries on the already-running sandbox.

This split lets the harness resume the 智能体 loop while the sandbox provider
恢复或重建工作区。这些路径的当前示例代码位于
TypeScript 中 [恢复会话状态示例][sdk-js-example-resume] 和
Python [`main.py`][sdk-example-sandbox-resume] 和
[`sandbox_agent_with_remote_snapshot.py`][sdk-example-remote-snapshot].

## 在多次运行间持久化记忆

沙箱记忆让未来的沙箱-智能体运行可以从先前的运行中学习。它
与 SDK 管理的对话式 `Session` 记忆是分开的：会话保留
消息历史，而沙箱记忆则从先前的工作区
运行中提炼出有用的经验，保存为 智能体 之后可以读取的文件。

当 智能体 应该延续用户偏好、修正记录、
特定项目的经验或任务摘要，而无需重放每个先前
对话轮次时，请使用记忆。Resume 和快照会保留工作区状态；记忆则保留
关于工作区中发生的工作的可复用指导。

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
权限，以便 智能体 可以搜索和打开记忆文件。默认情况下，实时记忆
更新也需要文件系统权限，以便 智能体 可以修复过时的记忆或在
用户提出要求时更新记忆。

记忆读取采用渐进式披露方式。SDK 会注入 `memory_summary.md` 在
运行开始时，智能体 会搜索 `MEMORY.md` 先前看起来相关的
工作，并且仅在需要更多细节时才打开 rollout 摘要。

| Memory mode          | 使用场景                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| 默认读写   | 智能体 应读取现有记忆并生成新记忆。          |
| 只读记忆     | 智能体 应读取记忆，但运行结束后不生成新记忆。 |
| 仅生成记忆 | 本次运行应在不使用现有记忆的情况下生成记忆。           |
| 读取配置          | 你需要禁用实时更新。                                       |
| 生成配置      | 你需要调整生成行为，例如额外的提示词。                  |
| 布局配置        | 同一沙箱工作区中的智能体需要相互隔离的记忆布局。      |

默认情况下，memory artifacts 存放在沙箱工作区中：

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

运行时会在沙箱会话期间追加运行段。当会话
结束时，记忆生成过程会先提取对话摘要和原始
记忆，然后将这些原始记忆整合为 `MEMORY.md` 和
`memory_summary.md`。若要在后续运行中复用记忆，请保留已配置的
记忆目录，方式包括保持同一个在线沙箱会话、从
会话状态恢复、从快照启动，或挂载持久化存储（例如
S3）。

对于多轮沙箱聊天，请使用稳定的 SDK 会话以及相同的
在线沙箱会话。记忆会按以下顺序对运行进行分组：先按显式的会话 ID，
再按 SDK 会话 ID，然后是运行组 ID，最后是自动生成的每次运行 ID。
沙箱会话 ID 用于标识在线工作区，它并不是记忆的
会话 ID。

有关可运行的示例，请参阅 TypeScript [记忆指南][sdk-js-sandbox-memory],
以及 Python [`memory.py`][sdk-example-memory] 了解本地快照流程，
[`memory_s3.py`][sdk-example-memory-s3] 了解基于 S3 的记忆存储，
[`memory_multi_agent_multiturn.py`][sdk-example-memory-multi-agent] 了解如何在不同智能体之间
使用独立的记忆布局。

## Compose sandbox 智能体

沙箱 智能体 与 SDK 的其余部分组合使用。

当非沙箱接入 智能体 应当仅将
工作流中工作区负载较重的那部分委托给沙箱 智能体 时，使用 交接。顶级运行
会继续，但沙箱 智能体 成为下一轮的活跃 智能体。

当外层编排器应当调用一个或多个沙箱 智能体 作为工具时，将其用作工具
智能体 作为嵌套工具。每个沙箱工具 智能体 可以拥有各自的沙箱运行
配置、沙箱客户端、清单和提供商选项。

相关示例，请参阅 [`handoffs.py`][sdk-example-handoffs] 和
[`sandbox_agents_as_tools.py`][sdk-example-agents-as-tools].

## 沙盒提供商

从 Unix 本地环境开始，以便快速进行本地迭代；当需要本地容器隔离时，使用 Docker。
当任务需要托管执行、特定提供商的隔离、扩缩容、预览、存储挂载、
快照或应与你的应用服务器分离存放的凭据时，切换到托管提供商。
快照，或应保存在你的应用服务器之外的凭据。

提供商相关的设置、凭据、隔离、存储、
预览和持久化行为，请参阅提供商的文档。

| 提供商   | SDK 客户端                | 文档与示例                                                                                                                                                                                                                                                                                                                                                                                                 |
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