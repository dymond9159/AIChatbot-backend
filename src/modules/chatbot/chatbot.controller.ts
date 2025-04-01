
import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with the pizza bot' })
  async chat(@Body('message') message: string) {
    const response = await this.chatbotService.chat(message);
    return { response };
  }
}
