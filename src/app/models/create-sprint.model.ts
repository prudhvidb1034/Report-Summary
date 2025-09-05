
export interface Sprint {
    sprintName: string;
    fromDate: Date;
    toDate: Date;
    isEnabled?: boolean;
    sprintId?: number | string;
    sprintNumber?: number; 
}

export interface SprintEvent {
  type: string;
  value: string;
  item: Sprint;
}

export interface SprintNavigateEvent {
  type: string;
  item: Sprint;
  columnName: string;
}