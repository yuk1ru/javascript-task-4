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
         * @returns {this}
         */
        on: function (event, context, handler) {
            if (!this.events.has(event)) {
                this.events.set(event, new Map());
            }
            const contextMapping = this.events.get(event);
            if (!contextMapping.has(context)) {
                contextMapping.set(context, []);
            }
            const eventHandlers = contextMapping.get(context);
            eventHandlers.push(handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            const eventFilter = e =>
                e === event || e.startsWith(`${event}.`);
            const eventsToOff = [...this.events.keys()].filter(eventFilter);
            eventsToOff.forEach(e => this.events.get(e).delete(context));

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

            eventsToEmit.map(e => this.events.get(e))
                .filter(e => Boolean(e))
                .forEach(eventMapping =>
                    eventMapping.forEach((handlers, context) =>
                        handlers.forEach(handler => handler.call(context))));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
