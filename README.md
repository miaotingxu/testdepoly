# Cloudflare Pages + D1 入门 Demo

这是一个使用 Cloudflare Pages 部署前端应用，配合 D1 数据库存储数据的入门示例项目。

## 项目结构

```
test/
├── index.html              # 主页面
├── style.css              # 样式文件
├── app.js                 # 前端逻辑
├── schema.sql             # D1 数据库表结构
├── wrangler.toml          # Cloudflare 配置文件
├── .gitignore             # Git 忽略文件
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

## 部署步骤

### 1. 安装 Wrangler CLI

Wrangler 是 Cloudflare 的命令行工具，用于部署和管理 Cloudflare 项目。

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器，让你登录 Cloudflare 账户并授权。

### 3. 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create d1-demo-db

# 记录输出的 database_id，后续需要用到
```

### 4. 更新 wrangler.toml

打开 `wrangler.toml` 文件，将 `your-database-id` 替换为上一步获取的 `database_id`。

```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "d1-demo-db"
database_id = "替换为你的database_id"
```

### 5. 初始化数据库表结构

```bash
# 执行 schema.sql 创建表
wrangler d1 execute d1-demo-db --file=./schema.sql
```

### 6. 创建 Cloudflare Pages 项目

有两种方式创建项目：

#### 方式一：通过 Wrangler CLI（推荐）

```bash
# 创建 Pages 项目
wrangler pages project create d1-demo --production-branch=main

# 部署项目
wrangler pages deploy .
```

#### 方式二：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** -> **Create application**
3. 选择 **Pages** -> **Upload assets**
4. 上传项目文件夹
5. 在 **Settings** -> **Functions** 中绑定 D1 数据库

### 7. 绑定 D1 数据库到 Pages Functions

```bash
# 绑定数据库
wrangler pages deployment configure --project-name=d1-demo
```

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. **Settings** -> **Functions** -> **D1 database bindings**
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: `d1-demo-db`

### 8. 测试部署

部署完成后，访问 Cloudflare 提供的 URL，你应该能看到留言板界面。

## 本地开发

如果你想本地测试，可以使用 Wrangler 的本地开发模式：

```bash
# 启动本地开发服务器
wrangler pages dev .
```

这会启动一个本地服务器，你可以访问 `http://localhost:8788` 查看效果。

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
wrangler d1 execute d1-demo-db --command="SELECT * FROM messages"
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
2. **Custom domains** -> **Set up a custom domain**

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Cloudflare Functions (JavaScript)
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages
- **工具**: Wrangler CLI

## 学习资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

## 许可证

MIT License