//TODO: use async to organize behavior
function init_galaxy(galaxy, gridService, earth, viewer, confService){
  galaxy.refresh_earth_status = function(earth) {
    earth.gridsSoldOut(function(err, sold) {
      if (err) {
        return;
      } else {
        $("#status-sold-grids").html(sold);
      }
    });

    earth.mapSize(function(err, size) {
      if (err) {
        return;
      } else {
        $("#status-total-grids").html(size * size);
      }
    });

    earth.fee(function(err, fee) {
      if (err) {
        return;
      } else {
        $("#status-tran-fee").html(fee / 1000);
      }
    });

    earth.minimalPrice(function(err, price) {
      if (err) {
        return;
      } else {
        $("#status-min-price").html(web3.fromWei(price) + " ETH");
      }
    });
  }

  galaxy.refresh_player_status = function() {
    if(!galaxy.hasOwnProperty('player')){
      galaxy.player = {};
    }

    earth.gridsCount(web3.eth.coinbase, function(err, count) {
      if (err) {
        return;
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
              return next(CONTRACT_CALL_ERROR);
            } else {
              galaxy.player.grids.push(grid_idx);
              $("#player-grids-list").append('<option value=' + grid_idx + '>' + grid_idx + '</option>');
              return next();
            }
          });
        }, function(err){
          if(err){
            console.log("grid list initial failed: " + err);
          } else {
            galaxy.init_user_ship();
          }
        });
      }
    });

    earth.earns(web3.eth.coinbase, function(err, earn) {
      if (err) {
        return;
      } else {
        $("#player-earns").html(web3.fromWei(earn) + "ETH");
      }
    });

    $("#player-avatar img").attr("src", "/avatar/get/" + web3.eth.coinbase);
  }

  galaxy.init_user_ship = function() {
    if(galaxy.player.hasOwnProperty("starship")){
      //already have one
    } else {
      if(galaxy.player.grids_count > 0){
        var center = gridService.gridCenterInDegree(galaxy.player.grids[0]);
        var position = Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 1000000);
        init_starship_event(viewer, position);
      }
    }
  }

  /*
  galaxy.draw_mark = function(grid_idx) {
    if (!window.gridService) {
      showError("grid server uninitialized");
      
    } else {
      var points = gridService.fromGridIndexToDegrees(grid_index);
      gridMark.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(points);
      gridMark.polygon.show = true;
    }
  };*/

  galaxy.grid_selected = function(grid_idx) {
    earth.grids(grid_idx, function(err, result) {
      if (err) {
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
        const imgAppend = '<a id="grid-link"><img id="grid-avatar-img"></a>'

        $('#del-grid-img-btn').addClass('disabled')
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
                            
              confService.forceReloadConf(
                confService.CATEGORY["GRID_CONF_CATEGORY"],
                grid_idx,
                (err, conf) => {
                if(err){
                  showError("fail load conf");
                  console.log("fail to load grid configuration: " + err);
                } else {
                  gridService.updateGridAvatar(grid_idx, viewer);
                  $("#del-grid-img-btn").removeClass("disabled");
                }
              });
            },
          });
          $("#buy-grid-btn").addClass("disabled");
          $("#sell-grid-btn").removeClass("disabled");
          $("#set-grid-link").show();
        } else if (gridState == 0) {
          gridAvatar.empty()
          gridAvatar.append(imgAppend)
          $("#buy-grid-btn").removeClass("disabled");
          $("#sell-grid-btn").addClass("disabled");
          $('#del-grid-img-btn').addClass('disabled')
          $("#set-grid-link").hide();
        } else {
          /**
           * forbidden land or owned by other
           */
          gridAvatar.empty()
          gridAvatar.append(imgAppend)
          $("#sell-grid-btn").addClass("disabled");
          $("#buy-grid-btn").addClass("disabled");
          $('#del-grid-img-btn').addClass('disabled')
          $("#set-grid-link").hide();
        }
        
        gridService.gridAvatar(grid_idx, function(err, avatar_url){
          if(err){
            showError("fail to load grid avatar");
            console.log("fail to retrive grid avatar :" + err);
          } else {
            if(!avatar_url){
              if(isOwner){
                avatar_url = $.i18n(UPLOAD_IMAGE);
              } else {
                avatar_url = NO_IMAGE;
              }
            } else {
              if(isOwner){
                $("#del-grid-img-btn").removeClass("disabled");
              }
            }

            $('#grid-avatar').show()
            $('#grid-avatar img').each(function() {
              $(this).attr("src", avatar_url);
            });
          }
        });

        confService.getConf(confService.CATEGORY["GRID_CONF_CATEGORY"], grid_idx, (err, conf) => {
          if(err){
            showError(FAIL_LOAD_CONF);
            console.log("fail to load conf: " + err);
          } else {
            var url = "";
            if(conf && conf.link){
              url = conf.link;
            }
            $("#grid-link").attr("href", url);
          }
        });

        var center = gridService.gridCenterInDegree(grid_idx);
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 4000000.0)
        });
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
    const url = "/grid_avatar/get/" + grid_idx;
    gridService.setGridImageTmp(grid_idx, url, viewer);
  };

  galaxy.init_mouse_event_handler = function() {
    
  };

  galaxy.locate_user = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 10000000.0)
      });
    });
  }
}