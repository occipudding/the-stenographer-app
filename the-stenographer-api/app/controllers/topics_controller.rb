class TopicsController < ApplicationController
  def index
    topics = Topic.all
    render json: topics.as_json(only: [:id, :title, :tags, :user])
  end
end
