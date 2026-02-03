export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    try {
      const response = await fetch(`${process.env.API_URL || ''}/api/messages`)
      if (!response.ok) {
        return res.status(500).json({ 
          success: false,
          error: '获取留言失败' 
        })
      }

      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      return res.status(500).json({ 
        success: false,
        error: '获取留言失败' 
      })
    }
  }

  if (method === 'POST') {
    try {
      const { username, content } = req.body

      if (!username || !content) {
        return res.status(400).json({ 
          success: false,
          error: '用户名和内容不能为空' 
        })
      }

      const response = await fetch(`${process.env.API_URL || ''}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, content })
      })

      if (!response.ok) {
        return res.status(500).json({ 
          success: false,
          error: '添加留言失败' 
        })
      }

      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      console.error('Error adding message:', error)
      return res.status(500).json({ 
        success: false,
        error: '添加留言失败' 
      })
    }
  }

  return res.status(405).json({ 
    success: false,
    error: 'Method Not Allowed' 
  })
}
