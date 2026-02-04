import { useState } from 'react'
import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'
import DeploymentInfo from '../components/DeploymentInfo'

export default function Home({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || [])
  const [error, setError] = useState(null)

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
        const newMessage = {
          id: Date.now(),
          username,
          content,
          created_at: new Date().toISOString()
        }
        setMessages(prev => [newMessage, ...prev])
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
        <p className="subtitle">使用 Cloudflare Pages 部署前端应用，配合 D1 数据库存储数据 - Next.js SSR 版本</p>
      </header>

      <main>
        <MessageForm onSubmit={addMessage} />
        <MessageList messages={messages} error={error} />
      </main>

      <section className="deployment-section">
        <DeploymentInfo />
      </section>

      <footer>
        <p>Powered by Cloudflare Pages & D1 Database & Next.js SSR</p>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const response = await fetch('/api/messages')
    if (!response.ok) {
      return { props: { initialMessages: [] } }
    }

    const data = await response.json()
    return { props: { initialMessages: data.messages || [] } }
  } catch (err) {
    console.error('Error:', err)
    return { props: { initialMessages: [] } }
  }
}
