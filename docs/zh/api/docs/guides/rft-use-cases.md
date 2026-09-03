# 强化微调应用场景

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

[强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning) (RFT) 提供了一种方法来提升模型在特定任务上的表现。该任务必须明确且具备可验证的答案。

OpenAI 正在逐步停用微调平台。该平台已不再
  对新的用户开放，但现有的微调平台用户在
  未来数月内仍可创建训练任务。
  

  所有经过微调的模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前仍可继续用于推理。完整的时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).

## 何时使用强化微调

智能体工作流旨在做出既正确又可验证的决策。RFT 可以通过提供明确的评分标准，并使用基于代码或基于 LLM 的评分器来衡量功能正确性、事实准确性或策略合规性，从而提供帮助。

在早期用户中，三个明确的用例已经浮现：

1. **将指令转化为可运行的代码**：将开放式提示转化为必须通过确定性测试的结构化代码、配置或模板。
1. **将事实提炼为干净的格式**：从杂乱、非结构化的文本中提取可验证的事实和摘要，并以 JSON 结构化输出或其他基于 schema 的输出形式返回。
1. **正确应用复杂规则**：在所提供信息细致、量大、分层或影响重大时，做出精细的标签或策略决策。

[已准备好使用强化微调？直接跳转到指南 →](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)

### 1. 将指令转化为可运行的代码

在此用例中，模型对隐藏的领域约束进行推理，以生成结构化输出，例如代码、查询或基础设施模板。输出必须满足多个正确性条件，并且成功通常以确定性方式评估：产物要么能够编译、通过测试，要么符合明确的模式。

#### 为半导体设计连接验证 IP



用例

    

> **公司**: [ChipStack](https://www.chipstack.ai) 正在构建面向芯片设计与验证的下一代 AI 驱动工具，旨在显著缩短复杂半导体芯片的开发与验证时间并降低成本。
>
> **待解决的问题**：对于人类而言，一项既困难又耗时的任务是将设计接口绑定到验证 IP（预先创建的验证组件，若正确使用，可以显著提升验证的质量与覆盖率）。验证 IP 数量众多，且每个验证 IP 可能包含数十到数百个需要映射的信号。必须深入理解该领域，才能正确应用验证 IP。
>
> **目标**：为训练OpenAI推理模型来完成这项任务，ChipStack 准备了一个包含不到 50 个样本的数据集，然后进行了若干 RFT 变体实验。在最终的评估报告中，他们针对每个模型与变体——o1-mini 基础版与微调版、o3-mini 基础版与微调版——将该评估集运行了三次，并按样本再按总体对结果取平均值。


  

  

    
提示词

    

> 以下是一段提供的示例数据。

```
[
    {“name”: “BLOCK_SIZE”, “value”: “8”},
    {“name”: “ADDR_WIDTH”, “value”: “4”}
]
```


  

  

    
评分器代码

    

> 下面是一个 Python 中字符串映射的评分器定义，表示为具有以下属性的对象列表 `name` 和 `value` 属性。
>
> 从概念上讲，这是为了对如下类型进行建模： `Dict[str, str]`.

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

    

> 对于 o1-mini 和 o3-mini，性能均提升了约 12 个百分点。经过微调的变体在判断何时不应应用连线方面有了明显改善。许多商用验证 IP 可能包含数百个可选信号，其中大多数并不应被应用。
>
> “得益于强大的基础模型和易用的强化微调 API，我们仅用少量高质量样本就显著提升了任务性能。”
>
> —[ChipStack](https://www.chipstack.ai)，面向芯片设计与验证的下一代 AI 驱动工具



#### 开箱即用的 API 代码片段，可编译并通过 AST 检查



用例

    

> **公司**: [Runloop](https://www.runloop.ai) 是一个供 AI 驱动的编码智能体投入生产环境的平台，并通过公开和自定义的基准测试能力来打磨其性能。
>
> **待解决的问题**：Runloop 希望提升模型在使用第三方 API（例如 Stripe API）时的表现，这类 接口 在缺少人工介入的情况下可能非常庞大且复杂。如果他们能训练模型来使用 Stripe API，Runloop 就能将具有重要经济价值的业务场景转化为可运行的代码。
>
> **目标**：他们的目标是教会模型熟练使用 Stripe API，包括针对任意用户请求编写完整的代码片段——可以通过改编现有集成指南中的信息、合并多份指南中的信息，或推断指南中未明确说明的信息来实现。他们使用 RFT 并设置了两类主要奖励：
>
> 1. 奖励模型以 Markdown 格式输出答案，并符合对“动态”集成指南外观的预期。
> 1. 通过对模型输出的代码使用 AST Grep 进行校验，奖励模型生成“正确”的代码片段。这使得他们能够确认模型使用了正确的 Stripe SDK 调用，并带有正确的参数，在某些情况下甚至按正确的顺序进行调用。


  

  

    
评分器代码

    

````python
# Note this file gets uploaded to the OpenAI API as a grader
from ast_grep_py import SgRoot
from pydantic import BaseModel, Field  # type: ignore
from typing import Any, List, Optional
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
    additional_greps: Optional[List[str]] = Field(
        default=None,
        description="Additional patterns that must also be present in the matched code"
    )

def extract_code_blocks(llm_output: str) -> List[CodeBlock]:
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


def calculate_ast_grep_score(code_blocks: List[CodeBlock], ast_greps: Any) -> float:
    # Convert ast_greps to list if it's a dict
    if isinstance(ast_greps, dict):
        ast_greps = [ast_greps]

    # Parse each grep pattern into the Pydantic model
    parsed_patterns: List[ASTGrepPattern] = []
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
        code_blocks: List[CodeBlock] = []
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

    

> 综合考量格式与 AST Grep 的总奖励，Runloop 相比基准 o3-mini 模型平均提升 **12%** 。
>
> 他们实现了两类测试：一类提供集成指南中的明确内容（评估推理与指令遵循能力），另一类不提供（评估知识回忆能力）。两种变体均取得了超过 **8%**.
>
> “OpenAI 的 RFT 平台让我们能够使用全球最强的通用推理模型，并提供可在我们业务重要的问题领域为该推理大幅提速的工具集。”
>
> —[Runloop](https://www.runloop.ai/)



#### 在日程管理器中正确处理冲突和重复项



用例

    

> **公司**: [Milo](https://www.joinmilo.com) 帮助忙碌的父母管理混乱的家庭日程，把凌乱的输入——比如包含待办事项的文字对话、学校通讯 PDF、每周提醒、运动赛程邮件——转化为可靠的日历和清单操作。
>
> **待解决的问题**：基础的 GPT-4o 提示和 SFT 未达到信任阈值。
>
> **目标**：Milo 使用 RFT 来正确创建编码任务，例如事件与清单的分类、重复规则生成、准确的更新与删除、冲突检测以及严格的输出格式。他们定义了一个评分器，用于检查生成的项目对象是否完整、分类是否正确，以及是否存在重复或日历冲突。


  

  

    
Results

    

> 结果显示各项性能均有提升，平均正确率得分 **从 0.86 提升到 0.91**，而最具挑战性的场景则从 **0.46 提升到 0.71** （满分=1）。
>
> "准确性不仅仅是一个指标——它为忙碌的父母带来安心。虽然这仍处于早期阶段，但基础性能取得了如此重要的提升，使我们能够更积极地推进更复杂的推理需求。"
>
> "理解和支持家庭动态需要理解数据背后的细微含义。以冲突为例——知道 Ethan 的足球训练与 Ella 的朗诵会冲突，因为爸爸必须同时接送两个孩子，这比单纯的时间重叠要复杂得多。"
>
> —[Milo](https://www.joinmilo.com)，面向家庭的 AI 日程安排工具



### 2. 将事实提取为简洁格式

这些任务通常涉及细微的区分，需要清晰的分类准则。成功的框架设计需要由领域专家通过共识定义的显式且分层的标注方案。如果没有一致的共识，评分信号会变得嘈杂，从而削弱 RFT 的有效性。

#### 分配 ICD-10 医疗编码



用例

    

> **公司**: [Ambience](https://www.ambiencehealthcare.com) 是一个 AI 平台，可消除临床医生的行政负担，并确保在 100 多个专科中提供准确、合规的文档，帮助医生专注于患者护理，同时提高文档质量并降低医疗系统的合规风险。
>
> **待解决的问题**：ICD-10 编码是医学中最复杂的行政任务之一。每次患者就诊结束后，临床医生必须将每个诊断映射到约 70,000 个代码之一——应对针对特异性、就诊地点和互斥配对的支付方特定规则。错误可能触发审计和高达九位数的罚款。
>
> **目标**：Ambience 希望使用 OpenAI 前沿模型进行强化微调，训练一个推理系统，监听就诊音频，引入相关的 EHR 上下文，并推荐准确率超过专家临床医生的 ICD-10 代码。


  

  

    
Results

    

> Ambience 实现了可以领先人类专家的模型改进。
>
> 在一个涵盖数百次就诊的金标准测试集上，强化微调使模型从落后于人类变为领先人类 **12 分——消除了训练有素的医生所犯的大约四分之一的编码错误**:
>
> - o3-mini（基础版）：0.39（-6 分）
> - 医师基线：0.45
> - 经 RFT 调优的 o3-mini：0.57（+12 分）
>
> 这一结果是一种实时的、临床场景下的编码支持，既能提升计费完整性，也能降低合规风险。
>
> “准确的 ICD-10 编码选择对于合规文档至关重要。RFT 让我们看到了以往任何基础模型都未曾达到的编码精度新高度，并为自动化编码树立了全新标杆。”
>
> —[Ambience Healthcare](https://www.ambiencehealthcare.com)



#### 提取支持法律主张的摘录



用例

    

> **公司**: [Harvey](https://www.harvey.ai) 正在构建值得法律团队信赖的 AI——而这种信赖，取决于能否从庞大的合同、法规与判例语料中精准检索到恰当的证据。法律专业人士并不满足于仅能生成听起来合理或转述作答的模型，他们要求提供可核验的引用——即那些可以直接追溯回源文档的段落。
>
> **待解决的问题**：Harvey 的客户使用其模型来甄别诉讼风险、构建法律论证，并为法律专业人士的尽职调查提供支持——这些任务中，遗漏或误引一句话都可能扭转结局。模型必须能够解析冗长而密集的法律文档，并仅提取出关键的部分。
> 实际上，这些输入往往杂乱且不一致：有些主张含糊其辞，而另一些则取决于深藏在样板条款中的冷僻法学理论。
>
> **目标**：该任务的要求是解读细微的法律主张、导航长篇文档，并选取贴切的支撑证据，使用逐字摘录。


  

  

    
提示词

    

```
## Instructions
You will be provided with a question and a text excerpt. Identify any passages in the text that are directly relevant to answering the question.
- If there are no relevant passages, return an empty list.
- Passages must be copied **exactly** from the text. Do not paraphrase or summarize.
## Excerpt
"""{text_excerpt}"""
```


  

  

    
评分器

    

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

    

> 经过强化微调后，Harvey 获得了 **20% 的提升** 在 F1 分数上：
>
> - 基线 F1：0.563
> - RFT 之后 F1 - 0.6765
>
> 使用 RFT，Harvey 显著提升了法律事实抽取性能，在效率和准确性上均超越了 GPT-4o。早期试验显示 RFT **在 93% 的对比中获胜或打平** GPT-4o。
>
> “RFT 模型表现与 GPT-4o 相当或更优，同时推理速度显著更快，对现实中的法律用例尤为有益。
>
> —[Harvey](https://www.harvey.ai)，法律团队的 AI



### 3. 正确应用复杂规则

该用例涉及从非结构化输入中提取可验证的事实或实体，并放入明确定义的模式中（例如 JSON 对象、条件码、医学编码、法律引文或财务指标）。

成功的提取任务通常受益于精确、连续的评分方法——例如 span 级 F1 分数、模糊文本匹配指标或数值准确性检查——以评估提取的信息与真实值的对齐程度。定义明确的成功标准和详细的评分细则。然后，模型就能获得可靠、可复现的提升。

#### 税务分析中的专家级推理



用例

    

> **公司**: [Accordance](https://www.accordance.com) 正在为税务、审计和 CPA 团队构建一个平台。
>
> **待解决的问题**：税务是一个高度复杂的领域，需要在细致的事实模式和错综复杂的法规之间进行深度推理。这也是个持续变化的领域。
>
> **目标**：Accordance 希望为复杂的税务场景建立一个高信任度的系统，同时保持准确性。与传统的硬编码软件不同，重要的是让其数据提取工具能够随着税务环境的变化而适应。


  

  

    
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

    

> 通过与 OpenAI 及其内部税务专家合作，Accordance 实现了：
>
> - 近 **40% 的提升** 在税务分析任务上相比基模的表现
> - 在 TaxBench 等基准测试中优于所有其他领先模型
> - 经 RFT 训练的模型展示了以高准确率处理复杂税务场景的能力——经税务专业人士评估，Accordance 的微调模型表现出专家级推理水平，有望节省数千小时的人工工作
>
> “我们在税务分析任务上相较基础模型取得了 38.89% 的提升，并在关键税务基准（包括 TaxBench）上显著优于所有其他领先模型。经过 RFT 训练的模型既能处理复杂的税务场景，又能保持准确性，这表明强化微调——以及更广泛的 AI——已具备投入专业应用的条件。最重要的是，RFT 为持续适配提供了基础，使模型能够随税务领域的演变不断进化，从而确保持久的价值与相关性。在税务专家的评估下，我们微调后的模型展现出了专家级的推理能力，这将节省数千个专业工时——这不仅仅是一次渐进式的改进，而是税务工作方式的一次范式转变。”
>
> —[Accordance](https://www.accordance.com/)，AI 税务会计公司



#### 执行细致的内容审核策略



用例

    

> **公司**: [SafetyKit](https://www.safetykit.com) 是一个风险与合规平台，帮助组织在复杂的内容审核工作流中做出决策。
>
> **待解决的问题**：这些系统必须处理海量内容，并应用需要多步推理的复杂策略逻辑。由于数据量大以及标签之间存在细微差别，这类任务对通用模型而言可能颇具挑战。
>
> **目标**: SafetyKit 旨在使用经过强化学习微调的模型，将其最复杂工作流中的多个节点替换为单个推理智能体。目标是缩短 SafetyKit 在即使是具有挑战性且细致的领域中，针对新策略落地所需的时间。


  

  

    
Results

    

> SafetyKit 正在使用其 o3-mini RFT 模型来支持高级内容审核能力，为全球最大的 AI 聊天机器人公司之一保障用户安全。他们已成功将 F1 分数 **从 86% 提升到 90%**，并即将替代其生产管线中数十次 4o 调用。
>
> "SafetyKit 基于 RFT 的审核能力在细致的内容审核任务中取得了显著提升，对于在动态的真实场景中保护用户至关重要。"
>
> —[SafetyKit](https://www.safetykit.com)



#### 法律文档审阅、对比与摘要



用例

    

> **公司**: [Thomson Reuters](https://www.thomsonreuters.com) 是一家 AI 与科技公司，通过值得信赖的内容和工作流自动化赋能专业人士。
>
> **待解决的问题**：法律专业人士必须在做出任何决策之前阅读大量内容。Thomson Reuters 的 CoCounsel 产品旨在通过提供一个具备内容和行业知识的 AI 助手来帮助这些专家更快地推进工作。驱动该工具的模型必须理解复杂的法律规则。
>
> **目标**：Thomson Reuters 旨在打造一款在法律 AI 技能方面表现出色的强化微调模型。他们对 RFT 进行了初步评估，以考察是否能利用面向法律专业人士的三项高使用率 CoCounsel 法律 AI 技能的专用数据集实现模型性能提升：
>
> 1. 审阅文档：针对合同、笔录和其他法律文档提出的问题生成详细解答
> 1. 对比文档：突出显示两个或更多不同合同或文档之间的实质性差异
> 1. 总结：总结一份或多份文档中最重要的信息，以便快速进行法律审阅


  

  

    
Results

    

> ![提供示例数据并创建微调任务，针对你的使用场景优化模型性能](https://cdn.openai.com/API/docs/images/thomsonreuters-results.png)
>
> "LLM 作为评判模型在证明推理模型可被改进的可能性方面发挥了很大作用——在初步评估中，RFT 模型的表现始终优于基线的 o3-mini 和 o1 模型"
>
> —[Thomson Reuters](https://www.thomsonreuters.com/)，人工智能与科技公司



## Evals 是基础

**在实施 RFT 之前，我们强烈建议你为计划进行微调的任务创建并运行一个评估**。如果你计划进行微调的模型得分处于可能得分的绝对最小值或绝对最大值，那么 RFT 对你来说就没有用处。

RFT 的工作原理是强化针对所提供提示的更优回答。如果我们无法区分不同回答的质量（即所有回答都获得可能的最小值或最大值），那么就没有可供学习的训练信号。但是，如果你的评估得分处于最小值和最大值之间的某个区间，那么就有足够的数据可以使用。

一个有效的评估能够揭示人类专家始终达成一致而当前前沿模型仍然表现不佳的机会，从而形成一个可供 RFT 弥合的宝贵差距。 [开始使用评估](https://developers.openai.com/api/docs/guides/evals).

## 如何通过 RFT 获得更好的结果

要看到微调模型的改进效果，有两个主要的方面需要回顾并优化：确保任务定义清晰，以及让评分方案更加稳健。

### 重新框定或澄清你的任务

好的任务能让模型获得公平的学习机会，并让你量化改进效果。

- **从一个模型偶尔已经能解决的任务入手**。RFT 通过采样大量答案、保留看起来最好的，并引导模型朝这些答案靠拢来工作。如果模型目前从未给出正确答案，它就无法提升。
- **确保每个答案都可以被评分**。评分器必须能够读取一个答案并给出分数，全程无需人工介入。我们支持多种 [评分器类型](https://developers.openai.com/api/docs/guides/graders)，包括自定义 Python 评分器和 LLM 评判模型。如果你无法用现有的评分器编写代码来评判答案，那么 RFT 就不适合你。
- **消除对“正确答案”的疑虑**。如果两个认真的人在解答上经常意见不一，说明任务过于模糊。请改写提示、补充上下文，或将任务拆分成更清晰的部分，直到领域专家达成一致。
- **限制侥幸猜中**。如果任务是只有一个明显最佳选项的单选题，模型可能凭运气获胜。可以增加类别、要求简短开放式文本，或调整格式，让猜测变得代价高昂。

### 强化你的评分器

清晰、稳健的评分方案对 RFT 至关重要。

- **输出平滑的分数，而不是通过/不通过的二值判定**。随着答案质量提升而平滑变化的分数，能提供更好的训练信号。
- **防范奖励作弊**。当模型找到能在缺乏真实能力的情况下获得高分的捷径时，就会发生这种情况。
- **避免数据倾斜**。如果数据集中某一类标签出现得最多，模型就会倾向于直接猜该标签。请对数据集进行平衡，或对稀有样本进行上加权，以迫使模型进行思考。
- **当代码评分不够用时，使用 LLM 评分**。对于内容丰富、开放式的答案，可以让一个独立的 OpenAI 模型来对 [你的微调模型的答案进行评分](https://developers.openai.com/api/docs/guides/graders#model-graders) 。请确保你：
  - **评估评分模型**：让多个候选回答和正确答案通过你的 LLM 评分模型，确保返回的分数稳定且与偏好一致。
  - **提供少样本示例**。在提示中同时包含优秀、中等和较差的答案，以提升评分模型的有效性。

了解有关 [评分器类型](https://developers.openai.com/api/docs/guides/graders).

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和指向第三方资源的链接，或详细了解我们的模型与推理能力：

- [认识模型](https://developers.openai.com/api/docs/models)
- [强化微调指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)
- [评分器](https://developers.openai.com/api/docs/guides/graders)
- [模型优化概述](https://developers.openai.com/api/docs/guides/model-optimization)