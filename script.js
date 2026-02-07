const api_base = 'https://openapi.programming-hero.com/api/phero-tube'

const displayCategories = (categories = []) => {
 const categoryContainer = document.getElementById('category-container')
 categories.forEach(category => {
   const button = document.createElement('button')
   button.id = `btn-${category.category_id}`
   button.className = "px-6 py-2.5 bg-[#151520] border border-[#2a2a3e] text-gray-300 font-medium rounded-full whitespace-nowrap hover:border-[#ff1f3d] hover:text-white hover:-translate-y-0.5 transition-all duration-300";
   button.textContent = category.category
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