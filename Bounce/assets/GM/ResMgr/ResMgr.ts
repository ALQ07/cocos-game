import { Asset, AssetManager } from "cc";
import GM from "../GM";

export class ResMgr {
    private static _instance: ResMgr = null;
    private _Res: AssetManager.Bundle;

    public static getInstance(bundle: AssetManager.Bundle): ResMgr {
        if (this._instance === null) {
            this._instance = new ResMgr();
            this._instance._Res = bundle;
        }
        return this._instance;
    }

    public get Res(): AssetManager.Bundle {
        return this._Res;
    };

    public async asyncLoad<T extends Asset>(path: string, callBack: (finished: number, total: number) => void): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            GM.ResMgr.Res.load(path, (finished: number, total: number) => {
                callBack(finished, total);
            }, (error, asset) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(asset as T);
                }
            });
        });
    }
}