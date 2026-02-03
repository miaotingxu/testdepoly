export default function DeploymentInfo() {
  const deploymentInfo = {
    project: {
      name: 'd1-demo-nextjs',
      version: '1.0.0',
      framework: 'Next.js 14 + React 18',
      description: 'Cloudflare Pages + D1 留言板 - SSR 版本'
    },
    build: {
      command: 'npm run build',
      outputDir: 'out',
      frameworkPreset: 'Next.js'
    },
    deployment: {
      platform: 'Cloudflare Pages',
      database: 'D1 (d1-demo-db)',
      binding: 'DB'
    },
    steps: [
      {
        title: '1. 安装依赖',
        command: 'npm install',
        description: '安装 Next.js、React 等依赖包'
      },
      {
        title: '2. 本地开发',
        command: 'npm run dev',
        description: '启动开发服务器，访问 http://localhost:3000'
      },
      {
        title: '3. 推送到 GitHub',
        command: 'git add . && git commit -m "xxx" && git push',
        description: '推送代码到 GitHub 仓库'
      },
      {
        title: '4. Cloudflare 自动构建',
        command: '自动执行 npm run build',
        description: 'Cloudflare Pages 自动检测推送并构建项目'
      },
      {
        title: '5. 绑定 D1 数据库',
        command: 'Settings -> Functions -> D1 database bindings',
        description: '在 Cloudflare Dashboard 中绑定 D1 数据库'
      }
    ],
    api: {
      endpoint: '/api/messages',
      methods: ['GET', 'POST'],
      location: 'pages/api/messages.js'
    }
  }

  return (
    <div className="deployment-info">
      <h2>📦 项目部署信息</h2>
      
      <div className="info-section">
        <h3>🎯 项目信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">项目名称:</span>
            <span className="value">{deploymentInfo.project.name}</span>
          </div>
          <div className="info-item">
            <span className="label">版本:</span>
            <span className="value">{deploymentInfo.project.version}</span>
          </div>
          <div className="info-item">
            <span className="label">框架:</span>
            <span className="value">{deploymentInfo.project.framework}</span>
          </div>
          <div className="info-item">
            <span className="label">描述:</span>
            <span className="value">{deploymentInfo.project.description}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>🔨 构建配置</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">构建命令:</span>
            <code className="value">{deploymentInfo.build.command}</code>
          </div>
          <div className="info-item">
            <span className="label">输出目录:</span>
            <code className="value">{deploymentInfo.build.outputDir}</code>
          </div>
          <div className="info-item">
            <span className="label">框架预设:</span>
            <code className="value">{deploymentInfo.build.frameworkPreset}</code>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>🚀 部署配置</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">部署平台:</span>
            <span className="value">{deploymentInfo.deployment.platform}</span>
          </div>
          <div className="info-item">
            <span className="label">数据库:</span>
            <span className="value">{deploymentInfo.deployment.database}</span>
          </div>
          <div className="info-item">
            <span className="label">绑定变量:</span>
            <code className="value">{deploymentInfo.deployment.binding}</code>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>📋 部署步骤</h3>
        <div className="steps-list">
          {deploymentInfo.steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-title">{step.title}</div>
              <div className="step-command">
                <code>{step.command}</code>
              </div>
              <div className="step-description">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h3>🔌 API 接口</h3>
        <div className="api-info">
          <div className="api-item">
            <span className="label">接口地址:</span>
            <code className="value">{deploymentInfo.api.endpoint}</code>
          </div>
          <div className="api-item">
            <span className="label">支持方法:</span>
            <span className="value">{deploymentInfo.api.methods.join(', ')}</span>
          </div>
          <div className="api-item">
            <span className="label">文件位置:</span>
            <code className="value">{deploymentInfo.api.location}</code>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 工作流程</h3>
        <div className="workflow">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">本地开发 (npm run dev)</div>
          </div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">推送代码 (git push)</div>
          </div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">Cloudflare 自动构建</div>
          </div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step">
            <div className="step-number">4</div>
            <div className="step-content">自动部署上线</div>
          </div>
        </div>
      </div>
    </div>
  )
}
