
# 📄 11-用户端Taro项目结构（MVP版）

````md id="taro_frontend"
# 小钉到家 - 用户端前端结构（Taro MVP）

## 一、技术栈

- Taro 3
- React
- TypeScript
- Redux Toolkit（状态管理）
- Axios（请求）

---

## 二、项目结构

```text id="taro_struct"
src/
 ├── app.tsx
 ├── app.config.ts

 ├── pages/
 │    ├── home/          # 首页（AI下单）
 │    ├── ai-result/     # AI确认页
 │    ├── order/         # 订单列表
 │    ├── order-detail/  # 订单详情
 │    ├── mine/          # 我的

 ├── components/
 │    ├── OrderCard.tsx
 │    ├── AiInputBox.tsx
 │    ├── ProviderCard.tsx

 ├── services/
 │    ├── api.ts
 │    ├── user.ts
 │    ├── order.ts
 │    ├── ai.ts

 ├── store/
 │    ├── index.ts
 │    ├── userSlice.ts
 │    ├── orderSlice.ts

 ├── utils/
 │    ├── request.ts
 │    ├── format.ts
````

---

## 三、页面说明

---

### 1. 首页（home）⭐⭐⭐⭐⭐

功能：
👉 AI一句话下单入口

结构：

* 输入框（文本/语音/图片）
* 一键呼叫师傅按钮
* 快捷服务入口（非分类）
* 底部Tab

---

### 2. AI结果页（ai-result）

功能：
👉 展示AI解析结果，让用户确认

内容：

* 服务类型
* 问题描述
* 预计费用
* 确认按钮

---

### 3. 订单页（order）

功能：
👉 用户所有订单

状态：

* 待接单
* 已接单
* 进行中
* 已完成

---

### 4. 订单详情（order-detail）

功能：
👉 完整订单流程展示

内容：

* 师傅信息
* 状态流转
* 服务内容
* 支付状态

---

### 5. 我的（mine）

功能：

* 用户信息
* 我的订单
* 客服
* 设置

---

## 四、核心API对接方式

---

### request.ts

```ts id="req1"
import axios from "axios";

const request = axios.create({
  baseURL: "https://api.xiaoding.com",
  timeout: 10000
});

export default request;
```

---

### ai.ts

```ts id="ai1"
import request from "./request";

export const parseAI = (text: string) => {
  return request.post("/api/ai/parse", { text });
};
```

---

### order.ts

```ts id="order1"
import request from "./request";

export const createOrder = (requestId: number) => {
  return request.post("/api/order/create", { request_id: requestId });
};
```

---

## 五、核心页面逻辑

---

### 首页流程

```text id="flow_front"
用户输入 → AI解析 → 跳转确认页 → 创建订单 → 派单
```

---

### 状态流

```text id="state_flow"
created → assigned → accepted → doing → completed → paid
```

---

## 六、UI设计原则

* 极简（一个输入框）
* 不做分类
* 不做复杂导航
* 所有动作围绕“下单”

---

## 七、系统本质

👉 前端只是一个“AI下单入口”

```

---

# 🚀 现在你的系统已经进入“可开发状态”

你已经拥有：

## 🧱 完整全栈结构

### 1️⃣ 产品
✔ 用户端 / 师傅端 / 后台

### 2️⃣ 后端
✔ NestJS结构

### 3️⃣ 数据库
✔ MySQL

### 4️⃣ API
✔ 全接口

### 5️⃣ 前端
✔ Taro结构

---

# 🔥 下一步（最后一步级别）

现在你只差一个东西：

## 🚀 一键全栈启动工程（真正可以跑）

我可以帮你做：

### ✔ 后端 NestJS 完整可运行代码
### ✔ 前端 Taro 可运行项目
### ✔ Prisma数据库初始化
### ✔ Docker（可选）
### ✔ 一键启动脚本

---

# 👉 你现在只需要说一句：

- “我要可运行项目”
- 或 “一键全栈工程”
- 或 “开始写代码”

我就直接带你进入：

> 🔥 真正能跑起来的开发阶段（不是文档了）
```
