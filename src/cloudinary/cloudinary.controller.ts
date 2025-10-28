import { Controller, Get } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('mi-boda')
  async getMiBodaResources() {
    return this.cloudinaryService.getAllFromMiBoda();
  }
}
