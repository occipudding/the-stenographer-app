class TopicsController < ApplicationController

  def index
    topics = Topic.all
    render json: topics.as_json(
      include: {
        user: {only: [:id, :name]}
      },
      only: [:id, :title, :tags, :user_id]
    )
  end

  def show
    topic = Topic.find(params[:id])
    render json: topic.as_json(
      include: {
        user: {only: [:id, :name]}
      },
      only: [:id, :title, :tags, :user_id]
    )
  end

  def create
    topic = Topic.create(topic_params)
    if topic.valid?
      render json: topic.to_json(
        only: [:id, :title, :tags, :user_id]
      )
    end
  end

  def update
    #form information
  end

  def destroy
    topic = Topic.find(params[:id])
    topic.destroy
  end

  private

  def topic_params
    {
      id: permit_the_params[:id],
      title: permit_the_params[:title],
      tags: convert_tags_params(permit_the_params[:tags]),
      user_id: permit_the_params[:user_id]
    }
  end

  def permit_the_params
    params.require(:topic).permit(:id, :title,:user_id,:tags)
  end

  def convert_tags_params(string)
    string.split(/\s*,\s*/)
  end

end
