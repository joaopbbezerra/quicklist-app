import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  dialog = inject(Dialog);

  @Input() set isOpen(value: boolean) {
    if (value) {
      //We pass the template to the dialog so it handles dynamically when to display
      //panelClass is just a CSS class to be easier to style the dialog later
      this.dialog.open(this.template, {panelClass: 'dialog-container'});
    } else {
      this.dialog.closeAll();
    }
  }

  //The content child allows us to access the content that is supplied within the component's tag
  //The TemplateRef is the reference to the <ng-template> tag.
  //So whatever we supply inside the tag of the app-modal, will be displayed here as template.
  @ContentChild(TemplateRef, {static: false}) template!: TemplateRef<any>;
}
