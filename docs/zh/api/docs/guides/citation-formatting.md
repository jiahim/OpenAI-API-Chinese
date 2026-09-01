# Citation Formatting

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后添加 `.md` 来获取。

可靠的引用有助于建立信任，并帮助读者核实回复的准确性。本指南提供实用建议，介绍如何准备可引用的资料并指示模型有效地格式化引用，所采用的模式对 OpenAI 模型而言是熟悉的。

## 概述

引用系统包含多个部分：你需要确定哪些内容可以被引用，清晰地表示这些材料，指导模型如何引用它们，以及在结果呈现给用户之前进行验证。

本指南涵盖模型直接体验的五个核心要素：

1. 可引用的单元：定义模型允许引用的内容。
2. 素材呈现：以清晰、结构化的格式呈现源材料。
3. 引用格式：指定模型在引用时应使用的确切格式。
4. 提示指令：告诉模型何时引用以及如何正确引用。
5. 引用解析：从模型的响应中提取引用，以便后续使用。

## 选择可引用的单元

在编写提示之前，清楚地定义模型可以引用的内容。常见的选项包括：

| 可引用的最小单位  | 最佳适用场景                                              | 不足之处                          | 示例                                                                                         |
| ------------- | ---------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| 文档      | 你只需要展示答案来自哪份文档。 | 精确度不高。                 | 在你只需要说明哪份文档支持该说法时，引用整本员工手册。 |
| 块 / 片段 | 你希望在简洁性和精确性之间取得良好平衡。  | 仍然无法精确到具体行。 | 引用包含该条款的具体合同段落或检索到的片段。               |
| 行范围    | 你需要展示精确的支持文本。                | 对模型来说难度更大。     | 引用行 `L42-L47` 当用户需要核对精确段落时。                         |

一个良好的可引用单元应当具备以下特征：

- 一致性：同一来源在多次运行中应保持相同的 ID。
- 易于查看：阅读者应能通过它理解周围的上下文。
- 规模适中：足够大以表达完整含义，但足够小以保持精确。

对于大多数系统而言，块级引用是最佳默认选择。它们通常比行级引用对模型更友好，也比对文档级引用对用户更有用。

## 表示可引用的材料

模型无法引用未清晰呈现的内容。无论材料来自工具还是直接注入，都需确保其具备：

- 稳定的源 ID：例如这样的统一标识符 `file1` 或 `block1`.
- 易读文本：格式清晰的源材料。
- 元数据（可选）：URL、时间戳、标题及类似上下文。



### 示例可引用材料



```text
Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}file0{CITATION_STOP}
Title: Employee Handbook
URL: https://company.example/handbook
Updated: 2026-03-01

[L1] Employees may work remotely up to three days per week.
[L2] Additional remote days require manager approval.
[L3] Exceptions may apply for approved accommodations.
```





**Source ID 与定位符：** source ID 是一个由模型生成的稳定，
  标识符，例如 `block1`。定位符是
  UI 中精确渲染的高亮，例如 `lines L8-L13` 或 
  `Paragraph 21`。通常情况下，模型应输出 source ID，
  而由你的系统解析或渲染定位符。过早将二者混用
  往往会增加格式错误。

## 定义引用格式

你需要定义模型将生成的引用格式。使用
显式、一致且便于模型可靠复现的格式
。

下面是我们推荐的引用格式以及我们建议使用的标记。这些
引用标记是强烈推荐的，因为它们与我们模型训练时所使用的标记非常接近。如果你选择不同的标记值，请尽量保持整体的引用格式相近。
我们的模型在训练时所使用的标记非常接近。如果你选择不同的标记值，请尽量保持整体的引用格式相近。

| 片段                | 作用                                                                                        | 是否推荐                              |
| -------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `CITATION_START`     | 打开引用标记。                                                                          | `\ue200`                                 |
| 引用族      | 标识引用类型。请使用 `cite` 以覆盖所有受支持的来源。                                 | `cite`                                   |
| `CITATION_DELIMITER` | 用于分隔标记内的各个字段。                                                                 | `\ue202`                                 |
| 来源 ID            | 标识被引用的单元。 `turn#` 是轮次编号。 `item#` 是具体的文件、块或 URL。 | `turn0file1`, `turn0block1`, `turn0url1` |
| 定位符（可选）   | 将引用精确收窄到特定区间。                                                             | `L8-L13`                                 |
| `CITATION_STOP`      | 关闭引用标记。                                                                         | `\ue201`                                 |

对于工具调用， `turnN` 每次工具调用递增一次，而不是
  每个单独结果递增一次。在单次调用中，来源通过
  后缀区分，例如 `file0`, `file1`、
  等。在单次响应系统中，所有引用仅在模型在 
  `turn0...` 回答之前恰好调用一次工具时
  才会出现。如果模型进行了多次工具调用，你可能会看到形如
  的引用 `turn0fileX`, `turn1fileX`，等等。

### 模板

```text
{CITATION_START}<citation_family>{CITATION_DELIMITER}<source_id>{CITATION_DELIMITER}<locator>{CITATION_STOP}
```

### 示例

```text
{CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_DELIMITER}L8-L13{CITATION_STOP}
```

如果你的系统不使用定位符，请省略该字段：

```text
{CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_STOP}
```

## 编写有效的引用说明

为保持最高的准确度，请采用熟悉的引用格式。自定义或不熟悉的格式会增加模型的认知负担，从而导致引用错误，尤其是在以下场景中：

- 低推理投入，此时模型在格式错误后可用于恢复的预算较少。
- 高复杂度任务，此时大部分推理预算都花在解决任务本身上，而不是清理引文语法。

下面，我们推荐一种引用格式，它接近模型熟悉的模式。你可以原样使用，也可以根据自己的系统进行调整。

如果需要自定义提示，请定义：

- 确切的书签语法。
- 引用应放在何处。
- 何时需要引用，何时无需引用。
- 如何引用多个支持材料。
- 哪些格式被禁止使用。
- 缺少支持材料时的处理方法。



### 推荐的提示说明



使用以下格式明确指示模型：

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

如果你还希望模型输出定位符，例如行号（`L1-L22`），可以在提示中这样指定：

```text
You *must* cite any results you use from this tool using the:
`\ue200cite\ue202turn0file0\ue202L8-L13\ue201` format ONLY if the item has a corresponding citation marker.
```

- 不要尝试引用没有对应引用标记的内容,因为它们不应被引用。
- 你必须在引用中包含行号范围。







### 可选的提升检索质量的指令



当你需要更高质量的接入表现时，通常值得加入以下规则。请根据你的用例需求调整本节内容。

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





## 解析引用

一旦模型输出引用标注，你就需要从响应文本中提取它们
，以便解析来源 ID、渲染链接，或在向用户展示答案之前去除原始标记。
showing the answer to users.

下面的辅助函数可以直接复制到你的应用中使用。它
会解析单来源引用、多来源引用以及可选的行号范围
定位符，同时保留原始文本中的字符偏移量。

本示例仅支持行号定位符，如果你的系统使用了不同的定位符格式，
请进行相应调整。



### 后处理器示例


引用解析辅助函数

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






如果你的源 ID 使用不同的格式，请更新 `SOURCE_ID_RE` 以匹配你的
系统。

## 示例

以下示例展示两种常见的引用模式：

- 检索到的工具上下文，其中工具会返回可引用的材料和 ID。
- 注入的上下文，其中你直接在提示中提供可引用的块。

### 为检索到的工具上下文格式化引用

当模型通过工具检索上下文并在回答中引用该检索到的上下文时，请使用此模式。

#### 定义可引用的单元

你应根据用例所需的精度来选择可引用的单元。下面的示例展示了几种可能的工具输出。

下面的示例展示了几种推荐的工具输出格式。底层工具可能因应用而异，但最重要的是，输出应以清晰、稳定的结构呈现，如这些示例所示。



##### 行级示例



以下是工具调用输出的一个示例：

```text
Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}
[L1] The service agreement states that termination for convenience requires thirty (30) days’ written notice, unless superseded by a customer-specific addendum.
[L2] In practice, renewal terms auto-extend for successive one-year periods when no written non-renewal notice is received before the deadline.
[L3] Appendix B further clarifies that pricing exceptions must be approved in writing by both Finance and the account owner.

Citation Marker: {CITATION_START}cite{CITATION_DELIMITER}turn0file1{CITATION_STOP}
...
```

此处， `turn0file0` 是稳定的源 ID。行号就是定位符。







##### 块级示例



以下是工具调用输出的一个示例：

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

如果你想要块级引用而不是行级引用，推荐的做法是为每个检索到的块设置一个稳定的 source ID，并仍然使用相同的两字段 cite 形式进行引用，例如 `{CITATION_START}cite{CITATION_DELIMITER}turn0file0{CITATION_STOP}`，而不是另造一套完全不同的引用体系。





#### 编写提示指令

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

示例输出：

```text
The on-call handoff process is documented in the weekly support sync notes. \ue200cite\ue202turn0file0\ue202L8-L13\ue201
```

### 为注入的上下文格式化引用

当你在请求之前预先检索或准备上下文，并将其直接注入到提示中时，可以使用这种模式。

#### 定义可引用的单元

对于注入的上下文，一种常见的做法是使用具有稳定引用 ID 的显式标签来包裹源片段。

```xml


The service agreement states that termination for convenience requires thirty (30) days’ written notice, unless superseded by a customer-specific addendum.
In practice, renewal terms auto-extend for successive one-year periods when no written non-renewal notice is received before the deadline.
Appendix B further clarifies that pricing exceptions must be approved in writing by both Finance and the account owner.





Syllabus


...
```

这使得可引用的单元更加明确，便于模型引用。

#### 编写提示指令

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

示例输出：

```text
The Court held that the District Court lacked personal jurisdiction over the petitioner. \ue200cite\ue202block5\ue201
```

**注意：** OpenAI 托管的工具（例如网页搜索）会提供
  自动的内联引用。如果你希望改用托管工具，请参阅 
  [工具概览](https://developers.openai.com/api/docs/guides/tools), 
  [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search)、 
  [文件搜索指南](https://developers.openai.com/api/docs/guides/tools-file-search).