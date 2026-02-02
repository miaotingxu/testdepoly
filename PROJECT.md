# Cloudflare Pages + D1 留言板项目

## 项目简介

这是一个基于 Cloudflare Pages 和 D1 数据库的留言板应用，展示了如何使用现代前端技术栈构建和部署全栈 Web 应用。

### 项目特点

- 🚀 **零成本部署**：使用 Cloudflare 免费套餐，无需购买服务器
- ⚡ **全球加速**：Cloudflare CDN 全球节点，访问速度快
- 💾 **云端数据库**：D1 数据库提供持久化存储
- 📱 **响应式设计**：完美支持桌面端和移动端
- 🔧 **易于扩展**：代码结构清晰，方便添加新功能

---

## 技术架构

### 🎯 项目架构说明

这是一个**混合架构**项目，结合了静态前端和无服务器后端：

**前端部分（静态文件）**
- `index.html` - HTML 页面结构
- `style.css` - CSS 样式
- `app.js` - 前端 JavaScript 逻辑
- 这些文件不需要构建，直接由 Cloudflare Pages 托管

**后端部分（无服务器函数）**
- `functions/api/messages/[[path]].js` - Cloudflare Functions
- 运行在 Cloudflare Workers 上
- 处理 API 请求并与 D1 数据库交互

**为什么选择这种架构？**
- ✅ 前端简单：纯 HTML/CSS/JS，无需学习框架
- ✅ 后端无服务器：无需管理服务器，自动扩展
- ✅ 部署简单：Git 推送即可自动部署
- ✅ 成本低：Cloudflare 免费套餐完全够用

### 前端技术栈

- **HTML5**：语义化标签，结构清晰
- **CSS3**：现代样式，渐变背景，动画效果
- **JavaScript (ES6+)**：异步请求，DOM 操作，事件处理

### 后端技术栈

- **Cloudflare Functions**：无服务器函数，处理 API 请求
- **D1 数据库**：基于 SQLite 的云端数据库
- **Wrangler CLI**：Cloudflare 官方命令行工具

### 部署架构

```
用户浏览器
    ↓
Cloudflare CDN (全球节点)
    ↓
Cloudflare Pages (静态资源: HTML/CSS/JS)
    ↓
Cloudflare Functions (API 接口: /api/messages)
    ↓
D1 Database (数据存储)
```

**请求流程示例：**

1. 用户访问页面 → Cloudflare Pages 返回 `index.html`
2. 页面加载 → 浏览器执行 `app.js`
3. 用户提交留言 → `app.js` 发送 POST 请求到 `/api/messages`
4. 请求到达 Cloudflare Functions → 执行 `[[path]].js`
5. Functions 查询 D1 数据库 → 返回 JSON 响应
6. 前端接收响应 → 更新页面显示

---

## 功能说明

### 核心功能

1. **查看留言列表**
   - 页面加载时自动获取所有留言
   - 按时间倒序显示（最新的在最前面）
   - 显示用户名、留言内容和发布时间

2. **添加留言**
   - 用户填写用户名和留言内容
   - 表单验证（必填项检查）
   - 提交后自动刷新列表

3. **时间格式化**
   - 刚刚：1 分钟内
   - X 分钟前：1 小时内
   - X 小时前：24 小时内
   - 完整日期：超过 24 小时

### UI/UX 特性

- 🎨 紫色渐变背景
- 💳 卡片式布局
- ✨ 悬停动画效果
- 📱 移动端适配
- 🔄 加载状态提示
- ❌ 错误提示信息

---

## 项目结构

```
test/
├── index.html              # 主页面（HTML 结构）
├── style.css              # 样式文件（CSS 样式）
├── app.js                 # 前端逻辑（JavaScript）
├── schema.sql             # 数据库表结构定义
├── wrangler.toml          # Cloudflare 配置文件
├── .gitignore             # Git 忽略文件配置
├── deploy.bat             # Windows 部署脚本
├── deploy.sh              # Linux/Mac 部署脚本
├── README.md              # 项目说明文档
├── PROJECT.md             # 详细项目文档（本文件）
└── functions/
    └── api/
        └── messages/
            └── [[path]].js # Cloudflare Functions API 接口
```

### 文件说明

#### index.html
- 定义页面结构
- 包含表单和留言列表容器
- 引入 CSS 和 JavaScript 文件

#### style.css
- 定义页面样式
- 实现响应式布局
- 添加动画效果

#### app.js
- 处理前端逻辑
- 发送 API 请求
- 更新页面内容

#### schema.sql
- 定义数据库表结构
- 创建索引优化查询

#### wrangler.toml
- Cloudflare 项目配置
- D1 数据库绑定配置

#### functions/api/messages/[[path]].js
- 处理 API 请求
- 与 D1 数据库交互
- 返回 JSON 响应

---

## 部署指南

### 前置要求

- Node.js (v16 或更高版本)
- npm 或 yarn
- Git
- Cloudflare 账户（免费）
- GitHub 账户（免费）

### 完整部署步骤

#### 1. 克隆或下载项目

```bash
# 如果使用 Git
git clone https://github.com/miaotingxu/testdepoly.git
cd test

# 或者直接下载 ZIP 文件并解压
```

#### 2. 安装依赖

```bash
# 安装 Wrangler CLI
npm install -g wrangler
```

#### 3. 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器，让你登录 Cloudflare 账户并授权。

#### 4. 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create d1-demo-db
```

**重要**：记下输出的 `database_id`，类似这样：

```
database_id = "75298027-fc93-43f4-b00d-a0070794ce95"
```

#### 5. 更新配置文件

打开 `wrangler.toml` 文件，将 `database_id` 替换为你的实际 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "d1-demo-db"
database_id = "75298027-fc93-43f4-b00d-a0070794ce95"
```

#### 6. 初始化数据库表

```bash
# 执行 schema.sql 创建表
wrangler d1 execute d1-demo-db --remote --file=./schema.sql
```

#### 7. 推送到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 8. 在 Cloudflare Pages 部署

**方式一：通过 Cloudflare Dashboard（推荐）**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** -> **Create application**
3. 选择 **Pages** -> **Connect to Git**
4. 授权 Cloudflare 访问你的 GitHub
5. 选择你的仓库
6. 配置构建设置：
   - **Project name**: `d1-demo`
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: 留空

**💡 为什么选择 "Framework preset: None"？**

这个项目是**混合架构**：
- **前端部分**（HTML/CSS/JS）：静态文件，不需要构建工具
- **后端部分**（Functions）：Cloudflare Pages 会自动识别 `functions/` 目录并部署为无服务器 API

选择 "None" 是因为：
1. 前端没有使用 React、Vue 等框架，不需要编译
2. 没有 Webpack、Vite 等构建工具
3. Functions 会被 Cloudflare Pages 自动部署，无需额外配置

7. 点击 **Save and Deploy**

**方式二：使用 Wrangler CLI**

```bash
# 创建 Pages 项目
wrangler pages project create d1-demo --production-branch=main

# 部署项目
wrangler pages deploy .
```

#### 9. 绑定 D1 数据库

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 点击 **Settings** -> **Functions**
3. 找到 **D1 database bindings** 部分
4. 点击 **Add binding**
5. 填写：
   - **Variable name**: `DB`
   - **D1 database**: `d1-demo-db`
6. 点击 **Save**

#### 10. 重新部署

1. 点击 **Deployments** 标签
2. 找到最新的部署记录
3. 点击 **⋮** -> **Retry deployment**

#### 11. 测试应用

访问你的 Pages URL，例如：

```
https://d1-demo.pages.dev
```

你应该能看到留言板界面，尝试添加几条留言测试功能。

---

## 开发指南

### 本地开发

#### 启动本地开发服务器

```bash
wrangler pages dev .
```

访问 `http://localhost:8788` 查看效果。

#### 本地数据库开发

```bash
# 查询本地数据库
wrangler d1 execute d1-demo-db --command="SELECT * FROM messages"

# 执行 SQL 文件
wrangler d1 execute d1-demo-db --file=./schema.sql
```

### 代码结构说明

#### 前端代码 (app.js)

```javascript
// API 基础路径
const API_BASE = '/api/messages';

// 获取留言列表
async function fetchMessages() {
    const response = await fetch(API_BASE);
    const data = await response.json();
    displayMessages(data.messages);
}

// 添加留言
async function addMessage(username, content) {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content })
    });
    return await response.json();
}

// 显示留言
function displayMessages(messages) {
    // 渲染留言列表
}

// 表单提交事件
document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // 处理表单提交
});
```

#### 后端代码 (functions/api/messages/[[path]].js)

```javascript
// GET 请求：获取留言列表
export async function onRequestGet(context) {
    const { env } = context;
    const { results } = await env.DB.prepare(
        'SELECT * FROM messages ORDER BY created_at DESC LIMIT 100'
    ).all();
    
    return Response.json({ success: true, messages: results });
}

// POST 请求：添加留言
export async function onRequestPost(context) {
    const { request, env } = context;
    const { username, content } = await request.json();
    
    const result = await env.DB.prepare(
        'INSERT INTO messages (username, content) VALUES (?, ?)'
    ).bind(username, content).run();
    
    return Response.json({ success: true, message: '留言添加成功' });
}
```

### 扩展功能建议

1. **删除留言功能**
   - 添加删除按钮
   - 创建 DELETE API 接口
   - 更新数据库 schema（添加删除标记）

2. **编辑留言功能**
   - 添加编辑按钮
   - 创建 PUT/PATCH API 接口
   - 实现编辑表单

3. **用户认证**
   - 添加登录/注册功能
   - 使用 Cloudflare Workers KV 存储会话
   - 实现权限控制

4. **分页功能**
   - 实现分页查询
   - 添加"加载更多"按钮
   - 优化大数据量性能

5. **搜索功能**
   - 添加搜索框
   - 实现模糊查询
   - 添加搜索高亮

---

## API 文档

### 基础信息

- **Base URL**: `/api/messages`
- **Content-Type**: `application/json`

### 接口列表

#### 1. 获取留言列表

**请求**

```
GET /api/messages
```

**响应**

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

**错误响应**

```json
{
  "success": false,
  "error": "获取留言失败"
}
```

#### 2. 添加留言

**请求**

```
POST /api/messages
Content-Type: application/json

{
  "username": "张三",
  "content": "这是一条测试留言"
}
```

**响应**

```json
{
  "success": true,
  "message": "留言添加成功"
}
```

**错误响应**

```json
{
  "success": false,
  "error": "用户名和内容不能为空"
}
```

---

## 常见问题

### Q1: 部署后留言功能不工作？

**A**: 检查以下几点：

1. 确认 D1 数据库已正确绑定
2. 检查 `wrangler.toml` 中的 `database_id` 是否正确
3. 查看浏览器控制台是否有错误信息
4. 查看 Cloudflare Pages 的部署日志

### Q2: 如何查看数据库中的数据？

**A**: 使用 Wrangler CLI：

```bash
# 查询所有留言
wrangler d1 execute d1-demo-db --remote --command="SELECT * FROM messages"

# 查询特定留言
wrangler d1 execute d1-demo-db --remote --command="SELECT * FROM messages WHERE id = 1"

# 统计留言数量
wrangler d1 execute d1-demo-db --remote --command="SELECT COUNT(*) FROM messages"
```

### Q3: 如何重置数据库？

**A**: 删除并重新创建数据库：

```bash
# 删除数据库
wrangler d1 delete d1-demo-db

# 重新创建
wrangler d1 create d1-demo-db

# 更新 wrangler.toml 中的 database_id

# 重新初始化表结构
wrangler d1 execute d1-demo-db --remote --file=./schema.sql
```

### Q4: 如何自定义域名？

**A**: 在 Cloudflare Dashboard 中：

1. 进入你的 Pages 项目
2. 点击 **Custom domains** -> **Set up a custom domain**
3. 输入你的域名（例如：`example.com`）
4. 按照提示配置 DNS 记录

### Q5: 如何查看部署日志？

**A**: 在 Cloudflare Dashboard 中：

1. 进入你的 Pages 项目
2. 点击 **Deployments** 标签
3. 选择一个部署记录
4. 点击 **Logs** 查看日志

### Q6: 免费套餐的限制是什么？

**A**: Cloudflare 免费套餐限制：

- **Pages**: 每月 500 次构建
- **D1**: 每天 5,000,000 次读取，100,000 次写入
- **Functions**: 每天 100,000 次请求
- **带宽**: 无限制

对于个人学习和小型项目，这些限制完全够用。

### Q7: 如何更新代码？

**A**: 更新代码的流程：

```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "描述你的更改"
git push

# 3. Cloudflare Pages 会自动检测到推送并重新部署
# 或者手动触发重新部署
```

---

## 学习资源

### 官方文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

### 教程和示例

- [Cloudflare Pages 入门教程](https://developers.cloudflare.com/pages/get-started/)
- [D1 数据库快速开始](https://developers.cloudflare.com/d1/get-started/)
- [Cloudflare Functions 示例](https://developers.cloudflare.com/pages/functions/examples/)

### 社区资源

- [Cloudflare 社区论坛](https://community.cloudflare.com/)
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [GitHub - Cloudflare Workers 示例](https://github.com/cloudflare/workers-sdk/tree/main/templates)

---

## 技术支持

如果你在使用过程中遇到问题，可以通过以下方式寻求帮助：

1. 查看 [常见问题](#常见问题) 部分
2. 搜索 [Cloudflare 社区论坛](https://community.cloudflare.com/)
3. 查看 [GitHub Issues](https://github.com/cloudflare/workers-sdk/issues)
4. 在 [Cloudflare Discord](https://discord.gg/cloudflaredev) 提问

---

## 许可证

MIT License

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 作者

Created with ❤️ for learning Cloudflare Pages and D1

---

**最后更新**: 2024-02-02