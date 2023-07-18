import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { FileDialogContentComponent } from '../file-dialog-content/file-dialog-content.component';
import { IDialogData } from '../model/idialog-data';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  public showTodosInDialog(): void {
    const url = 'assets/todos.txt';
    const title = 'TODO-Liste';
    this.readAndDisplayData(url, title, false);
  }

  public showHelpInDialog(): void {
    const url = 'assets/help.txt';
    const title = 'Hilfe und Erklärungen';
    this.readAndDisplayData(url, title, true);
  }

  private readTextFile(path: string): Observable<string> {
    const options = {
      responseType: 'text' as const
    };
    return this.http.get(path, options);
  }

  private readAndDisplayData(url: string, title: string, isHtmlText: boolean): void {
    this.readTextFile(url).subscribe(data => {
      const dlgData: IDialogData = {
        title: title,
        fileContent: data,
        isHtmlText: isHtmlText
      }
      let dialogRef = this.dialog.open(FileDialogContentComponent, {
        data: dlgData
      });
    })
  }

}
