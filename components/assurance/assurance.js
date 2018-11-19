// components/assurance/assurance.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr:[
      { key: '厂家好货', con: '正品保障，假货商家假一赔三。' },
      { key: '48小时发货', con: '自订单付款后，将会在48小时内完成发货。' },
      { key: '七天无理由售后', con: '自确认收货后享受7天无理由售后。' }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel(){
      this.setData({
        show:false
      })
    }
  }
})
