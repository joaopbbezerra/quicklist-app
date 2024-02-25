import {Component, signal} from '@angular/core';
import {ModalComponent} from "../shared/ui/modal/modal.component";
import {Checklist} from "../shared/models/checklist";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);
}
