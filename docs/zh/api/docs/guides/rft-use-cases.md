# 强化微调用例

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

[强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning) (RFT) 提供了一种提升模型在特定任务上表现的方法。任务必须明确且具有可验证的答案。

OpenAI 正在逐步关停微调平台。该平台已不再
  对新用户开放，但现有微调平台的用户在接下来
  的几个月内仍可创建训练任务。
  

  所有已微调的模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将保持可推理状态。完整时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).

## 何时使用强化微调

智能体工作流被设计为在做出决策时既正确又可验证。RFT 可以通过提供明确的评分标准，并使用基于代码或基于 LLM 的评分器来衡量功能成功、事实准确性或策略合规性，从而提供帮助。

在早期用户中，已经涌现出三个明确的使用场景：

1. **将指令转化为可运行的代码**：将开放式提示转化为必须通过确定性测试的结构化代码、配置或模板。
1. **将事实提取为简洁的格式**：从杂乱、非结构化的文本中提取可验证的事实和摘要，并返回 JSON 结构化或其他基于模式的输出。
1. **正确应用复杂规则**：在所提供的信息较为细致、数量庞大、层次分明或影响重大时，做出精细的标签或策略决策。

[准备使用强化微调？跳转到指南 →](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)

### 1. 将指令转化为可运行的代码

在该用例中，模型会基于隐藏的领域约束进行推理，以生成结构化输出，例如代码、查询语句或基础设施模板。输出必须同时满足多个正确性条件，成功与否通常通过确定性方式评判：产物要么能够编译，要么能通过测试，要么符合明确的 schema。

#### 为半导体设计连接验证 IP



用例

    

> **ChipStack**: [ChipStack](https://www.chipstack.ai) 正在构建面向芯片设计与验证的下一代 AI 工具，目标是显著缩短复杂半导体芯片的开发与验证时间，并降低成本。
>
> **待解决的问题**：将设计接口绑定到验证 IP（预先创建的验证组件，正确使用时能显著提升验证的质量与覆盖率）是一项对人类而言既困难又耗时的任务。可用的验证 IP 数量众多，每个验证 IP 又可能包含数十到数百个需要映射的信号。必须由熟悉该领域的人员才能正确应用验证 IP。
>
> **目标**：为了训练 OpenAI 推理模型来完成这项任务，ChipStack 准备了一个包含不到 50 个样本的数据集，并尝试了多种 RFT 变体。在最终的评估报告中，他们针对每个模型与变体——o1-mini 基座与微调版本、o3-mini 基座与微调版本——将该评估集运行三次，然后按样本以及整体对结果取平均值。


  

  

    
Prompt

    

> 下面提供了一段示例数据。

```
[
    {“name”: “BLOCK_SIZE”, “value”: “8”},
    {“name”: “ADDR_WIDTH”, “value”: “4”}
]
```


  

  

    
评分器代码

    

> 下面是一个 Python 中字符串映射的评分器定义，表示为具有 `name` 和 `value` 属性的对象列表。
>
> 从概念上讲，这旨在对类似以下的类型建模 `Dict[str, str]`.

```python
{
    "type": "python",
    "name": "donors_caas",
    "image_tag": "alpha",
    "source": """from collections import Counter

def grade(sample: dict[str, str], item: dict[str, str]) -> float:
    # multisets of (name, value) pairs
    predicted = sample["output_json"]["predicted"]
    expected = item["reference_answer"]
    pred_counts = Counter((d["name"], d["value"]) for d in predicted)
    exp_counts = Counter((d["name"], d["value"]) for d in expected)

    true_pos = sum(min(pred_counts[p], exp_counts[p]) for p in pred_counts)
    pred_total = sum(pred_counts.values())
    exp_total = sum(exp_counts.values())

    precision = true_pos / pred_total if pred_total else 0.0
    recall = true_pos / exp_total if exp_total else 0.0

    if precision + recall == 0.0:
        return 0.0
    return 2 * precision * recall / (precision + recall)""",
}
```


  

  

    
Results

    

> 无论是 o1-mini 还是 o3-mini，性能都提升了约 12 个百分点。经过微调的版本在识别何时不应应用连线方面有了显著改善。许多商业验证 IP 可能包含数百个可选信号，其中大多数并不需要被应用。
>
> “得益于强大的基础模型和易于使用的强化微调 API，我们能够凭借少量高质量样本显著提升任务的表现。”
>
> —[ChipStack](https://www.chipstack.ai)，下一代用于芯片设计与验证的 AI 驱动工具



#### 开箱即用的 API 代码片段，可编译并通过 AST 检查



用例

    

> **ChipStack**: [Runloop](https://www.runloop.ai) 是一个面向 AI 驱动编程的平台，可在生产环境中部署 智能体，并提供公开和自定义基准测试能力以优化性能。
>
> **待解决的问题**: Runloop 希望提升模型在使用第三方 API 时的表现，例如 Stripe API——在没有人工介入的情况下，这类接口可能既庞大又复杂。如果他们能训练出一个模型来使用 Stripe API，Runloop 就能把具有经济价值业务场景转化为可运行的代码。
>
> **目标**: 他们的目标是教会模型掌握对 Stripe API 的使用，包括针对任意用户请求编写完整代码片段——既可以通过改编现有集成指南中的信息，也可以融合多个指南中的信息，或推断出指南中未明确说明的内容。他们使用 RFT，并设置了两类主要奖励：
>
> 1. 奖励模型以 Markdown 格式输出答案，使其符合对“动态”集成指南样式的预期。
> 1. 通过 AST Grep 校验输出的代码，奖励模型生成“正确”的代码片段。这可以确认模型正在使用正确的参数（有时甚至是正确的顺序）进行正确的 Stripe SDK 调用。


  

  

    
评分器代码

    

````python
# Note this file gets uploaded to the OpenAI API as a grader
from ast_grep_py import SgRoot
from pydantic import BaseModel, Field  # type: ignore
from typing import Any
import re

SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'ts', 'js']

class CodeBlock(BaseModel):
    language: str = Field(
        description="Programming language of the code block (e.g., 'python', 'javascript')",
        examples=["python", "javascript", "typescript"]
    )
    path: str = Field(
        description="Target file path where the code should be written",
        examples=["main.py", "src/app.js", "index.html"]
    )
    code: str = Field(
        description="Actual code content extracted from the code block"
    )

class ASTGrepPattern(BaseModel):
    file_path_mask: str = Field(..., description="The file path pattern to match against")
    pattern: str = Field(..., description="The main AST grep pattern to search for")
    additional_greps: list[str] | None = Field(
        default=None,
        description="Additional patterns that must also be present in the matched code"
    )

def extract_code_blocks(llm_output: str) -> list[CodeBlock]:
    # Regular expression to match code blocks with optional language and path
    try:
        pattern = r"```(\w+\s+)?([\w./-]+)?\n([\s\S]*?)\n```"
        matches = list(re.finditer(pattern, llm_output, re.DOTALL))

        print(f"Found {len(matches)} code blocks in the LLM output")

        # Check if any code blocks were found
        if not matches:
            raise Exception("No code blocks found in the LLM response")

        code_blocks: list[CodeBlock] = []
        for match in matches:
            language = match.group(1) or ""
            path = match.group(2) or ""
            code = match.group(3)

            # Clean the path and language
            path = path.strip()
            language = language.strip()

            # If path is relative (doesn't start with /), prefix with /home/user/testbed/
            if path and not path.startswith("/"):
                original_path = path
                path = f"/home/user/testbed/{path}"
                print(
                    f"Converting relative path '{original_path}' to absolute path '{path}'"
                )

            code_blocks.append(
                CodeBlock(language=language, path=path, code=code.strip())
            )

        # Check for missing language or path in code blocks
        missing_language = [
            i for i, block in enumerate(code_blocks) if not block.language
        ]
        missing_path = [i for i, block in enumerate(code_blocks) if not block.path]

        if missing_language:
            print(
                f"WARNING: Code blocks at positions {missing_language} are missing language identifiers"
            )
            raise Exception(
                f"Code blocks at positions {missing_language} are missing language identifiers"
            )

        if missing_path:
            print(
                f"WARNING: Code blocks at positions {missing_path} are missing file paths"
            )
            raise Exception(
                f"Code blocks at positions {missing_path} are missing file paths"
            )

        paths = [block.path for block in code_blocks if block.path]
        print(
            f"Successfully extracted {len(code_blocks)} code blocks with paths: {', '.join(paths)}"
        )

    except Exception as e:
        print(f"Error extracting code blocks: {str(e)}")
        raise

    return code_blocks


def calculate_ast_grep_score(code_blocks: list[CodeBlock], ast_greps: Any) -> float:
    # Convert ast_greps to list if it's a dict
    if isinstance(ast_greps, dict):
        ast_greps = [ast_greps]

    # Parse each grep pattern into the Pydantic model
    parsed_patterns: list[ASTGrepPattern] = []
    for grep in ast_greps:
        try:
            pattern = ASTGrepPattern(**grep)
            parsed_patterns.append(pattern)
        except Exception as e:
            print(f"Error parsing AST grep pattern: {e}")
            return 0.0

    if not parsed_patterns:
        return 0.0

    total_score = 0.0
    pattern_count = len(parsed_patterns)

    # Filter code blocks to only include TypeScript and JavaScript files
    supported_blocks = [
        block for block in code_blocks
        if block.language.lower() in SUPPORTED_LANGUAGES
    ]

    if not supported_blocks:
        print("No TypeScript or JavaScript code blocks found to analyze")
        return 0.0

    for pattern in parsed_patterns:
        # Find matching code blocks based on path prefix
        matching_blocks = [
            block for block in supported_blocks
            if block.path.startswith(pattern.file_path_mask)
        ]

        if not matching_blocks:
            print(f"No matching code blocks found for path prefix: {pattern.file_path_mask}")
            continue

        pattern_found = False
        for block in matching_blocks:
            try:
                # Create AST root for the code block
                root = SgRoot(block.code, block.language)
                node = root.root()

                # Check main pattern
                matches = node.find(pattern=pattern.pattern)
                if not matches:
                    continue

                # If we have additional greps, check them too
                if pattern.additional_greps:
                    all_additional_found = True
                    for additional_grep in pattern.additional_greps:
                        if additional_grep not in block.code:
                            all_additional_found = False
                            break

                    if not all_additional_found:
                        continue

                # If we get here, we found a match with all required patterns
                pattern_found = True
                break

            except Exception as e:
                print(f"Error processing code block {block.path}: {e}")
                continue

        if pattern_found:
            total_score += 1.0

    # Return average score across all patterns
    return total_score / pattern_count if pattern_count > 0 else 0.0

def grade_format(output_text: str) -> float:
        # Find <plan> and </plan> tags
    plan_start = output_text.find('<plan>')
    plan_end = output_text.find('</plan>')

    # Find <code> and </code> tags
    code_start = output_text.find('<code>')
    code_end = output_text.find('</code>')

    reward = 0.0

    if plan_start == -1 or plan_end == -1 or code_start == -1 or code_end == -1:
        print(f'missing plan or code tags. format reward: {reward}')
        return reward
    reward += 0.1 # total: 0.1

    if not (plan_start < plan_end < code_start < code_end):
        print(f'tags present but not in the correct order. format reward: {reward}')
        return reward
    reward += 0.1 # total: 0.2

    # Check if there are any stray tags
    plan_tags = re.findall(r'</?plan>', output_text)
    code_tags = re.findall(r'</?code>', output_text)

    if len(plan_tags) != 2 or len(code_tags) != 2:
        print(f'found stray plan or code tags. format reward: {reward}')
        return reward
    reward += 0.2 # total: 0.4

    # Extract content after </code> tag
    after_tags = output_text[code_end + len('</code>'):].strip()
    if after_tags:
        print(f'found text after code tags. format reward: {reward}')
        return reward
    reward += 0.2 # total: 0.6

    # Extract content inside <plan> tags
    plan_content = output_text[plan_start + len('<plan>'):plan_end].strip()
    if not plan_content:
        print(f'no plan content found. format reward: {reward}')
        return reward
    reward += 0.1 # total: 0.7

    # Extract content inside <code> tags
    code_content = output_text[code_start + len('<code>'):code_end].strip()
    if not code_content:
        print(f'no code content found. format reward: {reward}')
        return reward
    reward += 0.1 # total: 0.8

    # Extract content between </plan> and <code> tags
    between_tags = output_text[plan_end + len('</plan>'):code_start].strip()
    if between_tags:
        print(f'found text between plan and code tags. format reward: {reward}')
        return reward
    reward += 0.2 # total: 1.0

    if reward == 1.0:
        print(f'global format reward: {reward}')

    return reward

def grade(sample: Any, item: Any) -> float:
    try:
        output_text = sample["output_text"]

        format_reward = grade_format(output_text)
        if format_reward < 1.0:
            return format_reward

        # Extract code content for grading
        code_start = output_text.find('<code>')
        code_end = output_text.find('</code>')
        code_to_grade: str = output_text[code_start + len('<code>'):code_end].strip()
        code_blocks: list[CodeBlock] = []
        try:
            code_blocks = extract_code_blocks(code_to_grade)
        except Exception as e:
            print(f'error extracting code blocks: {e}')
            return 0.5

        ast_greps = item["reference_answer"]["ast_greps"]
        ast_grep_score = calculate_ast_grep_score(code_blocks, ast_greps)

        return (format_reward + ast_grep_score) / 2.0
    except Exception as e:
        print(f"Error during grading: {str(e)}")
        return 0.0
````


  

  

    
Results

    

> 综合来看 format 和 AST Grep 的总奖励，Runloop 相比基线 o3-mini 模型平均提升了 **12%** ，这是在该基准测试上的结果。
>
> 他们实现了两种类型的测试：一种提供集成指南中的明确内容（评估推理和指令遵循能力），另一种则不提供（评估知识回忆能力）。两种变体的提升幅度均超过 **8%**.
>
> “OpenAI 的 RFT 平台让我们能够使用全球最优秀的通用推理模型，并提供一套工具集来增强我们业务关键问题领域中的推理能力。”
>
> —[Runloop](https://www.runloop.ai/)



#### 正确处理日程管理器中的冲突与重复项



用例

    

> **ChipStack**: [Milo](https://www.joinmilo.com) 帮助忙碌的父母管理混乱的家庭日程，将杂乱输入——例如包含待办的文字对话、学校简报 PDF、每周提醒、运动赛程邮件——转化为可靠的日历和清单操作。
>
> **待解决的问题**: 基于 GPT-4o 的提示和 SFT 未达到信任阈值。
>
> **目标**: Milo 使用 RFT 来正确创建编码任务，例如事件与清单分类、重复规则生成、准确的更新与删除、冲突检测以及严格的输出格式。他们定义了一个评分器，用于检查生成的项目对象是否完整、分类是否正确，以及是否存在重复或日历冲突。


  

  

    
Results

    

> 结果显示各方面性能均有所提升，平均正确率评分 **从 0.86 提升到 0.91**，而最具挑战性的场景则从 **0.46 提升到 0.71** （其中满分为 1）。
>
> "准确性不仅仅是一个指标——它为忙碌的父母带来安心。虽然仍处于早期阶段，但基础性能取得了如此重要的提升，让我们能够更有力地推进复杂的推理需求。"
>
> "在家庭动态中穿行并提供支持，需要理解数据背后细微的含义。以冲突为例——知道 Ethan 的足球训练与 Ella 的朗诵会冲突，因为爸爸需要同时接送两个孩子，这比简单的时间重叠要复杂得多。"
>
> —[Milo](https://www.joinmilo.com)，面向家庭的 AI 日程工具



### 2. 将事实整理为清晰的格式

这些任务通常涉及细微的差异，需要清晰的分类指引。成功的框架构建需要由领域专家通过共识定义的显式且分层的标注方案。如果缺乏一致的共识，评分信号会变得嘈杂，从而削弱 RFT 的效果。

#### 分配 ICD-10 医疗编码



用例

    

> **ChipStack**: [Ambience](https://www.ambiencehealthcare.com) 是一个 AI 平台，可消除临床医生的行政负担，并在 100 多个专科中确保文档准确、合规，帮助医生专注于患者诊疗，同时提升文档质量并降低医疗系统的合规风险。
>
> **待解决的问题**: ICD-10 编码是医学中最复杂的行政任务之一。每次接诊后，临床医生必须将每个诊断映射到约 70,000 个编码之一——处理针对具体性、就诊场所和互斥组合的特定支付方规则。错误可能触发审计和罚款，金额可达九位数。
>
> **目标**: Ambience 希望利用对 OpenAI 前沿模型的强化微调，训练一个推理系统，能够听取就诊音频、提取相关的 EHR 上下文，并推荐准确性超越专家临床医生的 ICD-10 编码。


  

  

    
Results

    

> Ambience 实现了能够领先人类专家的模型改进。
>
> 在一个涵盖数百次就诊的金标准测试集上，强化微调使模型从落后于人类到领先人类 **12 个百分点——消除了训练有素的医生大约四分之一的编码错误**:
>
> - o3-mini（基座）：0.39（-6 分）
> - 医师基线：0.45
> - 经 RFT 调优的 o3-mini：0.57（+12 分）
>
> 该成果是一项实时的、临床场景下的编码支持，可在降低合规风险的同时提升计费完整性。
>
> “准确的 ICD-10 编码选择对于合规文档至关重要。RFT 带来了我们以往在任何基础模型中都没有见过的编码精度新高度，为自动化编码树立了新的标杆。”
>
> —[Ambience Healthcare](https://www.ambiencehealthcare.com)



#### 提取用于支持法律主张的摘录



用例

    

> **ChipStack**: [Harvey](https://www.harvey.ai) 正在构建法律团队信赖的 AI——而这种信赖取决于能否从海量的合同、法规和判例语料中精确检索到所需的证据。法律专业人士不满足于只能生成听起来合理或经过改述的摘要或答案的模型。他们要求可核实的引用——能够直接追溯回源文档的段落。
>
> **待解决的问题**：Harvey 的客户使用其模型来评估诉讼风险、构建法律论证，并为法律专业人士的尽职调查提供支持——这些任务中，任何一句话的遗漏或引用错误都可能扭转结果。模型必须能够解析冗长且密集的法律文档，并只提取关键的部分。
> 在实际应用中，这些输入往往杂乱且不一致：有些主张含糊不清，而另一些则依赖于深埋在样板文本中的罕见法律原则。
>
> **目标**：该任务的要求是解读细微的法律主张、浏览长篇文档，并选取贴合要点的支持内容，且需使用逐字摘录。


  

  

    
Prompt

    

```
## Instructions
You will be provided with a question and a text excerpt. Identify any passages in the text that are directly relevant to answering the question.
- If there are no relevant passages, return an empty list.
- Passages must be copied **exactly** from the text. Do not paraphrase or summarize.
## Excerpt
"""{text_excerpt}"""
```


  

  

    
Grader

    

```python
from rapidfuzz import fuzz


# Similarity ratio helper
def fuzz_ratio(a: str, b: str) -> float:
    """Return a normalized similarity ratio using RapidFuzz."""
    if len(a) == 0 and len(b) == 0:
        return 1.0
    return fuzz.ratio(a, b) / 100.0


# Main grading entrypoint (must be named \`grade\`)
def grade(sample: dict, item: dict) -> float:
    """Compute an F1‑style score for citation extraction answers using RapidFuzz."""
    model_passages = (sample.get("output_json") or {}).get("passages", [])
    ref_passages = (item.get("reference_answer") or {}).get("passages", [])

    # If there are no reference passages, return 0.
    if not ref_passages:
        return 0.0

    # Recall: average best match for each reference passage.
    recall_scores = []
    for ref in ref_passages:
        best = 0.0
        for out in model_passages:
            score = fuzz_ratio(ref, out)
            if score > best:
                best = score
        recall_scores.append(best)
    recall = sum(recall_scores) / len(recall_scores)

    # Precision: average best match for each model passage.
    if not model_passages:
        precision = 0.0
    else:
        precision_scores = []
        for out in model_passages:
            best = 0.0
            for ref in ref_passages:
                score = fuzz_ratio(ref, out)
                if score > best:
                    best = score
            precision_scores.append(best)
        precision = sum(precision_scores) / len(precision_scores)

    if precision + recall == 0:
        return 0.0

    return 2 * precision * recall / (precision + recall)
```


  

  

    
Results

    

> 在强化微调之后，Harvey 看到了 **20% 的提升** 体现在 F1 分数上：
>
> - 基线 F1：0.563
> - RFT 后 F1 - 0.6765
>
> 使用 RFT，Harvey 大幅提升了法律事实抽取性能，在效率和准确性上均超越了 GPT-4o。早期试验显示 RFT **在 93% 的对比中获胜或打平** 对比 GPT-4o。
>
> “RFT 模型表现与 GPT-4o 相当或更优，且推理速度明显更快，证明对实际法律应用场景尤为有益。
>
> —[Harvey](https://www.harvey.ai)，服务于法律团队的 AI



### 3. 正确应用复杂规则

该用例涉及从非结构化输入中抽取可验证的事实或实体，并将其放入明确定义的模式中（例如 JSON 对象、条件码、医学编码、法律引用或财务指标）。

成功的抽取任务通常受益于精确且持续的评分方法——例如跨度级 F1 分数、模糊文本匹配指标或数值准确性检查——以评估抽取信息与真实标签的对齐准确度。定义明确的成功标准和详细的评分细则，然后模型即可实现可靠、可复现的改进。

#### 税务分析中的专家级推理



用例

    

> **ChipStack**: [Accordance](https://www.accordance.com) 正在为税务、审计和 CPA 团队构建一个平台。
>
> **待解决的问题**：税务是一个高度复杂的领域，需要在细致的事实模式和复杂的法规之间进行深度推理。同时这也是一个不断变化的领域。
>
> **目标**：Accordance 希望为复杂的税务场景构建一个高可信度的系统，同时保持准确性。与传统的硬编码软件不同，重要的是他们的数据提取工具能够随着税务环境的变化而不断适应。


  

  

    
评分器代码

    

```
[+0.05] For correctly identifying Alex (33.33%), Barbara (33.33% → 20%), Chris (33.33%), and Dana (13.33%) ownership percentages
[+0.1] For correctly calculating Barbara's annual allocation as 26.67% and Dana's as 6.67% without closing of books
[+0.15] For properly allocating Alex ($300,000), Barbara ($240,030), Chris ($300,000), and Dana ($60,030) ordinary income
[+0.1] For calculating Alex's ending stock basis as $248,333 and debt basis as $75,000
[+0.05] For calculating Barbara's remaining basis after sale as $264,421
[+0.1] For calculating AAA before distributions as $1,215,000 and ending AAA as $315,000
[+0.1] For identifying all distributions as tax-free return of capital under AAA
[+0.1] For calculating Barbara's capital gain on stock sale as $223,720 ($400,000 - $176,280)
[+0.1] For explaining that closing of books would allocate based on actual half-year results
[+0.05] For identifying the ordering rules: AAA first, then E&P ($120,000), then remaining basis
[+0.05] For noting distributions exceeding $1,215,000 would be dividends up to $120,000 E&P
[+0.05] For correctly accounting for separately stated items in basis calculations (e.g., $50,000 Section 1231 gain)
```


  

  

    
Results

    

> 通过与 OpenAI 及其内部税务专家协作，Accordance 实现了：
>
> - 接近 **40% 的提升** 相较基础模型在税务分析任务上的表现
> - 在 TaxBench 等基准测试上优于所有其他领先模型
> - 经 RFT 训练的模型展现了以高准确度处理复杂税务场景的能力——在税务专业人士的评估下，Accordance 微调后的模型表现出专家级推理水平，有望节省数千小时的人工工作量
>
> “我们在税务分析任务上相较基础模型取得了 38.89% 的提升，并在关键税务基准（包括 TaxBench）上显著优于所有其他领先模型。经过 RFT 训练的模型在处理复杂税务场景的同时保持准确性，这证明了强化微调——乃至更广泛的 AI——已具备投入专业应用的条件。最重要的是，RFT 为随着税务环境变化而持续适应奠定了基础，确保了持续的价值和相关性。在税务专家评估时，我们微调后的模型展现了专家级的推理能力，将节省数以千计的专业工时——这不仅是一次渐进式改进，更是税务工作方式的一次范式转变。”
>
> —[Accordance](https://www.accordance.com/)，AI 税务会计公司



#### Enforcement of nuanced content moderation policies



用例

    

> **ChipStack**: [SafetyKit](https://www.safetykit.com) 是一个风险与合规平台，帮助组织在复杂的内容审核工作流中做出决策。
>
> **待解决的问题**：这些系统必须处理海量内容，并运用需要多步推理的复杂策略逻辑。由于数据量大以及标签标注中存在细微差别，这类任务对通用模型而言颇具难度。
>
> **目标**：SafetyKit 旨在使用一个经过强化学习微调的模型，将其最复杂工作流中的多个节点替换为单个推理智能体。目标是缩短 SafetyKit 在即便是充满挑战、细微差别较大的领域中针对新型策略执行的上线时间。


  

  

    
Results

    

> SafetyKit 正在使用其 o3-mini RFT 模型来支持高级内容审核能力，为全球最大的 AI 聊天机器人公司之一保障用户安全。他们已成功提升了 F1 分数 **从 86% 提升到 90%**，即将在其生产流水线中取代数十次 4o 调用。
>
> "SafetyKit 基于 RFT 的审核在细致入微的内容审核任务上实现了显著提升，对于在动态的真实场景中保护用户至关重要。"
>
> —[SafetyKit](https://www.safetykit.com)



#### 法律文档审阅、对比与摘要



用例

    

> **ChipStack**: [Thomson Reuters](https://www.thomsonreuters.com) 是一家 AI 与科技公司，通过可信内容和工作流自动化赋能专业人士。
>
> **待解决的问题**：法律专业人士必须在做出任何决定之前阅读大量内容。Thomson Reuters 的 CoCounsel 产品旨在通过提供具备内容和行业知识的 AI 助手，帮助这些专家更快地推进工作。为该工具提供支持的模型必须理解复杂的法律规则。
>
> **目标**：Thomson Reuters 旨在创建一个在法律 AI 技能方面表现出色的强化微调模型。他们对 RFT 进行了初步评估，以确定是否能借助针对三种法律专业人士常用 CoCounsel 法律 AI 技能的专业数据集，实现模型性能提升：
>
> 1. 审阅文档：针对合同、笔录及其他法律文档的提问生成详细解答
> 1. 对比文档：突出显示两份或多份不同合同或文档之间的实质性差异
> 1. 摘要：概括一份或多份文档中最重要的信息，以便快速完成法律审查


  

  

    
Results

    

> ![提供示例数据并创建微调作业，以针对你的用例优化模型性能](https://cdn.openai.com/API/docs/images/thomsonreuters-results.png)
>
> "LLM 作为裁判在展示改进推理模型的可能性方面很有帮助——在初步评估中，RFT 模型始终优于基线的 o3-mini 和 o1 模型"
>
> —[Thomson Reuters](https://www.thomsonreuters.com/)，人工智能与科技公司



## Evals 是基础

**在实施 RFT 之前，我们强烈建议你针对打算进行微调的任务创建并运行一次评测**。如果你打算微调的模型得分刚好为可能的最低分或最高分，那么 RFT 对你来说就没有用了。

RFT 通过强化针对所提供提示的更优答案来工作。如果无法区分不同答案的质量（即所有答案都获得可能的最低分或最高分），那么就没有可供学习的训练信号。但是，如果你的评测分数位于最低分与最高分之间的某个范围内，那就存在足够的数据可供使用。

一个有效的评测能够揭示人类专家一致认同但当前前沿模型表现欠佳的机会，从而为 RFT 弥补这一差距提供有价值的切入点。 [开始使用评测](https://developers.openai.com/api/docs/guides/evals).

## 如何从 RFT 获得更好的结果

要看到微调模型的改进，有两个主要方面需要回顾和优化：一是确保任务定义清晰，二是让评分方案更加稳健。

### 重构或澄清你的任务

良好的任务能让模型获得公平的学习机会，并让你量化改进效果。

- **从一个模型偶尔就能完成的任务入手**。RFT 的工作方式是采样大量答案，保留看起来最好的那些，并把模型推向这些答案。如果模型现在从来都答不对，那它就无法得到提升。
- **确保每个答案都可以被打分**。评分器必须能够读取一个答案并给出分数，全程无需人工参与。我们支持多种 [评分器类型](https://developers.openai.com/api/docs/guides/graders)，包括自定义 Python 评分器和 LLM 评判。如果你无法用现有评分器编写代码来评判答案，那 RFT 就不适合你。
- **消除对“正确”答案的疑虑**。如果两个严谨的人经常对解答存在分歧，那这个任务就过于模糊了。请改写提示、增加上下文，或将任务拆分成更清晰的部分，直到领域专家达成一致。
- **限制侥幸猜测**。如果任务是只有一个明显最佳选项的多选题，模型可以凭运气答对。请增加类别、要求简短的开放式回答，或调整格式，使猜测的代价变大。

### 强化你的评分器

清晰、稳健的评分方案对 RFT 至关重要。

- **给出平滑的分数，而非简单的通过/不通过标记**。随着答案质量提升而平滑变化的分数能提供更好的训练信号。
- **防范奖励作弊**。当模型找到某种捷径、在缺乏真实能力的情况下获得高分时，就会发生这种情况。
- **避免数据倾斜**。如果某个标签在数据集中频繁出现，模型就会倾向于猜测该标签。请平衡数据集或提高稀有样本的权重，以促使模型真正思考。
- **在代码评估不足时使用 LLM 评判**。对于内容丰富、开放式的回答，可以由 [单独的 OpenAI 模型进行评分](https://developers.openai.com/api/docs/guides/graders#model-graders) 你微调模型的回答。请确保做到以下几点：
  - **评估评判模型本身**：将多个候选回答和标准答案输入你的 LLM 评判模型，确保其返回的分数稳定且与偏好一致。
  - **提供少样本示例**。在提示中加入优质、合理和较差的回答，以提升评分器的有效性。

了解更多关于 [评分器类型](https://developers.openai.com/api/docs/guides/graders).

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码以及第三方资源链接，或进一步了解我们的模型与推理能力：

- [模型概览](https://developers.openai.com/api/docs/models)
- [强化微调指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)
- [Graders](https://developers.openai.com/api/docs/guides/graders)
- [模型优化概述](https://developers.openai.com/api/docs/guides/model-optimization)