import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "content"]

  connect() {
    this.handleKeydown = this.handleKeydown.bind(this)
    this.photos = []
    this.currentIndex = -1
    this.currentType = null
  }

  open(event) {
    const element = event.currentTarget
    const title = element.dataset.expanderTitle
    const body = element.dataset.expanderBody
    const date = element.dataset.expanderDate
    const category = element.dataset.expanderCategory
    const type = element.dataset.expanderType // 'note' or 'photo'

    this.currentType = type

    // If opening a photo, store all photos and current index
    if (type === 'photo') {
      this.photos = Array.from(document.querySelectorAll('.photo-item'))
      this.currentIndex = parseInt(element.dataset.expanderIndex)
    }

    if (type === 'note') {
      this.contentTarget.innerHTML = `
        <div class="torn-edge note-clipping border border-[#d4c5a9] p-8 bg-[#fffcf4] shadow-[4px_4px_12px_rgba(0,0,0,0.3),_8px_8px_24px_rgba(0,0,0,0.2)]">
          <div class="flex justify-between items-start mb-3 pb-2 border-b border-[#d4c5a9]">
            <span class="text-[10px] font-montserrat uppercase tracking-[0.25em] text-[#5a5a5a] bg-[#f5f1e8] px-2 py-1 border border-[#d4c5a9]">
              ${category}
            </span>
          </div>

          <h3 class="font-austin text-2xl md:text-3xl font-bold uppercase mb-6 leading-tight text-[#1a1a1a] tracking-wide">
            ${title}
          </h3>

          <p class="font-austin text-lg md:text-xl leading-[1.6] text-[#2b2b2b] whitespace-pre-wrap mb-6" style="text-align: justify; text-justify: inter-word; hyphens: auto;">
            ${body}
          </p>

          <div class="pt-3 border-t border-[#d4c5a9] flex justify-between items-center">
            <span class="font-montserrat text-xs uppercase tracking-[0.15em] text-[#5a5a5a]">
              ${date}
            </span>
            <span class="text-[#d4c5a9]">✦</span>
          </div>
        </div>
      `
    } else if (type === 'photo') {
      const caption = element.dataset.expanderCaption
      const imageUrl = element.dataset.expanderImage
      this.contentTarget.innerHTML = `
        <div class="flex items-center justify-center h-full w-full">
          <img src="${imageUrl}" class="max-w-[95vw] max-h-[95vh] object-contain" alt="${caption}" />
        </div>
      `
    }

    this.modalTarget.classList.remove("opacity-0", "pointer-events-none")
    document.body.style.overflow = "hidden"

    // Add ESC key listener
    document.addEventListener("keydown", this.handleKeydown)
  }

  close() {
    this.modalTarget.classList.add("opacity-0", "pointer-events-none")
    document.body.style.overflow = "auto"

    // Remove ESC key listener
    document.removeEventListener("keydown", this.handleKeydown)

    // Reset photo navigation state
    this.photos = []
    this.currentIndex = -1
    this.currentType = null
  }

  navigateToPhoto(index) {
    if (index < 0 || index >= this.photos.length) return

    const photo = this.photos[index]
    const imageUrl = photo.dataset.expanderImage
    const caption = photo.dataset.expanderCaption

    this.currentIndex = index

    this.contentTarget.innerHTML = `
      <div class="flex items-center justify-center h-full w-full">
        <img src="${imageUrl}" class="max-w-[95vw] max-h-[95vh] object-contain" alt="${caption}" />
      </div>
    `
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.close()
    } else if (this.currentType === 'photo') {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        const nextIndex = (this.currentIndex + 1) % this.photos.length
        this.navigateToPhoto(nextIndex)
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        const prevIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length
        this.navigateToPhoto(prevIndex)
      }
    }
  }
}
