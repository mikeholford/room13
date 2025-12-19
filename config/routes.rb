Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  match "/about" => "statics#about", via: :all, as: :about
  match "/login" => "statics#login", via: :all, as: :login
  match "/events" => "statics#events", via: :all, as: :events

  # Membership routes
  get "/membership" => "memberships#index", as: :membership
  get "/membership/standard" => "memberships#standard", as: :membership_standard
  get "/membership/founding" => "memberships#founding", as: :membership_founding
  get "/membership/apply" => "memberships#apply", as: :membership_apply
  post "/membership/apply" => "memberships#create"
  post "/membership/enquiry" => "memberships#create_enquiry", as: :membership_enquiry
  get "/membership/thank-you" => "memberships#thank_you", as: :membership_thank_you
  
  # Stripe checkout redirects
  get "/membership/checkout/standard" => redirect("https://buy.stripe.com/bJe6oIcNIdUnd6z0w6gIo00")
  get "/membership/checkout/founding" => redirect("https://buy.stripe.com/8x2dRaeVQ2bFd6z3IigIo01")

  # Event notes (Missed Connections)
  get "/:event_slug/" => "notes#index", as: :event_notes
  post "/:event_slug/" => "notes#create"
  post "/:event_slug/verify_passcode" => "notes#verify_passcode", as: :verify_passcode

  # Event photos
  get "/:event_slug/photos" => "photos#index", as: :event_photos

  # Defines the root path route ("/")
  root "statics#index"
end
