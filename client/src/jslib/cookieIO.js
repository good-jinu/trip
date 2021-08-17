function setCookie(cookieName, cookieValue, cookieExpire, cookiePath, cookieDomain, cookieSecure) {
  var cookieText = escape(cookieName)+'='+escape(cookieValue);
  cookieText+=(cookieExpire ? '; expires=' + cookieExpire.toGMTString() : '');
  cookieText+=(cookiePath ? '; path='+cookiePath : '');
  cookieText+=(cookieDomain ? '; domain='+cookieDomain : '');
  cookieText+=(cookieSecure ? '; secure' : '');
  document.cookie=cookieText;
}

function getCookie(cookieName) {
  var cookieValue=null;
  if(document.cookie) {
    var array=document.cookie.split((escape(cookieName)+'='));
    if(array.length >= 2) {
      var arraySub=array[1].split(';');
      cookieValue=unescape(arraySub[0]);
    }
  }
  return cookieValue;
}

function deleteCookie(cookieName) {
  var temp=getCookie(cookieName);
  if(temp) {
    setCookie(cookieName,temp,(new Date(1)));
  }
}

export {setCookie, getCookie, deleteCookie};
