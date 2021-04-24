Component({
    behaviors: [],
    options: {
      addGlobalClass: true,
      pureDataPattern: /^_/
    },
    properties: {
      duration: {
        type: Number,
        value: 500
      },
      easingFunction: {
        type: String,
        value: 'default'
      },
      loop: {
        type: Boolean,
        value: true,
      },
      videoList: {
        type: Array,
        value: [],
        observer: function observer() {
          const newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
          console.log('newVal',newVal)
          this._videoListChanged(newVal)
          this.setData({
            total: newVal.length
          })
        }
      }
    },
    data: {
      nextQueue: [],
      prevQueue: [],
      curQueue: [],
      circular: false,
      _last: 1,
      _change: -1,
      _invalidUp: 0,
      _invalidDown: 0,
      _videoContexts: [],

      // 自定义参数
      isPaly:true,//当前播放状态 true播放 false暂停
      total: 0,
      
      

    },
    lifetimes: {
      attached() {
        this.data._videoContexts = [
          wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this)]
      },
    },
    methods: {
      _videoListChanged(newVal) {
        const _this = this
        const data = this.data
        
        newVal.forEach(function (item) {
          data.nextQueue.push(item)
        })
        if (data.curQueue.length === 0) {
          this.setData({
            curQueue: data.nextQueue.splice(0, 3)
          }, function () {
            _this.playCurrent(0)
          })
        }
      },
  
      animationfinish(e) {
        this.setData({
            isPaly: true
        })


        var _data = this.data,
        _last = _data._last,
        _change = _data._change,
        curQueue = _data.curQueue,
        prevQueue = _data.prevQueue,
        nextQueue = _data.nextQueue,
        total = _data.total

        var current = e.detail.current;
        var diff = current - _last;

        this.data.swiperCurrent = current;

        if (diff === 0) return
        this.data._last = current
        this.playCurrent(current)
        this.triggerEvent('change', {activeId: curQueue[current].id})



        const direction = diff === 1 || diff === -2 ? 'up' : 'down'
        if (direction === 'up') {
          console.log(this.data)

          if (this.data._invalidDown === 0) {
            const change = (_change + 1) % 3
            const add = nextQueue.shift()
            const remove = curQueue[change]
            if (add) {
              prevQueue.push(remove)
              curQueue[change] = add
              this.data._change = change

                // strart 判断是否总数余数为多少，裁剪当前轮播放2个还是4个。正常显示3个轮播
                if ((total % 3) === 1 && nextQueue.length === 0) {
                    let addItem = JSON.parse(JSON.stringify(add));
                    curQueue[3] = addItem;
                } else if ((total % 3) === 2 && nextQueue.length === 0) {
                    let _pop = curQueue.pop();
                    this.setData({
                        _pop: _pop
                    })
                }
                // end

            } else {
              this.data._invalidUp += 1
            }
          } else {
            this.data._invalidDown -= 1
          }
          
          if(this.data.nextQueue.length === 3){
            this.triggerEvent('updatalist') 
          }


        }
        if (direction === 'down') {
          if (this.data._invalidUp === 0) {
            const _change2 = _change
            const _remove = curQueue[_change2]
            const _add = prevQueue.pop()
            if (_add) {
              curQueue[_change2] = _add
              nextQueue.unshift(_remove)
              this.data._change = (_change2 - 1 + 3) % 3
            } else {
              this.data._invalidDown += 1
            }
          } else {

            // strart 判断是否总数余数为多少，裁剪当前轮播放2个还是4个。正常显示3个轮播
            if ((total % 3) === 1 && curQueue.length === 4) {
                curQueue.pop();
            } else if ((total % 3) === 2 && nextQueue.length === 0) {
                curQueue.push(this.data._pop);
            }
            // end

            this.data._invalidUp -= 1
          }
        }
        let circular = true
        if (nextQueue.length === 0 && current !== 0) {
          circular = false
        }
        if (prevQueue.length === 0 && current !== 2) {
          circular = false
        }
        this.setData({
          curQueue,
          circular
        })
      },
  
      playCurrent(current) {
        this.data._videoContexts.forEach(function (ctx, index) {
          index !== current ? ctx.pause() : ctx.play()
        })
      },

      videoTap(e){
        var that = this
        var curIdx = e.currentTarget.dataset.index
        this.data._videoContexts.forEach(function (ctx, index) {
            if (index == curIdx) {
                if (that.data.isPaly) {
                    ctx.pause()
                    that.setData({
                        isPaly: false
                    })
                } else {
                    ctx.play()
                    that.setData({
                        isPaly: true
                    })
                }
            }
        })
      },
      anchorHomepage(){

      },
      followHander(){

      },
      commentHandler(){

      },
      forwardHander(){

      },
      estateDetail(){
          
      }


      //收藏
      collectionHandler(){

      },
      onPlay: function onPlay(e) {
        this.trigger(e, 'play')
      },
      onPause: function onPause(e) {
        this.trigger(e, 'pause')
      },
      onEnded: function onEnded(e) {
        this.trigger(e, 'ended')
      },
      onError: function onError(e) {
        this.trigger(e, 'error')
      },
      onTimeUpdate: function onTimeUpdate(e) {
        this.trigger(e, 'timeupdate')
      },
      onWaiting: function onWaiting(e) {
        this.trigger(e, 'wait')
      },
      onProgress: function onProgress(e) {
        this.trigger(e, 'progress')
      },
      onLoadedMetaData: function onLoadedMetaData(e) {
        this.trigger(e, 'loadedmetadata')
      },
      trigger: function trigger(e, type) {
        const ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
  
        const detail = e.detail
        const activeId = e.target.dataset.id
        this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), {activeId}), ext))
      }
    },
  })
  