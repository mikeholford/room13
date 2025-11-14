web: bundle exec puma -C config/puma.rb
release: bundle exec rails db:migrate
background_jobs: bin/rails solid_queue:start