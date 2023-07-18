import { Component, EventEmitter, Output } from '@angular/core';

import { FileReaderService } from '../services/file-reader.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private fileReader: FileReaderService) {}

  onMenuClicked () {
    this.toggleSidenav.emit();
  }

  showTodos() {
    this.fileReader.showTodosInDialog();
  }

  showHelp() {
    this.fileReader.showHelpInDialog();
  }

}
