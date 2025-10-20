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
