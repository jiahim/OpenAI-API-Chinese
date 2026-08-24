# CSAM guidance

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

{/* This guide necessarily discusses sexual abuse, so these profanity heuristics don't apply. */}
{/* vale alex.ProfanityMaybe = NO */}
{/* vale alex.ProfanityUnlikely = NO */}
{/* "Potentially" preserves uncertainty in classifier and policy language. */}
{/* vale Microsoft.Adverbs = NO */}



    {"OpenAI developed this resource with expert input from the "}
    {", "}
    {", the "}
    {", and the "}
    {"."}
  


## Build with child safety in mind

OpenAI has clear child safety expectations for developers:
You are responsible for ensuring that your users use OpenAI services in
compliance with applicable laws, including laws that criminalize child sexual
abuse and exploitation. Never use OpenAI services to exploit, endanger, or
sexualize anyone under the age of 18. See the OpenAI .

Online child sexual exploitation and abuse affects a range of products and
services, including those that don't target children. OpenAI wants to help
developers understand what actions to consider taking to address this abuse.

From the earliest possible stage, consider how people could misuse your product.
Start early so child safety safeguards can scale with you, rather than becoming
something you try to retrofit into an already complex product or system.
Developer teams and organizations of all sizes should assess how people could
misuse their products for a range of harms, including child sexual abuse material
(CSAM), grooming, sexual extortion, the sexualization of children, livestreamed
abuse, and trafficking—especially if their products support messaging, content
uploads, image editing, livestreaming, discovery, or payments.

This resource focuses on CSAM and offers developers practical guidance for
protecting children.

## Where to start

It can be difficult to know where to start. The right solutions and
implementation paths depend on your organization's size, maturity, and available
resources.

The following checklist is a good starting point for addressing CSAM. The
important thing is to begin addressing the risk: Don't wait until you have every
tool or step complete before taking action.

## Prevent

Set clear rules for your product or service, and establish mechanisms for
hearing from your users about their experiences.

- **Set clear rules.** Prohibit child sexual exploitation and abuse in your terms
  of service, acceptable use policy, or community guidelines. Learn more from
  or the Tech Coalition's free
  for expert guidance and practical tools, including a resource on external
  standards that prohibit online child sexual exploitation and abuse.
- **Make reporting available to your users.** Give users a visible way to flag
  potentially harmful content or behavior, and route those concerns to a monitored queue
  or location with enough information to make policy decisions. For more
  guidance, see the Australian .
- **Track uploads and users through safety identifiers.** In your product or service,
  associate every upload with a user. Sending
  [safety identifiers with supported OpenAI
  requests](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
  can help OpenAI monitor and detect abuse. This can help OpenAI provide your team with more
  actionable feedback if OpenAI detects policy violations in your
  product or service. Safety identifiers can also help your team respond to abuse
  faster. They create a stable way to trace activity back to an individual end
  user and reduce the chance that one user's misuse disrupts access for your
  broader organization. Use a unique string to represent each user. To protect
  privacy, hash email addresses or usernames before sending them to avoid
  disclosing personally identifiable information. The direct Images API uses a
  different parameter for this purpose: Send the same stable identifier as
  `user` for [image
  generation](https://developers.openai.com/api/reference/resources/images/methods/generate) and [image
  edits](https://developers.openai.com/api/reference/resources/images/methods/edit).

When you are ready to do more, consider other prevention measures:

- Add prevention-focused blocking or refusals for CSAM-related keywords
  or URLs. Learn more from the .
- Provide warnings or messages to users who are attempting to engage in
  CSAM-related behavior. Learn more from .
- If your service is available to children and a user tells you that sexual
  images or videos of them are on your platform, direct them to support services
  such as the IWF and NSPCC's program, which
  enables children in the UK to report images and videos for removal or
  blocking, or NCMEC's service.
- If you become aware that a child is facing immediate or imminent harm:
  - Refer the case to emergency services, such as local law enforcement.
  - Give the child information on how to contact emergency services.

## Detect

Identify potentially violative content or conduct for review and action.

Use accessible CSAM detection tools:

- **Perceptual hash matching.** If your product supports uploading, storing, or
  processing visual media, consider implementing perceptual hash matching. This
  technology creates a digital fingerprint of an image or video and compares it
  with fingerprints of known CSAM, helping to identify known
  material even after someone resizes, compresses, or otherwise modifies a file.
  You need access to both hash-matching technology, such as PhotoDNA, and CSAM
  hash lists, which are repositories of known CSAM hashes. Not all services
  provide both.
  - **Recommended hash-matching technologies:**
    - offers purpose-built detection for known CSAM in images and videos.
    - The Tech Coalition offers eligible companies sublicenses to through its free
      .
    - .
    - YouTube's technology
      provides hash matching to identify known CSAM in videos.
  - **Recommended CSAM hash lists:**
    - NCMEC offers lists of known CSAM, exploitative content, and generative AI
      CSAM. Contact its [Electronic Service Provider team](mailto:espteam@ncmec.org).
    - IWF offers , a
      hash-matching service for eligible small businesses and startups that
      requires minimal technical expertise to integrate.
- **Novel CSAM detection classifiers.** These tools can detect unknown or unseen
  CSAM.
  - offers
    classifiers intended to identify potentially novel CSAM in images and
    videos, as well as relevant text-based exploitation signals.
  - Google's uses AI to
    classify images and videos and assign their review priority. The higher the
    priority assigned by the classifier, the more likely the media contains
    CSAM.
- **Bad actor detection and enforcement.** Using available identifiers and
  information—such as usernames, email addresses, and device IDs—consider
  permanently banning or otherwise disrupting accounts that people have used to
  violate, or attempt to violate, CSAM policies. Watch for repeat offenders who
  attempt to circumvent enforcement.

## Respond and report

Make sure your product and team can take appropriate action when you become
aware of CSAM on your service.

- **Register and prepare to report CSAM to the authorities.** or your . Consider what makes a report to NCMEC
  actionable and how it can support child safeguarding. Include as much
  information as possible to help route the report to the appropriate
  jurisdiction and identify the suspect. NCMEC's includes IP addresses, device IDs, and other data.

Local laws and reporting obligations may vary by jurisdiction.

- **Keep usable records and identifiers.** When you make a report, maintain
  documentation of the incident and any associated data that could help identify
  violative actors, so you can respond to requests from law enforcement.
- **Write a response playbook.** Define who reviews reports, how to escalate
  urgent cases internally and externally, what actions to take against users
  responsible for violations, and who can make those decisions. This can help you establish enforcement operations.
- Consider establishing a network of trusted expert reporters, including
  organizations such as IWF and other hotlines, that can use their expertise to
  flag CSAM cases for you.
- **Train and support the people involved.** It's important for humans to be in
  the loop. Make sure reviewers, support teams, and on-call staff understand your
  policy, escalation path, and the limits of any automated system.
- **Use the tools you need to moderate content or respond to abuse.** Other
  tools can help you address child safety risks and harms:
  - The [Moderation API](https://developers.openai.com/api/docs/guides/moderation) detects potentially harmful
    content in text and images. Learn more about the
    [`omni-moderation-latest`](https://developers.openai.com/api/docs/models/omni-moderation-latest) model.
    This isn't a substitute for dedicated CSAM detection. It still includes a
    `sexual/minors` category covering sexual content involving people
    under 18; this category is text-only. Use results to:
    - Block or filter content.
    - Send content for human review.
    - Intervene on an account.
    - Add friction to repeated misuse and apply product- or service-specific
      enforcement.
  - Consider other moderation tools that could help. For example, is an open-source review console for
    triaging potential policy violations in text, multimedia, and profiles. It
    supports human and automated review, takes a wellness-oriented approach for
    reviewers, and enables end-to-end moderation workflows, including
    NCMEC CyberTipline reporting.

When you are ready to do more, consider other response and reporting
measures:

- **Support the people involved in tackling CSAM.** Organizations should invest
  in training, support, and a well-being program for CSAM reviewers. Read
  .
- **Get specialist support.** You don't need a large trust and safety team to
  start. The Tech Coalition offers ways for companies to build stronger child
  safety systems:
  - is a free capacity-building program designed especially for startups and
    small and midsize platforms, while remaining open to companies of all sizes.
    It provides practical resources, guidance, and support to help companies
    establish strong child safety foundations. Eligible companies can also apply
    for a PhotoDNA sublicense through Pathways.
  - provides tailored consulting and implementation support for companies
    seeking more hands-on help to strengthen their child safety programs and
    respond to specific risks.
  - enables companies to take part in the industry's global collaborative
    response to online child sexual exploitation and abuse, engage with peers,
    share expertise, and contribute to collective action. Contact the [Tech
    Coalition team](mailto:md@technologycoalition.org) for an initial
    consultation.
  - Developers can use the Tech Coalition's for further guidance.

### Scale safeguards

The right controls and safeguards depend on the product, its development stage
and maturity, its users and features, the regions in which it operates, and its
available resources.

Products with greater risk exposure—for example, those that support
livestreaming, image generation or editing, file storage, or private
connections—should consider implementing and strengthening safeguards such as:

- Product risk assessments before launch and whenever high-risk features change.
  See .
- Layered detection appropriate to the service, which may include hash matching,
  image or video classifiers, text signals, keyword detection, and URL blocking.
- Human review of high-confidence or high-severity signals, using tools that
  protect reviewer well-being and limit unnecessary exposure to harmful
  material.
- Rate limits, account controls, and abuse monitoring that make repeat misuse
  harder.
- Regular testing and measurement so you can find gaps, track outcomes, and
  improve your controls.

These recommendations are a starting point, not legal advice or a universal
standard of care. Adapt them to your service, risk profile, and applicable law.