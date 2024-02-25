import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe
  ],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.scss'
})
export class FormModalComponent {
  @Input({required: true}) formGroup!: FormGroup;
  @Input({required: true}) title!: string;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
