"use strict";
(function(){
  // Browser sanity check
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old browser
    console.log('Old browser');
    return;
  }

  // Function to be called later for determining localStorage support
  // Taken from discussion at https://gist.github.com/paulirish/5558557
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  // function confirmationTicket() {
  //  var str = '' + number;
  //  while (str.length < length) {
  //    str = '0' + str;
  //  }
  //  return str;
  // }

  function time(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
  }

  // ---------------------------select the necessary elements from the DOM--------------------------------
  document.addEventListener('DOMContentLoaded', function(){
    var checkout = JSON.parse(localStorage.getItem('payment_info'));
    console.log(checkout.fname);

    document.getElementById("cdate").innerHTML = time();
    document.getElementById("cfname").innerHTML = checkout.fname;
    document.getElementById("clname").innerHTML = checkout.lname;
    document.getElementById("cemail").innerHTML = checkout.email;
    document.getElementById("cticket-amount").innerHTML = "N/A";
    document.getElementById("ctotal").innerHTML = "N/A";

  });  // End of DOMContentLoaded
}()); // End of IIFE
