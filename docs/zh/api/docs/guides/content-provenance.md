# Content provenance

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

使用 Content Provenance API 来检查图像或音频文件是否包含
受支持的 OpenAI 出处信号。将文件发送至
`POST /v1/content_provenance_checks` 即可在同一次响应中收到完整的验证结果
你可以将这些信号用于内容审核、
事实核查、标注以及信任与安全工作流中。

要在浏览器中检查文件，请使用以下网页工具：
[openai.com/verify](https://openai.com/verify/).

有关请求参数和响应架构，请参阅
[Content provenance API reference](https://developers.openai.com/api/reference/resources/content_provenance_checks/methods/create).

一个 `not_detected` 结果表示该工具未在上传的文件中找到受支持的信号。
  如果其元数据被剥离或显示被篡改的痕迹、水印已降级、OpenAI 仍可能生成了该内容，例如它来自旧版生成模型，或在出处信号可用之前就已创建。
  其元数据被剥离或显示被篡改的痕迹、水印已降级，它
  来自旧版生成模型，或在出处信号可用之前就已创建。
  该工具目前无法检测由其他公司 AI 模型生成的内容，因此
  结果也无法排除这种可能。 `not_detected` 结果并不能排除
  这种情况。

## 内容来源检查

内容溯源检查针对以下信号支持文件：

| Signal                   | 适用范围       | 检测内容                                   |
| ------------------------ | ---------------- | ------------------------------------------------ |
| C2PA Content Credentials | 图像           | 包含颁发者和 AI 使用信息的签名元数据   |
| SynthID                  | 图像和音频 | 直接嵌入受支持媒体中的水印 |

C2PA 元数据提供了关于文件来源的更多上下文。编辑、转换，
或共享文件可能会移除其元数据。SynthID 水印是
图像或音频本身的一部分，可能会在某些转换后保留下来。

该 API 会检查支持的 OpenAI 信号。它并非通用的 AI
检测器，无法识别每个 AI 系统所生成的内容。可见
水印和标签与所检查的溯源信号是分开的
API。

## 校验文件

将图片或音频文件作为 `file` 字段通过 OpenAI SDK 发送。SDK
会构建 multipart 请求，并从环境变量中读取你的 API 密钥： `OPENAI_API_KEY`
环境变量：

验证图片

```javascript
import { createReadStream } from "node:fs";
import OpenAI, { toStreamingFile } from "openai";

const client = new OpenAI();

const result = await client.contentProvenanceChecks.create({
  file: toStreamingFile(createReadStream("myimage.png"), "myimage.png", {
    type: "image/png",
  }),
});

console.log(result);
```

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


请使用以下 OpenAI SDK 版本或更高版本：Python 2.52.0、Go 3.49.0 和 Ruby
0.75.0。

若要验证 Opus 音频，请使用相同的端点，并将上传文件的媒体
类型设置为 `audio/ogg`:

```bash
curl https://api.openai.com/v1/content_provenance_checks \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "file=@./example.opus;type=audio/ogg"
```

响应包含完整的结果。例如，图片返回：

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

该 `object` 字段用于标识响应，而 `created_at` 是检查的
创建时间，以 Unix 时间戳（秒）表示。 `results` 中的条目取决于
上传的文件：图片包含 C2PA 和 SynthID 结果，音频包含
SynthID 结果。API 会省略不适用的检查项，而不是返回
`not_detected`.

API 会在返回之前完成验证。你无需创建
后台任务、轮询其他端点，或将文件上传到 Files API。

如果请求失败，请检查 HTTP 状态码和 `error.code` 当可用时。A
格式错误、不支持或被阻止的文件返回 `400`；没有
访问权限的组织收到 `404`；超出速率限制的请求返回 `429`。仅重试
瞬时故障，例如速率限制或服务端错误。有关一般指南，
请参阅 [API 错误代码](https://developers.openai.com/api/docs/guides/error-codes).

## 了解验证结果

独立地阅读每个适用的条目 `results` 图片结果包含
C2PA 和 SynthID 条目，而音频结果包含一个 SynthID 条目。
响应中不包含顶级 `outcome`.

### C2PA results

C2PA 结果描述了图像的内容凭据状态：

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

各字段的使用方式如下：

- `outcome` 指示是否使用了 OpenAI 颁发的 AI 生成凭据
  `detected` 或 `not_detected`.
- `validation_state` 指示清单是否处于 `trusted`, `valid`,
  `invalid`，还是 `not_present`.
- `issuer` 在信息可用时识别清单的颁发者。
- `model` 在信息可用时识别生成内容的模型。
- `generated_at` 在信息可用时识别内容生成时间
  。

结果是 `detected` 仅当某个 `trusted` 或 `valid` 清单将
OpenAI 标识为签发者并包含一项 AI 生成操作时，才会得到该结果。第三方
清单、不含 AI 生成操作的清单、 `invalid` 清单，或
一个 `not_present` 清单会得到 `not_detected`。 `issuer` 和
`validation_state` 仍然可以描述某个清单，即使结果为
`not_detected`.

请勿将 `invalid` 清单视为可靠的可溯源证据。
`not_present` 结果表示该图像没有可用的 C2PA 清单。

### SynthID 结果

SynthID 结果描述验证器是否在图像或音频文件中检测到了受支持的水印
：

```json
{
  "type": "synthid",
  "outcome": "detected",
  "model": null,
  "generated_at": null
}
```

结果为 `detected` 意味着该文件包含已被识别的水印。结果为
结果为 `not_detected` 意味着验证器未检测到该水印。这
并不排除内容由 AI 生成或经 AI 修改的可能。 `model` 和
`generated_at` 在可用时提供生成模型和生成时间；
任一字段可以 `null`.

## 支持的格式与可用性

API 支持以下文件格式：

- **Images:** PNG、JPEG 和 WebP。
- **Audio:** MP3、Opus、AAC、FLAC、WAV 和 PCM。

将每个上传的文件限制为 50 MiB 以内。音频解码后长度必须为 60 秒或更短
。

设置上传 `file` 部分的媒体类型。例如，使用 `image/png` 表示 PNG
图片，或使用 `audio/ogg` 表示 Opus 音频。无需添加额外的 `type` 字段，也无需手动
设置 `multipart/form-data` 请求标头。 `curl` `-F` 选项
会设置请求的内容类型和 multipart boundary。每个请求发送一个文件。

内容溯源检查不适用于
[零数据保留](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention).

严格的速率限制有助于保护 API 免遭滥用。组织可以
[申请更高的限额](https://openai.com/form/content-provenance-api/)，且
OpenAI 会逐案审核每份申请。

如果 API 返回 `429 rate_limit_exceeded`，请降低你的请求速率并
遵守 `Retry-After` header（如果存在）。请参阅
[速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 以获取通用重试指导。

## 负责任地使用验证结果

在更广泛的评审流程中将验证结果作为证据：

- 将 `detected` 视为特定受支持信号的证据，而非文件的完整
  历史记录。
- 将 `not_detected` 视为未检测到证据，而非证明该
  内容是人工创建的，或未使用OpenAI生成。
- 在将图片归属于特定提供商之前，请检查 C2PA 颁发者。
- 尽可能核实原始文件。压缩、裁剪、截图、
  元数据移除以及格式转换都可能削弱或消除信号。
- 考虑来源产品、模型、文件格式和创建日期。
  并非所有OpenAI生成的内容都包含受支持的信号。
- 在高风险工作流中，将自动决策与人工审核结合使用。
- 不要通过重复查询来逆向工程、移除或规避水印。
- 不要从验证
  结果中推断提示词、账户或个人创作者。

使用内容溯源 API 须遵守
[OpenAI 服务协议](https://openai.com/policies/services-agreement/).

有关全平台监控和保留设置的信息，请参阅
[数据控制](https://developers.openai.com/api/docs/guides/your-data).