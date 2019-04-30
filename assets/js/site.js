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

  // Data comparison function
  function eq(value, condition) {
    return value === condition;
  }

  // Data cleanup function
  function clean_nonnumber(value) {
    // Remove non-digit and return values
    return value.replace(/\D/g, '');
  }

  // Removes any form of whitespace
  function remove_all_whitespace(value) {
    return value.replace(/ +/g, '');
  }

  // Remove country trip_us_country_code
  function strip_us_country_code(value) {
    return value.replace(/^1/, '');
  }

  function clean_whitespace(value) {
    return value.replace(/\s/g, '');
  }

  // All purpose validate function. It takes a value,
  // along with either a regular expression pattern or
  // a simple function -- like the comparison functions
  // above -- and a condition. JavaScript doesn't char
  // if a function is called with more or fewer arguments
  // than described in the function definition, so it's
  // no problem at all to leave off the `condition`
  // argument when calling a check that's a regular expression
  function validate(value, check, condition) {
    if (eq(typeof(check.test), 'function')) {
      // Handle a regular expression
      return check.test(value);
    } else if (eq(typeof(check), 'function')) {
      // Handle a comparison function
      return check(value, condition);
    } else {
      return false;
    }
  }

  // Email validity function
  function validate_email(value){
    var email = clean_whitespace(value);
    return validate(email, /^[^@\s]+@[^@\s]+$/g);
  }

  // phone validity function
  function validate_us_phone(value){
    var phonenumber = strip_us_country_code(clean_nonnumber(value));
    return validate(phonenumber.length, eq, 10);
  }

  function validate_ccn(ccn) {
    // validate ccn and remove white space
    return validate(remove_all_whitespace(ccn), /^[0-9]{16}$/g);
  }

  function validate_cvv(cvv) {
    // Valid security code is a 3 or 4 digit string with all whitespace removed
    return validate(remove_all_whitespace(cvv), /^[0-9]{3}[0-9]?$/g);
  }

  // Function to validate the zip input
  function validate_zip(value){
    var zip = clean_nonnumber(value);
    return validate(zip.length, eq, 5);
  }

  // Debounce function to limit calls on repeated events
  // See for e.g., https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  var debounce = function debounce(func, delay) {
    var inDebounce;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(function () {
        return func.apply(context, args);
      }, delay);
    };
  };

  function confirmationTicket(num,size) {
  // var number=Math.random()*10;
  var number=Math.floor(Math.random()*100000);
  var length=8;
  var str = '' + number;
  while (str.length < length) {
  str = '0' + str;
  }
  return str;
  }

  function time(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
  }

  // ---------------------------select the necessary elements from the DOM--------------------------------
  var page1 = document.querySelector('#home');
  var page2 = document.querySelector('#seating');
  var page3 = document.querySelector('#check-out');
  var page4 = document.querySelector('#confirmation');

  if (page1 !== null && page1.id == 'home') {
    console.log("Home page was found");
    document.addEventListener('DOMContentLoaded', function(){
      var event1 = document.querySelector('#event1')
      var event2 = document.querySelector('#event2')
      var event3 = document.querySelector('#event3')
      var event4 = document.querySelector('#event4')
      var event5 = document.querySelector('#event5')
      var event6 = document.querySelector('#event6')

      var checkout = {};

      event1.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          checkout.price = document.querySelector('#ticket-price1').innerText;
          console.log("checkout.price is: " + checkout.price);
          localStorage.setItem("payment_info", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
      event2.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          checkout.price = document.querySelector('#ticket-price2').innerText;
          console.log("checkout.price is: " + checkout.price);
          localStorage.setItem("payment_info", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
      event3.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          checkout.price = document.querySelector('#ticket-price3').innerText;
          console.log("checkout.price is: " + checkout.price);
          localStorage.setItem("payment_info", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
      event4.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          checkout.price = document.querySelector('#ticket-price4').innerText;
          console.log("checkout.price is: " + checkout.price);
          localStorage.setItem("payment_info", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
      event5.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          checkout.price = document.querySelector('#ticket-price5').innerText;
          console.log("checkout.price is: " + checkout.price);
          localStorage.setItem("payment_info", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
      event6.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          checkout.price = document.querySelector('#ticket-price6').innerText;
          console.log("checkout.price is: " + checkout.price);
          localStorage.setItem("payment_info", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
    });  // End of DOMContentLoaded
  }
  else if (page2 !== null && page2.id == 'seating') {
    console.log("Seating page was found");
    document.addEventListener('DOMContentLoaded', function(){
      if(storageAvailable('localStorage')){
        var checkout = JSON.parse(localStorage.getItem('payment_info'));
        localStorage.removeItem('payment_info')
      } // end if statement to check for localStorage

      console.log(checkout.price);
      document.getElementById("ticket-price").innerHTML = checkout.price;

      var section = document.querySelector('#sectionlevel')
      section.addEventListener("change", function(){
        var ticketTotal = Number(section.value) * Number(clean_nonnumber(checkout.price));
        checkout.ticketTotal = ticketTotal;
        document.getElementById("ticket-price").innerHTML = "$" + ticketTotal;
      });

      var quantity = document.querySelector('#seat-quantity')
      quantity.addEventListener("change", function(){
        checkout.ticketNum = Number(quantity.value)
        checkout.total = checkout.ticketNum * checkout.ticketTotal;
        document.getElementById("total").innerHTML = "$" + checkout.total;
      });

      var seatSubmit = document.querySelector('#seat-submit')
      seatSubmit.addEventListener("click", function(){
        if(storageAvailable('localStorage')){
          localStorage.setItem("payment_info2", JSON.stringify(checkout));
        } // end if statement to check for localStorage
      });
    });  // End of DOMContentLoaded
  }
  else if (page3 !== null && page3.id == 'check-out' ) {
    console.log("Checkout page was found");
    document.addEventListener('DOMContentLoaded', function(){
      var signup_form = document.querySelector('#payment');
      var signup_submit=document.querySelector('#submit');// submit button

      if(storageAvailable('localStorage')){
        var checkout = JSON.parse(localStorage.getItem('payment_info2'));
        localStorage.removeItem('payment_info2')
      }

      // listen for keyup event anywhere in the form
      signup_form.addEventListener('keyup', function(){
        checkout.email=document.querySelector('#email').value;
        checkout.phone=document.querySelector('#phonenumber').value;
        checkout.ccn=document.querySelector('#ccn').value;
        checkout.cvv=document.querySelector('#cvv').value;
        checkout.fname= document.querySelector('#fname').value;
        checkout.lname= document.querySelector('#lname').value;

        // signup_submit.removeAttribute('disabled');
        signup_submit.setAttribute('disabled', 'disabled');

        // var contact_error = document.querySelector('#contact-error');
        // Disable signup button if either email or phone number is filled.
        if (validate_us_phone(checkout.phone) && validate_email(checkout.email) && validate_ccn(checkout.ccn) && validate_cvv(checkout.cvv) && checkout.fname!==null && checkout.lname!==null) {
          signup_submit.removeAttribute('disabled');
        }
        else {
          // show user error message
          if(checkout.phone.length > 10) {
            console.log("Invalid phone number!");
          }
          // This will re-disable the submmit button if the input changes to an invalid state
          signup_submit.setAttribute('disabled', 'disabled');
        }

        if(storageAvailable('localStorage')){
          signup_form.addEventListener('submit', function(){
            localStorage.setItem("payment_info3", JSON.stringify(checkout));
            console.log("Form submitted and data stored");
          }); // end blog.form event listener
        } // end if statement to check for localStorage

      }); // end of key up listener

      var location = {
        zip: document.querySelector('#zip'),
        state: document.querySelector('#state'),
        city: document.querySelector('#city')
      };

      // Function that calls zippopotam to fill out the form given the zipcode
      if('fetch' in window) {
        console.log("yay, this browser suppports the Fetch API");
        location.city.classList.add('fade-out');
        location.city.classList.add('fade-out');

        var zip;
        location.zip.addEventListener('keyup', function() {
          if (validate_zip(location.zip.value) && zip !== location.zip.value){
            zip = location.zip.value;
            fetch('http://api.zippopotam.us/us/' + location.zip.value)
              .then(function(response) {
                if (response.ok){
                  return response.json();
                }
                throw Error('No data for ZIP code' + location.zip.value);
              })
              .then(function(fetchv) {
                location.city.value = fetchv.places[0]["place name"];
                location.state.value = fetchv.places[0].state;
                location.city.classList.add('fade-in');
                location.state.classList.add('fade-in');
              })
              .catch(function(error) {
                console.log(error);
                location.city.value = '';
                location.state.value = '';
                location.city.classList.add('fade-in');
                location.state.classList.add('fade-in');
              });
          }
        });// end of event listener
      }// end of fetch
    });  // End of DOMContentLoaded
  }
  else if (page4 !== null && page4.id == 'confirmation') {
    console.log("Confirmation page was found");
    document.addEventListener('DOMContentLoaded', function(){
      var checkout = JSON.parse(localStorage.getItem('payment_info3'));
      console.log(checkout.fname);

      document.getElementById("cdate").innerHTML = 'Time: '+ time();
      document.getElementById("confirmation-number").innerHTML = 'Confirmation: ' + confirmationTicket();
      document.getElementById("cfname").innerHTML = 'First Name: ' + checkout.fname;
      document.getElementById("clname").innerHTML = 'Last Name: ' + checkout.lname;
      document.getElementById("cemail").innerHTML = 'Email: ' + checkout.email;
      document.getElementById("cticket-amount").innerHTML = 'Amount of Tickets: ' + checkout.ticketNum;
      document.getElementById("cticket-price").innerHTML = 'Ticket Price: $' + checkout.ticketTotal;
      document.getElementById("ctotal").innerHTML = 'Total: $' + checkout.total;

    });  // End of DOMContentLoaded
  }
  else {
    console.log('No page found!');
  }


}());  // End of IIFE
