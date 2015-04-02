//= require jquery-2.1.3.min
//= require jquery.cookie

/**
 * jQuery Plugin for managing the color themes of the website
 *
 * @author Nikola Pejoski
 */
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
        return inputArray[idx];
    };

    var defaults = {
        themes: [],
        appearAnimations: [],
        appearDelayStyle: [],
        segmentClass: '.bg-block',
        themeContainer: 'body',
        segmentContClass: '.bg-container',
        thmPrefix: 'thm-',
        nbrDelays: 4
    };

    /**
     * Plugin that handles the theme switching: setting random or chosen theme,
     * choosing random appearance animation and random type of the available appearance delay options
     *
     * Bind this plugin to parent container of the theme switching triggers.
     *
     * @param element
     * @param options
     * @constructor
     */
    function ThemeSwitcher(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, defaults, options) ;

        this.init();
    }

    ThemeSwitcher.prototype.init = function() {
        // bind click event to them change trigger elements
        this.$element.on('click', '.jsThemeTrigger', $.proxy(this.switchTheme, this));
    };

    /**
     * Theme switching click handler method.
     * Stores the current theme choice as preferred and activates the chosen theme
     *
     * @param e
     */
    ThemeSwitcher.prototype.switchTheme = function(e) {
        e.preventDefault();
        var $currentTarget = $(e.currentTarget);
        var newTheme = $currentTarget.data('theme');

        // save current choice as preferred theme
        this.savePreferredTheme(newTheme);
        this.hideInfoMessage();

        this.setTheme(newTheme);
    };

    /**
     * Choose randomly new appearance animation and delay style and set the input themeName as active
     *
     * @param themeName
     */
    ThemeSwitcher.prototype.setTheme = function(themeName) {
        var $segContainer = $(this.options.segmentContClass);

        // fetch the current appearance animation and delay style
        var curAnimation = $segContainer.data('animation');
        var curDelay = $segContainer.data('delay');

        var newAnimation = getRandomArrayElement(this.options.appearAnimations, curAnimation);
        // set new randomly chosen animation as current
        $segContainer.data('animation', newAnimation);

        var newDelayStyle = getRandomArrayElement(this.options.appearDelayStyle, curDelay);
        // set new randomly chosen delay style as current
        $segContainer.data('delay', newDelayStyle);

        // update each segment of the theme with new random animation and delay
        this.updateThemeSegments(newAnimation, newDelayStyle);

        // add selected class to current theme link
        this.setCurrentThemeAsActive(themeName);

        var $themeContainer = $(this.options.themeContainer);
        // remove current theme classes from main theme container
        this.cleanThemeClasses($themeContainer);

        // set the new theme class to main theme container
        $themeContainer.addClass(themeName);
        $themeContainer.data('theme', themeName);
    };

    /**
     * Set random theme
     */
    ThemeSwitcher.prototype.setRandomTheme = function() {
        var curTheme = $(this.options.themeContainer).data('theme');
        var newTheme = getRandomArrayElement(this.options.themes, curTheme);

        this.setTheme(newTheme);
    };

    /**
     * Remove all css classes that have theme prefix from the input $elem
     * @param $elem
     */
    ThemeSwitcher.prototype.cleanThemeClasses = function($elem) {
        var rgx = new RegExp('\\b' + this.options.thmPrefix + '\\S+', 'g');
        $elem.removeClass(function (index, css) {
            return (css.match(rgx) || []).join(' ');
        });
    };

    /**
     * Loop through each theme segment and set the input 'animation' and 'delayStyle'
     *
     * @param animation
     * @param delayStyle
     */
    ThemeSwitcher.prototype.updateThemeSegments = function(animation, delayStyle) {
        var $segments = $(this.options.segmentClass);
        $.each($segments, $.proxy(function(i, segment) {
            var $elem = $(segment);

            // remove current theme classes
            this.cleanThemeClasses($elem);

            // set new animation class
            $elem.addClass(this.options.thmPrefix + animation);

            // depending on the delay style set appropriate delay index class
            var delayIdx = 0;
            switch (delayStyle) {
                case 'linear':
                    delayIdx = i % this.options.nbrDelays;
                    break;
                case 'random':
                    delayIdx = getRandomNumInRange(1, this.options.nbrDelays);
                    break;
            }

            $elem.addClass(this.options.thmPrefix + 'delay' + delayIdx);

        }, this));
    };

    /**
     * Save the themeName as preferred theme in cookies
     * @param themName
     */
    ThemeSwitcher.prototype.savePreferredTheme = function(themName) {
        $.cookie('npejo.preferredTheme', themName, { expires: 3, path: '/' });
    };

    /**
     * Return the saved theme value from cookies
     * @returns bool|string
     */
    ThemeSwitcher.prototype.getSavedTheme = function() {
        return $.cookie('npejo.preferredTheme');
    };

    /**
     * Mark as 'selected' the link that represents 'themeName' in the Theme Switcher section
     */
    ThemeSwitcher.prototype.setCurrentThemeAsActive = function(themeName) {
        this.$element.find('.switch-btn').removeClass('selected');
        this.$element.find('.switch-btn[data-theme=' + themeName + ']').addClass('selected');
    };

    /**
     * Show the info message element in the theme switcher section
     */
    ThemeSwitcher.prototype.showInfoMessage = function () {
        this.$element.find('.info-message').removeClass('hidden');
    };

    /**
     * Hide the info message element in the theme switcher section
     */
    ThemeSwitcher.prototype.hideInfoMessage = function () {
        this.$element.find('.info-message').fadeOut(function() {
            $(this).addClass('hidden');
        });
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