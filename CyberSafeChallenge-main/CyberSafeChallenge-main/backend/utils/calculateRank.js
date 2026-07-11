/** Assigns competition ranks after results are sorted by score and completion time. */
export function calculateRank(results) {
    return results.map((result, index) => ({ ...result, rank: index + 1 }));
}
