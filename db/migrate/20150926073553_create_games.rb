class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.references :user, index: true
      t.integer :number
      t.integer :points
      t.timestamp :start_time
      t.timestamp :end_time

      t.timestamps
    end
  end
end
