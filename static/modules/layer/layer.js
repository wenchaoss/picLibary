//创建点击大图视图
define(function(require,exports,module){
    require('modules/layer/layer.css');
    //获取窗口的高度
    var h = $(window).height();
    var Layer = Backbone.View.extend({
        initialize: function(options){
            this.search = false;
            this.linshiCol = _.clone(this.collection);
            var self = this;
            // console.log(this)
            this.eventBus = options.eventBus;
            this.eventBus.on('changeCol',function(){
                self.linshiCol.models = arguments[0];
            }),
            this.eventBus.on("search",function(){
                self.search = !!arguments[0];
            })
        },
        //当前图片的id
        imageId: 0,
        //定义事件
        events: {
            //图片点击事件
            'tap .layer-container img': 'toggleTitle',
            //图片滑动事件
            'touchstart .layer-container img' : 'touchstart',
            'touchmove .layer-container img' : 'touchmove',
            'touchend .layer-container img' : 'touchend',
            //图片返回事件
            'tap .layer .go-back': 'goBack'
        },
        //开始触摸
        touchstart: function(event){
            //search出来的结果不提供滑动
            if(this.search){
                return;
            }
            var finger = event.touches[0];
            //开始位置
			this.startX = finger.clientX;
            //开始触摸的时间
			this.startTime = event.timeStamp;
            //避免点击也会换图
            this.dX = 0;
        },
        //移动
        touchmove: function(event){
            event.preventDefault();
            //search出来的结果不提供滑动
            if(this.search){
                return;
            }
            var finger = event.touches[0];
            //移动的坐标
			this.dX = finger.clientX - this.startX;
            //去掉过渡
			this.lis[0].style.transition = "none";
			this.lis[1].style.transition = "none";
			this.lis[2].style.transition = "none";
            //移动
            this.lis[1].style.transform = "translateX(" + this.dX + "px)";
            this.lis[2].style.transform = "translateX(" + ($(window).width() + this.dX) + "px)";
			this.lis[0].style.transform = "translateX(" + (-$(window).width() + this.dX) + "px)";
        },
        //结束触摸
        touchend: function(event){
            //search出来的结果不提供滑动
            if(this.search){
                return;
            }
            var linshiColLength = this.linshiCol.models.length;
            var finger = event.touches[0];
            var linshiidx = this.thisIdx;
            //触摸总时间
			var d = event.timeStamp - this.startTime;
            if(this.dX==0||this.dX==undefined){
                return
            }else if(this.dX < -$(window).width() / 2 || d < 200 && this.dX < -20){
				//向左边滑动成功
				if(d > 200){
					this.lis[1].style.transition = "all 0.3s ease 0s";
					this.lis[2].style.transition = "all 0.3s ease 0s";
				}else{
					this.lis[1].style.transition = "all 0.1s ease 0s";
					this.lis[2].style.transition = "all 0.1s ease 0s";
				}
                    // this.thisIdx++;
                    this.thisIdx = this.thisIdx == linshiColLength-1 ? 0 : this.thisIdx+1;

				this.lis[1].style.transform = "translateX(" + -$(window).width() + "px)";
				this.lis[2].style.transform = "translateX(" + 0 + "px)";

				this.lis[1].style.webkitTransform = "translateX(" + -$(window).width() + "px)";
				this.lis[2].style.webkitTransform = "translateX(" + 0 + "px)";
                // console.log(111) 
				
			}else if(this.dX < 0){
				//向左滑动没有成功
				this.lis[1].style.transition = "all 0.3s ease 0s";
				this.lis[2].style.transition = "all 0.3s ease 0s";

				this.lis[1].style.transform = "translateX(" + 0 + "px)";
				this.lis[2].style.transform = "translateX(" + $(window).width() + "px)";

				this.lis[1].style.webkitTransform = "translateX(" + 0 + "px)";
				this.lis[2].style.webkitTransform = "translateX(" + $(window).width() + "px)";
			}else if(this.dX > $(window).width() / 2 || d < 200 && this.dX > 20){
				//向右边滑动成功
				if(d > 200){
					this.lis[1].style.transition = "all 0.3s ease 0s";
					this.lis[0].style.transition = "all 0.3s ease 0s";
				}else{
					this.lis[1].style.transition = "all 0.1s ease 0s";
					this.lis[0].style.transition = "all 0.1s ease";
				}
                    // this.thisIdx--;
                    this.thisIdx = this.thisIdx == 0 ? linshiColLength-1 : this.thisIdx-1;

				this.lis[1].style.transform = "translateX(" + $(window).width() + "px)";
				this.lis[0].style.transform = "translateX(" + 0 + "px)";

				this.lis[1].style.webkitTransform = "translateX(" + $(window).width() + "px)";
				this.lis[0].style.webkitTransform = "translateX(" + 0 + "px)";

				// console.log(222)
			}else if(this.dX > 0){
				//向左滑动没有成功
				this.lis[1].style.transition = "all 0.3s ease 0s";
				this.lis[0].style.transition = "all 0.3s ease 0s";

				this.lis[1].style.transform = "translateX(" + 0 + "px)";
				this.lis[0].style.transform = "translateX(" + -$(window).width() + "px)";

				this.lis[1].style.webkitTransform = "translateX(" + 0 + "px)";
				this.lis[0].style.webkitTransform = "translateX(" + -$(window).width() + "px)";
			}
            // console.log(this.thisIdx);
            if(linshiidx!=this.thisIdx){
                //重新渲染layer
                var thisModel = this.linshiCol.models[this.thisIdx];
                // console.log(thisModel)
                this.modelId = thisModel.attributes.id;
                // console.log(this.modelId);
                var self = this;
                setTimeout(function(){
                    self.render(self.modelId)

                },300);
            }
            
        },
        //定义模板
        tpl: _.template($('#tpl_layer').html()),
        //渲染视图方法
        render : function(modelid){
            var model = this.collection.get(modelid);
            if(!model){
                location.href='';
                return;
            }
            //储存id
            this.imageId = model.get('id');
            //search时
            if(this.search){
                var data = {
                    urlpre: model.get('url'),
                    urlnex: model.get('url'),
                    urlmid: model.get('url'),
                    title: model.get('nickname'),
                    name : model.get('name'),
                    style: 'line-height: ' + h + 'px;',
                    stylepre: '',
                    stylemid: '',
                    stylenex: ''
                }
                var tpl = this.tpl;
                var html = tpl(data);
                this.$el.find('.layer').html(html);
                return;
            }
            //获得当前图片的位置
            this.thisIdx = this.findIndex();
            // console.log(thisIdx)
            //获得临时集合总长度
            var linshiColLength = this.linshiCol.models.length;
            //获取前后图序号
            var preIdx = this.thisIdx == 0 ? linshiColLength-1 : this.thisIdx-1;
            var nexIdx = this.thisIdx == linshiColLength-1 ? 0 : this.thisIdx+1;
            //获取集合
            var preModel = this.linshiCol.models[preIdx];
            var nexModel = this.linshiCol.models[nexIdx];
            //定义数据
            var data = {
                urlpre: preModel.get('url'),
                urlnex: nexModel.get('url'),
                urlmid: model.get('url'),
                title: model.get('nickname'),
                name : model.get('name'),
                style: 'line-height: ' + h + 'px;',
                stylepre: 'transform: translateX(-'+ $(window).width() +'px);transition: all 0.1s ease 0s;',
                stylemid: 'transform: translateX(0px);transition: all 0.1s ease 0s;',
                stylenex: 'transform: translateX('+ $(window).width() +'px);transition: all 0.1s ease 0s;'
            }
            // 获取模板
			var tpl = this.tpl;
			// 格式化模板
			var html = tpl(data);
			// 渲染视图
			this.$el.find('.layer').html(html);
            //布局
            this.lis = this.$el.find('.swipe div');
            // console.log(this.lis);
            // for(var i = 1 ; i < this.lislength ; i++){
			// 	this.lis[i].style.transform = "translateX(" + $(window).width() + "px)";
			// 	this.lis[i].style.webkitTransform = "translateX(" + $(window).width() + "px)";
			// }
            
        },
        //返回事件
        goBack: function(){
            // this.eventBus.on('remberH',function(){
            //     // console.log(arguments)
            //     var h = arguments[0]+0;
            // })
            // console.log(h)
            // location.href = '';
            // this.eventBus.trigger("scroll",h);
            // history.go(-1);
            this.$el.find('.layer').hide();
        },
        //切换显隐
        toggleTitle: function () {
			// 切换header 的hide类
			this.$el.find('.layer .header').toggleClass('hide')
		},
        //查找当前图片在新集合中的位置
        findIndex: function(){
            var self = this;
            //获取当前模型
            var thisChild = this.collection.filter(function(model,index,models){
                return model.get('id')== self.imageId;
            })
            //获取当前模型在新的集合中的位置
            var thisIdx = _.indexOf(this.linshiCol.models,thisChild[0]);
            return thisIdx;
        },

        //滑动显示图片
        show2Image: function(event){
            var thisIdx = this.findIndex();
            // console.log(thisIdx)
            console.log(event)
        }
    })
    module.exports = Layer;
})