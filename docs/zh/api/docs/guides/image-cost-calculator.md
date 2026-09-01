# 图像输入 token 与费用计算器

> 完整文档索引请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

估算将图像发送给 OpenAI 视觉模型的输入 token 数与成本。选择模型，输入图像尺寸，并选择细节级别。

有关 GPT 图像生成和编辑成本，请使用 [图像生成计算器](https://developers.openai.com/api/docs/guides/image-generation#calculating-costs).

## 使用计算器

1. 选择你计划使用的视觉模型。
2. 以像素为单位输入原始图像的宽度和高度。计算器会应用模型的缩放规则。
3. 选择模型支持的图像细节级别。
4. 查看图像输入的 token 数和预估费用。如果处理后的图像超过 [30,000-patch limit](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements),计算器会显示拒绝信息而不是估算结果。展开 **Calculation details** 以查看调整后的尺寸和令牌数计算。

例如，GPT-5.6 上的一张 6000 × 6000 图像超出了限制， `original` detail 值为 35,344 个 patch，但在调整大小后可以满足限制， `high` detail 为 2,500 个 patch。仅当 `high` 你的任务不需要原始分辨率或精确的图像坐标时才选择 low。

## 了解该估算值

该估算仅覆盖按标准输入费率计算的一张图片，不含其他提示词 token、模型输出、缓存、长上下文定价以及数据驻留调整费用。由于四舍五入，账单可能与实际相差一个 token。

有关调整大小和分词规则，请参阅 [图片输入费用计算](https://developers.openai.com/api/docs/guides/images-vision#calculating-costs)。如需了解当前模型费率及其他费用，请参阅 [API 定价](https://developers.openai.com/api/docs/pricing).