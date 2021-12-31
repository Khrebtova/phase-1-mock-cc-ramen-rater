// write your code here
let menu = document.getElementById("ramen-menu")
let details = document.getElementById("ramen-detail")
let rating = document.getElementById('rating-display')
let comment = document.getElementById('comment-display')
let form = document.getElementById("new-ramen")
let editForm = document.getElementById("edit-ramen")
let selectedId = 0
let deleteBtn = document.getElementById('delete')
getAllRamen();

function getAllRamen(){
    menu.innerHTML = ''
    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(data => {
        data.forEach(el => renderRamen(el))
        handleBigPic(data[0])
    })
}

function renderRamen(ramen){
    let img = document.createElement('img')
    img.src = ramen.image
    img.className = 'mini-pic'
    img.id = ramen.id
    img.addEventListener('click', () => handleBigPic(ramen))
    menu.appendChild(img)
}

function handleBigPic(ramen){
    selectedId = ramen.id
    details.innerHTML = `
    <img class="detail-image" src="${ramen.image}" alt="${ramen.name}" />
    <h2 class="name">${ramen.name}</h2>
    <h3 class="restaurant">${ramen.restaurant}</h3>
    `
    rating.textContent = ramen.rating
    comment.textContent = ramen.comment
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit(e)
    form.reset()
})

function handleSubmit(e){
    let newRamen = {
        "name": e.target.name.value,
        "restaurant": e.target.restaurant.value,
        "image": e.target.image.value,
        "rating": e.target.rating.value,
        "comment": e.target['new-comment'].value
    }
    fetch('http://localhost:3000/ramens', {
        method : "POST",
        headers: {
            "Content-type" : "application/json",
            Accept : "application/json"
        },
        body: JSON.stringify(newRamen)
    })
    .then(res => res.json())
    .then(ramen => renderRamen(ramen))
}

editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleUpdateRamen(e)
    editForm.reset()
})

function handleUpdateRamen(e){
    rating.textContent = e.target.rating.value
    comment.textContent = e.target['new-comment'].value
    let updatedRamen = {
        "rating": e.target.rating.value,
        "comment": e.target['new-comment'].value
    }
    fetch(`http://localhost:3000/ramens/${selectedId}`, {
        method : "PATCH",
        headers: {
            "Content-type" : "application/json",
            Accept : "application/json"
        },
        body: JSON.stringify(updatedRamen)
    })
    .then(res => res.json())
    .then(ramen => {
        handleBigPic(ramen)
    })
    getAllRamen()
}

deleteBtn.addEventListener('click', () => handleDelete(selectedId))

function handleDelete(id){
    console.log(id)
    document.getElementById(id).remove()
    fetch(`http://localhost:3000/ramens/${id}`, {
        method : "DELETE",
        headers: {
            "Content-type" : "application/json",
            Accept : "application/json"
        }
    })
    .then(res => res.json())
    .then(data => getAllRamen())
}