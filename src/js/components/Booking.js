
import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;
    /* generate HTML code using booking Widget template */
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    /* make const for container of booking section from app.js */
    thisBooking.dom.wrapper = element;
    /* insert booking HTML generated from the template into booking wrapper */
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
  }
  initWidgets(){
    const thisBooking = this;

    /* Initialize widget changing amount of people */
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    /* Initialize widget changing number of hours */
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }

}

export default Booking;
