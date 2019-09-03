export const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;
export const whitespacesRegex = /\s+/;

export const escapeRegexCharacters = (str) => str.replace(specialCharsRegex, '\\$&');
