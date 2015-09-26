class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :nik
      t.string :host

      t.timestamps
    end
  end
end
