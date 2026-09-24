# ZDR with Private Safety Processing

> 完整的文档索引请参见 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

li+li]:mt-2! [&_ul>li>p]:my-0! [&_#built-with-three-principles+ol>li+li]:mt-2! [&_#check-storage-status]:mt-0!">

零数据保留与私有安全处理（ZDR with PSP）支持离线、自动化的安全审查，且 OpenAI 不会保留客户的提示或响应。本指南概述了 ZDR with PSP 的工作原理以及你的运营职责。完整的架构和安全模型请参阅 [私有安全处理技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf).

## 基于三大原则构建

1. **客户掌控其内容**

   客户内容存储在客户控制的存储中。客户掌控检索和解密受保护安全记录所需的权限以及客户自管的企业密钥管理（EKM）授权。
2. **无人工审查**

   安全审查不得为 OpenAI 员工读取受保护客户内容开辟新途径。加密的客户内容在经批准且具备硬件证明的安全运行时中解密，该运行时禁用了人工访问权限。仅有受限的安全信号和运维元数据会以明文形式离开 PSP 受保护审查环境。
3. **仅出于安全目的的内容保留**

   存储在客户控制存储中的内容仅用于经批准的安全目的。客户内容不得用于训练模型，也不得提供给 OpenAI 内部的其他团队或其合作伙伴。

## ZDR 与 PSP 的工作原理

该架构包含两条流程：

- API 请求和保留流程会在客户控制的存储容器中保护并保留符合条件的 API 内容。
- 异步安全流水线仅在经过批准的自动化安全审查时检索记录，并发布有界的安全决策。

### API 请求与保留

一次交互（即你的提示词与模型的回复）会通过安全分类器的转交或经批准的采样策略被选中。转交本身并不构成违反策略。

系统会对记录进行加密，并将其写入你的区域云存储。OpenAI 仅保留一份包含运维元数据和存储引用的索引，而不保存内容副本。加密和存储操作以异步方式执行，不会阻塞推理。




![API 请求流程示意，展示加密后的安全记录被存储在客户可控的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection.webp)







![API 请求流程示意，展示加密后的安全记录被存储在客户可控的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection-dark.webp)







### 异步安全流水线

ZDR with PSP 会从你的存储中检索加密记录，并检查它们是否可以被解密。安全审查运行时是一个经过硬件证明的计算环境，它禁止人工访问，旨在成为唯一能够解密客户内容的工作负载。它使用已批准的审查 prompt 和输出 schema 执行自动化安全审查，不会暴露客户内容。

只有预定义、有界的安全信号和已批准的操作元数据可以以明文形式离开审查。详细结果在离开运行时之前会被加密，并以原始记录的过期时间存储在你的云存储中。ZDR with PSP 会加密这些记录，并将它们以 30 天的 TTL 写入你的区域云存储。




![异步安全审查流程，展示加密记录的检索、受保护的审查以及有界的输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review.webp)







![异步安全审查流程，展示加密记录的检索、受保护的审查以及有界的输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review-dark.webp)




## 客户内容加密

每条存储记录在保留到客户存储时都会进行双重加密：

- **OpenAI 管理的 HPKE 加密：** 内部加密层将客户内容的解密权限限制在经授权的 Safety Review Runtime 内。
- **客户管理的加密：** [企业密钥管理（EKM）](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 通过你客户可控的密钥管理服务添加一层外层加密。

在启用 EKM 的情况下，仅靠 OpenAI 的内部解密密钥不足以解密已存储的记录：你提供的客户管理密钥授权也同样必需。撤销该授权将阻止对已保留记录的解密，但不会删除这些记录，也无法撤销已完成的处理。

建议启用 EKM 以获得这一额外的控制能力。请参阅 [EKM 技术常见问题解答](https://help.openai.com/en/articles/20000945-ekm-technical-faq) 了解授权与撤销相关说明，以及 [技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf) 了解加密、机密计算、护栏与透明度相关内容。



<a id="customer-storage-setup-steps"></a>



<a id="set-up-and-verify-customer-storage"></a>



## 设置并验证存储



将你自己的 AWS S3 存储桶或 Azure Blob 容器连接到 OpenAI 项目。按照适用于你的云的设置步骤操作,然后注册并验证该连接。

ZDR 与 PSP 按项目启用。启用后,PSP 策略将应用于该项目中的所有 API 流量,包括对那些本不要求 PSP 的模型的请求。要在不启用 PSP 的情况下对符合条件的模型使用 ZDR,请将相关请求发送至一个单独配置为不启用 PSP 的 ZDR 项目。

### 开始之前

- 已获得 Zero Data Retention 批准的组织可以直接在 API 控制台中配置 PSP 的 ZDR。如果你的组织尚未获得 ZDR 批准，请参阅 [资格与审批要求](https://developers.openai.com/api/docs/guides/your-data#data-retention-controls-for-abuse-monitoring).
- 选择一个与你的项目数据驻留要求相匹配的存储区域。你需要具备在你的云账户中创建存储并委派访问权限的权限。
- 由组织管理员在 API 控制台中注册并验证存储。对于 Management API，请使用 OpenAI 组织管理员 API 密钥。项目管理员可以查看相关指引和状态；项目推理密钥无法用于 Management API 调用。

### 在 API 控制台中打开存储设置

1. Open **Organization settings > Data controls > Data retention**, 然后选择 **Connect storage**.
2. 在 **Connect external storage**, 选择 **AWS** 或 **Azure** 并选择你的项目。你也可以从 **Connect storage** 从 **Project Settings > Data retention**.
3. 完成下面的云配置。然后在弹窗中输入你的存储详细信息并选择 **Connect and validate**.

### 云服务专用配置



<a id="aws-s3"></a>



#### AWS S3



如果你使用的是 AWS，请完成这些步骤。使用 Azure 时请跳到 **Azure Blob Storage**.

#### 1. 创建存储桶

在与项目数据驻留要求兼容的区域中创建一个专用的 S3 存储桶。如果未启用数据驻留功能，推荐使用 us-west-1 区域。

- 保留 **ACL 已禁用**.
- 开启 **阻止所有公有访问**.
- 记录该桶的 ARN。你将把它用作 `CUSTOMER_BUCKET_ARN` 下方。

![AWS S3 存储桶“属性”页面，显示存储桶概览、AWS 区域和 Amazon 资源名称 (ARN)。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-01-aws-create-bucket.webp)

#### 2. 设置生命周期规则

打开存储桶的 **管理 > 创建生命周期规则** 页面，并使用以下设置：

- **规则名称：** `psp-retention`
- **前缀：** `openai/`
- **操作：** 使对象的当前版本过期
- **有效期：** 30 天

启用该规则。确保没有其他规则更早地让这些记录过期。此设置将影响对象的生命周期过期；OpenAI 的解密密钥过期时间是独立的。

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

在 **IAM > 角色 > 创建角色**，中，选择 **自定义信任策略**.

![AWS IAM 选择可信实体页面，已选择自定义信任策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-03-aws-custom-trust-policy.webp)

使用下方策略。将 `CUSTOMER_PROJECT_ID` 替换为你的 OpenAI 项目 ID。保持 OpenAI principal ARN 不变。

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

附加 `psp-bucket-policy` 到你正在创建的角色。可以将角色命名为 `psp-role`。将其 ARN 记录为 `CUSTOMER_ROLE_ARN`；其中的项目 ID `sts:ExternalId` 必须与你要注册的项目一致。

![AWS IAM 添加权限页面，已选择使用现有策略，并勾选了客户托管的 psp-bucket-policy。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-04-aws-iam-role.webp)

继续前往 **注册你的存储**.







<a id="azure-blob-storage"></a>



#### Azure Blob Storage



如果使用 Azure，请完成这些步骤。

#### 1. 创建存储账户

在商业版 Azure 中创建一个专用账户。选择一个与你的项目数据驻留要求相符的已批准的美国或欧盟存储区域。

- **帐户种类：** `StorageV2`
- **Basics > Performance:** Standard
- **Basics > Redundancy:** LRS or ZRS (preferred)
- **Advanced > Access tier:** Hot
- **Advanced > Hierarchical namespace:** Disabled
- **Networking > Public network access:** Enabled from all networks
- **Security > Secure transfer:** HTTPS required; minimum TLS 1.2
- **Security > Anonymous Blob access:** Disabled
- **Security > Storage account key access:** Disabled
- **Security > Microsoft Entra Authorization:** Enabled

确认网络设置满足你的云要求。使用该账户的主 Blob 终结点，而非主权云或自定义终结点。

![Azure 存储账户的“公共访问”设置，允许来自所有网络的公共网络访问。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-azure-public-access.webp)

![Azure 存储账户的“安全”设置，启用了安全传输和 Microsoft Entra 授权，禁用了匿名访问和存储账户密钥访问，并要求最低 TLS 1.2。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-11-azure-security-settings.webp)

#### 2. Create the container

在以下位置创建一个私有容器： **存储账户 > 数据存储 > 容器 > 添加容器**。将此容器元数据添加到 **容器 > 设置 > 元数据** 并填入你的 OpenAI 组织 ID：

- `openai_organization_id`: 你的 OpenAI 组织 ID

将元数据添加到容器，而不是存储账户或单个 Blob。

#### 3. 设置生命周期规则

在以下位置添加一条已启用的规则 **存储账户 > 数据管理 > 生命周期管理 > 添加** 该规则适用于专用账户中的所有当前/基础块 Blob：

- **操作：** 自上次修改起 30 天后删除
- **过滤器：** 无前缀或标签过滤器

![已将规则应用于所有 Blob，并选择 Block blobs 和 Base blobs 的 Azure 生命周期规则 Details。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-12-azure-lifecycle-scope.webp)

![在 30 天未修改后删除 Blob 的 Azure 生命周期规则 Base blobs 设置。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-13-azure-lifecycle-delete.webp)

#### 4. 授予 OpenAI 访问权限

请你的目录管理员将 OpenAI 的应用程序添加到你的租户。将 `CUSTOMER_TENANT_ID` 下方内容替换为你的 Azure 租户 ID。保持应用程序 ID 不变。

```bash
az login --tenant '<CUSTOMER_TENANT_ID>'
az ad sp create --id 'e5627955-3059-4a88-89f8-73843190624d' \
  --query '{name:displayName,objectId:id}' -o table
```

如果应用程序已存在，请使用 `az ad sp show` 并使用相同的 `--id` 和查询。记下应用程序名称及其租户本地对象 ID。

打开 **存储帐户 > 访问控制 (IAM) > 添加角色分配** 在你的存储帐户上。选择 **读取者** 角色，将 **将访问权限分配给** 设置为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

![Azure 角色分配“成员”选项卡，显示已选择 Storage Blob Data Reader 角色以及“用户、组或服务主体”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-14-azure-role-members.webp)

![Azure 的“选择成员”窗格，其中 CSG - Azure Blob Storage Prod 被列为应用程序。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-15-azure-select-application.webp)

然后选择 **存储 Blob 数据参与者** 角色，将 **将访问权限分配给** 设置为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

OpenAI 管理应用程序凭据。不要创建或共享存储密钥、SAS 令牌或客户端密钥。





### 注册你的存储

完成上述云端配置后，使用 API 控制台或管理 API 来注册并验证你的存储。只需选择其中一种方式即可。

#### 选项 1：API 控制台

以组织管理员身份登录。API 控制台会使用你已登录的会话；此方法无需 Admin API 密钥或 curl 命令。

##### 1. Open Connect 存储

打开 **Organization settings > Data controls > Data retention** 并选择 **Connect storage**。你也可以从 **项目设置 > 数据保留**.

![OpenAI 组织的数据控制页面，显示数据保留选项卡、项目策略表和连接存储控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-06-platform-open-storage.webp)

##### 2. 输入你的存储详情

选择 **AWS** 或 **Azure**,然后选择项目。如果你是从项目设置中打开该对话框,该项目已被选中。如果 **已注册的存储** 出现,请选择 **连接新的存储** 以添加目标位置。

对于 **AWS**,请输入 **Bucket ARN** 和 **IAM role ARN** (取自你的云环境配置)。

![AWS 连接外部存储对话框,显示项目选择、Bucket ARN、IAM role ARN 以及连接并验证。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-07-platform-aws-connect.webp)

对于 **Azure**,请输入 **Tenant ID**, **Subscription ID**, **Resource group**, **存储帐户名称**，以及 **容器名称**。在对话框中向下滚动以填写所有字段。

![Azure 的“连接外部存储”对话框，显示项目和 Azure 存储配置字段。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-08-platform-azure-connect.webp)

##### 3. 连接并验证

选择 **连接并验证**。API 控制台会注册该存储、运行验证，并刷新存储状态和项目策略。仅注册不会更改策略。

等待 **存储已验证** 以及项目现在使用带 PSP 的 ZDR 的确认信息，然后选择 **完成**.

![OpenAI 项目设置，显示已验证的 AWS S3 存储以及带有私有安全处理的零数据保留策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-09-platform-storage-validated.webp)

如果注册后验证失败，请修复报告的问题并选择 **重新验证**。若稍后继续，请在 **已注册的存储** 下选择目标并选择 **验证存储**。如果 API 控制台无法刷新结果，请选择 **刷新状态** 后再重新开始。

#### 选项 2：管理 API

为此方法使用组织管理员 API 密钥。使用以下命令注册存储，然后按照 [**3. 验证你的设置**](#3-verify-your-setup) 运行验证。

##### 1. 准备你的 API 设置

将你组织的 Admin API 密钥安全加载到 `OPENAI_ADMIN_KEY`.

设置 `OPENAI_API_BASE` 为你项目确认的端点： `https://api.openai.com` 用于全球， `https://us.api.openai.com` 用于美国，或 `https://eu.api.openai.com` 用于欧洲。

将下方占位符替换为该端点以及你的 OpenAI 组织 ID。在同一个 shell 会话中运行其余命令。

```bash
OPENAI_API_BASE='<OPENAI_API_BASE>'
OPENAI_ORG_ID='<OPENAI_ORG_ID>'
OPENAI_STORAGE_URL="$OPENAI_API_BASE/v1/organization/external_storage"
```

##### 2. 发送注册请求

仅针对你的提供方运行该请求。替换每个 `CUSTOMER_...` 占位符为你的 ID 以及你所创建的资源。

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

响应包含一个以 `id` 开头的 `extstorage_` 和 `status: "pending"`. 保留该 ID 以供验证。API 控制台会显示 **“Pending validation”** ，并保持项目的保留策略不变。

##### 3. 验证你的环境配置

若要进行 API 校验，请将 `EXTERNAL_STORAGE_ID` 替换为注册时返回的 ID，然后运行：

```bash
EXTERNAL_STORAGE_ID='<EXTERNAL_STORAGE_ID>'
curl --fail-with-body -sS -X POST \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID/validate" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

成功响应包含 `status: "validated"`。校验会检查配置和访问权限，然后为该项目启用客户管理的保留策略。API 控制台会显示 **Validated** 以及只读策略 **Zero Data Retention with Private Safety Processing**.

如果你使用了 Management API，请取出已保存的注册信息：

```bash
curl --fail-with-body -sS \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

无论使用哪种方式，请打开 **项目设置 > 数据保留** 并选择 **Refresh**。确认目标、供应商、地理区域以及 **Validated** 状态，然后检查策略为 **Zero Data Retention with Private Safety Processing**。组织的 Data retention 表也会显示每个项目的存储和状态。

![OpenAI Project Settings Data retention 页面，展示一个 AWS S3 外部存储连接，状态为 Validated，保留策略为 Zero Data Retention with PSP。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-05-verify-project-retention.webp)

**Validated** 仅记录一次成功的检查，并非持续的存储健康状况。 **Refresh** 不会重新运行校验。请使用 [Operations and Troubleshooting](#operate-and-troubleshoot-customer-storage) 进行持续监控和重新校验。







<a id="customer-storage-operations-steps"></a>



<a id="operate-and-troubleshoot-customer-storage"></a>



## 故障排查



### 检查存储状态

打开 **Organization settings > Data controls > Data retention** 用于项目表，或 **项目设置 > 数据保留** 用于获取项目的存储详情。请检查目标和区域，然后查看状态。你也可以通过 API 在 [设置与验证](#set-up-and-verify-customer-storage).

- **待验证** (`pending`): 存储已注册但尚未通过验证。项目的保留策略在验证成功之前保持不变。
- **已验证** (`validated`): 存储已通过验证检查。这并不能保证实时连通性。
- **需要关注** (`unhealthy`): 检查发现存储或配置问题。请修复原因并重新验证。

**Refresh** 重新加载已保存的状态；它不会测试连接。运行时故障可能不会改变显示的状态。如果 API 控制台无法加载存储，请先检查 API，再将其视为存储桶故障。

### 监控存储活动

分别检查以下来源：

- **存储注册：** 检查项目、提供商、地理位置以及验证结果。
- **云活动：** 在已启用的情况下，检查提供商访问日志和读写错误，并将验证探测与实际的 PSP 活动区分开。
- **安全和合规事件：** 如果单独启用了合规 API 中的内容生命周期事件，请检查这些事件。它们不属于存储注册事件或云访问日志。

你的采样策略决定了哪些请求会创建被保留的对象。仅仅缺少某个对象或事件并不代表存储已失败。

### 从失败中恢复

#### 1. 检查错误

- `customer_managed_retention_not_enabled`: 请联系你的 onboarding 联系人以确认组织访问权限。
- **身份验证或权限失败：** 检查你是否使用了具有所需外部存储权限的组织 Admin key。
- **配置问题：** 检查云身份、信任策略或访问权限、生命周期规则，以及已批准的网络配置。
- `401 customer_storage_not_ready`: 检查所请求项目所在地理区域是否存在已验证的存储。
- `incorrect_hostname`: 使用与你的固定居住地（fixed-residency）项目配置相匹配的主机名。
- `503 external_storage_validation_unavailable`: 稍后重试。如果问题仍然存在，请联系支持团队。

#### 2. 再次校验

修复配置后，打开 **Connect storage** 为项目运行验证命令，并使用组织管理员 API 密钥。获取注册信息或选择 **Refresh** 以确认 **Validated**。仅刷新不会运行验证。

### 联系支持团队

如果在进行故障排除后存储或验证问题仍然存在， [请联系 OpenAI 客服](https://help.openai.com/en/).

### 更改或停止你的设置

若要断开存储连接，请打开 **项目设置 > 数据保留**。在 **外部存储**，下，选择该连接旁边的删除图标，然后确认 **断开存储连接**.

如果项目使用的是带 PSP 的 ZDR，断开其最后一个存储连接会自动将其保留策略重置为你所在组织的默认设置。如果还有其他连接，策略保持不变。当策略发生变化时，要求使用带 PSP 的 ZDR 的模型可能会变得不可用。

断开存储连接不会删除你的云存储或其内容。请继续满足现有记录的保留要求。为每个新项目和驻留位置完成设置和验证。





## 持续的客户责任

使用 ZDR 与 PSP 的客户必须：

- **注册并验证 PSP 存储。** 通过 OpenAI 的管理 API 为每个启用 PSP 的项目和数据驻留地点注册并验证存储桶，并按照 OpenAI 发布的指南配置 PSP 服务存储桶访问权限。
- **将加密记录保留至少 30 天**. 配置存储生命周期规则，使其不会过早删除 PSP 记录。
- **维护存储和密钥访问**. 正确配置区域存储、服务权限和客户管理的密钥授权。
- **修复配置问题。** 在 OpenAI 提供通知后，更正存储配置问题。
- **响应有关安全问题的通知。** 与 OpenAI 合作调查并解决该问题。

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