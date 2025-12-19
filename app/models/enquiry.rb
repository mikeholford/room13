class Enquiry < ApplicationRecord
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :membership_type, presence: true, inclusion: { in: %w[standard founding] }
end

