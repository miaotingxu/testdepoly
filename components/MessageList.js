export default function MessageList({ messages, error }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="card">
        <div className="loading">暂无留言，快来抢沙发吧！</div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>💬 留言列表 ({messages.length})</h2>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-header">
              <span className="message-username">{message.username}</span>
              <span className="message-time">{formatTime(message.created_at)}</span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
