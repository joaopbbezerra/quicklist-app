import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {AddChecklist, Checklist, EditChecklist} from "../models/checklist";
import {catchError, EMPTY, map, merge, Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {StorageService} from "./storage.service";
import {ChecklistItemService} from "../../checklist/data-access/checklist-item.service";
import {connect} from "ngxtension/connect";

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
  private error$ = new Subject<string>();


  private checklistsLoaded$ = this.storageService.loadChecklists().pipe(catchError(error => {
    this.error$.next(error);
    return EMPTY;
  }));

  constructor() {
    //Reducers
    connect(this.state).with(this.add$, (state, checklist) => ({
      checklists: [
        ...state.checklists,
        this.addIdToCheckList(checklist)
      ]
    }))
    /*this.add$.pipe(takeUntilDestroyed()).subscribe(checklist =>
      this.state.update(state => ({
        ...state,
        checklists: [...state.checklists, this.addIdToCheckList(checklist)],
      }))
    )*/

    const nextState$ = merge(
      this.checklistsLoaded$.pipe(
        map(checklists => ({checklists, loaded: true}))
      ),
      this.error$.pipe(
        map(error => ({error}))
      )
    );
    connect(this.state).with(nextState$)
/*    reducer(
      this.checklistsLoaded$, (checklists) => this.state.update(state => ({
        ...state,
        checklists,
        loaded: true,
      })),
      error => this.state.update(state => ({...state, error}))
    )*/
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


