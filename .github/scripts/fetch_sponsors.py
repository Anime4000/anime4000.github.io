"""Write the public GitHub Sponsors of an account to _data/sponsors.json.

Run by .github/workflows/sponsors.yml. Needs only the Python standard library.

Environment:
  GH_TOKEN        any GitHub token; public sponsor data needs no extra scopes
  SPONSORS_LOGIN  the sponsored account (default: Anime4000)
  SPONSORS_OUT    output file (default: _data/sponsors.json)

Only sponsors who chose to be public are listed. GitHub leaves private
sponsors out of the `sponsors` connection on its own.
"""

import json
import os
import sys
import urllib.request

API = "https://api.github.com/graphql"

QUERY = """
query($login: String!, $after: String) {
  user(login: $login) {
    sponsors(first: 100, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        __typename
        ... on User         { login name url avatarUrl(size: 128) }
        ... on Organization { login name url avatarUrl(size: 128) }
      }
    }
  }
}
"""


def graphql(token, variables):
    body = json.dumps({"query": QUERY, "variables": variables}).encode()
    req = urllib.request.Request(
        API,
        data=body,
        headers={
            "Authorization": f"bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "sponsors-to-jekyll-data",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.load(resp)
    if data.get("errors"):
        sys.exit("GitHub API error: " + "; ".join(e.get("message", "?") for e in data["errors"]))
    return data["data"]


def main():
    token = os.environ.get("GH_TOKEN")
    if not token:
        sys.exit("GH_TOKEN is not set")
    login = os.environ.get("SPONSORS_LOGIN", "Anime4000")
    out = os.environ.get("SPONSORS_OUT", "_data/sponsors.json")

    sponsors, after = [], None
    while True:
        user = graphql(token, {"login": login, "after": after})["user"]
        if user is None:
            sys.exit(f"No GitHub user called {login}")
        page = user["sponsors"]
        for node in page["nodes"]:
            if not node or not node.get("login"):
                continue
            sponsors.append({
                "login": node["login"],
                "name": node.get("name") or node["login"],
                "url": node["url"],
                "avatar": node["avatarUrl"],
                "type": "org" if node["__typename"] == "Organization" else "user",
            })
        if not page["pageInfo"]["hasNextPage"]:
            break
        after = page["pageInfo"]["endCursor"]

    # Stable order, so the file only changes when the sponsors do.
    sponsors.sort(key=lambda s: s["login"].lower())

    with open(out, "w", encoding="utf-8", newline="\n") as f:
        json.dump(sponsors, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{len(sponsors)} public sponsor(s) written to {out}")


if __name__ == "__main__":
    main()
