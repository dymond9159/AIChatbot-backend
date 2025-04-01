
import { Controller, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send WhatsApp message' })
  async sendMessage(
    @Body() body: { to: string; message: string }
  ) {
    return this.whatsappService.sendMessage(body.to, body.message);
  }
}
