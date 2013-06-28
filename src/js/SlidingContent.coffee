###!
  SlidingContent
  https://github.com/olihel/sliding-content.git

  Copyright (c) 2013 Oliver Hellebusch
  Released under MIT license (https://raw.github.com/olihel/sliding-content/master/LICENSE)
###

MODULE_NAME = "SlidingContent"

SLIDE_SPEED_FACTOR = 10.0
SLIDE_EASEOUT_FACTOR = 0.7

EVENT_START = if Modernizr.touch then "touchstart" else "mousedown"
EVENT_STOP = if Modernizr.touch then "touchend" else "mouseup"

CSSCLASS_MAIN = "slidingContent"
CSSCLASS_INNER = "slidingContent-inner"
CSSCLASS_CONTENT = "slidingContent-contentWrapper"

# better move markup from JS strings to a template
MARKUP_WRAPPER = """<div class="#{CSSCLASS_MAIN}"><div class="#{CSSCLASS_INNER}"><div class="#{CSSCLASS_CONTENT}"></div></div></div>"""
MARKUP_BUTTON_LEFT = """<a class="left" href="javascript://">&lt;</a>"""
MARKUP_BUTTON_RIGHT = """<a class="right" href="javascript://">&gt;</a>"""


class Module
  $slider = null
  sliderInnerNode = null
  $sliderContent = null
  $btnLeft = null
  $btnRight = null
  animationID = null
  slideOffset = 0
  slidePosition = 0
  slidePositionMax = 0
  slideDirection = 0
  isButtonPressed = false
  isSlideToOffset = false
  $content = null


  # main animation loop, stops running when there's no more significant movement
  animationLoop = ->
    # calculate position
    if isButtonPressed
      slideOffset = slideDirection * SLIDE_SPEED_FACTOR
      slidePosition += slideOffset
    else if isSlideToOffset
      slidePosition += (slideOffset - (slideOffset *= SLIDE_EASEOUT_FACTOR)) # add difference of old minus new slideOffset
    else
      slideOffset *= SLIDE_EASEOUT_FACTOR
      slidePosition += slideOffset

    # range limiting
    if slidePosition < 0
      slideOffset = slidePosition = 0
    else if slidePosition > slidePositionMax
      slideOffset = 0
      slidePosition = slidePositionMax;

    # update scroll position
    sliderInnerNode.scrollLeft = Math.round slidePosition

    # request next animation frame if there is significant movement
    if Math.abs(slideOffset) >= 0.1
      animationID = window.requestAnimationFrame animationLoop
    else
      isSlideToOffset = false;

    return null


  # start sliding the content in specific direction (via button click/touch)
  startButtonSlide = (e) ->
    e.preventDefault()
    slidePosition = sliderInnerNode.scrollLeft
    slideDirection = if e.currentTarget == $btnLeft[0] then -1 else 1
    if animationID
      window.cancelAnimationFrame animationID
    isButtonPressed = true
    animationLoop()
    $(document).on EVENT_STOP, ->
      isButtonPressed = false
      $(document).off EVENT_STOP
    return null


  # slide content to specific offset position
  slideToOffset = (offset) ->
    if animationID
      window.cancelAnimationFrame animationID
    isSlideToOffset = true
    slideOffset = offset
    animationLoop()
    return null


  # initialization, do nothing if content width is too small to slide
  constructor: (settings) ->
    if settings.contentWidth > settings.width
      $content = settings.$content
      $slider = $content.wrap(MARKUP_WRAPPER).closest(".#{CSSCLASS_MAIN}")
      sliderInnerNode = $slider.find(".#{CSSCLASS_INNER}").get(0)
      $sliderContent = $slider.find(".#{CSSCLASS_CONTENT}")

      $slider.css
        "width": settings.width

      sliderInnerNode.style.width = "#{settings.sliderInnerWidth}px"

      $sliderContent.css
        "width": settings.contentWidth + settings.contentMarginRight,
        "padding-left": settings.contentMarginLeft

      $btnLeft = $(MARKUP_BUTTON_LEFT)
        .on(EVENT_START, startButtonSlide)
        .prependTo($slider)

      $btnRight = $(MARKUP_BUTTON_RIGHT)
        .on(EVENT_START, startButtonSlide)
        .appendTo($slider)

      slidePositionMax = (settings.contentWidth + settings.contentMarginRight + settings.contentMarginLeft) - sliderInnerNode.offsetWidth
      return null

  # cleanup & restore markup
  destroy: ->
    if $slider
      $(document).off EVENT_STOP
      $btnLeft.off(EVENT_START).remove()
      $btnRight.off(EVENT_START).remove()
      $content.unwrap().unwrap().unwrap()
      $slider = sliderInnerNode = $sliderContent = $btnLeft = $btnRight = null
    if animationID
      window.cancelAnimationFrame animationID
    return null

  # move content characterized by pos & width to visible area
  moveToVisibleArea: (pos, width) ->
    if pos < 0
      slideToOffset((sliderInnerNode.scrollLeft + pos) - slidePosition);
    else if (pos + width) > sliderInnerNode.offsetWidth
      newPos = sliderInnerNode.scrollLeft + ((pos + width) - sliderInnerNode.offsetWidth)
      slideToOffset(newPos - slidePosition)
    return null


#define module (node, amd, global)
if typeof exports == "object"
  module.exports = Module;
else if typeof define == "function" && define.amd
  define ->
    return Module
else
  window[MODULE_NAME] = Module
