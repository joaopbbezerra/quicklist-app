import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem, EditChecklistItem,
  RemoveCheckListItem
} from "../../shared/models/checklist-item";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {RemoveChecklist} from "../../shared/models/checklist";
import {StorageService} from "../../shared/data-access/storage.service";

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
  storageService = inject(StorageService);
  // State
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  })

  // Selectors
  checklistItems = computed(() => this.state().checklistItems)
  loaded = computed(() => this.state().loaded)

  // Sources
  add$ = new Subject<AddChecklistItem>();

  toggle$ = new Subject<RemoveCheckListItem>();

  reset$ = new Subject<RemoveChecklist>();

  edit$ = new Subject<EditChecklistItem>();

  remove$ = new Subject<RemoveCheckListItem>();

  checklistRemoved$ = new Subject<RemoveChecklist>();

  private checklistItemsLoaded$ = this.storageService.loadChecklistItems();


    constructor() {
      //Reducers list
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
      this.checklistItemsLoaded$.pipe(takeUntilDestroyed()).subscribe({
        next: checklistItems => this.state.update(state => ({
          ...state,
          checklistItems,
          loaded: true,
        })),
        error: err => this.state.update(state => ({
          ...state,
          error: err,
        }))
      })
      this.remove$.pipe(takeUntilDestroyed()).subscribe((id) =>
        this.state.update((state) => ({
          ...state,
          checklistItems: state.checklistItems.filter((item) => item.id !== id),
        }))
      );
      this.edit$.pipe(takeUntilDestroyed()).subscribe(
        update => this.state.update(state => ({
          ...state,
          checklistItems: state.checklistItems.map(eachItem => eachItem.id === update.id
            ? {...eachItem, title: update.data.title}
            : eachItem
          )
        }))
      )
      this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe(checklistId =>
      this.state.update(state => ({
        ...state,
        checklistItems: state.checklistItems.filter(item => item.checklistId !== checklistId)
      })))

      effect(() => {
        if (this.loaded()) {
          this.storageService.saveChecklistItems(this.checklistItems())
        }
      })
  }
}
