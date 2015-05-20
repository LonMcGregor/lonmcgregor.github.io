//Sidebar
var HEADERBOX = 160;
var FOOTERBOX = 140;
var MIDDLEFRM = 049;
var MIDDLEPAD = 000;
var EXTRAS = 0 + HEADERBOX + FOOTERBOX + MIDDLEFRM + MIDDLEPAD; 
var SIDELIST = "#siteList";

function calcSideListHeight(){
    return (Math.floor(window.innerHeight) - EXTRAS);
}

function setSideListHeight(){
    return $(SIDELIST).css("height", "" + calcSideListHeight() + "px");
}

function prepFilter(){
    $('#filter').filterList();
}


//Main content
var MCONTENT = "#content" ;

function calcMContentHeight(){
    return Math.floor(window.innerHeight);
}

function setMContentHeight(){
    return $(MCONTENT).css("height", "" + calcMContentHeight() + "px");
}




function addListener(){
    $(window).on("resize", function() {
       setSideListHeight(); 
       setMContentHeight();
    });
}


$(document).ready(function(){
    setSideListHeight();
    setMContentHeight();
    addListener();
    prepFilter();
});