$(function() {

	var todoModel = Backbone.Model.extend({
		defaults : {
			id : null,
			name : null
		},
		urlRoot : '/api/job'
	});

	var todoCollection = Backbone.Collection.extend({
		model : todoModel,
		url : '/api/listJob'
	});

	var todoView = Backbone.View.extend({
		template : $('#template-item-job').html(),
		tagName : 'li',
		events : {
			'click .remove-job' : 'removeJob'
		},

		initialize : function() {
			this.render();
		},

		render : function() {
			var __this = this;
			var html = Mustache.to_html(this.template,this.model);
			$('#job-list').append(__this.$el.html(html));
		},

		removeJob : function() {
			var __this = this;
			console.log(__this.model);
			// Xóa model
			var todo = new todoModel({
				id : __this.model._id
			});

			todo.destroy({
				success : function() {
					// Xóa item
					__this.$el.remove();
				}
			});
		}
	});

	var totoListView = Backbone.View.extend({
		el : $('#form-todo'),
		events : {
			'keyup #job-name' : 'addJob'
		},
		initialize : function() {
			var __this = this;
			__this.render();
		},

		render : function() {
			var __this = this;

			_.each(this.collection.models, function(model) {
				__this.renderItemJob(model.toJSON());
			});
		},

		renderItemJob : function(job) {
			new todoView({
				model : job
			});
		},

		addJob : function(e) {
			e.preventDefault();

			var __this = this;

			var keyBoard = e.keyCode || e.which;
			if(keyBoard === 13) {
				var data = {
					name : $('#job-name').val()
				};

				var todo = new todoModel();

				todo.save(data, {
					success : function(response) {
						var model = response.toJSON().data;

						__this.renderItemJob(model);
						$('#job-name').val('');
					}
				});

				__this.collection.add(data);
			}
		}
	});

	var app = new todoCollection();

	app.fetch({
		success : function(res) {
			new totoListView({
				collection : res
			});
		}
	});
});