class PhotosController < ApplicationController
  before_action :load_event
  before_action :check_authentication

  def index
    @photos = load_photos
    @authenticated = session[:authenticated] == true
  end

  private

  def load_event
    @event = Event.find_by!(slug: params[:event_slug])
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, alert: "Event not found"
  end

  def check_authentication
    @authenticated = session[:authenticated] == true
  end

  def load_photos
    photos_dir = Rails.root.join('app', 'assets', 'images', 'events', @event.slug)

    return [] unless Dir.exist?(photos_dir)

    # Get all image files from the directory
    image_extensions = %w[.jpg .jpeg .png .gif .webp]
    Dir.glob(photos_dir.join('*')).select do |file|
      File.file?(file) && image_extensions.include?(File.extname(file).downcase)
    end.map do |file|
      # Return asset path for use with asset pipeline
      "events/#{@event.slug}/#{File.basename(file)}"
    end.sort_by do |path|
      # Extract the number after the last dash for sorting
      # e.g., "2025_CAVENDISH_LONDON_ROOM 13-241.jpg" -> 241
      basename = File.basename(path, '.*')
      if basename =~ /-(\d+)$/
        $1.to_i
      else
        0
      end
    end
  end
end
