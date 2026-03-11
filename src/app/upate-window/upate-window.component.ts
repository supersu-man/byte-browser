import { Component, signal } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'app-upate-window',
    imports: [ProgressBarModule],
    templateUrl: './upate-window.component.html',
    styles: ``
})
export class UpateWindowComponent {

  progress = signal(0);

  constructor() { }
  
  ngOnInit(): void {
    (window as any).api.onUpdateProgress((progress: number) => {
      this.progress.set(parseFloat(progress.toFixed(2)));
    })
  }

}
