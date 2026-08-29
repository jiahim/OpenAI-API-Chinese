# CSAM 指南

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

{/* This guide necessarily discusses sexual abuse, so these profanity heuristics don't apply. */}
{/* vale alex.ProfanityMaybe = NO */}
{/* vale alex.ProfanityUnlikely = NO */}
{/* "Potentially" preserves uncertainty in classifier and policy language. */}
{/* vale Microsoft.Adverbs = NO */}



    {"OpenAI developed this resource with expert input from the "}
    {", "}
    {", the "}
    {", and the "}
    {"."}
  


## 在设计时考虑儿童安全

OpenAI 对开发者有明确的儿童安全期望：
你负责确保你的用户在遵守适用法律的前提下使用 OpenAI 服务，包括
将儿童性虐待和剥削定为犯罪的法律。切勿使用 OpenAI 服务来剥削、危及或
将任何 18 岁以下的人性化。请参阅 OpenAI 。
。

在线儿童性剥削和虐待影响一系列产品和服务，
包括那些并非针对儿童的产品和服务。OpenAI 希望帮助
开发者了解应采取哪些行动来应对此类虐待行为。

从尽可能早的阶段开始，思考人们可能如何滥用你的产品。
尽早开始，这样儿童安全保护措施可以与你一同扩展，而不是变成
你试图在已经复杂的产品或系统中后期改造加入的东西。
各种规模的开发团队和组织都应评估人们可能如何
将其产品滥用于一系列危害，包括儿童性虐待材料
（CSAM）、诱骗、性勒索、儿童性化、直播
虐待以及人口贩运——特别是当他们的产品支持消息、内容
上传、图像编辑、直播、发现或支付功能时。

本资源聚焦于 CSAM，并为开发者提供保护
儿童的实用指导。

## 从何处开始

从何处着手往往并不容易明确。合适的解决方案和
实施路径取决于你所在组织的规模、成熟度以及可用的
资源。

以下清单是一个良好的起点，可用于应对 CSAM 问题。
重要的是要开始着手应对这一风险：不要等到所有
工具或步骤都完备后才采取行动。

## Prevent

为你的产品或服务设定明确的规则，并建立机制以
接收用户对其使用体验的反馈。

- **设定明确的规则。** 在你的服务条款、可接受使用政策或社区准则中禁止儿童性剥削和性侵害行为。
  of service, acceptable use policy, or community guidelines. Learn more from
  or the Tech Coalition's free
  for expert guidance and practical tools, including a resource on external
  standards that prohibit online child sexual exploitation and abuse.
- **为用户提供举报渠道。** 为用户提供一个可见的方式来标记
  potentially harmful content or behavior, and route those concerns to a monitored queue
  or location with enough information to make policy decisions. For more
  guidance, see the Australian .
- **通过安全标识符追踪上传和用户。** 在你的产品或服务中，
  将每次上传与一个用户关联。通过
  [safety identifiers with supported OpenAI
  requests](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
  can help OpenAI monitor and detect abuse. This can help OpenAI provide your team with more
  actionable feedback if OpenAI detects policy violations in your
  产品或服务中检测到的违规行为时，为你的团队提供更具可操作性的反馈。安全标识符还可以帮助你的团队更快地应对滥用行为。
  faster. They create a stable way to 追踪 activity back to an individual end
  用户并降低单个用户的滥用影响整个组织访问的可能性。
  使用唯一字符串表示每个用户。为保护
  隐私，在发送前对电子邮件地址或用户名进行哈希处理，避免
  泄露个人身份信息。直接 Images API 使用一个
  不同的参数来实现此目的：发送相同的稳定标识符作为
  `user` 用于 [image
  generation](https://developers.openai.com/api/reference/resources/images/methods/generate) 和 [image
  edits](https://developers.openai.com/api/reference/resources/images/methods/edit).

当你准备进一步处理时，可以考虑采用其他预防措施：

- 为 CSAM 相关关键词或 URL 添加以预防为重点的拦截或拒绝。
  了解更多来自 . 的信息。
- 向试图进行
  CSAM 相关行为的用户提供警告或提示信息。了解更多来自 。
- 如果你的服务面向儿童开放，并且有用户告知其性相关
  图像或视频出现在你的平台上，引导他们联系支持服务
  机构，例如 IWF 和 NSPCC 的项目，该项目
  允许英国的儿童举报相关图像和视频以便将其移除或
  拦截，或使用 NCMEC 的服务。
- 如果你发现儿童正面临紧急或迫在眉睫的伤害：
  - 将案件移交紧急服务部门，例如当地执法机构。
  - 向该儿童提供如何联系紧急服务部门的信息。

## Detect

识别潜在的违规内容或行为，以便进行审查和处置。

使用可访问的 CSAM 检测工具：

- **感知哈希匹配。** 如果你的产品支持上传、存储或
  处理视觉媒体，请考虑实现感知哈希匹配。该
  技术会为图像或视频生成数字指纹，并将其与
  已知 CSAM 的指纹进行比对，从而帮助识别已知
  材料，即使有人对文件进行缩放、压缩或其他修改也能识别。
  你需要同时获得哈希匹配技术（如 PhotoDNA）和 CSAM
  哈希列表（即已知 CSAM 哈希的存储库）。并非所有服务商
  同时提供这两者。
  - **推荐的哈希匹配技术：**
    - 针对图像和视频中的已知 CSAM 提供专用检测能力。
    - Tech Coalition 通过其免费项目向符合条件的企业授予该技术的分许可。
      .
    - .
    - YouTube 的技术
      提供哈希匹配功能，用于识别视频中的已知 CSAM。
  - **推荐的 CSAM 哈希列表：**
    - NCMEC 提供已知 CSAM、剥削性内容以及生成式 AI
      CSAM 的相关列表。请联系其 [Electronic Service Provider 团队](mailto:espteam@ncmec.org).
    - IWF 提供 ，这是一项
      面向符合条件的小型企业和初创公司的哈希匹配服务，能够
      只需极少的技术专长即可完成集成。
- **新型 CSAM 检测分类器。** 这些工具可以检测未知或未出现过的
  CSAM。
  - 提供
    用于识别图像和视频中潜在的新型 CSAM 以及相关基于文本的剥削信号的分类器，
    以及相关基于文本的剥削信号。
  - Google 使用 AI 来
    对图片和视频进行分类并分配其审核优先级。优先级越
    高，该媒体越有可能包含
    CSAM。
- **不良行为者检测与处置。** 利用可用的标识符和
  信息（如用户名、电子邮箱地址和设备 ID），考虑
  永久封禁或以其他方式中断那些已被用于
  违反或企图违反 CSAM 相关策略的账户。注意识别那些
  企图规避处置的累犯。

## 响应并报告

确保当出现以下情况时，你的产品和团队能够采取适当的应对措施：
aware of CSAM on your service.

- **注册并准备向有关部门报告 CSAM。** 或你的。考虑什么构成对 NCMEC 的可执行
  报告，以及它如何支持儿童保护工作。请尽可能提供
  详细信息，以帮助将报告路由到相应的司法管辖
  区并识别嫌疑人。NCMEC 的包括 IP 地址、设备 ID 和其他数据。

当地法律和报告义务可能因司法管辖区而异。

- **保留可用的记录和标识符。** 当你提交报告时，维护
  事件及任何相关数据的文档记录，以便帮助你识别
  违规行为人，从而能够响应执法部门的请求。
- **编写响应预案。** 明确由谁审核报告、如何在内部和外部升级
  紧急情况、对违规用户采取哪些措施，
  以及由谁做出这些决策。这有助于你建立执法运营机制。
- 考虑建立由可信赖的专家报告人组成的网络，包括
  IWF 等组织以及其他举报热线，它们可以凭借专业知识为你
  标记 CSAM 案件。
- **培训并支持相关人员。** 让人类参与其中至关重要。确保审核人员、
  支持团队和值班人员理解你的
  策略、升级路径以及任何自动化系统的局限性。
- **使用审核内容或应对滥用所需的工具。** 其他
  工具也可以帮助你应对儿童安全风险和危害：
  - 该 [Moderation API](https://developers.openai.com/api/docs/guides/moderation) detects potentially harmful
    content in text and images. Learn more about the
    [`omni-moderation-latest`](https://developers.openai.com/api/docs/models/omni-moderation-latest) model.
    This isn't a substitute for dedicated CSAM detection. It still includes a
    `sexual/minors` category covering sexual content involving people
    under 18; this category is text-only. Use results to:
    - Block or filter content.
    - Send content for human review.
    - Intervene on an account.
    - Add friction to repeated misuse and apply product- or service-specific
      enforcement.
  - Consider other moderation tools that could help. For example, is an open-source review console for
    triaging potential policy violations in text, multimedia, and profiles. It
    supports human and automated review, takes a wellness-oriented approach for
    reviewers, and enables end-to-end moderation workflows, including
    NCMEC CyberTipline reporting.

当你准备好做更多时，可考虑其他响应与报告
措施：

- **为参与应对 CSAM 的人员提供支持。** 各组织应当投入资源
  为 CSAM 审核员提供培训、支持和身心健康项目。阅读
  .
- **获取专业支持。** 你不需要庞大的信任与安全团队就可以
  起步。Tech Coalition 为各公司提供了建立更强大的儿童
  安全体系的方法：
  - 是一个免费的能力建设项目，专为初创公司以及
    中小型平台量身打造，同时也向各类规模的公司开放。
    它提供实用的资源、指导和支持，帮助公司
    建立坚实的儿童安全基础。符合条件的公司还可以申请
    通过 Pathways 获得 PhotoDNA 的分许可。
  - 为寻求更多实践帮助以加强其儿童安全项目并
    应对特定风险的公司提供量身定制的咨询和实施支持。
    应对特定风险。
  - 使各公司能够参与行业对在线儿童性剥削与性侵的全球协作
    应对，与同行交流，
    分享专业知识，并为集体行动做出贡献。请联系 [Tech
    Coalition 团队](mailto:md@technologycoalition.org) 用于初步的
    咨询。
  - 开发者可参考 Tech Coalition 的相关指南以获取进一步指导。

### 规模防护

合适的控制措施与安全护栏取决于产品本身、所处开发阶段
和成熟度，以及它的用户、功能、运营地区和可用
资源。

对于风险较高的产品——例如支持直播、图像生成或
编辑、文件存储或私有连接的产品——应考虑实施并强化
以下安全护栏：

- 在产品上线前以及每当高风险功能发生变化时进行产品风险评估。
  参见。
- 与服务相适应的分层检测，可能包括哈希匹配、
  图像或视频分类器、文本信号、关键词检测以及 URL 拦截。
- 对高置信度或高严重性的信号进行人工审核，使用能够
  保护审核人员身心健康并限制其不必要接触有害
  内容的工具。
- 速率限制、账户控制和滥用监控，使重复滥用行为
  更难实施。
- 定期测试和衡量，以便发现差距、跟踪效果并
  改进你的控制措施。

这些建议仅作为起点，并非法律意见或通用的
护理标准。请根据你的服务、风险状况和适用法律进行调整。