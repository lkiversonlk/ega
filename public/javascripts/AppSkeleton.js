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
    infoBox: false,
    geocoder: false,
    imageProvider: new Cesium.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      mapStyle: Cesium.BingMapsStyle.CANVAS_LIGHT // Can also use Cesium.BingMapsStyle.ROAD
    })
  });

  var baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;
  baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[2];

  //viewer.scene.globe.enableLighting = false;
  var scene = viewer.scene;
  
  initI18n();
  init_navbar_event();

  window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
      if (registryAddresses.hasOwnProperty(web3.version.network)) {
        $("#network").html(networkName[web3.version.network]);
        $("#contract").prop("href", getEtherAddress(web3.version.network, registryAddresses[web3.version.network]));
      } else {
        showError(UNKNOWN_NETWORK);
        $("#network").html(UNKNOWN_NETWORK);
        return;
      }
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      showError(NOT_CONNECTED_TO_ETH);
      $("#network").html("no ether network found");
      return;
    }

    var earth = window.earth = InitEarthContract(web3, registryAddresses[web3.version.network]);

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

  function StartEarth(earth, viewer, galaxy) {
    earth.mapSize(function(err, size) {
      if (err) {
      } else {
        var confService = new Configuration();
        var gridService = new Grid(size, confService);
        gridService.drawGrids(viewer);
        gridService.drawGridAvatars(viewer);

        init_galaxy(galaxy, gridService, earth, viewer, confService);
        galaxy.refresh_earth_status(earth);
        galaxy.refresh_player_status(earth);

        init_mouse_event(galaxy, viewer, gridService);
        init_galay_status_event(viewer, gridService);
        init_player_status_event(earth, galaxy);
        init_grid_oper_event(earth, gridService, galaxy, confService, viewer);
      }
    });
  }

}());
