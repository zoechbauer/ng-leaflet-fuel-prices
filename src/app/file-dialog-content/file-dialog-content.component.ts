import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from '../model/idialog-data';

@Component({
  selector: 'app-file-dialog-content',
  templateUrl: './file-dialog-content.component.html',
  styleUrls: ['./file-dialog-content.component.scss']
})
export class FileDialogContentComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

}
