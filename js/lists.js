
// ------------------------------- intersect ------------------------
function intersect (a, b)
{
  var retval = [];
  var lena = a.length;
  var lenb = b.length;
  var i=0;
  var j=0;
  while (i<lena && j<lenb) {
    if (a[i] < b[j]) {
      i++;
    }
    else if (a[i] > b[j]) {
      j++;
    }
    else {
      retval.push (a[i]);
      i++;
      j++;
    }
  }
  return retval;
}

/*
$("#calls").live("pageshow", function(e) {
  var query = $(this).data("url").split("?")[1];;
  query = query.replace("id=","");
  alert (query);
});
*/

// ------------------------------- getId ------------------------
function getId ()
{
  var url = document.location.href;
  var query = url.split("\?")[1];
  var id = query.split("\=")[1];
  return id;
}

// var callList = [];

// ------------------------------- getFavoritesCallList ------------------------
function getFavoritesCallList ()
{
  // alert (">> getFavoritesCallList");
  var newList = [];

  // get the items from local storage
  var favorites = localStorage.getItem ("SquareFavorites");
  if (favorites == null)
    return newList;

  // alert (favorites);
  var favoritesList = favorites.split (", ");
  // alert (favoritesList);
  var nf = favoritesList.length;
  for (var i=0; i<nf; i++)
    favoritesList[i] = parseInt (favoritesList[i]);

  // some are no good, delete them
  for (var i=0; i<nf; i++) {
    if (!isNaN(favoritesList[i]) &&
        newList.indexOf (favoritesList[i]) < 0 &&
        favoritesList[i] < Data.defsData.length)
      newList.push (favoritesList[i]);
  }
  // then sort the list numerically
  newList.sort (function (a,b){return a-b;}); 
  // alert (newList);
  // alert (newList.length);
  return (newList);
}

// ------------------------------- makeAllCallsList ------------------------
function makeAllCallsList ()
{
  var retval = [];
  var numCalls = Data.defsData.length;
  for (var i=0; i<numCalls; i++)
    retval.push(i);
  return retval;
}

// ------------------------------- getCallList ------------------------
function getCallList (id)
{
  var callList = [];
  // var callListPics = [];
  switch (id) {
    case "U" : callList = Data.unified; break;
    case "C1" : callList = Data.c1; break;
    case "C2" : callList = Data.c2; break;
    case "C3" : callList = Data.c3; break;
    case "C3A" : callList = Data.c3a; break;
    case "C3B" : callList = Data.c3b; break;
    case "C3X" : callList = Data.c3x; break;
    case "C4A" : callList = Data.c4a; break;
    case "C4B" : callList = Data.c4b; break;
    case "C4Z" : callList = Data.c4z; break;
    case "I" : callList = Data.cold; break;
    case "Fav" : callList = getFavoritesCallList(); break;
    case "All" : callList = makeAllCallsList(); break;
  }
  /*
  // alert ("callList = " + callList);
  if (id != "All")
    callListPics = intersect (callList, Data.pictures);
  else 
    callListPics = Data.pictures;
  return callListPics; 
  */
  return callList;
}

// ------------------------------- getCallListPics ------------------------
function getCallListPics (id, callList)
{
  var calListPics = [];
  if (id != "All")
    callListPics = intersect (callList, Data.pictures);
  else 
    callListPics = Data.pictures;
  return callListPics; 
}

// ------------------------------- initCallsPage ------------------------
function initCallsPage ()
{
  var id = getId();
  var callList = getCallList(id);
  var callListPics = getCallListPics(id, callList);
  // alert ("callList = " + callList);
  // alert ("callListPics = " + callListPics);
  var callListText = "";
  var bHasImage;
  var bIsBookmark;
  var favoritesList = [];

  var favorites = localStorage.getItem ("SquareFavorites");
  if (favorites != null) {
    var favoritesList = favorites.split (", ");
    var nf = favoritesList.length;
    for (var i=0; i<nf; i++) {
      favoritesList[i] = parseInt(favoritesList[i]);
    }
  }

  // alert (Data.length);
  // alert (Data.currentList);
  // Data.currentList = new Array();
  /*
  while (Data.currentList.length > 0)
    Data.currentList.pop();
  for (var i=0; i<callList.length; i++)
    Data.currentList.push (callList[i]);
  */
  Data.currentList = "foo";
  // alert (Data.currentList);
  // alert (Object.keys(Data));

  // alert (callList.length);
  // if (callList.length > 0) {
    for (var i=0; i<callList.length; i++) {
      var thisCall = "";
      bHasImage = (callListPics.indexOf(callList[i]) != -1);
      bIsBookmark = (favoritesList.indexOf(callList[i]) != -1);
      thisCall += "\n<li>\n<a data-ajax='false' href=\"drawsvg.html?id=" + callList[i] + 
        "&list=" + id + "&index=" + i + "\">" +
        (bIsBookmark ? "\n<img class='ui-li-icon' src='images/redstar.svg'>" :
          (bHasImage ? "\n<img class='ui-li-icon' src='images/darkcirc.svg'>" : 
          "\n<img class='ui-li-icon' src='images/graycirc.svg'>")) + 
        // "<span>" + Data.defsData[callList[i]][0] + "<\/span><\/a><\/li>\n";
        Data.defsData[callList[i]][0] + "<\/a><\/li>\n";
      callListText += thisCall;
    }
  // }
  /*
  else {
    for (var i=0; i<Data.defsData.length; i++) {
      var thisCall = "";
      bHasImage = (callListPics.indexOf(i) != -1);
      bIsBookmark = (favoritesList.indexOf(i) != -1);
      thisCall += "<li><a data-ajax='false' href=\"drawsvg.html?id=" + i + "\">" +
        (bIsBookmark ? "<img class='ui-li-icon' src='images/redstar.svg'>" :
          (bHasImage ? "<img class='ui-li-icon' src='images/darkcirc.svg'>" : 
          "<img class='ui-li-icon' src='images/graycirc.svg'>")) + 
        // "<span>" + Data.defsData[i][0] + "<\/span><\/a><\/li>\n";
        Data.defsData[i][0] + "<\/a><\/li>\n";
      callListText += thisCall;
    }
  }
  */

  /*
  for (var i=0; i<callListPics.length; i++) {
    var thisCall = "";
    thisCall += "<li><a data-ajax='false' href=\"drawsvg.html?id=" + callListPics[i] + "\">" +
      Data.defsData[callListPics[i]][0] + "<\/a><\/li>\n";
    callListText += thisCall;
  }
  */
  document.getElementById ("callList").innerHTML = callListText;
  if (id == "U") {
    document.title = document.getElementById ("calls_h1").innerHTML = "Unified List";
  }
  else if (id == "I") {
    document.title = document.getElementById ("calls_h1").innerHTML = "Deprecated Calls";
  }
  else if (id == "Fav") {
    document.title = document.getElementById ("calls_h1").innerHTML = "My Favorite Calls";
  }
  else {
    document.title = document.getElementById ("calls_h1").innerHTML = id + " Calls";
  }
}

