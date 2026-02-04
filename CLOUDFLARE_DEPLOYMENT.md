# Cloudflare Pages 部署 Next.js + D1 项目指南

## 项目概述

本项目是一个基于 Next.js 14 的 SSR（服务端渲染）项目，使用 Cloudflare D1 数据库存储数据。

**技术栈**：
- Next.js 14 (Pages Router)
- React 18
- Cloudflare Pages
- Cloudflare D1 数据库
- Cloudflare Functions

**架构**：
```
浏览器 → Cloudflare Pages → Next.js Server → Next.js API Routes → Cloudflare Functions → D1 数据库
                    ↓
              getServerSideProps()
                    ↓
              生成 HTML (包含数据)
                    ↓
              返回给浏览器
```

---

## 前置条件

### 1. Cloudflare 账号
- 注册 [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
- 免费即可

### 2. GitHub 仓库
- 注册 [GitHub 账号](https://github.com/signup)
- 创建仓库存放项目代码

### 3. D1 数据库
- 确认 D1 数据库已创建
- 记录 `database_id`

---

## 部署步骤（推荐方案：Git 集成）

### 步骤 1：准备代码仓库

#### 1.1 初始化 Git（如果还没有）

```bash
# 在项目根目录
cd F:\TraeCN\111\test

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Next.js SSR project with D1"
```

#### 1.2 推送到 GitHub

1. **在 GitHub 创建新仓库**：
   - 访问 https://github.com/new
   - 仓库名：`d1-demo-nextjs`（或其他名称）
   - 选择 Public 或 Private
   - 点击 Create repository

2. **推送代码**：
   ```bash
   # 添加远程仓库
   git remote add origin https://github.com/your-username/d1-demo-nextjs.git
   
   # 重命名主分支为 main
   git branch -M main
   
   # 推送代码
   git push -u origin main
   ```

---

### 步骤 2：检查项目配置

#### 2.1 wrangler.toml

确保文件内容如下：

```toml
name = "d1-demo-react"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "d1-demo-db"
database_id = "75298027-fc93-43f4-b00d-a0070794ce95"

[env.production]
nodejs_compat = true
[[env.production.d1_databases]]
binding = "DB"
database_name = "d1-demo-db"
database_id = "75298027-fc93-43f4-b00d-a0070794ce95"

[env.preview]
nodejs_compat = true
[[env.preview.d1_databases]]
binding = "DB"
database_name = "d1-demo-db-preview"
database_id = "75298027-fc93-43f4-b00d-a0070794ce95"
```

**关键点**：
- ✅ `compatibility_flags = ["nodejs_compat"]` - 启用 Node.js 兼容性
- ✅ `binding = "DB"` - 数据库绑定名称
- ✅ `[env.production]` 和 `[env.preview]` 下的 `nodejs_compat = true`

#### 2.2 next.config.js

保持当前配置即可：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = nextConfig
```

**注意**：不要添加 `output: 'export'`，这是 SSR 项目。

#### 2.3 package.json

确保脚本正确：

```json
{
  "name": "d1-demo-nextjs",
  "version": "1.0.0",
  "description": "Cloudflare Pages + D1 留言板 - Next.js SSR 版本",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

### 步骤 3：在 Cloudflare 创建 Pages 项目

#### 3.1 登录 Cloudflare

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 登录您的账号

#### 3.2 创建 Pages 项目

1. **进入 Workers & Pages**：
   - 在左侧菜单找到 **Workers & Pages**
   - 点击进入

2. **创建应用**：
   - 点击 **Create application**
   - 选择 **Pages** 标签
   - 点击 **Connect to Git**

#### 3.3 连接 GitHub 仓库

1. **选择 GitHub**：
   - 点击 **GitHub** 图标
   - 如果是第一次，需要授权 Cloudflare 访问您的 GitHub

2. **选择仓库**：
   - 在列表中找到您的仓库（`d1-demo-nextjs`）
   - 点击 **Begin setup**

#### 3.4 配置构建设置

在配置页面填写以下信息：

**基本设置**：
- **Project name**: `d1-demo-nextjs`（或您喜欢的名称）
- **Production branch**: `main`
- **Framework preset**: 选择 `Next.js`

**构建设置**：
- **Build command**: `npm run build`
- **Build output directory**: `.next`

**环境变量**（可选）：
- 如果需要其他环境变量，在这里添加

**点击 Save and Deploy**

---

### 步骤 4：等待首次部署

1. **部署过程**：
   - Cloudflare 会自动克隆您的仓库
   - 运行 `npm install`
   - 运行 `npm run build`
   - 部署到全球 CDN

2. **等待时间**：
   - 通常 1-3 分钟
   - 可以在部署页面查看进度

3. **部署完成**：
   - 会显示绿色的 ✓
   - 提供访问 URL，如：`https://d1-demo-nextjs.pages.dev`

---

### 步骤 5：绑定 D1 数据库

#### 5.1 进入项目设置

1. 在 Cloudflare Dashboard 中进入您的 Pages 项目
2. 点击 **Settings** 标签
3. 找到 **Functions** 部分

#### 5.2 添加 D1 绑定

1. **找到 D1 database bindings**：
   - 点击 **Add binding**

2. **配置绑定**：
   - **Variable name**: `DB`（必须与 `wrangler.toml` 中的 `binding` 一致）
   - **D1 database**: 从下拉列表选择 `d1-demo-db`

3. **保存**

#### 5.3 验证绑定

1. 返回 Functions 设置页面
2. 确认看到：
   ```
   DB → d1-demo-db
   ```

---

### 步骤 6：验证部署

#### 6.1 访问网站

1. 点击 Cloudflare 提供的 URL
2. 应该看到留言板页面

#### 6.2 测试功能

**测试读取**：
- 查看留言列表是否正常显示

**测试写入**：
- 提交新留言
- 刷新页面验证留言已添加

#### 6.3 查看日志（如果有问题）

1. 进入 **Workers & Pages**
2. 选择您的 Pages 项目
3. 点击 **Functions** → **Logs**
4. 查看实时日志

---

## 项目结构说明

### 目录结构

```
项目根目录/
├── pages/                    # Next.js 页面路由
│   ├── _document.js         # HTML 文档结构
│   ├── index.js            # 首页（SSR）
│   └── api/               # Next.js API Routes
│       └── messages.js      # API 代理层
├── components/              # React 组件
│   ├── MessageForm.js       # 留言表单
│   ├── MessageList.js       # 留言列表
│   └── DeploymentInfo.js   # 部署信息
├── functions/              # Cloudflare Functions
│   └── api/
│       └── messages/
│           └── [[path]].js   # D1 数据库操作
├── styles/                 # 样式文件
│   └── globals.css        # 全局样式
├── public/                 # 静态资源
├── package.json
├── next.config.js
├── wrangler.toml           # Cloudflare 配置
└── schema.sql             # 数据库表结构
```

### 数据流

**读取留言**：
```
浏览器 → / (index.js)
       ↓
  getServerSideProps()
       ↓
  fetch('/api/messages')
       ↓
  Next.js API Routes (pages/api/messages.js)
       ↓
  fetch('/api/messages') [转发]
       ↓
  Cloudflare Functions (functions/api/messages/[[path]].js)
       ↓
  D1 数据库 (SELECT * FROM messages)
       ↓
  返回数据
```

**添加留言**：
```
浏览器 → 提交表单
       ↓
  fetch('/api/messages', { method: 'POST' })
       ↓
  Next.js API Routes (pages/api/messages.js)
       ↓
  fetch('/api/messages', { method: 'POST' }) [转发]
       ↓
  Cloudflare Functions (functions/api/messages/[[path]].js)
       ↓
  D1 数据库 (INSERT INTO messages)
       ↓
  返回成功
```

---

## 常见问题排查

### 问题 1：部署后页面空白

**可能原因**：
1. `getServerSideProps` 返回错误
2. API 路由失败
3. D1 绑定未配置

**解决方法**：

1. **查看 Functions 日志**：
   - 进入 Cloudflare Dashboard
   - Workers & Pages → 您的项目 → Functions → Logs
   - 查看错误信息

2. **检查 D1 绑定**：
   - 确认 Variable name 是 `DB`
   - 确认选择了正确的数据库

3. **检查 `nodejs_compat`**：
   - 确认 `wrangler.toml` 中有 `compatibility_flags = ["nodejs_compat"]`
   - 确认 `[env.production]` 下有 `nodejs_compat = true`

4. **重新部署**：
   - 在 Cloudflare Dashboard 中
   - Deployments → 找到最新部署 → Retry deployment

---

### 问题 2：API 请求失败

**可能原因**：
1. D1 绑定名称不匹配
2. 数据库 ID 错误
3. Functions 代码有错误

**解决方法**：

1. **确认绑定名称**：
   - `wrangler.toml`: `binding = "DB"`
   - Cloudflare Pages 设置: Variable name = `DB`
   - 必须完全一致

2. **检查数据库 ID**：
   - 确认 `wrangler.toml` 中的 `database_id` 正确
   - 可以在 Cloudflare Dashboard → D1 中查看

3. **查看 Functions 日志**：
   - 查看具体错误信息
   - 修复代码后重新部署

---

### 问题 3：nodejs_compat 错误

**错误信息**：
```
Node.JS Compatibility Error
no nodejs_compat compatibility flag set
```

**解决方法**：

1. **修改 wrangler.toml**：
   ```toml
   name = "d1-demo-react"
   compatibility_date = "2024-01-01"
   compatibility_flags = ["nodejs_compat"]  # 添加这一行
   
   [[d1_databases]]
   binding = "DB"
   database_name = "d1-demo-db"
   database_id = "75298027-fc93-43f4-b00d-a0070794ce95"
   
   [env.production]
   nodejs_compat = true  # 添加这一行
   [[env.production.d1_databases]]
   binding = "DB"
   database_name = "d1-demo-db"
   database_id = "75298027-fc93-43f4-b00d-a0070794ce95"
   
   [env.preview]
   nodejs_compat = true  # 添加这一行
   [[env.preview.d1_databases]]
   binding = "DB"
   database_name = "d1-demo-db-preview"
   database_id = "75298027-fc93-43f4-b00d-a0070794ce95"
   ```

2. **提交并推送**：
   ```bash
   git add wrangler.toml
   git commit -m "Add nodejs_compat flag"
   git push
   ```

3. **等待自动重新部署**

---

### 问题 4：部署失败

**可能原因**：
1. `npm install` 失败
2. `npm run build` 失败
3. 代码有语法错误

**解决方法**：

1. **本地测试构建**：
   ```bash
   npm install
   npm run build
   ```

2. **修复错误**：
   - 如果本地构建失败，修复错误后再推送

3. **查看部署日志**：
   - Cloudflare Dashboard → Deployments
   - 点击失败的部署查看详细日志

---

### 问题 5：留言提交后不显示

**可能原因**：
1. 数据库插入成功，但页面未刷新
2. 乐观更新逻辑有问题
3. API 返回成功但实际失败

**解决方法**：

1. **查看 Functions 日志**：
   - 确认 INSERT 操作是否成功

2. **检查页面逻辑**：
   - 查看 `pages/index.js` 中的 `addMessage` 函数
   - 确认数据正确更新

3. **刷新页面**：
   - 手动刷新页面验证数据

---

## 本地开发

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`

### 本地测试 D1

```bash
# 创建本地数据库
wrangler d1 create d1-demo-db-local

# 执行 SQL 文件
wrangler d1 execute d1-demo-db-local --file=./schema.sql

# 测试查询
wrangler d1 execute d1-demo-db-local --command="SELECT * FROM messages"

# 测试插入
wrangler d1 execute d1-demo-db-local --command="INSERT INTO messages (username, content) VALUES ('测试用户', '测试留言')"
```

---

## 自动部署

### Git 集成优势

**推送代码自动部署**：
```bash
# 修改代码后
git add .
git commit -m "Update message form"
git push

# Cloudflare 自动检测到推送
# 自动触发构建和部署
```

### Pull Request 预览

**创建 PR 时自动生成预览**：
1. 创建新分支：`git checkout -b feature/new-feature`
2. 提交代码并推送
3. 在 GitHub 创建 Pull Request
4. Cloudflare 自动创建预览 URL
5. 可以在合并前预览和测试

---

## 性能优化

### 1. 缓存策略

在 `pages/index.js` 的 `getServerSideProps` 中添加缓存：

```javascript
export async function getServerSideProps({ res }) {
  // 设置缓存头
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
  
  // 获取数据
  const response = await fetch('/api/messages');
  const data = await response.json();
  
  return { props: { initialMessages: data.messages || [] } };
}
```

### 2. 代码分割

动态导入大组件：

```javascript
import dynamic from 'next/dynamic';

const DeploymentInfo = dynamic(() => import('../components/DeploymentInfo'), {
  loading: () => <div>加载中...</div>,
  ssr: false
});
```

### 3. 图片优化

使用 Next.js Image 组件：

```javascript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
  loading="lazy"
/>
```

---

## 监控和日志

### 查看 Functions 日志

1. 进入 Cloudflare Dashboard
2. Workers & Pages → 您的项目
3. Functions → Logs
4. 实时查看日志

### 查看部署历史

1. Workers & Pages → 您的项目
2. Deployments
3. 查看所有部署记录
4. 可以回滚到之前的版本

### 查看分析数据

1. Workers & Pages → 您的项目
2. Analytics
3. 查看访问量、带宽、错误率等

---

## 总结

### 部署流程图

```
1. 准备代码
   ↓
2. 推送到 GitHub
   ↓
3. Cloudflare 自动构建
   ↓
4. 绑定 D1 数据库
   ↓
5. 验证部署
   ↓
6. 完成！
```

### 关键点

- ✅ 使用 Git 集成，Windows 友好
- ✅ 配置 `nodejs_compat` 标志
- ✅ 绑定 D1 数据库（Variable name = DB）
- ✅ 构建设置：Build command = `npm run build`，Output directory = `.next`
- ✅ 推送代码自动部署

### 下一步

部署成功后，您可以：
- 自定义域名
- 配置 SSL
- 添加更多功能
- 优化性能
- 监控和分析

---

## 参考资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/functions)
- [Next.js 文档](https://nextjs.org/docs)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler)
