/**
 * Maharashtra: Unity in Diversity 2026
 * Interactive State Quiz Engine
 * Department of Artificial Intelligence & Data Science
 */

class MaharashtraQuiz {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.totalQuestions = 10;
    this.selectedPool = [];
    this.answered = false;

    this.container = document.getElementById('quizContainer');
    this.startScreen = document.getElementById('quizStart');
    this.playScreen = document.getElementById('quizPlay');
    this.resultScreen = document.getElementById('quizResult');

    this.progressBar = document.getElementById('quizProgressBar');
    this.questionCountEl = document.getElementById('quizQuestionCount');
    this.questionTextEl = document.getElementById('quizQuestionText');
    this.optionsContainer = document.getElementById('quizOptions');
    this.explanationEl = document.getElementById('quizExplanation');
    this.nextBtn = document.getElementById('quizNextBtn');

    this.init();
  }

  async init() {
    try {
      const res = await fetch('data/quiz.json');
      this.questions = await res.json();
    } catch (e) {
      console.warn('Quiz questions fallback:', e);
      this.questions = [
        {
          question: "When was Maharashtra formed?",
          options: ["15 August 1947", "1 May 1960", "26 January 1950", "1 November 1956"],
          answer: 1,
          explanation: "Maharashtra was formed on 1 May 1960."
        }
      ];
    }

    const startBtn = document.getElementById('quizStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    const restartBtn = document.getElementById('quizRestartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startQuiz());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.handleNext());
    }
  }

  startQuiz() {
    if (!this.questions.length) return;

    const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
    this.selectedPool = shuffled.slice(0, Math.min(this.totalQuestions, shuffled.length));

    this.currentIndex = 0;
    this.score = 0;

    if (this.startScreen) this.startScreen.style.display = 'none';
    if (this.resultScreen) this.resultScreen.classList.remove('show');
    if (this.playScreen) this.playScreen.style.display = 'block';

    this.renderQuestion();
  }

  renderQuestion() {
    this.answered = false;
    const q = this.selectedPool[this.currentIndex];

    const progressPct = ((this.currentIndex) / this.selectedPool.length) * 100;
    if (this.progressBar) this.progressBar.style.width = `${progressPct}%`;

    if (this.questionCountEl) {
      this.questionCountEl.textContent = `Question ${this.currentIndex + 1} of ${this.selectedPool.length}`;
    }

    if (this.questionTextEl) {
      this.questionTextEl.textContent = q.question;
    }

    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.innerHTML = `
          <div class="option-letter">${letters[idx]}</div>
          <div class="option-text">${optText}</div>
        `;
        btn.addEventListener('click', () => this.handleOptionClick(btn, idx));
        this.optionsContainer.appendChild(btn);
      });
    }

    if (this.explanationEl) {
      this.explanationEl.classList.remove('show');
      this.explanationEl.textContent = '';
    }
    if (this.nextBtn) {
      this.nextBtn.classList.remove('show');
    }
  }

  handleOptionClick(clickedBtn, selectedIndex) {
    if (this.answered) return;
    this.answered = true;

    const q = this.selectedPool[this.currentIndex];
    const isCorrect = selectedIndex === q.answer;

    if (isCorrect) {
      this.score++;
      clickedBtn.classList.add('correct');
    } else {
      clickedBtn.classList.add('wrong');
      const options = this.optionsContainer.querySelectorAll('.quiz-option');
      if (options[q.answer]) {
        options[q.answer].classList.add('correct');
      }
    }

    this.optionsContainer.querySelectorAll('.quiz-option').forEach(el => {
      el.classList.add('disabled');
    });

    if (this.explanationEl) {
      this.explanationEl.innerHTML = `<strong>${isCorrect ? 'Correct / बरोबर' : 'Incorrect / चूक'}</strong><br>${q.explanation}`;
      this.explanationEl.classList.add('show');
    }

    if (this.nextBtn) {
      this.nextBtn.textContent = this.currentIndex === this.selectedPool.length - 1 ? 'See Final Score →' : 'Next Question →';
      this.nextBtn.classList.add('show');
    }
  }

  handleNext() {
    if (this.currentIndex < this.selectedPool.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    if (this.playScreen) this.playScreen.style.display = 'none';
    if (this.progressBar) this.progressBar.style.width = '100%';

    let title = '';
    let msg = '';
    const ratio = this.score / this.selectedPool.length;

    if (ratio === 1) {
      title = 'Maharashtra Maestro';
      msg = 'Outstanding! You demonstrated mastery of Maharashtra’s history, heritage, and achievements.';
    } else if (ratio >= 0.8) {
      title = 'Sahyadri Scholar';
      msg = 'Commendable score! You have strong command over the state’s culture and milestones.';
    } else if (ratio >= 0.5) {
      title = 'Maratha Explorer';
      msg = 'Good attempt! Explore our exhibition stall to discover more fascinating stories.';
    } else {
      title = 'Curious Wanderer';
      msg = 'A great learning start! Browse the website modules and stall displays to explore further.';
    }

    const scoreNum = document.getElementById('quizScoreNumber');
    const scoreTotal = document.getElementById('quizScoreTotal');
    const scoreTitle = document.getElementById('quizScoreTitle');
    const scoreMessage = document.getElementById('quizScoreMessage');

    if (scoreNum) scoreNum.textContent = this.score;
    if (scoreTotal) scoreTotal.textContent = `out of ${this.selectedPool.length}`;
    if (scoreTitle) scoreTitle.textContent = title;
    if (scoreMessage) scoreMessage.textContent = msg;

    if (this.resultScreen) this.resultScreen.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new MaharashtraQuiz();
});
