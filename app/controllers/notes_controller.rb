class NotesController < ApplicationController
  before_action :load_event
  before_action :check_authentication, only: [:index]


  PASSCODE = "766613"

  def index
    @notes = @event.notes
    @note = Note.new
    @authenticated = session[:authenticated] == true
  end

  def verify_passcode
    if params[:passcode] == PASSCODE
      session[:authenticated] = true
      session[:authenticated_at] = Time.current
      render json: { success: true }
    else
      render json: { success: false, error: "Incorrect passcode" }, status: :unprocessable_entity
    end
  end

  def create
    @note = @event.notes.build(note_params)

    if @note.save
      redirect_to event_notes_path(@event.slug), notice: "Your note has been posted."
    else
      @notes = @event.notes
      render :index, status: :unprocessable_entity
    end
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

  def note_params
    params.require(:note).permit(:title, :body)
  end
end
