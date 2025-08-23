// Data containing all quiz questions
const quizQuestions = {}; // We will populate this dynamically

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const qCountInput = document.getElementById("qCount");
  const dateSelectInput = document.getElementById("dateSelect");
  const topicSelect = document.getElementById("topicSelect");
  const genBtn = document.getElementById("genBtn");
  const exportBtn = document.getElementById("exportBtn");
  const printBtn = document.getElementById("printBtn");
  const questionArea = document.getElementById("questionArea");
  const paletteGrid = document.getElementById("paletteGrid");
  const resultsContainer = document.getElementById("results");
  const scoreInfo = document.getElementById("scoreInfo");
  const unansweredInfo = document.getElementById("unansweredInfo");
  const reviewBtn = document.getElementById("reviewBtn");
  const loadingOverlay = document.getElementById("loading-overlay");
  // Dashboard elements
  const totalQuestionsCount = document.getElementById("total-questions-count");
  const activeTopicsCount = document.getElementById("active-topics-count");
  const questionsAnsweredCount = document.getElementById(
    "questions-answered-count"
  );
  const questionsCorrectCount = document.getElementById(
    "questions-correct-count"
  );

  // --- State Variables ---
  let currentQuestions = [];
  let userAnswers = {};
  let currentQuestionIndex = 0;

  // --- Event Listeners ---
  genBtn.addEventListener("click", generateNewQuiz);
  exportBtn.addEventListener("click", exportQuiz);
  printBtn.addEventListener("click", () => window.print());
  reviewBtn.addEventListener("click", reviewAnswers);

  // Set the default date to today's date
  const today = new Date().toISOString().split("T")[0];
  dateSelectInput.value = today;

  // Initialize dashboard counters with initial values
  updateDashboard(0, topicSelect.value.split(",").length, 0, 0);

  // --- Functions ---

  // A mock function to simulate fetching data from the web
  // In a real application, this would involve web scraping or an API call.
  async function fetchQuestionsFromWeb(dateStr, topics) {
    console.log(
      `Fetching questions for date: ${dateStr} and topics: ${topics.join(", ")}`
    );

    // This is a placeholder for actual web scraping logic.
    // We'll use a hardcoded set of questions for demonstration.
    return new Promise((resolve) => {
      setTimeout(() => {
        const fetchedData = {
          polity: [
            {
              text: "Consider the following statements regarding the proposed 130th Constitution (Amendment) Bill, 2025:<br>1. It aims to automatically remove Union Ministers, including the Prime Minister, from office if they are placed in judicial custody for a period of 30 consecutive days.<br>2. The Bill has been referred to a Joint Committee of Parliament for detailed scrutiny.<br>3. It has been proposed as a direct response to a Supreme Court verdict on the disqualification of convicted legislators.<br>Which of the statements given above is/are correct?",
              options: [
                "a) 1 only",
                "b) 1 and 2 only",
                "c) 2 and 3 only",
                "d) 1, 2 and 3",
              ],
              correctAnswer: "b) 1 and 2 only",
              date: "2025-08-22",
            },
            {
              text: "The National Sports Governance Act, 2025, which recently received presidential assent, aims to reform governance in which of the following areas?<br>1. Bringing National Sports Federations under the ambit of the Right to Information Act, 2005.<br>2. Ensuring financial transparency and accountability in sports bodies.<br>3. Mandating a minimum number of sportspersons on the governing boards of federations.<br>4. Providing for government funding for all sports, regardless of their popularity.<br>Select the correct answer using the code given below:",
              options: [
                "a) 1 and 2 only",
                "b) 1, 2 and 3 only",
                "c) 3 and 4 only",
                "d) 1, 2, 3 and 4",
              ],
              correctAnswer: "b) 1, 2 and 3 only",
              date: "2025-08-22",
            },
            {
              text: "With reference to the Online Gaming Regulation Bill, 2025, consider the following statements:<br>1. The Bill has been passed by the Lok Sabha and awaits approval from the Rajya Sabha.<br>2. It completely bans all forms of online gaming activities in India.<br>3. It establishes a National Online Gaming Authority for regulatory oversight.<br>Which of the statements given above is/are correct?",
              options: [
                "a) 1 only",
                "b) 2 and 3 only",
                "c) 3 only",
                "d) 1 and 3 only",
              ],
              correctAnswer: "d) 1 and 3 only",
              date: "2025-08-22",
            },
            {
              text: "Which of the following is/are the key governance challenge(s) highlighted in recent debates concerning India’s nuclear energy sector?<br>1. The lack of a clear-cut policy framework for nuclear waste disposal.<br>2. The legal provision for an operator to seek recourse from a supplier in case of an accident.<br>3. The slow pace of private sector participation and foreign direct investment.<br>4. The absence of a statutory body to oversee nuclear safety.<br>Select the correct answer using the code given below:",
              options: [
                "a) 1 and 4 only",
                "b) 2 only",
                "c) 1, 2 and 3 only",
                "d) 1, 2, 3 and 4",
              ],
              correctAnswer: "c) 1, 2 and 3 only",
              date: "2025-08-22",
            },
            {
              text: 'The recent concerns regarding "Palayan Politics" in Bihar are related to which of the following governance issues?',
              options: [
                "a) The widespread political corruption leading to a flight of capital from the state.",
                "b) The migration of a large number of voters to other states, impacting voter turnout and political representation.",
                "c) A political trend of regional parties shifting alliances frequently.",
                "d) The government’s inability to repatriate citizens stranded in other states during a natural disaster.",
              ],
              correctAnswer:
                "b) The migration of a large number of voters to other states, impacting voter turnout and political representation.",
              date: "2025-08-22",
            },
            {
              text: "Who is the custodian of the Indian Constitution?",
              options: [
                "President",
                "Prime Minister",
                "Supreme Court",
                "Parliament",
              ],
              correctAnswer: "Supreme Court",
            },
            {
              text: "Which article deals with the right to freedom of speech and expression?",
              options: ["Article 19", "Article 21", "Article 22", "Article 25"],
              correctAnswer: "Article 19",
            },
          ],
          economy: [
            {
              text: "What does a 'bear market' signify?",
              options: [
                "Rising prices",
                "Falling prices",
                "Stable prices",
                "Inflation",
              ],
              correctAnswer: "Falling prices",
            },
          ],
          ir: [
            {
              text: "With reference to the recent India–China talks during Chinese Foreign Minister Wang Yi’s 2025 visit to New Delhi, consider the following statements:<br>1. Both sides agreed to resume border trade at selected points and restart direct flights.<br>2. The Kailash Manasarovar Yatra slots for Indian pilgrims were expanded.<br>3. India accepted China’s request to remove restrictions on Chinese FDI in Indian companies.<br>4. Both sides agreed to build on the 2005 “Political Parameters and Guiding Principles” for boundary settlement.<br>Which of the above statements are correct?",
              options: [
                "a) 1, 2 and 4 only",
                "b) 1 and 3 only",
                "c) 2, 3 and 4 only",
                "d) 1, 2, 3 and 4",
              ],
              correctAnswer: "a) 1, 2 and 4 only",
              date: "2025-08-23",
            },

            {
              text: "With reference to academic freedom in India, consider the following statements:<br>1. The Academic Freedom Index is published by the V-Dem Institute.<br>2. CSDS–Lokniti conducts the National Election Studies which provide empirical insights into Indian politics.<br>3. The Indian Council of Social Science Research (ICSSR) is an autonomous body under the Ministry of Education.<br>Which of the above statements are correct?",
              options: [
                "a) 1 and 2 only",
                "b) 2 and 3 only",
                "c) 1 and 3 only",
                "d) 1, 2 and 3",
              ],
              correctAnswer: "d) 1, 2 and 3",
              date: "2025-08-23",
            },

            {
              text: "With reference to the legal framework governing forest diversion and tribal rights in India, consider the following statements:<br>1. Under the Forest Rights Act (FRA), 2006, diversion of forest land for development projects can take place only after the settlement of rights and consent of Gram Sabhas concerned.<br>2. The Protection of Aboriginal Tribes Act, 1956 (PAT56) grants the administrator of the Andaman & Nicobar Islands authority to divert forest land without following the FRA process.<br>3. The Great Nicobar Island project involves the diversion of over 13,000 hectares of forest land for a transshipment port, airport, power plant, and township.<br>Which of the statements given above is/are correct?",
              options: [
                "a) 1 and 2 only",
                "b) 2 and 3 only",
                "c) 1 and 3 only",
                "d) 1, 2 and 3",
              ],
              correctAnswer: "d) 1, 2 and 3",
              date: "2025-08-23",
            },

            {
              text: "With reference to the Draft Learning Outcomes-based Curriculum Framework (LOCF) released by the University Grants Commission (UGC) in 2025, consider the following statements:<br>1. The LOCF integrates Indian knowledge systems into subjects such as anthropology, chemistry, commerce, economics, mathematics, and political science.<br>2. In commerce education, the curriculum proposes teaching insights from Kautilya’s Arthashastra and concepts of Bharatiya philosophy.<br>3. The framework prioritises multidisciplinary exploration, allocating maximum credits to courses outside the major discipline.<br>4. Ancient Indian perspectives, such as mandala geometry, temple architecture ratios, and fermented beverages like kanji and mahua, have been included in mathematics and chemistry modules.<br>Which of the statements given above is/are correct?",
              options: [
                "a) 1, 2 and 4 only",
                "b) 1 and 3 only",
                "c) 2 and 3 only",
                "d) 1, 2, 3 and 4",
              ],
              correctAnswer: "a) 1, 2 and 4 only",
              date: "2025-08-23",
            },
          ],
          environment: [
            {
              text: "The term 'carbon sequestration' refers to:",
              options: [
                "Capturing and storing CO2",
                "Release of CO2",
                "Carbon trading",
                "Reducing methane emissions",
              ],
              correctAnswer: "Capturing and storing CO2",
            },
          ],
        };
        resolve(fetchedData);
      }, 1000); // Simulate network delay
    });
  }

  async function generateNewQuiz() {
    showLoading(true);
    try {
      // Get selected topics and date
      const selectedTopicsValue = topicSelect.value;
      const activeTopics = selectedTopicsValue.split(",");
      const selectedDateStr = dateSelectInput.value;
      const qCount = parseInt(qCountInput.value, 10);

      // Fetch dynamic questions
      const fetchedQuestions = await fetchQuestionsFromWeb(
        selectedDateStr,
        activeTopics
      );

      let allQuestions = [];
      activeTopics.forEach((topic) => {
        if (fetchedQuestions[topic]) {
          allQuestions = allQuestions.concat(fetchedQuestions[topic]);
        }
      });

      currentQuestions = allQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, qCount);
      userAnswers = {};
      currentQuestionIndex = 0;

      if (currentQuestions.length === 0) {
        const messageBox = document.createElement("div");
        messageBox.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    z-index: 1000; text-align: center;
                `;
        messageBox.innerHTML = `
                    <p style="margin-bottom: 15px; font-weight: bold;">No questions found!</p>
                    <p style="font-size: 0.9rem;">Try selecting an earlier date or a different topic combination.</p>
                    <button onclick="this.parentNode.remove()" style="padding: 8px 16px; border: none; border-radius: 5px; background: var(--primary-color); color: #fff; cursor: pointer;">OK</button>
                `;
        document.body.appendChild(messageBox);
        questionArea.style.display = "none";
        return;
      }

      questionArea.style.display = "block";
      resultsContainer.style.display = "none";

      renderQuiz();
      updateDashboard(
        currentQuestions.length,
        activeTopics.length,
        Object.keys(userAnswers).length,
        0
      );
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      const messageBox = document.createElement("div");
      messageBox.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 1000; text-align: center;
            `;
      messageBox.innerHTML = `
                <p style="margin-bottom: 15px; font-weight: bold;">An error occurred while fetching questions.</p>
                <p style="font-size: 0.9rem;">Please try again later.</p>
                <button onclick="this.parentNode.remove()" style="padding: 8px 16px; border: none; border-radius: 5px; background: var(--primary-color); color: #fff; cursor: pointer;">OK</button>
            `;
      document.body.appendChild(messageBox);
    } finally {
      showLoading(false);
    }
  }

  function renderQuiz() {
    renderQuestions();
    renderPalette();
    showQuestion(0);
  }

  function renderQuestions() {
    questionArea.innerHTML = "";
    currentQuestions.forEach((q, index) => {
      const questionCard = document.createElement("div");
      questionCard.classList.add("question-card");
      questionCard.setAttribute("data-index", index);

      const questionText = document.createElement("p");
      questionText.classList.add("question-text");
      questionText.innerHTML = `${index + 1}. ${q.text}`;
      questionCard.appendChild(questionText);

      const optionsDiv = document.createElement("div");
      optionsDiv.classList.add("options");
      q.options.forEach((option, optionIndex) => {
        const optionId = `q${index}-opt${optionIndex}`;
        const optionHtml = `
                    <input type="radio" id="${optionId}" name="question${index}" value="${option}">
                    <label for="${optionId}">${option}</label>
                `;
        optionsDiv.innerHTML += optionHtml;
      });
      questionCard.appendChild(optionsDiv);

      const navButtonsDiv = document.createElement("div");
      navButtonsDiv.classList.add("question-nav-buttons");

      const prevBtn = document.createElement("button");
      prevBtn.classList.add("btn", "secondary", "prev-btn");
      prevBtn.textContent = "← Prev";
      prevBtn.addEventListener("click", () =>
        showQuestion(currentQuestionIndex - 1)
      );

      const nextBtn = document.createElement("button");
      nextBtn.classList.add("btn", "primary", "next-btn");
      nextBtn.textContent = "Next →";
      nextBtn.addEventListener("click", () =>
        showQuestion(currentQuestionIndex + 1)
      );

      const submitBtn = document.createElement("button");
      submitBtn.classList.add("btn", "primary", "submit-btn");
      submitBtn.textContent = "Submit Quiz";
      submitBtn.addEventListener("click", showResults);

      navButtonsDiv.appendChild(prevBtn);
      navButtonsDiv.appendChild(nextBtn);
      navButtonsDiv.appendChild(submitBtn);

      questionCard.appendChild(navButtonsDiv);

      questionArea.appendChild(questionCard);

      optionsDiv.addEventListener("change", (event) => {
        const selectedAnswer = event.target.value;
        userAnswers[index] = selectedAnswer;
        updatePalette(index);
        updateDashboard(
          currentQuestions.length,
          topicSelect.value.split(",").length,
          Object.keys(userAnswers).length,
          0
        ); // Update answered count
      });
    });
  }

  function renderPalette() {
    paletteGrid.innerHTML = "";
    const quizAside = document.querySelector(".quiz-aside");
    quizAside.style.display = "block";

    for (let i = 0; i < currentQuestions.length; i++) {
      const paletteItem = document.createElement("div");
      paletteItem.classList.add("palette-item");
      paletteItem.textContent = i + 1;
      paletteItem.setAttribute("data-index", i);
      paletteItem.addEventListener("click", () => showQuestion(i));
      paletteGrid.appendChild(paletteItem);
    }
  }

  function updatePalette(index) {
    const paletteItem = paletteGrid.querySelector(`[data-index='${index}']`);
    if (paletteItem) {
      paletteItem.classList.add("answered");
    }
  }

  function showQuestion(index) {
    const questionCards = questionArea.querySelectorAll(".question-card");
    if (index < 0 || index >= questionCards.length) {
      return;
    }

    questionCards.forEach((card) => (card.style.display = "none"));
    questionCards[index].style.display = "block";
    currentQuestionIndex = index;

    const prevBtn = questionCards[index].querySelector(".prev-btn");
    const nextBtn = questionCards[index].querySelector(".next-btn");
    const submitBtn = questionCards[index].querySelector(".submit-btn");

    prevBtn.style.display = index === 0 ? "none" : "block";
    nextBtn.style.display =
      index === questionCards.length - 1 ? "none" : "block";
    submitBtn.style.display =
      index === questionCards.length - 1 ? "block" : "none";
  }

  function showResults() {
    let correctCount = 0;
    let unansweredCount = 0;

    for (let i = 0; i < currentQuestions.length; i++) {
      const userAnswer = userAnswers[i];
      const correctAnswer = currentQuestions[i].correctAnswer;
      const paletteItem = paletteGrid.querySelector(`[data-index='${i}']`);

      if (userAnswer === undefined) {
        unansweredCount++;
        paletteItem.classList.remove("answered");
        paletteItem.classList.add("unanswered");
      } else if (userAnswer === correctAnswer) {
        correctCount++;
        paletteItem.classList.remove("answered");
        paletteItem.classList.add("correct");
      } else {
        paletteItem.classList.remove("answered");
        paletteItem.classList.add("incorrect");
      }
    }

    updateDashboard(
      currentQuestions.length,
      topicSelect.value.split(",").length,
      currentQuestions.length - unansweredCount,
      correctCount
    );

    questionArea.style.display = "none";
    resultsContainer.style.display = "block";
    scoreInfo.textContent = `You scored ${correctCount} out of ${currentQuestions.length}.`;
    unansweredInfo.textContent = `You left ${unansweredCount} question(s) unanswered.`;
  }

  function reviewAnswers() {
    resultsContainer.style.display = "none";
    questionArea.style.display = "block";

    const questionCards = questionArea.querySelectorAll(".question-card");
    questionCards.forEach((card, index) => {
      const question = currentQuestions[index];
      const userAnswer = userAnswers[index];
      const optionsLabels = card.querySelectorAll("label");
      const navButtons = card.querySelector(".question-nav-buttons");

      card.style.display = "block";
      navButtons.style.display = "none";

      optionsLabels.forEach((label) => {
        const optionValue = label.textContent;

        label.classList.remove("correct-answer", "incorrect-answer");

        if (optionValue === question.correctAnswer) {
          label.classList.add("correct-answer");
        }

        if (
          userAnswer &&
          optionValue === userAnswer &&
          userAnswer !== question.correctAnswer
        ) {
          label.classList.add("incorrect-answer");
        }
      });
    });
  }

  function exportQuiz() {
    const quizData = JSON.stringify(currentQuestions, null, 2);
    const blob = new Blob([quizData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "upsc-quiz.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function updateDashboard(totalQ, activeTopics, answeredQ, correctQ) {
    totalQuestionsCount.textContent = totalQ;
    activeTopicsCount.textContent = activeTopics;
    questionsAnsweredCount.textContent = answeredQ;
    questionsCorrectCount.textContent = correctQ;
  }

  function showLoading(show) {
    loadingOverlay.style.display = show ? "flex" : "none";
  }

  // Initial generation on page load
  generateNewQuiz();
});
