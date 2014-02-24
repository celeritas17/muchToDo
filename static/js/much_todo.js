var ToDo = Backbone.Model.extend({
	urlRoot: '/muchtodo/todos',
	defaults: function(){
		return {
			'todo': 'Nothing...',
			'complete': false
		}
	}, 
	toggleComplete: function(){
		this.set({'complete': this.get('complete') === true ? false : true});
		this.save();
	}
});

var ToDoView = Backbone.View.extend({
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

var ToDoList = Backbone.Collection.extend({
	model: ToDo,
	url: '/muchtodo/todos',
	parse: function(response){
		return response.todos
	}
});

var ToDoListView = Backbone.View.extend({
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
		var todoView = new ToDoView({model: todo});
		this.$el.append(todoView.render().el);
		todo.save();
	}, 
	addAll: function(){
		this.collection.forEach(this.addOne);
	}
});

var todoList = new ToDoList();
todoList.fetch();
var todoListView = new ToDoListView({collection: todoList});
todoListView.render();


