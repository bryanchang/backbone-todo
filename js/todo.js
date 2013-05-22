var Todos;

$(document).ready(function(){

  // --------------------MODEL--------------------
  var Todo = Backbone.Model.extend({
    // attributes: title, createdAt, complete
    defaults: function() {
      return {
        title: "No title entered",
        createdAt: new Date(),
        complete: false
      };
    },

    toggle: function() {
      this.save({complete: !this.get("complete")});
    }
  });

  // --------------------COLLECTION--------------------
  var TodoList = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Backbone.LocalStorage('todos'),

    completed: function() {
      return this.filter(function(todo) {
        return todo.get('complete') === true;
      });
    },

    incomplete: function() {
      return this.filter(function(todo) {
        return !todo.get('complete');
      });
    }
  });

  Todos = new TodoList();

  // --------------------VIEWS--------------------

  // -------------Prepare TodoList-------------
  var TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#list-item-template').html()),
    events: {
      // $('.checkbox').on(click, toggleView);
      'click .checkbox': function() {
        this.model.toggle();
        this.remove();
      }
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  // --------------------Add/Edit/Show TodoList--------------------

  var AppView = Backbone.View.extend({
    el: $('#todoapp'),
    events: {
      "click #button": function() {
        // add a todo list
        Todos.create({title: this.input.val()});
        this.input.val('');
      }
    },
    initialize: function() {
      this.input = this.$('#new-todo');
      this.counter = this.$('#counter');
      this.listenTo(Todos, 'add change', function(todo) {
        var view = new TodoView({model: todo});
        if(todo.get('complete')){
          this.$('#todo-list').append(view.render().el);
        } else {
          this.$('#completed-list').append(view.render().el);
        };
      });
      this.listenTo(Todos, 'all', this.render);
      Todos.fetch();
    },

    counterTemplate: _.template($('#counter-template').html()),
    render: function() {
      // counts # of completed vs incomplete items
      var completed_num = Todos.completed().length;
      var incomplete_num = Todos.incomplete().length;
      this.counter.html(this.counterTemplate({
        completed: completed_num,
        incomplete: incomplete_num
      }));
    }
  });

  var App = new AppView();

});