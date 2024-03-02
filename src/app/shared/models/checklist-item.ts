import {RemoveChecklist} from "./checklist";

export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
}

export interface AddChecklistItem {
  item: Omit<ChecklistItem, 'id' | 'checklistId' | 'checked'>;
  checklistId: RemoveChecklist;
}

export interface EditChecklistItem {
  id: ChecklistItem['id'];
  data: AddChecklistItem['item']
}

export type RemoveCheckListItem = ChecklistItem['id']
