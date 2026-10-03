# 内容溯源

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

使用内容溯源 API 来检查图像或音频文件是否包含
支持的 OpenAI 溯源信号。将文件发送至
`POST /v1/content_provenance_checks` 即可在同一响应中收到完整的验证结果。
你可以在内容审核、
事实核查、标注以及信任与安全工作流中使用这些信号。

若要在浏览器中检查文件，请使用位于
[openai.com/verify](https://openai.com/verify/).

有关请求参数和响应架构，请参阅
[内容溯源 API 参考](https://developers.openai.com/api/reference/resources/content_provenance_checks/methods/create).

一个 `not_detected` 结果表示工具未在上传的文件中找到支持的信号。即使出现这种情况，该内容仍可能由 OpenAI 生成，原因是其元数据
  已被去除或存在篡改痕迹，水印已退化，
  它来自旧版生成模型，或是在提供溯源信号之前创建的。该工具目前无法检测由
  另一家公司的 AI 模型生成的内容，因此出现
  结果并不能排除这种可能性，
  either. `not_detected` 结果也无法排除这种可能
  性。

## 内容溯源检查是什么

内容溯源检查支持针对以下信号检测文件：

| 信号                   | 适用范围       | 检查内容                                   |
| ------------------------ | ---------------- | ------------------------------------------------ |
| C2PA Content Credentials | 图像           | 包含颁发者和 AI 使用详情的签名元数据   |
| SynthID                  | 图像和音频 | 直接嵌入到受支持媒体中的水印 |

C2PA 元数据提供了有关文件来源的更多上下文。编辑、转换或共享文件可能会移除其元数据。SynthID 水印是图像或音频本身的一部分，
or sharing a file can remove its metadata. A SynthID watermark is part of the
image or audio itself and may survive some transformations.

该 API 会检查受支持的 OpenAI 信号。它不是通用的人工智能检测器，也
无法识别所有 AI 系统生成的内容。可见的水印和标签与该 API
检查的来源信号是分开的。
watermarks and labels are separate from the provenance signals checked by the。

## 校验文件

通过 `file` 字段，将图片或音频文件作为输入发送给 OpenAI SDK。SDK
会构建 multipart 请求，并从环境变量中读取你的 API key： `OPENAI_API_KEY`
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

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.contentprovenancechecks.ContentProvenanceCheckCreateParams;
import java.nio.file.Path;

var result =
    client
        .contentProvenanceChecks()
        .create(
            ContentProvenanceCheckCreateParams.builder().file(Path.of("myimage.png")).build());
System.out.println(result);
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

响应包含已完成的结果。例如，图片会返回：

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

该 `object` 字段用于标识响应， `created_at` 是此次校验的
创建时间，以 Unix 时间戳（秒）表示。 `results` 中的条目取决于
上传的文件：图片包含 C2PA 与 SynthID 结果，音频包含
SynthID 结果。API 会省略不适用于该文件的检查项，而不是返回
`not_detected`.

API 在返回前会完成校验。你无需创建
后台任务、轮询其他端点，或将文件上传至 Files API。

如果请求失败，请检查 HTTP 状态码以及 `error.code` when available. A
malformed、不受支持或被阻止的文件返回 `400`；没有访问权限的组织
access receives `404`；超过速率限制的请求返回 `429`。请仅重试
临时性失败，例如速率限制或服务端错误。有关通用指南，请，
参见 [API 错误代码](https://developers.openai.com/api/docs/guides/error-codes).

## 理解验证结果

独立地读取每个适用的条目 `results` 中的相应条目。图像结果包含
C2PA 和 SynthID 条目，而音频结果包含 SynthID 条目。该
响应不包含顶层 `outcome`.

### C2PA results

C2PA 结果用于描述图像内容凭证 (Content Credentials) 的状态：

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

字段用法如下：

- `outcome` 表示 OpenAI 颁发的 AI 生成凭证是否
  `detected` 或 `not_detected`.
- `validation_state` 表示清单是否 `trusted`, `valid`,
  `invalid`，或 `not_present`.
- `issuer` 在可用时标识清单的颁发者。
- `model` 在可用时标识生成该内容的模型。
- `generated_at` 在内容生成时间信息
  可用时标识。

结果是 `detected` 仅当 `trusted` 清单 `valid` 标识
OpenAI 为其签发方并包含 AI 生成操作时才会出现结果。第三方
清单、没有 AI 生成操作的清单、 `invalid` 清单，或
一个 `not_present` 清单产生 `not_detected`。 `issuer` 和
`validation_state` 仍然可以描述清单，即使结果是
`not_detected`.

不要将 `invalid` 清单视为可靠的来源证据。
`not_present` 结果意味着该图像没有可用的 C2PA 清单。

### SynthID 结果

SynthID 结果用于描述验证器是否在图像或音频文件中检测到受支持的水印
：

```json
{
  "type": "synthid",
  "outcome": "detected",
  "model": null,
  "generated_at": null
}
```

结果为 `detected` 表示文件包含已识别的水印。结果为
结果为 `not_detected` 表示验证器未检测到该水印。它
并不能排除内容由 AI 生成或被 AI 修改的可能性。 `model` 和
`generated_at` 在可用时提供生成模型和生成时间；
任一字段都可以 `null`.

## 支持的格式与可用性

API 支持以下文件格式：

- **图像：** PNG、JPEG 和 WebP。
- **音频：** MP3、Opus、AAC、FLAC、WAV 和 PCM。

每个上传文件限制为 50 MiB。解码后音频时长不得超过 60 秒
。

设置上传 `file` 部分的媒体类型。例如，对 PNG 图像使用 `image/png` ，对 Opus
音频使用 `audio/ogg` 。不要额外添加 `type` 字段或
手动设置 `multipart/form-data` 请求头。 `curl` `-F` option
设置请求内容类型和 multipart 边界。每个请求发送一个文件。

内容来源检查不适用于
[零数据保留](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention).

严格的速率限制有助于保护 API 免受滥用。组织可以
[申请更高的限额](https://openai.com/form/content-provenance-api/)，并且
OpenAI 会逐案审查每个申请。

如果 API 返回 `429 rate_limit_exceeded`，请降低你的请求速率并
在请求中遵守 `Retry-After` header（如有）。有关通用重试指南，请参阅
[速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 。

## 请负责任地使用验证结果

在更广泛的审查流程中将验证结果作为证据：

- 将 `detected` 视为存在特定受支持信号的证据，而非文件的完整
  历史记录。
- 将 `not_detected` 视为未检测到证据，而非证明内容由人工创建
  或并非由 OpenAI 生成。
- 在将图像归属于特定提供方之前，请先检查 C2PA 颁发者。
- 在条件允许时核实原始文件。压缩、裁剪、截屏、
  元数据删除以及格式转换都可能擦除或削弱信号。
- 请综合考虑原始产品、模型、文件格式和创建日期。
  并非所有由 OpenAI 生成的内容都包含受支持的信号。
- 在高风险工作流中，将自动化决策与人工复核相结合。
- 不要通过重复查询来逆向工程、移除或规避水印。
- 不要从验证
  结果中推断提示词、账户或个人创建者。

使用 Content Provenance API 须遵守
[OpenAI 服务协议](https://openai.com/policies/services-agreement/).

如需了解全平台范围的监控与留存设置，请参阅
[数据控制](https://developers.openai.com/api/docs/guides/your-data).