module.exports = function(title) {
    title = title.replace(/ ?\(.*[rR]emaster.*\)/, '');
    let split = title.split(' - ');

    if (split.length > 2 
               && split[split.length-1].toLowerCase().includes('remaster')
               && parseInt(split[split.length-2].toLowerCase())) {
        // form: Title - 2010 - Remaster
        return split.slice(0, split.length-2).join(' - ');
    } else if (split.length > 1 && split[split.length-1].toLowerCase().includes('remaster')) {
        // form Title - Remaster
        return split.slice(0, split.length-1).join(' - ');
    } else if (title.toLowerCase().includes('(remaster)')) {
        // form Title - Remaster
        return title.replace('(Remaster)', '').replace('(remaster)', '');
    } else {
        return title;
    }
};