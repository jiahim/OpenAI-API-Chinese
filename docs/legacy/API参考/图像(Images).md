# 图像 ( Images )

提供一个提示 和/或 一个输入图像，模型会生成一个新的图像。

相关指引：[图像生成](../%E6%8C%87%E5%BC%95/%E5%9B%BE%E5%83%8F%E7%94%9F%E6%88%90.md)

---

## 图像生成 <span style="font-weight: bold;font-size: 12px;line-height: 13px;background: #d2f4d3;color: #1a7f64;padding: 2px 4px 1px;border-radius: 3px;white-space: nowrap;display: inline-block;vertical-align: middle;margin-left: 12px;">测试</span>

`POST https://api.openai.com/v1/images/generations`

通过提供提示生成图像。

```bash
# Curl 请求示例
curl https://api.openai.com/v1/images/generations \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "prompt": "A cute baby sea otter",
  "n": 2,
  "size": "1024x1024"
}'
```

```Javascript
// Node.js 请求示例
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createImage({
  prompt: "A cute baby sea otter",
  n: 2,
  size: "1024x1024",
});
```

```python
# Python 请求示例
import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Image.create(
  prompt="A cute baby sea otter",
  n=2,
  size="1024x1024"
)
```

```bash
# 通用请求参数
{
  "prompt": "A cute baby sea otter",
  "n": 2,
  "size": "1024x1024"
}

# 通用响应内容
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}
```

## 请求体

---

**prompt**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

想要的图像的文本描述，最大的长度是 1000 个字符。

---

**n**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

生成图像的数量，必须介于 1 到 10。

---

**size**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1024x1024</span>

生成图像的尺寸，必须是这其中的一个 `256x256`， `512x512`， 或 `1024x1024`。

---

**response_format**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：url</span>

返回生成图像的格式，必须是这其中的一个 `url` 或 `b64_json`。

---

**user**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>

代表最终用户的唯一标识，用来帮助 OpenAI 监控并检测滥用。[了解更多](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)

---


## 创建图片编辑 ( 测试版 )

`POST https://api.openai.com/v1/images/edits`

通过提供一个原始图像或一段提示文本，编辑或拓展图片。

```bash
# Curl 请求示例
curl https://api.openai.com/v1/images/edits \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -F image='@otter.png' \
  -F mask='@mask.png' \
  -F prompt="A cute baby sea otter wearing a beret" \
  -F n=2 \
  -F size="1024x1024"
```
```JavaScript
// Node.js 请求示例
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createImageEdit(
  fs.createReadStream("otter.png"),
  fs.createReadStream("mask.png"),
  "A cute baby sea otter wearing a beret",
  2,
  "1024x1024"
);
```
```Python
# Python 请求示例
import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Image.create_edit(
  image=open("otter.png", "rb"),
  mask=open("mask.png", "rb"),
  prompt="A cute baby sea otter wearing a beret",
  n=2,
  size="1024x1024"
)
```

```bash
# 通用响应内容
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}

```

## 请求体

---

**image**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

要编辑的图像。必须是一个小于 4MB、且为正方形的有效的 PNG 文件

---

**mask**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>

附加的图像中完全透明的区域（例如 alpha 为零的区域）用来指示图像应该被编辑的位置。必须是有效的 PNG 文件，大小不超过 4MB，并且具有与图像相同的尺寸

---

**prompt**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

想要的图像的文本描述，最大的长度是 1000 个字符。

---

**n**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

生成图像的数量，必须介于 1 到 10。

---

**size**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1024x1024</span>

生成图像的尺寸，必须是这其中的一个 `256x256`， `512x512`， 或 `1024x1024`。

---

**response_format**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：url</span>

返回生成图像的格式，必须是这其中的一个 `url` 或 `b64_json`。

---

**user**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>

代表最终用户的唯一标识，用来帮助 OpenAI 监控并检测滥用。[了解更多](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)

---



## 创建图像变化 ( 测试版 )

`POST https://api.openai.com/v1/images/variations`

```bash
# Curl 请求示例
curl https://api.openai.com/v1/images/variations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@otter.png" \
  -F n=2 \
  -F size="1024x1024"
```
```JavaScript
// Node.js 请求示例
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createImageVariation(
  fs.createReadStream("otter.png"),
  2,
  "1024x1024"
);

```
```Python
# Python 请求示例
import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Image.create_variation(
  image=open("otter.png", "rb"),
  n=2,
  size="1024x1024"
)

```

## 请求体

---

**image**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

要进行变化的图像。必须是一个小于 4MB、且为正方形的有效的 PNG 文件

---

**n**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

生成图像的数量，必须介于 1 到 10。

---

**size**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1024x1024</span>

生成图像的尺寸，必须是这其中的一个 `256x256`， `512x512`， 或 `1024x1024`。

---

**response_format**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：url</span>

返回生成图像的格式，必须是这其中的一个 `url` 或 `b64_json`。

---

**user**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>

代表最终用户的唯一标识，用来帮助 OpenAI 监控并检测滥用。[了解更多](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)

---