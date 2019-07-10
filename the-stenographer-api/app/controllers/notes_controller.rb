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

  def create
    #form information
  end

  def update
    #form information
  end

  def destroy
    note = Note.find(params[:id])
    note.destroy
  end

end
