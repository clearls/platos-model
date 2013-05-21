require("should");
var _ = require("underscore");
var Platos = require("../../lib/platos-model");

describe("INTEGRATION - MULTITENANCY", function () {
	beforeEach(function (done) {
		Platos._db.collection("Model").drop(function () {
			Platos._db.collection("tenant.Model").drop(function () {
				done();
			});
		});
	});
	
	it("model.save('tenant') and Model.find('tenant') should save and retrieve document from a tenant-specific collection", function (done) {
		var Model = Platos.create("Model");
		var tenant = new Model({ tenant: "property" });
		
		tenant.save('tenant', function (err, document) {
			_.isNull(err).should.be.ok;
			document.should.have.property("tenant");
			
			//Find back
			Model.find("tenant", function (err, documents) {
				_.isNull(err).should.be.ok;
				documents.length.should.equal(1);
				documents[0].should.have.property("tenant");
				
				done();
			});
		});
	});

	it("model.save('tenant') should be separate to global save", function (done) {
		var Model = Platos.create("Model");
		var global = new Model({ global: "property" });
		var tenant = new Model({ tenant: "property" });

		global.save(function (err) {
			_.isNull(err).should.be.ok;
		
			tenant.save("tenant", function (err) {
				_.isNull(err).should.be.ok;
				
				//Find back
				Model.find(function (err, documents) {
					_.isNull(err).should.be.ok;
					documents.length.should.equal(1);
					documents[0].should.have.property("global");
					documents[0].should.not.have.property("tenant");
					
					Model.find("tenant", function (err, documents) {
						_.isNull(err).should.be.ok;
						documents.length.should.equal(1);
						documents[0].should.have.property("tenant");
						documents[0].should.not.have.property("global");
						
						done();
					});
				});
			});
		});
	});
	
	describe("remove", function () {
		var instance;
		
		beforeEach(function (done) {
			//Insert tenant-specific data to test removal
			Model = Platos.create("Model");
			instance = new Model({ test: "property" });
			instance.save("tenant", done);
		});
	
		it("static Model.remove('tenant') should remove the document from the tenant-specific collection", function (done) {			
			Model.remove("tenant", function (err) {
				_.isNull(err).should.be.ok;
				
				//Ensure removed
				Model.find("tenant", function (err, objects) {
					objects.length.should.equal(0);
					done();
				});
			});
		});
		
		it("instance Model.remove('tenant') should remove the document from the tenant-specific collection", function (done) {			
			instance.remove("tenant", function (err) {
				_.isNull(err).should.be.ok;
				
				//Ensure removed
				Model.find("tenant", function (err, objects) {
					objects.length.should.equal(0);
					done();
				});
			});
		});
	});
});