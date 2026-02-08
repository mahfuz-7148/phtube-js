const api_base = 'https://openapi.programming-hero.com/api/phero-tube'

let currentVideos = []
const displayVideos = (categoryVideos) => {
 const videoContainer = document.getElementById('video-container')
  videoContainer.innerHTML = ''
  currentVideos = categoryVideos || []   //dry => dont repeat yourself
  // console.log(currentVideos)
}
const loadCategoryVideos = async (categoryId) => {
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