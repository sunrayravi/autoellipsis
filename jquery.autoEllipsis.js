/**
 * Created by sunray on 3/2/17.
 */
String.prototype.escapeHTML = function(){
  var result = "";
  for(var i = 0; i < this.length; i++){
    if(this.charAt(i) == "&"
      && this.length-i-1 >= 4
      && this.substr(i, 4) != "&amp;"){
      result = result + "&amp;";
    } else if(this.charAt(i)== "<"){
      result = result + "&lt;";
    } else if(this.charAt(i)== ">"){
      result = result + "&gt;";
    }  else if(this.charAt(i)== "$"){
      result = result + "&#36;";
    } else {
      result = result + this.charAt(i);
    }
  }
  return result;
};

function escapeHTML(str) {
  var div = document.createElement('div');
  var text = document.createTextNode(str);
  div.appendChild(text);
  return div.innerHTML;
}

function unescapeHTML(str) {
  var div = document.createElement('div');
  div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
  return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
}
$.fn.autoEllipsis = function(text, options) {
  if (!options) options = {};
  var elements = $(this);
  var lines = options.lines || 1;
  var truncationChr = options.trucationChar || "&#x2026;";
  var showTitle = options.showTitle || true;
  $.each(elements, function() {
    var element = $(this);
    var width = options.width || element.attr("offsetWidth") - element.getPadding("right") - element.getPadding("left");
    var eleHeight = options.height || element.attr("offsetHeight");
    var originalText = text || element.html();
    originalText = unescapeHTML(originalText);
    element.html("");
    var mySpan = document.createElement("span");
    mySpan = $(mySpan).addClass("autowrapSpan");
    element.append(mySpan);
    mySpan.html('<span>' + escapeHTML(originalText) + '</span>');
    if (mySpan.attr("offsetWidth") > width || (eleHeight > 0 && mySpan.attr("offsetHeight") > eleHeight)) {
      var displayText = originalText;
      mySpan.html('');
      for (var x = 0; (lines == 0 || x < lines); x++) {
        if (x > 0) {
          mySpan.append("<br/>");
        }
        var newspan = document.createElement("span");
        newspan = $(newspan);
        mySpan.append(newspan);
        var i = 1;
        var thisLine = displayText;
        newspan.html(escapeHTML(thisLine));
        i = displayText.length * width / newspan.attr("offsetWidth");
        thisLine = displayText.substr(0, i);
        newspan.html(escapeHTML(thisLine));
        if (newspan.attr("offsetWidth") > width) {
          while (newspan.attr("offsetWidth") > width && i > 0) {
            thisLine = displayText.substr(0, i);
            i--;
            newspan.html(escapeHTML(thisLine));
          }
        } else {
          while (newspan.attr("offsetWidth") <= width && i <= displayText.length) {
            thisLine = displayText.substr(0, i);
            i++;
            newspan.html(escapeHTML(thisLine));
          }
        }
        if (newspan.attr("offsetWidth") > width) {
          thisLine = thisLine.substr(0, thisLine.length - 1);
          newspan.html(escapeHTML(thisLine));
        }
        displayText = displayText.substr(thisLine.length, displayText.length);
        if (displayText.length == 0 || thisLine.length == 0) {
          break;
        }
      }
      if (truncationChr != null && displayText != '') {
        var beforeTruncation = thisLine;
        newspan.html(escapeHTML(thisLine) + truncationChr);
        while (newspan.attr("offsetWidth") > width) {
          if (thisLine.length - 1 < 0) {
            newspan.html(escapeHTML(beforeTruncation));
            break;
          }
          thisLine = thisLine.substr(0, thisLine.length - 1);
          newspan.html(escapeHTML(thisLine) + truncationChr);
        }
      }
    } else {
      element.innerHTML = originalText;
    }
    if (showTitle) {
      element.attr("title",originalText);
    }
  });
};

$.fn.autoEllipsisByWord = function(text, options) {
  if(typeof text == "object"){
    options = text;
    text = '';
  }
  if (!options) options = {};
  var elements = $(this);
  var lines = options.lines || 1;
  var truncationChr = options.trucationChar || "&#x2026;";
  var showTitle = options.showTitle || true;
  $.each(elements, function() {
    var element = $(this);
    var width = options.width || element.width() - element.getPadding("right") - element.getPadding("left");
    var eleHeight = options.height || element.attr("offsetHeight");
    var originalText = text || element.html();
    originalText = unescapeHTML(originalText);
    element.html("");
    var mySpan = $('<span class="autowrapSpan"></span>');
    element.append(mySpan);
    mySpan.html('<span>' + originalText.escapeHTML() + '</span>');
    if (mySpan.width() > width || (eleHeight > 0 && mySpan.height() > eleHeight)) {
      var displayText = originalText;
      mySpan.html('');
      for (var x = 0; (lines == 0 || x < lines); x++) {
        if (x > 0) {
          mySpan.append("<br/>");
        }
        var newspan = $("<span/>");
        mySpan.append(newspan);
        var i = 1;
        var thisLine = displayText;
        newspan.html(thisLine.escapeHTML());
        var tempStr = '';
        if (newspan.width() > width) {
          i = displayText.length * width / newspan.width();
          thisLine = displayText.substr(0, i);
          thisLine = thisLine.substr(0,thisLine.lastIndexOf(' '));
          i = thisLine.length;
          newspan.html(thisLine.escapeHTML());
          while (newspan.width() > width && i > 0) {
            tempStr = displayText.substr(0, i);
            var strEnd = tempStr.lastIndexOf(' ') > tempStr.lastIndexOf('-') ? tempStr.lastIndexOf(' ') : tempStr.lastIndexOf('-');
            thisLine = tempStr.substr(0,strEnd);
            i = thisLine.length;
            newspan.html(thisLine.escapeHTML());
          }
        } else {
          while (newspan.width() <= width && i <= displayText.length) {
            tempStr = displayText.substr(thisLine.length+1, displayText.length);
            var index = tempStr.indexOf(' ') != -1 ? tempStr.indexOf(' ') : tempStr.length;
            thisLine += " "+tempStr.substr(0, index);
            i = thisLine.length;
            newspan.html(thisLine.escapeHTML());
          }
        }
        if (newspan.width() > width) {
          thisLine = thisLine.substr(0, thisLine.lastIndexOf(' '));
          newspan.html(thisLine.escapeHTML());
        }
        displayText = displayText.substr(thisLine.length+1, displayText.length);
        if (displayText.length == 0 || thisLine.length == 0) {
          break;
        }
      }
      if (truncationChr != null && displayText != '') {
        var beforeTruncation = thisLine;
        newspan.html(thisLine.escapeHTML() + truncationChr);
        while (newspan.width() > width) {
          if (thisLine.length - 1 < 0) {
            newspan.html(beforeTruncation.escapeHTML());
            break;
          }
          thisLine = thisLine.substr(0, thisLine.lastIndexOf(' '));
          newspan.html(thisLine.escapeHTML() + truncationChr);
        }
      }
    } else {
      element.innerHTML = originalText;
    }
    if (showTitle) {
      element.attr("title", originalText);
    }
  });
};

$.fn.getPadding = function(side) {
  var paddingStr = $(this).css("padding-" + side);
  if (paddingStr.indexOf("px") != -1) {
    paddingStr = paddingStr.substr(0, paddingStr.length - 2);
    return parseInt(paddingStr);
  }
  return 0;
};