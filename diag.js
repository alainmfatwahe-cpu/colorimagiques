console.log(JSON.stringify({
  uploadDir: process.env.UPLOAD_DIR,
  cwd: process.cwd(),
  dirExists: require('fs').existsSync('/app/backend/uploads/images'),
  files: require('fs').existsSync('/app/backend/uploads/images') 
    ? require('fs').readdirSync('/app/backend/uploads/images').slice(0, 5) 
    : 'not found'
}, null, 2));
