# 强化微调使用场景

> 完整的文档索引参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

[强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning) （RFT）提供了一种提升模型在特定任务上表现的方法。任务必须清晰且具有可验证的答案。

OpenAI正在逐步关闭微调平台。该平台不再
  对新用户开放，但现有微调平台用户仍可
  在未来数月内创建训练作业。
  

  所有微调模型将继续可用于推理，直到其基础
  模型 [弃用](https://developers.openai.com/api/docs/deprecations)。完整时间线见
  [此处](https://developers.openai.com/api/docs/deprecations).

## 何时使用强化微调

智能体工作流旨在做出既正确又可验证的决策。强化微调可以通过提供明确的评分标准，并使用基于代码或基于大语言模型的评分器来衡量功能成功度、事实准确性或策略合规性来提供帮助。

在早期用户中，已浮现出三个明确的用例：

1. **将指令转化为可运行的代码**：将开放式提示转化为必须通过确定性测试的结构化代码、配置或模板。
1. **将事实提取为干净的格式**：从杂乱无序的文本中提取可验证的事实和摘要，并返回 JSON 结构化或其他基于 schema 的输出。
1. **正确应用复杂规则**：当所提供的信息细微、量大、层级复杂或具有高风险时，做出细粒度的标签或政策决策。

[准备好使用强化微调了吗？跳转到指南 →](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)

### 1. 将指令转化为可工作的代码

在此用例中，模型对隐藏的领域约束进行推理，以生成代码、查询或基础设施模板等结构化输出。输出必须满足多个正确性条件，且成功通常以确定性方式评定：产物要么能编译、通过测试，要么符合明确的模式。

#### 为半导体设计接线验证 IP



用例

    

> **公司**: [ChipStack](https://www.chipstack.ai) 正在构建用于芯片设计和验证的下一代人工智能驱动工具，旨在显著缩短开发和验证复杂半导体芯片所需的时间与成本。
>
> **待解决的问题**: 对人类而言，一项具有挑战性且耗时的任务是设计接口与验证 IP（预先创建的验证组件，若应用得当，可显著提升验证的质量和覆盖率）的绑定。验证 IP 众多，每个 IP 可能包含数十到数百个可映射的信号。要正确应用验证 IP，必须有人对此领域有深入了解。
>
> **目标**: 为了训练OpenAI推理模型来完成这项工作，ChipStack 准备了少于 50 个样本的数据集，然后进行了多种 RFT 变体实验。在最终评估报告中，他们对每个模型和变体——o1-mini 基础版与微调版、o3-mini 基础版与微调版——分别运行了该评估集三次，并先按样本取平均结果，再计算整体平均。


  

  

    
提示词

    

> 以下是提供的一段示例数据。

```
[
    {“name”: “BLOCK_SIZE”, “value”: “8”},
    {“name”: “ADDR_WIDTH”, “value”: “4”}
]
```


  

  

    
评分代码

    

> 以下是 Python 中一个字符串映射的评分器定义，表示为对象列表，其中包含 `name` 以及 `value` 属性。
>
> 从概念上讲，这旨在建模类似于 `Dict[str, str]`.

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


  

  

    
结果

    

> 对于 o1-mini 和 o3-mini 两者来说，性能提升了约 12 个百分点。微调后的变体在识别何时不应施加布线方面表现明显更好。许多商业验证 IP 可能包含数百个可选信号，其中大多数并不打算被施加。
>
> “得益于强大的基础模型和易于使用的强化微调 API，我们能够利用一小批高质量样本显著提升任务性能。”
>
> —[ChipStack](https://www.chipstack.ai)，下一代用于芯片设计和验证的 AI 驱动工具



#### 可编译并通过 AST 检查的生产级 API 代码片段



使用场景

    

> **公司**: [Runloop](https://www.runloop.ai) 是一个用于将 AI 驱动的编码智能体部署到生产环境，并通过公共和自定义基准测试能力来优化性能的平台。
>
> **要解决的问题**：Runloop 希望提高模型在使用第三方API（如 Stripe API）时的性能，这些 接口 可能庞大且复杂，且没有人类参与其中。如果他们能够训练一个模型来使用 Stripe API，Runloop 就可以将具有经济影响力的业务案例转化为可工作的代码。
>
> **目标**：他们的目标是教会模型掌握 Stripe API 的使用，包括通过改编现有集成指南中的信息、合并多个指南中的信息或推断指南中未明确说明的信息，为任意用户请求编写完整的代码片段。他们使用了 RFT，并有两个主要奖励：
>
> 1. 奖励模型以符合“动态”集成指南预期外观的 Markdown 格式输出答案。
> 1. 通过 AST Grep 验证输出的代码来奖励模型生成“正确”的代码片段。这使他们能够确认模型正在使用正确的参数调用正确的 Stripe SDK，在某些情况下甚至以正确的顺序调用。


  

  

    
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


  

  

    
结果

    

> 综合来看总奖励（格式和 AST Grep），Runloop 观察到平均提升了 **12%** RFT 模型在基准测试上相较于基础 o3-mini 模型的表现。
>
> 他们实现了两类测试，一类提供来自集成指南的显式内容（评估推理和指令遵循），另一类不提供（评估知识回忆）。两种变体均提升了超过 **8%**.
>
> “OpenAIs RFT 平台让我们得以访问全球最优秀的通用推理模型，并配备工具集，在对我们业务重要的问题领域上增强该推理能力。”
>
> —[Runloop](https://www.runloop.ai/)



#### 在调度管理器中正确处理冲突和重复项



使用场景

    

> **公司**: [Milo](https://www.joinmilo.com) 通过将杂乱输入（如包含待办事项的文本对话、学校通讯 PDF、每周提醒、体育赛程邮件）转化为可靠的日历和列表操作，帮助忙碌的父母管理混乱的家庭日程。
>
> **待解决的问题**：基础 GPT-4o 提示和 SFT 未达到信任阈值。
>
> **目标**：Milo 使用 RFT 来正确创建编码任务，如事件与列表分类、重复规则生成、准确的更新和删除、冲突检测以及严格的输出格式。他们定义了一个评分器，用于检查生成的条目对象是否完整、分类是否正确，以及是否重复或存在日历冲突。


  

  

    
结果

    

> 结果显示各项指标均有所提升，平均正确率得分 **从 0.86 提高到 0.91**，而最具挑战性的场景从 **0.46 提高到 0.71** （其中满分=1）。
>
> “准确率不仅仅是一个指标——它是忙碌家长们的一颗定心丸。这仍处于早期阶段，但基础性能有了如此重要的改进，我们能够更积极地推进复杂的推理需求。”
>
> “处理和支持家庭动态涉及理解数据的细微含义。以冲突为例——知道伊桑的足球课与艾拉的独奏会冲突，是因为爸爸必须开车送两个孩子，这比简单的时间重叠要深入得多。”
>
> —[Milo](https://www.joinmilo.com)，面向家庭的 AI 日程安排工具



### 2. 将事实提取为整洁格式

这些任务通常涉及微妙区别，需要清晰的分类指南。成功的框架设计需要通过领域专家共识来定义明确且分层的标注方案。若缺乏一致性共识，评分信号会变得嘈杂，削弱 RFT 的有效性。

#### 分配 ICD-10 医疗代码



使用场景

    

> **公司**: [Ambience](https://www.ambiencehealthcare.com) 是一个AI平台，为临床医生消除行政负担，并确保跨100多个专科的准确、合规文档记录，帮助医生专注于患者护理，同时提高文档质量并降低医疗系统的合规风险。
>
> **要解决的问题**：ICD-10编码是医学中最复杂的行政任务之一。每次患者就诊后，临床医生必须将每个诊断映射到约70,000个代码之一——处理付款方关于特异性、护理场所和互斥配对的特定规则。错误可能引发审计和罚款，金额可达九位数。
>
> **目标**：利用对OpenAI前沿模型的强化微调，Ambience希望训练一个推理系统，该系统能听取就诊音频，提取相关EHR上下文，并以超过专家临床医生的准确性推荐ICD-10代码。


  

  

    
结果

    

> Ambience 通过模型改进达到了可媲美人类专家的水平。
>
> 在一个涵盖数百次就诊的金标准测试集上，强化微调使模型从落后于人类转变为领先人类 **12 个百分点——消除了受训医生所犯编码错误中约四分之一的部分**:
>
> - o3-mini（基线）：0.39（-6 分）
> - 医师基线：0.45
> - RFT 微调后的 o3-mini：0.57（+12 分）
>
> 结果是实时的临床护理点编码支持，能够在降低合规风险的同时提高报销完整性。
>
> “准确的 ICD-10 选择对于合规文档编制至关重要。RFT 解锁了我们在任何基础模型上都未曾见过的编码精度新水平，并为自动化编码设立了新的标杆。”
>
> —[Ambience Healthcare](https://www.ambiencehealthcare.com)



#### 提取摘录以支持法律主张



使用案例

    

> **公司**: [Harvey](https://www.harvey.ai) 正在构建法律团队信赖的 AI——而这种信赖取决于能否从庞大的合同、法规和判例法语料库中精准检索出正确的证据。法律专业人士并不满足于仅能生成听起来合理摘要或转述答案的模型。他们要求可验证的引用——即能直接追溯到源文档的段落。
>
> **要解决的问题**：Harvey 的客户使用其模型对诉讼风险进行分类、构建法律论点，并为法律专业人士提供尽职调查支持——在这些任务中，任何一句遗漏或误引都可能改变结果。模型必须能够解析冗长、密集的法律文档，并仅提取重要的部分。
> 在实践中，这些输入往往杂乱且不一致：有些索赔表述模糊，而另一些则依赖于深藏在模板条款中的罕见法律原则。
>
> **目标**：任务要求是解读微妙的法律主张、浏览长文档，并选择附带逐字摘录的切题支持材料。


  

  

    
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


  

  

    
结果

    

> 经过强化微调后，Harvey 看到了 **F1 分数提升 20%** ：
>
> - 基线 F1：0.563
> - RFT 后 F1 - 0.6765
>
> 通过使用 RFT，Harvey 显著提升了法律事实提取的性能，超越了 GPT-4o 的效率和准确性。早期试验表明 RFT **在 93% 的对比中胜出或持平** 相对于 GPT-4o。
>
> “RFT 模型表现出与 GPT-4o 相当或更优的性能，但推理速度显著更快，对现实世界的法律应用尤为有益。
>
> —[Harvey](https://www.harvey.ai)，AI 助力法律团队



### 3. 正确应用复杂规则

该用例涉及将非结构化输入中的可验证事实或实体抽取到明确定义的架构中（例如，JSON 对象、条件代码、医疗代码、法律引用或财务指标）。

成功的抽取任务通常受益于精确、连续的评分方法——如片段级 F1 分数、模糊文本匹配指标或数值准确性检查——以评估抽取信息与真实情况的对齐准确度。定义明确的成功标准和详细评分细则。然后，模型即可实现可靠、可重复的改进。

#### 税务分析中的专家级推理



使用场景

    

> **公司**: [Accordance](https://www.accordance.com) 正在为税务、审计和 CPA 团队构建一个平台。
>
> **要解决的问题**：税务是一个高度复杂的领域，需要针对细微的事实模式和复杂的法规进行深度推理。这也是一个持续变化的领域。
>
> **目标**：Accordance 希望为复杂的税务场景构建一个高信任度系统，同时保持准确性。与传统的硬编码软件不同，其数据提取工具需要随着税务环境的变化而适应，这一点很重要。


  

  

    
评分代码

    

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


  

  

    
结果

    

> 通过与OpenAI及其内部税务专家合作，Accordance 实现了：
>
> - 近乎 **40% 的提升** 在税务分析任务中，相较于基础模型
> - 在 TaxBench 等基准测试中，性能优于所有其他领先模型
> - 经过RFT训练的模型展现出以高准确率处理高级税务场景的能力——经税务专业人士评估，Accordance 的微调模型表现出专家级推理水平，有望节省数千小时的人工工作量
>
> “与基础模型相比，我们在税务分析任务上实现了 38.89% 的提升，并在关键税务基准（包括 TaxBench）上显著优于所有其他领先模型。经过 RFT 训练的模型在处理复杂税务场景的同时保持准确性的能力，证明了强化微调——以及更广泛的人工智能——已为专业应用做好准备。最重要的是，RFT 为随着税务环境演变而持续适应奠定了基础，确保持久价值和相关性。经税务专家评估，我们微调的模型展现出了专家级的推理能力，这将节省数千个专业工时——这不仅是渐进式改进，更是税务工作方式的范式转变。”
>
> —[Accordance](https://www.accordance.com/)，AI 税务会计公司



#### 精细内容审核策略的执行



使用场景

    

> **公司**: [SafetyKit](https://www.safetykit.com) 是一个风险与合规平台，帮助组织在复杂的内容审核工作流中做出决策。
>
> **要解决的问题**：这些系统必须处理大量内容，并应用需要多步骤推理的复杂策略逻辑。由于数据量庞大且标注中存在细微差别，这类任务对通用模型来说可能难以完成。
>
> **目标**：SafetyKit 旨在用单一推理智能体（基于强化学习微调模型）替换其最复杂工作流中的多个节点。目标是在即使具有挑战性且细微的领域，也能缩短 SafetyKit 对新策略执行的上线时间。


  

  

    
结果

    

> SafetyKit 正在使用他们的 o3-mini RFT 模型来支持先进的内容审核能力，确保全球最大的人工智能聊天机器人公司之一的用户安全。他们已成功将 F1 分数提升 **从 86% 提升到 90%**，很快将取代其生产管线中的数十次 4o 调用。
>
> “SafetyKit 基于 RFT 的内容审核在细微的内容审核任务中取得了显著改进，对于在动态、真实的场景中保护用户安全至关重要。”
>
> —[SafetyKit](https://www.safetykit.com)



#### 法律文档审阅、比较与摘要



使用场景

    

> **公司**: [Thomson Reuters](https://www.thomsonreuters.com) 是一家 AI 和技术公司，通过可信内容和 工作流自动化赋能专业人士。
>
> **要解决的问题**：法律专业人士在做出任何决定之前必须阅读大量内容。Thomson Reuters 的 CoCounsel 产品旨在通过提供具备内容和行业知识的 AI 助手，帮助这些专家更快行动。驱动该工具的模型必须理解复杂的法律规则。
>
> **目标**：Thomson Reuters 旨在创建一个在法律 AI 技能方面表现出色的强化微调模型。他们使用来自三个高频使用的面向法律专业人士的 CoCounsel Legal AI 技能的专业数据集，对 RFT 进行了初步评估，以检验能否实现模型性能提升：
>
> 1. 审查文档：针对合同、记录和其他法律文件中的提问生成详细回答
> 1. 比较文档：突出两份或多份不同合同或文档之间的实质性差异
> 1. 摘要：对一份或多份文档中的最重要信息进行总结，以支持快速法律审查


  

  

    
结果

    

> ![提供示例数据并创建微调任务，以针对你的用例优化模型性能](https://cdn.openai.com/API/docs/images/thomsonreuters-results.png)
>
> “LLM 作为评判者有助于证明改进推理模型的可能性——在初步评估中，RFT 模型的表现始终优于基线 o3-mini 和 o1 模型”
>
> —[Thomson Reuters](https://www.thomsonreuters.com/)，一家人工智能与技术公司



## 评估是基础

**在实施 RFT 之前，我们强烈建议为你打算微调的任务创建并运行一个评估**。如果你打算微调的模型得分处于绝对最低或绝对最高可能分数，那么 RFT 对你不会有用。

RFT 通过强化对给定提示的更好答案来工作。如果我们无法区分不同答案的质量（即，如果它们都获得最低或最高可能分数），那么就没有可供学习训练信号。然而，如果你的评估得分介于最低和最高可能分数之间的某个范围，就有足够的数据可供使用。

一个有效的评估能揭示人类专家始终一致认同但当前前沿模型却难以应对的机会，这为 RFT 提供了一个有价值的差距来弥合。 [开始使用评估](https://developers.openai.com/api/docs/guides/evals).

## 如何从 RFT 获得更好的结果

要让微调模型看到改进，有两个主要的方面需要重新审视和完善：确保任务定义明确，以及使评分机制更加稳健。

### 重新表述或澄清你的任务

好的任务能让模型有公平的学习机会，并让你能够量化改进。

- **从模型偶尔能完成的任务开始**。RFT 的工作原理是采样多个答案，保留看起来最好的，并推动模型向这些答案靠拢。如果模型目前从未答对过，它就无法改进。
- **确保每个答案都可以被评分**。评分器必须能够读取答案并给出分数，而无需人工介入。我们支持多种 [评分器类型](https://developers.openai.com/api/docs/guides/graders)，包括自定义 Python 评分器和 LLM 评判。如果你无法用现有的评分器编写代码来评判答案，那么 RFT 就不是合适的工具。
- **消除对“正确”答案的疑虑**。如果两个细心的人经常对解决方案意见不一，说明任务过于模糊。重写提示词、补充上下文，或将任务拆分为更清晰的部分，直到领域专家达成一致。
- **限制侥幸猜测**。如果任务是只有一个明显最佳选项的单选题，模型可能靠猜就赢。增加更多选项类别、要求简短开放式文本，或调整格式使猜测代价高昂。

### 强化你的评分器

清晰、稳健的评分方案对于 RFT 至关重要。

- **生成平滑的评分，而非通过/不通过的标记**。随着答案改进而逐渐变化的评分能提供更好的训练信号。
- **防范奖励黑客**。当模型找到不依赖真实技能即可获得高分的捷径时，就会出现这种情况。
- **避免数据偏差**。若数据集中某一标签在大多数情况下出现，模型会倾向于猜测该标签。平衡数据集或提高稀有案例的权重，迫使模型进行思考。
- **当代码无法胜任时，使用LLM评判器**。对于丰富、开放式答案，让 [独立的 OpenAI 模型评分](https://developers.openai.com/api/docs/guides/graders#model-graders) 你微调模型的答案。确保你：
  - **评估评判器**：通过LLM评判器运行多个候选答案和正确答案，确保返回的评分稳定且符合偏好。
  - **提供少量示例**。在提示中包含优秀、一般和较差的答案，以提高评分器的有效性。

了解更多关于 [评分器类型](https://developers.openai.com/api/docs/guides/graders).

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和第三方资源链接，或进一步了解我们的模型与推理能力：

- [了解模型](https://developers.openai.com/api/docs/models)
- [强化微调指南](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)
- [评分器](https://developers.openai.com/api/docs/guides/graders)
- [模型优化概述](https://developers.openai.com/api/docs/guides/model-optimization)