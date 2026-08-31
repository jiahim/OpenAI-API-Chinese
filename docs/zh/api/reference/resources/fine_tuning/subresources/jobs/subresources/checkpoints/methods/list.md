> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

## 列出微调检查点

**get** `/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints`

列出微调作业的检查点。

### 路径参数

- `fine_tuning_job_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个检查点 ID 的标识符。

- `limit: optional number`

  要检索的检查点数量。

### Returns

- `data: array of FineTuningJobCheckpoint`

  - `id: string`

    检查点标识符，可在 API 端点中引用。

  - `created_at: number`

    检查点创建时的 Unix 时间戳（以秒为单位）。

  - `fine_tuned_model_checkpoint: string`

    所创建的微调检查点模型的名称。

  - `fine_tuning_job_id: string`

    创建此检查点的微调作业的名称。

  - `metrics: object { full_valid_loss, full_valid_mean_token_accuracy, step, 4 more }`

    微调作业中该步骤编号对应的指标。

    - `full_valid_loss: optional number`

    - `full_valid_mean_token_accuracy: optional number`

    - `step: optional number`

    - `train_loss: optional number`

    - `train_mean_token_accuracy: optional number`

    - `valid_loss: optional number`

    - `valid_mean_token_accuracy: optional number`

  - `object: "fine_tuning.job.checkpoint"`

    对象类型，始终为 "fine_tuning.job.checkpoint"。

    - `"fine_tuning.job.checkpoint"`

  - `step_number: number`

    创建该检查点时所对应的步骤编号。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/checkpoints \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "fine_tuned_model_checkpoint": "fine_tuned_model_checkpoint",
      "fine_tuning_job_id": "fine_tuning_job_id",
      "metrics": {
        "full_valid_loss": 0,
        "full_valid_mean_token_accuracy": 0,
        "step": 0,
        "train_loss": 0,
        "train_mean_token_accuracy": 0,
        "valid_loss": 0,
        "valid_mean_token_accuracy": 0
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 0
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/checkpoints \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:96olL566:ckpt-step-2000",
      "metrics": {
        "full_valid_loss": 0.134,
        "full_valid_mean_token_accuracy": 0.874
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 2000
    },
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:7q8mpxmy:ckpt-step-1000",
      "metrics": {
        "full_valid_loss": 0.167,
        "full_valid_mean_token_accuracy": 0.781
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 1000
    }
  ],
  "first_id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": true
}
```
