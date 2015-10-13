var angular = require('angular');

var <%= name %>Directive = require('./<%= name %>.directive.js');

var <%= name %> = angular.module('<%= name %>',[

]).directive('<%= name %>',<%= name %>Directive);

module.exports = <%= name %>;
