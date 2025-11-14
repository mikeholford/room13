class MemberMailer < ApplicationMailer
  def new_application(member)
    @member = member

    full_name = [member.title, member.first_name, member.last_name].compact.join(" ")

    mail(
      to: ["irene@room13.art", "max@artsvp.com", "mike@artsvp.com"],
      subject: "New Membership Application - #{full_name}"
    )
  end
end
