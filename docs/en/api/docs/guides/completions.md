# Completions API

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The completions API endpoint received its final update in July 2023 and has a different interface than the new Chat Completions endpoint. Instead of the input being a list of messages, the input is a freeform text string called a `prompt`.

An example legacy Completions API call looks like the following:

```javascript
const completion = await openai.completions.create({
  model: "gpt-3.5-turbo-instruct",
  prompt: "Write a tagline for an ice cream shop.",
});
```

```python
from openai import OpenAI

client = OpenAI()

response = client.completions.create(
    model="gpt-3.5-turbo-instruct", prompt="Write a tagline for an ice cream shop."
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	response, err := client.Completions.New(context.Background(), openai.CompletionNewParams{
		Model:  "gpt-3.5-turbo-instruct",
		Prompt: openai.CompletionNewParamsPromptUnion{OfString: openai.String("Write a tagline for an ice cream shop.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Choices[0].Text)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
completion = client.completions.create(model: "gpt-3.5-turbo-instruct", prompt: "Write a tagline for a bakery.", max_tokens: 24)
puts(completion.choices.fetch(0).text)
```


See the full [API reference documentation](https://platform.openai.com/docs/api-reference/completions) to learn more.

#### Inserting text

The completions endpoint also supports inserting text by providing a [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) in addition to the standard prompt which is treated as a prefix. This need naturally arises when writing long-form text, transitioning between paragraphs, following an outline, or guiding the model towards an ending. This also works on code, and can be used to insert in the middle of a function or file.



To illustrate how suffix context effects generated text, consider the prompt, “Today I decided to make a big change.” There’s many ways one could imagine completing the sentence. But if we now supply the ending of the story: “I’ve gotten many compliments on my new hair!”, the intended completion becomes clear.

> I went to college at Boston University. After getting my degree, I decided to make a change**. A big change!**

> **I packed my bags and moved to the west coast of the United States.**

> Now, I can't get enough of the Pacific Ocean!

By providing the model with additional context, it can be much more steerable. However, this is a more constrained and challenging task for the model. To get the best results, we recommend the following:

**Use `max_tokens` > 256.** The model is better at inserting longer completions. With too small `max_tokens`, the model may be cut off before it's able to connect to the suffix. Note that you will only be charged for the number of tokens produced even when using larger `max_tokens`.

**Prefer `finish_reason` == "stop".** When the model reaches a natural stopping point or a user provided stop sequence, it will set `finish_reason` as "stop". This indicates that the model has managed to connect to the suffix well and is a good signal for the quality of a completion. This is especially relevant for choosing between a few completions when using n > 1 or resampling (see the next point).

**Resample 3-5 times.** While almost all completions connect to the prefix, the model may struggle to connect the suffix in harder cases. We find that resampling 3 or 5 times (or using best_of with k=3,5) and picking the samples with "stop" as their `finish_reason` can be an effective way in such cases. While resampling, you would typically want a higher temperatures to increase diversity.

Note: if all the returned samples have `finish_reason` == "length", it's likely that max_tokens is too small and model runs out of tokens before it manages to connect the prompt and the suffix naturally. Consider increasing `max_tokens` before resampling.

**Try giving more clues.** In some cases to better help the model’s generation, you can provide clues by giving a few examples of patterns that the model can follow to decide a natural place to stop.

> How to make a delicious hot chocolate:
>
> 1.** Boil water**
> **2. Put hot chocolate in a cup**
> **3. Add boiling water to the cup** 4. Enjoy the hot chocolate

> 1. Dogs are loyal animals.
> 2. Lions are ferocious animals.
> 3. Dolphins** are playful animals.**
> 4. Horses are majestic animals.



### Completions response format

An example completions API response looks as follows:

```
{
  "choices": [
    {
      "finish_reason": "length",
      "index": 0,
      "logprobs": null,
      "text": "\n\n\"Let Your Sweet Tooth Run Wild at Our Creamy Ice Cream Shack"
    }
  ],
  "created": 1683130927,
  "id": "cmpl-7C9Wxi9Du4j1lQjdjhxBlO22M61LD",
  "model": "gpt-3.5-turbo-instruct",
  "object": "text_completion",
  "usage": {
    "completion_tokens": 16,
    "prompt_tokens": 10,
    "total_tokens": 26
  }
}
```

In Python, the output can be extracted with `response['choices'][0]['text']`.

The response format is similar to the response format of the Chat Completions API.

### Inserting text

The completions endpoint also supports inserting text by providing a [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) in addition to the standard prompt which is treated as a prefix. This need naturally arises when writing long-form text, transitioning between paragraphs, following an outline, or guiding the model towards an ending. This also works on code, and can be used to insert in the middle of a function or file.



To illustrate how suffix context effects generated text, consider the prompt, “Today I decided to make a big change.” There’s many ways one could imagine completing the sentence. But if we now supply the ending of the story: “I’ve gotten many compliments on my new hair!”, the intended completion becomes clear.

> I went to college at Boston University. After getting my degree, I decided to make a change**. A big change!**

> **I packed my bags and moved to the west coast of the United States.**

> Now, I can’t get enough of the Pacific Ocean!

By providing the model with additional context, it can be much more steerable. However, this is a more constrained and challenging task for the model. To get the best results, we recommend the following:

**Use `max_tokens` > 256.** The model is better at inserting longer completions. With too small `max_tokens`, the model may be cut off before it's able to connect to the suffix. Note that you will only be charged for the number of tokens produced even when using larger `max_tokens`.

**Prefer `finish_reason` == "stop".** When the model reaches a natural stopping point or a user provided stop sequence, it will set `finish_reason` as "stop". This indicates that the model has managed to connect to the suffix well and is a good signal for the quality of a completion. This is especially relevant for choosing between a few completions when using n > 1 or resampling (see the next point).

**Resample 3-5 times.** While almost all completions connect to the prefix, the model may struggle to connect the suffix in harder cases. We find that resampling 3 or 5 times (or using best_of with k=3,5) and picking the samples with "stop" as their `finish_reason` can be an effective way in such cases. While resampling, you would typically want a higher temperatures to increase diversity.

Note: if all the returned samples have `finish_reason` == "length", it's likely that max_tokens is too small and model runs out of tokens before it manages to connect the prompt and the suffix naturally. Consider increasing `max_tokens` before resampling.

**Try giving more clues.** In some cases to better help the model’s generation, you can provide clues by giving a few examples of patterns that the model can follow to decide a natural place to stop.

> How to make a delicious hot chocolate:
>
> 1.** Boil water**
> **2. Put hot chocolate in a cup**
> **3. Add boiling water to the cup** 4. Enjoy the hot chocolate

> 1. Dogs are loyal animals.
> 2. Lions are ferocious animals.
> 3. Dolphins** are playful animals.**
> 4. Horses are majestic animals.



## Chat Completions vs. Completions

The Chat Completions format can be made similar to the completions format by constructing a request using a single user message. For example, one can translate from English to French with the following completions prompt:

```
Translate the following English text to French: "{text}"
```

And an equivalent chat prompt would be:

```
[{"role": "user", "content": 'Translate the following English text to French: "{text}"'}]
```

Likewise, the completions API can be used to simulate a chat between a user and an assistant by formatting the input [accordingly](https://platform.openai.com/playground/p/default-chat?model=gpt-3.5-turbo-instruct).

The difference between these APIs is the underlying models that are available in each. The Chat Completions API supports current GPT models like [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) and lower-cost options like [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra).