// fiber进行修改的类型

const effects: EffectsInterface = {
  PLACEMENT: 1, //建立，也就是初始化
  DELETION: 2, // 删除
  UPDATE: 3 //更新修改。
};

export default effects;

export interface EffectsInterface {
  PLACEMENT: number;
  DELETION: number;
  UPDATE: number;
};