class TopicsController < ApplicationController

  def index
    topics = Topic.all
    render json: topics.as_json(
      only: [:id, :title, :tags, :user_id]
    )
  end

  def show
    topic = Topic.find(params[:id])
    render json: topic.to_json(
      only: [:id, :title, :tags, :user_id]
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
