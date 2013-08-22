/**
 * Force Access-Control-Allow-Origin
 *
 * Ideally, we'll want to actually set the header server side instead.
 */
var allowedOrigins = ['https://localhost:8000', 'http://localhost:8000', 'http://hp-alm-js.github.io', 'https://hp-alm-js.github.io'];
var requestHosts = {};
var types = {
  urls: ['https://qc2d.atlanta.hp.com/qcbin/*'],
  types: ['xmlhttprequest', 'other']
};

chrome.webRequest.onBeforeSendHeaders.addListener(function onHeadersReceived(det) {
   det.requestHeaders.map(function(el) {
       if (el.name == "Origin") {
           console.log(el.value)
           requestHosts[det.requestId] = el.value;
       }
   });
   console.log(det.requestHeaders);
}, types, ['blocking', 'requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener(function onHeadersReceived(resp) {
  var origin = requestHosts[resp.requestId];
  console.log(origin);
  if (allowedOrigins.indexOf(origin) != -1) {
  console.log("allowed domain")
  resp.responseHeaders.push({
    'name': 'Access-Control-Allow-Credentials',
    'value': 'true'
  });
  resp.responseHeaders.push({
    'name': 'Access-Control-Allow-Methods',
    'value': 'POST, GET, OPTIONS'
  });
  resp.responseHeaders.push({
    'name': 'Access-Control-Allow-Headers',
    'value': 'Authorization, origin, content-type, accept, Cookie'
  });
  resp.responseHeaders.push({
    'name': 'Access-Control-Allow-Origin',
    'value': origin
  });
  }
  return {responseHeaders: resp.responseHeaders};
}, types, ['blocking', 'responseHeaders']);

