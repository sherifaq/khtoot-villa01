// main.js
let currentIndex = 0;
const slideDuration = 6000; // 6 ثواني لكل صورة
let progressTimer;
let slideInterval;
let progressValue = 0;

const slideA = document.getElementById('slide-a');
const slideB = document.getElementById('slide-b');
const progress = document.getElementById('progress');
const currentNumEl = document.getElementById('current-num');
const totalNumEl = document.getElementById('total-num');

// الإعداد الأولي
function initSlideshow() {
    if (galleryImages.length === 0) return;
    
    totalNumEl.innerText = galleryImages.length;
    slideA.src = galleryImages[0];
    
    // تحميل الصورة الثانية مسبقاً إذا وجدت
    if (galleryImages.length > 1) {
        slideB.src = galleryImages[1];
    }
    
    startTimers();
}

// دالة تغيير الصورة
function changeSlide(direction) {
    currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    
    // نحدد أي عنصر يحمل الكلاس active حالياً
    const activeSlide = slideA.classList.contains('active') ? slideA : slideB;
    const nextSlideElement = slideA.classList.contains('active') ? slideB : slideA;

    // تجهيز الصورة القادمة
    nextSlideElement.src = galleryImages[currentIndex];
    
    // تنفيذ التبديل (Cross-fade)
    activeSlide.classList.remove('active');
    nextSlideElement.classList.add('active');

    // تحديث العداد
    currentNumEl.innerText = currentIndex + 1;

    // إعادة تشغيل المؤقتات
    resetTimers();
}

function nextSlide() { changeSlide(1); }
function prevSlide() { changeSlide(-1); }

// إدارة شريط التقدم والتبديل التلقائي
function startTimers() {
    progressValue = 0;
    progressTimer = setInterval(() => {
        progressValue += (100 / (slideDuration / 100)); // تحديث كل 100 ملي ثانية
        progress.style.width = `${progressValue}%`;
        
        if (progressValue >= 100) {
            nextSlide();
        }
    }, 100);
}

function resetTimers() {
    clearInterval(progressTimer);
    progress.style.width = '0';
    startTimers();
}

// تشغيل السكريبت عند تحميل الصفحة
window.onload = initSlideshow;

// دالة ملء الشاشة (Fullscreen API)
function toggleFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement; // استهداف كامل الصفحة

    const requestFullScreen = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        // تفعيل ملء الشاشة
        requestFullScreen.call(docEl);
    } else {
        // إلغاء ملء الشاشة
        cancelFullScreen.call(doc);
    }
}

// تحديث الأيقونة عند تغير حالة الشاشة (استماع لأحداث المتصفح)
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('msfullscreenchange', updateFullscreenIcon);

function updateFullscreenIcon() {
    const fsIcon = document.getElementById('fs-icon');
    
    // التحقق مما إذا كانت الشاشة في وضع العرض الكامل حالياً
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    if (isFullscreen) {
        // تغيير الأيقونة إلى "تصغير الشاشة"
        fsIcon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
    } else {
        // إعادة الأيقونة إلى "تكبير الشاشة"
        fsIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
    }
}