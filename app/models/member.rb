class Member < ApplicationRecord
  # Enums
  enum :status, {
    pending: 0,
    approved: 1,
    rejected: 2,
    payment_pending: 3,
    active: 4
  }, default: :pending

  # Validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, 
                    format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }

  # Normalize email before validation
  before_validation :normalize_email

  private

  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end

