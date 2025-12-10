class PhotoS3Service
  CACHE_EXPIRES_IN = 15.minutes
  IMAGE_EXTENSIONS = %w[.jpg .jpeg .png .gif .webp].freeze

  def initialize(event_slug)
    @event_slug = event_slug
    
    # S3 client configuration
    s3_config = {
      access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key),
      region: Rails.application.credentials.dig(:aws, :region)
    }
    
    # Disable SSL verification in development to avoid certificate issues
    s3_config[:ssl_verify_peer] = false if Rails.env.development?
    
    @s3_client = Aws::S3::Client.new(s3_config)
    @bucket_name = Rails.application.credentials.dig(:aws, :bucket)
  end

  def list_photos
    Rails.cache.fetch(cache_key, expires_in: CACHE_EXPIRES_IN) do
      fetch_photos_from_s3
    end
  end

  private

  def fetch_photos_from_s3
    photos = []

    begin
      # List objects in the event's folder
      response = @s3_client.list_objects_v2(
        bucket: @bucket_name,
        prefix: "#{@event_slug}/"
      )

      # Filter for image files and generate signed URLs
      response.contents.each do |object|
        next if object.key == "#{@event_slug}/" # Skip the folder itself

        extension = File.extname(object.key).downcase
        next unless IMAGE_EXTENSIONS.include?(extension)

        photos << {
          key: object.key,
          url: generate_signed_url(object.key),
          filename: File.basename(object.key)
        }
      end

      # Sort by the number in the filename (same logic as before)
      photos.sort_by do |photo|
        basename = File.basename(photo[:filename], '.*')
        if basename =~ /-(\d+)$/
          $1.to_i
        else
          0
        end
      end
    rescue Aws::S3::Errors::ServiceError => e
      Rails.logger.error("S3 Error fetching photos for #{@event_slug}: #{e.message}")
      []
    end
  end

  def generate_signed_url(key)
    signer = Aws::S3::Presigner.new(client: @s3_client)
    signer.presigned_url(
      :get_object,
      bucket: @bucket_name,
      key: key,
      expires_in: 3600 # URL expires in 1 hour
    )
  end

  def cache_key
    "photos/#{@event_slug}/list"
  end
end
