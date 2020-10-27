// init map
var mapTools = new MapTools();

$("#draw-btn").click(function () {
    var geometryFiledValue = $("#geometry-field").val();
    var geometryType = $('input[name=geometryType]:checked').val();
    var srid = $('input[name=srid]:checked').val();
    var clearPreviousChecked = $('input[name=clear]').is(':checked');

    // clear input
    geometryFiledValue = clearInput(geometryFiledValue);

    // polyline is 4326
    if(geometryType === "PolyLine" && srid === 3857){
        showAlert("PolyLine is only valid in EPSG:4326 srid!");
        return;
    }

    // geometry field validation
    if(geometryFiledValue === ''){
        showAlert("No geometry specified!");
        return;
    }
    if(geometryType === ''){
        showAlert("Please select the geometry type! (WKT or PolyLine?)");
        return;
    }
    $("#alert-message-wrap").hide();


    var sridText = "EPSG:" + srid;

    try {
        switch (geometryType){
            case 'WKT':
                mapTools.drawWKT(geometryFiledValue, sridText, clearPreviousChecked);
                break;
            case 'PolyLine':
                mapTools.drawPolyLine(geometryFiledValue, clearPreviousChecked);
                break;
            case 'LngLat':
                mapTools.drawWKT("Point(" + geometryFiledValue.replace(",", " ") + ")", sridText, clearPreviousChecked);
                break;
            case 'LatLng':
                mapTools.drawWKT("Point(" + geometryFiledValue.split(",")[1] + " " + geometryFiledValue.split(",")[0] + ")", sridText, clearPreviousChecked);
                break;
        }
    }
    catch (e){
        showAlert("Geometry is not in a correct format!");
    }
});

$("#bottom-panel-arrow-area").click(function () {
    var arrow = $("#bottom-panel-arrow");
    arrow.toggleClass("glyphicon-chevron-up");
    arrow.toggleClass("glyphicon-chevron-down");

    if(arrow.hasClass("glyphicon-chevron-up")){
        $("#tools-area-wrap").slideUp();
    }
    else{
        $("#tools-area-wrap").slideDown();
    }
});

function clearInput(input) {
    return input
        .trim()
        .replace("\\\\", "\\")
        .replace("\"", "")
        .replace("\'", "");
}

function showAlert(text) {
    var alertMessageWrap = $("#alert-message-wrap");
    alertMessageWrap.hide();
    $("#alert-message").text(text);
    alertMessageWrap.slideDown();
}