function shortSpellAddress(addr) {
  if (addr) {
    return addr.substr(0, 9) + "...";
  }
}

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

const changeLocale = function(locale) {
  $.post('/locale', {
    lan: locale
  }, function() {
    window.location.reload();
  });
};