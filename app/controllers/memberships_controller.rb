class MembershipsController < ApplicationController
  def index
  end

  def apply
  end

  def create
    @member = Member.new(member_params)
    
    if @member.save
      redirect_to membership_thank_you_path, notice: "Application submitted successfully!"
    else
      render :apply, status: :unprocessable_entity
    end
  end

  def thank_you
  end

  private

  def member_params
    params.require(:member).permit(
      :first_name, 
      :last_name, 
      :nickname, 
      :email,
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
end
