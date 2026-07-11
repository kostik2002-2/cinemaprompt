const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(r => observer.observe(r));

const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const progress = document.getElementById('progressLine');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progressWidth = (scrollTop / docHeight) * 100;
  progress.style.width = progressWidth + '%';
});

const topBtn = document.getElementById('scrollTopBtn');

if (topBtn) {
  window.addEventListener('scroll', () => {
    if(window.scrollY > 600){
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

const COPY_PROMPT_ICON = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
<rect x="8" y="8" width="11" height="11" rx="2.5" stroke="currentColor"></rect>
<path d="M5 15V7.5A2.5 2.5 0 0 1 7.5 5H15" stroke="currentColor" stroke-linecap="round"></path>
</svg>`;
const COPY_PROMPT_CHECK = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M5.5 12.5l4.1 4.1L18.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

function resetCopyPromptButtons(exceptButton = null) {
    document.querySelectorAll('.copy-prompt-btn.copied').forEach((button) => {
        if (button !== exceptButton) {
            button.innerHTML = COPY_PROMPT_ICON;
            button.classList.remove('copied');
        }
    });
}

function copyRaw(btn) {
    const p = btn.parentElement.querySelector('p');
    const text = p ? p.innerText : '';

    navigator.clipboard.writeText(text).then(() => {
        resetCopyPromptButtons(btn);
        btn.innerHTML = COPY_PROMPT_CHECK;
        btn.classList.add('copied');
    });
}

document.addEventListener('click', function(event) {
    const clickedCopyButton = event.target.closest('.copy-prompt-btn');
    if (!clickedCopyButton) {
        resetCopyPromptButtons();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const heroArrow = document.querySelector('.hero-scroll-link');
    const firstSection = document.getElementById('iphone');

    if (heroArrow && firstSection) {
        heroArrow.addEventListener('click', function (event) {
            event.preventDefault();
            firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', '#iphone');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 180 && rect.bottom >= 180) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            const href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('nav-active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
});

function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg || !img) return;

    const fullSrc = img.getAttribute('data-full-src') || img.getAttribute('data-target-src') || img.currentSrc || img.src;
    lightboxImg.src = fullSrc;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        lightboxImg.classList.remove('scale-95', 'opacity-0');
        lightboxImg.classList.add('scale-100', 'opacity-100');
    });
}

function closeLightbox(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.classList.remove('scale-100', 'opacity-100');
    lightboxImg.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }, 180);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox(event);
    }
});

const TRANSLATIONS = window.TRANSLATIONS || {};
let currentLang = 'ru';
const originalTextNodes = new WeakMap();
function walkTextNodes(root, callback) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent || ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(callback);
}
function setLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'ru';
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-lang-button]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.langButton === currentLang);
    });
    walkTextNodes(document.body, node => {
        if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
        const original = originalTextNodes.get(node);
        const trimmed = original.trim();
        const leading = original.match(/^\s*/)[0];
        const trailing = original.match(/\s*$/)[0];
        if (currentLang === 'ru') {
            node.nodeValue = original;
        } else if (Object.prototype.hasOwnProperty.call(TRANSLATIONS, trimmed)) {
            node.nodeValue = leading + TRANSLATIONS[trimmed] + trailing;
        }
    });
    const copyText = currentLang === 'en' ? 'Copy prompt' : 'Скопировать промпт';
    const clearText = currentLang === 'en' ? 'Clear prompt' : 'Очистить промпт';
    document.querySelectorAll('[title="Скопировать промпт"], [aria-label="Скопировать промпт"]').forEach(el => {
        if (el.hasAttribute('title')) el.setAttribute('title', copyText);
        if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', copyText);
    });
    document.querySelectorAll('[title="Очистить промпт"], [aria-label="Очистить промпт"]').forEach(el => {
        if (el.hasAttribute('title')) el.setAttribute('title', clearText);
        if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', clearText);
    });
}
document.addEventListener('DOMContentLoaded', () => setLang('ru'));

(function(){
 const widget = document.getElementById('donationWidget');
 if(!widget) return;

 const lastSection = document.getElementById('fuji') || document.querySelector('main section:last-of-type');
 let donationClosed = false;

 function showDonation(){
   if(donationClosed) return;
   widget.classList.add('visible');
 }

 function checkDonationTrigger(){
   if(!lastSection || donationClosed) return;
   const rect = lastSection.getBoundingClientRect();
   const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

   if(rect.top <= viewportHeight * 0.9){
     showDonation();
     window.removeEventListener('scroll', checkDonationTrigger);
     window.removeEventListener('resize', checkDonationTrigger);
   }
 }

 window.closeDonation = function(){
   donationClosed = true;
   widget.classList.remove('visible');
 };

 window.addEventListener('scroll', checkDonationTrigger, {passive:true});
 window.addEventListener('resize', checkDonationTrigger);
 document.addEventListener('DOMContentLoaded', checkDonationTrigger);
 checkDonationTrigger();
})();

function openLegalModal(type){
    const modal = document.getElementById(type === 'privacy' ? 'privacyModal' : 'termsModal');
    if(modal) modal.classList.add('visible');
}
function closeLegalModal(event){
    if(event) event.stopPropagation();
    document.querySelectorAll('.legal-modal').forEach(modal => modal.classList.remove('visible'));
}
document.addEventListener('keydown', event => {
    if(event.key === 'Escape') closeLegalModal(event);
});

(function(){
  const btn = document.querySelector('.hero-cta-btn');
  if(!btn) return;
  const stop = () => btn.classList.add('cta-stopped');
  window.addEventListener('scroll', stop, {once:true, passive:true});
  btn.addEventListener('click', stop, {once:true});
})();

(function(){
  const smartphonePrompts = [
    "Candid mobile realism, young entrepreneur drinking coffee while checking messages, soft morning window light, modern café interior, iPhone-class smartphone camera, built-in wide lens, realistic skin texture and fabric detail, spontaneous candid gesture, natural smartphone color rendering, slight motion blur and subtle mobile sharpening artifacts",
    "Everyday lifestyle snapshot, couple laughing while cycling through city streets, bright natural daylight, authentic urban environment, smartphone camera, standard mobile optics, natural imperfect textures, captured mid-motion, balanced natural consumer color, minor lens flare and sensor noise",
    "Behind-the-scenes social content, fashion stylist adjusting clothing rack, mixed indoor ambient lighting, working studio environment, mobile phone camera, wide mobile lens, realistic material textures and skin detail, unposed natural movement, true-to-life mobile tones, slight compression artifacts"
  ];

  let currentSmartphoneSlide = 0;
  let currentSmartphonePrompt = "";
  let smartphoneSliderTimer = null;

  window.setSmartphoneSlide = function(index){
    const slides = document.querySelectorAll('.smartphone-slide');
    const dots = document.querySelectorAll('.smartphone-dot');
    if(!slides.length) return;
    currentSmartphoneSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSmartphoneSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSmartphoneSlide));
  };

  const smartphoneGalleryImages = ["assets/iphone-1.png","assets/iphone-2.png","assets/iphone-3.png"];
  let smartphoneGalleryIndex = 0;

  function showSmartphoneGalleryArrows(show){
    const prev = document.getElementById('smartphoneGalleryPrev');
    const next = document.getElementById('smartphoneGalleryNext');
    if(prev) prev.classList.toggle('visible', show);
    if(next) next.classList.toggle('visible', show);
  }

  function setSmartphoneLightboxImage(index){
    smartphoneGalleryIndex = (index + smartphoneGalleryImages.length) % smartphoneGalleryImages.length;
    const img = document.getElementById('lightbox-img');
    if(img) img.src = smartphoneGalleryImages[smartphoneGalleryIndex];
  }

  window.openSmartphoneImage = function(src){
    const index = smartphoneGalleryImages.indexOf(src);
    smartphoneGalleryIndex = index >= 0 ? index : 0;
    const img = document.querySelector(`.smartphone-slide img[src="${smartphoneGalleryImages[smartphoneGalleryIndex]}"]`);
    if(img && typeof openLightbox === 'function'){
      openLightbox(img);
      showSmartphoneGalleryArrows(true);
    }
  };

  window.smartphoneGalleryPrev = function(event){
    if(event) event.stopPropagation();
    setSmartphoneLightboxImage(smartphoneGalleryIndex - 1);
  };

  window.smartphoneGalleryNext = function(event){
    if(event) event.stopPropagation();
    setSmartphoneLightboxImage(smartphoneGalleryIndex + 1);
  };

  window.openSmartphonePrompt = function(source){
    let promptIndex = 0;

    if (source && source.nodeType === 1) {
      const slide = source.closest('.smartphone-slide[data-index]');
      promptIndex = Number(slide ? slide.dataset.index : source.dataset.index);
    } else {
      promptIndex = Number(source);
    }

    if (!Number.isFinite(promptIndex)) {
      const activeSlide = document.querySelector('.smartphone-slide.active[data-index]');
      promptIndex = Number(activeSlide ? activeSlide.dataset.index : 0);
    }

    const modal = document.getElementById('smartphonePromptModal');
    const copyBtn = document.getElementById('smartphonePromptCopyBtn');
    currentSmartphonePrompt = smartphonePrompts[promptIndex] || "";

    const text = document.getElementById('smartphonePromptModalText');
    if(text) text.textContent = currentSmartphonePrompt;

    if(copyBtn) copyBtn.classList.remove('copied');
    if(modal) modal.classList.add('visible');
  };

  window.closeSmartphonePrompt = function(event){
    if(event) event.stopPropagation();
    const modal = document.getElementById('smartphonePromptModal');
    if(modal) modal.classList.remove('visible');
  };

  window.copySmartphoneModalPrompt = function(){
    if(!currentSmartphonePrompt) return;
    navigator.clipboard.writeText(currentSmartphonePrompt).then(() => {
      const btn = document.getElementById('smartphonePromptCopyBtn');
      if(btn){
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1100);
      }
    });
  };

  function startSmartphoneSlider(){
    if(smartphoneSliderTimer) clearInterval(smartphoneSliderTimer);
    smartphoneSliderTimer = setInterval(() => {
      const modal = document.getElementById('smartphonePromptModal');
      if(modal && modal.classList.contains('visible')) return;
      window.setSmartphoneSlide(currentSmartphoneSlide + 1);
    }, 4200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.setSmartphoneSlide(0);
    startSmartphoneSlider();
  });
})();

(function(){
  const originalCloseLightbox = window.closeLightbox;
  if(typeof originalCloseLightbox === 'function' && !window.__smartphoneGalleryCloseHooked){
    window.closeLightbox = function(event){
      const prev = document.getElementById('smartphoneGalleryPrev');
      const next = document.getElementById('smartphoneGalleryNext');
      if(prev) prev.classList.remove('visible');
      if(next) next.classList.remove('visible');
      return originalCloseLightbox(event);
    };
    window.__smartphoneGalleryCloseHooked = true;
  }
})();

(function(){
  function initSmartphoneBuilder(){
    const builder = document.getElementById("smartphone-builder");
    const output = document.getElementById("smartphonePromptOutput");
    if(!builder || !output) return;

    const currentYear = new Date().getFullYear();

    const options = {
      genre: [
        "candid mobile realism",
        "everyday lifestyle photo",
        "street snapshot",
        "social media style photo",
        "documentary mobile photo"
      ],
      subject: [
        "young creator walking through the city",
        "group of friends laughing naturally",
        "traveler checking phone on a street corner",
        "person drinking coffee near a window",
        "fashion stylist working behind the scenes"
      ],
      light: [
        "natural daylight",
        "soft window light",
        "cloudy diffused daylight",
        "mixed indoor ambient light",
        "warm sunset light"
      ],
      environment: [
        "busy city street",
        "small coffee shop",
        "subway station",
        "airport terminal",
        "shopping mall corridor"
      ],
      camera: [
        `flagship smartphone photo (${currentYear})`,
        "smartphone photo (2018–2022)",
        "mobile phone photo (2013–2017)",
        "phone camera snapshot (2008–2012)",
        "early camera phone photo (2003–2007)"
      ],
      optics: [
        "wide mobile lens perspective",
        "standard phone camera perspective",
        "slightly distorted smartphone perspective",
        "close handheld mobile framing",
        "casual vertical phone framing"
      ],
      textures: [
        "natural skin texture",
        "realistic clothing texture",
        "slight digital noise",
        "subtle compression artifacts",
        "imperfect smartphone sharpness"
      ],
      motion: [
        "slight motion blur",
        "captured mid-step",
        "spontaneous candid movement",
        "handheld movement",
        "unposed natural gesture"
      ],
      color: [
        "natural smartphone color rendering",
        "slightly oversaturated mobile colors",
        "cool daylight tones",
        "warm social media tones",
        "realistic consumer photo colors"
      ],
      defects: [
        "imperfect framing",
        "slightly blown highlights",
        "digital noise",
        "minor lens flare",
        "small lens smudge"
      ]
    };

    const defaults = {
      genre: "что это за картинка",
      subject: "кто или что в кадре",
      light: "как освещена сцена",
      environment: "где происходит действие",
      camera: "эпоха смартфона",
      optics: "мобильный взгляд",
      textures: "что делает кадр живым",
      motion: "ощущение момента",
      color: "настроение картинки",
      defects: "реализм и несовершенства"
    };

    const order = ["genre","subject","light","environment","camera","optics","textures","motion","color","defects"];
    const state = {};

    function pickRandom(part){
      const variants = options[part] || [];
      if(!variants.length) return "";
      let next = variants[Math.floor(Math.random() * variants.length)];
      let guard = 0;
      while(variants.length > 1 && next === state[part] && guard < 12){
        next = variants[Math.floor(Math.random() * variants.length)];
        guard++;
      }
      return next;
    }

    function renderPrompt(){
      const values = order.map(part => state[part]).filter(Boolean);
      const emptyText = currentLang === 'en'
        ? "Click the items above to build a ready-to-use smartphone-style prompt."
        : "Нажмите на пункты выше, чтобы собрать готовый smartphone-style промпт для генерации.";
      output.textContent = values.length ? values.join(", ") : emptyText;
    }

    builder.querySelectorAll("[data-prompt-part]").forEach(button => {
      button.addEventListener("click", () => {
        const part = button.dataset.promptPart;
        const value = pickRandom(part);
        state[part] = value;

        button.classList.add("filled");
        const small = button.querySelector("small");
        if(small) small.textContent = value;

        renderPrompt();
      });
    });

    window.resetSmartphonePrompt = function(){
      Object.keys(state).forEach(key => delete state[key]);

      builder.querySelectorAll("[data-prompt-part]").forEach(button => {
        const part = button.dataset.promptPart;
        button.classList.remove("filled");
        const small = button.querySelector("small");
        if(small) small.textContent = defaults[part] || "";
      });

      renderPrompt();
    };

    function copyTextToClipboard(text){
      if(navigator.clipboard && window.isSecureContext){
        return navigator.clipboard.writeText(text);
      }

      return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
          const copied = document.execCommand('copy');
          document.body.removeChild(textarea);
          copied ? resolve() : reject(new Error('Copy command failed'));
        } catch (error) {
          document.body.removeChild(textarea);
          reject(error);
        }
      });
    }

    window.copySmartphonePrompt = function(){
      const text = (output.innerText || output.textContent || '').trim();
      if(!text) return;

      copyTextToClipboard(text).then(() => {
        const btn = document.getElementById('smartphoneCopyBtn');
        if(!btn) return;
        const copyIcon = btn.querySelector('.copy-icon');
        const checkIcon = btn.querySelector('.check-icon');
        btn.classList.add('success');
        if(copyIcon) copyIcon.classList.add('hidden');
        if(checkIcon) checkIcon.classList.remove('hidden');
        setTimeout(() => {
          btn.classList.remove('success');
          if(copyIcon) copyIcon.classList.remove('hidden');
          if(checkIcon) checkIcon.classList.add('hidden');
        }, 1100);
      }).catch(() => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(output);
        selection.removeAllRanges();
        selection.addRange(range);
      });
    };

    renderPrompt();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initSmartphoneBuilder);
  } else {
    initSmartphoneBuilder();
  }
})();

(function(){
  const btn = document.getElementById('floatingTopLeft');
  const hero = document.getElementById('top');
  if(!btn || !hero) return;

  function updateFloatingTop(){
    const heroBottom = hero.getBoundingClientRect().bottom;
    btn.classList.toggle('visible', heroBottom < window.innerHeight * 0.35);
  }

  window.addEventListener('scroll', updateFloatingTop, {passive:true});
  window.addEventListener('resize', updateFloatingTop);
  document.addEventListener('DOMContentLoaded', updateFloatingTop);
  updateFloatingTop();
})();

(function(){
  const cameraData = window.CAMERA_DATA || {};
  const order = ["genre","subject","light","environment","camera","optics","textures","motion","color","defects"];
  const defaults = {
    genre:"что это за картинка", subject:"кто или что в кадре", light:"как освещена сцена", environment:"где происходит действие",
    camera:"реальная камера", optics:"реальный объектив", textures:"что делает кадр живым", motion:"ощущение момента", color:"настроение картинки", defects:"реализм и несовершенства"
  };
  const states = {};
  let modalPrompt = "";
  const slideState = {};
  let sliderTimer = null;

  function pick(id, part){
    const arr = (((cameraData[id]||{}).options||{})[part]) || [];
    if(!arr.length) return "";
    states[id] = states[id] || {};
    let next = arr[Math.floor(Math.random()*arr.length)];
    let guard = 0;
    while(arr.length > 1 && next === states[id][part] && guard < 12){
      next = arr[Math.floor(Math.random()*arr.length)];
      guard++;
    }
    return next;
  }

  function render(id){
    const output = document.getElementById(id + "PromptOutput");
    if(!output) return;
    const st = states[id] || {};
    const values = order.map(k => st[k]).filter(Boolean);
    const placeholderMap={canon:"canon-style",leica:"leica-style",panavision:"panavision-style",nikon:"nikon-style",arri:"arri-style",hasselblad:"hasselblad-style",imax:"imax-style",sony:"sony-style",lomo:"lomography-style",fuji:"fujifilm-style"};
    const styleName = placeholderMap[id] || id + "-style";
    const emptyText = currentLang === 'en'
      ? `Click the items above to build a ready-to-use ${styleName} prompt.`
      : `Нажмите на пункты выше, чтобы собрать готовый ${styleName} промпт для генерации.`;
    output.textContent = values.length ? values.join(", ") : emptyText;
  }

  function initBuilder(id){
    const builder = document.getElementById(id + "-builder");
    if(!builder) return;
    states[id] = states[id] || {};
    builder.querySelectorAll("[data-prompt-part]").forEach(btn => {
      btn.addEventListener("click", () => {
        const part = btn.dataset.promptPart;
        const value = pick(id, part);
        states[id][part] = value;
        btn.classList.add("filled");
        const small = btn.querySelector("small");
        if(small) small.textContent = value;
        render(id);
      });
    });
    render(id);
  }

  window.resetCameraBuilder = function(id){
    states[id] = {};
    const builder = document.getElementById(id + "-builder");
    if(builder){
      builder.querySelectorAll("[data-prompt-part]").forEach(btn => {
        btn.classList.remove("filled");
        const small = btn.querySelector("small");
        if(small) small.textContent = defaults[btn.dataset.promptPart] || "";
      });
    }
    render(id);
  };

  window.copyCameraBuilderPrompt = function(id){
    const output = document.getElementById(id + "PromptOutput");
    if(!output) return;
    const text = output.textContent.trim();
    if(!text || text.startsWith("Нажмите")) return;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById(id + "CopyBtn");
      if(!btn) return;
      const copyIcon = btn.querySelector(".copy-icon");
      const checkIcon = btn.querySelector(".check-icon");
      btn.classList.add("success");
      if(copyIcon) copyIcon.classList.add("hidden");
      if(checkIcon) checkIcon.classList.remove("hidden");
      setTimeout(() => {
        btn.classList.remove("success");
        if(copyIcon) copyIcon.classList.remove("hidden");
        if(checkIcon) checkIcon.classList.add("hidden");
      }, 1100);
    });
  };

  window.setCameraSlide = function(id, index){
    const slides = document.querySelectorAll('.camera-slide[data-camera="' + id + '"]');
    const box = document.querySelector('.camera-slideshow[data-camera="' + id + '"]');
    if(!slides.length || !box) return;
    slideState[id] = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === slideState[id]));
    box.querySelectorAll(".camera-dot").forEach((dot, i) => dot.classList.toggle("active", i === slideState[id]));
  };

  window.openCameraImage = function(id, index){
    const img = document.querySelector('.camera-slide[data-camera="' + id + '"][data-index="' + index + '"] img');
    if(img && typeof openLightbox === "function") openLightbox(img);
  };

  window.openCameraPrompt = function(id, index){
    const modal = document.getElementById("cameraPromptModal");
    const text = document.getElementById("cameraPromptModalText");
    const btn = document.getElementById("cameraPromptCopyBtn");
    modalPrompt = (((cameraData[id]||{}).prompts||[])[index]) || "";
    if(text) text.textContent = modalPrompt;
    if(btn) btn.classList.remove("copied","success");
    if(modal) modal.classList.add("visible");
  };

  window.closeCameraPrompt = function(event){
    if(event) event.stopPropagation();
    const modal = document.getElementById("cameraPromptModal");
    if(modal) modal.classList.remove("visible");
  };

  window.copyCameraModalPrompt = function(){
    if(!modalPrompt) return;
    navigator.clipboard.writeText(modalPrompt).then(() => {
      const btn = document.getElementById("cameraPromptCopyBtn");
      if(btn){
        const copyIcon = btn.querySelector(".copy-icon");
        const checkIcon = btn.querySelector(".check-icon");
        btn.classList.add("success");
        if(copyIcon) copyIcon.classList.add("hidden");
        if(checkIcon) checkIcon.classList.remove("hidden");
        setTimeout(() => {
          btn.classList.remove("success");
          if(copyIcon) copyIcon.classList.remove("hidden");
          if(checkIcon) checkIcon.classList.add("hidden");
        }, 1100);
      }
    });
  };

  function startSliders(){
    if(sliderTimer) clearInterval(sliderTimer);
    sliderTimer = setInterval(() => {
      Object.keys(cameraData).forEach(id => {
        const modal = document.getElementById("cameraPromptModal");
        if(modal && modal.classList.contains("visible")) return;
        window.setCameraSlide(id, (slideState[id] || 0) + 1);
      });
    }, 5200);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", () => {
      Object.keys(cameraData).forEach(id => { slideState[id]=0; initBuilder(id); window.setCameraSlide(id,0); });
      startSliders();
    });
  } else {
    Object.keys(cameraData).forEach(id => { slideState[id]=0; initBuilder(id); window.setCameraSlide(id,0); });
    startSliders();
  }
})();

(function(){
  const originalOpen = window.openLightbox;
  if(typeof originalOpen === 'function' && !window.__lightboxBodyHooked){
    window.openLightbox = function(img){
      document.body.classList.add('lightbox-open');
      return originalOpen(img);
    };
    window.__lightboxBodyHooked = true;
  }
})();

(function(){
  const galleries = {"iphone": ["assets/iphone-1.png", "assets/iphone-2.png", "assets/iphone-3.png"], "canon": ["assets/canon-1.png", "assets/canon-2.png", "assets/canon-3.png"], "leica": ["assets/leica-1.png", "assets/leica-2.png", "assets/leica-3.png"], "panavision": ["assets/panavision-1.png", "assets/panavision-2.png", "assets/panavision-3.png"], "nikon": ["assets/nikon-1.png", "assets/nikon-2.png", "assets/nikon-3.png"], "arri": ["assets/arri-1.png", "assets/arri-2.png", "assets/arri-3.png"], "hasselblad": ["assets/hasselblad-1.png", "assets/hasselblad-2.png", "assets/hasselblad-3.png"], "imax": ["assets/imax-1.png", "assets/imax-2.png", "assets/imax-3.png"], "sony": ["assets/sony-1.png", "assets/sony-2.png", "assets/sony-3.png"], "lomo": ["assets/lomo-1.png", "assets/lomo-2.png", "assets/lomo-3.png"], "fuji": ["assets/fuji-1.png", "assets/fuji-2.png", "assets/fuji-3.png"]};
  const prompts = {
  "iphone": [
    "Candid mobile realism, young entrepreneur drinking coffee while checking messages, soft morning window light, modern café interior, iPhone-class smartphone camera, built-in wide lens, realistic skin texture and fabric detail, spontaneous candid gesture, natural smartphone color rendering, slight motion blur and subtle mobile sharpening artifacts",
    "Everyday lifestyle snapshot, couple laughing while cycling through city streets, bright natural daylight, authentic urban environment, smartphone camera, standard mobile optics, natural imperfect textures, captured mid-motion, balanced natural consumer color, minor lens flare and sensor noise",
    "Behind-the-scenes social content, fashion stylist adjusting clothing rack, mixed indoor ambient lighting, working studio environment, mobile phone camera, wide mobile lens, realistic material textures and skin detail, unposed natural movement, true-to-life mobile tones, slight compression artifacts"
  ],
  "canon": [
    "Commercial lifestyle editorial, confident female founder in tailored blazer, soft diffused key light with subtle fill, clean premium office interior, Canon-class full-frame camera, fast portrait prime lens, polished skin and textile textures, composed confident pose, warm flattering commercial color palette, near-perfect optical cleanliness",
    "Beauty campaign portrait, male skincare model with direct eye contact, controlled studio soft lighting, minimal seamless backdrop, Canon-class camera, macro portrait optics, refined skin texture detail, subtle natural head movement, rich polished commercial tones, minimal retouch artifacts",
    "Luxury family advertising photography, elegant family seated in modern living room, soft natural afternoon light, upscale residential environment, Canon-class camera, portrait zoom optics, premium fabric and skin textures, relaxed natural interaction, warm inviting brand color treatment, clean distortion-free rendering"
  ],
  "leica": [
    "Humanist street documentary, elderly musician smoking outside a club, contrasty evening street light, textured city sidewalk environment, Leica-class rangefinder camera, 35mm reportage lens, tactile skin and clothing textures with strong microcontrast, decisive candid moment, restrained cinematic monochrome palette, natural grain and slight vignette",
    "Documentary portrait, painter covered in pigment during a break, side natural daylight, authentic workshop environment, Leica-style camera, 50mm classic prime, realistic textured surfaces and skin detail, spontaneous gesture, muted analog-inspired color palette, subtle lens imperfections",
    "Street photojournalism, young woman waiting at tram stop in rain, reflected urban night lighting, European city background, Leica-class camera, compact reportage optics, tactile wet textures and realistic skin, caught mid-turn, subdued cinematic color, organic grain and atmospheric flare"
  ],
  "panavision": [
    "Cinematic narrative frame, detective entering neon motel corridor, dramatic practical lighting with deep contrast, story-rich interior environment, Panavision-class cinema camera, anamorphic cinema optics, realistic cinematic textures, dynamic forward movement, blockbuster teal-amber grade, horizontal streak flares and anamorphic oval bokeh",
    "Epic character keyframe, warrior standing in wind on industrial rooftop, hard backlight through smoke, large-scale dystopian environment, cinema camera, anamorphic lens package, gritty cinematic detail, dramatic action movement, stylized theatrical color grade, anamorphic lens artifacts",
    "Prestige action still, getaway driver gripping steering wheel in heavy rain, mixed practical neon lighting, dense urban night setting, Panavision-style digital cinema camera, anamorphic optics, realistic wet reflections and skin detail, intense motion energy, high-contrast cinematic palette, streak flare artifacts"
  ],
  "nikon": [
    "Photojournalistic realism, exhausted rescue worker after deployment, harsh overcast daylight, authentic disaster response environment, Nikon-class professional camera, telephoto reportage lens, uncompromising texture detail in clothing and skin, frozen documentary moment, neutral truthful color science, minimal post-processing artifacts",
    "Sports documentary portrait, marathon runner breathing heavily after finish, direct afternoon sunlight, crowded event environment, Nikon-class camera, 70-200 reportage optics, sweat and fabric microdetail, captured immediate post-race motion, natural editorial color, crisp technically sharp rendering",
    "Environmental documentary portrait, fisherman repairing nets by harbor, cold morning natural light, working waterfront environment, Nikon-style camera, medium telephoto lens, deeply realistic weathered textures, authentic working gesture, neutral realistic tones, no glamour retouch"
  ],
  "arri": [
    "High-end cinematic drama frame, solitary pianist in dim jazz club, layered volumetric tungsten lighting, atmospheric smoke-filled interior, ARRI-class cinema camera, premium cinema prime lens, soft filmic skin and environmental textures, elegant camera movement feeling, luxurious cinematic color grade, subtle grain and smooth highlight roll-off",
    "Prestige streaming series keyframe, queen walking through cathedral corridor, mixed moonlight and candlelight, expansive dramatic environment, ARRI-style cinema camera, signature prime optics, rich filmic detail, poised controlled movement, sophisticated cinematic palette, natural lens bloom",
    "Feature film emotional close-up, astronaut removing helmet after landing, motivated practical light, futuristic chamber environment, cinema camera, high-end prime optics, realistic skin and material textures, restrained emotional motion, polished feature-film grade, subtle film grain"
  ],
  "hasselblad": [
    "Luxury fashion editorial portrait, mature man in bespoke suit, sculpted diffused premium lighting, modern architectural villa interior, Hasselblad medium-format camera, premium portrait optics, ultra-clean skin and textile detail, composed static pose, refined natural luxury palette, minimal optical imperfections",
    "High jewelry campaign image, elegant woman with statement necklace, controlled beauty lighting, polished marble environment, medium-format camera, sharp portrait prime lens, immaculate metallic and skin textures, poised micro-movement, expensive natural color rendering, flawless medium-format clarity",
    "Architectural fashion campaign, couture model beside brutalist staircase, soft daylight through large windows, luxury architectural environment, Hasselblad-class camera, medium-format portrait optics, hyper-detailed fabric textures, deliberate editorial stance, sophisticated premium tones, clean rendering"
  ],
  "imax": [
    "Epic large-format spectacle, lone explorer standing at canyon edge, monumental sunrise lighting, colossal natural landscape, IMAX-class large-format camera, ultra-wide large-format optics, expansive environmental texture detail, slow epic movement, vast cinematic spectrum, film grain and dramatic perspective distortion",
    "Science fiction mega-scale frame, astronauts approaching massive spacecraft, cold directional cosmic light, enormous alien terrain, large-format cinema camera, ultra-wide optics, immersive environmental detail, sweeping movement, high-impact cinematic palette, large-format grain characteristics",
    "Historical epic battlefield panorama, commander overlooking thousands of troops, storm-filtered daylight, immense mountainous environment, IMAX-style camera, wide panoramic lens, textured terrain realism, grand tactical motion, rich epic tones, scale-enhancing perspective artifacts"
  ],
  "sony": [
    "Modern cyberpunk editorial portrait, nightlife creative in reflective jacket, mixed neon and LED lighting, wet urban night street, Sony-class high-sensitivity camera, fast modern prime lens, ultra-detailed digital skin and fabric textures, energetic mid-motion pose, saturated cool digital palette, controlled sensor noise",
    "Tech campaign portrait, DJ adjusting synthesizer controls, ultraviolet club lighting, underground warehouse environment, modern mirrorless cinema camera, fast autofocus optics, crisp electronic textures, active performance movement, vivid magenta-cyan grading, subtle digital artifacts",
    "Night urban fashion image, biker beside electric motorcycle, reflected signage and mixed practical light, futuristic alley environment, Sony-style camera, premium fast lens, highly resolved reflective textures, dynamic stance, cold hyper-clean digital color, controlled high-ISO grain"
  ],
  "lomo": [
    "Experimental lo-fi portrait, young artist laughing into disposable camera flash, unpredictable mixed lighting, messy apartment studio, lomography-style analog camera, cheap wide plastic optics, rough imperfect textures, accidental motion blur, wild color shifts, light leaks grain and vignette",
    "Chaotic youth snapshot, friends dancing at underground party, direct flash and ambient spill, crowded DIY venue, toy analog camera, low-fidelity lens, gritty textures, uncontrolled movement, exaggerated cross-processed color, blur and chemical artifacts",
    "Art-school documentary snapshot, skater tying shoes on sidewalk, harsh flash at dusk, raw urban environment, analog lo-fi camera, simple wide optics, imperfect real-world textures, spontaneous motion, unstable nostalgic color rendering, scratches leaks and blur"
  ],
  "fuji": [
    "Atmospheric nostalgic editorial portrait, woman reading by train window, soft diffused daylight, intimate travel environment, Fujifilm-class camera, classic prime lens, gentle filmic textures, quiet natural movement, film simulation color palette, subtle grain and softness",
    "Emotional lifestyle still, young couple in small kitchen at dawn, muted natural light, authentic domestic environment, Fujifilm-style camera, standard prime optics, tactile analog-like textures, candid interaction, warm nostalgic tones, restrained film grain",
    "Indie fashion portrait, musician on rooftop at sunset, soft ambient golden light, urban emotional backdrop, mirrorless camera with filmic rendering, classic prime lens, soft realistic textures, calm live gesture, cinematic film-simulation palette, mild analog imperfections"
  ]
};
  let activeGroup = null;
  let activeIndex = 0;
  let modalPrompt = "";

  function showArrows(show){
    const prev = document.getElementById('lightboxGalleryPrev');
    const next = document.getElementById('lightboxGalleryNext');
    if(prev) prev.classList.toggle('visible', show);
    if(next) next.classList.toggle('visible', show);
  }

  function setLightboxImage(index){
    if(!activeGroup || !galleries[activeGroup]) return;
    const arr = galleries[activeGroup];
    activeIndex = (index + arr.length) % arr.length;
    const img = document.getElementById('lightbox-img');
    if(img){
      img.src = arr[activeIndex];
      img.classList.remove('opacity-0','scale-95');
      img.classList.add('opacity-100','scale-100');
    }
  }

  window.openSectionLightbox = function(group, index){
    const arr = galleries[group];
    if(!arr) return;
    activeGroup = group;
    activeIndex = Number(index || 0);
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if(!box || !img) return;
    img.src = arr[activeIndex];
    box.classList.remove('hidden');
    document.body.classList.add('lightbox-open');
    showArrows(true);
    setTimeout(() => {
      img.classList.remove('opacity-0','scale-95');
      img.classList.add('opacity-100','scale-100');
    }, 20);
  };

  window.lightboxGalleryPrev = function(event){
    if(event) event.stopPropagation();
    setLightboxImage(activeIndex - 1);
  };
  window.lightboxGalleryNext = function(event){
    if(event) event.stopPropagation();
    setLightboxImage(activeIndex + 1);
  };

  window.openUniversalPrompt = function(group, index){
    modalPrompt = ((prompts[group] || [])[Number(index || 0)]) || "";
    if(group === 'iphone' && typeof window.openSmartphonePrompt === 'function'){
      window.openSmartphonePrompt(Number(index || 0));
      return;
    }
    if(typeof window.openCameraPrompt === 'function'){
      window.openCameraPrompt(group, Number(index || 0));
      return;
    }
  };

  document.addEventListener('click', function(event){
    const promptBtn = event.target.closest('.camera-prompt-link,.smartphone-prompt-link');
    if(promptBtn){
      event.preventDefault();
      event.stopPropagation();
      window.openUniversalPrompt(promptBtn.dataset.camera, promptBtn.dataset.index);
      return;
    }
    if(event.target.closest('button,a')) return;
    const slide = event.target.closest('.camera-slide[data-camera][data-index], .smartphone-slide[data-camera][data-index]');
    if(!slide || !slide.classList.contains('active')) return;
    event.preventDefault();
    event.stopPropagation();
    window.openSectionLightbox(slide.dataset.camera, Number(slide.dataset.index || 0));
  }, true);

  const previousClose = window.closeLightbox;
  window.closeLightbox = function(event){
    if(event) event.stopPropagation();
    showArrows(false);
    document.body.classList.remove('lightbox-open');
    activeGroup = null;
    if(typeof previousClose === 'function') return previousClose(event);
    const box = document.getElementById('lightbox');
    if(box) box.classList.add('hidden');
  };
})();

(function(){
  const FIXED_PROMPTS = window.FIXED_PROMPTS || {};

  function getIndexFromSource(source, fallback){
    if(source && source.closest){
      const slide = source.closest('.camera-slide[data-index], .smartphone-slide[data-index]');
      if(slide) return Number(slide.dataset.index || 0);
      if(source.dataset && source.dataset.index !== undefined) return Number(source.dataset.index || 0);
    }
    return Number(fallback || source || 0);
  }

  function getCameraFromSource(source, fallback){
    if(source && source.closest){
      const slide = source.closest('.camera-slide[data-camera], .smartphone-slide[data-camera]');
      if(slide) return slide.dataset.camera;
      if(source.dataset && source.dataset.camera) return source.dataset.camera;
    }
    return fallback;
  }

  function openFixedCameraPrompt(camera, index){
    const modal = document.getElementById('cameraPromptModal');
    const text = document.getElementById('cameraPromptModalText');
    const btn = document.getElementById('cameraPromptCopyBtn');
    const prompt = ((FIXED_PROMPTS[camera] || [])[Number(index || 0)]) || '';
    window.__fixedCameraModalPrompt = prompt;
    if(text) text.textContent = prompt;
    if(btn){
      btn.classList.remove('copied','success');
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      if(copyIcon) copyIcon.classList.remove('hidden');
      if(checkIcon) checkIcon.classList.add('hidden');
    }
    if(modal) modal.classList.add('visible');
  }

  const previousOpenCameraPrompt = window.openCameraPrompt;
  window.openCameraPrompt = function(cameraOrSource, index){
    const camera = getCameraFromSource(cameraOrSource, cameraOrSource);
    const idx = getIndexFromSource(cameraOrSource, index);
    if(camera && FIXED_PROMPTS[camera]){
      openFixedCameraPrompt(camera, idx);
      return;
    }
    if(typeof previousOpenCameraPrompt === 'function') return previousOpenCameraPrompt(cameraOrSource, index);
  };

  window.copyCameraModalPrompt = function(){
    const prompt = window.__fixedCameraModalPrompt || '';
    if(!prompt) return;
    navigator.clipboard.writeText(prompt).then(function(){
      const btn = document.getElementById('cameraPromptCopyBtn');
      if(!btn) return;
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      btn.classList.add('success');
      if(copyIcon) copyIcon.classList.add('hidden');
      if(checkIcon) checkIcon.classList.remove('hidden');
      setTimeout(function(){
        btn.classList.remove('success');
        if(copyIcon) copyIcon.classList.remove('hidden');
        if(checkIcon) checkIcon.classList.add('hidden');
      }, 1100);
    });
  };

  document.addEventListener('click', function(event){
    const promptLink = event.target.closest('.camera-prompt-link');
    if(promptLink){
      event.preventDefault();
      event.stopPropagation();
      window.openCameraPrompt(promptLink);
      return;
    }

    const action = event.target.closest('.camera-slide-action');
    if(action && /промпт|prompt/i.test(action.textContent || '')){
      const slide = action.closest('.camera-slide[data-camera][data-index]');
      if(slide && slide.classList.contains('active')){
        event.preventDefault();
        event.stopPropagation();
        openFixedCameraPrompt(slide.dataset.camera, Number(slide.dataset.index || 0));
      }
    }
  }, true);
})();

(function(){
  if(window.__mobileLightboxSwipeV7) return;
  window.__mobileLightboxSwipeV7 = true;

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function(){
    const lightbox = document.getElementById('lightbox');
    if(!lightbox) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    function isOpen(){
      return !lightbox.classList.contains('hidden');
    }

    function goPrev(event){
      if(typeof window.lightboxGalleryPrev === 'function') window.lightboxGalleryPrev(event);
      else if(typeof window.smartphoneGalleryPrev === 'function') window.smartphoneGalleryPrev(event);
    }

    function goNext(event){
      if(typeof window.lightboxGalleryNext === 'function') window.lightboxGalleryNext(event);
      else if(typeof window.smartphoneGalleryNext === 'function') window.smartphoneGalleryNext(event);
    }

    lightbox.addEventListener('touchstart', function(event){
      if(!isOpen() || !event.touches || event.touches.length !== 1) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startTime = Date.now();
    }, {passive:true});

    lightbox.addEventListener('touchend', function(event){
      if(!isOpen() || !event.changedTouches || event.changedTouches.length !== 1) return;
      const dx = event.changedTouches[0].clientX - startX;
      const dy = event.changedTouches[0].clientY - startY;
      const elapsed = Date.now() - startTime;
      if(Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.25 || elapsed > 900) return;
      event.preventDefault();
      event.stopPropagation();
      if(dx < 0) goNext(event);
      else goPrev(event);
    }, {passive:false});
  });
})();
