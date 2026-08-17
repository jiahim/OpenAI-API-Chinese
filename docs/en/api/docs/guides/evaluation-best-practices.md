# Evaluation best practices

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Generative AI is variable. Models sometimes produce different output from the same input, which makes traditional software testing methods insufficient for AI architectures. Evaluations (**evals**) are a way to test your AI system despite this variability.

This guide provides high-level guidance on designing evals. To get started with the [Evals API](https://developers.openai.com/api/reference/resources/evals), see [evaluating model performance](https://developers.openai.com/api/docs/guides/evals).

OpenAI is deprecating the Evals platform. Existing evals content remains
  available during the transition window. Evals will become read-only for
  existing users on October 31, 2026, and the platform is scheduled to shut down
  on November 30, 2026. See the [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) for the current
  timeline.

## What are evals?

Evals are structured tests for measuring a model's performance. They help ensure accuracy, performance, and reliability, despite the nondeterministic nature of AI systems. They're also one of the only ways to _improve_ performance of an LLM-based application (through [fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization)).

### Types of evals

When you see the word "evals," it could refer to a few things:

- Industry benchmarks for comparing models in isolation, like [MMLU](https://github.com/openai/evals/blob/main/examples/mmlu.ipynb) and those listed on [HuggingFace's leaderboard](https://huggingface.co/collections/open-llm-leaderboard/the-big-benchmarks-collection-64faca6335a7fc7d4ffe974a)
- Standard numerical scores—like [ROUGE](https://aclanthology.org/W04-1013/), [BERTScore](https://arxiv.org/abs/1904.09675)—that you can use as you design evals for your use case
- Specific tests you implement to measure your LLM application's performance

This guide is about the third type: designing your own evals.

### How to read evals

You'll often see numerical eval scores between 0 and 1. There's more to evals than just scores. Combine metrics with human judgment to ensure you're answering the right questions.

**Evals tips**


- Adopt eval-driven development: Evaluate early and often. Write scoped tests at every stage.
- Design task-specific evals: Make tests reflect model capability in real-world distributions.
- Log everything: Log as you develop so you can mine your logs for good eval cases.
- Automate when possible: Structure evaluations to allow for automated scoring.
- It's a journey, not a destination: Evaluation is a continuous process.
- Maintain agreement: Use human feedback to calibrate automated scoring.

**Anti-patterns**



- Overly generic metrics: Relying solely on academic metrics like perplexity or BLEU score.
- Biased design: Creating eval datasets that don't faithfully reproduce production traffic patterns.
- Vibe-based evals: Using "it seems like it's working" as an evaluation strategy, or waiting until you ship before implementing any evals.
- Ignoring human feedback: Not calibrating your automated metrics against human evals.

## Design your eval process

There are a few important components of an eval workflow:

1. **Define eval objective**. What's the success criteria for the eval?
1. **Collect dataset**. Which data will help you evaluate against your objective? Consider synthetic eval data, domain-specific eval data, purchased eval data, human-curated eval data, production data, and historical data.
1. **Define eval metrics**. How will you check that the success criteria are met?
1. **Run and compare evals**. Iterate and improve model performance for your task or system.
1. **Continuously evaluate**. Set up continuous evaluation (CE) to run evals on every change, monitor your app to identify new cases of nondeterminism, and grow the eval set over time.

Let's run through a few examples.

### Example: Summarizing transcripts

To test your LLM-based application's ability to summarize transcripts, your eval design might be:

1. **Define eval objective**

   The model should be able to compete with reference summaries for relevance and accuracy.
1. **Collect dataset**

   Use a mix of production data (collected from user feedback on generated summaries) and datasets created by domain experts (writers) to determine a "good" summary.
1. **Define eval metrics**

   On a held-out set of 1000 reference transcripts → summaries, the implementation should achieve a ROUGE-L score of at least 0.40 and coherence score of at least 80% using G-Eval.
1. **Run and compare evals**

   Use the [Evals API](https://developers.openai.com/api/docs/guides/evals) to create and run evals in the OpenAI dashboard.
1. **Continuously evaluate**

   Set up continuous evaluation (CE) to run evals on every change, monitor your app to identify new cases of nondeterminism, and grow the eval set over time.

LLMs are better at discriminating between options. Therefore, evaluations
  should focus on tasks like pairwise comparisons, classification, or scoring
  against specific criteria instead of open-ended generation. Aligning
  evaluation methods with LLMs' strengths in comparison leads to more reliable
  assessments of LLM outputs or model comparisons.

### Example: Q&A over docs

To test your LLM-based application's ability to do Q&A over docs, your eval design might be:

1. **Define eval objective**

   The model should be able to provide precise answers, recall context as needed to reason through user prompts, and provide an answer that satisfies the user's need.
1. **Collect dataset**

   Use a mix of production data (collected from users' satisfaction with answers provided to their questions), hard-coded correct answers to questions created by domain experts, and historical data from logs.
1. **Define eval metrics**

   Context recall of at least 0.85, context precision of over 0.7, and 70+% positively rated answers.
1. **Run and compare evals**

   Use the [Evals API](https://developers.openai.com/api/docs/guides/evals) to create and run evals in the OpenAI dashboard.
1. **Continuously evaluate**

   Set up continuous evaluation (CE) to run evals on every change, monitor your app to identify new cases of nondeterminism, and grow the eval set over time.

When creating an eval dataset, 
  [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 
  is useful for collecting eval examples and edge cases. Consider using it to
  help you generate a diverse set of test data across various scenarios. Ensure
  your test data includes typical cases, edge cases, and adversarial cases. Use
  human expert labellers.

## Identify where you need evals

Complexity increases as you move from simple to more complex architectures. Here are four common architecture patterns:

- [Single-turn model interactions](#single-turn-model-interactions)
- [Workflows](#workflow-architectures)
- [Single-agent](#single-agent-architectures)
- [Multi-agent](#multi-agent-architectures)

Read about each architecture below to identify where nondeterminism enters your system. That's where you'll want to implement evals.

### Single-turn model interactions

In this kind of architecture, the user provides input to the model, and the model processes these inputs (along with any developer prompts provided) to generate a corresponding output.

#### Example

As an example, consider an online retail scenario. Your system prompt instructs the model to **categorize the customer's question** into one of the following:

- `order_status`
- `return_policy`
- `technical_issue`
- `cancel_order`
- `other`

To ensure a consistent, efficient user experience, the model should **only return the label that matches user intent**. Let's say the customer asks, "What's the status of my order?"

<table>
  <tr>
    <th>Nondeterminism introduced</th>
    <th>Corresponding area to evaluate</th>
    <th>Example eval questions</th>
  </tr>
  <tr>
    <td>Inputs provided by the developer and user</td>
    <td>
      **Instruction following**: Does the model accurately understand and act
      according to the provided instructions?
      

      

      **Instruction following**: Does the model prioritize the system prompt
      over a conflicting user prompt?
    </td>
    <td>
      Does the model stay focused on the triage task or get swayed by the user's
      question?
    </td>
  </tr>
  <tr>
    <td>Outputs generated by the model</td>
    <td>
      **Functional correctness**: Are the model's outputs accurate, relevant,
      and thorough enough to fulfill the intended task or objective?
    </td>
    <td>
      Does the model's determination of intent correctly match the expected
      intent?
    </td>
  </tr>
</table>

### Workflow architectures

As you look to solve more complex problems, you'll likely transition from a single-turn model interaction to a multistep workflow that chains together several model calls. Workflows don't introduce any new elements of nondeterminism, but they involve multiple underlying model interactions, which you can evaluate in isolation.

#### Example

Take the same example as before, where the customer asks about their order status. A workflow architecture triages the customer request and routes it through a step-by-step process:

1. Extracting an Order ID
1. Looking up the order details
1. Providing the order details to a model for a final response

Each step in this workflow has its own system prompt that the model must follow, putting all fetched data into a friendly output.

<table>
  <tr>
    <th>Nondeterminism introduced</th>
    <th>Corresponding area to evaluate</th>
    <th>Example eval questions</th>
  </tr>
  <tr>
    <td>Inputs provided by the developer and user</td>
    <td>
      **Instruction following**: Does the model accurately understand and act
      according to the provided instructions?
      

      

      **Instruction following**: Does the model prioritize the system prompt
      over a conflicting user prompt?
    </td>
    <td>
      Does the model stay focused on the triage task or get swayed by the user's
      question?
      

      
 Does the model follow instructions to attempt to extract an Order
      ID?
      

      

      Does the final response include the order status, estimated arrival date,
      and tracking number?
    </td>
  </tr>
  <tr>
    <td>Outputs generated by the model</td>
    <td>
      **Functional correctness**: Are the model's outputs are accurate,
      relevant, and thorough enough to fulfill the intended task or objective?
    </td>
    <td>
      Does the model's determination of intent correctly match the expected
      intent?
      

      

      Does the final response have the correct order status, estimated arrival
      date, and tracking number?
    </td>
  </tr>
</table>

### Single-agent architectures

Unlike workflows, agents solve unstructured problems that require flexible decision making. An agent has instructions and a set of tools and dynamically selects which tool to use. This introduces a new opportunity for nondeterminism.

Tools are developer defined chunks of code that the model can execute. This
  can range from small helper functions to API calls for existing services. For
  example, `check_order_status(order_id)` could be a tool, where it takes the
  argument `order_id` and calls an API to check the order status.

#### Example

Let's adapt our customer service example to use a single agent. The agent has access to three distinct tools:

- Order lookup tool
- Password reset tool
- Product FAQ tool

When the customer asks about their order status, the agent dynamically decides to either invoke a tool or respond to the customer. For example, if the customer asks, "What is my order status?" the agent can now follow up by requesting the order ID from the customer. This helps create a more natural user experience.

<table>
  <tr>
    <th>Nondeterminism</th>
    <th>Corresponding area to evaluate</th>
    <th>Example eval questions</th>
  </tr>
  <tr>
    <td>Inputs provided by the developer and user</td>
    <td>
      **Instruction following**: Does the model accurately understand and act
      according to the provided instructions?
      

      

      **Instruction following**: Does the model prioritize the system prompt
      over a conflicting user prompt?
    </td>
    <td>
      Does the model stay focused on the triage task or get swayed by the user's
      question?
      

      

      Does the model follow instructions to attempt to extract an Order ID?
    </td>
  </tr>
  <tr>
    <td>Outputs generated by the model</td>
    <td>
      **Functional correctness**: Are the model's outputs are accurate,
      relevant, and thorough enough to fulfill the intended task or objective?
    </td>
    <td>
      Does the model's determination of intent correctly match the expected
      intent?
    </td>
  </tr>
  <tr>
    <td>Tools chosen by the model</td>
    <td>
      **Tool selection**: Evaluations that test whether the agent is able to
      select the correct tool to use.
      

      

      **Data precision**: Evaluations that verify the agent calls the tool with
      the correct arguments. Typically these arguments are extracted from the
      conversation history, so the goal is to validate this extraction was
      correct.
    </td>
    <td>
      When the user asks about their order status, does the model correctly
      recommend invoking the order lookup tool?
      

      

      Does the model correctly extract the user-provided order ID to the lookup
      tool?
    </td>
  </tr>
</table>

### Multi-agent architectures

As you add tools and tasks to your single-agent architecture, the model may struggle to follow instructions or select the correct tool to call. Multi-agent architectures help by creating several distinct agents who specialize in different areas. This triaging and handoff among multiple agents introduces a new opportunity for nondeterminism.

The decision to use a multi-agent architecture should be driven by your evals.
  Starting with a multi-agent architecture adds unnecessary complexity that can
  slow down your time to production.

#### Example

Splitting the single-agent example into a multi-agent architecture, we'll have four distinct agents:

1. Triage agent
1. Order agent
1. Account management agent
1. Sales agent

When the customer asks about their order status, the triage agent may hand off the conversation to the order agent to look up the order. If the customer changes the topic to ask about a product, the order agent should hand the request back to the triage agent, who then hands off to the sales agent to fetch product information.

<table>
  <tr>
    <th>Nondeterminism</th>
    <th>Corresponding area to evaluate</th>
    <th>Example eval questions</th>
  </tr>
  <tr>
    <td>Inputs provided by the developer and user</td>
    <td>**Instruction following**: Does the model accurately understand and act according to the provided instructions?

**Instruction following**: Does the model prioritize the system prompt over a conflicting user prompt?</td>
    <td>Does the model stay focused on the triage task or get swayed by the user's question?

Assuming the `lookup_order` call returned, does the order agent return a tracking number and delivery date (doesn't have to be the correct one)?</td>
  </tr>
  <tr>
    <td>Outputs generated by the model</td>
    <td>**Functional correctness**: Are the model's outputs are accurate, relevant, and thorough enough to fulfill the intended task or objective?</td>
    <td>Does the model's determination of intent correctly match the expected intent?

Assuming the `lookup_order` call returned, does the order agent provide the correct tracking number and delivery date in its response?

Does the order agent follow system instructions to ask the customer their reason for requesting a return before processing the return?</td>
  </tr>
  <tr>
    <td>Tools chosen by the model</td>
    <td>**Tool selection**: Evaluations that test whether the agent is able to select the correct tool to use.

**Data precision**: Evaluations that verify the agent calls the tool with the correct arguments. Typically these arguments are extracted from the conversation history, so the goal is to validate this extraction was correct.</td>
    <td>Does the order agent correctly call the lookup order tool?

Does the order agent correctly call the `refund_order` tool?

Does the order agent call the lookup order tool with the correct order ID?

Does the account agent correctly call the `reset_password` tool with the correct account ID?</td>
  </tr>

  <tr>
    <td>Agent handoff</td>
    <td>**Agent handoff accuracy**: Evaluations that test whether each agent can appropriately recognize the decision boundary for triaging to another agent</td>
    <td>When a user asks about order status, does the triage agent correctly pass to the order agent?

When the user changes the subject to talk about the latest product, does the order agent hand back control to the triage agent?</td>
  </tr>
</table>

## Create and combine different types of evaluators

As you design your own evals, there are several specific evaluator types to choose from. Another way to think about this is what role you want the evaluator to play.

### Metric-based evals

Quantitative evals provide a numerical score you can use to filter and rank results. They provide useful benchmarks for automated regression testing.

- **Examples**: Exact match, string match, ROUGE/BLEU scoring, function call accuracy, executable evals (executed to assess functionality or behavior—e.g., text2sql)
- **Challenges**: May not be tailored to specific use cases, may miss nuance

### Human evals

Human judgment evals provide the highest quality but are slow and expensive.

- **Examples**: Skim over system outputs to get a sense of whether they look better or worse; create a randomized, blinded test in which employees, contractors, or outsourced labeling agencies judge the quality of system outputs (e.g., ranking a small set of possible outputs, or giving each a grade of 1-5)
- **Challenges**: Disagreement among human experts, expensive, slow
- **Recommendations**:
  - Conduct multiple rounds of detailed human review to refine the scorecard
  - Implement a "show rather than tell" policy by providing examples of different score levels (e.g., 1, 3, and 8 out of 10)
  - Include a pass/fail threshold in addition to the numerical score
  - A simple way to aggregate multiple reviewers is to take consensus votes

### LLM-as-a-judge and model graders

Using models to judge output is cheaper to run and more scalable than human evaluation. Start with [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) when you need a strong LLM judge, then validate agreement against your human labels before optimizing for cost or latency.

- **Examples**:
  - Pairwise comparison: Present the judge model with two responses and ask it to determine which one is better based on specific criteria
  - Single answer grading: The judge model evaluates a single response in isolation, assigning a score or rating based on predefined quality metrics
  - Reference-guided grading: Provide the judge model with a reference or "gold standard" answer, which it uses as a benchmark to evaluate the given response
- **Challenges**: Position bias (response order), verbosity bias (preferring longer responses)
- **Recommendations**:
  - Use pairwise comparison or pass/fail for more reliability
  - Use the most capable model to grade if you can. Start with [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol), then validate whether a specialized reasoning model performs better for your rubric or reference-answer set
  - Control for response lengths as LLMs bias towards longer responses in general
  - Add reasoning and chain-of-thought as reasoning before scoring improves eval performance
  - Once the LLM judge reaches a point where it's faster, cheaper, and consistently agrees with human annotations, scale up
  - Structure questions to allow for automated grading while maintaining the integrity of the task—a common approach is to reformat questions into multiple choice formats
  - Ensure eval rubrics are clear and detailed

No strategy is perfect. The quality of LLM-as-Judge varies depending on problem context while using expert human annotators to provide ground-truth labels is expensive and time-consuming.

## Handle edge cases

While your evaluations should cover primary, happy-path scenarios for each architecture, real-world AI systems frequently encounter edge cases that challenge system performance. Evaluating these edge cases is important for ensuring reliability and a good user experience.

We see these edge cases fall into a few buckets:

### Input variability

Because users provide input to the model, our system must be flexible to handle the different ways our users may interact, like:

- Non-English or multilingual inputs
- Formats other than input text (e.g., XML, JSON, Markdown, CSV)
- Input modalities (e.g., images)

Your evals for instruction following and functional correctness need to accommodate inputs that users might try.

### Contextual complexity

Many LLM-based applications fail due to poor understanding of the context of the request. This context could be from the user or noise in the past conversation history.

Examples include:

- Multiple questions or intents in a single request
- Typos and misspellings
- Short requests with minimal context (e.g., if a user just says: "returns")
- Long context or long-running conversations
- Tool calls that return data with ambiguous property names (e.g., `"on: 123"`, where "on" is the order number)
- Multiple tool calls, sometimes leading to incorrect arguments
- Multiple agent handoffs, sometimes leading to circular handoffs

### Personalization and customization

While AI improves UX by adapting to user-specific requests, this flexibility introduces many edge cases. Clearly define evals for use cases you want to specifically support and block:

- Jailbreak attempts to get the model to do something different
- Formatting requests (e.g., format as JSON, or use bullet points)
- Cases where user prompts conflict with your system prompts

## Use evals to improve performance

When your evals reach a level of maturity that consistently measures performance, shift to using your evals data to improve your application's performance.

Learn more about [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning) to create a data flywheel.

## Other resources

For more inspiration, visit the [OpenAI Cookbook](https://developers.openai.com/cookbook), which contains example code and links to third-party resources, or learn more about our tools for evals:

- [Evaluating model performance](https://developers.openai.com/api/docs/guides/evals)
- [How to evaluate a summarization task](https://developers.openai.com/cookbook/examples/evaluation/how_to_eval_abstractive_summarization)
- [Fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization)
- [Graders](https://developers.openai.com/api/docs/guides/graders)
- [Evals API reference](https://developers.openai.com/api/reference/resources/evals)