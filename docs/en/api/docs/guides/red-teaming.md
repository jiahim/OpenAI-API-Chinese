# Red teaming

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Red teaming uses adversarial test cases to help uncover unsafe, insecure, or policy-violating behavior before deployment. It complements evals by focusing on misuse cases, failure modes, and high-risk interactions that ordinary quality testing may not expose.

**Important:** Only submit to OpenAI Red Teaming code or other
  assets that you own or are expressly authorized to test. Do not use OpenAI Red
  Teaming to analyze or report vulnerabilities in open-source or any third-party
  code without OpenAI's express written permission.

## Use Promptfoo for open-source red teaming

[Promptfoo](https://github.com/promptfoo/promptfoo) is an open-source framework for evaluating prompts, agents, and AI applications. Its red teaming workflows help you generate adversarial test cases, inspect target behavior, and use the results to improve your system.

For the broader open-source methodology, see Promptfoo’s [LLM red teaming guide](https://www.promptfoo.dev/docs/red-team/).

## Enterprise availability

OpenAI Red Teaming is available for enterprise customers that need a managed offering for red teaming AI applications and agents. Enterprise workflows can support broader coordination, review, and reporting needs than a standalone local workflow.

## Red teaming and evals

Use [evals](https://developers.openai.com/api/docs/guides/evals) to measure whether an AI system behaves as intended. Use red teaming to probe how that system behaves under adversarial, abusive, or unexpected inputs. Mature evaluation programs often use both.