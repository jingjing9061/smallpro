// pages/video/video.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoList: [],
        tabbar: ['我的视频','我的关注'],
        pageNum:1,
        current_index: 5,//根据指定位置进行播放
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.updatalist()

    },
    updatalist(){

        let videoList = []
        setTimeout(()=>{
            let url = "http://1302869396.vod2.myqcloud.com/30adddb1vodcq1302869396/c46b2c255285890816305341471/D41lMGqLI20A.mp4"
            for( let i = 0; i< 10; i++ ){
                videoList.push({
                    id:this.GenNonDuplicateID(),
                    // index:`${this.data.pageNum}-${i+1}`,
                    url,
                    commentNum:parseInt(Math.random()*700),
                    shares:parseInt(Math.random()*40),
                    introduce:'343545',
                    commentNum:parseInt(Math.random()*400),
                    followFlag:Math.round(Math.random()),
                    anchorName:'wechat',
                    likes:0,
                    likeFlag:Math.round(Math.random()),
                })
            }
            this.setData({
                videoList
            })
        },1000)

    },

    GenNonDuplicateID() {　　
        let str = '';
        str = Math.random().toString(36).substr(3);
        str += Date.now().toString(16).substr(4);
        return str;
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

    },
    onPlay(e) {},

    onPause(e) {
      //  console.log('pause', e.detail.activeId)
    },
  
    onEnded(e) {},
  
    onError(e) {},
  
    onWaiting(e) {},
  
    onTimeUpdate(e) {},
  
    onProgress(e) {},

    onLoadedMetaData(e) {
        // console.log('LoadedMetaData', e)
    }
})