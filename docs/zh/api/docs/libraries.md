# SDK和 CLI

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

本页介绍使用以下主要方式进行构建： [OpenAI API](https://developers.openai.com/api/reference/overview)：官方 SDK 用于应用代码，OpenAI CLI 用于 Shell 原生的工作流，Agents SDK 用于编排，或使用你自行偏好的 HTTP 客户端。

## 创建并导出API密钥

在开始之前， [请在仪表盘中创建一个 API 密钥](https://platform.openai.com/api-keys)，你将使用它来安全地 [访问 API](https://developers.openai.com/api/reference/overview)。将密钥存储在安全的位置，例如 [`.zshrc` 文件](https://www.freecodecamp.org/news/how-do-zsh-configuration-files-work/) 或计算机上的其他文本文件。生成 API 密钥后，请将其导出为 [环境变量](https://en.wikipedia.org/wiki/Environment_variable) 在你的终端中。



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



OpenAI SDK 配置为自动从系统环境中读取你的 API 密钥。

## 安装官方 SDK



JavaScript

    

要在 Node.js、Deno 或 Bun 等服务端 JavaScript 环境中使用 OpenAI API，你可以使用官方的 [适用于 TypeScript 和 JavaScript 的 OpenAI SDK](https://github.com/openai/openai-node)。首先使用以下命令安装 SDK： [npm](https://www.npmjs.com/) 或你喜欢的包管理器：

使用 npm 安装 OpenAI SDK

```bash
npm install openai
```


安装 OpenAI SDK 后，创建一个名为 `example.mjs` 的文件，并将示例代码复制到其中：

测试一个基本的 API 请求

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```


使用以下命令执行代码： `node example.mjs` （或 Deno 或 Bun 的等效命令）。片刻之后，你应该会看到 API 请求的输出。

[在 GitHub 上了解更多



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-node)


  

  

    
Python

    

要在 Python 中使用 OpenAI API，你可以使用官方的 [适用于 Python 的 OpenAI SDK](https://github.com/openai/openai-python)。首先使用以下命令安装 SDK： [pip](https://pypi.org/project/pip/):

使用 pip 安装 OpenAI SDK

```bash
pip install openai
```


安装 OpenAI SDK 后，创建一个名为 `example.py` 并将示例代码复制到其中：

测试一个基本的 API 请求

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Write a one-sentence bedtime story about a unicorn.",
)

print(response.output_text)
```


使用 `python example.py`。执行代码。片刻之后，你应该会看到你的 API 请求的输出。

[在 GitHub 上了解更多



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-python)


  

  

    
.NET

    

与微软合作，OpenAI 为 C# 提供了一个官方支持的 API 客户端。你可以通过 .NET CLI 从 [NuGet](https://www.nuget.org/).

```
dotnet add package OpenAI
```

一个向 [Responses API](https://developers.openai.com/api/reference/resources/responses) 发出的简单 API 请求看起来像这样：

测试一个基本的 API 请求

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

    

OpenAI 为 Java 编程语言提供了一个 API 辅助库，目前处于测试阶段。你可以使用以下配置包含 Maven 依赖：

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.52.0</version>
</dependency>
```


一个向 [Responses API](https://developers.openai.com/api/reference/resources/responses) 发出的简单 API 请求看起来像这样：

测试一个基本的 API 请求

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


要了解有关在 Java 中使用 OpenAI API 的更多信息，请查看下面链接的 GitHub 仓库！

[在 GitHub 上了解更多



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-java)


  

  

    
Go

    

OpenAI为Go编程语言提供了一个API辅助库，目前处于测试阶段。你可以使用以下代码导入该库：

```go
import (
	"github.com/openai/openai-go/v3" // imported as openai
)
```


向 [Responses API](https://developers.openai.com/api/reference/resources/responses) 发送的第一个API请求如下所示：

测试一个基本的API请求

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


要了解有关在Go中使用OpenAI API的更多信息，请查看下方链接的GitHub仓库！

[在GitHub上了解更多



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-go)


  

  

    
Ruby

    

要在Ruby中使用OpenAI API，你可以使用官方的 [OpenAI SDK for Ruby](https://github.com/openai/openai-ruby)。首先，将gem添加到你的应用程序中：

使用Bundler安装OpenAI SDK

```ruby
gem "openai"
```


安装OpenAI SDK后，创建一个名为 `example.rb` 的文件，并将示例代码复制到其中：

测试一个基本的API请求

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  input: "Write a one-sentence bedtime story about a unicorn."
)

puts(response.output_text)
```


使用以下命令执行代码 `ruby example.rb`。片刻之后，你应该会看到你的API请求的输出。

[在GitHub上了解更多



      Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-ruby)


  

  

    
CLI

    

要直接从终端调用 OpenAI API，请安装生成的 `openai` 命令行工具：

通过 Homebrew 安装 OpenAI CLI

```bash
brew install openai/tools/openai
```


然后在 shell 中运行一个基本的 API 请求：

测试基本的 API 请求

```bash
openai responses create \
  --model "gpt-5.6" \
  --input "Write a one-sentence bedtime story about a unicorn." \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text'
```


将 CLI 用于可重复的终端工作流，例如从文件中提取结构化数据、生成图像、创建语音以及使用 shell 工具（如）组合 API 调用 `jq`.

[OpenAI CLI 指南



      Learn more about CLI workflows and command patterns.](https://developers.openai.com/api/docs/libraries/openai-cli)



## 使用 Agents SDK

对于直接的 OpenAI SDK 请求，请使用上面列出的官方 API。当你的应用需要面向智能体的代码优先编排时，请使用 Agents SDK
，包括工具、
交接、护栏、追踪或沙箱执行。

如果你正在直接 API 请求和代码优先编排之间做选择，
请参阅 [Responses API 与 Agents SDK 的比较](https://developers.openai.com/api/docs/guides/agents#agents-sdk-vs-responses-api).

[Agents SDK 快速入门



      Build your first agent with the Agents SDK.](https://developers.openai.com/api/docs/guides/agents/quickstart)

- [OpenAI Agents SDK（用于 TypeScript）](https://github.com/openai/openai-agents-js)
- [OpenAI Agents SDK（用于 Python）](https://github.com/openai/openai-agents-python)

## Azure OpenAI 库

微软的 Azure 团队维护着与 OpenAI API 和 Azure OpenAI 服务兼容的库。阅读下面的库文档，了解如何将它们与 OpenAI API 一起使用。

- [适用于 .NET 的 Azure OpenAI 客户端库](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI)
- [适用于 JavaScript 的 Azure OpenAI 客户端库](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
- [适用于 Java 的 Azure OpenAI 客户端库](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai)
- [适用于 Go 的 Azure OpenAI 客户端库](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai)

---

## 社区库

以下库由更广泛的开发者社区构建和维护。你也可以 [关注我们的 OpenAPI 规范](https://github.com/openai/openai-openapi) 仓库（位于 GitHub）以获取我们对 API 做出更改时的最新通知。

请注意，OpenAI 不验证这些项目的正确性或安全性。 **使用它们风险自负！**

### Clojure

- [openai-clojure](https://github.com/wkok/openai-clojure) 作者 [wkok](https://github.com/wkok)

### Dart/Flutter

- [openai](https://github.com/anasfik/openai) 由 [anasfik](https://github.com/anasfik)

### Delphi

- [DelphiOpenAI](https://github.com/HemulGM/DelphiOpenAI) 作者 [HemulGM](https://github.com/HemulGM)

### Elixir

- [openai.ex](https://github.com/mgallo/openai.ex) 作者 [mgallo](https://github.com/mgallo)

### Kotlin

- [openai-kotlin](https://github.com/Aallam/openai-kotlin) by [Mouaad Aallam](https://github.com/Aallam)

### PHP

- [orhanerday/open-ai](https://packagist.org/packages/orhanerday/open-ai) 作者 [orhanerday](https://github.com/orhanerday)
- [openai-php 客户端](https://github.com/openai-php/client) 作者 [openai-php](https://github.com/openai-php)

### Rust

- [async-openai](https://github.com/64bit/async-openai) 由 [64bit](https://github.com/64bit)

### Scala

- [openai-scala-client](https://github.com/cequence-io/openai-scala-client) 由 [cequence-io](https://github.com/cequence-io)

### Swift

- [AIProxySwift](https://github.com/lzell/AIProxySwift) 作者 [Lou Zell](https://github.com/lzell)
- [OpenAIKit](https://github.com/dylanshine/openai-kit) 作者 [dylanshine](https://github.com/dylanshine)
- [OpenAI](https://github.com/MacPaw/OpenAI/) 作者 [MacPaw](https://github.com/MacPaw)

### Unity

- [com.openai.unity](https://github.com/RageAgainstThePixel/com.openai.unity) 作者 [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### 虚幻引擎

- [OpenAI-Api-Unreal](https://github.com/KellanM/OpenAI-Api-Unreal) 作者 [KellanM](https://github.com/KellanM)

## 其他 OpenAI 仓库

- [tiktoken](https://github.com/openai/tiktoken) - 统计令牌数
- [simple-evals](https://github.com/openai/simple-evals) - 简单评估库
- [mle-bench](https://github.com/openai/mle-bench) - 评估机器学习工程师智能体的库
- [gym](https://github.com/openai/gym) - 强化学习库
- [swarm](https://github.com/openai/swarm) - 教育编排仓库