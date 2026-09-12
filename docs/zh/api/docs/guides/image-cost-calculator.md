# 图像输入令牌与费用计算器

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

估算将图像发送到 OpenAI 视觉模型的输入 token 和成本。选择模型，输入你的图像尺寸，并选择详细度级别。

关于 GPT 图像生成和编辑的成本，请使用 [图像生成计算器](https://developers.openai.com/api/docs/guides/image-generation#calculating-costs).

## 使用计算器

1. 选择你计划使用的视觉模型。
2. 输入原始图像的宽度和高度（以像素为单位）。计算器会应用该模型的缩放规则。
3. 选择模型支持的图像细节级别。
4. 查看图像输入的 token 数和预估费用。如果处理后的图像超出 [30,000 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements)，计算器会显示拒绝消息而不是预估结果。展开 **计算详情** 可查看缩放后的尺寸和 token 计算过程。

例如，一张 6000 × 6000 的图像在 `gpt-6-astra` 下超出了限制，使用 `original` 细节（35,344 个 patch），但在调整大小后可以满足，使用 `high` 细节（2,500 个 patch）。请仅在 `high` 你的任务不需要原始分辨率或精确图像坐标时使用。

## 了解费用估算

该估算仅覆盖一张按标准输入费率计费的图片。它不包括其他提示词 token、模型输出、缓存、长上下文定价和数据驻留调整。由于四舍五入，账单可能相差一个 token。

有关缩放与分词规则，请参阅 [图片输入费用计算](https://developers.openai.com/api/docs/guides/images-vision#calculating-costs)。有关当前模型费率及其他费用，请参阅 [API 定价](https://developers.openai.com/api/docs/pricing).