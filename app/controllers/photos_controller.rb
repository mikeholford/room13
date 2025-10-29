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
    service = PhotoS3Service.new(@event.slug)
    service.list_photos
  end
end
