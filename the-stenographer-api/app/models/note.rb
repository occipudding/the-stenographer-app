class Note < ApplicationRecord
  belongs_to :topic
  has_ancestry
end
