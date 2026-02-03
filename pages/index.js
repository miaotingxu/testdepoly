import { useState, useEffect } from 'react'
import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'
import DeploymentInfo from '../components/DeploymentInfo'
import '../styles/globals.css'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages')
      
      if (!response.ok) {
        throw new Error('获取留言失败')
      }

      const data = await response.json()
      if (data.success) {
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (username, content) => {
    try {
      const response = await fetch('/api/messages', {
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

  return (
    <div className="container">
      <header>
        <h1>🚀 Cloudflare Pages + D1 入门 Demo</h1>
        <p className="subtitle">使用 Cloudflare Pages 部署前端应用，配合 D1 数据库存储数据 - Next.js 静态导出版本</p>
      </header>

      <main>
        <MessageForm onSubmit={addMessage} />
        <MessageList messages={messages} error={error} loading={loading} />
      </main>

      <section className="deployment-section">
        <DeploymentInfo />
      </section>

      <footer>
        <p>Powered by Cloudflare Pages & D1 Database & Next.js Static Export</p>
      </footer>
    </div>
  )
}
