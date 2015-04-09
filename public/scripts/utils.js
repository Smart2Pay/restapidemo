function contentParse(content){
    content = content.replace(/\n?\r\n/g, '<br />' );
    return content;
}