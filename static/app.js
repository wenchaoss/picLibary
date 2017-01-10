define(function(require,exports,module){
    //引入模块
    var Layer = require('layer');
    var List = require('list');
    var ImageCollection = require('imageCollection');

    //实例化集合类
    var imageCollection1 = new ImageCollection();
    var imageCollection2 = new ImageCollection();
    var eventBus = _.extend({},Backbone.Events);



    // 实例化视图类
	
	// 列表页视图实例化对象
	var list = new List({
		// 定义容器元素
		el: $('#app'),
        collection: imageCollection1,
        eventBus : eventBus
	});
    // 大图页视图实例化对象
	var layer = new Layer({
		el: $('#app'),
        collection: imageCollection1,
        eventBus : eventBus
	});

    //配置路由
    var Router = Backbone.Router.extend({
        //路由规则
        routes: {
            //配置点开大图路由
            'layer/:id' : 'renderLayer',
            //配置首页列表路由
            '*other' : 'renderList'
        },
        //路由方法
        renderLayer : function(id){
            layer.render(id);
            layer.$el.find('.layer').css({"display":'block'});
        },
        renderList : function(){
            // list.render();
            layer.$el.find('.layer').hide();
        }
    })
    //实例化路由
    var router = new Router;
    module.exports = function(){
        //启动路由
        Backbone.history.start();
    }
})