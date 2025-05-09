
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  private openai: OpenAI;
  private systemInstructions: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.systemInstructions = this.configService.get<string>('PIZZA_BOT_INSTRUCTIONS');
  }

  async chat(userMessage: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: this.systemInstructions },
          { role: 'user', content: userMessage }
        ],
        model: 'gpt-3.5-turbo',
      });

      const response = completion.choices[0].message.content;

      // Store the message and response
      await this.prisma.chatMessage.create({
        data: {
          message: userMessage,
          response: response,
        },
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to get response from OpenAI: ${error.message}`);
    }
  }

  async getChatHistory() {
    return this.prisma.chatMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
