class NotesController < ApplicationController
  before_action :load_event

  def index
    @notes = @event.notes
    @note = Note.new
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

  def note_params
    params.require(:note).permit(:title, :body)
  end
end
