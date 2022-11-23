"use strict";
const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const invalid = document.querySelectorAll(".invalid-field");
const submitButton = document.querySelector("button[type='submit']");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body");
const modalTitle = document.querySelector(".modal-title");
const back = document.querySelector(".back-to-books");

back.addEventListener("click", () => {
  location.href = "https://nikagogelia.github.io/Book-Shop/index.html";
});

const modalToggle = () => {
  modal.classList.contains("modal-open")
    ? modal.classList.remove("modal-open")
    : modal.classList.add("modal-open");
};

const inputGroup = Array.from(inputs).filter(
  (input) => input.type === "date" || input.type === "text"
);

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
inputGroup[2].setAttribute(
  "min",
  `${currentYear}-${currentMonth + 1}-${currentDay + 1}`
);

submitButton.disabled = true;
submitButton.style = "cursor: not-allowed; opacity: 0.6;";

setInterval(
  () =>
    inputGroup.map((input) => {
      if (input.value.length > 0) {
        switch (input.id) {
          case "name":
            if (input.value.length > 4 && isNaN(input.value)) {
              invalid[0].classList.remove("invalid");
            } else {
              invalid[0].classList.add("invalid");
            }
            break;
          case "surname":
            if (input.value.length > 5 && isNaN(input.value)) {
              invalid[1].classList.remove("invalid");
            } else {
              invalid[1].classList.add("invalid");
            }
            break;
          case "date":
            if (input.value.length > 0) {
              invalid[2].classList.remove("invalid");
            } else {
              invalid[2].classList.add("invalid");
            }
            break;
          case "street":
            if (input.value.length > 5) {
              invalid[3].classList.remove("invalid");
            } else {
              invalid[3].classList.add("invalid");
            }
            break;
          case "house-number":
            if (input.value.length > 0 && !isNaN(input.value)) {
              invalid[4].classList.remove("invalid");
            } else {
              invalid[4].classList.add("invalid");
            }
            break;
          case "flat-number":
            if (
              input.value.length > 0 &&
              !isNaN(input.value) &&
              input.value[0] !== "-"
            ) {
              invalid[5].classList.remove("invalid");
            } else {
              invalid[5].classList.add("invalid");
            }
            break;
          default:
            break;
        }
      }

      if (input.value === "") {
        submitButton.disabled = true;
        submitButton.style = "cursor: not-allowed; opacity: 0.6;";
      } else {
        submitButton.disabled = false;
        submitButton.style = "cursor: pointer; opacity: 1;";
      }
    }),
  1000
);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = inputGroup.reduce(
    (acc, input) => ({ ...acc, [input.id]: input.value }),
    {}
  );

  console.log(formData);
  const { name, surname, street } = formData;
  modalTitle.innerText = "Order Completed";
  modalBody.innerHTML = `
  <h2>Customer Info</h2>
  <p><strong>Customer:</strong> ${name} ${surname}</p>
  <p><strong>Address:</strong> ${street}, ${formData["house-number"]}, ${formData["flat-number"]}</p>
  `;
});
