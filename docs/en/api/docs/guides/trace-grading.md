# Trace grading

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Trace grading is the process of assigning structured scores or labels to an agent's trace—the end-to-end log of decisions, tool calls, and reasoning steps—to assess correctness, quality, or adherence to expectations. These annotations help identify where the agent did well or made mistakes, enabling targeted improvements in orchestration or behavior.

Trace evals use those graded traces to systematically evaluate agent performance across many examples, helping to benchmark changes, identify regressions, or validate improvements. Unlike black-box evaluations, trace evals provide more data to better understand why an agent succeeds or fails.

Use both features to track, analyze, and optimize the performance of groups of agents.

## Get started with traces

1. In the dashboard, navigate to Logs > [Traces](https://platform.openai.com/logs?api=traces).
1. Select a workflow. You'll see traces from SDK-based apps, and from existing [Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder) workflows during the transition window.
1. Select a trace to inspect your workflow.
1. Create a grader, and run it to grade your agents' performance against grader criteria.

Trace grading is a valuable tool for error identification at scale, which is critical for building resilience into your AI applications. Learn more about our recommended process in our [cookbook](https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel).

## Evaluate traces with runs

1. Select **Grade all**. This takes you to the evaluation dashboard.
1. In the evaluation dashboard, add and edit test criteria.
1. Add a run to evaluate outputs. You can configure run options like model, date range, and tool calls to get more specificity in your eval.

Learn more about how you can use evals [here](https://developers.openai.com/api/docs/guides/evals).