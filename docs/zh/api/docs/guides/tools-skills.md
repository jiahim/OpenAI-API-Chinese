# Skills

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt). 可在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

智能体技能为智能体提供针对某项任务的可复用指令和支持文件。可将它们与 Responses API shell 工具一起使用，或在 [智能体 API 沙盒中提供](#agents-api).

下面的上传、附件和版本管理说明描述的是 Responses API shell 工具。智能体 API 会话会从其沙盒中的目录发现技能。

Responses API 以两种形态支持技能：本地执行与
  基于托管容器的执行。若要在你自己的机器上运行代码，请使用
  shell 工具的本地执行模式，或 [shell 工具](https://developers.openai.com/api/docs/guides/tools-shell).

## 什么是技能

技能是一个包含文件的目录，其中包含 `SKILL.md` 清单（前置元数据 + 指令）。技能是可复用的指令，可用于将流程和约定标准化，从公司风格指南到多步骤工作流。已上传的技能使用版本化捆绑包。

技能与开放标准 [智能体 Skills 兼容](https://agentskills.io/home).

SKILL.md 示例

```markdown
---
name: basic-math
description: Add or multiply numbers.
---

Use this skill when you need a quick sum or product of numbers.
```


在技能发现阶段，模型会看到技能的名称和描述。请编写能够同时说明技能用途和使用场景的描述。例如，“使用兜底条款审查并标注供应商协议”比“协助处理法律工作”能为模型提供更有用的上下文。

将主要指令放在 `SKILL.md` 中，并根据需要链接到支持文件：

```text
review-pr/
├── SKILL.md
├── references/
│   └── review-guidelines.md
├── scripts/
│   └── check-changes.sh
└── assets/
    └── review-template.md
```

使用 `references/` 存放背景材料， `scripts/` 存放可重复执行的操作，以及 `assets/` 存放可复用的模板。

## Create a skill

你可以将目录以 multipart 表单数据形式上传，或者上传一个 `.zip` 其中包含单个顶层文件夹。

### 方式一：目录上传（multipart）

上传多个 `files[]` 部分。每个部分包含单个顶层文件夹内的路径。

创建技能（multipart）

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files[]=@./basic_math/SKILL.md;filename=basic_math/SKILL.md;type=text/markdown' \
  -F 'files[]=@./basic_math/calculate.py;filename=basic_math/calculate.py;type=text/plain'
```


### 方式 2：压缩包上传

将顶层文件夹打包为 zip 并上传该 zip 文件。

创建技能（zip）

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./basic_math.zip;type=application/zip'
```


## 使用 hosted shell 技能

若要在托管的 shell 环境中挂载技能，请通过以下方式附加它们： `tools[].environment.skills` 在调用 shell 工具时附加。

在托管 shell 中使用技能

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_auto",
          "skills": [
            { "type": "skill_reference", "skill_id": "<skill_id>" },
            { "type": "skill_reference", "skill_id": "<skill_id>", "version": 2 }
          ]
        }
      }
    ],
    "input": "Use the skills to add 144 and 377, then compute triangle area with base 9 height 13."
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_auto",
        skills: [
          { type: "skill_reference", skill_id: "<skill_id>" },
          { type: "skill_reference", skill_id: "<skill_id>", version: "2" },
        ],
      },
    },
  ],
  input:
    "Use the skills to add 144 and 377, then compute triangle area with base 9 height 13.",
});

console.log(response.output_text);
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_auto",
                "skills": [
                    {"type": "skill_reference", "skill_id": "<skill_id>"},
                    {
                        "type": "skill_reference",
                        "skill_id": "<skill_id>",
                        "version": 2,
                    },
                ],
            },
        }
    ],
    input="Use the skills to add 144 and 377, then compute triangle area with base 9 height 13.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerAuto: &responses.ContainerAutoParam{
			Skills: []responses.ContainerAutoSkillUnionParam{
				{OfSkillReference: &responses.SkillReferenceParam{SkillID: "<skill_id>"}},
				{OfSkillReference: &responses.SkillReferenceParam{SkillID: "<skill_id>", Version: openai.String("2")}},
			},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the skills to add 144 and 377, then compute triangle area with base 9 height 13.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

String skillId = "<skill_id>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input(
            "Use the skills to add 144 and 377, then compute a triangle area with base 9 and height 13.")
        .putAdditionalBodyProperty(
            "tools",
            JsonValue.from(
                List.of(
                    Map.of(
                        "type",
                        "shell",
                        "environment",
                        Map.of(
                            "type",
                            "container_auto",
                            "skills",
                            List.of(
                                Map.of("type", "skill_reference", "skill_id", skillId),
                                Map.of(
                                    "type", "skill_reference",
                                    "skill_id", skillId,
                                    "version", "2")))))))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Use the skills to add 144 and 377, then compute a triangle area with base 9 and height 13.",
  tools: [
    {
      type: :shell,
      environment: {
        type: :container_auto,
        skills: [
          {
            type: :skill_reference,
            skill_id: "<skill_id>"
          },
          {
            type: :skill_reference,
            skill_id: "<skill_id>",
            version: "2"
          }
        ]
      }
    }
  ]
)

puts(response.output_text)
```


### 提示行为

技能挂载后，模型可以自行决定何时使用它。如果你希望行为更确定，可以显式指示模型“使用 `<skill name>` skill" 当适用时。

## 在本地 shell 模式下使用技能

技能也可与本地 shell 模式配合使用，但本地 shell 与托管 shell 接受不同的技能挂载格式。

- Hosted shell 支持上传 `skill_reference` 附件，包括精选的技能和明确的版本。
- Local shell 不支持 `skill_reference` 附件。请改为在你控制的运行时中通过本地文件路径提供技能文件。

使用 [Shell 指南](https://developers.openai.com/api/docs/guides/tools-shell) 了解本地 shell 执行细节。

在本地 shell 模式下使用技能

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "local",
          "skills": [
            {
              "name": "csv-insights",
              "description": "Summarize CSV files and produce a markdown report.",
              "path": "<path-to-skill-folder>"
            }
          ]
        }
      }
    ],
    "input": "Use the csv-insights skill and run locally to summarize today\'s CSV reports in this repo."
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  tools: [
    {
      type: "shell",
      environment: {
        type: "local",
        skills: [
          {
            name: "csv-insights",
            description: "Summarize CSV files and produce a markdown report.",
            path: "<path-to-skill-folder>",
          },
        ],
      },
    },
  ],
  input:
    "Use the csv-insights skill and run locally to summarize today's CSV reports in this repo.",
});

console.log(response.output_text);
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "local",
                "skills": [
                    {
                        "name": "csv-insights",
                        "description": "Summarize CSV files and produce a markdown report.",
                        "path": "<path-to-skill-folder>",
                    }
                ],
            },
        }
    ],
    input="Use the csv-insights skill and run locally to summarize today's CSV reports in this repo.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfLocal: &responses.LocalEnvironmentParam{
			Skills: []responses.LocalSkillParam{{
				Name:        "csv-insights",
				Description: "Summarize CSV files and produce a markdown report.",
				Path:        "<path-to-skill-folder>",
			}},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the csv-insights skill and run locally to summarize today's CSV reports in this repo.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

String skillPath = "<path-to-skill-folder>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Use the csv-insights skill to summarize today's CSV reports.")
        .putAdditionalBodyProperty(
            "tools",
            JsonValue.from(
                List.of(
                    Map.of(
                        "type",
                        "shell",
                        "environment",
                        Map.of(
                            "type",
                            "local",
                            "skills",
                            List.of(
                                Map.of(
                                    "name", "csv-insights",
                                    "description",
                                        "Summarize CSV files and produce a Markdown report.",
                                    "path", skillPath)))))))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Use the csv-insights skill to summarize today's CSV reports.",
  tools: [
    {
      type: :shell,
      environment: {
        type: :local,
        skills: [
          {
            name: "csv-insights",
            description: "Summarize CSV files and produce a Markdown report.",
            path: "<path-to-skill-folder>"
          }
        ]
      }
    }
  ]
)

puts(response.output_text)
```


## 智能体 API

若要在 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview)，中使用技能，需将技能目录放入沙箱，并在创建会话时将其父目录注册到 `environment.capability_directories` 中。这些目录被称为 **能力目录**。运行环境会用它们来发现技能；该配置不使用托管 shell 的 `skill_reference` 附加格式。

例如，将合同审查技能和拉取请求审查技能放入沙箱：

```text
/workspace/capabilities/
├── legal/
│   └── contract-redline/
│       ├── SKILL.md
│       └── references/
│           └── fallback-clauses.md
└── engineering/
    └── review-pr/
        ├── SKILL.md
        └── references/
            └── review-guidelines.md
```

在创建会话的请求中使用以下环境配置：

```json
{
  "environment": {
    "type": "self_hosted",
    "workspace_directory": "/workspace",
    "capability_directories": [
      "/workspace/capabilities/legal",
      "/workspace/capabilities/engineering"
    ]
  }
}
```

能力目录需满足以下要求：

- 路径必须指向沙箱内的目录。
- 路径必须是绝对路径且唯一，且不能包含 `.` 或 `..` 路径段。
- 一个会话最多可注册 32 个能力目录。
- 目录必须已经存在于环境中。

一旦沙盒可用，运行时会搜索这些目录以寻找 `SKILL.md` 文件，并将每个发现的技能的名称和描述添加到上下文中。模型可以选择相关的技能，并读取其完整指令和支持文件。

参见 [智能体配置](https://developers.openai.com/api/docs/guides/agents-api/configuration) 了解会话设置，以及 [连接沙盒](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 以了解执行环境。在将技能及其支持文件提供给 智能体 之前，请先审查它们，并遵循 [沙盒安全指南](https://developers.openai.com/api/docs/guides/agents-api/environments/security).

## 用户提示中的 Skills

对于 Responses API shell 工具，平台会将每个可用技能的 `name`, `description`，以及 `path` 添加到用户提示上下文中，以便模型知道该技能的存在。

模型会根据这些元数据决定是否调用某个技能。如果模型调用了某个技能，它会使用 `path` 从以下位置读取完整的 Markdown 说明： `SKILL.md`.

技能说明属于用户提示输入（而非系统提示输入），因此其处理优先级与其他用户提供的说明相同。如果需要显式控制，你仍然可以指示模型“使用该 `<skill name>` 技能”。

## 限制与校验

- `SKILL.md` 文件匹配不区分大小写。
- 仅允许一个 `skill.md`/`SKILL.md` 文件包含在技能包中。
- 技能 front matter 校验遵循 [智能体 技能规范](https://agentskills.io/specification#name-field).
- zip 上传最大大小为 `50 MB`.
- 每个技能版本最大文件数为 `500`.
- 单个文件解压后最大大小为 `25 MB`.

## 网络访问的安全保障

检查任何与 Responses API 配合使用的 Skill 时必须格外谨慎。Skills
  会引入诸如提示注入导致的数据外泄等安全风险。
  请在使用此工具之前， [仔细阅读下方](#risks-and-safety) “风险与安全”部分。
  在使用此工具前，请仔细阅读上述内容。

## 版本控制与管理

### 版本指针

- `default_version` 在未提供版本号时使用。
- `latest_version` 会追踪最新的上传。
- `skill_reference.version` 接受一个整数或 `"latest"`.

### 创建新版本

创建新的技能版本

```bash
curl -X POST 'https://api.openai.com/v1/skills/<skill_id>/versions' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./geometry.zip;type=application/zip'
```


### 设置默认版本

设置技能的默认版本

```bash
curl -X POST 'https://api.openai.com/v1/skills/<skill_id>' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{"default_version": 2}'
```


### Delete rules

- 你无法删除默认版本；请先将其他版本设为默认。
- 删除最后剩余的版本将一并删除该技能。
- 删除某个技能会级联移除其全部版本。

## 精选技能

OpenAI 维护了一组可通过 id 引用的第一方技能（例如， `openai-spreadsheets`).

引用经过精心挑选的技能

```json
{ "type": "skill_reference", "skill_id": "openai-spreadsheets", "version": "latest" }
```


## 内联技能

如果你不想创建托管技能，可以将 zip 包（base64）内联到环境的 `skills` 数组中。

内联一个技能包

```bash
INLINE_ZIP=$(base64 -i ./basic_math.zip)

curl -L 'https://api.openai.com/v1/containers' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "inline-skill-container",
    "skills": [
      {
        "type": "inline",
        "name": "basic_math",
        "description": "Add or multiply numbers.",
        "source": {
          "type": "base64",
          "media_type": "application/zip",
          "data": "'"$INLINE_ZIP"'"
        }
      }
    ]
  }'
```


## 风险与安全

务必检查任何与 Responses API 配合使用的 Skill。Skills 会引入安全风险，例如由提示注入导致的数据外泄。

对于结合网络访问使用的 Skills，请仔细查阅 [网络相关的风险与安全章节](https://developers.openai.com/api/docs/guides/tools-shell#risks-and-safety).

#### 将技能视为特权代码与指令

Skill 内容可能会影响规划、工具使用和命令执行。任何 Skill 都应被视为潜在不可信的输入，直至由开发者验证通过。

### 不要将开放的 Skills 仓库暴露给最终用户

避免出现以下产品设计：允许消费端最终用户从开放目录中自由浏览、选择或附加任意 Skills。这会显著增加以下风险：

- 通过恶意 SKILL.md 指令进行提示注入和策略绕过。
- 由未经审查的自动化触发数据外泄或破坏性操作。

#### 在开发者层面集成 Skills

技能应由开发者进行检查与集成，并通过受限的产品体验呈现给最终用户。在实践中：

- 将 Skills 映射到具体的产品工作流/用例。
- 阻止最终用户随意选择 Skill。
- 将写入或高影响操作置于明确的审批与策略检查之后。

#### Require approval for sensitive actions

对于可能执行写入或高影响操作的智能体，请在执行前要求明确审批。

#### 验证数据驻留与保留要求

Responses API 以两种形式支持 Skills：本地执行和基于托管容器的执行。托管 Skills 遵循与托管 shell 相同的容器生命周期：挂载的 Skills 和容器文件在容器处于活动状态期间保持可用，并在容器到期或被删除时被丢弃。如果你希望执行完全在你管理的基础设施上进行，请使用本地 shell 模式。有关 智能体 API 沙箱，请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle)。请阅读更多关于我们的 [数据控制](https://developers.openai.com/api/docs/guides/your-data).