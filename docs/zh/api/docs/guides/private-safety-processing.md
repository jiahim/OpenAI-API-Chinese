# ZDR 与私有安全处理

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取该页面的 Markdown 版本。

li+li]:mt-2! [&_ul>li>p]:my-0! [&_#built-with-three-principles+ol>li+li]:mt-2! [&_#check-storage-status]:mt-0!">

零数据保留与私有安全处理（ZDR with PSP）支持离线、自动化的安全审查，且无需 OpenAI 保留客户提示或响应。本指南概述了 ZDR with PSP 的运作方式以及你的运营责任。有关完整的架构和安全模型，请参阅 [私有安全处理技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf).

## 基于三条原则构建

1. **客户控制其内容**

   客户内容存储在客户控制的存储中。客户控制检索和解密受保护安全记录所需的权限以及客户管理的 Enterprise Key Management（EKM）授权。
2. **无人工审查**

   安全审查不得为 OpenAI 人员读取受保护的客户内容创造新的途径。加密的客户内容在经批准且经硬件证明的安全运行时中解密，该运行时禁用了人工访问。只有受限的安全信号和运营元数据会以明文形式离开 PSP 受保护审查。
3. **内容仅用于安全目的的保留**

   存储在客户控制存储中的内容仅用于经批准的安全目的。客户内容不得用于训练模型，也不得提供给 OpenAI 内部的其他团队或其合作伙伴。

## ZDR 与 PSP 的工作原理

该架构由两个流程组成：

- API 请求和保留流程会将符合条件的 API 内容保护并保留在客户控制的存储容器中。
- 异步安全流水线仅会为经批准的自动化安全审查检索记录，并发布有界的安全决策。

### API 请求与保留

一次交互（即你的提示词和模型的回复）会通过安全分类器转交或经批准的采样策略被选中。转交并不构成违反策略。

系统会对该记录进行加密，并写入你的区域云存储中。OpenAI 仅保留一个包含运维元数据和存储引用的索引，而非内容副本。加密与存储过程异步执行，不会阻塞推理。




![API 请求流程图，展示存储在客户可控存储中的加密安全记录。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection.webp)







![API 请求流程图，展示存储在客户可控存储中的加密安全记录。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection-dark.webp)







### 异步安全流水线

启用 PSP 的 ZDR 会从你的存储中检索加密记录，并检查其能否被解密。安全审查运行时（Safety Review Runtime）是一个禁用人工访问的硬件证明计算环境，被设计为唯一能够解密客户内容的工作负载。它使用一个不会暴露客户内容的、经过审批的审查提示和输出模式来执行自动化安全审查。

仅有预定义的、有界的安全信号和经过审批的运维元数据可以以明文形式离开审查。详细结果在离开运行时之前会被加密，并连同原始记录的过期时间一起存储在你的云存储中。启用 PSP 的 ZDR 会加密这些记录，并将其以 30 天的 TTL 写入你的区域云存储。




![异步安全审查流程，展示加密记录检索、受保护的审查以及有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review.webp)







![异步安全审查流程，展示加密记录检索、受保护的审查以及有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review-dark.webp)




## 客户内容加密

每条存储记录在保留于客户存储中时均经过双重加密：

- **OpenAI 托管的 HPKE 加密：** 内层加密将客户内容的解密权限限定在经授权的 Safety Review Runtime 范围内。
- **客户自行管理的加密：** [Enterprise Key Management (EKM)](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 通过你自主可控的密钥管理服务增加一层外层加密。

OpenAI 的内部解密密钥不足以在启用 EKM 时解密已存储的记录：你必须同时提供客户托管密钥的授权。撤销该授权会阻止解密保留的记录，但不会删除这些记录，也不会撤销已完成的处理。

我们建议为此额外控制启用 EKM。请参阅 [EKM 技术常见问题解答](https://help.openai.com/en/articles/20000945-ekm-technical-faq) 以了解授权与撤销，并参阅 [技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf) 以了解加密、机密计算、护栏与透明度。



<a id="customer-storage-setup-steps"></a>



<a id="set-up-and-verify-customer-storage"></a>



## 设置并验证存储



将你自己的 AWS S3 存储桶、Azure Blob 容器或 Google Cloud Storage 存储桶连接到 OpenAI 项目。按照你所使用云的设置步骤操作，然后注册并验证连接。

ZDR 与 PSP 按项目启用。启用后，PSP 策略将应用于该项目中的所有 API 流量，包括对那些本身不要求 PSP 的模型的请求。要在不启用 PSP 的情况下对符合条件的模型使用 ZDR，请将这些请求通过另一个配置为不启用 PSP 的 ZDR 项目发送。

### 开始之前

- 已获得零数据留存审批的组织可在 API 控制台中直接设置 ZDR 与 PSP。如果你的组织尚未获得 ZDR 审批，请参阅 [资格与审批要求](https://developers.openai.com/api/docs/guides/your-data#data-retention-controls-for-abuse-monitoring).
- 选择一个与你项目数据驻留要求一致的存储区域。你需要拥有在你的云账户中创建存储并委派访问权限的权限。
- 由组织管理员在 API 控制台中注册并验证存储。对于 Management API，请使用 OpenAI 组织的 Admin API 密钥。项目管理员可以查看相关指引与状态；项目推理密钥无法用于 Management API 调用。

### 在 API 控制台中打开存储设置

1. 打开 **Organization settings > Data controls > Data retention**，然后选择 **Connect storage**.
2. 在 **Connect external storage**，中，选择 **AWS**, **Azure**，或 **GCP** 并选择你的项目。你也可以从 **Connect storage** 的 **Project Settings > Data retention**.
3. 完成下方的云设置。然后在对话框中输入你的存储详细信息，并选择 **Connect and validate**.

### 云环境专用配置



<a id="aws-s3"></a>



#### AWS S3



如果你使用的是 AWS，请完成以下步骤。对于其他云，跳转到 **Azure Blob Storage** 或 **Google Cloud Storage**.

#### 1. 创建存储桶

在与项目数据驻留要求兼容的区域创建专用 S3 存储桶。如果未启用数据驻留（Data Residency），推荐使用 us-west-1 区域。

- 保持 **ACL 已禁用**.
- 开启 **阻止所有公共访问**.
- 记录该 bucket 的 ARN。你将把它作为 `CUSTOMER_BUCKET_ARN` 下方使用。

![AWS S3 存储桶“属性”页面，显示存储桶概览、AWS 区域和 Amazon 资源名称。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-01-aws-create-bucket.webp)

#### 2. 设置生命周期规则

打开存储桶的 **管理 > 创建生命周期规则** 页面，并使用以下设置：

- **规则名称：** `psp-retention`
- **前缀：** `openai/`
- **操作：** 使对象的当前版本过期
- **有效期：** 30 天

启用该规则。确保没有其他规则更早地使这些记录过期。这将设置对象的生命周期过期；OpenAI 的解密密钥过期时间是独立的。

![AWS S3 管理页面，显示生命周期配置、一条生命周期规则以及“创建生命周期规则”控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-02-aws-lifecycle-rule.webp)

#### 3. 创建访问策略

在 **IAM > 策略 > 创建策略**，中，选择 **JSON**。将 `CUSTOMER_BUCKET_ARN` 替换为你的存储桶 ARN，例如 `arn:aws:s3:::your-psp-bucket`，并将策略保存为 `psp-bucket-policy`.

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

在 **IAM > Roles > Create role**，中，选择 **自定义信任策略**.

![AWS IAM “选择可信实体”页面，已选中“自定义信任策略”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-03-aws-custom-trust-policy.webp)

使用以下策略。将 `CUSTOMER_PROJECT_ID` 替换为你的 OpenAI 项目 ID。保持 OpenAI 主体 ARN 不变。

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

附加 `psp-bucket-policy` 到你正在创建的角色。你可以将该角色命名为 `psp-role`。将其 ARN 记录为 `CUSTOMER_ROLE_ARN`；其中的项目 ID `sts:ExternalId` 必须与你注册的项目一致。

![AWS IAM “添加权限”页面，已选中“使用现有策略”，并勾选了客户托管的 psp-bucket-policy。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-04-aws-iam-role.webp)

继续前往 **注册你的存储**.







<a id="azure-blob-storage"></a>



#### Azure Blob Storage



如果你使用的是 Azure，请完成以下步骤。

#### 1. 创建存储账户

在商业版 Azure 中创建专用账户。选择与你项目数据驻留要求匹配的已批准的 US 或 EU 存储区域。

- **帐户类型：** `StorageV2`
- **基本信息 > 性能：** 标准
- **基本信息 > 冗余：** LRS 或 ZRS（首选）
- **高级 > 访问层：** 热
- **高级 > 分层命名空间：** 已禁用
- **网络 > 公共网络访问：** 从所有网络启用
- **安全 > 安全传输：** 需要 HTTPS；最低 TLS 1.2
- **安全 > 匿名 Blob 访问：** 已禁用
- **安全 > 存储帐户密钥访问：** 已禁用
- **安全 > Microsoft Entra 授权：** 已启用

确认网络设置满足你的云要求。使用该账户的主 Blob 终结点，而不是主权云或自定义终结点。

![Azure 存储账户的“公共访问”设置，允许所有网络启用公共网络访问。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-azure-public-access.webp)

![Azure 存储账户的“安全”设置，启用了安全传输和 Microsoft Entra 授权，禁用了匿名访问和存储账户密钥访问，并使用最低 TLS 1.2。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-11-azure-security-settings.webp)

#### 2. Create the container

在以下位置创建一个专用容器 **存储账户 > 数据存储 > 容器 > 添加容器**。在以下位置添加此容器元数据 **容器 > 设置 > 元数据** ，并填入你的确切 OpenAI 组织 ID：

- `openai_organization_id`: 你的 OpenAI 组织 ID

将元数据添加到容器，而不是存储账户或单个 blob。

#### 3. 设置生命周期规则

在 中添加已启用的规则 **存储账户 > 数据管理 > 生命周期管理 > 添加** 该规则将应用于专用账户中所有当前/基础块 Blob：

- **操作：** 自上次修改起 30 天后删除
- **筛选条件：** 无前缀或标签筛选

![Azure 生命周期规则详情，规则应用于所有 Blob，并选定 Block Blob 和 Base Blob。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-12-azure-lifecycle-scope.webp)

![Azure 生命周期规则 Base Blob 设置，在 Blob 30 天未被修改后将其删除。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-13-azure-lifecycle-delete.webp)

#### 4. 授予 OpenAI 访问权限

请你的目录管理员将 OpenAI 的应用程序添加到你的租户。请将下方 `CUSTOMER_TENANT_ID` 替换为你的 Azure 租户 ID。应用程序 ID 保持不变。

```bash
az login --tenant '<CUSTOMER_TENANT_ID>'
az ad sp create --id 'e5627955-3059-4a88-89f8-73843190624d' \
  --query '{name:displayName,objectId:id}' -o table
```

如果该应用程序已存在，请使用 `az ad sp show` 相同的 `--id` 和查询进行查询，并记下应用程序名称及其租户本地对象 ID。

打开 **存储账户 > 访问控制 (IAM) > 添加角色分配** ，在你的存储账户上。选择 **读取者** 角色，将 **将访问权限分配给** 设置为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

![Azure 角色分配“成员”选项卡，显示已选择 Storage Blob Data Reader 角色以及“用户、组或服务主体”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-14-azure-role-members.webp)

![Azure“选择成员”窗格，其中 CSG - Azure Blob Storage Prod 作为应用程序列出。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-15-azure-select-application.webp)

然后选择 **存储 Blob 数据参与者** 角色，将 **将访问权限分配给** 设置为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

OpenAI 管理应用程序凭据。不要创建或共享存储密钥、SAS 令牌或客户端密钥。







<a id="google-cloud-storage"></a>



#### Google Cloud Storage



#### 1. 创建存储桶

在以下位置创建一个存储桶： **Cloud Storage > Buckets** ，位置需与你的 OpenAI 项目的数据驻留要求兼容，可使用以下命令：

- **禁止公共访问**：开启。
- **访问控制**：统一。

你可以选择禁用默认的 **软删除策略（用于数据恢复）**；下一步将配置生命周期删除。

对于 Global 项目，请为你打算使用的每个区域重复此 GCP 设置。

![Google Cloud 存储桶访问设置显示：公共访问防护已开启、访问控制为统一模式、IP 过滤未配置。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access-controls.webp)

#### 2. 设置生命周期规则

在存储桶的 **生命周期** 选项卡中，添加一条 **删除对象** 规则，条件如下：

- **对象名称与前缀匹配**: `openai/`.
- **Age**: 30 天。

![Google Cloud 生命周期规则，显示 Delete object、openai/ 对象前缀以及 Age 30。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-lifecycle-rule.webp)

#### 3. 查找你的 Google Cloud 项目编号

在 **IAM 和管理 > 设置**，复制包含你的工作负载身份池的项目的数字 **项目编号** 作为 `<CUSTOMER_GCP_PROJECT_NUMBER>`.

#### 4. 创建工作负载身份池和提供者

在 **IAM & Admin > Workload Identity Federation**，创建一个 workload identity pool 并添加一个 **OpenID Connect (OIDC)** 提供方，配置如下：

- **颁发者（URL）**: `https://accounts.google.com`.
- **允许的受众**: `<CUSTOMER_PROJECT_ID>` （你的 OpenAI 项目 ID）。

![Google Cloud OIDC 提供商设置，显示 Google 颁发者 URL 以及一个 OpenAI 项目 ID 作为允许的受众。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-oidc-provider.webp)

配置以下属性映射：

| Google 属性           | OIDC 值      |
| -------------------------- | --------------- |
| `google.subject`           | `assertion.sub` |
| `attribute.openai_project` | `assertion.aud` |

设置下面的属性条件。 **保留 OpenAI 的生产环境主体身份不变 `112981926705442324573` 。**

```text
assertion.sub == '112981926705442324573' && assertion.aud == '<CUSTOMER_PROJECT_ID>'
```

![Google Cloud 提供商属性映射，将 google.subject 映射到 assertion.sub，将 attribute.openai_project 映射到 assertion.aud，并通过条件限制 OpenAI 生产环境主体和项目受众。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-provider-attributes.webp)

将池 ID 和提供商 ID 记录为 `<CUSTOMER_GCP_POOL_ID>` 和 `<CUSTOMER_GCP_PROVIDER_ID>`.

**多个 OpenAI 项目**

对于属于同一客户的项目，你可以复用池和提供商。将每个项目 ID 添加到 **Allowed audiences** 并更新属性条件：

```text
assertion.sub == '112981926705442324573' &&
(assertion.aud == '<CUSTOMER_PROJECT_ID_1>' || assertion.aud == '<CUSTOMER_PROJECT_ID_2>')
```

分别为每个项目完成桶授权和存储注册。

#### 5. 创建自定义存储角色

在 **IAM & Admin > Roles**，在该存储桶所属的 Google Cloud 项目中创建一个具有以下权限的自定义角色：

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

选择在步骤 5 中创建的自定义角色。

![Google Cloud 存储桶访问权限表单，其中设置了 OpenAI 项目主体并选择了自定义存储角色。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access.webp)

继续前往 **注册你的存储**.





### Register your storage

完成上述云端设置后，使用 API 控制台或 Management API 注册并验证你的存储。你只需选择其中一种方式即可。

#### 选项 1：API 控制台

以组织管理员身份登录。API 控制台会使用你已登录的会话；使用此方法时无需管理员 API 密钥或 curl 命令。

##### 1. Open Connect storage

打开 **Organization settings > Data controls > Data retention** 并选择 **Connect storage**。你也可以从 **Project Settings > Data retention**.

![OpenAI 组织 Data controls 页面，显示 Data retention 选项卡、项目策略表以及 Connect storage 控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-06-platform-open-storage.webp)

##### 2. 输入你的存储详细信息

选择 **AWS**, **Azure**，或 **GCP**,然后选择项目。如果你是从项目设置中打开该弹窗,则项目已被选中。如果 **已注册存储** 中出现该存储,请选择 **连接新存储** 以添加目标。

对于 **AWS**,请输入 **Bucket ARN** 和 **IAM role ARN** (来自你的云端配置)。

![AWS 连接外部存储对话框,显示项目选择、Bucket ARN、IAM role ARN,以及“连接并验证”按钮。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-07-platform-aws-connect.webp)

对于 **Azure**,请输入 **Tenant ID**, **Subscription ID**, **Resource group**, **存储账户名称**，以及 **容器名称**。在弹窗中向下滚动以填写所有字段。

![Azure 的“连接外部存储”对话框，显示项目和 Azure 存储配置字段。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-08-platform-azure-connect.webp)

对于 **GCP**,请输入 **存储桶名称**, **工作负载身份项目编号**, **工作负载身份池 ID**，以及 **工作负载身份提供者 ID**。在弹窗中向下滚动以填写所有字段。

![GCP 的“连接外部存储”对话框，显示项目选择、存储桶名称、工作负载身份项目编号和工作负载身份池 ID。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-platform-gcp-connect.webp)

##### 3. 连接并验证

选择 **连接并验证**。API 控制台会注册该存储、运行验证,并刷新存储状态和项目策略。仅注册不会更改该策略。

等待 **存储已验证** 以及项目现已使用带 PSP 的 ZDR 的确认信息,然后选择 **完成**.

![OpenAI 项目设置页面,展示了已验证的 AWS S3 存储以及带私有安全处理的零数据保留策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-09-platform-storage-validated.webp)

如果注册后验证失败,请修复所报告的问题并选择 **重新验证**。若稍后继续,请在 **已注册存储** 下选择该目标,并选择 **验证存储**。如果 API 控制台无法刷新结果,请选择 **刷新状态** 后再重新开始。

#### 方式 2：管理 API

此方法请使用组织管理员 API 密钥。使用以下命令注册存储，然后继续 [**3. 验证你的设置**](#3-verify-your-setup) 以运行校验。

##### 1. 准备你的 API 设置

将你组织的 Admin API 密钥安全地加载到 `OPENAI_ADMIN_KEY`.

将 `OPENAI_API_BASE` 设置为你的项目所确认的端点： `https://api.openai.com` 用于全球， `https://us.api.openai.com` 用于美国，或者 `https://eu.api.openai.com` 用于欧洲。

将下面的占位符替换为该端点以及你的 OpenAI 组织 ID。在同一 shell 会话中运行剩余的命令。

```bash
OPENAI_API_BASE='<OPENAI_API_BASE>'
OPENAI_ORG_ID='<OPENAI_ORG_ID>'
OPENAI_STORAGE_URL="$OPENAI_API_BASE/v1/organization/external_storage"
```

##### 2. 发送注册请求

仅运行适用于你的服务提供商的请求。将每个 `CUSTOMER_...` 占位符替换为你的 ID 以及你创建的资源。

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

响应中包含一个以 `id` 开头的 `extstorage_` 和 `status: "pending"`。请保留该 ID 以便进行验证。API 控制台会显示 **Pending validation** 并保持项目的保留策略不变。

##### 3. 验证你的设置

对于 API 验证，将 `EXTERNAL_STORAGE_ID` 替换为注册时返回的 ID，然后运行：

```bash
EXTERNAL_STORAGE_ID='<EXTERNAL_STORAGE_ID>'
curl --fail-with-body -sS -X POST \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID/validate" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

成功响应包含 `status: "validated"`。验证会检查配置与访问权限，然后为该项目激活客户管理的保留策略。API 控制台会显示 **Validated** 以及只读策略 **Zero Data Retention with Private Safety Processing**.

如果你使用了 Management API，请获取已保存的注册信息：

```bash
curl --fail-with-body -sS \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

对于任意一种方式，打开 **Project Settings > Data retention** 并选择 **刷新**。确认目标位置、提供商、地理区域，以及 **Validated** 状态，然后检查策略是否为 **Zero Data Retention with Private Safety Processing**。组织的 Data retention（数据保留）表还会显示每个项目的存储和状态。

![OpenAI Project Settings Data retention 页面，显示与 AWS S3 外部存储的连接，状态为 Validated，保留策略为 Zero Data Retention with PSP。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-05-verify-project-retention.webp)

**Validated** 仅记录一次成功的检查，而非持续的存储健康状况。 **刷新** 不会重新运行验证。请使用 [Operations and Troubleshooting](#operate-and-troubleshoot-customer-storage) 进行持续监控和重新验证。







<a id="customer-storage-operations-steps"></a>



<a id="operate-and-troubleshoot-customer-storage"></a>



## 故障排除



### 检查存储状态

打开 **Organization settings > Data controls > Data retention** 对于项目表，或者 **Project Settings > Data retention** 获取项目的存储详细信息。检查目的地和地理区域，然后查看状态。你也可以通过 API 在 [设置和验证](#set-up-and-verify-customer-storage).

- **待验证** (`pending`）：存储已注册，但尚未通过验证。在验证成功之前，项目的保留策略保持不变。
- **已验证** (`validated`）：存储已通过验证检查。但这并不保证实时连通性。
- **需要关注** (`unhealthy`）：检查发现存储或配置问题。请修复原因并重新验证。

**刷新** 重新加载已保存的状态；它不会测试连接。运行时失败可能不会更改显示的状态。如果 API 控制台无法加载存储，请在将其视为存储桶故障之前检查 API。

### 监控存储活动

分别检查以下来源：

- **存储注册：** 检查项目、提供商、地理位置以及验证结果。
- **云活动：** 在启用的情况下，检查提供商访问日志以及读写错误，并将验证探测与实际的 PSP 活动区分开来。
- **安全与合规事件：** 在单独启用的前提下，检查合规 API 中可用的内容生命周期事件。这些事件既不是存储注册事件，也不是云访问日志。

你的采样策略决定了哪些请求会创建保留对象。仅凭缺失的对象或事件，并不能说明存储已失败。

#### 识别验证探针

对于 AWS、Azure 和 GCP，验证会将测试对象写入你配置的存储目标。它们的名称包含 `csg_validation_` 后跟一个随机的十六进制后缀。每个对象的内容包含文本 `customer-storage-gateway-validation:csg_validation_<suffix>`，使用与其名称相同的后缀。它们不包含任何客户提示或响应。OpenAI 使用配置的访问权限读取每个测试对象，然后尝试一次未经身份验证的 `GET` 对同一对象的访问，以检查是否存在公共访问。私有存储预期会拒绝该未经身份验证的请求。根据你的日志记录配置，这些请求可能会出现在你的提供商的访问日志中。

对于 AWS，验证还会检查该角色的 `sts:ExternalId` 限制。在使用你项目的外部 ID 成功代入你配置的角色后，OpenAI 测试 `AssumeRole` 在不带外部 ID 以及使用故意无效的测试 ID 时的调用 `proj_smoketest-verifier`。这两个测试调用预期都会返回 `AccessDenied`。它们使用相同的 OpenAI 身份和配置的角色；测试 ID 并不标识其他客户的项目。AWS CloudTrail 不会在你的账户中记录这些被拒绝的跨账户角色代入尝试。请将信任策略限制在你的真实项目 ID 上；不要允许该测试 ID，也不要移除外部 ID 条件来使这些探测通过。

### 从失败中恢复

#### 1. 检查错误

- `customer_managed_retention_not_enabled`：请你的对接联系人确认组织访问权限。
- **身份验证或权限失败：** 确认你使用的是组织管理员密钥，并具备所需的外部存储权限。
- **配置问题：** 检查云身份、信任策略或访问权限、生命周期规则，以及已批准的网络配置。
- `401 customer_storage_not_ready`：确认所请求项目所在地理区域存在已验证的存储。
- `incorrect_hostname`：使用与你的固定驻留项目配置匹配的主机名。
- `503 external_storage_validation_unavailable`：稍后重试。如果问题仍然存在，请联系支持。

#### 2. 再次校验

修复配置后，打开 **Connect storage** ，进入项目并使用组织管理员 API 密钥运行验证命令。获取注册信息或选择 **刷新** 以确认 **Validated**。仅刷新不会运行验证。

### 联系支持团队

如果在排查后仍然存在存储或验证问题， [联系 OpenAI 支持团队](https://help.openai.com/en/).

### 更改或停止你的设置

若要断开存储连接，请打开 **Project Settings > Data retention**。在 **“外部存储”**，中，选择该连接旁边的删除图标，然后通过 **“断开存储连接”**.

如果项目使用 ZDR with PSP，断开其最后一个存储连接会自动将其保留策略重置为你所在组织的默认策略。如果还有其他连接，则该策略保持不变。当策略发生变化时，需要 ZDR with PSP 的模型可能变得不可用。

断开存储连接不会删除你的云存储或其内容。请继续满足现有记录的保留要求。为每个新项目和驻留位置完成设置和验证。





## 持续的客户责任

使用 ZDR 与 PSP 的客户必须：

- **注册并验证 PSP 存储。** 通过 OpenAI 的管理员 API 为每个启用 PSP 的项目和数据驻留位置注册并验证存储桶，并按照 OpenAI 发布的指南配置 PSP 服务存储桶访问权限。
- **加密记录至少保留 30 天**。配置存储生命周期规则，确保不会过早删除 PSP 记录。
- **维护存储和密钥访问**。保持区域存储、服务权限以及客户管理的密钥授权正确配置。
- **修复配置问题。** 在 OpenAI 发出通知后，纠正存储配置问题。
- **回应有关安全问题的通知。** 与 OpenAI 协作调查并处理该问题。

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