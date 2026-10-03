# 使用私有安全处理的 ZDR

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

li+li]:mt-2! [&_ul>li>p]:my-0! [&_#built-with-three-principles+ol>li+li]:mt-2! [&_#check-storage-status]:mt-0!">

零数据留存结合私有安全处理（ZDR with PSP）支持离线、自动化的安全审查，且 OpenAI 不会保留客户的提示词或响应。本指南概述了 ZDR with PSP 的工作原理以及你的运营职责。如需了解完整的架构和安全模型，请参阅 [私有安全处理技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf).

## 以三大原则构建

1. **客户掌控其内容**

   客户内容存储在客户控制的存储中。客户掌控用于检索和解密受保护安全记录所需的权限以及客户管理的 Enterprise Key Management (EKM) 授权。
2. **无人工审查**

   安全审查不得为 OpenAI 人员创建一种新的方式来读取受保护的客户内容。加密的客户内容会在已批准的、经过硬件证明的安全运行时中解密，该运行时禁用了人工访问权限。只有受限的安全信号和操作元数据会以明文形式离开 PSP 受保护审查。
3. **仅出于安全目的的内容保留**

   存储在客户控制的存储中的内容仅用于已批准的安全目的。客户内容不得用于训练模型，也不得提供给 OpenAI 内部的其他团队或其合作伙伴。

## ZDR 与 PSP 的工作原理

该架构由两条流程组成：

- API 请求和保留流程会在客户控制的存储容器中保护并保留符合资格的 API 内容。
- 异步安全流水线仅获取经批准的自动化安全审查所需的记录，并给出有限范围的安全决策。

### API 请求与保留

一次交互——你的提示词与模型的响应——会通过安全分类器的转交或经批准的采样策略被选中。转交并不构成违反策略。

系统会加密该记录并将其写入你的区域云存储。OpenAI 仅保留一份包含运维元数据和存储引用的索引，而非内容副本。加密和存储过程异步执行，不会阻塞推理。




![API 请求流程图，显示加密的安全记录被存储在客户可控的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection.webp)







![API 请求流程图，显示加密的安全记录被存储在客户可控的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection-dark.webp)







### 异步安全流水线

ZDR with PSP 从你的存储中检索加密记录，并检查其可解密能力。Safety Review Runtime 是一个硬件证明的计算环境，禁用了人工访问，被设计为唯一可以解密客户内容的工作负载。它使用经过审批的审阅 prompt 和输出结构执行自动化安全审阅，且不会暴露客户内容。

只有预定义的、有界的安全信号以及经过审批的运维元数据可以以明文形式离开审阅环境。详细结果在离开运行时之前会被加密，并以原始记录的过期时间存储在你的云存储中。ZDR with PSP 会加密这些记录，并将其以 30 天的 TTL 写入你的区域云存储。




![异步安全审阅流程，展示加密记录检索、受保护的审阅和有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review.webp)







![异步安全审阅流程，展示加密记录检索、受保护的审阅和有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review-dark.webp)




## 客户内容加密

每条存储记录在保留到客户存储中时都会进行双重加密：

- **OpenAI 托管的 HPKE 加密：** 内层加密将客户内容的解密权限限制在已授权的安全审查运行时内。
- **客户管理的加密：** [Enterprise Key Management (EKM)](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 使用由你控制的密钥管理服务增加一层外层加密。

启用 EKM 后，OpenAI 的内部解密密钥不足以解密已存储的记录：还需要你客户管理的密钥授权。撤销该授权会阻止对保留记录的解密，但不会删除这些记录，也无法撤销已完成的处理。

我们建议启用 EKM 以获得这一额外控制。详见 [EKM 技术常见问题解答](https://help.openai.com/en/articles/20000945-ekm-technical-faq) （了解授权与撤销），以及 [技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf) （了解加密、机密计算、护栏与透明性）。



<a id="customer-storage-setup-steps"></a>



<a id="set-up-and-verify-customer-storage"></a>



## 设置并验证存储



将你自己的 AWS S3 存储桶、Azure Blob 容器或 Google Cloud Storage 存储桶连接到 OpenAI 项目。按照你所使用云的设置步骤操作，然后注册并验证该连接。

ZDR with PSP 是按项目启用的。启用后，PSP 策略将适用于该项目中的所有 API 流量，包括对其他情况下不需要 PSP 的模型的请求。若要在符合条件的模型上使用不带 PSP 的 ZDR，请通过另一个配置为不带 PSP 的 ZDR 的项目发送这些请求。

### 准备工作

- 已获批 Zero Data Retention 的组织可以直接在 API 控制台中配置带 PSP 的 ZDR。如果你的组织尚未获得 ZDR 批准，请参阅 [资格与审批要求](https://developers.openai.com/api/docs/guides/your-data#data-retention-controls-for-abuse-monitoring).
- 选择与项目数据驻留要求匹配的存储区域。你需要拥有在你的云账户中创建存储和委托访问的权限。
- 让组织管理员在 API 控制台中注册并验证存储。对于 Management API，请使用 OpenAI 组织的 Admin API 密钥。项目管理员可以查看相关指引和状态；项目推理密钥无法用于 Management API 调用。

### 在 API 控制台中打开存储设置

1. 打开 **Organization settings > Data controls > Data retention**，然后选择 **Connect storage**.
2. 在 **Connect external storage**，中，选择 **AWS**, **Azure**，或 **GCP** 并选择你的项目。你也可以从 **Connect storage** 从 **Project Settings > Data retention**.
3. 完成下方云设置。然后在弹窗中输入存储详情并选择 **Connect and validate**.

### 云相关设置



<a id="aws-s3"></a>



#### AWS S3



如果你使用的是 AWS，请完成以下步骤。其他云服务请跳至 **Azure Blob Storage** 或 **Google Cloud Storage**.

#### 1. 创建存储桶

在与项目数据驻留要求兼容的区域中创建一个专用 S3 存储桶。如果数据驻留功能未启用，推荐区域为 us-west-1。

- 保留 **ACL 已禁用**.
- 启用 **阻止所有公有访问**.
- 记录该存储桶的 ARN。稍后你将把它用作 `CUSTOMER_BUCKET_ARN` 如下。

![AWS S3 存储桶属性页面，显示存储桶概览、AWS 区域和 Amazon 资源名称。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-01-aws-create-bucket.webp)

#### 2. 设置生命周期规则

打开存储桶的 **管理 > 创建生命周期规则** 页面并使用以下设置：

- **规则名称：** `psp-retention`
- **前缀：** `openai/`
- **操作：** 使对象的当前版本过期
- **期限：** 30 天

启用该规则。确保没有其他规则更早地让这些记录过期。这会设置对象的生命周期过期时间；OpenAI 的解密密钥过期时间是独立的。

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

![AWS IAM“选择可信实体”页面，选中“自定义信任策略”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-03-aws-custom-trust-policy.webp)

使用下方策略。将 `CUSTOMER_PROJECT_ID` 替换为你的 OpenAI 项目 ID。保持 OpenAI 主体 ARN 不变。

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

将 `psp-bucket-policy` 附加到你正在创建的角色。你可以将该角色命名为 `psp-role`。将其 ARN 记录为 `CUSTOMER_ROLE_ARN`；其中的项目 ID `sts:ExternalId` 必须与你注册的项目一致。

![AWS IAM“添加权限”页面，选中“使用现有策略”并勾选客户托管的 psp-bucket-policy。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-04-aws-iam-role.webp)

继续执行 **注册你的存储**.







<a id="azure-blob-storage"></a>



#### Azure Blob Storage



如果你使用的是 Azure，请完成这些步骤。

#### 1. Create the storage account

在商业版 Azure 中创建一个专用账户。选择与你项目数据驻留要求匹配的已批准的美国或欧盟存储区域。

- **Account kind:** `StorageV2`
- **Basics > Performance:** Standard
- **Basics > Redundancy:** LRS or ZRS (preferred)
- **Advanced > Access tier:** Hot
- **Advanced > Hierarchical namespace:** Disabled
- **Networking > Public network access:** Enabled from all networks
- **Security > Secure transfer:** HTTPS required; minimum TLS 1.2
- **Security > Anonymous Blob access:** Disabled
- **Security > Storage account key access:** Disabled
- **Security > Microsoft Entra Authorization:** Enabled

确认网络设置满足你的云要求。使用该账户的主要 Blob 终结点，而不是主权云或自定义终结点。

![Azure 存储账户公共访问设置，启用来自所有网络的公共网络访问。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-azure-public-access.webp)

![Azure 存储账户安全设置，启用安全传输和 Microsoft Entra 授权，禁用匿名访问和存储账户密钥访问，最低 TLS 版本为 1.2。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-11-azure-security-settings.webp)

#### 2. 创建容器

在以下位置创建专用容器： **存储账户 > 数据存储 > 容器 > 添加容器**。在以下位置添加此容器的元数据： **容器 > 设置 > 元数据** 并填入你的 OpenAI 组织 ID：

- `openai_organization_id`: 你的 OpenAI 组织 ID

将元数据添加到容器，而不是存储账户或各个 blob。

#### 3. 设置生命周期规则

在以下位置添加已启用的规则 **存储账户 > 数据管理 > 生命周期管理 > 添加** 该规则适用于专用账户中的所有当前/基块 Blob：

- **操作：** 在上次修改后的 30 天后删除
- **筛选条件:** 无前缀或标签筛选

![Azure 生命周期规则详细信息，已将规则应用于所有 blob、块 blob 和所选 Base blob。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-12-azure-lifecycle-scope.webp)

![Azure 生命周期规则 Base blob 设置：在 30 天未修改后删除 blob。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-13-azure-lifecycle-delete.webp)

#### 4. 授予 OpenAI 访问权限

请你的目录管理员将 OpenAI 的应用程序添加到你的租户。将下文中的 `CUSTOMER_TENANT_ID` 占位符替换为你的 Azure 租户 ID。应用程序 ID 保持不变。

```bash
az login --tenant '<CUSTOMER_TENANT_ID>'
az ad sp create --id 'e5627955-3059-4a88-89f8-73843190624d' \
  --query '{name:displayName,objectId:id}' -o table
```

如果应用程序已存在，请使用 `az ad sp show` 相同的 `--id` 和查询。记录应用程序名称及其租户本地对象 ID。

打开 **存储帐户 > 访问控制 (IAM) > 添加角色分配** ，在你的存储帐户上进行。选择 **Reader** 角色，将 **Assign access to** 设置为 **User, group, or service principal**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

![Azure 角色分配 Members 选项卡，显示已选择 Storage Blob Data Reader 角色和 User, group, or service principal。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-14-azure-role-members.webp)

![Azure Select members 窗格，其中 CSG - Azure Blob Storage Prod 列为应用程序。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-15-azure-select-application.webp)

然后选择 **Storage Blob Data Contributor** 角色，将 **Assign access to** 设置为 **User, group, or service principal**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

OpenAI 管理应用凭据。请勿创建或共享存储密钥、SAS 令牌或客户端密钥。







<a id="google-cloud-storage"></a>



#### Google Cloud Storage



#### 1. 创建存储桶

在 **Cloud Storage > 存储桶** 中创建一个与你的 OpenAI 项目数据驻留位置兼容的存储桶，使用以下命令：

- **Public access prevention**: On.
- **Access control**: Uniform.

你可以选择禁用默认的 **软删除策略（用于数据恢复）**；下一步将配置生命周期删除。

对于 Global 项目，请为你打算使用的每个区域重复执行此 GCP 设置。

![Google Cloud 存储桶访问设置，显示“公共访问防护”已开启、“访问控制”设置为“统一”，以及“IP 过滤”未配置。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access-controls.webp)

#### 2. 设置生命周期规则

在你的存储桶的 **生命周期** 标签页中，添加一个 **删除对象** 规则，并使用以下条件：

- **对象名称与前缀匹配**: `openai/`.
- **存活时间**: 30 天。

![显示“删除对象”、“openai/”对象前缀和“年龄 30”的 Google Cloud 生命周期规则。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-lifecycle-rule.webp)

#### 3. 找到你的 Google Cloud 项目编号

在 **IAM 和管理 > 设置**，复制包含你的工作负载身份池的项目 **项目编号** ，将其作为 `<CUSTOMER_GCP_PROJECT_NUMBER>`.

#### 4. 创建工作负载身份池和提供方

在 **IAM 和管理 > Workload Identity Federation**，创建一个 workload identity 池，并通过以下方式添加一个 **OpenID Connect (OIDC)** 提供方：

- **Issuer (URL)**: `https://accounts.google.com`.
- **Allowed audiences**: `<CUSTOMER_PROJECT_ID>` (your OpenAI project ID).

![Google Cloud OIDC 提供商设置，其中 Google 颁发者 URL 和一个 OpenAI 项目 ID 作为允许的受众（audience）。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-oidc-provider.webp)

配置以下属性映射：

| Google 属性           | OIDC 值      |
| -------------------------- | --------------- |
| `google.subject`           | `assertion.sub` |
| `attribute.openai_project` | `assertion.aud` |

设置下面的属性条件。 **保持 OpenAI 的生产标识主体 `112981926705442324573` 不变。**

```text
assertion.sub == '112981926705442324573' && assertion.aud == '<CUSTOMER_PROJECT_ID>'
```

![Google Cloud 提供商属性将 google.subject 映射到 assertion.sub，将 attribute.openai_project 映射到 assertion.aud，并使用限制 OpenAI 生产主体和项目受众的条件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-provider-attributes.webp)

记录 pool 和 provider 的 ID 为 `<CUSTOMER_GCP_POOL_ID>` 和 `<CUSTOMER_GCP_PROVIDER_ID>`.

**多个 OpenAI 项目**

对于属于同一客户的项目，你可以复用 pool 和 provider。将每个项目 ID 添加到 **Allowed audiences** 并更新属性条件：

```text
assertion.sub == '112981926705442324573' &&
(assertion.aud == '<CUSTOMER_PROJECT_ID_1>' || assertion.aud == '<CUSTOMER_PROJECT_ID_2>')
```

分别为每个项目完成存储桶授权和存储注册。

#### 5. 创建自定义存储角色

在 **IAM & Admin > 角色**，在存储桶的 Google Cloud 项目中使用以下权限创建一个自定义角色：

```text
storage.buckets.get
storage.objects.create
storage.objects.get
storage.objects.delete
```

#### 6. 授予 OpenAI 对该存储桶的访问权限

在你的存储桶的 **权限 > 授予访问权限**，添加此主体：

```text
principalSet://iam.googleapis.com/projects/<CUSTOMER_GCP_PROJECT_NUMBER>/locations/global/workloadIdentityPools/<CUSTOMER_GCP_POOL_ID>/attribute.openai_project/<CUSTOMER_PROJECT_ID>
```

选择在第 5 步中创建的自定义角色。

![Google Cloud 存储桶访问表单，其中设置了 OpenAI 项目主体并选择了自定义存储角色。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-gcp-bucket-access.webp)

继续执行 **注册你的存储**.





### 注册你的存储

完成上述云端设置后,使用 API 控制台或管理 API 来注册并验证你的存储。只需选择其中一种方式即可。

#### 方式 1：API 控制台

以组织管理员身份登录。API 控制台使用你已登录的会话；此方法无需管理员 API 密钥或 curl 命令。

##### 1. 接入 Connect 存储

打开 **Organization settings > Data controls > Data retention** 并选择 **Connect storage**。你也可以从 **Project Settings > Data retention**.

![OpenAI organization Data controls 页面，显示 Data retention 选项卡、项目策略表和 Connect storage 控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-06-platform-open-storage.webp)

##### 2. 输入你的存储详情

选择 **AWS**, **Azure**，或 **GCP**，然后选择项目。如果你是从项目设置中打开此对话框，则该项目已被选中。如果 **已注册的存储** 出现，请选择 **连接新存储** 以添加目标。

对于 **AWS**，请输入 **Bucket ARN** 和 **IAM role ARN** ，这些信息来自你的云设置。

![AWS 的连接外部存储对话框，显示项目选择、Bucket ARN、IAM role ARN 以及连接并验证。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-07-platform-aws-connect.webp)

对于 **Azure**，请输入 **Tenant ID**, **Subscription ID**, **Resource group**, **存储账户名称**，以及 **容器名称**。在对话框中向下滚动以填写所有字段。

![Azure 的“连接外部存储”对话框，显示项目和 Azure 存储配置字段。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-08-platform-azure-connect.webp)

对于 **GCP**，请输入 **存储桶名称**, **工作负载身份项目编号**, **工作负载身份池 ID**，以及 **工作负载身份提供方 ID**。在对话框中向下滚动以填写所有字段。

![GCP 的“连接外部存储”对话框，显示项目选择、存储桶名称、工作负载身份项目编号和工作负载身份池 ID。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-platform-gcp-connect.webp)

##### 3. 连接并验证

选择 **连接并验证**。API 控制台会注册该存储、运行验证，并刷新存储状态与项目策略。仅注册不会更改策略。

等待 **存储已验证** 以及项目现在使用 ZDR with PSP 的确认，然后选择 **完成**.

![OpenAI 项目设置，显示已验证的 AWS S3 存储以及 Zero Data Retention with Private Safety Processing 策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-09-platform-storage-validated.webp)

如果注册后验证失败，请修复报告的问题并选择 **重试验证**。若要稍后继续，请在以下位置选择目标： **已注册的存储** 并选择 **验证存储**。如果 API 控制台无法刷新结果，请选择 **刷新状态** 后再重新开始。

#### 选项二：管理 API

为此方法使用组织管理员 API 密钥。使用以下命令注册存储，然后继续 [**3. 验证你的设置**](#3-verify-your-setup) 以运行验证。

##### 1. 准备你的 API 设置

将你的组织管理员 API 密钥安全地加载到 `OPENAI_ADMIN_KEY`.

设置 `OPENAI_API_BASE` 为你的项目确认的端点： `https://api.openai.com` 为全球， `https://us.api.openai.com` 为美国，或 `https://eu.api.openai.com` 为欧洲。

将下面的占位符替换为该端点和你的 OpenAI 组织 ID。在同一 shell 会话中运行其余命令。

```bash
OPENAI_API_BASE='<OPENAI_API_BASE>'
OPENAI_ORG_ID='<OPENAI_ORG_ID>'
OPENAI_STORAGE_URL="$OPENAI_API_BASE/v1/organization/external_storage"
```

##### 2. 发送注册请求

仅为你所用的提供方运行该请求。将每个 `CUSTOMER_...` 占位符替换为你的 ID 以及你创建的资源。

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

响应中包含一个 `id` ，开头为 `extstorage_` 和 `status: "pending"`。请妥善保存该 ID 以便进行验证。API 控制台会显示 **待验证** ，并保持项目的保留策略不变。

##### 3. 验证你的设置

对于 API 校验，请将 `EXTERNAL_STORAGE_ID` 替换为注册时返回的 ID，然后运行：

```bash
EXTERNAL_STORAGE_ID='<EXTERNAL_STORAGE_ID>'
curl --fail-with-body -sS -X POST \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID/validate" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

成功响应会包含 `status: "validated"`。校验会检查配置和访问权限，然后为该项目激活客户管理的保留策略。API 控制台会显示 **已校验** 以及只读策略 **Zero Data Retention with Private Safety Processing**.

如果你使用了 Management API，请取回已保存的注册信息：

```bash
curl --fail-with-body -sS \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

无论使用哪种方式，请打开 **Project Settings > Data retention** 并选择 **刷新**。确认目的地、提供商、地理位置以及 **已校验** 状态，然后检查策略是否为 **Zero Data Retention with Private Safety Processing**。组织的“数据保留”表格也会显示每个项目的存储和状态。

![OpenAI Project Settings Data retention 页面，显示一个状态为“已校验”、采用 Zero Data Retention with PSP 保留策略的 AWS S3 外部存储连接。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-05-verify-project-retention.webp)

**已校验** 仅记录一次成功的检查，而非持续的存储健康状态。 **刷新** 不会重新运行校验。请使用 [运维与故障排查](#operate-and-troubleshoot-customer-storage) 进行持续监控和重新校验。







<a id="customer-storage-operations-steps"></a>



<a id="operate-and-troubleshoot-customer-storage"></a>



## 故障排除



### 检查存储状态

打开 **Organization settings > Data controls > Data retention** 项目表，或 **Project Settings > Data retention** 用于查看项目的存储详情。检查目的地和地域，然后读取状态。你也可以通过 API 在 [设置与验证](#set-up-and-verify-customer-storage).

- **等待验证** (`pending`): 存储已注册但尚未通过验证。在验证成功之前，项目的保留策略保持不变。
- **已验证** (`validated`): 存储已通过验证检查。这并不保证实时连通性。
- **需要注意** (`unhealthy`): 检查发现了存储或配置问题。请修复原因并重新验证。

**刷新** 仅刷新已保存的状态，不会测试连接。运行时失败可能不会改变显示的状态。如果 API 控制台无法加载存储，请在将这种情况视为桶出现故障之前检查 API。

### 监控存储活动

单独检查这些来源：

- **存储注册：** 检查项目、提供商、区域以及验证结果。
- **云活动：** 在启用的情况下，检查提供商访问日志以及读写错误，并将验证探测与实际的 PSP 活动区分开。
- **安全与合规事件：** 如果已单独启用，请在 Compliance API 中检查可用的内容生命周期事件。这些不是存储注册事件，也不是云访问日志。

你的采样策略决定了哪些请求会创建被保留的对象。仅缺失某个对象或事件并不代表存储失败。

### 从失败中恢复

#### 1. 检查错误

- `customer_managed_retention_not_enabled`: 请联系你的 onboarding 对接人确认组织访问权限。
- **身份验证或权限错误：** 检查你是否在使用具备所需外部存储权限的组织管理员密钥。
- **配置问题：** 检查云身份、信任策略或访问权限、生命周期规则，以及已批准的网络配置。
- `401 customer_storage_not_ready`: 检查请求项目所在区域是否存在已验证的存储。
- `incorrect_hostname`: 使用与你的固定驻地项目配置匹配的主机名。
- `503 external_storage_validation_unavailable`: 稍后重试。如果问题仍然存在，请联系支持团队。

#### 2. Validate again

修复配置后，打开 **Connect storage** 进入项目，并使用组织管理员的 API 密钥运行验证命令。检索注册信息或选择 **刷新** 以确认 **已校验**。仅刷新不会运行验证。

### 联系支持团队

如果在排查后存储或验证问题仍然存在， [联系 OpenAI 支持团队](https://help.openai.com/en/).

### 更改或停止你的设置

若要断开存储连接，请打开 **Project Settings > Data retention**。在 **外部存储**，中，选择连接旁边的垃圾桶图标，然后通过 **断开存储连接**.

如果项目使用 ZDR 与 PSP，断开其最后一个存储连接会自动将保留策略重置为你所在组织的默认值。如果还有其他连接，则策略保持不变。当策略发生变化时，需要 ZDR 与 PSP 的模型可能会变得不可用。

断开存储连接不会删除你的云存储或其内容。请继续满足现有记录的保留要求。为每个新项目和驻地位置完成设置和验证。





## 持续的客户责任

使用 ZDR 与 PSP 的客户必须：

- **注册并验证 PSP 存储。** 通过 OpenAI 的管理 API 为每个启用 PSP 的项目和数据驻留位置注册并验证存储桶，并按照 OpenAI 发布的指南配置 PSP 服务存储桶访问权限。
- **保留加密记录至少 30 天**。配置存储生命周期规则，使其不会提前删除 PSP 记录。
- **维护存储和密钥访问**。正确配置区域存储、服务权限和客户管理的密钥授权。
- **修复配置问题。** 在 OpenAI 发出通知后更正存储配置问题。
- **响应有关安全问题的通知。** 与 OpenAI 协作调查并处理相关问题。

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