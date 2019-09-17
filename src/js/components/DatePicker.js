/* global flatpickr */
import {select, settings} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './BaseWidget.js';


class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    flatpickr(thisWidget.dom.input, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      defaultDate: utils.dateToStr(thisWidget.minDate),
      minDate: utils.dateToStr(thisWidget.minDate),
      maxDate: utils.dateToStr(thisWidget.maxDate),
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },
      'disable': [
        function(date) {

          return (date.getDay() === 1);

        }
      ],
      onChange: function(dateStr) {
        //...
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(value){
    return parseInt(value);
  }
  isValid(){
    return true;
  }
  renderValue(){

  }
}

export default DatePicker;
