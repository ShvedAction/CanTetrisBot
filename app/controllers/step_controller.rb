class StepController < ApplicationController
  
  protect_from_forgery :except => [:new_step, :get_game, :edit_game]
  before_action :get_option_for_user, :get_option_for_game
  
  def new_step
    @game.steps.create(params.permit(:hash_of_step).merge({number: @game.steps.size+1}))
    render json: @game
  end
  
  def get_current_game
    render json: @game
  end
  
  def new_game
    session.delete(:user_id)
    redirect_to "/game"
  end
  
  def edit_game
    @game.update(params.permit(:points))
    render json: @game
  end
  
  def game_over
    @game.update(end_time: DateTime.current);
    session.delete(:user_id)
    render json: @game
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
