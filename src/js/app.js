
import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

export const app = {
  initBooking: function(){
    const thisApp = this;

    thisApp.booking = document.querySelector(select.containerOf.booking);
    console.log('thisApp.booking: ', thisApp.booking);

    new Booking(thisApp.booking);
  },
  initPages: function(){
    const thisApp = this;
    /* Find all sub-pages containers */
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    /* Find all sub-pages links */
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    /* Code below created to prevent opening default page every time the page is reloaded */

    /* Create const from page URL hash in order to know which page should be active by default */
    const idFromHash = window.location.hash.replace('#/', '');
    /* create const with default page id in case no sub-page match the page URL hash */
    let pageMatchingHash = thisApp.pages[0].id;
    /* Check if any of the sub-pages id match the hash taken from the page URL */
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    /* call activatePage with appropriate page id */
    thisApp.activatePage(pageMatchingHash);
    /* for all sub-pages links listen for click */
    for(let link of thisApp.navLinks){

      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);
        /* Change URL hash to id of clicked sub-page link*/
        window.location.hash = '#/' + id;
      });
    }

  },
  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class "active" to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initMenu: function(){
    const thisApp = this;

    //console.log('thisApp.data: ', thisApp.data);

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    console.log('url: ', url);

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse: ', parsedResponse);

        /* Save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
};

app.init();
