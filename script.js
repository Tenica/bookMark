const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = []

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus()
}

//Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => console.log((e.target === modal ? modal.classList.remove('show-modal'): false)));

//Validate Form 
function validate(nameValue, urlValue) {
    const expression = /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        swal({
            title: "Error",
            text: "Please submit values for both fields",
            icon: "error",
          });
        return false;
    }
    else if (!urlValue.match(regex)) {
        swal({
            title: "Error",
            text: "Please provide a valid web address",
            icon: "error",
          });
        return false;
    }
    swal({
        title: 'Success',
        text: `Bookmark ${nameValue} was created successfully`,
        icon: "success"
    })
    return true;
}

// Build Bookmarks DOM 
function buildBookmarks() {
    //Remove all bookmarks elements
    bookmarksContainer.textContent = ''
    //Build items
    bookmarks.forEach((bookmark) => {
      const {name, url} = bookmark
      //item
      const item = document.createElement('div')
      item.classList.add('item');
      //Close Icon
      const closeIcon = document.createElement('i');
      closeIcon.classList.add('fas', 'fa-times');
      closeIcon.setAttribute('title', 'Delete Bookmark')
      closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
      //Favicon/ Link Container
      const linkInfo = document.createElement('div')
      linkInfo.classList.add('name')
      //Favicon
      const favicon = document.createElement('img')
      favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
      favicon.setAttribute('alt', 'Favicon');
      //Link
      const link = document.createElement('a');
      link.setAttribute('href', `${url}`);
      link.setAttribute('target', '_blank');
      link.textContent = name
      //Append to bookmarks container
      linkInfo.append(favicon, link);
      item.append(closeIcon, linkInfo)
      bookmarksContainer.appendChild(item)
    });
}
// Fetch Bookmarks 
function fetchBookmarks() {
    // Get bookmarks from local storage if available
   
    localStorage.getItem('bookmarks') ? 
    bookmarks = JSON.parse(localStorage.getItem('bookmarks')) :
    bookmarks = [{name: 'Chika bookmark', url: 'https://chikaonyema.com'}]; localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    console.log(bookmarks)
    buildBookmarks()
}
//Delete Bookmark
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
      if(bookmark.url === url) {
          bookmarks.splice(i, 1);
  }
  })
  //Update bookmarks array in localStorage, repopulate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  fetchBookmarks();
}

//Handle DATA from Form
function storeBookmark(e) {
    e.preventDefault()
   const nameValue = websiteNameEl.value
   let urlValue = websiteUrlEl.value
   !urlValue.includes('https://') && !urlValue.includes('http://') ?  urlValue = `https://${urlValue}` : null;
   
   validate(nameValue, urlValue)
   if (!validate(nameValue, urlValue)) 
    return false 
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark)
   
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset();
    websiteNameEl.focus()
}
// Event Listener 
bookmarkForm.addEventListener('submit', storeBookmark)

//On Load, Fetch Bookmarks
fetchBookmarks()
