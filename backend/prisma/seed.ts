/**
 * 小钉到家 - 种子数据
 * 用于本地快速验证完整闭环:
 *   user (1) -> 创建AI解析 -> 创建订单 -> 派单给 provider(1) -> 接单 -> 完工
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 开始写入种子数据...');

  // 用户
  const user = await prisma.user.upsert({
    where: { phone: '13800000001' },
    update: {},
    create: {
      phone: '13800000001',
      name: '张三',
      city: '北京',
    },
  });

  // 师傅
  const provider = await prisma.provider.upsert({
    where: { phone: '13900000001' },
    update: {},
    create: {
      phone: '13900000001',
      name: '李师傅',
      skillTags: '空调维修,家电维修',
      status: 'online',
      city: '北京',
    },
  });

  const provider2 = await prisma.provider.upsert({
    where: { phone: '13900000002' },
    update: {},
    create: {
      phone: '13900000002',
      name: '王师傅',
      skillTags: '疏通,水管',
      status: 'online',
      city: '北京',
    },
  });

  console.log('✅ 用户:', user.id, user.phone);
  console.log('✅ 师傅:', provider.id, provider.phone, '/', provider2.id, provider2.phone);
  console.log('🎉 种子数据写入完成');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据写入失败:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
