/*
Author : Raphaël Dardeau


Classic markup : 

<div class="js-tabs">
    <ul>
        <li class="js-tabs-item"><a href="#">item 1</a></li>
        <li class="js-tabs-item"><a href="#">item 2</a></li>
    </ul>
    <div class="js-tabs-content">
        content 1
    </div>
    <div class="js-tabs-content">
        content 2
    </div>
</div>


Custom markup : 

<div class="js-tabs">
    <ul>
        <li class="js-tabs-item"><a href="#">item 1</a></li>
        <li class="js-tabs-item is-active"><a href="#">item 2</a></li>
    </ul>
    <div class="js-tabs-content" data-tabs-eq="1">
        content 2
    </div>
    <div class="js-tabs-content" data-tabs-eq="0">
        content 1
    </div>
</div>


Ajax markup : 

<div class="js-tabs">
    <ul>
        <li class="js-tabs-item" data-tabs-load="content-1.html"><a href="#">item 1</a></li>
        <li class="js-tabs-item" data-tabs-load="content-2.html" data-tabs-refresh="60" data-tabs-refresh-condition=".js-match-live"><a href="#">item 2</a></li>
    </ul>
    <div class="js-tabs-container"></div>
</div>


Setup : 

$(function() {
    $(".js-tabs").navtabing();
});
*/
;(function ($, window, document, undefined) {
    "use strict";

    var pluginName = "navtabing",
        defaults = {
            tabElements: ".js-tabs-item",
            tabClass: "is-active",
            tabContentElements: ".js-tabs-content",
            tabContentBloc: ".js-tabs-container"
        };

    function Plugin (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            this.setElements();
            this.setEvents();
            if (this.$tabs.filter("."+ this.settings.tabClass).length)
                this.$tabs.filter("."+ this.settings.tabClass).trigger("click");
            else
                this.$tabs.first().trigger("click");
         },
        setElements: function () {
            this.$element = $(this.element);
            this.$tabs = this.$element.find(this.settings.tabElements);
            this.$tabsContent = this.$element.find(this.settings.tabContentElements);
            this.$tabsContentBloc = this.$element.find(this.settings.tabContentBloc);
        },
        setEvents: function () {
            this.$tabs.on("click", $.proxy(function (e) {
                if (!this.xhr) {
                    clearTimeout(this.autoTimer);
                    this.$tab = $(e.currentTarget);
					var tabIndex = this.$tabs.index(this.$tab);
					if (!this.$tab.hasClass(this.settings.tabClass)) {
						this.$element.trigger("tabing");
						if (window.history.pushState && this.$tab.children("a") && this.$tab.children("a").attr("href").length > 1) {
							var scrollTop = 0;
							if ($(window).scrollTop())
								scrollTop = $(window).scrollTop();
							else if (window.location.hash && $(window.location.hash).length)
								scrollTop = $(window.location.hash).offset().top;
							else if (window.location.hash && $("a[name='"+ window.location.hash.substr(1) +'"').length)
								scrollTop = $("a[name='"+ window.location.hash.substr(1) +'"').offset().top;
							window.history.pushState({tabIndex:tabIndex, scrollTop:scrollTop}, tabIndex, this.$tab.children("a").attr("href"));
						}
					}
					if (this.$tabsContent.length == 1 && !this.$tabsContent.filter("[data-tabs-eq]").length) {
						this.$tabsContent.first().attr("data-tabs-eq", tabIndex);
						if (this.$tab.attr("data-tabs-load") && !this.$tab.attr("data-tabs-refresh"))
							this.$tab.removeAttr("data-tabs-load");
                    } 
					if (this.$tab.attr("data-tabs-load"))
                        this.loadContent(tabIndex);
                    else
                        this.showContent(tabIndex);
                }
                e.preventDefault();
            }, this));
            $(window).on("popstate", $.proxy(function() {
                if (window.history.state) {
                    var datas = window.history.state;
                    this.$tab = this.$tabs.eq(datas.tabIndex);
                    if (this.$tab.attr("data-tabs-load"))
                        this.loadContent(datas.tabIndex);
                    else
						this.showContent(datas.tabIndex);
                    $(window).scrollTop(datas.scrollTop);
                }
            }, this));
        },
        loadContent: function(tabIndex) {
            var url = this.$tab.data("tabs-load");
            this.$element.addClass("is-loading");
            this.xhr = $.get(url, $.proxy(function (html) {
                if (this.$tabsContent.filter("[data-tabs-eq='"+ tabIndex +"']").length) {
                    this.$tabsContent.filter("[data-tabs-eq='"+ tabIndex +"']").replaceWith(html);
                    this.$tabsContent = this.$element.find(this.settings.tabContentElements);
                    this.$tabsContent.not("[data-tabs-eq]").attr("data-tabs-eq", tabIndex);
                    if (this.$tab.hasClass(this.settings.tabClass))
						this.$element.trigger("tabing-refresh");
                } else {
                    this.$tabsContentBloc.append(html);
                    this.$tabsContent = this.$element.find(this.settings.tabContentElements);
                    this.$tabsContent.last().attr("data-tabs-eq", tabIndex);
                }
                this.showContent(tabIndex);
                if (this.$tab.attr("data-tabs-refresh"))
                    this.setRefresh(this.$tab.data("tabs-refresh") * 1000, this.$tab.data("tabs-refresh-condition"));
                else
                    this.$tab.removeAttr("data-tabs-load");
            }, this)).always($.proxy(function () {
                this.$element.removeClass("is-loading");
                this.xhr = null;
            }, this));
        },
        showContent: function(tabIndex) {
			this.$tabsContent.hide();
			if (this.$tabsContent.filter("[data-tabs-eq='"+ tabIndex +"']").length)
				this.$tabsContent.filter("[data-tabs-eq='"+ tabIndex +"']").show();
			else
				this.$tabsContent.eq(tabIndex).show();
            if (!this.$tab.hasClass(this.settings.tabClass)) {
                this.$tabs.filter("." + this.settings.tabClass).removeClass(this.settings.tabClass);
                this.$tab.addClass(this.settings.tabClass);
				this.$element.trigger("tabing-ready");
			}
        },
        setRefresh: function(interval, condition) {
            if (!condition || this.$element.find(condition).length) {
                this.autoTimer = setTimeout($.proxy(function() {
                    this.$tab.trigger("click");
                }, this), interval);
            }
        }
    });

    $.fn[ pluginName ] = function (options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };

})(jQuery, window, document);