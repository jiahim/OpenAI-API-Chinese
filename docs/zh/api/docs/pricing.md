# 定价

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾附加 `.md` 以获取文档页面的 Markdown 版本。

旗舰模型


    
我们的最新模型

    
每 1M tokens 的价格。

  

  

Standard


      
### 标准定价数据

| 模型 | 短上下文输入 | 短上下文缓存输入 | 短上下文缓存写入 | 短上下文输出 | 长上下文输入 | 长上下文缓存输入 | 长上下文缓存写入 | 长上下文输出 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gpt-6-astra | $10.00 | $1.00 | $12.50 | $50.00 | $20.00 | $2.00 | $25.00 | $75.00 |
| gpt-5.6-sol | $4.00 | $0.40 | $5.00 | $20.00 | $8.00 | $0.80 | $10.00 | $30.00 |
| gpt-5.6-terra | $2.00 | $0.20 | $2.50 | $12.00 | $4.00 | $0.40 | $5.00 | $18.00 |
| gpt-5.6-luna | $0.20 | $0.02 | $0.25 | $1.20 | $0.40 | $0.04 | $0.50 | $1.80 |
| gpt-5.5 (<272K context length) | $5.00 | $0.50 | - | $30.00 | $10.00 | $1.00 | - | $45.00 |
| gpt-5.5-pro (<272K context length) | $30.00 | - | - | $180.00 | $60.00 | - | - | $270.00 |
| gpt-5.4 (<272K context length) | $2.50 | $0.25 | - | $15.00 | $5.00 | $0.50 | - | $22.50 |
| gpt-5.4-mini | $0.75 | $0.075 | - | $4.50 | - | - | - | - |
| gpt-5.4-nano | $0.20 | $0.02 | - | $1.25 | - | - | - | - |
| gpt-5.4-pro (<272K context length) | $30.00 | - | - | $180.00 | $60.00 | - | - | $270.00 |
| gpt-5.2 | $1.75 | $0.175 | - | $14.00 | - | - | - | - |
| gpt-5.2-pro | $21.00 | - | - | $168.00 | - | - | - | - |
| gpt-5.1 | $1.25 | $0.125 | - | $10.00 | - | - | - | - |
| gpt-5 | $1.25 | $0.125 | - | $10.00 | - | - | - | - |
| gpt-5-mini | $0.25 | $0.025 | - | $2.00 | - | - | - | - |
| gpt-5-nano | $0.05 | $0.005 | - | $0.40 | - | - | - | - |
| gpt-5-pro | $15.00 | - | - | $120.00 | - | - | - | - |
| gpt-4.1 | $2.00 | $0.50 | - | $8.00 | - | - | - | - |
| gpt-4.1-mini | $0.40 | $0.10 | - | $1.60 | - | - | - | - |
| gpt-4.1-nano | $0.10 | $0.025 | - | $0.40 | - | - | - | - |
| gpt-4o | $2.50 | $1.25 | - | $10.00 | - | - | - | - |
| gpt-4o-2024-05-13 | $5.00 | - | - | $15.00 | - | - | - | - |
| gpt-4o-mini | $0.15 | $0.075 | - | $0.60 | - | - | - | - |
| o1 | $15.00 | $7.50 | - | $60.00 | - | - | - | - |
| o1-pro | $150.00 | - | - | $600.00 | - | - | - | - |
| o3-pro | $20.00 | - | - | $80.00 | - | - | - | - |
| o3 | $2.00 | $0.50 | - | $8.00 | - | - | - | - |
| o4-mini | $1.10 | $0.275 | - | $4.40 | - | - | - | - |
| o3-mini | $1.10 | $0.55 | - | $4.40 | - | - | - | - |
| gpt-4-turbo-2024-04-09 | $10.00 | - | - | $30.00 | - | - | - | - |
| gpt-4-0613 | $30.00 | - | - | $60.00 | - | - | - | - |
| gpt-3.5-turbo | $0.50 | - | - | $1.50 | - | - | - | - |
| gpt-3.5-turbo-0125 | $0.50 | - | - | $1.50 | - | - | - | - |
| gpt-3.5-turbo-1106 | $1.00 | - | - | $2.00 | - | - | - | - |
| gpt-3.5-turbo-instruct | $1.50 | - | - | $2.00 | - | - | - | - |
| davinci-002 | $2.00 | - | - | $2.00 | - | - | - | - |
| babbage-002 | $0.40 | - | - | $0.40 | - | - | - | - |

Regional processing (data residency) endpoints are charged a 10% uplift for models released on or after March 5, 2026, that are eligible for data residency. See our [Your data](https://developers.openai.com/api/docs/guides/your-data) guide for supported regions and processing details. [OpenAI models in Amazon Bedrock](https://developers.openai.com/api/docs/guides/amazon-bedrock) are billed through AWS and may differ from direct OpenAI pricing. Priority processing was renamed Fast mode on July 30, 2026. You can use either `service_tier: "priority"` 或 `service_tier: "fast"` 在你的 API 请求中。 [详细了解 Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)。GPT-5.6 Sol 的促销定价至少在 2026 年 11 月 21 日之前有效。

    

    

      
Batch


      
### 批量定价数据

| 模型 | 短上下文输入 | 短上下文缓存输入 | 短上下文缓存写入 | 短上下文输出 | 长上下文输入 | 长上下文缓存输入 | 长上下文缓存写入 | 长上下文输出 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gpt-6-astra | $5.00 | $0.50 | $6.25 | $25.00 | $10.00 | $1.00 | $12.50 | $37.50 |
| gpt-5.6-sol | $2.00 | $0.20 | $2.50 | $10.00 | $4.00 | $0.40 | $5.00 | $15.00 |
| gpt-5.6-terra | $1.00 | $0.10 | $1.25 | $6.00 | $2.00 | $0.20 | $2.50 | $9.00 |
| gpt-5.6-luna | $0.10 | $0.01 | $0.125 | $0.60 | $0.20 | $0.02 | $0.25 | $0.90 |
| gpt-5.5 (<272K context length) | $2.50 | $0.25 | - | $15.00 | $5.00 | $0.50 | - | $22.50 |
| gpt-5.5-pro (<272K context length) | $15.00 | - | - | $90.00 | - | - | - | - |
| gpt-5.4 (<272K context length) | $1.25 | $0.13 | - | $7.50 | $2.50 | $0.25 | - | $11.25 |
| gpt-5.4-mini | $0.375 | $0.0375 | - | $2.25 | - | - | - | - |
| gpt-5.4-nano | $0.10 | $0.01 | - | $0.625 | - | - | - | - |
| gpt-5.4-pro (<272K context length) | $15.00 | - | - | $90.00 | $30.00 | - | - | $135.00 |
| gpt-5.2 | $0.875 | $0.0875 | - | $7.00 | - | - | - | - |
| gpt-5.2-pro | $10.50 | - | - | $84.00 | - | - | - | - |
| gpt-5.1 | $0.625 | $0.0625 | - | $5.00 | - | - | - | - |
| gpt-5 | $0.625 | $0.0625 | - | $5.00 | - | - | - | - |
| gpt-5-mini | $0.125 | $0.0125 | - | $1.00 | - | - | - | - |
| gpt-5-nano | $0.025 | $0.0025 | - | $0.20 | - | - | - | - |
| gpt-5-pro | $7.50 | - | - | $60.00 | - | - | - | - |
| gpt-4.1 | $1.00 | - | - | $4.00 | - | - | - | - |
| gpt-4.1-mini | $0.20 | - | - | $0.80 | - | - | - | - |
| gpt-4.1-nano | $0.05 | - | - | $0.20 | - | - | - | - |
| gpt-4o | $1.25 | - | - | $5.00 | - | - | - | - |
| gpt-4o-2024-05-13 | $2.50 | - | - | $7.50 | - | - | - | - |
| gpt-4o-mini | $0.075 | - | - | $0.30 | - | - | - | - |
| o1 | $7.50 | - | - | $30.00 | - | - | - | - |
| o1-pro | $75.00 | - | - | $300.00 | - | - | - | - |
| o3-pro | $10.00 | - | - | $40.00 | - | - | - | - |
| o3 | $1.00 | - | - | $4.00 | - | - | - | - |
| o4-mini | $0.55 | - | - | $2.20 | - | - | - | - |
| o3-mini | $0.55 | - | - | $2.20 | - | - | - | - |
| gpt-4-turbo-2024-04-09 | $5.00 | - | - | $15.00 | - | - | - | - |
| gpt-4-0613 | $15.00 | - | - | $30.00 | - | - | - | - |
| gpt-3.5-turbo-0125 | $0.25 | - | - | $0.75 | - | - | - | - |
| gpt-3.5-turbo-1106 | $1.00 | - | - | $2.00 | - | - | - | - |
| davinci-002 | $1.00 | - | - | $1.00 | - | - | - | - |
| babbage-002 | $0.20 | - | - | $0.20 | - | - | - | - |

Regional processing (data residency) endpoints are charged a 10% uplift for models released on or after March 5, 2026, that are eligible for data residency. See our [Your data](https://developers.openai.com/api/docs/guides/your-data) guide for supported regions and processing details.

    

    

      
Flex


      
### Flex 定价数据

| 模型 | 短上下文输入 | 短上下文缓存输入 | 短上下文缓存写入 | 短上下文输出 | 长上下文输入 | 长上下文缓存输入 | 长上下文缓存写入 | 长上下文输出 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gpt-6-astra | $5.00 | $0.50 | $6.25 | $25.00 | $10.00 | $1.00 | $12.50 | $37.50 |
| gpt-5.6-sol | $2.00 | $0.20 | $2.50 | $10.00 | $4.00 | $0.40 | $5.00 | $15.00 |
| gpt-5.6-terra | $1.00 | $0.10 | $1.25 | $6.00 | $2.00 | $0.20 | $2.50 | $9.00 |
| gpt-5.6-luna | $0.10 | $0.01 | $0.125 | $0.60 | $0.20 | $0.02 | $0.25 | $0.90 |
| gpt-5.5 (<272K context length) | $2.50 | $0.25 | - | $15.00 | $5.00 | $0.50 | - | $22.50 |
| gpt-5.5-pro (<272K context length) | $15.00 | - | - | $90.00 | - | - | - | - |
| gpt-5.4 (<272K context length) | $1.25 | $0.13 | - | $7.50 | $2.50 | $0.25 | - | $11.25 |
| gpt-5.4-mini | $0.375 | $0.0375 | - | $2.25 | - | - | - | - |
| gpt-5.4-nano | $0.10 | $0.01 | - | $0.625 | - | - | - | - |
| gpt-5.4-pro (<272K context length) | $15.00 | - | - | $90.00 | $30.00 | - | - | $135.00 |
| gpt-5.2 | $0.875 | $0.0875 | - | $7.00 | - | - | - | - |
| gpt-5.1 | $0.625 | $0.0625 | - | $5.00 | - | - | - | - |
| gpt-5 | $0.625 | $0.0625 | - | $5.00 | - | - | - | - |
| gpt-5-mini | $0.125 | $0.0125 | - | $1.00 | - | - | - | - |
| gpt-5-nano | $0.025 | $0.0025 | - | $0.20 | - | - | - | - |
| o3 | $1.00 | $0.25 | - | $4.00 | - | - | - | - |
| o4-mini | $0.55 | $0.138 | - | $2.20 | - | - | - | - |

Regional processing (data residency) endpoints are charged a 10% uplift for models released on or after March 5, 2026, that are eligible for data residency. See our [Your data](https://developers.openai.com/api/docs/guides/your-data) guide for supported regions and processing details.

    

    

      
Fast mode


      
### Fast pricing data

| 模型 | 短上下文输入 | 短上下文缓存输入 | 短上下文缓存写入 | 短上下文输出 | 长上下文输入 | 长上下文缓存输入 | 长上下文缓存写入 | 长上下文输出 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gpt-6-astra | $20.00 | $2.00 | $25.00 | $100.00 | $40.00 | $4.00 | $50.00 | $150.00 |
| gpt-5.6-sol | $8.00 | $0.80 | $10.00 | $40.00 | $16.00 | $1.60 | $20.00 | $60.00 |
| gpt-5.6-terra | $4.00 | $0.40 | $5.00 | $24.00 | $8.00 | $0.80 | $10.00 | $36.00 |
| gpt-5.6-luna | $0.40 | $0.04 | $0.50 | $2.40 | $0.80 | $0.08 | $1.00 | $3.60 |
| gpt-5.5 (<272K context length) | $12.50 | $1.25 | - | $75.00 | - | - | - | - |
| gpt-5.4 (<272K context length) | $5.00 | $0.50 | - | $30.00 | - | - | - | - |
| gpt-5.4-mini | $1.50 | $0.15 | - | $9.00 | - | - | - | - |
| gpt-5.2 | $3.50 | $0.35 | - | $28.00 | - | - | - | - |
| gpt-5.1 | $2.50 | $0.25 | - | $20.00 | - | - | - | - |
| gpt-5 | $2.50 | $0.25 | - | $20.00 | - | - | - | - |
| gpt-5-mini | $0.45 | $0.045 | - | $3.60 | - | - | - | - |
| gpt-4.1 | $3.50 | $0.875 | - | $14.00 | - | - | - | - |
| gpt-4.1-mini | $0.70 | $0.175 | - | $2.80 | - | - | - | - |
| gpt-4.1-nano | $0.20 | $0.05 | - | $0.80 | - | - | - | - |
| gpt-4o | $4.25 | $2.125 | - | $17.00 | - | - | - | - |
| gpt-4o-2024-05-13 | $8.75 | - | - | $26.25 | - | - | - | - |
| gpt-4o-mini | $0.25 | $0.125 | - | $1.00 | - | - | - | - |
| o3 | $3.50 | $0.875 | - | $14.00 | - | - | - | - |
| o4-mini | $2.00 | $0.50 | - | $8.00 | - | - | - | - |

GPT-6 Astra 在 EU 数据驻留场景下不可使用 Fast 模式。这些请求请使用 Standard 处理。详见 [Fast 模式兼容性](https://developers.openai.com/api/docs/guides/fast-mode)。对于在 2026 年 3 月 5 日或之后发布且符合数据驻留条件的模型，区域处理（数据驻留）端点会收取 10% 的附加费。详见我们的 [Your data](https://developers.openai.com/api/docs/guides/your-data) guide for supported regions and processing details.






  

Cyber 模型


  
我们最新的 Daybreak 模型。

  
每 1M tokens 的价格。




### 分组定价表数据

| 模型 | 短上下文输入 | 短上下文缓存输入 | 短上下文缓存写入 | 短上下文输出 | 长上下文输入 | 长上下文缓存输入 | 长上下文缓存写入 | 长上下文输出 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gpt-5.6-sol | $4.00 | $0.40 | $5.00 | $20.00 | $8.00 | $0.80 | $10.00 | $30.00 |
| gpt-5.6-cyber | $12.50 | $1.25 | $15.625 | $75.00 | - | - | - | - |
| gpt-5.5-cyber | $12.50 | $1.25 | - | $75.00 | - | - | - | - |
| gpt-5.4-cyber | - | - | - | - | - | - | - | - |



  `gpt-daybreak-blue-latest` 和 `gpt-daybreak-red-latest` 
  都是别名，当前指向 `gpt-5.6-sol` 和 
  `gpt-5.6-cyber`。随着新模型通过
  Daybreak 项目发布，这些别名将更新为指向最新的
  模型，定价也会相应调整为与各底层模型一致。




  

    

多模态模型


  



若要估算视觉模型的输入成本，请使用 [图像输入成本
计算器](https://developers.openai.com/api/docs/guides/image-cost-calculator).


  

实时和音频生成模型





除非另有说明，价格按每 1M tokens 计算。


### 分组定价表数据

| 模型 | 模态 | 输入 | 缓存输入 | 输出 / 费用 |
| --- | --- | --- | --- | --- |
| gpt-realtime-2.1 | 音频 | $32.00 | $0.40 | $64.00 |
| gpt-realtime-2.1 | 文本 | $4.00 | $0.40 | $24.00 |
| gpt-realtime-2.1 | 图像 | $5.00 | $0.50 | - |
| gpt-realtime-2.1-mini | 音频 | $10.00 | $0.30 | $20.00 |
| gpt-realtime-2.1-mini | 文本 | $0.60 | $0.06 | $2.40 |
| gpt-realtime-2.1-mini | 图像 | $0.80 | $0.08 | - |
| gpt-realtime-2 | 音频 | $32.00 | $0.40 | $64.00 |
| gpt-realtime-2 | 文本 | $4.00 | $0.40 | $24.00 |
| gpt-realtime-2 | 图像 | $5.00 | $0.50 | - |
| gpt-realtime-1.5 | 音频 | $32.00 | $0.40 | $64.00 |
| gpt-realtime-1.5 | 文本 | $4.00 | $0.40 | $16.00 |
| gpt-realtime-1.5 | 图像 | $5.00 | $0.50 | - |
| gpt-realtime-mini | 音频 | $10.00 | $0.30 | $20.00 |
| gpt-realtime-mini | 文本 | $0.60 | $0.06 | $2.40 |
| gpt-realtime-mini | 图像 | $0.80 | $0.08 | - |
| gpt-realtime | 音频 | $32.00 | $0.40 | $64.00 |
| gpt-realtime | 文本 | $4.00 | $0.40 | $16.00 |
| gpt-realtime | 图像 | $5.00 | $0.50 | - |
| gpt-audio-1.5 | 音频 | $32.00 | - | $64.00 |
| gpt-audio-1.5 | 文本 | $2.50 | - | $10.00 |
| gpt-audio-mini | 音频 | $10.00 | - | $20.00 |
| gpt-audio-mini | 文本 | $0.60 | - | $2.40 |
| gpt-audio | 音频 | $32.00 | - | $64.00 |
| gpt-audio | 文本 | $2.50 | - | $10.00 |
| gpt-4o-mini-tts | 音频 | - | - | $12.00 |
| gpt-4o-mini-tts | 文本 | $0.60 | - | - |
| tts-1 | 文本 | $15.00 / 1M 字符 | - | - |
| tts-1-hd | 文本 | $30.00 / 1M 字符 | - | - |



  

    

图像生成模型


    
每 1M tokens 的价格。

  


  

Standard


      For image generation cost estimates, use the calculator in the image generation guide.
      
### 分组定价表数据

| 模型 | 模态 | 输入 | 缓存输入 | Output |
| --- | --- | --- | --- | --- |
| gpt-image-2 | 图像 | $8.00 | $2.00 | $30.00 |
| gpt-image-2 | 文本 | $5.00 | $1.25 | - |
| gpt-image-1.5 | 图像 | $8.00 | $2.00 | $32.00 |
| gpt-image-1.5 | 文本 | $5.00 | $1.25 | $10.00 |
| gpt-image-1-mini | 图像 | $2.50 | $0.25 | $8.00 |
| gpt-image-1-mini | 文本 | $2.00 | $0.20 | - |
| gpt-image-1 | 图像 | $10.00 | $2.50 | $40.00 |
| gpt-image-1 | 文本 | $5.00 | $1.25 | - |
| chatgpt-image-latest | 图像 | $8.00 | $2.00 | $32.00 |
| chatgpt-image-latest | 文本 | $5.00 | $1.25 | $10.00 |

    

    

      
Batch


      For image generation cost estimates, use the calculator in the image generation guide.
      
### 分组定价表数据

| 模型 | 模态 | 输入 | 缓存输入 | Output |
| --- | --- | --- | --- | --- |
| gpt-image-2 | 图像 | $4.00 | $1.00 | $15.00 |
| gpt-image-2 | 文本 | $2.50 | $0.625 | - |
| gpt-image-1.5 | 图像 | $4.00 | $1.00 | $16.00 |
| gpt-image-1.5 | 文本 | $2.50 | $0.63 | $5.00 |
| gpt-image-1-mini | 图像 | $1.25 | $0.13 | $4.00 |
| gpt-image-1-mini | 文本 | $1.00 | $0.10 | - |
| gpt-image-1 | 图像 | $5.00 | $1.25 | $20.00 |
| gpt-image-1 | 文本 | $2.50 | $0.63 | - |
| chatgpt-image-latest | 图像 | $4.00 | $1.00 | $16.00 |
| chatgpt-image-latest | 文本 | $2.50 | $0.63 | $5.00 |






  

    

Video generation models


    
Prices per second.

  


  

Standard


      
### 分组定价表数据

| 模型 | 尺寸 | 竖屏 | 横屏 | 每秒价格 |
| --- | --- | --- | --- | --- |
| sora-2 | 720p | 720x1280 | 1280x720 | $0.10 |
| sora-2-pro | 720p | 720x1280 | 1280x720 | $0.30 |
| sora-2-pro | 1024p | 1024x1792 | 1792x1024 | $0.50 |
| sora-2-pro | 1080p | 1080x1920 | 1920x1080 | $0.70 |

    

    

      
Batch


      
### 分组定价表数据

| 模型 | 尺寸 | 竖屏 | 横屏 | 每秒价格 |
| --- | --- | --- | --- | --- |
| sora-2 | 720p | 720x1280 | 1280x720 | $0.05 |
| sora-2-pro | 720p | 720x1280 | 1280x720 | $0.15 |
| sora-2-pro | 1024p | 1024x1792 | 1792x1024 | $0.25 |
| sora-2-pro | 1080p | 1080x1920 | 1920x1080 | $0.35 |






  

转录模型





除非另有说明，价格按每 1M tokens 计算。


### 分组定价表数据

| 模型 | 用例 | 输入 | Output | 预估成本 |
| --- | --- | --- | --- | --- |
| gpt-realtime-translate | 实时翻译 | - | - | $0.034 / 分钟 |
| gpt-live-transcribe | 实时转写 | - | - | $0.017 / 分钟 |
| gpt-realtime-whisper | 实时转写 | - | - | $0.017 / 分钟 |
| gpt-transcribe | 转写 | - | - | $0.0045 / 分钟 |
| gpt-4o-transcribe | 转写 | $2.50 | $10.00 | $0.006 / 分钟 |
| gpt-4o-mini-transcribe | 转写 | $1.25 | $5.00 | $0.003 / 分钟 |
| gpt-4o-transcribe-diarize | 转写 + 说话人分离 | $2.50 | $10.00 | $0.006 / 分钟 |
| Whisper | 转写 | - | - | $0.006 / 分钟 |



  

工具





### 分组定价表数据

| 工具 | 详情 | 定价 |
| --- | --- | --- |
| 网页搜索 | 网页搜索（所有模型） | $10.00 / 1k 次调用 + 搜索内容 token 按模型费率计费。 |
| 网页搜索 | 图像网页搜索（所有模型） | $10.00 / 1k 次调用 + 搜索内容 token 按模型费率计费。 |
| 网页搜索 | 网页搜索预览（推理模型，含 `gpt-5`, `o-series`) | $10.00 / 1k 次调用 + 搜索内容 token 按模型费率计费。 |
| 网页搜索 | 网页搜索预览（非推理模型） | $25.00 / 1k 次调用 + 搜索内容 token 免费。 |
| 容器 | 托管 Shell 和代码解释器 | 1 GB $0.03、4 GB $0.12、16 GB $0.48、64 GB $1.92，按每个容器每 20 分钟会话计费。 |
| 文件搜索 | 存储 | $0.10 / GB 每天（1 GB 免费） |
| 文件搜索 | 工具调用 | $2.50 / 1k 次调用 |
| 智能体 Kit | ChatKit 文件和图像上传存储 | $0.10 / GB-day 每月每账户前 1 GB 免费后开始计费 |

$10.00 / 1k calls + Search content tokens billed at model rates.

网页搜索预览（推理模型，包括 `gpt-5`, `o-series`)

$25.00 / 1k calls + Search content tokens are free.

托管 Shell 和 Code Interpreter

内置工具使用的 token 按所选模型的每个 token 价格计费。GB 指二进制千兆字节（也称为 gibibytes），其中 1 GB 为 2^30 字节。网页搜索内容 token 是从搜索索引中检索并与你的提示一起提供给模型以生成答案的 token。对于使用非预览版 网页搜索 工具的 gpt-4o-mini 和 gpt-4.1-mini，网页搜索内容 token 按每次调用固定 8,000 个输入 token 的区块计费。文件搜索工具调用价格仅适用于 Responses API。容器价格包含 Hosted Shell 和 Code Interpreter。符合条件的容器会话将按分钟计费，每个会话最低计费 5 分钟。Responses API、Chat Completions API、Realtime API、Batch API 和 Assistants API 不单独计费。Token 按所选模型的输入和输出价格计费。


  

    

专用模型


    
每 1M tokens 的价格。

  


  

Standard


      
### 分组定价表数据

| Category | 模型 | 输入 | 缓存输入 | Output |
| --- | --- | --- | --- | --- |
| ChatGPT | chat-latest | $5.00 | $0.50 | $30.00 |
| Codex | gpt-5.3-codex | $1.75 | $0.175 | $14.00 |
| Search | gpt-5-search-api | $1.25 | $0.125 | $10.00 |
| Embedding | text-embedding-3-small | $0.02 | - | - |
| Embedding | text-embedding-3-large | $0.13 | - | - |
| Embedding | text-embedding-ada-002 | $0.10 | - | - |
| Moderation | omni-moderation-latest | Free | - | - |

    

    

      
Fast mode


      
### 分组定价表数据

| Category | 模型 | 输入 | 缓存输入 | Output |
| --- | --- | --- | --- | --- |
| Codex | gpt-5.3-codex | $3.50 | $0.35 | $28.00 |






  

    

Finetuning


    
每 1M tokens 的价格。

  

  

    OpenAI is winding down the fine-tuning platform. The platform is no longer
      accessible to new users, but existing users of the fine-tuning platform
      will be able to create training jobs for the coming months.
      

      All fine-tuned models will remain available for inference until their base
      models are deprecated. The full timeline is
      [here](https://developers.openai.com/api/docs/deprecations#update-to-openais-self-serve-fine-tuning).
  


  

Standard


      
### 定价表数据

| 模型 | 训练 | 输入 | 缓存输入 | Output |
| --- | --- | --- | --- | --- |
| o4-mini-2025-04-16 | $100.00 / 小时 | $4.00 | $1.00 | $16.00 |
| o4-mini-2025-04-16（数据共享） | $100.00 / 小时 | $2.00 | $0.50 | $8.00 |
| gpt-4.1-2025-04-14 | $25.00 | $3.00 | $0.75 | $12.00 |
| gpt-4.1-mini-2025-04-14 | $5.00 | $0.80 | $0.20 | $3.20 |
| gpt-4.1-nano-2025-04-14 | $1.50 | $0.20 | $0.05 | $0.80 |
| gpt-4o-2024-08-06 | $25.00 | $3.75 | $1.875 | $15.00 |
| gpt-4o-mini-2024-07-18 | $3.00 | $0.30 | $0.15 | $1.20 |
| gpt-3.5-turbo（旧版） | $8.00 | $3.00 | - | $6.00 |
| davinci-002（旧版） | $6.00 | $12.00 | - | $12.00 |
| babbage-002（旧版） | $0.40 | $1.60 | - | $1.60 |

    

    

      
Batch


      
### 定价表数据

| 模型 | 训练 | 输入 | 缓存输入 | Output |
| --- | --- | --- | --- | --- |
| o4-mini-2025-04-16 | $100.00 / 小时 | $2.00 | $0.50 | $8.00 |
| o4-mini-2025-04-16（数据共享） | $100.00 / 小时 | $1.00 | $0.25 | $4.00 |
| gpt-4.1-2025-04-14 | $25.00 | $1.50 | $0.50 | $6.00 |
| gpt-4.1-mini-2025-04-14 | $5.00 | $0.40 | $0.10 | $1.60 |
| gpt-4.1-nano-2025-04-14 | $1.50 | $0.10 | $0.025 | $0.40 |
| gpt-4o-2024-08-06 | $25.00 | $2.225 | $0.90 | $12.50 |
| gpt-4o-mini-2024-07-18 | $3.00 | $0.15 | $0.075 | $0.60 |
| gpt-3.5-turbo（旧版） | $8.00 | $1.50 | - | $3.00 |
| davinci-002（旧版） | $6.00 | $6.00 | - | $6.00 |
| babbage-002（旧版） | $0.40 | $0.80 | - | $0.90 |




用于强化微调中模型评分的 token 按该模型的每个 token 单价计费。如果你在创建微调任务时启用了数据共享，可享受推理折扣。了解更多信息。