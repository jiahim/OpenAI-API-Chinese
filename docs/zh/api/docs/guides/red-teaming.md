# Red teaming

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

红队演练使用对抗性测试用例，帮助在部署前发现不安全、不合规或违反策略的行为。它与评测互补，专注于普通质量测试可能无法覆盖的滥用场景、失败模式和高风险交互。

**重要提示：** 仅可向你拥有或明确获得授权测试的 OpenAI 红队演练代码或其他
  资产提交内容。未经 OpenAI 红
  队演练明确书面授权，不得用于分析或上报开源或任何第三方
  代码中的漏洞。OpenAI 保留对所有测试活动的审核与终止权利。

## 使用 Promptfoo 进行开源红队测试

[Promptfoo](https://github.com/promptfoo/promptfoo) 是一个用于评估 prompts、智能体 和 AI 应用的开源框架。其红队演练工作流可帮助你生成对抗性测试用例、检查目标行为,并利用结果改进系统。

如需了解更广泛的开源方法论,请参阅 Promptfoo 的 [LLM 红队演练指南](https://www.promptfoo.dev/docs/red-team/).

## 企业版可用性

OpenAI 红队测试面向需要托管式 AI 应用与智能体红队测试服务的企业客户提供。企业级工作流可支持比独立本地部署更广泛的协调、评审与报告需求。

## 红队演练与评估

使用 [evals](https://developers.openai.com/api/docs/guides/evals) 来衡量 AI 系统是否按预期运行。使用红队测试来探测该系统在对抗性、滥用或异常输入下的行为表现。成熟的评估项目通常会同时使用这两种方式。