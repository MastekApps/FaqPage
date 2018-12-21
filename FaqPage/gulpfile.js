var AuthConfig = require('node-sp-auth-config').AuthConfig;
var spsave = require('spsave').spsave;
var gulp = require('gulp');

var authConfig = new AuthConfig({
    configPath: './config.private.json',
    encryptPassword: true,
    saveConfigOnDisk: true
});

gulp.task('watch', function() {
    gulp.watch(['Scripts/**/*.*'], function (event) {
        authConfig.getContext()
            .then(ctx => {
                console.log(event.path);
                spsave({
                    siteUrl: ctx.siteUrl,
                    notification: true
                }, ctx.authOptions,
                    {
                        glob: event.path,
                        base: 'FaqPage/FaqPage'
                    });
            })
            .catch(function(err) {
                throw err;
            });
        
    });

    gulp.watch(['Pages/**/*.*'], function (event) {
        authConfig.getContext()
            .then(ctx => {
                console.log(event.path);
                spsave({
                        siteUrl: ctx.siteUrl,
                        notification: true
                    }, ctx.authOptions,
                    {
                        glob: event.path,
                        base: 'Pages'
                    });
            })
            .catch(function (err) {
                throw err;
            });

    });
});