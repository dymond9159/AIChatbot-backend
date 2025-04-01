
import { Module } from '@nestjs/common';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [ChatbotModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService, PrismaService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
