(function () {
	"use strict";

	var animations = {};
	animations["cshow"] = FAQRS.SimpleAnimation;

	animations["fadeIn"] = FAQRS.FadeIn;
	animations["fadeInUp"] = FAQRS.FadeInUp;
	animations["fadeInRight"] = FAQRS.FadeInRight;
	animations["fadeInLeft"] = FAQRS.FadeInLeft;
	animations["fadeInDown"] = FAQRS.FadeInDown;

	animations["bounceIn"] = FAQRS.BounceIn;
	animations["bounceInLeft"] = FAQRS.BounceInLeft;
	animations["bounceInRight"] = FAQRS.BounceInRight;
	animations["bounceInUp"] = FAQRS.BounceInUp;
	animations["bounceInDown"] = FAQRS.BounceInDown;

	animations["flip"] = FAQRS.Flip;
	animations["flipInX"] = FAQRS.FlipInX;
	animations["flipInY"] = FAQRS.FlipInY;

	animations["rotateIn"] = FAQRS.RotateIn;
	animations["rotateInDownLeft"] = FAQRS.RotateInDownLeft;
	animations["rotateInDownRight"] = FAQRS.RotateInDownRight;
	animations["rotateInUpLeft"] = FAQRS.RotateInUpLeft;
	animations["rotateInUpRight"] = FAQRS.RotateInUpRight;

	animations["zoomIn"] = FAQRS.ZoomIn;
	animations["zoomInUp"] = FAQRS.ZoomInUp;
	animations["zoomInRight"] = FAQRS.ZoomInRight;
	animations["zoomInLeft"] = FAQRS.ZoomInLeft;
	animations["zoomInDown"] = FAQRS.ZoomInDown;

	animations["pulse"] = FAQRS.Pulse;
	animations["swing"] = FAQRS.Swing;
	animations["tada"] = FAQRS.Tada;
	animations["lightSpeedIn"] = FAQRS.LightSpeedIn;
	animations["rollIn"] = FAQRS.RollIn;
	animations["wobble"] = FAQRS.Wobble;

	angular.module("FaqApp.services").value("animationList", animations);
})();