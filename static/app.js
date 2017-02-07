define(function(require,exports,module){
    var Layer = require('layer');
    var List = require('list');
    var ImageCollection = require('imageCollection');

    var imageCollection1 = new ImageCollection();
    var imageCollection2 = new ImageCollection();
    var eventBus = _.extend({},Backbone.Events);



	
	var list = new List({
		el: $('#app'),
        collection: imageCollection1,
        eventBus : eventBus
	});
	var layer = new Layer({
		el: $('#app'),
        collection: imageCollection1,
        eventBus : eventBus
	});

    var Router = Backbone.Router.extend({
        routes: {
            'layer/:id' : 'renderLayer',
            '*other' : 'renderList'
        },
        renderLayer : function(id){
            layer.render(id);
            layer.$el.find('.layer').css({"display":'block'});
        },
        renderList : function(){
            // list.render();
            layer.$el.find('.layer').hide();
        }
    })
    var router = new Router;
    module.exports = function(){
        Backbone.history.start();
    }
})