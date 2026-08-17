# GPT Actions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

GPT Actions are stored in [Custom GPTs](https://openai.com/blog/introducing-gpts), which enable users to customize ChatGPT for specific use cases by providing instructions, attaching documents as knowledge, and connecting to 3rd party services.

GPT Actions empower ChatGPT users to interact with external applications via RESTful APIs calls outside of ChatGPT simply by using natural language. They convert natural language text into the json schema required for an API call. GPT Actions are usually either used to do [data retrieval](https://developers.openai.com/api/docs/actions/data-retrieval) to ChatGPT (e.g. query a Data Warehouse) or take action in another application (e.g. file a JIRA ticket).

## How GPT Actions work

At their core, GPT Actions leverage [Function Calling](https://developers.openai.com/api/docs/guides/function-calling) to execute API calls.

Similar to ChatGPT's Data Analysis capability (which generates Python code and then executes it), they leverage Function Calling to (1) decide which API call is relevant to the user's question and (2) generate the json input necessary for the API call. Then finally, the GPT Action executes the API call using that json input.

Developers can even specify the authentication mechanism of an action, and the Custom GPT will execute the API call using the third party app’s authentication. GPT Actions obfuscates the complexity of the API call to the end user: they simply ask a question in natural language, and ChatGPT provides the output in natural language as well.

## The Power of GPT Actions

APIs allow for **interoperability** to enable your organization to access other applications. However, enabling users to access the right information from 3rd-party APIs can require significant overhead from developers.

GPT Actions provide a viable alternative: developers can now simply describe the schema of an API call, configure authentication, and add in some instructions to the GPT, and ChatGPT provides the bridge between the user's natural language questions and the API layer.

## Simplified example

The [getting started guide](https://developers.openai.com/api/docs/actions/getting-started) walks through an example using two API calls from [weather.gov](https://developers.openai.com/api/docs/actions/weather.gov) to generate a forecast:

- /points/\{latitude},\{longitude} inputs lat-long coordinates and outputs forecast office (wfo) and x-y coordinates
- /gridpoints/\{office}/\{gridX},\{gridY}/forecast inputs wfo,x,y coordinates and outputs a forecast

Once a developer has encoded the json schema required to populate both of those API calls in a GPT Action, a user can simply ask "What I should pack on a trip to Washington DC this weekend?" The GPT Action will then figure out the lat-long of that location, execute both API calls in order, and respond with a packing list based on the weekend forecast it receives back.

In this example, GPT Actions will supply api.weather.gov with two API inputs:

/points API call:

```json
{
  "latitude": 38.9072,
  "longitude": -77.0369
}
```

/forecast API call:

```json
{
  "wfo": "LWX",
  "x": 97,
  "y": 71
}
```

## Get started on building

Check out the [getting started guide](https://developers.openai.com/api/docs/actions/getting-started) for a deeper dive on this weather example and our [actions library](https://developers.openai.com/api/docs/actions/actions-library) for pre-built example GPT Actions of the most common 3rd party apps.

## Additional information

- Familiarize yourself with our [GPT policies](https://openai.com/policies/usage-policies#:~:text=or%20educational%20purposes.-,Building%20with%20ChatGPT,-Shared%20GPTs%20allow)
- Check out the [GPT data privacy FAQs](https://help.openai.com/en/articles/8554402-gpts-data-privacy-faqs)
- Find answers to [common GPT questions](https://help.openai.com/en/articles/8554407-gpts-faq)