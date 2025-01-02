import { CreateInvoiceDto } from '../dto/createInvoice.dto';
import { UpdateInvoiceDto } from '../dto/updateInvoice.dto,';

export interface IInvoiceCalculationResult {
  requiredTotalHoursForThisMonth: number;
  basicPayPerHourForThisMonth: number;
  overTimePayPerHourForThisMonth: number;
  publiceLeavesPayPerHourForThisMonth: number;
  overTimeHoursForThisMonth: number;
  overTimePayForThisMonth: number;
  totalPubliceLeavesPayForThisMonth: number;
  totalSalaryForThisMonth: number;
  paidLeavesForThisMonth: number;
  basicPayForThisMonth: number;
  committedHoursForThisMonth: number;
  workingHoursForThisMonth: number;
  publiceLeavesForThisMonth: number;
  publiceLeaveWorkingHourForThisMonth: number;
  totalBasicSalaryForThisMonth: number;
  basicPay: number;
}

const safeValue = (value: number): number =>
  isNaN(value) || !isFinite(value) ? 0 : value;

export const calculateSalaryDetails = (
  existUser: any,
  dto: CreateInvoiceDto | UpdateInvoiceDto,
): IInvoiceCalculationResult => {
  const {
    workingHoursForThisMonth,
    publiceLeavesForThisMonth=0,
    publiceLeaveWorkingHourForThisMonth=0,
    
  } = dto;
  console.log(dto, 'dto');
  const { basicPayForThisMonth, committedHoursForThisMonth } = existUser;

  const oneDayHours =
    committedHoursForThisMonth > 0 ? committedHoursForThisMonth / 20 : 0;
  const publicLeavesInHours =
    publiceLeavesForThisMonth > 0 ? publiceLeavesForThisMonth * oneDayHours : 0;
  const requiredTotalHoursForThisMonth = Math.max(
    0,

    publicLeavesInHours > 0
      ? committedHoursForThisMonth - publicLeavesInHours
      : committedHoursForThisMonth,
  );

  const basicPayPerHourForThisMonth =
    requiredTotalHoursForThisMonth > 0
      ? basicPayForThisMonth / requiredTotalHoursForThisMonth
      : 0;
  const overTimePayPerHourForThisMonth = basicPayPerHourForThisMonth * 1.5;

  const overTimeHoursForThisMonth =
    workingHoursForThisMonth > requiredTotalHoursForThisMonth
      ? workingHoursForThisMonth -
        requiredTotalHoursForThisMonth -
        publiceLeaveWorkingHourForThisMonth
      : 0;
      console.log(overTimeHoursForThisMonth, 'overTimeHoursForThisMonth');

  const basicPayThisMonth = Math.min(
    basicPayForThisMonth,
    basicPayPerHourForThisMonth * workingHoursForThisMonth,
  );
  const overTimePayThisMonth =
    overTimePayPerHourForThisMonth * overTimeHoursForThisMonth;

  const publicLeavesPayPerHourForThisMonth = basicPayPerHourForThisMonth;
  const totalPubliceLeavesPayForThisMonth =
    publicLeavesPayPerHourForThisMonth * publicLeavesInHours;

  const totalSalaryForThisMonth = Math.ceil(
    basicPayThisMonth + overTimePayThisMonth,
  );
  const basicPay =
    totalSalaryForThisMonth > basicPayForThisMonth
      ? basicPayForThisMonth
      : totalSalaryForThisMonth;

  const paidLeavesForThisMonth = publiceLeavesForThisMonth;

  console.log(overTimePayThisMonth, 'overtime');
console.log(basicPayThisMonth, 'basicPayThisMonth');
// console.log(publiceLeaveWorkingHourForThisMonth, 'publiceLeaveWorkingHourForThisMonth');


  // Build the result object
  const result: IInvoiceCalculationResult = {
    requiredTotalHoursForThisMonth: Math.ceil(
      safeValue(requiredTotalHoursForThisMonth),
    ),
    basicPayPerHourForThisMonth: Math.ceil(
      safeValue(basicPayPerHourForThisMonth),
    ),
    overTimePayPerHourForThisMonth: Math.ceil(
      safeValue(overTimePayPerHourForThisMonth),
    ),
    publiceLeavesPayPerHourForThisMonth: Math.ceil(
      safeValue(publicLeavesPayPerHourForThisMonth),
    ),
    overTimeHoursForThisMonth: Math.ceil(safeValue(overTimeHoursForThisMonth)),
    overTimePayForThisMonth: Math.ceil(safeValue(overTimePayThisMonth)),
    totalPubliceLeavesPayForThisMonth: Math.ceil(
      safeValue(totalPubliceLeavesPayForThisMonth),
    ),
    totalSalaryForThisMonth: Math.ceil(safeValue(totalSalaryForThisMonth)),
    paidLeavesForThisMonth: Math.ceil(safeValue(paidLeavesForThisMonth)),
    basicPayForThisMonth: Math.ceil(safeValue(basicPayForThisMonth)),
    committedHoursForThisMonth: Math.ceil(
      safeValue(committedHoursForThisMonth),
    ),
    workingHoursForThisMonth: Math.ceil(safeValue(workingHoursForThisMonth)),
    publiceLeavesForThisMonth: Math.ceil(safeValue(publiceLeavesForThisMonth)),
    publiceLeaveWorkingHourForThisMonth: Math.ceil(
      safeValue(publiceLeaveWorkingHourForThisMonth),
    ),
    totalBasicSalaryForThisMonth: Math.ceil(safeValue(basicPayThisMonth)),
    basicPay: Math.ceil(safeValue(basicPay || 0)),
  };

  return result;
};
