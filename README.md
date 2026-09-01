# 塑胶注塑模具工厂 · 自动获客独立站

面向欧美采购商/产品经理/工程师的 B2B 模具工厂官网，内置 AI 客服、RFQ 自动收集、客户价值评分、邮件提醒与轻量 CRM。

技术栈：Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + PostgreSQL (Prisma 7) + OpenAI API + Nodemailer。

## 功能总览

| 模块 | 说明 | 位置 |
|---|---|---|
| 官网 & SEO | 能力页/行业页/工艺页/案例/博客，全站静态预渲染 | `app/` |
| 询价表单 | 3 步 RFQ，Zod 校验，自动入库 | `/quote` + `app/api/quote` |
| AI 客服 | OpenAI + RAG 知识库，可自动创建 RFQ | 右下角浮窗 + `app/api/chat` |
| 需求解析 | AI 从聊天/邮件提取结构化 RFQ 字段 | `lib/prompts.ts` `@@RFQ@@` 协议 |
| Lead 评分 | 公司画像 + 需求质量 + 互动 + 时效 四维评分 | `lib/scoring.ts` |
| 报价引擎 | 参数化快速估价（腔数/钢料/复杂度/材料） | `lib/quote-engine.ts` |
| 邮件通知 | 销售团队 RFQ 提醒 + 客户回执（含打开追踪像素） | `lib/email.ts` + `app/api/webhooks/email-open` |
| 实时通知 | 新询价即时推送 Slack / 企业微信机器人 | `lib/notify.ts` |
| CRM 后台 | 登录保护，RFQ 列表/详情/评分/状态/生成报价/邮件打开记录 | `/crm` |
| 内容管理后台 | 免改代码编辑能力页/行业页/案例/博客 + AI 知识库 | `/admin` |

## 快速开始

```bash
npm install

# 1. 配置环境变量
cp .env.example .env
# 编辑 .env：DATABASE_URL / OPENAI_API_KEY / SMTP_* / CRM_PASSWORD

# 2. 按 schema 建表（需要本机或远程 PostgreSQL；在 website/ 和 admin/ 目录各执行一次）
cd website && npx prisma db push && cd ../admin && npx prisma db push && cd ..

# 3. 灌入知识库 + SEO 关键词（有 OPENAI_API_KEY 时自动生成向量）
npm run seed

# 4. 启动开发
npm run dev
```

访问 http://localhost:3000

## 常用命令

```bash
npm run dev          # 开发
npm run build        # 生产构建（校验类型）
npm run start        # 生产运行
npm run lint         # ESLint
npm run seed         # 知识库 + 关键词入库
npx prisma generate  # 重新生成 Prisma Client
npx prisma db push   # 按 schema 建表/同步表结构（本项目无迁移文件）
```

## 环境变量

| 变量 | 说明 |
|---|---|
| `DATABASE_URL` | PostgreSQL 连接串 |
| `OPENAI_API_KEY` | OpenAI 密钥（AI 客服/解析/向量） |
| `OPENAI_MODEL` | 默认 `gpt-4o-mini` |
| `SMTP_HOST/PORT/SECURE/USER/PASS` | 邮件发送配置 |
| `CRM_PASSWORD` | `/crm` 后台登录密码 |
| `SLACK_WEBHOOK_URL` | Slack 机器人 Webhook（新询价实时推送） |
| `WECOM_WEBHOOK_URL` | 企业微信机器人 Webhook（新询价实时推送） |

未配置 OPENAI_API_KEY 时：AI 客服降级为知识库关键词检索 + 引导文案，网站其余功能不受影响。
未配置 SMTP 时：邮件跳过，不影响 RFQ 入库。
未配置 SLACK_WEBHOOK_URL / WECOM_WEBHOOK_URL 时：实时通知静默跳过。

## 邮件打开追踪

- 发出的每封销售提醒/客户回执 HTML 里都带 1px 透明追踪像素，指向 `/api/webhooks/email-open?emailId=...`。
- 客户打开邮件后，`EmailLog.status` 会变为 `opened` 并记录 `openedAt`。
- CRM 询价详情页「Email Activity」卡片直接展示发送/打开/失败状态，可据此判断跟进时机。
- 注意：追踪像素用的是 `lib/site.ts` 里的 `domain`，上线前务必改成正式域名，否则像素请求不到。

## 数据流（RFQ 自动管道）

```
询价表单 / AI聊天 / 邮件
      ↓
需求解析(结构化) → 联系人/公司入库(upsert)
      ↓
Lead 评分(0-100) → 优先级(0-3) → 建议动作(urgent/follow_up/nurture)
      ↓
邮件：销售团队提醒(含评分) + 客户回执(RFQ ID)
      ↓
CRM 后台 (/crm)：列表 → 详情 → 一键生成参数化报价 → 状态流转
```

## 目录结构

```
app/
  api/
    quote/          POST 提交询价
    chat/           POST AI 客服(带 RAG)
    contact/        POST 联系表单
    crm/login/      POST CRM 登录
  webhooks/
    email-open/   邮件打开追踪像素(更新 EmailLog)
  crm/              CRM 后台(需 CRM_PASSWORD)
  capabilities/    能力页(含 [slug] 详情)
  industries/      行业页(含 [slug])
  process/         工艺规格页
  case-studies/    案例
  resources/       资源/博客/报价指南
  quote/           询价页
  sitemap.ts robots.ts manifest.ts
components/
  layout/  Header / Footer / ChatWidget
  quote/   QuoteForm(3 步)
  crm/     CrmNav / CrmLoginForm
  admin/   AdminNav / EditForm / KnowledgeForm
  seo/     JsonLd
data/              能力/行业/材料/设备/案例/博客/知识库(内置默认内容)
lib/               业务逻辑(scoring/quote-engine/email/openai/knowledge/content/rfq-service)
prisma/            schema + seed
generated/prisma/  Prisma 生成客户端(勿手改)
```

## 内容管理后台（/admin）

与 `/crm` 共用同一个登录密码（`CRM_PASSWORD`），左侧管理栏分组导航，登录后即可编辑：

- **Capabilities / Industries / Case Studies / Blog**：增删改，字段为结构化表单（规格表、FAQ、列表、正文段落等），改完存数据库，公开站 60 秒内生效（ISR），无需重新部署。
- **AI Knowledge**：知识库文档的增删改；保存时若有 `OPENAI_API_KEY` 会自动重新生成向量，客服立刻用上。
- **System Settings**：品牌名、域名、联系方式、工厂数据、认证等站点信息存数据库，改完 60 秒内全局生效（首页/页眉/页脚/邮件模板/通知链接/sitemap 等全部跟随）；另有集成状态页显示 SMTP / OpenAI / Slack / 企业微信 / CRM 密码的环境变量配置情况。
- 新 slug 会自动进入列表页、sitemap 与（下次抓取后的）搜索引擎。首页/导航下拉的内容来自同一数据库。

页面读取策略（`lib/content.ts`）：**DB 优先**，DB 为空或不可用时回退到 `data/*.ts` 内置内容，因此建库前网站也能完整运行。首次部署后执行 `npm run seed` 会把内置内容同步进 `ContentPage` 表。

## 改品牌信息

所有品牌、联系方式、工厂数据集中在 `lib/site.ts`，能力页/行业页/案例/博客内容在 `data/` 下独立编辑。AI 客服的知识库与提示词分别在 `data/knowledge.ts` 和 `lib/prompts.ts`。

## 上线检查清单

1. 在 `website/` 和 `admin/` 目录各执行一次 `npx prisma db push` 建表
2. `npm run seed` 灌入知识库（生产环境）
3. `npm run build && npm run start`
4. 配置域名 → `lib/site.ts` 的 `domain` 改为正式域名
5. 提交 sitemap.xml 到 Google Search Console，开启 hreflang 语言版本
6. 定期把客户高频问题补充进 `/admin/knowledge`（保存时自动生成向量）
