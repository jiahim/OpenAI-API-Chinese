# 使用 Sora 生成视频

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需 Markdown 版本的文档页面，可在页面 URL 末尾附加 `.md` 来获取。

## 概述

Sora 是 OpenAI 在生成式媒体领域的最新前沿——一款最先进的视频模型，能够根据自然语言或图像创建细节丰富、富有动态感的音频片段。它基于多年对多模态扩散技术的研究，并使用多样化的视觉数据训练而成，将对 3D 空间、运动和场景连续性的深刻理解带入文本生成视频之中。

该 [Videos API](https://developers.openai.com/api/reference/resources/videos) 首次将这些能力开放给开发者，支持以编程方式创建、扩展、编辑和管理视频。

你可以使用它来：

- 根据提示词创建新视频。
- 使用图像参考引导生成。
- 在多次生成中复用角色资产，以获得更强的视觉一致性。
- 通过视频扩展延续已完成的片段。
- 对已有视频进行有针对性的修改。
- 下载已完成的视频及相关资源。
- 通过 [Batch API](https://developers.openai.com/api/docs/guides/batch).

## 模型

第二代 Sora 模型提供两种变体，每种都针对不同的使用场景进行了定制。

### Sora 2

`sora-2` 专为 **速度和灵活性**。而设计。它非常适合探索阶段，当你正在试验语气、结构或视觉风格，并需要快速反馈而非完美的保真度时。

它能够快速生成质量不错的效果，非常适合快速迭代、构思和粗剪。 `sora-2` 通常足以应对社交媒体内容、原型设计以及那些更看重交付速度而非超高保真度的场景。

### Sora 2 Pro

`sora-2-pro` 生成更高质量的结果。当你需要 **生产级输出**.

`sora-2-pro` 渲染时间更长，运行成本也更高，但它能产出更精致、更稳定的结果。它最适合高分辨率电影级画面、营销素材，以及任何对视觉精度有严苛要求的场景。

在需要以 `sora-2-pro` 导出 1080p 视频时使用 `1920x1080` 或 `1080x1920`.

两者 `sora-2` 和 `sora-2-pro` 都支持 `16`-秒和 `20`-秒生成。

## Generate a video

生成视频是一个 **异步** 过程：

1. 当你调用 `POST /videos` endpoint 时，API 会返回一个包含 job `id` 和初始 `status`.

2. 你可以轮询 `GET /videos/{video_id}` endpoint 直到状态变为 completed，或者——为了更高效——使用 webhook（见下方 webhook 部分）在任务完成时自动收到通知。

3. 当任务达到 `completed` 状态后，你可以通过 `GET /videos/{video_id}/content`.

### 启动渲染任务

首先调用 `POST /videos` 并传入文本提示词和必需参数。提示词决定了视频的创意风格与观感——包括主题、镜头、光照和运动——而诸如 `size` 和 `seconds` 等参数则用于控制视频的分辨率和时长。

Create a video

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


响应是一个 JSON 对象，包含唯一的 id 和初始状态，例如 `queued` 或 `in_progress`.这意味着渲染任务已启动。

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

### 选择尺寸与时长

选择能满足你生产需求的最小格式：

- 在调试提示词、运动或构图时使用较短的片段。
- 需要更长的节拍、更饱满的场景或更完整的片段时，生成最长达 `20` 秒的视频。
- 使用 `sora-2-pro` 以导出更高分辨率的 `1920x1080` 或 `1080x1920`.

较长的时长和 1080p 任务完成所需的时间可能明显长于较短的 720p 或 480p 渲染，因此在为面向用户的工作流做规划时应预留更高的延迟。

### 护栏与限制

API 强制实施若干内容限制：

- 仅面向 18 岁以下受众的内容（未来将提供绕过此限制的设置）。
- 受版权保护的角色形象和受版权保护的音乐将被拒绝。
- 不能生成真人形象，包括公众人物。
- 描绘人类形象的素材上传默认会被拦截。
- 当前会拒绝包含人脸的输入图像。

确保提示词、参考图像和转录文本遵循这些规则，以避免生成失败。

### 有效提示

为了获得最佳效果，请描述 **镜头类型、主体、动作、场景和光照**。例如：

- _“黄金时刻的阳光下，一个孩子在绿草如茵的公园里放飞红色风筝的远景镜头，摄像机缓慢向上摇摄。”_
- _“木质桌上一个冒着热气的咖啡杯特写，清晨光线透过百叶窗洒入，景深柔和。”_

这种具体的细节有助于模型产出稳定的结果，避免编造不必要的内容。如需了解更高级的提示技巧，请参阅我们的 Sora 2 [提示指南](https://developers.openai.com/cookbook/examples/sora/sora2_prompting_guide).

### 监控进度

视频生成需要一定时间。具体耗时取决于模型、API 负载和分辨率， **单次渲染可能需要数分钟**.

为了高效管理，你可以轮询 API 以请求状态更新，也可以通过 webhook 接收通知。

#### 轮询状态端点

Call `GET /videos/{video_id}` 并使用创建调用返回的 id。响应会显示任务的当前状态、进度百分比（若可用）以及任何错误。

常见状态包括 `queued`, `in_progress`, `completed`，以及 `failed`。以合理的间隔进行轮询（例如每 10–20 秒一次），必要时使用指数退避，并向用户反馈任务仍在进行中。

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

#### 使用 Webhook 进行通知

无需反复轮询任务状态， `GET`，而是注册一个 [webhook](https://developers.openai.com/api/docs/guides/webhooks) 以便在视频生成完成或失败时自动接收通知。

可在你的 [webhook 设置页面](https://platform.openai.com/settings/project/webhooks)。中配置 Webhook。任务结束时，API 会发出以下两种事件类型之一： `video.completed` 和 `video.failed`。每个事件都包含触发该事件的任务 ID。

示例 webhook 载荷：

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

任务进入状态 `completed`，后，使用以下方式获取 MP4: `GET /videos/{video_id}/content`。该端点以流式方式传输二进制视频数据并返回标准的 content 响应头，因此你可以直接将文件保存到磁盘，也可以将其管道传输到云存储。

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


现在你已获得可用于播放、剪辑或分发的最终视频文件。下载链接在生成后最长 1 小时内有效。如需长期存储，请及时将文件复制到你自己的存储系统中。

#### 下载支持资源

对于每个已完成的视频，你还可以下载 **缩略图** 和 **雪碧图**。这些是轻量级资源，可用于预览、拖动条或目录展示。使用 `variant` 查询参数来指定你要下载的内容。默认值为 `variant=video` ，对应 MP4。

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


## 使用图片引用

你可以使用一张输入图像来引导生成，该图像将作为 **视频的首帧**。当你需要生成的视频保留品牌素材、角色或特定环境的风格时，这非常有用。

根据请求类型选择 `input_reference` 格式：

- 使用 `input_reference` 与上传的图片一起在 `multipart/form-data` 请求中使用。
- 使用 `input_reference` 与一个 JSON 对象一起在 `application/json` 请求中使用，包括 Batch。JSON 形式接受任一 `file_id` 或 `image_url`.

图像必须与目标视频的分辨率匹配（`size`).

支持的文件格式包括 `image/jpeg`, `image/png`，以及 `image/webp`.

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


|                          使用以下工具生成的输入图像 [OpenAI GPT Image](https://developers.openai.com/api/docs/guides/image-generation)                           |                                 使用 Sora 2 生成的视频（已转换为 GIF）                                  |
| :---------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
| ![][sora_woman_skyline_original][下载此图像](https://cdn.openai.com/API/docs/images/sora/woman_skyline_original_720p.jpeg) |    ![][sora_woman_skyline_video] 提示词： _“她转过身笑了笑，然后慢慢走出画面。”_    |
|    ![][sora_monster_original_jpeg][下载此图像](https://cdn.openai.com/API/docs/images/sora/monster_original_720p.jpeg)     | ![][sora_monster_original_gif] 提示词： _“冰箱门打开了。一只可爱、胖乎乎的紫色怪物从里面走了出来。”_ |

## 使用字符以保持一致性

角色让你可以上传一个可重复使用的非人类主体，并在多次生成中引用它。当你希望某个动物、吉祥物或物体在多个镜头中保持相同的核心外观、风格和画面存在感时，这非常有用。

角色上传目前在较短的 `2`- 到 `4`-秒片段中效果最佳，在
  `16:9` 或 `9:16`，在 `720p` 到 `1080p`。角色源视频在以下情况下效果最佳：
  它们的宽高比与所请求输出的宽高比一致。如果宽高比
  不同，角色可能会出现拉伸或变形。单个视频可以
  包含最多两个角色。

角色与以下内容不同： `input_reference`。图像参考会对单次生成的
起始帧进行条件约束，而角色资产可以在未来的
视频请求中重复使用。

通过上传一段简短的 MP4 片段到 `POST /v1/videos/characters`，来创建角色，然后将返回的角色 ID 包含在创建 `characters` 视频时的数组中。

默认情况下，涉及人类肖像的角色上传会被拦截。请联系
  你的账户经理或 [联系我们的销售
  团队](https://openai.com/contact-sales/) 了解有关以下资格要求的更多信息：
  类人访问。

```bash
curl -X POST "https://api.openai.com/v1/videos/characters" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "video=@character.mp4;type=video/mp4" \
  -F "name=Mossy"
```


在提示中逐字提及角色名称。仅传递角色 ID
不足以可靠地在镜头中保留该角色。

角色可以与 `input_reference`。组合使用。扩展不支持
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


## Extend completed videos

视频扩展可以让你延续一段已完成的视频，并生成一个新的拼接结果。在 `video` 字段中提供源视频 `POST /v1/videos/extensions`，添加一段描述场景应如何延续的提示词，API 会以完整的源片段作为上下文来生成下一段。

当你希望保留动作、镜头方向和场景连续性时，可以使用扩展。如果你只需要控制新生成内容的起始帧，请使用 `input_reference` 。

每次扩展最多可增加 `20` 秒。单个视频最多可扩展
  至六次，总长度上限为 `120` 秒。扩展功能
  目前仅接受源视频和提示词，不支持角色
  或图像参考。

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

Editing 允许你对已有的视频进行定向调整，无需从头重新生成。发送 `POST /v1/videos/edits` 一个提示词和一个 `video` 参考，系统会复用原有的结构、连续性和构图，再应用修改。当你只做一个明确的小改动时效果最佳，因为更小、更聚焦的编辑能保留更多原始保真度，并降低引入伪影的风险。

此前可以通过 remix 端点编辑视频生成结果，该端点
  已被弃用。新集成请使用 edits 端点。

该 `video` 字段接受视频 ID 或上传的视频。如果你传入一个
视频 ID，API 会根据源视频推断模型。

编辑已上传的视频仅向符合条件的客户提供。请联系你的
  账户经理，或 [联系我们的销售
  团队](https://openai.com/contact-sales/) 如果你需要此 工作流。

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


如果你上传新视频而不是编辑已有生成结果，请在请求中
`model` 显式设置。

```bash
curl -X POST "https://api.openai.com/v1/videos/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "video=@source.mp4;type=video/mp4" \
  -F "model=sora-2-pro" \
  -F "prompt=Shift the color palette to teal, sand, and rust, with a warm backlight."
```


Editing 对于迭代尤其有价值，因为它让你在不丢弃已有可用成果的情况下逐步打磨。将每次编辑约束为一项清晰的调整，你可以保持视觉风格、主体一致性和镜头构图稳定，同时仍然探索情绪、配色或布景的变化。这让通过小巧、可靠的步骤来构建精致的序列变得容易得多。

|         原始视频         |                             编辑后的生成视频                              |
| :----------------------------: | :-----------------------------------------------------------------------------: |
| ![][sora_monster_original_gif] | ![][sora_monster_orange] 提示词： _“将怪物的颜色改为橙色。”_ |
| ![][sora_monster_original_gif] | ![][sora_monster_2monsters] 提示词： _“紧接着第二个怪物出现。”_ |

## 通过 Batch API 运行视频任务

使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 在需要将大量视频渲染加入离线处理、审片流水线或工作室工作流的队列时使用。批处理输入文件中的每一行使用的 JSON 请求体，与你发送给发送的 接口 的请求体相同，这使得它非常适合镜头清单和定时渲染队列。 `POST /v1/videos`，这使得它非常适合镜头清单和定时渲染队列。

批量视频生成：

- Batch 当前支持 `POST /v1/videos` only。
- Batch 请求必须使用 JSON，不能使用 multipart。
- 提前上传素材，并在 JSON 请求体中引用它们。
- 使用 `input_reference` 用于 Batch 中的图像引导生成。在 JSON 请求中，传入 `input_reference` 作为一个对象，配合 `file_id` 或 `image_url`.
- Multipart `input_reference` 上传，包括视频参考输入，在 Batch 中不受支持。
- Batch 生成的视频在批次完成后可下载，时长最多为 `24` 小时。

```jsonl
{"custom_id":"shot-001","method":"POST","url":"/v1/videos","body":{"model":"sora-2-pro","prompt":"Slow dolly shot through a miniature paper city at blue hour, soft fog, practical window lights flickering on.","size":"1920x1080","seconds":"20"}}
{"custom_id":"shot-002","method":"POST","url":"/v1/videos","body":{"model":"sora-2-pro","prompt":"Portrait close-up of a red panda chef plating noodles in a stainless-steel kitchen, shallow depth of field.","size":"1080x1920","seconds":"16"}}
```

当一个批次达到 `completed`，时，其输出中的视频任务已经进入终态，例如 `completed`, `failed`，或 `expired`。使用稳定的 `custom_id` 值，以便将批次结果映射回你内部的镜头 ID、剪辑队列或资产流水线，然后使用返回的视频 ID 下载最终资产。

## 维护你的库

在需要以 `GET /videos` 以列举你的视频。该端点支持可选的查询参数，用于分页和排序。

```bash
curl "https://api.openai.com/v1/videos?limit=20&after=video_123&order=asc" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq .
```


在需要以 `DELETE /videos/{video_id}` 以移除你不再需要的视频，将其从OpenAI的存储中删除。

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