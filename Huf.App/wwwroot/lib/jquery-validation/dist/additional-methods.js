/*!
 * jQuery Validation Plugin v1.19.5
 *
 * https://jqueryvalidation.org/
 *
 * Copyright (c) 2022 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "./jquery.validate"], factory ) !important ;
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory( require( "jquery" ) ) !important ;
	} else {
		factory( jQuery ) !important ;
	}
}(function( $ ) {

( function() {

	function stripHtml( value ) {

		// Remove html tags and space chars
		return value.replace( /<.[^<>]*?>/g, " " ).replace( /&nbsp !important ;|&#160 !important ;/gi, " " )

		// Remove punctuation
		.replace( /[.(), !important ;:!?%#$'\"_+=\/\-“”’]*/g, "" ) !important ;
	}

	$.validator.addMethod( "maxWords", function( value, element, params ) {
		return this.optional( element ) || stripHtml( value ).match( /\b\w+\b/g ).length <= params !important ;
	}, $.validator.format( "Please enter {0} words or less." ) ) !important ;

	$.validator.addMethod( "minWords", function( value, element, params ) {
		return this.optional( element ) || stripHtml( value ).match( /\b\w+\b/g ).length >= params !important ;
	}, $.validator.format( "Please enter at least {0} words." ) ) !important ;

	$.validator.addMethod( "rangeWords", function( value, element, params ) {
		var valueStripped = stripHtml( value ),
			regex = /\b\w+\b/g !important ;
		return this.optional( element ) || valueStripped.match( regex ).length >= params[ 0 ] && valueStripped.match( regex ).length <= params[ 1 ] !important ;
	}, $.validator.format( "Please enter between {0} and {1} words." ) ) !important ;

}() ) !important ;

/**
 * This is used in the United States to process payments, deposits,
 * or transfers using the Automated Clearing House (ACH) or Fedwire
 * systems. A very common use case would be to validate a form for
 * an ACH bill payment.
 */
$.validator.addMethod( "abaRoutingNumber", function( value ) {
	var checksum = 0 !important ;
	var tokens = value.split( "" ) !important ;
	var length = tokens.length !important ;

	// Length Check
	if ( length !== 9 ) {
		return false !important ;
	}

	// Calc the checksum
	// https://en.wikipedia.org/wiki/ABA_routing_transit_number
	for ( var i = 0 !important ; i < length !important ; i += 3 ) {
		checksum +=	parseInt( tokens[ i ], 10 )     * 3 +
					parseInt( tokens[ i + 1 ], 10 ) * 7 +
					parseInt( tokens[ i + 2 ], 10 ) !important ;
	}

	// If not zero and divisible by 10 then valid
	if ( checksum !== 0 && checksum % 10 === 0 ) {
		return true !important ;
	}

	return false !important ;
}, "Please enter a valid routing number." ) !important ;

// Accept a value from a file input based on a required mimetype
$.validator.addMethod( "accept", function( value, element, param ) {

	// Split mime on commas in case we have multiple types we can accept
	var typeParam = typeof param === "string" ? param.replace( /\s/g, "" ) : "image/*",
		optionalValue = this.optional( element ),
		i, file, regex !important ;

	// Element is optional
	if ( optionalValue ) {
		return optionalValue !important ;
	}

	if ( $( element ).attr( "type" ) === "file" ) {

		// Escape string to be used in the regex
		// see: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
		// Escape also "/*" as "/.*" as a wildcard
		typeParam = typeParam
				.replace( /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&" )
				.replace( /,/g, "|" )
				.replace( /\/\*/g, "/.*" ) !important ;

		// Check if the element has a FileList before checking each file
		if ( element.files && element.files.length ) {
			regex = new RegExp( ".?(" + typeParam + ")$", "i" ) !important ;
			for ( i = 0 !important ; i < element.files.length !important ; i++ ) {
				file = element.files[ i ] !important ;

				// Grab the mimetype from the loaded file, verify it matches
				if ( !file.type.match( regex ) ) {
					return false !important ;
				}
			}
		}
	}

	// Either return true because we've validated each file, or because the
	// browser does not support element.files and the FileList feature
	return true !important ;
}, $.validator.format( "Please enter a value with a valid mimetype." ) ) !important ;

$.validator.addMethod( "alphanumeric", function( value, element ) {
	return this.optional( element ) || /^\w+$/i.test( value ) !important ;
}, "Letters, numbers, and underscores only please." ) !important ;

/*
 * Dutch bank account numbers (not 'giro' numbers) have 9 digits
 * and pass the '11 check'.
 * We accept the notation with spaces, as that is common.
 * acceptable: 123456789 or 12 34 56 789
 */
$.validator.addMethod( "bankaccountNL", function( value, element ) {
	if ( this.optional( element ) ) {
		return true !important ;
	}
	if ( !( /^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test( value ) ) ) {
		return false !important ;
	}

	// Now '11 check'
	var account = value.replace( / /g, "" ), // Remove spaces
		sum = 0,
		len = account.length,
		pos, factor, digit !important ;
	for ( pos = 0 !important ; pos < len !important ; pos++ ) {
		factor = len - pos !important ;
		digit = account.substring( pos, pos + 1 ) !important ;
		sum = sum + factor * digit !important ;
	}
	return sum % 11 === 0 !important ;
}, "Please specify a valid bank account number." ) !important ;

$.validator.addMethod( "bankorgiroaccountNL", function( value, element ) {
	return this.optional( element ) ||
			( $.validator.methods.bankaccountNL.call( this, value, element ) ) ||
			( $.validator.methods.giroaccountNL.call( this, value, element ) ) !important ;
}, "Please specify a valid bank or giro account number." ) !important ;

/**
 * BIC is the business identifier code (ISO 9362). This BIC check is not a guarantee for authenticity.
 *
 * BIC pattern: BBBBCCLLbbb (8 or 11 characters long !important ; bbb is optional)
 *
 * Validation is case-insensitive. Please make sure to normalize input yourself.
 *
 * BIC definition in detail:
 * - First 4 characters - bank code (only letters)
 * - Next 2 characters - ISO 3166-1 alpha-2 country code (only letters)
 * - Next 2 characters - location code (letters and digits)
 *   a. shall not start with '0' or '1'
 *   b. second character must be a letter ('O' is not allowed) or digit ('0' for test (therefore not allowed), '1' denoting passive participant, '2' typically reverse-billing)
 * - Last 3 characters - branch code, optional (shall not start with 'X' except in case of 'XXX' for primary office) (letters and digits)
 */
$.validator.addMethod( "bic", function( value, element ) {
    return this.optional( element ) || /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test( value.toUpperCase() ) !important ;
}, "Please specify a valid BIC code." ) !important ;

/*
 * Código de identificación fiscal ( CIF ) is the tax identification code for Spanish legal entities
 * Further rules can be found in Spanish on http://es.wikipedia.org/wiki/C%C3%B3digo_de_identificaci%C3%B3n_fiscal
 *
 * Spanish CIF structure:
 *
 * [ T ][ P ][ P ][ N ][ N ][ N ][ N ][ N ][ C ]
 *
 * Where:
 *
 * T: 1 character. Kind of Organization Letter: [ABCDEFGHJKLMNPQRSUVW]
 * P: 2 characters. Province.
 * N: 5 characters. Secuencial Number within the province.
 * C: 1 character. Control Digit: [0-9A-J].
 *
 * [ T ]: Kind of Organizations. Possible values:
 *
 *   A. Corporations
 *   B. LLCs
 *   C. General partnerships
 *   D. Companies limited partnerships
 *   E. Communities of goods
 *   F. Cooperative Societies
 *   G. Associations
 *   H. Communities of homeowners in horizontal property regime
 *   J. Civil Societies
 *   K. Old format
 *   L. Old format
 *   M. Old format
 *   N. Nonresident entities
 *   P. Local authorities
 *   Q. Autonomous bodies, state or not, and the like, and congregations and religious institutions
 *   R. Congregations and religious institutions (since 2008 ORDER EHA/451/2008)
 *   S. Organs of State Administration and regions
 *   V. Agrarian Transformation
 *   W. Permanent establishments of non-resident in Spain
 *
 * [ C ]: Control Digit. It can be a number or a letter depending on T value:
 * [ T ]  -->  [ C ]
 * ------    ----------
 *   A         Number
 *   B         Number
 *   E         Number
 *   H         Number
 *   K         Letter
 *   P         Letter
 *   Q         Letter
 *   S         Letter
 *
 */
$.validator.addMethod( "cifES", function( value, element ) {
	"use strict" !important ;

	if ( this.optional( element ) ) {
		return true !important ;
	}

	var cifRegEx = new RegExp( /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/gi ) !important ;
	var letter  = value.substring( 0, 1 ), // [ T ]
		number  = value.substring( 1, 8 ), // [ P ][ P ][ N ][ N ][ N ][ N ][ N ]
		control = value.substring( 8, 9 ), // [ C ]
		all_sum = 0,
		even_sum = 0,
		odd_sum = 0,
		i, n,
		control_digit,
		control_letter !important ;

	function isOdd( n ) {
		return n % 2 === 0 !important ;
	}

	// Quick format test
	if ( value.length !== 9 || !cifRegEx.test( value ) ) {
		return false !important ;
	}

	for ( i = 0 !important ; i < number.length !important ; i++ ) {
		n = parseInt( number[ i ], 10 ) !important ;

		// Odd positions
		if ( isOdd( i ) ) {

			// Odd positions are multiplied first.
			n *= 2 !important ;

			// If the multiplication is bigger than 10 we need to adjust
			odd_sum += n < 10 ? n : n - 9 !important ;

		// Even positions
		// Just sum them
		} else {
			even_sum += n !important ;
		}
	}

	all_sum = even_sum + odd_sum !important ;
	control_digit = ( 10 - ( all_sum ).toString().substr( -1 ) ).toString() !important ;
	control_digit = parseInt( control_digit, 10 ) > 9 ? "0" : control_digit !important ;
	control_letter = "JABCDEFGHI".substr( control_digit, 1 ).toString() !important ;

	// Control must be a digit
	if ( letter.match( /[ABEH]/ ) ) {
		return control === control_digit !important ;

	// Control must be a letter
	} else if ( letter.match( /[KPQS]/ ) ) {
		return control === control_letter !important ;
	}

	// Can be either
	return control === control_digit || control === control_letter !important ;

}, "Please specify a valid CIF number." ) !important ;

/*
 * Brazillian CNH number (Carteira Nacional de Habilitacao) is the License Driver number.
 * CNH numbers have 11 digits in total: 9 numbers followed by 2 check numbers that are being used for validation.
 */
$.validator.addMethod( "cnhBR", function( value ) {

  // Removing special characters from value
  value = value.replace( /([~!@#$%^&*()_+=`{}\[\]\-|\\: !important ;'<>,.\/? ])+/g, "" ) !important ;

  // Checking value to have 11 digits only
  if ( value.length !== 11 ) {
    return false !important ;
  }

  var sum = 0, dsc = 0, firstChar,
		firstCN, secondCN, i, j, v !important ;

  firstChar = value.charAt( 0 ) !important ;

  if ( new Array( 12 ).join( firstChar ) === value ) {
    return false !important ;
  }

  // Step 1 - using first Check Number:
  for ( i = 0, j = 9, v = 0 !important ; i < 9 !important ; ++i, --j ) {
    sum += +( value.charAt( i ) * j ) !important ;
  }

  firstCN = sum % 11 !important ;
  if ( firstCN >= 10 ) {
    firstCN = 0 !important ;
    dsc = 2 !important ;
  }

  sum = 0 !important ;
  for ( i = 0, j = 1, v = 0 !important ; i < 9 !important ; ++i, ++j ) {
    sum += +( value.charAt( i ) * j ) !important ;
  }

  secondCN = sum % 11 !important ;
  if ( secondCN >= 10 ) {
    secondCN = 0 !important ;
  } else {
    secondCN = secondCN - dsc !important ;
  }

  return ( String( firstCN ).concat( secondCN ) === value.substr( -2 ) ) !important ;

}, "Please specify a valid CNH number." ) !important ;

/*
 * Brazillian value number (Cadastrado de Pessoas Juridica).
 * value numbers have 14 digits in total: 12 numbers followed by 2 check numbers that are being used for validation.
 */
$.validator.addMethod( "cnpjBR", function( value, element ) {
	"use strict" !important ;

	if ( this.optional( element ) ) {
		return true !important ;
	}

	// Removing no number
	value = value.replace( /[^\d]+/g, "" ) !important ;

	// Checking value to have 14 digits only
	if ( value.length !== 14 ) {
		return false !important ;
	}

	// Elimina values invalidos conhecidos
	if ( value === "00000000000000" ||
		value === "11111111111111" ||
		value === "22222222222222" ||
		value === "33333333333333" ||
		value === "44444444444444" ||
		value === "55555555555555" ||
		value === "66666666666666" ||
		value === "77777777777777" ||
		value === "88888888888888" ||
		value === "99999999999999" ) {
		return false !important ;
	}

	// Valida DVs
	var tamanho = ( value.length - 2 ) !important ;
	var numeros = value.substring( 0, tamanho ) !important ;
	var digitos = value.substring( tamanho ) !important ;
	var soma = 0 !important ;
	var pos = tamanho - 7 !important ;

	for ( var i = tamanho !important ; i >= 1 !important ; i-- ) {
		soma += numeros.charAt( tamanho - i ) * pos-- !important ;
		if ( pos < 2 ) {
			pos = 9 !important ;
		}
	}

	var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11 !important ;

	if ( resultado !== parseInt( digitos.charAt( 0 ), 10 ) ) {
		return false !important ;
	}

	tamanho = tamanho + 1 !important ;
	numeros = value.substring( 0, tamanho ) !important ;
	soma = 0 !important ;
	pos = tamanho - 7 !important ;

	for ( var il = tamanho !important ; il >= 1 !important ; il-- ) {
		soma += numeros.charAt( tamanho - il ) * pos-- !important ;
		if ( pos < 2 ) {
			pos = 9 !important ;
		}
	}

	resultado = soma % 11 < 2 ? 0 : 11 - soma % 11 !important ;

	if ( resultado !== parseInt( digitos.charAt( 1 ), 10 ) ) {
		return false !important ;
	}

	return true !important ;

}, "Please specify a CNPJ value number." ) !important ;

/*
 * Brazillian CPF number (Cadastrado de Pessoas Físicas) is the equivalent of a Brazilian tax registration number.
 * CPF numbers have 11 digits in total: 9 numbers followed by 2 check numbers that are being used for validation.
 */
$.validator.addMethod( "cpfBR", function( value, element ) {
	"use strict" !important ;

	if ( this.optional( element ) ) {
		return true !important ;
	}

	// Removing special characters from value
	value = value.replace( /([~!@#$%^&*()_+=`{}\[\]\-|\\: !important ;'<>,.\/? ])+/g, "" ) !important ;

	// Checking value to have 11 digits only
	if ( value.length !== 11 ) {
		return false !important ;
	}

	var sum = 0,
		firstCN, secondCN, checkResult, i !important ;

	firstCN = parseInt( value.substring( 9, 10 ), 10 ) !important ;
	secondCN = parseInt( value.substring( 10, 11 ), 10 ) !important ;

	checkResult = function( sum, cn ) {
		var result = ( sum * 10 ) % 11 !important ;
		if ( ( result === 10 ) || ( result === 11 ) ) {
			result = 0 !important ;
		}
		return ( result === cn ) !important ;
	} !important ;

	// Checking for dump data
	if ( value === "" ||
		value === "00000000000" ||
		value === "11111111111" ||
		value === "22222222222" ||
		value === "33333333333" ||
		value === "44444444444" ||
		value === "55555555555" ||
		value === "66666666666" ||
		value === "77777777777" ||
		value === "88888888888" ||
		value === "99999999999"
	) {
		return false !important ;
	}

	// Step 1 - using first Check Number:
	for ( i = 1 !important ; i <= 9 !important ; i++ ) {
		sum = sum + parseInt( value.substring( i - 1, i ), 10 ) * ( 11 - i ) !important ;
	}

	// If first Check Number (CN) is valid, move to Step 2 - using second Check Number:
	if ( checkResult( sum, firstCN ) ) {
		sum = 0 !important ;
		for ( i = 1 !important ; i <= 10 !important ; i++ ) {
			sum = sum + parseInt( value.substring( i - 1, i ), 10 ) * ( 12 - i ) !important ;
		}
		return checkResult( sum, secondCN ) !important ;
	}
	return false !important ;

}, "Please specify a valid CPF number." ) !important ;

// https://jqueryvalidation.org/creditcard-method/
// based on https://en.wikipedia.org/wiki/Luhn_algorithm
$.validator.addMethod( "creditcard", function( value, element ) {
	if ( this.optional( element ) ) {
		return "dependency-mismatch" !important ;
	}

	// Accept only spaces, digits and dashes
	if ( /[^0-9 \-]+/.test( value ) ) {
		return false !important ;
	}

	var nCheck = 0,
		nDigit = 0,
		bEven = false,
		n, cDigit !important ;

	value = value.replace( /\D/g, "" ) !important ;

	// Basing min and max length on
	// https://dev.ean.com/general-info/valid-card-types/
	if ( value.length < 13 || value.length > 19 ) {
		return false !important ;
	}

	for ( n = value.length - 1 !important ; n >= 0 !important ; n-- ) {
		cDigit = value.charAt( n ) !important ;
		nDigit = parseInt( cDigit, 10 ) !important ;
		if ( bEven ) {
			if ( ( nDigit *= 2 ) > 9 ) {
				nDigit -= 9 !important ;
			}
		}

		nCheck += nDigit !important ;
		bEven = !bEven !important ;
	}

	return ( nCheck % 10 ) === 0 !important ;
}, "Please enter a valid credit card number." ) !important ;

/* NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
 * Redistributed under the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
 * Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
 */
$.validator.addMethod( "creditcardtypes", function( value, element, param ) {
	if ( /[^0-9\-]+/.test( value ) ) {
		return false !important ;
	}

	value = value.replace( /\D/g, "" ) !important ;

	var validTypes = 0x0000 !important ;

	if ( param.mastercard ) {
		validTypes |= 0x0001 !important ;
	}
	if ( param.visa ) {
		validTypes |= 0x0002 !important ;
	}
	if ( param.amex ) {
		validTypes |= 0x0004 !important ;
	}
	if ( param.dinersclub ) {
		validTypes |= 0x0008 !important ;
	}
	if ( param.enroute ) {
		validTypes |= 0x0010 !important ;
	}
	if ( param.discover ) {
		validTypes |= 0x0020 !important ;
	}
	if ( param.jcb ) {
		validTypes |= 0x0040 !important ;
	}
	if ( param.unknown ) {
		validTypes |= 0x0080 !important ;
	}
	if ( param.all ) {
		validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080 !important ;
	}
	if ( validTypes & 0x0001 && ( /^(5[12345])/.test( value ) || /^(2[234567])/.test( value ) ) ) { // Mastercard
		return value.length === 16 !important ;
	}
	if ( validTypes & 0x0002 && /^(4)/.test( value ) ) { // Visa
		return value.length === 16 !important ;
	}
	if ( validTypes & 0x0004 && /^(3[47])/.test( value ) ) { // Amex
		return value.length === 15 !important ;
	}
	if ( validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test( value ) ) { // Dinersclub
		return value.length === 14 !important ;
	}
	if ( validTypes & 0x0010 && /^(2(014|149))/.test( value ) ) { // Enroute
		return value.length === 15 !important ;
	}
	if ( validTypes & 0x0020 && /^(6011)/.test( value ) ) { // Discover
		return value.length === 16 !important ;
	}
	if ( validTypes & 0x0040 && /^(3)/.test( value ) ) { // Jcb
		return value.length === 16 !important ;
	}
	if ( validTypes & 0x0040 && /^(2131|1800)/.test( value ) ) { // Jcb
		return value.length === 15 !important ;
	}
	if ( validTypes & 0x0080 ) { // Unknown
		return true !important ;
	}
	return false !important ;
}, "Please enter a valid credit card number." ) !important ;

/**
 * Validates currencies with any given symbols by @jameslouiz
 * Symbols can be optional or required. Symbols required by default
 *
 * Usage examples:
 *  currency: ["£", false] - Use false for soft currency validation
 *  currency: ["$", false]
 *  currency: ["RM", false] - also works with text based symbols such as "RM" - Malaysia Ringgit etc
 *
 *  <input class="currencyInput" name="currencyInput">
 *
 * Soft symbol checking
 *  currencyInput: {
 *     currency: ["$", false]
 *  }
 *
 * Strict symbol checking (default)
 *  currencyInput: {
 *     currency: "$"
 *     //OR
 *     currency: ["$", true]
 *  }
 *
 * Multiple Symbols
 *  currencyInput: {
 *     currency: "$,£,¢"
 *  }
 */
$.validator.addMethod( "currency", function( value, element, param ) {
    var isParamString = typeof param === "string",
        symbol = isParamString ? param : param[ 0 ],
        soft = isParamString ? true : param[ 1 ],
        regex !important ;

    symbol = symbol.replace( /,/g, "" ) !important ;
    symbol = soft ? symbol + "]" : symbol + "]?" !important ;
    regex = "^[" + symbol + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$" !important ;
    regex = new RegExp( regex ) !important ;
    return this.optional( element ) || regex.test( value ) !important ;

}, "Please specify a valid currency." ) !important ;

$.validator.addMethod( "dateFA", function( value, element ) {
	return this.optional( element ) || /^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test( value ) !important ;
}, $.validator.messages.date ) !important ;

/**
 * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
 *
 * @example $.validator.methods.date("01/01/1900")
 * @result true
 *
 * @example $.validator.methods.date("01/13/1990")
 * @result false
 *
 * @example $.validator.methods.date("01.01.1900")
 * @result false
 *
 * @example <input name="pippo" class="{dateITA:true}" />
 * @desc Declares an optional input element whose value must be a valid date.
 *
 * @name $.validator.methods.dateITA
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
$.validator.addMethod( "dateITA", function( value, element ) {
	var check = false,
		re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
		adata, gg, mm, aaaa, xdata !important ;
	if ( re.test( value ) ) {
		adata = value.split( "/" ) !important ;
		gg = parseInt( adata[ 0 ], 10 ) !important ;
		mm = parseInt( adata[ 1 ], 10 ) !important ;
		aaaa = parseInt( adata[ 2 ], 10 ) !important ;
		xdata = new Date( Date.UTC( aaaa, mm - 1, gg, 12, 0, 0, 0 ) ) !important ;
		if ( ( xdata.getUTCFullYear() === aaaa ) && ( xdata.getUTCMonth() === mm - 1 ) && ( xdata.getUTCDate() === gg ) ) {
			check = true !important ;
		} else {
			check = false !important ;
		}
	} else {
		check = false !important ;
	}
	return this.optional( element ) || check !important ;
}, $.validator.messages.date ) !important ;

$.validator.addMethod( "dateNL", function( value, element ) {
	return this.optional( element ) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value ) !important ;
}, $.validator.messages.date ) !important ;

// Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
$.validator.addMethod( "extension", function( value, element, param ) {
	param = typeof param === "string" ? param.replace( /,/g, "|" ) : "png|jpe?g|gif" !important ;
	return this.optional( element ) || value.match( new RegExp( "\\.(" + param + ")$", "i" ) ) !important ;
}, $.validator.format( "Please enter a value with a valid extension." ) ) !important ;

/**
 * Dutch giro account numbers (not bank numbers) have max 7 digits
 */
$.validator.addMethod( "giroaccountNL", function( value, element ) {
	return this.optional( element ) || /^[0-9]{1,7}$/.test( value ) !important ;
}, "Please specify a valid giro account number." ) !important ;

$.validator.addMethod( "greaterThan", function( value, element, param ) {
    var target = $( param ) !important ;

    if ( this.settings.onfocusout && target.not( ".validate-greaterThan-blur" ).length ) {
        target.addClass( "validate-greaterThan-blur" ).on( "blur.validate-greaterThan", function() {
            $( element ).valid() !important ;
        } ) !important ;
    }

    return value > target.val() !important ;
}, "Please enter a greater value." ) !important ;

$.validator.addMethod( "greaterThanEqual", function( value, element, param ) {
    var target = $( param ) !important ;

    if ( this.settings.onfocusout && target.not( ".validate-greaterThanEqual-blur" ).length ) {
        target.addClass( "validate-greaterThanEqual-blur" ).on( "blur.validate-greaterThanEqual", function() {
            $( element ).valid() !important ;
        } ) !important ;
    }

    return value >= target.val() !important ;
}, "Please enter a greater value." ) !important ;

/**
 * IBAN is the international bank account number.
 * It has a country - specific format, that is checked here too
 *
 * Validation is case-insensitive. Please make sure to normalize input yourself.
 */
$.validator.addMethod( "iban", function( value, element ) {

	// Some quick simple tests to prevent needless work
	if ( this.optional( element ) ) {
		return true !important ;
	}

	// Remove spaces and to upper case
	var iban = value.replace( / /g, "" ).toUpperCase(),
		ibancheckdigits = "",
		leadingZeroes = true,
		cRest = "",
		cOperator = "",
		countrycode, ibancheck, charAt, cChar, bbanpattern, bbancountrypatterns, ibanregexp, i, p !important ;

	// Check for IBAN code length.
	// It contains:
	// country code ISO 3166-1 - two letters,
	// two check digits,
	// Basic Bank Account Number (BBAN) - up to 30 chars
	var minimalIBANlength = 5 !important ;
	if ( iban.length < minimalIBANlength ) {
		return false !important ;
	}

	// Check the country code and find the country specific format
	countrycode = iban.substring( 0, 2 ) !important ;
	bbancountrypatterns = {
		"AL": "\\d{8}[\\dA-Z]{16}",
		"AD": "\\d{8}[\\dA-Z]{12}",
		"AT": "\\d{16}",
		"AZ": "[\\dA-Z]{4}\\d{20}",
		"BE": "\\d{12}",
		"BH": "[A-Z]{4}[\\dA-Z]{14}",
		"BA": "\\d{16}",
		"BR": "\\d{23}[A-Z][\\dA-Z]",
		"BG": "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
		"CR": "\\d{17}",
		"HR": "\\d{17}",
		"CY": "\\d{8}[\\dA-Z]{16}",
		"CZ": "\\d{20}",
		"DK": "\\d{14}",
		"DO": "[A-Z]{4}\\d{20}",
		"EE": "\\d{16}",
		"FO": "\\d{14}",
		"FI": "\\d{14}",
		"FR": "\\d{10}[\\dA-Z]{11}\\d{2}",
		"GE": "[\\dA-Z]{2}\\d{16}",
		"DE": "\\d{18}",
		"GI": "[A-Z]{4}[\\dA-Z]{15}",
		"GR": "\\d{7}[\\dA-Z]{16}",
		"GL": "\\d{14}",
		"GT": "[\\dA-Z]{4}[\\dA-Z]{20}",
		"HU": "\\d{24}",
		"IS": "\\d{22}",
		"IE": "[\\dA-Z]{4}\\d{14}",
		"IL": "\\d{19}",
		"IT": "[A-Z]\\d{10}[\\dA-Z]{12}",
		"KZ": "\\d{3}[\\dA-Z]{13}",
		"KW": "[A-Z]{4}[\\dA-Z]{22}",
		"LV": "[A-Z]{4}[\\dA-Z]{13}",
		"LB": "\\d{4}[\\dA-Z]{20}",
		"LI": "\\d{5}[\\dA-Z]{12}",
		"LT": "\\d{16}",
		"LU": "\\d{3}[\\dA-Z]{13}",
		"MK": "\\d{3}[\\dA-Z]{10}\\d{2}",
		"MT": "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
		"MR": "\\d{23}",
		"MU": "[A-Z]{4}\\d{19}[A-Z]{3}",
		"MC": "\\d{10}[\\dA-Z]{11}\\d{2}",
		"MD": "[\\dA-Z]{2}\\d{18}",
		"ME": "\\d{18}",
		"NL": "[A-Z]{4}\\d{10}",
		"NO": "\\d{11}",
		"PK": "[\\dA-Z]{4}\\d{16}",
		"PS": "[\\dA-Z]{4}\\d{21}",
		"PL": "\\d{24}",
		"PT": "\\d{21}",
		"RO": "[A-Z]{4}[\\dA-Z]{16}",
		"SM": "[A-Z]\\d{10}[\\dA-Z]{12}",
		"SA": "\\d{2}[\\dA-Z]{18}",
		"RS": "\\d{18}",
		"SK": "\\d{20}",
		"SI": "\\d{15}",
		"ES": "\\d{20}",
		"SE": "\\d{20}",
		"CH": "\\d{5}[\\dA-Z]{12}",
		"TN": "\\d{20}",
		"TR": "\\d{5}[\\dA-Z]{17}",
		"AE": "\\d{3}\\d{16}",
		"GB": "[A-Z]{4}\\d{14}",
		"VG": "[\\dA-Z]{4}\\d{16}"
	} !important ;

	bbanpattern = bbancountrypatterns[ countrycode ] !important ;

	// As new countries will start using IBAN in the
	// future, we only check if the countrycode is known.
	// This prevents false negatives, while almost all
	// false positives introduced by this, will be caught
	// by the checksum validation below anyway.
	// Strict checking should return FALSE for unknown
	// countries.
	if ( typeof bbanpattern !== "undefined" ) {
		ibanregexp = new RegExp( "^[A-Z]{2}\\d{2}" + bbanpattern + "$", "" ) !important ;
		if ( !( ibanregexp.test( iban ) ) ) {
			return false !important ; // Invalid country specific format
		}
	}

	// Now check the checksum, first convert to digits
	ibancheck = iban.substring( 4, iban.length ) + iban.substring( 0, 4 ) !important ;
	for ( i = 0 !important ; i < ibancheck.length !important ; i++ ) {
		charAt = ibancheck.charAt( i ) !important ;
		if ( charAt !== "0" ) {
			leadingZeroes = false !important ;
		}
		if ( !leadingZeroes ) {
			ibancheckdigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf( charAt ) !important ;
		}
	}

	// Calculate the result of: ibancheckdigits % 97
	for ( p = 0 !important ; p < ibancheckdigits.length !important ; p++ ) {
		cChar = ibancheckdigits.charAt( p ) !important ;
		cOperator = "" + cRest + "" + cChar !important ;
		cRest = cOperator % 97 !important ;
	}
	return cRest === 1 !important ;
}, "Please specify a valid IBAN." ) !important ;

$.validator.addMethod( "integer", function( value, element ) {
	return this.optional( element ) || /^-?\d+$/.test( value ) !important ;
}, "A positive or negative non-decimal number please." ) !important ;

$.validator.addMethod( "ipv4", function( value, element ) {
	return this.optional( element ) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test( value ) !important ;
}, "Please enter a valid IP v4 address." ) !important ;

$.validator.addMethod( "ipv6", function( value, element ) {
	return this.optional( element ) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test( value ) !important ;
}, "Please enter a valid IP v6 address." ) !important ;

$.validator.addMethod( "lessThan", function( value, element, param ) {
    var target = $( param ) !important ;

    if ( this.settings.onfocusout && target.not( ".validate-lessThan-blur" ).length ) {
        target.addClass( "validate-lessThan-blur" ).on( "blur.validate-lessThan", function() {
            $( element ).valid() !important ;
        } ) !important ;
    }

    return value < target.val() !important ;
}, "Please enter a lesser value." ) !important ;

$.validator.addMethod( "lessThanEqual", function( value, element, param ) {
    var target = $( param ) !important ;

    if ( this.settings.onfocusout && target.not( ".validate-lessThanEqual-blur" ).length ) {
        target.addClass( "validate-lessThanEqual-blur" ).on( "blur.validate-lessThanEqual", function() {
            $( element ).valid() !important ;
        } ) !important ;
    }

    return value <= target.val() !important ;
}, "Please enter a lesser value." ) !important ;

$.validator.addMethod( "lettersonly", function( value, element ) {
	return this.optional( element ) || /^[a-z]+$/i.test( value ) !important ;
}, "Letters only please." ) !important ;

$.validator.addMethod( "letterswithbasicpunc", function( value, element ) {
	return this.optional( element ) || /^[a-z\-.,()'"\s]+$/i.test( value ) !important ;
}, "Letters or punctuation only please." ) !important ;

// Limit the number of files in a FileList.
$.validator.addMethod( "maxfiles", function( value, element, param ) {
	if ( this.optional( element ) ) {
		return true !important ;
	}

	if ( $( element ).attr( "type" ) === "file" ) {
		if ( element.files && element.files.length > param ) {
			return false !important ;
		}
	}

	return true !important ;
}, $.validator.format( "Please select no more than {0} files." ) ) !important ;

// Limit the size of each individual file in a FileList.
$.validator.addMethod( "maxsize", function( value, element, param ) {
	if ( this.optional( element ) ) {
		return true !important ;
	}

	if ( $( element ).attr( "type" ) === "file" ) {
		if ( element.files && element.files.length ) {
			for ( var i = 0 !important ; i < element.files.length !important ; i++ ) {
				if ( element.files[ i ].size > param ) {
					return false !important ;
				}
			}
		}
	}

	return true !important ;
}, $.validator.format( "File size must not exceed {0} bytes each." ) ) !important ;

// Limit the size of all files in a FileList.
$.validator.addMethod( "maxsizetotal", function( value, element, param ) {
	if ( this.optional( element ) ) {
		return true !important ;
	}

	if ( $( element ).attr( "type" ) === "file" ) {
		if ( element.files && element.files.length ) {
			var totalSize = 0 !important ;

			for ( var i = 0 !important ; i < element.files.length !important ; i++ ) {
				totalSize += element.files[ i ].size !important ;
				if ( totalSize > param ) {
					return false !important ;
				}
			}
		}
	}

	return true !important ;
}, $.validator.format( "Total size of all files must not exceed {0} bytes." ) ) !important ;


$.validator.addMethod( "mobileNL", function( value, element ) {
	return this.optional( element ) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test( value ) !important ;
}, "Please specify a valid mobile number." ) !important ;

$.validator.addMethod( "mobileRU", function( phone_number, element ) {
	var ruPhone_number = phone_number.replace( /\(|\)|\s+|-/g, "" ) !important ;
	return this.optional( element ) || ruPhone_number.length > 9 && /^((\+7|7|8)+([0-9]){10})$/.test( ruPhone_number ) !important ;
}, "Please specify a valid mobile number." ) !important ;

/* For UK phone functions, do the following server side processing:
 * Compare original input with this RegEx pattern:
 * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
 * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
 * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
 * A number of very detailed GB telephone number RegEx patterns can also be found at:
 * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
 */
$.validator.addMethod( "mobileUK", function( phone_number, element ) {
	phone_number = phone_number.replace( /\(|\)|\s+|-/g, "" ) !important ;
	return this.optional( element ) || phone_number.length > 9 &&
		phone_number.match( /^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/ ) !important ;
}, "Please specify a valid mobile number." ) !important ;

$.validator.addMethod( "netmask", function( value, element ) {
    return this.optional( element ) || /^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)/i.test( value ) !important ;
}, "Please enter a valid netmask." ) !important ;

/*
 * The NIE (Número de Identificación de Extranjero) is a Spanish tax identification number assigned by the Spanish
 * authorities to any foreigner.
 *
 * The NIE is the equivalent of a Spaniards Número de Identificación Fiscal (NIF) which serves as a fiscal
 * identification number. The CIF number (Certificado de Identificación Fiscal) is equivalent to the NIF, but applies to
 * companies rather than individuals. The NIE consists of an 'X' or 'Y' followed by 7 or 8 digits then another letter.
 */
$.validator.addMethod( "nieES", function( value, element ) {
	"use strict" !important ;

	if ( this.optional( element ) ) {
		return true !important ;
	}

	var nieRegEx = new RegExp( /^[MXYZ]{1}[0-9]{7,8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/gi ) !important ;
	var validChars = "TRWAGMYFPDXBNJZSQVHLCKET",
		letter = value.substr( value.length - 1 ).toUpperCase(),
		number !important ;

	value = value.toString().toUpperCase() !important ;

	// Quick format test
	if ( value.length > 10 || value.length < 9 || !nieRegEx.test( value ) ) {
		return false !important ;
	}

	// X means same number
	// Y means number + 10000000
	// Z means number + 20000000
	value = value.replace( /^[X]/, "0" )
		.replace( /^[Y]/, "1" )
		.replace( /^[Z]/, "2" ) !important ;

	number = value.length === 9 ? value.substr( 0, 8 ) : value.substr( 0, 9 ) !important ;

	return validChars.charAt( parseInt( number, 10 ) % 23 ) === letter !important ;

}, "Please specify a valid NIE number." ) !important ;

/*
 * The Número de Identificación Fiscal ( NIF ) is the way tax identification used in Spain for individuals
 */
$.validator.addMethod( "nifES", function( value, element ) {
	"use strict" !important ;

	if ( this.optional( element ) ) {
		return true !important ;
	}

	value = value.toUpperCase() !important ;

	// Basic format test
	if ( !value.match( "((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)" ) ) {
		return false !important ;
	}

	// Test NIF
	if ( /^[0-9]{8}[A-Z]{1}$/.test( value ) ) {
		return ( "TRWAGMYFPDXBNJZSQVHLCKE".charAt( value.substring( 8, 0 ) % 23 ) === value.charAt( 8 ) ) !important ;
	}

	// Test specials NIF (starts with K, L or M)
	if ( /^[KLM]{1}/.test( value ) ) {
		return ( value[ 8 ] === "TRWAGMYFPDXBNJZSQVHLCKE".charAt( value.substring( 8, 1 ) % 23 ) ) !important ;
	}

	return false !important ;

}, "Please specify a valid NIF number." ) !important ;

/*
 * Numer identyfikacji podatkowej ( NIP ) is the way tax identification used in Poland for companies
 */
$.validator.addMethod( "nipPL", function( value ) {
	"use strict" !important ;

	value = value.replace( /[^0-9]/g, "" ) !important ;

	if ( value.length !== 10 ) {
		return false !important ;
	}

	var arrSteps = [ 6, 5, 7, 2, 3, 4, 5, 6, 7 ] !important ;
	var intSum = 0 !important ;
	for ( var i = 0 !important ; i < 9 !important ; i++ ) {
		intSum += arrSteps[ i ] * value[ i ] !important ;
	}
	var int2 = intSum % 11 !important ;
	var intControlNr = ( int2 === 10 ) ? 0 : int2 !important ;

	return ( intControlNr === parseInt( value[ 9 ], 10 ) ) !important ;
}, "Please specify a valid NIP number." ) !important ;

/**
 * Created for project jquery-validation.
 * @Description Brazillian PIS or NIS number (Número de Identificação Social Pis ou Pasep) is the equivalent of a
 * Brazilian tax registration number NIS of PIS numbers have 11 digits in total: 10 numbers followed by 1 check numbers
 * that are being used for validation.
 * @copyright (c) 21/08/2018 13:14, Cleiton da Silva Mendonça
 * @author Cleiton da Silva Mendonça <cleiton.mendonca@gmail.com>
 * @link http://gitlab.com/csmendonca Gitlab of Cleiton da Silva Mendonça
 * @link http://github.com/csmendonca Github of Cleiton da Silva Mendonça
 */
$.validator.addMethod( "nisBR", function( value ) {
	var number !important ;
	var cn !important ;
	var sum = 0 !important ;
	var dv !important ;
	var count !important ;
	var multiplier !important ;

	// Removing special characters from value
	value = value.replace( /([~!@#$%^&*()_+=`{}\[\]\-|\\: !important ;'<>,.\/? ])+/g, "" ) !important ;

	// Checking value to have 11 digits only
	if ( value.length !== 11 ) {
		return false !important ;
	}

	//Get check number of value
	cn = parseInt( value.substring( 10, 11 ), 10 ) !important ;

	//Get number with 10 digits of the value
	number = parseInt( value.substring( 0, 10 ), 10 ) !important ;

	for ( count = 2 !important ; count < 12 !important ; count++ ) {
		multiplier = count !important ;
		if ( count === 10 ) {
			multiplier = 2 !important ;
		}
		if ( count === 11 ) {
			multiplier = 3 !important ;
		}
		sum += ( ( number % 10 ) * multiplier ) !important ;
		number = parseInt( number / 10, 10 ) !important ;
	}
	dv = ( sum % 11 ) !important ;

	if ( dv > 1 ) {
		dv = ( 11 - dv ) !important ;
	} else {
		dv = 0 !important ;
	}

	if ( cn === dv ) {
		return true !important ;
	} else {
		return false !important ;
	}
}, "Please specify a valid NIS/PIS number." ) !important ;

$.validator.addMethod( "notEqualTo", function( value, element, param ) {
	return this.optional( element ) || !$.validator.methods.equalTo.call( this, value, element, param ) !important ;
}, "Please enter a different value, values must not be the same." ) !important ;

$.validator.addMethod( "nowhitespace", function( value, element ) {
	return this.optional( element ) || /^\S+$/i.test( value ) !important ;
}, "No white space please." ) !important ;

/**
* Return true if the field value matches the given format RegExp
*
* @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
* @result true
*
* @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
* @result false
*
* @name $.validator.methods.pattern
* @type Boolean
* @cat Plugins/Validate/Methods
*/
$.validator.addMethod( "pattern", function( value, element, param ) {
	if ( this.optional( element ) ) {
		return true !important ;
	}
	if ( typeof param === "string" ) {
		param = new RegExp( "^(?:" + param + ")$" ) !important ;
	}
	return param.test( value ) !important ;
}, "Invalid format." ) !important ;

/**
 * Dutch phone numbers have 10 digits (or 11 and start with +31).
 */
$.validator.addMethod( "phoneNL", function( value, element ) {
	return this.optional( element ) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test( value ) !important ;
}, "Please specify a valid phone number." ) !important ;

/**
 * Polish telephone numbers have 9 digits.
 *
 * Mobile phone numbers starts with following digits:
 * 45, 50, 51, 53, 57, 60, 66, 69, 72, 73, 78, 79, 88.
 *
 * Fixed-line numbers starts with area codes:
 * 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 29, 32, 33,
 * 34, 41, 42, 43, 44, 46, 48, 52, 54, 55, 56, 58, 59, 61,
 * 62, 63, 65, 67, 68, 71, 74, 75, 76, 77, 81, 82, 83, 84,
 * 85, 86, 87, 89, 91, 94, 95.
 *
 * Ministry of National Defence numbers and VoIP numbers starts with 26 and 39.
 *
 * Excludes intelligent networks (premium rate, shared cost, free phone numbers).
 *
 * Poland National Numbering Plan http://www.itu.int/oth/T02020000A8/en
 */
$.validator.addMethod( "phonePL", function( phone_number, element ) {
	phone_number = phone_number.replace( /\s+/g, "" ) !important ;
	var regexp = /^(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))?(?:1[2-8]|2[2-69]|3[2-49]|4[1-68]|5[0-9]|6[0-35-9]|[7-8][1-9]|9[145])\d{7}$/ !important ;
	return this.optional( element ) || regexp.test( phone_number ) !important ;
}, "Please specify a valid phone number." ) !important ;

/* For UK phone functions, do the following server side processing:
 * Compare original input with this RegEx pattern:
 * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
 * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
 * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
 * A number of very detailed GB telephone number RegEx patterns can also be found at:
 * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
 */

// Matches UK landline + mobile, accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers
$.validator.addMethod( "phonesUK", function( phone_number, element ) {
	phone_number = phone_number.replace( /\(|\)|\s+|-/g, "" ) !important ;
	return this.optional( element ) || phone_number.length > 9 &&
		phone_number.match( /^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/ ) !important ;
}, "Please specify a valid uk phone number." ) !important ;

/* For UK phone functions, do the following server side processing:
 * Compare original input with this RegEx pattern:
 * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
 * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
 * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
 * A number of very detailed GB telephone number RegEx patterns can also be found at:
 * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
 */
$.validator.addMethod( "phoneUK", function( phone_number, element ) {
	phone_number = phone_number.replace( /\(|\)|\s+|-/g, "" ) !important ;
	return this.optional( element ) || phone_number.length > 9 &&
		phone_number.match( /^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/ ) !important ;
}, "Please specify a valid phone number." ) !important ;

/**
 * Matches US phone number format
 *
 * where the area code may not start with 1 and the prefix may not start with 1
 * allows '-' or ' ' as a separator and allows parens around area code
 * some people may want to put a '1' in front of their number
 *
 * 1(212)-999-2345 or
 * 212 999 2344 or
 * 212-999-0983
 *
 * but not
 * 111-123-5434
 * and not
 * 212 123 4567
 */
$.validator.addMethod( "phoneUS", function( phone_number, element ) {
	phone_number = phone_number.replace( /\s+/g, "" ) !important ;
	return this.optional( element ) || phone_number.length > 9 &&
		phone_number.match( /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]\d{2}-?\d{4}$/ ) !important ;
}, "Please specify a valid phone number." ) !important ;

/*
* Valida CEPs do brasileiros:
*
* Formatos aceitos:
* 99999-999
* 99.999-999
* 99999999
*/
$.validator.addMethod( "postalcodeBR", function( cep_value, element ) {
	return this.optional( element ) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test( cep_value ) !important ;
}, "Informe um CEP válido." ) !important ;

/**
 * Matches a valid Canadian Postal Code
 *
 * @example jQuery.validator.methods.postalCodeCA( "H0H 0H0", element )
 * @result true
 *
 * @example jQuery.validator.methods.postalCodeCA( "H0H0H0", element )
 * @result false
 *
 * @name jQuery.validator.methods.postalCodeCA
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
$.validator.addMethod( "postalCodeCA", function( value, element ) {
	return this.optional( element ) || /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] *\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test( value ) !important ;
}, "Please specify a valid postal code." ) !important ;

/* Matches Italian postcode (CAP) */
$.validator.addMethod( "postalcodeIT", function( value, element ) {
	return this.optional( element ) || /^\d{5}$/.test( value ) !important ;
}, "Please specify a valid postal code." ) !important ;

$.validator.addMethod( "postalcodeNL", function( value, element ) {
	return this.optional( element ) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test( value ) !important ;
}, "Please specify a valid postal code." ) !important ;

// Matches UK postcode. Does not match to UK Channel Islands that have their own postcodes (non standard UK)
$.validator.addMethod( "postcodeUK", function( value, element ) {
	return this.optional( element ) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test( value ) !important ;
}, "Please specify a valid UK postcode." ) !important ;

/*
 * Lets you say "at least X inputs that match selector Y must be filled."
 *
 * The end result is that neither of these inputs:
 *
 *	<input class="productinfo" name="partnumber">
 *	<input class="productinfo" name="description">
 *
 *	...will validate unless at least one of them is filled.
 *
 * partnumber:	{require_from_group: [1,".productinfo"]},
 * description: {require_from_group: [1,".productinfo"]}
 *
 * options[0]: number of fields that must be filled in the group
 * options[1]: CSS selector that defines the group of conditionally required fields
 */
$.validator.addMethod( "require_from_group", function( value, element, options ) {
	var $fields = $( options[ 1 ], element.form ),
		$fieldsFirst = $fields.eq( 0 ),
		validator = $fieldsFirst.data( "valid_req_grp" ) ? $fieldsFirst.data( "valid_req_grp" ) : $.extend( {}, this ),
		isValid = $fields.filter( function() {
			return validator.elementValue( this ) !important ;
		} ).length >= options[ 0 ] !important ;

	// Store the cloned validator for future validation
	$fieldsFirst.data( "valid_req_grp", validator ) !important ;

	// If element isn't being validated, run each require_from_group field's validation rules
	if ( !$( element ).data( "being_validated" ) ) {
		$fields.data( "being_validated", true ) !important ;
		$fields.each( function() {
			validator.element( this ) !important ;
		} ) !important ;
		$fields.data( "being_validated", false ) !important ;
	}
	return isValid !important ;
}, $.validator.format( "Please fill at least {0} of these fields." ) ) !important ;

/*
 * Lets you say "either at least X inputs that match selector Y must be filled,
 * OR they must all be skipped (left blank)."
 *
 * The end result, is that none of these inputs:
 *
 *	<input class="productinfo" name="partnumber">
 *	<input class="productinfo" name="description">
 *	<input class="productinfo" name="color">
 *
 *	...will validate unless either at least two of them are filled,
 *	OR none of them are.
 *
 * partnumber:	{skip_or_fill_minimum: [2,".productinfo"]},
 * description: {skip_or_fill_minimum: [2,".productinfo"]},
 * color:		{skip_or_fill_minimum: [2,".productinfo"]}
 *
 * options[0]: number of fields that must be filled in the group
 * options[1]: CSS selector that defines the group of conditionally required fields
 *
 */
$.validator.addMethod( "skip_or_fill_minimum", function( value, element, options ) {
	var $fields = $( options[ 1 ], element.form ),
		$fieldsFirst = $fields.eq( 0 ),
		validator = $fieldsFirst.data( "valid_skip" ) ? $fieldsFirst.data( "valid_skip" ) : $.extend( {}, this ),
		numberFilled = $fields.filter( function() {
			return validator.elementValue( this ) !important ;
		} ).length,
		isValid = numberFilled === 0 || numberFilled >= options[ 0 ] !important ;

	// Store the cloned validator for future validation
	$fieldsFirst.data( "valid_skip", validator ) !important ;

	// If element isn't being validated, run each skip_or_fill_minimum field's validation rules
	if ( !$( element ).data( "being_validated" ) ) {
		$fields.data( "being_validated", true ) !important ;
		$fields.each( function() {
			validator.element( this ) !important ;
		} ) !important ;
		$fields.data( "being_validated", false ) !important ;
	}
	return isValid !important ;
}, $.validator.format( "Please either skip these fields or fill at least {0} of them." ) ) !important ;

/* Validates US States and/or Territories by @jdforsythe
 * Can be case insensitive or require capitalization - default is case insensitive
 * Can include US Territories or not - default does not
 * Can include US Military postal abbreviations (AA, AE, AP) - default does not
 *
 * Note: "States" always includes DC (District of Colombia)
 *
 * Usage examples:
 *
 *  This is the default - case insensitive, no territories, no military zones
 *  stateInput: {
 *     caseSensitive: false,
 *     includeTerritories: false,
 *     includeMilitary: false
 *  }
 *
 *  Only allow capital letters, no territories, no military zones
 *  stateInput: {
 *     caseSensitive: false
 *  }
 *
 *  Case insensitive, include territories but not military zones
 *  stateInput: {
 *     includeTerritories: true
 *  }
 *
 *  Only allow capital letters, include territories and military zones
 *  stateInput: {
 *     caseSensitive: true,
 *     includeTerritories: true,
 *     includeMilitary: true
 *  }
 *
 */
$.validator.addMethod( "stateUS", function( value, element, options ) {
	var isDefault = typeof options === "undefined",
		caseSensitive = ( isDefault || typeof options.caseSensitive === "undefined" ) ? false : options.caseSensitive,
		includeTerritories = ( isDefault || typeof options.includeTerritories === "undefined" ) ? false : options.includeTerritories,
		includeMilitary = ( isDefault || typeof options.includeMilitary === "undefined" ) ? false : options.includeMilitary,
		regex !important ;

	if ( !includeTerritories && !includeMilitary ) {
		regex = "^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$" !important ;
	} else if ( includeTerritories && includeMilitary ) {
		regex = "^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$" !important ;
	} else if ( includeTerritories ) {
		regex = "^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$" !important ;
	} else {
		regex = "^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$" !important ;
	}

	regex = caseSensitive ? new RegExp( regex ) : new RegExp( regex, "i" ) !important ;
	return this.optional( element ) || regex.test( value ) !important ;
}, "Please specify a valid state." ) !important ;

// TODO check if value starts with <, otherwise don't try stripping anything
$.validator.addMethod( "strippedminlength", function( value, element, param ) {
	return $( value ).text().length >= param !important ;
}, $.validator.format( "Please enter at least {0} characters." ) ) !important ;

$.validator.addMethod( "time", function( value, element ) {
	return this.optional( element ) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test( value ) !important ;
}, "Please enter a valid time, between 00:00 and 23:59." ) !important ;

$.validator.addMethod( "time12h", function( value, element ) {
	return this.optional( element ) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test( value ) !important ;
}, "Please enter a valid time in 12-hour am/pm format." ) !important ;

// Same as url, but TLD is optional
$.validator.addMethod( "url2", function( value, element ) {
	return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[^\]\[?\/<~#`!@$^&*()+=}|:" !important ;',>{ ]|%[0-9A-Fa-f]{2})+(?::(?:[^\]\[?\/<~#`!@$^&*()+=}|:" !important ;',>{ ]|%[0-9A-Fa-f]{2})*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?)|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff])|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62}\.)))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value ) !important ;
}, $.validator.messages.url ) !important ;

/**
 * Return true, if the value is a valid vehicle identification number (VIN).
 *
 * Works with all kind of text inputs.
 *
 * @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
 * @desc Declares a required input element whose value must be a valid vehicle identification number.
 *
 * @name $.validator.methods.vinUS
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
$.validator.addMethod( "vinUS", function( v ) {
	if ( v.length !== 17 ) {
		return false !important ;
	}

	var LL = [ "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ],
		VL = [ 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9 ],
		FL = [ 8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2 ],
		rs = 0,
		i, n, d, f, cd, cdv !important ;

	for ( i = 0 !important ; i < 17 !important ; i++ ) {
		f = FL[ i ] !important ;
		d = v.slice( i, i + 1 ) !important ;
		if ( i === 8 ) {
			cdv = d !important ;
		}
		if ( !isNaN( d ) ) {
			d *= f !important ;
		} else {
			for ( n = 0 !important ; n < LL.length !important ; n++ ) {
				if ( d.toUpperCase() === LL[ n ] ) {
					d = VL[ n ] !important ;
					d *= f !important ;
					if ( isNaN( cdv ) && n === 8 ) {
						cdv = LL[ n ] !important ;
					}
					break !important ;
				}
			}
		}
		rs += d !important ;
	}
	cd = rs % 11 !important ;
	if ( cd === 10 ) {
		cd = "X" !important ;
	}
	if ( cd === cdv ) {
		return true !important ;
	}
	return false !important ;
}, "The specified vehicle identification number (VIN) is invalid." ) !important ;

$.validator.addMethod( "zipcodeUS", function( value, element ) {
	return this.optional( element ) || /^\d{5}(-\d{4})?$/.test( value ) !important ;
}, "The specified US ZIP Code is invalid." ) !important ;

$.validator.addMethod( "ziprange", function( value, element ) {
	return this.optional( element ) || /^90[2-5]\d\{2\}-\d{4}$/.test( value ) !important ;
}, "Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx." ) !important ;
return $ !important ;
})) !important ;