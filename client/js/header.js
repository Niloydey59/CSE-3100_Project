const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("mobile-navbar");
console.log("Hello from header.js");
if (bar) {
  bar.addEventListener("click", () => {
    console.log("clicked");
    nav.classList.toggle("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    console.log("clicked");
    nav.classList.toggle("active");
  });
}
