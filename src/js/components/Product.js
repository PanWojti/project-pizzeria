import {select, classNames, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import {utils} from '../utils.js';

class Product{
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new Product:', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion(){
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    const trigger = thisProduct.accordionTrigger;
    /* START: click event listener to trigger */
    trigger.addEventListener('click', function(){
      /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');
      /* find all active products */
      const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);
      /* START LOOP: for each active product */
      for(let activeProduct of allActiveProducts){
        /* START: if the active product isn't the element of thisProduct */
        if(activeProduct !== thisProduct.element){
          /* remove class active for the active product */
          activeProduct.classList.remove('active');
        /* END: if the active product isn't the element of thisProduct */
        }
      /* END LOOP: for each active product */
      }
    /* END: click event listener to trigger */
    }
    );
  }
  initOrderForm(){
    const thisProduct = this;
    //console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      //console.log('cart button clicked');
    });
  }
  processOrder(){
    const thisProduct = this;
    //console.log('processOrder');
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    thisProduct.params = {};
    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){
      /* Save the element in thisProduct.data.params with key paramsId as const param */
      const param = thisProduct.data.params[paramId];
      /* START LOOP: for each optionID in param.options */
      for(let optionId in param.options){
        /* Save the element in param.options with key optionID as const option */
        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId)>-1;
        /* START IF: if option is selected and option is not default */
        if(optionSelected && !option.default){
          /* add price of option to variable price */
          price = price + option.price;
          /* END IF: if option is selected and option s not default */
        }
        /* START ELSE IF: if option is not selected and option is default */
        else if(!optionSelected && option.default){
          /* subtract price of option from variable price */
          price = price - option.price;
        /* END ELSE IF: if option is not selected and option is default */
        }
        /* Save all images of option to const optionImages */
        const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
        /* START IF: If option is selected */
        if (optionSelected){
          /* check if this parameter hasn't already been added to params */
          if(!thisProduct.params[paramId]){
            /* add parameter label and empty object - options */
            thisProduct.params[paramId]={
              label: param.label,
              options: {},
            };
          }
          /* Add option to option object with its label as value */
          thisProduct.params[paramId].options[optionId] = option.label;

          /* START LOOP: for every image in optionImages */

          for(let image of optionImages){

            /* Image for option should get class active (classNames.menuProduct.imageVisible)*/

            image.classList.add(classNames.menuProduct.imageVisible);
            /* END LOOP: for every image in optionImages */

          }

          /* END IF: */

        }

        /* START ELSE: */
        else {
          /* START LOOP: for every image in optionImages */
          for(let image of optionImages){
            /* Image for option should have class active removed (classNames.menuProduct.imageVisible)*/
            image.classList.remove(classNames.menuProduct.imageVisible);
          /* END LOOP: for every image in optionImages */
          }
        /* END ELSE: */
        }
      /* END LOOP: for each optionID in param.options */
      }
    /* END LOOP: for each paramId in thisProduct.data.params */
    }
    /* Multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    /* set the contents of thisProductpriceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log('thisProduct.params: ', thisProduct.params);
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
      //console.log('updated happened');
    });

  }
  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);
    //console.log('addToCart executed');

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
