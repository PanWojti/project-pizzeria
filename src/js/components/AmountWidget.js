
import {settings, select} from '../settings.js';

class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
    //console.log('thisWidget: ', thisWidget);
    //console.log('constructor arguments: ', element);
  }
  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);

    /* Validation: check if new value is different than current value and that it is higher or equal to min value and lower or equal to max value */
    if(newValue !== thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.input.value = thisWidget.value;
  }
  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', thisWidget.setValue(thisWidget.input.value));
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
      //console.log('amount decreased');
    });
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
      //console.log('amount increased');
    });
  }
  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
    //console.log('announced');
  }
}

export default AmountWidget;
