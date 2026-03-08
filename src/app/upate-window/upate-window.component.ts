import { Component, NgZone } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
    selector: 'app-upate-window',
    imports: [ProgressBarModule],
    templateUrl: './upate-window.component.html',
    styles: ``
})
export class UpateWindowComponent {

  progress = 0

  constructor(private zone: NgZone) { }
  
  ngOnInit(): void {
    (window as any).api.onUpdateProgress((progress: number) => {
      this.zone.run(() => {
        this.progress = parseFloat(progress.toFixed(2))
      })
    })
  }

}
