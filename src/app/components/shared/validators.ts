import { FormControl } from '@angular/forms';

export function validateEmail(c: FormControl) {
  if (c.value) {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.  [0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEXP.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  } else {
    return {
      validateEmail: {
        valid: false
      }
    };
  }
}

export function validateNip(c: FormControl) {
  if (c.value) {
    const NIP_REGEXP = /(\d[\s-]*){9}\d/;
    let valid = false;
    if (c.value) {
      const value = c.value;
      valid = value.replace(/[-\s]/g, '').length === 10;
    }
    return NIP_REGEXP.test(c.value) && valid ? null : {
      validateNip: { valid: false }
    };
  } else {
    return {
      validateNip: { valid: false }
    };
  }
}

export function validatePhone(c: FormControl) {
  let valid = false;
  if (c.value) {
    const value = c.value;
    valid = value.indexOf('+48') !== -1 ? value.slice(value.indexOf('+48') + 3).length > 8 : value.length > 8;
  }
  return valid ? null : {
    validatePhone: {
      valid: false
    }
  };
}


export function validatePostCode(c: FormControl) {
  if (c.value) {
    const POSTCODE_REGEXP = /[0-9]{2}[-\s]{1}[0-9]{3}|[0-9]{2}[0-9]{3}/;
    return POSTCODE_REGEXP.test(c.value) ? null : {
      validatePostCode: { valid: false }
    };
  } else {
    return {
      validatePostCode: { valid: false }
    };
  }
}

