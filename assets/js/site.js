"use strict";
(function(){
  // Browser sanity check
  if (!('querySelector' in document && 'addEventListener' in document)) {
    // Old browser
    console.log('Old browser');
    return;
  }// Function to be called later for determining localStorage support
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

  // Functions for working with form data
  // Return all data-rich input elements
  function collectFormInputElements(form_selector) {
    var saved_input_elements = [];
    var input_elements = document.querySelector(form_selector).elements;
    for (var input of input_elements) {
      if(input.type !== 'submit') {
        saved_input_elements.push(input);
      }
    }
    return saved_input_elements;
  }

  // Get all interesting information about an input element
 function getInputData(input_element) {
   return {
     id: input_element.id,
     name: input_element.name,
     type: input_element.tagName.toLowerCase(),
     value: input_element.value
   };
 }

 // Store a prefixed storage item with input item data
  function storePrefixedInputStorageItem(prefix,input_element) {
    var item_data = getInputData(input_element);
    localStorage.setItem(prefix + item_data.id, JSON.stringify(item_data));
  }

  // Retrieve and parse an input storage item
  function retrieveAndParseInputStorageItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  // Retrieve all prefixed storage item keys
  function retrievePrefixedStorageItemKeys(prefix) {
    var saved_keys = [];
    for(var i = 0; i < localStorage.length; i++) {
      // Get only the items that begin with `prefix`
      var key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        saved_keys.push(key);
      }
    }
    return saved_keys;
  }

  function restorePrefixedFormInputsFromLocalStorage(prefix) {
    // Get an array of all the prefixed stored keys
    var saved_keys = retrievePrefixedStorageItemKeys(prefix);
    // Loop through the array and use the stored object data to
    // restore the value of the corresponding form item
    for (var key of saved_keys) {
      var item = retrieveAndParseInputStorageItem(key);
      // Use old-school getElementById; no need to prefix with #
      var input_by_id = document.getElementById(item.id);
      if (input_by_id) {
        input_by_id.value = item.value;
      }
    }
  }

  function destroyPrefixedStorageItemKeys(prefix) {
    var keys_to_destroy = retrievePrefixedStorageItemKeys(prefix);
    for (var key of keys_to_destroy) {
      localStorage.removeItem(key);
    }
  }

  // select the necessary elements from the DOM
  document.addEventListener('DOMContentLoaded', function(){
    var signup_form = document.querySelector('#payment');
    var signup_submit=document.querySelector('#submit');// submit button




    // signup_submit.removeAttribute('disabled');
    signup_submit.setAttribute('disabled', 'disabled');



    // listen for keyup event anywhere in the form
    signup_form.addEventListener('keyup', function(){
      var email_input=document.querySelector('#email').value;
      var phone_input=document.querySelector('#phonenumber').value;
      var ccn_input=document.querySelector('#ccn').value;
      var cvv_input=document.querySelector('#cvv').value;
      var fname_input = document.querySelector('#fname').value;
      var lname_input = document.querySelector('#lname').value;

      //Local storage for the checkout webpage
      var checkout = {
        //TODO: implement get syntax to avoid repeating document.querySelector so dang much
        form: document.querySelector('#payment'),
        get title() {
          return this.form.querySelector('#title');
        },
        email: document.querySelector('#email'),
        phone_input: document.querySelector('#phonenumber'),
        ccn: document.querySelector('#ccn'),
        cvv: document.querySelector('#cvv'),
        fname:  document.querySelector('#fname'),
        lname: document.querySelector('#lname'),

        submit_area: document.querySelector('#submit-container'),
        submit_button: document.querySelector('#submit')
        //eh_submit_button: document.createElement('a')
      } 

      // var contact_error = document.querySelector('#contact-error');
      // Disable signup button if either email or phone number is filled.
      if (validate_us_phone(phone_input) && validate_email(email_input) && validate_ccn(ccn_input)
      && validate_cvv(cvv_input) && fname_input!==null && lname_input!==null) {
        signup_submit.removeAttribute('disabled');
      }
      else {
        // show user error message

        if(phone_input.length > 10) {
          console.log("Invalid phone number!");
        }
        // This will re-disable the submmit button if the input changes to an invalid state
        signup_submit.setAttribute('disabled', 'disabled');
      }
    });

    function rmnumber(value) {
      return value.replace(/\D/g, '');
    }

    function equals(value, condition) {
      return value === condition;
    }

    function validate(value, check, condition) {
      if (equals(typeof(check.test), 'function')) {
        return check.test(value);
      }
      else if (equals(typeof(check), 'function'))
      {
        return check(value, condition);
      }
      else
      {
        return false;
      }
    }

    // Function to validate the zip input
    function validate_zip(value){
      var zip = rmnumber(value);
      return validate(zip.length, equals, 5);
    }

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
      });// end of IIFE event listener
    }// end of if statement checking the fetch api



    // End of DOMContentLoaded
  });
  // End of IIFE
}());
