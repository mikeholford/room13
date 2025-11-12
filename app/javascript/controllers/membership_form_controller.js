import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]
  
  static values = {
    storageKey: { type: String, default: "room13_membership_application" }
  }

  connect() {
    this.loadForm()
    this.saveTimeout = null
  }

  disconnect() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }
  }

  saveForm() {
    // Debounce saving to avoid too many localStorage writes
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }

    this.saveTimeout = setTimeout(() => {
      const formData = this.getFormData()
      localStorage.setItem(this.storageKeyValue, JSON.stringify(formData))
    }, 300)
  }

  loadForm() {
    const savedData = localStorage.getItem(this.storageKeyValue)
    
    if (!savedData) return

    try {
      const formData = JSON.parse(savedData)
      this.populateForm(formData)
    } catch (error) {
      console.error('Error loading saved form data:', error)
    }
  }

  getFormData() {
    const formData = {}
    const form = this.element

    // Get all text inputs, textareas, and select fields
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea, select')
    inputs.forEach(input => {
      if (input.name && input.value) {
        formData[input.name] = input.value
      }
    })

    // Get all checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked')
    const checkboxData = {}
    checkboxes.forEach(checkbox => {
      if (checkbox.name) {
        if (!checkboxData[checkbox.name]) {
          checkboxData[checkbox.name] = []
        }
        checkboxData[checkbox.name].push(checkbox.value)
      }
    })

    // Merge checkbox data into formData
    Object.keys(checkboxData).forEach(key => {
      formData[key] = checkboxData[key]
    })

    return formData
  }

  populateForm(formData) {
    const form = this.element

    Object.keys(formData).forEach(key => {
      // Handle regular inputs and selects
      const input = form.querySelector(`[name="${key}"]`)
      
      if (input) {
        if (input.type === 'checkbox') {
          // Handle checkboxes
          const values = Array.isArray(formData[key]) ? formData[key] : [formData[key]]
          values.forEach(value => {
            const checkbox = form.querySelector(`[name="${key}"][value="${value}"]`)
            if (checkbox) {
              checkbox.checked = true
            }
          })
        } else {
          // Handle text inputs, textareas, and selects
          input.value = formData[key]
        }
      } else {
        // Handle multiple checkboxes with array notation in name
        if (Array.isArray(formData[key])) {
          formData[key].forEach(value => {
            const checkbox = form.querySelector(`[name="${key}"][value="${value}"]`)
            if (checkbox) {
              checkbox.checked = true
            }
          })
        }
      }
    })
  }

  clearStorage() {
    // Clear localStorage when form is successfully submitted
    // This will be called on the submit button click
    setTimeout(() => {
      localStorage.removeItem(this.storageKeyValue)
    }, 100)
  }
}

