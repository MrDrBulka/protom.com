// ======= 1. Переменные и константы =======
// DOM элементы
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const animatedElements = document.querySelectorAll('.animate');

// Настройки
const scrollThreshold = 50; // Порог прокрутки для изменения шапки

// ======= 2. Мобильное меню =======
/**
 * Переключает состояние мобильного меню
 */
function toggleMobileMenu() {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
  
  // Изменение иконки меню
  const icon = mobileMenuBtn.querySelector('i');
  if (icon.classList.contains('fa-bars')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
}

// ======= 3. Прокрутка шапки =======
/**
 * Обрабатывает событие прокрутки страницы
 * Добавляет класс к шапке при прокрутке
 */
function handleScroll() {
  if (window.scrollY > scrollThreshold) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Вызываем функцию анимации при скролле
  handleScrollAnimation();
}

// ======= 4. Анимация при скролле =======
/**
 * Анимирует элементы при прокрутке страницы
 * Добавляет класс 'visible' к элементам, когда они появляются в области видимости
 */
function handleScrollAnimation() {
  const triggerBottom = window.innerHeight * 0.8;
  
  animatedElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < triggerBottom) {
      element.style.opacity = '1';
    }
  });
}

// ======= 5. Плавная прокрутка к якорям =======
/**
 * Обрабатывает клики по ссылкам-якорям для плавной прокрутки
 * @param {Event} e - Событие клика
 */
function handleAnchorClick(e) {
  const href = this.getAttribute('href');
  
  // Проверяем, является ли ссылка якорем
  if (href.startsWith('#') && href.length > 1) {
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Закрываем мобильное меню, если оно открыто
      if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
      
      // Плавная прокрутка к элементу
      window.scrollTo({
        top: targetElement.offsetTop - header.offsetHeight,
        behavior: 'smooth'
      });
    }
  }
}

// ======= 6. Инициализация =======
/**
 * Инициализирует все функции при загрузке страницы
 */
function init() {
  // Обработчик для мобильного меню
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Обработчик прокрутки
  window.addEventListener('scroll', handleScroll);
  
  // Вызываем handleScroll сразу для установки начального состояния
  handleScroll();
  
  // Добавляем обработчики для ссылок-якорей
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', handleAnchorClick);
  });
  
  // Инициализация анимации при загрузке страницы
  setTimeout(handleScrollAnimation, 100);
}

// Запускаем инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', init);

// Дополнительные функции для конкретных страниц

/**
 * Инициализирует счетчики на странице О компании
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length === 0) return;
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 секунды
    const step = target / (duration / 16); // 16мс - примерно один кадр при 60fps
    
    let current = 0;
    const updateCounter = () => {
      current += step;
      
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    // Запускаем счетчик, когда элемент появляется в области видимости
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    });
    
    observer.observe(counter);
  });
}
