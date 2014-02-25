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

ToDoApp.Views.AddForm = Backbone.View.extend({
	template: _.template($('#add-todo-template').html()),
	el: $('#add_todo'),
	events: {
		submit: 'save'
	},
	render: function(){
		this.$el.append(this.template(this.model.toJSON()));	
	}, 
	save: function(e){
		e.preventDefault();
		var todo_text = this.$('input[name=todo]').val();
		if (todo_text != ''){
			var todo = {todo: todo_text};
			ToDoApp.App.todoList.add(new ToDoApp.Models.ToDo(todo));
			this.$('input[name=todo]').val('')
		}
	}
});

ToDoApp.Views.ToDoCountView = Backbone.View.extend({
	initialize: function(){
		this.listenTo(this.collection, 'change destroy reset', this.render);
	},
	el: $('#todos_left'),
	render: function(){
		this.$el.html(this.collection.where({'complete': false}).length + ' items left');	
	}, 
});

ToDoApp.Views.MarkAllCompleteView = Backbone.View.extend({
	el: $('#mark_complete'),
	events:{
		'click': 'markAllComplete'
	},
	markComplete: function(todo){
		todo.set({'complete': true});
		todo.save();
	},
	markAllComplete: function(){
		this.collection.forEach(this.markComplete);
	},
	initialize: function(){
		_.bindAll(this, 'markAllComplete');
	}
});

ToDoApp.App = new (Backbone.Router.extend({
	routes: {'': 'index'},
	initialize: function(){
		this.todoList = new ToDoApp.Collections.ToDoList();
		this.todoListView = new ToDoApp.Views.ToDoListView({collection: this.todoList});
		this.newTodo = new ToDoApp.Models.ToDo({'todo': 'What needs to be done?'});
		this.addTodo = new ToDoApp.Views.AddForm({model: this.newTodo});
		this.addTodo.render();
		this.todoCountView = new ToDoApp.Views.ToDoCountView({collection: this.todoList});
		this.markAllCompleteView = new ToDoApp.Views.MarkAllCompleteView({collection: this.todoList});
	},
	start: function(){
		Backbone.history.start({pushState: true});
	},
	index: function(){
		this.todoList.fetch({reset: true});	
	}
}));

$(function(){
	ToDoApp.App.start();
});



