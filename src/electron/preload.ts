import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI } from './constants';

const api: ElectronAPI = {
    // Basic API
    selectFolder: () => ipcRenderer.invoke(IpcChannel.SelectFolder),
    importFile: () => ipcRenderer.invoke(IpcChannel.ImportFile),
    
    // Folder Stats API
    callFolderStats: (path: string) => ipcRenderer.invoke(IpcChannel.CallFolderStats, path),
    onFolderStats: (callback: (value: string) => void) => ipcRenderer.on(IpcChannel.UpdateFolderStats, (_event, value) => callback(value)),
    killFolderStats: () => ipcRenderer.invoke(IpcChannel.KillFolderStats),

    // Update API
    onUpdateProgress: (callback: (progress: number) => void) => ipcRenderer.on(IpcChannel.UpdateProgress, (_event, progress) => callback(progress)),
};

contextBridge.exposeInMainWorld('api', api);

export enum IpcChannel {
  SelectFolder = 'selectFolder',
  CallFolderStats = 'callFolderStats',
  UpdateFolderStats = 'updateFolderStats',
  KillFolderStats = 'killFolderStats',
  ImportFile = 'importFile',
  UpdateProgress = 'updateProgess',
}