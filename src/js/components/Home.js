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

document.querySelector('.photo-1').addEventListener('click', photo1ClickHandler);
document.querySelector('.photo-2').addEventListener('click', photo2ClickHandler);
