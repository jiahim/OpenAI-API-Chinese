# 沙盒 智能体

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

沙盒为智能体提供了一个隔离的、类 Unix 的执行环境，其中包含
文件系统、shell、已安装的软件包、挂载的数据、暴露的端口、快照，
以及对外部系统的受控访问。

当模型需要此类工作空间，但只获得智能体的提示上下文时，工作流会变得脆弱。
大型文档集、生成的产物、
命令、预览以及可恢复的工作，都需要一个智能体可以
检视和修改的环境。

沙盒智能体已在 TypeScript 和 Python 的 Agents SDK 中提供。它们
  目前处于公测阶段，因此 API 细节、默认值和支持的功能可能会发生变化。

当智能体需要操作文件、运行命令、挂载
资料室、生成产物、暴露服务或稍后延续有状态工作时，
请使用沙盒。

关键的划分在于控制层与计算层之间的边界。控制层是
模型周围的控制平面：它负责智能体循环、模型调用、工具
路由、交接、审批、追踪、恢复以及运行状态。计算层是
沙盒执行平面，在其中由模型驱动的工作会读写文件、运行
命令、安装依赖、使用挂载的存储、暴露端口，并对状态进行
快照。

将这些边界分离后，你可以在受信的基础设施中保留敏感的控制
平面工作，而沙盒则专注于
提供商特定的执行。沙盒可以使用受限的凭证和挂载来运行针对文件的代码
，测试运行框架则可以将身份验证、计费、审计日志、人工
审查和恢复状态保持在任何单个容器之外。



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

当智能体的答案依赖于在沙盒中完成的工作时，使用沙盒
工作区，而不仅仅是对提示上下文进行推理。

常见的痛点包括：

- 该任务需要一个文档目录，而非单个提示。
- 智能体 应写入你的应用稍后可以检查的文件。
- 智能体 需要命令、软件包或脚本来完成任务。
- 工作流 会产出诸如 Markdown、CSV、JSONL、截图或生成的网站等制品。
- 某个服务、笔记本或报告预览需要运行在已暴露的端口上。
- 工作暂停以等待人工审核，然后在同一工作区中继续进行。

如果你的工作流只需要简短的模型响应且无需持久化工作区，
可以直接调用 [Responses API](https://developers.openai.com/api/reference/responses/overview) ，或者使用不包含沙箱的
基础 Agents SDK 运行时。

如果 shell 访问只是偶尔使用的工具，请从托管 shell 工具开始，在
[使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)。使用 sandbox 智能体，用于
工作区隔离、沙箱供应商选择或可恢复
文件系统状态属于产品设计的情况。

## 沙盒带来的能力

`SandboxAgent` 仍然是一个 `Agent`。它保留了常规的 智能体 接口，包括
`instructions`, `prompt`, `tools`, `handoffs`，MCP 服务器、模型设置、
结构化输出、护栏以及 hooks。发生变化的是执行边界：
运行器会在一个拥有文件、命令、端口和特定于提供方隔离机制的实时沙箱会话中准备该 智能体，
命令、端口以及特定于提供方的隔离。

| 组件              | 职责                                                     | 设计问题                                                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SandboxAgent`     | 智能体定义及沙盒默认值                       | 这个智能体应该做什么，以及哪些沙盒默认值会随之传递？                             |
| `Manifest`         | 全新会话的工作区契约                             | 工作区中初始包含哪些文件、目录、代码仓库、挂载点、环境、用户或用户组？ |
| 能力       | 附加到智能体的沙盒原生行为                    | 这个智能体需要哪些沙盒工具、指令或运行时行为？                      |
| 沙盒客户端     | 提供方集成                                         | 实时工作区应在哪里运行：本地 Unix、Docker 还是托管提供方？                    |
| 沙盒会话    | 实时执行环境                                   | 命令在哪里执行、文件在哪里修改、端口在哪里开放，以及提供方状态存放在哪里？                         |
| 沙盒运行配置 | 每次运行的沙盒会话来源、客户端选项以及全新输入 | 本次运行应注入、恢复还是新建沙盒会话？                                    |
| 已保存状态        | `RunState`、序列化的会话状态和快照              | 后续运行应如何重新连接以恢复工作或为新的工作区提供种子？                                  |

沙箱专属默认值应在 `SandboxAgent`。中设置。单次运行的沙箱会话
选项属于该运行的沙箱配置。

沙箱智能体也不会改变“轮次”的含义。轮次仍然是模型
一个步骤，而不是单个 shell 命令或沙箱操作。有些工作可能会保留在
沙箱执行层内部。智能体运行时仅在以下情况下才会消耗另一个回合：
在沙箱工作发生之后，它需要另一个模型响应。

## 创建工作区

`Manifest` 描述新的
沙箱工作区所需的初始内容和布局。用于指定智能体应看到的文件、仓库、输入制品、辅助文件、
挂载点、输出目录以及环境配置，智能体 都应能访问。

将清单视为新会话的契约，而不是每个
实时沙箱的完整事实来源。运行时的实际工作区也可以来自
复用的实时沙箱会话、序列化的沙箱会话状态，或运行时
选择的快照。

清单中的条目路径相对于工作区。它们不能是绝对路径，也不能
通过以下方式跳出工作区： `..`，从而保证工作区契约在本地、Docker
和托管客户端之间是可移植的。

| Manifest 输入                                                                 | 使用场景                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `File`, `Dir`                                                                  | 小型合成输入、辅助文件或输出目录。                          |
| 本地文件或目录                                                        | 需要在沙盒中实体化的宿主文件或目录。                            |
| Git 仓库                                                                       | 要拉取到工作区中的仓库。                                             |
| `S3Mount`, `GCSMount`, `R2Mount`, `AzureBlobMount`, `BoxMount`, `S3FilesMount` | 在沙盒内部可用的外部存储。                                |
| `environment`                                                                  | 沙盒启动时所需的环境变量。                               |
| `users` 和 `groups`                                                           | 支持账户置备的提供方所使用的沙盒本地 OS 账户和组。 |

良好的清单设计意味着：

- 将仓库、输入制品和输出目录放入清单中。
- 将较长的任务规范和仓库本地说明放入工作区文件中，例如 `repo/task.md` 或 `AGENTS.md`.
- 在说明中使用相对工作区路径，例如 `repo/task.md` 或 `output/report.md`.
- 将挂载存储的范围限定为 智能体 应读取或写入的输入。
- 将挂载项视为临时的工作区条目：快照和持久化流程会跳过挂载的远程存储，而不是将其复制到已保存的工作区内容中。

### 挂载文件和存储

有用的数据常常已经存放在别处。与其将大量
文档粘贴到上下文中，不如将它们挂载到沙盒中，让 智能体 直接处理这些
文件。

示例：

- 挂载尽职调查数据室，并让 智能体 生成一份带引用的摘要。
- 挂载一份支持导出文件，并让 智能体 将问题聚类整理为报告。
- 挂载已生成的制品，以便其他系统进行审阅。

Provider 集成会公开各自的挂载辅助方法、凭证处理方式以及
持久化行为。请保持应用契约不变：仅挂载智能体应使用的
输入，告知 智能体 应在何处读写，并检查
生成的制品后再使用它们。

### 处理密钥和凭据

将沙箱凭据视为运行时配置，而非提示内容。
智能体 可能需要访问包管理器、存储挂载或提供商的
API 凭据，但这些凭据不应出现在用户提示、
智能体 指令、任务文件、已提交的清单或生成的制品中。

请遵循以下规则：

- 对于托管沙箱提供商，优先使用提供商原生的密钥管理系统。
- 将云存储凭证的作用范围限定在使用它们的挂载点或提供商选项上。
- 使用 `Manifest.environment` 来传入沙箱进程启动时所需的值，并在希望重新构建而非持久化敏感或生成的条目时，将其标记为临时条目。
- 避免保存机密、生成的挂载配置、本地令牌或不应当存活到运行结束的文件。
- 在将产物移出沙箱前进行审查，尤其是在 智能体 能够读取私有文档或挂载存储的情况下。

SDK 支持清单环境值以及特定于提供商的挂载
凭据。通用的密钥存储集成因提供商而异，因此请让本页面专注于约定本身：
你的运行时或沙箱提供商应当注入这些凭据，而不是把它们作为指令教给模型。
credentials. General secret-store integration is provider-specific, so keep this。

## 赋予智能体能力

能力将沙箱原生行为附加到 `SandboxAgent`。上。它们可以在运行开始前塑造
工作区、附加沙箱专属指令、暴露与实时沙箱会话绑定的
工具,并针对该智能体调整模型行为或输入处理方式。
智能体。

| Capability                              | Add it when                                                  | Notes                                                                                |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Shell`                                 | The 智能体 needs shell access.                                | Adds command execution and, when supported by the sandbox client, interactive input. |
| `Filesystem`                            | The 智能体 needs to edit files or inspect local images.       | Adds `apply_patch` and `view_image`; patch paths are workspace-root-relative.        |
| `Skills`                                | You want skill discovery and materialization in the sandbox. | Prefer this over manually mounting `.agents` or `.agents/skills`.                    |
| [`Memory`](#persist-memory-across-runs) | Follow-on runs should read or generate memory artifacts.     | Requires `Shell`; live memory updates also require `Filesystem`.                     |
| `Compaction`                            | Long-running flows need context trimming.                    | Adjusts model behavior and input handling after compaction items.                    |

默认情况下，一个 `SandboxAgent` 包含文件系统、shell 和压缩
能力。如果你传入一个 `capabilities` 列表，它会替换默认列表，
因此请包含该智能体仍然需要的任何默认能力。

在合适时优先使用内置能力。仅在以下情况时编写自定义能力：
你需要内置能力未涵盖的、特定于沙箱的工具或指令面。
覆盖。

### Load skills

某些任务在开始前需要可重复的指令、脚本、参考或资源
智能体启动。使用该 `Skills` 能力，以便智能体能够在运行过程中发现该
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


根据你希望技能以何种方式物化来选择技能来源：

- 当你希望模型先发现索引并按需加载时，对较大的本地技能目录使用惰性本地目录源。
- 对较小的本地捆绑包使用本地目录源，以便一次性预加载。
- 当技能捆绑包有独立的发布节奏，或被许多沙箱使用时，使用 Git 仓库源。

### Expose previews and ports

有时工件不是文件，而是一个正在运行的进程。当智能体在本地创建了需要你在沙箱外部进行检查的应用、
notebook、报告服务器、浏览器预览或其他服务时，请使用对外暴露的端口。
preview, or other service that you need to inspect outside the sandbox.

端口设置因服务商而异，但产品契约相同：
智能体 在沙箱内启动服务，沙箱客户端暴露端口，
你的应用共享或检查生成的预览 URL。

## 运行沙盒 智能体

最短可用的沙箱循环是：

1. 构建一个 `Manifest` 用于描述工作区。
2. 创建一个 `SandboxAgent` 并配置模型所需的各项能力。
3. 为待运行的环境选择合适的沙箱客户端。
4. 使用每次运行的沙箱配置运行 智能体。
5. 检查、复制、恢复或快照化对你应用有用的产物。

在 macOS 或 Linux 上进行本地开发时，从 Unix-local 入手。它能为你提供
最小的本地循环，因为 runner 可以从
智能体 的默认清单创建临时工作区，并在运行结束后清理它。

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


完整的本地示例，请参阅 TypeScript [沙箱 智能体 快速入门][sdk-js-example-basic] 和 Python [`unix_local_runner.py`][sdk-example-unix-local-runner].

### Switch providers

provider 属于运行配置的一部分，而非智能体定义的一部分。保持
该 `SandboxAgent`，清单与能力保持稳定，然后根据你所需的目标环境替换沙箱
的客户端与 provider 选项。

本示例使用 Docker 进行本地容器隔离。托管 provider 沿用
同样的模式，并使用各自的客户端类与选项。

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


有关可运行的代码示例，请参阅 TypeScript 的 [sandbox clients 指南][sdk-js-sandbox-clients] 以及 [基础示例][sdk-js-example-basic]，外加 Python 的 [`basic.py`][sdk-example-basic] provider 选择示例， [`docker_runner.py`][sdk-example-docker-runner] Docker 示例，以及位于 SDK 仓库中的 [`main.py`][sdk-example-dataroom-qa] 数据室流程示例。

### 高级模式

在基本循环跑通之后，沙箱会在以下场景中变得有用：
智能体需要的是一个沙箱工作区，而不是更多的提示上下文。这些
示例属于工作流模式，而不是独立的API：同一个运行框架可以负责路由、暂停、
恢复，并对追踪工作流进行追踪，而每个沙箱都将执行环境贴近其所需的
文件、工具和端口。

| 示例                                                | 说明                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [数据室问答][sdk-example-dataroom-qa]               | 基于挂载的数据室回答问题。                    |
| [数据室表格提取][sdk-example-dataroom]     | 从挂载的数据室中提取表格。                     |
| [仓库代码评审][sdk-example-repo-code-review] | 克隆仓库，检查代码，并生成代码评审产物。  |
| [视觉网站克隆][sdk-example-vision-clone]       | 使用 Vision API 和截图反馈克隆网站。 |
| [沙箱恢复][sdk-example-sandbox-resume]           | 在已有的沙箱中恢复工作。                        |

## 恢复或为后续工作播种

有用的智能体工作往往会在单个请求之后继续存在。用户审阅某项产出，某
个步骤需要审批，或者下一步依赖于后续事件。

请将以下三种状态概念分开：

| 状态表面 | 恢复                                                                                  | 使用场景                                                                       |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `RunState`    | 宿主侧状态，例如模型条目、工具状态、审批以及当前 智能体 位置。 | 执行器应在暂停期间将 工作流 向前推进。                    |
| 会话状态 | 一个已序列化的沙箱会话，客户端可以重新连接。                              | 你的应用或任务系统直接存储提供商会话状态。                 |
| `snapshot`    | 已保存的工作区内容，用于为新的沙箱会话提供种子。                            | 新运行应从已保存的文件和产物开始，而非空白工作区。 |

在实际运行中，运行器按以下顺序解析沙箱会话：

1. 如果传入的是活动的沙盒会话，运行器会直接复用该会话。
2. 否则，如果运行是从 `RunState`，恢复，则运行器会从已存储的沙盒会话状态恢复。
3. 否则，如果传入显式的序列化沙盒状态，运行器会从该状态恢复。
4. 否则，运行器会创建一个新的沙盒会话。对于该新会话，会在提供时使用每次运行的清单，否则使用该智能体的默认清单。

沙箱恢复示例会序列化已停止的会话状态，并通过同一个客户端恢复它
，然后将恢复后的会话传回下一次
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


Fresh-session inputs such as `manifest` 以及 `snapshot` only apply when the
runner creates a new sandbox session. If you inject a live `session`, capability
processing can add compatible non-mount entries, but it can't change root,
environment, users, or groups; remove existing entries; replace entry types; or
add or change mount entries on the already-running sandbox.

This split lets the harness resume the 智能体 loop while the sandbox provider
restores or recreates the workspace. Current sample code for these paths lives
in the TypeScript [resume session state example][sdk-js-example-resume] 以及
Python [`main.py`][sdk-example-sandbox-resume] 以及
[`sandbox_agent_with_remote_snapshot.py`][sdk-example-remote-snapshot].

## 在多次运行间持久化存储记忆

沙盒记忆让未来的沙盒-智能体运行可以从先前的运行中学习。它
与 SDK 管理的会话 `Session` 记忆不同：会话保留
消息历史，而沙盒记忆则从先前的工作
区运行中提炼有用的经验，存入 智能体 稍后可以读取的文件。

当 智能体 应当沿用用户偏好、修正、
项目相关的经验或任务摘要，而无需回放之前每一个
轮次时，使用记忆。恢复和快照会保留工作区状态；记忆则保留关于工作区中已发生工作的可复用
指引。

启用沙盒记忆

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


默认情况下，记忆同时启用读取与生成。记忆读取需要 shell
权限，以便 智能体 搜索并打开记忆文件。默认情况下，实时记忆
更新也需要文件系统权限，以便 智能体 修复过时的记忆或
在用户请求时更新记忆。

记忆读取采用渐进式披露方式。SDK 会在 `memory_summary.md` 运行
开始时注入，智能体 会搜索 `MEMORY.md` 当先前的工作看起来
相关时，它会在需要更多细节时再打开 rollout 摘要。

| Memory mode          | 使用场景                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| Default read/write   | 智能体 应读取已有 memory 并生成新的 memory。          |
| Read-only memory     | 智能体 应读取 memory，但在运行结束后不生成新的 memory。 |
| Generate-only memory | 本次运行应仅生成 memory，不使用已有 memory。           |
| Read config          | 你需要禁用实时更新。                                       |
| Generate config      | 你需要调整生成行为，例如额外的提示词。                  |
| Layout config        | 同一沙箱工作区中的 智能体 需要彼此隔离的 memory 布局。      |

默认情况下，记忆制品存放在 sandbox 工作区中：

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

运行时会话期间会追加运行分段。当会话
结束时，记忆生成会先提取对话摘要和原始
记忆，然后将这些原始记忆合并到 `MEMORY.md` 以及
`memory_summary.md`。若要在后续运行中复用记忆，请保留已配置的
记忆目录，具体做法是：保持同一个实时 sandbox 会话、从
会话状态恢复、从快照启动，或挂载持久化存储（例如
S3）。

对于多轮 sandbox 对话，请使用稳定的SDK 会话以及同一个
实时 sandbox 会话。记忆会按以下顺序对运行进行分组：先是显式会话 ID，然后
SDK 会话 ID，再是运行组 ID，最后是为每次运行生成的 ID。
sandbox 会话 ID 用于标识实时工作区，它不是记忆
会话 ID。

有关可运行的代码示例，请参阅 TypeScript 的 [记忆指南][sdk-js-sandbox-memory],
以及 Python [`memory.py`][sdk-example-memory] 查看本地快照流程，
[`memory_s3.py`][sdk-example-memory-s3] 查看基于 S3 的记忆存储，以及
[`memory_multi_agent_multiturn.py`][sdk-example-memory-multi-agent] 查看跨不同
智能体 的独立记忆布局。

## 编写沙箱智能体

沙箱智能体可与SDK的其余部分组合使用。

当非沙箱接入智能体应仅将工作区密集部分委托给沙箱交接时，请使用该模式，
以将工作流中的工作区密集部分交由沙箱智能体处理。顶层运行
会继续，但沙箱智能体将成为下一轮的当前智能体。

当外部编排器应将一个或多个沙箱智能体作为工具调用时，使用
智能体作为嵌套工具。每个沙箱工具智能体可拥有各自的沙箱运行
配置、沙箱客户端、清单和提供商选项。

示例请参阅 [`handoffs.py`][sdk-example-handoffs] 以及
[`sandbox_agents_as_tools.py`][sdk-example-agents-as-tools].

## 沙盒提供商

从 Unix 本地方式开始，以便快速本地迭代；当你需要本地容器隔离时使用 Docker
容器隔离。当任务需要托管的执行环境、提供商特定的隔离、扩容、预览、存储挂载
快照，或应放在应用服务器之外的凭据时，迁移到托管提供商。
快照，或应放在应用服务器之外的凭据时，迁移到托管提供商。

请参阅 Provider 文档了解提供商特定的设置、凭据、隔离、存储，
预览和持久化行为。

| Provider   | SDK 客户端                | 文档与示例                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blaxel     | `BlaxelSandboxClient`     | [Sandbox 概览](https://docs.blaxel.ai/Sandboxes/Overview)                                                                                                                                                                                                                                                                                                                                                   |
| Cloudflare | `CloudflareSandboxClient` | [Sandbox 文档](https://developers.cloudflare.com/sandbox/)<br />[OpenAI 智能体 教程](https://docs.cloudflare.com/sandbox/tutorials/openai-agents/)<br />[Sandbox Bridge 示例](https://github.com/cloudflare/sandbox-sdk/tree/main/bridge/examples)                                                                                                                       |
| Daytona    | `DaytonaSandboxClient`    | [Sandbox 文档](https://www.daytona.io/docs/en/sandboxes/)<br />[OpenAI Agents SDK 指南](https://www.daytona.io/docs/en/guides/openai-agents/openai-agents-sdk-with-sandboxes)                                                                                                                                                                                                              |
| Docker     | `DockerSandboxClient`     | [Docker 文档](https://docs.docker.com/)<br />[TypeScript Docker SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/docker-client.ts)<br />[Python Docker SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/docker/docker_runner.py)                                                             |
| E2B        | `E2BSandboxClient`        | [Sandbox 文档](https://e2b.dev/docs)<br />[OpenAI Agents SDK 指南](https://e2b.dev/docs/agents/openai-agents-sdk)<br />[发布博客](https://e2b.dev/blog/e2b-is-now-in-agents-sdk)                                                                                                                                                                                             |
| Modal      | `ModalSandboxClient`      | [Sandbox 指南](https://modal.com/docs/guide/sandboxes)<br />[集成博客](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)<br />[示例仓库](https://github.com/modal-labs/openai-agents-python-example)<br />[Modal 扩展参考](https://github.com/modal-labs/openai-agents-python-example?tab=readme-ov-file#modal-extension-reference) |
| Runloop    | `RunloopSandboxClient`    | [Devbox 概述](https://docs.runloop.ai/docs/devboxes/overview)<br />[Tunnels](https://docs.runloop.ai/docs/devboxes/tunnels)                                                                                                                                                                                                                                                                      |
| Unix-local | `UnixLocalSandboxClient`  | [TypeScript local SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/basic.ts)<br />[Python local SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/unix_local_runner.py)                                                                                                                                           |
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