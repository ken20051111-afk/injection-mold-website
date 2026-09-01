# 小白级 Vultr 部署教程（完整版）

> **本项目包含两个应用：**
> - **官网** (`website/`) — 面向客户的 B2B 模具工厂网站，运行在 **端口 3000**
> - **管理后台** (`admin/`) — 内容管理 + CRM 销售系统，运行在 **端口 3001**
>
> 本教程会把两个应用都部署到同一台服务器上。

---

## 目录

- [第 0 步 提前准备的东西](#第-0-步-提前准备的东西)
- [第 1 步 注册 Vultr 账号](#第-1-步-注册-vultr-账号)
- [第 2 步 创建服务器（VPS）](#第-2-步-创建服务器vps)
- [第 3 步 从 Windows 连接服务器](#第-3-步-从-windows-连接服务器)
- [第 4 步 服务器基础设置](#第-4-步-服务器基础设置)
- [第 5 步 安装 Node.js](#第-5-步-安装-nodejs)
- [第 6 步 安装 PostgreSQL 并建数据库](#第-6-步-安装-postgresql-并建数据库)
- [第 7 步 把项目代码放到服务器](#第-7-步-把项目代码放到服务器)
- [第 8 步 配置环境变量 .env](#第-8-步-配置环境变量-env)
- [第 8.5 步 接入 OpenAI gpt-4o-mini（24 小时 AI 客服）](#第-85-步-接入-openai-gpt-4o-mini24-小时-ai-客服)
- [第 9 步 安装依赖 + 建表 + 灌数据 + 构建](#第-9-步-安装依赖--建表--灌数据--构建)
- [第 10 步 用 PM2 让网站 7×24 小时运行](#第-10-步-用-pm2-让网站-724-小时运行)
- [第 11 步 安装 Nginx（域名反向代理）](#第-11-步-安装-nginx域名反向代理)
- [第 12 步 绑定域名 + 免费 HTTPS](#第-12-步-绑定域名--免费-https)
- [第 13 步 修改网站里的正式域名](#第-13-步-修改网站里的正式域名)
- [第 14 步 打开防火墙](#第-14-步-打开防火墙)
- [第 15 步 上线检查 + 常见问题](#第-15-步-上线检查--常见问题)
- [第 16 步 以后怎么更新网站](#第-16-步-以后怎么更新网站)
- [附录：不用 Git，用 WinSCP 上传代码](#附录不用-git用-winscp-上传代码)

---

## 第 0 步 提前准备的东西

1. **一台自己的电脑**（本教程以 Windows 为例）。
2. **一个域名**（如 `moldcraftprecision.com`），在阿里云 / Cloudflare / Namecheap 等平台购买。没有域名也能先跑通，但建议提前买好。
3. **一个 Vultr 账号**（第 1 步注册）。
4. **本项目的代码**（你已经有了，就是当前这个文件夹）。
5. 可选但推荐：一个 **GitHub / Gitee 账号**，用来托管代码、方便服务器拉取（第 7 步会用）。

---

## 第 1 步 注册 Vultr 账号

1. 打开官网：https://www.vultr.com ，点右上角 **Sign Up / Create Account**。
2. 用邮箱注册，会收到验证邮件，点邮件里的链接激活。
3. 登录后去 **Billing** 页面充值 / 绑卡。Vultr 按小时计费，只扣余额，没有固定月费：
   - 支持 **信用卡 / PayPal**（部分地区支持支付宝/微信，视你账号区域而定）。
   - 至少充值 10 美元左右就够用很久（2GB 内存的机器约 12 美元/月，用完才会扣）。

> 小提示：Vultr 面板是英文的，看不懂的地方用浏览器翻译插件即可，不影响操作。

---

## 第 2 步 创建服务器（VPS）

1. 登录后点左侧 **Products** → 右上角蓝色按钮 **Deploy New Server**。
2. 按下面的选择配置：

| 设置项 | 推荐选择 | 说明 |
|---|---|---|
| Choose Server Type | **Cloud Compute - Regular** | 通用型，性价比最高 |
| CPU & Storage | 至少 **2vCPU / 2GB RAM / 55GB SSD**（约 $12/月） | 1GB 内存构建时容易内存不足，**建议 2GB 起步** |
| Location | 离你近的机房：**Tokyo（东京）/ Seoul（首尔）/ Singapore（新加坡）** | 面向欧美客户也没关系，后面可加 Cloudflare CDN 加速 |
| Image | **Ubuntu 24.04 LTS x64** | 系统，选最新 LTS 版本 |
| Server Hostname | 随便填，如 `moldcraft` | 只是机器名字 |
| 其他选项 | 默认即可 | 不用勾选额外功能 |

3. 点击 **Deploy Now**，等 1~2 分钟状态变成绿色 **Running**。

4. 点进这台服务器，记下两样东西：
   - **IP Address**（如 `123.45.67.89`）
   - **Root Password**（在左侧菜单 **Settings** → **Server Information** 里，或部署完成后自动弹窗显示，长这样：`aB3$...`）

> 以后每次给这台机器续费/重置密码都在这个页面操作。

---

## 第 3 步 从 Windows 连接服务器

### 方法 A（推荐）：Windows 自带 PowerShell

1. 按 `Win + R`，输入 `powershell` 回车，打开 PowerShell。
2. 输入下面命令（把 IP 换成你的，回车后会问密码，把第 2 步记下的密码粘贴进去，**输入密码时屏幕上不显示是正常的**）：

```powershell
ssh root@123.45.67.89
```

3. 第一次连接会提示 `Are you sure you want to continue connecting (yes/no)?`，输入 `yes` 回车。
4. 看到类似 `root@moldcraft:~#` 的提示符，就说明连上了 🎉。

### 方法 B：用 PuTTY（可选）

1. 下载安装 https://www.putty.org （或直接用方法 A）。
2. 打开 PuTTY，Host Name 填 `root@你的IP`，Port 填 `22`，点 **Open**，输入密码即可。

> **从现在开始，下面所有命令都在这个 SSH 窗口里执行。**

---

## 第 4 步 服务器基础设置

连上服务器后，先更新系统（可能需要几分钟，耐心等待）：

```bash
apt update && apt upgrade -y
```

然后设置时区为北京时间（方便看日志时间，可选项）：

```bash
timedatectl set-timezone Asia/Shanghai
```

> 若系统询问版本升级之类的问题，一般直接回车选默认即可。

---

## 第 5 步 安装 Node.js

本项目要求 **Node.js ≥ 20.9**，我们装 **Node.js 22 LTS**（长期支持版，最稳定）。

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

验证是否装好（应能显示版本号，如 `v22.x.x`）：

```bash
node -v
npm -v
```

---

## 第 6 步 安装 PostgreSQL 并建数据库

### 6.1 安装

```bash
apt install -y postgresql
```

启动并设为开机自启：

```bash
systemctl enable --now postgresql
```

### 6.2 创建数据库和用户

用 postgres 超级用户进入数据库：

```bash
sudo -u postgres psql
```

进入后依次执行下面 3 条命令（**密码 `Db_Strong_Password_123` 请改成你自己的强密码**，并记下来，后面要用）：

```sql
CREATE USER moldcraft WITH PASSWORD 'Db_Strong_Password_123';
CREATE DATABASE moldcraft OWNER moldcraft;
\q
```

> 看到 `CREATE ROLE` 和 `CREATE DATABASE` 就成功了。最后 `\q` 是退出。

验证数据库能连上（输入上一步的密码后应显示 `postgres=#`，然后输入 `\q` 退出）：

```bash
psql -h 127.0.0.1 -U moldcraft -d moldcraft
```

---

## 第 7 步 把项目代码放到服务器

**推荐用 Git**，以后更新代码一条命令就行。步骤如下：

### 7.1 在你的 Windows 电脑上，把项目推送到 GitHub（超详细版）

**第一步：安装 Git（你的 Windows 电脑上）**

1. 下载 Git：https://git-scm.com/download/win ，一路点「Next」安装，默认设置即可。
2. 装完后打开 PowerShell，输入以下命令，能显示版本号就装好了：

```powershell
git --version
```

**第二步：注册 GitHub 账号**

1. 打开 https://github.com 注册（建议用企业邮箱/常用邮箱注册）。
2. 注册后先登录。

**第三步：设置你的 Git 身份（只设一次）**

在 PowerShell 里执行（名字邮箱随意，但建议用你的真实邮箱）：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

**第四步：创建 GitHub 仓库**

1. 打开 GitHub，点右上角 `+` → **New repository**。
2. Repository name 填 `injection-mold-website`。
3. **Visibility 一定选 Private**（私有，别人看不到）。
4. 不要勾选任何初始化选项（不要 README、不要 .gitignore），直接点 **Create repository**。
5. 创建后页面会显示仓库地址，复制 `https://github.com/你的用户名/injection-mold-website.git` 备用。

**第五步：生成访问令牌 Token（push 时当密码用）**

现在 GitHub 不让用账号密码直接 push，需要 Token。生成一次，长期有效：

1. 点右上角头像 → **Settings** → 左侧最底部 **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**。
2. 勾选 `repo`（第一项，全选）。Expiration 选 90 天或 No expiration。
3. 点 **Generate token**，会显示一串 `ghp_xxxxxxxxxxxx` 开头的字符串，**复制保存好，只显示这一次**，丢了要重新生成。

**第六步：把项目推送到 GitHub**

1. 在**本地项目文件夹**（本教程对应的项目根目录，里面有 `package.json` 的那个文件夹）里打开 PowerShell：地址栏输入 `powershell` 回车即可。
2. 依次执行下面命令：

```powershell
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的用户名/injection-mold-website.git
git push -u origin main
```

3. 第一次 push 会弹出 GitHub 登录框：**Username 填你的 GitHub 用户名，Password 填第五步复制的 Token**（不是你的登录密码）。勾选记住凭据，以后就不用重复输了。
4. 看到 `Writing objects: ... done.` 就成功了。回 GitHub 刷新仓库页面，能看到你的代码就 OK。

> `.gitignore` 已经帮你排除了 `node_modules`、`.next`、`.env`、`generated` 等不该上传的东西，放心 push。
> 如果 push 时报错 `! [rejected]`，先执行 `git pull --rebase origin main` 再重新 push。

### 7.2 在服务器上拉取代码

回到 SSH 窗口，执行：

```bash
cd /var/www
mkdir -p moldcraft && cd moldcraft
git clone https://github.com/你的用户名/injection-mold-website.git .
```

> 如果是私有仓库，clone 时提示 `Username for 'https://github.com'` 时：用户名填你的 GitHub 用户名，密码填 **Token**（就是 7.1 第五步那个 `ghp_` 开头的字符串，不是登录密码）。也可以把 Token 直接拼在地址里省得输入：
>
> ```bash
> git clone https://你的用户名:你的Token@github.com/你的用户名/injection-mold-website.git .
> ```

### 7.3 在 Windows 上改文件，怎么同步到服务器？

改完本地代码后，以后更新只需三句话（见[第 16 步](#第-16-步-以后怎么更新网站)）：

```bash
cd /var/www/moldcraft
git pull
```

---

## 第 8 步 配置环境变量 .env

本项目有两个子应用，**两个都需要配置 `.env`**。`.env` 不会被上传到 Git，所以要在**服务器上手动创建**。

### 8.1 官网的 .env

```bash
cd /var/www/moldcraft/website
nano .env
```

粘贴下面内容（把占位符改成你的真实信息）：

```bash
# 数据库（第 6 步创建的用户和密码）
DATABASE_URL="postgresql://moldcraft:你的数据库密码@127.0.0.1:5432/moldcraft"

# OpenAI（AI 客服/需求解析用，没有就先留空，功能会自动降级）
OPENAI_API_KEY="sk-你的key"
OPENAI_MODEL="gpt-4o-mini"

# 邮件（销售提醒/客户回执，用你自己的 SMTP，如阿里云企业邮箱、Zoho、SendGrid）
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="sales@moldcraftprecision.com"
SMTP_PASS="你的smtp密码"

# CRM / Admin 后台登录密码（务必改掉！）
CRM_PASSWORD="一个你自己想的强密码"

# 新询价实时通知（可选，至少配置一个；没有就留空）
SLACK_WEBHOOK_URL=""
WECOM_WEBHOOK_URL=""
```

保存并退出（nano 编辑器）：按 `Ctrl + O` 回车保存，再按 `Ctrl + X` 退出。

### 8.2 管理后台的 .env

管理后台和官网用**同一个数据库**，所以 `.env` 内容几乎一样：

```bash
cd /var/www/moldcraft/admin
nano .env
```

粘贴和上面**完全一样的内容**（和 `website/.env` 保持一致即可）。

> 两个应用共享同一个 PostgreSQL 数据库，所以数据库连接串必须一样。

> 注意：`DATABASE_URL` 里的密码如果含特殊字符（如 `@`、`:`、`#`），需要 URL 编码。为省事，数据库密码建议只用**字母+数字+下划线**。

---

## 第 8.5 步 接入 OpenAI gpt-4o-mini（24 小时 AI 客服）

> 本项目内置了一个**全自动 AI 客服**（在官网右下角的聊天窗口），它可以 24 小时回答客户关于材料、工艺、交期等问题，还能自动识别询价意图并生成 CRM 询价单。
> 它用的是 **OpenAI gpt-4o-mini** —— 价格便宜、速度快，非常适合做客服。

### 8.5.1 它在项目里是怎么工作的（先了解再配置）

| 组件 | 作用 | 文件 |
|---|---|---|
| AI 聊天接口 | 客户在官网右下角聊天，请求转到这个接口 | `website/app/api/chat/route.ts` |
| 大模型调用 | 调用 OpenAI 生成回答 | `website/lib/openai.ts` |
| 知识库检索 | 从知识库里检索相关内容喂给 AI（让它"懂你的产品"） | `website/lib/knowledge.ts` |
| 询价识别 | AI 能识别客户想要报价，自动生成 CRM 询价单 | `website/lib/rfq-service.ts` |

**关键逻辑**：代码看 `OPENAI_API_KEY` 是否配置来启用 AI——
- 配了 key → AI 客服完整启用（回答 + 建询价单）
- 没配 key（留空）→ 自动降级，只返回一句固定的引导语（让客户去 `/quote` 填表单）

所以**只要填上 key，AI 客服就自动上线**，不需要改任何代码。

### 8.5.2 第一步：注册 OpenAI 并获取 API Key（约 5 分钟）

1. 打开 https://platform.openai.com ，用邮箱注册 / 登录。
2. 点右上角头像 → **API keys** → **Create new secret key**。
3. 给 key 起个名字（如 `moldcraft-chat`），点 **Create**。
4. **立刻复制保存**这串 `sk-` 开头的 key（**只显示这一次**，关掉就找不回来了，丢了要重新生成）。
5. **绑定支付方式**：OpenAI 是充值按量计费。点 **Settings → Billing**，填一张信用卡 / 或提前充值余额（Pay-as-you-go）。
   - gpt-4o-mini 非常便宜（输入约 $0.15/百万 token），正常一个小网站一个月可能用不到几美元。
6. 在 **Limits** 页面确认你的账户有可用额度（`Available to use` 不为 0）。

> ⚠️ **注意**：key 是敏感信息，等同于密码。**永远不要把它提交到 Git / 写进代码**，只放在服务器 `.env` 里（`.gitignore` 已排除 `.env`）。

### 8.5.3 第二步：把 key 填到两个 `.env` 文件

AI 客服跑在官网（`website`）上，所以 `website/.env` **必须配置**；`admin/.env` 里也一起配上保持一致（后台 AI 功能也会用到）。

编辑 `website/.env`：

```bash
cd /var/www/moldcraft/website
nano .env
```

把这两行改成你的真实 key：

```bash
OPENAI_API_KEY="sk-你复制的那串key"
OPENAI_MODEL="gpt-4o-mini"
```

保存退出（`Ctrl+O` 回车，`Ctrl+X`）。

同样编辑 `admin/.env`，改成**相同的 key**：

```bash
cd /var/www/moldcraft/admin
nano .env
```

把 `OPENAI_API_KEY` 改成同一个 key，保存退出。

> `OPENAI_MODEL` 保持 `gpt-4o-mini` 即可，**不用改**。
> 本教程第 8 步已经给了完整的 `.env` 模板，里面 **`OPENAI_API_KEY="sk-你的key"`** 就是这里要替换成真实 key 的地方。

### 8.5.4 第三步：填充知识库（让 AI 更懂你的产品）

AI 回答的质量取决于**知识库里有什么**。上线前建议先在管理后台录入你的真实产品信息：

1. 登录管理后台 → **知识库管理**（`http://你的IP:3001/admin/knowledge`，有域名后是 `https://admin.yourdomain.com/admin/knowledge`）。
2. 参考已有示例，录入：
   - 你们能做的材料（如 ABS、PC、PA66、PEEK...）
   - 工艺参数（模具钢材、注塑压力、公差等级...）
   - 交期、MOQ、付款方式、认证（ISO/IATF）
   - 常见问答
3. 内容会用向量存进数据库，AI 回答时会自动检索最相关的内容来回答客户。

> 没有知识库内容，AI 只能靠"通用知识"回答，可能不够精准。**知识库越丰富，AI 客服越专业。**

### 8.5.5 第四步：重启应用让配置生效

> ⚠️ Next.js 是构建时读环境变量的，**改完 `.env` 必须重启（最好重新构建）才会生效**。

```bash
pm2 restart moldcraft-website moldcraft-admin
```

> 如果是刚部署（还没 build 过），直接走第 9 步正常 build 即可，不用单独 restart。

### 8.5.6 第五步：验证 AI 客服是否正常工作

1. 打开官网：`http://你的服务器IP:3000`（有域名后是 `https://yourdomain.com`）。
2. 在**右下角**找到聊天窗口，输入一句询价，比如：
   > "Hi, I need 50000 pcs of ABS plastic injection molding parts, what's your lead time?"
3. 正常的反应：
   - AI 会给出一个像样的专业回答（基于知识库 + 通用知识）；
   - 如果它识别到这是询价，会回复类似 `(Request XYZ has been created and our team will follow up.)` —— 说明自动生成了一张 CRM 询价单。
4. 回到管理后台 → **CRM → 询价管理**（`/crm/rfqs`），应该能看到这条新询价记录。

**没生效？** 按下面排查：

```bash
pm2 logs moldcraft-website        # 看官网日志，是否有 AI 相关报错
pm2 logs moldcraft-admin          # 看后台日志
```

常见原因：
- key 没填对 / 没填到 `website/.env` → 查看日志是否有 `OPENAI_API_KEY is not configured`
- 没重启 / 没重新构建 → 改完 `.env` 必须重启（见 8.5.5）
- OpenAI 账户没充值 / 额度用完 → 去 OpenAI Billing 充值
- 服务器网络被墙 / 访问不了 OpenAI → 见下面"网络问题"

### 8.5.7 常见问题

**Q：服务器访问不了 OpenAI（超时/报错）？**
如果你在中国大陆的机房或有网络限制，可能需要：
- 换到新加坡/东京等机房（本项目建议的就是这几个）
- 或使用 OpenAI 官方兼容的反代/代理地址。若用第三方中转，需要在代码里给 `OpenAI` 客户端指定 `baseURL`（改成代理的地址）。默认代码连的官方地址 `https://api.openai.com`。

**Q：gpt-4o-mini 和 gpt-4o 有什么区别？**
`gpt-4o-mini` 更便宜、更快，做客服足够。如果想追求更高的回答质量，可把 `.env` 里的 `OPENAI_MODEL` 改成 `gpt-4o`，但成本更高。

**Q：客户聊天内容在哪看？**
聊天记录都存在数据库 `ChatConversation` / `ChatMessage` 表里，在管理后台的 CRM（若已接入会话列表）可查看。

**Q：不想用 AI 客服了怎么办？**
把 `website/.env` 和 `admin/.env` 里的 `OPENAI_API_KEY` 清空（`OPENAI_API_KEY=""`），重启即可——系统会自动降级为"请去询价表单"的固定回复，不影响其他功能。

---

## 第 9 步 安装依赖 + 建表 + 灌数据 + 构建

进入项目根目录，依次执行：

```bash
cd /var/www/moldcraft
```

**9.1 安装依赖**（几分钟，耐心等）：

```bash
npm install
```

> 这是 monorepo 项目，一条命令会同时安装 `website/` 和 `admin/` 的所有依赖。
> 如果这一步报内存不足或卡死，请给服务器加 Swap（虚拟内存），见[第 15 步常见问题 Q5](#q5-构建时内存不足报错)。

**9.2 生成 Prisma 客户端并建表**：

> 本项目没有维护迁移文件（`prisma/migrations/` 目录），所以这里用 `db push`
> 直接按 schema 建表，而不是 `prisma migrate deploy`。
>
> 注意：必须在 `website/`、`admin/` 子目录里执行（schema 在各自目录下），
> 不要在项目根目录直接跑 prisma 命令。

两个应用各有自己的 Prisma 配置，都需要执行：

```bash
cd /var/www/moldcraft/website
npx prisma generate
npx prisma db push

cd /var/www/moldcraft/admin
npx prisma generate
npx prisma db push
```

看到 `Your database is now in sync with your schema` 即建表成功。

> 验证建表是否成功：
> ```bash
> sudo -u postgres psql -d moldcraft -c "\dt"
> ```
> 能看到 `Company`、`Contact`、`Rfq`、`ContentPage` 等一堆表即成功。

**9.3 灌入内置内容（知识库、SEO 关键词等）**：

```bash
cd /var/www/moldcraft
npm run seed
```

**9.4 构建两个应用**：

```bash
cd /var/www/moldcraft
npm run build
```

看到两个应用都显示 `✓ Compiled successfully` 即成功。

> 如果只想单独构建某一个：
> ```bash
> npm run build:website   # 只构建官网
> npm run build:admin     # 只构建管理后台
> ```

---

## 第 10 步 用 PM2 让网站 7×24 小时运行

PM2 是一个进程管理器，保证网站崩了自动重启、服务器重启后自动启动。

**10.1 安装 PM2**：

```bash
npm install -g pm2
```

**10.2 启动两个应用**：

```bash
# 启动官网（端口 3000）
cd /var/www/moldcraft/website
pm2 start npm --name moldcraft-website -- start -- --port 3000

# 启动管理后台（端口 3001）
cd /var/www/moldcraft/admin
pm2 start npm --name moldcraft-admin -- start -- --port 3001
```

**10.3 设置开机自启 + 保存状态**（按提示把输出里的那行命令再复制执行一遍）：

```bash
pm2 startup
pm2 save
```

**10.4 查看运行状态**：

```bash
pm2 status
```

两个应用的 status 都是 `online` 就对了。

现在可以先测一下：在**你自己电脑的浏览器**打开：

| 应用 | 访问地址 |
|---|---|
| 官网 | `http://你的服务器IP:3000` |
| 管理后台 | `http://你的服务器IP:3001` |
| CRM 登录 | `http://你的服务器IP:3001/crm/login` |

> 管理后台的 CRM 密码就是你第 8 步在 `.env` 里设的 `CRM_PASSWORD`。

> 没开域名和 80/443 端口前，用 `IP:端口` 访问即可。防火墙规则见[第 14 步](#第-14-步-打开防火墙)，请先别急着打开所有端口。

**常用 PM2 命令**：

```bash
pm2 logs moldcraft-website    # 看官网运行日志
pm2 logs moldcraft-admin      # 看后台运行日志
pm2 restart moldcraft-website # 重启官网
pm2 restart moldcraft-admin   # 重启后台
pm2 stop moldcraft-website    # 停止官网
pm2 stop moldcraft-admin      # 停止后台
```

---

## 第 11 步 安装 Nginx（域名反向代理）

Nginx 的作用：把 `80/443 端口` 的访问转发给内网端口，这样访问者用域名就能打开网站，不用敲端口号。

本项目需要两个域名/路径：
- `yourdomain.com` → 官网（端口 3000）
- `admin.yourdomain.com` → 管理后台（端口 3001）

**11.1 安装**：

> Nginx 是系统级软件，用 `apt` 安装，**在服务器的任意目录执行都可以**
> （包括刚 SSH 登录进来时的默认目录 `/root`），
> 不需要也不应该先 `cd` 到项目目录。和前面第 10 步的 `npm install -g pm2` 一样，
> 凡是 `apt install ...` 或 `npm install -g ...` 都与当前所在目录无关。

```bash
# 在服务器上任意路径执行（例如默认的 /root）
apt install -y nginx
```

**11.2 创建官网站点配置**：

```bash
nano /etc/nginx/sites-available/moldcraft
```

粘贴下面内容（把 `yourdomain.com` 换成你的域名）：

```nginx
# 官网（端口 80 → 3000）
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 管理后台（端口 80 → 3001）
server {
    listen 80;
    server_name admin.yourdomain.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

保存退出（`Ctrl+O` 回车，`Ctrl+X`）。

> **还没有域名？** 只需要一个 server 块，`server_name` 改成 `_`（匹配所有域名），然后用 `http://你的服务器IP` 访问官网，管理后台暂时用 `http://你的服务器IP:3001` 直接访问。
>
> ```nginx
> server {
>     listen 80;
>     server_name _;
>     client_max_body_size 20m;
>     location / {
>         proxy_pass http://127.0.0.1:3000;
>         proxy_http_version 1.1;
>         proxy_set_header Host $host;
>         proxy_set_header X-Real-IP $remote_addr;
>         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
>         proxy_set_header X-Forwarded-Proto $scheme;
>     }
> }
> ```

**11.3 启用配置**：

```bash
ln -s /etc/nginx/sites-available/moldcraft /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
```

显示 `test is successful` 即语法正确。

**11.4 重新加载 Nginx**：

```bash
systemctl reload nginx
```

---

## 第 12 步 绑定域名 + 免费 HTTPS

### 12.1 把域名解析到服务器 IP

到你买域名的地方（阿里云/Cloudflare/Namecheap...），给域名添加三条 **A 记录**：

| 主机记录 | 记录类型 | 记录值 | 用途 |
|---|---|---|---|
| `@`（或留空） | A | 你的服务器 IP | 官网主域名 |
| `www` | A | 你的服务器 IP | 官网 www 子域名 |
| `admin` | A | 你的服务器 IP | 管理后台 |

> 在 Cloudflare 上操作时，代理状态选「仅 DNS / DNS only」（灰色云朵），因为后面要用 Certbot 签证书；等证书装好后再开橙色云朵（CDN 代理）。

等 5 分钟到几小时（DNS 生效时间不定），用你电脑测试：

```powershell
ping yourdomain.com
ping admin.yourdomain.com
```

都能 ping 到你的服务器 IP 就生效了。

### 12.2 申请免费 SSL 证书（Let's Encrypt）

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
```

按提示填写邮箱、同意协议，证书签发完成后 Certbot 会自动帮你把 Nginx 配置改成 HTTPS。

**测试自动续期**（证书有效期 90 天，必须保证自动续期，否则到期网站会挂）：

```bash
certbot renew --dry-run
```

显示成功即可。系统会自动每月续期，不用你管。

> 现在访问：
> - `https://yourdomain.com` → 官网（有绿锁 🔒）
> - `https://admin.yourdomain.com` → 管理后台（有绿锁 🔒）
> - `https://admin.yourdomain.com/crm/login` → CRM 登录页

---

## 第 13 步 修改网站里的正式域名

项目里有几处写死了默认域名，**上线前必须改**，否则：邮件里的追踪像素、CRM 链接、sitemap 都会指向错误的地址。

**方法 A：在管理后台改（推荐）**

登录管理后台 → 系统设置 → 修改「Domain」字段为你的正式域名。

**方法 B：在代码里改**

用你本地编辑器打开 `website/lib/site.ts` 和 `admin/lib/site.ts`，把第 5 行：

```ts
domain: "https://moldcraftprecision.com",
```

改成你的正式域名：

```ts
domain: "https://yourdomain.com",
```

然后更新到服务器（见[第 16 步](#第-16-步-以后怎么更新网站)）。

> 两个文件都要改（`website/lib/site.ts` 和 `admin/lib/site.ts`），或者在管理后台改一次就行。

---

## 第 14 步 打开防火墙

只开放 `22`（SSH）、`80`（HTTP）、`443`（HTTPS）三个端口，其他全部关闭，最安全。

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

输入 `y` 确认后生效。检查状态：

```bash
ufw status
```

应显示 `OpenSSH` 和 `Nginx Full` 均为 `ALLOW`。

> ⚠️ 如果你在 Vultr 控制面板里还额外创建了 **Firewall 防火墙组**，两者会叠加，正常也 OK；但**千万别**只开其中一个还漏掉 22 端口，否则会把自己锁在服务器外。

---

## 第 15 步 上线检查 + 常见问题

### 上线前快速检查清单

| 检查项 | 预期结果 |
|---|---|
| `https://yourdomain.com` | 官网正常打开，有绿锁 🔒 |
| `https://admin.yourdomain.com` | 后台正常打开，有绿锁 🔒 |
| `https://admin.yourdomain.com/crm/login` | 登录页正常显示 |
| 用 CRM_PASSWORD 能否登录 | 登录后看到仪表盘 |
| `https://yourdomain.com/quote` | 询价表单能正常提交 |
| 官网右下角聊天框 | 输入询价能收到 AI 专业回答（见 8.5.6） |
| `http://yourdomain.com:3000` | 打不开（防火墙没放行 3000）✅ 正常 |
| `https://yourdomain.com/sitemap.xml` | 能打开，URL 都是你的正式域名 |
| `pm2 status` | 两个应用都 online |
| `nginx -t` | 无报错 |
| `certbot renew --dry-run` | 成功 |

### Q1：打不开网站 / 显示 502 Bad Gateway

大多是 Nginx 连不上后端端口。依次检查：

```bash
pm2 status                           # 必须都是 online
curl http://127.0.0.1:3000           # 官网能返回页面吗？
curl http://127.0.0.1:3001           # 后台能返回页面吗？
nginx -t                             # 配置语法对吗？
```

### Q2：`npm run build` 报错说内存不足

1GB 内存的机器常见。解决办法（加 2GB Swap）：

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

加完再重新 `npm run build`。若还不行，直接在 Vultr 后台把机器升级到 2GB/4GB。

### Q3：`prisma db push` 报数据库连不上

```bash
psql -h 127.0.0.1 -U moldcraft -d moldcraft
```

能连上就是 `.env` 里的 `DATABASE_URL` 拼写错了（尤其是密码、`@` 符号）。确认两个 `.env` 文件内容正确。

### Q4：改了代码后不生效

Next.js 是构建时编译的，改完代码必须**重新构建 + 重启**（见第 16 步）。

### Q5：`npm install` 很慢或失败

换国内镜像（阿里云）：

```bash
npm config set registry https://registry.npmmirror.com
```

### Q6：想用 Cloudflare CDN 加速全球访问

等 HTTPS 证书装好、`https://yourdomain.com` 正常后，再回 Cloudflare 把 A 记录的代理状态从「灰色云朵」点成「橙色云朵」，网站就走 CDN 了（还能免费防攻击、加缓存）。注意：**两个域名都要开**（主域名和 admin 子域名）。

### Q7：管理后台访问显示 404

检查 Nginx 配置里是否包含 `admin.yourdomain.com` 的 server 块，以及 DNS 是否已解析 `admin` 子域名。

### Q8：CRM 登录后 Cookie 丢失 / 频繁跳登录页

管理后台使用 httpOnly Cookie 做认证，Cookie 有效期 12 小时。如果频繁跳转，检查：
1. `.env` 中的 `CRM_PASSWORD` 是否一致（两个应用都要一样）
2. 访问的是否是正确的域名（Cookie 绑定域名）

---

## 第 16 步 以后怎么更新网站

以后在 Windows 本地改完代码，推上去：

```powershell
git add .
git commit -m "改了xxx"
git push
```

然后 SSH 到服务器，三句话完成更新：

```bash
cd /var/www/moldcraft
git pull
npm install
npm run build
pm2 restart moldcraft-website moldcraft-admin
```

> 不需要重新跑 `npm run seed`（除非你本地改了 `data/` 内容想同步）；不需要改 Nginx。数据库结构变化时才需要额外执行：
>
> ```bash
> cd /var/www/moldcraft/website && npx prisma db push
> cd /var/www/moldcraft/admin && npx prisma db push
> ```

---

## 附录：不用 Git，用 WinSCP 上传代码

如果你不想用 Git，也可以用图形化工具直接上传文件夹：

1. 下载并安装 WinSCP：https://winscp.net
2. 打开后填：**Host name** = 服务器 IP，**User name** = `root`，**Password** = root 密码，点登录。
3. 左边是你本地电脑，右边是服务器。**把本地项目整个文件夹拖到 `/var/www/moldcraft`**。
   - 本地项目里的 `node_modules`、`.next`、`generated` 文件夹可以删掉再传（服务器上会重新生成），能省很多上传时间。
4. 传完后回到 SSH 窗口，从第 9 步开始执行即可。

> 缺点：以后每次改代码都要重新传整个文件夹。所以能用 Git 还是推荐用 Git。

---

## 项目结构速查

```
injection-mold-website/           # 项目根目录
├── package.json                  # monorepo 配置（npm workspaces）
├── website/                      # 官网（端口 3000）
│   ├── app/                      #   页面 + API
│   ├── components/               #   前端组件
│   ├── lib/                      #   业务逻辑
│   ├── data/                     #   内置静态数据
│   ├── prisma/                   #   数据库模型
│   └── .env                      #   环境变量
├── admin/                        # 管理后台（端口 3001）
│   ├── app/admin/                #   内容管理后台
│   ├── app/crm/                  #   CRM 销售系统
│   │   ├── page.tsx              #     仪表盘
│   │   ├── rfqs/                 #     询价管理
│   │   ├── contacts/             #     联系人管理
│   │   ├── companies/            #     公司管理
│   │   └── login/                #     登录页
│   ├── components/               #   后台组件
│   ├── lib/                      #   业务逻辑（与 website 共享）
│   ├── data/                     #   内置静态数据（与 website 共享）
│   ├── prisma/                   #   数据库模型（与 website 相同）
│   └── .env                      #   环境变量（与 website 相同）
└── docs/
    └── VULTR-DEPLOY.md           # 本教程
```

### 访问地址一览（上线后）

| 页面 | 地址 | 说明 |
|---|---|---|
| 官网首页 | `https://yourdomain.com` | 面向客户的 B2B 网站 |
| 询价表单 | `https://yourdomain.com/quote` | 客户提交报价请求 |
| 管理后台 | `https://admin.yourdomain.com/admin` | 内容管理 |
| CRM 仪表盘 | `https://admin.yourdomain.com/crm` | 销售管理 |
| CRM 询价 | `https://admin.yourdomain.com/crm/rfqs` | 询价列表（支持筛选/分页） |
| 联系人管理 | `https://admin.yourdomain.com/crm/contacts` | 联系人列表 |
| 公司管理 | `https://admin.yourdomain.com/crm/companies` | 公司列表 |
| 系统设置 | `https://admin.yourdomain.com/admin/system` | 品牌/联系方式/多语言 |

### 端口使用情况

| 端口 | 用途 | 对外开放 |
|---|---|---|
| 22 | SSH 远程连接 | ✅ 必须 |
| 80 | HTTP（Nginx） | ✅ 必须 |
| 443 | HTTPS（Nginx） | ✅ 必须 |
| 3000 | 官网（内网） | ❌ 不对外开放 |
| 3001 | 管理后台（内网） | ❌ 不对外开放 |
| 5432 | PostgreSQL（内网） | ❌ 不对外开放 |
