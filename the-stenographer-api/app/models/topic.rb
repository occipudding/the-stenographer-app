class Topic < ApplicationRecord
  belongs_to :user
  has_many :notes, dependent: :destroy

  serialize :tags, Array

  validates :title, presence:true
  #there should be at least one tag
end
