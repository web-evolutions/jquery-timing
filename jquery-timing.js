/* ========================================================================
 * jquery-timing-v0.0.1 : Monday, 28.04.2014, 08:22:39
 * a Plugin for jQuery
 * Copyright 2014 Web-evolutions
 * ========================================================================
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * ======================================================================== */

if(typeof jQuery === 'undefined'){
    throw new Error('Timing requires jQuery'); 
};

;(function($, window, document, undefined){
    var pluginName = 'timing',
        dataPlugin = 'plugin_' + pluginName,
        defaults = {
            //dateFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
            hours : '00',
            minutes : '00',
            seconds : '00',            
            start : 'start',
            stop : 'stop',
            reset : 'reset',
            divider : ':',
            disable : false,
            disabledClass : 'timer-disabled',
            onClass : 'timer-on',
            offClass : 'timer-off',
            timerClass : 'timer',
            hoursClass : 'timer-hours',
            minutesClass : 'timer-minutes',
            secondsClass : 'timer-seconds', 
            controlClass : 'timer-control',
            startClass : 'timer-start',
            stopClass : 'timer-stop',
            resetClass : 'timer-reset',
            switchControls : false,
            buildTimer : true,
            buildControl : true,
            hideHours : false,
            hideMinutes : false,
            hideSeconds : false,
            hideStart : false,
            hideStop : false,
            hideReset : false,
    },

    session = 1,
    store = {},
    dataMode = 'data-timing-mode', 
    dataType = 'data-timing-type', 
    dataValue = 'data-timing-value',
    dataSet = 'data-timing-set',
    dataGet = 'data-timing-get',
    dataTarget = 'data-timing-target', 
    dataId = 'data-timing-id',
    allowedTypes = {
        start: true,
        stop: true,
        reset: true,
        hours: true,
        minutes: true,
        seconds : true
    }    

    buildWrapper = function(timingId, mode, cls){
        var parent = $('[' + dataId + '="'+ timingId +'"]'),
            wrapper = parent.find('[' + dataMode + '="'+ mode +'"]');
        if(!wrapper.length){
            parent.append('<div ' + dataMode + '="'+ mode +'" class="' + cls + '"></div>'); 
            wrapper = parent.find('[' + dataMode + '="'+ mode +'"]');         
        } 
        return wrapper;           
    },

    buildInner = function(timingId, wrapper, type, cls, content, hide, divider){
        var element = wrapper.find('[' + dataType + '="'+ type +'"]');
        if(element.length){
            if(typeof element.attr(dataTarget) === 'undefined'){
                element.attr(dataTarget, timingId);    
            }
            element.text(content);
        }else{
            element = $('<span ' + dataType + '="'+ type +'" ' + dataTarget + '="'+ timingId +'" class="' + cls + '">' + content + '</span>');
            wrapper.append(element);
            if(divider !== false){
                 wrapper.append(divider);    
            }
        }
        if(hide === true){
            element.hide();             
        }            
    },    

    buildTiming = function(timingId, options){
        if(options.buildTimer === true){
            var timeWrapper = buildWrapper(timingId, 'timer', options.timerClass);
            buildInner(timingId, timeWrapper, 'hours', options.hoursClass, options.hours, options.hideHours, options.divider);
            buildInner(timingId, timeWrapper, 'minutes', options.minutesClass, options.minutes, options.hideMinutes, options.divider);
            buildInner(timingId, timeWrapper, 'seconds', options.secondsClass, options.seconds, options.hideSeconds, false);
        }
        if(options.buildControl === true){
            var controlWrapper = buildWrapper(timingId, 'control', options.controlClass);
            buildInner(timingId, controlWrapper, 'start', options.startClass, options.start,  options.hideStart, false);
            buildInner(timingId, controlWrapper, 'stop', options.stopClass, options.stop,  options.hideStop, false);
            buildInner(timingId, controlWrapper, 'reset', options.resetClass, options.reset,  options.hideReset, false);            
        }
    },

    timingTimer = function(timingId, hoursObject, minutesObject, secondsObject){
        store[timingId].hours = parseFloat(store[timingId].hours),
        store[timingId].minutes = parseFloat(store[timingId].minutes),
        store[timingId].seconds = parseFloat(store[timingId].seconds);
        store[timingId].seconds ++;        
        if(store[timingId].seconds > 59){
            store[timingId].seconds = 0;
            store[timingId].minutes = store[timingId].minutes + 1;
        }
        if(store[timingId].minutes > 59){
            store[timingId].minutes = 0;
            store[timingId].hours = store[timingId].hours + 1;
        } 

        timingTimerSet(hoursObject, '0'.substring(store[timingId].hours >= 10) + store[timingId].hours);
        timingTimerSet(minutesObject, '0'.substring(store[timingId].minutes >= 10) + store[timingId].minutes);
        timingTimerSet(secondsObject, '0'.substring(store[timingId].seconds >= 10) + store[timingId].seconds);            
    },

    timingGetId = function(data){
        var result = {};
        if(typeof data === 'object'){
            if(typeof data.timingTarget !== 'undefined'){
                result[data.timingTarget] = data.timingTarget;
            }else if(typeof data.timingId !== 'undefined'){
                result[data.timingId] = data.timingId;
            }else{
                result = data;
            }
        }else{
            result[data] = data;
        }
        return result;
    },

    timingGetType = function(target, type){
        var object = target.find('[' + dataType + '="' + type + '"]');
        if(object.length){
            return object;
        }else{
            return false;
        }
    }, 

    timingGetTimer = function(timingId){
        var object = $('[' + dataId + '="' + timingId + '"]'),
            results = {
            target : object,
            hours : timingGetType(object, 'hours'),
            minutes : timingGetType(object, 'minutes'),
            seconds : timingGetType(object, 'seconds'),            
        }
        return results;
    }, 

    timingTimerSet = function(object, value){
        if(object !== false){
            object.html(value);    
        } 
    },

    timingChangeState = function(type, selector, data, cls){
        $.each(timingGetId(data), function(key, timingId){
            if(timingId in store){
                var target = $('[' + dataId + '="' + timingId + '"]');
                if(type === 'disable'){
                    store[timingId].disable = true;
                    target.addClass(cls);
                }
                if(type === 'enable'){
                    store[timingId].disable = false;
                    target.removeClass(cls);
                }
                selector.trigger('timing.' + type, store[timingId]);
            }
        });
    },

    timingSwitchControl = function(timingId, change, toHide, toShow){
        if(change === true){
            var hideObject = $('[' + dataTarget + '="' + timingId + '"][' + dataType + '="' + toHide + '"]'),
                showObject = $('[' + dataTarget + '="' + timingId + '"][' + dataType + '="' + toShow + '"]');
            if(hideObject.css('display') != 'none'){
                hideObject.hide();
            }
            if(showObject.css('display') == 'none'){
                showObject.show();
            }                                 
        }
    },

    timingTrigger = function(fn, data, type, onEvent){
        var allow = allowedTypes;
            allow['enable'] = true;
            allow['disable'] = true;
        if(allow[type] === true){
            type = '="' + type + '"';
        }else{
            type = '';
        }
        $('[' + data + type + ']').on(onEvent, function(){
            var object = $(this);
            object.timing(fn, object.data()); 
        });
    },    

    Plugin = function(element){
        this.options = $.extend({}, defaults);
        this.selector = $(element);
        this.element = element; 
    };

    Plugin.prototype = {
        init: function(options){
            $.extend(this.options, options);
            var self = this,
                x = 1;            
            this.selector.each(function(event){
                var timingId = session + '-' + x,
                    object = $(this),
                    value = object.attr(dataId);
                if(typeof value === 'undefined'){
                    object.attr(dataId, timingId);   
                }else{
                    timingId = value;   
                } 
                if(!(timingId in store)){
                    store[timingId] = {
                        timingId : timingId,
                        timer : 0,
                        timing : false,
                        timerReset : false,
                        timeStart : 0,
                        timeEnd : 0,
                        disable : self.options.disable,
                        hours: self.options.hours,
                        minutes: self.options.minutes,
                        seconds: self.options.seconds,
                    };                     
                }
                if(self.options.switchControls === true){
                    self.options.hideStop = true;                             
                }
                if(self.options.disable === true){
                    object.addClass(self.options.disabledClass);                             
                }                
                buildTiming(timingId, self.options);
                x++;
            });
            session++;
        },

        start: function(data){
            var self = this;
            $.each(timingGetId(data), function(key, timingId){
                if((timingId in store) && store[timingId].timing !== true && store[timingId].disable !== true){
                    var timerObjects = timingGetTimer(timingId);
                    if(timerObjects.target.length){
                        timerObjects.target.removeClass(self.options.offClass);
                        timerObjects.target.addClass(self.options.onClass);
                    }                   
                    store[timingId].timing = true;
                    store[timingId].timerReset = false;
                    store[timingId].timeStart = new Date(); // self.options.dateFormat 
                    store[timingId].timer = setInterval(function(){
                        timingTimer(timingId, timerObjects.hours, timerObjects.minutes, timerObjects.seconds);
                    }, 1000);               
                    timingSwitchControl(timingId, self.options.switchControls, 'start', 'stop');                    
                    self.selector.trigger('timing.start', store[timingId]);
                }
            });
        },

        stop: function(data){
            var self = this;
            $.each(timingGetId(data), function(key, timingId){
                if((timingId in store) && store[timingId].timing !== false && store[timingId].timer !== 0 && store[timingId].disable !== true){
                    clearInterval(store[timingId].timer);
                    store[timingId].timing = false;
                    store[timingId].timerReset = true;
                    store[timingId].timeEnd = new Date(); // self.options.dateFormat
                    store[timingId].timer = 0; 
                    var target = $('[' + dataId + '="' + timingId + '"]');
                    if(target.length){
                        target.removeClass(self.options.onClass);
                        target.addClass(self.options.offClass);
                    }
                    timingSwitchControl(timingId, self.options.switchControls, 'stop', 'start');
                    self.selector.trigger('timing.stop', store[timingId]);                
                }
            });
        },

        reset: function(data){
            var self = this;
            $.each(timingGetId(data), function(key, timingId){
                if((timingId in store) && store[timingId].timerReset !== false && store[timingId].disable !== true){
                    clearInterval(store[timingId].timer); 
                    store[timingId].timing = false;
                    store[timingId].timerReset = false;
                    store[timingId].timer = 0; 
                    store[timingId].hours = self.options.hours,
                    store[timingId].minutes = self.options.minutes,
                    store[timingId].seconds = self.options.seconds;
                    var timerObjects = timingGetTimer(timingId);
                    if(timerObjects.target.length){
                        timerObjects.target.removeClass(self.options.onClass).removeClass(self.options.offClass);
                        timingTimerSet(timerObjects.hours, '00');
                        timingTimerSet(timerObjects.minutes, '00');
                        timingTimerSet(timerObjects.seconds, '00');
                    }  
                    timingSwitchControl(timingId, self.options.switchControls, 'stop', 'start');                    
                    self.selector.trigger('timing.reset', store[timingId]);
                }
            });
        },

        disable: function(data){
            timingChangeState('disable', this.selector, data, this.options.disabledClass);               
        },

        enable: function(data){
            timingChangeState('enable', this.selector, data, this.options.disabledClass);          
        },

        getData: function(data, value, object){
            var self = this,
                result = {};
            $.each(timingGetId(data), function(key, timingId){
                if(typeof object === 'undefined' && typeof data.timingGet !== 'undefined'){
                    object = data.timingValue;
                }
                if(typeof data.timingGet !== 'undefined'){
                    value = data.timingGet; 
                } 
                if((timingId in store)){
                    if(typeof value !== 'undefined'){
                        result[timingId] = store[timingId][value];
                    }else{
                        result[timingId] = store[timingId];    
                    }
                    if(typeof object !== 'undefined'){
                        $(object).html(result);    
                    }
                    self.selector.trigger('timing.getData', result);
                }
            });  
            return result;             
        },

        setData: function(data, type, value){ 
            var self = this;           
            $.each(timingGetId(data), function(key, timingId){
                if(typeof type === 'undefined' && typeof data.timingSet !== 'undefined'){
                    type = data.timingSet;
                }
                if(typeof data.timingValue !== 'undefined'){
                    value = data.timingValue; 
                } 
                if((timingId in store) && typeof value !== 'undefined' && allowedTypes[type] === true){
                    var wrapper = $('[' + dataId + '="' + timingId + '"]')
                        target = wrapper.find('[' + dataType + '="' + type + '"]');
                    if(target.length){
                        target.html(value);
                    }                   
                    store[timingId][type] = value;
                    self.selector.trigger('timing.setData', value); 
                }
            });                 
        },

        destroy: function(){
            this.selector.trigger('timing.destroy', store);
            this.element.data(dataPlugin, null);
        },                
    }

    $.fn[pluginName] = function(arg){
        var args, 
            instance;
        if (!( this.data(dataPlugin) instanceof Plugin)){
            this.data(dataPlugin, new Plugin(this));
        }
        instance = this.data(dataPlugin);
        if(instance !== null){
            instance.element = this;
            if (typeof arg === 'undefined' || typeof arg === 'object'){

                if(typeof instance['init'] === 'function'){
                    instance.init(arg);
                }
            }else if(typeof arg === 'string' && typeof instance[arg] === 'function'){
                args = Array.prototype.slice.call(arguments, 1);
                return instance[arg].apply(instance, args);
            }else{
                $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);
            }
        }
    };

    // DATA-API
    $('[' + dataId + ']').each(function(){
        var obj = $(this),
            id = obj.attr(dataId);
        if(!(id in store)){
            obj.timing(obj.data());                
        }
    });   
    $(window).on('load', function(){
        timingTrigger('start', dataType, 'start', 'click');
        timingTrigger('stop', dataType, 'stop', 'click');
        timingTrigger('reset', dataType, 'reset', 'click');
        timingTrigger('disable', dataType, 'disable', 'click');
        timingTrigger('enable', dataType, 'enable', 'click');
        timingTrigger('setData', dataSet, false, 'click');
        timingTrigger('getData', dataGet, false, 'click');
    });
}(jQuery, window, document));