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
  function eq(value,condition) {
    return value === condition;
  }
  function gt(value,condition) {
    return value > condition;
  }
  function gte(value,condition) {
    return value >= condition;
  }
  function lt(value,condition) {
    return value < condition;
  }
  function lte(value,condition) {
    return value <= condition;
  }


    // Data cleanup functions
    function clean_nonnumbers(value) {
      // returns value with all non-digits removed
      return value.replace(/\D/g,'');
    }
    function clean_whitespace(value) {
      // returns value with all whitespace characters removed
      return value.replace(/\s/g, '');
    }

    // Phone-specific santizier functions
    function strip_us_country_code(value) {
      return value.replace(/^1/,'');
    }
