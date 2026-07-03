import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiParseResult } from './ai-result.interface';
import { Public } from '../../common/decorators/public.decorator';

class ParseDto {
  text!: string;
}

/**
 * AI 模块
 * - 只负责解析用户描述, 不做业务决策
 * - POST /api/ai/parse
 */
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public()
  @Post('parse')
  parse(@Body() body: ParseDto): AiParseResult {
    return this.aiService.parse(body.text);
  }
}
