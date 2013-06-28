# SlidingContent

Basic module for sliding content inside a HTML element.  


### Usage

Pass a settings object when creating an instance of SlidingContent:

```Javascript
var slidingContent = new SlidingContent({
    width: 500,
    $content: $('.slidingContent'),
    contentWidth: 960,
    sliderInnerWidth: 400,  // sliderWidth - 2 * buttonWidth
    contentMarginLeft: 0,
    contentMarginRight: 0
});
```

### Settings object properties

**width**:  
Width of the SlidingContent component.

**$content**:  
jQuery object representing the sliding content. Currently collections are not supported, only a single node per instance.

**contentWidth**:  
The actual width of the content that is supposed to be slided. If this is smaller than the component width (see property *width*) or equals it, there is no need of the sliding funcitonality and the component is not activated.

**sliderInnerWidth**:  
Width of the scrollable area.

**contentMarginLeft** (optional):  
Left margin of the content when slided leftmost.

**contentMarginRight** (optional):  
Right margin of the content when slided rightmost.


### Instance methods

**moveToVisibleArea**:  
Move the horizontal position *pos* within the content into view. *width* is used to ensure an item is fully in view.
```Javascript
slidingContent.moveToVisibleArea(pos, width);
slidingContent.moveToVisibleArea($selectedItem.position().left, $selectedItem.width());
```

**destroy**:  
Clear used memory and restore markup.
```Javascript
slidingContent.destroy();
slidingContent = null;
```


### Credits
Thanks to [SinnerSchrader](http://www.sinnerschrader.com/) for support.

### License
The MIT License (MIT)
Copyright (c) 2013 Oliver Hellebusch

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
