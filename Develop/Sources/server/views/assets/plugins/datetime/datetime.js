/* =========================================================
 * Caplet Clock
 * =========================================================
 */
!(function($) {
$.fn.capletClock = function(options) {
                var defaults = {
                    width : 120, height : 120, content:"%D { %M , %d } %Y", digital:true,
				months : [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ], 
				//months : [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
				days:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                };
                var options = $.extend(defaults, options);
                return this.each(function() {
                        obj = $(this);
				    var analog=$('<div class="cl-analog"/>').append('<svg viewBox="0 0 1000 1000"><path d="m978,498c0,263.98999 -214.01001,478 -478,478s-478,-214.01001 -478,-478s214.00999,-478 478,-478s478,214.00999 478,478zm-952.504,0.00299l23.305,0m899.69998,0l26,0m-474.50198,-474.49999l0,23.305m0,899.7l0,26" class="circle" /><path d="M500,500,500,236" id="hour"/><path d="M500,500,500,120" id="min" /><path d="M500,650,500,90" id="sec" /><circle id="pointSec" cx="50%" cy="50%" r="40" /></svg>').css({"width":options.width,"height":options.height });
				    obj.append(analog);
						var d = new Date(),day=d.getUTCDay(),month = d.getMonth(), year = d.getFullYear(),date = d.getUTCDate(),
						div='<div class="cl-dateTime" style="height:'+ (options.height) +'px">'+options.content+'<span class="cl-digital"></span></div>',
						divContent=div.replace("{",'<span class="cl-month"><a href="javascript:void(0)">');
						divContent=divContent.replace("}",'</a></span>');
						divContent=divContent.replace("%d",date);
						divContent=divContent.replace("%M",options.months[month]);
						divContent=divContent.replace("%D",'<span class="cl-day">'+options.days[day]+'</span>');
						divContent=divContent.replace("%Y",'<span class="cl-year">'+year+'</span>');
						obj.append(divContent);
						var objWidht=parseInt(obj.find(".cl-month").outerWidth()) + parseInt(obj.find(".cl-dateTime").css('padding-left'));
						obj.css("width",objWidht+10);
					setInterval(function() {
						var d = new Date(),
						hours = d.getHours(),
						minute = d.getMinutes(),
						second = d.getSeconds(),
						ap = "am";
						if(options.digital){
							if (hours   > 11) { ap = "pm"; }
							if (hours  > 12) { hours = hours - 12; }
							if (hours   == 0) { hours = 12; }
							if (minute < 10) { minute = "0" + minute; }
							if (second < 10) { second = "0" + second; }
							var timeString = hours + ':' + minute +"<small> " + ap+"</small>";
							obj.find(".cl-digital").html(timeString);
						}
						
								rotate(sec, 6*second);
								rotate(min, 6*minute);
								rotate(hour, 30*(hours%12) + minute/2);
						
						function rotate(el, deg) {
							el.setAttribute('transform', 'rotate('+ deg +' 500 500)');
						}
					}, 1000);
                });
}
})(jQuery)

/* =========================================================
 * Caplet Timline
 * =========================================================
 */
!(function($) {
$.fn.capletTimeline = function(options) {
                var defaults = { };
                var options = $.extend(defaults, options);
                return this.each(function() {
                        objTime = $(this);
				objTime.find(".mark").each(function() {
					var mark = $(this);
					if(mark.not(".bgimg")){
						mark.css({"line-height": parseInt(mark.height()+20)+"px" });
					}
				 }); 
                });
}
})(jQuery)

/* =========================================================
 * bootstrap-datetimepicker.js
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 * Improvements by Sébastien Malot
 * Improvements by Yun Lai
 * Project URL : http://www.malot.fr/bootstrap-datetimepicker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

/*
 * Improvement by CuGBabyBeaR @ 2013-09-12
 * 
 * Make it work in bootstrap v3
 */

!function ($) {

	function UTCDate() {
		return new Date(Date.UTC.apply(Date, arguments));
	}

	function UTCToday() {
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
	}

	// Picker object

	var Datetimepicker = function (element, options) {
		var that = this;

		this.element = $(element);

		this.bornIn = options.bornIn || "body";
		this.language = options.language || this.element.data('date-language') || "en";
		this.language = this.language in dates ? this.language : "en";
		this.isRTL = dates[this.language].rtl || false;
		this.formatType = options.formatType || this.element.data('format-type') || 'standard';
		this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
		this.isInline = false;
		this.isVisible = false;
		this.isInput = this.element.is('input');

		this.bootcssVer = this.isInput ? (this.element.is('.form-control') ? 3 : 2) : ( this.bootcssVer = this.element.is('.input-group') ? 3 : 2 );

		this.component = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-calendar , .input-group-addon .fa-th, .input-group-addon .fa-calendar , .input-group-btn  .fa-th , .input-group-btn  .fa-calendar').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar').parent()) : false;
		this.componentReset = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-remove , .input-group-addon .fa-times , .input-group-btn  .fa-times').parent() : this.element.find('.add-on .icon-remove').parent()) : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0) {
			this.component = false;
		}
		this.linkField = options.linkField || this.element.data('link-field') || false;
		this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
		this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
		this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
		this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
		this.initialDate = options.initialDate || new Date();

		this._attachEvents();

		this.formatViewType = "datetime";
		if ('formatViewType' in options) {
			this.formatViewType = options.formatViewType;
		} else if ('formatViewType' in this.element.data()) {
			this.formatViewType = this.element.data('formatViewType');
		}

		this.minView = 0;
		if ('minView' in options) {
			this.minView = options.minView;
		} else if ('minView' in this.element.data()) {
			this.minView = this.element.data('min-view');
		}
		this.minView = DPGlobal.convertViewMode(this.minView);

		this.maxView = DPGlobal.modes.length - 1;
		if ('maxView' in options) {
			this.maxView = options.maxView;
		} else if ('maxView' in this.element.data()) {
			this.maxView = this.element.data('max-view');
		}
		this.maxView = DPGlobal.convertViewMode(this.maxView);

		this.wheelViewModeNavigation = false;
		if ('wheelViewModeNavigation' in options) {
			this.wheelViewModeNavigation = options.wheelViewModeNavigation;
		} else if ('wheelViewModeNavigation' in this.element.data()) {
			this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
		}

		this.wheelViewModeNavigationInverseDirection = false;

		if ('wheelViewModeNavigationInverseDirection' in options) {
			this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
		} else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
			this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
		}

		this.wheelViewModeNavigationDelay = 100;
		if ('wheelViewModeNavigationDelay' in options) {
			this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
		} else if ('wheelViewModeNavigationDelay' in this.element.data()) {
			this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
		}

		this.startViewMode = 2;
		if ('startView' in options) {
			this.startViewMode = options.startView;
		} else if ('startView' in this.element.data()) {
			this.startViewMode = this.element.data('start-view');
		}
		this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
		this.viewMode = this.startViewMode;

		this.viewSelect = this.minView;
		if ('viewSelect' in options) {
			this.viewSelect = options.viewSelect;
		} else if ('viewSelect' in this.element.data()) {
			this.viewSelect = this.element.data('view-select');
		}
		this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

		this.forceParse = true;
		if ('forceParse' in options) {
			this.forceParse = options.forceParse;
		} else if ('dateForceParse' in this.element.data()) {
			this.forceParse = this.element.data('date-force-parse');
		}

		this.picker = $((this.bootcssVer == 3) ? DPGlobal.templateV3 : DPGlobal.template)
			.appendTo(this.isInline ? this.element : this.bornIn)
			.on({
				click:     $.proxy(this.click, this),
				mousedown: $.proxy(this.mousedown, this)
			});

		if (this.wheelViewModeNavigation) {
			if ($.fn.mousewheel) {
				this.picker.on({mousewheel: $.proxy(this.mousewheel, this)});
			} else {
				console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option");
			}
		}

		if (this.isInline) {
			this.picker.addClass('datetimepicker-inline');
		} else {
			this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
		}
		if (this.isRTL) {
			this.picker.addClass('datetimepicker-rtl');
			if (this.bootcssVer == 3) {
				this.picker.find('.prev span, .next span')
					.toggleClass('glyphicon-arrow-left glyphicon-arrow-right');
			} else {
				this.picker.find('.prev i, .next i')
					.toggleClass('icon-arrow-left icon-arrow-right');
			}
			;

		}
		$(document).on('mousedown', function (e) {
			// Clicked outside the datetimepicker, hide it
			if ($(e.target).closest('.datetimepicker').length === 0) {
				that.hide();
			}
		});

		this.autoclose = false;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

		this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
		this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

		this.weekStart = ((options.weekStart || this.element.data('date-weekstart') || dates[this.language].weekStart || 0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(options.startDate || this.element.data('date-startdate'));
		this.setEndDate(options.endDate || this.element.data('date-enddate'));
		this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();

		if (this.isInline) {
			this.show();
		}
	};

	Datetimepicker.prototype = {
		constructor: Datetimepicker,

		_events:       [],
		_attachEvents: function () {
			this._detachEvents();
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						focus:   $.proxy(this.show, this),
						keyup:   $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput) { // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus:   $.proxy(this.show, this),
						keyup:   $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
				if (this.componentReset) {
					this._events.push([
						this.componentReset,
						{click: $.proxy(this.reset, this)}
					]);
				}
			}
			else if (this.element.is('div')) {  // inline datetimepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			for (var i = 0, el, ev; i < this._events.length; i++) {
				el = this._events[i][0];
				ev = this._events[i][1];
				el.on(ev);
			}
		},

		_detachEvents: function () {
			for (var i = 0, el, ev; i < this._events.length; i++) {
				el = this._events[i][0];
				ev = this._events[i][1];
				el.off(ev);
			}
			this._events = [];
		},

		show: function (e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			if (this.forceParse) {
				this.update();
			}
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.isVisible = true;
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function (e) {
			if (!this.isVisible) return;
			if (this.isInline) return;
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}

			if (
				this.forceParse &&
					(
						this.isInput && this.element.val() ||
							this.hasInput && this.element.find('input').val()
						)
				)
				this.setValue();
			this.isVisible = false;
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		remove: function () {
			this._detachEvents();
			this.picker.remove();
			delete this.picker;
			delete this.element.data().datetimepicker;
		},

		getDate: function () {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
		},

		getUTCDate: function () {
			return this.date;
		},

		setDate: function (d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
		},

		setUTCDate: function (d) {
			if (d >= this.startDate && d <= this.endDate) {
				this.date = d;
				this.setValue();
				this.viewDate = this.date;
				this.fill();
			} else {
				this.element.trigger({
					type:      'outOfRange',
					date:      d,
					startDate: this.startDate,
					endDate:   this.endDate
				});
			}
		},

		setFormat: function (format) {
			this.format = DPGlobal.parseFormat(format, this.formatType);
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element && element.val()) {
				this.setValue();
			}
		},

		setValue: function () {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component) {
					this.element.find('input').val(formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.val(formatted);
			}
			if (this.linkField) {
				$('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
			}
		},

		getFormattedDate: function (format) {
			if (format == undefined) format = this.format;
			return DPGlobal.formatDate(this.date, format, this.language, this.formatType);
		},

		setStartDate: function (startDate) {
			this.startDate = startDate || -Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function (endDate) {
			this.endDate = endDate || Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
			this.daysOfWeekDisabled = daysOfWeekDisabled || [];
			if (!$.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
			}
			this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		place: function () {
			if (this.isInline) return;

			var index_highest = 0;
			$('div').each(function () {
				var index_current = parseInt($(this).css("zIndex"), 10);
				if (index_current > index_highest) {
					index_highest = index_current;
				}
			});
			var zIndex = index_highest + 10;

			var offset, top, left;				
			if (this.component) {
				offset = this.component.offset();
				left = offset.left;
				
				if (this.pickerPosition == 'bottom-left' || this.pickerPosition == 'top-left') {
					left += this.component.outerWidth() - this.picker.outerWidth();
				}
			} else {
				offset = this.element.offset();
				left = offset.left;
			}
			if (this.pickerPosition == 'top-left' || this.pickerPosition == 'top-right') {
				top = offset.top - this.picker.outerHeight();
			} else {
				top = offset.top + this.height;
			}
			
		var newBorn=$(this.bornIn);
		var bornPos=newBorn.offset();
			
			this.picker.css({
				top:    top+newBorn.scrollTop(),
				left:   left-bornPos.left,
				zIndex: zIndex
			});
		},

		update: function () {
			var date, fromArgs = false;
			if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
				date = arguments[0];
				fromArgs = true;
			} else {
				date = this.element.data('date') || (this.isInput ? this.element.val() : this.element.find('input').val()) || this.initialDate;
				if (typeof date == 'string' || date instanceof String) {
				  date = date.replace(/^\s+|\s+$/g,'');
				}
			}

			if (!date) {
				date = new Date();
				fromArgs = false;
			}

			this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType);

			if (fromArgs) this.setValue();

			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function () {
			var dowCnt = this.weekStart,
				html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
			}
			html += '</tr>';
			this.picker.find('.datetimepicker-days thead').append(html);
		},

		fillMonths: function () {
			var html = '',
				i = 0;
			while (i < 12) {
				html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
			}
			this.picker.find('.datetimepicker-months td').html(html);
		},

		fill: function () {
			if (this.date == null || this.viewDate == null) {
				return;
			}
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				dayMonth = d.getUTCDate(),
				hours = d.getUTCHours(),
				minutes = d.getUTCMinutes(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
				today = new Date();
			this.picker.find('.datetimepicker-days thead th:eq(1)')
				.text(dates[this.language].months[month] + ' ' + year);
			if (this.formatViewType == "time") {
				var hourConverted = hours % 12 ? hours % 12 : 12;
				var hoursDisplay = (hourConverted < 10 ? '0' : '') + hourConverted;
				var minutesDisplay = (minutes < 10 ? '0' : '') + minutes;
				var meridianDisplay = dates[this.language].meridiem[hours < 12 ? 0 : 1];
				this.picker.find('.datetimepicker-hours thead th:eq(1)')
					.text(hoursDisplay + ':' + minutesDisplay + ' ' + meridianDisplay.toUpperCase());
				this.picker.find('.datetimepicker-minutes thead th:eq(1)')
					.text(hoursDisplay + ':' + minutesDisplay + ' ' + meridianDisplay.toUpperCase());
			} else {
				this.picker.find('.datetimepicker-hours thead th:eq(1)')
					.text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
				this.picker.find('.datetimepicker-minutes thead th:eq(1)')
					.text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
			}
			this.picker.find('tfoot th.today div.now').text(dates[this.language].today);
			this.picker.find('tfoot th.today').toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			/*var prevMonth = UTCDate(year, month, 0,0,0,0,0);
			 prevMonth.setUTCDate(prevMonth.getDate() - (prevMonth.getUTCDay() - this.weekStart + 7)%7);*/
			var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
					$.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					clsName += ' disabled';
				}
				html.push('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

			html = [];
			var txt = '', meridian = '', meridianOld = '';
			for (var i = 0; i < 24; i++) {
				var actual = UTCDate(year, month, dayMonth, i);
				clsName = '';
				// We want the previous hour for the startDate
				if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (hours == i) {
					clsName += ' active';
				}
				if (this.showMeridian && dates[this.language].meridiem.length == 2) {
					meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
					if (meridian != meridianOld) {
						if (meridianOld != '') {
							html.push('</fieldset>');
						}
						html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
					}
					meridianOld = meridian;
					txt = (i % 12 ? i % 12 : 12);
					html.push('<span class="hour' + clsName + ' hour_' + (i < 12 ? 'am' : 'pm') + '">' + txt + '</span>');
					if (i == 23) {
						html.push('</fieldset>');
					}
				} else {
					txt = i + ':00';
					html.push('<span class="hour' + clsName + '">' + txt + '</span>');
				}
			}
			this.picker.find('.datetimepicker-hours td').html(html.join(''));

			html = [];
			txt = '', meridian = '', meridianOld = '';
			for (var i = 0; i < 60; i += this.minuteStep) {
				var actual = UTCDate(year, month, dayMonth, hours, i, 0);
				clsName = '';
				if (actual.valueOf() < this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (Math.floor(minutes / this.minuteStep) == Math.floor(i / this.minuteStep)) {
					clsName += ' active';
				}
				if (this.showMeridian && dates[this.language].meridiem.length == 2) {
					meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
					if (meridian != meridianOld) {
						if (meridianOld != '') {
							html.push('</fieldset>');
						}
						html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
					}
					meridianOld = meridian;
					txt = (hours % 12 ? hours % 12 : 12);
					//html.push('<span class="minute'+clsName+' minute_'+(hours<12?'am':'pm')+'">'+txt+'</span>');
					html.push('<span class="minute' + clsName + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
					if (i == 59) {
						html.push('</fieldset>');
					}
				} else {
					txt = i + ':00';
					//html.push('<span class="hour'+clsName+'">'+txt+'</span>');
					html.push('<span class="minute' + clsName + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
				}
			}
			this.picker.find('.datetimepicker-minutes td').html(html.join(''));

			var currentYear = this.date.getUTCFullYear();
			var months = this.picker.find('.datetimepicker-months')
				.find('th:eq(1)')
				.text(year)
				.end()
				.find('span').removeClass('active');
			if (currentYear == year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth + 1).addClass('disabled');
			}

			html = '';
			year = parseInt(year / 10, 10) * 10;
			var yearCont = this.picker.find('.datetimepicker-years')
				.find('th:eq(1)')
				.text(year + '-' + (year + 9))
				.end()
				.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year' + (i == -1 || i == 10 ? ' old' : '') + (currentYear == year ? ' active' : '') + (year < startYear || year > endYear ? ' disabled' : '') + '">' + year + '</span>';
				year += 1;
			}
			yearCont.html(html);
			this.place();
		},

		updateNavArrows: function () {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				day = d.getUTCDate(),
				hour = d.getUTCHours();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()
						&& day <= this.startDate.getUTCDate()
						&& hour <= this.startDate.getUTCHours()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()
						&& day >= this.endDate.getUTCDate()
						&& hour >= this.endDate.getUTCHours()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()
						&& day <= this.startDate.getUTCDate()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()
						&& day >= this.endDate.getUTCDate()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 3:
				case 4:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		mousewheel: function (e) {

			e.preventDefault();
			e.stopPropagation();

			if (this.wheelPause) {
				return;
			}

			this.wheelPause = true;

			var originalEvent = e.originalEvent;

			var delta = originalEvent.wheelDelta;

			var mode = delta > 0 ? 1 : (delta === 0) ? 0 : -1;

			if (this.wheelViewModeNavigationInverseDirection) {
				mode = -mode;
			}

			this.showMode(mode);

			setTimeout($.proxy(function () {

				this.wheelPause = false

			}, this), this.wheelViewModeNavigationDelay);

		},

		click: function (e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th, legend');
			if (target.length == 1) {
				if (target.is('.disabled')) {
					this.element.trigger({
						type:      'outOfRange',
						date:      this.viewDate,
						startDate: this.startDate,
						endDate:   this.endDate
					});
					return;
				}
				switch (target[0].nodeName.toLowerCase()) {
					case 'th':
						switch (target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch (this.viewMode) {
									case 0:
										this.viewDate = this.moveHour(this.viewDate, dir);
										break;
									case 1:
										this.viewDate = this.moveDate(this.viewDate, dir);
										break;
									case 2:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 3:
									case 4:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

								// Respect startDate and endDate.
								if (date < this.startDate) date = this.startDate;
								else if (date > this.endDate) date = this.endDate;

								this.viewMode = this.startViewMode;
								this.showMode(0);
								this._setDate(date);
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								day = this.viewDate.getUTCDate(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();

							if (target.is('.month')) {
								this.viewDate.setUTCDate(1);
								month = target.parent().find('span').index(target);
								day = this.viewDate.getUTCDate();
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
								if (this.viewSelect >= 3) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.year')) {
								this.viewDate.setUTCDate(1);
								year = parseInt(target.text(), 10) || 0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
								if (this.viewSelect >= 4) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.hour')) {
								hours = parseInt(target.text(), 10) || 0;
								if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
									if (hours == 12 && target.hasClass('hour_am')) {
										hours = 0;
									} else if (hours != 12 && target.hasClass('hour_pm')) {
										hours += 12;
									}
								}
								this.viewDate.setUTCHours(hours);
								this.element.trigger({
									type: 'changeHour',
									date: this.viewDate
								});
								if (this.viewSelect >= 1) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.minute')) {
								minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
								this.viewDate.setUTCMinutes(minutes);
								this.element.trigger({
									type: 'changeMinute',
									date: this.viewDate
								});
								if (this.viewSelect >= 0) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							}
							if (this.viewMode != 0) {
								var oldViewMode = this.viewMode;
								this.showMode(-1);
								this.fill();
								if (oldViewMode == this.viewMode && this.autoclose) {
									this.hide();
								}
							} else {
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
							}
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')) {
							var day = parseInt(target.text(), 10) || 1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this.viewDate.setUTCFullYear(year);
							this.viewDate.setUTCMonth(month);
							this.viewDate.setUTCDate(day);
							this.element.trigger({
								type: 'changeDay',
								date: this.viewDate
							});
							if (this.viewSelect >= 2) {
								this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
							}
						}
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
						break;
				}
			}
		},

		_setDate: function (date, which) {
			if (!which || which == 'date')
				this.date = date;
			if (!which || which == 'view')
				this.viewDate = date;
			this.fill();
			this.setValue();
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose && (!which || which == 'date')) {
					//this.hide();
				}
			}
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
		},

		moveMinute: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
			return new_date;
		},

		moveHour: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCHours(new_date.getUTCHours() + dir);
			return new_date;
		},

		moveDate: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCDate(new_date.getUTCDate() + dir);
			return new_date;
		},

		moveMonth: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1) {
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function () {
					return new_date.getUTCMonth() == month;
				}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function () {
					return new_date.getUTCMonth() != new_month;
				};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i = 0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function () {
					return new_month != new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()) {
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function (date, dir) {
			return this.moveMonth(date, dir * 12);
		},

		dateWithinRange: function (date) {
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function (e) {
			if (this.picker.is(':not(:visible)')) {
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch (e.keyCode) {
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					viewMode = this.viewMode;
					if (e.ctrlKey) {
						viewMode += 2;
					} else if (e.shiftKey) {
						viewMode += 1;
					}
					if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir);
						newViewDate = this.moveDate(this.viewDate, dir);
					} else if (viewMode == 1) {
						newDate = this.moveHour(this.date, dir);
						newViewDate = this.moveHour(this.viewDate, dir);
					} else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir);
						newViewDate = this.moveMinute(this.viewDate, dir);
					}
					if (this.dateWithinRange(newDate)) {
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					viewMode = this.viewMode;
					if (e.ctrlKey) {
						viewMode += 2;
					} else if (e.shiftKey) {
						viewMode += 1;
					}
					if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir * 7);
						newViewDate = this.moveDate(this.viewDate, dir * 7);
					} else if (viewMode == 1) {
						if (this.showMeridian) {
							newDate = this.moveHour(this.date, dir * 6);
							newViewDate = this.moveHour(this.viewDate, dir * 6);
						} else {
							newDate = this.moveHour(this.date, dir * 4);
							newViewDate = this.moveHour(this.viewDate, dir * 4);
						}
					} else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir * 4);
						newViewDate = this.moveMinute(this.viewDate, dir * 4);
					}
					if (this.dateWithinRange(newDate)) {
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					if (this.viewMode != 0) {
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
					} else {
						this.fill();
						if (this.autoclose) {
							this.hide();
						}
					}
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged) {
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component) {
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
			}
		},

		showMode: function (dir) {
			if (dir) {
				var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
				if (newViewMode >= this.minView && newViewMode <= this.maxView) {
					this.element.trigger({
						type:        'changeMode',
						date:        this.viewDate,
						oldViewMode: this.viewMode,
						newViewMode: newViewMode
					});

					this.viewMode = newViewMode;
				}
			}
			/*
			 vitalets: fixing bug of very special conditions:
			 jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
			 Method show() does not set display css correctly and datetimepicker is not shown.
			 Changed to .css('display', 'block') solve the problem.
			 See https://github.com/vitalets/x-editable/issues/37

			 In jquery 1.7.2+ everything works fine.
			 */
			//this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datetimepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		},

		reset: function (e) {
			this._setDate(null, 'date');
		}
	};

	$.fn.datetimepicker = function (option) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datetimepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	};

	$.fn.datetimepicker.defaults = {
	};
	$.fn.datetimepicker.Constructor = Datetimepicker;
	var dates = $.fn.datetimepicker.dates = {
		en: {
			days:        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort:   ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin:     ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months:      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			meridiem:    ["am", "pm"],
			suffix:      ["st", "nd", "rd", "th"],
			today:       "Today"
		}
	};

	var DPGlobal = {
		modes:            [
			{
				clsName: 'minutes',
				navFnc:  'Hours',
				navStep: 1
			},
			{
				clsName: 'hours',
				navFnc:  'Date',
				navStep: 1
			},
			{
				clsName: 'days',
				navFnc:  'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc:  'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc:  'FullYear',
				navStep: 10
			}
		],
		isLeapYear:       function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth:   function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		getDefaultFormat: function (type, field) {
			if (type == "standard") {
				if (field == 'input')
					return 'yyyy-mm-dd hh:ii';
				else
					return 'yyyy-mm-dd hh:ii:ss';
			} else if (type == "php") {
				if (field == 'input')
					return 'Y-m-d H:i';
				else
					return 'Y-m-d H:i:s';
			} else {
				throw new Error("Invalid format type.");
			}
		},
		validParts:       function (type) {
			if (type == "standard") {
				return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
			} else if (type == "php") {
				return /[dDjlNwzFmMnStyYaABgGhHis]/g;
			} else {
				throw new Error("Invalid format type.");
			}
		},
		nonpunctuation:   /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
		parseFormat:      function (format, type) {
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts(type), '\0').split('\0'),
				parts = format.match(this.validParts(type));
			if (!separators || !separators.length || !parts || parts.length == 0) {
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate:        function (date, format, language, type) {
			if (date instanceof Date) {
				var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
				dateUTC.setMilliseconds(0);
				return dateUTC;
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
			}
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([-+]\d+)([dmwy])/,
					parts = date.match(/([-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i = 0; i < parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]) {
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(0, 0, 0, 0, 0, 0, 0),
				parsed = {},
				setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
				setters_map = {
					hh:   function (d, v) {
						return d.setUTCHours(v);
					},
					h:    function (d, v) {
						return d.setUTCHours(v);
					},
					HH:   function (d, v) {
						return d.setUTCHours(v == 12 ? 0 : v);
					},
					H:    function (d, v) {
						return d.setUTCHours(v == 12 ? 0 : v);
					},
					ii:   function (d, v) {
						return d.setUTCMinutes(v);
					},
					i:    function (d, v) {
						return d.setUTCMinutes(v);
					},
					ss:   function (d, v) {
						return d.setUTCSeconds(v);
					},
					s:    function (d, v) {
						return d.setUTCSeconds(v);
					},
					yyyy: function (d, v) {
						return d.setUTCFullYear(v);
					},
					yy:   function (d, v) {
						return d.setUTCFullYear(2000 + v);
					},
					m:    function (d, v) {
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							d.setUTCDate(d.getUTCDate() - 1);
						return d;
					},
					d:    function (d, v) {
						return d.setUTCDate(v);
					},
					p:    function (d, v) {
						return d.setUTCHours(v == 1 ? d.getUTCHours() + 12 : d.getUTCHours());
					}
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			setters_map['P'] = setters_map['p'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			if (parts.length == format.parts.length) {
				for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = format.parts[i];
					if (isNaN(val)) {
						switch (part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function () {
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function () {
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
							case 'p':
							case 'P':
								val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i = 0, s; i < setters_order.length; i++) {
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]))
						setters_map[s](date, parsed[s])
				}
			}
			return date;
		},
		formatDate:       function (date, format, language, type) {
			if (date == null) {
				return '';
			}
			var val;
			if (type == 'standard') {
				val = {
					// year
					yy:   date.getUTCFullYear().toString().substring(2),
					yyyy: date.getUTCFullYear(),
					// month
					m:    date.getUTCMonth() + 1,
					M:    dates[language].monthsShort[date.getUTCMonth()],
					MM:   dates[language].months[date.getUTCMonth()],
					// day
					d:    date.getUTCDate(),
					D:    dates[language].daysShort[date.getUTCDay()],
					DD:   dates[language].days[date.getUTCDay()],
					p:    (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
					// hour
					h:    date.getUTCHours(),
					// minute
					i:    date.getUTCMinutes(),
					// second
					s:    date.getUTCSeconds()
				};

				if (dates[language].meridiem.length == 2) {
					val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
				}
				else {
					val.H = val.h;
				}
				val.HH = (val.H < 10 ? '0' : '') + val.H;
				val.P = val.p.toUpperCase();
				val.hh = (val.h < 10 ? '0' : '') + val.h;
				val.ii = (val.i < 10 ? '0' : '') + val.i;
				val.ss = (val.s < 10 ? '0' : '') + val.s;
				val.dd = (val.d < 10 ? '0' : '') + val.d;
				val.mm = (val.m < 10 ? '0' : '') + val.m;
			} else if (type == 'php') {
				// php format
				val = {
					// year
					y: date.getUTCFullYear().toString().substring(2),
					Y: date.getUTCFullYear(),
					// month
					F: dates[language].months[date.getUTCMonth()],
					M: dates[language].monthsShort[date.getUTCMonth()],
					n: date.getUTCMonth() + 1,
					t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
					// day
					j: date.getUTCDate(),
					l: dates[language].days[date.getUTCDay()],
					D: dates[language].daysShort[date.getUTCDay()],
					w: date.getUTCDay(), // 0 -> 6
					N: (date.getUTCDay() == 0 ? 7 : date.getUTCDay()),       // 1 -> 7
					S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
					// hour
					a: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
					g: (date.getUTCHours() % 12 == 0 ? 12 : date.getUTCHours() % 12),
					G: date.getUTCHours(),
					// minute
					i: date.getUTCMinutes(),
					// second
					s: date.getUTCSeconds()
				};
				val.m = (val.n < 10 ? '0' : '') + val.n;
				val.d = (val.j < 10 ? '0' : '') + val.j;
				val.A = val.a.toString().toUpperCase();
				val.h = (val.g < 10 ? '0' : '') + val.g;
				val.H = (val.G < 10 ? '0' : '') + val.G;
				val.i = (val.i < 10 ? '0' : '') + val.i;
				val.s = (val.s < 10 ? '0' : '') + val.s;
			} else {
				throw new Error("Invalid format type.");
			}
			var date = [],
				seps = $.extend([], format.separators);
			for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length) {
					date.push(seps.shift());
				}
				date.push(val[format.parts[i]]);
			}
			if (seps.length) {
				date.push(seps.shift());
			}
			return date.join('');
		},
		convertViewMode:  function (viewMode) {
			switch (viewMode) {
				case 4:
				case 'decade':
					viewMode = 4;
					break;
				case 3:
				case 'year':
					viewMode = 3;
					break;
				case 2:
				case 'month':
					viewMode = 2;
					break;
				case 1:
				case 'day':
					viewMode = 1;
					break;
				case 0:
				case 'hour':
					viewMode = 0;
					break;
			}

			return viewMode;
		},
		headTemplate:     '<thead>' +
							  '<tr>' +
							  '<th class="prev"><i class="fa fa-angle-left"/></th>' +
							  '<th colspan="5" class="switch"></th>' +
							  '<th class="next"><i class="fa fa-angle-right"/></th>' +
							  '</tr>' +
							 '</thead>',
		headTemplateV3:   '<thead>' +
							  '<tr>' +
							  '<th class="prev"><i class="fa fa-angle-left"></i> </th>' +
							  '<th colspan="5" class="switch"></th>' +
							  '<th class="next"><i class="fa fa-angle-right"></i> </th>' +
							  '</tr>' +
			'</thead>',
		contTemplate:     '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate:     '<tfoot><tr><th colspan="7" class="today"><div class="now"></div></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datetimepicker">' +
		'<div class="datetimepicker-minutes">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-hours">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-days">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		'<tbody></tbody>' +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-months">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-years">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'</div>';
	DPGlobal.templateV3 = '<div class="datetimepicker">' +
		'<div class="datetimepicker-minutes">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-hours">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-days">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		'<tbody></tbody>' +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-months">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-years">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'</div>';
	$.fn.datetimepicker.DPGlobal = DPGlobal;

	/* DATETIMEPICKER NO CONFLICT
	 * =================== */

	$.fn.datetimepicker.noConflict = function () {
		$.fn.datetimepicker = old;
		return this;
	};

	/* DATETIMEPICKER DATA-API
	 * ================== */

	$(document).on(
		'focus.datetimepicker.data-api click.datetimepicker.data-api',
		'[data-provide="datetimepicker"]',
		function (e) {
			var $this = $(this);
			if ($this.data('datetimepicker')) return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datetimepicker('show');
		}
	);
	$(function () {
		$('[data-provide="datetimepicker-inline"]').datetimepicker({
			startView: 2,
			minView: 2
		});
	});

}(window.jQuery);











/**
* @version: 1.2
* @author: Dan Grossman http://www.dangrossman.info/
* @date: 2013-07-25
* @copyright: Copyright (c) 2012-2013 Dan Grossman. All rights reserved.
* @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
* @website: http://www.improvely.com/
*/
(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['moment', 'jquery', 'exports'], function(momentjs, $, exports) {
			root.daterangepicker = factory(root, exports, momentjs, $);
		});

	} else if (typeof exports !== 'undefined') {
		var momentjs = require('moment');
		var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;  //isomorphic issue
		if (!jQuery) {
			try {
				jQuery = require('jquery');
				if (!jQuery.fn) jQuery.fn = {}; //isomorphic issue
			} catch (err) {
				if (!jQuery) throw new Error('jQuery dependency not found');
			}
		}

		factory(root, exports, momentjs, jQuery);

		// Finally, as a browser global.
	} else {
		root.daterangepicker = factory(root, {}, root.moment || moment, (root.jQuery || root.Zepto || root.ender || root.$));
	}

}(this || {}, function(root, daterangepicker, moment, $) { // 'this' doesn't exist on a server

	var DateRangePicker = function(element, options, cb) {

		//default settings for options
		this.parentEl = 'body';
		this.element = $(element);
		this.startDate = moment().startOf('day');
		this.endDate = moment().endOf('day');
		this.minDate = false;
		this.maxDate = false;
		this.dateLimit = false;
		this.autoApply = false;
		this.singleDatePicker = false;
		this.showDropdowns = false;
		this.showWeekNumbers = false;
		this.timePicker = false;
		this.timePicker24Hour = false;
		this.timePickerIncrement = 1;
		this.timePickerSeconds = false;
		this.linkedCalendars = true;
		this.autoUpdateInput = true;
		this.ranges = {};

		this.opens = 'right';
		if (this.element.hasClass('pull-right'))
			this.opens = 'left';

		this.drops = 'down';
		if (this.element.hasClass('dropup'))
			this.drops = 'up';

		this.buttonClasses = 'btn btn-sm';
		this.applyClass = 'btn-success';
		this.cancelClass = 'btn-default';

		this.locale = {
			format: 'MM/DD/YYYY',
			separator: ' - ',
			applyLabel: 'Apply',
			cancelLabel: 'Cancel',
			weekLabel: 'W',
			customRangeLabel: 'Custom Range',
			daysOfWeek: moment.weekdaysMin(),
			monthNames: moment.monthsShort(),
			firstDay: moment.localeData().firstDayOfWeek()
		};

		this.callback = function() { };

		//some state information
		this.isShowing = false;
		this.leftCalendar = {};
		this.rightCalendar = {};

		//custom options from user
		if (typeof options !== 'object' || options === null)
			options = {};

		//allow setting options with data attributes
		//data-api options will be overwritten with custom javascript options
		options = $.extend(this.element.data(), options);

		//html template for the picker UI
		if (typeof options.template !== 'string')
			options.template = '<div class="daterangepicker dropdown-menu">' +
				'<div class="calendar left">' +
				'<div class="daterangepicker_input">' +
				'<input class="input-mini" type="text" name="daterangepicker_start" value="" />' +
				'<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
				'<div class="calendar-time">' +
				'<div></div>' +
				'<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
				'</div>' +
				'</div>' +
				'<div class="calendar-table"></div>' +
				'</div>' +
				'<div class="calendar right">' +
				'<div class="daterangepicker_input">' +
				'<input class="input-mini" type="text" name="daterangepicker_end" value="" />' +
				'<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
				'<div class="calendar-time">' +
				'<div></div>' +
				'<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' +
				'</div>' +
				'</div>' +
				'<div class="calendar-table"></div>' +
				'</div>' +
				'<div class="ranges">' +
				'<div class="range_inputs">' +
				'<button class="applyBtn" disabled="disabled" type="button"></button> ' +
				'<button class="cancelBtn" type="button"></button>' +
				'</div>' +
				'</div>' +
				'</div>';

		this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
		this.container = $(options.template).appendTo(this.parentEl);

		//
		// handle all the possible options overriding defaults
		//

		if (typeof options.locale === 'object') {

			if (typeof options.locale.format === 'string')
				this.locale.format = options.locale.format;

			if (typeof options.locale.separator === 'string')
				this.locale.separator = options.locale.separator;

			if (typeof options.locale.daysOfWeek === 'object')
				this.locale.daysOfWeek = options.locale.daysOfWeek.slice();

			if (typeof options.locale.monthNames === 'object')
				this.locale.monthNames = options.locale.monthNames.slice();

			if (typeof options.locale.firstDay === 'number')
				this.locale.firstDay = options.locale.firstDay;

			if (typeof options.locale.applyLabel === 'string')
				this.locale.applyLabel = options.locale.applyLabel;

			if (typeof options.locale.cancelLabel === 'string')
				this.locale.cancelLabel = options.locale.cancelLabel;

			if (typeof options.locale.weekLabel === 'string')
				this.locale.weekLabel = options.locale.weekLabel;

			if (typeof options.locale.customRangeLabel === 'string')
				this.locale.customRangeLabel = options.locale.customRangeLabel;

		}

		if (typeof options.startDate === 'string')
			this.startDate = moment(options.startDate, this.locale.format);

		if (typeof options.endDate === 'string')
			this.endDate = moment(options.endDate, this.locale.format);

		if (typeof options.minDate === 'string')
			this.minDate = moment(options.minDate, this.locale.format);

		if (typeof options.maxDate === 'string')
			this.maxDate = moment(options.maxDate, this.locale.format);

		if (typeof options.startDate === 'object')
			this.startDate = moment(options.startDate);

		if (typeof options.endDate === 'object')
			this.endDate = moment(options.endDate);

		if (typeof options.minDate === 'object')
			this.minDate = moment(options.minDate);

		if (typeof options.maxDate === 'object')
			this.maxDate = moment(options.maxDate);

		// sanity check for bad options
		if (this.minDate && this.startDate.isBefore(this.minDate))
			this.startDate = this.minDate.clone();

		// sanity check for bad options
		if (this.maxDate && this.endDate.isAfter(this.maxDate))
			this.endDate = this.maxDate.clone();

		if (typeof options.applyClass === 'string')
			this.applyClass = options.applyClass;

		if (typeof options.cancelClass === 'string')
			this.cancelClass = options.cancelClass;

		if (typeof options.dateLimit === 'object')
			this.dateLimit = options.dateLimit;

		if (typeof options.opens === 'string')
			this.opens = options.opens;

		if (typeof options.drops === 'string')
			this.drops = options.drops;

		if (typeof options.showWeekNumbers === 'boolean')
			this.showWeekNumbers = options.showWeekNumbers;

		if (typeof options.buttonClasses === 'string')
			this.buttonClasses = options.buttonClasses;

		if (typeof options.buttonClasses === 'object')
			this.buttonClasses = options.buttonClasses.join(' ');

		if (typeof options.showDropdowns === 'boolean')
			this.showDropdowns = options.showDropdowns;

		if (typeof options.singleDatePicker === 'boolean') {
			this.singleDatePicker = options.singleDatePicker;
			if (this.singleDatePicker)
				this.endDate = this.startDate.clone();
		}

		if (typeof options.timePicker === 'boolean')
			this.timePicker = options.timePicker;

		if (typeof options.timePickerSeconds === 'boolean')
			this.timePickerSeconds = options.timePickerSeconds;

		if (typeof options.timePickerIncrement === 'number')
			this.timePickerIncrement = options.timePickerIncrement;

		if (typeof options.timePicker24Hour === 'boolean')
			this.timePicker24Hour = options.timePicker24Hour;

		if (typeof options.autoApply === 'boolean')
			this.autoApply = options.autoApply;

		if (typeof options.autoUpdateInput === 'boolean')
			this.autoUpdateInput = options.autoUpdateInput;

		if (typeof options.linkedCalendars === 'boolean')
			this.linkedCalendars = options.linkedCalendars;

		if (typeof options.isInvalidDate === 'function')
			this.isInvalidDate = options.isInvalidDate;

		// update day names order to firstDay
		if (this.locale.firstDay != 0) {
			var iterator = this.locale.firstDay;
			while (iterator > 0) {
				this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
				iterator--;
			}
		}

		var start, end, range;

		//if no start/end dates set, check if an input element contains initial values
		if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
			if ($(this.element).is('input[type=text]')) {
				var val = $(this.element).val(),
					split = val.split(this.locale.separator);

				start = end = null;

				if (split.length == 2) {
					start = moment(split[0], this.locale.format);
					end = moment(split[1], this.locale.format);
				} else if (this.singleDatePicker && val !== "") {
					start = moment(val, this.locale.format);
					end = moment(val, this.locale.format);
				}
				if (start !== null && end !== null) {
					this.setStartDate(start);
					this.setEndDate(end);
				}
			}
		}

		if (typeof options.ranges === 'object') {
			for (range in options.ranges) {

				if (typeof options.ranges[range][0] === 'string')
					start = moment(options.ranges[range][0], this.locale.format);
				else
					start = moment(options.ranges[range][0]);

				if (typeof options.ranges[range][1] === 'string')
					end = moment(options.ranges[range][1], this.locale.format);
				else
					end = moment(options.ranges[range][1]);

				// If the start or end date exceed those allowed by the minDate or dateLimit
				// options, shorten the range to the allowable period.
				if (this.minDate && start.isBefore(this.minDate))
					start = this.minDate.clone();

				var maxDate = this.maxDate;
				if (this.dateLimit && start.clone().add(this.dateLimit).isAfter(maxDate))
					maxDate = start.clone().add(this.dateLimit);
				if (maxDate && end.isAfter(maxDate))
					end = maxDate.clone();

				// If the end of the range is before the minimum or the start of the range is
				// after the maximum, don't display this range option at all.
				if ((this.minDate && end.isBefore(this.minDate)) || (maxDate && start.isAfter(maxDate)))
					continue;

				//Support unicode chars in the range names.
				var elem = document.createElement('textarea');
				elem.innerHTML = range;
				rangeHtml = elem.value;

				this.ranges[rangeHtml] = [start, end];
			}

			var list = '<ul>';
			for (range in this.ranges) {
				list += '<li>' + range + '</li>';
			}
			list += '<li>' + this.locale.customRangeLabel + '</li>';
			list += '</ul>';
			this.container.find('.ranges').prepend(list);
		}

		if (typeof cb === 'function') {
			this.callback = cb;
		}

		if (!this.timePicker) {
			this.startDate = this.startDate.startOf('day');
			this.endDate = this.endDate.endOf('day');
			this.container.find('.calendar-time').hide();
		}

		//can't be used together for now
		if (this.timePicker && this.autoApply)
			this.autoApply = false;

		if (this.autoApply && typeof options.ranges !== 'object') {
			this.container.find('.ranges').hide();
		} else if (this.autoApply) {
			this.container.find('.applyBtn, .cancelBtn').addClass('hide');
		}

		if (this.singleDatePicker) {
			this.container.addClass('single');
			this.container.find('.calendar.left').addClass('single');
			this.container.find('.calendar.left').show();
			this.container.find('.calendar.right').hide();
			this.container.find('.daterangepicker_input input, .daterangepicker_input i').hide();
			if (!this.timePicker) {
				this.container.find('.ranges').hide();
			}
		}

		if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
			this.container.addClass('show-calendar');
		}

		this.container.addClass('opens' + this.opens);

		//swap the position of the predefined ranges if opens right
		if (typeof options.ranges !== 'undefined' && this.opens == 'right') {
			var ranges = this.container.find('.ranges');
			var html = ranges.clone();
			ranges.remove();
			this.container.find('.calendar.left').parent().prepend(html);
		}

		//apply CSS classes and labels to buttons
		this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
		if (this.applyClass.length)
			this.container.find('.applyBtn').addClass(this.applyClass);
		if (this.cancelClass.length)
			this.container.find('.cancelBtn').addClass(this.cancelClass);
		this.container.find('.applyBtn').html(this.locale.applyLabel);
		this.container.find('.cancelBtn').html(this.locale.cancelLabel);

		//
		// event listeners
		//

		this.container.find('.calendar')
			.on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
			.on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
			.on('click.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
			.on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this))
			.on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this))
			.on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this))
			.on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this))
			.on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this))
			.on('click.daterangepicker', '.daterangepicker_input input', $.proxy(this.showCalendars, this))
			//.on('keyup.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsChanged, this))
			.on('change.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsChanged, this));

		this.container.find('.ranges')
			.on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
			.on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
			.on('click.daterangepicker', 'li', $.proxy(this.clickRange, this))
			.on('mouseenter.daterangepicker', 'li', $.proxy(this.hoverRange, this))
			.on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));

		if (this.element.is('input')) {
			this.element.on({
				'click.daterangepicker': $.proxy(this.show, this),
				'focus.daterangepicker': $.proxy(this.show, this),
				'keyup.daterangepicker': $.proxy(this.elementChanged, this),
				'keydown.daterangepicker': $.proxy(this.keydown, this)
			});
		} else {
			this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
		}

		//
		// if attached to a text input, set the initial value
		//

		if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
			this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
			this.element.trigger('change');
		} else if (this.element.is('input') && this.autoUpdateInput) {
			this.element.val(this.startDate.format(this.locale.format));
			this.element.trigger('change');
		}

	};

	DateRangePicker.prototype = {

		constructor: DateRangePicker,

		setStartDate: function(startDate) {
			if (typeof startDate === 'string')
				this.startDate = moment(startDate, this.locale.format);

			if (typeof startDate === 'object')
				this.startDate = moment(startDate);

			if (!this.timePicker)
				this.startDate = this.startDate.startOf('day');

			if (this.timePicker && this.timePickerIncrement)
				this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

			if (this.minDate && this.startDate.isBefore(this.minDate))
				this.startDate = this.minDate;

			if (this.maxDate && this.startDate.isAfter(this.maxDate))
				this.startDate = this.maxDate;

			if (!this.isShowing)
				this.updateElement();

			this.updateMonthsInView();
		},

		setEndDate: function(endDate) {
			if (typeof endDate === 'string')
				this.endDate = moment(endDate, this.locale.format);

			if (typeof endDate === 'object')
				this.endDate = moment(endDate);

			if (!this.timePicker)
				this.endDate = this.endDate.endOf('day');

			if (this.timePicker && this.timePickerIncrement)
				this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

			if (this.endDate.isBefore(this.startDate))
				this.endDate = this.startDate.clone();

			if (this.maxDate && this.endDate.isAfter(this.maxDate))
				this.endDate = this.maxDate;

			if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate))
				this.endDate = this.startDate.clone().add(this.dateLimit);

			if (!this.isShowing)
				this.updateElement();

			this.updateMonthsInView();
		},

		isInvalidDate: function() {
			return false;
		},

		updateView: function() {
			if (this.timePicker) {
				this.renderTimePicker('left');
				this.renderTimePicker('right');
				if (!this.endDate) {
					this.container.find('.right .calendar-time select').attr('disabled', 'disabled').addClass('disabled');
				} else {
					this.container.find('.right .calendar-time select').removeAttr('disabled').removeClass('disabled');
				}
			}
			if (this.endDate) {
				this.container.find('input[name="daterangepicker_end"]').removeClass('active');
				this.container.find('input[name="daterangepicker_start"]').addClass('active');
			} else {
				this.container.find('input[name="daterangepicker_end"]').addClass('active');
				this.container.find('input[name="daterangepicker_start"]').removeClass('active');
			}
			this.updateMonthsInView();
			this.updateCalendars();
			this.updateFormInputs();
		},

		updateMonthsInView: function() {
			if (this.endDate) {

				//if both dates are visible already, do nothing
				if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
					(this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
					&&
					(this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))
				) {
					return;
				}

				this.leftCalendar.month = this.startDate.clone().date(2);
				if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
					this.rightCalendar.month = this.endDate.clone().date(2);
				} else {
					this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
				}

			} else {
				if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
					this.leftCalendar.month = this.startDate.clone().date(2);
					this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
				}
			}
		},

		updateCalendars: function() {

			if (this.timePicker) {
				var hour, minute, second;
				if (this.endDate) {
					hour = parseInt(this.container.find('.left .hourselect').val(), 10);
					minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
					second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
					if (!this.timePicker24Hour) {
						var ampm = this.container.find('.left .ampmselect').val();
						if (ampm === 'PM' && hour < 12)
							hour += 12;
						if (ampm === 'AM' && hour === 12)
							hour = 0;
					}
				} else {
					hour = parseInt(this.container.find('.right .hourselect').val(), 10);
					minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
					second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
					if (!this.timePicker24Hour) {
						var ampm = this.container.find('.right .ampmselect').val();
						if (ampm === 'PM' && hour < 12)
							hour += 12;
						if (ampm === 'AM' && hour === 12)
							hour = 0;
					}
				}
				this.leftCalendar.month.hour(hour).minute(minute).second(second);
				this.rightCalendar.month.hour(hour).minute(minute).second(second);
			}

			this.renderCalendar('left');
			this.renderCalendar('right');

			//highlight any predefined range matching the current start and end dates
			this.container.find('.ranges li').removeClass('active');
			if (this.endDate == null) return;

			var customRange = true;
			var i = 0;
			for (var range in this.ranges) {
				if (this.timePicker) {
					if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
						customRange = false;
						this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
						break;
					}
				} else {
					//ignore times when comparing dates if time picker is not enabled
					if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
						customRange = false;
						this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
						break;
					}
				}
				i++;
			}
			if (customRange) {
				this.chosenLabel = this.container.find('.ranges li:last').addClass('active').html();
				this.showCalendars();
			}

		},

		renderCalendar: function(side) {

			//
			// Build the matrix of dates that will populate the calendar
			//

			var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
			var month = calendar.month.month();
			var year = calendar.month.year();
			var hour = calendar.month.hour();
			var minute = calendar.month.minute();
			var second = calendar.month.second();
			var daysInMonth = moment([year, month]).daysInMonth();
			var firstDay = moment([year, month, 1]);
			var lastDay = moment([year, month, daysInMonth]);
			var lastMonth = moment(firstDay).subtract(1, 'month').month();
			var lastYear = moment(firstDay).subtract(1, 'month').year();
			var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
			var dayOfWeek = firstDay.day();

			//initialize a 6 rows x 7 columns array for the calendar
			var calendar = [];
			calendar.firstDay = firstDay;
			calendar.lastDay = lastDay;

			for (var i = 0; i < 6; i++) {
				calendar[i] = [];
			}

			//populate the calendar with date objects
			var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
			if (startDay > daysInLastMonth)
				startDay -= 7;

			if (dayOfWeek == this.locale.firstDay)
				startDay = daysInLastMonth - 6;

			var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);

			var col, row;
			for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
				if (i > 0 && col % 7 === 0) {
					col = 0;
					row++;
				}
				calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
				curDate.hour(12);

				if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
					calendar[row][col] = this.minDate.clone();
				}

				if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
					calendar[row][col] = this.maxDate.clone();
				}

			}

			//make the calendar object available to hoverDate/clickDate
			if (side == 'left') {
				this.leftCalendar.calendar = calendar;
			} else {
				this.rightCalendar.calendar = calendar;
			}

			//
			// Display the calendar
			//

			var minDate = side == 'left' ? this.minDate : this.startDate;
			var maxDate = this.maxDate;
			var selected = side == 'left' ? this.startDate : this.endDate;

			var html = '<table class="table-condensed">';
			html += '<thead>';
			html += '<tr>';

			// add empty cell for week number
			if (this.showWeekNumbers)
				html += '<th></th>';

			if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
				html += '<th class="prev available"><i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i></th>';
			} else {
				html += '<th></th>';
			}

			var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

			if (this.showDropdowns) {
				var currentMonth = calendar[1][1].month();
				var currentYear = calendar[1][1].year();
				var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
				var minYear = (minDate && minDate.year()) || (currentYear - 50);
				var inMinYear = currentYear == minYear;
				var inMaxYear = currentYear == maxYear;

				var monthHtml = '<select class="monthselect">';
				for (var m = 0; m < 12; m++) {
					if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
						monthHtml += "<option value='" + m + "'" +
							(m === currentMonth ? " selected='selected'" : "") +
							">" + this.locale.monthNames[m] + "</option>";
					} else {
						monthHtml += "<option value='" + m + "'" +
							(m === currentMonth ? " selected='selected'" : "") +
							" disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
					}
				}
				monthHtml += "</select>";

				var yearHtml = '<select class="yearselect">';
				for (var y = minYear; y <= maxYear; y++) {
					yearHtml += '<option value="' + y + '"' +
						(y === currentYear ? ' selected="selected"' : '') +
						'>' + y + '</option>';
				}
				yearHtml += '</select>';

				dateHtml = monthHtml + yearHtml;
			}

			html += '<th colspan="5" class="month">' + dateHtml + '</th>';
			if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
				html += '<th class="next available"><i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i></th>';
			} else {
				html += '<th></th>';
			}

			html += '</tr>';
			html += '<tr>';

			// add week number label
			if (this.showWeekNumbers)
				html += '<th class="week">' + this.locale.weekLabel + '</th>';

			$.each(this.locale.daysOfWeek, function(index, dayOfWeek) {
				html += '<th>' + dayOfWeek + '</th>';
			});

			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';

			//adjust maxDate to reflect the dateLimit setting in order to
			//grey out end dates beyond the dateLimit
			if (this.endDate == null && this.dateLimit) {
				var maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
				if (!maxDate || maxLimit.isBefore(maxDate)) {
					maxDate = maxLimit;
				}
			}

			for (var row = 0; row < 6; row++) {
				html += '<tr>';

				// add week number
				if (this.showWeekNumbers)
					html += '<td class="week">' + calendar[row][0].week() + '</td>';

				for (var col = 0; col < 7; col++) {

					var classes = [];

					//highlight today's date
					if (calendar[row][col].isSame(new Date(), "day"))
						classes.push('today');

					//highlight weekends
					if (calendar[row][col].isoWeekday() > 5)
						classes.push('weekend');

					//grey out the dates in other months displayed at beginning and end of this calendar
					if (calendar[row][col].month() != calendar[1][1].month())
						classes.push('off');

					//don't allow selection of dates before the minimum date
					if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day'))
						classes.push('off', 'disabled');

					//don't allow selection of dates after the maximum date
					if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
						classes.push('off', 'disabled');

					//don't allow selection of date if a custom function decides it's invalid
					if (this.isInvalidDate(calendar[row][col]))
						classes.push('off', 'disabled');

					//highlight the currently selected start date
					if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD'))
						classes.push('active', 'start-date');

					//highlight the currently selected end date
					if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD'))
						classes.push('active', 'end-date');

					//highlight dates in-between the selected dates
					if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
						classes.push('in-range');

					var cname = '', disabled = false;
					for (var i = 0; i < classes.length; i++) {
						cname += classes[i] + ' ';
						if (classes[i] == 'disabled')
							disabled = true;
					}
					if (!disabled)
						cname += 'available';

					html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';

				}
				html += '</tr>';
			}

			html += '</tbody>';
			html += '</table>';

			this.container.find('.calendar.' + side + ' .calendar-table').html(html);

		},

		renderTimePicker: function(side) {

			var html, selected, minDate, maxDate = this.maxDate;

			if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate)))
				maxDate = this.startDate.clone().add(this.dateLimit);

			if (side == 'left') {
				selected = this.startDate.clone();
				minDate = this.minDate;
			} else if (side == 'right') {
				selected = this.endDate ? this.endDate.clone() : this.startDate.clone();
				minDate = this.startDate;
			}

			//
			// hours
			//

			html = '<select class="hourselect">';

			var start = this.timePicker24Hour ? 0 : 1;
			var end = this.timePicker24Hour ? 23 : 12;

			for (var i = start; i <= end; i++) {
				var i_in_24 = i;
				if (!this.timePicker24Hour)
					i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);

				var time = selected.clone().hour(i_in_24);
				var disabled = false;
				if (minDate && time.minute(59).isBefore(minDate))
					disabled = true;
				if (maxDate && time.minute(0).isAfter(maxDate))
					disabled = true;

				if (i_in_24 == selected.hour() && !disabled) {
					html += '<option value="' + i + '" selected="selected">' + i + '</option>';
				} else if (disabled) {
					html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
				} else {
					html += '<option value="' + i + '">' + i + '</option>';
				}
			}

			html += '</select> ';

			//
			// minutes
			//

			html += ': <select class="minuteselect">';

			for (var i = 0; i < 60; i += this.timePickerIncrement) {
				var padded = i < 10 ? '0' + i : i;
				var time = selected.clone().minute(i);

				var disabled = false;
				if (minDate && time.second(59).isBefore(minDate))
					disabled = true;
				if (maxDate && time.second(0).isAfter(maxDate))
					disabled = true;

				if (selected.minute() == i && !disabled) {
					html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
				} else if (disabled) {
					html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
				} else {
					html += '<option value="' + i + '">' + padded + '</option>';
				}
			}

			html += '</select> ';

			//
			// seconds
			//

			if (this.timePickerSeconds) {
				html += ': <select class="secondselect">';

				for (var i = 0; i < 60; i++) {
					var padded = i < 10 ? '0' + i : i;
					var time = selected.clone().second(i);

					var disabled = false;
					if (minDate && time.isBefore(minDate))
						disabled = true;
					if (maxDate && time.isAfter(maxDate))
						disabled = true;

					if (selected.second() == i && !disabled) {
						html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
					} else if (disabled) {
						html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
					} else {
						html += '<option value="' + i + '">' + padded + '</option>';
					}
				}

				html += '</select> ';
			}

			//
			// AM/PM
			//

			if (!this.timePicker24Hour) {
				html += '<select class="ampmselect">';

				var am_html = '';
				var pm_html = '';

				if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate))
					am_html = ' disabled="disabled" class="disabled"';

				if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate))
					pm_html = ' disabled="disabled" class="disabled"';

				if (selected.hour() >= 12) {
					html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
				} else {
					html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
				}

				html += '</select>';
			}

			this.container.find('.calendar.' + side + ' .calendar-time div').html(html);

		},

		updateFormInputs: function() {

			//ignore mouse movements while an above-calendar text input has focus
			if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
				return;

			this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.locale.format));
			if (this.endDate)
				this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.locale.format));

			if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
				this.container.find('button.applyBtn').removeAttr('disabled');
			} else {
				this.container.find('button.applyBtn').attr('disabled', 'disabled');
			}

		},

		move: function() {
			var parentOffset = { top: 0, left: 0 },
				containerTop;
			var parentRightEdge = $(window).width();
			if (!this.parentEl.is('body')) {
				parentOffset = {
					top: this.parentEl.offset().top - this.parentEl.scrollTop(),
					left: this.parentEl.offset().left - this.parentEl.scrollLeft()
				};
				parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
			}

			if (this.drops == 'up')
				containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
			else
				containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
			this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');

			if (this.opens == 'left') {
				this.container.css({
					top: containerTop,
					right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
					left: 'auto'
				});
				if (this.container.offset().left < 0) {
					this.container.css({
						right: 'auto',
						left: 9
					});
				}
			} else if (this.opens == 'center') {
				this.container.css({
					top: containerTop,
					left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2
					- this.container.outerWidth() / 2,
					right: 'auto'
				});
				if (this.container.offset().left < 0) {
					this.container.css({
						right: 'auto',
						left: 9
					});
				}
			} else {
				this.container.css({
					top: containerTop,
					left: this.element.offset().left - parentOffset.left,
					right: 'auto'
				});
				if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
					this.container.css({
						left: 'auto',
						right: 0
					});
				}
			}
		},

		show: function(e) {
			if (this.isShowing) return;

			// Create a click proxy that is private to this instance of datepicker, for unbinding
			this._outsideClickProxy = $.proxy(function(e) { this.outsideClick(e); }, this);

			// Bind global datepicker mousedown for hiding and
			$(document)
				.on('mousedown.daterangepicker', this._outsideClickProxy)
				// also support mobile devices
				.on('touchend.daterangepicker', this._outsideClickProxy)
				// also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
				.on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
				// and also close when focus changes to outside the picker (eg. tabbing between controls)
				.on('focusin.daterangepicker', this._outsideClickProxy);

			// Reposition the picker if the window is resized while it's open
			$(window).on('resize.daterangepicker', $.proxy(function(e) { this.move(e); }, this));

			this.oldStartDate = this.startDate.clone();
			this.oldEndDate = this.endDate.clone();

			this.updateView();
			this.container.show();
			this.move();
			this.element.trigger('show.daterangepicker', this);
			this.isShowing = true;
		},

		hide: function(e) {
			if (!this.isShowing) return;

			//incomplete date selection, revert to last values
			if (!this.endDate) {
				this.startDate = this.oldStartDate.clone();
				this.endDate = this.oldEndDate.clone();
			}

			//if a new date range was selected, invoke the user callback function
			if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
				this.callback(this.startDate, this.endDate, this.chosenLabel);

			//if picker is attached to a text input, update it
			this.updateElement();

			$(document).off('.daterangepicker');
			$(window).off('.daterangepicker');
			this.container.hide();
			this.element.trigger('hide.daterangepicker', this);
			this.isShowing = false;
		},

		toggle: function(e) {
			if (this.isShowing) {
				this.hide();
			} else {
				this.show();
			}
		},

		outsideClick: function(e) {
			var target = $(e.target);
			// if the page is clicked anywhere except within the daterangerpicker/button
			// itself then call this.hide()
			if (
				// ie modal dialog fix
			e.type == "focusin" ||
			target.closest(this.element).length ||
			target.closest(this.container).length ||
			target.closest('.calendar-table').length
			) return;
			this.hide();
		},

		showCalendars: function() {
			this.container.addClass('show-calendar');
			this.move();
			this.element.trigger('showCalendar.daterangepicker', this);
		},

		hideCalendars: function() {
			this.container.removeClass('show-calendar');
			this.element.trigger('hideCalendar.daterangepicker', this);
		},

		hoverRange: function(e) {

			//ignore mouse movements while an above-calendar text input has focus
			if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
				return;

			var label = e.target.innerHTML;
			if (label == this.locale.customRangeLabel) {
				this.updateView();
			} else {
				var dates = this.ranges[label];
				this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.locale.format));
				this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.locale.format));
			}

		},

		clickRange: function(e) {
			var label = e.target.innerHTML;
			this.chosenLabel = label;
			if (label == this.locale.customRangeLabel) {
				this.showCalendars();
			} else {
				var dates = this.ranges[label];
				this.startDate = dates[0];
				this.endDate = dates[1];

				if (!this.timePicker) {
					this.startDate.startOf('day');
					this.endDate.endOf('day');
				}

				this.hideCalendars();
				this.clickApply();
			}
		},

		clickPrev: function(e) {
			var cal = $(e.target).parents('.calendar');
			if (cal.hasClass('left')) {
				this.leftCalendar.month.subtract(1, 'month');
				if (this.linkedCalendars)
					this.rightCalendar.month.subtract(1, 'month');
			} else {
				this.rightCalendar.month.subtract(1, 'month');
			}
			this.updateCalendars();
		},

		clickNext: function(e) {
			var cal = $(e.target).parents('.calendar');
			if (cal.hasClass('left')) {
				this.leftCalendar.month.add(1, 'month');
			} else {
				this.rightCalendar.month.add(1, 'month');
				if (this.linkedCalendars)
					this.leftCalendar.month.add(1, 'month');
			}
			this.updateCalendars();
		},

		hoverDate: function(e) {

			//ignore mouse movements while an above-calendar text input has focus
			if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
				return;

			//ignore dates that can't be selected
			if (!$(e.target).hasClass('available')) return;

			//have the text inputs above calendars reflect the date being hovered over
			var title = $(e.target).attr('data-title');
			var row = title.substr(1, 1);
			var col = title.substr(3, 1);
			var cal = $(e.target).parents('.calendar');
			var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

			if (this.endDate) {
				this.container.find('input[name=daterangepicker_start]').val(date.format(this.locale.format));
			} else {
				this.container.find('input[name=daterangepicker_end]').val(date.format(this.locale.format));
			}

			//highlight the dates between the start date and the date being hovered as a potential end date
			var leftCalendar = this.leftCalendar;
			var rightCalendar = this.rightCalendar;
			var startDate = this.startDate;
			if (!this.endDate) {
				this.container.find('.calendar td').each(function(index, el) {

					//skip week numbers, only look at dates
					if ($(el).hasClass('week')) return;

					var title = $(el).attr('data-title');
					var row = title.substr(1, 1);
					var col = title.substr(3, 1);
					var cal = $(el).parents('.calendar');
					var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

					if (dt.isAfter(startDate) && dt.isBefore(date)) {
						$(el).addClass('in-range');
					} else {
						$(el).removeClass('in-range');
					}

				});
			}

		},

		clickDate: function(e) {

			if (!$(e.target).hasClass('available')) return;

			var title = $(e.target).attr('data-title');
			var row = title.substr(1, 1);
			var col = title.substr(3, 1);
			var cal = $(e.target).parents('.calendar');
			var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

			//
			// this function needs to do a few things:
			// * alternate between selecting a start and end date for the range,
			// * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
			// * if autoapply is enabled, and an end date was chosen, apply the selection
			// * if single date picker mode, and time picker isn't enabled, apply the selection immediately
			//

			if (this.endDate || date.isBefore(this.startDate)) {
				if (this.timePicker) {
					var hour = parseInt(this.container.find('.left .hourselect').val(), 10);
					if (!this.timePicker24Hour) {
						var ampm = cal.find('.ampmselect').val();
						if (ampm === 'PM' && hour < 12)
							hour += 12;
						if (ampm === 'AM' && hour === 12)
							hour = 0;
					}
					var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
					var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
					date = date.clone().hour(hour).minute(minute).second(second);
				}
				this.endDate = null;
				this.setStartDate(date.clone());
			} else {
				if (this.timePicker) {
					var hour = parseInt(this.container.find('.right .hourselect').val(), 10);
					if (!this.timePicker24Hour) {
						var ampm = this.container.find('.right .ampmselect').val();
						if (ampm === 'PM' && hour < 12)
							hour += 12;
						if (ampm === 'AM' && hour === 12)
							hour = 0;
					}
					var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
					var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
					date = date.clone().hour(hour).minute(minute).second(second);
				}
				this.setEndDate(date.clone());
				if (this.autoApply)
					this.clickApply();
			}

			if (this.singleDatePicker) {
				this.setEndDate(this.startDate);
				if (!this.timePicker)
					this.clickApply();
			}

			this.updateView();

		},

		clickApply: function(e) {
			this.hide();
			this.element.trigger('apply.daterangepicker', this);
		},

		clickCancel: function(e) {
			this.startDate = this.oldStartDate;
			this.endDate = this.oldEndDate;
			this.hide();
			this.element.trigger('cancel.daterangepicker', this);
		},

		monthOrYearChanged: function(e) {
			var isLeft = $(e.target).closest('.calendar').hasClass('left'),
				leftOrRight = isLeft ? 'left' : 'right',
				cal = this.container.find('.calendar.'+leftOrRight);

			// Month must be Number for new moment versions
			var month = parseInt(cal.find('.monthselect').val(), 10);
			var year = cal.find('.yearselect').val();

			if (!isLeft) {
				if (year < this.startDate.year() || (year == this.startDate.year() && month < this.startDate.month())) {
					month = this.startDate.month();
					year = this.startDate.year();
				}
			}

			if (this.minDate) {
				if (year < this.minDate.year() || (year == this.minDate.year() && month < this.minDate.month())) {
					month = this.minDate.month();
					year = this.minDate.year();
				}
			}

			if (this.maxDate) {
				if (year > this.maxDate.year() || (year == this.maxDate.year() && month > this.maxDate.month())) {
					month = this.maxDate.month();
					year = this.maxDate.year();
				}
			}

			if (isLeft) {
				this.leftCalendar.month.month(month).year(year);
				if (this.linkedCalendars)
					this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
			} else {
				this.rightCalendar.month.month(month).year(year);
				if (this.linkedCalendars)
					this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
			}
			this.updateCalendars();
		},

		timeChanged: function(e) {

			var cal = $(e.target).closest('.calendar'),
				isLeft = cal.hasClass('left');

			var hour = parseInt(cal.find('.hourselect').val(), 10);
			var minute = parseInt(cal.find('.minuteselect').val(), 10);
			var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;

			if (!this.timePicker24Hour) {
				var ampm = cal.find('.ampmselect').val();
				if (ampm === 'PM' && hour < 12)
					hour += 12;
				if (ampm === 'AM' && hour === 12)
					hour = 0;
			}

			if (isLeft) {
				var start = this.startDate.clone();
				start.hour(hour);
				start.minute(minute);
				start.second(second);
				this.setStartDate(start);
				if (this.singleDatePicker) {
					this.endDate = this.startDate.clone();
				} else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
					this.setEndDate(start.clone());
				}
			} else if (this.endDate) {
				var end = this.endDate.clone();
				end.hour(hour);
				end.minute(minute);
				end.second(second);
				this.setEndDate(end);
			}

			//update the calendars so all clickable dates reflect the new time component
			this.updateCalendars();

			//update the form inputs above the calendars with the new time
			this.updateFormInputs();

			//re-render the time pickers because changing one selection can affect what's enabled in another
			this.renderTimePicker('left');
			this.renderTimePicker('right');

		},

		formInputsChanged: function(e) {
			var isRight = $(e.target).closest('.calendar').hasClass('right');
			var start = moment(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
			var end = moment(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);

			if (start.isValid() && end.isValid()) {

				if (isRight && end.isBefore(start))
					start = end.clone();

				this.setStartDate(start);
				this.setEndDate(end);

				if (isRight) {
					this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format));
				} else {
					this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format));
				}

			}

			this.updateCalendars();
			if (this.timePicker) {
				this.renderTimePicker('left');
				this.renderTimePicker('right');
			}
		},

		elementChanged: function() {
			if (!this.element.is('input')) return;
			if (!this.element.val().length) return;
			if (this.element.val().length < this.locale.format.length) return;

			var dateString = this.element.val().split(this.locale.separator),
				start = null,
				end = null;

			if (dateString.length === 2) {
				start = moment(dateString[0], this.locale.format);
				end = moment(dateString[1], this.locale.format);
			}

			if (this.singleDatePicker || start === null || end === null) {
				start = moment(this.element.val(), this.locale.format);
				end = start;
			}

			if (!start.isValid() || !end.isValid()) return;

			this.setStartDate(start);
			this.setEndDate(end);
			this.updateView();
		},

		keydown: function(e) {
			//hide on tab or enter
			if ((e.keyCode === 9) || (e.keyCode === 13)) {
				this.hide();
			}
		},

		updateElement: function() {
			if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
				this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
				this.element.trigger('change');
			} else if (this.element.is('input') && this.autoUpdateInput) {
				this.element.val(this.startDate.format(this.locale.format));
				this.element.trigger('change');
			}
		},

		remove: function() {
			this.container.remove();
			this.element.off('.daterangepicker');
			this.element.removeData();
		}

	};

	$.fn.daterangepicker = function(options, callback) {
		this.each(function() {
			var el = $(this);
			if (el.data('daterangepicker'))
				el.data('daterangepicker').remove();
			el.data('daterangepicker', new DateRangePicker(el, options, callback));
		});
		return this;
	};

}));













/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.3.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    $.timeago = function(timestamp) {
        if (timestamp instanceof Date) {
            return inWords(timestamp);
        } else if (typeof timestamp === "string") {
            return inWords($.timeago.parse(timestamp));
        } else if (typeof timestamp === "number") {
            return inWords(new Date(timestamp));
        } else {
            return inWords($.timeago.datetime(timestamp));
        }
    };
    var $t = $.timeago;

    $.extend($.timeago, {
        settings: {
            refreshMillis: 60000,
            allowFuture: false,
            localeTitle: false,
            cutoff: 0,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years",
                wordSeparator: " ",
                numbers: []
            }
        },
        inWords: function(distanceMillis) {
            var $l = this.settings.strings;
            var prefix = $l.prefixAgo;
            var suffix = $l.suffixAgo;
            if (this.settings.allowFuture) {
                if (distanceMillis < 0) {
                    prefix = $l.prefixFromNow;
                    suffix = $l.suffixFromNow;
                }
            }

            var seconds = Math.abs(distanceMillis) / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            function substitute(stringOrFunction, number) {
                var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
                var value = ($l.numbers && $l.numbers[number]) || number;
                return string.replace(/%d/i, value);
            }

            var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
                seconds < 90 && substitute($l.minute, 1) ||
                minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
                minutes < 90 && substitute($l.hour, 1) ||
                hours < 24 && substitute($l.hours, Math.round(hours)) ||
                hours < 42 && substitute($l.day, 1) ||
                days < 30 && substitute($l.days, Math.round(days)) ||
                days < 45 && substitute($l.month, 1) ||
                days < 365 && substitute($l.months, Math.round(days / 30)) ||
                years < 1.5 && substitute($l.year, 1) ||
                substitute($l.years, Math.round(years));

            var separator = $l.wordSeparator || "";
            if ($l.wordSeparator === undefined) {
                separator = " ";
            }
            return $.trim([prefix, words, suffix].join(separator));
        },
        parse: function(iso8601) {
            var s = $.trim(iso8601);
            s = s.replace(/\.\d+/, ""); // remove milliseconds
            s = s.replace(/-/, "/").replace(/-/, "/");
            s = s.replace(/T/, " ").replace(/Z/, " UTC");
            s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
            return new Date(s);
        },
        datetime: function(elem) {
            var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
            return $t.parse(iso8601);
        },
        isTime: function(elem) {
            // jQuery's `is()` doesn't play well with HTML5 in IE
            return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
        }
    });

    // functions that can be called via $(el).timeago('action')
    // init is default when no action is given
    // functions are called with context of a single element
    var functions = {
        init: function() {
            var refresh_el = $.proxy(refresh, this);
            refresh_el();
            var $s = $t.settings;
            if ($s.refreshMillis > 0) {
                setInterval(refresh_el, $s.refreshMillis);
            }
        },
        update: function(time) {
            $(this).data('timeago', {
                datetime: $t.parse(time)
            });
            refresh.apply(this);
        },
        updateFromDOM: function() {
            $(this).data('timeago', {
                datetime: $t.parse($t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title"))
            });
            refresh.apply(this);
        }
    };

    $.fn.timeago = function(action, options) {
        var fn = action ? functions[action] : functions.init;
        if (!fn) {
            throw new Error("Unknown function name '" + action + "' for timeago");
        }
        // each over objects here and call the requested function
        this.each(function() {
            fn.call(this, options);
        });
        return this;
    };

    function refresh() {
        var data = prepareData(this);
        var $s = $t.settings;

        if (!isNaN(data.datetime)) {
            if ($s.cutoff == 0 || distance(data.datetime) < $s.cutoff) {
                $(this).text(inWords(data.datetime));
            }
        }
        return this;
    }

    function prepareData(element) {
        element = $(element);
        if (!element.data("timeago")) {
            element.data("timeago", {
                datetime: $t.datetime(element)
            });
            var text = $.trim(element.text());
            if ($t.settings.localeTitle) {
                element.attr("title", element.data('timeago').datetime.toLocaleString());
            } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
                element.attr("title", text);
            }
        }
        return element.data("timeago");
    }

    function inWords(date) {
        return $t.inWords(distance(date));
    }

    function distance(date) {
        return (new Date().getTime() - date.getTime());
    }

    // fix for IE6 suckage
    document.createElement("abbr");
    document.createElement("time");
}));













