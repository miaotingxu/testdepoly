// 模拟数据，用于本地开发测试
// Cloudflare 部署时取消下面注释，API 使用标准 edge runtime
// export const runtime = 'edge'

let mockMessages = [
  {
    id: 1,
    username: '示例用户',
    content: '欢迎使用留言板！这是一条示例留言。',
    created_at: new Date().toISOString()
  }
]

export default async function handler(req) {
  const isProduction = process.env.NODE_ENV === 'production'

  if (req.method === 'GET') {
    try {
      // 生产环境：调用 Cloudflare Functions
      if (isProduction) {
        const response = await fetch(`${process.env.API_URL || ''}/api/messages`)
        if (!response.ok) {
          return new Response(JSON.stringify({ 
            success: false,
            error: '获取留言失败' 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        const data = await response.json()
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // 本地开发：返回模拟数据
      return new Response(JSON.stringify({
        success: true,
        messages: mockMessages
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      return new Response(JSON.stringify({ 
        success: false,
        error: '获取留言失败' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json()
      const { username, content } = body

      if (!username || !content) {
        return new Response(JSON.stringify({ 
          success: false,
          error: '用户名和内容不能为空' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 生产环境：调用 Cloudflare Functions
      if (isProduction) {
        const response = await fetch(`${process.env.API_URL || ''}/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, content })
        })

        if (!response.ok) {
          return new Response(JSON.stringify({ 
            success: false,
            error: '添加留言失败' 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        const data = await response.json()
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // 本地开发：添加到模拟数据
      const newMessage = {
        id: mockMessages.length + 1,
        username,
        content,
        created_at: new Date().toISOString()
      }
      mockMessages.unshift(newMessage)
      
      return new Response(JSON.stringify({
        success: true,
        message: '留言添加成功'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error adding message:', error)
      return new Response(JSON.stringify({ 
        success: false,
        error: '添加留言失败' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response(JSON.stringify({ 
    success: false,
    error: 'Method Not Allowed' 
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  })
}
