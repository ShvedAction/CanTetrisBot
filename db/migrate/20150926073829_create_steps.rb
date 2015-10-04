class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.references :game, index: true
      t.string :hash_of_step
      t.integer :number

      t.timestamps
    end
  end
end
