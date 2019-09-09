# Deepend Wordpress Starter

Welcome to the deepend wordpress

## Setting it up


### 1. Set up wordpress
* Create an empty database
* Copy a file named
	**wp-local-config-sample.php** to **wp-local-config.php** in the same directory
* Replace the settings in this file with your database settings
* Replace site url and home url with the correct url of your local wordpress instance

### 2. Set up a blank theme
* Go to wordpress/wp-content/themes and copy the **wp-base** folder to a new folder in the directory. Rename it to the name of your theme.
* Inside that folder, edit style.css and in the comments replace the details with the details your theme:

	
		/*
		* Theme Name: Deepend Wordpress Starter theme
		* Description: Deepend Wordpress Starter theme
		* Author: Deeepend Melbourne
		*/

* Now in a browser go to your site url/wp-admin, and follow instructions to set up wordpress. 
* Once done, make sure to activate your new theme under 

		Appearence -> Themes

### 3. Install node and packages

Go to a terminal and run the following commands:

	npm install
	npm install -g gulp-cli
	
Make sure you have node version 5.0 + installed to run this. To find this out type

	node --version
	
If you dont have the right version, please download the latest from <https://nodejs.org/en/>


### 4. Configure and run gulp
	
Edit **gulpfile.js/config.js** and replace the global variables with the appropriate config:

	// The name of the theme directory
	var themeName = "wp-base";
	
	// The site url variable for wordpress
	var siteUrl   = "http://localhost:8888/wp-starter/wordpress";
	
	
Now go into the root directory and run gulp:

	gulp
	
	

## Deploying to staging

To deploy staging follow these steps:

* Edit **gulpfile.js/config.js**
* Modify the deploy task dest to match a folder on the apache box
	
		deploy: {
            dest: "~/wp-starter.deependmelbourne.com.au",
            host: "deepend@apache.deependmelbourne.com.au"
        },
        
* Run

		gulp deploy

This will sync everything in the wordpress directory directly to the destination folder. You don't have to worry about overidding any local data as the uploads directory and local config will be excluded.

	
	


## Troubleshooting



Fatal error: Allowed memory size of 134217728 bytes exhausted (tried to allocate 130968 bytes) in /Users/azwier/Sites/chiller_uat_wp/wordpress/wp-content/plugins/timber-library/vendor/twig/twig/lib/Twig/Environment.php on line 272

Answer: Start again and follow the fucking instructions



White screen of death:

1. Carefully check - is there a template for the type of page you're trying to load??











	