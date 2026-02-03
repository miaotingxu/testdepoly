import { useState, useEffect } from 'react'
import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'
import DeploymentInfo from './components/DeploymentInfo'

const IS_DEV = import.meta.env.DEV

const mockMessages = [
  {
    id: 1,
    username: '开发者',
    content: '欢迎来到 Cloudflare Pages + D1 留言板！这是一个 React 版本的演示项目。',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    username: 'Cloudflare',
    content: 'D1 是 Cloudflare 的分布式 SQL 数据库，支持完整的 SQL 语法。',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    username: 'React',
    content: 'React 18 带来了并发渲染、自动批处理等新特性，让应用性能更好。',
    created_at: new Date(Date.now() - 10800000).toISOString()
  }
]

export default function App() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const [isLocalMode, setIsLocalMode] = useState(false)

  const API_BASE = '/api/messages'

  const fetchMessages = async () => {
    if (IS_DEV) {
      console.log('本地开发模式：使用 mock 数据')
      setMessages(mockMessages)
      setError(null)
      setIsLocalMode(true)
      return
    }

    try {
      const response = await fetch(API_BASE)
      
      if (!response.ok) {
        throw new Error('获取留言失败')
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API 返回的不是 JSON 数据')
      }
      
      const data = await response.json()
      setMessages(data.messages)
      setError(null)
      setIsLocalMode(false)
    } catch (err) {
      console.error('Error:', err)
      setError('获取留言失败，请稍后重试')
    }
  }

  const addMessage = async (username, content) => {
    if (IS_DEV) {
      const newMessage = {
        id: Date.now(),
        username,
        content,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [newMessage, ...prev])
      return
    }

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

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API 返回的不是 JSON 数据')
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

      {isLocalMode && (
        <div className="dev-mode-banner">
          <span className="dev-mode-icon">⚠️</span>
          <div className="dev-mode-content">
            <strong>本地开发模式</strong>
            <span>当前使用 mock 数据，部署到 Cloudflare Pages 后将连接真实 D1 数据库</span>
          </div>
        </div>
      )}

      <main>
        <MessageForm onSubmit={addMessage} />
        <MessageList messages={messages} error={error} />
      </main>

      <section className="deployment-section">
        <DeploymentInfo />
      </section>

      <footer>
        <p>Powered by Cloudflare Pages & D1 Database & React</p>
      </footer>
    </div>
  )
}