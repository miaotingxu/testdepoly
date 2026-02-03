# SSR 项目部署步骤

## 项目架构说明

本项目是纯 SSR（服务端渲染）项目，使用以下技术栈：
- Next.js 14 (Pages Router)
- React 18
- Cloudflare Functions（边缘函数）
- Cloudflare D1 数据库

**数据流**：
```
浏览器 → Next.js Server → Next.js API Routes → Cloudflare Functions → D1 数据库
                    ↓
              getServerSideProps()
                    ↓
              生成 HTML (包含数据)
                    ↓
              返回给浏览器
```

---

## 部署方案选择

### 方案一：部署到 Vercel（推荐）

**优点**：
- Next.js 官方支持，配置最简单
- 自动 SSR 支持
- 全球 CDN 加速
- 免费额度充足

**缺点**：
- 需要将 Cloudflare Functions 迁移到 Vercel Edge Functions
- D1 数据库需要改为其他数据库（如 PostgreSQL、MySQL）

---

### 方案二：部署到 Cloudflare Pages（推荐）

**优点**：
- 继续使用 Cloudflare Functions 和 D1
- 边缘计算，全球加速
- 免费额度充足
- 与现有技术栈完美匹配

**缺点**：
- 需要使用 `@cloudflare/next-on-pages` 适配器
- 配置相对复杂

---

## 方案一：部署到 Vercel

### 步骤 1：准备代码

由于 Vercel 不支持 Cloudflare D1，需要修改数据库连接方式。

#### 1.1 安装依赖

```bash
npm install @vercel/postgres
```

#### 1.2 创建环境变量文件

创建 `.env.local`：
```env
# Vercel PostgreSQL
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
```

#### 1.3 修改 API 路由

将 `pages/api/messages.js` 改为直接连接 PostgreSQL：

```javascript
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 100`;
      return res.status(200).json({ success: true, messages: rows });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ success: false, error: '获取留言失败' });
    }
  }

  if (method === 'POST') {
    try {
      const { username, content } = req.body;

      if (!username || !content) {
        return res.status(400).json({ success: false, error: '用户名和内容不能为空' });
      }

      const { rows } = await sql`
        INSERT INTO messages (username, content)
        VALUES (${username}, ${content})
        RETURNING *
      `;

      return res.status(200).json({ success: true, message: '留言添加成功' });
    } catch (error) {
      console.error('Error adding message:', error);
      return res.status(500).json({ success: false, error: '添加留言失败' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
```

#### 1.4 删除 Cloudflare Functions

删除 `functions/` 目录，因为 Vercel 使用 Edge Functions。

#### 1.5 修改 package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 步骤 2：部署到 Vercel

#### 2.1 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2.2 登录 Vercel

```bash
vercel login
```

#### 2.3 部署项目

```bash
vercel
```

按照提示操作：
1. 选择项目目录
2. 选择 "Link to existing project" 或 "Create new project"
3. 确认构建设置（默认即可）
4. 等待部署完成

#### 2.4 配置环境变量

在 Vercel Dashboard 中：
1. 进入项目设置
2. Settings → Environment Variables
3. 添加 PostgreSQL 连接字符串

#### 2.5 创建数据库表

在 Vercel Dashboard 中：
1. 进入项目设置
2. Storage → Create Database
3. 选择 PostgreSQL
4. 创建数据库后，执行以下 SQL：

```sql
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_created_at ON messages(created_at DESC);
```

### 步骤 3：验证部署

访问 Vercel 提供的 URL，测试留言功能。

---

## 方案二：部署到 Cloudflare Pages

### 步骤 1：安装适配器

```bash
npm install @cloudflare/next-on-pages
```

### 步骤 2：修改 package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npm run pages:build && wrangler pages dev .vercel/output/static"
  }
}
```

### 步骤 3：修改 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export'
}

module.exports = nextConfig
```

### 步骤 4：构建项目

```bash
npm run build
```

### 步骤 5：使用适配器构建

```bash
npm run pages:build
```

这会在 `.vercel/output/static` 目录生成静态文件。

### 步骤 6：部署到 Cloudflare Pages

#### 6.1 方式一：通过 Wrangler CLI

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy .vercel/output/static --project-name=d1-demo-nextjs
```

#### 6.2 方式二：通过 Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages → Create application
3. 选择 Pages → Upload assets
4. 上传 `.vercel/output/static` 目录
5. 或者选择 Connect to Git，连接 GitHub 仓库

### 步骤 7：配置 D1 数据库

#### 7.1 创建 D1 数据库

```bash
wrangler d1 create d1-demo-db
```

记录返回的 `database_id`。

#### 7.2 更新 wrangler.toml

```toml
name = "d1-demo-nextjs"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "d1-demo-db"
database_id = "your-database-id"
```

#### 7.3 执行数据库表结构

```bash
wrangler d1 execute d1-demo-db --file=./schema.sql
```

#### 7.4 在 Cloudflare Pages 中绑定数据库

1. 进入 Cloudflare Dashboard
2. 选择你的 Pages 项目
3. Settings → Functions → D1 database bindings
4. 添加绑定：
   - Variable name: `DB`
   - D1 database: `d1-demo-db`

### 步骤 8：配置环境变量（可选）

如果需要环境变量，在 Cloudflare Pages 中：
1. Settings → Environment variables
2. 添加所需的环境变量

### 步骤 9：验证部署

访问 Cloudflare Pages 提供的 URL，测试留言功能。

---

## 方案三：部署到自己的服务器

### 步骤 1：准备服务器

确保服务器满足以下要求：
- Node.js 18 或更高版本
- npm 或 yarn
- 足够的内存和磁盘空间

### 步骤 2：上传代码

```bash
# 使用 Git
git clone your-repo-url
cd your-project

# 或使用 SCP/FTP 上传代码
```

### 步骤 3：安装依赖

```bash
npm install
```

### 步骤 4：构建项目

```bash
npm run build
```

### 步骤 5：启动服务

```bash
npm start
```

默认运行在 `http://localhost:3000`。

### 步骤 6：使用 PM2 管理进程（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "d1-demo" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs d1-demo

# 重启应用
pm2 restart d1-demo
```

### 步骤 7：配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 步骤 8：配置 SSL（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com
```

---

## 本地开发

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`。

### 本地测试 D1 数据库

```bash
# 创建本地数据库
wrangler d1 create d1-demo-db-local

# 执行 SQL 文件
wrangler d1 execute d1-demo-db-local --file=./schema.sql

# 测试查询
wrangler d1 execute d1-demo-db-local --command="SELECT * FROM messages"
```

---

## 常见问题

### Q1: 部署后页面空白？

**A**: 检查以下几点：
1. 确认 `getServerSideProps` 正确返回数据
2. 检查浏览器控制台是否有错误
3. 确认 API 路由是否正常工作
4. 检查数据库连接是否正常

### Q2: API 请求失败？

**A**:
1. 检查环境变量配置
2. 确认数据库绑定是否正确
3. 查看 Cloudflare Functions 日志
4. 检查网络请求是否被 CORS 阻止

### Q3: SSR 渲染速度慢？

**A**:
1. 使用缓存策略
2. 优化数据库查询
3. 使用 CDN 加速
4. 实现代码分割

### Q4: 如何查看部署日志？

**Vercel**:
- Dashboard → Deployments → 选择部署 → View Logs

**Cloudflare Pages**:
- Dashboard → Pages → 项目 → Functions → Logs

---

## 推荐方案

**对于初学者**：推荐使用 **Vercel**，配置简单，官方支持。

**对于需要 Cloudflare 生态**：推荐使用 **Cloudflare Pages**，继续使用 D1 和 Functions。

**对于需要完全控制**：推荐使用 **自己的服务器**，使用 PM2 + Nginx。
