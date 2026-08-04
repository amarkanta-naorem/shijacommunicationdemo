// ---------------------------------------------------------------------------
// Product Entity — Shija Communication Operations Suite
// ---------------------------------------------------------------------------

// ===================== Warranty =====================

export interface WarrantyTerms {
  durationMonths: number;
  durationYears: number;
  startDate: string;
  endDate: string;
  coverage: WarrantyCoverage;
  provider: string;
  claimProcess: string;
  isExtended: boolean;
  extendedUntil?: string;
}

export interface WarrantyCoverage {
  parts: boolean;
  labour: boolean;
  consumables: boolean;
  onSiteService: boolean;
  replacementWithinDays: number;
  exclusions: string[];
}

// ===================== GST =====================

export interface GSTDetails {
  hsnCode: string;
  sgstRate: number;
  cgstRate: number;
  igstRate: number;
  totalGstRate: number;
  applicableGstType: 'CGST+SGST' | 'IGST' | 'Exempt' | 'Nil';
  gstAmount: number;
  taxableAmount: number;
  totalAmountWithGst: number;
}

// ===================== Pricing Structure =====================

export interface CreditTerms {
  creditPeriodDays: number;
  dueDate: string;
  creditLimit: number;
  interestRatePerMonth: number;
  latePaymentPenalty: number;
  paymentMethod: 'Net Banking' | 'Cheque' | 'UPI' | 'Credit Card' | 'Other';
}

export interface ImmediatePayment {
  paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Credit Card' | 'Debit Card';
  requiresAdvance: boolean;
  advancePercentage: number;
  balanceDueOnDelivery: boolean;
}

export interface PricingStructure {
  basePrice: number;
  currency: string;
  pricingModel: 'credit' | 'immediate' | 'hybrid';
  subjectToCreditTerms: boolean;
  requiresImmediatePayment: boolean;
  creditTerms?: CreditTerms;
  immediatePayment?: ImmediatePayment;
  discountPercentage: number;
  discountedPrice: number;
  quantityBreaks: QuantityBreak[];
}

export interface QuantityBreak {
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  discountPercentage: number;
}

// ===================== Payout Date =====================

export interface PayoutSchedule {
  payoutDate: string;
  payoutType: 'full' | 'partial' | 'installment';
  amount: number;
  status: 'pending' | 'processed' | 'overdue' | 'cancelled';
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
}

// ===================== Fuel Wastage =====================

export interface FuelWastageRecord {
  id: string;
  date: string;
  fuelType: 'Diesel' | 'S/K';
  quantityLitres: number;
  lossQuantity: number;
  wastageReason: WastageReason;
  reportedBy: string;
  approvedBy: string;
  isApproved: boolean;
  remarks: string;
}

export type WastageReason =
  | 'Spillage'
  | 'Evaporation'
  | 'Meter Error'
  | 'Unauthorized Use'
  | 'Leakage'
  | 'Contamination'
  | 'Overfill'
  | 'Other';

export interface FuelWastageCalculation {
  totalFuelReceived: number;
  totalFuelIssued: number;
  totalWastage: number;
  wastagePercentage: number;
  acceptableLossThreshold: number;
  isWithinThreshold: boolean;
  lossValue: number;
  records: FuelWastageRecord[];
}

// ===================== Hardware Damage =====================

export interface HardwareDamage {
  id: string;
  productId: string;
  productName: string;
  damageDate: string;
  reportedBy: string;
  damageType: DamageType;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  description: string;
  affectedComponents: string[];
  estimatedRepairCost: number;
  actualRepairCost: number;
  repairStatus: 'Pending' | 'In Progress' | 'Completed' | 'Write-Off';
  warrantyClaimed: boolean;
  warrantyCovered: boolean;
  photos: string[];
  resolution: string;
  resolvedDate: string;
}

export type DamageType =
  | 'Physical Impact'
  | 'Corrosion'
  | 'Electrical Failure'
  | 'Overheating'
  | 'Wear and Tear'
  | 'Manufacturing Defect'
  | 'Accidental Damage'
  | 'Environmental'
  | 'Unknown';

// ===================== Product Entity =====================

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  unit: 'Pcs' | 'Litre' | 'Set' | 'Kg' | 'Meter';
  location: string;

  // Core inventory fields (existing)
  currentStock: number;
  minStock: number;
  unitPrice: number;

  // 1. Warranty
  warranty: WarrantyTerms;

  // 2. GST
  gst: GSTDetails;

  // 3. Pricing Structure
  pricing: PricingStructure;

  // 4. Payout Date
  payoutSchedule: PayoutSchedule;

  // 5. Fuel Wastage (relevant for fuel-type products)
  fuelWastage?: FuelWastageCalculation;

  // 6. Hardware Damage (relevant for hardware/equipment products)
  hardwareDamage?: HardwareDamage[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}