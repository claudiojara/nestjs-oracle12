import { Controller, Get, Query } from '@nestjs/common';
import { DocumentoService } from './services/documento.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
            private readonly documentoService: DocumentoService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('obtener-cod-docum-maestro')
  async obtenerCodDocumMaestro(@Query('cod_docum_banco') codDocumBanco: string): Promise<any> {
    return this.documentoService.obtenerCodDocumMaestro(codDocumBanco);
  }
}
