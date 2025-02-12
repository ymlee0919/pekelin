import { createCipheriv, randomBytes, createDecipheriv } from "crypto";

const algorithm = 'aes-256-cbc';

export function crypt(text:string) : string
{
    const key = randomBytes(32);
    const iv = randomBytes(16);

    let cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return [ 
        iv.toString('hex'), 
         key.toString('hex'),
        encrypted.toString('hex') 
    ].join('::')
    
}

export function decrypt(text:string) : string | null
{
    let content = text.split("::")
    
    if(!content)
        return null;

    let iv = Buffer.from(content[0], 'hex');
    let key = Buffer.from(content[1], 'hex');
    let encryptedText = Buffer.from(content[2], 'hex');

    let decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}