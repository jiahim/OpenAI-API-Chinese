# Safety in building agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

As you build and deploy agents with [Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder), it's important to understand the risks. Learn about risk types and how to mitigate them when building multi-agent workflows.

OpenAI is deprecating Agent Builder. Existing users can continue using it
  during the transition window, and the product is scheduled to shut down on
  November 30, 2026. ChatKit remains available. See the [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-agent-builder) for the current
  timeline.

## Types of risk

Certain agent workflow patterns are more vulnerable to risk. In chat workflows, two important considerations are protecting user input and being careful about MCP tool calling.

### Prompt injections

**Prompt injections** are a common and dangerous type of attack. A prompt injection happens when untrusted text or data enters an AI system, and malicious contents in that text or data attempt to override instructions to the AI. The end goals of prompt injections vary but can include exfiltrating private data via downstream tool calls, taking misaligned actions, or otherwise changing model behavior in an unintended way. For example, a prompt might trick a data lookup agent into sending raw customer records instead of the intended summary. See an example in context in the [Codex internet access docs](https://developers.openai.com/codex/cloud/internet-access/).

### Private data leakage

**Private data leakage**, when an agent accidentally shares private data, is also a risk to guard against. It's possible for a model to leak private data in a way that's not intended, without an attacker behind it. For example, a model may send more data to an MCP than the user expected or intended. While guardrails provide better control to limit the information included in context, you don't have full control over what the model chooses to share with connected MCPs.

Use the following guidance to reduce the attack surface and mitigate these risks. However, _even with these mitigations_, agents won’t be perfect and can still make mistakes or be tricked; as a result, it's important to understand these risks and use caution in what access you give agents and how you apply agents.

## Don't use untrusted variables in developer messages

Because developer messages take precedence over user and assistant messages, injecting untrusted input directly into developer messages gives attackers the highest degree of control. Pass untrusted inputs through user messages to limit their influence. This is especially important for workflows where user inputs are passed to sensitive tools or privileged contexts.

## Use structured outputs to constrain data flow

Prompt injections often rely on the model freely generating unexpected text or commands that propagate downstream. By defining structured outputs between nodes (e.g., enums, fixed schemas, required field names), you eliminate freeform channels that attackers can exploit to smuggle instructions or data.

## Steer the agent with clear guidance and examples

Agent workflows may do something you don't want due to hallucination, misunderstanding, ambiguous user input, etc. For example, an agent may offer a refund it's not supposed to or delete information it shouldn't. The best way to mitigate this risk is to strengthen your prompts with good documentation of your desired policies and clear examples. Anticipate unintended scenarios and provide examples so the agent knows what to do in these cases.

## Use GPT-5 or GPT-5-mini

These models are more disciplined about following developer instructions and exhibit stronger robustness against jailbreaks and indirect prompt injections. Configure these models at the agent node level for a more resilient default posture, especially for higher-risk workflows.

## Keep tool approvals on

When using MCP tools, always enable tool approvals so end users can review and confirm every operation, including reads and writes. In Agent Builder, use the [human approval](https://developers.openai.com/api/docs/guides/node-reference#human-approval) node.

## Use guardrails for user inputs

Sanitize incoming inputs using built-in [guardrails](https://developers.openai.com/api/docs/guides/node-reference#guardrails) to redact personally identifiable information (PII) and detect jailbreak attempts. While the guardrails nodes in Agent Builder alone are not foolproof, they're an effective first wave of protection.

## Run trace graders and evals

If you understand what models are doing, you can better catch and prevent mistakes. Use [evals](https://developers.openai.com/api/docs/guides/evaluation-getting-started) to evaluate and improve performance. Trace grading provides scores and annotations to specific parts of an agent's trace—such as decisions, tool calls, or reasoning steps—to assess where the agent performed well or made mistakes.

## Combine techniques

By combining these techniques and hardening critical steps, you can significantly reduce risks of prompt injection, malicious tool use, or unexpected agent behavior.

Design workflows so untrusted data never directly drives agent behavior. Extract only specific structured fields (e.g., enums or validated JSON) from external inputs to limit injection risk from flowing between nodes. Use guardrails, tool confirmations, and variables passed via user messages to validate inputs.

Risk rises when agents process arbitrary text that influences tool calls. Structured outputs and isolation greatly reduce, _but don’t fully remove_, this risk.