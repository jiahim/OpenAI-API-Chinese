# 使用 Sora 生成视频

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 概述

Sora 是 OpenAI 在生成式媒体领域的最新前沿——一款最先进的视频模型，能够根据自然语言或图像生成细节丰富、动感十足且带音频的片段。基于多年来对多模态扩散的研究，并在多样化的视觉数据上训练，Sora 将 3D 空间、运动和场景连续性的深刻理解带入文本到视频的生成。

该 [Videos API](https://developers.openai.com/api/reference/resources/videos) 首次向开发者开放这些能力，支持视频的程序化创建、扩展、编辑和管理。

你可以使用它来：

- 根据提示创建新视频。
- 使用图像参考引导生成过程。
- 在多次生成中复用角色素材，以实现更强的视觉一致性。
- 通过视频扩展延续已完成的片段。
- 对现有视频进行有针对性的修改。
- 下载完成的视频和支持素材。
- 通过以下方式提交大型离线渲染队列： [批处理 API](https://developers.openai.com/api/docs/guides/batch).

## 模型

第二代 Sora 模型提供两个版本，各自针对不同的使用场景而设计。

### Sora 2

`sora-2` 旨在提供 **速度和灵活性**。它非常适合探索阶段，当你正在尝试语气、结构或视觉风格，并且需要快速反馈而非完美保真时。

它能快速生成高质量结果，非常适合快速迭代、概念构思和粗剪。 `sora-2` 对于社交媒体内容、原型以及周转时间比超高保真更重要的场景，它通常绰绰有余。

### Sora 2 Pro

`sora-2-pro` 产生更高质量的结果。当你需要 **生产级输出**.

`sora-2-pro` 渲染时间更长且运行成本更高，但能产生更精致、更稳定的结果。它最适合高分辨率电影片段、营销素材以及任何视觉精度至关重要的场景。

使用 `sora-2-pro` 当你需要 1080p 导出时， `1920x1080` 或 `1080x1920`.

两者都 `sora-2` 和 `sora-2-pro` 支持 `16`- 和 `20`- 秒生成。

## 生成视频

生成视频是一个 **异步** 过程：

1. 当你调用 `POST /videos` 端点时，API会返回一个包含作业 ID 的作业对象 `id` 以及一个初始 `status`.

2. 你可以轮询 `GET /videos/{video_id}` 端点直到状态转为已完成，或采用更高效的方式——使用 webhooks（参见下方 webhooks 部分）在作业完成时自动收到通知。

3. 一旦作业达到 `completed` 状态，你可以通过以下方式获取最终的 MP4 文件 `GET /videos/{video_id}/content`.

### 启动渲染作业

首先调用 `POST /videos` 并传入文本提示和所需参数。提示词定义创意观感——主题、镜头、灯光和运动——而诸如 `size` 和 `seconds` 等参数则控制视频的分辨率和长度。

创建视频

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

let video = await openai.videos.create({
  model: "sora-2",
  prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log("Video generation started: ", video);
```

```python
from openai import OpenAI

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)
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
	video, err := client.Videos.New(context.Background(), openai.VideoNewParams{
		Model:  openai.VideoModelSora2,
		Prompt: "A video of the words 'Thank you' in sparkling letters",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Video generation started:", video)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.videos.VideoCreateParams;

var video =
    client
        .videos()
        .create(
            VideoCreateParams.builder()
                .model("sora-2")
                .prompt("A paper airplane flying over a forest")
                .build());

System.out.println(video.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
video = client.videos.create(model: "sora-2", prompt: "A paper airplane flying over a forest")
puts(video.id)
```

```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="Wide tracking shot of a teal coupe driving through a desert highway, heat ripples visible, hard sun overhead." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8" \
```


响应是一个 JSON 对象，包含唯一 id 和初始状态，例如 `queued` 或 `in_progress`。这意味着渲染任务已开始。

```shell
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "queued",
  "model": "sora-2-pro",
  "progress": 0,
  "seconds": "8",
  "size": "1280x720"
}
```

### 选择大小和时长

选择满足你生产需求的最小格式：

- 在迭代提示词、运镜或构图时，请使用较短的片段。
- 生成最长 `20` 秒的视频，以呈现更长的节拍、更完整的场景或更完整的片段。
- 在 `sora-2-pro` 中使用更高分辨率的导出格式， `1920x1080` 或 `1080x1920`.

较长的时长和 1080p 任务可能比短暂的 720p 或 480p 渲染花费明显更长的时间，因此在面向用户的流程中请规划更高的延迟。

### 护栏与限制

该API强制执行多项内容限制：

- 仅限适合 18 岁以下受众的内容（未来将提供绕过此限制的设置）。
- 受版权保护的角色和受版权保护的音乐将被拒绝。
- 无法生成真实人物（包括公众人物）。
- 默认情况下，描绘人类相似度的角色上传会被阻止。
- 目前拒绝包含人脸的输入图像。

确保提示词、参考图像和转录内容遵循这些规则，以避免生成失败。

### 有效提示

为获得最佳效果，请描述 **镜头类型、主体、动作、场景和灯光**。例如：

- _“孩子在草地上放红色风筝的广角镜头，金色黄昏阳光，镜头缓慢向上摇摄。”_
- _“木桌上热气腾腾咖啡杯的特写，晨光透过百叶窗，浅景深。”_

这种程度的明确性有助于模型生成一致的结果，而不会编造不必要的细节。如需更高级的提示技巧，请参阅我们专门的 Sora 2 [提示指南](https://developers.openai.com/cookbook/examples/sora/sora2_prompting_guide).

### 监控进度

视频生成需要时间。具体取决于模型、API负载及分辨率， **单次渲染可能需要几分钟**.

为高效管理这一过程，你可以轮询API以请求状态更新，或通过 webhook 接收通知。

#### 轮询状态端点

调用 `GET /videos/{video_id}` 时使用创建调用返回的 id。响应显示作业的当前状态、进度百分比（如果有）以及任何错误。

典型状态为 `queued`, `in_progress`, `completed`，以及 `failed`。以合理的间隔进行轮询（例如，每 10–20 秒），如有必要，使用指数退避，并向用户提供作业仍在进行中的反馈。

轮询状态端点

```javascript
import OpenAI from "openai";
import { setTimeout as sleep } from "node:timers/promises";

const openai = new OpenAI();

async function main() {
  let video = await openai.videos.create({
    model: "sora-2",
    prompt: "A video of the words 'Thank you' in sparkling letters",
  });

  while (video.status === "queued" || video.status === "in_progress") {
    await sleep(2000);
    video = await openai.videos.retrieve(video.id);
  }

  if (video.status === "completed") {
    console.log("Video successfully completed: ", video);
  } else {
    console.log("Video creation failed. Status: ", video.status);
  }
}

main();
```

```python
import asyncio

from openai import AsyncOpenAI

client = AsyncOpenAI()


async def main() -> None:
    video = await client.videos.create_and_poll(
        model="sora-2",
        prompt="A video of a cat on a motorcycle",
    )

    if video.status == "completed":
        print("Video successfully completed: ", video)
    else:
        print("Video creation failed. Status: ", video.status)


asyncio.run(main())
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
	video, err := client.Videos.NewAndPoll(context.Background(), openai.VideoNewParams{
		Model:  openai.VideoModelSora2,
		Prompt: "A video of the words 'Thank you' in sparkling letters",
	}, 2000)
	if err != nil {
		panic(err)
	}
	if video.Status == openai.VideoStatusCompleted {
		fmt.Println("Video successfully completed:", video)
		return
	}
	fmt.Println("Video creation failed. Status:", video.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.videos.Video;
import com.openai.models.videos.VideoCreateParams;

var video =
    client
        .videos()
        .create(
            VideoCreateParams.builder()
                .model("sora-2")
                .prompt("A paper airplane flying over a forest")
                .build());

while (video.status().equals(Video.Status.QUEUED)
    || video.status().equals(Video.Status.IN_PROGRESS)) {
  Thread.sleep(1000);
  video = client.videos().retrieve(video.id());
}
if (!video.status().equals(Video.Status.COMPLETED)) {
  throw new IllegalStateException("Video generation failed: " + video.status());
}
System.out.println("Video completed: " + video.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
video = client.videos.create(model: "sora-2", prompt: "A paper airplane flying over a forest")

while [:queued, :in_progress].include?(video.status)
  sleep(2)
  video = client.videos.retrieve(video.id)
end

unless video.status == OpenAI::Models::Video::Status::COMPLETED
  raise "Video creation failed. Status: #{video.status}"
end

puts("Video successfully completed: #{video.id}")
```


响应示例：

```shell
{
  "id": "video_68d7512d07848190b3e45da0ecbebcde004da08e1e0678d5",
  "object": "video",
  "created_at": 1758941485,
  "status": "in_progress",
  "model": "sora-2-pro",
  "progress": 33,
  "seconds": "8",
  "size": "1280x720"
}
```

#### 使用 Webhook 接收通知

与其反复轮询作业状态， `GET`，不如注册一个 [webhook](https://developers.openai.com/api/docs/guides/webhooks) ，以便在视频生成完成或失败时自动收到通知。

你可以在 [webhook 设置页面](https://platform.openai.com/settings/project/webhooks)。中配置 Webhooks。当作业完成时，API 会发出两种事件类型之一： `video.completed` 和 `video.failed`. 每个事件都包含触发它的作业 ID。

示例 webhook 负载：

```
{
  "id": "evt_abc123",
  "object": "event",
  "created_at": 1758941485,
  "type": "video.completed", // or "video.failed"
  "data": {
    "id": "video_abc123"
  }
}
```

### 检索结果

#### 下载 MP4

一旦任务达到状态 `completed`，即可使用以下接口获取 MP4 `GET /videos/{video_id}/content`。该端点会流式传输二进制视频数据并返回标准内容标头，因此你可以直接将文件保存到磁盘，或将其传输到云存储。

下载 MP4

```javascript
import { writeFileSync } from "node:fs";

import OpenAI from "openai";

const openai = new OpenAI();

let video = await openai.videos.create({
  model: "sora-2",
  prompt: "A video of the words 'Thank you' in sparkling letters",
});

console.log("Video generation started: ", video);
let progress = video.progress ?? 0;

while (video.status === "in_progress" || video.status === "queued") {
  video = await openai.videos.retrieve(video.id);
  progress = video.progress ?? 0;

  // Display progress bar
  const barLength = 30;
  const filledLength = Math.floor((progress / 100) * barLength);
  // Simple ASCII progress visualization for terminal output
  const bar = "=".repeat(filledLength) + "-".repeat(barLength - filledLength);
  const statusText = video.status === "queued" ? "Queued" : "Processing";

  process.stdout.write(`${statusText}: [${bar}] ${progress.toFixed(1)}%`);

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

// Clear the progress line and show completion
process.stdout.write("\n");

if (video.status === "failed") {
  throw new Error("Video generation failed");
}

console.log("Video generation completed: ", video);

console.log("Downloading video content...");

const content = await openai.videos.downloadContent(video.id);

const body = content.arrayBuffer();
const buffer = Buffer.from(await body);

writeFileSync("video.mp4", buffer);

console.log("Wrote video.mp4");
```

```python
from openai import OpenAI
import sys
import time


openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

progress = getattr(video, "progress", 0)
bar_length = 30

while video.status in ("in_progress", "queued"):
    # Refresh status
    video = openai.videos.retrieve(video.id)
    progress = getattr(video, "progress", 0)

    filled_length = int((progress / 100) * bar_length)
    bar = "=" * filled_length + "-" * (bar_length - filled_length)
    status_text = "Queued" if video.status == "queued" else "Processing"

    sys.stdout.write(f"\r{status_text}: [{bar}] {progress:.1f}%")
    sys.stdout.flush()
    time.sleep(2)

# Move to next line after progress loop
sys.stdout.write("\n")

if video.status == "failed":
    message = getattr(
        getattr(video, "error", None), "message", "Video generation failed"
    )
    raise RuntimeError(message)

print("Video generation completed:", video)
print("Downloading video content...")

content = openai.videos.download_content(video.id, variant="video")
content.write_to_file("video.mp4")

print("Wrote video.mp4")
```

```go
package main

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	video, err := client.Videos.NewAndPoll(context.Background(), openai.VideoNewParams{
		Model:  openai.VideoModelSora2,
		Prompt: "A video of the words 'Thank you' in sparkling letters",
	}, 2000)
	if err != nil {
		panic(err)
	}
	if video.Status != openai.VideoStatusCompleted {
		panic(fmt.Errorf("video generation failed with status %s", video.Status))
	}

	response, err := client.Videos.DownloadContent(context.Background(), video.ID, openai.VideoDownloadContentParams{})
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()
	file, err := os.Create("video.mp4")
	if err != nil {
		panic(err)
	}
	if _, err := io.Copy(file, response.Body); err != nil {
		panic(err)
	}
	if err := file.Close(); err != nil {
		panic(err)
	}
	fmt.Println("Wrote video.mp4")
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.videos.Video;
import com.openai.models.videos.VideoCreateParams;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

var video =
    client
        .videos()
        .create(
            VideoCreateParams.builder()
                .model("sora-2")
                .prompt("A video of the words 'Thank you' in sparkling letters")
                .build());

while (video.status().equals(Video.Status.QUEUED)
    || video.status().equals(Video.Status.IN_PROGRESS)) {
  Thread.sleep(1000);
  video = client.videos().retrieve(video.id());
}
if (!video.status().equals(Video.Status.COMPLETED)) {
  throw new IllegalStateException("Video generation failed: " + video.status());
}
try (var content = client.videos().downloadContent(video.id())) {
  Files.copy(content.body(), Path.of("video.mp4"), StandardCopyOption.REPLACE_EXISTING);
}
System.out.println("Wrote video.mp4");
```

```ruby
require "openai"

client = OpenAI::Client.new
video = client.videos.create(
  model: "sora-2",
  prompt: "A video of the words 'Thank you' in sparkling letters"
)
pending_statuses = [
  OpenAI::Models::Video::Status::QUEUED,
  OpenAI::Models::Video::Status::IN_PROGRESS
]
while pending_statuses.include?(video.status)
  sleep(2)
  video = client.videos.retrieve(video.id)
end
raise "Video generation failed" if video.status == OpenAI::Models::Video::Status::FAILED

content = client.videos.download_content(video.id)
File.binwrite("video.mp4", content.read)
puts("Wrote video.mp4")
```

```bash
curl -L "https://api.openai.com/v1/videos/video_abc123/content" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output video.mp4
```


现在你已获得可用于播放、编辑或分发的最终视频文件。下载链接在生成后的最长 1 小时内有效。如需长期存储，请及时将文件复制到你自己的存储系统中。

#### 下载支持资产

对于每个已完成视频，你还可以下载 **缩略图** 和 **精灵表**。这些是轻量级资源，适用于预览、进度条或目录展示。使用 `variant` 查询参数指定要下载的内容。默认值为 `variant=video` 用于 MP4。

```bash
# Download a thumbnail
curl -L "https://api.openai.com/v1/videos/video_abc123/content?variant=thumbnail" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output thumbnail.webp

# Download a spritesheet
curl -L "https://api.openai.com/v1/videos/video_abc123/content?variant=spritesheet" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --output spritesheet.jpg
```


## 使用图像引用

你可以使用输入图像引导生成，该图像作为 **视频的第一帧**。如果输出视频需要保留品牌资产、角色或特定环境的外观，这将非常有用。

根据请求类型选择 `input_reference` 格式：

- 使用 `input_reference` 并附带上传的图片，用于 `multipart/form-data` 请求。
- 使用 `input_reference` 并附带 JSON 对象，用于 `application/json` 请求，包括 Batch。JSON 形式接受 `file_id` 或 `image_url`.

图像必须与目标视频的分辨率匹配（`size`).

支持的文件格式为 `image/jpeg`, `image/png`，以及 `image/webp`.

```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F prompt="She turns around and smiles, then slowly walks out of the frame." \
  -F model="sora-2-pro" \
  -F size="1280x720" \
  -F seconds="8" \
  -F input_reference="@sample_720p.jpeg;type=image/jpeg"
```


|                          输入图像使用 [OpenAI GPT Image 生成](https://developers.openai.com/api/docs/guides/image-generation)                           |                                 使用 Sora 2 生成的视频（已转换为 GIF）                                  |
| :---------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
| ![][sora_woman_skyline_original][下载此图像](https://cdn.openai.com/API/docs/images/sora/woman_skyline_original_720p.jpeg) |    ![][sora_woman_skyline_video] 提示词： _“她转过身微笑，然后慢慢走出画面。”_    |
|    ![][sora_monster_original_jpeg][下载此图像](https://cdn.openai.com/API/docs/images/sora/monster_original_720p.jpeg)     | ![][sora_monster_original_gif] 提示词： _“冰箱门打开了。一个可爱、胖乎乎的紫色怪物从里面出来了。”_ |

## 使用字符以保持一致性

角色（Character）允许你上传一个可复用的非人类主体，并在多次生成中引用它。当你希望动物、吉祥物或物体在多张画面中保持相同的核心外观、风格和屏幕表现时，这非常有用。

角色上传目前最适合短 `2`-到 `4`-秒的片段，
  `16:9` 或 `9:16`，在 `720p` 到 `1080p`。角色源视频在
  与请求输出的宽高比匹配时效果最佳。如果宽高比
  不同，角色可能会出现拉伸或变形。单个视频可以
  包含最多两个角色。

角色与 `input_reference`。不同。图像参考只影响
单次生成的起始帧，而角色素材可以在未来的视频请求中重复使用
。

通过上传一个简短的 MP4 片段到 `POST /v1/videos/characters`，来创建角色，然后在创建视频时在 `characters` 数组中包含返回的角色 ID。

默认情况下，描绘人类相似度的角色上传会被阻止。请联系
  你的客户经理或 [联系我们的销售
  团队](https://openai.com/contact-sales/) 了解更多关于资格
  拟真访问权限的信息。

```bash
curl -X POST "https://api.openai.com/v1/videos/characters" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "video=@character.mp4;type=video/mp4" \
  -F "name=Mossy"
```


在提示词中逐字提及角色名称。仅传递角色 ID
不足以在画面中可靠地保留角色。

角色可与 `input_reference`. 扩展不支持
角色。

```bash
curl -X POST "https://api.openai.com/v1/videos" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sora-2",
    "prompt": "A cinematic tracking shot of Mossy, a moss-covered teapot mascot, weaving through a lantern-lit market at dusk.",
    "size": "1280x720",
    "seconds": "8",
    "characters": [
      { "id": "char_123" }
    ]
  }'
```


## 扩展已完成的视频

视频扩展功能可让你延续已有的完整视频并创建新的拼接结果。在 `video` 字段中提供源视频， `POST /v1/videos/extensions`，添加描述场景应如何延续的提示，然后 API 会以完整源片段为上下文生成下一段。

当你希望保留运动、镜头方向和场景连续性时，请使用扩展功能。如果只需控制新生成的起始帧，请使用 `input_reference` 代替。

每次扩展最多可增加 `20` 秒。单个视频最多可扩展
  六次，总长度上限为 `120` 秒。扩展功能
  目前仅接受源视频和提示，不支持角色
  或图像引用。

```bash
curl -X POST "https://api.openai.com/v1/videos/extensions" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "video": {
      "id": "video_abc123"
    },
    "prompt": "Continue the scene as the camera rises over the rooftops and reveals the sunrise.",
    "seconds": "8"
  }'
```


## 编辑现有视频

通过编辑，你可以对现有视频进行有针对性的调整，而无需从头重新生成。发送 `POST /v1/videos/edits` 并附上提示词和 `video` 参考，系统会复用原始结构、连续性和构图，同时应用修改。当你进行单一且明确的更改时效果最佳，因为更小、更聚焦的编辑能保留更多原始保真度，并降低引入伪影的风险。

此前，视频生成可通过 remix 端点进行编辑，该端点
  即将弃用。新的集成请使用 edits 端点。

该 `video` 字段接受视频 ID 或上传的视频。如果传入
视频 ID，API 会根据源视频推断模型。

仅限符合条件的客户编辑上传的视频。请联系你的
  客户经理或 [联系我们的销售
  团队](https://openai.com/contact-sales/) 如果你需要此工作流。

```bash
curl -X POST "https://api.openai.com/v1/videos/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "video": {
      "id": "video_abc123"
    },
    "prompt": "Shift the color palette to teal, sand, and rust, with a warm backlight."
  }'
```


如果你上传新视频而非编辑现有生成，请在请求中明确设置
`model` 。

```bash
curl -X POST "https://api.openai.com/v1/videos/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "video=@source.mp4;type=video/mp4" \
  -F "model=sora-2-pro" \
  -F "prompt=Shift the color palette to teal, sand, and rust, with a warm backlight."
```


编辑对迭代尤其有价值，因为它让你无需丢弃已有成效的部分即可进行精炼。通过将每次编辑限制为一项明确的调整，你可以保持视觉风格、主体一致性和镜头构图稳定，同时仍能探索情绪、调色或场面调度上的变化。这使得通过小而可靠的步骤构建精致序列变得容易得多。

|         原始视频         |                             编辑后的生成视频                              |
| :----------------------------: | :-----------------------------------------------------------------------------: |
| ![][sora_monster_original_gif] | ![][sora_monster_orange] 提示词： _“把怪物的颜色改成橙色。”_ |
| ![][sora_monster_original_gif] | ![][sora_monster_2monsters] 提示词： _“紧接着出现第二只怪物。”_ |

## 通过批量 API 运行视频任务

当你需要排队处理大量视频渲染以进行离线处理、审阅管线或工作室工作流时，请使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 。批处理输入文件中的每一行使用与发送至 `POST /v1/videos`，相同的 JSON 请求体，这使其非常适合镜头列表和计划渲染队列。

对于 Batch 中的视频生成：

- 批处理目前支持 `POST /v1/videos` 。
- 批处理请求必须使用 JSON，不能使用 multipart。
- 提前上传资源，并从 JSON 请求体中引用它们。
- 在批处理中，使用 `input_reference` 进行图像引导生成。在 JSON 请求中，传递 `input_reference` 作为对象，包含 `file_id` 或 `image_url`.
- Multipart `input_reference` 上传（包括视频参考输入）在批处理中不受支持。
- 批处理生成的视频可在批处理完成后下载，最长 `24` 小时。

```jsonl
{"custom_id":"shot-001","method":"POST","url":"/v1/videos","body":{"model":"sora-2-pro","prompt":"Slow dolly shot through a miniature paper city at blue hour, soft fog, practical window lights flickering on.","size":"1920x1080","seconds":"20"}}
{"custom_id":"shot-002","method":"POST","url":"/v1/videos","body":{"model":"sora-2-pro","prompt":"Portrait close-up of a red panda chef plating noodles in a stainless-steel kitchen, shallow depth of field.","size":"1080x1920","seconds":"16"}}
```

当批次达到 `completed`，时，其输出中的视频任务已处于最终状态，例如 `completed`, `failed`，或 `expired`。使用稳定的 `custom_id` 值，以便将批次结果映射回内部镜头 ID、编辑队列或资产管线，然后使用返回的视频 ID 下载最终资产。

## 维护你的库

使用 `GET /videos` 来枚举你的视频。该端点支持用于分页和排序的可选查询参数。

```bash
curl "https://api.openai.com/v1/videos?limit=20&after=video_123&order=asc" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq .
```


使用 `DELETE /videos/{video_id}` 从 OpenAI 的存储中移除你不再需要的视频。

```bash
curl -X DELETE "https://api.openai.com/v1/videos/REPLACE_WITH_YOUR_VIDEO_ID" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq .
```


[sora_woman_skyline_original]: https://cdn.openai.com/API/docs/images/sora/sora_woman_skyline_original_2.jpeg
[sora_woman_skyline_video]: https://cdn.openai.com/API/docs/images/sora/sora_woman_skyline_video.gif
[sora_monster_original_jpeg]: https://cdn.openai.com/API/docs/images/sora/sora_monster_original_2.jpeg
[sora_monster_original_gif]: https://cdn.openai.com/API/docs/images/sora/sora_monster_original.gif
[sora_monster_orange]: https://cdn.openai.com/API/docs/images/sora/sora_monster_orange.gif
[sora_monster_2monsters]: https://cdn.openai.com/API/docs/images/sora/sora_monster_2monsters.gif