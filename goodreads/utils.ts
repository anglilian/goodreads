export function getLastName(authorLf: string) {
    if (!authorLf) return '';
    const parts = authorLf.split(',');
    return parts[0].trim();
  }
  
  export function removeTextInsideParentheses(title: string) {
    return title.replace(/\s*\([^)]*\)/g, '').trim();
  }
  
  export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  
  export async function fetchBookCover(isbn?: string, title?: string, authorLf?: string) {
    let query = '';
    if (isbn) {
      query = `isbn:${isbn}`;
    } else if (title && authorLf) {
      const lastName = getLastName(authorLf);
      const cleanedTitle = removeTextInsideParentheses(title);
      query = `intitle:${encodeURIComponent(cleanedTitle)}+inauthor:${encodeURIComponent(lastName)}`;
    } else {
      return null;
    }
  
    let response;
    let data;
    let attempts = 0;
    const maxAttempts = 3;
    const baseDelayMs = 2000;
  
    while (attempts < maxAttempts) {
      try {
        response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&fields=items(volumeInfo/imageLinks/thumbnail)`);
        if (response.status === 429) {
          attempts++;
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : baseDelayMs * attempts;
          await delay(waitTime);
        } else {
          data = await response.json();
          break;
        }
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      }
    }
  
    const book = data?.items ? data.items[0] : null;
    return book?.volumeInfo?.imageLinks?.thumbnail || null;
  }
  