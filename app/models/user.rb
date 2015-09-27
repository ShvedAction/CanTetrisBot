class User < ActiveRecord::Base
  has_many :games, dependent: :destroy
end
