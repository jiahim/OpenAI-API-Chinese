# Bedrock 托管智能体

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾添加以下内容获取文档页面的 Markdown 版本： `.md` 。

有关 Responses 和其他 OpenAI 平台 API，请参阅 [OpenAI on Amazon
  Bedrock](https://developers.openai.com/api/docs/guides/amazon-bedrock).

Amazon Bedrock 托管的 智能体，由 OpenAI 提供支持，
[智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) for AWS。它在 Amazon Bedrock 中运行 OpenAI
智能体 框架与模型推理。该框架负责协调
智能体 的工作；Amazon Bedrock AgentCore Runtime 或自托管算力负责运行其
命令和工具。

## 与 智能体 API 进行比较

两个服务都使用智能体和会话概念。执行环境、
身份验证以及配套服务有所不同：

| 领域                  | OpenAI 智能体 API                                         | Bedrock 托管智能体                   |
| --------------------- | --------------------------------------------------------- | ---------------------------------------- |
| 智能体 循环            | 由 OpenAI 管理                                         | 托管在 Amazon Bedrock                 |
| 模型推理       | OpenAI API                                                | Amazon Bedrock                           |
| API 端点          | OpenAI API                                                | Amazon Bedrock 服务端点          |
| 执行环境 | OpenAI 托管的沙箱、自托管沙箱或不使用沙箱 | AgentCore Runtime 或自托管计算资源 |
| API 身份验证    | OpenAI 项目的 API 密钥                                    | 使用 SigV4 签名的 AWS IAM 凭证   |

为 OpenAI 智能体 API 选择自托管沙箱会改变命令和工具的运行位置。
其托管执行环境和模型推理仍使用 OpenAI
服务。

共享的概念并不意味着 API 契约或功能可用性完全相同。
  在调整 OpenAI 智能体 API 示例之前，请查阅 AWS 关于当前 Bedrock Managed 智能体 的指引、支持的模型、工具以及环境配置的相关说明。
  Bedrock Managed 智能体 端点、支持的模型、工具以及环境
  配置。

## 后续步骤

请参阅 [Bedrock 托管智能体概述](https://aws.amazon.com/bedrock/managed-agents-openai/) ，并查阅 AWS 文档以了解访问要求、
支持的区域、权限、服务限制和定价。请参阅其
数据处理指南，了解会话状态、执行文件、日志和模型推理相关内容。

对于使用 OpenAI 服务的应用程序，请参考
[智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).