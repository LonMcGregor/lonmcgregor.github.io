var HEADERBOX = 160;
var FOOTERBOX = 140;
var MIDDLEFRM = 045;
var MIDDLEPAD = 032;
var EXTRAS = 0 + HEADERBOX + FOOTERBOX + MIDDLEFRM + MIDDLEPAD; 
var SIDELIST = "#outerSiteUl";

function calcSideListHeight(){
    return (window.innerHeight - EXTRAS);
}

function setSideListHeight(){
    return $(SIDELIST).css("height", "" + calcSideListHeight() + "px");
}

function addListener(){
    $(window).on("resize", function() {
       setSideListHeight(); 
    });
}

$(document).ready(function(){
    setSideListHeight();
    addListener();
});