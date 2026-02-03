# Cloudflare Pages + D1 入门 Demo - Next.js SSR 版本

这是一个使用 Next.js SSR（服务端渲染）部署到 Cloudflare Pages，配合 D1 数据库存储数据的入门示例项目。

## 项目特点

- ⚡ **SSR（服务端渲染）**：在服务器上生成 HTML，首屏加载快
- 🔍 **SEO 友好**：搜索引擎可以完整抓取页面内容
- 💾 **D1 数据库**：使用 Cloudflare D1 存储留言数据
- 🚀 **Cloudflare Pages**：全球 CDN 加速
- ⚛️ **Next.js 14**：使用最新 React 特性和 App Router
- 🔨 **React 18**：使用最新 React 特性和 Hooks

## 项目结构

```
test/
├── pages/
│   ├── _document.js          # HTML 文档结构
│   ├── index.js              # 首页（SSR）
│   └── api/
│       └── messages.js        # Next.js API 路由
├── components/
│   ├── MessageForm.js        # 留言表单组件
│   ├── MessageList.js       # 留言列表组件
│   └── DeploymentInfo.js    # 部署信息展示组件
├── functions/
│   └── api/
│       └── messages/
│           └── [[path]].js   # Cloudflare Functions API 接口
├── styles/
│   └── globals.css           # 全局样式
├── public/                    # 静态资源
│   ├── _headers             # Cloudflare Pages 响应头配置
│   └── _redirects          # Cloudflare Pages 路由重定向配置
├── package.json                # 项目依赖配置
├── next.config.js             # Next.js 配置文件
├── wrangler.toml              # Cloudflare 配置文件
├── .gitignore                # Git 忽略文件
└── schema.sql                 # D1 数据库表结构
```

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 库**: React 18
- **渲染方式**: SSR (服务端渲染)
- **语言**: JavaScript (ES6+)
- **样式**: CSS3
- **后端**: Cloudflare Functions (JavaScript)
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages

## SSR vs CSR 对比

### CSR（客户端渲染）- 之前的 Vite 版本
```
用户请求 → 空HTML → 下载JS → 执行JS → 生成DOM → 渲染
  0ms      50ms     200ms    400ms    600ms    800ms
                    ↑ 用户看到白屏
```

**缺点**：
- 首屏加载慢
- SEO 不友好
- 白屏时间长

### SSR（服务端渲染）- 当前的 Next.js 版本
```
用户请求 → 服务器渲染 → 返回HTML → 渲染 → JS加载 → 激活交互
  0ms      100ms        150ms    200ms    400ms    600ms
        ↑ 用户立即看到内容
```

**优点**：
- 首屏加载快
- SEO 友好
- 无白屏

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

### 5. 本地开发

```bash
npm run dev
```

访问 `http://localhost:3000` 查看效果。

### 6. 构建项目

```bash
npm run build
```

### 7. 部署到 Cloudflare Pages

#### 方式一：通过 Wrangler CLI

```bash
# 使用 @cloudflare/next-on-pages 部署
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static
```

#### 方式二：通过 Cloudflare Dashboard（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** -> **Create application**
3. 选择 **Pages** -> **Connect to Git**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Project name**: `d1-demo-nextjs`
   - **Production branch**: `main`
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
6. 点击 **Save and Deploy**

### 8. 绑定 D1 数据库到 Pages Functions

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. **Settings** -> **Functions** -> **D1 database bindings**
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: `d1-demo-db`

### 9. 测试部署

部署完成后，访问 Cloudflare 提供的 URL，你应该能看到留言板界面。

## Next.js 组件说明

### pages/index.js

首页组件，使用 SSR 渲染。

```javascript
export default function Home({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || [])

  const addMessage = async (username, content) => { ... }

  return (
    <div className="container">
      <MessageForm onSubmit={addMessage} />
      <MessageList messages={messages} error={error} />
    </div>
  )
}

// 服务端获取数据（SSR）
export async function getServerSideProps() {
  const response = await fetch('/api/messages')
  const data = await response.json()
  return { props: { initialMessages: data.messages } }
}
```

**SSR 特点**：
- `getServerSideProps` 在服务器上执行
- 数据在服务器上获取
- HTML 在服务器上生成
- 首屏加载快

### components/MessageForm.js

留言表单组件，处理用户输入和表单提交。

```javascript
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

### components/MessageList.js

留言列表组件，显示所有留言。

```javascript
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

### components/DeploymentInfo.js

部署信息展示组件，显示项目部署信息。

```javascript
export default function DeploymentInfo() {
  const deploymentInfo = {
    project: { ... },
    build: { ... },
    deployment: { ... },
    steps: [ ... ],
    api: { ... }
  }

  return (
    <div className="deployment-info">
      {/* 显示部署信息 */}
    </div>
  )
}
```

## API 接口说明

### Next.js API Routes（pages/api/messages.js）

```javascript
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 获取留言列表
    const response = await fetch('/api/messages')
    const data = await response.json()
    return res.json(data)
  }

  if (req.method === 'POST') {
    // 添加留言
    const { username, content } = req.body
    const response = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ username, content })
    })
    return res.json(data)
  }
}
```

### Cloudflare Functions（functions/api/messages/[[path]].js）

```javascript
export async function onRequestGet(context) {
  const { env } = context
  const { results } = await env.DB.prepare(
    'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100'
  ).all()
  
  return Response.json({ success: true, messages: results })
}

export async function onRequestPost(context) {
  const { request, env } = context
  const { username, content } = await request.json()
  
  const result = await env.DB.prepare(
    'INSERT INTO messages (username, content) VALUES (?, ?)'
  ).bind(username, content).run()
  
  return Response.json({ success: true, message: '留言添加成功' })
}
```

## Cloudflare Pages 配置文件说明

### public/_headers

设置文件的 MIME 类型，确保浏览器正确识别文件类型：

```
*.js
  Content-Type: application/javascript

*.jsx
  Content-Type: application/javascript

*.mjs
  Content-Type: application/javascript
```

### public/_redirects

配置 API 路由，将 API 请求转发到 Cloudflare Functions：

```
/api/* /api/:splat 200
```

## 常见问题

### Q: 如何查看数据库中的数据？

```bash
# 查询所有留言
wrangler d1 execute d1-demo-db --remote --command="SELECT * FROM messages"
```

### Q: SSR 和 CSR 有什么区别？

**SSR（服务端渲染）**：
- 服务器生成 HTML
- 首屏加载快
- SEO 友好
- 适合内容网站

**CSR（客户端渲染）**：
- 浏览器生成 HTML
- 首屏加载慢
- SEO 不友好
- 适合管理后台

### Q: Next.js 和 Vite 有什么区别？

**Next.js**：
- 框架（包含路由、SSR、API Routes）
- 支持 SSR/SSG/ISR
- 适合生产环境

**Vite**：
- 构建工具（只负责打包）
- 默认只支持 CSR
- 适合开发环境

### Q: 如何自定义域名？

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. **Custom domains** -> **Set up a custom domain**

## 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## 许可证

MIT License
