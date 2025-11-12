import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "search",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country"
  ]

  static values = {
    apiKey: String
  }

  connect() {
    // Initialize on load instead of waiting for click
    this.initAutocomplete()
  }

  async initAutocomplete() {
    // Wait for Google Maps to load
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      setTimeout(() => this.initAutocomplete(), 100)
      return
    }

    // Create the autocomplete element with options
    const autocomplete = new google.maps.places.PlaceAutocompleteElement()
    
    // Replace the input with the autocomplete element
    this.searchTarget.replaceWith(autocomplete)
    
    // Listen for place selection - use 'gmp-select' event
    // Per official docs: https://developers.google.com/maps/documentation/javascript/place-autocomplete-new
    autocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
      // Convert the prediction to a Place object
      const place = placePrediction.toPlace()

      console.log(place)
      
      // Fetch the address components
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress']
      })
      
      // Fill the form
      this.fillForm(place)
    })
  }

  fillForm(place) {
    const components = place.addressComponents
    if (!components) return

    let premise = ''
    let subpremise = ''
    let streetNumber = ''
    let route = ''
    let city = ''
    let state = ''
    let postalCode = ''
    let country = ''

    // Parse address components
    components.forEach(component => {
      const types = component.types
      
      if (types.includes('premise')) {
        premise = component.longText
      }
      if (types.includes('subpremise')) {
        subpremise = component.longText
      }
      if (types.includes('street_number')) {
        streetNumber = component.longText
      }
      if (types.includes('route')) {
        route = component.longText
      }
      if (types.includes('locality')) {
        city = component.longText
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.shortText
      }
      if (types.includes('postal_code')) {
        postalCode = component.longText
      }
      if (types.includes('country')) {
        country = component.longText
      }
    })

    // Fill the fields - handle premise names properly
    if (this.hasAddressLine1Target) {
      let addressLine1 = ''
      
      // If there's a premise/building name, use it for line 1
      if (premise) {
        addressLine1 = subpremise ? `${premise}, ${subpremise}` : premise
      } else {
        // Otherwise use street number + route
        addressLine1 = `${streetNumber} ${route}`.trim()
      }
      
      this.addressLine1Target.value = addressLine1
      this.addressLine1Target.dispatchEvent(new Event('input', { bubbles: true }))
    }
    
    // If there's a premise, put the street in line 2
    if (this.hasAddressLine2Target && premise && route) {
      const streetAddress = `${streetNumber} ${route}`.trim()
      this.addressLine2Target.value = streetAddress
      this.addressLine2Target.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if (this.hasCityTarget) {
      this.cityTarget.value = city
      this.cityTarget.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if (this.hasStateTarget) {
      this.stateTarget.value = state
      this.stateTarget.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if (this.hasPostalCodeTarget) {
      this.postalCodeTarget.value = postalCode
      this.postalCodeTarget.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if (this.hasCountryTarget) {
      // Find matching country in dropdown
      const options = Array.from(this.countryTarget.options)
      const match = options.find(opt => opt.value.toLowerCase() === country.toLowerCase())
      
      if (match) {
        this.countryTarget.value = match.value
      }
      
      this.countryTarget.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}
