// pages/customevent/customevent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了num属性，属性值可以在组件使用时指定
    num: {
      type: Number,
      value: 1 //点击btn 增加的值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    counter: 0 // counter定义的是每个按钮上的数值
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //btn自定义事件触发
    _incrementCounter(e) {
      let num = this.data.num
      this.setData({
        counter: this.data.counter + num
      })
      this.triggerEvent('increment', { num: num })//num 传递给父组件
    }
  }
})
