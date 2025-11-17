class Member < ApplicationRecord
  # Enums
  enum :status, {
    pending: 0,
    approved: 1,
    active: 2,
    rejected: 3,
  }, default: :pending

  enum :membership_type, {
    standard: 0,
    founding: 1,
  }, default: :standard

  # Validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, 
                    format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  validates :phone_number, presence: true

  # Normalize email before validation
  before_validation :normalize_email

  private

  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end


