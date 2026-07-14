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


  // --- ACCORDEON DE MÓDULOS (Pós-Graduação) ---
  const moduleRows = document.querySelectorAll(".aurum-module-row-dark");
  moduleRows.forEach(row => {
    row.addEventListener("click", function () {
      const isActive = this.classList.contains("active");
      
      // Fecha todos
      moduleRows.forEach(r => r.classList.remove("active"));
      
      // Abre o clicado se não estava ativo
      if (!isActive) {
        this.classList.add("active");
      }
    });
  });


  // --- LÓGICA DE CLIQUE NA PLAYLIST VERTICAL (CLASSROOM GRID) ---
  const mainVideo = document.getElementById("main-classroom-video");
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
        
        if (mainVideo) mainVideo.src = classData[1].videoUrl;
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
      
      // Caso 3: Pós-Graduação (Card 4)
      if (classNum === 4) {
        const posSection = document.getElementById("posgraduacao");
        if (posSection) {
          posSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  });





  // --- ACCORDEON DO FAQ ---
  const faqRows = document.querySelectorAll(".aurum-faq-row");
  faqRows.forEach(row => {
    const summary = row.querySelector(".aurum-faq-q");
    const answerGrid = row.querySelector(".aurum-faq-a-grid");
    const icon = row.querySelector(".faq-q-icon");

    if (summary && answerGrid && icon) {
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        
        const isOpen = answerGrid.classList.contains("is-open");
        
        if (isOpen) {
          answerGrid.classList.remove("is-open");
          icon.textContent = "add";
          row.style.backgroundColor = "";
        } else {
          answerGrid.classList.add("is-open");
          icon.textContent = "remove";
          row.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
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
      content: "Excelente aula! Essa diferenciação entre pneumonia e virose na emergência pediátrica sempre gera dúvidas nos plantões de inverno. O prontuário clínico que você colocou na comparação ilustra exatamente o que a gente vê na rotina."
    },
    {
      author: "Dr. Felipe Costa (Residente de Pediatria)",
      date: "Há 4 horas",
      content: "A didática do Dr. Caíque é insuperável. Muito esclarecedor esse checklist de sinais clínicos práticos. De fato, no plantão rápido a gente precisa de critérios objetivos de gravidade."
    },
    {
      author: "Dra. Beatriz Ramos (Médica Generalista)",
      date: "Há 6 horas",
      content: "Muitos plantonistas pecam ao pedir raio-x 'por garantia'. Ver esses conceitos explicados de forma tão direta e baseada em casos traz muita segurança para a nossa conduta imediata."
    }
  ];

  let comments = JSON.parse(localStorage.getItem("aurum_comments_original"));
  if (!comments || comments.length === 0) {
    comments = defaultComments;
    localStorage.setItem("aurum_comments_original", JSON.stringify(comments));
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
      localStorage.setItem("aurum_comments_original", JSON.stringify(comments));

      authorInput.value = "";
      contentInput.value = "";

      renderComments();
    });
  }

  renderComments();
});
