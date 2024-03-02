import {Component, computed, effect, inject, signal} from '@angular/core';
import {ChecklistService} from "../shared/data-access/checklist.service";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {ChecklistHeaderComponent} from "./ui/checklist-header/checklist-header.component";
import {ChecklistItemService} from "./data-access/checklist-item.service";
import {FormBuilder} from "@angular/forms";
import {ChecklistItem} from "../shared/models/checklist-item";
import {ModalComponent} from "../shared/ui/modal/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal/form-modal.component";
import {ChecklistItemListComponent} from "./ui/checklist-item-list/checklist-item-list.component";

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [
    ChecklistHeaderComponent,
    ModalComponent,
    FormModalComponent,
    ChecklistItemListComponent
  ],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss'
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null)

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService.checklists().find(checklist =>
      checklist.id === this.params()?.get('id')
    )
  )
  items = computed(() =>
    this.checklistItemService.checklistItems().filter(item =>
      item.checklistId === this.params()?.get('id')
    )
  )

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  })

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();
      if (!checklistItem) {
        this.checklistItemForm.reset();
      }
    })
  }
}
