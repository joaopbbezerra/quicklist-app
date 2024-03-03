import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable, of} from "rxjs";
import {Checklist} from "../models/checklist";
import {ChecklistItem} from "../models/checklist-item";

export const LOCAL_STORAGE = new InjectionToken<Storage>('window local storage object', {
  providedIn: 'root',
  factory: () => {
    return inject(PLATFORM_ID) === 'browser'
      ? window.localStorage
      : ({} as Storage)
  }
})

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage = inject(LOCAL_STORAGE)

  loadChecklists(): Observable<Checklist[]> {
    const checklists = this.storage.getItem('checklists')
    return of(checklists ? (JSON.parse(checklists) as Checklist[]): [])
  }

  loadChecklistItems(): Observable<ChecklistItem[]> {
    const checklistItems = this.storage.getItem('checklistItems')
    return of(checklistItems? (JSON.parse(checklistItems) as ChecklistItem[]): [])
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists))
  }

  saveChecklistItems(checklistItems: ChecklistItem[]){
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems))
  }
}
