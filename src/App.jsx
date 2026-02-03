import { useState, useEffect } from 'react'
import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'

export default function App() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  const API_BASE = '/api/messages'

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_BASE)
      if (!response.ok) {
        throw new Error('获取留言失败')
      }
      const data = await response.json()
      setMessages(data.messages)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('获取留言失败，请稍后重试')
    }
  }

  const addMessage = async (username, content) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, content })
      })

      if (!response.ok) {
        throw new Error('添加留言失败')
      }

      const data = await response.json()
      if (data.success) {
        await fetchMessages()
      }
    } catch (err) {
      console.error('Error:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div className="container">
      <header>
        <h1>🚀 Cloudflare Pages + D1 入门 Demo</h1>
        <p className="subtitle">使用 Cloudflare Pages 部署前端应用，配合 D1 数据库存储数据 - React 版本</p>
      </header>

      <main>
        <MessageForm onSubmit={addMessage} />
        <MessageList messages={messages} error={error} />
      </main>

      <footer>
        <p>Powered by Cloudflare Pages & D1 Database & React</p>
      </footer>
    </div>
  )
}