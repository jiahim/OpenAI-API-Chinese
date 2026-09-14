# Files and artifacts

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Files and published artifacts

Files live in the agent's environment. An artifact is a published copy of a file from an OpenAI-hosted environment. You can download that copy after the environment expires.

| Environment     | How to retrieve files                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `self_hosted`   | Use your provider's file API or mounted filesystem.                                                                       |
| `openai_hosted` | Use the session Artifacts API for files under `/workspace/outputs`.                                                       |
| `none`          | No environment filesystem. Read output from [session items](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items). |

## Upload files

For an OpenAI-hosted environment, supply input files in `environment.files` when you create the session. Choose each file's destination under `/workspace`.

Use `type: "file_id"` with a `file_id` from the [Files API](https://developers.openai.com/api/reference/resources/files/methods/create), or `type: "inline"` with base64-encoded `data`. Both forms require a `path`.

To add files after the environment connects, use the [environment Files API](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/environments/subresources/files/methods/create).

## Retrieve your files




### From your own environment

Ask the agent to write its output to a known path. After the turn completes, retrieve the file through your provider or infrastructure. Save it in your application's storage before the environment expires or you delete it.

Files from self-hosted environments are not published through the Artifacts API, including files under `/workspace/outputs`. See [Sandbox providers](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers) for provider-specific file access.








### From an OpenAI-hosted environment

Ask the agent to save the file under `/workspace/outputs`, such as `/workspace/outputs/report.pdf`. OpenAI publishes outputs as immutable artifacts when the turn completes.

Pass your API client, session ID, completed turn ID, artifact path, and local destination to this function. It lists artifacts and downloads the file matching both the turn and path:

Find and download an artifact

```python
# Pass the saved session ID, completed turn ID, artifact path, and local destination.
def download_artifact(client, session_id, turn_id, path, destination):
    for artifact in client.beta.agents.sessions.artifacts.list(session_id):
        if artifact.turn_id != turn_id or artifact.path != path:
            continue
        with client.beta.agents.sessions.artifacts.with_streaming_response.content(
            artifact.id, session_id=session_id
        ) as response:
            response.stream_to_file(destination)
        return
    raise FileNotFoundError(f"No artifact for {path!r} in turn {turn_id}")
```





See the [List artifacts](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/list), [Retrieve metadata](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/retrieve), and [Download content](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/content) references for request and response fields.

### Download multiple files

The API downloads one artifact per request; it does not provide a batch-download
endpoint. To download several files, list the artifacts and request each file's
`content`. For a single download, ask the agent to bundle the results into a ZIP
file under `/workspace/outputs`, then download that archive as one artifact.

## File lifetime

Published artifacts survive environment expiration. Download anything you need to retain before deleting the session.

Artifacts cannot be uploaded or edited through this API. To publish a new version, ask the agent to update the file and complete another turn. Use the turn ID and path to distinguish versions.




[Delete an artifact](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/artifacts/methods/delete) when you no longer need the published copy. Deletion leaves the file in the environment intact.

## File limits

| File operation                         | Limit                                            |
| -------------------------------------- | ------------------------------------------------ |
| Files included when creating a session | 50 files per request.                            |
| Inline upload                          | 5 MiB per file, measured before base64 encoding. |
| Inline uploads in one creation request | 10 MiB total, measured before base64 encoding.   |
| File copied from the Files API         | 50 MiB per file.                                 |
| Published artifact                     | 200 MiB per file.                                |
| Outputs published together             | 500 MiB total.                                   |