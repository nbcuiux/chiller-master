var gulp = require('gulp');
var rsync = require('rsyncwrapper');
var path = require('path');
var deployFolder = path.join(__dirname, '../../wordpress/**');
var config = require('../config');
var task = config.tasks.deploy;

gulp.task('deploy', function() {
	console.log("Deploying to staging...");
	rsync({
	    ssh: true,
	    src: deployFolder,
	    dest: task.host + ':' + task.dest,
	    recursive: true,
	    syncDest: true,
	    args: ['--verbose'],
	    exclude: ['uploads', 'wp-local-config.php'],
	  }, function(error, stdout, stderr, cmd) {
	  	  console.log(stdout);
	  });
});