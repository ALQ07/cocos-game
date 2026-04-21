import { Node, Vec3, view, UITransform, director, Canvas, Sprite, assetManager, SpriteFrame, isValid, Texture2D, ImageAsset, path } from "cc";
import Singleton from "../Base/Singleton";
import GM from "../../GM/GM";

declare const wx: any;

export class WxCloudManager extends Singleton {

    public static get Instance(): WxCloudManager {
        return super.GetInstance<WxCloudManager>();
    }

    private btnWorldPos: Vec3 = new Vec3();
    private btnNode: Node = null;
    private spriteFrameCache: Map<string, SpriteFrame> = new Map();
    private loadingTargets: Map<string, Sprite[]> = new Map();
    private spriteToFileID: WeakMap<Sprite, string> = new WeakMap();

    init(btnNode?: Node) {
        if (typeof wx === 'undefined') {
            return;
        }
        wx.cloud.init();
        if (!btnNode) return;
        this.btnWorldPos = btnNode.worldPosition;
        this.btnNode = btnNode;

    }

    async getUsers() {
        if (typeof wx === 'undefined') {
            console.log('当前不是微信环境，跳过微信云数据库查询');
            return;
        }
        try {
            const db = wx.cloud.database();
            const res = await db.collection('user').get();
            console.log('微信云数据库查询用户结果:', res.data);  // 查询结果
        } catch (error) {
            console.error('微信云数据库查询失败:', error);
        }
    }

    async addDateToCloud(data: any) {
        if (typeof wx === 'undefined') {
            console.log('当前不是微信环境，跳过微信云数据库添加');
            return;
        }
        try {
            const db = wx.cloud.database();
            const res = await db.collection('user').add({
                data: data
            });
            console.log('微信云数据库添加用户结果:', res);  // 添加结果
        } catch (error) {
            console.error('微信云数据库添加失败:', error);
        }
    }

    async updateDateToCloud(data: any) {
        if (typeof wx === 'undefined') {
            console.log('当前不是微信环境，跳过微信云数据库更新');
            return;
        }
        try {
            const db = wx.cloud.database();
            const res = await db.collection('user').doc(data._id).update({
                data: data
            });
            console.log('微信云数据库更新用户结果:', res);  // 更新结果
        } catch (error) {
            console.error('微信云数据库更新失败:', error);
        }
    }

    async getFuncFromCloud(funcName: string, data?: any) {
        if (typeof wx === 'undefined') {
            console.log('当前不是微信环境，跳过微信云数据库查询');
            return;
        }
        let res: any = null;
        try {
            res = await wx.cloud.callFunction({ name: funcName, data: { ...data } })
            console.log(`${funcName}`, res);  // 查询结果
        } catch (error) {
            console.error(`${funcName}`, error);
        }
        return res;
    }

    loadCloudImage(fileID: string, targetSprite?: Sprite) {
        if (targetSprite) {
            this.spriteToFileID.set(targetSprite, fileID);
        }

        if (this.spriteFrameCache.has(fileID)) {
            if (targetSprite && isValid(targetSprite.node)) {
                targetSprite.spriteFrame = this.spriteFrameCache.get(fileID);
            }
            return;
        }

        // 防止重复请求并记录需要更新的Sprite
        if (this.loadingTargets.has(fileID)) {
            if (targetSprite) {
                this.loadingTargets.get(fileID).push(targetSprite);
            }
            return;
        }
        this.loadingTargets.set(fileID, targetSprite ? [targetSprite] : []);

        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                // fileList 是一个有如下结构的对象数组
                // [{
                //    fileID: 'cloud://xxx.png', // 文件 ID
                //    tempFileURL: '', // 临时文件网络链接
                //    maxAge: 120 * 60 * 1000, // 有效期
                // }]
                this.loadImageToSprite(res.fileList[0].tempFileURL, fileID);
                console.log(res.fileList)
            },
            fail: (err) => {
                console.error(err);
                this.loadingTargets.delete(fileID);
            }
        })
    }

    /**
     * 将本地文件路径加载到 Sprite 组件
     */
    private loadImageToSprite(filePath: string, fileID: string) {
        const img = new Image();
        img.onload = () => {
            // 第三步：创建 Texture2D 并赋值给 Sprite
            const texture = new Texture2D();
            const imageAsset = new ImageAsset(img);
            texture.image = imageAsset;

            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;

            // 缓存SpriteFrame
            this.spriteFrameCache.set(fileID, spriteFrame);

            // 更新所有等待此图片的Sprite
            const targets = this.loadingTargets.get(fileID);
            if (targets) {
                targets.forEach(sprite => {
                    if (sprite && isValid(sprite.node)) {
                        // 检查Sprite是否仍然需要显示该图片（防止列表快速滑动导致的图片错乱）
                        if (this.spriteToFileID.get(sprite) === fileID) {
                            sprite.spriteFrame = spriteFrame;
                        }
                    }
                });
                this.loadingTargets.delete(fileID);
            }
        };
        img.onerror = (err) => {
            console.error('图片加载失败:', err);
            this.loadingTargets.delete(fileID);
        };
        img.src = filePath;
    }

    getWxUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof wx === 'undefined') {
                console.log('当前不是微信环境，跳过微信云数据库查询');
                resolve(null);
                return;
            }
            try {
                wx.getSetting({
                    success(res) {
                        if (res.authSetting['scope.userInfo'] === true) {
                            // 已经授权，直接获取用户信息
                            wx.getUserInfo({
                                success: (res) => {
                                    // 已经授权，直接获取用户信息
                                    resolve(res.userInfo);
                                },
                                fail: (err) => {
                                    reject(err);
                                }
                            });
                        } else {
                            // 未授权，创建用户信息按钮
                            resolve('ok');
                        }
                    },
                    fail(err) {
                        reject(err);
                    }
                });
            } catch (error) {
                console.error('微信云数据库查询用户信息失败:', error);
                reject(error);
            }
        });
    }

    createUserInfoBtn() {
        let left = 0;
        let top = 0;
        let width = 100;
        let height = 100;

        if (this.btnNode && this.btnNode.isValid) {
            const uiTrans = this.btnNode.getComponent(UITransform);
            // 1. 获取带有所有缩放和旋转关系的、绝对世界包围盒
            const worldAABB = uiTrans.getBoundingBoxToWorld();

            // 2. 获取当前场景的 UI 摄像机（通常挂载在 Canvas 上）
            const canvas = director.getScene().getComponentInChildren(Canvas);
            const camera = canvas.cameraComponent;

            const screenLeftTop = new Vec3();
            const screenRightBottom = new Vec3();

            // 3. 将世界包围盒的左上角 (xMin, yMax) 转化为屏幕物理像素坐标
            camera.worldToScreen(new Vec3(worldAABB.xMin, worldAABB.yMax, 0), screenLeftTop);
            // 将右下角 (xMax, yMin) 转化为屏幕物理像素坐标
            camera.worldToScreen(new Vec3(worldAABB.xMax, worldAABB.yMin, 0), screenRightBottom);

            // 4. 获取设备像素比 (dpr) 和 CSS 逻辑尺寸
            const dpr = view.getDevicePixelRatio();
            const frameSize = view.getFrameSize(); // 对应微信的 windowWidth / windowHeight

            // 5. 转换为微信所需的逻辑像素 (CSS像素)
            // Cocos 的 y 轴原点在屏幕左下角，而微信的 top 原点在左上角，因此需要 frameSize.height 减去 y
            left = screenLeftTop.x / dpr;
            top = frameSize.height - (screenLeftTop.y / dpr);
            width = (screenRightBottom.x - screenLeftTop.x) / dpr;
            height = (screenLeftTop.y - screenRightBottom.y) / dpr;
        }

        const button = wx.createUserInfoButton({
            type: "image",
            style: {
                left,
                top,
                width,
                height,
                backgroundColor: "rgba(255, 0, 0, 0)", // 💡建议：测试时改为半透明红色，完美重合后再设为全透明或图片
            },
        });

        button.onTap((res: any) => {
            if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
                const userInfo = JSON.parse(res.rawData);
                console.log('用户信息:', userInfo);
                button.destroy();
                this.getFuncFromCloud('upLoadUserInfo', { ...userInfo, score: GM.CacheMgr.get<number>('score') || 0 });
            } else {
                console.log('获取用户信息失败:', res.errMsg);
            }
        });

        return button;
    }
}
