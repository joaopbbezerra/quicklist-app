import {computed, Injectable, signal} from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  RemoveCheckListItem
} from "../../shared/models/checklist-item";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {RemoveChecklist} from "../../shared/models/checklist";

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
  // State
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
  })

  // Selectors
  checklistItems = computed(() => this.state().checklistItems)

  // Sources
  add$ = new Subject<AddChecklistItem>();

  toggle$ = new Subject<RemoveCheckListItem>();

  reset$ = new Subject<RemoveChecklist>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe(checklistItem => this.state.update(
      state => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          }
        ]
      })
    ))
    this.toggle$.pipe(takeUntilDestroyed()).subscribe(checklistItemId => this.state.update(
      state => ({
        ...state,
        checklistItems: state.checklistItems.map(item =>
          item.id === checklistItemId
            ? {...item, checked: !item.checked}
            : item
        )
      })
    ))
    this.reset$.pipe(takeUntilDestroyed()).subscribe(
      checklistId => this.state.update(state => ({
        ...state,
        checklistItems: state.checklistItems.map(item => item.checklistId === checklistId
          ? {...item, checked: false}
          : item
        )
      }))
    )
  }
}
