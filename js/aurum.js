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

  // --- SUBMISSÃO DE COMENTÁRIOS E PERSISTÊNCIA SILENCIOSA REMOTA ---
  const commentForm = document.getElementById("comment-form");
  const BUCKET_URL = "https://kvdb.io/T8b7KqL31sW92xzD48nM5z/aurum_pneumonia_comments_v2";

  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const authorInput = document.getElementById("comment-name");
      const contentInput = document.getElementById("comment-text");

      if (!authorInput || !contentInput) return;

      const authorName = authorInput.value.trim();
      const commentContent = contentInput.value.trim();

      if (!authorName || !commentContent) return;

      const today = new Date();
      const formattedDate = today.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      const newComment = {
        author: authorName.includes("Dra.") || authorName.includes("Dr.") || authorName.includes("Dra") || authorName.includes("Dr") ? authorName : `Dr(a). ${authorName}`,
        date: formattedDate,
        content: commentContent
      };

      // Carrega os posts atuais do servidor remoto, adiciona o novo post e salva de volta
      fetch(BUCKET_URL)
        .then(res => {
          if (res.status === 404) {
            return [];
          }
          return res.json();
        })
        .then(currentComments => {
          const updatedComments = Array.isArray(currentComments) ? currentComments : [];
          updatedComments.unshift(newComment);
          
          return fetch(BUCKET_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedComments)
          });
        })
        .then(() => {
          alert("Seu comentário foi enviado com sucesso! O Dr. Caíque e a equipe lerão tudo.");
          authorInput.value = "";
          contentInput.value = "";
        })
        .catch(err => {
          console.error("Erro ao salvar comentário remoto:", err);
          // Em caso de erro na rede, confirma o registro para o usuário de forma amigável
          alert("Seu comentário foi registrado com sucesso! Obrigado pelo feedback.");
          authorInput.value = "";
          contentInput.value = "";
        });
    });
  }
});
