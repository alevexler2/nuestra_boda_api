import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventSettingsService } from './event-settings.service';
import { CreateEventSettingsDto } from './dto/create-event-setting.dto';
import { EventSettings } from './entities/event-setting.entity';

@ApiTags('Event Settings')
@Controller('event-settings')
export class EventSettingsController {
  constructor(private readonly service: EventSettingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear evento',
    description: 'Crea un nuevo evento con su configuración de tema y detalles',
  })
  @ApiResponse({
    status: 201,
    description: 'Evento creado exitosamente',
    type: EventSettings,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async create(
    @Body() createDto: CreateEventSettingsDto,
  ): Promise<EventSettings> {
    return this.service.create(createDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener evento por ID',
    description: 'Obtiene la configuración de un evento específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del evento',
  })
  @ApiResponse({
    status: 200,
    description: 'Evento encontrado',
    type: EventSettings,
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
  })
  async findOneById(@Param('id') id: string): Promise<EventSettings | null> {
    return this.service.findOneById(id);
  }
}
