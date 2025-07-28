export interface CommissionAttributes {
    id?: string;
    brokerId: string;
    customerId: string;
    companyId: string;
    numberOfShares: number;
    pricePerShare: number;
    totalAmount?: number;
    commissionRate: number;
    commissionAmount?: number;
    status?: "pending" | "inprogress" | "completed" | "cancelled" | "rejected";
    notes?: string | null;
    processedAt?: Date | null;
    createdBy?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    company?: any
  }
  