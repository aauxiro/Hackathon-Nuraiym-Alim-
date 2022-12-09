


let currentPage = 1;
        let pageTotalCount = 1 
        let paginationList  = document.querySelector('.pagination-list')
        let prev = document.querySelector('.prev') 
        let next = document.querySelector('.next')

function drawPaginationButtons() {
    fetch(`${API}?q=${searchVal}`)
      .then((res) => res.json())
      .then((data) => {
        pageTotalCount = Math.ceil(data.length / 3);

        paginationList.innerHTML = "";
  
        for (let i = 1; i <= pageTotalCount; i++) {
          if (currentPage == i) {
            let page1 = document.createElement("li");
            page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
            paginationList.append(page1)
          }else{
            let page1 = document.createElement("li");
            page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
            paginationList.append(page1)
          }
        }

        if(currentPage == 1){
            prev.classList.add('disabled')
        }else{
            prev.classList.remove('disabled')
        }

        if(currentPage == pageTotalCount){
            next.classList.add('disabled')
        }else{
            next.classList.remove('disabled')
        }
      });
  }


prev.addEventListener('click', ()=>{
    if(currentPage <= 1){
        return
    }
    currentPage--
    render()
})

next.addEventListener('click', ()=>{
    if(currentPage >= pageTotalCount){
        return
    }
    currentPage++
    render()
})

document.addEventListener('click',function(e){
    if (e.target.classList.contains('page_number')){
        currentPage = e.target.innerText
        render();
    }
})
