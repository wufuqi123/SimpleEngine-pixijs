module.exports.trim = (text) => {
    if (text == undefined || text == null) {
        return "";
    }
    text += "";
    return text.replace(/^\s*|\s*$/g, "");
}
module.exports.isEmpty = (text) => {
    text = module.exports.trim(text);
    return text == "";
}