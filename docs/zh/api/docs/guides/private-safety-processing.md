# ZDR 与 Private Safety Processing (PSP)

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

li+li]:mt-2! [&_ul>li>p]:my-0! [&_#built-with-three-principles+ol>li+li]:mt-2! [&_#check-storage-status]:mt-0!">

ZDR 与 PSP 支持离线、自动化的安全审查，且 OpenAI 不会保留客户的提示词或响应。本指南概述了 ZDR 与 PSP 的工作原理以及你的运维职责。完整的架构和安全模型请参阅 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf).

## 基于三大原则构建

1. **客户掌控其内容**

   客户内容存储在客户可控的存储中。客户掌控检索和解密受保护安全记录所需的权限以及客户管理的 Enterprise Key Management (EKM) 授权。
2. **无人工审核**

   安全审核不得为 OpenAI 人员阅读受保护客户内容开辟新途径。加密的客户内容在经批准的、支持硬件可信验证的安全运行时中解密，该环境禁用人员访问能力。仅有受限的安全信号和运营元数据以明文形式离开 PSP 受保护审核。
3. **仅出于安全目的的内容保留**

   存储在客户可控存储中的内容仅用于经批准的安全目的。客户内容不得用于训练模型，也不得提供给 OpenAI 内部其他团队或其合作伙伴。

## ZDR 与 PSP 的工作原理

该架构由两条流组成：

- API 请求与保留流程会在客户控制的存储容器中保护并保留符合条件的 API 内容。
- 异步安全管道仅检索经批准用于自动化安全审查的记录，并发布有界的安全决策。

### API 请求与保留

一段交互——你的提示和模型的回复——会通过安全分类器转交或经批准的采样策略被选中。转交本身并不构成策略违规。

系统会对该记录进行加密，并写入你所在区域的云存储中。OpenAI 仅保留一份包含运维元数据和存储引用的索引，而不保存内容副本。加密和存储以异步方式运行，不会阻塞推理。




![API 请求流程示意图，展示加密的安全记录被存储在客户控制的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection.webp)







![API 请求流程示意图，展示加密的安全记录被存储在客户控制的存储中。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-01-data-protection-dark.webp)







### 异步安全流水线

ZDR 与 PSP 会从你的存储中取出加密记录，并检查它们能否被解密。Safety Review Runtime 是一种由硬件证明的计算环境，禁用了人工访问，被设计为唯一可以解密客户内容的工作负载。它使用经过审批的审查提示词和输出模式执行自动化安全审查，不会暴露客户内容。

只有预定义、有界的安全信号和经过审批的运营元数据可以以明文形式离开审查流程。详细结果在离开运行时之前会被加密，并以原始记录的过期时间存储在你的云存储中。ZDR 与 PSP 会加密这些记录，并以 30 天的 TTL 将其写入你的区域云存储。




![异步安全审查流程，展示加密记录取回、受保护的审查以及有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review.webp)







![异步安全审查流程，展示加密记录取回、受保护的审查以及有界输出。](https://developers.openai.com/images/platform/guides/private-safety-processing/main-02-automated-safety-review-dark.webp)




## 客户内容加密

每条存储的记录在保留到客户存储中时都会进行双重加密：

- **OpenAI 管理的 HPKE 加密：** 内部加密层将客户内容的解密限制在经授权的 Safety Review Runtime 内。
- **客户管理的加密：** [Enterprise Key Management (EKM)](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 使用你控制的密钥管理服务添加一层外部加密。

当 EKM 启用时，仅有 OpenAI 的内部解密密钥不足以解密已存储的记录：还需要你的客户管理密钥授权。撤销该授权可以阻止对保留记录的解密，但不会删除这些记录，也无法撤销已完成的处理。

我们建议启用 EKM 以获得这一额外的控制能力。请参阅 [EKM 技术常见问题解答](https://help.openai.com/en/articles/20000945-ekm-technical-faq) 了解授权与撤销，以及 [技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf) 了解加密、机密计算、护栏和透明度。



<a id="customer-storage-setup-steps"></a>



<a id="set-up-and-verify-customer-storage"></a>



## 设置并验证存储



将你自己的 AWS S3 存储桶或 Azure Blob 容器连接到 OpenAI 项目。按照对应云的设置步骤操作，然后注册并验证连接。

### 准备工作

- 请你的 OpenAI 联系人批准你的组织。
- 选择与项目数据驻留要求相符的存储区域。你需要拥有在云账户中创建存储和委托访问的权限。
- 让组织管理员在 API 控制台中注册并验证存储。对于管理类 API，请使用 OpenAI 组织管理员的 API 密钥。项目管理员可以查看相关指引和状态；项目推理密钥无法用于管理类 API 调用。

### 在 API 控制台中打开存储设置

1. 打开 **组织设置 > 数据控制 > 数据保留**，然后选择 **连接存储**.
2. 在 **连接外部存储**，中，选择 **AWS** 或 **Azure** 并选择你的项目。你也可以从 **连接存储** 中的 **项目设置 > 数据保留**.
3. 完成下方的云配置。然后在弹窗中输入你的存储详细信息并选择 **连接并验证**.

### 特定云平台设置



<a id="aws-s3"></a>



#### AWS S3



如果你使用的是 AWS，请完成以下步骤。如果使用 Azure，请跳至 **Azure Blob Storage**.

#### 1. 创建存储桶

在你项目的数据驻留要求所兼容的区域内创建一个专用 S3 存储桶。如果数据驻留未启用，推荐使用 us-west-1 区域。

- 保留 **ACL 已禁用**.
- 开启 **屏蔽所有公共访问**.
- 记下桶的 ARN。你将把它用作 `CUSTOMER_BUCKET_ARN` 下方。

![AWS S3 bucket 属性页面，显示存储桶概览、AWS 区域和 Amazon 资源名称。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-01-aws-create-bucket.webp)

#### 2. 设置生命周期规则

打开该存储桶的 **管理 > 创建生命周期规则** 页面，并使用以下设置：

- **规则名称：** `psp-retention`
- **前缀：** `openai/`
- **操作：** 使对象的当前版本过期
- **有效期：** 30 天

启用该规则。确保没有其他规则更早地使这些记录过期。这将设置对象的生命周期过期时间；OpenAI 的解密密钥过期时间是独立计算的。

![AWS S3 管理页面，显示生命周期配置、一条生命周期规则以及“创建生命周期规则”控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-02-aws-lifecycle-rule.webp)

#### 3. 创建访问策略

在 **IAM > 策略 > 创建策略**，中，选择 **JSON**。将 `CUSTOMER_BUCKET_ARN` 替换为你的桶 ARN，例如 `arn:aws:s3:::your-psp-bucket`，并将策略另存为 `psp-bucket-policy`.

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

在 **IAM > Roles > Create role**，中，选择 **Custom trust policy**.

![AWS IAM Select trusted entity page with Custom trust policy selected.](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-03-aws-custom-trust-policy.webp)

使用下方策略。将其中的 `CUSTOMER_PROJECT_ID` 替换为你的 OpenAI 项目 ID，并保持 OpenAI 主体 ARN 不变。

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

Attach `psp-bucket-policy` 到你要创建的角色。你可以将该角色命名为 `psp-role`。将其 ARN 记录为 `CUSTOMER_ROLE_ARN`；其中的项目 ID `sts:ExternalId` 必须与你注册的项目一致。

![AWS IAM Add permissions page with Use existing policy selected and the customer-managed psp-bucket-policy checked.](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-04-aws-iam-role.webp)

继续到 **注册你的存储**.







<a id="azure-blob-storage"></a>



#### Azure Blob Storage



如果你使用的是 Azure,请完成以下步骤。

#### 1. Create the storage account

在商业版 Azure 中创建一个专用账户。选择一个与你的项目数据驻留要求相符的、经过批准的美国或欧盟存储区域。

- **帐户类型：** `StorageV2`
- **基本信息 > 性能：** 标准
- **基本信息 > 冗余：** LRS 或 ZRS（首选）
- **高级 > 访问层：** 热
- **高级 > 分层命名空间：** 已禁用
- **网络 > 公共网络访问：** 从所有网络启用
- **安全性 > 安全传输：** 需要 HTTPS；最低 TLS 1.2
- **安全性 > 匿名 Blob 访问：** 已禁用
- **安全性 > 存储帐户密钥访问：** 已禁用
- **安全性 > Microsoft Entra 授权：** 已启用

确认网络设置满足你的云要求。使用该账户的主要 Blob 终结点，而不是主权云或自定义终结点。

![Azure 存储账户“公共访问”设置，允许来自所有网络的公共网络访问。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-10-azure-public-access.webp)

![Azure 存储账户“安全”设置，启用了安全传输和 Microsoft Entra 授权，禁用了匿名访问和存储账户密钥访问，并要求最低 TLS 1.2。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-11-azure-security-settings.webp)

#### 2. 创建容器

在中创建一个专用容器 **存储账户 > 数据存储 > 容器 > 添加容器**。在以下位置添加此容器元数据 **容器 > 设置 > 元数据** ，使用你精确的 OpenAI 组织 ID：

- `openai_organization_id`: 你的 OpenAI 组织 ID

将元数据添加到容器，而不是存储账户或单个 Blob。

#### 3. 设置生命周期规则

在以下位置添加一条已启用的规则： **存储账户 > 数据管理 > 生命周期管理 > 添加** 该规则应用于专用账户中的所有当前/基块 Blob：

- **操作：** 自上次修改起 30 天后删除
- **筛选器：** 无前缀或标签筛选器

![Azure 生命周期规则“详细信息”，其中规则应用于所有 Blob、块 Blob 和基 Blob 选择。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-12-azure-lifecycle-scope.webp)

![Azure 生命周期规则“基 Blob”设置，可在 Blob 30 天未修改后将其删除。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-13-azure-lifecycle-delete.webp)

#### 4. 授予 OpenAI 访问权限

请你的目录管理员将 OpenAI 的应用程序添加到你的租户。将 `CUSTOMER_TENANT_ID` 下面替换为你的 Azure 租户 ID。应用程序 ID 保持不变。

```bash
az login --tenant '<CUSTOMER_TENANT_ID>'
az ad sp create --id 'e5627955-3059-4a88-89f8-73843190624d' \
  --query '{name:displayName,objectId:id}' -o table
```

如果应用程序已存在，请使用 `az ad sp show` 相同的 `--id` 和查询。记录应用程序名称及其租户本地对象 ID。

打开 **存储帐户 > 访问控制 (IAM) > 添加角色分配** 在你的存储帐户上。选择 **读取者** 角色，将 **将访问权限分配到** 为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

![Azure 角色分配的“成员”选项卡，显示已选择 Storage Blob Data Reader 角色以及用户、组或服务主体。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-14-azure-role-members.webp)

![Azure 的“选择成员”窗格，其中 CSG - Azure Blob Storage Prod 作为应用程序列出。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-15-azure-select-application.webp)

然后选择 **存储 Blob 数据参与者** 角色，将 **将访问权限分配到** 为 **用户、组或服务主体**，然后搜索并选择 **CSG - Azure Blob Storage Prod**.

OpenAI 管理应用程序凭证。请勿创建或共享存储密钥、SAS 令牌或客户端密钥。





### 注册你的存储

完成上述云端设置后，使用 API 控制台或 Management API 注册并验证你的存储。只需使用其中一种方法即可。

#### 选项 1：API 控制台

以组织管理员身份登录。API 控制台会使用你已登录的会话；使用此方法时无需 Admin API 密钥或 curl 命令。

##### 1. 开通 Connect 存储

打开 **Organization settings > Data controls > Data retention** 然后选择 **Connect storage**。你也可以从 **Project Settings > Data retention**.

![OpenAI 组织 Data controls 页面，显示 Data retention 选项卡、项目策略表和 Connect storage 控件。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-06-platform-open-storage.webp)

##### 2. 输入你的存储详情

选择 **AWS** 或 **Azure**，然后选择项目。如果你是从项目设置中打开的对话框，则该项目已被选中。如果 **已注册存储** 已显示，请选择 **连接新存储** 以添加目标。

对于 **AWS**，请输入 **Bucket ARN** 和 **IAM role ARN** （来自你的云配置）。

![适用于 AWS 的连接外部存储对话框，显示项目选择、Bucket ARN、IAM role ARN，以及“连接并验证”。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-07-platform-aws-connect.webp)

对于 **Azure**，请输入 **Tenant ID**, **Subscription ID**, **Resource group**, **存储账户名称**，以及 **容器名称**。在弹窗中向下滚动以填写所有字段。

![Azure 的“连接外部存储”对话框，显示项目和 Azure 存储配置字段。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-08-platform-azure-connect.webp)

##### 3. 连接并验证

选择 **连接并验证**。API 控制台会注册该存储、运行验证，并刷新存储状态和项目策略。仅注册不会更改策略。

等待 **存储已验证** 以及项目现已使用 ZDR with PSP 的确认信息，然后选择 **完成**.

![OpenAI 项目设置，显示已验证的 AWS S3 存储以及 Zero Data Retention with Private Safety Processing 策略。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-09-platform-storage-validated.webp)

如果注册后验证失败，请修复报告的问题并选择 **重试验证**。若要稍后继续，请在 **已注册存储** 下选择目标，然后选择 **验证存储**。如果 API 控制台无法刷新结果，请选择 **刷新状态** 后再重新开始。

#### 选项 2：管理 API

为此方法使用组织管理员 API 密钥。使用以下命令注册存储，然后按照 [**3. 验证你的设置**](#3-verify-your-setup) 运行验证。

##### 1. 准备你的 API 设置

将你的组织 Admin API 密钥安全地加载到 `OPENAI_ADMIN_KEY`.

设置 `OPENAI_API_BASE` 为你项目确认的端点： `https://api.openai.com` 用于 global， `https://us.api.openai.com` 用于 US，或 `https://eu.api.openai.com` 用于 Europe。

将下面的占位符替换为该端点和你的 OpenAI 组织 ID。在同一 shell 会话中运行其余命令。

```bash
OPENAI_API_BASE='<OPENAI_API_BASE>'
OPENAI_ORG_ID='<OPENAI_ORG_ID>'
OPENAI_STORAGE_URL="$OPENAI_API_BASE/v1/organization/external_storage"
```

##### 2. 发送注册请求

仅为你所使用的服务商运行该请求。请将每个 `CUSTOMER_...` 占位符替换为你自己的 ID 以及已创建的资源。

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

响应中包含一个 `id` ，其开头为 `extstorage_` 和 `status: "pending"`。请妥善保存该 ID 以便后续校验。API 控制台会显示 **Pending validation** ，并且保持项目的保留策略不变。

##### 3. 验证你的设置

用于 API 校验，将 `EXTERNAL_STORAGE_ID` 替换为注册时返回的 ID，然后运行：

```bash
EXTERNAL_STORAGE_ID='<EXTERNAL_STORAGE_ID>'
curl --fail-with-body -sS -X POST \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID/validate" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

成功的响应包含 `status: "validated"`。校验会检查配置和访问权限，然后为该项目激活客户管理的保留策略。API 控制台会显示 **Validated** 以及只读策略 **Zero Data Retention with Private Safety Processing**.

如果你使用了 Management API，请检索已保存的注册信息：

```bash
curl --fail-with-body -sS \
  "$OPENAI_STORAGE_URL/$EXTERNAL_STORAGE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "OpenAI-Organization: $OPENAI_ORG_ID"
```

对于任一方法，打开 **Project Settings > Data retention** 然后选择 **Refresh**。确认目标、提供商、地区以及 **Validated** 状态，然后检查策略是否为 **Zero Data Retention with Private Safety Processing**。组织的 Data retention 表中也会显示每个项目的存储和状态。

![OpenAI Project Settings Data retention 页面，显示一个 AWS S3 外部存储连接，状态为 Validated，保留策略为 Zero Data Retention with PSP。](https://developers.openai.com/images/platform/guides/private-safety-processing/setup-05-verify-project-retention.webp)

**Validated** 记录一次成功的检查，而不是持续的存储健康状态。 **Refresh** 不会重新运行校验。请使用 [Operations and Troubleshooting](#operate-and-troubleshoot-customer-storage) 进行持续监控和重新校验。







<a id="customer-storage-operations-steps"></a>



<a id="operate-and-troubleshoot-customer-storage"></a>



## 故障排除



### 检查存储状态

打开 **Organization settings > Data controls > Data retention** for the project table, or **Project Settings > Data retention** for the project's storage details. Check the destination and geography, then read the status. You can also retrieve the registration through the API in [Setup and Verification](#set-up-and-verify-customer-storage).

- **待验证** (`pending`): 存储已注册但尚未通过验证。在验证成功之前，项目的保留策略保持不变。
- **已验证** (`validated`): 存储通过了验证检查。这并不保证实时的连通性。
- **需要关注** (`unhealthy`): 检查发现了存储或配置问题。修复原因后再次验证。

**Refresh** 重新加载已保存的状态；它不会测试连接。运行时失败可能不会改变显示的状态。如果 API 控制台无法加载存储，请在将其视为存储桶故障之前检查 API。

### 监控存储活动

单独检查以下来源：

- **存储注册：** 检查项目、提供商、地区以及验证结果。
- **云活动：** 在已启用的位置，查看提供商访问日志和读写错误。将验证探测与实际的 PSP 活动区分开来。
- **安全与合规事件：** 在单独启用的情况下，查看合规 API 中可用的内容生命周期事件。这些不是存储注册事件，也不是云访问日志。

你的采样策略决定了哪些请求会生成保留对象。仅仅缺少某个对象或事件并不意味着存储失败。

### 从故障中恢复

#### 1. 检查错误

- `customer_managed_retention_not_enabled`：让你的入职联系人确认组织访问权限。
- **身份验证或权限失败：** 检查你是否使用了具有所需外部存储权限的组织管理员密钥。
- **配置问题：** 检查云身份、信任策略或访问权限、生命周期规则以及已批准的网络配置。
- `401 customer_storage_not_ready`：检查所请求项目所在地区是否存在经过验证的存储。
- `incorrect_hostname`：使用与你的固定驻留项目配置匹配的主机名。
- `503 external_storage_validation_unavailable`：稍后重试。如果故障仍然存在，请联系支持团队。

#### 2. 再次验证

修复配置后，打开 **Connect storage** for the project and run the validation command with an organization Admin API key. Retrieve the registration or select **Refresh** 以确认 **Validated**。仅刷新不会运行验证。

### 联系支持

如果在排查后仍然存在存储或验证问题， [联系 OpenAI 支持团队](https://help.openai.com/en/).

### 更改或停止你的设置

在更换存储、撤销访问权限或下架前，请联系支持人员。为每个新项目和驻留地点完成设置与验证。

删除存储注册不会删除云对象，也不会完成下架。





## 持续的客户责任

使用 ZDR 与 PSP 的客户须：

- **注册并验证 PSP 存储。** 通过 OpenAI 的管理 API，为每个启用了 PSP 的项目和数据驻留位置注册并验证存储桶，并按照 OpenAI 发布的指南配置 PSP 服务存储桶访问权限。
- **保留加密记录至少 30 天**。配置存储生命周期规则，确保不会提前删除 PSP 记录。
- **维护存储和密钥访问权限**。保持区域存储、服务权限和客户管理密钥授权的正确配置。
- **修复配置问题。** 在 OpenAI 提供通知后，修正存储配置问题。
- **响应有关安全问题的通知。** 与 OpenAI 协作，调查并处理相关问题。

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