> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取该页面的 Markdown 版本。

## 拒绝呼叫

**post** `/realtime/calls/{call_id}/reject`

通过向来电方返回 SIP 状态码来拒绝接入的 SIP 通话。

### 路径参数

- `call_id: string`

### 请求体参数

- `status_code: optional number`

  回传给呼叫方的 SIP 响应码。默认值为 `603` （Decline）
  ，若省略则使用默认值。

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```
