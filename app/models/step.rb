class Step < ActiveRecord::Base
  has_many :steps
  belongs_to :game
end
