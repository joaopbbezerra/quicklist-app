import {Component, Input} from '@angular/core';
import {Checklist} from "../../../shared/models/checklist";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './checklist-list.component.html',
  styleUrl: './checklist-list.component.scss'
})
export class ChecklistListComponent {
  @Input({required: true}) checklists!: Checklist[]
}
