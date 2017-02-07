//定义图片模型
define(function(require,expors,module){
    //图片真实的宽度
    var w = ($(window).width()-6*3)/2;
    var ImageModel = Backbone.Model.extend({
        initialize : function(obj){
            h = w/obj.width * obj.height;
            this.attributes.viewWidth = w;
            this.attributes.viewHeight = h;
        }
    });
    module.exports = ImageModel;
})