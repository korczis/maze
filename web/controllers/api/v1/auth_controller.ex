defmodule Maze.API.V1.AuthController do
  use Maze.Web, :controller

  require Logger

  alias Maze.User
  alias Maze.Users

  def sign_in(conn, %{"email" => email, "password" => password}) do
    case Users.get(email) do
      {:ok, user} ->
        case Comeonin.Bcrypt.checkpw(password, user.password_hashed) do
          true ->
            new_conn = Guardian.Plug.api_sign_in(conn, user)
            client_jwt = Guardian.Plug.current_token(new_conn)
            new_conn
            |> put_resp_header("authorization", "Bearer #{client_jwt}")
            |> json(profile(user))
          false ->
            failure(conn)
        end
      error ->
        Logger.debug inspect(error)
        Comeonin.Bcrypt.dummy_checkpw()

        conn
        |> put_status(:unauthorized)
        |> json(%{"error": "Invalid username or password"})
      end

  end

  def sign_out(conn, _params) do
    jwt = Guardian.Plug.current_token(conn)
    case jwt do
      {:ok, _} ->
        conn
        |> json(%{"user": nil})
      _ ->
        conn
        |> json(%{"user": nil})
    end
  end

  def sign_up(conn, %{"email" => email, "password" => password}) do
    data = %{"email" => email, "password" => password, "password_confirmation" => password}
    case Users.insert(User.changeset(%User{}, data)) do
      {:ok, user} -> {}
        conn
        |> json(%{"user": %{email: user.email}})
      {:error, changeset} ->
        IO.inspect changeset
        conn
        |> put_status(400)
        |> json(%{"errors": ["Some error ocurred"]})
    end
  end

  def user(conn, _params) do
    conn
    |> json(profile(Guardian.Plug.current_resource(conn)))
  end

  def renew_worker_jwt(conn, _params) do
    {:ok, user} = Users.renew_token(Guardian.Plug.current_resource(conn))
    conn
    |> Guardian.Plug.api_sign_in(user)
    |> json(profile(user))
  end

  defp profile(user) do
    {:ok, worker_jwt, _} = Guardian.encode_and_sign(user, :worker)
    %{"user": %{email: user.email, "workerJWT": worker_jwt}}
  end

  defp failure(conn) do
    conn
    |> put_status(:unauthorized)
    |> json(%{message: "Authentication failed"})
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:unauthorized)
    |> json(%{message: "Authentication required"})
  end
end
