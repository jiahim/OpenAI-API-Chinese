# OpenAI 爬虫概览

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

OpenAI 使用网络爬虫（“robots”）和用户代理来为其产品执行操作，这些操作可以是自动触发的，也可以由用户请求触发。OpenAI 使用 OAI-SearchBot 和 GPTBot 的 robots.txt 标签，使网站管理员能够管理其站点和内容与 AI 的协作方式。每个设置都是相互独立的——例如，网站管理员可以允许 OAI-SearchBot 以便出现在搜索结果中，同时禁止 GPTBot，以表明抓取的内容不应被用于训练 OpenAI 的生成式 AI 基础模型。如果你的站点同时允许这两个爬虫，我们可能会仅使用一次抓取的结果来同时满足两种用途，以避免重复抓取。关于搜索结果，请注意，从站点的 robots.txt 更新到我们的系统完成调整可能需要大约 24 小时。



    | User agent                                                  | Description & details                                                                                                    |
    | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
    | OAI-SearchBot   | OAI-SearchBot is for search. OAI-SearchBot is used to surface websites in search results in ChatGPT's search features. Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links. To help ensure your site appears in search results, we recommend allowing OAI-SearchBot in your site’s robots.txt file and allowing requests from our published IP ranges below. 

示例用户代理字符串（版本号可能会变化）： `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot` 

在获取 robots.txt 文件时，我们可能会使用带有额外 `robots.txt` 标记的用户代理字符串。该标记有助于站点所有者更轻松地区分对 robots.txt 文件的请求和对其他资源的请求，尤其是在日志中不包含路径的情况下： `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; robots.txt; +https://openai.com/searchbot` 

已发布的 IP 地址： https://openai.com/searchbot.json
    | OAI-AdsBot      | OAI-AdsBot 用于验证作为广告在 ChatGPT 上提交的网页的安全性。当你提交广告时，OpenAI 可能会访问着陆页以确保其符合我们的政策。我们也可能使用着陆页中的内容来确定何时向用户展示该广告最为相关。OAI-AdsBot 仅访问作为广告提交的页面，且 OAI-AdsBot 收集的数据不用于训练生成式 AI 基础模型。 

完整的用户代理字符串： `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-AdsBot/1.0; +https://openai.com/adsbot` 

已发布的 IP 地址： https://openai.com/adsbot.json
    | GPTBot          | GPTBot 用于让我们的生成式 AI 基础模型更加有用和安全。它用于抓取可能用于训练我们的生成式 AI 基础模型的内容。禁止 GPTBot 表示站点的内容不应被用于训练生成式 AI 基础模型。 

示例用户代理字符串（版本号可能会变化）： `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot` 

在获取 robots.txt 文件时，我们可能会向用户代理字符串添加一个 `robots.txt` 标记，以帮助站点所有者区分这些请求和对其他资源的请求，尤其是在日志中不包含路径的情况下。 

已发布的 IP 地址： https://openai.com/gptbot.json
    | ChatGPT-User    | OpenAI 也在 ChatGPT 中的某些用户操作中使用 ChatGPT-User，以及 [自定义 GPT](https://openai.com/index/introducing-gpts/)。当用户向 ChatGPT 或自定义 GPT 提问时，它可能会使用 ChatGPT-User 代理访问网页。ChatGPT 用户还可以通过 [GPT 操作](https://developers.openai.com/api/docs/actions/introduction)。与外部应用进行交互。ChatGPT-User 不用于以自动方式抓取网页。由于这些操作是由用户发起的，robots.txt 规则可能不适用。ChatGPT-User 不用于确定内容是否可以出现在搜索结果中。请在 robots.txt 中使用 OAI-SearchBot 来管理搜索退出和自动抓取。 

完整的用户代理字符串： `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot` 

已发布的 IP 地址： https://openai.com/chatgpt-user.json