const deepEqual = (a,b,checked=new WeakSet()) => {
	const atype = typeof(a), btype = typeof(b);
	if(a===b) return true;
	if(atype!==btype || Object.getPrototypeOf(a)!=Object.getPrototypeOf(b) || (a && b && a.length!==b.length)) return false;
	if(atype==="number" && isNaN(a) && !isNaN(b)) return false;
	if(atype==="object" && a && b && !checked.has(a)) {
		checked.add(a);
		if(Object.keys(a).length!==Object.keys(b).length) return false;
		if(typeof(a.size)==="function") {
			if(!typeof(b.size)!=="function") return false;
			if(a.size()!==b.size()) return false;
		}
		for(const key in a) {
			if(!deepEqual(a[key],b[key],checked)) return false;
		}
		if(a instanceof Date && a.getTime()!==b.getTime()) return false;
		if(a instanceof RegExp) return a.toString() === a.toString();
		if(typeof(a.entries)==="function") {
			if(typeof(b.entries)!=="function") return false;
			const bentries = Array.from(b.entries());
			for(const [akey,avalue] of a.entries()) {
				if(!bentries.some(([bkey,bvalue]) => akey===bkey && deepEqual(avalue,bvalue,checked))) return false;
			}
		}
	}
	return true;
}

class Foo {
  constructor(value) {
    this.value = value;
  }
}

const simpleObject = {
  boolean: true,
  nil: null,
  number: 123,
  string: 'foo',
};

const complexObject = Object.assign({}, simpleObject, {
	array: ['foo', { bar: 'baz' }],
//  arrayBuffer: new ArrayBuffer(8),
//  buffer: new Buffer('this is a test buffer'),
//  dataView: new DataView(new ArrayBuffer(16)),
  date: new Date(),
  error: new Error('boom'),
  fn() {
    return 'foo';
  },
  	map: new Map().set('foo', { bar: { baz: 'quz' } }),
	nan: NaN,
	object: { foo: { bar: 'baz' } },
//  promise: Promise.resolve('foo'),
  	regexp: /foo/,
	set: new Set().add('foo').add({ bar: { baz: 'quz' } }),
 	typedArray: new Uint8Array([12, 15]), 
  undef: undefined,
	weakmap: new WeakMap([[{}, 'foo'], [{}, 'bar']]),
	weakset: new WeakSet([{}, {}]),
 // [Symbol('key')]: 'value',
});

const circularObject = {
  deeply: {
    nested: {
      reference: {},
    },
  },
};

circularObject.deeply.nested.reference = circularObject;


describe("Test",function() {
	xit("simple nano-copy",function() {
		var result = nanoCopy(simpleObject)
		expect(deepEqual(simpleObject,result)).to.equal(true);
	});
	xit("simple fast-copy",function() {
		var result = copy(simpleObject)
		expect(deepEqual(simpleObject,result)).to.equal(true);
	});
	xit("simple nano-copy for performance #",function() {
		nanoCopy(simpleObject)
	});
	xit("simple fast-copy for performance #",function() {
		copy(simpleObject)
	});
	it("complex nano-copy",function() {
		var result = nanoCopy(complexObject)
		expect(deepEqual(complexObject,result)).to.equal(true);
	});
	it("complex fast-copy",function() {
		var result = copy(complexObject)
		expect(deepEqual(complexObject,result)).to.equal(true);
	});
	it("complex nano-copy for performance #",function() {
		nanoCopy(complexObject)
	});
	it("complex fast-copy for performance #",function() {
		copy(complexObject)
	});
	it("circular nano-copy",function() {
		var result = nanoCopy(circularObject)
		expect(deepEqual(circularObject,result)).to.equal(true);
	});
	it("circular fast-copy",function() {
		var result = copy(circularObject)
		expect(deepEqual(circularObject,result)).to.equal(true);
	});
	it("circular nano-copy for performance #",function() {
		nanoCopy(circularObject)
	});
	it("circular fast-copy for performance #",function() {
		copy(circularObject)
	});
});
