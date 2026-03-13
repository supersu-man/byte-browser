import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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

  process_ongoing = signal(false);
  stats = signal<TreeNode[]>([]);
  uri = computed(() => {
    return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.stats()));
  });
  searchFilter = signal(0);

  constructor (private messageService: MessageService) { }

  ngOnInit(): void {
    window.api.onFolderStats((data: TreeNode[]) => {
      this.stats.set(data);
      this.process_ongoing.set(false);
      const currentStats = this.stats();
      if (currentStats && currentStats.length > 0) {
        this.messageService.add({ 
            severity: 'success', 
            summary: 'Process complete', 
            detail: 'Successfully fetched stats for ' + currentStats[0].data.path 
        });
      }
    })
  }

  getFolderStats = async () => {
    const folderPath = await window.api.selectFolder();
    this.process_ongoing.set(true);
    await window.api.callFolderStats(folderPath);
  }

  killStats = () => {
    window.api.killFolderStats()
    this.process_ongoing.set(false);
  }

  import = async () => {
    const fileData = await window.api.importFile()
    if(fileData) this.stats.set(JSON.parse(fileData));
    this.messageService.add({ severity: 'success', summary: 'Import complete', detail: 'Successfully imported json' });
  }

}