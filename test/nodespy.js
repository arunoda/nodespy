var nodespy = require('nodespy');
var assert = require('assert');

function Appzone() {
	this.sendSms = function(address, message) {
		return address + ':' + message;
	};
}

exports.testsSpy = function() {

	var appzone = new Appzone();
	
	nodespy(appzone).spy('sendSms', function(address, message) {
		assert.equal(address, 'add');
		assert.equal(message, 'mess');
	});
	
	appzone.sendSms('add', 'mess');
	assert.equal(1, appzone.count('sendSms'));
};

exports.testsSpyError = function() {
	
	var appzone = new Appzone();
	
	assert.throws(function() {
		nodespy(appzone).spy('sendNoSms');
	});
	
	assert.throws(function() {
		appzone.count('sendNoSms');
	});
};

exports.testsStub = function() {
	
	var appzone = new Appzone();
	assert.equal(appzone.sendSms('add', 'mes'), 'add:mes');
	nodespy(appzone).stub('sendSms', function(address, message) {
		return address + '+' + message;
	});
	assert.equal(appzone.sendSms('add', 'mes'), 'add+mes');
};

exports.testsStubError = function() {
	
	var appzone = new Appzone();
	assert.equal(appzone.sendSms('add', 'mes'), 'add:mes');
	assert.throws(function() {
		nodespy(appzone).stub('sendSms2', function(address, message) {
			return address + '+' + message;
		});
	});
};

exports.testsStubAndRestore = function() {
	
	var appzone = new Appzone();
	assert.equal(appzone.sendSms('add', 'mes'), 'add:mes');
	nodespy(appzone).stub('sendSms', function(address, message) {
		return address + '+' + message;
	});
	assert.equal(appzone.sendSms('add', 'mes'), 'add+mes');
	appzone.restore('sendSms');
	assert.equal(appzone.sendSms('add', 'mes'), 'add:mes');
};

exports.testsStubAndRestoreError = function() {
	
	var appzone = new Appzone();
	
	//restore without stubing 
	assert.throws(function() {
		nodespy(appzone).restore('sendSms');
	});
};

exports.testsMixed = function() {
	
	var appzone = new Appzone();
	assert.equal(appzone.sendSms('add', 'mes'), 'add:mes');
	
	nodespy(appzone).spy('sendSms', function(address, message){
		assert.equal(address, 'add');
		assert.equal(message, 'mes');
	});
	
	appzone.stub('sendSms', function(address, message) {
		return address + '+' + message;
	});
	
	appzone.sendSms('add', 'mes');
	assert.equal(1, appzone.count('sendSms'));
	
	assert.equal(appzone.sendSms('add', 'mes'), 'add+mes');
	appzone.restore('sendSms');
	assert.equal(appzone.sendSms('add', 'mes'), 'add:mes');
	
};
