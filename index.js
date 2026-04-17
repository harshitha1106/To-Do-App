let input = document.querySelector("#task-input");
let button = document.querySelector("#add-btn");
let list = document.querySelector("#task-list");
let dateInput = document.querySelector("#due-date");
let countEl = document.querySelector("#task-count");

let tasks = [];
let currentFilter = "all";

let saved = JSON.parse(localStorage.getItem("tasks"));
if (saved) tasks = saved;

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(date) {
  if (date === "No date") return "No date";

  let today = new Date().toISOString().split("T")[0];

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = tomorrow.toISOString().split("T")[0];

  if (date === today) return "Today";
  if (date === tomorrow) return "Tomorrow";

  return date;
}

function render() {
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = "<p>No tasks yet</p>";
    return;
  }

  let today = new Date().toISOString().split("T")[0];

  tasks.forEach((t, i) => {

    if (currentFilter === "completed" && !t.completed) return;
    if (currentFilter === "pending" && t.completed) return;

    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.completed;

    let span = document.createElement("span");
    span.textContent = t.text;

    let date = document.createElement("small");
    date.textContent = formatDate(t.date);

    let del = document.createElement("button");
    del.textContent = "✖";

    // completed
    if (t.completed) span.classList.add("completed");

    checkbox.addEventListener("change", () => {
      t.completed = checkbox.checked;
      save();
      render();
    });

    // delete
    del.addEventListener("click", () => {
      tasks.splice(i, 1);
      save();
      render();
    });

    // edit
    span.addEventListener("dblclick", () => {
      let newText = prompt("Edit task:", t.text);
      if (newText && newText.trim() !== "") {
        t.text = newText;
        save();
        render();
      }
    });

    // overdue
    if (t.date !== "No date" && t.date < today && !t.completed) {
      li.classList.add("overdue");
    }

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(date);
    li.appendChild(del);

    list.appendChild(li);
  });

  let remaining = tasks.filter(t => !t.completed).length;
  countEl.textContent = remaining + " tasks remaining";
}

button.addEventListener("click", () => {
  let task = input.value;
  let date = dateInput.value || "No date";

  if (task.trim() === "") return;

  tasks.push({
    text: task,
    date: date,
    completed: false
  });

  save();
  render();

  input.value = "";
  dateInput.value = "";
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});

document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    render();
  });
});

render();