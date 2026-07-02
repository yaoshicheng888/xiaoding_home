---

# 📄 09-数据库SQL设计.md（完整版）

````md id="sql_full"
# 小钉到家 - 数据库设计（MVP）

## 一、核心设计原则

- 单体结构
- 所有订单统一管理
- AI解析单独存储
- 支付与订单解耦
- 状态必须可追踪

---

## 二、用户表 users

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(20) UNIQUE,
  name VARCHAR(50),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
````

---

## 三、师傅表 providers

```sql
CREATE TABLE providers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  phone VARCHAR(20),
  skill_tags TEXT,
  status TINYINT DEFAULT 1,
  rating DECIMAL(2,1) DEFAULT 5.0,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 四、AI请求表 service_requests

```sql
CREATE TABLE service_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  raw_text TEXT,
  ai_category VARCHAR(50),
  ai_result JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 五、订单表 service_orders ⭐核心

```sql
CREATE TABLE service_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  request_id BIGINT,
  user_id BIGINT,
  provider_id BIGINT DEFAULT NULL,

  status VARCHAR(20),

  price DECIMAL(10,2) DEFAULT 0,
  commission DECIMAL(10,2) DEFAULT 0,

  address TEXT,
  remark TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 六、派单表 jobs

```sql
CREATE TABLE jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT,
  provider_id BIGINT,
  type VARCHAR(20), -- assign / bid
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 七、支付表 payments

```sql
CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT,
  amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  provider_income DECIMAL(10,2),

  status VARCHAR(20),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 八、售后表 after_sales

```sql
CREATE TABLE after_sales (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT,
  reason TEXT,
  status VARCHAR(20),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 九、订单状态流转（核心逻辑）

```text
created → assigned → accepted → doing → completed → paid
```

---

## 十、关键设计说明

### 1. service_orders 是核心表

所有业务围绕它展开

---

### 2. service_requests 是AI输入记录

不参与交易逻辑

---

### 3. payments 独立结算

避免污染订单逻辑

---

### 4. jobs 是派单控制层

支持抢单 + 指派

---

## 十一、系统本质

👉 数据库 = 整个系统的真实状态源

```

---

# 🚀 到这里你已经完成“全系统底座”

现在你这个项目已经具备：

## 🧠 完整架构

### 1️⃣ 产品层
- 用户端
- 师傅端
- 后台

### 2️⃣ 接口层
- API设计

### 3️⃣ 数据层
- MySQL完整结构

---

# 🔥 下一步（真正开始写代码）

你现在可以直接进入开发阶段了，我建议你下一步选一个：

---

## 🚀 A. NestJS后端项目结构（推荐）
👉 直接可以跑服务

---

## 🚀 B. Taro小程序前端结构
👉 可以直接给 Trae 写页面

---

## 🚀 C. 一键启动全项目结构（最高级）
👉 前后端 + DB + API 全打包

---

# 👉 你现在只需要说一句：

- “开始后端结构”
- 或 “开始前端结构”
- 或 “一键项目工程”

我就带你进入**真正写代码阶段（不是设计了，是可以上线的那种）** 🚀
```
