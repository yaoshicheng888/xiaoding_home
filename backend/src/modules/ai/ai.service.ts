import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiParseResult } from './ai-result.interface';

interface Rule {
  keywords: string[];
  category: string;
  problem: string;
  urgency: 'low' | 'medium' | 'high';
  tags: string[];
}

/**
 * AI 模块 - MVP 实现说明:
 * 当前 AI_PROVIDER=mock, 使用本地关键词规则解析, 保证无需任何外部 API key 即可跑通闭环.
 * 后续可在此处替换为真实 LLM(OpenAI/通义/智谱等)调用, 仅需保持 parse() 返回结构不变.
 *
 * 输入 -> 输出结构化 JSON: { category, problem, urgency, tags }
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger('AiService');

  // 简单规则库 - 可按需扩充
  private readonly rules: Rule[] = [
    {
      keywords: ['空调', '不制冷', '不冷', '漏水', '结冰', '清洗'],
      category: '空调维修',
      problem: '空调故障/维护',
      urgency: 'medium',
      tags: ['空调'],
    },
    {
      keywords: ['马桶', '堵了', '下水道', '疏通', '返水', '堵塞'],
      category: '疏通',
      problem: '管道堵塞',
      urgency: 'high',
      tags: ['马桶', '管道'],
    },
    {
      keywords: ['水管', '漏水', '爆管', '龙头', '阀门', '水龙头'],
      category: '水管维修',
      problem: '水管/龙头故障',
      urgency: 'high',
      tags: ['水管'],
    },
    {
      keywords: ['电', '跳闸', '插座', '开关', '短路', '没电'],
      category: '电路维修',
      problem: '电路故障',
      urgency: 'high',
      tags: ['电路'],
    },
    {
      keywords: ['冰箱', '洗衣机', '电视', '热水器', '油烟机', '家电'],
      category: '家电维修',
      problem: '家电故障',
      urgency: 'medium',
      tags: ['家电'],
    },
    {
      keywords: ['开锁', '换锁', '锁芯'],
      category: '开锁',
      problem: '锁具问题',
      urgency: 'high',
      tags: ['开锁'],
    },
  ];

  constructor(private readonly config: ConfigService) {}

  /**
   * 解析用户一句话描述
   * @param text 原始描述
   * @returns 结构化解析结果
   */
  parse(text: string): AiParseResult {
    const provider = this.config.get<string>('AI_PROVIDER') ?? 'mock';
    this.logger.log(`[AI:${provider}] 解析输入: "${text}"`);

    const safeText = (text ?? '').trim();
    if (!safeText) {
      return {
        category: '通用',
        problem: '未识别具体问题',
        urgency: 'low',
        tags: [],
      };
    }

    let matched: Rule | undefined;
    let bestScore = 0;

    for (const rule of this.rules) {
      const score = rule.keywords.reduce(
        (acc, kw) => acc + (safeText.includes(kw) ? 1 : 0),
        0,
      );
      if (score > bestScore) {
        bestScore = score;
        matched = rule;
      }
    }

    if (!matched) {
      return {
        category: '通用',
        problem: safeText,
        urgency: 'low',
        tags: this.extractTags(safeText),
      };
    }

    return {
      category: matched.category,
      problem: matched.problem,
      urgency: matched.urgency,
      tags: matched.tags,
    };
  }

  private extractTags(text: string): string[] {
    // 兜底: 从文本中抽取长度>=2的关键词
    return [text.slice(0, 6)];
  }
}
