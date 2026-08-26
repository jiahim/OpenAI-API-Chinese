> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过追加 `.md` 到页面 URL，可获取各文档页的 Markdown 版本。

## 参考资料调用

**post** `/realtime/calls/{call_id}/refer`

使用 SIP REFER 动词将活动中的 SIP 通话转接到新目的地。

### 路径参数

- `call_id: string`

### 请求体参数

- `target_uri: string`

  应出现在 SIP Refer-To 头部中的 URI。支持如下值
  `tel:+14155550123` 或 `sip:agent@example.com`.

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/refer \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "target_uri": "tel:+14155550123"
        }'
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/refer \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```
