/* JS interativo para a Landing Page editorial da Aurum com Classroom Grid */

document.addEventListener("DOMContentLoaded", function () {
  
  // --- DADOS DAS AULAS (PLAYLIST / JSON COMPILADO) ---
  const classData = [
    {
      id: 1,
      number: "Aula 01",
      title: "Pneumonia adquirida na comunidade (PAC)",
      videoUrl: "https://player-vz-76b2ce95-aef.tv.pandavideo.com.br/embed/?v=d989c91e-e8be-4c4d-9270-53789a4c786f",
      releaseDate: "2026-07-21T00:00:00-03:00", // Fuso de Brasília
      displayDate: "21 de Julho"
    },
    {
      id: 2,
      number: "Aula 02",
      title: "Pneumonia Atípica",
      videoUrl: "https://player-vz-76b2ce95-aef.tv.pandavideo.com.br/embed/?v=36f601c0-6f44-4765-81f7-cc048a995365",
      releaseDate: "2026-07-23T00:00:00-03:00",
      displayDate: "23 de Julho"
    },
    {
      id: 3,
      number: "Aula 03",
      title: "Pneumonia Atípica",
      videoUrl: "https://player-vz-76b2ce95-aef.tv.pandavideo.com.br/embed/?v=577f9c84-d4ee-4b04-8666-dcd0282c758d",
      releaseDate: "2026-07-28T00:00:00-03:00",
      displayDate: "28 de Julho"
    }
  ];

  const now = new Date();

  // Função para verificar se a aula está liberada
  function isClassAvailable(classItem) {
    const releaseTime = new Date(classItem.releaseDate);
    return now >= releaseTime;
  }

  // --- ANIMAÇÃO DE ENTRADA DO HERO (Foco e Blur robusto) ---
  const titleElement = document.querySelector(".aurum-hero-h1");
  if (titleElement) {
    const text = titleElement.textContent.trim();
    titleElement.innerHTML = "";
    const words = text.split(" ");
    
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word-reveal";
      span.textContent = word + (index < words.length - 1 ? " " : "");
      titleElement.appendChild(span);
      
      setTimeout(() => {
        span.classList.add("active");
      }, 50 + index * 100);
    });
  }

  setTimeout(() => {
    const heroP = document.querySelector(".aurum-hero-p");
    if (heroP) heroP.classList.add("active");
    
    const classroom = document.querySelector(".aurum-classroom-container");
    if (classroom) classroom.classList.add("active");
  }, 400);


  // --- REVEAL ON SCROLL (IntersectionObserver) ---
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-entered");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  revealElements.forEach(el => revealObserver.observe(el));





  // --- LÓGICA DE LAZY LOAD DE VÍDEO DO PANDA VIDEO ---
  function loadVideo(videoUrl) {
    const playerSection = document.getElementById("player-section");
    if (!playerSection) return;
    
    playerSection.innerHTML = `
      <iframe id="main-classroom-video" 
        src="${videoUrl}&autoplay=true" 
        title="Panda Video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
      </iframe>
    `;
  }

  // Atualização dinâmica inicial das classes de bloqueio (locked/active) nos cards
  const classroomCards = document.querySelectorAll(".classroom-card");
  classroomCards.forEach(card => {
    const classNum = parseInt(card.dataset.class);
    const item = classData.find(c => c.id === classNum);
    
    if (item) {
      const isAvailable = isClassAvailable(item);
      const thumbOverlay = card.querySelector(".classroom-thumb-overlay");
      
      if (isAvailable) {
        card.classList.remove("locked");
        if (thumbOverlay) {
          thumbOverlay.innerHTML = `<span class="material-symbols-outlined">play_circle</span>`;
        }
      } else {
        card.classList.add("locked");
        card.classList.remove("active");
        if (thumbOverlay) {
          thumbOverlay.innerHTML = `<span class="material-symbols-outlined">lock</span>`;
        }
      }
    }
  });

  const lazyTrigger = document.getElementById("video-lazy-trigger");
  if (lazyTrigger) {
    lazyTrigger.addEventListener("click", function () {
      const firstClass = classData[0];
      if (isClassAvailable(firstClass)) {
        loadVideo(firstClass.videoUrl);
      } else {
        alert(`A ${firstClass.number} estará disponível no dia ${firstClass.displayDate}. Prepare-se!`);
      }
    });
  }

  // --- LÓGICA DE CLIQUE NA PLAYLIST VERTICAL (CLASSROOM GRID) ---
  const activeBadge = document.getElementById("active-badge");
  const activeDate = document.getElementById("active-date");
  const activeTitle = document.getElementById("active-title");
  
  classroomCards.forEach(card => {
    card.addEventListener("click", function () {
      const classNum = parseInt(this.dataset.class);
      const item = classData.find(c => c.id === classNum);
      
      if (!item) return;
      
      // Checa a liberação
      if (isClassAvailable(item)) {
        classroomCards.forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        
        const iframe = document.getElementById("main-classroom-video");
        if (iframe) {
          iframe.src = `${item.videoUrl}&autoplay=true`;
        } else {
          loadVideo(item.videoUrl);
        }
        
        if (activeBadge) activeBadge.textContent = item.number;
        if (activeDate) activeDate.textContent = item.displayDate;
        if (activeTitle) activeTitle.textContent = item.title;
        
        // Rola de volta para o player para focar no vídeo
        const playerSection = document.getElementById("player-section");
        if (playerSection) {
          playerSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        alert(`A ${item.number} estará disponível no dia ${item.displayDate}. Fique atento ao grupo de WhatsApp!`);
      }
    });
  });





  // --- ACCORDEON DO FAQ ---
  const faqRows = document.querySelectorAll(".aurum-faq-row");
  faqRows.forEach(row => {
    const questionBox = row.querySelector(".aurum-faq-q");
    const answerGrid = row.querySelector(".aurum-faq-a-grid");
    const icon = row.querySelector(".faq-q-icon");

    if (questionBox && answerGrid && icon) {
      questionBox.addEventListener("click", function () {
        const isOpen = answerGrid.classList.contains("is-open");
        
        if (isOpen) {
          answerGrid.classList.remove("is-open");
          icon.textContent = "add";
          row.classList.remove("active");
        } else {
          answerGrid.classList.add("is-open");
          icon.textContent = "remove";
          row.classList.add("active");
        }
      });
    }
  });


  // --- FEED DE COMENTÁRIOS LOCAL ---
  const commentForm = document.getElementById("comment-form");
  const commentList = document.getElementById("comment-list");
  const commentCountSpan = document.getElementById("comment-count");

  // Comentários médicos iniciais
  const defaultComments = [
    {
      author: "Dra. Mariana Silva (Pediatra)",
      date: "Há 2 horas",
      content: "Essa diferenciação prática que o Dr. Caíque fez entre pneumonia bacteriana (PAC) e virose na Aula 1 abre os olhos! Já fiz a minha matrícula na Pós-Graduação em Emergência Pediátrica e Neonatal e estou ansiosa para a simulação prática presencial. O suporte deles para tirar dúvidas dos casos de plantão no grupo é exatamente o que um médico recém-formado precisa."
    },
    {
      author: "Dr. Felipe Costa (Residente de Pediatria)",
      date: "Há 4 horas",
      content: "O checklist de sinais de gravidade da PAC que o Dr. Caíque ensinou já salvou meu plantão de ontem. O módulo de pneumonia complicada com derrame pleural (PACC) também está impecável. Essa Pós com reconhecimento UNIFATEC/MEC vale cada centavo."
    },
    {
      author: "Dra. Beatriz Ramos (Médica Generalista)",
      date: "Há 6 horas",
      content: "Sempre tive muito receio com intubação pediátrica e choque séptico. Ver a clareza da ementa e a simulação prática em manequins robóticos avançados de alta fidelidade me deu a segurança definitiva para entrar na Pós da Aurum. Dr. Caíque é sensacional!"
    }
  ];

  let comments = JSON.parse(localStorage.getItem("aurum_comments_original_v2"));
  if (!comments || comments.length === 0) {
    comments = defaultComments;
    localStorage.setItem("aurum_comments_original_v2", JSON.stringify(comments));
  }

  function getInitials(name) {
    let cleanName = name.replace(/^(dra?\.?\s*)/i, "").trim();
    const parts = cleanName.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : "DR";
  }

  function renderComments() {
    if (!commentList) return;
    commentList.innerHTML = "";
    comments.forEach(comment => {
      const initials = getInitials(comment.author);
      const item = document.createElement("div");
      item.className = "aurum-comment-item";
      item.innerHTML = `
        <div class="aurum-comment-avatar">${escapeHTML(initials)}</div>
        <div class="aurum-comment-bubble">
          <div class="aurum-comment-meta">
            <span class="aurum-comment-author">${escapeHTML(comment.author)}</span>
            <span class="aurum-comment-date">${escapeHTML(comment.date)}</span>
          </div>
          <div class="aurum-comment-content">
            ${escapeHTML(comment.content)}
          </div>
        </div>
      `;
      commentList.appendChild(item);
    });
    if (commentCountSpan) {
      commentCountSpan.textContent = comments.length;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const authorInput = document.getElementById("author-name");
      const contentInput = document.getElementById("comment-content");

      const authorName = authorInput.value.trim();
      const commentContent = contentInput.value.trim();

      if (!authorName || !commentContent) return;

      const newComment = {
        author: authorName.includes("Dra.") || authorName.includes("Dr.") ? authorName : `Dr(a). ${authorName}`,
        date: "Agora mesmo",
        content: commentContent
      };

      comments.unshift(newComment);
      localStorage.setItem("aurum_comments_original_v2", JSON.stringify(comments));

      authorInput.value = "";
      contentInput.value = "";

      renderComments();
    });
  }

  renderComments();
});
