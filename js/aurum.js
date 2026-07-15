/* JS interativo para a Landing Page editorial da Aurum com Classroom Grid */

document.addEventListener("DOMContentLoaded", function () {
  
  // --- DADOS DAS AULAS (PLAYLIST) ---
  const classData = {
    1: {
      number: "Aula 01",
      date: "21 de Dezembro",
      title: "Pneumonia não complicada: Pneumonia adquirida na comunidade (PAC)",
      videoUrl: "https://www.youtube.com/embed/vAc6NKMxGR8?si=HSe1jlqEsXpr-U0Z",
      available: true
    },
    2: {
      number: "Aula 02",
      date: "22 de Dezembro às 21:12",
      title: "Pneumonia Complicada (PACC)",
      available: false
    },
    3: {
      number: "Aula 03",
      date: "23 de Dezembro às 21:12",
      title: "Pneumonia Atípica",
      available: false
    }
  };

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





  // --- LÓGICA DE LAZY LOAD DE VÍDEO DO YOUTUBE ---
  function loadVideo(videoId) {
    const playerSection = document.getElementById("player-section");
    if (!playerSection) return;
    
    playerSection.innerHTML = `
      <iframe id="main-classroom-video" width="100%" height="100%" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen 
        style="border: none; display: block; aspect-ratio: 16/9; border-radius: 12px; box-shadow: 0 20px 40px rgba(10, 25, 33, 0.25);">
      </iframe>
    `;
  }

  const lazyTrigger = document.getElementById("video-lazy-trigger");
  if (lazyTrigger) {
    lazyTrigger.addEventListener("click", function () {
      const videoId = this.dataset.videoId;
      loadVideo(videoId);
    });
  }

  // --- LÓGICA DE CLIQUE NA PLAYLIST VERTICAL (CLASSROOM GRID) ---
  const activeBadge = document.getElementById("active-badge");
  const activeDate = document.getElementById("active-date");
  const activeTitle = document.getElementById("active-title");
  
  const classroomCards = document.querySelectorAll(".classroom-card");
  classroomCards.forEach(card => {
    card.addEventListener("click", function () {
      const classNum = parseInt(this.dataset.class);
      
      // Caso 1: Aula 1 (Liberada)
      if (classNum === 1) {
        classroomCards.forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        
        const videoId = this.dataset.videoId || "vAc6NKMxGR8";
        const iframe = document.getElementById("main-classroom-video");
        
        if (iframe) {
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else {
          loadVideo(videoId);
        }
        
        if (activeBadge) activeBadge.textContent = classData[1].number;
        if (activeDate) activeDate.textContent = classData[1].date;
        if (activeTitle) activeTitle.textContent = classData[1].title;
        
        // Rola de volta para o player para focar no vídeo
        const playerSection = document.getElementById("player-section");
        if (playerSection) {
          playerSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      
      // Caso 2: Aulas Bloqueadas (2 e 3)
      if (classNum === 2 || classNum === 3) {
        const info = classData[classNum];
        alert(`A ${info.number} estará disponível no dia ${info.date}. Fique atento ao grupo de WhatsApp!`);
        return;
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
