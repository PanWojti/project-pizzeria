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

    /* create minDate object with value equal to today's date */
    thisWidget.minDate = new Date(thisWidget.value);
    /* create maxDate object with value equal to today's date plus 14 days*/
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },
      'disable': [
        function(date) {

          return (date.getDay() === 1);

        }
      ],
      onChange: function(selectedDays, dateStr) {
        //...
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(value){
    return value;
  }
  isValid(){
    return true;
  }
  renderValue(){

  }
}

export default DatePicker;
