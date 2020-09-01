// pages/selectseat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dropType:undefined,
    sort_hidden: true,//下拉框的显示或隐藏 
    zhezhao: true,//遮罩层 
    dowpdowndata:['户型','楼栋'],
    selectdata1:[
      { id: 1, label: '合生麒麟社' },
      { id: 2, label: '合生珠江帝景' },
      { id: 3, label: '天津京津新城' },
      { id: 4, label: '珠江滨海城' },
      { id: 5, label: '合生帝景花园' },
    ],
    selectdata2:[
      { id: 'a', label:'A栋'},
      { id: 'b', label: 'B栋' },
      { id: 'c', label: 'C栋' },
      { id: 'd', label: 'D栋' },
    ],
    datalist:[
      {floor:1,floorname:'1层',unitlist:[
        { unit: 1, cell: [
          { cellName: '1201', salesStatus: 0, area: 122},
          { cellName: '1202', salesStatus: 0, area: 102 },
          ]},
        {unit: 2, cell: [
            { cellName: '201', salesStatus: 0, area: 122 },
            { cellName: '202', salesStatus: 0, area: 102 },
          ]
        },

      ]},
      {floor: 3, floorname: '2层',unitlist: [
          { unit: 4, cell: [
              { cellName: '2201', salesStatus: 0, area: 90 },
              { cellName: '2202', salesStatus: 0, area: 78 },
            ]
          },
         {unit: 9, cell: [
            { cellName: '2201', salesStatus: 0, area: 90 },
            { cellName: '2202', salesStatus: 0, area: 78 },
          ]
         },

        ]
      },

    ]
      
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  dropdownTap(e){
    let _this = this;
    let id = e.currentTarget.dataset.id;
    _this.setData({
      dropType: id,
      id: e.currentTarget.dataset.id,//存入下拉框的id 
      sort_hidden: false,//下拉框的显示或隐藏 
      zhezhao: false,//遮罩层 
      upordown: "up",
    })
  },

  // 点击下拉列表 
  optionTap(e) {
    let _that = this;
    _that.setData({
      // key: e.currentTarget.dataset.index,//存入下拉框的key 
      zhezhao: true,//遮罩层的显示或隐藏 
      sort_hidden: true,//下拉框的显示或隐藏 
      upordown: "down",
    });
    let obj = e.currentTarget.dataset.item
    console.log(obj)


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