let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

// Show entries
function showEntries() {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = '';
    entries.forEach((entry, index) => {
        const div = document.createElement('div');
        div.classList.add('entry');
        div.innerHTML = `
            <h3>${entry.title}</h3>
            <small>${entry.dateTime} | ${entry.category}</small>
            <p>${entry.content}</p>
            <button onclick="editEntry(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Delete</button>
        `;
        entriesDiv.appendChild(div);
    });
}

// Add entry
function addEntry() {
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const category = document.getElementById('categorySelect').value;

    if(title && content){
        const now = new Date();
        const dateTime = now.toLocaleString();
        entries.push({ title, content, dateTime, category });
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        document.getElementById('titleInput').value = '';
        document.getElementById('contentInput').value = '';
        showEntries();
    } else { alert('Please enter both title and content!'); }
}

// Delete
function deleteEntry(index){
    if(confirm('Are you sure to delete this entry?')){
        entries.splice(index,1);
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        showEntries();
    }
}

// Edit
function editEntry(index){
    const entry = entries[index];
    const newTitle = prompt('Edit title:', entry.title);
    const newContent = prompt('Edit content:', entry.content);
    const newCategory = prompt('Edit category (Personal/Work/Ideas):', entry.category);
    if(newTitle && newContent && newCategory){
        const now = new Date();
        const dateTime = now.toLocaleString();
        entries[index] = { title: newTitle, content: newContent, dateTime, category: newCategory };
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        showEntries();
    }
}

// Search
document.getElementById('searchInput').addEventListener('input', e => {
    const searchText = e.target.value.toLowerCase();
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = '';
    entries.forEach((entry, index) => {
        if(entry.title.toLowerCase().includes(searchText) || entry.content.toLowerCase().includes(searchText) || entry.category.toLowerCase().includes(searchText)){
            const div = document.createElement('div');
            div.classList.add('entry');
            div.innerHTML = `
                <h3>${entry.title}</h3>
                <small>${entry.dateTime} | ${entry.category}</small>
                <p>${entry.content}</p>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            `;
            entriesDiv.appendChild(div);
        }
    });
});

// Dark/Light mode
const themeBtn = document.getElementById('themeBtn');
let darkMode = false;
themeBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    if(darkMode){
        document.documentElement.style.setProperty('--bg-color', '#2c2c2c');
        document.documentElement.style.setProperty('--text-color', '#f0f0f0');
        document.documentElement.style.setProperty('--button-bg', '#555');
        document.documentElement.style.setProperty('--button-hover', '#888');
        themeBtn.textContent = "Switch to Light Mode";
    } else {
        document.documentElement.style.setProperty('--bg-color', 'rgba(255,255,255,0.9)');
        document.documentElement.style.setProperty('--text-color', '#333');
        document.documentElement.style.setProperty('--button-bg', '#ff9a9e');
        document.documentElement.style.setProperty('--button-hover', '#fad0c4');
        themeBtn.textContent = "Switch to Dark Mode";
    }
});

// PDF download
document.getElementById('downloadBtn').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    entries.forEach((entry,i)=>{
        doc.setFontSize(14);
        doc.text(`${i+1}. ${entry.title} (${entry.dateTime} | ${entry.category})`, 10, y);
        y+=10;
        doc.setFontSize(12);
        doc.text(entry.content,10,y);
        y+=20;
    });
    doc.save('DigitalDiary.pdf');
});

// Floating hearts
function createHearts(){
    for(let i=0;i<5;i++){
        const heart = document.createElement('div');
        heart.className='heart';
        heart.style.left = Math.random()*window.innerWidth+'px';
        document.body.appendChild(heart);
        setTimeout(()=>{heart.remove();},2000);
    }
}

document.getElementById('addBtn').addEventListener('click', () => {
    addEntry();
    createHearts();
});

// Initial display
showEntries();
