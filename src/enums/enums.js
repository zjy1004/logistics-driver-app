const ENUMS = {
  waybillStatus: [{id: 11, name: '待装车'}, {id: 1, name: '已装车'}, {id: 2, name: '运输中'}, {id: 3, name: '已签收'}, {id: 4, name: '已拒签'}, {id: 6, name: '已取消'}],
  // 操作类型
  operateType: [{id: 1, name: '已揽收'}, {id: 2, name: '运输中'}, {id: 3, name: '已签收'}, {id: 4, name: '已拒签'}],
  // 提现状态
  withdrawStatus: [{id: 1, name: '不可提现'}, {id: 2, name: '可提现'}, {id: 3, name: '提现中'}, {id: 4, name: '已提现'}, {id: 5, name: '未提现'}]
}
export default ENUMS
