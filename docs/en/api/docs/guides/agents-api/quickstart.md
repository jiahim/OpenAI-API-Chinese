# Agents API quickstart

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Build a coding assistant that writes `tree.py`, runs it, and shows a directory tree. OpenAI manages the agent, its conversation, and the sandbox where it works.

## Prerequisites

Create an [application API key](https://platform.openai.com/api-keys) in your OpenAI Platform project. Grant `api.agents.read` and `api.agents.write` for session operations, plus `api.responses.write` for model inference, then export it:

```bash
export OPENAI_API_KEY="your-api-key"
```

Keep this key outside the agent's sandbox. See [OpenAI-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#configure-the-sandbox) for sandbox configuration and limits.

Requests require the `OpenAI-Beta: agents=v1` header. The OpenAI SDKs add it
  automatically; include it explicitly when using cURL.

## 1. Run a task

Choose a language, install the OpenAI SDK, and run the example. The SDK examples use the `beta.agents` namespace. The request creates a session, submits a task, and streams progress.



Python


Install or update the Python SDK:

```bash
pip install --upgrade openai
```

Save the example as `quickstart.py`:

Create and run tree.py

```python
from openai import OpenAI

with OpenAI() as client:
    with client.beta.agents.sessions.create(
        agent={
            "model": "gpt-6-astra",
            "instructions": "Write clean code, run it, and report the actual output.",
        },
        environment={"type": "openai_hosted"},
        input="Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
        stream=True,
    ) as events:
        for event in events:
            print(event.to_json(indent=None), flush=True)
```


Run it from your terminal:

```bash
python quickstart.py
```

  


  

    
JavaScript


Install the JavaScript SDK:

```bash
npm install openai
```

Save the example as `quickstart.mjs`:

Create and run tree.py

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const events = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output.",
  },
  environment: { type: "openai_hosted" },
  input:
    "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
  stream: true,
});
try {
  for await (const event of events) {
    console.log(JSON.stringify(event));
  }
} finally {
  events.controller.abort();
}
```


Run it from your terminal:

```bash
node quickstart.mjs
```

  


  

    
Go


In a new directory, create a Go module and install the SDK:

```bash
go mod init agents-quickstart
go get github.com/openai/openai-go/v3@latest
```

Save the example as `main.go`:

Create and run tree.py

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{
	Agent: openai.BetaAgentSessionNewParamsAgent{
		Model:        openai.String("gpt-6-astra"),
		Instructions: openai.String("Write clean code, run it, and report the actual output."),
	},
	Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{}},
	Input: openai.BetaAgentSessionNewParamsInputUnion{
		OfString: openai.String("Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output."),
	},
})
defer events.Close()
if events.Err() != nil {
	panic(events.Err())
}
for events.Next() {
	event := events.Current()
	fmt.Println(event.RawJSON())
}
if err := events.Err(); err != nil {
	panic(err)
}
```


Run it from your terminal:

```bash
go run .
```

  


  

    
Java


Add the OpenAI SDK to your Maven project's `pom.xml`:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>${apiReferencePackageVersions.java}</version>
</dependency>
```


Save the example as `src/main/java/AgentsApiSessionsStreamConversationExample.java`:

Create and run tree.py

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.beta.agents.AgentSessionEvent;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
try (StreamResponse<AgentSessionEvent> events =
    client
        .beta()
        .agents()
        .sessions()
        .createStreaming(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions("Write clean code, run it, and report the actual output.")
                        .build())
                .environment(EnvironmentParam.OpenAIHosted.builder().build())
                .input(
                    "Create tree.py, a Python script that prints a readable tree of the files"
                        + " in the current directory. Run it and show me the output.")
                .build())) {
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    System.out.println(json.writeValueAsString(event));
  }
}
```


Run it from your terminal:

```bash
mvn compile exec:java -Dexec.mainClass=AgentsApiSessionsStreamConversationExample
```

  


  

    
Ruby


Install the Ruby SDK:

```bash
gem install openai
```

Save the example as `quickstart.rb`:

Create and run tree.py

```ruby
require "openai"
require "json"

client = OpenAI::Client.new
events = client.beta.agents.sessions.create_streaming(
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output."
  },
  environment: { type: "openai_hosted" },
  input: "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output."
)
begin
  events.each do |event|
    puts JSON.generate(event.to_h)
  end
ensure
  events.close
end
```


Run it from your terminal:

```bash
ruby quickstart.rb
```

  


  

    
cURL


Use cURL from your terminal; no SDK installation is needed:

Create and run tree.py

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "agent": {\n      "model": "gpt-6-astra",\n      "instructions": "Write clean code, run it, and report the actual output."\n    },\n    "environment": { "type": "openai_hosted" },\n    "input": "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",\n    "stream": true\n  }\'
```


  


## 2. Follow progress

The terminal shows streamed events. The SDK examples print JSON; cURL shows the raw event stream. On a successful run, the agent creates `tree.py`, executes it, and reports a directory tree containing that file. Other files and output depend on the sandbox.

Look for `agent.session.turn.completed`, then check the agent's reported execution result. A completed turn does not guarantee every tool succeeded. Events ending in `turn.failed`, `turn.cancelled`, or `session.failed` indicate failure or cancellation; `agent.session.idle` alone does not mean success. If the stream disconnects early, [retrieve the session and its saved items](https://developers.openai.com/api/docs/guides/agents-api/sessions#how-to-recover-a-disconnected-stream) before retrying.

## 3. Continue the session

Save the `session_id` from the events. Use it to [send a follow-up](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) such as “Add a maximum-depth option to `tree.py`, run it, and show me the output.” Open the event stream before sending follow-up input so you don't miss early events.




## 4. Clean up

Keep the session for more tasks, or delete it when you're done. [Save any files you need](https://developers.openai.com/api/docs/guides/agents-api/environments/files) first.

Replace the illustrative `sess_123` value in the example with the session ID you saved.

  

    
Python

    Delete the session

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI


def delete_session(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.delete(session_id)


if __name__ == "__main__":
    result = delete_session(OpenAI(), "sess_123")
    print(result.to_json())
```

  

  

    
JavaScript

    Delete the session

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

/**
 * @param {OpenAI} client
 * @param {string} sessionId
 */
async function deleteSession(client, sessionId) {
  return client.beta.agents.sessions.delete(sessionId);
}

const result = await deleteSession(new OpenAI(), "sess_123");
console.log(result);
```

  

  

    
Go

    Delete the session

```go
// Replace the illustrative IDs and URLs below with your own resource values.
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func deleteSession(ctx context.Context, client *openai.Client, sessionID string) (*openai.AgentSessionDeleted, error) {
	return client.Beta.Agents.Sessions.Delete(ctx, sessionID)
}

func main() {
	client := openai.NewClient()
	result, err := deleteSession(context.Background(), &client, "sess_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(result)
}
```

  

  

    
Java

    Delete the session

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentSessionDeleted;
import com.openai.models.beta.agents.sessions.SessionDeleteParams;

public final class AgentsApiSessionsDeleteSessionExample {
  public static AgentSessionDeleted deleteSession(OpenAIClient client, String sessionId) {
    return client
        .beta()
        .agents()
        .sessions()
        .delete(SessionDeleteParams.builder().sessionId(sessionId).build());
  }

  public static void main(String[] args) {
    var result = deleteSession(OpenAIOkHttpClient.fromEnv(), "sess_123");
    System.out.println(result);
  }
}
```

  

  

    
Ruby

    Delete the session

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

def delete_session(client, session_id)
  client.beta.agents.sessions.delete(session_id)
end

puts delete_session(OpenAI::Client.new, "sess_123")
```

  

  

    
cURL

    Delete the session

```bash
curl -X DELETE "https://api.openai.com/v1/agents/sessions/sess_123" \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY"
```



## Next steps

- [Explore example applications](https://developers.openai.com/api/docs/guides/agents-api/overview#try-an-example).
- [Configure an OpenAI-hosted sandbox](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted): add packages and input files, control network access, and download artifacts.
- [Compare release notes with subagents](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes).
- [Work with files and artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files).
- [Choose an environment](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings), or [connect your own sandbox](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).