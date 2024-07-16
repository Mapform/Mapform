export function pluralize(singular: string, plural: string, count?: number) {
  if (count === 1) {
    return singular;
  } else {
    return plural;
  }
}
