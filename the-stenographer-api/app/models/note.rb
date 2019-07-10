class Note < ApplicationRecord
  belongs_to :topic
  has_ancestry

  validates :content, presence:true
end
