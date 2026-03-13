import { parentPort, workerData } from "worker_threads";
import { lstatSync, readdirSync, statSync } from 'original-fs';
import path from 'path';

const getFolderStats = (thePath: string): any => {
    try {
        const isDir = lstatSync(thePath).isDirectory();
        if (isDir) {
            const children = readdirSync(thePath);
            const ar: any[] = [];
            let sum = 0;
            for (let index = 0; index < children.length; index++) {
                const child = children[index];
                const childPath = path.join(thePath, child);
                const childStats = getFolderStats(childPath);
                if (childStats && childStats.data) {
                    childStats.data.name = child;
                    ar.push(childStats);
                    sum += childStats.data.size || 0;
                }
            }
            return { data: { path: thePath, size: sum, name: path.basename(thePath) }, children: ar };
        } else {
            const size = statSync(thePath).size;
            return { data: { path: thePath, name: path.basename(thePath), size: size } };
        }
    } catch (error) {
        console.error(`Error processing ${thePath}:`, error);
        return null;
    }
}

const folderStats = [getFolderStats(workerData.thePath)]
parentPort?.postMessage(folderStats)