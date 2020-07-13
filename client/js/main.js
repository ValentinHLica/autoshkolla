const fs = require("fs");
const path = require("path");

if (fs.existsSync(path.join(__dirname, "./js/encrypt.js"))) {
  require("./js/encrypt.js")().then(() => {
    fs.unlinkSync(path.join(__dirname, "./js/encrypt.js"));
    fs.unlinkSync(path.join(__dirname, "./js/data.json"));
    location.reload();
  });
} else {
  require("./js/decrypt.js")().then((data) => {
    if (data.error) {
      window.close();
    }

    // Close Test
    document.querySelector("#close").addEventListener("click", () => {
      window.close();
    });

    // New Test
    document.querySelector(".new-test").addEventListener("click", () => {
      location.reload();
    });

    // Select Random Questions
    const shuffleQuestions = (arr) => {
      const newArr = [];

      while (newArr.length !== 40) {
        const random = Math.floor(Math.random() * (arr.length - 1));

        if (arr[random].pyetjet.length > 1) {
          const randomText = Math.floor(
            Math.random() * (arr[random].pyetjet.length - 1)
          );
          newArr.push({
            cover: arr[random].cover,
            text: arr[random].pyetjet[randomText],
            answear: arr[random].vlersimi[randomText] === "1" ? true : false,
            userAnswer: undefined,
          });
        } else {
          newArr.push({
            text: arr[random].pyetjet[0],
            answear: arr[random].vlersimi[0] === "1" ? true : false,
            userAnswer: undefined,
          });
        }

        arr.splice(random, 1);
      }

      return newArr;
    };
    // Selected Questions
    let Questions = shuffleQuestions(data);
    // Current Question
    let questionCounter = 0;
    // Test mode
    let testMode = 3;
    // Test Time
    let timeCounter = 40;

    // Main Element
    const rootElement = document.querySelector("#root");

    // Change Test mode
    const changeTestMode = (modeNumber, mode1, mode2) => {
      testMode = modeNumber;
      mode1.checked = false;
      mode2.checked = false;
    };

    // Create Main Page
    const createMainPage = () => {
      const mainPage = document.importNode(
        document.querySelector("#main-page-template").content,
        true
      );

      const solvedTest = mainPage.querySelector(".solved-test input");
      const helpTest = mainPage.querySelector(".help-test input");
      const normalTest = mainPage.querySelector(".normal-test input");

      solvedTest.addEventListener(
        "click",
        changeTestMode.bind(this, 1, helpTest, normalTest)
      );
      helpTest.addEventListener(
        "click",
        changeTestMode.bind(this, 2, solvedTest, normalTest)
      );
      normalTest.addEventListener(
        "click",
        changeTestMode.bind(this, 3, helpTest, solvedTest)
      );

      // Start the exam
      const button = mainPage.querySelector(".fillo-provimin");
      button.addEventListener("click", () => {
        rootElement.innerHTML = "";
        createQuestion();
        timer();
      });
      rootElement.appendChild(mainPage);
    };

    // Test Results
    const results = () => {
      rootElement.innerHTML = "";

      let right = 0;

      const finalResults = document.importNode(
        document.querySelector("#test-results-template").content,
        true
      );

      const questionList = finalResults.querySelector(".results-list");

      Questions.forEach((e, index) => {
        if (e.answear === e.userAnswer) {
          right++;
        }

        const li = document.createElement("li");
        li.classList.add("alert");

        if (e.userAnswer === undefined) {
          li.classList.add("alert-secondary");
        } else {
          if (e.answear === e.userAnswer) {
            li.classList.add("alert-success");
          } else {
            li.classList.add("alert-danger");
          }
        }

        const infoWrapper = document.importNode(
          document.querySelector("#info-wrapper-template").content,
          true
        );

        // Question Count
        infoWrapper.querySelector(".question-count").textContent = `${
          index + 1
        }.`;

        // Question Cover
        const img = infoWrapper.querySelector("img");
        if (e.cover) {
          img.setAttribute("src", `./img/${e.cover}.png`);
        } else {
          img.style.display = "none";
        }

        // Question Text
        infoWrapper.querySelector(".text").textContent = e.text;

        const buttons = infoWrapper.querySelector(".result-buttons");
        if (e.userAnswer !== undefined) {
          if (e.userAnswer === true) {
            const input = buttons.querySelector(".input-one input");
            input.checked = true;
          } else {
            const input = buttons.querySelector(".input-two input");
            input.checked = true;
          }
        }

        li.append(infoWrapper);

        questionList.appendChild(li);
      });

      finalResults.querySelector(
        ".right-answer-result span"
      ).textContent = right;

      finalResults.querySelector(".wrong-answer-result span").textContent =
        Questions.length - right;

      finalResults.querySelector(".minutat span").textContent =
        40 - timeCounter;

      const resultText = finalResults.querySelector(".final-results");
      if (Questions.length - 1 - right >= 4) {
        resultText.classList.add("btn-danger");
        resultText.textContent = "Nuk rezulton fitues";
      } else {
        resultText.classList.add("btn-success");
        resultText.textContent = "Rezulton fitues";
      }

      rootElement.appendChild(finalResults);
    };

    // Timer
    const timer = () => {
      setInterval(() => {
        if (timeCounter > 1) {
          timeCounter--;
          document.querySelector(".time-counter").textContent =
            timeCounter + " min";
        } else {
          results();
        }
      }, 60000);
    };

    // End Test Modal
    const endTest = () => {
      const finishTest = document.importNode(
        document.querySelector("#finish-test").content,
        true
      );

      finishTest.querySelector(".btn-success").addEventListener("click", () => {
        results();
      });

      finishTest.querySelector(".btn-danger").addEventListener("click", (e) => {
        document.querySelector(".finish-test").remove();
      });

      rootElement.appendChild(finishTest);
    };

    // Create Question
    const createQuestion = () => {
      rootElement.innerHTML = "";

      const questionPage = document.importNode(
        document.querySelector("#question-page-template").content,
        true
      );

      if (Questions[questionCounter].cover) {
        questionPage
          .querySelector(".question-info img")
          .setAttribute("src", `./img/${Questions[questionCounter].cover}.png`);
      } else {
        questionPage.querySelector(".question-info img").remove();
      }

      questionPage.querySelector(".question-info .question-text").textContent =
        Questions[questionCounter].text;

      questionPage.querySelector(".current").textContent = questionCounter + 1;

      questionPage.querySelector(".all").textContent = Questions.length;

      questionPage.querySelector(".time-counter").textContent =
        timeCounter + " min";

      // List all Questions
      const list = questionPage.querySelector(".question-list");

      for (let i = 0; i < Questions.length; i++) {
        const questionBox = document.createElement("li");
        const span = document.createElement("span");
        span.className = "pointer";

        if (Questions[i].userAnswer !== undefined) {
          span.classList.add("bg-info", "text-white");
        }

        questionBox.addEventListener("click", () => {
          questionCounter = i;
          createQuestion();
        });

        if (i === questionCounter) {
          span.className = "pointer bg-primary text-white";
        }

        span.textContent = i + 1;
        questionBox.appendChild(span);
        list.appendChild(questionBox);
      }

      // Next Question
      const nextButton = questionPage.querySelector(".next");

      if (questionCounter === Questions.length - 1) {
        nextButton.className =
          "btn btn-primary btn-back mb-2 paggination next pointer";
        nextButton.textContent = "Mbaro";
      } else {
        nextButton.className =
          "btn btn-primary btn-back mb-2 paggination next pointer";
      }

      nextButton.addEventListener("click", () => {
        if (questionCounter !== Questions.length - 1) {
          rootElement.innerHTML = "";
          questionCounter++;
          createQuestion();
        } else {
          endTest();
        }
      });

      // Previous Question
      const prevButton = questionPage.querySelector(".prev");

      if (questionCounter === 0) {
        prevButton.className =
          "btn btn-primary btn-back mb-2 paggination prev pointer disable-button";
      } else {
        prevButton.className =
          "btn btn-primary btn-back mb-2 paggination prev pointer";
      }

      prevButton.addEventListener("click", () => {
        if (questionCounter !== 0) {
          rootElement.innerHTML = "";
          questionCounter--;

          createQuestion();
        }
      });

      // Correct Button
      const correct = questionPage.querySelector(".sakte");

      // Wrong Button
      const wrong = questionPage.querySelector(".gabim");

      if (testMode === 1) {
        questionPage.querySelector(
          ".question-answer span"
        ).textContent = Questions[questionCounter].answear ? "Sakte" : "Gabim";
        questionPage.querySelector(".question-answer").style.display = "block";
      } else {
        questionPage.querySelector(".question-answer").style.display = "none";
      }

      // Correct Answer element Selected
      if (Questions[questionCounter].userAnswer === true) {
        correct.querySelector("input").checked = true;
      }

      correct.addEventListener("click", () => {
        Questions[questionCounter].userAnswer = true;

        if (Questions[questionCounter].userAnswer !== undefined) {
          wrong.querySelector("input").checked = false;
        }
      });

      // Wrong Answer element Selected
      if (Questions[questionCounter].userAnswer === false) {
        wrong.querySelector("input").checked = true;
      }

      wrong.addEventListener("click", () => {
        Questions[questionCounter].userAnswer = false;

        if (Questions[questionCounter].userAnswer !== undefined) {
          correct.querySelector("input").checked = false;
        }
      });

      const showAnswer = questionPage.querySelector(".show-answer");
      if (testMode === 2) {
        showAnswer.className = "btn btn-primary";

        questionPage.querySelector(
          ".question-answer span"
        ).textContent = Questions[questionCounter].answear ? "Sakte" : "Gabim";

        showAnswer.addEventListener("click", () => {
          document.querySelector(".question-answer").style.display = "block";
          document.querySelector(".question-answer").classList.add("mt-2");
        });
      } else {
        showAnswer.className = "hidden";
      }

      rootElement.appendChild(questionPage);
    };

    createMainPage();
  });
}
