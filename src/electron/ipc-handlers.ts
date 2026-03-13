import { ipcMain, dialog } from 'electron';
import { readFileSync } from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import { WindowManager } from './window-manager';
import { IpcChannel } from './constants';

export const setupIpcHandlers = (): void => {
    ipcMain.handle(IpcChannel.SelectFolder, (event) => {
        try {
            const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
            if (result) return result[0];
            else return '';
        } catch (error) {
            console.error('Error selecting folder:', error);
            return '';
        }
    });


    ipcMain.handle(IpcChannel.ImportFile, (event) => {
        try {
            const result = dialog.showOpenDialogSync({
                properties: ['openFile'], 
                filters: [{ name: 'Json', extensions: ['json'] }] 
            });
            if (result && result[0]) {
                return readFileSync(result[0], 'utf-8');
            }
            return '';
        } catch (error) {
            console.error('Error importing file:', error);
            return '';
        }
    });

    let worker: Worker | null = null;
    ipcMain.handle(IpcChannel.CallFolderStats, (event, thePath: string) => {
        try {
            const workerPath = path.join(__dirname, 'worker.js');
            worker = new Worker(workerPath, { workerData: { thePath } });
            
            worker.once('message', (message) => {
                const mainWindow = WindowManager.getMainWindow();
                if (mainWindow) {
                    mainWindow.webContents.send(IpcChannel.UpdateFolderStats, message);
                }
            });

            worker.on('error', (error) => {
                console.error('Worker error:', error);
            });

            worker.on('exit', (code) => {
                worker = null;
            });
        } catch (error) {
            console.error('Error starting folder stats worker:', error);
        }
    });

    ipcMain.handle(IpcChannel.KillFolderStats, (event) => {
        if (worker) {
            worker.terminate();
            worker = null;
        }
    });
};