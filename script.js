const api_base = 'https://openapi.programming-hero.com/api/phero-tube'

let currentVideos = []

const showLoader = () => {
 document.getElementById('loader').classList.remove('hidden')
 document.getElementById('video-container').classList.add('hidden')
}

const hideLoader = () => {
  document.getElementById('loader').classList.add('hidden')
  document.getElementById('video-container').classList.remove('hidden')
}

const createVideoCard = (categoryVideo, index) => {
  console.log(categoryVideo)
  const card = document.createElement('div')
  card.className = "card-hover bg-[#151520] border border-[#2a2a3e] rounded-2xl overflow-hidden animate-fade-in-up"
  card.style.animationDelay = `${index * 0.1}s`
  card.innerHTML = ` 
  <div class="relative h-52 bg-[#0a0a0f] overflow-hidden">
      <img 
        src="${categoryVideo.thumbnail}" 
        alt="${categoryVideo.title || "Video thumbnail"}"
        loading="lazy"
        class="w-full h-full object-cover img-scale"
      />
     
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

      <button 
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
const initialApp = async () => {
 await loadCategories()
}

initialApp()