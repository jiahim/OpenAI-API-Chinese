# 沙盒 智能体

> 要查看完整的文档索引，请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

沙箱为智能体提供一个隔离的、类 Unix 的执行环境，包含
文件系统、Shell、已安装的软件包、挂载的数据、暴露的端口、快照，
以及对外部系统的受控访问。

当模型需要这样的工作空间，但只接收到提示词上下文时，智能体工作流会变得脆弱。
大型文档集、生成的工件、
命令、预览和可恢复的工作都需要一个智能体可以
检查和更改的环境。

沙箱智能体在 TypeScript 和 Python Agents SDK中可用。它们
  处于测试阶段，因此 API 细节、默认值和受支持的功能可能会发生变化。

当智能体需要操作文件、运行命令、挂载
数据室、生成工件、暴露服务或继续有状态的工作时，使用沙箱
稍后。

关键的区别在于控制平面和计算之间的边界。控制平面是
围绕模型的（控制）机制：它拥有智能体循环、模型调用、工具
路由、交接、审批、追踪、恢复和运行状态。计算是
沙箱执行平面，模型指导的工作在其中读写文件、运行
命令、安装依赖项、使用挂载的存储、暴露端口，以及
快照状态。

保持这些边界分离，可以让你的应用程序在可信基础设施中保留敏感的控制
平面工作，同时沙箱专注于
特定于提供商的执行。沙箱可以在狭窄的权限和挂载条件下针对文件运行代码；
而编排框架可以在任何单个容器之外维护认证、计费、审计日志、人工
审查和恢复状态。



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



## 何时使用沙盒

当智能体的答案依赖于工作区中完成的工作时，使用沙箱
，而不仅仅是对提示上下文的推理。

常见的痛点包括：

- 该任务需要一个文档目录，而不是单个提示词。
- 智能体应写入你的应用稍后可以检查的文件。
- 智能体需要命令、包或脚本来完成工作。
- 工作流会生成 Markdown、CSV、JSONL、截图或生成的网站等工件。
- 服务、笔记本或报告预览需要在暴露的端口上运行。
- 工作暂停以进行人工审核，然后在同一工作区中恢复。

如果你的工作流只需要较短的模型响应，且不需要持久化的工作空间，
则可直接调用 [Responses API](https://developers.openai.com/api/reference/responses/overview) 或使用
无沙箱的基础Agents SDK运行时。

如果shell访问仅作为一种偶尔使用的工具，可从中的托管shell工具开始
[Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)。当工作空间隔离、沙箱提供商选择或可恢复的
智能体在文件系统状态构成产品设计的一部分时，使用沙箱
。

## 沙箱增加了什么

`SandboxAgent` 仍然是 `Agent`。它保留了通常的智能体界面，包括
`instructions`, `prompt`, `tools`, `handoffs`、MCP 服务器、模型设置、
结构化输出、护栏和钩子。变化的是执行边界：
运行器在拥有文件、
命令、端口和特定于提供商的隔离的实时沙箱会话中准备智能体。

| 部分              | 它拥有什么                                                     | 设计问题                                                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SandboxAgent`     | 智能体定义及沙箱默认设置                       | 这个智能体应该做什么，以及哪些沙箱默认设置随它一起？                             |
| `Manifest`         | 新会话工作区契约                             | 工作区初始包含哪些文件、目录、仓库、挂载、环境、用户或组？ |
| 能力       | 附加到智能体的沙箱原生行为                    | 这个智能体需要哪些沙箱工具、指令或运行时行为？                      |
| 沙箱客户端     | 提供方集成                                         | 实时工作区应在何处运行：Unix 本地、Docker 还是托管提供方？                    |
| 沙箱会话    | 实时执行环境                                   | 命令在哪里运行、文件在哪里更改、端口在哪里开放以及提供方状态在哪里存在？                         |
| 沙箱运行配置 | 每次运行的沙箱会话来源、客户端选项和新的输入 | 这次运行应该注入、恢复还是创建沙箱会话？                                    |
| 保存的状态        | `RunState`、序列化的会话状态和快照              | 后续运行应如何重新连接到工作或初始化新工作区？                                  |

沙箱特定的默认值应放在 `SandboxAgent`。每次运行的沙箱会话
选择应属于运行的沙箱配置。

沙箱 智能体 也不会改变一个回合的含义。一个回合仍然是模型
步骤，而不是单个 shell 命令或沙箱操作。某些工作可能保留在
沙箱执行层内。智能体 运行时仅在
沙箱工作完成后需要另一个模型响应时才消耗另一个回合。

## 创建工作区

`Manifest` 描述一个新沙盒工作区所需
的起始内容和布局。将其用于智能体应看到的文件、仓库、输入工件、辅助文件、
挂载、输出目录和环境设置。

将清单视为新会话的契约，而非所有实时沙盒的完整真相来源。
运行的实际工作区可以来自
复用的实时沙盒会话、序列化的沙盒会话状态，或运行
时选择的快照。

清单条目路径是工作区相对的。它们不能是绝对路径，也不能通过
逃逸工作区，这保证了工作区契约在 `..`，本地、Docker 和托管客户端之间
的可移植性。

| 清单输入                                                                 | 用于                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `File`, `Dir`                                                                  | 小型合成输入、辅助文件或输出目录。                          |
| 本地文件或目录                                                        | 托管文件或目录以在沙盒中实现。                            |
| Git 仓库                                                                       | 要获取到工作区中的仓库。                                             |
| `S3Mount`, `GCSMount`, `R2Mount`, `AzureBlobMount`, `BoxMount`, `S3FilesMount` | 在沙盒内可用的外部存储。                                |
| `environment`                                                                  | 沙盒启动时所需的环境变量。                               |
| `users` 和 `groups`                                                           | 用于支持账户配置的提供程序的沙盒本地操作系统账户和组。 |

良好的清单设计意味着：

- 将代码仓库、输入工件和输出目录放入清单中。
- 将较长的任务规格和仓库本地指令放入工作区文件中，例如 `repo/task.md` 或 `AGENTS.md`.
- 在指令中使用相对的工作区路径，例如 `repo/task.md` 或 `output/report.md`.
- 将挂载存储的范围限定为 智能体 应读取或写入的输入。
- 将挂载条目视为临时工作区条目：快照和持久化流程会跳过挂载的远程存储，而不是将其复制到保存的工作区内容中。

### 挂载文件和存储

有用的数据通常已经存在于其他位置。与其将大型文档粘贴到
上下文中，不如将其挂载到沙箱中，让智能体处理
这些文件。

示例：

- 挂载尽职调查数据室，并要求智能体生成带引用的摘要。
- 挂载支持导出数据，并要求智能体将问题聚类成报告。
- 挂载生成的人工产物，以便另一个系统审查它们。

提供商集成会暴露它们自己的挂载辅助函数、凭据处理及
持久化行为。保持应用契约不变：仅挂载
智能体应使用的输入，告知智能体读写的位置，并在使用
生成的制品前进行校验。

### 处理机密与凭据

将沙箱凭据视为运行时配置，而非提示内容。
智能体可能需要访问包管理器、存储挂载或
提供商 API 的凭据，但这些凭据不应出现在用户提示、
智能体指令、任务文件、已提交的清单或生成的工件中。

请遵循以下规则：

- 对于托管沙箱提供商，优先使用提供商原生的密钥系统。
- 将云存储凭据的范围限制在需要它们的挂载或提供商选项上。
- 使用 `Manifest.environment` 来配置沙箱进程启动时所需的值，并当你希望重建敏感或生成的条目而不是持久化它们时，将其标记为临时。
- 避免保存不应在运行后存留的密钥、生成的挂载配置、本地令牌或文件。
- 在将产物移出沙箱之前进行审查，尤其是当智能体可以读取私有文档或挂载的存储时。

该 SDK 支持清单环境值和提供者特定的挂载
凭据。常规的密钥存储集成因提供者而异，因此请保持此
页面专注于约定：你的运行时或沙箱提供者应注入
凭据，而不是将其作为指令教给模型。

## 赋予智能体能力

能力（Capabilities）将沙箱原生行为附加到 `SandboxAgent`。它们可以塑造
运行开始前的工作区、附加沙箱专用指令、暴露
绑定到实时沙箱会话的工具，并调整模型行为或对
智能体的输入处理。

| 功能                              | 使用时机                                                  | 备注                                                                                |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Shell`                                 | 智能体需要 shell 访问权限。                                | 添加命令执行功能，并在沙箱客户端支持时，添加交互式输入功能。 |
| `Filesystem`                            | 智能体需要编辑文件或查看本地图片。       | 添加 `apply_patch` 和 `view_image`；补丁路径相对于工作区根目录。        |
| `Skills`                                | 你希望在沙箱中进行技能发现和实体化。 | 优先使用此功能，而非手动挂载 `.agents` 或 `.agents/skills`.                    |
| [`Memory`](#persist-memory-across-runs) | 后续运行应读取或生成记忆工件。     | 需要 `Shell`；实时记忆更新还需要 `Filesystem`.                     |
| `Compaction`                            | 长时间运行的流程需要上下文修剪。                    | 在压缩项目之后调整模型行为和输入处理。                    |

默认情况下， `SandboxAgent` 包含文件系统、Shell 和压缩
能力。如果你传递一个 `capabilities` 列表，它会替换默认列表，
因此请包含智能体仍然需要的任何默认能力。

在适合的情况下优先使用内置能力。仅在
你需要内置能力不提供的沙箱特定工具或指令界面时，
才编写自定义能力。

### 加载技能

某些任务在
智能体启动前需要可重复的指令、脚本、参考资料或资产。使用 `Skills` 功能，以便智能体在运行期间能够发现这些
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


根据你希望技能如何被具体化来选择技能来源：

- 当你希望模型先发现索引、只加载所需内容时，对于较大的本地技能目录，可使用惰性的本地目录源。
- 对于较小的本地捆绑包，可使用本地目录源提前暂存。
- 当技能捆绑包有自己的发布节奏，或许多沙箱都使用它时，可使用 Git 仓库源。

### 暴露预览和端口

有时产物并不是文件，而是正在运行的进程。当
智能体创建本地应用、笔记本、报告服务器、浏览器
预览或其他需要在沙箱外部检查的服务时，请使用暴露的。

端口。端口设置因提供商而异，但产品约定相同：
智能体在沙箱内启动服务，沙箱客户端暴露
端口，你的应用程序共享或检查生成的预览 URL。

## 运行沙箱智能体

最短实用的沙盒循环是：

1. 构建一个 `Manifest` 来描述工作区。
2. 创建一个 `SandboxAgent` ，包含模型所需的能力。
3. 为工作运行环境选择一个沙箱客户端。
4. 使用每次运行的沙箱配置来运行智能体。
5. 检查、复制、继续运行或快照对你的应用程序重要的人工制品。

从 Unix-local 开始，用于 macOS 或 Linux 上的本地开发。它为你提供
最小的本地循环，因为运行器可以从
智能体的默认清单创建临时工作区，并在运行后清理它。

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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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


有关完整的本地示例，请参阅 TypeScript [沙箱 智能体 快速入门][sdk-js-example-basic] 和 Python [`unix_local_runner.py`][sdk-example-unix-local-runner].

### 切换提供商

provider 属于运行配置的一部分，而非 智能体定义。保持
该 `SandboxAgent`、清单和功能稳定，然后替换沙箱
客户端和 provider 选项以适应你所需的环境。

本示例使用 Docker 进行本地容器隔离。托管 provider 遵循
相同的模式，使用自己的客户端类和选项。

切换到 Docker

```javascript
import { run } from "@openai/agents";
import { SandboxAgent } from "@openai/agents/sandbox";
import { DockerSandboxClient } from "@openai/agents/sandbox/local";

const agent = new SandboxAgent({
  name: "Workspace reviewer",
  model: "gpt-5.6",
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


关于可运行示例，请参阅 TypeScript [沙箱客户端指南][sdk-js-sandbox-clients] 和 [基本示例][sdk-js-example-basic]，以及 Python [`basic.py`][sdk-example-basic] 用于 provider 选择， [`docker_runner.py`][sdk-example-docker-runner] 用于 Docker，以及 [`main.py`][sdk-example-dataroom-qa] SDK 仓库中的数据室流程。

### 高级模式

一旦基本循环正常工作，沙箱在以下工作流中就会变得有用：
智能体需要沙箱工作区，而非更多提示上下文。这些
示例是工作流模式，而非独立的API：同一套机制可以路由、暂停、
恢复并追踪该工作流，同时每个沙箱保持执行接近其
所需的文件、工具和端口。

| 示例                                                | 描述                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [数据室问答][sdk-example-dataroom-qa]               | 解答关于已挂载数据室的问题。                    |
| [数据室表格提取][sdk-example-dataroom]     | 从已挂载的数据室中提取表格。                     |
| [代码仓库审查][sdk-example-repo-code-review] | 克隆代码仓库，检查并生成代码审查结果。  |
| [视觉网站克隆][sdk-example-vision-clone]       | 使用视觉API和截图反馈克隆网站。 |
| [沙箱恢复][sdk-example-sandbox-resume]           | 在已有的沙箱中恢复工作。                        |

## 恢复或初始化后续工作

有用的智能体工作往往超出单次请求的范畴。用户审查某个工件、某个
步骤需要批准，或下一步依赖于后续事件。

请将三种状态概念分开：

| 状态表面 | 恢复                                                                                  | 使用场景                                                                       |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `RunState`    | 智能体位置的harness侧状态，如模型项、工具状态、审批等。 | 运行器应在暂停期间延续工作流。                    |
| 会话状态 | 客户端可重新连接的序列化沙盒会话。                              | 你的应用或作业系统直接存储提供商会话状态。                 |
| `snapshot`    | 用于初始化新沙盒会话的已保存工作区内容。                            | 新运行应从已保存的文件和工件开始，而非空工作区。 |

实际上，运行器按以下顺序解析沙箱会话：

1. 如果你传入一个实时沙盒会话，运行器将直接复用该会话。
2. 否则，如果运行正在从 `RunState`，恢复，运行器将从存储的沙盒会话状态继续。
3. 否则，如果你传入显式的序列化沙盒状态，运行器将从该状态恢复。
4. 否则，运行器将创建一个全新的沙盒会话。对于该新会话，如果提供了每次运行的清单，则使用该清单；否则使用智能体的默认清单。

沙盒恢复示例会序列化已停止的会话状态，并通过
同一客户端恢复它，然后将恢复的会话传回下一次
运行：

序列化并恢复沙盒状态

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
  model: "gpt-5.6",
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


新会话输入，如 `manifest` 和 `snapshot` 仅在
运行器创建新的沙盒会话时适用。如果你注入一个实时 `session`，能力
处理可以添加兼容的非挂载条目，但不能更改根目录、
环境、用户或组；不能移除现有条目；不能替换条目类型；也不能
在已运行的沙盒上添加或更改挂载条目。

这种分离允许测试框架在沙盒提供程序
恢复或重建工作区时恢复智能体循环。这些路径的当前示例代码位于
TypeScript [恢复会话状态示例][sdk-js-example-resume] 和
Python [`main.py`][sdk-example-sandbox-resume] 和
[`sandbox_agent_with_remote_snapshot.py`][sdk-example-remote-snapshot].

## 跨运行持久化记忆

沙盒记忆让未来的沙盒智能体运行可以从先前的运行中学习。它与SDK管理的对话
记忆是分开的： `Session` 会话保留
消息历史，而沙盒记忆从先前
的工作区运行中提炼出有用的经验，放入智能体以后可以读取的文件中。

当智能体需要保留用户偏好、纠正意见、
项目特定经验或任务摘要，而无需重放每一轮
对话时，请使用记忆。恢复和快照保留工作区状态；记忆保留可复用的
关于工作区中已完成工作的指导。

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


默认情况下，记忆同时支持读取和生成。记忆读取需要 shell
访问权限，以便智能体可以搜索和打开记忆文件。默认情况下，实时记忆
更新还需要文件系统访问权限，以便智能体可以修复过时的记忆或
在用户要求时更新记忆。

记忆读取使用渐进式披露。SDK在 `memory_summary.md` 运行开始时注入
，智能体会搜索 `MEMORY.md` 当先前的工作看起来
相关时，并且仅在需要更多细节时才打开回滚摘要。

| 内存模式          | 使用时机                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| 默认读写   | 智能体应读取现有内存并生成新内存。          |
| 只读内存     | 智能体应读取内存，但运行后不生成新内存。 |
| 仅生成内存 | 运行应生成内存而不使用现有内存。           |
| 读取配置          | 你需要禁用实时更新。                                       |
| 生成配置      | 你需要调整生成参数，如额外提示。                  |
| 布局配置        | 智能体需要在同一工作区中隔离内存布局。      |

默认情况下，记忆产物保存在沙箱工作区中：

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

运行时会在沙箱会话期间追加运行片段。当会话
关闭时，记忆生成会首先提取对话摘要和原始
记忆，然后将这些原始记忆整合为 `MEMORY.md` 和
`memory_summary.md`。要在后续运行中重用记忆，请通过保持相同的实时沙箱会话、从
会话状态恢复、从快照启动或挂载持久化存储（例如
S3）来保留配置的
S3。

对于多轮沙箱聊天，请使用稳定的 SDK 会话以及相同的
实时沙箱会话。记忆按显式对话 ID 分组，然后按
SDK 会话 ID，接着按运行组 ID，最后按生成的每次运行 ID 分组。
沙箱会话 ID 标识实时工作区；它不是记忆
对话 ID。

有关可运行示例，请参阅 TypeScript [记忆指南][sdk-js-sandbox-memory],
以及 Python [`memory.py`][sdk-example-memory] 适用于本地快照流程，
[`memory_s3.py`][sdk-example-memory-s3] 适用于 S3 支持的记忆存储，以及
[`memory_multi_agent_multiturn.py`][sdk-example-memory-multi-agent] 适用于单独
跨智能体的内存布局。

## 编排沙箱智能体

沙盒智能体与SDK的其他部分组合使用。

当非沙盒的接收交接智能体应仅将
工作流中工作区密集的部分委派给沙盒智能体时，使用交接。顶层运行
继续执行，但沙盒智能体成为下一轮的活跃智能体。

当外部编排器应调用一个或多个沙盒智能体作为工具时，使用智能体作为工具。
将智能体作为嵌套工具。每个沙盒工具智能体可以有自己的沙盒运行
配置、沙盒客户端、清单和提供程序选项。

有关示例，请参阅 [`handoffs.py`][sdk-example-handoffs] 和
[`sandbox_agents_as_tools.py`][sdk-example-agents-as-tools].

## 沙盒提供商

从 Unix-local 开始，可快速进行本地迭代；需要本地
容器隔离时使用 Docker。当任务需要托管
执行、特定于提供商的隔离、扩展、预览、存储挂载、
快照或不应存放在应用服务器上的凭证时，再迁移到托管提供商。

有关提供商特定的设置、凭证、隔离、存储、
预览和持久化行为，请参阅提供商文档。

| 提供商   | SDK 客户端                | 文档与示例                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blaxel     | `BlaxelSandboxClient`     | [沙箱概览](https://docs.blaxel.ai/Sandboxes/Overview)                                                                                                                                                                                                                                                                                                                                                   |
| Cloudflare | `CloudflareSandboxClient` | [沙箱文档](https://developers.cloudflare.com/sandbox/)<br />[OpenAI 智能体 教程](https://docs.cloudflare.com/sandbox/tutorials/openai-agents/)<br />[沙箱桥接示例](https://github.com/cloudflare/sandbox-sdk/tree/main/bridge/examples)                                                                                                                       |
| Daytona    | `DaytonaSandboxClient`    | [沙箱文档](https://www.daytona.io/docs/en/sandboxes/)<br />[OpenAI Agents SDK 指南](https://www.daytona.io/docs/en/guides/openai-agents/openai-agents-sdk-with-sandboxes)                                                                                                                                                                                                              |
| Docker     | `DockerSandboxClient`     | [Docker 文档](https://docs.docker.com/)<br />[TypeScript Docker SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/docker-client.ts)<br />[Python Docker SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/docker/docker_runner.py)                                                             |
| E2B        | `E2BSandboxClient`        | [沙箱文档](https://e2b.dev/docs)<br />[OpenAI Agents SDK 指南](https://e2b.dev/docs/agents/openai-agents-sdk)<br />[发布博客](https://e2b.dev/blog/e2b-is-now-in-agents-sdk)                                                                                                                                                                                             |
| Modal      | `ModalSandboxClient`      | [沙盒指南](https://modal.com/docs/guide/sandboxes)<br />[集成博客](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)<br />[示例仓库](https://github.com/modal-labs/openai-agents-python-example)<br />[Modal 扩展参考](https://github.com/modal-labs/openai-agents-python-example?tab=readme-ov-file#modal-extension-reference) |
| Runloop    | `RunloopSandboxClient`    | [Devbox 概述](https://docs.runloop.ai/docs/devboxes/overview)<br />[隧道](https://docs.runloop.ai/docs/devboxes/tunnels)                                                                                                                                                                                                                                                                      |
| Unix 本地 | `UnixLocalSandboxClient`  | [TypeScript 本地 SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/basic.ts)<br />[Python 本地 SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/unix_local_runner.py)                                                                                                                                           |
| Vercel     | `VercelSandboxClient`     | [沙盒文档](https://vercel.com/docs/vercel-sandbox)<br />[OpenAI Agents SDK 指南](https://vercel.com/kb/guide/building-an-agent-with-openai-agents-sdk-and-vercel-sandbox)<br />[FastAPI 模板](https://vercel.com/templates/template/openai-agents-sdk-with-fastapi)<br />[示例应用](https://github.com/vercel-labs/openai-agents-fastapi-starter)          |

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