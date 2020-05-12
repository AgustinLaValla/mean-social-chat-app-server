const firstUpper = (username) => {
    username = username.toLowerCase();
    const nameSplitted = username.split(' ');
    let nameCapitalized = '';
    nameSplitted.forEach((word,idx) => {
        nameCapitalized = (idx < nameSplitted.length - 1) ? nameCapitalized += word.charAt(0).toUpperCase() + word.slice(1) + ' ' 
                                                        : nameCapitalized += word.charAt(0).toUpperCase() + word.slice(1)
    });
    return nameCapitalized;
};



module.exports = { firstUpper }; 