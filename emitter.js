'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: new Map(),

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number?} times
         * @param {Number?} frequency
         * @returns {this}
         */
        // eslint-disable-next-line max-params
        on: function (event, context, handler, times = 0, frequency = 0) {
            if (!this.events.has(event)) {
                this.events.set(event, new Map());
            }
            const contextMapping = this.events.get(event);

            if (!contextMapping.has(context)) {
                contextMapping.set(context, []);
            }
            const eventHandlers = contextMapping.get(context);

            if (times <= 0) {
                times = Infinity;
            }
            if (frequency <= 0) {
                frequency = 1;
            }
            const eventHandler = {
                function: handler,
                times,
                frequency,
                callCount: 0
            };
            eventHandlers.push(eventHandler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            const eventFilter = eventName =>
                eventName === event || eventName.startsWith(event + '.');

            const eventsToOff = [...this.events.keys()].filter(eventFilter);
            eventsToOff.map(eventName => this.events.get(eventName))
                .forEach(contextMapping => contextMapping.delete(context));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {this}
         */
        emit: function (event) {
            const eventsToEmit = event.split('.').reduceRight((acc, _, i, arr) =>
                acc.concat(arr.slice(0, i + 1).join('.')), []);

            const callHandler = (eventHandler, context) => {
                if (eventHandler.callCount < eventHandler.times &&
                    eventHandler.callCount % eventHandler.frequency === 0) {

                    eventHandler.function.call(context);
                    eventHandler.callCount++;
                } else {
                    eventHandler.callCount++;
                }
            };
            eventsToEmit.filter(eventName => this.events.has(eventName))
                .map(eventName => this.events.get(eventName))
                .forEach(eventMapping =>
                    eventMapping.forEach((handlers, context) =>
                        handlers.forEach(handler => callHandler(handler, context))));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {this}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, handler, times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {this}
         */
        through: function (event, context, handler, frequency) {
            this.on(event, context, handler, undefined, frequency);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
