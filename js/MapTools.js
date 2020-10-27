class MapTools {
    constructor() {
        var openStreetMap = new ol.layer.Tile({
            source: new ol.source.OSM({
                opaque: false,
                url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

        this.map = new ol.Map({
            layers: [
                openStreetMap
            ],
            target: 'map',
            controls: ol.control.defaults({
                attributionOptions: {
                    collapsible: false
                }
            }),
            view: new ol.View({
                maxZoom: 20,
                center: [5720824.2811, 4259319.6364],
                zoom: 17
            })
        });
    }

    drawWKT(wktGeometry, sourceProjection, clearPreviousChecked) {
        const wktFormat = new ol.format.WKT();
        var feature = wktFormat.readFeature(wktGeometry, {
            dataProjection: sourceProjection,
            featureProjection: 'EPSG:3857'
        });

        if(clearPreviousChecked){
            this.map.removeLayer(this.geometryLayer);
            this.geometryLayer = null;
        }

        if(this.geometryLayer != null) {
            this.geometryLayer.getSource().addFeature(feature);
        }
        else {
            this.geometryLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                }),
                style: MapTools.getStyleByWKTType(wktGeometry)
            });

            this.map.addLayer(this.geometryLayer);
        }

        this.map.getView().fit(MapTools.transformWKTGeometry(wktGeometry, sourceProjection, 'EPSG:3857'), this.map.getSize());
    }

    // Sets style based on the wkt type, eg: point, linestring, ...
    static getStyleByWKTType(wktGeometry) {
        var style;
        if (wktGeometry.toLowerCase().indexOf('point') > -1) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    stroke: new ol.style.Stroke({
                        color: '#001bce',
                        width: 4
                    })
                })
            })
        }
        else {
            style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#001bce',
                    width: 4
                })
            })
        }

        return style;
    }

    drawPolyLine(polyline, clearPreviousChecked) {
        if(clearPreviousChecked){
            this.map.removeLayer(this.geometryLayer);
            this.geometryLayer = null;
        }

        var geometry = MapTools.convertPolyLineToGeometry(polyline);
        var feature = new ol.Feature({
            geometry: geometry
        });

        if(this.geometryLayer != null){
            this.geometryLayer.getSource().addFeature(feature);
        }
        else{
            this.geometryLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [feature]
                }),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#001bce',
                        width: 4
                    })
                })
            });
            this.map.addLayer(this.geometryLayer);
        }

        this.map.getView().fit(geometry, this.map.getSize());
    }

    static convertPolyLineToGeometry(polyline) {
        var format = new ol.format.Polyline();
        var geometry = format.readGeometry(polyline);
        geometry.transform('EPSG:4326', 'EPSG:3857');
        return geometry;
    }


    static transformWKTGeometry(wktGeometry, sourceProjection, destinationProjection) {
        var wktFormat = new ol.format.WKT();
        var geometry = wktFormat.readGeometry(wktGeometry);
        return geometry.transform(sourceProjection, destinationProjection);
    }
}
