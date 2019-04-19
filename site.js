(function(){
  // Browser sanity check:
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old, old browser. Say buh-bye
    // console.log('Old browser');
    return;
  }

  // Library of comparison functions
  //
  // Unlike the raw operators these encapsulate, functions
  // can be passed around like any other value into other
  // functions.
  function eq(value, condition) {
    return value === condition;
  }
  function gt(value, condition) {
    return value > condition;
  }
  function gte(value, condition) {
    return value >= condition;
  }
  function lt(value, condition) {
    return value < condition;
  }
  function lte(value, condition) {
    return value <= condition;
  }

  // Data cleanup functions
  function clean_nonnumbers(value) {
    // returns value with all non-digits removed
    return value.replace(/\D/g, '');
  }
  function clean_whitespace(value) {
    // returns value with all whitespace characters removed
    return value.replace(/\s/g, '');
  }

  // Phone-specific santizier functions
  function strip_us_country_code(value) {
    return value.replace(/^1/, '');
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

  // Phone validity functions
  function validate_us_phone(value) {
    var phone_number = strip_us_country_code(clean_nonnumbers(value));
    return validate(phone_number.length, eq, 10);
  }

  // Email validity function
  function validate_email(value) {
    var email = clean_whitespace(value);
    return validate(contact, /^[^@\s]+@[^@\s]+$/g);
  }

  // Credit card number validity function
  function validate_ccn(ccn) {
  // Valid CCN is a 16-digit string with no whitespace
    return validate(remove_all_whitespace(ccn), /^[0-9]{16}$/g);
  }

  // CVV validity function
  function validate_ccv(ccv) {
  // Valid security code is a 3 or 4 digit string with all whitespace removed
    return validate(remove_all_whitespace(ccv), /^[0-9]{3}[0-9]?$/g);
  }
  // Exp month validity function
  function validate_expr_month(expmonth_container) {
  // Valid mo is a 2-digit number between 1-12
    if (expmonth_container >= 1 && expmonth_container <= 12) {
      return true;
    }
    return false;
  }

  // year validity function
  function validate_expr_year(card_year) {
    // Valid year is a 4-digit number after [current year]
    if (card_year >= 2019 && card_year <= 9999) {
      return true;
    }
    return false;
  }

  // name validity function
  function validate_name(f_name, l_name) {
    // Valid name is a non-empty string after removing excess whitespace
    return validate(remove_excess_whitespace(f_name, l_name), /.+/g);
  }

  // ZIP code validity function
  function validate_us_zip(value) {
    var zip = clean_nonnumbers(value);
    return validate(zip.length, eq, 5);
  }


document.addEventListener('DOMContentLoaded' ,function() {
  console.log("DOM is loaded");

  // select the necessary elements from the DOM
  var signup_input = document.querySelector('#submit-container');
  var contact_input = document.querySelector('#contact');
  var phone_input = document.querySelector('#phone_number');
  var signup_submit=document.querySelector('#submit');

  signup_submit.removeAttribute('disabled');

  var location = {
    zip: document.querySelector('#zip'),
    state: document.querySelector('#state'),
    city: document.querySelector('#city')
  };

function rmnumber(value) {
    return value.replace(/\D/g,'');
}

function equals(value,condition) {
    return value === condition;
  }

function validate(value,check,condition) {
  if (equals(typeof(check.test),'function')) {
    return check.test(value);
  }
  else if (equals(typeof(check),'function'))
  {
    return check(value,condition);
  }
  else
  {
    return false;
  }
}
function validate_zip(value){
  var zip = rmnumber(value);
  return validate(zip.length,equals,5);
}

if('fetch' in window) {
  console.log("yay, this browser suppports the Fetch API");
  location.city.classList.add('fade-out');
  location.city.classList.add('fade-out');

  var zip;
  location.zip.addEventListener('keyup', function(e) {
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
          location.state.value = fetchv.places[0]["state"];
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
  });
}
 // End of DOMContentLoaded
});
// End of IIFE
}());
