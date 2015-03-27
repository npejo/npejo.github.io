(function($) {
    'use strict';

    var pluginName = 'themeSwitcher';

    /**
     * Private helper function for generating random integer within specified input range
     *
     * @param min
     * @param max
     * @returns int
     */
    var getRandomNumInRange = function(min, max) {
        return Math.floor(Math.random() * (max - min +1)) + min;
    };

    /**
     * Private helper function that returns random element of given array as input
     *
     * @param inputArray
     * @param ignoreElement Look for another element if the random element is 'ignoreElement'
     * @returns string
     */
    var getRandomArrayElement = function(inputArray, ignoreElement) {
        var idx = null;
        while (idx === null || (ignoreElement && inputArray[idx] === ignoreElement)) {
            idx = getRandomNumInRange(0, inputArray.length - 1);
        }
        console.log(inputArray[idx], ignoreElement);
        return inputArray[idx];
    };

    var defaults = {
        themes: ['light-blue-theme', 'green-brown-theme', 'pink-brown-theme', 'blue-green-theme'],
        appearAnimations: ['fadeIn', 'zoomIn', 'flash'],
        appearDelayStyle: ['none', 'linear', 'random'],
        segmentClass: '.bg-block',
        themeContainer: 'body',
        segmentContClass: '.bg-container',
        thmPrefix: 'thm-',
        nbrDelays: 4
    };

    /**
     *
     * @param element
     * @param options
     * @constructor
     */
    function ThemeSwitcher(element, options) {
        this._name = pluginName;
        this.element = element;

        this._defaults = defaults;
        this.options = $.extend({}, defaults, options) ;

        this.init();
    }

    ThemeSwitcher.prototype.init = function() {
        $(this.element).on('click', '.jsThemeTrigger', $.proxy(this.switchTheme, this));
    };

    ThemeSwitcher.prototype.switchTheme = function(e) {
        var newTheme = $(e.currentTarget).data('theme');
        this.setTheme(newTheme);
    };

    ThemeSwitcher.prototype.setTheme = function(themeName) {
        var $segContainer = $(this.options.segmentContClass);
        var $segments = $(this.options.segmentClass);

        // fetch the current appearance animation and delay style
        var curAnimation = $segContainer.data('animation');
        var curDelay = $segContainer.data('delay');

        // set new randomly chosen animation
        var newAnimation = getRandomArrayElement(this.options.appearAnimations, curAnimation);
        $segContainer.data('animation', newAnimation);

        // set new randomly chosen delay style
        var newDelayStyle = getRandomArrayElement(this.options.appearDelayStyle, curDelay);

        // update each segment of the theme with new random animation and delay
        $.each($segments, $.proxy(function(i, segment) {
            var $elem = $(segment);

            // remove current theme classes
            $elem.removeClass(function (index, css) {
                return (css.match(/\bthm-\S+/g) || []).join(' ');
            });

            // set new animation class
            $elem.addClass(this.options.thmPrefix + newAnimation);

            // depending on the delay style set appropriate delay index class
            var delayIdx = null;
            switch (newDelayStyle) {
                case 'linear':
                    delayIdx = i % (this.options.nbrDelays - 1) + 1;
                    break;
                case 'random':
                    delayIdx = getRandomNumInRange(1, this.options.nbrDelays);
                    break;
            }

            // if delay style is different than 'none', set delay class
            if (delayIdx) {
                $elem.addClass(this.options.thmPrefix + 'delay' + delayIdx);
            }

            // set the new theme class main theme container
            var $themeContainer = $(this.options.themeContainer);

            // remove current theme
            $themeContainer.removeClass(function (index, css) {
                return (css.match(/\bthm-\S+/g) || []).join(' ');
            });

            $themeContainer.addClass(this.options.thmPrefix + themeName);
            $themeContainer.data('theme', themeName);

        }, this));
    };

    ThemeSwitcher.prototype.setRandomTheme = function() {
        var curTheme = $(this.options.themeContainer).data('theme');
        var newTheme = getRandomArrayElement(this.options.themes, curTheme);

        this.setTheme(newTheme);
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName,
                    new ThemeSwitcher(this, options));
            }
        });
    }

})(jQuery);