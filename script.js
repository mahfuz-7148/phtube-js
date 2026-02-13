const api_base = 'https://openapi.programming-hero.com/api/phero-tube'

let currentVideos = []
let isSortByViews = false

const showLoader = () => {
 document.getElementById('loader').classList.remove('hidden')
 document.getElementById('video-container').classList.add('hidden')
}

const hideLoader = () => {
  document.getElementById('loader').classList.add('hidden')
  document.getElementById('video-container').classList.remove('hidden')
}

const formatTimeAgo = seconds => {
  if (!seconds) return 'recently uploaded'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}day${days > 1 ? 's' : ''}ago`
  }
  if (hours > 0) {
    return `${hours}hr ${hours > 1 ? 's' : ''} ${minutes}min ago`
  }
}

const formatViews = views => {
  // console.log(views)
  const number = parseInt(views)
  // console.log(number)
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M views`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K views`
  }
 return `${number} views`
}

 window.showDetailModal = async (videoId) => {
  try {
    const response = await fetch(`${api_base}/video/${videoId}`)
    const data = await response.json()
    const {video} = data
    const modalContainer = document.getElementById('modal-container')
    modalContainer.innerHTML = `
    <dialog id="details_modal" class="modal backdrop-blur-sm">
        <div class="modal-box bg-[#151520] border border-[#2a2a3e] rounded-2xl max-w-2xl">
          <h3 class="text-2xl font-bold text-white mb-4">
            ${video.title || "Video Details"}
          </h3>
          
          <img 
            class="w-full max-w-md rounded-xl mb-4 mx-auto" 
            src="${video.thumbnail}" 
            alt="${video.title || "Video thumbnail"}"
          />
          
          <p class="text-gray-300 leading-relaxed mb-6">
            ${video.description || "No description available."}
          </p>
          
          <div class="modal-action">
            <form method="dialog">
              <button class="px-6 py-2.5 bg-[#ff1f3d] text-white font-semibold rounded-lg hover:bg-[#d91932] transition-all duration-300">
                Close
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    `
    document.getElementById('details_modal').showModal()
    // console.log(data)
  }
  catch (e) {
    console.log(e)
  }
}


const createVideoCard = (categoryVideo, index) => {
  // console.log(categoryVideo)
  const card = document.createElement('div')
  card.className = "card-hover bg-[#151520] border border-[#2a2a3e] rounded-2xl overflow-hidden animate-fade-in-up"
  card.style.animationDelay = `${index * 0.1}s`
  const timeAgo = formatTimeAgo(categoryVideo?.others?.posted_date)
  const views = formatViews(categoryVideo?.others?.views)
  card.innerHTML = ` 
  <div class="relative h-52 bg-[#0a0a0f] overflow-hidden">
      <img 
        src="${categoryVideo.thumbnail}" 
        alt="${categoryVideo.title || "Video thumbnail"}"
        loading="lazy"
        class="w-full h-full object-cover img-scale"
      />
      <span class="absolute bottom-3 right-3 px-3 py-1.5 bg-black/85 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
        ${timeAgo}
      </span>
     
    </div>

    <div class="p-4">
      <h3 class="text-base font-semibold text-white mb-3 line-clamp-2 leading-snug">
        ${categoryVideo.title || "Untitled Video"}
      </h3>

      <div class="flex items-center gap-3 mb-2">
        <img 
          class="w-9 h-9 rounded-full border-2 border-[#ff1f3d]" 
          src="${categoryVideo.authors?.[0]?.profile_picture || ""}" 
          alt="${categoryVideo.authors?.[0]?.profile_name || "Author"}"
        />
        <div class="flex items-center gap-2 flex-wrap text-sm text-gray-400">
          <span>${categoryVideo.authors?.[0]?.profile_name || "Unknown"}</span>
  
        </div>
      </div>
      <p class="text-sm text-gray-400 mb-4">${views}</p>
     <button 
        onclick="showDetailModal('${categoryVideo.video_id}')"
        class="w-full px-4 py-2.5 bg-transparent border border-[#2a2a3e] text-gray-300 font-medium rounded-lg hover:bg-[#ff1f3d] hover:border-[#ff1f3d] hover:text-white transition-all duration-300"
      >
        View Details
      </button>
    </div>
  `;
   return card
}

const displayVideos = (categoryVideos) => {
  // console.log(categoryVideos)
  const videoContainer = document.getElementById('video-container')
  videoContainer.innerHTML = ''
  currentVideos = categoryVideos || []   //dry => dont repeat yourself
  // console.log(currentVideos)
  if (!categoryVideos || categoryVideos.length === 0) {
    videoContainer.innerHTML = ` 
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <img src="Icon.png" alt="No content" class="w-32 opacity-50 mb-6" />
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">No Content Found</h2>
        <p class="text-gray-400 text-lg">Try searching for something else or browse different categories</p>
      </div>`
    return
  }

  categoryVideos.forEach((categoryVideo, index) => {
     const videoCard = createVideoCard(categoryVideo, index)
    videoContainer.appendChild(videoCard)
    // console.log(categoryVideo)
  })

}
const loadCategoryVideos = async (categoryId) => {
  showLoader()
  try {
    const response = await fetch(`${api_base}/category/${categoryId}`)
    const data = await response.json()
    const {category} = data
    removeActiveClass()
    const clickedButton = document.getElementById(`btn-${categoryId}`)
    // console.log(clickedButton)
    if (clickedButton) {
      clickedButton.classList.remove("bg-[#151520]", "border", "border-[#2a2a3e]", "text-gray-300");
      clickedButton.classList.add(
        "bg-gradient-primary",
        "shadow-md",
        "shadow-[#ff1f3d]/30",
        "category-btn-active"
      );
    }
    displayVideos(category)
    // console.log(category)
  }
  catch (err) {
    console.error('error loading categories', err)
  }
  finally {
    hideLoader()
  }
}

const displayCategories = (categories = []) => {
 const categoryContainer = document.getElementById('category-container')
  // console.log(categories)
  categories.forEach(category => {
    // console.log(category)
    const button = document.createElement('button')
   button.id = `btn-${category.category_id}`
    // console.log(button.id)
    button.className = "px-6 py-2.5 bg-[#151520] border border-[#2a2a3e] text-gray-300 font-medium rounded-full whitespace-nowrap hover:border-[#ff1f3d] hover:text-white hover:-translate-y-0.5 transition-all duration-300";
   button.textContent = category.category
    // console.log(button.textContent)
    button.onclick = () => loadCategoryVideos(category.category_id)
   categoryContainer.appendChild(button)
   // console.log(button)
 })
}

const loadCategories = async () => {
  try {
    const response = await fetch(`${api_base}/categories`)
    const data = await response.json()
    const {categories} = data
    // console.log(categories)
    displayCategories(categories)
  }
  catch (err) {
    console.error('error loading categories', err)
  }
}

const removeActiveClass = () => {
  const activeBtns = document.querySelectorAll(".category-btn-active");
  // console.log(activeBtns)
  activeBtns.forEach((btn) => {
    // console.log(btn)
    btn.classList.remove(
      "bg-gradient-primary",
      "shadow-md",
      "shadow-[#ff1f3d]/30",
      "category-btn-active"
    );
    btn.classList.add("bg-[#151520]", "border", "border-[#2a2a3e]", "text-gray-300");
  });
}

window.loadVideos = async (searchText = '') => {
  showLoader()
 try {
   const response = await fetch(`${api_base}/videos?title=${searchText}`)
   const data = await response.json()
   const {videos} = data
   removeActiveClass();

   if (searchText === '') {
     const allButton = document.getElementById('btn-all')
     if (allButton){
       allButton.classList.remove("bg-[#151520]", "border", "border-[#2a2a3e]", "text-gray-300");
       allButton.classList.add(
         "bg-gradient-primary",
         "shadow-md",
         "shadow-[#ff1f3d]/30",
         "category-btn-active"
       );
     }
   }
   displayVideos(videos)
   // console.log(videos)
 }
 catch (e) {
   console.error(e)
 }
 finally {
   hideLoader()
 }
}

const setupSearch = () => {
 const searchInput = document.getElementById('searchInput')
  let searchTimeOut
  searchInput.addEventListener('input', e => {
    clearTimeout(searchTimeOut)
  searchTimeOut = setTimeout(() => {
    const searchText = e.target.value.trim()
    loadVideos(searchText)
  }, 500)
  })
}

window.sortVideosByViews = () => {
  isSortByViews = !isSortByViews
  // console.log(isSortByViews)
  const sortVideos = [...currentVideos].sort((a, b) => {
   const viewsA = parseInt(a.others?.views || 0)
   const viewsB = parseInt(b.others?.views || 0)
   return viewsB - viewsA
 })
  displayVideos(sortVideos)
  const message = isSortByViews ?
    'sorted highest' : 'showing original'
  // alert(message)
}

const initialApp = async () => {
 try {
   setupSearch()
   await loadCategories()
   await loadVideos()
 }
 catch (e) {
   console.error(e)
 }
}

initialApp()