const EventEmitter = require('events'),
    emitter = new EventEmitter();
require('moment-precise-range-plugin');
const moment = require('moment');

const [userPastDate] = process.argv.slice(2);
const format = 'YYYY-MM-DD HH:mm:ss';

const getDateFromDateString = (dateString) => {
    const [sec, min, hour, day, month, year] = dateString.split('-');
    return new Date(Date.UTC(year, month - 1, day, hour, min, sec));
};

const dateInFuture = getDateFromDateString(userPastDate);


const showRemainingTime = (dateInFuture) => {
    const dateNow = new Date();

    if (dateNow >= dateInFuture) {
        emitter.emit('timerEnd');
    } else {
        const currentDateFormatted = moment(dateNow, format);
        const futureDateFormatted = moment(dateInFuture, format);
        const diff = moment.preciseDiff(currentDateFormatted, futureDateFormatted);

        console.log(diff);
    }
};

const timerId = setInterval(() => {
    emitter.emit('timerTick', dateInFuture);
}, 1000)

const showTimerDone = (timerId) => {
    clearInterval(timerId);
    console.log('End');
};

emitter.on('timerTick', showRemainingTime);
emitter.on('timerEnd', () => {
    showTimerDone(timerId);
});