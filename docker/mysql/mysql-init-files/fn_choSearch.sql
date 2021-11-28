CREATE DEFINER=`TILog`@`%` FUNCTION `fn_choSearch`(`str` varchar(20)) RETURNS varchar(100) CHARSET utf8
BEGIN
declare returnStr varchar(100); 
     declare cnt int; 
     declare i int; 
     declare j int; 
     declare tmpStr varchar(10); 
 
     if str is null then 
         return ''; 
     end if; 

     set str = replace(str, ' ', '');
     set cnt = length(str)/3; 
     set i = 1; 
     set j = 1; 
     while i <=cnt DO 
           set tmpStr = substring(str,i,j); 
           set returnStr = concat(ifnull(returnStr,''), 
 
            case when tmpStr rlike '^(ㄱ|ㄲ)' OR ( tmpStr >= '가' AND tmpStr < '나' ) then 'ㄱ' 
                 when tmpStr rlike '^ㄴ' OR ( tmpStr >= '나' AND tmpStr < '다' ) then 'ㄴ' 
                 when tmpStr rlike '^(ㄷ|ㄸ)' OR ( tmpStr >= '다' AND tmpStr < '라' ) then 'ㄷ' 
                 when tmpStr rlike '^ㄹ' OR ( tmpStr >= '라' AND tmpStr < '마' ) then 'ㄹ' 
                 when tmpStr rlike '^ㅁ' OR ( tmpStr >= '마' AND tmpStr < '바' ) then 'ㅁ' 
                 when tmpStr rlike '^ㅂ' OR ( tmpStr >= '바' AND tmpStr < '사' ) then 'ㅂ' 
                 when tmpStr rlike '^(ㅅ|ㅆ)' OR ( tmpStr >= '사' AND tmpStr < '아' ) then 'ㅅ' 
                 when tmpStr rlike '^ㅇ' OR ( tmpStr >= '아' AND tmpStr < '자' ) then 'ㅇ' 
                 when tmpStr rlike '^(ㅈ|ㅉ)' OR ( tmpStr >= '자' AND tmpStr < '차' ) then 'ㅈ' 
                 when tmpStr rlike '^ㅊ' OR ( tmpStr >= '차' AND tmpStr < '카' ) then 'ㅊ' 
                 when tmpStr rlike '^ㅋ' OR ( tmpStr >= '카' AND tmpStr < '타' ) then 'ㅋ' 
                 when tmpStr rlike '^ㅌ' OR ( tmpStr >= '타' AND tmpStr < '파' ) then 'ㅌ' 
                 when tmpStr rlike '^ㅍ' OR ( tmpStr >= '파' AND tmpStr < '하' ) then 'ㅍ' 
                 when tmpStr rlike '^ㅎ' OR ( tmpStr >= '하') then 'ㅎ' end); 
           set i=i+1; 
     end while; 
RETURN returnStr;
END