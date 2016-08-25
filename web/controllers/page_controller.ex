defmodule Blog.PageController do
  use Blog.Web, :controller

  # `query = from u in User,`部分
  # の`User`が使える為にaliasしている
  alias Blog.User

  # `redirect conn, to: Helpers.user_path(conn, :index)`部分
  # の`Helpers.user_path`が使えるためにaliasをしている
  alias Blog.Router.Helpers

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end

  def login(conn, %{"user" => %{"email" => email, "password" => password}}) do
    query = from u in User,
              where: u.email == ^email,
              where: u.password == ^password,
              select: u.id
    result = Blog.Repo.all(query)

    # ユーザーが存在すればユーザー一覧ページにリダイレクトされます
    case length(result) > 0 do
      true ->
        redirect conn, to: Helpers.user_path(conn, :index)
      false ->
        text conn, "ログイン失敗"
    end
  end
end
