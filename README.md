# Cloudflare Pages + D1 入门 Demo - React 版本

这是一个使用 Cloudflare Pages 部署 React 应用，配合 D1 数据库存储数据的入门示例项目。

## 项目结构

```
test/
├── index.html              # HTML 入口文件
├── package.json            # 项目依赖配置
├── vite.config.js          # Vite 构建配置
├── wrangler.toml           # Cloudflare 配置文件
├── .gitignore             # Git 忽略文件
├── schema.sql              # D1 数据库表结构
├── src/
│   ├── main.jsx            # React 入口文件
│   ├── App.jsx             # 主应用组件
│   ├── App.css             # 全局样式
│   └── components/
│       ├── MessageForm.jsx   # 留言表单组件
│       └── MessageList.jsx  # 留言列表组件
└── functions/
    └── api/
        └── messages/
            └── [[path]].js # Cloudflare Functions API 接口
```

## 功能特性

- 📝 留言板功能：用户可以添加和查看留言
- 🎨 精美的 UI 设计：响应式布局，支持移动端
- 💾 D1 数据库：使用 Cloudflare D1 存储留言数据
- 🚀 Cloudflare Pages：全球 CDN 加速
- ⚡ Cloudflare Functions：无服务器 API 接口
- ⚛️ React 18：使用最新 React 特性和 Hooks
- 🔨 Vite：快速的开发体验和构建工具

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **语言**: JavaScript (ES6+)
- **样式**: CSS3
- **后端**: Cloudflare Functions (JavaScript)
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages

## 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create d1-demo-db

# 记录输出的 database_id，后续需要用到
```

### 3. 更新 wrangler.toml

打开 `wrangler.toml` 文件，将 `database_id` 替换为你的实际 ID。

### 4. 初始化数据库表结构

```bash
# 执行 schema.sql 创建表
wrangler d1 execute d1-demo-db --remote --file=./schema.sql
```

### 5. 构建项目

```bash
npm run build
```

### 6. 部署到 Cloudflare Pages

#### 方式一：通过 Wrangler CLI

```bash
# 创建 Pages 项目
wrangler pages project create d1-demo-react --production-branch=main

# 部署项目
wrangler pages deploy dist
```

#### 方式二：通过 Cloudflare Dashboard（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** -> **Create application**
3. 选择 **Pages** -> **Connect to Git**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Project name**: `d1-demo-react`
   - **Production branch**: `main`
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**

### 7. 绑定 D1 数据库到 Pages Functions

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. **Settings** -> **Functions** -> **D1 database bindings**
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: `d1-demo-db`

### 8. 测试部署

部署完成后，访问 Cloudflare 提供的 URL，你应该能看到留言板界面。

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看效果。

### 本地数据库开发

```bash
# 查询本地数据库
wrangler d1 execute d1-demo-db --command="SELECT * FROM messages"

# 执行 SQL 文件
wrangler d1 execute d1-demo-db --file=./schema.sql
```

## React 组件说明

### App.jsx

主应用组件，管理全局状态和 API 调用。

```jsx
export default function App() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  // 获取留言列表
  const fetchMessages = async () => { ... }

  // 添加留言
  const addMessage = async (username, content) => { ... }

  // 页面加载时获取留言
  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div className="container">
      <MessageForm onSubmit={addMessage} />
      <MessageList messages={messages} error={error} />
    </div>
  )
}
```

### MessageForm.jsx

留言表单组件，处理用户输入和表单提交。

```jsx
export default function MessageForm({ onSubmit }) {
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => { ... }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={...} />
      <textarea value={content} onChange={...} />
      <button>提交留言</button>
    </form>
  )
}
```

### MessageList.jsx

留言列表组件，显示所有留言。

```jsx
export default function MessageList({ messages, error }) {
  const formatTime = (timestamp) => { ... }

  return (
    <div className="message-list">
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.username}</strong>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )
}
```

## API 接口说明

### 获取留言列表

```
GET /api/messages
```

响应示例：
```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "username": "张三",
      "content": "这是一条测试留言",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

### 添加留言

```
POST /api/messages
Content-Type: application/json

{
  "username": "张三",
  "content": "这是一条测试留言"
}
```

响应示例：
```json
{
  "success": true,
  "message": "留言添加成功"
}
```

## 常见问题

### Q: 如何查看数据库中的数据？

```bash
# 查询所有留言
wrangler d1 execute d1-demo-db --remote --command="SELECT * FROM messages"
```

### Q: 如何删除数据库？

```bash
wrangler d1 delete d1-demo-db
```

### Q: 如何查看部署日志？

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. **Deployments** -> 选择部署 -> **Logs**

### Q: 如何自定义域名？

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. **Custom domains** -> **Set up a custom domain`

## 学习资源

- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## 许可证

MIT License