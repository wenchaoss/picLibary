//定义图片模型
define(function(require,expors,module){
    //求图片真实的宽度
    var w = ($(window).width()-6*3)/2;
    
    //创建图片模型类
    var ImageModel = Backbone.Model.extend({
        initialize : function(obj){
            //适配模型数据，为图片模型添加真实的宽高
            //求图片的高度
            h = w/obj.width * obj.height;
            //适配模型，添加宽高
            this.attributes.viewWidth = w;
            this.attributes.viewHeight = h;
        }
    });
    module.exports = ImageModel;
})