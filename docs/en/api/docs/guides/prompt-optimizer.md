# Prompt optimizer

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The [prompt optimizer](https://platform.openai.com/chat/edit?optimize=true) is a chat interface in the dashboard, where you enter a prompt, and we optimize it according to current best practices before returning it to you. Pairing the prompt optimizer with [datasets](https://developers.openai.com/api/docs/guides/evaluation-getting-started) is a powerful way to automatically improve prompts.

OpenAI is deprecating the dataset-backed prompt optimizer as part of the Evals
  platform. Evals will become read-only for existing users on October 31, 2026,
  and the platform is scheduled to shut down on November 30, 2026. See the
  [deprecations page](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) for the
  current timeline.

## Prepare your data

1. Set up a [dataset](https://developers.openai.com/api/docs/guides/evaluation-getting-started) containing the prompt you want to optimize and an evaluation dataset.
1. Create at least three rows of data with responses in your dataset.
1. For each row, create at least one grader result or human annotation.

The prompt optimizer can use the following from your dataset to improve your prompt:

- Annotations (Good/Bad and additional custom annotation columns you add)
- Text critiques written in **output_feedback**
- Results from graders

For effective results, add annotations containing a Good/Bad rating _and_ detailed, specific critiques. Create [graders](https://developers.openai.com/api/docs/guides/evaluation-getting-started#add-graders) that precisely capture the properties that you desire from your prompt.

## Optimize your prompt

Once you’ve prepared your dataset, create an optimization.

1. In the bottom of the prompt pane, click **Optimize**. This will create a new tab for the optimized result and start an optimization process that runs in the background.
1. When the optimized prompt is ready, view and test the new prompt.
1. Repeat. While a single optimization run may achieve your desired result, experiment with repeating the optimization process on the new prompt—generate outputs, annotate outputs, run graders, and optimize.

The effectiveness of prompt optimization depends on the quality of your
  graders. We recommend building narrowly-defined graders for each of the
  desired output properties where you see your prompt failing.

Always evaluate and manually review optimized prompts before using them in production. While the prompt optimizer generally provides a strict improvement in your prompt’s effectiveness, it's possible for the optimized prompt to perform worse than your original on specific inputs.

## Next steps

For more inspiration, visit the [OpenAI Cookbook](https://developers.openai.com/cookbook), which contains example code and links to third-party resources, or learn more about our tools for evals:

[Cookbook: Building resilient prompts with evals



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[Working with evals



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[Graders



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)

[Fine-tuning



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)