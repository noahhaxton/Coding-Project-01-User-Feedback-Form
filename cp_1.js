"use strict";

const $id = (x) => document.getElementById(x);

const wrapper = $id("page-wrapper");
const form = $id("feedback-form");
const tooltip = $id("tooltip");
const feedbackDisplay = $id("feedback-display");
const resetBtn = $id("resetBtn");

function updateCounter(id) {
  const el = $id(id);
  if (!el) return;
  const max = Number(el.getAttribute("maxlength")) || 0;
  const current = (el.value || "").length;
  const counter = document.querySelector(`[data-count-for="${id}"]`);
  if (counter) counter.textContent = max ? `${current} / ${max}` : `${current}`;
}

function isValidEmail(v) {
  return /.+@.+\..+/.test(v);
}

function stamp() {
  return new Date().toLocaleString();
}

function maskEmail(email) {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length < 2) return email;
  const [u, d] = parts;
  const masked =
    u.length <= 2
      ? u[0] + "*"
      : u[0] + "*".repeat(Math.max(0, u.length - 2)) + u[u.length - 1];
  return `${masked}@${d}`;
}

form.addEventListener("input", (e) => {
  const t = e.target;
  if (!t || !t.id) return;
  if (t.matches("#name, #email, #comments")) updateCounter(t.id);
});

form.addEventListener("mouseover", (e) => {
  const target = e.target.closest("[data-tip]");
  if (!target) return;
  const msg = target.getAttribute("data-tip");
  if (!msg) return;
  const rect = target.getBoundingClientRect();
  tooltip.textContent = msg;
  tooltip.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
  tooltip.style.top = `${rect.top + window.scrollY}px`;
  tooltip.hidden = false;
});

form.addEventListener("mouseout", (e) => {
  if (!form.contains(e.relatedTarget)) tooltip.hidden = true;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameErr = $id("name-error");
  const emailErr = $id("email-error");
  const commentsErr = $id("comments-error");
  if (nameErr) nameErr.textContent = "";
  if (emailErr) emailErr.textContent = "";
  if (commentsErr) commentsErr.textContent = "";

  const name = ($id("name")?.value || "").trim();
  const email = ($id("email")?.value || "").trim();
  const comments = ($id("comments")?.value || "").trim();

  let valid = true;

  if (!name) {
    if (nameErr) nameErr.textContent = "Name is required.";
    valid = false;
  }
  if (!email) {
    if (emailErr) emailErr.textContent = "Email is required.";
    valid = false;
  } else if (!isValidEmail(email)) {
    if (emailErr) emailErr.textContent = "Please enter a valid email.";
    valid = false;
  }
  if (!comments) {
    if (commentsErr) commentsErr.textContent = "Comments are required.";
    valid = false;
  }

  if (!valid) return;

  const item = document.createElement("article");
  item.className = "feedback-item";
  item.innerHTML = `
    <header class="feedback-head">
      <span class="feedback-name"></span>
      <span class="feedback-email"></span>
      <span class="feedback-time"></span>
    </header>
    <p class="feedback-body"></p>
  `;
  item.querySelector(".feedback-name").textContent = name;
  item.querySelector(".feedback-email").textContent = maskEmail(email);
  item.querySelector(".feedback-time").textContent = stamp();
  item.querySelector(".feedback-body").textContent = comments;
  feedbackDisplay.prepend(item);

  form.reset();
  ["name", "email", "comments"].forEach(updateCounter);
});

form.addEventListener("keydown", (e) => {
  const isSubmitCombo = (e.ctrlKey || e.metaKey) && e.key === "Enter";
  if (isSubmitCombo) {
    e.preventDefault();
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.submit();
  } else if (e.key === "Escape") {
    e.preventDefault();
    form.reset();
    ["name", "email", "comments"].forEach(updateCounter);
    ["name", "email", "comments"].forEach((id) => {
      const el = $id(id + "-error");
      if (el) el.textContent = "";
    });
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  ["name", "email", "comments"].forEach(updateCounter);
  ["name", "email", "comments"].forEach((id) => {
    const el = $id(id + "-error");
    if (el) el.textContent = "";
  });
});

wrapper.addEventListener("click", () => {});
form.addEventListener("click", (e) => e.stopPropagation());

["name", "email", "comments"].forEach(updateCounter);