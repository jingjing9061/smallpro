// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{
      message: 'foo',
    },
    {
      message: 'bar'
    }],
    isshow:true,
    total:0,//父组件  记录三个按钮的总和
    tdata:{
      index:1,
      msg:'this is a template!',
      time: new Date().toLocaleDateString()
    }
  },
  tapname:function(event){
    console.log(event)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    console.log(this.dialog)
  },

  showToast: function () {
    this.toastedit.showToast('我是传过来的toast内容', 2000)
  },
  showDialog(e) {
    console.log(e)
    this.dialog.showDialog();
  },

  // 自定义事件监听
  _incrementTotal(e){
    console.log(e.detail)
    var num = e.detail.num
    this.setData({
      total:this.data.total+ e.detail.num
    })
  },
  //取消事件 自定义事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.dialog.hideDialog();
  },

  jumppassword(){
    wx.navigateTo({
      url: '../six-Input-Box/sixinput-box',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})