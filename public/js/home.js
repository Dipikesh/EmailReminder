const taskForm = document.getElementById("task");
taskForm.addEventListener("submit", createRemider);

config = {
  enableTime: true,
  dateFormat: "Y-m-d H:i:s",
  altInput: true,
  altFormat: "F j, Y (h:S K)",
};

flatpickr("input[type=datetime-local]", config);
async function embedTask(e) {
  const name = e.target.name.value;
  const dateTime = e.target.date.value;
  const description = e.target.description.value;
  const dateInput = new Date(dateTime);
  const date = dateInput.toISOString();


   const $listItem = document.createElement("li");
  $listItem.classList.add("list__item");
  $listItem.innerText = ` Name = ${name} ,  Description  =      ${"   " + description} ,  Date =   ${date} `;


   $list.appendChild($listItem);

}
async function createRemider(e) {
  e.preventDefault();

  embedTask(e);
  console.log("createRemider");
  const token = window.localStorage.getItem("token");

  console.log("createRemider", e);
  const name = e.target.name.value;
  const dateTime = e.target.date.value;
  const description = e.target.description.value;
  const dateInput = new Date(dateTime);
  const date = dateInput.toISOString();

  const data = {
    name,
    date,
    description,
  };

  const response = await fetch(`/api/reminder/create`, {
    method: "POST",
    withCredentials: true,
    credentials: 'same-origin',
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  // const res = JSON.stringify(result);

  

  console.log("response " + result);

  if (result.error  ) {
    console.log("error ", result.error.status);
    return alert(result.error.message);
  }


 
}

async function isAuthenticated(token) {
  const response = await fetch(`/api/reminder/info`, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

async function fetchTaskList() {
  const token = window.localStorage.getItem("token");
  const result = await isAuthenticated(token);
  if (!result.success) {
    window.location.href = "/login";
  }

  console.log("list of tasks ", result.data.job.length);

  const numberOfTasks = result.data.job;

  numberOfTasks.forEach((task) => {
    const $listItem = document.createElement("li");
    $listItem.classList.add("list__item");
    const spaces = "         ";

    $listItem.innerText = ` Name = ${task.name} ,  ${
      "    " + spaces
    } Description  =      ${"   " + task.description} ,  Date =   ${task.date}`;

    $list.appendChild($listItem);
  });
}

const $list = document.querySelector(".list");
const $input = document.querySelector(".input");

fetchTaskList();

// document.addEventListener("click", (e) => {
//   e.preventDefault();

//   if (e.target.matches(".button")) {
//     if (!!$input.value.trim()) {
//       const $listItem = document.createElement("li");
//       $listItem.classList.add("list__item");
//       $listItem.innerText = $input.value.trim();

//       $list.appendChild($listItem);
//     }

//     $input.form.reset();
//     $input.focus();
//   }
// });
