export interface RowActionEvent<T> {
  type: 'create' | 'edit' | 'delete' | 'view';  // whatever actions you support
  item: T;  // the row object
}


