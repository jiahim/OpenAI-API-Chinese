# SDK 与 CLI

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

本页介绍使用以下方式构建的主要方法 [OpenAI API](https://developers.openai.com/api/reference/overview): 用于应用代码的官方 SDK,用于 Shell 原生工作流的 OpenAI CLI,用于编排的 Agents SDK,或你惯用的任意 HTTP 客户端。

## 创建并导出 API 密钥

在开始之前， [在仪表板中创建一个 API 密钥](https://platform.openai.com/api-keys)，你可以使用该密钥安全地 [访问 API](https://developers.openai.com/api/reference/overview)。请将该密钥保存在安全的位置，例如电脑上的一个 [`.zshrc` 文件](https://www.freecodecamp.org/news/how-do-zsh-configuration-files-work/) 或其他文本文件。生成 API 密钥后，请在终端中将其导出为 [环境变量](https://en.wikipedia.org/wiki/Environment_variable) ：



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



OpenAI SDK 已配置为自动从系统环境中读取你的 API 密钥。

## 安装官方 SDK



JavaScript

    

要在 Node.js、Deno 或 Bun 等服务端 JavaScript 环境中使用 OpenAI API，你可以使用官方的 [OpenAI SDK for TypeScript and JavaScript](https://github.com/openai/openai-node)。首先使用 [npm](https://www.npmjs.com/) 或你常用的包管理器安装 SDK：

使用 npm 安装 OpenAI SDK

```bash
npm install openai
```


安装好 OpenAI SDK 后，创建一个文件 `example.mjs` 并将示例代码复制到其中：

测试一个基础的 API 请求

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```


使用 `node example.mjs` （或 Deno、Bun 中对应的命令）执行代码。稍等片刻，你就能看到 API 请求的输出。

[在 GitHub 上了解更多信息



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-node)


  

  

    
Python

    

要在 Python 中使用 OpenAI API，你可以使用官方的 [OpenAI SDK for Python](https://github.com/openai/openai-python)。首先使用 [pip](https://pypi.org/project/pip/):

使用 pip 安装 OpenAI SDK

```bash
pip install openai
```


安装好 OpenAI SDK 后，创建一个文件 `example.py` 并将示例代码复制到其中：

测试一个基础的 API 请求

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="Write a one-sentence bedtime story about a unicorn.",
)

print(response.output_text)
```


使用 `python example.py`。稍等片刻，你就能看到 API 请求的输出。

[在 GitHub 上了解更多信息



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-python)


  

  

    
.NET

    

与 Microsoft 合作，OpenAI 提供官方支持的 C# API 客户端。你可以通过 .NET CLI 从 [NuGet](https://www.nuget.org/).

```
dotnet add package OpenAI
```

一个针对 API 的简单请求 [Responses API](https://developers.openai.com/api/reference/resources/responses) 看起来像这样:

测试一个基础的 API 请求

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    "Say 'this is a test.'"
);

Console.WriteLine($"[ASSISTANT]: {response.GetOutputText()}");
```


  

  

    
Java

    

OpenAI 为 Java 编程语言提供了一个 API 助手库，当前处于 beta 阶段。你可以使用以下配置加入 Maven 依赖:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.67.0</version>
</dependency>
```


一个针对 API 的简单请求 [Responses API](https://developers.openai.com/api/reference/resources/responses) 看起来像这样:

测试一个基础的 API 请求

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class Main {
  public static void main(String[] args) {
    OpenAIClient client = OpenAIOkHttpClient.fromEnv();

    ResponseCreateParams params =
        ResponseCreateParams.builder().input("Say this is a test").model("gpt-6-astra").build();

    Response response = client.responses().create(params);
    response.output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```


要了解更多在 Java 中使用 OpenAI API 的信息，请查看下方链接的 GitHub 仓库!

[在 GitHub 上了解更多信息



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-java)


  

  

    
Go

    

OpenAI 为 Go 编程语言提供了一个 API 助手库，当前处于 beta 阶段。你可以使用以下代码导入该库:

```go
import (
	"github.com/openai/openai-go/v3" // imported as openai
)
```


对 API 的第一个请求 [Responses API](https://developers.openai.com/api/reference/resources/responses) 看起来像这样:

测试一个基础的 API 请求

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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say this is a test")},
	})
	if err != nil {
		panic(err.Error())
	}

	fmt.Println(resp.OutputText())
}
```


要了解更多在 Go 中使用 OpenAI API 的信息，请查看下方链接的 GitHub 仓库!

[在 GitHub 上了解更多信息



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-go)


  

  

    
Ruby

    

要在 Ruby 中使用 OpenAI API，你可以使用官方的 [OpenAI Ruby SDK](https://github.com/openai/openai-ruby)。首先将 gem 添加到你的应用中:

使用 Bundler 安装 OpenAI SDK

```ruby
gem "openai"
```


安装好 OpenAI SDK 后，创建一个文件 `example.rb` 并将示例代码复制到其中：

测试一个基础的 API 请求

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-6-astra",
  input: "Write a one-sentence bedtime story about a unicorn."
)

puts(response.output_text)
```


使用 `ruby example.rb`。稍等片刻，你就能看到 API 请求的输出。

[在 GitHub 上了解更多信息



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-ruby)


  

  

    
CLI

    

要从终端直接调用 OpenAI API，请安装自动生成的 `openai` 命令行工具：

使用 Homebrew 安装 OpenAI CLI

```bash
brew install openai/tools/openai
```


然后在 shell 中运行一个基本的 API 请求：

测试一个基础的 API 请求

```bash
openai responses create \
  --model "gpt-6-astra" \
  --input "Write a one-sentence bedtime story about a unicorn." \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text'
```


使用 CLI 执行可重复的终端工作流，例如从文件中提取结构化数据、生成图像、创建语音，以及使用以下 shell 工具组合 API 调用 `jq`.

[OpenAI CLI 指南



      Learn more about CLI workflows and command patterns.](https://developers.openai.com/api/docs/libraries/openai-cli)



## 使用 Agents SDK

使用官方的 OpenAI SDK 直接发起 API 请求。使用 Agents SDK
进行代码优先编排，包括 智能体、工具、
交接、护栏、追踪 或沙箱执行时，请使用 智能体开发工具包。

如果你需要在直接 API 请求和代码优先编排之间做出选择，
请参阅 [Responses API 与 Agents SDK 的对比](https://developers.openai.com/api/docs/guides/agents#agents-sdk-vs-responses-api).

[Agents SDK 快速入门



      Build your first agent with the Agents SDK.](https://developers.openai.com/api/docs/guides/agents/quickstart)

- [OpenAI Agents SDK for TypeScript](https://github.com/openai/openai-agents-js)
- [OpenAI Agents SDK for Python](https://github.com/openai/openai-agents-python)

## Azure OpenAI 库

Microsoft 的 Azure 团队维护着同时兼容 OpenAI API 和 Azure OpenAI 服务的库。阅读以下库文档，了解如何与 OpenAI API 一起使用这些库。

- [Azure OpenAI 适用于 .NET 的客户端库](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI)
- [Azure OpenAI 适用于 JavaScript 的客户端库](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
- [Azure OpenAI 适用于 Java 的客户端库](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai)
- [Azure OpenAI 适用于 Go 的客户端库](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai)

---

## 社区库

下方列出的库由更广泛的开发者社区构建和维护。你还可以 [关注我们在 GitHub 上的 OpenAPI 规范仓库](https://github.com/openai/openai-openapi) ，以便及时了解我们对 API 所做的更改。

请注意，OpenAI 不会验证这些项目的正确性或安全性。 **使用它们需自行承担风险！**

### Clojure

- [openai-clojure](https://github.com/wkok/openai-clojure) 由 [wkok](https://github.com/wkok)

### Dart/Flutter

- [openai](https://github.com/anasfik/openai) 由 [anasfik](https://github.com/anasfik)

### Delphi

- [DelphiOpenAI](https://github.com/HemulGM/DelphiOpenAI) 由 [HemulGM](https://github.com/HemulGM)

### Elixir

- [openai.ex](https://github.com/mgallo/openai.ex) 由 [mgallo](https://github.com/mgallo)

### Kotlin

- [openai-kotlin](https://github.com/Aallam/openai-kotlin) 由 [Mouaad Aallam](https://github.com/Aallam)

### PHP

- [orhanerday/open-ai](https://packagist.org/packages/orhanerday/open-ai) 由 [orhanerday](https://github.com/orhanerday)
- [openai-php client](https://github.com/openai-php/client) 由 [openai-php](https://github.com/openai-php)

### Rust

- [async-openai](https://github.com/64bit/async-openai) 由 [64bit](https://github.com/64bit)

### Scala

- [openai-scala-client](https://github.com/cequence-io/openai-scala-client) 由 [cequence-io](https://github.com/cequence-io)

### Swift

- [AIProxySwift](https://github.com/lzell/AIProxySwift) 由 [Lou Zell](https://github.com/lzell)
- [OpenAIKit](https://github.com/dylanshine/openai-kit) 由 [dylanshine](https://github.com/dylanshine)
- [OpenAI](https://github.com/MacPaw/OpenAI/) 由 [MacPaw](https://github.com/MacPaw)

### Unity

- [com.openai.unity](https://github.com/RageAgainstThePixel/com.openai.unity) 由 [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### Unreal Engine

- [OpenAI-Api-Unreal](https://github.com/KellanM/OpenAI-Api-Unreal) 由 [KellanM](https://github.com/KellanM)

## 其他 OpenAI 代码仓库

- [tiktoken](https://github.com/openai/tiktoken) - 计算 token 数
- [simple-evals](https://github.com/openai/simple-evals) - 简单评估库
- [mle-bench](https://github.com/openai/mle-bench) - 用于评估机器学习工程师智能体的库
- [gym](https://github.com/openai/gym) - 强化学习库
- [swarm](https://github.com/openai/swarm) - 用于教学场景的编排仓库