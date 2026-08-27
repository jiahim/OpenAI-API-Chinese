# 内容来源

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用内容来源 API 检查图像或音频文件是否包含
受支持的 OpenAI 来源信号。将文件发送到
`POST /v1/content_provenance_checks` 以在同一响应中接收完整的验证
结果。在内容审核、
事实核查、标签标注以及信任与安全工作流中使用这些信号。

要在浏览器中检查文件，请使用以下网页工具：
[openai.com/verify](https://openai.com/verify/).

有关请求参数和响应模式，请参阅
[内容来源 API 参考](https://developers.openai.com/api/reference/resources/content_provenance_checks/methods/create).

A `not_detected` 结果表示工具在
  上传的文件中未找到受支持的信号。如果内容元数据
  被剥离或显示被篡改的迹象、其水印已退化、它
  来自旧版生成模型，或它在来源
  信号可用之前创建，则内容仍可能由 OpenAI 生成。该工具目前无法检测由
  其他公司的 AI 模型生成的内容，因此 `not_detected` 结果并不能排除这种情况
  。

## 内容来源检查

内容来源检查对以下信号支持的文件进行检测：

| 信号                   | 适用范围       | 检查内容                                   |
| ------------------------ | ---------------- | ------------------------------------------------ |
| C2PA 内容凭证 | 图片           | 带有签发方和 AI 使用详情签名元数据   |
| SynthID                  | 图片和音频 | 直接嵌入受支持媒体中的水印 |

C2PA 元数据提供关于文件来源的更多上下文。编辑、转换，
或共享文件可能会移除其元数据。SynthID 水印是
图像或音频本身的一部分，可能在某些变换后仍然存在。

API 会检查受支持的 OpenAI 信号。它并非通用 AI
检测器，也不会识别所有 AI 系统生成的内容。可见的
水印和标签与检查来源信号所依据的
API 相互独立。

## 验证文件

将图片或音频文件作为 `file` 字段发送，使用OpenAI SDK。该SDK
会构建 multipart 请求，并从 `OPENAI_API_KEY`
环境变量中读取你的API密钥：

验证图片

```python
from openai import OpenAI

client = OpenAI()

with open("./example.png", "rb") as image:
    result = client.content_provenance_checks.create(
        file=("example.png", image, "image/png"),
    )

print(result)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()

	image, err := os.Open("./example.png")
	if err != nil {
		panic(err)
	}
	defer image.Close()

	result, err := client.ContentProvenanceChecks.New(
		context.Background(),
		openai.ContentProvenanceCheckNewParams{
			File: openai.File(image, "example.png", "image/png"),
		},
	)
	if err != nil {
		panic(err)
	}

	fmt.Println(result)
}
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
image = OpenAI::FilePart.new(Pathname("./example.png"), content_type: "image/png")
result = client.content_provenance_checks.create(file: image)

puts result
```

```bash
curl https://api.openai.com/v1/content_provenance_checks \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "file=@./example.png;type=image/png"
```


请使用这些OpenAI SDK版本或更高版本：Python 2.52.0、Go 3.49.0 和 Ruby
0.75.0。

要验证 Opus 音频，请使用同一端点，并将上传文件的媒体
类型设置为 `audio/ogg`:

```bash
curl https://api.openai.com/v1/content_provenance_checks \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "file=@./example.opus;type=audio/ogg"
```

响应包含完成的结果。例如，图片返回：

```json
{
  "object": "content_provenance_check",
  "created_at": 1778000000,
  "results": [
    {
      "type": "c2pa",
      "outcome": "detected",
      "validation_state": "trusted",
      "issuer": "OpenAI OpCo, LLC",
      "model": "gpt-image",
      "generated_at": "2026-07-27T18:34:12Z"
    },
    {
      "type": "synthid",
      "outcome": "not_detected",
      "model": null,
      "generated_at": null
    }
  ]
}
```

该 `object` 字段标识响应，而 `created_at` 是检查的
创建时间，以 Unix 时间戳（秒）表示。中的条目 `results` 取决于
上传的文件：图片包含 C2PA 和 SynthID 结果，音频包含
SynthID 结果。API 会省略不适用的检查，而不是返回
`not_detected`.

API 在返回前完成验证。你无需创建
后台任务、轮询其他端点或将文件上传到 Files API。

如果请求失败，请检查 HTTP 状态和 `error.code` 可用时。格式错误、不支持或
被阻止的文件返回 `400`；没有
访问权限的组织会收到 `404`；超过速率限制的请求返回 `429`。只重试
瞬时故障，如速率限制或服务器错误。关于一般性指导，
请参阅 [API 错误码](https://developers.openai.com/api/docs/guides/error-codes).

## 了解验证结果

请分别阅读每一条适用的条目 `results` 。图片结果包含
C2PA 和 SynthID 条目，而音频结果包含 SynthID 条目。响应
不包含顶层 `outcome`.

### C2PA 结果

C2PA 结果描述了图像内容凭证的状态：

```json
{
  "type": "c2pa",
  "outcome": "detected",
  "validation_state": "trusted",
  "issuer": "OpenAI OpCo, LLC",
  "model": "gpt-image",
  "generated_at": "2026-07-27T18:34:12Z"
}
```

字段使用方式如下：

- `outcome` 指示是否使用了 OpenAI 发布的 AI 生成凭据
  `detected` 或 `not_detected`.
- `validation_state` 指示清单是否 `trusted`, `valid`,
  `invalid`，或 `not_present`.
- `issuer` 标识清单签发者（当该信息可用时）。
- `model` 标识生成模型（当该信息可用时）。
- `generated_at` 标识内容的生成时间（当该信息
  可用时）。

结果只有在 `detected` 仅当 `trusted` 或 `valid` 清单识别
OpenAI为其签发者并包含 AI 生成操作时才成立。第三方
清单、没有 AI 生成操作的清单、 `invalid` 清单或
一 `not_present` 清单会产生 `not_detected`。这些 `issuer` 和
`validation_state` 仍然可以描述清单，即使结果是
`not_detected`.

不要将 `invalid` 清单视为可靠的来源证据。一个
`not_present` 结果意味着该图像没有可用的 C2PA 清单。

### SynthID 结果

SynthID 结果描述验证器是否在图像或音频文件中检测到受支持的水印
：

```json
{
  "type": "synthid",
  "outcome": "detected",
  "model": null,
  "generated_at": null
}
```

的结果表示 `detected` 文件包含可识别的水印。
的结果表示 `not_detected` 验证器未检测到该水印。这
并不排除 AI 生成或 AI 修改的内容。 `model` 和
`generated_at` 在可用时提供生成模型和生成时间；
任一字段都可能为 `null`.

## 支持的格式与可用性

API 支持以下文件格式：

- **图像：** PNG、JPEG 和 WebP。
- **音频：** MP3、Opus、AAC、FLAC、WAV 和 PCM。

将每个上传文件限制为 50 MiB。音频在解码后必须为 60 秒或更短
。

设置上传 `file` 部分的媒体类型。例如，使用 `image/png` 用于 PNG
图片或 `audio/ogg` 用于 Opus 音频。不要添加单独的 `type` 字段或
手动设置 `multipart/form-data` 请求头。该 `curl` `-F` 选项
设置请求内容类型和多部分边界。每个请求发送一个文件。

内容来源检查不符合
[零数据保留](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention).

严格的速率限制有助于保护 API 免受滥用。组织可以
[申请更高的限制](https://openai.com/form/content-provenance-api/)，并且
OpenAI 会逐案审核每份申请。

如果 API 返回 `429 rate_limit_exceeded`，请降低请求速率并
遵循 `Retry-After` 中的头部（若存在）。参见
[限速指南](https://developers.openai.com/api/docs/guides/rate-limits) 获取常规重试建议。

## 负责任地使用验证结果

在更广泛的审核流程中，将验证结果用作证据：

- 将 `detected` 视为特定受支持信号的证据，而非完整的
  文件历史。
- 将 `not_detected` 视为未检测到证据，而非证明该
  内容是人工创作或未使用 OpenAI 生成。
- 将图像归因于特定提供商前，请检查 C2PA 签发者。
- 尽可能核实原始文件。压缩、裁剪、截图、
  元数据移除和格式转换可能消除或削弱信号。
- 考虑来源产品、模型、文件格式和创建日期。
  并非所有 OpenAI 生成的内容都包含受支持的信号。
- 在高风险工作流中，将自动化决策与人工审核相结合。
- 不要使用重复查询来逆向工程、移除或规避水印。
- 不要根据验证结果推断提示词、账户或个人创作者
  。

使用内容来源API须遵守
[OpenAI 服务协议](https://openai.com/policies/services-agreement/).

有关平台级监控和保留设置的信息，请参阅
[数据控制](https://developers.openai.com/api/docs/guides/your-data).