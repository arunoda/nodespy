/**

	The MIT License
	
	Copyright (c) 2011 Arunoda Susiripala
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

 */

function extend(descendant, parent) {

    for (var m in parent) {
        descendant[m] = parent[m];
    }
};

module.exports = function(obj) {
	var nodespy = new NodeSpy();
	extend(obj, nodespy);
	return obj;
};


function NodeSpy() {
	
	var originalMethods = [];
	var methodCounts = [];
	var spyMethods = [];
	var self = this;
	
	function incrementMethodCount(methodName) {
		if(!methodCounts[methodName]) {
			methodCounts[methodName] = 0;
		}
		
		methodCounts[methodName]++;
	}
	/**
	 * Spy on a given @methodName and supply what is called to the @spyCallback
	 * @param methodName - Name of the method needed to be spied
	 * @param spyCallback - function where respond about the spyCallback
	 */
	this.spy = function(methodName, spyCallback) {
		
		if(this[methodName]) {
			
			//move to original method Array if not exists there
			if(!originalMethods[methodName]) {
				originalMethods[methodName] = this[methodName];
			}
			
			spyMethods[methodName] = spyCallback;
			
			this[methodName] = function() {
				
				incrementMethodCount(methodName);
				spyCallback.apply(self, arguments);
				return originalMethods[methodName].apply(self, arguments);
			};
			
			return this;
			
		} else {
			throw new Error('No such method Name (' + methodName + ') exits.');
		}
	};
	
	this.stub = function(methodName, stubMethod) {
			
		if(this[methodName]) {
			
			//move to original method Array if not exists there
			if(!originalMethods[methodName]) {
				originalMethods[methodName] = this[methodName];
			}
			this[methodName] = function() {
				
				incrementMethodCount(methodName);
				//spying
				if(spyMethods[methodName]) {
					spyMethods[methodName].apply(self, arguments);
				}
				return stubMethod.apply(self, arguments);
			};
			
			return this;
			
		} else {
			throw new Error('No such method Name (' + methodName + ') exits.');
		}
	};
	
	this.restore = function(methodName) {
		
		if(originalMethods[methodName]) {
			this[methodName] = originalMethods[methodName];
			delete originalMethods[methodName];
		} else {
			throw new Error('You\'ve not stubbed  method: ' + methodName + ' yet!');
		}
	};
	
	this.count = function(methodName) {
		if(methodCounts[methodName]) {
			return methodCounts[methodName];
		} else {
			throw new Error('method: ' + methodName + ' did not spyed yet!');
		}
	};
}