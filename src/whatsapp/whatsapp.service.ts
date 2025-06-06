import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class WhatsappService {
  constructor(private openaiService: OpenaiService) {}

  async hadleUserMessage(number: string, message: string) {
    const reply = await this.openaiService.generateResponse(message);
    this.sendMessage(number, reply);
  }

  async sendMessage(to: string, message: string) {
    let data = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_API_KRY}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
