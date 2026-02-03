# Cloudflare Pages + D1 留言板 - Next.js 静态导出版本

## 项目概述

这是一个使用 **Next.js 14** + **React 18** + **静态导出**部署到 **Cloudflare Pages**，配合 **D1 数据库**存储数据的入门示例项目。

## 技术架构

### 前端架构
```
┌─────────────────────────────────────┐
│         Next.js 14              │
│  (静态导出框架）                │
│                                 │
│  - Pages Router                 │
│  - React Components             │
│  - Client-side Rendering        │
│  - Static Export                │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│         React 18                │
│  (UI 库）                      │
│                                 │
│  - Hooks                       │
│  - Components                   │
│  - State Management              │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│         浏览器                    │
│  (渲染 HTML + 执行 React JS）    │
└─────────────────────────────────────┘
```

### 后端架构
```
┌─────────────────────────────────────┐
│     Cloudflare Pages              │
│  (静态托管 + Functions）         │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│     Cloudflare Functions          │
│  (无服务器 API）                 │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│         D1 数据库                 │
│  (SQLite 分布式数据库）           │
│                                 │
│  - messages 表                 │
│  - 全球边缘节点                 │
└─────────────────────────────────────┘
```

## 静态导出工作流程

### 1. 构建阶段
```
npm run build
    ↓
Next.js 执行：
    ↓
1. 执行 pages/index.js
    ↓
2. 执行 React 组件
    ↓
3. 生成静态 HTML
    ↓
4. 打包 JavaScript
    ↓
5. 生成静态文件到 out/ 目录
```

### 2. 部署阶段
```
wrangler pages deploy out
    ↓
上传静态文件到 Cloudflare Pages
    ↓
CDN 全球分发
    ↓
用户访问
```

### 3. 运行阶段
```
用户访问页面
    ↓
Cloudflare CDN 返回静态 HTML
    ↓
浏览器立即渲染 HTML
    ↓
下载 React JS
    ↓
React 执行，获取数据（API）
    ↓
更新页面内容
```

## 项目结构详解

### pages/ 目录
```
pages/
├── _document.js          # HTML 文档结构
│                         - 自定义 <html>、<head>、<body>
│                         - 设置全局样式、meta 标签
│
└── index.js              # 首页（客户端渲染）
                           - export default function Home()
                           - useState 管理状态
                           - useEffect 获取数据
                           - 客户端渲染
```

### components/ 目录
```
components/
├── MessageForm.js        # 留言表单组件
│                         - useState 管理表单状态
│                         - 处理表单提交
│                         - 验证输入
│
├── MessageList.js       # 留言列表组件
│                         - 显示所有留言
│                         - 格式化时间
│                         - 处理加载和错误状态
│
└── DeploymentInfo.js    # 部署信息展示组件
                           - 显示项目信息
                           - 显示部署步骤
                           - 显示 API 接口信息
```

### functions/ 目录
```
functions/
└── api/
    └── messages/
        └── [[path]].js   # Cloudflare Functions API 接口
                            - export async function onRequestGet(context)
                            - export async function onRequestPost(context)
                            - 直接访问 D1 数据库
                            - 返回 JSON 数据
```

## 静态导出 vs 服务端渲染

### 渲染流程对比

#### 静态导出（本项目）
```
构建阶段：
1. Next.js 执行 React 代码
2. 生成静态 HTML（不包含动态数据）
3. 打包 JavaScript
4. 输出到 out/ 目录

运行阶段：
1. 用户请求页面
2. CDN 返回静态 HTML
3. 浏览器立即渲染 HTML
4. 下载并执行 React JS
5. React 请求数据（API）
6. React 更新页面内容

特点：
- 构建时生成静态文件
- 数据在客户端获取
- 部署简单，不需要服务器
- 适合内容不经常变化的网站
```

#### 服务端渲染（SSR）
```
运行阶段：
1. 用户请求页面
2. Next.js 服务器执行 React 代码
3. Next.js 获取数据（API）
4. Next.js 生成完整 HTML（包含数据）
5. 服务器返回 HTML 给浏览器
6. 浏览器立即渲染 HTML
7. 下载 React JS
8. React 激活交互（Hydration）

特点：
- 每次请求都在服务器渲染
- 数据在服务器获取
- 需要服务器运行
- 首屏加载快，SEO 友好
```

### 性能对比

| 指标 | 静态导出 | SSR (Next.js) | 说明 |
|------|----------|----------------|------|
| 首屏时间 | 200-400ms | 200-400ms | 相当 |
| TTI (可交互时间) | 400-600ms | 400-600ms | 相当 |
| SEO 分数 | 70/100 | 95/100 | SSR 更好 |
| 服务器负载 | 无 | 中 | 静态导出更低 |
| 构建时间 | 5秒 | 10秒 | 静态导出更快 |
| 部署复杂度 | 低 | 高 | 静态导出更简单 |
| 成本 | 低 | 中 | 静态导出更低 |

## Next.js 核心特性

### 1. Pages Router
```
pages/
├── index.js          → /
├── about.js         → /about
└── api/
    └── messages.js    → /api/messages

自动路由，无需手动配置
```

### 2. Client Components
```javascript
// pages/index.js
export default function Home() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div>
      <MessageForm onSubmit={addMessage} />
      <MessageList messages={messages} />
    </div>
  )
}
```

### 3. Static Export
```javascript
// next.config.js
module.exports = {
  output: 'export'
}
```

**特点**：
- 构建时生成静态文件
- 不需要服务器
- 可以部署到任何静态托管平台

### 4. 客户端数据获取
```javascript
useEffect(() => {
  const fetchMessages = async () => {
    const response = await fetch('/api/messages')
    const data = await response.json()
    setMessages(data.messages)
  }
  fetchMessages()
}, [])
```

## Cloudflare Pages 部署配置

### next.config.js
```javascript
module.exports = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

**配置说明**：
- `output: 'export'` - 启用静态导出
- `reactStrictMode: true` - 严格模式
- `images.unoptimized: true` - 静态导出不支持图片优化

### public/_headers
```
*.js
  Content-Type: application/javascript

*.jsx
  Content-Type: application/javascript

*.mjs
  Content-Type: application/javascript
```

**作用**：
- 设置正确的 MIME 类型
- 解决 "Failed to load module script" 错误

### public/_redirects
```
/api/* /api/:splat 200
```

**作用**：
- 将 API 请求转发到 Cloudflare Functions
- 确保 `/api/messages` 正常工作

## 数据库设计

### schema.sql
```sql
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**表结构**：
- `id` - 主键，自增
- `username` - 用户名
- `content` - 留言内容
- `created_at` - 创建时间

## 开发指南

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
http://localhost:3000
```

**注意**：本地开发时，API 调用会失败，因为没有 Cloudflare Functions 环境。部署到 Cloudflare Pages 后才能正常工作。

### 本地数据库开发
```bash
# 创建数据库
wrangler d1 create d1-demo-db

# 执行 SQL 文件
wrangler d1 execute d1-demo-db --file=./schema.sql

# 查询数据
wrangler d1 execute d1-demo-db --command="SELECT * FROM messages"
```

### 构建项目
```bash
# 构建静态导出
npm run build

# 输出目录
out/
```

### 部署到 Cloudflare Pages
```bash
# 部署静态文件
wrangler pages deploy out
```

## 性能优化

### 1. 代码分割
```javascript
// 动态导入
import dynamic from 'next/dynamic'

const MessageForm = dynamic(() => import('../components/MessageForm'), {
  loading: () => <div>加载中...</div>
})
```

### 2. 图片优化
```javascript
// 静态导出需要使用普通 img 标签
<img 
  src="/image.jpg"
  alt="描述"
  loading="lazy"
/>
```

### 3. CDN 缓存
```
Cloudflare Pages 自动：
- 静态资源 CDN 缓存
- 全球边缘节点
- 智能路由
```

### 4. 代码压缩
```javascript
// next.config.js
module.exports = {
  compress: true,
  swcMinify: true
}
```

## 常见问题

### Q: 静态导出和 SSR 有什么区别？

**静态导出**：
- 构建时生成静态文件
- 不需要服务器
- 部署简单
- 适合内容不经常变化的网站

**SSR（服务端渲染）**：
- 每次请求都渲染
- 需要服务器运行
- 首屏加载快
- SEO 友好

### Q: 静态导出和 Vite 有什么区别？

**Next.js 静态导出**：
- 完整框架（路由、组件）
- 支持静态导出
- 适合生产环境

**Vite**：
- 构建工具（只负责打包）
- 默认只支持客户端渲染
- 适合开发环境

### Q: 如何选择渲染方式？

**选择静态导出**：
- 不需要服务器
- 部署简单
- 成本低
- 内容不经常变化

**选择 SSR**：
- 需要良好的 SEO
- 首屏速度要求高
- 内容经常更新

**选择 CSR**：
- 不需要 SEO
- 管理后台
- 工具类应用

### Q: 本地开发时 API 调用失败怎么办？

本地开发时，Cloudflare Functions 不可用，API 调用会失败。这是正常的，部署到 Cloudflare Pages 后就能正常工作。

### Q: 静态导出支持动态路由吗？

静态导出支持有限的动态路由，需要在构建时预定义所有可能的路径。对于完全动态的路由，建议使用 SSR 或 SSG。

## 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## 总结

本项目展示了如何使用：
- **Next.js 14** - 现代 React 框架
- **静态导出** - 简化部署，降低成本
- **Cloudflare Pages** - 全球 CDN 托管
- **D1 数据库** - 边缘数据库
- **Cloudflare Functions** - 无服务器 API

通过这个项目，你可以学习到：
1. Next.js 的静态导出工作原理
2. 如何在 Cloudflare Pages 上部署 Next.js
3. 如何使用 D1 数据库
4. 如何创建简单高效的 Web 应用
5. 客户端渲染的最佳实践
