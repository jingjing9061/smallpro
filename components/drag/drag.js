/**
 * drag.js
 */
const app = getApp();
let GlobalData = app.globalData
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    position: Object
  },

  attached: function () {
    let safeArea = GlobalData.systemInfo.safeArea || null;
    if (safeArea) {
      this.setData({
        safeArea
      });
    }
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行

  },
  ready: function () {

  },

  pageLifetimes: {
    show: function () {//组件所在页面onshow
      let safeArea = this.data.safeArea || null;
      this.setData({
        position: null
      });
      try {
        this.setData({
          isShow: true
        });

      } catch (e) {
        // Do something when catch error
      }
    },
    hide: function () {
      //组件所在页面onshow
      this.setData({
        position: null,
        isShow: false
      })
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },

  data: {
    safeArea: null
  },

  /**
   * 组件的方法列表
   */

  methods: {

  }
})
