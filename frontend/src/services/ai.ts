import request from '../utils/request';

export interface AiParseResult {
  category: string;
  problem: string;
  urgency: string;
  tags: string[];
}

export const parseAI = (text: string) => {
  return request<AiParseResult>('/ai/parse', {
    method: 'POST',
    data: { text },
  });
};

export const createRequest = (text: string) => {
  return request<{ requestId: number; aiResult: AiParseResult }>('/request/create', {
    method: 'POST',
    data: { text },
  });
};
