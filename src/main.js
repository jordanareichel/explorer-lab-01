import "./css/index.css";
import IMask from "imask";

const creditCardBackgroundColorOne = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const creditCardBackgroundColorTwo = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const logo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  creditCardBackgroundColorOne.setAttribute("fill", colors[type][0]);
  creditCardBackgroundColorTwo.setAttribute("fill", colors[type][1]);
  logo.setAttribute("src", `cc-${type}.svg`);
}

setCardType("default");

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000"
};

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice('2'),
    }
  }
}

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:  /^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    }
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function(item) {
        return number.match(item.regex);
    });

    return foundMask; 
  }
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
})

const cardHolder = document.querySelector("#card-holder");

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = cardHolder.value.length ? cardHolder.value : 'Fulano da Silva';

})

const securityCodeMasked = IMask(securityCode, securityCodePattern);
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

cardNumberMasked.on("accept", () => { 
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length ? number : '1234 5678 9012 3456';
}

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurityCode = document.querySelector(".cc-security .value");
  ccSecurityCode.innerText = code.length ? code : '123'
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});

function updateExpirationDate(date){
  const ccExpirationDate = document.querySelector(".cc-extra .value");
  ccExpirationDate.innerText = date.length ? date : '02/32';
}

const addCard = document.querySelector("#add-card");
addCard.addEventListener("click", () => {
  alert("Cartão adicionado");
})