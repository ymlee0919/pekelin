
/**
 * Convert a text to url
 * 
 * @param text Text to convert
 * @returns Text converted to url format
 */
export function name2url(text: string) : string {
    
    let hash = {
        ' ': '-', 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'nn'
    }

    let item = text.toLowerCase();
    for(let c of item)
        if(hash.hasOwnProperty(c))
            item = item.replace(c, hash[c]);

    while(item.indexOf('--') != -1)
        item = item.replace('--', '-');

    return item;
}