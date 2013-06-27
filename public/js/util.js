function createXmlHttpRequest() {
 try {
   if (typeof ActiveXObject != 'undefined') {
     return new ActiveXObject('Microsoft.XMLHTTP');
   } else if (window["XMLHttpRequest"]) {
     return new XMLHttpRequest();
   }
 } catch (e) {
   changeStatus(e);
 }
 return null;
};
function downloadUrl(url, type, callback) {
 var status = -1;
 var request = createXmlHttpRequest();
 if (!request) {
   return false;
 }
 request.onreadystatechange = function() {
   if (request.readyState == 4) {
     try {
       status = request.status;
     } catch (e) {
     }
     if (status == 200) {
       callback(request.responseXML, request.status);
       request.onreadystatechange = function() {};
     }
   }
 }
 request.open(type, url, true);
 try {
   request.send(null);
 } catch (e) {
   changeStatus(e);
 }
};
function xmlParse(str) {
  if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  }
  if (typeof DOMParser != 'undefined') {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }
  return createElement('div', null);
}
function downloadScript(url) {
  var script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}