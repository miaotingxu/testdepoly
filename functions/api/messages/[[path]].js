export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        const { results } = await env.DB.prepare(
            'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100'
        ).all();
        
        return Response.json({
            success: true,
            messages: results
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return Response.json({
            success: false,
            error: '获取留言失败'
        }, { status: 500 });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { username, content } = await request.json();
        
        if (!username || !content) {
            return Response.json({
                success: false,
                error: '用户名和内容不能为空'
            }, { status: 400 });
        }
        
        const result = await env.DB.prepare(
            'INSERT INTO messages (username, content) VALUES (?, ?)'
        ).bind(username, content).run();
        
        if (!result.success) {
            throw new Error('Failed to insert message');
        }
        
        return Response.json({
            success: true,
            message: '留言添加成功'
        });
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json({
            success: false,
            error: '添加留言失败'
        }, { status: 500 });
    }
}