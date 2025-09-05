import { TemplateRef } from "@angular/core";

export interface ColumnConfig {
  header: string;
  field: string;
  linkEnable?: boolean;
  link?: string;  // URL or route for the link
  type?: ('edit' | 'delete' | 'view' | string)[];
  cellTemplate?: TemplateRef<any>;   // <-- add this
}