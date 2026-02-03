import { useState } from 'react'

export default function MessageForm({ onSubmit }) {
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim() || !content.trim()) {
      alert('请填写用户名和留言内容')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(username.trim(), content.trim())
      setUsername('')
      setContent('')
    } catch (err) {
      alert('添加留言失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="card">
      <h2>📝 添加留言</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名：</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="请输入用户名"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">留言内容：</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="请输入留言内容"
            rows="4"
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : '提交留言'}
        </button>
      </form>
    </section>
  )
}