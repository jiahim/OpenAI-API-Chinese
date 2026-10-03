# 提示词生成

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得该页面的 Markdown 版本。

该 **Generate** 按钮（在 [Playground](https://platform.openai.com/chat/edit) 让你仅根据任务描述即可生成提示， [functions](https://developers.openai.com/api/docs/guides/function-calling)，和 [schemas](https://developers.openai.com/api/docs/guides/structured-outputs#supported-schemas) 。本指南将详细讲解其工作原理。

## 概述

从头创建提示词和模式可能比较耗时，因此生成它们可以帮助你快速入门。生成按钮主要使用两种方法：

1. **提示：** 我们使用 **元提示** ，结合最佳实践来生成或改进提示。
1. **模式：** 我们使用 **元模式** ，用于生成有效的 JSON 和函数语法。

虽然我们目前使用元提示和模式，但未来可能会集成更先进的技术，例如 [DSPy](https://arxiv.org/abs/2310.03714) 和 ["梯度下降"](https://arxiv.org/abs/2305.03495).

## Prompts

一个 **meta-prompt** 指示模型根据你的任务描述创建一个优质提示词，或改进已有的提示词。Playground 中的 meta-prompts 汲取自我们的 [prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) 最佳实践以及与用户合作积累的实战经验。

我们会针对不同的输出类型（例如音频）使用特定的 meta-prompts，以确保生成的提示词符合预期格式。

### Meta-prompts



Text-out

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
    model: "gpt-6-astra",
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
        model="gpt-6-astra",
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

````go
import (
	"context"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	metaPrompt := "Given a task description or existing prompt, produce a detailed system prompt to guide a language model in completing the task effectively.\n" +
		"\n" +
		"# Guidelines\n" +
		"\n" +
		"- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.\n" +
		"- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.\n" +
		"- Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!\n" +
		"    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.\n" +
		"    - Conclusion, classifications, or results should ALWAYS appear last.\n" +
		"- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.\n" +
		"   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.\n" +
		"- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.\n" +
		"- Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.\n" +
		"- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.\n" +
		"- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.\n" +
		"- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)\n" +
		"    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.\n" +
		"    - JSON should never be wrapped in code blocks (```) unless explicitly requested.\n" +
		"\n" +
		"The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no \"---\")\n" +
		"\n" +
		"[Concise instruction describing the task - this should be the first line in the prompt, no section header]\n" +
		"\n" +
		"[Additional details as needed.]\n" +
		"\n" +
		"[Optional sections with headings or bullet points for detailed steps.]\n" +
		"\n" +
		"# Steps [optional]\n" +
		"\n" +
		"[optional: a detailed breakdown of the steps necessary to accomplish the task]\n" +
		"\n" +
		"# Output Format\n" +
		"\n" +
		"[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]\n" +
		"\n" +
		"# Examples [optional]\n" +
		"\n" +
		"[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]\n" +
		"[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]\n" +
		"\n" +
		"# Notes [optional]\n" +
		"\n" +
		"[optional: edge cases, details, and an area to call or repeat out specific important considerations]\n"
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(metaPrompt), openai.UserMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue."),
		}})
	if err != nil {
		return err
	}
	fmt.Println(completion.Choices[0].Message.Content)
	return nil
}
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
        .model("gpt-6-astra")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\nWrite a concise product launch announcement.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
````

````csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

string metaPrompt = """"
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
    """";
ChatCompletionOptions options = new();
ChatCompletion result = await client.CompleteChatAsync([new SystemChatMessage(metaPrompt), new UserChatMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue.")], options);
Console.WriteLine(result.Content[0].Text);
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
    model: "gpt-6-astra",
    messages: [
      {
        role: :system,
        content: meta_prompt
      },
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

  

  

    
Audio-out

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
    model: "gpt-6-astra",
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
        model="gpt-6-astra",
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

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	metaPrompt := "Given a task description or existing prompt, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.\n" +
		"\n" +
		"# Guidelines\n" +
		"\n" +
		"- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.\n" +
		"- Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.\n" +
		"- Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.\n" +
		"- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.\n" +
		"- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.\n" +
		"   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.\n" +
		"  - It is very important that any examples included reflect the short, conversational output responses of the model.\n" +
		"Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.\n" +
		"  - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for \"short\" responses, then the examples should truly have 1-10 word responses max.\n" +
		"  - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.\n" +
		"- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.\n" +
		"- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.\n" +
		"- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.\n" +
		"\n" +
		"The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no \"---\")\n" +
		"\n" +
		"[Concise instruction describing the task - this should be the first line in the prompt, no section header]\n" +
		"\n" +
		"[Additional details as needed.]\n" +
		"\n" +
		"[Optional sections with headings or bullet points for detailed steps.]\n" +
		"\n" +
		"# Examples [optional]\n" +
		"\n" +
		"[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]\n" +
		"[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]\n" +
		"\n" +
		"# Notes [optional]\n" +
		"\n" +
		"[optional: edge cases, details, and an area to call or repeat out specific important considerations]\n"
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(metaPrompt), openai.UserMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue."),
		}})
	if err != nil {
		return err
	}
	fmt.Println(completion.Choices[0].Message.Content)
	return nil
}
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
        .model("gpt-6-astra")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\n"
                + "Create a friendly voice assistant for a bike shop.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

string metaPrompt = """"
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
    """";
ChatCompletionOptions options = new();
ChatCompletion result = await client.CompleteChatAsync([new SystemChatMessage(metaPrompt), new UserChatMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue.")], options);
Console.WriteLine(result.Content[0].Text);
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
    model: "gpt-6-astra",
    messages: [
      {
        role: :system,
        content: meta_prompt
      },
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

为了编辑提示词，我们使用了一个略作修改的元提示。直接编辑比较容易应用，但对于更开放式的修订，识别所需的更改可能具有挑战性。为了解决这一问题，我们在响应开头加入了一个 **推理部分** 。该部分通过评估现有提示词的清晰度、思维链排序、整体结构和具体性等因素，来引导模型确定需要做哪些更改。推理部分会提出改进建议，然后从最终响应中解析出来。



Text-out

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
    model: "gpt-6-astra",
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
        model="gpt-6-astra",
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

````go
import (
	"context"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	metaPrompt := "Given a current prompt and a change description, produce a detailed system prompt to guide a language model in completing the task effectively.\n" +
		"\n" +
		"Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:\n" +
		"<reasoning>\n" +
		"- Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)\n" +
		"- Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?\n" +
		"    - Identify: (max 10 words) if so, which section(s) utilize reasoning?\n" +
		"    - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?\n" +
		"    - Ordering: (before/after) is the chain of though located before or after\n" +
		"- Structure: (yes/no) does the input prompt have a well defined structure\n" +
		"- Examples: (yes/no) does the input prompt have few-shot examples\n" +
		"    - Representative: (1-5) if present, how representative are the examples?\n" +
		"- Complexity: (1-5) how complex is the input prompt?\n" +
		"    - Task: (1-5) how complex is the implied task?\n" +
		"    - Necessity: ()\n" +
		"- Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)\n" +
		"- Prioritization: (list) what 1-3 categories are the MOST important to address.\n" +
		"- Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed\n" +
		"</reasoning>\n" +
		"\n" +
		"# Guidelines\n" +
		"\n" +
		"- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.\n" +
		"- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.\n" +
		"- Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!\n" +
		"    - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.\n" +
		"    - Conclusion, classifications, or results should ALWAYS appear last.\n" +
		"- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.\n" +
		"   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.\n" +
		"- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.\n" +
		"- Formatting: Use markdown features for readability. DO NOT USE ``` CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.\n" +
		"- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.\n" +
		"- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.\n" +
		"- Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)\n" +
		"    - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.\n" +
		"    - JSON should never be wrapped in code blocks (```) unless explicitly requested.\n" +
		"\n" +
		"The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no \"---\")\n" +
		"\n" +
		"[Concise instruction describing the task - this should be the first line in the prompt, no section header]\n" +
		"\n" +
		"[Additional details as needed.]\n" +
		"\n" +
		"[Optional sections with headings or bullet points for detailed steps.]\n" +
		"\n" +
		"# Steps [optional]\n" +
		"\n" +
		"[optional: a detailed breakdown of the steps necessary to accomplish the task]\n" +
		"\n" +
		"# Output Format\n" +
		"\n" +
		"[Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]\n" +
		"\n" +
		"# Examples [optional]\n" +
		"\n" +
		"[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]\n" +
		"[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]\n" +
		"\n" +
		"# Notes [optional]\n" +
		"\n" +
		"[optional: edge cases, details, and an area to call or repeat out specific important considerations]\n" +
		"[NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]\n"
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(metaPrompt), openai.UserMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue."),
		}})
	if err != nil {
		return err
	}
	fmt.Println(completion.Choices[0].Message.Content)
	return nil
}
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
        .model("gpt-6-astra")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\nMake this product launch announcement clearer and more concise.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
````

````csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

string metaPrompt = """"
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
    """";
ChatCompletionOptions options = new();
ChatCompletion result = await client.CompleteChatAsync([new SystemChatMessage(metaPrompt), new UserChatMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue.")], options);
Console.WriteLine(result.Content[0].Text);
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
    model: "gpt-6-astra",
    messages: [
      {
        role: :system,
        content: meta_prompt
      },
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

  

  

    
Audio-out

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
    model: "gpt-6-astra",
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
        model="gpt-6-astra",
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

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	metaPrompt := "Given a current prompt and a change description, produce a detailed system prompt to guide a realtime audio output language model in completing the task effectively.\n" +
		"\n" +
		"Your final output will be the full corrected prompt verbatim. However, before that, at the very beginning of your response, use <reasoning> tags to analyze the prompt and determine the following, explicitly:\n" +
		"<reasoning>\n" +
		"- Simple Change: (yes/no) Is the change description explicit and simple? (If so, skip the rest of these questions.)\n" +
		"- Reasoning: (yes/no) Does the current prompt use reasoning, analysis, or chain of thought?\n" +
		"    - Identify: (max 10 words) if so, which section(s) utilize reasoning?\n" +
		"    - Conclusion: (yes/no) is the chain of thought used to determine a conclusion?\n" +
		"    - Ordering: (before/after) is the chain of though located before or after\n" +
		"- Structure: (yes/no) does the input prompt have a well defined structure\n" +
		"- Examples: (yes/no) does the input prompt have few-shot examples\n" +
		"    - Representative: (1-5) if present, how representative are the examples?\n" +
		"- Complexity: (1-5) how complex is the input prompt?\n" +
		"    - Task: (1-5) how complex is the implied task?\n" +
		"    - Necessity: ()\n" +
		"- Specificity: (1-5) how detailed and specific is the prompt? (not to be confused with length)\n" +
		"- Prioritization: (list) what 1-3 categories are the MOST important to address.\n" +
		"- Conclusion: (max 30 words) given the previous assessment, give a very concise, imperative description of what should be changed and how. this does not have to adhere strictly to only the categories listed\n" +
		"</reasoning>\n" +
		"\n" +
		"# Guidelines\n" +
		"\n" +
		"- Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.\n" +
		"- Tone: Make sure to specifically call out the tone. By default it should be emotive and friendly, and speak quickly to avoid keeping the user just waiting.\n" +
		"- Audio Output Constraints: Because the model is outputting audio, the responses should be short and conversational.\n" +
		"- Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.\n" +
		"- Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.\n" +
		"   - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.\n" +
		"  - It is very important that any examples included reflect the short, conversational output responses of the model.\n" +
		"Keep the sentences very short by default. Instead of 3 sentences in a row by the assistant, it should be split up with a back and forth with the user instead.\n" +
		"  - By default each sentence should be a few words only (5-20ish words). However, if the user specifically asks for \"short\" responses, then the examples should truly have 1-10 word responses max.\n" +
		"  - Make sure the examples are multi-turn (at least 4 back-forth-back-forth per example), not just one questions an response. They should reflect an organic conversation.\n" +
		"- Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.\n" +
		"- Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.\n" +
		"- Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.\n" +
		"\n" +
		"The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no \"---\")\n" +
		"\n" +
		"[Concise instruction describing the task - this should be the first line in the prompt, no section header]\n" +
		"\n" +
		"[Additional details as needed.]\n" +
		"\n" +
		"[Optional sections with headings or bullet points for detailed steps.]\n" +
		"\n" +
		"# Examples [optional]\n" +
		"\n" +
		"[Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]\n" +
		"[If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]\n" +
		"\n" +
		"# Notes [optional]\n" +
		"\n" +
		"[optional: edge cases, details, and an area to call or repeat out specific important considerations]\n" +
		"[NOTE: you must start with a <reasoning> section. the immediate next token you produce should be <reasoning>]\n"
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(metaPrompt), openai.UserMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue."),
		}})
	if err != nil {
		return err
	}
	fmt.Println(completion.Choices[0].Message.Content)
	return nil
}
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
        .model("gpt-6-astra")
        .addSystemMessage(metaPrompt)
        .addUserMessage(
            "Task, Goal, or Current Prompt:\nMake this voice assistant prompt warmer and more direct.")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

string metaPrompt = """"
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
    """";
ChatCompletionOptions options = new();
ChatCompletion result = await client.CompleteChatAsync([new SystemChatMessage(metaPrompt), new UserChatMessage("Task, Goal, or Current Prompt: Help a customer resolve a billing issue.")], options);
Console.WriteLine(result.Content[0].Text);
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
    model: "gpt-6-astra",
    messages: [
      {
        role: :system,
        content: meta_prompt
      },
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

[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) schema 和 function schema 本身都是 JSON 对象，因此我们利用 Structured Outputs 来生成它们。
这需要为目标输出定义一个 schema，而目标输出本身在此处也是一个 schema。为此，我们使用自描述 schema——一种 **meta-schema**.

由于 function schema 中的 `parameters` 字段本身也是一个 schema，我们使用同一个 meta-schema 来生成函数。

### 定义受限的元模式

[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 支持两种模式： `strict=true` 和 `strict=false`。两种模式都使用相同的、经过训练以遵循所提供 schema 的模型，但只有“strict mode”通过受限采样保证完全遵循。

我们的目标是使用 strict mode 自身为 strict mode 生成 schema。然而， [JSON Schema Specification](https://json-schema.org/specification#meta-schemas) 官方提供的元 schema 依赖的功能 [当前尚不支持](https://developers.openai.com/api/docs/guides/structured-outputs#some-type-specific-keywords-are-not-yet-supported) 于 strict mode。这带来了影响输入和输出 schema 的挑战。

1. **Input schema:** 我们无法使用 [unsupported features](https://developers.openai.com/api/docs/guides/structured-outputs#some-type-specific-keywords-are-not-yet-supported) 中的功能来描述输出架构。
2. **Output schema:** 生成的结构不能包含 [unsupported features](https://developers.openai.com/api/docs/guides/structured-outputs#some-type-specific-keywords-are-not-yet-supported).

因为我们需要在输出 schema 中生成新的键，所以输入的 meta-schema 必须使用 `additionalProperties`。这意味着我们目前无法使用 strict mode 来生成 schema。不过，我们仍然希望生成的 schema 能遵循 strict mode 的约束。

为了克服这个限制，我们定义了一个 **pseudo-meta-schema** ——一种使用 strict mode 不支持的功能来描述仅在 strict mode 中受支持功能的 meta-schema。本质上，这种方法在 meta-schema 定义层面跳出 strict mode，同时仍确保生成的 schema 遵循 strict mode 的约束。



构建一个受限的 meta-schema 是一项具有挑战性的任务，因此我们借助模型来完成。

我们首先给 `o1-preview` 和 `gpt-4o` 在 JSON mode 下提供了基于 Structured Outputs 文档的我们对目标的描述。
经过几轮迭代后，我们开发出第一个可用的 meta-schema。

然后我们使用 `gpt-4o` 结合 Structured Outputs，并提供 _该初始的 schema_ 以及我们的任务描述和文档，来生成更好的候选方案。每一次迭代，我们都使用更好的 schema 生成下一个版本，直到最终由人工仔细审阅。

最后，在清理输出后，我们针对一组用于 schema 和函数的 evals 验证了这些 schema。



### 输出清洗

严格模式可保证输出完全符合 schema。但由于生成阶段无法启用它，我们需要先校验输出，再将其转换为目标格式。

生成 schema 后，我们会执行以下步骤：

1. **将 `additionalProperties` 设置为 `false`** 以应用于所有对象。
1. **将所有属性标记为必填**.
1. **对于结构化输出 schema**，请将它们包装在 [`json_schema`](https://developers.openai.com/api/docs/guides/structured-outputs?context=without_parse#how-to-use) 对象中。
1. **对于函数**，请将它们包装在 [`function`](https://developers.openai.com/api/docs/guides/function-calling#defining-functions) 对象中。

实时 API
  [function](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling) object
  与 Chat Completions API 略有不同，但使用相同的 schema。

### Meta-schemas

每个元模式都有对应的提示，其中包含 few-shot 示例。结合 Structured Outputs 的可靠性——即使不使用严格模式——我们也能够生成模式。



结构化输出模式

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

```go
import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	metaPrompt := "# Instructions\n" +
		"Return a valid schema for the described JSON.\n" +
		"\n" +
		"You must also make sure:\n" +
		"- all fields in an object are set as required\n" +
		"- I REPEAT, ALL FIELDS MUST BE MARKED AS REQUIRED\n" +
		"- all objects must have additionalProperties set to false\n" +
		"    - because of this, some cases like \"attributes\" or \"metadata\" properties that would normally allow additional properties should instead have a fixed set of properties\n" +
		"- all objects must have properties defined\n" +
		"- field order matters. any form of \"thinking\" or \"explanation\" should come before the conclusion\n" +
		"- $defs must be defined under the schema param\n" +
		"\n" +
		"Notable keywords NOT supported include:\n" +
		"- For objects: unevaluatedProperties, propertyNames, minProperties, maxProperties\n" +
		"- For arrays: unevaluatedItems, contains, minContains, maxContains, uniqueItems\n" +
		"\n" +
		"Other notes:\n" +
		"- definitions and recursion are supported\n" +
		"- only if necessary to include references e.g. \"$defs\", it must be inside the \"schema\" object\n" +
		"\n" +
		"# Examples\n" +
		"Input: Generate a math reasoning schema with steps and a final answer.\n" +
		"Output: {\n" +
		"    \"name\": \"math_reasoning\",\n" +
		"    \"type\": \"object\",\n" +
		"    \"properties\": {\n" +
		"        \"steps\": {\n" +
		"            \"type\": \"array\",\n" +
		"            \"description\": \"A sequence of steps involved in solving the math problem.\",\n" +
		"            \"items\": {\n" +
		"                \"type\": \"object\",\n" +
		"                \"properties\": {\n" +
		"                    \"explanation\": {\n" +
		"                        \"type\": \"string\",\n" +
		"                        \"description\": \"Description of the reasoning or method used in this step.\"\n" +
		"                    },\n" +
		"                    \"output\": {\n" +
		"                        \"type\": \"string\",\n" +
		"                        \"description\": \"Result or outcome of this specific step.\"\n" +
		"                    }\n" +
		"                },\n" +
		"                \"required\": [\n" +
		"                    \"explanation\",\n" +
		"                    \"output\"\n" +
		"                ],\n" +
		"                \"additionalProperties\": false\n" +
		"            }\n" +
		"        },\n" +
		"        \"final_answer\": {\n" +
		"            \"type\": \"string\",\n" +
		"            \"description\": \"The final solution or answer to the math problem.\"\n" +
		"        }\n" +
		"    },\n" +
		"    \"required\": [\n" +
		"        \"steps\",\n" +
		"        \"final_answer\"\n" +
		"    ],\n" +
		"    \"additionalProperties\": false\n" +
		"}\n" +
		"\n" +
		"Input: Give me a linked list\n" +
		"Output: {\n" +
		"    \"name\": \"linked_list\",\n" +
		"    \"type\": \"object\",\n" +
		"    \"properties\": {\n" +
		"        \"linked_list\": {\n" +
		"            \"$ref\": \"#/$defs/linked_list_node\",\n" +
		"            \"description\": \"The head node of the linked list.\"\n" +
		"        }\n" +
		"    },\n" +
		"    \"$defs\": {\n" +
		"        \"linked_list_node\": {\n" +
		"            \"type\": \"object\",\n" +
		"            \"description\": \"Defines a node in a singly linked list.\",\n" +
		"            \"properties\": {\n" +
		"                \"value\": {\n" +
		"                    \"type\": \"number\",\n" +
		"                    \"description\": \"The value stored in this node.\"\n" +
		"                },\n" +
		"                \"next\": {\n" +
		"                    \"anyOf\": [\n" +
		"                        {\n" +
		"                            \"$ref\": \"#/$defs/linked_list_node\"\n" +
		"                        },\n" +
		"                        {\n" +
		"                            \"type\": \"null\"\n" +
		"                        }\n" +
		"                    ],\n" +
		"                    \"description\": \"Reference to the next node; null if it is the last node.\"\n" +
		"                }\n" +
		"            },\n" +
		"            \"required\": [\n" +
		"                \"value\",\n" +
		"                \"next\"\n" +
		"            ],\n" +
		"            \"additionalProperties\": false\n" +
		"        }\n" +
		"    },\n" +
		"    \"required\": [\n" +
		"        \"linked_list\"\n" +
		"    ],\n" +
		"    \"additionalProperties\": false\n" +
		"}\n" +
		"\n" +
		"Input: Dynamically generated UI\n" +
		"Output: {\n" +
		"    \"name\": \"ui\",\n" +
		"    \"type\": \"object\",\n" +
		"    \"properties\": {\n" +
		"        \"type\": {\n" +
		"            \"type\": \"string\",\n" +
		"            \"description\": \"The type of the UI component\",\n" +
		"            \"enum\": [\n" +
		"                \"div\",\n" +
		"                \"button\",\n" +
		"                \"header\",\n" +
		"                \"section\",\n" +
		"                \"field\",\n" +
		"                \"form\"\n" +
		"            ]\n" +
		"        },\n" +
		"        \"label\": {\n" +
		"            \"type\": \"string\",\n" +
		"            \"description\": \"The label of the UI component, used for buttons or form fields\"\n" +
		"        },\n" +
		"        \"children\": {\n" +
		"            \"type\": \"array\",\n" +
		"            \"description\": \"Nested UI components\",\n" +
		"            \"items\": {\n" +
		"                \"$ref\": \"#\"\n" +
		"            }\n" +
		"        },\n" +
		"        \"attributes\": {\n" +
		"            \"type\": \"array\",\n" +
		"            \"description\": \"Arbitrary attributes for the UI component, suitable for any element\",\n" +
		"            \"items\": {\n" +
		"                \"type\": \"object\",\n" +
		"                \"properties\": {\n" +
		"                    \"name\": {\n" +
		"                        \"type\": \"string\",\n" +
		"                        \"description\": \"The name of the attribute, for example onClick or className\"\n" +
		"                    },\n" +
		"                    \"value\": {\n" +
		"                        \"type\": \"string\",\n" +
		"                        \"description\": \"The value of the attribute\"\n" +
		"                    }\n" +
		"                },\n" +
		"                \"required\": [\n" +
		"                    \"name\",\n" +
		"                    \"value\"\n" +
		"                ],\n" +
		"                \"additionalProperties\": false\n" +
		"            }\n" +
		"        }\n" +
		"    },\n" +
		"    \"required\": [\n" +
		"        \"type\",\n" +
		"        \"label\",\n" +
		"        \"children\",\n" +
		"        \"attributes\"\n" +
		"    ],\n" +
		"    \"additionalProperties\": false\n" +
		"}\n"
	var schema map[string]any
	if err := json.Unmarshal([]byte(`{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the schema"
    },
    "type": {
      "type": "string",
      "enum": [
        "object",
        "array",
        "string",
        "number",
        "boolean",
        "null"
      ]
    },
    "properties": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/$defs/schema_definition"
      }
    },
    "items": {
      "anyOf": [
        {
          "$ref": "#/$defs/schema_definition"
        },
        {
          "type": "array",
          "items": {
            "$ref": "#/$defs/schema_definition"
          }
        }
      ]
    },
    "required": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "additionalProperties": {
      "type": "boolean"
    }
  },
  "required": [
    "type"
  ],
  "additionalProperties": false,
  "if": {
    "properties": {
      "type": {
        "const": "object"
      }
    }
  },
  "then": {
    "required": [
      "properties"
    ]
  },
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
            "null"
          ]
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/schema_definition"
          }
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#/$defs/schema_definition"
            },
            {
              "type": "array",
              "items": {
                "$ref": "#/$defs/schema_definition"
              }
            }
          ]
        },
        "required": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "additionalProperties": {
          "type": "boolean"
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false,
      "if": {
        "properties": {
          "type": {
            "const": "object"
          }
        }
      },
      "then": {
        "required": [
          "properties"
        ]
      }
    }
  }
}`), &schema); err != nil {
		return err
	}
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-5.6-terra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(metaPrompt), openai.UserMessage("Description: Schedule a meeting with a title and start time."),
		}, ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{OfJSONSchema: &shared.ResponseFormatJSONSchemaParam{JSONSchema: shared.ResponseFormatJSONSchemaJSONSchemaParam{Name: "metaschema", Schema: schema}}}})
	if err != nil {
		return err
	}
	var result any
	if err := json.Unmarshal([]byte(completion.Choices[0].Message.Content), &result); err != nil {
		return err
	}
	encoded, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return err
	}
	fmt.Println(string(encoded))
	return nil
}
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

```csharp
using System.Text.Json;
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-5.6-terra";
ChatClient client = new(model, key);

string metaPrompt = """"
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
    """";
ChatCompletionOptions options = new();
options.ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat("metaschema", BinaryData.FromString("""
    {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the schema"
        },
        "type": {
          "type": "string",
          "enum": [
            "object",
            "array",
            "string",
            "number",
            "boolean",
            "null"
          ]
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/schema_definition"
          }
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#/$defs/schema_definition"
            },
            {
              "type": "array",
              "items": {
                "$ref": "#/$defs/schema_definition"
              }
            }
          ]
        },
        "required": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "additionalProperties": {
          "type": "boolean"
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false,
      "if": {
        "properties": {
          "type": {
            "const": "object"
          }
        }
      },
      "then": {
        "required": [
          "properties"
        ]
      },
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
                "null"
              ]
            },
            "properties": {
              "type": "object",
              "additionalProperties": {
                "$ref": "#/$defs/schema_definition"
              }
            },
            "items": {
              "anyOf": [
                {
                  "$ref": "#/$defs/schema_definition"
                },
                {
                  "type": "array",
                  "items": {
                    "$ref": "#/$defs/schema_definition"
                  }
                }
              ]
            },
            "required": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "additionalProperties": {
              "type": "boolean"
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false,
          "if": {
            "properties": {
              "type": {
                "const": "object"
              }
            }
          },
          "then": {
            "required": [
              "properties"
            ]
          }
        }
      }
    }
    """));
ChatCompletion result = await client.CompleteChatAsync([new SystemChatMessage(metaPrompt), new UserChatMessage("Description: Schedule a meeting with a title and start time.")], options);
using JsonDocument parsed = JsonDocument.Parse(result.Content[0].Text);
Console.WriteLine(parsed.RootElement);
```

```ruby
require "openai"
require "json"

META_SCHEMA = {
  "name" => "metaschema",
  "schema" => {
    "type" => "object",
    "properties" => {
      "name" => {
        "type" => "string",
        "description" => "The name of the schema"
      },
      "type" => {
        "type" => "string",
        "enum" => ["object", "array", "string", "number", "boolean", "null"]
      },
      "properties" => {
        "type" => "object",
        "additionalProperties" => {
          "$ref" => "#/$defs/schema_definition"
        }
      },
      "items" => {
        "anyOf" => [
          {
            "$ref" => "#/$defs/schema_definition"
          }, {
            "type" => "array",
            "items" => {
              "$ref" => "#/$defs/schema_definition"
            }
          }
        ]
      },
      "required" => {
        "type" => "array",
        "items" => {
          "type" => "string"
        }
      },
      "additionalProperties" => {
        "type" => "boolean"
      }
    },
    "required" => ["type"],
    "additionalProperties" => false,
    "if" => {
      "properties" => {
        "type" => {
          "const" => "object"
        }
      }
    },
    "then" => {
      "required" => ["properties"]
    },
    "$defs" => {
      "schema_definition" => {
        "type" => "object",
        "properties" => {
          "type" => {
            "type" => "string",
            "enum" => ["object", "array", "string", "number", "boolean", "null"]
          },
          "properties" => {
            "type" => "object",
            "additionalProperties" => {
              "$ref" => "#/$defs/schema_definition"
            }
          },
          "items" => {
            "anyOf" => [
              {
                "$ref" => "#/$defs/schema_definition"
              }, {
                "type" => "array",
                "items" => {
                  "$ref" => "#/$defs/schema_definition"
                }
              }
            ]
          },
          "required" => {
            "type" => "array",
            "items" => {
              "type" => "string"
            }
          },
          "additionalProperties" => {
            "type" => "boolean"
          }
        },
        "required" => ["type"],
        "additionalProperties" => false,
        "if" => {
          "properties" => {
            "type" => {
              "const" => "object"
            }
          }
        },
        "then" => {
          "required" => ["properties"]
        }
      }
    }
  }
}

META_PROMPT = <<~PROMPT.strip
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
PROMPT

client = OpenAI::Client.new
completion = client.chat.completions.create(
  model: "gpt-5.6-terra",
  response_format: {
    type: :json_schema,
    json_schema: META_SCHEMA
  },
  messages: [
    {
      role: :system,
      content: META_PROMPT
    },
    {
      role: :user,
      content: "Description: Schedule a meeting with a title and start time."
    }
  ]
)
message = completion.choices.fetch(0).message
raise "Schema generation refused: #{message.refusal}" if message.refusal

puts(JSON.pretty_generate(JSON.parse(message.content || raise("No schema returned"))))
```

  

  

    
函数模式

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

```go
import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	client := openai.NewClient()
	metaPrompt := "# Instructions\n" +
		"Return a valid schema for the described function.\n" +
		"\n" +
		"Pay special attention to making sure that \"required\" and \"type\" are always at the correct level of nesting. For example, \"required\" should be at the same level as \"properties\", not inside it.\n" +
		"Make sure that every property, no matter how short, has a type and description correctly nested inside it.\n" +
		"\n" +
		"# Examples\n" +
		"Input: Assign values to NN hyperparameters\n" +
		"Output: {\n" +
		"    \"name\": \"set_hyperparameters\",\n" +
		"    \"description\": \"Assign values to NN hyperparameters\",\n" +
		"    \"parameters\": {\n" +
		"        \"type\": \"object\",\n" +
		"        \"required\": [\n" +
		"            \"learning_rate\",\n" +
		"            \"epochs\"\n" +
		"        ],\n" +
		"        \"properties\": {\n" +
		"            \"epochs\": {\n" +
		"                \"type\": \"number\",\n" +
		"                \"description\": \"Number of complete passes through dataset\"\n" +
		"            },\n" +
		"            \"learning_rate\": {\n" +
		"                \"type\": \"number\",\n" +
		"                \"description\": \"Speed of model learning\"\n" +
		"            }\n" +
		"        }\n" +
		"    }\n" +
		"}\n" +
		"\n" +
		"Input: Plans a motion path for the robot\n" +
		"Output: {\n" +
		"    \"name\": \"plan_motion\",\n" +
		"    \"description\": \"Plans a motion path for the robot\",\n" +
		"    \"parameters\": {\n" +
		"        \"type\": \"object\",\n" +
		"        \"required\": [\n" +
		"            \"start_position\",\n" +
		"            \"end_position\"\n" +
		"        ],\n" +
		"        \"properties\": {\n" +
		"            \"end_position\": {\n" +
		"                \"type\": \"object\",\n" +
		"                \"properties\": {\n" +
		"                    \"x\": {\n" +
		"                        \"type\": \"number\",\n" +
		"                        \"description\": \"End X coordinate\"\n" +
		"                    },\n" +
		"                    \"y\": {\n" +
		"                        \"type\": \"number\",\n" +
		"                        \"description\": \"End Y coordinate\"\n" +
		"                    }\n" +
		"                }\n" +
		"            },\n" +
		"            \"obstacles\": {\n" +
		"                \"type\": \"array\",\n" +
		"                \"description\": \"Array of obstacle coordinates\",\n" +
		"                \"items\": {\n" +
		"                    \"type\": \"object\",\n" +
		"                    \"properties\": {\n" +
		"                        \"x\": {\n" +
		"                            \"type\": \"number\",\n" +
		"                            \"description\": \"Obstacle X coordinate\"\n" +
		"                        },\n" +
		"                        \"y\": {\n" +
		"                            \"type\": \"number\",\n" +
		"                            \"description\": \"Obstacle Y coordinate\"\n" +
		"                        }\n" +
		"                    }\n" +
		"                }\n" +
		"            },\n" +
		"            \"start_position\": {\n" +
		"                \"type\": \"object\",\n" +
		"                \"properties\": {\n" +
		"                    \"x\": {\n" +
		"                        \"type\": \"number\",\n" +
		"                        \"description\": \"Start X coordinate\"\n" +
		"                    },\n" +
		"                    \"y\": {\n" +
		"                        \"type\": \"number\",\n" +
		"                        \"description\": \"Start Y coordinate\"\n" +
		"                    }\n" +
		"                }\n" +
		"            }\n" +
		"        }\n" +
		"    }\n" +
		"}\n" +
		"\n" +
		"Input: Calculates various technical indicators\n" +
		"Output: {\n" +
		"    \"name\": \"technical_indicator\",\n" +
		"    \"description\": \"Calculates various technical indicators\",\n" +
		"    \"parameters\": {\n" +
		"        \"type\": \"object\",\n" +
		"        \"required\": [\n" +
		"            \"ticker\",\n" +
		"            \"indicators\"\n" +
		"        ],\n" +
		"        \"properties\": {\n" +
		"            \"indicators\": {\n" +
		"                \"type\": \"array\",\n" +
		"                \"description\": \"List of technical indicators to calculate\",\n" +
		"                \"items\": {\n" +
		"                    \"type\": \"string\",\n" +
		"                    \"description\": \"Technical indicator\",\n" +
		"                    \"enum\": [\n" +
		"                        \"RSI\",\n" +
		"                        \"MACD\",\n" +
		"                        \"Bollinger_Bands\",\n" +
		"                        \"Stochastic_Oscillator\"\n" +
		"                    ]\n" +
		"                }\n" +
		"            },\n" +
		"            \"period\": {\n" +
		"                \"type\": \"number\",\n" +
		"                \"description\": \"Time period for the analysis\"\n" +
		"            },\n" +
		"            \"ticker\": {\n" +
		"                \"type\": \"string\",\n" +
		"                \"description\": \"Stock ticker symbol\"\n" +
		"            }\n" +
		"        }\n" +
		"    }\n" +
		"}\n"
	var schema map[string]any
	if err := json.Unmarshal([]byte(`{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the function"
    },
    "description": {
      "type": "string",
      "description": "A description of what the function does"
    },
    "parameters": {
      "$ref": "#/$defs/schema_definition",
      "description": "A JSON schema that defines the function's parameters"
    }
  },
  "required": [
    "name",
    "description",
    "parameters"
  ],
  "additionalProperties": false,
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
            "null"
          ]
        },
        "properties": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/$defs/schema_definition"
          }
        },
        "items": {
          "anyOf": [
            {
              "$ref": "#/$defs/schema_definition"
            },
            {
              "type": "array",
              "items": {
                "$ref": "#/$defs/schema_definition"
              }
            }
          ]
        },
        "required": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "additionalProperties": {
          "type": "boolean"
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false,
      "if": {
        "properties": {
          "type": {
            "const": "object"
          }
        }
      },
      "then": {
        "required": [
          "properties"
        ]
      }
    }
  }
}`), &schema); err != nil {
		return err
	}
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-5.6-terra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(metaPrompt), openai.UserMessage("Description: Schedule a meeting with a title and start time."),
		}, ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{OfJSONSchema: &shared.ResponseFormatJSONSchemaParam{JSONSchema: shared.ResponseFormatJSONSchemaJSONSchemaParam{Name: "function-metaschema", Schema: schema}}}})
	if err != nil {
		return err
	}
	var result any
	if err := json.Unmarshal([]byte(completion.Choices[0].Message.Content), &result); err != nil {
		return err
	}
	encoded, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return err
	}
	fmt.Println(string(encoded))
	return nil
}
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

```csharp
using System.Text.Json;
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-5.6-terra";
ChatClient client = new(model, key);

string metaPrompt = """"
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
    """";
ChatCompletionOptions options = new();
options.ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat("function-metaschema", BinaryData.FromString("""
    {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The name of the function"
        },
        "description": {
          "type": "string",
          "description": "A description of what the function does"
        },
        "parameters": {
          "$ref": "#/$defs/schema_definition",
          "description": "A JSON schema that defines the function's parameters"
        }
      },
      "required": [
        "name",
        "description",
        "parameters"
      ],
      "additionalProperties": false,
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
                "null"
              ]
            },
            "properties": {
              "type": "object",
              "additionalProperties": {
                "$ref": "#/$defs/schema_definition"
              }
            },
            "items": {
              "anyOf": [
                {
                  "$ref": "#/$defs/schema_definition"
                },
                {
                  "type": "array",
                  "items": {
                    "$ref": "#/$defs/schema_definition"
                  }
                }
              ]
            },
            "required": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "additionalProperties": {
              "type": "boolean"
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false,
          "if": {
            "properties": {
              "type": {
                "const": "object"
              }
            }
          },
          "then": {
            "required": [
              "properties"
            ]
          }
        }
      }
    }
    """));
ChatCompletion result = await client.CompleteChatAsync([new SystemChatMessage(metaPrompt), new UserChatMessage("Description: Schedule a meeting with a title and start time.")], options);
using JsonDocument parsed = JsonDocument.Parse(result.Content[0].Text);
Console.WriteLine(parsed.RootElement);
```

```ruby
require "openai"
require "json"

META_SCHEMA = {
  "name" => "function-metaschema",
  "schema" => {
    "type" => "object",
    "properties" => {
      "name" => {
        "type" => "string",
        "description" => "The name of the function"
      },
      "description" => {
        "type" => "string",
        "description" => "A description of what the function does"
      },
      "parameters" => {
        "$ref" => "#/$defs/schema_definition",
        "description" => "A JSON schema that defines the function's parameters"
      }
    },
    "required" => ["name", "description", "parameters"],
    "additionalProperties" => false,
    "$defs" => {
      "schema_definition" => {
        "type" => "object",
        "properties" => {
          "type" => {
            "type" => "string",
            "enum" => ["object", "array", "string", "number", "boolean", "null"]
          },
          "properties" => {
            "type" => "object",
            "additionalProperties" => {
              "$ref" => "#/$defs/schema_definition"
            }
          },
          "items" => {
            "anyOf" => [
              {
                "$ref" => "#/$defs/schema_definition"
              }, {
                "type" => "array",
                "items" => {
                  "$ref" => "#/$defs/schema_definition"
                }
              }
            ]
          },
          "required" => {
            "type" => "array",
            "items" => {
              "type" => "string"
            }
          },
          "additionalProperties" => {
            "type" => "boolean"
          }
        },
        "required" => ["type"],
        "additionalProperties" => false,
        "if" => {
          "properties" => {
            "type" => {
              "const" => "object"
            }
          }
        },
        "then" => {
          "required" => ["properties"]
        }
      }
    }
  }
}

META_PROMPT = <<~PROMPT.strip
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
PROMPT

client = OpenAI::Client.new
completion = client.chat.completions.create(
  model: "gpt-5.6-terra",
  response_format: {
    type: :json_schema,
    json_schema: META_SCHEMA
  },
  messages: [
    {
      role: :system,
      content: META_PROMPT
    },
    {
      role: :user,
      content: "Description: Schedule a meeting with a title and start time."
    }
  ]
)
message = completion.choices.fetch(0).message
raise "Schema generation refused: #{message.refusal}" if message.refusal

puts(JSON.pretty_generate(JSON.parse(message.content || raise("No schema returned"))))
```