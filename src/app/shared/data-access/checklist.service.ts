import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {AddChecklist, Checklist, EditChecklist} from "../models/checklist";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {StorageService} from "./storage.service";
import {ChecklistItemService} from "../../checklist/data-access/checklist-item.service";

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  storageService = inject(StorageService)
  checklistItemService = inject(ChecklistItemService)

  // State
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  })

  // Selectors
  checklists = computed(() => this.state().checklists)
  loaded = computed(() => this.state().loaded)

  // Sources
  add$ = new Subject<AddChecklist>()
  remove$ = this.checklistItemService.checklistRemoved$;
  edit$ = new Subject<EditChecklist>();
  private checklistsLoaded$ = this.storageService.loadChecklists();


  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe(checklist =>
      this.state.update(state => ({
        ...state,
        checklists: [...state.checklists, this.addIdToCheckList(checklist)],
      }))
    )
    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: checklists =>
        this.state.update(state => ({
          ...state,
          checklists,
          loaded: true,
        })),
      error: err => this.state.update(state => ({...state, error: err}))
      }
    )
    this.remove$.pipe(takeUntilDestroyed()).subscribe(id => this.state.update(state => ({
      ...state,
      checklists: state.checklists.filter(checklist => checklist.id !== id)
      }))
    )
    this.edit$.pipe(takeUntilDestroyed()).subscribe(update => this.state.update(state => ({
      ...state,
      checklists: state.checklists.map(checklist => checklist.id === update.id
      ? {...checklist, title: update.data.title}
      : checklist)
    })))

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists())
      }
    });
  }

  private addIdToCheckList(checkList: AddChecklist) {
    return {
      ...checkList,
      id: this.generateSlug(checkList.title)
    }
  }

  private generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\s+/g, '-')
    const matchingSlugs = this.checklists().find(
      checklist => checklist.id === slug
    )
    if (matchingSlugs) {
      slug = slug + Date.now().toString()
    }
    return slug;
  }
}


