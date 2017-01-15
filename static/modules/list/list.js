//创建显示列表项视图
define(function(require,exports,module){
    require('modules/list/list.css');
    var List = Backbone.View.extend({
        //绑定事件
        events: {
            //搜索事件
            'tap .search span': 'showSearchView',
            //列表分类事件
            'tap .type li span': 'showTypeView',
            //返回顶部
            'tap .go-top' : 'goTop',
            //拖动tap条事件
            'touchstart .typebus' : 'taptouchstart',
            'touchmove .typebus' : 'taptouchmove',
            'touchend .typebus' : 'taptouchend'
        },
        tpl: _.template('<a href="#layer/<%=id%>"><img style="<%=style%>" src="<%=url%>" alt="" /></a>'),
        //定义两遍盒子的宽高
        leftHeight : 0,
        rightHeight : 0,
        lock : true,
        
        initialize: function (options){
            var me = this;
            // this.listEvent = _.extend({},Backbone.Events);
            this.eventBus = options.eventBus;
            this.totallCollection = this.collection;
            //初始化DOM
            this.initDom();
            //订阅事件
            this.listenTo(this.collection, 'add', function (model, collection, options) {
				// 作用域就是视图实例化对象，
				this.render(model);
			})
            //页面卷动
            $(window).on('scroll', function () {
				// 判断条件
				// body高度  $('body').height()
				// scrollTop高度 $(window).scrollTop()
				// 窗口的高度  $(window).height()
				// if ($('body').height() < $(window).scrollTop() + $(window).height() + 200) {
				// 	// 加载图片
				// 	// 本质上就是请求数据
				// 	me.getData();
				// }

				// 返回顶部的交互
				me.showHideGoTop();
			})
            //拉取数据
            this.getData();
        //    this.tx = $('.typebus').css("transform").match(/-?\d+/)[0];
        this.tx = 0;
        },
        //拖动tap事件
        taptouchstart: function(event){
            var finger = event.touches[0];
            //开始位置
			this.startX = finger.clientX;
            this.dX = this.startX - this.tx;
        },
        taptouchmove: function(event){
            event.preventDefault();
            var finger = event.touches[0];
            //移动的坐标
			this.tx = finger.clientX - this.dX;
            // console.log(this.dX);
            // $('.typebus').style.transform = "translateX(" + this.dX + "px)";
            $('.typebus').css({
                'transform' : "translateX("  + this.tx + "px)"
            });
        },
        taptouchend: function(event){
            var max = $(window).width() - 560;
            if(this.tx>0){
                $('.typebus').animate({
                    'transform' : "translateX(0px)"
                },150,'ease-out');
                this.tx = 0;
            }else if(this.tx<max){
                $('.typebus').animate({
                    'transform' : "translateX("+ max +"px)"
                },150,'ease-out');
                this.tx = max;
            }
        },
        //初始化DOM方法
        initDom: function(){
            this.leftContainer = this.$el.find('.left-container');
			this.rightContainer = this.$el.find('.right-container');
        },
        //拉取数据方法
        getData: function () {
			// 通过集合拉去
			this.collection.fetchData();
		},
        //渲染方法
        render : function(model){
            //获取模型高度
            var height = model.get('viewHeight');
            //1)获取数据
            var data = {
                id: model.get('id'),
                url: model.get('url'),
                style: 'width: ' + model.get('viewWidth') + ';height: ' + height + ';'
            };
            //2)获取模板
            var tpl = this.tpl;
            //3)格式化模板
            var html = tpl(data);
            //4)渲染页面
            if (this.leftHeight > this.rightHeight) {
				// 向右边添加
				this.renderRight(html, height);
			} else {
				// 向左边添加
				this.renderLeft(html, height);
			}
        },
        //渲染左右边
        renderRight: function (html, height) {
			// 向右边的容器中插入这段模板代码
			this.rightContainer.append(html);
			// 修改高度
			this.rightHeight += height + 6;
		},
        renderLeft: function (html, height) {
			// 向左边容器中插入这段模板代码
			this.leftContainer.append(html);
			// 修改高度
			this.leftHeight += height + 6;
		},
        //事件
        //搜索事件
        //获取搜索框内容
        getSearchValue: function(){
            return this.$el.find(".search input").val();
        },
        //检查输入内容合法性
        checkInputValue: function (val) {
			// 判断输入的内容是空的，或者空白符
			if (/^\s*$/.test(val)) {
				// 提示用户
				alert('请输入搜索内容！');
				return false;
			}
			return true;
		},
        //根据关键词实例化对象
        searchCollectionByKey: function(val,type){
            var self = this;
            return this.totallCollection.filter(function(model,index,models){
                if(type ==='type'){
                    //需要更换集合
                    // console.log(child.collection)
                    var result = self.totallCollection.filter(function(model,index,models){
                        return(model.get('position').toString().indexOf(val)>-1);
                    });
                    // self.collection = result;
                    self.eventBus.trigger("changeCol",result);
                    // console.log(result)
                    return(model.get('position').toString().indexOf(val)>-1);
                }
                return ((model.get('name').indexOf(val)>-1)||(model.get('nickname').indexOf(val)>-1));
            })
        },

        //点击搜索的事件
        showSearchView: function(){
            var value = this.getSearchValue();
            if (!this.checkInputValue(value)) {
				// 停止执行业务逻辑
				return;
			}
            //去除收尾空格
            value = value.replace(/^\s+|\s+$/g, '');
            //得出符合结果的实例化对象
            var result = this.searchCollectionByKey(value,'');
            //清除页面内容并重新渲染
            this.clearView();
            this.resetView(result);
        },
        clearView: function(){
            // 清除左右容器
			this.leftContainer.html('');
			this.rightContainer.html('');
			// 清空高度
			this.leftHeight = 0;
			this.rightHeight = 0;
        },
        resetView: function(arr){
            for (var i = 0; i < arr.length; i++) {
				// arr[i]表示第i个模型实例化对象
				this.render(arr[i]);
                this.eventBus.trigger("search",true);
			}
        },

        //切换分类事件
        showTypeView: function(e){
            //获取触发事件的id
            var id = this.getDOMId(e.target);
            var position;
            switch(id){
                case '-1' : position = ''; break;
                case '0' : position = '战士'; break;
                case '1' : position = '法师'; break;
                case '2' : position = '坦克'; break;
                case '3' : position = '射手'; break;
                case '4' : position = '辅助'; break;
                case '5' : position = '刺客'; break;
            }
            //根据id实例化对象
            var result = this.searchCollectionByKey(position,'type');
            this.clearView();
			// 重新渲染页面
			this.resetView(result);
            this.eventBus.trigger("search",false);
            $('.type span').removeClass('cur');
            this.$el.find(e.target).addClass('cur');
            // console.log(this.$el.find(e.target))
        },
        getDOMId: function(dom){
            return $(dom).attr('data-id');
        },
        
        //返回顶部
        goTop: function(){
            // window.scrollTo(0, 0)
            var obtn=document.getElementById('go-top');
            var timer=null;
            var isTop=true;
            //获取页面可视区高度
            var clientHeight=document.documentElement.clientHeight;
            //滚动条滚动时触发
                timer=setInterval(function(){
                    //获取滚动条距顶部的高度，前者IE兼容
                    var osTop=document.documentElement.scrollTop ||document.body.scrollTop;
                    //小数点向下舍入取整  -为了防止osTop达不到0一直往上弹
                    var ispeed=Math.floor(-osTop/5);  
                    document.documentElement.scrollTop = document.body.scrollTop =osTop + ispeed;
                    // console.log(osTop);
                    isTop=true;
                    if(osTop==0){
                        clearInterval(timer);
                    }
                },30);
        },
        //显示返回顶部
        showHideGoTop: function () {
			if ($(window).scrollTop() > 300) {
				// 显示返回顶部
                if(this.lock){
                    this.$el.find('.go-top').fadeIn();
                    this.lock = false;
                }
			} else {
				// 隐藏返回顶部
                if(!this.lock){
                    this.$el.find('.go-top').fadeOut();
                    this.lock = true;
                }
			}
		}
    })
    module.exports = List;
})