$(function(){

    //Backbone.Eventsのクローン
     var mediator = {};

     _.extend(mediator, Backbone.Events);

    var Event = Backbone.Model.extend();

    var Keyword = Backbone.Model.extend({
         defaults: {
          id : 0,
          "keyword" : ''},
         localStorage: new Store("keyword"),
         initialize: function(){
            this.fetch({id:0});
         },
         hozon: function(){
             this.save();
         }
    });
 
//    var Records = Backbone.Collection.extend({
//        model: Event,
//       url: 'events'
//    });

    var SearchFormView = Backbone.View.extend({
        el: "#searchForm",
        initialize: function (){
          $("#keyword").val(keyword.get("keyword"));
        },
        events: {
          "submit" : "search",
          "change #keyword" : "keyword"
        },
        //イベントの発火
        search: function(){
            mediator.trigger('change:some');
        },
        keyword: function(){
            keyword.set('keyword', $("#keyword").val());
            keyword.hozon();
        }
    
    });

    var EventsView = Backbone.View.extend({

        el: "#calendar",

        initialize: function(){
            this.render();
            mediator.on('change:some', this.render,this);
            this.$el.fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month agendaDay',
                    ignoreTimezone: false
                },
                events: function (start,end,callback){

                      $(".meter-value").width("0%");
                      $(".meter-text").html("0%");

                     var params = {
                          url: 'http://api.atnd.org/events/',
                          dataType: 'jsonp',
                          data: {
                              // our hypothetical feed requires UNIX timestamps
                              format: "jsonp",
                              start: 1,
                              count: 1,
                              keyword: keyword.get("keyword")
                         }
                     };

                     var firsts = [];

                     if ((end.getTime() - start.getTime()) > (86400000 * 7)){
                         var start_month_day = start.getTime() + 86400000  * 7;
                         var start_date = new Date;
                         start_date.setTime(start_month_day);
                         params.data.ym = $.fullCalendar.formatDate(start_date, 'yyyyMM');
                         firsts.push($.ajax(params));
                     }
                     else{
                         var date_str = "";
                         var i = 0;
                         while(true){
                             var date = new Date;
                             date.setTime(start.getTime() + 86400000 *i);
                             if (date > end.getTime()){
                                 break;
                             }
                             params.data.ymd = $.fullCalendar.formatDate(date, 'yyyyMMdd');
                             firsts.push($.ajax(params));
                             i++;
                         }
                     }
                     
                     $.when.apply(undefined, firsts).done(

                          function(doc) {

                              total_fetch_count = 0;
                              fetchedcount = 0;
                              

                              var total = doc.results_available;

                              var fetch_count = Math.floor(total / 10) + (total % 10 != 0 ? 1 : 0);

                              total_fetch_count = total_fetch_count + fetch_count;

                              var ajaxes = [];

                              for (var j = 0; j<fetch_count;j++){
                                  params.data.count = 10;
                                  params.data.start = 10 * j + 1;

                                  var ajax = $.ajax(params).then(function(doc){
  
                                      for(var i=0; i<doc.events.length; i++){
                                          if (_.isEmpty(doc.events[i].started_at)){
                                              continue;
                                          }
                                          if (_.isEmpty(doc.events[i].ended_at)){
                                              continue;
                                          }
                                          var start_time = $.fullCalendar.parseISO8601( doc.events[i].started_at).getTime();
                                          var end_time = $.fullCalendar.parseISO8601( doc.events[i].ended_at).getTime();

                                          var span =  end_time - start_time;
                                          if (span > 86400000) {
                                              continue;
                                          }
                                          events.push({
                                              title: doc.events[i].title,
                                              url: doc.events[i].event_url,
                                              start: doc.events[i].started_at ,
                                              end:   doc.events[i].ended_at ,
                                              allDay: false
                                          });
                                      }
                                      fetchedcount = fetchedcount + 1;
                                      $(".meter-value").width((fetchedcount/total_fetch_count) * 100 + "%");
                                      $(".meter-text").html(Math.floor((fetchedcount/total_fetch_count) * 100) + "%");
                                  });
                                  ajaxes.push(ajax);
                              }

                              $.when.apply(undefined, ajaxes).done(
 
                                  function(args){
                                      $(".meter-value").width("0%");
                                      $(".meter-text").html("完了");
                                      callback(events);
                                  }
                              );
                          }
                     );
                },
                selectable: true,
                selectHelper: true,
                editable: false
            });
        },

        render: function() {
             events = [];
             this.$el.fullCalendar( 'refetchEvents' );
             this.$el.fullCalendar( 'rerenderEvents' );
             this.$el.fullCalendar( 'render' );
        }
    });

    var events = []; 
//    var records = new Records();
    var keyword = new Keyword();
    var eventsView = new EventsView();
    var searchFormView = new SearchFormView();
    var total_fetch_count;
    var fetchedcount;
});