
import { Injectable } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';

@Injectable()
export class WhatsAppService {
  private client: Client;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private chatbotService: ChatbotService
  ) {
    this.client = new Client({
      authStrategy: 'local',
      puppeteer: {
        args: ['--no-sandbox']
      }
    });

    this.initializeWhatsApp();
  }

  private async initializeWhatsApp() {
    this.client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
    });

    this.client.on('ready', () => {
      console.log('WhatsApp Client is ready!');
    });

    this.client.on('message', async (msg) => {
      await this.handleIncomingMessage(msg);
    });

    await this.client.initialize();
  }

  private async handleIncomingMessage(msg: any) {
    try {
      const chat = await msg.getChat();
      const response = await this.chatbotService.chat(msg.body);
      await chat.sendMessage(response);
      
      // Store the conversation in database
      await this.prisma.chatMessage.create({
        data: {
          message: msg.body,
          response: response,
          platform: 'whatsapp',
          phoneNumber: msg.from
        }
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async sendMessage(to: string, message: string) {
    try {
      const chat = await this.client.getChatById(to);
      await chat.sendMessage(message);
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }
}
