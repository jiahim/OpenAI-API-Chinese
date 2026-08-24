# SDKs and CLI

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

This page covers the main ways to build with the [OpenAI API](https://developers.openai.com/api/reference/overview): official SDKs for application code, the OpenAI CLI for shell-native workflows, the Agents SDK for orchestration, or your own preferred HTTP client.

## Create and export an API key

Before you begin, [create an API key in the dashboard](https://platform.openai.com/api-keys), which you'll use to securely [access the API](https://developers.openai.com/api/reference/overview). Store the key in a safe location, like a [`.zshrc` file](https://www.freecodecamp.org/news/how-do-zsh-configuration-files-work/) or another text file on your computer. Once you've generated an API key, export it as an [environment variable](https://en.wikipedia.org/wiki/Environment_variable) in your terminal.



macOS / Linux

    Export an environment variable on macOS or Linux systems

```bash
export OPENAI_API_KEY="your_api_key_here"
```

  

  

    
Windows

    Export an environment variable in PowerShell

```bash
setx OPENAI_API_KEY "your_api_key_here"
```



OpenAI SDKs are configured to automatically read your API key from the system environment.

## Install an official SDK



JavaScript

    

To use the OpenAI API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the official [OpenAI SDK for TypeScript and JavaScript](https://github.com/openai/openai-node). Get started by installing the SDK using [npm](https://www.npmjs.com/) or your preferred package manager:

Install the OpenAI SDK with npm

```bash
npm install openai
```


With the OpenAI SDK installed, create a file called `example.mjs` and copy the example code into it:

Test a basic API request

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```


Execute the code with `node example.mjs` (or the equivalent command for Deno or Bun). In a few moments, you should see the output of your API request.

[Learn more on GitHub



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-node)


  

  

    
Python

    

To use the OpenAI API in Python, you can use the official [OpenAI SDK for Python](https://github.com/openai/openai-python). Get started by installing the SDK using [pip](https://pypi.org/project/pip/):

Install the OpenAI SDK with pip

```bash
pip install openai
```


With the OpenAI SDK installed, create a file called `example.py` and copy the example code into it:

Test a basic API request

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Write a one-sentence bedtime story about a unicorn.",
)

print(response.output_text)
```


Execute the code with `python example.py`. In a few moments, you should see the output of your API request.

[Learn more on GitHub



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-python)


  

  

    
.NET

    

In collaboration with Microsoft, OpenAI provides an officially supported API client for C#. You can install it with the .NET CLI from [NuGet](https://www.nuget.org/).

```
dotnet add package OpenAI
```

A simple API request to the [Responses API](https://developers.openai.com/api/reference/resources/responses) would look like this:

Test a basic API request

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-5.6",
    "Say 'this is a test.'"
);

Console.WriteLine($"[ASSISTANT]: {response.GetOutputText()}");
```


  

  

    
Java

    

OpenAI provides an API helper for the Java programming language, currently in beta. You can include the Maven dependency using the following configuration:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.51.0</version>
</dependency>
```


A simple API request to [Responses API](https://developers.openai.com/api/reference/resources/responses) would look like this:

Test a basic API request

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class Main {
  public static void main(String[] args) {
    OpenAIClient client = OpenAIOkHttpClient.fromEnv();

    ResponseCreateParams params =
        ResponseCreateParams.builder().input("Say this is a test").model("gpt-5.6").build();

    Response response = client.responses().create(params);
    response.output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```


To learn more about using the OpenAI API in Java, check out the GitHub repo linked below!

[Learn more on GitHub



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-java)


  

  

    
Go

    

OpenAI provides an API helper for the Go programming language, currently in beta. You can import the library using the code below:

```go
import (
	"github.com/openai/openai-go/v3" // imported as openai
)
```


A first API request to the [Responses API](https://developers.openai.com/api/reference/resources/responses) would look like this:

Test a basic API request

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	resp, err := client.Responses.New(context.TODO(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say this is a test")},
	})
	if err != nil {
		panic(err.Error())
	}

	fmt.Println(resp.OutputText())
}
```


To learn more about using the OpenAI API in Go, check out the GitHub repo linked below!

[Learn more on GitHub



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-go)


  

  

    
Ruby

    

To use the OpenAI API in Ruby, you can use the official [OpenAI SDK for Ruby](https://github.com/openai/openai-ruby). Get started by adding the gem to your application:

Install the OpenAI SDK with Bundler

```ruby
gem "openai"
```


With the OpenAI SDK installed, create a file called `example.rb` and copy the example code into it:

Test a basic API request

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  input: "Write a one-sentence bedtime story about a unicorn."
)

puts(response.output_text)
```


Execute the code with `ruby example.rb`. In a few moments, you should see the output of your API request.

[Learn more on GitHub



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-ruby)


  

  

    
CLI

    

To call the OpenAI API directly from your terminal, install the generated `openai` command-line tool:

Install the OpenAI CLI with Homebrew

```bash
brew install openai/tools/openai
```


Then run a basic API request from your shell:

Test a basic API request

```bash
openai responses create \
  --model "gpt-5.6" \
  --input "Write a one-sentence bedtime story about a unicorn." \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text'
```


Use the CLI for repeatable terminal workflows such as extracting structured data from files, generating images, creating speech, and composing API calls with shell tools like `jq`.

[OpenAI CLI guide



      Learn more about CLI workflows and command patterns.](https://developers.openai.com/api/docs/libraries/openai-cli)



## Use the Agents SDK

Use the official OpenAI SDKs above for direct API requests. Use the Agents SDK
when your application needs code-first orchestration for agents, tools,
handoffs, guardrails, tracing, or sandbox execution.

If you are deciding between direct API requests and code-first orchestration,
see [how the Responses API compares with the Agents SDK](https://developers.openai.com/api/docs/guides/agents#agents-sdk-vs-responses-api).

[Agents SDK quickstart



      Build your first agent with the Agents SDK.](https://developers.openai.com/api/docs/guides/agents/quickstart)

- [OpenAI Agents SDK for TypeScript](https://github.com/openai/openai-agents-js)
- [OpenAI Agents SDK for Python](https://github.com/openai/openai-agents-python)

## Azure OpenAI libraries

Microsoft's Azure team maintains libraries that are compatible with both the OpenAI API and Azure OpenAI services. Read the library documentation below to learn how you can use them with the OpenAI API.

- [Azure OpenAI client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI)
- [Azure OpenAI client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
- [Azure OpenAI client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai)
- [Azure OpenAI client library for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai)

---

## Community libraries

The libraries below are built and maintained by the broader developer community. You can also [watch our OpenAPI specification](https://github.com/openai/openai-openapi) repository on GitHub to get timely updates on when we make changes to our API.

Please note that OpenAI does not verify the correctness or security of these projects. **Use them at your own risk!**

### Clojure

- [openai-clojure](https://github.com/wkok/openai-clojure) by [wkok](https://github.com/wkok)

### Dart/Flutter

- [openai](https://github.com/anasfik/openai) by [anasfik](https://github.com/anasfik)

### Delphi

- [DelphiOpenAI](https://github.com/HemulGM/DelphiOpenAI) by [HemulGM](https://github.com/HemulGM)

### Elixir

- [openai.ex](https://github.com/mgallo/openai.ex) by [mgallo](https://github.com/mgallo)

### Kotlin

- [openai-kotlin](https://github.com/Aallam/openai-kotlin) by [Mouaad Aallam](https://github.com/Aallam)

### PHP

- [orhanerday/open-ai](https://packagist.org/packages/orhanerday/open-ai) by [orhanerday](https://github.com/orhanerday)
- [openai-php client](https://github.com/openai-php/client) by [openai-php](https://github.com/openai-php)

### Rust

- [async-openai](https://github.com/64bit/async-openai) by [64bit](https://github.com/64bit)

### Scala

- [openai-scala-client](https://github.com/cequence-io/openai-scala-client) by [cequence-io](https://github.com/cequence-io)

### Swift

- [AIProxySwift](https://github.com/lzell/AIProxySwift) by [Lou Zell](https://github.com/lzell)
- [OpenAIKit](https://github.com/dylanshine/openai-kit) by [dylanshine](https://github.com/dylanshine)
- [OpenAI](https://github.com/MacPaw/OpenAI/) by [MacPaw](https://github.com/MacPaw)

### Unity

- [com.openai.unity](https://github.com/RageAgainstThePixel/com.openai.unity) by [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### Unreal Engine

- [OpenAI-Api-Unreal](https://github.com/KellanM/OpenAI-Api-Unreal) by [KellanM](https://github.com/KellanM)

## Other OpenAI repositories

- [tiktoken](https://github.com/openai/tiktoken) - counting tokens
- [simple-evals](https://github.com/openai/simple-evals) - simple evaluation library
- [mle-bench](https://github.com/openai/mle-bench) - library to evaluate machine learning engineer agents
- [gym](https://github.com/openai/gym) - reinforcement learning library
- [swarm](https://github.com/openai/swarm) - educational orchestration repository