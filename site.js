(function(){
  // Browser sanity check
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old browser
    console.log('Old browser');
    return;
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

  // Remove excess whitespace
  function remove_excess_whitespace(value) {
    value = value.replace(/^ +/g, '');  // Remove whitespace from beginning
    value = value.replace(/ +$/g, '');  // Remove whitespace from end
    value = value.replace(/ +/g, ' ');  // Remove extra whitespace in the middle
    return value;
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

   function validate_expmonth(expmonthcontainer) {
       // validate month
       expmonthcontainer = Number(expmonthcontainer);

       if (expmonthcontainer >= 1 && expmonthcontainer <= 12) {
         return true;
       }
       return false;
     }

     function validate_expr_year(cardyear) {
       // Validate cardyear is between the range instructed
       cardyear = Number(cardyear);

       if (cardyear >= 2019 && cardyear <= 2030) {
         return true;
       }
       return false;
     }

  // select the necessary elements from the DOM
  document.addEventListener('DOMContentLoaded', function(){
    var signup_form = document.querySelector('#payment');
    var signup_submit=document.querySelector('#submit');//submit button

    var email_input=document.querySelector('#email');
    var phone_input=document.querySelector('#phonenumber');

    //var ccn_input=document.querySelector('#ccn');



    //signup_submit.removeAttribute('disabled');
    signup_submit.setAttribute('disabled','disabled');



    // listen for keyup event anywhere in the form
    signup_form.addEventListener('keyup', function(){
      //var contact_value = contact_input.value;
      var phone_value = phone_input.value;
      var email_value = email_input.value;
      var ccn_input=document.querySelector('#ccn').value;
      var cvv_input=document.querySelector('#cvv').value;
      var expmonth_input=document.querySelector('#expmonthcontainer').value;
      var expr_year_input=document.querySelector('#cardyear').value;
      var fname_input = document.querySelector('#fname').value;
      var lname_input = document.querySelector('#lname').value;


      var contact_error = document.querySelector('#contact-error');
      // Disable signup button if either email or phone number is filled.
      if (validate_us_phone(phone_value) && validate_email(email_value) && validate_ccn(ccn_input)
      && validate_cvv(cvv_input) && fname_input!==null && lname_input!==null) {
        signup_submit.removeAttribute('disabled');
      }
      else {
        // show user error message

        if(phone_value.length > 10) {
          console.log("Invalid phone number!");
        }
        // This will re-disable the submmit button if the input changes to an invalid state
        signup_submit.setAttribute('disabled', 'disabled');
      }
    });

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

//Function to validate the zip input
function validate_zip(value){
  var zip = rmnumber(value);
  return validate(zip.length,equals,5);
}

//Function that calls zippopotam to fill out the form given the zipcode
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
  });//end of IIFE event listener
}//end of if statement checking the fetch api



    // End of DOMContentLoaded
  });
  // End of IIFE
}());
