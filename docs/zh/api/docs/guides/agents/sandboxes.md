# 沙箱 智能体

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt).各文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

沙箱为智能体提供一个隔离的、类 Unix 的执行环境，其中包含
文件系统、shell、已安装的软件包、挂载的数据、暴露的端口、快照，
以及对外部系统的受控访问。

当模型需要这类工作区，但智能体工作流只接收到提示词上下文时，就会变得脆弱：
大型文档集、生成的产物、
命令、预览以及可恢复的工作，都需要一个智能体能够检视和修改的环境。
检视和修改。

沙箱式智能体已在 TypeScript 和 Python Agents SDK 中提供。它
  们目前处于测试阶段，因此 API 的细节、默认值和支持的能力可能会发生变化。

当智能体需要操作文件、运行命令、挂载数据
室、生成产物、暴露服务，或稍后继续有状态的工作时，可使用沙箱。
稍后继续有状态的工作时，可使用沙箱。

关键的拆分在于宿主程序与计算之间的边界。宿主程序是
模型周围的控制平面：它拥有智能体循环、模型调用、工具
路由、交接、审批、追踪、恢复以及运行状态。计算则是
沙箱执行平面，模型驱动的工作在其中读写文件、运行
命令、安装依赖、使用挂载的存储、暴露端口，并对状态进行
快照。

将这些边界分开，可以让应用在受信的基础设施中保留敏感的控制
平面工作，而让沙箱专注于
provider-specific execution.沙箱可以使用受限的
凭据和挂载来针对文件运行代码；harness 可以将鉴权、计费、审计日志、人工
审核和恢复状态保留在任一容器之外。



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

当智能体的答案依赖于在沙箱中完成的工作时，请使用沙箱
工作区，而不仅仅是对提示词上下文进行推理。

常见的痛点包括：

- 任务需要的是一个文档目录，而不是单个提示。
- 该智能体应写入文件，以便你的应用稍后进行检查。
- 该智能体需要命令、包或脚本来完成任务。
- 该工作流会产生诸如 Markdown、CSV、JSONL、截图或生成的网站等制品。
- 某个服务、笔记本或报告预览需要在暴露的端口上运行。
- 工作会暂停以等待人工审核，然后在同一工作区中继续。

如果你的工作流只需要简短的模型响应，并且不需要持久化工作区，
直接调用 [Responses API](https://developers.openai.com/api/reference/responses/overview) ，或者使用
基础 Agents SDK 运行时，且不启用沙箱。

如果 shell 访问只是偶尔使用的工具，可以从托管 shell 工具开始，
[使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)。当工作区隔离、沙箱提供商选择或可恢复的
智能体
文件系统状态属于产品设计的一部分时，请使用沙箱。

## 沙箱能带来什么

`SandboxAgent` 仍然是一个 `Agent`。它保留了常规的 智能体界面，包括
`instructions`, `prompt`, `tools`, `handoffs`、MCP 服务器、模型设置、
结构化输出、护栏和钩子。发生变化的是执行边界：
运行器针对拥有文件的实时沙箱会话来准备 智能体，
命令、端口以及提供商特定的隔离机制。

| 组成单元              | 它负责的内容                                                     | 设计问题                                                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SandboxAgent`     | 智能体 定义以及沙箱默认值                       | 这个 智能体 应该做什么，以及哪些沙箱默认值会随它一起使用？                             |
| `Manifest`         | 全新会话的工作区契约                             | 工作区初始时包含哪些文件、目录、仓库、挂载、环境、用户或用户组？ |
| 能力       | 附加到 智能体 的沙箱原生行为                    | 这个 智能体 需要哪些沙箱工具、指令或运行时行为？                      |
| 沙箱客户端     | 提供者集成                                         | 实时工作区应该在哪里运行：Unix 本地、Docker，还是托管提供者？                    |
| 沙箱会话    | 实时执行环境                                   | 命令在哪里执行、文件在哪里修改、端口在哪里打开，以及提供者状态存放在哪里？                         |
| 沙箱运行配置 | 每次运行的沙箱会话来源、客户端选项以及全新输入 | 此次运行是注入、恢复还是创建沙箱会话？                                    |
| 已保存状态        | `RunState`、序列化会话状态和快照              | 后续运行应如何重新连接以恢复工作或为新工作区播种？                                  |

沙箱专属默认值属于 `SandboxAgent`。每次运行的沙箱会话
选择属于该运行的沙箱配置。

沙箱 智能体 也不会改变“轮次”的含义。轮次仍然是指模型
step，而不是单个 shell 命令或沙箱操作。有些工作可能停留在
沙箱执行层内部。智能体 运行时仅在需要时才会消费另一个回合，也就是在沙箱工作完成后
需要再次发起模型响应时。

## 创建工作区

`Manifest` 描述全新沙盒工作区期望的初始内容和布局。
使用它来指定智能体应看到的文件、仓库、输入制品、辅助文件、
挂载点、输出目录以及环境设置。智能体 should see.

将清单视为新会话的契约，而不是每个在线沙盒的完整事实来源。
运行时的有效工作区可能来自
复用的在线沙盒会话、序列化的沙盒会话状态或在运行时选择的快照
。

清单条目路径是相对于工作区的。它们不能是绝对路径，也不能
通过以下方式脱离工作区： `..`，这使得工作区契约可以在本地、Docker 和托管客户端之间移植
。

| Manifest 输入                                                                 | 用于                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `File`, `Dir`                                                                  | 小型合成输入、辅助文件或输出目录。                          |
| 本地文件或目录                                                        | 要放入沙箱的主机文件或目录。                            |
| Git 仓库                                                                       | 要拉取到工作区中的仓库。                                             |
| `S3Mount`, `GCSMount`, `R2Mount`, `AzureBlobMount`, `BoxMount`, `S3FilesMount` | 在沙箱内可用的外部存储。                                |
| `environment`                                                                  | 沙箱启动时需要的环境变量。                               |
| `users` 和 `groups`                                                           | 支持账户配置的提供商所使用的沙箱本地操作系统账户和组。 |

良好的清单设计意味着：

- 将仓库、输入制品和输出目录放在清单中。
- 将较长的任务规范和仓库本地说明放在工作区文件中，例如 `repo/task.md` 或 `AGENTS.md`.
- 在说明中使用相对工作区路径，例如 `repo/task.md` 或 `output/report.md`.
- 将挂载存储的范围限定在智能体应当读取或写入的输入范围内。
- 将挂载项视为临时的工作区条目：快照和持久化流程会跳过挂载的远程存储，而不是将其复制到已保存的工作区内容中。

### 挂载文件和存储

有用的数据通常已经存在于别处。与其将大型
文档粘贴到上下文中，不如将它们挂载到沙盒中，让智能体直接使用
文件。

示例：

- 挂载一个尽职调查资料库,并要求智能体生成带引用的摘要。
- 挂载一份支持导出文件,并要求智能体将问题聚类整理成一份报告。
- 挂载生成的产物,以便其他系统可以审阅它们。

提供商集成各自暴露其挂载辅助函数、凭证处理方式以及
持久化行为。请保持应用契约不变：仅挂载该
输入智能体应使用的内容，告知智能体读写位置，并检查
生成产物后再使用。

### 处理密钥和凭据

将沙箱凭据视为运行时配置，而非提示内容。
智能体 可能需要访问包管理器、存储挂载或提供商的凭据，
provider APIs，但这些凭据不应出现在用户提示中，
智能体 指令、任务文件、已提交的清单或生成的制品中。

请遵循以下规则：

- 对托管沙箱提供方，优先使用提供方原生的密钥管理系统。
- 将云存储凭据的作用范围限定到所需的挂载点或提供方选项。
- 使用 `Manifest.environment` 保存沙箱进程启动时所需的变量，并将敏感或生成的条目标记为临时使用（ephemeral），以便在需要时重新生成而不是持久保存。
- 避免保存密钥、生成的挂载配置、本地令牌或不应当跨运行保留的文件。
- 将工件移出沙箱之前进行审查，尤其当智能体可以读取私密文档或已挂载的存储时。

SDK 支持清单环境值和特定于 provider 的挂载
凭证。通用的密钥存储集成因 provider 而异，因此请使本
页专注于契约：你的运行时或沙箱 provider 应当注入
凭证，而不是将凭证作为指令教给模型。

## 赋予智能体能力

能力将沙箱原生行为附加到 `SandboxAgent`。它们可以塑造
工作区在运行开始前的状态，追加沙箱特定的指令，并暴露
绑定到实时沙盒会话的工具，并调整该智能体的模型行为或输入
处理逻辑。

| 能力                              | 何时添加                                                  | 说明                                                                                |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `Shell`                                 | 智能体需要 shell 访问权限。                                | 添加命令执行，以及在沙盒客户端支持时的交互式输入。 |
| `Filesystem`                            | 智能体需要编辑文件或查看本地图像。       | 添加 `apply_patch` 和 `view_image`；补丁路径相对于工作区根目录。        |
| `Skills`                                | 你希望在沙盒内进行技能发现和物化。 | 优先选择此方式，而不是手动挂载 `.agents` 或 `.agents/skills`.                    |
| [`Memory`](#persist-memory-across-runs) | 后续运行应读取或生成记忆制品。     | 需要 `Shell`；实时记忆更新也需要 `Filesystem`.                     |
| `Compaction`                            | 长时间运行的工作流需要进行上下文裁剪。                    | 在压缩项之后调整模型行为和输入处理。                    |

默认情况下， `SandboxAgent` 包含文件系统、shell 和压缩
能力。如果传入一个 `capabilities` 列表，它会替换默认列表，
因此请包含 智能体 仍然需要的默认能力。

在合适的时候优先使用内置能力。仅当
你需要内置能力未涵盖的、特定于沙箱的工具或指令面时，才
编写自定义能力。

### 加载技能

某些任务需要在
智能体启动之前具备可重复使用的指令、脚本、引用或资源。使用 `Skills` 能力，使智能体能够在运行期间发现该
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


根据你希望技能以何种方式落地，选择技能来源：

- 对于较大的本地 skill 目录，当你希望模型先发现索引并且仅加载所需内容时，使用惰性本地目录源。
- 对于较小的本地 bundle，使用本地目录源进行预先暂存。
- 当 skill bundle 有自己的发布节奏或被许多 sandbox 使用时，使用 Git 仓库源。

### Expose previews and ports

有时产物并不是文件，而是一个正在运行的进程。当智能体创建了一个本地应用、
port when the 智能体 creates a local app, notebook, report server, browser
预览，或其他需要在沙箱外部进行检查的服务时，请使用暴露的端口。

端口设置因提供商而异，但产品契约是相同的：
智能体在沙箱内启动该服务，沙箱客户端暴露该端
口，然后你的应用共享或检查得到的预览 URL。

## 运行沙箱 智能体

最短可用的沙箱循环是：

1. 构建一个 `Manifest` 用于描述工作区。
2. 创建一个 `SandboxAgent` ，使其具备模型所需的能力。
3. 为运行工作的环境选择沙盒客户端。
4. 使用每次运行的沙盒配置运行智能体。
5. 检查、复制、恢复或快照化对你的应用重要的产物。

从 Unix-local 入手，用于在 macOS 或 Linux 上进行本地开发。它能为你提供
最小的本地循环，因为运行器可以从
智能体的默认清单创建一个临时工作区，并在运行结束后清理它。

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


如需完整的本地示例，请参阅 TypeScript [sandbox 智能体 快速入门][sdk-js-example-basic] 和 Python [`unix_local_runner.py`][sdk-example-unix-local-runner].

### 切换提供商

Provider 是运行配置的一部分，而不属于 智能体 定义。保持
该 `SandboxAgent`，清单和 capabilities 稳定，然后根据所需环境切换沙盒
客户端和 provider 选项。

本示例使用 Docker 进行本地容器隔离。托管 provider 遵循
相同的模式，使用各自的客户端类和选项。

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


有关可运行示例，请参阅 TypeScript [沙盒客户端指南][sdk-js-sandbox-clients] 和 [基础示例][sdk-js-example-basic]，以及 Python [`basic.py`][sdk-example-basic] 中的 provider 选择， [`docker_runner.py`][sdk-example-docker-runner] 对应 Docker，以及 [`main.py`][sdk-example-dataroom-qa] 对应 SDK 代码库中的资料室流程。

### 高级模式

一旦基础循环能够工作，沙箱在以下场景中就会很有用：
智能体 需要一个沙箱工作区来替代更多的提示上下文。这些
示例是工作流 模式，而不是单独的 API：同一个执行框架可以路由、暂停、
resume，并追踪这个工作流，同时每个沙箱都让执行保持在所需的
文件、工具和端口附近。

| 示例                                                | 描述                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [数据室问答][sdk-example-dataroom-qa]               | 基于已挂载的数据室回答问题。                    |
| [数据室表格提取][sdk-example-dataroom]     | 从已挂载的数据室中提取表格。                     |
| [代码仓库评审][sdk-example-repo-code-review] | 克隆仓库、检查代码并产出代码评审产物。  |
| [视觉网站克隆][sdk-example-vision-clone]       | 使用 Vision API 和截图反馈克隆网站。 |
| [沙箱恢复][sdk-example-sandbox-resume]           | 在已有的沙箱中恢复工作。                        |

## Resume or seed future work

有用的智能体工作往往比单次请求更持久。用户审阅产物、某
一步骤需要审批，或者下一步骤依赖后续事件。

将三个状态概念分开处理：

| 状态层 | 恢复                                                                                  | 使用场景                                                                       |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `RunState`    | Harness 侧状态，例如模型项、工具状态、审批以及当前 智能体 位置。 | 运行器应在暂停之间将 工作流 向前延续。                    |
| 会话状态 | 客户端可重新连接的、已序列化的沙盒会话。                              | 你的应用或作业系统直接存储 provider 会话状态。                 |
| `snapshot`    | 用于为新沙盒会话提供初始内容的已保存工作区内容。                            | 新的运行应从已保存的文件和产物开始，而不是一个空工作区。 |

实际运行中，运行器按以下顺序解析沙箱会话：

1. 如果你传入一个在线沙箱会话，runner 会直接复用该会话。
2. 否则，如果运行从 `RunState`，恢复，runner 会从已存储的沙箱会话状态继续。
3. 否则，如果你传入显式的序列化沙箱状态，runner 会从该状态继续。
4. 否则，runner 会创建一个新的沙箱会话。对于该新会话，如果提供了每次运行的清单，则使用该清单；否则使用智能体的默认清单。

sandbox resume 示例会序列化已停止的会话状态，然后恢复它
通过同一个客户端，并将恢复后的会话传回下一次
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


Fresh-session 输入（例如 `manifest` 和 `snapshot` 仅在
runner 创建新的沙箱会话时才会生效。如果你注入一个已运行的 `session`，能力
处理过程可以添加兼容的非挂载条目，但不能更改 root、
environment、users 或 groups；不能移除现有条目；不能替换条目类型；也不能
在已经运行的沙箱上添加或更改挂载条目。

这种拆分让执行框架能够恢复 智能体 循环，同时由沙箱提供方
还原或重新创建工作区。这些路径的当前示例代码位于
TypeScript 的 [resume session state 示例][sdk-js-example-resume] 和
Python [`main.py`][sdk-example-sandbox-resume] 和
[`sandbox_agent_with_remote_snapshot.py`][sdk-example-remote-snapshot].

## 跨运行持久化记忆

沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 SDK 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。
沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。 `Session` 沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。
沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。
沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。

沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。
沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。
沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。
沙箱内存可让未来的沙箱-智能体 运行从先前的运行中学习。它独立于 开发工具包 管理的对话式内存：会话保留消息历史，而沙箱内存则将先前工作区运行中的有用经验提炼为智能体稍后可读取的文件。当智能体应当在不重放每一轮先前对话的前提下，沿用用户偏好、修正、项目专属经验或任务摘要时，请使用内存。Resume（恢复）与快照保留工作区状态；内存则保留关于工作区中所发生工作的可复用指导。

启用沙箱内存

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


内存默认同时启用读取与生成。内存读取需要 shell 访问权限，以便 智能体 能够搜索并打开内存文件。默认情况下，实时内存更新也需要文件系统访问权限，这样 智能体 就能在用户提出请求时修复过时的内存或更新内存。内存读取采用渐进式披露方式。SDK 会在运行开始时注入相关内容，当智能体在先前工作看起来相关时进行搜索，并且仅在需要更多细节时才打开 rollout 摘要。
内存默认同时启用读取与生成。内存读取需要 shell 访问权限，以便 智能体 能够搜索并打开内存文件。默认情况下，实时内存更新也需要文件系统访问权限，这样 智能体 就能在用户提出请求时修复过时的内存或更新内存。内存读取采用渐进式披露方式。开发工具包 会在运行开始时注入相关内容，当智能体在先前工作看起来相关时进行搜索，并且仅在需要更多细节时才打开 rollout 摘要。
内存默认同时启用读取与生成。内存读取需要 shell 访问权限，以便 智能体 能够搜索并打开内存文件。默认情况下，实时内存更新也需要文件系统访问权限，这样 智能体 就能在用户提出请求时修复过时的内存或更新内存。内存读取采用渐进式披露方式。开发工具包 会在运行开始时注入相关内容，当智能体在先前工作看起来相关时进行搜索，并且仅在需要更多细节时才打开 rollout 摘要。
内存默认同时启用读取与生成。内存读取需要 shell 访问权限，以便 智能体 能够搜索并打开内存文件。默认情况下，实时内存更新也需要文件系统访问权限，这样 智能体 就能在用户提出请求时修复过时的内存或更新内存。内存读取采用渐进式披露方式。开发工具包 会在运行开始时注入相关内容，当智能体在先前工作看起来相关时进行搜索，并且仅在需要更多细节时才打开 rollout 摘要。

内存默认同时启用读取与生成。内存读取需要 shell 访问权限，以便 智能体 能够搜索并打开内存文件。默认情况下，实时内存更新也需要文件系统访问权限，这样 智能体 就能在用户提出请求时修复过时的内存或更新内存。内存读取采用渐进式披露方式。开发工具包 会在运行开始时注入相关内容，当智能体在先前工作看起来相关时进行搜索，并且仅在需要更多细节时才打开 rollout 摘要。 `memory_summary.md` 在
运行开始时，智能体 在先前工作看起来相关时进行搜索， `MEMORY.md` 内存默认同时启用读取与生成。内存读取需要 shell 访问权限，以便 智能体 能够搜索并打开内存文件。默认情况下，实时内存更新也需要文件系统访问权限，这样 智能体 就能在用户提出请求时修复过时的内存或更新内存。内存读取采用渐进式披露方式。开发工具包 会在运行开始时注入相关内容，当智能体在先前工作看起来相关时进行搜索，并且仅在需要更多细节时才打开 rollout 摘要。
并且仅在需要更多细节时才打开 rollout 摘要。

| Memory mode          | 使用场景                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| Default read/write   | 智能体应读取已有记忆并生成新记忆。          |
| Read-only memory     | 智能体应读取记忆，但在运行结束后不生成新记忆。 |
| Generate-only memory | 该运行应在不使用已有记忆的情况下生成记忆。           |
| Read config          | 你需要禁用实时更新。                                       |
| Generate config      | 你需要调整生成配置，例如额外的提示词。                  |
| Layout config        | 智能体在同一沙箱工作区中需要相互隔离的记忆布局。      |

默认情况下，内存制品存放在沙箱工作区中：

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

运行时会先在沙箱会话期间追加运行段。当会话
结束时，内存生成过程会先抽取对话摘要和原始
记忆，再将这些原始记忆整合为 `MEMORY.md` 和
`memory_summary.md`。若要在后续运行中复用内存，请通过保持同一个活跃沙箱会话、从会
话状态恢复、从快照启动，或挂载持久化存储（如
）等方式保留已配置的内存目录。
S3。

对于多轮沙箱聊天，请使用稳定的 SDK 会话以及同一个
活跃沙箱会话。内存会按以下顺序将运行分组：先是显式的对话 ID，然后
是 SDK 会话 ID，接着是运行组 ID，最后是自动生成的逐运行 ID。
沙箱会话 ID 用于标识活跃工作区，它并不是内存的
对话 ID。

有关可运行示例，请参阅 TypeScript [内存指南][sdk-js-sandbox-memory],
以及 Python [`memory.py`][sdk-example-memory] 中的本地快照流程示例，
[`memory_s3.py`][sdk-example-memory-s3] 中关于 S3 内存存储的示例，以及
[`memory_multi_agent_multiturn.py`][sdk-example-memory-multi-agent] 中关于为不同的
智能体 分离内存布局的示例。

## 编写沙盒智能体

沙箱 智能体 可与 SDK 的其余部分组合使用。

当非沙箱接入 智能体 只需要将
工作流中工作区相关的部分委托给沙箱 智能体 时，使用 工作流交接。顶层的 run
会继续，但沙箱 智能体 会成为下一轮的活跃 智能体。

当外层编排器需要调用一个或多个沙箱 智能体 时，将这些智能体用作工具
形式的嵌套工具。每个沙箱工具 智能体 都可以拥有自己的沙箱 智能体 run
配置、沙箱客户端、清单和 provider 选项。

示例见 [`handoffs.py`][sdk-example-handoffs] 和
[`sandbox_agents_as_tools.py`][sdk-example-agents-as-tools].

## 沙盒提供商

从 Unix 本地环境开始，以便进行快速的本地迭代；当你需要本地容器隔离时，使用 Docker
当任务需要托管的执行环境、提供商特定的隔离、伸缩、预览、存储挂载时，迁移到托管提供商
执行、提供商特定的隔离、伸缩、预览、存储挂载，
快照或凭据等不应存放在应用服务器中的内容。

请参阅各提供方文档了解特定于提供方的设置、凭据、隔离、存储、
预览以及持久化行为。

| 提供方   | SDK 客户端                | 文档与示例                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blaxel     | `BlaxelSandboxClient`     | [沙箱概述](https://docs.blaxel.ai/Sandboxes/Overview)                                                                                                                                                                                                                                                                                                                                                   |
| Cloudflare | `CloudflareSandboxClient` | [沙箱文档](https://developers.cloudflare.com/sandbox/)<br />[OpenAI 智能体 教程](https://docs.cloudflare.com/sandbox/tutorials/openai-agents/)<br />[Sandbox Bridge 示例](https://github.com/cloudflare/sandbox-sdk/tree/main/bridge/examples)                                                                                                                       |
| Daytona    | `DaytonaSandboxClient`    | [沙箱文档](https://www.daytona.io/docs/en/sandboxes/)<br />[OpenAI Agents SDK 指南](https://www.daytona.io/docs/en/guides/openai-agents/openai-agents-sdk-with-sandboxes)                                                                                                                                                                                                              |
| Docker     | `DockerSandboxClient`     | [Docker 文档](https://docs.docker.com/)<br />[TypeScript Docker SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/docker-client.ts)<br />[Python Docker SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/docker/docker_runner.py)                                                             |
| E2B        | `E2BSandboxClient`        | [沙箱文档](https://e2b.dev/docs)<br />[OpenAI Agents SDK 指南](https://e2b.dev/docs/agents/openai-agents-sdk)<br />[发布博客](https://e2b.dev/blog/e2b-is-now-in-agents-sdk)                                                                                                                                                                                             |
| Modal      | `ModalSandboxClient`      | [沙箱指南](https://modal.com/docs/guide/sandboxes)<br />[集成博客](https://modal.com/blog/building-with-modal-and-the-openai-agent-sdk)<br />[示例仓库](https://github.com/modal-labs/openai-agents-python-example)<br />[Modal 扩展参考](https://github.com/modal-labs/openai-agents-python-example?tab=readme-ov-file#modal-extension-reference) |
| Runloop    | `RunloopSandboxClient`    | [Devbox 概述](https://docs.runloop.ai/docs/devboxes/overview)<br />[Tunnels](https://docs.runloop.ai/docs/devboxes/tunnels)                                                                                                                                                                                                                                                                      |
| Unix-local | `UnixLocalSandboxClient`  | [TypeScript 本地 SDK 示例](https://github.com/openai/openai-agents-js/blob/main/examples/docs/sandbox-agents/basic.ts)<br />[Python 本地 SDK 示例](https://github.com/openai/openai-agents-python/blob/main/examples/sandbox/unix_local_runner.py)                                                                                                                                           |
| Vercel     | `VercelSandboxClient`     | [沙箱文档](https://vercel.com/docs/vercel-sandbox)<br />[OpenAI Agents SDK 指南](https://vercel.com/kb/guide/building-an-agent-with-openai-agents-sdk-and-vercel-sandbox)<br />[FastAPI 模板](https://vercel.com/templates/template/openai-agents-sdk-with-fastapi)<br />[示例应用](https://github.com/vercel-labs/openai-agents-fastapi-starter)          |

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