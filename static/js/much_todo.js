var ToDoApp = new (Backbone.View.extend({
	Models: {},
	Views: {},
	Collections:{}
}))();

ToDoApp.Models.ToDo = Backbone.Model.extend({
	urlRoot: '/muchtodo/todos',
	defaults: function(){
		return {
			'todo': 'Nothing...',
			'complete': false
		}
	}, 
	toggleComplete: function(){
		this.set({'complete': !this.get('complete')});
		this.save();
	}
});

ToDoApp.Views.ToDoView = Backbone.View.extend({
	initialize: function(){
    _.bindAll(this, 'render', 'remove');
    this.model.bind('change', this.render);
    this.model.bind('destroy', this.remove);
  },
  events:{
  	'change input': 'toggleComplete',
  	'click i': 'kill'
  },
	template: _.template($('#todo-template').html()),
	tagName: 'span',
	className: 'todo-item',
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	kill: function(){
		this.model.destroy();
	},
	remove: function(){
		this.$el.remove();
	},
	toggleComplete: function(){
		this.model.toggleComplete();
	}
});

ToDoApp.Collections.ToDoList = Backbone.Collection.extend({
	model: ToDoApp.Models.ToDo,
	url: '/muchtodo/todos',
	parse: function(response){
		return response.todos
	}
});

ToDoApp.Views.ToDoListView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, 'render', 'addOne', 'addAll');
    this.collection.bind('add', this.addOne);
    this.collection.bind('reset', this.addAll);
	},
	el: $('#items'),
	render: function(){
		this.addAll();
	},
	addOne: function(todo){
		var todoView = new ToDoApp.Views.ToDoView({model: todo});
		this.$el.append(todoView.render().el);
		todo.save();
	}, 
	addAll: function(){
		this.collection.forEach(this.addOne);
	}
});

ToDoApp.App = new (Backbone.Router.extend({
	routes: {'': 'index'},
	initialize: function(){
		this.todoList = new ToDoApp.Collections.ToDoList();
		this.todoListView = new ToDoApp.Views.ToDoListView({collection: this.todoList});
		//this.todoListView.render();
	},
	start: function(){
		Backbone.history.start({pushState: true});
	},
	index: function(){
		this.todoList.fetch();	
	}
}));

$(function(){
	ToDoApp.App.start();
});



