# 图像提示

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来获取。

<header className="not-prose mb-8">
        <h2
          id="gpt-image-2.5-guide"
          className="m-0 text-3xl font-semibold text-default"
        >
          {"GPT Image 2.5 prompting guide"}
        </h2>
        

          Choose a model, write effective prompts, and preserve details across
          edits.
        

      </header>
      

## 概述

从你需要的图像开始，然后描述主体、构图、风格和约束条件。对于编辑操作，需要说明哪些部分需要更改，哪些部分必须保持不变。每次只调整一个要素，并仔细检查生成结果。

GPT Image 2.5 提供两种模型选择。GPT Image 2.5 Flare 是小模型，针对速度进行了优化，图像质量与 GPT Image 2 相当。GPT Image 2.5 Sunburst 是基础模型，针对质量进行了优化，图像质量高于 GPT Image 2。两个模型在精确编辑和主体保持方面都有改进。

有关API设置和请求示例，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation).

## 选择模型

对于新的工作流，如果速度优先，从 GPT Image 2.5 Flare 开始；如果对质量要求较高，则从 GPT Image 2.5 Sunburst 开始。一旦输出满足你的需求，便可寻找降低延迟的机会。

若要从当前图像模型迁移，请以你当前的图像质量作为起点。两个模型都支持图像生成、编辑和透明背景。

| 你当前的工作流                                                               | 先进行测试                                                                             |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 现有且经过验证的 GPT Image 2 工作流已满足你的质量要求 | GPT Image 2.5 Flare。检查是否能在降低延迟的同时保持可接受的质量。 |
| GPT Image 2 无法满足质量要求的复杂用例        | GPT Image 2.5 Sunburst。首先确认它能提供你所需的质量。               |

如果 GPT Image 2.5 Sunburst 满足你的质量要求，则使用相同的提示词和输入测试 GPT Image 2.5 Flare。如果它同样满足这些要求并能降低延迟，则切换到 GPT Image 2.5 Flare。当 GPT Image 2.5 Sunburst 的质量优势对你的工作流必要时，保留使用 GPT Image 2.5 Sunburst。

在你的实际负载上测量响应时间和质量。结果取决于你的提示词、参考图像、输出尺寸和质量设置；一个负载上的速度提升并不能说明另一个负载也有同样的提升。

## 模型参数

将 API 参数与提示分开设置。

| 参数    | GPT Image 2.5 设置                                                                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model`      | `gpt-image-2.5-flare` (小模型)或 `gpt-image-2.5-sunburst` (基础模型)                                                                                                                                                        |
| `quality`    | `auto` (默认), `low`, `medium`, `high`, `xhigh`，或 `max`                                                                                                                                                                        |
| `size`       | `auto` 或自定义分辨率。常用尺寸： `1024x1024` (方形), `1536x1024` （横屏）， `1024x1536` （竖屏）， `2048x2048` （2K 方形）， `2048x1152` （2K 横屏）， `3840x2160` （4K 横屏），以及 `2160x3840` （4K 竖屏）。 |
| `background` | `auto`, `opaque`，或 `transparent`                                                                                                                                                                                                  |

如需自定义分辨率，请使用 `WIDTHxHEIGHT` 并遵循以下约束：

- 每条边的像素数不得超过 3,840。
- 两条边的像素数都必须是 16 的倍数。
- 长边与短边的比例不得超过 3:1。
- 总像素数必须在 655,360 到 8,294,400 之间。

总像素超过 3,686,400 的输出(`2560x1440`)属于实验性质。

在调优前，使用上方的工作流选择模型 `quality`。在首次对比时，若两个模型都支持某个明确选定的质量设置，请保持其不变，同时保持提示词、参考图像和输出尺寸一致。相同的质量标签并不代表跨模型具有相同的图像质量或响应时间。

如果输出效果不理想，请尝试更高的质量设置。一旦满足你的需求，再测试较低的设置，看看它们在保持可接受质量的同时能否降低延迟。使用 `xhigh` 或 `max` 仅当它们能在你的延迟预算内改善尚未满足的质量要求时使用。更高的设置并不保证每个提示词都能得到更好的结果。

对于带透明通道的资产，请明确请求 `background="transparent"` 并使用 PNG 或 WebP。检查解码后图像的 alpha 通道，包括头发、玻璃、阴影和物体边缘。使用 `output_compression` 仅适用于 JPEG 或 WebP 输出，不适用于 PNG。

## 迁移现有的工作流

1. **保存一个基线。** 收集具有代表性的生产环境提示词和参考图像，包括复杂编辑、精确文本、人物面部、产品几何形状以及透明背景素材。记录当前的模型、请求设置和结果。
2. **选择第一个候选模型。** 如果 GPT Image 2 已经满足你的质量要求，先使用 GPT Image 2.5 Flare，测试延迟是否有所改善。如果 GPT Image 2 在某个复杂用例上表现不足，先使用 GPT Image 2.5 Sunburst，并先确认它满足你的质量要求。在首次对比时，保持提示词、参考图像、尺寸和输出格式不变。
3. **检查完整的结果。** 对比指令遵循、身份和产品的保留效果、文本准确性、不必要的修改以及透明度。重复请求以衡量一致性。对于编辑工作流，既要测试完整的编辑序列，也要单独测试每个步骤。
4. **在质量测试通过后，测试延迟提升情况。** 如果你最初使用的是 GPT Image 2.5 Sunburst，且它满足你的质量要求，请基于同样的质量要求评估 GPT Image 2.5 Flare。仅当质量仍可接受且延迟有所改善时才进行切换；否则继续使用 GPT Image 2.5 Sunburst。
5. **一次只调整一个设置。** 在重写提示词之前，先对比质量等级。测量典型响应和较慢响应的耗时、失败、重试以及每张合格图像的成本。确认当前定价，不要假设更快的模型成本更低。
6. **按工作流逐步上线。** 当已发布的模型通过你的验收标准后，先将一小部分流量切换过去，监控相同的指标，并逐步扩大范围。在前一个模型仍受支持期间，保留它以便回滚。

从 GPT Image 1 或 1.5 迁移时，请使用参考选项卡查看参数差异和停用日期。测试候选模型所支持的请求设置，而不是原样照搬旧设置。对于 GPT Image 2，请在对比中保留你现有的分辨率和透明度要求。

重复编辑仍可能改变你原本想保留的细节。重述这些约束条件并逐一检查每个结果。如果某个区域必须保持像素级一致，请将已批准的编辑合成到原始图像中，而不是仅依赖提示词。

## 提示工程基础

1. **明确结果。** 说明主题与预期用途，例如产品照片、广告或示意图。指定构图、宽高比以及重要的位置约束。对于复杂需求，将提示按场景、主体、细节和约束组织，使用带标签的章节。
2. **选择易于维护的格式。** 简短提示、描述性段落、类 JSON 结构、说明和标签都可以表达相同意图。选择能让需求最易于阅读和更新的格式，而不是依赖特殊语法。
3. **描述可见的细节。** 说明材质、光照、颜色和视觉媒介。当目标是写实风格时，明确要求“photorealistic”或“real photograph”，并描述构图与质感。将相机参数视为外观线索，而非对精确物理效果的保证。对于宽幅、电影感、低光、雨景或霓虹场景，应具体说明尺度、氛围与颜色，而不是仅依靠情绪词。
4. **指定人物与动作。** 描述身体构图、相对比例、视线方向以及与物体的交互。例如“full body visible, feet included”“looking down at the open book”或“hands naturally gripping the handlebars”等指令能让预期的姿态和动作更清晰。
5. **指定精确的文本。** 将所需文案用引号标出，并描述其位置与排版。必要时逐字母拼写非常规词汇或品牌名。要求不包含额外文本，然后检查输出中的拼写和可读性。对于小字号、信息密集或多种字体的情况，比较 medium 或 high 质量。
6. **将修改与约束分开。** 对于编辑操作，写明“change only X”，并列出需要保留的细节，例如身份、几何形状、布局、光照或标签。声明排除项，例如不需要的文本、标志或水印。对于精确的局部编辑，还应说明必须保持不变的饱和度、对比度、箭头、相机角度以及周围物体。
7. **为参考图分配角色。** 用编号和用途标识每张输入图：主体、风格、服装或背景。说明输入图应如何组合，以及哪些元素应移动到哪里。
8. **有目的地迭代。** 将上一次输出作为下一次编辑输入，每次只请求一项修改，并重复需要保留的细节。“same style as before”之类的引用可以延续上下文，但若结果偏离，请重申关键约束。在添加更多指令前先对比结果。

下面的示例各自演示了一种不同的技巧。可以将它们的提示作为起点，并根据自己的图像和需求进行调整。

## 生成图像

### 控制风格与光照

通过主体、构图、光线和质感来描述一张照片。该示例指定了抓拍构图，并明确排除了重度修图。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a photorealistic candid photograph of an elderly sailor standing on a small fishing boat.
He has weathered skin with visible wrinkles, pores, and sun texture, and a few faded traditional sailor tattoos on his arms.
He is calmly adjusting a net while his dog sits nearby on the deck. Shot like a 35mm film photograph, medium close-up at eye level, using a 50mm lens.
Soft coastal daylight, shallow depth of field, subtle film grain, natural color balance.
The image should feel honest and unposed, with real skin texture, worn materials, and everyday detail. No glamorization, no heavy retouching.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Photorealistic portrait of a sailor repairing a net — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/photorealism-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Photorealistic portrait of a sailor repairing a net — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/photorealism-gpt-image-2-5-sunburst.webp>)


  </figure>



### 以可视化方式解释一个流程

为图像应传达的流程、受众和信息命名。对于图表和信息图，需核对标签和事实关系以及外观。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a detailed Infographic of the functioning and flow of an automatic coffee machine like a Jura.
From bean basket, to grinding, to scale, water tank, boiler, etc.
I'd like to understand technically and visually the flow.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Diagram explaining an automatic coffee machine — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/infographic-coffee-machine-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Diagram explaining an automatic coffee machine — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/infographic-coffee-machine-gpt-image-2-5-sunburst.webp>)


  </figure>



### 渲染精确文本

引用所需的文案,并告知模型该文案应出现的次数。指定受众与视觉呈现方式,但不要添加无关的说明。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Give me a cool in culture ad / fashion shot for a brand called Thread.
It's a hip young street brand. The ad shows a group of friends hanging out together with the tagline "Yours to Create."
Make it feel like a polished campaign image for a youth streetwear audience: stylish, contemporary, energetic, and tasteful.
Use clean composition, strong color direction, natural poses, and premium fashion photography cues.
Render the tagline exactly once, clearly and legibly, integrated into the ad layout.
No extra text, no watermarks, no unrelated logos.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Thread streetwear campaign with the requested tagline — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/thread-ad-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Thread streetwear campaign with the requested tagline — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/thread-ad-gpt-image-2-5-sunburst.webp>)


  </figure>



### 设计一个可复用的 logo

描述品牌以及应当定义该标志的形状。指定一个清晰的构图，使其在不同尺寸下都保持清晰易读。使用 `n` 以请求多个变体。

生成设置： `size="1024x1536"`, `quality="medium"`, `background="transparent"`, `output_format="png"`, `n=1`.

```text
Create an original, non-infringing logo for a company called Field & Flour, a local bakery.
The logo should feel warm, simple, and timeless. Use clean, vector-like shapes, a strong silhouette, and balanced negative space.
Favor simplicity over detail so it reads clearly at small and large sizes. Flat design, minimal strokes, no gradients unless essential.
Fully transparent background. Deliver a single centered logo with generous padding, clean alpha edges, and no solid backdrop, scenery, checkerboard, or watermark.
```

每一行比较每个模型中的一个变体。

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Field and Flour bakery logo, first variation — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-1-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Field and Flour bakery logo, first variation — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-1-gpt-image-2-5-sunburst.webp>)


  </figure>





  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Field and Flour bakery logo, second variation — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-2-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Field and Flour bakery logo, second variation — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-2-gpt-image-2-5-sunburst.webp>)


  </figure>





  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Field and Flour bakery logo, third variation — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-3-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Field and Flour bakery logo, third variation — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-3-gpt-image-2-5-sunburst.webp>)


  </figure>





  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Field and Flour bakery logo, fourth variation — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-4-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Field and Flour bakery logo, fourth variation — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/logo-generation-4-gpt-image-2-5-sunburst.webp>)


  </figure>



### 使用历史与现实场景

为地点和日期命名，以确立历史背景。模型可以推断上下文细节，但仍需检查服装、舞台布置和周围环境以确保历史准确性。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a realistic outdoor crowd scene in Bethel, New York on August 16, 1969.
Photorealistic, period-accurate clothing, staging, and environment.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Crowd scene in Bethel, New York, in August 1969 — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/world-knowledge-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Crowd scene in Bethel, New York, in August 1969 — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/world-knowledge-gpt-image-2-5-sunburst.webp>)


  </figure>



### 将故事变成漫画分镜

对于故事到漫画的生成，将叙事定义为一连串清晰的视觉节拍，每个面板对应一个节拍。描述要具体并聚焦于动作，以便模型能够将故事转化为可读且节奏良好的面板。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a short vertical comic-style reel with 4 panels.
Panel 1: The owner leaves through the front door. The pet is framed in the window behind them, small against the glass, eyes wide, paws pressed high, the house suddenly quiet.
Panel 2: The door clicks shut. Silence breaks. The pet slowly turns toward the empty house, posture shifting, eyes sharp with possibility.
Panel 3: The house transformed. The pet sprawls across the couch like it owns the place, crumbs nearby, sunlight cutting across the room like a spotlight.
Panel 4: The door opens. The pet is seated perfectly by the entrance, alert and composed, as if nothing happened.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Four-panel comic about a pet at home — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/comic-reel-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Four-panel comic about a pet at home — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/comic-reel-gpt-image-2-5-sunburst.webp>)


  </figure>



### 创建接口预览

当你像产品已真实存在那样去描述它时，界面预览效果最佳。聚焦于布局、层次、间距以及真实的界面元素，避免使用概念艺术式的语言，这样生成的结果看起来就像一个可用、已发布的界面，而不是设计草图。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a realistic mobile app UI mockup for a local farmers market.
Show today’s market with a simple header, a short list of vendors with small photos and categories, a small “Today’s specials” section, and basic information for location and hours.
Design it to be practical, and easy to use. White background, subtle natural accent colors, clear typography, and minimal decoration.
It should look like a real, well-designed, beautiful app for a small local market.
Place the UI mockup in an iPhone frame.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Farmers market mobile app mockup — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/ui-farmers-market-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Farmers market mobile app mockup — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/ui-farmers-market-gpt-image-2-5-sunburst.webp>)


  </figure>



### 创建科学与教育类视觉内容

科学与教育类视觉非常适合用于生物、化学、课堂讲解、扁平化科学图标体系、示意图以及教学素材。可以像撰写教学设计简报一样撰写提示词：明确受众、教学目标、视觉格式、必备标注以及科学约束。为了获得最佳效果，可以要求采用干净、扁平的视觉体系，保持图标风格统一、箭头清晰、标注易读，并留出充足的空白，方便学生快速扫读概念。

在准确性至关重要时，请明确列出所需组件，并说明不应包含的内容。使用 `quality="high"` 来生成标注密集的示意图，或用于幻灯片与课程教材的素材。

生成设置： `size="1536x1024"`, `quality="high"`.

```text
Create a simple biology diagram titled "Cellular Respiration at a Glance" for high school students.

Show how glucose turns into energy inside a cell. Include glycolysis, the Krebs cycle, and the electron transport chain.
Use arrows to connect the steps, and label the main molecules: glucose, pyruvate, ATP, NADH, FADH2, CO2, O2, and H2O.
Make it look like a clean classroom handout or slide, with a white background, simple icons, clear labels, and easy-to-read text.

Avoid tiny text, extra decoration, or anything that makes the diagram hard to understand.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Classroom diagram of cellular respiration — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/scientific-educational-cellular-respiration-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Classroom diagram of cellular respiration — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/scientific-educational-cellular-respiration-gpt-image-2-5-sunburst.webp>)


  </figure>



### 构建幻灯片、示意图与图表

如果将提示词写成制品规范，而不是插图请求，生产力可视化效果会最佳。请明确指定具体交付物（幻灯片、工作流 图、图表、页面图像），定义画布和层级结构，提供真实文本或数据，并描述视觉语言。这些提示词应包含实用约束：易读的字体、精细的间距、避免装饰性杂乱，以及避免通用的图库照片式处理。

对于幻灯片、图表和以图示为主的素材，请直接在提示词中包含数字和标签。对于演示文稿式输出，请使用横向尺寸，并在 `quality="high"` 当图像中包含小号文字、图例、坐标轴或脚注时。

下面的示例市场数据和引用均为虚构的设计输入。使用幻灯片前，请将其替换为经过验证的数据。

生成设置： `size="1536x864"`, `quality="high"`.

```text
Create one pitch-deck slide titled **"Market Opportunity"** that feels like a real Series A fundraising slide from a YC-backed startup.

Use a clean white background, modern sans-serif typography like Inter, and a crisp, minimal layout. The slide should include:

* A TAM/SAM/SOM concentric-circle diagram in muted blues and grays
* Specific, believable market sizing numbers:

  * **TAM:** $42B
  * **SAM:** $8.7B
  * **SOM:** $340M
* A clean bar chart below showing market growth from **2021 to 2026**, with a subtle upward trend
* Small footnotes: **"AGI Research, 2024"** and **"Internal analysis"**
* A company logo placeholder in the bottom-right corner

The design should look like it belongs in a deck that actually raised money: highly readable text, clear data hierarchy, polished spacing, and professional startup-style visual language.

Avoid clip art, stock photography, gradients, shadows, decorative elements, or anything that feels generic or overdesigned.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Market opportunity slide with sample market sizing figures — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/market-opportunity-slide-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Market opportunity slide with sample market sizing figures — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/market-opportunity-slide-gpt-image-2-5-sunburst.webp>)


  </figure>



## 编辑图像

使用 `client.images.edit` 配合引用的输入图像使用。对于需要蒙版的局部编辑，请参阅 [使用蒙版进行编辑](https://developers.openai.com/api/docs/guides/image-generation#edit-an-image-using-a-mask).

### 在保留布局的同时进行翻译

使用每个模型的咖啡机示意图作为 [以可视化方式解释某个流程](#explain-a-process-visually) 输入。请求在保持设计不变的前提下替换其中的文本，然后检查译文以及是否仍有原文遗留的词。

编辑设置： `size="1024x1536"`, `quality="high"`.

```text
Translate the text in the infographic to Spanish. Do not change any other aspect of the image.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Coffee machine diagram translated into Spanish — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/infographic-coffee-machine-sp-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Coffee machine diagram translated into Spanish — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/infographic-coffee-machine-sp-gpt-image-2-5-sunburst.webp>)


  </figure>



### Transfer a visual style

为参考图像指定一个特定角色：其调色、纹理或视觉媒介。分别描述新主体。使用下方的像素艺术图像作为输入。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Use the same style from the input image and generate a man riding a motorcycle on a white background.
```

输入图像：



![用作风格参考的像素风游戏画面](<https://developers.openai.com/images/platform/guides/image-prompting/pixels.webp>)



示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Pixel-art motorcycle rider using the reference style — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/motorcycle-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Pixel-art motorcycle rider using the reference style — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/motorcycle-gpt-image-2-5-sunburst.webp>)


  </figure>



### 保留身份并更换服装

使用下方的人物照片和三张服饰参考图作为输入。明确指出人物的哪些方面必须保持固定，仅允许更换服饰。该模式同样适用于必须保持产品或物体可识别的编辑场景。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Edit the image to dress the woman using the provided clothing images. Do not change her face, facial features, skin tone, body shape, pose, or identity in any way. Preserve her exact likeness, expression, hairstyle, and proportions. Replace only the clothing, fitting the garments naturally to her existing pose and body geometry with realistic fabric behavior. Match lighting, shadows, and color temperature to the original photo so the outfit integrates photorealistically, without looking pasted on. Do not change the background, camera angle, framing, or image quality, and do not add accessories, text, logos, or watermarks.
```

输入图像：



  

![博物馆中的一位女性，用作身份参考](<https://developers.openai.com/images/platform/guides/image-prompting/woman-in-museum.webp>)


  

![米色夹克，用作服饰参考](<https://developers.openai.com/images/platform/guides/image-prompting/jacket.webp>)


  

![白色背心，用作服饰参考](<https://developers.openai.com/images/platform/guides/image-prompting/tank-top.webp>)


  

![灰色靴子，用作服饰参考](<https://developers.openai.com/images/platform/guides/image-prompting/boots.webp>)





示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Woman wearing the supplied clothing items — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/outfit-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Woman wearing the supplied clothing items — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/outfit-gpt-image-2-5-sunburst.webp>)


  </figure>



### 合并引用

将街景照片作为 image 1，将狗狗照片作为 image 2。指定要移动的元素、目标位置以及必须保持不变的部分。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Place the dog from the second image into the setting of image 1, right next to the woman, use the same style of lighting, composition and background. Do not change anything else.
```

输入图像：



  

![街景中的女子，第一个合成输入图](<https://developers.openai.com/images/platform/guides/image-prompting/test-woman.webp>)


  

![带着狗的女子，第二个合成输入图](<https://developers.openai.com/images/platform/guides/image-prompting/test-woman-2.webp>)





示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Dog placed beside the woman in the street scene — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/test-woman-with-dog-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Dog placed beside the woman in the street scene — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/test-woman-with-dog-gpt-image-2-5-sunburst.webp>)


  </figure>






### 创建透明的产品抠图

在提示词中同时请求一个独立的主体， `background="transparent"` 在 API 中。使用 PNG 或 WebP，保留返回的 alpha 通道，并省略 `output_compression` 以适用于 PNG。绘制的棋盘格不是透明效果。对于后续编辑，请重复保留透明背景的要求。使用下面的产品照片作为输入。

编辑设置： `size="1024x1536"`, `quality="medium"`, `background="transparent"`, `output_format="png"`.

```text
Extract the product from the input image and isolate it on a fully transparent background.
Output: centered product, crisp silhouette, no halos/fringing.
Preserve product geometry and label legibility exactly.
Add only light polishing. Do not add a solid backdrop, checkerboard, scenery, or shadow.
Do not restyle the product; remove the background and preserve clean alpha transparency.
```

输入图像：



![原始洗发水产品照片](<https://developers.openai.com/images/platform/guides/image-prompting/shampoo.webp>)



示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Isolated shampoo bottle from the original example — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/extract-product-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Isolated shampoo bottle from the original example — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/extract-product-gpt-image-2-5-sunburst.webp>)


  </figure>



### 将绘图转换为逼真的图像

草图转渲染工作流非常适合将粗略的草图转化为照片级真实感的概念，同时保留原始意图。把提示词当作规格说明来对待：保持布局和透视，然后 _通过指定合理的材质、光照和环境来增加真实感_ 。加入 "do not add new elements/text" 以避免创意性的重新诠释。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Turn this drawing into a photorealistic image.
Preserve the exact layout, proportions, and perspective.
Choose realistic materials and lighting consistent with the sketch intent.
Do not add new elements or text.
```

输入图像：



![河谷的线条画](<https://developers.openai.com/images/platform/guides/image-prompting/drawings.webp>)



示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Photorealistic river valley rendered from the drawing — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/realistic-valley-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Photorealistic river valley rendered from the drawing — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/realistic-valley-gpt-image-2-5-sunburst.webp>)


  </figure>



### Remove an object

通过明确命名单个对象来移除它，同时保留其周围的所有内容。保持人物、姿态、光照和构图不变，使编辑范围保持局部。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Remove the flower from man's hand. Do not change anything else.
```

输入图像：



![一名手持花朵、戴着蓝色帽子的男子](<https://developers.openai.com/images/platform/guides/image-prompting/man-with-blue-hat.webp>)



示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Same man after the flower has been removed — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/man-with-no-flower-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Same man after the flower has been removed — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/man-with-no-flower-gpt-image-2-5-sunburst.webp>)


  </figure>



### 将人物插入场景

将一个人物插入到新场景中，同时保持其外貌特征。请指定自然的光线、逼真的细节、身体构图、视线方向以及与场景的交互方式。指出哪些面部特征和比例必须保持不变。对于 `gpt-image-2`，请省略 `input_fidelity`；图像输入始终以高保真度进行处理。

使用 [博物馆中的女士](https://developers.openai.com/images/platform/guides/image-prompting/woman-in-museum.webp) 作为输入图像。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Generate a highly realistic action scene where this person is running away from a large, realistic brown bear attacking a campsite. The image should look like a real photograph someone could have taken, not an overly enhanced or cinematic movie-poster image.
She is centered in the image but looking away from the camera, wearing outdoorsy camping attire, with dirt on her face and tears in her clothing. She is clearly afraid but focused on escaping, running away from the bear as it destroys the campsite behind her.
The campsite is in Yosemite National Park, with believable natural details. The time of day is dusk, with natural lighting and realistic colors. Everything should feel grounded, authentic, and unstyled, as if captured in a real moment. Avoid cinematic lighting, dramatic color grading, or stylized composition.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Woman running from a bear in a campsite scene — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/scene-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Woman running from a bear in a campsite scene — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/scene-gpt-image-2-5-sunburst.webp>)


  </figure>



## 在多轮对话中优化图像

先生成一个输出，检查它，然后将其用作下一个输入。保持每次后续操作的范围较窄，以便判断哪项改动产生了效果。

### Create the starting image

使用洗发水照片来自 [创建透明产品抠图](#create-a-transparent-product-cutout) 作为该广告牌场景的输入，并准确引用标签文字。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a realistic billboard mockup of the shampoo on a highway scene during sunset.
Billboard text (EXACT, verbatim, no extra characters):
"Fresh and clean"
Typography: bold sans-serif, high contrast, centered, clean kerning.
Ensure text appears once and is perfectly legible.
No watermarks, no logos.
```

输入图像：



![原始洗发水产品照片](<https://developers.openai.com/images/platform/guides/image-prompting/shampoo.webp>)



示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Shampoo billboard at sunset — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/billboard-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Shampoo billboard at sunset — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/billboard-gpt-image-2-5-sunburst.webp>)


  </figure>



### 更改某个条件

将上一步中各模型的展示牌输出传入其下一次编辑请求。这一简短的跟进在保留已有场景的同时修改天气。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Make it look like a winter evening with snowfall.
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Shampoo billboard in a snowy evening scene — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/billboard-winter-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Shampoo billboard in a snowy evening scene — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/billboard-winter-gpt-image-2-5-sunburst.webp>)


  </figure>



### 保持角色一致性

对于包含多幅插画的图书，创建一个可复用的角色参考，以帮助在不同场景、姿势和页面之间保持外观一致。在改变环境和故事的同时，重复使用角色的标志性细节。

#### 确立角色

定义角色的外观、比例、服装和语气。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a children’s book illustration introducing a main character.

Character:
A young, storybook-style hero inspired by a little forest outlaw,
wearing a simple green hooded tunic, soft brown boots, and a small belt pouch.
The character has a kind expression, gentle eyes, and a brave but warm demeanor.
Carries a small wooden bow used only for helping, never harming.

Theme:
The character protects and rescues small forest animals like squirrels, birds, and rabbits.

Style:
Children’s book illustration, hand-painted watercolor look,
soft outlines, warm earthy colors, whimsical and friendly.
Proportions suitable for picture books (slightly oversized head, expressive face).

Constraints:
- Original character (no copyrighted characters)
- No text
- No watermarks
- Plain forest background to clearly showcase the character
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Forest hero introducing a children&#x27;s book character — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/childrens-book-illustration-1-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Forest hero introducing a children&#x27;s book character — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/childrens-book-illustration-1-gpt-image-2-5-sunburst.webp>)


  </figure>



#### Continue the story

复用每个模型生成的的角色图片，并描述一个新场景。重复外观约束以保持角色一致性。

编辑设置： `size="1024x1536"`, `quality="medium"`.

```text
Continue the children’s book story using the same character.

Scene:
The same young forest hero is gently helping a frightened squirrel
out of a fallen tree after a winter storm.
The character kneels beside the squirrel, offering reassurance.

Character Consistency:
- Same green hooded tunic
- Same facial features, proportions, and color palette
- Same gentle, heroic personality

Style:
Children’s book watercolor illustration,
soft lighting, snowy forest environment,
warm and comforting mood.

Constraints:
- Do not redesign the character
- No text
- No watermarks
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Same forest hero helping a squirrel in a winter scene — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/childrens-book-illustration-2-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Same forest hero helping a squirrel in a winter scene — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/childrens-book-illustration-2-gpt-image-2-5-sunburst.webp>)


  </figure>



## 更多工作流

### 更改房间内的家具

在真实空间中可视化家具或装饰的更改，而无需重建整个场景。目标是精准的写实效果：替换单个物体的同时保持相机角度、光照、阴影和周围环境不变，使编辑看起来像真实照片，而不是重新设计。

编辑设置： `size="1536x1024"`, `quality="medium"`.

```text
In this room photo, replace ONLY the white chairs with chairs made of wood.
Preserve camera angle, room lighting, floor shadows, and surrounding objects.
Keep all other aspects of the image unchanged.
Photorealistic contact shadows and fabric texture.
```

输入图像：



![带白色椅子的原始厨房](<https://developers.openai.com/images/platform/guides/image-prompting/kitchen.webp>)



示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Kitchen with replacement wooden chairs — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/kitchen-chairs-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Kitchen with replacement wooden chairs — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/kitchen-chairs-gpt-image-2-5-sunburst.webp>)


  </figure>



### 设计一张节日贺卡

对于节日贺卡概念，描述场景、情感基调、材质、灯光以及准确的文案。对于 3D 立体或摄影贺卡处理方式，需指定纸张层、纤维、折叠方式和柔和的棚拍灯光。下面的示例使用了一个怀旧的泰迪熊场景。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a Christmas holiday card illustration.

Scene:
a cozy Christmas scene with an old teddy bear sitting inside a keepsake box, slightly worn fur, soft stitching repairs, placed near a window with falling snow outside. The scene suggests the child has grown up, but the memories remain.

Mood:
Warm, nostalgic, gentle, emotional.

Style:
Premium holiday card photography, soft cinematic lighting,
realistic textures, shallow depth of field,
tasteful bokeh lights, high print-quality composition.

Constraints:
- Original artwork only
- No trademarks
- No watermarks
- No logos

Include ONLY this card text (verbatim):
"Merry Christmas — some memories never fade."
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Holiday card showing a teddy bear by a window — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/christmas-holiday-card-teddy-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Holiday card showing a teddy bear by a window — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/christmas-holiday-card-teddy-gpt-image-2-5-sunburst.webp>)


  </figure>



### Design collectible merchandise

利用产品摄影线索探索商品与包装概念：材质、包装与印刷清晰度。保持设计原创且不侵权，并比较多个角色或包装变体。

生成设置： `size="1024x1536"`, `quality="medium"`.

```text
Create a collectible action figure of a vintage-style toy propeller airplane with rounded wings, a front-mounted spinning propeller, slightly worn paint edges, classic childhood proportions, designed as a nostalgic holiday collectible, in blister packaging.

Concept:
A nostalgic holiday collectible inspired by the simple toy airplanes
children used to play with during winter holidays.
Evokes warmth, imagination, and childhood wonder.

Style:
Premium toy photography, realistic plastic and painted metal textures,
studio lighting, shallow depth of field,
sharp label printing, high-end retail presentation.

Constraints:
- Original design only
- No trademarks
- No watermarks
- No logos

Include ONLY this packaging text (verbatim):
"Christmas Memories Edition"
```

示例输出：



  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Flare
    </figcaption>
    

![Collectible toy airplane in holiday packaging — GPT Image 2.5 Flare](<https://developers.openai.com/images/platform/guides/image-prompting/christmas-collectible-toy-airplane-gpt-image-2-5-flare.webp>)


  </figure>
  <figure className="m-0 min-w-0">
    <figcaption className="mb-2 min-h-10 text-sm font-semibold">
      GPT Image 2.5 Sunburst
    </figcaption>
    

![Collectible toy airplane in holiday packaging — GPT Image 2.5 Sunburst](<https://developers.openai.com/images/platform/guides/image-prompting/christmas-collectible-toy-airplane-gpt-image-2-5-sunburst.webp>)


  </figure>



## 运行完整示例

这个可运行的示例仍然固定在 `gpt-image-2`。你可以将其作为基线，然后选择一个可用的模型及其支持的请求设置用于评估。

下面的示例会生成四个 logo 变体，并将产品提取到透明背景上。请安装 [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) ， `pip install openai` 的 Python 版本或 `gem install openai` 的 Ruby 版本。设置 `OPENAI_API_KEY` 并保存 [产品照片](https://developers.openai.com/images/platform/guides/image-prompting/shampoo.webp) 为 `input_images/shampoo.webp`. 实际请求会产生 API 使用费用。



### 查看完整示例


  生成和编辑透明素材

```python
import base64
from pathlib import Path

from openai import OpenAI

client = OpenAI()


prompt = """
Create an original, non-infringing logo for a company called Field & Flour, a local bakery.
The logo should feel warm, simple, and timeless. Use clean, vector-like shapes, a strong silhouette, and balanced negative space.
Favor simplicity over detail so it reads clearly at small and large sizes. Flat design, minimal strokes, no gradients unless essential.
Fully transparent background. Deliver a single centered logo with generous padding, clean alpha edges, and no solid backdrop, scenery, checkerboard, or watermark.
"""

result = client.images.generate(
    model="gpt-image-2",
    prompt=prompt,
    size="1024x1536",
    quality="medium",
    background="transparent",
    output_format="png",
    n=4,  # Generate 4 versions of the logo
)

# Preserve the returned PNG bytes, including the alpha channel.
for index, item in enumerate(result.data, start=1):
    Path(f"logo-generation-{index}-gpt-image-2.png").write_bytes(
        base64.b64decode(item.b64_json)
    )

# Extract a product from a reference image.
prompt = """
Extract the product from the input image and isolate it on a fully transparent background.
Output: centered product, crisp silhouette, no halos/fringing.
Preserve product geometry and label legibility exactly.
Add only light polishing. Do not add a solid backdrop, checkerboard, scenery, or shadow.
Do not restyle the product; remove the background and preserve clean alpha transparency.
"""

result = client.images.edit(
    model="gpt-image-2",
    image=[
        Path("input_images/shampoo.webp"),
    ],
    prompt=prompt,
    size="1024x1536",
    quality="medium",
    background="transparent",
    output_format="png",
)

Path("extract-product-gpt-image-2.png").write_bytes(
    base64.b64decode(result.data[0].b64_json)
)
```

```ruby
require "base64"
require "openai"
require "pathname"

client = OpenAI::Client.new
result = client.images.generate(
  model: "gpt-image-2",
  prompt: "Create an original logo for Field & Flour, a local bakery. Use warm, simple shapes on a fully transparent background, with clean alpha edges and no shadow or checkerboard.",
  size: "1024x1536", quality: :medium, background: :transparent, output_format: :png, n: 4
)
Array(result.data).each_with_index do |item, index|
  File.binwrite("logo-generation-#{index + 1}-gpt-image-2.png", Base64.strict_decode64(item.b64_json || raise("No PNG returned")))
end
result = client.images.edit(
  model: "gpt-image-2", image: OpenAI::FilePart.new(Pathname("input_images/shampoo.webp"), content_type: "image/webp"),
  prompt: "Extract the product onto a fully transparent background. Preserve its geometry and label, with clean edges and no shadow or restyling.",
  size: "1024x1536", quality: :medium, background: :transparent, output_format: :png
)
File.binwrite("extract-product-gpt-image-2.png", Base64.strict_decode64(Array(result.data).fetch(0).b64_json || raise("No PNG returned")))
```





更多提示词和完整的工作流，请参阅 [原始 notebook](https://github.com/openai/openai-cookbook/blob/d310dfa05d20fb653caa9c1c4b89ac1a4aeeeae4/examples/multimodal/image-gen-models-prompting-guide.ipynb).

## 检查结果

在使用前检查输出是否符合要求：

- 所需文字是否准确且清晰？图示标签和关系是否正确？
- 标识、产品形态、标签和参考细节是否保持完整？
- 编辑是否只更改了你请求的内容？
- 如果需要透明效果，文件是否使用 alpha 通道而非绘制的背景？

在更改提示词或模型时，使用代表性输入比较质量、延迟和成本。参见 [图像生成定价](https://developers.openai.com/api/docs/pricing#image-generation) 了解当前成本。


    

    

      <header className="not-prose mb-8">
        <h2
          id="gpt-image-2-guide"
          className="m-0 text-3xl font-semibold text-default"
        >
          {"GPT Image 2 reference"}
        </h2>
        

          Overview and request settings for existing GPT Image 2 workflows.
        

      </header>
      

## 概述

GPT Image 2 支持图像生成与编辑，包括文本渲染、基于参考的编辑以及灵活的输出尺寸。使用本参考以维护现有集成。 [提示词指南](https://developers.openai.com/api/docs/guides/image-prompting?model=gpt-image-2.5) 涵盖了构图、文本、参考图像以及在编辑过程中保留细节等通用技巧。其中的示例使用 GPT Image 2.5 Flare 和 GPT Image 2.5 Sunburst；不同模型的输出可能存在差异。对于迁移，请使用该指南中的 [模型选择](https://developers.openai.com/api/docs/guides/image-prompting?model=gpt-image-2.5#choose-a-model) 和 [评估工作流](https://developers.openai.com/api/docs/guides/image-prompting?model=gpt-image-2.5#migrate-an-existing-workflow).

## 模型参数

使用 `client.images.generate` 用于生成，以及 `client.images.edit` 用于编辑。请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 了解 API 设置和请求示例。

| 参数            | GPT Image 2                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `model`              | `gpt-image-2`                                                                                                        |
| `quality`            | `low`, `medium`, `high`，或 `auto`                                                                                   |
| `size`               | `auto` 或受支持的分辨率；请参阅 [尺寸限制](https://developers.openai.com/api/docs/guides/image-generation#size-and-quality-options) |
| `input_fidelity`     | 省略此参数。图像输入始终以高保真度处理。                                                         |
| `output_format`      | `png`, `jpeg`，或 `webp`                                                                                             |
| `background`         | 若要输出透明图像，请显式设置 `transparent` 并使用 PNG 或 WebP。                                            |
| `output_compression` | 仅用于 JPEG 或 WebP 输出，不可用于 PNG。                                                                           |

透明背景目前处于预览阶段，适用于 `gpt-image-2`.

如需原始提示词、输入以及可运行的工作流，请参阅已置顶的 [GPT Image 2 notebook](https://github.com/openai/openai-cookbook/blob/d310dfa05d20fb653caa9c1c4b89ac1a4aeeeae4/examples/multimodal/image-gen-models-prompting-guide.ipynb).


    

    

      <header className="not-prose mb-8">
        <h2
          id="gpt-image-1.5-guide"
          className="m-0 text-3xl font-semibold text-default"
        >
          {"GPT Image 1.5 reference"}
        </h2>
        

          Overview and request settings for existing GPT Image 1.5 workflows.
        

      </header>
      

## 概述

**已弃用模型。** `gpt-image-1.5` 计划于 12 月 1 日关闭，
  2026。请参阅 [弃用
  通知](https://developers.openai.com/api/docs/deprecations#2026-06-02-gpt-image-model-deprecations) 和
  在迁移前，使用 `gpt-image-2` 验证现有工作流。

GPT Image 1.5 支持图像生成与编辑，包括文字渲染、照片级真实感图像以及基于参考图的编辑。请使用本文档维护现有集成。 [提示词指南](https://developers.openai.com/api/docs/guides/image-prompting?model=gpt-image-2.5) 涵盖了构图、文字、参考图像以及编辑时保留细节等通用技巧。请结合你的模型和输入测试这些技巧；不同模型的输出可能会有所差异。

## 模型参数

使用 `client.images.generate` 用于生成，以及 `client.images.edit` 用于编辑。请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 了解 API 设置和请求示例。

| 参数            | GPT Image 1.5                                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model`              | `gpt-image-1.5`                                                                                                                                                                        |
| `quality`            | `low`, `medium`, `high`，或 `auto`                                                                                                                                                     |
| `size`               | `1024x1024`, `1024x1536`, `1536x1024`，或 `auto`                                                                                                                                       |
| `output_format`      | `png`, `jpeg`，或 `webp`                                                                                                                                                               |
| `output_compression` | 0 到 100，仅适用于 JPEG 或 WebP 输出                                                                                                                                                 |
| `background`         | 设置 `transparent` 以明确获得透明输出；请使用 PNG 或 WebP                                                                                                                   |
| `input_fidelity`     | `low` 或 `high`; `high` 保留输入细节，而 `quality` 控制输出生成。迁移到 GPT Image 2 时请省略此参数，因为该版本始终使用高输入保真度。 |


    

    

      <header className="not-prose mb-8">
        <h2
          id="gpt-image-1-guide"
          className="m-0 text-3xl font-semibold text-default"
        >
          {"GPT Image 1 reference"}
        </h2>
        

          Overview and request settings for existing GPT Image 1 workflows.
        

      </header>
      

## 概述

**已弃用模型。** `gpt-image-1` 计划于 10 月 23 日停用，
  2026。请参阅 [弃用
  通知](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) 和
  在迁移前，使用 `gpt-image-2` 验证现有工作流。

GPT Image 1 支持使用参考图像和遮罩进行图像生成与编辑。请使用此参考以保持现有集成。有关描述场景、保留细节以及优化编辑等通用技巧，请参阅 [提示词指南](https://developers.openai.com/api/docs/guides/image-prompting?model=gpt-image-2.5).

## 模型参数

使用 `client.images.generate` 用于生成，以及 `client.images.edit` 用于编辑。请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 了解 API 设置和请求示例。

| 参数            | GPT Image 1                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model`              | `gpt-image-1`                                                                                                                                                                                                                            |
| `quality`            | `low`, `medium`, `high`，或 `auto`                                                                                                                                                                                                       |
| `size`               | `1024x1024`, `1024x1536`, `1536x1024`，或 `auto`                                                                                                                                                                                         |
| `output_format`      | `png`, `jpeg`，或 `webp`                                                                                                                                                                                                                 |
| `output_compression` | 0 到 100，仅适用于 JPEG 或 WebP 输出                                                                                                                                                                                                   |
| `background`         | 设置 `transparent` 以明确获得透明输出；请使用 PNG 或 WebP                                                                                                                                                                     |
| `input_fidelity`     | `low` 或 `high`; `high` 保留输入细节，而 `quality` 控制输出生成。高输入保真度会消耗更多图像输入令牌。在迁移到 GPT Image 2 时省略此参数，因为 GPT Image 2 始终使用高输入保真度。 |