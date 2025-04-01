// .env file
OPENAI_API_KEY=your-openai-api-key

// chatbot.module.ts
import { Module } from '@nestjs/common';
import { OpenAI } from 'openai';

@Module({
  providers: [
    {
      provide: 'OpenAI',
      useFactory: () => {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        return openai;
      },
    },
  ],
  exports: ['OpenAI'],
})
export class ChatbotModule {}

// chatbot.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class ChatbotService {
  constructor(@Inject('OpenAI') private openai: OpenAI) {}

  async getPizzaRecommendation(prompt: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful pizza assistant.' },
        { role: 'user', content: prompt },
      ],
    });
    return completion.choices[0].message.content;
  }
}

// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { ChatbotModule } from './chatbot/chatbot.module';


@Module({
  imports: [
    UsersModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}


// app.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatbotService } from './chatbot/chatbot.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private chatbotService: ChatbotService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pizza/:prompt')
  async getPizzaRecommendation(@Param('prompt') prompt: string) {
    return await this.chatbotService.getPizzaRecommendation(prompt);
  }
}

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();


//prisma.service.ts (example - replace with your actual prisma service)
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {}


//users.module.ts (example placeholder)
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}