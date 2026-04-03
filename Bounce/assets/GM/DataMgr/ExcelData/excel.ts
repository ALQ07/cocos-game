/**
* Excel表格数据，由工具导出，切勿修改！
*/
type funType = ((...values: any[]) => number);
export namespace excel{

/* table[ActionCard_Build] define:  */
export interface IActionCard_BuildRow {
	readonly BuildID: number; //选项卡ID
	readonly Quality: number; //品质
	readonly EffectTarget: number[][]; //生效对象
	readonly SkillGE: number[]; //效果GE
	readonly CardType: number; //选卡类型
	readonly UnitNum: number; //小兵数量
	readonly FrontConditon: number[][]; //前置条件
	readonly ClashCondition: number[][]; //冲突条件
	readonly SkillRes: string; //技能卡图标
	readonly SkillName: string; //技能卡名称
	readonly SkillDesc1: string; //技能卡描述(详情用)
	readonly SkillDesc2: string; //技能卡描述
	readonly EffectShow: number; //生效特效
	readonly MaxSelect: number; //最大选取次数
}
export const ActionCard_Build: { readonly [index: string]: IActionCard_BuildRow } = {};
export const ActionCard_Build_BuildID: { readonly [index: string]: IActionCard_BuildRow[] } = {};
/* table[ActionCard_ActionCardDrop] define:  */
export interface IActionCard_ActionCardDropRow {
	readonly ID: number; //主键ID
	readonly BuildGroup: number; //选项卡组
	readonly BuildID: number; //对应选项卡ID
	readonly Weight: number; //权重
	readonly IsCommend: number; //是否推荐
}
export const ActionCard_ActionCardDrop: { readonly [index: string]: IActionCard_ActionCardDropRow } = {};
export const ActionCard_ActionCardDrop_ID: { readonly [index: string]: IActionCard_ActionCardDropRow[] } = {};
export const ActionCard_ActionCardDrop_BuildGroup: { readonly [index: string]: IActionCard_ActionCardDropRow[] } = {};
export const ActionCard_ActionCardDrop_BuildID: { readonly [index: string]: IActionCard_ActionCardDropRow[] } = {};
/* table[ActionCard_ActionCardCMDrop] define:  */
export interface IActionCard_ActionCardCMDropRow {
	readonly ID: number; //主键ID
	readonly ACDropGroup: number; //掉落组
	readonly ACDropGroupType: number; //掉落组类型
	readonly BuildGroup: number; //选项卡组
	readonly Weight: number; //权重
	readonly BuildGroupRank: number; //选项卡组优先级
}
export const ActionCard_ActionCardCMDrop: { readonly [index: string]: IActionCard_ActionCardCMDropRow } = {};
export const ActionCard_ActionCardCMDrop_ID: { readonly [index: string]: IActionCard_ActionCardCMDropRow[] } = {};
export const ActionCard_ActionCardCMDrop_ACDropGroup: { readonly [index: string]: IActionCard_ActionCardCMDropRow[] } = {};
/* table[ActionCard_ActionCardUPStar] define:  */
export interface IActionCard_ActionCardUPStarRow {
	readonly UPStarID: number; //英雄卡ID
	readonly StarQuantity: number; //星级升级数
	readonly StarDrop: number; //掉落组
}
export const ActionCard_ActionCardUPStar: { readonly [index: string]: IActionCard_ActionCardUPStarRow } = {};
export const ActionCard_ActionCardUPStar_UPStarID: { readonly [index: string]: IActionCard_ActionCardUPStarRow[] } = {};

/**
 * 错误
 * @enum const
 */
export const enum ErrorType {
    /** 数据格式错误 */
    ErrorData = "incorrect format for excel data.",
    /** 资源不存在 */
    NoExist = "file of excel doesn't exist."
}

/*
* 设置只读对象
* @param obj 要设置为只读的对象
*/
function MakeReadonly(obj){
    Object.freeze(obj);
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(typeof obj[key] == "object"){
                MakeReadonly(obj[key])
            }
        }
    }
}

/**
 * 解析数据
 * @param data JSON 数据
 * @throws excel.ErrorType.ErrorData
 */
export function parse(data: any): void {
  try {
		for (const r of data.ActionCard_Build){
			(<any>ActionCard_Build[r[0]]) = {BuildID: r[0], Quality: r[1], EffectTarget: r[2], SkillGE: r[3], CardType: r[4], UnitNum: r[5], FrontConditon: r[6], ClashCondition: r[7], SkillRes: r[8], SkillName: r[9], SkillDesc1: r[10], SkillDesc2: r[11], EffectShow: r[12], MaxSelect: r[13] };

		}
		MakeReadonly(ActionCard_Build);

		for (const r of data.ActionCard_ActionCardDrop){
			(<any>ActionCard_ActionCardDrop[r[0]]) = {ID: r[0], BuildGroup: r[1], BuildID: r[2], Weight: r[3], IsCommend: r[4] };

        if(!(<any>ActionCard_ActionCardDrop_BuildGroup)[r[1]]){
          (<any>ActionCard_ActionCardDrop_BuildGroup)[r[1]] = [];
        }
        (<any>ActionCard_ActionCardDrop_BuildGroup)[r[1]].push({ID: r[0], BuildGroup: r[1], BuildID: r[2], Weight: r[3], IsCommend: r[4] });
        

        if(!(<any>ActionCard_ActionCardDrop_BuildID)[r[2]]){
          (<any>ActionCard_ActionCardDrop_BuildID)[r[2]] = [];
        }
        (<any>ActionCard_ActionCardDrop_BuildID)[r[2]].push({ID: r[0], BuildGroup: r[1], BuildID: r[2], Weight: r[3], IsCommend: r[4] });
        

		}
		MakeReadonly(ActionCard_ActionCardDrop);

		for (const r of data.ActionCard_ActionCardCMDrop){
			(<any>ActionCard_ActionCardCMDrop[r[0]]) = {ID: r[0], ACDropGroup: r[1], ACDropGroupType: r[2], BuildGroup: r[3], Weight: r[4], BuildGroupRank: r[5] };

        if(!(<any>ActionCard_ActionCardCMDrop_ACDropGroup)[r[1]]){
          (<any>ActionCard_ActionCardCMDrop_ACDropGroup)[r[1]] = [];
        }
        (<any>ActionCard_ActionCardCMDrop_ACDropGroup)[r[1]].push({ID: r[0], ACDropGroup: r[1], ACDropGroupType: r[2], BuildGroup: r[3], Weight: r[4], BuildGroupRank: r[5] });
        

		}
		MakeReadonly(ActionCard_ActionCardCMDrop);

		for (const r of data.ActionCard_ActionCardUPStar){
			(<any>ActionCard_ActionCardUPStar[r[0]]) = {UPStarID: r[0], StarQuantity: r[1], StarDrop: r[2] };

		}
		MakeReadonly(ActionCard_ActionCardUPStar);

  } catch (e) {
      throw new Error(ErrorType.ErrorData + e);
  }
}

/**
 * 公式
 */
export const formats = {
};
}