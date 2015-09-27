class StepController < ApplicationController
  
  protect_from_forgery :except => :new_step 
  
  def initialize
    super
  end
  
  def new_step
    get_option_for_user
    get_option_for_game
    render json: @user
  end
  
  private
    def get_option_for_user
      session[:user_id] ||= User.create(host: request.remote_ip).id
      @user = User.find_by(id: session[:user_id])
    end
    
    def get_option_for_game
      session[:game_id] ||= @user.games.create(number: @user.games.size+1, points: 0).id
      @game = Game.find_by(id: session[:game_id])
      p @game
    end
    
    #def post_params
    #  params.require(:post).permit(:nik, :hash, :published, :points, :number_figure)
    #end
end
