# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150926073829) do

  create_table "games", force: true do |t|
    t.integer  "user_id"
    t.integer  "number"
    t.integer  "points"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "games", ["user_id"], name: "index_games_on_user_id"

  create_table "steps", force: true do |t|
    t.integer  "game_id"
    t.string   "hash_of_step"
    t.integer  "number"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "steps", ["game_id"], name: "index_steps_on_game_id"

  create_table "users", force: true do |t|
    t.string   "nik"
    t.string   "host"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
