class Note < ApplicationRecord
  belongs_to :event

  validates :title, presence: true
  validates :body, presence: true

  default_scope -> { order(created_at: :desc) }
end
