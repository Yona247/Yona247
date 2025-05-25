// Store the currently playing audio to stop it if another sound is triggered
let currentAudio = null;

// Function to play audio from a given source URL
function playAudio(audioSrc) {
    if (!audioSrc) {
        console.warn("No audio source provided.");
        return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Rewind to start
    }

    currentAudio = new Audio(audioSrc);
    currentAudio.play().catch(e => console.error("Error playing audio:", e));
}

// Function to speak text using Web Speech API
function speakText(text) {
    const synth = window.speechSynthesis;
    if (synth) {
        synth.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set language for better pronunciation
        utterance.rate = 0.9; // Adjust speech rate if needed
        utterance.pitch = 1; // Adjust pitch if needed
        synth.speak(utterance);
    } else {
        console.warn("Web Speech API not supported in this browser.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ====== Main navigation between sections ======
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.section;
            sections.forEach(sec => sec.classList.toggle('active', sec.id === target));
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ====== Start Learning and Start Quiz Buttons ======
    const startLearningBtn = document.getElementById('start-learning-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    startLearningBtn?.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('button[data-section="consonants"]')?.classList.add('active');
        document.getElementById('consonants')?.classList.add('active');
        document.getElementById('home')?.classList.remove('active');
    });

    startQuizBtn?.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        document.querySelector('button[data-section="quiz"]')?.classList.add('active');
        document.getElementById('quiz')?.classList.add('active');
        document.getElementById('home')?.classList.remove('active');

        document.getElementById('quiz-level-select')?.classList.remove('hidden');
        document.getElementById('quiz-question')?.classList.add('hidden');
        document.getElementById('quiz-result')?.classList.add('hidden');
        document.getElementById('quiz-review')?.classList.add('hidden');
    });

    // ====== Navigation Buttons (Next and Previous) ======
    document.querySelectorAll('.next-section-btn').forEach(button => {
        button.addEventListener('click', () => {
            const nextSectionId = button.getAttribute('data-next');
            sections.forEach(section => section.classList.remove('active'));
            navButtons.forEach(b => b.classList.remove('active'));

            const nextSection = document.getElementById(nextSectionId);
            if (nextSection) {
                nextSection.classList.add('active');
                const correspondingNavBtn = document.querySelector(`.nav-btn[data-section="${nextSectionId}"]`);
                if (correspondingNavBtn) {
                    correspondingNavBtn.classList.add('active');
                }
            }
        });
    });

    document.querySelectorAll('.prev-section-btn').forEach(button => {
        button.addEventListener('click', () => {
            const prevSectionId = button.getAttribute('data-prev');
            sections.forEach(section => section.classList.remove('active'));
            navButtons.forEach(b => b.classList.remove('active'));

            const prevSection = document.getElementById(prevSectionId);
            if (prevSection) {
                prevSection.classList.add('active');
                const correspondingNavBtn = document.querySelector(`.nav-btn[data-section="${prevSectionId}"]`);
                if (correspondingNavBtn) {
                    correspondingNavBtn.classList.add('active');
                }
            }
        });
    });

    // ====== Shuffle array function ======
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
        }

    // ====== Quiz Data per Level ======
    const quizData = {
        1: [ // Easy Level
            {
                question: "The phonetic symbol /p/ represents what type of sound?",
                answers: ["Vowel", "Consonant", "Diphthong", "Monophthong"],
                correct: 1,
                explanation: "The /p/ sound is a voiceless bilabial plosive, meaning it's a consonant produced by blocking airflow with both lips and then releasing it suddenly."
            },
            {
                question: "Which word contains the /t/ sound?",
                answers: ["Cat", "Dog", "Sun", "Run"],
                correct: 0,
                explanation: "The word 'Cat' contains the /t/ sound. It's a voiceless alveolar plosive."
            },
            {
                question: "What is the phonetic symbol for a high front vowel?",
                answers: ["/i/", "/u/", "/a/", "/e/"],
                correct: 0,
                explanation: "/i/ (as in 'sheep') is a high front vowel, meaning the tongue is high and towards the front of the mouth."
            },
            {
                question: "The /s/ sound is classified as what type of consonant?",
                answers: ["Affricate", "Nasal", "Fricative", "Plosive"],
                correct: 2,
                explanation: "The /s/ sound is a fricative, produced by forcing air through a narrow channel in the vocal tract, creating friction."
            },
            {
                question: "Which word contains the vowel sound /æ/?",
                answers: ["Cat", "Car", "Cut", "Cot"],
                correct: 0,
                explanation: "The word 'Cat' contains the /æ/ sound, which is a low front vowel."
            },
            {
                question: "What is the phonetic symbol for a high back vowel?",
                answers: ["/i/", "/u/", "/a/", "/e/"],
                correct: 1,
                explanation: "/u/ (as in 'moon') is a high back vowel, meaning the tongue is high and towards the back of the mouth."
            },
            {
                question: "Which is a voiceless plosive consonant?",
                answers: ["/b/", "/p/", "/d/", "/g/"],
                correct: 1,
                explanation: "/p/ is a voiceless plosive. The vocal cords do not vibrate when producing this sound."
            },
            {
                question: "The phonetic symbol /m/ represents which type of sound?",
                answers: ["Nasal", "Plosive", "Affricate", "Fricative"],
                correct: 0,
                explanation: "/m/ is a nasal sound, where air escapes through the nose."
            },
            {
                question: "Which of the following is a monophthong vowel sound?",
                answers: ["/aɪ/", "/eɪ/", "/ɪ/", "/aʊ/"],
                correct: 2,
                explanation: "/ɪ/ (as in 'sit') is a monophthong, a single vowel sound without a noticeable change in quality."
            },
            {
                question: "Which of the following is a diphthong vowel sound?",
                answers: ["/aɪ/", "/ɪ/", "/e/", "/u/"],
                correct: 0,
                explanation: "/aɪ/ (as in 'my') is a diphthong, a vowel sound that involves a glide from one vowel quality to another."
            }
        ],
        2: [ // Medium Level
            {
                question: "Labial consonants are produced with which part of the mouth?",
                answers: ["Tongue and palate", "Lips", "Throat", "Teeth"],
                correct: 1,
                explanation: "Labial consonants involve the use of the lips (e.g., /p/, /b/, /m/)."
            },
            {
                question: "The place of articulation for the /k/ sound is?",
                answers: ["Velar", "Alveolar", "Dental", "Glottal"],
                correct: 0,
                explanation: "The /k/ sound is a velar consonant, meaning it's produced by the back of the tongue touching the soft palate (velum)."
            },
            {
                question: "The /ʧ/ sound is classified as what?",
                answers: ["Affricate", "Plosive", "Nasal", "Fricative"],
                correct: 0,
                explanation: "/ʧ/ (as in 'chair') is an affricate, a combination of a plosive and a fricative sound."
            },
            {
                question: "The vowel /eɪ/ is classified as which type?",
                answers: ["Monophthong", "Diphthong", "Consonant", "Affricate"],
                correct: 1,
                explanation: "/eɪ/ (as in 'face') is a diphthong, a vowel sound that changes quality during its pronunciation."
            },
            {
                question: "The manner of articulation for the /f/ sound is?",
                answers: ["Plosive", "Fricative", "Nasal", "Affricate"],
                correct: 1,
                explanation: "/f/ is a fricative, produced by a continuous stream of air through a narrow opening."
            },
            {
                question: "The /ŋ/ sound is an example of which consonant type?",
                answers: ["Nasal", "Affricate", "Plosive", "Fricative"],
                correct: 0,
                explanation: "/ŋ/ (as in 'sing') is a nasal consonant, where air flows through the nasal cavity."
            },
            {
                question: "The low back vowel sound is represented by which symbol?",
                answers: ["/ɑː/", "/iː/", "/uː/", "/e/"],
                correct: 0,
                explanation: "/ɑː/ (as in 'car') is a low back vowel, with the tongue low and at the back of the mouth."
            },
            {
                question: "The phonetic symbol /ð/ represents which sound?",
                answers: ["Voiced dental", "Voiceless dental", "Affricate", "Plosive"],
                correct: 0,
                explanation: "/ð/ (as in 'this') is a voiced dental fricative, produced with the tongue against the teeth and vocal cord vibration."
            },
            {
                question: "Which of the following is a monophthong vowel?",
                answers: ["/ɪ/", "/aɪ/", "/eɪ/", "/aʊ/"],
                correct: 0,
                explanation: "/ɪ/ is a monophthong, a pure vowel sound."
            },
            {
                question: "The place of articulation for /t/ is?",
                answers: ["Alveolar", "Velar", "Glottal", "Labial"],
                correct: 0,
                explanation: "/t/ is an alveolar consonant, produced with the tongue touching the alveolar ridge (behind the front teeth)."
            }
        ],
        3: [ // Hard Level
            {
                question: "Which voiced velar plosive consonant is correct?",
                answers: ["/k/", "/g/", "/t/", "/d/"],
                correct: 1,
                explanation: "/g/ is a voiced velar plosive. 'Velar' refers to the back of the tongue touching the soft palate, and 'voiced' means vocal cords vibrate."
            },
            {
                question: "The /θ/ sound is an example of which consonant?",
                answers: ["Voiceless dental", "Voiced dental", "Nasal", "Affricate"],
                correct: 0,
                explanation: "/θ/ (as in 'thin') is a voiceless dental fricative. 'Voiceless' means no vocal cord vibration, and 'dental' means tongue against teeth."
            },
            {
                question: "In phonology, the process of removing sounds is called?",
                answers: ["Assimilation", "Elimination", "Elision", "Reduction"],
                correct: 2,
                explanation: "Elision is the omission of a sound or syllable in speech (e.g., 'camera' often pronounced without the middle 'e')."
            },
            {
                question: "Sounds produced with vibrating vocal cords are called?",
                answers: ["Voiced", "Voiceless", "Plosive", "Affricate"],
                correct: 0,
                explanation: "Voiced sounds are those where the vocal cords vibrate during their production."
            },
            {
                question: "Consonants produced with partial obstruction of airflow are called?",
                answers: ["Fricatives", "Plosives", "Nasals", "Affricates"],
                correct: 0,
                explanation: "Fricatives involve a partial obstruction, creating turbulent airflow and a 'hissing' sound."
            },
            {
                question: "The IPA symbol /ʃ/ represents which sound?",
                answers: ["Voiceless postalveolar fricative", "Voiced affricate", "Plosive", "Nasal"],
                correct: 0,
                explanation: "/ʃ/ (as in 'she') is a voiceless postalveolar fricative, produced behind the alveolar ridge without vocal cord vibration."
            },
            {
                question: "What term describes vowel sounds that change within a word?",
                answers: ["Diphthong", "Monophthong", "Reduction", "Elision"],
                correct: 0,
                explanation: "A diphthong is a single vowel sound that changes quality as it is pronounced, moving from one vowel position to another."
            },
            {
                question: "The IPA symbol for the 'sh' sound in 'shoe' is?",
                answers: ["/ʃ/", "/ʒ/", "/θ/", "/ð/"],
                correct: 0,
                explanation: "The 'sh' sound in 'shoe' is represented by the IPA symbol /ʃ/."
            },
            {
                question: "The consonant /ʤ/ is classified as?",
                answers: ["Voiced affricate", "Voiceless plosive", "Nasal", "Fricative"],
                correct: 0,
                explanation: "/ʤ/ (as in 'judge') is a voiced postalveolar affricate, combining a stop and a fricative with vocal cord vibration."
            },
            {
                question: "Which vowel sound is produced with a high back tongue position?",
                answers: ["/u/", "/i/", "/a/", "/e/"],
                correct: 0,
                explanation: "/u/ (as in 'boot') is a high back vowel, where the tongue is raised high and retracted towards the back of the mouth."
            }
        ]
    };

    // ====== DOM Elements ======
    const levelSelect = document.getElementById('quiz-level-select');
    const questionContainer = document.getElementById('quiz-question');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const currentQuestionFeedback = document.getElementById('current-question-feedback');
    const feedbackTitle = currentQuestionFeedback.querySelector('.feedback-title');
    const feedbackText = currentQuestionFeedback.querySelector('.feedback-text');
    const nextBtn = document.getElementById('next-question-btn');
    const quizResult = document.getElementById('quiz-result');
    const scoreText = document.getElementById('score-text');
    const restartBtn = document.getElementById('restart-quiz-btn');
    const reviewQuizBtn = document.getElementById('review-quiz-btn');
    const quizReviewSection = document.getElementById('quiz-review');
    const reviewList = document.getElementById('review-list');
    const backToLevelsFromReviewBtn = document.getElementById('back-to-levels-from-review');

    // ====== Quiz State ======
    let currentLevel = null;
    let currentQuestionIndex = 0;
    let score = 0;
    let quizQuestions = [];
    let incorrectQuestions = [];

    // ====== Start Quiz Function ======
    function startQuiz(level) {
        currentLevel = level;
        quizQuestions = shuffleArray([...quizData[level]]);
        currentQuestionIndex = 0;
        score = 0;
        incorrectQuestions = [];

        levelSelect.classList.add('hidden');
        quizResult.classList.add('hidden');
        quizReviewSection.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        reviewQuizBtn.classList.add('hidden');
        currentQuestionFeedback.classList.add('hidden');
        currentQuestionFeedback.classList.remove('correct-feedback', 'incorrect-feedback');

        showQuestion();
    }

    // ====== Show Question Function ======
    function showQuestion() {
        clearAnswers();
        nextBtn.classList.add('hidden');
        currentQuestionFeedback.classList.add('hidden');
        currentQuestionFeedback.classList.remove('correct-feedback', 'incorrect-feedback');

        const currentQ = quizQuestions[currentQuestionIndex];
        questionText.textContent = currentQ.question;

        currentQ.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => selectAnswer(index));
            answerOptions.appendChild(btn);
        });
    }

    // ====== Clear Answers ======
    function clearAnswers() {
        answerOptions.innerHTML = '';
    }

    // ====== Select Answer ======
    function selectAnswer(selectedIndex) {
        const currentQ = quizQuestions[currentQuestionIndex];
        let isCorrect = (selectedIndex === currentQ.correct);

        // Disable all buttons after answer
        Array.from(answerOptions.children).forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === currentQ.correct) {
                btn.classList.add('correct');
            }
            if (idx === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        if (isCorrect) {
            score++;
            feedbackTitle.textContent = "Correct!";
            feedbackText.textContent = currentQ.explanation;
            currentQuestionFeedback.classList.add('correct-feedback');
            currentQuestionFeedback.classList.remove('incorrect-feedback');
        } else {
            feedbackTitle.textContent = "Incorrect!";
            feedbackText.innerHTML = `The correct answer was: <strong>${currentQ.answers[currentQ.correct]}</strong>. ${currentQ.explanation}`;
            currentQuestionFeedback.classList.add('incorrect-feedback');
            currentQuestionFeedback.classList.remove('correct-feedback');
            incorrectQuestions.push({
                question: currentQ.question,
                selectedAnswer: currentQ.answers[selectedIndex],
                correctAnswer: currentQ.answers[currentQ.correct],
                explanation: currentQ.explanation
            });
        }
        currentQuestionFeedback.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }

    // ====== Show Result ======
    function showResult() {
        questionContainer.classList.add('hidden');
        quizResult.classList.remove('hidden');
        scoreText.textContent = `You scored ${score} out of ${quizQuestions.length}.`;

        if (incorrectQuestions.length > 0) {
            reviewQuizBtn.classList.remove('hidden');
        } else {
            reviewQuizBtn.classList.add('hidden');
        }
    }

    // ====== Show Review Function (for overall incorrect answers) ======
    function showReview() {
        quizResult.classList.add('hidden');
        quizReviewSection.classList.remove('hidden');
        reviewList.innerHTML = '';

        if (incorrectQuestions.length === 0) {
            reviewList.innerHTML = '<p>Great job! You answered all questions correctly!</p>';
            return;
        }

        incorrectQuestions.forEach((item, index) => {
            const reviewItemDiv = document.createElement('div');
            reviewItemDiv.className = 'review-item';
            reviewItemDiv.innerHTML = `
                <p class="question-text"><strong>Question ${index + 1}:</strong> ${item.question}</p>
                <p>Your Answer: <span class="your-answer">${item.selectedAnswer}</span></p>
                <p>Correct Answer: <span class="correct-answer">${item.correctAnswer}</span></p>
                ${item.explanation ? `<p class="explanation"><strong>Explanation:</strong> ${item.explanation}</p>` : ''}
            `;
            reviewList.appendChild(reviewItemDiv);
        });
    }

    // ====== Event Listeners ======
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLevel = parseInt(btn.dataset.level);
            startQuiz(selectedLevel);
        });
    });

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    restartBtn.addEventListener('click', () => {
        quizResult.classList.add('hidden');
        levelSelect.classList.remove('hidden');
    });

    reviewQuizBtn.addEventListener('click', () => {
        showReview();
    });

    backToLevelsFromReviewBtn.addEventListener('click', () => {
        quizReviewSection.classList.add('hidden');
        levelSelect.classList.remove('hidden');
    });

    // Add click listeners to individual example words for sound
    document.querySelectorAll('.phoneme-example .example-word-clickable').forEach(wordSpan => {
        wordSpan.addEventListener('click', (event) => {
            event.stopPropagation();
            const word = wordSpan.querySelector('.example-word-text')?.textContent.trim() || wordSpan.textContent.trim();
            speakText(word);
        });
    });

    // Add click listeners to phonetic symbols for sound
    document.querySelectorAll('.phoneme-symbol').forEach(symbolDiv => {
        symbolDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            const audioSrc = symbolDiv.dataset.audio;
            const isPlaceholder = audioSrc && audioSrc.startsWith("URL_AUDIO_");

            if (audioSrc && !isPlaceholder) {
                playAudio(audioSrc);
            } else {
                const symbol = symbolDiv.firstChild.textContent.trim();
                speakText(symbol);
            }
        });
    });

    // Toggle category description visibility
    document.querySelectorAll('.consonant-category h3, .vowel-category h3').forEach(heading => {
        heading.addEventListener('click', () => {
            const description = heading.nextElementSibling;
            if (description && description.classList.contains('category-description')) {
                description.classList.toggle('hidden');
            }
        });
    });
});
