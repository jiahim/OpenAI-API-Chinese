# ZDR with Private Safety Processing

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

li+li]:mt-2! [&_ul>li>p]:my-0! [&_#built-with-three-principles+ol>li+li]:mt-2! [&_#check-storage-status]:mt-0!">

Zero Data Retention with Private Safety Processing（ZDR with PSP）支持离线、自动化的安全审查，同时 OpenAI 不会保留客户的提示或响应。本指南概述了 ZDR with PSP 的工作原理以及你的运维职责。有关完整的架构和安全模型，请参阅 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf).

## 基于三大原则构建

1. **客户掌控其内容**

   客户内容存储在客户控制的存储中。客户掌控检索和解密受保护安全记录所需的权限以及客户管理的 Enterprise Key Management（EKM）授权。
2. **无人工审查**

   安全审查不得为 OpenAI 人员提供读取受保护客户内容的新途径。加密的客户内容在经过批准的、具备硬件可信证明的安全运行时中解密，该运行时禁用人工访问。只有受限的安全信号和运营元数据会以明文形式离开 PSP 受保护的审查环境。
3. **内容保留仅用于安全目的**

   存储在客户控制存储中的内容仅用于经批准的安全用途。客户内容不得用于训练模型，也不得提供给 OpenAI 内部的其他团队或其合作伙伴。

## ZDR 与 PSP 的工作原理

该架构由两条流程组成：

- API 请求与保留流程会将符合条件的 API 内容保护并保留在客户可控的存储容器中。
- 异步安全流水线仅针对已批准的自动化安全审查调取记录，并输出有限范围的安全决策。

### API 请求与保留

一段交互（即你的提示与模型的响应）会通过安全分类器转交或经批准的采样策略被选中。转交并不构成策略违规。

系统会对该记录进行加密，并将其写入你的区域云存储中。OpenAI 仅维护一份索引，其中包含运维元数据与存储引用，而不保存内容副本。加密与存储过程以异步方式运行，不会阻塞推理。




![API 请求流程示意，展示存储在客户控制存储中的加密安全记录。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection.webp)







![API 请求流程示意，展示存储在客户控制存储中的加密安全记录。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection-dark.webp)







### 异步安全流水线

ZDR 与 PSP 会从你的存储中取出加密记录，并校验它们是否可被解密。Safety Review Runtime 是一个经硬件可信验证的计算环境，会禁用人工访问，其设计目标是成为唯一可以解密客户内容的工作负载。它使用经审批的审查提示词和输出模式执行自动化安全审查，且不暴露客户内容。

只有预定义、有界的安全信号和已批准的运维元数据可以以明文形式离开审查流程。详细结果在离开运行时之前会被加密，并按原始记录的过期时间存放在你的云存储中。ZDR 与 PSP 会加密这些记录，并以 30 天的 TTL 将它们写入你的区域云存储。




![异步安全审查流程，展示加密记录取出、受保护的审查以及有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review.webp)







![异步安全审查流程，展示加密记录取出、受保护的审查以及有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review-dark.webp)




## Customer Content Encryption

每条存储记录在保留于客户存储中时均经过双重加密：

- **OpenAI 管理的 HPKE 加密：** 内部加密层将客户内容的解密限制在经授权的安全审查运行时环境中。
- **客户管理加密：** [Enterprise Key Management (EKM)](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 使用由你控制的密钥管理服务添加一层外层加密。

启用 EKM 后，仅凭 OpenAI 的内部解密密钥不足以解密已存储的记录：你提供的客户管理密钥授权也是必需的。撤销该授权会阻止解密保留的记录，但不会删除它们，也不会撤销已完成的处理。

我们建议启用 EKM 以获得这一额外的控制能力。请参阅 [EKM 技术常见问题解答](https://help.openai.com/en/articles/20000945-ekm-technical-faq) 以了解授权与撤销的相关说明，并参阅 [技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf) 以了解加密、机密计算、护栏以及透明度方面的内容。



<a id="customer-storage-setup-steps"></a>



<a id="set-up-and-verify-customer-storage"></a>



## 设置并验证存储



将自己的 AWS S3 存储桶、Azure Blob 容器或 Google Cloud Storage 存储桶连接到 OpenAI 项目。按照你所使用云的设置步骤操作，然后注册并验证该连接。

ZDR 与 PSP 按项目启用。启用后，PSP 策略将应用于该项目中的所有 API 流量，包括对原本不要求 PSP 的模型的请求。若要在不使用 PSP 的情况下对符合条件的模型使用 ZDR，请通过一个为不使用 PSP 的 ZDR 配置的独立项目来发送这些请求。

### 准备工作

- 已获批 Zero Data Retention 的组织可以直接在 API 控制台中配置 PSP 的 ZDR。如果你的组织尚未获批 ZDR，请参阅 [资格与审批要求](https://developers.openai.com/api/docs/guides/your-data#data-retention-controls-for-abuse-monitoring).
- 选择与项目数据驻留要求匹配的存储区域。你需要拥有在你的云账户中创建存储和委派访问权限的权限。
- 由组织管理员在 API 控制台中注册并验证存储。对于 Management API，请使用 OpenAI 组织管理员 API 密钥。项目管理员可以查看指引和状态；项目推理密钥无法用于 Management API 调用。

### 在 API 控制台中打开存储设置

1. 打开 **组织设置 > 数据控制 > 数据保留**，然后选择 **连接存储**.
2. 在 **连接外部存储**，中，选择 **AWS**, **Azure**，或 **GCP** 并选择你的项目。你也可以打开 **连接存储** 从 **项目设置 > 数据保留**.
3. 完成下方的云配置。然后在弹窗中输入你的存储详情并选择 **连接并验证**.

### 云服务特定设置



<a id="aws-s3"></a>



#### AWS S3



如果你使用的是 AWS，请完成以下步骤。对于其他云，请跳到 **Azure Blob Storage** 或 **Google Cloud Storage**.

#### 1. Create the bucket

在与项目数据驻留要求兼容的区域创建一个专用的 S3 存储桶。如果未启用数据驻留，推荐使用 us-west-1 区域。

- 保留 **禁用 ACL**.
- 开启 **阻止所有公共访问**.
- 记录存储桶 ARN。你将把它用作 `CUSTOMER_BUCKET_ARN` 下方。

![显示存储桶概览、AWS 区域和 Amazon Resource Name 的 AWS S3 存储桶属性页面。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-01-aws-create-bucket.webp)

#### 2. 设置生命周期规则

打开存储桶的 **管理 > 创建生命周期规则** 页面，并使用以下设置：

- **规则名称：** `psp-retention`
- **前缀：** `openai/`
- **操作：** 使对象的当前版本过期
- **时效：** 30 天

启用该规则。确保没有其他规则更早地使这些记录过期。这会设置对象的生命周期过期时间；OpenAI 的解密密钥过期时间是独立的。

![AWS S3 管理页面，显示生命周期配置、一条生命周期规则以及“创建生命周期规则”控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-02-aws-lifecycle-rule.webp)

#### 3. 创建访问策略

在 **IAM > 策略 > 创建策略**，中，选择 **JSON**。将 `CUSTOMER_BUCKET_ARN` 替换为你的存储桶 ARN，例如 `arn:aws:s3:::your-psp-bucket`，然后将该策略另存为 `psp-bucket-policy`.

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

![AWS IAM 选择受信实体页面，其中已选中自定义信任策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-03-aws-custom-trust-policy.webp)

使用下方策略。将 `CUSTOMER_PROJECT_ID` 替换为你的 OpenAI 项目 ID。OpenAI 主体 ARN 保持不变。

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

附加 `psp-bucket-policy` 到你正在创建的角色。你可以命名该角色为 `psp-role`。将其 ARN 记录为 `CUSTOMER_ROLE_ARN`；其中的项目 ID `sts:ExternalId` 必须与你注册的项目一致。

![AWS IAM 添加权限页面，其中已选中使用现有策略，并勾选了客户自主管理的 psp-bucket-policy。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-04-aws-iam-role.webp)

继续到 **注册你的存储**.







<a id="azure-blob-storage"></a>



#### Azure Blob Storage



如果你使用的是 Azure，请完成以下步骤。

#### 1. 创建存储账户

在商用 Azure 中创建专用账户。选择与项目数据驻留要求相符的已批准的美国或欧盟存储区域。

- **帐户种类：** `StorageV2`
- **基本信息 > 性能：** Standard
- **基本信息 > 冗余：** LRS 或 ZRS（首选）
- **高级 > 访问层：** 热
- **高级 > 分层命名空间：** 已禁用
- **网络 > 公共网络访问：** 已从所有网络启用
- **安全性 > 安全传输：** 需要 HTTPS；最低 TLS 1.2
- **安全性 > 匿名 Blob 访问：** 已禁用
- **安全性 > 存储帐户密钥访问：** 已禁用
- **安全性 > Microsoft Entra 授权：** 已启用

确认网络设置满足你的云要求。使用账户的 Primary Blob endpoint（主 Blob 终结点），而不是主权云或自定义终结点。

![Azure 存储帐户的“公共访问”设置，启用了“允许从所有网络进行公共网络访问”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-azure-public-access.webp)

![Azure 存储帐户的“安全”设置，启用了安全传输和 Microsoft Entra 授权，禁用了匿名访问和存储帐户密钥访问，并设置了最低 TLS 1.2。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-11-azure-security-settings.webp)

#### 2. 创建容器

在 **存储账户 > 数据存储 > 容器 > 添加容器**。中创建一个私有容器。然后在 **容器 > 设置 > 元数据** 中添加此容器元数据，并填入你的确切 OpenAI 组织 ID：

- `openai_organization_id`: 你的 OpenAI 组织 ID

将元数据添加到容器，而不是存储账户或单个 blob。

#### 3. 设置生命周期规则

在中添加一条已启用的规则 **存储账户 > 数据管理 > 生命周期管理 > 添加** ，应用于专用账户中的所有当前/基块 Blob：

- **操作：** 自上次修改起 30 天后删除
- **过滤器：** 无前缀或标签过滤器

![Azure 生命周期规则详情，该规则已应用于所有 Blob，并选中了“块 Blob”和“基础 Blob”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-12-azure-lifecycle-scope.webp)

![Azure 生命周期规则的基础 Blob 设置，用于在 Blob 30 天未修改后将其删除。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-13-azure-lifecycle-delete.webp)

#### 4. 授予 OpenAI 访问权限

请你的目录管理员将 OpenAI 的应用程序添加到你的租户，并将下方内容替换为你的 Azure 租户 ID `CUSTOMER_TENANT_ID` 。应用程序 ID 保持不变。

```bash
az login --tenant '<CUSTOMER_TENANT_ID>'
az ad sp create --id 'e5627955-3059-4a88-89f8-73843190624d' \
  --query '{name:displayName,objectId:id}' -o table
```

如果应用程序已存在，请使用 `az ad sp show` 配合相同的 `--id` 和查询语句，并记录该应用程序的名称及其租户本地对象 ID。

打开你的存储帐户，选择 **存储帐户 > 访问控制 (IAM) > 添加角色分配** 。选择 **读取者** 角色，将 **将访问权限分配给** 设置为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

![Azure 角色分配“成员”选项卡，显示已选择 Storage Blob Data Reader 角色和用户、组或服务主体。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-14-azure-role-members.webp)

![Azure “选择成员”窗格，其中 CSG - Azure Blob Storage Prod 作为应用程序列出。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-15-azure-select-application.webp)

然后选择 **存储 Blob 数据参与者** 角色，将 **将访问权限分配给** 设置为 **用户、组或服务主体**，并搜索选择 **CSG - Azure Blob Storage Prod**.

OpenAI 管理应用程序凭据。请勿创建或共享存储密钥、SAS 令牌或客户端密钥。







<a id="google-cloud-storage"></a>



#### Google Cloud Storage



#### 1. Create the bucket

在以下位置创建存储桶： **Cloud Storage > Buckets** 在与你的 OpenAI 项目数据驻留兼容的位置中，包含：

- **公共访问防护**: 启用。
- **访问控制**: 统一。

你可以选择性地禁用默认 **软删除策略（用于数据恢复）**；下一步将配置生命周期删除。

对于 Global 项目，请为你打算使用的每个区域重复此 GCP 设置。

![Google Cloud 存储桶访问设置，显示已开启“阻止公共访问”、访问控制为“统一”，以及 IP 过滤为“未配置”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access-controls.webp)

#### 2. 设置生命周期规则

在存储桶的 **生命周期** 标签页中，添加一个 **删除对象** 规则，条件如下：

- **对象名称匹配前缀**: `openai/`.
- **存在时间**：30 天。

![Google Cloud 生命周期规则，显示 Delete object、openai/ 对象前缀以及 Age 30。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-lifecycle-rule.webp)

#### 3. 查找你的 Google Cloud 项目编号

在 **IAM 和管理 > 设置**，复制项目的数字 **项目编号** 作为包含你工作负载身份池的项目编号 `<CUSTOMER_GCP_PROJECT_NUMBER>`.

#### 4. 创建工作负载身份池及提供者

在 **IAM & Admin > Workload Identity Federation**，创建一个工作负载身份池并添加一个 **OpenID Connect (OIDC)** 提供程序，配置如下：

- **Issuer (URL)**: `https://accounts.google.com`.
- **Allowed audiences**: `<CUSTOMER_PROJECT_ID>` (你的 OpenAI 项目 ID)。

![Google Cloud OIDC 提供商设置，显示 Google 签发者 URL 以及将 OpenAI 项目 ID 作为允许的受众。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-oidc-provider.webp)

配置以下属性映射：

| Google 属性           | OIDC 值      |
| -------------------------- | --------------- |
| `google.subject`           | `assertion.sub` |
| `attribute.openai_project` | `assertion.aud` |

设置以下属性条件。 **保持 OpenAI 的生产主体不变 `112981926705442324573` 保持不变。**

```text
assertion.sub == '112981926705442324573' && assertion.aud == '<CUSTOMER_PROJECT_ID>'
```

![Google Cloud 提供商属性映射 google.subject 到 assertion.sub，以及 attribute.openai_project 到 assertion.aud，条件用于限制 OpenAI 的生产主体和项目受众。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-provider-attributes.webp)

将池 ID 和提供商 ID 记录为 `<CUSTOMER_GCP_POOL_ID>` 和 `<CUSTOMER_GCP_PROVIDER_ID>`.

**多个 OpenAI 项目**

对于属于同一客户的项目，你可以复用该池和提供商。将每个项目 ID 添加到 **Allowed audiences** 并更新属性条件：

```text
assertion.sub == '112981926705442324573' &&
(assertion.aud == '<CUSTOMER_PROJECT_ID_1>' || assertion.aud == '<CUSTOMER_PROJECT_ID_2>')
```

为每个项目分别完成存储桶授权和存储注册。

#### 5. 创建自定义存储角色

在 **IAM 和管理 > 角色**，在该存储桶的 Google Cloud 项目中创建具有以下权限的自定义角色：

```text
storage.buckets.get
storage.objects.create
storage.objects.get
storage.objects.delete
```

#### 6. 向存储桶授予 OpenAI 访问权限

在存储桶的 **权限 > 授予访问权限**，添加此主体：

```text
principalSet://iam.googleapis.com/projects/<CUSTOMER_GCP_PROJECT_NUMBER>/locations/global/workloadIdentityPools/<CUSTOMER_GCP_POOL_ID>/attribute.openai_project/<CUSTOMER_PROJECT_ID>
```

选择你在第 5 步中创建的自定义角色。

![Google Cloud 存储桶访问表单，其中设置了 OpenAI 项目主体并选择了自定义存储角色。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access.webp)

继续到 **注册你的存储**.





### 注册你的存储

完成上述云端设置后，使用 API 控制台或 Management API 注册并验证你的存储。只需选择其中一种方法即可。

#### 选项 1：API 控制台

以组织管理员身份登录。API 控制台会使用你已登录的会话，使用此方法无需 Admin API 密钥或 curl 命令。

##### 1. 接入 Connect 存储

打开你的存储帐户，选择 **组织设置 > 数据控制 > 数据保留** 并选择 **连接存储**。你也可以从 **项目设置 > 数据保留**.

![OpenAI 组织数据控制页面，显示数据保留选项卡、项目策略表和连接存储控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-06-platform-open-storage.webp)

##### 2. 输入你的存储详细信息

选择 **AWS**, **Azure**，或 **GCP**，然后选择项目。如果你是从项目设置中打开的对话框，则该项目已自动选中。如果 **出现“Registered storage”** ，请选择 **Connect new storage** 以添加目标。

对于 **AWS**，请输入 **Bucket ARN** 和 **IAM role ARN** ，这些值来自你的云环境配置。

![AWS 的“连接外部存储”对话框，显示项目选择、Bucket ARN、IAM role ARN 以及连接并验证。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-07-platform-aws-connect.webp)

对于 **Azure**，请输入 **Tenant ID**, **Subscription ID**, **Resource group**, **存储账户名称**，以及 **容器名称**。在模态框中向下滚动以填写所有字段。

![Azure 的连接外部存储对话框，显示项目和 Azure 存储配置字段。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-08-platform-azure-connect.webp)

对于 **GCP**，选择你在 audience、attribute condition 和 bucket grant 中使用的 ID 所对应的 OpenAI 项目。填写以下四个字段：

| 字段                                | 来自 Google Cloud 配置中的值                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| **存储桶名称**                      | `<CUSTOMER_GCP_BUCKET_NAME>`                                                                 |
| **Workload Identity 项目编号** | `<CUSTOMER_GCP_PROJECT_NUMBER>`：包含该池的 Google Cloud 数字项目编号 |
| **Workload Identity 池 ID**        | `<CUSTOMER_GCP_POOL_ID>`                                                                     |
| **Workload Identity 提供方 ID**    | `<CUSTOMER_GCP_PROVIDER_ID>`                                                                 |

##### 3. 连接并验证

选择 **连接并验证**。API 控制台会注册该存储、运行验证，并刷新存储状态和项目策略。仅注册不会更改策略。

等待 **存储已验证** 并确认该项目现在使用的是带 PSP 的 ZDR，然后选择 **完成**.

![显示已验证的 AWS S3 存储以及采用 Private Safety Processing 的 Zero Data Retention 策略的 OpenAI 项目设置。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-09-platform-storage-validated.webp)

如果注册后验证失败，请修复所报告的问题并选择 **重新验证**。若要稍后继续，请在 **出现“Registered storage”** 下选择目标并选择 **验证存储**。如果 API 控制台无法刷新结果，请选择 **刷新状态** 后再重新开始。

#### 方案二：管理 API

为此方法使用组织管理员 API 密钥。使用以下命令注册存储，然后按照 [**3. 验证你的设置**](#3-verify-your-setup) 以运行校验。

##### 1. 准备你的 API 设置

将你的组织管理员 API 密钥安全地加载到 `OPENAI_ADMIN_KEY`.

将 `OPENAI_API_BASE` 设置为你的项目确认的端点： `https://api.openai.com` （全球）、 `https://us.api.openai.com` （美国）或 `https://eu.api.openai.com` （欧洲）。

将下面的占位符替换为该端点和你的 OpenAI 组织 ID。在同一 shell 会话中运行其余命令。

```bash
OPENAI_API_BASE='<OPENAI_API_BASE>'
OPENAI_ORG_ID='<OPENAI_ORG_ID>'
OPENAI_STORAGE_URL="$OPENAI_API_BASE/v1/organization/external_storage"
```

##### 2. 发送注册请求

仅为你所用的服务提供商运行该请求。请将每个 `CUSTOMER_...` 占位符替换为你的 ID 以及你所创建的资源。

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

响应包含一个 `id` ，开头为 `extstorage_` 和 `status: "pending"`。请保留该 ID 以便进行验证。API 控制台会显示 **Pending validation** ，并保持项目的保留策略不变。

##### 3. 验证你的设置

对于 API 验证，将 `EXTERNAL_STORAGE_ID` 替换为注册返回的 ID，然后运行：

```bash
EXTERNAL_STORAGE_ID='<EXTERNAL_STORAGE_ID>'
curl --fail-with-body -sS -X POST \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID/validate" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

成功的响应具有 `status: "validated"`。校验会检查配置和访问权限，然后为该项目启用客户管理的数据保留。API 控制台会显示 **已校验** 以及只读策略 **Zero Data Retention with Private Safety Processing**.

如果你使用了 Management API，请检索已保存的注册信息：

```bash
curl --fail-with-body -sS \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

无论使用哪种方法，请打开 **项目设置 > 数据保留** 并选择 **刷新**。确认目的地、提供商、地理位置以及 **已校验** 状态，然后检查策略是否为 **Zero Data Retention with Private Safety Processing**。组织的“数据保留”表格还会显示每个项目的存储和状态。

![OpenAI 项目设置数据保留页面，显示已通过校验状态以及 Zero Data Retention with PSP 数据保留策略的 AWS S3 外部存储连接。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-05-verify-project-retention.webp)

**已校验** 记录的是一次成功的检查，而不是持续的存储健康状况。 **刷新** 不会重新运行校验。请使用 [运维与故障排除](#operate-and-troubleshoot-customer-storage) 进行持续的监控和重新校验。







<a id="customer-storage-operations-steps"></a>



<a id="operate-and-troubleshoot-customer-storage"></a>



## 故障排除



### 检查存储状态

打开你的存储帐户，选择 **组织设置 > 数据控制 > 数据保留** 针对项目表，或 **项目设置 > 数据保留** 用于获取项目的存储详情。请检查目标和地理位置，然后读取状态。你也可以通过以下 API 来检索注册信息 [设置和验证](#set-up-and-verify-customer-storage).

- **待验证** (`pending`)：存储已注册但尚未通过验证。在验证成功之前，项目的保留策略保持不变。
- **已验证** (`validated`)：存储已通过验证检查。这并不保证实时连接可用。
- **需要关注** (`unhealthy`)：检查发现存储或配置存在问题。请修复原因后重新验证。

**刷新** 重新加载已保存的状态，但不会测试连接。运行时失败可能不会改变所显示的状态。如果 API 控制台无法加载存储，请先检查 API，再将其视为存储桶故障。

### 监控存储活动

分别检查以下来源：

- **存储注册：** 检查项目、提供商、地理区域以及验证结果。
- **云活动：** 检查提供商的访问日志和读/写错误（如已启用）。将验证探测与实际的 PSP 活动区分开。
- **安全与合规事件：** 如果单独启用，请检查 Compliance API 中可用的内容生命周期事件。这些并非存储注册事件或云访问日志。

你的采样策略决定了哪些请求会创建保留对象。缺失对象或事件本身并不意味着存储失败。

### 从故障中恢复

#### 1. 检查错误

- `customer_managed_retention_not_enabled`: 请联系你的 onboarding 联系人，确认组织访问权限。
- **身份验证或权限错误：** 确认你使用的组织 Admin key 具备所需的 external-storage 权限。
- **配置问题：** 检查云身份、信任策略或访问权限、生命周期规则以及已批准的网络配置。
- `401 customer_storage_not_ready`: 确认在所请求项目的地理区域中存在已验证的存储。
- `incorrect_hostname`: 使用与你的固定驻留项目配置相匹配的主机名。
- `503 external_storage_validation_unavailable`: 稍后重试。如果问题仍然存在，请联系支持团队。

#### 2. 再次验证

修复配置后，打开 **连接存储** 进入项目，使用具备组织管理员权限的 API key 运行验证命令。然后获取注册信息或选择 **刷新** 进行确认 **已校验**。仅刷新不会执行验证。

### 联系技术支持

如果在排查后仍然遇到存储或验证问题， [联系 OpenAI 客服](https://help.openai.com/en/).

### 更改或停止你的设置

要断开存储连接，请打开 **项目设置 > 数据保留**。在 **外部存储**，中，选择该连接旁边的删除图标，然后确认 **断开存储**.

如果项目使用 ZDR with PSP，断开其最后一个存储连接会自动将保留策略重置为你所在组织的默认策略。如果还保留其他连接，则策略保持不变。需要 ZDR with PSP 的模型在策略变更后可能变得不可用。

断开存储不会删除你的云存储或其内容。请继续满足现有记录的保留要求。为每个新项目和驻留地完成设置和验证。





## 持续的客户责任

使用 ZDR 和 PSP 的客户必须：

- **注册并验证 PSP 存储。** 通过 OpenAI 的管理 API 为每个启用 PSP 的项目和数据驻留位置注册并验证存储桶，并按照 OpenAI 发布的指南配置 PSP 服务桶访问权限。
- **保留加密记录至少 30 天**. 配置存储生命周期规则，使其不会提前删除 PSP 记录。
- **维护存储和密钥访问权限**. 正确配置区域存储、服务权限和客户管理的密钥授权。
- **修复配置问题。** 在 OpenAI 提供通知后，修正存储配置问题。
- **回应有关安全问题的通知。** 与 OpenAI 协作调查并解决该问题。

## Resources

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