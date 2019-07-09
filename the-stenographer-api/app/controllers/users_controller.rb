class UsersController < ApplicationController
  def index
    users = User.all
    render json: users.as_json(only: [:id, :name])
  end
end
