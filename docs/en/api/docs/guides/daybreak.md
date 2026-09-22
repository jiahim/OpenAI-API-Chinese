# Use Daybreak in the Responses API

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use `access_programs.cyber` to select a cybersecurity access program for a Responses API request. The [Daybreak Blue and Daybreak Red programs](https://help.openai.com/en/articles/20001258-trusted-access-for-cyber) provide approved access for cybersecurity work. Other [API cybersecurity safeguards](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity) continue to apply.

Before using Daybreak, complete [organization approval and project setup](https://help.openai.com/en/articles/20001261-enterprise-daybreak-onboarding). Your project needs access to both the program and the model. Use an API key from that project. The request parameter selects behavior within your approved access; it doesn't grant access.

## Choose the model and access program

The `model` field selects the model. The `access_programs.cyber` field selects a supported access program for that request: `standard`, `daybreak_blue`, or `daybreak_red`.

| Model                                   | Set `model` to             | Set `access_programs.cyber` to | When to use                                                                                                                  |
| --------------------------------------- | -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Mainline model with standard safeguards | `gpt-6-sol`                | `standard`                     | General-purpose or security tasks with standard safeguards, even if you have Daybreak access.                                |
| Mainline model with Daybreak Blue       | `gpt-6-sol`                | `daybreak_blue`                | Approved defensive security work with a specific mainline model.                                                             |
| Cyber model with Daybreak Red           | `gpt-5.6-cyber`            | `daybreak_red`                 | Advanced, authorized security work with a specific cyber model. Requires Daybreak Red approval.                              |
| Daybreak Blue alias                     | `gpt-daybreak-blue-latest` | `daybreak_blue`                | Approved defensive security work that follows updates to the Blue alias's underlying model.                                  |
| Daybreak Red alias                      | `gpt-daybreak-red-latest`  | `daybreak_red`                 | Advanced, authorized security work that follows updates to the Red alias's underlying model. Requires Daybreak Red approval. |

Match the request value to the model, not your organization's approval level. For example, when using `gpt-6-sol` with Daybreak, send `daybreak_blue` even if your organization has Daybreak Red approval. Sending `daybreak_red` with this model returns `invalid_access_program`.

Daybreak aliases accept only their matching program. For example, requesting `gpt-daybreak-blue-latest` with `daybreak_red` returns an error.

Reduced refusals on `gpt-6-astra` require Daybreak Red access, but the request
  value is `daybreak_blue`. This model rejects `daybreak_red`. Daybreak Blue
  approval alone doesn't authorize reduced refusals on this model. Your project
  must also have the required access enabled.

## Send a request

This example explicitly selects Daybreak Blue with `gpt-6-sol`:

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-sol",
    "input": "Explain how to validate a security patch in a test environment.",
    "access_programs": {
      "cyber": "daybreak_blue"
    }
  }'
```


Both `access_programs` and `cyber` are optional, but neither accepts `null` in a request. An empty `access_programs` object leaves the selection unspecified.

## Understand defaults when omitted

If you omit `access_programs.cyber`, the API selects a compatible program based on the model and your organization and project access:

- **Mainline models such as `gpt-6-sol`:** Daybreak Blue treatment when your organization and project have the required access; otherwise, standard safeguards.
- **Daybreak aliases and Red models:** The matching Daybreak program. For example, `gpt-daybreak-blue-latest` selects `daybreak_blue`. The request fails if the required access is missing.
- **`gpt-6-astra`:** Reduced refusals for eligible callers with Daybreak Red access enabled for their project; otherwise, standard safeguards.

Model permissions still apply. To explicitly request standard safeguards on a compatible model, send `standard`. An explicit Daybreak selection fails if it's incompatible with the model or you don't have the required access.

## Check the response

When available, `access_programs.cyber` records the selected program. This partial response shows Daybreak Blue:

```json
{
  "model": "gpt-6-sol",
  "access_programs": {
    "cyber": "daybreak_blue"
  }
}
```


When no program is specified and the request uses standard safeguards, `access_programs` is `null`. For a `-latest` alias, inspect `model` to see which model served the request. Alias resolution can change and depends on your approved access.

## Handle errors

| HTTP status and code             | What to do                                                                                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 invalid_access_program`     | The selected model requires a different program value. Change `access_programs.cyber` to the value named in the error, then retry.                                                                                                                            |
| `400 unsupported_access_program` | Switch to a model that supports Daybreak, or set `access_programs.cyber` to `standard` to keep using this model with standard safeguards.                                                                                                                     |
| `403 access_program_not_enabled` | Check that your API key belongs to a project with the required program enabled. If organization approval is missing, request the Daybreak level named in the error. If project access is missing, ask your organization administrator to enable that program. |

Unknown fields, invalid values, and request-side `null` values fail validation. Model permissions are checked separately. A selected Daybreak program doesn't guarantee that every safety check or prompt will succeed. For more help, see [Daybreak troubleshooting](https://help.openai.com/en/articles/20001259).