//图片集合模块
define(function(require,exports,module){
    //创建图片的集合，需要图片的模型,在配置里面定义过路径
    var ImageModel = require('imageModel');
    //创建集合类
    var ImageCollection = Backbone.Collection.extend({
        model : ImageModel,
        imageId : 0,
        //异步获取数据方法
        fetchData: function(){
            //保存集合实例化对象
            var me = this;
            $.get('data/imageList.json',function(res){
                if(res&&res.errno===0) {
                    for(var i = 0;i<res.data.length;i++){
                        res.data[i].id = ++me.imageId;
                    }
                    me.add(res.data);
                }
            })
        }
    })
    module.exports = ImageCollection;
})