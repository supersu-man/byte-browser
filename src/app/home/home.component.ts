import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeTableModule } from 'primeng/treetable';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    imports: [ButtonModule, PanelModule, TreeTableModule, CommonModule, InputNumberModule, FormsModule],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent {

  window = (window as any)
  process_ongoing = false
  stats: TreeNode[] = []
  uri = ''
  searchFilter = 0

  constructor (private messageService: MessageService, private zone: NgZone) { }

  ngOnInit(): void {
    this.window.api.onFolderStats((data: TreeNode[]) => {
      this.zone.run(() => {
        this.stats = data
        this.process_ongoing = false
        this.messageService.add({ severity: 'success', summary: 'Process complete', detail: 'Successfully fetched stats for '+ this.stats[0].data.path });
      })
    })
  }

  getFolderStats = async () => {
    const folderPath = await this.window.api.selectFolder();
    this.process_ongoing = true
    await this.window.api.callFolderStats(folderPath);
  }

  killStats = () => {
    this.window.api.killFolderStats()
    this.process_ongoing = false
  }

  import = async () => {
    const fileData = await this.window.api.importFile()
    if(fileData) this.stats = JSON.parse(fileData)
    this.messageService.add({ severity: 'success', summary: 'Import complete', detail: 'Successfully imported json' });
  }

}