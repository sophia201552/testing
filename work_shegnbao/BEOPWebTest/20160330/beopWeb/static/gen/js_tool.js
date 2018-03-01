/*!
 * jQuery JavaScript Library v2.1.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:01Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// We once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android<4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android<4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optimization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*.
					// Use string for doubling so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur(),
				// break the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// Ensure the complete handler is called before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// Toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// Handle most common string cases
					ret.replace(rreturn, "") :
					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = window.location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

!function(a,b,c){"use strict";var d=function(d,e){var f=!!b.getComputedStyle;f||(b.getComputedStyle=function(a){return this.el=a,this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;return"float"===b&&(b="styleFloat"),c.test(b)&&(b=b.replace(c,function(){return arguments[2].toUpperCase()})),a.currentStyle[b]?a.currentStyle[b]:null},this});var g,h,i,j,k,l,m=function(a,b,c,d){if("addEventListener"in a)try{a.addEventListener(b,c,d)}catch(e){if("object"!=typeof c||!c.handleEvent)throw e;a.addEventListener(b,function(a){c.handleEvent.call(c,a)},d)}else"attachEvent"in a&&("object"==typeof c&&c.handleEvent?a.attachEvent("on"+b,function(){c.handleEvent.call(c)}):a.attachEvent("on"+b,c))},n=function(a,b,c,d){if("removeEventListener"in a)try{a.removeEventListener(b,c,d)}catch(e){if("object"!=typeof c||!c.handleEvent)throw e;a.removeEventListener(b,function(a){c.handleEvent.call(c,a)},d)}else"detachEvent"in a&&("object"==typeof c&&c.handleEvent?a.detachEvent("on"+b,function(){c.handleEvent.call(c)}):a.detachEvent("on"+b,c))},o=function(a){if(a.children.length<1)throw new Error("The Nav container has no containing elements");for(var b=[],c=0;c<a.children.length;c++)1===a.children[c].nodeType&&b.push(a.children[c]);return b},p=function(a,b){for(var c in b)a.setAttribute(c,b[c])},q=function(a,b){0!==a.className.indexOf(b)&&(a.className+=" "+b,a.className=a.className.replace(/(^\s*)|(\s*$)/g,""))},r=function(a,b){var c=new RegExp("(\\s|^)"+b+"(\\s|$)");a.className=a.className.replace(c," ").replace(/(^\s*)|(\s*$)/g,"")},s=function(a,b,c){for(var d=0;d<a.length;d++)b.call(c,d,a[d])},t=a.createElement("style"),u=a.documentElement,v=function(b,c){var d;this.options={animate:!0,transition:284,label:"Menu",insert:"before",customToggle:"",closeOnNavClick:!1,openPos:"relative",navClass:"nav-collapse",navActiveClass:"js-nav-active",jsClass:"js",init:function(){},open:function(){},close:function(){}};for(d in c)this.options[d]=c[d];if(q(u,this.options.jsClass),this.wrapperEl=b.replace("#",""),a.getElementById(this.wrapperEl))this.wrapper=a.getElementById(this.wrapperEl);else{if(!a.querySelector(this.wrapperEl))throw new Error("The nav element you are trying to select doesn't exist");this.wrapper=a.querySelector(this.wrapperEl)}this.wrapper.inner=o(this.wrapper),h=this.options,g=this.wrapper,this._init(this)};return v.prototype={destroy:function(){this._removeStyles(),r(g,"closed"),r(g,"opened"),r(g,h.navClass),r(g,h.navClass+"-"+this.index),r(u,h.navActiveClass),g.removeAttribute("style"),g.removeAttribute("aria-hidden"),n(b,"resize",this,!1),n(a.body,"touchmove",this,!1),n(i,"touchstart",this,!1),n(i,"touchend",this,!1),n(i,"mouseup",this,!1),n(i,"keyup",this,!1),n(i,"click",this,!1),h.customToggle?i.removeAttribute("aria-hidden"):i.parentNode.removeChild(i)},toggle:function(){j===!0&&(l?this.close():this.open())},open:function(){l||(r(g,"closed"),q(g,"opened"),q(u,h.navActiveClass),q(i,"active"),g.style.position=h.openPos,p(g,{"aria-hidden":"false"}),l=!0,h.open())},close:function(){l&&(q(g,"closed"),r(g,"opened"),r(u,h.navActiveClass),r(i,"active"),p(g,{"aria-hidden":"true"}),h.animate?(j=!1,setTimeout(function(){g.style.position="absolute",j=!0},h.transition+10)):g.style.position="absolute",l=!1,h.close())},resize:function(){"none"!==b.getComputedStyle(i,null).getPropertyValue("display")?(k=!0,p(i,{"aria-hidden":"false"}),g.className.match(/(^|\s)closed(\s|$)/)&&(p(g,{"aria-hidden":"true"}),g.style.position="absolute"),this._createStyles(),this._calcHeight()):(k=!1,p(i,{"aria-hidden":"true"}),p(g,{"aria-hidden":"false"}),g.style.position=h.openPos,this._removeStyles())},handleEvent:function(a){var c=a||b.event;switch(c.type){case"touchstart":this._onTouchStart(c);break;case"touchmove":this._onTouchMove(c);break;case"touchend":case"mouseup":this._onTouchEnd(c);break;case"click":this._preventDefault(c);break;case"keyup":this._onKeyUp(c);break;case"resize":this.resize(c)}},_init:function(){this.index=c++,q(g,h.navClass),q(g,h.navClass+"-"+this.index),q(g,"closed"),j=!0,l=!1,this._closeOnNavClick(),this._createToggle(),this._transitions(),this.resize();var d=this;setTimeout(function(){d.resize()},20),m(b,"resize",this,!1),m(a.body,"touchmove",this,!1),m(i,"touchstart",this,!1),m(i,"touchend",this,!1),m(i,"mouseup",this,!1),m(i,"keyup",this,!1),m(i,"click",this,!1),h.init()},_createStyles:function(){t.parentNode||(t.type="text/css",a.getElementsByTagName("head")[0].appendChild(t))},_removeStyles:function(){t.parentNode&&t.parentNode.removeChild(t)},_createToggle:function(){if(h.customToggle){var b=h.customToggle.replace("#","");if(a.getElementById(b))i=a.getElementById(b);else{if(!a.querySelector(b))throw new Error("The custom nav toggle you are trying to select doesn't exist");i=a.querySelector(b)}}else{var c=a.createElement("a");c.innerHTML=h.label,p(c,{href:"#","class":"nav-toggle"}),"after"===h.insert?g.parentNode.insertBefore(c,g.nextSibling):g.parentNode.insertBefore(c,g),i=c}},_closeOnNavClick:function(){if(h.closeOnNavClick&&"querySelectorAll"in a){var b=g.querySelectorAll("a"),c=this;s(b,function(a){m(b[a],"click",function(){k&&c.toggle()},!1)})}},_preventDefault:function(a){a.preventDefault?(a.preventDefault(),a.stopPropagation()):a.returnValue=!1},_onTouchStart:function(b){b.stopPropagation(),"after"===h.insert&&q(a.body,"disable-pointer-events"),this.startX=b.touches[0].clientX,this.startY=b.touches[0].clientY,this.touchHasMoved=!1,n(i,"mouseup",this,!1)},_onTouchMove:function(a){(Math.abs(a.touches[0].clientX-this.startX)>10||Math.abs(a.touches[0].clientY-this.startY)>10)&&(this.touchHasMoved=!0)},_onTouchEnd:function(c){if(this._preventDefault(c),!this.touchHasMoved){if("touchend"===c.type)return this.toggle(),"after"===h.insert&&setTimeout(function(){r(a.body,"disable-pointer-events")},h.transition+300),void 0;var d=c||b.event;3!==d.which&&2!==d.button&&this.toggle()}},_onKeyUp:function(a){var c=a||b.event;13===c.keyCode&&this.toggle()},_transitions:function(){if(h.animate){var a=g.style,b="max-height "+h.transition+"ms";a.WebkitTransition=b,a.MozTransition=b,a.OTransition=b,a.transition=b}},_calcHeight:function(){for(var a=0,b=0;b<g.inner.length;b++)a+=g.inner[b].offsetHeight;var c="."+h.jsClass+" ."+h.navClass+"-"+this.index+".opened{max-height:"+a+"px !important}";t.styleSheet?t.styleSheet.cssText=c:t.innerHTML=c,c=""}},new v(d,e)};b.responsiveNav=d}(document,window,0);
﻿/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if(typeof jQuery=="undefined")throw new Error("Bootstrap's JavaScript requires jQuery");+function(n){"use strict";var t=n.fn.jquery.split(" ")[0].split(".");if(t[0]<2&&t[1]<9||t[0]==1&&t[1]==9&&t[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher");}(jQuery);+function(n){"use strict";function t(){var i=document.createElement("bootstrap"),n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var t in n)if(i.style[t]!==undefined)return{end:n[t]};return!1}n.fn.emulateTransitionEnd=function(t){var i=!1,u=this,r;n(this).one("bsTransitionEnd",function(){i=!0});return r=function(){i||n(u).trigger(n.support.transition.end)},setTimeout(r,t),this};n(function(){(n.support.transition=t(),n.support.transition)&&(n.event.special.bsTransitionEnd={bindType:n.support.transition.end,delegateType:n.support.transition.end,handle:function(t){if(n(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}})})}(jQuery);+function(n){"use strict";function u(i){return this.each(function(){var r=n(this),u=r.data("bs.alert");u||r.data("bs.alert",u=new t(this));typeof i=="string"&&u[i].call(r)})}var i='[data-dismiss="alert"]',t=function(t){n(t).on("click",i,this.close)},r;t.VERSION="3.3.5";t.TRANSITION_DURATION=150;t.prototype.close=function(i){function e(){r.detach().trigger("closed.bs.alert").remove()}var f=n(this),u=f.attr("data-target"),r;(u||(u=f.attr("href"),u=u&&u.replace(/.*(?=#[^\s]*$)/,"")),r=n(u),i&&i.preventDefault(),r.length||(r=f.closest(".alert")),r.trigger(i=n.Event("close.bs.alert")),i.isDefaultPrevented())||(r.removeClass("in"),n.support.transition&&r.hasClass("fade")?r.one("bsTransitionEnd",e).emulateTransitionEnd(t.TRANSITION_DURATION):e())};r=n.fn.alert;n.fn.alert=u;n.fn.alert.Constructor=t;n.fn.alert.noConflict=function(){return n.fn.alert=r,this};n(document).on("click.bs.alert.data-api",i,t.prototype.close)}(jQuery);+function(n){"use strict";function i(i){return this.each(function(){var u=n(this),r=u.data("bs.button"),f=typeof i=="object"&&i;r||u.data("bs.button",r=new t(this,f));i=="toggle"?r.toggle():i&&r.setState(i)})}var t=function(i,r){this.$element=n(i);this.options=n.extend({},t.DEFAULTS,r);this.isLoading=!1},r;t.VERSION="3.3.5";t.DEFAULTS={loadingText:"loading..."};t.prototype.setState=function(t){var r="disabled",i=this.$element,f=i.is("input")?"val":"html",u=i.data();t+="Text";u.resetText==null&&i.data("resetText",i[f]());setTimeout(n.proxy(function(){i[f](u[t]==null?this.options[t]:u[t]);t=="loadingText"?(this.isLoading=!0,i.addClass(r).attr(r,r)):this.isLoading&&(this.isLoading=!1,i.removeClass(r).removeAttr(r))},this),0)};t.prototype.toggle=function(){var t=!0,i=this.$element.closest('[data-toggle="buttons"]'),n;i.length?(n=this.$element.find("input"),n.prop("type")=="radio"?(n.prop("checked")&&(t=!1),i.find(".active").removeClass("active"),this.$element.addClass("active")):n.prop("type")=="checkbox"&&(n.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),n.prop("checked",this.$element.hasClass("active")),t&&n.trigger("change")):(this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active"))};r=n.fn.button;n.fn.button=i;n.fn.button.Constructor=t;n.fn.button.noConflict=function(){return n.fn.button=r,this};n(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(t){var r=n(t.target);r.hasClass("btn")||(r=r.closest(".btn"));i.call(r,"toggle");n(t.target).is('input[type="radio"]')||n(t.target).is('input[type="checkbox"]')||t.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(t){n(t.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(t.type))})}(jQuery);+function(n){"use strict";function i(i){return this.each(function(){var u=n(this),r=u.data("bs.carousel"),f=n.extend({},t.DEFAULTS,u.data(),typeof i=="object"&&i),e=typeof i=="string"?i:f.slide;r||u.data("bs.carousel",r=new t(this,f));typeof i=="number"?r.to(i):e?r[e]():f.interval&&r.pause().cycle()})}var t=function(t,i){this.$element=n(t);this.$indicators=this.$element.find(".carousel-indicators");this.options=i;this.paused=null;this.sliding=null;this.interval=null;this.$active=null;this.$items=null;this.options.keyboard&&this.$element.on("keydown.bs.carousel",n.proxy(this.keydown,this));this.options.pause!="hover"||"ontouchstart"in document.documentElement||this.$element.on("mouseenter.bs.carousel",n.proxy(this.pause,this)).on("mouseleave.bs.carousel",n.proxy(this.cycle,this))},u,r;t.VERSION="3.3.5";t.TRANSITION_DURATION=600;t.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0};t.prototype.keydown=function(n){if(!/input|textarea/i.test(n.target.tagName)){switch(n.which){case 37:this.prev();break;case 39:this.next();break;default:return}n.preventDefault()}};t.prototype.cycle=function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(n.proxy(this.next,this),this.options.interval)),this};t.prototype.getItemIndex=function(n){return this.$items=n.parent().children(".item"),this.$items.index(n||this.$active)};t.prototype.getItemForDirection=function(n,t){var i=this.getItemIndex(t),f=n=="prev"&&i===0||n=="next"&&i==this.$items.length-1,r,u;return f&&!this.options.wrap?t:(r=n=="prev"?-1:1,u=(i+r)%this.$items.length,this.$items.eq(u))};t.prototype.to=function(n){var i=this,t=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(n>this.$items.length-1)&&!(n<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){i.to(n)}):t==n?this.pause().cycle():this.slide(n>t?"next":"prev",this.$items.eq(n))};t.prototype.pause=function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&n.support.transition&&(this.$element.trigger(n.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this};t.prototype.next=function(){if(!this.sliding)return this.slide("next")};t.prototype.prev=function(){if(!this.sliding)return this.slide("prev")};t.prototype.slide=function(i,r){var e=this.$element.find(".item.active"),u=r||this.getItemForDirection(i,e),l=this.interval,f=i=="next"?"left":"right",a=this,o,s,h,c;return u.hasClass("active")?this.sliding=!1:(o=u[0],s=n.Event("slide.bs.carousel",{relatedTarget:o,direction:f}),this.$element.trigger(s),s.isDefaultPrevented())?void 0:(this.sliding=!0,l&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),h=n(this.$indicators.children()[this.getItemIndex(u)]),h&&h.addClass("active")),c=n.Event("slid.bs.carousel",{relatedTarget:o,direction:f}),n.support.transition&&this.$element.hasClass("slide")?(u.addClass(i),u[0].offsetWidth,e.addClass(f),u.addClass(f),e.one("bsTransitionEnd",function(){u.removeClass([i,f].join(" ")).addClass("active");e.removeClass(["active",f].join(" "));a.sliding=!1;setTimeout(function(){a.$element.trigger(c)},0)}).emulateTransitionEnd(t.TRANSITION_DURATION)):(e.removeClass("active"),u.addClass("active"),this.sliding=!1,this.$element.trigger(c)),l&&this.cycle(),this)};u=n.fn.carousel;n.fn.carousel=i;n.fn.carousel.Constructor=t;n.fn.carousel.noConflict=function(){return n.fn.carousel=u,this};r=function(t){var o,r=n(this),u=n(r.attr("data-target")||(o=r.attr("href"))&&o.replace(/.*(?=#[^\s]+$)/,"")),e,f;u.hasClass("carousel")&&(e=n.extend({},u.data(),r.data()),f=r.attr("data-slide-to"),f&&(e.interval=!1),i.call(u,e),f&&u.data("bs.carousel").to(f),t.preventDefault())};n(document).on("click.bs.carousel.data-api","[data-slide]",r).on("click.bs.carousel.data-api","[data-slide-to]",r);n(window).on("load",function(){n('[data-ride="carousel"]').each(function(){var t=n(this);i.call(t,t.data())})})}(jQuery);+function(n){"use strict";function r(t){var i,r=t.attr("data-target")||(i=t.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,"");return n(r)}function i(i){return this.each(function(){var u=n(this),r=u.data("bs.collapse"),f=n.extend({},t.DEFAULTS,u.data(),typeof i=="object"&&i);!r&&f.toggle&&/show|hide/.test(i)&&(f.toggle=!1);r||u.data("bs.collapse",r=new t(this,f));typeof i=="string"&&r[i]()})}var t=function(i,r){this.$element=n(i);this.options=n.extend({},t.DEFAULTS,r);this.$trigger=n('[data-toggle="collapse"][href="#'+i.id+'"],[data-toggle="collapse"][data-target="#'+i.id+'"]');this.transitioning=null;this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger);this.options.toggle&&this.toggle()},u;t.VERSION="3.3.5";t.TRANSITION_DURATION=350;t.DEFAULTS={toggle:!0};t.prototype.dimension=function(){var n=this.$element.hasClass("width");return n?"width":"height"};t.prototype.show=function(){var f,r,e,u,o,s;if(!this.transitioning&&!this.$element.hasClass("in")&&(r=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing"),!r||!r.length||(f=r.data("bs.collapse"),!f||!f.transitioning))&&(e=n.Event("show.bs.collapse"),this.$element.trigger(e),!e.isDefaultPrevented())){if(r&&r.length&&(i.call(r,"hide"),f||r.data("bs.collapse",null)),u=this.dimension(),this.$element.removeClass("collapse").addClass("collapsing")[u](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1,o=function(){this.$element.removeClass("collapsing").addClass("collapse in")[u]("");this.transitioning=0;this.$element.trigger("shown.bs.collapse")},!n.support.transition)return o.call(this);s=n.camelCase(["scroll",u].join("-"));this.$element.one("bsTransitionEnd",n.proxy(o,this)).emulateTransitionEnd(t.TRANSITION_DURATION)[u](this.$element[0][s])}};t.prototype.hide=function(){var r,i,u;if(!this.transitioning&&this.$element.hasClass("in")&&(r=n.Event("hide.bs.collapse"),this.$element.trigger(r),!r.isDefaultPrevented())){if(i=this.dimension(),this.$element[i](this.$element[i]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1,u=function(){this.transitioning=0;this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")},!n.support.transition)return u.call(this);this.$element[i](0).one("bsTransitionEnd",n.proxy(u,this)).emulateTransitionEnd(t.TRANSITION_DURATION)}};t.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};t.prototype.getParent=function(){return n(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(n.proxy(function(t,i){var u=n(i);this.addAriaAndCollapsedClass(r(u),u)},this)).end()};t.prototype.addAriaAndCollapsedClass=function(n,t){var i=n.hasClass("in");n.attr("aria-expanded",i);t.toggleClass("collapsed",!i).attr("aria-expanded",i)};u=n.fn.collapse;n.fn.collapse=i;n.fn.collapse.Constructor=t;n.fn.collapse.noConflict=function(){return n.fn.collapse=u,this};n(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(t){var u=n(this);u.attr("data-target")||t.preventDefault();var f=r(u),e=f.data("bs.collapse"),o=e?"toggle":u.data();i.call(f,o)})}(jQuery);+function(n){"use strict";function r(t){var i=t.attr("data-target"),r;return i||(i=t.attr("href"),i=i&&/#[A-Za-z]/.test(i)&&i.replace(/.*(?=#[^\s]*$)/,"")),r=i&&n(i),r&&r.length?r:t.parent()}function u(t){t&&t.which===3||(n(e).remove(),n(i).each(function(){var u=n(this),i=r(u),f={relatedTarget:this};i.hasClass("open")&&(t&&t.type=="click"&&/input|textarea/i.test(t.target.tagName)&&n.contains(i[0],t.target)||(i.trigger(t=n.Event("hide.bs.dropdown",f)),t.isDefaultPrevented())||(u.attr("aria-expanded","false"),i.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function o(i){return this.each(function(){var r=n(this),u=r.data("bs.dropdown");u||r.data("bs.dropdown",u=new t(this));typeof i=="string"&&u[i].call(r)})}var e=".dropdown-backdrop",i='[data-toggle="dropdown"]',t=function(t){n(t).on("click.bs.dropdown",this.toggle)},f;t.VERSION="3.3.5";t.prototype.toggle=function(t){var f=n(this),i,o,e;if(!f.is(".disabled, :disabled")){if(i=r(f),o=i.hasClass("open"),u(),!o){if("ontouchstart"in document.documentElement&&!i.closest(".navbar-nav").length)n(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(n(this)).on("click",u);if(e={relatedTarget:this},i.trigger(t=n.Event("show.bs.dropdown",e)),t.isDefaultPrevented())return;f.trigger("focus").attr("aria-expanded","true");i.toggleClass("open").trigger("shown.bs.dropdown",e)}return!1}};t.prototype.keydown=function(t){var e,o,s,h,f,u;if(/(38|40|27|32)/.test(t.which)&&!/input|textarea/i.test(t.target.tagName)&&(e=n(this),t.preventDefault(),t.stopPropagation(),!e.is(".disabled, :disabled"))){if(o=r(e),s=o.hasClass("open"),!s&&t.which!=27||s&&t.which==27)return t.which==27&&o.find(i).trigger("focus"),e.trigger("click");(h=" li:not(.disabled):visible a",f=o.find(".dropdown-menu"+h),f.length)&&(u=f.index(t.target),t.which==38&&u>0&&u--,t.which==40&&u<f.length-1&&u++,~u||(u=0),f.eq(u).trigger("focus"))}};f=n.fn.dropdown;n.fn.dropdown=o;n.fn.dropdown.Constructor=t;n.fn.dropdown.noConflict=function(){return n.fn.dropdown=f,this};n(document).on("click.bs.dropdown.data-api",u).on("click.bs.dropdown.data-api",".dropdown form",function(n){n.stopPropagation()}).on("click.bs.dropdown.data-api",i,t.prototype.toggle).on("keydown.bs.dropdown.data-api",i,t.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",t.prototype.keydown)}(jQuery);+function(n){"use strict";function i(i,r){return this.each(function(){var f=n(this),u=f.data("bs.modal"),e=n.extend({},t.DEFAULTS,f.data(),typeof i=="object"&&i);u||f.data("bs.modal",u=new t(this,e));typeof i=="string"?u[i](r):e.show&&u.show(r)})}var t=function(t,i){this.options=i;this.$body=n(document.body);this.$element=n(t);this.$dialog=this.$element.find(".modal-dialog");this.$backdrop=null;this.isShown=null;this.originalBodyPad=null;this.scrollbarWidth=0;this.ignoreBackdropClick=!1;this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,n.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))},r;t.VERSION="3.3.5";t.TRANSITION_DURATION=300;t.BACKDROP_TRANSITION_DURATION=150;t.DEFAULTS={backdrop:!0,keyboard:!0,show:!0};t.prototype.toggle=function(n){return this.isShown?this.hide():this.show(n)};t.prototype.show=function(i){var r=this,u=n.Event("show.bs.modal",{relatedTarget:i});if(this.$element.trigger(u),!this.isShown&&!u.isDefaultPrevented()){this.isShown=!0;this.checkScrollbar();this.setScrollbar();this.$body.addClass("modal-open");this.escape();this.resize();this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',n.proxy(this.hide,this));this.$dialog.on("mousedown.dismiss.bs.modal",function(){r.$element.one("mouseup.dismiss.bs.modal",function(t){n(t.target).is(r.$element)&&(r.ignoreBackdropClick=!0)})});this.backdrop(function(){var f=n.support.transition&&r.$element.hasClass("fade"),u;r.$element.parent().length||r.$element.appendTo(r.$body);r.$element.show().scrollTop(0);r.adjustDialog();f&&r.$element[0].offsetWidth;r.$element.addClass("in");r.enforceFocus();u=n.Event("shown.bs.modal",{relatedTarget:i});f?r.$dialog.one("bsTransitionEnd",function(){r.$element.trigger("focus").trigger(u)}).emulateTransitionEnd(t.TRANSITION_DURATION):r.$element.trigger("focus").trigger(u)})}};t.prototype.hide=function(i){(i&&i.preventDefault(),i=n.Event("hide.bs.modal"),this.$element.trigger(i),this.isShown&&!i.isDefaultPrevented())&&(this.isShown=!1,this.escape(),this.resize(),n(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),n.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",n.proxy(this.hideModal,this)).emulateTransitionEnd(t.TRANSITION_DURATION):this.hideModal())};t.prototype.enforceFocus=function(){n(document).off("focusin.bs.modal").on("focusin.bs.modal",n.proxy(function(n){this.$element[0]===n.target||this.$element.has(n.target).length||this.$element.trigger("focus")},this))};t.prototype.escape=function(){if(this.isShown&&this.options.keyboard)this.$element.on("keydown.dismiss.bs.modal",n.proxy(function(n){n.which==27&&this.hide()},this));else this.isShown||this.$element.off("keydown.dismiss.bs.modal")};t.prototype.resize=function(){if(this.isShown)n(window).on("resize.bs.modal",n.proxy(this.handleUpdate,this));else n(window).off("resize.bs.modal")};t.prototype.hideModal=function(){var n=this;this.$element.hide();this.backdrop(function(){n.$body.removeClass("modal-open");n.resetAdjustments();n.resetScrollbar();n.$element.trigger("hidden.bs.modal")})};t.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove();this.$backdrop=null};t.prototype.backdrop=function(i){var e=this,f=this.$element.hasClass("fade")?"fade":"",r,u;if(this.isShown&&this.options.backdrop){r=n.support.transition&&f;this.$backdrop=n(document.createElement("div")).addClass("modal-backdrop "+f).prependTo(this.$element);this.$backdrop.on("click.dismiss.bs.modal",n.proxy(function(n){if(this.ignoreBackdropClick){this.ignoreBackdropClick=!1;return}n.target===n.currentTarget&&(this.options.backdrop=="static"?this.$element[0].focus():this.hide())},this));if(r&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!i)return;r?this.$backdrop.one("bsTransitionEnd",i).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION):i()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),u=function(){e.removeBackdrop();i&&i()},n.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",u).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION):u()):i&&i()};t.prototype.handleUpdate=function(){this.adjustDialog()};t.prototype.adjustDialog=function(){var n=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&n?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!n?this.scrollbarWidth:""})};t.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})};t.prototype.checkScrollbar=function(){var n=window.innerWidth,t;n||(t=document.documentElement.getBoundingClientRect(),n=t.right-Math.abs(t.left));this.bodyIsOverflowing=document.body.clientWidth<n;this.scrollbarWidth=this.measureScrollbar()};t.prototype.setScrollbar=function(){var n=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"";this.bodyIsOverflowing&&this.$body.css("padding-right",n+this.scrollbarWidth)};t.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)};t.prototype.measureScrollbar=function(){var n=document.createElement("div"),t;return n.className="modal-scrollbar-measure",this.$body.append(n),t=n.offsetWidth-n.clientWidth,this.$body[0].removeChild(n),t};r=n.fn.modal;n.fn.modal=i;n.fn.modal.Constructor=t;n.fn.modal.noConflict=function(){return n.fn.modal=r,this};n(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(t){var r=n(this),f=r.attr("href"),u=n(r.attr("data-target")||f&&f.replace(/.*(?=#[^\s]+$)/,"")),e=u.data("bs.modal")?"toggle":n.extend({remote:!/#/.test(f)&&f},u.data(),r.data());r.is("a")&&t.preventDefault();u.one("show.bs.modal",function(n){if(!n.isDefaultPrevented())u.one("hidden.bs.modal",function(){r.is(":visible")&&r.trigger("focus")})});i.call(u,e,this)})}(jQuery);+function(n){"use strict";function r(i){return this.each(function(){var u=n(this),r=u.data("bs.tooltip"),f=typeof i=="object"&&i;(r||!/destroy|hide/.test(i))&&(r||u.data("bs.tooltip",r=new t(this,f)),typeof i=="string"&&r[i]())})}var t=function(n,t){this.type=null;this.options=null;this.enabled=null;this.timeout=null;this.hoverState=null;this.$element=null;this.inState=null;this.init("tooltip",n,t)},i;t.VERSION="3.3.5";t.TRANSITION_DURATION=150;t.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"><\/div><div class="tooltip-inner"><\/div><\/div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}};t.prototype.init=function(t,i,r){var f,e,u,o,s;if(this.enabled=!0,this.type=t,this.$element=n(i),this.options=this.getOptions(r),this.$viewport=this.options.viewport&&n(n.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(f=this.options.trigger.split(" "),e=f.length;e--;)if(u=f[e],u=="click")this.$element.on("click."+this.type,this.options.selector,n.proxy(this.toggle,this));else if(u!="manual"){o=u=="hover"?"mouseenter":"focusin";s=u=="hover"?"mouseleave":"focusout";this.$element.on(o+"."+this.type,this.options.selector,n.proxy(this.enter,this));this.$element.on(s+"."+this.type,this.options.selector,n.proxy(this.leave,this))}this.options.selector?this._options=n.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()};t.prototype.getDefaults=function(){return t.DEFAULTS};t.prototype.getOptions=function(t){return t=n.extend({},this.getDefaults(),this.$element.data(),t),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t};t.prototype.getDelegateOptions=function(){var t={},i=this.getDefaults();return this._options&&n.each(this._options,function(n,r){i[n]!=r&&(t[n]=r)}),t};t.prototype.enter=function(t){var i=t instanceof this.constructor?t:n(t.currentTarget).data("bs."+this.type);if(i||(i=new this.constructor(t.currentTarget,this.getDelegateOptions()),n(t.currentTarget).data("bs."+this.type,i)),t instanceof n.Event&&(i.inState[t.type=="focusin"?"focus":"hover"]=!0),i.tip().hasClass("in")||i.hoverState=="in"){i.hoverState="in";return}if(clearTimeout(i.timeout),i.hoverState="in",!i.options.delay||!i.options.delay.show)return i.show();i.timeout=setTimeout(function(){i.hoverState=="in"&&i.show()},i.options.delay.show)};t.prototype.isInStateTrue=function(){for(var n in this.inState)if(this.inState[n])return!0;return!1};t.prototype.leave=function(t){var i=t instanceof this.constructor?t:n(t.currentTarget).data("bs."+this.type);if(i||(i=new this.constructor(t.currentTarget,this.getDelegateOptions()),n(t.currentTarget).data("bs."+this.type,i)),t instanceof n.Event&&(i.inState[t.type=="focusout"?"focus":"hover"]=!1),!i.isInStateTrue()){if(clearTimeout(i.timeout),i.hoverState="out",!i.options.delay||!i.options.delay.hide)return i.hide();i.timeout=setTimeout(function(){i.hoverState=="out"&&i.hide()},i.options.delay.hide)}};t.prototype.show=function(){var c=n.Event("show.bs."+this.type),l,p,e,w,h;if(this.hasContent()&&this.enabled){if(this.$element.trigger(c),l=n.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]),c.isDefaultPrevented()||!l)return;var u=this,r=this.tip(),a=this.getUID(this.type);this.setContent();r.attr("id",a);this.$element.attr("aria-describedby",a);this.options.animation&&r.addClass("fade");var i=typeof this.options.placement=="function"?this.options.placement.call(this,r[0],this.$element[0]):this.options.placement,v=/\s?auto?\s?/i,y=v.test(i);y&&(i=i.replace(v,"")||"top");r.detach().css({top:0,left:0,display:"block"}).addClass(i).data("bs."+this.type,this);this.options.container?r.appendTo(this.options.container):r.insertAfter(this.$element);this.$element.trigger("inserted.bs."+this.type);var f=this.getPosition(),o=r[0].offsetWidth,s=r[0].offsetHeight;y&&(p=i,e=this.getPosition(this.$viewport),i=i=="bottom"&&f.bottom+s>e.bottom?"top":i=="top"&&f.top-s<e.top?"bottom":i=="right"&&f.right+o>e.width?"left":i=="left"&&f.left-o<e.left?"right":i,r.removeClass(p).addClass(i));w=this.getCalculatedOffset(i,f,o,s);this.applyPlacement(w,i);h=function(){var n=u.hoverState;u.$element.trigger("shown.bs."+u.type);u.hoverState=null;n=="out"&&u.leave(u)};n.support.transition&&this.$tip.hasClass("fade")?r.one("bsTransitionEnd",h).emulateTransitionEnd(t.TRANSITION_DURATION):h()}};t.prototype.applyPlacement=function(t,i){var r=this.tip(),l=r[0].offsetWidth,e=r[0].offsetHeight,o=parseInt(r.css("margin-top"),10),s=parseInt(r.css("margin-left"),10),h,f,u;isNaN(o)&&(o=0);isNaN(s)&&(s=0);t.top+=o;t.left+=s;n.offset.setOffset(r[0],n.extend({using:function(n){r.css({top:Math.round(n.top),left:Math.round(n.left)})}},t),0);r.addClass("in");h=r[0].offsetWidth;f=r[0].offsetHeight;i=="top"&&f!=e&&(t.top=t.top+e-f);u=this.getViewportAdjustedDelta(i,t,h,f);u.left?t.left+=u.left:t.top+=u.top;var c=/top|bottom/.test(i),a=c?u.left*2-l+h:u.top*2-e+f,v=c?"offsetWidth":"offsetHeight";r.offset(t);this.replaceArrow(a,r[0][v],c)};t.prototype.replaceArrow=function(n,t,i){this.arrow().css(i?"left":"top",50*(1-n/t)+"%").css(i?"top":"left","")};t.prototype.setContent=function(){var n=this.tip(),t=this.getTitle();n.find(".tooltip-inner")[this.options.html?"html":"text"](t);n.removeClass("fade in top bottom left right")};t.prototype.hide=function(i){function e(){u.hoverState!="in"&&r.detach();u.$element.removeAttr("aria-describedby").trigger("hidden.bs."+u.type);i&&i()}var u=this,r=n(this.$tip),f=n.Event("hide.bs."+this.type);if(this.$element.trigger(f),!f.isDefaultPrevented())return r.removeClass("in"),n.support.transition&&r.hasClass("fade")?r.one("bsTransitionEnd",e).emulateTransitionEnd(t.TRANSITION_DURATION):e(),this.hoverState=null,this};t.prototype.fixTitle=function(){var n=this.$element;(n.attr("title")||typeof n.attr("data-original-title")!="string")&&n.attr("data-original-title",n.attr("title")||"").attr("title","")};t.prototype.hasContent=function(){return this.getTitle()};t.prototype.getPosition=function(t){t=t||this.$element;var u=t[0],r=u.tagName=="BODY",i=u.getBoundingClientRect();i.width==null&&(i=n.extend({},i,{width:i.right-i.left,height:i.bottom-i.top}));var f=r?{top:0,left:0}:t.offset(),e={scroll:r?document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop()},o=r?{width:n(window).width(),height:n(window).height()}:null;return n.extend({},i,e,o,f)};t.prototype.getCalculatedOffset=function(n,t,i,r){return n=="bottom"?{top:t.top+t.height,left:t.left+t.width/2-i/2}:n=="top"?{top:t.top-r,left:t.left+t.width/2-i/2}:n=="left"?{top:t.top+t.height/2-r/2,left:t.left-i}:{top:t.top+t.height/2-r/2,left:t.left+t.width}};t.prototype.getViewportAdjustedDelta=function(n,t,i,r){var f={top:0,left:0},e,u,o,s,h,c;return this.$viewport?(e=this.options.viewport&&this.options.viewport.padding||0,u=this.getPosition(this.$viewport),/right|left/.test(n)?(o=t.top-e-u.scroll,s=t.top+e-u.scroll+r,o<u.top?f.top=u.top-o:s>u.top+u.height&&(f.top=u.top+u.height-s)):(h=t.left-e,c=t.left+e+i,h<u.left?f.left=u.left-h:c>u.right&&(f.left=u.left+u.width-c)),f):f};t.prototype.getTitle=function(){var t=this.$element,n=this.options;return t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title)};t.prototype.getUID=function(n){do n+=~~(Math.random()*1e6);while(document.getElementById(n));return n};t.prototype.tip=function(){if(!this.$tip&&(this.$tip=n(this.options.template),this.$tip.length!=1))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip};t.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")};t.prototype.enable=function(){this.enabled=!0};t.prototype.disable=function(){this.enabled=!1};t.prototype.toggleEnabled=function(){this.enabled=!this.enabled};t.prototype.toggle=function(t){var i=this;t&&(i=n(t.currentTarget).data("bs."+this.type),i||(i=new this.constructor(t.currentTarget,this.getDelegateOptions()),n(t.currentTarget).data("bs."+this.type,i)));t?(i.inState.click=!i.inState.click,i.isInStateTrue()?i.enter(i):i.leave(i)):i.tip().hasClass("in")?i.leave(i):i.enter(i)};t.prototype.destroy=function(){var n=this;clearTimeout(this.timeout);this.hide(function(){n.$element.off("."+n.type).removeData("bs."+n.type);n.$tip&&n.$tip.detach();n.$tip=null;n.$arrow=null;n.$viewport=null})};i=n.fn.tooltip;n.fn.tooltip=r;n.fn.tooltip.Constructor=t;n.fn.tooltip.noConflict=function(){return n.fn.tooltip=i,this}}(jQuery);+function(n){"use strict";function r(i){return this.each(function(){var u=n(this),r=u.data("bs.popover"),f=typeof i=="object"&&i;(r||!/destroy|hide/.test(i))&&(r||u.data("bs.popover",r=new t(this,f)),typeof i=="string"&&r[i]())})}var t=function(n,t){this.init("popover",n,t)},i;if(!n.fn.tooltip)throw new Error("Popover requires tooltip.js");t.VERSION="3.3.5";t.DEFAULTS=n.extend({},n.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"><\/div><h3 class="popover-title"><\/h3><div class="popover-content"><\/div><\/div>'});t.prototype=n.extend({},n.fn.tooltip.Constructor.prototype);t.prototype.constructor=t;t.prototype.getDefaults=function(){return t.DEFAULTS};t.prototype.setContent=function(){var n=this.tip(),i=this.getTitle(),t=this.getContent();n.find(".popover-title")[this.options.html?"html":"text"](i);n.find(".popover-content").children().detach().end()[this.options.html?typeof t=="string"?"html":"append":"text"](t);n.removeClass("fade top bottom left right in");n.find(".popover-title").html()||n.find(".popover-title").hide()};t.prototype.hasContent=function(){return this.getTitle()||this.getContent()};t.prototype.getContent=function(){var t=this.$element,n=this.options;return t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content)};t.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};i=n.fn.popover;n.fn.popover=r;n.fn.popover.Constructor=t;n.fn.popover.noConflict=function(){return n.fn.popover=i,this}}(jQuery);+function(n){"use strict";function t(i,r){this.$body=n(document.body);this.$scrollElement=n(i).is(document.body)?n(window):n(i);this.options=n.extend({},t.DEFAULTS,r);this.selector=(this.options.target||"")+" .nav li > a";this.offsets=[];this.targets=[];this.activeTarget=null;this.scrollHeight=0;this.$scrollElement.on("scroll.bs.scrollspy",n.proxy(this.process,this));this.refresh();this.process()}function i(i){return this.each(function(){var u=n(this),r=u.data("bs.scrollspy"),f=typeof i=="object"&&i;r||u.data("bs.scrollspy",r=new t(this,f));typeof i=="string"&&r[i]()})}t.VERSION="3.3.5";t.DEFAULTS={offset:10};t.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)};t.prototype.refresh=function(){var t=this,i="offset",r=0;this.offsets=[];this.targets=[];this.scrollHeight=this.getScrollHeight();n.isWindow(this.$scrollElement[0])||(i="position",r=this.$scrollElement.scrollTop());this.$body.find(this.selector).map(function(){var f=n(this),u=f.data("target")||f.attr("href"),t=/^#./.test(u)&&n(u);return t&&t.length&&t.is(":visible")&&[[t[i]().top+r,u]]||null}).sort(function(n,t){return n[0]-t[0]}).each(function(){t.offsets.push(this[0]);t.targets.push(this[1])})};t.prototype.process=function(){var i=this.$scrollElement.scrollTop()+this.options.offset,f=this.getScrollHeight(),e=this.options.offset+f-this.$scrollElement.height(),t=this.offsets,r=this.targets,u=this.activeTarget,n;if(this.scrollHeight!=f&&this.refresh(),i>=e)return u!=(n=r[r.length-1])&&this.activate(n);if(u&&i<t[0])return this.activeTarget=null,this.clear();for(n=t.length;n--;)u!=r[n]&&i>=t[n]&&(t[n+1]===undefined||i<t[n+1])&&this.activate(r[n])};t.prototype.activate=function(t){this.activeTarget=t;this.clear();var r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',i=n(r).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active"));i.trigger("activate.bs.scrollspy")};t.prototype.clear=function(){n(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var r=n.fn.scrollspy;n.fn.scrollspy=i;n.fn.scrollspy.Constructor=t;n.fn.scrollspy.noConflict=function(){return n.fn.scrollspy=r,this};n(window).on("load.bs.scrollspy.data-api",function(){n('[data-spy="scroll"]').each(function(){var t=n(this);i.call(t,t.data())})})}(jQuery);+function(n){"use strict";function r(i){return this.each(function(){var u=n(this),r=u.data("bs.tab");r||u.data("bs.tab",r=new t(this));typeof i=="string"&&r[i]()})}var t=function(t){this.element=n(t)},u,i;t.VERSION="3.3.5";t.TRANSITION_DURATION=150;t.prototype.show=function(){var t=this.element,f=t.closest("ul:not(.dropdown-menu)"),i=t.data("target"),u;if(i||(i=t.attr("href"),i=i&&i.replace(/.*(?=#[^\s]*$)/,"")),!t.parent("li").hasClass("active")){var r=f.find(".active:last a"),e=n.Event("hide.bs.tab",{relatedTarget:t[0]}),o=n.Event("show.bs.tab",{relatedTarget:r[0]});(r.trigger(e),t.trigger(o),o.isDefaultPrevented()||e.isDefaultPrevented())||(u=n(i),this.activate(t.closest("li"),f),this.activate(u,u.parent(),function(){r.trigger({type:"hidden.bs.tab",relatedTarget:t[0]});t.trigger({type:"shown.bs.tab",relatedTarget:r[0]})}))}};t.prototype.activate=function(i,r,u){function o(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1);i.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0);e?(i[0].offsetWidth,i.addClass("in")):i.removeClass("fade");i.parent(".dropdown-menu").length&&i.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0);u&&u()}var f=r.find("> .active"),e=u&&n.support.transition&&(f.length&&f.hasClass("fade")||!!r.find("> .fade").length);f.length&&e?f.one("bsTransitionEnd",o).emulateTransitionEnd(t.TRANSITION_DURATION):o();f.removeClass("in")};u=n.fn.tab;n.fn.tab=r;n.fn.tab.Constructor=t;n.fn.tab.noConflict=function(){return n.fn.tab=u,this};i=function(t){t.preventDefault();r.call(n(this),"show")};n(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',i).on("click.bs.tab.data-api",'[data-toggle="pill"]',i)}(jQuery);+function(n){"use strict";function i(i){return this.each(function(){var u=n(this),r=u.data("bs.affix"),f=typeof i=="object"&&i;r||u.data("bs.affix",r=new t(this,f));typeof i=="string"&&r[i]()})}var t=function(i,r){this.options=n.extend({},t.DEFAULTS,r);this.$target=n(this.options.target).on("scroll.bs.affix.data-api",n.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",n.proxy(this.checkPositionWithEventLoop,this));this.$element=n(i);this.affixed=null;this.unpin=null;this.pinnedOffset=null;this.checkPosition()},r;t.VERSION="3.3.5";t.RESET="affix affix-top affix-bottom";t.DEFAULTS={offset:0,target:window};t.prototype.getState=function(n,t,i,r){var u=this.$target.scrollTop(),f=this.$element.offset(),e=this.$target.height();if(i!=null&&this.affixed=="top")return u<i?"top":!1;if(this.affixed=="bottom")return i!=null?u+this.unpin<=f.top?!1:"bottom":u+e<=n-r?!1:"bottom";var o=this.affixed==null,s=o?u:f.top,h=o?e:t;return i!=null&&u<=i?"top":r!=null&&s+h>=n-r?"bottom":!1};t.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(t.RESET).addClass("affix");var n=this.$target.scrollTop(),i=this.$element.offset();return this.pinnedOffset=i.top-n};t.prototype.checkPositionWithEventLoop=function(){setTimeout(n.proxy(this.checkPosition,this),1)};t.prototype.checkPosition=function(){var i,e,o;if(this.$element.is(":visible")){var s=this.$element.height(),r=this.options.offset,f=r.top,u=r.bottom,h=Math.max(n(document).height(),n(document.body).height());if(typeof r!="object"&&(u=f=r),typeof f=="function"&&(f=r.top(this.$element)),typeof u=="function"&&(u=r.bottom(this.$element)),i=this.getState(h,s,f,u),this.affixed!=i){if(this.unpin!=null&&this.$element.css("top",""),e="affix"+(i?"-"+i:""),o=n.Event(e+".bs.affix"),this.$element.trigger(o),o.isDefaultPrevented())return;this.affixed=i;this.unpin=i=="bottom"?this.getPinnedOffset():null;this.$element.removeClass(t.RESET).addClass(e).trigger(e.replace("affix","affixed")+".bs.affix")}i=="bottom"&&this.$element.offset({top:h-s-u})}};r=n.fn.affix;n.fn.affix=i;n.fn.affix.Constructor=t;n.fn.affix.noConflict=function(){return n.fn.affix=r,this};n(window).on("load",function(){n('[data-spy="affix"]').each(function(){var r=n(this),t=r.data();t.offset=t.offset||{};t.offsetBottom!=null&&(t.offset.bottom=t.offsetBottom);t.offsetTop!=null&&(t.offset.top=t.offsetTop);i.call(r,t)})})}(jQuery);
/*
//# sourceMappingURL=bootstrap.min.js.map
*/
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function (root, factory) {

    /* CommonJS */
    if (typeof exports == 'object') module.exports = factory()

        /* AMD module */
    else if (typeof define == 'function' && define.amd) define(factory)

        /* Browser global */
    else root.LoadingSpinner = factory()
}
(this, function () {
    "use strict";

    var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
      , animations = {} /* Animation rules keyed by their name */
      , useCssAnimations; /* Whether to use CSS animations or setTimeout */

    /**
     * Utility function to create elements. If no tag name is given,
     * a DIV is created. Optionally properties can be passed.
     */
    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div')
          , n;

        for (n in prop) el[n] = prop[n]
        return el
    }

    /**
     * Appends children and returns the parent.
     */
    function ins(parent /* child1, child2, ...*/) {
        for (var i = 1, n = arguments.length; i < n; i++)
            parent.appendChild(arguments[i])

        return parent
    }

    /**
     * Insert a new stylesheet to hold the @keyframe or VML rules.
     */
    var sheet = (function () {
        var el = createEl('style', { type: 'text/css' })
        ins(document.getElementsByTagName('head')[0], el)
        return el.sheet || el.styleSheet
    }())

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
          , start = 0.01 + i / lines * 100
          , z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha)
          , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
          , pre = prefix && '-' + prefix + '-' || ''

        if (!animations[name]) {
            sheet.insertRule(
              '@' + pre + 'keyframes ' + name + '{' +
              '0%{opacity:' + z + '}' +
              start + '%{opacity:' + alpha + '}' +
              (start + 0.01) + '%{opacity:1}' +
              (start + trail) % 100 + '%{opacity:' + alpha + '}' +
              '100%{opacity:' + z + '}' +
              '}', sheet.cssRules.length)

            animations[name] = 1
        }

        return name
    }

    /**
     * Tries various vendor prefixes and returns the first supported property.
     */
    function vendor(el, prop) {
        var s = el.style
          , pp
          , i

        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop
            if (s[pp] !== undefined) return pp
        }
        if (s[prop] !== undefined) return prop
    }

    /**
     * Sets multiple style properties at once.
     */
    function css(el, prop) {
        for (var n in prop)
            el.style[vendor(el, n) || n] = prop[n]

        return el
    }

    /**
     * Fills in default values.
     */
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def)
                if (obj[n] === undefined) obj[n] = def[n]
        }
        return obj
    }

    /**
     * Returns the absolute page-offset of the given element.
     */
    function pos(el) {
        var o = { x: el.offsetLeft, y: el.offsetTop }
        while ((el = el.offsetParent))
            o.x += el.offsetLeft, o.y += el.offsetTop

        return o
    }

    /**
     * Returns the line color from the given string or array.
     */
    function getColor(color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }

    // Built-in defaults

    var defaults = {
        lines: 12,            // The number of lines to draw
        length: 10,            // The length of each line
        width: 5,             // The line thickness
        radius: 15,           // The radius of the inner circle
        rotate: 0,            // Rotation offset
        corners: 1,           // Roundness (0..1)
        color: '#000',        // #rgb or #rrggbb
        direction: 1,         // 1: clockwise, -1: counterclockwise
        speed: 1,             // Rounds per second
        trail: 100,           // Afterglow percentage
        opacity: 1 / 4,         // Opacity of the lines
        fps: 20,              // Frames per second when using setTimeout()
        zIndex: 1001,          // Use a high z-index by default
        className: 'spinner', // CSS class to assign to the element
        top: '50%',           // center vertically
        left: '50%',          // center horizontally
        position: 'absolute'  // element position
    }

    /** The constructor */
    function LoadingSpinner(o) {
        this.opts = merge(o || {}, LoadingSpinner.defaults, defaults)
    }

    // Global defaults that override the built-ins:
    LoadingSpinner.defaults = {}

    merge(LoadingSpinner.prototype, {

        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target b calling
         * stop() internally.
         */
        spin: function (target) {
            this.stop()
            
            this.opts.target = target;
            var divMask = document.createElement("div");
            divMask.className = "spinnerMask";
            divMask.style.width = target.width;
            divMask.style.height = target.height;
            target.appendChild(divMask);
            this.divMask = divMask;

            var self = this
              , o = self.opts
              , el = self.el = css(createEl(0, { className: o.className }), { position: o.position, width: 0, zIndex: o.zIndex })
              , mid = o.radius + o.length + o.width

            css(el, {
                left: o.left,
                top: o.top
            })

            if (target) {
                target.insertBefore(el, target.firstChild || null)
            }

            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0
                  , start = (o.lines - 1) * (1 - o.direction) / 2
                  , alpha
                  , fps = o.fps
                  , f = fps / o.speed
                  , ostep = (1 - o.opacity) / (f * o.trail / 100)
                  , astep = f / o.lines

                ; (function anim() {
                    i++;
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                })()
            }
            return self
        },

        /**
         * Stops and removes the LoadingSpinner.
         */
        stop: function () {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode) el.parentNode.removeChild(el)
                this.el = undefined
                if (this.divMask) {
                    if (this.divMask.parentNode) this.divMask.parentNode.removeChild(this.divMask)
                    this.el = undefined
                }
            }
            return this
        },

        /**
         * Internal method that draws the individual lines. Will be overwritten
         * in VML fallback mode below.
         */
        lines: function (el, o) {
            var i = 0
              , start = (o.lines - 1) * (1 - o.direction) / 2
              , seg

            function fill(color, shadow) {
                return css(createEl(), {
                    position: 'absolute',
                    width: (o.length + o.width) + 'px',
                    height: o.width + 'px',
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: 'left',
                    transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.radius + 'px' + ',0)',
                    borderRadius: (o.corners * o.width >> 1) + 'px'
                })
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute',
                    top: 1 + ~(o.width / 2) + 'px',
                    transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
                    opacity: o.opacity,
                    animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                })

                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), { top: 2 + 'px' }))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        },

        /**
         * Internal method that adjusts the opacity of a single line.
         * Will be overwritten in VML fallback mode below.
         */
        opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
        }

    })


    function initVML() {

        /* Utility function to create a VML tag */
        function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        LoadingSpinner.prototype.lines = function (el, o) {
            var r = o.length + o.width
              , s = 2 * r

            function grp() {
                return css(
                  vml('group', {
                      coordsize: s + ' ' + s,
                      coordorigin: -r + ' ' + -r
                  }),
                  { width: s, height: s }
                )
            }

            var margin = -(o.width + o.length) * 2 + 'px'
              , g = css(grp(), { position: 'absolute', top: margin, left: margin })
              , i

            function seg(i, dx, filter) {
                ins(g,
                  ins(css(grp(), { rotation: 360 / o.lines * i + 'deg', left: ~~dx }),
                    ins(css(vml('roundrect', { arcsize: o.corners }), {
                        width: r,
                        height: o.width,
                        left: o.radius,
                        top: -o.width >> 1,
                        filter: filter
                    }),
                      vml('fill', { color: getColor(o.color, i), opacity: o.opacity }),
                      vml('stroke', { opacity: 0 }) // transparent stroke to fix color bleeding upon opacity change
                    )
                  )
                )
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++)
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

            for (i = 1; i <= o.lines; i++) seg(i)
            return ins(el, g)
        }

        LoadingSpinner.prototype.opacity = function (el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
                if (c) c.opacity = val
            }
        }
    }

    var probe = css(createEl('group'), { behavior: 'url(#default#VML)' })

    if (!vendor(probe, 'transform') && probe.adj) initVML()
    else useCssAnimations = vendor(probe, 'animation')

    return LoadingSpinner

}));

﻿// Ion.RangeSlider | version 2.1.2 | https://github.com/IonDen/ion.rangeSlider
;(function(f,r,h,t,v){var u=0,p=function(){var a=t.userAgent,b=/msie\s\d+/i;return 0<a.search(b)&&(a=b.exec(a).toString(),a=a.split(" ")[1],9>a)?(f("html").addClass("lt-ie9"),!0):!1}();Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,d=[].slice;if("function"!=typeof b)throw new TypeError;var c=d.call(arguments,1),e=function(){if(this instanceof e){var g=function(){};g.prototype=b.prototype;var g=new g,l=b.apply(g,c.concat(d.call(arguments)));return Object(l)===l?l:g}return b.apply(a,
c.concat(d.call(arguments)))};return e});Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var d;if(null==this)throw new TypeError('"this" is null or not defined');var c=Object(this),e=c.length>>>0;if(0===e)return-1;d=+b||0;Infinity===Math.abs(d)&&(d=0);if(d>=e)return-1;for(d=Math.max(0<=d?d:e-Math.abs(d),0);d<e;){if(d in c&&c[d]===a)return d;d++}return-1});var q=function(a,b,d){this.VERSION="2.1.2";this.input=a;this.plugin_count=d;this.old_to=this.old_from=this.update_tm=this.calc_count=
this.current_plugin=0;this.raf_id=this.old_min_interval=null;this.is_update=this.is_key=this.no_diapason=this.force_redraw=this.dragging=!1;this.is_start=!0;this.is_click=this.is_resize=this.is_active=this.is_finish=!1;this.$cache={win:f(h),body:f(r.body),input:f(a),cont:null,rs:null,min:null,max:null,from:null,to:null,single:null,bar:null,line:null,s_single:null,s_from:null,s_to:null,shad_single:null,shad_from:null,shad_to:null,edge:null,grid:null,grid_labels:[]};this.coords={x_gap:0,x_pointer:0,
w_rs:0,w_rs_old:0,w_handle:0,p_gap:0,p_gap_left:0,p_gap_right:0,p_step:0,p_pointer:0,p_handle:0,p_single_fake:0,p_single_real:0,p_from_fake:0,p_from_real:0,p_to_fake:0,p_to_real:0,p_bar_x:0,p_bar_w:0,grid_gap:0,big_num:0,big:[],big_w:[],big_p:[],big_x:[]};this.labels={w_min:0,w_max:0,w_from:0,w_to:0,w_single:0,p_min:0,p_max:0,p_from_fake:0,p_from_left:0,p_to_fake:0,p_to_left:0,p_single_fake:0,p_single_left:0};var c=this.$cache.input;a=c.prop("value");var e;d={type:"single",min:10,max:100,from:null,
to:null,step:1,min_interval:0,max_interval:0,drag_interval:!1,values:[],p_values:[],from_fixed:!1,from_min:null,from_max:null,from_shadow:!1,to_fixed:!1,to_min:null,to_max:null,to_shadow:!1,prettify_enabled:!0,prettify_separator:" ",prettify:null,force_edges:!1,keyboard:!1,keyboard_step:5,grid:!1,grid_margin:!0,grid_num:4,grid_snap:!1,hide_min_max:!1,hide_from_to:!1,prefix:"",postfix:"",max_postfix:"",decorate_both:!0,values_separator:" \u2014 ",input_values_separator:";",disable:!1,onStart:null,
onChange:null,onFinish:null,onUpdate:null};c={type:c.data("type"),min:c.data("min"),max:c.data("max"),from:c.data("from"),to:c.data("to"),step:c.data("step"),min_interval:c.data("minInterval"),max_interval:c.data("maxInterval"),drag_interval:c.data("dragInterval"),values:c.data("values"),from_fixed:c.data("fromFixed"),from_min:c.data("fromMin"),from_max:c.data("fromMax"),from_shadow:c.data("fromShadow"),to_fixed:c.data("toFixed"),to_min:c.data("toMin"),to_max:c.data("toMax"),to_shadow:c.data("toShadow"),
prettify_enabled:c.data("prettifyEnabled"),prettify_separator:c.data("prettifySeparator"),force_edges:c.data("forceEdges"),keyboard:c.data("keyboard"),keyboard_step:c.data("keyboardStep"),grid:c.data("grid"),grid_margin:c.data("gridMargin"),grid_num:c.data("gridNum"),grid_snap:c.data("gridSnap"),hide_min_max:c.data("hideMinMax"),hide_from_to:c.data("hideFromTo"),prefix:c.data("prefix"),postfix:c.data("postfix"),max_postfix:c.data("maxPostfix"),decorate_both:c.data("decorateBoth"),values_separator:c.data("valuesSeparator"),
input_values_separator:c.data("inputValuesSeparator"),disable:c.data("disable")};c.values=c.values&&c.values.split(",");for(e in c)c.hasOwnProperty(e)&&(c[e]||0===c[e]||delete c[e]);a&&(a=a.split(c.input_values_separator||b.input_values_separator||";"),a[0]&&a[0]==+a[0]&&(a[0]=+a[0]),a[1]&&a[1]==+a[1]&&(a[1]=+a[1]),b&&b.values&&b.values.length?(d.from=a[0]&&b.values.indexOf(a[0]),d.to=a[1]&&b.values.indexOf(a[1])):(d.from=a[0]&&+a[0],d.to=a[1]&&+a[1]));f.extend(d,b);f.extend(d,c);this.options=d;this.validate();
this.result={input:this.$cache.input,slider:null,min:this.options.min,max:this.options.max,from:this.options.from,from_percent:0,from_value:null,to:this.options.to,to_percent:0,to_value:null};this.init()};q.prototype={init:function(a){this.no_diapason=!1;this.coords.p_step=this.convertToPercent(this.options.step,!0);this.target="base";this.toggleInput();this.append();this.setMinMax();a?(this.force_redraw=!0,this.calc(!0),this.callOnUpdate()):(this.force_redraw=!0,this.calc(!0),this.callOnStart());
this.updateScene()},append:function(){this.$cache.input.before('<span class="irs js-irs-'+this.plugin_count+'"></span>');this.$cache.input.prop("readonly",!0);this.$cache.cont=this.$cache.input.prev();this.result.slider=this.$cache.cont;this.$cache.cont.html('<span class="irs"><span class="irs-line" tabindex="-1"><span class="irs-line-left"></span><span class="irs-line-mid"></span><span class="irs-line-right"></span></span><span class="irs-min">0</span><span class="irs-max">1</span><span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span></span><span class="irs-grid"></span><span class="irs-bar"></span>');
this.$cache.rs=this.$cache.cont.find(".irs");this.$cache.min=this.$cache.cont.find(".irs-min");this.$cache.max=this.$cache.cont.find(".irs-max");this.$cache.from=this.$cache.cont.find(".irs-from");this.$cache.to=this.$cache.cont.find(".irs-to");this.$cache.single=this.$cache.cont.find(".irs-single");this.$cache.bar=this.$cache.cont.find(".irs-bar");this.$cache.line=this.$cache.cont.find(".irs-line");this.$cache.grid=this.$cache.cont.find(".irs-grid");"single"===this.options.type?(this.$cache.cont.append('<span class="irs-bar-edge"></span><span class="irs-shadow shadow-single"></span><span class="irs-slider single"></span>'),
this.$cache.edge=this.$cache.cont.find(".irs-bar-edge"),this.$cache.s_single=this.$cache.cont.find(".single"),this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.shad_single=this.$cache.cont.find(".shadow-single")):(this.$cache.cont.append('<span class="irs-shadow shadow-from"></span><span class="irs-shadow shadow-to"></span><span class="irs-slider from"></span><span class="irs-slider to"></span>'),this.$cache.s_from=this.$cache.cont.find(".from"),
this.$cache.s_to=this.$cache.cont.find(".to"),this.$cache.shad_from=this.$cache.cont.find(".shadow-from"),this.$cache.shad_to=this.$cache.cont.find(".shadow-to"),this.setTopHandler());this.options.hide_from_to&&(this.$cache.from[0].style.display="none",this.$cache.to[0].style.display="none",this.$cache.single[0].style.display="none");this.appendGrid();this.options.disable?(this.appendDisableMask(),this.$cache.input[0].disabled=!0):(this.$cache.cont.removeClass("irs-disabled"),this.$cache.input[0].disabled=
!1,this.bindEvents());this.options.drag_interval&&(this.$cache.bar[0].style.cursor="ew-resize")},setTopHandler:function(){var a=this.options.max,b=this.options.to;this.options.from>this.options.min&&b===a?this.$cache.s_from.addClass("type_last"):b<a&&this.$cache.s_to.addClass("type_last")},changeLevel:function(a){switch(a){case "single":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_single_fake);break;case "from":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_from_fake);
this.$cache.s_from.addClass("state_hover");this.$cache.s_from.addClass("type_last");this.$cache.s_to.removeClass("type_last");break;case "to":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_to_fake);this.$cache.s_to.addClass("state_hover");this.$cache.s_to.addClass("type_last");this.$cache.s_from.removeClass("type_last");break;case "both":this.coords.p_gap_left=this.toFixed(this.coords.p_pointer-this.coords.p_from_fake),this.coords.p_gap_right=this.toFixed(this.coords.p_to_fake-
this.coords.p_pointer),this.$cache.s_to.removeClass("type_last"),this.$cache.s_from.removeClass("type_last")}},appendDisableMask:function(){this.$cache.cont.append('<span class="irs-disable-mask"></span>');this.$cache.cont.addClass("irs-disabled")},remove:function(){this.$cache.cont.remove();this.$cache.cont=null;this.$cache.line.off("keydown.irs_"+this.plugin_count);this.$cache.body.off("touchmove.irs_"+this.plugin_count);this.$cache.body.off("mousemove.irs_"+this.plugin_count);this.$cache.win.off("touchend.irs_"+
this.plugin_count);this.$cache.win.off("mouseup.irs_"+this.plugin_count);p&&(this.$cache.body.off("mouseup.irs_"+this.plugin_count),this.$cache.body.off("mouseleave.irs_"+this.plugin_count));this.$cache.grid_labels=[];this.coords.big=[];this.coords.big_w=[];this.coords.big_p=[];this.coords.big_x=[];cancelAnimationFrame(this.raf_id)},bindEvents:function(){if(!this.no_diapason){this.$cache.body.on("touchmove.irs_"+this.plugin_count,this.pointerMove.bind(this));this.$cache.body.on("mousemove.irs_"+this.plugin_count,
this.pointerMove.bind(this));this.$cache.win.on("touchend.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.win.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.line.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.line.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.options.drag_interval&&"double"===this.options.type?(this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,
"both")),this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"both"))):(this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")));"single"===this.options.type?(this.$cache.single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.s_single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),
this.$cache.shad_single.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.s_single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single")),this.$cache.edge.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_single.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))):(this.$cache.single.on("touchstart.irs_"+
this.plugin_count,this.pointerDown.bind(this,null)),this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,null)),this.$cache.from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.s_from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.s_to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),
this.$cache.shad_from.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_to.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.s_from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from")),this.$cache.to.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.s_to.on("mousedown.irs_"+
this.plugin_count,this.pointerDown.bind(this,"to")),this.$cache.shad_from.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")),this.$cache.shad_to.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click")));if(this.options.keyboard)this.$cache.line.on("keydown.irs_"+this.plugin_count,this.key.bind(this,"keyboard"));p&&(this.$cache.body.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this)),this.$cache.body.on("mouseleave.irs_"+this.plugin_count,this.pointerUp.bind(this)))}},
pointerMove:function(a){this.dragging&&(this.coords.x_pointer=(a.pageX||a.originalEvent.touches&&a.originalEvent.touches[0].pageX)-this.coords.x_gap,this.calc())},pointerUp:function(a){if(this.current_plugin===this.plugin_count&&this.is_active){this.is_active=!1;this.$cache.cont.find(".state_hover").removeClass("state_hover");this.force_redraw=!0;p&&f("*").prop("unselectable",!1);this.updateScene();this.restoreOriginalMinInterval();if(f.contains(this.$cache.cont[0],a.target)||this.dragging)this.is_finish=
!0,this.callOnFinish();this.dragging=!1}},pointerDown:function(a,b){b.preventDefault();var d=b.pageX||b.originalEvent.touches&&b.originalEvent.touches[0].pageX;2!==b.button&&("both"===a&&this.setTempMinInterval(),a||(a=this.target),this.current_plugin=this.plugin_count,this.target=a,this.dragging=this.is_active=!0,this.coords.x_gap=this.$cache.rs.offset().left,this.coords.x_pointer=d-this.coords.x_gap,this.calcPointerPercent(),this.changeLevel(a),p&&f("*").prop("unselectable",!0),this.$cache.line.trigger("focus"),
this.updateScene())},pointerClick:function(a,b){b.preventDefault();var d=b.pageX||b.originalEvent.touches&&b.originalEvent.touches[0].pageX;2!==b.button&&(this.current_plugin=this.plugin_count,this.target=a,this.is_click=!0,this.coords.x_gap=this.$cache.rs.offset().left,this.coords.x_pointer=+(d-this.coords.x_gap).toFixed(),this.force_redraw=!0,this.calc(),this.$cache.line.trigger("focus"))},key:function(a,b){if(!(this.current_plugin!==this.plugin_count||b.altKey||b.ctrlKey||b.shiftKey||b.metaKey)){switch(b.which){case 83:case 65:case 40:case 37:b.preventDefault();
this.moveByKey(!1);break;case 87:case 68:case 38:case 39:b.preventDefault(),this.moveByKey(!0)}return!0}},moveByKey:function(a){var b=this.coords.p_pointer,b=a?b+this.options.keyboard_step:b-this.options.keyboard_step;this.coords.x_pointer=this.toFixed(this.coords.w_rs/100*b);this.is_key=!0;this.calc()},setMinMax:function(){this.options&&(this.options.hide_min_max?(this.$cache.min[0].style.display="none",this.$cache.max[0].style.display="none"):(this.options.values.length?(this.$cache.min.html(this.decorate(this.options.p_values[this.options.min])),
this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]))):(this.$cache.min.html(this.decorate(this._prettify(this.options.min),this.options.min)),this.$cache.max.html(this.decorate(this._prettify(this.options.max),this.options.max))),this.labels.w_min=this.$cache.min.outerWidth(!1),this.labels.w_max=this.$cache.max.outerWidth(!1)))},setTempMinInterval:function(){var a=this.result.to-this.result.from;null===this.old_min_interval&&(this.old_min_interval=this.options.min_interval);
this.options.min_interval=a},restoreOriginalMinInterval:function(){null!==this.old_min_interval&&(this.options.min_interval=this.old_min_interval,this.old_min_interval=null)},calc:function(a){if(this.options){this.calc_count++;if(10===this.calc_count||a)this.calc_count=0,this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.calcHandlePercent();if(this.coords.w_rs){this.calcPointerPercent();a=this.getHandleX();"click"===this.target&&(this.coords.p_gap=this.coords.p_handle/2,a=this.getHandleX(),this.target=
this.options.drag_interval?"both_one":this.chooseHandle(a));switch(this.target){case "base":var b=(this.options.max-this.options.min)/100;a=(this.result.from-this.options.min)/b;b=(this.result.to-this.options.min)/b;this.coords.p_single_real=this.toFixed(a);this.coords.p_from_real=this.toFixed(a);this.coords.p_to_real=this.toFixed(b);this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,
this.options.from_min,this.options.from_max);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_single_fake=this.convertToFakePercent(this.coords.p_single_real);this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);this.target=null;break;case "single":if(this.options.from_fixed)break;this.coords.p_single_real=this.convertToRealPercent(a);this.coords.p_single_real=
this.calcWithStep(this.coords.p_single_real);this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max);this.coords.p_single_fake=this.convertToFakePercent(this.coords.p_single_real);break;case "from":if(this.options.from_fixed)break;this.coords.p_from_real=this.convertToRealPercent(a);this.coords.p_from_real=this.calcWithStep(this.coords.p_from_real);this.coords.p_from_real>this.coords.p_to_real&&(this.coords.p_from_real=this.coords.p_to_real);
this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from_real=this.checkMaxInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);break;case "to":if(this.options.to_fixed)break;this.coords.p_to_real=this.convertToRealPercent(a);this.coords.p_to_real=
this.calcWithStep(this.coords.p_to_real);this.coords.p_to_real<this.coords.p_from_real&&(this.coords.p_to_real=this.coords.p_from_real);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to_real=this.checkMaxInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);
break;case "both":if(this.options.from_fixed||this.options.to_fixed)break;a=this.toFixed(a+.1*this.coords.p_handle);this.coords.p_from_real=this.convertToRealPercent(a)-this.coords.p_gap_left;this.coords.p_from_real=this.calcWithStep(this.coords.p_from_real);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);
this.coords.p_to_real=this.convertToRealPercent(a)+this.coords.p_gap_right;this.coords.p_to_real=this.calcWithStep(this.coords.p_to_real);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to_fake=this.convertToFakePercent(this.coords.p_to_real);break;case "both_one":if(this.options.from_fixed||this.options.to_fixed)break;var d=this.convertToRealPercent(a);
a=this.result.to_percent-this.result.from_percent;var c=a/2,b=d-c,d=d+c;0>b&&(b=0,d=b+a);100<d&&(d=100,b=d-a);this.coords.p_from_real=this.calcWithStep(b);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_fake=this.convertToFakePercent(this.coords.p_from_real);this.coords.p_to_real=this.calcWithStep(d);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_fake=
this.convertToFakePercent(this.coords.p_to_real)}"single"===this.options.type?(this.coords.p_bar_x=this.coords.p_handle/2,this.coords.p_bar_w=this.coords.p_single_fake,this.result.from_percent=this.coords.p_single_real,this.result.from=this.convertToValue(this.coords.p_single_real),this.options.values.length&&(this.result.from_value=this.options.values[this.result.from])):(this.coords.p_bar_x=this.toFixed(this.coords.p_from_fake+this.coords.p_handle/2),this.coords.p_bar_w=this.toFixed(this.coords.p_to_fake-
this.coords.p_from_fake),this.result.from_percent=this.coords.p_from_real,this.result.from=this.convertToValue(this.coords.p_from_real),this.result.to_percent=this.coords.p_to_real,this.result.to=this.convertToValue(this.coords.p_to_real),this.options.values.length&&(this.result.from_value=this.options.values[this.result.from],this.result.to_value=this.options.values[this.result.to]));this.calcMinMax();this.calcLabels()}}},calcPointerPercent:function(){this.coords.w_rs?(0>this.coords.x_pointer||isNaN(this.coords.x_pointer)?
this.coords.x_pointer=0:this.coords.x_pointer>this.coords.w_rs&&(this.coords.x_pointer=this.coords.w_rs),this.coords.p_pointer=this.toFixed(this.coords.x_pointer/this.coords.w_rs*100)):this.coords.p_pointer=0},convertToRealPercent:function(a){return a/(100-this.coords.p_handle)*100},convertToFakePercent:function(a){return a/100*(100-this.coords.p_handle)},getHandleX:function(){var a=100-this.coords.p_handle,b=this.toFixed(this.coords.p_pointer-this.coords.p_gap);0>b?b=0:b>a&&(b=a);return b},calcHandlePercent:function(){this.coords.w_handle=
"single"===this.options.type?this.$cache.s_single.outerWidth(!1):this.$cache.s_from.outerWidth(!1);this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100)},chooseHandle:function(a){return"single"===this.options.type?"single":a>=this.coords.p_from_real+(this.coords.p_to_real-this.coords.p_from_real)/2?this.options.to_fixed?"from":"to":this.options.from_fixed?"to":"from"},calcMinMax:function(){this.coords.w_rs&&(this.labels.p_min=this.labels.w_min/this.coords.w_rs*100,this.labels.p_max=
this.labels.w_max/this.coords.w_rs*100)},calcLabels:function(){this.coords.w_rs&&!this.options.hide_from_to&&("single"===this.options.type?(this.labels.w_single=this.$cache.single.outerWidth(!1),this.labels.p_single_fake=this.labels.w_single/this.coords.w_rs*100,this.labels.p_single_left=this.coords.p_single_fake+this.coords.p_handle/2-this.labels.p_single_fake/2):(this.labels.w_from=this.$cache.from.outerWidth(!1),this.labels.p_from_fake=this.labels.w_from/this.coords.w_rs*100,this.labels.p_from_left=
this.coords.p_from_fake+this.coords.p_handle/2-this.labels.p_from_fake/2,this.labels.p_from_left=this.toFixed(this.labels.p_from_left),this.labels.p_from_left=this.checkEdges(this.labels.p_from_left,this.labels.p_from_fake),this.labels.w_to=this.$cache.to.outerWidth(!1),this.labels.p_to_fake=this.labels.w_to/this.coords.w_rs*100,this.labels.p_to_left=this.coords.p_to_fake+this.coords.p_handle/2-this.labels.p_to_fake/2,this.labels.p_to_left=this.toFixed(this.labels.p_to_left),this.labels.p_to_left=
this.checkEdges(this.labels.p_to_left,this.labels.p_to_fake),this.labels.w_single=this.$cache.single.outerWidth(!1),this.labels.p_single_fake=this.labels.w_single/this.coords.w_rs*100,this.labels.p_single_left=(this.labels.p_from_left+this.labels.p_to_left+this.labels.p_to_fake)/2-this.labels.p_single_fake/2,this.labels.p_single_left=this.toFixed(this.labels.p_single_left)),this.labels.p_single_left=this.checkEdges(this.labels.p_single_left,this.labels.p_single_fake))},updateScene:function(){this.raf_id&&
(cancelAnimationFrame(this.raf_id),this.raf_id=null);clearTimeout(this.update_tm);this.update_tm=null;this.options&&(this.drawHandles(),this.is_active?this.raf_id=requestAnimationFrame(this.updateScene.bind(this)):this.update_tm=setTimeout(this.updateScene.bind(this),300))},drawHandles:function(){this.coords.w_rs=this.$cache.rs.outerWidth(!1);if(this.coords.w_rs){this.coords.w_rs!==this.coords.w_rs_old&&(this.target="base",this.is_resize=!0);if(this.coords.w_rs!==this.coords.w_rs_old||this.force_redraw)this.setMinMax(),
this.calc(!0),this.drawLabels(),this.options.grid&&(this.calcGridMargin(),this.calcGridLabels()),this.force_redraw=!0,this.coords.w_rs_old=this.coords.w_rs,this.drawShadow();if(this.coords.w_rs&&(this.dragging||this.force_redraw||this.is_key)){if(this.old_from!==this.result.from||this.old_to!==this.result.to||this.force_redraw||this.is_key){this.drawLabels();this.$cache.bar[0].style.left=this.coords.p_bar_x+"%";this.$cache.bar[0].style.width=this.coords.p_bar_w+"%";if("single"===this.options.type)this.$cache.s_single[0].style.left=
this.coords.p_single_fake+"%",this.$cache.single[0].style.left=this.labels.p_single_left+"%",this.options.values.length?this.$cache.input.prop("value",this.result.from_value):this.$cache.input.prop("value",this.result.from),this.$cache.input.data("from",this.result.from);else{this.$cache.s_from[0].style.left=this.coords.p_from_fake+"%";this.$cache.s_to[0].style.left=this.coords.p_to_fake+"%";if(this.old_from!==this.result.from||this.force_redraw)this.$cache.from[0].style.left=this.labels.p_from_left+
"%";if(this.old_to!==this.result.to||this.force_redraw)this.$cache.to[0].style.left=this.labels.p_to_left+"%";this.$cache.single[0].style.left=this.labels.p_single_left+"%";this.options.values.length?this.$cache.input.prop("value",this.result.from_value+this.options.input_values_separator+this.result.to_value):this.$cache.input.prop("value",this.result.from+this.options.input_values_separator+this.result.to);this.$cache.input.data("from",this.result.from);this.$cache.input.data("to",this.result.to)}this.old_from===
this.result.from&&this.old_to===this.result.to||this.is_start||this.$cache.input.trigger("change");this.old_from=this.result.from;this.old_to=this.result.to;this.is_resize||this.is_update||this.is_start||this.is_finish||this.callOnChange();if(this.is_key||this.is_click)this.is_click=this.is_key=!1,this.callOnFinish();this.is_finish=this.is_resize=this.is_update=!1}this.force_redraw=this.is_click=this.is_key=this.is_start=!1}}},drawLabels:function(){if(this.options){var a=this.options.values.length,
b=this.options.p_values,d;if(!this.options.hide_from_to)if("single"===this.options.type)a=a?this.decorate(b[this.result.from]):this.decorate(this._prettify(this.result.from),this.result.from),this.$cache.single.html(a),this.calcLabels(),this.$cache.min[0].style.visibility=this.labels.p_single_left<this.labels.p_min+1?"hidden":"visible",this.$cache.max[0].style.visibility=this.labels.p_single_left+this.labels.p_single_fake>100-this.labels.p_max-1?"hidden":"visible";else{a?(this.options.decorate_both?
(a=this.decorate(b[this.result.from]),a+=this.options.values_separator,a+=this.decorate(b[this.result.to])):a=this.decorate(b[this.result.from]+this.options.values_separator+b[this.result.to]),d=this.decorate(b[this.result.from]),b=this.decorate(b[this.result.to])):(this.options.decorate_both?(a=this.decorate(this._prettify(this.result.from),this.result.from),a+=this.options.values_separator,a+=this.decorate(this._prettify(this.result.to),this.result.to)):a=this.decorate(this._prettify(this.result.from)+
this.options.values_separator+this._prettify(this.result.to),this.result.to),d=this.decorate(this._prettify(this.result.from),this.result.from),b=this.decorate(this._prettify(this.result.to),this.result.to));this.$cache.single.html(a);this.$cache.from.html(d);this.$cache.to.html(b);this.calcLabels();b=Math.min(this.labels.p_single_left,this.labels.p_from_left);a=this.labels.p_single_left+this.labels.p_single_fake;d=this.labels.p_to_left+this.labels.p_to_fake;var c=Math.max(a,d);this.labels.p_from_left+
this.labels.p_from_fake>=this.labels.p_to_left?(this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",this.$cache.single[0].style.visibility="visible",this.result.from===this.result.to?("from"===this.target?this.$cache.from[0].style.visibility="visible":"to"===this.target&&(this.$cache.to[0].style.visibility="visible"),this.$cache.single[0].style.visibility="hidden",c=d):(this.$cache.from[0].style.visibility="hidden",this.$cache.to[0].style.visibility="hidden",
this.$cache.single[0].style.visibility="visible",c=Math.max(a,d))):(this.$cache.from[0].style.visibility="visible",this.$cache.to[0].style.visibility="visible",this.$cache.single[0].style.visibility="hidden");this.$cache.min[0].style.visibility=b<this.labels.p_min+1?"hidden":"visible";this.$cache.max[0].style.visibility=c>100-this.labels.p_max-1?"hidden":"visible"}}},drawShadow:function(){var a=this.options,b=this.$cache,d="number"===typeof a.from_min&&!isNaN(a.from_min),c="number"===typeof a.from_max&&
!isNaN(a.from_max),e="number"===typeof a.to_min&&!isNaN(a.to_min),g="number"===typeof a.to_max&&!isNaN(a.to_max);"single"===a.type?a.from_shadow&&(d||c)?(d=this.convertToPercent(d?a.from_min:a.min),c=this.convertToPercent(c?a.from_max:a.max)-d,d=this.toFixed(d-this.coords.p_handle/100*d),c=this.toFixed(c-this.coords.p_handle/100*c),d+=this.coords.p_handle/2,b.shad_single[0].style.display="block",b.shad_single[0].style.left=d+"%",b.shad_single[0].style.width=c+"%"):b.shad_single[0].style.display="none":
(a.from_shadow&&(d||c)?(d=this.convertToPercent(d?a.from_min:a.min),c=this.convertToPercent(c?a.from_max:a.max)-d,d=this.toFixed(d-this.coords.p_handle/100*d),c=this.toFixed(c-this.coords.p_handle/100*c),d+=this.coords.p_handle/2,b.shad_from[0].style.display="block",b.shad_from[0].style.left=d+"%",b.shad_from[0].style.width=c+"%"):b.shad_from[0].style.display="none",a.to_shadow&&(e||g)?(e=this.convertToPercent(e?a.to_min:a.min),a=this.convertToPercent(g?a.to_max:a.max)-e,e=this.toFixed(e-this.coords.p_handle/
100*e),a=this.toFixed(a-this.coords.p_handle/100*a),e+=this.coords.p_handle/2,b.shad_to[0].style.display="block",b.shad_to[0].style.left=e+"%",b.shad_to[0].style.width=a+"%"):b.shad_to[0].style.display="none")},callOnStart:function(){if(this.options.onStart&&"function"===typeof this.options.onStart)this.options.onStart(this.result)},callOnChange:function(){if(this.options.onChange&&"function"===typeof this.options.onChange)this.options.onChange(this.result)},callOnFinish:function(){if(this.options.onFinish&&
"function"===typeof this.options.onFinish)this.options.onFinish(this.result)},callOnUpdate:function(){if(this.options.onUpdate&&"function"===typeof this.options.onUpdate)this.options.onUpdate(this.result)},toggleInput:function(){this.$cache.input.toggleClass("irs-hidden-input")},convertToPercent:function(a,b){var d=this.options.max-this.options.min;return d?this.toFixed((b?a:a-this.options.min)/(d/100)):(this.no_diapason=!0,0)},convertToValue:function(a){var b=this.options.min,d=this.options.max,
c=b.toString().split(".")[1],e=d.toString().split(".")[1],g,l,k=0,f=0;if(0===a)return this.options.min;if(100===a)return this.options.max;c&&(k=g=c.length);e&&(k=l=e.length);g&&l&&(k=g>=l?g:l);0>b&&(f=Math.abs(b),b=+(b+f).toFixed(k),d=+(d+f).toFixed(k));a=(d-b)/100*a+b;(b=this.options.step.toString().split(".")[1])?a=+a.toFixed(b.length):(a/=this.options.step,a*=this.options.step,a=+a.toFixed(0));f&&(a-=f);f=b?+a.toFixed(b.length):this.toFixed(a);f<this.options.min?f=this.options.min:f>this.options.max&&
(f=this.options.max);return f},calcWithStep:function(a){var b=Math.round(a/this.coords.p_step)*this.coords.p_step;100<b&&(b=100);100===a&&(b=100);return this.toFixed(b)},checkMinInterval:function(a,b,d){var c=this.options;if(!c.min_interval)return a;a=this.convertToValue(a);b=this.convertToValue(b);"from"===d?b-a<c.min_interval&&(a=b-c.min_interval):a-b<c.min_interval&&(a=b+c.min_interval);return this.convertToPercent(a)},checkMaxInterval:function(a,b,d){var c=this.options;if(!c.max_interval)return a;
a=this.convertToValue(a);b=this.convertToValue(b);"from"===d?b-a>c.max_interval&&(a=b-c.max_interval):a-b>c.max_interval&&(a=b+c.max_interval);return this.convertToPercent(a)},checkDiapason:function(a,b,d){a=this.convertToValue(a);var c=this.options;"number"!==typeof b&&(b=c.min);"number"!==typeof d&&(d=c.max);a<b&&(a=b);a>d&&(a=d);return this.convertToPercent(a)},toFixed:function(a){a=a.toFixed(9);return+a},_prettify:function(a){return this.options.prettify_enabled?this.options.prettify&&"function"===
typeof this.options.prettify?this.options.prettify(a):this.prettify(a):a},prettify:function(a){return a.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,"$1"+this.options.prettify_separator)},checkEdges:function(a,b){if(!this.options.force_edges)return this.toFixed(a);0>a?a=0:a>100-b&&(a=100-b);return this.toFixed(a)},validate:function(){var a=this.options,b=this.result,d=a.values,c=d.length,e,g;"string"===typeof a.min&&(a.min=+a.min);"string"===typeof a.max&&(a.max=+a.max);"string"===typeof a.from&&
(a.from=+a.from);"string"===typeof a.to&&(a.to=+a.to);"string"===typeof a.step&&(a.step=+a.step);"string"===typeof a.from_min&&(a.from_min=+a.from_min);"string"===typeof a.from_max&&(a.from_max=+a.from_max);"string"===typeof a.to_min&&(a.to_min=+a.to_min);"string"===typeof a.to_max&&(a.to_max=+a.to_max);"string"===typeof a.keyboard_step&&(a.keyboard_step=+a.keyboard_step);"string"===typeof a.grid_num&&(a.grid_num=+a.grid_num);a.max<a.min&&(a.max=a.min);if(c)for(a.p_values=[],a.min=0,a.max=c-1,a.step=
1,a.grid_num=a.max,a.grid_snap=!0,g=0;g<c;g++)e=+d[g],isNaN(e)?e=d[g]:(d[g]=e,e=this._prettify(e)),a.p_values.push(e);if("number"!==typeof a.from||isNaN(a.from))a.from=a.min;if("number"!==typeof a.to||isNaN(a.from))a.to=a.max;if("single"===a.type)a.from<a.min&&(a.from=a.min),a.from>a.max&&(a.from=a.max);else{if(a.from<a.min||a.from>a.max)a.from=a.min;if(a.to>a.max||a.to<a.min)a.to=a.max;a.from>a.to&&(a.from=a.to)}if("number"!==typeof a.step||isNaN(a.step)||!a.step||0>a.step)a.step=1;if("number"!==
typeof a.keyboard_step||isNaN(a.keyboard_step)||!a.keyboard_step||0>a.keyboard_step)a.keyboard_step=5;"number"===typeof a.from_min&&a.from<a.from_min&&(a.from=a.from_min);"number"===typeof a.from_max&&a.from>a.from_max&&(a.from=a.from_max);"number"===typeof a.to_min&&a.to<a.to_min&&(a.to=a.to_min);"number"===typeof a.to_max&&a.from>a.to_max&&(a.to=a.to_max);if(b){b.min!==a.min&&(b.min=a.min);b.max!==a.max&&(b.max=a.max);if(b.from<b.min||b.from>b.max)b.from=a.from;if(b.to<b.min||b.to>b.max)b.to=a.to}if("number"!==
typeof a.min_interval||isNaN(a.min_interval)||!a.min_interval||0>a.min_interval)a.min_interval=0;if("number"!==typeof a.max_interval||isNaN(a.max_interval)||!a.max_interval||0>a.max_interval)a.max_interval=0;a.min_interval&&a.min_interval>a.max-a.min&&(a.min_interval=a.max-a.min);a.max_interval&&a.max_interval>a.max-a.min&&(a.max_interval=a.max-a.min)},decorate:function(a,b){var d="",c=this.options;c.prefix&&(d+=c.prefix);d+=a;c.max_postfix&&(c.values.length&&a===c.p_values[c.max]?(d+=c.max_postfix,
c.postfix&&(d+=" ")):b===c.max&&(d+=c.max_postfix,c.postfix&&(d+=" ")));c.postfix&&(d+=c.postfix);return d},updateFrom:function(){this.result.from=this.options.from;this.result.from_percent=this.convertToPercent(this.result.from);this.options.values&&(this.result.from_value=this.options.values[this.result.from])},updateTo:function(){this.result.to=this.options.to;this.result.to_percent=this.convertToPercent(this.result.to);this.options.values&&(this.result.to_value=this.options.values[this.result.to])},
updateResult:function(){this.result.min=this.options.min;this.result.max=this.options.max;this.updateFrom();this.updateTo()},appendGrid:function(){if(this.options.grid){var a=this.options,b,d;b=a.max-a.min;var c=a.grid_num,e=0,g=0,f=4,k,h,m=0,n="";this.calcGridMargin();a.grid_snap?(c=b/a.step,e=this.toFixed(a.step/(b/100))):e=this.toFixed(100/c);4<c&&(f=3);7<c&&(f=2);14<c&&(f=1);28<c&&(f=0);for(b=0;b<c+1;b++){k=f;g=this.toFixed(e*b);100<g&&(g=100,k-=2,0>k&&(k=0));this.coords.big[b]=g;h=(g-e*(b-1))/
(k+1);for(d=1;d<=k&&0!==g;d++)m=this.toFixed(g-h*d),n+='<span class="irs-grid-pol small" style="left: '+m+'%"></span>';n+='<span class="irs-grid-pol" style="left: '+g+'%"></span>';m=this.convertToValue(g);m=a.values.length?a.p_values[m]:this._prettify(m);n+='<span class="irs-grid-text js-grid-text-'+b+'" style="left: '+g+'%">'+m+"</span>"}this.coords.big_num=Math.ceil(c+1);this.$cache.cont.addClass("irs-with-grid");this.$cache.grid.html(n);this.cacheGridLabels()}},cacheGridLabels:function(){var a,
b,d=this.coords.big_num;for(b=0;b<d;b++)a=this.$cache.grid.find(".js-grid-text-"+b),this.$cache.grid_labels.push(a);this.calcGridLabels()},calcGridLabels:function(){var a,b;b=[];var d=[],c=this.coords.big_num;for(a=0;a<c;a++)this.coords.big_w[a]=this.$cache.grid_labels[a].outerWidth(!1),this.coords.big_p[a]=this.toFixed(this.coords.big_w[a]/this.coords.w_rs*100),this.coords.big_x[a]=this.toFixed(this.coords.big_p[a]/2),b[a]=this.toFixed(this.coords.big[a]-this.coords.big_x[a]),d[a]=this.toFixed(b[a]+
this.coords.big_p[a]);this.options.force_edges&&(b[0]<-this.coords.grid_gap&&(b[0]=-this.coords.grid_gap,d[0]=this.toFixed(b[0]+this.coords.big_p[0]),this.coords.big_x[0]=this.coords.grid_gap),d[c-1]>100+this.coords.grid_gap&&(d[c-1]=100+this.coords.grid_gap,b[c-1]=this.toFixed(d[c-1]-this.coords.big_p[c-1]),this.coords.big_x[c-1]=this.toFixed(this.coords.big_p[c-1]-this.coords.grid_gap)));this.calcGridCollision(2,b,d);this.calcGridCollision(4,b,d);for(a=0;a<c;a++)b=this.$cache.grid_labels[a][0],
b.style.marginLeft=-this.coords.big_x[a]+"%"},calcGridCollision:function(a,b,d){var c,e,g,f=this.coords.big_num;for(c=0;c<f;c+=a){e=c+a/2;if(e>=f)break;g=this.$cache.grid_labels[e][0];g.style.visibility=d[c]<=b[e]?"visible":"hidden"}},calcGridMargin:function(){this.options.grid_margin&&(this.coords.w_rs=this.$cache.rs.outerWidth(!1),this.coords.w_rs&&(this.coords.w_handle="single"===this.options.type?this.$cache.s_single.outerWidth(!1):this.$cache.s_from.outerWidth(!1),this.coords.p_handle=this.toFixed(this.coords.w_handle/
this.coords.w_rs*100),this.coords.grid_gap=this.toFixed(this.coords.p_handle/2-.1),this.$cache.grid[0].style.width=this.toFixed(100-this.coords.p_handle)+"%",this.$cache.grid[0].style.left=this.coords.grid_gap+"%"))},update:function(a){this.input&&(this.is_update=!0,this.options.from=this.result.from,this.options.to=this.result.to,this.options=f.extend(this.options,a),this.validate(),this.updateResult(a),this.toggleInput(),this.remove(),this.init(!0))},reset:function(){this.input&&(this.updateResult(),
this.update())},destroy:function(){this.input&&(this.toggleInput(),this.$cache.input.prop("readonly",!1),f.data(this.input,"ionRangeSlider",null),this.remove(),this.options=this.input=null)}};f.fn.ionRangeSlider=function(a){return this.each(function(){f.data(this,"ionRangeSlider")||f.data(this,"ionRangeSlider",new q(this,a,u++))})};(function(){for(var a=0,b=["ms","moz","webkit","o"],d=0;d<b.length&&!h.requestAnimationFrame;++d)h.requestAnimationFrame=h[b[d]+"RequestAnimationFrame"],h.cancelAnimationFrame=
h[b[d]+"CancelAnimationFrame"]||h[b[d]+"CancelRequestAnimationFrame"];h.requestAnimationFrame||(h.requestAnimationFrame=function(b,d){var g=(new Date).getTime(),f=Math.max(0,16-(g-a)),k=h.setTimeout(function(){b(g+f)},f);a=g+f;return k});h.cancelAnimationFrame||(h.cancelAnimationFrame=function(a){clearTimeout(a)})})()})(jQuery,document,window,navigator);

!function(){
    function t(){}
    function e(t){
        var e=U.call(arguments,1);
        return function(){
            return t.apply(this,e)
        }
    }
    function n(t,e){
        if(!e)throw new Error("prayer failed: "+t)
    }
    function i(t){
        n("a direction was passed",t===G||t===X)
    }
    function r(e,n,i,r){
        function s(){
            u=a;var t=c.selection?"$"+c.selection.latex()+"$":"";d.select(t)
        }
        function o(){
            h.detach(),l.focused=!1
        }
        var c,h,l,u,p,f,d,m=e.contents().detach();
        return i||e.addClass("mathquill-rendered-math"),
            n.jQ=e.attr(F,n.id),
            n.revert=function(){
            e.empty().unbind(".mathquill").removeClass("mathquill-rendered-math mathquill-editable mathquill-textbox").append(m)
            },
            c=n.cursor=I(n),
            n.renderLatex(m.text()),
            h=n.textarea=Z('<span class="textarea"><textarea></textarea></span>'),
            l=h.children(),
            n.selectionChanged=function(){
                u===a&&(u=setTimeout(s)),ue(e[0])
            },
            e.bind("selectstart.mathquill",function(t){
                t.target!==l[0]&&t.preventDefault(),t.stopPropagation()}
            ),
            f=c.blink,
            e.bind("mousedown.mathquill",function(n){
                function i(t){
                    return c.seek(Z(t.target),t.pageX,t.pageY),(c[G]!==p[G]||c.parent!==p.parent)&&c.selectFrom(p),!1
                }
                function s(t){
                    return delete t.target,i(t)
                }
                function o(t){
                    p=a,c.blink=f,c.selection||(r?c.show():h.detach()),e.unbind("mousemove",i),Z(t.target.ownerDocument).unbind("mousemove",s).unbind("mouseup",o)
                }
                return setTimeout(function(){
                    l.focus(),l.focused=!0
                }),
                    c.blink=t,
                    c.seek(Z(n.target),n.pageX,n.pageY),
                    p=Y(c.parent,c[G],c[X]),r||l.focused||e.prepend(h),e.mousemove(i),
                    Z(n.target.ownerDocument).mousemove(s).mouseup(o),
                    !1
            }),
            r?(d=K(l,{container:e,key:function(t,e){c.parent.bubble("onKey",t,e)},text:function(t){c.parent.bubble("onText",t)},cut:function(t){c.selection&&setTimeout(function(){c.prepareEdit(),c.parent.bubble("redraw")}),t.stopPropagation()},paste:function(t){t="$"===t.slice(0,1)&&"$"===t.slice(-1)?t.slice(1,-1):"\\text{"+t+"}",c.writeLatex(t).show()}}),e.prepend(h),e.addClass("mathquill-editable"),i&&e.addClass("mathquill-textbox"),l.focus(function(t){c.parent||c.insAtRightEnd(n),c.parent.jQ.addClass("hasCursor"),c.selection?(c.selection.jQ.removeClass("blur"),setTimeout(n.selectionChanged)):c.show(),t.stopPropagation()}).blur(function(t){c.hide().parent.blur(),c.selection&&c.selection.jQ.addClass("blur"),t.stopPropagation()}),void e.bind("focus.mathquill blur.mathquill",function(t){l.trigger(t)}).blur()):(d=K(l,{container:e}),e.bind("cut paste",!1).bind("copy",s).prepend('<span class="selectable">$'+n.latex()+"$</span>"),void l.blur(function(){c.clearSelection(),setTimeout(o)}))}function s(t,e,n){return H(q,{ctrlSeq:t,htmlTemplate:"<"+e+" "+n+">&0</"+e+">"})}var a,o,c,h,l,u,p,f,d,m,g,b,v,w,x,j,k,q,y,Q,C,S,L,D,O,E,A,R,T,z,$,B,I,_,W=window.jQuery,M="mathquill-command-id",F="mathquill-block-id",P=Math.min,U=(Math.max,[].slice),H=function(t,e,n){function i(t){return"object"==typeof t}function r(t){return"function"==typeof t}function s(){}return function a(o,c){function h(){var t=new l;return r(t.init)&&t.init.apply(t,arguments),t}function l(){}var u,p,f;return c===n&&(c=o,o=Object),h.Bare=l,u=s[t]=o[t],p=l[t]=h[t]=h.p=new s,p.constructor=h,h.mixin=function(e){return l[t]=h[t]=a(h,e)[t],h},(h.open=function(t){if(f={},r(t)?f=t.call(h,p,u,h,o):i(t)&&(f=t),i(f))for(var n in f)e.call(f,n)&&(p[n]=f[n]);return r(p.init)||(p.init=o),h})(c)}}("prototype",{}.hasOwnProperty),K=function(){function e(t){var e,i=t.which||t.keyCode,r=n[i],s=[];return t.ctrlKey&&s.push("Ctrl"),t.originalEvent&&t.originalEvent.metaKey&&s.push("Meta"),t.altKey&&s.push("Alt"),t.shiftKey&&s.push("Shift"),e=r||String.fromCharCode(i),s.length||r?(s.push(e),s.join("-")):e}var n={8:"Backspace",9:"Tab",10:"Enter",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Esc",32:"Spacebar",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Del",144:"NumLock"};return function(n,i){function r(t){j=t,clearTimeout(k),k=setTimeout(t)}function s(e){j(),j=t,clearTimeout(k),w.val(e),e&&w[0].select()}function a(){var t=w[0];return"selectionStart"in t?t.selectionStart!==t.selectionEnd:!1}function o(t){var e=w.val();w.val(""),e&&t(e)}function c(){g(e(q),q)}function h(t){q=t,y=null,c()}function l(t){q&&y&&c(),y=t,r(u)}function u(){a()||o(m)}function p(){q=y=null}function f(){w.focus(),r(d)}function d(){o(b)}var m,g,b,v,w,x,j,k,q=null,y=null;return i||(i={}),m=i.text||t,g=i.key||t,b=i.paste||t,v=i.cut||t,w=W(n),x=W(i.container||w),j=t,x.bind("keydown keypress input keyup focusout paste",function(){j()}),x.bind({keydown:h,keypress:l,focusout:p,cut:v,paste:f}),{select:s}}}(),N=H(function(t,e,i){function r(t,e){throw t=t?"'"+t+"'":"EOF","Parse Error: "+e+" at "+t}var s,a,o,c,h,l,u,p,f,d,m,g,b;t.init=function(t){this._=t},t.parse=function(t){function e(t,e){return e}return this.skip(b)._(t,e,r)},t.or=function(t){n("or is passed a parser",t instanceof i);var e=this;return i(function(n,i,r){function s(){return t._(n,i,r)}return e._(n,i,s)})},t.then=function(t){var e=this;return i(function(r,s,a){function o(e,r){var o=t instanceof i?t:t(r);return n("a parser is returned",o instanceof i),o._(e,s,a)}return e._(r,o,a)})},t.many=function(){var t=this;return i(function(e,n){function i(t,n){return e=t,s.push(n),!0}function r(){return!1}for(var s=[];t._(e,i,r););return n(e,s)})},t.times=function(t,e){arguments.length<2&&(e=t);var n=this;return i(function(i,r,s){function a(t,e){return u.push(e),i=t,!0}function o(t,e){return h=e,i=t,!1}function c(){return!1}var h,l,u=[],p=!0;for(l=0;t>l;l+=1)if(p=n._(i,a,o),!p)return s(i,h);for(;e>l&&p;l+=1)p=n._(i,a,c);return r(i,u)})},t.result=function(t){return this.then(o(t))},t.atMost=function(t){return this.times(0,t)},t.atLeast=function(t){var e=this;return e.times(t).then(function(t){return e.many().map(function(e){return t.concat(e)})})},t.map=function(t){return this.then(function(e){return o(t(e))})},t.skip=function(t){return this.then(function(e){return t.result(e)})},s=this.string=function(t){var e=t.length,n="expected '"+t+"'";return i(function(i,r,s){var a=i.slice(0,e);return a===t?r(i.slice(e),a):s(i,n)})},a=this.regex=function(t){n("regexp parser is anchored","^"===t.toString().charAt(1));var e="expected "+t;return i(function(n,i,r){var s,a=t.exec(n);return a?(s=a[0],i(n.slice(s.length),s)):r(n,e)})},o=i.succeed=function(t){return i(function(e,n){return n(e,t)})},c=i.fail=function(t){return i(function(e,n,i){return i(e,t)})},h=i.letter=a(/^[a-z]/i),l=i.letters=a(/^[a-z]*/i),u=i.digit=a(/^[0-9]/),p=i.digits=a(/^[0-9]*/),f=i.whitespace=a(/^\s+/),d=i.optWhitespace=a(/^\s*/),m=i.any=i(function(t,e,n){return t?e(t.slice(1),t.charAt(0)):n(t,"expected any character")}),g=i.all=i(function(t,e){return e("",t)}),b=i.eof=i(function(t,e,n){return t?n(t,"expected EOF"):e(t,t)})}),G=-1,X=1,Z=H(W,function(t){t.insDirOf=function(t,e){return t===G?this.insertBefore(e.first()):this.insertAfter(e.last())},t.insAtDirEnd=function(t,e){return t===G?this.prependTo(e):this.appendTo(e)}}),Y=H(function(t){t.parent=0,t[G]=0,t[X]=0,t.init=function(t,e,n){this.parent=t,this[G]=e,this[X]=n}}),J=H(function(t){t[G]=0,t[X]=0,t.parent=0,t.init=function(){this.ends={},this.ends[G]=0,this.ends[X]=0},t.children=function(){return V(this.ends[G],this.ends[X])},t.eachChild=function(t){return this.children().each(t)},t.foldChildren=function(t,e){return this.children().fold(t,e)},t.adopt=function(t,e,n){return V(this,this).adopt(t,e,n),this},t.disown=function(){return V(this,this).disown(),this}}),V=H(function(t){function e(t,e,i){n("a parent is always present",t),n("leftward is properly set up",function(){return e?e[X]===i&&e.parent===t:t.ends[G]===i}()),n("rightward is properly set up",function(){return i?i[G]===e&&i.parent===t:t.ends[X]===e}())}t.init=function(t,e){n("no half-empty fragments",!t==!e),this.ends={},t&&(n("left end node is passed to Fragment",t instanceof J),n("right end node is passed to Fragment",e instanceof J),n("leftEnd and rightEnd have the same parent",t.parent===e.parent),this.ends[G]=t,this.ends[X]=e)},t.adopt=function(t,n,i){var r,s,a;return e(t,n,i),r=this,r.disowned=!1,(s=r.ends[G])?(a=r.ends[X],n||(t.ends[G]=s),i?i[G]=a:t.ends[X]=a,r.ends[X][X]=i,r.each(function(e){e[G]=n,e.parent=t,n&&(n[X]=e),n=e}),r):this},t.disown=function(){var t,n,i=this,r=i.ends[G];return!r||i.disowned?i:(i.disowned=!0,t=i.ends[X],n=r.parent,e(n,r[G],r),e(n,t,t[X]),r[G]?r[G][X]=t[X]:n.ends[G]=t[X],t[X]?t[X][G]=r[G]:n.ends[X]=r[G],i)},t.each=function(t){var e=this,n=e.ends[G];if(!n)return e;for(;n!==e.ends[X][X]&&t.call(e,n)!==!1;n=n[X]);return e},t.fold=function(t,e){return this.each(function(n){t=e.call(this,t,n)}),t}}),te=function(){var t=0;return function(){return t+=1}}(),ee=H(J,function(t,e){t.init=function(){e.init.call(this),this.id=te(),ee[this.id]=this},t.toString=function(){return"[MathElement "+this.id+"]"},t.bubble=function(t){var e,n,i=U.call(arguments,1);for(e=this;e&&(n=e[t]&&e[t].apply(e,i),n!==!1);e=e.parent);return this},t.postOrder=function(t){var e,n=U.call(arguments,1);"string"==typeof t&&(e=t,t=function(t){e in t&&t[e].apply(t,n)}),function i(e){e.eachChild(i),t(e)}(this)},t.jQ=Z(),t.jQadd=function(t){this.jQ=this.jQ.add(t)},this.jQize=function(t){var e=Z(t);return e.find("*").andSelf().each(function(){var t=Z(this),e=t.attr("mathquill-command-id"),n=t.attr("mathquill-block-id");e&&ee[e].jQadd(t),n&&ee[n].jQadd(t)}),e},t.finalizeInsert=function(){var t=this;t.postOrder("finalizeTree"),t.postOrder("blur"),t.postOrder("respace"),t[X].respace&&t[X].respace(),t[G].respace&&t[G].respace(),t.postOrder("redraw"),t.bubble("redraw")}}),ne=H(ee,function(e,i){e.init=function(t,e,n){var r=this;i.init.call(r),r.ctrlSeq||(r.ctrlSeq=t),e&&(r.htmlTemplate=e),n&&(r.textTemplate=n)},e.replaces=function(t){t.disown(),this.replacedFragment=t},e.isEmpty=function(){return this.foldChildren(!0,function(t,e){return t&&e.isEmpty()})},e.parser=function(){var t=B.block,e=this;return t.times(e.numBlocks()).map(function(t){e.blocks=t;for(var n=0;n<t.length;n+=1)t[n].adopt(e,e.ends[X],0);return e})},e.createLeftOf=function(t){var e=this,n=e.replacedFragment;e.createBlocks(),ee.jQize(e.html()),n&&(n.adopt(e.ends[G],0,0),n.jQ.appendTo(e.ends[G].jQ)),t.jQ.before(e.jQ),t[G]=e.adopt(t.parent,t[G],t[X]),e.finalizeInsert(t),e.placeCursor(t)},e.createBlocks=function(){var t,e,n=this,i=n.numBlocks(),r=n.blocks=Array(i);for(t=0;i>t;t+=1)e=r[t]=re(),e.adopt(n,n.ends[X],0)},e.respace=t,e.placeCursor=function(t){t.insAtRightEnd(this.foldChildren(this.ends[G],function(t,e){return t.isEmpty()?t:e}))},e.remove=function(){return this.disown(),this.jQ.remove(),this.postOrder(function(t){delete ee[t.id]}),this},e.numBlocks=function(){var t=this.htmlTemplate.match(/&\d+/g);return t?t.length:0},e.html=function(){var t,e,i,r=this,s=r.blocks,a=" mathquill-command-id="+r.id,o=r.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);for(n("no unmatched angle brackets",o.join("")===this.htmlTemplate),t=0,e=o[0];e;t+=1,e=o[t])if("/>"===e.slice(-2))o[t]=e.slice(0,-2)+a+"/>";else if("<"===e.charAt(0)){n("not an unmatched top-level close tag","/"!==e.charAt(1)),o[t]=e.slice(0,-1)+a+">",i=1;do t+=1,e=o[t],n("no missing close tags",e),"</"===e.slice(0,2)?i-=1:"<"===e.charAt(0)&&"/>"!==e.slice(-2)&&(i+=1);while(i>0)}return o.join("").replace(/>&(\d+)/g,function(t,e){return" mathquill-block-id="+s[e].id+">"+s[e].join("html")})},e.latex=function(){return this.foldChildren(this.ctrlSeq,function(t,e){return t+"{"+(e.latex()||" ")+"}"})},e.textTemplate=[""],e.text=function(){var t=this,e=0;return t.foldChildren(t.textTemplate[e],function(n,i){e+=1;var r=i.text();return n&&"("===t.textTemplate[e]&&"("===r[0]&&")"===r.slice(-1)?n+r.slice(1,-1)+t.textTemplate[e]:n+i.text()+(t.textTemplate[e]||"")})}}),ie=H(ne,function(e,n){e.init=function(t,e,i){i||(i=t&&t.length>1?t.slice(1):t),n.init.call(this,t,e,[i])},e.parser=function(){return N.succeed(this)},e.numBlocks=function(){return 0},e.replaces=function(t){t.remove()},e.createBlocks=t,e.latex=function(){return this.ctrlSeq},e.text=function(){return this.textTemplate},e.placeCursor=t,e.isEmpty=function(){return!0}}),re=H(ee,function(t){t.join=function(t){return this.foldChildren("",function(e,n){return e+n[t]()})},t.latex=function(){return this.join("latex")},t.text=function(){return this.ends[G]===this.ends[X]?this.ends[G].text():"("+this.join("text")+")"},t.isEmpty=function(){return 0===this.ends[G]&&0===this.ends[X]},t.write=function(t,e,n){var i;i=e.match(/^[a-eg-zA-Z]$/)?D(e):(i=he[e]||le[e])?i(e):O(e),n&&i.replaces(n),i.createLeftOf(t)},t.focus=function(){return this.jQ.addClass("hasCursor"),this.jQ.removeClass("empty"),this},t.blur=function(){return this.jQ.removeClass("hasCursor"),this.isEmpty()&&this.jQ.addClass("empty"),this}}),se=H(V,function(t,e){t.init=function(t,n){e.init.call(this,t,n||t),this.jQ=this.fold(Z(),function(t,e){return e.jQ.add(t)})},t.latex=function(){return this.fold("",function(t,e){return t+e.latex()})},t.remove=function(){return this.jQ.remove(),this.each(function(t){t.postOrder(function(t){delete ee[t.id]})}),this.disown()}}),ae=H(re,function(t,e){t.latex=function(){return e.latex.call(this).replace(/(\\[a-z]+) (?![a-z])/gi,"$1")},t.text=function(){return this.foldChildren("",function(t,e){return t+e.text()})},t.renderLatex=function(t){var e=this.jQ;e.children().slice(1).remove(),this.ends[G]=this.ends[X]=0,delete this.cursor.selection,this.cursor.insAtRightEnd(this).writeLatex(t)},t.onKey=function(t,e){var n;switch(t){case"Ctrl-Shift-Backspace":case"Ctrl-Backspace":for(;this.cursor[G]||this.cursor.selection;)this.cursor.backspace();break;case"Shift-Backspace":case"Backspace":this.cursor.backspace();break;case"Esc":case"Tab":case"Spacebar":if(n=this.cursor.parent,n===this.cursor.root)return void("Spacebar"===t&&e.preventDefault());this.cursor.prepareMove(),n[X]?this.cursor.insAtLeftEnd(n[X]):this.cursor.insRightOf(n.parent);break;case"Shift-Tab":case"Shift-Esc":case"Shift-Spacebar":if(n=this.cursor.parent,n===this.cursor.root)return void("Shift-Spacebar"===t&&e.preventDefault());this.cursor.prepareMove(),n[G]?this.cursor.insAtRightEnd(n[G]):this.cursor.insLeftOf(n.parent);break;case"Enter":break;case"End":this.cursor.prepareMove().insAtRightEnd(this.cursor.parent);break;case"Ctrl-End":this.cursor.prepareMove().insAtRightEnd(this);break;case"Shift-End":for(;this.cursor[X];)this.cursor.selectRight();break;case"Ctrl-Shift-End":for(;this.cursor[X]||this.cursor.parent!==this;)this.cursor.selectRight();break;case"Home":this.cursor.prepareMove().insAtLeftEnd(this.cursor.parent);break;case"Ctrl-Home":this.cursor.prepareMove().insAtLeftEnd(this);break;case"Shift-Home":for(;this.cursor[G];)this.cursor.selectLeft();break;case"Ctrl-Shift-Home":for(;this.cursor[G]||this.cursor.parent!==this;)this.cursor.selectLeft();break;case"Left":this.cursor.moveLeft();break;case"Shift-Left":this.cursor.selectLeft();break;case"Ctrl-Left":break;case"Right":this.cursor.moveRight();break;case"Shift-Right":this.cursor.selectRight();break;case"Ctrl-Right":break;case"Up":this.cursor.moveUp();break;case"Down":this.cursor.moveDown();break;case"Shift-Up":if(this.cursor[G])for(;this.cursor[G];)this.cursor.selectLeft();else this.cursor.selectLeft();case"Shift-Down":if(this.cursor[X])for(;this.cursor[X];)this.cursor.selectRight();else this.cursor.selectRight();case"Ctrl-Up":break;case"Ctrl-Down":break;case"Ctrl-Shift-Del":case"Ctrl-Del":for(;this.cursor[X]||this.cursor.selection;)this.cursor.deleteForward();break;case"Shift-Del":case"Del":this.cursor.deleteForward();break;case"Meta-A":case"Ctrl-A":if(this!==this.cursor.root)return;for(this.cursor.prepareMove().insAtRightEnd(this);this.cursor[G];)this.cursor.selectLeft();break;default:return!1}return e.preventDefault(),!1},t.onText=function(t){return this.cursor.write(t),!1}}),oe=H(ne,function(t,e){t.init=function(t){e.init.call(this,"$"),this.cursor=t},t.htmlTemplate='<span class="mathquill-rendered-math">&0</span>',t.createBlocks=function(){this.ends[G]=this.ends[X]=ae(),this.blocks=[this.ends[G]],this.ends[G].parent=this,this.ends[G].cursor=this.cursor,this.ends[G].write=function(t,e,n){"$"!==e?re.prototype.write.call(this,t,e,n):this.isEmpty()?(t.insRightOf(this.parent).backspace().show(),O("\\$","$").createLeftOf(t)):t[X]?t[G]?re.prototype.write.call(this,t,e,n):t.insLeftOf(this.parent):t.insRightOf(this.parent)}},t.latex=function(){return"$"+this.ends[G].latex()+"$"}}),ce=H(re,function(t){t.renderLatex=function(t){var e,n,i,r,s,a,o,c,h,l,u,p=this,f=p.cursor;if(p.jQ.children().slice(1).remove(),p.ends[G]=p.ends[X]=0,delete f.selection,f.show().insAtRightEnd(p),e=N.regex,n=N.string,i=N.eof,r=N.all,s=n("$").then(B).skip(n("$").or(i)).map(function(t){var e,n=oe(f);return n.createBlocks(),e=n.ends[G],t.children().adopt(e,0,0),n}),a=n("\\$").result("$"),o=a.or(e(/^[^$]/)).map(O),c=s.or(o).many(),h=c.skip(i).or(r.result(!1)).parse(t)){for(l=0;l<h.length;l+=1)h[l].adopt(p,p.ends[X],0);u=p.join("html"),ee.jQize(u).appendTo(p.jQ),this.finalizeInsert()}},t.onKey=function(t){"Spacebar"!==t&&"Shift-Spacebar"!==t&&ae.prototype.onKey.apply(this,arguments)},t.onText=ae.prototype.onText,t.write=function(t,e,n){if(n&&n.remove(),"$"===e)oe(t).createLeftOf(t);else{var i;"<"===e?i="&lt;":">"===e&&(i="&gt;"),O(e,i).createLeftOf(t)}}}),he={},le={},ue=t,pe=document.createElement("div"),fe=pe.style,de={transform:1,WebkitTransform:1,MozTransform:1,OTransform:1,msTransform:1};for(h in de)if(h in fe){c=h;break}c?o=function(t,e,n){t.css(c,"scale("+e+","+n+")")}:"filter"in fe?(ue=function(t){t.className=t.className},o=function(t,e,n){function i(){t.css("marginRight",(r.width()-1)*(e-1)/e+"px")}var r,s;e/=1+(n-1)/2,t.css("fontSize",n+"em"),t.hasClass("matrixed-container")||t.addClass("matrixed-container").wrapInner('<span class="matrixed"></span>'),r=t.children().css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+e+",SizingMethod='auto expand')"),i(),s=setInterval(i),Z(window).load(function(){clearTimeout(s),i()})}):o=function(t,e,n){t.css("fontSize",n+"em")},l=H(ne,function(t,e){t.init=function(t,n,i){e.init.call(this,t,"<"+n+" "+i+">&0</"+n+">")}}),le.mathrm=e(l,"\\mathrm","span",'class="roman font"'),le.mathit=e(l,"\\mathit","i",'class="font"'),le.mathbf=e(l,"\\mathbf","b",'class="font"'),le.mathsf=e(l,"\\mathsf","span",'class="sans-serif font"'),le.mathtt=e(l,"\\mathtt","span",'class="monospace font"'),le.underline=e(l,"\\underline","span",'class="non-leaf underline"'),le.overline=le.bar=e(l,"\\overline","span",'class="non-leaf overline"'),u=H(ne,function(t,e){t.init=function(t,n,i){e.init.call(this,t,"<"+n+' class="non-leaf">&0</'+n+">",[i])},t.finalizeTree=function(){function t(t){var e=this.parent,n=t;do{if(n[X])return t.insLeftOf(e),!1;n=n.parent.parent}while(n!==e);return t.insRightOf(e),!1}n("SupSub is only _ and ^","^"===this.ctrlSeq||"_"===this.ctrlSeq),"_"===this.ctrlSeq?(this.down=this.ends[G],this.ends[G].up=t):(this.up=this.ends[G],this.ends[G].down=t)},t.latex=function(){var t=this.ends[G].latex();return 1===t.length?this.ctrlSeq+t:this.ctrlSeq+"{"+(t||" ")+"}"},t.redraw=function(){this[G]&&this[G].respace(),this[G]instanceof u||(this.respace(),!this[X]||this[X]instanceof u||this[X].respace())},t.respace=function(){if("\\int "===this[G].ctrlSeq||this[G]instanceof u&&this[G].ctrlSeq!=this.ctrlSeq&&this[G][G]&&"\\int "===this[G][G].ctrlSeq?this.limit||(this.limit=!0,this.jQ.addClass("limit")):this.limit&&(this.limit=!1,this.jQ.removeClass("limit")),this.respaced=this[G]instanceof u&&this[G].ctrlSeq!=this.ctrlSeq&&!this[G].respaced,this.respaced){var t=+this.jQ.css("fontSize").slice(0,-2),e=this[G].jQ.outerWidth(),n=this.jQ.outerWidth();this.jQ.css({left:(this.limit&&"_"===this.ctrlSeq?-.25:0)-e/t+"em",marginRight:.1-P(n,e)/t+"em"})}else this.jQ.css(this.limit&&"_"===this.ctrlSeq?{left:"-.25em",marginRight:""}:{left:"",marginRight:""});return this[X]instanceof u&&this[X].respace(),this}}),le.subscript=le._=e(u,"_","sub","_"),le.superscript=le.supscript=le["^"]=e(u,"^","sup","**"),p=le.frac=le.dfrac=le.cfrac=le.fraction=H(ne,function(t){t.ctrlSeq="\\frac",t.htmlTemplate='<span class="fraction non-leaf"><span class="numerator">&0</span><span class="denominator">&1</span><span style="display:inline-block;width:0">&nbsp;</span></span>',t.textTemplate=["(","/",")"],t.finalizeTree=function(){this.up=this.ends[X].up=this.ends[G],this.down=this.ends[G].down=this.ends[X]}}),f=le.over=he["/"]=H(p,function(t,e){t.createLeftOf=function(t){if(!this.replacedFragment){for(var n=t[G];n&&!(n instanceof R||n instanceof q||n instanceof z||/^[,;:]$/.test(n.ctrlSeq));)n=n[G];n instanceof z&&n[X]instanceof u&&(n=n[X],n[X]instanceof u&&n[X].ctrlSeq!=n.ctrlSeq&&(n=n[X])),n!==t[G]&&(this.replaces(se(n[X]||t.parent.ends[G],t[G])),t[G]=n)}e.createLeftOf.call(this,t)}}),d=le.sqrt=le["√"]=H(ne,function(t,e){t.ctrlSeq="\\sqrt",t.htmlTemplate='<span class="non-leaf"><span class="scaled sqrt-prefix">&radic;</span><span class="non-leaf sqrt-stem">&0</span></span>',t.textTemplate=["sqrt(",")"],t.parser=function(){return B.optBlock.then(function(t){return B.block.map(function(e){var n=g();return n.blocks=[t,e],t.adopt(n,0,0),e.adopt(n,t,0),n})}).or(e.parser.call(this))},t.redraw=function(){var t=this.ends[X].jQ;o(t.prev(),1,t.innerHeight()/+t.css("fontSize").slice(0,-2)-.1)}}),m=le.vec=H(ne,function(t){t.ctrlSeq="\\vec",t.htmlTemplate='<span class="non-leaf"><span class="vector-prefix">&rarr;</span><span class="vector-stem">&0</span></span>',t.textTemplate=["vec(",")"]}),g=le.nthroot=H(d,function(t){t.htmlTemplate='<sup class="nthroot non-leaf">&0</sup><span class="scaled"><span class="sqrt-prefix scaled">&radic;</span><span class="sqrt-stem non-leaf">&1</span></span>',t.textTemplate=["sqrt[","](",")"],t.latex=function(){return"\\sqrt["+this.ends[G].latex()+"]{"+this.ends[X].latex()+"}"}}),b=H(ne,function(t,e){t.init=function(t,n,i,r){e.init.call(this,"\\left"+i,'<span class="non-leaf"><span class="scaled paren">'+t+'</span><span class="non-leaf">&0</span><span class="scaled paren">'+n+"</span></span>",[t,n]),this.end="\\right"+r},t.jQadd=function(){e.jQadd.apply(this,arguments);var t=this.jQ;this.bracketjQs=t.children(":first").add(t.children(":last"))},t.latex=function(){return this.ctrlSeq+this.ends[G].latex()+this.end},t.redraw=function(){var t=this.ends[G].jQ,e=t.outerHeight()/+t.css("fontSize").slice(0,-2);o(this.bracketjQs,P(1+.2*(e-1),1.2),1.05*e)}}),le.left=H(ne,function(t){t.parser=function(){var t=N.regex,e=N.string,n=N.succeed,i=N.optWhitespace;return i.then(t(/^(?:[([|]|\\\{)/)).then(function(r){"\\"===r.charAt(0)&&(r=r.slice(1));var s=he[r]();return B.map(function(t){s.blocks=[t],t.adopt(s,0,0)}).then(e("\\right")).skip(i).then(t(/^(?:[\])|]|\\\})/)).then(function(t){return t.slice(-1)!==s.end.slice(-1)?N.fail("open doesn't match close"):n(s)})})}}),le.right=H(ne,function(t){t.parser=function(){return N.fail("unmatched \\right")}}),le.lbrace=he["{"]=e(b,"{","}","\\{","\\}"),le.langle=le.lang=e(b,"&lang;","&rang;","\\langle ","\\rangle "),v=H(b,function(t,e){t.createLeftOf=function(t){t[X]||!t.parent.parent||t.parent.parent.end!==this.end||this.replacedFragment?e.createLeftOf.call(this,t):t.insRightOf(t.parent.parent)},t.placeCursor=function(t){this.ends[G].blur(),t.insRightOf(this)}}),le.rbrace=he["}"]=e(v,"{","}","\\{","\\}"),le.rangle=le.rang=e(v,"&lang;","&rang;","\\langle ","\\rangle "),w=function(t,e){t.init=function(t,n){e.init.call(this,t,n,t,n)}},x=H(b,w),le.lparen=he["("]=e(x,"(",")"),le.lbrack=le.lbracket=he["["]=e(x,"[","]"),j=H(v,w),le.rparen=he[")"]=e(j,"(",")"),le.rbrack=le.rbracket=he["]"]=e(j,"[","]"),k=le.lpipe=le.rpipe=he["|"]=H(x,function(t,e){t.init=function(){e.init.call(this,"|","|")},t.createLeftOf=v.prototype.createLeftOf}),q=he.$=le.text=le.textnormal=le.textrm=le.textup=le.textmd=H(ne,function(t,e){t.ctrlSeq="\\text",t.htmlTemplate='<span class="text">&0</span>',t.replaces=function(t){t instanceof se?this.replacedText=t.remove().jQ.text():"string"==typeof t&&(this.replacedText=t)},t.textTemplate=['"','"'],t.parser=function(){var t=this,e=N.string,n=N.regex,i=N.optWhitespace;return i.then(e("{")).then(n(/^[^}]*/)).skip(e("}")).map(function(e){var n,i,r;for(t.createBlocks(),n=t.ends[G],i=0;i<e.length;i+=1)r=O(e.charAt(i)),r.adopt(n,n.ends[X],0);return t})},t.createBlocks=function(){this.ends[G]=this.ends[X]=y(),this.blocks=[this.ends[G]],this.ends[G].parent=this},t.finalizeInsert=function(){this.ends[G].blur=function(){return delete this.blur,this},e.finalizeInsert.call(this)},t.createLeftOf=function(t){if(e.createLeftOf.call(this,this.cursor=t),this.replacedText)for(var n=0;n<this.replacedText.length;n+=1)this.ends[G].write(t,this.replacedText.charAt(n))}}),y=H(re,function(t,e){t.onKey=function(t){return"Spacebar"===t||"Shift-Spacebar"===t?!1:void 0},t.deleteOutOf=function(t,e){this.isEmpty()&&e.insRightOf(this.parent)},t.write=function(t,e,n){var i,r;return n&&n.remove(),"$"!==e?("<"===e?i="&lt;":">"===e&&(i="&gt;"),O(e,i).createLeftOf(t)):this.isEmpty()?(t.insRightOf(this.parent).backspace(),O("\\$","$").createLeftOf(t)):t[X]?t[G]?(r=q(),r.replaces(se(t[X],this.ends[X])),t.insRightOf(this.parent),r.adopt=function(){delete this.adopt,this.adopt.apply(this,arguments),this[G]=0},r.createLeftOf(t),r[G]=this.parent,t.insLeftOf(r)):t.insLeftOf(this.parent):t.insRightOf(this.parent),!1},t.blur=function(){if(this.jQ.removeClass("hasCursor"),this.isEmpty()){var t=this.parent,e=t.cursor;e.parent===this?this.jQ.addClass("empty"):(e.hide(),t.remove(),e[X]===t?e[X]=t[X]:e[G]===t&&(e[G]=t[G]),e.show().parent.bubble("redraw"))}return this},t.focus=function(){var t,n,i,r;return e.focus.call(this),t=this.parent,t[X].ctrlSeq===t.ctrlSeq?(n=this,i=t.cursor,r=t[X].ends[G],r.eachChild(function(t){t.parent=n,t.jQ.appendTo(n.jQ)}),this.ends[X]?this.ends[X][X]=r.ends[G]:this.ends[G]=r.ends[G],r.ends[G][G]=this.ends[X],this.ends[X]=r.ends[X],r.parent.remove(),i[G]?i.insRightOf(i[G]):i.insAtLeftEnd(this),i.parent.bubble("redraw")):t[G].ctrlSeq===t.ctrlSeq&&(i=t.cursor,i[G]?t[G].ends[G].focus():i.insAtRightEnd(t[G].ends[G])),this}}),le.em=le.italic=le.italics=le.emph=le.textit=le.textsl=s("\\textit","i",'class="text"'),le.strong=le.bold=le.textbf=s("\\textbf","b",'class="text"'),le.sf=le.textsf=s("\\textsf","span",'class="sans-serif text"'),le.tt=le.texttt=s("\\texttt","span",'class="monospace text"'),le.textsc=s("\\textsc","span",'style="font-variant:small-caps" class="text"'),le.uppercase=s("\\uppercase","span",'style="text-transform:uppercase" class="text"'),le.lowercase=s("\\lowercase","span",'style="text-transform:lowercase" class="text"'),Q=he["\\"]=H(ne,function(t,e){t.ctrlSeq="\\",t.replaces=function(t){this._replacedFragment=t.disown(),this.isEmpty=function(){return!1}},t.htmlTemplate='<span class="latex-command-input non-leaf">\\<span>&0</span></span>',t.textTemplate=["\\"],t.createBlocks=function(){e.createBlocks.call(this),this.ends[G].focus=function(){return this.parent.jQ.addClass("hasCursor"),this.isEmpty()&&this.parent.jQ.removeClass("empty"),this},this.ends[G].blur=function(){return this.parent.jQ.removeClass("hasCursor"),this.isEmpty()&&this.parent.jQ.addClass("empty"),this}},t.createLeftOf=function(t){if(e.createLeftOf.call(this,t),this.cursor=t.insAtRightEnd(this.ends[G]),this._replacedFragment){var n=this.jQ[0];this.jQ=this._replacedFragment.jQ.addClass("blur").bind("mousedown mousemove",function(t){return Z(t.target=n).trigger(t),!1}).insertBefore(this.jQ).add(this.jQ)}this.ends[G].write=function(t,e,n){n&&n.remove(),e.match(/[a-z]/i)?O(e).createLeftOf(t):(this.parent.renderCommand(),"\\"===e&&this.isEmpty()||this.parent.parent.write(t,e))}},t.latex=function(){return"\\"+this.ends[G].latex()+" "},t.onKey=function(t,e){return"Tab"===t||"Enter"===t||"Spacebar"===t?(this.renderCommand(),e.preventDefault(),!1):void 0},t.renderCommand=function(){this.jQ=this.jQ.last(),this.remove(),this[X]?this.cursor.insLeftOf(this[X]):this.cursor.insAtRightEnd(this.parent);var t=this.ends[G].latex();t||(t="backslash"),this.cursor.insertCmd(t,this._replacedFragment)}}),C=le.binom=le.binomial=H(ne,function(t){t.ctrlSeq="\\binom",t.htmlTemplate='<span class="paren scaled">(</span><span class="non-leaf"><span class="array non-leaf"><span>&0</span><span>&1</span></span></span><span class="paren scaled">)</span>',t.textTemplate=["choose(",",",")"],t.redraw=function(){var t=this.jQ.eq(1),e=t.outerHeight()/+t.css("fontSize").slice(0,-2),n=this.jQ.filter(".paren");o(n,P(1+.2*(e-1),1.2),1.05*e)}}),S=le.choose=H(C,function(t){t.createLeftOf=f.prototype.createLeftOf}),L=le.vector=H(ne,function(t,e){t.ctrlSeq="\\vector",t.htmlTemplate='<span class="array"><span>&0</span></span>',t.latex=function(){return"\\begin{matrix}"+this.foldChildren([],function(t,e){return t.push(e.latex()),t}).join("\\\\")+"\\end{matrix}"},t.text=function(){return"["+this.foldChildren([],function(t,e){return t.push(e.text()),t}).join()+"]"},t.createLeftOf=function(t){e.createLeftOf.call(this,this.cursor=t)},t.onKey=function(t,e){var n,i=this.cursor.parent;if(i.parent===this){if("Enter"===t)return n=re(),n.parent=this,n.jQ=Z("<span></span>").attr(F,n.id).insertAfter(i.jQ),i[X]?i[X][G]=n:this.ends[X]=n,n[X]=i[X],i[X]=n,n[G]=i,this.bubble("redraw").cursor.insAtRightEnd(n),e.preventDefault(),!1;if("Tab"===t&&!i[X])return i.isEmpty()?i[G]?(this.cursor.insRightOf(this),delete i[G][X],this.ends[X]=i[G],i.jQ.remove(),this.bubble("redraw"),e.preventDefault(),!1):void 0:(n=re(),n.parent=this,n.jQ=Z("<span></span>").attr(F,n.id).appendTo(this.jQ),this.ends[X]=n,i[X]=n,n[G]=i,this.bubble("redraw").cursor.insAtRightEnd(n),e.preventDefault(),!1);if(8===e.which){if(i.isEmpty())return i[G]?(this.cursor.insAtRightEnd(i[G]),i[G][X]=i[X]):(this.cursor.insLeftOf(this),this.ends[G]=i[X]),i[X]?i[X][G]=i[G]:this.ends[X]=i[G],i.jQ.remove(),this.isEmpty()?this.cursor.deleteForward():this.bubble("redraw"),e.preventDefault(),!1;if(!this.cursor[G])return e.preventDefault(),!1}}}}),le.editable=H(oe,function(t,e){t.init=function(){ne.prototype.init.call(this,"\\editable")},t.jQadd=function(){var t,n,i=this;e.jQadd.apply(i,arguments),t=i.ends[G].disown(),n=i.jQ.children().detach(),i.ends[G]=i.ends[X]=ae(),i.blocks=[i.ends[G]],i.ends[G].parent=i,r(i.jQ,i.ends[G],!1,!0),i.cursor=i.ends[G].cursor,t.children().adopt(i.ends[G],0,0),n.appendTo(i.ends[G].jQ),i.ends[G].cursor.insAtRightEnd(i.ends[G])},t.latex=function(){return this.ends[G].latex()},t.text=function(){return this.ends[G].text()}}),le.f=e(ie,"f",'<var class="florin">&fnof;</var><span style="display:inline-block;width:0">&nbsp;</span>'),D=H(ie,function(t,e){t.init=function(t,n){e.init.call(this,t,"<var>"+(n||t)+"</var>")},t.text=function(){var t=this.ctrlSeq;return!this[G]||this[G]instanceof D||this[G]instanceof R||(t="*"+t),!this[X]||this[X]instanceof R||"^"===this[X].ctrlSeq||(t+="*"),t}}),O=H(ie,function(t,e){t.init=function(t,n){e.init.call(this,t,"<span>"+(n||t)+"</span>")}}),he[" "]=e(O,"\\:"," "),le.prime=he["'"]=e(O,"'","&prime;"),E=H(ie,function(t,e){t.init=function(t,n){e.init.call(this,t,'<span class="nonSymbola">'+(n||t)+"</span>")}}),le["@"]=E,le["&"]=e(E,"\\&","&amp;"),le["%"]=e(E,"\\%","%"),le.alpha=le.beta=le.gamma=le.delta=le.zeta=le.eta=le.theta=le.iota=le.kappa=le.mu=le.nu=le.xi=le.rho=le.sigma=le.tau=le.chi=le.psi=le.omega=H(D,function(t,e){t.init=function(t){e.init.call(this,"\\"+t+" ","&"+t+";")}}),le.phi=e(D,"\\phi ","&#981;"),le.phiv=le.varphi=e(D,"\\varphi ","&phi;"),le.epsilon=e(D,"\\epsilon ","&#1013;"),le.epsiv=le.varepsilon=e(D,"\\varepsilon ","&epsilon;"),le.piv=le.varpi=e(D,"\\varpi ","&piv;"),le.sigmaf=le.sigmav=le.varsigma=e(D,"\\varsigma ","&sigmaf;"),le.thetav=le.vartheta=le.thetasym=e(D,"\\vartheta ","&thetasym;"),le.upsilon=le.upsi=e(D,"\\upsilon ","&upsilon;"),le.gammad=le.Gammad=le.digamma=e(D,"\\digamma ","&#989;"),le.kappav=le.varkappa=e(D,"\\varkappa ","&#1008;"),le.rhov=le.varrho=e(D,"\\varrho ","&#1009;"),le.pi=le["π"]=e(E,"\\pi ","&pi;"),le.lambda=e(E,"\\lambda ","&lambda;"),le.Upsilon=le.Upsi=le.upsih=le.Upsih=e(ie,"\\Upsilon ",'<var style="font-family: serif">&upsih;</var>'),le.Gamma=le.Delta=le.Theta=le.Lambda=le.Xi=le.Pi=le.Sigma=le.Phi=le.Psi=le.Omega=le.forall=H(O,function(t,e){t.init=function(t){e.init.call(this,"\\"+t+" ","&"+t+";")
}}),A=H(ne,function(t){t.init=function(t){this.latex=t},t.createLeftOf=function(t){t.writeLatex(this.latex)},t.parser=function(){var t=B.parse(this.latex).children();return N.succeed(t)}}),le["¹"]=e(A,"^1"),le["²"]=e(A,"^2"),le["³"]=e(A,"^3"),le["¼"]=e(A,"\\frac14"),le["½"]=e(A,"\\frac12"),le["¾"]=e(A,"\\frac34"),R=H(ie,function(t,e){t.init=function(t,n,i){e.init.call(this,t,'<span class="binary-operator">'+n+"</span>",i)}}),T=H(R,function(t){t.init=O.prototype.init,t.respace=function(){return this.jQ[0].className=this[G]?this[G]instanceof R&&this[X]&&!(this[X]instanceof R)?"unary-operator":"binary-operator":"",this}}),le["+"]=e(T,"+","+"),le["–"]=le["-"]=e(T,"-","&minus;"),le["±"]=le.pm=le.plusmn=le.plusminus=e(T,"\\pm ","&plusmn;"),le.mp=le.mnplus=le.minusplus=e(T,"\\mp ","&#8723;"),he["*"]=le.sdot=le.cdot=e(R,"\\cdot ","&middot;"),le["="]=e(R,"=","="),le["<"]=e(R,"<","&lt;"),le[">"]=e(R,">","&gt;"),le.notin=le.sim=le.cong=le.equiv=le.oplus=le.otimes=H(R,function(t,e){t.init=function(t){e.init.call(this,"\\"+t+" ","&"+t+";")}}),le.times=e(R,"\\times ","&times;","[x]"),le["÷"]=le.div=le.divide=le.divides=e(R,"\\div ","&divide;","[/]"),le["≠"]=le.ne=le.neq=e(R,"\\ne ","&ne;"),le.ast=le.star=le.loast=le.lowast=e(R,"\\ast ","&lowast;"),le.therefor=le.therefore=e(R,"\\therefore ","&there4;"),le.cuz=le.because=e(R,"\\because ","&#8757;"),le.prop=le.propto=e(R,"\\propto ","&prop;"),le["≈"]=le.asymp=le.approx=e(R,"\\approx ","&asymp;"),le.lt=e(R,"<","&lt;"),le.gt=e(R,">","&gt;"),le["≤"]=le.le=le.leq=e(R,"\\le ","&le;"),le["≥"]=le.ge=le.geq=e(R,"\\ge ","&ge;"),le.isin=le["in"]=e(R,"\\in ","&isin;"),le.ni=le.contains=e(R,"\\ni ","&ni;"),le.notni=le.niton=le.notcontains=le.doesnotcontain=e(R,"\\not\\ni ","&#8716;"),le.sub=le.subset=e(R,"\\subset ","&sub;"),le.sup=le.supset=le.superset=e(R,"\\supset ","&sup;"),le.nsub=le.notsub=le.nsubset=le.notsubset=e(R,"\\not\\subset ","&#8836;"),le.nsup=le.notsup=le.nsupset=le.notsupset=le.nsuperset=le.notsuperset=e(R,"\\not\\supset ","&#8837;"),le.sube=le.subeq=le.subsete=le.subseteq=e(R,"\\subseteq ","&sube;"),le.supe=le.supeq=le.supsete=le.supseteq=le.supersete=le.superseteq=e(R,"\\supseteq ","&supe;"),le.nsube=le.nsubeq=le.notsube=le.notsubeq=le.nsubsete=le.nsubseteq=le.notsubsete=le.notsubseteq=e(R,"\\not\\subseteq ","&#8840;"),le.nsupe=le.nsupeq=le.notsupe=le.notsupeq=le.nsupsete=le.nsupseteq=le.notsupsete=le.notsupseteq=le.nsupersete=le.nsuperseteq=le.notsupersete=le.notsuperseteq=e(R,"\\not\\supseteq ","&#8841;"),z=H(ie,function(t,e){t.init=function(t,n){e.init.call(this,t,"<big>"+n+"</big>")}}),le["∑"]=le.sum=le.summation=e(z,"\\sum ","&sum;"),le["∏"]=le.prod=le.product=e(z,"\\prod ","&prod;"),le.coprod=le.coproduct=e(z,"\\coprod ","&#8720;"),le["∫"]=le["int"]=le.integral=e(z,"\\int ","&int;"),le.N=le.naturals=le.Naturals=e(O,"\\mathbb{N}","&#8469;"),le.P=le.primes=le.Primes=le.projective=le.Projective=le.probability=le.Probability=e(O,"\\mathbb{P}","&#8473;"),le.Z=le.integers=le.Integers=e(O,"\\mathbb{Z}","&#8484;"),le.Q=le.rationals=le.Rationals=e(O,"\\mathbb{Q}","&#8474;"),le.R=le.reals=le.Reals=e(O,"\\mathbb{R}","&#8477;"),le.C=le.complex=le.Complex=le.complexes=le.Complexes=le.complexplane=le.Complexplane=le.ComplexPlane=e(O,"\\mathbb{C}","&#8450;"),le.H=le.Hamiltonian=le.quaternions=le.Quaternions=e(O,"\\mathbb{H}","&#8461;"),le.quad=le.emsp=e(O,"\\quad ","    "),le.qquad=e(O,"\\qquad ","        "),le.diamond=e(O,"\\diamond ","&#9671;"),le.bigtriangleup=e(O,"\\bigtriangleup ","&#9651;"),le.ominus=e(O,"\\ominus ","&#8854;"),le.uplus=e(O,"\\uplus ","&#8846;"),le.bigtriangledown=e(O,"\\bigtriangledown ","&#9661;"),le.sqcap=e(O,"\\sqcap ","&#8851;"),le.triangleleft=e(O,"\\triangleleft ","&#8882;"),le.sqcup=e(O,"\\sqcup ","&#8852;"),le.triangleright=e(O,"\\triangleright ","&#8883;"),le.odot=e(O,"\\odot ","&#8857;"),le.bigcirc=e(O,"\\bigcirc ","&#9711;"),le.dagger=e(O,"\\dagger ","&#0134;"),le.ddagger=e(O,"\\ddagger ","&#135;"),le.wr=e(O,"\\wr ","&#8768;"),le.amalg=e(O,"\\amalg ","&#8720;"),le.models=e(O,"\\models ","&#8872;"),le.prec=e(O,"\\prec ","&#8826;"),le.succ=e(O,"\\succ ","&#8827;"),le.preceq=e(O,"\\preceq ","&#8828;"),le.succeq=e(O,"\\succeq ","&#8829;"),le.simeq=e(O,"\\simeq ","&#8771;"),le.mid=e(O,"\\mid ","&#8739;"),le.ll=e(O,"\\ll ","&#8810;"),le.gg=e(O,"\\gg ","&#8811;"),le.parallel=e(O,"\\parallel ","&#8741;"),le.bowtie=e(O,"\\bowtie ","&#8904;"),le.sqsubset=e(O,"\\sqsubset ","&#8847;"),le.sqsupset=e(O,"\\sqsupset ","&#8848;"),le.smile=e(O,"\\smile ","&#8995;"),le.sqsubseteq=e(O,"\\sqsubseteq ","&#8849;"),le.sqsupseteq=e(O,"\\sqsupseteq ","&#8850;"),le.doteq=e(O,"\\doteq ","&#8784;"),le.frown=e(O,"\\frown ","&#8994;"),le.vdash=e(O,"\\vdash ","&#8870;"),le.dashv=e(O,"\\dashv ","&#8867;"),le.longleftarrow=e(O,"\\longleftarrow ","&#8592;"),le.longrightarrow=e(O,"\\longrightarrow ","&#8594;"),le.Longleftarrow=e(O,"\\Longleftarrow ","&#8656;"),le.Longrightarrow=e(O,"\\Longrightarrow ","&#8658;"),le.longleftrightarrow=e(O,"\\longleftrightarrow ","&#8596;"),le.updownarrow=e(O,"\\updownarrow ","&#8597;"),le.Longleftrightarrow=e(O,"\\Longleftrightarrow ","&#8660;"),le.Updownarrow=e(O,"\\Updownarrow ","&#8661;"),le.mapsto=e(O,"\\mapsto ","&#8614;"),le.nearrow=e(O,"\\nearrow ","&#8599;"),le.hookleftarrow=e(O,"\\hookleftarrow ","&#8617;"),le.hookrightarrow=e(O,"\\hookrightarrow ","&#8618;"),le.searrow=e(O,"\\searrow ","&#8600;"),le.leftharpoonup=e(O,"\\leftharpoonup ","&#8636;"),le.rightharpoonup=e(O,"\\rightharpoonup ","&#8640;"),le.swarrow=e(O,"\\swarrow ","&#8601;"),le.leftharpoondown=e(O,"\\leftharpoondown ","&#8637;"),le.rightharpoondown=e(O,"\\rightharpoondown ","&#8641;"),le.nwarrow=e(O,"\\nwarrow ","&#8598;"),le.ldots=e(O,"\\ldots ","&#8230;"),le.cdots=e(O,"\\cdots ","&#8943;"),le.vdots=e(O,"\\vdots ","&#8942;"),le.ddots=e(O,"\\ddots ","&#8944;"),le.surd=e(O,"\\surd ","&#8730;"),le.triangle=e(O,"\\triangle ","&#9653;"),le.ell=e(O,"\\ell ","&#8467;"),le.top=e(O,"\\top ","&#8868;"),le.flat=e(O,"\\flat ","&#9837;"),le.natural=e(O,"\\natural ","&#9838;"),le.sharp=e(O,"\\sharp ","&#9839;"),le.wp=e(O,"\\wp ","&#8472;"),le.bot=e(O,"\\bot ","&#8869;"),le.clubsuit=e(O,"\\clubsuit ","&#9827;"),le.diamondsuit=e(O,"\\diamondsuit ","&#9826;"),le.heartsuit=e(O,"\\heartsuit ","&#9825;"),le.spadesuit=e(O,"\\spadesuit ","&#9824;"),le.oint=e(O,"\\oint ","&#8750;"),le.bigcap=e(O,"\\bigcap ","&#8745;"),le.bigcup=e(O,"\\bigcup ","&#8746;"),le.bigsqcup=e(O,"\\bigsqcup ","&#8852;"),le.bigvee=e(O,"\\bigvee ","&#8744;"),le.bigwedge=e(O,"\\bigwedge ","&#8743;"),le.bigodot=e(O,"\\bigodot ","&#8857;"),le.bigotimes=e(O,"\\bigotimes ","&#8855;"),le.bigoplus=e(O,"\\bigoplus ","&#8853;"),le.biguplus=e(O,"\\biguplus ","&#8846;"),le.lfloor=e(O,"\\lfloor ","&#8970;"),le.rfloor=e(O,"\\rfloor ","&#8971;"),le.lceil=e(O,"\\lceil ","&#8968;"),le.rceil=e(O,"\\rceil ","&#8969;"),le.slash=e(O,"\\slash ","&#47;"),le.opencurlybrace=e(O,"\\opencurlybrace ","&#123;"),le.closecurlybrace=e(O,"\\closecurlybrace ","&#125;"),le.caret=e(O,"\\caret ","^"),le.underscore=e(O,"\\underscore ","_"),le.backslash=e(O,"\\backslash ","\\"),le.vert=e(O,"|"),le.perp=le.perpendicular=e(O,"\\perp ","&perp;"),le.nabla=le.del=e(O,"\\nabla ","&nabla;"),le.hbar=e(O,"\\hbar ","&#8463;"),le.AA=le.Angstrom=le.angstrom=e(O,"\\text\\AA ","&#8491;"),le.ring=le.circ=le.circle=e(O,"\\circ ","&#8728;"),le.bull=le.bullet=e(O,"\\bullet ","&bull;"),le.setminus=le.smallsetminus=e(O,"\\setminus ","&#8726;"),le.not=le["¬"]=le.neg=e(O,"\\neg ","&not;"),le["…"]=le.dots=le.ellip=le.hellip=le.ellipsis=le.hellipsis=e(O,"\\dots ","&hellip;"),le.converges=le.darr=le.dnarr=le.dnarrow=le.downarrow=e(O,"\\downarrow ","&darr;"),le.dArr=le.dnArr=le.dnArrow=le.Downarrow=e(O,"\\Downarrow ","&dArr;"),le.diverges=le.uarr=le.uparrow=e(O,"\\uparrow ","&uarr;"),le.uArr=le.Uparrow=e(O,"\\Uparrow ","&uArr;"),le.to=e(R,"\\to ","&rarr;"),le.rarr=le.rightarrow=e(O,"\\rightarrow ","&rarr;"),le.implies=e(R,"\\Rightarrow ","&rArr;"),le.rArr=le.Rightarrow=e(O,"\\Rightarrow ","&rArr;"),le.gets=e(R,"\\gets ","&larr;"),le.larr=le.leftarrow=e(O,"\\leftarrow ","&larr;"),le.impliedby=e(R,"\\Leftarrow ","&lArr;"),le.lArr=le.Leftarrow=e(O,"\\Leftarrow ","&lArr;"),le.harr=le.lrarr=le.leftrightarrow=e(O,"\\leftrightarrow ","&harr;"),le.iff=e(R,"\\Leftrightarrow ","&hArr;"),le.hArr=le.lrArr=le.Leftrightarrow=e(O,"\\Leftrightarrow ","&hArr;"),le.Re=le.Real=le.real=e(O,"\\Re ","&real;"),le.Im=le.imag=le.image=le.imagin=le.imaginary=le.Imaginary=e(O,"\\Im ","&image;"),le.part=le.partial=e(O,"\\partial ","&part;"),le.inf=le.infin=le.infty=le.infinity=e(O,"\\infty ","&infin;"),le.alef=le.alefsym=le.aleph=le.alephsym=e(O,"\\aleph ","&alefsym;"),le.xist=le.xists=le.exist=le.exists=e(O,"\\exists ","&exist;"),le.and=le.land=le.wedge=e(O,"\\wedge ","&and;"),le.or=le.lor=le.vee=e(O,"\\vee ","&or;"),le.o=le.O=le.empty=le.emptyset=le.oslash=le.Oslash=le.nothing=le.varnothing=e(R,"\\varnothing ","&empty;"),le.cup=le.union=e(R,"\\cup ","&cup;"),le.cap=le.intersect=le.intersection=e(R,"\\cap ","&cap;"),le.deg=le.degree=e(O,"^\\circ ","&deg;"),le.ang=le.angle=e(O,"\\angle ","&ang;"),$=H(ie,function(t,e){t.init=function(t){e.init.call(this,"\\"+t+" ","<span>"+t+"</span>")},t.respace=function(){this.jQ[0].className=this[X]instanceof u||this[X]instanceof b?"":"non-italicized-function"}}),le.ln=le.lg=le.log=le.span=le.proj=le.det=le.dim=le.min=le.max=le.mod=le.lcm=le.gcd=le.gcf=le.hcf=le.lim=$,function(){var t,e=["sin","cos","tan","sec","cosec","csc","cotan","cot"];for(t in e)le[e[t]]=le[e[t]+"h"]=le["a"+e[t]]=le["arc"+e[t]]=le["a"+e[t]+"h"]=le["arc"+e[t]+"h"]=$}(),B=function(){function t(t){var e=re();return t.adopt(e,0,0),e}function e(t){var e,n=t[0]||re();for(e=1;e<t.length;e+=1)t[e].children().adopt(n,n.ends[X],0);return n}var n=N.string,i=N.regex,r=N.letter,s=N.any,a=N.optWhitespace,o=N.succeed,c=N.fail,h=r.map(D),l=i(/^[^${}\\_^]/).map(O),u=i(/^[^\\a-eg-zA-Z]/).or(n("\\").then(i(/^[a-z]+/i).or(i(/^\s+/).result(" ")).or(s))).then(function(t){var e=le[t];return e?e(t).parser():c("unknown command: \\"+t)}),p=u.or(h).or(l),f=n("{").then(function(){return m}).skip(n("}")),d=a.then(f.or(p.map(t))),m=d.many().map(e).skip(a),g=n("[").then(d.then(function(t){return"]"!==t.join("latex")?o(t):c()}).many().map(e).skip(a)).skip(n("]")),b=m;return b.block=d,b.optBlock=g,b}(),I=H(Y,function(t){function e(t,e){var i,r,s,a;if(t.clearSelection().show(),t[X][e])t.insAtLeftEnd(t[X][e]);else if(t[G][e])t.insAtRightEnd(t[G][e]);else{i=t.parent;do{if(r=i[e],r&&("function"==typeof r&&(r=i[e](t)),r===!1||r instanceof re)){t.upDownCache[i.id]=Y(t.parent,t[G],t[X]),r instanceof re&&(s=t.upDownCache[r.id],s?s[X]?t.insLeftOf(s[X]):t.insAtRightEnd(s.parent):(a=n(t).left,t.insAtRightEnd(r),t.seekHoriz(a,r)));break}i=i.parent.parent}while(i)}return t}function n(t){var e=t.jQ.removeClass("cursor").offset();return t.jQ.addClass("cursor"),e}function r(t){t.upDownCache={}}t.init=function(t){this.parent=this.root=t;var e=this.jQ=this._jQ=Z('<span class="cursor">&#8203;</span>');this.blink=function(){e.toggleClass("blink")},this.upDownCache={}},t.show=function(){return this.jQ=this._jQ.removeClass("blink"),"intervalId"in this?clearInterval(this.intervalId):(this[X]?this.jQ.insertBefore(this.selection&&this.selection.ends[G][G]===this[G]?this.selection.jQ:this[X].jQ.first()):this.jQ.appendTo(this.parent.jQ),this.parent.focus()),this.intervalId=setInterval(this.blink,500),this},t.hide=function(){return"intervalId"in this&&clearInterval(this.intervalId),delete this.intervalId,this.jQ.detach(),this.jQ=Z(),this},t.withDirInsertAt=function(t,e,n,i){var r=this.parent;this.parent=e,this[t]=n,this[-t]=i,r.blur()},t.insDirOf=function(t,e){return i(t),this.withDirInsertAt(t,e.parent,e[t],e),this.parent.jQ.addClass("hasCursor"),this.jQ.insDirOf(t,e.jQ),this},t.insLeftOf=function(t){return this.insDirOf(G,t)},t.insRightOf=function(t){return this.insDirOf(X,t)},t.insAtDirEnd=function(t,e){return i(t),this.withDirInsertAt(t,e,0,e.ends[t]),t===G&&e.textarea?this.jQ.insDirOf(-t,e.textarea):this.jQ.insAtDirEnd(t,e.jQ),e.focus(),this},t.insAtLeftEnd=function(t){return this.insAtDirEnd(G,t)},t.insAtRightEnd=function(t){return this.insAtDirEnd(X,t)},t.hopDir=function(t){return i(t),this.jQ.insDirOf(t,this[t].jQ),this[-t]=this[t],this[t]=this[t][t],this},t.hopLeft=function(){return this.hopDir(G)},t.hopRight=function(){return this.hopDir(X)},t.moveDirWithin=function(t,e){if(i(t),this[t])this[t].ends[-t]?this.insAtDirEnd(-t,this[t].ends[-t]):this.hopDir(t);else{if(this.parent===e)return;this.parent[t]?this.insAtDirEnd(-t,this.parent[t]):this.insDirOf(t,this.parent.parent)}},t.moveLeftWithin=function(t){return this.moveDirWithin(G,t)},t.moveRightWithin=function(t){return this.moveDirWithin(X,t)},t.moveDir=function(t){return i(t),r(this),this.selection?this.insDirOf(t,this.selection.ends[t]).clearSelection():this.moveDirWithin(t,this.root),this.show()},t.moveLeft=function(){return this.moveDir(G)},t.moveRight=function(){return this.moveDir(X)},t.moveUp=function(){return e(this,"up")},t.moveDown=function(){return e(this,"down")},t.seek=function(t,e){r(this);var n,i,s=this.clearSelection().show();return t.hasClass("empty")?(s.insAtLeftEnd(ee[t.attr(F)]),s):(n=ee[t.attr(M)],n instanceof ie?(t.outerWidth()>2*(e-t.offset().left)?s.insLeftOf(n):s.insRightOf(n),s):(n||(i=ee[t.attr(F)],i||(t=t.parent(),n=ee[t.attr(M)],n||(i=ee[t.attr(F)],i||(i=s.root)))),n?s.insRightOf(n):s.insAtRightEnd(i),s.seekHoriz(e,s.root)))},t.seekHoriz=function(t,e){var i,r=this,s=n(r).left-t;do r.moveLeftWithin(e),i=s,s=n(r).left-t;while(s>0&&(r[G]||r.parent!==e));return-s>i&&r.moveRightWithin(e),r},t.writeLatex=function(t){var e,n,i,s=this;return r(s),s.show().deleteSelection(),e=N.all,n=N.eof,i=B.skip(n).or(e.result(!1)).parse(t),i&&(i.children().adopt(s.parent,s[G],s[X]),ee.jQize(i.join("html")).insertBefore(s.jQ),s[G]=i.ends[X],i.finalizeInsert(),s.parent.bubble("redraw")),this.hide()},t.write=function(t){var e=this.prepareWrite();return this.insertCh(t,e)},t.insertCh=function(t,e){return this.parent.write(this,t,e),this},t.insertCmd=function(t,e){var n=le[t];return n?(n=n(t),e&&n.replaces(e),n.createLeftOf(this)):(n=q(),n.replaces(t),n.ends[G].focus=function(){return delete this.focus,this},n.createLeftOf(this),this.insRightOf(n),e&&e.remove()),this},t.unwrapGramp=function(){var t=this.parent.parent,e=t.parent,n=t[X],i=t[G];if(t.disown().eachChild(function(r){r.isEmpty()||(r.children().adopt(e,i,n).each(function(e){e.jQ.insertBefore(t.jQ.first())}),i=r.ends[X])}),!this[X])if(this[G])this[X]=this[G][X];else for(;!this[X];){if(this.parent=this.parent[X],!this.parent){this[X]=t[X],this.parent=e;break}this[X]=this.parent.ends[G]}this[X]?this.insLeftOf(this[X]):this.insAtRightEnd(e),t.jQ.remove(),t[G]&&t[G].respace(),t[X]&&t[X].respace()},t.deleteDir=function(t){if(i(t),r(this),this.show(),this.deleteSelection());else if(this[t])this[t].isEmpty()?this[t]=this[t].remove()[t]:this.selectDir(t);else if(this.parent!==this.root){if(this.parent.parent.isEmpty())return this.insDirOf(-t,this.parent.parent).deleteDir(t);this.unwrapGramp()}return this[G]&&this[G].respace(),this[X]&&this[X].respace(),this.parent.bubble("redraw"),this},t.backspace=function(){return this.deleteDir(G)},t.deleteForward=function(){return this.deleteDir(X)},t.selectFrom=function(t){var e,n,i,r,s,a,o=this,c=t;t:for(;;){for(e=this;e!==o.parent.parent;e=e.parent.parent)if(e.parent===c.parent){i=e,r=c;break t}for(n=t;n!==c.parent.parent;n=n.parent.parent)if(o.parent===n.parent){i=o,r=n;break t}o.parent.parent&&(o=o.parent.parent),c.parent.parent&&(c=c.parent.parent)}if(i[X]!==r){for(a=i;a;a=a[X])if(a===r[G]){s=!0;break}s||(s=r,r=i,i=s)}this.hide().selection=_(i[G][X]||i.parent.ends[G],r[X][G]||r.parent.ends[X]),this.insRightOf(r[X][G]||r.parent.ends[X]),this.root.selectionChanged()},t.selectDir=function(t){if(i(t),r(this),this.selection)if(this.selection.ends[t]===this[-t])this[t]?this.hopDir(t).selection.extendDir(t):this.parent!==this.root&&this.insDirOf(t,this.parent.parent).selection.levelUp();else{if(this.hopDir(t),this.selection.ends[t]===this.selection.ends[-t])return void this.clearSelection().show();this.selection.retractDir(t)}else{if(this[t])this.hopDir(t);else{if(this.parent===this.root)return;this.insDirOf(t,this.parent.parent)}this.hide().selection=_(this[-t])}this.root.selectionChanged()},t.selectLeft=function(){return this.selectDir(G)},t.selectRight=function(){return this.selectDir(X)},t.prepareMove=function(){return r(this),this.show().clearSelection()},t.prepareEdit=function(){return r(this),this.show().deleteSelection()},t.prepareWrite=function(){return r(this),this.show().replaceSelection()},t.clearSelection=function(){return this.selection&&(this.selection.clear(),delete this.selection,this.root.selectionChanged()),this},t.deleteSelection=function(){return this.selection?(this[G]=this.selection.ends[G][G],this[X]=this.selection.ends[X][X],this.selection.remove(),this.root.selectionChanged(),delete this.selection):!1},t.replaceSelection=function(){var t=this.selection;return t&&(this[G]=t.ends[G][G],this[X]=t.ends[X][X],delete this.selection),t}}),_=H(se,function(t,e){t.init=function(){var t=this;e.init.apply(t,arguments),t.jQwrap(t.jQ)},t.jQwrap=function(t){this.jQ=t.wrapAll('<span class="selection"></span>').parent()},t.adopt=function(){return this.jQ.replaceWith(this.jQ=this.jQ.children()),e.adopt.apply(this,arguments)},t.clear=function(){return this.jQ.replaceWith(this.jQ.children()),this},t.levelUp=function(){var t=this,e=t.ends[G]=t.ends[X]=t.ends[X].parent.parent;return t.clear().jQwrap(e.jQ),t},t.extendDir=function(t){return i(t),this.ends[t]=this.ends[t][t],this.ends[t].jQ.insAtDirEnd(t,this.jQ),this},t.extendLeft=function(){return this.extendDir(G)},t.extendRight=function(){return this.extendDir(X)},t.retractDir=function(t){i(t),this.ends[-t].jQ.insDirOf(-t,this.jQ),this.ends[-t]=this.ends[-t][t]},t.retractRight=function(){return this.retractDir(X)},t.retractLeft=function(){return this.retractDir(G)}}),W.fn.mathquill=function(t,e){var n,i,s,a,o;switch(t){case"redraw":return this.each(function(){var t=Z(this).attr(F),e=t&&ee[t];e&&!function n(t){t.eachChild(n),t.redraw&&t.redraw()}(e)});case"revert":return this.each(function(){var t=Z(this).attr(F),e=t&&ee[t];e&&e.revert&&e.revert()});case"latex":return arguments.length>1?this.each(function(){var t=Z(this).attr(F),n=t&&ee[t];n&&n.renderLatex(e)}):(n=Z(this).attr(F),i=n&&ee[n],i&&i.latex());case"text":return n=Z(this).attr(F),i=n&&ee[n],i&&i.text();case"html":return this.html().replace(/ ?hasCursor|hasCursor /,"").replace(/ class=(""|(?= |>))/g,"").replace(/<span class="?cursor( blink)?"?><\/span>/i,"").replace(/<span class="?textarea"?><textarea><\/textarea><\/span>/i,"");case"write":if(arguments.length>1)return this.each(function(){var t=Z(this).attr(F),n=t&&ee[t],i=n&&n.cursor;i&&i.writeLatex(e).parent.blur()});case"cmd":if(arguments.length>1)return this.each(function(){var t,n=Z(this).attr(F),i=n&&ee[n],r=i&&i.cursor;r&&(t=r.prepareWrite(),/^\\[a-z]+$/i.test(e)?r.insertCmd(e.slice(1),t):r.insertCh(e,t),r.hide().parent.blur())});default:return s="textbox"===t,a=s||"editable"===t,o=s?ce:ae,this.each(function(){r(Z(this),o(),s,a)})}},W(function(){W(".mathquill-editable:not(.mathquill-rendered-math)").mathquill("editable"),W(".mathquill-textbox:not(.mathquill-rendered-math)").mathquill("textbox"),W(".mathquill-embedded-latex").mathquill()})}();
!function(t){var e,i;!function(){function t(t,e){if(!e)return t;if(0===t.indexOf(".")){var i=e.split("/"),o=t.split("/"),s=i.length-1,n=o.length,r=0,a=0;t:for(var h=0;n>h;h++)switch(o[h]){case"..":if(!(s>r))break t;r++,a++;break;case".":a++;break;default:break t}return i.length=s-r,o=o.slice(a),i.concat(o).join("/")}return t}function o(e){function i(i,r){if("string"==typeof i){var a=o[i];return a||(a=n(t(i,e)),o[i]=a),a}i instanceof Array&&(r=r||function(){},r.apply(this,s(i,r,e)))}var o={};return i}function s(i,o,s){for(var a=[],h=r[s],l=0,d=Math.min(i.length,o.length);d>l;l++){var c,p=t(i[l],s);switch(p){case"require":c=h&&h.require||e;break;case"exports":c=h.exports;break;case"module":c=h;break;default:c=n(p)}a.push(c)}return a}function n(t){var e=r[t];if(!e)throw new Error("No "+t);if(!e.defined){var i=e.factory,o=i.apply(this,s(e.deps||[],i,t));"undefined"!=typeof o&&(e.exports=o),e.defined=1}return e.exports}var r={};i=function(t,e,i){r[t]={id:t,deps:e,factory:i,defined:0,exports:{},require:o(t)}},e=o("")}(),i("echarts/chart/scatter",["require","./base","../util/shape/Symbol","../component/axis","../component/grid","../component/dataZoom","../component/dataRange","../config","zrender/tool/util","zrender/tool/color","../chart"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.refresh(s)}var i=t("./base"),o=t("../util/shape/Symbol");t("../component/axis"),t("../component/grid"),t("../component/dataZoom"),t("../component/dataRange");var s=t("../config");s.scatter={zlevel:0,z:2,clickable:!0,legendHoverLink:!0,xAxisIndex:0,yAxisIndex:0,symbolSize:4,large:!1,largeThreshold:2e3,itemStyle:{normal:{label:{show:!1}},emphasis:{label:{show:!1}}}};var n=t("zrender/tool/util"),r=t("zrender/tool/color");return e.prototype={type:s.CHART_TYPE_SCATTER,_buildShape:function(){var t=this.series;this._sIndex2ColorMap={},this._symbol=this.option.symbolList,this._sIndex2ShapeMap={},this.selectedMap={},this.xMarkMap={};for(var e,i,o,n,a=this.component.legend,h=[],l=0,d=t.length;d>l;l++)if(e=t[l],i=e.name,e.type===s.CHART_TYPE_SCATTER){if(t[l]=this.reformOption(t[l]),this.legendHoverLink=t[l].legendHoverLink||this.legendHoverLink,this._sIndex2ShapeMap[l]=this.query(e,"symbol")||this._symbol[l%this._symbol.length],a){if(this.selectedMap[i]=a.isSelected(i),this._sIndex2ColorMap[l]=r.alpha(a.getColor(i),.5),o=a.getItemShape(i)){var n=this._sIndex2ShapeMap[l];o.style.brushType=n.match("empty")?"stroke":"both",n=n.replace("empty","").toLowerCase(),n.match("rectangle")&&(o.style.x+=Math.round((o.style.width-o.style.height)/2),o.style.width=o.style.height),n.match("star")&&(o.style.n=n.replace("star","")-0||5,n="star"),n.match("image")&&(o.style.image=n.replace(new RegExp("^image:\\/\\/"),""),o.style.x+=Math.round((o.style.width-o.style.height)/2),o.style.width=o.style.height,n="image"),o.style.iconType=n,a.setItemShape(i,o)}}else this.selectedMap[i]=!0,this._sIndex2ColorMap[l]=r.alpha(this.zr.getColor(l),.5);this.selectedMap[i]&&h.push(l)}this._buildSeries(h),this.addShapeList()},_buildSeries:function(t){if(0!==t.length){for(var e,i,o,s,n,r,a,h,l=this.series,d={},c=0,p=t.length;p>c;c++)if(e=t[c],i=l[e],0!==i.data.length){n=this.component.xAxis.getAxis(i.xAxisIndex||0),r=this.component.yAxis.getAxis(i.yAxisIndex||0),d[e]=[];for(var u=0,g=i.data.length;g>u;u++)o=i.data[u],s=this.getDataFromOption(o,"-"),"-"===s||s.length<2||(a=n.getCoord(s[0]),h=r.getCoord(s[1]),d[e].push([a,h,u,o.name||""]));this.xMarkMap[e]=this._markMap(n,r,i.data,d[e]),this.buildMark(e)}this._buildPointList(d)}},_markMap:function(t,e,i,o){for(var s,n={min0:Number.POSITIVE_INFINITY,max0:Number.NEGATIVE_INFINITY,sum0:0,counter0:0,average0:0,min1:Number.POSITIVE_INFINITY,max1:Number.NEGATIVE_INFINITY,sum1:0,counter1:0,average1:0},r=0,a=o.length;a>r;r++)s=i[o[r][2]].value||i[o[r][2]],n.min0>s[0]&&(n.min0=s[0],n.minY0=o[r][1],n.minX0=o[r][0]),n.max0<s[0]&&(n.max0=s[0],n.maxY0=o[r][1],n.maxX0=o[r][0]),n.sum0+=s[0],n.counter0++,n.min1>s[1]&&(n.min1=s[1],n.minY1=o[r][1],n.minX1=o[r][0]),n.max1<s[1]&&(n.max1=s[1],n.maxY1=o[r][1],n.maxX1=o[r][0]),n.sum1+=s[1],n.counter1++;var h=this.component.grid.getX(),l=this.component.grid.getXend(),d=this.component.grid.getY(),c=this.component.grid.getYend();n.average0=n.sum0/n.counter0;var p=t.getCoord(n.average0);n.averageLine0=[[p,c],[p,d]],n.minLine0=[[n.minX0,c],[n.minX0,d]],n.maxLine0=[[n.maxX0,c],[n.maxX0,d]],n.average1=n.sum1/n.counter1;var u=e.getCoord(n.average1);return n.averageLine1=[[h,u],[l,u]],n.minLine1=[[h,n.minY1],[l,n.minY1]],n.maxLine1=[[h,n.maxY1],[l,n.maxY1]],n},_buildPointList:function(t){var e,i,o,s,n=this.series;for(var r in t)if(e=n[r],i=t[r],e.large&&e.data.length>e.largeThreshold)this.shapeList.push(this._getLargeSymbol(i,this.getItemStyleColor(this.query(e,"itemStyle.normal.color"),r,-1)||this._sIndex2ColorMap[r]));else for(var a=0,h=i.length;h>a;a++)o=i[a],s=this._getSymbol(r,o[2],o[3],o[0],o[1]),s&&this.shapeList.push(s)},_getSymbol:function(t,e,i,o,s){var n,r=this.series,a=r[t],h=a.data[e],l=this.component.dataRange;if(l){if(n=isNaN(h[2])?this._sIndex2ColorMap[t]:l.getColor(h[2]),!n)return null}else n=this._sIndex2ColorMap[t];var d=this.getSymbolShape(a,t,h,e,i,o,s,this._sIndex2ShapeMap[t],n,"rgba(0,0,0,0)","vertical");return d.zlevel=this.getZlevelBase(),d.z=this.getZBase(),d._main=!0,d},_getLargeSymbol:function(t,e){return new o({zlevel:this.getZlevelBase(),z:this.getZBase(),_main:!0,hoverable:!1,style:{pointList:t,color:e,strokeColor:e},highlightStyle:{pointList:[]}})},getMarkCoord:function(t,e){var i,o=this.series[t],s=this.xMarkMap[t],n=this.component.xAxis.getAxis(o.xAxisIndex),r=this.component.yAxis.getAxis(o.yAxisIndex);if(!e.type||"max"!==e.type&&"min"!==e.type&&"average"!==e.type)i=["string"!=typeof e.xAxis&&n.getCoordByIndex?n.getCoordByIndex(e.xAxis||0):n.getCoord(e.xAxis||0),"string"!=typeof e.yAxis&&r.getCoordByIndex?r.getCoordByIndex(e.yAxis||0):r.getCoord(e.yAxis||0)];else{var a=null!=e.valueIndex?e.valueIndex:1;i=[s[e.type+"X"+a],s[e.type+"Y"+a],s[e.type+"Line"+a],s[e.type+a]]}return i},refresh:function(t){t&&(this.option=t,this.series=t.series),this.backupShapeList(),this._buildShape()},ondataRange:function(t,e){this.component.dataRange&&(this.refresh(),e.needRefresh=!0)}},n.inherits(e,i),t("../chart").define("scatter",e),e}),i("echarts/chart/bar",["require","./base","zrender/shape/Rectangle","../component/axis","../component/grid","../component/dataZoom","../config","../util/ecData","zrender/tool/util","zrender/tool/color","../chart"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Rectangle");t("../component/axis"),t("../component/grid"),t("../component/dataZoom");var s=t("../config");s.bar={zlevel:0,z:2,clickable:!0,legendHoverLink:!0,xAxisIndex:0,yAxisIndex:0,barMinHeight:0,barGap:"30%",barCategoryGap:"20%",itemStyle:{normal:{barBorderColor:"#fff",barBorderRadius:0,barBorderWidth:0,label:{show:!1}},emphasis:{barBorderColor:"#fff",barBorderRadius:0,barBorderWidth:0,label:{show:!1}}}};var n=t("../util/ecData"),r=t("zrender/tool/util"),a=t("zrender/tool/color");return e.prototype={type:s.CHART_TYPE_BAR,_buildShape:function(){this._buildPosition()},_buildNormal:function(t,e,i,n,r){for(var a,h,l,d,c,p,u,g,f,m,_,y,x=this.series,v=i[0][0],b=x[v],S="horizontal"==r,T=this.component.xAxis,z=this.component.yAxis,C=S?T.getAxis(b.xAxisIndex):z.getAxis(b.yAxisIndex),w=this._mapSize(C,i),L=w.gap,E=w.barGap,M=w.barWidthMap,A=w.barMaxWidthMap,k=w.barWidth,O=w.barMinHeightMap,I=w.interval,R=this.deepQuery([this.ecTheme,s],"island.r"),P=0,D=e;D>P&&null!=C.getNameByIndex(P);P++){S?d=C.getCoordByIndex(P)-L/2:c=C.getCoordByIndex(P)+L/2;for(var B=0,H=i.length;H>B;B++){var F=x[i[B][0]].yAxisIndex||0,N=x[i[B][0]].xAxisIndex||0;a=S?z.getAxis(F):T.getAxis(N),u=p=f=g=a.getCoord(0);for(var Y=0,W=i[B].length;W>Y;Y++)v=i[B][Y],b=x[v],_=b.data[P],y=this.getDataFromOption(_,"-"),n[v]=n[v]||{min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY,sum:0,counter:0,average:0},l=Math.min(A[v]||Number.MAX_VALUE,M[v]||k),"-"!==y&&(y>0?(h=Y>0?a.getCoordSize(y):S?u-a.getCoord(y):a.getCoord(y)-u,1===W&&O[v]>h&&(h=O[v]),S?(p-=h,c=p):(d=p,p+=h)):0>y?(h=Y>0?a.getCoordSize(y):S?a.getCoord(y)-f:f-a.getCoord(y),1===W&&O[v]>h&&(h=O[v]),S?(c=g,g+=h):(g-=h,d=g)):(h=0,S?(p-=h,c=p):(d=p,p+=h)),n[v][P]=S?d+l/2:c-l/2,n[v].min>y&&(n[v].min=y,S?(n[v].minY=c,n[v].minX=n[v][P]):(n[v].minX=d+h,n[v].minY=n[v][P])),n[v].max<y&&(n[v].max=y,S?(n[v].maxY=c,n[v].maxX=n[v][P]):(n[v].maxX=d+h,n[v].maxY=n[v][P])),n[v].sum+=y,n[v].counter++,P%I===0&&(m=this._getBarItem(v,P,C.getNameByIndex(P),d,c-(S?0:l),S?l:h,S?h:l,S?"vertical":"horizontal"),this.shapeList.push(new o(m))));for(var Y=0,W=i[B].length;W>Y;Y++)v=i[B][Y],b=x[v],_=b.data[P],y=this.getDataFromOption(_,"-"),l=Math.min(A[v]||Number.MAX_VALUE,M[v]||k),"-"==y&&this.deepQuery([_,b,this.option],"calculable")&&(S?(p-=R,c=p):(d=p,p+=R),m=this._getBarItem(v,P,C.getNameByIndex(P),d,c-(S?0:l),S?l:R,S?R:l,S?"vertical":"horizontal"),m.hoverable=!1,m.draggable=!1,m.style.lineWidth=1,m.style.brushType="stroke",m.style.strokeColor=b.calculableHolderColor||this.ecTheme.calculableHolderColor||s.calculableHolderColor,this.shapeList.push(new o(m)));S?d+=l+E:c-=l+E}}this._calculMarkMapXY(n,i,S?"y":"x")},_buildHorizontal:function(t,e,i,o){return this._buildNormal(t,e,i,o,"horizontal")},_buildVertical:function(t,e,i,o){return this._buildNormal(t,e,i,o,"vertical")},_buildOther:function(t,e,i,s){for(var n=this.series,r=0,a=i.length;a>r;r++)for(var h=0,l=i[r].length;l>h;h++){var d=i[r][h],c=n[d],p=c.xAxisIndex||0,u=this.component.xAxis.getAxis(p),g=u.getCoord(0),f=c.yAxisIndex||0,m=this.component.yAxis.getAxis(f),_=m.getCoord(0);s[d]=s[d]||{min0:Number.POSITIVE_INFINITY,min1:Number.POSITIVE_INFINITY,max0:Number.NEGATIVE_INFINITY,max1:Number.NEGATIVE_INFINITY,sum0:0,sum1:0,counter0:0,counter1:0,average0:0,average1:0};for(var y=0,x=c.data.length;x>y;y++){var v=c.data[y],b=this.getDataFromOption(v,"-");if(b instanceof Array){var S,T,z=u.getCoord(b[0]),C=m.getCoord(b[1]),w=[v,c],L=this.deepQuery(w,"barWidth")||10,E=this.deepQuery(w,"barHeight");null!=E?(S="horizontal",b[0]>0?(L=z-g,z-=L):L=b[0]<0?g-z:0,T=this._getBarItem(d,y,b[0],z,C-E/2,L,E,S)):(S="vertical",b[1]>0?E=_-C:b[1]<0?(E=C-_,C-=E):E=0,T=this._getBarItem(d,y,b[0],z-L/2,C,L,E,S)),this.shapeList.push(new o(T)),z=u.getCoord(b[0]),C=m.getCoord(b[1]),s[d].min0>b[0]&&(s[d].min0=b[0],s[d].minY0=C,s[d].minX0=z),s[d].max0<b[0]&&(s[d].max0=b[0],s[d].maxY0=C,s[d].maxX0=z),s[d].sum0+=b[0],s[d].counter0++,s[d].min1>b[1]&&(s[d].min1=b[1],s[d].minY1=C,s[d].minX1=z),s[d].max1<b[1]&&(s[d].max1=b[1],s[d].maxY1=C,s[d].maxX1=z),s[d].sum1+=b[1],s[d].counter1++}}}this._calculMarkMapXY(s,i,"xy")},_mapSize:function(t,e,i){var o,s,n=this._findSpecialBarSzie(e,i),r=n.barWidthMap,a=n.barMaxWidthMap,h=n.barMinHeightMap,l=n.sBarWidthCounter,d=n.sBarWidthTotal,c=n.barGap,p=n.barCategoryGap,u=1;if(e.length!=l){if(i)o=t.getGap(),c=0,s=+(o/e.length).toFixed(2),0>=s&&(u=Math.floor(e.length/o),s=1);else if(o="string"==typeof p&&p.match(/%$/)?(t.getGap()*(100-parseFloat(p))/100).toFixed(2)-0:t.getGap()-p,"string"==typeof c&&c.match(/%$/)?(c=parseFloat(c)/100,s=+((o-d)/((e.length-1)*c+e.length-l)).toFixed(2),c=s*c):(c=parseFloat(c),s=+((o-d-c*(e.length-1))/(e.length-l)).toFixed(2)),0>=s)return this._mapSize(t,e,!0)}else if(o=l>1?"string"==typeof p&&p.match(/%$/)?+(t.getGap()*(100-parseFloat(p))/100).toFixed(2):t.getGap()-p:d,s=0,c=l>1?+((o-d)/(l-1)).toFixed(2):0,0>c)return this._mapSize(t,e,!0);return this._recheckBarMaxWidth(e,r,a,h,o,s,c,u)},_findSpecialBarSzie:function(t,e){for(var i,o,s,n,r=this.series,a={},h={},l={},d=0,c=0,p=0,u=t.length;u>p;p++)for(var g={barWidth:!1,barMaxWidth:!1},f=0,m=t[p].length;m>f;f++){var _=t[p][f],y=r[_];if(!e){if(g.barWidth)a[_]=i;else if(i=this.query(y,"barWidth"),null!=i){a[_]=i,c+=i,d++,g.barWidth=!0;for(var x=0,v=f;v>x;x++){var b=t[p][x];a[b]=i}}if(g.barMaxWidth)h[_]=o;else if(o=this.query(y,"barMaxWidth"),null!=o){h[_]=o,g.barMaxWidth=!0;for(var x=0,v=f;v>x;x++){var b=t[p][x];h[b]=o}}}l[_]=this.query(y,"barMinHeight"),s=null!=s?s:this.query(y,"barGap"),n=null!=n?n:this.query(y,"barCategoryGap")}return{barWidthMap:a,barMaxWidthMap:h,barMinHeightMap:l,sBarWidth:i,sBarMaxWidth:o,sBarWidthCounter:d,sBarWidthTotal:c,barGap:s,barCategoryGap:n}},_recheckBarMaxWidth:function(t,e,i,o,s,n,r,a){for(var h=0,l=t.length;l>h;h++){var d=t[h][0];i[d]&&i[d]<n&&(s-=n-i[d])}return{barWidthMap:e,barMaxWidthMap:i,barMinHeightMap:o,gap:s,barWidth:n,barGap:r,interval:a}},_getBarItem:function(t,e,i,o,s,r,h,l){var d,c=this.series,p=c[t],u=p.data[e],g=this._sIndex2ColorMap[t],f=[u,p],m=this.deepMerge(f,"itemStyle.normal"),_=this.deepMerge(f,"itemStyle.emphasis"),y=m.barBorderWidth;d={zlevel:this.getZlevelBase(),z:this.getZBase(),clickable:this.deepQuery(f,"clickable"),style:{x:o,y:s,width:r,height:h,brushType:"both",color:this.getItemStyleColor(this.deepQuery(f,"itemStyle.normal.color")||g,t,e,u),radius:m.barBorderRadius,lineWidth:y,strokeColor:m.barBorderColor},highlightStyle:{color:this.getItemStyleColor(this.deepQuery(f,"itemStyle.emphasis.color"),t,e,u),radius:_.barBorderRadius,lineWidth:_.barBorderWidth,strokeColor:_.barBorderColor},_orient:l};var x=d.style;d.highlightStyle.color=d.highlightStyle.color||("string"==typeof x.color?a.lift(x.color,-.3):x.color),x.x=Math.floor(x.x),x.y=Math.floor(x.y),x.height=Math.ceil(x.height),x.width=Math.ceil(x.width),y>0&&x.height>y&&x.width>y?(x.y+=y/2,x.height-=y,x.x+=y/2,x.width-=y):x.brushType="fill",d.highlightStyle.textColor=d.highlightStyle.color,d=this.addLabel(d,p,u,i,l);for(var v=[x,d.highlightStyle],b=0,S=v.length;S>b;b++){var T=v[b].textPosition;if("insideLeft"===T||"insideRight"===T||"insideTop"===T||"insideBottom"===T){var z=5;switch(T){case"insideLeft":v[b].textX=x.x+z,v[b].textY=x.y+x.height/2,v[b].textAlign="left",v[b].textBaseline="middle";break;case"insideRight":v[b].textX=x.x+x.width-z,v[b].textY=x.y+x.height/2,v[b].textAlign="right",v[b].textBaseline="middle";break;case"insideTop":v[b].textX=x.x+x.width/2,v[b].textY=x.y+z/2,v[b].textAlign="center",v[b].textBaseline="top";break;case"insideBottom":v[b].textX=x.x+x.width/2,v[b].textY=x.y+x.height-z/2,v[b].textAlign="center",v[b].textBaseline="bottom"}v[b].textPosition="specific",v[b].textColor=v[b].textColor||"#fff"}}return this.deepQuery([u,p,this.option],"calculable")&&(this.setCalculable(d),d.draggable=!0),n.pack(d,c[t],t,c[t].data[e],e,i),d},getMarkCoord:function(t,e){var i,o,s=this.series[t],n=this.xMarkMap[t],r=this.component.xAxis.getAxis(s.xAxisIndex),a=this.component.yAxis.getAxis(s.yAxisIndex);if(!e.type||"max"!==e.type&&"min"!==e.type&&"average"!==e.type)if(n.isHorizontal){i="string"==typeof e.xAxis&&r.getIndexByName?r.getIndexByName(e.xAxis):e.xAxis||0;var h=n[i];h=null!=h?h:"string"!=typeof e.xAxis&&r.getCoordByIndex?r.getCoordByIndex(e.xAxis||0):r.getCoord(e.xAxis||0),o=[h,a.getCoord(e.yAxis||0)]}else{i="string"==typeof e.yAxis&&a.getIndexByName?a.getIndexByName(e.yAxis):e.yAxis||0;var l=n[i];l=null!=l?l:"string"!=typeof e.yAxis&&a.getCoordByIndex?a.getCoordByIndex(e.yAxis||0):a.getCoord(e.yAxis||0),o=[r.getCoord(e.xAxis||0),l]}else{var d=null!=e.valueIndex?e.valueIndex:null!=n.maxX0?"1":"";o=[n[e.type+"X"+d],n[e.type+"Y"+d],n[e.type+"Line"+d],n[e.type+d]]}return o},refresh:function(t){t&&(this.option=t,this.series=t.series),this.backupShapeList(),this._buildShape()},addDataAnimation:function(t,e){function i(){f--,0===f&&e&&e()}for(var o=this.series,s={},r=0,a=t.length;a>r;r++)s[t[r][0]]=t[r];for(var h,l,d,c,p,u,g,f=0,r=this.shapeList.length-1;r>=0;r--)if(u=n.get(this.shapeList[r],"seriesIndex"),s[u]&&!s[u][3]&&"rectangle"===this.shapeList[r].type){if(g=n.get(this.shapeList[r],"dataIndex"),p=o[u],s[u][2]&&g===p.data.length-1){this.zr.delShape(this.shapeList[r].id);continue}if(!s[u][2]&&0===g){this.zr.delShape(this.shapeList[r].id);continue}"horizontal"===this.shapeList[r]._orient?(c=this.component.yAxis.getAxis(p.yAxisIndex||0).getGap(),d=s[u][2]?-c:c,h=0):(l=this.component.xAxis.getAxis(p.xAxisIndex||0).getGap(),h=s[u][2]?l:-l,d=0),this.shapeList[r].position=[0,0],f++,this.zr.animate(this.shapeList[r].id,"").when(this.query(this.option,"animationDurationUpdate"),{position:[h,d]}).done(i).start()}f||i()}},r.inherits(e,i),t("../chart").define("bar",e),e}),i("echarts/util/shape/Symbol",["require","zrender/shape/Base","zrender/shape/Polygon","zrender/tool/util","./normalIsCover"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("zrender/shape/Polygon"),s=new o({}),n=t("zrender/tool/util");return e.prototype={type:"symbol",buildPath:function(t,e){var i=e.pointList,o=i.length;if(0!==o)for(var s,n,r,a,h,l=1e4,d=Math.ceil(o/l),c=i[0]instanceof Array,p=e.size?e.size:2,u=p,g=p/2,f=2*Math.PI,m=0;d>m;m++){t.beginPath(),s=m*l,n=s+l,n=n>o?o:n;for(var _=s;n>_;_++)if(e.random&&(r=e["randomMap"+_%20]/100,u=p*r*r,g=u/2),c?(a=i[_][0],h=i[_][1]):(a=i[_].x,h=i[_].y),3>u)t.rect(a-g,h-g,u,u);else switch(e.iconType){case"circle":t.moveTo(a,h),t.arc(a,h,g,0,f,!0);break;case"diamond":t.moveTo(a,h-g),t.lineTo(a+g/3,h-g/3),t.lineTo(a+g,h),t.lineTo(a+g/3,h+g/3),t.lineTo(a,h+g),t.lineTo(a-g/3,h+g/3),t.lineTo(a-g,h),t.lineTo(a-g/3,h-g/3),t.lineTo(a,h-g);break;default:t.rect(a-g,h-g,u,u)}if(t.closePath(),d-1>m)switch(e.brushType){case"both":t.fill(),e.lineWidth>0&&t.stroke();break;case"stroke":e.lineWidth>0&&t.stroke();break;default:t.fill()}}},getRect:function(t){return t.__rect||s.getRect(t)},isCover:t("./normalIsCover")},n.inherits(e,i),e}),i("echarts/chart/pie",["require","./base","zrender/shape/Text","zrender/shape/Ring","zrender/shape/Circle","zrender/shape/Sector","zrender/shape/Polyline","../config","../util/ecData","zrender/tool/util","zrender/tool/math","zrender/tool/color","../chart"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n);var r=this;r.shapeHandler.onmouseover=function(t){var e=t.target,i=l.get(e,"seriesIndex"),o=l.get(e,"dataIndex"),s=l.get(e,"special"),n=[e.style.x,e.style.y],a=e.style.startAngle,h=e.style.endAngle,d=((h+a)/2+360)%360,c=e.highlightStyle.color,p=r.getLabel(i,o,s,n,d,c,!0);p&&r.zr.addHoverShape(p);var u=r.getLabelLine(i,o,n,e.style.r0,e.style.r,d,c,!0);u&&r.zr.addHoverShape(u)},this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Text"),s=t("zrender/shape/Ring"),n=t("zrender/shape/Circle"),r=t("zrender/shape/Sector"),a=t("zrender/shape/Polyline"),h=t("../config");h.pie={zlevel:0,z:2,clickable:!0,legendHoverLink:!0,center:["50%","50%"],radius:[0,"75%"],clockWise:!0,startAngle:90,minAngle:0,selectedOffset:10,itemStyle:{normal:{borderColor:"rgba(0,0,0,0)",borderWidth:1,label:{show:!0,position:"outer"},labelLine:{show:!0,length:20,lineStyle:{width:1,type:"solid"}}},emphasis:{borderColor:"rgba(0,0,0,0)",borderWidth:1,label:{show:!1},labelLine:{show:!1,length:20,lineStyle:{width:1,type:"solid"}}}}};var l=t("../util/ecData"),d=t("zrender/tool/util"),c=t("zrender/tool/math"),p=t("zrender/tool/color");return e.prototype={type:h.CHART_TYPE_PIE,_buildShape:function(){var t=this.series,e=this.component.legend;this.selectedMap={},this._selected={};var i,o,r;this._selectedMode=!1;for(var a,d=0,c=t.length;c>d;d++)if(t[d].type===h.CHART_TYPE_PIE){if(t[d]=this.reformOption(t[d]),this.legendHoverLink=t[d].legendHoverLink||this.legendHoverLink,a=t[d].name||"",this.selectedMap[a]=e?e.isSelected(a):!0,!this.selectedMap[a])continue;i=this.parseCenter(this.zr,t[d].center),o=this.parseRadius(this.zr,t[d].radius),this._selectedMode=this._selectedMode||t[d].selectedMode,this._selected[d]=[],this.deepQuery([t[d],this.option],"calculable")&&(r={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:i[0],y:i[1],r0:o[0]<=10?0:o[0]-10,r:o[1]+10,brushType:"stroke",lineWidth:1,strokeColor:t[d].calculableHolderColor||this.ecTheme.calculableHolderColor||h.calculableHolderColor}},l.pack(r,t[d],d,void 0,-1),this.setCalculable(r),r=o[0]<=10?new n(r):new s(r),this.shapeList.push(r)),this._buildSinglePie(d),this.buildMark(d)}this.addShapeList()},_buildSinglePie:function(t){for(var e,i=this.series,o=i[t],s=o.data,n=this.component.legend,r=0,a=0,h=0,l=Number.NEGATIVE_INFINITY,d=[],c=0,p=s.length;p>c;c++)e=s[c].name,this.selectedMap[e]=n?n.isSelected(e):!0,this.selectedMap[e]&&!isNaN(s[c].value)&&(0!==+s[c].value?r++:a++,h+=+s[c].value,l=Math.max(l,+s[c].value));if(0!==h){for(var u,g,f,m,_,y,x=100,v=o.clockWise,b=(o.startAngle.toFixed(2)-0+360)%360,S=o.minAngle||.01,T=360-S*r-.01*a,z=o.roseType,c=0,p=s.length;p>c;c++)if(e=s[c].name,this.selectedMap[e]&&!isNaN(s[c].value)){if(g=n?n.getColor(e):this.zr.getColor(c),x=s[c].value/h,u="area"!=z?v?b-x*T-(0!==x?S:.01):x*T+b+(0!==x?S:.01):v?b-360/p:360/p+b,u=u.toFixed(2)-0,x=(100*x).toFixed(2),f=this.parseCenter(this.zr,o.center),m=this.parseRadius(this.zr,o.radius),_=+m[0],y=+m[1],"radius"===z?y=s[c].value/l*(y-_)*.8+.2*(y-_)+_:"area"===z&&(y=Math.sqrt(s[c].value/l)*(y-_)+_),v){var C;C=b,b=u,u=C}this._buildItem(d,t,c,x,s[c].selected,f,_,y,b,u,g),v||(b=u)}this._autoLabelLayout(d,f,y);for(var c=0,p=d.length;p>c;c++)this.shapeList.push(d[c]);d=null}},_buildItem:function(t,e,i,o,s,n,r,a,h,d,c){var p=this.series,u=((d+h)/2+360)%360,g=this.getSector(e,i,o,s,n,r,a,h,d,c);l.pack(g,p[e],e,p[e].data[i],i,p[e].data[i].name,o),t.push(g);var f=this.getLabel(e,i,o,n,u,c,!1),m=this.getLabelLine(e,i,n,r,a,u,c,!1);m&&(l.pack(m,p[e],e,p[e].data[i],i,p[e].data[i].name,o),t.push(m)),f&&(l.pack(f,p[e],e,p[e].data[i],i,p[e].data[i].name,o),f._labelLine=m,t.push(f))},getSector:function(t,e,i,o,s,n,a,h,l,d){var u=this.series,g=u[t],f=g.data[e],m=[f,g],_=this.deepMerge(m,"itemStyle.normal")||{},y=this.deepMerge(m,"itemStyle.emphasis")||{},x=this.getItemStyleColor(_.color,t,e,f)||d,v=this.getItemStyleColor(y.color,t,e,f)||("string"==typeof x?p.lift(x,-.2):x),b={zlevel:this.getZlevelBase(),z:this.getZBase(),clickable:this.deepQuery(m,"clickable"),style:{x:s[0],y:s[1],r0:n,r:a,startAngle:h,endAngle:l,brushType:"both",color:x,lineWidth:_.borderWidth,strokeColor:_.borderColor,lineJoin:"round"},highlightStyle:{color:v,lineWidth:y.borderWidth,strokeColor:y.borderColor,lineJoin:"round"},_seriesIndex:t,_dataIndex:e};if(o){var S=((b.style.startAngle+b.style.endAngle)/2).toFixed(2)-0;b.style._hasSelected=!0,b.style._x=b.style.x,b.style._y=b.style.y;var T=this.query(g,"selectedOffset");b.style.x+=c.cos(S,!0)*T,b.style.y-=c.sin(S,!0)*T,this._selected[t][e]=!0}else this._selected[t][e]=!1;return this._selectedMode&&(b.onclick=this.shapeHandler.onclick),this.deepQuery([f,g,this.option],"calculable")&&(this.setCalculable(b),b.draggable=!0),(this._needLabel(g,f,!0)||this._needLabelLine(g,f,!0))&&(b.onmouseover=this.shapeHandler.onmouseover),b=new r(b)},getLabel:function(t,e,i,s,n,r,a){var h=this.series,l=h[t],p=l.data[e];if(this._needLabel(l,p,a)){var u,g,f,m=a?"emphasis":"normal",_=d.merge(d.clone(p.itemStyle)||{},l.itemStyle),y=_[m].label,x=y.textStyle||{},v=s[0],b=s[1],S=this.parseRadius(this.zr,l.radius),T="middle";y.position=y.position||_.normal.label.position,"center"===y.position?(u=v,g=b,f="center"):"inner"===y.position||"inside"===y.position?(S=(S[0]+S[1])*(y.distance||.5),u=Math.round(v+S*c.cos(n,!0)),g=Math.round(b-S*c.sin(n,!0)),r="#fff",f="center"):(S=S[1]- -_[m].labelLine.length,u=Math.round(v+S*c.cos(n,!0)),g=Math.round(b-S*c.sin(n,!0)),f=n>=90&&270>=n?"right":"left"),"center"!=y.position&&"inner"!=y.position&&"inside"!=y.position&&(u+="left"===f?20:-20),p.__labelX=u-("left"===f?5:-5),p.__labelY=g;var z=new o({zlevel:this.getZlevelBase(),z:this.getZBase()+1,hoverable:!1,style:{x:u,y:g,color:x.color||r,text:this.getLabelText(t,e,i,m),textAlign:x.align||f,textBaseline:x.baseline||T,textFont:this.getFont(x)},highlightStyle:{brushType:"fill"}});return z._radius=S,z._labelPosition=y.position||"outer",z._rect=z.getRect(z.style),z._seriesIndex=t,z._dataIndex=e,z}},getLabelText:function(t,e,i,o){var s=this.series,n=s[t],r=n.data[e],a=this.deepQuery([r,n],"itemStyle."+o+".label.formatter");return a?"function"==typeof a?a.call(this.myChart,{seriesIndex:t,seriesName:n.name||"",series:n,dataIndex:e,data:r,name:r.name,value:r.value,percent:i}):"string"==typeof a?(a=a.replace("{a}","{a0}").replace("{b}","{b0}").replace("{c}","{c0}").replace("{d}","{d0}"),a=a.replace("{a0}",n.name).replace("{b0}",r.name).replace("{c0}",r.value).replace("{d0}",i)):void 0:r.name},getLabelLine:function(t,e,i,o,s,n,r,h){var l=this.series,p=l[t],u=p.data[e];if(this._needLabelLine(p,u,h)){var g=h?"emphasis":"normal",f=d.merge(d.clone(u.itemStyle)||{},p.itemStyle),m=f[g].labelLine,_=m.lineStyle||{},y=i[0],x=i[1],v=s,b=this.parseRadius(this.zr,p.radius)[1]- -m.length,S=c.cos(n,!0),T=c.sin(n,!0);return new a({zlevel:this.getZlevelBase(),z:this.getZBase()+1,hoverable:!1,style:{pointList:[[y+v*S,x-v*T],[y+b*S,x-b*T],[u.__labelX,u.__labelY]],strokeColor:_.color||r,lineType:_.type,lineWidth:_.width},_seriesIndex:t,_dataIndex:e})}},_needLabel:function(t,e,i){return this.deepQuery([e,t],"itemStyle."+(i?"emphasis":"normal")+".label.show")},_needLabelLine:function(t,e,i){return this.deepQuery([e,t],"itemStyle."+(i?"emphasis":"normal")+".labelLine.show")},_autoLabelLayout:function(t,e,i){for(var o=[],s=[],n=0,r=t.length;r>n;n++)("outer"===t[n]._labelPosition||"outside"===t[n]._labelPosition)&&(t[n]._rect._y=t[n]._rect.y,t[n]._rect.x<e[0]?o.push(t[n]):s.push(t[n]));this._layoutCalculate(o,e,i,-1),this._layoutCalculate(s,e,i,1)},_layoutCalculate:function(t,e,i,o){function s(e,i,o){for(var s=e;i>s;s++)if(t[s]._rect.y+=o,t[s].style.y+=o,t[s]._labelLine&&(t[s]._labelLine.style.pointList[1][1]+=o,t[s]._labelLine.style.pointList[2][1]+=o),s>e&&i>s+1&&t[s+1]._rect.y>t[s]._rect.y+t[s]._rect.height)return void n(s,o/2);n(i-1,o/2)}function n(e,i){for(var o=e;o>=0&&(t[o]._rect.y-=i,t[o].style.y-=i,t[o]._labelLine&&(t[o]._labelLine.style.pointList[1][1]-=i,t[o]._labelLine.style.pointList[2][1]-=i),!(o>0&&t[o]._rect.y>t[o-1]._rect.y+t[o-1]._rect.height));o--);}function r(t,e,i,o,s){for(var n,r,a,h=i[0],l=i[1],d=s>0?e?Number.MAX_VALUE:0:e?Number.MAX_VALUE:0,c=0,p=t.length;p>c;c++)r=Math.abs(t[c]._rect.y-l),a=t[c]._radius-o,n=o+a>r?Math.sqrt((o+a+20)*(o+a+20)-Math.pow(t[c]._rect.y-l,2)):Math.abs(t[c]._rect.x+(s>0?0:t[c]._rect.width)-h),e&&n>=d&&(n=d-10),!e&&d>=n&&(n=d+10),t[c]._rect.x=t[c].style.x=h+n*s,t[c]._labelLine&&(t[c]._labelLine.style.pointList[2][0]=h+(n-5)*s,t[c]._labelLine.style.pointList[1][0]=h+(n-20)*s),d=n}t.sort(function(t,e){return t._rect.y-e._rect.y});for(var a,h=0,l=t.length,d=[],c=[],p=0;l>p;p++)a=t[p]._rect.y-h,0>a&&s(p,l,-a,o),h=t[p]._rect.y+t[p]._rect.height;this.zr.getHeight()-h<0&&n(l-1,h-this.zr.getHeight());for(var p=0;l>p;p++)t[p]._rect.y>=e[1]?c.push(t[p]):d.push(t[p]);r(c,!0,e,i,o),r(d,!1,e,i,o)},reformOption:function(t){var e=d.merge;return t=e(e(t||{},d.clone(this.ecTheme.pie||{})),d.clone(h.pie)),t.itemStyle.normal.label.textStyle=this.getTextStyle(t.itemStyle.normal.label.textStyle),t.itemStyle.emphasis.label.textStyle=this.getTextStyle(t.itemStyle.emphasis.label.textStyle),this.z=t.z,this.zlevel=t.zlevel,t},refresh:function(t){t&&(this.option=t,this.series=t.series),this.backupShapeList(),this._buildShape()},addDataAnimation:function(t,e){function i(){a--,0===a&&e&&e()}for(var o=this.series,s={},n=0,r=t.length;r>n;n++)s[t[n][0]]=t[n];var a=0,l={},d={},c={},p=this.shapeList;this.shapeList=[];for(var u,g,f,m={},n=0,r=t.length;r>n;n++)u=t[n][0],g=t[n][2],f=t[n][3],o[u]&&o[u].type===h.CHART_TYPE_PIE&&(g?(f||(l[u+"_"+o[u].data.length]="delete"),m[u]=1):f?m[u]=0:(l[u+"_-1"]="delete",m[u]=-1),this._buildSinglePie(u));for(var _,y,n=0,r=this.shapeList.length;r>n;n++)switch(u=this.shapeList[n]._seriesIndex,_=this.shapeList[n]._dataIndex,y=u+"_"+_,this.shapeList[n].type){case"sector":l[y]=this.shapeList[n];break;case"text":d[y]=this.shapeList[n];break;case"polyline":c[y]=this.shapeList[n]}this.shapeList=[];for(var x,n=0,r=p.length;r>n;n++)if(u=p[n]._seriesIndex,s[u]){if(_=p[n]._dataIndex+m[u],y=u+"_"+_,x=l[y],!x)continue;if("sector"===p[n].type)"delete"!=x?(a++,this.zr.animate(p[n].id,"style").when(400,{startAngle:x.style.startAngle,endAngle:x.style.endAngle}).done(i).start()):(a++,this.zr.animate(p[n].id,"style").when(400,m[u]<0?{startAngle:p[n].style.startAngle}:{endAngle:p[n].style.endAngle}).done(i).start());else if("text"===p[n].type||"polyline"===p[n].type)if("delete"===x)this.zr.delShape(p[n].id);else switch(p[n].type){case"text":a++,x=d[y],this.zr.animate(p[n].id,"style").when(400,{x:x.style.x,y:x.style.y}).done(i).start();break;case"polyline":a++,x=c[y],this.zr.animate(p[n].id,"style").when(400,{pointList:x.style.pointList}).done(i).start()}}this.shapeList=p,a||i()},onclick:function(t){var e=this.series;if(this.isClick&&t.target){this.isClick=!1;for(var i,o=t.target,s=o.style,n=l.get(o,"seriesIndex"),r=l.get(o,"dataIndex"),a=0,d=this.shapeList.length;d>a;a++)if(this.shapeList[a].id===o.id){if(n=l.get(o,"seriesIndex"),r=l.get(o,"dataIndex"),s._hasSelected)o.style.x=o.style._x,o.style.y=o.style._y,o.style._hasSelected=!1,this._selected[n][r]=!1;else{var p=((s.startAngle+s.endAngle)/2).toFixed(2)-0;o.style._hasSelected=!0,this._selected[n][r]=!0,o.style._x=o.style.x,o.style._y=o.style.y,i=this.query(e[n],"selectedOffset"),o.style.x+=c.cos(p,!0)*i,o.style.y-=c.sin(p,!0)*i}this.zr.modShape(o.id)}else this.shapeList[a].style._hasSelected&&"single"===this._selectedMode&&(n=l.get(this.shapeList[a],"seriesIndex"),r=l.get(this.shapeList[a],"dataIndex"),this.shapeList[a].style.x=this.shapeList[a].style._x,this.shapeList[a].style.y=this.shapeList[a].style._y,this.shapeList[a].style._hasSelected=!1,this._selected[n][r]=!1,this.zr.modShape(this.shapeList[a].id));this.messageCenter.dispatch(h.EVENT.PIE_SELECTED,t.event,{selected:this._selected,target:l.get(o,"name")},this.myChart),this.zr.refreshNextFrame()}}},d.inherits(e,i),t("../chart").define("pie",e),e}),i("echarts/component/grid",["require","./base","zrender/shape/Rectangle","../config","zrender/tool/util","../component"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Rectangle"),s=t("../config");s.grid={zlevel:0,z:0,x:80,y:60,x2:80,y2:60,backgroundColor:"rgba(0,0,0,0)",borderWidth:1,borderColor:"#ccc"};var n=t("zrender/tool/util");return e.prototype={type:s.COMPONENT_TYPE_GRID,getX:function(){return this._x},getY:function(){return this._y},getWidth:function(){return this._width},getHeight:function(){return this._height},getXend:function(){return this._x+this._width},getYend:function(){return this._y+this._height},getArea:function(){return{x:this._x,y:this._y,width:this._width,height:this._height}},getBbox:function(){return[[this._x,this._y],[this.getXend(),this.getYend()]]},refixAxisShape:function(t){for(var e,i,o,n=t.xAxis._axisList.concat(t.yAxis?t.yAxis._axisList:[]),r=n.length;r--;)o=n[r],o.type==s.COMPONENT_TYPE_AXIS_VALUE&&o._min<0&&o._max>=0&&(o.isHorizontal()?e=o.getCoord(0):i=o.getCoord(0));if("undefined"!=typeof e||"undefined"!=typeof i)for(r=n.length;r--;)n[r].refixAxisShape(e,i)},refresh:function(t){if(t||this._zrWidth!=this.zr.getWidth()||this._zrHeight!=this.zr.getHeight()){this.clear(),this.option=t||this.option,this.option.grid=this.reformOption(this.option.grid);var e=this.option.grid;this._zrWidth=this.zr.getWidth(),this._zrHeight=this.zr.getHeight(),this._x=this.parsePercent(e.x,this._zrWidth),this._y=this.parsePercent(e.y,this._zrHeight);var i=this.parsePercent(e.x2,this._zrWidth),s=this.parsePercent(e.y2,this._zrHeight);this._width="undefined"==typeof e.width?this._zrWidth-this._x-i:this.parsePercent(e.width,this._zrWidth),this._width=this._width<=0?10:this._width,this._height="undefined"==typeof e.height?this._zrHeight-this._y-s:this.parsePercent(e.height,this._zrHeight),this._height=this._height<=0?10:this._height,this._x=this.subPixelOptimize(this._x,e.borderWidth),this._y=this.subPixelOptimize(this._y,e.borderWidth),this.shapeList.push(new o({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._x,y:this._y,width:this._width,height:this._height,brushType:e.borderWidth>0?"both":"fill",color:e.backgroundColor,strokeColor:e.borderColor,lineWidth:e.borderWidth}})),this.zr.addShape(this.shapeList[0])
}}},n.inherits(e,i),t("../component").define("grid",e),e}),i("echarts/chart/base",["require","zrender/shape/Image","../util/shape/Icon","../util/shape/MarkLine","../util/shape/Symbol","zrender/shape/Polyline","zrender/shape/ShapeBundle","../config","../util/ecData","../util/ecAnimation","../util/ecEffect","../util/accMath","../component/base","../layout/EdgeBundling","zrender/tool/util","zrender/tool/area"],function(t){function e(t){return null!=t.x&&null!=t.y}function i(t,e,i,o,s){g.call(this,t,e,i,o,s);var n=this;this.selectedMap={},this.lastShapeList=[],this.shapeHandler={onclick:function(){n.isClick=!0},ondragover:function(t){var e=t.target;e.highlightStyle=e.highlightStyle||{};var i=e.highlightStyle,o=i.brushTyep,s=i.strokeColor,r=i.lineWidth;i.brushType="stroke",i.strokeColor=n.ecTheme.calculableColor||l.calculableColor,i.lineWidth="icon"===e.type?30:10,n.zr.addHoverShape(e),setTimeout(function(){i&&(i.brushType=o,i.strokeColor=s,i.lineWidth=r)},20)},ondrop:function(t){null!=d.get(t.dragged,"data")&&(n.isDrop=!0)},ondragend:function(){n.isDragend=!0}}}var o=t("zrender/shape/Image"),s=t("../util/shape/Icon"),n=t("../util/shape/MarkLine"),r=t("../util/shape/Symbol"),a=t("zrender/shape/Polyline"),h=t("zrender/shape/ShapeBundle"),l=t("../config"),d=t("../util/ecData"),c=t("../util/ecAnimation"),p=t("../util/ecEffect"),u=t("../util/accMath"),g=t("../component/base"),f=t("../layout/EdgeBundling"),m=t("zrender/tool/util"),_=t("zrender/tool/area");return i.prototype={setCalculable:function(t){return t.dragEnableTime=this.ecTheme.DRAG_ENABLE_TIME||l.DRAG_ENABLE_TIME,t.ondragover=this.shapeHandler.ondragover,t.ondragend=this.shapeHandler.ondragend,t.ondrop=this.shapeHandler.ondrop,t},ondrop:function(t,e){if(this.isDrop&&t.target&&!e.dragIn){var i,o=t.target,s=t.dragged,n=d.get(o,"seriesIndex"),r=d.get(o,"dataIndex"),a=this.series,h=this.component.legend;if(-1===r){if(d.get(s,"seriesIndex")==n)return e.dragOut=e.dragIn=e.needRefresh=!0,void(this.isDrop=!1);i={value:d.get(s,"value"),name:d.get(s,"name")},this.type===l.CHART_TYPE_PIE&&i.value<0&&(i.value=0);for(var c=!1,p=a[n].data,g=0,f=p.length;f>g;g++)p[g].name===i.name&&"-"===p[g].value&&(a[n].data[g].value=i.value,c=!0);!c&&a[n].data.push(i),h&&h.add(i.name,s.style.color||s.style.strokeColor)}else i=a[n].data[r]||"-",null!=i.value?(a[n].data[r].value="-"!=i.value?u.accAdd(a[n].data[r].value,d.get(s,"value")):d.get(s,"value"),(this.type===l.CHART_TYPE_FUNNEL||this.type===l.CHART_TYPE_PIE)&&(h&&1===h.getRelatedAmount(i.name)&&this.component.legend.del(i.name),i.name+=this.option.nameConnector+d.get(s,"name"),h&&h.add(i.name,s.style.color||s.style.strokeColor))):a[n].data[r]="-"!=i?u.accAdd(a[n].data[r],d.get(s,"value")):d.get(s,"value");e.dragIn=e.dragIn||!0,this.isDrop=!1;var m=this;setTimeout(function(){m.zr.trigger("mousemove",t.event)},300)}},ondragend:function(t,e){if(this.isDragend&&t.target&&!e.dragOut){var i=t.target,o=d.get(i,"seriesIndex"),s=d.get(i,"dataIndex"),n=this.series;if(null!=n[o].data[s].value){n[o].data[s].value="-";var r=n[o].data[s].name,a=this.component.legend;a&&0===a.getRelatedAmount(r)&&a.del(r)}else n[o].data[s]="-";e.dragOut=!0,e.needRefresh=!0,this.isDragend=!1}},onlegendSelected:function(t,e){var i=t.selected;for(var o in this.selectedMap)this.selectedMap[o]!=i[o]&&(e.needRefresh=!0),this.selectedMap[o]=i[o]},_buildPosition:function(){this._symbol=this.option.symbolList,this._sIndex2ShapeMap={},this._sIndex2ColorMap={},this.selectedMap={},this.xMarkMap={};for(var t,e,i,o,s=this.series,n={top:[],bottom:[],left:[],right:[],other:[]},r=0,a=s.length;a>r;r++)s[r].type===this.type&&(s[r]=this.reformOption(s[r]),this.legendHoverLink=s[r].legendHoverLink||this.legendHoverLink,t=s[r].xAxisIndex,e=s[r].yAxisIndex,i=this.component.xAxis.getAxis(t),o=this.component.yAxis.getAxis(e),i.type===l.COMPONENT_TYPE_AXIS_CATEGORY?n[i.getPosition()].push(r):o.type===l.COMPONENT_TYPE_AXIS_CATEGORY?n[o.getPosition()].push(r):n.other.push(r));for(var h in n)n[h].length>0&&this._buildSinglePosition(h,n[h]);this.addShapeList()},_buildSinglePosition:function(t,e){var i=this._mapData(e),o=i.locationMap,s=i.maxDataLength;if(0!==s&&0!==o.length){switch(t){case"bottom":case"top":this._buildHorizontal(e,s,o,this.xMarkMap);break;case"left":case"right":this._buildVertical(e,s,o,this.xMarkMap);break;case"other":this._buildOther(e,s,o,this.xMarkMap)}for(var n=0,r=e.length;r>n;n++)this.buildMark(e[n])}},_mapData:function(t){for(var e,i,o,s,n=this.series,r=0,a={},h="__kener__stack__",d=this.component.legend,c=[],p=0,u=0,g=t.length;g>u;u++){if(e=n[t[u]],o=e.name,this._sIndex2ShapeMap[t[u]]=this._sIndex2ShapeMap[t[u]]||this.query(e,"symbol")||this._symbol[u%this._symbol.length],d){if(this.selectedMap[o]=d.isSelected(o),this._sIndex2ColorMap[t[u]]=d.getColor(o),s=d.getItemShape(o)){var f=s.style;if(this.type==l.CHART_TYPE_LINE)f.iconType="legendLineIcon",f.symbol=this._sIndex2ShapeMap[t[u]];else if(e.itemStyle.normal.barBorderWidth>0){var m=s.highlightStyle;f.brushType="both",f.x+=1,f.y+=1,f.width-=2,f.height-=2,f.strokeColor=m.strokeColor=e.itemStyle.normal.barBorderColor,m.lineWidth=3}d.setItemShape(o,s)}}else this.selectedMap[o]=!0,this._sIndex2ColorMap[t[u]]=this.zr.getColor(t[u]);this.selectedMap[o]&&(i=e.stack||h+t[u],null==a[i]?(a[i]=r,c[r]=[t[u]],r++):c[a[i]].push(t[u])),p=Math.max(p,e.data.length)}return{locationMap:c,maxDataLength:p}},_calculMarkMapXY:function(t,e,i){for(var o=this.series,s=0,n=e.length;n>s;s++)for(var r=0,a=e[s].length;a>r;r++){var h=e[s][r],l="xy"==i?0:"",d=this.component.grid,c=t[h];if("-1"!=i.indexOf("x")){c["counter"+l]>0&&(c["average"+l]=c["sum"+l]/c["counter"+l]);var p=this.component.xAxis.getAxis(o[h].xAxisIndex||0).getCoord(c["average"+l]);c["averageLine"+l]=[[p,d.getYend()],[p,d.getY()]],c["minLine"+l]=[[c["minX"+l],d.getYend()],[c["minX"+l],d.getY()]],c["maxLine"+l]=[[c["maxX"+l],d.getYend()],[c["maxX"+l],d.getY()]],c.isHorizontal=!1}if(l="xy"==i?1:"","-1"!=i.indexOf("y")){c["counter"+l]>0&&(c["average"+l]=c["sum"+l]/c["counter"+l]);var u=this.component.yAxis.getAxis(o[h].yAxisIndex||0).getCoord(c["average"+l]);c["averageLine"+l]=[[d.getX(),u],[d.getXend(),u]],c["minLine"+l]=[[d.getX(),c["minY"+l]],[d.getXend(),c["minY"+l]]],c["maxLine"+l]=[[d.getX(),c["maxY"+l]],[d.getXend(),c["maxY"+l]]],c.isHorizontal=!0}}},addLabel:function(t,e,i,o,s){var n=[i,e],r=this.deepMerge(n,"itemStyle.normal.label"),a=this.deepMerge(n,"itemStyle.emphasis.label"),h=r.textStyle||{},l=a.textStyle||{};if(r.show){var d=t.style;d.text=this._getLabelText(e,i,o,"normal"),d.textPosition=null==r.position?"horizontal"===s?"right":"top":r.position,d.textColor=h.color,d.textFont=this.getFont(h),d.textAlign=h.align,d.textBaseline=h.baseline}if(a.show){var c=t.highlightStyle;c.text=this._getLabelText(e,i,o,"emphasis"),c.textPosition=r.show?t.style.textPosition:null==a.position?"horizontal"===s?"right":"top":a.position,c.textColor=l.color,c.textFont=this.getFont(l),c.textAlign=l.align,c.textBaseline=l.baseline}return t},_getLabelText:function(t,e,i,o){var s=this.deepQuery([e,t],"itemStyle."+o+".label.formatter");s||"emphasis"!==o||(s=this.deepQuery([e,t],"itemStyle.normal.label.formatter"));var n=this.getDataFromOption(e,"-");return s?"function"==typeof s?s.call(this.myChart,{seriesName:t.name,series:t,name:i,value:n,data:e,status:o}):"string"==typeof s?s=s.replace("{a}","{a0}").replace("{b}","{b0}").replace("{c}","{c0}").replace("{a0}",t.name).replace("{b0}",i).replace("{c0}",this.numAddCommas(n)):void 0:n instanceof Array?null!=n[2]?this.numAddCommas(n[2]):n[0]+" , "+n[1]:this.numAddCommas(n)},buildMark:function(t){var e=this.series[t];this.selectedMap[e.name]&&(e.markLine&&this._buildMarkLine(t),e.markPoint&&this._buildMarkPoint(t))},_buildMarkPoint:function(t){for(var e,i,o=(this.markAttachStyle||{})[t],s=this.series[t],n=m.clone(s.markPoint),r=0,a=n.data.length;a>r;r++)e=n.data[r],i=this.getMarkCoord(t,e),e.x=null!=e.x?e.x:i[0],e.y=null!=e.y?e.y:i[1],!e.type||"max"!==e.type&&"min"!==e.type||(e.value=i[3],e.name=e.name||e.type,e.symbolSize=e.symbolSize||_.getTextWidth(i[3],this.getFont())/2+5);for(var h=this._markPoint(t,n),r=0,a=h.length;a>r;r++){var d=h[r];d.zlevel=this.getZlevelBase(),d.z=this.getZBase()+1;for(var c in o)d[c]=m.clone(o[c]);this.shapeList.push(d)}if(this.type===l.CHART_TYPE_FORCE||this.type===l.CHART_TYPE_CHORD)for(var r=0,a=h.length;a>r;r++)this.zr.addShape(h[r])},_buildMarkLine:function(t){for(var e,i=(this.markAttachStyle||{})[t],o=this.series[t],s=m.clone(o.markLine),n=0,r=s.data.length;r>n;n++){var a=s.data[n];!a.type||"max"!==a.type&&"min"!==a.type&&"average"!==a.type?e=[this.getMarkCoord(t,a[0]),this.getMarkCoord(t,a[1])]:(e=this.getMarkCoord(t,a),s.data[n]=[m.clone(a),{}],s.data[n][0].name=a.name||a.type,s.data[n][0].value="average"!==a.type?e[3]:+e[3].toFixed(null!=s.precision?s.precision:this.deepQuery([this.ecTheme,l],"markLine.precision")),e=e[2],a=[{},{}]),null!=e&&null!=e[0]&&null!=e[1]&&(s.data[n][0].x=null!=a[0].x?a[0].x:e[0][0],s.data[n][0].y=null!=a[0].y?a[0].y:e[0][1],s.data[n][1].x=null!=a[1].x?a[1].x:e[1][0],s.data[n][1].y=null!=a[1].y?a[1].y:e[1][1])}var d=this._markLine(t,s),c=s.large;if(c){var p=new h({style:{shapeList:d}}),u=d[0];if(u){m.merge(p.style,u.style),m.merge(p.highlightStyle={},u.highlightStyle),p.style.brushType="stroke",p.zlevel=this.getZlevelBase(),p.z=this.getZBase()+1,p.hoverable=!1;for(var g in i)p[g]=m.clone(i[g])}this.shapeList.push(p),this.zr.addShape(p),p._mark="largeLine";var f=s.effect;f.show&&(p.effect=f)}else{for(var n=0,r=d.length;r>n;n++){var _=d[n];_.zlevel=this.getZlevelBase(),_.z=this.getZBase()+1;for(var g in i)_[g]=m.clone(i[g]);this.shapeList.push(_)}if(this.type===l.CHART_TYPE_FORCE||this.type===l.CHART_TYPE_CHORD)for(var n=0,r=d.length;r>n;n++)this.zr.addShape(d[n])}},_markPoint:function(t,e){var i=this.series[t],o=this.component;m.merge(m.merge(e,m.clone(this.ecTheme.markPoint||{})),m.clone(l.markPoint)),e.name=i.name;var s,n,r,a,h,c,p,u=[],g=e.data,f=o.dataRange,_=o.legend,y=this.zr.getWidth(),x=this.zr.getHeight();if(e.large)s=this.getLargeMarkPointShape(t,e),s._mark="largePoint",s&&u.push(s);else for(var v=0,b=g.length;b>v;v++)null!=g[v].x&&null!=g[v].y&&(r=null!=g[v].value?g[v].value:"",_&&(n=_.getColor(i.name)),f&&(n=isNaN(r)?n:f.getColor(r),a=[g[v],e],h=this.deepQuery(a,"itemStyle.normal.color")||n,c=this.deepQuery(a,"itemStyle.emphasis.color")||h,null==h&&null==c)||(n=null==n?this.zr.getColor(t):n,g[v].tooltip=g[v].tooltip||e.tooltip||{trigger:"item"},g[v].name=null!=g[v].name?g[v].name:"",g[v].value=r,s=this.getSymbolShape(e,t,g[v],v,g[v].name,this.parsePercent(g[v].x,y),this.parsePercent(g[v].y,x),"pin",n,"rgba(0,0,0,0)","horizontal"),s._mark="point",p=this.deepMerge([g[v],e],"effect"),p.show&&(s.effect=p),i.type===l.CHART_TYPE_MAP&&(s._geo=this.getMarkGeo(g[v])),d.pack(s,i,t,g[v],v,g[v].name,r),u.push(s)));return u},_markLine:function(){function t(t,e){t[e]=t[e]instanceof Array?t[e].length>1?t[e]:[t[e][0],t[e][0]]:[t[e],t[e]]}return function(i,o){var s=this.series[i],n=this.component,r=n.dataRange,a=n.legend;m.merge(m.merge(o,m.clone(this.ecTheme.markLine||{})),m.clone(l.markLine));var h=a?a.getColor(s.name):this.zr.getColor(i);t(o,"symbol"),t(o,"symbolSize"),t(o,"symbolRotate");for(var c=o.data,p=[],u=this.zr.getWidth(),g=this.zr.getHeight(),_=0;_<c.length;_++){var y=c[_];if(e(y[0])&&e(y[1])){var x=this.deepMerge(y),v=[x,o],b=h,S=null!=x.value?x.value:"";if(r){b=isNaN(S)?b:r.getColor(S);var T=this.deepQuery(v,"itemStyle.normal.color")||b,z=this.deepQuery(v,"itemStyle.emphasis.color")||T;if(null==T&&null==z)continue}y[0].tooltip=x.tooltip||o.tooltip||{trigger:"item"},y[0].name=y[0].name||"",y[1].name=y[1].name||"",y[0].value=S,p.push({points:[[this.parsePercent(y[0].x,u),this.parsePercent(y[0].y,g)],[this.parsePercent(y[1].x,u),this.parsePercent(y[1].y,g)]],rawData:y,color:b})}}var C=this.query(o,"bundling.enable");if(C){var w=new f;w.maxTurningAngle=this.query(o,"bundling.maxTurningAngle")/180*Math.PI,p=w.run(p)}o.name=s.name;for(var L=[],_=0,E=p.length;E>_;_++){var M=p[_],A=M.rawEdge||M,y=A.rawData,S=null!=y.value?y.value:"",k=this.getMarkLineShape(o,i,y,_,M.points,C,A.color);k._mark="line";var O=this.deepMerge([y[0],y[1],o],"effect");O.show&&(k.effect=O,k.effect.large=o.large),s.type===l.CHART_TYPE_MAP&&(k._geo=[this.getMarkGeo(y[0]),this.getMarkGeo(y[1])]),d.pack(k,s,i,y[0],_,y[0].name+(""!==y[1].name?" > "+y[1].name:""),S),L.push(k)}return L}}(),getMarkCoord:function(){return[0,0]},getSymbolShape:function(t,e,i,n,r,a,h,l,c,p,u){var g=[i,t],f=this.getDataFromOption(i,"-");l=this.deepQuery(g,"symbol")||l;var m=this.deepQuery(g,"symbolSize");m="function"==typeof m?m(f):m,"number"==typeof m&&(m=[m,m]);var _=this.deepQuery(g,"symbolRotate"),y=this.deepMerge(g,"itemStyle.normal"),x=this.deepMerge(g,"itemStyle.emphasis"),v=null!=y.borderWidth?y.borderWidth:y.lineStyle&&y.lineStyle.width;null==v&&(v=l.match("empty")?2:0);var b=null!=x.borderWidth?x.borderWidth:x.lineStyle&&x.lineStyle.width;null==b&&(b=v+2);var S=this.getItemStyleColor(y.color,e,n,i),T=this.getItemStyleColor(x.color,e,n,i),z=m[0],C=m[1],w=new s({style:{iconType:l.replace("empty","").toLowerCase(),x:a-z,y:h-C,width:2*z,height:2*C,brushType:"both",color:l.match("empty")?p:S||c,strokeColor:y.borderColor||S||c,lineWidth:v},highlightStyle:{color:l.match("empty")?p:T||S||c,strokeColor:x.borderColor||y.borderColor||T||S||c,lineWidth:b},clickable:this.deepQuery(g,"clickable")});return l.match("image")&&(w.style.image=l.replace(new RegExp("^image:\\/\\/"),""),w=new o({style:w.style,highlightStyle:w.highlightStyle,clickable:this.deepQuery(g,"clickable")})),null!=_&&(w.rotation=[_*Math.PI/180,a,h]),l.match("star")&&(w.style.iconType="star",w.style.n=l.replace("empty","").replace("star","")-0||5),"none"===l&&(w.invisible=!0,w.hoverable=!1),w=this.addLabel(w,t,i,r,u),l.match("empty")&&(null==w.style.textColor&&(w.style.textColor=w.style.strokeColor),null==w.highlightStyle.textColor&&(w.highlightStyle.textColor=w.highlightStyle.strokeColor)),d.pack(w,t,e,i,n,r),w._x=a,w._y=h,w._dataIndex=n,w._seriesIndex=e,w},getMarkLineShape:function(t,e,i,o,s,r,h){var l=null!=i[0].value?i[0].value:"-",d=null!=i[1].value?i[1].value:"-",c=[i[0].symbol||t.symbol[0],i[1].symbol||t.symbol[1]],p=[i[0].symbolSize||t.symbolSize[0],i[1].symbolSize||t.symbolSize[1]];p[0]="function"==typeof p[0]?p[0](l):p[0],p[1]="function"==typeof p[1]?p[1](d):p[1];var u=[this.query(i[0],"symbolRotate")||t.symbolRotate[0],this.query(i[1],"symbolRotate")||t.symbolRotate[1]],g=[i[0],i[1],t],f=this.deepMerge(g,"itemStyle.normal");f.color=this.getItemStyleColor(f.color,e,o,i);var m=this.deepMerge(g,"itemStyle.emphasis");m.color=this.getItemStyleColor(m.color,e,o,i);var _=f.lineStyle,y=m.lineStyle,x=_.width;null==x&&(x=f.borderWidth);var v=y.width;null==v&&(v=null!=m.borderWidth?m.borderWidth:x+2);var b=this.deepQuery(g,"smoothness");this.deepQuery(g,"smooth")||(b=0);var S=r?a:n,T=new S({style:{symbol:c,symbolSize:p,symbolRotate:u,brushType:"both",lineType:_.type,shadowColor:_.shadowColor||_.color||f.borderColor||f.color||h,shadowBlur:_.shadowBlur,shadowOffsetX:_.shadowOffsetX,shadowOffsetY:_.shadowOffsetY,color:f.color||h,strokeColor:_.color||f.borderColor||f.color||h,lineWidth:x,symbolBorderColor:f.borderColor||f.color||h,symbolBorder:f.borderWidth},highlightStyle:{shadowColor:y.shadowColor,shadowBlur:y.shadowBlur,shadowOffsetX:y.shadowOffsetX,shadowOffsetY:y.shadowOffsetY,color:m.color||f.color||h,strokeColor:y.color||_.color||m.borderColor||f.borderColor||m.color||f.color||h,lineWidth:v,symbolBorderColor:m.borderColor||f.borderColor||m.color||f.color||h,symbolBorder:null==m.borderWidth?f.borderWidth+2:m.borderWidth},clickable:this.deepQuery(g,"clickable")}),z=T.style;return r?(z.pointList=s,z.smooth=b):(z.xStart=s[0][0],z.yStart=s[0][1],z.xEnd=s[1][0],z.yEnd=s[1][1],z.curveness=b,T.updatePoints(T.style)),T=this.addLabel(T,t,i[0],i[0].name+" : "+i[1].name)},getLargeMarkPointShape:function(t,e){var i,o,s,n,a,h,l=this.series[t],d=this.component,c=e.data,p=d.dataRange,u=d.legend,g=[c[0],e];if(u&&(o=u.getColor(l.name)),!p||(s=null!=c[0].value?c[0].value:"",o=isNaN(s)?o:p.getColor(s),n=this.deepQuery(g,"itemStyle.normal.color")||o,a=this.deepQuery(g,"itemStyle.emphasis.color")||n,null!=n||null!=a)){o=this.deepMerge(g,"itemStyle.normal").color||o;var f=this.deepQuery(g,"symbol")||"circle";f=f.replace("empty","").replace(/\d/g,""),h=this.deepMerge([c[0],e],"effect");var m=window.devicePixelRatio||1;return i=new r({style:{pointList:c,color:o,strokeColor:o,shadowColor:h.shadowColor||o,shadowBlur:(null!=h.shadowBlur?h.shadowBlur:8)*m,size:this.deepQuery(g,"symbolSize"),iconType:f,brushType:"fill",lineWidth:1},draggable:!1,hoverable:!1}),h.show&&(i.effect=h),i}},backupShapeList:function(){this.shapeList&&this.shapeList.length>0?(this.lastShapeList=this.shapeList,this.shapeList=[]):this.lastShapeList=[]},addShapeList:function(){var t,e,i=this.option.animationThreshold/(this.canvasSupported?2:4),o=this.lastShapeList,s=this.shapeList,n=o.length>0,r=n?this.query(this.option,"animationDurationUpdate"):this.query(this.option,"animationDuration"),a=this.query(this.option,"animationEasing"),h={},d={};if(this.option.animation&&!this.option.renderAsImage&&s.length<i&&!this.motionlessOnce){for(var c=0,p=o.length;p>c;c++)e=this._getAnimationKey(o[c]),e.match("undefined")?this.zr.delShape(o[c].id):(e+=o[c].type,h[e]?this.zr.delShape(o[c].id):h[e]=o[c]);for(var c=0,p=s.length;p>c;c++)e=this._getAnimationKey(s[c]),e.match("undefined")?this.zr.addShape(s[c]):(e+=s[c].type,d[e]=s[c]);for(e in h)d[e]||this.zr.delShape(h[e].id);for(e in d)h[e]?(this.zr.delShape(h[e].id),this._animateMod(h[e],d[e],r,a,0,n)):(t=this.type!=l.CHART_TYPE_LINE&&this.type!=l.CHART_TYPE_RADAR||0===e.indexOf("icon")?0:r/2,this._animateMod(!1,d[e],r,a,t,n));this.zr.refresh(),this.animationEffect()}else{this.motionlessOnce=!1,this.zr.delShape(o);for(var c=0,p=s.length;p>c;c++)this.zr.addShape(s[c])}},_getAnimationKey:function(t){return this.type!=l.CHART_TYPE_MAP&&this.type!=l.CHART_TYPE_TREEMAP&&this.type!=l.CHART_TYPE_VENN?d.get(t,"seriesIndex")+"_"+d.get(t,"dataIndex")+(t._mark?t._mark:"")+(this.type===l.CHART_TYPE_RADAR?d.get(t,"special"):""):d.get(t,"seriesIndex")+"_"+d.get(t,"dataIndex")+(t._mark?t._mark:"undefined")},_animateMod:function(t,e,i,o,s,n){switch(e.type){case"polyline":case"half-smooth-polygon":c.pointList(this.zr,t,e,i,o);break;case"rectangle":c.rectangle(this.zr,t,e,i,o);break;case"image":case"icon":c.icon(this.zr,t,e,i,o,s);break;case"candle":n?this.zr.addShape(e):c.candle(this.zr,t,e,i,o);break;case"ring":case"sector":case"circle":n?"sector"===e.type?c.sector(this.zr,t,e,i,o):this.zr.addShape(e):c.ring(this.zr,t,e,i+(d.get(e,"dataIndex")||0)%20*100,o);break;case"text":c.text(this.zr,t,e,i,o);break;case"polygon":n?c.pointList(this.zr,t,e,i,o):c.polygon(this.zr,t,e,i,o);break;case"ribbon":c.ribbon(this.zr,t,e,i,o);break;case"gauge-pointer":c.gaugePointer(this.zr,t,e,i,o);break;case"mark-line":c.markline(this.zr,t,e,i,o);break;case"bezier-curve":case"line":c.line(this.zr,t,e,i,o);break;default:this.zr.addShape(e)}},animationMark:function(t,e,i){for(var i=i||this.shapeList,o=0,s=i.length;s>o;o++)i[o]._mark&&this._animateMod(!1,i[o],t,e,0,!0);this.animationEffect(i)},animationEffect:function(t){if(!t&&this.clearEffectShape(),t=t||this.shapeList,null!=t){var e=l.EFFECT_ZLEVEL;this.canvasSupported&&this.zr.modLayer(e,{motionBlur:!0,lastFrameAlpha:.95});for(var i,o=0,s=t.length;s>o;o++)i=t[o],i._mark&&i.effect&&i.effect.show&&p[i._mark]&&(p[i._mark](this.zr,this.effectList,i,e),this.effectList[this.effectList.length-1]._mark=i._mark)}},clearEffectShape:function(t){var e=this.effectList;if(this.zr&&e&&e.length>0){t&&this.zr.modLayer(l.EFFECT_ZLEVEL,{motionBlur:!1}),this.zr.delShape(e);for(var i=0;i<e.length;i++)e[i].effectAnimator&&e[i].effectAnimator.stop()}this.effectList=[]},addMark:function(t,e,i){var o=this.series[t];if(this.selectedMap[o.name]){var s=this.query(this.option,"animationDurationUpdate"),n=this.query(this.option,"animationEasing"),r=o[i].data,a=this.shapeList.length;if(o[i].data=e.data,this["_build"+i.replace("m","M")](t),this.option.animation&&!this.option.renderAsImage)this.animationMark(s,n,this.shapeList.slice(a));else{for(var h=a,l=this.shapeList.length;l>h;h++)this.zr.addShape(this.shapeList[h]);this.zr.refreshNextFrame()}o[i].data=r}},delMark:function(t,e,i){i=i.replace("mark","").replace("large","").toLowerCase();var o=this.series[t];if(this.selectedMap[o.name]){for(var s=!1,n=[this.shapeList,this.effectList],r=2;r--;)for(var a=0,h=n[r].length;h>a;a++)if(n[r][a]._mark==i&&d.get(n[r][a],"seriesIndex")==t&&d.get(n[r][a],"name")==e){this.zr.delShape(n[r][a].id),n[r].splice(a,1),s=!0;break}s&&this.zr.refreshNextFrame()}}},m.inherits(i,g),i}),i("echarts/component/axis",["require","./base","zrender/shape/Line","../config","../util/ecData","zrender/tool/util","zrender/tool/color","./categoryAxis","./valueAxis","../component"],function(t){function e(t,e,o,s,n,r){i.call(this,t,e,o,s,n),this.axisType=r,this._axisList=[],this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Line"),s=t("../config"),n=t("../util/ecData"),r=t("zrender/tool/util"),a=t("zrender/tool/color");return e.prototype={type:s.COMPONENT_TYPE_AXIS,axisBase:{_buildAxisLine:function(){var t=this.option.axisLine.lineStyle.width,e=t/2,i={_axisShape:"axisLine",zlevel:this.getZlevelBase(),z:this.getZBase()+3,hoverable:!1},s=this.grid;switch(this.option.position){case"left":i.style={xStart:s.getX()-e,yStart:s.getYend(),xEnd:s.getX()-e,yEnd:s.getY(),lineCap:"round"};break;case"right":i.style={xStart:s.getXend()+e,yStart:s.getYend(),xEnd:s.getXend()+e,yEnd:s.getY(),lineCap:"round"};break;case"bottom":i.style={xStart:s.getX(),yStart:s.getYend()+e,xEnd:s.getXend(),yEnd:s.getYend()+e,lineCap:"round"};break;case"top":i.style={xStart:s.getX(),yStart:s.getY()-e,xEnd:s.getXend(),yEnd:s.getY()-e,lineCap:"round"}}var n=i.style;""!==this.option.name&&(n.text=this.option.name,n.textPosition=this.option.nameLocation,n.textFont=this.getFont(this.option.nameTextStyle),this.option.nameTextStyle.align&&(n.textAlign=this.option.nameTextStyle.align),this.option.nameTextStyle.baseline&&(n.textBaseline=this.option.nameTextStyle.baseline),this.option.nameTextStyle.color&&(n.textColor=this.option.nameTextStyle.color)),n.strokeColor=this.option.axisLine.lineStyle.color,n.lineWidth=t,this.isHorizontal()?n.yStart=n.yEnd=this.subPixelOptimize(n.yEnd,t):n.xStart=n.xEnd=this.subPixelOptimize(n.xEnd,t),n.lineType=this.option.axisLine.lineStyle.type,i=new o(i),this.shapeList.push(i)},_axisLabelClickable:function(t,e){return t?(n.pack(e,void 0,-1,void 0,-1,e.style.text),e.hoverable=!0,e.clickable=!0,e.highlightStyle={color:a.lift(e.style.color,1),brushType:"fill"},e):e},refixAxisShape:function(t,e){if(this.option.axisLine.onZero){var i;if(this.isHorizontal()&&null!=e)for(var o=0,s=this.shapeList.length;s>o;o++)"axisLine"===this.shapeList[o]._axisShape?(this.shapeList[o].style.yStart=this.shapeList[o].style.yEnd=this.subPixelOptimize(e,this.shapeList[o].stylelineWidth),this.zr.modShape(this.shapeList[o].id)):"axisTick"===this.shapeList[o]._axisShape&&(i=this.shapeList[o].style.yEnd-this.shapeList[o].style.yStart,this.shapeList[o].style.yStart=e-i,this.shapeList[o].style.yEnd=e,this.zr.modShape(this.shapeList[o].id));if(!this.isHorizontal()&&null!=t)for(var o=0,s=this.shapeList.length;s>o;o++)"axisLine"===this.shapeList[o]._axisShape?(this.shapeList[o].style.xStart=this.shapeList[o].style.xEnd=this.subPixelOptimize(t,this.shapeList[o].stylelineWidth),this.zr.modShape(this.shapeList[o].id)):"axisTick"===this.shapeList[o]._axisShape&&(i=this.shapeList[o].style.xEnd-this.shapeList[o].style.xStart,this.shapeList[o].style.xStart=t,this.shapeList[o].style.xEnd=t+i,this.zr.modShape(this.shapeList[o].id))}},getPosition:function(){return this.option.position},isHorizontal:function(){return"bottom"===this.option.position||"top"===this.option.position}},reformOption:function(t){if(!t||t instanceof Array&&0===t.length?t=[{type:s.COMPONENT_TYPE_AXIS_VALUE}]:t instanceof Array||(t=[t]),t.length>2&&(t=[t[0],t[1]]),"xAxis"===this.axisType){(!t[0].position||"bottom"!=t[0].position&&"top"!=t[0].position)&&(t[0].position="bottom"),t.length>1&&(t[1].position="bottom"===t[0].position?"top":"bottom");for(var e=0,i=t.length;i>e;e++)t[e].type=t[e].type||"category",t[e].xAxisIndex=e,t[e].yAxisIndex=-1}else{(!t[0].position||"left"!=t[0].position&&"right"!=t[0].position)&&(t[0].position="left"),t.length>1&&(t[1].position="left"===t[0].position?"right":"left");for(var e=0,i=t.length;i>e;e++)t[e].type=t[e].type||"value",t[e].xAxisIndex=-1,t[e].yAxisIndex=e}return t},refresh:function(e){var i;e&&(this.option=e,"xAxis"===this.axisType?(this.option.xAxis=this.reformOption(e.xAxis),i=this.option.xAxis):(this.option.yAxis=this.reformOption(e.yAxis),i=this.option.yAxis),this.series=e.series);for(var o=t("./categoryAxis"),s=t("./valueAxis"),n=Math.max(i&&i.length||0,this._axisList.length),r=0;n>r;r++)!this._axisList[r]||!e||i[r]&&this._axisList[r].type==i[r].type||(this._axisList[r].dispose&&this._axisList[r].dispose(),this._axisList[r]=!1),this._axisList[r]?this._axisList[r].refresh&&this._axisList[r].refresh(i?i[r]:!1,this.series):i&&i[r]&&(this._axisList[r]="category"===i[r].type?new o(this.ecTheme,this.messageCenter,this.zr,i[r],this.myChart,this.axisBase):new s(this.ecTheme,this.messageCenter,this.zr,i[r],this.myChart,this.axisBase,this.series))},getAxis:function(t){return this._axisList[t]},getAxisCount:function(){return this._axisList.length},clear:function(){for(var t=0,e=this._axisList.length;e>t;t++)this._axisList[t].dispose&&this._axisList[t].dispose();this._axisList=[]}},r.inherits(e,i),t("../component").define("axis",e),e}),i("echarts/config",[],function(){var t={CHART_TYPE_LINE:"line",CHART_TYPE_BAR:"bar",CHART_TYPE_SCATTER:"scatter",CHART_TYPE_PIE:"pie",CHART_TYPE_RADAR:"radar",CHART_TYPE_VENN:"venn",CHART_TYPE_TREEMAP:"treemap",CHART_TYPE_MAP:"map",CHART_TYPE_K:"k",CHART_TYPE_ISLAND:"island",CHART_TYPE_FORCE:"force",CHART_TYPE_CHORD:"chord",CHART_TYPE_GAUGE:"gauge",CHART_TYPE_FUNNEL:"funnel",CHART_TYPE_EVENTRIVER:"eventRiver",COMPONENT_TYPE_TITLE:"title",COMPONENT_TYPE_LEGEND:"legend",COMPONENT_TYPE_DATARANGE:"dataRange",COMPONENT_TYPE_DATAVIEW:"dataView",COMPONENT_TYPE_DATAZOOM:"dataZoom",COMPONENT_TYPE_TOOLBOX:"toolbox",COMPONENT_TYPE_TOOLTIP:"tooltip",COMPONENT_TYPE_GRID:"grid",COMPONENT_TYPE_AXIS:"axis",COMPONENT_TYPE_POLAR:"polar",COMPONENT_TYPE_X_AXIS:"xAxis",COMPONENT_TYPE_Y_AXIS:"yAxis",COMPONENT_TYPE_AXIS_CATEGORY:"categoryAxis",COMPONENT_TYPE_AXIS_VALUE:"valueAxis",COMPONENT_TYPE_TIMELINE:"timeline",COMPONENT_TYPE_ROAMCONTROLLER:"roamController",backgroundColor:"rgba(0,0,0,0)",color:["#ff7f50","#87cefa","#da70d6","#32cd32","#6495ed","#ff69b4","#ba55d3","#cd5c5c","#ffa500","#40e0d0","#1e90ff","#ff6347","#7b68ee","#00fa9a","#ffd700","#6699FF","#ff6666","#3cb371","#b8860b","#30e0e0"],markPoint:{clickable:!0,symbol:"pin",symbolSize:10,large:!1,effect:{show:!1,loop:!0,period:15,type:"scale",scaleSize:2,bounceDistance:10},itemStyle:{normal:{borderWidth:2,label:{show:!0,position:"inside"}},emphasis:{label:{show:!0}}}},markLine:{clickable:!0,symbol:["circle","arrow"],symbolSize:[2,4],smoothness:.2,precision:2,effect:{show:!1,loop:!0,period:15,scaleSize:2},bundling:{enable:!1,maxTurningAngle:45},itemStyle:{normal:{borderWidth:1.5,label:{show:!0,position:"end"},lineStyle:{type:"dashed"}},emphasis:{label:{show:!1},lineStyle:{}}}},textStyle:{decoration:"none",fontFamily:"Arial, Verdana, sans-serif",fontFamily2:"微软雅黑",fontSize:12,fontStyle:"normal",fontWeight:"normal"},EVENT:{REFRESH:"refresh",RESTORE:"restore",RESIZE:"resize",CLICK:"click",DBLCLICK:"dblclick",HOVER:"hover",MOUSEOUT:"mouseout",DATA_CHANGED:"dataChanged",DATA_ZOOM:"dataZoom",DATA_RANGE:"dataRange",DATA_RANGE_SELECTED:"dataRangeSelected",DATA_RANGE_HOVERLINK:"dataRangeHoverLink",LEGEND_SELECTED:"legendSelected",LEGEND_HOVERLINK:"legendHoverLink",MAP_SELECTED:"mapSelected",PIE_SELECTED:"pieSelected",MAGIC_TYPE_CHANGED:"magicTypeChanged",DATA_VIEW_CHANGED:"dataViewChanged",TIMELINE_CHANGED:"timelineChanged",MAP_ROAM:"mapRoam",FORCE_LAYOUT_END:"forceLayoutEnd",TOOLTIP_HOVER:"tooltipHover",TOOLTIP_IN_GRID:"tooltipInGrid",TOOLTIP_OUT_GRID:"tooltipOutGrid",ROAMCONTROLLER:"roamController"},DRAG_ENABLE_TIME:120,EFFECT_ZLEVEL:10,symbolList:["circle","rectangle","triangle","diamond","emptyCircle","emptyRectangle","emptyTriangle","emptyDiamond"],loadingEffect:"spin",loadingText:"Loading...",noDataEffect:"bubble",noDataText:"No Data",calculable:!1,calculableColor:"rgba(255,165,0,0.6)",calculableHolderColor:"#ccc",nameConnector:" & ",valueConnector:": ",animation:!0,addDataAnimation:!0,animationThreshold:2e3,animationDuration:2e3,animationDurationUpdate:500,animationEasing:"ExponentialOut"};return t}),i("zrender/tool/util",["require","../dep/excanvas"],function(t){function e(t){return t&&1===t.nodeType&&"string"==typeof t.nodeName}function i(t){if("object"==typeof t&&null!==t){var o=t;if(t instanceof Array){o=[];for(var s=0,n=t.length;n>s;s++)o[s]=i(t[s])}else if(!m[_.call(t)]&&!e(t)){o={};for(var r in t)t.hasOwnProperty(r)&&(o[r]=i(t[r]))}return o}return t}function o(t,i,o,n){if(i.hasOwnProperty(o)){var r=t[o];"object"!=typeof r||m[_.call(r)]||e(r)?!n&&o in t||(t[o]=i[o]):s(t[o],i[o],n)}}function s(t,e,i){for(var s in e)o(t,e,s,i);return t}function n(){if(!c)if(t("../dep/excanvas"),window.G_vmlCanvasManager){var e=document.createElement("div");e.style.position="absolute",e.style.top="-1000px",document.body.appendChild(e),c=G_vmlCanvasManager.initElement(e).getContext("2d")}else c=document.createElement("canvas").getContext("2d");return c}function r(){return u||(p=document.createElement("canvas"),g=p.width,f=p.height,u=p.getContext("2d")),u}function a(t,e){var i,o=100;t+y>g&&(g=t+y+o,p.width=g,i=!0),e+x>f&&(f=e+x+o,p.height=f,i=!0),-y>t&&(y=Math.ceil(-t/o)*o,g+=y,p.width=g,i=!0),-x>e&&(x=Math.ceil(-e/o)*o,f+=x,p.height=f,i=!0),i&&u.translate(y,x)}function h(){return{x:y,y:x}}function l(t,e){if(t.indexOf)return t.indexOf(e);for(var i=0,o=t.length;o>i;i++)if(t[i]===e)return i;return-1}function d(t,e){function i(){}var o=t.prototype;i.prototype=e.prototype,t.prototype=new i;for(var s in o)t.prototype[s]=o[s];t.constructor=t}var c,p,u,g,f,m={"[object Function]":1,"[object RegExp]":1,"[object Date]":1,"[object Error]":1,"[object CanvasGradient]":1},_=Object.prototype.toString,y=0,x=0;return{inherits:d,clone:i,merge:s,getContext:n,getPixelContext:r,getPixelOffset:h,adjustCanvasSize:a,indexOf:l}}),i("echarts/component/dataRange",["require","./base","zrender/shape/Text","zrender/shape/Rectangle","../util/shape/HandlePolygon","../config","zrender/tool/util","zrender/tool/event","zrender/tool/area","zrender/tool/color","../component"],function(t){function e(t,e,o,s,n){if("undefined"==typeof this.query(s,"dataRange.min")||"undefined"==typeof this.query(s,"dataRange.max"))return void console.error("option.dataRange.min or option.dataRange.max has not been defined.");i.call(this,t,e,o,s,n);var a=this;a._ondrift=function(t,e){return a.__ondrift(this,t,e)},a._ondragend=function(){return a.__ondragend()},a._dataRangeSelected=function(t){return a.__dataRangeSelected(t)},a._dispatchHoverLink=function(t){return a.__dispatchHoverLink(t)},a._onhoverlink=function(t){return a.__onhoverlink(t)},this._selectedMap={},this._range={},this.refresh(s),e.bind(r.EVENT.HOVER,this._onhoverlink)}var i=t("./base"),o=t("zrender/shape/Text"),s=t("zrender/shape/Rectangle"),n=t("../util/shape/HandlePolygon"),r=t("../config");r.dataRange={zlevel:0,z:4,show:!0,orient:"vertical",x:"left",y:"bottom",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,itemWidth:20,itemHeight:14,precision:0,splitNumber:5,calculable:!1,selectedMode:!0,hoverLink:!0,realtime:!0,color:["#006edd","#e0ffff"],textStyle:{color:"#333"}};var a=t("zrender/tool/util"),h=t("zrender/tool/event"),l=t("zrender/tool/area"),d=t("zrender/tool/color");return e.prototype={type:r.COMPONENT_TYPE_DATARANGE,_textGap:10,_buildShape:function(){if(this._itemGroupLocation=this._getItemGroupLocation(),this._buildBackground(),this.dataRangeOption.splitNumber<=0||this.dataRangeOption.calculable?this._buildGradient():this._buildItem(),this.dataRangeOption.show)for(var t=0,e=this.shapeList.length;e>t;t++)this.zr.addShape(this.shapeList[t]);
this._syncShapeFromRange()},_buildItem:function(){var t,e,i,n,r=this._valueTextList,a=r.length,h=this.getFont(this.dataRangeOption.textStyle),d=this._itemGroupLocation.x,c=this._itemGroupLocation.y,p=this.dataRangeOption.itemWidth,u=this.dataRangeOption.itemHeight,g=this.dataRangeOption.itemGap,f=l.getTextHeight("国",h);"vertical"==this.dataRangeOption.orient&&"right"==this.dataRangeOption.x&&(d=this._itemGroupLocation.x+this._itemGroupLocation.width-p);var m=!0;this.dataRangeOption.text&&(m=!1,this.dataRangeOption.text[0]&&(i=this._getTextShape(d,c,this.dataRangeOption.text[0]),"horizontal"==this.dataRangeOption.orient?d+=l.getTextWidth(this.dataRangeOption.text[0],h)+this._textGap:(c+=f+this._textGap,i.style.y+=f/2+this._textGap,i.style.textBaseline="bottom"),this.shapeList.push(new o(i))));for(var _=0;a>_;_++)t=r[_],n=this.getColorByIndex(_),e=this._getItemShape(d,c,p,u,this._selectedMap[_]?n:"#ccc"),e._idx=_,e.onmousemove=this._dispatchHoverLink,this.dataRangeOption.selectedMode&&(e.clickable=!0,e.onclick=this._dataRangeSelected),this.shapeList.push(new s(e)),m&&(i={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:d+p+5,y:c,color:this._selectedMap[_]?this.dataRangeOption.textStyle.color:"#ccc",text:r[_],textFont:h,textBaseline:"top"},highlightStyle:{brushType:"fill"}},"vertical"==this.dataRangeOption.orient&&"right"==this.dataRangeOption.x&&(i.style.x-=p+10,i.style.textAlign="right"),i._idx=_,i.onmousemove=this._dispatchHoverLink,this.dataRangeOption.selectedMode&&(i.clickable=!0,i.onclick=this._dataRangeSelected),this.shapeList.push(new o(i))),"horizontal"==this.dataRangeOption.orient?d+=p+(m?5:0)+(m?l.getTextWidth(t,h):0)+g:c+=u+g;!m&&this.dataRangeOption.text[1]&&("horizontal"==this.dataRangeOption.orient?d=d-g+this._textGap:c=c-g+this._textGap,i=this._getTextShape(d,c,this.dataRangeOption.text[1]),"horizontal"!=this.dataRangeOption.orient&&(i.style.y-=5,i.style.textBaseline="top"),this.shapeList.push(new o(i)))},_buildGradient:function(){var e,i,n=this.getFont(this.dataRangeOption.textStyle),r=this._itemGroupLocation.x,a=this._itemGroupLocation.y,h=this.dataRangeOption.itemWidth,d=this.dataRangeOption.itemHeight,c=l.getTextHeight("国",n),p=10,u=!0;this.dataRangeOption.text&&(u=!1,this.dataRangeOption.text[0]&&(i=this._getTextShape(r,a,this.dataRangeOption.text[0]),"horizontal"==this.dataRangeOption.orient?r+=l.getTextWidth(this.dataRangeOption.text[0],n)+this._textGap:(a+=c+this._textGap,i.style.y+=c/2+this._textGap,i.style.textBaseline="bottom"),this.shapeList.push(new o(i))));for(var g=t("zrender/tool/color"),f=1/(this.dataRangeOption.color.length-1),m=[],_=0,y=this.dataRangeOption.color.length;y>_;_++)m.push([_*f,this.dataRangeOption.color[_]]);"horizontal"==this.dataRangeOption.orient?(e={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:r,y:a,width:h*p,height:d,color:g.getLinearGradient(r,a,r+h*p,a,m)},hoverable:!1},r+=h*p+this._textGap):(e={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:r,y:a,width:h,height:d*p,color:g.getLinearGradient(r,a,r,a+d*p,m)},hoverable:!1},a+=d*p+this._textGap),this.shapeList.push(new s(e)),this._calculableLocation=e.style,this.dataRangeOption.calculable&&(this._buildFiller(),this._bulidMask(),this._bulidHandle()),this._buildIndicator(),!u&&this.dataRangeOption.text[1]&&(i=this._getTextShape(r,a,this.dataRangeOption.text[1]),this.shapeList.push(new o(i)))},_buildIndicator:function(){var t,e,i=this._calculableLocation.x,o=this._calculableLocation.y,s=this._calculableLocation.width,r=this._calculableLocation.height,a=5;"horizontal"==this.dataRangeOption.orient?"bottom"!=this.dataRangeOption.y?(t=[[i,o+r],[i-a,o+r+a],[i+a,o+r+a]],e="bottom"):(t=[[i,o],[i-a,o-a],[i+a,o-a]],e="top"):"right"!=this.dataRangeOption.x?(t=[[i+s,o],[i+s+a,o-a],[i+s+a,o+a]],e="right"):(t=[[i,o],[i-a,o-a],[i-a,o+a]],e="left"),this._indicatorShape={style:{pointList:t,color:"#fff",__rect:{x:Math.min(t[0][0],t[1][0]),y:Math.min(t[0][1],t[1][1]),width:a*("horizontal"==this.dataRangeOption.orient?2:1),height:a*("horizontal"==this.dataRangeOption.orient?1:2)}},highlightStyle:{brushType:"fill",textPosition:e,textColor:this.dataRangeOption.textStyle.color},hoverable:!1},this._indicatorShape=new n(this._indicatorShape)},_buildFiller:function(){this._fillerShape={zlevel:this.getZlevelBase(),z:this.getZBase()+1,style:{x:this._calculableLocation.x,y:this._calculableLocation.y,width:this._calculableLocation.width,height:this._calculableLocation.height,color:"rgba(255,255,255,0)"},highlightStyle:{strokeColor:"rgba(255,255,255,0.5)",lineWidth:1},draggable:!0,ondrift:this._ondrift,ondragend:this._ondragend,onmousemove:this._dispatchHoverLink,_type:"filler"},this._fillerShape=new s(this._fillerShape),this.shapeList.push(this._fillerShape)},_bulidHandle:function(){var t,e,i,o,s,r,a,h,d=this._calculableLocation.x,c=this._calculableLocation.y,p=this._calculableLocation.width,u=this._calculableLocation.height,g=this.getFont(this.dataRangeOption.textStyle),f=l.getTextHeight("国",g),m=Math.max(l.getTextWidth(this._textFormat(this.dataRangeOption.max),g),l.getTextWidth(this._textFormat(this.dataRangeOption.min),g))+2;"horizontal"==this.dataRangeOption.orient?"bottom"!=this.dataRangeOption.y?(t=[[d,c],[d,c+u+f],[d-f,c+u+f],[d-1,c+u],[d-1,c]],e=d-m/2-f,i=c+u+f/2+2,o={x:d-m-f,y:c+u,width:m+f,height:f},s=[[d+p,c],[d+p,c+u+f],[d+p+f,c+u+f],[d+p+1,c+u],[d+p+1,c]],r=d+p+m/2+f,a=i,h={x:d+p,y:c+u,width:m+f,height:f}):(t=[[d,c+u],[d,c-f],[d-f,c-f],[d-1,c],[d-1,c+u]],e=d-m/2-f,i=c-f/2-2,o={x:d-m-f,y:c-f,width:m+f,height:f},s=[[d+p,c+u],[d+p,c-f],[d+p+f,c-f],[d+p+1,c],[d+p+1,c+u]],r=d+p+m/2+f,a=i,h={x:d+p,y:c-f,width:m+f,height:f}):(m+=f,"right"!=this.dataRangeOption.x?(t=[[d,c],[d+p+f,c],[d+p+f,c-f],[d+p,c-1],[d,c-1]],e=d+p+m/2+f/2,i=c-f/2,o={x:d+p,y:c-f,width:m+f,height:f},s=[[d,c+u],[d+p+f,c+u],[d+p+f,c+f+u],[d+p,c+1+u],[d,c+u+1]],r=e,a=c+u+f/2,h={x:d+p,y:c+u,width:m+f,height:f}):(t=[[d+p,c],[d-f,c],[d-f,c-f],[d,c-1],[d+p,c-1]],e=d-m/2-f/2,i=c-f/2,o={x:d-m-f,y:c-f,width:m+f,height:f},s=[[d+p,c+u],[d-f,c+u],[d-f,c+f+u],[d,c+1+u],[d+p,c+u+1]],r=e,a=c+u+f/2,h={x:d-m-f,y:c+u,width:m+f,height:f})),this._startShape={style:{pointList:t,text:this._textFormat(this.dataRangeOption.max),textX:e,textY:i,textFont:g,color:this.getColor(this.dataRangeOption.max),rect:o,x:t[0][0],y:t[0][1],_x:t[0][0],_y:t[0][1]}},this._startShape.highlightStyle={strokeColor:this._startShape.style.color,lineWidth:1},this._endShape={style:{pointList:s,text:this._textFormat(this.dataRangeOption.min),textX:r,textY:a,textFont:g,color:this.getColor(this.dataRangeOption.min),rect:h,x:s[0][0],y:s[0][1],_x:s[0][0],_y:s[0][1]}},this._endShape.highlightStyle={strokeColor:this._endShape.style.color,lineWidth:1},this._startShape.zlevel=this._endShape.zlevel=this.getZlevelBase(),this._startShape.z=this._endShape.z=this.getZBase()+1,this._startShape.draggable=this._endShape.draggable=!0,this._startShape.ondrift=this._endShape.ondrift=this._ondrift,this._startShape.ondragend=this._endShape.ondragend=this._ondragend,this._startShape.style.textColor=this._endShape.style.textColor=this.dataRangeOption.textStyle.color,this._startShape.style.textAlign=this._endShape.style.textAlign="center",this._startShape.style.textPosition=this._endShape.style.textPosition="specific",this._startShape.style.textBaseline=this._endShape.style.textBaseline="middle",this._startShape.style.width=this._endShape.style.width=0,this._startShape.style.height=this._endShape.style.height=0,this._startShape.style.textPosition=this._endShape.style.textPosition="specific",this._startShape=new n(this._startShape),this._endShape=new n(this._endShape),this.shapeList.push(this._startShape),this.shapeList.push(this._endShape)},_bulidMask:function(){var t=this._calculableLocation.x,e=this._calculableLocation.y,i=this._calculableLocation.width,o=this._calculableLocation.height;this._startMask={zlevel:this.getZlevelBase(),z:this.getZBase()+1,style:{x:t,y:e,width:"horizontal"==this.dataRangeOption.orient?0:i,height:"horizontal"==this.dataRangeOption.orient?o:0,color:"#ccc"},hoverable:!1},this._endMask={zlevel:this.getZlevelBase(),z:this.getZBase()+1,style:{x:"horizontal"==this.dataRangeOption.orient?t+i:t,y:"horizontal"==this.dataRangeOption.orient?e:e+o,width:"horizontal"==this.dataRangeOption.orient?0:i,height:"horizontal"==this.dataRangeOption.orient?o:0,color:"#ccc"},hoverable:!1},this._startMask=new s(this._startMask),this._endMask=new s(this._endMask),this.shapeList.push(this._startMask),this.shapeList.push(this._endMask)},_buildBackground:function(){var t=this.reformCssArray(this.dataRangeOption.padding);this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._itemGroupLocation.x-t[3],y:this._itemGroupLocation.y-t[0],width:this._itemGroupLocation.width+t[3]+t[1],height:this._itemGroupLocation.height+t[0]+t[2],brushType:0===this.dataRangeOption.borderWidth?"fill":"both",color:this.dataRangeOption.backgroundColor,strokeColor:this.dataRangeOption.borderColor,lineWidth:this.dataRangeOption.borderWidth}}))},_getItemGroupLocation:function(){var t=this._valueTextList,e=t.length,i=this.dataRangeOption.itemGap,o=this.dataRangeOption.itemWidth,s=this.dataRangeOption.itemHeight,n=0,r=0,a=this.getFont(this.dataRangeOption.textStyle),h=l.getTextHeight("国",a),d=10;if("horizontal"==this.dataRangeOption.orient){if(this.dataRangeOption.text||this.dataRangeOption.splitNumber<=0||this.dataRangeOption.calculable)n=(this.dataRangeOption.splitNumber<=0||this.dataRangeOption.calculable?o*d+i:e*(o+i))+(this.dataRangeOption.text&&"undefined"!=typeof this.dataRangeOption.text[0]?l.getTextWidth(this.dataRangeOption.text[0],a)+this._textGap:0)+(this.dataRangeOption.text&&"undefined"!=typeof this.dataRangeOption.text[1]?l.getTextWidth(this.dataRangeOption.text[1],a)+this._textGap:0);else{o+=5;for(var c=0;e>c;c++)n+=o+l.getTextWidth(t[c],a)+i}n-=i,r=Math.max(h,s)}else{var p;if(this.dataRangeOption.text||this.dataRangeOption.splitNumber<=0||this.dataRangeOption.calculable)r=(this.dataRangeOption.splitNumber<=0||this.dataRangeOption.calculable?s*d+i:e*(s+i))+(this.dataRangeOption.text&&"undefined"!=typeof this.dataRangeOption.text[0]?this._textGap+h:0)+(this.dataRangeOption.text&&"undefined"!=typeof this.dataRangeOption.text[1]?this._textGap+h:0),p=Math.max(l.getTextWidth(this.dataRangeOption.text&&this.dataRangeOption.text[0]||"",a),l.getTextWidth(this.dataRangeOption.text&&this.dataRangeOption.text[1]||"",a)),n=Math.max(o,p);else{r=(s+i)*e,o+=5,p=0;for(var c=0;e>c;c++)p=Math.max(p,l.getTextWidth(t[c],a));n=o+p}r-=i}var u,g=this.reformCssArray(this.dataRangeOption.padding),f=this.zr.getWidth();switch(this.dataRangeOption.x){case"center":u=Math.floor((f-n)/2);break;case"left":u=g[3]+this.dataRangeOption.borderWidth;break;case"right":u=f-n-g[1]-this.dataRangeOption.borderWidth;break;default:u=this.parsePercent(this.dataRangeOption.x,f),u=isNaN(u)?0:u}var m,_=this.zr.getHeight();switch(this.dataRangeOption.y){case"top":m=g[0]+this.dataRangeOption.borderWidth;break;case"bottom":m=_-r-g[2]-this.dataRangeOption.borderWidth;break;case"center":m=Math.floor((_-r)/2);break;default:m=this.parsePercent(this.dataRangeOption.y,_),m=isNaN(m)?0:m}if(this.dataRangeOption.calculable){var y=Math.max(l.getTextWidth(this.dataRangeOption.max,a),l.getTextWidth(this.dataRangeOption.min,a))+h;"horizontal"==this.dataRangeOption.orient?(y>u&&(u=y),u+n+y>f&&(u-=y)):(h>m&&(m=h),m+r+h>_&&(m-=h))}return{x:u,y:m,width:n,height:r}},_getTextShape:function(t,e,i){return{zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:"horizontal"==this.dataRangeOption.orient?t:this._itemGroupLocation.x+this._itemGroupLocation.width/2,y:"horizontal"==this.dataRangeOption.orient?this._itemGroupLocation.y+this._itemGroupLocation.height/2:e,color:this.dataRangeOption.textStyle.color,text:i,textFont:this.getFont(this.dataRangeOption.textStyle),textBaseline:"horizontal"==this.dataRangeOption.orient?"middle":"top",textAlign:"horizontal"==this.dataRangeOption.orient?"left":"center"},hoverable:!1}},_getItemShape:function(t,e,i,o,s){return{zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:t,y:e+1,width:i,height:o-2,color:s},highlightStyle:{strokeColor:s,lineWidth:1}}},__ondrift:function(t,e,i){var o=this._calculableLocation.x,s=this._calculableLocation.y,n=this._calculableLocation.width,r=this._calculableLocation.height;return"horizontal"==this.dataRangeOption.orient?t.style.x+e<=o?t.style.x=o:t.style.x+e+t.style.width>=o+n?t.style.x=o+n-t.style.width:t.style.x+=e:t.style.y+i<=s?t.style.y=s:t.style.y+i+t.style.height>=s+r?t.style.y=s+r-t.style.height:t.style.y+=i,"filler"==t._type?this._syncHandleShape():this._syncFillerShape(t),this.dataRangeOption.realtime&&this._dispatchDataRange(),!0},__ondragend:function(){this.isDragend=!0},ondragend:function(t,e){this.isDragend&&t.target&&(e.dragOut=!0,e.dragIn=!0,this.dataRangeOption.realtime||this._dispatchDataRange(),e.needRefresh=!1,this.isDragend=!1)},_syncShapeFromRange:function(){var t=this.dataRangeOption.range||{};if(this._range.end="undefined"!=typeof this._range.end?this._range.end:"undefined"!=typeof t.start?t.start:0,this._range.start="undefined"!=typeof this._range.start?this._range.start:"undefined"!=typeof t.end?t.end:100,100!=this._range.start||0!==this._range.end){if("horizontal"==this.dataRangeOption.orient){var e=this._fillerShape.style.width;this._fillerShape.style.x+=e*(100-this._range.start)/100,this._fillerShape.style.width=e*(this._range.start-this._range.end)/100}else{var i=this._fillerShape.style.height;this._fillerShape.style.y+=i*(100-this._range.start)/100,this._fillerShape.style.height=i*(this._range.start-this._range.end)/100}this.zr.modShape(this._fillerShape.id),this._syncHandleShape()}},_syncHandleShape:function(){var t=this._calculableLocation.x,e=this._calculableLocation.y,i=this._calculableLocation.width,o=this._calculableLocation.height;"horizontal"==this.dataRangeOption.orient?(this._startShape.style.x=this._fillerShape.style.x,this._startMask.style.width=this._startShape.style.x-t,this._endShape.style.x=this._fillerShape.style.x+this._fillerShape.style.width,this._endMask.style.x=this._endShape.style.x,this._endMask.style.width=t+i-this._endShape.style.x,this._range.start=Math.ceil(100-(this._startShape.style.x-t)/i*100),this._range.end=Math.floor(100-(this._endShape.style.x-t)/i*100)):(this._startShape.style.y=this._fillerShape.style.y,this._startMask.style.height=this._startShape.style.y-e,this._endShape.style.y=this._fillerShape.style.y+this._fillerShape.style.height,this._endMask.style.y=this._endShape.style.y,this._endMask.style.height=e+o-this._endShape.style.y,this._range.start=Math.ceil(100-(this._startShape.style.y-e)/o*100),this._range.end=Math.floor(100-(this._endShape.style.y-e)/o*100)),this._syncShape()},_syncFillerShape:function(t){var e,i,o=this._calculableLocation.x,s=this._calculableLocation.y,n=this._calculableLocation.width,r=this._calculableLocation.height;"horizontal"==this.dataRangeOption.orient?(e=this._startShape.style.x,i=this._endShape.style.x,t.id==this._startShape.id&&e>=i?(i=e,this._endShape.style.x=e):t.id==this._endShape.id&&e>=i&&(e=i,this._startShape.style.x=e),this._fillerShape.style.x=e,this._fillerShape.style.width=i-e,this._startMask.style.width=e-o,this._endMask.style.x=i,this._endMask.style.width=o+n-i,this._range.start=Math.ceil(100-(e-o)/n*100),this._range.end=Math.floor(100-(i-o)/n*100)):(e=this._startShape.style.y,i=this._endShape.style.y,t.id==this._startShape.id&&e>=i?(i=e,this._endShape.style.y=e):t.id==this._endShape.id&&e>=i&&(e=i,this._startShape.style.y=e),this._fillerShape.style.y=e,this._fillerShape.style.height=i-e,this._startMask.style.height=e-s,this._endMask.style.y=i,this._endMask.style.height=s+r-i,this._range.start=Math.ceil(100-(e-s)/r*100),this._range.end=Math.floor(100-(i-s)/r*100)),this._syncShape()},_syncShape:function(){this._startShape.position=[this._startShape.style.x-this._startShape.style._x,this._startShape.style.y-this._startShape.style._y],this._startShape.style.text=this._textFormat(this._gap*this._range.start+this.dataRangeOption.min),this._startShape.style.color=this._startShape.highlightStyle.strokeColor=this.getColor(this._gap*this._range.start+this.dataRangeOption.min),this._endShape.position=[this._endShape.style.x-this._endShape.style._x,this._endShape.style.y-this._endShape.style._y],this._endShape.style.text=this._textFormat(this._gap*this._range.end+this.dataRangeOption.min),this._endShape.style.color=this._endShape.highlightStyle.strokeColor=this.getColor(this._gap*this._range.end+this.dataRangeOption.min),this.zr.modShape(this._startShape.id),this.zr.modShape(this._endShape.id),this.zr.modShape(this._startMask.id),this.zr.modShape(this._endMask.id),this.zr.modShape(this._fillerShape.id),this.zr.refreshNextFrame()},_dispatchDataRange:function(){this.messageCenter.dispatch(r.EVENT.DATA_RANGE,null,{range:{start:this._range.end,end:this._range.start}},this.myChart)},__dataRangeSelected:function(t){if("single"===this.dataRangeOption.selectedMode)for(var e in this._selectedMap)this._selectedMap[e]=!1;var i=t.target._idx;this._selectedMap[i]=!this._selectedMap[i];var o=(this._colorList.length-i)*this._gap+this.dataRangeOption.min;this.messageCenter.dispatch(r.EVENT.DATA_RANGE_SELECTED,t.event,{selected:this._selectedMap,target:i,valueMax:o,valueMin:o-this._gap},this.myChart),this.messageCenter.dispatch(r.EVENT.REFRESH,null,null,this.myChart)},__dispatchHoverLink:function(t){var e,i;if(this.dataRangeOption.calculable){var o,s=this.dataRangeOption.max-this.dataRangeOption.min;o="horizontal"==this.dataRangeOption.orient?(1-(h.getX(t.event)-this._calculableLocation.x)/this._calculableLocation.width)*s:(1-(h.getY(t.event)-this._calculableLocation.y)/this._calculableLocation.height)*s,e=o-.05*s,i=o+.05*s}else{var n=t.target._idx;i=(this._colorList.length-n)*this._gap+this.dataRangeOption.min,e=i-this._gap}this.messageCenter.dispatch(r.EVENT.DATA_RANGE_HOVERLINK,t.event,{valueMin:e,valueMax:i},this.myChart)},__onhoverlink:function(t){if(this.dataRangeOption.show&&this.dataRangeOption.hoverLink&&this._indicatorShape&&t&&null!=t.seriesIndex&&null!=t.dataIndex){var e=t.value;if(""===e||isNaN(e))return;e<this.dataRangeOption.min?e=this.dataRangeOption.min:e>this.dataRangeOption.max&&(e=this.dataRangeOption.max),this._indicatorShape.position="horizontal"==this.dataRangeOption.orient?[(this.dataRangeOption.max-e)/(this.dataRangeOption.max-this.dataRangeOption.min)*this._calculableLocation.width,0]:[0,(this.dataRangeOption.max-e)/(this.dataRangeOption.max-this.dataRangeOption.min)*this._calculableLocation.height],this._indicatorShape.style.text=this._textFormat(t.value),this._indicatorShape.style.color=this.getColor(e),this.zr.addHoverShape(this._indicatorShape)}},_textFormat:function(t,e){if(t=(+t).toFixed(this.dataRangeOption.precision),e=null!=e?(+e).toFixed(this.dataRangeOption.precision):"",this.dataRangeOption.formatter){if("string"==typeof this.dataRangeOption.formatter)return this.dataRangeOption.formatter.replace("{value}",t).replace("{value2}",e);if("function"==typeof this.dataRangeOption.formatter)return this.dataRangeOption.formatter.call(this.myChart,t,e)}return""!==e?t+" - "+e:t},refresh:function(t){if(t){this.option=t,this.option.dataRange=this.reformOption(this.option.dataRange),this.dataRangeOption=this.option.dataRange,this.myChart.canvasSupported||(this.dataRangeOption.realtime=!1);var e=this.dataRangeOption.splitNumber<=0||this.dataRangeOption.calculable?100:this.dataRangeOption.splitNumber;if(this._colorList=d.getGradientColors(this.dataRangeOption.color,Math.max((e-this.dataRangeOption.color.length)/(this.dataRangeOption.color.length-1),0)+1),this._colorList.length>e){for(var i=this._colorList.length,o=[this._colorList[0]],s=i/(e-1),n=1;e-1>n;n++)o.push(this._colorList[Math.floor(n*s)]);o.push(this._colorList[i-1]),this._colorList=o}var r=this.dataRangeOption.precision;for(this._gap=(this.dataRangeOption.max-this.dataRangeOption.min)/e;this._gap.toFixed(r)-0!=this._gap&&5>r;)r++;this.dataRangeOption.precision=r,this._gap=((this.dataRangeOption.max-this.dataRangeOption.min)/e).toFixed(r)-0,this._valueTextList=[];for(var n=0;e>n;n++)this._selectedMap[n]=!0,this._valueTextList.unshift(this._textFormat(n*this._gap+this.dataRangeOption.min,(n+1)*this._gap+this.dataRangeOption.min))}this.clear(),this._buildShape()},getColor:function(t){if(isNaN(t))return null;if(this.dataRangeOption.min==this.dataRangeOption.max)return this._colorList[0];if(t<this.dataRangeOption.min?t=this.dataRangeOption.min:t>this.dataRangeOption.max&&(t=this.dataRangeOption.max),this.dataRangeOption.calculable&&(t-(this._gap*this._range.start+this.dataRangeOption.min)>5e-5||t-(this._gap*this._range.end+this.dataRangeOption.min)<-5e-5))return null;var e=this._colorList.length-Math.ceil((t-this.dataRangeOption.min)/(this.dataRangeOption.max-this.dataRangeOption.min)*this._colorList.length);return e==this._colorList.length&&e--,this._selectedMap[e]?this._colorList[e]:null},getColorByIndex:function(t){return t>=this._colorList.length?t=this._colorList.length-1:0>t&&(t=0),this._colorList[t]},onbeforDispose:function(){this.messageCenter.unbind(r.EVENT.HOVER,this._onhoverlink)}},a.inherits(e,i),t("../component").define("dataRange",e),e}),i("echarts/chart",[],function(){var t={},e={};return t.define=function(i,o){return e[i]=o,t},t.get=function(t){return e[t]},t}),i("echarts/chart/gauge",["require","./base","../util/shape/GaugePointer","zrender/shape/Text","zrender/shape/Line","zrender/shape/Rectangle","zrender/shape/Circle","zrender/shape/Sector","../config","../util/ecData","../util/accMath","zrender/tool/util","../chart"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.refresh(s)}var i=t("./base"),o=t("../util/shape/GaugePointer"),s=t("zrender/shape/Text"),n=t("zrender/shape/Line"),r=t("zrender/shape/Rectangle"),a=t("zrender/shape/Circle"),h=t("zrender/shape/Sector"),l=t("../config");l.gauge={zlevel:0,z:2,center:["50%","50%"],clickable:!0,legendHoverLink:!0,radius:"75%",startAngle:225,endAngle:-45,min:0,max:100,splitNumber:10,axisLine:{show:!0,lineStyle:{color:[[.2,"#228b22"],[.8,"#48b"],[1,"#ff4500"]],width:30}},axisTick:{show:!0,splitNumber:5,length:8,lineStyle:{color:"#eee",width:1,type:"solid"}},axisLabel:{show:!0,textStyle:{color:"auto"}},splitLine:{show:!0,length:30,lineStyle:{color:"#eee",width:2,type:"solid"}},pointer:{show:!0,length:"80%",width:8,color:"auto"},title:{show:!0,offsetCenter:[0,"-40%"],textStyle:{color:"#333",fontSize:15}},detail:{show:!0,backgroundColor:"rgba(0,0,0,0)",borderWidth:0,borderColor:"#ccc",width:100,height:40,offsetCenter:[0,"40%"],textStyle:{color:"auto",fontSize:30}}};var d=t("../util/ecData"),c=t("../util/accMath"),p=t("zrender/tool/util");return e.prototype={type:l.CHART_TYPE_GAUGE,_buildShape:function(){var t=this.series;this._paramsMap={};for(var e=0,i=t.length;i>e;e++)t[e].type===l.CHART_TYPE_GAUGE&&(t[e]=this.reformOption(t[e]),this.legendHoverLink=t[e].legendHoverLink||this.legendHoverLink,this._buildSingleGauge(e),this.buildMark(e));this.addShapeList()},_buildSingleGauge:function(t){var e=this.series[t];this._paramsMap[t]={center:this.parseCenter(this.zr,e.center),radius:this.parseRadius(this.zr,e.radius),startAngle:e.startAngle.toFixed(2)-0,endAngle:e.endAngle.toFixed(2)-0},this._paramsMap[t].totalAngle=this._paramsMap[t].startAngle-this._paramsMap[t].endAngle,this._colorMap(t),this._buildAxisLine(t),this._buildSplitLine(t),this._buildAxisTick(t),this._buildAxisLabel(t),this._buildPointer(t),this._buildTitle(t),this._buildDetail(t)},_buildAxisLine:function(t){var e=this.series[t];if(e.axisLine.show)for(var i,o,s=e.min,n=e.max-s,r=this._paramsMap[t],a=r.center,h=r.startAngle,l=r.totalAngle,c=r.colorArray,p=e.axisLine.lineStyle,u=this.parsePercent(p.width,r.radius[1]),g=r.radius[1],f=g-u,m=h,_=0,y=c.length;y>_;_++)o=h-l*(c[_][0]-s)/n,i=this._getSector(a,f,g,o,m,c[_][1],p),m=o,i._animationAdd="r",d.set(i,"seriesIndex",t),d.set(i,"dataIndex",_),this.shapeList.push(i)},_buildSplitLine:function(t){var e=this.series[t];if(e.splitLine.show)for(var i,o,s,r=this._paramsMap[t],a=e.splitNumber,h=e.min,l=e.max-h,d=e.splitLine,c=this.parsePercent(d.length,r.radius[1]),p=d.lineStyle,u=p.color,g=r.center,f=r.startAngle*Math.PI/180,m=r.totalAngle*Math.PI/180,_=r.radius[1],y=_-c,x=0;a>=x;x++)i=f-m/a*x,o=Math.sin(i),s=Math.cos(i),this.shapeList.push(new n({zlevel:this.getZlevelBase(),z:this.getZBase()+1,hoverable:!1,style:{xStart:g[0]+s*_,yStart:g[1]-o*_,xEnd:g[0]+s*y,yEnd:g[1]-o*y,strokeColor:"auto"===u?this._getColor(t,h+l/a*x):u,lineType:p.type,lineWidth:p.width,shadowColor:p.shadowColor,shadowBlur:p.shadowBlur,shadowOffsetX:p.shadowOffsetX,shadowOffsetY:p.shadowOffsetY}}))},_buildAxisTick:function(t){var e=this.series[t];if(e.axisTick.show)for(var i,o,s,r=this._paramsMap[t],a=e.splitNumber,h=e.min,l=e.max-h,d=e.axisTick,c=d.splitNumber,p=this.parsePercent(d.length,r.radius[1]),u=d.lineStyle,g=u.color,f=r.center,m=r.startAngle*Math.PI/180,_=r.totalAngle*Math.PI/180,y=r.radius[1],x=y-p,v=0,b=a*c;b>=v;v++)v%c!==0&&(i=m-_/b*v,o=Math.sin(i),s=Math.cos(i),this.shapeList.push(new n({zlevel:this.getZlevelBase(),z:this.getZBase()+1,hoverable:!1,style:{xStart:f[0]+s*y,yStart:f[1]-o*y,xEnd:f[0]+s*x,yEnd:f[1]-o*x,strokeColor:"auto"===g?this._getColor(t,h+l/b*v):g,lineType:u.type,lineWidth:u.width,shadowColor:u.shadowColor,shadowBlur:u.shadowBlur,shadowOffsetX:u.shadowOffsetX,shadowOffsetY:u.shadowOffsetY}})))},_buildAxisLabel:function(t){var e=this.series[t];if(e.axisLabel.show)for(var i,o,n,r,a=e.splitNumber,h=e.min,l=e.max-h,d=e.axisLabel.textStyle,p=this.getFont(d),u=d.color,g=this._paramsMap[t],f=g.center,m=g.startAngle,_=g.totalAngle,y=g.radius[1]-this.parsePercent(e.splitLine.length,g.radius[1])-5,x=0;a>=x;x++)r=c.accAdd(h,c.accMul(c.accDiv(l,a),x)),i=m-_/a*x,o=Math.sin(i*Math.PI/180),n=Math.cos(i*Math.PI/180),i=(i+360)%360,this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase()+1,hoverable:!1,style:{x:f[0]+n*y,y:f[1]-o*y,color:"auto"===u?this._getColor(t,r):u,text:this._getLabelText(e.axisLabel.formatter,r),textAlign:i>=110&&250>=i?"left":70>=i||i>=290?"right":"center",textBaseline:i>=10&&170>=i?"top":i>=190&&350>=i?"bottom":"middle",textFont:p,shadowColor:d.shadowColor,shadowBlur:d.shadowBlur,shadowOffsetX:d.shadowOffsetX,shadowOffsetY:d.shadowOffsetY}}))},_buildPointer:function(t){var e=this.series[t];if(e.pointer.show){var i=e.max-e.min,s=e.pointer,n=this._paramsMap[t],r=this.parsePercent(s.length,n.radius[1]),h=this.parsePercent(s.width,n.radius[1]),l=n.center,c=this._getValue(t);c=c<e.max?c:e.max;var p=(n.startAngle-n.totalAngle/i*(c-e.min))*Math.PI/180,u="auto"===s.color?this._getColor(t,c):s.color,g=new o({zlevel:this.getZlevelBase(),z:this.getZBase()+1,clickable:this.query(e,"clickable"),style:{x:l[0],y:l[1],r:r,startAngle:n.startAngle*Math.PI/180,angle:p,color:u,width:h,shadowColor:s.shadowColor,shadowBlur:s.shadowBlur,shadowOffsetX:s.shadowOffsetX,shadowOffsetY:s.shadowOffsetY},highlightStyle:{brushType:"fill",width:h>2?2:h/2,color:"#fff"}});d.pack(g,this.series[t],t,this.series[t].data[0],0,this.series[t].data[0].name,c),this.shapeList.push(g),this.shapeList.push(new a({zlevel:this.getZlevelBase(),z:this.getZBase()+2,hoverable:!1,style:{x:l[0],y:l[1],r:s.width/2.5,color:"#fff"}}))}},_buildTitle:function(t){var e=this.series[t];if(e.title.show){var i=e.data[0],o=null!=i.name?i.name:"";if(""!==o){var n=e.title,r=n.offsetCenter,a=n.textStyle,h=a.color,l=this._paramsMap[t],d=l.center[0]+this.parsePercent(r[0],l.radius[1]),c=l.center[1]+this.parsePercent(r[1],l.radius[1]);this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase()+(Math.abs(d-l.center[0])+Math.abs(c-l.center[1])<2*a.fontSize?2:1),hoverable:!1,style:{x:d,y:c,color:"auto"===h?this._getColor(t):h,text:o,textAlign:"center",textFont:this.getFont(a),shadowColor:a.shadowColor,shadowBlur:a.shadowBlur,shadowOffsetX:a.shadowOffsetX,shadowOffsetY:a.shadowOffsetY}}))}}},_buildDetail:function(t){var e=this.series[t];if(e.detail.show){var i=e.detail,o=i.offsetCenter,s=i.backgroundColor,n=i.textStyle,a=n.color,h=this._paramsMap[t],l=this._getValue(t),d=h.center[0]-i.width/2+this.parsePercent(o[0],h.radius[1]),c=h.center[1]+this.parsePercent(o[1],h.radius[1]);this.shapeList.push(new r({zlevel:this.getZlevelBase(),z:this.getZBase()+(Math.abs(d+i.width/2-h.center[0])+Math.abs(c+i.height/2-h.center[1])<n.fontSize?2:1),hoverable:!1,style:{x:d,y:c,width:i.width,height:i.height,brushType:"both",color:"auto"===s?this._getColor(t,l):s,lineWidth:i.borderWidth,strokeColor:i.borderColor,shadowColor:i.shadowColor,shadowBlur:i.shadowBlur,shadowOffsetX:i.shadowOffsetX,shadowOffsetY:i.shadowOffsetY,text:this._getLabelText(i.formatter,l),textFont:this.getFont(n),textPosition:"inside",textColor:"auto"===a?this._getColor(t,l):a}}))}},_getValue:function(t){return this.getDataFromOption(this.series[t].data[0])},_colorMap:function(t){var e=this.series[t],i=e.min,o=e.max-i,s=e.axisLine.lineStyle.color;s instanceof Array||(s=[[1,s]]);for(var n=[],r=0,a=s.length;a>r;r++)n.push([s[r][0]*o+i,s[r][1]]);this._paramsMap[t].colorArray=n},_getColor:function(t,e){null==e&&(e=this._getValue(t));for(var i=this._paramsMap[t].colorArray,o=0,s=i.length;s>o;o++)if(i[o][0]>=e)return i[o][1];return i[i.length-1][1]},_getSector:function(t,e,i,o,s,n,r){return new h({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:t[0],y:t[1],r0:e,r:i,startAngle:o,endAngle:s,brushType:"fill",color:n,shadowColor:r.shadowColor,shadowBlur:r.shadowBlur,shadowOffsetX:r.shadowOffsetX,shadowOffsetY:r.shadowOffsetY}})},_getLabelText:function(t,e){if(t){if("function"==typeof t)return t.call(this.myChart,e);if("string"==typeof t)return t.replace("{value}",e)}return e},refresh:function(t){t&&(this.option=t,this.series=t.series),this.backupShapeList(),this._buildShape()}},p.inherits(e,i),t("../chart").define("gauge",e),e}),i("echarts/util/ecData",[],function(){function t(t,e,i,o,s,n,r,a){var h;return"undefined"!=typeof o&&(h=null==o.value?o:o.value),t._echartsData={_series:e,_seriesIndex:i,_data:o,_dataIndex:s,_name:n,_value:h,_special:r,_special2:a},t._echartsData}function e(t,e){var i=t._echartsData;if(!e)return i;switch(e){case"series":case"seriesIndex":case"data":case"dataIndex":case"name":case"value":case"special":case"special2":return i&&i["_"+e]}return null}function i(t,e,i){switch(t._echartsData=t._echartsData||{},e){case"series":case"seriesIndex":case"data":case"dataIndex":case"name":case"value":case"special":case"special2":t._echartsData["_"+e]=i}}function o(t,e){e._echartsData={_series:t._echartsData._series,_seriesIndex:t._echartsData._seriesIndex,_data:t._echartsData._data,_dataIndex:t._echartsData._dataIndex,_name:t._echartsData._name,_value:t._echartsData._value,_special:t._echartsData._special,_special2:t._echartsData._special2}}return{pack:t,set:i,get:e,clone:o}}),i("zrender/tool/color",["require","../tool/util"],function(t){function e(t){W=t}function i(){W=X}function o(t,e){return t=0|t,e=e||W,e[t%e.length]}function s(t){G=t}function n(){Z=G}function r(){return G}function a(t,e,i,o,s,n,r){N||(N=Y.getContext());for(var a=N.createRadialGradient(t,e,i,o,s,n),h=0,l=r.length;l>h;h++)a.addColorStop(r[h][0],r[h][1]);return a.__nonRecursion=!0,a}function h(t,e,i,o,s){N||(N=Y.getContext());for(var n=N.createLinearGradient(t,e,i,o),r=0,a=s.length;a>r;r++)n.addColorStop(s[r][0],s[r][1]);return n.__nonRecursion=!0,n}function l(t,e,i){t=g(t),e=g(e),t=A(t),e=A(e);for(var o=[],s=(e[0]-t[0])/i,n=(e[1]-t[1])/i,r=(e[2]-t[2])/i,a=(e[3]-t[3])/i,h=0,l=t[0],d=t[1],p=t[2],u=t[3];i>h;h++)o[h]=c([I(Math.floor(l),[0,255]),I(Math.floor(d),[0,255]),I(Math.floor(p),[0,255]),u.toFixed(4)-0],"rgba"),l+=s,d+=n,p+=r,u+=a;return l=e[0],d=e[1],p=e[2],u=e[3],o[h]=c([l,d,p,u],"rgba"),o}function d(t,e){var i=[],o=t.length;if(void 0===e&&(e=20),1===o)i=l(t[0],t[0],e);else if(o>1)for(var s=0,n=o-1;n>s;s++){var r=l(t[s],t[s+1],e);n-1>s&&r.pop(),i=i.concat(r)}return i}function c(t,e){if(e=e||"rgb",t&&(3===t.length||4===t.length)){if(t=O(t,function(t){return t>1?Math.ceil(t):t
}),e.indexOf("hex")>-1)return"#"+((1<<24)+(t[0]<<16)+(t[1]<<8)+ +t[2]).toString(16).slice(1);if(e.indexOf("hs")>-1){var i=O(t.slice(1,3),function(t){return t+"%"});t[1]=i[0],t[2]=i[1]}return e.indexOf("a")>-1?(3===t.length&&t.push(1),t[3]=I(t[3],[0,1]),e+"("+t.slice(0,4).join(",")+")"):e+"("+t.slice(0,3).join(",")+")"}}function p(t){t=z(t),t.indexOf("rgba")<0&&(t=g(t));var e=[],i=0;return t.replace(/[\d.]+/g,function(t){t=3>i?0|t:+t,e[i++]=t}),e}function u(t,e){if(!R(t))return t;var i=A(t),o=i[3];return"undefined"==typeof o&&(o=1),t.indexOf("hsb")>-1?i=P(i):t.indexOf("hsl")>-1&&(i=D(i)),e.indexOf("hsb")>-1||e.indexOf("hsv")>-1?i=H(i):e.indexOf("hsl")>-1&&(i=F(i)),i[3]=o,c(i,e)}function g(t){return u(t,"rgba")}function f(t){return u(t,"rgb")}function m(t){return u(t,"hex")}function _(t){return u(t,"hsva")}function y(t){return u(t,"hsv")}function x(t){return u(t,"hsba")}function v(t){return u(t,"hsb")}function b(t){return u(t,"hsla")}function S(t){return u(t,"hsl")}function T(t){for(var e in V)if(m(V[e])===m(t))return e;return null}function z(t){return String(t).replace(/\s+/g,"")}function C(t){if(V[t]&&(t=V[t]),t=z(t),t=t.replace(/hsv/i,"hsb"),/^#[\da-f]{3}$/i.test(t)){t=parseInt(t.slice(1),16);var e=(3840&t)<<8,i=(240&t)<<4,o=15&t;t="#"+((1<<24)+(e<<4)+e+(i<<4)+i+(o<<4)+o).toString(16).slice(1)}return t}function w(t,e){if(!R(t))return t;var i=e>0?1:-1;"undefined"==typeof e&&(e=0),e=Math.abs(e)>1?1:Math.abs(e),t=f(t);for(var o=A(t),s=0;3>s;s++)o[s]=1===i?o[s]*(1-e)|0:(255-o[s])*e+o[s]|0;return"rgb("+o.join(",")+")"}function L(t){if(!R(t))return t;var e=A(g(t));return e=O(e,function(t){return 255-t}),c(e,"rgb")}function E(t,e,i){if(!R(t)||!R(e))return t;"undefined"==typeof i&&(i=.5),i=1-I(i,[0,1]);for(var o=2*i-1,s=A(g(t)),n=A(g(e)),r=s[3]-n[3],a=((o*r===-1?o:(o+r)/(1+o*r))+1)/2,h=1-a,l=[],d=0;3>d;d++)l[d]=s[d]*a+n[d]*h;var p=s[3]*i+n[3]*(1-i);return p=Math.max(0,Math.min(1,p)),1===s[3]&&1===n[3]?c(l,"rgb"):(l[3]=p,c(l,"rgba"))}function M(){return"#"+(Math.random().toString(16)+"0000").slice(2,8)}function A(t){t=C(t);var e=t.match(q);if(null===e)throw new Error("The color format error");var i,o,s,n=[];if(e[2])i=e[2].replace("#","").split(""),s=[i[0]+i[1],i[2]+i[3],i[4]+i[5]],n=O(s,function(t){return I(parseInt(t,16),[0,255])});else if(e[4]){var r=e[4].split(",");o=r[3],s=r.slice(0,3),n=O(s,function(t){return t=Math.floor(t.indexOf("%")>0?2.55*parseInt(t,0):t),I(t,[0,255])}),"undefined"!=typeof o&&n.push(I(parseFloat(o),[0,1]))}else if(e[5]||e[6]){var a=(e[5]||e[6]).split(","),h=parseInt(a[0],0)/360,l=a[1],d=a[2];o=a[3],n=O([l,d],function(t){return I(parseFloat(t)/100,[0,1])}),n.unshift(h),"undefined"!=typeof o&&n.push(I(parseFloat(o),[0,1]))}return n}function k(t,e){if(!R(t))return t;null===e&&(e=1);var i=A(g(t));return i[3]=I(Number(e).toFixed(4),[0,1]),c(i,"rgba")}function O(t,e){if("function"!=typeof e)throw new TypeError;for(var i=t?t.length:0,o=0;i>o;o++)t[o]=e(t[o]);return t}function I(t,e){return t<=e[0]?t=e[0]:t>=e[1]&&(t=e[1]),t}function R(t){return t instanceof Array||"string"==typeof t}function P(t){var e,i,o,s=t[0],n=t[1],r=t[2];if(0===n)e=255*r,i=255*r,o=255*r;else{var a=6*s;6===a&&(a=0);var h=0|a,l=r*(1-n),d=r*(1-n*(a-h)),c=r*(1-n*(1-(a-h))),p=0,u=0,g=0;0===h?(p=r,u=c,g=l):1===h?(p=d,u=r,g=l):2===h?(p=l,u=r,g=c):3===h?(p=l,u=d,g=r):4===h?(p=c,u=l,g=r):(p=r,u=l,g=d),e=255*p,i=255*u,o=255*g}return[e,i,o]}function D(t){var e,i,o,s=t[0],n=t[1],r=t[2];if(0===n)e=255*r,i=255*r,o=255*r;else{var a;a=.5>r?r*(1+n):r+n-n*r;var h=2*r-a;e=255*B(h,a,s+1/3),i=255*B(h,a,s),o=255*B(h,a,s-1/3)}return[e,i,o]}function B(t,e,i){return 0>i&&(i+=1),i>1&&(i-=1),1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+(e-t)*(2/3-i)*6:t}function H(t){var e,i,o=t[0]/255,s=t[1]/255,n=t[2]/255,r=Math.min(o,s,n),a=Math.max(o,s,n),h=a-r,l=a;if(0===h)e=0,i=0;else{i=h/a;var d=((a-o)/6+h/2)/h,c=((a-s)/6+h/2)/h,p=((a-n)/6+h/2)/h;o===a?e=p-c:s===a?e=1/3+d-p:n===a&&(e=2/3+c-d),0>e&&(e+=1),e>1&&(e-=1)}return e=360*e,i=100*i,l=100*l,[e,i,l]}function F(t){var e,i,o=t[0]/255,s=t[1]/255,n=t[2]/255,r=Math.min(o,s,n),a=Math.max(o,s,n),h=a-r,l=(a+r)/2;if(0===h)e=0,i=0;else{i=.5>l?h/(a+r):h/(2-a-r);var d=((a-o)/6+h/2)/h,c=((a-s)/6+h/2)/h,p=((a-n)/6+h/2)/h;o===a?e=p-c:s===a?e=1/3+d-p:n===a&&(e=2/3+c-d),0>e&&(e+=1),e>1&&(e-=1)}return e=360*e,i=100*i,l=100*l,[e,i,l]}var N,Y=t("../tool/util"),W=["#ff9277"," #dddd00"," #ffc877"," #bbe3ff"," #d5ffbb","#bbbbff"," #ddb000"," #b0dd00"," #e2bbff"," #ffbbe3","#ff7777"," #ff9900"," #83dd00"," #77e3ff"," #778fff","#c877ff"," #ff77ab"," #ff6600"," #aa8800"," #77c7ff","#ad77ff"," #ff77ff"," #dd0083"," #777700"," #00aa00","#0088aa"," #8400dd"," #aa0088"," #dd0000"," #772e00"],X=W,G="rgba(255,255,0,0.5)",Z=G,q=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,V={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#0ff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000",blanchedalmond:"#ffebcd",blue:"#00f",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#0ff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#f0f",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#789",lightslategrey:"#789",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#0f0",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#f0f",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#f00",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#fff",whitesmoke:"#f5f5f5",yellow:"#ff0",yellowgreen:"#9acd32"};return{customPalette:e,resetPalette:i,getColor:o,getHighlightColor:r,customHighlight:s,resetHighlight:n,getRadialGradient:a,getLinearGradient:h,getGradientColors:d,getStepColors:l,reverse:L,mix:E,lift:w,trim:z,random:M,toRGB:f,toRGBA:g,toHex:m,toHSL:S,toHSLA:b,toHSB:v,toHSBA:x,toHSV:y,toHSVA:_,toName:T,toColor:c,toArray:p,alpha:k,getData:A}}),i("echarts/component/dataZoom",["require","./base","zrender/shape/Rectangle","zrender/shape/Polygon","../util/shape/Icon","../config","../util/date","zrender/tool/util","../component"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n);var r=this;r._ondrift=function(t,e){return r.__ondrift(this,t,e)},r._ondragend=function(){return r.__ondragend()},this._fillerSize=30,this._isSilence=!1,this._zoom={},this.option.dataZoom=this.reformOption(this.option.dataZoom),this.zoomOption=this.option.dataZoom,this._handleSize=this.zoomOption.handleSize,this.myChart.canvasSupported||(this.zoomOption.realtime=!1),this._location=this._getLocation(),this._zoom=this._getZoom(),this._backupData(),this.option.dataZoom.show&&this._buildShape(),this._syncData()}var i=t("./base"),o=t("zrender/shape/Rectangle"),s=t("zrender/shape/Polygon"),n=t("../util/shape/Icon"),r=t("../config");r.dataZoom={zlevel:0,z:4,show:!1,orient:"horizontal",backgroundColor:"rgba(0,0,0,0)",dataBackgroundColor:"#eee",fillerColor:"rgba(144,197,237,0.2)",handleColor:"rgba(70,130,180,0.8)",handleSize:8,showDetail:!0,realtime:!0};var a=t("../util/date"),h=t("zrender/tool/util");return e.prototype={type:r.COMPONENT_TYPE_DATAZOOM,_buildShape:function(){this._buildBackground(),this._buildFiller(),this._buildHandle(),this._buildFrame();for(var t=0,e=this.shapeList.length;e>t;t++)this.zr.addShape(this.shapeList[t]);this._syncFrameShape()},_getLocation:function(){var t,e,i,o,s=this.component.grid;return"horizontal"==this.zoomOption.orient?(i=this.zoomOption.width||s.getWidth(),o=this.zoomOption.height||this._fillerSize,t=null!=this.zoomOption.x?this.zoomOption.x:s.getX(),e=null!=this.zoomOption.y?this.zoomOption.y:this.zr.getHeight()-o-2):(i=this.zoomOption.width||this._fillerSize,o=this.zoomOption.height||s.getHeight(),t=null!=this.zoomOption.x?this.zoomOption.x:2,e=null!=this.zoomOption.y?this.zoomOption.y:s.getY()),{x:t,y:e,width:i,height:o}},_getZoom:function(){var t=this.option.series,e=this.option.xAxis;!e||e instanceof Array||(e=[e],this.option.xAxis=e);var i=this.option.yAxis;!i||i instanceof Array||(i=[i],this.option.yAxis=i);var o,s,n=[],a=this.zoomOption.xAxisIndex;if(e&&null==a){o=[];for(var h=0,l=e.length;l>h;h++)("category"==e[h].type||null==e[h].type)&&o.push(h)}else o=a instanceof Array?a:null!=a?[a]:[];if(a=this.zoomOption.yAxisIndex,i&&null==a){s=[];for(var h=0,l=i.length;l>h;h++)"category"==i[h].type&&s.push(h)}else s=a instanceof Array?a:null!=a?[a]:[];for(var d,h=0,l=t.length;l>h;h++)if(d=t[h],d.type==r.CHART_TYPE_LINE||d.type==r.CHART_TYPE_BAR||d.type==r.CHART_TYPE_SCATTER||d.type==r.CHART_TYPE_K){for(var c=0,p=o.length;p>c;c++)if(o[c]==(d.xAxisIndex||0)){n.push(h);break}for(var c=0,p=s.length;p>c;c++)if(s[c]==(d.yAxisIndex||0)){n.push(h);break}null==this.zoomOption.xAxisIndex&&null==this.zoomOption.yAxisIndex&&d.data&&this.getDataFromOption(d.data[0])instanceof Array&&(d.type==r.CHART_TYPE_SCATTER||d.type==r.CHART_TYPE_LINE||d.type==r.CHART_TYPE_BAR)&&n.push(h)}var u=null!=this._zoom.start?this._zoom.start:null!=this.zoomOption.start?this.zoomOption.start:0,g=null!=this._zoom.end?this._zoom.end:null!=this.zoomOption.end?this.zoomOption.end:100;u>g&&(u+=g,g=u-g,u-=g);var f=Math.round((g-u)/100*("horizontal"==this.zoomOption.orient?this._location.width:this._location.height));return{start:u,end:g,start2:0,end2:100,size:f,xAxisIndex:o,yAxisIndex:s,seriesIndex:n,scatterMap:this._zoom.scatterMap||{}}},_backupData:function(){this._originalData={xAxis:{},yAxis:{},series:{}};for(var t=this.option.xAxis,e=this._zoom.xAxisIndex,i=0,o=e.length;o>i;i++)this._originalData.xAxis[e[i]]=t[e[i]].data;for(var s=this.option.yAxis,n=this._zoom.yAxisIndex,i=0,o=n.length;o>i;i++)this._originalData.yAxis[n[i]]=s[n[i]].data;for(var a,h=this.option.series,l=this._zoom.seriesIndex,i=0,o=l.length;o>i;i++)a=h[l[i]],this._originalData.series[l[i]]=a.data,a.data&&this.getDataFromOption(a.data[0])instanceof Array&&(a.type==r.CHART_TYPE_SCATTER||a.type==r.CHART_TYPE_LINE||a.type==r.CHART_TYPE_BAR)&&(this._backupScale(),this._calculScatterMap(l[i]))},_calculScatterMap:function(e){this._zoom.scatterMap=this._zoom.scatterMap||{},this._zoom.scatterMap[e]=this._zoom.scatterMap[e]||{};var i=t("../component"),o=i.get("axis"),s=h.clone(this.option.xAxis);"category"==s[0].type&&(s[0].type="value"),s[1]&&"category"==s[1].type&&(s[1].type="value");var n=new o(this.ecTheme,null,!1,{xAxis:s,series:this.option.series},this,"xAxis"),r=this.option.series[e].xAxisIndex||0;this._zoom.scatterMap[e].x=n.getAxis(r).getExtremum(),n.dispose(),s=h.clone(this.option.yAxis),"category"==s[0].type&&(s[0].type="value"),s[1]&&"category"==s[1].type&&(s[1].type="value"),n=new o(this.ecTheme,null,!1,{yAxis:s,series:this.option.series},this,"yAxis"),r=this.option.series[e].yAxisIndex||0,this._zoom.scatterMap[e].y=n.getAxis(r).getExtremum(),n.dispose()},_buildBackground:function(){var t=this._location.width,e=this._location.height;this.shapeList.push(new o({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._location.x,y:this._location.y,width:t,height:e,color:this.zoomOption.backgroundColor}}));for(var i=0,n=this._originalData.xAxis,a=this._zoom.xAxisIndex,h=0,l=a.length;l>h;h++)i=Math.max(i,n[a[h]].length);for(var d=this._originalData.yAxis,c=this._zoom.yAxisIndex,h=0,l=c.length;l>h;h++)i=Math.max(i,d[c[h]].length);for(var p,u=this._zoom.seriesIndex[0],g=this._originalData.series[u],f=Number.MIN_VALUE,m=Number.MAX_VALUE,h=0,l=g.length;l>h;h++)p=this.getDataFromOption(g[h],0),this.option.series[u].type==r.CHART_TYPE_K&&(p=p[1]),isNaN(p)&&(p=0),f=Math.max(f,p),m=Math.min(m,p);var _=f-m,y=[],x=t/(i-(i>1?1:0)),v=e/(i-(i>1?1:0)),b=1;"horizontal"==this.zoomOption.orient&&1>x?b=Math.floor(3*i/t):"vertical"==this.zoomOption.orient&&1>v&&(b=Math.floor(3*i/e));for(var h=0,l=i;l>h;h+=b)p=this.getDataFromOption(g[h],0),this.option.series[u].type==r.CHART_TYPE_K&&(p=p[1]),isNaN(p)&&(p=0),y.push("horizontal"==this.zoomOption.orient?[this._location.x+x*h,this._location.y+e-1-Math.round((p-m)/_*(e-10))]:[this._location.x+1+Math.round((p-m)/_*(t-10)),this._location.y+v*(l-h-1)]);"horizontal"==this.zoomOption.orient?(y.push([this._location.x+t,this._location.y+e]),y.push([this._location.x,this._location.y+e])):(y.push([this._location.x,this._location.y]),y.push([this._location.x,this._location.y+e])),this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase(),style:{pointList:y,color:this.zoomOption.dataBackgroundColor},hoverable:!1}))},_buildFiller:function(){this._fillerShae={zlevel:this.getZlevelBase(),z:this.getZBase(),draggable:!0,ondrift:this._ondrift,ondragend:this._ondragend,_type:"filler"},this._fillerShae.style="horizontal"==this.zoomOption.orient?{x:this._location.x+Math.round(this._zoom.start/100*this._location.width)+this._handleSize,y:this._location.y,width:this._zoom.size-2*this._handleSize,height:this._location.height,color:this.zoomOption.fillerColor,text:":::",textPosition:"inside"}:{x:this._location.x,y:this._location.y+Math.round(this._zoom.start/100*this._location.height)+this._handleSize,width:this._location.width,height:this._zoom.size-2*this._handleSize,color:this.zoomOption.fillerColor,text:"::",textPosition:"inside"},this._fillerShae.highlightStyle={brushType:"fill",color:"rgba(0,0,0,0)"},this._fillerShae=new o(this._fillerShae),this.shapeList.push(this._fillerShae)},_buildHandle:function(){var t=this.zoomOption.showDetail?this._getDetail():{start:"",end:""};this._startShape={zlevel:this.getZlevelBase(),z:this.getZBase(),draggable:!0,style:{iconType:"rectangle",x:this._location.x,y:this._location.y,width:this._handleSize,height:this._handleSize,color:this.zoomOption.handleColor,text:"=",textPosition:"inside"},highlightStyle:{text:t.start,brushType:"fill",textPosition:"left"},ondrift:this._ondrift,ondragend:this._ondragend},"horizontal"==this.zoomOption.orient?(this._startShape.style.height=this._location.height,this._endShape=h.clone(this._startShape),this._startShape.style.x=this._fillerShae.style.x-this._handleSize,this._endShape.style.x=this._fillerShae.style.x+this._fillerShae.style.width,this._endShape.highlightStyle.text=t.end,this._endShape.highlightStyle.textPosition="right"):(this._startShape.style.width=this._location.width,this._endShape=h.clone(this._startShape),this._startShape.style.y=this._fillerShae.style.y+this._fillerShae.style.height,this._startShape.highlightStyle.textPosition="bottom",this._endShape.style.y=this._fillerShae.style.y-this._handleSize,this._endShape.highlightStyle.text=t.end,this._endShape.highlightStyle.textPosition="top"),this._startShape=new n(this._startShape),this._endShape=new n(this._endShape),this.shapeList.push(this._startShape),this.shapeList.push(this._endShape)},_buildFrame:function(){var t=this.subPixelOptimize(this._location.x,1),e=this.subPixelOptimize(this._location.y,1);this._startFrameShape={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:t,y:e,width:this._location.width-(t>this._location.x?1:0),height:this._location.height-(e>this._location.y?1:0),lineWidth:1,brushType:"stroke",strokeColor:this.zoomOption.handleColor}},this._endFrameShape=h.clone(this._startFrameShape),this._startFrameShape=new o(this._startFrameShape),this._endFrameShape=new o(this._endFrameShape),this.shapeList.push(this._startFrameShape),this.shapeList.push(this._endFrameShape)},_syncHandleShape:function(){"horizontal"==this.zoomOption.orient?(this._startShape.style.x=this._fillerShae.style.x-this._handleSize,this._endShape.style.x=this._fillerShae.style.x+this._fillerShae.style.width,this._zoom.start=(this._startShape.style.x-this._location.x)/this._location.width*100,this._zoom.end=(this._endShape.style.x+this._handleSize-this._location.x)/this._location.width*100):(this._startShape.style.y=this._fillerShae.style.y+this._fillerShae.style.height,this._endShape.style.y=this._fillerShae.style.y-this._handleSize,this._zoom.start=(this._location.y+this._location.height-this._startShape.style.y)/this._location.height*100,this._zoom.end=(this._location.y+this._location.height-this._endShape.style.y-this._handleSize)/this._location.height*100),this.zr.modShape(this._startShape.id),this.zr.modShape(this._endShape.id),this._syncFrameShape(),this.zr.refreshNextFrame()},_syncFillerShape:function(){var t,e;"horizontal"==this.zoomOption.orient?(t=this._startShape.style.x,e=this._endShape.style.x,this._fillerShae.style.x=Math.min(t,e)+this._handleSize,this._fillerShae.style.width=Math.abs(t-e)-this._handleSize,this._zoom.start=(Math.min(t,e)-this._location.x)/this._location.width*100,this._zoom.end=(Math.max(t,e)+this._handleSize-this._location.x)/this._location.width*100):(t=this._startShape.style.y,e=this._endShape.style.y,this._fillerShae.style.y=Math.min(t,e)+this._handleSize,this._fillerShae.style.height=Math.abs(t-e)-this._handleSize,this._zoom.start=(this._location.y+this._location.height-Math.max(t,e))/this._location.height*100,this._zoom.end=(this._location.y+this._location.height-Math.min(t,e)-this._handleSize)/this._location.height*100),this.zr.modShape(this._fillerShae.id),this._syncFrameShape(),this.zr.refreshNextFrame()},_syncFrameShape:function(){"horizontal"==this.zoomOption.orient?(this._startFrameShape.style.width=this._fillerShae.style.x-this._location.x,this._endFrameShape.style.x=this._fillerShae.style.x+this._fillerShae.style.width,this._endFrameShape.style.width=this._location.x+this._location.width-this._endFrameShape.style.x):(this._startFrameShape.style.y=this._fillerShae.style.y+this._fillerShae.style.height,this._startFrameShape.style.height=this._location.y+this._location.height-this._startFrameShape.style.y,this._endFrameShape.style.height=this._fillerShae.style.y-this._location.y),this.zr.modShape(this._startFrameShape.id),this.zr.modShape(this._endFrameShape.id)},_syncShape:function(){this.zoomOption.show&&("horizontal"==this.zoomOption.orient?(this._startShape.style.x=this._location.x+this._zoom.start/100*this._location.width,this._endShape.style.x=this._location.x+this._zoom.end/100*this._location.width-this._handleSize,this._fillerShae.style.x=this._startShape.style.x+this._handleSize,this._fillerShae.style.width=this._endShape.style.x-this._startShape.style.x-this._handleSize):(this._startShape.style.y=this._location.y+this._location.height-this._zoom.start/100*this._location.height,this._endShape.style.y=this._location.y+this._location.height-this._zoom.end/100*this._location.height-this._handleSize,this._fillerShae.style.y=this._endShape.style.y+this._handleSize,this._fillerShae.style.height=this._startShape.style.y-this._endShape.style.y-this._handleSize),this.zr.modShape(this._startShape.id),this.zr.modShape(this._endShape.id),this.zr.modShape(this._fillerShae.id),this._syncFrameShape(),this.zr.refresh())},_syncData:function(t){var e,i,o,s,n;for(var a in this._originalData){e=this._originalData[a];for(var h in e)n=e[h],null!=n&&(s=n.length,i=Math.floor(this._zoom.start/100*s),o=Math.ceil(this._zoom.end/100*s),this.getDataFromOption(n[0])instanceof Array&&this.option[a][h].type!=r.CHART_TYPE_K?(this._setScale(),this.option[a][h].data=this._synScatterData(h,n)):this.option[a][h].data=n.slice(i,o))}this._isSilence||!this.zoomOption.realtime&&!t||this.messageCenter.dispatch(r.EVENT.DATA_ZOOM,null,{zoom:this._zoom},this.myChart)},_synScatterData:function(t,e){if(0===this._zoom.start&&100==this._zoom.end&&0===this._zoom.start2&&100==this._zoom.end2)return e;var i,o,s,n,r,a=[],h=this._zoom.scatterMap[t];"horizontal"==this.zoomOption.orient?(i=h.x.max-h.x.min,o=this._zoom.start/100*i+h.x.min,s=this._zoom.end/100*i+h.x.min,i=h.y.max-h.y.min,n=this._zoom.start2/100*i+h.y.min,r=this._zoom.end2/100*i+h.y.min):(i=h.x.max-h.x.min,o=this._zoom.start2/100*i+h.x.min,s=this._zoom.end2/100*i+h.x.min,i=h.y.max-h.y.min,n=this._zoom.start/100*i+h.y.min,r=this._zoom.end/100*i+h.y.min);var l;(l=h.x.dataMappingMethods)&&(o=l.coord2Value(o),s=l.coord2Value(s)),(l=h.y.dataMappingMethods)&&(n=l.coord2Value(n),r=l.coord2Value(r));for(var d,c=0,p=e.length;p>c;c++)d=e[c].value||e[c],d[0]>=o&&d[0]<=s&&d[1]>=n&&d[1]<=r&&a.push(e[c]);return a},_setScale:function(){var t=0!==this._zoom.start||100!==this._zoom.end||0!==this._zoom.start2||100!==this._zoom.end2,e={xAxis:this.option.xAxis,yAxis:this.option.yAxis};for(var i in e)for(var o=0,s=e[i].length;s>o;o++)e[i][o].scale=t||e[i][o]._scale},_backupScale:function(){var t={xAxis:this.option.xAxis,yAxis:this.option.yAxis};for(var e in t)for(var i=0,o=t[e].length;o>i;i++)t[e][i]._scale=t[e][i].scale},_getDetail:function(){for(var t=["xAxis","yAxis"],e=0,i=t.length;i>e;e++){var o=this._originalData[t[e]];for(var s in o){var n=o[s];if(null!=n){var r=n.length,h=Math.floor(this._zoom.start/100*r),l=Math.ceil(this._zoom.end/100*r);return l-=l>0?1:0,{start:this.getDataFromOption(n[h]),end:this.getDataFromOption(n[l])}}}}t="horizontal"==this.zoomOption.orient?"xAxis":"yAxis";var d=this._zoom.seriesIndex[0],c=this.option.series[d][t+"Index"]||0,p=this.option[t][c].type,u=this._zoom.scatterMap[d][t.charAt(0)].min,g=this._zoom.scatterMap[d][t.charAt(0)].max,f=g-u;if("value"==p)return{start:u+f*this._zoom.start/100,end:u+f*this._zoom.end/100};if("time"==p){g=u+f*this._zoom.end/100,u+=f*this._zoom.start/100;var m=a.getAutoFormatter(u,g).formatter;return{start:a.format(m,u),end:a.format(m,g)}}return{start:"",end:""}},__ondrift:function(t,e,i){this.zoomOption.zoomLock&&(t=this._fillerShae);var o="filler"==t._type?this._handleSize:0;if("horizontal"==this.zoomOption.orient?t.style.x+e-o<=this._location.x?t.style.x=this._location.x+o:t.style.x+e+t.style.width+o>=this._location.x+this._location.width?t.style.x=this._location.x+this._location.width-t.style.width-o:t.style.x+=e:t.style.y+i-o<=this._location.y?t.style.y=this._location.y+o:t.style.y+i+t.style.height+o>=this._location.y+this._location.height?t.style.y=this._location.y+this._location.height-t.style.height-o:t.style.y+=i,"filler"==t._type?this._syncHandleShape():this._syncFillerShape(),this.zoomOption.realtime&&this._syncData(),this.zoomOption.showDetail){var s=this._getDetail();this._startShape.style.text=this._startShape.highlightStyle.text=s.start,this._endShape.style.text=this._endShape.highlightStyle.text=s.end,this._startShape.style.textPosition=this._startShape.highlightStyle.textPosition,this._endShape.style.textPosition=this._endShape.highlightStyle.textPosition}return!0},__ondragend:function(){this.zoomOption.showDetail&&(this._startShape.style.text=this._endShape.style.text="=",this._startShape.style.textPosition=this._endShape.style.textPosition="inside",this.zr.modShape(this._startShape.id),this.zr.modShape(this._endShape.id),this.zr.refreshNextFrame()),this.isDragend=!0},ondragend:function(t,e){this.isDragend&&t.target&&(!this.zoomOption.realtime&&this._syncData(),e.dragOut=!0,e.dragIn=!0,this._isSilence||this.zoomOption.realtime||this.messageCenter.dispatch(r.EVENT.DATA_ZOOM,null,{zoom:this._zoom},this.myChart),e.needRefresh=!1,this.isDragend=!1)},ondataZoom:function(t,e){e.needRefresh=!0},absoluteZoom:function(t){this._zoom.start=t.start,this._zoom.end=t.end,this._zoom.start2=t.start2,this._zoom.end2=t.end2,this._syncShape(),this._syncData(!0)},rectZoom:function(t){if(!t)return this._zoom.start=this._zoom.start2=0,this._zoom.end=this._zoom.end2=100,this._syncShape(),this._syncData(!0),this._zoom;var e=this.component.grid.getArea(),i={x:t.x,y:t.y,width:t.width,height:t.height};if(i.width<0&&(i.x+=i.width,i.width=-i.width),i.height<0&&(i.y+=i.height,i.height=-i.height),i.x>e.x+e.width||i.y>e.y+e.height)return!1;i.x<e.x&&(i.x=e.x),i.x+i.width>e.x+e.width&&(i.width=e.x+e.width-i.x),i.y+i.height>e.y+e.height&&(i.height=e.y+e.height-i.y);var o,s=(i.x-e.x)/e.width,n=1-(i.x+i.width-e.x)/e.width,r=1-(i.y+i.height-e.y)/e.height,a=(i.y-e.y)/e.height;return"horizontal"==this.zoomOption.orient?(o=this._zoom.end-this._zoom.start,this._zoom.start+=o*s,this._zoom.end-=o*n,o=this._zoom.end2-this._zoom.start2,this._zoom.start2+=o*r,this._zoom.end2-=o*a):(o=this._zoom.end-this._zoom.start,this._zoom.start+=o*r,this._zoom.end-=o*a,o=this._zoom.end2-this._zoom.start2,this._zoom.start2+=o*s,this._zoom.end2-=o*n),this._syncShape(),this._syncData(!0),this._zoom},syncBackupData:function(t){for(var e,i,o=this._originalData.series,s=t.series,n=0,r=s.length;r>n;n++){i=s[n].data||s[n].eventList,e=o[n]?Math.floor(this._zoom.start/100*o[n].length):0;for(var a=0,h=i.length;h>a;a++)o[n]&&(o[n][a+e]=i[a])}},syncOption:function(t){this.silence(!0),this.option=t,this.option.dataZoom=this.reformOption(this.option.dataZoom),this.zoomOption=this.option.dataZoom,this.myChart.canvasSupported||(this.zoomOption.realtime=!1),this.clear(),this._location=this._getLocation(),this._zoom=this._getZoom(),this._backupData(),this.option.dataZoom&&this.option.dataZoom.show&&this._buildShape(),this._syncData(),this.silence(!1)},silence:function(t){this._isSilence=t},getRealDataIndex:function(t,e){if(!this._originalData||0===this._zoom.start&&100==this._zoom.end)return e;var i=this._originalData.series;return i[t]?Math.floor(this._zoom.start/100*i[t].length)+e:-1},resize:function(){this.clear(),this._location=this._getLocation(),this._zoom=this._getZoom(),this.option.dataZoom.show&&this._buildShape()}},h.inherits(e,i),t("../component").define("dataZoom",e),e}),i("zrender/shape/Text",["require","../tool/area","./Base","../tool/util"],function(t){var e=t("../tool/area"),i=t("./Base"),o=function(t){i.call(this,t)};return o.prototype={type:"text",brush:function(t,i){var o=this.style;if(i&&(o=this.getHighlightStyle(o,this.highlightStyle||{})),"undefined"!=typeof o.text&&o.text!==!1){t.save(),this.doClip(t),this.setContext(t,o),this.setTransform(t),o.textFont&&(t.font=o.textFont),t.textAlign=o.textAlign||"start",t.textBaseline=o.textBaseline||"middle";var s,n=(o.text+"").split("\n"),r=e.getTextHeight("国",o.textFont),a=this.getRect(o),h=o.x;s="top"==o.textBaseline?a.y:"bottom"==o.textBaseline?a.y+r:a.y+r/2;for(var l=0,d=n.length;d>l;l++){if(o.maxWidth)switch(o.brushType){case"fill":t.fillText(n[l],h,s,o.maxWidth);break;case"stroke":t.strokeText(n[l],h,s,o.maxWidth);break;case"both":t.fillText(n[l],h,s,o.maxWidth),t.strokeText(n[l],h,s,o.maxWidth);break;default:t.fillText(n[l],h,s,o.maxWidth)}else switch(o.brushType){case"fill":t.fillText(n[l],h,s);break;case"stroke":t.strokeText(n[l],h,s);break;case"both":t.fillText(n[l],h,s),t.strokeText(n[l],h,s);break;default:t.fillText(n[l],h,s)}s+=r}t.restore()}},getRect:function(t){if(t.__rect)return t.__rect;var i=e.getTextWidth(t.text,t.textFont),o=e.getTextHeight(t.text,t.textFont),s=t.x;"end"==t.textAlign||"right"==t.textAlign?s-=i:"center"==t.textAlign&&(s-=i/2);var n;return n="top"==t.textBaseline?t.y:"bottom"==t.textBaseline?t.y-o:t.y-o/2,t.__rect={x:s,y:n,width:i,height:o},t.__rect}},t("../tool/util").inherits(o,i),o}),i("zrender/shape/Rectangle",["require","./Base","../tool/util"],function(t){var e=t("./Base"),i=function(t){e.call(this,t)};return i.prototype={type:"rectangle",_buildRadiusPath:function(t,e){var i,o,s,n,r=e.x,a=e.y,h=e.width,l=e.height,d=e.radius;"number"==typeof d?i=o=s=n=d:d instanceof Array?1===d.length?i=o=s=n=d[0]:2===d.length?(i=s=d[0],o=n=d[1]):3===d.length?(i=d[0],o=n=d[1],s=d[2]):(i=d[0],o=d[1],s=d[2],n=d[3]):i=o=s=n=0;var c;i+o>h&&(c=i+o,i*=h/c,o*=h/c),s+n>h&&(c=s+n,s*=h/c,n*=h/c),o+s>l&&(c=o+s,o*=l/c,s*=l/c),i+n>l&&(c=i+n,i*=l/c,n*=l/c),t.moveTo(r+i,a),t.lineTo(r+h-o,a),0!==o&&t.quadraticCurveTo(r+h,a,r+h,a+o),t.lineTo(r+h,a+l-s),0!==s&&t.quadraticCurveTo(r+h,a+l,r+h-s,a+l),t.lineTo(r+n,a+l),0!==n&&t.quadraticCurveTo(r,a+l,r,a+l-n),t.lineTo(r,a+i),0!==i&&t.quadraticCurveTo(r,a,r+i,a)},buildPath:function(t,e){e.radius?this._buildRadiusPath(t,e):(t.moveTo(e.x,e.y),t.lineTo(e.x+e.width,e.y),t.lineTo(e.x+e.width,e.y+e.height),t.lineTo(e.x,e.y+e.height),t.lineTo(e.x,e.y)),t.closePath()},getRect:function(t){if(t.__rect)return t.__rect;var e;return e="stroke"==t.brushType||"fill"==t.brushType?t.lineWidth||1:0,t.__rect={x:Math.round(t.x-e/2),y:Math.round(t.y-e/2),width:t.width+e,height:t.height+e},t.__rect}},t("../tool/util").inherits(i,e),i}),i("zrender/shape/Circle",["require","./Base","../tool/util"],function(t){"use strict";var e=t("./Base"),i=function(t){e.call(this,t)};return i.prototype={type:"circle",buildPath:function(t,e){t.moveTo(e.x+e.r,e.y),t.arc(e.x,e.y,e.r,0,2*Math.PI,!0)},getRect:function(t){if(t.__rect)return t.__rect;var e;return e="stroke"==t.brushType||"fill"==t.brushType?t.lineWidth||1:0,t.__rect={x:Math.round(t.x-t.r-e/2),y:Math.round(t.y-t.r-e/2),width:2*t.r+e,height:2*t.r+e},t.__rect}},t("../tool/util").inherits(i,e),i}),i("zrender/shape/Polyline",["require","./Base","./util/smoothSpline","./util/smoothBezier","./util/dashedLineTo","./Polygon","../tool/util"],function(t){var e=t("./Base"),i=t("./util/smoothSpline"),o=t("./util/smoothBezier"),s=t("./util/dashedLineTo"),n=function(t){this.brushTypeOnly="stroke",this.textPosition="end",e.call(this,t)};return n.prototype={type:"polyline",buildPath:function(t,e){var o=e.pointList;if(!(o.length<2)){var n=Math.min(e.pointList.length,Math.round(e.pointListLength||e.pointList.length));if(e.smooth&&"spline"!==e.smooth){e.controlPointList||this.updateControlPoints(e);var r=e.controlPointList;t.moveTo(o[0][0],o[0][1]);for(var a,h,l,d=0;n-1>d;d++)a=r[2*d],h=r[2*d+1],l=o[d+1],t.bezierCurveTo(a[0],a[1],h[0],h[1],l[0],l[1])}else if("spline"===e.smooth&&(o=i(o),n=o.length),e.lineType&&"solid"!=e.lineType){if("dashed"==e.lineType||"dotted"==e.lineType){var c=(e.lineWidth||1)*("dashed"==e.lineType?5:1);t.moveTo(o[0][0],o[0][1]);for(var d=1;n>d;d++)s(t,o[d-1][0],o[d-1][1],o[d][0],o[d][1],c)}}else{t.moveTo(o[0][0],o[0][1]);for(var d=1;n>d;d++)t.lineTo(o[d][0],o[d][1])}}},updateControlPoints:function(t){t.controlPointList=o(t.pointList,t.smooth,!1,t.smoothConstraint)},getRect:function(e){return t("./Polygon").prototype.getRect(e)
}},t("../tool/util").inherits(n,e),n}),i("zrender/tool/math",[],function(){function t(t,e){return Math.sin(e?t*s:t)}function e(t,e){return Math.cos(e?t*s:t)}function i(t){return t*s}function o(t){return t/s}var s=Math.PI/180;return{sin:t,cos:e,degreeToRadian:i,radianToDegree:o}}),i("zrender/shape/Sector",["require","../tool/math","../tool/computeBoundingBox","../tool/vector","./Base","../tool/util"],function(t){var e=t("../tool/math"),i=t("../tool/computeBoundingBox"),o=t("../tool/vector"),s=t("./Base"),n=o.create(),r=o.create(),a=o.create(),h=o.create(),l=function(t){s.call(this,t)};return l.prototype={type:"sector",buildPath:function(t,i){var o=i.x,s=i.y,n=i.r0||0,r=i.r,a=i.startAngle,h=i.endAngle,l=i.clockWise||!1;a=e.degreeToRadian(a),h=e.degreeToRadian(h),l||(a=-a,h=-h);var d=e.cos(a),c=e.sin(a);t.moveTo(d*n+o,c*n+s),t.lineTo(d*r+o,c*r+s),t.arc(o,s,r,a,h,!l),t.lineTo(e.cos(h)*n+o,e.sin(h)*n+s),0!==n&&t.arc(o,s,n,h,a,l),t.closePath()},getRect:function(t){if(t.__rect)return t.__rect;var s=t.x,l=t.y,d=t.r0||0,c=t.r,p=e.degreeToRadian(t.startAngle),u=e.degreeToRadian(t.endAngle),g=t.clockWise;return g||(p=-p,u=-u),d>1?i.arc(s,l,d,p,u,!g,n,a):(n[0]=a[0]=s,n[1]=a[1]=l),i.arc(s,l,c,p,u,!g,r,h),o.min(n,n,r),o.max(a,a,h),t.__rect={x:n[0],y:n[1],width:a[0]-n[0],height:a[1]-n[1]},t.__rect}},t("../tool/util").inherits(l,s),l}),i("zrender/shape/Image",["require","./Base","../tool/util"],function(t){var e=t("./Base"),i=function(t){e.call(this,t)};return i.prototype={type:"image",brush:function(t,e,i){var o=this.style||{};e&&(o=this.getHighlightStyle(o,this.highlightStyle||{}));var s=o.image,n=this;if(this._imageCache||(this._imageCache={}),"string"==typeof s){var r=s;this._imageCache[r]?s=this._imageCache[r]:(s=new Image,s.onload=function(){s.onload=null,n.modSelf(),i()},s.src=r,this._imageCache[r]=s)}if(s){if("IMG"==s.nodeName.toUpperCase())if(window.ActiveXObject){if("complete"!=s.readyState)return}else if(!s.complete)return;var a=o.width||s.width,h=o.height||s.height,l=o.x,d=o.y;if(!s.width||!s.height)return;if(t.save(),this.doClip(t),this.setContext(t,o),this.setTransform(t),o.sWidth&&o.sHeight){var c=o.sx||0,p=o.sy||0;t.drawImage(s,c,p,o.sWidth,o.sHeight,l,d,a,h)}else if(o.sx&&o.sy){var c=o.sx,p=o.sy,u=a-c,g=h-p;t.drawImage(s,c,p,u,g,l,d,a,h)}else t.drawImage(s,l,d,a,h);o.width||(o.width=a),o.height||(o.height=h),this.style.width||(this.style.width=a),this.style.height||(this.style.height=h),this.drawText(t,o,this.style),t.restore()}},getRect:function(t){return{x:t.x,y:t.y,width:t.width,height:t.height}},clearCache:function(){this._imageCache={}}},t("../tool/util").inherits(i,e),i}),i("zrender/shape/ShapeBundle",["require","./Base","../tool/util"],function(t){var e=t("./Base"),i=function(t){e.call(this,t)};return i.prototype={constructor:i,type:"shape-bundle",brush:function(t,e){var i=this.beforeBrush(t,e);t.beginPath();for(var o=0;o<i.shapeList.length;o++){var s=i.shapeList[o],n=s.style;e&&(n=s.getHighlightStyle(n,s.highlightStyle||{},s.brushTypeOnly)),s.buildPath(t,n)}switch(i.brushType){case"both":t.fill();case"stroke":i.lineWidth>0&&t.stroke();break;default:t.fill()}this.drawText(t,i,this.style),this.afterBrush(t)},getRect:function(t){if(t.__rect)return t.__rect;for(var e=1/0,i=-1/0,o=1/0,s=-1/0,n=0;n<t.shapeList.length;n++)var r=t.shapeList[n],a=r.getRect(r.style),e=Math.min(a.x,e),o=Math.min(a.y,o),i=Math.max(a.x+a.width,i),s=Math.max(a.y+a.height,s);return t.__rect={x:e,y:o,width:i-e,height:s-o},t.__rect},isCover:function(t,e){var i=this.transformCoordToLocal(t,e);if(t=i[0],e=i[1],this.isCoverRect(t,e))for(var o=0;o<this.style.shapeList.length;o++){var s=this.style.shapeList[o];if(s.isCover(t,e))return!0}return!1}},t("../tool/util").inherits(i,e),i}),i("zrender/shape/Ring",["require","./Base","../tool/util"],function(t){var e=t("./Base"),i=function(t){e.call(this,t)};return i.prototype={type:"ring",buildPath:function(t,e){t.arc(e.x,e.y,e.r,0,2*Math.PI,!1),t.moveTo(e.x+e.r0,e.y),t.arc(e.x,e.y,e.r0,0,2*Math.PI,!0)},getRect:function(t){if(t.__rect)return t.__rect;var e;return e="stroke"==t.brushType||"fill"==t.brushType?t.lineWidth||1:0,t.__rect={x:Math.round(t.x-t.r-e/2),y:Math.round(t.y-t.r-e/2),width:2*t.r+e,height:2*t.r+e},t.__rect}},t("../tool/util").inherits(i,e),i}),i("echarts/util/shape/Icon",["require","zrender/tool/util","zrender/shape/Star","zrender/shape/Heart","zrender/shape/Droplet","zrender/shape/Image","zrender/shape/Base"],function(t){function e(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i,o+e.height),t.lineTo(i+5*s,o+14*n),t.lineTo(i+e.width,o+3*n),t.lineTo(i+13*s,o),t.lineTo(i+2*s,o+11*n),t.lineTo(i,o+e.height),t.moveTo(i+6*s,o+10*n),t.lineTo(i+14*s,o+2*n),t.moveTo(i+10*s,o+13*n),t.lineTo(i+e.width,o+13*n),t.moveTo(i+13*s,o+10*n),t.lineTo(i+13*s,o+e.height)}function i(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i,o+e.height),t.lineTo(i+5*s,o+14*n),t.lineTo(i+e.width,o+3*n),t.lineTo(i+13*s,o),t.lineTo(i+2*s,o+11*n),t.lineTo(i,o+e.height),t.moveTo(i+6*s,o+10*n),t.lineTo(i+14*s,o+2*n),t.moveTo(i+10*s,o+13*n),t.lineTo(i+e.width,o+13*n)}function o(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i+4*s,o+15*n),t.lineTo(i+9*s,o+13*n),t.lineTo(i+14*s,o+8*n),t.lineTo(i+11*s,o+5*n),t.lineTo(i+6*s,o+10*n),t.lineTo(i+4*s,o+15*n),t.moveTo(i+5*s,o),t.lineTo(i+11*s,o),t.moveTo(i+5*s,o+n),t.lineTo(i+11*s,o+n),t.moveTo(i,o+2*n),t.lineTo(i+e.width,o+2*n),t.moveTo(i,o+5*n),t.lineTo(i+3*s,o+e.height),t.lineTo(i+13*s,o+e.height),t.lineTo(i+e.width,o+5*n)}function s(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i,o+3*n),t.lineTo(i+6*s,o+3*n),t.moveTo(i+3*s,o),t.lineTo(i+3*s,o+6*n),t.moveTo(i+3*s,o+8*n),t.lineTo(i+3*s,o+e.height),t.lineTo(i+e.width,o+e.height),t.lineTo(i+e.width,o+3*n),t.lineTo(i+8*s,o+3*n)}function n(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i+6*s,o),t.lineTo(i+2*s,o+3*n),t.lineTo(i+6*s,o+6*n),t.moveTo(i+2*s,o+3*n),t.lineTo(i+14*s,o+3*n),t.lineTo(i+14*s,o+11*n),t.moveTo(i+2*s,o+5*n),t.lineTo(i+2*s,o+13*n),t.lineTo(i+14*s,o+13*n),t.moveTo(i+10*s,o+10*n),t.lineTo(i+14*s,o+13*n),t.lineTo(i+10*s,o+e.height)}function r(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16,r=e.width/2;t.lineWidth=1.5,t.arc(i+r,o+r,r-s,0,2*Math.PI/3),t.moveTo(i+3*s,o+e.height),t.lineTo(i+0*s,o+12*n),t.lineTo(i+5*s,o+11*n),t.moveTo(i,o+8*n),t.arc(i+r,o+r,r-s,Math.PI,5*Math.PI/3),t.moveTo(i+13*s,o),t.lineTo(i+e.width,o+4*n),t.lineTo(i+11*s,o+5*n)}function a(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i,o),t.lineTo(i,o+e.height),t.lineTo(i+e.width,o+e.height),t.moveTo(i+2*s,o+14*n),t.lineTo(i+7*s,o+6*n),t.lineTo(i+11*s,o+11*n),t.lineTo(i+15*s,o+2*n)}function h(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i,o),t.lineTo(i,o+e.height),t.lineTo(i+e.width,o+e.height),t.moveTo(i+3*s,o+14*n),t.lineTo(i+3*s,o+6*n),t.lineTo(i+4*s,o+6*n),t.lineTo(i+4*s,o+14*n),t.moveTo(i+7*s,o+14*n),t.lineTo(i+7*s,o+2*n),t.lineTo(i+8*s,o+2*n),t.lineTo(i+8*s,o+14*n),t.moveTo(i+11*s,o+14*n),t.lineTo(i+11*s,o+9*n),t.lineTo(i+12*s,o+9*n),t.lineTo(i+12*s,o+14*n)}function l(t,e){var i=e.x,o=e.y,s=e.width-2,n=e.height-2,r=Math.min(s,n)/2;o+=2,t.moveTo(i+r+3,o+r-3),t.arc(i+r+3,o+r-3,r-1,0,-Math.PI/2,!0),t.lineTo(i+r+3,o+r-3),t.moveTo(i+r,o),t.lineTo(i+r,o+r),t.arc(i+r,o+r,r,-Math.PI/2,2*Math.PI,!0),t.lineTo(i+r,o+r),t.lineWidth=1.5}function d(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;o-=n,t.moveTo(i+1*s,o+2*n),t.lineTo(i+15*s,o+2*n),t.lineTo(i+14*s,o+3*n),t.lineTo(i+2*s,o+3*n),t.moveTo(i+3*s,o+6*n),t.lineTo(i+13*s,o+6*n),t.lineTo(i+12*s,o+7*n),t.lineTo(i+4*s,o+7*n),t.moveTo(i+5*s,o+10*n),t.lineTo(i+11*s,o+10*n),t.lineTo(i+10*s,o+11*n),t.lineTo(i+6*s,o+11*n),t.moveTo(i+7*s,o+14*n),t.lineTo(i+9*s,o+14*n),t.lineTo(i+8*s,o+15*n),t.lineTo(i+7*s,o+15*n)}function c(t,e){var i=e.x,o=e.y,s=e.width,n=e.height,r=s/16,a=n/16,h=2*Math.min(r,a);t.moveTo(i+r+h,o+a+h),t.arc(i+r,o+a,h,Math.PI/4,3*Math.PI),t.lineTo(i+7*r-h,o+6*a-h),t.arc(i+7*r,o+6*a,h,Math.PI/4*5,4*Math.PI),t.arc(i+7*r,o+6*a,h/2,Math.PI/4*5,4*Math.PI),t.moveTo(i+7*r-h/2,o+6*a+h),t.lineTo(i+r+h,o+14*a-h),t.arc(i+r,o+14*a,h,-Math.PI/4,2*Math.PI),t.moveTo(i+7*r+h/2,o+6*a),t.lineTo(i+14*r-h,o+10*a-h/2),t.moveTo(i+16*r,o+10*a),t.arc(i+14*r,o+10*a,h,0,3*Math.PI),t.lineWidth=1.5}function p(t,e){var i=e.x,o=e.y,s=e.width,n=e.height,r=Math.min(s,n)/2;t.moveTo(i+s,o+n/2),t.arc(i+r,o+r,r,0,2*Math.PI),t.arc(i+r,o,r,Math.PI/4,Math.PI/5*4),t.arc(i,o+r,r,-Math.PI/3,Math.PI/3),t.arc(i+s,o+n,r,Math.PI,Math.PI/2*3),t.lineWidth=1.5}function u(t,e){for(var i=e.x,o=e.y,s=e.width,n=e.height,r=Math.round(n/3),a=Math.round((r-2)/2),h=3;h--;)t.rect(i,o+r*h+a,s,2)}function g(t,e){for(var i=e.x,o=e.y,s=e.width,n=e.height,r=Math.round(s/3),a=Math.round((r-2)/2),h=3;h--;)t.rect(i+r*h+a,o,2,n)}function f(t,e){var i=e.x,o=e.y,s=e.width/16;t.moveTo(i+s,o),t.lineTo(i+s,o+e.height),t.lineTo(i+15*s,o+e.height),t.lineTo(i+15*s,o),t.lineTo(i+s,o),t.moveTo(i+3*s,o+3*s),t.lineTo(i+13*s,o+3*s),t.moveTo(i+3*s,o+6*s),t.lineTo(i+13*s,o+6*s),t.moveTo(i+3*s,o+9*s),t.lineTo(i+13*s,o+9*s),t.moveTo(i+3*s,o+12*s),t.lineTo(i+9*s,o+12*s)}function m(t,e){var i=e.x,o=e.y,s=e.width/16,n=e.height/16;t.moveTo(i,o),t.lineTo(i,o+e.height),t.lineTo(i+e.width,o+e.height),t.lineTo(i+e.width,o),t.lineTo(i,o),t.moveTo(i+4*s,o),t.lineTo(i+4*s,o+8*n),t.lineTo(i+12*s,o+8*n),t.lineTo(i+12*s,o),t.moveTo(i+6*s,o+11*n),t.lineTo(i+6*s,o+13*n),t.lineTo(i+10*s,o+13*n),t.lineTo(i+10*s,o+11*n),t.lineTo(i+6*s,o+11*n)}function _(t,e){var i=e.x,o=e.y,s=e.width,n=e.height;t.moveTo(i,o+n/2),t.lineTo(i+s,o+n/2),t.moveTo(i+s/2,o),t.lineTo(i+s/2,o+n)}function y(t,e){var i=e.width/2,o=e.height/2,s=Math.min(i,o);t.moveTo(e.x+i+s,e.y+o),t.arc(e.x+i,e.y+o,s,0,2*Math.PI),t.closePath()}function x(t,e){t.rect(e.x,e.y,e.width,e.height),t.closePath()}function v(t,e){var i=e.width/2,o=e.height/2,s=e.x+i,n=e.y+o,r=Math.min(i,o);t.moveTo(s,n-r),t.lineTo(s+r,n+r),t.lineTo(s-r,n+r),t.lineTo(s,n-r),t.closePath()}function b(t,e){var i=e.width/2,o=e.height/2,s=e.x+i,n=e.y+o,r=Math.min(i,o);t.moveTo(s,n-r),t.lineTo(s+r,n),t.lineTo(s,n+r),t.lineTo(s-r,n),t.lineTo(s,n-r),t.closePath()}function S(t,e){var i=e.x,o=e.y,s=e.width/16;t.moveTo(i+8*s,o),t.lineTo(i+s,o+e.height),t.lineTo(i+8*s,o+e.height/4*3),t.lineTo(i+15*s,o+e.height),t.lineTo(i+8*s,o),t.closePath()}function T(e,i){var o=t("zrender/shape/Star"),s=i.width/2,n=i.height/2;o.prototype.buildPath(e,{x:i.x+s,y:i.y+n,r:Math.min(s,n),n:i.n||5})}function z(e,i){var o=t("zrender/shape/Heart");o.prototype.buildPath(e,{x:i.x+i.width/2,y:i.y+.2*i.height,a:i.width/2,b:.8*i.height})}function C(e,i){var o=t("zrender/shape/Droplet");o.prototype.buildPath(e,{x:i.x+.5*i.width,y:i.y+.5*i.height,a:.5*i.width,b:.8*i.height})}function w(t,e){var i=e.x,o=e.y-e.height/2*1.5,s=e.width/2,n=e.height/2,r=Math.min(s,n);t.arc(i+s,o+n,r,Math.PI/5*4,Math.PI/5),t.lineTo(i+s,o+n+1.5*r),t.closePath()}function L(e,i,o){var s=t("zrender/shape/Image");this._imageShape=this._imageShape||new s({style:{}});for(var n in i)this._imageShape.style[n]=i[n];this._imageShape.brush(e,!1,o)}function E(t){A.call(this,t)}var M=t("zrender/tool/util"),A=t("zrender/shape/Base");return E.prototype={type:"icon",iconLibrary:{mark:e,markUndo:i,markClear:o,dataZoom:s,dataZoomReset:n,restore:r,lineChart:a,barChart:h,pieChart:l,funnelChart:d,forceChart:c,chordChart:p,stackChart:u,tiledChart:g,dataView:f,saveAsImage:m,cross:_,circle:y,rectangle:x,triangle:v,diamond:b,arrow:S,star:T,heart:z,droplet:C,pin:w,image:L},brush:function(e,i,o){var s=i?this.highlightStyle:this.style;s=s||{};var n=s.iconType||this.style.iconType;if("image"===n){var r=t("zrender/shape/Image");r.prototype.brush.call(this,e,i,o)}else{var s=this.beforeBrush(e,i);switch(e.beginPath(),this.buildPath(e,s,o),s.brushType){case"both":e.fill();case"stroke":s.lineWidth>0&&e.stroke();break;default:e.fill()}this.drawText(e,s,this.style),this.afterBrush(e)}},buildPath:function(t,e,i){this.iconLibrary[e.iconType]?this.iconLibrary[e.iconType].call(this,t,e,i):(t.moveTo(e.x,e.y),t.lineTo(e.x+e.width,e.y),t.lineTo(e.x+e.width,e.y+e.height),t.lineTo(e.x,e.y+e.height),t.lineTo(e.x,e.y),t.closePath())},getRect:function(t){return t.__rect?t.__rect:(t.__rect={x:Math.round(t.x),y:Math.round(t.y-("pin"==t.iconType?t.height/2*1.5:0)),width:t.width,height:t.height*("pin"===t.iconType?1.25:1)},t.__rect)},isCover:function(t,e){var i=this.transformCoordToLocal(t,e);t=i[0],e=i[1];var o=this.style.__rect;o||(o=this.style.__rect=this.getRect(this.style));var s=o.height<8||o.width<8?4:0;return t>=o.x-s&&t<=o.x+o.width+s&&e>=o.y-s&&e<=o.y+o.height+s}},M.inherits(E,A),E}),i("echarts/util/shape/MarkLine",["require","zrender/shape/Base","./Icon","zrender/shape/Line","zrender/shape/BezierCurve","zrender/tool/area","zrender/shape/util/dashedLineTo","zrender/tool/util","zrender/tool/curve"],function(t){function e(t){i.call(this,t),this.style.curveness>0&&this.updatePoints(this.style),this.highlightStyle.curveness>0&&this.updatePoints(this.highlightStyle)}var i=t("zrender/shape/Base"),o=t("./Icon"),s=t("zrender/shape/Line"),n=new s({}),r=t("zrender/shape/BezierCurve"),a=new r({}),h=t("zrender/tool/area"),l=t("zrender/shape/util/dashedLineTo"),d=t("zrender/tool/util"),c=t("zrender/tool/curve");return e.prototype={type:"mark-line",brush:function(t,e){var i=this.style;e&&(i=this.getHighlightStyle(i,this.highlightStyle||{})),t.save(),this.setContext(t,i),this.setTransform(t),t.save(),t.beginPath(),this.buildPath(t,i),t.stroke(),t.restore(),this.brushSymbol(t,i,0),this.brushSymbol(t,i,1),this.drawText(t,i,this.style),t.restore()},buildPath:function(t,e){var i=e.lineType||"solid";if(t.moveTo(e.xStart,e.yStart),e.curveness>0){var o=null;switch(i){case"dashed":o=[5,5];break;case"dotted":o=[1,1]}o&&t.setLineDash&&t.setLineDash(o),t.quadraticCurveTo(e.cpX1,e.cpY1,e.xEnd,e.yEnd)}else if("solid"==i)t.lineTo(e.xEnd,e.yEnd);else{var s=(e.lineWidth||1)*("dashed"==e.lineType?5:1);l(t,e.xStart,e.yStart,e.xEnd,e.yEnd,s)}},updatePoints:function(t){var e=t.curveness||0,i=1,o=t.xStart,s=t.yStart,n=t.xEnd,r=t.yEnd,a=(o+n)/2-i*(s-r)*e,h=(s+r)/2-i*(n-o)*e;t.cpX1=a,t.cpY1=h},brushSymbol:function(t,e,i){if("none"!=e.symbol[i]){t.save(),t.beginPath(),t.lineWidth=e.symbolBorder,t.strokeStyle=e.symbolBorderColor;var s=e.symbol[i].replace("empty","").toLowerCase();e.symbol[i].match("empty")&&(t.fillStyle="#fff");var n=e.xStart,r=e.yStart,a=e.xEnd,h=e.yEnd,l=0===i?n:a,d=0===i?r:h,p=e.curveness||0,u=null!=e.symbolRotate[i]?e.symbolRotate[i]-0:0;if(u=u/180*Math.PI,"arrow"==s&&0===u)if(0===p){var g=0===i?-1:1;u=Math.PI/2+Math.atan2(g*(h-r),g*(a-n))}else{var f=e.cpX1,m=e.cpY1,_=c.quadraticDerivativeAt,y=_(n,f,a,i),x=_(r,m,h,i);u=Math.PI/2+Math.atan2(x,y)}t.translate(l,d),0!==u&&t.rotate(u);var v=e.symbolSize[i];o.prototype.buildPath(t,{x:-v,y:-v,width:2*v,height:2*v,iconType:s}),t.closePath(),t.fill(),t.stroke(),t.restore()}},getRect:function(t){return t.curveness>0?a.getRect(t):n.getRect(t),t.__rect},isCover:function(t,e){var i=this.transformCoordToLocal(t,e);return t=i[0],e=i[1],this.isCoverRect(t,e)?this.style.curveness>0?h.isInside(a,this.style,t,e):h.isInside(n,this.style,t,e):!1}},d.inherits(e,i),e}),i("echarts/util/ecEffect",["require","../util/ecData","zrender/shape/Circle","zrender/shape/Image","zrender/tool/curve","../util/shape/Icon","../util/shape/Symbol","zrender/shape/ShapeBundle","zrender/shape/Polyline","zrender/tool/vector","zrender/tool/env"],function(t){function e(t,e,i,o){var s,r=i.effect,h=r.color||i.style.strokeColor||i.style.color,d=r.shadowColor||h,c=r.scaleSize,p=r.bounceDistance,u="undefined"!=typeof r.shadowBlur?r.shadowBlur:c;"image"!==i.type?(s=new l({zlevel:o,style:{brushType:"stroke",iconType:"droplet"!=i.style.iconType?i.style.iconType:"circle",x:u+1,y:u+1,n:i.style.n,width:i.style._width*c,height:i.style._height*c,lineWidth:1,strokeColor:h,shadowColor:d,shadowBlur:u},draggable:!1,hoverable:!1}),"pin"==i.style.iconType&&(s.style.y+=s.style.height/2*1.5),g&&(s.style.image=t.shapeToImage(s,s.style.width+2*u+2,s.style.height+2*u+2).style.image,s=new a({zlevel:s.zlevel,style:s.style,draggable:!1,hoverable:!1}))):s=new a({zlevel:o,style:i.style,draggable:!1,hoverable:!1}),n.clone(i,s),s.position=i.position,e.push(s),t.addShape(s);var f="image"!==i.type?window.devicePixelRatio||1:1,m=(s.style.width/f-i.style._width)/2;s.style.x=i.style._x-m,s.style.y=i.style._y-m,"pin"==i.style.iconType&&(s.style.y-=i.style.height/2*1.5);var _=100*(r.period+10*Math.random());t.modShape(i.id,{invisible:!0});var y=s.style.x+s.style.width/2/f,x=s.style.y+s.style.height/2/f;"scale"===r.type?(t.modShape(s.id,{scale:[.1,.1,y,x]}),t.animate(s.id,"",r.loop).when(_,{scale:[1,1,y,x]}).done(function(){i.effect.show=!1,t.delShape(s.id)}).start()):t.animate(s.id,"style",r.loop).when(_,{y:s.style.y-p}).when(2*_,{y:s.style.y}).done(function(){i.effect.show=!1,t.delShape(s.id)}).start()}function i(t,e,i,o){var s=i.effect,n=s.color||i.style.strokeColor||i.style.color,r=s.scaleSize,a=s.shadowColor||n,h="undefined"!=typeof s.shadowBlur?s.shadowBlur:2*r,l=window.devicePixelRatio||1,c=new d({zlevel:o,position:i.position,scale:i.scale,style:{pointList:i.style.pointList,iconType:i.style.iconType,color:n,strokeColor:n,shadowColor:a,shadowBlur:h*l,random:!0,brushType:"fill",lineWidth:1,size:i.style.size},draggable:!1,hoverable:!1});e.push(c),t.addShape(c),t.modShape(i.id,{invisible:!0});for(var p=Math.round(100*s.period),u={},g={},f=0;20>f;f++)c.style["randomMap"+f]=0,u={},u["randomMap"+f]=100,g={},g["randomMap"+f]=0,c.style["randomMap"+f]=100*Math.random(),t.animate(c.id,"style",!0).when(p,u).when(2*p,g).when(3*p,u).when(4*p,u).delay(Math.random()*p*f).start()}function o(t,e,i,o,s){var a=i.effect,l=i.style,d=a.color||l.strokeColor||l.color,c=a.shadowColor||l.strokeColor||d,f=l.lineWidth*a.scaleSize,m="undefined"!=typeof a.shadowBlur?a.shadowBlur:f,_=new r({zlevel:o,style:{x:m,y:m,r:f,color:d,shadowColor:c,shadowBlur:m},hoverable:!1}),y=0;if(g&&!s){var o=_.zlevel;_=t.shapeToImage(_,2*(f+m),2*(f+m)),_.zlevel=o,_.hoverable=!1,y=m}s||(n.clone(i,_),_.position=i.position,e.push(_),t.addShape(_));var x=function(){s||(i.effect.show=!1,t.delShape(_.id)),_.effectAnimator=null};if(i instanceof p){for(var v=[0],b=0,S=l.pointList,T=l.controlPointList,z=1;z<S.length;z++){if(T){var C=T[2*(z-1)],w=T[2*(z-1)+1];b+=u.dist(S[z-1],C)+u.dist(C,w)+u.dist(w,S[z])}else b+=u.dist(S[z-1],S[z]);v.push(b)}for(var L={p:0},E=t.animation.animate(L,{loop:a.loop}),z=0;z<v.length;z++)E.when(v[z]*a.period,{p:z});E.during(function(){var e,i,o=Math.floor(L.p);if(o==S.length-1)e=S[o][0],i=S[o][1];else{var n=L.p-o,r=S[o],a=S[o+1];if(T){var l=T[2*o],d=T[2*o+1];e=h.cubicAt(r[0],l[0],d[0],a[0],n),i=h.cubicAt(r[1],l[1],d[1],a[1],n)}else e=(a[0]-r[0])*n+r[0],i=(a[1]-r[1])*n+r[1]}_.style.x=e,_.style.y=i,s||t.modShape(_)}).done(x).start(),E.duration=b*a.period,_.effectAnimator=E}else{var M=l.xStart-y,A=l.yStart-y,k=l.xEnd-y,O=l.yEnd-y;_.style.x=M,_.style.y=A;var I=(k-M)*(k-M)+(O-A)*(O-A),R=Math.round(Math.sqrt(Math.round(I*a.period*a.period)));if(i.style.curveness>0){var P=l.cpX1-y,D=l.cpY1-y;_.effectAnimator=t.animation.animate(_,{loop:a.loop}).when(R,{p:1}).during(function(e,i){_.style.x=h.quadraticAt(M,P,k,i),_.style.y=h.quadraticAt(A,D,O,i),s||t.modShape(_)}).done(x).start()}else _.effectAnimator=t.animation.animate(_.style,{loop:a.loop}).when(R,{x:k,y:O}).during(function(){s||t.modShape(_)}).done(x).start();_.effectAnimator.duration=R}return _}function s(t,e,i,s){var n=new c({style:{shapeList:[]},zlevel:s,hoverable:!1}),r=i.style.shapeList,a=i.effect;n.position=i.position;for(var h=0,l=[],d=0;d<r.length;d++){r[d].effect=a;var p=o(t,null,r[d],s,!0),u=p.effectAnimator;n.style.shapeList.push(p),u.duration>h&&(h=u.duration),0===d&&(n.style.color=p.style.color,n.style.shadowBlur=p.style.shadowBlur,n.style.shadowColor=p.style.shadowColor),l.push(u)}e.push(n),t.addShape(n);var g=function(){for(var t=0;t<l.length;t++)l[t].stop()};if(h){n.__dummy=0;var f=t.animate(n.id,"",a.loop).when(h,{__dummy:1}).during(function(){t.modShape(n)}).done(function(){i.effect.show=!1,t.delShape(n.id)}).start(),m=f.stop;f.stop=function(){g(),m.call(this)}}}var n=t("../util/ecData"),r=t("zrender/shape/Circle"),a=t("zrender/shape/Image"),h=t("zrender/tool/curve"),l=t("../util/shape/Icon"),d=t("../util/shape/Symbol"),c=t("zrender/shape/ShapeBundle"),p=t("zrender/shape/Polyline"),u=t("zrender/tool/vector"),g=t("zrender/tool/env").canvasSupported;return{point:e,largePoint:i,line:o,largeLine:s}}),i("echarts/util/accMath",[],function(){function t(t,e){var i=t.toString(),o=e.toString(),s=0;try{s=o.split(".")[1].length}catch(n){}try{s-=i.split(".")[1].length}catch(n){}return(i.replace(".","")-0)/(o.replace(".","")-0)*Math.pow(10,s)}function e(t,e){var i=t.toString(),o=e.toString(),s=0;try{s+=i.split(".")[1].length}catch(n){}try{s+=o.split(".")[1].length}catch(n){}return(i.replace(".","")-0)*(o.replace(".","")-0)/Math.pow(10,s)}function i(t,e){var i=0,o=0;try{i=t.toString().split(".")[1].length}catch(s){}try{o=e.toString().split(".")[1].length}catch(s){}var n=Math.pow(10,Math.max(i,o));return(Math.round(t*n)+Math.round(e*n))/n}function o(t,e){return i(t,-e)}return{accDiv:t,accMul:e,accAdd:i,accSub:o}}),i("echarts/chart/line",["require","./base","zrender/shape/Polyline","../util/shape/Icon","../util/shape/HalfSmoothPolygon","../component/axis","../component/grid","../component/dataZoom","../config","../util/ecData","zrender/tool/util","zrender/tool/color","../chart"],function(t){function e(t,e,i,s,n){o.call(this,t,e,i,s,n),this.refresh(s)}function i(t,e,i){var o=e.x,s=e.y,r=e.width,a=e.height,h=a/2;e.symbol.match("empty")&&(t.fillStyle="#fff"),e.brushType="both";var l=e.symbol.replace("empty","").toLowerCase();l.match("star")?(h=l.replace("star","")-0||5,s-=1,l="star"):("rectangle"===l||"arrow"===l)&&(o+=(r-a)/2,r=a);var d="";if(l.match("image")&&(d=l.replace(new RegExp("^image:\\/\\/"),""),l="image",o+=Math.round((r-a)/2)-1,r=a+=2),l=n.prototype.iconLibrary[l]){var c=e.x,p=e.y;t.moveTo(c,p+h),t.lineTo(c+5,p+h),t.moveTo(c+e.width-5,p+h),t.lineTo(c+e.width,p+h);var u=this;l(t,{x:o+4,y:s+4,width:r-8,height:a-8,n:h,image:d},function(){u.modSelf(),i()})}else t.moveTo(o,s+h),t.lineTo(o+r,s+h)}var o=t("./base"),s=t("zrender/shape/Polyline"),n=t("../util/shape/Icon"),r=t("../util/shape/HalfSmoothPolygon");t("../component/axis"),t("../component/grid"),t("../component/dataZoom");var a=t("../config");a.line={zlevel:0,z:2,clickable:!0,legendHoverLink:!0,xAxisIndex:0,yAxisIndex:0,dataFilter:"nearest",itemStyle:{normal:{label:{show:!1},lineStyle:{width:2,type:"solid",shadowColor:"rgba(0,0,0,0)",shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0}},emphasis:{label:{show:!1}}},symbolSize:2,showAllSymbol:!1};var h=t("../util/ecData"),l=t("zrender/tool/util"),d=t("zrender/tool/color");return e.prototype={type:a.CHART_TYPE_LINE,_buildShape:function(){this.finalPLMap={},this._buildPosition()},_buildHorizontal:function(t,e,i,o){for(var s,n,r,a,h,l,d,c,p,u=this.series,g=i[0][0],f=u[g],m=this.component.xAxis.getAxis(f.xAxisIndex||0),_={},y=0,x=e;x>y&&null!=m.getNameByIndex(y);y++){n=m.getCoordByIndex(y);for(var v=0,b=i.length;b>v;v++){s=this.component.yAxis.getAxis(u[i[v][0]].yAxisIndex||0),h=a=d=l=s.getCoord(0);for(var S=0,T=i[v].length;T>S;S++)g=i[v][S],f=u[g],c=f.data[y],p=this.getDataFromOption(c,"-"),_[g]=_[g]||[],o[g]=o[g]||{min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY,sum:0,counter:0,average:0},"-"!==p?(p>=0?(a-=S>0?s.getCoordSize(p):h-s.getCoord(p),r=a):0>p&&(l+=S>0?s.getCoordSize(p):s.getCoord(p)-d,r=l),_[g].push([n,r,y,m.getNameByIndex(y),n,h]),o[g].min>p&&(o[g].min=p,o[g].minY=r,o[g].minX=n),o[g].max<p&&(o[g].max=p,o[g].maxY=r,o[g].maxX=n),o[g].sum+=p,o[g].counter++):_[g].length>0&&(this.finalPLMap[g]=this.finalPLMap[g]||[],this.finalPLMap[g].push(_[g]),_[g]=[])}a=this.component.grid.getY();for(var z,v=0,b=i.length;b>v;v++)for(var S=0,T=i[v].length;T>S;S++)g=i[v][S],f=u[g],c=f.data[y],p=this.getDataFromOption(c,"-"),"-"==p&&this.deepQuery([c,f,this.option],"calculable")&&(z=this.deepQuery([c,f],"symbolSize"),a+=2*z+5,r=a,this.shapeList.push(this._getCalculableItem(g,y,m.getNameByIndex(y),n,r,"horizontal")))}for(var C in _)_[C].length>0&&(this.finalPLMap[C]=this.finalPLMap[C]||[],this.finalPLMap[C].push(_[C]),_[C]=[]);this._calculMarkMapXY(o,i,"y"),this._buildBorkenLine(t,this.finalPLMap,m,"horizontal")},_buildVertical:function(t,e,i,o){for(var s,n,r,a,h,l,d,c,p,u=this.series,g=i[0][0],f=u[g],m=this.component.yAxis.getAxis(f.yAxisIndex||0),_={},y=0,x=e;x>y&&null!=m.getNameByIndex(y);y++){r=m.getCoordByIndex(y);for(var v=0,b=i.length;b>v;v++){s=this.component.xAxis.getAxis(u[i[v][0]].xAxisIndex||0),h=a=d=l=s.getCoord(0);for(var S=0,T=i[v].length;T>S;S++)g=i[v][S],f=u[g],c=f.data[y],p=this.getDataFromOption(c,"-"),_[g]=_[g]||[],o[g]=o[g]||{min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY,sum:0,counter:0,average:0},"-"!==p?(p>=0?(a+=S>0?s.getCoordSize(p):s.getCoord(p)-h,n=a):0>p&&(l-=S>0?s.getCoordSize(p):d-s.getCoord(p),n=l),_[g].push([n,r,y,m.getNameByIndex(y),h,r]),o[g].min>p&&(o[g].min=p,o[g].minX=n,o[g].minY=r),o[g].max<p&&(o[g].max=p,o[g].maxX=n,o[g].maxY=r),o[g].sum+=p,o[g].counter++):_[g].length>0&&(this.finalPLMap[g]=this.finalPLMap[g]||[],this.finalPLMap[g].push(_[g]),_[g]=[])}a=this.component.grid.getXend();for(var z,v=0,b=i.length;b>v;v++)for(var S=0,T=i[v].length;T>S;S++)g=i[v][S],f=u[g],c=f.data[y],p=this.getDataFromOption(c,"-"),"-"==p&&this.deepQuery([c,f,this.option],"calculable")&&(z=this.deepQuery([c,f],"symbolSize"),a-=2*z+5,n=a,this.shapeList.push(this._getCalculableItem(g,y,m.getNameByIndex(y),n,r,"vertical")))}for(var C in _)_[C].length>0&&(this.finalPLMap[C]=this.finalPLMap[C]||[],this.finalPLMap[C].push(_[C]),_[C]=[]);this._calculMarkMapXY(o,i,"x"),this._buildBorkenLine(t,this.finalPLMap,m,"vertical")},_buildOther:function(t,e,i,o){for(var s,n=this.series,r={},a=0,h=i.length;h>a;a++)for(var l=0,d=i[a].length;d>l;l++){var c=i[a][l],p=n[c];s=this.component.xAxis.getAxis(p.xAxisIndex||0);var u=this.component.yAxis.getAxis(p.yAxisIndex||0),g=u.getCoord(0);r[c]=r[c]||[],o[c]=o[c]||{min0:Number.POSITIVE_INFINITY,min1:Number.POSITIVE_INFINITY,max0:Number.NEGATIVE_INFINITY,max1:Number.NEGATIVE_INFINITY,sum0:0,sum1:0,counter0:0,counter1:0,average0:0,average1:0};for(var f=0,m=p.data.length;m>f;f++){var _=p.data[f],y=this.getDataFromOption(_,"-");if(y instanceof Array){var x=s.getCoord(y[0]),v=u.getCoord(y[1]);r[c].push([x,v,f,y[0],x,g]),o[c].min0>y[0]&&(o[c].min0=y[0],o[c].minY0=v,o[c].minX0=x),o[c].max0<y[0]&&(o[c].max0=y[0],o[c].maxY0=v,o[c].maxX0=x),o[c].sum0+=y[0],o[c].counter0++,o[c].min1>y[1]&&(o[c].min1=y[1],o[c].minY1=v,o[c].minX1=x),o[c].max1<y[1]&&(o[c].max1=y[1],o[c].maxY1=v,o[c].maxX1=x),o[c].sum1+=y[1],o[c].counter1++}}}for(var b in r)r[b].length>0&&(this.finalPLMap[b]=this.finalPLMap[b]||[],this.finalPLMap[b].push(r[b]),r[b]=[]);this._calculMarkMapXY(o,i,"xy"),this._buildBorkenLine(t,this.finalPLMap,s,"other")},_buildBorkenLine:function(t,e,i,o){for(var n,a="other"==o?"horizontal":o,c=this.series,p=t.length-1;p>=0;p--){var u=t[p],g=c[u],f=e[u];if(g.type===this.type&&null!=f)for(var m=this._getBbox(u,a),_=this._sIndex2ColorMap[u],y=this.query(g,"itemStyle.normal.lineStyle.width"),x=this.query(g,"itemStyle.normal.lineStyle.type"),v=this.query(g,"itemStyle.normal.lineStyle.color"),b=this.getItemStyleColor(this.query(g,"itemStyle.normal.color"),u,-1),S=null!=this.query(g,"itemStyle.normal.areaStyle"),T=this.query(g,"itemStyle.normal.areaStyle.color"),z=0,C=f.length;C>z;z++){var w=f[z],L="other"!=o&&this._isLarge(a,w);if(L)w=this._getLargePointList(a,w,g.dataFilter);else for(var E=0,M=w.length;M>E;E++)n=g.data[w[E][2]],(this.deepQuery([n,g,this.option],"calculable")||this.deepQuery([n,g],"showAllSymbol")||"categoryAxis"===i.type&&i.isMainAxis(w[E][2])&&"none"!=this.deepQuery([n,g],"symbol"))&&this.shapeList.push(this._getSymbol(u,w[E][2],w[E][3],w[E][0],w[E][1],a));var A=new s({zlevel:this.getZlevelBase(),z:this.getZBase(),style:{miterLimit:y,pointList:w,strokeColor:v||b||_,lineWidth:y,lineType:x,smooth:this._getSmooth(g.smooth),smoothConstraint:m,shadowColor:this.query(g,"itemStyle.normal.lineStyle.shadowColor"),shadowBlur:this.query(g,"itemStyle.normal.lineStyle.shadowBlur"),shadowOffsetX:this.query(g,"itemStyle.normal.lineStyle.shadowOffsetX"),shadowOffsetY:this.query(g,"itemStyle.normal.lineStyle.shadowOffsetY")},hoverable:!1,_main:!0,_seriesIndex:u,_orient:a});if(h.pack(A,c[u],u,0,z,c[u].name),this.shapeList.push(A),S){var k=new r({zlevel:this.getZlevelBase(),z:this.getZBase(),style:{miterLimit:y,pointList:l.clone(w).concat([[w[w.length-1][4],w[w.length-1][5]],[w[0][4],w[0][5]]]),brushType:"fill",smooth:this._getSmooth(g.smooth),smoothConstraint:m,color:T?T:d.alpha(_,.5)},highlightStyle:{brushType:"fill"},hoverable:!1,_main:!0,_seriesIndex:u,_orient:a});h.pack(k,c[u],u,0,z,c[u].name),this.shapeList.push(k)}}}},_getBbox:function(t,e){var i=this.component.grid.getBbox(),o=this.xMarkMap[t];return null!=o.minX0?[[Math.min(o.minX0,o.maxX0,o.minX1,o.maxX1),Math.min(o.minY0,o.maxY0,o.minY1,o.maxY1)],[Math.max(o.minX0,o.maxX0,o.minX1,o.maxX1),Math.max(o.minY0,o.maxY0,o.minY1,o.maxY1)]]:("horizontal"===e?(i[0][1]=Math.min(o.minY,o.maxY),i[1][1]=Math.max(o.minY,o.maxY)):(i[0][0]=Math.min(o.minX,o.maxX),i[1][0]=Math.max(o.minX,o.maxX)),i)},_isLarge:function(t,e){return e.length<2?!1:"horizontal"===t?Math.abs(e[0][0]-e[1][0])<.5:Math.abs(e[0][1]-e[1][1])<.5},_getLargePointList:function(t,e,i){var o;o="horizontal"===t?this.component.grid.getWidth():this.component.grid.getHeight();var s=e.length,n=[];if("function"!=typeof i)switch(i){case"min":i=function(t){return Math.max.apply(null,t)};break;case"max":i=function(t){return Math.min.apply(null,t)};break;case"average":i=function(t){for(var e=0,i=0;i<t.length;i++)e+=t[i];return e/t.length};break;default:i=function(t){return t[0]}}for(var r=[],a=0;o>a;a++){var h=Math.floor(s/o*a),l=Math.min(Math.floor(s/o*(a+1)),s);if(!(h>=l)){for(var d=h;l>d;d++)r[d-h]="horizontal"===t?e[d][1]:e[d][0];r.length=l-h;for(var c=i(r),p=-1,u=1/0,d=h;l>d;d++){var g="horizontal"===t?e[d][1]:e[d][0],f=Math.abs(g-c);u>f&&(p=d,u=f)}var m=e[p].slice();"horizontal"===t?m[1]=c:m[0]=c,n.push(m)}}return n},_getSmooth:function(t){return t?.3:0},_getCalculableItem:function(t,e,i,o,s,n){var r=this.series,h=r[t].calculableHolderColor||this.ecTheme.calculableHolderColor||a.calculableHolderColor,l=this._getSymbol(t,e,i,o,s,n);return l.style.color=h,l.style.strokeColor=h,l.rotation=[0,0],l.hoverable=!1,l.draggable=!1,l.style.text=void 0,l},_getSymbol:function(t,e,i,o,s,n){var r=this.series,a=r[t],h=a.data[e],l=this.getSymbolShape(a,t,h,e,i,o,s,this._sIndex2ShapeMap[t],this._sIndex2ColorMap[t],"#fff","vertical"===n?"horizontal":"vertical");return l.zlevel=this.getZlevelBase(),l.z=this.getZBase()+1,this.deepQuery([h,a,this.option],"calculable")&&(this.setCalculable(l),l.draggable=!0),l},getMarkCoord:function(t,e){var i=this.series[t],o=this.xMarkMap[t],s=this.component.xAxis.getAxis(i.xAxisIndex),n=this.component.yAxis.getAxis(i.yAxisIndex);if(e.type&&("max"===e.type||"min"===e.type||"average"===e.type)){var r=null!=e.valueIndex?e.valueIndex:null!=o.maxX0?"1":"";return[o[e.type+"X"+r],o[e.type+"Y"+r],o[e.type+"Line"+r],o[e.type+r]]}return["string"!=typeof e.xAxis&&s.getCoordByIndex?s.getCoordByIndex(e.xAxis||0):s.getCoord(e.xAxis||0),"string"!=typeof e.yAxis&&n.getCoordByIndex?n.getCoordByIndex(e.yAxis||0):n.getCoord(e.yAxis||0)]},refresh:function(t){t&&(this.option=t,this.series=t.series),this.backupShapeList(),this._buildShape()},ontooltipHover:function(t,e){for(var i,o,s=t.seriesIndex,n=t.dataIndex,r=s.length;r--;)if(i=this.finalPLMap[s[r]])for(var a=0,h=i.length;h>a;a++){o=i[a];for(var l=0,d=o.length;d>l;l++)n===o[l][2]&&e.push(this._getSymbol(s[r],o[l][2],o[l][3],o[l][0],o[l][1],"horizontal"))}},addDataAnimation:function(t,e){function i(){f--,0===f&&e&&e()}function o(t){t.style.controlPointList=null}for(var s=this.series,n={},r=0,a=t.length;a>r;r++)n[t[r][0]]=t[r];for(var h,l,d,c,p,u,g,f=0,r=this.shapeList.length-1;r>=0;r--)if(p=this.shapeList[r]._seriesIndex,n[p]&&!n[p][3]){if(this.shapeList[r]._main&&this.shapeList[r].style.pointList.length>1){if(u=this.shapeList[r].style.pointList,l=Math.abs(u[0][0]-u[1][0]),c=Math.abs(u[0][1]-u[1][1]),g="horizontal"===this.shapeList[r]._orient,n[p][2]){if("half-smooth-polygon"===this.shapeList[r].type){var m=u.length;
this.shapeList[r].style.pointList[m-3]=u[m-2],this.shapeList[r].style.pointList[m-3][g?0:1]=u[m-4][g?0:1],this.shapeList[r].style.pointList[m-2]=u[m-1]}this.shapeList[r].style.pointList.pop(),g?(h=l,d=0):(h=0,d=-c)}else{if(this.shapeList[r].style.pointList.shift(),"half-smooth-polygon"===this.shapeList[r].type){var _=this.shapeList[r].style.pointList.pop();g?_[0]=u[0][0]:_[1]=u[0][1],this.shapeList[r].style.pointList.push(_)}g?(h=-l,d=0):(h=0,d=c)}this.shapeList[r].style.controlPointList=null,this.zr.modShape(this.shapeList[r])}else{if(n[p][2]&&this.shapeList[r]._dataIndex===s[p].data.length-1){this.zr.delShape(this.shapeList[r].id);continue}if(!n[p][2]&&0===this.shapeList[r]._dataIndex){this.zr.delShape(this.shapeList[r].id);continue}}this.shapeList[r].position=[0,0],f++,this.zr.animate(this.shapeList[r].id,"").when(this.query(this.option,"animationDurationUpdate"),{position:[h,d]}).during(o).done(i).start()}f||i()}},n.prototype.iconLibrary.legendLineIcon=i,l.inherits(e,o),t("../chart").define("line",e),e}),i("echarts/util/ecAnimation",["require","zrender/tool/util","zrender/tool/curve","zrender/shape/Polygon"],function(t){function e(t,e,i,o,s){var n,r=i.style.pointList,a=r.length;if(!e){if(n=[],"vertical"!=i._orient)for(var h=r[0][1],l=0;a>l;l++)n[l]=[r[l][0],h];else for(var d=r[0][0],l=0;a>l;l++)n[l]=[d,r[l][1]];"half-smooth-polygon"==i.type&&(n[a-1]=g.clone(r[a-1]),n[a-2]=g.clone(r[a-2])),e={style:{pointList:n}}}n=e.style.pointList;var c=n.length;i.style.pointList=c==a?n:a>c?n.concat(r.slice(c)):n.slice(0,a),t.addShape(i),i.__animating=!0,t.animate(i.id,"style").when(o,{pointList:r}).during(function(){i.updateControlPoints&&i.updateControlPoints(i.style)}).done(function(){i.__animating=!1}).start(s)}function i(t,e){for(var i=arguments.length,o=2;i>o;o++){var s=arguments[o];t.style[s]=e.style[s]}}function o(t,e,o,s,n){var r=o.style;e||(e={position:o.position,style:{x:r.x,y:"vertical"==o._orient?r.y+r.height:r.y,width:"vertical"==o._orient?r.width:0,height:"vertical"!=o._orient?r.height:0}});var a=r.x,h=r.y,l=r.width,d=r.height,c=[o.position[0],o.position[1]];i(o,e,"x","y","width","height"),o.position=e.position,t.addShape(o),(c[0]!=e.position[0]||c[1]!=e.position[1])&&t.animate(o.id,"").when(s,{position:c}).start(n),o.__animating=!0,t.animate(o.id,"style").when(s,{x:a,y:h,width:l,height:d}).done(function(){o.__animating=!1}).start(n)}function s(t,e,i,o,s){if(!e){var n=i.style.y;e={style:{y:[n[0],n[0],n[0],n[0]]}}}var r=i.style.y;i.style.y=e.style.y,t.addShape(i),i.__animating=!0,t.animate(i.id,"style").when(o,{y:r}).done(function(){i.__animating=!1}).start(s)}function n(t,e,i,o,s){var n=i.style.x,r=i.style.y,a=i.style.r0,h=i.style.r;i.__animating=!0,"r"!=i._animationAdd?(i.style.r0=0,i.style.r=0,i.rotation=[2*Math.PI,n,r],t.addShape(i),t.animate(i.id,"style").when(o,{r0:a,r:h}).done(function(){i.__animating=!1}).start(s),t.animate(i.id,"").when(o,{rotation:[0,n,r]}).start(s)):(i.style.r0=i.style.r,t.addShape(i),t.animate(i.id,"style").when(o,{r0:a}).done(function(){i.__animating=!1}).start(s))}function r(t,e,o,s,n){e||(e="r"!=o._animationAdd?{style:{startAngle:o.style.startAngle,endAngle:o.style.startAngle}}:{style:{r0:o.style.r}});var r=o.style.startAngle,a=o.style.endAngle;i(o,e,"startAngle","endAngle"),t.addShape(o),o.__animating=!0,t.animate(o.id,"style").when(s,{startAngle:r,endAngle:a}).done(function(){o.__animating=!1}).start(n)}function a(t,e,o,s,n){e||(e={style:{x:"left"==o.style.textAlign?o.style.x+100:o.style.x-100,y:o.style.y}});var r=o.style.x,a=o.style.y;i(o,e,"x","y"),t.addShape(o),o.__animating=!0,t.animate(o.id,"style").when(s,{x:r,y:a}).done(function(){o.__animating=!1}).start(n)}function h(e,i,o,s,n){var r=t("zrender/shape/Polygon").prototype.getRect(o.style),a=r.x+r.width/2,h=r.y+r.height/2;o.scale=[.1,.1,a,h],e.addShape(o),o.__animating=!0,e.animate(o.id,"").when(s,{scale:[1,1,a,h]}).done(function(){o.__animating=!1}).start(n)}function l(t,e,o,s,n){e||(e={style:{source0:0,source1:o.style.source1>0?360:-360,target0:0,target1:o.style.target1>0?360:-360}});var r=o.style.source0,a=o.style.source1,h=o.style.target0,l=o.style.target1;e.style&&i(o,e,"source0","source1","target0","target1"),t.addShape(o),o.__animating=!0,t.animate(o.id,"style").when(s,{source0:r,source1:a,target0:h,target1:l}).done(function(){o.__animating=!1}).start(n)}function d(t,e,i,o,s){e||(e={style:{angle:i.style.startAngle}});var n=i.style.angle;i.style.angle=e.style.angle,t.addShape(i),i.__animating=!0,t.animate(i.id,"style").when(o,{angle:n}).done(function(){i.__animating=!1}).start(s)}function c(t,e,i,s,n,r){if(i.style._x=i.style.x,i.style._y=i.style.y,i.style._width=i.style.width,i.style._height=i.style.height,e)o(t,e,i,s,n);else{var a=i._x||0,h=i._y||0;i.scale=[.01,.01,a,h],t.addShape(i),i.__animating=!0,t.animate(i.id,"").delay(r).when(s,{scale:[1,1,a,h]}).done(function(){i.__animating=!1}).start(n||"QuinticOut")}}function p(t,e,o,s,n){e||(e={style:{xStart:o.style.xStart,yStart:o.style.yStart,xEnd:o.style.xStart,yEnd:o.style.yStart}});var r=o.style.xStart,a=o.style.xEnd,h=o.style.yStart,l=o.style.yEnd;i(o,e,"xStart","xEnd","yStart","yEnd"),t.addShape(o),o.__animating=!0,t.animate(o.id,"style").when(s,{xStart:r,xEnd:a,yStart:h,yEnd:l}).done(function(){o.__animating=!1}).start(n)}function u(t,e,i,o,s){s=s||"QuinticOut",i.__animating=!0,t.addShape(i);var n=i.style,r=function(){i.__animating=!1},a=n.xStart,h=n.yStart,l=n.xEnd,d=n.yEnd;if(n.curveness>0){i.updatePoints(n);var c={p:0},p=n.cpX1,u=n.cpY1,g=[],m=[],_=f.quadraticSubdivide;t.animation.animate(c).when(o,{p:1}).during(function(){_(a,p,l,c.p,g),_(h,u,d,c.p,m),n.cpX1=g[1],n.cpY1=m[1],n.xEnd=g[2],n.yEnd=m[2],t.modShape(i)}).done(r).start(s)}else t.animate(i.id,"style").when(0,{xEnd:a,yEnd:h}).when(o,{xEnd:l,yEnd:d}).done(r).start(s)}var g=t("zrender/tool/util"),f=t("zrender/tool/curve");return{pointList:e,rectangle:o,candle:s,ring:n,sector:r,text:a,polygon:h,ribbon:l,gaugePointer:d,icon:c,line:p,markline:u}}),i("echarts/layout/EdgeBundling",["require","../data/KDTree","zrender/tool/vector"],function(t){function e(t,e){t=t.array,e=e.array;var i=e[0]-t[0],o=e[1]-t[1],s=e[2]-t[2],n=e[3]-t[3];return i*i+o*o+s*s+n*n}function i(t){this.points=[t.mp0,t.mp1],this.group=t}function o(t){var e=t.points;e[0][1]<e[1][1]||t instanceof i?(this.array=[e[0][0],e[0][1],e[1][0],e[1][1]],this._startPoint=e[0],this._endPoint=e[1]):(this.array=[e[1][0],e[1][1],e[0][0],e[0][1]],this._startPoint=e[1],this._endPoint=e[0]),this.ink=d(e[0],e[1]),this.edge=t,this.group=null}function s(){this.edgeList=[],this.mp0=h(),this.mp1=h(),this.ink=0}function n(){this.maxNearestEdge=6,this.maxTurningAngle=Math.PI/4,this.maxIteration=20}var r=t("../data/KDTree"),a=t("zrender/tool/vector"),h=a.create,l=a.distSquare,d=a.dist,c=a.copy,p=a.clone;return o.prototype.getStartPoint=function(){return this._startPoint},o.prototype.getEndPoint=function(){return this._endPoint},s.prototype.addEdge=function(t){t.group=this,this.edgeList.push(t)},s.prototype.removeEdge=function(t){t.group=null,this.edgeList.splice(this.edgeList.indexOf(t),1)},n.prototype={constructor:n,run:function(t){function e(t,e){return l(t,e)<1e-10}function o(t,i){for(var o=[],s=0,n=0;n<t.length;n++)s>0&&e(t[n],o[s-1])||(o[s++]=p(t[n]));return i[0]&&!e(o[0],i[0])&&(o=o.reverse()),o}for(var s=this._iterate(t),n=0;n++<this.maxIteration;){for(var r=[],a=0;a<s.groups.length;a++)r.push(new i(s.groups[a]));var h=this._iterate(r);if(h.savedInk<=0)break;s=h}var d=[],c=function(t,e){for(var s,n=0;n<t.length;n++){var r=t[n];if(r.edgeList[0]&&r.edgeList[0].edge instanceof i){for(var a=[],h=0;h<r.edgeList.length;h++)a.push(r.edgeList[h].edge.group);s=e?e.slice():[],s.unshift(r.mp0),s.push(r.mp1),c(a,s)}else for(var h=0;h<r.edgeList.length;h++){var l=r.edgeList[h];s=e?e.slice():[],s.unshift(r.mp0),s.push(r.mp1),s.unshift(l.getStartPoint()),s.push(l.getEndPoint()),d.push({points:o(s,l.edge.points),rawEdge:l.edge})}}};return c(s.groups),d},_iterate:function(t){for(var i=[],n=[],a=0,l=0;l<t.length;l++){var d=new o(t[l]);i.push(d)}for(var p=new r(i,4),u=[],g=h(),f=h(),m=0,_=h(),y=h(),x=0,l=0;l<i.length;l++){var d=i[l];if(!d.group){p.nearestN(d,this.maxNearestEdge,e,u);for(var v=0,b=null,S=null,T=0;T<u.length;T++){var z=u[T],C=0;z.group?z.group!==S&&(S=z.group,m=this._calculateGroupEdgeInk(z.group,d,g,f),C=z.group.ink+d.ink-m):(m=this._calculateEdgeEdgeInk(d,z,g,f),C=z.ink+d.ink-m),C>v&&(v=C,b=z,c(y,f),c(_,g),x=m)}if(b){a+=v;var w;b.group||(w=new s,n.push(w),w.addEdge(b)),w=b.group,c(w.mp0,_),c(w.mp1,y),w.ink=x,b.group.addEdge(d)}else{var w=new s;n.push(w),c(w.mp0,d.getStartPoint()),c(w.mp1,d.getEndPoint()),w.ink=d.ink,w.addEdge(d)}}}return{groups:n,edges:i,savedInk:a}},_calculateEdgeEdgeInk:function(){var t=[],e=[];return function(i,o,s,n){t[0]=i.getStartPoint(),t[1]=o.getStartPoint(),e[0]=i.getEndPoint(),e[1]=o.getEndPoint(),this._calculateMeetPoints(t,e,s,n);var r=d(t[0],s)+d(s,n)+d(n,e[0])+d(t[1],s)+d(n,e[1]);return r}}(),_calculateGroupEdgeInk:function(t,e,i,o){for(var s=[],n=[],r=0;r<t.edgeList.length;r++){var a=t.edgeList[r];s.push(a.getStartPoint()),n.push(a.getEndPoint())}s.push(e.getStartPoint()),n.push(e.getEndPoint()),this._calculateMeetPoints(s,n,i,o);for(var h=d(i,o),r=0;r<s.length;r++)h+=d(s[r],i)+d(n[r],o);return h},_calculateMeetPoints:function(){var t=h(),e=h();return function(i,o,s,n){a.set(t,0,0),a.set(e,0,0);for(var r=i.length,h=0;r>h;h++)a.add(t,t,i[h]);a.scale(t,t,1/r),r=o.length;for(var h=0;r>h;h++)a.add(e,e,o[h]);a.scale(e,e,1/r),this._limitTurningAngle(i,t,e,s),this._limitTurningAngle(o,e,t,n)}}(),_limitTurningAngle:function(){var t=h(),e=h(),i=h(),o=h();return function(s,n,r,h){var c=Math.cos(this.maxTurningAngle),p=Math.tan(this.maxTurningAngle);a.sub(t,n,r),a.normalize(t,t),a.copy(h,n);for(var u=0,g=0;g<s.length;g++){var f=s[g];a.sub(e,f,n);var m=a.len(e);a.scale(e,e,1/m);var _=a.dot(e,t);if(c>_){a.scaleAndAdd(i,n,t,m*_);var y=d(i,f),x=y/p;a.scaleAndAdd(o,i,t,-x);var v=l(o,n);v>u&&(u=v,a.copy(h,o))}}}}()},n}),i("zrender/shape/Line",["require","./Base","./util/dashedLineTo","../tool/util"],function(t){var e=t("./Base"),i=t("./util/dashedLineTo"),o=function(t){this.brushTypeOnly="stroke",this.textPosition="end",e.call(this,t)};return o.prototype={type:"line",buildPath:function(t,e){if(e.lineType&&"solid"!=e.lineType){if("dashed"==e.lineType||"dotted"==e.lineType){var o=(e.lineWidth||1)*("dashed"==e.lineType?5:1);i(t,e.xStart,e.yStart,e.xEnd,e.yEnd,o)}}else t.moveTo(e.xStart,e.yStart),t.lineTo(e.xEnd,e.yEnd)},getRect:function(t){if(t.__rect)return t.__rect;var e=t.lineWidth||1;return t.__rect={x:Math.min(t.xStart,t.xEnd)-e,y:Math.min(t.yStart,t.yEnd)-e,width:Math.abs(t.xStart-t.xEnd)+e,height:Math.abs(t.yStart-t.yEnd)+e},t.__rect}},t("../tool/util").inherits(o,e),o}),i("echarts/util/shape/GaugePointer",["require","zrender/shape/Base","zrender/tool/util","./normalIsCover"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("zrender/tool/util");return e.prototype={type:"gauge-pointer",buildPath:function(t,e){var i=e.r,o=e.width,s=e.angle,n=e.x-Math.cos(s)*o*(o>=i/3?1:2),r=e.y+Math.sin(s)*o*(o>=i/3?1:2);s=e.angle-Math.PI/2,t.moveTo(n,r),t.lineTo(e.x+Math.cos(s)*o,e.y-Math.sin(s)*o),t.lineTo(e.x+Math.cos(e.angle)*i,e.y-Math.sin(e.angle)*i),t.lineTo(e.x-Math.cos(s)*o,e.y+Math.sin(s)*o),t.lineTo(n,r)},getRect:function(t){if(t.__rect)return t.__rect;var e=2*t.width,i=t.x,o=t.y,s=i+Math.cos(t.angle)*t.r,n=o-Math.sin(t.angle)*t.r;return t.__rect={x:Math.min(i,s)-e,y:Math.min(o,n)-e,width:Math.abs(i-s)+e,height:Math.abs(o-n)+e},t.__rect},isCover:t("./normalIsCover")},o.inherits(e,i),e}),i("echarts/component/base",["require","../config","../util/ecData","../util/ecQuery","../util/number","zrender/tool/util","zrender/tool/env"],function(t){function e(t,e,s,n,r){this.ecTheme=t,this.messageCenter=e,this.zr=s,this.option=n,this.series=n.series,this.myChart=r,this.component=r.component,this.shapeList=[],this.effectList=[];var a=this;a._onlegendhoverlink=function(t){if(a.legendHoverLink)for(var e,s=t.target,n=a.shapeList.length-1;n>=0;n--)e=a.type==i.CHART_TYPE_PIE||a.type==i.CHART_TYPE_FUNNEL?o.get(a.shapeList[n],"name"):(o.get(a.shapeList[n],"series")||{}).name,e!=s||a.shapeList[n].invisible||a.shapeList[n].__animating||a.zr.addHoverShape(a.shapeList[n])},e&&e.bind(i.EVENT.LEGEND_HOVERLINK,this._onlegendhoverlink)}var i=t("../config"),o=t("../util/ecData"),s=t("../util/ecQuery"),n=t("../util/number"),r=t("zrender/tool/util");return e.prototype={canvasSupported:t("zrender/tool/env").canvasSupported,_getZ:function(t){if(null!=this[t])return this[t];var e=this.ecTheme[this.type];return e&&null!=e[t]?e[t]:(e=i[this.type],e&&null!=e[t]?e[t]:0)},getZlevelBase:function(){return this._getZ("zlevel")},getZBase:function(){return this._getZ("z")},reformOption:function(t){return t=r.merge(r.merge(t||{},r.clone(this.ecTheme[this.type]||{})),r.clone(i[this.type]||{})),this.z=t.z,this.zlevel=t.zlevel,t},reformCssArray:function(t){if(!(t instanceof Array))return[t,t,t,t];switch(t.length+""){case"4":return t;case"3":return[t[0],t[1],t[2],t[1]];case"2":return[t[0],t[1],t[0],t[1]];case"1":return[t[0],t[0],t[0],t[0]];case"0":return[0,0,0,0]}},getShapeById:function(t){for(var e=0,i=this.shapeList.length;i>e;e++)if(this.shapeList[e].id===t)return this.shapeList[e];return null},getFont:function(t){var e=this.getTextStyle(r.clone(t));return e.fontStyle+" "+e.fontWeight+" "+e.fontSize+"px "+e.fontFamily},getTextStyle:function(t){return r.merge(r.merge(t||{},this.ecTheme.textStyle),i.textStyle)},getItemStyleColor:function(t,e,i,o){return"function"==typeof t?t.call(this.myChart,{seriesIndex:e,series:this.series[e],dataIndex:i,data:o}):t},getDataFromOption:function(t,e){return null!=t?null!=t.value?t.value:t:e},subPixelOptimize:function(t,e){return t=e%2===1?Math.floor(t)+.5:Math.round(t)},resize:function(){this.refresh&&this.refresh(),this.clearEffectShape&&this.clearEffectShape(!0);var t=this;setTimeout(function(){t.animationEffect&&t.animationEffect()},200)},clear:function(){this.clearEffectShape&&this.clearEffectShape(),this.zr&&this.zr.delShape(this.shapeList),this.shapeList=[]},dispose:function(){this.onbeforDispose&&this.onbeforDispose(),this.clear(),this.shapeList=null,this.effectList=null,this.messageCenter&&this.messageCenter.unbind(i.EVENT.LEGEND_HOVERLINK,this._onlegendhoverlink),this.onafterDispose&&this.onafterDispose()},query:s.query,deepQuery:s.deepQuery,deepMerge:s.deepMerge,parsePercent:n.parsePercent,parseCenter:n.parseCenter,parseRadius:n.parseRadius,numAddCommas:n.addCommas},e}),i("echarts/util/shape/HalfSmoothPolygon",["require","zrender/shape/Base","zrender/shape/util/smoothBezier","zrender/tool/util","zrender/shape/Polygon"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("zrender/shape/util/smoothBezier"),s=t("zrender/tool/util");return e.prototype={type:"half-smooth-polygon",buildPath:function(e,i){var s=i.pointList;if(!(s.length<2))if(i.smooth){var n=o(s.slice(0,-2),i.smooth,!1,i.smoothConstraint);e.moveTo(s[0][0],s[0][1]);for(var r,a,h,l=s.length,d=0;l-3>d;d++)r=n[2*d],a=n[2*d+1],h=s[d+1],e.bezierCurveTo(r[0],r[1],a[0],a[1],h[0],h[1]);e.lineTo(s[l-2][0],s[l-2][1]),e.lineTo(s[l-1][0],s[l-1][1]),e.lineTo(s[0][0],s[0][1])}else t("zrender/shape/Polygon").prototype.buildPath(e,i)}},s.inherits(e,i),e}),i("zrender/shape/Base",["require","../tool/matrix","../tool/guid","../tool/util","../tool/log","../mixin/Transformable","../mixin/Eventful","../tool/area","../tool/color"],function(t){function e(e,o,s,n,r,a,h){r&&(e.font=r),e.textAlign=a,e.textBaseline=h;var l=i(o,s,n,r,a,h);o=(o+"").split("\n");var d=t("../tool/area").getTextHeight("国",r);switch(h){case"top":n=l.y;break;case"bottom":n=l.y+d;break;default:n=l.y+d/2}for(var c=0,p=o.length;p>c;c++)e.fillText(o[c],s,n),n+=d}function i(e,i,o,s,n,r){var a=t("../tool/area"),h=a.getTextWidth(e,s),l=a.getTextHeight("国",s);switch(e=(e+"").split("\n"),n){case"end":case"right":i-=h;break;case"center":i-=h/2}switch(r){case"top":break;case"bottom":o-=l*e.length;break;default:o-=l*e.length/2}return{x:i,y:o,width:h,height:l*e.length}}var o=window.G_vmlCanvasManager,s=t("../tool/matrix"),n=t("../tool/guid"),r=t("../tool/util"),a=t("../tool/log"),h=t("../mixin/Transformable"),l=t("../mixin/Eventful"),d=function(t){t=t||{},this.id=t.id||n();for(var e in t)this[e]=t[e];this.style=this.style||{},this.highlightStyle=this.highlightStyle||null,this.parent=null,this.__dirty=!0,this.__clipShapes=[],h.call(this),l.call(this)};d.prototype.invisible=!1,d.prototype.ignore=!1,d.prototype.zlevel=0,d.prototype.draggable=!1,d.prototype.clickable=!1,d.prototype.hoverable=!0,d.prototype.z=0,d.prototype.brush=function(t,e){var i=this.beforeBrush(t,e);switch(t.beginPath(),this.buildPath(t,i),i.brushType){case"both":t.fill();case"stroke":i.lineWidth>0&&t.stroke();break;default:t.fill()}this.drawText(t,i,this.style),this.afterBrush(t)},d.prototype.beforeBrush=function(t,e){var i=this.style;return this.brushTypeOnly&&(i.brushType=this.brushTypeOnly),e&&(i=this.getHighlightStyle(i,this.highlightStyle||{},this.brushTypeOnly)),"stroke"==this.brushTypeOnly&&(i.strokeColor=i.strokeColor||i.color),t.save(),this.doClip(t),this.setContext(t,i),this.setTransform(t),i},d.prototype.afterBrush=function(t){t.restore()};var c=[["color","fillStyle"],["strokeColor","strokeStyle"],["opacity","globalAlpha"],["lineCap","lineCap"],["lineJoin","lineJoin"],["miterLimit","miterLimit"],["lineWidth","lineWidth"],["shadowBlur","shadowBlur"],["shadowColor","shadowColor"],["shadowOffsetX","shadowOffsetX"],["shadowOffsetY","shadowOffsetY"]];d.prototype.setContext=function(t,e){for(var i=0,o=c.length;o>i;i++){var s=c[i][0],n=e[s],r=c[i][1];"undefined"!=typeof n&&(t[r]=n)}};var p=s.create();return d.prototype.doClip=function(t){if(this.__clipShapes&&!o)for(var e=0;e<this.__clipShapes.length;e++){var i=this.__clipShapes[e];if(i.needTransform){var n=i.transform;s.invert(p,n),t.transform(n[0],n[1],n[2],n[3],n[4],n[5])}if(t.beginPath(),i.buildPath(t,i.style),t.clip(),i.needTransform){var n=p;t.transform(n[0],n[1],n[2],n[3],n[4],n[5])}}},d.prototype.getHighlightStyle=function(e,i,o){var s={};for(var n in e)s[n]=e[n];var r=t("../tool/color"),a=r.getHighlightColor();"stroke"!=e.brushType?(s.strokeColor=a,s.lineWidth=(e.lineWidth||1)+this.getHighlightZoom(),s.brushType="both"):"stroke"!=o?(s.strokeColor=a,s.lineWidth=(e.lineWidth||1)+this.getHighlightZoom()):s.strokeColor=i.strokeColor||r.mix(e.strokeColor,r.toRGB(a));for(var n in i)"undefined"!=typeof i[n]&&(s[n]=i[n]);return s},d.prototype.getHighlightZoom=function(){return"text"!=this.type?6:2},d.prototype.drift=function(t,e){this.position[0]+=t,this.position[1]+=e},d.prototype.buildPath=function(){a("buildPath not implemented in "+this.type)},d.prototype.getRect=function(){a("getRect not implemented in "+this.type)},d.prototype.isCover=function(e,i){var o=this.transformCoordToLocal(e,i);return e=o[0],i=o[1],this.isCoverRect(e,i)?t("../tool/area").isInside(this,this.style,e,i):!1},d.prototype.isCoverRect=function(t,e){var i=this.style.__rect;return i||(i=this.style.__rect=this.getRect(this.style)),t>=i.x&&t<=i.x+i.width&&e>=i.y&&e<=i.y+i.height},d.prototype.drawText=function(t,i,o){if("undefined"!=typeof i.text&&i.text!==!1){var s=i.textColor||i.color||i.strokeColor;t.fillStyle=s;var n,r,a,h,l=10,d=i.textPosition||this.textPosition||"top";switch(d){case"inside":case"top":case"bottom":case"left":case"right":if(this.getRect){var c=(o||i).__rect||this.getRect(o||i);switch(d){case"inside":a=c.x+c.width/2,h=c.y+c.height/2,n="center",r="middle","stroke"!=i.brushType&&s==i.color&&(t.fillStyle="#fff");break;case"left":a=c.x-l,h=c.y+c.height/2,n="end",r="middle";break;case"right":a=c.x+c.width+l,h=c.y+c.height/2,n="start",r="middle";break;case"top":a=c.x+c.width/2,h=c.y-l,n="center",r="bottom";break;case"bottom":a=c.x+c.width/2,h=c.y+c.height+l,n="center",r="top"}}break;case"start":case"end":var p=i.pointList||[[i.xStart||0,i.yStart||0],[i.xEnd||0,i.yEnd||0]],u=p.length;if(2>u)return;var g,f,m,_;switch(d){case"start":g=p[1][0],f=p[0][0],m=p[1][1],_=p[0][1];break;case"end":g=p[u-2][0],f=p[u-1][0],m=p[u-2][1],_=p[u-1][1]}a=f,h=_;var y=Math.atan((m-_)/(f-g))/Math.PI*180;0>f-g?y+=180:0>m-_&&(y+=360),l=5,y>=30&&150>=y?(n="center",r="bottom",h-=l):y>150&&210>y?(n="right",r="middle",a-=l):y>=210&&330>=y?(n="center",r="top",h+=l):(n="left",r="middle",a+=l);break;case"specific":a=i.textX||0,h=i.textY||0,n="start",r="middle"}null!=a&&null!=h&&e(t,i.text,a,h,i.textFont,i.textAlign||n,i.textBaseline||r)}},d.prototype.modSelf=function(){this.__dirty=!0,this.style&&(this.style.__rect=null),this.highlightStyle&&(this.highlightStyle.__rect=null)},d.prototype.isSilent=function(){return!(this.hoverable||this.draggable||this.clickable||this.onmousemove||this.onmouseover||this.onmouseout||this.onmousedown||this.onmouseup||this.onclick||this.ondragenter||this.ondragover||this.ondragleave||this.ondrop)},r.merge(d.prototype,h.prototype,!0),r.merge(d.prototype,l.prototype,!0),d}),i("zrender/tool/guid",[],function(){var t=2311;return function(){return"zrender__"+t++}}),i("zrender/tool/log",["require","../config"],function(t){var e=t("../config");return function(){if(0!==e.debugMode)if(1==e.debugMode)for(var t in arguments)throw new Error(arguments[t]);else if(e.debugMode>1)for(var t in arguments)console.log(arguments[t])}}),i("zrender/tool/area",["require","./util","./curve"],function(t){"use strict";function e(t){return t%=O,0>t&&(t+=O),t}function i(t,e,i,n){if(!e||!t)return!1;var r=t.type;z=z||C.getContext();var a=o(t,e,i,n);if("undefined"!=typeof a)return a;if(t.buildPath&&z.isPointInPath)return s(t,z,e,i,n);switch(r){case"ellipse":return!0;case"trochoid":var h="out"==e.location?e.r1+e.r2+e.d:e.r1-e.r2+e.d;return u(e,i,n,h);case"rose":return u(e,i,n,e.maxr);default:return!1}}function o(t,e,i,o){var s=t.type;switch(s){case"bezier-curve":return"undefined"==typeof e.cpX2?h(e.xStart,e.yStart,e.cpX1,e.cpY1,e.xEnd,e.yEnd,e.lineWidth,i,o):a(e.xStart,e.yStart,e.cpX1,e.cpY1,e.cpX2,e.cpY2,e.xEnd,e.yEnd,e.lineWidth,i,o);case"line":return r(e.xStart,e.yStart,e.xEnd,e.yEnd,e.lineWidth,i,o);case"polyline":return d(e.pointList,e.lineWidth,i,o);case"ring":return c(e.x,e.y,e.r0,e.r,i,o);case"circle":return u(e.x,e.y,e.r,i,o);case"sector":var n=e.startAngle*Math.PI/180,l=e.endAngle*Math.PI/180;return e.clockWise||(n=-n,l=-l),g(e.x,e.y,e.r0,e.r,n,l,!e.clockWise,i,o);case"path":return e.pathArray&&b(e.pathArray,Math.max(e.lineWidth,5),e.brushType,i,o);case"polygon":case"star":case"isogon":return f(e.pointList,i,o);case"text":var m=e.__rect||t.getRect(e);return p(m.x,m.y,m.width,m.height,i,o);case"rectangle":case"image":return p(e.x,e.y,e.width,e.height,i,o)}}function s(t,e,i,o,s){return e.beginPath(),t.buildPath(e,i),e.closePath(),e.isPointInPath(o,s)}function n(t,e,o,s){return!i(t,e,o,s)}function r(t,e,i,o,s,n,r){if(0===s)return!1;var a=Math.max(s,5),h=0,l=t;if(r>e+a&&r>o+a||e-a>r&&o-a>r||n>t+a&&n>i+a||t-a>n&&i-a>n)return!1;if(t===i)return Math.abs(n-t)<=a/2;h=(e-o)/(t-i),l=(t*o-i*e)/(t-i);var d=h*n-r+l,c=d*d/(h*h+1);return a/2*a/2>=c}function a(t,e,i,o,s,n,r,a,h,l,d){if(0===h)return!1;var c=Math.max(h,5);if(d>e+c&&d>o+c&&d>n+c&&d>a+c||e-c>d&&o-c>d&&n-c>d&&a-c>d||l>t+c&&l>i+c&&l>s+c&&l>r+c||t-c>l&&i-c>l&&s-c>l&&r-c>l)return!1;var p=w.cubicProjectPoint(t,e,i,o,s,n,r,a,l,d,null);return c/2>=p}function h(t,e,i,o,s,n,r,a,h){if(0===r)return!1;var l=Math.max(r,5);if(h>e+l&&h>o+l&&h>n+l||e-l>h&&o-l>h&&n-l>h||a>t+l&&a>i+l&&a>s+l||t-l>a&&i-l>a&&s-l>a)return!1;var d=w.quadraticProjectPoint(t,e,i,o,s,n,a,h,null);return l/2>=d}function l(t,i,o,s,n,r,a,h,l){if(0===a)return!1;var d=Math.max(a,5);h-=t,l-=i;var c=Math.sqrt(h*h+l*l);if(c-d>o||o>c+d)return!1;if(Math.abs(s-n)>=O)return!0;if(r){var p=s;s=e(n),n=e(p)}else s=e(s),n=e(n);s>n&&(n+=O);var u=Math.atan2(l,h);return 0>u&&(u+=O),u>=s&&n>=u||u+O>=s&&n>=u+O}function d(t,e,i,o){for(var e=Math.max(e,10),s=0,n=t.length-1;n>s;s++){var a=t[s][0],h=t[s][1],l=t[s+1][0],d=t[s+1][1];if(r(a,h,l,d,e,i,o))return!0}return!1}function c(t,e,i,o,s,n){var r=(s-t)*(s-t)+(n-e)*(n-e);return o*o>r&&r>i*i}function p(t,e,i,o,s,n){return s>=t&&t+i>=s&&n>=e&&e+o>=n}function u(t,e,i,o,s){return i*i>(o-t)*(o-t)+(s-e)*(s-e)}function g(t,e,i,o,s,n,r,a,h){return l(t,e,(i+o)/2,s,n,r,o-i,a,h)}function f(t,e,i){for(var o=t.length,s=0,n=0,r=o-1;o>n;n++){var a=t[r][0],h=t[r][1],l=t[n][0],d=t[n][1];s+=m(a,h,l,d,e,i),r=n}return 0!==s}function m(t,e,i,o,s,n){if(n>e&&n>o||e>n&&o>n)return 0;if(o==e)return 0;var r=e>o?1:-1,a=(n-e)/(o-e),h=a*(i-t)+t;return h>s?r:0}function _(){var t=R[0];R[0]=R[1],R[1]=t}function y(t,e,i,o,s,n,r,a,h,l){if(l>e&&l>o&&l>n&&l>a||e>l&&o>l&&n>l&&a>l)return 0;var d=w.cubicRootAt(e,o,n,a,l,I);if(0===d)return 0;for(var c,p,u=0,g=-1,f=0;d>f;f++){var m=I[f],y=w.cubicAt(t,i,s,r,m);h>y||(0>g&&(g=w.cubicExtrema(e,o,n,a,R),R[1]<R[0]&&g>1&&_(),c=w.cubicAt(e,o,n,a,R[0]),g>1&&(p=w.cubicAt(e,o,n,a,R[1]))),u+=2==g?m<R[0]?e>c?1:-1:m<R[1]?c>p?1:-1:p>a?1:-1:m<R[0]?e>c?1:-1:c>a?1:-1)}return u}function x(t,e,i,o,s,n,r,a){if(a>e&&a>o&&a>n||e>a&&o>a&&n>a)return 0;var h=w.quadraticRootAt(e,o,n,a,I);if(0===h)return 0;var l=w.quadraticExtremum(e,o,n);if(l>=0&&1>=l){for(var d=0,c=w.quadraticAt(e,o,n,l),p=0;h>p;p++){var u=w.quadraticAt(t,i,s,I[p]);r>u||(d+=I[p]<l?e>c?1:-1:c>n?1:-1)}return d}var u=w.quadraticAt(t,i,s,I[0]);return r>u?0:e>n?1:-1}function v(t,i,o,s,n,r,a,h){if(h-=i,h>o||-o>h)return 0;var l=Math.sqrt(o*o-h*h);if(I[0]=-l,I[1]=l,Math.abs(s-n)>=O){s=0,n=O;var d=r?1:-1;return a>=I[0]+t&&a<=I[1]+t?d:0}if(r){var l=s;s=e(n),n=e(l)}else s=e(s),n=e(n);s>n&&(n+=O);for(var c=0,p=0;2>p;p++){var u=I[p];if(u+t>a){var g=Math.atan2(h,u),d=r?1:-1;0>g&&(g=O+g),(g>=s&&n>=g||g+O>=s&&n>=g+O)&&(g>Math.PI/2&&g<1.5*Math.PI&&(d=-d),c+=d)}}return c}function b(t,e,i,o,s){var n=0,d=0,c=0,p=0,u=0,g=!0,f=!0;i=i||"fill";for(var _="stroke"===i||"both"===i,b="fill"===i||"both"===i,S=0;S<t.length;S++){var T=t[S],z=T.points;if(g||"M"===T.command){if(S>0&&(b&&(n+=m(d,c,p,u,o,s)),0!==n))return!0;p=z[z.length-2],u=z[z.length-1],g=!1,f&&"A"!==T.command&&(f=!1,d=p,c=u)}switch(T.command){case"M":d=z[0],c=z[1];break;case"L":if(_&&r(d,c,z[0],z[1],e,o,s))return!0;b&&(n+=m(d,c,z[0],z[1],o,s)),d=z[0],c=z[1];break;case"C":if(_&&a(d,c,z[0],z[1],z[2],z[3],z[4],z[5],e,o,s))return!0;b&&(n+=y(d,c,z[0],z[1],z[2],z[3],z[4],z[5],o,s)),d=z[4],c=z[5];break;case"Q":if(_&&h(d,c,z[0],z[1],z[2],z[3],e,o,s))return!0;b&&(n+=x(d,c,z[0],z[1],z[2],z[3],o,s)),d=z[2],c=z[3];break;case"A":var C=z[0],w=z[1],L=z[2],E=z[3],M=z[4],A=z[5],k=Math.cos(M)*L+C,O=Math.sin(M)*E+w;f?(f=!1,p=k,u=O):n+=m(d,c,k,O);var I=(o-C)*E/L+C;if(_&&l(C,w,E,M,M+A,1-z[7],e,I,s))return!0;b&&(n+=v(C,w,E,M,M+A,1-z[7],I,s)),d=Math.cos(M+A)*L+C,c=Math.sin(M+A)*E+w;break;case"z":if(_&&r(d,c,p,u,e,o,s))return!0;g=!0}}return b&&(n+=m(d,c,p,u,o,s)),0!==n}function S(t,e){var i=t+":"+e;if(L[i])return L[i];z=z||C.getContext(),z.save(),e&&(z.font=e),t=(t+"").split("\n");for(var o=0,s=0,n=t.length;n>s;s++)o=Math.max(z.measureText(t[s]).width,o);return z.restore(),L[i]=o,++M>k&&(M=0,L={}),o}function T(t,e){var i=t+":"+e;if(E[i])return E[i];z=z||C.getContext(),z.save(),e&&(z.font=e),t=(t+"").split("\n");var o=(z.measureText("国").width+2)*t.length;return z.restore(),E[i]=o,++A>k&&(A=0,E={}),o}var z,C=t("./util"),w=t("./curve"),L={},E={},M=0,A=0,k=5e3,O=2*Math.PI,I=[-1,-1,-1],R=[-1,-1];return{isInside:i,isOutside:n,getTextWidth:S,getTextHeight:T,isInsidePath:b,isInsidePolygon:f,isInsideSector:g,isInsideCircle:u,isInsideLine:r,isInsideRect:p,isInsidePolyline:d,isInsideCubicStroke:a,isInsideQuadraticStroke:h}}),i("zrender/mixin/Eventful",["require"],function(){var t=function(){this._handlers={}};return t.prototype.one=function(t,e,i){var o=this._handlers;return e&&t?(o[t]||(o[t]=[]),o[t].push({h:e,one:!0,ctx:i||this}),this):this},t.prototype.bind=function(t,e,i){var o=this._handlers;return e&&t?(o[t]||(o[t]=[]),o[t].push({h:e,one:!1,ctx:i||this}),this):this},t.prototype.unbind=function(t,e){var i=this._handlers;if(!t)return this._handlers={},this;if(e){if(i[t]){for(var o=[],s=0,n=i[t].length;n>s;s++)i[t][s].h!=e&&o.push(i[t][s]);i[t]=o}i[t]&&0===i[t].length&&delete i[t]}else delete i[t];return this},t.prototype.dispatch=function(t){if(this._handlers[t]){var e=arguments,i=e.length;i>3&&(e=Array.prototype.slice.call(e,1));for(var o=this._handlers[t],s=o.length,n=0;s>n;){switch(i){case 1:o[n].h.call(o[n].ctx);break;case 2:o[n].h.call(o[n].ctx,e[1]);break;case 3:o[n].h.call(o[n].ctx,e[1],e[2]);break;default:o[n].h.apply(o[n].ctx,e)}o[n].one?(o.splice(n,1),s--):n++}}return this},t.prototype.dispatchWithContext=function(t){if(this._handlers[t]){var e=arguments,i=e.length;i>4&&(e=Array.prototype.slice.call(e,1,e.length-1));for(var o=e[e.length-1],s=this._handlers[t],n=s.length,r=0;n>r;){switch(i){case 1:s[r].h.call(o);break;case 2:s[r].h.call(o,e[1]);break;case 3:s[r].h.call(o,e[1],e[2]);break;default:s[r].h.apply(o,e)}s[r].one?(s.splice(r,1),n--):r++}}return this},t}),i("zrender/mixin/Transformable",["require","../tool/matrix","../tool/vector"],function(t){"use strict";function e(t){return t>-a&&a>t}function i(t){return t>a||-a>t}var o=t("../tool/matrix"),s=t("../tool/vector"),n=[0,0],r=o.translate,a=5e-5,h=function(){this.position||(this.position=[0,0]),"undefined"==typeof this.rotation&&(this.rotation=[0,0,0]),this.scale||(this.scale=[1,1,0,0]),this.needLocalTransform=!1,this.needTransform=!1};return h.prototype={constructor:h,updateNeedTransform:function(){this.needLocalTransform=i(this.rotation[0])||i(this.position[0])||i(this.position[1])||i(this.scale[0]-1)||i(this.scale[1]-1)},updateTransform:function(){this.updateNeedTransform();var t=this.parent&&this.parent.needTransform;if(this.needTransform=this.needLocalTransform||t,this.needTransform){var e=this.transform||o.create();if(o.identity(e),this.needLocalTransform){var s=this.scale;if(i(s[0])||i(s[1])){n[0]=-s[2]||0,n[1]=-s[3]||0;var a=i(n[0])||i(n[1]);a&&r(e,e,n),o.scale(e,e,s),a&&(n[0]=-n[0],n[1]=-n[1],r(e,e,n))}if(this.rotation instanceof Array){if(0!==this.rotation[0]){n[0]=-this.rotation[1]||0,n[1]=-this.rotation[2]||0;var a=i(n[0])||i(n[1]);a&&r(e,e,n),o.rotate(e,e,this.rotation[0]),a&&(n[0]=-n[0],n[1]=-n[1],r(e,e,n))}}else 0!==this.rotation&&o.rotate(e,e,this.rotation);(i(this.position[0])||i(this.position[1]))&&r(e,e,this.position)}t&&(this.needLocalTransform?o.mul(e,this.parent.transform,e):o.copy(e,this.parent.transform)),this.transform=e,this.invTransform=this.invTransform||o.create(),o.invert(this.invTransform,e)}},setTransform:function(t){if(this.needTransform){var e=this.transform;t.transform(e[0],e[1],e[2],e[3],e[4],e[5])}},lookAt:function(){var t=s.create();return function(i){this.transform||(this.transform=o.create());var n=this.transform;if(s.sub(t,i,this.position),!e(t[0])||!e(t[1])){s.normalize(t,t);var r=this.scale;n[2]=t[0]*r[1],n[3]=t[1]*r[1],n[0]=t[1]*r[0],n[1]=-t[0]*r[0],n[4]=this.position[0],n[5]=this.position[1],this.decomposeTransform()}}}(),decomposeTransform:function(){if(this.transform){var t=this.transform,e=t[0]*t[0]+t[1]*t[1],o=this.position,s=this.scale,n=this.rotation;i(e-1)&&(e=Math.sqrt(e));var r=t[2]*t[2]+t[3]*t[3];i(r-1)&&(r=Math.sqrt(r)),o[0]=t[4],o[1]=t[5],s[0]=e,s[1]=r,s[2]=s[3]=0,n[0]=Math.atan2(-t[1]/r,t[0]/e),n[1]=n[2]=0}},transformCoordToLocal:function(t,e){var i=[t,e];return this.needTransform&&this.invTransform&&o.mulVector(i,this.invTransform,i),i}},h}),i("zrender/tool/matrix",[],function(){var t="undefined"==typeof Float32Array?Array:Float32Array,e={create:function(){var i=new t(6);return e.identity(i),i},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},mul:function(t,e,i){return t[0]=e[0]*i[0]+e[2]*i[1],t[1]=e[1]*i[0]+e[3]*i[1],t[2]=e[0]*i[2]+e[2]*i[3],t[3]=e[1]*i[2]+e[3]*i[3],t[4]=e[0]*i[4]+e[2]*i[5]+e[4],t[5]=e[1]*i[4]+e[3]*i[5]+e[5],t},translate:function(t,e,i){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4]+i[0],t[5]=e[5]+i[1],t},rotate:function(t,e,i){var o=e[0],s=e[2],n=e[4],r=e[1],a=e[3],h=e[5],l=Math.sin(i),d=Math.cos(i);
return t[0]=o*d+r*l,t[1]=-o*l+r*d,t[2]=s*d+a*l,t[3]=-s*l+d*a,t[4]=d*n+l*h,t[5]=d*h-l*n,t},scale:function(t,e,i){var o=i[0],s=i[1];return t[0]=e[0]*o,t[1]=e[1]*s,t[2]=e[2]*o,t[3]=e[3]*s,t[4]=e[4]*o,t[5]=e[5]*s,t},invert:function(t,e){var i=e[0],o=e[2],s=e[4],n=e[1],r=e[3],a=e[5],h=i*r-n*o;return h?(h=1/h,t[0]=r*h,t[1]=-n*h,t[2]=-o*h,t[3]=i*h,t[4]=(o*a-r*s)*h,t[5]=(n*s-i*a)*h,t):null},mulVector:function(t,e,i){var o=e[0],s=e[2],n=e[4],r=e[1],a=e[3],h=e[5];return t[0]=i[0]*o+i[1]*s+n,t[1]=i[0]*r+i[1]*a+h,t}};return e}),i("echarts/echarts",["require","./config","zrender/tool/util","zrender/tool/event","zrender/tool/env","zrender","zrender/config","./chart/island","./component/toolbox","./component","./component/title","./component/tooltip","./component/legend","./util/ecData","./chart","zrender/tool/color","./component/timeline","zrender/shape/Image","zrender/loadingEffect/Bar","zrender/loadingEffect/Bubble","zrender/loadingEffect/DynamicLine","zrender/loadingEffect/Ring","zrender/loadingEffect/Spin","zrender/loadingEffect/Whirling","./theme/macarons","./theme/infographic"],function(t){function e(){r.Dispatcher.call(this)}function i(t){t.innerHTML="",this._themeConfig={},this.dom=t,this._connected=!1,this._status={dragIn:!1,dragOut:!1,needRefresh:!1},this._curEventType=!1,this._chartList=[],this._messageCenter=new e,this._messageCenterOutSide=new e,this.resize=this.resize(),this._init()}function o(t,e,i,o,s){for(var n=t._chartList,r=n.length;r--;){var a=n[r];"function"==typeof a[e]&&a[e](i,o,s)}}var s=t("./config"),n=t("zrender/tool/util"),r=t("zrender/tool/event"),a={},h=t("zrender/tool/env").canvasSupported,l=new Date-0,d={},c="_echarts_instance_";a.version="2.2.2",a.dependencies={zrender:"2.0.8"},a.init=function(e,o){var s=t("zrender");s.version.replace(".","")-0<a.dependencies.zrender.replace(".","")-0&&console.error("ZRender "+s.version+" is too old for ECharts "+a.version+". Current version need ZRender "+a.dependencies.zrender+"+"),e=e instanceof Array?e[0]:e;var n=e.getAttribute(c);return n||(n=l++,e.setAttribute(c,n)),d[n]&&d[n].dispose(),d[n]=new i(e),d[n].id=n,d[n].canvasSupported=h,d[n].setTheme(o),d[n]},a.getInstanceById=function(t){return d[t]},n.merge(e.prototype,r.Dispatcher.prototype,!0);var p=t("zrender/config").EVENT,u=["CLICK","DBLCLICK","MOUSEOVER","MOUSEOUT","DRAGSTART","DRAGEND","DRAGENTER","DRAGOVER","DRAGLEAVE","DROP"];return i.prototype={_init:function(){var e=this,i=t("zrender").init(this.dom);this._zr=i,this._messageCenter.dispatch=function(t,i,o,s){o=o||{},o.type=t,o.event=i,e._messageCenter.dispatchWithContext(t,o,s),"HOVER"!=t&&"MOUSEOUT"!=t?setTimeout(function(){e._messageCenterOutSide.dispatchWithContext(t,o,s)},50):e._messageCenterOutSide.dispatchWithContext(t,o,s)},this._onevent=function(t){return e.__onevent(t)};for(var o in s.EVENT)"CLICK"!=o&&"DBLCLICK"!=o&&"HOVER"!=o&&"MOUSEOUT"!=o&&"MAP_ROAM"!=o&&this._messageCenter.bind(s.EVENT[o],this._onevent,this);var n={};this._onzrevent=function(t){return e[n[t.type]](t)};for(var r=0,a=u.length;a>r;r++){var h=u[r],l=p[h];n[l]="_on"+h.toLowerCase(),i.on(l,this._onzrevent)}this.chart={},this.component={};var d=t("./chart/island");this._island=new d(this._themeConfig,this._messageCenter,i,{},this),this.chart.island=this._island;var c=t("./component/toolbox");this._toolbox=new c(this._themeConfig,this._messageCenter,i,{},this),this.component.toolbox=this._toolbox;var g=t("./component");g.define("title",t("./component/title")),g.define("tooltip",t("./component/tooltip")),g.define("legend",t("./component/legend")),(0===i.getWidth()||0===i.getHeight())&&console.error("Dom’s width & height should be ready before init.")},__onevent:function(t){t.__echartsId=t.__echartsId||this.id;var e=t.__echartsId===this.id;switch(this._curEventType||(this._curEventType=t.type),t.type){case s.EVENT.LEGEND_SELECTED:this._onlegendSelected(t);break;case s.EVENT.DATA_ZOOM:if(!e){var i=this.component.dataZoom;i&&(i.silence(!0),i.absoluteZoom(t.zoom),i.silence(!1))}this._ondataZoom(t);break;case s.EVENT.DATA_RANGE:e&&this._ondataRange(t);break;case s.EVENT.MAGIC_TYPE_CHANGED:if(!e){var o=this.component.toolbox;o&&(o.silence(!0),o.setMagicType(t.magicType),o.silence(!1))}this._onmagicTypeChanged(t);break;case s.EVENT.DATA_VIEW_CHANGED:e&&this._ondataViewChanged(t);break;case s.EVENT.TOOLTIP_HOVER:e&&this._tooltipHover(t);break;case s.EVENT.RESTORE:this._onrestore();break;case s.EVENT.REFRESH:e&&this._onrefresh(t);break;case s.EVENT.TOOLTIP_IN_GRID:case s.EVENT.TOOLTIP_OUT_GRID:if(e){if(this._connected){var n=this.component.grid;n&&(t.x=(t.event.zrenderX-n.getX())/n.getWidth(),t.y=(t.event.zrenderY-n.getY())/n.getHeight())}}else{var n=this.component.grid;n&&this._zr.trigger("mousemove",{connectTrigger:!0,zrenderX:n.getX()+t.x*n.getWidth(),zrenderY:n.getY()+t.y*n.getHeight()})}}if(this._connected&&e&&this._curEventType===t.type){for(var r in this._connected)this._connected[r].connectedEventHandler(t);this._curEventType=null}(!e||!this._connected&&e)&&(this._curEventType=null)},_onclick:function(t){if(o(this,"onclick",t),t.target){var e=this._eventPackage(t.target);e&&null!=e.seriesIndex&&this._messageCenter.dispatch(s.EVENT.CLICK,t.event,e,this)}},_ondblclick:function(t){if(o(this,"ondblclick",t),t.target){var e=this._eventPackage(t.target);e&&null!=e.seriesIndex&&this._messageCenter.dispatch(s.EVENT.DBLCLICK,t.event,e,this)}},_onmouseover:function(t){if(t.target){var e=this._eventPackage(t.target);e&&null!=e.seriesIndex&&this._messageCenter.dispatch(s.EVENT.HOVER,t.event,e,this)}},_onmouseout:function(t){if(t.target){var e=this._eventPackage(t.target);e&&null!=e.seriesIndex&&this._messageCenter.dispatch(s.EVENT.MOUSEOUT,t.event,e,this)}},_ondragstart:function(t){this._status={dragIn:!1,dragOut:!1,needRefresh:!1},o(this,"ondragstart",t)},_ondragenter:function(t){o(this,"ondragenter",t)},_ondragover:function(t){o(this,"ondragover",t)},_ondragleave:function(t){o(this,"ondragleave",t)},_ondrop:function(t){o(this,"ondrop",t,this._status),this._island.ondrop(t,this._status)},_ondragend:function(t){if(o(this,"ondragend",t,this._status),this._timeline&&this._timeline.ondragend(t,this._status),this._island.ondragend(t,this._status),this._status.needRefresh){this._syncBackupData(this._option);var e=this._messageCenter;e.dispatch(s.EVENT.DATA_CHANGED,t.event,this._eventPackage(t.target),this),e.dispatch(s.EVENT.REFRESH,null,null,this)}},_onlegendSelected:function(t){this._status.needRefresh=!1,o(this,"onlegendSelected",t,this._status),this._status.needRefresh&&this._messageCenter.dispatch(s.EVENT.REFRESH,null,null,this)},_ondataZoom:function(t){this._status.needRefresh=!1,o(this,"ondataZoom",t,this._status),this._status.needRefresh&&this._messageCenter.dispatch(s.EVENT.REFRESH,null,null,this)},_ondataRange:function(t){this._clearEffect(),this._status.needRefresh=!1,o(this,"ondataRange",t,this._status),this._status.needRefresh&&this._zr.refreshNextFrame()},_onmagicTypeChanged:function(){this._clearEffect(),this._render(this._toolbox.getMagicOption())},_ondataViewChanged:function(t){this._syncBackupData(t.option),this._messageCenter.dispatch(s.EVENT.DATA_CHANGED,null,t,this),this._messageCenter.dispatch(s.EVENT.REFRESH,null,null,this)},_tooltipHover:function(t){var e=[];o(this,"ontooltipHover",t,e)},_onrestore:function(){this.restore()},_onrefresh:function(t){this._refreshInside=!0,this.refresh(t),this._refreshInside=!1},_syncBackupData:function(t){this.component.dataZoom&&this.component.dataZoom.syncBackupData(t)},_eventPackage:function(e){if(e){var i=t("./util/ecData"),o=i.get(e,"seriesIndex"),s=i.get(e,"dataIndex");return s=-1!=o&&this.component.dataZoom?this.component.dataZoom.getRealDataIndex(o,s):s,{seriesIndex:o,seriesName:(i.get(e,"series")||{}).name,dataIndex:s,data:i.get(e,"data"),name:i.get(e,"name"),value:i.get(e,"value"),special:i.get(e,"special")}}},_noDataCheck:function(t){for(var e=t.series,i=0,o=e.length;o>i;i++)if(e[i].type==s.CHART_TYPE_MAP||e[i].data&&e[i].data.length>0||e[i].markPoint&&e[i].markPoint.data&&e[i].markPoint.data.length>0||e[i].markLine&&e[i].markLine.data&&e[i].markLine.data.length>0||e[i].nodes&&e[i].nodes.length>0||e[i].links&&e[i].links.length>0||e[i].matrix&&e[i].matrix.length>0||e[i].eventList&&e[i].eventList.length>0)return!1;var n=this._option&&this._option.noDataLoadingOption||this._themeConfig.noDataLoadingOption||s.noDataLoadingOption||{text:this._option&&this._option.noDataText||this._themeConfig.noDataText||s.noDataText,effect:this._option&&this._option.noDataEffect||this._themeConfig.noDataEffect||s.noDataEffect};return this.clear(),this.showLoading(n),!0},_render:function(e){if(this._mergeGlobalConifg(e),!this._noDataCheck(e)){var i=e.backgroundColor;if(i)if(h||-1==i.indexOf("rgba"))this.dom.style.backgroundColor=i;else{var o=i.split(",");this.dom.style.filter="alpha(opacity="+100*o[3].substring(0,o[3].lastIndexOf(")"))+")",o.length=3,o[0]=o[0].replace("a",""),this.dom.style.backgroundColor=o.join(",")+")"}this._zr.clearAnimation(),this._chartList=[];var n=t("./chart"),r=t("./component");(e.xAxis||e.yAxis)&&(e.grid=e.grid||{},e.dataZoom=e.dataZoom||{});for(var a,l,d,c=["title","legend","tooltip","dataRange","roamController","grid","dataZoom","xAxis","yAxis","polar"],p=0,u=c.length;u>p;p++)l=c[p],d=this.component[l],e[l]?(d?d.refresh&&d.refresh(e):(a=r.get(/^[xy]Axis$/.test(l)?"axis":l),d=new a(this._themeConfig,this._messageCenter,this._zr,e,this,l),this.component[l]=d),this._chartList.push(d)):d&&(d.dispose(),this.component[l]=null,delete this.component[l]);for(var g,f,m,_={},p=0,u=e.series.length;u>p;p++)f=e.series[p].type,f?_[f]||(_[f]=!0,g=n.get(f),g?(this.chart[f]?(m=this.chart[f],m.refresh(e)):m=new g(this._themeConfig,this._messageCenter,this._zr,e,this),this._chartList.push(m),this.chart[f]=m):console.error(f+" has not been required.")):console.error("series["+p+"] chart type has not been defined.");for(f in this.chart)f==s.CHART_TYPE_ISLAND||_[f]||(this.chart[f].dispose(),this.chart[f]=null,delete this.chart[f]);this.component.grid&&this.component.grid.refixAxisShape(this.component),this._island.refresh(e),this._toolbox.refresh(e),e.animation&&!e.renderAsImage?this._zr.refresh():this._zr.render();var y="IMG"+this.id,x=document.getElementById(y);e.renderAsImage&&h?(x?x.src=this.getDataURL(e.renderAsImage):(x=this.getImage(e.renderAsImage),x.id=y,x.style.position="absolute",x.style.left=0,x.style.top=0,this.dom.firstChild.appendChild(x)),this.un(),this._zr.un(),this._disposeChartList(),this._zr.clear()):x&&x.parentNode.removeChild(x),x=null,this._option=e}},restore:function(){this._clearEffect(),this._option=n.clone(this._optionRestore),this._disposeChartList(),this._island.clear(),this._toolbox.reset(this._option,!0),this._render(this._option)},refresh:function(t){this._clearEffect(),t=t||{};var e=t.option;!this._refreshInside&&e&&(e=this.getOption(),n.merge(e,t.option,!0),n.merge(this._optionRestore,t.option,!0),this._toolbox.reset(e)),this._island.refresh(e),this._toolbox.refresh(e),this._zr.clearAnimation();for(var i=0,o=this._chartList.length;o>i;i++)this._chartList[i].refresh&&this._chartList[i].refresh(e);this.component.grid&&this.component.grid.refixAxisShape(this.component),this._zr.refresh()},_disposeChartList:function(){this._clearEffect(),this._zr.clearAnimation();for(var t=this._chartList.length;t--;){var e=this._chartList[t];if(e){var i=e.type;this.chart[i]&&delete this.chart[i],this.component[i]&&delete this.component[i],e.dispose&&e.dispose()}}this._chartList=[]},_mergeGlobalConifg:function(e){for(var i=["backgroundColor","calculable","calculableColor","calculableHolderColor","nameConnector","valueConnector","animation","animationThreshold","animationDuration","animationDurationUpdate","animationEasing","addDataAnimation","symbolList","DRAG_ENABLE_TIME"],o=i.length;o--;){var n=i[o];null==e[n]&&(e[n]=null!=this._themeConfig[n]?this._themeConfig[n]:s[n])}var r=e.color;r&&r.length||(r=this._themeConfig.color||s.color),this._zr.getColor=function(e){var i=t("zrender/tool/color");return i.getColor(e,r)},h||(e.animation=!1,e.addDataAnimation=!1)},setOption:function(t,e){return t.timeline?this._setTimelineOption(t):this._setOption(t,e)},_setOption:function(t,e){return this._option=!e&&this._option?n.merge(this.getOption(),n.clone(t),!0):n.clone(t),this._optionRestore=n.clone(this._option),this._option.series&&0!==this._option.series.length?(this.component.dataZoom&&(this._option.dataZoom||this._option.toolbox&&this._option.toolbox.feature&&this._option.toolbox.feature.dataZoom&&this._option.toolbox.feature.dataZoom.show)&&this.component.dataZoom.syncOption(this._option),this._toolbox.reset(this._option),this._render(this._option),this):void this._zr.clear()},getOption:function(){function t(t){var o=i._optionRestore[t];if(o)if(o instanceof Array)for(var s=o.length;s--;)e[t][s].data=n.clone(o[s].data);else e[t].data=n.clone(o.data)}var e=n.clone(this._option),i=this;return t("xAxis"),t("yAxis"),t("series"),e},setSeries:function(t,e){return e?(this._option.series=t,this.setOption(this._option,e)):this.setOption({series:t}),this},getSeries:function(){return this.getOption().series},_setTimelineOption:function(e){this._timeline&&this._timeline.dispose();var i=t("./component/timeline"),o=new i(this._themeConfig,this._messageCenter,this._zr,e,this);return this._timeline=o,this.component.timeline=this._timeline,this},addData:function(t,e,i,o,r){function a(){if(E._zr){E._zr.clearAnimation();for(var t=0,e=C.length;e>t;t++)C[t].motionlessOnce=l.addDataAnimation&&C[t].addDataAnimation;E._messageCenter.dispatch(s.EVENT.REFRESH,null,{option:l},E)}}for(var h=t instanceof Array?t:[[t,e,i,o,r]],l=this.getOption(),d=this._optionRestore,c=0,p=h.length;p>c;c++){t=h[c][0],e=h[c][1],i=h[c][2],o=h[c][3],r=h[c][4];var u=d.series[t],g=i?"unshift":"push",f=i?"pop":"shift";if(u){var m=u.data,_=l.series[t].data;if(m[g](e),_[g](e),o||(m[f](),e=_[f]()),null!=r){var y,x;if(u.type===s.CHART_TYPE_PIE&&(y=d.legend)&&(x=y.data)){var v=l.legend.data;if(x[g](r),v[g](r),!o){var b=n.indexOf(x,e.name);-1!=b&&x.splice(b,1),b=n.indexOf(v,e.name),-1!=b&&v.splice(b,1)}}else if(null!=d.xAxis&&null!=d.yAxis){var S,T,z=u.xAxisIndex||0;(null==d.xAxis[z].type||"category"===d.xAxis[z].type)&&(S=d.xAxis[z].data,T=l.xAxis[z].data,S[g](r),T[g](r),o||(S[f](),T[f]())),z=u.yAxisIndex||0,"category"===d.yAxis[z].type&&(S=d.yAxis[z].data,T=l.yAxis[z].data,S[g](r),T[g](r),o||(S[f](),T[f]()))}}this._option.series[t].data=l.series[t].data}}this._zr.clearAnimation();for(var C=this._chartList,w=0,L=function(){w--,0===w&&a()},c=0,p=C.length;p>c;c++)l.addDataAnimation&&C[c].addDataAnimation&&(w++,C[c].addDataAnimation(h,L));this.component.dataZoom&&this.component.dataZoom.syncOption(l),this._option=l;var E=this;return l.addDataAnimation||setTimeout(a,0),this},addMarkPoint:function(t,e){return this._addMark(t,e,"markPoint")},addMarkLine:function(t,e){return this._addMark(t,e,"markLine")},_addMark:function(t,e,i){var o,s=this._option.series;if(s&&(o=s[t])){var r=this._optionRestore.series,a=r[t],h=o[i],l=a[i];h=o[i]=h||{data:[]},l=a[i]=l||{data:[]};for(var d in e)"data"===d?(h.data=h.data.concat(e.data),l.data=l.data.concat(e.data)):"object"!=typeof e[d]||null==h[d]?h[d]=l[d]=e[d]:(n.merge(h[d],e[d],!0),n.merge(l[d],e[d],!0));var c=this.chart[o.type];c&&c.addMark(t,e,i)}return this},delMarkPoint:function(t,e){return this._delMark(t,e,"markPoint")},delMarkLine:function(t,e){return this._delMark(t,e,"markLine")},_delMark:function(t,e,i){var o,s,n,r=this._option.series;if(!(r&&(o=r[t])&&(s=o[i])&&(n=s.data)))return this;e=e.split(" > ");for(var a=-1,h=0,l=n.length;l>h;h++){var d=n[h];if(d instanceof Array){if(d[0].name===e[0]&&d[1].name===e[1]){a=h;break}}else if(d.name===e[0]){a=h;break}}if(a>-1){n.splice(a,1),this._optionRestore.series[t][i].data.splice(a,1);var c=this.chart[o.type];c&&c.delMark(t,e.join(" > "),i)}return this},getDom:function(){return this.dom},getZrender:function(){return this._zr},getDataURL:function(t){if(!h)return"";if(0===this._chartList.length){var e="IMG"+this.id,i=document.getElementById(e);if(i)return i.src}var o=this.component.tooltip;switch(o&&o.hideTip(),t){case"jpeg":break;default:t="png"}var s=this._option.backgroundColor;return s&&"rgba(0,0,0,0)"===s.replace(" ","")&&(s="#fff"),this._zr.toDataURL("image/"+t,s)},getImage:function(t){var e=this._optionRestore.title,i=document.createElement("img");return i.src=this.getDataURL(t),i.title=e&&e.text||"ECharts",i},getConnectedDataURL:function(e){if(!this.isConnected())return this.getDataURL(e);var i=this.dom,o={self:{img:this.getDataURL(e),left:i.offsetLeft,top:i.offsetTop,right:i.offsetLeft+i.offsetWidth,bottom:i.offsetTop+i.offsetHeight}},s=o.self.left,n=o.self.top,r=o.self.right,a=o.self.bottom;for(var h in this._connected)i=this._connected[h].getDom(),o[h]={img:this._connected[h].getDataURL(e),left:i.offsetLeft,top:i.offsetTop,right:i.offsetLeft+i.offsetWidth,bottom:i.offsetTop+i.offsetHeight},s=Math.min(s,o[h].left),n=Math.min(n,o[h].top),r=Math.max(r,o[h].right),a=Math.max(a,o[h].bottom);var l=document.createElement("div");l.style.position="absolute",l.style.left="-4000px",l.style.width=r-s+"px",l.style.height=a-n+"px",document.body.appendChild(l);var d=t("zrender").init(l),c=t("zrender/shape/Image");for(var h in o)d.addShape(new c({style:{x:o[h].left-s,y:o[h].top-n,image:o[h].img}}));d.render();var p=this._option.backgroundColor;p&&"rgba(0,0,0,0)"===p.replace(/ /g,"")&&(p="#fff");var u=d.toDataURL("image/png",p);return setTimeout(function(){d.dispose(),l.parentNode.removeChild(l),l=null},100),u},getConnectedImage:function(t){var e=this._optionRestore.title,i=document.createElement("img");return i.src=this.getConnectedDataURL(t),i.title=e&&e.text||"ECharts",i},on:function(t,e){return this._messageCenterOutSide.bind(t,e,this),this},un:function(t,e){return this._messageCenterOutSide.unbind(t,e),this},connect:function(t){if(!t)return this;if(this._connected||(this._connected={}),t instanceof Array)for(var e=0,i=t.length;i>e;e++)this._connected[t[e].id]=t[e];else this._connected[t.id]=t;return this},disConnect:function(t){if(!t||!this._connected)return this;if(t instanceof Array)for(var e=0,i=t.length;i>e;e++)delete this._connected[t[e].id];else delete this._connected[t.id];for(var o in this._connected)return this;return this._connected=!1,this},connectedEventHandler:function(t){t.__echartsId!=this.id&&this._onevent(t)},isConnected:function(){return!!this._connected},showLoading:function(e){var i={bar:t("zrender/loadingEffect/Bar"),bubble:t("zrender/loadingEffect/Bubble"),dynamicLine:t("zrender/loadingEffect/DynamicLine"),ring:t("zrender/loadingEffect/Ring"),spin:t("zrender/loadingEffect/Spin"),whirling:t("zrender/loadingEffect/Whirling")};this._toolbox.hideDataView(),e=e||{};var o=e.textStyle||{};e.textStyle=o;var r=n.merge(n.merge(n.clone(o),this._themeConfig.textStyle),s.textStyle);o.textFont=r.fontStyle+" "+r.fontWeight+" "+r.fontSize+"px "+r.fontFamily,o.text=e.text||this._option&&this._option.loadingText||this._themeConfig.loadingText||s.loadingText,null!=e.x&&(o.x=e.x),null!=e.y&&(o.y=e.y),e.effectOption=e.effectOption||{},e.effectOption.textStyle=o;var a=e.effect;return("string"==typeof a||null==a)&&(a=i[e.effect||this._option&&this._option.loadingEffect||this._themeConfig.loadingEffect||s.loadingEffect]||i.spin),this._zr.showLoading(new a(e.effectOption)),this},hideLoading:function(){return this._zr.hideLoading(),this},setTheme:function(e){if(e){if("string"==typeof e)switch(e){case"macarons":e=t("./theme/macarons");break;case"infographic":e=t("./theme/infographic");break;default:e={}}else e=e||{};this._themeConfig=e}if(!h){var i=this._themeConfig.textStyle;i&&i.fontFamily&&i.fontFamily2&&(i.fontFamily=i.fontFamily2),i=s.textStyle,i.fontFamily=i.fontFamily2}this._timeline&&this._timeline.setTheme(!0),this._optionRestore&&this.restore()},resize:function(){var t=this;return function(){if(t._clearEffect(),t._zr.resize(),t._option&&t._option.renderAsImage&&h)return t._render(t._option),t;t._zr.clearAnimation(),t._island.resize(),t._toolbox.resize(),t._timeline&&t._timeline.resize();for(var e=0,i=t._chartList.length;i>e;e++)t._chartList[e].resize&&t._chartList[e].resize();return t.component.grid&&t.component.grid.refixAxisShape(t.component),t._zr.refresh(),t._messageCenter.dispatch(s.EVENT.RESIZE,null,null,t),t}},_clearEffect:function(){this._zr.modLayer(s.EFFECT_ZLEVEL,{motionBlur:!1}),this._zr.painter.clearLayer(s.EFFECT_ZLEVEL)},clear:function(){return this._disposeChartList(),this._zr.clear(),this._option={},this._optionRestore={},this.dom.style.backgroundColor=null,this},dispose:function(){var t=this.dom.getAttribute(c);t&&delete d[t],this._island.dispose(),this._toolbox.dispose(),this._timeline&&this._timeline.dispose(),this._messageCenter.unbind(),this.clear(),this._zr.dispose(),this._zr=null}},a}),i("zrender/tool/env",[],function(){function t(t){var e=this.os={},i=this.browser={},o=t.match(/Web[kK]it[\/]{0,1}([\d.]+)/),s=t.match(/(Android);?[\s\/]+([\d.]+)?/),n=t.match(/(iPad).*OS\s([\d_]+)/),r=t.match(/(iPod)(.*OS\s([\d_]+))?/),a=!n&&t.match(/(iPhone\sOS)\s([\d_]+)/),h=t.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),l=h&&t.match(/TouchPad/),d=t.match(/Kindle\/([\d.]+)/),c=t.match(/Silk\/([\d._]+)/),p=t.match(/(BlackBerry).*Version\/([\d.]+)/),u=t.match(/(BB10).*Version\/([\d.]+)/),g=t.match(/(RIM\sTablet\sOS)\s([\d.]+)/),f=t.match(/PlayBook/),m=t.match(/Chrome\/([\d.]+)/)||t.match(/CriOS\/([\d.]+)/),_=t.match(/Firefox\/([\d.]+)/),y=t.match(/MSIE ([\d.]+)/),x=o&&t.match(/Mobile\//)&&!m,v=t.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/)&&!m,y=t.match(/MSIE\s([\d.]+)/);return(i.webkit=!!o)&&(i.version=o[1]),s&&(e.android=!0,e.version=s[2]),a&&!r&&(e.ios=e.iphone=!0,e.version=a[2].replace(/_/g,".")),n&&(e.ios=e.ipad=!0,e.version=n[2].replace(/_/g,".")),r&&(e.ios=e.ipod=!0,e.version=r[3]?r[3].replace(/_/g,"."):null),h&&(e.webos=!0,e.version=h[2]),l&&(e.touchpad=!0),p&&(e.blackberry=!0,e.version=p[2]),u&&(e.bb10=!0,e.version=u[2]),g&&(e.rimtabletos=!0,e.version=g[2]),f&&(i.playbook=!0),d&&(e.kindle=!0,e.version=d[1]),c&&(i.silk=!0,i.version=c[1]),!c&&e.android&&t.match(/Kindle Fire/)&&(i.silk=!0),m&&(i.chrome=!0,i.version=m[1]),_&&(i.firefox=!0,i.version=_[1]),y&&(i.ie=!0,i.version=y[1]),x&&(t.match(/Safari/)||e.ios)&&(i.safari=!0),v&&(i.webview=!0),y&&(i.ie=!0,i.version=y[1]),e.tablet=!!(n||f||s&&!t.match(/Mobile/)||_&&t.match(/Tablet/)||y&&!t.match(/Phone/)&&t.match(/Touch/)),e.phone=!(e.tablet||e.ipod||!(s||a||h||p||u||m&&t.match(/Android/)||m&&t.match(/CriOS\/([\d.]+)/)||_&&t.match(/Mobile/)||y&&t.match(/Touch/))),{browser:i,os:e,canvasSupported:document.createElement("canvas").getContext?!0:!1}}return t(navigator.userAgent)}),i("echarts/chart/island",["require","./base","zrender/shape/Circle","../config","../util/ecData","zrender/tool/util","zrender/tool/event","zrender/tool/color","../util/accMath","../chart"],function(t){function e(t,e,o,s,r){i.call(this,t,e,o,s,r),this._nameConnector,this._valueConnector,this._zrHeight=this.zr.getHeight(),this._zrWidth=this.zr.getWidth();var h=this;h.shapeHandler.onmousewheel=function(t){var e=t.target,i=t.event,o=a.getDelta(i);o=o>0?-1:1,e.style.r-=o,e.style.r=e.style.r<5?5:e.style.r;var s=n.get(e,"value"),r=s*h.option.island.calculateStep;s=r>1?Math.round(s-r*o):+(s-r*o).toFixed(2);var l=n.get(e,"name");e.style.text=l+":"+s,n.set(e,"value",s),n.set(e,"name",l),h.zr.modShape(e.id),h.zr.refreshNextFrame(),a.stop(i)}}var i=t("./base"),o=t("zrender/shape/Circle"),s=t("../config");s.island={zlevel:0,z:5,r:15,calculateStep:.1};var n=t("../util/ecData"),r=t("zrender/tool/util"),a=t("zrender/tool/event");return e.prototype={type:s.CHART_TYPE_ISLAND,_combine:function(e,i){var o=t("zrender/tool/color"),s=t("../util/accMath"),r=s.accAdd(n.get(e,"value"),n.get(i,"value")),a=n.get(e,"name")+this._nameConnector+n.get(i,"name");e.style.text=a+this._valueConnector+r,n.set(e,"value",r),n.set(e,"name",a),e.style.r=this.option.island.r,e.style.color=o.mix(e.style.color,i.style.color)},refresh:function(t){t&&(t.island=this.reformOption(t.island),this.option=t,this._nameConnector=this.option.nameConnector,this._valueConnector=this.option.valueConnector)},getOption:function(){return this.option},resize:function(){var t=this.zr.getWidth(),e=this.zr.getHeight(),i=t/(this._zrWidth||t),o=e/(this._zrHeight||e);if(1!==i||1!==o){this._zrWidth=t,this._zrHeight=e;for(var s=0,n=this.shapeList.length;n>s;s++)this.zr.modShape(this.shapeList[s].id,{style:{x:Math.round(this.shapeList[s].style.x*i),y:Math.round(this.shapeList[s].style.y*o)}})}},add:function(t){var e=n.get(t,"name"),i=n.get(t,"value"),s=null!=n.get(t,"series")?n.get(t,"series").name:"",r=this.getFont(this.option.island.textStyle),a={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:t.style.x,y:t.style.y,r:this.option.island.r,color:t.style.color||t.style.strokeColor,text:e+this._valueConnector+i,textFont:r},draggable:!0,hoverable:!0,onmousewheel:this.shapeHandler.onmousewheel,_type:"island"};"#fff"===a.style.color&&(a.style.color=t.style.strokeColor),this.setCalculable(a),a.dragEnableTime=0,n.pack(a,{name:s},-1,i,-1,e),a=new o(a),this.shapeList.push(a),this.zr.addShape(a)},del:function(t){this.zr.delShape(t.id);for(var e=[],i=0,o=this.shapeList.length;o>i;i++)this.shapeList[i].id!=t.id&&e.push(this.shapeList[i]);this.shapeList=e},ondrop:function(t,e){if(this.isDrop&&t.target){var i=t.target,o=t.dragged;this._combine(i,o),this.zr.modShape(i.id),e.dragIn=!0,this.isDrop=!1}},ondragend:function(t,e){var i=t.target;this.isDragend?e.dragIn&&(this.del(i),e.needRefresh=!0):e.dragIn||(i.style.x=a.getX(t.event),i.style.y=a.getY(t.event),this.add(i),e.needRefresh=!0),this.isDragend=!1}},r.inherits(e,i),t("../chart").define("island",e),e}),i("zrender/zrender",["require","./dep/excanvas","./tool/util","./tool/log","./tool/guid","./Handler","./Painter","./Storage","./animation/Animation","./tool/env"],function(t){function e(t){return function(){for(var e=t.animatingElements,i=0,o=e.length;o>i;i++)t.storage.mod(e[i].id);(e.length||t._needsRefreshNextFrame)&&t.refresh()}}t("./dep/excanvas");var i=t("./tool/util"),o=t("./tool/log"),s=t("./tool/guid"),n=t("./Handler"),r=t("./Painter"),a=t("./Storage"),h=t("./animation/Animation"),l={},d={};d.version="2.0.8",d.init=function(t){var e=new c(s(),t);return l[e.id]=e,e},d.dispose=function(t){if(t)t.dispose();else{for(var e in l)l[e].dispose();l={}}return d},d.getInstance=function(t){return l[t]},d.delInstance=function(t){return delete l[t],d};var c=function(i,o){this.id=i,this.env=t("./tool/env"),this.storage=new a,this.painter=new r(o,this.storage),this.handler=new n(o,this.storage,this.painter),this.animatingElements=[],this.animation=new h({stage:{update:e(this)}}),this.animation.start();var s=this;this.painter.refreshNextFrame=function(){s.refreshNextFrame()},this._needsRefreshNextFrame=!1;var s=this,l=this.storage,d=l.delFromMap;l.delFromMap=function(t){var e=l.get(t);s.stopAnimation(e),d.call(l,t)}};return c.prototype.getId=function(){return this.id},c.prototype.addShape=function(t){return this.addElement(t),this},c.prototype.addGroup=function(t){return this.addElement(t),this},c.prototype.delShape=function(t){return this.delElement(t),this},c.prototype.delGroup=function(t){return this.delElement(t),this},c.prototype.modShape=function(t,e){return this.modElement(t,e),this},c.prototype.modGroup=function(t,e){return this.modElement(t,e),this},c.prototype.addElement=function(t){return this.storage.addRoot(t),this._needsRefreshNextFrame=!0,this},c.prototype.delElement=function(t){return this.storage.delRoot(t),this._needsRefreshNextFrame=!0,this},c.prototype.modElement=function(t,e){return this.storage.mod(t,e),this._needsRefreshNextFrame=!0,this},c.prototype.modLayer=function(t,e){return this.painter.modLayer(t,e),this._needsRefreshNextFrame=!0,this},c.prototype.addHoverShape=function(t){return this.storage.addHover(t),this},c.prototype.render=function(t){return this.painter.render(t),this._needsRefreshNextFrame=!1,this},c.prototype.refresh=function(t){return this.painter.refresh(t),this._needsRefreshNextFrame=!1,this},c.prototype.refreshNextFrame=function(){return this._needsRefreshNextFrame=!0,this},c.prototype.refreshHover=function(t){return this.painter.refreshHover(t),this},c.prototype.refreshShapes=function(t,e){return this.painter.refreshShapes(t,e),this},c.prototype.resize=function(){return this.painter.resize(),this},c.prototype.animate=function(t,e,s){if("string"==typeof t&&(t=this.storage.get(t)),t){var n;if(e){for(var r=e.split("."),a=t,h=0,l=r.length;l>h;h++)a&&(a=a[r[h]]);a&&(n=a)}else n=t;if(!n)return void o('Property "'+e+'" is not existed in element '+t.id);var d=this.animatingElements;null==t.__animators&&(t.__animators=[]);var c=t.__animators;0===c.length&&d.push(t);var p=this.animation.animate(n,{loop:s}).done(function(){var e=i.indexOf(t.__animators,p);if(e>=0&&c.splice(e,1),0===c.length){var e=i.indexOf(d,t);d.splice(e,1)}});return c.push(p),p}o("Element not existed")},c.prototype.stopAnimation=function(t){if(t.__animators){for(var e=t.__animators,o=e.length,s=0;o>s;s++)e[s].stop();if(o>0){var n=this.animatingElements,r=i.indexOf(n,t);r>=0&&n.splice(r,1)}e.length=0}return this},c.prototype.clearAnimation=function(){return this.animation.clear(),this.animatingElements.length=0,this},c.prototype.showLoading=function(t){return this.painter.showLoading(t),this},c.prototype.hideLoading=function(){return this.painter.hideLoading(),this},c.prototype.getWidth=function(){return this.painter.getWidth()},c.prototype.getHeight=function(){return this.painter.getHeight()},c.prototype.toDataURL=function(t,e,i){return this.painter.toDataURL(t,e,i)},c.prototype.shapeToImage=function(t,e,i){var o=s();return this.painter.shapeToImage(o,t,e,i)},c.prototype.on=function(t,e,i){return this.handler.on(t,e,i),this},c.prototype.un=function(t,e){return this.handler.un(t,e),this},c.prototype.trigger=function(t,e){return this.handler.trigger(t,e),this},c.prototype.clear=function(){return this.storage.delRoot(),this.painter.clear(),this},c.prototype.dispose=function(){this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.animatingElements=this.storage=this.painter=this.handler=null,d.delInstance(this.id)},d}),i("zrender/tool/event",["require","../mixin/Eventful"],function(t){"use strict";function e(t){return"undefined"!=typeof t.zrenderX&&t.zrenderX||"undefined"!=typeof t.offsetX&&t.offsetX||"undefined"!=typeof t.layerX&&t.layerX||"undefined"!=typeof t.clientX&&t.clientX}function i(t){return"undefined"!=typeof t.zrenderY&&t.zrenderY||"undefined"!=typeof t.offsetY&&t.offsetY||"undefined"!=typeof t.layerY&&t.layerY||"undefined"!=typeof t.clientY&&t.clientY}function o(t){return"undefined"!=typeof t.zrenderDelta&&t.zrenderDelta||"undefined"!=typeof t.wheelDelta&&t.wheelDelta||"undefined"!=typeof t.detail&&-t.detail}var s=t("../mixin/Eventful"),n="function"==typeof window.addEventListener?function(t){t.preventDefault(),t.stopPropagation(),t.cancelBubble=!0}:function(t){t.returnValue=!1,t.cancelBubble=!0};return{getX:e,getY:i,getDelta:o,stop:n,Dispatcher:s}}),i("echarts/component",[],function(){var t={},e={};return t.define=function(i,o){return e[i]=o,t},t.get=function(t){return e[t]},t}),i("echarts/component/title",["require","./base","zrender/shape/Text","zrender/shape/Rectangle","../config","zrender/tool/util","zrender/tool/area","zrender/tool/color","../component"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Text"),s=t("zrender/shape/Rectangle"),n=t("../config");n.title={zlevel:0,z:6,show:!0,text:"",subtext:"",x:"left",y:"top",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:5,textStyle:{fontSize:18,fontWeight:"bolder",color:"#333"},subtextStyle:{color:"#aaa"}};var r=t("zrender/tool/util"),a=t("zrender/tool/area"),h=t("zrender/tool/color");return e.prototype={type:n.COMPONENT_TYPE_TITLE,_buildShape:function(){if(this.titleOption.show){this._itemGroupLocation=this._getItemGroupLocation(),this._buildBackground(),this._buildItem();
for(var t=0,e=this.shapeList.length;e>t;t++)this.zr.addShape(this.shapeList[t])}},_buildItem:function(){var t=this.titleOption.text,e=this.titleOption.link,i=this.titleOption.target,s=this.titleOption.subtext,n=this.titleOption.sublink,r=this.titleOption.subtarget,a=this.getFont(this.titleOption.textStyle),l=this.getFont(this.titleOption.subtextStyle),d=this._itemGroupLocation.x,c=this._itemGroupLocation.y,p=this._itemGroupLocation.width,u=this._itemGroupLocation.height,g={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{y:c,color:this.titleOption.textStyle.color,text:t,textFont:a,textBaseline:"top"},highlightStyle:{color:h.lift(this.titleOption.textStyle.color,1),brushType:"fill"},hoverable:!1};e&&(g.hoverable=!0,g.clickable=!0,g.onclick=function(){i&&"self"==i?window.location=e:window.open(e)});var f={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{y:c+u,color:this.titleOption.subtextStyle.color,text:s,textFont:l,textBaseline:"bottom"},highlightStyle:{color:h.lift(this.titleOption.subtextStyle.color,1),brushType:"fill"},hoverable:!1};switch(n&&(f.hoverable=!0,f.clickable=!0,f.onclick=function(){r&&"self"==r?window.location=n:window.open(n)}),this.titleOption.x){case"center":g.style.x=f.style.x=d+p/2,g.style.textAlign=f.style.textAlign="center";break;case"left":g.style.x=f.style.x=d,g.style.textAlign=f.style.textAlign="left";break;case"right":g.style.x=f.style.x=d+p,g.style.textAlign=f.style.textAlign="right";break;default:d=this.titleOption.x-0,d=isNaN(d)?0:d,g.style.x=f.style.x=d}this.titleOption.textAlign&&(g.style.textAlign=f.style.textAlign=this.titleOption.textAlign),this.shapeList.push(new o(g)),""!==s&&this.shapeList.push(new o(f))},_buildBackground:function(){var t=this.reformCssArray(this.titleOption.padding);this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._itemGroupLocation.x-t[3],y:this._itemGroupLocation.y-t[0],width:this._itemGroupLocation.width+t[3]+t[1],height:this._itemGroupLocation.height+t[0]+t[2],brushType:0===this.titleOption.borderWidth?"fill":"both",color:this.titleOption.backgroundColor,strokeColor:this.titleOption.borderColor,lineWidth:this.titleOption.borderWidth}}))},_getItemGroupLocation:function(){var t,e=this.reformCssArray(this.titleOption.padding),i=this.titleOption.text,o=this.titleOption.subtext,s=this.getFont(this.titleOption.textStyle),n=this.getFont(this.titleOption.subtextStyle),r=Math.max(a.getTextWidth(i,s),a.getTextWidth(o,n)),h=a.getTextHeight(i,s)+(""===o?0:this.titleOption.itemGap+a.getTextHeight(o,n)),l=this.zr.getWidth();switch(this.titleOption.x){case"center":t=Math.floor((l-r)/2);break;case"left":t=e[3]+this.titleOption.borderWidth;break;case"right":t=l-r-e[1]-this.titleOption.borderWidth;break;default:t=this.titleOption.x-0,t=isNaN(t)?0:t}var d,c=this.zr.getHeight();switch(this.titleOption.y){case"top":d=e[0]+this.titleOption.borderWidth;break;case"bottom":d=c-h-e[2]-this.titleOption.borderWidth;break;case"center":d=Math.floor((c-h)/2);break;default:d=this.titleOption.y-0,d=isNaN(d)?0:d}return{x:t,y:d,width:r,height:h}},refresh:function(t){t&&(this.option=t,this.option.title=this.reformOption(this.option.title),this.titleOption=this.option.title,this.titleOption.textStyle=this.getTextStyle(this.titleOption.textStyle),this.titleOption.subtextStyle=this.getTextStyle(this.titleOption.subtextStyle)),this.clear(),this._buildShape()}},r.inherits(e,i),t("../component").define("title",e),e}),i("zrender/config",[],function(){var t={EVENT:{RESIZE:"resize",CLICK:"click",DBLCLICK:"dblclick",MOUSEWHEEL:"mousewheel",MOUSEMOVE:"mousemove",MOUSEOVER:"mouseover",MOUSEOUT:"mouseout",MOUSEDOWN:"mousedown",MOUSEUP:"mouseup",GLOBALOUT:"globalout",DRAGSTART:"dragstart",DRAGEND:"dragend",DRAGENTER:"dragenter",DRAGOVER:"dragover",DRAGLEAVE:"dragleave",DROP:"drop",touchClickDelay:300},catchBrushException:!1,debugMode:0,devicePixelRatio:Math.max(window.devicePixelRatio||1,1)};return t}),i("zrender/dep/excanvas",["require"],function(){return document.createElement("canvas").getContext?G_vmlCanvasManager=!1:!function(){function t(){return this.context_||(this.context_=new v(this))}function e(t,e){var i=N.call(arguments,2);return function(){return t.apply(e,i.concat(N.call(arguments)))}}function i(t){return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}function o(t,e,i){t.namespaces[e]||t.namespaces.add(e,i,"#default#VML")}function s(t){if(o(t,"g_vml_","urn:schemas-microsoft-com:vml"),o(t,"g_o_","urn:schemas-microsoft-com:office:office"),!t.styleSheets.ex_canvas_){var e=t.createStyleSheet();e.owningElement.id="ex_canvas_",e.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"}}function n(t){var e=t.srcElement;switch(t.propertyName){case"width":e.getContext().clearRect(),e.style.width=e.attributes.width.nodeValue+"px",e.firstChild.style.width=e.clientWidth+"px";break;case"height":e.getContext().clearRect(),e.style.height=e.attributes.height.nodeValue+"px",e.firstChild.style.height=e.clientHeight+"px"}}function r(t){var e=t.srcElement;e.firstChild&&(e.firstChild.style.width=e.clientWidth+"px",e.firstChild.style.height=e.clientHeight+"px")}function a(){return[[1,0,0],[0,1,0],[0,0,1]]}function h(t,e){for(var i=a(),o=0;3>o;o++)for(var s=0;3>s;s++){for(var n=0,r=0;3>r;r++)n+=t[o][r]*e[r][s];i[o][s]=n}return i}function l(t,e){e.fillStyle=t.fillStyle,e.lineCap=t.lineCap,e.lineJoin=t.lineJoin,e.lineWidth=t.lineWidth,e.miterLimit=t.miterLimit,e.shadowBlur=t.shadowBlur,e.shadowColor=t.shadowColor,e.shadowOffsetX=t.shadowOffsetX,e.shadowOffsetY=t.shadowOffsetY,e.strokeStyle=t.strokeStyle,e.globalAlpha=t.globalAlpha,e.font=t.font,e.textAlign=t.textAlign,e.textBaseline=t.textBaseline,e.scaleX_=t.scaleX_,e.scaleY_=t.scaleY_,e.lineScale_=t.lineScale_}function d(t){var e=t.indexOf("(",3),i=t.indexOf(")",e+1),o=t.substring(e+1,i).split(",");return(4!=o.length||"a"!=t.charAt(3))&&(o[3]=1),o}function c(t){return parseFloat(t)/100}function p(t,e,i){return Math.min(i,Math.max(e,t))}function u(t){var e,i,o,s,n,r;if(s=parseFloat(t[0])/360%360,0>s&&s++,n=p(c(t[1]),0,1),r=p(c(t[2]),0,1),0==n)e=i=o=r;else{var a=.5>r?r*(1+n):r+n-r*n,h=2*r-a;e=g(h,a,s+1/3),i=g(h,a,s),o=g(h,a,s-1/3)}return"#"+W[Math.floor(255*e)]+W[Math.floor(255*i)]+W[Math.floor(255*o)]}function g(t,e,i){return 0>i&&i++,i>1&&i--,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+(e-t)*(2/3-i)*6:t}function f(t){if(t in q)return q[t];var e,i=1;if(t=String(t),"#"==t.charAt(0))e=t;else if(/^rgb/.test(t)){for(var o,s=d(t),e="#",n=0;3>n;n++)o=-1!=s[n].indexOf("%")?Math.floor(255*c(s[n])):+s[n],e+=W[p(o,0,255)];i=+s[3]}else if(/^hsl/.test(t)){var s=d(t);e=u(s),i=s[3]}else e=Z[t]||t;return q[t]={color:e,alpha:i}}function m(t){if(U[t])return U[t];var e,i=document.createElement("div"),o=i.style;try{o.font=t,e=o.fontFamily.split(",")[0]}catch(s){}return U[t]={style:o.fontStyle||V.style,variant:o.fontVariant||V.variant,weight:o.fontWeight||V.weight,size:o.fontSize||V.size,family:e||V.family}}function _(t,e){var i={};for(var o in t)i[o]=t[o];var s=parseFloat(e.currentStyle.fontSize),n=parseFloat(t.size);return i.size="number"==typeof t.size?t.size:-1!=t.size.indexOf("px")?n:-1!=t.size.indexOf("em")?s*n:-1!=t.size.indexOf("%")?s/100*n:-1!=t.size.indexOf("pt")?n/.75:s,i}function y(t){return t.style+" "+t.variant+" "+t.weight+" "+t.size+"px '"+t.family+"'"}function x(t){return Q[t]||"square"}function v(t){this.m_=a(),this.mStack_=[],this.aStack_=[],this.currentPath_=[],this.strokeStyle="#000",this.fillStyle="#000",this.lineWidth=1,this.lineJoin="miter",this.lineCap="butt",this.miterLimit=1*H,this.globalAlpha=1,this.font="12px 微软雅黑",this.textAlign="left",this.textBaseline="alphabetic",this.canvas=t;var e="width:"+t.clientWidth+"px;height:"+t.clientHeight+"px;overflow:hidden;position:absolute",i=t.ownerDocument.createElement("div");i.style.cssText=e,t.appendChild(i);var o=i.cloneNode(!1);o.style.backgroundColor="#fff",o.style.filter="alpha(opacity=0)",t.appendChild(o),this.element_=i,this.scaleX_=1,this.scaleY_=1,this.lineScale_=1}function b(t,e,i,o){t.currentPath_.push({type:"bezierCurveTo",cp1x:e.x,cp1y:e.y,cp2x:i.x,cp2y:i.y,x:o.x,y:o.y}),t.currentX_=o.x,t.currentY_=o.y}function S(t,e){var i=f(t.strokeStyle),o=i.color,s=i.alpha*t.globalAlpha,n=t.lineScale_*t.lineWidth;1>n&&(s*=n),e.push("<g_vml_:stroke",' opacity="',s,'"',' joinstyle="',t.lineJoin,'"',' miterlimit="',t.miterLimit,'"',' endcap="',x(t.lineCap),'"',' weight="',n,'px"',' color="',o,'" />')}function T(t,e,i,o){var s=t.fillStyle,n=t.scaleX_,r=t.scaleY_,a=o.x-i.x,h=o.y-i.y;if(s instanceof L){var l=0,d={x:0,y:0},c=0,p=1;if("gradient"==s.type_){var u=s.x0_/n,g=s.y0_/r,m=s.x1_/n,_=s.y1_/r,y=z(t,u,g),x=z(t,m,_),v=x.x-y.x,b=x.y-y.y;l=180*Math.atan2(v,b)/Math.PI,0>l&&(l+=360),1e-6>l&&(l=0)}else{var y=z(t,s.x0_,s.y0_);d={x:(y.x-i.x)/a,y:(y.y-i.y)/h},a/=n*H,h/=r*H;var S=O.max(a,h);c=2*s.r0_/S,p=2*s.r1_/S-c}var T=s.colors_;T.sort(function(t,e){return t.offset-e.offset});for(var C=T.length,w=T[0].color,M=T[C-1].color,A=T[0].alpha*t.globalAlpha,k=T[C-1].alpha*t.globalAlpha,I=[],R=0;C>R;R++){var P=T[R];I.push(P.offset*p+c+" "+P.color)}e.push('<g_vml_:fill type="',s.type_,'"',' method="none" focus="100%"',' color="',w,'"',' color2="',M,'"',' colors="',I.join(","),'"',' opacity="',k,'"',' g_o_:opacity2="',A,'"',' angle="',l,'"',' focusposition="',d.x,",",d.y,'" />')}else if(s instanceof E){if(a&&h){var D=-i.x,B=-i.y;e.push("<g_vml_:fill",' position="',D/a*n*n,",",B/h*r*r,'"',' type="tile"',' src="',s.src_,'" />')}}else{var F=f(t.fillStyle),N=F.color,Y=F.alpha*t.globalAlpha;e.push('<g_vml_:fill color="',N,'" opacity="',Y,'" />')}}function z(t,e,i){var o=t.m_;return{x:H*(e*o[0][0]+i*o[1][0]+o[2][0])-F,y:H*(e*o[0][1]+i*o[1][1]+o[2][1])-F}}function C(t){return isFinite(t[0][0])&&isFinite(t[0][1])&&isFinite(t[1][0])&&isFinite(t[1][1])&&isFinite(t[2][0])&&isFinite(t[2][1])}function w(t,e,i){if(C(e)&&(t.m_=e,t.scaleX_=Math.sqrt(e[0][0]*e[0][0]+e[0][1]*e[0][1]),t.scaleY_=Math.sqrt(e[1][0]*e[1][0]+e[1][1]*e[1][1]),i)){var o=e[0][0]*e[1][1]-e[0][1]*e[1][0];t.lineScale_=B(D(o))}}function L(t){this.type_=t,this.x0_=0,this.y0_=0,this.r0_=0,this.x1_=0,this.y1_=0,this.r1_=0,this.colors_=[]}function E(t,e){switch(A(t),e){case"repeat":case null:case"":this.repetition_="repeat";break;case"repeat-x":case"repeat-y":case"no-repeat":this.repetition_=e;break;default:M("SYNTAX_ERR")}this.src_=t.src,this.width_=t.width,this.height_=t.height}function M(t){throw new k(t)}function A(t){t&&1==t.nodeType&&"IMG"==t.tagName||M("TYPE_MISMATCH_ERR"),"complete"!=t.readyState&&M("INVALID_STATE_ERR")}function k(t){this.code=this[t],this.message=t+": DOM Exception "+this.code}var O=Math,I=O.round,R=O.sin,P=O.cos,D=O.abs,B=O.sqrt,H=10,F=H/2,N=(+navigator.userAgent.match(/MSIE ([\d.]+)?/)[1],Array.prototype.slice);s(document);var Y={init:function(t){var i=t||document;i.createElement("canvas"),i.attachEvent("onreadystatechange",e(this.init_,this,i))},init_:function(t){for(var e=t.getElementsByTagName("canvas"),i=0;i<e.length;i++)this.initElement(e[i])},initElement:function(e){if(!e.getContext){e.getContext=t,s(e.ownerDocument),e.innerHTML="",e.attachEvent("onpropertychange",n),e.attachEvent("onresize",r);var i=e.attributes;i.width&&i.width.specified?e.style.width=i.width.nodeValue+"px":e.width=e.clientWidth,i.height&&i.height.specified?e.style.height=i.height.nodeValue+"px":e.height=e.clientHeight}return e}};Y.init();for(var W=[],X=0;16>X;X++)for(var G=0;16>G;G++)W[16*X+G]=X.toString(16)+G.toString(16);var Z={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgreen:"#006400",darkgrey:"#A9A9A9",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",grey:"#808080",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4",indianred:"#CD5C5C",indigo:"#4B0082",ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",lightgreen:"#90EE90",lightgrey:"#D3D3D3",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",mediumaquamarine:"#66CDAA",mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370DB",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",oldlace:"#FDF5E6",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#DB7093",papayawhip:"#FFEFD5",peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",whitesmoke:"#F5F5F5",yellowgreen:"#9ACD32"},q={},V={style:"normal",variant:"normal",weight:"normal",size:12,family:"微软雅黑"},U={},Q={butt:"flat",round:"round"},j=v.prototype;j.clearRect=function(){this.textMeasureEl_&&(this.textMeasureEl_.removeNode(!0),this.textMeasureEl_=null),this.element_.innerHTML=""},j.beginPath=function(){this.currentPath_=[]},j.moveTo=function(t,e){var i=z(this,t,e);this.currentPath_.push({type:"moveTo",x:i.x,y:i.y}),this.currentX_=i.x,this.currentY_=i.y},j.lineTo=function(t,e){var i=z(this,t,e);this.currentPath_.push({type:"lineTo",x:i.x,y:i.y}),this.currentX_=i.x,this.currentY_=i.y},j.bezierCurveTo=function(t,e,i,o,s,n){var r=z(this,s,n),a=z(this,t,e),h=z(this,i,o);b(this,a,h,r)},j.quadraticCurveTo=function(t,e,i,o){var s=z(this,t,e),n=z(this,i,o),r={x:this.currentX_+2/3*(s.x-this.currentX_),y:this.currentY_+2/3*(s.y-this.currentY_)},a={x:r.x+(n.x-this.currentX_)/3,y:r.y+(n.y-this.currentY_)/3};b(this,r,a,n)},j.arc=function(t,e,i,o,s,n){i*=H;var r=n?"at":"wa",a=t+P(o)*i-F,h=e+R(o)*i-F,l=t+P(s)*i-F,d=e+R(s)*i-F;a!=l||n||(a+=.125);var c=z(this,t,e),p=z(this,a,h),u=z(this,l,d);this.currentPath_.push({type:r,x:c.x,y:c.y,radius:i,xStart:p.x,yStart:p.y,xEnd:u.x,yEnd:u.y})},j.rect=function(t,e,i,o){this.moveTo(t,e),this.lineTo(t+i,e),this.lineTo(t+i,e+o),this.lineTo(t,e+o),this.closePath()},j.strokeRect=function(t,e,i,o){var s=this.currentPath_;this.beginPath(),this.moveTo(t,e),this.lineTo(t+i,e),this.lineTo(t+i,e+o),this.lineTo(t,e+o),this.closePath(),this.stroke(),this.currentPath_=s},j.fillRect=function(t,e,i,o){var s=this.currentPath_;this.beginPath(),this.moveTo(t,e),this.lineTo(t+i,e),this.lineTo(t+i,e+o),this.lineTo(t,e+o),this.closePath(),this.fill(),this.currentPath_=s},j.createLinearGradient=function(t,e,i,o){var s=new L("gradient");return s.x0_=t,s.y0_=e,s.x1_=i,s.y1_=o,s},j.createRadialGradient=function(t,e,i,o,s,n){var r=new L("gradientradial");return r.x0_=t,r.y0_=e,r.r0_=i,r.x1_=o,r.y1_=s,r.r1_=n,r},j.drawImage=function(t){var e,i,o,s,n,r,a,h,l=t.runtimeStyle.width,d=t.runtimeStyle.height;t.runtimeStyle.width="auto",t.runtimeStyle.height="auto";var c=t.width,p=t.height;if(t.runtimeStyle.width=l,t.runtimeStyle.height=d,3==arguments.length)e=arguments[1],i=arguments[2],n=r=0,a=o=c,h=s=p;else if(5==arguments.length)e=arguments[1],i=arguments[2],o=arguments[3],s=arguments[4],n=r=0,a=c,h=p;else{if(9!=arguments.length)throw Error("Invalid number of arguments");n=arguments[1],r=arguments[2],a=arguments[3],h=arguments[4],e=arguments[5],i=arguments[6],o=arguments[7],s=arguments[8]}var u=z(this,e,i),g=[],f=10,m=10,_=x=1;if(g.push(" <g_vml_:group",' coordsize="',H*f,",",H*m,'"',' coordorigin="0,0"',' style="width:',f,"px;height:",m,"px;position:absolute;"),1!=this.m_[0][0]||this.m_[0][1]||1!=this.m_[1][1]||this.m_[1][0]){var y=[],_=this.scaleX_,x=this.scaleY_;y.push("M11=",this.m_[0][0]/_,",","M12=",this.m_[1][0]/x,",","M21=",this.m_[0][1]/_,",","M22=",this.m_[1][1]/x,",","Dx=",I(u.x/H),",","Dy=",I(u.y/H),"");var v=u,b=z(this,e+o,i),S=z(this,e,i+s),T=z(this,e+o,i+s);v.x=O.max(v.x,b.x,S.x,T.x),v.y=O.max(v.y,b.y,S.y,T.y),g.push("padding:0 ",I(v.x/H),"px ",I(v.y/H),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",y.join(""),", SizingMethod='clip');")}else g.push("top:",I(u.y/H),"px;left:",I(u.x/H),"px;");g.push(' ">'),(n||r)&&g.push('<div style="overflow: hidden; width:',Math.ceil((o+n*o/a)*_),"px;"," height:",Math.ceil((s+r*s/h)*x),"px;"," filter:progid:DxImageTransform.Microsoft.Matrix(Dx=",-n*o/a*_,",Dy=",-r*s/h*x,');">'),g.push('<div style="width:',Math.round(_*c*o/a),"px;"," height:",Math.round(x*p*s/h),"px;"," filter:"),this.globalAlpha<1&&g.push(" progid:DXImageTransform.Microsoft.Alpha(opacity="+100*this.globalAlpha+")"),g.push(" progid:DXImageTransform.Microsoft.AlphaImageLoader(src=",t.src,',sizingMethod=scale)">'),(n||r)&&g.push("</div>"),g.push("</div></div>"),this.element_.insertAdjacentHTML("BeforeEnd",g.join(""))},j.stroke=function(t){var e=[],i=10,o=10;e.push("<g_vml_:shape",' filled="',!!t,'"',' style="position:absolute;width:',i,"px;height:",o,'px;"',' coordorigin="0,0"',' coordsize="',H*i,",",H*o,'"',' stroked="',!t,'"',' path="');for(var s={x:null,y:null},n={x:null,y:null},r=0;r<this.currentPath_.length;r++){var a,h=this.currentPath_[r];switch(h.type){case"moveTo":a=h,e.push(" m ",I(h.x),",",I(h.y));break;case"lineTo":e.push(" l ",I(h.x),",",I(h.y));break;case"close":e.push(" x "),h=null;break;case"bezierCurveTo":e.push(" c ",I(h.cp1x),",",I(h.cp1y),",",I(h.cp2x),",",I(h.cp2y),",",I(h.x),",",I(h.y));break;case"at":case"wa":e.push(" ",h.type," ",I(h.x-this.scaleX_*h.radius),",",I(h.y-this.scaleY_*h.radius)," ",I(h.x+this.scaleX_*h.radius),",",I(h.y+this.scaleY_*h.radius)," ",I(h.xStart),",",I(h.yStart)," ",I(h.xEnd),",",I(h.yEnd))}h&&((null==s.x||h.x<s.x)&&(s.x=h.x),(null==n.x||h.x>n.x)&&(n.x=h.x),(null==s.y||h.y<s.y)&&(s.y=h.y),(null==n.y||h.y>n.y)&&(n.y=h.y))}e.push(' ">'),t?T(this,e,s,n):S(this,e),e.push("</g_vml_:shape>"),this.element_.insertAdjacentHTML("beforeEnd",e.join(""))},j.fill=function(){this.stroke(!0)},j.closePath=function(){this.currentPath_.push({type:"close"})},j.save=function(){var t={};l(this,t),this.aStack_.push(t),this.mStack_.push(this.m_),this.m_=h(a(),this.m_)},j.restore=function(){this.aStack_.length&&(l(this.aStack_.pop(),this),this.m_=this.mStack_.pop())},j.translate=function(t,e){var i=[[1,0,0],[0,1,0],[t,e,1]];w(this,h(i,this.m_),!1)},j.rotate=function(t){var e=P(t),i=R(t),o=[[e,i,0],[-i,e,0],[0,0,1]];w(this,h(o,this.m_),!1)},j.scale=function(t,e){var i=[[t,0,0],[0,e,0],[0,0,1]];w(this,h(i,this.m_),!0)},j.transform=function(t,e,i,o,s,n){var r=[[t,e,0],[i,o,0],[s,n,1]];w(this,h(r,this.m_),!0)},j.setTransform=function(t,e,i,o,s,n){var r=[[t,e,0],[i,o,0],[s,n,1]];w(this,r,!0)},j.drawText_=function(t,e,o,s,n){var r=this.m_,a=1e3,h=0,l=a,d={x:0,y:0},c=[],p=_(m(this.font),this.element_),u=y(p),g=this.element_.currentStyle,f=this.textAlign.toLowerCase();switch(f){case"left":case"center":case"right":break;case"end":f="ltr"==g.direction?"right":"left";break;case"start":f="rtl"==g.direction?"right":"left";break;default:f="left"}switch(this.textBaseline){case"hanging":case"top":d.y=p.size/1.75;break;case"middle":break;default:case null:case"alphabetic":case"ideographic":case"bottom":d.y=-p.size/2.25}switch(f){case"right":h=a,l=.05;break;case"center":h=l=a/2}var x=z(this,e+d.x,o+d.y);c.push('<g_vml_:line from="',-h,' 0" to="',l,' 0.05" ',' coordsize="100 100" coordorigin="0 0"',' filled="',!n,'" stroked="',!!n,'" style="position:absolute;width:1px;height:1px;">'),n?S(this,c):T(this,c,{x:-h,y:0},{x:l,y:p.size});var v=r[0][0].toFixed(3)+","+r[1][0].toFixed(3)+","+r[0][1].toFixed(3)+","+r[1][1].toFixed(3)+",0,0",b=I(x.x/H)+","+I(x.y/H);c.push('<g_vml_:skew on="t" matrix="',v,'" ',' offset="',b,'" origin="',h,' 0" />','<g_vml_:path textpathok="true" />','<g_vml_:textpath on="true" string="',i(t),'" style="v-text-align:',f,";font:",i(u),'" /></g_vml_:line>'),this.element_.insertAdjacentHTML("beforeEnd",c.join(""))},j.fillText=function(t,e,i,o){this.drawText_(t,e,i,o,!1)},j.strokeText=function(t,e,i,o){this.drawText_(t,e,i,o,!0)},j.measureText=function(t){if(!this.textMeasureEl_){var e='<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';this.element_.insertAdjacentHTML("beforeEnd",e),this.textMeasureEl_=this.element_.lastChild}var i=this.element_.ownerDocument;this.textMeasureEl_.innerHTML="";try{this.textMeasureEl_.style.font=this.font}catch(o){}return this.textMeasureEl_.appendChild(i.createTextNode(t)),{width:this.textMeasureEl_.offsetWidth}},j.clip=function(){},j.arcTo=function(){},j.createPattern=function(t,e){return new E(t,e)},L.prototype.addColorStop=function(t,e){e=f(e),this.colors_.push({offset:t,color:e.color,alpha:e.alpha})};var K=k.prototype=new Error;K.INDEX_SIZE_ERR=1,K.DOMSTRING_SIZE_ERR=2,K.HIERARCHY_REQUEST_ERR=3,K.WRONG_DOCUMENT_ERR=4,K.INVALID_CHARACTER_ERR=5,K.NO_DATA_ALLOWED_ERR=6,K.NO_MODIFICATION_ALLOWED_ERR=7,K.NOT_FOUND_ERR=8,K.NOT_SUPPORTED_ERR=9,K.INUSE_ATTRIBUTE_ERR=10,K.INVALID_STATE_ERR=11,K.SYNTAX_ERR=12,K.INVALID_MODIFICATION_ERR=13,K.NAMESPACE_ERR=14,K.INVALID_ACCESS_ERR=15,K.VALIDATION_ERR=16,K.TYPE_MISMATCH_ERR=17,G_vmlCanvasManager=Y,CanvasRenderingContext2D=v,CanvasGradient=L,CanvasPattern=E,DOMException=k}(),G_vmlCanvasManager}),i("zrender/loadingEffect/Bar",["require","./Base","../tool/util","../tool/color","../shape/Rectangle"],function(t){function e(t){i.call(this,t)}var i=t("./Base"),o=t("../tool/util"),s=t("../tool/color"),n=t("../shape/Rectangle");return o.inherits(e,i),e.prototype._start=function(t,e){var i=o.merge(this.options,{textStyle:{color:"#888"},backgroundColor:"rgba(250, 250, 250, 0.8)",effectOption:{x:0,y:this.canvasHeight/2-30,width:this.canvasWidth,height:5,brushType:"fill",timeInterval:100}}),r=this.createTextShape(i.textStyle),a=this.createBackgroundShape(i.backgroundColor),h=i.effectOption,l=new n({highlightStyle:o.clone(h)});return l.highlightStyle.color=h.color||s.getLinearGradient(h.x,h.y,h.x+h.width,h.y+h.height,[[0,"#ff6400"],[.5,"#ffe100"],[1,"#b1ff00"]]),null!=i.progress?(t(a),l.highlightStyle.width=this.adjust(i.progress,[0,1])*i.effectOption.width,t(l),t(r),void e()):(l.highlightStyle.width=0,setInterval(function(){t(a),l.highlightStyle.width<h.width?l.highlightStyle.width+=8:l.highlightStyle.width=0,t(l),t(r),e()},h.timeInterval))},e}),i("echarts/component/timeline",["require","./base","zrender/shape/Rectangle","../util/shape/Icon","../util/shape/Chain","../config","zrender/tool/util","zrender/tool/area","zrender/tool/event","../component"],function(t){function e(t,e,i,s,n){o.call(this,t,e,i,s,n);var r=this;if(r._onclick=function(t){return r.__onclick(t)},r._ondrift=function(t,e){return r.__ondrift(this,t,e)},r._ondragend=function(){return r.__ondragend()},r._setCurrentOption=function(){var t=r.timelineOption;r.currentIndex%=t.data.length;var e=r.options[r.currentIndex]||{};r.myChart.setOption(e,t.notMerge),r.messageCenter.dispatch(a.EVENT.TIMELINE_CHANGED,null,{currentIndex:r.currentIndex,data:null!=t.data[r.currentIndex].name?t.data[r.currentIndex].name:t.data[r.currentIndex]},r.myChart)},r._onFrame=function(){r._setCurrentOption(),r._syncHandleShape(),r.timelineOption.autoPlay&&(r.playTicket=setTimeout(function(){return r.currentIndex+=1,!r.timelineOption.loop&&r.currentIndex>=r.timelineOption.data.length?(r.currentIndex=r.timelineOption.data.length-1,void r.stop()):void r._onFrame()},r.timelineOption.playInterval))},this.setTheme(!1),this.options=this.option.options,this.currentIndex=this.timelineOption.currentIndex%this.timelineOption.data.length,this.timelineOption.notMerge||0===this.currentIndex||(this.options[this.currentIndex]=h.merge(this.options[this.currentIndex],this.options[0])),this.timelineOption.show&&(this._buildShape(),this._syncHandleShape()),this._setCurrentOption(),this.timelineOption.autoPlay){var r=this;this.playTicket=setTimeout(function(){r.play()},null!=this.ecTheme.animationDuration?this.ecTheme.animationDuration:a.animationDuration)}}function i(t,e){var i=2,o=e.x+i,s=e.y+i+2,r=e.width-i,a=e.height-i,h=e.symbol;if("last"===h)t.moveTo(o+r-2,s+a/3),t.lineTo(o+r-2,s),t.lineTo(o+2,s+a/2),t.lineTo(o+r-2,s+a),t.lineTo(o+r-2,s+a/3*2),t.moveTo(o,s),t.lineTo(o,s);else if("next"===h)t.moveTo(o+2,s+a/3),t.lineTo(o+2,s),t.lineTo(o+r-2,s+a/2),t.lineTo(o+2,s+a),t.lineTo(o+2,s+a/3*2),t.moveTo(o,s),t.lineTo(o,s);else if("play"===h)if("stop"===e.status)t.moveTo(o+2,s),t.lineTo(o+r-2,s+a/2),t.lineTo(o+2,s+a),t.lineTo(o+2,s);else{var l="both"===e.brushType?2:3;t.rect(o+2,s,l,a),t.rect(o+r-l-2,s,l,a)}else if(h.match("image")){var d="";d=h.replace(new RegExp("^image:\\/\\/"),""),h=n.prototype.iconLibrary.image,h(t,{x:o,y:s,width:r,height:a,image:d})}}var o=t("./base"),s=t("zrender/shape/Rectangle"),n=t("../util/shape/Icon"),r=t("../util/shape/Chain"),a=t("../config");a.timeline={zlevel:0,z:4,show:!0,type:"time",notMerge:!1,realtime:!0,x:80,x2:80,y2:0,height:50,backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,controlPosition:"left",autoPlay:!1,loop:!0,playInterval:2e3,lineStyle:{width:1,color:"#666",type:"dashed"},label:{show:!0,interval:"auto",rotate:0,textStyle:{color:"#333"}},checkpointStyle:{symbol:"auto",symbolSize:"auto",color:"auto",borderColor:"auto",borderWidth:"auto",label:{show:!1,textStyle:{color:"auto"}}},controlStyle:{itemSize:15,itemGap:5,normal:{color:"#333"},emphasis:{color:"#1e90ff"}},symbol:"emptyDiamond",symbolSize:4,currentIndex:0};var h=t("zrender/tool/util"),l=t("zrender/tool/area"),d=t("zrender/tool/event");return e.prototype={type:a.COMPONENT_TYPE_TIMELINE,_buildShape:function(){if(this._location=this._getLocation(),this._buildBackground(),this._buildControl(),this._chainPoint=this._getChainPoint(),this.timelineOption.label.show)for(var t=this._getInterval(),e=0,i=this._chainPoint.length;i>e;e+=t)this._chainPoint[e].showLabel=!0;this._buildChain(),this._buildHandle();for(var e=0,o=this.shapeList.length;o>e;e++)this.zr.addShape(this.shapeList[e])},_getLocation:function(){var t,e=this.timelineOption,i=this.reformCssArray(this.timelineOption.padding),o=this.zr.getWidth(),s=this.parsePercent(e.x,o),n=this.parsePercent(e.x2,o);null==e.width?(t=o-s-n,n=o-n):(t=this.parsePercent(e.width,o),n=s+t);var r,a,h=this.zr.getHeight(),l=this.parsePercent(e.height,h);return null!=e.y?(r=this.parsePercent(e.y,h),a=r+l):(a=h-this.parsePercent(e.y2,h),r=a-l),{x:s+i[3],y:r+i[0],x2:n-i[1],y2:a-i[2],width:t-i[1]-i[3],height:l-i[0]-i[2]}},_getReformedLabel:function(t){var e=this.timelineOption,i=null!=e.data[t].name?e.data[t].name:e.data[t],o=e.data[t].formatter||e.label.formatter;return o&&("function"==typeof o?i=o.call(this.myChart,i):"string"==typeof o&&(i=o.replace("{value}",i))),i},_getInterval:function(){var t=this._chainPoint,e=this.timelineOption,i=e.label.interval;if("auto"===i){var o=e.label.textStyle.fontSize,s=e.data,n=e.data.length;if(n>3){var r,a,h=!1;for(i=0;!h&&n>i;){i++,h=!0;for(var d=i;n>d;d+=i){if(r=t[d].x-t[d-i].x,0!==e.label.rotate)a=o;else if(s[d].textStyle)a=l.getTextWidth(t[d].name,t[d].textFont);else{var c=t[d].name+"",p=(c.match(/\w/g)||"").length,u=c.length-p;a=p*o*2/3+u*o}if(a>r){h=!1;break}}}}else i=1}else i=i-0+1;return i},_getChainPoint:function(){function t(t){return null!=l[t].name?l[t].name:l[t]+""}var e,i=this.timelineOption,o=i.symbol.toLowerCase(),s=i.symbolSize,n=i.label.rotate,r=i.label.textStyle,a=this.getFont(r),l=i.data,d=this._location.x,c=this._location.y+this._location.height/4*3,p=this._location.x2-this._location.x,u=l.length,g=[];if(u>1){var f=p/u;if(f=f>50?50:20>f?5:f,p-=2*f,"number"===i.type)for(var m=0;u>m;m++)g.push(d+f+p/(u-1)*m);else{g[0]=new Date(t(0).replace(/-/g,"/")),g[u-1]=new Date(t(u-1).replace(/-/g,"/"))-g[0];for(var m=1;u>m;m++)g[m]=d+f+p*(new Date(t(m).replace(/-/g,"/"))-g[0])/g[u-1];g[0]=d+f}}else g.push(d+p/2);for(var _,y,x,v,b,S=[],m=0;u>m;m++)d=g[m],_=l[m].symbol&&l[m].symbol.toLowerCase()||o,_.match("empty")?(_=_.replace("empty",""),x=!0):x=!1,_.match("star")&&(y=_.replace("star","")-0||5,_="star"),e=l[m].textStyle?h.merge(l[m].textStyle||{},r):r,v=e.align||"center",n?(v=n>0?"right":"left",b=[n*Math.PI/180,d,c-5]):b=!1,S.push({x:d,n:y,isEmpty:x,symbol:_,symbolSize:l[m].symbolSize||s,color:l[m].color,borderColor:l[m].borderColor,borderWidth:l[m].borderWidth,name:this._getReformedLabel(m),textColor:e.color,textAlign:v,textBaseline:e.baseline||"middle",textX:d,textY:c-(n?5:0),textFont:l[m].textStyle?this.getFont(e):a,rotation:b,showLabel:!1});return S},_buildBackground:function(){var t=this.timelineOption,e=this.reformCssArray(this.timelineOption.padding),i=this._location.width,o=this._location.height;(0!==t.borderWidth||"rgba(0,0,0,0)"!=t.backgroundColor.replace(/\s/g,""))&&this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._location.x-e[3],y:this._location.y-e[0],width:i+e[1]+e[3],height:o+e[0]+e[2],brushType:0===t.borderWidth?"fill":"both",color:t.backgroundColor,strokeColor:t.borderColor,lineWidth:t.borderWidth}}))},_buildControl:function(){var t=this,e=this.timelineOption,i=e.lineStyle,o=e.controlStyle;if("none"!==e.controlPosition){var s,r=o.itemSize,a=o.itemGap;"left"===e.controlPosition?(s=this._location.x,this._location.x+=3*(r+a)):(s=this._location.x2-(3*(r+a)-a),this._location.x2-=3*(r+a));var l=this._location.y,d={zlevel:this.getZlevelBase(),z:this.getZBase()+1,style:{iconType:"timelineControl",symbol:"last",x:s,y:l,width:r,height:r,brushType:"stroke",color:o.normal.color,strokeColor:o.normal.color,lineWidth:i.width},highlightStyle:{color:o.emphasis.color,strokeColor:o.emphasis.color,lineWidth:i.width+1},clickable:!0};this._ctrLastShape=new n(d),this._ctrLastShape.onclick=function(){t.last()},this.shapeList.push(this._ctrLastShape),s+=r+a,this._ctrPlayShape=new n(h.clone(d)),this._ctrPlayShape.style.brushType="fill",this._ctrPlayShape.style.symbol="play",this._ctrPlayShape.style.status=this.timelineOption.autoPlay?"playing":"stop",this._ctrPlayShape.style.x=s,this._ctrPlayShape.onclick=function(){"stop"===t._ctrPlayShape.style.status?t.play():t.stop()},this.shapeList.push(this._ctrPlayShape),s+=r+a,this._ctrNextShape=new n(h.clone(d)),this._ctrNextShape.style.symbol="next",this._ctrNextShape.style.x=s,this._ctrNextShape.onclick=function(){t.next()},this.shapeList.push(this._ctrNextShape)}},_buildChain:function(){var t=this.timelineOption,e=t.lineStyle;this._timelineShae={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:this._location.x,y:this.subPixelOptimize(this._location.y,e.width),width:this._location.x2-this._location.x,height:this._location.height,chainPoint:this._chainPoint,brushType:"both",strokeColor:e.color,lineWidth:e.width,lineType:e.type},hoverable:!1,clickable:!0,onclick:this._onclick},this._timelineShae=new r(this._timelineShae),this.shapeList.push(this._timelineShae)},_buildHandle:function(){var t=this._chainPoint[this.currentIndex],e=t.symbolSize+1;
e=5>e?5:e,this._handleShape={zlevel:this.getZlevelBase(),z:this.getZBase()+1,hoverable:!1,draggable:!0,style:{iconType:"diamond",n:t.n,x:t.x-e,y:this._location.y+this._location.height/4-e,width:2*e,height:2*e,brushType:"both",textPosition:"specific",textX:t.x,textY:this._location.y-this._location.height/4,textAlign:"center",textBaseline:"middle"},highlightStyle:{},ondrift:this._ondrift,ondragend:this._ondragend},this._handleShape=new n(this._handleShape),this.shapeList.push(this._handleShape)},_syncHandleShape:function(){if(this.timelineOption.show){var t=this.timelineOption,e=t.checkpointStyle,i=this._chainPoint[this.currentIndex];this._handleShape.style.text=e.label.show?i.name:"",this._handleShape.style.textFont=i.textFont,this._handleShape.style.n=i.n,"auto"===e.symbol?this._handleShape.style.iconType="none"!=i.symbol?i.symbol:"diamond":(this._handleShape.style.iconType=e.symbol,e.symbol.match("star")&&(this._handleShape.style.n=e.symbol.replace("star","")-0||5,this._handleShape.style.iconType="star"));var o;"auto"===e.symbolSize?(o=i.symbolSize+2,o=5>o?5:o):o=e.symbolSize-0,this._handleShape.style.color="auto"===e.color?i.color?i.color:t.controlStyle.emphasis.color:e.color,this._handleShape.style.textColor="auto"===e.label.textStyle.color?this._handleShape.style.color:e.label.textStyle.color,this._handleShape.highlightStyle.strokeColor=this._handleShape.style.strokeColor="auto"===e.borderColor?i.borderColor?i.borderColor:"#fff":e.borderColor,this._handleShape.style.lineWidth="auto"===e.borderWidth?i.borderWidth?i.borderWidth:0:e.borderWidth-0,this._handleShape.highlightStyle.lineWidth=this._handleShape.style.lineWidth+1,this.zr.animate(this._handleShape.id,"style").when(500,{x:i.x-o,textX:i.x,y:this._location.y+this._location.height/4-o,width:2*o,height:2*o}).start("ExponentialOut")}},_findChainIndex:function(t){var e=this._chainPoint,i=e.length;if(t<=e[0].x)return 0;if(t>=e[i-1].x)return i-1;for(var o=0;i-1>o;o++)if(t>=e[o].x&&t<=e[o+1].x)return Math.abs(t-e[o].x)<Math.abs(t-e[o+1].x)?o:o+1},__onclick:function(t){var e=d.getX(t.event),i=this._findChainIndex(e);return i===this.currentIndex?!0:(this.currentIndex=i,this.timelineOption.autoPlay&&this.stop(),clearTimeout(this.playTicket),void this._onFrame())},__ondrift:function(t,e){this.timelineOption.autoPlay&&this.stop();var i,o=this._chainPoint,s=o.length;t.style.x+e<=o[0].x-o[0].symbolSize?(t.style.x=o[0].x-o[0].symbolSize,i=0):t.style.x+e>=o[s-1].x-o[s-1].symbolSize?(t.style.x=o[s-1].x-o[s-1].symbolSize,i=s-1):(t.style.x+=e,i=this._findChainIndex(t.style.x));var n=o[i],r=n.symbolSize+2;if(t.style.iconType=n.symbol,t.style.n=n.n,t.style.textX=t.style.x+r/2,t.style.y=this._location.y+this._location.height/4-r,t.style.width=2*r,t.style.height=2*r,t.style.text=n.name,i===this.currentIndex)return!0;if(this.currentIndex=i,this.timelineOption.realtime){clearTimeout(this.playTicket);var a=this;this.playTicket=setTimeout(function(){a._setCurrentOption()},200)}return!0},__ondragend:function(){this.isDragend=!0},ondragend:function(t,e){this.isDragend&&t.target&&(!this.timelineOption.realtime&&this._setCurrentOption(),e.dragOut=!0,e.dragIn=!0,e.needRefresh=!1,this.isDragend=!1,this._syncHandleShape())},last:function(){return this.timelineOption.autoPlay&&this.stop(),this.currentIndex-=1,this.currentIndex<0&&(this.currentIndex=this.timelineOption.data.length-1),this._onFrame(),this.currentIndex},next:function(){return this.timelineOption.autoPlay&&this.stop(),this.currentIndex+=1,this.currentIndex>=this.timelineOption.data.length&&(this.currentIndex=0),this._onFrame(),this.currentIndex},play:function(t,e){return this._ctrPlayShape&&"playing"!=this._ctrPlayShape.style.status&&(this._ctrPlayShape.style.status="playing",this.zr.modShape(this._ctrPlayShape.id),this.zr.refreshNextFrame()),this.timelineOption.autoPlay=null!=e?e:!0,this.timelineOption.autoPlay||clearTimeout(this.playTicket),this.currentIndex=null!=t?t:this.currentIndex+1,this.currentIndex>=this.timelineOption.data.length&&(this.currentIndex=0),this._onFrame(),this.currentIndex},stop:function(){return this._ctrPlayShape&&"stop"!=this._ctrPlayShape.style.status&&(this._ctrPlayShape.style.status="stop",this.zr.modShape(this._ctrPlayShape.id),this.zr.refreshNextFrame()),this.timelineOption.autoPlay=!1,clearTimeout(this.playTicket),this.currentIndex},resize:function(){this.timelineOption.show&&(this.clear(),this._buildShape(),this._syncHandleShape())},setTheme:function(t){this.timelineOption=this.reformOption(h.clone(this.option.timeline)),this.timelineOption.label.textStyle=this.getTextStyle(this.timelineOption.label.textStyle),this.timelineOption.checkpointStyle.label.textStyle=this.getTextStyle(this.timelineOption.checkpointStyle.label.textStyle),this.myChart.canvasSupported||(this.timelineOption.realtime=!1),this.timelineOption.show&&t&&(this.clear(),this._buildShape(),this._syncHandleShape())},onbeforDispose:function(){clearTimeout(this.playTicket)}},n.prototype.iconLibrary.timelineControl=i,h.inherits(e,o),t("../component").define("timeline",e),e}),i("echarts/component/legend",["require","./base","zrender/shape/Text","zrender/shape/Rectangle","zrender/shape/Sector","../util/shape/Icon","../util/shape/Candle","../config","zrender/tool/util","zrender/tool/area","../component"],function(t){function e(t,e,o,s,n){if(!this.query(s,"legend.data"))return void console.error("option.legend.data has not been defined.");i.call(this,t,e,o,s,n);var r=this;r._legendSelected=function(t){r.__legendSelected(t)},r._dispatchHoverLink=function(t){return r.__dispatchHoverLink(t)},this._colorIndex=0,this._colorMap={},this._selectedMap={},this._hasDataMap={},this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Text"),s=t("zrender/shape/Rectangle"),n=t("zrender/shape/Sector"),r=t("../util/shape/Icon"),a=t("../util/shape/Candle"),h=t("../config");h.legend={zlevel:0,z:4,show:!0,orient:"horizontal",x:"center",y:"top",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,itemWidth:20,itemHeight:14,textStyle:{color:"#333"},selectedMode:!0};var l=t("zrender/tool/util"),d=t("zrender/tool/area");e.prototype={type:h.COMPONENT_TYPE_LEGEND,_buildShape:function(){if(this.legendOption.show){this._itemGroupLocation=this._getItemGroupLocation(),this._buildBackground(),this._buildItem();for(var t=0,e=this.shapeList.length;e>t;t++)this.zr.addShape(this.shapeList[t])}},_buildItem:function(){var t,e,i,s,n,a,h,c,p=this.legendOption.data,u=p.length,g=this.legendOption.textStyle,f=this.zr.getWidth(),m=this.zr.getHeight(),_=this._itemGroupLocation.x,y=this._itemGroupLocation.y,x=this.legendOption.itemWidth,v=this.legendOption.itemHeight,b=this.legendOption.itemGap;"vertical"===this.legendOption.orient&&"right"===this.legendOption.x&&(_=this._itemGroupLocation.x+this._itemGroupLocation.width-x);for(var S=0;u>S;S++)n=l.merge(p[S].textStyle||{},g),a=this.getFont(n),t=this._getName(p[S]),h=this._getFormatterName(t),""!==t?(e=p[S].icon||this._getSomethingByName(t).type,c=this.getColor(t),"horizontal"===this.legendOption.orient?200>f-_&&x+5+d.getTextWidth(h,a)+(S===u-1||""===p[S+1]?0:b)>=f-_&&(_=this._itemGroupLocation.x,y+=v+b):200>m-y&&v+(S===u-1||""===p[S+1]?0:b)>=m-y&&("right"===this.legendOption.x?_-=this._itemGroupLocation.maxWidth+b:_+=this._itemGroupLocation.maxWidth+b,y=this._itemGroupLocation.y),i=this._getItemShapeByType(_,y,x,v,this._selectedMap[t]&&this._hasDataMap[t]?c:"#ccc",e,c),i._name=t,i=new r(i),s={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:_+x+5,y:y+v/2,color:this._selectedMap[t]?"auto"===n.color?c:n.color:"#ccc",text:h,textFont:a,textBaseline:"middle"},highlightStyle:{color:c,brushType:"fill"},hoverable:!!this.legendOption.selectedMode,clickable:!!this.legendOption.selectedMode},"vertical"===this.legendOption.orient&&"right"===this.legendOption.x&&(s.style.x-=x+10,s.style.textAlign="right"),s._name=t,s=new o(s),this.legendOption.selectedMode&&(i.onclick=s.onclick=this._legendSelected,i.onmouseover=s.onmouseover=this._dispatchHoverLink,i.hoverConnect=s.id,s.hoverConnect=i.id),this.shapeList.push(i),this.shapeList.push(s),"horizontal"===this.legendOption.orient?_+=x+5+d.getTextWidth(h,a)+b:y+=v+b):"horizontal"===this.legendOption.orient?(_=this._itemGroupLocation.x,y+=v+b):("right"===this.legendOption.x?_-=this._itemGroupLocation.maxWidth+b:_+=this._itemGroupLocation.maxWidth+b,y=this._itemGroupLocation.y);"horizontal"===this.legendOption.orient&&"center"===this.legendOption.x&&y!=this._itemGroupLocation.y&&this._mLineOptimize()},_getName:function(t){return"undefined"!=typeof t.name?t.name:t},_getFormatterName:function(t){var e,i=this.legendOption.formatter;return e="function"==typeof i?i.call(this.myChart,t):"string"==typeof i?i.replace("{name}",t):t},_getFormatterNameFromData:function(t){var e=this._getName(t);return this._getFormatterName(e)},_mLineOptimize:function(){for(var t=[],e=this._itemGroupLocation.x,i=2,o=this.shapeList.length;o>i;i++)this.shapeList[i].style.x===e?t.push((this._itemGroupLocation.width-(this.shapeList[i-1].style.x+d.getTextWidth(this.shapeList[i-1].style.text,this.shapeList[i-1].style.textFont)-e))/2):i===o-1&&t.push((this._itemGroupLocation.width-(this.shapeList[i].style.x+d.getTextWidth(this.shapeList[i].style.text,this.shapeList[i].style.textFont)-e))/2);for(var s=-1,i=1,o=this.shapeList.length;o>i;i++)this.shapeList[i].style.x===e&&s++,0!==t[s]&&(this.shapeList[i].style.x+=t[s])},_buildBackground:function(){var t=this.reformCssArray(this.legendOption.padding);this.shapeList.push(new s({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._itemGroupLocation.x-t[3],y:this._itemGroupLocation.y-t[0],width:this._itemGroupLocation.width+t[3]+t[1],height:this._itemGroupLocation.height+t[0]+t[2],brushType:0===this.legendOption.borderWidth?"fill":"both",color:this.legendOption.backgroundColor,strokeColor:this.legendOption.borderColor,lineWidth:this.legendOption.borderWidth}}))},_getItemGroupLocation:function(){var t=this.legendOption.data,e=t.length,i=this.legendOption.itemGap,o=this.legendOption.itemWidth+5,s=this.legendOption.itemHeight,n=this.legendOption.textStyle,r=this.getFont(n),a=0,h=0,c=this.reformCssArray(this.legendOption.padding),p=this.zr.getWidth()-c[1]-c[3],u=this.zr.getHeight()-c[0]-c[2],g=0,f=0;if("horizontal"===this.legendOption.orient){h=s;for(var m=0;e>m;m++)if(""!==this._getName(t[m])){var _=d.getTextWidth(this._getFormatterNameFromData(t[m]),t[m].textStyle?this.getFont(l.merge(t[m].textStyle||{},n)):r);g+o+_+i>p?(g-=i,a=Math.max(a,g),h+=s+i,g=0):(g+=o+_+i,a=Math.max(a,g-i))}else g-=i,a=Math.max(a,g),h+=s+i,g=0}else{for(var m=0;e>m;m++)f=Math.max(f,d.getTextWidth(this._getFormatterNameFromData(t[m]),t[m].textStyle?this.getFont(l.merge(t[m].textStyle||{},n)):r));f+=o,a=f;for(var m=0;e>m;m++)""!==this._getName(t[m])?g+s+i>u?(a+=f+i,g-=i,h=Math.max(h,g),g=0):(g+=s+i,h=Math.max(h,g-i)):(a+=f+i,g-=i,h=Math.max(h,g),g=0)}p=this.zr.getWidth(),u=this.zr.getHeight();var y;switch(this.legendOption.x){case"center":y=Math.floor((p-a)/2);break;case"left":y=c[3]+this.legendOption.borderWidth;break;case"right":y=p-a-c[1]-c[3]-2*this.legendOption.borderWidth;break;default:y=this.parsePercent(this.legendOption.x,p)}var x;switch(this.legendOption.y){case"top":x=c[0]+this.legendOption.borderWidth;break;case"bottom":x=u-h-c[0]-c[2]-2*this.legendOption.borderWidth;break;case"center":x=Math.floor((u-h)/2);break;default:x=this.parsePercent(this.legendOption.y,u)}return{x:y,y:x,width:a,height:h,maxWidth:f}},_getSomethingByName:function(t){for(var e,i=this.option.series,o=0,s=i.length;s>o;o++){if(i[o].name===t)return{type:i[o].type,series:i[o],seriesIndex:o,data:null,dataIndex:-1};if(i[o].type===h.CHART_TYPE_PIE||i[o].type===h.CHART_TYPE_RADAR||i[o].type===h.CHART_TYPE_CHORD||i[o].type===h.CHART_TYPE_FORCE||i[o].type===h.CHART_TYPE_FUNNEL||i[o].type===h.CHART_TYPE_TREEMAP){e=i[o].categories||i[o].data||i[o].nodes;for(var n=0,r=e.length;r>n;n++)if(e[n].name===t)return{type:i[o].type,series:i[o],seriesIndex:o,data:e[n],dataIndex:n}}}return{type:"bar",series:null,seriesIndex:-1,data:null,dataIndex:-1}},_getItemShapeByType:function(t,e,i,o,s,n,r){var a,l="#ccc"===s?r:s,d={zlevel:this.getZlevelBase(),z:this.getZBase(),style:{iconType:"legendicon"+n,x:t,y:e,width:i,height:o,color:s,strokeColor:s,lineWidth:2},highlightStyle:{color:l,strokeColor:l,lineWidth:1},hoverable:this.legendOption.selectedMode,clickable:this.legendOption.selectedMode};if(n.match("image")){var a=n.replace(new RegExp("^image:\\/\\/"),"");n="image"}switch(n){case"line":d.style.brushType="stroke",d.highlightStyle.lineWidth=3;break;case"radar":case"venn":case"treemap":case"scatter":d.highlightStyle.lineWidth=3;break;case"k":d.style.brushType="both",d.highlightStyle.lineWidth=3,d.highlightStyle.color=d.style.color=this.deepQuery([this.ecTheme,h],"k.itemStyle.normal.color")||"#fff",d.style.strokeColor="#ccc"!=s?this.deepQuery([this.ecTheme,h],"k.itemStyle.normal.lineStyle.color")||"#ff3200":s;break;case"image":d.style.iconType="image",d.style.image=a,"#ccc"===s&&(d.style.opacity=.5)}return d},__legendSelected:function(t){var e=t.target._name;if("single"===this.legendOption.selectedMode)for(var i in this._selectedMap)this._selectedMap[i]=!1;this._selectedMap[e]=!this._selectedMap[e],this.messageCenter.dispatch(h.EVENT.LEGEND_SELECTED,t.event,{selected:this._selectedMap,target:e},this.myChart)},__dispatchHoverLink:function(t){this.messageCenter.dispatch(h.EVENT.LEGEND_HOVERLINK,t.event,{target:t.target._name},this.myChart)},refresh:function(t){if(t){this.option=t||this.option,this.option.legend=this.reformOption(this.option.legend),this.legendOption=this.option.legend;var e,i,o,s,n=this.legendOption.data||[];if(this.legendOption.selected)for(var r in this.legendOption.selected)this._selectedMap[r]="undefined"!=typeof this._selectedMap[r]?this._selectedMap[r]:this.legendOption.selected[r];for(var a=0,l=n.length;l>a;a++)e=this._getName(n[a]),""!==e&&(i=this._getSomethingByName(e),i.series?(this._hasDataMap[e]=!0,s=!i.data||i.type!==h.CHART_TYPE_PIE&&i.type!==h.CHART_TYPE_FORCE&&i.type!==h.CHART_TYPE_FUNNEL?[i.series]:[i.data,i.series],o=this.getItemStyleColor(this.deepQuery(s,"itemStyle.normal.color"),i.seriesIndex,i.dataIndex,i.data),o&&i.type!=h.CHART_TYPE_K&&this.setColor(e,o),this._selectedMap[e]=null!=this._selectedMap[e]?this._selectedMap[e]:!0):this._hasDataMap[e]=!1)}this.clear(),this._buildShape()},getRelatedAmount:function(t){for(var e,i=0,o=this.option.series,s=0,n=o.length;n>s;s++)if(o[s].name===t&&i++,o[s].type===h.CHART_TYPE_PIE||o[s].type===h.CHART_TYPE_RADAR||o[s].type===h.CHART_TYPE_CHORD||o[s].type===h.CHART_TYPE_FORCE||o[s].type===h.CHART_TYPE_FUNNEL){e=o[s].type!=h.CHART_TYPE_FORCE?o[s].data:o[s].categories;for(var r=0,a=e.length;a>r;r++)e[r].name===t&&"-"!=e[r].value&&i++}return i},setColor:function(t,e){this._colorMap[t]=e},getColor:function(t){return this._colorMap[t]||(this._colorMap[t]=this.zr.getColor(this._colorIndex++)),this._colorMap[t]},hasColor:function(t){return this._colorMap[t]?this._colorMap[t]:!1},add:function(t,e){for(var i=this.legendOption.data,o=0,s=i.length;s>o;o++)if(this._getName(i[o])===t)return;this.legendOption.data.push(t),this.setColor(t,e),this._selectedMap[t]=!0,this._hasDataMap[t]=!0},del:function(t){for(var e=this.legendOption.data,i=0,o=e.length;o>i;i++)if(this._getName(e[i])===t)return this.legendOption.data.splice(i,1)},getItemShape:function(t){if(null!=t)for(var e,i=0,o=this.shapeList.length;o>i;i++)if(e=this.shapeList[i],e._name===t&&"text"!=e.type)return e},setItemShape:function(t,e){for(var i,o=0,s=this.shapeList.length;s>o;o++)i=this.shapeList[o],i._name===t&&"text"!=i.type&&(this._selectedMap[t]||(e.style.color="#ccc",e.style.strokeColor="#ccc"),this.zr.modShape(i.id,e))},isSelected:function(t){return"undefined"!=typeof this._selectedMap[t]?this._selectedMap[t]:!0},getSelectedMap:function(){return this._selectedMap},setSelected:function(t,e){if("single"===this.legendOption.selectedMode)for(var i in this._selectedMap)this._selectedMap[i]=!1;this._selectedMap[t]=e,this.messageCenter.dispatch(h.EVENT.LEGEND_SELECTED,null,{selected:this._selectedMap,target:t},this.myChart)},onlegendSelected:function(t,e){var i=t.selected;for(var o in i)this._selectedMap[o]!=i[o]&&(e.needRefresh=!0),this._selectedMap[o]=i[o]}};var c={line:function(t,e){var i=e.height/2;t.moveTo(e.x,e.y+i),t.lineTo(e.x+e.width,e.y+i)},pie:function(t,e){var i=e.x,o=e.y,s=e.width,r=e.height;n.prototype.buildPath(t,{x:i+s/2,y:o+r+2,r:r,r0:6,startAngle:45,endAngle:135})},eventRiver:function(t,e){var i=e.x,o=e.y,s=e.width,n=e.height;t.moveTo(i,o+n),t.bezierCurveTo(i+s,o+n,i,o+4,i+s,o+4),t.lineTo(i+s,o),t.bezierCurveTo(i,o,i+s,o+n-4,i,o+n-4),t.lineTo(i,o+n)},k:function(t,e){var i=e.x,o=e.y,s=e.width,n=e.height;a.prototype.buildPath(t,{x:i+s/2,y:[o+1,o+1,o+n-6,o+n],width:s-6})},bar:function(t,e){var i=e.x,o=e.y+1,s=e.width,n=e.height-2,r=3;t.moveTo(i+r,o),t.lineTo(i+s-r,o),t.quadraticCurveTo(i+s,o,i+s,o+r),t.lineTo(i+s,o+n-r),t.quadraticCurveTo(i+s,o+n,i+s-r,o+n),t.lineTo(i+r,o+n),t.quadraticCurveTo(i,o+n,i,o+n-r),t.lineTo(i,o+r),t.quadraticCurveTo(i,o,i+r,o)},force:function(t,e){r.prototype.iconLibrary.circle(t,e)},radar:function(t,e){var i=6,o=e.x+e.width/2,s=e.y+e.height/2,n=e.height/2,r=2*Math.PI/i,a=-Math.PI/2,h=o+n*Math.cos(a),l=s+n*Math.sin(a);t.moveTo(h,l),a+=r;for(var d=0,c=i-1;c>d;d++)t.lineTo(o+n*Math.cos(a),s+n*Math.sin(a)),a+=r;t.lineTo(h,l)}};c.chord=c.pie,c.map=c.bar;for(var p in c)r.prototype.iconLibrary["legendicon"+p]=c[p];return l.inherits(e,i),t("../component").define("legend",e),e}),i("zrender/loadingEffect/Bubble",["require","./Base","../tool/util","../tool/color","../shape/Circle"],function(t){function e(t){i.call(this,t)}var i=t("./Base"),o=t("../tool/util"),s=t("../tool/color"),n=t("../shape/Circle");return o.inherits(e,i),e.prototype._start=function(t,e){for(var i=o.merge(this.options,{textStyle:{color:"#888"},backgroundColor:"rgba(250, 250, 250, 0.8)",effect:{n:50,lineWidth:2,brushType:"stroke",color:"random",timeInterval:100}}),r=this.createTextShape(i.textStyle),a=this.createBackgroundShape(i.backgroundColor),h=i.effect,l=h.n,d=h.brushType,c=h.lineWidth,p=[],u=this.canvasWidth,g=this.canvasHeight,f=0;l>f;f++){var m="random"==h.color?s.alpha(s.random(),.3):h.color;p[f]=new n({highlightStyle:{x:Math.ceil(Math.random()*u),y:Math.ceil(Math.random()*g),r:Math.ceil(40*Math.random()),brushType:d,color:m,strokeColor:m,lineWidth:c},animationY:Math.ceil(20*Math.random())})}return setInterval(function(){t(a);for(var i=0;l>i;i++){var o=p[i].highlightStyle;o.y-p[i].animationY+o.r<=0&&(p[i].highlightStyle.y=g+o.r,p[i].highlightStyle.x=Math.ceil(Math.random()*u)),p[i].highlightStyle.y-=p[i].animationY,t(p[i])}t(r),e()},h.timeInterval)},e}),i("zrender/loadingEffect/Ring",["require","./Base","../tool/util","../tool/color","../shape/Ring","../shape/Sector"],function(t){function e(t){i.call(this,t)}var i=t("./Base"),o=t("../tool/util"),s=t("../tool/color"),n=t("../shape/Ring"),r=t("../shape/Sector");return o.inherits(e,i),e.prototype._start=function(t,e){var i=o.merge(this.options,{textStyle:{color:"#07a"},backgroundColor:"rgba(250, 250, 250, 0.8)",effect:{x:this.canvasWidth/2,y:this.canvasHeight/2,r0:60,r:100,color:"#bbdcff",brushType:"fill",textPosition:"inside",textFont:"normal 30px verdana",textColor:"rgba(30, 144, 255, 0.6)",timeInterval:100}}),a=i.effect,h=i.textStyle;null==h.x&&(h.x=a.x),null==h.y&&(h.y=a.y+(a.r0+a.r)/2-5);for(var l=this.createTextShape(i.textStyle),d=this.createBackgroundShape(i.backgroundColor),c=a.x,p=a.y,u=a.r0+6,g=a.r-6,f=a.color,m=s.lift(f,.1),_=new n({highlightStyle:o.clone(a)}),y=[],x=s.getGradientColors(["#ff6400","#ffe100","#97ff00"],25),v=15,b=240,S=0;16>S;S++)y.push(new r({highlightStyle:{x:c,y:p,r0:u,r:g,startAngle:b-v,endAngle:b,brushType:"fill",color:m},_color:s.getLinearGradient(c+u*Math.cos(b,!0),p-u*Math.sin(b,!0),c+u*Math.cos(b-v,!0),p-u*Math.sin(b-v,!0),[[0,x[2*S]],[1,x[2*S+1]]])})),b-=v;b=360;for(var S=0;4>S;S++)y.push(new r({highlightStyle:{x:c,y:p,r0:u,r:g,startAngle:b-v,endAngle:b,brushType:"fill",color:m},_color:s.getLinearGradient(c+u*Math.cos(b,!0),p-u*Math.sin(b,!0),c+u*Math.cos(b-v,!0),p-u*Math.sin(b-v,!0),[[0,x[2*S+32]],[1,x[2*S+33]]])})),b-=v;var T=0;if(null!=i.progress){t(d),T=100*this.adjust(i.progress,[0,1]).toFixed(2)/5,_.highlightStyle.text=5*T+"%",t(_);for(var S=0;20>S;S++)y[S].highlightStyle.color=T>S?y[S]._color:m,t(y[S]);return t(l),void e()}return setInterval(function(){t(d),T+=T>=20?-20:1,t(_);for(var i=0;20>i;i++)y[i].highlightStyle.color=T>i?y[i]._color:m,t(y[i]);t(l),e()},a.timeInterval)},e}),i("zrender/loadingEffect/Spin",["require","./Base","../tool/util","../tool/color","../tool/area","../shape/Sector"],function(t){function e(t){i.call(this,t)}var i=t("./Base"),o=t("../tool/util"),s=t("../tool/color"),n=t("../tool/area"),r=t("../shape/Sector");return o.inherits(e,i),e.prototype._start=function(t,e){var i=o.merge(this.options,{textStyle:{color:"#fff",textAlign:"start"},backgroundColor:"rgba(0, 0, 0, 0.8)"}),a=this.createTextShape(i.textStyle),h=10,l=n.getTextWidth(a.highlightStyle.text,a.highlightStyle.textFont),d=n.getTextHeight(a.highlightStyle.text,a.highlightStyle.textFont),c=o.merge(this.options.effect||{},{r0:9,r:15,n:18,color:"#fff",timeInterval:100}),p=this.getLocation(this.options.textStyle,l+h+2*c.r,Math.max(2*c.r,d));c.x=p.x+c.r,c.y=a.highlightStyle.y=p.y+p.height/2,a.highlightStyle.x=c.x+c.r+h;for(var u=this.createBackgroundShape(i.backgroundColor),g=c.n,f=c.x,m=c.y,_=c.r0,y=c.r,x=c.color,v=[],b=Math.round(180/g),S=0;g>S;S++)v[S]=new r({highlightStyle:{x:f,y:m,r0:_,r:y,startAngle:b*S*2,endAngle:b*S*2+b,color:s.alpha(x,(S+1)/g),brushType:"fill"}});var T=[0,f,m];return setInterval(function(){t(u),T[0]-=.3;for(var i=0;g>i;i++)v[i].rotation=T,t(v[i]);t(a),e()},c.timeInterval)},e}),i("zrender/loadingEffect/Whirling",["require","./Base","../tool/util","../tool/area","../shape/Ring","../shape/Droplet","../shape/Circle"],function(t){function e(t){i.call(this,t)}var i=t("./Base"),o=t("../tool/util"),s=t("../tool/area"),n=t("../shape/Ring"),r=t("../shape/Droplet"),a=t("../shape/Circle");return o.inherits(e,i),e.prototype._start=function(t,e){var i=o.merge(this.options,{textStyle:{color:"#888",textAlign:"start"},backgroundColor:"rgba(250, 250, 250, 0.8)"}),h=this.createTextShape(i.textStyle),l=10,d=s.getTextWidth(h.highlightStyle.text,h.highlightStyle.textFont),c=s.getTextHeight(h.highlightStyle.text,h.highlightStyle.textFont),p=o.merge(this.options.effect||{},{r:18,colorIn:"#fff",colorOut:"#555",colorWhirl:"#6cf",timeInterval:50}),u=this.getLocation(this.options.textStyle,d+l+2*p.r,Math.max(2*p.r,c));p.x=u.x+p.r,p.y=h.highlightStyle.y=u.y+u.height/2,h.highlightStyle.x=p.x+p.r+l;var g=this.createBackgroundShape(i.backgroundColor),f=new r({highlightStyle:{a:Math.round(p.r/2),b:Math.round(p.r-p.r/6),brushType:"fill",color:p.colorWhirl}}),m=new a({highlightStyle:{r:Math.round(p.r/6),brushType:"fill",color:p.colorIn}}),_=new n({highlightStyle:{r0:Math.round(p.r-p.r/3),r:p.r,brushType:"fill",color:p.colorOut}}),y=[0,p.x,p.y];return f.highlightStyle.x=m.highlightStyle.x=_.highlightStyle.x=y[1],f.highlightStyle.y=m.highlightStyle.y=_.highlightStyle.y=y[2],setInterval(function(){t(g),t(_),y[0]-=.3,f.rotation=y,t(f),t(m),t(h),e()},p.timeInterval)},e}),i("echarts/theme/macarons",[],function(){var t={color:["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552","#95706d","#dc69aa","#07a2a4","#9a7fd1","#588dd5","#f5994e","#c05050","#59678c","#c9ab00","#7eb00a","#6f5553","#c14089"],title:{textStyle:{fontWeight:"normal",color:"#008acd"}},dataRange:{itemWidth:15,color:["#5ab1ef","#e0ffff"]},toolbox:{color:["#1e90ff","#1e90ff","#1e90ff","#1e90ff"],effectiveColor:"#ff4500"},tooltip:{backgroundColor:"rgba(50,50,50,0.5)",axisPointer:{type:"line",lineStyle:{color:"#008acd"},crossStyle:{color:"#008acd"},shadowStyle:{color:"rgba(200,200,200,0.2)"}}},dataZoom:{dataBackgroundColor:"#efefff",fillerColor:"rgba(182,162,222,0.2)",handleColor:"#008acd"},grid:{borderColor:"#eee"},categoryAxis:{axisLine:{lineStyle:{color:"#008acd"}},splitLine:{lineStyle:{color:["#eee"]}}},valueAxis:{axisLine:{lineStyle:{color:"#008acd"}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.1)","rgba(200,200,200,0.1)"]}},splitLine:{lineStyle:{color:["#eee"]}}},polar:{axisLine:{lineStyle:{color:"#ddd"}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.2)","rgba(200,200,200,0.2)"]}},splitLine:{lineStyle:{color:"#ddd"}}},timeline:{lineStyle:{color:"#008acd"},controlStyle:{normal:{color:"#008acd"},emphasis:{color:"#008acd"}},symbol:"emptyCircle",symbolSize:3},bar:{itemStyle:{normal:{barBorderRadius:5},emphasis:{barBorderRadius:5}}},line:{smooth:!0,symbol:"emptyCircle",symbolSize:3},k:{itemStyle:{normal:{color:"#d87a80",color0:"#2ec7c9",lineStyle:{color:"#d87a80",color0:"#2ec7c9"}}}},scatter:{symbol:"circle",symbolSize:4},radar:{symbol:"emptyCircle",symbolSize:3},map:{itemStyle:{normal:{areaStyle:{color:"#ddd"},label:{textStyle:{color:"#d87a80"}}},emphasis:{areaStyle:{color:"#fe994e"}}}},force:{itemStyle:{normal:{linkStyle:{color:"#1e90ff"}}}},chord:{itemStyle:{normal:{borderWidth:1,borderColor:"rgba(128, 128, 128, 0.5)",chordStyle:{lineStyle:{color:"rgba(128, 128, 128, 0.5)"}}},emphasis:{borderWidth:1,borderColor:"rgba(128, 128, 128, 0.5)",chordStyle:{lineStyle:{color:"rgba(128, 128, 128, 0.5)"}}}}},gauge:{axisLine:{lineStyle:{color:[[.2,"#2ec7c9"],[.8,"#5ab1ef"],[1,"#d87a80"]],width:10}},axisTick:{splitNumber:10,length:15,lineStyle:{color:"auto"}},splitLine:{length:22,lineStyle:{color:"auto"}},pointer:{width:5}},textStyle:{fontFamily:"微软雅黑, Arial, Verdana, sans-serif"}};return t}),i("echarts/theme/infographic",[],function(){var t={color:["#C1232B","#B5C334","#FCCE10","#E87C25","#27727B","#FE8463","#9BCA63","#FAD860","#F3A43B","#60C0DD","#D7504B","#C6E579","#F4E001","#F0805A","#26C0C0"],title:{textStyle:{fontWeight:"normal",color:"#27727B"}},dataRange:{x:"right",y:"center",itemWidth:5,itemHeight:25,color:["#C1232B","#FCCE10"]},toolbox:{color:["#C1232B","#B5C334","#FCCE10","#E87C25","#27727B","#FE8463","#9BCA63","#FAD860","#F3A43B","#60C0DD"],effectiveColor:"#ff4500"},tooltip:{backgroundColor:"rgba(50,50,50,0.5)",axisPointer:{type:"line",lineStyle:{color:"#27727B",type:"dashed"},crossStyle:{color:"#27727B"},shadowStyle:{color:"rgba(200,200,200,0.3)"}}},dataZoom:{dataBackgroundColor:"rgba(181,195,52,0.3)",fillerColor:"rgba(181,195,52,0.2)",handleColor:"#27727B"},grid:{borderWidth:0},categoryAxis:{axisLine:{lineStyle:{color:"#27727B"}},splitLine:{show:!1}},valueAxis:{axisLine:{show:!1},splitArea:{show:!1},splitLine:{lineStyle:{color:["#ccc"],type:"dashed"}}},polar:{axisLine:{lineStyle:{color:"#ddd"}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.2)","rgba(200,200,200,0.2)"]}},splitLine:{lineStyle:{color:"#ddd"}}},timeline:{lineStyle:{color:"#27727B"},controlStyle:{normal:{color:"#27727B"},emphasis:{color:"#27727B"}},symbol:"emptyCircle",symbolSize:3},line:{itemStyle:{normal:{borderWidth:2,borderColor:"#fff",lineStyle:{width:3}},emphasis:{borderWidth:0}},symbol:"circle",symbolSize:3.5},k:{itemStyle:{normal:{color:"#C1232B",color0:"#B5C334",lineStyle:{width:1,color:"#C1232B",color0:"#B5C334"}}}},scatter:{itemStyle:{normal:{borderWidth:1,borderColor:"rgba(200,200,200,0.5)"},emphasis:{borderWidth:0}},symbol:"star4",symbolSize:4},radar:{symbol:"emptyCircle",symbolSize:3},map:{itemStyle:{normal:{areaStyle:{color:"#ddd"},label:{textStyle:{color:"#C1232B"}}},emphasis:{areaStyle:{color:"#fe994e"},label:{textStyle:{color:"rgb(100,0,0)"}}}}},force:{itemStyle:{normal:{linkStyle:{color:"#27727B"}}}},chord:{itemStyle:{normal:{borderWidth:1,borderColor:"rgba(128, 128, 128, 0.5)",chordStyle:{lineStyle:{color:"rgba(128, 128, 128, 0.5)"}}},emphasis:{borderWidth:1,borderColor:"rgba(128, 128, 128, 0.5)",chordStyle:{lineStyle:{color:"rgba(128, 128, 128, 0.5)"}}}}},gauge:{center:["50%","80%"],radius:"100%",startAngle:180,endAngle:0,axisLine:{show:!0,lineStyle:{color:[[.2,"#B5C334"],[.8,"#27727B"],[1,"#C1232B"]],width:"40%"}},axisTick:{splitNumber:2,length:5,lineStyle:{color:"#fff"}},axisLabel:{textStyle:{color:"#fff",fontWeight:"bolder"}},splitLine:{length:"5%",lineStyle:{color:"#fff"}},pointer:{width:"40%",length:"80%",color:"#fff"},title:{offsetCenter:[0,-20],textStyle:{color:"auto",fontSize:20}},detail:{offsetCenter:[0,0],textStyle:{color:"auto",fontSize:40}}},textStyle:{fontFamily:"微软雅黑, Arial, Verdana, sans-serif"}};return t}),i("zrender/loadingEffect/DynamicLine",["require","./Base","../tool/util","../tool/color","../shape/Line"],function(t){function e(t){i.call(this,t)}var i=t("./Base"),o=t("../tool/util"),s=t("../tool/color"),n=t("../shape/Line");return o.inherits(e,i),e.prototype._start=function(t,e){for(var i=o.merge(this.options,{textStyle:{color:"#fff"},backgroundColor:"rgba(0, 0, 0, 0.8)",effectOption:{n:30,lineWidth:1,color:"random",timeInterval:100}}),r=this.createTextShape(i.textStyle),a=this.createBackgroundShape(i.backgroundColor),h=i.effectOption,l=h.n,d=h.lineWidth,c=[],p=this.canvasWidth,u=this.canvasHeight,g=0;l>g;g++){var f=-Math.ceil(1e3*Math.random()),m=Math.ceil(400*Math.random()),_=Math.ceil(Math.random()*u),y="random"==h.color?s.random():h.color;c[g]=new n({highlightStyle:{xStart:f,yStart:_,xEnd:f+m,yEnd:_,strokeColor:y,lineWidth:d},animationX:Math.ceil(100*Math.random()),len:m})}return setInterval(function(){t(a);for(var i=0;l>i;i++){var o=c[i].highlightStyle;o.xStart>=p&&(c[i].len=Math.ceil(400*Math.random()),o.xStart=-400,o.xEnd=-400+c[i].len,o.yStart=Math.ceil(Math.random()*u),o.yEnd=o.yStart),o.xStart+=c[i].animationX,o.xEnd+=c[i].animationX,t(c[i])}t(r),e()},h.timeInterval)},e}),i("echarts/component/toolbox",["require","./base","zrender/shape/Line","zrender/shape/Image","zrender/shape/Rectangle","../util/shape/Icon","../config","zrender/tool/util","zrender/config","zrender/tool/event","./dataView","../component"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.dom=n.dom,this._magicType={},this._magicMap={},this._isSilence=!1,this._iconList,this._iconShapeMap={},this._featureTitle={},this._featureIcon={},this._featureColor={},this._featureOption={},this._enableColor="red",this._disableColor="#ccc",this._markShapeList=[];var r=this;r._onMark=function(t){r.__onMark(t)},r._onMarkUndo=function(t){r.__onMarkUndo(t)},r._onMarkClear=function(t){r.__onMarkClear(t)},r._onDataZoom=function(t){r.__onDataZoom(t)},r._onDataZoomReset=function(t){r.__onDataZoomReset(t)},r._onDataView=function(t){r.__onDataView(t)},r._onRestore=function(t){r.__onRestore(t)},r._onSaveAsImage=function(t){r.__onSaveAsImage(t)},r._onMagicType=function(t){r.__onMagicType(t)},r._onCustomHandler=function(t){r.__onCustomHandler(t)},r._onmousemove=function(t){return r.__onmousemove(t)},r._onmousedown=function(t){return r.__onmousedown(t)},r._onmouseup=function(t){return r.__onmouseup(t)},r._onclick=function(t){return r.__onclick(t)}}var i=t("./base"),o=t("zrender/shape/Line"),s=t("zrender/shape/Image"),n=t("zrender/shape/Rectangle"),r=t("../util/shape/Icon"),a=t("../config");a.toolbox={zlevel:0,z:6,show:!1,orient:"horizontal",x:"right",y:"top",color:["#1e90ff","#22bb22","#4b0082","#d2691e"],disableColor:"#ddd",effectiveColor:"red",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,itemSize:16,showTitle:!0,feature:{mark:{show:!1,title:{mark:"辅助线开关",markUndo:"删除辅助线",markClear:"清空辅助线"},lineStyle:{width:1,color:"#1e90ff",type:"dashed"}},dataZoom:{show:!1,title:{dataZoom:"区域缩放",dataZoomReset:"区域缩放后退"}},dataView:{show:!1,title:"数据视图",readOnly:!1,lang:["数据视图","关闭","刷新"]},magicType:{show:!1,title:{line:"折线图切换",bar:"柱形图切换",stack:"堆积",tiled:"平铺",force:"力导向布局图切换",chord:"和弦图切换",pie:"饼图切换",funnel:"漏斗图切换"},type:[]},restore:{show:!1,title:"还原"},saveAsImage:{show:!1,title:"保存为图片",type:"png",lang:["点击保存"]}}};var h=t("zrender/tool/util"),l=t("zrender/config"),d=t("zrender/tool/event"),c="stack",p="tiled";return e.prototype={type:a.COMPONENT_TYPE_TOOLBOX,_buildShape:function(){this._iconList=[];
var t=this.option.toolbox;this._enableColor=t.effectiveColor,this._disableColor=t.disableColor;var e=t.feature,i=[];for(var o in e)if(e[o].show)switch(o){case"mark":i.push({key:o,name:"mark"}),i.push({key:o,name:"markUndo"}),i.push({key:o,name:"markClear"});break;case"magicType":for(var s=0,n=e[o].type.length;n>s;s++)e[o].title[e[o].type[s]+"Chart"]=e[o].title[e[o].type[s]],e[o].option&&(e[o].option[e[o].type[s]+"Chart"]=e[o].option[e[o].type[s]]),i.push({key:o,name:e[o].type[s]+"Chart"});break;case"dataZoom":i.push({key:o,name:"dataZoom"}),i.push({key:o,name:"dataZoomReset"});break;case"saveAsImage":this.canvasSupported&&i.push({key:o,name:"saveAsImage"});break;default:i.push({key:o,name:o})}if(i.length>0){for(var r,o,s=0,n=i.length;n>s;s++)r=i[s].name,o=i[s].key,this._iconList.push(r),this._featureTitle[r]=e[o].title[r]||e[o].title,e[o].icon&&(this._featureIcon[r]=e[o].icon[r]||e[o].icon),e[o].color&&(this._featureColor[r]=e[o].color[r]||e[o].color),e[o].option&&(this._featureOption[r]=e[o].option[r]||e[o].option);this._itemGroupLocation=this._getItemGroupLocation(),this._buildBackground(),this._buildItem();for(var s=0,n=this.shapeList.length;n>s;s++)this.zr.addShape(this.shapeList[s]);this._iconShapeMap.mark&&(this._iconDisable(this._iconShapeMap.markUndo),this._iconDisable(this._iconShapeMap.markClear)),this._iconShapeMap.dataZoomReset&&0===this._zoomQueue.length&&this._iconDisable(this._iconShapeMap.dataZoomReset)}},_buildItem:function(){var e,i,o,n,a=this.option.toolbox,h=this._iconList.length,l=this._itemGroupLocation.x,d=this._itemGroupLocation.y,c=a.itemSize,p=a.itemGap,u=a.color instanceof Array?a.color:[a.color],g=this.getFont(a.textStyle);"horizontal"===a.orient?(i=this._itemGroupLocation.y/this.zr.getHeight()<.5?"bottom":"top",o=this._itemGroupLocation.x/this.zr.getWidth()<.5?"left":"right",n=this._itemGroupLocation.y/this.zr.getHeight()<.5?"top":"bottom"):i=this._itemGroupLocation.x/this.zr.getWidth()<.5?"right":"left",this._iconShapeMap={};for(var f=this,m=0;h>m;m++){switch(e={type:"icon",zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:l,y:d,width:c,height:c,iconType:this._iconList[m],lineWidth:1,strokeColor:this._featureColor[this._iconList[m]]||u[m%u.length],brushType:"stroke"},highlightStyle:{lineWidth:1,text:a.showTitle?this._featureTitle[this._iconList[m]]:void 0,textFont:g,textPosition:i,strokeColor:this._featureColor[this._iconList[m]]||u[m%u.length]},hoverable:!0,clickable:!0},this._featureIcon[this._iconList[m]]&&(e.style.image=this._featureIcon[this._iconList[m]].replace(new RegExp("^image:\\/\\/"),""),e.style.opacity=.8,e.highlightStyle.opacity=1,e.type="image"),"horizontal"===a.orient&&(0===m&&"left"===o&&(e.highlightStyle.textPosition="specific",e.highlightStyle.textAlign=o,e.highlightStyle.textBaseline=n,e.highlightStyle.textX=l,e.highlightStyle.textY="top"===n?d+c+10:d-10),m===h-1&&"right"===o&&(e.highlightStyle.textPosition="specific",e.highlightStyle.textAlign=o,e.highlightStyle.textBaseline=n,e.highlightStyle.textX=l+c,e.highlightStyle.textY="top"===n?d+c+10:d-10)),this._iconList[m]){case"mark":e.onclick=f._onMark;break;case"markUndo":e.onclick=f._onMarkUndo;break;case"markClear":e.onclick=f._onMarkClear;break;case"dataZoom":e.onclick=f._onDataZoom;break;case"dataZoomReset":e.onclick=f._onDataZoomReset;break;case"dataView":if(!this._dataView){var _=t("./dataView");this._dataView=new _(this.ecTheme,this.messageCenter,this.zr,this.option,this.myChart)}e.onclick=f._onDataView;break;case"restore":e.onclick=f._onRestore;break;case"saveAsImage":e.onclick=f._onSaveAsImage;break;default:this._iconList[m].match("Chart")?(e._name=this._iconList[m].replace("Chart",""),e.onclick=f._onMagicType):e.onclick=f._onCustomHandler}"icon"===e.type?e=new r(e):"image"===e.type&&(e=new s(e)),this.shapeList.push(e),this._iconShapeMap[this._iconList[m]]=e,"horizontal"===a.orient?l+=c+p:d+=c+p}},_buildBackground:function(){var t=this.option.toolbox,e=this.reformCssArray(this.option.toolbox.padding);this.shapeList.push(new n({zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this._itemGroupLocation.x-e[3],y:this._itemGroupLocation.y-e[0],width:this._itemGroupLocation.width+e[3]+e[1],height:this._itemGroupLocation.height+e[0]+e[2],brushType:0===t.borderWidth?"fill":"both",color:t.backgroundColor,strokeColor:t.borderColor,lineWidth:t.borderWidth}}))},_getItemGroupLocation:function(){var t=this.option.toolbox,e=this.reformCssArray(this.option.toolbox.padding),i=this._iconList.length,o=t.itemGap,s=t.itemSize,n=0,r=0;"horizontal"===t.orient?(n=(s+o)*i-o,r=s):(r=(s+o)*i-o,n=s);var a,h=this.zr.getWidth();switch(t.x){case"center":a=Math.floor((h-n)/2);break;case"left":a=e[3]+t.borderWidth;break;case"right":a=h-n-e[1]-t.borderWidth;break;default:a=t.x-0,a=isNaN(a)?0:a}var l,d=this.zr.getHeight();switch(t.y){case"top":l=e[0]+t.borderWidth;break;case"bottom":l=d-r-e[2]-t.borderWidth;break;case"center":l=Math.floor((d-r)/2);break;default:l=t.y-0,l=isNaN(l)?0:l}return{x:a,y:l,width:n,height:r}},__onmousemove:function(t){this._marking&&(this._markShape.style.xEnd=d.getX(t.event),this._markShape.style.yEnd=d.getY(t.event),this.zr.addHoverShape(this._markShape)),this._zooming&&(this._zoomShape.style.width=d.getX(t.event)-this._zoomShape.style.x,this._zoomShape.style.height=d.getY(t.event)-this._zoomShape.style.y,this.zr.addHoverShape(this._zoomShape),this.dom.style.cursor="crosshair",d.stop(t.event)),this._zoomStart&&"pointer"!=this.dom.style.cursor&&"move"!=this.dom.style.cursor&&(this.dom.style.cursor="crosshair")},__onmousedown:function(t){if(!t.target){this._zooming=!0;var e=d.getX(t.event),i=d.getY(t.event),o=this.option.dataZoom||{};return this._zoomShape=new n({zlevel:this.getZlevelBase(),z:this.getZBase(),style:{x:e,y:i,width:1,height:1,brushType:"both"},highlightStyle:{lineWidth:2,color:o.fillerColor||a.dataZoom.fillerColor,strokeColor:o.handleColor||a.dataZoom.handleColor,brushType:"both"}}),this.zr.addHoverShape(this._zoomShape),!0}},__onmouseup:function(){if(!this._zoomShape||Math.abs(this._zoomShape.style.width)<10||Math.abs(this._zoomShape.style.height)<10)return this._zooming=!1,!0;if(this._zooming&&this.component.dataZoom){this._zooming=!1;var t=this.component.dataZoom.rectZoom(this._zoomShape.style);t&&(this._zoomQueue.push({start:t.start,end:t.end,start2:t.start2,end2:t.end2}),this._iconEnable(this._iconShapeMap.dataZoomReset),this.zr.refreshNextFrame())}return!0},__onclick:function(t){if(!t.target)if(this._marking)this._marking=!1,this._markShapeList.push(this._markShape),this._iconEnable(this._iconShapeMap.markUndo),this._iconEnable(this._iconShapeMap.markClear),this.zr.addShape(this._markShape),this.zr.refreshNextFrame();else if(this._markStart){this._marking=!0;var e=d.getX(t.event),i=d.getY(t.event);this._markShape=new o({zlevel:this.getZlevelBase(),z:this.getZBase(),style:{xStart:e,yStart:i,xEnd:e,yEnd:i,lineWidth:this.query(this.option,"toolbox.feature.mark.lineStyle.width"),strokeColor:this.query(this.option,"toolbox.feature.mark.lineStyle.color"),lineType:this.query(this.option,"toolbox.feature.mark.lineStyle.type")}}),this.zr.addHoverShape(this._markShape)}},__onMark:function(t){var e=t.target;if(this._marking||this._markStart)this._resetMark(),this.zr.refreshNextFrame();else{this._resetZoom(),this.zr.modShape(e.id,{style:{strokeColor:this._enableColor}}),this.zr.refreshNextFrame(),this._markStart=!0;var i=this;setTimeout(function(){i.zr&&i.zr.on(l.EVENT.CLICK,i._onclick)&&i.zr.on(l.EVENT.MOUSEMOVE,i._onmousemove)},10)}return!0},__onMarkUndo:function(){if(this._marking)this._marking=!1;else{var t=this._markShapeList.length;if(t>=1){var e=this._markShapeList[t-1];this.zr.delShape(e.id),this.zr.refreshNextFrame(),this._markShapeList.pop(),1===t&&(this._iconDisable(this._iconShapeMap.markUndo),this._iconDisable(this._iconShapeMap.markClear))}}return!0},__onMarkClear:function(){this._marking&&(this._marking=!1);var t=this._markShapeList.length;if(t>0){for(;t--;)this.zr.delShape(this._markShapeList.pop().id);this._iconDisable(this._iconShapeMap.markUndo),this._iconDisable(this._iconShapeMap.markClear),this.zr.refreshNextFrame()}return!0},__onDataZoom:function(t){var e=t.target;if(this._zooming||this._zoomStart)this._resetZoom(),this.zr.refreshNextFrame(),this.dom.style.cursor="default";else{this._resetMark(),this.zr.modShape(e.id,{style:{strokeColor:this._enableColor}}),this.zr.refreshNextFrame(),this._zoomStart=!0;var i=this;setTimeout(function(){i.zr&&i.zr.on(l.EVENT.MOUSEDOWN,i._onmousedown)&&i.zr.on(l.EVENT.MOUSEUP,i._onmouseup)&&i.zr.on(l.EVENT.MOUSEMOVE,i._onmousemove)},10),this.dom.style.cursor="crosshair"}return!0},__onDataZoomReset:function(){return this._zooming&&(this._zooming=!1),this._zoomQueue.pop(),this._zoomQueue.length>0?this.component.dataZoom.absoluteZoom(this._zoomQueue[this._zoomQueue.length-1]):(this.component.dataZoom.rectZoom(),this._iconDisable(this._iconShapeMap.dataZoomReset),this.zr.refreshNextFrame()),!0},_resetMark:function(){this._marking=!1,this._markStart&&(this._markStart=!1,this._iconShapeMap.mark&&this.zr.modShape(this._iconShapeMap.mark.id,{style:{strokeColor:this._iconShapeMap.mark.highlightStyle.strokeColor}}),this.zr.un(l.EVENT.CLICK,this._onclick),this.zr.un(l.EVENT.MOUSEMOVE,this._onmousemove))},_resetZoom:function(){this._zooming=!1,this._zoomStart&&(this._zoomStart=!1,this._iconShapeMap.dataZoom&&this.zr.modShape(this._iconShapeMap.dataZoom.id,{style:{strokeColor:this._iconShapeMap.dataZoom.highlightStyle.strokeColor}}),this.zr.un(l.EVENT.MOUSEDOWN,this._onmousedown),this.zr.un(l.EVENT.MOUSEUP,this._onmouseup),this.zr.un(l.EVENT.MOUSEMOVE,this._onmousemove))},_iconDisable:function(t){"image"!=t.type?this.zr.modShape(t.id,{hoverable:!1,clickable:!1,style:{strokeColor:this._disableColor}}):this.zr.modShape(t.id,{hoverable:!1,clickable:!1,style:{opacity:.3}})},_iconEnable:function(t){"image"!=t.type?this.zr.modShape(t.id,{hoverable:!0,clickable:!0,style:{strokeColor:t.highlightStyle.strokeColor}}):this.zr.modShape(t.id,{hoverable:!0,clickable:!0,style:{opacity:.8}})},__onDataView:function(){return this._dataView.show(this.option),!0},__onRestore:function(){return this._resetMark(),this._resetZoom(),this.messageCenter.dispatch(a.EVENT.RESTORE,null,null,this.myChart),!0},__onSaveAsImage:function(){var t=this.option.toolbox.feature.saveAsImage,e=t.type||"png";"png"!=e&&"jpeg"!=e&&(e="png");var i;i=this.myChart.isConnected()?this.myChart.getConnectedDataURL(e):this.zr.toDataURL("image/"+e,this.option.backgroundColor&&"rgba(0,0,0,0)"===this.option.backgroundColor.replace(" ","")?"#fff":this.option.backgroundColor);var o=document.createElement("div");o.id="__echarts_download_wrap__",o.style.cssText="position:fixed;z-index:99999;display:block;top:0;left:0;background-color:rgba(33,33,33,0.5);text-align:center;width:100%;height:100%;line-height:"+document.documentElement.clientHeight+"px;";var s=document.createElement("a");s.href=i,s.setAttribute("download",(t.name?t.name:this.option.title&&(this.option.title.text||this.option.title.subtext)?this.option.title.text||this.option.title.subtext:"ECharts")+"."+e),s.innerHTML='<img style="vertical-align:middle" src="'+i+'" title="'+(window.ActiveXObject||"ActiveXObject"in window?"右键->图片另存为":t.lang="Save")+'"/>',o.appendChild(s),document.body.appendChild(o),s=null,o=null,setTimeout(function(){var t=document.getElementById("__echarts_download_wrap__");t&&(t.onclick=function(){var t=document.getElementById("__echarts_download_wrap__");t.onclick=null,t.innerHTML="",document.body.removeChild(t),t=null},t=null)},500)},__onMagicType:function(t){this._resetMark();var e=t.target._name;return this._magicType[e]||(this._magicType[e]=!0,e===a.CHART_TYPE_LINE?this._magicType[a.CHART_TYPE_BAR]=!1:e===a.CHART_TYPE_BAR&&(this._magicType[a.CHART_TYPE_LINE]=!1),e===a.CHART_TYPE_PIE?this._magicType[a.CHART_TYPE_FUNNEL]=!1:e===a.CHART_TYPE_FUNNEL&&(this._magicType[a.CHART_TYPE_PIE]=!1),e===a.CHART_TYPE_FORCE?this._magicType[a.CHART_TYPE_CHORD]=!1:e===a.CHART_TYPE_CHORD&&(this._magicType[a.CHART_TYPE_FORCE]=!1),e===c?this._magicType[p]=!1:e===p&&(this._magicType[c]=!1),this.messageCenter.dispatch(a.EVENT.MAGIC_TYPE_CHANGED,t.event,{magicType:this._magicType},this.myChart)),!0},setMagicType:function(t){this._resetMark(),this._magicType=t,!this._isSilence&&this.messageCenter.dispatch(a.EVENT.MAGIC_TYPE_CHANGED,null,{magicType:this._magicType},this.myChart)},__onCustomHandler:function(t){var e=t.target.style.iconType,i=this.option.toolbox.feature[e].onclick;"function"==typeof i&&i.call(this,this.option)},reset:function(t,e){if(e&&this.clear(),this.query(t,"toolbox.show")&&this.query(t,"toolbox.feature.magicType.show")){var i=t.toolbox.feature.magicType.type,o=i.length;for(this._magicMap={};o--;)this._magicMap[i[o]]=!0;o=t.series.length;for(var s,n;o--;)s=t.series[o].type,this._magicMap[s]&&(n=t.xAxis instanceof Array?t.xAxis[t.series[o].xAxisIndex||0]:t.xAxis,n&&"category"===(n.type||"category")&&(n.__boundaryGap=null!=n.boundaryGap?n.boundaryGap:!0),n=t.yAxis instanceof Array?t.yAxis[t.series[o].yAxisIndex||0]:t.yAxis,n&&"category"===n.type&&(n.__boundaryGap=null!=n.boundaryGap?n.boundaryGap:!0),t.series[o].__type=s,t.series[o].__itemStyle=h.clone(t.series[o].itemStyle||{})),(this._magicMap[c]||this._magicMap[p])&&(t.series[o].__stack=t.series[o].stack)}this._magicType=e?{}:this._magicType||{};for(var r in this._magicType)if(this._magicType[r]){this.option=t,this.getMagicOption();break}var a=t.dataZoom;if(a&&a.show){var l=null!=a.start&&a.start>=0&&a.start<=100?a.start:0,d=null!=a.end&&a.end>=0&&a.end<=100?a.end:100;l>d&&(l+=d,d=l-d,l-=d),this._zoomQueue=[{start:l,end:d,start2:0,end2:100}]}else this._zoomQueue=[]},getMagicOption:function(){var t,e;if(this._magicType[a.CHART_TYPE_LINE]||this._magicType[a.CHART_TYPE_BAR]){for(var i=this._magicType[a.CHART_TYPE_LINE]?!1:!0,o=0,s=this.option.series.length;s>o;o++)e=this.option.series[o].type,(e==a.CHART_TYPE_LINE||e==a.CHART_TYPE_BAR)&&(t=this.option.xAxis instanceof Array?this.option.xAxis[this.option.series[o].xAxisIndex||0]:this.option.xAxis,t&&"category"===(t.type||"category")&&(t.boundaryGap=i?!0:t.__boundaryGap),t=this.option.yAxis instanceof Array?this.option.yAxis[this.option.series[o].yAxisIndex||0]:this.option.yAxis,t&&"category"===t.type&&(t.boundaryGap=i?!0:t.__boundaryGap));this._defaultMagic(a.CHART_TYPE_LINE,a.CHART_TYPE_BAR)}if(this._defaultMagic(a.CHART_TYPE_CHORD,a.CHART_TYPE_FORCE),this._defaultMagic(a.CHART_TYPE_PIE,a.CHART_TYPE_FUNNEL),this._magicType[c]||this._magicType[p])for(var o=0,s=this.option.series.length;s>o;o++)this._magicType[c]?(this.option.series[o].stack="_ECHARTS_STACK_KENER_2014_",e=c):this._magicType[p]&&(this.option.series[o].stack=null,e=p),this._featureOption[e+"Chart"]&&h.merge(this.option.series[o],this._featureOption[e+"Chart"]||{},!0);return this.option},_defaultMagic:function(t,e){if(this._magicType[t]||this._magicType[e])for(var i=0,o=this.option.series.length;o>i;i++){var s=this.option.series[i].type;(s==t||s==e)&&(this.option.series[i].type=this._magicType[t]?t:e,this.option.series[i].itemStyle=h.clone(this.option.series[i].__itemStyle),s=this.option.series[i].type,this._featureOption[s+"Chart"]&&h.merge(this.option.series[i],this._featureOption[s+"Chart"]||{},!0))}},silence:function(t){this._isSilence=t},resize:function(){this._resetMark(),this.clear(),this.option&&this.option.toolbox&&this.option.toolbox.show&&this._buildShape(),this._dataView&&this._dataView.resize()},hideDataView:function(){this._dataView&&this._dataView.hide()},clear:function(t){this.zr&&(this.zr.delShape(this.shapeList),this.shapeList=[],t||(this.zr.delShape(this._markShapeList),this._markShapeList=[]))},onbeforDispose:function(){this._dataView&&(this._dataView.dispose(),this._dataView=null),this._markShapeList=null},refresh:function(t){t&&(this._resetMark(),this._resetZoom(),t.toolbox=this.reformOption(t.toolbox),this.option=t,this.clear(!0),t.toolbox.show&&this._buildShape(),this.hideDataView())}},h.inherits(e,i),t("../component").define("toolbox",e),e}),i("zrender/Painter",["require","./config","./tool/util","./tool/log","./loadingEffect/Base","./Layer","./shape/Image"],function(t){"use strict";function e(){return!1}function i(){}function o(t){return t?t.isBuildin?!0:"function"!=typeof t.resize||"function"!=typeof t.refresh?!1:!0:!1}var s=t("./config"),n=t("./tool/util"),r=t("./tool/log"),a=t("./loadingEffect/Base"),h=t("./Layer"),l=function(t,i){this.root=t,t.style["-webkit-tap-highlight-color"]="transparent",t.style["-webkit-user-select"]="none",t.style["user-select"]="none",t.style["-webkit-touch-callout"]="none",this.storage=i,t.innerHTML="",this._width=this._getWidth(),this._height=this._getHeight();var o=document.createElement("div");this._domRoot=o,o.style.position="relative",o.style.overflow="hidden",o.style.width=this._width+"px",o.style.height=this._height+"px",t.appendChild(o),this._layers={},this._zlevelList=[],this._layerConfig={},this._loadingEffect=new a({}),this.shapeToImage=this._createShapeToImageProcessor(),this._bgDom=document.createElement("div"),this._bgDom.style.cssText=["position:absolute;left:0px;top:0px;width:",this._width,"px;height:",this._height+"px;","-webkit-user-select:none;user-select;none;","-webkit-touch-callout:none;"].join(""),this._bgDom.setAttribute("data-zr-dom-id","bg"),o.appendChild(this._bgDom),this._bgDom.onselectstart=e;var s=new h("_zrender_hover_",this);this._layers.hover=s,o.appendChild(s.dom),s.initContext(),s.dom.onselectstart=e,s.dom.style["-webkit-user-select"]="none",s.dom.style["user-select"]="none",s.dom.style["-webkit-touch-callout"]="none",this.refreshNextFrame=null};return l.prototype.render=function(t){return this.isLoading()&&this.hideLoading(),this.refresh(t,!0),this},l.prototype.refresh=function(t,e){var i=this.storage.getShapeList(!0);this._paintList(i,e);for(var o=0;o<this._zlevelList.length;o++){var s=this._zlevelList[o],n=this._layers[s];!n.isBuildin&&n.refresh&&n.refresh()}return"function"==typeof t&&t(),this},l.prototype._preProcessLayer=function(t){t.unusedCount++,t.updateTransform()},l.prototype._postProcessLayer=function(t){t.dirty=!1,1==t.unusedCount&&t.clear()},l.prototype._paintList=function(t,e){"undefined"==typeof e&&(e=!1),this._updateLayerStatus(t);var i,o,n;this.eachBuildinLayer(this._preProcessLayer);for(var a=0,h=t.length;h>a;a++){var l=t[a];if(o!==l.zlevel&&(i&&(i.needTransform&&n.restore(),n.flush&&n.flush()),o=l.zlevel,i=this.getLayer(o),i.isBuildin||r("ZLevel "+o+" has been used by unkown layer "+i.id),n=i.ctx,i.unusedCount=0,(i.dirty||e)&&i.clear(),i.needTransform&&(n.save(),i.setTransform(n))),(i.dirty||e)&&!l.invisible&&(!l.onbrush||l.onbrush&&!l.onbrush(n,!1)))if(s.catchBrushException)try{l.brush(n,!1,this.refreshNextFrame)}catch(d){r(d,"brush error of "+l.type,l)}else l.brush(n,!1,this.refreshNextFrame);l.__dirty=!1}i&&(i.needTransform&&n.restore(),n.flush&&n.flush()),this.eachBuildinLayer(this._postProcessLayer)},l.prototype.getLayer=function(t){var e=this._layers[t];return e||(e=new h(t,this),e.isBuildin=!0,this._layerConfig[t]&&n.merge(e,this._layerConfig[t],!0),e.updateTransform(),this.insertLayer(t,e),e.initContext()),e},l.prototype.insertLayer=function(t,e){if(this._layers[t])return void r("ZLevel "+t+" has been used already");if(!o(e))return void r("Layer of zlevel "+t+" is not valid");var i=this._zlevelList.length,s=null,n=-1;if(i>0&&t>this._zlevelList[0]){for(n=0;i-1>n&&!(this._zlevelList[n]<t&&this._zlevelList[n+1]>t);n++);s=this._layers[this._zlevelList[n]]}this._zlevelList.splice(n+1,0,t);var a=s?s.dom:this._bgDom;a.nextSibling?a.parentNode.insertBefore(e.dom,a.nextSibling):a.parentNode.appendChild(e.dom),this._layers[t]=e},l.prototype.eachLayer=function(t,e){for(var i=0;i<this._zlevelList.length;i++){var o=this._zlevelList[i];t.call(e,this._layers[o],o)}},l.prototype.eachBuildinLayer=function(t,e){for(var i=0;i<this._zlevelList.length;i++){var o=this._zlevelList[i],s=this._layers[o];s.isBuildin&&t.call(e,s,o)}},l.prototype.eachOtherLayer=function(t,e){for(var i=0;i<this._zlevelList.length;i++){var o=this._zlevelList[i],s=this._layers[o];s.isBuildin||t.call(e,s,o)}},l.prototype.getLayers=function(){return this._layers},l.prototype._updateLayerStatus=function(t){var e=this._layers,i={};this.eachBuildinLayer(function(t,e){i[e]=t.elCount,t.elCount=0});for(var o=0,s=t.length;s>o;o++){var n=t[o],r=n.zlevel,a=e[r];if(a){if(a.elCount++,a.dirty)continue;a.dirty=n.__dirty}}this.eachBuildinLayer(function(t,e){i[e]!==t.elCount&&(t.dirty=!0)})},l.prototype.refreshShapes=function(t,e){for(var i=0,o=t.length;o>i;i++){var s=t[i];s.modSelf()}return this.refresh(e),this},l.prototype.setLoadingEffect=function(t){return this._loadingEffect=t,this},l.prototype.clear=function(){return this.eachBuildinLayer(this._clearLayer),this},l.prototype._clearLayer=function(t){t.clear()},l.prototype.modLayer=function(t,e){if(e){this._layerConfig[t]?n.merge(this._layerConfig[t],e,!0):this._layerConfig[t]=e;var i=this._layers[t];i&&n.merge(i,this._layerConfig[t],!0)}},l.prototype.delLayer=function(t){var e=this._layers[t];e&&(this.modLayer(t,{position:e.position,rotation:e.rotation,scale:e.scale}),e.dom.parentNode.removeChild(e.dom),delete this._layers[t],this._zlevelList.splice(n.indexOf(this._zlevelList,t),1))},l.prototype.refreshHover=function(){this.clearHover();for(var t=this.storage.getHoverShapes(!0),e=0,i=t.length;i>e;e++)this._brushHover(t[e]);var o=this._layers.hover.ctx;return o.flush&&o.flush(),this.storage.delHover(),this},l.prototype.clearHover=function(){var t=this._layers.hover;return t&&t.clear(),this},l.prototype.showLoading=function(t){return this._loadingEffect&&this._loadingEffect.stop(),t&&this.setLoadingEffect(t),this._loadingEffect.start(this),this.loading=!0,this},l.prototype.hideLoading=function(){return this._loadingEffect.stop(),this.clearHover(),this.loading=!1,this},l.prototype.isLoading=function(){return this.loading},l.prototype.resize=function(){var t=this._domRoot;t.style.display="none";var e=this._getWidth(),i=this._getHeight();if(t.style.display="",this._width!=e||i!=this._height){this._width=e,this._height=i,t.style.width=e+"px",t.style.height=i+"px";for(var o in this._layers)this._layers[o].resize(e,i);this.refresh(null,!0)}return this},l.prototype.clearLayer=function(t){var e=this._layers[t];e&&e.clear()},l.prototype.dispose=function(){this.isLoading()&&this.hideLoading(),this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},l.prototype.getDomHover=function(){return this._layers.hover.dom},l.prototype.toDataURL=function(t,e,i){if(window.G_vmlCanvasManager)return null;var o=new h("image",this);this._bgDom.appendChild(o.dom),o.initContext();var n=o.ctx;o.clearColor=e||"#fff",o.clear();var a=this;this.storage.iterShape(function(t){if(!t.invisible&&(!t.onbrush||t.onbrush&&!t.onbrush(n,!1)))if(s.catchBrushException)try{t.brush(n,!1,a.refreshNextFrame)}catch(e){r(e,"brush error of "+t.type,t)}else t.brush(n,!1,a.refreshNextFrame)},{normal:"up",update:!0});var l=o.dom.toDataURL(t,i);return n=null,this._bgDom.removeChild(o.dom),l},l.prototype.getWidth=function(){return this._width},l.prototype.getHeight=function(){return this._height},l.prototype._getWidth=function(){var t=this.root,e=t.currentStyle||document.defaultView.getComputedStyle(t);return((t.clientWidth||parseInt(e.width,10))-parseInt(e.paddingLeft,10)-parseInt(e.paddingRight,10)).toFixed(0)-0},l.prototype._getHeight=function(){var t=this.root,e=t.currentStyle||document.defaultView.getComputedStyle(t);return((t.clientHeight||parseInt(e.height,10))-parseInt(e.paddingTop,10)-parseInt(e.paddingBottom,10)).toFixed(0)-0},l.prototype._brushHover=function(t){var e=this._layers.hover.ctx;if(!t.onbrush||t.onbrush&&!t.onbrush(e,!0)){var i=this.getLayer(t.zlevel);if(i.needTransform&&(e.save(),i.setTransform(e)),s.catchBrushException)try{t.brush(e,!0,this.refreshNextFrame)}catch(o){r(o,"hoverBrush error of "+t.type,t)}else t.brush(e,!0,this.refreshNextFrame);i.needTransform&&e.restore()}},l.prototype._shapeToImage=function(e,i,o,s,n){var r=document.createElement("canvas"),a=r.getContext("2d");r.style.width=o+"px",r.style.height=s+"px",r.setAttribute("width",o*n),r.setAttribute("height",s*n),a.clearRect(0,0,o*n,s*n);var h={position:i.position,rotation:i.rotation,scale:i.scale};i.position=[0,0,0],i.rotation=0,i.scale=[1,1],i&&i.brush(a,!1);var l=t("./shape/Image"),d=new l({id:e,style:{x:0,y:0,image:r}});return null!=h.position&&(d.position=i.position=h.position),null!=h.rotation&&(d.rotation=i.rotation=h.rotation),null!=h.scale&&(d.scale=i.scale=h.scale),d},l.prototype._createShapeToImageProcessor=function(){if(window.G_vmlCanvasManager)return i;var t=this;return function(e,i,o,n){return t._shapeToImage(e,i,o,n,s.devicePixelRatio)}},l}),i("zrender/Storage",["require","./tool/util","./Group"],function(t){"use strict";function e(t,e){return t.zlevel==e.zlevel?t.z==e.z?t.__renderidx-e.__renderidx:t.z-e.z:t.zlevel-e.zlevel}var i=t("./tool/util"),o=t("./Group"),s={hover:!1,normal:"down",update:!1},n=function(){this._elements={},this._hoverElements=[],this._roots=[],this._shapeList=[],this._shapeListOffset=0};return n.prototype.iterShape=function(t,e){if(e||(e=s),e.hover)for(var i=0,o=this._hoverElements.length;o>i;i++){var n=this._hoverElements[i];if(n.updateTransform(),t(n))return this}switch(e.update&&this.updateShapeList(),e.normal){case"down":for(var o=this._shapeList.length;o--;)if(t(this._shapeList[o]))return this;break;default:for(var i=0,o=this._shapeList.length;o>i;i++)if(t(this._shapeList[i]))return this}return this},n.prototype.getHoverShapes=function(t){for(var i=[],o=0,s=this._hoverElements.length;s>o;o++){i.push(this._hoverElements[o]);var n=this._hoverElements[o].hoverConnect;if(n){var r;n=n instanceof Array?n:[n];for(var a=0,h=n.length;h>a;a++)r=n[a].id?n[a]:this.get(n[a]),r&&i.push(r)}}if(i.sort(e),t)for(var o=0,s=i.length;s>o;o++)i[o].updateTransform();return i},n.prototype.getShapeList=function(t){return t&&this.updateShapeList(),this._shapeList},n.prototype.updateShapeList=function(){this._shapeListOffset=0;for(var t=0,i=this._roots.length;i>t;t++){var o=this._roots[t];this._updateAndAddShape(o)}this._shapeList.length=this._shapeListOffset;for(var t=0,i=this._shapeList.length;i>t;t++)this._shapeList[t].__renderidx=t;this._shapeList.sort(e)},n.prototype._updateAndAddShape=function(t,e){if(!t.ignore)if(t.updateTransform(),"group"==t.type){t.clipShape&&(t.clipShape.parent=t,t.clipShape.updateTransform(),e?(e=e.slice(),e.push(t.clipShape)):e=[t.clipShape]);for(var i=0;i<t._children.length;i++){var o=t._children[i];o.__dirty=t.__dirty||o.__dirty,this._updateAndAddShape(o,e)}t.__dirty=!1}else t.__clipShapes=e,this._shapeList[this._shapeListOffset++]=t},n.prototype.mod=function(t,e){if("string"==typeof t&&(t=this._elements[t]),t&&(t.modSelf(),e))if(e.parent||e._storage||e.__clipShapes){var o={};for(var s in e)"parent"!==s&&"_storage"!==s&&"__clipShapes"!==s&&e.hasOwnProperty(s)&&(o[s]=e[s]);i.merge(t,o,!0)}else i.merge(t,e,!0);return this},n.prototype.drift=function(t,e,i){var o=this._elements[t];return o&&(o.needTransform=!0,"horizontal"===o.draggable?i=0:"vertical"===o.draggable&&(e=0),(!o.ondrift||o.ondrift&&!o.ondrift(e,i))&&o.drift(e,i)),this},n.prototype.addHover=function(t){return t.updateNeedTransform(),this._hoverElements.push(t),this},n.prototype.delHover=function(){return this._hoverElements=[],this},n.prototype.hasHoverShape=function(){return this._hoverElements.length>0},n.prototype.addRoot=function(t){this._elements[t.id]||(t instanceof o&&t.addChildrenToStorage(this),this.addToMap(t),this._roots.push(t))},n.prototype.delRoot=function(t){if("undefined"==typeof t){for(var e=0;e<this._roots.length;e++){var s=this._roots[e];s instanceof o&&s.delChildrenFromStorage(this)}return this._elements={},this._hoverElements=[],this._roots=[],this._shapeList=[],void(this._shapeListOffset=0)}if(t instanceof Array)for(var e=0,n=t.length;n>e;e++)this.delRoot(t[e]);else{var r;r="string"==typeof t?this._elements[t]:t;var a=i.indexOf(this._roots,r);a>=0&&(this.delFromMap(r.id),this._roots.splice(a,1),r instanceof o&&r.delChildrenFromStorage(this))}},n.prototype.addToMap=function(t){return t instanceof o&&(t._storage=this),t.modSelf(),this._elements[t.id]=t,this},n.prototype.get=function(t){return this._elements[t]},n.prototype.delFromMap=function(t){var e=this._elements[t];return e&&(delete this._elements[t],e instanceof o&&(e._storage=null)),this},n.prototype.dispose=function(){this._elements=this._renderList=this._roots=this._hoverElements=null},n}),i("zrender/animation/Animation",["require","./Clip","../tool/color","../tool/util","../tool/event"],function(t){"use strict";function e(t,e){return t[e]}function i(t,e,i){t[e]=i}function o(t,e,i){return(e-t)*i+t}function s(t,e,i,s,n){var r=t.length;if(1==n)for(var a=0;r>a;a++)s[a]=o(t[a],e[a],i);else for(var h=t[0].length,a=0;r>a;a++)for(var l=0;h>l;l++)s[a][l]=o(t[a][l],e[a][l],i)}function n(t){switch(typeof t){case"undefined":case"string":return!1}return"undefined"!=typeof t.length}function r(t,e,i,o,s,n,r,h,l){var d=t.length;if(1==l)for(var c=0;d>c;c++)h[c]=a(t[c],e[c],i[c],o[c],s,n,r);else for(var p=t[0].length,c=0;d>c;c++)for(var u=0;p>u;u++)h[c][u]=a(t[c][u],e[c][u],i[c][u],o[c][u],s,n,r)}function a(t,e,i,o,s,n,r){var a=.5*(i-t),h=.5*(o-e);return(2*(e-i)+a+h)*r+(-3*(e-i)-2*a-h)*n+a*s+e}function h(t){if(n(t)){var e=t.length;if(n(t[0])){for(var i=[],o=0;e>o;o++)i.push(f.call(t[o]));return i}return f.call(t)}return t}function l(t){return t[0]=Math.floor(t[0]),t[1]=Math.floor(t[1]),t[2]=Math.floor(t[2]),"rgba("+t.join(",")+")"}var d=t("./Clip"),c=t("../tool/color"),p=t("../tool/util"),u=t("../tool/event").Dispatcher,g=window.requestAnimationFrame||window.msRequestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(t){setTimeout(t,16)},f=Array.prototype.slice,m=function(t){t=t||{},this.stage=t.stage||{},this.onframe=t.onframe||function(){},this._clips=[],this._running=!1,this._time=0,u.call(this)};m.prototype={add:function(t){this._clips.push(t)},remove:function(t){var e=p.indexOf(this._clips,t);e>=0&&this._clips.splice(e,1)},_update:function(){for(var t=(new Date).getTime(),e=t-this._time,i=this._clips,o=i.length,s=[],n=[],r=0;o>r;r++){var a=i[r],h=a.step(t);h&&(s.push(h),n.push(a))}for(var r=0;o>r;)i[r]._needsRemove?(i[r]=i[o-1],i.pop(),o--):r++;o=s.length;for(var r=0;o>r;r++)n[r].fire(s[r]);this._time=t,this.onframe(e),this.dispatch("frame",e),this.stage.update&&this.stage.update()},start:function(){function t(){e._running&&(g(t),e._update())}var e=this;this._running=!0,this._time=(new Date).getTime(),g(t)},stop:function(){this._running=!1},clear:function(){this._clips=[]},animate:function(t,e){e=e||{};var i=new _(t,e.loop,e.getter,e.setter);return i.animation=this,i},constructor:m},p.merge(m.prototype,u.prototype,!0);var _=function(t,o,s,n){this._tracks={},this._target=t,this._loop=o||!1,this._getter=s||e,this._setter=n||i,this._clipCount=0,this._delay=0,this._doneList=[],this._onframeList=[],this._clipList=[]};return _.prototype={when:function(t,e){for(var i in e)this._tracks[i]||(this._tracks[i]=[],0!==t&&this._tracks[i].push({time:0,value:h(this._getter(this._target,i))})),this._tracks[i].push({time:parseInt(t,10),value:e[i]});return this},during:function(t){return this._onframeList.push(t),this},start:function(t){var e=this,i=this._setter,h=this._getter,p="spline"===t,u=function(){if(e._clipCount--,0===e._clipCount){e._tracks={};for(var t=e._doneList.length,i=0;t>i;i++)e._doneList[i].call(e)}},g=function(g,f){var m=g.length;if(m){var _=g[0].value,y=n(_),x=!1,v=y&&n(_[0])?2:1;g.sort(function(t,e){return t.time-e.time});var b;if(m){b=g[m-1].time;for(var S=[],T=[],z=0;m>z;z++){S.push(g[z].time/b);var C=g[z].value;"string"==typeof C&&(C=c.toArray(C),0===C.length&&(C[0]=C[1]=C[2]=0,C[3]=1),x=!0),T.push(C)}var w,z,L,E,M,A,k,O=0,I=0;if(x)var R=[0,0,0,0];var P=function(t,n){if(I>n){for(w=Math.min(O+1,m-1),z=w;z>=0&&!(S[z]<=n);z--);z=Math.min(z,m-2)}else{for(z=O;m>z&&!(S[z]>n);z++);z=Math.min(z-1,m-2)
}O=z,I=n;var d=S[z+1]-S[z];if(0!==d){if(L=(n-S[z])/d,p)if(M=T[z],E=T[0===z?z:z-1],A=T[z>m-2?m-1:z+1],k=T[z>m-3?m-1:z+2],y)r(E,M,A,k,L,L*L,L*L*L,h(t,f),v);else{var c;x?(c=r(E,M,A,k,L,L*L,L*L*L,R,1),c=l(R)):c=a(E,M,A,k,L,L*L,L*L*L),i(t,f,c)}else if(y)s(T[z],T[z+1],L,h(t,f),v);else{var c;x?(s(T[z],T[z+1],L,R,1),c=l(R)):c=o(T[z],T[z+1],L),i(t,f,c)}for(z=0;z<e._onframeList.length;z++)e._onframeList[z](t,n)}},D=new d({target:e._target,life:b,loop:e._loop,delay:e._delay,onframe:P,ondestroy:u});t&&"spline"!==t&&(D.easing=t),e._clipList.push(D),e._clipCount++,e.animation.add(D)}}};for(var f in this._tracks)g(this._tracks[f],f);return this},stop:function(){for(var t=0;t<this._clipList.length;t++){var e=this._clipList[t];this.animation.remove(e)}this._clipList=[]},delay:function(t){return this._delay=t,this},done:function(t){return t&&this._doneList.push(t),this}},m}),i("zrender/Handler",["require","./config","./tool/env","./tool/event","./tool/util","./tool/vector","./tool/matrix","./mixin/Eventful"],function(t){"use strict";function e(t,e){return function(i){return t.call(e,i)}}function i(t,e){return function(i,o,s){return t.call(e,i,o,s)}}function o(t){for(var i=u.length;i--;){var o=u[i];t["_"+o+"Handler"]=e(g[o],t)}}function s(t,e,i){if(this._draggingTarget&&this._draggingTarget.id==t.id||t.isSilent())return!1;var o=this._event;if(t.isCover(e,i)){t.hoverable&&this.storage.addHover(t);for(var s=t.parent;s;){if(s.clipShape&&!s.clipShape.isCover(this._mouseX,this._mouseY))return!1;s=s.parent}return this._lastHover!=t&&(this._processOutShape(o),this._processDragLeave(o),this._lastHover=t,this._processDragEnter(o)),this._processOverShape(o),this._processDragOver(o),this._hasfound=1,!0}return!1}var n=t("./config"),r=t("./tool/env"),a=t("./tool/event"),h=t("./tool/util"),l=t("./tool/vector"),d=t("./tool/matrix"),c=n.EVENT,p=t("./mixin/Eventful"),u=["resize","click","dblclick","mousewheel","mousemove","mouseout","mouseup","mousedown","touchstart","touchend","touchmove"],g={resize:function(t){t=t||window.event,this._lastHover=null,this._isMouseDown=0,this.dispatch(c.RESIZE,t)},click:function(t){t=this._zrenderEventFixed(t);var e=this._lastHover;(e&&e.clickable||!e)&&this._clickThreshold<5&&this._dispatchAgency(e,c.CLICK,t),this._mousemoveHandler(t)},dblclick:function(t){t=t||window.event,t=this._zrenderEventFixed(t);var e=this._lastHover;(e&&e.clickable||!e)&&this._clickThreshold<5&&this._dispatchAgency(e,c.DBLCLICK,t),this._mousemoveHandler(t)},mousewheel:function(t){t=this._zrenderEventFixed(t);var e=t.wheelDelta||-t.detail,i=e>0?1.1:1/1.1,o=!1,s=this._mouseX,n=this._mouseY;this.painter.eachBuildinLayer(function(e){var r=e.position;if(e.zoomable){e.__zoom=e.__zoom||1;var h=e.__zoom;h*=i,h=Math.max(Math.min(e.maxZoom,h),e.minZoom),i=h/e.__zoom,e.__zoom=h,r[0]-=(s-r[0])*(i-1),r[1]-=(n-r[1])*(i-1),e.scale[0]*=i,e.scale[1]*=i,e.dirty=!0,o=!0,a.stop(t)}}),o&&this.painter.refresh(),this._dispatchAgency(this._lastHover,c.MOUSEWHEEL,t),this._mousemoveHandler(t)},mousemove:function(t){if(!this.painter.isLoading()){t=this._zrenderEventFixed(t),this._lastX=this._mouseX,this._lastY=this._mouseY,this._mouseX=a.getX(t),this._mouseY=a.getY(t);var e=this._mouseX-this._lastX,i=this._mouseY-this._lastY;this._processDragStart(t),this._hasfound=0,this._event=t,this._iterateAndFindHover(),this._hasfound||((!this._draggingTarget||this._lastHover&&this._lastHover!=this._draggingTarget)&&(this._processOutShape(t),this._processDragLeave(t)),this._lastHover=null,this.storage.delHover(),this.painter.clearHover());var o="default";if(this._draggingTarget)this.storage.drift(this._draggingTarget.id,e,i),this._draggingTarget.modSelf(),this.storage.addHover(this._draggingTarget),this._clickThreshold++;else if(this._isMouseDown){var s=!1;this.painter.eachBuildinLayer(function(t){t.panable&&(o="move",t.position[0]+=e,t.position[1]+=i,s=!0,t.dirty=!0)}),s&&this.painter.refresh()}this._draggingTarget||this._hasfound&&this._lastHover.draggable?o="move":this._hasfound&&this._lastHover.clickable&&(o="pointer"),this.root.style.cursor=o,this._dispatchAgency(this._lastHover,c.MOUSEMOVE,t),(this._draggingTarget||this._hasfound||this.storage.hasHoverShape())&&this.painter.refreshHover()}},mouseout:function(t){t=this._zrenderEventFixed(t);var e=t.toElement||t.relatedTarget;if(e!=this.root)for(;e&&9!=e.nodeType;){if(e==this.root)return void this._mousemoveHandler(t);e=e.parentNode}t.zrenderX=this._lastX,t.zrenderY=this._lastY,this.root.style.cursor="default",this._isMouseDown=0,this._processOutShape(t),this._processDrop(t),this._processDragEnd(t),this.painter.isLoading()||this.painter.refreshHover(),this.dispatch(c.GLOBALOUT,t)},mousedown:function(t){return this._clickThreshold=0,2==this._lastDownButton?(this._lastDownButton=t.button,void(this._mouseDownTarget=null)):(this._lastMouseDownMoment=new Date,t=this._zrenderEventFixed(t),this._isMouseDown=1,this._mouseDownTarget=this._lastHover,this._dispatchAgency(this._lastHover,c.MOUSEDOWN,t),void(this._lastDownButton=t.button))},mouseup:function(t){t=this._zrenderEventFixed(t),this.root.style.cursor="default",this._isMouseDown=0,this._mouseDownTarget=null,this._dispatchAgency(this._lastHover,c.MOUSEUP,t),this._processDrop(t),this._processDragEnd(t)},touchstart:function(t){t=this._zrenderEventFixed(t,!0),this._lastTouchMoment=new Date,this._mobileFindFixed(t),this._mousedownHandler(t)},touchmove:function(t){t=this._zrenderEventFixed(t,!0),this._mousemoveHandler(t),this._isDragging&&a.stop(t)},touchend:function(t){t=this._zrenderEventFixed(t,!0),this._mouseupHandler(t);var e=new Date;e-this._lastTouchMoment<c.touchClickDelay&&(this._mobileFindFixed(t),this._clickHandler(t),e-this._lastClickMoment<c.touchClickDelay/2&&(this._dblclickHandler(t),this._lastHover&&this._lastHover.clickable&&a.stop(t)),this._lastClickMoment=e),this.painter.clearHover()}},f=function(t,e,n){p.call(this),this.root=t,this.storage=e,this.painter=n,this._lastX=this._lastY=this._mouseX=this._mouseY=0,this._findHover=i(s,this),this._domHover=n.getDomHover(),o(this),window.addEventListener?(window.addEventListener("resize",this._resizeHandler),r.os.tablet||r.os.phone?(t.addEventListener("touchstart",this._touchstartHandler),t.addEventListener("touchmove",this._touchmoveHandler),t.addEventListener("touchend",this._touchendHandler)):(t.addEventListener("click",this._clickHandler),t.addEventListener("dblclick",this._dblclickHandler),t.addEventListener("mousewheel",this._mousewheelHandler),t.addEventListener("mousemove",this._mousemoveHandler),t.addEventListener("mousedown",this._mousedownHandler),t.addEventListener("mouseup",this._mouseupHandler)),t.addEventListener("DOMMouseScroll",this._mousewheelHandler),t.addEventListener("mouseout",this._mouseoutHandler)):(window.attachEvent("onresize",this._resizeHandler),t.attachEvent("onclick",this._clickHandler),t.ondblclick=this._dblclickHandler,t.attachEvent("onmousewheel",this._mousewheelHandler),t.attachEvent("onmousemove",this._mousemoveHandler),t.attachEvent("onmouseout",this._mouseoutHandler),t.attachEvent("onmousedown",this._mousedownHandler),t.attachEvent("onmouseup",this._mouseupHandler))};f.prototype.on=function(t,e,i){return this.bind(t,e,i),this},f.prototype.un=function(t,e){return this.unbind(t,e),this},f.prototype.trigger=function(t,e){switch(t){case c.RESIZE:case c.CLICK:case c.DBLCLICK:case c.MOUSEWHEEL:case c.MOUSEMOVE:case c.MOUSEDOWN:case c.MOUSEUP:case c.MOUSEOUT:this["_"+t+"Handler"](e)}},f.prototype.dispose=function(){var t=this.root;window.removeEventListener?(window.removeEventListener("resize",this._resizeHandler),r.os.tablet||r.os.phone?(t.removeEventListener("touchstart",this._touchstartHandler),t.removeEventListener("touchmove",this._touchmoveHandler),t.removeEventListener("touchend",this._touchendHandler)):(t.removeEventListener("click",this._clickHandler),t.removeEventListener("dblclick",this._dblclickHandler),t.removeEventListener("mousewheel",this._mousewheelHandler),t.removeEventListener("mousemove",this._mousemoveHandler),t.removeEventListener("mousedown",this._mousedownHandler),t.removeEventListener("mouseup",this._mouseupHandler)),t.removeEventListener("DOMMouseScroll",this._mousewheelHandler),t.removeEventListener("mouseout",this._mouseoutHandler)):(window.detachEvent("onresize",this._resizeHandler),t.detachEvent("onclick",this._clickHandler),t.detachEvent("dblclick",this._dblclickHandler),t.detachEvent("onmousewheel",this._mousewheelHandler),t.detachEvent("onmousemove",this._mousemoveHandler),t.detachEvent("onmouseout",this._mouseoutHandler),t.detachEvent("onmousedown",this._mousedownHandler),t.detachEvent("onmouseup",this._mouseupHandler)),this.root=this._domHover=this.storage=this.painter=null,this.un()},f.prototype._processDragStart=function(t){var e=this._lastHover;if(this._isMouseDown&&e&&e.draggable&&!this._draggingTarget&&this._mouseDownTarget==e){if(e.dragEnableTime&&new Date-this._lastMouseDownMoment<e.dragEnableTime)return;var i=e;this._draggingTarget=i,this._isDragging=1,i.invisible=!0,this.storage.mod(i.id),this._dispatchAgency(i,c.DRAGSTART,t),this.painter.refresh()}},f.prototype._processDragEnter=function(t){this._draggingTarget&&this._dispatchAgency(this._lastHover,c.DRAGENTER,t,this._draggingTarget)},f.prototype._processDragOver=function(t){this._draggingTarget&&this._dispatchAgency(this._lastHover,c.DRAGOVER,t,this._draggingTarget)},f.prototype._processDragLeave=function(t){this._draggingTarget&&this._dispatchAgency(this._lastHover,c.DRAGLEAVE,t,this._draggingTarget)},f.prototype._processDrop=function(t){this._draggingTarget&&(this._draggingTarget.invisible=!1,this.storage.mod(this._draggingTarget.id),this.painter.refresh(),this._dispatchAgency(this._lastHover,c.DROP,t,this._draggingTarget))},f.prototype._processDragEnd=function(t){this._draggingTarget&&(this._dispatchAgency(this._draggingTarget,c.DRAGEND,t),this._lastHover=null),this._isDragging=0,this._draggingTarget=null},f.prototype._processOverShape=function(t){this._dispatchAgency(this._lastHover,c.MOUSEOVER,t)},f.prototype._processOutShape=function(t){this._dispatchAgency(this._lastHover,c.MOUSEOUT,t)},f.prototype._dispatchAgency=function(t,e,i,o){var s="on"+e,n={type:e,event:i,target:t,cancelBubble:!1},r=t;for(o&&(n.dragged=o);r&&(r[s]&&(n.cancelBubble=r[s](n)),r.dispatch(e,n),r=r.parent,!n.cancelBubble););if(t)n.cancelBubble||this.dispatch(e,n);else if(!o){var a={type:e,event:i};this.dispatch(e,a),this.painter.eachOtherLayer(function(t){"function"==typeof t[s]&&t[s](a),t.dispatch&&t.dispatch(e,a)})}},f.prototype._iterateAndFindHover=function(){var t=d.create();return function(){for(var e,i,o=this.storage.getShapeList(),s=[0,0],n=o.length-1;n>=0;n--){var r=o[n];if(e!==r.zlevel&&(i=this.painter.getLayer(r.zlevel,i),s[0]=this._mouseX,s[1]=this._mouseY,i.needTransform&&(d.invert(t,i.transform),l.applyTransform(s,s,t))),this._findHover(r,s[0],s[1]))break}}}();var m=[{x:10},{x:-20},{x:10,y:10},{y:-20}];return f.prototype._mobileFindFixed=function(t){this._lastHover=null,this._mouseX=t.zrenderX,this._mouseY=t.zrenderY,this._event=t,this._iterateAndFindHover();for(var e=0;!this._lastHover&&e<m.length;e++){var i=m[e];i.x&&(this._mouseX+=i.x),i.y&&(this._mouseY+=i.y),this._iterateAndFindHover()}this._lastHover&&(t.zrenderX=this._mouseX,t.zrenderY=this._mouseY)},f.prototype._zrenderEventFixed=function(t,e){if(t.zrenderFixed)return t;if(e){var i="touchend"!=t.type?t.targetTouches[0]:t.changedTouches[0];if(i){var o=this.painter._domRoot.getBoundingClientRect();t.zrenderX=i.clientX-o.left,t.zrenderY=i.clientY-o.top}}else{t=t||window.event;var s=t.toElement||t.relatedTarget||t.srcElement||t.target;s&&s!=this._domHover&&(t.zrenderX=("undefined"!=typeof t.offsetX?t.offsetX:t.layerX)+s.offsetLeft,t.zrenderY=("undefined"!=typeof t.offsetY?t.offsetY:t.layerY)+s.offsetTop)}return t.zrenderFixed=1,t},h.merge(f.prototype,p.prototype,!0),f}),i("echarts/component/tooltip",["require","./base","../util/shape/Cross","zrender/shape/Line","zrender/shape/Rectangle","../config","../util/ecData","zrender/config","zrender/tool/event","zrender/tool/area","zrender/tool/color","zrender/tool/util","zrender/shape/Base","../component"],function(t){function e(t,e,n,r,a){i.call(this,t,e,n,r,a),this.dom=a.dom;var h=this;h._onmousemove=function(t){return h.__onmousemove(t)},h._onglobalout=function(t){return h.__onglobalout(t)},this.zr.on(l.EVENT.MOUSEMOVE,h._onmousemove),this.zr.on(l.EVENT.GLOBALOUT,h._onglobalout),h._hide=function(t){return h.__hide(t)},h._tryShow=function(t){return h.__tryShow(t)},h._refixed=function(t){return h.__refixed(t)},h._setContent=function(t,e){return h.__setContent(t,e)},this._tDom=this._tDom||document.createElement("div"),this._tDom.onselectstart=function(){return!1},this._tDom.onmouseover=function(){h._mousein=!0},this._tDom.onmouseout=function(){h._mousein=!1},this._tDom.className="echarts-tooltip",this._tDom.style.position="absolute",this.hasAppend=!1,this._axisLineShape&&this.zr.delShape(this._axisLineShape.id),this._axisLineShape=new s({zlevel:this.getZlevelBase(),z:this.getZBase(),invisible:!0,hoverable:!1}),this.shapeList.push(this._axisLineShape),this.zr.addShape(this._axisLineShape),this._axisShadowShape&&this.zr.delShape(this._axisShadowShape.id),this._axisShadowShape=new s({zlevel:this.getZlevelBase(),z:1,invisible:!0,hoverable:!1}),this.shapeList.push(this._axisShadowShape),this.zr.addShape(this._axisShadowShape),this._axisCrossShape&&this.zr.delShape(this._axisCrossShape.id),this._axisCrossShape=new o({zlevel:this.getZlevelBase(),z:this.getZBase(),invisible:!0,hoverable:!1}),this.shapeList.push(this._axisCrossShape),this.zr.addShape(this._axisCrossShape),this.showing=!1,this.refresh(r)}var i=t("./base"),o=t("../util/shape/Cross"),s=t("zrender/shape/Line"),n=t("zrender/shape/Rectangle"),r=new n({}),a=t("../config");a.tooltip={zlevel:1,z:8,show:!0,showContent:!0,trigger:"item",islandFormatter:"{a} <br/>{b} : {c}",showDelay:20,hideDelay:100,transitionDuration:.4,enterable:!1,backgroundColor:"rgba(0,0,0,0.7)",borderColor:"#333",borderRadius:4,borderWidth:0,padding:5,axisPointer:{type:"line",lineStyle:{color:"#48b",width:2,type:"solid"},crossStyle:{color:"#1e90ff",width:1,type:"dashed"},shadowStyle:{color:"rgba(150,150,150,0.3)",width:"auto",type:"default"}},textStyle:{color:"#fff"}};var h=t("../util/ecData"),l=t("zrender/config"),d=t("zrender/tool/event"),c=t("zrender/tool/area"),p=t("zrender/tool/color"),u=t("zrender/tool/util"),g=t("zrender/shape/Base");return e.prototype={type:a.COMPONENT_TYPE_TOOLTIP,_gCssText:"position:absolute;display:block;border-style:solid;white-space:nowrap;",_style:function(t){if(!t)return"";var e=[];if(t.transitionDuration){var i="left "+t.transitionDuration+"s,top "+t.transitionDuration+"s";e.push("transition:"+i),e.push("-moz-transition:"+i),e.push("-webkit-transition:"+i),e.push("-o-transition:"+i)}t.backgroundColor&&(e.push("background-Color:"+p.toHex(t.backgroundColor)),e.push("filter:alpha(opacity=70)"),e.push("background-Color:"+t.backgroundColor)),null!=t.borderWidth&&e.push("border-width:"+t.borderWidth+"px"),null!=t.borderColor&&e.push("border-color:"+t.borderColor),null!=t.borderRadius&&(e.push("border-radius:"+t.borderRadius+"px"),e.push("-moz-border-radius:"+t.borderRadius+"px"),e.push("-webkit-border-radius:"+t.borderRadius+"px"),e.push("-o-border-radius:"+t.borderRadius+"px"));var o=t.textStyle;o&&(o.color&&e.push("color:"+o.color),o.decoration&&e.push("text-decoration:"+o.decoration),o.align&&e.push("text-align:"+o.align),o.fontFamily&&e.push("font-family:"+o.fontFamily),o.fontSize&&e.push("font-size:"+o.fontSize+"px"),o.fontSize&&e.push("line-height:"+Math.round(3*o.fontSize/2)+"px"),o.fontStyle&&e.push("font-style:"+o.fontStyle),o.fontWeight&&e.push("font-weight:"+o.fontWeight));var s=t.padding;return null!=s&&(s=this.reformCssArray(s),e.push("padding:"+s[0]+"px "+s[1]+"px "+s[2]+"px "+s[3]+"px")),e=e.join(";")+";"},__hide:function(){this._lastDataIndex=-1,this._lastSeriesIndex=-1,this._lastItemTriggerId=-1,this._tDom&&(this._tDom.style.display="none");var t=!1;this._axisLineShape.invisible||(this._axisLineShape.invisible=!0,this.zr.modShape(this._axisLineShape.id),t=!0),this._axisShadowShape.invisible||(this._axisShadowShape.invisible=!0,this.zr.modShape(this._axisShadowShape.id),t=!0),this._axisCrossShape.invisible||(this._axisCrossShape.invisible=!0,this.zr.modShape(this._axisCrossShape.id),t=!0),this._lastTipShape&&this._lastTipShape.tipShape.length>0&&(this.zr.delShape(this._lastTipShape.tipShape),this._lastTipShape=!1,this.shapeList.length=2),t&&this.zr.refreshNextFrame(),this.showing=!1},_show:function(t,e,i,o){var s=this._tDom.offsetHeight,n=this._tDom.offsetWidth;t&&("function"==typeof t&&(t=t([e,i])),t instanceof Array&&(e=t[0],i=t[1])),e+n>this._zrWidth&&(e-=n+40),i+s>this._zrHeight&&(i-=s-20),20>i&&(i=0),this._tDom.style.cssText=this._gCssText+this._defaultCssText+(o?o:"")+"left:"+e+"px;top:"+i+"px;",(10>s||10>n)&&setTimeout(this._refixed,20),this.showing=!0},__refixed:function(){if(this._tDom){var t="",e=this._tDom.offsetHeight,i=this._tDom.offsetWidth;this._tDom.offsetLeft+i>this._zrWidth&&(t+="left:"+(this._zrWidth-i-20)+"px;"),this._tDom.offsetTop+e>this._zrHeight&&(t+="top:"+(this._zrHeight-e-10)+"px;"),""!==t&&(this._tDom.style.cssText+=t)}},__tryShow:function(){var t,e;if(this._curTarget){if("island"===this._curTarget._type&&this.option.tooltip.show)return void this._showItemTrigger();var i=h.get(this._curTarget,"series"),o=h.get(this._curTarget,"data");t=this.deepQuery([o,i,this.option],"tooltip.show"),null!=i&&null!=o&&t?(e=this.deepQuery([o,i,this.option],"tooltip.trigger"),"axis"===e?this._showAxisTrigger(i.xAxisIndex,i.yAxisIndex,h.get(this._curTarget,"dataIndex")):this._showItemTrigger()):(clearTimeout(this._hidingTicket),clearTimeout(this._showingTicket),this._hidingTicket=setTimeout(this._hide,this._hideDelay))}else this._findPolarTrigger()||this._findAxisTrigger()},_findAxisTrigger:function(){if(!this.component.xAxis||!this.component.yAxis)return void(this._hidingTicket=setTimeout(this._hide,this._hideDelay));for(var t,e,i=this.option.series,o=0,s=i.length;s>o;o++)if("axis"===this.deepQuery([i[o],this.option],"tooltip.trigger"))return t=i[o].xAxisIndex||0,e=i[o].yAxisIndex||0,this.component.xAxis.getAxis(t)&&this.component.xAxis.getAxis(t).type===a.COMPONENT_TYPE_AXIS_CATEGORY?void this._showAxisTrigger(t,e,this._getNearestDataIndex("x",this.component.xAxis.getAxis(t))):this.component.yAxis.getAxis(e)&&this.component.yAxis.getAxis(e).type===a.COMPONENT_TYPE_AXIS_CATEGORY?void this._showAxisTrigger(t,e,this._getNearestDataIndex("y",this.component.yAxis.getAxis(e))):void this._showAxisTrigger(t,e,-1);"cross"===this.option.tooltip.axisPointer.type&&this._showAxisTrigger(-1,-1,-1)},_findPolarTrigger:function(){if(!this.component.polar)return!1;var t,e=d.getX(this._event),i=d.getY(this._event),o=this.component.polar.getNearestIndex([e,i]);return o?(t=o.valueIndex,o=o.polarIndex):o=-1,-1!=o?this._showPolarTrigger(o,t):!1},_getNearestDataIndex:function(t,e){var i=-1,o=d.getX(this._event),s=d.getY(this._event);if("x"===t){for(var n,r,a=this.component.grid.getXend(),h=e.getCoordByIndex(i);a>h&&(r=h,o>=h);)n=h,h=e.getCoordByIndex(++i);return 0>=i?i=0:r-o>=o-n?i-=1:null==e.getNameByIndex(i)&&(i-=1),i}for(var l,c,p=this.component.grid.getY(),h=e.getCoordByIndex(i);h>p&&(l=h,h>=s);)c=h,h=e.getCoordByIndex(++i);return 0>=i?i=0:s-l>=c-s?i-=1:null==e.getNameByIndex(i)&&(i-=1),i},_showAxisTrigger:function(t,e,i){if(!this._event.connectTrigger&&this.messageCenter.dispatch(a.EVENT.TOOLTIP_IN_GRID,this._event,null,this.myChart),null==this.component.xAxis||null==this.component.yAxis||null==t||null==e)return clearTimeout(this._hidingTicket),clearTimeout(this._showingTicket),void(this._hidingTicket=setTimeout(this._hide,this._hideDelay));var o,s,n,r,h=this.option.series,l=[],c=[],p="";if("axis"===this.option.tooltip.trigger){if(!this.option.tooltip.show)return;s=this.option.tooltip.formatter,n=this.option.tooltip.position}var u,g,f=-1!=t&&this.component.xAxis.getAxis(t).type===a.COMPONENT_TYPE_AXIS_CATEGORY?"xAxis":-1!=e&&this.component.yAxis.getAxis(e).type===a.COMPONENT_TYPE_AXIS_CATEGORY?"yAxis":!1;if(f){var m="xAxis"==f?t:e;o=this.component[f].getAxis(m);for(var _=0,y=h.length;y>_;_++)this._isSelected(h[_].name)&&h[_][f+"Index"]===m&&"axis"===this.deepQuery([h[_],this.option],"tooltip.trigger")&&(r=this.query(h[_],"tooltip.showContent")||r,s=this.query(h[_],"tooltip.formatter")||s,n=this.query(h[_],"tooltip.position")||n,p+=this._style(this.query(h[_],"tooltip")),null!=h[_].stack&&"xAxis"==f?(l.unshift(h[_]),c.unshift(_)):(l.push(h[_]),c.push(_)));this.messageCenter.dispatch(a.EVENT.TOOLTIP_HOVER,this._event,{seriesIndex:c,dataIndex:i},this.myChart);var x;"xAxis"==f?(u=this.subPixelOptimize(o.getCoordByIndex(i),this._axisLineWidth),g=d.getY(this._event),x=[u,this.component.grid.getY(),u,this.component.grid.getYend()]):(u=d.getX(this._event),g=this.subPixelOptimize(o.getCoordByIndex(i),this._axisLineWidth),x=[this.component.grid.getX(),g,this.component.grid.getXend(),g]),this._styleAxisPointer(l,x[0],x[1],x[2],x[3],o.getGap(),u,g)}else u=d.getX(this._event),g=d.getY(this._event),this._styleAxisPointer(h,this.component.grid.getX(),g,this.component.grid.getXend(),g,0,u,g),i>=0?this._showItemTrigger(!0):(clearTimeout(this._hidingTicket),clearTimeout(this._showingTicket),this._tDom.style.display="none");if(l.length>0){if(this._lastItemTriggerId=-1,this._lastDataIndex!=i||this._lastSeriesIndex!=c[0]){this._lastDataIndex=i,this._lastSeriesIndex=c[0];var v,b;if("function"==typeof s){for(var S=[],_=0,y=l.length;y>_;_++)v=l[_].data[i],b=this.getDataFromOption(v,"-"),S.push({seriesIndex:c[_],seriesName:l[_].name||"",series:l[_],dataIndex:i,data:v,name:o.getNameByIndex(i),value:b,0:l[_].name||"",1:o.getNameByIndex(i),2:b,3:v});this._curTicket="axis:"+i,this._tDom.innerHTML=s.call(this.myChart,S,this._curTicket,this._setContent)}else if("string"==typeof s){this._curTicket=0/0,s=s.replace("{a}","{a0}").replace("{b}","{b0}").replace("{c}","{c0}");for(var _=0,y=l.length;y>_;_++)s=s.replace("{a"+_+"}",this._encodeHTML(l[_].name||"")),s=s.replace("{b"+_+"}",this._encodeHTML(o.getNameByIndex(i))),v=l[_].data[i],v=this.getDataFromOption(v,"-"),s=s.replace("{c"+_+"}",v instanceof Array?v:this.numAddCommas(v));this._tDom.innerHTML=s}else{this._curTicket=0/0,s=this._encodeHTML(o.getNameByIndex(i));for(var _=0,y=l.length;y>_;_++)s+="<br/>"+this._encodeHTML(l[_].name||"")+" : ",v=l[_].data[i],v=this.getDataFromOption(v,"-"),s+=v instanceof Array?v:this.numAddCommas(v);this._tDom.innerHTML=s}}if(r===!1||!this.option.tooltip.showContent)return;this.hasAppend||(this._tDom.style.left=this._zrWidth/2+"px",this._tDom.style.top=this._zrHeight/2+"px",this.dom.firstChild.appendChild(this._tDom),this.hasAppend=!0),this._show(n,u+10,g+10,p)}},_showPolarTrigger:function(t,e){if(null==this.component.polar||null==t||null==e||0>e)return!1;var i,o,s,n=this.option.series,r=[],a=[],h="";if("axis"===this.option.tooltip.trigger){if(!this.option.tooltip.show)return!1;i=this.option.tooltip.formatter,o=this.option.tooltip.position}for(var l=this.option.polar[t].indicator[e].text,c=0,p=n.length;p>c;c++)this._isSelected(n[c].name)&&n[c].polarIndex===t&&"axis"===this.deepQuery([n[c],this.option],"tooltip.trigger")&&(s=this.query(n[c],"tooltip.showContent")||s,i=this.query(n[c],"tooltip.formatter")||i,o=this.query(n[c],"tooltip.position")||o,h+=this._style(this.query(n[c],"tooltip")),r.push(n[c]),a.push(c));if(r.length>0){for(var u,g,f,m=[],c=0,p=r.length;p>c;c++){u=r[c].data;for(var _=0,y=u.length;y>_;_++)g=u[_],this._isSelected(g.name)&&(g=null!=g?g:{name:"",value:{dataIndex:"-"}},f=this.getDataFromOption(g.value[e]),m.push({seriesIndex:a[c],seriesName:r[c].name||"",series:r[c],dataIndex:e,data:g,name:g.name,indicator:l,value:f,0:r[c].name||"",1:g.name,2:f,3:l}))}if(m.length<=0)return;if(this._lastItemTriggerId=-1,this._lastDataIndex!=e||this._lastSeriesIndex!=a[0])if(this._lastDataIndex=e,this._lastSeriesIndex=a[0],"function"==typeof i)this._curTicket="axis:"+e,this._tDom.innerHTML=i.call(this.myChart,m,this._curTicket,this._setContent);else if("string"==typeof i){i=i.replace("{a}","{a0}").replace("{b}","{b0}").replace("{c}","{c0}").replace("{d}","{d0}");for(var c=0,p=m.length;p>c;c++)i=i.replace("{a"+c+"}",this._encodeHTML(m[c].seriesName)),i=i.replace("{b"+c+"}",this._encodeHTML(m[c].name)),i=i.replace("{c"+c+"}",this.numAddCommas(m[c].value)),i=i.replace("{d"+c+"}",this._encodeHTML(m[c].indicator));this._tDom.innerHTML=i}else{i=this._encodeHTML(m[0].name)+"<br/>"+this._encodeHTML(m[0].indicator)+" : "+this.numAddCommas(m[0].value);for(var c=1,p=m.length;p>c;c++)i+="<br/>"+this._encodeHTML(m[c].name)+"<br/>",i+=this._encodeHTML(m[c].indicator)+" : "+this.numAddCommas(m[c].value);this._tDom.innerHTML=i}if(s===!1||!this.option.tooltip.showContent)return;return this.hasAppend||(this._tDom.style.left=this._zrWidth/2+"px",this._tDom.style.top=this._zrHeight/2+"px",this.dom.firstChild.appendChild(this._tDom),this.hasAppend=!0),this._show(o,d.getX(this._event),d.getY(this._event),h),!0}},_showItemTrigger:function(t){if(this._curTarget){var e,i,o,s=h.get(this._curTarget,"series"),n=h.get(this._curTarget,"seriesIndex"),r=h.get(this._curTarget,"data"),l=h.get(this._curTarget,"dataIndex"),c=h.get(this._curTarget,"name"),p=h.get(this._curTarget,"value"),u=h.get(this._curTarget,"special"),g=h.get(this._curTarget,"special2"),f=[r,s,this.option],m="";if("island"!=this._curTarget._type){var _=t?"axis":"item";this.option.tooltip.trigger===_&&(e=this.option.tooltip.formatter,i=this.option.tooltip.position),this.query(s,"tooltip.trigger")===_&&(o=this.query(s,"tooltip.showContent")||o,e=this.query(s,"tooltip.formatter")||e,i=this.query(s,"tooltip.position")||i,m+=this._style(this.query(s,"tooltip"))),o=this.query(r,"tooltip.showContent")||o,e=this.query(r,"tooltip.formatter")||e,i=this.query(r,"tooltip.position")||i,m+=this._style(this.query(r,"tooltip"))}else this._lastItemTriggerId=0/0,o=this.deepQuery(f,"tooltip.showContent"),e=this.deepQuery(f,"tooltip.islandFormatter"),i=this.deepQuery(f,"tooltip.islandPosition");this._lastDataIndex=-1,this._lastSeriesIndex=-1,this._lastItemTriggerId!==this._curTarget.id&&(this._lastItemTriggerId=this._curTarget.id,"function"==typeof e?(this._curTicket=(s.name||"")+":"+l,this._tDom.innerHTML=e.call(this.myChart,{seriesIndex:n,seriesName:s.name||"",series:s,dataIndex:l,data:r,name:c,value:p,percent:u,indicator:u,value2:g,indicator2:g,0:s.name||"",1:c,2:p,3:u,4:g,5:r,6:n,7:l},this._curTicket,this._setContent)):"string"==typeof e?(this._curTicket=0/0,e=e.replace("{a}","{a0}").replace("{b}","{b0}").replace("{c}","{c0}"),e=e.replace("{a0}",this._encodeHTML(s.name||"")).replace("{b0}",this._encodeHTML(c)).replace("{c0}",p instanceof Array?p:this.numAddCommas(p)),e=e.replace("{d}","{d0}").replace("{d0}",u||""),e=e.replace("{e}","{e0}").replace("{e0}",h.get(this._curTarget,"special2")||""),this._tDom.innerHTML=e):(this._curTicket=0/0,this._tDom.innerHTML=s.type===a.CHART_TYPE_RADAR&&u?this._itemFormatter.radar.call(this,s,c,p,u):s.type===a.CHART_TYPE_EVENTRIVER?this._itemFormatter.eventRiver.call(this,s,c,p,r):""+(null!=s.name?this._encodeHTML(s.name)+"<br/>":"")+(""===c?"":this._encodeHTML(c)+" : ")+(p instanceof Array?p:this.numAddCommas(p))));var y=d.getX(this._event),x=d.getY(this._event);this.deepQuery(f,"tooltip.axisPointer.show")&&this.component.grid?this._styleAxisPointer([s],this.component.grid.getX(),x,this.component.grid.getXend(),x,0,y,x):this._hide(),o!==!1&&this.option.tooltip.showContent&&(this.hasAppend||(this._tDom.style.left=this._zrWidth/2+"px",this._tDom.style.top=this._zrHeight/2+"px",this.dom.firstChild.appendChild(this._tDom),this.hasAppend=!0),this._show(i,y+20,x-20,m))}},_itemFormatter:{radar:function(t,e,i,o){var s="";s+=this._encodeHTML(""===e?t.name||"":e),s+=""===s?"":"<br />";for(var n=0;n<o.length;n++)s+=this._encodeHTML(o[n].text)+" : "+this.numAddCommas(i[n])+"<br />";return s},chord:function(t,e,i,o,s){if(null==s)return this._encodeHTML(e)+" ("+this.numAddCommas(i)+")";var n=this._encodeHTML(e),r=this._encodeHTML(o);return""+(null!=t.name?this._encodeHTML(t.name)+"<br/>":"")+n+" -> "+r+" ("+this.numAddCommas(i)+")<br />"+r+" -> "+n+" ("+this.numAddCommas(s)+")"},eventRiver:function(t,e,i,o){var s="";s+=this._encodeHTML(""===t.name?"":t.name+" : "),s+=this._encodeHTML(e),s+=""===s?"":"<br />",o=o.evolution;for(var n=0,r=o.length;r>n;n++)s+='<div style="padding-top:5px;">',o[n].detail&&(o[n].detail.img&&(s+='<img src="'+o[n].detail.img+'" style="float:left;width:40px;height:40px;">'),s+='<div style="margin-left:45px;">'+o[n].time+"<br/>",s+='<a href="'+o[n].detail.link+'" target="_blank">',s+=o[n].detail.text+"</a></div>",s+="</div>");return s}},_styleAxisPointer:function(t,e,i,o,s,n,r,a){if(t.length>0){var h,l,d=this.option.tooltip.axisPointer,c=d.type,p={line:{},cross:{},shadow:{}};for(var u in p)p[u].color=d[u+"Style"].color,p[u].width=d[u+"Style"].width,p[u].type=d[u+"Style"].type;for(var g=0,f=t.length;f>g;g++)h=t[g],l=this.query(h,"tooltip.axisPointer.type"),c=l||c,l&&(p[l].color=this.query(h,"tooltip.axisPointer."+l+"Style.color")||p[l].color,p[l].width=this.query(h,"tooltip.axisPointer."+l+"Style.width")||p[l].width,p[l].type=this.query(h,"tooltip.axisPointer."+l+"Style.type")||p[l].type);if("line"===c){var m=p.line.width,_=e==o;this._axisLineShape.style={xStart:_?this.subPixelOptimize(e,m):e,yStart:_?i:this.subPixelOptimize(i,m),xEnd:_?this.subPixelOptimize(o,m):o,yEnd:_?s:this.subPixelOptimize(s,m),strokeColor:p.line.color,lineWidth:m,lineType:p.line.type},this._axisLineShape.invisible=!1,this.zr.modShape(this._axisLineShape.id)}else if("cross"===c){var y=p.cross.width;this._axisCrossShape.style={brushType:"stroke",rect:this.component.grid.getArea(),x:this.subPixelOptimize(r,y),y:this.subPixelOptimize(a,y),text:("( "+this.component.xAxis.getAxis(0).getValueFromCoord(r)+" , "+this.component.yAxis.getAxis(0).getValueFromCoord(a)+" )").replace("  , "," ").replace(" ,  "," "),textPosition:"specific",strokeColor:p.cross.color,lineWidth:y,lineType:p.cross.type},this.component.grid.getXend()-r>100?(this._axisCrossShape.style.textAlign="left",this._axisCrossShape.style.textX=r+10):(this._axisCrossShape.style.textAlign="right",this._axisCrossShape.style.textX=r-10),a-this.component.grid.getY()>50?(this._axisCrossShape.style.textBaseline="bottom",this._axisCrossShape.style.textY=a-10):(this._axisCrossShape.style.textBaseline="top",this._axisCrossShape.style.textY=a+10),this._axisCrossShape.invisible=!1,this.zr.modShape(this._axisCrossShape.id)}else"shadow"===c&&((null==p.shadow.width||"auto"===p.shadow.width||isNaN(p.shadow.width))&&(p.shadow.width=n),e===o?Math.abs(this.component.grid.getX()-e)<2?(p.shadow.width/=2,e=o+=p.shadow.width/2):Math.abs(this.component.grid.getXend()-e)<2&&(p.shadow.width/=2,e=o-=p.shadow.width/2):i===s&&(Math.abs(this.component.grid.getY()-i)<2?(p.shadow.width/=2,i=s+=p.shadow.width/2):Math.abs(this.component.grid.getYend()-i)<2&&(p.shadow.width/=2,i=s-=p.shadow.width/2)),this._axisShadowShape.style={xStart:e,yStart:i,xEnd:o,yEnd:s,strokeColor:p.shadow.color,lineWidth:p.shadow.width},this._axisShadowShape.invisible=!1,this.zr.modShape(this._axisShadowShape.id));this.zr.refreshNextFrame()}},__onmousemove:function(t){if(clearTimeout(this._hidingTicket),clearTimeout(this._showingTicket),!this._mousein||!this._enterable){var e=t.target,i=d.getX(t.event),o=d.getY(t.event);if(e){this._curTarget=e,this._event=t.event,this._event.zrenderX=i,this._event.zrenderY=o;var s;if(this._needAxisTrigger&&this.component.polar&&-1!=(s=this.component.polar.isInside([i,o])))for(var n=this.option.series,h=0,l=n.length;l>h;h++)if(n[h].polarIndex===s&&"axis"===this.deepQuery([n[h],this.option],"tooltip.trigger")){this._curTarget=null;break}this._showingTicket=setTimeout(this._tryShow,this._showDelay)}else this._curTarget=!1,this._event=t.event,this._event.zrenderX=i,this._event.zrenderY=o,this._needAxisTrigger&&this.component.grid&&c.isInside(r,this.component.grid.getArea(),i,o)?this._showingTicket=setTimeout(this._tryShow,this._showDelay):this._needAxisTrigger&&this.component.polar&&-1!=this.component.polar.isInside([i,o])?this._showingTicket=setTimeout(this._tryShow,this._showDelay):(!this._event.connectTrigger&&this.messageCenter.dispatch(a.EVENT.TOOLTIP_OUT_GRID,this._event,null,this.myChart),this._hidingTicket=setTimeout(this._hide,this._hideDelay))
}},__onglobalout:function(){clearTimeout(this._hidingTicket),clearTimeout(this._showingTicket),this._hidingTicket=setTimeout(this._hide,this._hideDelay)},__setContent:function(t,e){this._tDom&&(t===this._curTicket&&(this._tDom.innerHTML=e),setTimeout(this._refixed,20))},ontooltipHover:function(t,e){if(!this._lastTipShape||this._lastTipShape&&this._lastTipShape.dataIndex!=t.dataIndex){this._lastTipShape&&this._lastTipShape.tipShape.length>0&&(this.zr.delShape(this._lastTipShape.tipShape),this.shapeList.length=2);for(var i=0,o=e.length;o>i;i++)e[i].zlevel=this.getZlevelBase(),e[i].z=this.getZBase(),e[i].style=g.prototype.getHighlightStyle(e[i].style,e[i].highlightStyle),e[i].draggable=!1,e[i].hoverable=!1,e[i].clickable=!1,e[i].ondragend=null,e[i].ondragover=null,e[i].ondrop=null,this.shapeList.push(e[i]),this.zr.addShape(e[i]);this._lastTipShape={dataIndex:t.dataIndex,tipShape:e}}},ondragend:function(){this._hide()},onlegendSelected:function(t){this._selectedMap=t.selected},_setSelectedMap:function(){this._selectedMap=this.component.legend?u.clone(this.component.legend.getSelectedMap()):{}},_isSelected:function(t){return null!=this._selectedMap[t]?this._selectedMap[t]:!0},showTip:function(t){if(t){var e,i=this.option.series;if(null!=t.seriesIndex)e=t.seriesIndex;else for(var o=t.seriesName,s=0,n=i.length;n>s;s++)if(i[s].name===o){e=s;break}var r=i[e];if(null!=r){var d=this.myChart.chart[r.type],c="axis"===this.deepQuery([r,this.option],"tooltip.trigger");if(d)if(c){var p=t.dataIndex;switch(d.type){case a.CHART_TYPE_LINE:case a.CHART_TYPE_BAR:case a.CHART_TYPE_K:case a.CHART_TYPE_TREEMAP:if(null==this.component.xAxis||null==this.component.yAxis||r.data.length<=p)return;var u=r.xAxisIndex||0,g=r.yAxisIndex||0;this._event=this.component.xAxis.getAxis(u).type===a.COMPONENT_TYPE_AXIS_CATEGORY?{zrenderX:this.component.xAxis.getAxis(u).getCoordByIndex(p),zrenderY:this.component.grid.getY()+(this.component.grid.getYend()-this.component.grid.getY())/4}:{zrenderX:this.component.grid.getX()+(this.component.grid.getXend()-this.component.grid.getX())/4,zrenderY:this.component.yAxis.getAxis(g).getCoordByIndex(p)},this._showAxisTrigger(u,g,p);break;case a.CHART_TYPE_RADAR:if(null==this.component.polar||r.data[0].value.length<=p)return;var f=r.polarIndex||0,m=this.component.polar.getVector(f,p,"max");this._event={zrenderX:m[0],zrenderY:m[1]},this._showPolarTrigger(f,p)}}else{var _,y,x=d.shapeList;switch(d.type){case a.CHART_TYPE_LINE:case a.CHART_TYPE_BAR:case a.CHART_TYPE_K:case a.CHART_TYPE_TREEMAP:case a.CHART_TYPE_SCATTER:for(var p=t.dataIndex,s=0,n=x.length;n>s;s++)if(null==x[s]._mark&&h.get(x[s],"seriesIndex")==e&&h.get(x[s],"dataIndex")==p){this._curTarget=x[s],_=x[s].style.x,y=d.type!=a.CHART_TYPE_K?x[s].style.y:x[s].style.y[0];break}break;case a.CHART_TYPE_RADAR:for(var p=t.dataIndex,s=0,n=x.length;n>s;s++)if("polygon"===x[s].type&&h.get(x[s],"seriesIndex")==e&&h.get(x[s],"dataIndex")==p){this._curTarget=x[s];var m=this.component.polar.getCenter(r.polarIndex||0);_=m[0],y=m[1];break}break;case a.CHART_TYPE_PIE:for(var v=t.name,s=0,n=x.length;n>s;s++)if("sector"===x[s].type&&h.get(x[s],"seriesIndex")==e&&h.get(x[s],"name")==v){this._curTarget=x[s];var b=this._curTarget.style,S=(b.startAngle+b.endAngle)/2*Math.PI/180;_=this._curTarget.style.x+Math.cos(S)*b.r/1.5,y=this._curTarget.style.y-Math.sin(S)*b.r/1.5;break}break;case a.CHART_TYPE_MAP:for(var v=t.name,T=r.mapType,s=0,n=x.length;n>s;s++)if("text"===x[s].type&&x[s]._mapType===T&&x[s].style._name===v){this._curTarget=x[s],_=this._curTarget.style.x+this._curTarget.position[0],y=this._curTarget.style.y+this._curTarget.position[1];break}break;case a.CHART_TYPE_CHORD:for(var v=t.name,s=0,n=x.length;n>s;s++)if("sector"===x[s].type&&h.get(x[s],"name")==v){this._curTarget=x[s];var b=this._curTarget.style,S=(b.startAngle+b.endAngle)/2*Math.PI/180;return _=this._curTarget.style.x+Math.cos(S)*(b.r-2),y=this._curTarget.style.y-Math.sin(S)*(b.r-2),void this.zr.trigger(l.EVENT.MOUSEMOVE,{zrenderX:_,zrenderY:y})}break;case a.CHART_TYPE_FORCE:for(var v=t.name,s=0,n=x.length;n>s;s++)if("circle"===x[s].type&&h.get(x[s],"name")==v){this._curTarget=x[s],_=this._curTarget.position[0],y=this._curTarget.position[1];break}}null!=_&&null!=y&&(this._event={zrenderX:_,zrenderY:y},this.zr.addHoverShape(this._curTarget),this.zr.refreshHover(),this._showItemTrigger())}}}},hideTip:function(){this._hide()},refresh:function(t){if(this._zrHeight=this.zr.getHeight(),this._zrWidth=this.zr.getWidth(),this._lastTipShape&&this._lastTipShape.tipShape.length>0&&this.zr.delShape(this._lastTipShape.tipShape),this._lastTipShape=!1,this.shapeList.length=2,this._lastDataIndex=-1,this._lastSeriesIndex=-1,this._lastItemTriggerId=-1,t){this.option=t,this.option.tooltip=this.reformOption(this.option.tooltip),this.option.tooltip.textStyle=u.merge(this.option.tooltip.textStyle,this.ecTheme.textStyle),this._needAxisTrigger=!1,"axis"===this.option.tooltip.trigger&&(this._needAxisTrigger=!0);for(var e=this.option.series,i=0,o=e.length;o>i;i++)if("axis"===this.query(e[i],"tooltip.trigger")){this._needAxisTrigger=!0;break}this._showDelay=this.option.tooltip.showDelay,this._hideDelay=this.option.tooltip.hideDelay,this._defaultCssText=this._style(this.option.tooltip),this._setSelectedMap(),this._axisLineWidth=this.option.tooltip.axisPointer.lineStyle.width,this._enterable=this.option.tooltip.enterable}if(this.showing){var s=this;setTimeout(function(){s.zr.trigger(l.EVENT.MOUSEMOVE,s.zr.handler._event)},50)}},onbeforDispose:function(){this._lastTipShape&&this._lastTipShape.tipShape.length>0&&this.zr.delShape(this._lastTipShape.tipShape),clearTimeout(this._hidingTicket),clearTimeout(this._showingTicket),this.zr.un(l.EVENT.MOUSEMOVE,this._onmousemove),this.zr.un(l.EVENT.GLOBALOUT,this._onglobalout),this.hasAppend&&this.dom.firstChild&&this.dom.firstChild.removeChild(this._tDom),this._tDom=null},_encodeHTML:function(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}},u.inherits(e,i),t("../component").define("tooltip",e),e}),i("zrender/tool/vector",[],function(){var t="undefined"==typeof Float32Array?Array:Float32Array,e={create:function(e,i){var o=new t(2);return o[0]=e||0,o[1]=i||0,o},copy:function(t,e){return t[0]=e[0],t[1]=e[1],t},clone:function(e){var i=new t(2);return i[0]=e[0],i[1]=e[1],i},set:function(t,e,i){return t[0]=e,t[1]=i,t},add:function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t},scaleAndAdd:function(t,e,i,o){return t[0]=e[0]+i[0]*o,t[1]=e[1]+i[1]*o,t},sub:function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t},len:function(t){return Math.sqrt(this.lenSquare(t))},lenSquare:function(t){return t[0]*t[0]+t[1]*t[1]},mul:function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t},div:function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t},dot:function(t,e){return t[0]*e[0]+t[1]*e[1]},scale:function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t},normalize:function(t,i){var o=e.len(i);return 0===o?(t[0]=0,t[1]=0):(t[0]=i[0]/o,t[1]=i[1]/o),t},distance:function(t,e){return Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1]))},distanceSquare:function(t,e){return(t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])},negate:function(t,e){return t[0]=-e[0],t[1]=-e[1],t},lerp:function(t,e,i,o){return t[0]=e[0]+o*(i[0]-e[0]),t[1]=e[1]+o*(i[1]-e[1]),t},applyTransform:function(t,e,i){var o=e[0],s=e[1];return t[0]=i[0]*o+i[2]*s+i[4],t[1]=i[1]*o+i[3]*s+i[5],t},min:function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t},max:function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t}};return e.length=e.len,e.lengthSquare=e.lenSquare,e.dist=e.distance,e.distSquare=e.distanceSquare,e}),i("zrender/tool/curve",["require","./vector"],function(t){function e(t){return t>-m&&m>t}function i(t){return t>m||-m>t}function o(t,e,i,o,s){var n=1-s;return n*n*(n*t+3*s*e)+s*s*(s*o+3*n*i)}function s(t,e,i,o,s){var n=1-s;return 3*(((e-t)*n+2*(i-e)*s)*n+(o-i)*s*s)}function n(t,i,o,s,n,r){var a=s+3*(i-o)-t,h=3*(o-2*i+t),l=3*(i-t),d=t-n,c=h*h-3*a*l,p=h*l-9*a*d,u=l*l-3*h*d,g=0;if(e(c)&&e(p))if(e(h))r[0]=0;else{var f=-l/h;f>=0&&1>=f&&(r[g++]=f)}else{var m=p*p-4*c*u;if(e(m)){var x=p/c,f=-h/a+x,v=-x/2;f>=0&&1>=f&&(r[g++]=f),v>=0&&1>=v&&(r[g++]=v)}else if(m>0){var b=Math.sqrt(m),S=c*h+1.5*a*(-p+b),T=c*h+1.5*a*(-p-b);S=0>S?-Math.pow(-S,y):Math.pow(S,y),T=0>T?-Math.pow(-T,y):Math.pow(T,y);var f=(-h-(S+T))/(3*a);f>=0&&1>=f&&(r[g++]=f)}else{var z=(2*c*h-3*a*p)/(2*Math.sqrt(c*c*c)),C=Math.acos(z)/3,w=Math.sqrt(c),L=Math.cos(C),f=(-h-2*w*L)/(3*a),v=(-h+w*(L+_*Math.sin(C)))/(3*a),E=(-h+w*(L-_*Math.sin(C)))/(3*a);f>=0&&1>=f&&(r[g++]=f),v>=0&&1>=v&&(r[g++]=v),E>=0&&1>=E&&(r[g++]=E)}}return g}function r(t,o,s,n,r){var a=6*s-12*o+6*t,h=9*o+3*n-3*t-9*s,l=3*o-3*t,d=0;if(e(h)){if(i(a)){var c=-l/a;c>=0&&1>=c&&(r[d++]=c)}}else{var p=a*a-4*h*l;if(e(p))r[0]=-a/(2*h);else if(p>0){var u=Math.sqrt(p),c=(-a+u)/(2*h),g=(-a-u)/(2*h);c>=0&&1>=c&&(r[d++]=c),g>=0&&1>=g&&(r[d++]=g)}}return d}function a(t,e,i,o,s,n){var r=(e-t)*s+t,a=(i-e)*s+e,h=(o-i)*s+i,l=(a-r)*s+r,d=(h-a)*s+a,c=(d-l)*s+l;n[0]=t,n[1]=r,n[2]=l,n[3]=c,n[4]=c,n[5]=d,n[6]=h,n[7]=o}function h(t,e,i,s,n,r,a,h,l,d,c){var p,u=.005,g=1/0;x[0]=l,x[1]=d;for(var _=0;1>_;_+=.05){v[0]=o(t,i,n,a,_),v[1]=o(e,s,r,h,_);var y=f.distSquare(x,v);g>y&&(p=_,g=y)}g=1/0;for(var S=0;32>S&&!(m>u);S++){var T=p-u,z=p+u;v[0]=o(t,i,n,a,T),v[1]=o(e,s,r,h,T);var y=f.distSquare(v,x);if(T>=0&&g>y)p=T,g=y;else{b[0]=o(t,i,n,a,z),b[1]=o(e,s,r,h,z);var C=f.distSquare(b,x);1>=z&&g>C?(p=z,g=C):u*=.5}}return c&&(c[0]=o(t,i,n,a,p),c[1]=o(e,s,r,h,p)),Math.sqrt(g)}function l(t,e,i,o){var s=1-o;return s*(s*t+2*o*e)+o*o*i}function d(t,e,i,o){return 2*((1-o)*(e-t)+o*(i-e))}function c(t,o,s,n,r){var a=t-2*o+s,h=2*(o-t),l=t-n,d=0;if(e(a)){if(i(h)){var c=-l/h;c>=0&&1>=c&&(r[d++]=c)}}else{var p=h*h-4*a*l;if(e(p)){var c=-h/(2*a);c>=0&&1>=c&&(r[d++]=c)}else if(p>0){var u=Math.sqrt(p),c=(-h+u)/(2*a),g=(-h-u)/(2*a);c>=0&&1>=c&&(r[d++]=c),g>=0&&1>=g&&(r[d++]=g)}}return d}function p(t,e,i){var o=t+i-2*e;return 0===o?.5:(t-e)/o}function u(t,e,i,o,s){var n=(e-t)*o+t,r=(i-e)*o+e,a=(r-n)*o+n;s[0]=t,s[1]=n,s[2]=a,s[3]=a,s[4]=r,s[5]=i}function g(t,e,i,o,s,n,r,a,h){var d,c=.005,p=1/0;x[0]=r,x[1]=a;for(var u=0;1>u;u+=.05){v[0]=l(t,i,s,u),v[1]=l(e,o,n,u);var g=f.distSquare(x,v);p>g&&(d=u,p=g)}p=1/0;for(var _=0;32>_&&!(m>c);_++){var y=d-c,S=d+c;v[0]=l(t,i,s,y),v[1]=l(e,o,n,y);var g=f.distSquare(v,x);if(y>=0&&p>g)d=y,p=g;else{b[0]=l(t,i,s,S),b[1]=l(e,o,n,S);var T=f.distSquare(b,x);1>=S&&p>T?(d=S,p=T):c*=.5}}return h&&(h[0]=l(t,i,s,d),h[1]=l(e,o,n,d)),Math.sqrt(p)}var f=t("./vector"),m=1e-4,_=Math.sqrt(3),y=1/3,x=f.create(),v=f.create(),b=f.create();return{cubicAt:o,cubicDerivativeAt:s,cubicRootAt:n,cubicExtrema:r,cubicSubdivide:a,cubicProjectPoint:h,quadraticAt:l,quadraticDerivativeAt:d,quadraticRootAt:c,quadraticExtremum:p,quadraticSubdivide:u,quadraticProjectPoint:g}}),i("zrender/Layer",["require","./mixin/Transformable","./tool/util","./config"],function(t){function e(){return!1}function i(t,e,i){var o=document.createElement(e),s=i.getWidth(),n=i.getHeight();return o.style.position="absolute",o.style.left=0,o.style.top=0,o.style.width=s+"px",o.style.height=n+"px",o.width=s*r.devicePixelRatio,o.height=n*r.devicePixelRatio,o.setAttribute("data-zr-dom-id",t),o}var o=t("./mixin/Transformable"),s=t("./tool/util"),n=window.G_vmlCanvasManager,r=t("./config"),a=function(t,s){this.id=t,this.dom=i(t,"canvas",s),this.dom.onselectstart=e,this.dom.style["-webkit-user-select"]="none",this.dom.style["user-select"]="none",this.dom.style["-webkit-touch-callout"]="none",this.dom.style["-webkit-tap-highlight-color"]="rgba(0,0,0,0)",n&&n.initElement(this.dom),this.domBack=null,this.ctxBack=null,this.painter=s,this.unusedCount=0,this.config=null,this.dirty=!0,this.elCount=0,this.clearColor=0,this.motionBlur=!1,this.lastFrameAlpha=.7,this.zoomable=!1,this.panable=!1,this.maxZoom=1/0,this.minZoom=0,o.call(this)};return a.prototype.initContext=function(){this.ctx=this.dom.getContext("2d");var t=r.devicePixelRatio;1!=t&&this.ctx.scale(t,t)},a.prototype.createBackBuffer=function(){if(!n){this.domBack=i("back-"+this.id,"canvas",this.painter),this.ctxBack=this.domBack.getContext("2d");var t=r.devicePixelRatio;1!=t&&this.ctxBack.scale(t,t)}},a.prototype.resize=function(t,e){var i=r.devicePixelRatio;this.dom.style.width=t+"px",this.dom.style.height=e+"px",this.dom.setAttribute("width",t*i),this.dom.setAttribute("height",e*i),1!=i&&this.ctx.scale(i,i),this.domBack&&(this.domBack.setAttribute("width",t*i),this.domBack.setAttribute("height",e*i),1!=i&&this.ctxBack.scale(i,i))},a.prototype.clear=function(){var t=this.dom,e=this.ctx,i=t.width,o=t.height,s=this.clearColor&&!n,a=this.motionBlur&&!n,h=this.lastFrameAlpha,l=r.devicePixelRatio;if(a&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(t,0,0,i/l,o/l)),e.clearRect(0,0,i/l,o/l),s&&(e.save(),e.fillStyle=this.clearColor,e.fillRect(0,0,i/l,o/l),e.restore()),a){var d=this.domBack;e.save(),e.globalAlpha=h,e.drawImage(d,0,0,i/l,o/l),e.restore()}},s.merge(a.prototype,o.prototype),a}),i("zrender/loadingEffect/Base",["require","../tool/util","../shape/Text","../shape/Rectangle"],function(t){function e(t){this.setOptions(t)}var i=t("../tool/util"),o=t("../shape/Text"),s=t("../shape/Rectangle"),n="Loading...",r="normal 16px Arial";return e.prototype.createTextShape=function(t){return new o({highlightStyle:i.merge({x:this.canvasWidth/2,y:this.canvasHeight/2,text:n,textAlign:"center",textBaseline:"middle",textFont:r,color:"#333",brushType:"fill"},t,!0)})},e.prototype.createBackgroundShape=function(t){return new s({highlightStyle:{x:0,y:0,width:this.canvasWidth,height:this.canvasHeight,brushType:"fill",color:t}})},e.prototype.start=function(t){function e(e){t.storage.addHover(e)}function i(){t.refreshHover()}this.canvasWidth=t._width,this.canvasHeight=t._height,this.loadingTimer=this._start(e,i)},e.prototype._start=function(){return setInterval(function(){},1e4)},e.prototype.stop=function(){clearInterval(this.loadingTimer)},e.prototype.setOptions=function(t){this.options=t||{}},e.prototype.adjust=function(t,e){return t<=e[0]?t=e[0]:t>=e[1]&&(t=e[1]),t},e.prototype.getLocation=function(t,e,i){var o=null!=t.x?t.x:"center";switch(o){case"center":o=Math.floor((this.canvasWidth-e)/2);break;case"left":o=0;break;case"right":o=this.canvasWidth-e}var s=null!=t.y?t.y:"center";switch(s){case"center":s=Math.floor((this.canvasHeight-i)/2);break;case"top":s=0;break;case"bottom":s=this.canvasHeight-i}return{x:o,y:s,width:e,height:i}},e}),i("zrender/shape/Heart",["require","./Base","./util/PathProxy","../tool/area","../tool/util"],function(t){"use strict";var e=t("./Base"),i=t("./util/PathProxy"),o=t("../tool/area"),s=function(t){e.call(this,t),this._pathProxy=new i};return s.prototype={type:"heart",buildPath:function(t,e){var o=this._pathProxy||new i;o.begin(t),o.moveTo(e.x,e.y),o.bezierCurveTo(e.x+e.a/2,e.y-2*e.b/3,e.x+2*e.a,e.y+e.b/3,e.x,e.y+e.b),o.bezierCurveTo(e.x-2*e.a,e.y+e.b/3,e.x-e.a/2,e.y-2*e.b/3,e.x,e.y),o.closePath()},getRect:function(t){return t.__rect?t.__rect:(this._pathProxy.isEmpty()||this.buildPath(null,t),this._pathProxy.fastBoundingRect())},isCover:function(t,e){var i=this.transformCoordToLocal(t,e);return t=i[0],e=i[1],this.isCoverRect(t,e)?o.isInsidePath(this._pathProxy.pathCommands,this.style.lineWidth,this.style.brushType,t,e):void 0}},t("../tool/util").inherits(s,e),s}),i("zrender/shape/Droplet",["require","./Base","./util/PathProxy","../tool/area","../tool/util"],function(t){"use strict";var e=t("./Base"),i=t("./util/PathProxy"),o=t("../tool/area"),s=function(t){e.call(this,t),this._pathProxy=new i};return s.prototype={type:"droplet",buildPath:function(t,e){var o=this._pathProxy||new i;o.begin(t),o.moveTo(e.x,e.y+e.a),o.bezierCurveTo(e.x+e.a,e.y+e.a,e.x+3*e.a/2,e.y-e.a/3,e.x,e.y-e.b),o.bezierCurveTo(e.x-3*e.a/2,e.y-e.a/3,e.x-e.a,e.y+e.a,e.x,e.y+e.a),o.closePath()},getRect:function(t){return t.__rect?t.__rect:(this._pathProxy.isEmpty()||this.buildPath(null,t),this._pathProxy.fastBoundingRect())},isCover:function(t,e){var i=this.transformCoordToLocal(t,e);return t=i[0],e=i[1],this.isCoverRect(t,e)?o.isInsidePath(this._pathProxy.pathCommands,this.style.lineWidth,this.style.brushType,t,e):void 0}},t("../tool/util").inherits(s,e),s}),i("zrender/shape/Star",["require","../tool/math","./Base","../tool/util"],function(t){var e=t("../tool/math"),i=e.sin,o=e.cos,s=Math.PI,n=t("./Base"),r=function(t){n.call(this,t)};return r.prototype={type:"star",buildPath:function(t,e){var n=e.n;if(n&&!(2>n)){var r=e.x,a=e.y,h=e.r,l=e.r0;null==l&&(l=n>4?h*o(2*s/n)/o(s/n):h/3);var d=s/n,c=-s/2,p=r+h*o(c),u=a+h*i(c);c+=d;var g=e.pointList=[];g.push([p,u]);for(var f,m=0,_=2*n-1;_>m;m++)f=m%2===0?l:h,g.push([r+f*o(c),a+f*i(c)]),c+=d;g.push([p,u]),t.moveTo(g[0][0],g[0][1]);for(var m=0;m<g.length;m++)t.lineTo(g[m][0],g[m][1]);t.closePath()}},getRect:function(t){if(t.__rect)return t.__rect;var e;return e="stroke"==t.brushType||"fill"==t.brushType?t.lineWidth||1:0,t.__rect={x:Math.round(t.x-t.r-e/2),y:Math.round(t.y-t.r-e/2),width:2*t.r+e,height:2*t.r+e},t.__rect}},t("../tool/util").inherits(r,n),r}),i("zrender/Group",["require","./tool/guid","./tool/util","./mixin/Transformable","./mixin/Eventful"],function(t){var e=t("./tool/guid"),i=t("./tool/util"),o=t("./mixin/Transformable"),s=t("./mixin/Eventful"),n=function(t){t=t||{},this.id=t.id||e();for(var i in t)this[i]=t[i];this.type="group",this.clipShape=null,this._children=[],this._storage=null,this.__dirty=!0,o.call(this),s.call(this)};return n.prototype.ignore=!1,n.prototype.children=function(){return this._children.slice()},n.prototype.childAt=function(t){return this._children[t]},n.prototype.addChild=function(t){t!=this&&t.parent!=this&&(t.parent&&t.parent.removeChild(t),this._children.push(t),t.parent=this,this._storage&&this._storage!==t._storage&&(this._storage.addToMap(t),t instanceof n&&t.addChildrenToStorage(this._storage)))},n.prototype.removeChild=function(t){var e=i.indexOf(this._children,t);e>=0&&this._children.splice(e,1),t.parent=null,this._storage&&(this._storage.delFromMap(t.id),t instanceof n&&t.delChildrenFromStorage(this._storage))},n.prototype.clearChildren=function(){for(var t=0;t<this._children.length;t++){var e=this._children[t];this._storage&&(this._storage.delFromMap(e.id),e instanceof n&&e.delChildrenFromStorage(this._storage))}this._children.length=0},n.prototype.eachChild=function(t,e){for(var i=!!e,o=0;o<this._children.length;o++){var s=this._children[o];i?t.call(e,s):t(s)}},n.prototype.traverse=function(t,e){for(var i=!!e,o=0;o<this._children.length;o++){var s=this._children[o];i?t.call(e,s):t(s),"group"===s.type&&s.traverse(t,e)}},n.prototype.addChildrenToStorage=function(t){for(var e=0;e<this._children.length;e++){var i=this._children[e];t.addToMap(i),i instanceof n&&i.addChildrenToStorage(t)}},n.prototype.delChildrenFromStorage=function(t){for(var e=0;e<this._children.length;e++){var i=this._children[e];t.delFromMap(i.id),i instanceof n&&i.delChildrenFromStorage(t)}},n.prototype.modSelf=function(){this.__dirty=!0},i.merge(n.prototype,o.prototype,!0),i.merge(n.prototype,s.prototype,!0),n}),i("zrender/shape/util/PathProxy",["require","../../tool/vector"],function(t){var e=t("../../tool/vector"),i=function(t,e){this.command=t,this.points=e||null},o=function(){this.pathCommands=[],this._ctx=null,this._min=[],this._max=[]};return o.prototype.fastBoundingRect=function(){var t=this._min,i=this._max;t[0]=t[1]=1/0,i[0]=i[1]=-1/0;for(var o=0;o<this.pathCommands.length;o++){var s=this.pathCommands[o],n=s.points;switch(s.command){case"M":e.min(t,t,n),e.max(i,i,n);break;case"L":e.min(t,t,n),e.max(i,i,n);break;case"C":for(var r=0;6>r;r+=2)t[0]=Math.min(t[0],t[0],n[r]),t[1]=Math.min(t[1],t[1],n[r+1]),i[0]=Math.max(i[0],i[0],n[r]),i[1]=Math.max(i[1],i[1],n[r+1]);break;case"Q":for(var r=0;4>r;r+=2)t[0]=Math.min(t[0],t[0],n[r]),t[1]=Math.min(t[1],t[1],n[r+1]),i[0]=Math.max(i[0],i[0],n[r]),i[1]=Math.max(i[1],i[1],n[r+1]);break;case"A":var a=n[0],h=n[1],l=n[2],d=n[3];t[0]=Math.min(t[0],t[0],a-l),t[1]=Math.min(t[1],t[1],h-d),i[0]=Math.max(i[0],i[0],a+l),i[1]=Math.max(i[1],i[1],h+d)}}return{x:t[0],y:t[1],width:i[0]-t[0],height:i[1]-t[1]}},o.prototype.begin=function(t){return this._ctx=t||null,this.pathCommands.length=0,this},o.prototype.moveTo=function(t,e){return this.pathCommands.push(new i("M",[t,e])),this._ctx&&this._ctx.moveTo(t,e),this},o.prototype.lineTo=function(t,e){return this.pathCommands.push(new i("L",[t,e])),this._ctx&&this._ctx.lineTo(t,e),this},o.prototype.bezierCurveTo=function(t,e,o,s,n,r){return this.pathCommands.push(new i("C",[t,e,o,s,n,r])),this._ctx&&this._ctx.bezierCurveTo(t,e,o,s,n,r),this},o.prototype.quadraticCurveTo=function(t,e,o,s){return this.pathCommands.push(new i("Q",[t,e,o,s])),this._ctx&&this._ctx.quadraticCurveTo(t,e,o,s),this},o.prototype.arc=function(t,e,o,s,n,r){return this.pathCommands.push(new i("A",[t,e,o,o,s,n-s,0,r?0:1])),this._ctx&&this._ctx.arc(t,e,o,s,n,r),this},o.prototype.arcTo=function(t,e,i,o,s){return this._ctx&&this._ctx.arcTo(t,e,i,o,s),this},o.prototype.rect=function(t,e,i,o){return this._ctx&&this._ctx.rect(t,e,i,o),this},o.prototype.closePath=function(){return this.pathCommands.push(new i("z")),this._ctx&&this._ctx.closePath(),this},o.prototype.isEmpty=function(){return 0===this.pathCommands.length},o.PathSegment=i,o}),i("zrender/shape/BezierCurve",["require","./Base","../tool/util"],function(t){"use strict";var e=t("./Base"),i=function(t){this.brushTypeOnly="stroke",this.textPosition="end",e.call(this,t)};return i.prototype={type:"bezier-curve",buildPath:function(t,e){t.moveTo(e.xStart,e.yStart),"undefined"!=typeof e.cpX2&&"undefined"!=typeof e.cpY2?t.bezierCurveTo(e.cpX1,e.cpY1,e.cpX2,e.cpY2,e.xEnd,e.yEnd):t.quadraticCurveTo(e.cpX1,e.cpY1,e.xEnd,e.yEnd)},getRect:function(t){if(t.__rect)return t.__rect;var e=Math.min(t.xStart,t.xEnd,t.cpX1),i=Math.min(t.yStart,t.yEnd,t.cpY1),o=Math.max(t.xStart,t.xEnd,t.cpX1),s=Math.max(t.yStart,t.yEnd,t.cpY1),n=t.cpX2,r=t.cpY2;"undefined"!=typeof n&&"undefined"!=typeof r&&(e=Math.min(e,n),i=Math.min(i,r),o=Math.max(o,n),s=Math.max(s,r));var a=t.lineWidth||1;return t.__rect={x:e-a,y:i-a,width:o-e+a,height:s-i+a},t.__rect}},t("../tool/util").inherits(i,e),i}),i("zrender/shape/util/dashedLineTo",[],function(){var t=[5,5];return function(e,i,o,s,n,r){if(e.setLineDash)return t[0]=t[1]=r,e.setLineDash(t),e.moveTo(i,o),void e.lineTo(s,n);r="number"!=typeof r?5:r;var a=s-i,h=n-o,l=Math.floor(Math.sqrt(a*a+h*h)/r);a/=l,h/=l;for(var d=!0,c=0;l>c;++c)d?e.moveTo(i,o):e.lineTo(i,o),d=!d,i+=a,o+=h;e.lineTo(s,n)}}),i("zrender/animation/Clip",["require","./easing"],function(t){function e(t){this._targetPool=t.target||{},this._targetPool instanceof Array||(this._targetPool=[this._targetPool]),this._life=t.life||1e3,this._delay=t.delay||0,this._startTime=(new Date).getTime()+this._delay,this._endTime=this._startTime+1e3*this._life,this.loop="undefined"==typeof t.loop?!1:t.loop,this.gap=t.gap||0,this.easing=t.easing||"Linear",this.onframe=t.onframe,this.ondestroy=t.ondestroy,this.onrestart=t.onrestart}var i=t("./easing");return e.prototype={step:function(t){var e=(t-this._startTime)/this._life;if(!(0>e)){e=Math.min(e,1);var o="string"==typeof this.easing?i[this.easing]:this.easing,s="function"==typeof o?o(e):e;return this.fire("frame",s),1==e?this.loop?(this.restart(),"restart"):(this._needsRemove=!0,"destroy"):null}},restart:function(){var t=(new Date).getTime(),e=(t-this._startTime)%this._life;this._startTime=(new Date).getTime()-e+this.gap,this._needsRemove=!1},fire:function(t,e){for(var i=0,o=this._targetPool.length;o>i;i++)this["on"+t]&&this["on"+t](this._targetPool[i],e)},constructor:e},e}),i("zrender/shape/Polygon",["require","./Base","./util/smoothSpline","./util/smoothBezier","./util/dashedLineTo","../tool/util"],function(t){var e=t("./Base"),i=t("./util/smoothSpline"),o=t("./util/smoothBezier"),s=t("./util/dashedLineTo"),n=function(t){e.call(this,t)};return n.prototype={type:"polygon",buildPath:function(t,e){var n=e.pointList;if(!(n.length<2)){if(e.smooth&&"spline"!==e.smooth){var r=o(n,e.smooth,!0,e.smoothConstraint);t.moveTo(n[0][0],n[0][1]);for(var a,h,l,d=n.length,c=0;d>c;c++)a=r[2*c],h=r[2*c+1],l=n[(c+1)%d],t.bezierCurveTo(a[0],a[1],h[0],h[1],l[0],l[1])}else if("spline"===e.smooth&&(n=i(n,!0)),e.lineType&&"solid"!=e.lineType){if("dashed"==e.lineType||"dotted"==e.lineType){var p=e._dashLength||(e.lineWidth||1)*("dashed"==e.lineType?5:1);e._dashLength=p,t.moveTo(n[0][0],n[0][1]);for(var c=1,u=n.length;u>c;c++)s(t,n[c-1][0],n[c-1][1],n[c][0],n[c][1],p);s(t,n[n.length-1][0],n[n.length-1][1],n[0][0],n[0][1],p)}}else{t.moveTo(n[0][0],n[0][1]);for(var c=1,u=n.length;u>c;c++)t.lineTo(n[c][0],n[c][1]);t.lineTo(n[0][0],n[0][1])}t.closePath()}},getRect:function(t){if(t.__rect)return t.__rect;for(var e=Number.MAX_VALUE,i=Number.MIN_VALUE,o=Number.MAX_VALUE,s=Number.MIN_VALUE,n=t.pointList,r=0,a=n.length;a>r;r++)n[r][0]<e&&(e=n[r][0]),n[r][0]>i&&(i=n[r][0]),n[r][1]<o&&(o=n[r][1]),n[r][1]>s&&(s=n[r][1]);var h;return h="stroke"==t.brushType||"fill"==t.brushType?t.lineWidth||1:0,t.__rect={x:Math.round(e-h/2),y:Math.round(o-h/2),width:i-e+h,height:s-o+h},t.__rect}},t("../tool/util").inherits(n,e),n}),i("echarts/util/shape/normalIsCover",[],function(){return function(t,e){var i=this.transformCoordToLocal(t,e);return t=i[0],e=i[1],this.isCoverRect(t,e)}}),i("zrender/animation/easing",[],function(){var t={Linear:function(t){return t},QuadraticIn:function(t){return t*t},QuadraticOut:function(t){return t*(2-t)},QuadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},CubicIn:function(t){return t*t*t},CubicOut:function(t){return--t*t*t+1},CubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},QuarticIn:function(t){return t*t*t*t},QuarticOut:function(t){return 1- --t*t*t*t},QuarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},QuinticIn:function(t){return t*t*t*t*t},QuinticOut:function(t){return--t*t*t*t*t+1},QuinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},SinusoidalIn:function(t){return 1-Math.cos(t*Math.PI/2)},SinusoidalOut:function(t){return Math.sin(t*Math.PI/2)},SinusoidalInOut:function(t){return.5*(1-Math.cos(Math.PI*t))},ExponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},ExponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},ExponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)},CircularIn:function(t){return 1-Math.sqrt(1-t*t)},CircularOut:function(t){return Math.sqrt(1- --t*t)},CircularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},ElasticIn:function(t){var e,i=.1,o=.4;return 0===t?0:1===t?1:(!i||1>i?(i=1,e=o/4):e=o*Math.asin(1/i)/(2*Math.PI),-(i*Math.pow(2,10*(t-=1))*Math.sin(2*(t-e)*Math.PI/o)))},ElasticOut:function(t){var e,i=.1,o=.4;return 0===t?0:1===t?1:(!i||1>i?(i=1,e=o/4):e=o*Math.asin(1/i)/(2*Math.PI),i*Math.pow(2,-10*t)*Math.sin(2*(t-e)*Math.PI/o)+1)},ElasticInOut:function(t){var e,i=.1,o=.4;return 0===t?0:1===t?1:(!i||1>i?(i=1,e=o/4):e=o*Math.asin(1/i)/(2*Math.PI),(t*=2)<1?-.5*i*Math.pow(2,10*(t-=1))*Math.sin(2*(t-e)*Math.PI/o):i*Math.pow(2,-10*(t-=1))*Math.sin(2*(t-e)*Math.PI/o)*.5+1)},BackIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},BackOut:function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},BackInOut:function(t){var e=2.5949095;return(t*=2)<1?.5*t*t*((e+1)*t-e):.5*((t-=2)*t*((e+1)*t+e)+2)},BounceIn:function(e){return 1-t.BounceOut(1-e)},BounceOut:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},BounceInOut:function(e){return.5>e?.5*t.BounceIn(2*e):.5*t.BounceOut(2*e-1)+.5}};return t}),i("zrender/shape/util/smoothBezier",["require","../../tool/vector"],function(t){var e=t("../../tool/vector");return function(t,i,o,s){var n,r,a,h,l=[],d=[],c=[],p=[],u=!!s;if(u){a=[1/0,1/0],h=[-1/0,-1/0];for(var g=0,f=t.length;f>g;g++)e.min(a,a,t[g]),e.max(h,h,t[g]);e.min(a,a,s[0]),e.max(h,h,s[1])}for(var g=0,f=t.length;f>g;g++){var n,r,m=t[g];if(o)n=t[g?g-1:f-1],r=t[(g+1)%f];else{if(0===g||g===f-1){l.push(e.clone(t[g]));continue}n=t[g-1],r=t[g+1]}e.sub(d,r,n),e.scale(d,d,i);var _=e.distance(m,n),y=e.distance(m,r),x=_+y;0!==x&&(_/=x,y/=x),e.scale(c,d,-_),e.scale(p,d,y);var v=e.add([],m,c),b=e.add([],m,p);u&&(e.max(v,v,a),e.min(v,v,h),e.max(b,b,a),e.min(b,b,h)),l.push(v),l.push(b)}return o&&l.push(e.clone(l.shift())),l}}),i("zrender/shape/util/smoothSpline",["require","../../tool/vector"],function(t){function e(t,e,i,o,s,n,r){var a=.5*(i-t),h=.5*(o-e);return(2*(e-i)+a+h)*r+(-3*(e-i)-2*a-h)*n+a*s+e}var i=t("../../tool/vector");return function(t,o){for(var s=t.length,n=[],r=0,a=1;s>a;a++)r+=i.distance(t[a-1],t[a]);var h=r/5;h=s>h?s:h;for(var a=0;h>a;a++){var l,d,c,p=a/(h-1)*(o?s:s-1),u=Math.floor(p),g=p-u,f=t[u%s];o?(l=t[(u-1+s)%s],d=t[(u+1)%s],c=t[(u+2)%s]):(l=t[0===u?u:u-1],d=t[u>s-2?s-1:u+1],c=t[u>s-3?s-1:u+2]);var m=g*g,_=g*m;n.push([e(l[0],f[0],d[0],c[0],g,m,_),e(l[1],f[1],d[1],c[1],g,m,_)])}return n}}),i("echarts/util/ecQuery",["require","zrender/tool/util"],function(t){function e(t,e){if("undefined"!=typeof t){if(!e)return t;e=e.split(".");for(var i=e.length,o=0;i>o;){if(t=t[e[o]],"undefined"==typeof t)return;o++}return t}}function i(t,i){for(var o,s=0,n=t.length;n>s;s++)if(o=e(t[s],i),"undefined"!=typeof o)return o}function o(t,i){for(var o,n=t.length;n--;){var r=e(t[n],i);"undefined"!=typeof r&&("undefined"==typeof o?o=s.clone(r):s.merge(o,r,!0))}return o}var s=t("zrender/tool/util");return{query:e,deepQuery:i,deepMerge:o}}),i("echarts/util/number",[],function(){function t(t){return t.replace(/^\s+/,"").replace(/\s+$/,"")}function e(e,i){return"string"==typeof e?t(e).match(/%$/)?parseFloat(e)/100*i:parseFloat(e):e}function i(t,i){return[e(i[0],t.getWidth()),e(i[1],t.getHeight())]}function o(t,i){i instanceof Array||(i=[0,i]);var o=Math.min(t.getWidth(),t.getHeight())/2;return[e(i[0],o),e(i[1],o)]}function s(t){return isNaN(t)?"-":(t=(t+"").split("."),t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,"$1,")+(t.length>1?"."+t[1]:""))}return{parsePercent:e,parseCenter:i,parseRadius:o,addCommas:s}}),i("echarts/data/KDTree",["require","./quickSelect"],function(t){function e(t,e){this.left=null,this.right=null,this.axis=t,this.data=e}var i=t("./quickSelect"),o=function(t,e){t.length&&(e||(e=t[0].array.length),this.dimension=e,this.root=this._buildTree(t,0,t.length-1,0),this._stack=[],this._nearstNList=[])};return o.prototype._buildTree=function(t,o,s,n){if(o>s)return null;var r=Math.floor((o+s)/2);r=i(t,o,s,r,function(t,e){return t.array[n]-e.array[n]});var a=t[r],h=new e(n,a);return n=(n+1)%this.dimension,s>o&&(h.left=this._buildTree(t,o,r-1,n),h.right=this._buildTree(t,r+1,s,n)),h},o.prototype.nearest=function(t,e){var i=this.root,o=this._stack,s=0,n=1/0,r=null;for(i.data!==t&&(n=e(i.data,t),r=i),t.array[i.axis]<i.data.array[i.axis]?(i.right&&(o[s++]=i.right),i.left&&(o[s++]=i.left)):(i.left&&(o[s++]=i.left),i.right&&(o[s++]=i.right));s--;){i=o[s];var a=t.array[i.axis]-i.data.array[i.axis],h=0>a,l=!1;a*=a,n>a&&(a=e(i.data,t),n>a&&i.data!==t&&(n=a,r=i),l=!0),h?(l&&i.right&&(o[s++]=i.right),i.left&&(o[s++]=i.left)):(l&&i.left&&(o[s++]=i.left),i.right&&(o[s++]=i.right))}return r.data},o.prototype._addNearest=function(t,e,i){for(var o=this._nearstNList,s=t-1;s>0&&!(e>=o[s-1].dist);s--)o[s].dist=o[s-1].dist,o[s].node=o[s-1].node;o[s].dist=e,o[s].node=i},o.prototype.nearestN=function(t,e,i,o){if(0>=e)return o.length=0,o;for(var s=this.root,n=this._stack,r=0,a=this._nearstNList,h=0;e>h;h++)a[h]||(a[h]={}),a[h].dist=0,a[h].node=null;var l=i(s.data,t),d=0;for(s.data!==t&&(d++,this._addNearest(d,l,s)),t.array[s.axis]<s.data.array[s.axis]?(s.right&&(n[r++]=s.right),s.left&&(n[r++]=s.left)):(s.left&&(n[r++]=s.left),s.right&&(n[r++]=s.right));r--;){s=n[r];var l=t.array[s.axis]-s.data.array[s.axis],c=0>l,p=!1;
l*=l,(e>d||l<a[d-1].dist)&&(l=i(s.data,t),(e>d||l<a[d-1].dist)&&s.data!==t&&(e>d&&d++,this._addNearest(d,l,s)),p=!0),c?(p&&s.right&&(n[r++]=s.right),s.left&&(n[r++]=s.left)):(p&&s.left&&(n[r++]=s.left),s.right&&(n[r++]=s.right))}for(var h=0;d>h;h++)o[h]=a[h].node.data;return o.length=d,o},o}),i("echarts/data/quickSelect",["require"],function(){function t(t,e){return t-e}function e(t,e,i){var o=t[e];t[e]=t[i],t[i]=o}function i(t,i,o,s,n){for(var r=i;o>i;){var r=Math.round((o+i)/2),a=t[r];e(t,r,o),r=i;for(var h=i;o-1>=h;h++)n(a,t[h])>=0&&(e(t,h,r),r++);if(e(t,o,r),r===s)return r;s>r?i=r+1:o=r-1}return i}function o(e,o,s,n,r){return arguments.length<=3&&(n=o,r=2==arguments.length?t:s,o=0,s=e.length-1),i(e,o,s,n,r)}return o}),i("echarts/component/dataView",["require","./base","../config","zrender/tool/util","../component"],function(t){function e(t,e,o,s,n){i.call(this,t,e,o,s,n),this.dom=n.dom,this._tDom=document.createElement("div"),this._textArea=document.createElement("textArea"),this._buttonRefresh=document.createElement("button"),this._buttonClose=document.createElement("button"),this._hasShow=!1,this._zrHeight=o.getHeight(),this._zrWidth=o.getWidth(),this._tDom.className="echarts-dataview",this.hide(),this.dom.firstChild.appendChild(this._tDom),window.addEventListener?(this._tDom.addEventListener("click",this._stop),this._tDom.addEventListener("mousewheel",this._stop),this._tDom.addEventListener("mousemove",this._stop),this._tDom.addEventListener("mousedown",this._stop),this._tDom.addEventListener("mouseup",this._stop),this._tDom.addEventListener("touchstart",this._stop),this._tDom.addEventListener("touchmove",this._stop),this._tDom.addEventListener("touchend",this._stop)):(this._tDom.attachEvent("onclick",this._stop),this._tDom.attachEvent("onmousewheel",this._stop),this._tDom.attachEvent("onmousemove",this._stop),this._tDom.attachEvent("onmousedown",this._stop),this._tDom.attachEvent("onmouseup",this._stop))}var i=t("./base"),o=t("../config"),s=t("zrender/tool/util");return e.prototype={type:o.COMPONENT_TYPE_DATAVIEW,_lang:["Data View","close","refresh"],_gCssText:"position:absolute;display:block;overflow:hidden;transition:height 0.8s,background-color 1s;-moz-transition:height 0.8s,background-color 1s;-webkit-transition:height 0.8s,background-color 1s;-o-transition:height 0.8s,background-color 1s;z-index:1;left:0;top:0;",hide:function(){this._sizeCssText="width:"+this._zrWidth+"px;height:0px;background-color:#f0ffff;",this._tDom.style.cssText=this._gCssText+this._sizeCssText},show:function(t){this._hasShow=!0;var e=this.query(this.option,"toolbox.feature.dataView.lang")||this._lang;this.option=t,this._tDom.innerHTML='<p style="padding:8px 0;margin:0 0 10px 0;border-bottom:1px solid #eee">'+(e[0]||this._lang[0])+"</p>";var i=this.query(this.option,"toolbox.feature.dataView.optionToContent");"function"!=typeof i?this._textArea.value=this._optionToContent():(this._textArea=document.createElement("div"),this._textArea.innerHTML=i(this.option)),this._textArea.style.cssText="display:block;margin:0 0 8px 0;padding:4px 6px;overflow:auto;width:100%;height:"+(this._zrHeight-100)+"px;",this._tDom.appendChild(this._textArea),this._buttonClose.style.cssText="float:right;padding:1px 6px;",this._buttonClose.innerHTML=e[1]||this._lang[1];var o=this;this._buttonClose.onclick=function(){o.hide()},this._tDom.appendChild(this._buttonClose),this.query(this.option,"toolbox.feature.dataView.readOnly")===!1?(this._buttonRefresh.style.cssText="float:right;margin-right:10px;padding:1px 6px;",this._buttonRefresh.innerHTML=e[2]||this._lang[2],this._buttonRefresh.onclick=function(){o._save()},this._textArea.readOnly=!1,this._textArea.style.cursor="default"):(this._buttonRefresh.style.cssText="display:none",this._textArea.readOnly=!0,this._textArea.style.cursor="text"),this._tDom.appendChild(this._buttonRefresh),this._sizeCssText="width:"+this._zrWidth+"px;height:"+this._zrHeight+"px;background-color:#fff;",this._tDom.style.cssText=this._gCssText+this._sizeCssText},_optionToContent:function(){var t,e,i,s,n,r,a=[],h="";if(this.option.xAxis)for(a=this.option.xAxis instanceof Array?this.option.xAxis:[this.option.xAxis],t=0,s=a.length;s>t;t++)if("category"==(a[t].type||"category")){for(r=[],e=0,i=a[t].data.length;i>e;e++)r.push(this.getDataFromOption(a[t].data[e]));h+=r.join(", ")+"\n\n"}if(this.option.yAxis)for(a=this.option.yAxis instanceof Array?this.option.yAxis:[this.option.yAxis],t=0,s=a.length;s>t;t++)if("category"==a[t].type){for(r=[],e=0,i=a[t].data.length;i>e;e++)r.push(this.getDataFromOption(a[t].data[e]));h+=r.join(", ")+"\n\n"}var l,d=this.option.series;for(t=0,s=d.length;s>t;t++){for(r=[],e=0,i=d[t].data.length;i>e;e++)n=d[t].data[e],l=d[t].type==o.CHART_TYPE_PIE||d[t].type==o.CHART_TYPE_MAP?(n.name||"-")+":":"",d[t].type==o.CHART_TYPE_SCATTER&&(n=this.getDataFromOption(n).join(", ")),r.push(l+this.getDataFromOption(n));h+=(d[t].name||"-")+" : \n",h+=r.join(d[t].type==o.CHART_TYPE_SCATTER?"\n":", "),h+="\n\n"}return h},_save:function(){var t=this.query(this.option,"toolbox.feature.dataView.contentToOption");if("function"!=typeof t){for(var e=this._textArea.value.split("\n"),i=[],s=0,n=e.length;n>s;s++)e[s]=this._trim(e[s]),""!==e[s]&&i.push(e[s]);this._contentToOption(i)}else t(this._textArea,this.option);this.hide();var r=this;setTimeout(function(){r.messageCenter&&r.messageCenter.dispatch(o.EVENT.DATA_VIEW_CHANGED,null,{option:r.option},r.myChart)},r.canvasSupported?800:100)},_contentToOption:function(t){var e,i,s,n,r,a,h,l=[],d=0;if(this.option.xAxis)for(l=this.option.xAxis instanceof Array?this.option.xAxis:[this.option.xAxis],e=0,n=l.length;n>e;e++)if("category"==(l[e].type||"category")){for(a=t[d].split(","),i=0,s=l[e].data.length;s>i;i++)h=this._trim(a[i]||""),r=l[e].data[i],"undefined"!=typeof l[e].data[i].value?l[e].data[i].value=h:l[e].data[i]=h;d++}if(this.option.yAxis)for(l=this.option.yAxis instanceof Array?this.option.yAxis:[this.option.yAxis],e=0,n=l.length;n>e;e++)if("category"==l[e].type){for(a=t[d].split(","),i=0,s=l[e].data.length;s>i;i++)h=this._trim(a[i]||""),r=l[e].data[i],"undefined"!=typeof l[e].data[i].value?l[e].data[i].value=h:l[e].data[i]=h;d++}var c=this.option.series;for(e=0,n=c.length;n>e;e++)if(d++,c[e].type==o.CHART_TYPE_SCATTER)for(var i=0,s=c[e].data.length;s>i;i++)a=t[d],h=a.replace(" ","").split(","),"undefined"!=typeof c[e].data[i].value?c[e].data[i].value=h:c[e].data[i]=h,d++;else{a=t[d].split(",");for(var i=0,s=c[e].data.length;s>i;i++)h=(a[i]||"").replace(/.*:/,""),h=this._trim(h),h="-"!=h&&""!==h?h-0:"-","undefined"!=typeof c[e].data[i].value?c[e].data[i].value=h:c[e].data[i]=h;d++}},_trim:function(t){var e=new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)","g");return t.replace(e,"")},_stop:function(t){t=t||window.event,t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},resize:function(){this._zrHeight=this.zr.getHeight(),this._zrWidth=this.zr.getWidth(),this._tDom.offsetHeight>10&&(this._sizeCssText="width:"+this._zrWidth+"px;height:"+this._zrHeight+"px;background-color:#fff;",this._tDom.style.cssText=this._gCssText+this._sizeCssText,this._textArea.style.cssText="display:block;margin:0 0 8px 0;padding:4px 6px;overflow:auto;width:100%;height:"+(this._zrHeight-100)+"px;")},dispose:function(){window.removeEventListener?(this._tDom.removeEventListener("click",this._stop),this._tDom.removeEventListener("mousewheel",this._stop),this._tDom.removeEventListener("mousemove",this._stop),this._tDom.removeEventListener("mousedown",this._stop),this._tDom.removeEventListener("mouseup",this._stop),this._tDom.removeEventListener("touchstart",this._stop),this._tDom.removeEventListener("touchmove",this._stop),this._tDom.removeEventListener("touchend",this._stop)):(this._tDom.detachEvent("onclick",this._stop),this._tDom.detachEvent("onmousewheel",this._stop),this._tDom.detachEvent("onmousemove",this._stop),this._tDom.detachEvent("onmousedown",this._stop),this._tDom.detachEvent("onmouseup",this._stop)),this._buttonRefresh.onclick=null,this._buttonClose.onclick=null,this._hasShow&&(this._tDom.removeChild(this._textArea),this._tDom.removeChild(this._buttonRefresh),this._tDom.removeChild(this._buttonClose)),this._textArea=null,this._buttonRefresh=null,this._buttonClose=null,this.dom.firstChild.removeChild(this._tDom),this._tDom=null}},s.inherits(e,i),t("../component").define("dataView",e),e}),i("zrender/tool/computeBoundingBox",["require","./vector","./curve"],function(t){function e(t,e,i){if(0!==t.length){for(var o=t[0][0],s=t[0][0],n=t[0][1],r=t[0][1],a=1;a<t.length;a++){var h=t[a];h[0]<o&&(o=h[0]),h[0]>s&&(s=h[0]),h[1]<n&&(n=h[1]),h[1]>r&&(r=h[1])}e[0]=o,e[1]=n,i[0]=s,i[1]=r}}function i(t,e,i,o,s,r){var a=[];n.cubicExtrema(t[0],e[0],i[0],o[0],a);for(var h=0;h<a.length;h++)a[h]=n.cubicAt(t[0],e[0],i[0],o[0],a[h]);var l=[];n.cubicExtrema(t[1],e[1],i[1],o[1],l);for(var h=0;h<l.length;h++)l[h]=n.cubicAt(t[1],e[1],i[1],o[1],l[h]);a.push(t[0],o[0]),l.push(t[1],o[1]);var d=Math.min.apply(null,a),c=Math.max.apply(null,a),p=Math.min.apply(null,l),u=Math.max.apply(null,l);s[0]=d,s[1]=p,r[0]=c,r[1]=u}function o(t,e,i,o,s){var r=n.quadraticExtremum(t[0],e[0],i[0]),a=n.quadraticExtremum(t[1],e[1],i[1]);r=Math.max(Math.min(r,1),0),a=Math.max(Math.min(a,1),0);var h=1-r,l=1-a,d=h*h*t[0]+2*h*r*e[0]+r*r*i[0],c=h*h*t[1]+2*h*r*e[1]+r*r*i[1],p=l*l*t[0]+2*l*a*e[0]+a*a*i[0],u=l*l*t[1]+2*l*a*e[1]+a*a*i[1];o[0]=Math.min(t[0],i[0],d,p),o[1]=Math.min(t[1],i[1],c,u),s[0]=Math.max(t[0],i[0],d,p),s[1]=Math.max(t[1],i[1],c,u)}var s=t("./vector"),n=t("./curve"),r=s.create(),a=s.create(),h=s.create(),l=function(t,e,i,o,n,l,d,c){if(Math.abs(o-n)>=2*Math.PI)return d[0]=t-i,d[1]=e-i,c[0]=t+i,void(c[1]=e+i);if(r[0]=Math.cos(o)*i+t,r[1]=Math.sin(o)*i+e,a[0]=Math.cos(n)*i+t,a[1]=Math.sin(n)*i+e,s.min(d,r,a),s.max(c,r,a),o%=2*Math.PI,0>o&&(o+=2*Math.PI),n%=2*Math.PI,0>n&&(n+=2*Math.PI),o>n&&!l?n+=2*Math.PI:n>o&&l&&(o+=2*Math.PI),l){var p=n;n=o,o=p}for(var u=0;n>u;u+=Math.PI/2)u>o&&(h[0]=Math.cos(u)*i+t,h[1]=Math.sin(u)*i+e,s.min(d,h,d),s.max(c,h,c))};return e.cubeBezier=i,e.quadraticBezier=o,e.arc=l,e}),i("echarts/util/shape/Cross",["require","zrender/shape/Base","zrender/shape/Line","zrender/tool/util","./normalIsCover"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("zrender/shape/Line"),s=t("zrender/tool/util");return e.prototype={type:"cross",buildPath:function(t,e){var i=e.rect;e.xStart=i.x,e.xEnd=i.x+i.width,e.yStart=e.yEnd=e.y,o.prototype.buildPath(t,e),e.xStart=e.xEnd=e.x,e.yStart=i.y,e.yEnd=i.y+i.height,o.prototype.buildPath(t,e)},getRect:function(t){return t.rect},isCover:t("./normalIsCover")},s.inherits(e,i),e}),i("echarts/util/shape/Candle",["require","zrender/shape/Base","zrender/tool/util","./normalIsCover"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("zrender/tool/util");return e.prototype={type:"candle",_numberOrder:function(t,e){return e-t},buildPath:function(t,e){var i=o.clone(e.y).sort(this._numberOrder);t.moveTo(e.x,i[3]),t.lineTo(e.x,i[2]),t.moveTo(e.x-e.width/2,i[2]),t.rect(e.x-e.width/2,i[2],e.width,i[1]-i[2]),t.moveTo(e.x,i[1]),t.lineTo(e.x,i[0])},getRect:function(t){if(!t.__rect){var e=0;("stroke"==t.brushType||"fill"==t.brushType)&&(e=t.lineWidth||1);var i=o.clone(t.y).sort(this._numberOrder);t.__rect={x:Math.round(t.x-t.width/2-e/2),y:Math.round(i[3]-e/2),width:t.width+e,height:i[0]-i[3]+e}}return t.__rect},isCover:t("./normalIsCover")},o.inherits(e,i),e}),i("echarts/component/categoryAxis",["require","./base","zrender/shape/Text","zrender/shape/Line","zrender/shape/Rectangle","../config","zrender/tool/util","zrender/tool/area","../component"],function(t){function e(t,e,o,s,n,r){if(s.data.length<1)return void console.error("option.data.length < 1.");i.call(this,t,e,o,s,n),this.grid=this.component.grid;for(var a in r)this[a]=r[a];this.refresh(s)}var i=t("./base"),o=t("zrender/shape/Text"),s=t("zrender/shape/Line"),n=t("zrender/shape/Rectangle"),r=t("../config");r.categoryAxis={zlevel:0,z:0,show:!0,position:"bottom",name:"",nameLocation:"end",nameTextStyle:{},boundaryGap:!0,axisLine:{show:!0,onZero:!0,lineStyle:{color:"#48b",width:2,type:"solid"}},axisTick:{show:!0,interval:"auto",inside:!1,length:5,lineStyle:{color:"#333",width:1}},axisLabel:{show:!0,interval:"auto",rotate:0,margin:8,textStyle:{color:"#333"}},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}};var a=t("zrender/tool/util"),h=t("zrender/tool/area");return e.prototype={type:r.COMPONENT_TYPE_AXIS_CATEGORY,_getReformedLabel:function(t){var e=this.getDataFromOption(this.option.data[t]),i=this.option.data[t].formatter||this.option.axisLabel.formatter;return i&&("function"==typeof i?e=i.call(this.myChart,e):"string"==typeof i&&(e=i.replace("{value}",e))),e},_getInterval:function(){var t=this.option.axisLabel.interval;if("auto"==t){var e=this.option.axisLabel.textStyle.fontSize,i=this.option.data,o=this.option.data.length;if(this.isHorizontal())if(o>3){var s,n,r=this.getGap(),l=!1,d=Math.floor(.5/r);for(d=1>d?1:d,t=Math.floor(15/r);!l&&o>t;){t+=d,l=!0,s=Math.floor(r*t);for(var c=Math.floor((o-1)/t)*t;c>=0;c-=t){if(0!==this.option.axisLabel.rotate)n=e;else if(i[c].textStyle)n=h.getTextWidth(this._getReformedLabel(c),this.getFont(a.merge(i[c].textStyle,this.option.axisLabel.textStyle)));else{var p=this._getReformedLabel(c)+"",u=(p.match(/\w/g)||"").length,g=p.length-u;n=u*e*2/3+g*e}if(n>s){l=!1;break}}}}else t=1;else if(o>3){var r=this.getGap();for(t=Math.floor(11/r);e>r*t-6&&o>t;)t++}else t=1}else t="function"==typeof t?1:t-0+1;return t},_buildShape:function(){if(this._interval=this._getInterval(),this.option.show){this.option.splitArea.show&&this._buildSplitArea(),this.option.splitLine.show&&this._buildSplitLine(),this.option.axisLine.show&&this._buildAxisLine(),this.option.axisTick.show&&this._buildAxisTick(),this.option.axisLabel.show&&this._buildAxisLabel();for(var t=0,e=this.shapeList.length;e>t;t++)this.zr.addShape(this.shapeList[t])}},_buildAxisTick:function(){var t,e=this.option.data,i=this.option.data.length,o=this.option.axisTick,n=o.length,r=o.lineStyle.color,a=o.lineStyle.width,h="function"==typeof o.interval?o.interval:"auto"==o.interval&&"function"==typeof this.option.axisLabel.interval?this.option.axisLabel.interval:!1,l=h?1:"auto"==o.interval?this._interval:o.interval-0+1,d=o.onGap,c=d?this.getGap()/2:"undefined"==typeof d&&this.option.boundaryGap?this.getGap()/2:0,p=c>0?-l:0;if(this.isHorizontal())for(var u,g="bottom"==this.option.position?o.inside?this.grid.getYend()-n-1:this.grid.getYend()+1:o.inside?this.grid.getY()+1:this.grid.getY()-n-1,f=p;i>f;f+=l)(!h||h(f,e[f]))&&(u=this.subPixelOptimize(this.getCoordByIndex(f)+(f>=0?c:0),a),t={_axisShape:"axisTick",zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:u,yStart:g,xEnd:u,yEnd:g+n,strokeColor:r,lineWidth:a}},this.shapeList.push(new s(t)));else for(var m,_="left"==this.option.position?o.inside?this.grid.getX()+1:this.grid.getX()-n-1:o.inside?this.grid.getXend()-n-1:this.grid.getXend()+1,f=p;i>f;f+=l)(!h||h(f,e[f]))&&(m=this.subPixelOptimize(this.getCoordByIndex(f)-(f>=0?c:0),a),t={_axisShape:"axisTick",zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:_,yStart:m,xEnd:_+n,yEnd:m,strokeColor:r,lineWidth:a}},this.shapeList.push(new s(t)))},_buildAxisLabel:function(){var t,e,i=this.option.data,s=this.option.data.length,n=this.option.axisLabel,r=n.rotate,h=n.margin,l=n.clickable,d=n.textStyle,c="function"==typeof n.interval?n.interval:!1;if(this.isHorizontal()){var p,u;"bottom"==this.option.position?(p=this.grid.getYend()+h,u="top"):(p=this.grid.getY()-h,u="bottom");for(var g=0;s>g;g+=this._interval)c&&!c(g,i[g])||""===this._getReformedLabel(g)||(e=a.merge(i[g].textStyle||{},d),t={zlevel:this.getZlevelBase(),z:this.getZBase()+3,hoverable:!1,style:{x:this.getCoordByIndex(g),y:p,color:e.color,text:this._getReformedLabel(g),textFont:this.getFont(e),textAlign:e.align||"center",textBaseline:e.baseline||u}},r&&(t.style.textAlign=r>0?"bottom"==this.option.position?"right":"left":"bottom"==this.option.position?"left":"right",t.rotation=[r*Math.PI/180,t.style.x,t.style.y]),this.shapeList.push(new o(this._axisLabelClickable(l,t))))}else{var f,m;"left"==this.option.position?(f=this.grid.getX()-h,m="right"):(f=this.grid.getXend()+h,m="left");for(var g=0;s>g;g+=this._interval)c&&!c(g,i[g])||""===this._getReformedLabel(g)||(e=a.merge(i[g].textStyle||{},d),t={zlevel:this.getZlevelBase(),z:this.getZBase()+3,hoverable:!1,style:{x:f,y:this.getCoordByIndex(g),color:e.color,text:this._getReformedLabel(g),textFont:this.getFont(e),textAlign:e.align||m,textBaseline:e.baseline||0===g&&""!==this.option.name?"bottom":g==s-1&&""!==this.option.name?"top":"middle"}},r&&(t.rotation=[r*Math.PI/180,t.style.x,t.style.y]),this.shapeList.push(new o(this._axisLabelClickable(l,t))))}},_buildSplitLine:function(){var t,e=this.option.data,i=this.option.data.length,o=this.option.splitLine,n=o.lineStyle.type,r=o.lineStyle.width,a=o.lineStyle.color;a=a instanceof Array?a:[a];var h=a.length,l="function"==typeof this.option.axisLabel.interval?this.option.axisLabel.interval:!1,d=o.onGap,c=d?this.getGap()/2:"undefined"==typeof d&&this.option.boundaryGap?this.getGap()/2:0;if(i-=d||"undefined"==typeof d&&this.option.boundaryGap?1:0,this.isHorizontal())for(var p,u=this.grid.getY(),g=this.grid.getYend(),f=0;i>f;f+=this._interval)(!l||l(f,e[f]))&&(p=this.subPixelOptimize(this.getCoordByIndex(f)+c,r),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:p,yStart:u,xEnd:p,yEnd:g,strokeColor:a[f/this._interval%h],lineType:n,lineWidth:r}},this.shapeList.push(new s(t)));else for(var m,_=this.grid.getX(),y=this.grid.getXend(),f=0;i>f;f+=this._interval)(!l||l(f,e[f]))&&(m=this.subPixelOptimize(this.getCoordByIndex(f)-c,r),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:_,yStart:m,xEnd:y,yEnd:m,strokeColor:a[f/this._interval%h],lineType:n,lineWidth:r}},this.shapeList.push(new s(t)))},_buildSplitArea:function(){var t,e=this.option.data,i=this.option.splitArea,o=i.areaStyle.color;if(o instanceof Array){var s=o.length,r=this.option.data.length,a="function"==typeof this.option.axisLabel.interval?this.option.axisLabel.interval:!1,h=i.onGap,l=h?this.getGap()/2:"undefined"==typeof h&&this.option.boundaryGap?this.getGap()/2:0;if(this.isHorizontal())for(var d,c=this.grid.getY(),p=this.grid.getHeight(),u=this.grid.getX(),g=0;r>=g;g+=this._interval)a&&!a(g,e[g])&&r>g||(d=r>g?this.getCoordByIndex(g)+l:this.grid.getXend(),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:u,y:c,width:d-u,height:p,color:o[g/this._interval%s]}},this.shapeList.push(new n(t)),u=d);else for(var f,m=this.grid.getX(),_=this.grid.getWidth(),y=this.grid.getYend(),g=0;r>=g;g+=this._interval)a&&!a(g,e[g])&&r>g||(f=r>g?this.getCoordByIndex(g)-l:this.grid.getY(),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:m,y:f,width:_,height:y-f,color:o[g/this._interval%s]}},this.shapeList.push(new n(t)),y=f)}else t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this.grid.getX(),y:this.grid.getY(),width:this.grid.getWidth(),height:this.grid.getHeight(),color:o}},this.shapeList.push(new n(t))},refresh:function(t){t&&(this.option=this.reformOption(t),this.option.axisLabel.textStyle=this.getTextStyle(this.option.axisLabel.textStyle)),this.clear(),this._buildShape()},getGap:function(){var t=this.option.data.length,e=this.isHorizontal()?this.grid.getWidth():this.grid.getHeight();return this.option.boundaryGap?e/t:e/(t>1?t-1:1)},getCoord:function(t){for(var e=this.option.data,i=e.length,o=this.getGap(),s=this.option.boundaryGap?o/2:0,n=0;i>n;n++){if(this.getDataFromOption(e[n])==t)return s=this.isHorizontal()?this.grid.getX()+s:this.grid.getYend()-s;s+=o}},getCoordByIndex:function(t){if(0>t)return this.isHorizontal()?this.grid.getX():this.grid.getYend();if(t>this.option.data.length-1)return this.isHorizontal()?this.grid.getXend():this.grid.getY();var e=this.getGap(),i=this.option.boundaryGap?e/2:0;return i+=t*e,i=this.isHorizontal()?this.grid.getX()+i:this.grid.getYend()-i},getNameByIndex:function(t){return this.getDataFromOption(this.option.data[t])},getIndexByName:function(t){for(var e=this.option.data,i=e.length,o=0;i>o;o++)if(this.getDataFromOption(e[o])==t)return o;return-1},getValueFromCoord:function(){return""},isMainAxis:function(t){return t%this._interval===0}},a.inherits(e,i),t("../component").define("categoryAxis",e),e}),i("echarts/util/shape/Chain",["require","zrender/shape/Base","./Icon","zrender/shape/util/dashedLineTo","zrender/tool/util","zrender/tool/matrix"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("./Icon"),s=t("zrender/shape/util/dashedLineTo"),n=t("zrender/tool/util"),r=t("zrender/tool/matrix");return e.prototype={type:"chain",brush:function(t,e){var i=this.style;e&&(i=this.getHighlightStyle(i,this.highlightStyle||{})),t.save(),this.setContext(t,i),this.setTransform(t),t.save(),t.beginPath(),this.buildLinePath(t,i),t.stroke(),t.restore(),this.brushSymbol(t,i),t.restore()},buildLinePath:function(t,e){var i=e.x,o=e.y+5,n=e.width,r=e.height/2-10;if(t.moveTo(i,o),t.lineTo(i,o+r),t.moveTo(i+n,o),t.lineTo(i+n,o+r),t.moveTo(i,o+r/2),e.lineType&&"solid"!=e.lineType){if("dashed"==e.lineType||"dotted"==e.lineType){var a=(e.lineWidth||1)*("dashed"==e.lineType?5:1);s(t,i,o+r/2,i+n,o+r/2,a)}}else t.lineTo(i+n,o+r/2)},brushSymbol:function(t,e){var i=e.y+e.height/4;t.save();for(var s,n=e.chainPoint,r=0,a=n.length;a>r;r++){if(s=n[r],"none"!=s.symbol){t.beginPath();var h=s.symbolSize;o.prototype.buildPath(t,{iconType:s.symbol,x:s.x-h,y:i-h,width:2*h,height:2*h,n:s.n}),t.fillStyle=s.isEmpty?"#fff":e.strokeColor,t.closePath(),t.fill(),t.stroke()}s.showLabel&&(t.font=s.textFont,t.fillStyle=s.textColor,t.textAlign=s.textAlign,t.textBaseline=s.textBaseline,s.rotation?(t.save(),this._updateTextTransform(t,s.rotation),t.fillText(s.name,s.textX,s.textY),t.restore()):t.fillText(s.name,s.textX,s.textY))}t.restore()},_updateTextTransform:function(t,e){var i=r.create();if(r.identity(i),0!==e[0]){var o=e[1]||0,s=e[2]||0;(o||s)&&r.translate(i,i,[-o,-s]),r.rotate(i,i,e[0]),(o||s)&&r.translate(i,i,[o,s])}t.transform.apply(t,i)},isCover:function(t,e){var i=this.style;return t>=i.x&&t<=i.x+i.width&&e>=i.y&&e<=i.y+i.height?!0:!1}},n.inherits(e,i),e}),i("echarts/component/valueAxis",["require","./base","zrender/shape/Text","zrender/shape/Line","zrender/shape/Rectangle","../config","../util/date","zrender/tool/util","../util/smartSteps","../util/accMath","../util/smartLogSteps","../component"],function(t){function e(t,e,o,s,n,r,a){if(!a||0===a.length)return void console.err("option.series.length == 0.");i.call(this,t,e,o,s,n),this.series=a,this.grid=this.component.grid;for(var h in r)this[h]=r[h];this.refresh(s,a)}var i=t("./base"),o=t("zrender/shape/Text"),s=t("zrender/shape/Line"),n=t("zrender/shape/Rectangle"),r=t("../config");r.valueAxis={zlevel:0,z:0,show:!0,position:"left",name:"",nameLocation:"end",nameTextStyle:{},boundaryGap:[0,0],axisLine:{show:!0,onZero:!0,lineStyle:{color:"#48b",width:2,type:"solid"}},axisTick:{show:!1,inside:!1,length:5,lineStyle:{color:"#333",width:1}},axisLabel:{show:!0,rotate:0,margin:8,textStyle:{color:"#333"}},splitLine:{show:!0,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}};var a=t("../util/date"),h=t("zrender/tool/util");return e.prototype={type:r.COMPONENT_TYPE_AXIS_VALUE,_buildShape:function(){if(this._hasData=!1,this._calculateValue(),this._hasData&&this.option.show){this.option.splitArea.show&&this._buildSplitArea(),this.option.splitLine.show&&this._buildSplitLine(),this.option.axisLine.show&&this._buildAxisLine(),this.option.axisTick.show&&this._buildAxisTick(),this.option.axisLabel.show&&this._buildAxisLabel();for(var t=0,e=this.shapeList.length;e>t;t++)this.zr.addShape(this.shapeList[t])}},_buildAxisTick:function(){var t,e=this._valueList,i=this._valueList.length,o=this.option.axisTick,n=o.length,r=o.lineStyle.color,a=o.lineStyle.width;if(this.isHorizontal())for(var h,l="bottom"===this.option.position?o.inside?this.grid.getYend()-n-1:this.grid.getYend()+1:o.inside?this.grid.getY()+1:this.grid.getY()-n-1,d=0;i>d;d++)h=this.subPixelOptimize(this.getCoord(e[d]),a),t={_axisShape:"axisTick",zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:h,yStart:l,xEnd:h,yEnd:l+n,strokeColor:r,lineWidth:a}},this.shapeList.push(new s(t));else for(var c,p="left"===this.option.position?o.inside?this.grid.getX()+1:this.grid.getX()-n-1:o.inside?this.grid.getXend()-n-1:this.grid.getXend()+1,d=0;i>d;d++)c=this.subPixelOptimize(this.getCoord(e[d]),a),t={_axisShape:"axisTick",zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:p,yStart:c,xEnd:p+n,yEnd:c,strokeColor:r,lineWidth:a}},this.shapeList.push(new s(t))},_buildAxisLabel:function(){var t,e=this._valueList,i=this._valueList.length,s=this.option.axisLabel.rotate,n=this.option.axisLabel.margin,r=this.option.axisLabel.clickable,a=this.option.axisLabel.textStyle;if(this.isHorizontal()){var h,l;"bottom"===this.option.position?(h=this.grid.getYend()+n,l="top"):(h=this.grid.getY()-n,l="bottom");for(var d=0;i>d;d++)t={zlevel:this.getZlevelBase(),z:this.getZBase()+3,hoverable:!1,style:{x:this.getCoord(e[d]),y:h,color:"function"==typeof a.color?a.color(e[d]):a.color,text:this._valueLabel[d],textFont:this.getFont(a),textAlign:a.align||"center",textBaseline:a.baseline||l}},s&&(t.style.textAlign=s>0?"bottom"===this.option.position?"right":"left":"bottom"===this.option.position?"left":"right",t.rotation=[s*Math.PI/180,t.style.x,t.style.y]),this.shapeList.push(new o(this._axisLabelClickable(r,t)))}else{var c,p;"left"===this.option.position?(c=this.grid.getX()-n,p="right"):(c=this.grid.getXend()+n,p="left");for(var d=0;i>d;d++)t={zlevel:this.getZlevelBase(),z:this.getZBase()+3,hoverable:!1,style:{x:c,y:this.getCoord(e[d]),color:"function"==typeof a.color?a.color(e[d]):a.color,text:this._valueLabel[d],textFont:this.getFont(a),textAlign:a.align||p,textBaseline:a.baseline||(0===d&&""!==this.option.name?"bottom":d===i-1&&""!==this.option.name?"top":"middle")}},s&&(t.rotation=[s*Math.PI/180,t.style.x,t.style.y]),this.shapeList.push(new o(this._axisLabelClickable(r,t)))}},_buildSplitLine:function(){var t,e=this._valueList,i=this._valueList.length,o=this.option.splitLine,n=o.lineStyle.type,r=o.lineStyle.width,a=o.lineStyle.color;a=a instanceof Array?a:[a];var h=a.length;if(this.isHorizontal())for(var l,d=this.grid.getY(),c=this.grid.getYend(),p=0;i>p;p++)l=this.subPixelOptimize(this.getCoord(e[p]),r),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:l,yStart:d,xEnd:l,yEnd:c,strokeColor:a[p%h],lineType:n,lineWidth:r}},this.shapeList.push(new s(t));else for(var u,g=this.grid.getX(),f=this.grid.getXend(),p=0;i>p;p++)u=this.subPixelOptimize(this.getCoord(e[p]),r),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{xStart:g,yStart:u,xEnd:f,yEnd:u,strokeColor:a[p%h],lineType:n,lineWidth:r}},this.shapeList.push(new s(t))},_buildSplitArea:function(){var t,e=this.option.splitArea.areaStyle.color;if(e instanceof Array){var i=e.length,o=this._valueList,s=this._valueList.length;if(this.isHorizontal())for(var r,a=this.grid.getY(),h=this.grid.getHeight(),l=this.grid.getX(),d=0;s>=d;d++)r=s>d?this.getCoord(o[d]):this.grid.getXend(),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:l,y:a,width:r-l,height:h,color:e[d%i]}},this.shapeList.push(new n(t)),l=r;else for(var c,p=this.grid.getX(),u=this.grid.getWidth(),g=this.grid.getYend(),d=0;s>=d;d++)c=s>d?this.getCoord(o[d]):this.grid.getY(),t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:p,y:c,width:u,height:g-c,color:e[d%i]}},this.shapeList.push(new n(t)),g=c}else t={zlevel:this.getZlevelBase(),z:this.getZBase(),hoverable:!1,style:{x:this.grid.getX(),y:this.grid.getY(),width:this.grid.getWidth(),height:this.grid.getHeight(),color:e}},this.shapeList.push(new n(t))},_calculateValue:function(){if(isNaN(this.option.min-0)||isNaN(this.option.max-0)){for(var t,e,i={},o=this.component.legend,s=0,n=this.series.length;n>s;s++)!(this.series[s].type!=r.CHART_TYPE_LINE&&this.series[s].type!=r.CHART_TYPE_BAR&&this.series[s].type!=r.CHART_TYPE_SCATTER&&this.series[s].type!=r.CHART_TYPE_K&&this.series[s].type!=r.CHART_TYPE_EVENTRIVER||o&&!o.isSelected(this.series[s].name)||(t=this.series[s].xAxisIndex||0,e=this.series[s].yAxisIndex||0,this.option.xAxisIndex!=t&&this.option.yAxisIndex!=e||!this._calculSum(i,s)));var a;for(var s in i){a=i[s];for(var h=0,l=a.length;l>h;h++)if(!isNaN(a[h])){this._hasData=!0,this._min=a[h],this._max=a[h];break}if(this._hasData)break}for(var s in i){a=i[s];for(var h=0,l=a.length;l>h;h++)isNaN(a[h])||(this._min=Math.min(this._min,a[h]),this._max=Math.max(this._max,a[h]))}var d="log"!==this.option.type?this.option.boundaryGap:[0,0],c=Math.abs(this._max-this._min);this._min=isNaN(this.option.min-0)?this._min-Math.abs(c*d[0]):this.option.min-0,this._max=isNaN(this.option.max-0)?this._max+Math.abs(c*d[1]):this.option.max-0,this._min===this._max&&(0===this._max?this._max=1:this._max>0?this._min=this._max/this.option.splitNumber!=null?this.option.splitNumber:5:this._max=this._max/this.option.splitNumber!=null?this.option.splitNumber:5),"time"===this.option.type?this._reformTimeValue():"log"===this.option.type?this._reformLogValue():this._reformValue(this.option.scale)}else this._hasData=!0,this._min=this.option.min-0,this._max=this.option.max-0,"time"===this.option.type?this._reformTimeValue():"log"===this.option.type?this._reformLogValue():this._customerValue()},_calculSum:function(t,e){var i,o,s=this.series[e].name||"kener";if(this.series[e].stack){var n="__Magic_Key_Positive__"+this.series[e].stack,h="__Magic_Key_Negative__"+this.series[e].stack;t[n]=t[n]||[],t[h]=t[h]||[],t[s]=t[s]||[],o=this.series[e].data;for(var l=0,d=o.length;d>l;l++)i=this.getDataFromOption(o[l]),"-"!==i&&(i-=0,i>=0?null!=t[n][l]?t[n][l]+=i:t[n][l]=i:null!=t[h][l]?t[h][l]+=i:t[h][l]=i,this.option.scale&&t[s].push(i))}else if(t[s]=t[s]||[],this.series[e].type!=r.CHART_TYPE_EVENTRIVER){o=this.series[e].data;for(var l=0,d=o.length;d>l;l++)i=this.getDataFromOption(o[l]),this.series[e].type===r.CHART_TYPE_K?(t[s].push(i[0]),t[s].push(i[1]),t[s].push(i[2]),t[s].push(i[3])):i instanceof Array?(-1!=this.option.xAxisIndex&&t[s].push("time"!=this.option.type?i[0]:a.getNewDate(i[0])),-1!=this.option.yAxisIndex&&t[s].push("time"!=this.option.type?i[1]:a.getNewDate(i[1]))):t[s].push(i)}else{o=this.series[e].data;for(var l=0,d=o.length;d>l;l++)for(var c=o[l].evolution,p=0,u=c.length;u>p;p++)t[s].push(a.getNewDate(c[p].time))}},_reformValue:function(e){var i=t("../util/smartSteps"),o=this.option.splitNumber;!e&&this._min>=0&&this._max>=0&&(this._min=0),!e&&this._min<=0&&this._max<=0&&(this._max=0);var s=i(this._min,this._max,o);o=null!=o?o:s.secs,this._min=s.min,this._max=s.max,this._valueList=s.pnts,this._reformLabelData()},_reformTimeValue:function(){var t=null!=this.option.splitNumber?this.option.splitNumber:5,e=a.getAutoFormatter(this._min,this._max,t),i=e.formatter,o=e.gapValue;this._valueList=[a.getNewDate(this._min)];var s;switch(i){case"week":s=a.nextMonday(this._min);break;case"month":s=a.nextNthOnMonth(this._min,1);break;case"quarter":s=a.nextNthOnQuarterYear(this._min,1);break;case"half-year":s=a.nextNthOnHalfYear(this._min,1);break;case"year":s=a.nextNthOnYear(this._min,1);break;default:72e5>=o?s=(Math.floor(this._min/o)+1)*o:(s=a.getNewDate(this._min- -o),s.setHours(6*Math.round(s.getHours()/6)),s.setMinutes(0),s.setSeconds(0))}for(s-this._min<o/2&&(s-=-o),e=a.getNewDate(s),t*=1.5;t-->=0&&(("month"==i||"quarter"==i||"half-year"==i||"year"==i)&&e.setDate(1),!(this._max-e<o/2));)this._valueList.push(e),e=a.getNewDate(e- -o);this._valueList.push(a.getNewDate(this._max)),this._reformLabelData(function(t){return function(e){return a.format(t,e)
}}(i))},_customerValue:function(){var e=t("../util/accMath"),i=null!=this.option.splitNumber?this.option.splitNumber:5,o=(this._max-this._min)/i;this._valueList=[];for(var s=0;i>=s;s++)this._valueList.push(e.accAdd(this._min,e.accMul(o,s)));this._reformLabelData()},_reformLogValue:function(){var e=this.option,i=t("../util/smartLogSteps")({dataMin:this._min,dataMax:this._max,logPositive:e.logPositive,logLabelBase:e.logLabelBase,splitNumber:e.splitNumber});this._min=i.dataMin,this._max=i.dataMax,this._valueList=i.tickList,this._dataMappingMethods=i.dataMappingMethods,this._reformLabelData(i.labelFormatter)},_reformLabelData:function(t){this._valueLabel=[];var e=this.option.axisLabel.formatter;if(e)for(var i=0,o=this._valueList.length;o>i;i++)"function"==typeof e?this._valueLabel.push(t?e.call(this.myChart,this._valueList[i],t):e.call(this.myChart,this._valueList[i])):"string"==typeof e&&this._valueLabel.push(t?a.format(e,this._valueList[i]):e.replace("{value}",this._valueList[i]));else for(var i=0,o=this._valueList.length;o>i;i++)this._valueLabel.push(t?t(this._valueList[i]):this.numAddCommas(this._valueList[i]))},getExtremum:function(){this._calculateValue();var t=this._dataMappingMethods;return{min:this._min,max:this._max,dataMappingMethods:t?h.merge({},t):null}},refresh:function(t,e){t&&(this.option=this.reformOption(t),this.option.axisLabel.textStyle=h.merge(this.option.axisLabel.textStyle||{},this.ecTheme.textStyle),this.series=e),this.zr&&(this.clear(),this._buildShape())},getCoord:function(t){this._dataMappingMethods&&(t=this._dataMappingMethods.value2Coord(t)),t=t<this._min?this._min:t,t=t>this._max?this._max:t;var e;return e=this.isHorizontal()?this.grid.getX()+(t-this._min)/(this._max-this._min)*this.grid.getWidth():this.grid.getYend()-(t-this._min)/(this._max-this._min)*this.grid.getHeight()},getCoordSize:function(t){return Math.abs(this.isHorizontal()?t/(this._max-this._min)*this.grid.getWidth():t/(this._max-this._min)*this.grid.getHeight())},getValueFromCoord:function(t){var e;return this.isHorizontal()?(t=t<this.grid.getX()?this.grid.getX():t,t=t>this.grid.getXend()?this.grid.getXend():t,e=this._min+(t-this.grid.getX())/this.grid.getWidth()*(this._max-this._min)):(t=t<this.grid.getY()?this.grid.getY():t,t=t>this.grid.getYend()?this.grid.getYend():t,e=this._max-(t-this.grid.getY())/this.grid.getHeight()*(this._max-this._min)),this._dataMappingMethods&&(e=this._dataMappingMethods.coord2Value(e)),e.toFixed(2)-0},isMaindAxis:function(t){for(var e=0,i=this._valueList.length;i>e;e++)if(this._valueList[e]===t)return!0;return!1}},h.inherits(e,i),t("../component").define("valueAxis",e),e}),i("echarts/util/smartSteps",[],function(){function t(t){return w.log(A(t))/w.LN10}function e(t){return w.pow(10,t)}function i(t){return t===E(t)}function o(t,e,o,s){x=s||{},v=x.steps||z,b=x.secs||C,o=L(+o||0)%99,t=+t||0,e=+e||0,S=T=0,"min"in x&&(t=+x.min||0,S=1),"max"in x&&(e=+x.max||0,T=1),t>e&&(e=[t,t=e][0]);var n=e-t;if(S&&T)return y(t,e,o);if((o||5)>n){if(i(t)&&i(e))return u(t,e,o);if(0===n)return g(t,e,o)}return l(t,e,o)}function s(t,i,o,s){s=s||0;var a=n((i-t)/o,-1),h=n(t,-1,1),l=n(i,-1),d=w.min(a.e,h.e,l.e);0===h.c?d=w.min(a.e,l.e):0===l.c&&(d=w.min(a.e,h.e)),r(a,{c:0,e:d}),r(h,a,1),r(l,a),s+=d,t=h.c,i=l.c;for(var c=(i-t)/o,p=e(s),u=0,g=[],f=o+1;f--;)g[f]=(t+c*f)*p;if(0>s){u=m(p),c=+(c*p).toFixed(u),t=+(t*p).toFixed(u),i=+(i*p).toFixed(u);for(var f=g.length;f--;)g[f]=g[f].toFixed(u),0===+g[f]&&(g[f]="0")}else t*=p,i*=p,c*=p;return b=0,v=0,x=0,{min:t,max:i,secs:o,step:c,fix:u,exp:s,pnts:g}}function n(o,s,n){s=L(s%10)||2,0>s&&(i(o)?s=(""+A(o)).replace(/0+$/,"").length||1:(o=o.toFixed(15).replace(/0+$/,""),s=o.replace(".","").replace(/^[-0]+/,"").length,o=+o));var r=E(t(o))-s+1,a=+(o*e(-r)).toFixed(15)||0;return a=n?E(a):M(a),!a&&(r=0),(""+A(a)).length>s&&(r+=1,a/=10),{c:a,e:r}}function r(t,i,o){var s=i.e-t.e;s&&(t.e+=s,t.c*=e(-s),t.c=o?E(t.c):M(t.c))}function a(t,e,i){t.e<e.e?r(e,t,i):r(t,e,i)}function h(t,e){e=e||z,t=n(t);for(var i=t.c,o=0;i>e[o];)o++;if(!e[o])for(i/=10,t.e+=1,o=0;i>e[o];)o++;return t.c=e[o],t}function l(t,e,o){var a,l=o||+b.slice(-1),g=h((e-t)/l,v),m=n(e-t),y=n(t,-1,1),x=n(e,-1);if(r(m,g),r(y,g,1),r(x,g),o?a=c(y,x,l):l=d(y,x),i(t)&&i(e)&&t*e>=0){if(l>e-t)return u(t,e,l);l=p(t,e,o,y,x,l)}var z=f(t,e,y.c,x.c);return y.c=z[0],x.c=z[1],(S||T)&&_(t,e,y,x),s(y.c,x.c,l,x.e)}function d(t,i){for(var o,s,n,r,a=[],l=b.length;l--;)o=b[l],s=h((i.c-t.c)/o,v),s=s.c*e(s.e),n=E(t.c/s)*s,r=M(i.c/s)*s,a[l]={min:n,max:r,step:s,span:r-n};return a.sort(function(t,e){var i=t.span-e.span;return 0===i&&(i=t.step-e.step),i}),a=a[0],o=a.span/a.step,t.c=a.min,i.c=a.max,3>o?2*o:o}function c(t,i,o){for(var s,n,r=i.c,a=(i.c-t.c)/o-1;r>t.c;)a=h(a+1,v),a=a.c*e(a.e),s=a*o,n=M(i.c/a)*a,r=n-s;var l=t.c-r,d=n-i.c,c=l-d;return c>1.1*a&&(c=L(c/a/2)*a,r+=c,n+=c),t.c=r,i.c=n,a}function p(t,o,s,n,r,a){var h=r.c-n.c,l=h/a*e(r.e);if(!i(l)&&(l=E(l),h=l*a,o-t>h&&(l+=1,h=l*a,!s&&l*(a-1)>=o-t&&(a-=1,h=l*a)),h>=o-t)){var d=h-(o-t);n.c=L(t-d/2),r.c=L(o+d/2),n.e=0,r.e=0}return a}function u(t,e,i){if(i=i||5,S)e=t+i;else if(T)t=e-i;else{var o=i-(e-t),n=L(t-o/2),r=L(e+o/2),a=f(t,e,n,r);t=a[0],e=a[1]}return s(t,e,i)}function g(t,e,i){i=i||5;var o=w.min(A(e/i),i)/2.1;return S?e=t+o:T?t=e-o:(t-=o,e+=o),l(t,e,i)}function f(t,e,i,o){return t>=0&&0>i?(o-=i,i=0):0>=e&&o>0&&(i-=o,o=0),[i,o]}function m(t){return t=(+t).toFixed(15).split("."),t.pop().replace(/0+$/,"").length}function _(t,e,i,o){if(S){var s=n(t,4,1);i.e-s.e>6&&(s={c:0,e:i.e}),a(i,s),a(o,s),o.c+=s.c-i.c,i.c=s.c}else if(T){var r=n(e,4);o.e-r.e>6&&(r={c:0,e:o.e}),a(i,r),a(o,r),i.c+=r.c-o.c,o.c=r.c}}function y(t,e,i){var o=i?[i]:b,a=e-t;if(0===a)return e=n(e,3),i=o[0],e.c=L(e.c+i/2),s(e.c-i,e.c,i,e.e);A(e/a)<1e-6&&(e=0),A(t/a)<1e-6&&(t=0);var h,l,d,c=[[5,10],[10,2],[50,10],[100,2]],p=[],u=[],g=n(e-t,3),f=n(t,-1,1),m=n(e,-1);r(f,g,1),r(m,g),a=m.c-f.c,g.c=a;for(var _=o.length;_--;){i=o[_],h=M(a/i),l=h*i-a,d=3*(l+3),d+=2*(i-o[0]+2),i%5===0&&(d-=10);for(var y=c.length;y--;)h%c[y][0]===0&&(d/=c[y][1]);u[_]=[i,h,l,d].join(),p[_]={secs:i,step:h,delta:l,score:d}}return p.sort(function(t,e){return t.score-e.score}),p=p[0],f.c=L(f.c-p.delta/2),m.c=L(m.c+p.delta/2),s(f.c,m.c,p.secs,g.e)}var x,v,b,S,T,z=[10,20,25,50],C=[4,5,6],w=Math,L=w.round,E=w.floor,M=w.ceil,A=w.abs;return o}),i("echarts/util/smartLogSteps",["require","./number"],function(t){function e(t){return i(),m=t||{},o(),s(),[n(),i()][0]}function i(){p=m=y=f=x=v=_=b=u=g=null}function o(){u=m.logLabelBase,null==u?(g="plain",u=10,f=A):(u=+u,1>u&&(u=10),g="exponent",f=z(u)),_=m.splitNumber,null==_&&(_=R);var t=parseFloat(m.dataMin),e=parseFloat(m.dataMax);isFinite(t)||isFinite(e)?isFinite(t)?isFinite(e)?t>e&&(e=[t,t=e][0]):e=t:t=e:t=e=1,p=m.logPositive,null==p&&(p=e>0||0===t),x=p?t:-e,v=p?e:-t,I>x&&(x=I),I>v&&(v=I)}function s(){function t(){_>d&&(_=d);var t=E(h(d/_)),e=L(h(d/t)),i=t*e,o=(i-p)/2,s=E(h(r-o));c(s-r)&&(s-=1),y=-s*f;for(var a=s;n>=a-t;a+=t)b.push(C(u,a))}function e(){for(var t=i(l,0),e=t+2;e>t&&s(t+1)+o(t+1)*O<r;)t++;for(var h=i(a,0),e=h-2;h>e&&s(h-1)+o(h-1)*O>n;)h--;y=-(s(t)*A+o(t)*k);for(var d=t;h>=d;d++){var c=s(d),p=o(d);b.push(C(10,c)*C(2,p))}}function i(t,e){return 3*t+e}function o(t){return t-3*s(t)}function s(t){return E(h(t/3))}b=[];var n=h(z(v)/f),r=h(z(x)/f),a=L(n),l=E(r),d=a-l,p=n-r;"exponent"===g?t():P>=d&&_>P?e():t()}function n(){for(var t=[],e=0,i=b.length;i>e;e++)t[e]=(p?1:-1)*b[e];!p&&t.reverse();var o=a(),s=o.value2Coord,n=s(t[0]),h=s(t[t.length-1]);return n===h&&(n-=1,h+=1),{dataMin:n,dataMax:h,tickList:t,logPositive:p,labelFormatter:r(),dataMappingMethods:o}}function r(){if("exponent"===g){var t=u,e=f;return function(i){if(!isFinite(parseFloat(i)))return"";var o="";return 0>i&&(i=-i,o="-"),o+t+d(z(i)/e)}}return function(t){return isFinite(parseFloat(t))?S.addCommas(l(t)):""}}function a(){var t=p,e=y;return{value2Coord:function(i){return null==i||isNaN(i)||!isFinite(i)?i:(i=parseFloat(i),isFinite(i)?t&&I>i?i=I:!t&&i>-I&&(i=-I):i=I,i=w(i),(t?1:-1)*(z(i)+e))},coord2Value:function(i){return null==i||isNaN(i)||!isFinite(i)?i:(i=parseFloat(i),isFinite(i)||(i=I),t?C(M,i-e):-C(M,-i+e))}}}function h(t){return+Number(+t).toFixed(14)}function l(t){return Number(t).toFixed(15).replace(/\.?0*$/,"")}function d(t){t=l(Math.round(t));for(var e=[],i=0,o=t.length;o>i;i++){var s=t.charAt(i);e.push(D[s]||"")}return e.join("")}function c(t){return t>-I&&I>t}var p,u,g,f,m,_,y,x,v,b,S=t("./number"),T=Math,z=T.log,C=T.pow,w=T.abs,L=T.ceil,E=T.floor,M=T.E,A=T.LN10,k=T.LN2,O=k/A,I=1e-9,R=5,P=2,D={0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹","-":"⁻"};return e}),i("echarts/util/date",[],function(){function t(t,e,i){i=i>1?i:2;for(var o,s,n,r,a=0,h=d.length;h>a;a++)if(o=d[a].value,s=Math.ceil(e/o)*o-Math.floor(t/o)*o,Math.round(s/o)<=1.2*i){n=d[a].formatter,r=d[a].value;break}return null==n&&(n="year",o=317088e5,s=Math.ceil(e/o)*o-Math.floor(t/o)*o,r=Math.round(s/(i-1)/o)*o),{formatter:n,gapValue:r}}function e(t){return 10>t?"0"+t:t}function i(t,i){("week"==t||"month"==t||"quarter"==t||"half-year"==t||"year"==t)&&(t="MM - dd\nyyyy");var o=l(i),s=o.getFullYear(),n=o.getMonth()+1,r=o.getDate(),a=o.getHours(),h=o.getMinutes(),d=o.getSeconds();return t=t.replace("MM",e(n)),t=t.toLowerCase(),t=t.replace("yyyy",s),t=t.replace("yy",s%100),t=t.replace("dd",e(r)),t=t.replace("d",r),t=t.replace("hh",e(a)),t=t.replace("h",a),t=t.replace("mm",e(h)),t=t.replace("m",h),t=t.replace("ss",e(d)),t=t.replace("s",d)}function o(t){return t=l(t),t.setDate(t.getDate()+8-t.getDay()),t}function s(t,e,i){return t=l(t),t.setMonth(Math.ceil((t.getMonth()+1)/i)*i),t.setDate(e),t}function n(t,e){return s(t,e,1)}function r(t,e){return s(t,e,3)}function a(t,e){return s(t,e,6)}function h(t,e){return s(t,e,12)}function l(t){return t instanceof Date?t:new Date("string"==typeof t?t.replace(/-/g,"/"):t)}var d=[{formatter:"hh : mm : ss",value:1e3},{formatter:"hh : mm : ss",value:5e3},{formatter:"hh : mm : ss",value:1e4},{formatter:"hh : mm : ss",value:15e3},{formatter:"hh : mm : ss",value:3e4},{formatter:"hh : mm\nMM - dd",value:6e4},{formatter:"hh : mm\nMM - dd",value:3e5},{formatter:"hh : mm\nMM - dd",value:6e5},{formatter:"hh : mm\nMM - dd",value:9e5},{formatter:"hh : mm\nMM - dd",value:18e5},{formatter:"hh : mm\nMM - dd",value:36e5},{formatter:"hh : mm\nMM - dd",value:72e5},{formatter:"hh : mm\nMM - dd",value:216e5},{formatter:"hh : mm\nMM - dd",value:432e5},{formatter:"MM - dd\nyyyy",value:864e5},{formatter:"week",value:6048e5},{formatter:"month",value:26784e5},{formatter:"quarter",value:8208e6},{formatter:"half-year",value:16416e6},{formatter:"year",value:32832e6}];return{getAutoFormatter:t,getNewDate:l,format:i,nextMonday:o,nextNthPerNmonth:s,nextNthOnMonth:n,nextNthOnQuarterYear:r,nextNthOnHalfYear:a,nextNthOnYear:h}}),i("echarts/util/shape/HandlePolygon",["require","zrender/shape/Base","zrender/shape/Polygon","zrender/tool/util"],function(t){function e(t){i.call(this,t)}var i=t("zrender/shape/Base"),o=t("zrender/shape/Polygon"),s=t("zrender/tool/util");return e.prototype={type:"handle-polygon",buildPath:function(t,e){o.prototype.buildPath(t,e)},isCover:function(t,e){var i=this.transformCoordToLocal(t,e);t=i[0],e=i[1];var o=this.style.rect;return t>=o.x&&t<=o.x+o.width&&e>=o.y&&e<=o.y+o.height?!0:!1}},s.inherits(e,i),e}),i("zrender",["zrender/zrender"],function(t){return t}),i("echarts",["echarts/echarts"],function(t){return t});var o=e("zrender");o.tool={color:e("zrender/tool/color"),math:e("zrender/tool/math"),util:e("zrender/tool/util"),vector:e("zrender/tool/vector"),area:e("zrender/tool/area"),event:e("zrender/tool/event")},o.animation={Animation:e("zrender/animation/Animation"),Cip:e("zrender/animation/Clip"),easing:e("zrender/animation/easing")};var s=e("echarts");s.config=e("echarts/config"),e("echarts/chart/bar"),e("echarts/chart/line"),e("echarts/chart/pie"),e("echarts/chart/scatter"),e("echarts/chart/gauge"),t.echarts=s,t.zrender=o}(window);

/*
 * JQuery zTree core v3.5.19.1
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-10-26
 */
(function(q){var I,J,K,L,M,N,v,s={},w={},x={},O={treeId:"",treeObj:null,view:{addDiyDom:null,autoCancelSelected:!0,dblClickExpand:!0,expandSpeed:"fast",fontCss:{},nameIsHTML:!1,selectedMulti:!0,showIcon:!0,showLine:!0,showTitle:!0,txtSelectedEnable:!1},data:{key:{children:"children",name:"name",title:"",url:"url",icon:"icon"},simpleData:{enable:!1,idKey:"id",pIdKey:"pId",rootPId:null},keep:{parent:!1,leaf:!1}},async:{enable:!1,contentType:"application/x-www-form-urlencoded",type:"post",dataType:"text",
url:"",autoParam:[],otherParam:[],dataFilter:null},callback:{beforeAsync:null,beforeClick:null,beforeDblClick:null,beforeRightClick:null,beforeMouseDown:null,beforeMouseUp:null,beforeExpand:null,beforeCollapse:null,beforeRemove:null,onAsyncError:null,onAsyncSuccess:null,onNodeCreated:null,onClick:null,onDblClick:null,onRightClick:null,onMouseDown:null,onMouseUp:null,onExpand:null,onCollapse:null,onRemove:null}},y=[function(b){var a=b.treeObj,c=f.event;a.bind(c.NODECREATED,function(a,c,g){j.apply(b.callback.onNodeCreated,
[a,c,g])});a.bind(c.CLICK,function(a,c,g,m,h){j.apply(b.callback.onClick,[c,g,m,h])});a.bind(c.EXPAND,function(a,c,g){j.apply(b.callback.onExpand,[a,c,g])});a.bind(c.COLLAPSE,function(a,c,g){j.apply(b.callback.onCollapse,[a,c,g])});a.bind(c.ASYNC_SUCCESS,function(a,c,g,h){j.apply(b.callback.onAsyncSuccess,[a,c,g,h])});a.bind(c.ASYNC_ERROR,function(a,c,g,h,f,i){j.apply(b.callback.onAsyncError,[a,c,g,h,f,i])});a.bind(c.REMOVE,function(a,c,g){j.apply(b.callback.onRemove,[a,c,g])});a.bind(c.SELECTED,
function(a,c,g){j.apply(b.callback.onSelected,[c,g])});a.bind(c.UNSELECTED,function(a,c,g){j.apply(b.callback.onUnSelected,[c,g])})}],z=[function(b){var a=f.event;b.treeObj.unbind(a.NODECREATED).unbind(a.CLICK).unbind(a.EXPAND).unbind(a.COLLAPSE).unbind(a.ASYNC_SUCCESS).unbind(a.ASYNC_ERROR).unbind(a.REMOVE).unbind(a.SELECTED).unbind(a.UNSELECTED)}],A=[function(b){var a=h.getCache(b);a||(a={},h.setCache(b,a));a.nodes=[];a.doms=[]}],B=[function(b,a,c,d,e,g){if(c){var m=h.getRoot(b),f=b.data.key.children;
c.level=a;c.tId=b.treeId+"_"+ ++m.zId;c.parentTId=d?d.tId:null;c.open=typeof c.open=="string"?j.eqs(c.open,"true"):!!c.open;c[f]&&c[f].length>0?(c.isParent=!0,c.zAsync=!0):(c.isParent=typeof c.isParent=="string"?j.eqs(c.isParent,"true"):!!c.isParent,c.open=c.isParent&&!b.async.enable?c.open:!1,c.zAsync=!c.isParent);c.isFirstNode=e;c.isLastNode=g;c.getParentNode=function(){return h.getNodeCache(b,c.parentTId)};c.getPreNode=function(){return h.getPreNode(b,c)};c.getNextNode=function(){return h.getNextNode(b,
c)};c.getIndex=function(){return h.getNodeIndex(b,c)};c.getPath=function(){return h.getNodePath(b,c)};c.isAjaxing=!1;h.fixPIdKeyValue(b,c)}}],u=[function(b){var a=b.target,c=h.getSetting(b.data.treeId),d="",e=null,g="",m="",i=null,n=null,k=null;if(j.eqs(b.type,"mousedown"))m="mousedown";else if(j.eqs(b.type,"mouseup"))m="mouseup";else if(j.eqs(b.type,"contextmenu"))m="contextmenu";else if(j.eqs(b.type,"click"))if(j.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+f.id.SWITCH)!==null)d=j.getNodeMainDom(a).id,
g="switchNode";else{if(k=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}]))d=j.getNodeMainDom(k).id,g="clickNode"}else if(j.eqs(b.type,"dblclick")&&(m="dblclick",k=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}])))d=j.getNodeMainDom(k).id,g="switchNode";if(m.length>0&&d.length==0&&(k=j.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+f.id.A}])))d=j.getNodeMainDom(k).id;if(d.length>0)switch(e=h.getNodeCache(c,d),g){case "switchNode":e.isParent?j.eqs(b.type,"click")||j.eqs(b.type,"dblclick")&&
j.apply(c.view.dblClickExpand,[c.treeId,e],c.view.dblClickExpand)?i=I:g="":g="";break;case "clickNode":i=J}switch(m){case "mousedown":n=K;break;case "mouseup":n=L;break;case "dblclick":n=M;break;case "contextmenu":n=N}return{stop:!1,node:e,nodeEventType:g,nodeEventCallback:i,treeEventType:m,treeEventCallback:n}}],C=[function(b){var a=h.getRoot(b);a||(a={},h.setRoot(b,a));a[b.data.key.children]=[];a.expandTriggerFlag=!1;a.curSelectedList=[];a.noSelection=!0;a.createdNodes=[];a.zId=0;a._ver=(new Date).getTime()}],
D=[],E=[],F=[],G=[],H=[],h={addNodeCache:function(b,a){h.getCache(b).nodes[h.getNodeCacheId(a.tId)]=a},getNodeCacheId:function(b){return b.substring(b.lastIndexOf("_")+1)},addAfterA:function(b){E.push(b)},addBeforeA:function(b){D.push(b)},addInnerAfterA:function(b){G.push(b)},addInnerBeforeA:function(b){F.push(b)},addInitBind:function(b){y.push(b)},addInitUnBind:function(b){z.push(b)},addInitCache:function(b){A.push(b)},addInitNode:function(b){B.push(b)},addInitProxy:function(b,a){a?u.splice(0,0,
b):u.push(b)},addInitRoot:function(b){C.push(b)},addNodesData:function(b,a,c,d){var e=b.data.key.children;a[e]?c>=a[e].length&&(c=-1):(a[e]=[],c=-1);if(a[e].length>0&&c===0)a[e][0].isFirstNode=!1,i.setNodeLineIcos(b,a[e][0]);else if(a[e].length>0&&c<0)a[e][a[e].length-1].isLastNode=!1,i.setNodeLineIcos(b,a[e][a[e].length-1]);a.isParent=!0;c<0?a[e]=a[e].concat(d):(b=[c,0].concat(d),a[e].splice.apply(a[e],b))},addSelectedNode:function(b,a){var c=h.getRoot(b);h.isSelectedNode(b,a)||c.curSelectedList.push(a)},
addCreatedNode:function(b,a){(b.callback.onNodeCreated||b.view.addDiyDom)&&h.getRoot(b).createdNodes.push(a)},addZTreeTools:function(b){H.push(b)},exSetting:function(b){q.extend(!0,O,b)},fixPIdKeyValue:function(b,a){b.data.simpleData.enable&&(a[b.data.simpleData.pIdKey]=a.parentTId?a.getParentNode()[b.data.simpleData.idKey]:b.data.simpleData.rootPId)},getAfterA:function(b,a,c){for(var d=0,e=E.length;d<e;d++)E[d].apply(this,arguments)},getBeforeA:function(b,a,c){for(var d=0,e=D.length;d<e;d++)D[d].apply(this,
arguments)},getInnerAfterA:function(b,a,c){for(var d=0,e=G.length;d<e;d++)G[d].apply(this,arguments)},getInnerBeforeA:function(b,a,c){for(var d=0,e=F.length;d<e;d++)F[d].apply(this,arguments)},getCache:function(b){return x[b.treeId]},getNodeIndex:function(b,a){if(!a)return null;for(var c=b.data.key.children,d=a.parentTId?a.getParentNode():h.getRoot(b),e=0,g=d[c].length-1;e<=g;e++)if(d[c][e]===a)return e;return-1},getNextNode:function(b,a){if(!a)return null;for(var c=b.data.key.children,d=a.parentTId?
a.getParentNode():h.getRoot(b),e=0,g=d[c].length-1;e<=g;e++)if(d[c][e]===a)return e==g?null:d[c][e+1];return null},getNodeByParam:function(b,a,c,d){if(!a||!c)return null;for(var e=b.data.key.children,g=0,f=a.length;g<f;g++){if(a[g][c]==d)return a[g];var i=h.getNodeByParam(b,a[g][e],c,d);if(i)return i}return null},getNodeCache:function(b,a){if(!a)return null;var c=x[b.treeId].nodes[h.getNodeCacheId(a)];return c?c:null},getNodeName:function(b,a){return""+a[b.data.key.name]},getNodePath:function(b,a){if(!a)return null;
var c;(c=a.parentTId?a.getParentNode().getPath():[])&&c.push(a);return c},getNodeTitle:function(b,a){return""+a[b.data.key.title===""?b.data.key.name:b.data.key.title]},getNodes:function(b){return h.getRoot(b)[b.data.key.children]},getNodesByParam:function(b,a,c,d){if(!a||!c)return[];for(var e=b.data.key.children,g=[],f=0,i=a.length;f<i;f++)a[f][c]==d&&g.push(a[f]),g=g.concat(h.getNodesByParam(b,a[f][e],c,d));return g},getNodesByParamFuzzy:function(b,a,c,d){if(!a||!c)return[];for(var e=b.data.key.children,
g=[],d=d.toLowerCase(),f=0,i=a.length;f<i;f++)typeof a[f][c]=="string"&&a[f][c].toLowerCase().indexOf(d)>-1&&g.push(a[f]),g=g.concat(h.getNodesByParamFuzzy(b,a[f][e],c,d));return g},getNodesByFilter:function(b,a,c,d,e){if(!a)return d?null:[];for(var g=b.data.key.children,f=d?null:[],i=0,n=a.length;i<n;i++){if(j.apply(c,[a[i],e],!1)){if(d)return a[i];f.push(a[i])}var k=h.getNodesByFilter(b,a[i][g],c,d,e);if(d&&k)return k;f=d?k:f.concat(k)}return f},getPreNode:function(b,a){if(!a)return null;for(var c=
b.data.key.children,d=a.parentTId?a.getParentNode():h.getRoot(b),e=0,g=d[c].length;e<g;e++)if(d[c][e]===a)return e==0?null:d[c][e-1];return null},getRoot:function(b){return b?w[b.treeId]:null},getRoots:function(){return w},getSetting:function(b){return s[b]},getSettings:function(){return s},getZTreeTools:function(b){return(b=this.getRoot(this.getSetting(b)))?b.treeTools:null},initCache:function(b){for(var a=0,c=A.length;a<c;a++)A[a].apply(this,arguments)},initNode:function(b,a,c,d,e,g){for(var f=
0,h=B.length;f<h;f++)B[f].apply(this,arguments)},initRoot:function(b){for(var a=0,c=C.length;a<c;a++)C[a].apply(this,arguments)},isSelectedNode:function(b,a){for(var c=h.getRoot(b),d=0,e=c.curSelectedList.length;d<e;d++)if(a===c.curSelectedList[d])return!0;return!1},removeNodeCache:function(b,a){var c=b.data.key.children;if(a[c])for(var d=0,e=a[c].length;d<e;d++)arguments.callee(b,a[c][d]);h.getCache(b).nodes[h.getNodeCacheId(a.tId)]=null},removeSelectedNode:function(b,a){for(var c=h.getRoot(b),d=
0,e=c.curSelectedList.length;d<e;d++)if(a===c.curSelectedList[d]||!h.getNodeCache(b,c.curSelectedList[d].tId))c.curSelectedList.splice(d,1),b.treeObj.trigger(f.event.UNSELECTED,[b.treeId,a]),d--,e--},setCache:function(b,a){x[b.treeId]=a},setRoot:function(b,a){w[b.treeId]=a},setZTreeTools:function(b,a){for(var c=0,d=H.length;c<d;c++)H[c].apply(this,arguments)},transformToArrayFormat:function(b,a){if(!a)return[];var c=b.data.key.children,d=[];if(j.isArray(a))for(var e=0,g=a.length;e<g;e++)d.push(a[e]),
a[e][c]&&(d=d.concat(h.transformToArrayFormat(b,a[e][c])));else d.push(a),a[c]&&(d=d.concat(h.transformToArrayFormat(b,a[c])));return d},transformTozTreeFormat:function(b,a){var c,d,e=b.data.simpleData.idKey,g=b.data.simpleData.pIdKey,f=b.data.key.children;if(!e||e==""||!a)return[];if(j.isArray(a)){var h=[],i=[];for(c=0,d=a.length;c<d;c++)i[a[c][e]]=a[c];for(c=0,d=a.length;c<d;c++)i[a[c][g]]&&a[c][e]!=a[c][g]?(i[a[c][g]][f]||(i[a[c][g]][f]=[]),i[a[c][g]][f].push(a[c])):h.push(a[c]);return h}else return[a]}},
l={bindEvent:function(b){for(var a=0,c=y.length;a<c;a++)y[a].apply(this,arguments)},unbindEvent:function(b){for(var a=0,c=z.length;a<c;a++)z[a].apply(this,arguments)},bindTree:function(b){var a={treeId:b.treeId},c=b.treeObj;b.view.txtSelectedEnable||c.bind("selectstart",v).css({"-moz-user-select":"-moz-none"});c.bind("click",a,l.proxy);c.bind("dblclick",a,l.proxy);c.bind("mouseover",a,l.proxy);c.bind("mouseout",a,l.proxy);c.bind("mousedown",a,l.proxy);c.bind("mouseup",a,l.proxy);c.bind("contextmenu",
a,l.proxy)},unbindTree:function(b){b.treeObj.unbind("selectstart",v).unbind("click",l.proxy).unbind("dblclick",l.proxy).unbind("mouseover",l.proxy).unbind("mouseout",l.proxy).unbind("mousedown",l.proxy).unbind("mouseup",l.proxy).unbind("contextmenu",l.proxy)},doProxy:function(b){for(var a=[],c=0,d=u.length;c<d;c++){var e=u[c].apply(this,arguments);a.push(e);if(e.stop)break}return a},proxy:function(b){var a=h.getSetting(b.data.treeId);if(!j.uCanDo(a,b))return!0;for(var a=l.doProxy(b),c=!0,d=0,e=a.length;d<
e;d++){var g=a[d];g.nodeEventCallback&&(c=g.nodeEventCallback.apply(g,[b,g.node])&&c);g.treeEventCallback&&(c=g.treeEventCallback.apply(g,[b,g.node])&&c)}return c}};I=function(b,a){var c=h.getSetting(b.data.treeId);if(a.open){if(j.apply(c.callback.beforeCollapse,[c.treeId,a],!0)==!1)return!0}else if(j.apply(c.callback.beforeExpand,[c.treeId,a],!0)==!1)return!0;h.getRoot(c).expandTriggerFlag=!0;i.switchNode(c,a);return!0};J=function(b,a){var c=h.getSetting(b.data.treeId),d=c.view.autoCancelSelected&&
(b.ctrlKey||b.metaKey)&&h.isSelectedNode(c,a)?0:c.view.autoCancelSelected&&(b.ctrlKey||b.metaKey)&&c.view.selectedMulti?2:1;if(j.apply(c.callback.beforeClick,[c.treeId,a,d],!0)==!1)return!0;d===0?i.cancelPreSelectedNode(c,a):i.selectNode(c,a,d===2);c.treeObj.trigger(f.event.CLICK,[b,c.treeId,a,d]);return!0};K=function(b,a){var c=h.getSetting(b.data.treeId);j.apply(c.callback.beforeMouseDown,[c.treeId,a],!0)&&j.apply(c.callback.onMouseDown,[b,c.treeId,a]);return!0};L=function(b,a){var c=h.getSetting(b.data.treeId);
j.apply(c.callback.beforeMouseUp,[c.treeId,a],!0)&&j.apply(c.callback.onMouseUp,[b,c.treeId,a]);return!0};M=function(b,a){var c=h.getSetting(b.data.treeId);j.apply(c.callback.beforeDblClick,[c.treeId,a],!0)&&j.apply(c.callback.onDblClick,[b,c.treeId,a]);return!0};N=function(b,a){var c=h.getSetting(b.data.treeId);j.apply(c.callback.beforeRightClick,[c.treeId,a],!0)&&j.apply(c.callback.onRightClick,[b,c.treeId,a]);return typeof c.callback.onRightClick!="function"};v=function(b){b=b.originalEvent.srcElement.nodeName.toLowerCase();
return b==="input"||b==="textarea"};var j={apply:function(b,a,c){return typeof b=="function"?b.apply(P,a?a:[]):c},canAsync:function(b,a){var c=b.data.key.children;return b.async.enable&&a&&a.isParent&&!(a.zAsync||a[c]&&a[c].length>0)},clone:function(b){if(b===null)return null;var a=j.isArray(b)?[]:{},c;for(c in b)a[c]=b[c]instanceof Date?new Date(b[c].getTime()):typeof b[c]==="object"?arguments.callee(b[c]):b[c];return a},eqs:function(b,a){return b.toLowerCase()===a.toLowerCase()},isArray:function(b){return Object.prototype.toString.apply(b)===
"[object Array]"},$:function(b,a,c){a&&typeof a!="string"&&(c=a,a="");return typeof b=="string"?q(b,c?c.treeObj.get(0).ownerDocument:null):q("#"+b.tId+a,c?c.treeObj:null)},getMDom:function(b,a,c){if(!a)return null;for(;a&&a.id!==b.treeId;){for(var d=0,e=c.length;a.tagName&&d<e;d++)if(j.eqs(a.tagName,c[d].tagName)&&a.getAttribute(c[d].attrName)!==null)return a;a=a.parentNode}return null},getNodeMainDom:function(b){return q(b).parent("li").get(0)||q(b).parentsUntil("li").parent().get(0)},isChildOrSelf:function(b,
a){return q(b).closest("#"+a).length>0},uCanDo:function(){return!0}},i={addNodes:function(b,a,c,d,e){if(!b.data.keep.leaf||!a||a.isParent)if(j.isArray(d)||(d=[d]),b.data.simpleData.enable&&(d=h.transformTozTreeFormat(b,d)),a){var g=k(a,f.id.SWITCH,b),m=k(a,f.id.ICON,b),o=k(a,f.id.UL,b);if(!a.open)i.replaceSwitchClass(a,g,f.folder.CLOSE),i.replaceIcoClass(a,m,f.folder.CLOSE),a.open=!1,o.css({display:"none"});h.addNodesData(b,a,c,d);i.createNodes(b,a.level+1,d,a,c);e||i.expandCollapseParentNode(b,a,
!0)}else h.addNodesData(b,h.getRoot(b),c,d),i.createNodes(b,0,d,null,c)},appendNodes:function(b,a,c,d,e,g,f){if(!c)return[];var j=[],k=b.data.key.children,l=(d?d:h.getRoot(b))[k],r,Q;if(!l||e>=l.length)e=-1;for(var t=0,q=c.length;t<q;t++){var p=c[t];g&&(r=(e===0||l.length==c.length)&&t==0,Q=e<0&&t==c.length-1,h.initNode(b,a,p,d,r,Q,f),h.addNodeCache(b,p));r=[];p[k]&&p[k].length>0&&(r=i.appendNodes(b,a+1,p[k],p,-1,g,f&&p.open));f&&(i.makeDOMNodeMainBefore(j,b,p),i.makeDOMNodeLine(j,b,p),h.getBeforeA(b,
p,j),i.makeDOMNodeNameBefore(j,b,p),h.getInnerBeforeA(b,p,j),i.makeDOMNodeIcon(j,b,p),h.getInnerAfterA(b,p,j),i.makeDOMNodeNameAfter(j,b,p),h.getAfterA(b,p,j),p.isParent&&p.open&&i.makeUlHtml(b,p,j,r.join("")),i.makeDOMNodeMainAfter(j,b,p),h.addCreatedNode(b,p))}return j},appendParentULDom:function(b,a){var c=[],d=k(a,b);!d.get(0)&&a.parentTId&&(i.appendParentULDom(b,a.getParentNode()),d=k(a,b));var e=k(a,f.id.UL,b);e.get(0)&&e.remove();e=i.appendNodes(b,a.level+1,a[b.data.key.children],a,-1,!1,!0);
i.makeUlHtml(b,a,c,e.join(""));d.append(c.join(""))},asyncNode:function(b,a,c,d){var e,g;if(a&&!a.isParent)return j.apply(d),!1;else if(a&&a.isAjaxing)return!1;else if(j.apply(b.callback.beforeAsync,[b.treeId,a],!0)==!1)return j.apply(d),!1;if(a)a.isAjaxing=!0,k(a,f.id.ICON,b).attr({style:"","class":f.className.BUTTON+" "+f.className.ICO_LOADING});var m={};for(e=0,g=b.async.autoParam.length;a&&e<g;e++){var o=b.async.autoParam[e].split("="),n=o;o.length>1&&(n=o[1],o=o[0]);m[n]=a[o]}if(j.isArray(b.async.otherParam))for(e=
0,g=b.async.otherParam.length;e<g;e+=2)m[b.async.otherParam[e]]=b.async.otherParam[e+1];else for(var l in b.async.otherParam)m[l]=b.async.otherParam[l];var r=h.getRoot(b)._ver;q.ajax({contentType:b.async.contentType,cache:!1,type:b.async.type,url:j.apply(b.async.url,[b.treeId,a],b.async.url),data:m,dataType:b.async.dataType,success:function(e){if(r==h.getRoot(b)._ver){var g=[];try{g=!e||e.length==0?[]:typeof e=="string"?eval("("+e+")"):e}catch(m){g=e}if(a)a.isAjaxing=null,a.zAsync=!0;i.setNodeLineIcos(b,
a);g&&g!==""?(g=j.apply(b.async.dataFilter,[b.treeId,a,g],g),i.addNodes(b,a,-1,g?j.clone(g):[],!!c)):i.addNodes(b,a,-1,[],!!c);b.treeObj.trigger(f.event.ASYNC_SUCCESS,[b.treeId,a,e]);j.apply(d)}},error:function(c,d,e){if(r==h.getRoot(b)._ver){if(a)a.isAjaxing=null;i.setNodeLineIcos(b,a);b.treeObj.trigger(f.event.ASYNC_ERROR,[b.treeId,a,c,d,e])}}});return!0},cancelPreSelectedNode:function(b,a,c){var d=h.getRoot(b).curSelectedList,e,g;for(e=d.length-1;e>=0;e--)if(g=d[e],a===g||!a&&(!c||c!==g))if(k(g,
f.id.A,b).removeClass(f.node.CURSELECTED),a){h.removeSelectedNode(b,a);break}else d.splice(e,1),b.treeObj.trigger(f.event.UNSELECTED,[b.treeId,g])},createNodeCallback:function(b){if(b.callback.onNodeCreated||b.view.addDiyDom)for(var a=h.getRoot(b);a.createdNodes.length>0;){var c=a.createdNodes.shift();j.apply(b.view.addDiyDom,[b.treeId,c]);b.callback.onNodeCreated&&b.treeObj.trigger(f.event.NODECREATED,[b.treeId,c])}},createNodes:function(b,a,c,d,e){if(c&&c.length!=0){var g=h.getRoot(b),j=b.data.key.children,
j=!d||d.open||!!k(d[j][0],b).get(0);g.createdNodes=[];var a=i.appendNodes(b,a,c,d,e,!0,j),o,n;d?(d=k(d,f.id.UL,b),d.get(0)&&(o=d)):o=b.treeObj;o&&(e>=0&&(n=o.children()[e]),e>=0&&n?q(n).before(a.join("")):o.append(a.join("")));i.createNodeCallback(b)}},destroy:function(b){b&&(h.initCache(b),h.initRoot(b),l.unbindTree(b),l.unbindEvent(b),b.treeObj.empty(),delete s[b.treeId])},expandCollapseNode:function(b,a,c,d,e){var g=h.getRoot(b),m=b.data.key.children;if(a){if(g.expandTriggerFlag){var o=e,e=function(){o&&
o();a.open?b.treeObj.trigger(f.event.EXPAND,[b.treeId,a]):b.treeObj.trigger(f.event.COLLAPSE,[b.treeId,a])};g.expandTriggerFlag=!1}if(!a.open&&a.isParent&&(!k(a,f.id.UL,b).get(0)||a[m]&&a[m].length>0&&!k(a[m][0],b).get(0)))i.appendParentULDom(b,a),i.createNodeCallback(b);if(a.open==c)j.apply(e,[]);else{var c=k(a,f.id.UL,b),g=k(a,f.id.SWITCH,b),n=k(a,f.id.ICON,b);a.isParent?(a.open=!a.open,a.iconOpen&&a.iconClose&&n.attr("style",i.makeNodeIcoStyle(b,a)),a.open?(i.replaceSwitchClass(a,g,f.folder.OPEN),
i.replaceIcoClass(a,n,f.folder.OPEN),d==!1||b.view.expandSpeed==""?(c.show(),j.apply(e,[])):a[m]&&a[m].length>0?c.slideDown(b.view.expandSpeed,e):(c.show(),j.apply(e,[]))):(i.replaceSwitchClass(a,g,f.folder.CLOSE),i.replaceIcoClass(a,n,f.folder.CLOSE),d==!1||b.view.expandSpeed==""||!(a[m]&&a[m].length>0)?(c.hide(),j.apply(e,[])):c.slideUp(b.view.expandSpeed,e))):j.apply(e,[])}}else j.apply(e,[])},expandCollapseParentNode:function(b,a,c,d,e){a&&(a.parentTId?(i.expandCollapseNode(b,a,c,d),a.parentTId&&
i.expandCollapseParentNode(b,a.getParentNode(),c,d,e)):i.expandCollapseNode(b,a,c,d,e))},expandCollapseSonNode:function(b,a,c,d,e){var g=h.getRoot(b),f=b.data.key.children,g=a?a[f]:g[f],f=a?!1:d,j=h.getRoot(b).expandTriggerFlag;h.getRoot(b).expandTriggerFlag=!1;if(g)for(var k=0,l=g.length;k<l;k++)g[k]&&i.expandCollapseSonNode(b,g[k],c,f);h.getRoot(b).expandTriggerFlag=j;i.expandCollapseNode(b,a,c,d,e)},isSelectedNode:function(b,a){if(!a)return!1;var c=h.getRoot(b).curSelectedList,d;for(d=c.length-
1;d>=0;d--)if(a===c[d])return!0;return!1},makeDOMNodeIcon:function(b,a,c){var d=h.getNodeName(a,c),d=a.view.nameIsHTML?d:d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");b.push("<span id='",c.tId,f.id.ICON,"' title='' treeNode",f.id.ICON," class='",i.makeNodeIcoClass(a,c),"' style='",i.makeNodeIcoStyle(a,c),"'></span><span id='",c.tId,f.id.SPAN,"'>",d,"</span>")},makeDOMNodeLine:function(b,a,c){b.push("<span id='",c.tId,f.id.SWITCH,"' title='' class='",i.makeNodeLineClass(a,c),"' treeNode",
f.id.SWITCH,"></span>")},makeDOMNodeMainAfter:function(b){b.push("</li>")},makeDOMNodeMainBefore:function(b,a,c){b.push("<li id='",c.tId,"' class='",f.className.LEVEL,c.level,"' tabindex='0' hidefocus='true' treenode>")},makeDOMNodeNameAfter:function(b){b.push("</a>")},makeDOMNodeNameBefore:function(b,a,c){var d=h.getNodeTitle(a,c),e=i.makeNodeUrl(a,c),g=i.makeNodeFontCss(a,c),m=[],k;for(k in g)m.push(k,":",g[k],";");b.push("<a id='",c.tId,f.id.A,"' class='",f.className.LEVEL,c.level,"' treeNode",
f.id.A,' onclick="',c.click||"",'" ',e!=null&&e.length>0?"href='"+e+"'":""," target='",i.makeNodeTarget(c),"' style='",m.join(""),"'");j.apply(a.view.showTitle,[a.treeId,c],a.view.showTitle)&&d&&b.push("title='",d.replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"'");b.push(">")},makeNodeFontCss:function(b,a){var c=j.apply(b.view.fontCss,[b.treeId,a],b.view.fontCss);return c&&typeof c!="function"?c:{}},makeNodeIcoClass:function(b,a){var c=["ico"];a.isAjaxing||(c[0]=(a.iconSkin?a.iconSkin+
"_":"")+c[0],a.isParent?c.push(a.open?f.folder.OPEN:f.folder.CLOSE):c.push(f.folder.DOCU));return f.className.BUTTON+" "+c.join("_")},makeNodeIcoStyle:function(b,a){var c=[];if(!a.isAjaxing){var d=a.isParent&&a.iconOpen&&a.iconClose?a.open?a.iconOpen:a.iconClose:a[b.data.key.icon];d&&c.push("background:url(",d,") 0 0 no-repeat;");(b.view.showIcon==!1||!j.apply(b.view.showIcon,[b.treeId,a],!0))&&c.push("width:0px;height:0px;")}return c.join("")},makeNodeLineClass:function(b,a){var c=[];b.view.showLine?
a.level==0&&a.isFirstNode&&a.isLastNode?c.push(f.line.ROOT):a.level==0&&a.isFirstNode?c.push(f.line.ROOTS):a.isLastNode?c.push(f.line.BOTTOM):c.push(f.line.CENTER):c.push(f.line.NOLINE);a.isParent?c.push(a.open?f.folder.OPEN:f.folder.CLOSE):c.push(f.folder.DOCU);return i.makeNodeLineClassEx(a)+c.join("_")},makeNodeLineClassEx:function(b){return f.className.BUTTON+" "+f.className.LEVEL+b.level+" "+f.className.SWITCH+" "},makeNodeTarget:function(b){return b.target||"_blank"},makeNodeUrl:function(b,
a){var c=b.data.key.url;return a[c]?a[c]:null},makeUlHtml:function(b,a,c,d){c.push("<ul id='",a.tId,f.id.UL,"' class='",f.className.LEVEL,a.level," ",i.makeUlLineClass(b,a),"' style='display:",a.open?"block":"none","'>");c.push(d);c.push("</ul>")},makeUlLineClass:function(b,a){return b.view.showLine&&!a.isLastNode?f.line.LINE:""},removeChildNodes:function(b,a){if(a){var c=b.data.key.children,d=a[c];if(d){for(var e=0,g=d.length;e<g;e++)h.removeNodeCache(b,d[e]);h.removeSelectedNode(b);delete a[c];
b.data.keep.parent?k(a,f.id.UL,b).empty():(a.isParent=!1,a.open=!1,c=k(a,f.id.SWITCH,b),d=k(a,f.id.ICON,b),i.replaceSwitchClass(a,c,f.folder.DOCU),i.replaceIcoClass(a,d,f.folder.DOCU),k(a,f.id.UL,b).remove())}}},setFirstNode:function(b,a){var c=b.data.key.children;if(a[c].length>0)a[c][0].isFirstNode=!0},setLastNode:function(b,a){var c=b.data.key.children,d=a[c].length;if(d>0)a[c][d-1].isLastNode=!0},removeNode:function(b,a){var c=h.getRoot(b),d=b.data.key.children,e=a.parentTId?a.getParentNode():
c;a.isFirstNode=!1;a.isLastNode=!1;a.getPreNode=function(){return null};a.getNextNode=function(){return null};if(h.getNodeCache(b,a.tId)){k(a,b).remove();h.removeNodeCache(b,a);h.removeSelectedNode(b,a);for(var g=0,j=e[d].length;g<j;g++)if(e[d][g].tId==a.tId){e[d].splice(g,1);break}i.setFirstNode(b,e);i.setLastNode(b,e);var o,g=e[d].length;if(!b.data.keep.parent&&g==0)e.isParent=!1,e.open=!1,g=k(e,f.id.UL,b),j=k(e,f.id.SWITCH,b),o=k(e,f.id.ICON,b),i.replaceSwitchClass(e,j,f.folder.DOCU),i.replaceIcoClass(e,
o,f.folder.DOCU),g.css("display","none");else if(b.view.showLine&&g>0){var n=e[d][g-1],g=k(n,f.id.UL,b),j=k(n,f.id.SWITCH,b);o=k(n,f.id.ICON,b);e==c?e[d].length==1?i.replaceSwitchClass(n,j,f.line.ROOT):(c=k(e[d][0],f.id.SWITCH,b),i.replaceSwitchClass(e[d][0],c,f.line.ROOTS),i.replaceSwitchClass(n,j,f.line.BOTTOM)):i.replaceSwitchClass(n,j,f.line.BOTTOM);g.removeClass(f.line.LINE)}}},replaceIcoClass:function(b,a,c){if(a&&!b.isAjaxing&&(b=a.attr("class"),b!=void 0)){b=b.split("_");switch(c){case f.folder.OPEN:case f.folder.CLOSE:case f.folder.DOCU:b[b.length-
1]=c}a.attr("class",b.join("_"))}},replaceSwitchClass:function(b,a,c){if(a){var d=a.attr("class");if(d!=void 0){d=d.split("_");switch(c){case f.line.ROOT:case f.line.ROOTS:case f.line.CENTER:case f.line.BOTTOM:case f.line.NOLINE:d[0]=i.makeNodeLineClassEx(b)+c;break;case f.folder.OPEN:case f.folder.CLOSE:case f.folder.DOCU:d[1]=c}a.attr("class",d.join("_"));c!==f.folder.DOCU?a.removeAttr("disabled"):a.attr("disabled","disabled")}}},selectNode:function(b,a,c){c||i.cancelPreSelectedNode(b,null,a);k(a,
f.id.A,b).addClass(f.node.CURSELECTED);h.addSelectedNode(b,a);b.treeObj.trigger(f.event.SELECTED,[b.treeId,a])},setNodeFontCss:function(b,a){var c=k(a,f.id.A,b),d=i.makeNodeFontCss(b,a);d&&c.css(d)},setNodeLineIcos:function(b,a){if(a){var c=k(a,f.id.SWITCH,b),d=k(a,f.id.UL,b),e=k(a,f.id.ICON,b),g=i.makeUlLineClass(b,a);g.length==0?d.removeClass(f.line.LINE):d.addClass(g);c.attr("class",i.makeNodeLineClass(b,a));a.isParent?c.removeAttr("disabled"):c.attr("disabled","disabled");e.removeAttr("style");
e.attr("style",i.makeNodeIcoStyle(b,a));e.attr("class",i.makeNodeIcoClass(b,a))}},setNodeName:function(b,a){var c=h.getNodeTitle(b,a),d=k(a,f.id.SPAN,b);d.empty();b.view.nameIsHTML?d.html(h.getNodeName(b,a)):d.text(h.getNodeName(b,a));j.apply(b.view.showTitle,[b.treeId,a],b.view.showTitle)&&k(a,f.id.A,b).attr("title",!c?"":c)},setNodeTarget:function(b,a){k(a,f.id.A,b).attr("target",i.makeNodeTarget(a))},setNodeUrl:function(b,a){var c=k(a,f.id.A,b),d=i.makeNodeUrl(b,a);d==null||d.length==0?c.removeAttr("href"):
c.attr("href",d)},switchNode:function(b,a){a.open||!j.canAsync(b,a)?i.expandCollapseNode(b,a,!a.open):b.async.enable?i.asyncNode(b,a)||i.expandCollapseNode(b,a,!a.open):a&&i.expandCollapseNode(b,a,!a.open)}};q.fn.zTree={consts:{className:{BUTTON:"button",LEVEL:"level",ICO_LOADING:"ico_loading",SWITCH:"switch"},event:{NODECREATED:"ztree_nodeCreated",CLICK:"ztree_click",EXPAND:"ztree_expand",COLLAPSE:"ztree_collapse",ASYNC_SUCCESS:"ztree_async_success",ASYNC_ERROR:"ztree_async_error",REMOVE:"ztree_remove",
SELECTED:"ztree_selected",UNSELECTED:"ztree_unselected"},id:{A:"_a",ICON:"_ico",SPAN:"_span",SWITCH:"_switch",UL:"_ul"},line:{ROOT:"root",ROOTS:"roots",CENTER:"center",BOTTOM:"bottom",NOLINE:"noline",LINE:"line"},folder:{OPEN:"open",CLOSE:"close",DOCU:"docu"},node:{CURSELECTED:"curSelectedNode"}},_z:{tools:j,view:i,event:l,data:h},getZTreeObj:function(b){return(b=h.getZTreeTools(b))?b:null},destroy:function(b){if(b&&b.length>0)i.destroy(h.getSetting(b));else for(var a in s)i.destroy(s[a])},init:function(b,
a,c){var d=j.clone(O);q.extend(!0,d,a);d.treeId=b.attr("id");d.treeObj=b;d.treeObj.empty();s[d.treeId]=d;if(typeof document.body.style.maxHeight==="undefined")d.view.expandSpeed="";h.initRoot(d);b=h.getRoot(d);a=d.data.key.children;c=c?j.clone(j.isArray(c)?c:[c]):[];b[a]=d.data.simpleData.enable?h.transformTozTreeFormat(d,c):c;h.initCache(d);l.unbindTree(d);l.bindTree(d);l.unbindEvent(d);l.bindEvent(d);c={setting:d,addNodes:function(a,b,c,f){function h(){i.addNodes(d,a,b,l,f==!0)}a||(a=null);if(a&&
!a.isParent&&d.data.keep.leaf)return null;var k=parseInt(b,10);isNaN(k)?(f=!!c,c=b,b=-1):b=k;if(!c)return null;var l=j.clone(j.isArray(c)?c:[c]);j.canAsync(d,a)?i.asyncNode(d,a,f,h):h();return l},cancelSelectedNode:function(a){i.cancelPreSelectedNode(d,a)},destroy:function(){i.destroy(d)},expandAll:function(a){a=!!a;i.expandCollapseSonNode(d,null,a,!0);return a},expandNode:function(a,b,c,f,n){if(!a||!a.isParent)return null;b!==!0&&b!==!1&&(b=!a.open);if((n=!!n)&&b&&j.apply(d.callback.beforeExpand,
[d.treeId,a],!0)==!1)return null;else if(n&&!b&&j.apply(d.callback.beforeCollapse,[d.treeId,a],!0)==!1)return null;b&&a.parentTId&&i.expandCollapseParentNode(d,a.getParentNode(),b,!1);if(b===a.open&&!c)return null;h.getRoot(d).expandTriggerFlag=n;if(!j.canAsync(d,a)&&c)i.expandCollapseSonNode(d,a,b,!0,function(){if(f!==!1)try{k(a,d).focus().blur()}catch(b){}});else if(a.open=!b,i.switchNode(this.setting,a),f!==!1)try{k(a,d).focus().blur()}catch(l){}return b},getNodes:function(){return h.getNodes(d)},
getNodeByParam:function(a,b,c){return!a?null:h.getNodeByParam(d,c?c[d.data.key.children]:h.getNodes(d),a,b)},getNodeByTId:function(a){return h.getNodeCache(d,a)},getNodesByParam:function(a,b,c){return!a?null:h.getNodesByParam(d,c?c[d.data.key.children]:h.getNodes(d),a,b)},getNodesByParamFuzzy:function(a,b,c){return!a?null:h.getNodesByParamFuzzy(d,c?c[d.data.key.children]:h.getNodes(d),a,b)},getNodesByFilter:function(a,b,c,f){b=!!b;return!a||typeof a!="function"?b?null:[]:h.getNodesByFilter(d,c?c[d.data.key.children]:
h.getNodes(d),a,b,f)},getNodeIndex:function(a){if(!a)return null;for(var b=d.data.key.children,c=a.parentTId?a.getParentNode():h.getRoot(d),f=0,i=c[b].length;f<i;f++)if(c[b][f]==a)return f;return-1},getSelectedNodes:function(){for(var a=[],b=h.getRoot(d).curSelectedList,c=0,f=b.length;c<f;c++)a.push(b[c]);return a},isSelectedNode:function(a){return h.isSelectedNode(d,a)},reAsyncChildNodes:function(a,b,c){if(this.setting.async.enable){var j=!a;j&&(a=h.getRoot(d));if(b=="refresh"){for(var b=this.setting.data.key.children,
l=0,q=a[b]?a[b].length:0;l<q;l++)h.removeNodeCache(d,a[b][l]);h.removeSelectedNode(d);a[b]=[];j?this.setting.treeObj.empty():k(a,f.id.UL,d).empty()}i.asyncNode(this.setting,j?null:a,!!c)}},refresh:function(){this.setting.treeObj.empty();var a=h.getRoot(d),b=a[d.data.key.children];h.initRoot(d);a[d.data.key.children]=b;h.initCache(d);i.createNodes(d,0,a[d.data.key.children],null,-1)},removeChildNodes:function(a){if(!a)return null;var b=a[d.data.key.children];i.removeChildNodes(d,a);return b?b:null},
removeNode:function(a,b){a&&(b=!!b,b&&j.apply(d.callback.beforeRemove,[d.treeId,a],!0)==!1||(i.removeNode(d,a),b&&this.setting.treeObj.trigger(f.event.REMOVE,[d.treeId,a])))},selectNode:function(a,b){if(a&&j.uCanDo(d)){b=d.view.selectedMulti&&b;if(a.parentTId)i.expandCollapseParentNode(d,a.getParentNode(),!0,!1,function(){try{k(a,d).focus().blur()}catch(b){}});else try{k(a,d).focus().blur()}catch(c){}i.selectNode(d,a,b)}},transformTozTreeNodes:function(a){return h.transformTozTreeFormat(d,a)},transformToArray:function(a){return h.transformToArrayFormat(d,
a)},updateNode:function(a){a&&k(a,d).get(0)&&j.uCanDo(d)&&(i.setNodeName(d,a),i.setNodeTarget(d,a),i.setNodeUrl(d,a),i.setNodeLineIcos(d,a),i.setNodeFontCss(d,a))}};b.treeTools=c;h.setZTreeTools(d,c);b[a]&&b[a].length>0?i.createNodes(d,0,b[a],null,-1):d.async.enable&&d.async.url&&d.async.url!==""&&i.asyncNode(d);return c}};var P=q.fn.zTree,k=j.$,f=P.consts})(jQuery);

/*
 * JQuery zTree excheck v3.5.19.1
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-10-26
 */
(function(m){var p,q,r,o={event:{CHECK:"ztree_check"},id:{CHECK:"_check"},checkbox:{STYLE:"checkbox",DEFAULT:"chk",DISABLED:"disable",FALSE:"false",TRUE:"true",FULL:"full",PART:"part",FOCUS:"focus"},radio:{STYLE:"radio",TYPE_ALL:"all",TYPE_LEVEL:"level"}},v={check:{enable:!1,autoCheckTrigger:!1,chkStyle:o.checkbox.STYLE,nocheckInherit:!1,chkDisabledInherit:!1,radioType:o.radio.TYPE_LEVEL,chkboxType:{Y:"ps",N:"ps"}},data:{key:{checked:"checked"}},callback:{beforeCheck:null,onCheck:null}};p=function(c,
a){if(a.chkDisabled===!0)return!1;var b=g.getSetting(c.data.treeId),d=b.data.key.checked;if(k.apply(b.callback.beforeCheck,[b.treeId,a],!0)==!1)return!0;a[d]=!a[d];e.checkNodeRelation(b,a);d=n(a,j.id.CHECK,b);e.setChkClass(b,d,a);e.repairParentChkClassWithSelf(b,a);b.treeObj.trigger(j.event.CHECK,[c,b.treeId,a]);return!0};q=function(c,a){if(a.chkDisabled===!0)return!1;var b=g.getSetting(c.data.treeId),d=n(a,j.id.CHECK,b);a.check_Focus=!0;e.setChkClass(b,d,a);return!0};r=function(c,a){if(a.chkDisabled===
!0)return!1;var b=g.getSetting(c.data.treeId),d=n(a,j.id.CHECK,b);a.check_Focus=!1;e.setChkClass(b,d,a);return!0};m.extend(!0,m.fn.zTree.consts,o);m.extend(!0,m.fn.zTree._z,{tools:{},view:{checkNodeRelation:function(c,a){var b,d,h,i=c.data.key.children,l=c.data.key.checked;b=j.radio;if(c.check.chkStyle==b.STYLE){var f=g.getRadioCheckedList(c);if(a[l])if(c.check.radioType==b.TYPE_ALL){for(d=f.length-1;d>=0;d--)b=f[d],b[l]&&b!=a&&(b[l]=!1,f.splice(d,1),e.setChkClass(c,n(b,j.id.CHECK,c),b),b.parentTId!=
a.parentTId&&e.repairParentChkClassWithSelf(c,b));f.push(a)}else{f=a.parentTId?a.getParentNode():g.getRoot(c);for(d=0,h=f[i].length;d<h;d++)b=f[i][d],b[l]&&b!=a&&(b[l]=!1,e.setChkClass(c,n(b,j.id.CHECK,c),b))}else if(c.check.radioType==b.TYPE_ALL)for(d=0,h=f.length;d<h;d++)if(a==f[d]){f.splice(d,1);break}}else a[l]&&(!a[i]||a[i].length==0||c.check.chkboxType.Y.indexOf("s")>-1)&&e.setSonNodeCheckBox(c,a,!0),!a[l]&&(!a[i]||a[i].length==0||c.check.chkboxType.N.indexOf("s")>-1)&&e.setSonNodeCheckBox(c,
a,!1),a[l]&&c.check.chkboxType.Y.indexOf("p")>-1&&e.setParentNodeCheckBox(c,a,!0),!a[l]&&c.check.chkboxType.N.indexOf("p")>-1&&e.setParentNodeCheckBox(c,a,!1)},makeChkClass:function(c,a){var b=c.data.key.checked,d=j.checkbox,h=j.radio,i="",i=a.chkDisabled===!0?d.DISABLED:a.halfCheck?d.PART:c.check.chkStyle==h.STYLE?a.check_Child_State<1?d.FULL:d.PART:a[b]?a.check_Child_State===2||a.check_Child_State===-1?d.FULL:d.PART:a.check_Child_State<1?d.FULL:d.PART,b=c.check.chkStyle+"_"+(a[b]?d.TRUE:d.FALSE)+
"_"+i,b=a.check_Focus&&a.chkDisabled!==!0?b+"_"+d.FOCUS:b;return j.className.BUTTON+" "+d.DEFAULT+" "+b},repairAllChk:function(c,a){if(c.check.enable&&c.check.chkStyle===j.checkbox.STYLE)for(var b=c.data.key.checked,d=c.data.key.children,h=g.getRoot(c),i=0,l=h[d].length;i<l;i++){var f=h[d][i];f.nocheck!==!0&&f.chkDisabled!==!0&&(f[b]=a);e.setSonNodeCheckBox(c,f,a)}},repairChkClass:function(c,a){if(a&&(g.makeChkFlag(c,a),a.nocheck!==!0)){var b=n(a,j.id.CHECK,c);e.setChkClass(c,b,a)}},repairParentChkClass:function(c,
a){if(a&&a.parentTId){var b=a.getParentNode();e.repairChkClass(c,b);e.repairParentChkClass(c,b)}},repairParentChkClassWithSelf:function(c,a){if(a){var b=c.data.key.children;a[b]&&a[b].length>0?e.repairParentChkClass(c,a[b][0]):e.repairParentChkClass(c,a)}},repairSonChkDisabled:function(c,a,b,d){if(a){var h=c.data.key.children;if(a.chkDisabled!=b)a.chkDisabled=b;e.repairChkClass(c,a);if(a[h]&&d)for(var i=0,l=a[h].length;i<l;i++)e.repairSonChkDisabled(c,a[h][i],b,d)}},repairParentChkDisabled:function(c,
a,b,d){if(a){if(a.chkDisabled!=b&&d)a.chkDisabled=b;e.repairChkClass(c,a);e.repairParentChkDisabled(c,a.getParentNode(),b,d)}},setChkClass:function(c,a,b){a&&(b.nocheck===!0?a.hide():a.show(),a.attr("class",e.makeChkClass(c,b)))},setParentNodeCheckBox:function(c,a,b,d){var h=c.data.key.children,i=c.data.key.checked,l=n(a,j.id.CHECK,c);d||(d=a);g.makeChkFlag(c,a);a.nocheck!==!0&&a.chkDisabled!==!0&&(a[i]=b,e.setChkClass(c,l,a),c.check.autoCheckTrigger&&a!=d&&c.treeObj.trigger(j.event.CHECK,[null,c.treeId,
a]));if(a.parentTId){l=!0;if(!b)for(var h=a.getParentNode()[h],f=0,k=h.length;f<k;f++)if(h[f].nocheck!==!0&&h[f].chkDisabled!==!0&&h[f][i]||(h[f].nocheck===!0||h[f].chkDisabled===!0)&&h[f].check_Child_State>0){l=!1;break}l&&e.setParentNodeCheckBox(c,a.getParentNode(),b,d)}},setSonNodeCheckBox:function(c,a,b,d){if(a){var h=c.data.key.children,i=c.data.key.checked,l=n(a,j.id.CHECK,c);d||(d=a);var f=!1;if(a[h])for(var k=0,m=a[h].length;k<m&&a.chkDisabled!==!0;k++){var o=a[h][k];e.setSonNodeCheckBox(c,
o,b,d);o.chkDisabled===!0&&(f=!0)}if(a!=g.getRoot(c)&&a.chkDisabled!==!0){f&&a.nocheck!==!0&&g.makeChkFlag(c,a);if(a.nocheck!==!0&&a.chkDisabled!==!0){if(a[i]=b,!f)a.check_Child_State=a[h]&&a[h].length>0?b?2:0:-1}else a.check_Child_State=-1;e.setChkClass(c,l,a);c.check.autoCheckTrigger&&a!=d&&a.nocheck!==!0&&a.chkDisabled!==!0&&c.treeObj.trigger(j.event.CHECK,[null,c.treeId,a])}}}},event:{},data:{getRadioCheckedList:function(c){for(var a=g.getRoot(c).radioCheckedList,b=0,d=a.length;b<d;b++)g.getNodeCache(c,
a[b].tId)||(a.splice(b,1),b--,d--);return a},getCheckStatus:function(c,a){if(!c.check.enable||a.nocheck||a.chkDisabled)return null;var b=c.data.key.checked;return{checked:a[b],half:a.halfCheck?a.halfCheck:c.check.chkStyle==j.radio.STYLE?a.check_Child_State===2:a[b]?a.check_Child_State>-1&&a.check_Child_State<2:a.check_Child_State>0}},getTreeCheckedNodes:function(c,a,b,d){if(!a)return[];for(var h=c.data.key.children,i=c.data.key.checked,e=b&&c.check.chkStyle==j.radio.STYLE&&c.check.radioType==j.radio.TYPE_ALL,
d=!d?[]:d,f=0,k=a.length;f<k;f++){if(a[f].nocheck!==!0&&a[f].chkDisabled!==!0&&a[f][i]==b&&(d.push(a[f]),e))break;g.getTreeCheckedNodes(c,a[f][h],b,d);if(e&&d.length>0)break}return d},getTreeChangeCheckedNodes:function(c,a,b){if(!a)return[];for(var d=c.data.key.children,h=c.data.key.checked,b=!b?[]:b,i=0,e=a.length;i<e;i++)a[i].nocheck!==!0&&a[i].chkDisabled!==!0&&a[i][h]!=a[i].checkedOld&&b.push(a[i]),g.getTreeChangeCheckedNodes(c,a[i][d],b);return b},makeChkFlag:function(c,a){if(a){var b=c.data.key.children,
d=c.data.key.checked,h=-1;if(a[b])for(var i=0,e=a[b].length;i<e;i++){var f=a[b][i],g=-1;if(c.check.chkStyle==j.radio.STYLE)if(g=f.nocheck===!0||f.chkDisabled===!0?f.check_Child_State:f.halfCheck===!0?2:f[d]?2:f.check_Child_State>0?2:0,g==2){h=2;break}else g==0&&(h=0);else if(c.check.chkStyle==j.checkbox.STYLE)if(g=f.nocheck===!0||f.chkDisabled===!0?f.check_Child_State:f.halfCheck===!0?1:f[d]?f.check_Child_State===-1||f.check_Child_State===2?2:1:f.check_Child_State>0?1:0,g===1){h=1;break}else if(g===
2&&h>-1&&i>0&&g!==h){h=1;break}else if(h===2&&g>-1&&g<2){h=1;break}else g>-1&&(h=g)}a.check_Child_State=h}}}});var m=m.fn.zTree,k=m._z.tools,j=m.consts,e=m._z.view,g=m._z.data,n=k.$;g.exSetting(v);g.addInitBind(function(c){c.treeObj.bind(j.event.CHECK,function(a,b,d,h){a.srcEvent=b;k.apply(c.callback.onCheck,[a,d,h])})});g.addInitUnBind(function(c){c.treeObj.unbind(j.event.CHECK)});g.addInitCache(function(){});g.addInitNode(function(c,a,b,d){if(b){a=c.data.key.checked;typeof b[a]=="string"&&(b[a]=
k.eqs(b[a],"true"));b[a]=!!b[a];b.checkedOld=b[a];if(typeof b.nocheck=="string")b.nocheck=k.eqs(b.nocheck,"true");b.nocheck=!!b.nocheck||c.check.nocheckInherit&&d&&!!d.nocheck;if(typeof b.chkDisabled=="string")b.chkDisabled=k.eqs(b.chkDisabled,"true");b.chkDisabled=!!b.chkDisabled||c.check.chkDisabledInherit&&d&&!!d.chkDisabled;if(typeof b.halfCheck=="string")b.halfCheck=k.eqs(b.halfCheck,"true");b.halfCheck=!!b.halfCheck;b.check_Child_State=-1;b.check_Focus=!1;b.getCheckStatus=function(){return g.getCheckStatus(c,
b)};c.check.chkStyle==j.radio.STYLE&&c.check.radioType==j.radio.TYPE_ALL&&b[a]&&g.getRoot(c).radioCheckedList.push(b)}});g.addInitProxy(function(c){var a=c.target,b=g.getSetting(c.data.treeId),d="",h=null,e="",l=null;if(k.eqs(c.type,"mouseover")){if(b.check.enable&&k.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+j.id.CHECK)!==null)d=k.getNodeMainDom(a).id,e="mouseoverCheck"}else if(k.eqs(c.type,"mouseout")){if(b.check.enable&&k.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+j.id.CHECK)!==null)d=
k.getNodeMainDom(a).id,e="mouseoutCheck"}else if(k.eqs(c.type,"click")&&b.check.enable&&k.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+j.id.CHECK)!==null)d=k.getNodeMainDom(a).id,e="checkNode";if(d.length>0)switch(h=g.getNodeCache(b,d),e){case "checkNode":l=p;break;case "mouseoverCheck":l=q;break;case "mouseoutCheck":l=r}return{stop:e==="checkNode",node:h,nodeEventType:e,nodeEventCallback:l,treeEventType:"",treeEventCallback:null}},!0);g.addInitRoot(function(c){g.getRoot(c).radioCheckedList=[]});
g.addBeforeA(function(c,a,b){c.check.enable&&(g.makeChkFlag(c,a),b.push("<span ID='",a.tId,j.id.CHECK,"' class='",e.makeChkClass(c,a),"' treeNode",j.id.CHECK,a.nocheck===!0?" style='display:none;'":"","></span>"))});g.addZTreeTools(function(c,a){a.checkNode=function(a,b,c,g){var f=this.setting.data.key.checked;if(a.chkDisabled!==!0&&(b!==!0&&b!==!1&&(b=!a[f]),g=!!g,(a[f]!==b||c)&&!(g&&k.apply(this.setting.callback.beforeCheck,[this.setting.treeId,a],!0)==!1)&&k.uCanDo(this.setting)&&this.setting.check.enable&&
a.nocheck!==!0))a[f]=b,b=n(a,j.id.CHECK,this.setting),(c||this.setting.check.chkStyle===j.radio.STYLE)&&e.checkNodeRelation(this.setting,a),e.setChkClass(this.setting,b,a),e.repairParentChkClassWithSelf(this.setting,a),g&&this.setting.treeObj.trigger(j.event.CHECK,[null,this.setting.treeId,a])};a.checkAllNodes=function(a){e.repairAllChk(this.setting,!!a)};a.getCheckedNodes=function(a){var b=this.setting.data.key.children;return g.getTreeCheckedNodes(this.setting,g.getRoot(this.setting)[b],a!==!1)};
a.getChangeCheckedNodes=function(){var a=this.setting.data.key.children;return g.getTreeChangeCheckedNodes(this.setting,g.getRoot(this.setting)[a])};a.setChkDisabled=function(a,b,c,g){b=!!b;c=!!c;e.repairSonChkDisabled(this.setting,a,b,!!g);e.repairParentChkDisabled(this.setting,a.getParentNode(),b,c)};var b=a.updateNode;a.updateNode=function(c,g){b&&b.apply(a,arguments);if(c&&this.setting.check.enable&&n(c,this.setting).get(0)&&k.uCanDo(this.setting)){var i=n(c,j.id.CHECK,this.setting);(g==!0||this.setting.check.chkStyle===
j.radio.STYLE)&&e.checkNodeRelation(this.setting,c);e.setChkClass(this.setting,i,c);e.repairParentChkClassWithSelf(this.setting,c)}}});var s=e.createNodes;e.createNodes=function(c,a,b,d,g){s&&s.apply(e,arguments);b&&e.repairParentChkClassWithSelf(c,d)};var t=e.removeNode;e.removeNode=function(c,a){var b=a.getParentNode();t&&t.apply(e,arguments);a&&b&&(e.repairChkClass(c,b),e.repairParentChkClass(c,b))};var u=e.appendNodes;e.appendNodes=function(c,a,b,d,h,i,j){var f="";u&&(f=u.apply(e,arguments));
d&&g.makeChkFlag(c,d);return f}})(jQuery);

/*
 * JQuery zTree exHideNodes v3.5.21
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2016-02-17
 */
(function(i){i.extend(!0,i.fn.zTree._z,{view:{clearOldFirstNode:function(c,a){for(var b=a.getNextNode();b;){if(b.isFirstNode){b.isFirstNode=!1;d.setNodeLineIcos(c,b);break}if(b.isLastNode)break;b=b.getNextNode()}},clearOldLastNode:function(c,a,b){for(a=a.getPreNode();a;){if(a.isLastNode){a.isLastNode=!1;b&&d.setNodeLineIcos(c,a);break}if(a.isFirstNode)break;a=a.getPreNode()}},makeDOMNodeMainBefore:function(c,a,b){c.push("<li ",b.isHidden?"style='display:none;' ":"","id='",b.tId,"' class='",l.className.LEVEL,
b.level,"' tabindex='0' hidefocus='true' treenode>")},showNode:function(c,a){a.isHidden=!1;f.initShowForExCheck(c,a);j(a,c).show()},showNodes:function(c,a,b){if(a&&a.length!=0){var e={},g,k;for(g=0,k=a.length;g<k;g++){var h=a[g];if(!e[h.parentTId]){var i=h.getParentNode();e[h.parentTId]=i===null?f.getRoot(c):h.getParentNode()}d.showNode(c,h,b)}for(var j in e)a=e[j][c.data.key.children],d.setFirstNodeForShow(c,a),d.setLastNodeForShow(c,a)}},hideNode:function(c,a){a.isHidden=!0;a.isFirstNode=!1;a.isLastNode=
!1;f.initHideForExCheck(c,a);d.cancelPreSelectedNode(c,a);j(a,c).hide()},hideNodes:function(c,a,b){if(a&&a.length!=0){var e={},g,k;for(g=0,k=a.length;g<k;g++){var h=a[g];if((h.isFirstNode||h.isLastNode)&&!e[h.parentTId]){var i=h.getParentNode();e[h.parentTId]=i===null?f.getRoot(c):h.getParentNode()}d.hideNode(c,h,b)}for(var j in e)a=e[j][c.data.key.children],d.setFirstNodeForHide(c,a),d.setLastNodeForHide(c,a)}},setFirstNode:function(c,a){var b=c.data.key.children,e=a[b].length;e>0&&!a[b][0].isHidden?
a[b][0].isFirstNode=!0:e>0&&d.setFirstNodeForHide(c,a[b])},setLastNode:function(c,a){var b=c.data.key.children,e=a[b].length;e>0&&!a[b][0].isHidden?a[b][e-1].isLastNode=!0:e>0&&d.setLastNodeForHide(c,a[b])},setFirstNodeForHide:function(c,a){var b,e,g;for(e=0,g=a.length;e<g;e++){b=a[e];if(b.isFirstNode)break;if(!b.isHidden&&!b.isFirstNode){b.isFirstNode=!0;d.setNodeLineIcos(c,b);break}else b=null}return b},setFirstNodeForShow:function(c,a){var b,e,g,f,h;for(e=0,g=a.length;e<g;e++)if(b=a[e],!f&&!b.isHidden&&
b.isFirstNode){f=b;break}else if(!f&&!b.isHidden&&!b.isFirstNode)b.isFirstNode=!0,f=b,d.setNodeLineIcos(c,b);else if(f&&b.isFirstNode){b.isFirstNode=!1;h=b;d.setNodeLineIcos(c,b);break}return{"new":f,old:h}},setLastNodeForHide:function(c,a){var b,e;for(e=a.length-1;e>=0;e--){b=a[e];if(b.isLastNode)break;if(!b.isHidden&&!b.isLastNode){b.isLastNode=!0;d.setNodeLineIcos(c,b);break}else b=null}return b},setLastNodeForShow:function(c,a){var b,e,g,f;for(e=a.length-1;e>=0;e--)if(b=a[e],!g&&!b.isHidden&&
b.isLastNode){g=b;break}else if(!g&&!b.isHidden&&!b.isLastNode)b.isLastNode=!0,g=b,d.setNodeLineIcos(c,b);else if(g&&b.isLastNode){b.isLastNode=!1;f=b;d.setNodeLineIcos(c,b);break}return{"new":g,old:f}}},data:{initHideForExCheck:function(c,a){if(a.isHidden&&c.check&&c.check.enable){if(typeof a._nocheck=="undefined")a._nocheck=!!a.nocheck,a.nocheck=!0;a.check_Child_State=-1;d.repairParentChkClassWithSelf&&d.repairParentChkClassWithSelf(c,a)}},initShowForExCheck:function(c,a){if(!a.isHidden&&c.check&&
c.check.enable){if(typeof a._nocheck!="undefined")a.nocheck=a._nocheck,delete a._nocheck;if(d.setChkClass){var b=j(a,l.id.CHECK,c);d.setChkClass(c,b,a)}d.repairParentChkClassWithSelf&&d.repairParentChkClassWithSelf(c,a)}}}});var i=i.fn.zTree,m=i._z.tools,l=i.consts,d=i._z.view,f=i._z.data,j=m.$;f.addInitNode(function(c,a,b){if(typeof b.isHidden=="string")b.isHidden=m.eqs(b.isHidden,"true");b.isHidden=!!b.isHidden;f.initHideForExCheck(c,b)});f.addBeforeA(function(){});f.addZTreeTools(function(c,a){a.showNodes=
function(a,b){d.showNodes(c,a,b)};a.showNode=function(a,b){a&&d.showNodes(c,[a],b)};a.hideNodes=function(a,b){d.hideNodes(c,a,b)};a.hideNode=function(a,b){a&&d.hideNodes(c,[a],b)};var b=a.checkNode;if(b)a.checkNode=function(c,d,f,h){(!c||!c.isHidden)&&b.apply(a,arguments)}});var n=f.initNode;f.initNode=function(c,a,b,e,g,i,h){var j=(e?e:f.getRoot(c))[c.data.key.children];f.tmpHideFirstNode=d.setFirstNodeForHide(c,j);f.tmpHideLastNode=d.setLastNodeForHide(c,j);h&&(d.setNodeLineIcos(c,f.tmpHideFirstNode),
d.setNodeLineIcos(c,f.tmpHideLastNode));g=f.tmpHideFirstNode===b;i=f.tmpHideLastNode===b;n&&n.apply(f,arguments);h&&i&&d.clearOldLastNode(c,b,h)};var o=f.makeChkFlag;if(o)f.makeChkFlag=function(c,a){(!a||!a.isHidden)&&o.apply(f,arguments)};var p=f.getTreeCheckedNodes;if(p)f.getTreeCheckedNodes=function(c,a,b,e){if(a&&a.length>0){var d=a[0].getParentNode();if(d&&d.isHidden)return[]}return p.apply(f,arguments)};var q=f.getTreeChangeCheckedNodes;if(q)f.getTreeChangeCheckedNodes=function(c,a,b){if(a&&
a.length>0){var d=a[0].getParentNode();if(d&&d.isHidden)return[]}return q.apply(f,arguments)};var r=d.expandCollapseSonNode;if(r)d.expandCollapseSonNode=function(c,a,b,e,f){(!a||!a.isHidden)&&r.apply(d,arguments)};var s=d.setSonNodeCheckBox;if(s)d.setSonNodeCheckBox=function(c,a,b,e){(!a||!a.isHidden)&&s.apply(d,arguments)};var t=d.repairParentChkClassWithSelf;if(t)d.repairParentChkClassWithSelf=function(c,a){(!a||!a.isHidden)&&t.apply(d,arguments)}})(jQuery);

/*
 * JQuery zTree exedit v3.5.19.1
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-10-26
 */
(function(v){var I={event:{DRAG:"ztree_drag",DROP:"ztree_drop",RENAME:"ztree_rename",DRAGMOVE:"ztree_dragmove"},id:{EDIT:"_edit",INPUT:"_input",REMOVE:"_remove"},move:{TYPE_INNER:"inner",TYPE_PREV:"prev",TYPE_NEXT:"next"},node:{CURSELECTED_EDIT:"curSelectedNode_Edit",TMPTARGET_TREE:"tmpTargetzTree",TMPTARGET_NODE:"tmpTargetNode"}},x={onHoverOverNode:function(b,a){var c=m.getSetting(b.data.treeId),d=m.getRoot(c);if(d.curHoverNode!=a)x.onHoverOutNode(b);d.curHoverNode=a;f.addHoverDom(c,a)},onHoverOutNode:function(b){var b=
m.getSetting(b.data.treeId),a=m.getRoot(b);if(a.curHoverNode&&!m.isSelectedNode(b,a.curHoverNode))f.removeTreeDom(b,a.curHoverNode),a.curHoverNode=null},onMousedownNode:function(b,a){function c(b){if(B.dragFlag==0&&Math.abs(N-b.clientX)<e.edit.drag.minMoveSize&&Math.abs(O-b.clientY)<e.edit.drag.minMoveSize)return!0;var a,c,n,k,i;i=e.data.key.children;M.css("cursor","pointer");if(B.dragFlag==0){if(g.apply(e.callback.beforeDrag,[e.treeId,l],!0)==!1)return r(b),!0;for(a=0,c=l.length;a<c;a++){if(a==0)B.dragNodeShowBefore=
[];n=l[a];n.isParent&&n.open?(f.expandCollapseNode(e,n,!n.open),B.dragNodeShowBefore[n.tId]=!0):B.dragNodeShowBefore[n.tId]=!1}B.dragFlag=1;t.showHoverDom=!1;g.showIfameMask(e,!0);n=!0;k=-1;if(l.length>1){var j=l[0].parentTId?l[0].getParentNode()[i]:m.getNodes(e);i=[];for(a=0,c=j.length;a<c;a++)if(B.dragNodeShowBefore[j[a].tId]!==void 0&&(n&&k>-1&&k+1!==a&&(n=!1),i.push(j[a]),k=a),l.length===i.length){l=i;break}}n&&(H=l[0].getPreNode(),R=l[l.length-1].getNextNode());D=o("<ul class='zTreeDragUL'></ul>",
e);for(a=0,c=l.length;a<c;a++)n=l[a],n.editNameFlag=!1,f.selectNode(e,n,a>0),f.removeTreeDom(e,n),a>e.edit.drag.maxShowNodeNum-1||(k=o("<li id='"+n.tId+"_tmp'></li>",e),k.append(o(n,d.id.A,e).clone()),k.css("padding","0"),k.children("#"+n.tId+d.id.A).removeClass(d.node.CURSELECTED),D.append(k),a==e.edit.drag.maxShowNodeNum-1&&(k=o("<li id='"+n.tId+"_moretmp'><a>  ...  </a></li>",e),D.append(k)));D.attr("id",l[0].tId+d.id.UL+"_tmp");D.addClass(e.treeObj.attr("class"));D.appendTo(M);A=o("<span class='tmpzTreeMove_arrow'></span>",
e);A.attr("id","zTreeMove_arrow_tmp");A.appendTo(M);e.treeObj.trigger(d.event.DRAG,[b,e.treeId,l])}if(B.dragFlag==1){s&&A.attr("id")==b.target.id&&u&&b.clientX+F.scrollLeft()+2>v("#"+u+d.id.A,s).offset().left?(n=v("#"+u+d.id.A,s),b.target=n.length>0?n.get(0):b.target):s&&(s.removeClass(d.node.TMPTARGET_TREE),u&&v("#"+u+d.id.A,s).removeClass(d.node.TMPTARGET_NODE+"_"+d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_INNER));
u=s=null;J=!1;h=e;n=m.getSettings();for(var y in n)if(n[y].treeId&&n[y].edit.enable&&n[y].treeId!=e.treeId&&(b.target.id==n[y].treeId||v(b.target).parents("#"+n[y].treeId).length>0))J=!0,h=n[y];y=F.scrollTop();k=F.scrollLeft();i=h.treeObj.offset();a=h.treeObj.get(0).scrollHeight;n=h.treeObj.get(0).scrollWidth;c=b.clientY+y-i.top;var p=h.treeObj.height()+i.top-b.clientY-y,q=b.clientX+k-i.left,x=h.treeObj.width()+i.left-b.clientX-k;i=c<e.edit.drag.borderMax&&c>e.edit.drag.borderMin;var j=p<e.edit.drag.borderMax&&
p>e.edit.drag.borderMin,K=q<e.edit.drag.borderMax&&q>e.edit.drag.borderMin,G=x<e.edit.drag.borderMax&&x>e.edit.drag.borderMin,p=c>e.edit.drag.borderMin&&p>e.edit.drag.borderMin&&q>e.edit.drag.borderMin&&x>e.edit.drag.borderMin,q=i&&h.treeObj.scrollTop()<=0,x=j&&h.treeObj.scrollTop()+h.treeObj.height()+10>=a,P=K&&h.treeObj.scrollLeft()<=0,Q=G&&h.treeObj.scrollLeft()+h.treeObj.width()+10>=n;if(b.target&&g.isChildOrSelf(b.target,h.treeId)){for(var E=b.target;E&&E.tagName&&!g.eqs(E.tagName,"li")&&E.id!=
h.treeId;)E=E.parentNode;var S=!0;for(a=0,c=l.length;a<c;a++)if(n=l[a],E.id===n.tId){S=!1;break}else if(o(n,e).find("#"+E.id).length>0){S=!1;break}if(S&&b.target&&g.isChildOrSelf(b.target,E.id+d.id.A))s=v(E),u=E.id}n=l[0];if(p&&g.isChildOrSelf(b.target,h.treeId)){if(!s&&(b.target.id==h.treeId||q||x||P||Q)&&(J||!J&&n.parentTId))s=h.treeObj;i?h.treeObj.scrollTop(h.treeObj.scrollTop()-10):j&&h.treeObj.scrollTop(h.treeObj.scrollTop()+10);K?h.treeObj.scrollLeft(h.treeObj.scrollLeft()-10):G&&h.treeObj.scrollLeft(h.treeObj.scrollLeft()+
10);s&&s!=h.treeObj&&s.offset().left<h.treeObj.offset().left&&h.treeObj.scrollLeft(h.treeObj.scrollLeft()+s.offset().left-h.treeObj.offset().left)}D.css({top:b.clientY+y+3+"px",left:b.clientX+k+3+"px"});i=a=0;if(s&&s.attr("id")!=h.treeId){var z=u==null?null:m.getNodeCache(h,u);c=(b.ctrlKey||b.metaKey)&&e.edit.drag.isMove&&e.edit.drag.isCopy||!e.edit.drag.isMove&&e.edit.drag.isCopy;a=!!(H&&u===H.tId);i=!!(R&&u===R.tId);k=n.parentTId&&n.parentTId==u;n=(c||!i)&&g.apply(h.edit.drag.prev,[h.treeId,l,z],
!!h.edit.drag.prev);a=(c||!a)&&g.apply(h.edit.drag.next,[h.treeId,l,z],!!h.edit.drag.next);G=(c||!k)&&!(h.data.keep.leaf&&!z.isParent)&&g.apply(h.edit.drag.inner,[h.treeId,l,z],!!h.edit.drag.inner);if(!n&&!a&&!G){if(s=null,u="",w=d.move.TYPE_INNER,A.css({display:"none"}),window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null}else{c=v("#"+u+d.id.A,s);i=z.isLastNode?null:v("#"+z.getNextNode().tId+d.id.A,s.next());j=c.offset().top;k=c.offset().left;K=n?G?0.25:a?
0.5:1:-1;G=a?G?0.75:n?0.5:0:-1;y=(b.clientY+y-j)/c.height();(K==1||y<=K&&y>=-0.2)&&n?(a=1-A.width(),i=j-A.height()/2,w=d.move.TYPE_PREV):(G==0||y>=G&&y<=1.2)&&a?(a=1-A.width(),i=i==null||z.isParent&&z.open?j+c.height()-A.height()/2:i.offset().top-A.height()/2,w=d.move.TYPE_NEXT):(a=5-A.width(),i=j,w=d.move.TYPE_INNER);A.css({display:"block",top:i+"px",left:k+a+"px"});c.addClass(d.node.TMPTARGET_NODE+"_"+w);if(T!=u||U!=w)L=(new Date).getTime();if(z&&z.isParent&&w==d.move.TYPE_INNER&&(y=!0,window.zTreeMoveTimer&&
window.zTreeMoveTargetNodeTId!==z.tId?(clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null):window.zTreeMoveTimer&&window.zTreeMoveTargetNodeTId===z.tId&&(y=!1),y))window.zTreeMoveTimer=setTimeout(function(){w==d.move.TYPE_INNER&&z&&z.isParent&&!z.open&&(new Date).getTime()-L>h.edit.drag.autoOpenTime&&g.apply(h.callback.beforeDragOpen,[h.treeId,z],!0)&&(f.switchNode(h,z),h.edit.drag.autoExpandTrigger&&h.treeObj.trigger(d.event.EXPAND,[h.treeId,z]))},h.edit.drag.autoOpenTime+50),
window.zTreeMoveTargetNodeTId=z.tId}}else if(w=d.move.TYPE_INNER,s&&g.apply(h.edit.drag.inner,[h.treeId,l,null],!!h.edit.drag.inner)?s.addClass(d.node.TMPTARGET_TREE):s=null,A.css({display:"none"}),window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null;T=u;U=w;e.treeObj.trigger(d.event.DRAGMOVE,[b,e.treeId,l])}return!1}function r(b){if(window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null;U=T=null;F.unbind("mousemove",c);
F.unbind("mouseup",r);F.unbind("selectstart",k);M.css("cursor","auto");s&&(s.removeClass(d.node.TMPTARGET_TREE),u&&v("#"+u+d.id.A,s).removeClass(d.node.TMPTARGET_NODE+"_"+d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_INNER));g.showIfameMask(e,!1);t.showHoverDom=!0;if(B.dragFlag!=0){B.dragFlag=0;var a,i,j;for(a=0,i=l.length;a<i;a++)j=l[a],j.isParent&&B.dragNodeShowBefore[j.tId]&&!j.open&&(f.expandCollapseNode(e,j,!j.open),
delete B.dragNodeShowBefore[j.tId]);D&&D.remove();A&&A.remove();var p=(b.ctrlKey||b.metaKey)&&e.edit.drag.isMove&&e.edit.drag.isCopy||!e.edit.drag.isMove&&e.edit.drag.isCopy;!p&&s&&u&&l[0].parentTId&&u==l[0].parentTId&&w==d.move.TYPE_INNER&&(s=null);if(s){var q=u==null?null:m.getNodeCache(h,u);if(g.apply(e.callback.beforeDrop,[h.treeId,l,q,w,p],!0)==!1)f.selectNodes(x,l);else{var C=p?g.clone(l):l;a=function(){if(J){if(!p)for(var a=0,c=l.length;a<c;a++)f.removeNode(e,l[a]);w==d.move.TYPE_INNER?f.addNodes(h,
q,-1,C):f.addNodes(h,q.getParentNode(),w==d.move.TYPE_PREV?q.getIndex():q.getIndex()+1,C)}else if(p&&w==d.move.TYPE_INNER)f.addNodes(h,q,-1,C);else if(p)f.addNodes(h,q.getParentNode(),w==d.move.TYPE_PREV?q.getIndex():q.getIndex()+1,C);else if(w!=d.move.TYPE_NEXT)for(a=0,c=C.length;a<c;a++)f.moveNode(h,q,C[a],w,!1);else for(a=-1,c=C.length-1;a<c;c--)f.moveNode(h,q,C[c],w,!1);f.selectNodes(h,C);o(C[0],e).focus().blur();e.treeObj.trigger(d.event.DROP,[b,h.treeId,C,q,w,p])};w==d.move.TYPE_INNER&&g.canAsync(h,
q)?f.asyncNode(h,q,!1,a):a()}}else f.selectNodes(x,l),e.treeObj.trigger(d.event.DROP,[b,e.treeId,l,null,null,null])}}function k(){return!1}var i,j,e=m.getSetting(b.data.treeId),B=m.getRoot(e),t=m.getRoots();if(b.button==2||!e.edit.enable||!e.edit.drag.isCopy&&!e.edit.drag.isMove)return!0;var p=b.target,q=m.getRoot(e).curSelectedList,l=[];if(m.isSelectedNode(e,a))for(i=0,j=q.length;i<j;i++){if(q[i].editNameFlag&&g.eqs(p.tagName,"input")&&p.getAttribute("treeNode"+d.id.INPUT)!==null)return!0;l.push(q[i]);
if(l[0].parentTId!==q[i].parentTId){l=[a];break}}else l=[a];f.editNodeBlur=!0;f.cancelCurEditNode(e);var F=v(e.treeObj.get(0).ownerDocument),M=v(e.treeObj.get(0).ownerDocument.body),D,A,s,J=!1,h=e,x=e,H,R,T=null,U=null,u=null,w=d.move.TYPE_INNER,N=b.clientX,O=b.clientY,L=(new Date).getTime();g.uCanDo(e)&&F.bind("mousemove",c);F.bind("mouseup",r);F.bind("selectstart",k);b.preventDefault&&b.preventDefault();return!0}};v.extend(!0,v.fn.zTree.consts,I);v.extend(!0,v.fn.zTree._z,{tools:{getAbs:function(b){b=
b.getBoundingClientRect();return[b.left+(document.body.scrollLeft+document.documentElement.scrollLeft),b.top+(document.body.scrollTop+document.documentElement.scrollTop)]},inputFocus:function(b){b.get(0)&&(b.focus(),g.setCursorPosition(b.get(0),b.val().length))},inputSelect:function(b){b.get(0)&&(b.focus(),b.select())},setCursorPosition:function(b,a){if(b.setSelectionRange)b.focus(),b.setSelectionRange(a,a);else if(b.createTextRange){var c=b.createTextRange();c.collapse(!0);c.moveEnd("character",
a);c.moveStart("character",a);c.select()}},showIfameMask:function(b,a){for(var c=m.getRoot(b);c.dragMaskList.length>0;)c.dragMaskList[0].remove(),c.dragMaskList.shift();if(a)for(var d=o("iframe",b),f=0,i=d.length;f<i;f++){var j=d.get(f),e=g.getAbs(j),j=o("<div id='zTreeMask_"+f+"' class='zTreeMask' style='top:"+e[1]+"px; left:"+e[0]+"px; width:"+j.offsetWidth+"px; height:"+j.offsetHeight+"px;'></div>",b);j.appendTo(o("body",b));c.dragMaskList.push(j)}}},view:{addEditBtn:function(b,a){if(!(a.editNameFlag||
o(a,d.id.EDIT,b).length>0)&&g.apply(b.edit.showRenameBtn,[b.treeId,a],b.edit.showRenameBtn)){var c=o(a,d.id.A,b),r="<span class='"+d.className.BUTTON+" edit' id='"+a.tId+d.id.EDIT+"' title='"+g.apply(b.edit.renameTitle,[b.treeId,a],b.edit.renameTitle)+"' treeNode"+d.id.EDIT+" style='display:none;'></span>";c.append(r);o(a,d.id.EDIT,b).bind("click",function(){if(!g.uCanDo(b)||g.apply(b.callback.beforeEditName,[b.treeId,a],!0)==!1)return!1;f.editNode(b,a);return!1}).show()}},addRemoveBtn:function(b,
a){if(!(a.editNameFlag||o(a,d.id.REMOVE,b).length>0)&&g.apply(b.edit.showRemoveBtn,[b.treeId,a],b.edit.showRemoveBtn)){var c=o(a,d.id.A,b),r="<span class='"+d.className.BUTTON+" remove' id='"+a.tId+d.id.REMOVE+"' title='"+g.apply(b.edit.removeTitle,[b.treeId,a],b.edit.removeTitle)+"' treeNode"+d.id.REMOVE+" style='display:none;'></span>";c.append(r);o(a,d.id.REMOVE,b).bind("click",function(){if(!g.uCanDo(b)||g.apply(b.callback.beforeRemove,[b.treeId,a],!0)==!1)return!1;f.removeNode(b,a);b.treeObj.trigger(d.event.REMOVE,
[b.treeId,a]);return!1}).bind("mousedown",function(){return!0}).show()}},addHoverDom:function(b,a){if(m.getRoots().showHoverDom)a.isHover=!0,b.edit.enable&&(f.addEditBtn(b,a),f.addRemoveBtn(b,a)),g.apply(b.view.addHoverDom,[b.treeId,a])},cancelCurEditNode:function(b,a,c){var r=m.getRoot(b),k=b.data.key.name,i=r.curEditNode;if(i){var j=r.curEditInput,a=a?a:c?i[k]:j.val();if(g.apply(b.callback.beforeRename,[b.treeId,i,a,c],!0)===!1)return!1;i[k]=a;o(i,d.id.A,b).removeClass(d.node.CURSELECTED_EDIT);
j.unbind();f.setNodeName(b,i);i.editNameFlag=!1;r.curEditNode=null;r.curEditInput=null;f.selectNode(b,i,!1);b.treeObj.trigger(d.event.RENAME,[b.treeId,i,c])}return r.noSelection=!0},editNode:function(b,a){var c=m.getRoot(b);f.editNodeBlur=!1;if(m.isSelectedNode(b,a)&&c.curEditNode==a&&a.editNameFlag)setTimeout(function(){g.inputFocus(c.curEditInput)},0);else{var r=b.data.key.name;a.editNameFlag=!0;f.removeTreeDom(b,a);f.cancelCurEditNode(b);f.selectNode(b,a,!1);o(a,d.id.SPAN,b).html("<input type=text class='rename' id='"+
a.tId+d.id.INPUT+"' treeNode"+d.id.INPUT+" >");var k=o(a,d.id.INPUT,b);k.attr("value",a[r]);b.edit.editNameSelectAll?g.inputSelect(k):g.inputFocus(k);k.bind("blur",function(){f.editNodeBlur||f.cancelCurEditNode(b)}).bind("keydown",function(a){a.keyCode=="13"?(f.editNodeBlur=!0,f.cancelCurEditNode(b)):a.keyCode=="27"&&f.cancelCurEditNode(b,null,!0)}).bind("click",function(){return!1}).bind("dblclick",function(){return!1});o(a,d.id.A,b).addClass(d.node.CURSELECTED_EDIT);c.curEditInput=k;c.noSelection=
!1;c.curEditNode=a}},moveNode:function(b,a,c,r,k,i){var j=m.getRoot(b),e=b.data.key.children;if(a!=c&&(!b.data.keep.leaf||!a||a.isParent||r!=d.move.TYPE_INNER)){var g=c.parentTId?c.getParentNode():j,t=a===null||a==j;t&&a===null&&(a=j);if(t)r=d.move.TYPE_INNER;j=a.parentTId?a.getParentNode():j;if(r!=d.move.TYPE_PREV&&r!=d.move.TYPE_NEXT)r=d.move.TYPE_INNER;if(r==d.move.TYPE_INNER)if(t)c.parentTId=null;else{if(!a.isParent)a.isParent=!0,a.open=!!a.open,f.setNodeLineIcos(b,a);c.parentTId=a.tId}var p;
t?p=t=b.treeObj:(!i&&r==d.move.TYPE_INNER?f.expandCollapseNode(b,a,!0,!1):i||f.expandCollapseNode(b,a.getParentNode(),!0,!1),t=o(a,b),p=o(a,d.id.UL,b),t.get(0)&&!p.get(0)&&(p=[],f.makeUlHtml(b,a,p,""),t.append(p.join(""))),p=o(a,d.id.UL,b));var q=o(c,b);q.get(0)?t.get(0)||q.remove():q=f.appendNodes(b,c.level,[c],null,-1,!1,!0).join("");p.get(0)&&r==d.move.TYPE_INNER?p.append(q):t.get(0)&&r==d.move.TYPE_PREV?t.before(q):t.get(0)&&r==d.move.TYPE_NEXT&&t.after(q);var l=-1,v=0,x=null,t=null,D=c.level;
if(c.isFirstNode){if(l=0,g[e].length>1)x=g[e][1],x.isFirstNode=!0}else if(c.isLastNode)l=g[e].length-1,x=g[e][l-1],x.isLastNode=!0;else for(p=0,q=g[e].length;p<q;p++)if(g[e][p].tId==c.tId){l=p;break}l>=0&&g[e].splice(l,1);if(r!=d.move.TYPE_INNER)for(p=0,q=j[e].length;p<q;p++)j[e][p].tId==a.tId&&(v=p);if(r==d.move.TYPE_INNER){a[e]||(a[e]=[]);if(a[e].length>0)t=a[e][a[e].length-1],t.isLastNode=!1;a[e].splice(a[e].length,0,c);c.isLastNode=!0;c.isFirstNode=a[e].length==1}else a.isFirstNode&&r==d.move.TYPE_PREV?
(j[e].splice(v,0,c),t=a,t.isFirstNode=!1,c.parentTId=a.parentTId,c.isFirstNode=!0,c.isLastNode=!1):a.isLastNode&&r==d.move.TYPE_NEXT?(j[e].splice(v+1,0,c),t=a,t.isLastNode=!1,c.parentTId=a.parentTId,c.isFirstNode=!1,c.isLastNode=!0):(r==d.move.TYPE_PREV?j[e].splice(v,0,c):j[e].splice(v+1,0,c),c.parentTId=a.parentTId,c.isFirstNode=!1,c.isLastNode=!1);m.fixPIdKeyValue(b,c);m.setSonNodeLevel(b,c.getParentNode(),c);f.setNodeLineIcos(b,c);f.repairNodeLevelClass(b,c,D);!b.data.keep.parent&&g[e].length<
1?(g.isParent=!1,g.open=!1,a=o(g,d.id.UL,b),r=o(g,d.id.SWITCH,b),e=o(g,d.id.ICON,b),f.replaceSwitchClass(g,r,d.folder.DOCU),f.replaceIcoClass(g,e,d.folder.DOCU),a.css("display","none")):x&&f.setNodeLineIcos(b,x);t&&f.setNodeLineIcos(b,t);b.check&&b.check.enable&&f.repairChkClass&&(f.repairChkClass(b,g),f.repairParentChkClassWithSelf(b,g),g!=c.parent&&f.repairParentChkClassWithSelf(b,c));i||f.expandCollapseParentNode(b,c.getParentNode(),!0,k)}},removeEditBtn:function(b,a){o(a,d.id.EDIT,b).unbind().remove()},
removeRemoveBtn:function(b,a){o(a,d.id.REMOVE,b).unbind().remove()},removeTreeDom:function(b,a){a.isHover=!1;f.removeEditBtn(b,a);f.removeRemoveBtn(b,a);g.apply(b.view.removeHoverDom,[b.treeId,a])},repairNodeLevelClass:function(b,a,c){if(c!==a.level){var f=o(a,b),g=o(a,d.id.A,b),b=o(a,d.id.UL,b),c=d.className.LEVEL+c,a=d.className.LEVEL+a.level;f.removeClass(c);f.addClass(a);g.removeClass(c);g.addClass(a);b.removeClass(c);b.addClass(a)}},selectNodes:function(b,a){for(var c=0,d=a.length;c<d;c++)f.selectNode(b,
a[c],c>0)}},event:{},data:{setSonNodeLevel:function(b,a,c){if(c){var d=b.data.key.children;c.level=a?a.level+1:0;if(c[d])for(var a=0,f=c[d].length;a<f;a++)c[d][a]&&m.setSonNodeLevel(b,c,c[d][a])}}}});var H=v.fn.zTree,g=H._z.tools,d=H.consts,f=H._z.view,m=H._z.data,o=g.$;m.exSetting({edit:{enable:!1,editNameSelectAll:!1,showRemoveBtn:!0,showRenameBtn:!0,removeTitle:"remove",renameTitle:"rename",drag:{autoExpandTrigger:!1,isCopy:!0,isMove:!0,prev:!0,next:!0,inner:!0,minMoveSize:5,borderMax:10,borderMin:-5,
maxShowNodeNum:5,autoOpenTime:500}},view:{addHoverDom:null,removeHoverDom:null},callback:{beforeDrag:null,beforeDragOpen:null,beforeDrop:null,beforeEditName:null,beforeRename:null,onDrag:null,onDragMove:null,onDrop:null,onRename:null}});m.addInitBind(function(b){var a=b.treeObj,c=d.event;a.bind(c.RENAME,function(a,c,d,f){g.apply(b.callback.onRename,[a,c,d,f])});a.bind(c.DRAG,function(a,c,d,f){g.apply(b.callback.onDrag,[c,d,f])});a.bind(c.DRAGMOVE,function(a,c,d,f){g.apply(b.callback.onDragMove,[c,
d,f])});a.bind(c.DROP,function(a,c,d,f,e,m,o){g.apply(b.callback.onDrop,[c,d,f,e,m,o])})});m.addInitUnBind(function(b){var b=b.treeObj,a=d.event;b.unbind(a.RENAME);b.unbind(a.DRAG);b.unbind(a.DRAGMOVE);b.unbind(a.DROP)});m.addInitCache(function(){});m.addInitNode(function(b,a,c){if(c)c.isHover=!1,c.editNameFlag=!1});m.addInitProxy(function(b){var a=b.target,c=m.getSetting(b.data.treeId),f=b.relatedTarget,k="",i=null,j="",e=null,o=null;if(g.eqs(b.type,"mouseover")){if(o=g.getMDom(c,a,[{tagName:"a",
attrName:"treeNode"+d.id.A}]))k=g.getNodeMainDom(o).id,j="hoverOverNode"}else if(g.eqs(b.type,"mouseout"))o=g.getMDom(c,f,[{tagName:"a",attrName:"treeNode"+d.id.A}]),o||(k="remove",j="hoverOutNode");else if(g.eqs(b.type,"mousedown")&&(o=g.getMDom(c,a,[{tagName:"a",attrName:"treeNode"+d.id.A}])))k=g.getNodeMainDom(o).id,j="mousedownNode";if(k.length>0)switch(i=m.getNodeCache(c,k),j){case "mousedownNode":e=x.onMousedownNode;break;case "hoverOverNode":e=x.onHoverOverNode;break;case "hoverOutNode":e=
x.onHoverOutNode}return{stop:!1,node:i,nodeEventType:j,nodeEventCallback:e,treeEventType:"",treeEventCallback:null}});m.addInitRoot(function(b){var b=m.getRoot(b),a=m.getRoots();b.curEditNode=null;b.curEditInput=null;b.curHoverNode=null;b.dragFlag=0;b.dragNodeShowBefore=[];b.dragMaskList=[];a.showHoverDom=!0});m.addZTreeTools(function(b,a){a.cancelEditName=function(a){m.getRoot(this.setting).curEditNode&&f.cancelCurEditNode(this.setting,a?a:null,!0)};a.copyNode=function(a,b,k,i){if(!b)return null;
if(a&&!a.isParent&&this.setting.data.keep.leaf&&k===d.move.TYPE_INNER)return null;var j=this,e=g.clone(b);if(!a)a=null,k=d.move.TYPE_INNER;k==d.move.TYPE_INNER?(b=function(){f.addNodes(j.setting,a,-1,[e],i)},g.canAsync(this.setting,a)?f.asyncNode(this.setting,a,i,b):b()):(f.addNodes(this.setting,a.parentNode,-1,[e],i),f.moveNode(this.setting,a,e,k,!1,i));return e};a.editName=function(a){a&&a.tId&&a===m.getNodeCache(this.setting,a.tId)&&(a.parentTId&&f.expandCollapseParentNode(this.setting,a.getParentNode(),
!0),f.editNode(this.setting,a))};a.moveNode=function(a,b,k,i){function j(){f.moveNode(e.setting,a,b,k,!1,i)}if(!b)return b;if(a&&!a.isParent&&this.setting.data.keep.leaf&&k===d.move.TYPE_INNER)return null;else if(a&&(b.parentTId==a.tId&&k==d.move.TYPE_INNER||o(b,this.setting).find("#"+a.tId).length>0))return null;else a||(a=null);var e=this;g.canAsync(this.setting,a)&&k===d.move.TYPE_INNER?f.asyncNode(this.setting,a,i,j):j();return b};a.setEditable=function(a){this.setting.edit.enable=a;return this.refresh()}});
var N=f.cancelPreSelectedNode;f.cancelPreSelectedNode=function(b,a){for(var c=m.getRoot(b).curSelectedList,d=0,g=c.length;d<g;d++)if(!a||a===c[d])if(f.removeTreeDom(b,c[d]),a)break;N&&N.apply(f,arguments)};var O=f.createNodes;f.createNodes=function(b,a,c,d,g){O&&O.apply(f,arguments);c&&f.repairParentChkClassWithSelf&&f.repairParentChkClassWithSelf(b,d)};var V=f.makeNodeUrl;f.makeNodeUrl=function(b,a){return b.edit.enable?null:V.apply(f,arguments)};var L=f.removeNode;f.removeNode=function(b,a){var c=
m.getRoot(b);if(c.curEditNode===a)c.curEditNode=null;L&&L.apply(f,arguments)};var P=f.selectNode;f.selectNode=function(b,a,c){var d=m.getRoot(b);if(m.isSelectedNode(b,a)&&d.curEditNode==a&&a.editNameFlag)return!1;P&&P.apply(f,arguments);f.addHoverDom(b,a);return!0};var Q=g.uCanDo;g.uCanDo=function(b,a){var c=m.getRoot(b);if(a&&(g.eqs(a.type,"mouseover")||g.eqs(a.type,"mouseout")||g.eqs(a.type,"mousedown")||g.eqs(a.type,"mouseup")))return!0;if(c.curEditNode)f.editNodeBlur=!1,c.curEditInput.focus();
return!c.curEditNode&&(Q?Q.apply(f,arguments):!0)}})(jQuery);


var infoBox = infoBox || {};

(function ($) {
    var infoBoxBase = {
        $el: null,
        options: {
            position: 'center'
        },
        _init: function () {
            this._removeAll();
            this._createBox();
            if (this.options.movable) {
                this._makeMovable();
            }

        },
        _createBox: function () {
            var me = this, $box;
            $box = $('<div class="infoBox infoBox-unique ' + me.options.boxType + '"></div>');

            this.$el = $box;

            if (me.options.hasHeader) {
                var $header = $('<div class="infoBox-header"></div>');

                if (me.options.movable) {
                    $header.addClass('movable');
                }
                if (me.options.title) {
                    $header.append('<div class="ellipsis infoBox-title">' + me.options.title + '</div>');
                }


                if (me.options.hasClose) {
                    var $close = $('<div class="infoBox-close"></div>');
                    $header.append($close);
                    $close.click(function () {
                        me._destroy();
                    })
                }
                $box.append($header);
            }

            var $body = $('<div class="infoBox-body scrollbar"></div>');

            if (me.options.icon) {
                $body.append('<div class="infoBox-icon"><img src="/static/scripts/lib/beopNotification/image/' + me.options.icon + '"></div>');
            }

            if (me.options.msg) {
                $body.append('<div class="infoBox-msg">' + me.options.msg + '</div>');
            }
            $box.append($body);
            if (me.options.buttons) {
                var $footer = $('<div class="infoBox-footer"></div>');
                $box.append($footer);
                for (var btnKey in me.options.buttons) {
                    $footer.append(me._createBtn(me.options.buttons[btnKey]));
                }
            }

            if (me.options.delay) {
                var $progress = $('<div class="progress progress-bar-success"><div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%"><span class="sr-only"</span></div></div>');

                $progress.insertBefore($body);
                $progress.animate({
                    width: "100%"
                }, +me.options.delay ? +me.options.delay : 20000, function () {
                    me._destroy();
                });
            }

            if (me.options.modal) {
                var modalHtml = '<div id="infoBoxModal"></div>';
                $('body').append(modalHtml);
                //$box.addClass('modal');
            }
            $box.appendTo(document.body);
            return $box;
        },
        _processInput: function (options) {
            options.boxType = this.constructor.name ? this.constructor.name : '';
            return options;
        },
        _show: function () {
            this.$el.fadeIn('fast');
        },
        _hide: function () {
            this.$el.hide();
        },
        _destroy: function () {
            var me = this;
            me.$el.fadeOut('fast', function () {
                me.$el.remove();
            });
            if (me.options.modal) {
                $('#infoBoxModal').remove();
            }
        },

        _makeMovable: function () {
            var me = this;
            me.$el.mousedown(function () {
                me.$el.mousemove(function (e) {

                    var thisX = event.pageX - $(this).width() / 2,
                        thisY = event.pageY - $(this).height() / 2;

                    me.$el.offset({
                        left: thisX,
                        top: thisY
                    });
                })
            }).mouseup(function () {
                me.$el.off('mousemove');
            })
        },
        _removeAll: function () {
            if (this.options.boxType) {
                if (this.options.boxType == 'remind') {
                    $(document.body).children('.remind').remove();
                } else {

                }
            } else {
                $(document.body).children('.infoBox-unique').remove();
            }

        },

        _createBtn: function (option) {
            var me = this;
            var $button = $('<button class="btn btn-info alert-button"></button>');
            $button.text(option.text);
            $button.click(function () {
                me._destroy();
                option.callback && option.callback();
            });
            $button.addClass(option.css);
            this.$el.find('.infoBox-footer').append($button);
        }
    };

    function infoBoxAlert(typeOrMsg, options) {
        var _this = this;
        if (!options) {
            this.type = infoBox.alert.base.type;
            options = {msg: typeOrMsg}
        }

        if (!typeOrMsg) {
            this.type = infoBox.alert.base.type;
        } else if (infoBox.alert.options[typeOrMsg]) {
            this.type = typeOrMsg;
        } else {
            options = $.extend(options, {msg: typeOrMsg});
        }

        this.options = this._processInput(options);

        this._init();
        this._show();

        if (options.delay && !isNaN(options.delay)) {
            var timeout = setTimeout(function () {
                _this._destroy();
                timeout = null;
            }, options.delay)
        }
    }

    infoBoxAlert.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxAlert,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.alert.base, infoBox.alert.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.alert = function (type, options) {
        return new infoBoxAlert(type, options);
    };

    infoBox.alert.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
                class: 'alert-button',
                callback: ''
            }
        },
        modal: true,
        hasHeader: true,
        hasClose: true,
        movable: false
    };

    infoBox.alert.options = {
        success: {
            icon: 'alert-success.png'
        },
        warning: {
            icon: 'alert-warning.png'
        },
        danger: {
            icon: 'alert-danger.png'
        },
        info: {
            icon: 'alert-info.png'
        }
    };


    function infoBoxConfirm(msg, okCallback, cancelCallback, options) {
        this.type = infoBox.confirm.base.type;
        if (!okCallback && !cancelCallback) {
            okCallback = function () {
            };
            cancelCallback = function () {
            };
            this.type = 'danger';
            msg = 'warning:you not pass the callback to confirm function';
        }
        options = $.extend(options, {
            msg: msg,
            buttons: {
                ok: {
                    callback: okCallback
                },
                cancel: {
                    callback: cancelCallback
                }
            }
        });
        this.options = this._processInput(options);
        this._init();
        this._show();
    }

    infoBoxConfirm.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxConfirm,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.confirm.base, infoBox.confirm.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.confirm = function (msg, okCallback, cancelCallback, options) {
        return new infoBoxConfirm(msg, okCallback, cancelCallback, options);
    };

    infoBox.confirm.base = {
        type: 'info',
        buttons: {
            ok: {
                text: 'OK',
                class: 'alert-button',
                callback: function () {
                    return true;
                }
            },
            cancel: {
                text: 'Cancel',
                class: 'alert-button',
                callback: function () {
                    return false;
                }
            }
        },
        modal: true,
        hasHeader: true,
        hasClose: true,
        movable: false
    };

    infoBox.confirm.options = {
        success: {
            icon: 'alert-success.png'
        },
        warning: {
            icon: 'alert-warning.png'
        },
        danger: {
            icon: 'alert-danger.png'
        },
        info: {
            icon: 'alert-info.png'
        }
    };

    // remind
    function infoBoxRemind(typeOrMsg, options) {
        if (!options) {
            this.type = infoBox.remind.base.type;
            options = {msg: typeOrMsg}
        }

        if (!typeOrMsg) {
            this.type = infoBox.remind.base.type;
        } else if (infoBox.remind.options[typeOrMsg]) {
            this.type = typeOrMsg;
        } else {
            options = $.extend(options, {msg: typeOrMsg});
        }

        this.options = this._processInput(options);

        this._init();
        this.$el.slideDown(1000);
    }

    infoBoxRemind.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxRemind,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.remind.base, infoBox.remind.options[this.type], mergedOptions);

            return options;
        },
        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.remind = function (type, options) {
        return new infoBoxRemind(type, options);
    };

    infoBox.remind.base = {
        type: 'info',
        modal: false,
        hasHeader: true,
        hasClose: true
    };

    infoBox.remind.options = {};

    // version
    function infoBoxVersion(title, content) {
        this.options = this._processInput({'msg': content});

        this._init();

        var $versionTitle = '<div class="ellipsis infoBoxVersion-title" title="' + title + '">' +
            '<span class="dib mr5">版本号：</span><span>' + title + '</span></div>';
        this.$el.find('.infoBox-header').append($versionTitle);
        this.$el.slideDown(1000);
    }

    infoBoxVersion.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxVersion,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.version.base, infoBox.version.options[this.type], mergedOptions);

            return options;
        },

        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.version = function (title, content) {
        return new infoBoxVersion(title, content);
    };

    infoBox.version.base = {
        modal: false,
        hasHeader: true,
        hasClose: true,
        delay: 20000
    };

    infoBox.version.options = {};


    // message
    function infoBoxMessage(content) {
        this.options = this._processInput({'msg': content});
        this._init();
        var $messageTitle = '<div style="position: relative; top: -10px;"><span class="fl">消息</span>' +
            '<span class="fr header-right"><span class="mr5">全部已读</span><span class="glyphicon glyphicon-envelope"></span></span></div>';
        this.$el.find('.infoBox-header').append($messageTitle);
        this.$el.slideDown(1000);
    }

    infoBoxMessage.prototype = $.extend({}, infoBoxBase, {
        constructor: infoBoxMessage,
        _processInput: function (options) {
            var mergedOptions = infoBoxBase._processInput.call(this, options);

            options = $.extend(true, {}, infoBox.message.base, infoBox.message.options[this.type], mergedOptions);

            return options;
        },

        _init: function () {
            infoBoxBase._init.call(this);
        }
    });

    infoBox.message = function (content) {
        return new infoBoxMessage(content);
    };

    infoBox.message.base = {
        modal: false,
        hasHeader: true
    };

    infoBox.message.options = {};


})(jQuery);

try {
    if (infoBox) {
        alert = infoBox.alert;
        confirm = infoBox.confirm;
        remindInfoBox = infoBox.remind;
        versionInfoBox = infoBox.version;
        messageInfoBox = infoBox.message;
    }
} catch (e) {
    console.warn('弹框初始化失败' + e);
}