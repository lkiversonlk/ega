function init_navbar_event(){
  $('#set-lan-en').click(changeLocale.bind(null, 'en'));
  $('#set-lan-ch').click(changeLocale.bind(null, 'ch'));
}

function init_mouse_event(galaxy, viewer, gridService){
  //on move
  var scene = viewer.scene;
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

            if (show_grid_mark) {
              var points = gridService.fromGridIndexToDegrees(grid_index);
              gridMark.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(points);
              gridMark.polygon.show = true;
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

          var grid_index = gridService.fromLatLngToGrid(lat, lon);
          $("[name=grid-idx]").val(grid_index);
          galaxy.grid_selected(grid_index);

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
}

var gridMark = null;
var show_grid_mark = true;
function init_galay_status_event(viewer, gridService){
  if(gridMark == null){
    gridMark = viewer.entities.add({
      name: "grid_selected",
      polygon: {
        height: 10000,
        material: Cesium.Color.GREY.withAlpha(0.2),
        outline: true,
      }
    });
  }

  $("#check-show-grids").change(function() {
    var show = $(this).prop('checked');
    gridService.showGrids(show);
  });

  $("#check-show-mark").change(function() {
    show_grid_mark = $(this).prop('checked');
    gridMark.show = show_grid_mark;
  });
}

function init_player_status_event(earth, galaxy){
  $("#player-claim").click(function() {
    earth.getEarn(function(error, tx) {
      if (error) {
        showError("contract call error");
      } else {

      }
    });
  })

  $("#player-refresh").click(function(){
    galaxy.refresh_player_status();
  });

  $("#player-grids-list").on('change', function() {
    $("[name=grid-idx]").val(this.value);
    galaxy.grid_selected(this.value);
  });

  $("#player-location").click(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000000.0)
      });
    });
  })
}


function init_grid_oper_event(earth, gridService, galaxy){

  //buy grid
  $("#buy-grid-btn").click(function() {
    var grid_idx = parseInt($("[name=grid-idx]").val());
    if (isNaN(grid_idx)) {
      showError(NON_GRID_SELECTED);
      return;
    };

    earth.grids(grid_idx, function(err, result) {
      if (err) {
        showError(CONTRACT_CALL_ERROR);
      } else {
        var gridState = result[0];
        if (gridState == 0) {
          var owner = result[1];

          if(owner == web3.eth.coinbase){
            showError(YOU_ARE_ALREADY_OWNER);
            return ;
          }

          var price = result[2];
          if (price == 0) {
            earth.minimalPrice(function(err, price) {
              if (err) {
                showError(CONTRACT_CALL_ERROR);
              } else {
                earth.buyGrid(
                  grid_idx, 
                  {
                    value: price,
                    gas: 470000
                  },
                  function(err, res) {
                    if (err) {
                      showError(CONTRACT_CALL_ERROR);
                    } else {
                      showInfo("transaction id: " + res);
                      console.log(err, res);
                    }
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
                  showError(CONTRACT_CALL_ERROR);
                } else {
                  showInfo("transaction id: " + res);
                  console.log(err, res);
                }
                
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
          showError(GRID_NOT_ON_SELL);
          return ;
        }
      }
    })
  });

  $("#search-grid").click(function() {
    var grid_idx = parseInt($("[name=grid-idx]").val());
    if (isNaN(grid_idx)) return;

    galaxy.grid_selected(grid_idx);
  });

  $('#del-grid-img-btn').click(function() {
    let grid_idx = parseInt($("[name=grid-idx]").val());
    if (isNaN(grid_idx)) {
      showError(NON_GRID_SELECTED);
      returnn
    }
    earth.grids(grid_idx, function(err, result){
      if(err){
      } else {
         var owner = result[1];
         if(web3.eth.coinbase != owner){
           showError(NOT_GRID_OWNER);
         } else {
          $validation.signWithTimestamp(web3, function(err, signature) {
            if (err) {
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
                    //reload or remove config
                    //remove image mark on earth
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
}