function init_galaxy(e,i,t,a,r){e.refresh_earth_status=function(e){e.gridSold(function(e,i){e||$("#status-sold-grids").html(i)}),e.mapSize(function(e,i){e||$("#status-total-grids").html(i*i)}),e.fee(function(e,i){e||$("#status-tran-fee").html(i/1e3)}),e.minimalPrice(function(e,i){e||$("#status-min-price").html(web3.fromWei(i)+" ETH")})},e.refresh_player_status=function(){e.hasOwnProperty("player")||(e.player={}),t.gridsCount(web3.eth.coinbase,function(i,a){i||($("#player-address").html(shortSpellAddress(web3.eth.coinbase)),$("#player-address").prop("title",web3.eth.coinbase),$("#player-grids-count").html(a),e.player.grids_count=a,e.player.grids=[],$("#player-grids-list").find("option").remove(),async.times(a,function(i,a){let r=i;t.ownedGrids(web3.eth.coinbase,r,function(i,t){return i?a(CONTRACT_CALL_ERROR):(e.player.grids.push(t),$("#player-grids-list").append("<option value="+t+">"+t+"</option>"),a())})},function(e){e&&console.log("grid list initial failed: "+e)}))}),t.totalEarned(function(e,i){e||$("#player-earns").html(web3.fromWei(i)+"ETH")}),$("#player-avatar img").attr("src","/avatar/get/"+web3.eth.coinbase)},e.init_user_ship=function(){if(e.player.hasOwnProperty("starship"));else if(e.player.grids_count>0){var t=i.gridCenterInDegree(e.player.grids[0]),r=Cesium.Cartesian3.fromDegrees(t.lng,t.lat,1e6);init_starship_event(a,r)}},e.grid_selected=function(e){t.grids(e,function(t,s){if(!t){var n=s[0],l=s[1],d=parseFloat(web3.fromWei(s[2]));"0x0000000000000000000000000000000000000000"==l&&(l="None"),$("#selected-grid-status").html($.i18n(GridStateEng[n])),$("#selected-grid-price").html(d),$("#oper-grid-owner").html(l),$("#oper-grid-state").html(GridStateEng[n]);let t=!1,g=$("#grid-avatar");const c='<a id="grid-link"><img id="grid-avatar-img"></a>';$("#del-grid-img-btn").addClass("disabled"),l==web3.eth.coinbase?(t=!0,new AvatarUpload({el:document.querySelector("#grid-avatar"),uploadUrl:"/grid_avatar/upload",uploadData:{address:web3.eth.coinbase},onSuccess:function(t,s){s.isOK?r.forceReloadConf(r.CATEGORY.GRID_CONF_CATEGORY,e,(t,r)=>{t?(showError("fail load conf"),console.log("fail to load grid configuration: "+t)):(i.updateGridAvatar(e,a),$("#del-grid-img-btn").removeClass("disabled"))}):showError(s.msg)}}),$("#buy-grid-btn").addClass("disabled"),$("#sell-grid-btn").removeClass("disabled"),$("#set-grid-link").show()):0==n?(g.empty(),g.append(c),$("#buy-grid-btn").removeClass("disabled"),$("#sell-grid-btn").addClass("disabled"),$("#del-grid-img-btn").addClass("disabled"),$("#set-grid-link").hide()):(g.empty(),g.append(c),$("#sell-grid-btn").addClass("disabled"),$("#buy-grid-btn").addClass("disabled"),$("#del-grid-img-btn").addClass("disabled"),$("#set-grid-link").hide()),i.gridAvatar(e,function(e,i){e?console.log("fail to retrive grid avatar :"+e):(i?t&&$("#del-grid-img-btn").removeClass("disabled"):i=t?$.i18n(UPLOAD_IMAGE):NO_IMAGE,$("#grid-avatar").show(),$("#grid-avatar img").each(function(){$(this).attr("src",i)}))}),r.getConf(r.CATEGORY.GRID_CONF_CATEGORY,e,(e,i)=>{if(e)showError(FAIL_LOAD_CONF),console.log("fail to load conf: "+e);else{var t="";i&&i.link&&(t=i.link),$("#grid-link").attr("href",t)}});var o=i.gridCenterInDegree(e);a.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(o.lng,o.lat,4e6)})}})},e.set_label=function(e,i,t,r){a.entities.add({position:Cesium.Cartesian3.fromDegrees(e,i,t),label:{text:r,fillColor:Cesium.Color.BLUE,sizeInMeters:!0}}).label.scale=1},e.set_grid_picture=function(e,t,r){const s="/grid_avatar/get/"+e;i.setGridImageTmp(e,s,a)},e.init_mouse_event_handler=function(){},e.locate_user=function(){navigator.geolocation.getCurrentPosition(function(e){a.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(e.coords.longitude,e.coords.latitude,1e7)})})},e.init_satelite=function(){var e=i.gridCenterInDegree(497);e=Cesium.Cartesian3.fromDegrees(e.lng,e.lat,1e6),init_satelite(a,e,-1e3)}}