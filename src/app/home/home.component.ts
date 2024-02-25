import {Component, effect, inject, signal} from '@angular/core';
import {ModalComponent} from "../shared/ui/modal/modal.component";
import {Checklist} from "../shared/models/checklist";
import {FormBuilder} from "@angular/forms";
import {FormModalComponent} from "../shared/ui/form-modal/form-modal.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ModalComponent,
    FormModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  })

  constructor() {
    effect(() => {
      const checklist = this.checklistBeingEdited();
      if (!checklist) {
        this.checklistForm.reset();
      }
    })
  }
}
