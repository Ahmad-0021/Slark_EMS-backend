import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './entities/invoice.schema';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { Response, Request, query } from 'express';
import { transformArray, transformInvoice } from 'src/common/transform.object';
import { calculateSalaryDetails } from './utils/calculate';
import { User } from '../user/entities/user.schema';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto,';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createInvoice(req: Request, res: Response, dto: CreateInvoiceDto) {
    try {
      const user = req['user'];

      if (!user?.id || !Types.ObjectId.isValid(user.id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid user ID',
          success: false,
        });
      }
      const existUser = await this.userModel.findById(user.id);
      if (!existUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
          success: false,
        });
      }

      // Pre-compute dates
      const currentDate = new Date();
      const previousMonthDate = new Date(
        currentDate.setMonth(currentDate.getMonth() - 1),
      );
      const previousMonth = new Intl.DateTimeFormat('en-US', {
        month: 'long',
      }).format(previousMonthDate);

      // Check if invoice already exists
      const checkInvoice = await this.invoiceModel.findOne({
        user: user.id,
        month: previousMonth,
      });
      if (checkInvoice) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invoice already exists',
          success: false,
        });
      }

      const salaryDetails = calculateSalaryDetails(existUser, dto);
      // Create Invoice
      const invoice = await this.invoiceModel.create({
        ...salaryDetails,
        basicPay: salaryDetails.basicPay,
        requiredTotalHoursForThisMonth:
          salaryDetails.requiredTotalHoursForThisMonth,
        user: user?.id,
      });

      await this.userModel.findByIdAndUpdate(user?.id, {
        $push: { invoices: invoice._id },
      });
      // Transform result
      const transformedInvoice = transformInvoice(invoice);

      return res.status(HttpStatus.CREATED).json({
        message: 'Invoice created successfully',
        success: true,
        data: { Invoice: transformedInvoice },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async getAllInvoices(req: Request, res: Response, query: any) {
    try {
      const user = req['user'];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid parameters page and limit for pagination',
          success: false,
        });
      }
      const skip = (page - 1) * limit;
      const totalCount = await this.invoiceModel.countDocuments({
        user: user.id,
      });
      const invoice = await this.invoiceModel
        .find({ user: user.id })
        .select('-__v -password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (!invoice || invoice.length === 0) {
        return res.status(HttpStatus.OK).json({
          message: 'No invoice record found',
          success: true,
          data: [],
        });
      }
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      const paginationInfo = {
        currentPage: page,
        totalPages,
        totalRecords: totalCount,
        hasNextPage,
        hasPrevPage,
      };
      const updatedInvoice = transformArray(invoice);
      return res.status(HttpStatus.OK).json({
        message: 'invoice records retrived successfully',
        success: true,
        invoice: updatedInvoice,
        pagination: paginationInfo,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async getSingleInvoice(query: any, res: Response, req: Request) {
    try {
      const slug = query.slug as string;
      const user = req['user'];

      const invoice = await this.invoiceModel.findOne({
        user: user.id,
        slug: slug,
      });
      if (!invoice) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'invoice not found',
          success: false,
        });
      }
      const updateInvoice = transformInvoice(invoice);
      return res.status(HttpStatus.OK).json({
        message: 'Invoice retrived successfully',
        success: true,
        data: { invoice: updateInvoice },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async deleteInvoice(query: any, res: Response, req: Request) {
    try {
      const user = req['user'];
      const slug = query.slug as string;
      if (!slug) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Slug is required',
          success: false,
        });
      }

      const invoice = await this.invoiceModel.findOne({
        user: user.id,
        slug: slug,
      });
      if (!invoice) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Invoice not found',
          success: false,
        });
      }
      await invoice.deleteOne();
      const updatedInvoice = transformInvoice(invoice);

      return res.status(HttpStatus.OK).json({
        message: 'Invoice deleted successfully',
        success: false,
        data: { invoice: updatedInvoice },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async updateInoice(
    query: any,
    res: Response,
    req: Request,
    dto: UpdateInvoiceDto,
  ) {
    try {
      const slug = query.slug as string;
      const user = req['user'];

      if (!user?.id || !Types.ObjectId.isValid(user.id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid user ID',
          success: false,
        });
      }
      const existUser = await this.userModel.findById(user.id);
      if (!existUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
          success: false,
        });
      }
      const calculatedSalary = calculateSalaryDetails(existUser, dto);
      const Invoice = await this.invoiceModel.findOneAndUpdate(
        { slug: slug },
        { ...calculatedSalary },
        { new: true },
      );
      if (!Invoice) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Invoice not found',
          success: false,
        });
      }
      await this.userModel.findByIdAndUpdate(user?.id, {
        $push: { invoices: Invoice._id },
      });

      const updatedInvoice = transformInvoice(Invoice);
      return res.status(HttpStatus.OK).json({
        message: 'Invoiced updated successfully',
        success: true,
        invoice: updatedInvoice,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
}
