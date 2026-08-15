# 小白级 Vultr 部署教程（本仓库项目）

> 适用项目：MoldCraft 塑胶注塑模具工厂官网（Next.js 16 + PostgreSQL + Prisma + Nginx + PM2）
> 面向新手，跟着每一步做就行。所有「带 `$` 的命令」都是在**服务器**上执行的，「带 `C:\>` 的命令」是在你自己的 **Windows** 电脑上执行的。

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

`.env` 不会被上传到 Git，所以要在**服务器上手动创建**。

```bash
cd /var/www/moldcraft
nano .env
```

把下面内容粘贴进去（把占位符改成你的真实信息）：

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

> 注意：`DATABASE_URL` 里的密码如果含特殊字符（如 `@`、`:`、`#`），需要 URL 编码。为省事，数据库密码建议只用**字母+数字+下划线**。

---

## 第 9 步 安装依赖 + 建表 + 灌数据 + 构建

进入项目目录，依次执行：

```bash
cd /var/www/moldcraft
```

**9.1 安装依赖**（几分钟，耐心等）：

```bash
npm install
```

> 如果这一步报内存不足或卡死，请给服务器加 Swap（虚拟内存），见[第 15 步常见问题 Q5](#q5-构建时内存不足报错)。

**9.2 生成 Prisma 客户端并建表**：

```bash
npx prisma generate
npx prisma migrate deploy
```

看到 `All migrations have been applied successfully` 即建表成功。

**9.3 灌入内置内容（知识库、SEO 关键词等）**：

```bash
npm run seed
```

**9.4 构建生产版本**（第一次较慢，可能要几分钟）：

```bash
npm run build
```

看到 `✓ Compiled successfully` 之类的绿色提示即成功。**先别关**，下一步运行它。

---

## 第 10 步 用 PM2 让网站 7×24 小时运行

PM2 是一个进程管理器，保证网站崩了自动重启、服务器重启后自动启动。

**10.1 安装 PM2**：

```bash
npm install -g pm2
```

**10.2 启动网站**（端口 3000）：

```bash
cd /var/www/moldcraft
pm2 start npm --name moldcraft -- start -- --port 3000
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

`status` 是 `online` 就对了。现在可以先测一下：在**你自己电脑的浏览器**打开 `http://你的服务器IP:3000`，能打开官网就说明网站本体已经跑起来了 🎉。

> 没开域名和 80/443 端口前，用 `IP:3000` 访问即可。防火墙规则见[第 14 步](#第-14-步-打开防火墙)，请先别急着打开所有端口。

**常用 PM2 命令**：

```bash
pm2 logs moldcraft       # 看运行日志
pm2 restart moldcraft    # 重启
pm2 stop moldcraft       # 停止
```

---

## 第 11 步 安装 Nginx（域名反向代理）

Nginx 的作用：把 `80/443 端口` 的访问转发给内网的 `3000 端口`，这样访问者用 `http://你的域名` 就能打开网站，不用敲端口号。

**11.1 安装**：

```bash
apt install -y nginx
```

**11.2 创建站点配置**（把 `yourdomain.com` 换成你的域名）：

```bash
nano /etc/nginx/sites-available/moldcraft
```

粘贴下面内容：

```nginx
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
```

保存退出（`Ctrl+O` 回车，`Ctrl+X`）。

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

到你买域名的地方（阿里云/Cloudflare/Namecheap...），给域名添加两条 **A 记录**：

| 主机记录 | 记录类型 | 记录值 |
|---|---|---|
| `@`（或留空） | A | 你的服务器 IP |
| `www` | A | 你的服务器 IP |

> 在 Cloudflare 上操作时，代理状态选「仅 DNS / DNS only」（灰色云朵），因为后面要用 Certbot 签证书；等证书装好后再开橙色云朵（CDN 代理）。

等 5 分钟到几小时（DNS 生效时间不定），用你电脑测试：

```powershell
ping yourdomain.com
```

能 ping 到你的服务器 IP 就生效了。

### 12.2 申请免费 SSL 证书（Let's Encrypt）

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

按提示填写邮箱、同意协议，证书签发完成后 Certbot 会自动帮你把 Nginx 配置改成 HTTPS。

**测试自动续期**（证书有效期 90 天，必须保证自动续期，否则到期网站会挂）：

```bash
certbot renew --dry-run
```

显示成功即可。系统会自动每月续期，不用你管。

> 现在访问 `https://yourdomain.com` 应该能看到绿色小锁 🔒 的官网了。

---

## 第 13 步 修改网站里的正式域名

项目里有几处写死了默认域名，**上线前必须改**，否则：邮件里的追踪像素、CRM 链接、sitemap 都会指向错误的地址。

用你本地编辑器打开 `lib/site.ts`，把第 5 行：

```ts
domain: "https://moldcraftprecision.com",
```

改成你的正式域名：

```ts
domain: "https://yourdomain.com",
```

然后更新到服务器（见[第 16 步](#第-16-步-以后怎么更新网站)）。

> 另外，系统设置里的「域名」也可以在后台 `/admin` 的 System Settings 里改，会覆盖站点配置。两个都改成正式域名最稳妥。

> 💡 **还没有域名怎么办？** 那就先跳过第 13 步，用 IP 方式访问网站：把第 11 步 Nginx 配置里的 `server_name` 改成 `_`（或者你的服务器 IP），`https://` 部分和证书就等有域名了再弄。访问方式：
> - 直接浏览器打开 `http://你的服务器IP`（走 Nginx 80 端口，可以正常访问）
> - 邮件里的链接、追踪像素、sitemap 暂时都会指向默认域名，等你有域名后按本步改掉并[重新构建](#第-16-步-以后怎么更新网站)即可
> - 防火墙（第 14 步）也暂时不用开 `443`，只保留 22 和 80

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

- [ ] `https://你的域名` 能打开，有绿锁
- [ ] `http://你的域名:3000`（裸端口）应该打不开（因为防火墙没放行 3000）✅ 正常
- [ ] `/quote` 询价表单能正常提交（提交一条测试数据）
- [ ] `/crm/login` 用 `CRM_PASSWORD` 能登录
- [ ] `https://你的域名/sitemap.xml` 能打开，URL 都是你的正式域名
- [ ] `pm2 status` 显示 `online`，`nginx -t` 无报错
- [ ] `certbot renew --dry-run` 成功

### Q1：打不开网站 / 显示 502 Bad Gateway

大多是 Nginx 连不上 3000 端口。依次检查：

```bash
pm2 status          # 必须是 online，否则 pm2 restart moldcraft
curl http://127.0.0.1:3000   # 服务器上能返回页面吗？
nginx -t            # 配置语法对吗？
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

### Q3：`prisma migrate deploy` 报数据库连不上

```bash
psql -h 127.0.0.1 -U moldcraft -d moldcraft
```

能连上就是 `.env` 里的 `DATABASE_URL` 拼写错了（尤其是密码、`@` 符号）。确认 `nano /var/www/moldcraft/.env` 里的内容。

### Q4：改了 `lib/site.ts` / 代码后不生效

Next.js 是构建时编译的，改完代码必须**重新构建 + 重启**（见第 16 步）。

### Q5：`npm install` 很慢或失败

换国内镜像（阿里云）：

```bash
npm config set registry https://registry.npmmirror.com
```

（服务器在国内访问 npm 官方源慢，换镜像立竿见影。）

### Q6：想用 Cloudflare CDN 加速全球访问

等 HTTPS 证书装好、`https://你的域名` 正常后，再回 Cloudflare 把 A 记录的代理状态从「灰色云朵」点成「橙色云朵」，网站就走 CDN 了（还能免费防攻击、加缓存）。注意：开启后如果改服务器 IP，要记得回来改 Cloudflare 里的 A 记录。

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
npm install && npm run build
pm2 restart moldcraft
```

> 不需要重新跑 `npm run seed`（除非你本地改了 `data/` 内置内容想同步）；不需要改 Nginx。数据库结构变化时才需要额外执行 `npx prisma migrate deploy`。

---

## 附录：不用 Git，用 WinSCP 上传代码

如果你不想用 Git，也可以用图形化工具直接上传文件夹：

1. 下载并安装 WinSCP：https://winscp.net
2. 打开后填：**Host name** = 服务器 IP，**User name** = `root`，**Password** = root 密码，点登录。
3. 左边是你本地电脑，右边是服务器。**把本地项目整个文件夹拖到 `/var/www/moldcraft`**。
   - 本地项目里的 `node_modules`、`.next`、`generated` 文件夹可以删掉再传（服务器上会重新生成），能省很多上传时间。
4. 传完后回到 SSH 窗口，把第 9 步开始的命令继续执行即可。

> 缺点：以后每次改代码都要重新传整个文件夹。所以能用 Git 还是推荐用 Git。
