import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChecklistItem, RemoveCheckListItem} from "../../../shared/models/checklist-item";

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  imports: [],
  templateUrl: './checklist-item-list.component.html',
  styleUrl: './checklist-item-list.component.scss'
})
export class ChecklistItemListComponent {
  @Input({required: true}) checklistItems!: ChecklistItem[]

  @Output() toggle = new EventEmitter<RemoveCheckListItem>();
  @Output() delete = new EventEmitter<RemoveCheckListItem>();
  @Output() edit = new EventEmitter<ChecklistItem>();
}
