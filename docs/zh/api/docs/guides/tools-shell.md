# Shell

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

shell 工具让模型能够在完整的终端环境中工作。我们通过 Responses API 支持本地执行的 shell 以及托管执行的 shell。

shell 工具让模型通过以下任一方式运行命令：

- 由 OpenAI 管理的托管 shell 容器。
- [本地 shell 运行时](#local-shell-mode) 由你自己托管并执行。

Shell 可通过 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。使用。无法通过 Chat Completions API 使用。

运行任意 shell 命令可能存在风险。请务必对执行进行沙箱隔离，
  在可能的情况下应用白名单或黑名单，并记录工具活动以便
  审计。

## 托管 shell 快速入门

Hosted shell 是针对需要更丰富、确定性处理的任务的原生且精简的选项，从运行计算到处理多媒体。

在希望 `container_auto` 由 OpenAI 为请求配置和管理容器时使用。

Shell tool with container_auto

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "tools": [
      { "type": "shell", "environment": { "type": "container_auto" } }
    ],
    "input": [
      {
        "type": "message",
        "role": "user",
        "content": [
          { "type": "input_text", "text": "Execute: ls -lah /mnt/data && python --version && node --version" }
        ]
      }
    ],
    "tool_choice": "auto"
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  tools: [{ type: "shell", environment: { type: "container_auto" } }],
  input: [
    {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Execute: ls -lah /mnt/data && python --version && node --version",
        },
      ],
    },
  ],
  tool_choice: "auto",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    tools=[{"type": "shell", "environment": {"type": "container_auto"}}],
    input=[
        {
            "type": "message",
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Execute: ls -lah /mnt/data && python --version && node --version",
                }
            ],
        }
    ],
    tool_choice="auto",
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
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerAuto: &responses.ContainerAutoParam{}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Execute: ls -lah /mnt/data && python --version && node --version")},
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
import com.openai.models.responses.ContainerAuto;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Run ls -lah /mnt/data, then show the Python and Node.js versions.")
        .addTool(
            FunctionShellTool.builder().environment(ContainerAuto.builder().build()).build())
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
  input: "Run ls -lah /mnt/data, then show the Python and Node.js versions.",
  tools: [
    {
      type: :shell,
      environment: { type: :container_auto }
    }
  ]
)

puts(response.output_text)
```


## 托管运行时详情

- Runtime 当前基于 `Debian 12` ，未来可能会发生变化。
- 默认工作目录是 `/mnt/data`.
- `/mnt/data` 始终存在，是支持用户下载产物的路径。
- 托管 shell 不支持交互式 TTY 会话。
- 托管 shell 命令不会使用 `sudo`.
- 当你的工作流需要时，你可以在容器内运行服务。

当前预装语言包括：

- Python `3.11`
- Node.js `22.16`
- Java `17.0`
- PHP `8.2`
- Ruby `3.1`
- Go `1.23`

## 在请求之间复用容器

如果你需要用于迭代工作流的长时间运行环境，请创建一个容器，然后在后续的 Responses API 调用中引用它。

### 1. Create a container

创建一个可复用的容器

```bash
curl -L 'https://api.openai.com/v1/containers' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "analysis-container",
    "memory_limit": "1g",
    "expires_after": { "anchor": "last_active_at", "minutes": 20 }
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const container = await client.containers.create({
  name: "analysis-container",
  memory_limit: "1g",
  expires_after: { anchor: "last_active_at", minutes: 20 },
});

console.log(container.id);
```

```python
from openai import OpenAI

client = OpenAI()

container = client.containers.create(
    name="analysis-container",
    memory_limit="1g",
    expires_after={"anchor": "last_active_at", "minutes": 20},
)

print(container.id)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	container, err := client.Containers.New(context.Background(), openai.ContainerNewParams{
		Name:        "analysis-container",
		MemoryLimit: openai.ContainerNewParamsMemoryLimit1g,
		ExpiresAfter: openai.ContainerNewParamsExpiresAfter{
			Anchor:  "last_active_at",
			Minutes: 20,
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(container.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.containers.ContainerCreateParams;

var container =
    client
        .containers()
        .create(
            ContainerCreateParams.builder()
                .name("analysis")
                .expiresAfter(
                    ContainerCreateParams.ExpiresAfter.builder()
                        .anchor(ContainerCreateParams.ExpiresAfter.Anchor.LAST_ACTIVE_AT)
                        .minutes(20)
                        .build())
                .build());

System.out.println(container.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
container = client.containers.create(
  name: "analysis", expires_after: {
    anchor: :last_active_at,
    minutes: 20
  }
)
puts(container.id)
```


### 2. 在 Responses 中引用该容器

在容器引用中使用 shell

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
          "type": "container_reference",
          "container_id": "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe"
        }
      }
    ],
    "input": "List files in the container and show disk usage."
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
        type: "container_reference",
        container_id: "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe",
      },
    },
  ],
  input: "List files in the container and show disk usage.",
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
                "type": "container_reference",
                "container_id": container.id,
            },
        }
    ],
    input="List files in the container and show disk usage.",
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
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerReference: &responses.ContainerReferenceParam{ContainerID: "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe"}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("List files in the container and show disk usage.")},
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
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;

String containerId = "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("List files in the container and show disk usage.")
        .addTool(FunctionShellTool.builder().containerReferenceEnvironment(containerId).build())
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
  input: "List files in the container and show disk usage.",
  tools: [
    {
      type: :shell,
      environment: {
        type: :container_reference,
        container_id: "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe"
      }
    }
  ]
)

puts(response.output_text)
```


## 附加技能

技能是你可以在托管 shell 环境中挂载的可复用、带版本控制的包。它定义了可用的技能，并在 shell 执行时由模型决定是否调用它们。

请参阅 [技能指南](https://developers.openai.com/api/docs/guides/tools-skills) 了解上传和版本控制详情。

创建挂载技能后的容器

```bash
curl -L 'https://api.openai.com/v1/containers' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "skill-container",
    "skills": [
      { "type": "skill_reference", "skill_id": "skill_4db6f1a2c9e73508b41f9da06e2c7b5f" },
      { "type": "skill_reference", "skill_id": "openai-spreadsheets", "version": "latest" }
    ]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const container = await client.containers.create({
  name: "skill-container",
  skills: [
    {
      type: "skill_reference",
      skill_id: "skill_4db6f1a2c9e73508b41f9da06e2c7b5f",
    },
    {
      type: "skill_reference",
      skill_id: "openai-spreadsheets",
      version: "latest",
    },
  ],
});

console.log(container.id);
```

```python
import os
from openai import OpenAI

client = OpenAI()
skill_id = os.environ["OPENAI_SKILL_ID"]

container = client.containers.create(
    name="skill-container",
    skills=[
        {
            "type": "skill_reference",
            "skill_id": skill_id,
        },
        {
            "type": "skill_reference",
            "skill_id": "openai-spreadsheets",
            "version": "latest",
        },
    ],
)

print(container.id)
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
	container, err := client.Containers.New(context.Background(), openai.ContainerNewParams{
		Name: "skill-container",
		Skills: []openai.ContainerNewParamsSkillUnion{
			{OfSkillReference: &responses.SkillReferenceParam{SkillID: "skill_4db6f1a2c9e73508b41f9da06e2c7b5f"}},
			{OfSkillReference: &responses.SkillReferenceParam{SkillID: "openai-spreadsheets", Version: openai.String("latest")}},
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(container.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.containers.ContainerCreateParams;
import com.openai.models.responses.SkillReference;

String skillId = "skill_4db6f1a2c9e73508b41f9da06e2c7b5f";

var container =
    client
        .containers()
        .create(
            ContainerCreateParams.builder()
                .name("skill-container")
                .addSkill(SkillReference.builder().skillId(skillId).build())
                .addSkill(
                    SkillReference.builder()
                        .skillId("openai-spreadsheets")
                        .version("latest")
                        .build())
                .build());

System.out.println(container.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
container = client.containers.create(
  name: "skill-container",
  skills: [
    {
      type: :skill_reference,
      skill_id: "skill_4db6f1a2c9e73508b41f9da06e2c7b5f"
    },
    {
      type: :skill_reference,
      skill_id: "openai-spreadsheets",
      version: "latest"
    }
  ]
)

puts(container.id)
```


## 网络访问

托管容器默认没有出站网络访问权限。

启用方法：

1. 管理员必须在控制台中配置你组织的允许列表。
2. 你必须在请求中显式设置 `network_policy` 的容器环境。

使用网络白名单的 Shell 工具

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-astra",
    "tool_choice": "required",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_auto",
          "network_policy": {
            "type": "allowlist",
            "allowed_domains": ["pypi.org", "files.pythonhosted.org", "github.com"]
          }
        }
      }
    ],
    "input": [
      {
        "role": "user",
        "content": "In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md."
      }
    ]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  tool_choice: "required",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_auto",
        network_policy: {
          type: "allowlist",
          allowed_domains: ["pypi.org", "files.pythonhosted.org", "github.com"],
        },
      },
    },
  ],
  input: [
    {
      role: "user",
      content:
        "In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md.",
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    tool_choice="required",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_auto",
                "network_policy": {
                    "type": "allowlist",
                    "allowed_domains": [
                        "pypi.org",
                        "files.pythonhosted.org",
                        "github.com",
                    ],
                },
            },
        }
    ],
    input=[
        {
            "role": "user",
            "content": "In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md.",
        }
    ],
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
			NetworkPolicy: responses.ContainerAutoNetworkPolicyUnionParam{OfAllowlist: &responses.ContainerNetworkPolicyAllowlistParam{
				AllowedDomains: []string{"pypi.org", "files.pythonhosted.org", "github.com"},
			}},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		ToolChoice: responses.ResponseNewParamsToolChoiceUnion{OfToolChoiceMode: openai.Opt(responses.ToolChoiceOptionsRequired)},
		Tools:      []responses.ToolUnionParam{tool},
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md.")},
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
import com.openai.models.responses.ContainerAuto;
import com.openai.models.responses.ContainerNetworkPolicyAllowlist;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolChoiceOptions;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Fetch release pages and write /mnt/data/release_digest.md.")
        .toolChoice(ToolChoiceOptions.REQUIRED)
        .addTool(
            FunctionShellTool.builder()
                .environment(
                    ContainerAuto.builder()
                        .networkPolicy(
                            ContainerNetworkPolicyAllowlist.builder()
                                .addAllowedDomain("pypi.org")
                                .addAllowedDomain("files.pythonhosted.org")
                                .addAllowedDomain("github.com")
                                .build())
                        .build())
                .build())
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
  input: "Fetch release pages and write /mnt/data/release_digest.md.",
  tool_choice: :required,
  tools: [
    {
      type: :shell,
      environment: {
        type: :container_auto,
        network_policy: {
          type: :allowlist,
          allowed_domains: ["pypi.org", "files.pythonhosted.org", "github.com"]
        }
      }
    }
  ]
)

puts(response.output_text)
```


将域名加入白名单会引入安全风险，例如提示词
  注入导致的数据外泄。请仅将你信任的、且攻击者无
  法用来接收外泄数据的域名加入白名单。在使用此工具 [之前，请仔细阅读下方
  的风险与安全](#risks-and-safety) 章节。

## 网络策略优先级

当存在多个护栏时：

- 你的组织允许列表定义了以下完整集合： `allowed_domains`.
- 请求级别 `network_policy` 进一步限制访问。
- 如果请求中包含你的组织允许列表之外的域名， `allowed_domains` 则请求会失败。

## 数据保留与容器生命周期

Hosted Shell 和 Code Interpreter 使用的托管容器可以在容器处于活动状态时将临时应用状态写入容器文件系统（由临时块存储支持）。容器数据将在容器过期或被显式删除时被删除。

有关数据控制的更多详细信息，请参阅 [ZDR 和数据驻留](https://developers.openai.com/api/docs/guides/your-data).

### 下载制品

托管 shell 可以生成可下载的文件。使用与 code interpreter 相同的容器/文件 API 来检索写入到 `/mnt/data`.

### 其他数据控制

如果你希望在托管生命周期内让内容和文件保持临时性，可以在请求中内联文件，并在容器中挂载内联技能。

使用内联文件和内联技能

```bash
INLINE_ZIP=$(base64 -i ./csv_insights.zip)
REPORT_CSV=$(base64 -i ./report.csv)

CONTAINER_ID=$(
  curl -sL 'https://api.openai.com/v1/containers' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "name": "inline-skill-container",
      "skills": [
        {
          "type": "inline",
          "name": "csv-insights",
          "description": "Summarize CSV files and produce a markdown report.",
          "source": {
            "type": "base64",
            "media_type": "application/zip",
            "data": "'"$INLINE_ZIP"'"
          }
        }
      ]
    }' | jq -r '.id'
)

curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_reference",
          "container_id": "'"$CONTAINER_ID"'"
        }
      }
    ],
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_file",
            "filename": "report.csv",
            "file_data": "data:text/csv;base64,'"${REPORT_CSV}"'"
          },
          {
            "type": "input_text",
            "text": "Use the csv-insights skill to summarize report.csv."
          }
        ]
      }
    ]
  }'
```

```javascript
import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI();

const inlineZip = fs
  .readFileSync("fixtures/csv_insights.zip")
  .toString("base64");
const reportCsv = fs.readFileSync("fixtures/report.csv").toString("base64");

const container = await client.containers.create({
  name: "inline-skill-container",
  skills: [
    {
      type: "inline",
      name: "csv-insights",
      description: "Summarize CSV files and produce a markdown report.",
      source: {
        type: "base64",
        media_type: "application/zip",
        data: inlineZip,
      },
    },
  ],
});

const response = await client.responses.create({
  model: "gpt-6-astra",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_reference",
        container_id: container.id,
      },
    },
  ],
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          filename: "report.csv",
          file_data: `data:text/csv;base64,${reportCsv}`,
        },
        {
          type: "input_text",
          text: "Use the csv-insights skill to summarize report.csv.",
        },
      ],
    },
  ],
});

console.log(response.output_text);
```

```python
import base64
from openai import OpenAI

client = OpenAI()

with open("csv_insights.zip", "rb") as f:
    inline_zip = base64.b64encode(f.read()).decode("utf-8")

with open("report.csv", "rb") as f:
    base64_string = base64.b64encode(f.read()).decode("utf-8")

container = client.containers.create(
    name="inline-skill-container",
    skills=[
        {
            "type": "inline",
            "name": "csv-insights",
            "description": "Summarize CSV files and produce a markdown report.",
            "source": {
                "type": "base64",
                "media_type": "application/zip",
                "data": inline_zip,
            },
        }
    ],
)

response = client.responses.create(
    model="gpt-6-astra",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_reference",
                "container_id": container.id,
            },
        }
    ],
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "filename": "report.csv",
                    "file_data": f"data:text/csv;base64,{base64_string}",
                },
                {
                    "type": "input_text",
                    "text": "Use the csv-insights skill to summarize report.csv.",
                },
            ],
        }
    ],
)

print(response.output_text)
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
inline_zip = Base64.strict_encode64(File.binread("csv_insights.zip"))
base64_string = Base64.strict_encode64(File.binread("report.csv"))
container = client.containers.create(
  name: "inline-skill-container",
  skills: [
    {
      type: :inline,
      name: "csv-insights",
      description: "Summarize CSV files and produce a markdown report.",
      source: {
        type: :base64,
        media_type: "application/zip",
        data: inline_zip
      }
    }
  ]
)
response = client.responses.create(
  model: "gpt-6-astra",
  tools: [
    {
      type: :shell,
      environment: {
        type: :container_reference,
        container_id: container.id
      }
    }
  ],
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_file,
          filename: "report.csv",
          file_data: "data:text/csv;base64,#{base64_string}"
        },
        {
          type: :input_text,
          text: "Use the csv-insights skill to summarize report.csv."
        }
      ]
    }
  ]
)
puts(response.output_text)
```


对于后续请求，传递相同的 `container_id` 以及 `container_reference`。在容器处于活动状态期间，挂载的技能和容器中已有的文件仍然可用。

### 主动删除容器

你可以在工作完成后显式删除容器，而不必等待不活跃过期。

删除容器

```bash
curl -L -X DELETE 'https://api.openai.com/v1/containers/container_id' \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const deleted = await client.containers.delete("container_id");

console.log(deleted);
```

```python
import os
from openai import OpenAI

client = OpenAI()
container_id = os.environ["OPENAI_CONTAINER_ID"]

deleted = client.containers.delete(container_id)

print(deleted)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	if err := client.Containers.Delete(context.Background(), "container_id"); err != nil {
		panic(err)
	}
	fmt.Println("Container deleted")
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String containerId = "container_id";

client.containers().delete(containerId);

System.out.println("Container deleted.");
```

```ruby
require "openai"

client = OpenAI::Client.new
client.containers.delete("container_id")
puts("Deleted container_id")
```


## 域密钥

在希望 `domain_secrets` 当你列表中的某个域名 `allowed_domains` 需要私有授权标头时，例如 `Authorization: Bearer <token>`.

每个 secret 条目包含：

- 目标域名
- 友好的密钥名称
- 密钥值

在运行时：

- 模型和运行时看到的是占位符名称（例如， `$API_KEY`），而不是原始凭据。
- 鉴权转换 sidecar 仅在经批准的目标位置使用原始密钥值。
- 原始密钥值不会持久化到 API 服务器上，也不会出现在模型可见的上下文中。

这样可以让助手调用受保护的服务，同时降低信息泄露的风险。

使用 domain_secrets 的 Shell 工具

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-astra",
    "input": [
      {
        "role": "user",
        "content": "Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response."
      }
    ],
    "tool_choice": "required",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_auto",
          "network_policy": {
            "type": "allowlist",
            "allowed_domains": ["httpbin.org"],
            "domain_secrets": [
              {
                "domain": "httpbin.org",
                "name": "API_KEY",
                "value": "debug-secret-123"
              }
            ]
          }
        }
      }
    ]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content:
        "Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response.",
    },
  ],
  tool_choice: "required",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_auto",
        network_policy: {
          type: "allowlist",
          allowed_domains: ["httpbin.org"],
          domain_secrets: [
            {
              domain: "httpbin.org",
              name: "API_KEY",
              value: "debug-secret-123",
            },
          ],
        },
      },
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": "Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response.",
        }
    ],
    tool_choice="required",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_auto",
                "network_policy": {
                    "type": "allowlist",
                    "allowed_domains": ["httpbin.org"],
                    "domain_secrets": [
                        {
                            "domain": "httpbin.org",
                            "name": "API_KEY",
                            "value": "debug-secret-123",
                        }
                    ],
                },
            },
        }
    ],
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
			NetworkPolicy: responses.ContainerAutoNetworkPolicyUnionParam{OfAllowlist: &responses.ContainerNetworkPolicyAllowlistParam{
				AllowedDomains: []string{"httpbin.org"},
				DomainSecrets: []responses.ContainerNetworkPolicyDomainSecretParam{{
					Domain: "httpbin.org",
					Name:   "API_KEY",
					Value:  "debug-secret-123",
				}},
			}},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		ToolChoice: responses.ResponseNewParamsToolChoiceUnion{OfToolChoiceMode: openai.Opt(responses.ToolChoiceOptionsRequired)},
		Tools:      []responses.ToolUnionParam{tool},
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response.")},
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
import com.openai.models.responses.ContainerAuto;
import com.openai.models.responses.ContainerNetworkPolicyAllowlist;
import com.openai.models.responses.ContainerNetworkPolicyDomainSecret;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolChoiceOptions;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input(
            "Use curl to call https://httpbin.org/status/204 with an "
                + "Authorization: Bearer $API_KEY header. Print only the HTTP status code; "
                + "never print request headers or secret values.")
        .toolChoice(ToolChoiceOptions.REQUIRED)
        .addTool(
            FunctionShellTool.builder()
                .environment(
                    ContainerAuto.builder()
                        .networkPolicy(
                            ContainerNetworkPolicyAllowlist.builder()
                                .addAllowedDomain("httpbin.org")
                                .addDomainSecret(
                                    ContainerNetworkPolicyDomainSecret.builder()
                                        .domain("httpbin.org")
                                        .name("API_KEY")
                                        .value(System.getenv("OPENAI_EXAMPLE_DOMAIN_SECRET"))
                                        .build())
                                .build())
                        .build())
                .build())
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
  input: "Use curl to call https://httpbin.org/headers with an " \
    '"Authorization: Bearer $API_KEY" header.',
  tool_choice: :required,
  tools: [
    {
      type: :shell,
      environment: {
        type: :container_auto,
        network_policy: {
          type: :allowlist,
          allowed_domains: ["httpbin.org"],
          domain_secrets: [
            {
              domain: "httpbin.org",
              name: "API_KEY",
              value: "debug-secret-123"
            }
          ]
        }
      }
    }
  ]
)

puts(response.output_text)
```


## 多轮工作流

若要在同一托管环境中继续工作，请复用容器并传入 `previous_response_id`.

延续 shell 工作流

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "previous_response_id": "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_reference",
          "container_id": "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041"
        }
      }
    ],
    "input": "Read /mnt/data/top5.csv and report the top candidate."
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  previous_response_id:
    "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_reference",
        container_id: "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041",
      },
    },
  ],
  input: "Read /mnt/data/top5.csv and report the top candidate.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    previous_response_id="resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_reference",
                "container_id": "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041",
            },
        }
    ],
    input="Read /mnt/data/top5.csv and report the top candidate.",
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
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerReference: &responses.ContainerReferenceParam{ContainerID: "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041"}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String("resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47"),
		Tools:              []responses.ToolUnionParam{tool},
		Input:              responses.ResponseNewParamsInputUnion{OfString: openai.String("Read /mnt/data/top5.csv and report the top candidate.")},
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
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;

String responseId = "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47";

String containerId = "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Read /mnt/data/top5.csv and report the top candidate.")
        .previousResponseId(responseId)
        .addTool(FunctionShellTool.builder().containerReferenceEnvironment(containerId).build())
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
  input: "Read /mnt/data/top5.csv and report the top candidate.",
  previous_response_id: "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
  tools: [
    {
      type: :shell,
      environment: {
        type: :container_reference,
        container_id: "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041"
      }
    }
  ]
)

puts(response.output_text)
```


## Responses 中的 Shell 输出

托管 shell 和本地 shell 使用相同的输出项类型。shell 运行由配对的输出项表示：

- `shell_call`: 模型请求的命令。
- `shell_call_output`: 命令输出与退出结果。

Example shell_call item

```json
{
  "type": "shell_call",
  "call_id": "call_9d14ac6f2b73485e91c0f4da6e1b27c8",
  "action": {
    "commands": ["ls -l"],
    "timeout_ms": 120000,
    "max_output_length": 4096
  },
  "status": "in_progress"
}
```


## 本地 shell 模式

你也可以在本地运行时中执行 shell 命令，方法是运行 `shell_call` 动作并将结果发送回模型 `shell_call_output` 。

当你需要对执行环境、文件系统访问或现有内部工具拥有完全控制权时，请使用此模式。

本地 shell 请求

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "instructions": "The local bash shell environment is on Mac.",
    "input": "find me the largest pdf file in ~/Documents",
    "tools": [{ "type": "shell", "environment": { "type": "local" } }]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  instructions: "The local bash shell environment is on Mac.",
  input: "find me the largest pdf file in ~/Documents",
  tools: [{ type: "shell", environment: { type: "local" } }],
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    instructions="The local bash shell environment is on Mac.",
    input="find me the largest pdf file in ~/Documents",
    tools=[{"type": "shell", "environment": {"type": "local"}}],
)

print(response)
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
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfLocal: &responses.LocalEnvironmentParam{}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:        "gpt-6-astra",
		Instructions: openai.String("The local bash shell environment is on Mac."),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String("find me the largest pdf file in ~/Documents")},
		Tools:        []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Find the largest PDF in ~/Documents.")
        .instructions("The local shell environment is macOS.")
        .putAdditionalBodyProperty(
            "tools",
            JsonValue.from(
                List.of(Map.of("type", "shell", "environment", Map.of("type", "local")))))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.shellCall().stream())
    .flatMap(call -> call.action().commands().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  instructions: "The local shell environment is macOS.",
  input: "Find the largest PDF in ~/Documents.",
  tools: [
    {
      type: :shell,
      environment: { type: :local }
    }
  ]
)

puts(response.output)
```


当你收到 `shell_call` output 项时：

- 在运行时执行所请求的命令。
- 捕获输出 `stdout`, `stderr`，以及结果。
- 在下一次请求中 `shell_call_output` 返回结果。

本地 Shell 执行器示例

```javascript
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCallback);

class ShellExecutor {
  constructor(defaultTimeoutMs = 60_000) {
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  async run(cmd, timeoutMs) {
    const timeout = timeoutMs ?? this.defaultTimeoutMs;

    try {
      const { stdout, stderr } = await exec(cmd, { timeout });
      return { stdout, stderr, exitCode: 0, timedOut: false };
    } catch (error) {
      const timedOut = Boolean(error?.killed) && error?.signal === "SIGTERM";
      const exitCode = timedOut ? null : (error?.code ?? null);
      return {
        stdout: error?.stdout ?? "",
        stderr: error?.stderr ?? String(error),
        exitCode,
        timedOut,
      };
    }
  }
}
```

```python
@dataclass
class CmdResult:
    stdout: str
    stderr: str
    exit_code: int | None
    timed_out: bool


class ShellExecutor:
    def __init__(self, default_timeout: float = 60):
        self.default_timeout = default_timeout

    def run(self, cmd: str, timeout: float | None = None) -> CmdResult:
        t = timeout or self.default_timeout
        p = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        try:
            out, err = p.communicate(timeout=t)
            return CmdResult(out, err, p.returncode, False)
        except subprocess.TimeoutExpired:
            p.kill()
            out, err = p.communicate()
            return CmdResult(out, err, p.returncode, True)
```

```go
package main

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"time"
)

type shellResult struct {
	Stdout   string
	Stderr   string
	ExitCode int
	TimedOut bool
}

type shellExecutor struct {
	DefaultTimeout time.Duration
}

func (e shellExecutor) run(command string, timeout time.Duration) shellResult {
	if timeout == 0 {
		timeout = e.DefaultTimeout
	}
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	cmd := exec.CommandContext(ctx, "sh", "-c", command)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	result := shellResult{Stdout: stdout.String(), Stderr: stderr.String()}
	if ctx.Err() == context.DeadlineExceeded {
		result.TimedOut = true
		result.ExitCode = -1
		return result
	}
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			result.ExitCode = exitError.ExitCode()
			return result
		}
		if result.Stderr == "" {
			result.Stderr = err.Error()
		}
		result.ExitCode = -1
	}
	return result
}

func main() {
	executor := shellExecutor{DefaultTimeout: time.Minute}
	fmt.Println(executor.run("printf shell-executor-ready", 0))
}
```

```ruby
require "open3"

class ShellExecutor
  Result = Data.define(:stdout, :stderr, :exit_code, :timed_out)

  def initialize(default_timeout: 60)
    @default_timeout = default_timeout
  end

  def run(command, timeout: @default_timeout)
    Open3.popen3("sh", "-c", command, pgroup: true) do |stdin, stdout, stderr, wait_thread|
      stdin.close
      stdout_reader = Thread.new { stdout.read }
      stderr_reader = Thread.new { stderr.read }
      finished = wait_thread.join(timeout)
      terminate_process_group(wait_thread) unless finished

      Result.new(
        stdout: stdout_reader.value,
        stderr: stderr_reader.value,
        exit_code: wait_thread.value.exitstatus || -1,
        timed_out: finished.nil?
      )
    end
  end

  private

  def terminate_process_group(wait_thread)
    Process.kill("TERM", -wait_thread.pid)
    wait_thread.join(1)
    Process.kill("KILL", -wait_thread.pid)
  rescue Errno::ESRCH
    nil
  ensure
    wait_thread.join
  end
end

puts(ShellExecutor.new.run("printf shell-executor-ready"))
```


shell_call_output 负载示例

```json
{
  "type": "shell_call_output",
  "call_id": "call_3ef1b8c79a4d6520f9e3ab7d41c68f25",
  "max_output_length": 4096,
  "output": [
    {
      "stdout": "...",
      "stderr": "...",
      "outcome": {
        "type": "exit",
        "exit_code": 0
      }
    },
    {
      "stdout": "...",
      "stderr": "...",
      "outcome": {
        "type": "timeout"
      }
    }
  ]
}
```


有关旧版迁移的详细信息,请参阅更早的 [Local Shell 指南](https://developers.openai.com/api/docs/guides/tools-local-shell).

## 使用本地 shell 与 Agents SDK

如果你使用的是 [Agents SDK](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)，你可以向 shell 工具辅助函数传入自定义的 shell 执行器实现。

在 Agents SDK 中使用本地 shell

```javascript
import { Agent, run, withTrace, shellTool } from "@openai/agents";

class LocalShell {
  /** @returns {Promise<import("@openai/agents").ShellResult>} */
  async run(action) {
    return {
      output: [
        {
          stdout: "Shell is not available. Needs to be implemented first.",
          stderr: "",
          outcome: {
            type: "exit",
            exitCode: 1,
          },
        },
      ],
      maxOutputLength: action.maxOutputLength,
    };
  }
}

const shell = new LocalShell();

const agent = new Agent({
  name: "Shell Assistant",
  model: "gpt-6-astra",
  instructions:
    "You can execute shell commands to inspect the repository. Keep responses concise and include command output when helpful.",
  tools: [
    shellTool({
      shell,
      needsApproval: true,
      onApproval: async (_ctx, _approvalItem) => {
        return { approve: true };
      },
    }),
  ],
});

await withTrace("shell-tool-example", async () => {
  const result = await run(agent, "Show the Node.js version.");
  console.log(`\nFinal response:\n${result.finalOutput}`);
});
```

```python
from agents import (
    Agent,
    Runner,
    ShellCallOutcome,
    ShellCommandOutput,
    ShellCommandRequest,
    ShellResult,
    ShellTool,
)


class LocalShell:
    async def __call__(self, request: ShellCommandRequest) -> ShellResult:
        action = request.data.action
        return ShellResult(
            output=[
                ShellCommandOutput(
                    command="(not executed)",
                    stdout="Shell is not available. Needs to be implemented first.",
                    stderr="",
                    outcome=ShellCallOutcome(type="exit", exit_code=1),
                )
            ],
            max_output_length=action.max_output_length,
        )


shell_tool = ShellTool(
    executor=LocalShell(),
    needs_approval=True,
    on_approval=lambda _ctx, _approval_item: {"approve": True},
)

agent = Agent(
    name="Shell Assistant",
    model="gpt-6-astra",
    instructions="You can execute shell commands to inspect the repository. Keep responses concise and include command output when helpful.",
    tools=[shell_tool],
)


async def main():
    result = await Runner.run(agent, input="Show the Node.js version.")
    print(f"\nFinal response:\n{result.final_output}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
```


你可以在 SDK 代码仓库中找到可运行的示例。

[Shell 工具示例 - TypeScript



      TypeScript example for the shell tool in the Agents SDK.](https://github.com/openai/openai-agents-js/blob/main/examples/tools/shell.ts)

[Shell 工具示例 - Python



      Python example for the shell tool in the Agents SDK.](https://github.com/openai/openai-agents-python/blob/main/examples/tools/shell.py)

## 处理常见错误

- 如果命令超出你的执行超时时间，则返回超时结果并包含已捕获的部分输出。
- 如果 `max_output_length` 出现在 `shell_call`，中，则将其包含在 `shell_call_output`.
- 不要依赖交互式命令；shell 工具的执行应当是非交互式的。
- 保留非零退出输出，以便模型能够推理恢复方案。

## 风险与安全

在 Containers API 中启用网络访问是一项强大的能力，但也会带来显著的安全和数据治理风险。默认情况下，网络访问未启用。启用后，出站访问应严格限定在完成任务所需的可信域名范围内。

启用网络的容器可以与第三方服务和包注册表交互。这会带来数据泄露、由提示注入驱动的工具滥用以及超出预期边界的意外访问等风险。当策略过于宽泛、静态或未能一致执行时，这些风险会进一步增加。

#### 理解来自网络检索内容的提示注入风险

通过网络获取的任何外部内容都可能包含旨在操纵模型行为的隐藏指令。将不受信任的网络内容视为潜在的对抗性输入，对于能够修改数据或系统的操作需要格外谨慎。

#### 仅连接到可信的目标地址

仅允许你信任并积极维护的域名。对于代理到其他服务的中间方和聚合器要保持谨慎，在将其加入允许的域名列表之前，请先审查它们的数据处理和留存实践。

#### 在请求执行前和执行后内置审查

查看 Responses API 响应中提供的 shell 工具命令和执行输出。捕获每个会话中被请求的主机和实际出站目的地。定期审查日志，以验证访问模式是否符合预期、检测偏差并识别可疑行为。

#### 验证数据驻留与保留要求

[OpenAI 数据控制](https://developers.openai.com/api/docs/guides/your-data) 在 OpenAI 范围内适用。但是，传输到第三方服务的网络连接数据需遵守其数据保留策略。请确保外部端点符合你的驻留、保留和合规要求。