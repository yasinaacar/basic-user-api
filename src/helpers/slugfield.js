const slugify=require("slugify");

const slugOptions={
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case
    strict: true,     // strip special characters except replacement, defaults to `false`
    locale: 'tr',      // language code of the locale to use
    trim: true  
};

function slugfield(string){
    return slugify(string, slugOptions);
};

module.exports=slugfield;