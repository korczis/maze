defmodule Maze.Router do
  use Maze.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_jwt_auth do
    plug Guardian.Plug.VerifyHeader, realm: "Bearer"
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated,
      handler: Maze.API.V1.AuthController,
      typ: "access"
  end

  scope "/api/v1", as: :api_v1, alias: Maze.API.V1 do
    pipe_through :api

    post "/auth/signin", AuthController, :sign_in
    post "/auth/signup", AuthController, :sign_up

    get "/crawlers", CrawlersController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api/v1", as: :api_v1, alias: Maze.API.V1 do
    pipe_through [:api, :api_jwt_auth]

    # Testing route
    post "/auth/renew_worker_jwt", AuthController, :renew_worker_jwt
    post "/auth/signout", AuthController, :sign_out
    get  "/auth/user", AuthController, :user
  end

  scope "/", Maze do
    pipe_through :browser # Use the default browser stack

    # get "/", PageController, :index
    get "/*path", PageController, :index
  end
end
