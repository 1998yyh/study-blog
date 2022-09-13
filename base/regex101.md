# regex101做题


## 1. Check if a string contains the word word in it (case insensitive). If you have no idea, I guess you could try /word/.

`\b[wWoOrRdD]{4}\b`

## 2. Use substitution to replace every occurrence of the word i with the word I (uppercase, I as in me). E.g.: i''m replacing it. am i not? -> I''m replacing it. am I not?.A regex match is replaced with the text in the Substitution field when using substitution.

`\bi\b`



## 3.With regex you can count the number of matches. Can you make it return the number of uppercase consonants (B,C,D,F,..,X,Y,Z) in a given string? E.g.: it should return 3 with the text ABcDeFO!. Note: Only ASCII. We consider Y to be a consonant!

Example: the regex /./g will return 3 when run against the string abc.

`[B-DF-HJ-NP-TV-Z]`

## 4.Count the number of integers in a given string. Integers are, for example: 1, 2, 65, 2579, etc.

`\d+`

## 5.Find all occurrences of 4 or more whitespace characters in a row throughout the string.

`(?:\s+){4}`

## 6. Oh no! It seems my friends spilled beer all over my keyboard last night and my keys are super sticky now. Some of the time whennn I press a key, I get two duplicates.

`(.)\1\1` 替换为 `$1`


## 7. Validate an IPv4 address. The addresses are four numbered separated by three dots, and can only have a maximum value of 255 in either octet. Start by trying to validate 172.16.254.1.

`^(?:(?:0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])$`

