import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ElectronAPI } from '../electron/constants';

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule],
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {
  title = signal('byte-browser');
  hello = signal('');

  constructor() {
    
  }
}
