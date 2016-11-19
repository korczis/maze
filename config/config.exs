# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

config :guardian, Guardian,
  issuer: "Maze",
  hooks: Maze.GuardianSerializer,
  ttl: {5, :minutes},
  verify_issuer: true,
  secret_key: "Some Super Secret Key",
  serializer: Maze.GuardianSerializer


# General application configuration
config :maze,
  ecto_repos: [Maze.Repo]

# Configures the endpoint
config :maze, Maze.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "dnmevquQdz6lyBwCMVP5MCtJjnSVSLMa0Lm9q/0fugKSrDB1hVhyIWj7icQcyy9x",
  render_errors: [view: Maze.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Maze.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
