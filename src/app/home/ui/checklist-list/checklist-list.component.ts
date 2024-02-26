import {Component, Input} from '@angular/core';
import {Checklist} from "../../../shared/models/checklist";

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [],
  templateUrl: './checklist-list.component.html',
  styleUrl: './checklist-list.component.scss'
})
export class ChecklistListComponent {
  @Input({required: true}) checklists!: Checklist[]
}
