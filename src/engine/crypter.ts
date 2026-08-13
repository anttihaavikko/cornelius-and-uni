export const encrypt = (text: string, key: string): string => {
    const keyLength = key.length;
    return text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) + key.charCodeAt(i % keyLength))).join('');
};

export const decrypt = (text: string, key: string): string => {
    const keyLength = key.length;
    return text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) - key.charCodeAt(i % keyLength))).join('');
};