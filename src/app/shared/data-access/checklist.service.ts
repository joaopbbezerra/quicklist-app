import {computed, Injectable, signal} from '@angular/core';
import {AddChecklist, Checklist} from "../models/checklist";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface ChecklistsState {
  checklists: Checklist[];
}
@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  // State
  private state = signal<ChecklistsState>({
    checklists: [],
  })

  // Selectors
  checklists = computed(() => this.state().checklists)

  // Sources
  add$ = new Subject<AddChecklist>()

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe(checklist =>
    this.state.update(state => ({
      ...state,
      checklists: [...state.checklists, this.addIdToCheckList(checklist)],
    }))
    )
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


