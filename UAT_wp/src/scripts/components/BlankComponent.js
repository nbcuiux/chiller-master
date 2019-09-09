var React = require("react");
var ReactDOM = require('react-dom');
var ClassNames = require('classnames');

var BlankComponent = React.createClass({

	getDefaultProps: function () {
		return {
			
		}
	},

    getInitialState: function () {
    	return {

    	}
    },

    render: function () {
    	return (
    		<div>This is my blank component!</div>
    	)
    }
})

module.exports = BlankComponent;