module.exports = (fn)=>{
      return (req, res, next)=>{
            fn(req, res, next).catch((error)=>{
                  return res.send("Something went wrong.")
            })
      }
}
