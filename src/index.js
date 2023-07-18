let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const OPTIONS = {
  method: 'GET',
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
}
// fetch all the data
fetch('http://localhost:3000/toys', OPTIONS)
.then(response => response.json())
.then(data => data.forEach (data => {
  renderToyData(data)
}
));

// create div class cards for all the toys to go into
function renderToyData(toys) {
  const toyCard = document.createElement('div')
  toyCard.className = "card"
  document.getElementById('toy-collection').append(toyCard)

  const toyName = document.createElement('h2')
  toyName.textContent = toys.name
  toyCard.append(toyName)
  
  const toyImage = document.createElement('img')
  toyImage.className = "toy-avatar"
  toyImage.src = toys.image
  // toyImage.style.width = "200px"
  toyCard.append(toyImage)

  const toyLikes = document.createElement('p')
  toyLikes.textContent = `${toys.likes} Likes`
  toyCard.append(toyLikes)

  const likeButton = document.createElement('button')
  likeButton.setAttribute('id', toys.id) // set the id attribute rather than className
  likeButton.textContent = `Like ❤️`
  toyCard.append(likeButton)

  // create event listener for 'Like' button, and then a fetch('PATCH')
  likeButton.addEventListener('click', (e) => {
    addLikes(e)
  });
}

function addLikes(e) {
  e.preventDefault()
  let likeNum = parseInt(e.target.previousElementSibling.innerText)
    
    const PATCH = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        "likes": likeNum += 1
      }),
    }

    fetch(`http://localhost:3000/toys/${e.target.id}`, PATCH)
    .then (response => response.json())
    .then (newLikeObj => (e.target.previousElementSibling.innerText = `${newLikeObj.likes} Likes`)) //
}

// create an event listener for 'create toy' form, and then a fetch('POST') inside
const toyForm = document.querySelector('.add-toy-form')

toyForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const inputName = e.target["name"].value
  const inputImg = e.target["image"].value

  // take the name + image submitted in the form, and put them into elements
  const POST = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "name": inputName,
      "image": inputImg,
      "likes": 0
    })
  }

  fetch('http://localhost:3000/toys', POST)
  .then (response => response.json())
  .then (data => renderToyData(data))

  toyForm.reset()
})