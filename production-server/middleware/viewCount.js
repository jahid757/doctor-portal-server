let count = 0;
const viewCount = (req,res,next) => {
    count++;
    next();
    console.log(count)
}

module.exports = viewCount;