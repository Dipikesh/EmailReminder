const taskForm = document.getElementById("task");
taskForm.addEventListener("submit", createRemider);

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", logoutEventHandler)



async function verifyButton(e) {
  if (e.target.innerText == 'Delete') {
    console.log("delete btn");

  }
  console.log(e.target.innerText);
  
  return;
}





async function logoutEventHandler(e){
  window.localStorage.removeItem('token');
    window.location.href = "/login";

  
}

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
  

  button.innerHTML = "asdasd";
  $listItem.classList.add("list__item");
   $listItem.innerText = ` Name = ${name} ,  Description  =      ${
     "   " + description
   } ,  Date =   ${date} `;
  
const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";

$list.appendChild($listItem);
$list.appendChild(deleteButton);
  
 
  

  // appending button to div
 

  


   // creating button element
   

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

  const response = await fetch(
    `https://emailreminderpikapika.herokuapp.com/api/reminder/create`,
    {
      method: "POST",
      withCredentials: true,
      credentials: "same-origin",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();
  // const res = JSON.stringify(result);

  

  console.log("response " + result);

  if (result.error  ) {
    console.log("error ", result.error.status);
    return alert(result.error.message);
  }


 
}

async function isAuthenticated(token) {
  const response = await fetch(
    `https://emailreminderpikapika.herokuapp.com/api/reminder/info`,
    {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();
  if (result.status == 404)
    return true;
  return result;
}

async function fetchTaskList() {
  const token = window.localStorage.getItem("token");
  const result = await isAuthenticated(token);
  if (!result.success) {
    window.location.href = "/login";
  }
  if (!result.data)
    return true;
  console.log("list of tasks ", result.data.job.length);

  const numberOfTasks = result.data.job;

  numberOfTasks.forEach((task) => {
    const $listItem = document.createElement("li");
  

    $listItem.classList.add("list__item");


    if (task.status) $listItem.style.color = 'blue'
    const date = new Date(task.date);
  
   
    $listItem.innerText = ` Name = ${task.name} , Description  =   ${ task.description} ,  Date =   ${date}`;

   
    

 



    const deleteButton = document.createElement("button");
   const editButton = document.createElement("button");
    
    deleteButton.innerText = "Delete";
    deleteButton.value = task._id;
    deleteButton.classList.add("btn");

    editButton.innerText = "Edit";
    editButton.value = task._id;
    editButton.classList.add("btn");
    
    
    
    $list.appendChild($listItem);
    $list.appendChild(deleteButton);
    $list.appendChild(editButton);



  });
}
   var myDiv = document.getElementById("btn");

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


const wrapper = document.getElementsByClassName("btn");

wrapper.addEventListener("click", verifyButton);