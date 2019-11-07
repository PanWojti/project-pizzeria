import {app} from '../app.js';

const photo1ClickHandler = function(event){
  event.preventDefault();
  //const clickedElement = this;

  const homeTab = document.getElementById('home');
  const orderTab = document.getElementById('order');
  //console.log('homeTab: ', homeTab);

  homeTab.classList.remove('active');
  orderTab.classList.add('active');
  //console.log('photo clicked, class active removed');
  const id = 'order';
  app.activatePage(id);
  window.location.hash = '#/' + id;
  //const articleSelector = clickedElement.getAttribute('href');
};

const photo2ClickHandler = function(event){
  event.preventDefault();
  //const clickedElement = this;

  const homeTab = document.getElementById('home');
  const bookingTab = document.getElementById('booking');
  //console.log('homeTab: ', homeTab);

  homeTab.classList.remove('active');
  bookingTab.classList.add('active');
  //console.log('photo clicked, class active removed');
  const id = 'booking';
  app.activatePage(id);
  window.location.hash = '#/' + id;
  //const articleSelector = clickedElement.getAttribute('href');
};

const dot1 = document.getElementById('dot-1');
const dot2 = document.getElementById('dot-2');
const dot3 = document.getElementById('dot-3');
const quote1 = document.getElementById('quote-1');
const quote2 = document.getElementById('quote-2');
const quote3 = document.getElementById('quote-3');

function dotsCarousel(){
  if(quote1.classList.contains('active')){
    quote1.classList.remove('active');
    quote2.classList.add('active');
    dot1.classList.remove('active');
    dot2.classList.add('active');
    //console.log('dot1 executed');
  } else if (quote2.classList.contains('active')) {
    quote2.classList.remove('active');
    quote3.classList.add('active');
    dot2.classList.remove('active');
    dot3.classList.add('active');
    //console.log('dot2 executed');
  } else if (quote3.classList.contains('active')) {
    quote3.classList.remove('active');
    quote1.classList.add('active');
    dot3.classList.remove('active');
    dot1.classList.add('active');
    //console.log('dot3 executed');
  }
}

setInterval(dotsCarousel, 3000);

document.querySelector('.photo-1').addEventListener('click', photo1ClickHandler);
document.querySelector('.photo-2').addEventListener('click', photo2ClickHandler);
