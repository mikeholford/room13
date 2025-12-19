import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "content", "form", "firstName", "lastName", "email", "membershipType", "membershipLabel"]

  connect() {
    // Close modal when clicking outside
    this.modalTarget.addEventListener("click", (event) => {
      if (event.target === this.modalTarget) {
        this.close()
      }
    })

    // Close modal with Escape key
    this.escapeHandler = (event) => {
      if (event.key === "Escape") {
        this.close()
      }
    }
    document.addEventListener("keydown", this.escapeHandler)
  }

  disconnect() {
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler)
    }
  }

  open(event) {
    // Get membership type from the button's data attribute
    const membershipType = event.params.type || "standard"
    
    // Update the hidden field and label
    this.membershipTypeTarget.value = membershipType
    this.membershipLabelTarget.textContent = membershipType === "founding" ? "Founding Membership" : "Standard Membership"
    
    // Clear the form
    this.firstNameTarget.value = ""
    this.lastNameTarget.value = ""
    this.emailTarget.value = ""

    // Show modal with animation
    this.modalTarget.classList.remove("opacity-0", "pointer-events-none")
    this.contentTarget.classList.remove("scale-95")
    this.contentTarget.classList.add("scale-100")
    
    // Prevent body scroll
    document.body.style.overflow = "hidden"

    // Focus the first input
    setTimeout(() => {
      this.firstNameTarget.focus()
    }, 100)
  }

  close() {
    // Hide modal with animation
    this.modalTarget.classList.add("opacity-0", "pointer-events-none")
    this.contentTarget.classList.remove("scale-100")
    this.contentTarget.classList.add("scale-95")
    
    // Restore body scroll
    document.body.style.overflow = "auto"
  }

  submit(event) {
    event.preventDefault()
    
    // Validate form
    if (!this.firstNameTarget.value || !this.lastNameTarget.value || !this.emailTarget.value) {
      return
    }

    // Create a form and submit it to save the enquiry
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/membership/enquiry'
    
    // Add CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    if (csrfToken) {
      const csrfInput = document.createElement('input')
      csrfInput.type = 'hidden'
      csrfInput.name = 'authenticity_token'
      csrfInput.value = csrfToken
      form.appendChild(csrfInput)
    }

    // Add form fields
    const fields = {
      first_name: this.firstNameTarget.value,
      last_name: this.lastNameTarget.value,
      email: this.emailTarget.value,
      membership_type: this.membershipTypeTarget.value
    }

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }
}

