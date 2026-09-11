# 使用 GPT-4.1

> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

## 简介

GPT-4.1 系列模型在编码、指令遵循和长上下文等能力上相较 GPT-4o 实现了重大飞跃。在本提示工程指南中，我们汇总了一系列源自大量内部测试的重要提示技巧，帮助开发者充分发挥这一新模型系列所提升的能力。

许多常见的最佳实践仍然适用于 GPT-4.1，例如提供上下文示例、尽可能具体清晰地编写指令，以及通过提示引导规划以最大化模型智能。然而，我们预计要充分发挥该模型的能力，需要对部分提示进行迁移。GPT-4.1 在训练中更倾向于严格、字面地遵循指令，而其前身模型则更倾向于较为自由地从用户和系统提示中推断意图。但这也意味着 GPT-4.1 高度可引导，能够很好地响应明确具体的提示 —— 如果模型行为与你的预期不符，几乎只需要用一句话坚定、明确地澄清你期望的行为，就足以将模型引导回正轨。

请继续阅读下文，获取可作为参考的提示示例，并请记住：虽然这些建议具有广泛的适用性，但没有任何建议是万能的。AI 工程本质上是一门经验性学科，大语言模型本质上也是非确定性的；除遵循本指南外，我们还建议你构建信息丰富的评估体系并频繁迭代，以确保你的提示工程改动切实为你的用例带来收益。

## 新增内容

- 比之前的 GPT 模型更贴近原文、更字面化的指令遵循
- 更强的编码与长上下文表现
- 在通过 API 原生方式传入 schema 时更好的工具调用能力 `tools` 字段
- 面向智能体工作流和 diff 生成的提示词迁移指南

## 迁移快速入门

- 将模型 slug 更新为 `gpt-4.1`.
- 根据你的集成方式，使用 Responses API 或 Chat Completions API。
- 移除与推理相关的参数；GPT-4.1 是非推理模型。
- 通过 API 传递工具 schema `tools` 字段，而不是将工具定义注入到提示词中。
- 检查提示词是否严格遵循字面指令，必要时添加明确的持久性和工具使用规则，并使用评估验证更改。

## 模型、API 与功能更新

- GPT-4.1 系列包含 `gpt-4.1`, `gpt-4.1-mini`, 以及 `gpt-4.1-nano`.
- GPT-4.1 拥有 1M token 的上下文窗口，并且在不进行推理步骤的情况下保持低延迟。
- 该系列支持 Responses API 和 Chat Completions API。
- GPT-4.1 和 GPT-4.1 mini 支持监督微调。
- 支持的工具包括函数调用、网页搜索、文件搜索、图像生成、代码解释器，以及远程 MCP。


## 提示最佳实践

### 1. 智能体工作流

GPT-4.1 是构建智能体工作流的理想起点。在模型训练中，我们着重提供了多样化的智能体问题求解轨迹，并且我们为该模型打造的智能体框架在 SWE-bench Verified 上为非推理模型取得了最先进的性能，解决了 55% 的问题。

### 系统提示提醒

为了充分利用 GPT-4.1 的智能体能力，我们建议在所有 智能体 提示中加入三类关键提醒。以下提示针对智能体编码 工作流 进行了专门优化，但也可以轻松修改以适配一般的智能体使用场景。

1. 持久性：用于确保模型理解自己正在进入多消息轮次，并防止它过早地将控制权交还给用户。我们的示例如下：

```text
You are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved.
```

2. 工具调用：用于鼓励模型充分利用其工具，并降低它产生幻觉或猜测答案的可能性。我们的示例如下：

```text
If you are not sure about file content or codebase structure pertaining to the user’s request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer.
```

3. 规划 \[可选\]：如果需要，这可以确保模型在文本中对每次工具调用进行明确的规划与反思，而不是仅通过串联一系列工具调用来完成任务。我们的示例如下：

```text
You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully.
```

GPT-4.1 在智能体场景下经过训练，能够非常贴近地遵循用户指令和系统提示。该模型严格遵守这三条简单指令，使我们内部的 SWE-bench Verified 得分提升了近 20% \- 因此我们强烈建议在任何 智能体 提示的开头加入针对上述三类内容的清晰提醒。总体而言，我们发现这三条指令能够将模型从聊天机器人式的状态转变为更加“积极主动”的 智能体，自主且独立地推动交互向前进行。

### 工具调用

相比之前的模型，GPT-4.1 接受了更多训练，以有效利用在 OpenAI API 请求中作为参数传入的工具。我们鼓励开发者仅使用 tools 字段来传入工具，而不是手动将工具描述注入到提示中并为工具调用编写单独的解析器，正如一些开发者在过去所做的那样。这是最大限度减少错误并确保模型在工具调用轨迹中保持分布内的最佳方式 \- 在我们自己的实验中，我们观察到使用 API 解析的工具描述相比于手动将模式注入系统提示，SWE-bench Verified 通过率提升了 2%。

开发者应当为工具清晰命名以表明其用途，并在工具的 "description" 字段中添加清晰、详细的描述。同样，对于每个工具参数，请借助良好的命名和描述来确保正确的使用方式。如果你的工具特别复杂，并且希望提供工具使用示例，我们建议你创建一个 `# Examples` 章节，在系统提示中放置这些示例，而不是将它们添加到 "description" 字段中，该字段应保持详尽但相对简洁。提供示例有助于指示何时使用工具、是否在工具调用之外包含用户文本，以及针对不同输入应使用哪些参数。请记住，你可以在 [Prompt Playground](https://platform.openai.com/playground) 中获取新工具定义的良好起点。

### 提示诱导规划与思维链

如前所述，开发者可以选择性地提示使用 GPT-4.1 构建的智能体在工具调用之间进行规划和反思，而不是在一连串不间断的工具调用中默默执行。GPT-4.1 并非推理模型 \- 这意味着它在回答之前不会生成内部的思维链 \- 但开发者可以在提示中使用上文展示的 Planning 提示组件的任意变体，引导模型生成显式的分步计划。这可以看作模型在“边想边说”。在我们使用 SWE-bench Verified 智能体任务进行的实验中，引入显式规划使通过率提升了 4%。

### 示例提示：SWE-bench Verified

下面，我们分享在 SWE-bench Verified 上取得最高分所用的智能体提示词，其中包含关于工作流和问题解决策略的详细说明。这种通用模式可用于任何智能体任务。

```python
from openai import OpenAI

client = OpenAI()

SYS_PROMPT_SWEBENCH = """
You will be tasked to fix an issue from an open-source repository.

Your thinking should be thorough and so it's fine if it's very long. You can think step by step before and after each action you decide to take.

You MUST iterate and keep going until the problem is solved.

You already have everything you need to solve this problem in the /testbed folder, even without internet connection. I want you to fully solve this autonomously before coming back to me.

Only terminate your turn when you are sure that the problem is solved. Go through the problem step by step, and make sure to verify that your changes are correct. NEVER end your turn without having solved the problem, and when you say you are going to make a tool call, make sure you ACTUALLY make the tool call, instead of ending your turn.

THE PROBLEM CAN DEFINITELY BE SOLVED WITHOUT THE INTERNET.

Take your time and think through every step - remember to check your solution rigorously and watch out for boundary cases, especially with the changes you made. Your solution must be perfect. If not, continue working on it. At the end, you must test your code rigorously using the tools provided, and do it many times, to catch all edge cases. If it is not robust, iterate more and make it perfect. Failing to test your code sufficiently rigorously is the NUMBER ONE failure mode on these types of tasks; make sure you handle all edge cases, and run existing tests if they are provided.

You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully.

# Workflow

## High-Level Problem Solving Strategy

1. Understand the problem deeply. Carefully read the issue and think critically about what is required.
2. Investigate the codebase. Explore relevant files, search for key functions, and gather context.
3. Develop a clear, step-by-step plan. Break down the fix into manageable, incremental steps.
4. Implement the fix incrementally. Make small, testable code changes.
5. Debug as needed. Use debugging techniques to isolate and resolve issues.
6. Test frequently. Run tests after each change to verify correctness.
7. Iterate until the root cause is fixed and all tests pass.
8. Reflect and validate comprehensively. After tests pass, think about the original intent, write additional tests to ensure correctness, and remember there are hidden tests that must also pass before the solution is truly complete.

Refer to the detailed sections below for more information on each step.

## 1. Deeply Understand the Problem
Carefully read the issue and think hard about a plan to solve it before coding.

## 2. Codebase Investigation
- Explore relevant files and directories.
- Search for key functions, classes, or variables related to the issue.
- Read and understand relevant code snippets.
- Identify the root cause of the problem.
- Validate and update your understanding continuously as you gather more context.

## 3. Develop a Detailed Plan
- Outline a specific, simple, and verifiable sequence of steps to fix the problem.
- Break down the fix into small, incremental changes.

## 4. Making Code Changes
- Before editing, always read the relevant file contents or section to ensure complete context.
- If a patch is not applied correctly, attempt to reapply it.
- Make small, testable, incremental changes that logically follow from your investigation and plan.

## 5. Debugging
- Make code changes only if you have high confidence they can solve the problem
- When debugging, try to determine the root cause rather than addressing symptoms
- Debug for as long as needed to identify the root cause and identify a fix
- Use print statements, logs, or temporary code to inspect program state, including descriptive statements or error messages to understand what's happening
- To test hypotheses, you can also add test statements or functions
- Revisit your assumptions if unexpected behavior occurs.

## 6. Testing
- Run tests frequently using `!python3 run_tests.py` (or equivalent).
- After each change, verify correctness by running relevant tests.
- If tests fail, analyze failures and revise your patch.
- Write additional tests if needed to capture important behaviors or edge cases.
- Ensure all tests pass before finalizing.

## 7. Final Verification
- Confirm the root cause is fixed.
- Review your solution for logic correctness and robustness.
- Iterate until you are extremely confident the fix is complete and all tests pass.

## 8. Final Reflection and Additional Testing
- Reflect carefully on the original intent of the user and the problem statement.
- Think about potential edge cases or scenarios that may not be covered by existing tests.
- Write additional tests that would need to pass to fully validate the correctness of your solution.
- Run these new tests and ensure they all pass.
- Be aware that there are additional hidden tests that must also pass for the solution to be successful.
- Do not assume the task is complete just because the visible tests pass; continue refining until you are confident the fix is robust and comprehensive.
"""

PYTHON_TOOL_DESCRIPTION = """This function is used to execute Python code or terminal commands in a stateful Jupyter notebook environment. python will respond with the output of the execution or time out after 60.0 seconds. Internet access for this session is disabled. Do not make external web requests or API calls as they will fail. Just as in a Jupyter notebook, you may also execute terminal commands by calling this function with a terminal command, prefaced with an exclamation mark.

In addition, for the purposes of this task, you can call this function with an `apply_patch` command as input.  `apply_patch` effectively allows you to execute a diff/patch against a file, but the format of the diff specification is unique to this task, so pay careful attention to these instructions. To use the `apply_patch` command, you should pass a message of the following structure as "input":

%%bash
apply_patch <<"EOF"
*** Begin Patch
[YOUR_PATCH]
*** End Patch
EOF

Where [YOUR_PATCH] is the actual content of your patch, specified in the following V4A diff format.

*** [ACTION] File: [path/to/file] -> ACTION can be one of Add, Update, or Delete.
For each snippet of code that needs to be changed, repeat the following:
[context_before] -> See below for further instructions on context.
- [old_code] -> Precede the old code with a minus sign.
+ [new_code] -> Precede the new, replacement code with a plus sign.
[context_after] -> See below for further instructions on context.

For instructions on [context_before] and [context_after]:
- By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change's [context_after] lines in the second change's [context_before] lines.
- If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs. For instance, we might have:
@@ class BaseClass
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]

- If a code block is repeated so many times in a class or function such that even a single @@ statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple `@@` statements to jump to the right context. For instance:

@@ class BaseClass
@@ 	def method():
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]

Note, then, that we do not use line numbers in this diff format, as the context is enough to uniquely identify code. An example of a message that you might pass as "input" to this function, in order to apply a patch, is shown below.

%%bash
apply_patch <<"EOF"
*** Begin Patch
*** Update File: pygorithm/searching/binary_search.py
@@ class BaseClass
@@     def search():
-        pass
+        raise NotImplementedError()

@@ class Subclass
@@     def search():
-        pass
+        raise NotImplementedError()

*** End Patch
EOF

File references can only be relative, NEVER ABSOLUTE. After the apply_patch command is run, Python will always say "Done!", regardless of whether the patch was successfully applied or not. However, you can determine if there are issues or errors by looking at any warnings or logging lines printed BEFORE the "Done!" is output.
"""

python_bash_patch_tool = {
    "type": "function",
    "name": "python",
    "description": PYTHON_TOOL_DESCRIPTION,
    "parameters": {
        "type": "object",
        "strict": True,
        "properties": {
            "input": {
                "type": "string",
                "description": " The Python code, terminal command (prefaced by exclamation mark), or apply_patch command that you wish to execute.",
            }
        },
        "required": ["input"],
    },
}

# Additional harness setup:
# - Add your repo to /testbed
# - Add your issue to the first user message
# - Note: Even though we used a single tool for python, bash, and apply_patch, we generally recommend defining more granular tools that are focused on a single function

response = client.responses.create(
    instructions=SYS_PROMPT_SWEBENCH,
    model="gpt-4.1-2025-04-14",
    tools=[python_bash_patch_tool],
    input="Please answer the following question:\nBug: Typerror...",
)

response.to_dict()["output"]
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

String agentInstructions =
    """
    You will be tasked to fix an issue from an open-source repository.

    Your thinking should be thorough and so it's fine if it's very long. You can think step by step before and after each action you decide to take.

    You MUST iterate and keep going until the problem is solved.

    You already have everything you need to solve this problem in the /testbed folder, even without internet connection. I want you to fully solve this autonomously before coming back to me.

    Only terminate your turn when you are sure that the problem is solved. Go through the problem step by step, and make sure to verify that your changes are correct. NEVER end your turn without having solved the problem, and when you say you are going to make a tool call, make sure you ACTUALLY make the tool call, instead of ending your turn.

    THE PROBLEM CAN DEFINITELY BE SOLVED WITHOUT THE INTERNET.

    Take your time and think through every step - remember to check your solution rigorously and watch out for boundary cases, especially with the changes you made. Your solution must be perfect. If not, continue working on it. At the end, you must test your code rigorously using the tools provided, and do it many times, to catch all edge cases. If it is not robust, iterate more and make it perfect. Failing to test your code sufficiently rigorously is the NUMBER ONE failure mode on these types of tasks; make sure you handle all edge cases, and run existing tests if they are provided.

    You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully.

    # Workflow

    ## High-Level Problem Solving Strategy

    1. Understand the problem deeply. Carefully read the issue and think critically about what is required.
    2. Investigate the codebase. Explore relevant files, search for key functions, and gather context.
    3. Develop a clear, step-by-step plan. Break down the fix into manageable, incremental steps.
    4. Implement the fix incrementally. Make small, testable code changes.
    5. Debug as needed. Use debugging techniques to isolate and resolve issues.
    6. Test frequently. Run tests after each change to verify correctness.
    7. Iterate until the root cause is fixed and all tests pass.
    8. Reflect and validate comprehensively. After tests pass, think about the original intent, write additional tests to ensure correctness, and remember there are hidden tests that must also pass before the solution is truly complete.

    Refer to the detailed sections below for more information on each step.

    ## 1. Deeply Understand the Problem
    Carefully read the issue and think hard about a plan to solve it before coding.

    ## 2. Codebase Investigation
    - Explore relevant files and directories.
    - Search for key functions, classes, or variables related to the issue.
    - Read and understand relevant code snippets.
    - Identify the root cause of the problem.
    - Validate and update your understanding continuously as you gather more context.

    ## 3. Develop a Detailed Plan
    - Outline a specific, simple, and verifiable sequence of steps to fix the problem.
    - Break down the fix into small, incremental changes.

    ## 4. Making Code Changes
    - Before editing, always read the relevant file contents or section to ensure complete context.
    - If a patch is not applied correctly, attempt to reapply it.
    - Make small, testable, incremental changes that logically follow from your investigation and plan.

    ## 5. Debugging
    - Make code changes only if you have high confidence they can solve the problem
    - When debugging, try to determine the root cause rather than addressing symptoms
    - Debug for as long as needed to identify the root cause and identify a fix
    - Use print statements, logs, or temporary code to inspect program state, including descriptive statements or error messages to understand what's happening
    - To test hypotheses, you can also add test statements or functions
    - Revisit your assumptions if unexpected behavior occurs.

    ## 6. Testing
    - Run tests frequently using `!python3 run_tests.py` (or equivalent).
    - After each change, verify correctness by running relevant tests.
    - If tests fail, analyze failures and revise your patch.
    - Write additional tests if needed to capture important behaviors or edge cases.
    - Ensure all tests pass before finalizing.

    ## 7. Final Verification
    - Confirm the root cause is fixed.
    - Review your solution for logic correctness and robustness.
    - Iterate until you are extremely confident the fix is complete and all tests pass.

    ## 8. Final Reflection and Additional Testing
    - Reflect carefully on the original intent of the user and the problem statement.
    - Think about potential edge cases or scenarios that may not be covered by existing tests.
    - Write additional tests that would need to pass to fully validate the correctness of your solution.
    - Run these new tests and ensure they all pass.
    - Be aware that there are additional hidden tests that must also pass for the solution to be successful.
    - Do not assume the task is complete just because the visible tests pass; continue refining until you are confident the fix is robust and comprehensive.
    """;
String pythonToolDescription =
    """
    This function is used to execute Python code or terminal commands in a stateful Jupyter notebook environment. python will respond with the output of the execution or time out after 60.0 seconds. Internet access for this session is disabled. Do not make external web requests or API calls as they will fail. Just as in a Jupyter notebook, you may also execute terminal commands by calling this function with a terminal command, prefaced with an exclamation mark.

    In addition, for the purposes of this task, you can call this function with an `apply_patch` command as input.  `apply_patch` effectively allows you to execute a diff/patch against a file, but the format of the diff specification is unique to this task, so pay careful attention to these instructions. To use the `apply_patch` command, you should pass a message of the following structure as "input":

    %%bash
    apply_patch <<"EOF"
    *** Begin Patch
    [YOUR_PATCH]
    *** End Patch
    EOF

    Where [YOUR_PATCH] is the actual content of your patch, specified in the following V4A diff format.

    *** [ACTION] File: [path/to/file] -> ACTION can be one of Add, Update, or Delete.
    For each snippet of code that needs to be changed, repeat the following:
    [context_before] -> See below for further instructions on context.
    - [old_code] -> Precede the old code with a minus sign.
    + [new_code] -> Precede the new, replacement code with a plus sign.
    [context_after] -> See below for further instructions on context.

    For instructions on [context_before] and [context_after]:
    - By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change's [context_after] lines in the second change's [context_before] lines.
    - If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs. For instance, we might have:
    @@ class BaseClass
    [3 lines of pre-context]
    - [old_code]
    + [new_code]
    [3 lines of post-context]

    - If a code block is repeated so many times in a class or function such that even a single @@ statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple `@@` statements to jump to the right context. For instance:

    @@ class BaseClass
    @@ 	def method():
    [3 lines of pre-context]
    - [old_code]
    + [new_code]
    [3 lines of post-context]

    Note, then, that we do not use line numbers in this diff format, as the context is enough to uniquely identify code. An example of a message that you might pass as "input" to this function, in order to apply a patch, is shown below.

    %%bash
    apply_patch <<"EOF"
    *** Begin Patch
    *** Update File: pygorithm/searching/binary_search.py
    @@ class BaseClass
    @@     def search():
    -        pass
    +        raise NotImplementedError()

    @@ class Subclass
    @@     def search():
    -        pass
    +        raise NotImplementedError()

    *** End Patch
    EOF

    File references can only be relative, NEVER ABSOLUTE. After the apply_patch command is run, Python will always say "Done!", regardless of whether the patch was successfully applied or not. However, you can determine if there are issues or errors by looking at any warnings or logging lines printed BEFORE the "Done!" is output.
    """;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-4.1-2025-04-14")
        .instructions(agentInstructions)
        .input("Please answer the following question:\nBug: Typerror...")
        .addTool(
            FunctionTool.builder()
                .name("python")
                .description(pythonToolDescription)
                .parameters(
                    FunctionTool.Parameters.builder()
                        .putAdditionalProperty("type", JsonValue.from("object"))
                        .putAdditionalProperty(
                            "properties",
                            JsonValue.from(
                                Map.of(
                                    "input",
                                    Map.of(
                                        "type", "string",
                                        "description",
                                            "The Python code, terminal command, or apply_patch command to execute."))))
                        .putAdditionalProperty("required", JsonValue.from(List.of("input")))
                        .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                        .build())
                .strict(true)
                .build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-4.1",
  instructions: "Act as a coding agent. Inspect the reported failure, identify the smallest correct change, and explain how you would verify it.",
  input: "The parser rejects an empty optional field even though the schema permits it. Diagnose the likely validation bug."
)

puts(response.output_text)
```


```text
[{'id': 'msg_67fe92df26ac819182ffafce9ff4e4fc07c7e06242e51f8b',
  'content': [{'annotations': [],
    'text': "Thank you for the report, but “Typerror” is too vague for me to start debugging right away.\n\n**To make progress, I need to:**\n1. Find the exact error message text (e.g. `'TypeError: ...'`).\n2. Find which file and which line/function/class the error occurred in.\n3. Figure out what triggered the error (test file, usage, reproduction steps).\n4. Find the root cause and details.\n\n**Next steps:**\n- Investigate error/log/test output files for a Python `TypeError` message.\n- Examine the relevant code sections for problematic type usage.\n- If possible, reproduce the bug locally.\n\n**Plan:**\n- First, I will search for test files and log output in the `/testbed` directory that may contain the full error message and stack trace.\n\nLet’s start by listing the contents of the `/testbed` directory to look for clues.",
    'type': 'output_text'}],
  'role': 'assistant',
  'status': 'completed',
  'type': 'message'},
 {'arguments': '{"input":"!ls -l /testbed"}',
  'call_id': 'call_frnxyJgKi5TsBem0nR9Zuzdw',
  'name': 'python',
  'type': 'function_call',
  'id': 'fc_67fe92e3da7081918fc18d5c96dddc1c07c7e06242e51f8b',
  'status': 'completed'}]
```

### 2. 长上下文

GPT-4.1 拥有性能出色的 1M token 输入上下文窗口，适用于各种长上下文任务，包括结构化文档解析、重新排序、在忽略无关上下文的同时选取相关信息，以及使用上下文执行多跳推理。

### 最佳上下文大小

我们在最长可达 1M token 的完整上下文的大海捞针评估中观察到了非常好的性能，并且在涉及相关与不相关代码及其他文档混合的复杂任务中也观察到了非常强的性能。但是，当需要检索更多条目，或需要进行需要了解整个上下文状态的复杂推理（例如执行图搜索）时，长上下文性能可能会下降。

### 调优上下文依赖度

考虑回答问题可能需要的外部世界知识与内部世界知识的组合。有时让模型使用自身的一些知识来关联概念或进行逻辑跳跃是重要的，而在其他情况下，仅使用所提供的上下文是更可取的

```text
# Instructions
// for internal knowledge
- Only use the documents in the provided External Context to answer the User Query. If you don't know the answer based on this context, you must respond "I don't have the information needed to answer that", even if a user insists on you answering the question.
// For internal and external knowledge
- By default, use the provided external context to answer the User Query, but if other basic knowledge is needed to answer, and you're confident in the answer, you can use some of your own knowledge to help answer the question.
```

### 提示词组织

在长上下文使用场景中，指令和上下文的位置会影响性能。如果你的提示中包含较长的上下文，理想的做法是将指令同时放在所提供的上下文的开头和结尾，我们发现这种做法比仅放在上文或下文效果更好。如果你希望指令只出现一次，那么放在所提供的上下文上方效果优于放在下方。

### 3. 思维链

如上所述，GPT-4.1 不是推理模型，但让模型一步步思考（称为“思维链”）可以让模型将问题拆分为更易处理的片段、逐个解决，并提升整体输出质量，代价是会使用更多输出 token，从而带来更高的成本和延迟。该模型已针对智能体式推理和现实世界的问题求解进行了训练，因此不需要大量提示即可表现良好。

建议你在提示末尾加入以下基础思维链指令：

```text
...

First, think carefully step by step about what documents are needed to answer the query. Then, print out the TITLE and ID of each document. Then, format the IDs into a list.
```

在此基础上，你应该通过审视具体示例和评测中的失败案例来改进思维链（CoT）提示，并使用更明确的指令来纠正系统性的规划和推理错误。在不受限的 CoT 提示中，模型尝试的策略可能存在差异；如果你发现某种方法效果良好，可以将其固化到提示中。一般来说，错误往往源于对用户意图的理解偏差、上下文收集或分析不足，以及逐步推理不充分或错误；请留意这些问题，并尝试通过更具针对性的指令加以解决。

下面是一个示例提示，指示模型在着手回答前更有条理地分析用户意图并考虑相关上下文。

```text
# Reasoning Strategy
1. Query Analysis: Break down and analyze the query until you're confident about what it might be asking. Consider the provided context to help clarify any ambiguous or confusing information.
2. Context Analysis: Carefully select and analyze a large set of potentially relevant documents. Optimize for recall - it's okay if some are irrelevant, but the correct documents must be in this list, otherwise your final answer will be wrong. Analysis steps for each:
	a. Analysis: An analysis of how it may or may not be relevant to answering the query.
	b. Relevance rating: [high, medium, low, none]
3. Synthesis: summarize which documents are most relevant and why, including all documents with a relevance rating of medium or higher.

# User Question
{user_question}

# External Context
{external_context}

First, think carefully step by step about what documents are needed to answer the query, closely adhering to the provided Reasoning Strategy. Then, print out the TITLE and ID of each document. Then, format the IDs into a list.
```

### 4. 指令遵循

GPT-4.1 表现出出色的指令遵循能力，开发者可以利用这一点，针对其特定用例精确地塑造和控制输出。开发者通常会广泛地通过提示词来引导智能体推理步骤、响应语气和风格、工具调用信息、输出格式、需要避免的话题等。然而，由于该模型会更字面地遵循指令，开发者可能需要明确指定该做什么或不该做什么。此外，为其他模型优化的现有提示词可能无法直接用于此模型，因为现有指令会被更严格地遵循，原本被强烈推断出的隐式规则将不再被如此强烈地推断出来。

### 推荐工作流

以下是我们推荐的用于在提示中开发和调试指令的工作流：

1. 从一个总的“Response Rules”或“Instructions”部分开始，给出高层指导并配合要点列表。
2. 如果你希望更改更具体的行为，可以新增一个部分来为该类别指定更多细节，例如 `# Sample Phrases`.
3. 如果你希望模型在其工作流中遵循特定的步骤，请添加有序列表，并指示模型按照这些步骤执行。
4. 如果行为仍然未按预期工作：
   1. 检查是否存在相互矛盾、表述不清或错误的指令和示例。如果指令之间存在冲突，GPT-4.1 通常倾向于遵循更靠近提示末尾的那一条。
   2. 添加能够展示所需行为的示例；确保示例中展示的任何重要行为也在你的规则中被引用。
   3. 通常没有必要使用全大写或其他奖励、小费之类的激励手段。建议从不使用这些开始，只有在你的特定提示确实必要时再采用。请注意，如果你的现有提示中包含了这些技巧，可能反而会让 GPT-4.1 过于严格地关注它们。

_请注意，使用你偏好的 AI 驱动 IDE 可以非常有帮助地迭代提示，包括检查一致性或冲突、添加示例，或进行连贯的更新（例如添加一条指令并更新指令以演示该指令）。_

### 常见故障模式

这些失败模式并非 GPT-4.1 独有，我们在此分享它们是为了提供通用的参考并便于调试。

- 指示模型始终遵循特定行为有时会带来副作用。例如，如果告诉模型“你必须在回复用户之前先调用工具”，那么在信息不足时，模型可能会凭空编造工具输入，或以空值调用该工具。补充说明“如果没有足够的信息来调用工具，就向用户询问你所需要的信息”，应有助于缓解此问题。
- 当提供示例短语时，模型可能逐字复用这些引文，并开始让用户觉得重复。请明确指示模型根据需要变换措辞。
- 在缺乏明确指令的情况下，一些模型可能会热衷于附加解释性文本来阐述其决策过程，或在回复中输出超出预期的格式。可通过提供指令并辅以示例来加以缓解。

### 示例提示词：客户服务

这演示了一个虚构的客户服务的最佳实践智能体。请注意规则的多样性、具体性、用于提供更多详情的额外章节的使用，以及一个用于展示融合了所有先前规则的精确行为的示例。

尝试运行以下 notebook 单元——你应该会看到一条用户消息和一个工具调用，用户消息应以问候语开头，然后回显他们的答案，接着提到他们即将调用一个工具。可以尝试修改指令以塑造模型行为，或者尝试其他用户消息，来测试指令遵循性能。

```python
SYS_PROMPT_CUSTOMER_SERVICE = """You are a helpful customer service agent working for NewTelco, helping a user efficiently fulfill their request while adhering closely to provided guidelines.

# Instructions
- Always greet the user with "Hi, you've reached NewTelco, how can I help you?"
- Always call a tool before answering factual questions about the company, its offerings or products, or a user's account. Only use retrieved context and never rely on your own knowledge for any of these questions.
    - However, if you don't have enough information to properly call the tool, ask the user for the information you need.
- Escalate to a human if the user requests.
- Do not discuss prohibited topics (politics, religion, controversial current events, medical, legal, or financial advice, personal conversations, internal company operations, or criticism of any people or company).
- Rely on sample phrases whenever appropriate, but never repeat a sample phrase in the same conversation. Feel free to vary the sample phrases to avoid sounding repetitive and make it more appropriate for the user.
- Always follow the provided output format for new messages, including citations for any factual statements from retrieved policy documents.
- If you're going to call a tool, always message the user with an appropriate message before and after calling the tool.
- Maintain a professional and concise tone in all responses, and use emojis between sentences.
- If you've resolved the user's request, ask if there's anything else you can help with

# Precise Response Steps (for each response)
1. If necessary, call tools to fulfill the user's desired action. Always message the user before and after calling a tool to keep them in the loop.
2. In your response to the user
    a. Use active listening and echo back what you heard the user ask for.
    b. Respond appropriately given the above guidelines.

# Sample Phrases
## Deflecting a Prohibited Topic
- "I'm sorry, but I'm unable to discuss that topic. Is there something else I can help you with?"
- "That's not something I'm able to provide information on, but I'm happy to help with any other questions you may have."

## Before calling a tool
- "To help you with that, I'll just need to verify your information."
- "Let me check that for you—one moment, please."
- "I'll retrieve the latest details for you now."

## After calling a tool
- "Okay, here's what I found: [response]"
- "So here's what I found: [response]"

# Output Format
- Always include your final response to the user.
- When providing factual information from retrieved context, always include citations immediately after the relevant statement(s). Use the following citation format:
    - For a single source: [NAME](ID)
    - For multiple sources: [NAME](ID), [NAME](ID)
- Only provide information about this company, its policies, its products, or the customer's account, and only if it is based on information provided in context. Do not answer questions outside this scope.

# Example
## User
Can you tell me about your family plan options?

## Assistant Response 1
### Message
"Hi, you've reached NewTelco, how can I help you? 😊🎉\n\nYou'd like to know about our family plan options. 🤝 Let me check that for you—one moment, please. 🚀"

### Tool Calls
lookup_policy_document(topic="family plan options")

// After tool call, the assistant would follow up with:

## Assistant Response 2 (after tool call)
### Message
"Okay, here's what I found: 🎉 Our family plan allows up to 5 lines with shared data and a 10% discount for each additional line [Family Plan Policy](ID-010). 📱 Is there anything else I can help you with today? 😊"
"""

get_policy_doc = {
    "type": "function",
    "name": "lookup_policy_document",
    "description": "Tool to look up internal documents and policies by topic or keyword.",
    "parameters": {
        "strict": True,
        "type": "object",
        "properties": {
            "topic": {
                "type": "string",
                "description": "The topic or keyword to search for in company policies or documents.",
            },
        },
        "required": ["topic"],
        "additionalProperties": False,
    },
}

get_user_acct = {
    "type": "function",
    "name": "get_user_account_info",
    "description": "Tool to get user account information",
    "parameters": {
        "strict": True,
        "type": "object",
        "properties": {
            "phone_number": {
                "type": "string",
                "description": "Formatted as '(xxx) xxx-xxxx'",
            },
        },
        "required": ["phone_number"],
        "additionalProperties": False,
    },
}

response = client.responses.create(
    instructions=SYS_PROMPT_CUSTOMER_SERVICE,
    model="gpt-4.1-2025-04-14",
    tools=[get_policy_doc, get_user_acct],
    input="How much will it cost for international service? I'm traveling to France.",
    # input="Why was my last bill so high?"
)

response.to_dict()["output"]
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

String customerServiceInstructions =
    """
    You are a helpful customer service agent working for NewTelco, helping a user efficiently fulfill their request while adhering closely to provided guidelines.

    # Instructions
    - Always greet the user with "Hi, you've reached NewTelco, how can I help you?"
    - Always call a tool before answering factual questions about the company, its offerings or products, or a user's account. Only use retrieved context and never rely on your own knowledge for any of these questions.
        - However, if you don't have enough information to properly call the tool, ask the user for the information you need.
    - Escalate to a human if the user requests.
    - Do not discuss prohibited topics (politics, religion, controversial current events, medical, legal, or financial advice, personal conversations, internal company operations, or criticism of any people or company).
    - Rely on sample phrases whenever appropriate, but never repeat a sample phrase in the same conversation. Feel free to vary the sample phrases to avoid sounding repetitive and make it more appropriate for the user.
    - Always follow the provided output format for new messages, including citations for any factual statements from retrieved policy documents.
    - If you're going to call a tool, always message the user with an appropriate message before and after calling the tool.
    - Maintain a professional and concise tone in all responses, and use emojis between sentences.
    - If you've resolved the user's request, ask if there's anything else you can help with

    # Precise Response Steps (for each response)
    1. If necessary, call tools to fulfill the user's desired action. Always message the user before and after calling a tool to keep them in the loop.
    2. In your response to the user
        a. Use active listening and echo back what you heard the user ask for.
        b. Respond appropriately given the above guidelines.

    # Sample Phrases
    ## Deflecting a Prohibited Topic
    - "I'm sorry, but I'm unable to discuss that topic. Is there something else I can help you with?"
    - "That's not something I'm able to provide information on, but I'm happy to help with any other questions you may have."

    ## Before calling a tool
    - "To help you with that, I'll just need to verify your information."
    - "Let me check that for you—one moment, please."
    - "I'll retrieve the latest details for you now."

    ## After calling a tool
    - "Okay, here's what I found: [response]"
    - "So here's what I found: [response]"

    # Output Format
    - Always include your final response to the user.
    - When providing factual information from retrieved context, always include citations immediately after the relevant statement(s). Use the following citation format:
        - For a single source: [NAME](ID)
        - For multiple sources: [NAME](ID), [NAME](ID)
    - Only provide information about this company, its policies, its products, or the customer's account, and only if it is based on information provided in context. Do not answer questions outside this scope.

    # Example
    ## User
    Can you tell me about your family plan options?

    ## Assistant Response 1
    ### Message
    "Hi, you've reached NewTelco, how can I help you? 😊🎉

    You'd like to know about our family plan options. 🤝 Let me check that for you—one moment, please. 🚀"

    ### Tool Calls
    lookup_policy_document(topic="family plan options")

    // After tool call, the assistant would follow up with:

    ## Assistant Response 2 (after tool call)
    ### Message
    "Okay, here's what I found: 🎉 Our family plan allows up to 5 lines with shared data and a 10% discount for each additional line [Family Plan Policy](ID-010). 📱 Is there anything else I can help you with today? 😊"
    """;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-4.1-2025-04-14")
        .instructions(customerServiceInstructions)
        .input("How much will it cost for international service? I'm traveling to France.")
        .addTool(
            customerServiceTool(
                "lookup_policy_document",
                "Tool to look up internal documents and policies by topic or keyword.",
                "topic",
                "The topic or keyword to search for in company policies or documents."))
        .addTool(
            customerServiceTool(
                "get_user_account_info",
                "Tool to get user account information",
                "phone_number",
                "Formatted as '(xxx) xxx-xxxx'"))
        .build();

client.responses().create(params).output().forEach(System.out::println);

private static FunctionTool customerServiceTool(
    String name, String description, String parameter, String parameterDescription) {
  return FunctionTool.builder()
      .name(name)
      .description(description)
      .strict(true)
      .parameters(
          FunctionTool.Parameters.builder()
              .putAdditionalProperty("type", JsonValue.from("object"))
              .putAdditionalProperty(
                  "properties",
                  JsonValue.from(
                      Map.of(
                          parameter,
                          Map.of("type", "string", "description", parameterDescription))))
              .putAdditionalProperty("required", JsonValue.from(List.of(parameter)))
              .putAdditionalProperty("additionalProperties", JsonValue.from(false))
              .build())
      .build();
}
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-4.1",
  instructions: "You are a customer service assistant. Confirm the customer's goal, use only supplied account facts, and clearly explain the next action.",
  input: "A customer says a replacement order still has not shipped. Draft a concise response."
)

puts(response.output_text)
```


```text
[{'id': 'msg_67fe92d431548191b7ca6cd604b4784b06efc5beb16b3c5e',
  'content': [{'annotations': [],
    'text': "Hi, you've reached NewTelco, how can I help you? 🌍✈️\n\nYou'd like to know the cost of international service while traveling to France. 🇫🇷 Let me check the latest details for you—one moment, please. 🕑",
    'type': 'output_text'}],
  'role': 'assistant',
  'status': 'completed',
  'type': 'message'},
 {'arguments': '{"topic":"international service cost France"}',
  'call_id': 'call_cF63DLeyhNhwfdyME3ZHd0yo',
  'name': 'lookup_policy_document',
  'type': 'function_call',
  'id': 'fc_67fe92d5d6888191b6cd7cf57f707e4606efc5beb16b3c5e',
  'status': 'completed'}]
```

### 5. 通用建议

### 提示结构

作为参考，下面提供了一个用于构建提示词的良好起点。

```text
# Role and Objective

# Instructions

## Sub-categories for more detailed instructions

# Reasoning Steps

# Output Format

# Examples
## Example 1

# Context

# Final instructions and prompt to think step by step
```

可根据需要添加或移除章节，并通过实验确定最适合你使用场景的方案。

### 分隔符

以下是一些为你的提示选择最佳分隔符的通用指南。有关该上下文类型的特殊注意事项，请参阅长上下文部分。

1. Markdown：我们建议从这里开始，并使用 Markdown 标题来组织主要章节和子章节（包括更深的层级，一直到 H4 及以上）。使用行内反引号或反引号代码块来精确包裹代码，并按需使用标准的编号列表或项目符号列表。
2. XML：这些标签的表现也很好，并且我们在这个模型中提升了对 XML 信息的遵循度。XML 可以方便地精确包裹一个包含开始和结束标记的章节，为标签添加元数据以提供额外上下文，并支持嵌套。下面是一个使用 XML 标签在示例章节中嵌套示例的示例，其中每个示例都包含输入和输出：

```text
<examples>
<example1 type="Abbreviate">
<input>San Francisco</input>
<output>- SF</output>
</example1>
</examples>
```

3. JSON 结构化程度很高，模型对其理解良好，尤其是在编程场景中。不过它可能更加冗长，并且需要进行字符转义，这会带来额外的开销。

专门用于向输入上下文添加大量文档或文件的指南：

- XML 在我们的长上下文测试中表现良好。
  - 示例： `<doc id='1' title='The Fox'>The quick brown fox jumps over the lazy dog</doc>`
- Lee 等人（[参考文献](https://arxiv.org/pdf/2406.13121)）提出的这种格式在我们的长上下文测试中同样表现良好。
  - 示例： `ID: 1 | TITLE: The Fox | CONTENT: The quick brown fox jumps over the lazy dog`
- JSON 的表现尤其糟糕。
  - 示例： `[{'id': 1, 'title': 'The Fox', 'content': 'The quick brown fox jumped over the lazy dog'}]`

该模型经过训练，能够稳健地理解各种格式的结构。通常，你可以自行判断，并思考哪种方式能让信息清晰且对模型“突出”。例如，如果你检索的文档包含大量 XML，那么基于 XML 的分隔符效果可能较差。

### 注意事项

- 在某些罕见情况下，我们观察到模型会抗拒生成非常长且重复的输出，例如逐个分析数百个项目。如果你的用例确实需要这样做，请明确指示模型完整输出这些信息，并考虑拆分问题或采用更简洁的方法。
- 我们曾发现一些罕见的并行工具调用出错的情况。建议你进行测试，并在出现问题时考虑将 [parallel_tool_calls](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-parallel_tool_calls) 参数设置为 false。

### 附录：生成与应用文件差异 (diff)

开发者向我们反馈，准确且格式规范的 diff 生成能力是支持编码相关任务的关键能力。为此，GPT-4.1 系列相较于之前的 GPT 模型大幅提升了 diff 能力。此外，尽管 GPT-4.1 在给定清晰指令和示例的情况下，能够针对任何格式生成高质量的 diff，我们仍在此开源一种推荐的 diff 格式，模型已针对该格式进行了大量训练。我们希望，特别是对于刚刚入门的开发者，这将大大减少自行创建 diff 时的猜测工作。

### 应用补丁

请参阅下面的示例，了解一个正确应用我们推荐的工具调用的提示。

```python
APPLY_PATCH_TOOL_DESC = """This is a custom utility that makes it more convenient to add, remove, move, or edit code files. `apply_patch` effectively allows you to execute a diff/patch against a file, but the format of the diff specification is unique to this task, so pay careful attention to these instructions. To use the `apply_patch` command, you should pass a message of the following structure as "input":

%%bash
apply_patch <<"EOF"
*** Begin Patch
[YOUR_PATCH]
*** End Patch
EOF

Where [YOUR_PATCH] is the actual content of your patch, specified in the following V4A diff format.

*** [ACTION] File: [path/to/file] -> ACTION can be one of Add, Update, or Delete.
For each snippet of code that needs to be changed, repeat the following:
[context_before] -> See below for further instructions on context.
- [old_code] -> Precede the old code with a minus sign.
+ [new_code] -> Precede the new, replacement code with a plus sign.
[context_after] -> See below for further instructions on context.

For instructions on [context_before] and [context_after]:
- By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change’s [context_after] lines in the second change’s [context_before] lines.
- If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs. For instance, we might have:
@@ class BaseClass
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]

- If a code block is repeated so many times in a class or function such that even a single @@ statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple `@@` statements to jump to the right context. For instance:

@@ class BaseClass
@@ 	def method():
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]

Note, then, that we do not use line numbers in this diff format, as the context is enough to uniquely identify code. An example of a message that you might pass as "input" to this function, in order to apply a patch, is shown below.

%%bash
apply_patch <<"EOF"
*** Begin Patch
*** Update File: pygorithm/searching/binary_search.py
@@ class BaseClass
@@     def search():
-          pass
+          raise NotImplementedError()

@@ class Subclass
@@     def search():
-          pass
+          raise NotImplementedError()

*** End Patch
EOF
"""

APPLY_PATCH_TOOL = {
    "name": "apply_patch",
    "description": APPLY_PATCH_TOOL_DESC,
    "parameters": {
        "type": "object",
        "properties": {
            "input": {
                "type": "string",
                "description": " The apply_patch command that you wish to execute.",
            }
        },
        "required": ["input"],
    },
}
```

```ruby
require "json"

APPLY_PATCH_TOOL_DESC = <<~PROMPT
  This is a custom utility that makes it more convenient to add, remove, move, or edit code files. `apply_patch` effectively allows you to execute a diff/patch against a file, but the format of the diff specification is unique to this task, so pay careful attention to these instructions. To use the `apply_patch` command, you should pass a message of the following structure as "input":

  %%bash
  apply_patch <<"EOF"
  *** Begin Patch
  [YOUR_PATCH]
  *** End Patch
  EOF

  Where [YOUR_PATCH] is the actual content of your patch, specified in the following V4A diff format.

  *** [ACTION] File: [path/to/file] -> ACTION can be one of Add, Update, or Delete.
  For each snippet of code that needs to be changed, repeat the following:
  [context_before] -> See below for further instructions on context.
  - [old_code] -> Precede the old code with a minus sign.
  + [new_code] -> Precede the new, replacement code with a plus sign.
  [context_after] -> See below for further instructions on context.

  For instructions on [context_before] and [context_after]:
  - By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change’s [context_after] lines in the second change’s [context_before] lines.
  - If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs. For instance, we might have:
  @@ class BaseClass
  [3 lines of pre-context]
  - [old_code]
  + [new_code]
  [3 lines of post-context]

  - If a code block is repeated so many times in a class or function such that even a single @@ statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple `@@` statements to jump to the right context. For instance:

  @@ class BaseClass
  @@ 	def method():
  [3 lines of pre-context]
  - [old_code]
  + [new_code]
  [3 lines of post-context]

  Note, then, that we do not use line numbers in this diff format, as the context is enough to uniquely identify code. An example of a message that you might pass as "input" to this function, in order to apply a patch, is shown below.

  %%bash
  apply_patch <<"EOF"
  *** Begin Patch
  *** Update File: pygorithm/searching/binary_search.py
  @@ class BaseClass
  @@     def search():
  -          pass
  +          raise NotImplementedError()

  @@ class Subclass
  @@     def search():
  -          pass
  +          raise NotImplementedError()

  *** End Patch
  EOF

PROMPT

tool = {
  name: "apply_patch",
  description: APPLY_PATCH_TOOL_DESC,
  parameters: {
    type: "object",
    properties: {
      input: {
        type: "string",
        description: "The apply_patch command to execute."
      }
    },
    required: ["input"]
  }
}
puts(JSON.generate(tool))
```


### 参考实现：apply_patch.py

下面是我们在模型训练中使用的 apply_patch 工具的参考实现。你需要将其设为可执行文件，并提供为 \`apply_patch\` 从模型将执行命令的 shell 中：

```python
#!/usr/bin/env python3

"""
A self-contained **pure-Python 3.9+** utility for applying human-readable
“pseudo-diff” patch files to a collection of text files.
"""

from __future__ import annotations

import pathlib
from dataclasses import dataclass, field
from enum import Enum
from typing import (
    Callable,
    Dict,
    List,
    Optional,
    Tuple,
    Union,
)


# --------------------------------------------------------------------------- #
#  Domain objects
# --------------------------------------------------------------------------- #
class ActionType(str, Enum):
    ADD = "add"
    DELETE = "delete"
    UPDATE = "update"


@dataclass
class FileChange:
    type: ActionType
    old_content: Optional[str] = None
    new_content: Optional[str] = None
    move_path: Optional[str] = None


@dataclass
class Commit:
    changes: Dict[str, FileChange] = field(default_factory=dict)


# --------------------------------------------------------------------------- #
#  Exceptions
# --------------------------------------------------------------------------- #
class DiffError(ValueError):
    """Any problem detected while parsing or applying a patch."""


# --------------------------------------------------------------------------- #
#  Helper dataclasses used while parsing patches
# --------------------------------------------------------------------------- #
@dataclass
class Chunk:
    orig_index: int = -1
    del_lines: List[str] = field(default_factory=list)
    ins_lines: List[str] = field(default_factory=list)


@dataclass
class PatchAction:
    type: ActionType
    new_file: Optional[str] = None
    chunks: List[Chunk] = field(default_factory=list)
    move_path: Optional[str] = None


@dataclass
class Patch:
    actions: Dict[str, PatchAction] = field(default_factory=dict)


# --------------------------------------------------------------------------- #
#  Patch text parser
# --------------------------------------------------------------------------- #
@dataclass
class Parser:
    current_files: Dict[str, str]
    lines: List[str]
    index: int = 0
    patch: Patch = field(default_factory=Patch)
    fuzz: int = 0

    # ------------- low-level helpers -------------------------------------- #
    def _cur_line(self) -> str:
        if self.index >= len(self.lines):
            raise DiffError("Unexpected end of input while parsing patch")
        return self.lines[self.index]

    @staticmethod
    def _norm(line: str) -> str:
        """Strip CR so comparisons work for both LF and CRLF input."""
        return line.rstrip("\r")

    # ------------- scanning convenience ----------------------------------- #
    def is_done(self, prefixes: Optional[Tuple[str, ...]] = None) -> bool:
        if self.index >= len(self.lines):
            return True
        if (
            prefixes
            and len(prefixes) > 0
            and self._norm(self._cur_line()).startswith(prefixes)
        ):
            return True
        return False

    def startswith(self, prefix: Union[str, Tuple[str, ...]]) -> bool:
        return self._norm(self._cur_line()).startswith(prefix)

    def read_str(self, prefix: str) -> str:
        """
        Consume the current line if it starts with *prefix* and return the text
        **after** the prefix.  Raises if prefix is empty.
        """
        if prefix == "":
            raise ValueError("read_str() requires a non-empty prefix")
        if self._norm(self._cur_line()).startswith(prefix):
            text = self._cur_line()[len(prefix) :]
            self.index += 1
            return text
        return ""

    def read_line(self) -> str:
        """Return the current raw line and advance."""
        line = self._cur_line()
        self.index += 1
        return line

    # ------------- public entry point -------------------------------------- #
    def parse(self) -> None:
        while not self.is_done(("*** End Patch",)):
            # ---------- UPDATE ---------- #
            path = self.read_str("*** Update File: ")
            if path:
                if path in self.patch.actions:
                    raise DiffError(f"Duplicate update for file: {path}")
                move_to = self.read_str("*** Move to: ")
                if path not in self.current_files:
                    raise DiffError(f"Update File Error - missing file: {path}")
                text = self.current_files[path]
                action = self._parse_update_file(text)
                action.move_path = move_to or None
                self.patch.actions[path] = action
                continue

            # ---------- DELETE ---------- #
            path = self.read_str("*** Delete File: ")
            if path:
                if path in self.patch.actions:
                    raise DiffError(f"Duplicate delete for file: {path}")
                if path not in self.current_files:
                    raise DiffError(f"Delete File Error - missing file: {path}")
                self.patch.actions[path] = PatchAction(type=ActionType.DELETE)
                continue

            # ---------- ADD ---------- #
            path = self.read_str("*** Add File: ")
            if path:
                if path in self.patch.actions:
                    raise DiffError(f"Duplicate add for file: {path}")
                if path in self.current_files:
                    raise DiffError(f"Add File Error - file already exists: {path}")
                self.patch.actions[path] = self._parse_add_file()
                continue

            raise DiffError(f"Unknown line while parsing: {self._cur_line()}")

        if not self.startswith("*** End Patch"):
            raise DiffError("Missing *** End Patch sentinel")
        self.index += 1  # consume sentinel

    # ------------- section parsers ---------------------------------------- #
    def _parse_update_file(self, text: str) -> PatchAction:
        action = PatchAction(type=ActionType.UPDATE)
        lines = text.split("\n")
        index = 0
        while not self.is_done(
            (
                "*** End Patch",
                "*** Update File:",
                "*** Delete File:",
                "*** Add File:",
                "*** End of File",
            )
        ):
            def_str = self.read_str("@@ ")
            section_str = ""
            if not def_str and self._norm(self._cur_line()) == "@@":
                section_str = self.read_line()

            if not (def_str or section_str or index == 0):
                raise DiffError(f"Invalid line in update section:\n{self._cur_line()}")

            if def_str.strip():
                found = False
                if def_str not in lines[:index]:
                    for i, s in enumerate(lines[index:], index):
                        if s == def_str:
                            index = i + 1
                            found = True
                            break
                if not found and def_str.strip() not in [
                    s.strip() for s in lines[:index]
                ]:
                    for i, s in enumerate(lines[index:], index):
                        if s.strip() == def_str.strip():
                            index = i + 1
                            self.fuzz += 1
                            found = True
                            break

            next_ctx, chunks, end_idx, eof = peek_next_section(self.lines, self.index)
            new_index, fuzz = find_context(lines, next_ctx, index, eof)
            if new_index == -1:
                ctx_txt = "\n".join(next_ctx)
                raise DiffError(
                    f"Invalid {'EOF ' if eof else ''}context at {index}:\n{ctx_txt}"
                )
            self.fuzz += fuzz
            for ch in chunks:
                ch.orig_index += new_index
                action.chunks.append(ch)
            index = new_index + len(next_ctx)
            self.index = end_idx
        return action

    def _parse_add_file(self) -> PatchAction:
        lines: List[str] = []
        while not self.is_done(
            ("*** End Patch", "*** Update File:", "*** Delete File:", "*** Add File:")
        ):
            s = self.read_line()
            if not s.startswith("+"):
                raise DiffError(f"Invalid Add File line (missing '+'): {s}")
            lines.append(s[1:])  # strip leading '+'
        return PatchAction(type=ActionType.ADD, new_file="\n".join(lines))


# --------------------------------------------------------------------------- #
#  Helper functions
# --------------------------------------------------------------------------- #
def find_context_core(
    lines: List[str], context: List[str], start: int
) -> Tuple[int, int]:
    if not context:
        return start, 0

    for i in range(start, len(lines)):
        if lines[i : i + len(context)] == context:
            return i, 0
    for i in range(start, len(lines)):
        if [s.rstrip() for s in lines[i : i + len(context)]] == [
            s.rstrip() for s in context
        ]:
            return i, 1
    for i in range(start, len(lines)):
        if [s.strip() for s in lines[i : i + len(context)]] == [
            s.strip() for s in context
        ]:
            return i, 100
    return -1, 0


def find_context(
    lines: List[str], context: List[str], start: int, eof: bool
) -> Tuple[int, int]:
    if eof:
        new_index, fuzz = find_context_core(lines, context, len(lines) - len(context))
        if new_index != -1:
            return new_index, fuzz
        new_index, fuzz = find_context_core(lines, context, start)
        return new_index, fuzz + 10_000
    return find_context_core(lines, context, start)


def peek_next_section(
    lines: List[str], index: int
) -> Tuple[List[str], List[Chunk], int, bool]:
    old: List[str] = []
    del_lines: List[str] = []
    ins_lines: List[str] = []
    chunks: List[Chunk] = []
    mode = "keep"
    orig_index = index

    while index < len(lines):
        s = lines[index]
        if s.startswith(
            (
                "@@",
                "*** End Patch",
                "*** Update File:",
                "*** Delete File:",
                "*** Add File:",
                "*** End of File",
            )
        ):
            break
        if s == "***":
            break
        if s.startswith("***"):
            raise DiffError(f"Invalid Line: {s}")
        index += 1

        last_mode = mode
        if s == "":
            s = " "
        if s[0] == "+":
            mode = "add"
        elif s[0] == "-":
            mode = "delete"
        elif s[0] == " ":
            mode = "keep"
        else:
            raise DiffError(f"Invalid Line: {s}")
        s = s[1:]

        if mode == "keep" and last_mode != mode:
            if ins_lines or del_lines:
                chunks.append(
                    Chunk(
                        orig_index=len(old) - len(del_lines),
                        del_lines=del_lines,
                        ins_lines=ins_lines,
                    )
                )
            del_lines, ins_lines = [], []

        if mode == "delete":
            del_lines.append(s)
            old.append(s)
        elif mode == "add":
            ins_lines.append(s)
        elif mode == "keep":
            old.append(s)

    if ins_lines or del_lines:
        chunks.append(
            Chunk(
                orig_index=len(old) - len(del_lines),
                del_lines=del_lines,
                ins_lines=ins_lines,
            )
        )

    if index < len(lines) and lines[index] == "*** End of File":
        index += 1
        return old, chunks, index, True

    if index == orig_index:
        raise DiffError("Nothing in this section")
    return old, chunks, index, False


# --------------------------------------------------------------------------- #
#  Patch → Commit and Commit application
# --------------------------------------------------------------------------- #
def _get_updated_file(text: str, action: PatchAction, path: str) -> str:
    if action.type is not ActionType.UPDATE:
        raise DiffError("_get_updated_file called with non-update action")
    orig_lines = text.split("\n")
    dest_lines: List[str] = []
    orig_index = 0

    for chunk in action.chunks:
        if chunk.orig_index > len(orig_lines):
            raise DiffError(
                f"{path}: chunk.orig_index {chunk.orig_index} exceeds file length"
            )
        if orig_index > chunk.orig_index:
            raise DiffError(
                f"{path}: overlapping chunks at {orig_index} > {chunk.orig_index}"
            )

        dest_lines.extend(orig_lines[orig_index : chunk.orig_index])
        orig_index = chunk.orig_index

        dest_lines.extend(chunk.ins_lines)
        orig_index += len(chunk.del_lines)

    dest_lines.extend(orig_lines[orig_index:])
    return "\n".join(dest_lines)


def patch_to_commit(patch: Patch, orig: Dict[str, str]) -> Commit:
    commit = Commit()
    for path, action in patch.actions.items():
        if action.type is ActionType.DELETE:
            commit.changes[path] = FileChange(
                type=ActionType.DELETE, old_content=orig[path]
            )
        elif action.type is ActionType.ADD:
            if action.new_file is None:
                raise DiffError("ADD action without file content")
            commit.changes[path] = FileChange(
                type=ActionType.ADD, new_content=action.new_file
            )
        elif action.type is ActionType.UPDATE:
            new_content = _get_updated_file(orig[path], action, path)
            commit.changes[path] = FileChange(
                type=ActionType.UPDATE,
                old_content=orig[path],
                new_content=new_content,
                move_path=action.move_path,
            )
    return commit


# --------------------------------------------------------------------------- #
#  User-facing helpers
# --------------------------------------------------------------------------- #
def text_to_patch(text: str, orig: Dict[str, str]) -> Tuple[Patch, int]:
    lines = text.splitlines()  # preserves blank lines, no strip()
    if (
        len(lines) < 2
        or not Parser._norm(lines[0]).startswith("*** Begin Patch")
        or Parser._norm(lines[-1]) != "*** End Patch"
    ):
        raise DiffError("Invalid patch text - missing sentinels")

    parser = Parser(current_files=orig, lines=lines, index=1)
    parser.parse()
    return parser.patch, parser.fuzz


def identify_files_needed(text: str) -> List[str]:
    lines = text.splitlines()
    return [
        line[len("*** Update File: ") :]
        for line in lines
        if line.startswith("*** Update File: ")
    ] + [
        line[len("*** Delete File: ") :]
        for line in lines
        if line.startswith("*** Delete File: ")
    ]


def identify_files_added(text: str) -> List[str]:
    lines = text.splitlines()
    return [
        line[len("*** Add File: ") :]
        for line in lines
        if line.startswith("*** Add File: ")
    ]


# --------------------------------------------------------------------------- #
#  File-system helpers
# --------------------------------------------------------------------------- #
def load_files(paths: List[str], open_fn: Callable[[str], str]) -> Dict[str, str]:
    return {path: open_fn(path) for path in paths}


def apply_commit(
    commit: Commit,
    write_fn: Callable[[str, str], None],
    remove_fn: Callable[[str], None],
) -> None:
    for path, change in commit.changes.items():
        if change.type is ActionType.DELETE:
            remove_fn(path)
        elif change.type is ActionType.ADD:
            if change.new_content is None:
                raise DiffError(f"ADD change for {path} has no content")
            write_fn(path, change.new_content)
        elif change.type is ActionType.UPDATE:
            if change.new_content is None:
                raise DiffError(f"UPDATE change for {path} has no new content")
            target = change.move_path or path
            write_fn(target, change.new_content)
            if change.move_path:
                remove_fn(path)


def process_patch(
    text: str,
    open_fn: Callable[[str], str],
    write_fn: Callable[[str, str], None],
    remove_fn: Callable[[str], None],
) -> str:
    if not text.startswith("*** Begin Patch"):
        raise DiffError("Patch text must start with *** Begin Patch")
    paths = identify_files_needed(text)
    orig = load_files(paths, open_fn)
    patch, _fuzz = text_to_patch(text, orig)
    commit = patch_to_commit(patch, orig)
    apply_commit(commit, write_fn, remove_fn)
    return "Done!"


# --------------------------------------------------------------------------- #
#  Default FS helpers
# --------------------------------------------------------------------------- #
def open_file(path: str) -> str:
    with open(path, "rt", encoding="utf-8") as fh:
        return fh.read()


def write_file(path: str, content: str) -> None:
    target = pathlib.Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("wt", encoding="utf-8") as fh:
        fh.write(content)


def remove_file(path: str) -> None:
    pathlib.Path(path).unlink(missing_ok=True)


# --------------------------------------------------------------------------- #
#  CLI entry-point
# --------------------------------------------------------------------------- #
def main() -> None:
    import sys

    patch_text = sys.stdin.read()
    if not patch_text:
        print("Please pass patch text through stdin", file=sys.stderr)
        return
    try:
        result = process_patch(patch_text, open_file, write_file, remove_file)
    except DiffError as exc:
        print(exc, file=sys.stderr)
        return
    print(result)


if __name__ == "__main__":
    main()
```


### 其他有效的 Diff 格式

如果你想尝试使用其他 diff 格式，我们在测试中发现，Aider 的 polyglot 基准中使用的 SEARCH/REPLACE diff 格式，以及一种不带内部转义的伪 XML 格式，都具有较高的成功率。

这些 diff 格式有两个共同的关键点：(1) 它们不使用行号；(2) 它们同时提供要被替换的确切代码和用于替换的确切代码，并在二者之间使用清晰的分隔符。

````python
SEARCH_REPLACE_DIFF_EXAMPLE = """
path/to/file.py
```
>>>>>>> SEARCH
def search():
    pass
=======
def search():
   raise NotImplementedError()
<<<<<<< REPLACE
"""

PSEUDO_XML_DIFF_EXAMPLE = """
`<edit>`
`<file>`
path/to/file.py
`</file>`
`<old_code>`
def search():
    pass
`</old_code>`
`<new_code>`
def search():
   raise NotImplementedError()
`</new_code>`
`</edit>`
"""
````


