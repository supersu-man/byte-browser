export const WINDOW_CONFIG = {
  MAIN: {
    height: 600,
    width: 1000,
    title: "Byte Browser",
  },
  UPDATE: {
    height: 180,
    width: 500,
    title: "Update found",
    resizable: false,
    closable: false,
  },
};

export enum IpcChannel {
  SelectFolder = 'selectFolder',
  CallFolderStats = 'callFolderStats',
  UpdateFolderStats = 'updateFolderStats',
  KillFolderStats = 'killFolderStats',
  ImportFile = 'importFile',
  UpdateProgress = 'updateProgess',
}

export interface ElectronAPI {
  selectFolder: () => Promise<string>;
  callFolderStats: (path: string) => Promise<void>;
  onFolderStats: (callback: (stats: any) => void) => void;
  killFolderStats: () => Promise<void>;
  importFile: () => Promise<any>;

  onUpdateProgress: (callback: (progress: number) => void) => void;
}