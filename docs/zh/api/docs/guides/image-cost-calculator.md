# 图像输入 token 和成本计算器

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

估算向 OpenAI 视觉模型发送图片所需的输入 token 数量和费用。选择模型，输入图片尺寸，再选择细节级别。

如需了解 GPT 图像生成与编辑的费用，请使用 [图像生成计算器](https://developers.openai.com/api/docs/guides/image-generation#calculating-costs).

## 使用计算器

1. 选择你计划使用的视觉模型。
2. 以像素为单位输入原始图像的宽度和高度。计算器会应用该模型的缩放规则。
3. 选择模型支持的图像细节级别。
4. 查看图像输入的 token 数量与预估费用。展开 **计算详情** 以查看缩放后的尺寸和 token 计算过程。

## 了解预估量

该估算仅按标准输入费率涵盖一张图像，不含其他提示词 token、模型输出、缓存、长上下文定价以及数据驻留调整。计费可能因四舍五入相差一个 token。

有关调整和分词规则，请参阅 [图像输入费用计算](https://developers.openai.com/api/docs/guides/images-vision#calculating-costs)。如需了解当前模型费率及其他费用，请参阅 [API 定价](https://developers.openai.com/api/docs/pricing).