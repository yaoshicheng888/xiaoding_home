import React from "react"
import {
  Button,
  Input,
  Textarea,
  Card,
  Avatar,
  Tag,
  Badge,
  Divider,
  Loading,
  Skeleton,
  Empty,
  Image,
} from "../index"

export default function DevApp() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">@xiaoding/ui 组件库预览</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Button</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="text">Text</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button size="large" variant="primary">Large</Button>
          <Button size="small" variant="primary">Small</Button>
          <Button block variant="primary">Block Button</Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Input</h2>
        <div className="space-y-4 max-w-md">
          <Input placeholder="请输入" />
          <Input label="用户名" placeholder="请输入用户名" />
          <Input status="error" helperText="输入有误" placeholder="错误状态" />
          <Input status="success" helperText="校验通过" placeholder="成功状态" />
          <Input type="password" placeholder="请输入密码" />
          <Input disabled placeholder="禁用状态" />
          <Input prefix="¥" suffix="元" placeholder="金额" />
          <Input clearable placeholder="可清除" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Textarea</h2>
        <div className="max-w-md space-y-4">
          <Textarea placeholder="请输入描述" />
          <Textarea label="备注" status="error" helperText="不能为空" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Card header="卡片标题" footer="底部操作">
            卡片内容区域
          </Card>
          <Card shadowLevel="md" hoverable bordered>
            带阴影、悬停、边框的卡片
          </Card>
          <Card clickable onClick={() => console.log("clicked")}>
            可点击卡片
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Avatar</h2>
        <div className="flex items-center gap-4">
          <Avatar text="张三" size="small" status="online" />
          <Avatar text="李四" size="medium" status="busy" />
          <Avatar text="王五" size="large" status="away" />
          <Avatar text="赵六" size="xlarge" status="offline" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="头像" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Tag & Badge</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Tag variant="primary">Primary</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="danger">Danger</Tag>
          <Tag variant="info">Info</Tag>
          <Badge count={5} />
          <Badge count={120} />
          <Badge dot status="success" />
          <Badge status="warning">Badge</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Divider</h2>
        <div className="max-w-md">
          <Divider />
          <Divider text="分隔文字" />
          <Divider dashed />
          <div className="flex items-center h-8">
            <span>左侧</span>
            <Divider direction="vertical" />
            <span>右侧</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Loading</h2>
        <div className="flex flex-wrap items-center gap-8">
          <Loading type="circle" size="small" />
          <Loading type="circle" size="medium" text="加载中" />
          <Loading type="dots" size="large" />
          <Loading type="spinner" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Skeleton</h2>
        <div className="space-y-2 max-w-md">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rounded" width={200} height={120} />
          <Skeleton variant="circular" width={48} height={48} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Empty</h2>
        <Empty description="暂时没有数据" />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Image</h2>
        <div className="flex gap-4">
          <Image
            src="https://picsum.photos/200/200"
            width={120}
            height={120}
            shape="rounded"
          />
          <Image
            src="https://picsum.photos/200/200"
            width={80}
            height={80}
            shape="circle"
          />
        </div>
      </section>
    </div>
  )
}
