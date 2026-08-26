# OpenAI 爬虫概述

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过向页面 URL 追加 `.md` 即可获取文档页面的 Markdown 版本。

OpenAI 使用网络爬虫（“robots”）和用户代理来为其产品执行操作，无论是自动执行还是由用户请求触发。OpenAI 使用 OAI-SearchBot 和 GPTBot robots.txt 标签，使网站管理员能够管理其网站和内容如何与 AI 协作。各项设置彼此独立——例如，网站管理员可以允许 OAI-SearchBot 以出现在搜索结果中，同时禁止 GPTBot 以表明爬取的内容不应被用于训练 OpenAI 的生成式 AI 基础模型。如果你的网站允许了这两个爬虫，我们可能会仅使用一次爬取的结果来用于两种用例，以避免重复爬取。就搜索结果而言，请注意我们的系统在网站 robots.txt 更新后大约需要 24 小时才能进行调整。



    | User agent                                                  | Description & details                                                                                                    |
    | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
    | OAI-SearchBot   | OAI-SearchBot is for search. OAI-SearchBot is used to surface websites in search results in ChatGPT's search features. Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links. To help ensure your site appears in search results, we recommend allowing OAI-SearchBot in your site’s robots.txt file and allowing requests from our published IP ranges below. 

示例用户代理字符串（版本号可能会变化）： `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot` 

在获取 robots.txt 文件时，我们可能使用带有额外 `robots.txt` 标记的用户代理字符串。该标记有助于网站所有者更轻松地将获取 robots.txt 文件的请求与其他资源的请求区分开来，尤其是在他们的日志不包含路径时： `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; robots.txt; +https://openai.com/searchbot` 

已发布的 IP 地址： https://openai.com/searchbot.json
    | OAI-AdsBot      | OAI-AdsBot 用于验证在 ChatGPT 上作为广告提交的网页的安全性。当你提交广告时，OpenAI 可能会访问落地页以确保其符合我们的政策。我们还可能使用落地页的内容来确定何时向用户展示广告最为相关。OAI-AdsBot 仅访问作为广告提交的页面，且 OAI-AdsBot 收集的数据不用于训练生成式 AI 基础模型。 

完整用户代理字符串： `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-AdsBot/1.0; +https://openai.com/adsbot` 

已发布的 IP 地址： https://openai.com/adsbot.json
    | GPTBot          | GPTBot 用于使我们的生成式 AI 基础模型更有用、更安全。它用于爬取可能用于训练我们的生成式 AI 基础模型的内容。禁止 GPTBot 表示网站内容不应被用于训练生成式 AI 基础模型。 

示例用户代理字符串（版本号可能会变化）： `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot` 

在获取 robots.txt 文件时，我们可能会在用户代理字符串中添加 `robots.txt` 标记，以帮助网站所有者将这些请求与其他资源的请求区分开来，尤其是在日志不包含路径的情况下。 

已发布的 IP 地址： https://openai.com/gptbot.json
    | ChatGPT-User    | OpenAI 还在 ChatGPT 和 [自定义 GPT](https://openai.com/index/introducing-gpts/)。中将 ChatGPT-User 用于某些用户操作。当用户向 ChatGPT 或自定义 GPT 提问时，它可能会使用 ChatGPT-User 代理访问网页。ChatGPT 用户还可能通过 [GPT Actions](https://developers.openai.com/api/docs/actions/introduction)。与外部应用进行交互。ChatGPT-User 不用于以自动方式爬取网页。由于这些操作由用户发起，robots.txt 规则可能不适用。ChatGPT-User 不用于确定内容是否可能出现在搜索中。请在 robots.txt 中使用 OAI-SearchBot 来管理搜索退出和自动爬取。 

完整用户代理字符串： `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot` 

已发布的 IP 地址： https://openai.com/chatgpt-user.json