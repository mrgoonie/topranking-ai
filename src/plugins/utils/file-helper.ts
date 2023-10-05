/**
 * Extract file extension from the URL input
 * @param url - Example: https://example.com/path/to/file.jpg?param=value#anchor -> `file.name`
 */
export function getFileExtension(url: string) {
	const matches = url.match(/\.([0-9a-z]+)([\?#].*)?$/i);
	if (matches && matches[1]) return matches[1];
	return null;
}

/**
 * Extract file name without extension from the URL input
 * @param url - Example: https://example.com/path/to/file.jpg?param=value#anchor -> `file.name`
 */
export function getFileNameFromURL(url: string): string | null {
	// Extract everything from the last slash (if present) to either the end, a query parameter (?), or an anchor (#)
	const pathSegmentMatches = url.match(/(?:.*\/)?([^\/\?#]+)([\?#].*)?$/);
	if (!pathSegmentMatches) return null;

	const fullPathSegment = pathSegmentMatches[1];
	// Split by dots to isolate the extension
	const segments = fullPathSegment.split(".");

	if (segments.length > 1) {
		// If there's more than one segment, pop off the extension
		segments.pop();
	}

	// Join back any remaining segments to get the filename without extension
	return segments.join(".");
}
