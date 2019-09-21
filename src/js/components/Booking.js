
import {select, settings, templates, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.reserve();
  }

  reserve(){
    const thisBooking = this;
    /* define constant with all tables in restaurant */
    const tables = thisBooking.dom.tables;

    let bookedTable = '';
    /* Check if any table is clicked */
    for(let table of tables){
      table.addEventListener('click', function(){
        /* Add class booked */
        table.classList.add(classNames.booking.tableBooked);
        /* Get attribute (number) of clicked table */
        bookedTable = table.getAttribute(settings.booking.tableIdAttribute);
        /* Save booked table to thisBooking object */
        thisBooking.table = bookedTable;
      });
    }
    /* Add event listener for hour selection slider to listen for change */
    thisBooking.hourPicker.dom.input.addEventListener('input', function(){
      /* if there is a table booked (clicked) */
      if(thisBooking.table.length > 0){
        /* Remove class booked from previosuly clicked table */
        tables[thisBooking.table-1].classList.remove(classNames.booking.tableBooked);
      }
    });
    /* Add event listener for date selection input to listen for change */
    thisBooking.datePicker.dom.input.addEventListener('input', function(){
      /* if there is a table booked (clicked) */
      if(thisBooking.table.length > 0){
        /* Remove class booked from previosuly clicked table */
        tables[thisBooking.table-1].classList.remove(classNames.booking.tableBooked);
      }
    });
  }
  /* get filetered data about bookings from API */
  getData(){
    const thisBooking = this;
    /* set start date parameters to construct urls that will be later used to get data from API */
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    /* set end date parameters to construct urls that will be later used to get data from API */
    const endDateParam = settings.db.dateEndParamKey   + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    /* Create const that stores parameters of bookings and events */
    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    /* Make urls object that stores API endpoint address containing list of bookings and events */
    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsRepeat.join('&'),

    };

    //console.log('getData urls: ', urls);

    /* use Promise.all to execute function defined in then only when all fetch actions are completed */
    Promise.all([
      /* fetch data from API */
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
      /* Promise.all returns an array allResponses */
    ]).then(function(allResponses){
      const bookingsResponse = allResponses[0];
      const eventsCurrentResponse = allResponses[1];
      const eventsRepeatResponse = allResponses[2];
      /* return parsed data (in json format) */
      return Promise.all([
        bookingsResponse.json(),
        eventsCurrentResponse.json(),
        eventsRepeatResponse.json(),
      ]);
      /* save first element of array from previous function as booking const, second as eventsCurrent and third as eventsRepeat */
    }).then(function([bookings, eventsCurrent, eventsRepeat]){
      thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
    });
  }

  /* Creates a local object containing booking data, so that data does not have to be checked in API each time user use hour slider or picks date */
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    /* Create empty object that will later contain data downloaded from API */
    thisBooking.booked = {};

    /* Start loop for each booking */
    for(let item of bookings){
      /* saves booking data to thisBooking.booked object using makeBooked method */
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    /* Start loop for each one-time event */
    for(let item of eventsCurrent){
      /* saves one time event data to thisBooking.booked object using makeBooked method */
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    /* Get selected date from datePicker */
    const minDate = thisBooking.datePicker.minDate;
    /* Max date calculated as selected date + 14 days - also from datePicker */
    const maxDate = thisBooking.datePicker.maxDate;

    /* Start loop for each repeating event */
    for(let item of eventsRepeat){
      /* check if event is repeating type */
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate<=maxDate; loopDate = utils.addDays(loopDate, 1)){
          /* saves repeating event data to thisBooking.booked object using makeBooked method */
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    //console.log('thisBooking.booked: ', thisBooking.booked);
    thisBooking.updateDOM();
  }

  /* Method that saves booking and event data to object thisBooking.booked */
  makeBooked(date, hour, duration, table){
    const thisBooking = this;
    /* If there is no booking for a selected date then create an empty object */
    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    /* convert selected start hour - e.g. 12:30 from API - to number we need in thisBooking.booked object - 12.5 */
    const startHour = utils.hourToNumber(hour);
    /* If there is no booking for selected date and hour then create an empty array */
    if(typeof thisBooking.booked[date][startHour] == 'undefined'){
      thisBooking.booked[date][startHour] = [];
    }
    /* Append table number to array in thisBooking.booked object for selected date and hour */
    /* In thisBooking.booked object date is a key, for each date values are hours. Hours are keys and for each hour the value is an array with table numbers */
    thisBooking.booked[date][startHour].push(table);

    /* Loop to book a table for entire duration of the booking, not just the starting hour */
    for (let hourBlock = startHour; hourBlock<startHour+duration; hourBlock +=0.5){
      /* If there is no booking for the hour block yet, create empty array */
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      /* For each hour block append table number to array in thisBooking.booked object */
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    /* save date and hour to thisBooking object based on datePicker and hourPicker inputs */
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    /* Constant that indicates that on the particular date and hour all tables are available */
    let allAvailable = false;

    /* if for selected date there is no object or for selected date and hour there is no array it means that all tables are available */
    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    /* Start loop for each table from tables visible on the booking tab */
    for(let table of thisBooking.dom.tables){
      /* set table Id from 'data-table' html attribute - will always be a string */
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      /* check if tableId is a number */
      if(!isNaN(tableId)){
        /* convert string to integer */
        tableId = parseInt(tableId);
      }
      /* if not all tables are available and selected table is booked for selected date and hour */
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        /* add class 'booked' to the booked table */
        table.classList.add(classNames.booking.tableBooked);
      }else{
        /* remove class 'booked' from selected table */
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
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
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }
  initWidgets(){
    const thisBooking = this;

    /* Initialize widget changing amount of people */
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    /* Initialize widget changing number of hours */
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    /* Initialize widget selecting date */
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    /* Initialize widget selecting hour */
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    /* Update DOM after user update input data */
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }

}

export default Booking;
