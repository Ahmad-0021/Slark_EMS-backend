import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { Response, Request } from 'express';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto,';
import { AdminGuard } from 'src/common/guard/admin.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.invoiceService.createInvoice(req, res, dto);
  }
  @Get()
  async getAllInvoices(
    @Query() query: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req['user'];

    return await this.invoiceService.getAllInvoices(req, res, query);
  }
  @Get('get-single')
  async getSingleInvoice(
    @Query() query: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.invoiceService.getSingleInvoice(query, res, req);
  }
  @Delete()
  async DeleteInvoice(
    @Query() query: any,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.invoiceService.deleteInvoice(query, res, req);
  }
  @Put()
  async updateInvoice(
    @Query() query: any,
    @Res() res: Response,
    @Req() req: Request,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return await this.invoiceService.updateInvoice(query, res, req, dto);
  }
}
