
    var MyPolyline = function(model) { 
        google.maps.Polyline.call(this,model);
    }

    MyPolyline.prototype = new google.maps.Polyline();
    MyPolyline.prototype.dist = [];
    MyPolyline.prototype.check = [];
    MyPolyline.prototype.total_dist = 0;
    MyPolyline.prototype.old_dist_index = 0;
    MyPolyline.checking_interval = 1;
    MyPolyline.prototype.checking_dist = MyPolyline.checking_interval;
    MyPolyline.prototype.address = null;
    MyPolyline.prototype.name = null;
    MyPolyline.prototype.id = null;

    MyPolyline.prototype.setPath = function(path){

       google.maps.Polyline.prototype.setPath.call(this,path);
    
        if (path.length ==0){

            var len = this.check.length;
            for(var i=0; i<len ; i++) {
                this.check[i].setMap(null);
            }

            this.dist = [];
            this.check = [];
            this.total_dist = 0;
            this.old_dist_index = 0;
            this.checking_dist = MyPolyline.checking_interval;

            return;
        }

        this.total_dist =  Math.round(google.maps.geometry.spherical.computeLength(path))/1000;
        this.dist = [];

        var len = path.length, total = 0;
        for(var i=0; i<len-1 ; i++) { 
            total += Math.round(google.maps.geometry.spherical.computeDistanceBetween(path[i],path[i+1])) / 1000;
            this.dist.push(total);
        }

       
       
       this.renderCheck();
       this.old_dist_index = this.dist.length;

   }

    MyPolyline.prototype.renderCheck = function() {
       
        if (this.old_dist_index > this.dist.length){
            for(var i=this.dist.length; i>this.old_dist_index; i--){
                if (this.checing_dist != Math.floor(this.dist[i])){ 
                    check_marker = this.check.pop;
                    check_marker.setMap(null);
                    this.checking_dist = this.checking_dist - MyPolyline.checking_interval;
                }
            }
            return;
        }

        var path = this.getPath();
        for(var i=this.old_dist_index; i<this.dist.length; i++){
            while(1){
              
                if ( this.dist[i] >= this.checking_dist){
                    remain_distance = (this.checking_dist - ((i==0)? 0 : this.dist[i-1]))*1000;
                    heading = google.maps.geometry.spherical.computeHeading(path.getAt(i),path.getAt(i+1));
                    checkpoint = google.maps.geometry.spherical.computeOffset( path.getAt(i),remain_distance,heading);
                    var checkimg = new google.maps.MarkerImage("/img/km/" + this.checking_dist + "km_icon.png",
                              new google.maps.Size(40, 29),
                              new google.maps.Point(0, 0),
                              new google.maps.Point(20, 29)
                    );
                    check_marker = new MyMarker({position: checkpoint, map: this.map, title: "" + this.checking_dist + "km", icon: checkimg});
                    check_marker.setHeading(heading);
                    this.check.push(check_marker);
                    this.checking_dist = this.checking_dist + MyPolyline.checking_interval;
                }
                else{
                    break;
                }
            }
        }
    }

    MyPolyline.prototype.inKm = function() {
        return this.total_dist;
    }

    MyPolyline.prototype.getCheck = function() {
        return this.check;
    }

    MyPolyline.prototype.getAddress = function() {
        return this.address;
    }

    MyPolyline.prototype.setAddress = function(address) {
        this.address = address;
    }

    MyPolyline.prototype.getName = function() {
        return this.name;
    }

    MyPolyline.prototype.setName = function(name) {
        this.name = name;
    }

    MyPolyline.prototype.getId = function() {
        return this.id;
    }

    MyPolyline.prototype.setAddress = function(id) {
        this.name = id;
    }

