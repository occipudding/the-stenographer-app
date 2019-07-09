class NotesController < ApplicationController
  def index
    notes = Note.all
    render json: notes.to_json(only: [:id, :content, :ancestry])
  end
end
