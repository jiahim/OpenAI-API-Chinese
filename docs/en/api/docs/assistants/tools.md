# Assistants API tools

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).

## Overview

Assistants created using the Assistants API can be equipped with tools that allow them to perform more complex tasks or interact with your application.
We provide built-in tools for assistants, but you can also define your own tools to extend their capabilities using Function Calling.

The Assistants API currently supports the following tools:



File Search



      Built-in RAG tool to process and search through files




Code Interpreter



      Write and run python code, process files and diverse data




Function Calling



      Use your own custom functions to interact with your application



## Next steps

- See the API reference to [submit tool outputs](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/submit_tool_outputs)
- Build a tool-using assistant with our [Quickstart app](https://github.com/openai/openai-assistants-quickstart)