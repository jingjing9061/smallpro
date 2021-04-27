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
      index: {
        type: Number,
        value: 0
      },
      videoList: {
        type: Array,
        value: [],
        observer: function observer() {

            var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            if (newVal.length) {
                // newVal.map((item, index) => {
                //     return item.idxKey = index + 1;
                // });
                if (newVal.length <= 10) {
                    this._videoListChanged(newVal);
                } else {
                    // 防止当前数组被污染
                    let arr = JSON.parse(JSON.stringify(newVal));
                    // 去掉已有的数据
                    let nextArr = arr.splice(this.data.total);
                    this.data.nextQueue.push(...nextArr);
                }
                this.setData({
                    total: newVal.length
                })
            }



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
      swiperCurrent:0,
      total: 0,

      

    },
    lifetimes: {
      attached() {
        this.data._videoContexts = [
            wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this),wx.createVideoContext('video_3', this)
        ]
      },
    },
    methods: {
      _videoListChanged(newVal) {


        // const _this = this
        // const data = this.data
        // newVal.forEach(function (item) {
        //   data.nextQueue.push(item)
        // })
        // if (data.curQueue.length === 0) {
        //   this.setData({
        //     curQueue: data.nextQueue.splice(0, 3)
        //   }, function () {
        //     _this.playCurrent(0)
        //   })
        // }
        
        var _this = this;
        var index = this.data.index;
        var total = newVal.length;
        // 如果传入的index大于总数，则默认从0开始播放
        if (index + 1 > total) {index = 0;};
        var data = this.data;
        let remainder = index % 3; // 3的余数--当前轮播位置
        console.log('remainder',remainder)
        var curQueue = [];
        var _pop = [];
        var swiperCurrent = remainder;
        newVal.forEach(function (item, idx) {
            item.index = idx;
            data.nextQueue.push(item);
        });
        // console.log(newVal, 'newval', data);
        if (data.curQueue.length === 0) {
            let curIndex = index > 0 ? index - 1 : 0;
            _this.data._change = ((index % 3) + 1) % 3;
            // 假设直接从顶部滑下来
            // _this.data._last = index === 0 ? 0 : // 如果初始播放第0个视频
            //     // index不是0，刚好是3的倍数，上一个swiper-item的索引是2(最后一个)
            //     _this.data._change === 0 ? 2 : _this.data._change - 1;// 其他情况直接用_change - 1就行
            _this.data._last = remainder;
            _this.data._invalidDown = index === 0 ? 1 : 0; // 如果刚好是第0个，不允许下滑

            _this.data._invalidUp = total - curIndex < 2 ? 1 : 0; // 这个比较复杂了

            // 设置前后还剩多少数据
            _this.data.prevQueue = newVal.slice(0, curIndex);
            _this.data.nextQueue = newVal.slice(curIndex + 3);

            var circular = true;
            if (_this.data.nextQueue.length === 0 && _this.data._change !== 0) {
                circular = false;
            }
            if (_this.data.prevQueue.length === 0 && _this.data._change !== 2) {
                circular = false;
            }

            // 当前swiper展示的数组顺序
            let indexAdd = index + 1;
            let indexAdd2 = index + 2;
            let indexSub = index - 1;
            if (total > 4 && total % 3 == 1 && (total - 1) - index <= 2) { // 除以3余1

                curQueue = [
                    ...newVal.slice(total - 1, total),
                    ...newVal.slice(total - 3, total - 2),
                    ...newVal.slice(total - 2, total - 1),
                    ...newVal.slice(total - 1, total),
                ]

                _this.data.circular = circular = false;
                if (total - 1 - index == 0) {
                    _this.data._change = 0;
                    _this.data._invalidDown = 0;
                    _this.data._invalidUp = 1;
                    _this.data._last = 3;
                    swiperCurrent = 3;
                    _this.data.prevQueue = newVal.slice(0, curIndex - 1);
                } else if (total - 1 - index == 1) {
                    _this.data._change = 0;
                    _this.data._invalidDown = 0;
                    _this.data._invalidUp = 0;
                    _this.data._last = 2;
                } else if (total - 1 - index == 2) {
                    _this.data._change = 2;
                    _this.data._invalidDown = 0;
                    _this.data._invalidUp = 0;
                    _this.data._last = 1;
                    _this.data.circular = circular = true;
                    curQueue = [
                        ...newVal.slice(indexSub, index),
                        ...newVal.slice(index, indexAdd),
                        ...newVal.slice(indexAdd, indexAdd2),
                    ]
                }

            } else if (total > 4 && total % 3 == 2 && total - index - 1 <= 1) { // 除以3余2

                _pop = newVal.slice(total - 3, total - 2);
                _pop = _pop[0];
                if (total - index - 1 == 0 || total == index + 2) {
                    if (total == index + 2) { // 当直接定位到倒数第二个播放
                        _this.data._change = 1;
                        _this.data._invalidDown = 0;
                        _this.data._invalidUp = 0;
                        _this.data._last = 0;
                        circular = false;
                        curQueue = [
                            ...newVal.slice(total - 2, total - 1),
                            ...newVal.slice(total - 1, total),
                            // ...newVal.slice(total - 3, total - 2),
                        ];
                    } else {
                        _this.data._change = 1;
                        _this.data._invalidDown = 0;
                        _this.data._invalidUp = 1;
                        _this.data._last = 1;
                        circular = false;
                        curQueue = [
                            ...newVal.slice(total - 2, total - 1),
                            ...newVal.slice(total - 1, total),
                        ];
                    }
                    _this.data.prevQueue = newVal.slice(0, total - 3);
                } else if (total - index - 1 == 1) {
                    _this.data._change = 1;
                    _this.data._invalidDown = 0;
                    _this.data._invalidUp = 0;
                    _this.data._last = 0;
                    circular = true;
                    curQueue = [
                        ...newVal.slice(total - 2, total - 1),
                        ...newVal.slice(total - 1, total),
                        ...newVal.slice(total - 3, total - 2),
                    ];
                }

            } else {
                if (total <= 4) { // 当从第一个视频播放不需要其他操作
                    // 当轮播第一次 初始化值
                    _this.data._change = -1;
                    _this.data._last = 1;
                    _this.data._invalidDown = 0;
                    _this.data._invalidUp = 0;
                    // curQueue = newVal.slice(curIndex, curIndex + 3);
                    curQueue = newVal;
                    circular = false;
                } else {
                    if (remainder == 0 && total > 4) {
                        let lastArr = newVal.slice(indexSub, index); // 当这是第N轮的第一个swiper，需要裁剪上一个尾的数据
                        if (index == 0) { // 当这是第一个swiper位置视频，当前最后一个视频为下2个
                            _this.data._change = -1;
                            _this.data._last = 1;
                            _this.data._invalidDown = 0;
                            _this.data._invalidUp = 0;
                            lastArr = newVal.slice(indexAdd2, indexAdd2 + 1);
                        }
                        curQueue = [
                            ...newVal.slice(index, indexAdd),
                            ...newVal.slice(indexAdd, indexAdd2),
                            ...lastArr
                        ];
                    } else if (remainder == 1 && total > 4) {
                        curQueue = [
                            ...newVal.slice(indexSub, index),
                            ...newVal.slice(index, indexAdd),
                            ...newVal.slice(indexAdd, indexAdd2)
                        ]
                    } else if (remainder == 2 && total > 4) {
                        let homeArr = newVal.slice(indexAdd, indexAdd2); // 当这是第三个swiper，需要裁剪将来一个
                        if (total === index + 1) { // 当这是最后一个视频时，只需要裁剪前2个
                            circular = false;
                            homeArr = newVal.slice(index - 2, indexSub);
                        }
                        curQueue = [
                            ...homeArr,
                            ...newVal.slice(indexSub, index),
                            ...newVal.slice(index, indexAdd)
                        ]
                    }
                }

            }
            if (total <= 4) {
                swiperCurrent = index;
            }
            this.setData({
                curQueue: curQueue,
                total,
                circular,
                swiperCurrent,
                _pop
            }, function () {
                _this.playCurrent(swiperCurrent);
            });

            // console.log(this.data)
        }
        

        console.log(this.data)

        
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
        total = _data.total;

      var current = e.detail.current;
      var diff = current - _last;
      this.data.swiperCurrent = current;
      this.playCurrent(current);
      

      if (diff === 0 || total <= 4) return;

      this.data._last = current;
      this.triggerEvent('change', {
          activeId: curQueue[current].id
      });
      var direction = diff === 1 || diff === -2 ? 'up' : 'down';
      if (direction === 'up') {
          if (this.data._invalidDown === 0) {
              var change = (_change + 1) % 3;
              var add = nextQueue.shift();
              var remove = curQueue[change];
              if (add) {
                  prevQueue.push(remove);
                  curQueue[change] = add;
                  this.data._change = change;

                  // strart 判断是否总数余数为多少，裁剪当前轮播放2个还是4个。正常显示3个轮播
                  if ((total % 3) === 1 && nextQueue.length === 0) {
                    //   let timers = new Date();
                      let addItem = JSON.parse(JSON.stringify(add));
                    //   addItem.idxKey = timers.getTime();
                      curQueue[3] = addItem;
                  } else if ((total % 3) === 2 && nextQueue.length === 0) {
                      let _pop = curQueue.pop();
                      this.setData({
                          _pop: _pop
                      })
                  }
                  // end

              } else {
                  this.data._invalidUp += 1;
              }
          } else {
              this.data._invalidDown -= 1;
          }
      }
      if (direction === 'down') {
          if (this.data._invalidUp === 0) {
              var _change2 = _change;
              var _remove = curQueue[_change2];
              var _add = prevQueue.pop();
              if (_add) {
                  curQueue[_change2] = _add;
                  nextQueue.unshift(_remove);
                  this.data._change = (_change2 - 1 + 3) % 3;
              } else {
                  this.data._invalidDown += 1;
              }
          } else {

              // strart 判断是否总数余数为多少，裁剪当前轮播放2个还是4个。正常显示3个轮播
              if ((total % 3) === 1 && curQueue.length === 4) {
                  curQueue.pop();
              } else if ((total % 3) === 2 && nextQueue.length === 0) {
                  curQueue.push(this.data._pop);
              }
              // end

              this.data._invalidUp -= 1;
          }
      }
      var circular = true;
      if (nextQueue.length === 0 && current !== 0) {
          circular = false;
      }
      if (prevQueue.length === 0 && current !== 2) {
          circular = false;
      }
      this.setData({
          curQueue: curQueue,
          circular: circular
      }, () => {
          // console.log('curQueue:', JSON.parse(JSON.stringify(this.data.curQueue)), 'nextQueue:', this.data.nextQueue, 'prevQueue:', this.data.prevQueue)
          // console.log(this.data);
          // console.log(curQueue[current], 'id', this.data, current);
          // console.log('_change:', this.data._change, '_invalidDown:', this.data._invalidDown, '_invalidUp:', this.data._invalidUp, '_last:', this.data._last)
      });
       
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
          
      },


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
  