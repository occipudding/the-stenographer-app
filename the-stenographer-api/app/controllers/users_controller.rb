class UsersController < ApplicationController
  def index
    users = User.all
    render json: users.as_json(
      only: [:id, :name]
    )
  end

  def show
    user = User.find(params[:id])
    render json: user.to_json(
      only: [:id, :name]
    )
  end

  def create
    user = User.find_or_create_by(name: params[:username])
    # debugger
    render json: user.to_json(
      only: [:id, :name]
    )
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
  end

end
