# 代码解释器

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后添加 `.md` 来获取。

代码解释器工具允许模型在沙盒环境中编写并运行 Python 代码，以解决数据分析、编码和数学等领域中的复杂问题。可用于：

- 处理包含多样数据和格式的文件
- 生成包含数据和图表图像的文件
- 迭代编写和运行代码以解决问题——例如，一个编写代码但无法运行的模型可以不断重写并运行该代码，直到成功为止
- 增强我们最新推理模型（如 [o3](https://developers.openai.com/api/docs/models/o3) 和 [o4-mini](https://developers.openai.com/api/docs/models/o4-mini)）的视觉智能。该模型可以使用此工具进行裁剪、缩放、旋转以及处理和转换图像。

以下是通过 [Responses API](https://developers.openai.com/api/reference/resources/responses) 调用 Code Interpreter 工具的示例：

使用 Responses API 调用 Code Interpreter

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "tools": [{
      "type": "code_interpreter",
      "container": { "type": "auto", "memory_limit": "4g" }
    }],
    "instructions": "You are a personal math tutor. When asked a math question, write and run code using the python tool to answer the question.",
    "input": "I need to solve the equation 3x + 11 = 14. Can you help me?"
  }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const instructions = `
You are a personal math tutor. When asked a math question,
write and run code using the python tool to answer the question.
`;

const resp = await client.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "code_interpreter",
      container: { type: "auto", memory_limit: "4g" },
    },
  ],
  instructions,
  input: "I need to solve the equation 3x + 11 = 14. Can you help me?",
});

console.log(JSON.stringify(resp.output, null, 2));
```

```python
from openai import OpenAI

client = OpenAI()

instructions = """
You are a personal math tutor. When asked a math question,
write and run code using the python tool to answer the question.
"""

resp = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "code_interpreter",
            "container": {"type": "auto", "memory_limit": "4g"},
        }
    ],
    instructions=instructions,
    input="I need to solve the equation 3x + 11 = 14. Can you help me?",
)

print(resp.output)
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
	tool := responses.ToolParamOfCodeInterpreter(responses.ToolCodeInterpreterContainerCodeInterpreterContainerAutoParam{MemoryLimit: "4g"})
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:        "gpt-5.6",
		Tools:        []responses.ToolUnionParam{tool},
		Instructions: openai.String("You are a personal math tutor. When asked a math question, write and run code using the python tool to answer the question."),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String("I need to solve the equation 3x + 11 = 14. Can you help me?")},
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
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.Tool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("I need to solve the equation 3x + 11 = 14. Can you help me?")
        .instructions(
            "You are a personal math tutor. Write and run Python code to answer each math question.")
        .addCodeInterpreterTool(
            Tool.CodeInterpreter.Container.CodeInterpreterToolAuto.builder()
                .memoryLimit(
                    Tool.CodeInterpreter.Container.CodeInterpreterToolAuto.MemoryLimit._4G)
                .build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  instructions: "You are a personal math tutor. Write and run Python code to answer each math question.",
  input: "I need to solve the equation 3x + 11 = 14. Can you help me?",
  tools: [
    {
      type: :code_interpreter,
      container: {type: :auto, memory_limit: "4g"}
    }
  ]
)

puts(response.output)
```


虽然我们将此工具称为 Code Interpreter，但模型将其识别为 "python
  tool"。模型通常能理解提及代码解释器
  工具的提示，但最明确的调用方式是在提示中要求 "the
  python tool"。

## 容器

代码解释器工具需要一个 [容器对象](https://developers.openai.com/api/reference/resources/containers)。容器是一个完全沙箱化的虚拟机，模型可以在其中运行 Python 代码。此容器可以包含你上传的文件，或它生成的文件。

创建容器有两种方式：

1. 自动模式：如上面的示例所示，你可以通过将 `"container": { "type": "auto", "memory_limit": "4g", "file_ids": ["file-1", "file-2"] }` 属性传入工具配置来创建新的 Response 对象。这会自动创建一个新的容器，或复用一个由之前 `code_interpreter_call` 项所使用的活跃容器。省略 `memory_limit` 将保持容器的默认 1 GB 层级。请查看 `code_interpreter_call` 此项位于此 API 请求的输出中，以找到 `container_id` 生成或使用的。
2. 显式模式：在这里，你明确地 [创建一个容器](https://developers.openai.com/api/reference/resources/containers/methods/create) 使用 `v1/containers` 端点，包括你需要的 `memory_limit` （例如 `"memory_limit": "4g"`），并将其 `id` 作为 `container` 值赋给 Response 对象中的工具配置。例如：

使用显式容器创建

```bash
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "My Container",
        "memory_limit": "4g"
      }'

# Use the returned container id in the next call:
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "tools": [{
      "type": "code_interpreter",
      "container": "cntr_abc123"
    }],
    "tool_choice": "required",
    "input": "use the python tool to calculate what is 4 * 3.82. and then find its square root and then find the square root of that result"
  }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const container = await client.containers.create({
  name: "test-container",
  memory_limit: "4g",
});

const resp = await client.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "code_interpreter",
      container: container.id,
    },
  ],
  tool_choice: "required",
  input:
    "use the python tool to calculate what is 4 * 3.82. and then find its square root and then find the square root of that result",
});

console.log(resp.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

container = client.containers.create(name="test-container", memory_limit="4g")

response = client.responses.create(
    model="gpt-5.6",
    tools=[{"type": "code_interpreter", "container": container.id}],
    tool_choice="required",
    input="use the python tool to calculate what is 4 * 3.82. and then find its square root and then find the square root of that result",
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
	container, err := client.Containers.New(context.Background(), openai.ContainerNewParams{
		Name:        "test-container",
		MemoryLimit: openai.ContainerNewParamsMemoryLimit4g,
	})
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := client.Containers.Delete(context.Background(), container.ID); err != nil {
			panic(err)
		}
	}()

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-5.6",
		Tools:      []responses.ToolUnionParam{responses.ToolParamOfCodeInterpreter(container.ID)},
		ToolChoice: responses.ResponseNewParamsToolChoiceUnion{OfToolChoiceMode: openai.Opt(responses.ToolChoiceOptionsRequired)},
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("use the python tool to calculate what is 4 * 3.82. and then find its square root and then find the square root of that result")},
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
import com.openai.models.containers.ContainerCreateParams;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolChoiceOptions;

var container =
    client
        .containers()
        .create(
            ContainerCreateParams.builder()
                .name("analysis")
                .memoryLimit(ContainerCreateParams.MemoryLimit._4G)
                .build());

var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-5.6")
                .input("Calculate 4 * 3.82, then take the square root twice.")
                .toolChoice(ToolChoiceOptions.REQUIRED)
                .addCodeInterpreterTool(container.id())
                .build());

response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
container = client.containers.create(name: "analysis", memory_limit: "4g")
response = client.responses.create(
  model: "gpt-5.6",
  tools: [{type: :code_interpreter, container: container.id}],
  tool_choice: :required,
  input: "Calculate 4 * 3.82, then take the square root twice."
)
puts(response.output_text)
```


你可以选择 `1g` （默认）， `4g`, `16g`或 `64g`。更高的层级为会话提供更多 RAM，并按 [内置工具费率](https://developers.openai.com/api/docs/pricing#built-in-tools) 计费，适用于 Code Interpreter。所选的 `memory_limit` 在该容器的整个生命周期内生效，无论是自动创建还是通过 containers API 创建的。

请注意，使用自动模式创建的容器也可以通过 [`/v1/containers`](https://developers.openai.com/api/reference/resources/containers) 端点访问。

### 过期时间

我们强烈建议你将容器视为临时资源，并将与此工具使用相关的所有数据存储在你自己的系统中。过期详情：

- 如果容器在 20 分钟内未被使用，它就会过期。发生这种情况时，在 `v1/responses` 中使用容器将会失败。你仍然可以在容器过期时查看容器元数据的快照，但与容器关联的所有数据都将从我们的系统中丢弃且无法恢复。你应该在容器处于活动状态时下载你可能需要的任何文件。
- 你无法将容器从过期状态转换为活动状态。相反，请创建一个新容器并重新上传文件。请注意，旧容器内存中的任何状态（如 Python 对象）都将丢失。
- 任何容器操作，如检索容器，或从容器中添加或删除文件，都会自动刷新容器的 `last_active_at` 时间。

## 处理文件

运行代码解释器时，模型可以自己创建文件。例如，如果你要求它绘制图表或创建CSV，它会直接在容器中生成这些图片。当它这样做时，会在下一条消息的 `annotations` 中引用这些文件。以下是一个示例：

```json
{
  "id": "msg_682d514e268c8191a89c38ea318446200f2610a7ec781a4f",
  "content": [
    {
      "annotations": [
        {
          "file_id": "cfile_682d514b2e00819184b9b07e13557f82",
          "index": null,
          "type": "container_file_citation",
          "container_id": "cntr_682d513bb0c48191b10bd4f8b0b3312200e64562acc2e0af",
          "end_index": 0,
          "filename": "cfile_682d514b2e00819184b9b07e13557f82.png",
          "start_index": 0
        }
      ],
      "text": "Here is the histogram of the RGB channels for the uploaded image. Each curve represents the distribution of pixel intensities for the red, green, and blue channels. Peaks toward the high end of the intensity scale (right-hand side) suggest a lot of brightness and strong warm tones, matching the orange and light background in the image. If you want a different style of histogram (e.g., overall intensity, or quantized color groups), let me know!",
      "type": "output_text",
      "logprobs": []
    }
  ],
  "role": "assistant",
  "status": "completed",
  "type": "message"
}
```

你可以通过调用 [获取容器文件内容](https://developers.openai.com/api/reference/resources/containers/subresources/files/subresources/content/methods/retrieve) 方法来下载这些生成的文件。

任何 [模型输入中的文件](https://developers.openai.com/api/docs/guides/file-inputs) 都会自动上传到容器。你无需显式上传到容器。

### 上传和下载文件

使用以下方式将新文件添加到你的容器中： [创建容器文件](https://developers.openai.com/api/reference/resources/containers/subresources/files/methods/create)。此端点接受多部分上传或包含 `file_id`.
使用以下方式列出现有容器文件： [列出容器文件](https://developers.openai.com/api/reference/resources/containers/subresources/files/methods/list) 并使用以下方式下载字节： [检索容器文件内容](https://developers.openai.com/api/reference/resources/containers/subresources/files/subresources/content/methods/retrieve).

### 处理引用

模型生成的文件和图像以注解的形式返回在智能体的消息上。 `container_file_citation` 注解指向容器中创建的文件，它们包括 `container_id`, `file_id`和 `filename`。你可以解析这些注解以显示下载链接或以其他方式处理这些文件。

### 支持的文件

| 文件格式 | MIME 类型                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| `.c`        | `text/x-c`                                                                  |
| `.cs`       | `text/x-csharp`                                                             |
| `.cpp`      | `text/x-c++`                                                                |
| `.csv`      | `text/csv`                                                                  |
| `.doc`      | `application/msword`                                                        |
| `.docx`     | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`   |
| `.html`     | `text/html`                                                                 |
| `.java`     | `text/x-java`                                                               |
| `.json`     | `application/json`                                                          |
| `.md`       | `text/markdown`                                                             |
| `.pdf`      | `application/pdf`                                                           |
| `.php`      | `text/x-php`                                                                |
| `.pptx`     | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.py`       | `text/x-python`                                                             |
| `.py`       | `text/x-script.python`                                                      |
| `.rb`       | `text/x-ruby`                                                               |
| `.tex`      | `text/x-tex`                                                                |
| `.txt`      | `text/plain`                                                                |
| `.css`      | `text/css`                                                                  |
| `.js`       | `text/javascript`                                                           |
| `.sh`       | `application/x-sh`                                                          |
| `.ts`       | `application/typescript`                                                    |
| `.csv`      | `application/csv`                                                           |
| `.jpeg`     | `image/jpeg`                                                                |
| `.jpg`      | `image/jpeg`                                                                |
| `.gif`      | `image/gif`                                                                 |
| `.pkl`      | `application/octet-stream`                                                  |
| `.png`      | `image/png`                                                                 |
| `.tar`      | `application/x-tar`                                                         |
| `.xlsx`     | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`         |
| `.xml`      | `application/xml or "text/xml"`                                             |
| `.zip`      | `application/zip`                                                           |

## 使用说明

<table>
<tbody>

<tr>
  <th>API Availability</th>
  <th>Rate limits</th>
  <th>Notes</th>
</tr>

<tr>
  <td>
    

      [Responses](https://developers.openai.com/api/reference/resources/responses)
    

    

      [Chat Completions](https://developers.openai.com/api/reference/resources/chat)
    

    

      [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants)
    

  </td>
  <td style={{ maxWidth: "150px" }}>100 RPM per org</td>
  <td style={{ maxWidth: "150px" }}>
    [Pricing](https://developers.openai.com/api/docs/pricing#built-in-tools) 

    [ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data)
  </td>
</tr>

</tbody>
</table>