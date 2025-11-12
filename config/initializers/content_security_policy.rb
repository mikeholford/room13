# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self, :https
    policy.font_src    :self, :https, :data
    policy.img_src     :self, :https, :data, "*.googleapis.com", "*.gstatic.com"
    policy.object_src  :none
    policy.script_src  :self, :https, :unsafe_inline, :unsafe_eval, "*.googleapis.com", "*.gstatic.com"
    policy.style_src   :self, :https, :unsafe_inline, "*.googleapis.com", "*.gstatic.com"
    policy.connect_src :self, :https, "*.googleapis.com", "*.gstatic.com"
    policy.frame_src   "*.google.com"
    # Specify URI for violation reports
    # policy.report_uri "/csp-violation-report-endpoint"
  end

  # Generate session nonces for permitted importmap and inline scripts.
  # Removed style-src from nonces to allow Google Maps inline styles
  config.content_security_policy_nonce_generator = ->(request) { request.session.id.to_s }
  config.content_security_policy_nonce_directives = %w(script-src)

  # Report violations without enforcing the policy.
  # config.content_security_policy_report_only = true
end
