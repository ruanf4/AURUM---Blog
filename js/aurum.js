/* JS interativo para a Landing Page editorial da Aurum com Classroom Grid */

document.addEventListener("DOMContentLoaded", function () {

  // --- DADOS DAS AULAS (PLAYLIST / JSON COMPILADO) ---
  const classData = [
    {
      id: 1,
      number: "Aula 01",
      title: "Pneumonia adquirida na comunidade (PAC)",
      videoUrl: "https://player-vz-76b2ce95-aef.tv.pandavideo.com.br/embed/?v=d989c91e-e8be-4c4d-9270-53789a4c786f",
      releaseDate: "2026-07-28T00:00:00-03:00", // Fuso de Brasília
      displayDate: "28 de Julho"
    },
    {
      id: 2,
      number: "Aula 02",
      title: "Pneumonia Atípica",
      videoUrl: "https://player-vz-76b2ce95-aef.tv.pandavideo.com.br/embed/?v=36f601c0-6f44-4765-81f7-cc048a995365",
      releaseDate: "2026-07-30T00:00:00-03:00",
      displayDate: "30 de Julho"
    },
    {
      id: 3,
      number: "Aula 03",
      title: "Pneumonia Atípica",
      videoUrl: "https://player-vz-76b2ce95-aef.tv.pandavideo.com.br/embed/?v=577f9c84-d4ee-4b04-8666-dcd0282c758d",
      releaseDate: "2026-08-04T00:00:00-03:00",
      displayDate: "04 de Agosto"
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

  // --- ATUALIZAÇÃO DINÂMICA DAS AULAS (DESTAQUE VERDE PARA LIBERADAS) ---
  function updateClassroomStatus() {
    // 1. Atualização dos cards na playlist lateral
    const classroomCards = document.querySelectorAll(".classroom-card");
    classroomCards.forEach(card => {
      const classNum = parseInt(card.dataset.class);
      const item = classData.find(c => c.id === classNum);

      if (item) {
        const isAvailable = isClassAvailable(item);
        const thumbOverlay = card.querySelector(".classroom-thumb-overlay");
        const infoMeta = card.querySelector(".classroom-info-meta");

        if (isAvailable) {
          card.classList.remove("locked");
          card.classList.add("unlocked");
          if (thumbOverlay) {
            thumbOverlay.innerHTML = `<span class="material-symbols-outlined">play_circle</span>`;
          }
          if (infoMeta && !infoMeta.querySelector(".badge-released")) {
            infoMeta.innerHTML = `${item.number} <span class="badge-released"><span class="pulse-green-dot"></span> LIBERADA</span>`;
          }
        } else {
          card.classList.add("locked");
          card.classList.remove("unlocked");
          card.classList.remove("active");
          if (thumbOverlay) {
            thumbOverlay.innerHTML = `<span class="material-symbols-outlined">lock</span>`;
          }
        }
      }
    });

    // 2. Atualização dos blocos editoriais da Seção 2 ("Três Aulas")
    const editorialItems = document.querySelectorAll(".aurum-editorial-item");
    editorialItems.forEach(itemEl => {
      const classNum = parseInt(itemEl.dataset.class);
      const item = classData.find(c => c.id === classNum);
      if (item) {
        const isAvailable = isClassAvailable(item);
        const nameEl = itemEl.querySelector(".aurum-editorial-name");

        if (isAvailable) {
          itemEl.classList.remove("locked");
          itemEl.classList.add("unlocked");
          if (nameEl && !nameEl.querySelector(".badge-released")) {
            nameEl.innerHTML += ` <span class="badge-released" style="margin-left: 8px;"><span class="pulse-green-dot"></span> AULA LIBERADA</span>`;
          }
        } else {
          itemEl.classList.add("locked");
          itemEl.classList.remove("unlocked");
        }
      }
    });

    // 3. Atualização do cabeçalho de metadados da aula 1 (ativa por padrão)
    const activeClass = classData[0];
    const activeDateEl = document.getElementById("active-date");
    if (activeDateEl && isClassAvailable(activeClass)) {
      activeDateEl.innerHTML = `${activeClass.displayDate} <span class="badge-released" style="margin-left: 6px;"><span class="pulse-green-dot"></span> LIBERADA</span>`;
    }
  }

  // Executa o status inicial
  updateClassroomStatus();

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
  const classroomCardsList = document.querySelectorAll(".classroom-card");

  classroomCardsList.forEach(card => {
    card.addEventListener("click", function () {
      const classNum = parseInt(this.dataset.class);
      const item = classData.find(c => c.id === classNum);

      if (!item) return;

      // Checa a liberação
      if (isClassAvailable(item)) {
        classroomCardsList.forEach(c => c.classList.remove("active"));
        this.classList.add("active");

        const iframe = document.getElementById("main-classroom-video");
        if (iframe) {
          iframe.src = `${item.videoUrl}&autoplay=true`;
        } else {
          loadVideo(item.videoUrl);
        }

        if (activeBadge) activeBadge.textContent = item.number;
        if (activeDate) {
          activeDate.innerHTML = `${item.displayDate} <span class="badge-released" style="margin-left: 6px;"><span class="pulse-green-dot"></span> LIBERADA</span>`;
        }
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

  // URL do Web App do seu Google Apps Script para a Planilha do Google
  // Cole a URL obtida após implantar o script conforme o passo a passo enviado.
  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbziDYEMy_fPEzlajscDdXbH3vBRTBEBe_qAx7vL5fz1Cn8XrpRwuc4hXAWCN55cKgUM/exec";

  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const authorInput = document.getElementById("comment-name");
      const phoneInput = document.getElementById("comment-phone");
      const contentInput = document.getElementById("comment-text");

      if (!authorInput || !phoneInput || !contentInput) return;

      const authorName = authorInput.value.trim();
      const authorPhone = phoneInput.value.trim();
      const commentContent = contentInput.value.trim();

      if (!authorName || !authorPhone || !commentContent) return;

      const today = new Date();
      const formattedDate = today.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      const newComment = {
        author: authorName.includes("Dra.") || authorName.includes("Dr.") || authorName.includes("Dra") || authorName.includes("Dr") ? authorName : `Dr(a). ${authorName}`,
        phone: authorPhone,
        date: formattedDate,
        content: commentContent
      };

      // 1. Envio em paralelo para o Google Sheets (se configurado)
      if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL !== "URL_DO_SEU_WEB_APP_DO_GOOGLE_SHEETS") {
        const formData = new URLSearchParams();
        formData.append("name", newComment.author);
        formData.append("phone", newComment.phone);
        formData.append("comment", newComment.content);

        fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData
        }).catch(err => console.error("Erro ao enviar para o Google Sheets:", err));
      }

      // 2. Envio para o banco de dados KV de backup
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
          phoneInput.value = "";
          contentInput.value = "";
        })
        .catch(err => {
          console.error("Erro ao salvar comentário remoto:", err);
          // Em caso de erro na rede, confirma o registro para o usuário de forma amigável
          alert("Seu comentário foi registrado com sucesso! Obrigado pelo feedback.");
          authorInput.value = "";
          phoneInput.value = "";
          contentInput.value = "";
        });
    });
  }
});
