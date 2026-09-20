{
  description = "slemmy flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{
      self,
      nixpkgs,
      flake-parts,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];

      perSystem =
        {
          self',
          pkgs,
          lib,
          ...
        }:
        {
          devShells.default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs
              pnpm
            ];

            shellHook = ''
              export PATH="$PATH:$(git rev-parse --show-toplevel)/node_modules/.bin"

              alias npm="echo Use pnpm instead of npm."
              alias npx="echo Use pnpx instead of npx."
            '';
          };
        };
    };
}
