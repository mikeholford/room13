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
    end.sort_by { |path| File.basename(path, '.*').to_i }
  end
end
