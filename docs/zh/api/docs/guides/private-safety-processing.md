# ZDR 与私有安全处理

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

li+li]:mt-2! [&_ul>li>p]:my-0! [&_#built-with-three-principles+ol>li+li]:mt-2! [&_#check-storage-status]:mt-0!">

Zero Data Retention with Private Safety Processing（ZDR with PSP）支持离线、自动化的安全审核，而无需 OpenAI 保留客户的提示词或响应。本指南概述了 ZDR with PSP 的运作方式以及你承担的运营责任。如需了解完整的架构和安全模型，请参阅 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf).

## 基于三项原则构建

1. **客户控制其内容**

   客户内容存储在客户可控的存储中。客户控制检索和解密受保护安全记录所需的权限以及客户管理的企业密钥管理（EKM）授权。
2. **无人工审核**

   安全审核不得为 OpenAI 人员阅读受保护的客户内容开辟新途径。加密的客户内容在经过审批的、具备硬件证明能力的运行时中解密，该运行时禁用人工访问。只有受限的安全信号和运营元数据会以明文形式离开 PSP 受保护审核流程。
3. **仅出于安全目的保留内容**

   存储在客户可控存储中的内容仅用于经过审批的安全目的。客户内容不得用于训练模型，也不得提供给 OpenAI 内部的其他团队或其合作伙伴。

## ZDR 与 PSP 的工作原理

该架构由两个流程组成：

- API 请求与保留流程会在客户控制的存储容器中保护并保留符合条件的API 内容。
- 异步安全流水线仅会为已批准的自动化安全审查检索记录，并发布有界的安全决策。

### API 请求与保留

一次交互（即你的提示和模型的响应）会通过安全分类器转交或经批准的采样策略被选中。转交并不构成违反策略。

系统对记录进行加密，并将其写入你的区域云存储。OpenAI 仅维护一个包含运维元数据和存储引用的索引，而不保留内容的副本。加密和存储以异步方式执行，不会阻塞推理。




![API 请求流程示意图，展示加密的安全记录存储在客户控制的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection.webp)







![API 请求流程示意图，展示加密的安全记录存储在客户控制的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection-dark.webp)







### 异步安全管道

启用 PSP 的 ZDR 会从你的存储中检索加密记录，并检查其可解密能力。安全审查运行时是一个经过硬件可信验证的计算环境，会禁用人工访问，旨在成为唯一可以解密客户内容的工作负载。它使用经过审批的审查提示词和输出架构执行自动化安全审查，不会暴露客户内容。

只有预定义的、有边界的安全信号和经过审批的运营元数据可以以明文形式离开审查环境。详细结果在离开运行时之前会被加密，并按原始记录的过期时间存储在你的云存储中。启用 PSP 的 ZDR 会加密这些记录，并以 30 天的 TTL 将其写入你的区域云存储。




![异步安全审查流程，展示加密记录的检索、受保护的审查以及有边界的输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review.webp)







![异步安全审查流程，展示加密记录的检索、受保护的审查以及有边界的输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review-dark.webp)




## 客户内容加密

每条存储的记录在保留到客户存储中时都会进行双重加密：

- **OpenAI 托管的 HPKE 加密：** 内层加密将客户内容的解密权限限制在经过授权的 Safety Review Runtime 内。
- **客户自管加密：** [Enterprise Key Management (EKM)](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 通过你客户自控的密钥管理服务添加一层外层加密。

当启用 EKM 时，仅凭 OpenAI 的内部解密密钥不足以解密已存储的记录：你客户管理的密钥授权同样必需。撤销该授权会阻止对已留存记录的解密，但不会删除这些记录，也不会撤销已完成的处理。

我们建议启用 EKM 以获得这一额外控制能力。参见 [EKM 技术常见问题解答](https://help.openai.com/en/articles/20000945-ekm-technical-faq) 了解授权与撤销相关内容，参见 [技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf) 了解加密、机密计算、护栏与透明度相关内容。



<a id="customer-storage-setup-steps"></a>



<a id="set-up-and-verify-customer-storage"></a>



## 设置并验证存储



将你自己的 AWS S3 存储桶、Azure Blob 容器或 Google Cloud Storage 存储桶连接到 OpenAI 项目。按照你所使用云的设置步骤操作，然后注册并验证连接。

ZDR 与 PSP 按项目启用。启用后，PSP 策略会应用于该项目中的所有 API 流量，包括对本身不要求 PSP 的模型的请求。若要在符合条件的模型上使用不带 PSP 的 ZDR，请通过另一个配置为不带 PSP 的 ZDR 的项目发送这些请求。

### 准备工作

- 已获得零数据保留（Zero Data Retention）批准的组织可以直接在 API 控制台中配合 PSP 设置 ZDR。如果你的组织尚未获得 ZDR 批准，请参阅 [资格与审批要求](https://developers.openai.com/api/docs/guides/your-data#data-retention-controls-for-abuse-monitoring).
- 选择与项目数据驻留要求一致的存储区域。你需要拥有在你的云账户中创建存储并委派访问权限的权限。
- 由组织管理员在 API 控制台中注册并验证存储。对于 Management API，请使用一个 OpenAI 组织 Admin API key。项目管理员可以查看相关指引和状态；项目推理 key 无法用于 Management API 调用。

### 在 API 控制台中打开存储设置

1. 打开 **Organization settings > Data controls > Data retention**，然后选择 **Connect storage**.
2. 在 **Connect external storage**，中，选择 **AWS**, **Azure**，或 **GCP** 并选择你的项目。你也可以从 **Connect storage** 打开 **Project Settings > Data retention**.
3. 完成下面的云配置。然后在弹窗中输入你的存储详情，并选择 **Connect and validate**.

### 云平台特定设置



<a id="aws-s3"></a>



#### AWS S3



如果你使用的是 AWS，请完成这些步骤。对于其他云，请跳到 **Azure Blob Storage** 或 **Google Cloud Storage**.

<figure>
  <video
    controls
    playsInline
    preload="metadata"
    poster="/images/platform/guides/private-safety-processing/aws-onboarding-poster.webp"
    aria-label="AWS onboarding walkthrough for ZDR with Private Safety Processing"
    aria-describedby="aws-onboarding-video-description"
    style={{ width: "100%", height: "auto" }}
  >
    <source
      src="https://cdn.openai.com/devhub/docs/api/private-safety-processing/psp-onboarding-2026-10-07.webm"
      type="video/webm"
    />
    Your browser doesn't support this video. Follow the written steps below.
  </video>
  <figcaption id="aws-onboarding-video-description">
    AWS onboarding walkthrough (2 min 10 sec, no audio). Follow the written
    steps below for configuration values.
  </figcaption>
</figure>

#### 1. 创建存储桶

创建一个专用的 S3 存储桶，并选择与你的项目数据驻留要求兼容的区域。如果未启用 Data Residency，推荐使用 us-west-1 区域。

- 保留 **ACL 已禁用**.
- 开启 **阻止所有公有访问**.
- 记录存储桶 ARN。稍后你会将它用作 `CUSTOMER_BUCKET_ARN` 下方。

![AWS S3 存储桶属性页面，显示存储桶概览、AWS 区域和 Amazon 资源名称。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-01-aws-create-bucket.webp)

#### 2. 设置生命周期规则

打开该存储桶的 **管理 > 创建生命周期规则** 页面，并使用以下设置：

- **规则名称：** `psp-retention`
- **前缀：** `openai/`
- **操作：** 使对象的当前版本过期
- **保留时长：** 30 天

启用该规则。确保没有其他规则更早地使这些记录过期。这将设置对象的生命周期过期；OpenAI 的解密密钥过期是独立的。

![AWS S3 管理页面，显示生命周期配置、一条生命周期规则以及“创建生命周期规则”控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-02-aws-lifecycle-rule.webp)

#### 3. 创建访问策略

在 **IAM > 策略 > 创建策略**，中，选择 **JSON**。将 `CUSTOMER_BUCKET_ARN` 替换为你的存储桶 ARN，例如 `arn:aws:s3:::your-psp-bucket`，然后将该策略保存为 `psp-bucket-policy`.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetLifecycleConfiguration",
      "Resource": "CUSTOMER_BUCKET_ARN"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "CUSTOMER_BUCKET_ARN/*"
    }
  ]
}
```

#### 4. 创建 IAM 角色

在 **IAM > 角色 > 创建角色**，中，选择 **自定义信任策略**.

![AWS IAM“选择可信实体”页面，已选中 Custom trust policy。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-03-aws-custom-trust-policy.webp)

使用下面的策略。将 `CUSTOMER_PROJECT_ID` 替换为你的 OpenAI 项目 ID。保持 OpenAI 主体 ARN 不变。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::790389265272:role/CustomerStorage"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": ["CUSTOMER_PROJECT_ID"]
        }
      }
    }
  ]
}
```

Attach `psp-bucket-policy` 附加到正在创建的角色。你可以将该角色命名为 `psp-role`。将其 ARN 记录为 `CUSTOMER_ROLE_ARN`；其中的项目 ID `sts:ExternalId` 必须与你要注册的项目一致。

![AWS IAM“添加权限”页面，已选择“使用现有策略”并勾选了客户管理的 psp-bucket-policy。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-04-aws-iam-role.webp)

继续到 **注册你的存储**.







<a id="azure-blob-storage"></a>



#### Azure Blob Storage



如果你使用的是 Azure，请完成以下步骤。

#### 1. 创建存储账户

在商业版 Azure 中创建一个专用账户。选择一个与你的项目数据驻留要求相符的已批准的美国或欧盟存储区域。

- **帐户类型：** `StorageV2`
- **基本 > 性能：** 标准
- **基本 > 冗余：** LRS 或 ZRS（首选）
- **高级 > 访问层：** 热
- **高级 > 分层命名空间：** 已禁用
- **网络 > 公共网络访问：** 允许来自所有网络
- **安全 > 安全传输：** 要求使用 HTTPS；最低 TLS 1.2
- **安全 > 匿名 Blob 访问：** 已禁用
- **安全 > 存储帐户密钥访问：** 已禁用
- **安全 > Microsoft Entra Authorization：** 已启用

确认网络设置满足你的云要求。使用该账户的主 Blob 终结点，不要使用主权云或自定义终结点。

![Azure 存储账户的“公共访问”设置，其中允许来自所有网络的公共网络访问。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-azure-public-access.webp)

![Azure 存储账户的“安全”设置，其中启用了安全传输和 Microsoft Entra 授权，禁用了匿名访问和存储账户密钥访问，并且最低 TLS 版本为 1.2。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-11-azure-security-settings.webp)

#### 2. Create the container

在以下位置创建专用容器 **存储账户 > 数据存储 > 容器 > 添加容器**。将此容器元数据添加到 **容器 > 设置 > 元数据** 中，并填写你的确切 OpenAI 组织 ID：

- `openai_organization_id`: 你的 OpenAI 组织 ID

将元数据添加到容器，而非存储账户或单个 blob。

#### 3. 设置生命周期规则

在以下位置添加一条已启用的规则： **存储账户 > 数据管理 > 生命周期管理 > 添加** 该规则应用于专用账户中所有当前版本/基础块 Blob：

- **操作：** 在上次修改后 30 天删除
- **过滤器：** 无前缀或标签过滤器

![Azure 生命周期规则详情，该规则应用于所有 blob，并已选择块 blob 和基础 blob。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-12-azure-lifecycle-scope.webp)

![Azure 生命周期规则基础 blob 设置，在 30 天未修改后删除 blob。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-13-azure-lifecycle-delete.webp)

#### 4. 授予 OpenAI 访问权限

请你的目录管理员将 OpenAI 的应用添加到你的租户，并将 `CUSTOMER_TENANT_ID` 下文替换为你的 Azure 租户 ID。应用程序 ID 保持不变。

```bash
az login --tenant '<CUSTOMER_TENANT_ID>'
az ad sp create --id 'e5627955-3059-4a88-89f8-73843190624d' \
  --query '{name:displayName,objectId:id}' -o table
```

如果该应用已存在，请使用 `az ad sp show` 相同的 `--id` 和查询条件，记录该应用的名称及其租户本地对象 ID。

在你的存储账户中打开 **存储账户 > 访问控制 (IAM) > 添加角色分配** 。选择 **Reader** 角色，将 **Assign access to** 设置为 **User, group, or service principal**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

![Azure 角色分配“成员”选项卡，显示已选择 Storage Blob Data Reader 角色以及 User, group, or service principal。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-14-azure-role-members.webp)

![Azure 的“选择成员”窗格，其中将 CSG - Azure Blob Storage Prod 列为一个应用程序。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-15-azure-select-application.webp)

然后选择 **Storage Blob Data Contributor** 角色，将 **Assign access to** 设置为 **User, group, or service principal**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

OpenAI 管理应用程序凭据。请勿创建或共享存储密钥、SAS 令牌或客户端密钥。







<a id="google-cloud-storage"></a>



#### Google Cloud Storage



#### 1. 创建存储桶

Create a bucket in **Cloud Storage > Buckets** 在与你的 OpenAI 项目数据驻留要求兼容的位置，并满足以下条件：

- **防止公共访问**：开。
- **访问控制**：统一。

你可以选择禁用默认 **软删除策略（用于数据恢复）**；下一步配置生命周期删除。

对于全局项目，请为你计划使用的每个区域重复此 GCP 设置。

![Google Cloud 存储桶访问设置截图，显示公共访问防护为开启、访问控制为统一、IP 过滤为未配置。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access-controls.webp)

#### 2. 设置生命周期规则

在存储桶的 **生命周期** 选项卡中，添加一条 **删除对象** 规则，并设置以下条件：

- **对象名称匹配前缀**: `openai/`.
- **年龄**：30 天。

![Google Cloud 生命周期规则，显示 Delete 对象、openai/ 对象前缀和 Age 30。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-lifecycle-rule.webp)

#### 3. 找到你的 Google Cloud 项目编号

在 **IAM & Admin > 设置**，复制包含你的工作负载身份池的项目的 **项目编号** ，作为 `<CUSTOMER_GCP_PROJECT_NUMBER>`.

#### 4. 创建工作负载身份池和提供方

在 **IAM 与管理 > 工作负载身份联合**，创建一个工作负载身份池并添加 **OpenID Connect (OIDC)** 提供商，配置如下：

- **颁发者（URL）**: `https://accounts.google.com`.
- **允许的受众**: `<CUSTOMER_PROJECT_ID>` （你的 OpenAI 项目 ID）。

![Google Cloud OIDC 提供商设置，显示 Google 颁发者 URL 以及一个 OpenAI 项目 ID 作为允许的受众。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-oidc-provider.webp)

配置以下属性映射：

| Google 属性           | OIDC 值      |
| -------------------------- | --------------- |
| `google.subject`           | `assertion.sub` |
| `attribute.openai_project` | `assertion.aud` |

设置以下属性条件。 **保持 OpenAI 的生产环境身份主体不变 `112981926705442324573` 。**

```text
assertion.sub == '112981926705442324573' && assertion.aud == '<CUSTOMER_PROJECT_ID>'
```

![Google Cloud 提供商将属性 google.subject 映射到 assertion.sub，并将 attribute.openai_project 映射到 assertion.aud，其中的条件用于限定 OpenAI 的生产环境主体和项目受众。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-provider-attributes.webp)

记录该池和提供商的 ID 为 `<CUSTOMER_GCP_POOL_ID>` 和 `<CUSTOMER_GCP_PROVIDER_ID>`.

**多个 OpenAI 项目**

对于属于同一客户的多个项目，你可以复用该池和提供商。将每个项目 ID 添加到 **允许的受众** 中，并更新属性条件：

```text
assertion.sub == '112981926705442324573' &&
(assertion.aud == '<CUSTOMER_PROJECT_ID_1>' || assertion.aud == '<CUSTOMER_PROJECT_ID_2>')
```

分别为每个项目完成存储桶授权和存储注册。

#### 5. 创建自定义存储角色

在 **IAM & Admin > Roles**，在存储桶所属的 Google Cloud 项目中使用以下权限创建自定义角色：

```text
storage.buckets.get
storage.objects.create
storage.objects.get
storage.objects.delete
```

#### 6. 授予 OpenAI 对该存储桶的访问权限

在存储桶的 **权限 > 授予访问权限**，添加此主体：

```text
principalSet://iam.googleapis.com/projects/<CUSTOMER_GCP_PROJECT_NUMBER>/locations/global/workloadIdentityPools/<CUSTOMER_GCP_POOL_ID>/attribute.openai_project/<CUSTOMER_PROJECT_ID>
```

选择你在步骤 5 中创建的自定义角色。

![Google Cloud 存储桶访问权限表单，其中已设置 OpenAI 项目主体，并选择了自定义存储角色。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access.webp)

继续到 **注册你的存储**.





### Register your storage

完成上述云端配置后，使用 API 控制台或 Management API 注册并验证你的存储。只需选择其中一种方式即可。

#### 选项 1：API 控制台

以组织管理员身份登录。API 控制台使用你已登录的会话，此方法无需 Admin API 密钥或 curl 命令。

##### 1. 打开 Connect 存储

在你的存储账户中打开 **Organization settings > Data controls > Data retention** 并选择 **Connect storage**。你也可以从 **Project Settings > Data retention**.

![OpenAI 组织的 Data controls 页面，显示 Data retention 标签页、项目策略表格以及 Connect storage 控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-06-platform-open-storage.webp)

##### 2. 输入你的存储详细信息

选择 **AWS**, **Azure**，或 **GCP**,然后选择项目。如果你从项目设置中打开此对话框,则该项目已被选中。如果 **Registered storage** 出现,请选择 **Connect new storage** 以添加目标位置。

对于 **AWS**,请输入 **Bucket ARN** 和 **IAM role ARN** (从你的云配置中获取)。

![AWS 的连接外部存储对话框,显示项目选择、Bucket ARN、IAM role ARN 以及 Connect and validate。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-07-platform-aws-connect.webp)

对于 **Azure**,请输入 **Tenant ID**, **Subscription ID**, **Resource group**, **存储账户名**，以及 **容器名**。在弹窗中向下滚动以填写所有字段。

![显示项目和 Azure 存储配置字段的 Azure 连接外部存储对话框。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-08-platform-azure-connect.webp)

对于 **GCP**,请输入 **存储桶名称**, **工作负载身份项目编号**, **工作负载身份池 ID**，以及 **工作负载身份提供方 ID**。在弹窗中向下滚动以填写所有字段。

![显示项目选择、存储桶名称、工作负载身份项目编号和工作负载身份池 ID 的 GCP 连接外部存储对话框。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-platform-gcp-connect.webp)

##### 3. 连接并验证

选择 **连接并验证**。API 控制台会注册存储、运行验证，并刷新存储状态和项目策略。仅注册不会更改策略。

等待 **存储已验证** 以及项目现在使用 ZDR 和 PSP 的确认信息，然后选择 **完成**.

![OpenAI 项目设置，显示已验证的 AWS S3 存储以及零数据留存与私有安全处理策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-09-platform-storage-validated.webp)

如果注册后验证失败，请修复报告的问题，然后选择 **重试验证**。若要稍后继续，请在 **Registered storage** 下选择目标并选择 **验证存储**。如果 API 控制台无法刷新结果，请选择 **刷新状态** 后重新开始。

#### 选项 2：管理 API

为此方法使用组织管理员 API 密钥。使用以下命令注册存储，然后按照 [**3. 验证你的设置**](#3-verify-your-setup) 运行验证。

##### 1. 准备你的 API 设置

将你组织的 Admin API 密钥安全加载到 `OPENAI_ADMIN_KEY`.

设置 `OPENAI_API_BASE` 为你的项目确认的端点： `https://api.openai.com` 用于全球， `https://us.api.openai.com` 用于美国，或 `https://eu.api.openai.com` 用于欧洲。

将下面的占位符替换为该端点和你的 OpenAI 组织 ID。在同一个 shell 会话中运行剩余的命令。

```bash
OPENAI_API_BASE='<OPENAI_API_BASE>'
OPENAI_ORG_ID='<OPENAI_ORG_ID>'
OPENAI_STORAGE_URL="$OPENAI_API_BASE/v1/organization/external_storage"
```

##### 2. 发送注册请求

仅运行你的提供商对应的请求。将所有 `CUSTOMER_...` 占位符替换为你的 ID 和已创建的资源。

**AWS S3**

```bash
curl --fail-with-body -sS -X POST "$OPENAI_STORAGE_URL" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "project_id": "CUSTOMER_PROJECT_ID",
    "provider": {
      "type": "aws",
      "bucket": "CUSTOMER_BUCKET_ARN",
      "role_arn": "CUSTOMER_ROLE_ARN"
    }
  }'
```

**Azure Blob Storage**

```bash
curl --fail-with-body -sS -X POST "$OPENAI_STORAGE_URL" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "project_id": "CUSTOMER_PROJECT_ID",
    "provider": {
      "type": "azure",
      "tenant_id": "CUSTOMER_TENANT_ID",
      "subscription_id": "CUSTOMER_SUBSCRIPTION_ID",
      "resource_group": "CUSTOMER_RESOURCE_GROUP",
      "account_name": "CUSTOMER_STORAGE_ACCOUNT",
      "container": "CUSTOMER_CONTAINER_NAME"
    }
  }'
```

**Google Cloud Storage**

```bash
curl --fail-with-body -sS -X POST "$OPENAI_STORAGE_URL" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "project_id": "<CUSTOMER_PROJECT_ID>",
    "provider": {
      "type": "gcp",
      "bucket": "<CUSTOMER_GCP_BUCKET_NAME>",
      "workload_identity_project_number": "<CUSTOMER_GCP_PROJECT_NUMBER>",
      "workload_identity_pool_id": "<CUSTOMER_GCP_POOL_ID>",
      "workload_identity_provider_id": "<CUSTOMER_GCP_PROVIDER_ID>"
    }
  }'
```

响应包含一个 `id` 以 `extstorage_` 和 `status: "pending"`。开头。保留该 ID 以供验证。API 控制台会显示 **等待验证** ，且不会更改项目的保留策略。

##### 3. 验证你的设置

要进行 API 验证，请将 `EXTERNAL_STORAGE_ID` 替换为注册返回的 ID，然后运行：

```bash
EXTERNAL_STORAGE_ID='<EXTERNAL_STORAGE_ID>'
curl --fail-with-body -sS -X POST \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID/validate" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

成功响应包含 `status: "validated"`。验证会检查配置和访问权限，然后为该项目启用客户管理的数据保留。API 控制台会显示 **已验证** 以及只读策略 **零数据保留与私有安全处理**.

如果你使用了管理 API，请获取已保存的注册信息：

```bash
curl --fail-with-body -sS \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

无论使用哪种方式，打开 **Project Settings > Data retention** 并选择 **刷新**。确认目标位置、提供商、地理位置以及 **已验证** 状态，然后检查策略是否为 **零数据保留与私有安全处理**。组织的“数据保留”表格中也会显示每个项目的存储和状态。

![OpenAI 项目设置中的“数据保留”页面，显示了一个状态为已验证且保留策略为带有 PSP 的零数据保留的 AWS S3 外部存储连接。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-05-verify-project-retention.webp)

**已验证** 仅记录一次成功的检查，而不是持续的存储健康状况。 **刷新** 不会重新运行验证。请使用 [运维与故障排除](#operate-and-troubleshoot-customer-storage) 进行持续监控和重新验证。







<a id="customer-storage-operations-steps"></a>



<a id="operate-and-troubleshoot-customer-storage"></a>



## 故障排除



### 检查存储状态

在你的存储账户中打开 **Organization settings > Data controls > Data retention** 用于项目表，或 **Project Settings > Data retention** 用于项目的存储详情。请查看目标位置和地理区域，然后检查状态。你也可以通过 API 检索注册信息，位置如下 [设置和验证](#set-up-and-verify-customer-storage).

- **待验证** (`pending`）：存储已注册，但尚未通过验证。在验证成功之前，项目的保留策略保持不变。
- **已验证** (`validated`）：存储通过了验证检查。这并不保证实时连通性。
- **需要关注** (`unhealthy`）：检查发现了存储或配置问题。请修复原因并重新验证。

**刷新** 仅重新加载已保存的状态，不会测试连接。运行时失败可能不会改变显示的状态。如果 API 控制台无法加载存储，请先检查 API，再将其视为存储桶故障。

### 监控存储活动

分别检查以下来源：

- **存储注册：** 检查项目、提供商、地域和验证结果。
- **云活动：** 检查提供商访问日志和读/写错误（如果已启用）。将验证探测与实际 PSP 活动区分开来。
- **安全与合规事件：** 检查 Compliance API 中可用的内容生命周期事件（如果单独启用）。这些不是存储注册事件或云访问日志。

你的采样策略决定了哪些请求会创建保留对象。仅缺少某个对象或事件，并不代表存储失败。

#### 识别验证探测

对于 AWS、Azure 和 GCP，验证会将测试对象写入你配置好的存储目标。它们的名称包含 `csg_validation_` 后跟一个随机的十六进制后缀。每个对象的内容包含文本 `customer-storage-gateway-validation:csg_validation_<suffix>`，使用与其名称相同的后缀。它们不包含任何客户提示或响应。OpenAI 使用配置的访问权限读取每个测试对象，然后尝试一次未经身份验证的 `GET` 对同一对象的访问，以检查是否存在公开访问。私有存储应拒绝该未经身份验证的请求。这些请求可能会出现在你的提供商访问日志中，具体取决于你的日志配置。

对于 AWS，验证还会检查角色的 `sts:ExternalId` 限制。在使用你项目的外部 ID 成功代入你配置的角色后，OpenAI 会测试 `AssumeRole` 在不使用外部 ID 以及使用故意无效的测试 ID 时的调用 `proj_smoketest-verifier`。这两个测试调用预期都会返回 `AccessDenied`。它们使用相同的 OpenAI 身份和配置的角色；测试 ID 并不标识其他客户的项目。AWS CloudTrail 不会在你的账户中记录这些被拒绝的跨账户角色代入尝试。请将你的信任策略限制为你的真实项目 ID；不要允许测试 ID，也不要移除外部 ID 条件以使这些探测成功。

### 从故障中恢复

#### 1. 检查错误

- `customer_managed_retention_not_enabled`: 请联系你的入职对接人，确认组织访问权限。
- **身份验证或权限失败：** 检查你是否使用了具备所需外部存储权限的组织管理员密钥。
- **配置问题：** 检查云身份、信任策略或访问权限、生命周期规则以及已批准的网络配置。
- `401 customer_storage_not_ready`: 检查所请求项目所在地理区域是否存在已验证的存储。
- `incorrect_hostname`: 使用与你的固定驻留项目配置匹配的主机名。
- `503 external_storage_validation_unavailable`: 稍后重试。如果仍然失败，请联系支持团队。

如果你使用的是 AWS 基于项目的 **[注册 AWS（新）](https://docs.aws.amazon.com/accounts/latest/reference/sign-up-for-aws.html)** 体验，其默认资源控制策略（RCP）会阻止 OpenAI 的跨账户角色担任。若要使用该账户，请根据需要升级到付费套餐， [激活高级功能](https://docs.aws.amazon.com/accounts/latest/reference/activate-advanced-features.html)，并更新 RCP 以允许 OpenAI 的 `sts:AssumeRole` 访问权限。

#### 2. 再次验证

修复配置后，打开 **Connect storage** 在项目所在位置以组织管理员 API 密钥运行验证命令。获取注册信息或选择 **刷新** 以确认 **已验证**。仅刷新不会执行验证。

### 联系支持团队

如果完成故障排查后存储或校验问题仍然存在， [联系 OpenAI Support](https://help.openai.com/en/).

### 更改或停止你的设置

若要断开存储连接，请打开 **Project Settings > Data retention**。在 **外部存储**，中，点击该连接旁边的删除图标，然后使用 **断开存储连接**.

如果项目使用 ZDR with PSP，断开其最后一个存储连接会自动将其保留策略重置为你所在组织的默认设置。如果还有其他连接，策略保持不变。当策略发生变化时，需要 ZDR with PSP 的模型可能会变得不可用。

断开存储连接不会删除你的云存储或其内容。请继续满足现有记录的保留要求。为每个新项目和驻地位置完成设置和验证。





## 客户持续责任

使用 ZDR 与 PSP 的客户必须：

- **注册并验证 PSP 存储。** 通过 OpenAI 的 API 为每个启用 PSP 的项目和数据驻留位置注册并验证存储桶，并根据 OpenAI 发布的指南配置 PSP 服务存储桶访问权限。
- **至少保留加密记录 30 天**。配置存储生命周期规则，使其不会过早删除 PSP 记录。
- **维护存储和密钥访问**。正确配置区域存储、服务权限和客户管理密钥授权。
- **修复配置问题。** 在 OpenAI 发出通知后，修正存储配置问题。
- **响应有关安全问题的通知。** 与 OpenAI 合作，调查并解决该问题。

## 资源

<ul>
  <li>
    [{"Private Safety Processing technical whitepaper"}](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf)
    {" - Full architecture, security controls, and scope."}
  </li>
  <li>
    [{"API data controls"}](https://developers.openai.com/api/docs/guides/your-data)
    {" - ZDR eligibility, endpoint-specific retention, and exceptions."}
  </li>
  <li>
    [{"Data residency"}](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls)
    {" - Supported regions and processing boundaries."}
  </li>
</ul>