class NotesController < ApplicationController

  def index
    notes = Note.all
    render json: notes.to_json(
      only: [:id, :content, :topic_id, :ancestry]
    )
  end

  def show
    note = Note.find(params[:id])
    render json: note.to_json(
      only: [:id, :content, :topic_id, :ancestry]
    )
  end

  def new
    note = Note.new
  end

  def create
    note = Note.create(note_params)
    if note.valid?
      render json: note.to_json(
        only: [:content, :topic_id, :ancestry]
      )
    end
  end

  def update
    #form information
  end

  def destroy
    note = Note.find(params[:id])
    note.destroy
  end

  private

  def note_params
    params.require(:note).permit(:content, :topic_id, :ancestry)
  end

end
