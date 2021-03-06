require("should");
var sinon = require("sinon");
var Platos = require("../../lib/platos-model");

describe("UNIT - HOOKS", function () {
	it("Model.pre() - with hook - hook should be called before instance.test()", function (done) {
		var Model = Platos.create("Model");
		var stub = sinon.stub();
		
		//Main method, will be called second
		Model.prototype.test = function (callback) {
			stub.callCount.should.equal(1);
			stub();
			callback();
		};
		
		//Pre-hook will be called first
		Model.prototype.pre("test", function (next) {
			stub.callCount.should.equal(0);
			stub();
			
			next();
		});
		
		var instance = new Model();
		
		//Now run chain, callback will be called last
		instance.test(function () {
			stub.callCount.should.equal(2);
			
			done();
		});
	});
	
	it("Model.post() - with hook - hook should be called after instance.test()", function (done) {
		var Model = Platos.create("Model");
		var stub = sinon.stub();
		
		//Main method, will be called first
		Model.prototype.test = function (callback) {
			stub.callCount.should.equal(0);
			stub();
			callback();
		};
		
		//Post-hook will be called second
		Model.prototype.post("test", function (next) {
			stub.callCount.should.equal(1);
			stub();
			
			next();
		});
		
		var instance = new Model();
		
		//Now run chain, callback will be called last
		instance.test(function () {
			stub.callCount.should.equal(2);
			
			done();
		});
	});
	
	it("Model.pre(), Model.post() - with hooks - should be called in proper sequence", function (done) {
		var Model = Platos.create("Model");
		var stub = sinon.stub();
		
		//Main method, will be called second
		Model.prototype.test = function (callback) {
			stub.callCount.should.equal(1);
			stub();
			callback();
		};
		
		//Pre-hook will be called first
		Model.prototype.pre("test", function (next) {
			stub.callCount.should.equal(0);
			stub();
			
			next();
		});
		
		//Post-hook will be called third
		Model.prototype.post("test", function (next) {
			stub.callCount.should.equal(2);
			stub();
			
			next();
		});
		
		var instance = new Model();
		
		//Now run chain, callback will be called last
		instance.test(function () {
			stub.callCount.should.equal(3);
			
			done();
		});
	});
	
	it("Model.pre() - with multiple hooks - should be called in the same sequence they're defined", function (done) {
		var Model = Platos.create("Model");
		var stub = sinon.stub();
		
		//Main method, will be called second
		Model.prototype.test = function (callback) {
			stub.callCount.should.equal(3);
			stub();
			callback();
		};
		
		Model.prototype.pre("test", function (next) {
			stub.callCount.should.equal(0);
			stub();
			
			next();
		});
		
		Model.prototype.pre("test", function (next) {
			stub.callCount.should.equal(1);
			stub();
			
			next();
		});
		
		Model.prototype.pre("test", function (next) {
			stub.callCount.should.equal(2);
			stub();
			
			next();
		});
		
		var instance = new Model();
		
		instance.test(function () {
			stub.callCount.should.equal(4);
			
			done();
		});
	});
	
	it("Model.pre() - with pre hook that mutates arguments - should have new arguments when method is called", function (done) {
		var Model = Platos.create("Model");
		
		Model.prototype.test = function (argument) {
			argument.should.equal("second");
			done();
		};
		
		Model.prototype.pre("test", function (next, argument) {
			argument.should.equal("first");
			next("second");
		});
		
		var instance = new Model();
		
		instance.test("first");
	});
	
	//Warning: This particular test will fail using the npm version of hooks.js - there's
	//a bug passing arguments back to the original callback which hasn"t been merged in, so
	//we"re using this repo instead - git://github.com/JamesHight/hooks-js.git
	it("Model.pre() - with callback amd pre hook that mutates arguments - should have new arguments when method is called", function (done) {
		var Model = Platos.create("Model");
		
		Model.prototype.test = function (argument, callback) {
			argument.should.equal("turned my");
			callback("dad on");
		};
		
		Model.prototype.pre("test", function (next, argument, callback) {
			argument.should.equal("she");
			next("turned my", callback);
		});
		
		var instance = new Model();
		
		instance.test("she", function (argument) {
			argument.should.equal("dad on");
			done();
		});
	});
});