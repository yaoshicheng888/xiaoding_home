
# 📄 08-API接口设计.md（完整版）

````md id="api8_full"
# 小钉到家 - API接口设计（MVP）

## 一、统一规范（强制）

### 1. 所有接口统一返回格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
````

---

### 2. 状态码规则

* 0 = 成功
* 1 = 业务错误
* 500 = 系统错误

---

### 3. 鉴权方式

* JWT Token
* Header携带：

Authorization: Bearer token

---

## 二、用户端 API

---

### 1. 用户登录

POST /api/user/login

请求：

```json
{
  "phone": "138xxxx"
}
```

返回：

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "phone": "138xxxx"
  }
}
```

---

### 2. 创建AI服务请求

POST /api/request/create

请求：

```json
{
  "text": "空调不制冷"
}
```

返回：

```json
{
  "request_id": 1001,
  "ai_result": {
    "category": "空调维修",
    "urgency": "medium"
  }
}
```

---

### 3. 创建订单

POST /api/order/create

请求：

```json
{
  "request_id": 1001
}
```

返回：

```json
{
  "order_id": 5001
}
```

---

### 4. 订单列表

GET /api/order/list

参数：

* user_id

---

### 5. 订单详情

GET /api/order/detail

参数：

* order_id

---

## 三、师傅端 API

---

### 1. 师傅登录

POST /api/provider/login

---

### 2. 获取抢单列表

GET /api/provider/orders

说明：
返回可抢订单池

---

### 3. 抢单

POST /api/provider/take

请求：

```json
{
  "order_id": 5001
}
```

---

### 4. 开始服务

POST /api/provider/start

---

### 5. 完工提交

POST /api/provider/complete

请求：

```json
{
  "order_id": 5001,
  "images": [],
  "remark": "已修复完成"
}
```

---

## 四、派单系统（后台）

---

### 1. 自动派单

POST /api/admin/dispatch/auto

说明：
AI + 规则自动匹配师傅

---

### 2. 手动派单

POST /api/admin/dispatch/manual

请求：

```json
{
  "order_id": 5001,
  "provider_id": 10
}
```

---

## 五、AI接口

---

### 1. AI解析

POST /api/ai/parse

请求：

```json
{
  "text": "马桶堵了"
}
```

返回：

```json
{
  "category": "疏通",
  "urgency": "low",
  "tags": ["马桶"]
}
```

---

## 六、支付接口

---

### 1. 创建支付

POST /api/pay/create

---

### 2. 支付回调

POST /api/pay/callback

---

## 七、订单状态流转

```text
created → assigned → accepted → doing → completed → paid
```

---

## 八、核心原则（非常重要）

### 1. AI只负责解析，不做决策

### 2. 派单必须后端控制

### 3. 金额必须后端计算

### 4. 所有状态必须可追踪

---

## 九、系统本质

👉 API是整个系统唯一控制入口

```

---

# 🚀 下一步你可以直接继续

你现在已经有：

✔ 用户端  
✔ 师傅端  
✔ 后台  
✔ API设计  

---

# 🔥 下一步（真正开发开始）

如果你说一句：

👉 **“:contentReference[oaicite:0]{index=0}”**

我会直接给你：

- MySQL建表SQL
- 或 Prisma版本
- 可直接上线那种

或者你也可以说：

- :contentReference[oaicite:1]{index=1}
- :contentReference[oaicite:2]{index=2}

我可以直接带你进入**代码阶段了** 🚀
```
