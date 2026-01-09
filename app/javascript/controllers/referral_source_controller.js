import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["radio", "otherField"]

  toggle(event) {
    if (!this.hasOtherFieldTarget) return

    if (event.target.value === "other") {
      this.otherFieldTarget.classList.remove("hidden")
    } else {
      this.otherFieldTarget.classList.add("hidden")
    }
  }
}
