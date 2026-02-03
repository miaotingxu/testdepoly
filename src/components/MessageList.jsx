export default function MessageList({ messages, error }) {
  const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} 分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} 小时前`
    } else {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  if (error) {
    return (
      <section className="card">
        <h2>💬 留言列表</h2>
        <div className="error">{escapeHtml(error)}</div>
      </section>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <section className="card">
        <h2>💬 留言列表</h2>
        <p className="loading">暂无留言，快来添加第一条吧！</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>💬 留言列表</h2>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-header">
              <span className="message-username">
                {escapeHtml(message.username)}
              </span>
              <span className="message-time">
                {formatTime(message.created_at)}
              </span>
            </div>
            <div className="message-content">
              {escapeHtml(message.content)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}