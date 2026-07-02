/**
 * AI 解析结果
 * AI 模块只负责解析, 不参与业务决策
 */
export interface AiParseResult {
  category: string; // 服务类目: 空调维修/疏通/水电维修/家电维修/通用
  problem: string; // 具体问题(描述性)
  urgency: 'low' | 'medium' | 'high'; // 紧急度
  tags: string[]; // 关键词标签
}
