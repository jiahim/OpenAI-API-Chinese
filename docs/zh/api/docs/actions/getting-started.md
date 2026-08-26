# GPT Actions 入门

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## Weather.gov 示例

新南威尔士州国家气象局（NSW (National Weather Service)）维护一个 [公开 API](https://www.weather.gov/documentation/services-web-api) ，用户可查询它来获取任意经纬度点的天气预报。要获取预报，需执行 2 个步骤：

1. 用户向 api.weather.gov/points API 提供经纬度，并收到 WFO（天气预报办公室）、网格 X 和网格 Y 坐标
2. 这 3 个元素输入 api.weather.gov/forecast API 以检索该坐标的天气预报

为了本次练习的目的，让我们构建一个自定义 GPT，用户在其中输入城市、地标或经纬度坐标，自定义 GPT 将回答有关该位置天气预报的问题。

## 步骤 1：编写并测试 Open API schema（使用 Actions GPT）

一个 GPT 操作需要一个 [Open API schema](https://swagger.io/specification/) 来描述 API 调用的参数，这是描述 API 的标准。

OpenAI 发布了一个公开的 [Actions GPT](https://chatgpt.com/g/g-TYEliDU6A-actionsgpt) 来帮助开发者编写此 schema。例如，前往 Actions GPT 并询问： _“前往 https://www.weather.gov/documentation/services-web-api 并阅读该页面上的文档。为 /points/ 构建一个 Open API Schema/\{latitude},\{longitude} 和 /gridpoints/\{office}/\{gridX},\{gridY}/forecast” API 调用”_

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_action_gpt.png"
  alt="The above Actions GPT request"
/>



以下是 Actions GPT 返回的完整 Open API Schema：

```yaml
openapi: 3.1.0
info:
  title: NWS Weather API
  description: Access to weather data including forecasts, alerts, and observations.
  version: 1.0.0
servers:
  - url: https://api.weather.gov
    description: Main API Server
paths:
  /points/{latitude},{longitude}:
    get:
      operationId: getPointData
      summary: Get forecast grid endpoints for a specific location
      parameters:
        - name: latitude
          in: path
          required: true
          schema:
            type: number
            format: float
          description: Latitude of the point
        - name: longitude
          in: path
          required: true
          schema:
            type: number
            format: float
          description: Longitude of the point
      responses:
        "200":
          description: Successfully retrieved grid endpoints
          content:
            application/json:
              schema:
                type: object
                properties:
                  properties:
                    type: object
                    properties:
                      forecast:
                        type: string
                        format: uri
                      forecastHourly:
                        type: string
                        format: uri
                      forecastGridData:
                        type: string
                        format: uri

  /gridpoints/{office}/{gridX},{gridY}/forecast:
    get:
      operationId: getGridpointForecast
      summary: Get forecast for a given grid point
      parameters:
        - name: office
          in: path
          required: true
          schema:
            type: string
          description: Weather Forecast Office ID
        - name: gridX
          in: path
          required: true
          schema:
            type: integer
          description: X coordinate of the grid
        - name: gridY
          in: path
          required: true
          schema:
            type: integer
          description: Y coordinate of the grid
      responses:
        "200":
          description: Successfully retrieved gridpoint forecast
          content:
            application/json:
              schema:
                type: object
                properties:
                  properties:
                    type: object
                    properties:
                      periods:
                        type: array
                        items:
                          type: object
                          properties:
                            number:
                              type: integer
                            name:
                              type: string
                            startTime:
                              type: string
                              format: date-time
                            endTime:
                              type: string
                              format: date-time
                            temperature:
                              type: integer
                            temperatureUnit:
                              type: string
                            windSpeed:
                              type: string
                            windDirection:
                              type: string
                            icon:
                              type: string
                              format: uri
                            shortForecast:
                              type: string
                            detailedForecast:
                              type: string
```



ChatGPT 使用顶部的 **info** （特别是其中的描述）来确定此操作是否与用户查询相关。

```yaml
info:
  title: NWS Weather API
  description: Access to weather data including forecasts, alerts, and observations.
  version: 1.0.0
```

然后， **parameters** 部分进一步定义了 schema 的每个部分。例如，我们告知 ChatGPT 该 _office_ 参数指天气预报办公室（WFO）。

```yaml
/gridpoints/{office}/{gridX},{gridY}/forecast:
  get:
    operationId: getGridpointForecast
    summary: Get forecast for a given grid point
    parameters:
      - name: office
        in: path
        required: true
        schema:
          type: string
        description: Weather Forecast Office ID
```

**关键：** 特别注意 **schema 名称** 和 **描述** ，你在本 Open API schema 中使用它们。ChatGPT 使用这些名称和描述来理解 (a) 应调用哪个 API 动作以及 (b) 应使用哪个参数。如果某个字段仅限特定值，你还可以提供带有描述性类别名称的“enum”。

虽然你可以直接在 GPT 操作中尝试使用 Open API schema，但直接在 ChatGPT 中调试可能具有挑战性。我们建议使用第三方服务，如 [Postman](https://www.postman.com/)，来测试你的 API 调用是否正常工作。Postman 免费注册，错误处理详尽，认证选项全面。它甚至允许你直接导入 Open API schema（见下文）。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_import.png"
  alt="Choosing to import your API with Postman"
/>

## 第 2 步：确定身份验证要求

这个 Weather 第三方服务不需要认证，因此对于这个自定义 GPT，你可以跳过该步骤。对于其他确实需要认证的 GPT Actions，有两个选项：API 密钥或 OAuth。对于大多数常见应用，询问 ChatGPT 可以帮助你开始。例如，如果我需要使用 OAuth 向 Google Cloud 进行认证，我可以提供一张截图并询问细节： _“我正在通过 OAuth 建立与 Google Cloud 的连接。请提供如何填写每个框的说明。”_

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_oauth_panel.png"
  alt="The above ChatGPT request"
/>

通常，ChatGPT 会就所有 5 个要素提供正确的指示。一旦你准备好这些基础知识，请尝试在 Postman 或其他类似服务中测试和调试认证。如果你遇到错误，请将该错误提供给 ChatGPT，它通常可以帮助你从那里开始调试。

## 步骤 3：创建 GPT 操作并进行测试

现在是时候创建你的自定义 GPT 了。如果你以前从未创建过自定义 GPT，请从我们的 [创建 GPT 指南](https://help.openai.com/en/articles/8554397-creating-a-gpt).

1. 提供名称、描述和图片来描述你的自定义 GPT
2. 转到“操作”部分并粘贴你的 Open API 架构。编写指令时，记下操作名称和 JSON 参数。
3. 添加你的认证设置
4. 返回主页面并添加指令



编写成功指令的方式有很多种：最重要的是指令能让模型反映用户的偏好。

通常包含三个部分：

1. _上下文_ 用于向模型解释GPT Action在做的事情
2. _说明_ 关于步骤顺序——这是你引用Action名称以及API调用需要注意的任何参数的地方
3. _附加说明_ 如果有任何需要记住的内容

以下是 Weather GPT 的指令示例。请注意指令如何引用 Open API 模式中的 API 动作名称和 json 参数。

```
**Context**: A user needs information related to a weather forecast of a specific location.

**Instructions**:
1. The user will provide a lat-long point or a general location or landmark (e.g. New York City, the White House). If the user does not provide one, ask for the relevant location
2. If the user provides a general location or landmark, convert that into a lat-long coordinate. If required, browse the web to look up the lat-long point.
3. Run the "getPointData" API action and retrieve back the gridId, gridX, and gridY parameters.
4. Apply those variables as the office, gridX, and gridY variables in the "getGridpointForecast" API action to retrieve back a forecast
5. Use that forecast to answer the user's question

**Additional Notes**:
- Assume the user uses US weather units (e.g. Fahrenheit) unless otherwise specified
- If the user says "Let's get started" or "What do I do?", explain the purpose of this Custom GPT
```



### 测试 GPT 操作

在每个操作旁边，你会看到一个 **测试** 按钮。为每个操作点击它。在测试中，你可以看到每个API调用的详细输入和输出。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_available_action.png"
  alt="Available actions"
/>

如果你的API调用在 Postman 等第三方工具中正常工作，但在 ChatGPT 中不行，可能有几个原因：

- ChatGPT 中的参数错误或缺失
- ChatGPT 中的身份验证问题
- 你的指令不完整或不明确
- Open API 架构中的描述不明确

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_test_action.png"
  alt="A preview response from testing the weather API call"
/>

## 步骤 4：在第三方应用中设置回调 URL

如果你的 GPT Action 使用 OAuth 认证，你需要在第三方应用程序中设置回调 URL。一旦你使用 OAuth 设置了 GPT Action，ChatGPT 会为你提供一个回调 URL（更新任何 OAuth 参数时，该 URL 都会更新）。复制该回调 URL，并将其添加到应用程序中的相应位置。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_bq_callback.png"
  alt="Setting up a callback URL"
/>

## 第 5 步：评估自定义 GPT

尽管你在上一步中测试了 GPT Action，你仍需评估 Instructions 和 GPT Action 是否按用户期望的方式运行。尝试提出至少 5-10 个代表性（越多越好）问题，作为 **“评估集”** ，用于询问你的 Custom GPT。

**重点：** 测试 Custom GPT 是否如你期望的那样处理每个问题。

示例问题： _“这个周末去白宫旅行，我应该带什么？”_ 测试了 Custom GPT 的能力：（1）将地标转换为经纬度，（2）运行两个 GPT Action，（3）回答用户的问题。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_prompt_2_actions.png"
  alt="The response to the above ChatGPT request, including weather data"
/>
<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_output.png"
  alt="A continuation of the response above"
/>

## 常见调试步骤

_挑战：_ GPT 操作调用了错误的 API 调用（或根本没有调用）

- _解决方案：_ 确保 Actions 的描述清晰明了，并在你的自定义 GPT 指令中引用 Action 名称。

_挑战：_ GPT Action 调用了正确的 API 调用，但没有正确使用参数

- _解决方案：_ 在 GPT 操作中添加或修改参数的描述

_挑战：_ 自定义 GPT 无法正常工作，但我没有收到明确错误

- _解决方案：_ 务必测试该操作——测试窗口中有更详细的日志。如果仍然不明确，可使用 Postman 或其他第三方服务进行更好的诊断。

_挑战：_ 自定义 GPT 出现身份验证错误

- _解决方案：_ 确保回调 URL 设置正确。尝试在 Postman 或其他第三方服务中测试完全相同的身份验证设置

_挑战：_ 自定义 GPT 无法处理更困难/模糊的问题

- _解决方案：_ 尝试在自定义 GPT 中提示工程化你的指令。参见我们的示例： [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering)

本指南到此结束，介绍了如何构建自定义 GPT。祝你顺利构建并善用 [OpenAI 开发者论坛](https://community.openai.com/) 如果你还有其他问题。