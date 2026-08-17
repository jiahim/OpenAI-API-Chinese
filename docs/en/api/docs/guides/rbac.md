# Manage permissions in the OpenAI platform

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Role-based access control (RBAC) lets you decide who can do what across your organization and projects—both through the API and in the Dashboard. The same permissions govern both surfaces: if someone can call an endpoint (for example, `/v1/chat/completions`), they can use the equivalent Dashboard page, and missing permissions disable related UI (such as the **Upload** button in Playground). With RBAC you can:

- Group users and assign permissions at scale
- Create custom roles with the exact permissions you need
- Scope access at the organization or project level
- Enforce consistent permissions in both the Dashboard and API

## Key concepts

- **Organization**: Your top-level account. Organization roles can grant access across all projects.
- **Project**: A workspace for keys, files, and resources. Project roles grant access within only that project.
- **Groups**: Collections of users you can assign roles to. Groups can be synced from your identity provider (via SCIM) to keep membership up to date automatically.
- **Roles**: Bundles of permissions (like Models Request or Files Write). Roles can be created for the organization under **Organization settings**, or created for a specific project under that project's settings. Once created, organization or project roles can be assigned to users or groups. Users can have multiple roles, and their access is the union of those roles.
- **Permissions**: The specific actions a role allows (e.g., make request to models, read files, write files, manage keys).

### Permissions

The table below shows the available permissions, which preset roles include them, and whether they can be configured for custom roles.




| Area                   | What it allows                                                                       | Org owner permissions   | Org reader permissions | Project owner permissions | Project member permissions | Project viewer permissions | Custom role eligible |
| ---------------------- | ------------------------------------------------------------------------------------ | ----------------------- | ---------------------- | ------------------------- | -------------------------- | -------------------------- | -------------------- |
| List models            | List models this organization has access to                                          | `Read`                  | `Read`                 | `Read`                    | `Read`                     | `Read`                     | ✓                    |
| Groups                 | View and manage groups                                                               | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| Roles                  | View and manage roles                                                                | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| Organization Admin     | Manage organization users, projects, invites, admin API keys, and rate limits        | `Read`, `Write`         |                        |                           |                            |                            |                      |
| Usage                  | View usage dashboard and export                                                      | `Read`                  |                        |                           |                            |                            | ✓                    |
| External Keys          | View and manage keys for Enterprise Key Management                                   | `Read`, `Write`         |                        |                           |                            |                            |                      |
| IP allowlist           | View and manage IP allowlist                                                         | `Read`, `Write`         |                        |                           |                            |                            |                      |
| mTLS                   | View and manage mutual TLS settings                                                  | `Read`, `Write`         |                        |                           |                            |                            |                      |
| OIDC                   | View and manage OIDC configuration                                                   | `Read`, `Write`         |                        |                           |                            |                            |                      |
| Model capabilities     | Make requests to chat completions, audio, embeddings, and images                     | `Request`               | `Request`              | `Request`                 | `Request`                  |                            | ✓                    |
| Assistants             | Create and retrieve Assistants                                                       | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Threads                | Create and retrieve Threads/Messages/Runs                                            | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Evals                  | Create, retrieve, and delete Evals                                                   | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Fine-tuning            | Create and retrieve fine tuning jobs                                                 | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Files                  | Create and retrieve files                                                            | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Vector Stores          | Create and retrieve vector stores                                                    | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            | ✓                    |
| Responses API          | Create responses                                                                     | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            | ✓                    |
| Prompts                | Create and retrieve prompts to use as context for Responses API and Realtime API     | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Webhooks               | Create and view webhooks in your project                                             | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Datasets               | Create and retrieve Datasets                                                         | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Apps                   | Create, manage, and submit apps for review in the Dashboard                          | `Read`, `Write`         |                        |                           |                            |                            | ✓                    |
| Tunnels                | Inspect, use, and manage organization-scoped tunnels                                 | `Read`, `Use`, `Manage` |                        |                           |                            |                            | ✓                    |
| Project API Keys       | Permission for a user to manage their own API keys                                   | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Project Administration | Manage project users, service accounts, API keys, and rate limits via management API | `Read`, `Write`         |                        | `Read`, `Write`           |                            |                            |                      |
| Batch                  | Create and manage batch jobs                                                         | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| Service Accounts       | View and manage project service accounts                                             | `Read`, `Write`         |                        | `Read`, `Write`           |                            |                            |                      |
| Videos                 | Create and retrieve videos                                                           | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            |                      |
| Voices                 | Create and retrieve voices                                                           | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| Agent Builder          | Create and manage agents and workflows in Agent Builder                              | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |




#### Batch permission implications

Batch permissions include access required to prepare batch input files, execute requests, and retrieve results. This effective access is separate from the endpoints that can be submitted inside a batch, which are listed in the [Batch API guide](https://developers.openai.com/api/docs/guides/batch#1-prepare-your-batch-file).

| Batch permission          | Additional access granted                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read (`api.batch.read`)   | Files Read (`api.files.read`) for `/v1/files`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Write (`api.batch.write`) | Batch Read<br />List models (`api.model.read` and `model.read`) for `/v1/models`<br />Files Read and Write (`api.files.read` and `api.files.write`) for `/v1/files`<br />Model capabilities Request (`api.model.request` and `model.request`) for `/v1/audio`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/images`, `/v1/moderations`, `/v1/realtime`, and `/v1/responses`<br />Videos Read and Write (`api.videos.read` and `api.videos.write`) for `/v1/videos` |

## Setting up RBAC

Allow up to **30 minutes** for role changes and group sync to propagate.

1. **Create groups**
   Add groups for teams (e.g., “Data Science”, “Support”). If you use an IdP, enable SCIM sync so group membership stays current.

2. **Create custom roles**
   Start from least privilege. For example:
   - _Model Tester_: Models Read, Model Capabilities Request, Evals
   - _Model Engineer_: Model Capabilities Request, Files Read/Write, Fine-tuning
   - _App Publisher_: Apps Read, Apps Write

3. **Assign roles**
   - **Organization level** roles apply everywhere (all projects within the organization).
   - **Project level** roles apply only in that project.
     You can assign roles to **users** and **groups**. Users can hold multiple roles; access is the **union**.

4. **Verify**
   Use a non-owner account to confirm expected access (API and Dashboard). Adjust roles if users can see more than they need.

Use the principle of least privilege. Start with the minimum permissions
  required for a task, then add more only as needed.

## Access configuration examples

### Small team

- Give the core team an org-level role with Model Capabilities Request and Files Read/Write.
- Create a project for each app; add contractors to those projects only, with project-level roles.

### Larger org

- Sync groups from your IdP (e.g., “Research”, “Support”, “Finance”).
- Create custom roles per function and assign at the org level; or only grant project-specific roles when a project needs tighter controls.

### Contractors & vendors

- Create a “Contractors” group without org-level roles.
- Add them to specific projects with narrowly scoped project roles (for example, read-only access).

## How user access is evaluated

In the dashboard, we combine:

- roles from the **organization** (direct + via groups)
- roles from the **project** (direct + via groups)

The effective permissions are the **union** of all assigned roles.

If requesting with an API key within a project, we take the permissions assigned to the API key, and ensure that the user has some project role that grants them those permissions. For example, if requesting /v1/models, the API key must have api.model.read assigned to it and the user must have a project role with api.model.read.

## Best practices

- **Model your org in groups**: Mirror teams in your IdP and assign roles to groups, not individuals.
- **Separate duties**: reading models vs. uploading files vs. managing keys.
- **Project boundaries**: put experiments, staging, and production in separate projects.
- **Review regularly**: remove unused roles and keys; rotate sensitive keys.
- **Test as a non-owner**: validate access matches expectations before broad rollout.