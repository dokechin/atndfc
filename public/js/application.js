$(function(){

    var Event = Backbone.Model.extend();
 
    var Records = Backbone.Collection.extend({
        model: Event,
        url: 'events'
    });

    var SearchFormView = Backbone.View.extend({
        el: "#searchForm",
        events: {
          "submit" : "eventsView.events"
        },
        initialize: function(){
            this.render();
        }        
    });

    var EventsView = Backbone.View.extend({

        el: "#calendar",

        initialize: function(){
            this.render();
        },
        render: function() {
            this.$el.fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay',
                    ignoreTimezone: false
                },
                events: function(start, end, callback) {
                    records.on('reset', function(){ 
                        callback (records.toJSON());
                        records.off('reset');}
                    );
                    records.fetch({reset:true, data:{start: start.getTime() ,end: end.getTime()}});
                },
                selectable: true,
                selectHelper: true,
                editable: false

            });
        }
    });
 
    var records = new Records();
    var eventsView = new EventsView();
    var searchFormView = new SearchFormView();

});