class MembershipsController < ApplicationController
  def index
  end

  def standard
  end

  def founding
  end

  def apply
  end

  def create
    @member = Member.new(member_params)
    
    if @member.save
      MemberMailer.new_application(@member).deliver_now
      redirect_to membership_thank_you_path, notice: "Application submitted successfully!"
    else
      render :apply, status: :unprocessable_entity
    end
  end

  def thank_you
  end

  def create_enquiry
    @enquiry = Enquiry.new(enquiry_params)
    
    if @enquiry.save
      redirect_to membership_apply_path(
        membership_type: @enquiry.membership_type,
        first_name: @enquiry.first_name,
        last_name: @enquiry.last_name,
        email: @enquiry.email
      )
    else
      redirect_back fallback_location: membership_path, alert: "Please fill in all fields correctly."
    end
  end

  private

  def member_params
    params.require(:member).permit(
      :first_name, 
      :last_name,
      :title,
      :nickname, 
      :email,
      :phone_number,
      :membership_type,
      :address_line_1,
      :address_line_2,
      :city,
      :state,
      :postal_code,
      :country,
      :occupation,
      additional_responses: {}
    )
  end

  def enquiry_params
    params.permit(:first_name, :last_name, :email, :membership_type)
  end
end
