# GPT Actions 入门

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## Weather.gov 示例

NSW（National Weather Service）维护着一个 [公开的 API](https://www.weather.gov/documentation/services-web-api) 用户可以查询该 接口 以获取任意经纬度位置的天气预报。要获取预报，需要完成 2 个步骤：

1. 用户提供一个经纬度给 api.weather.gov/points API，并收到返回的 WFO（天气预报办公室）、grid-X 和 grid-Y 坐标
2. 这 3 个元素被传入 api.weather.gov/forecast API，以检索该坐标的天气预报

在本练习中，让我们构建一个 Custom GPT，用户在其中输入城市、地标或经纬度坐标，该 Custom GPT 会回答有关该位置天气预报的问题。

## Step 1: 使用 Actions GPT 编写并测试 Open API 架构

GPT Action 需要一个 [Open API schema](https://swagger.io/specification/) 来描述 API 调用的参数，这是描述 API 的标准。

OpenAI 发布了一个公开的 [Actions GPT](https://chatgpt.com/g/g-TYEliDU6A-actionsgpt) 来帮助开发者编写此 schema。例如，前往 Actions GPT 并询问： _“前往 https://www.weather.gov/documentation/services-web-api 并阅读该页面的文档。为 /points/\{latitude}、\{longitude} 和 /gridpoints/\{office}/\{gridX}、\{gridY}/forecast 这两个 API 调用构建一个 Open API Schema”_

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



ChatGPT 会根据顶部的 **info** （尤其是其中的 description）来判断此 action 是否与用户的查询相关。

```yaml
info:
  title: NWS Weather API
  description: Access to weather data including forecasts, alerts, and observations.
  version: 1.0.0
```

然后，下方的 **parameters** 进一步定义 schema 的各个部分。例如，我们在此告知 ChatGPT， _office_ 参数指的是 Weather Forecast Office (WFO)。

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

**要点：** 请特别留意你在该 Open API schema 中使用的 **schema 名称** 和 **描述** 。ChatGPT 会依据这些名称和描述来理解 (a) 应该调用哪个 API 操作，以及 (b) 应该使用哪个参数。如果某个字段被限定为只能取特定值，你还可以提供一个带有描述性类别名称的 "enum"。

虽然你可以在 GPT Action 中直接试用 Open API schema，但直接在 ChatGPT 中调试可能会比较困难。我们推荐使用第三方服务（例如 [Postman](https://www.postman.com/)）来测试你的 API 调用是否正常工作。Postman 可以免费注册，在错误处理方面信息详尽，并且支持丰富的身份验证方式。它甚至支持直接导入 Open API schema（见下文）。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_import.png"
  alt="Choosing to import your API with Postman"
/>

## 步骤 2:确定身份验证要求

这个 Weather 第三方服务不需要身份验证，因此你可以在这个 Custom GPT 中跳过该步骤。对于确实需要身份验证的其他 GPT Actions，有两种选项：API Key 或 OAuth。向 ChatGPT 提问可以帮助你入门大多数常见应用。例如，如果我需要使用 OAuth 对 Google Cloud 进行身份验证，我可以提供一张截图并询问细节： _“我正在通过 OAuth 构建与 Google Cloud 的连接。请提供关于如何填写这些框中每一项的说明。”_

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_oauth_panel.png"
  alt="The above ChatGPT request"
/>

通常，ChatGPT 会在全部 5 个元素上给出正确的指引。一旦你准备好这些基础内容，就可以尝试在 Postman 或其他类似服务中测试和调试身份验证。如果遇到错误，把错误信息提供给 ChatGPT，它通常能帮助你从此处进行调试。

## 步骤 3：创建 GPT Action 并测试

现在是创建你的自定义 GPT 的时候了。如果你以前从未创建过自定义 GPT，请从我们的 [创建 GPT 指南](https://help.openai.com/en/articles/8554397-creating-a-gpt).

1. 提供名称、描述和图片来描述你的自定义 GPT
2. 进入 Action 部分，粘贴你的 OpenAPI 架构。编写指令时记下 Action 名称和 JSON 参数。
3. 添加你的身份验证设置
4. 返回主页并添加指令



编写有效指令的方式有很多：最重要的是，这些指令能够让模型反映出用户的偏好。

通常来说，指令包含三个部分：

1. _上下文_ 用于向模型解释该 GPT 操作正在做什么
2. _操作说明_ 关于步骤顺序 —— 这是你引用操作名称以及 API 调用需要注意的任何参数的地方
3. _附加备注_ 如果有任何需要记住的事项

下面是 Weather GPT 的指令示例。请注意，这些指令引用了来自 Open API schema 中的 API action 名称和 json 参数。

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



### 测试 GPT Action

每个操作旁边，你会看到 **测试** 按钮。点击每个操作的对应按钮。在测试中，你可以查看每次 API 调用的详细输入和输出。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_available_action.png"
  alt="Available actions"
/>

如果你的 API 调用在 Postman 等第三方工具中正常工作，但在 ChatGPT 中不工作，可能有以下几种原因：

- ChatGPT 中的参数错误或缺失
- ChatGPT 中的认证问题
- 你的指令不完整或不清晰
- Open API schema 中的描述不清晰

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_test_action.png"
  alt="A preview response from testing the weather API call"
/>

## 步骤 4：在第三方应用中设置回调 URL

如果你的 GPT Action 使用了 OAuth 身份验证，需要在第三方应用中设置回调 URL。完成 OAuth 的 GPT Action 配置后，ChatGPT 会提供一个回调 URL（每次更新任意 OAuth 参数时该 URL 都会同步更新）。复制该回调 URL，并添加到应用中的对应位置。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_bq_callback.png"
  alt="Setting up a callback URL"
/>

## 第 5 步：评估自定义 GPT

即使你已经在上一步测试过 GPT Action，仍然需要评估 Instructions 和 GPT Action 是否按用户预期的方式运行。试着想出至少 5 到 10 个有代表性的问题（越多越好），这些问题是给 **“评估集”** 要向你的 Custom GPT 提出的问题。

**要点：** 测试 Custom GPT 按你的预期处理每一个问题。

示例问题： _“这个周末去白宫旅行我应该带些什么？”_ 可以测试 Custom GPT 的以下能力：(1) 将地标转换为经纬度，(2) 同时运行两个 GPT Action，以及 (3) 回答用户的问题。

<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_prompt_2_actions.png"
  alt="The response to the above ChatGPT request, including weather data"
/>
<img
  className="images-example-image" src="https://cdn.openai.com/API/images/guides/actions_output.png"
  alt="A continuation of the response above"
/>

## 常见调试步骤

_挑战：_ GPT 操作调用了错误的 API 调用（或者根本没有调用）

- _解决方案：_ 确保对各 Action 的描述清晰明确，并在你的自定义 GPT 指令中引用相应的 Action 名称。

_挑战：_ GPT Action 调用了正确的 API，但没有正确使用参数

- _解决方案：_ 在 GPT 操作中添加或修改参数描述

_挑战：_ 自定义 GPT 无法正常工作，但我没有收到明确的错误提示

- _解决方案：_ 请务必测试该 Action —— 测试窗口中提供了更详细的日志。如果仍不清晰，可使用 Postman 或其他第三方服务来更好地诊断问题。

_挑战：_ 自定义 GPT 正在抛出身份验证错误

- _解决方案：_ 确保你的回调 URL 设置正确。尝试在 Postman 或其他第三方服务中使用完全相同的身份验证设置进行测试

_挑战：_ 自定义 GPT 无法处理更困难或含糊的问题

- _解决方案：_ 尝试在自定义 GPT 中对你的指令进行提示工程。相关示例可参见我们的 [提示工程指南](https://developers.openai.com/api/docs/guides/prompt-engineering)

本指南至此结束，祝你顺利构建并运用自定义 GPT。 [OpenAI 开发者论坛](https://community.openai.com/) 如果你还有其他问题。