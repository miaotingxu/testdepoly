const API_BASE = '/api/messages';

async function fetchMessages() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) {
            throw new Error('获取留言失败');
        }
        const data = await response.json();
        displayMessages(data.messages);
    } catch (error) {
        console.error('Error:', error);
        showError('获取留言失败，请稍后重试');
    }
}

async function addMessage(username, content) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, content }),
        });

        if (!response.ok) {
            throw new Error('添加留言失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function displayMessages(messages) {
    const messageList = document.getElementById('messageList');
    
    if (messages.length === 0) {
        messageList.innerHTML = '<p class="loading">暂无留言，快来添加第一条吧！</p>';
        return;
    }

    messageList.innerHTML = messages.map(message => `
        <div class="message-item">
            <div class="message-header">
                <span class="message-username">${escapeHtml(message.username)}</span>
                <span class="message-time">${formatTime(message.created_at)}</span>
            </div>
            <div class="message-content">${escapeHtml(message.content)}</div>
        </div>
    `).join('');
}

function showError(message) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) {
        return '刚刚';
    } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)} 分钟前`;
    } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)} 小时前`;
    } else {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const content = document.getElementById('content').value.trim();
    
    if (!username || !content) {
        showError('请填写用户名和留言内容');
        return;
    }

    try {
        await addMessage(username, content);
        document.getElementById('messageForm').reset();
        await fetchMessages();
    } catch (error) {
        showError('添加留言失败，请稍后重试');
    }
});

document.addEventListener('DOMContentLoaded', fetchMessages);