import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { FileDialogContentComponent } from '../file-dialog-content/file-dialog-content.component';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  public showTodosInDialog(): void {
    this.readTodos().subscribe(data => {
      const dialogRef = this.dialog.open(FileDialogContentComponent, {
        data: {fileContent: data}
      })
    })
  }

  public readTodos(): Observable<string> {
    const url = 'assets/todos.txt';
    return this.readTextFile(url);
  }

  public readTextFile(path: string): Observable<string> {
    const options = {
      responseType: 'text' as const
    };

    return this.http.get(path, options);
  }
}
