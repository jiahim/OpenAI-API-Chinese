# Skills

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

智能体技能让你能在托管和本地的 shell 环境中上传并复用版本化的文件包。

我们以两种形态提供技能支持：本地执行和基于容器的托管执行。
  要在你自己的机器上运行代码，请使用 shell 工具的本地
  执行模式。 [shell 工具](https://developers.openai.com/api/docs/guides/tools-shell).

## 什么是技能

技能（Skill）是一个带版本号的文件包，并附带一份 `SKILL.md` 清单（前置元数据 + 说明）。技能是可复用的指令，可用来将流程和规范沉淀下来，涵盖公司风格指南到多步骤工作流等各种场景。

技能兼容开放式的 [智能体 Skills 标准](https://agentskills.io/home).

SKILL.md 示例

```markdown
---
name: basic-math
description: Add or multiply numbers.
---

Use this skill when you need a quick sum or product of numbers.
```


## 创建技能

你可以将一个目录以 multipart 形式上传，或者上传一个 `.zip` 其中包含单个顶层文件夹的压缩包。

### 选项 1：目录上传（multipart）

上传多个 `files[]` 部分。每个部分包含单个顶级文件夹内的路径。

创建技能（multipart）

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files[]=@./basic_math/SKILL.md;filename=basic_math/SKILL.md;type=text/markdown' \
  -F 'files[]=@./basic_math/calculate.py;filename=basic_math/calculate.py;type=text/plain'
```


### 选项 2：Zip 上传

将顶层文件夹压缩为 zip 文件并上传。

创建技能（zip）

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./basic_math.zip;type=application/zip'
```


## 将技能与托管 shell 配合使用

如需在托管 shell 环境中挂载技能，可通过以下方式附加： `tools[].environment.skills` 在调用 shell 工具时传入。

在托管 shell 中使用技能

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
  model: "gpt-5.6",
  input: "Use the skills to add 144 and 377, then compute a triangle area with base 9 and height 13.",
  tools: [{
    type: :shell,
    environment: {
      type: :container_auto,
      skills: [
        {type: :skill_reference, skill_id: "<skill_id>"},
        {type: :skill_reference, skill_id: "<skill_id>", version: "2"}
      ]
    }
  }]
)

puts(response.output_text)
```


### 提示行为

一旦挂载了一个技能，模型就可以自行决定何时使用它。如果你希望行为更加确定，可以明确指示模型在合适的时候“使用该 `<skill name>` 技能”。

## 在本地 shell 模式下使用技能

Skills 也支持本地 shell 模式，但本地 shell 和托管 shell 接受的技能附加格式不同。

- 托管 shell 支持上传的 `skill_reference` 附件，包括精心策划的技能和明确的版本。
- 本地 shell 不支持 `skill_reference` 附件。请改为在你控制的运行时中通过本地文件路径提供技能文件。

使用 [Shell 指南](https://developers.openai.com/api/docs/guides/tools-shell) 了解本地 shell 执行的详细信息。

在本地 shell 模式下使用技能

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
  model: "gpt-5.6",
  input: "Use the csv-insights skill to summarize today's CSV reports.",
  tools: [{
    type: :shell,
    environment: {
      type: :local,
      skills: [{
        name: "csv-insights",
        description: "Summarize CSV files and produce a Markdown report.",
        path: "<path-to-skill-folder>"
      }]
    }
  }]
)

puts(response.output_text)
```


## 用户提示中的技能

当技能对该工具可用时，平台会将每个技能的 `name`, `description`，以及 `path` 添加到用户提示的上下文中，以便模型知道该技能的存在。

模型会根据这些元数据决定是否调用某个技能。如果模型调用了某个技能，它会使用 `path` 从 `SKILL.md`.

技能说明属于用户提示输入（而非系统提示输入），因此它们的处理优先级与其他用户提供的说明相同。若需显式控制，你仍然可以指示模型“使用 `<skill name>` 技能”。

## 限制与校验

- `SKILL.md` 文件匹配不区分大小写。
- 仅限一个 `skill.md`/`SKILL.md` 文件可以包含在技能包中。
- 技能 front matter 校验遵循 [智能体 技能规范](https://agentskills.io/specification#name-field).
- zip 上传的最大大小为 `50 MB`.
- 每个技能版本的最大文件数为 `500`.
- 单个文件的最大未压缩大小为 `25 MB`.

## 网络访问的安全性

请务必仔细检查任何与 Responses API 一起使用的技能 (Skill)。技能
  会引入安全风险，例如由提示注入导致的数据外泄。
  请在使用此工具之前仔细阅读 [风险与安全](#risks-and-safety) 部分。
  请在使用此工具之前仔细阅读上述内容。

## 版本控制与管理

### 版本指针

- `default_version` 在未提供版本时使用。
- `latest_version` 追踪最新的上传。
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


### 删除规则

- 你无法删除默认版本；请先将其他版本设为默认。
- 删除最后一个剩余版本会一并删除该技能。
- 删除某个技能会级联移除其所有版本。

## 精选技能

OpenAI 维护了一组可按 id 引用的第一方技能，例如： `openai-spreadsheets`).

引用一个精选技能

```json
{ "type": "skill_reference", "skill_id": "openai-spreadsheets", "version": "latest" }
```


## Inline skills

如果你不想创建托管技能，可以在该环境的 `skills` 数组中内联一个 zip 包（base64）。

内联技能包

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

请务必检查与 Responses API 配合使用的任何 Skill。Skills 会引入安全风险，例如由提示注入导致的数据外泄。

对于结合网络访问使用的 Skills，请仔细查阅 [网络相关的风险与安全章节](https://developers.openai.com/api/docs/guides/tools-shell#risks-and-safety).

#### 将技能视为特权代码与指令

Skill 内容可能会影响规划、工具使用和命令执行。在被开发者验证之前，任何 Skill 都应被视为可能不受信任的输入进行审查。

### 不要向最终用户开放可写入的 Skills 仓库

避免产品设计让最终消费者用户能够自由浏览、选择或挂载来自开放目录的任意 Skills。这会显著增加以下风险：

- 通过恶意 SKILL.md 指令进行提示注入与策略绕过。
- 未经审核的自动化所触发的数据外泄或破坏性操作。

#### 在开发者层面集成 Skills

Skills 应由开发者审查并集成，然后仅通过有边界的 product 体验向最终用户开放。实际上：

- 将 Skills 映射到特定的产品工作流/用例。
- 防止终端用户控制任意 Skill 的选择。
- 将写入或高影响操作置于明确的审批和策略检查之后。

#### Require approval for sensitive actions

对于可能执行写入或高影响操作的工作流，需在执行前获得明确批准。

#### 验证数据驻留与保留要求

我们以两种形式支持 Skills：本地执行和基于托管容器的执行。托管 Skills 遵循与托管 shell 相同的容器生命周期：已挂载的 Skills 和容器文件在容器处于活动状态时保持可用，并在容器过期或被删除时被丢弃。如果你希望执行完全运行在你管理的基础设施上，请使用本地 shell 模式。详细了解我们的 [数据控制](https://developers.openai.com/api/docs/guides/your-data).