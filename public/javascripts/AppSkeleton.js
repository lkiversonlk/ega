;(function() {
  "use strict";

  Cesium.BingMapsApi.defaultKey = 'At36HWsCzUCdp9mDZXKXChHywJ4Rzt7OHdw-VLodUMknjJVR5VVS-E-BCanlX8W-'; // For use with this application only
  Cesium.MapboxApi.defaultAccessToken = 'pk.eyJ1IjoibGtpdmVyc29ubGsiLCJhIjoiY2piazI1M3J3NDZjdzJycWZpdHlxemkxYiJ9.P2vygQ0KUl5QdnL6GQ60AA';
//////////////////////////////////////////////////////////////////////////
// Creating the Viewer
//////////////////////////////////////////////////////////////////////////

// var viewer = new Cesium.Viewer('cesiumContainer');
//
  /*
  var viewer = new Cesium.Viewer('galaxy', {
    imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
        url : '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    }),
    baseLayerPicker : false
  });*/


  var viewer = new Cesium.Viewer('galaxy', {
    //scene3DOnly: true,
    selectionIndicator: false,
    baseLayerPicker: true,
    animation: false,
    timeline: false,
    imageProvider: new Cesium.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      mapStyle: Cesium.BingMapsStyle.CANVAS_LIGHT // Can also use Cesium.BingMapsStyle.ROAD
    })
  });

  var baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
  baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[2];

  //viewer.scene.globe.enableLighting = false;
  var scene = viewer.scene;

  function shortSpellAddress(addr) {
    if (addr) {
      return addr.substr(0, 9) + "...";
    }
  }

  const initI18n = function() {
    var locale = window.LOCALE;
    $.get('/locales/' + locale + '.json', function(ret) {
      if (!ret) {
        return;
      }

      $.i18n().load(ret, locale);
      $.i18n().locale = locale;

      // $.i18n('current owner') => 领主
    });
  };
  initI18n();

  function showError(msg_key) {
    $.notify({
      // options
      message: $.i18n(msg_key)
    }, {
      // settings
      type: 'danger',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      placement: {
        align: "center"
      },
      timer: 1000,
      newest_on_top: false
    });
  }

  function showInfo(msg_key){
    $.notify({
      // options
      message: $.i18n(msg_key)
    }, {
      // settings
      type: 'info',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      placement: {
        align: "center"
      },
      timer: 1000,
      newest_on_top: false
    });
  };


  function getEtherAddress(network, address) {
    switch (network) {
      case "1":
        return "https://etherscan.io/address/" + address;
      case "3":
        return "https://ropsten.etherscan.io/address/" + address;
      default:
        return "";
    }
  }

  window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
      if (registryAddresses.hasOwnProperty(web3.version.network)) {
        $("#network").html(networkName[web3.version.network]);
        $("#contract").prop("href", getEtherAddress(web3.version.network, registryAddresses[web3.version.network]));
      } else {
        showError("unknown network");
        $("#network").html("Unknown Network");
        return;
      }
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      showError("not connected to ETH");
      $("#network").html("no ether network found");
      return;
    }

    var earth = window.earth = InitEarthContract(web3, registryAddresses[web3.version.network]);
    // TODO comment contract display html now
    $("#status-contract").html(registryAddresses[web3.version.network]);

    new AvatarUpload({
      el: document.querySelector('#player-avatar'),
      uploadUrl: '/avatar/upload',
      uploadData: {
        address: web3.eth.coinbase
      },
    });

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

  const changeLocale = function(locale) {
    $.post('/locale', {
      lan: locale
    }, function() {
      window.location.reload();
    });
  };

  $('#set-lan-en').click(changeLocale.bind(null, 'en'));
  $('#set-lan-ch').click(changeLocale.bind(null, 'ch'));


  function StartEarth(earth, viewer, galaxy) {
    galaxy.refresh_earth_status = function() {
      earth.gridsSoldOut(function(err, sold) {
        if (err) {
          showError("contract call error");
        } else {
          $("#status-sold-grids").html(sold);
        }
      });

      earth.mapSize(function(err, size) {
        if (err) {
          showError("contract call error");
        } else {
          $("#status-total-grids").html(size * size);
        }
      });

      earth.fee(function(err, fee) {
        if (err) {
          showError("contract call error");
        } else {
          $("#status-tran-fee").html(fee / 1000);
        }
      });

      earth.minimalPrice(function(err, price) {
        if (err) {
          showError("contract call error");
        } else {
          $("#status-min-price").html(web3.fromWei(price) + " ETH");
        }
      });
    }

    galaxy.refresh_player_stauts = function() {
      if(!galaxy.hasOwnProperty('player')){
        galaxy.player = {};
      }

      earth.gridsCount(web3.eth.coinbase, function(err, count) {
        if (err) {
          showError("contract call error");
        } else {
          $("#player-address").html(shortSpellAddress(web3.eth.coinbase));
          $("#player-address").prop('title', web3.eth.coinbase);
          $("#player-grids-count").html(count);

          galaxy.player.grids_count = count;
          galaxy.player.grids = [];

          $("#player-grids-list").find("option").remove();
          async.times(count, function(i, next){
            let idx = i;
            earth.ownedGrids(web3.eth.coinbase, idx, function(err, grid_idx) {
              if (err) {
                showError("contract call error");
                return next("contract call error");
              } else {
                galaxy.player.grids.push(grid_idx);
                $("#player-grids-list").append('<option value=' + grid_idx + '>' + grid_idx + '</option>');
                return next();
              }
            });
          }, function(err){
            if(err){

            } else {
              galaxy.init_user_ship();
            }
          });
        }
      });

      earth.earns(web3.eth.coinbase, function(err, earn) {
        if (err) {
          showError("contract call error");
        } else {
          $("#player-earns").html(web3.fromWei(earn) + "ETH");
        }
      });

      $("#player-avatar img").attr("src", "/avatar/get/" + web3.eth.coinbase);
    }

    galaxy.init_grid_service = function() {
      earth.mapSize(function(err, size) {
        if (err) {
          showError("contract call error");
        } else {
          if (window.gridService) {
          }

          var gridService = window.gridService = new Grid(size);
          gridService.drawGrids(viewer);
          gridService.drawGridAvatars(viewer);
        }
      })
    }

    var gridMark = viewer.entities.add({
      name: "grid_selected",
      polygon: {
        height: 10000,
        material: Cesium.Color.GREY.withAlpha(0.2),
        outline: true,
      }
    });
    var show_grid_mark = true;

    galaxy.draw_mark = function(grid_idx) {
      if (!window.gridService) {
        showError("grid server uninitialized");
        
      } else {
        var points = gridService.fromGridIndexToDegrees(grid_index);
        gridMark.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(points);
        gridMark.polygon.show = true;
      }
    };

    galaxy.grid_selected = function(grid_idx) {
      earth.grids(grid_idx, function(err, result) {
        if (err) {
          showError("contract call error");
          return
        } else {
          var gridState = result[0];
          var owner = result[1];
          var price = parseFloat(web3.fromWei(result[2]));

          if (owner == "0x0000000000000000000000000000000000000000") {
            owner = "None";
          }

          $("#selected-grid-status").html($.i18n(GridStateEng[gridState]))
          $("#selected-grid-price").html(price)

          $("#oper-grid-owner").html(owner)
          $("#oper-grid-state").html(GridStateEng[gridState])

          //$('#buy-grid-btn').show()
          //$('#sell-grid-btn').show()
          let isOwner = false
          let gridAvatar = $('#grid-avatar')
          const imgAppend = '<img id="grid-avatar-img">'

          if (owner == web3.eth.coinbase) {
            isOwner = true
            new AvatarUpload({
              el: document.querySelector('#grid-avatar'),
              uploadUrl: '/grid_avatar/upload',
              uploadData: {
                address: web3.eth.coinbase,
              },
              onSuccess: function(xhr, json) {
                //reload conf from server, current 
                if(window.gridService){
                  window.gridService.LoadConf(GRID_CONF_CATEGORY, function(err, conf){
                    if(err){
                      showError("fail load conf");
                      console.log("fail to load grid configuration: " + err);
                    } else {
                      galaxy.set_grid_picture(grid_idx, 100000, viewer);
                      $("#del-grid-img-btn").removeClass("disabled");
                    }
                  });
                }
              },
            });
            $("#buy-grid-btn").addClass("disabled");
            $("#sell-grid-btn").removeClass("disabled");

            if(window.gridService){
              window.gridService.GetConf(GRID_CONF_CATEGORY, function(err, conf){
                if(err){
                  showError("fail load conf");
                  console.log("fail to load grid configuration: " + err);
                } else {
                  /* 如果有配置grid avatar才可以去除 */
                  if(conf.hasOwnProperty(grid_idx) && conf[grid_idx].avatar){
                    $("#del-grid-img-btn").removeClass("disabled");
                  } else {
                    $('#del-grid-img-btn').addClass('disabled')
                    /*
                    $('#grid-avatar img').each(function() {
                      $(this).attr("src", UPLOAD_IMAGE);
                    })*/
                  }
                }
              });
            }
          } else if (gridState == 0) {
            gridAvatar.empty()
            gridAvatar.append(imgAppend)
            $("#buy-grid-btn").removeClass("disabled");
            $("#sell-grid-btn").addClass("disabled");
            $('#del-grid-img-btn').addClass('disabled')
          } else {
            /**
             * forbidden land or owned by other
             */
            gridAvatar.empty()
            gridAvatar.append(imgAppend)
            $("#sell-grid-btn").addClass("disabled");
            $("#buy-grid-btn").addClass("disabled");
            $('#del-grid-img-btn').addClass('disabled')
          }
          
          //adjust the camera
          if (window.gridService) {
            window.gridService.gridAvatar(grid_idx, function(err, avatar_url){
              if(err){
                showError("fail to load grid avatar");
                console.log("fail to retrive grid avatar :" + err);
              } else {
                $('#grid-avatar').show()
                $('#grid-avatar img').each(function() {
                  $(this).attr("src", avatar_url);
                })
              }
            })
            var center = window.gridService.gridCenterInDegree(grid_idx);
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 4000000.0)
            })
          }
        }
      });
    };

    galaxy.set_label = function(lng, lat, height, text) {
      var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        label: {
          text: text,
          fillColor: Cesium.Color.BLUE,
          sizeInMeters: true
        }
      });
      entity.label.scale = 1.0
    };

    // TODO After upload grid img, currently func cannot update local display
    galaxy.set_grid_picture = function(grid_idx, height, picture_url) {
      if (!window.gridService) {
        showError("grid service uninitialized");
      } else {
        const url = "/grid_avatar/get/" + grid_idx;
        window.gridService.setGridImageTmp(grid_idx, url, viewer);
      }
    };

    galaxy.init_mouse_event_handler = function() {
      var handler = viewer.screenSpaceEventHandler;
      handler.setInputAction(
        function(movement) {
          var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
          if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

            $("#mouse-lon").html(lon);
            $('#mouse-lat').html(lat);

            if (window.gridService) {
              var gridService = window.gridService;
              var point = gridService.fromLatLngToXY(lat, lon);
              var grid_index = gridService.fromLatLngToGrid(lat, lon);

              earth.grids(grid_index, function(err, result) {
                if (err) {
                  showError("contract call error");
                } else {
                  var owner = result[1];
                  $("#grid-lord-avatar").attr("src", "/avatar/get/" + owner);
                  var gridState = result[0];
                  $("#grid-status").html(GridStateEng[gridState]);
                  $("#grid-owner").html(shortSpellAddress(owner));
                  $("#grid-owner").prop("title", owner);
                  $("#oper-grid-price").html(web3.fromWei(result[2]));
                }
              })

              $("#mouse-grid").html(grid_index);
              $("#mouse-grid-x").html(point.x);
              $("#mouse-grid-y").html(point.y);

              if (show_grid_mark) {
                var points = gridService.fromGridIndexToDegrees(grid_index);
                gridMark.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(points);
                gridMark.polygon.show = true;
              }
            }
          } else {
            gridMark.polygon.show = false;
          }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );

      handler.setInputAction(function(event) {
        var cartesian = viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
        if (cartesian) {
          var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
          var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

          if (window.gridService) {
            var grid_index = gridService.fromLatLngToGrid(lat, lon);
            $("[name=grid-idx]").val(grid_index);
            galaxy.grid_selected(grid_index);
          }

          /*          
          var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic.longitude), 
              Cesium.Math.toDegrees(cartographic.latitude), 
              0.0));

          var position = Cesium.Cartesian3.fromDegrees(0, 0, 10000);

          var model = scene.primitives.add(Cesium.Model.fromGltf({
              url : '/gltf/scene.gltf',
              modelMatrix : modelMatrix,
              scale : 80000.0,
              position: position
          }));*/
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    var GridStateEng = [
      "On Sell",
      "Owned",
      "Forbidden"
    ];

    galaxy.init_page_event = function() {
      $("#search-grid").click(function() {
        var grid_idx = parseInt($("[name=grid-idx]").val());
        if (isNaN(grid_idx)) return;

        galaxy.grid_selected(grid_idx);
      });

      $("#buy-grid-btn").click(function() {
        var grid_idx = parseInt($("[name=grid-idx]").val());
        if (isNaN(grid_idx)) {
          showError("non grid selected");
          return;
        };

        if (window.gridService) {
          earth.grids(grid_idx, function(err, result) {
            if (err) {
              showError("contract call error");
            } else {
              var gridState = result[0];
              if (gridState == 0) {
                var owner = result[1];

                if(owner == web3.eth.coinbase){
                  showError("you are already the owner");
                  return ;
                }

                var price = result[2];
                if (price == 0) {
                  earth.minimalPrice(function(err, price) {
                    if (err) {
                      showError("contract call error");
                    } else {
                      earth.buyGrid(
                        grid_idx, 
                        {
                          value: price,
                          gas: 470000
                        },
                        function(err, res) {
                          if (err) {
                            showError("contract call error");
                          } else {
                            //TODO: about tx
                            showInfo("transaction id: " + res);
                          }
                          console.log(err, res);
                        }
                      );
                    }
                  })
                } else {
                  earth.buyGrid(
                    grid_idx,
                    {
                      value: price,
                      gas: 470000
                    },
                    function(err, res) {
                      if (err) {
                        showError("contract call error");
                      } else {
                        showInfo("transaction id: " + res);
                      }
                      console.log(err, res);
                    }
                  );
                }

                /*
                // after buying behaviour
                $("#grid-avatar img").each(function() {
                  $(this).attr("src", "/grid_avatar/get/" + grid_idx);
                })
                galaxy.set_grid_picture(grid_idx, 100000, viewer);
                */
              } else {
                // can't buy mean can't trigger follow-up actions
                showError("grid is not on sell");
                return ;
              }
            }
          })
        }
      });

      $('#del-grid-img-btn').click(function() {
        let grid_idx = parseInt($("[name=grid-idx]").val());
        if (isNaN(grid_idx)) {
          showError("non grid selected");
          returnn
        }
        earth.grids(grid_idx, function(err, result){
          if(err){
            showError("contract call error");
          } else {
             var owner = result[1];
             if(web3.eth.coinbase != owner){
               showError("you are not the owner of this grids");
             } else {
              $validation.signWithTimestamp(web3, function(err, signature) {
                if (err) {
                  showError("contract call error");
                  console.error('Error occured when sign with timestamp when remove grid img' + err);
                  return
                } else {
                  $.ajax({
                    url: '/grid_avatar/del',
                    method: 'POST',
                    data: {
                      grid_idx,
                      signature,
                    }
                  })
                    .done(function(data) {
                      console.log(data);
                      const {
                        isOK,
                        urlDeleted,
                      } = JSON.parse(data)
      
                      if (isOK === true) {
                        $('#del-grid-img-btn').addClass('disabled')
                        $("#grid-avatar img").each(function() {
                          $(this).attr('src', NO_IMAGE);
                        })
                      } else {
                        console.error('Delete grid image failed')
                      }
                    })
                }
              })
             }
          }
        })
      });
    }

    galaxy.init_user_ship = function() {
      if(galaxy.player.hasOwnProperty("starship")){
        //already have one
      } else {
        if(galaxy.player.grids_count > 0){
          if(window.gridService){
            var center = window.gridService.gridCenterInDegree(galaxy.player.grids[0]);
            /*
            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
              Cesium.Cartesian3.fromDegrees(
                center.lng, 
                center.lat, 
                1000000.0));
            var model = scene.primitives.add(Cesium.Model.fromGltf({
                  url : '/gltf/scene.gltf',
                  modelMatrix : modelMatrix,
                  scale : 1000.0
              }));
      
            galaxy.player.starship = model;*/
          }
        }
      }
    }

    $("#sell-grid-btn").click(function() {
      var grid_idx = parseInt($("[name=grid-idx]").val());
      if (isNaN(grid_idx)) {
        showError("non grid selected");
        return;
      }

      if(window.gridService){
        earth.grids(grid_idx, function(err, result){
          if(err){
            showError("contract call error");
            console.log(err);
          } else {
            var owner = result[1];
            if(owner != web3.eth.coinbase){
              showError("you are not the owner of this grid");
              return;
            }

            vex.dialog.prompt({
              message: 'Set the sell price in ETH',
              placeholder: 'Price',
              callback: function (sell) {
                if(!sell){
                  return;
                }
      
                var price = parseFloat(sell);
      
                if(isNaN(price)){
                  showError("price invalid");
                  return;
                }
      
                var point = gridService.fromGridIndexToXY(grid_idx);
                earth.grids(grid_idx, function(err, result) {
                  if (err) {
                    showError("contract call error");
                  } else {
                    var owner = result[1];
      
                    if (owner != web3.eth.coinbase) {
                      //TODO: error
                      showError("not owner of this grid");
                    } else {
                      earth.sellGrid(grid_idx, web3.toWei(price, "ether"), {
                          gas: 470000
                        }, function(err, txid) {
                          if (err) {
                            showError("contract call error");
                          } else {
                            showInfo("transaction id: " + txid);
                          }
                        });
                      }
                    }
                  });
              }
            });
          }
        })
      }
      
      /*
      var price = parseFloat($("[name=grid-sell-price]").val());
      if (isNaN(price)) {
        showError("please enter price in ETH");
        return;
      }*/
    });

    $("#check-show-grids").change(function() {
      var show = $(this).prop('checked');
      if (window.gridService) {
        window.gridService.showGrids(show);
      }
    });

    $("#check-show-mark").change(function() {
      show_grid_mark = $(this).prop('checked');
      gridMark.show = show_grid_mark;
    });

    $("#player-location").click(function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000000.0)
        });
      });
    })

    $("#player-grids-list").on('change', function() {
      $("[name=grid-idx]").val(this.value);
      galaxy.grid_selected(this.value);
    })

    $("#player-claim").click(function() {
      earth.getEarn(function(error, tx) {
        if (error) {
          showError("contract call error");
        } else {

        }
      });
    })

    $("#player-refresh").click(function(){
      galaxy.refresh_player_stauts();
    });

    $("#set-grid-label").click(function() {
      var text = $("#grid-label").val();
      var grid = $("[name=grid-idx]").val();

      if (window.gridService) {
        if (text.length == 0) {

        } else {
          var center = window.gridService.gridCenterInDegree(grid);
          galaxy.set_label(center.lng, center.lat, 100000, text);
        }
      }
    });

    /*
    $("#sign").click(function() {
      $validation.signWithTimestamp(web3, function(err, ret){
        if(err){

        } else {
          $.post(
            "/sign",
            ret
          ).done(function(data){
            console.log(data);
          });
        }
      });
    });*/

    galaxy.refresh_earth_status();
    galaxy.refresh_player_stauts();
    galaxy.init_grid_service();
    galaxy.init_mouse_event_handler();
    galaxy.init_page_event();
  }

}());
