(function () {
    "use strict";

    Cesium.BingMapsApi.defaultKey = 'At36HWsCzUCdp9mDZXKXChHywJ4Rzt7OHdw-VLodUMknjJVR5VVS-E-BCanlX8W-'; // For use with this application only

    //////////////////////////////////////////////////////////////////////////
    // Creating the Viewer
    //////////////////////////////////////////////////////////////////////////

    // var viewer = new Cesium.Viewer('cesiumContainer');
    //
    /*
    var viewer = new Cesium.Viewer('galaxy', {
        imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
            url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        }),
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false,
        animation: false,
        timeline: false
    });*/
    var viewer = new Cesium.Viewer('galaxy', {
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false,
        animation: false,
        timeline: false
    });

    //////////////////////////////////////////////////////////////////////////
    // Loading Imagery
    //////////////////////////////////////////////////////////////////////////

    // Add Bing imagery
    // viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
    //     url : 'https://dev.virtualearth.net',
    //     mapStyle: Cesium.BingMapsStyle.AERIAL // Can also use Cesium.BingMapsStyle.ROAD
    // }));

    //////////////////////////////////////////////////////////////////////////
    // Loading Terrain
    //////////////////////////////////////////////////////////////////////////

    // // Load STK World Terrain
    // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    //     url : 'https://assets.agi.com/stk-terrain/world',
    //     requestWaterMask : true, // required for water effects
    //     requestVertexNormals : false // required for terrain lighting
    // });
    // // Enable depth testing so things behind the terrain disappear.
    // viewer.scene.globe.depthTestAgainstTerrain = true;

    //////////////////////////////////////////////////////////////////////////
    // Configuring the Scene
    //////////////////////////////////////////////////////////////////////////

    // // Enable lighting based on sun/moon positions
    // viewer.scene.globe.enableLighting = true;
    //
    // // Create an initial camera view
    // var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
    // var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    // var homeCameraView = {
    //     destination : initialPosition,
    //     orientation : {
    //         heading : initialOrientation.heading,
    //         pitch : initialOrientation.pitch,
    //         roll : initialOrientation.roll
    //     }
    // };
    // // Set the initial view
    // viewer.scene.camera.setView(homeCameraView);
    //
    // // Add some camera flight animation options
    // homeCameraView.duration = 2.0;
    // homeCameraView.maximumHeight = 2000;
    // homeCameraView.pitchAdjustHeight = 2000;
    // homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
    // // Override the default home button
    // viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
    //     e.cancel = true;
    //     viewer.scene.camera.flyTo(homeCameraView);
    // });
    //
    // // Set up clock and timeline.
    // viewer.clock.shouldAnimate = true; // default
    // viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    // viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
    // viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
    // viewer.clock.multiplier = 2; // sets a speedup
    // viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
    // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
    // viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range

    //////////////////////////////////////////////////////////////////////////
    // Loading and Styling Entity Data
    //////////////////////////////////////////////////////////////////////////

    // var kmlOptions = {
    //     camera : viewer.scene.camera,
    //     canvas : viewer.scene.canvas,
    //     clampToGround : true
    // };
    // // Load geocache points of interest from a KML file
    // // Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
    // var geocachePromise = Cesium.KmlDataSource.load('./Source/SampleData/sampleGeocacheLocations.kml', kmlOptions);
    //
    // // Add geocache billboard entities to scene and style them
    // geocachePromise.then(function(dataSource) {
    //     // Add the new data as entities to the viewer
    //     viewer.dataSources.add(dataSource);
    //
    //     // Get the array of entities
    //     var geocacheEntities = dataSource.entities.values;
    //
    //     for (var i = 0; i < geocacheEntities.length; i++) {
    //         var entity = geocacheEntities[i];
    //         if (Cesium.defined(entity.billboard)) {
    //             // Adjust the vertical origin so pins sit on terrain
    //             entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    //             // Disable the labels to reduce clutter
    //             entity.label = undefined;
    //             // Add distance display condition
    //             entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
    //             // Compute latitude and longitude in degrees
    //             var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
    //             var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
    //             var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
    //             // Modify description
    //             var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
    //             description += '<tr><th>' + "Latitude" + '</th><td>' + latitude + '</td></tr>';
    //             description += '<tr><th>' + "Longitude" + '</th><td>' + longitude + '</td></tr>';
    //             description += '</tbody></table>';
    //             entity.description = description;
    //         }
    //     }
    // });
    //
    // var geojsonOptions = {
    //     clampToGround : true
    // };
    // // Load neighborhood boundaries from a GeoJson file
    // // Data from : https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas/cpf4-rkhq
    // var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('./Source/SampleData/sampleNeighborhoods.geojson', geojsonOptions);
    //
    // // Save an new entity collection of neighborhood data
    // var neighborhoods;
    // neighborhoodsPromise.then(function(dataSource) {
    //     // Add the new data as entities to the viewer
    //     viewer.dataSources.add(dataSource);
    //     neighborhoods = dataSource.entities;
    //
    //     // Get the array of entities
    //     var neighborhoodEntities = dataSource.entities.values;
    //     for (var i = 0; i < neighborhoodEntities.length; i++) {
    //         var entity = neighborhoodEntities[i];
    //
    //         if (Cesium.defined(entity.polygon)) {
    //             // Use kml neighborhood value as entity name
    //             entity.name = entity.properties.neighborhood;
    //             // Set the polygon material to a random, translucent color
    //             entity.polygon.material = Cesium.Color.fromRandom({
    //                 red : 0.1,
    //                 maximumGreen : 0.5,
    //                 minimumBlue : 0.5,
    //                 alpha : 0.6
    //             });
    //             // Generate Polygon center
    //             var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
    //             var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
    //             polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
    //             entity.position = polyCenter;
    //             // Generate labels
    //             entity.label = {
    //                 text : entity.name,
    //                 showBackground : true,
    //                 scale : 0.6,
    //                 horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
    //                 verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
    //                 distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 8000.0),
    //                 disableDepthTestDistance : Number.POSITIVE_INFINITY
    //             };
    //         }
    //     }
    // });
    //
    // // Load a drone flight path from a CZML file
    // var dronePromise = Cesium.CzmlDataSource.load('./Source/SampleData/SampleFlight.czml');
    //
    // // Save a new drone model entity
    // var drone;
    // dronePromise.then(function(dataSource) {
    //     viewer.dataSources.add(dataSource);
    //     drone = dataSource.entities.values[0];
    //     // Attach a 3D model
    //     drone.model = {
    //         uri : './Source/SampleData/Models/CesiumDrone.gltf',
    //         minimumPixelSize : 128,
    //         maximumScale : 2000
    //     };
    //     // Add computed orientation based on sampled positions
    //     drone.orientation = new Cesium.VelocityOrientationProperty(drone.position);
    //
    //     // Smooth path interpolation
    //     drone.position.setInterpolationOptions({
    //         interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
    //         interpolationDegree : 2
    //     });
    //     drone.viewFrom = new Cesium.Cartesian3(-30, 0, 0);
    // });

    //////////////////////////////////////////////////////////////////////////
    // Load 3D Tileset
    //////////////////////////////////////////////////////////////////////////

    // // Load the NYC buildings tileset
    // var city = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    //     url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s',
    //     maximumScreenSpaceError: 16 // default value
    // }));
    //
    // // Adjust the tileset height so it's not floating above terrain
    // var heightOffset = -32;
    // city.readyPromise.then(function(tileset) {
    //     // Position tileset
    //     var boundingSphere = tileset.boundingSphere;
    //     var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    //     var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    //     var offsetPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
    //     var translation = Cesium.Cartesian3.subtract(offsetPosition, surfacePosition, new Cesium.Cartesian3());
    //     tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    // });

    //////////////////////////////////////////////////////////////////////////
    // Style 3D Tileset
    //////////////////////////////////////////////////////////////////////////

    // // Define a white, opaque building style
    // var defaultStyle = new Cesium.Cesium3DTileStyle({
    //     color : "color('white')",
    //     show : true
    // });
    //
    // // Set the tileset style to default
    // city.style = defaultStyle;
    //
    // // Define a white, transparent building style
    // var transparentStyle = new Cesium.Cesium3DTileStyle({
    //     color : "color('white', 0.3)",
    //     show : true
    // });
    //
    // // Define a style in which buildings are colored by height
    // var heightStyle = new Cesium.Cesium3DTileStyle({
    //     color : {
    //         conditions : [
    //             ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
    //             ["${height} >= 200", "rgb(102, 71, 151)"],
    //             ["${height} >= 100", "rgb(170, 162, 204)"],
    //             ["${height} >= 50", "rgb(224, 226, 238)"],
    //             ["${height} >= 25", "rgb(252, 230, 200)"],
    //             ["${height} >= 10", "rgb(248, 176, 87)"],
    //             ["${height} >= 5", "rgb(198, 106, 11)"],
    //             ["true", "rgb(127, 59, 8)"]
    //         ]
    //     }
    // });
    //
    // var tileStyle = document.getElementById('tileStyle');
    // function set3DTileStyle() {
    //     var selectedStyle = tileStyle.options[tileStyle.selectedIndex].value;
    //     if (selectedStyle === 'none') {
    //         city.style = defaultStyle;
    //     } else if (selectedStyle === 'height') {
    //         city.style = heightStyle;
    //     } else if (selectedStyle === 'transparent') {
    //         city.style = transparentStyle;
    //     }
    // }
    // tileStyle.addEventListener('change', set3DTileStyle);

    //////////////////////////////////////////////////////////////////////////
    // Custom mouse interaction for highlighting and selecting
    //////////////////////////////////////////////////////////////////////////

    // // If the mouse is over a point of interest, change the entity billboard scale and color
    // var previousPickedEntity;
	
    var scene = viewer.scene;
    //var mercator = new Cesium.WebMercatorProjection;

    /*
    var entity = viewer.entities.add(
        {
            label: {
                show: false,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.TOP,
                pixelOffset : new Cesium.Cartesian2(15, 0)
            }
        }
    )*/

    $("#buy-grid").hide();
    $("#sell-grid").hide();   
    $("#oper-grid").hide();

    window.addEventListener('load', function() {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
          // Use Mist/MetaMask's provider
          window.web3 = new Web3(web3.currentProvider);
          if(registryAddresses.hasOwnProperty(web3.version.network)){
              $("#network").html(networkName[web3.version.network]);
          } else {
              $("#status-network").html("Unknown");
              return;
          }
        } else {
          console.log('No web3? You should consider trying MetaMask!')
          $("#status-network").html("no ether network found");
          return;
        }
      
        var earth = window.earth = InitEarthContract(web3, registryAddresses[web3.version.network]);
        $("#status-contract").html(registryAddresses[web3.version.network]);

        
        var galaxy = window._galaxyApis = {};
        StartEarth(earth, viewer, galaxy);

    });

    
    

    

    //////////////////////////////////////////////////////////////////////////
    // Setup Camera Modes
    //////////////////////////////////////////////////////////////////////////

    // var freeModeElement = document.getElementById('freeMode');
    // var droneModeElement = document.getElementById('droneMode');
    //
    // // Create a follow camera by tracking the drone entity
    // function setViewMode() {
    //     if (droneModeElement.checked) {
    //         viewer.trackedEntity = drone;
    //     } else {
    //         viewer.trackedEntity = undefined;
    //         viewer.scene.camera.flyTo(homeCameraView);
    //     }
    // }
    //
    // freeModeElement.addEventListener('change', setViewMode);
    // droneModeElement.addEventListener('change', setViewMode);
    //
    // viewer.trackedEntityChanged.addEventListener(function() {
    //     if (viewer.trackedEntity === drone) {
    //         freeModeElement.checked = false;
    //         droneModeElement.checked = true;
    //     }
    // });

    //////////////////////////////////////////////////////////////////////////
    // Setup Display Options
    //////////////////////////////////////////////////////////////////////////

    // var shadowsElement = document.getElementById('shadows');
    // var neighborhoodsElement =  document.getElementById('neighborhoods');
    //
    // shadowsElement.addEventListener('change', function (e) {
    //     viewer.shadows = e.target.checked;
    // });
    //
    // neighborhoodsElement.addEventListener('change', function (e) {
    //     neighborhoods.show = e.target.checked;
    //     tileStyle.value = 'transparent';
    //     city.style = transparentStyle;
    // });
    //
    // // Finally, wait for the initial city to be ready before removing the loading indicator.
    // var loadingIndicator = document.getElementById('loadingIndicator');
    // loadingIndicator.style.display = 'block';
    // city.readyPromise.then(function () {
    //     loadingIndicator.style.display = 'none';
    // });

    function StartEarth(earth, viewer, galaxy){
        galaxy.refresh_earth_status = function(){
            earth.gridSold(function(err, sold){
                if(err){
                    //TODO:
                } else {
                    $("#status-sold-grids").html(sold);
                }
            });

            earth.mapSize(function(err, size){
                if(err){
                    //TODO:
                } else {
                    $("#status-total-grids").html(size * size);
                }
            });
        
            earth.fee(function(err, fee){
                if(err){
                    //TODO:
                } else {
                    $("#status-tran-fee").html(fee/1000);
                }
            });
        
            earth.minimalPrice(function(err, price){
                if(err){
                    //TODO:
                } else {
                    $("#status-min-price").html(web3.fromWei(price) + " ETH");
                }
            });
        }
        
        galaxy.refresh_player_stauts = function(){
            earth.GridsCount(web3.eth.coinbase, function(err, count){
                if(err){
                    //TODO:
                } else {
                    $("#player-address").html(web3.eth.coinbase);
                    $("#player-grids-count").html(count);
    
                    for(var i = 0; i < count; i ++){
                        earth.ownedGrids(web3.eth.coinbase, i, function(err, grid_idx){
                            if(err){
                                //TODO:
                            } else {
                                $("#player-grids-list").append('<option value=' + grid_idx + '>' + grid_idx + '</option>');                            
                            }
                        });
                    }
                }
            });

            earth.earns(web3.eth.coinbase, function(err, earn){
                if(err){

                } else {
                    $("#player-earns").html(web3.fromWei(earn) + "ETH");
                }
            })
        }

        galaxy.init_grid_service = function(){
            earth.mapSize(function(err, size){
                if(err){
                    //TODO:
                } else {
                    if(window.gridService){

                    }

                    var gridService = window.gridService = new Grid(size);
                    gridService.drawGrids(viewer);
                }
            })
        }

        var gridMark = viewer.entities.add(
            {
                name: "grid_selected",
                polygon: {
                    height: 1000,
                    material: Cesium.Color.BLUE.withAlpha(0.5),
                    outline: false
                }
            }
        );
        var show_grid_mark = true;

        galaxy.draw_mark = function(grid_idx){
            if(!window.gridService){

            } else {
                var points = gridService.fromGridIndexToDegrees(grid_index);
                gridMark.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(points);
                gridMark.polygon.show = true;
            }
        }

        galaxy.grid_selected = function(grid_idx){
            earth.grids(grid_idx, function(err, result){
                if(err){
                    //TODO: error
                } else {
                    var gridState = result[0];
                    var owner = result[1];
                    var price = parseFloat(web3.fromWei(result[2]));

                    if(owner == "0x0000000000000000000000000000000000000000"){
                        owner = "None";
                    }

                    $("#oper-grid-owner").html(owner);
                    $("#oper-grid-state").html(GridStateEng[gridState]);

                    if(gridState == 0 && owner != web3.eth.coinbase){
                        $("#buy-grid").show();
                    } else {
                        $("#buy-grid").hide();
                    }

                    if(owner == web3.eth.coinbase){
                        $("#sell-grid").show();
                        $("#oper-grid").show();
                    } else {
                        $("#sell-grid").hide();
                        $("#oper-grid").hide();
                    }
                    $("#oper-grid-price").html(price + " ETH");

                    //adjust the camera
                    if(window.gridService){
                        var center = window.gridService.gridCenterInDegree(grid_idx);

                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 4000000.0)
                        })
                    }
                }
            });
        }

        galaxy.set_label = function(lng, lat, height, text){
            var entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
                label : {
                    text: text,
                    fillColor : Cesium.Color.BLUE,
                    sizeInMeters : true                    
                }
            });
            entity.label.scale = 1.0
        }

        galaxy.set_grid_picture = function(grid, height, picture_url){
            if(!window.gridService){
                
            } else {
                var points = gridService.fromGridIndexToDegrees(grid);
                var gridPic = viewer.entities.add(
                    {
                        name: "grid_picture",
                        polygon: {
                            height: 1000,
                            material: picture_url,
                            outline: true,
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(points)
                        }
                    }
                );
                gridMark.polygon.show = true;
            }
        }

        galaxy.init_mouse_event_handler = function(){
            var handler = viewer.screenSpaceEventHandler;
            handler.setInputAction(
                function (movement) {
                    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                    if(cartesian) {
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                        
                        $("#mouse-lon").html(lon);
                        $('#mouse-lat').html(lat);
                
                        if(window.gridService){
                            var gridService = window.gridService;
                            var point = gridService.fromLatLngToXY(lat, lon);
                            var grid_index = gridService.fromLatLngToGrid(lat, lon);
                            $("#mouse-grid").html(grid_index);
                    
                            $("#mouse-grid-x").html(point.x);
                            $("#mouse-grid-y").html(point.y);

                            if(show_grid_mark){
                                var points = gridService.fromGridIndexToDegrees(grid_index);
                                gridMark.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(points);
                                gridMark.polygon.show = true;
                            }
                        }
                    } else {
                        gridMark.polygon.show = false;
                    }
                }, 
                Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            handler.setInputAction(function(event){
                var cartesian = viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
                if(cartesian) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                    var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                    
                    if(window.gridService){
                        var grid_index = gridService.fromLatLngToGrid(lat, lon);
                        $("[name=grid-idx]").val(grid_index);
                        galaxy.grid_selected(grid_index);
                    }
                } 
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        var GridStateEng = [
            "On Sell",
            "Owned",
            "Forbidden"
        ];

        galaxy.init_page_event = function(){
            $("#search-grid").click(function(){
                var grid_idx = parseInt($("[name=grid-idx]").val());
                if(isNaN(grid_idx)) return;
        
                galaxy.grid_selected(grid_idx);
            });

            $("#buy-grid-btn").click(function(){
                var grid_idx = parseInt($("[name=grid-idx]").val());
                if(isNaN(grid_idx)) return;
                
                if(window.gridService){
                    var point = window.gridService.fromGridIndexToXY(grid_idx);
                    
                                    earth.grids(grid_idx, function(err, result){
                                        if(err){
                    
                                        } else {
                                            var gridState = result[0];
                                            if(gridState == 0){
                                                var price = result[2];
                                                if(price == 0){
                                                    earth.minimalPrice(function(err, price){
                                                        if(err){
                    
                                                        } else {
                                                            earth.BuyGrid(
                                                                point.x, 
                                                                point.y, 
                                                                {
                                                                    value: price,
                                                                    gas: 470000
                                                                },
                                                                function(err, res){
                                                                    console.log(err, res);
                                                                }
                                                            );
                                                        }
                                                    })
                                                } else {
                                                    earth.BuyGrid(
                                                        point.x, 
                                                        point.y, 
                                                        {
                                                            value: price,
                                                            gas: 470000
                                                        },
                                                        function(err, res){
                                                            console.log(err, res);
                                                        }
                                                    );
                                                }
                                            } else {
                                                //can't
                                            }
                                        }
                                    })
                }  
            });

            $("#sell-grid-btn").click(function(){
                var grid_idx = parseInt($("[name=grid-idx]").val());
                if(isNaN(grid_idx)) return;
                var price = parseFloat($("[name=grid-sell-price]").val());
                if(isNaN(price)) return;

                var point = gridService.fromGridIndexToXY(grid_idx);

                earth.grids(grid_idx, function(err, result){
                    if(err){

                    } else {
                        var owner = result[1];

                        if(owner != web3.eth.coinbase){
                            //TODO: error
                        } else {
                            earth.SellGrid(point.x, point.y, web3.toWei(price, "ether"), {gas:470000}, function(err, txid){
                                if(err){
                                    //TODO:
                                } else {

                                }
                            });
                        }
                    }
                })
                
            });

            $("#check-show-grids").change(function(){
                var show = $(this).prop('checked');
                if(window.gridService){
                    window.gridService.showGrids(show);
                }
            });

            $("#check-show-mark").change(function(){
                show_grid_mark = $(this).prop('checked');
                gridMark.show = show_grid_mark;
            });

            $("#player-location").click(function(){
                navigator.geolocation.getCurrentPosition(function(position){
                    viewer.camera.flyTo({
                        destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000000.0)
                    });
                });
            })

            $("#player-grids-list").on('change', function(){
                $("[name=grid-idx]").val(this.value);                
                galaxy.grid_selected(this.value);
            })

            $("#player-claim").click(function(){
                earth.GetEarn(function(error, tx){
                    if(error){
                        //TODO:
                    } else {

                    }
                });
            })

            $("#set-grid-label").click(function(){
                var text = $("#grid-label").val();
                var grid = $("[name=grid-idx]").val();                

                if(window.gridService){
                    if(text.length == 0){
    
                    } else {
                        var center = window.gridService.gridCenterInDegree(grid);
                        galaxy.set_label(center.lng, center.lat, 100000, text);
                    }
                }
            });

            $("#set-grid-picture").click(function(){
                var url = $("#grid-picture").val();
                var grid = $("[name=grid-idx]").val();                

                if(window.gridService){
                    if(url.length == 0){
    
                    } else {
                        galaxy.set_grid_picture(grid, 100000, url);
                    }
                }
            })
        }

        galaxy.refresh_earth_status();
        galaxy.refresh_player_stauts();
        galaxy.init_grid_service();
        galaxy.init_mouse_event_handler();
        galaxy.init_page_event();
    }
}());

