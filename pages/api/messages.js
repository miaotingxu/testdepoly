import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export default async function handler(req) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // 获取 Cloudflare 环境上下文
  let env;
  try {
    const context = getRequestContext();
    env = context.env;
  } catch (e) {
    console.warn('Could not get Cloudflare context (likely local dev):', e);
  }

  // GET 请求：获取所有留言
  if (req.method === 'GET') {
    try {
      if (isProduction && env && env.DB) {
        const { results } = await env.DB.prepare(
          'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100'
        ).all();
        
        return new Response(JSON.stringify({
          success: true,
          messages: results
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // 本地开发或 D1 未绑定时返回模拟数据
        return new Response(JSON.stringify({
          success: true,
          messages: [
            {
              id: 1,
              username: '示例用户',
              content: '这是本地模拟数据。部署到 Cloudflare 并绑定 D1 后将显示真实留言。',
              created_at: new Date().toISOString()
            }
          ]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('GET Error:', error);
      return new Response(JSON.stringify({ success: false, error: '获取留言失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // POST 请求：添加留言
  if (req.method === 'POST') {
    try {
      const { username, content } = await req.json();
      
      if (!username || !content) {
        return new Response(JSON.stringify({ success: false, error: '用户名和内容不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (isProduction && env && env.DB) {
        const result = await env.DB.prepare(
          'INSERT INTO messages (username, content) VALUES (?, ?)'
        ).bind(username, content).run();
        
        if (!result.success) {
          throw new Error('Failed to insert message');
        }

        return new Response(JSON.stringify({ success: true, message: '留言添加成功' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ success: true, message: '本地添加成功 (仅模拟)' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('POST Error:', error);
      return new Response(JSON.stringify({ success: false, error: '添加留言失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
