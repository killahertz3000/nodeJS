
//  hh:mm:ss-dd-mm-yyyy


 const { DateTime } = require('luxon');
 const EventEmitter = require('events');

 function getDateISOString(date) {
   const [time, day, month, year] = date.split('-');
   return `${year}-${month}-${day}T${time}`;
 }

 function getDateDifference(date1, date2) {
   const [start, end] = date1 > date2 ? [date2, date1] : [date1, date2];
   return end
     .diff(start, ['years', 'months', 'days', 'hours', 'minutes', 'seconds'])
     .toObject();
 }

 class Timer extends EventEmitter {
   _currentTime = null;

   constructor(name, endTime) {
     super();
     this.name = name;
     this.endTime = DateTime.fromISO(endTime);
   }

   start() {
     this._timerObj = setInterval(() => {
       this._currentTime = DateTime.now();
       if (this.isEnd()) this.stop();
       else this.tick();
     }, 1000);
   }

   stop() {
     clearInterval(this._timerObj);
     this.emit('stop', {
       [this.name]: `завершен.`,
     });
   }

   tick() {
     const { years, months, days, hours, minutes, seconds } = getDateDifference(
       this.endTime,
       this._currentTime
     );
     this.emit('tick', {
       [this.name]:
         (years > 0 ? `years: ${years}, ` : '') +
         (months > 0 ? `months: ${months}, ` : '') +
         (days > 0 ? `days: ${days}, ` : '') +
         (hours < 10 ? `0${hours}:` : `${hours}:`) +
         (minutes < 10 ? `0${minutes}:` : `${minutes}:`) +
         (Math.round(seconds) < 10
           ? `0${Math.round(seconds)}`
           : `${Math.round(seconds)}`),
     });
   }

   isEnd() {
     return this._currentTime >= this.endTime;
   }
 }

 class TimersList {
   _timersList = [];
   _timersState = {};

   constructor(timeStringList) {
     timeStringList.forEach((timeString, index) => {
       const timer = new Timer(index + 1, timeString);

       timer.on('tick', (tick) => {
         this.updateState(tick);
         this.renderState();
       });
       timer.on('stop', (stop) => {
         this.updateState(stop);
         this.renderState();
       });

       this._timersList.push(timer);
     });
   }

   startTimers() {
     this._timersList.forEach((timer) => timer.start());
   }

   updateState(newState) {
     this._timersState = { ...this._timersState, ...newState };
   }

   renderState() {
     console.clear();
     Object.keys(this._timersState).forEach((timerName) => {
       console.log(`Таймер ${timerName}: ${this._timersState[timerName]}`);
     });
   }
 }

 const timeList = process.argv
   .splice(2)
   .map((timeString) => getDateISOString(timeString));
 const timersList = new TimersList(timeList);

 timersList.startTimers();