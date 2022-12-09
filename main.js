const API = "http://localhost:8000/product";

let title = document.querySelector("#Title");
let price = document.querySelector("#Prise");
let descr = document.querySelector(
  "#Description"
);
let image = document.querySelector("#Image");
let btnAdd = document.querySelector("#btn-add");

let list = document.querySelector(
  "#products-list"
);

//! переменные инпутов для эдита
let editTitle = document.querySelector(
  "#edit-title"
);
let editPrice = document.querySelector(
  "#edit-price"
);
let editDescr = document.querySelector(
  "#edit-descr"
);
let editImage = document.querySelector(
  "#edit-image"
);
let editSaveBtn =
  document.querySelector("#edit-save");
let exampleModal = document.querySelector(
  "exampleModal"
);

//! search
let searchInp = document.querySelector("#search");
let searchVal = "";

//! pagination
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(
  ".pagination-list"
);

let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

btnAdd.addEventListener(
  "click",
  async function () {
    let obj = {
      title: title.value,
      price: price.value,
      descr: descr.value,
      image: image.value,
    };

    if (
      !obj.title.trim() ||
      !obj.price.trim() ||
      !obj.descr.trim() ||
      !obj.image.trim()
    ) {
      alert("заполните поле");
      return;
    }

    render();
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
      }, //? кодировка
      body: JSON.stringify(obj),
    });

    render();
    title.value = "";
    price.value = "";
    descr.value = "";
    image.value = "";
  }
);

render();
async function render() {
  //?  получаем данные через get запрос из db
  let products = await fetch(
    `${API}?q=${searchVal}&_page=${currentPage}&_limit=3`
  ).then((res) =>
    res.json().catch((err) => console.log(err))
  );

  drawPaginationButtons();

  list.innerHTML = "";

  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `
 <div class="card m-5" style="width: 18rem;">
 <img src=${element.image} class="card-img-top" alt="...">
 <div class="card-body">
   <h5 class="card-title">${element.title}</h5>
   <p class="card-text">${element.descr}</p>
   <a href="#" class="btn btn-primary">${element.price}</a>

   <a href="#" class="btn btn-danger btn-primary btn-delete" id=${element.id}>DELETE</a>
   <a href="#" class="btn btn-primary btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" id=${element.id}>EDIT</a>

 </div>
</div>
 
 `;

    list.append(newElem);
  });
}

//! редактирование продукта
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;

    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editTitle.value = data.title;
        editPrice.value = data.price;
        editDescr.value = data.descr;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener(
  "click",
  function () {
    let id = this.id;

    let title = editTitle.value;
    let price = editPrice.value;
    let descr = editDescr.value;
    let image = editImage.value;

    if (!title || !descr || !price || !image)
      return;

    let editedProduct = {
      title: title,
      price: price,
      descr: descr,
      image: image,
    };
    saveEdit(editedProduct, id);
  }
);

async function saveEdit(editedProduct, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type":
        "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  });
  render();

  let modal =
    bootsrap.Modal.getInstance(exampleModal);
  modal.hide();
}

//? delete function
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => render());
  }
});

//? search

searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});

//? pagination

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);

      paginationList.innerHTML = "";

      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 =
            document.createElement("li");
          page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 =
            document.createElement("li");
          page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("page_number")
  ) {
    currentPage = e.target.innerText;
    render();
  }
});
