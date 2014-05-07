
//-----------------------------------------------------------------------
// globals for this module
//-----------------------------------------------------------------------

  var boxSize = 40;
  var noseSize = 10;
  var noseOffset = (boxSize-noseSize)/2;
  /*
  // this gives every number a different color
  //
  var colors = [ "white", "red", "orange", "yellow", "green",  // 0-4
                 "cyan", "blue", "purple", "violet", "black" ]; // 5-9
  var colorsT = [ "black", "white", "black", "black", "black",
                  "black", "white", "white", "black", "white" ];
  */
  // This gives 1-4, 0, and 9 their own colors; 5-8 are light gray.
  //
  var colors = [ "white", "red", "orange", "yellow", "green",  // 0-4
                 "#eee", "#eee", "#eee", "#eee", "black" ]; // 5-9
  var colorsT = [ "black", "white", "black", "black", "white",
                  "black", "black", "black", "black", "white" ];

// ------------------------------- findCall ------------------------
function findCallByName (s)
{
  // Find the first call that starts with this text
  //   and return its index number.
  // This should use a binary search. But it's linear for now.
  //
  s = s.toLowerCase();
  /*
   * old = linear search
  for (var i=0; i<Data.defsData.length; i++) {
    if (s < Data.defsData[i][0].toLowerCase()) {
      return (i-1);
    }
  }
  */
  var bottom = 0;
  var top = Data.defsData.length;
  var middle = Math.round((top+bottom)/2);
  while (1) {
    if (s == Data.defsData[middle][0].toLowerCase()) {
      // found it
      return middle;
    }
    else if (s.length < Data.defsData[middle][0].length &&
        s == Data.defsData[middle][0].substr(0, s.length).toLowerCase())
      return middle;
    else if (top - bottom < 8) {
      // finish with a linear search
      for (var i=bottom; i<top; i++) {
        if (s == Data.defsData[i][0].toLowerCase()) 
          return (i);
        else if (s.length < Data.defsData[i][0].length &&
            s == Data.defsData[i][0].substr(0, s.length).toLowerCase())
          return i;
        else if (s < Data.defsData[i][0].toLowerCase()) 
          return (i-1);
      }
      return -1;
    }
    else if (s < Data.defsData[middle][0].toLowerCase()) {
      // search the lower half
      top = middle;
      middle = Math.round((top+bottom)/2);
    }
    else {
      // search the upper half
      bottom = middle;
      middle = Math.round((top+bottom)/2);
    } 
  }

  return (Data.defsData.length-1);
}

// ------------------------------- drawLink ------------------------
function drawLink (s)
{
  // From a string that has <f> and </f> tags, emit a link.
  // Recursive because there may be multiple <f> tags.
  //
  var start = s.indexOf ("<f>");
  if (start == -1)
    return s;
  
  var end = s.indexOf ("<\/f>");
  if (end == -1)
    return s;
  
  var call = s.substring (start+3, end);
  var index = findCallByName (call);
  var news = 
    s.substring(0,start) + "<a class='ui-btn ui-btn-inline ui-mini' data-ajax=\"false\" href=\"drawsvg.html?id=" + index +
    "&list=All&index=" + index + "\">" + call + "<\/a>" + s.substr(end+4);
  return drawLink(news);
}

// ------------------------------- showCall ------------------------
function showCall (callNum, increment)
{
  // get old values
  var c = getCallList (PageCall.callList);
  var index = PageCall.listIndex;

  // calculate new values
  var newIndex = parseInt(index) + increment;
  if (newIndex < 0) 
    newIndex = c.length - 1;
  else if (newIndex >= c.length)
    newIndex = 0;

  // save new values
  PageCall.listIndex = newIndex;
  PageCall.callNum = c[newIndex];
  drawCall();
}

// ------------------------------- isFavorite ------------------------
function isFavorite (callNum)
{
  var currentFavorites = localStorage.getItem("SquareFavorites");
  var favList = currentFavorites.split (", ");
  var nFav = favList.length;
  for (var i=0; i<nFav; i++) {
    favList[i] = parseInt (favList[i]);
  }
  for (var i=0; i<nFav; i++) {
    if (callNum == favList[i])
      return true;
  }
  return false;
}

// ------------------------------- addToFavorites ------------------------
function addToFavorites (callNum)
{
  // This is where we need to do some new-fangled HTML5 magic.
  var currentFavorites = localStorage.getItem("SquareFavorites");
  if (currentFavorites == null)
    localStorage.setItem("SquareFavorites", callNum + ", ");
  else
    localStorage.setItem("SquareFavorites", currentFavorites + callNum + ", ");
  drawCall();
}

// ------------------------------- removeFromFavorites ------------------------
function removeFromFavorites (callNum)
{
  var currentFavorites = localStorage.getItem("SquareFavorites");
  var favList = currentFavorites.split (", ");
  var nFav = favList.length;
  for (var i=nFav-1; i>=0; i--) {
    if (callNum == parseInt (favList[i]))
      favList.splice (i, 1);
    else if (isNaN (parseInt (favList[i])))
      favList.splice (i, 1);
    else if (parseInt (favList[i]) > Data.defsData.length)
      favList.splice (i, 1);
  } 
  var newFav = favList.join (", ");
  localStorage.setItem ("SquareFavorites", newFav + ", ");
  drawCall();
}

// ------------------------------- popup handlers ------------------------
$(function () {
  $("#addFavorite").click (function () {
    addToFavorites (PageCall.callNum);
  });
});

$(function () {
  $("#remFavorite").click (function () {
    removeFromFavorites (PageCall.callNum);
  });
});

$(function () {
  $("#prevcall").click (function () {
    showCall (PageCall.callNum, -1);
  });
});

$(function () {
  $("#nextcall").click (function () {
    showCall (PageCall.callNum, 1);
  });
});

$( window ).on( "swipeleft", function( event ) {
    showCall (PageCall.callNum, 1);
} );

$( window ).on( "swiperight", function( event ) {
    showCall (PageCall.callNum, -1);
} );

// ------------------------------- resetBoxSizeNoseSize ------------------------
function resetBoxSizeNoseSize ()
{
  boxSize = 40;
  noseSize = 10;
  noseOffset = (boxSize-noseSize)/2;
}

// ------------------------------- setBoxSizeNoseSize ------------------------
function setBoxSizeNoseSize (b, n)
{
  boxSize = b;
  noseSize = n;
  noseOffset = (boxSize-noseSize)/2;
}

// ------------------------------- debugInfo ------------------------
function debugInfo () 
{
  var callData = Data.defsData[PageCall.callNum];
  document.write (PageCall.callNum + "<br />\n");
  document.write (callData.length + "<br />\n");
  for (var i=0; i<callData.length; i++)
    document.write (i + ": " + callData[i] + "<br />\n");
}

// ------------------------------- codeToDirection ------------------------
function codeToDirection (code) 
{
  // input is one character: n, s, e, w, | - = o +
  switch (code) {
    case 'n': return "up"; 
    case 's': return "down"; 
    case 'e': return "right"; 
    case 'w': return "left"; 
    case '|': return "vert";
    case '-': return "horz";
    case '=': return "horz";
    case 'o': return "none";
    case '+': return "all";
    default: return "none"; 
  }
  return ("none");
}

//---------------------------- formatString ---------------------------------
function formatString (s, v)
{
  // sort of like printf
  //
  var rv = s;
    for (var i=0; i<v.length; i++) {
      rv = rv.replace ("%s", v[i]);
  }
  return rv;
}

//-------------------------- drawNose --------------------------------------
function drawNose (x, y, size)
{  
  // draw the little box that indicates facing direction
  //
  var noseString = formatString (
    "<rect x='%s' y='%s' height='%s' width='%s' fill='black' />\n", [ x, y, size, size]);
  return (noseString);
} 

// ------------------------------- svgImage ------------------------
function svgImage (num,dir)
{
  // alert (num + " " + dir);
  var svg = "";
  // don't draw rect for these invisibles
  if (/*dir != 'o' &&*/ dir != '.' && dir != ' ') {
    svg = formatString (
      "<rect x='%s' y='%s' height='%s' width='%s' stroke='black' stroke-width='1' fill='%s' />\n", 
      [noseSize, noseSize, boxSize, boxSize, colors[num] ]);
  }

  if (dir == "n" || dir == "|" || dir == "+") {
    svg += drawNose (noseSize+noseOffset, 0, noseSize);
  }
  if (dir == "s" || dir == "|" || dir == "+") {
    svg += drawNose (noseSize+noseOffset, noseSize+boxSize, noseSize);
  }
  if (dir == "w" || dir == "-" || dir == "+") {
    svg += drawNose (0, noseSize+noseOffset, noseSize);
  }
  if (dir == "e" || dir == "-" || dir == "+") {
    svg += drawNose (noseSize+boxSize, noseSize+noseOffset, noseSize);
  }
  
  var textOffsetH = boxSize * (1/4) + 2;
  var textOffsetV = boxSize * (3/4);
  var fontSize = boxSize * 2/3;
  var textString = formatString (
    "<text x='%s' y='%s' fill='%s' style='font-size:%spx;'>%s</text>\n",
    [noseSize+textOffsetH, noseSize+textOffsetV, colorsT [num], fontSize, 
      (num==0||num==9||num=='.')?" ":num]); 
  svg += textString;
  var fullSvg;
  if (dir == '.')
    fullSvg =  "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" " + 
      "height=\"" + ((boxSize+2*noseSize)/2) + "\" width=\"" + ((boxSize+2*noseSize)/2) + "\" >\n" +
        svg + "</svg>\n";
  else
    fullSvg =  "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" " + 
        "height=\"" + (boxSize+2*noseSize) + "\" width=\"" + (boxSize+2*noseSize ) + "\" >\n" + 
        svg + "</svg>\n";
  return (fullSvg); 
}

// ------------------------------- getImage ------------------------
function getImage (num, dir)
{
  return svgImage (num, dir);

  var imgfile = "";
  if (dir == '.')
    imgfile += "12x12";
  else if (dir == ' ')
    imgfile += "24x24";
  else {
    imgfile += num;
    imgfile += codeToDirection (dir);
  }
  return "<img src='../checkers/" + imgfile + ".gif' />\n";
}

// ------------------------------- drawRect ------------------------
function drawRect (dims, dirs, nums)
{
  var retval = "";

  // 4. Draw the figures using GIF or SVG
  // Weird: the first dimension is vertical, the second dimension is horizontal,
  //        and we draw bottom to top, and left to right;
  // 2. split 1st and 4th strings into dimensions: 2x4 or 4x2 etc.
  var dimxy = dims.split('x');

  if (dimxy[1] > 4) {
    var totalImageWidth = (window.innerWidth * 0.70) / dimxy[1];
    setBoxSizeNoseSize (Math.min(40,totalImageWidth * 2/3), 
                        Math.min(10,totalImageWidth * 1/6));
  }

  var which;
  for (var i=dimxy[0]-1; i>=0; i--) {
    for (var j=0; j<dimxy[1]; j++) {
      which = i*dimxy[1] + j;
      retval += getImage (nums[which], dirs[which]);
    }
    retval += "<br />\n";
  }

  if (dimxy[1] > 4) {
    resetBoxSizeNoseSize ();
  }

  return retval;
}

// ------------------------------- drawTag ------------------------
function drawTag (dirs, nums)
{
  // turn it into a rect
  var newDirs = ' ' + dirs.slice(0,2) + ' ' + dirs.slice(2,6) + ' ' + dirs.slice(6,8) + ' ';
  var newNums = ' ' + nums.slice(0,2) + ' ' + nums.slice(2,6) + ' ' + nums.slice(6,8) + ' ';
  return drawRect ("3x4", newDirs, newNums); 
}

// ------------------------------- drawDiamondSpacing ------------------------
function drawDiamondSpacing (dirs, nums)
{
  // draw a line with 1/2 spacing for diamond points
  var retval = "";
  // retval += getImage ('.', 0);
  retval += getImage (nums[0], dirs[0]);
  retval += getImage (' ', 0);
  retval += getImage (nums[1], dirs[1]);
  // retval += getImage ('.', 0);
  return retval;
}

// ------------------------------- drawDiamonds ------------------------
function drawDiamonds (dirs, nums)
{
  // similar to drawTag but uses 1/2 spaces
  var retval = "";
  retval += drawDiamondSpacing (dirs.slice(6,8), nums.slice(6,8));
  retval += "<br /><br />\n";

  for (var i=2; i<6; i++)
    retval += getImage (nums[i], dirs[i]);
  retval += "<br /><br />\n";

  retval += drawDiamondSpacing (dirs.slice(0,2), nums.slice(0,2));
  retval += "<br />\n";
  return retval;
}

// ------------------------------- drawVDiamond ------------------------
function drawVDiamond (dirs, nums)
{
  // similar to drawDiamonds but just one
  var retval = "";
  retval += getImage ('.', 0);
  retval += getImage (nums[3], dirs[3]);
  retval += getImage ('.', 0);
  retval += "<br /><br />\n";

  retval += getImage (nums[1], dirs[1]);
  retval += getImage (nums[2], dirs[2]);
  retval += "<br /><br />\n";

  retval += getImage ('.', 0);
  retval += getImage (nums[0], dirs[0]);
  retval += getImage ('.', 0);
  retval += "<br /><br />\n";
  return retval;
}

// ------------------------------- drawRTag ------------------------
function drawRTag (dirs, nums)
{
  // turn it into a rect
  var newDirs = ' ' + dirs[0] + ' ' + dirs.slice(1,4) + dirs.slice(4,7) + ' ' + dirs[7] + ' ';
  var newNums = ' ' + nums[0] + ' ' + nums.slice(1,4) + nums.slice(4,7) + ' ' + nums[7] + ' ';
  return drawRect ("4x3", newDirs, newNums);
}

// ------------------------------- drawSet ------------------------
function drawSet (dirs, nums)
{
  // turn into a rect
  var newDirs = ' ' + dirs.slice(0,2) + ' ' + dirs[2] + '  ' + dirs[3] +
                dirs[4] + '  ' + dirs[5] + ' ' + dirs.slice(6,8) + ' ';
  var newNums = ' ' + nums.slice(0,2) + ' ' + nums[2] + '  ' + nums[3] +
                nums[4] + '  ' + nums[5] + ' ' + nums.slice(6,8) + ' ';
  return drawRect ("4x4", newDirs, newNums);
}

// ------------------------------- drawDiamondPoint ------------------------
function drawDiamondPoint (dir, num, col)
{
  var retval = "";
  retval += "<div>\n";
  retval += getImage ('.', '.');
  retval += "<br />\n";
  retval += getImage (num, dir); 
  retval += "<br />\n";
  retval += getImage ('.', '.');
  retval += "<br />\n";
  retval += "<\/div>\n";
  return retval;
}

// ------------------------------- drawDiamond ------------------------
function drawDiamond (dirs, nums)
{
  // this one is funky because the C++ code has a table that we want to eliminate
  // we'll try using spans and divs instead
  // 
  var retval = "";
  retval += "<div class='diamond'>\n";
  retval += drawDiamondPoint (dirs[1], nums[1], "col1");

  retval += "<div>\n";
  retval += getImage (nums[3], dirs[3]);
  retval += "<br />\n";
  retval += getImage (nums[0], dirs[0]);
  retval += "<br />\n";
  retval += "<\/div>\n";

  retval += drawDiamondPoint (dirs[2], nums[2], "col3");
  retval += "<\/div>\n";
  return retval;
}

// ------------------------------- drawHourglass ------------------------
function drawHourglass (dirs, nums)
{
  var retval = "";
  retval += getImage (nums[6], dirs[6]);
  retval += getImage ('.', '.');
  retval += getImage (nums[7], dirs[7]);

  retval += drawDiamond (dirs.slice(2,6), nums.slice(2.6));

  retval += getImage (nums[0], dirs[0]);
  retval += getImage ('.', '.');
  retval += getImage (nums[1], dirs[1]); 
  return retval;
}

// ------------------------------- drawVDiamonds ------------------------
function drawVDiamonds (dirs, nums)
{
  var retval = "";
  retval += drawDiamond (dirs.slice(4,8), nums.slice(4,8));
  retval += drawDiamond (dirs.slice(0,4), nums.slice(0,4));
  return retval;
}

// ------------------------------- drawFormation ------------------------
function drawFormation (dims, dirs, nums) 
{
  if (dims == "tag")
    return drawTag (dirs, nums);
  else if (dims == "rtag")
    return drawRTag (dirs, nums);
  else if (dims == "diamond")
    return drawDiamond (dirs, nums);
  else if (dims == "vdiamond")
    return drawVDiamond (dirs, nums);
  else if (dims == "diamonds")
    return drawDiamonds (dirs, nums);
  else if (dims == "vdiamonds")
    return drawVDiamonds (dirs, nums);
  else if (dims == "set")
    return drawSet (dirs, nums);
  else if (dims == "hourglass")
    return drawHourglass (dirs, nums);
  else if (dims.indexOf ('x') != -1)
    return drawRect (dims, dirs, nums);
  else
    return "unknown picture<br />\n";
}

// ------------------------------- drawFigure ------------------------
function drawFigure (dims, dirs, nums, caption) 
{
  var retval = "";

  // 3. Start first figure
  retval += "<figure>\n";
  retval += "<div>\n";

  // 4. Draw the figures using GIF or SVG
  retval += drawFormation (dims, dirs, nums);

  // 5. Draw the caption 
  retval += "<\/div>\n";
  retval += "<figcaption>" + caption + "<\/figcaption>\n";

  // 6. End the first figure
  retval += "<\/figure>\n";

  return retval;
}

// ------------------------------- drawPictureSet ------------------------
function drawPictureSet (s) 
{
  var retval = "";

  // 1. split into 6 strings: 3 before and 3 after
  var pieces = s.split('"');
  for (var i=12; i>=0; i-=2)
    pieces.splice (i, 1);

  retval += drawFigure (pieces[0], pieces[1], pieces[2], "Before");
  retval += drawFigure (pieces[3], pieces[4], pieces[5], "After");

  return retval;
}

// ------------------------------- drawPictureSet ------------------------
function drawPictureSequence (s)
{
  var retval = "";

  // split into N strings where N is a multiple of 4
  var pieces = s.split('"');
  var nPieces = pieces.length;
  for (var i=nPieces-1; i>=0; i-=2)
    pieces.splice (i, 1);

  var nFigures = pieces.length / 4;
  for (var i=0; i<nFigures; i++) {
    retval += drawFigure (pieces[i*4+0], pieces[i*4+1], pieces[i*4+2], pieces[i*4+3]);
  }
  return retval;
}

// ------------------------------- drawTableElement ------------------------
function drawTableElement (id, data) 
{
  if (data.length > 0)
    document.getElementById (id).innerHTML = data;
  else
    document.getElementById (id).parentElement.style.display = "none";
}

// ------------------------------- drawDefinition ------------------------
function drawDefinition (callData) 
{
  var len = callData.length;
  var def = "";

  for (var i=15; i<len; i++) {
    if (callData[i].substr(0,8) == "PicClark" ||
        callData[i].substr(0,9) == "PictureBA")
      def += drawPictureSet (callData[i]);
    else if (callData[i].substr(0,10) == "PictureSeq")
      def += drawPictureSequence (callData[i]);
    else if (callData[i].indexOf ("<f>") != -1) {
      // do the Cf. call
      def += "<p>" + drawLink (callData[i]) + "<\/p>\n";
    }
    else
      def += "<p>" + callData[i] + "<\/p>\n";
  }
  document.getElementById ("definition").innerHTML = def; 
}

// ------------------------------- drawCall ------------------------
function drawCall () 
{
  // alert (PageCall.callNum + " " + PageCall.listIndex);
  var callData = Data.defsData[PageCall.callNum];
  var len = callData.length;
  var def = "";

  // call name and level are always drawn
  document.getElementById ("draw_h1").innerHTML = callData[0];
  document.getElementById ("draw_h2").innerHTML = callData[0];
  document.getElementById ("callname").innerHTML = callData[0];
  document.getElementById ("remname").innerHTML = callData[0];
  document.getElementById ("level").innerHTML = callData[2];

  drawTableElement ("author", callData[4]);
  drawTableElement ("start", callData[5]);
  drawTableElement ("end", callData[6]);

  document.getElementById ("start").innerHTML = callData[5];
  document.getElementById ("end").innerHTML = callData[6];

  if (callData[1].length > 0)
    document.getElementById ("unified").innerHTML = callData[1].replace (/ /g, "&ndash;");
  else
    document.getElementById ("unified").parentElement.style.display = "none";

  drawTableElement ("ceder", callData[3]);
  drawTableElement ("burleson", callData[9]);
  drawTableElement ("kopman", callData[10]);
  drawTableElement ("jayking", callData[11]);

  if (callData[13].length > 0)
    document.getElementById ("cederlink").href = "http://www.ceder.net/def/def_by_handle.php4?handle=" + callData[13];
  else 
    document.getElementById ("cederlink").className += " ui-state-disabled";
  
  if (callData[14].length > 0)
    document.getElementById ("tamlink").href = "http://www.tamtwirlers.org/tamination/" + callData[14];
  else 
    document.getElementById ("tamlink").className += " ui-state-disabled";

  // mixed-up is always enabled
  document.getElementById ("mixedlink").href = "http://www.mixed-up.com/dict/" + callData[0].replace (/ /g, "+") + "/";

  drawDefinition (callData);
  /*
  for (var i=15; i<len; i++) {
    if (callData[i].substr(0,8) == "PicClark" ||
        callData[i].substr(0,9) == "PictureBA")
      def += drawPictureSet (callData[i]);
    else if (callData[i].substr(0,10) == "PictureSeq")
      def += drawPictureSequence (callData[i]);
    else
      def += "<p>" + callData[i] + "<\/p>\n";
  }
  document.getElementById ("definition").innerHTML = def; 
  */
  document.title = callData[0];

  var nav = document.getElementById ("mynavbar2"); // was mynavbar
  var img = nav.getElementsByTagName ("img")[1];
  var link = nav.getElementsByTagName ("a")[1];
  if (isFavorite (PageCall.callNum)) {
    img.src = "images/redstar.svg";
    link.href = "#remove"; 
  }
  else {
    img.src = "images/blkstar.svg";
    link.href = "#verify"; 
  }
  
  window.onresize = function () { drawDefinition (callData); };
}

  /*
  document.getElementById ("ceder").innerHTML = callData[3];
  document.getElementById ("burleson").innerHTML = callData[9];
  document.getElementById ("kopman").innerHTML = callData[10];
  document.getElementById ("jayking").innerHTML = callData[11];
  */
