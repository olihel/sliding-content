/*!
  SlidingContent
  https://github.com/olihel/sliding-content.git

  Copyright (c) 2013 Oliver Hellebusch
  Released under MIT license (https://raw.github.com/olihel/sliding-content/master/LICENSE)
*/


(function() {
  var CSSCLASS_CONTENT, CSSCLASS_INNER, CSSCLASS_MAIN, EVENT_START, EVENT_STOP, MARKUP_BUTTON_LEFT, MARKUP_BUTTON_RIGHT, MARKUP_WRAPPER, MODULE_NAME, Module, SLIDE_EASEOUT_FACTOR, SLIDE_SPEED_FACTOR;

  MODULE_NAME = "SlidingContent";

  SLIDE_SPEED_FACTOR = 10.0;

  SLIDE_EASEOUT_FACTOR = 0.7;

  EVENT_START = Modernizr.touch ? "touchstart" : "mousedown";

  EVENT_STOP = Modernizr.touch ? "touchend" : "mouseup";

  CSSCLASS_MAIN = "slidingContent";

  CSSCLASS_INNER = "slidingContent-inner";

  CSSCLASS_CONTENT = "slidingContent-contentWrapper";

  MARKUP_WRAPPER = "<div class=\"" + CSSCLASS_MAIN + "\"><div class=\"" + CSSCLASS_INNER + "\"><div class=\"" + CSSCLASS_CONTENT + "\"></div></div></div>";

  MARKUP_BUTTON_LEFT = "<a class=\"left\" href=\"javascript://\">&lt;</a>";

  MARKUP_BUTTON_RIGHT = "<a class=\"right\" href=\"javascript://\">&gt;</a>";

  Module = (function() {
    var $btnLeft, $btnRight, $content, $slider, $sliderContent, animationID, animationLoop, isButtonPressed, isSlideToOffset, slideDirection, slideOffset, slidePosition, slidePositionMax, slideToOffset, sliderInnerNode, startButtonSlide;

    $slider = null;

    sliderInnerNode = null;

    $sliderContent = null;

    $btnLeft = null;

    $btnRight = null;

    animationID = null;

    slideOffset = 0;

    slidePosition = 0;

    slidePositionMax = 0;

    slideDirection = 0;

    isButtonPressed = false;

    isSlideToOffset = false;

    $content = null;

    animationLoop = function() {
      if (isButtonPressed) {
        slideOffset = slideDirection * SLIDE_SPEED_FACTOR;
        slidePosition += slideOffset;
      } else if (isSlideToOffset) {
        slidePosition += slideOffset - (slideOffset *= SLIDE_EASEOUT_FACTOR);
      } else {
        slideOffset *= SLIDE_EASEOUT_FACTOR;
        slidePosition += slideOffset;
      }
      if (slidePosition < 0) {
        slideOffset = slidePosition = 0;
      } else if (slidePosition > slidePositionMax) {
        slideOffset = 0;
        slidePosition = slidePositionMax;
      }
      sliderInnerNode.scrollLeft = Math.round(slidePosition);
      if (Math.abs(slideOffset) >= 0.1) {
        animationID = window.requestAnimationFrame(animationLoop);
      } else {
        isSlideToOffset = false;
      }
      return null;
    };

    startButtonSlide = function(e) {
      e.preventDefault();
      slidePosition = sliderInnerNode.scrollLeft;
      slideDirection = e.currentTarget === $btnLeft[0] ? -1 : 1;
      if (animationID) {
        window.cancelAnimationFrame(animationID);
      }
      isButtonPressed = true;
      animationLoop();
      $(document).on(EVENT_STOP, function() {
        isButtonPressed = false;
        return $(document).off(EVENT_STOP);
      });
      return null;
    };

    slideToOffset = function(offset) {
      if (animationID) {
        window.cancelAnimationFrame(animationID);
      }
      isSlideToOffset = true;
      slideOffset = offset;
      animationLoop();
      return null;
    };

    function Module(settings) {
      if (settings.contentWidth > settings.width) {
        $content = settings.$content;
        $slider = $content.wrap(MARKUP_WRAPPER).closest("." + CSSCLASS_MAIN);
        sliderInnerNode = $slider.find("." + CSSCLASS_INNER).get(0);
        $sliderContent = $slider.find("." + CSSCLASS_CONTENT);
        $slider.css({
          "width": settings.width
        });
        sliderInnerNode.style.width = "" + settings.sliderInnerWidth + "px";
        $sliderContent.css({
          "width": settings.contentWidth + settings.contentMarginRight,
          "padding-left": settings.contentMarginLeft
        });
        $btnLeft = $(MARKUP_BUTTON_LEFT).on(EVENT_START, startButtonSlide).prependTo($slider);
        $btnRight = $(MARKUP_BUTTON_RIGHT).on(EVENT_START, startButtonSlide).appendTo($slider);
        slidePositionMax = (settings.contentWidth + settings.contentMarginRight + settings.contentMarginLeft) - sliderInnerNode.offsetWidth;
        return null;
      }
    }

    Module.prototype.destroy = function() {
      if ($slider) {
        $(document).off(EVENT_STOP);
        $btnLeft.off(EVENT_START).remove();
        $btnRight.off(EVENT_START).remove();
        $content.unwrap().unwrap().unwrap();
        $slider = sliderInnerNode = $sliderContent = $btnLeft = $btnRight = null;
      }
      if (animationID) {
        window.cancelAnimationFrame(animationID);
      }
      return null;
    };

    Module.prototype.moveToVisibleArea = function(pos, width) {
      var newPos;
      if (pos < 0) {
        slideToOffset((sliderInnerNode.scrollLeft + pos) - slidePosition);
      } else if ((pos + width) > sliderInnerNode.offsetWidth) {
        newPos = sliderInnerNode.scrollLeft + ((pos + width) - sliderInnerNode.offsetWidth);
        slideToOffset(newPos - slidePosition);
      }
      return null;
    };

    return Module;

  })();

  if (typeof exports === "object") {
    module.exports = Module;
  } else if (typeof define === "function" && define.amd) {
    define(function() {
      return Module;
    });
  } else {
    window[MODULE_NAME] = Module;
  }

}).call(this);
