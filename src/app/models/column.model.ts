import { TemplateRef } from "@angular/core";

export interface ColumnConfig {
  header: string;
  field: string;
  linkEnable?: boolean;
  type?: string[];
  cellTemplate?: TemplateRef<any>;   // <-- add this
}