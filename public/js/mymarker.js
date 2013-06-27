
    var MyMarker = function(model) { 
        google.maps.Marker.call(this,model);
    }

    MyMarker.prototype = new google.maps.Marker();
    MyMarker.prototype.heading = null;

    MyMarker.prototype.setHeading = function(heading){

        this.heading = heading;

   }

    MyMarker.prototype.getHeading = function() {
        return this.heading;
    }