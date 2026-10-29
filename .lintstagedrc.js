module.exports = {
  "**/*.(ts|tsx)": () => "bun run typecheck",
  "**/*.(ts|tsx|js)": () => "bun run check:write",
  "**/*.(md|json)": () => "bun run format:write",
};
