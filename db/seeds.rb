# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create events
Event.find_or_create_by!(slug: "london") do |event|
  event.name = "London"
end

Event.find_or_create_by!(slug: "paris") do |event|
  event.name = "Paris"
end

# Note: Sample notes are loaded from db/sample_notes.yml directly in the view
# and mixed with user-submitted notes for display
