# Getting started with datasets

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Evaluations (often called **evals**) test model outputs to ensure they meet your specified style and content criteria. Writing evals is an essential part of building reliable applications. [Datasets](https://platform.openai.com/evaluation/datasets), a feature of the OpenAI platform, provide a quick way to get started with evals and test prompts.

OpenAI is deprecating the Evals platform. Existing evals content remains
  available during the transition window. Evals will become read-only for
  existing users on October 31, 2026, and the platform is scheduled to shut down
  on November 30, 2026. See the [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) for the current
  timeline.

If you need advanced features such as evaluation against external models, want
  to interact with your eval runs via API, or want to run evaluations on a
  larger scale, consider using [Evals](https://developers.openai.com/api/docs/guides/evals) instead.

## Create a dataset

First, create a dataset in the dashboard.

1. On the [evaluation page](https://platform.openai.com/evaluation), navigate to the **Datasets** tab.
1. Click the **Create** button in the top right to get started.
1. Add a name for your dataset in the input field. In this guide, we'll name our dataset “Investment memo generation."
1. Add data. To build your dataset from scratch, click **Create** and start adding data through our visual interface. If you already have a saved prompt or a CSV with data, upload it.

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/dataset-creation.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

We recommend using your dataset as a dynamic space, expanding your set of evaluation data over time. As you identify edge cases or blind spots that need monitoring, add them using the dashboard interface.

### Uploading a CSV

We have a simple CSV containing company names and actual values for their revenue from past quarters.

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/csv-upload.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

The columns in your CSV are accessible to both your prompt and graders. For example, our CSV contains input columns (`company`) and ground truth columns (`correct_revenue`, `correct_income`) for our graders to use as reference.

### Using the visual data interface

After opening your dataset, you can manipulate your data in the **Data** tab. Click a cell to edit its contents. Add a row to add more data. You can also delete or duplicate rows in the overflow menu at the right edge of each row.

To save your changes, click **Save** button in the top right.

## Build a prompt

The tabs in the datasets dashboard let multiple prompts interact with the same data.

1. To add a new prompt, click **Add prompt**.

   Datasets are designed to be used with your OpenAI [prompts](https://developers.openai.com/api/docs/guides/prompt-engineering#version-prompts-in-code). If you’ve saved a prompt on the OpenAI platform, you’ll be able to select it from the dropdown and make changes in this interface. To save your prompt changes, click **Save**.

   Our prompts use a versioning system so you can safely make updates.
     Clicking **Save** creates a new version of your prompt, which you can refer
     to or use anywhere in the OpenAI platform.

1. In the prompt panel, use the provided fields and settings to control the inference call:

- Click the slider icon in the top right to control model [`temperature`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-temperature) and [`top_p`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-top_p).
- Add tools to grant your inference call the ability to access the web, use an MCP, or complete other tool-call actions.
- Add variables. The prompt and your [graders](#add-graders) can both refer to these variables.
- Type your system message directly, or click the pencil icon to have a model help generate a prompt for you, based on basic instructions you provide.

In our example, we'll add the [web search](https://developers.openai.com/api/docs/guides/tools-web-search) tool so our model call can pull financial data from the internet. In our variables list, we'll add `company` so our prompt can reference the company column in our dataset. And for the prompt, we’ll generate one by telling the model to “generate a financial report."

## Generate and annotate outputs

With your data and prompt set up, you’re ready to generate outputs. The model's output gives you a sense of how the model performs your task with the prompt and tools you provided. You'll then annotate the outputs so the model can improve its performance over time.

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/generate-outputs-and-annotate.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. In the top right, click **Generate output**.

   You’ll see a new special **output** column in the dataset begin to populate with results. This column contains the results from running your prompt on each row in your dataset.

1. Once your generated outputs are ready, annotate them. Open the annotation view by clicking the **output**, **rating**, or **output_feedback** column.

   Annotate as little or as much as you want. Datasets are designed to work with any degree and type of annotation, but the higher quality of information you can provide, the better your results will be.

### What annotation does

Annotations are a key part of evaluating and improving model output. A good annotation:

- Serves as ground truth for desired model behavior, even for highly specific cases—including subjective elements, like style and tone
- Provides information-dense context enabling automatic prompt improvement (via our prompt optimizer)
- Enables diagnosing prompt shortcomings, particularly in subtle or infrequent cases
- Helps ensure that graders are aligned with your intent

You can choose to annotate as little or as much as you want. Datasets are designed to work with any degree and type of annotation, but the higher quality of information you can provide, the better your results will be. Additionally, if you’re not an expert on the contents of your dataset, we recommend that a subject matter expert performs the annotation — this is the most valuable way for their expertise to be incorporated into your optimization process. Explore [our cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) to learn more about what we have found to be most effective in using evals to improve our prompt resilience.

### Annotation starting points

Here are a few types of annotations you can use to get started:

- A Good/Bad rating, indicating your judgment of the output
- A text critique in the **output_feedback** section
- Custom annotation categories that you added in the **Columns** dropdown in the top right

### Incorporate expert annotations

If you’re not an expert on the contents of your dataset, have a subject matter expert perform the annotation. This is the best way to incorporate expertise into the optimization process. Explore [our cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel) to learn more.

## Add graders

While annotations are the most effective way to incorporate human feedback into your evaluation process, graders let you run evaluations at scale. Graders are automated assessments that can produce a variety of inputs depending on their type.

| **Type**                  | **Details**                                                                       | **Use case**                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **String check**          | Compares model output to the reference using exact string matching                | Check whether your response exactly matches a ground truth column                                  |
| **Text similarity**       | Uses embeddings to compute semantic similarity between model output and reference | Check how close your response is to your ground truth reference, when exact matching is not needed |
| **Score model grader**    | Uses an LLM to assign a numeric score                                             | Measure subjective properties such as friendliness on a numeric scale                              |
| **Label model grader**    | Uses an LLM to select a categorical label                                         | Categorize your response based on fix labels, such as "concise" or "verbose"                       |
| **Python code execution** | Runs custom Python code to compute a result programmatically                      | Check whether the output contains fewer than 50 words                                              |

<video
  src="https://openaiassets.blob.core.windows.net/$web/platform-docs/evals/graders.mp4"
  controls
  style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
>
  Your browser does not support the video tag.
</video>

1. In the top right, navigate to Grade > **New grader**.
1. From the dropdown, choose your grader type, and fill out the form to compose your grader.
1. Reference the columns from your dataset to check against ground truth values.
1. Create the grader.
1. Once you’ve added at least one grader, use the **Grade** dropdown menu to run specific graders or all graders on your dataset. When a run is complete, you’ll see pass/fail ratings in your dataset in a dedicated column for each grader.

After saving your dataset, graders persist as you make changes to your dataset and prompt, making them a great way to quickly assess whether a prompt or model parameter change leads to improvements, or whether adding edge cases reveals shortcomings in your prompt. The datasets dashboard supports multiple tabs for simultaneously tracking results from automated graders across multiple variants of a prompt.

Learn more about our [graders](https://developers.openai.com/api/docs/guides/graders).

## Next steps

Datasets are great for rapid iteration. When you're ready to track performance over time or run at scale, export your dataset to an [Eval](https://developers.openai.com/api/docs/guides/evals). Evals run asynchronously, support larger data volumes, and let you monitor performance across versions.

For more inspiration, visit the [OpenAI Cookbook](https://developers.openai.com/cookbook/topic/evals), which contains example code and links to third-party resources, or learn more about our evaluation tools:

[Cookbook: Building resilient prompts with evals



      Operate a flywheel of continuous improvement using evaluations.](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel)

[Working with evals



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)

[Prompt optimizer



      Use your dataset to automatically improve your prompts.](https://developers.openai.com/api/docs/guides/prompt-optimizer)

[Graders



      Build sophisticated graders to improve the effectiveness of your evals.](https://developers.openai.com/api/docs/guides/graders)