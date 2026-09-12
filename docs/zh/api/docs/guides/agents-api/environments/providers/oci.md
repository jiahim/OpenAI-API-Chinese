# Oracle Cloud Infrastructure (OCI)

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt). 在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

本指南参考 Oracle 的 Python beta 示例，使用 **应用管理的配置方式**：你的应用会同时创建和删除 智能体 API 会话和 OCI sandbox。

请参阅 [应用管理示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/oci) （位于 OpenAI Cookbook 中）。

请参阅 [Sandbox 生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) ，了解配置模式和连接行为。

OCI GenAI Sandbox 处于 beta 阶段。请联系你的 Oracle 客户经理，
  为你的账号申请访问权限。

## 准备工作

创建一个启用沙盒的生成式 AI 项目。授予你的 OCI 身份在其区间内管理项目和沙盒的权限。替换这些 IAM 策略中的占位符：

```text
allow group <group-name> to manage generative-ai-sandbox in compartment <compartment-name>
allow group <group-name> to manage generative-ai-project in compartment <compartment-name>
```

使用带有 Node.js 的沙盒运行时，以及 `npm`. Oracle 的示例请求 `python-3.11` 默认情况下；选择兼容的自定义运行时，如果不包含 `npm`.

如果你的项目限制出站流量，请允许 HTTPS 访问 `registry.npmjs.org` 以安装 Codex，HTTPS 访问 `api.openai.com`，以及安全 WebSocket 连接访问 `codex-cloud-environments.chatgpt.com`. 参见 [执行器网络访问](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access).

## 1. 安装 OCI CLI 和 beta SDK

创建虚拟环境并安装 OCI CLI：

```bash
uv venv --python 3.14
source .venv/bin/activate
uv pip install --upgrade oci-cli
```

然后安装 Oracle 在入门引导期间提供的 beta 版 Python SDK：

```bash
uv pip install "/path/to/oci-<beta-version>-py3-none-any.whl"
```

在 CLI 之后安装 beta 版 SDK **之后** 再安装或升级 CLI `oci-cli` 可能会将它替换为来自 `oci` PyPI 的包；如果发生这种情况，请重新安装 beta 版 wheel。该 beta 版 SDK 必须包含 `oci.generative_ai_sandbox`.

## 2. 配置 OCI 环境

在为你账户启用的区域内认证安全令牌配置文件：

```bash
oci session authenticate --profile-name Sandbox --region us-chicago-1
```

设置项目 OCID 和 OpenAI 凭证，且不要提交它们：

```bash
export OCI_SANDBOX_PROJECT_ID="ocid1.generativeaiproject..."
export OPENAI_API_KEY="..."
export OPENAI_EXECUTOR_API_KEY="..."
```

将应用密钥用于 智能体 API 请求。仅将独立的受限执行器密钥传入沙箱作为 `CODEX_API_KEY`。两个密钥必须具有相同的所有者、组织和项目。请参阅 [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

Oracle 的示例会读取 `Sandbox` 配置文件并使用 `us-chicago-1`。要覆盖其默认值：

```bash
export OCI_SANDBOX_PROFILE="my-profile"
export OCI_SANDBOX_REGION="us-chicago-1"
```

该示例还接受以下可选设置：

| 设置                  | 默认值                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `OCI_SANDBOX_ENDPOINT`   | `https://inference.generativeai.<region>.oci.oraclecloud.com` |
| `OCI_SANDBOX_RUNTIME`    | `python-3.11`                                                 |
| `OCI_SANDBOX_SHAPE`      | `SMALL`                                                       |
| `OCI_SANDBOX_EXPIRATION` | `PT30M` （30 分钟）                                          |

配置你自己的应用时，请使用该配置文件的 security token 和 private key 与 `oci.auth.signers.SecurityTokenSigner`。配合使用。使用以下代码创建 sandbox 客户端： `GenerativeAiSandboxClient` 从 `oci.generative_ai_sandbox`，中导入，选择所需的 region 和 endpoint。

## 3. 运行应用管理的会话

使用 [自托管连接指南](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 获取 智能体 API 请求和执行器启动命令。参照 Oracle 示例的相同流程：

1. 创建一个自托管的智能体 API 会话，使用 `/workspace` 作为其工作目录。保存会话 ID 和环境 ID。
2. 创建一个 OCI GenAI 沙盒，等待其达到 `RUNNING`.
3. 安装 Codex 并编写 `/workspace/brief.txt` 到沙盒中。
4. 启动 `codex exec-server` 使用该会话的环境 ID 和受限执行器密钥。
5. 打开会话事件流，然后发送输入请求智能体将 `brief.txt` 转换为迁移计划。等待完成并读取生成的 `/workspace/plan.md`.
6. 停止并删除 OCI 沙盒，然后 [删除智能体 API 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session)。即使其中一个失败，也尝试执行两项清理操作。

在后续轮次中保持这两个资源处于活跃状态，并在删除沙箱之前检索文件。使用 Oracle 指定的 beta SDK 版本；预览版可能会重命名沙箱 API。

## 参考

- 阅读 [OCI Generative AI 文档](https://docs.oracle.com/en-us/iaas/Content/generative-ai/)
- 阅读 [OCI Python SDK 文档](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/pythonsdk.htm)
- 阅读 [OCI TypeScript SDK 文档](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/typescriptsdk.htm)
- 阅读 [OCI CLI 身份验证](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/clitoken.htm)