# Prompt generation

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

该 **生成** 按钮，位于 [Playground](https://platform.openai.com/chat/edit) 可让你根据任务描述生成提示、 [函数](https://developers.openai.com/api/docs/guides/function-calling)，和 [架构](https://developers.openai.com/api/docs/guides/structured-outputs#supported-schemas) 。本指南将详细讲解其具体工作原理。

## 概述

从零开始创建提示和模式可能很耗时，因此生成它们可以帮助你快速上手。Generate 按钮主要使用两种方法：

1. **提示词：** 我们使用 **元提示词** ，结合最佳实践来生成或改进提示词。
1. **模式：** 我们使用 **元模式** ，用于生成合法的 JSON 和函数语法。

虽然我们目前使用元提示和模式，但未来可能会集成更先进的技术，例如 [DSPy](https://arxiv.org/abs/2310.03714) 和 ["梯度下降"](https://arxiv.org/abs/2305.03495).

## Prompts

一个 **meta-prompt** 指示模型根据你的任务描述创建一个好的提示，或改进现有的提示。Playground 中的 meta-prompt 源自我们的 [prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) 最佳实践以及与用户的实际经验。

我们针对不同的输出类型（如音频）使用特定的 meta-prompt，以确保生成的提示符合预期格式。

### Meta-prompts



文本输出

    Text meta-prompt

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const metaPrompt = `Given a task description or existing prompt, produce a detailed system prompt to guide a language model in completing the task effectively.

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
    - Conclusion, classifications, or results should ALWAYS appear last.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Formatting: Use markdown features for readability. DO NOT USE \`\`\` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
    - JSON should never be wrapped in code blocks (\`\`\`) unless explicitly requested.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Steps [optional]

[optional: a detailed breakdown of the steps necessary to accomplish the task]

# Output Format

[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]`;

async function generatePrompt(taskOrPrompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-5.6",
    messages: [
      { role: "system", content: metaPrompt },
      {
        role: "user",
        content: "Task, Goal, or Current Prompt:\n" + taskOrPrompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}

console.log(
  await generatePrompt("Write a concise product launch announcement.")
);
```

````python
from openai import OpenAI

client = OpenAI()

META_PROMPT = """
Given a task description or existing prompt, produce a detailed system prompt to guide a language model in completing the task effectively.

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
    - Conclusion, classifications, or results should ALWAYS appear last.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
    - JSON should never be wrapped in code blocks (```) unless explicitly requested.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Steps [optional]

[optional: a detailed breakdown of the steps necessary to accomplish the task]

# Output Format

[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
""".strip()


def generate_prompt(task_or_prompt: str):
    completion = client.chat.completions.create(
        model="gpt-5.6",
        messages=[
            {
                "role": "system",
                "content": META_PROMPT,
            },
            {
                "role": "user",
                "content": "Task, Goal, or Current Prompt:\n" + task_or_prompt,
            },
        ],
    )

    return completion.choices[0].message.content
````

````java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

String metaPrompt =
    """
    Given a task description or existing prompt, produce a detailed system prompt to guide a language model in completing the task effectively.

    # Guidelines

    - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
    - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
    - Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
        - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
        - Conclusion, classifications, or results should ALWAYS appear last.
    - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
       - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
    - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
    - Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
    - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
    - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
    - Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
        - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
        - JSON should never be wrapped in code blocks (```) unless explicitly requested.

    The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

    [Concise instruction describing the task - this should be the first line in the prompt, no section header]

    [Additional details as needed.]

    [Optional sections with headings or bullet points for detailed steps.]

    # Steps [optional]

    [optional: a detailed breakdown of the steps necessary to accomplish the task]

    # Output Format

    [Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

    # Examples [optional]

    [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
    [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

    # Notes [optional]

    [optional: edge cases, details, and an area to call or repeat out specific important considerations]
    """
        .strip();

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\nWrite a concise product launch announcement.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
````

````ruby
require "openai"

client = OpenAI::Client.new
meta_prompt = <<~PROMPT
  Given a task description or existing prompt, produce a detailed system prompt to guide a language model in completing the task effectively.

  # Guidelines

  - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
  - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
  - Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
      - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
      - Conclusion, classifications, or results should ALWAYS appear last.
  - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
     - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
  - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
  - Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
  - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
  - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
  - Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
      - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
      - JSON should never be wrapped in code blocks (```) unless explicitly requested.

  The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

  [Concise instruction describing the task - this should be the first line in the prompt, no section header]

  [Additional details as needed.]

  [Optional sections with headings or bullet points for detailed steps.]

  # Steps [optional]

  [optional: a detailed breakdown of the steps necessary to accomplish the task]

  # Output Format

  [Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

  # Examples [optional]

  [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
  [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

  # Notes [optional]

  [optional: edge cases, details, and an area to call or repeat out specific important considerations]
PROMPT

def generate_prompt(client, meta_prompt, task_or_prompt)
  completion = client.chat.completions.create(
    model: "gpt-5.6",
    messages: [
      {role: :system, content: meta_prompt},
      {
        role: :user,
        content: "Task, Goal, or Current Prompt:\n#{task_or_prompt}"
      }
    ]
  )

  completion.choices.fetch(0).message.content
end

puts(generate_prompt(client, meta_prompt, "Write a concise product launch announcement."))
````

  

  

    
音频输出

    Audio meta-prompt

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const metaPrompt = `Given a task description or existing prompt, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
- Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
  - It is very important that any examples included reflect the short, conversational output responses of the model.
Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
  - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
  - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]`;

async function generatePrompt(taskOrPrompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-5.6",
    messages: [
      { role: "system", content: metaPrompt },
      {
        role: "user",
        content: "Task, Goal, or Current Prompt:\n" + taskOrPrompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}

console.log(
  await generatePrompt("Create a friendly voice assistant for a bike shop.")
);
```

```python
from openai import OpenAI

client = OpenAI()

META_PROMPT = """
Given a task description or existing prompt, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
- Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
  - It is very important that any examples included reflect the short, conversational output responses of the model.
Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
  - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
  - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
""".strip()


def generate_prompt(task_or_prompt: str):
    completion = client.chat.completions.create(
        model="gpt-5.6",
        messages=[
            {
                "role": "system",
                "content": META_PROMPT,
            },
            {
                "role": "user",
                "content": "Task, Goal, or Current Prompt:\n" + task_or_prompt,
            },
        ],
    )

    return completion.choices[0].message.content
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

String metaPrompt =
    """
    Given a task description or existing prompt, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

    # Guidelines

    - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
    - Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
    - Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
    - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
    - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
       - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
      - It is very important that any examples included reflect the short, conversational output responses of the model.
    Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
      - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
      - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
    - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
    - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
    - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

    The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

    [Concise instruction describing the task - this should be the first line in the prompt, no section header]

    [Additional details as needed.]

    [Optional sections with headings or bullet points for detailed steps.]

    # Examples [optional]

    [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
    [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

    # Notes [optional]

    [optional: edge cases, details, and an area to call or repeat out specific important considerations]
    """
        .strip();

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\n"
                + "Create a friendly voice assistant for a bike shop.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
meta_prompt = <<~PROMPT
  Given a task description or existing prompt, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

  # Guidelines

  - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
  - Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
  - Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
  - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
  - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
     - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
    - It is very important that any examples included reflect the short, conversational output responses of the model.
  Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
    - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
    - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
  - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
  - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
  - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

  The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

  [Concise instruction describing the task - this should be the first line in the prompt, no section header]

  [Additional details as needed.]

  [Optional sections with headings or bullet points for detailed steps.]

  # Examples [optional]

  [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
  [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

  # Notes [optional]

  [optional: edge cases, details, and an area to call or repeat out specific important considerations]
PROMPT

def generate_prompt(client, meta_prompt, task_or_prompt)
  completion = client.chat.completions.create(
    model: "gpt-5.6",
    messages: [
      {role: :system, content: meta_prompt},
      {
        role: :user,
        content: "Task, Goal, or Current Prompt:\n#{task_or_prompt}"
      }
    ]
  )

  completion.choices.fetch(0).message.content
end

puts(generate_prompt(client, meta_prompt, "Create a friendly voice assistant for a bike shop."))
```



### 提示词编辑

为了编辑提示词，我们使用一个稍作修改的元提示词。虽然直接修改比较容易应用，但识别开放式修订所需的必要更改可能具有挑战性。为了解决这个问题，我们在响应开头包含一个 **推理部分** 。该部分通过评估现有提示词的清晰度、思维链顺序、整体结构和具体性等因素，引导模型确定需要做哪些修改。推理部分会提出改进建议，然后从最终响应中解析出来。



文本输出

    Text meta-prompt for edits

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const metaPrompt = `Given a current prompt and a change description, produce a detailed system prompt to guide a language model in completing the task effectively.

Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
<reasoning>
- Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
- Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
    - Identify: (max 10 words) if so, which section(s) utilize reasoning?
    - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
    - Ordering: (before/after) is the chain of though located before or after
- Structure: (yes/no) does the input prompt have a well defined structure
- Examples: (yes/no) does the input prompt have few-shot examples
    - Representative: (1-5) if present, how representative are the examples?
- Complexity: (1-5) how complex is the input prompt?
    - Task: (1-5) how complex is the implied task?
    - Necessity: ()
- Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
- Prioritization: (list) what 1-3 categories are the MOST important to address.
- Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
</reasoning>

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
    - Conclusion, classifications, or results should ALWAYS appear last.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Formatting: Use markdown features for readability. DO NOT USE \`\`\` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
    - JSON should never be wrapped in code blocks (\`\`\`) unless explicitly requested.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Steps [optional]

[optional: a detailed breakdown of the steps necessary to accomplish the task]

# Output Format

[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
[NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]`;

async function generatePrompt(taskOrPrompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-5.6",
    messages: [
      { role: "system", content: metaPrompt },
      {
        role: "user",
        content: "Task, Goal, or Current Prompt:\n" + taskOrPrompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}

console.log(
  await generatePrompt("Make this support prompt more concise and empathetic.")
);
```

````python
from openai import OpenAI

client = OpenAI()

META_PROMPT = """
Given a current prompt and a change description, produce a detailed system prompt to guide a language model in completing the task effectively.

Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
<reasoning>
- Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
- Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
    - Identify: (max 10 words) if so, which section(s) utilize reasoning?
    - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
    - Ordering: (before/after) is the chain of though located before or after
- Structure: (yes/no) does the input prompt have a well defined structure
- Examples: (yes/no) does the input prompt have few-shot examples
    - Representative: (1-5) if present, how representative are the examples?
- Complexity: (1-5) how complex is the input prompt?
    - Task: (1-5) how complex is the implied task?
    - Necessity: ()
- Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
- Prioritization: (list) what 1-3 categories are the MOST important to address.
- Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
</reasoning>

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
    - Conclusion, classifications, or results should ALWAYS appear last.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
    - JSON should never be wrapped in code blocks (```) unless explicitly requested.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Steps [optional]

[optional: a detailed breakdown of the steps necessary to accomplish the task]

# Output Format

[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
[NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]
""".strip()


def generate_prompt(task_or_prompt: str):
    completion = client.chat.completions.create(
        model="gpt-5.6",
        messages=[
            {
                "role": "system",
                "content": META_PROMPT,
            },
            {
                "role": "user",
                "content": "Task, Goal, or Current Prompt:\n" + task_or_prompt,
            },
        ],
    )

    return completion.choices[0].message.content
````

````java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

String metaPrompt =
    """
    Given a current prompt and a change description, produce a detailed system prompt to guide a language model in completing the task effectively.

    Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
    <reasoning>
    - Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
    - Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
        - Identify: (max 10 words) if so, which section(s) utilize reasoning?
        - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
        - Ordering: (before/after) is the chain of though located before or after
    - Structure: (yes/no) does the input prompt have a well defined structure
    - Examples: (yes/no) does the input prompt have few-shot examples
        - Representative: (1-5) if present, how representative are the examples?
    - Complexity: (1-5) how complex is the input prompt?
        - Task: (1-5) how complex is the implied task?
        - Necessity: ()
    - Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
    - Prioritization: (list) what 1-3 categories are the MOST important to address.
    - Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
    </reasoning>

    # Guidelines

    - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
    - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
    - Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
        - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
        - Conclusion, classifications, or results should ALWAYS appear last.
    - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
       - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
    - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
    - Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
    - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
    - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
    - Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
        - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
        - JSON should never be wrapped in code blocks (```) unless explicitly requested.

    The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

    [Concise instruction describing the task - this should be the first line in the prompt, no section header]

    [Additional details as needed.]

    [Optional sections with headings or bullet points for detailed steps.]

    # Steps [optional]

    [optional: a detailed breakdown of the steps necessary to accomplish the task]

    # Output Format

    [Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

    # Examples [optional]

    [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
    [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

    # Notes [optional]

    [optional: edge cases, details, and an area to call or repeat out specific important considerations]
    [NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]
    """
        .strip();

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\nMake this product launch announcement clearer and more concise.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
````

````ruby
require "openai"

client = OpenAI::Client.new
meta_prompt = <<~PROMPT
  Given a current prompt and a change description, produce a detailed system prompt to guide a language model in completing the task effectively.

  Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
  <reasoning>
  - Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
  - Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
      - Identify: (max 10 words) if so, which section(s) utilize reasoning?
      - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
      - Ordering: (before/after) is the chain of though located before or after
  - Structure: (yes/no) does the input prompt have a well defined structure
  - Examples: (yes/no) does the input prompt have few-shot examples
      - Representative: (1-5) if present, how representative are the examples?
  - Complexity: (1-5) how complex is the input prompt?
      - Task: (1-5) how complex is the implied task?
      - Necessity: ()
  - Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
  - Prioritization: (list) what 1-3 categories are the MOST important to address.
  - Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
  </reasoning>

  # Guidelines

  - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
  - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
  - Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
      - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
      - Conclusion, classifications, or results should ALWAYS appear last.
  - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
     - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
  - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
  - Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
  - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
  - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
  - Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
      - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
      - JSON should never be wrapped in code blocks (```) unless explicitly requested.

  The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

  [Concise instruction describing the task - this should be the first line in the prompt, no section header]

  [Additional details as needed.]

  [Optional sections with headings or bullet points for detailed steps.]

  # Steps [optional]

  [optional: a detailed breakdown of the steps necessary to accomplish the task]

  # Output Format

  [Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

  # Examples [optional]

  [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
  [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

  # Notes [optional]

  [optional: edge cases, details, and an area to call or repeat out specific important considerations]
  [NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]
PROMPT

def generate_prompt(client, meta_prompt, task_or_prompt)
  completion = client.chat.completions.create(
    model: "gpt-5.6",
    messages: [
      {role: :system, content: meta_prompt},
      {
        role: :user,
        content: "Task, Goal, or Current Prompt:\n#{task_or_prompt}"
      }
    ]
  )

  completion.choices.fetch(0).message.content
end

puts(generate_prompt(client, meta_prompt, "Make this support prompt more concise and empathetic."))
````

  

  

    
音频输出

    Audio meta-prompt for edits

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const metaPrompt = `Given a current prompt and a change description, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
<reasoning>
- Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
- Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
    - Identify: (max 10 words) if so, which section(s) utilize reasoning?
    - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
    - Ordering: (before/after) is the chain of though located before or after
- Structure: (yes/no) does the input prompt have a well defined structure
- Examples: (yes/no) does the input prompt have few-shot examples
    - Representative: (1-5) if present, how representative are the examples?
- Complexity: (1-5) how complex is the input prompt?
    - Task: (1-5) how complex is the implied task?
    - Necessity: ()
- Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
- Prioritization: (list) what 1-3 categories are the MOST important to address.
- Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
</reasoning>

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
- Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
  - It is very important that any examples included reflect the short, conversational output responses of the model.
Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
  - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
  - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
[NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]`;

async function generatePrompt(taskOrPrompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-5.6",
    messages: [
      { role: "system", content: metaPrompt },
      {
        role: "user",
        content: "Task, Goal, or Current Prompt:\n" + taskOrPrompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}

console.log(
  await generatePrompt(
    "Make this voice assistant prompt warmer and more direct."
  )
);
```

```python
from openai import OpenAI

client = OpenAI()

META_PROMPT = """
Given a current prompt and a change description, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
<reasoning>
- Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
- Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
    - Identify: (max 10 words) if so, which section(s) utilize reasoning?
    - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
    - Ordering: (before/after) is the chain of though located before or after
- Structure: (yes/no) does the input prompt have a well defined structure
- Examples: (yes/no) does the input prompt have few-shot examples
    - Representative: (1-5) if present, how representative are the examples?
- Complexity: (1-5) how complex is the input prompt?
    - Task: (1-5) how complex is the implied task?
    - Necessity: ()
- Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
- Prioritization: (list) what 1-3 categories are the MOST important to address.
- Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
</reasoning>

# Guidelines

- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
- Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
- Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
  - It is very important that any examples included reflect the short, conversational output responses of the model.
Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
  - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
  - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

[Concise instruction describing the task - this should be the first line in the prompt, no section header]

[Additional details as needed.]

[Optional sections with headings or bullet points for detailed steps.]

# Examples [optional]

[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

# Notes [optional]

[optional: edge cases, details, and an area to call or repeat out specific important considerations]
[NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]
""".strip()


def generate_prompt(task_or_prompt: str):
    completion = client.chat.completions.create(
        model="gpt-5.6",
        messages=[
            {
                "role": "system",
                "content": META_PROMPT,
            },
            {
                "role": "user",
                "content": "Task, Goal, or Current Prompt:\n" + task_or_prompt,
            },
        ],
    )

    return completion.choices[0].message.content
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

String metaPrompt =
    """
    Given a current prompt and a change description, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

    Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
    <reasoning>
    - Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
    - Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
        - Identify: (max 10 words) if so, which section(s) utilize reasoning?
        - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
        - Ordering: (before/after) is the chain of though located before or after
    - Structure: (yes/no) does the input prompt have a well defined structure
    - Examples: (yes/no) does the input prompt have few-shot examples
        - Representative: (1-5) if present, how representative are the examples?
    - Complexity: (1-5) how complex is the input prompt?
        - Task: (1-5) how complex is the implied task?
        - Necessity: ()
    - Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
    - Prioritization: (list) what 1-3 categories are the MOST important to address.
    - Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
    </reasoning>

    # Guidelines

    - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
    - Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
    - Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
    - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
    - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
       - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
      - It is very important that any examples included reflect the short, conversational output responses of the model.
    Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
      - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
      - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
    - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
    - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
    - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

    The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

    [Concise instruction describing the task - this should be the first line in the prompt, no section header]

    [Additional details as needed.]

    [Optional sections with headings or bullet points for detailed steps.]

    # Examples [optional]

    [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
    [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

    # Notes [optional]

    [optional: edge cases, details, and an area to call or repeat out specific important considerations]
    [NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]
    """
        .strip();

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\nMake this voice assistant prompt warmer and more direct.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
meta_prompt = <<~PROMPT
  Given a current prompt and a change description, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.

  Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:
  <reasoning>
  - Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)
  - Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?
      - Identify: (max 10 words) if so, which section(s) utilize reasoning?
      - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?
      - Ordering: (before/after) is the chain of though located before or after
  - Structure: (yes/no) does the input prompt have a well defined structure
  - Examples: (yes/no) does the input prompt have few-shot examples
      - Representative: (1-5) if present, how representative are the examples?
  - Complexity: (1-5) how complex is the input prompt?
      - Task: (1-5) how complex is the implied task?
      - Necessity: ()
  - Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)
  - Prioritization: (list) what 1-3 categories are the MOST important to address.
  - Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed
  </reasoning>

  # Guidelines

  - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
  - Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.
  - Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.
  - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
  - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
     - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
    - It is very important that any examples included reflect the short, conversational output responses of the model.
  Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.
    - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for "short" responses, then the examples should truly have 1-10 word responses max.
    - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.
  - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
  - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
  - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.

  The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

  [Concise instruction describing the task - this should be the first line in the prompt, no section header]

  [Additional details as needed.]

  [Optional sections with headings or bullet points for detailed steps.]

  # Examples [optional]

  [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
  [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

  # Notes [optional]

  [optional: edge cases, details, and an area to call or repeat out specific important considerations]
  [NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]
PROMPT

def generate_prompt(client, meta_prompt, task_or_prompt)
  completion = client.chat.completions.create(
    model: "gpt-5.6",
    messages: [
      {role: :system, content: meta_prompt},
      {
        role: :user,
        content: "Task, Goal, or Current Prompt:\n#{task_or_prompt}"
      }
    ]
  )

  completion.choices.fetch(0).message.content
end

puts(generate_prompt(client, meta_prompt, "Make this voice assistant prompt warmer and more direct."))
```



## Schemas

[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) schema 和 function schema 本身都是 JSON 对象，因此我们借助 Structured Outputs 来生成它们。
这需要为期望的输出定义一个 schema，而这里期望的输出本身就是一个 schema。为此，我们使用一个自描述 schema —— 一个 **meta-schema**.

由于 function schema 中的 `parameters` 字段本身也是一个 schema，我们使用同一个 meta-schema 来生成函数。

### 定义受限的元架构

[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 支持两种模式： `strict=true` 和 `strict=false`。两种模式都使用同一模型训练以遵循所提供的 schema，但只有“严格模式”能通过受约束采样保证完全遵循。

我们的目标是使用严格模式本身来为严格模式生成 schema。然而， [JSON Schema 规范](https://json-schema.org/specification#meta-schemas) 官方提供的元 schema 依赖 [严格模式下暂不支持](https://developers.openai.com/api/docs/guides/structured-outputs#some-type-specific-keywords-are-not-yet-supported) 的特性，这对输入和输出 schema 都带来了挑战。

1. **输入架构：** 我们无法使用 [不受支持的功能](https://developers.openai.com/api/docs/guides/structured-outputs#some-type-specific-keywords-are-not-yet-supported) 来描述输入架构中的输出架构。
2. **输出架构：** 生成的架构不得包含 [不受支持的功能](https://developers.openai.com/api/docs/guides/structured-outputs#some-type-specific-keywords-are-not-yet-supported).

因为我们需要在输出 schema 中生成新的键，输入元 schema 必须使用 `additionalProperties`。这意味着我们目前无法使用 strict 模式来生成 schema。不过，我们仍然希望生成的 schema 能够符合 strict 模式的约束。

为了克服这一限制，我们定义了一个 **伪元 schema** ——一种使用了 strict 模式不支持的特性、仅用来描述 strict 模式所支持特性的元 schema。本质上，这种方法在元 schema 定义中跳出了 strict 模式，同时仍然确保生成的 schema 遵循 strict 模式的约束。



构建一个受限制的元 schema 是一项具有挑战性的任务，因此我们借助模型来帮忙。

我们首先让 `o1-preview` 和 `gpt-4o` 在 JSON 模式下根据 Structured Outputs 文档给出对我们目标的描述。
经过几次迭代后，我们开发出了第一个可用的元 schema。

然后我们使用 `gpt-4o` 配合 Structured Outputs，并向其提供 _那个初始 schema_ 以及我们的任务描述和文档，以生成更好的候选方案。每一次迭代，我们都使用一个更好的 schema 来生成下一个，直到最终仔细地进行人工审核。

最后，在清理输出之后，我们根据一组针对 schema 和函数的评估对生成的 schema 进行了验证。



### 输出清理

严格模式可以保证完全遵循 schema。然而，由于我们在生成过程中无法使用它，因此需要在生成完成后对输出进行校验和转换。

生成 schema 后，我们会执行以下步骤：

1. **将 `additionalProperties` 设置为 `false`** ，适用于所有对象。
1. **将所有属性标记为必填**.
1. **对于结构化输出 schema**，请将它们包裹在 [`json_schema`](https://developers.openai.com/api/docs/guides/structured-outputs?context=without_parse#how-to-use) 对象中。
1. **对于函数**，请将它们包裹在 [`function`](https://developers.openai.com/api/docs/guides/function-calling#defining-functions) 对象中。

Realtime API
  [函数](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling) 对象
  与 Chat Completions API 略有差异，但使用相同的架构。

### 元模式

每个元数据 schema 都附带一个包含少样本示例的提示词。结合 Structured Outputs 的可靠性 —— 即便不使用严格模式 —— 我们也能成功生成 schema。



结构化输出 schema

    Structured output meta-schema

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const metaSchema = {
  name: "metaschema",
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the schema",
      },
      type: {
        type: "string",
        enum: ["object", "array", "string", "number", "boolean", "null"],
      },
      properties: {
        type: "object",
        additionalProperties: {
          $ref: "#/$defs/schema_definition",
        },
      },
      items: {
        anyOf: [
          {
            $ref: "#/$defs/schema_definition",
          },
          {
            type: "array",
            items: {
              $ref: "#/$defs/schema_definition",
            },
          },
        ],
      },
      required: {
        type: "array",
        items: {
          type: "string",
        },
      },
      additionalProperties: {
        type: "boolean",
      },
    },
    required: ["type"],
    additionalProperties: false,
    if: {
      properties: {
        type: {
          const: "object",
        },
      },
    },
    then: {
      required: ["properties"],
    },
    $defs: {
      schema_definition: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["object", "array", "string", "number", "boolean", "null"],
          },
          properties: {
            type: "object",
            additionalProperties: {
              $ref: "#/$defs/schema_definition",
            },
          },
          items: {
            anyOf: [
              {
                $ref: "#/$defs/schema_definition",
              },
              {
                type: "array",
                items: {
                  $ref: "#/$defs/schema_definition",
                },
              },
            ],
          },
          required: {
            type: "array",
            items: {
              type: "string",
            },
          },
          additionalProperties: {
            type: "boolean",
          },
        },
        required: ["type"],
        additionalProperties: false,
        if: {
          properties: {
            type: {
              const: "object",
            },
          },
        },
        then: {
          required: ["properties"],
        },
      },
    },
  },
};

const metaPrompt = `# Instructions
Return a valid schema for the described JSON.

You must also make sure:
- all fields in an object are set as required
- I REPEAT, ALL FIELDS MUST BE MARKED AS REQUIRED
- all objects must have additionalProperties set to false
    - because of this, some cases like "attributes" or "metadata" properties that would normally allow additional properties should instead have a fixed set of properties
- all objects must have properties defined
- field order matters. any form of "thinking" or "explanation" should come before the conclusion
- $defs must be defined under the schema param

Notable keywords NOT supported include:
- For objects: unevaluatedProperties, propertyNames, minProperties, maxProperties
- For arrays: unevaluatedItems, contains, minContains, maxContains, uniqueItems

Other notes:
- definitions and recursion are supported
- only if necessary to include references e.g. "$defs", it must be inside the "schema" object

# Examples
Input: Generate a math reasoning schema with steps and a final answer.
Output: {
    "name": "math_reasoning",
    "type": "object",
    "properties": {
        "steps": {
            "type": "array",
            "description": "A sequence of steps involved in solving the math problem.",
            "items": {
                "type": "object",
                "properties": {
                    "explanation": {
                        "type": "string",
                        "description": "Description of the reasoning or method used in this step."
                    },
                    "output": {
                        "type": "string",
                        "description": "Result or outcome of this specific step."
                    }
                },
                "required": [
                    "explanation",
                    "output"
                ],
                "additionalProperties": false
            }
        },
        "final_answer": {
            "type": "string",
            "description": "The final solution or answer to the math problem."
        }
    },
    "required": [
        "steps",
        "final_answer"
    ],
    "additionalProperties": false
}

Input: Give me a linked list
Output: {
    "name": "linked_list",
    "type": "object",
    "properties": {
        "linked_list": {
            "$ref": "#/$defs/linked_list_node",
            "description": "The head node of the linked list."
        }
    },
    "$defs": {
        "linked_list_node": {
            "type": "object",
            "description": "Defines a node in a singly linked list.",
            "properties": {
                "value": {
                    "type": "number",
                    "description": "The value stored in this node."
                },
                "next": {
                    "anyOf": [
                        {
                            "$ref": "#/$defs/linked_list_node"
                        },
                        {
                            "type": "null"
                        }
                    ],
                    "description": "Reference to the next node; null if it is the last node."
                }
            },
            "required": [
                "value",
                "next"
            ],
            "additionalProperties": false
        }
    },
    "required": [
        "linked_list"
    ],
    "additionalProperties": false
}

Input: Dynamically generated UI
Output: {
    "name": "ui",
    "type": "object",
    "properties": {
        "type": {
            "type": "string",
            "description": "The type of the UI component",
            "enum": [
                "div",
                "button",
                "header",
                "section",
                "field",
                "form"
            ]
        },
        "label": {
            "type": "string",
            "description": "The label of the UI component, used for buttons or form fields"
        },
        "children": {
            "type": "array",
            "description": "Nested UI components",
            "items": {
                "$ref": "#"
            }
        },
        "attributes": {
            "type": "array",
            "description": "Arbitrary attributes for the UI component, suitable for any element",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The name of the attribute, for example onClick or className"
                    },
                    "value": {
                        "type": "string",
                        "description": "The value of the attribute"
                    }
                },
                "required": [
                    "name",
                    "value"
                ],
                "additionalProperties": false
            }
        }
    },
    "required": [
        "type",
        "label",
        "children",
        "attributes"
    ],
    "additionalProperties": false
}`;

async function generateSchema(description) {
  const completion = await client.chat.completions.create({
    model: "gpt-5.6-terra",
    response_format: { type: "json_schema", json_schema: metaSchema },
    messages: [
      { role: "system", content: metaPrompt },
      { role: "user", content: "Description:\n" + description },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("The model did not return a schema.");
  return JSON.parse(content);
}

console.log(
  JSON.stringify(await generateSchema("Describe a calendar event."), null, 2)
);
```

```python
from openai import OpenAI
import json

client = OpenAI()

META_SCHEMA = {
    "name": "metaschema",
    "schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "The name of the schema"},
            "type": {
                "type": "string",
                "enum": ["object", "array", "string", "number", "boolean", "null"],
            },
            "properties": {
                "type": "object",
                "additionalProperties": {"$ref": "#/$defs/schema_definition"},
            },
            "items": {
                "anyOf": [
                    {"$ref": "#/$defs/schema_definition"},
                    {"type": "array", "items": {"$ref": "#/$defs/schema_definition"}},
                ]
            },
            "required": {"type": "array", "items": {"type": "string"}},
            "additionalProperties": {"type": "boolean"},
        },
        "required": ["type"],
        "additionalProperties": False,
        "if": {"properties": {"type": {"const": "object"}}},
        "then": {"required": ["properties"]},
        "$defs": {
            "schema_definition": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "object",
                            "array",
                            "string",
                            "number",
                            "boolean",
                            "null",
                        ],
                    },
                    "properties": {
                        "type": "object",
                        "additionalProperties": {"$ref": "#/$defs/schema_definition"},
                    },
                    "items": {
                        "anyOf": [
                            {"$ref": "#/$defs/schema_definition"},
                            {
                                "type": "array",
                                "items": {"$ref": "#/$defs/schema_definition"},
                            },
                        ]
                    },
                    "required": {"type": "array", "items": {"type": "string"}},
                    "additionalProperties": {"type": "boolean"},
                },
                "required": ["type"],
                "additionalProperties": False,
                "if": {"properties": {"type": {"const": "object"}}},
                "then": {"required": ["properties"]},
            }
        },
    },
}

META_PROMPT = """
# Instructions
Return a valid schema for the described JSON.

You must also make sure:
- all fields in an object are set as required
- I REPEAT, ALL FIELDS MUST BE MARKED AS REQUIRED
- all objects must have additionalProperties set to false
    - because of this, some cases like "attributes" or "metadata" properties that would normally allow additional properties should instead have a fixed set of properties
- all objects must have properties defined
- field order matters. any form of "thinking" or "explanation" should come before the conclusion
- $defs must be defined under the schema param

Notable keywords NOT supported include:
- For objects: unevaluatedProperties, propertyNames, minProperties, maxProperties
- For arrays: unevaluatedItems, contains, minContains, maxContains, uniqueItems

Other notes:
- definitions and recursion are supported
- only if necessary to include references e.g. "$defs", it must be inside the "schema" object

# Examples
Input: Generate a math reasoning schema with steps and a final answer.
Output: {
    "name": "math_reasoning",
    "type": "object",
    "properties": {
        "steps": {
            "type": "array",
            "description": "A sequence of steps involved in solving the math problem.",
            "items": {
                "type": "object",
                "properties": {
                    "explanation": {
                        "type": "string",
                        "description": "Description of the reasoning or method used in this step."
                    },
                    "output": {
                        "type": "string",
                        "description": "Result or outcome of this specific step."
                    }
                },
                "required": [
                    "explanation",
                    "output"
                ],
                "additionalProperties": false
            }
        },
        "final_answer": {
            "type": "string",
            "description": "The final solution or answer to the math problem."
        }
    },
    "required": [
        "steps",
        "final_answer"
    ],
    "additionalProperties": false
}

Input: Give me a linked list
Output: {
    "name": "linked_list",
    "type": "object",
    "properties": {
        "linked_list": {
            "$ref": "#/$defs/linked_list_node",
            "description": "The head node of the linked list."
        }
    },
    "$defs": {
        "linked_list_node": {
            "type": "object",
            "description": "Defines a node in a singly linked list.",
            "properties": {
                "value": {
                    "type": "number",
                    "description": "The value stored in this node."
                },
                "next": {
                    "anyOf": [
                        {
                            "$ref": "#/$defs/linked_list_node"
                        },
                        {
                            "type": "null"
                        }
                    ],
                    "description": "Reference to the next node; null if it is the last node."
                }
            },
            "required": [
                "value",
                "next"
            ],
            "additionalProperties": false
        }
    },
    "required": [
        "linked_list"
    ],
    "additionalProperties": false
}

Input: Dynamically generated UI
Output: {
    "name": "ui",
    "type": "object",
    "properties": {
        "type": {
            "type": "string",
            "description": "The type of the UI component",
            "enum": [
                "div",
                "button",
                "header",
                "section",
                "field",
                "form"
            ]
        },
        "label": {
            "type": "string",
            "description": "The label of the UI component, used for buttons or form fields"
        },
        "children": {
            "type": "array",
            "description": "Nested UI components",
            "items": {
                "$ref": "#"
            }
        },
        "attributes": {
            "type": "array",
            "description": "Arbitrary attributes for the UI component, suitable for any element",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The name of the attribute, for example onClick or className"
                    },
                    "value": {
                        "type": "string",
                        "description": "The value of the attribute"
                    }
                },
                "required": [
                    "name",
                    "value"
                ],
                "additionalProperties": false
            }
        }
    },
    "required": [
        "type",
        "label",
        "children",
        "attributes"
    ],
    "additionalProperties": false
}
""".strip()


def generate_schema(description: str):
    completion = client.chat.completions.create(
        model="gpt-5.6-terra",
        response_format={"type": "json_schema", "json_schema": META_SCHEMA},
        messages=[
            {
                "role": "system",
                "content": META_PROMPT,
            },
            {
                "role": "user",
                "content": "Description:\n" + description,
            },
        ],
    )

    return json.loads(completion.choices[0].message.content)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.util.List;
import java.util.Map;

String metaPrompt =
    """
    # Instructions
    Return a valid schema for the described JSON.

    You must also make sure:
    - all fields in an object are set as required
    - I REPEAT, ALL FIELDS MUST BE MARKED AS REQUIRED
    - all objects must have additionalProperties set to false
        - because of this, some cases like "attributes" or "metadata" properties that would normally allow additional properties should instead have a fixed set of properties
    - all objects must have properties defined
    - field order matters. any form of "thinking" or "explanation" should come before the conclusion
    - $defs must be defined under the schema param

    Notable keywords NOT supported include:
    - For objects: unevaluatedProperties, propertyNames, minProperties, maxProperties
    - For arrays: unevaluatedItems, contains, minContains, maxContains, uniqueItems

    Other notes:
    - definitions and recursion are supported
    - only if necessary to include references e.g. "$defs", it must be inside the "schema" object

    # Examples
    Input: Generate a math reasoning schema with steps and a final answer.
    Output: {
        "name": "math_reasoning",
        "type": "object",
        "properties": {
            "steps": {
                "type": "array",
                "description": "A sequence of steps involved in solving the math problem.",
                "items": {
                    "type": "object",
                    "properties": {
                        "explanation": {
                            "type": "string",
                            "description": "Description of the reasoning or method used in this step."
                        },
                        "output": {
                            "type": "string",
                            "description": "Result or outcome of this specific step."
                        }
                    },
                    "required": [
                        "explanation",
                        "output"
                    ],
                    "additionalProperties": false
                }
            },
            "final_answer": {
                "type": "string",
                "description": "The final solution or answer to the math problem."
            }
        },
        "required": [
            "steps",
            "final_answer"
        ],
        "additionalProperties": false
    }

    Input: Give me a linked list
    Output: {
        "name": "linked_list",
        "type": "object",
        "properties": {
            "linked_list": {
                "$ref": "#/$defs/linked_list_node",
                "description": "The head node of the linked list."
            }
        },
        "$defs": {
            "linked_list_node": {
                "type": "object",
                "description": "Defines a node in a singly linked list.",
                "properties": {
                    "value": {
                        "type": "number",
                        "description": "The value stored in this node."
                    },
                    "next": {
                        "anyOf": [
                            {
                                "$ref": "#/$defs/linked_list_node"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "description": "Reference to the next node; null if it is the last node."
                    }
                },
                "required": [
                    "value",
                    "next"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "linked_list"
        ],
        "additionalProperties": false
    }

    Input: Dynamically generated UI
    Output: {
        "name": "ui",
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "description": "The type of the UI component",
                "enum": [
                    "div",
                    "button",
                    "header",
                    "section",
                    "field",
                    "form"
                ]
            },
            "label": {
                "type": "string",
                "description": "The label of the UI component, used for buttons or form fields"
            },
            "children": {
                "type": "array",
                "description": "Nested UI components",
                "items": {
                    "$ref": "#"
                }
            },
            "attributes": {
                "type": "array",
                "description": "Arbitrary attributes for the UI component, suitable for any element",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the attribute, for example onClick or className"
                        },
                        "value": {
                            "type": "string",
                            "description": "The value of the attribute"
                        }
                    },
                    "required": [
                        "name",
                        "value"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "required": [
            "type",
            "label",
            "children",
            "attributes"
        ],
        "additionalProperties": false
    }
    """
        .strip();
Map<String, Object> metaSchema =
    Map.ofEntries(
        Map.entry("name", "metaschema"),
        Map.entry(
            "schema",
            Map.ofEntries(
                Map.entry("type", "object"),
                Map.entry(
                    "properties",
                    Map.ofEntries(
                        Map.entry(
                            "name",
                            Map.ofEntries(
                                Map.entry("type", "string"),
                                Map.entry("description", "The name of the schema"))),
                        Map.entry(
                            "type",
                            Map.ofEntries(
                                Map.entry("type", "string"),
                                Map.entry(
                                    "enum",
                                    List.of(
                                        "object", "array", "string", "number", "boolean",
                                        "null")))),
                        Map.entry(
                            "properties",
                            Map.ofEntries(
                                Map.entry("type", "object"),
                                Map.entry(
                                    "additionalProperties",
                                    Map.ofEntries(
                                        Map.entry("$ref", "#/$defs/schema_definition"))))),
                        Map.entry(
                            "items",
                            Map.ofEntries(
                                Map.entry(
                                    "anyOf",
                                    List.of(
                                        Map.ofEntries(
                                            Map.entry("$ref", "#/$defs/schema_definition")),
                                        Map.ofEntries(
                                            Map.entry("type", "array"),
                                            Map.entry(
                                                "items",
                                                Map.ofEntries(
                                                    Map.entry(
                                                        "$ref",
                                                        "#/$defs/schema_definition")))))))),
                        Map.entry(
                            "required",
                            Map.ofEntries(
                                Map.entry("type", "array"),
                                Map.entry(
                                    "items", Map.ofEntries(Map.entry("type", "string"))))),
                        Map.entry(
                            "additionalProperties",
                            Map.ofEntries(Map.entry("type", "boolean"))))),
                Map.entry("required", List.of("type")),
                Map.entry("additionalProperties", false),
                Map.entry(
                    "if",
                    Map.ofEntries(
                        Map.entry(
                            "properties",
                            Map.ofEntries(
                                Map.entry(
                                    "type", Map.ofEntries(Map.entry("const", "object"))))))),
                Map.entry("then", Map.ofEntries(Map.entry("required", List.of("properties")))),
                Map.entry(
                    "$defs",
                    Map.ofEntries(
                        Map.entry(
                            "schema_definition",
                            Map.ofEntries(
                                Map.entry("type", "object"),
                                Map.entry(
                                    "properties",
                                    Map.ofEntries(
                                        Map.entry(
                                            "type",
                                            Map.ofEntries(
                                                Map.entry("type", "string"),
                                                Map.entry(
                                                    "enum",
                                                    List.of(
                                                        "object", "array", "string", "number",
                                                        "boolean", "null")))),
                                        Map.entry(
                                            "properties",
                                            Map.ofEntries(
                                                Map.entry("type", "object"),
                                                Map.entry(
                                                    "additionalProperties",
                                                    Map.ofEntries(
                                                        Map.entry(
                                                            "$ref",
                                                            "#/$defs/schema_definition"))))),
                                        Map.entry(
                                            "items",
                                            Map.ofEntries(
                                                Map.entry(
                                                    "anyOf",
                                                    List.of(
                                                        Map.ofEntries(
                                                            Map.entry(
                                                                "$ref",
                                                                "#/$defs/schema_definition")),
                                                        Map.ofEntries(
                                                            Map.entry("type", "array"),
                                                            Map.entry(
                                                                "items",
                                                                Map.ofEntries(
                                                                    Map.entry(
                                                                        "$ref",
                                                                        "#/$defs/schema_definition")))))))),
                                        Map.entry(
                                            "required",
                                            Map.ofEntries(
                                                Map.entry("type", "array"),
                                                Map.entry(
                                                    "items",
                                                    Map.ofEntries(
                                                        Map.entry("type", "string"))))),
                                        Map.entry(
                                            "additionalProperties",
                                            Map.ofEntries(Map.entry("type", "boolean"))))),
                                Map.entry("required", List.of("type")),
                                Map.entry("additionalProperties", false),
                                Map.entry(
                                    "if",
                                    Map.ofEntries(
                                        Map.entry(
                                            "properties",
                                            Map.ofEntries(
                                                Map.entry(
                                                    "type",
                                                    Map.ofEntries(
                                                        Map.entry("const", "object"))))))),
                                Map.entry(
                                    "then",
                                    Map.ofEntries(
                                        Map.entry("required", List.of("properties")))))))))));

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6-terra")
        .addSystemMessage(metaPrompt)
        .addUserMessage("Description:\nDescribe a calendar event.")
        .putAdditionalBodyProperty(
            "response_format",
            JsonValue.from(Map.of("type", "json_schema", "json_schema", metaSchema)))
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

  

  

    
函数 schema

    Structured output meta-schema

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const metaSchema = {
  name: "function-metaschema",
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "The name of the function",
      },
      description: {
        type: "string",
        description: "A description of what the function does",
      },
      parameters: {
        $ref: "#/$defs/schema_definition",
        description: "A JSON schema that defines the function's parameters",
      },
    },
    required: ["name", "description", "parameters"],
    additionalProperties: false,
    $defs: {
      schema_definition: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["object", "array", "string", "number", "boolean", "null"],
          },
          properties: {
            type: "object",
            additionalProperties: {
              $ref: "#/$defs/schema_definition",
            },
          },
          items: {
            anyOf: [
              {
                $ref: "#/$defs/schema_definition",
              },
              {
                type: "array",
                items: {
                  $ref: "#/$defs/schema_definition",
                },
              },
            ],
          },
          required: {
            type: "array",
            items: {
              type: "string",
            },
          },
          additionalProperties: {
            type: "boolean",
          },
        },
        required: ["type"],
        additionalProperties: false,
        if: {
          properties: {
            type: {
              const: "object",
            },
          },
        },
        then: {
          required: ["properties"],
        },
      },
    },
  },
};

const metaPrompt = `# Instructions
Return a valid schema for the described function.

Pay special attention to making sure that "required" and "type" are always at the correct level of nesting. For example, "required" should be at the same level as "properties", not inside it.
Make sure that every property, no matter how short, has a type and description correctly nested inside it.

# Examples
Input: Assign values to NN hyperparameters
Output: {
    "name": "set_hyperparameters",
    "description": "Assign values to NN hyperparameters",
    "parameters": {
        "type": "object",
        "required": [
            "learning_rate",
            "epochs"
        ],
        "properties": {
            "epochs": {
                "type": "number",
                "description": "Number of complete passes through dataset"
            },
            "learning_rate": {
                "type": "number",
                "description": "Speed of model learning"
            }
        }
    }
}

Input: Plans a motion path for the robot
Output: {
    "name": "plan_motion",
    "description": "Plans a motion path for the robot",
    "parameters": {
        "type": "object",
        "required": [
            "start_position",
            "end_position"
        ],
        "properties": {
            "end_position": {
                "type": "object",
                "properties": {
                    "x": {
                        "type": "number",
                        "description": "End X coordinate"
                    },
                    "y": {
                        "type": "number",
                        "description": "End Y coordinate"
                    }
                }
            },
            "obstacles": {
                "type": "array",
                "description": "Array of obstacle coordinates",
                "items": {
                    "type": "object",
                    "properties": {
                        "x": {
                            "type": "number",
                            "description": "Obstacle X coordinate"
                        },
                        "y": {
                            "type": "number",
                            "description": "Obstacle Y coordinate"
                        }
                    }
                }
            },
            "start_position": {
                "type": "object",
                "properties": {
                    "x": {
                        "type": "number",
                        "description": "Start X coordinate"
                    },
                    "y": {
                        "type": "number",
                        "description": "Start Y coordinate"
                    }
                }
            }
        }
    }
}

Input: Calculates various technical indicators
Output: {
    "name": "technical_indicator",
    "description": "Calculates various technical indicators",
    "parameters": {
        "type": "object",
        "required": [
            "ticker",
            "indicators"
        ],
        "properties": {
            "indicators": {
                "type": "array",
                "description": "List of technical indicators to calculate",
                "items": {
                    "type": "string",
                    "description": "Technical indicator",
                    "enum": [
                        "RSI",
                        "MACD",
                        "Bollinger_Bands",
                        "Stochastic_Oscillator"
                    ]
                }
            },
            "period": {
                "type": "number",
                "description": "Time period for the analysis"
            },
            "ticker": {
                "type": "string",
                "description": "Stock ticker symbol"
            }
        }
    }
}`;

async function generateFunctionSchema(description) {
  const completion = await client.chat.completions.create({
    model: "gpt-5.6-terra",
    response_format: { type: "json_schema", json_schema: metaSchema },
    messages: [
      { role: "system", content: metaPrompt },
      { role: "user", content: "Description:\n" + description },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("The model did not return a schema.");
  return JSON.parse(content);
}

console.log(
  JSON.stringify(
    await generateFunctionSchema(
      "Create a function that checks the weather in a city."
    ),
    null,
    2
  )
);
```

```python
from openai import OpenAI
import json

client = OpenAI()

META_SCHEMA = {
    "name": "function-metaschema",
    "schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "The name of the function"},
            "description": {
                "type": "string",
                "description": "A description of what the function does",
            },
            "parameters": {
                "$ref": "#/$defs/schema_definition",
                "description": "A JSON schema that defines the function's parameters",
            },
        },
        "required": ["name", "description", "parameters"],
        "additionalProperties": False,
        "$defs": {
            "schema_definition": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "object",
                            "array",
                            "string",
                            "number",
                            "boolean",
                            "null",
                        ],
                    },
                    "properties": {
                        "type": "object",
                        "additionalProperties": {"$ref": "#/$defs/schema_definition"},
                    },
                    "items": {
                        "anyOf": [
                            {"$ref": "#/$defs/schema_definition"},
                            {
                                "type": "array",
                                "items": {"$ref": "#/$defs/schema_definition"},
                            },
                        ]
                    },
                    "required": {"type": "array", "items": {"type": "string"}},
                    "additionalProperties": {"type": "boolean"},
                },
                "required": ["type"],
                "additionalProperties": False,
                "if": {"properties": {"type": {"const": "object"}}},
                "then": {"required": ["properties"]},
            }
        },
    },
}

META_PROMPT = """
# Instructions
Return a valid schema for the described function.

Pay special attention to making sure that "required" and "type" are always at the correct level of nesting. For example, "required" should be at the same level as "properties", not inside it.
Make sure that every property, no matter how short, has a type and description correctly nested inside it.

# Examples
Input: Assign values to NN hyperparameters
Output: {
    "name": "set_hyperparameters",
    "description": "Assign values to NN hyperparameters",
    "parameters": {
        "type": "object",
        "required": [
            "learning_rate",
            "epochs"
        ],
        "properties": {
            "epochs": {
                "type": "number",
                "description": "Number of complete passes through dataset"
            },
            "learning_rate": {
                "type": "number",
                "description": "Speed of model learning"
            }
        }
    }
}

Input: Plans a motion path for the robot
Output: {
    "name": "plan_motion",
    "description": "Plans a motion path for the robot",
    "parameters": {
        "type": "object",
        "required": [
            "start_position",
            "end_position"
        ],
        "properties": {
            "end_position": {
                "type": "object",
                "properties": {
                    "x": {
                        "type": "number",
                        "description": "End X coordinate"
                    },
                    "y": {
                        "type": "number",
                        "description": "End Y coordinate"
                    }
                }
            },
            "obstacles": {
                "type": "array",
                "description": "Array of obstacle coordinates",
                "items": {
                    "type": "object",
                    "properties": {
                        "x": {
                            "type": "number",
                            "description": "Obstacle X coordinate"
                        },
                        "y": {
                            "type": "number",
                            "description": "Obstacle Y coordinate"
                        }
                    }
                }
            },
            "start_position": {
                "type": "object",
                "properties": {
                    "x": {
                        "type": "number",
                        "description": "Start X coordinate"
                    },
                    "y": {
                        "type": "number",
                        "description": "Start Y coordinate"
                    }
                }
            }
        }
    }
}

Input: Calculates various technical indicators
Output: {
    "name": "technical_indicator",
    "description": "Calculates various technical indicators",
    "parameters": {
        "type": "object",
        "required": [
            "ticker",
            "indicators"
        ],
        "properties": {
            "indicators": {
                "type": "array",
                "description": "List of technical indicators to calculate",
                "items": {
                    "type": "string",
                    "description": "Technical indicator",
                    "enum": [
                        "RSI",
                        "MACD",
                        "Bollinger_Bands",
                        "Stochastic_Oscillator"
                    ]
                }
            },
            "period": {
                "type": "number",
                "description": "Time period for the analysis"
            },
            "ticker": {
                "type": "string",
                "description": "Stock ticker symbol"
            }
        }
    }
}
""".strip()


def generate_function_schema(description: str):
    completion = client.chat.completions.create(
        model="gpt-5.6-terra",
        response_format={"type": "json_schema", "json_schema": META_SCHEMA},
        messages=[
            {
                "role": "system",
                "content": META_PROMPT,
            },
            {
                "role": "user",
                "content": "Description:\n" + description,
            },
        ],
    )

    return json.loads(completion.choices[0].message.content)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.util.List;
import java.util.Map;

String metaPrompt =
    """
    # Instructions
    Return a valid schema for the described function.

    Pay special attention to making sure that "required" and "type" are always at the correct level of nesting. For example, "required" should be at the same level as "properties", not inside it.
    Make sure that every property, no matter how short, has a type and description correctly nested inside it.

    # Examples
    Input: Assign values to NN hyperparameters
    Output: {
        "name": "set_hyperparameters",
        "description": "Assign values to NN hyperparameters",
        "parameters": {
            "type": "object",
            "required": [
                "learning_rate",
                "epochs"
            ],
            "properties": {
                "epochs": {
                    "type": "number",
                    "description": "Number of complete passes through dataset"
                },
                "learning_rate": {
                    "type": "number",
                    "description": "Speed of model learning"
                }
            }
        }
    }

    Input: Plans a motion path for the robot
    Output: {
        "name": "plan_motion",
        "description": "Plans a motion path for the robot",
        "parameters": {
            "type": "object",
            "required": [
                "start_position",
                "end_position"
            ],
            "properties": {
                "end_position": {
                    "type": "object",
                    "properties": {
                        "x": {
                            "type": "number",
                            "description": "End X coordinate"
                        },
                        "y": {
                            "type": "number",
                            "description": "End Y coordinate"
                        }
                    }
                },
                "obstacles": {
                    "type": "array",
                    "description": "Array of obstacle coordinates",
                    "items": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number",
                                "description": "Obstacle X coordinate"
                            },
                            "y": {
                                "type": "number",
                                "description": "Obstacle Y coordinate"
                            }
                        }
                    }
                },
                "start_position": {
                    "type": "object",
                    "properties": {
                        "x": {
                            "type": "number",
                            "description": "Start X coordinate"
                        },
                        "y": {
                            "type": "number",
                            "description": "Start Y coordinate"
                        }
                    }
                }
            }
        }
    }

    Input: Calculates various technical indicators
    Output: {
        "name": "technical_indicator",
        "description": "Calculates various technical indicators",
        "parameters": {
            "type": "object",
            "required": [
                "ticker",
                "indicators"
            ],
            "properties": {
                "indicators": {
                    "type": "array",
                    "description": "List of technical indicators to calculate",
                    "items": {
                        "type": "string",
                        "description": "Technical indicator",
                        "enum": [
                            "RSI",
                            "MACD",
                            "Bollinger_Bands",
                            "Stochastic_Oscillator"
                        ]
                    }
                },
                "period": {
                    "type": "number",
                    "description": "Time period for the analysis"
                },
                "ticker": {
                    "type": "string",
                    "description": "Stock ticker symbol"
                }
            }
        }
    }
    """
        .strip();
Map<String, Object> schemaDefinition =
    Map.of(
        "type", "object",
        "properties",
            Map.of(
                "type",
                    Map.of(
                        "type",
                        "string",
                        "enum",
                        List.of("object", "array", "string", "number", "boolean", "null")),
                "properties",
                    Map.of(
                        "type",
                        "object",
                        "additionalProperties",
                        Map.of("$ref", "#/$defs/schema_definition")),
                "items",
                    Map.of(
                        "anyOf",
                        List.of(
                            Map.of("$ref", "#/$defs/schema_definition"),
                            Map.of(
                                "type",
                                "array",
                                "items",
                                Map.of("$ref", "#/$defs/schema_definition")))),
                "required", Map.of("type", "array", "items", Map.of("type", "string")),
                "additionalProperties", Map.of("type", "boolean")),
        "required", List.of("type"),
        "additionalProperties", false,
        "if", Map.of("properties", Map.of("type", Map.of("const", "object"))),
        "then", Map.of("required", List.of("properties")));
Map<String, Object> functionSchema =
    Map.of(
        "type", "object",
        "properties",
            Map.of(
                "name", Map.of("type", "string", "description", "The name of the function"),
                "description",
                    Map.of(
                        "type",
                        "string",
                        "description",
                        "A description of what the function does"),
                "parameters",
                    Map.of(
                        "$ref",
                        "#/$defs/schema_definition",
                        "description",
                        "A JSON schema that defines the function's parameters")),
        "required", List.of("name", "description", "parameters"),
        "additionalProperties", false,
        "$defs", Map.of("schema_definition", schemaDefinition));

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6-terra")
        .addSystemMessage(metaPrompt)
        .addUserMessage("Description:\nSchedule a meeting with a title and start time.")
        .putAdditionalBodyProperty(
            "response_format",
            JsonValue.from(
                Map.of(
                    "type",
                    "json_schema",
                    "json_schema",
                    Map.of("name", "function-metaschema", "schema", functionSchema))))
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```