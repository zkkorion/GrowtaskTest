
'use strict';
(function() {

  var numberFmt = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  });

  const formatPrice = (value) => {
    return numberFmt.format(value) + ' \u20BD';
  };

  window.Utils = {
    formatPrice: formatPrice,
  };
})(window);
