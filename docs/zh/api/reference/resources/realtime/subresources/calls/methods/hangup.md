> 完整的文档索引请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加以下内容来获取该页面的 Markdown 版本： `.md` 。

## 挂断通话

**post** `/realtime/calls/{call_id}/hangup`

结束一次活动的 Realtime API 调用，无论该调用是通过 SIP 还是
WebRTC 发起的。

### 路径参数

- `call_id: string`

### 示例

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
