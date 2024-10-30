{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python311
    pkgs.awscli2
    pkgs.geckodriver
    pkgs.tmux
  ];

  shellHook = ''
    if [ ! -d ".venv" ]; then
      python -m venv .venv
    fi
    source .venv/bin/activate

    if [ -f "requirements.txt" ]; then
      pip install -r requirements.txt
    fi
  '';
}
