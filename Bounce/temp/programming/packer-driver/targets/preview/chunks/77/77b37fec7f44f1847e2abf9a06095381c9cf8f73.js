System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, GameConfig, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "07294TX4aRM9JH70VXV1c2J", "GameConfig", undefined);

      /**
       * 物理弹球游戏配置
       * 包含物理引擎参数、速度配置、碰撞参数等
       */
      _export("default", GameConfig = class GameConfig {});

      // ==================== 物理引擎全局配置 ====================

      /** 物理引擎重力 */
      GameConfig.GRAVITY = 0;

      /**水平方向上能容纳的最多的块数量 */
      GameConfig.HORIZONTAL_BLOCK_MAXNUM = 6;

      /**垂直方向上的块最多能排到第几排 */
      GameConfig.VERTICAL_BLOCK_ROWS = 9;
      // ==================== 小球(Ball)物理配置 ====================
      GameConfig.Ball = {
        /** 质量 */
        density: 1,

        /** 摩擦力 */
        friction: 0,

        /** 弹性系数 (0-1, 1为完全弹性碰撞) */
        restitution: 0.95,

        /** 线性阻尼 (速度衰减) */
        linearDamping: 0,

        /** 角速度阻尼 (旋转衰减) */
        angularDamping: 0,

        /** 重力缩放 */
        gravityScale: 0,

        /** 是否固定旋转 */
        fixedRotation: false,

        /** 是否开启碰撞监听 */
        enabledContactListener: true,

        /** 是否使用连续碰撞检测 (防止穿透) */
        bullet: true,

        /** 刚体类型: 0-Static, 1-Kinematic, 2-Dynamic */
        rigidBodyType: 0,

        /** 是否允许休眠 */
        allowSleep: false
      };
      // ==================== 方块(Block)物理配置 ====================
      GameConfig.Block = {
        /** 质量 */
        density: 1,

        /** 摩擦力 */
        friction: 0,

        /** 弹性系数 */
        restitution: 0.3,

        /** 线性阻尼 */
        linearDamping: 0,

        /** 角速度阻尼 */
        angularDamping: 0,

        /** 重力缩放 */
        gravityScale: 0,

        /** 是否固定旋转 */
        fixedRotation: true,

        /** 是否开启碰撞监听 */
        enabledContactListener: true,

        /** 刚体类型: 0-Static, 1-Kinematic, 2-Dynamic */
        rigidBodyType: 1,

        /** 是否允许休眠 */
        allowSleep: true
      };
      // ==================== 墙壁(Wall)物理配置 ====================
      GameConfig.Wall = {
        /** 弹性系数 */
        restitution: 0.95,

        /** 摩擦力 */
        friction: 0
      };
      // ==================== 速度配置 ====================
      GameConfig.BallSpeed = {
        /** 小球初始发射速度 */
        initialSpeed: 500,

        /** 小球最小速度 (防止停止) */
        minSpeed: 200,

        /** 小球最大速度 (防止过快) */
        maxSpeed: 1000
      };
      // ==================== 碰撞组配置 ====================
      GameConfig.CollisionGroup = {
        /** 默认组 */
        Default: 0,

        /** 小球组 */
        Ball: 2,

        /** 方块组 */
        Block: 8,

        /** 墙壁组 */
        Wall: 1
      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=77b37fec7f44f1847e2abf9a06095381c9cf8f73.js.map