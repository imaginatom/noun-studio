/**
 * Recursively walks a content JSON tree and collects every `path` value from
 * objects shaped like `{ src, path }` produced by the ImageUpload component.
 * Used to diff old vs new content and garbage-collect orphaned storage files
 * at save time.
 */
export const collectImagePaths = (value: unknown): string[] => {
  const paths = new Set<string>()

  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>
      if (typeof record.path === "string" && record.path.length > 0) {
        paths.add(record.path)
      }
      for (const child of Object.values(record)) {
        walk(child)
      }
    }
  }

  walk(value)
  return Array.from(paths)
}

/**
 * Returns the storage paths that exist in `previous` but no longer in `next`.
 * These are the orphaned files that should be removed from storage when
 * persisting `next`.
 */
export const diffOrphanedPaths = (
  previous: unknown,
  next: unknown,
): string[] => {
  const previousPaths = collectImagePaths(previous)
  if (previousPaths.length === 0) {
    return []
  }
  const nextPaths = new Set(collectImagePaths(next))
  return previousPaths.filter((path) => !nextPaths.has(path))
}
