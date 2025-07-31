# Commit Staged Files

Commits all currently staged files with a properly formatted commit message following software engineering conventions.

```bash
git commit -m "$(cat <<'EOF'
feat: implement new functionality
EOF
)"
```

Usage: `/commit`

The command will automatically generate an appropriate commit message based on the staged changes and follow conventional commit format (feat/fix/docs/refactor/etc).