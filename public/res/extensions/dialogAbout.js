define([
	"jquery",
	"underscore",
	"constants",
	"utils",
	"classes/Extension",
	"text!html/dialogAbout.html"
], function($, _, constants, utils, Extension, dialogAboutHTML) {

	var dialogAbout = new Extension("dialogAbout", 'Dialog "About"');

	var eventMgr;
	dialogAbout.onEventMgrCreated = function(eventMgrParameter) {
		eventMgr = eventMgrParameter;
	};

	dialogAbout.onReady = function() {
		utils.addModal('modal-about', _.template(dialogAboutHTML, {
			version: constants.VERSION
		}));
		$('.modal-about .sponsorship-button').click(function() {
			eventMgr.onMessage('You should pay nothing!');
		});
	};

	return dialogAbout;

});
