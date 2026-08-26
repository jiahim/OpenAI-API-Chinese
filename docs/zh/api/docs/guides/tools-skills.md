# 技能

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

智能体技能（Agent Skills）让你能够在托管和本地 shell 环境中上传并复用带版本的文件包。

我们支持两种形态的技能：本地执行和托管，
  式容器执行。要在你自己的机器上运行代码，请使用
  shell 工具的本地 [执行模式](https://developers.openai.com/api/docs/guides/tools-shell).

## 什么是技能

技能是文件的版本化捆绑包，外加 `SKILL.md` 清单（前置元数据 + 指令）。技能是模块化指令，可用于将流程和约定编码化，从公司风格指南到多步骤工作流皆可。

技能兼容开放的 [Agent Skills 标准](https://agentskills.io/home).

示例 SKILL.md

```markdown
---
name: basic-math
description: Add or multiply numbers.
---

Use this skill when you need a quick sum or product of numbers.
```


## 创建技能

你可以将目录作为多部分表单数据上传，或上传一个 `.zip` ，其中包含一个单一顶层文件夹。

### 选项 1：目录上传（multipart）

上传多个 `files[]` 部分。每个部分包含单个顶层文件夹内的路径。

创建技能（multipart）

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files[]=@./basic_math/SKILL.md;filename=basic_math/SKILL.md;type=text/markdown' \
  -F 'files[]=@./basic_math/calculate.py;filename=basic_math/calculate.py;type=text/plain'
```


### 选项 2：Zip 上传

压缩顶层文件夹并上传 zip 文件。

创建技能（zip）

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./basic_math.zip;type=application/zip'
```


## 使用托管 Shell 技能

要在托管的 shell 环境中挂载技能，请在 `tools[].environment.skills` 调用 shell 工具时附加它们。

在托管的 shell 中使用技能

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

技能挂载后，模型可以自行决定何时使用它。如果你希望行为更具确定性，请明确指示模型在适当时“使用该 `<skill name>` 技能”。

## 在本地 Shell 模式下使用技能

技能也适用于本地 shell 模式，但本地 shell 和托管 shell 不接受相同的技能附件格式。

- 托管 Shell 支持上传 `skill_reference` 附件，包括精选的技能和明确的版本。
- 本地 Shell 不支持 `skill_reference` 附件。相反，请在你控制的运行时中从本地文件路径提供技能文件。

请参阅 [Shell 指南](https://developers.openai.com/api/docs/guides/tools-shell) 了解本地 shell 执行的详细信息。

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

当工具启用了技能时，平台会添加每个技能的 `name`, `description`，以及 `path` 到用户提示上下文中，使模型知道技能的存在。

模型根据这些元数据决定是否调用技能。若模型调用技能，它会使用 `path` 从中读取完整的 Markdown 指令 `SKILL.md`.

技能指令属于用户提示输入（而非系统提示输入），因此与用户提供的其他指令具有相同的优先级。如需明确控制，你仍可指示模型“使用 `<skill name>` 技能。”

## 限制与验证

- `SKILL.md` 文件匹配不区分大小写。
- 每个技能包中 `skill.md`/`SKILL.md` 仅允许一个文件。
- 技能前置元数据验证遵循 [智能体技能规范](https://agentskills.io/specification#name-field).
- 最大 zip 上传大小为 `50 MB`.
- 每个技能版本的最大文件数为 `500`.
- 最大未压缩文件大小为 `25 MB`.

## 网络访问安全

务必仔细检查任何与 Responses API 搭配使用的技能。技能
  会引入安全风险，例如提示注入驱动的数据外泄。
  在使用此工具前，请仔细阅读 [风险与安全](#risks-and-safety) 章节
  。

## 版本控制与管理

### 版本指针

- `default_version` 在未提供版本时使用。
- `latest_version` 跟踪最新的上传。
- `skill_reference.version` 接受整数或 `"latest"`.

### 创建新版本

创建新的技能版本

```bash
curl -X POST 'https://api.openai.com/v1/skills/<skill_id>/versions' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./geometry.zip;type=application/zip'
```


### 设置默认版本

设置技能默认版本

```bash
curl -X POST 'https://api.openai.com/v1/skills/<skill_id>' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{"default_version": 2}'
```


### 删除规则

- 你无法删除默认版本；请先设置另一个默认版本。
- 删除最后一个保留版本将删除该技能。
- 删除一个技能会级联删除所有版本。

## 精选技能

OpenAI 维护了一组可通过 id 引用的第一方技能（例如， `openai-spreadsheets`).

引用精选技能

```json
{ "type": "skill_reference", "skill_id": "openai-spreadsheets", "version": "latest" }
```


## 内联技能

如果你不想创建托管技能，可以在环境的 `skills` 数组中直接内嵌 zip 包（base64）。

内嵌技能包

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

检查与 Responses API 配合使用的任何技能非常重要。技能会引入安全风险，例如由提示注入驱动的数据外泄。

对于与网络访问结合使用的技能，请仔细查看 [网络相关的风险与安全部分](https://developers.openai.com/api/docs/guides/tools-shell#risks-and-safety).

#### 将技能视为特权代码和指令

技能内容可能影响规划、工具使用和命令执行。在开发者验证之前，任何技能都应被视为潜在不可信输入。

### 不要向最终用户暴露开放的技能（Skills）仓库

避免设计让消费端最终用户可以从开放目录中自由浏览、选择或附加任意技能的产品。这会显著增加以下风险：

- 通过恶意 SKILL.md 指令进行的提示注入和策略绕过。
- 未经审查的自动化触发数据泄露或破坏性操作。

#### 在开发者层面集成技能

技能应由开发者检查和集成，然后仅通过受限制的产品体验向最终用户开放。实际操作中：

- 将技能映射到特定产品工作流/用例。
- 防止终端用户对任意技能选择进行控制。
- 在明确审批和策略检查之后，再允许写入或高影响操作。

#### 要求敏感操作需获得批准

对于可执行写入或高影响操作的工作流，在执行前需要明确批准。

#### 验证数据驻留和保留要求

我们支持两种形态的 Skills：本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器活跃期间保持可用，并在容器过期或被删除时被丢弃。如果你希望执行完全在你管理的基础设施上进行，请使用本地 shell 模式。了解更多关于我们的 [数据控制](https://developers.openai.com/api/docs/guides/your-data).