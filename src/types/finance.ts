export interface KPIProject {
  id: number;
  name: string;
  nr: string;
  start_date: string;
  state: string;
  end_date: string | null | undefined;
  estimated_hours: number;
  spentHours: number;
  spentMinutes: number;
  overallProgress: number;
  targetProgress: number;
  actual_bruto_margin: number;
  actual_bruto_margin_percentage: number | null;
  status_margin: "green" | "red" | null;
  status_progress: "green" | "red";
  contact?: {
    id?: number;
    contactId?: number;
    salutation?: number;
    firstname: string;
    lastname: string;
    email: string;
    salutation_id?: number;
    name_1?: string;
    name_2?: string;
    mail?: string;
  };
  quote?: {
    id: number;
    documentNr?: string;
    document_nr?: string;
    title: string;
    totalGross?: number;
    totalNet?: number;
    totalTaxes?: number;
    total_gross?: string;
    total_net?: string;
    total_taxes?: string;
    total?: string;
  };
}

export interface KPITableRow {
  id: number;
  client: string;
  total: number | null;
  startDate: string;
  endDate: string;
  estimatedHours: number;
  spentHours: number;
}
