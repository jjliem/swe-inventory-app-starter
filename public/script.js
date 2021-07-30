const addButton = document.getElementById('add-btn');
const badge = document.getElementById('badge');
let count = 0;

addButton.addEventListener('click', (e) => {
    count += 1;
    badge.innerText = count;
})