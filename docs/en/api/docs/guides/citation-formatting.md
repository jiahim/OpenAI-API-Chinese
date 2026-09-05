# Citation Formatting

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Reliable citations build trust and help readers verify the accuracy of responses. This guide provides practical guidance on how to prepare citable material and instruct the model to format citations effectively, using patterns that are familiar to OpenAI models.

## Overview

A citation system has many parts: you decide what can be cited, represent that material clearly, instruct the model how to cite it, and validate the result before it renders to the user.

This guide covers five core elements experienced directly by the model:

1. Citable units: Define what the model is allowed to cite.
2. Material representation: Present the source material in a clear, structured format.
3. Citation format: Specify the exact format the model should use for citations.
4. Prompt instructions: Tell the model when to cite and how to do it correctly.
5. Citation parsing: Extract the citations from the model’s response for downstream use.

## Choose citable units

Before writing prompts, clearly define what the model can cite. Common options include:

| Citable unit  | Best used for                                              | Downside                          | Example                                                                                         |
| ------------- | ---------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| Document      | You only need to show which document the answer came from. | Not very precise.                 | Cite the entire employee handbook when you only need to show which document supports the claim. |
| Block / chunk | You want a good balance between simplicity and precision.  | Still not exact down to the line. | Cite the specific contract paragraph or retrieved chunk that contains the clause.               |
| Line range    | You need to show the exact supporting text.                | More difficult for the model.     | Cite lines `L42-L47` when the user needs to verify the precise passage.                         |

A good citable unit should be:

- Consistent: the same source should keep the same ID across runs.
- Easy to inspect: a person should be able to read it and understand the surrounding context.
- The right size: large enough to make sense, but small enough to stay precise.

For most systems, block-level citations are the best default. They are usually easier for the model than line-level citations and more useful to users than document-level citations.

## Represent citable material

The model cannot cite material that has not been presented clearly. Whether material comes from a tool or is injected directly, ensure it has:

- Stable Source ID: Consistent identifier like `file1` or `block1`.
- Readable Text: Clearly formatted source material.
- Metadata (optional): URLs, timestamps, titles, and similar context.



### Example citable material



```text
Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}file0{CITATION_STOP}
Title: Employee Handbook
URL: https://company.example/handbook
Updated: 2026-03-01

[L1] Employees may work remotely up to three days per week.
[L2] Additional remote days require manager approval.
[L3] Exceptions may apply for approved accommodations.
```





**Source IDs vs. locators:** A source ID is a stable,
  model-generated identifier such as `block1`. A locator is the
  precise UI-rendered highlight, such as `lines L8-L13` or 
  `Paragraph 21`. In general, the model should emit the source ID,
  while your system resolves or renders the locator. Mixing the two too early
  tends to increase formatting errors.

## Define citation format

You need to define the citation format that the model will generate. Use a
format that is explicit, consistent, and easy for the model to reproduce
reliably.

Below is our recommended citation format and the markers we recommend. These
citation markers are highly recommended because they closely match the markers
our models are trained on. If you choose different marker values, keep the overall citation format as similar as possible.

| Piece                | What it does                                                                                        | Recommended                              |
| -------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `CITATION_START`     | Opens the citation marker.                                                                          | `\ue200`                                 |
| Citation family      | Identifies the citation type. Use `cite` for all supported sources.                                 | `cite`                                   |
| `CITATION_DELIMITER` | Separates fields inside the marker.                                                                 | `\ue202`                                 |
| Source ID            | Identifies the cited unit. `turn#` is the turn number. `item#` is the specific file, block, or URL. | `turn0file1`, `turn0block1`, `turn0url1` |
| Locator (optional)   | Narrows the citation to a precise span.                                                             | `L8-L13`                                 |
| `CITATION_STOP`      | Closes the citation marker.                                                                         | `\ue201`                                 |

For tool calls, `turnN` increments once per tool invocation, not
  once per individual result. Within a single invocation, sources are
  distinguished by suffixes such as `file0`, `file1`, and
  so on. In a single-response system, all references will be 
  `turn0...` only if the model makes exactly one tool call before
  answering. If it makes multiple tool calls, you may instead see references
  like `turn0fileX`, `turn1fileX`, and so on.

### Template

```text
{CITATION_START}<citation_family>{CITATION_DELIMITER}<source_id>{CITATION_DELIMITER}<locator>{CITATION_STOP}
```

### Example

```text
{CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_DELIMITER}L8-L13{CITATION_STOP}
```

If your system does not use locators, omit that field:

```text
{CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_STOP}
```

## Write effective citation instructions

To maintain maximum accuracy, use familiar citation patterns. Custom or unfamiliar formats increase cognitive load on the model, leading to citation errors, especially in:

- low reasoning effort, where the model has less budget to recover from formatting mistakes.
- high-complexity tasks, where most of the reasoning budget is spent on solving the task itself rather than cleaning up citation syntax.

Below, we recommend a citation format that is close to patterns the model is familiar with. You can use it as-is or adapt it to fit your own system.

If you want to define your own prompt, define:

- the exact marker syntax.
- where citations go.
- when to cite and when not to cite.
- how to cite multiple supports.
- what formats are forbidden.
- what to do when support is missing.



### Recommended prompt instructions



Clearly instruct the model using the following format:

```md
## Citations

Results are returned by "tool_1". Each message from `tool_1` is called a "source" and identified by its reference ID, which is the first occurrence of 【turn\d+\w+\d+】 (e.g. 【turn2file1】). In this example, the string "turn2file1" would be the source reference ID.

Citations are references to `tool_1` sources. Citations may be used to refer to either a single source or multiple sources.

Citations to a single source must be written as {CITATION_START}cite{CITATION_DELIMITER}turn\d+\w+\d+{CITATION_STOP} (e.g. {CITATION_START}cite{CITATION_DELIMITER}turn2file5{CITATION_STOP}).

Citations to multiple sources must be written as {CITATION_START}cite{CITATION_DELIMITER}turn\d+\w+\d+{CITATION_DELIMITER}turn\d+\w+\d+{CITATION_DELIMITER}...{CITATION_STOP} (e.g. {CITATION_START}cite{CITATION_DELIMITER}turn2file5{CITATION_DELIMITER}turn2file1{CITATION_DELIMITER}...{CITATION_STOP}).

Citations must not be placed inside markdown bold, italics, or code fences, as they will not display correctly. Instead, place the citations outside the markdown block. Citations outside code fences may not be placed on the same line as the end of the code fence.

You must NOT write reference ID turn\d+\w+\d+ verbatim in the response text without putting them between {CITATION_START}...{CITATION_STOP}.

- Place citations at the end of the paragraph, or inline if the paragraph is long, unless the user requests specific citation placement.
- Citations must be placed after punctuation.
- Citations must not be all grouped together at the end of the response.
- Citations must not be put in a line or paragraph with nothing else but the citations themselves.
```

If you want the model to also output locators such as lines (`L1-L22`), specify it in the prompt like this:

```text
You *must* cite any results you use from this tool using the:
`\ue200cite\ue202turn0file0\ue202L8-L13\ue201` format ONLY if the item has a corresponding citation marker.
```

- Do not attempt to cite items without a corresponding citation marker, as they are not meant to be cited.
- You MUST include line ranges in your citations.







### Optional instructions for higher-quality grounding



The following rules are often worth including when you need higher-quality grounding behavior. Adapt this section based on your use case requirements.

```xml
<extra_considerations_for_citations>
- **Relevance:** Include only search results and citations that support the cited response text. Irrelevant sources permanently degrade user trust.
- **Diversity:** You must base your answer on sources from diverse domains, and cite accordingly.
- **Trustworthiness:** To produce a credible response, you must rely on high quality domains, and ignore information from less reputable domains unless they are the only source.
- **Accurate Representation:** Each citation must accurately reflect the source content. Selective interpretation of the source content is not allowed.

Remember, the quality of a domain/source depends on the context.
- When multiple viewpoints exist, cite sources covering the spectrum of opinions to ensure balance and comprehensiveness.
- When reliable sources disagree, cite at least one high-quality source for each major viewpoint.
- Ensure more than half of citations come from widely recognized authoritative outlets on the topic.
- For debated topics, cite at least one reliable source representing each major viewpoint.
- Do not ignore the content of a relevant source because it is low quality.
</extra_considerations_for_citations>
```





## Parse citations

Once the model emits citations, you need to extract them from the response text
so you can resolve source IDs, render links, or remove the raw markers before
showing the answer to users.

The helper below is designed to be copied directly into your application. It
parses single-source citations, multi-source citations, and optional line-range
locators while preserving character offsets in the original text.

This example supports line locators only and should be adapted if your system
uses a different locator format.



### Post-processor examples


Citation parsing helpers

```javascript
const CITATION_START = "\uE200";
const CITATION_DELIMITER = "\uE202";
const CITATION_STOP = "\uE201";

const SOURCE_ID_RE = /^[A-Za-z0-9_-]+$/;
const LINE_LOCATOR_RE = /^L\d+(?:-L\d+)?$/;

/**
 * @typedef {Object} Citation
 * @property {string} raw
 * @property {string} family
 * @property {string[]} source_ids
 * @property {string | null} locator
 * @property {number} start
 * @property {number} end
 */

/**
 * Extract citations such as:
 *
 *   {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}
 *   {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_DELIMITER}L8-L13{CITATION_STOP}
 *   {CITATION_START}cite{CITATION_DELIMITER}turn0search0{CITATION_DELIMITER}turn1news2{CITATION_STOP}
 *
 * @param {string} text
 * @param {{ families?: string[] }} [options]
 * @returns {Citation[]}
 */
function extractCitations(text, { families = ["cite"] } = {}) {
  if (families.length === 0) {
    return [];
  }

  const familyPattern = families
    .map((family) => family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const tokenRe = new RegExp(
    `${CITATION_START}(?<family>${familyPattern})${CITATION_DELIMITER}(?<body>[\\s\\S]*?)${CITATION_STOP}`,
    "g"
  );

  /** @type {Citation[]} */
  const citations = [];

  for (const match of text.matchAll(tokenRe)) {
    const body = match.groups?.body ?? "";
    const parts = body
      .split(CITATION_DELIMITER)
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      continue;
    }

    let locator = null;
    const lastPart = parts[parts.length - 1];
    if (LINE_LOCATOR_RE.test(lastPart)) {
      locator = parts.pop() ?? null;
    }

    if (parts.length === 0 || parts.some((part) => !SOURCE_ID_RE.test(part))) {
      continue;
    }

    citations.push({
      raw: match[0],
      family: match.groups?.family ?? "",
      source_ids: parts,
      locator,
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    });
  }

  return citations;
}

/**
 * @param {string} text
 * @param {Iterable<Citation>} citations
 * @returns {string}
 */
function stripCitations(text, citations) {
  let cleanText = text;
  const sortedCitations = Array.from(citations).sort(
    (left, right) => right.start - left.start
  );

  for (const citation of sortedCitations) {
    cleanText =
      cleanText.slice(0, citation.start) + cleanText.slice(citation.end);
  }

  return cleanText;
}
```

```python
import re
from typing import Iterable, TypedDict

CITATION_START = "\ue200"
CITATION_DELIMITER = "\ue202"
CITATION_STOP = "\ue201"

SOURCE_ID_RE = re.compile(r"^[A-Za-z0-9_-]+$")
LINE_LOCATOR_RE = re.compile(r"^L\d+(?:-L\d+)?$")


class Citation(TypedDict):
    raw: str
    family: str
    source_ids: list[str]
    locator: str | None
    start: int
    end: int


def extract_citations(
    text: str,
    *,
    families: tuple[str, ...] = ("cite",),
) -> list[Citation]:
    """
    Extract citations such as:

      {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}
      {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_DELIMITER}L8-L13{CITATION_STOP}
      {CITATION_START}cite{CITATION_DELIMITER}turn0search0{CITATION_DELIMITER}turn1news2{CITATION_STOP}
    """
    if not families:
        return []

    family_pattern = "|".join(re.escape(family) for family in families)
    token_re = re.compile(
        rf"{re.escape(CITATION_START)}"
        rf"(?P<family>{family_pattern})"
        rf"{re.escape(CITATION_DELIMITER)}"
        rf"(?P<body>.*?)"
        rf"{re.escape(CITATION_STOP)}",
        re.DOTALL,
    )

    citations: list[Citation] = []

    for match in token_re.finditer(text):
        parts = [part.strip() for part in match.group("body").split(CITATION_DELIMITER)]
        parts = [part for part in parts if part]

        if not parts:
            continue

        locator = None
        if LINE_LOCATOR_RE.fullmatch(parts[-1]):
            locator = parts.pop()

        if not parts or any(not SOURCE_ID_RE.fullmatch(part) for part in parts):
            continue

        citations.append(
            {
                "raw": match.group(0),
                "family": match.group("family"),
                "source_ids": parts,
                "locator": locator,
                "start": match.start(),
                "end": match.end(),
            }
        )

    return citations


def strip_citations(text: str, citations: Iterable[Citation]) -> str:
    """
    Remove raw citation markers from text using offsets returned by
    extract_citations().
    """
    clean_text = text

    for citation in sorted(citations, key=lambda item: item["start"], reverse=True):
        clean_text = clean_text[: citation["start"]] + clean_text[citation["end"] :]

    return clean_text
```

```ruby
CITATION_START = "\u{E200}"
CITATION_DELIMITER = "\u{E202}"
CITATION_STOP = "\u{E201}"

SOURCE_ID_RE = /\A[A-Za-z0-9_-]+\z/
LINE_LOCATOR_RE = /\AL\d+(?:-L\d+)?\z/

def extract_citations(text, families: ["cite"])
  return [] if families.empty?

  family_pattern = families.map { |family| Regexp.escape(family) }.join("|")
  token_re = Regexp.new(
    "#{Regexp.escape(CITATION_START)}" \
      "(?<family>#{family_pattern})" \
      "#{Regexp.escape(CITATION_DELIMITER)}" \
      "(?<body>.*?)" \
      "#{Regexp.escape(CITATION_STOP)}",
    Regexp::MULTILINE
  )

  text.enum_for(:scan, token_re).map do
    match = Regexp.last_match
    next unless match

    body = match[:body]
    next unless body

    parts = body.split(CITATION_DELIMITER).map(&:strip).reject(&:empty?)
    locator = parts.pop if parts.last&.match?(LINE_LOCATOR_RE)
    next if parts.empty? || parts.any? { |part| !part.match?(SOURCE_ID_RE) }

    {
      raw: match[0],
      family: match[:family],
      source_ids: parts,
      locator: locator,
      start: match.begin(0),
      end: match.end(0)
    }
  end.compact
end

def strip_citations(text, citations)
  citations.sort_by { |citation| -citation.fetch(:start) }.each_with_object(text.dup) do |citation, clean|
    clean[citation.fetch(:start)...citation.fetch(:end)] = ""
  end
end
```






If your source IDs use a different shape, update `SOURCE_ID_RE` to match your
system.

## Examples

The examples below show two common citation patterns:

- Retrieved tool context, where your tool returns citable material and IDs.
- Injected context, where you provide citable blocks directly in the prompt.

### Format citations for retrieved tool context

Use this pattern when the model retrieves context through a tool and cites that retrieved context in its answer.

#### Define citable units

You should choose the citable units based on the precision required for your use case. The examples below show a few possible tool outputs.

The examples below show a few recommended tool output formats. The underlying tool may vary by application, but what matters most is that the output is presented in a clear, stable structure like these examples.



##### Line-level example



The following is an example of the tool call output:

```text
Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}
[L1] The service agreement states that termination for convenience requires thirty (30) days’ written notice, unless superseded by a customer-specific addendum.
[L2] In practice, renewal terms auto-extend for successive one-year periods when no written non-renewal notice is received before the deadline.
[L3] Appendix B further clarifies that pricing exceptions must be approved in writing by both Finance and the account owner.

Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_STOP}
...
```

Here, `turn0file0` is the stable source ID. The line numbers are the locators.







##### Block-level example



The following is an example of the tool call output:

```text
Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}
[Block1]
The service agreement states that termination for convenience requires thirty (30) days’ written notice, unless superseded by a customer-specific addendum.
In practice, renewal terms auto-extend for successive one-year periods when no written non-renewal notice is received before the deadline.
Appendix B further clarifies that pricing exceptions must be approved in writing by both Finance and the account owner.

Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_STOP}
[Block2]
...
```

If you want block-level citations instead of line-level citations, the recommended option is to make each retrieved block its own stable source ID and still cite it with the same two-field cite shape, for example `{CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}`, rather than inventing a completely different citation family.





#### Write prompt instructions

```md
## Citations

Results are returned by "tool_1". Each message from `tool_1` is called a "source" and identified by its reference ID, which is the first occurrence of `turn\\d+file\\d+` (for example, `turn0file0` or `turn2file1`). In this example, the string `turn0file0` would be the source reference ID.

Citations are references to `tool_1` sources. Citations may be used to refer to either a single source or multiple sources.

A citation to a single source must be written as:
{CITATION_START}cite{CITATION_DELIMITER}turn\d+file\d+{CITATION_STOP}

If line-level citations are supported, a citation to a specific line range must be written as:
{CITATION_START}cite{CITATION_DELIMITER}turn\d+file\d+{CITATION_DELIMITER}L\d+-L\d+{CITATION_STOP}

Citations to multiple sources must be written by emitting multiple citation markers, one for each supporting source.

You must NOT write reference IDs like `turn0file0` verbatim in the response text without putting them between {CITATION_START}...{CITATION_STOP}.

- Place citations at the end of the supported sentence, or inline if the sentence is long and contains multiple supported clauses.
- Citations must be placed after punctuation.
- Cite only retrieved sources that directly support the cited text.
- Never invent source IDs, line ranges, or block locators that were not returned by the tool.
- If multiple retrieved sources materially support a proposition, cite all of them.
- If the retrieved sources disagree, cite the conflicting sources and describe the disagreement accurately.
```

Example output:

```text
The on-call handoff process is documented in the weekly support sync notes. \ue200cite\ue202turn0file0\ue202L8-L13\ue201
```

### Format citations for injected context

Use this pattern when you retrieve or prepare the context ahead of time and inject it directly into the prompt.

#### Define citable units

For injected context, a common pattern is to wrap source segments in explicit tags with stable reference IDs.

```xml


The service agreement states that termination for convenience requires thirty (30) days’ written notice, unless superseded by a customer-specific addendum.
In practice, renewal terms auto-extend for successive one-year periods when no written non-renewal notice is received before the deadline.
Appendix B further clarifies that pricing exceptions must be approved in writing by both Finance and the account owner.





Syllabus


...
```

This makes the citable unit explicit and easy for the model to reference.

#### Write prompt instructions

```md
## Citations

Supporting context is provided directly in the prompt as citable units. Each citable unit is identified by the value of its `id` attribute in the first occurrence of a tag such as `

...

`. In this example, `block5` would be the source reference ID.

Because this pattern does not invoke tools, there is no tool turn counter to increment. That means you do not need to use a `turn#` prefix for the citation marker. You can keep IDs in a `turn0block5` style if that matches the rest of your system, or use plain IDs like `block5` as shown here. The key requirement is that the citation marker matches the injected context ID exactly and consistently.

Citations are references to these provided citable units. Citations may be used to refer to either a single source or multiple sources.

A citation to a single source must be written as:
{CITATION_START}cite{CITATION_DELIMITER}<block_id>{CITATION_STOP}

For example:
{CITATION_START}cite{CITATION_DELIMITER}block5{CITATION_STOP}

Citations to multiple sources must be written by emitting multiple citation markers, one for each supporting block.

You must NOT write block IDs verbatim in the response text without putting them between {CITATION_START}...{CITATION_STOP}.

- Place citations at the end of the supported sentence, or inline if the sentence is long and contains multiple supported clauses.
- Citations must be placed after punctuation.
- Cite only blocks that appear in the provided context.
- Never invent new block IDs.
- Never cite outside knowledge or outside authorities.
- If multiple blocks materially support a proposition, cite all of them.
- If the provided blocks conflict, cite the conflicting blocks and describe the conflict accurately.
```

Example output:

```text
The Court held that the District Court lacked personal jurisdiction over the petitioner. \ue200cite\ue202block5\ue201
```

**Note:** OpenAI-hosted tools such as web search provide
  automatic inline citations. If you want to use hosted tools instead, see the 
  [tools overview](https://developers.openai.com/api/docs/guides/tools), 
  [web search guide](https://developers.openai.com/api/docs/guides/tools-web-search), and 
  [file search guide](https://developers.openai.com/api/docs/guides/tools-file-search).