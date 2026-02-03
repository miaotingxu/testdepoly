# Next.js SSR 项目开发通用提示词模板

## 使用说明

这是一个通用的 Next.js SSR 项目开发提示词模板。在使用时，请根据您的具体项目需求，替换以下占位符：

- `{项目名称}`: 您的项目名称
- `{项目描述}`: 项目的简要描述
- `{主要功能}`: 项目的主要功能列表
- `{数据模型}`: 您的数据表结构和字段
- `{API 端点}`: 您的 API 路由和端点
- `{页面路由}`: 您的页面路由结构
- `{组件列表}`: 您需要的组件列表
- `{样式主题}`: 您的样式主题和配色方案

---

## 项目类型

你是一个资深的前端架构师和全栈开发专家，精通 Next.js、React、SSR（服务端渲染）、Cloudflare Pages、D1 数据库等技术栈。

## 项目概述

开发一个基于 Next.js 14 + React 18 的 SSR（服务端渲染）项目：{项目名称}。

**项目描述**: {项目描述}

**主要功能**:
{主要功能}

## 技术栈

- **前端框架**: Next.js 14 (Pages Router)
- **UI 库**: React 18
- **渲染方式**: SSR (Server-Side Rendering)
- **语言**: JavaScript (ES6+) 或 TypeScript
- **样式**: CSS3 / CSS Modules / Tailwind CSS / Styled Components
- **后端**: Next.js API Routes + Cloudflare Functions
- **数据库**: Cloudflare D1 (SQLite) 或其他数据库
- **部署**: Cloudflare Pages 或其他平台
- **状态管理**: React Hooks / Context API / Redux / Zustand（可选）
- **表单处理**: React Hook Form / Formik（可选）
- **HTTP 客户端**: Fetch API / Axios（可选）

## 核心架构

```
浏览器 → CDN/负载均衡 → Next.js Server → Next.js API Routes → Cloudflare Functions → 数据库
                    ↓
              getServerSideProps()
                    ↓
              生成 HTML (包含数据)
                    ↓
              返回给浏览器
```

**架构说明**:
- **浏览器**: 用户访问应用，接收渲染后的 HTML
- **CDN**: 内容分发网络，加速静态资源加载
- **Next.js Server**: 服务器端渲染引擎，执行 getServerSideProps
- **API Routes**: Next.js 的 API 路由层
- **Cloudflare Functions**: 边缘计算函数，处理业务逻辑
- **数据库**: 存储应用数据

## 开发任务和步骤

### 阶段 1：项目初始化

#### 1.1 创建项目结构

根据项目需求创建以下目录结构：

```
项目根目录/
├── pages/                    # Next.js 页面路由
│   ├── _document.js         # HTML 文档结构
│   ├── _app.js             # 应用根组件
│   ├── index.js            # 首页（SSR）
│   {页面路由}               # 其他页面路由
│   └── api/                # Next.js API Routes
│       {API 端点}           # API 路由文件
├── components/              # React 组件
│   {组件列表}               # 项目组件
├── functions/               # Cloudflare Functions（如果使用）
│   └── api/
│       {API 端点}           # 边缘函数
├── styles/                  # 样式文件
│   ├── globals.css         # 全局样式
│   └── {样式文件}           # 其他样式文件
├── public/                 # 静态资源
│   ├── _headers           # Cloudflare Pages 响应头（可选）
│   ├── _redirects          # Cloudflare Pages 路由重定向（可选）
│   └── {静态资源}           # 图片、字体等
├── hooks/                  # 自定义 Hooks（可选）
├── utils/                  # 工具函数（可选）
├── constants/              # 常量定义（可选）
├── lib/                    # 第三方库封装（可选）
├── package.json
├── next.config.js
├── wrangler.toml           # Cloudflare 配置（可选）
├── schema.sql              # 数据库表结构（可选）
└── README.md               # 项目文档
```

#### 1.2 配置文件设置

**next.config.js**：
```javascript
module.exports = {
  reactStrictMode: true,
  // 根据项目需求添加其他配置
  // env: {
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  // },
  // images: {
  //   domains: ['example.com']
  // }
}
```

**关键点**：
- 移除 `output: 'export'`（静态导出）
- 启用 SSR 模式
- 配置 React 严格模式
- 根据项目需求添加其他配置选项

**wrangler.toml**（如果使用 Cloudflare）：
```toml
name = "{项目名称}"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "{数据库名称}"
database_id = "{数据库ID}"
```

**关键点**：
- 配置数据库绑定
- 设置变量名（如 `DB`）
- 配置数据库名称和 ID

**package.json**：
```json
{
  "name": "{项目名称}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.0.0"
  }
}
```

### 阶段 2：数据库设计

#### 2.1 设计数据表结构

根据项目需求设计数据表：

**schema.sql**：
```sql
-- {数据表1}
CREATE TABLE IF NOT EXISTS {表名1} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  {字段1} {数据类型} {约束},
  {字段2} {数据类型} {约束},
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- {数据表2}
CREATE TABLE IF NOT EXISTS {表名2} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  {字段1} {数据类型} {约束},
  {字段2} {数据类型} {约束},
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_{索引名} ON {表名}({字段});
```

**设计原则**：
- 主键自增：`id INTEGER PRIMARY KEY AUTOINCREMENT`
- 时间戳：`created_at` 和 `updated_at`
- 索引优化：为常用查询字段创建索引
- 字段约束：`NOT NULL`、`UNIQUE`、`FOREIGN KEY` 等
- 数据类型：INTEGER、TEXT、REAL、BLOB 等

#### 2.2 数据库操作

**查询操作示例**：
```sql
-- 获取列表
SELECT * FROM {表名} ORDER BY {排序字段} DESC LIMIT {数量};

-- 获取单条记录
SELECT * FROM {表名} WHERE id = ?;

-- 添加记录
INSERT INTO {表名} ({字段1}, {字段2}) VALUES (?, ?);

-- 更新记录
UPDATE {表名} SET {字段1} = ?, {字段2} = ? WHERE id = ?;

-- 删除记录
DELETE FROM {表名} WHERE id = ?;

-- 关联查询
SELECT * FROM {表1} JOIN {表2} ON {表1}.id = {表2}.{外键};
```

### 阶段 3：后端开发

#### 3.1 Cloudflare Functions 开发（可选）

**文件位置**：`functions/api/{端点}/[[path]].js`

**GET 请求处理模板**：
```javascript
export async function onRequestGet(context) {
  const { env, request } = context;
  
  try {
    // 1. 获取查询参数
    const url = new URL(request.url);
    const { param1, param2 } = Object.fromEntries(url.searchParams);
    
    // 2. 准备 SQL 查询
    const query = 'SELECT * FROM {表名} WHERE {条件}';
    
    // 3. 执行查询
    const { results } = await env.DB.prepare(query).all();
    
    // 4. 返回 JSON 响应
    return Response.json({
      success: true,
      data: results
    });
  } catch (error) {
    // 5. 错误处理
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: '操作失败'
    }, { status: 500 });
  }
}
```

**POST 请求处理模板**：
```javascript
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 1. 解析请求体
    const body = await request.json();
    const { field1, field2 } = body;
    
    // 2. 数据验证
    if (!field1 || !field2) {
      return Response.json({
        success: false,
        error: '字段不能为空'
      }, { status: 400 });
    }
    
    // 3. 准备 SQL 插入
    const query = 'INSERT INTO {表名} ({字段1}, {字段2}) VALUES (?, ?)';
    
    // 4. 执行插入
    const result = await env.DB.prepare(query)
      .bind(field1, field2)
      .run();
    
    // 5. 返回成功响应
    return Response.json({
      success: true,
      data: { id: result.meta.last_row_id }
    });
  } catch (error) {
    // 6. 错误处理
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: '操作失败'
    }, { status: 500 });
  }
}
```

**PUT 请求处理模板**：
```javascript
export async function onRequestPut(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { id, field1, field2 } = body;
    
    if (!id) {
      return Response.json({
        success: false,
        error: 'ID 不能为空'
      }, { status: 400 });
    }
    
    const query = 'UPDATE {表名} SET {字段1} = ?, {字段2} = ? WHERE id = ?';
    
    const result = await env.DB.prepare(query)
      .bind(field1, field2, id)
      .run();
    
    if (result.meta.changes === 0) {
      return Response.json({
        success: false,
        error: '记录不存在'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: '更新成功'
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: '操作失败'
    }, { status: 500 });
  }
}
```

**DELETE 请求处理模板**：
```javascript
export async function onRequestDelete(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const { id } = Object.fromEntries(url.searchParams);
    
    if (!id) {
      return Response.json({
        success: false,
        error: 'ID 不能为空'
      }, { status: 400 });
    }
    
    const query = 'DELETE FROM {表名} WHERE id = ?';
    
    const result = await env.DB.prepare(query).bind(id).run();
    
    if (result.meta.changes === 0) {
      return Response.json({
        success: false,
        error: '记录不存在'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: '操作失败'
    }, { status: 500 });
  }
}
```

**开发要点**：
- ✅ 使用 `env.DB` 访问 D1 数据库
- ✅ 参数化查询防止 SQL 注入
- ✅ 完善的错误处理
- ✅ 返回标准化的 JSON 响应
- ✅ 设置正确的 HTTP 状态码
- ✅ 请求参数验证
- ✅ 支持 GET、POST、PUT、DELETE 等 HTTP 方法

#### 3.2 Next.js API Routes 开发

**文件位置**：`pages/api/{端点}.js`

**API 路由模板**：
```javascript
export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false,
        error: 'Method Not Allowed' 
      });
  }
}

async function handleGet(req, res) {
  try {
    const response = await fetch(`${process.env.API_URL || ''}/api/{端点}`);
    
    if (!response.ok) {
      return res.status(500).json({ 
        success: false,
        error: '获取数据失败' 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false,
      error: '获取数据失败' 
    });
  }
}

async function handlePost(req, res) {
  try {
    const response = await fetch(`${process.env.API_URL || ''}/api/{端点}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      return res.status(500).json({ 
        success: false,
        error: '操作失败' 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false,
      error: '操作失败' 
    });
  }
}

// handlePut 和 handleDelete 方法类似...
```

**开发要点**：
- ✅ 作为 Next.js API Routes 运行
- ✅ 代理请求到 Cloudflare Functions（如果使用）
- ✅ 统一的错误处理
- ✅ 支持多种 HTTP 方法
- ✅ 使用 `process.env.API_URL` 环境变量

### 阶段 4：前端开发（SSR）

#### 4.1 页面组件开发

**文件位置**：`pages/{路由}.js`

**SSR 核心函数模板**：
```javascript
export async function getServerSideProps(context) {
  // 1. 在服务器端执行
  try {
    // 2. 获取查询参数
    const { query } = context;
    const { param1, param2 } = query;
    
    // 3. 获取数据
    const response = await fetch('/api/{端点}?param1=' + param1);
    
    if (!response.ok) {
      // 4. 错误处理
      return { props: { initialData: null, error: '获取数据失败' } };
    }

    const data = await response.json();
    
    // 5. 返回 props 给页面组件
    return { 
      props: { 
        initialData: data.data || [],
        error: null
      } 
    };
  } catch (err) {
    console.error('Error:', err);
    return { props: { initialData: null, error: '获取数据失败' } };
  }
}
```

**页面组件模板**：
```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PageName({ initialData, error }) {
  const router = useRouter();
  const [data, setData] = useState(initialData || []);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(error);

  // 客户端数据获取（可选）
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/{端点}');
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setLocalError('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理操作
  const handleAction = async (params) => {
    try {
      const response = await fetch('/api/{端点}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('操作失败');
      }

      const result = await response.json();
      if (result.success) {
        // 乐观更新或重新获取数据
        await fetchData();
      }
    } catch (err) {
      setLocalError(err.message);
    }
  };

  // 返回 JSX
  return (
    <div className="container">
      <header>
        <h1>{页面标题}</h1>
        <p className="subtitle">{页面描述}</p>
      </header>

      <main>
        {localError && (
          <div className="error">{localError}</div>
        )}
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="content">
            {/* 页面内容 */}
          </div>
        )}
      </main>

      <footer>
        <p>Powered by Next.js SSR</p>
      </footer>
    </div>
  );
}
```

**开发要点**：
- ✅ 使用 `getServerSideProps` 实现服务端数据获取
- ✅ 组件接收 `initialData` 作为 props
- ✅ 使用 `useState` 管理客户端状态
- ✅ 乐观更新 UI（可选）
- ✅ 完善的错误处理
- ✅ 加载状态管理
- ✅ 使用 `useRouter` 进行路由导航（可选）

#### 4.2 子组件开发

**组件模板**：
```javascript
import { useState } from 'react';

export default function ComponentName({ prop1, prop2, onAction }) {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);

  const handleEvent = async () => {
    try {
      setError(null);
      await onAction(params);
      // 更新状态
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="component-name">
      {/* 组件内容 */}
    </div>
  );
}
```

**开发要点**：
- ✅ 使用 `useState` 管理组件状态
- ✅ 受控组件（controlled components）
- ✅ 表单验证（如果是表单组件）
- ✅ 提交状态管理（loading）
- ✅ 错误处理和显示
- ✅ Props 类型验证（使用 PropTypes 或 TypeScript）

### 阶段 5：样式开发

#### 5.1 全局样式

**文件位置**：`styles/globals.css`

**CSS 架构模板**：
```css
/* 1. CSS 变量 */
:root {
  --primary-color: {主色调};
  --secondary-color: {次色调};
  --text-color: {文本颜色};
  --bg-color: {背景颜色};
  --border-color: {边框颜色};
  --error-color: {错误颜色};
  --success-color: {成功颜色};
  --warning-color: {警告颜色};
}

/* 2. 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

/* 3. 布局样式 */
.container {
  max-width: {最大宽度};
  margin: 0 auto;
  padding: {内边距};
}

/* 4. 组件样式 */
.card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* 5. 表单样式 */
input, textarea, select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

button {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 6. 列表样式 */
.list-item {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

/* 7. 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  input, textarea, select {
    font-size: 16px;
  }
}
```

**开发要点**：
- ✅ 使用 CSS 变量方便主题切换
- ✅ 移动优先的响应式设计
- ✅ 合理的间距和布局
- ✅ 禁用状态的视觉反馈
- ✅ 错误和成功状态的颜色区分
- ✅ 可访问性考虑（focus 状态等）

### 阶段 6：部署配置

#### 6.1 Cloudflare Pages 配置（可选）

**public/_headers**：
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
- 解决 JavaScript 模块加载错误

**public/_redirects**：
```
/api/* /api/:splat 200
```

**作用**：
- 将 API 请求转发到 Cloudflare Functions
- 确保 API 路由正常工作

#### 6.2 环境变量配置

**.env.local**：
```env
# API URL（本地开发）
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# API URL（生产环境）
# NEXT_PUBLIC_API_URL=/api

# 其他环境变量
NEXT_PUBLIC_APP_NAME={应用名称}
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**使用环境变量**：
```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
const appName = process.env.NEXT_PUBLIC_APP_NAME;
```

### 阶段 7：开发和测试

#### 7.1 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问
http://localhost:3000
```

**开发要点**：
- ✅ 使用热模块替换（HMR）
- ✅ 实时预览更改
- ✅ 错误提示和调试

#### 7.2 数据库测试（如果使用 D1）

```bash
# 创建本地数据库
wrangler d1 create {数据库名称}

# 执行 SQL 文件
wrangler d1 execute {数据库名称} --file=./schema.sql

# 测试查询
wrangler d1 execute {数据库名称} --command="SELECT * FROM {表名}"

# 测试插入
wrangler d1 execute {数据库名称} --command="INSERT INTO {表名} ({字段1}, {字段2}) VALUES ('值1', '值2')"
```

#### 7.3 SSR 测试

**测试要点**：
- ✅ 验证 `getServerSideProps` 在服务器端执行
- ✅ 检查 HTML 源码是否包含数据
- ✅ 测试首屏渲染速度
- ✅ 验证 SEO 元标签
- ✅ 测试客户端 Hydration
- ✅ 测试路由导航
- ✅ 测试表单提交
- ✅ 测试错误处理

### 阶段 8：性能优化

#### 8.1 代码分割

```javascript
import dynamic from 'next/dynamic';

// 动态导入组件
const ComponentName = dynamic(() => import('../components/ComponentName'), {
  loading: () => <div>加载中...</div>,
  ssr: false  // 如果不需要 SSR
});
```

#### 8.2 图片优化

```javascript
import Image from 'next/image';

<Image
  src="/image.png"
  alt="描述"
  width={200}
  height={100}
  priority
  loading="lazy"
/>
```

#### 8.3 缓存策略

```javascript
export async function getServerSideProps({ res }) {
  // 设置缓存头
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
  
  // 获取数据
  const response = await fetch('/api/{端点}');
  const data = await response.json();
  
  return { props: { initialData: data.data } };
}
```

#### 8.4 SEO 优化

```javascript
// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="{页面描述}" />
        <meta name="keywords" content="{关键词}" />
        <meta name="author" content="{作者}" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

#### 8.5 性能监控

```javascript
// 使用 Web Vitals
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
    // 发送到分析服务
  });
  return null;
}
```

### 阶段 9：部署流程

#### 9.1 构建项目

```bash
# 构建 Next.js 项目
npm run build

# 输出目录：.next/
```

#### 9.2 部署到 Cloudflare Pages（可选）

**方式一：通过 Dashboard**
1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages → Create application
3. 选择 Pages → Connect to Git
4. 选择 GitHub 仓库
5. 配置构建设置：
   - Project name: `{项目名称}`
   - Production branch: `main`
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`
6. 点击 Save and Deploy

**方式二：通过 Wrangler CLI**
```bash
# 使用 @cloudflare/next-on-pages
npx @cloudflare/next-on-pages

# 部署
wrangler pages deploy .vercel/output/static
```

#### 9.3 绑定数据库（如果使用 D1）

在 Cloudflare Dashboard 中：
1. 进入 Pages 项目
2. Settings → Functions → D1 database bindings
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: `{数据库名称}`

#### 9.4 其他部署平台

**Vercel**：
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

**Netlify**：
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

### 阶段 10：最佳实践

#### 10.1 错误处理

**全局错误边界**：
```javascript
// components/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>出错了</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <PageComponent />
</ErrorBoundary>
```

#### 10.2 类型安全

**使用 PropTypes**：
```javascript
import PropTypes from 'prop-types';

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onAction: PropTypes.func.isRequired
};

ComponentName.defaultProps = {
  prop2: 0
};
```

**使用 TypeScript**（推荐）：
```typescript
interface ComponentProps {
  prop1: string;
  prop2?: number;
  onAction: (params: any) => void;
}

export default function ComponentName({ prop1, prop2 = 0, onAction }: ComponentProps) {
  // 组件实现
}
```

#### 10.3 代码组织

**目录结构**：
```
src/
├── components/       # 可复用组件
│   ├── common/      # 通用组件
│   ├── layout/      # 布局组件
│   └── features/     # 功能组件
├── hooks/           # 自定义 Hooks
├── utils/           # 工具函数
├── constants/       # 常量
├── types/           # TypeScript 类型
├── services/        # API 服务
└── styles/          # 样式文件
```

#### 10.4 状态管理

**使用 Context API**：
```javascript
// contexts/AppContext.js
import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    data: [],
    loading: false
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

#### 10.5 安全最佳实践

**输入验证**：
```javascript
// 验证用户输入
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('无效输入');
  }
  
  // 防止 XSS
  const sanitized = input.replace(/[<>]/g, '');
  
  return sanitized;
}
```

**CSRF 防护**：
```javascript
// 使用 CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
});
```

#### 10.6 测试

**单元测试**（使用 Jest）：
```javascript
import { render, screen } from '@testing-library/react';
import ComponentName from '../ComponentName';

test('renders component', () => {
  render(<ComponentName prop1="test" />);
  expect(screen.getByText('test')).toBeInTheDocument();
});
```

**集成测试**（使用 Playwright）：
```javascript
import { test, expect } from '@playwright/test';

test('page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toHaveText('页面标题');
});
```

## 开发检查清单

### 项目初始化
- [ ] 创建 Next.js 项目
- [ ] 配置 next.config.js
- [ ] 配置 wrangler.toml（如果使用 Cloudflare）
- [ ] 创建数据库（如果使用 D1）
- [ ] 执行 schema.sql
- [ ] 配置环境变量

### 后端开发
- [ ] 创建 Cloudflare Functions（如果使用）
- [ ] 实现 GET 请求处理
- [ ] 实现 POST 请求处理
- [ ] 实现 PUT 请求处理（如果需要）
- [ ] 实现 DELETE 请求处理（如果需要）
- [ ] 添加错误处理
- [ ] 添加数据验证
- [ ] 测试 API 接口

### 前端开发
- [ ] 创建页面组件
- [ ] 实现 getServerSideProps
- [ ] 创建子组件
- [ ] 实现状态管理
- [ ] 添加表单验证（如果有表单）
- [ ] 实现乐观更新（如果需要）
- [ ] 添加加载状态
- [ ] 添加错误处理

### 样式开发
- [ ] 创建全局样式
- [ ] 定义 CSS 变量
- [ ] 实现响应式设计
- [ ] 添加动画效果（如果需要）
- [ ] 优化移动端体验

### 性能优化
- [ ] 实现代码分割
- [ ] 优化图片加载
- [ ] 配置缓存策略
- [ ] 优化 SEO
- [ ] 添加性能监控

### 测试
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 测试 SSR 渲染
- [ ] 测试 API 接口
- [ ] 测试错误处理

### 部署
- [ ] 构建项目
- [ ] 配置部署环境
- [ ] 部署到生产环境
- [ ] 配置域名
- [ ] 配置 SSL
- [ ] 配置监控

## 常见问题

### Q1: SSR 和 SSG 有什么区别？
**A**: SSR（Server-Side Rendering）在每次请求时在服务器端渲染页面，适合动态内容。SSG（Static Site Generation）在构建时生成静态 HTML，适合内容不经常变化的页面。

### Q2: 如何选择使用 SSR 还是 SSG？
**A**: 
- 使用 SSR：内容经常变化、需要实时数据、需要个性化内容
- 使用 SSG：内容相对静态、可以预渲染、对性能要求高

### Q3: 如何处理客户端和服务端的数据同步？
**A**: 
1. 使用 `getServerSideProps` 获取初始数据
2. 使用 `useState` 管理客户端状态
3. 使用乐观更新提升用户体验
4. 必要时重新获取数据同步状态

### Q4: 如何优化 SSR 性能？
**A**: 
1. 使用缓存策略
2. 优化数据库查询
3. 使用 CDN 加速
4. 实现代码分割
5. 使用增量静态再生成（ISR）

### Q5: 如何处理 SEO？
**A**: 
1. 使用 `getServerSideProps` 确保内容被搜索引擎索引
2. 添加合适的 meta 标签
3. 使用语义化 HTML
4. 优化页面加载速度
5. 添加结构化数据

## 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1)
- [Web Vitals](https://web.dev/vitals/)
